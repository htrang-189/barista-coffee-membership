const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const test = require('node:test');

const request = require('supertest');

const { openDatabase } = require('../database/database');
const { createAdminUser } = require('../models/admin-user');
const { findCustomerByLoginIdentifier } = require('../models/customer-account');
const { getDashboardMetrics } = require('../models/dashboard');
const { listDeliveriesForCustomer } = require('../models/delivery-history');
const { listPackagePurchasesForCustomer } = require('../models/package-purchase');
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

function extractCustomerId(location) {
  const match = String(location || '').match(/\/admin\/customers\/(\d+)/);
  assert.ok(match, `Expected customer detail redirect, got: ${location}`);
  return Number(match[1]);
}

function extractBalanceAccessPath(html) {
  const match = html.match(/\/customer\/access\/[A-Za-z0-9_-]+/);
  assert.ok(match, 'Expected customer balance access path in owner detail page');
  return match[0];
}

function extractVoidDeliveryPath(html) {
  const match = html.match(/\/admin\/deliveries\/\d+\/void/);
  assert.ok(match, 'Expected void delivery action in owner detail page');
  return match[0];
}

async function buildContext() {
  const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'barista-e2e-'));
  const databasePath = path.join(tempDirectory, 'app.db');
  const schemaSql = fs.readFileSync(path.join(__dirname, '..', 'database', 'schema.sql'), 'utf8');
  const database = openDatabase(databasePath);

  await execSql(database, schemaSql);
  await createAdminUser(database, 'owner', 'correct-password');

  const app = createApp({
    database,
    sessionSecret: 'e2e-test-session-secret'
  });

  return {
    app,
    database,
    tempDirectory
  };
}

async function cleanup(context) {
  await closeDatabase(context.database);
  fs.rmSync(context.tempDirectory, { recursive: true, force: true });
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
    .expect(302)
    .expect('Location', '/admin/dashboard');

  return agent;
}

test('owner can operate membership end to end and customer can view read-only balance', async function testOwnerCustomerE2eFlow() {
  const context = await buildContext();

  try {
    const adminAgent = await loginAdmin(context.app);
    const dashboard = await adminAgent.get('/admin/dashboard').expect(200);
    const dashboardCsrfToken = extractCsrfToken(dashboard.text);

    const createCustomerResponse = await adminAgent
      .post('/admin/customers')
      .type('form')
      .send({
        csrfToken: dashboardCsrfToken,
        name: 'End To End Customer',
        phone: '555-E2E',
        email: 'e2e@example.com',
        loginIdentifier: 'e2e.customer',
        password: 'customer-password'
      })
      .expect(302);

    const customerId = extractCustomerId(createCustomerResponse.headers.location);
    let customerDetail = await adminAgent.get(`/admin/customers/${customerId}`).expect(200);
    let customerCsrfToken = extractCsrfToken(customerDetail.text);

    assert.match(customerDetail.text, /Copy link/);
    assert.match(customerDetail.text, /Show QR code/);

    await adminAgent
      .post(`/admin/customers/${customerId}/package-purchases`)
      .type('form')
      .send({
        csrfToken: customerCsrfToken,
        packageSize: 10
      })
      .expect(302)
      .expect('Location', `/admin/customers/${customerId}?package=saved`);

    const purchases = await listPackagePurchasesForCustomer(context.database, customerId);
    assert.equal(purchases.length, 1);
    assert.equal(purchases[0].package_size, 10);
    assert.equal(purchases[0].amount_paid_cents, 30000000);
    assert.equal(purchases[0].total_cups_added, 11);

    customerDetail = await adminAgent.get(`/admin/customers/${customerId}`).expect(200);
    customerCsrfToken = extractCsrfToken(customerDetail.text);
    assert.match(customerDetail.text, /Current balance/);
    assert.match(customerDetail.text, /300\.000 ₫/);

    await adminAgent
      .post(`/admin/customers/${customerId}/deliveries`)
      .type('form')
      .send({
        csrfToken: customerCsrfToken,
        deliveredCups: 3,
        note: 'E2E pickup'
      })
      .expect(302)
      .expect('Location', `/admin/customers/${customerId}?delivery=saved`);

    let updatedCustomer = await findCustomerByLoginIdentifier(context.database, 'e2e.customer');
    assert.equal(updatedCustomer.current_balance, 8);

    customerDetail = await adminAgent.get(`/admin/customers/${customerId}`).expect(200);
    customerCsrfToken = extractCsrfToken(customerDetail.text);
    assert.match(customerDetail.text, /3 cups delivered/);
    assert.match(customerDetail.text, /E2E pickup/);

    const voidPath = extractVoidDeliveryPath(customerDetail.text);
    await adminAgent
      .post(voidPath)
      .type('form')
      .send({ csrfToken: customerCsrfToken })
      .expect(302)
      .expect('Location', `/admin/customers/${customerId}?delivery=voided`);

    updatedCustomer = await findCustomerByLoginIdentifier(context.database, 'e2e.customer');
    assert.equal(updatedCustomer.current_balance, 11);

    const deliveries = await listDeliveriesForCustomer(context.database, customerId);
    assert.equal(deliveries.length, 1);
    assert.equal(deliveries[0].delivered_cups, 3);
    assert.ok(deliveries[0].voided_at);

    const metrics = await getDashboardMetrics(context.database);
    assert.equal(metrics.totalCupsDelivered, 0);

    customerDetail = await adminAgent.get(`/admin/customers/${customerId}`).expect(200);
    assert.match(customerDetail.text, /Voided/);

    const balanceAccessPath = extractBalanceAccessPath(customerDetail.text);
    const tokenPage = await request(context.app).get(balanceAccessPath).expect(200);
    assert.match(tokenPage.text, /End To End Customer/);
    assert.match(tokenPage.text, /11 cups/);
    assert.match(tokenPage.text, /Voided/);
    assert.doesNotMatch(tokenPage.text, /300\.000 ₫/);
    assert.doesNotMatch(tokenPage.text, /Void delivery/);

    const customerAgent = request.agent(context.app);
    const customerLoginPage = await customerAgent.get('/customer/login').expect(200);
    const customerLoginCsrfToken = extractCsrfToken(customerLoginPage.text);

    await customerAgent
      .post('/customer/login')
      .type('form')
      .send({
        csrfToken: customerLoginCsrfToken,
        loginIdentifier: 'e2e.customer',
        password: 'customer-password'
      })
      .expect(302)
      .expect('Location', '/customer/balance');

    const customerBalance = await customerAgent.get('/customer/balance').expect(200);
    assert.match(customerBalance.text, /End To End Customer/);
    assert.match(customerBalance.text, /11 cups/);
    assert.doesNotMatch(customerBalance.text, /300\.000 ₫/);
    assert.doesNotMatch(customerBalance.text, /Record delivery/);
  } finally {
    await cleanup(context);
  }
});
