# Story 5.1: Implement Multi-Cup Delivery And Balance Protection

Phase: Phase 1: Owner MVP

Epic: Epic 5: Delivery Recording And History

Output type: `Updated Plan`

Status: Reconstructed retrospective change-control artifact

## Correct-Course Purpose

This artifact documents the gap between the original delivery-story assumptions and the final delivered implementation. Story 5.1 began as a delivery-recording capability, but the completed application shows that the correct scope was a transactional multi-cup delivery ledger with balance protection and delivery correction support.

## Original Assumption

The initial assumption for the story was that delivery would be a simple owner action for subtracting cups from a customer balance. A narrow interpretation would have treated delivery as a basic one-cup adjustment or a lightweight history entry. That assumption was too weak for the actual business need.

The completed application proves that the story needed to support a broader operational workflow:

- multi-cup delivery quantities
- zero-balance blocking
- over-balance blocking
- transactionally updated balance and history
- later voiding of delivery records

## Issue Or Change Trigger

The main trigger for course correction was the realization that delivery is not just a record-keeping action. It is a balance-changing ledger operation. If the implementation had stayed with a single-cup or loosely validated model, it would have been too limiting for real coffee shop use and too risky for ledger integrity.

Another trigger was the later need for delivery voiding and history review. That made it clear that delivery records had to be structured as ledger events rather than disposable UI entries.

## Problem Discovered

The original assumption was too narrow in two ways:

1. it underestimated real shop usage by treating delivery as a fixed one-cup action
2. it underestimated ledger risk by not explicitly requiring transactional balance protection

Without correction, the app would have been awkward for the owner and vulnerable to balance drift.

## Root Cause

The root cause was incomplete definition of the consumption side of the prepaid membership model. Package sales had been defined clearly earlier, but delivery behavior had not yet been translated into concrete ledger constraints.

The model needed more than a UI form. It needed:

- quantity validation
- balance threshold rules
- transaction semantics
- history traceability

## Decision Taken

The implementation plan was corrected to treat delivery as a multi-cup ledger event with strict balance protection and history persistence.

The team aligned on these decisions:

- accept positive whole-number quantities greater than one
- block delivery when the balance is zero
- block delivery when the requested quantity exceeds the remaining balance
- update balance and history together in a transaction
- store enough delivery detail to support later review and voiding

## Business Rationale

The business rationale is straightforward: a prepaid coffee membership must match real counter behavior.

The owner needs to record actual cup usage quickly during service. If the app only supported one cup at a time, the workflow would be too slow and error-prone. If the app allowed invalid quantities, the ledger would become untrustworthy. The corrected plan keeps the membership practical and trustworthy at the same time.

## Technical Rationale

The technical correction was necessary because delivery affects persistent balance data.

The correct implementation had to live in the model layer, use transactional database writes, and enforce validation before state changes. That is the only safe way to protect the prepaid ledger from partial updates and invalid balance states.

The final application confirms this approach through `models/delivery-history.js`, route protections in `routes/admin.js`, and tests that exercise the blocked and successful paths.

## Updated Implementation Plan

The revised implementation plan became:

1. add a delivery-history model to centralize balance and history logic
2. add owner-only delivery routes in the admin portal
3. validate positive whole-number quantities server-side
4. block zero-balance and over-balance deliveries
5. update balance and insert history in a single transaction
6. render delivery history in the customer detail and admin delivery views
7. add tests for valid delivery, invalid delivery, and void/recovery behavior

## Impact On Architecture

The architecture was strengthened rather than changed.

The delivery logic joined the existing model-driven ledger pattern used by package purchases. That preserved consistency across the application and kept the route layer focused on request handling and rendering.

The update also reinforced the principle that mutable balance operations must live behind server-side validation and transactions, not in browser logic.

## Impact On Future Stories

This correction affects later work in a positive way.

Future stories that rely on delivery history, balance summaries, low-balance messaging, or voiding behavior now have a reliable ledger foundation to build on. The corrected plan also makes it easier to add customer-facing history, dashboard metrics, and delivery correction flows without reworking core balance logic.

## Impact On UI

The UI impact was to keep the owner workflow compact but ledger-aware.

The customer detail page needed a delivery form, a visible balance, and a delivery history section. The admin deliveries page needed pagination and void controls. Those surfaces are enough to support the corrected delivery model without overbuilding the interface.

## Impact On Data / Logic

The correction made the data model more explicit:

- delivery records must store delivered cups
- delivery records must store balance-after values
- the current balance must update with the record
- voiding must restore the balance

This turns the delivery table into a ledger rather than a simple log.

## Impact On Testing

The test plan expanded from generic delivery coverage to ledger-protection coverage.

The important tests became:

- valid multi-cup delivery reduces balance correctly
- zero-balance delivery is rejected
- over-balance delivery is rejected
- delivery history is stored newest-first
- voiding restores the balance
- route flow works through the authenticated admin portal

Those tests are essential because balance bugs are high impact even when the UI looks correct.

## Lessons From The Adjustment

1. Delivery features should be defined as ledger operations, not just form submissions.
2. Quantity rules must be explicit early, because “delivery” is ambiguous without them.
3. Transactional balance updates are non-negotiable for prepaid systems.
4. A compact owner UI is enough if the model and tests enforce the real business rules.
5. Delivery history must preserve enough detail to support future correction and reporting work.

## Final Outcome

The corrected implementation plan became the delivered application:

- multi-cup delivery supported
- invalid deliveries blocked
- balance and history kept in sync
- void support added for correction
- tests verify the ledger remains trustworthy

That final outcome is the correct interpretation of Story 5.1 in the completed product.
