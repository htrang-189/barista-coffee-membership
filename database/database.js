const sqlite3 = require('sqlite3').verbose();

const config = require('../config');

function openDatabase(databasePath) {
  const resolvedDatabasePath = databasePath || config.databasePath;
  const database = new sqlite3.Database(resolvedDatabasePath, function handleOpen(error) {
    if (error) {
      console.error(`Failed to open SQLite database at ${resolvedDatabasePath}:`, error.message);
      return;
    }
  });

  database.run('PRAGMA foreign_keys = ON');
  return database;
}

function runStatement(database, sql, params, callback) {
  const statementParams = params || [];

  database.run(sql, statementParams, function handleRun(error) {
    if (error) {
      console.error('SQLite run failed:', {
        message: error.message,
        sql: sql
      });
    }

    if (callback) {
      callback(error, this);
    }
  });
}

function getRow(database, sql, params, callback) {
  const statementParams = params || [];

  database.get(sql, statementParams, function handleGet(error, row) {
    if (error) {
      console.error('SQLite get failed:', {
        message: error.message,
        sql: sql
      });
    }

    callback(error, row);
  });
}

function getAllRows(database, sql, params, callback) {
  const statementParams = params || [];

  database.all(sql, statementParams, function handleAll(error, rows) {
    if (error) {
      console.error('SQLite all failed:', {
        message: error.message,
        sql: sql
      });
    }

    callback(error, rows);
  });
}

module.exports = {
  openDatabase,
  runStatement,
  getRow,
  getAllRows
};
