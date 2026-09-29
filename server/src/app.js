const express = require('express');
const cors = require('cors');
const env = require('./config/env');

const restaurantRoutes = require('./routes/restaurant.routes');
const orderRoutes = require('./routes/order.routes');
const raceRoutes = require('./routes/race.routes');
const predictionRoutes = require('./routes/prediction.routes');
const leaderboardRoutes = require('./routes/leaderboard.routes');
const rewardRoutes = require('./routes/reward.routes');
const commentaryRoutes = require('./routes/commentary.routes');

const notFound = require('./middleware/notFound.middleware');
const errorHandler = require('./middleware/error.middleware');

const app = express();

// Parse configured origins from CLIENT_ORIGIN (support comma-separated and strip trailing slashes)
const configuredOrigins = (env.CLIENT_ORIGIN || '')
  .split(',')
  .map((o) => o.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const defaultAllowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://localhost:4173',
];

// Global Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server, Render health checks)
      if (!origin) return callback(null, true);

      const cleanOrigin = origin.replace(/\/+$/, '');

      // Allow if CLIENT_ORIGIN is wildcard '*'
      if (env.CLIENT_ORIGIN === '*') {
        return callback(null, true);
      }

      // Allow if explicitly configured or local dev origins
      if (configuredOrigins.includes(cleanOrigin) || defaultAllowedOrigins.includes(cleanOrigin)) {
        return callback(null, true);
      }

      // Allow any Vercel domain (*.vercel.app)
      try {
        const hostname = new URL(origin).hostname;
        if (hostname.endsWith('.vercel.app') || hostname === 'localhost' || hostname === '127.0.0.1') {
          return callback(null, true);
        }
      } catch {
        // Invalid URL format
      }

      // In non-production, be lenient to avoid blocking development
      if (env.NODE_ENV !== 'production') {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoints (support /, /health, and /api/health for Render automated checks)
const healthHandler = (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'Gadbad Grub Backend API',
    tagline: 'Every Order Is a Race. Every Bite Is a Victory!',
    trackingSource: 'SIMULATOR',
    timestamp: new Date().toISOString(),
  });
};

app.get('/', healthHandler);
app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

// Mount API routes
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/races', raceRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/commentary', commentaryRoutes);

// Compatibility route alias for user profile & rewards
app.get('/api/users/:userId/profile', (req, res, next) => {
  req.url = `/user/${req.params.userId}/profile`;
  rewardRoutes(req, res, next);
});
app.get('/api/users/:userId/rewards', (req, res, next) => {
  req.url = `/user/${req.params.userId}`;
  rewardRoutes(req, res, next);
});

// Catch 404
app.use(notFound);

// Central Error Handler
app.use(errorHandler);

module.exports = app;
