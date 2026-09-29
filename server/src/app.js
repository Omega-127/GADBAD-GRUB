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

// Global Middlewares
app.use(
  cors({
    origin: env.CLIENT_ORIGIN === '*' ? '*' : [env.CLIENT_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'Gadbad Grub Backend API',
    tagline: 'Every Order Is a Race. Every Bite Is a Victory!',
    trackingSource: 'SIMULATOR',
    timestamp: new Date().toISOString(),
  });
});

// Mount API routes
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/races', raceRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/commentary', commentaryRoutes);

// Catch 404
app.use(notFound);

// Central Error Handler
app.use(errorHandler);

module.exports = app;
