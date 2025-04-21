const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { db } = require('../db'); // Make sure db is imported correctly

// REGISTER ROUTE
router.post('/register', async (req, res) => {
    try {
      const username = req.body.username.trim();
      const email = req.body.email.trim();
      const password = req.body.password;
  
      console.log("Registering:", { username, email, password });
  
      if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
      }
  
      if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters' });
      }
  
      console.log("Checking if user exists:", username, email);
      const stmt = db.prepare('SELECT * FROM users WHERE username = ? OR email = ?');
      const existingUser = stmt.get(username, email);
      console.log("Found user:", existingUser);
  
      if (existingUser) {
        return res.status(400).json({ error: 'Username or email already exists' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const result = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)').run(username, email, hashedPassword);
  
      res.status(201).json({ success: true, userId: result.lastInsertRowid });
  
    } catch (err) {
      console.error('Error in /auth/register:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

// LOGIN ROUTE
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Retrieve user from DB
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    if (!user.password) {
      return res.status(500).json({ error: 'Stored password is missing' });
    }

    // Compare password
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect password' });
    }

    // Success
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
