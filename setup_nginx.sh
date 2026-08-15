#!/bin/bash
# =============================================
# APEXPEPCO - NGINX + SSL SETUP SCRIPT
# Chạy một lần trên VPS mới: bash setup_nginx.sh
# =============================================

set -e

echo "======================================"
echo " NGINX + SSL SETUP FOR APEXPEPCO"
echo " $(date)"
echo "======================================"

# 1. Update & install dependencies
echo "📦 Installing nginx, certbot, nodejs..."
apt-get update -qq
apt-get install -y nginx certbot python3-certbot-nginx curl git

# Install Node.js 20 if not present
if ! command -v node &> /dev/null || [[ $(node -v) != v20* ]]; then
  echo "📦 Installing Node.js 20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

# Install PM2 if not present
if ! command -v pm2 &> /dev/null; then
  echo "📦 Installing PM2..."
  npm install -g pm2
  pm2 startup
fi

echo "✅ Node $(node -v), npm $(npm -v), PM2 $(pm2 --version)"

# 2. Configure Nginx
echo ""
echo "🔧 Configuring Nginx..."

# apexpepco.com (main site)
cat > /etc/nginx/sites-available/apexpepco << 'NGINX_MAIN'
server {
    listen 80;
    server_name apexpepco.com www.apexpepco.com;

    # Cloudflare real IP
    set_real_ip_from 103.21.244.0/22;
    set_real_ip_from 103.22.200.0/22;
    set_real_ip_from 103.31.4.0/22;
    set_real_ip_from 104.16.0.0/13;
    set_real_ip_from 104.24.0.0/14;
    set_real_ip_from 108.162.192.0/18;
    set_real_ip_from 131.0.72.0/22;
    set_real_ip_from 141.101.64.0/18;
    set_real_ip_from 162.158.0.0/15;
    set_real_ip_from 172.64.0.0/13;
    set_real_ip_from 173.245.48.0/20;
    set_real_ip_from 188.114.96.0/20;
    set_real_ip_from 190.93.240.0/20;
    set_real_ip_from 197.234.240.0/22;
    set_real_ip_from 198.41.128.0/17;
    real_ip_header CF-Connecting-IP;

    client_max_body_size 20M;

    # Serve uploads directly
    location /uploads/ {
        alias /root/apexpepco/server/uploads/;
        expires 7d;
        add_header Cache-Control "public";
    }

    # Proxy API
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
    }

    # Proxy WebSocket
    location /socket.io/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 86400s;
    }

    # Serve client SPA
    location / {
        root /root/apexpepco/client/dist;
        try_files $uri $uri/ /index.html;
        expires 1d;
    }
}
NGINX_MAIN

# admin.apexpepco.com
cat > /etc/nginx/sites-available/apexpepco-admin << 'NGINX_ADMIN'
server {
    listen 80;
    server_name admin.apexpepco.com;

    # Cloudflare real IP
    set_real_ip_from 103.21.244.0/22;
    set_real_ip_from 172.64.0.0/13;
    set_real_ip_from 173.245.48.0/20;
    set_real_ip_from 104.16.0.0/13;
    real_ip_header CF-Connecting-IP;

    client_max_body_size 20M;

    location /uploads/ {
        alias /root/apexpepco/server/uploads/;
        expires 7d;
    }

    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /socket.io/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }

    location / {
        root /root/apexpepco/admin/dist;
        try_files $uri $uri/ /index.html;
        expires 1d;
    }
}
NGINX_ADMIN

# api.apexpepco.com (API subdomain - optional but recommended)
cat > /etc/nginx/sites-available/apexpepco-api << 'NGINX_API'
server {
    listen 80;
    server_name api.apexpepco.com;

    set_real_ip_from 103.21.244.0/22;
    set_real_ip_from 172.64.0.0/13;
    set_real_ip_from 173.245.48.0/20;
    set_real_ip_from 104.16.0.0/13;
    real_ip_header CF-Connecting-IP;

    client_max_body_size 20M;

    location /uploads/ {
        alias /root/apexpepco/server/uploads/;
        expires 7d;
    }

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
    }
}
NGINX_API

# Enable sites
ln -sf /etc/nginx/sites-available/apexpepco /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/apexpepco-admin /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/apexpepco-api /etc/nginx/sites-enabled/

# Remove default
rm -f /etc/nginx/sites-enabled/default

# Test & reload nginx
echo "🔍 Testing nginx config..."
nginx -t
systemctl reload nginx
echo "✅ Nginx configured"

# 3. SSL Certificates (Cloudflare Origin or Let's Encrypt)
echo ""
echo "🔒 Installing SSL certificates..."
echo "Note: Domain must point to this VPS IP (14.225.210.146)"

# Check if DNS resolves to this VPS
VPS_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s api.ipify.org)
DOMAIN_IP=$(dig +short apexpepco.com A | head -1)

echo "VPS IP: $VPS_IP"
echo "Domain A record: $DOMAIN_IP"

# Since using Cloudflare proxy, SSL handled by Cloudflare
# We just need HTTP on VPS (Cloudflare -> HTTP -> VPS is fine for Flexible SSL)
# For Full SSL: Get origin cert from Cloudflare dashboard instead

echo ""
echo "======================================"
echo " NGINX SETUP COMPLETE!"
echo "======================================"
echo ""
echo "⚠️  Cloudflare SSL Mode: Set to 'Flexible' for now"
echo "   (Cloudflare handles HTTPS, connects to VPS via HTTP)"
echo ""
echo "🌐 Sites enabled:"
echo "  - apexpepco.com     → /root/apexpepco/client/dist"
echo "  - admin.apexpepco.com → /root/apexpepco/admin/dist"
echo "  - api.apexpepco.com  → localhost:5000"
echo ""
echo "Next: Run ./deploy.sh to build and start the app"
echo ""
