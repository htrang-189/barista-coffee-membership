# Product Brief: Barista Coffee Membership

Date: 2026-06-01
Project: barista-coffee-membership

## Product Summary

Barista Coffee Membership is a lightweight prepaid cup ledger for a single independent coffee shop. Customers prepay for 20 cups, and the shop owner uses the app to record purchases, redemptions, and balance adjustments. Customers can access a read-only private link to see their remaining cups, used cups, and usage history.

The product is not a loyalty platform, POS system, payment processor, or multi-shop membership system. It is intentionally small and optimized for a shop with around 2-10 membership customers.

## Problem

The coffee shop offers prepaid 20-cup memberships, but tracking balances manually is error-prone and hard for customers to verify. The owner needs a simple way to know:

- Who has an active prepaid balance.
- How many cups each customer has remaining.
- How many cups have been used.
- How much package revenue has been recorded.
- What happened when there is a correction or dispute.

Customers need a simple way to check their balance and usage history without asking the shop owner.

## Target Users

### Primary User: Shop Owner

The owner manages a very small number of membership customers and needs a fast, reliable tracker. They do not need complex permissions, POS integration, loyalty campaigns, or accounting automation.

### Secondary User: Customer

The customer has prepaid for a 20-cup package and wants confidence that their remaining cups and usage history are accurate.

## MVP Goals

- Make it easy for the owner to record a 20-cup package purchase.
- Make it easy for the owner to redeem 1 cup.
- Make it possible to correct mistakes with transparent adjustment history.
- Show accurate remaining cups and used cups.
- Show simple recorded revenue from package purchases.
- Give customers a read-only private balance view.
- Keep the system simple enough for a shop with 2-10 members.

## Non-Goals

- No loyalty or rewards system.
- No staff accounts or role permissions.
- No QR codes.
- No payment processing.
- No POS integration.
- No offline mode.
- No multi-shop or multi-branch support.
- No package expiration.
- No drink-specific rules.
- No formal accounting automation.

## Core Product Concept

The product should work like a small ledger.

Every balance-changing event is a transaction:

- `purchase`: adds 20 cups and records the externally collected payment amount.
- `redemption`: subtracts 1 cup.
- `adjustment`: adds or subtracts cups with a required note.

Balances and reports are derived from the transaction history rather than maintained as separate hidden counters.

## Key Workflows

### Owner: Create Customer

The owner creates a customer record with basic identifying information such as name and optional phone or email.

### Owner: Record Package Purchase

The owner records that a customer bought a 20-cup package. The app adds 20 cups to the customer's balance and records the payment amount for revenue reporting.

### Owner: Redeem Cup

The owner finds a customer and redeems 1 cup. The customer's remaining balance decreases by 1.

If the customer has 0 cups remaining, the app should prevent redemption or clearly require a correction/purchase first.

### Owner: Adjust Balance

The owner can create a manual adjustment transaction with a positive or negative cup delta and a required note. This is used for correcting accidental redemptions, incorrect purchases, or other balance issues.

### Owner: View Dashboard

The owner can see a small dashboard with:

- Recorded revenue.
- Number of customers.
- Total outstanding cups.
- Recent transactions.
- Customer list with remaining balances.

### Customer: View Balance

The customer opens a private read-only link and sees:

- Remaining cups.
- Used cups.
- Usage history.

The customer cannot edit data.

## MVP Data Model

### Customer

- `id`
- `name`
- `phone` optional
- `email` optional
- `private_view_token`
- `created_at`
- `updated_at`

### Transaction

- `id`
- `customer_id`
- `type`: `purchase`, `redemption`, or `adjustment`
- `cup_delta`
- `amount`
- `note`
- `created_at`

## Derived Metrics

```text
remaining_cups = sum(cup_delta)
used_cups = abs(sum(cup_delta where type = redemption))
recorded_revenue = sum(amount where type = purchase)
outstanding_cups = sum(cup_delta across all customers)
```

## Customer Access Model

Customers access their balance through a private, hard-to-guess read-only link.

MVP expectations:

- No customer login.
- No password.
- No QR code requirement.
- Owner can share the link manually.
- Customer view excludes sensitive payment details.
- Owner can regenerate the private link if needed.

## Success Criteria

The MVP is successful if:

- The owner can manage all current membership customers without using a spreadsheet or paper card.
- The owner can record a purchase or redemption quickly during shop operations.
- Customers can independently verify their remaining cups and usage history.
- Balance corrections are visible in the transaction history.
- Revenue from package purchases is visible without introducing payment processing.

## Risks And Considerations

- Private links are simple but can be shared. Mitigation: keep the customer view read-only and exclude sensitive payment details.
- Duplicate customer records could split balances. Mitigation: make customer lookup and customer creation clear.
- Recorded revenue is not full accounting. Mitigation: label it as recorded package revenue, not accounting revenue.
- With no staff accounts, actions are not attributed to individual staff members. This is acceptable for MVP because the shop is small and staff accounts are out of scope.

## Recommended Next Step

Create the PRD from this brief, preserving the lean MVP boundary and transaction-ledger model.
