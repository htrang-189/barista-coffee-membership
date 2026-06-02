const { getAllRows, getRow, runStatement } = require('../database/database');
const { hashPassword } = require('./password');

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

async function findCustomerById(database, customerId) {
  return get(
    database,
    `SELECT id, name, phone, email, login_identifier, current_balance, created_at, updated_at
     FROM customer_accounts
     WHERE id = ?`,
    [customerId]
  );
}

async function findCustomerByLoginIdentifier(database, loginIdentifier) {
  return get(
    database,
    `SELECT id, name, phone, email, login_identifier, current_balance, created_at, updated_at
     FROM customer_accounts
     WHERE login_identifier = ?`,
    [String(loginIdentifier || '').trim()]
  );
}

async function findCustomerByPhone(database, phone) {
  return get(
    database,
    `SELECT id, name, phone, email, login_identifier, current_balance, created_at, updated_at
     FROM customer_accounts
     WHERE phone = ?`,
    [String(phone || '').trim()]
  );
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
  const result = await run(
    database,
    `INSERT INTO customer_accounts (name, phone, email, login_identifier, password_hash, current_balance)
     VALUES (?, ?, ?, ?, ?, 0)`,
    [customer.name, customer.phone, customer.email || null, customer.loginIdentifier, passwordHash]
  );

  return findCustomerById(database, result.lastID);
}

async function searchCustomers(database, searchTerm) {
  const normalizedSearchTerm = String(searchTerm || '').trim();

  if (!normalizedSearchTerm) {
    return all(
      database,
      `SELECT c.id, c.name, c.phone, c.email, c.login_identifier, c.current_balance,
        MAX(d.delivery_date) AS last_delivery_date
       FROM customer_accounts c
       LEFT JOIN delivery_history d ON d.customer_id = c.id
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
     LEFT JOIN delivery_history d ON d.customer_id = c.id
     WHERE c.name LIKE ? OR c.phone LIKE ? OR c.login_identifier LIKE ?
     GROUP BY c.id
     ORDER BY c.name COLLATE NOCASE ASC`,
    [likeTerm, likeTerm, likeTerm]
  );
}

module.exports = {
  createCustomerAccount,
  findCustomerById,
  findCustomerByLoginIdentifier,
  findCustomerByPhone,
  searchCustomers
};
