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

function normalizeDeliveredCups(deliveredCups) {
  const normalizedDeliveredCups = Number(deliveredCups || 1);

  if (!Number.isInteger(normalizedDeliveredCups) || normalizedDeliveredCups <= 0) {
    const error = new Error('Delivery quantity must be a positive whole number.');
    error.code = 'INVALID_DELIVERY_QUANTITY';
    throw error;
  }

  return normalizedDeliveredCups;
}

async function findDeliveryById(database, deliveryId) {
  return get(
    database,
    `SELECT id, customer_id, delivered_cups, balance_after, note, created_by_admin_id,
      delivery_date, voided_at, voided_by_admin_id
     FROM delivery_history
     WHERE id = ?`,
    [deliveryId]
  );
}

async function recordDelivery(database, customerId, deliveredCups, adminUserId, note) {
  const normalizedDeliveredCups = normalizeDeliveredCups(deliveredCups);

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

    if (normalizedDeliveredCups > customer.current_balance) {
      const error = new Error('Cannot record delivery because the quantity is greater than the current balance.');
      error.code = 'INSUFFICIENT_BALANCE';
      error.currentBalance = customer.current_balance;
      error.deliveredCups = normalizedDeliveredCups;
      throw error;
    }

    const balanceAfter = customer.current_balance - normalizedDeliveredCups;

    await run(
      database,
      `UPDATE customer_accounts
       SET current_balance = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND current_balance >= ?`,
      [balanceAfter, customerId, normalizedDeliveredCups]
    );

    const result = await run(
      database,
      `INSERT INTO delivery_history
        (customer_id, delivered_cups, balance_after, note, created_by_admin_id)
       VALUES (?, ?, ?, ?, ?)`,
      [customerId, normalizedDeliveredCups, balanceAfter, String(note || '').trim() || null, adminUserId]
    );

    await run(
      database,
      `INSERT INTO admin_action_logs (admin_user_id, action_type, target_type, target_id, message)
       VALUES (?, ?, ?, ?, ?)`,
      [
        adminUserId,
        'delivery_recorded',
        'customer_account',
        customerId,
        `Recorded ${normalizedDeliveredCups} cup delivery, ${balanceAfter} remaining`
      ]
    );

    await run(database, 'COMMIT', []);
    return {
      id: result.lastID,
      deliveredCups: normalizedDeliveredCups,
      balanceAfter
    };
  } catch (error) {
    await run(database, 'ROLLBACK', []);
    throw error;
  }
}

async function voidDelivery(database, deliveryId, adminUserId) {
  await run(database, 'BEGIN TRANSACTION', []);

  try {
    const delivery = await get(
      database,
      `SELECT id, customer_id, delivered_cups, voided_at
       FROM delivery_history
       WHERE id = ?`,
      [deliveryId]
    );

    if (!delivery) {
      const error = new Error('Delivery was not found.');
      error.code = 'DELIVERY_NOT_FOUND';
      throw error;
    }

    if (delivery.voided_at) {
      const error = new Error('Delivery has already been voided.');
      error.code = 'DELIVERY_ALREADY_VOIDED';
      throw error;
    }

    const customer = await get(
      database,
      'SELECT id, current_balance FROM customer_accounts WHERE id = ?',
      [delivery.customer_id]
    );

    if (!customer) {
      const error = new Error('Customer was not found.');
      error.code = 'CUSTOMER_NOT_FOUND';
      throw error;
    }

    const restoredBalance = Number(customer.current_balance || 0) + Number(delivery.delivered_cups || 0);

    await run(
      database,
      `UPDATE customer_accounts
       SET current_balance = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [restoredBalance, delivery.customer_id]
    );
    await run(
      database,
      `UPDATE delivery_history
       SET voided_at = CURRENT_TIMESTAMP, voided_by_admin_id = ?
       WHERE id = ? AND voided_at IS NULL`,
      [adminUserId, deliveryId]
    );
    await run(
      database,
      `INSERT INTO admin_action_logs (admin_user_id, action_type, target_type, target_id, message)
       VALUES (?, ?, ?, ?, ?)`,
      [
        adminUserId,
        'delivery_voided',
        'delivery_history',
        deliveryId,
        `Voided ${delivery.delivered_cups} cup delivery, ${restoredBalance} restored balance`
      ]
    );

    await run(database, 'COMMIT', []);
    return {
      id: delivery.id,
      customerId: delivery.customer_id,
      deliveredCups: delivery.delivered_cups,
      restoredBalance
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
      d.delivery_date, d.voided_at, d.voided_by_admin_id,
      a.username AS admin_username, va.username AS voided_by_admin_username
     FROM delivery_history d
     JOIN admin_users a ON a.id = d.created_by_admin_id
     LEFT JOIN admin_users va ON va.id = d.voided_by_admin_id
     WHERE d.customer_id = ?
     ORDER BY d.delivery_date DESC, d.id DESC`,
    [customerId]
  );
}

async function listRecentDeliveries(database, limit, offset) {
  return all(
    database,
    `SELECT d.id, d.delivered_cups, d.balance_after, d.note, d.delivery_date,
      d.voided_at, d.voided_by_admin_id,
      c.id AS customer_id, c.name AS customer_name,
      a.username AS admin_username, va.username AS voided_by_admin_username
     FROM delivery_history d
     JOIN customer_accounts c ON c.id = d.customer_id
     JOIN admin_users a ON a.id = d.created_by_admin_id
     LEFT JOIN admin_users va ON va.id = d.voided_by_admin_id
     ORDER BY d.delivery_date DESC, d.id DESC
     LIMIT ?
     OFFSET ?`,
    [limit || 25, offset || 0]
  );
}

module.exports = {
  findDeliveryById,
  listDeliveriesForCustomer,
  listRecentDeliveries,
  normalizeDeliveredCups,
  recordDelivery,
  voidDelivery
};
