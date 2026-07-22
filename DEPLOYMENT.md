# Deployment Guide for M-Pesa Backend

## Quick Start

### Local Development
```bash
npm install
npm run dev
```

### Testing the API

#### Test STK Push
```bash
curl -X POST http://localhost:3000/api/stkpush \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "254704146422",
    "amount": 1000
  }'
```

#### Test Health Check
```bash
curl http://localhost:3000/api/health
```

## Production Deployment

### Option 1: Traditional Server (Ubuntu/Debian)

1. **Install Node.js and npm**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. **Install PM2 (Process Manager)**
```bash
sudo npm install -g pm2
```

3. **Setup the application**
```bash
git clone <repository-url> /var/www/mpesa-backend
cd /var/www/mpesa-backend/mpesa_backend
npm install --production
```

4. **Configure environment**
```bash
cp .env.example .env
# Edit .env with production credentials
nano .env
```

5. **Start with PM2**
```bash
pm2 start ecosystem.config.js --env production
pm2 startup
pm2 save
```

6. **Setup Nginx reverse proxy**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

7. **Enable HTTPS (Let's Encrypt)**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Option 2: Docker Deployment

1. **Create Dockerfile** (if not exists)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

2. **Build and run**
```bash
docker build -t mpesa-backend .
docker run -d \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e CONSUMER_KEY=your_key \
  -e CONSUMER_SECRET=your_secret \
  -e SHORTCODE=your_code \
  -e PASSKEY=your_passkey \
  -e CALLBACK_URL=https://your-domain.com/api \
  --name mpesa-backend \
  mpesa-backend
```

### Option 3: Heroku Deployment

1. **Create Procfile**
```
web: node server.js
```

2. **Deploy**
```bash
heroku login
heroku create your-app-name
git push heroku main
heroku config:set NODE_ENV=production
heroku config:set CONSUMER_KEY=your_key
heroku config:set CONSUMER_SECRET=your_secret
# ... set other env vars
```

> Note: This project stores the backend inside the `mpesa_backend` folder. If you connect a GitHub repository directly, set the service or build root to `mpesa_backend` so Heroku/Railway/Render deploys the correct app.

## Monitoring

### Check PM2 Status
```bash
pm2 status
pm2 logs mpesa-backend
```

### View logs
```bash
tail -f /var/www/mpesa-backend/logs/out.log
tail -f /var/www/mpesa-backend/logs/err.log
```

## Environment Variables for Different Stages

### Development (.env.development)
```
NODE_ENV=development
PORT=3000
CONSUMER_KEY=dev_key
CONSUMER_SECRET=dev_secret
SHORTCODE=dev_shortcode
PASSKEY=dev_passkey
CALLBACK_URL=http://localhost:3000/api
```

### Staging (.env.staging)
```
NODE_ENV=staging
PORT=3000
CONSUMER_KEY=staging_key
CONSUMER_SECRET=staging_secret
SHORTCODE=staging_shortcode
PASSKEY=staging_passkey
CALLBACK_URL=https://staging.your-domain.com/api
```

### Production (.env.production)
```
NODE_ENV=production
PORT=3000
CONSUMER_KEY=prod_key
CONSUMER_SECRET=prod_secret
SHORTCODE=prod_shortcode
PASSKEY=prod_passkey
CALLBACK_URL=https://your-domain.com/api
```

## Troubleshooting

### Application won't start
- Check logs: `pm2 logs`
- Verify all env vars are set
- Check port 3000 is not in use

### Callback URL not working
- Ensure CALLBACK_URL is publicly accessible
- Check firewall settings
- Verify domain DNS is correct
- Test with: `curl https://your-domain.com/api/health`

### M-Pesa API Authentication fails
- Verify credentials in .env
- Check consumer key and secret
- Ensure sandbox/production URLs match your M-Pesa account

## Security Best Practices

- ✅ Always use HTTPS in production
- ✅ Keep .env file secure and not in version control
- ✅ Use strong environment variable values
- ✅ Enable firewall rules
- ✅ Monitor logs for suspicious activity
- ✅ Keep dependencies updated
- ✅ Use rate limiting for production
