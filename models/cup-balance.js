function calculatePackageCredits(packageSize) {
  const normalizedPackageSize = Number(packageSize);

  if (normalizedPackageSize === 10) {
    return {
      packageSize: 10,
      bonusCups: 1,
      totalCupsAdded: 11
    };
  }

  if (normalizedPackageSize === 20) {
    return {
      packageSize: 20,
      bonusCups: 2,
      totalCupsAdded: 22
    };
  }

  if (normalizedPackageSize === 30) {
    return {
      packageSize: 30,
      bonusCups: 0,
      totalCupsAdded: 30
    };
  }

  throw new Error('Invalid package size. Package size must be 10, 20, or 30.');
}

module.exports = {
  calculatePackageCredits
};
