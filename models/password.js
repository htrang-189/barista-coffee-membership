const bcrypt = require('bcrypt');

const config = require('../config');

async function hashPassword(password) {
  return bcrypt.hash(password, config.bcryptRounds);
}

async function verifyPassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}

module.exports = {
  hashPassword,
  verifyPassword
};
