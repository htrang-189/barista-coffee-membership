# Story 1.6: Add Foundation Tests

Output type: CODE

Status: Implemented / Delivered

## Files Created

### `tests/customer-balance.test.js`

Why it exists: It verifies the package credit rule before balance-changing workflows depend on it.

What problem it solves: It prevents silent regressions in package credits.

How it works: It imports `calculatePackageCredits`, uses `node:test`, and asserts expected outputs with `node:assert/strict`.

## Files Modified

### `package.json`

The project test script runs Node's built-in test runner:

```json
"test": "node --test"
```

## Database Changes

None. These tests are pure function tests.

## Routes Added

None.

## Models Added

No model was added by this story. It tests `models/cup-balance.js`.

## UI Components Added

None.

## Business Logic Implemented

No new business logic was implemented; existing package credit logic was verified.

## Validation Rules

Tests validate:

- `10 -> 11`
- `20 -> 22`
- `30 -> 33`
- invalid package size throws

## Security Controls

No direct security controls. Test coverage protects ledger correctness.

## Test Coverage

`tests/customer-balance.test.js` provides direct coverage. The current full suite includes 30 passing tests.

## Final Delivered Implementation Result

The app has an executable test foundation and direct coverage for package credit calculation.
