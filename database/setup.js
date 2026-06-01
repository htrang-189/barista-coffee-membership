const fs = require('fs');
const path = require('path');

const config = require('../config');
const { openDatabase } = require('./database');

function setupDatabase() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  fs.mkdirSync(path.dirname(config.databasePath), { recursive: true });

  const database = openDatabase(config.databasePath);

  database.exec(schemaSql, function handleSchemaResult(error) {
    if (error) {
      console.error('Database setup failed:', error.message);
      database.close();
      process.exitCode = 1;
      return;
    }

    console.log(`Database initialized at ${config.databasePath}`);
    database.close();
  });
}

setupDatabase();
