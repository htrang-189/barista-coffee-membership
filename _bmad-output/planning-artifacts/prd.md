# Product Requirements Document: Barista Coffee Membership

Date: 2026-06-01
Project: barista-coffee-membership
Status: Final

## 1. Overview

Barista Coffee Membership is a lightweight prepaid cup ledger for a single independent coffee shop. Customers prepay for 20 cups, and the shop owner records purchases, redemptions, and adjustments. Customers access a private read-only view to check remaining cups, used cups, and usage history.

The MVP is intentionally narrow. It is not a loyalty platform, POS system, payment processor, accounting system, or multi-shop membership product.

## 2. Goals

- Replace paper cards, notebooks, or spreadsheets for prepaid cup tracking.
- Give the owner a simple source of truth for customer balances and recorded package revenue.
- Let customers verify their remaining cups and usage history without asking the owner.
- Support transparent corrections through adjustment transactions.
- Keep workflows fast enough for counter service.
- Keep the MVP simple for a shop with around 2-10 membership customers.

## 3. Non-Goals

- Staff accounts or role permissions.
- Customer accounts, passwords, or login recovery.
- QR codes or wallet passes.
- Loyalty rewards, stamps, discounts, campaigns, referrals, or marketing automation.
- Payment processing.
- POS integration.
- Offline mode.
- Multi-shop or multi-branch support.
- Package expiration.
- Drink-specific cup rules.
- Formal accounting, tax, or deferred revenue compliance.

## 4. Target Users

### 4.1 Shop Owner

The owner manages a very small prepaid membership program and needs quick, reliable tracking. The owner is responsible for creating customers, recording package purchases, redeeming cups, correcting mistakes, and sharing private customer links.

### 4.2 Customer

The customer has prepaid for cups and wants a simple way to verify remaining balance and usage history.

## 5. Product Principles

- Ledger-first: history explains every balance.
- Fast at the counter: redeeming a cup should be a low-friction action.
- Transparent to customers: customers can verify balances independently.
- Small-shop appropriate: avoid workflows that only matter at larger scale.
- Clear boundaries: recorded revenue is not accounting-grade revenue.

## 6. Core Concepts

### 6.1 Customer

A customer represents one prepaid membership holder.

### 6.2 Transaction

A transaction is any event that changes a customer's cup balance or records package revenue.

Supported transaction types:

- `purchase`: adds 20 cups and records the payment amount collected outside the app.
- `redemption`: subtracts 1 cup.
- `adjustment`: adds or subtracts cups with a required note.

### 6.3 Private Customer Link

Each customer has a hard-to-guess read-only URL. Anyone with the link can view that customer's balance page, so the page must not expose sensitive payment details.

## 7. Functional Requirements

### FR1: Owner Dashboard

The system shall provide an owner dashboard showing:

- Total recorded package revenue.
- Total customers.
- Total outstanding cups.
- Recent transactions.
- Customer list with remaining cup balance.

### FR2: Customer Management

The system shall allow the owner to create a customer with:

- Name.
- Phone.
- Optional email.

The system shall generate a private customer view token for each customer.

The system shall allow the owner to view customer details and transaction history.

The system should make duplicate customer creation avoidable by clearly showing existing customers during lookup or creation.

### FR3: Record Purchase

The system shall allow the owner to record a 20-cup package purchase for a customer.

The purchase transaction shall:

- Have type `purchase`.
- Add `+20` cups.
- Store the amount collected outside the app.
- Store the transaction creation time.
- Optionally store a note.

The system shall preserve historical purchase amounts, even if the shop changes package pricing later.

### FR4: Redeem Cup

The system shall allow the owner to redeem 1 cup for a customer.

The redemption transaction shall:

- Have type `redemption`.
- Add `-1` cup delta.
- Store amount as `0`.
- Store the transaction creation time.
- Optionally store a note.

The system shall prevent a redemption that would make the customer's balance negative.

### FR5: Manual Adjustment

The system shall allow the owner to create a manual adjustment transaction.

The adjustment transaction shall:

- Have type `adjustment`.
- Store a positive or negative cup delta.
- Store amount as `0`.
- Require a note.
- Store the transaction creation time.

The system should make adjustments visually distinct from purchases and redemptions in history views.

### FR6: Balance Calculation

The system shall derive balances from transactions.

```text
remaining_cups = sum(cup_delta for customer transactions)
used_cups = abs(sum(cup_delta where type = redemption))
recorded_revenue = sum(amount where type = purchase)
outstanding_cups = sum(cup_delta across all customers)
```

The system shall not rely on a manually edited hidden balance as the source of truth.

### FR7: Customer Read-Only View

The system shall provide a customer-facing read-only page available through the customer's private link.

The page shall show:

- Remaining cups.
- Used cups.
- Usage history.

The page shall not allow data edits.

The page shall not show sensitive payment details.

### FR8: Private Link Management

The system shall allow the owner to access and copy a customer's private view link.

The system should allow the owner to regenerate the private link if the link is shared accidentally.

When a private link is regenerated, the old link shall stop working.

### FR9: Transaction History

The system shall show transaction history for each customer.

History entries shall show:

- Transaction type.
- Cup delta.
- Amount when relevant to owner views.
- Note when present.
- Created date and time.

Customer-facing history shall show enough information to explain usage but shall omit sensitive payment details.

Customer-facing history shall include purchase events, redemption events, and adjustment events. Purchase events shall not display payment amounts.

### FR10: Revenue Reporting

The system shall show recorded package revenue from purchase transactions.

The system shall label revenue as recorded package revenue or equivalent wording to avoid implying full accounting compliance.

The system should show total outstanding cups so the owner can see remaining drink obligations.

## 8. User Stories

### US1: Create Customer

As the shop owner, I want to create a customer so I can track that customer's prepaid cups.

Acceptance criteria:

- Owner can enter customer name.
- Owner must enter customer phone.
- Owner can optionally enter customer email.
- Customer is saved with a generated private view token.
- Customer appears in the customer list.

### US2: Record 20-Cup Purchase

As the shop owner, I want to record a 20-cup purchase so the customer's balance and recorded revenue update.

Acceptance criteria:

- Owner can select a customer.
- Owner can enter amount collected.
- System creates a purchase transaction with `+20` cups.
- Customer remaining cups increase by 20.
- Recorded package revenue increases by the entered amount.

### US3: Redeem 1 Cup

As the shop owner, I want to redeem one cup quickly so I can serve members during normal counter service.

Acceptance criteria:

- Owner can select a customer.
- Owner can trigger a 1-cup redemption.
- System creates a redemption transaction with `-1` cup.
- Remaining cups decrease by 1.
- System blocks redemption if remaining cups are 0.

### US4: Correct Balance

As the shop owner, I want to adjust a balance with a note so mistakes can be corrected transparently.

Acceptance criteria:

- Owner can enter positive or negative cup delta.
- Owner must enter a note.
- System creates an adjustment transaction.
- Balance updates from the adjustment.
- Adjustment appears in transaction history.

### US5: View Owner Dashboard

As the shop owner, I want a dashboard so I can quickly understand membership status.

Acceptance criteria:

- Dashboard shows recorded package revenue.
- Dashboard shows total customers.
- Dashboard shows total outstanding cups.
- Dashboard shows customer balances.
- Dashboard shows recent transactions.

### US6: View Customer Balance

As a customer, I want to open my private link so I can see my remaining cups and usage history.

Acceptance criteria:

- Private link opens a read-only customer page.
- Page shows remaining cups.
- Page shows used cups.
- Page shows usage history.
- Page does not allow edits.
- Page does not show sensitive payment details.

### US7: Regenerate Customer Link

As the shop owner, I want to regenerate a customer's private link so I can invalidate a shared or compromised link.

Acceptance criteria:

- Owner can regenerate the token.
- New link opens the customer view.
- Old link no longer opens the customer view.

## 9. Data Requirements

### 9.1 Customer

- `id`: unique identifier.
- `name`: required.
- `phone`: required.
- `email`: optional.
- `private_view_token`: required, unique, hard to guess.
- `created_at`: required.
- `updated_at`: required.

### 9.2 Transaction

- `id`: unique identifier.
- `customer_id`: required reference to customer.
- `type`: required enum: `purchase`, `redemption`, `adjustment`.
- `cup_delta`: required integer.
- `amount`: required numeric value, `0` for redemption and adjustment.
- `note`: optional for purchase and redemption, required for adjustment.
- `created_at`: required.

## 10. Business Rules

- A purchase always adds exactly 20 cups in MVP.
- A redemption always subtracts exactly 1 cup in MVP.
- A redemption cannot make remaining cups negative.
- An adjustment can add or subtract cups.
- An adjustment requires a note.
- Packages do not expire.
- Every drink counts as 1 cup.
- Payments are recorded after being handled outside the app.
- Customer private links are read-only.

## 11. UX Requirements

- Owner workflows should minimize steps for common counter actions.
- Remaining cups should be visually prominent on owner and customer views.
- Destructive or corrective actions should be clearly labeled.
- Adjustment notes should be visible in transaction history.
- Customer pages should be simple and mobile-friendly.
- Owner views should work well for a very small customer list without complex filtering.

## 12. Reporting Requirements

The MVP shall provide:

- Total recorded package revenue.
- Total customers.
- Total outstanding cups.
- Per-customer remaining cups.
- Per-customer used cups.
- Per-customer transaction history.

The MVP shall include:

- Recent transactions across all customers.
- Cups redeemed today or this week.

## 13. Privacy And Security Requirements

- Private customer tokens must be hard to guess.
- Customer views must be read-only.
- Customer views must not expose sensitive payment details.
- Owner must be able to regenerate private links.
- Old private links must be invalid after regeneration.

MVP limitation: because full customer accounts are out of scope, anyone with a valid private link can view the associated customer page.

## 14. Success Metrics

- Owner can create a customer and record a purchase without using external tracking.
- Owner can redeem a cup during counter service with minimal friction.
- Customers can verify remaining cups without contacting the owner.
- Corrections are visible and understandable in transaction history.
- The shop can see recorded package revenue and outstanding cups.

## 15. Resolved Product Decisions

- Phone number is required for customer records.
- Email remains optional.
- Customer-facing history includes purchase events, redemption events, and adjustment events.
- Customer-facing purchase events do not display payment amounts.
- Recent transactions are included on the owner dashboard.

## 16. Future Considerations

These are not MVP requirements:

- Staff accounts and action attribution.
- QR code customer lookup.
- Customer login or OTP access.
- POS/payment integration.
- Export to CSV.
- Multi-shop support.
- Package price presets.
- Expiration rules.
- Loyalty rewards.

## 17. Dependencies And Inputs

This PRD is based on:

- Brainstorming Report: `_bmad-output/planning-artifacts/brainstorming-report.md`
- Research Findings: `_bmad-output/planning-artifacts/research-findings.md`
- Product Brief: `_bmad-output/planning-artifacts/product-brief.md`
- PRFAQ: `_bmad-output/planning-artifacts/prfaq.md`

## 18. Recommended Next Step

Review and approve this PRD. After approval, proceed to UX planning because the product has owner and customer-facing screens.
