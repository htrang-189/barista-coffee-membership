# Brainstorming Report: Barista Coffee Membership

Date: 2026-06-01
Project: barista-coffee-membership
Status: Reconciled with Current Implemented Web Application

## Brainstorm Topic

A small Express coffee membership web app where admins create customer accounts, record prepaid package purchases, calculate fixed VND package totals and bonus cups, record multi-cup deliveries, void mistaken deliveries, and let customers view read-only balance information through login or a shared QR/balance link.

## Context

The current working web app is the source of truth for business and technical behavior. The MVP remains simple, but it includes authenticated admin and customer areas, token-based shared balance links, package-size validation, bonus cup calculations, delivery tracking, voided delivery correction, and clear balance reporting.

## Confirmed MVP Decisions

- Admin and customer users authenticate before accessing protected areas.
- Admin and customer interfaces are separate.
- Admin routes are separate from customer routes.
- Customers have accounts and log in to view their own balance and history.
- Customers can also use an owner-shared read-only balance link or QR code.
- Admins create customer accounts and manage balances.
- Package sizes are limited to 10, 20, and 30.
- Bonus cup rules are fixed:
  - 10-cup package grants 11 total cups.
  - 20-cup package grants 22 total cups.
  - 30-cup package grants 33 total cups.
- A delivery records a positive integer delivered-cup quantity and subtracts that quantity from balance.
- Delivery recording is blocked when requested quantity exceeds the current balance.
- A mistaken delivery can be voided once, restoring the delivered cups while preserving the history record.
- Low balance warning appears when balance is 5 cups or fewer.
- Duplicate customer account creation should be prevented.
- Package purchase amounts are calculated automatically at `30.000 ₫` per purchased cup; payment processing is out of scope.
- Customer-facing pages hide payment amounts and admin actions.
- History sections show recent records by default with `View all` links to full history pages.
- Customer UI uses a premium dark green/cream membership style with time-of-day greeting, member-since message, cup progress bar, and low-balance notification bell.
- Single-shop operation remains the MVP boundary.

## Recommended Core Model

Use customer accounts with current balances plus auditable package and delivery records.

Core records:

- `customer_accounts`: customer identity, login credentials, balance access token, current balance, contact details, and timestamps.
- `package_purchases`: package size, bonus cups, total cups added, automatically calculated VND amount in cents, admin actor, and timestamp.
- `delivery_history`: one row per delivery event, delivered-cup quantity, customer reference, balance after delivery, admin actor, timestamp, optional note, and void status.

Balance-changing operations should use database transactions so history and balance stay consistent.

```text
10-cup package -> 1 bonus cup -> 11 total cups
20-cup package -> 2 bonus cups -> 22 total cups
30-cup package -> 3 bonus cups -> 33 total cups

package_purchase: current_balance += total_cups
delivery: current_balance -= delivered_cups
void_delivery: current_balance += delivered_cups
```

## MVP Workflows

### Admin View

- Log in to the admin area.
- Create a customer account with required login and contact details.
- Avoid duplicate accounts by checking phone or login identifier.
- Record a package purchase for 10, 20, or 30 cups.
- Show bonus cup calculation before saving a package purchase.
- Record a positive integer delivered-cup quantity for a customer.
- Block delivery recording when requested quantity exceeds current balance.
- Void a mistaken delivery once and restore the delivered cups.
- View customer balance, package purchases, and delivery history.
- Copy a customer balance link.
- Show a QR code for the customer balance link.
- Regenerate a customer balance access token to invalidate the old shared link.
- See low balance warnings.
- View operational reports.

### Customer View

- Log in to the customer area.
- View current cup balance prominently.
- View low balance warning when applicable.
- View package purchase history.
- View cup/delivery history in reverse chronological order.
- Use `View all` links for full package and cup/delivery histories.
- Customer cannot edit data or access admin functions.
- Customer-facing pages do not show payment amounts.

## Lean Screen Ideas

### Admin Dashboard

- Total customer accounts.
- Total outstanding cup balance.
- Recorded package revenue.
- Bonus cups granted.
- Total cups delivered.
- Low balance customers.
- Recent deliveries.

### Customer Detail

- Customer name and contact details.
- Current balance.
- Low balance status.
- Package purchase history.
- Delivery history.
- Actions: record package purchase, record delivery, edit customer.
- Customer access: copy balance link, show QR code, regenerate link.

### Package Purchase

- Package size selector: 10, 20, or 30.
- Bonus cup calculation.
- Total cups added.
- Amount paid.

### Customer Balance View

- Current balance.
- Used cups and cup progress bar.
- Low balance warning.
- Notification bell for low balance.
- Package history.
- Delivery history.

## Key Edge Cases

- Attempting delivery when balance is 0.
- Invalid package size outside 10, 20, or 30.
- Incorrect bonus cup calculation.
- Duplicate customer account.
- Invalid admin or customer login.
- Customer attempting to access admin functions.
- Concurrent delivery recordings for the same customer.
- Database failure during package or delivery update.
- Regenerated shared link should invalidate the previous token.

## Recommended MVP Boundary

The MVP should focus on authenticated account management, shared read-only balance access, package purchase tracking, fixed bonus cup calculation, multi-cup delivery recording, delivery voiding, balance visibility, and simple reporting. It should not expand into POS integration, loyalty campaigns, payment processing, ordering, offline mode, wallet passes, or multi-shop operations.
