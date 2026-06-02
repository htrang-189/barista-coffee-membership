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
  findCustomerById,
  searchCustomers
} = require('../models/customer-account');
const { getDashboardMetrics } = require('../models/dashboard');
const {
  listDeliveriesForCustomer,
  recordDelivery
} = require('../models/delivery-history');
const {
  listPackagePurchasesForCustomer,
  recordPackagePurchase
} = require('../models/package-purchase');
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

async function buildContext() {
  const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'barista-phase1-'));
  const databasePath = path.join(tempDirectory, 'app.db');
  const schemaSql = fs.readFileSync(path.join(__dirname, '..', 'database', 'schema.sql'), 'utf8');
  const database = openDatabase(databasePath);

  await execSql(database, schemaSql);
  const adminResult = await createAdminUser(database, 'owner', 'correct-password');
  const app = createApp({
    database,
    sessionSecret: 'phase1-test-session-secret'
  });

  return {
    adminUser: adminResult.admin,
    app,
    database,
    tempDirectory
  };
}

async function cleanup(context) {
  await closeDatabase(context.database);
  fs.rmSync(context.tempDirectory, { recursive: true, force: true });
}

async function loginAgent(app) {
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

test('customer creation, duplicate checks, search, and protected route work', async function testCustomerManagement() {
  const context = await buildContext();

  try {
    const customer = await createCustomerAccount(context.database, {
      name: 'Mai Nguyen',
      phone: '555-0132',
      email: 'mai@example.com',
      loginIdentifier: 'mai.nguyen',
      password: 'customer-password'
    });

    assert.equal(customer.name, 'Mai Nguyen');
    assert.equal(customer.current_balance, 0);

    await assert.rejects(
      createCustomerAccount(context.database, {
        name: 'Mai Duplicate',
        phone: '555-0132',
        loginIdentifier: 'mai.duplicate',
        password: 'customer-password'
      }),
      /phone already exists/
    );

    await assert.rejects(
      createCustomerAccount(context.database, {
        name: 'Mai Login Duplicate',
        phone: '555-0133',
        loginIdentifier: 'mai.nguyen',
        password: 'customer-password'
      }),
      /login identifier already exists/
    );

    const searchResults = await searchCustomers(context.database, 'mai');
    assert.equal(searchResults.length, 1);
    assert.equal(searchResults[0].login_identifier, 'mai.nguyen');

    await request(context.app)
      .get('/admin/customers')
      .expect(302)
      .expect('Location', '/admin/login?message=session-expired');
  } finally {
    await cleanup(context);
  }
});

test('package purchases apply bonus rules and update balance transactionally', async function testPackagePurchases() {
  const context = await buildContext();

  try {
    const customer = await createCustomerAccount(context.database, {
      name: 'David Le',
      phone: '555-0177',
      loginIdentifier: 'david.le',
      password: 'customer-password'
    });

    await recordPackagePurchase(context.database, customer.id, 10, '50.00', context.adminUser.id);
    await recordPackagePurchase(context.database, customer.id, 20, '95.00', context.adminUser.id);
    await recordPackagePurchase(context.database, customer.id, 30, '130.00', context.adminUser.id);

    const updatedCustomer = await findCustomerById(context.database, customer.id);
    assert.equal(updatedCustomer.current_balance, 63);

    const purchases = await listPackagePurchasesForCustomer(context.database, customer.id);
    assert.equal(purchases.length, 3);
    const totalCupsAdded = purchases.reduce(function sumCups(total, purchase) {
      return total + purchase.total_cups_added;
    }, 0);
    assert.equal(totalCupsAdded, 63);

    await assert.rejects(
      recordPackagePurchase(context.database, customer.id, 15, '40.00', context.adminUser.id),
      /Invalid package size/
    );

    const afterInvalid = await findCustomerById(context.database, customer.id);
    assert.equal(afterInvalid.current_balance, 63);
  } finally {
    await cleanup(context);
  }
});

test('delivery decreases balance, blocks zero balance, and returns history newest first', async function testDeliveries() {
  const context = await buildContext();

  try {
    const customer = await createCustomerAccount(context.database, {
      name: 'Sarah Vo',
      phone: '555-0188',
      loginIdentifier: 'sarah.vo',
      password: 'customer-password'
    });

    await assert.rejects(
      recordDelivery(context.database, customer.id, context.adminUser.id, 'Blocked'),
      /current balance is 0/
    );

    await recordPackagePurchase(context.database, customer.id, 10, '50.00', context.adminUser.id);
    await recordDelivery(context.database, customer.id, context.adminUser.id, 'First delivery');
    await recordDelivery(context.database, customer.id, context.adminUser.id, 'Second delivery');

    const updatedCustomer = await findCustomerById(context.database, customer.id);
    assert.equal(updatedCustomer.current_balance, 9);

    const deliveries = await listDeliveriesForCustomer(context.database, customer.id);
    assert.equal(deliveries.length, 2);
    assert.equal(deliveries[0].note, 'Second delivery');

    await request(context.app)
      .post(`/admin/customers/${customer.id}/deliveries`)
      .type('form')
      .send({ note: 'No session' })
      .expect(302)
      .expect('Location', '/admin/login?message=session-expired');
  } finally {
    await cleanup(context);
  }
});

test('dashboard metrics summarize owner MVP activity', async function testDashboardMetrics() {
  const context = await buildContext();

  try {
    const lowCustomer = await createCustomerAccount(context.database, {
      name: 'Low Balance',
      phone: '555-0101',
      loginIdentifier: 'low.balance',
      password: 'customer-password'
    });
    const activeCustomer = await createCustomerAccount(context.database, {
      name: 'Active Balance',
      phone: '555-0102',
      loginIdentifier: 'active.balance',
      password: 'customer-password'
    });

    await recordPackagePurchase(context.database, lowCustomer.id, 10, '50.00', context.adminUser.id);
    await recordPackagePurchase(context.database, activeCustomer.id, 20, '95.00', context.adminUser.id);
    await recordDelivery(context.database, lowCustomer.id, context.adminUser.id, 'Low 1');
    await recordDelivery(context.database, lowCustomer.id, context.adminUser.id, 'Low 2');
    await recordDelivery(context.database, lowCustomer.id, context.adminUser.id, 'Low 3');
    await recordDelivery(context.database, lowCustomer.id, context.adminUser.id, 'Low 4');
    await recordDelivery(context.database, lowCustomer.id, context.adminUser.id, 'Low 5');
    await recordDelivery(context.database, lowCustomer.id, context.adminUser.id, 'Low 6');

    const metrics = await getDashboardMetrics(context.database);

    assert.equal(metrics.totalCustomers, 2);
    assert.equal(metrics.totalOutstandingCups, 27);
    assert.equal(metrics.recordedPackageRevenueCents, 14500);
    assert.equal(metrics.totalCupsDelivered, 6);
    assert.equal(metrics.lowBalanceCustomers.length, 1);
    assert.equal(metrics.lowBalanceCustomers[0].id, lowCustomer.id);
    assert.equal(metrics.recentDeliveries.length, 6);

    const agent = await loginAgent(context.app);
    const dashboard = await agent.get('/admin/dashboard').expect(200);
    assert.match(dashboard.text, /Owner dashboard/);
    assert.match(dashboard.text, /\$145\.00/);
  } finally {
    await cleanup(context);
  }
});
