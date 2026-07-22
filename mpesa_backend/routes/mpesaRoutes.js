const express = require('express');
const axios = require('axios');
const router = express.Router();

const { stkPush, CallBackURL, ValidationURL } = require('../controllers/mpesaController');

// Auth middleware for M-Pesa token
async function getAuthToken(req, res, next) {
    try {
        const key = process.env.CONSUMER_KEY;
        const secret = process.env.CONSUMER_SECRET;
        const mpesaBaseUrl = process.env.MPESA_API_URL || 'https://sandbox.safaricom.co.ke';

        if (!key || !secret) {
            return res.status(500).json({ 
                error: 'Missing CONSUMER_KEY or CONSUMER_SECRET in configuration' 
            });
        }

        const auth = Buffer.from(`${key}:${secret}`).toString('base64');

        const response = await axios.get(
            `${mpesaBaseUrl}/oauth/v1/generate?grant_type=client_credentials`,
            { 
                headers: { Authorization: `Basic ${auth}` },
                timeout: 10000
            }
        );

        req.token = response.data.access_token;
        next();
    } catch (error) {
        console.error('Authentication Error:', error.response?.data || error.message);
        
        const status = error.response?.status || 400;
        const message = error.response?.data?.error_description || 'Failed to authenticate with Safaricom';
        
        return res.status(status).json({ 
            error: 'Authentication failed',
            details: message
        });
    }
}

// Routes
router.post('/stkpush', getAuthToken, stkPush);
router.post('/callback', CallBackURL);
router.post('/validation', ValidationURL);

// Health check for API
router.get('/health', (req, res) => {
    res.json({ 
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

module.exports = router;
