# Story 1.6: Add Foundation Tests

Phase: Phase 1: Owner MVP

Epic: Epic 1: Application Foundation

Output type: `story-[slug].md`

Workflow context: BMAD create-story output

Status: Reconstructed retrospective story document

## Story Title

Add Foundation Tests

## Business Context

The Barista Coffee Membership web application is a prepaid cup ledger. Even at MVP scale, the application is responsible for tracking stored customer value in the form of remaining coffee cups. Because balances are a core product promise, early business rules cannot be left unverified.

The most important foundational rule in the system is package credit calculation. When the owner records a package purchase, the application must determine how many cups are added to the customer's account. If this rule is wrong, the application can produce incorrect balances, misleading package histories, inaccurate dashboard metrics, and customer-facing information that does not match what the shop promised.

Story 1.6 exists to reduce that risk as early as possible. Rather than waiting until later route and workflow stories are complete, the project needed a first automated test layer that confirms the package credit rule behaves correctly in isolation. This creates a reliable quality baseline for the rest of the Owner MVP.

The completed application confirms that this story was essential. The current codebase contains a direct test file, `tests/customer-balance.test.js`, and a standard project test command, `npm test`, which together validate the package credit rule used by later owner and customer workflows.

## User Story

As the project team responsible for delivering the Owner MVP,

I want foundational automated tests for package credit calculation,

So that the earliest balance-affecting business rule is verified before later workflows depend on it and future changes can be checked quickly and consistently.

## Acceptance Criteria

1. The project must provide a standard local test command.
2. The standard local test command must execute automated tests through `npm test`.
3. A dedicated foundation test file must exist for the package credit calculation.
4. The tests must import the package credit function from the model layer.
5. The tests must verify that a 10-cup package credits 11 total cups.
6. The tests must verify that a 20-cup package credits 22 total cups.
7. The tests must verify that a 30-cup package credits 33 total cups.
8. The tests must verify the complete returned object structure for each supported package size.
9. The tests must verify that invalid package sizes are rejected.
10. The invalid package size test must confirm that an error is thrown rather than silently accepting unsupported input.
11. The tests must be deterministic and repeatable across local runs.
12. The tests must run without requiring Express server startup.
13. The tests must run without requiring SQLite schema setup or seed data.
14. The tests must be easy to understand and extend in later stories.
15. The testing approach must be consistent with the lightweight MVP architecture.

## Functional Requirements

The story must add executable tests that validate the current package credit business rules.

The tests must target the server-side calculation function rather than browser-side previews or route responses. This ensures the model layer remains the source of truth for package credit behavior.

The tests must validate all supported package tiers used in the delivered application:

- 10 purchased cups -> 11 total credited cups
- 20 purchased cups -> 22 total credited cups
- 30 purchased cups -> 33 total credited cups

The tests must validate the return structure, not merely a single numeric value. The verified object should contain:

- `packageSize`
- `bonusCups`
- `totalCupsAdded`

The tests must also confirm that unsupported package sizes are rejected with an error.

The project must expose the test runner through the standard script interface in `package.json` so that later developers and later stories can execute the tests in a predictable way.

## Non-Functional Requirements

The tests must be fast. A foundation test suite should provide near-immediate feedback during normal development and should not require heavy setup.

The tests must be deterministic. The same inputs must produce the same test results every time.

The tests must be isolated. They must not depend on mutable external state such as a local SQLite database file, session data, network access, or seeded accounts.

The tests must be readable. Future maintainers should be able to understand what business rule is being verified without having to inspect unrelated code paths.

The tests must be maintainable. If the package bonus policy changes again in the future, the expected values should be easy to locate and update.

The testing approach must match the MVP's low-maintenance philosophy. The completed application uses Node's built-in `node:test` runner, which is appropriate for a small local-first web application.

## UI Requirements

This story has no direct UI requirement.

No owner portal screen is created by this story.

No customer portal screen is created by this story.

No browser automation, visual verification, or UI rendering is required to satisfy the story.

This is intentional. Story 1.6 exists to verify model-level business logic before route and interface behavior become more complex. Testing the calculation independently keeps the scope disciplined and prevents the foundation story from expanding into unrelated UI concerns.

## Database Requirements

This story has no direct database requirement.

The tests must not require:

- SQLite file creation
- schema setup
- migrations
- test data seeding
- record inserts
- record updates
- transactions

The absence of database dependency is a core requirement, not an omission. The package credit function is pure logic and should remain testable without persistence infrastructure.

## Technical Notes

The completed application implements this story using Node's built-in testing tools:

- `node:test`
- `node:assert/strict`

The project-level test entry point is defined in `package.json`:

```json
"test": "node --test"
```

The delivered test file is:

- `tests/customer-balance.test.js`

The delivered model under test is:

- `models/cup-balance.js`

The test file imports:

```js
const { calculatePackageCredits } = require('../models/cup-balance');
```

The tests assert complete object results for:

- 10 cups
- 20 cups
- 30 cups

The tests also assert error throwing for an unsupported package size such as `15`.

This technical approach is aligned with the architecture of the current web app. It avoids unnecessary test framework overhead while providing meaningful automated coverage for a critical business rule.

## Testing Requirements

Testing must be executable through the standard project command:

```sh
npm test
```

The test file must cover the following cases:

1. 10-cup package returns:
   - `packageSize: 10`
   - `bonusCups: 1`
   - `totalCupsAdded: 11`
2. 20-cup package returns:
   - `packageSize: 20`
   - `bonusCups: 2`
   - `totalCupsAdded: 22`
3. 30-cup package returns:
   - `packageSize: 30`
   - `bonusCups: 3`
   - `totalCupsAdded: 33`
4. Invalid package size throws an error matching the expected invalid-package message pattern.

The tests must be unit-style in nature and should not require route requests, browser interaction, or database setup.

The testing outcome expected from the story is not comprehensive system coverage. Instead, the story must establish a credible and extensible foundation for later automated tests.

## Definition of Done

Story 1.6 is done when a dedicated foundation test file exists for package credit calculation.

Story 1.6 is done when the test file imports the calculation from the model layer rather than duplicating the logic inside the tests.

Story 1.6 is done when the 10-cup package case is covered.

Story 1.6 is done when the 20-cup package case is covered.

Story 1.6 is done when the 30-cup package case is covered using the delivered rule of 33 credited cups.

Story 1.6 is done when invalid package sizes are explicitly rejected in test coverage.

Story 1.6 is done when the test suite runs through `npm test`.

Story 1.6 is done when the tests are independent of Express startup and SQLite setup.

Story 1.6 is done when the project has an initial automated quality gate that later stories can extend.
