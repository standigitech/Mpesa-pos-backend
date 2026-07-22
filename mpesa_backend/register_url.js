require('dotenv').config();
const axios = require('axios');

async function getAccessToken() {
  const key = process.env.CONSUMER_KEY;
  const secret = process.env.CONSUMER_SECRET;
  if (!key || !secret) throw new Error('Missing CONSUMER_KEY or CONSUMER_SECRET in .env');

  const auth = Buffer.from(`${key}:${secret}`).toString('base64');
  const mpesaBaseUrl = process.env.MPESA_API_URL || 'https://sandbox.safaricom.co.ke';
  const url = `${mpesaBaseUrl}/oauth/v1/generate?grant_type=client_credentials`;

  const res = await axios.get(url, { headers: { Authorization: `Basic ${auth}` }, timeout: 10000 });
  return res.data.access_token;
}

async function registerUrls() {
  try {
    const token = await getAccessToken();
    const shortCode = process.env.SHORTCODE;
    const callbackBase = process.env.CALLBACK_URL;

    if (!shortCode || !callbackBase) throw new Error('Missing SHORTCODE or CALLBACK_URL in .env');

    const confirmationUrl = `${callbackBase.replace(/\/$/, '')}/callback`;
    const validationUrl = `${callbackBase.replace(/\/$/, '')}/validation`;

    const payload = {
      ShortCode: shortCode,
      ResponseType: 'Completed',
      ConfirmationURL: confirmationUrl,
      ValidationURL: validationUrl
    };

    const mpesaBaseUrl = process.env.MPESA_API_URL || 'https://sandbox.safaricom.co.ke';
    const registerUrl = process.env.MPESA_REGISTER_URL || `${mpesaBaseUrl}/mpesa/c2b/v1/registerurl`;

    console.log('Registering URLs with payload:', payload);

    const resp = await axios.post(registerUrl, payload, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 10000
    });

    console.log('Register response:', resp.data);
  } catch (err) {
    console.error('Registration error:', err.response?.data || err.message);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  registerUrls();
}
