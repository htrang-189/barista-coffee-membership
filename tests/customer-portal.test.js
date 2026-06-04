const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const test = require('node:test');

const request = require('supertest');

const { openDatabase } = require('../database/database');
const { createAdminUser } = require('../models/admin-user');
const {
  createCustomerAccount,
  findCustomerById
} = require('../models/customer-account');
const { recordDelivery } = require('../models/delivery-history');
const { recordPackagePurchase } = require('../models/package-purchase');
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

function countMatches(text, pattern) {
  return (text.match(pattern) || []).length;
}

async function buildContext() {
  const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'barista-customer-portal-'));
  const databasePath = path.join(tempDirectory, 'app.db');
  const schemaSql = fs.readFileSync(path.join(__dirname, '..', 'database', 'schema.sql'), 'utf8');
  const database = openDatabase(databasePath);

  await execSql(database, schemaSql);
  const adminResult = await createAdminUser(database, 'owner', 'correct-password');
  const firstCustomer = await createCustomerAccount(database, {
    name: 'Mai Nguyen',
    phone: '555-0132',
    email: 'mai@example.com',
    loginIdentifier: 'mai.nguyen',
    password: 'customer-password'
  });
  const secondCustomer = await createCustomerAccount(database, {
    name: 'David Le',
    phone: '555-0177',
    email: 'david@example.com',
    loginIdentifier: 'david.le',
    password: 'second-password'
  });

  await recordPackagePurchase(database, firstCustomer.id, 20, adminResult.admin.id);
  await recordDelivery(database, firstCustomer.id, 1, adminResult.admin.id, 'Morning pickup');
  await recordPackagePurchase(database, secondCustomer.id, 10, adminResult.admin.id);

  const app = createApp({
    database,
    sessionSecret: 'customer-portal-test-session-secret'
  });

  return {
    adminUser: adminResult.admin,
    app,
    database,
    firstCustomer,
    secondCustomer,
    tempDirectory
  };
}

async function cleanup(context) {
  await closeDatabase(context.database);
  fs.rmSync(context.tempDirectory, { recursive: true, force: true });
}

async function loginCustomer(app, loginIdentifier, password) {
  const agent = request.agent(app);
  const loginPage = await agent.get('/customer/login').expect(200);
  const csrfToken = extractCsrfToken(loginPage.text);

  await agent
    .post('/customer/login')
    .type('form')
    .send({
      csrfToken,
      loginIdentifier,
      password
    })
    .expect(302)
    .expect('Location', '/customer/balance');

  return agent;
}

async function loginAdmin(app) {
  const agent = request.agent(app);
  const loginPage = await agent.get('/admin/login').expect(200);
  const csrfToken = extractCsrfToken(loginPage.text);

  await agent
    .post('/admin/login')
    .type('form')
    .send({
      csrfToken,
      username: 'owner',
      password: 'correct-password'
    })
    .expect(302);

  return agent;
}

test('customer login opens read-only balance and own history', async function testCustomerBalanceView() {
  const context = await buildContext();

  try {
    const agent = await loginCustomer(context.app, 'mai.nguyen', 'customer-password');
    const response = await agent.get('/customer/balance').expect(200);

    assert.match(response.text, /Mai Nguyen/);
    assert.match(response.text, /Barista Membership/);
    assert.match(response.text, /data-dynamic-greeting/);
    assert.match(response.text, /data-dynamic-message/);
    assert.match(response.text, /Member since Jun 2025/);
    assert.match(response.text, /member-hero/);
    assert.match(response.text, /membership-card/);
    assert.match(response.text, /member-status-panel/);
    assert.match(response.text, /21 cups/);
    assert.match(response.text, /Used cups/);
    assert.match(response.text, /1 used/);
    assert.match(response.text, /21 remaining/);
    assert.match(response.text, /1 \/ 22 cups consumed/);
    assert.match(response.text, /cup-progress-card/);
    assert.match(response.text, /1 cup used/);
    assert.match(response.text, /Morning pickup/);
    assert.match(response.text, /20-cup package/);
    assert.match(response.text, /\+2 bonus cups/);
    assert.doesNotMatch(response.text, /95\.000/);
    assert.doesNotMatch(response.text, /amount paid/i);
    assert.doesNotMatch(response.text, /mai\.nguyen/);
    assert.doesNotMatch(response.text, /David Le/);
    assert.doesNotMatch(response.text, /Record package purchase/);
    assert.doesNotMatch(response.text, /Record 1 cup delivery/);
    assert.doesNotMatch(response.text, /Void delivery/);
    assert.doesNotMatch(response.text, /\{\{[A-Z0-9_]+\}\}/);
  } finally {
    await cleanup(context);
  }
});

test('customer routes require customer session and reject admin session', async function testCustomerRouteProtection() {
  const context = await buildContext();

  try {
    await request(context.app)
      .get('/customer/balance')
      .expect(302)
      .expect('Location', '/customer/login?message=session-expired');

    const adminAgent = await loginAdmin(context.app);
    await adminAgent
      .get('/customer/balance')
      .expect(302)
      .expect('Location', '/customer/login?message=session-expired');

    const customerAgent = await loginCustomer(context.app, 'mai.nguyen', 'customer-password');
    await customerAgent
      .get('/admin/dashboard')
      .expect(302)
      .expect('Location', '/admin/login?message=session-expired');
  } finally {
    await cleanup(context);
  }
});

test('customer login failure is generic and does not create a session', async function testCustomerLoginFailure() {
  const context = await buildContext();
  const agent = request.agent(context.app);

  try {
    const loginPage = await agent.get('/customer/login').expect(200);
    const csrfToken = extractCsrfToken(loginPage.text);

    const response = await agent
      .post('/customer/login')
      .type('form')
      .send({
        csrfToken,
        loginIdentifier: 'mai.nguyen',
        password: 'wrong-password'
      })
      .expect(401);

    assert.match(response.text, /Invalid login/);
    assert.doesNotMatch(response.text, /wrong-password/);

    await agent
      .get('/customer/balance')
      .expect(302)
      .expect('Location', '/customer/login?message=session-expired');
  } finally {
    await cleanup(context);
  }
});

test('customer portal has no customer mutation endpoints', async function testCustomerPortalReadOnly() {
  const context = await buildContext();

  try {
    const agent = await loginCustomer(context.app, 'mai.nguyen', 'customer-password');
    const balancePage = await agent.get('/customer/balance').expect(200);
    const csrfToken = extractCsrfToken(balancePage.text);

    await agent
      .post(`/customer/customers/${context.firstCustomer.id}/package-purchases`)
      .type('form')
      .send({
        csrfToken,
        packageSize: 30
      })
      .expect(404);

    await agent
      .post(`/customer/customers/${context.firstCustomer.id}/deliveries`)
      .type('form')
      .send({
        csrfToken,
        note: 'Should not save'
      })
      .expect(404);
  } finally {
    await cleanup(context);
  }
});

test('customer logout clears customer session', async function testCustomerLogout() {
  const context = await buildContext();

  try {
    const agent = await loginCustomer(context.app, 'mai.nguyen', 'customer-password');
    const balancePage = await agent.get('/customer/balance').expect(200);
    const csrfToken = extractCsrfToken(balancePage.text);

    await agent
      .post('/customer/logout')
      .type('form')
      .send({ csrfToken })
      .expect(302)
      .expect('Location', '/customer/login');

    await agent
      .get('/customer/balance')
      .expect(302)
      .expect('Location', '/customer/login?message=session-expired');
  } finally {
    await cleanup(context);
  }
});

test('secure balance access token renders the read-only customer page', async function testTokenBalanceAccess() {
  const context = await buildContext();

  try {
    const customer = await findCustomerById(context.database, context.firstCustomer.id);
    const response = await request(context.app)
      .get(`/customer/access/${customer.balance_access_token}`)
      .expect(200);

    assert.match(response.text, /Phase 2|Mai Nguyen/);
    assert.match(response.text, /21 cups/);
    assert.match(response.text, /20-cup package/);
    assert.match(response.text, /Morning pickup/);
    assert.doesNotMatch(response.text, /95\.000/);
    assert.doesNotMatch(response.text, /Record package purchase/);
    assert.doesNotMatch(response.text, /Record 1 cup delivery/);
    assert.doesNotMatch(response.text, /Logout/);
    assert.doesNotMatch(response.text, /\{\{[A-Z0-9_]+\}\}/);
  } finally {
    await cleanup(context);
  }
});

test('customer balance pages render notification HTML without raw placeholders', async function testNotificationRendering() {
  const context = await buildContext();

  try {
    const lowCustomer = await createCustomerAccount(context.database, {
      name: 'Low Balance',
      phone: '555-0201',
      email: 'low@example.com',
      loginIdentifier: 'low.balance',
      password: 'customer-password'
    });
    const zeroCustomer = await createCustomerAccount(context.database, {
      name: 'Zero Balance',
      phone: '555-0202',
      email: 'zero@example.com',
      loginIdentifier: 'zero.balance',
      password: 'customer-password'
    });

    await recordPackagePurchase(context.database, lowCustomer.id, 10, context.adminUser.id);
    await recordDelivery(context.database, lowCustomer.id, 5, context.adminUser.id, 'Low balance setup');
    await recordDelivery(context.database, lowCustomer.id, 1, context.adminUser.id, 'Low balance setup');

    const lowAgent = await loginCustomer(context.app, 'low.balance', 'customer-password');
    const lowBalancePage = await lowAgent.get('/customer/balance').expect(200);
    const lowCustomerAfterDeliveries = await findCustomerById(context.database, lowCustomer.id);
    const lowTokenPage = await request(context.app)
      .get(`/customer/access/${lowCustomerAfterDeliveries.balance_access_token}`)
      .expect(200);
    const zeroCustomerRecord = await findCustomerById(context.database, zeroCustomer.id);
    const zeroTokenPage = await request(context.app)
      .get(`/customer/access/${zeroCustomerRecord.balance_access_token}`)
      .expect(200);

    assert.match(lowBalancePage.text, /data-notification-state="low"/);
    assert.match(lowBalancePage.text, /id="customer-notification-bell"/);
    assert.match(lowBalancePage.text, /id="customer-notification-popover"/);
    assert.match(lowBalancePage.text, /aria-controls="customer-notification-popover"/);
    assert.match(lowBalancePage.text, /aria-expanded="false"/);
    assert.match(lowBalancePage.text, /data-notification-popover hidden/);
    assert.match(lowBalancePage.text, /data-notification-close/);
    assert.match(lowBalancePage.text, />Close<\/button>/);
    assert.match(lowBalancePage.text, /bindCustomerNotifications/);
    assert.match(lowBalancePage.text, /popover\.hidden = !popover\.hidden/);
    assert.match(lowBalancePage.text, /notification-badge/);
    assert.match(lowBalancePage.text, /Your package is running low/);
    assert.match(lowBalancePage.text, /Only 5 cups remaining/);
    assert.match(lowBalancePage.text, /6 \/ 11 cups consumed/);
    assert.match(lowBalancePage.text, /cup-progress-card low/);
    assert.match(lowBalancePage.text, /You only have 5 cups remaining\. Please buy a new package soon\./);
    assert.doesNotMatch(lowBalancePage.text, /\{\{[A-Z0-9_]+\}\}/);

    assert.match(lowTokenPage.text, /data-notification-state="low"/);
    assert.match(lowTokenPage.text, /id="customer-notification-bell"/);
    assert.match(lowTokenPage.text, /id="customer-notification-popover"/);
    assert.match(lowTokenPage.text, /data-notification-close/);
    assert.match(lowTokenPage.text, /bindCustomerNotifications/);
    assert.match(lowTokenPage.text, /popover\.hidden = !popover\.hidden/);
    assert.match(lowTokenPage.text, /Your package is running low/);
    assert.match(lowTokenPage.text, /You only have 5 cups remaining\. Please buy a new package soon\./);
    assert.doesNotMatch(lowTokenPage.text, /\{\{[A-Z0-9_]+\}\}/);

    assert.match(zeroTokenPage.text, /data-notification-state="critical"/);
    assert.match(zeroTokenPage.text, /notification-badge/);
    assert.match(zeroTokenPage.text, /Your package is exhausted/);
    assert.match(zeroTokenPage.text, /Your package has ended/);
    assert.match(zeroTokenPage.text, /You have 0 cups remaining\. Please buy a new package\./);
    assert.doesNotMatch(zeroTokenPage.text, /\{\{[A-Z0-9_]+\}\}/);

    const customerJs = fs.readFileSync(path.join(__dirname, '..', 'public', 'js', 'admin.js'), 'utf8');
    assert.match(customerJs, /bell-shake/);
    assert.match(customerJs, /setInterval\(shakeBell, 15000\)/);
  } finally {
    await cleanup(context);
  }
});

test('invalid balance access token returns 404', async function testInvalidTokenBalanceAccess() {
  const context = await buildContext();

  try {
    await request(context.app)
      .get('/customer/access/not-a-valid-token')
      .expect(404);
  } finally {
    await cleanup(context);
  }
});

test('owner can view QR link controls and regenerate the balance access link', async function testOwnerBalanceLinkControls() {
  const context = await buildContext();

  try {
    const agent = await loginAdmin(context.app);
    const before = await findCustomerById(context.database, context.firstCustomer.id);
    const detailPage = await agent.get(`/admin/customers/${context.firstCustomer.id}`).expect(200);
    const csrfToken = extractCsrfToken(detailPage.text);

    assert.match(detailPage.text, new RegExp(`/customer/access/${before.balance_access_token}`));
    assert.match(detailPage.text, /Copy link/);
    assert.match(detailPage.text, /Show QR code/);
    assert.match(detailPage.text, /<svg/);

    await agent
      .post(`/admin/customers/${context.firstCustomer.id}/balance-link/regenerate`)
      .type('form')
      .send({ csrfToken })
      .expect(302)
      .expect('Location', `/admin/customers/${context.firstCustomer.id}?link=regenerated`);

    const after = await findCustomerById(context.database, context.firstCustomer.id);
    assert.notEqual(after.balance_access_token, before.balance_access_token);

    await request(context.app)
      .get(`/customer/access/${before.balance_access_token}`)
      .expect(404);

    await request(context.app)
      .get(`/customer/access/${after.balance_access_token}`)
      .expect(200);
  } finally {
    await cleanup(context);
  }
});

test('history previews show five records and full history pages show all records', async function testHistoryPreviewAndFullPages() {
  const context = await buildContext();

  try {
    for (let index = 2; index <= 6; index += 1) {
      await recordPackagePurchase(context.database, context.firstCustomer.id, 10, context.adminUser.id);
      await recordDelivery(context.database, context.firstCustomer.id, 1, context.adminUser.id, `Pickup ${index}`);
    }

    const adminAgent = await loginAdmin(context.app);
    const ownerDetail = await adminAgent.get(`/admin/customers/${context.firstCustomer.id}`).expect(200);

    assert.equal(countMatches(ownerDetail.text, /-cup package/g), 5);
    assert.equal(countMatches(ownerDetail.text, /cup used|cup delivered|cups delivered/g), 5);
    assert.match(ownerDetail.text, new RegExp(`/admin/customers/${context.firstCustomer.id}/package-purchases`));
    assert.match(ownerDetail.text, new RegExp(`/admin/customers/${context.firstCustomer.id}/deliveries`));
    assert.doesNotMatch(ownerDetail.text, /Morning pickup/);

    const ownerPackageHistory = await adminAgent
      .get(`/admin/customers/${context.firstCustomer.id}/package-purchases`)
      .expect(200);
    const ownerDeliveryHistory = await adminAgent
      .get(`/admin/customers/${context.firstCustomer.id}/deliveries`)
      .expect(200);

    assert.equal(countMatches(ownerPackageHistory.text, /-cup package/g), 6);
    assert.equal(countMatches(ownerDeliveryHistory.text, /cup delivered|cups delivered/g), 6);
    assert.match(ownerDeliveryHistory.text, /Morning pickup/);

    const customerAgent = await loginCustomer(context.app, 'mai.nguyen', 'customer-password');
    const customerBalance = await customerAgent.get('/customer/balance').expect(200);

    assert.equal(countMatches(customerBalance.text, /-cup package/g), 5);
    assert.equal(countMatches(customerBalance.text, /cup used|cups used/g), 5);
    assert.match(customerBalance.text, /\/customer\/package-history/);
    assert.match(customerBalance.text, /\/customer\/delivery-history/);
    assert.doesNotMatch(customerBalance.text, /Morning pickup/);

    const customerPackageHistory = await customerAgent.get('/customer/package-history').expect(200);
    const customerDeliveryHistory = await customerAgent.get('/customer/delivery-history').expect(200);

    assert.equal(countMatches(customerPackageHistory.text, /-cup package/g), 6);
    assert.equal(countMatches(customerDeliveryHistory.text, /cup used|cups used/g), 6);
    assert.match(customerDeliveryHistory.text, /Morning pickup/);
    assert.doesNotMatch(customerPackageHistory.text, /300\.000 ₫|600\.000 ₫/);

    const customer = await findCustomerById(context.database, context.firstCustomer.id);
    const tokenBalance = await request(context.app)
      .get(`/customer/access/${customer.balance_access_token}`)
      .expect(200);

    assert.equal(countMatches(tokenBalance.text, /-cup package/g), 5);
    assert.equal(countMatches(tokenBalance.text, /cup used|cups used/g), 5);
    assert.match(tokenBalance.text, new RegExp(`/customer/access/${customer.balance_access_token}/package-history`));
    assert.match(tokenBalance.text, new RegExp(`/customer/access/${customer.balance_access_token}/delivery-history`));

    const tokenPackageHistory = await request(context.app)
      .get(`/customer/access/${customer.balance_access_token}/package-history`)
      .expect(200);
    const tokenDeliveryHistory = await request(context.app)
      .get(`/customer/access/${customer.balance_access_token}/delivery-history`)
      .expect(200);

    assert.equal(countMatches(tokenPackageHistory.text, /-cup package/g), 6);
    assert.equal(countMatches(tokenDeliveryHistory.text, /cup used|cups used/g), 6);
    assert.doesNotMatch(tokenPackageHistory.text, /300\.000 ₫|600\.000 ₫/);
    assert.doesNotMatch(tokenDeliveryHistory.text, /Void delivery/);
  } finally {
    await cleanup(context);
  }
});
