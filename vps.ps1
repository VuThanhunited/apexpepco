# =============================================
# APEXPEPCO - VPS Deploy Helper Script
# Dùng: .\vps.ps1 "lệnh muốn chạy trên VPS"
# Hoặc: .\vps.ps1 deploy   → deploy toàn bộ
# Hoặc: .\vps.ps1 deploy-admin → chỉ rebuild admin
# Hoặc: .\vps.ps1 deploy-client → chỉ rebuild client
# =============================================

$VPS_IP    = "14.225.210.146"
$VPS_USER  = "root"
$VPS_PASS  = "Bz2rmaIPuN39EVPq2479"
$VPS_KEY   = "SHA256:ywalvEC88uoPCDbvYOalS2OmXvAXYhsKGguD5DGYGMo"
$PLINK     = "C:\tools\plink.exe"

function Run-VPS {
    param([string]$cmd)
    & $PLINK -batch -ssh "$VPS_USER@$VPS_IP" -pw $VPS_PASS -hostkey $VPS_KEY $cmd
}

$action = $args[0]

switch ($action) {
    'deploy' {
        Write-Host "🚀 Deploying full stack to VPS..." -ForegroundColor Cyan
        Run-VPS 'cd /var/www/apexpepco && git pull origin main && echo "Git pulled" && cd client && npm install --silent && npm run build && echo "Client built" && cd ../admin && npm install --silent && npm run build && echo "Admin built" && cd ../server && npm install --production --silent && pm2 restart apexpepco-server && echo "Server restarted" && echo "🎉 Deploy complete!"'
    }
    'deploy-admin' {
        Write-Host "🔨 Rebuilding admin panel..." -ForegroundColor Cyan
        Run-VPS 'cd /var/www/apexpepco && git pull origin main && cd admin && npm install --silent && npm run build && echo "Admin deployed!"'
    }
    'deploy-client' {
        Write-Host "🔨 Rebuilding client site..." -ForegroundColor Cyan
        Run-VPS 'cd /var/www/apexpepco && git pull origin main && cd client && npm install --silent && npm run build && echo "Client deployed!"'
    }
    'status' {
        Write-Host "📊 VPS Status..." -ForegroundColor Cyan
        Run-VPS 'pm2 status && echo "---" && nginx -t && echo "---" && df -h /'
    }
    'logs' {
        Write-Host "📋 Server logs..." -ForegroundColor Cyan
        Run-VPS 'pm2 logs apexpepco-server --lines 50 --nostream'
    }
    default {
        if ($action) {
            Write-Host "▶ Running: $action" -ForegroundColor Yellow
            Run-VPS $action
        } else {
            Write-Host "Usage:" -ForegroundColor White
            Write-Host "  .\vps.ps1 deploy          - Deploy toàn bộ"
            Write-Host "  .\vps.ps1 deploy-admin    - Chỉ rebuild admin"
            Write-Host "  .\vps.ps1 deploy-client   - Chỉ rebuild client"
            Write-Host "  .\vps.ps1 status          - Xem trạng thái"
            Write-Host "  .\vps.ps1 logs            - Xem logs"
            Write-Host "  .\vps.ps1 'lệnh tùy ý'   - Chạy lệnh trên VPS"
        }
    }
}
