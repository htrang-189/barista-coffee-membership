const path = require('path');

require('dotenv').config();

const projectRoot = __dirname;

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3000),
  host: process.env.HOST || '127.0.0.1',
  databasePath: process.env.DATABASE_PATH || path.join(projectRoot, 'database', 'app.db'),
  sessionSecret: process.env.SESSION_SECRET || 'development-session-secret-change-me',
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS || 12)
};

module.exports = config;
