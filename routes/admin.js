const express = require('express');
const fs = require('fs');
const path = require('path');

const { authenticateAdmin } = require('../models/admin-user');
const {
  createCustomerAccount,
  findCustomerById,
  searchCustomers
} = require('../models/customer-account');
const {
  listPackagePurchasesForCustomer,
  recordPackagePurchase
} = require('../models/package-purchase');
const {
  listDeliveriesForCustomer,
  listRecentDeliveries,
  recordDelivery
} = require('../models/delivery-history');
const { getDashboardMetrics } = require('../models/dashboard');
const { redirectAuthenticatedAdmin, requireAdmin } = require('../middleware/auth');
const { requireCsrfToken } = require('../middleware/csrf');

const router = express.Router();

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatMoney(cents) {
  return `$${((cents || 0) / 100).toFixed(2)}`;
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

  if (query.error === 'zero-balance') {
    return '<div class="error-box">Cannot record delivery because the current balance is 0.</div>';
  }

  return '';
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

function renderPackageHistory(purchases) {
  if (purchases.length === 0) {
    return '<p class="empty-state">No package purchases recorded yet.</p>';
  }

  return `<ul class="list">${purchases
    .map(function buildPurchaseItem(purchase) {
      return `<li class="list-item">
        <span><strong>${purchase.package_size}-cup package</strong><br>
        <span class="muted">+${purchase.bonus_cups} bonus, +${purchase.total_cups_added} total</span></span>
        <span>${formatMoney(purchase.amount_paid_cents)}<br>
        <span class="muted">${formatDate(purchase.created_at)} by ${escapeHtml(purchase.admin_username)}</span></span>
      </li>`;
    })
    .join('')}</ul>`;
}

function renderDeliveryHistory(deliveries) {
  if (deliveries.length === 0) {
    return '<p class="empty-state">No deliveries recorded yet.</p>';
  }

  return `<ul class="list">${deliveries
    .map(function buildDeliveryItem(delivery) {
      return `<li class="list-item">
        <span><strong>${delivery.delivered_cups} cup delivered</strong><br>
        <span class="muted">${escapeHtml(delivery.note || 'No note')}</span></span>
        <span>${formatDate(delivery.delivery_date)}<br>
        <span class="muted">${delivery.balance_after} after by ${escapeHtml(delivery.admin_username)}</span></span>
      </li>`;
    })
    .join('')}</ul>`;
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
              <span>${formatDate(delivery.delivery_date)}<br><span class="muted">${delivery.balance_after} after</span></span>
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
        <section class="card"><h2>Recent deliveries</h2><ul class="list">${recentRows}</ul></section>
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
          <form class="inline-form" method="post" action="/admin/customers/${customer.id}/deliveries" data-loading-form>
            <input type="hidden" name="csrfToken" value="${escapeHtml(response.locals.csrfToken)}">
            <input name="note" placeholder="Optional delivery note"${deliveryDisabled}>
            <button class="button warning" type="submit"${deliveryDisabled}>Record 1 cup delivery</button>
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
            <label>Package size
              <select name="packageSize" data-package-size>
                <option value="10">10 cups + 1 bonus = 11 total</option>
                <option value="20">20 cups + 2 bonus = 22 total</option>
                <option value="30">30 cups + 0 bonus = 30 total</option>
              </select>
            </label>
            <label>Amount paid <input name="amountPaid" placeholder="0.00"></label>
            <div class="calc-box" data-package-preview>10 package cups + 1 bonus cup = 11 total cups</div>
            <button class="button" type="submit">Save package purchase</button>
          </form>
        </section>
        <section class="card">
          <h2>Package purchase history</h2>
          ${renderPackageHistory(purchases)}
        </section>
      </div>
      <section class="card section-gap">
        <h2>Delivery history</h2>
        ${renderDeliveryHistory(deliveries)}
      </section>`
    });
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
      request.body.amountPaid,
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
      request.session.user.id,
      request.body.note
    );
    response.redirect(`/admin/customers/${request.params.customerId}?delivery=saved`);
  } catch (error) {
    if (error.code === 'ZERO_BALANCE') {
      response.redirect(`/admin/customers/${request.params.customerId}?error=zero-balance`);
      return;
    }

    next(error);
  }
});

router.get('/deliveries', requireAdmin, async function showDeliveries(request, response, next) {
  try {
    const deliveries = await listRecentDeliveries(request.app.locals.database, 50);
    const rows = deliveries.length
      ? deliveries
          .map(function buildDeliveryRow(delivery) {
            return `<tr>
              <td>${formatDate(delivery.delivery_date)}</td>
              <td><a href="/admin/customers/${delivery.customer_id}"><strong>${escapeHtml(delivery.customer_name)}</strong></a></td>
              <td>${delivery.delivered_cups}</td>
              <td><span class="${balanceClass(delivery.balance_after)}">${delivery.balance_after} after</span></td>
              <td>${escapeHtml(delivery.admin_username)}</td>
              <td>${escapeHtml(delivery.note || '-')}</td>
            </tr>`;
          })
          .join('')
      : '<tr><td colspan="6" class="empty-state">No deliveries recorded yet.</td></tr>';

    renderAdminPage(response, {
      active: 'deliveries',
      title: 'Delivery History',
      body: `<div class="topbar"><div><p class="eyebrow">Newest first</p><h1>Delivery history</h1></div></div>
      <section class="card">
        <div class="table-wrap">
          <table>
            <thead><tr><th>Date</th><th>Customer</th><th>Cups</th><th>Balance after</th><th>Admin</th><th>Note</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </section>`
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
