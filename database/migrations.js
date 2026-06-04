const { getAllRows, runStatement } = require('./database');
const { backfillMissingBalanceAccessTokens } = require('../models/customer-account');

function run(database, sql, params) {
  return new Promise(function runPromise(resolve, reject) {
    runStatement(database, sql, params, function handleRun(error, result) {
      if (error) {
        reject(error);
        return;
      }

      resolve(result);
    });
  });
}

function all(database, sql, params) {
  return new Promise(function allPromise(resolve, reject) {
    getAllRows(database, sql, params, function handleAll(error, rows) {
      if (error) {
        reject(error);
        return;
      }

      resolve(rows || []);
    });
  });
}

async function columnExists(database, tableName, columnName) {
  const columns = await all(database, `PRAGMA table_info(${tableName})`, []);

  return columns.some(function hasColumn(column) {
    return column.name === columnName;
  });
}

async function ensureBalanceAccessTokens(database) {
  const hasTokenColumn = await columnExists(database, 'customer_accounts', 'balance_access_token');

  if (!hasTokenColumn) {
    await run(database, 'ALTER TABLE customer_accounts ADD COLUMN balance_access_token TEXT', []);
  }

  await backfillMissingBalanceAccessTokens(database);
  await run(
    database,
    'CREATE UNIQUE INDEX IF NOT EXISTS idx_customer_accounts_balance_access_token ON customer_accounts(balance_access_token)',
    []
  );
}

async function getTableSql(database, tableName) {
  const rows = await all(
    database,
    `SELECT sql
     FROM sqlite_master
     WHERE type = 'table' AND name = ?`,
    [tableName]
  );

  return rows[0] && rows[0].sql ? rows[0].sql : '';
}

async function rebuildDeliveryHistoryForQuantities(database) {
  await run(database, 'PRAGMA foreign_keys = OFF', []);
  await run(database, 'BEGIN TRANSACTION', []);

  try {
    await run(
      database,
      `CREATE TABLE delivery_history_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER NOT NULL,
        delivered_cups INTEGER NOT NULL DEFAULT 1,
        balance_after INTEGER NOT NULL,
        note TEXT,
        created_by_admin_id INTEGER NOT NULL,
        delivery_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        voided_at TEXT,
        voided_by_admin_id INTEGER,
        FOREIGN KEY (customer_id) REFERENCES customer_accounts(id),
        FOREIGN KEY (created_by_admin_id) REFERENCES admin_users(id),
        FOREIGN KEY (voided_by_admin_id) REFERENCES admin_users(id),
        CHECK (delivered_cups > 0),
        CHECK (balance_after >= 0)
      )`,
      []
    );
    await run(
      database,
      `INSERT INTO delivery_history_new
        (id, customer_id, delivered_cups, balance_after, note, created_by_admin_id, delivery_date, voided_at, voided_by_admin_id)
       SELECT id, customer_id, delivered_cups, balance_after, note, created_by_admin_id, delivery_date,
        NULL AS voided_at, NULL AS voided_by_admin_id
       FROM delivery_history`,
      []
    );
    await run(database, 'DROP TABLE delivery_history', []);
    await run(database, 'ALTER TABLE delivery_history_new RENAME TO delivery_history', []);
    await run(database, 'COMMIT', []);
  } catch (error) {
    await run(database, 'ROLLBACK', []);
    throw error;
  } finally {
    await run(database, 'PRAGMA foreign_keys = ON', []);
  }
}

async function ensureDeliveryHistorySupportsQuantitiesAndVoids(database) {
  const tableSql = await getTableSql(database, 'delivery_history');
  const hasVoidedAtColumn = await columnExists(database, 'delivery_history', 'voided_at');
  const hasSingleCupCheck = tableSql.includes('CHECK (delivered_cups = 1)');

  if (hasSingleCupCheck || !hasVoidedAtColumn) {
    await rebuildDeliveryHistoryForQuantities(database);
  }

  await run(database, 'CREATE INDEX IF NOT EXISTS idx_delivery_history_customer_id ON delivery_history(customer_id)', []);
  await run(database, 'CREATE INDEX IF NOT EXISTS idx_delivery_history_delivery_date ON delivery_history(delivery_date)', []);
}

async function runMigrations(database) {
  await ensureBalanceAccessTokens(database);
  await ensureDeliveryHistorySupportsQuantitiesAndVoids(database);
}

module.exports = {
  ensureBalanceAccessTokens,
  ensureDeliveryHistorySupportsQuantitiesAndVoids,
  runMigrations
};
