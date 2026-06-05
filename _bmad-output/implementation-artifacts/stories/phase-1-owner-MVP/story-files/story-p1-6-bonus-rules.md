# Story P1-6: Package Bonus Rules

Status: Implemented
Phase: Phase 1 Owner/Admin Portal

## Objective

Apply fixed package bonus rules consistently.

## Requirements

- `10 -> 11`.
- `20 -> 22`.
- `30 -> 33`.
- Invalid package sizes are rejected.
- UI preview and server-side model match.

## Scope

Included: centralized credit calculation and owner UI preview.

Excluded: arbitrary package sizes or configurable promotions.

## Files Created/Modified

- `models/cup-balance.js`
- `models/package-purchase.js`
- `public/js/admin.js`
- `tests/customer-balance.test.js`
- `tests/phase1-owner.test.js`

## Routes/Models/Views Involved

- `calculatePackageCredits()`
- Package purchase form preview.

## Testing Evidence

- 10, 20, 30 package credit tests.
- Invalid package size test.
- Package purchase balance total tests.

## Delivered Output

Centralized bonus calculation.

## Notes/Concerns

Bonus rules are fixed in code for the delivered MVP.
