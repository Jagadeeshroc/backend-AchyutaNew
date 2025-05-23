const express = require('express');
const path = require('path');
const cors = require('cors');
const { initDB } = require('./db');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const jobRoutes = require('./routes/jobs');
const reviewRoutes = require('./routes/reviews');

const app = express();
const PORT = process.env.PORT || 5000;
require('dotenv').config();

// Middleware - Fixed CORS configuration
app.use(cors({
    origin: [
        'https://achyuta-future-of-hiring.vercel.app',
        'https://jagachyuta-future-of-hiring-vnd2.vercel.app',
        'http://localhost:5173'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

app.options('*', cors()); 
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/jobs', jobRoutes);
app.use('/', reviewRoutes); // reviews are at root because of the jobId path

// Start server
initDB();
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});