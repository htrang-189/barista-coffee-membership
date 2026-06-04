const express = require('express');
const fs = require('fs');
const path = require('path');

const {
  authenticateCustomer,
  findCustomerByBalanceAccessToken,
  findCustomerById
} = require('../models/customer-account');
const { listDeliveriesForCustomer } = require('../models/delivery-history');
const { listPackagePurchasesForCustomer } = require('../models/package-purchase');
const { redirectAuthenticatedCustomer, requireCustomer } = require('../middleware/auth');
const { requireCsrfToken } = require('../middleware/csrf');

const router = express.Router();
const HISTORY_PREVIEW_LIMIT = 5;

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
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

  html = html.replace(/\{\{[A-Z0-9_]+\}\}/g, '');

  response.send(html);
}

function renderLogin(response, options) {
  const loginTemplatePath = path.join(__dirname, '..', 'views', 'shared', 'customer-login.html');
  const message = options.message
    ? `<div class="error-box">${escapeHtml(options.message)}</div>`
    : '';

  renderTemplate(response, loginTemplatePath, {
    CSRF_TOKEN: escapeHtml(options.csrfToken),
    LOGIN_IDENTIFIER: escapeHtml(options.loginIdentifier),
    MESSAGE: message
  });
}

function renderViewAllAction(href) {
  if (!href) {
    return '';
  }

  return `<div class="history-actions"><a class="button secondary compact-button" href="${href}">View All</a></div>`;
}

function renderNotificationBell(balance) {
  const hasNotification = balance <= 5;
  const state = balance <= 0 ? 'critical' : hasNotification ? 'low' : 'normal';
  const badge = hasNotification ? '<span class="notification-badge" aria-hidden="true"></span>' : '';
  const label = balance <= 0
    ? 'Critical balance notification'
    : hasNotification
      ? 'Low balance notification'
      : 'No balance notifications';
  const title = balance <= 0
    ? 'Your package has ended'
    : hasNotification
      ? 'Your package is running low'
      : 'No new notifications';
  const message = balance <= 0
    ? 'You have 0 cups remaining. Please buy a new package.'
    : hasNotification
      ? `You only have ${balance} cup${balance === 1 ? '' : 's'} remaining. Please buy a new package soon.`
      : 'Your membership balance is looking good.';

  return `<div class="notification-menu" id="customer-notification-menu" data-notification-menu>
    <button class="notification-bell ${hasNotification ? 'has-alert' : ''} ${state === 'critical' ? 'critical' : ''}" id="customer-notification-bell" type="button" data-notification-bell data-notification-state="${state}" aria-label="${label}" aria-controls="customer-notification-popover" aria-expanded="false">
      <svg class="bell-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M18 16v-5a6 6 0 0 0-12 0v5l-2 2h20l-2-2z"></path>
      <path d="M9 20a3 3 0 0 0 6 0"></path>
      </svg>
      ${badge}
    </button>
    <div class="notification-popover" id="customer-notification-popover" data-notification-popover hidden>
      <div>
        <p class="notification-title">${escapeHtml(title)}</p>
        <p class="notification-message">${escapeHtml(message)}</p>
      </div>
      <button class="notification-close" type="button" data-notification-close aria-label="Close notification">Close</button>
    </div>
  </div>`;
}

function renderNotificationFallbackScript() {
  return `<script>
(function () {
  function bindCustomerNotifications() {
    document.querySelectorAll('[data-notification-bell]').forEach(function (bell) {
      if (bell.dataset.notificationBound === '1') return;
      bell.dataset.notificationBound = '1';
      var menu = bell.closest('[data-notification-menu]');
      var popover = menu ? menu.querySelector('[data-notification-popover]') : null;
      var closeButton = menu ? menu.querySelector('[data-notification-close]') : null;
      function closePopover() {
        if (!popover) return;
        popover.hidden = true;
        bell.setAttribute('aria-expanded', 'false');
      }
      bell.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        if (!popover) return;
        popover.hidden = !popover.hidden;
        bell.setAttribute('aria-expanded', popover.hidden ? 'false' : 'true');
      });
      if (closeButton) {
        closeButton.addEventListener('click', function (event) {
          event.preventDefault();
          event.stopPropagation();
          closePopover();
        });
      }
      if (menu) {
        menu.addEventListener('click', function (event) {
          event.stopPropagation();
        });
      }
      document.addEventListener('click', closePopover);
      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') closePopover();
      });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindCustomerNotifications);
  } else {
    bindCustomerNotifications();
  }
}());
</script>`;
}

function renderBalanceNotification(balance) {
  if (balance <= 0) {
    return `<section class="member-notification exhausted">
      <strong>Your package is exhausted.</strong>
      <span>You have 0 cups remaining. Please ask the shop owner to add a new package.</span>
    </section>`;
  }

  if (balance <= 5) {
    return `<section class="member-notification">
      <strong>Your package is running low.</strong>
      <span>Only ${balance} cup${balance === 1 ? '' : 's'} remaining.</span>
    </section>`;
  }

  return '';
}

function renderCupProgress(usedCups, remainingCups) {
  const totalCups = usedCups + remainingCups;
  const percentUsed = totalCups > 0 ? Math.round((usedCups / totalCups) * 100) : 0;
  const progressClass = remainingCups <= 2
    ? 'danger'
    : remainingCups <= 5
      ? 'low'
      : '';
  const helperText = remainingCups <= 2
    ? `Only ${remainingCups} cup${remainingCups === 1 ? '' : 's'} remaining.`
    : remainingCups <= 5
      ? 'Your package is running low.'
      : '';

  return `<section class="cup-progress-card ${progressClass}">
    <div class="cup-progress-meta">
      <span>${usedCups} used</span>
      <span>${remainingCups} remaining</span>
    </div>
    <div class="cup-progress-track" aria-label="${usedCups} of ${totalCups} cups consumed">
      <div class="cup-progress-fill" style="--progress-width: ${percentUsed}%;"></div>
    </div>
    <div class="cup-progress-caption">
      <span>${usedCups} / ${totalCups} cups consumed</span>
      ${helperText ? `<span class="cup-progress-helper">${escapeHtml(helperText)}</span>` : ''}
    </div>
  </section>`;
}

function renderPackageHistory(purchases, options) {
  const renderOptions = options || {};
  const visiblePurchases = renderOptions.limit ? purchases.slice(0, renderOptions.limit) : purchases;

  if (purchases.length === 0) {
    return `<p class="empty-state">No top ups yet.</p>${renderViewAllAction(renderOptions.viewAllHref)}`;
  }

  return `<ul class="member-history-list">${visiblePurchases
    .map(function buildPurchaseItem(purchase) {
      const bonusCopy = purchase.bonus_cups > 0
        ? `Includes +${purchase.bonus_cups} bonus cup${purchase.bonus_cups === 1 ? '' : 's'}`
        : 'No bonus cups';

      return `<li class="member-history-item package-item">
        <div class="history-marker plus">+</div>
        <div class="history-main">
          <strong>${purchase.package_size}-cup package</strong>
          <span>${bonusCopy}</span>
          <span class="muted">${formatDate(purchase.created_at)}</span>
        </div>
        <div class="history-count">+${purchase.total_cups_added} cups</div>
      </li>`;
    })
    .join('')}</ul>${renderViewAllAction(renderOptions.viewAllHref)}`;
}

function renderDeliveryHistory(deliveries, options) {
  const renderOptions = options || {};
  const visibleDeliveries = renderOptions.limit ? deliveries.slice(0, renderOptions.limit) : deliveries;

  if (deliveries.length === 0) {
    return `<p class="empty-state">No visits yet.</p>${renderViewAllAction(renderOptions.viewAllHref)}`;
  }

  return `<ul class="member-history-list">${visibleDeliveries
    .map(function buildDeliveryItem(delivery) {
      const note = delivery.note
        ? `<span>${escapeHtml(delivery.note)}</span>`
        : '';
      const voidedLabel = delivery.voided_at
        ? '<span class="void-label">Voided</span>'
        : '';

      return `<li class="member-history-item delivery-item">
        <div class="history-marker minus">-</div>
        <div class="history-main">
          <strong>${delivery.delivered_cups} cup${delivery.delivered_cups === 1 ? '' : 's'} used</strong>
          ${note}
          ${voidedLabel}
          <span class="muted">${formatDate(delivery.delivery_date)}</span>
        </div>
        <div class="history-count">${delivery.balance_after} cups left</div>
      </li>`;
    })
    .join('')}</ul>${renderViewAllAction(renderOptions.viewAllHref)}`;
}

function renderCustomerShell(response, options) {
  const notificationBell = options.notificationBell || '';

  response.send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(options.title)} | Barista Coffee Membership</title>
    <link rel="stylesheet" href="/css/styles.css">
    <script src="/js/admin.js" defer></script>
  </head>
  <body class="customer-page">
    <main class="customer-shell">
      <header class="customer-header">
        <div class="brand">
          <span class="brand-mark">B</span>
          <span>Barista Membership</span>
        </div>
        <div class="customer-header-actions">
          ${notificationBell}
          ${options.authAction || ''}
        </div>
      </header>
      ${options.body}
    </main>
    ${renderNotificationFallbackScript()}
  </body>
</html>`);
}

function renderCustomerLogoutAction(response) {
  return `<form method="post" action="/customer/logout">
    <input type="hidden" name="csrfToken" value="${escapeHtml(response.locals.csrfToken)}">
    <button class="button secondary" type="submit">Logout</button>
  </form>`;
}

async function renderCustomerBalancePage(request, response, customer, options) {
  const purchases = await listPackagePurchasesForCustomer(request.app.locals.database, customer.id);
  const deliveries = await listDeliveriesForCustomer(request.app.locals.database, customer.id);
  const balance = Number(customer.current_balance || 0);
  const usedCups = deliveries.reduce(function sumUsed(total, delivery) {
    if (delivery.voided_at) {
      return total;
    }

    return total + Number(delivery.delivered_cups || 0);
  }, 0);
  const authAction = options.showLogout
    ? renderCustomerLogoutAction(response)
    : '';
  const balanceTemplatePath = path.join(__dirname, '..', 'views', 'customer', 'balance.html');

  renderTemplate(response, balanceTemplatePath, {
    AUTH_ACTION: authAction,
    BALANCE_CLASS: balanceClass(balance),
    BALANCE_NOTIFICATION: renderBalanceNotification(balance),
    CURRENT_BALANCE: escapeHtml(balance),
    CUP_PROGRESS: renderCupProgress(usedCups, balance),
    CUSTOMER_NAME: escapeHtml(customer.name),
    DELIVERY_HISTORY: renderDeliveryHistory(deliveries, {
      limit: HISTORY_PREVIEW_LIMIT,
      viewAllHref: options.deliveryHistoryHref
    }),
    NOTIFICATION_BELL: renderNotificationBell(balance),
    PACKAGE_HISTORY: renderPackageHistory(purchases, {
      limit: HISTORY_PREVIEW_LIMIT,
      viewAllHref: options.packageHistoryHref
    }),
    NOTIFICATION_FALLBACK_SCRIPT: renderNotificationFallbackScript(),
    USED_CUPS: escapeHtml(usedCups)
  });
}

async function renderCustomerFullHistoryPage(request, response, customer, options) {
  const authAction = options.showLogout ? renderCustomerLogoutAction(response) : '';
  const balance = Number(customer.current_balance || 0);
  const historyHtml = options.historyType === 'packages'
    ? renderPackageHistory(await listPackagePurchasesForCustomer(request.app.locals.database, customer.id))
    : renderDeliveryHistory(await listDeliveriesForCustomer(request.app.locals.database, customer.id));

  renderCustomerShell(response, {
    title: options.title,
    authAction,
    notificationBell: renderNotificationBell(balance),
    body: `<div class="topbar customer-history-topbar">
      <div><p class="eyebrow">Newest first</p><h1>${escapeHtml(options.heading)}</h1></div>
      <a class="button secondary" href="${options.backHref}">Back to balance</a>
    </div>
    ${renderBalanceNotification(balance)}
    <section class="member-history-section full-history">
      ${historyHtml}
    </section>`
  });
}

router.get('/login', redirectAuthenticatedCustomer, function showLogin(request, response) {
  const message =
    request.query.message === 'session-expired'
      ? 'Session expired. Log in to continue.'
      : '';

  renderLogin(response, {
    csrfToken: response.locals.csrfToken,
    loginIdentifier: '',
    message
  });
});

router.post('/login', redirectAuthenticatedCustomer, requireCsrfToken, async function handleLogin(request, response, next) {
  try {
    const customerUser = await authenticateCustomer(
      request.app.locals.database,
      request.body.loginIdentifier,
      request.body.password
    );

    if (!customerUser) {
      response.status(401);
      renderLogin(response, {
        csrfToken: response.locals.csrfToken,
        loginIdentifier: request.body.loginIdentifier,
        message: 'Invalid login. Check your credentials and try again.'
      });
      return;
    }

    request.session.regenerate(function handleRegenerate(error) {
      if (error) {
        next(error);
        return;
      }

      request.session.user = customerUser;
      request.session.csrfToken = response.locals.csrfToken;
      response.redirect('/customer/balance');
    });
  } catch (error) {
    next(error);
  }
});

router.post('/logout', requireCustomer, requireCsrfToken, function handleLogout(request, response, next) {
  request.session.destroy(function handleDestroy(error) {
    if (error) {
      next(error);
      return;
    }

    response.clearCookie('barista.sid');
    response.redirect('/customer/login');
  });
});

router.get('/access/:token', async function showTokenBalance(request, response, next) {
  try {
    const customer = await findCustomerByBalanceAccessToken(request.app.locals.database, request.params.token);

    if (!customer) {
      response.status(404).send('Customer balance link not found.');
      return;
    }

    await renderCustomerBalancePage(request, response, customer, {
      deliveryHistoryHref: `/customer/access/${encodeURIComponent(request.params.token)}/delivery-history`,
      packageHistoryHref: `/customer/access/${encodeURIComponent(request.params.token)}/package-history`,
      showLogout: false
    });
  } catch (error) {
    next(error);
  }
});

router.get('/access/:token/package-history', async function showTokenPackageHistory(request, response, next) {
  try {
    const customer = await findCustomerByBalanceAccessToken(request.app.locals.database, request.params.token);

    if (!customer) {
      response.status(404).send('Customer balance link not found.');
      return;
    }

    await renderCustomerFullHistoryPage(request, response, customer, {
      backHref: `/customer/access/${encodeURIComponent(request.params.token)}`,
      heading: 'Package history',
      historyType: 'packages',
      showLogout: false,
      title: 'Package History'
    });
  } catch (error) {
    next(error);
  }
});

router.get('/access/:token/delivery-history', async function showTokenDeliveryHistory(request, response, next) {
  try {
    const customer = await findCustomerByBalanceAccessToken(request.app.locals.database, request.params.token);

    if (!customer) {
      response.status(404).send('Customer balance link not found.');
      return;
    }

    await renderCustomerFullHistoryPage(request, response, customer, {
      backHref: `/customer/access/${encodeURIComponent(request.params.token)}`,
      heading: 'Delivery history',
      historyType: 'deliveries',
      showLogout: false,
      title: 'Delivery History'
    });
  } catch (error) {
    next(error);
  }
});

router.get('/balance', requireCustomer, async function showBalance(request, response, next) {
  try {
    const customer = await findCustomerById(request.app.locals.database, request.session.user.id);

    if (!customer) {
      request.session.destroy(function handleDestroy(error) {
        if (error) {
          next(error);
          return;
        }

        response.clearCookie('barista.sid');
        response.redirect('/customer/login?message=session-expired');
      });
      return;
    }

    await renderCustomerBalancePage(request, response, customer, {
      deliveryHistoryHref: '/customer/delivery-history',
      packageHistoryHref: '/customer/package-history',
      showLogout: true
    });
  } catch (error) {
    next(error);
  }
});

router.get('/package-history', requireCustomer, async function showCustomerPackageHistory(request, response, next) {
  try {
    const customer = await findCustomerById(request.app.locals.database, request.session.user.id);

    if (!customer) {
      response.redirect('/customer/login?message=session-expired');
      return;
    }

    await renderCustomerFullHistoryPage(request, response, customer, {
      backHref: '/customer/balance',
      heading: 'Package history',
      historyType: 'packages',
      showLogout: true,
      title: 'Package History'
    });
  } catch (error) {
    next(error);
  }
});

router.get('/delivery-history', requireCustomer, async function showCustomerDeliveryHistory(request, response, next) {
  try {
    const customer = await findCustomerById(request.app.locals.database, request.session.user.id);

    if (!customer) {
      response.redirect('/customer/login?message=session-expired');
      return;
    }

    await renderCustomerFullHistoryPage(request, response, customer, {
      backHref: '/customer/balance',
      heading: 'Delivery history',
      historyType: 'deliveries',
      showLogout: true,
      title: 'Delivery History'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
