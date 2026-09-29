const http = require('http');
const app = require('./app');
const env = require('./config/env');
const { connectDB } = require('./config/database');
const seedDatabase = require('./seed/seed');
const raceSimulator = require('./services/raceSimulator.service');

const server = http.createServer(app);

async function startServer() {
  try {
    // 1. Connect to database
    await connectDB();

    // 2. Ensure initial seed data exists
    await seedDatabase({ force: false });

    // 3. Start listening
    server.listen(env.PORT, () => {
      console.log(`=======================================================`);
      console.log(`🏎️  GADBAD GRUB BACKEND SERVER RUNNING`);
      console.log(`📍  Port: ${env.PORT}`);
      console.log(`🚀  Mode: ${env.NODE_ENV}`);
      console.log(`⏱️  Race Tick: ${env.RACE_TICK_INTERVAL_MS}ms`);
      console.log(`📡  Tracking: SIMULATOR (Virtual Demo)`);
      console.log(`🔗  Health Check: http://localhost:${env.PORT}/api/health`);
      console.log(`=======================================================`);
    });
  } catch (err) {
    console.error('Fatal error starting server:', err);
    process.exit(1);
  }
}

// Graceful shutdown handling
function handleShutdown(signal) {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  raceSimulator.stopAll();
  server.close(() => {
    console.log('HTTP server closed. Exiting process.');
    process.exit(0);
  });

  // Force exit if not closed within 5 seconds
  setTimeout(() => {
    console.error('Forcefully exiting...');
    process.exit(1);
  }, 5000);
}

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

if (require.main === module) {
  startServer();
}

module.exports = { server, startServer };
