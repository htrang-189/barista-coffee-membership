const assert = require('node:assert/strict');
const test = require('node:test');

const { calculatePackageCredits } = require('../models/cup-balance');

test('10 cup package credits 11 total cups', function testTenCupPackage() {
  assert.deepEqual(calculatePackageCredits(10), {
    packageSize: 10,
    bonusCups: 1,
    totalCupsAdded: 11
  });
});

test('20 cup package credits 22 total cups', function testTwentyCupPackage() {
  assert.deepEqual(calculatePackageCredits(20), {
    packageSize: 20,
    bonusCups: 2,
    totalCupsAdded: 22
  });
});

test('30 cup package credits 33 total cups', function testThirtyCupPackage() {
  assert.deepEqual(calculatePackageCredits(30), {
    packageSize: 30,
    bonusCups: 3,
    totalCupsAdded: 33
  });
});

test('invalid package size is rejected', function testInvalidPackageSize() {
  assert.throws(
    function calculateInvalidPackage() {
      calculatePackageCredits(15);
    },
    /Invalid package size/
  );
});
