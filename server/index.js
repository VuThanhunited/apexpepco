require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const httpServer = http.createServer(app);

// ── Socket.io ─────────────────────────────────────────────
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

io.on('connection', (socket) => {
  console.log('🔌 WS client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('🔌 WS client disconnected:', socket.id);
  });
});

// Export io để routes có thể emit
app.set('io', io);

// ── Middleware ─────────────────────────────────────────────
app.use(cors({
  origin: (origin, callback) => {
    // Allow all origins in production & development to ensure Render API works smoothly
    return callback(null, true);
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ── Static files (uploads) ────────────────────────────────
app.use('/uploads', express.static(uploadsDir));

// ── Routes ────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/wholesale', require('./routes/wholesale'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/users', require('./routes/users'));
app.use('/api/contact', require('./routes/contact'));

// ── Health check ──────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// ── Serve Client & Admin Static Files in Production (if built) ───
const clientDistPath = path.join(__dirname, '../client/dist');
const adminDistPath = path.join(__dirname, '../admin/dist');

// Admin build static serving (under /admin prefix)
if (fs.existsSync(adminDistPath)) {
  app.use('/admin', express.static(adminDistPath));
}

// Client build static serving
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
}

// List of direct admin routes
const adminRoutes = ['/site-settings', '/products', '/orders', '/users', '/account-settings', '/login'];

// SPA Routing Fallback
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API route not found' });
  }

  // Static file requests (with extension) that weren't found → 404, NOT index.html
  // This prevents "Failed to load resource: status 200" errors in the browser console
  const hasFileExtension = /\.\w{2,5}(\?.*)?$/.test(req.path);
  if (hasFileExtension) {
    return res.status(404).send('Not found');
  }

  const isAdminPath = req.path.startsWith('/admin') || adminRoutes.some(r => req.path === r || req.path.startsWith(r + '/'));

  // Fallback for admin routes
  if (isAdminPath && fs.existsSync(adminDistPath)) {
    return res.sendFile(path.join(adminDistPath, 'index.html'));
  }

  // Fallback for client routes
  if (fs.existsSync(clientDistPath)) {
    return res.sendFile(path.join(clientDistPath, 'index.html'));
  }

  // Fallback for admin if client doesn't exist
  if (fs.existsSync(adminDistPath)) {
    return res.sendFile(path.join(adminDistPath, 'index.html'));
  }

  res.status(404).json({ message: 'Route not found' });
});

// ── Error handler ─────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

// ── MongoDB + Start ───────────────────────────────────────
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in environment variables!');
  process.exit(1);
}

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 15000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  retryWrites: true,
})
  .then(() => {
    console.log('✅ MongoDB connected:', mongoose.connection.host);
    httpServer.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('❌ Full error:', err);
    process.exit(1);
  });

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected');
});
mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB reconnected');
});

