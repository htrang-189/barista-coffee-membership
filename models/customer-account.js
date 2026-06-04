const crypto = require('crypto');

const { getAllRows, getRow, runStatement } = require('../database/database');
const { hashPassword, verifyPassword } = require('./password');

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

function normalizeCustomerInput(input) {
  return {
    name: String(input.name || '').trim(),
    phone: String(input.phone || '').trim(),
    email: String(input.email || '').trim(),
    loginIdentifier: String(input.loginIdentifier || '').trim(),
    password: input.password || ''
  };
}

function generateBalanceAccessToken() {
  return crypto.randomBytes(32).toString('base64url');
}

async function findCustomerById(database, customerId) {
  return get(
    database,
    `SELECT id, name, phone, email, login_identifier, balance_access_token, current_balance, created_at, updated_at
     FROM customer_accounts
     WHERE id = ?`,
    [customerId]
  );
}

async function findCustomerByLoginIdentifier(database, loginIdentifier) {
  return get(
    database,
    `SELECT id, name, phone, email, login_identifier, balance_access_token, current_balance, created_at, updated_at
     FROM customer_accounts
     WHERE login_identifier = ?`,
    [String(loginIdentifier || '').trim()]
  );
}

async function findCustomerByBalanceAccessToken(database, token) {
  return get(
    database,
    `SELECT id, name, phone, email, login_identifier, balance_access_token, current_balance, created_at, updated_at
     FROM customer_accounts
     WHERE balance_access_token = ?`,
    [String(token || '').trim()]
  );
}

async function findCustomerCredentialsByLoginIdentifier(database, loginIdentifier) {
  return get(
    database,
    `SELECT id, name, login_identifier, password_hash, current_balance
     FROM customer_accounts
     WHERE login_identifier = ?`,
    [String(loginIdentifier || '').trim()]
  );
}

async function authenticateCustomer(database, loginIdentifier, password) {
  const customer = await findCustomerCredentialsByLoginIdentifier(database, loginIdentifier);

  if (!customer) {
    return null;
  }

  const isValidPassword = await verifyPassword(password || '', customer.password_hash);

  if (!isValidPassword) {
    return null;
  }

  return {
    id: customer.id,
    role: 'customer',
    name: customer.name
  };
}

async function findCustomerByPhone(database, phone) {
  return get(
    database,
    `SELECT id, name, phone, email, login_identifier, balance_access_token, current_balance, created_at, updated_at
     FROM customer_accounts
     WHERE phone = ?`,
    [String(phone || '').trim()]
  );
}

async function createUniqueBalanceAccessToken(database) {
  let token = generateBalanceAccessToken();
  let existingCustomer = await findCustomerByBalanceAccessToken(database, token);

  while (existingCustomer) {
    token = generateBalanceAccessToken();
    existingCustomer = await findCustomerByBalanceAccessToken(database, token);
  }

  return token;
}

async function createCustomerAccount(database, input) {
  const customer = normalizeCustomerInput(input);

  if (!customer.name) {
    throw new Error('Name is required.');
  }

  if (!customer.phone) {
    throw new Error('Phone is required.');
  }

  if (!customer.loginIdentifier) {
    throw new Error('Login identifier is required.');
  }

  if (!customer.password) {
    throw new Error('Password is required.');
  }

  const existingPhoneCustomer = await findCustomerByPhone(database, customer.phone);
  if (existingPhoneCustomer) {
    const error = new Error('A customer with this phone already exists.');
    error.code = 'DUPLICATE_PHONE';
    error.customer = existingPhoneCustomer;
    throw error;
  }

  const existingLoginCustomer = await findCustomerByLoginIdentifier(database, customer.loginIdentifier);
  if (existingLoginCustomer) {
    const error = new Error('A customer with this login identifier already exists.');
    error.code = 'DUPLICATE_LOGIN_IDENTIFIER';
    error.customer = existingLoginCustomer;
    throw error;
  }

  const passwordHash = await hashPassword(customer.password);
  const balanceAccessToken = await createUniqueBalanceAccessToken(database);
  const result = await run(
    database,
    `INSERT INTO customer_accounts (name, phone, email, login_identifier, password_hash, balance_access_token, current_balance)
     VALUES (?, ?, ?, ?, ?, ?, 0)`,
    [customer.name, customer.phone, customer.email || null, customer.loginIdentifier, passwordHash, balanceAccessToken]
  );

  return findCustomerById(database, result.lastID);
}

async function rotateCustomerBalanceAccessToken(database, customerId) {
  const balanceAccessToken = await createUniqueBalanceAccessToken(database);

  await run(
    database,
    `UPDATE customer_accounts
     SET balance_access_token = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [balanceAccessToken, customerId]
  );

  return findCustomerById(database, customerId);
}

async function backfillMissingBalanceAccessTokens(database) {
  const customers = await all(
    database,
    `SELECT id
     FROM customer_accounts
     WHERE balance_access_token IS NULL OR balance_access_token = ''`,
    []
  );

  for (const customer of customers) {
    await rotateCustomerBalanceAccessToken(database, customer.id);
  }

  return customers.length;
}

async function searchCustomers(database, searchTerm) {
  const normalizedSearchTerm = String(searchTerm || '').trim();

  if (!normalizedSearchTerm) {
    return all(
      database,
      `SELECT c.id, c.name, c.phone, c.email, c.login_identifier, c.current_balance,
        MAX(d.delivery_date) AS last_delivery_date
       FROM customer_accounts c
       LEFT JOIN delivery_history d ON d.customer_id = c.id AND d.voided_at IS NULL
       GROUP BY c.id
       ORDER BY c.name COLLATE NOCASE ASC`,
      []
    );
  }

  const likeTerm = `%${normalizedSearchTerm}%`;
  return all(
    database,
    `SELECT c.id, c.name, c.phone, c.email, c.login_identifier, c.current_balance,
      MAX(d.delivery_date) AS last_delivery_date
     FROM customer_accounts c
     LEFT JOIN delivery_history d ON d.customer_id = c.id AND d.voided_at IS NULL
     WHERE c.name LIKE ? OR c.phone LIKE ? OR c.login_identifier LIKE ?
     GROUP BY c.id
     ORDER BY c.name COLLATE NOCASE ASC`,
    [likeTerm, likeTerm, likeTerm]
  );
}

module.exports = {
  authenticateCustomer,
  backfillMissingBalanceAccessTokens,
  createCustomerAccount,
  findCustomerById,
  findCustomerByBalanceAccessToken,
  findCustomerByLoginIdentifier,
  findCustomerByPhone,
  generateBalanceAccessToken,
  rotateCustomerBalanceAccessToken,
  searchCustomers
};
