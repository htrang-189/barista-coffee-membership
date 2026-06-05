# Story 1.6: Add Foundation Tests

Phase: Phase 1: Owner MVP

Epic: Epic 1: Application Foundation

Output type: `epics.md`

Workflow context: BMAD create-epics-and-stories output

Status: Reconstructed retrospective planning artifact

## Business Objective

The business objective is to establish early automated confidence in the application foundation. The Owner MVP will handle prepaid cup balances, so foundational business rules must be verified before owner workflows depend on them.

## Epic Objective

Epic 1 creates the app foundation. Story 1.6 confirms that the foundation can be tested through the project test command and that the package credit rule has immediate automated coverage.

## Story Objective

Add foundation tests for the package credit calculation and invalid package-size rejection using the app's test framework.

## User Value

The owner benefits because core credit rules are less likely to regress. Customers benefit later because balance displays are based on tested package-credit behavior.

## Acceptance Criteria

1. The project has a runnable `npm test` command.
2. Foundation tests use Node's test runner.
3. Tests import `calculatePackageCredits`.
4. Tests verify `10 -> 11`.
5. Tests verify `20 -> 22`.
6. Tests verify `30 -> 33`.
7. Tests verify invalid package size rejection.
8. Tests are deterministic and do not require database setup.
9. Tests can be expanded by later stories.

## Dependencies

Depends on Story 1.5 package credit calculation and the project test script in `package.json`.

Downstream stories depend on a working test foundation for auth, customers, packages, deliveries, dashboard, customer portal, and QR links.

## Risks

- Tests are delayed and business rules regress.
- Tests require database setup unnecessarily.
- Tests cover old package rules.
- Test command is unclear.

Mitigations: use Node's built-in test runner, direct pure-function tests, and update expected values to the delivered rule.

## Priority

Priority: High

Early tests are necessary because package credits directly affect balances and revenue-adjacent owner trust.

## Success Metrics

- `npm test` runs.
- Package credit tests pass.
- Invalid package size test passes.
- Later test suite can build on the same command.

## Traceability To Completed Application

Delivered evidence:

- `package.json` has `"test": "node --test"`.
- `tests/customer-balance.test.js` covers package credit rules.
- Current full suite has 30 passing tests.
