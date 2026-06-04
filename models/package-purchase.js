const { getAllRows, runStatement } = require('../database/database');
const { calculatePackageCredits } = require('./cup-balance');

const CUP_PRICE_CENTS = 30000 * 100;

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

function calculatePackageAmountPaidCents(packageSize) {
  const packageCredits = calculatePackageCredits(Number(packageSize));

  return packageCredits.packageSize * CUP_PRICE_CENTS;
}

async function recordPackagePurchase(database, customerId, packageSize, adminUserId) {
  const packageCredits = calculatePackageCredits(Number(packageSize));
  const amountPaidCents = calculatePackageAmountPaidCents(packageCredits.packageSize);

  await run(database, 'BEGIN TRANSACTION', []);

  try {
    const result = await run(
      database,
      `INSERT INTO package_purchases
        (customer_id, package_size, bonus_cups, total_cups_added, amount_paid_cents, created_by_admin_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        customerId,
        packageCredits.packageSize,
        packageCredits.bonusCups,
        packageCredits.totalCupsAdded,
        amountPaidCents,
        adminUserId
      ]
    );

    await run(
      database,
      `UPDATE customer_accounts
       SET current_balance = current_balance + ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [packageCredits.totalCupsAdded, customerId]
    );

    await run(
      database,
      `INSERT INTO admin_action_logs (admin_user_id, action_type, target_type, target_id, message)
       VALUES (?, ?, ?, ?, ?)`,
      [
        adminUserId,
        'package_purchase_recorded',
        'customer_account',
        customerId,
        `Recorded ${packageCredits.packageSize} cup package adding ${packageCredits.totalCupsAdded} cups`
      ]
    );

    await run(database, 'COMMIT', []);
    return {
      id: result.lastID,
      amountPaidCents,
      ...packageCredits
    };
  } catch (error) {
    await run(database, 'ROLLBACK', []);
    throw error;
  }
}

async function listPackagePurchasesForCustomer(database, customerId) {
  return all(
    database,
    `SELECT p.id, p.package_size, p.bonus_cups, p.total_cups_added,
      p.amount_paid_cents, p.created_at, a.username AS admin_username
     FROM package_purchases p
     JOIN admin_users a ON a.id = p.created_by_admin_id
     WHERE p.customer_id = ?
     ORDER BY p.created_at DESC, p.id DESC`,
    [customerId]
  );
}

module.exports = {
  calculatePackageAmountPaidCents,
  CUP_PRICE_CENTS,
  listPackagePurchasesForCustomer,
  recordPackagePurchase
};
