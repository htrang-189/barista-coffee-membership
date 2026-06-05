# Story 1.6: Add Foundation Tests

Phase: Phase 1: Owner MVP

Epic: Epic 1: Application Foundation

Output type: `story-[slug].md`

## Story Title

Add Foundation Tests

## Business Context

The Owner MVP depends on accurate package credit rules. Early automated tests reduce the risk that balances are credited incorrectly.

## User Story

As the project team, I want foundation tests for package credit calculation so that later owner workflows can rely on verified business-rule behavior.

## Acceptance Criteria

1. `npm test` runs the test suite.
2. Tests cover 10-cup package credits.
3. Tests cover 20-cup package credits.
4. Tests cover 30-cup package credits.
5. Tests cover invalid package size rejection.
6. Tests do not require database setup.

## Functional Requirements

Add automated tests that import `calculatePackageCredits` and assert returned package size, bonus cups, and total credited cups.

## Non-Functional Requirements

Tests must be fast, deterministic, readable, and maintainable.

## UI Requirements

No UI testing is required for this story.

## Database Requirements

No database is required for these foundation tests.

## Technical Notes

The delivered implementation uses `node:test` and `node:assert/strict` in `tests/customer-balance.test.js`.

## Testing Requirements

Run tests with:

```sh
npm test
```

## Definition of Done

Done when the foundation tests exist, run through `npm test`, and validate all supported package credit rules plus invalid package rejection.
