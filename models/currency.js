function formatVndFromCents(amountPaidCents) {
  const amountInVnd = Math.round(Number(amountPaidCents || 0) / 100);
  const formattedAmount = new Intl.NumberFormat('vi-VN', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  }).format(amountInVnd);

  return `${formattedAmount} ₫`;
}

function parseVndToCents(amountPaid) {
  const normalizedAmount = String(amountPaid || '').replace(/[₫,\s]/g, '').replace(/\./g, '');

  if (!normalizedAmount) {
    return 0;
  }

  if (!/^\d+$/.test(normalizedAmount)) {
    throw new Error('Amount paid must be a valid non-negative VND amount.');
  }

  return Number(normalizedAmount) * 100;
}

module.exports = {
  formatVndFromCents,
  parseVndToCents
};
