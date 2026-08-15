#!/bin/bash
# =============================================
# QUICK DEPLOY - Chạy trực tiếp trên VPS
# Copy nội dung này vào terminal VPS và chạy
# =============================================

set -e
APP_DIR="/root/apexpepco"

echo "=== APEXPEPCO DEPLOY $(date) ==="

# 1. Pull code mới nhất
cd $APP_DIR
git fetch origin
git reset --hard origin/main
echo "✅ Code: $(git log --oneline -1)"

# 2. Install server deps (chỉ production)
cd $APP_DIR/server
npm install --production --silent
echo "✅ Server deps installed"

# 3. Build client
cd $APP_DIR/client
npm install --silent
npm run build
echo "✅ Client built"

# 4. Build admin
cd $APP_DIR/admin
npm install --silent
npm run build
echo "✅ Admin built"

# 5. Restart PM2
cd $APP_DIR
if pm2 id apexpepco > /dev/null 2>&1; then
  pm2 restart apexpepco
else
  pm2 start server/index.js --name apexpepco
  pm2 save
  pm2 startup
fi

sleep 2
echo ""
echo "=== STATUS ==="
pm2 status
echo ""
echo "=== API HEALTH ==="
curl -s http://localhost:5000/api/health
echo ""
echo "=== DONE ==="
