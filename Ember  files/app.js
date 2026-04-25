require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const server = http.createServer(app);

// ── Socket.io (Phase 3 — real-time chat) ──────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST'],
  },
});

// Track online users per event room
const onlineUsers = {};

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Join an event chat room
  socket.on('join_event', ({ event_id, user }) => {
    socket.join(`event:${event_id}`);
    if (!onlineUsers[event_id]) onlineUsers[event_id] = {};
    onlineUsers[event_id][socket.id] = user;
    io.to(`event:${event_id}`).emit('online_users', Object.values(onlineUsers[event_id]));
    console.log(`User ${user?.username} joined event ${event_id}`);
  });

  // Send a message to event room
  socket.on('send_message', ({ event_id, message }) => {
    io.to(`event:${event_id}`).emit('new_message', {
      ...message,
      created_at: new Date().toISOString(),
    });
  });

  // Typing indicator
  socket.on('typing', ({ event_id, username }) => {
    socket.to(`event:${event_id}`).emit('user_typing', { username });
  });

  socket.on('disconnect', () => {
    // Remove from all event rooms
    Object.keys(onlineUsers).forEach(event_id => {
      if (onlineUsers[event_id][socket.id]) {
        delete onlineUsers[event_id][socket.id];
        io.to(`event:${event_id}`).emit('online_users', Object.values(onlineUsers[event_id]));
      }
    });
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Make io available in controllers if needed
app.set('io', io);

// ── Security & Middleware ──────────────────────────────────────────────────

// Stripe webhook needs raw body BEFORE express.json()
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Health check ───────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'Ember API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/events', require('./routes/events'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/vault', require('./routes/vault'));
app.use('/api/partners', require('./routes/partners'));
app.use('/api/stripe', require('./routes/stripe'));

// ── 404 handler ────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.method} ${req.path} not found` });
});

// ── Global error handler ───────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

// ── Start server ───────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`\n🔥 Ember API running on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = { app, server, io };
