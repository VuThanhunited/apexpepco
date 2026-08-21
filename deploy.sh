#!/bin/bash
# =============================================
# APEXPEPCO - VPS DEPLOY SCRIPT
# Chạy trên VPS: bash deploy.sh
# =============================================

set -e  # Exit on error

APP_DIR="/root/apexpepco"
NODE_VERSION="20"
REPO="https://github.com/VuThanhunited/apexpepco.git"

echo "======================================"
echo " APEXPEPCO DEPLOY SCRIPT"
echo " $(date)"
echo "======================================"

# 1. Check if app exists
if [ ! -d "$APP_DIR" ]; then
  echo "📦 Cloning repository..."
  git clone $REPO $APP_DIR
else
  echo "📦 Pulling latest code..."
  cd $APP_DIR
  git fetch origin
  git reset --hard origin/main
  git pull origin main
fi

cd $APP_DIR
echo "📁 Working in: $(pwd)"
echo "🔖 Latest commit: $(git log --oneline -1)"

# 2. Install server dependencies
echo ""
echo "📦 Installing server dependencies..."
cd $APP_DIR/server
npm install --production

# 3. Ensure .env exists
if [ ! -f "$APP_DIR/server/.env" ]; then
  echo "⚠️  No .env found. Creating from template..."
  cat > $APP_DIR/server/.env << 'EOF'
PORT=5000
MONGODB_URI=mongodb://vtu21102000:Vuthanh1810%40@ac-hjrte0y-shard-00-00.7t35nab.mongodb.net:27017,ac-hjrte0y-shard-00-01.7t35nab.mongodb.net:27017,ac-hjrte0y-shard-00-02.7t35nab.mongodb.net:27017/apexpepco_db?ssl=true&authSource=admin&replicaSet=atlas-pewl5j-shard-0&retryWrites=true&w=majority
JWT_SECRET=apexpepco_jwt_secret_key_2026_very_long_and_secure
NODE_ENV=production
CLIENT_URL=https://apexpepco.com
ADMIN_URL=https://admin.apexpepco.com
ADMIN_NOTIFY_EMAIL=vtu21102000@gmail.com
EMAIL_USER=vtu21102000@gmail.com
EMAIL_PASS=yfqwyyctowncryac
EMAIL_FROM="Apex PepCo Orders" <vtu21102000@gmail.com>
EOF
else
  echo "✅ .env already exists"
fi

# 4. Install client dependencies and build
echo ""
echo "🔨 Building client (user site)..."
cd $APP_DIR/client
npm install
npm run build

# 5. Install admin dependencies and build
echo ""
echo "🔨 Building admin panel..."
cd $APP_DIR/admin
npm install
npm run build

# 6. Start/Restart with PM2
echo ""
echo "🚀 Starting/Restarting with PM2..."
cd $APP_DIR

if pm2 list | grep -q "apexpepco"; then
  echo "🔄 Restarting existing PM2 process..."
  pm2 restart apexpepco
else
  echo "▶️  Starting new PM2 process..."
  pm2 start server/index.js --name apexpepco --node-args="--max-old-space-size=512"
  pm2 save
fi

pm2 status

# 7. Show app info
echo ""
echo "======================================"
echo " DEPLOY COMPLETE!"
echo "======================================"
echo ""
echo "🌐 Site:  https://apexpepco.com"
echo "🔧 Admin: https://admin.apexpepco.com"
echo "🔌 API:   https://api.apexpepco.com"
echo ""
echo "📊 Test API health:"
echo "  curl http://localhost:5000/api/health"
echo ""
