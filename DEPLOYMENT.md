# E-Seva Platform — Production Deployment Guide

This guide provides step-by-step instructions for deploying the E-Seva Digital Services application to a production Linux server environment (Ubuntu / Debian / RHEL).

---

## 1. System Requirements

- **Operating System**: Ubuntu 22.04 LTS or Debian 12 recommended
- **Node.js**: v18.x or v20.x LTS
- **Process Manager**: PM2 (`npm install -g pm2`)
- **Web Server & Reverse Proxy**: Nginx with Certbot (Let's Encrypt SSL)
- **RAM**: Minimum 2 GB (4 GB recommended)
- **Disk Space**: Minimum 20 GB SSD

---

## 2. Environment Configuration (`.env`)

Copy `.env.example` to `.env` in the project root:

```bash
cp .env.example .env
```

Configure your production variables:

```env
PORT=5000
NODE_ENV=production
JWT_SECRET=your_long_random_production_jwt_secret_key_32_chars
CORS_ORIGIN=https://eseva.yourdomain.com
ALLOWED_ORIGINS=https://eseva.yourdomain.com

# Payment Gateway Secrets (Live Razorpay Keys)
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_live_razorpay_secret_key
RAZORPAY_WEBHOOK_SECRET=your_configured_webhook_secret_key

# Email SMTP Credentials (Optional - Graceful Fallback if omitted)
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your_smtp_api_key
EMAIL_FROM=noreply@eseva.yourdomain.com
```

---

## 3. Frontend Production Build

Compile the React frontend into static assets:

```bash
npm run build
```

This generates production static assets under `d:/econnect/dist/`.

---

## 4. Node.js Backend Service Setup (PM2)

Start the Node.js API server using PM2 for auto-restart and log management:

```bash
pm2 start server/index.js --name "eseva-backend"
pm2 save
pm2 startup
```

Verify backend health:

```bash
curl http://localhost:5000/api/health
```

Output:
`{"status":"UP","database":"HEALTHY","timestamp":"..."}`

---

## 5. Nginx Reverse Proxy & SSL Setup

Create `/etc/nginx/sites-available/eseva`:

```nginx
server {
    server_name eseva.yourdomain.com;

    # Frontend Static Site
    location / {
        root /var/www/econnect/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API Proxy
    location /api/ {
        proxy_pass http://127.0.0.1:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Uploaded Documents Storage Protection (Disable direct listing)
    location /uploads/ {
        deny all;
        return 403;
    }
}
```

Enable Nginx site & SSL certificate:

```bash
sudo ln -s /etc/nginx/sites-available/eseva /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d eseva.yourdomain.com
```

---

## 6. Payment Webhook Registration

1. Log into your Razorpay Dashboard → **Settings** → **Webhooks**.
2. Add Webhook URL: `https://eseva.yourdomain.com/api/payments/webhook`.
3. Select Events:
   - `payment.captured`
   - `order.paid`
   - `payment.failed`
4. Set Webhook Secret to match `RAZORPAY_WEBHOOK_SECRET` in your `.env` file.

---

## 7. Automated Backups & Maintenance

The platform includes built-in daily automated database and file storage backups (`server/cronJobs.js`).

### Manual CLI Backup
```bash
node server/database/backupManager.js --backup
```

### Manual CLI Restore Procedure
```bash
node server/database/backupManager.js --restore db_backup_2026-09-03T14-10-00.json
```

---

## 8. Emergency Rollback Plan

If a deployment deployment issue occurs:

1. **Revert Frontend Code**: Restore previous `dist/` directory from backup.
2. **Revert Backend Process**: `pm2 restart eseva-backend`.
3. **Restore Database Snapshot**: Run `node server/database/backupManager.js --restore <last_good_backup.json>`.
4. Verify system status via `https://eseva.yourdomain.com/api/health`.
