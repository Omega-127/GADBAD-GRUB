const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env or .env.example if .env does not exist
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  MONGODB_URI: process.env.MONGODB_URI || '',
  USE_IN_MEMORY_DB: process.env.USE_IN_MEMORY_DB !== 'false',
  RACE_TICK_INTERVAL_MS: parseInt(process.env.RACE_TICK_INTERVAL_MS || process.env.RACE_TICK_MS || '1500', 10),
  DEMO_MODE: process.env.DEMO_MODE !== 'false',
  LLM_API_KEY: process.env.LLM_API_KEY || '',
  LLM_MODEL: process.env.LLM_MODEL || 'gpt-4o-mini',
};

module.exports = env;
