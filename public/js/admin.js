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
    10: { bonus: 1, total: 11 },
    20: { bonus: 2, total: 22 },
    30: { bonus: 0, total: 30 }
  };
  const credits = packageCredits[packageSize];

  packagePreview.textContent = `${packageSize} package cups + ${credits.bonus} bonus cup${credits.bonus === 1 ? '' : 's'} = ${credits.total} total cups`;
}

if (packageSizeSelect) {
  packageSizeSelect.addEventListener('change', updatePackagePreview);
  updatePackagePreview();
}
