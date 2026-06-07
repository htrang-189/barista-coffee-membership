# Story 1.6: Add Foundation Tests

Phase: Phase 1: Owner MVP

Epic: Epic 1: Application Foundation

Output type: `epics.md`

Workflow context: BMAD create-epics-and-stories output

Status: Reconstructed retrospective planning artifact

## Business Objective

The business objective of Story 1.6 was to establish a reliable testing baseline for the Owner MVP before the application accumulated more operationally sensitive workflows. The Barista Coffee Membership product is a prepaid cup ledger. That means a small logic defect can become a business defect very quickly. If the application credits the wrong number of cups, the owner may misstate balances, the customer may lose trust in the program, and later dashboard or history features may reflect incorrect data.

For that reason, the project needed automated foundation tests early, not as a later optimization. The purpose of the tests was not to prove that the full product was complete. The purpose was to make sure the first business-critical rule in the system, package credit calculation, could be validated automatically with every test run.

The completed application confirms this objective was valid. The current codebase uses a test command driven by Node's built-in test runner, and the foundational package credit rules are directly covered by executable tests in `tests/customer-balance.test.js`.

## Epic Objective

Epic 1: Application Foundation exists to create a runnable, maintainable baseline that later owner workflows can build upon safely. Within that foundation, Story 1.6 had a distinct purpose: prove that the project can execute tests locally and that the most important early business rule can be verified independently of routes, database records, or UI rendering.

This story therefore served two linked epic-level objectives:

1. Establish confidence that the project has an executable test harness.
2. Protect the foundational package credit logic from regression before owner-facing purchase and balance workflows depend on it.

Without this story, the application foundation would still run, but the team would be relying on manual checking for one of the most important rules in the product. That would be a weak foundation for a system that manages stored customer value in the form of prepaid cups.

## Story Objective

The objective of Story 1.6 was to add direct automated tests for foundational package credit logic and ensure those tests run through the project's standard test command.

In the delivered application, this objective is represented by:

- the project-level test script in `package.json`
- the direct test file `tests/customer-balance.test.js`
- the verified package rules:
  - `10 -> 11`
  - `20 -> 22`
  - `30 -> 33`
- explicit invalid package size rejection coverage

The story objective was intentionally narrow. It was not intended to test every application workflow. It was intended to create the first reliable automated guardrail in the codebase.

## User Value

The primary user value of this story is operational confidence.

For the coffee shop owner:

The owner relies on the application to maintain accurate cup balances. Automated tests reduce the risk that a future change silently alters package credit behavior. This matters because the owner should not need to manually recalculate whether a package purchase gave the right number of cups after each release or code change.

For the customer:

Customers benefit indirectly because their remaining-cup balance, used-cup calculations, package history, and low-balance messaging depend on the same underlying package credit rules. When those rules are tested, customer-facing information becomes more trustworthy.

For the development process:

This story creates a repeatable quality mechanism. Later stories involving owner authentication, customer management, purchases, deliveries, dashboards, customer portal access, and QR balance links can build on a working test command instead of creating testing discipline late in the project.

## Acceptance Criteria

1. The project must provide a standard test command that can be executed locally.
2. The foundation test command must run without requiring a browser.
3. The foundation test command must run without requiring manual database setup for the package credit tests.
4. A direct test file must exist for the package credit calculation logic.
5. The tests must import the package credit function from the model layer rather than reimplementing the rule inside the test file.
6. The tests must verify that a 10-cup package credits 11 total cups.
7. The tests must verify that a 20-cup package credits 22 total cups.
8. The tests must verify that a 30-cup package credits 33 total cups.
9. The tests must verify the full returned object structure rather than checking only a single value.
10. The tests must verify that unsupported package sizes are rejected.
11. The invalid package test must confirm that an error is thrown rather than silently accepting unsupported values.
12. The tests must be deterministic and produce the same result on repeated runs.
13. The tests must be fast enough to serve as foundation-level checks during normal development.
14. The tests must remain independent of Express route startup.
15. The tests must remain independent of SQLite schema creation and database seeding.
16. The tests must be simple enough for later developers to understand and extend.
17. The testing approach must be compatible with future expansion into route, integration, and end-to-end coverage.

## Dependencies

Story 1.6 depended on the successful delivery of earlier foundation work.

Direct dependencies:

- Story 1.1: Express and SQLite Application Foundation
  - The project needed a runnable Node application structure and package manifest before a standard test command could be defined and used consistently.
- Story 1.2: Add Environment Configuration
  - Even though the direct package credit tests are pure and do not need runtime environment setup, the broader project structure and local development discipline benefit from a predictable configuration baseline.
- Story 1.5: Implement Package Credit Calculation
  - The tests required a stable target function to validate. Without `calculatePackageCredits`, Story 1.6 would have no meaningful business-rule unit to exercise.

Indirect dependencies:

- `package.json` needed a valid test script.
- The model file `models/cup-balance.js` needed to exist and export the calculation function.
- The project needed a test folder convention that later stories could continue using.

Downstream dependencies:

Later stories depend on Story 1.6 because it establishes the first executable testing pattern. That pattern supports future tests for:

- admin authentication
- customer creation and search
- package purchase recording
- delivery recording and voiding
- dashboard metrics
- customer login and route protection
- shared token access
- notification and read-only customer views

## Risks

### Risk 1: Foundation logic changes without automated detection

If package credit rules were changed later without tests, a regression could ship unnoticed. Because balances are a core product promise, this would undermine both owner and customer trust.

### Risk 2: Tests are coupled too early to database setup or route startup

If foundation tests required SQLite initialization or Express startup, they would become slower and more brittle. That would reduce their usefulness as fast feedback during development.

### Risk 3: Tests validate outdated business rules

The delivered application uses the final rule set:

- `10 -> 11`
- `20 -> 22`
- `30 -> 33`

If the tests were based on stale planning assumptions, such as `30 -> 30`, they would actively reinforce incorrect product behavior.

### Risk 4: Test setup is unclear or inconsistent

If there were no standard `npm test` entry point, later stories might add fragmented testing approaches or avoid automated testing altogether.

### Risk 5: Tests are too shallow

If tests only checked one field, such as total cups, they might miss regressions in the structured return contract that later workflows depend on, such as `bonusCups`.

## Risk Mitigation Approach

The completed implementation demonstrates the intended mitigation strategy:

- Use Node's built-in test framework to avoid unnecessary tooling overhead in the MVP.
- Keep foundation tests pure and isolated by importing the model directly.
- Assert complete returned objects for supported package sizes.
- Assert explicit failure for invalid package sizes.
- Standardize execution through the project test script in `package.json`.

This approach matches the needs of a low-maintenance, easy-to-run local web application.

## Priority

Priority: High

Story 1.6 belongs in the high-priority segment of Epic 1 because it protects business correctness early in the project lifecycle. Even though it does not create visible UI or customer-facing workflows, it materially reduces risk before balance-changing features expand.

In practical terms, this story is more important than many later convenience enhancements because it guards the correctness of value-tracking behavior. In a prepaid ledger product, correctness must be treated as a first-order delivery concern.

## Success Metrics

The success metrics for Story 1.6 can be defined in both technical and business-operational terms.

Technical success metrics:

- `npm test` runs successfully through the project test command.
- The package credit test file executes without requiring browser setup.
- The package credit test file executes without requiring SQLite database setup.
- Supported package rules pass exactly as implemented in the delivered application.
- Invalid package size rejection is verified.

Business-operational success metrics:

- Developers can change unrelated parts of the application and quickly verify that the foundation credit rule still works.
- Later stories can build more tests on top of the same testing entry point.
- The owner-facing package purchase workflow can rely on a tested rule rather than manual verification.
- Customer-facing balance information is supported by a tested calculation source of truth.

Delivered evidence from the current codebase supports these metrics:

- `package.json` includes `"test": "node --test"`.
- `tests/customer-balance.test.js` directly validates the package credit rules.
- The broader current suite has expanded beyond foundation-only checks, showing that the testing baseline scaled successfully.

## Success Criteria Traceability To Delivered Application

The reconstructed story planning maps cleanly to the implemented web application.

Delivered source-of-truth evidence:

- `models/cup-balance.js`
  - provides the package credit function under test
- `tests/customer-balance.test.js`
  - verifies:
    - `10 -> 11`
    - `20 -> 22`
    - `30 -> 33`
    - invalid package size rejection
- `package.json`
  - provides the test command using Node's built-in test runner

The completed application demonstrates that Story 1.6 succeeded not only as a narrow foundation artifact, but also as the base of a broader testing discipline. What began as foundation tests for package credits now sits beneath a larger suite covering owner portal, customer portal, QR balance sharing, and authorization behavior.
