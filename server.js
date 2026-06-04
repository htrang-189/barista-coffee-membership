const config = require('./config');
const express = require('express');
const path = require('path');
const session = require('express-session');

const { openDatabase } = require('./database/database');
const { runMigrations } = require('./database/migrations');
const { ensureCsrfToken } = require('./middleware/csrf');
const adminRoutes = require('./routes/admin');
const customerRoutes = require('./routes/customer');

function createApp(options) {
  const appOptions = options || {};
  const app = express();
  const database = appOptions.database || openDatabase(appOptions.databasePath || config.databasePath);
  const isProduction = config.nodeEnv === 'production';

  app.locals.database = database;
  app.locals.migrationsReady = null;

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(
    session({
      name: 'barista.sid',
      secret: appOptions.sessionSecret || config.sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: isProduction
      }
    })
  );
  app.use(ensureCsrfToken);
  app.use(express.static(path.join(__dirname, 'public')));

  app.use(async function waitForMigrations(request, response, next) {
    try {
      if (!app.locals.migrationsReady) {
        app.locals.migrationsReady = runMigrations(database);
      }

      await app.locals.migrationsReady;
      next();
    } catch (error) {
      next(error);
    }
  });

  app.get('/', function handleRootRequest(request, response) {
    response.redirect('/admin/dashboard');
  });

  app.use('/admin', adminRoutes);
  app.use('/customer', customerRoutes);

  app.use(function handleNotFound(request, response) {
    response.status(404).sendFile(path.join(__dirname, 'views', 'shared', '404.html'));
  });

  app.use(function handleError(error, request, response, next) {
    console.error('Unhandled application error:', error);
    response.status(500).sendFile(path.join(__dirname, 'views', 'shared', 'error.html'));
  });

  return app;
}

if (require.main === module) {
  const app = createApp();
  const port = config.port;
  const host = config.host;

  app.listen(port, host, function logStartup() {
    console.log(`Barista Coffee Membership app is running on http://${host}:${port}`);
  });
}

module.exports = {
  createApp
};
