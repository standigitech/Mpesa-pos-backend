const http = require('http');
const data = JSON.stringify({ phone: '254704146422', amount: 1 });

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/stkpush',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => (body += chunk));
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
