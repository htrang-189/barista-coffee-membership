const express = require('express');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

const { authenticateAdmin } = require('../models/admin-user');
const {
  createCustomerAccount,
  findCustomerById,
  rotateCustomerBalanceAccessToken,
  searchCustomers
} = require('../models/customer-account');
const {
  listPackagePurchasesForCustomer,
  recordPackagePurchase
} = require('../models/package-purchase');
const {
  listDeliveriesForCustomer,
  listRecentDeliveries,
  recordDelivery,
  voidDelivery
} = require('../models/delivery-history');
const { getDashboardMetrics } = require('../models/dashboard');
const { formatVndFromCents } = require('../models/currency');
const { redirectAuthenticatedAdmin, requireAdmin } = require('../middleware/auth');
const { requireCsrfToken } = require('../middleware/csrf');

const router = express.Router();
const HISTORY_PREVIEW_LIMIT = 5;
const ADMIN_DELIVERIES_PAGE_SIZE = 25;

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatMoney(cents) {
  return formatVndFromCents(cents);
}

function formatDate(value) {
  if (!value) {
    return '-';
  }

  return new Date(`${value}Z`).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function balanceClass(balance) {
  if (balance <= 0) {
    return 'balance-pill zero';
  }

  if (balance <= 5) {
    return 'balance-pill low';
  }

  return 'balance-pill';
}

function renderTemplate(response, templatePath, replacements) {
  let html = fs.readFileSync(templatePath, 'utf8');

  Object.keys(replacements).forEach(function replaceToken(token) {
    html = html.replaceAll(`{{${token}}}`, replacements[token]);
  });

  response.send(html);
}

function renderLogin(response, options) {
  const loginTemplatePath = path.join(__dirname, '..', 'views', 'shared', 'admin-login.html');
  const message = options.message
    ? `<div class="error-box">${escapeHtml(options.message)}</div>`
    : '';

  renderTemplate(response, loginTemplatePath, {
    CSRF_TOKEN: escapeHtml(options.csrfToken),
    MESSAGE: message,
    USERNAME: escapeHtml(options.username)
  });
}

function renderAdminPage(response, options) {
  const active = options.active || 'dashboard';
  const csrfToken = escapeHtml(response.locals.csrfToken);
  const navItems = [
    { key: 'dashboard', href: '/admin/dashboard', label: 'Dashboard' },
    { key: 'customers', href: '/admin/customers', label: 'Customers' },
    { key: 'deliveries', href: '/admin/deliveries', label: 'Deliveries' }
  ];
  const navHtml = navItems
    .map(function buildNavItem(item) {
      const className = item.key === active ? ' class="active"' : '';
      return `<a${className} href="${item.href}">${item.label}</a>`;
    })
    .join('');

  response.send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(options.title)} | Barista Coffee Membership</title>
    <link rel="stylesheet" href="/css/styles.css">
  </head>
  <body class="admin-page">
    <main class="admin-frame">
      <aside class="sidebar">
        <div class="brand"><span class="brand-mark">B</span><span>Barista</span></div>
        <nav class="nav" aria-label="Admin navigation">${navHtml}</nav>
        <form class="logout-form" method="post" action="/admin/logout">
          <input type="hidden" name="csrfToken" value="${csrfToken}">
          <button class="nav-logout" type="submit">Logout</button>
        </form>
      </aside>
      <section class="main">${options.body}</section>
    </main>
    <script src="/js/admin.js"></script>
  </body>
</html>`);
}

function pageMessage(query) {
  if (query.created === '1') {
    return '<div class="success-box">Customer account created.</div>';
  }

  if (query.package === 'saved') {
    return '<div class="success-box">Package purchase saved and balance updated.</div>';
  }

  if (query.delivery === 'saved') {
    return '<div class="success-box">Delivery recorded and balance updated.</div>';
  }

  if (query.delivery === 'voided') {
    return '<div class="success-box">Delivery voided and cups restored.</div>';
  }

  if (query.link === 'regenerated') {
    return '<div class="success-box">Customer balance link regenerated.</div>';
  }

  if (query.error === 'zero-balance') {
    return '<div class="error-box">Cannot record delivery because the current balance is 0.</div>';
  }

  if (query.error === 'insufficient-balance') {
    return '<div class="error-box">Cannot record delivery because the quantity is greater than the current balance.</div>';
  }

  if (query.error === 'invalid-quantity') {
    return '<div class="error-box">Delivery quantity must be a positive whole number.</div>';
  }

  if (query.error === 'already-voided') {
    return '<div class="error-box">This delivery has already been voided.</div>';
  }

  return '';
}

function buildCustomerBalanceAccessUrl(request, customer) {
  const origin = `${request.protocol}://${request.get('host')}`;
  return new URL(`/customer/access/${customer.balance_access_token}`, origin).toString();
}

function renderCustomerRows(customers) {
  if (customers.length === 0) {
    return '<tr><td colspan="7" class="empty-state">No matching customer was found.</td></tr>';
  }

  return customers
    .map(function buildCustomerRow(customer) {
      const balance = Number(customer.current_balance || 0);
      const status = balance <= 0 ? 'Needs package' : balance <= 5 ? 'Low balance' : 'Active';

      return `<tr>
        <td><a href="/admin/customers/${customer.id}"><strong>${escapeHtml(customer.name)}</strong></a></td>
        <td>${escapeHtml(customer.phone)}</td>
        <td>${escapeHtml(customer.email || '-')}</td>
        <td>${escapeHtml(customer.login_identifier)}</td>
        <td><span class="${balanceClass(balance)}">${balance} cups</span></td>
        <td>${status}</td>
        <td>${formatDate(customer.last_delivery_date)}</td>
      </tr>`;
    })
    .join('');
}

function renderViewAllAction(href) {
  if (!href) {
    return '';
  }

  return `<div class="history-actions"><a class="button secondary compact-button" href="${href}">View All</a></div>`;
}

function renderPackageHistory(purchases, options) {
  const renderOptions = options || {};
  const visiblePurchases = renderOptions.limit ? purchases.slice(0, renderOptions.limit) : purchases;

  if (purchases.length === 0) {
    return `<p class="empty-state">No package purchases recorded yet.</p>${renderViewAllAction(renderOptions.viewAllHref)}`;
  }

  return `<ul class="list">${visiblePurchases
    .map(function buildPurchaseItem(purchase) {
      return `<li class="list-item">
        <span><strong>${purchase.package_size}-cup package</strong><br>
        <span class="muted">+${purchase.bonus_cups} bonus, +${purchase.total_cups_added} total</span></span>
        <span>${formatMoney(purchase.amount_paid_cents)}<br>
        <span class="muted">${formatDate(purchase.created_at)} by ${escapeHtml(purchase.admin_username)}</span></span>
      </li>`;
    })
    .join('')}</ul>${renderViewAllAction(renderOptions.viewAllHref)}`;
}

function renderDeliveryHistory(deliveries, options) {
  const renderOptions = options || {};
  const visibleDeliveries = renderOptions.limit ? deliveries.slice(0, renderOptions.limit) : deliveries;

  if (deliveries.length === 0) {
    return `<p class="empty-state">No deliveries recorded yet.</p>${renderViewAllAction(renderOptions.viewAllHref)}`;
  }

  return `<ul class="list">${visibleDeliveries
    .map(function buildDeliveryItem(delivery) {
      const isVoided = Boolean(delivery.voided_at);
      const voidedNote = isVoided
        ? `<br><span class="void-label">Voided${delivery.voided_by_admin_username ? ` by ${escapeHtml(delivery.voided_by_admin_username)}` : ''}</span>`
        : '';
      const voidAction = isVoided
        ? ''
        : `<form method="post" action="/admin/deliveries/${delivery.id}/void">
          <input type="hidden" name="csrfToken" value="{{CSRF_TOKEN}}">
          <button class="button secondary compact-button" type="submit">Void delivery</button>
        </form>`;

      return `<li class="list-item">
        <span><strong>${delivery.delivered_cups} cup${delivery.delivered_cups === 1 ? '' : 's'} delivered</strong>${voidedNote}<br>
        <span class="muted">${escapeHtml(delivery.note || 'No note')}</span></span>
        <span>${formatDate(delivery.delivery_date)}<br>
        <span class="muted">${delivery.balance_after} after by ${escapeHtml(delivery.admin_username)}</span>
        ${voidAction}</span>
      </li>`;
    })
    .join('')}</ul>${renderViewAllAction(renderOptions.viewAllHref)}`;
}

router.get('/login', redirectAuthenticatedAdmin, function showLogin(request, response) {
  const message =
    request.query.message === 'session-expired'
      ? 'Session expired. Log in to continue.'
      : '';

  renderLogin(response, {
    csrfToken: response.locals.csrfToken,
    message: message,
    username: ''
  });
});

router.post('/login', redirectAuthenticatedAdmin, requireCsrfToken, async function handleLogin(request, response, next) {
  try {
    const adminUser = await authenticateAdmin(
      request.app.locals.database,
      request.body.username,
      request.body.password
    );

    if (!adminUser) {
      response.status(401);
      renderLogin(response, {
        csrfToken: response.locals.csrfToken,
        message: 'Invalid login. Check your credentials and try again.',
        username: request.body.username
      });
      return;
    }

    request.session.regenerate(function handleRegenerate(error) {
      if (error) {
        next(error);
        return;
      }

      request.session.user = adminUser;
      request.session.csrfToken = response.locals.csrfToken;
      response.redirect('/admin/dashboard');
    });
  } catch (error) {
    next(error);
  }
});

router.post('/logout', requireAdmin, requireCsrfToken, function handleLogout(request, response, next) {
  request.session.destroy(function handleDestroy(error) {
    if (error) {
      next(error);
      return;
    }

    response.clearCookie('barista.sid');
    response.redirect('/admin/login');
  });
});

router.get('/dashboard', requireAdmin, async function showDashboard(request, response, next) {
  try {
    const metrics = await getDashboardMetrics(request.app.locals.database);
    const lowBalanceRows = metrics.lowBalanceCustomers.length
      ? metrics.lowBalanceCustomers
          .map(function buildLowBalanceRow(customer) {
            return `<tr>
              <td><a href="/admin/customers/${customer.id}"><strong>${escapeHtml(customer.name)}</strong></a></td>
              <td>${escapeHtml(customer.phone)}</td>
              <td><span class="${balanceClass(customer.current_balance)}">${customer.current_balance} cups</span></td>
            </tr>`;
          })
          .join('')
      : '<tr><td colspan="3" class="empty-state">No low-balance customers.</td></tr>';
    const recentRows = metrics.recentDeliveries.length
      ? metrics.recentDeliveries
          .map(function buildRecentRow(delivery) {
            return `<li class="list-item">
              <span><strong><a href="/admin/customers/${delivery.customer_id}">${escapeHtml(delivery.customer_name)}</a></strong><br>
              <span class="muted">${escapeHtml(delivery.note || 'No note')}</span></span>
              <span>${delivery.delivered_cups} cup${delivery.delivered_cups === 1 ? '' : 's'}<br><span class="muted">${delivery.balance_after} after</span></span>
            </li>`;
          })
          .join('')
      : '<li class="empty-state">No deliveries recorded yet.</li>';

    renderAdminPage(response, {
      active: 'dashboard',
      title: 'Owner Dashboard',
      body: `<div class="topbar">
        <div><p class="eyebrow">Today</p><h1>Owner dashboard</h1></div>
        <div class="actions">
          <a class="button" href="/admin/customers/new">Add customer</a>
          <a class="button secondary" href="/admin/customers">Customer list</a>
        </div>
      </div>
      <div class="metric-grid">
        <section class="card"><p class="metric-label">Customers</p><p class="metric-value">${metrics.totalCustomers}</p><p class="muted">active accounts</p></section>
        <section class="card"><p class="metric-label">Outstanding cups</p><p class="metric-value">${metrics.totalOutstandingCups}</p><p class="muted">current balances</p></section>
        <section class="card"><p class="metric-label">Recorded revenue</p><p class="metric-value">${formatMoney(metrics.recordedPackageRevenueCents)}</p><p class="muted">package purchases</p></section>
        <section class="card"><p class="metric-label">Delivered cups</p><p class="metric-value">${metrics.totalCupsDelivered}</p><p class="muted">all time</p></section>
        <section class="card"><p class="metric-label">Bonus cups</p><p class="metric-value">${metrics.totalBonusCups}</p><p class="muted">granted</p></section>
      </div>
      <div class="content-grid">
        <section class="card"><h2>Low balance customers</h2><div class="table-wrap"><table><thead><tr><th>Customer</th><th>Phone</th><th>Balance</th></tr></thead><tbody>${lowBalanceRows}</tbody></table></div></section>
        <section class="card"><h2>Recent deliveries</h2><ul class="list">${recentRows}</ul><div class="history-actions"><a class="button secondary compact-button" href="/admin/deliveries">View all deliveries</a></div></section>
      </div>`
    });
  } catch (error) {
    next(error);
  }
});

router.get('/customers', requireAdmin, async function showCustomers(request, response, next) {
  try {
    const query = String(request.query.q || '').trim();
    const customers = await searchCustomers(request.app.locals.database, query);

    renderAdminPage(response, {
      active: 'customers',
      title: 'Customers',
      body: `<div class="topbar">
        <div><p class="eyebrow">Accounts</p><h1>Customer list</h1></div>
        <a class="button" href="/admin/customers/new">Add customer</a>
      </div>
      <section class="card">
        <form class="search-row" method="get" action="/admin/customers">
          <input name="q" value="${escapeHtml(query)}" placeholder="Search by name, phone, or login identifier">
          <button class="button secondary" type="submit">Search</button>
        </form>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>Login</th><th>Current balance</th><th>Status</th><th>Last delivery</th></tr></thead>
            <tbody>${renderCustomerRows(customers)}</tbody>
          </table>
        </div>
      </section>`
    });
  } catch (error) {
    next(error);
  }
});

router.get('/customers/new', requireAdmin, function showNewCustomer(request, response) {
  renderAdminPage(response, {
    active: 'customers',
    title: 'Add Customer',
    body: `<div class="topbar"><div><p class="eyebrow">New account</p><h1>Add customer</h1></div></div>
    <section class="card narrow-card">
      <form class="form" method="post" action="/admin/customers" data-loading-form>
        <input type="hidden" name="csrfToken" value="${escapeHtml(response.locals.csrfToken)}">
        <label>Name <input name="name" required></label>
        <label>Phone <input name="phone" required></label>
        <label>Email <input name="email" type="email"></label>
        <label>Login identifier <input name="loginIdentifier" required></label>
        <label>Initial password <input name="password" type="password" required></label>
        <div class="actions"><button class="button" type="submit">Save customer</button><a class="button secondary" href="/admin/customers">Cancel</a></div>
      </form>
    </section>`
  });
});

router.post('/customers', requireAdmin, requireCsrfToken, async function createCustomer(request, response, next) {
  try {
    const customer = await createCustomerAccount(request.app.locals.database, request.body);
    response.redirect(`/admin/customers/${customer.id}?created=1`);
  } catch (error) {
    if (error.code === 'DUPLICATE_PHONE' || error.code === 'DUPLICATE_LOGIN_IDENTIFIER') {
      response.status(400);
      renderAdminPage(response, {
        active: 'customers',
        title: 'Add Customer',
        body: `<div class="topbar"><div><p class="eyebrow">New account</p><h1>Add customer</h1></div></div>
        <section class="card narrow-card">
          <div class="error-box">${escapeHtml(error.message)}</div>
          <form class="form" method="post" action="/admin/customers" data-loading-form>
            <input type="hidden" name="csrfToken" value="${escapeHtml(response.locals.csrfToken)}">
            <label>Name <input name="name" required value="${escapeHtml(request.body.name)}"></label>
            <label>Phone <input name="phone" required value="${escapeHtml(request.body.phone)}"></label>
            <label>Email <input name="email" type="email" value="${escapeHtml(request.body.email)}"></label>
            <label>Login identifier <input name="loginIdentifier" required value="${escapeHtml(request.body.loginIdentifier)}"></label>
            <label>Initial password <input name="password" type="password" required></label>
            <div class="actions"><button class="button" type="submit">Save customer</button><a class="button secondary" href="/admin/customers">Cancel</a></div>
          </form>
        </section>`
      });
      return;
    }

    next(error);
  }
});

router.get('/customers/:customerId/package-purchases', requireAdmin, async function showCustomerPackageHistory(request, response, next) {
  try {
    const customerId = Number(request.params.customerId);
    const customer = await findCustomerById(request.app.locals.database, customerId);

    if (!customer) {
      response.status(404).send('Customer not found.');
      return;
    }

    const purchases = await listPackagePurchasesForCustomer(request.app.locals.database, customerId);

    renderAdminPage(response, {
      active: 'customers',
      title: `${customer.name} Package History`,
      body: `<div class="topbar">
        <div><p class="eyebrow">Newest first</p><h1>Package purchase history</h1></div>
        <a class="button secondary" href="/admin/customers/${customer.id}">Back to customer</a>
      </div>
      <section class="card">
        ${renderPackageHistory(purchases)}
      </section>`
    });
  } catch (error) {
    next(error);
  }
});

router.get('/customers/:customerId/deliveries', requireAdmin, async function showCustomerDeliveryHistory(request, response, next) {
  try {
    const customerId = Number(request.params.customerId);
    const customer = await findCustomerById(request.app.locals.database, customerId);

    if (!customer) {
      response.status(404).send('Customer not found.');
      return;
    }

    const deliveries = await listDeliveriesForCustomer(request.app.locals.database, customerId);

    renderAdminPage(response, {
      active: 'customers',
      title: `${customer.name} Delivery History`,
      body: `<div class="topbar">
        <div><p class="eyebrow">Newest first</p><h1>Delivery history</h1></div>
        <a class="button secondary" href="/admin/customers/${customer.id}">Back to customer</a>
      </div>
      <section class="card">
        ${renderDeliveryHistory(deliveries).replaceAll('{{CSRF_TOKEN}}', escapeHtml(response.locals.csrfToken))}
      </section>`
    });
  } catch (error) {
    next(error);
  }
});

router.get('/customers/:customerId', requireAdmin, async function showCustomerDetail(request, response, next) {
  try {
    const customerId = Number(request.params.customerId);
    const customer = await findCustomerById(request.app.locals.database, customerId);

    if (!customer) {
      response.status(404).send('Customer not found.');
      return;
    }

    const purchases = await listPackagePurchasesForCustomer(request.app.locals.database, customerId);
    const deliveries = await listDeliveriesForCustomer(request.app.locals.database, customerId);
    const balance = Number(customer.current_balance || 0);
    const balanceAccessUrl = buildCustomerBalanceAccessUrl(request, customer);
    const balanceAccessQrSvg = await QRCode.toString(balanceAccessUrl, {
      errorCorrectionLevel: 'M',
      margin: 1,
      type: 'svg',
      width: 180
    });
    const deliveryDisabled = balance <= 0 ? ' disabled' : '';
    const zeroWarning = balance <= 0
      ? '<div class="warning-strip">A package purchase is needed before delivery can be recorded.</div>'
      : balance <= 5
        ? '<div class="warning-strip">Low balance: 5 cups or fewer.</div>'
        : '';

    renderAdminPage(response, {
      active: 'customers',
      title: customer.name,
      body: `${pageMessage(request.query)}
      <div class="customer-hero">
        <section class="card">
          <p class="eyebrow">Customer</p>
          <h1>${escapeHtml(customer.name)}</h1>
          <p><strong>Phone:</strong> ${escapeHtml(customer.phone)}<br>
          <strong>Email:</strong> ${escapeHtml(customer.email || '-')}<br>
          <strong>Login identifier:</strong> ${escapeHtml(customer.login_identifier)}</p>
          <form class="inline-form delivery-form" method="post" action="/admin/customers/${customer.id}/deliveries" data-loading-form>
            <input type="hidden" name="csrfToken" value="${escapeHtml(response.locals.csrfToken)}">
            <input name="deliveredCups" type="number" min="1" max="${balance}" step="1" value="1" aria-label="Delivered cups"${deliveryDisabled}>
            <input name="note" placeholder="Optional delivery note"${deliveryDisabled}>
            <button class="button warning" type="submit"${deliveryDisabled}>Record delivery</button>
          </form>
        </section>
        <section class="balance-card">
          <p class="metric-label">Current balance</p>
          <p class="balance-number">${balance}</p>
          <p>cups available</p>
          ${zeroWarning}
        </section>
      </div>
      <div class="two-column">
        <section class="card">
          <h2>Record package purchase</h2>
          <form class="form" method="post" action="/admin/customers/${customer.id}/package-purchases" data-loading-form>
            <input type="hidden" name="csrfToken" value="${escapeHtml(response.locals.csrfToken)}">
            <label>Purchased cups
              <select name="packageSize" data-package-size>
                <option value="10">10 purchased cups</option>
                <option value="20">20 purchased cups</option>
                <option value="30">30 purchased cups</option>
              </select>
            </label>
            <div class="calc-box" data-package-preview>
              <span>Purchased cups: 10</span>
              <span>Calculated amount paid: 300.000 ₫</span>
              <span>Customer receives 1 bonus cup</span>
              <span>Total credited: 11 cups</span>
            </div>
            <button class="button" type="submit">Save package purchase</button>
          </form>
        </section>
        <section class="card">
          <h2>Package purchase history</h2>
          ${renderPackageHistory(purchases, {
            limit: HISTORY_PREVIEW_LIMIT,
            viewAllHref: `/admin/customers/${customer.id}/package-purchases`
          })}
        </section>
      </div>
      <section class="card section-gap">
        <div class="access-link-layout">
          <div>
            <p class="eyebrow">Customer access</p>
            <h2>Balance link</h2>
            <p class="muted">Share this read-only link or QR code with the customer.</p>
            <div class="share-link-row">
              <label class="share-link-field">Shareable link
                <input readonly value="${escapeHtml(balanceAccessUrl)}" data-balance-link>
              </label>
              <button class="button secondary compact-button" type="button" data-copy-text="${escapeHtml(balanceAccessUrl)}" data-copy-confirmation="Copied">Copy link</button>
              <span class="copy-status" data-copy-status aria-live="polite"></span>
            </div>
            <div class="actions section-actions access-actions">
              <button class="button secondary compact-button" type="button" data-toggle-target="customer-qr-${customer.id}">Show QR code</button>
              <form method="post" action="/admin/customers/${customer.id}/balance-link/regenerate">
                <input type="hidden" name="csrfToken" value="${escapeHtml(response.locals.csrfToken)}">
                <button class="button warning compact-button" type="submit">Regenerate link</button>
              </form>
            </div>
          </div>
          <aside class="qr-card" id="customer-qr-${customer.id}" hidden>
            <p class="metric-label">Customer QR code</p>
            <div class="qr-code">${balanceAccessQrSvg}</div>
          </aside>
        </div>
      </section>
      <section class="card section-gap">
        <h2>Delivery history</h2>
        ${renderDeliveryHistory(deliveries, {
          limit: HISTORY_PREVIEW_LIMIT,
          viewAllHref: `/admin/customers/${customer.id}/deliveries`
        }).replaceAll('{{CSRF_TOKEN}}', escapeHtml(response.locals.csrfToken))}
      </section>`
    });
  } catch (error) {
    next(error);
  }
});

router.post('/customers/:customerId/balance-link/regenerate', requireAdmin, requireCsrfToken, async function regenerateBalanceLink(request, response, next) {
  try {
    const customerId = Number(request.params.customerId);
    const customer = await findCustomerById(request.app.locals.database, customerId);

    if (!customer) {
      response.status(404).send('Customer not found.');
      return;
    }

    await rotateCustomerBalanceAccessToken(request.app.locals.database, customerId);
    response.redirect(`/admin/customers/${customerId}?link=regenerated`);
  } catch (error) {
    next(error);
  }
});

router.post('/customers/:customerId/package-purchases', requireAdmin, requireCsrfToken, async function savePackagePurchase(request, response, next) {
  try {
    await recordPackagePurchase(
      request.app.locals.database,
      Number(request.params.customerId),
      Number(request.body.packageSize),
      request.session.user.id
    );
    response.redirect(`/admin/customers/${request.params.customerId}?package=saved`);
  } catch (error) {
    next(error);
  }
});

router.post('/customers/:customerId/deliveries', requireAdmin, requireCsrfToken, async function saveDelivery(request, response, next) {
  try {
    await recordDelivery(
      request.app.locals.database,
      Number(request.params.customerId),
      request.body.deliveredCups,
      request.session.user.id,
      request.body.note
    );
    response.redirect(`/admin/customers/${request.params.customerId}?delivery=saved`);
  } catch (error) {
    if (error.code === 'ZERO_BALANCE') {
      response.redirect(`/admin/customers/${request.params.customerId}?error=zero-balance`);
      return;
    }

    if (error.code === 'INSUFFICIENT_BALANCE') {
      response.redirect(`/admin/customers/${request.params.customerId}?error=insufficient-balance`);
      return;
    }

    if (error.code === 'INVALID_DELIVERY_QUANTITY') {
      response.redirect(`/admin/customers/${request.params.customerId}?error=invalid-quantity`);
      return;
    }

    next(error);
  }
});

router.post('/deliveries/:deliveryId/void', requireAdmin, requireCsrfToken, async function voidDeliveryRoute(request, response, next) {
  try {
    const result = await voidDelivery(
      request.app.locals.database,
      Number(request.params.deliveryId),
      request.session.user.id
    );

    response.redirect(`/admin/customers/${result.customerId}?delivery=voided`);
  } catch (error) {
    if (error.code === 'DELIVERY_ALREADY_VOIDED') {
      response.redirect('/admin/deliveries?error=already-voided');
      return;
    }

    next(error);
  }
});

router.get('/deliveries', requireAdmin, async function showDeliveries(request, response, next) {
  try {
    const currentPage = Math.max(Number.parseInt(request.query.page || '1', 10) || 1, 1);
    const offset = (currentPage - 1) * ADMIN_DELIVERIES_PAGE_SIZE;
    const deliveriesPlusOne = await listRecentDeliveries(request.app.locals.database, ADMIN_DELIVERIES_PAGE_SIZE + 1, offset);
    const hasNextPage = deliveriesPlusOne.length > ADMIN_DELIVERIES_PAGE_SIZE;
    const deliveries = deliveriesPlusOne.slice(0, ADMIN_DELIVERIES_PAGE_SIZE);
    const pagination = `<div class="pagination-row">
      ${currentPage > 1 ? `<a class="button secondary compact-button" href="/admin/deliveries?page=${currentPage - 1}">Newer</a>` : '<span></span>'}
      <span class="muted">Page ${currentPage}</span>
      ${hasNextPage ? `<a class="button secondary compact-button" href="/admin/deliveries?page=${currentPage + 1}">Older</a>` : '<span></span>'}
    </div>`;
    const rows = deliveries.length
      ? deliveries
          .map(function buildDeliveryRow(delivery) {
            return `<tr>
              <td>${formatDate(delivery.delivery_date)}</td>
              <td><a href="/admin/customers/${delivery.customer_id}"><strong>${escapeHtml(delivery.customer_name)}</strong></a></td>
              <td>${delivery.delivered_cups}${delivery.voided_at ? ' (voided)' : ''}</td>
              <td><span class="${balanceClass(delivery.balance_after)}">${delivery.balance_after} after</span></td>
              <td>${escapeHtml(delivery.admin_username)}</td>
              <td>${escapeHtml(delivery.note || '-')}${delivery.voided_at ? '<br><span class="void-label">Voided</span>' : ''}</td>
            </tr>`;
          })
          .join('')
      : '<tr><td colspan="6" class="empty-state">No deliveries recorded yet.</td></tr>';

    renderAdminPage(response, {
      active: 'deliveries',
      title: 'Delivery History',
      body: `${pageMessage(request.query)}
      <div class="topbar"><div><p class="eyebrow">Newest first</p><h1>Delivery history</h1></div></div>
      <section class="card">
        <div class="table-wrap">
          <table>
            <thead><tr><th>Date</th><th>Customer</th><th>Cups</th><th>Balance after</th><th>Admin</th><th>Note</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
        ${pagination}
      </section>`
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
