const assert = require('node:assert/strict');
const test = require('node:test');

const { formatVndFromCents, parseVndToCents } = require('../models/currency');

test('formats VND with Vietnamese thousands separators', function testFormatVnd() {
  assert.equal(formatVndFromCents(5000000), '50.000 ₫');
  assert.equal(formatVndFromCents(120000000), '1.200.000 ₫');
});

test('parses Vietnamese VND input into stored cents', function testParseVnd() {
  assert.equal(parseVndToCents('50.000'), 5000000);
  assert.equal(parseVndToCents('1.200.000 ₫'), 120000000);
});

test('rejects invalid VND amount input', function testInvalidVnd() {
  assert.throws(
    function parseInvalidAmount() {
      parseVndToCents('12abc');
    },
    /valid non-negative VND amount/
  );
});
