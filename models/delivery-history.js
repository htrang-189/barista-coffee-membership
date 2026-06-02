const { getAllRows, getRow, runStatement } = require('../database/database');

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

function get(database, sql, params) {
  return new Promise(function getPromise(resolve, reject) {
    getRow(database, sql, params, function handleGet(error, row) {
      if (error) {
        reject(error);
        return;
      }

      resolve(row || null);
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

async function recordDelivery(database, customerId, adminUserId, note) {
  await run(database, 'BEGIN TRANSACTION', []);

  try {
    const customer = await get(
      database,
      'SELECT id, current_balance FROM customer_accounts WHERE id = ?',
      [customerId]
    );

    if (!customer) {
      const error = new Error('Customer was not found.');
      error.code = 'CUSTOMER_NOT_FOUND';
      throw error;
    }

    if (customer.current_balance <= 0) {
      const error = new Error('Cannot record delivery because the current balance is 0.');
      error.code = 'ZERO_BALANCE';
      error.currentBalance = customer.current_balance;
      throw error;
    }

    const balanceAfter = customer.current_balance - 1;

    await run(
      database,
      `UPDATE customer_accounts
       SET current_balance = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND current_balance > 0`,
      [balanceAfter, customerId]
    );

    const result = await run(
      database,
      `INSERT INTO delivery_history
        (customer_id, delivered_cups, balance_after, note, created_by_admin_id)
       VALUES (?, 1, ?, ?, ?)`,
      [customerId, balanceAfter, String(note || '').trim() || null, adminUserId]
    );

    await run(
      database,
      `INSERT INTO admin_action_logs (admin_user_id, action_type, target_type, target_id, message)
       VALUES (?, ?, ?, ?, ?)`,
      [adminUserId, 'delivery_recorded', 'customer_account', customerId, `Recorded 1 cup delivery, ${balanceAfter} remaining`]
    );

    await run(database, 'COMMIT', []);
    return {
      id: result.lastID,
      deliveredCups: 1,
      balanceAfter
    };
  } catch (error) {
    await run(database, 'ROLLBACK', []);
    throw error;
  }
}

async function listDeliveriesForCustomer(database, customerId) {
  return all(
    database,
    `SELECT d.id, d.delivered_cups, d.balance_after, d.note,
      d.delivery_date, a.username AS admin_username
     FROM delivery_history d
     JOIN admin_users a ON a.id = d.created_by_admin_id
     WHERE d.customer_id = ?
     ORDER BY d.delivery_date DESC, d.id DESC`,
    [customerId]
  );
}

async function listRecentDeliveries(database, limit) {
  return all(
    database,
    `SELECT d.id, d.delivered_cups, d.balance_after, d.note, d.delivery_date,
      c.id AS customer_id, c.name AS customer_name, a.username AS admin_username
     FROM delivery_history d
     JOIN customer_accounts c ON c.id = d.customer_id
     JOIN admin_users a ON a.id = d.created_by_admin_id
     ORDER BY d.delivery_date DESC, d.id DESC
     LIMIT ?`,
    [limit || 25]
  );
}

module.exports = {
  listDeliveriesForCustomer,
  listRecentDeliveries,
  recordDelivery
};
