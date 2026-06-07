# Story 1.6: Add Foundation Tests

Phase: Phase 1: Owner MVP

Epic: Epic 1: Application Foundation

Output type: Updated Plan

Workflow context: BMAD correct-course output

Status: Complete / Delivered

## Correct-Course Summary

Story 1.6 began as a straightforward testing story: add a few early automated checks around the package credit calculation. The final delivered solution kept that basic intent, but the implementation needed to correct two important assumptions.

The first correction concerned the business rule under test. Earlier planning assumptions in the project treated the 30-cup package as a no-bonus package, but the delivered application credits 33 total cups for a 30-cup purchase. The test story therefore had to be corrected so that the foundation suite enforced the final rule rather than an obsolete one.

The second correction concerned the role of the story in the broader product. The tests were not merely a convenience. They became the first executable quality gate for the prepaid ledger. That required the story to formalize the standard project test command and keep the tests pure, fast, and independent of routes or SQLite setup.

The final delivered outcome reflects these adjustments. The application now contains a direct foundation test file for the package credit rule and a standardized `npm test` execution path through Node's built-in test runner.

## Problem Discovered

The problem discovered was that the original assumptions for the test story were too narrow and partially outdated.

Two specific issues emerged:

1. The package rule being tested had evolved.
2. The test execution model needed to be standardized for future stories.

On the rule side, earlier assumptions did not match the final package policy. The delivered web application uses:

- 10 purchased cups -> 11 credited
- 20 purchased cups -> 22 credited
- 30 purchased cups -> 33 credited

If Story 1.6 had stayed aligned to the earlier 30-cup assumption, the foundation tests would have validated the wrong behavior and created false confidence.

On the execution side, the project needed one standard way to run the test suite. Without that, even correct tests could become fragmented, inconsistently run, or ignored by later work.

## Root Cause

The root cause was a combination of business-rule evolution and the natural ambiguity that often exists in early MVP test planning.

The business model changed as the product matured. The largest package offering moved from an assumed no-bonus package to a premium package that credits 33 total cups. Because Story 1.6 existed to test a specific business rule, any change to that rule necessarily changed the test story.

A second root cause was that early foundation planning can underestimate how important even simple test setup decisions become later. At first glance, a small test file may appear to be isolated technical work. In practice, once the project grows, that same test file becomes part of the team's working quality process. That means the story needed to define not only what to test, but how the project would reliably run those tests.

## Decision Taken

The decision taken was to keep Story 1.6 tightly focused on the package credit model while updating the expectations and delivery approach to match the final application.

The corrected decisions were:

- Use the delivered package rule values:
  - `10 -> 11`
  - `20 -> 22`
  - `30 -> 33`
- Test the model directly rather than through route or UI workflows.
- Standardize test execution through `package.json` using:
  - `"test": "node --test"`
- Keep the story database-independent and browser-independent.
- Treat the story as the first quality baseline that later tests can build upon.

This decision preserved the story's original intent while making it accurate and more valuable to the overall delivery process.

## Updated Implementation Plan

The updated implementation plan became:

1. Confirm the current package credit business rules from the delivered source of truth.
2. Create a dedicated test file for the package credit model.
3. Import `calculatePackageCredits` directly from `models/cup-balance.js`.
4. Use Node's built-in test runner instead of introducing a heavier framework for this story.
5. Add direct assertions for the three supported package sizes.
6. Add a negative test for invalid package size rejection.
7. Assert the full returned object structure instead of checking only the total credited cups.
8. Expose the test suite through `npm test` in `package.json`.
9. Keep the tests isolated from Express startup, SQLite setup, and UI rendering.

The completed application follows this plan. `tests/customer-balance.test.js` verifies the supported package outputs and invalid package rejection, and `package.json` provides the standard `npm test` command.

## Impact On Architecture

The impact on architecture was positive and limited.

The correction reinforced the intended layering of the application:

- models hold business logic
- tests verify those models directly when possible
- routes and UI build on already-tested model behavior

The story did not require any route, database, or UI architecture changes. Instead, it strengthened the testing architecture by formalizing the use of Node's built-in test runner and by keeping foundation tests aligned with the model layer.

This also confirmed an important architectural principle for the project: foundational business rules should be testable without requiring full application startup. That principle continues to support maintainability as the codebase expands.

## Impact On Future Stories

The correction improved later stories in several ways.

Impact on package purchase workflows:

Later owner purchase functionality could rely on the tested package credit rule instead of re-validating the calculation manually.

Impact on balance management:

Because balances depend on credited cup totals, later stories inherited more confidence in current balance calculations.

Impact on dashboard and reporting:

Dashboard metrics and history views are derived from persisted purchase and balance data, which in turn depend on the same package rule.

Impact on customer portal and shared balance link:

Customer-facing balance information is more trustworthy because the core package credit logic is validated automatically.

Impact on future automated tests:

Story 1.6 established a clear pattern:

- use `npm test`
- use Node's built-in runner where appropriate
- test model logic directly when route or UI complexity is unnecessary

This pattern made it easier for later stories to add broader route, integration, and portal coverage.

## Lessons From The Adjustment

The first lesson is that test stories must evolve when the business rule they protect evolves. A test suite that validates old assumptions is more dangerous than having no tests at all because it creates false confidence.

The second lesson is that even very small foundation tests deserve disciplined execution standards. Standardizing on `npm test` gave the project a repeatable quality entry point.

The third lesson is that pure-function business rules are especially valuable in small products because they are easy to verify directly. The cleaner the implementation boundary, the easier it is to adapt when policy changes.

The fourth lesson is that lightweight testing is often the right testing for an MVP. The project did not need a complex framework to protect the first business-critical rule. It needed a fast, readable, local-first test harness.

The fifth lesson is that the first automated test in a project sets a precedent. Story 1.6 established that correctness matters early in this prepaid ledger, not only after the system becomes feature-rich.

## Final Updated Plan Status

Updated plan status: Implemented / Delivered

The corrected plan was successfully delivered. Story 1.6 now reflects the final package bonus policy used by the application, validates that behavior through direct automated tests, and standardizes execution through `npm test`. The adjustments improved both the accuracy of the test expectations and the long-term usefulness of the project's testing foundation.
