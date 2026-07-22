require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mpesaRoutes = require('./routes/mpesaRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ 
        message: 'M-Pesa backend is running',
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0'
    });
});

// API Routes
app.use('/api', mpesaRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({ 
        error: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, () => {
    console.log(`[${NODE_ENV.toUpperCase()}] Backend Server running on port ${PORT}`);
    console.log(`Server started at ${new Date().toISOString()}`);
});