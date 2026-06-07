# Story 1.5: Implement Package Credit Calculation

Phase: Phase 1: Owner MVP

Epic: Epic 1: Application Foundation

Output type: Updated Plan

Workflow context: BMAD correct-course output

Status: Complete / Delivered

## Correct-Course Summary

Story 1.5 began as a foundational rule-definition story for package credit calculation. The original planning assumption for the largest package was that a 30-cup purchase would credit 30 total cups with no bonus. The final delivered application does not follow that earlier assumption. The completed implementation credits 33 total cups for a 30-cup purchase, adding 3 bonus cups.

This was the most important correction in the story. The correction did not change the role of the story, but it did change the exact business rule the story had to protect. Because package credit calculation affects balances, purchase records, dashboard values, and customer-visible history, the rule change had to be reflected in the central model logic and its direct automated tests.

The result is a delivered calculation module that remains appropriately simple, but now reflects the final product policy rather than the earlier draft assumption.

## Problem Discovered

The problem discovered was a mismatch between early package bonus assumptions and the final delivered product behavior.

Earlier planning artifacts and initial assumptions treated the 30-cup package differently from the 10-cup and 20-cup packages. The earlier assumption was:

- 10 purchased cups -> 11 credited
- 20 purchased cups -> 22 credited
- 30 purchased cups -> 30 credited

The delivered application, however, uses:

- 10 purchased cups -> 11 credited
- 20 purchased cups -> 22 credited
- 30 purchased cups -> 33 credited

That difference is not cosmetic. It changes the customer balance outcome, affects how many cups are added during purchase recording, influences package history and dashboard aggregates, and changes what the customer later sees in the portal and shared balance-link view.

If Story 1.5 had remained aligned to the older rule, the system would have persisted incorrect balances even if every route and UI flow were otherwise functioning correctly.

## Root Cause

The root cause was that the package bonus policy evolved after the earlier planning assumption was recorded.

This type of change is common in small-business products. The business model is often refined once the owner sees how the real package offering should work in practice. In this project, the 30-cup package moved from a no-bonus package to a premium package that credits 33 total cups.

A second root cause was that package credit rules are a cross-cutting business concern. They affect:

- purchase persistence
- current balance updates
- customer-facing balance displays
- dashboard metrics
- package history
- tests

That means even a small rule change must be corrected at the source of truth rather than patched individually across screens or routes.

## Decision Taken

The decision taken was to update the central package credit calculation rule so that the delivered model reflects the final business policy:

- 10 -> 11
- 20 -> 22
- 30 -> 33

The rule was implemented in the dedicated model module `models/cup-balance.js`, which remains the authoritative source of package credit behavior.

The decision also included keeping the implementation model-driven and deterministic. Instead of allowing route handlers, forms, or UI previews to decide bonus behavior, the application continues to derive credited cups exclusively from the model function `calculatePackageCredits(packageSize)`.

This ensured that once the 30-cup rule changed, all downstream consumers could remain aligned by reusing the same function.

## Updated Implementation Plan

The updated implementation plan became:

1. Keep package credit calculation in a dedicated model file rather than embedding it in route code.
2. Normalize the input package size with `Number(packageSize)` so the function works reliably with form-submitted values.
3. Support exactly three approved package sizes: 10, 20, and 30.
4. Return a structured result containing:
   - `packageSize`
   - `bonusCups`
   - `totalCupsAdded`
5. Update the 30-cup branch to return:
   - `bonusCups: 3`
   - `totalCupsAdded: 33`
6. Keep invalid package sizes explicitly rejected.
7. Ensure downstream package purchase logic consumes the calculation function rather than maintaining its own bonus logic.
8. Update automated tests so the 30-cup expectation validates the final delivered rule.

The final code follows this corrected plan. `models/cup-balance.js` now returns 33 credited cups for a 30-cup package, and `tests/customer-balance.test.js` verifies that exact result.

## Impact On Architecture

The impact on architecture was contained and positive.

The correction did not require a structural redesign. The architecture was already appropriate because package credit logic had been placed in its own model module. That design made the rule change easy to absorb without rewriting routes, views, or database infrastructure.

The correction reinforced an architectural lesson: volatile business rules should live behind a stable model-level interface. Because `calculatePackageCredits` is the source of truth, the application could absorb the package-rule change by updating one function and its test coverage rather than by chasing duplicated logic across the codebase.

There was no impact on:

- Express route structure
- SQLite schema structure
- authentication design
- QR access logic
- customer portal authorization

The impact stayed within business-rule calculation and the modules that consume it.

## Impact On Future Stories

The correction had direct impact on later stories and delivered features.

Impact on package purchase workflow:

`models/package-purchase.js` uses `calculatePackageCredits`, so a 30-cup purchase now stores 3 bonus cups and 33 total credited cups and increases the customer balance correctly.

Impact on dashboard metrics:

Any dashboard values derived from stored purchase totals and balances reflect the corrected 30-cup package rule.

Impact on customer portal and shared access pages:

Customers see balances, used cups, and history that reflect the final bonus policy rather than the older no-bonus assumption for 30-cup packages.

Impact on tests:

The direct test suite had to reflect the delivered business policy. The foundation test for the 30-cup package now verifies 33 credited cups.

Impact on documentation:

Planning and retrospective artifacts needed to be reconciled so that Story 1.5 documents the final delivered rule instead of the outdated assumption.

## Lessons From The Adjustment

The first lesson is that foundational business rules should be centralized before workflow implementation expands. Because Story 1.5 established a single source of truth, the later rule change was manageable.

The second lesson is that apparently small business changes can have broad downstream impact. Changing the 30-cup package from 30 credited cups to 33 credited cups affects balances, history, reports, tests, and customer trust.

The third lesson is that planning artifacts can drift from delivered behavior if business policies evolve during implementation. Retrospective documentation should explicitly record that drift so the artifact set remains credible.

The fourth lesson is that direct unit tests for core business rules are valuable even in a small MVP. They make rule changes visible and reduce the chance of hidden regressions.

The fifth lesson is that the best implementation boundary for this kind of rule is a pure model function. A pure function is easier to change, test, and reuse than a rule buried inside a route or UI component.

## Final Updated Plan Status

Updated plan status: Implemented / Delivered

The corrected plan was successfully delivered. Story 1.5 now reflects the final package bonus policy used by the current web application, with the 30-cup package crediting 33 total cups. The change was absorbed at the correct layer, propagated cleanly into purchase logic and tests, and did not require architectural rework.
