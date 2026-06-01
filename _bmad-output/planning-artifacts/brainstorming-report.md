# Brainstorming Report: Barista Coffee Membership

Date: 2026-06-01
Project: barista-coffee-membership
Status: Reconciled with Project Context

## Brainstorm Topic

A small authenticated coffee membership app where admins create customer accounts, record prepaid package purchases, calculate bonus cups, record cup deliveries, and let customers log in to view their own current balance and delivery history.

## Context

The Project Context is now the primary source of truth for business and technical requirements. The MVP should remain simple, but it must include authenticated admin and customer areas, package-size validation, bonus cup calculations, delivery tracking, and clear balance reporting.

## Confirmed MVP Decisions

- Admin and customer users authenticate before accessing protected areas.
- Admin and customer interfaces are separate.
- Admin routes are separate from customer routes.
- Customers have accounts and log in to view their own balance and history.
- Admins create customer accounts and manage balances.
- Package sizes are limited to 10, 20, and 30.
- Bonus cup rules are fixed:
  - 10-cup package grants 11 total cups.
  - 20-cup package grants 22 total cups.
  - 30-cup package grants 30 total cups.
- A delivery represents one served cup and subtracts 1 cup from balance.
- Delivery recording is blocked when customer balance is 0.
- Low balance warning appears when balance is 5 cups or fewer.
- Duplicate customer account creation should be prevented.
- Payments may be recorded for reporting, but payment processing is out of scope.
- Single-shop operation remains the MVP boundary.

## Recommended Core Model

Use customer accounts with current balances plus auditable package and delivery records.

Core records:

- `customer_accounts`: customer identity, login credentials, current balance, contact details, and timestamps.
- `package_purchases`: package size, bonus cups, total cups added, amount paid, admin actor, and timestamp.
- `delivery_history`: one row per delivered cup, customer reference, balance after delivery, admin actor, timestamp, and optional note.

Balance-changing operations should use database transactions so history and balance stay consistent.

```text
10-cup package -> 1 bonus cup -> 11 total cups
20-cup package -> 2 bonus cups -> 22 total cups
30-cup package -> 0 bonus cups -> 30 total cups

package_purchase: current_balance += total_cups
delivery: current_balance -= 1
```

## MVP Workflows

### Admin View

- Log in to the admin area.
- Create a customer account with required login and contact details.
- Avoid duplicate accounts by checking phone or login identifier.
- Record a package purchase for 10, 20, or 30 cups.
- Show bonus cup calculation before saving a package purchase.
- Record one delivered cup for a customer.
- Block delivery recording at 0 balance.
- View customer balance, package purchases, and delivery history.
- See low balance warnings.
- View operational reports.

### Customer View

- Log in to the customer area.
- View current cup balance prominently.
- View low balance warning when applicable.
- View package purchase history.
- View delivery history in reverse chronological order.
- Customer cannot edit data or access admin functions.

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

### Package Purchase

- Package size selector: 10, 20, or 30.
- Bonus cup calculation.
- Total cups added.
- Amount paid.

### Customer Balance View

- Current balance.
- Low balance warning.
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

## Recommended MVP Boundary

The MVP should focus on authenticated account management, package purchase tracking, fixed bonus cup calculation, delivery recording, balance visibility, and simple reporting. It should not expand into POS integration, loyalty campaigns, payment processing, QR codes, offline mode, or multi-shop operations.
