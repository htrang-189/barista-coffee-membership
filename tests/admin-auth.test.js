const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const test = require('node:test');

const request = require('supertest');

const { openDatabase } = require('../database/database');
const { createAdminUser, findAdminByUsername } = require('../models/admin-user');
const { createApp } = require('../server');

function execSql(database, sql) {
  return new Promise(function execute(resolve, reject) {
    database.exec(sql, function handleExec(error) {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

function closeDatabase(database) {
  return new Promise(function close(resolve, reject) {
    database.close(function handleClose(error) {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

function extractCsrfToken(html) {
  const match = html.match(/name="csrfToken" value="([^"]+)"/);
  assert.ok(match, 'Expected csrf token field in HTML response');
  return match[1];
}

async function buildTestApp() {
  const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'barista-auth-'));
  const databasePath = path.join(tempDirectory, 'app.db');
  const schemaSql = fs.readFileSync(path.join(__dirname, '..', 'database', 'schema.sql'), 'utf8');
  const database = openDatabase(databasePath);

  await execSql(database, schemaSql);
  await createAdminUser(database, 'owner', 'correct-password');

  const app = createApp({
    database: database,
    sessionSecret: 'test-session-secret'
  });

  return {
    app,
    database,
    tempDirectory
  };
}

test('admin password is stored as a bcrypt hash', async function testPasswordHashing() {
  const context = await buildTestApp();

  try {
    const adminUser = await findAdminByUsername(context.database, 'owner');

    assert.ok(adminUser.password_hash.startsWith('$2'));
    assert.notEqual(adminUser.password_hash, 'correct-password');
  } finally {
    await closeDatabase(context.database);
    fs.rmSync(context.tempDirectory, { recursive: true, force: true });
  }
});

test('admin login success creates a session and opens dashboard', async function testLoginSuccess() {
  const context = await buildTestApp();
  const agent = request.agent(context.app);

  try {
    const loginPage = await agent.get('/admin/login').expect(200);
    const csrfToken = extractCsrfToken(loginPage.text);

    await agent
      .post('/admin/login')
      .type('form')
      .send({
        csrfToken: csrfToken,
        username: 'owner',
        password: 'correct-password'
      })
      .expect(302)
      .expect('Location', '/admin/dashboard');

    const dashboard = await agent.get('/admin/dashboard').expect(200);
    assert.match(dashboard.text, /Owner dashboard/);
  } finally {
    await closeDatabase(context.database);
    fs.rmSync(context.tempDirectory, { recursive: true, force: true });
  }
});

test('admin login failure shows a generic error', async function testLoginFailure() {
  const context = await buildTestApp();
  const agent = request.agent(context.app);

  try {
    const loginPage = await agent.get('/admin/login').expect(200);
    const csrfToken = extractCsrfToken(loginPage.text);

    const response = await agent
      .post('/admin/login')
      .type('form')
      .send({
        csrfToken: csrfToken,
        username: 'owner',
        password: 'wrong-password'
      })
      .expect(401);

    assert.match(response.text, /Invalid login/);
    assert.doesNotMatch(response.text, /wrong-password/);
  } finally {
    await closeDatabase(context.database);
    fs.rmSync(context.tempDirectory, { recursive: true, force: true });
  }
});

test('unauthenticated admin route access redirects to login', async function testProtectedRoute() {
  const context = await buildTestApp();

  try {
    await request(context.app)
      .get('/admin/dashboard')
      .expect(302)
      .expect('Location', '/admin/login?message=session-expired');
  } finally {
    await closeDatabase(context.database);
    fs.rmSync(context.tempDirectory, { recursive: true, force: true });
  }
});

test('logout clears the admin session', async function testLogout() {
  const context = await buildTestApp();
  const agent = request.agent(context.app);

  try {
    const loginPage = await agent.get('/admin/login').expect(200);
    const loginCsrfToken = extractCsrfToken(loginPage.text);

    await agent
      .post('/admin/login')
      .type('form')
      .send({
        csrfToken: loginCsrfToken,
        username: 'owner',
        password: 'correct-password'
      })
      .expect(302);

    const dashboard = await agent.get('/admin/dashboard').expect(200);
    const dashboardCsrfToken = extractCsrfToken(dashboard.text);

    await agent
      .post('/admin/logout')
      .type('form')
      .send({ csrfToken: dashboardCsrfToken })
      .expect(302)
      .expect('Location', '/admin/login');

    await agent
      .get('/admin/dashboard')
      .expect(302)
      .expect('Location', '/admin/login?message=session-expired');
  } finally {
    await closeDatabase(context.database);
    fs.rmSync(context.tempDirectory, { recursive: true, force: true });
  }
});
