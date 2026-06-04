document.querySelectorAll('[data-loading-form]').forEach(function bindLoadingState(form) {
  form.addEventListener('submit', function handleSubmit() {
    const button = form.querySelector('button[type="submit"]');

    if (button) {
      button.disabled = true;
      button.textContent = 'Checking...';
    }
  });
});

const packagePreview = document.querySelector('[data-package-preview]');
const packageSizeSelect = document.querySelector('[data-package-size]');

function updatePackagePreview() {
  if (!packagePreview || !packageSizeSelect) {
    return;
  }

  const packageSize = Number(packageSizeSelect.value);
  const packageCredits = {
    10: { amount: '300.000 ₫', bonus: 1, total: 11 },
    20: { amount: '600.000 ₫', bonus: 2, total: 22 },
    30: { amount: '900.000 ₫', bonus: 3, total: 33 }
  };
  const credits = packageCredits[packageSize];
  const bonusNote = credits.bonus === 0
    ? 'No bonus cups for this package'
    : `Customer receives ${credits.bonus} bonus cup${credits.bonus === 1 ? '' : 's'}`;

  packagePreview.innerHTML = `
    <span>Purchased cups: ${packageSize}</span>
    <span>Calculated amount paid: ${credits.amount}</span>
    <span>${bonusNote}</span>
    <span>Total credited: ${credits.total} cups</span>
  `;
}

if (packageSizeSelect) {
  packageSizeSelect.addEventListener('change', updatePackagePreview);
  updatePackagePreview();
}

document.querySelectorAll('[data-copy-text]').forEach(function bindCopyButton(button) {
  button.addEventListener('click', async function handleCopy() {
    const status = button.parentElement.querySelector('[data-copy-status]');

    try {
      await navigator.clipboard.writeText(button.dataset.copyText);
      if (status) {
        status.textContent = button.dataset.copyConfirmation || 'Copied';
      }
    } catch (error) {
      if (status) {
        status.textContent = 'Copy failed';
      }
    }

    window.setTimeout(function restoreLabel() {
      if (status) {
        status.textContent = '';
      }
    }, 1800);
  });
});

document.querySelectorAll('[data-toggle-target]').forEach(function bindToggleButton(button) {
  button.addEventListener('click', function handleToggle() {
    const target = document.getElementById(button.dataset.toggleTarget);

    if (!target) {
      return;
    }

    target.hidden = !target.hidden;
    button.textContent = target.hidden ? 'Show QR code' : 'Hide QR code';
  });
});

function updateCustomerHeroGreeting() {
  const greeting = document.querySelector('[data-dynamic-greeting]');
  const message = document.querySelector('[data-dynamic-message]');

  if (!greeting || !message) {
    return;
  }

  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    greeting.textContent = 'Good morning ☀️';
    message.textContent = 'Ready for your coffee today?';
    return;
  }

  if (hour >= 12 && hour < 18) {
    greeting.textContent = 'Good afternoon 🌤️';
    message.textContent = 'Need a coffee break this afternoon?';
    return;
  }

  greeting.textContent = 'Good evening 🌙';
  message.textContent = 'Thanks for visiting us today.';
}

function bindNotificationBells() {
  document.querySelectorAll('[data-notification-bell]').forEach(function bindNotificationBell(bell) {
    if (bell.dataset.notificationBound === '1') {
      return;
    }

    bell.dataset.notificationBound = '1';
    const menu = bell.closest('[data-notification-menu]');
    const popover = menu ? menu.querySelector('[data-notification-popover]') : null;
    const closeButton = menu ? menu.querySelector('[data-notification-close]') : null;

    function closePopover() {
      if (!popover) {
        return;
      }

      popover.hidden = true;
      bell.setAttribute('aria-expanded', 'false');
    }

    bell.addEventListener('click', function toggleNotification(event) {
      event.preventDefault();
      event.stopPropagation();

      if (!popover) {
        return;
      }

      popover.hidden = !popover.hidden;
      bell.setAttribute('aria-expanded', popover.hidden ? 'false' : 'true');
    });

    if (closeButton) {
      closeButton.addEventListener('click', function handleClose(event) {
        event.preventDefault();
        event.stopPropagation();
        closePopover();
      });
    }

    if (menu) {
      menu.addEventListener('click', function keepPopoverOpen(event) {
        event.stopPropagation();
      });
    }

    document.addEventListener('click', closePopover);
    document.addEventListener('keydown', function handleEscape(event) {
      if (event.key === 'Escape') {
        closePopover();
      }
    });

    if (bell.dataset.notificationState === 'normal') {
      return;
    }

    function shakeBell() {
      bell.classList.remove('bell-shake');
      window.requestAnimationFrame(function restartAnimation() {
        bell.classList.add('bell-shake');
      });
    }

    bell.addEventListener('animationend', function clearShake() {
      bell.classList.remove('bell-shake');
    });

    window.setTimeout(shakeBell, 800);
    window.setInterval(shakeBell, 15000);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function initializeCustomerUi() {
    updateCustomerHeroGreeting();
    bindNotificationBells();
  });
} else {
  updateCustomerHeroGreeting();
  bindNotificationBells();
}
