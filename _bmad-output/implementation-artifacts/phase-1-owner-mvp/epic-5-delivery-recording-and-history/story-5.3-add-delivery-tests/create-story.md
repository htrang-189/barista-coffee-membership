# Story 5.3: Add Delivery Tests

Phase: Phase 1: Owner MVP

Epic: Epic 5: Delivery Recording And History

Output type: `story-[slug].md`

Status: Reconstructed retrospective implementation story

## Story Title

Add Delivery Tests

## Business Context

The Barista Coffee Membership product uses a prepaid cup ledger. That ledger is only trustworthy if the delivery and void behaviors remain correct over time. Stories 5.1 and 5.2 added the operational delivery and correction workflows, but those behaviors are high-risk and need automated protection.

Story 5.3 exists to turn the delivery ledger into a stable, test-backed part of the application. It is not new customer-facing functionality. It is the quality gate that protects the owner’s ability to record, correct, and review cup consumption without silently breaking balances in later changes.

## User Story

As the development team, we want automated tests for delivery and void behavior so that the prepaid ledger remains correct and safe to change.

## Acceptance Criteria

1. Automated tests verify that multi-cup delivery reduces the customer balance correctly.
2. Automated tests verify that delivery is blocked when the balance is zero.
3. Automated tests verify that delivery is blocked when the requested quantity exceeds the current balance.
4. Automated tests verify that delivery history is returned in newest-first order.
5. Automated tests verify that voiding a delivery restores the customer balance.
6. Automated tests verify that a voided delivery cannot be voided again.
7. Automated tests verify that admin delivery pagination works as expected.
8. Automated tests verify that delivery routes remain protected by owner authentication.
9. The test coverage reflects the delivered delivery ledger behavior accurately.
10. The tests fail when the delivery ledger rules are broken.

## Functional Requirements

The test suite must cover successful delivery recording with more than one cup.

The test suite must cover zero-balance rejection behavior.

The test suite must cover over-balance rejection behavior.

The test suite must cover delivery history ordering in newest-first order.

The test suite must cover void delivery behavior and balance restoration.

The test suite must cover repeat-void rejection.

The test suite must cover admin deliveries list pagination and navigation.

The test suite must cover owner authentication for delivery routes.

The test suite must exercise the actual application behavior, not just isolated mock logic.

## Non-Functional Requirements

The tests must be reliable and repeatable.

The tests must run against isolated SQLite databases so they do not interfere with each other.

The tests must validate business outcomes instead of incidental implementation details.

The tests must be maintainable enough to support future delivery or reporting work.

The test coverage must be strong enough to catch regressions in the most sensitive ledger paths.

## UI Requirements

There is no new UI feature in this story, but the tests must validate the existing admin UI where delivery data is displayed.

The tests should confirm that the customer detail page and admin deliveries page still render the expected delivery information.

The tests should confirm that the delivery history remains visible after correction.

The tests should confirm that the admin deliveries page paginates correctly without breaking the ledger display.

## Database Requirements

The tests must exercise the existing SQLite schema for customer balances, package purchases, delivery history, and void metadata.

The tests must verify that balance updates and delivery history rows remain consistent after delivery and void operations.

The tests must verify that the current balance in `customer_accounts` matches the delivery ledger behavior.

The tests must not require any new schema changes. They are intended to validate the existing data model.

## Technical Notes

The delivered application shows that this story was implemented as test coverage in the existing Node test suite.

`tests/phase1-owner.test.js` covers the core ledger behaviors:

- zero-balance delivery rejection
- over-balance delivery rejection
- valid multi-cup delivery
- newest-first delivery history
- void delivery restoration
- repeat-void rejection
- admin delivery pagination

`tests/e2e-owner-customer-flow.test.js` covers the full owner workflow from recording a delivery to voiding it and checking the resulting customer balance.

`tests/customer-portal.test.js` is also relevant because it confirms customer-facing pages remain read-only and continue to reflect the correct balance and history after delivery changes.

The tests use isolated SQLite databases created from the schema file so each case can run independently.

## Testing Requirements

The test suite must include:

- model-level checks for valid and invalid delivery flows
- model-level checks for void restoration and repeat-void rejection
- route-level checks for owner-authenticated delivery actions
- route-level checks for admin delivery history pagination
- end-to-end checks for the full owner delivery and void flow

The tests must use the real model functions and routes wherever possible because the point of this story is to protect the actual ledger behavior.

## Definition Of Done

The story is done when the delivery ledger behavior is covered by automated tests that verify the balance rules, void correction rules, history ordering, pagination, and owner route protection.

The story is not done if only happy-path tests exist, if voiding is not covered, or if the delivery ledger can still regress without detection.

## Expected Delivered Output

The expected delivered output is a strengthened test suite that includes:

- delivery balance protection coverage
- void correction coverage
- history ordering coverage
- admin pagination coverage
- owner authentication coverage for delivery actions

The completed application confirms that this story delivered the automated protection needed for the delivery ledger in the Phase 1 owner MVP.
