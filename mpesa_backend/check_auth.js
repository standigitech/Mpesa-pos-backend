require('dotenv').config();
const axios = require('axios');

async function checkAuth() {
  const key = process.env.CONSUMER_KEY;
  const secret = process.env.CONSUMER_SECRET;

  if (!key || !secret) {
    throw new Error('Missing CONSUMER_KEY or CONSUMER_SECRET in .env');
  }

  const auth = Buffer.from(`${key}:${secret}`).toString('base64');
  const baseUrl = process.env.MPESA_API_URL || 'https://sandbox.safaricom.co.ke';
  const response = await axios.get(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` },
    timeout: 10000
  });

  if (!response.data?.access_token) {
    throw new Error('Safaricom did not return an access token');
  }

  console.log('Authentication successful.');
}

checkAuth().catch((error) => {
  console.error('Authentication failed:', error.response?.data || error.message);
  process.exitCode = 1;
});
