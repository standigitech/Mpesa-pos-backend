# M-Pesa POS Backend

A Node.js Express backend server for handling M-Pesa payment processing and API interactions.

## Features

- ✅ M-Pesa STK Push integration
- ✅ Callback handling for payment responses
- ✅ OAuth token generation
- ✅ CORS enabled
- ✅ Environment-based configuration
- ✅ Error handling middleware
- ✅ Input validation

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- M-Pesa API credentials (from Safaricom)

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd mpesa_backend
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
```

Edit `.env` with your M-Pesa credentials:
```
NODE_ENV=development
PORT=3000
CONSUMER_KEY=your_consumer_key
CONSUMER_SECRET=your_consumer_secret
SHORTCODE=your_test_till_number
PASSKEY=your_passkey
CALLBACK_URL=http://localhost:3000/api
```

## Development

Run the server in development mode:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## Production Deployment

### Using ngrok (for local testing)
```bash
npm run ngrok
```

### Deployment Steps

1. Update `.env` with production credentials:
   - Set `NODE_ENV=production`
   - Update API URLs to production endpoints
   - Use production M-Pesa credentials
   - Set correct `CALLBACK_URL`

2. Deploy to your server:
```bash
npm install --production
npm start
```

### Managed Platform Deployment

If you deploy from a managed platform like Heroku, Railway, or Render, use the `mpesa_backend` folder as the service root. The app is configured to start with:

```bash
npm start
```

- Heroku: create a new app, connect your repository, and set the project root to `mpesa_backend` if using GitHub integration.
- Railway: add the repo and select `mpesa_backend` as the root directory for the service.
- Render: create a new Web Service, choose `Node` and set the root directory to `mpesa_backend`.

Set these environment variables in the platform's dashboard:

```text
NODE_ENV=production
PORT=3000
CONSUMER_KEY=your_key
CONSUMER_SECRET=your_secret
SHORTCODE=your_shortcode
PASSKEY=your_passkey
CALLBACK_URL=https://your-domain.com/api
MPESA_API_URL=https://api.safaricom.co.ke
```

### Environment-specific Deployment

#### Development
```
NODE_ENV=development
```

#### Staging
```
NODE_ENV=staging
```

#### Production
```
NODE_ENV=production
```

## API Endpoints

### STK Push
**POST** `/api/stkpush`

Request body:
```json
{
  "phone": "254712345678",
  "amount": 1000
}
```

Response:
```json
{
  "MerchantRequestID": "...",
  "CheckoutRequestID": "...",
  "ResponseCode": "0",
  "ResponseDescription": "Success"
}
```

### Callback
**POST** `/api/callback`

Receives M-Pesa payment status updates.

## Testing

Run tests:
```bash
npm test
```

## Troubleshooting

### "Missing CONSUMER_KEY or CONSUMER_SECRET"
- Ensure `.env` file exists and has correct credentials
- Check that `dotenv` is loaded at server startup

### "Failed to authenticate with Safaricom"
- Verify M-Pesa API credentials are correct
- Check API endpoint URLs
- Ensure callback URL is accessible

### "Phone and amount are required"
- Send both `phone` and `amount` in request body
- Phone format: 254712345678 (without +)

## Security Notes

- Never commit `.env` file to version control
- Use HTTPS in production
- Validate all incoming requests
- Keep M-Pesa credentials secure
- Use environment variables for sensitive data

## License

ISC

## Author

Stallen Nyaemo
