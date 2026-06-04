const { getAllRows, getRow } = require('../database/database');

function get(database, sql, params) {
  return new Promise(function getPromise(resolve, reject) {
    getRow(database, sql, params || [], function handleGet(error, row) {
      if (error) {
        reject(error);
        return;
      }

      resolve(row || {});
    });
  });
}

function all(database, sql, params) {
  return new Promise(function allPromise(resolve, reject) {
    getAllRows(database, sql, params || [], function handleAll(error, rows) {
      if (error) {
        reject(error);
        return;
      }

      resolve(rows || []);
    });
  });
}

async function getDashboardMetrics(database) {
  const customerTotals = await get(
    database,
    `SELECT COUNT(*) AS total_customers,
      COALESCE(SUM(current_balance), 0) AS total_outstanding_cups
     FROM customer_accounts`
  );
  const revenueTotals = await get(
    database,
    `SELECT COALESCE(SUM(amount_paid_cents), 0) AS recorded_package_revenue_cents
     FROM package_purchases`
  );
  const deliveryTotals = await get(
    database,
    `SELECT COALESCE(SUM(delivered_cups), 0) AS total_cups_delivered
     FROM delivery_history
     WHERE voided_at IS NULL`
  );
  const bonusTotals = await get(
    database,
    'SELECT COALESCE(SUM(bonus_cups), 0) AS total_bonus_cups FROM package_purchases'
  );
  const lowBalanceCustomers = await all(
    database,
    `SELECT id, name, phone, current_balance
     FROM customer_accounts
     WHERE current_balance <= 5
     ORDER BY current_balance ASC, name COLLATE NOCASE ASC
     LIMIT 10`
  );
  const recentDeliveries = await all(
    database,
    `SELECT d.id, d.delivery_date, d.delivered_cups, d.balance_after, d.note,
      c.id AS customer_id, c.name AS customer_name, a.username AS admin_username
     FROM delivery_history d
     JOIN customer_accounts c ON c.id = d.customer_id
     JOIN admin_users a ON a.id = d.created_by_admin_id
     WHERE d.voided_at IS NULL
     ORDER BY d.delivery_date DESC, d.id DESC
     LIMIT 5`
  );

  return {
    totalCustomers: customerTotals.total_customers || 0,
    totalOutstandingCups: customerTotals.total_outstanding_cups || 0,
    recordedPackageRevenueCents: revenueTotals.recorded_package_revenue_cents || 0,
    totalCupsDelivered: deliveryTotals.total_cups_delivered || 0,
    totalBonusCups: bonusTotals.total_bonus_cups || 0,
    lowBalanceCustomers,
    recentDeliveries
  };
}

module.exports = {
  getDashboardMetrics
};
