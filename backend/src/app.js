'use strict';
require('dotenv').config();

const express   = require('express');
const http      = require('http');
const cors      = require('cors');
const helmet    = require('helmet');
const morgan    = require('morgan');
const rateLimit = require('express-rate-limit');
const { Server: SocketServer } = require('socket.io');

const authRoutes    = require('./routes/auth');
const userRoutes    = require('./routes/users');
const eventRoutes   = require('./routes/events');
const postRoutes    = require('./routes/posts');
const partnerRoutes = require('./routes/partners');
const vaultRoutes   = require('./routes/vault');
const stripeRoutes  = require('./routes/stripe');
const { webhook: stripeWebhookHandler } = require('./controllers/stripeController');

const app    = express();
const server = http.createServer(app);
const PORT   = process.env.PORT || 3000;

// fail fast on missing critical env
const REQUIRED_ENV = ['SUPABASE_URL'];
const missingEnv = REQUIRED_ENV.filter((k) => !process.env[k]);
if (missingEnv.length && process.env.NODE_ENV === 'production') {
  console.error(`[boot] Missing required env vars: ${missingEnv.join(', ')}`);
  process.exit(1);
}

// trust the first proxy hop (Railway/Render terminate TLS upstream)
if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);

// stripe webhook needs raw body — must be registered before express.json()
app.post(
  '/api/stripe/webhook',
  express.raw({ type: 'application/json', limit: '1mb' }),
  stripeWebhookHandler,
);

// security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS — explicit origin in prod, never `*` with credentials
const corsOrigins = (process.env.CORS_ORIGIN || '*')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
app.use(cors({
  origin: corsOrigins.length === 1 && corsOrigins[0] === '*' ? true : corsOrigins,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// request log
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// body parsing (after raw stripe handler)
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// global rate limit
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please slow down.' },
});
app.use(globalLimiter);

// stricter limit for auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many auth attempts, please try again later.' },
});

// health check
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    status: 'Ember API is running',
    version: '1.0.0',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// api routes
app.use('/api/auth',     authLimiter, authRoutes);
app.use('/api/users',    userRoutes);
app.use('/api/events',   eventRoutes);
app.use('/api/posts',    postRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/vault',    vaultRoutes);
app.use('/api/stripe',   stripeRoutes);

// 404
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// global error handler — never leak stack traces in prod
app.use((err, _req, res, _next) => {
  console.error('[Unhandled error]', err);
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : (err.message || 'Internal server error'),
  });
});

// socket.io for event chat (Phase 3)
const io = new SocketServer(server, {
  cors: {
    origin: corsOrigins.length === 1 && corsOrigins[0] === '*' ? true : corsOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const onlineUsers = {};

io.on('connection', (socket) => {
  socket.on('join_event', ({ event_id, user }) => {
    if (!event_id) return;
    socket.join(`event:${event_id}`);
    onlineUsers[event_id] ??= {};
    onlineUsers[event_id][socket.id] = user || { username: 'guest' };
    io.to(`event:${event_id}`).emit('online_users', Object.values(onlineUsers[event_id]));
  });

  socket.on('send_message', ({ event_id, message }) => {
    if (!event_id || !message) return;
    io.to(`event:${event_id}`).emit('new_message', {
      ...message,
      created_at: new Date().toISOString(),
    });
  });

  socket.on('typing', ({ event_id, username }) => {
    if (!event_id) return;
    socket.to(`event:${event_id}`).emit('user_typing', { username });
  });

  socket.on('disconnect', () => {
    for (const event_id of Object.keys(onlineUsers)) {
      if (onlineUsers[event_id][socket.id]) {
        delete onlineUsers[event_id][socket.id];
        io.to(`event:${event_id}`).emit('online_users', Object.values(onlineUsers[event_id]));
      }
    }
  });
});

app.set('io', io);

// graceful shutdown
function shutdown(signal) {
  console.log(`[boot] ${signal} received, closing server`);
  io.close(() => {
    server.close(() => process.exit(0));
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));

server.listen(PORT, () => {
  console.log(`\nEmber API listening on http://localhost:${PORT}`);
  console.log(`  health:      /health`);
  console.log(`  environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  cors origin: ${corsOrigins.join(', ') || '(none)'}`);
  if (!process.env.SUPABASE_URL) console.log('  supabase:    NOT CONFIGURED');
});

module.exports = { app, server, io };
