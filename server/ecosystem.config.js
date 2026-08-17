module.exports = {
  apps: [
    {
      name: 'apexpepco-server',
      script: './index.js',
      cwd: '/var/www/apexpepco/server',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      // Env vars loaded explicitly - no reliance on dotenv CWD
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      env_file: '/var/www/apexpepco/server/.env',
      // Logging
      out_file: '/root/.pm2/logs/apexpepco-server-out.log',
      error_file: '/root/.pm2/logs/apexpepco-server-error.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      // Auto-restart
      autorestart: true,
      max_restarts: 10,
      restart_delay: 3000,
    },
  ],
};
