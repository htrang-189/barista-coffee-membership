const { getRow, runStatement } = require('../database/database');
const { hashPassword, verifyPassword } = require('./password');

function findAdminByUsername(database, username) {
  return new Promise(function findAdmin(resolve, reject) {
    getRow(
      database,
      'SELECT id, username, password_hash, role FROM admin_users WHERE username = ?',
      [username],
      function handleAdminResult(error, row) {
        if (error) {
          reject(error);
          return;
        }

        resolve(row || null);
      }
    );
  });
}

async function authenticateAdmin(database, username, password) {
  const normalizedUsername = String(username || '').trim();

  if (!normalizedUsername || !password) {
    return null;
  }

  const adminUser = await findAdminByUsername(database, normalizedUsername);
  if (!adminUser) {
    return null;
  }

  const passwordMatches = await verifyPassword(password, adminUser.password_hash);
  if (!passwordMatches) {
    return null;
  }

  return {
    id: adminUser.id,
    username: adminUser.username,
    role: adminUser.role
  };
}

async function createAdminUser(database, username, password) {
  const normalizedUsername = String(username || '').trim();

  if (!normalizedUsername) {
    throw new Error('Admin username is required.');
  }

  if (!password) {
    throw new Error('Admin password is required.');
  }

  const existingAdmin = await findAdminByUsername(database, normalizedUsername);
  if (existingAdmin) {
    return {
      created: false,
      admin: {
        id: existingAdmin.id,
        username: existingAdmin.username,
        role: existingAdmin.role
      }
    };
  }

  const passwordHash = await hashPassword(password);

  return new Promise(function insertAdmin(resolve, reject) {
    runStatement(
      database,
      'INSERT INTO admin_users (username, password_hash, role) VALUES (?, ?, ?)',
      [normalizedUsername, passwordHash, 'admin'],
      function handleInsert(error, result) {
        if (error) {
          reject(error);
          return;
        }

        resolve({
          created: true,
          admin: {
            id: result.lastID,
            username: normalizedUsername,
            role: 'admin'
          }
        });
      }
    );
  });
}

module.exports = {
  authenticateAdmin,
  createAdminUser,
  findAdminByUsername
};
