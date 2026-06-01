# UX Design Specification: Barista Coffee Membership

Date: 2026-06-01
Project: barista-coffee-membership
Status: Draft

## 1. UX Goal

Design a small, direct interface for managing prepaid coffee cup balances. The product should feel like a practical shop tool: fast at the counter, clear enough for customers to trust, and simple enough for a single shop with 2-10 membership customers.

## 2. Design Principles

- Prioritize balance clarity.
- Keep owner actions visible and fast.
- Treat transaction history as the source of trust.
- Avoid loyalty, marketing, and POS-like complexity.
- Make the customer view read-only and mobile-first.
- Use plain operational language: purchase, redeem, adjustment, remaining cups.

## 3. Information Architecture

### Owner Area

- Dashboard
- Customer detail
- Add customer
- Record purchase
- Redeem cup
- Add adjustment
- Private link management

### Customer Area

- Read-only balance page
- Transaction history

## 4. Navigation Model

The MVP should use a minimal navigation model.

Owner view:

- The dashboard is the home screen.
- Customer rows link to customer detail.
- Primary actions are available from customer detail.
- Add customer is available from the dashboard.

Customer view:

- No navigation required.
- The private link opens directly to the customer's balance page.

## 5. Key Screens

### 5.1 Owner Dashboard

Purpose: give the owner an immediate view of membership status and quick access to customer records.

Required content:

- Header: product/shop name.
- Summary metrics:
  - Recorded package revenue.
  - Total customers.
  - Total outstanding cups.
  - Cups redeemed today or this week.
- Customer list:
  - Customer name.
  - Phone.
  - Remaining cups.
  - Used cups.
  - Last activity date.
- Recent transactions:
  - Customer name.
  - Transaction type.
  - Cup delta.
  - Date/time.

Primary actions:

- Add customer.
- Open customer detail.

UX notes:

- Customer list should be the dominant working area.
- Since the shop only has 2-10 members, avoid heavy filters.
- A simple search by name or phone is useful but should not dominate the screen.
- Remaining cups should be visually scannable in each customer row.

### 5.2 Add Customer

Purpose: create a member record and generate the private view link.

Fields:

- Name, required.
- Phone, required.
- Email, optional.

Actions:

- Save customer.
- Cancel.

Post-save behavior:

- Show the customer detail page.
- Display the generated private customer link.

Validation:

- Name is required.
- Phone is required.
- If a similar phone already exists, warn before creating a duplicate.

### 5.3 Customer Detail

Purpose: owner workspace for a single customer.

Required content:

- Customer name.
- Phone.
- Optional email.
- Remaining cups.
- Used cups.
- Private customer link.
- Transaction history.

Primary actions:

- Redeem 1 cup.
- Record 20-cup purchase.
- Add adjustment.
- Copy private link.

Secondary action:

- Regenerate private link.

UX notes:

- `Redeem 1 Cup` should be the most prominent action.
- If remaining cups are 0, disable redemption and explain that a purchase or adjustment is needed.
- Private link regeneration should require confirmation because it invalidates the old customer link.

### 5.4 Record Purchase

Purpose: record an externally paid 20-cup package.

Fields:

- Amount collected, required.
- Note, optional.

System behavior:

- Creates a `purchase` transaction.
- Adds 20 cups.
- Adds amount to recorded package revenue.

UX notes:

- The screen or modal should clearly state that payment is handled outside the app.
- The cup amount is fixed at 20 in MVP and should not be editable.

### 5.5 Redeem Cup

Purpose: subtract 1 cup quickly during counter service.

Fields:

- Optional note.

System behavior:

- Creates a `redemption` transaction.
- Subtracts 1 cup.
- Blocks redemption if remaining balance is 0.

UX notes:

- Prefer a confirmation-light interaction, because this is the most frequent action.
- After redemption, show an immediate balance update.
- Provide a path to add an adjustment if the redemption was accidental.

### 5.6 Add Adjustment

Purpose: correct a balance with an auditable note.

Fields:

- Cup delta, required.
- Note, required.

System behavior:

- Creates an `adjustment` transaction.
- Adds or subtracts the entered cup delta.

UX notes:

- Adjustment should feel deliberate, not like the normal redemption path.
- Use clear helper text that adjustment is for corrections.
- Negative adjustments that would make the balance below 0 should be blocked.

### 5.7 Customer Read-Only Balance View

Purpose: let the customer verify their prepaid cup balance and usage history.

Required content:

- Customer display name.
- Remaining cups.
- Used cups.
- Transaction history.

History rules:

- Show purchase events.
- Show redemption events.
- Show adjustment events.
- Do not show payment amounts.
- Show adjustment notes when appropriate.

UX notes:

- Mobile-first layout.
- No edit actions.
- No owner dashboard links.
- No sensitive payment details.
- Use plain language so customers understand why the balance changed.

## 6. Transaction Display Rules

Owner transaction history:

- Purchase: `+20 cups`, amount shown, note if present.
- Redemption: `-1 cup`, amount hidden or shown as none, note if present.
- Adjustment: signed cup delta, note required and shown.

Customer transaction history:

- Purchase: `20 cups added`, no payment amount.
- Redemption: `1 cup used`.
- Adjustment: signed correction with note when appropriate.

Visual treatment:

- Positive cup changes should be visually distinct from negative changes.
- Adjustments should be clearly labeled as corrections.
- Dates should be human-readable.

## 7. Empty, Error, And Edge States

### No Customers

Show a simple empty state with one primary action: Add customer.

### Customer Has 0 Cups

- Remaining cups should be visually prominent.
- Redeem action should be disabled.
- Owner should see actions to record purchase or add adjustment.

### Duplicate Phone

Warn that a customer with this phone number already exists and provide a link to the existing customer.

### Invalid Private Link

Show a simple message that the link is no longer valid and instruct the customer to contact the shop.

### Adjustment Missing Note

Block submission and explain that notes are required for adjustments.

## 8. Responsive Behavior

Owner views:

- Desktop and tablet should show dashboard metrics, customer list, and recent transactions efficiently.
- Mobile owner view should preserve all core actions but can stack metrics, list, and history vertically.

Customer view:

- Mobile-first.
- Remaining cups should be visible near the top without scrolling.
- History should be readable as a vertical list.

## 9. Content Guidelines

Use concise operational labels:

- `Remaining cups`
- `Used cups`
- `Recorded package revenue`
- `Outstanding cups`
- `Redeem 1 cup`
- `Record 20-cup purchase`
- `Add adjustment`
- `Copy private link`
- `Regenerate link`

Avoid:

- Loyalty language.
- Reward language.
- Accounting-grade claims.
- Payment-processing language.

## 10. Suggested UI Structure

### Dashboard Layout

```text
Header
  Product/shop name
  Add customer

Summary metrics
  Recorded package revenue | Total customers | Outstanding cups | Cups redeemed

Main area
  Customer list
  Recent transactions
```

### Customer Detail Layout

```text
Customer header
  Name, phone, optional email
  Remaining cups, used cups

Actions
  Redeem 1 cup
  Record 20-cup purchase
  Add adjustment

Private link
  Copy link
  Regenerate link

Transaction history
```

### Customer View Layout

```text
Customer name
Remaining cups
Used cups

Usage history
```

## 11. Accessibility Requirements

- All actions must be keyboard reachable.
- Buttons and form inputs must have clear labels.
- Color must not be the only way to distinguish transaction type.
- Balance and transaction values should be readable at mobile sizes.
- Error messages should appear near the relevant field.

## 12. MVP UX Acceptance Criteria

- Owner can add a customer in one short form.
- Owner can find a customer and redeem 1 cup quickly.
- Owner can record a purchase without editing the fixed 20-cup quantity.
- Owner can correct a balance only by creating an adjustment with a note.
- Owner can copy and regenerate a private customer link.
- Customer can open a private link and understand remaining cups, used cups, and history.
- Customer view never shows payment amounts.
- Owner dashboard includes recent transactions.

## 13. Inputs

This UX specification is based on:

- PRD: `_bmad-output/planning-artifacts/prd.md`
- Product Brief: `_bmad-output/planning-artifacts/product-brief.md`
- PRFAQ: `_bmad-output/planning-artifacts/prfaq.md`
- Research Findings: `_bmad-output/planning-artifacts/research-findings.md`

## 14. Recommended Next Step

Proceed to technical architecture after UX review and approval.
