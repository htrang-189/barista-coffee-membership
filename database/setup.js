const fs = require('fs');
const path = require('path');

const config = require('../config');
const { openDatabase } = require('./database');
const { createAdminUser } = require('../models/admin-user');

async function seedInitialAdmin(database) {
  const username = process.env.ADMIN_USERNAME || 'owner';
  const password = process.env.ADMIN_PASSWORD || 'change-me-now';
  const result = await createAdminUser(database, username, password);

  if (result.created) {
    console.log(`Initial admin user created: ${username}`);

    if (!process.env.ADMIN_PASSWORD) {
      console.log('Development admin password: change-me-now');
      console.log('Set ADMIN_PASSWORD before running setup for non-local environments.');
    }
    return;
  }

  console.log(`Initial admin user already exists: ${username}`);
}

function setupDatabase() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  fs.mkdirSync(path.dirname(config.databasePath), { recursive: true });

  const database = openDatabase(config.databasePath);

  database.exec(schemaSql, async function handleSchemaResult(error) {
    if (error) {
      console.error('Database setup failed:', error.message);
      database.close();
      process.exitCode = 1;
      return;
    }

    try {
      await seedInitialAdmin(database);
      console.log(`Database initialized at ${config.databasePath}`);
    } catch (adminError) {
      console.error('Initial admin setup failed:', adminError.message);
      process.exitCode = 1;
    } finally {
      database.close();
    }
  });
}

if (require.main === module) {
  setupDatabase();
}

module.exports = {
  setupDatabase
};
