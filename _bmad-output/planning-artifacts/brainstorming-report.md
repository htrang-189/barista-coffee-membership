# Brainstorming Report: Barista Coffee Membership

Date: 2026-06-01
Project: barista-coffee-membership

## Brainstorm Topic

A lightweight coffee membership app for a small coffee shop where customers prepay for 20 cups. The shop owner needs to track customer balances, cup usage, and revenue. Customers should be able to view their own remaining cups, used cups, and usage history.

## Context

The shop has a very small membership base, around 2-10 customers. The MVP should stay extremely lean and avoid infrastructure or workflow complexity that would only matter at larger scale.

## Confirmed MVP Decisions

- Customers have their own view showing remaining cups, used cups, and usage history.
- Every drink counts as 1 cup for MVP.
- Packages do not expire.
- Single shop only.
- Payments are handled outside the app.
- The app records package purchases and revenue, but does not process payments.
- No staff accounts in MVP.
- No QR codes in MVP.
- No loyalty or rewards features in MVP.
- No payment integration in MVP.
- No offline mode in MVP.
- No multi-shop support in MVP.

## Recommended Core Model

Use a simple transaction-based ledger instead of separate package purchase and cup redemption concepts.

Each balance-changing event is recorded as a transaction:

- `purchase`: adds 20 cups and records revenue.
- `redemption`: subtracts 1 cup.
- `adjustment`: adds or subtracts cups with a required note.

Derived values:

```text
remaining_cups = sum(transaction.cup_delta)
used_cups = absolute sum(redemption cup_delta)
revenue = sum(purchase amount)
```

Example transactions:

```text
purchase   +20 cups   $50   "20-cup package"
redemption -1 cup     $0    "Latte"
adjustment +1 cup     $0    "Corrected accidental redemption"
```

This keeps the MVP simple while preserving an audit trail for corrections and disputes.

## MVP Workflows

### Owner View

- Create a customer.
- Record a 20-cup package purchase.
- Redeem 1 cup for a customer.
- Make a manual cup adjustment with a required note.
- View each customer's remaining cups, used cups, and transaction history.
- View simple revenue totals from recorded purchases.

### Customer View

- View remaining cups.
- View used cups.
- View usage history.

## Lean Screen Ideas

### Owner Dashboard

- Total recorded revenue.
- Total active customers.
- Total outstanding cups.
- Simple customer list with remaining cup balances.

### Customer Detail

- Customer name and contact details.
- Remaining cups.
- Used cups.
- Transaction history.
- Actions: record 20-cup purchase, redeem 1 cup, manual adjustment.

### Customer Public View

- Remaining cups.
- Used cups.
- Usage history.

## Key Edge Cases

- Attempting to redeem when a customer has 0 cups.
- Accidental redemption.
- Incorrect purchase amount entered.
- Customer buys another 20-cup package before using the previous balance.
- Duplicate customer records.
- Customer disputes usage history.

## Recommended MVP Boundary

The MVP should prioritize reliability, clarity, and speed over feature breadth. For a shop with 2-10 membership customers, the app should behave more like a clean ledger and balance viewer than a full POS, loyalty, or CRM system.

## Open Questions For Research

- What do comparable coffee shop membership or prepaid-card tools emphasize?
- How do small businesses usually handle stored-value balances, punch cards, or prepaid packages?
- Are there accounting or reporting concepts the MVP should represent clearly, such as prepaid revenue versus outstanding cup liability?
- What customer-facing access pattern is simplest while still reasonably private?
