require('dotenv').config();
const http = require('http');
const https = require('https');

const data = JSON.stringify({ TransactionType: 'Test', ResultCode: 0, ResultDesc: 'Simulated' });

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const callbackBase = process.env.CALLBACK_URL;

if (!callbackBase) {
  console.error('Missing CALLBACK_URL in .env');
  process.exit(1);
}

const callbackUrl = new URL(`${callbackBase.replace(/\/$/, '')}/callback`);
const client = callbackUrl.protocol === 'https:' ? https : http;

const req = client.request(callbackUrl, options, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Body:', body);
  });
});

req.on('error', (err) => {
  console.error('Request error:', err.message);
});

req.write(data);
req.end();
