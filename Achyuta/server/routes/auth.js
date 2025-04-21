// server/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { db } = require('../db');

router.post('/register', async (req, res) => {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
        return res.status(400).json({ error: 'Username/email and password are required' });
    }
    if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

    let user;
        try {
            user = db.prepare('SELECT * FROM users WHERE username = ? OR email = ?').get(usernameOrEmail, usernameOrEmail);
        } catch (dbError) {
            console.error('Database error:', dbError);
            return res.status(500).json({ error: 'Database error' });
        }

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Input validation
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Database query with error handling
        let user;
        try {
            user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
        } catch (dbError) {
            console.error('Database error:', dbError);
            return res.status(500).json({ error: 'Database error' });
        }

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Consider using JWT instead of just user.id
        res.json({ 
            success: true, 
            token: user.id, // Consider using JWT here
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;