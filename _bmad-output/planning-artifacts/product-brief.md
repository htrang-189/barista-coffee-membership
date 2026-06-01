# Product Brief: Barista Coffee Membership

Date: 2026-06-01
Project: barista-coffee-membership
Status: Reconciled with Project Context

## Product Summary

Barista Coffee Membership is a small authenticated web application for a single coffee shop. Admin users create customer accounts, record coffee package purchases, apply fixed bonus cup rules, record cup deliveries, and monitor balances. Customers log in to view their current cup balance, package activity, and delivery history.

The product is not a POS system, payment processor, marketing platform, or multi-shop membership system. It is intentionally small, but it includes account authentication, admin/customer separation, package validation, bonus calculation, delivery tracking, and operational reporting.

Project Context is the primary source of truth for both product and implementation direction. The approved product direction is an authenticated account-based app, not a private-link balance viewer or ledger-only tracker.

## Problem

The coffee shop sells prepaid coffee packages with bonus cups, but manual tracking can lead to wrong balances, unclear delivery history, duplicate customer records, and customer disputes. The owner needs a simple way to know:

- Which customer accounts exist.
- Each customer's current cup balance.
- Which package size was purchased.
- How many bonus cups were granted.
- How many cups have been delivered.
- Which customers have low balances.
- How much package revenue has been recorded.

Customers need a secure way to check their own balance and delivery history without seeing admin tools or other customers' data.

## Target Users

### Primary User: Admin / Shop Owner

The admin manages customer accounts, package purchases, deliveries, balance reporting, and duplicate prevention from the protected admin area. They need fast workflows that work during normal shop operations and clear warnings when a balance or package action cannot be completed.

### Secondary User: Customer

The customer has a coffee membership account and wants to log in to verify their own current balance, package history, bonus cups received, and delivery history. Customers cannot record deliveries, create package purchases, view reports, or access admin functions.

## MVP Goals

- Allow admins and customers to log in securely.
- Keep admin and customer interfaces separate.
- Use separate admin and customer route areas.
- Allow admins to create customer accounts.
- Prevent duplicate customer account creation.
- Support package sizes of 10, 20, and 30 only.
- Apply bonus rules exactly: 10->11, 20->22, 30->30.
- Show bonus cup calculation clearly before package purchase save.
- Record each delivered cup and reduce balance by 1.
- Prevent delivery recording when balance is 0.
- Show current cup balance prominently.
- Show delivery history in reverse chronological order.
- Show low balance warnings when balance is 5 or fewer.
- Provide simple operational reporting.

## Non-Goals

- No POS integration.
- No payment processing.
- No loyalty campaigns, referrals, or marketing automation.
- No QR codes or wallet passes.
- No offline mode.
- No multi-shop or multi-branch support.
- No formal accounting, tax, or deferred revenue compliance.
- No arbitrary package sizes outside 10, 20, and 30.

## Core Product Concept

The product centers on customer accounts with current cup balances and auditable package and delivery records.

Core balance events:

- `package_purchase`: admin records a package of 10, 20, or 30 cups; the system calculates bonus cups and adds total cups to the balance.
- `delivery`: admin records 1 delivered cup; the system subtracts 1 cup and creates a delivery history row.

Balance-changing operations must be saved in database transactions so history and balance stay consistent.

The app uses current balance as the operational balance shown to admins and customers. Package purchase and delivery records explain how the balance changed.

## Package Rules

```text
10-cup package -> 1 bonus cup -> 11 total cups
20-cup package -> 2 bonus cups -> 22 total cups
30-cup package -> 0 bonus cups -> 30 total cups
```

Invalid package sizes must be blocked.

## Key Workflows

### Admin: Log In

The admin logs in before accessing customer management, package purchase, delivery recording, or reporting screens. Admin workflows live under the admin route area and require an authenticated admin session.

### Admin: Create Customer Account

The admin creates a customer account with identifying information and login credentials. The system warns or blocks when an account with the same phone or login identifier already exists.

### Admin: Record Package Purchase

The admin selects a customer and package size. The app validates that the package size is 10, 20, or 30, displays the bonus calculation, records the package purchase, and increases the customer's balance by total cups.

### Admin: Record Delivery

The admin selects a customer and records one delivered cup. The app shows current balance before delivery, prevents delivery if current balance is 0, creates a delivery history row when allowed, and decreases balance by 1.

### Admin: View Dashboard And Reports

The admin can see total customer accounts, outstanding cups, recorded package revenue, package purchases by size, bonus cups granted, cups added, delivered cups, low balance customers, recent deliveries, per-customer current balances, and per-customer delivery history.

### Customer: Log In And View Balance

The customer logs in through the customer route area and sees only their own current balance, low-balance status, package purchase history, bonus cup details, and delivery history in reverse chronological order. The customer cannot edit data, view other customers, view reports, or access admin actions.

## MVP Data Model

### Admin User

- `id`
- `username`
- `password_hash`
- `role`
- `created_at`
- `updated_at`

### Customer Account

- `id`
- `name`
- `phone`
- `email`
- `login_identifier`
- `password_hash`
- `current_balance`
- `created_at`
- `updated_at`

### Package Purchase

- `id`
- `customer_id`
- `package_size`
- `bonus_cups`
- `total_cups_added`
- `amount_paid`
- `created_by_admin_id`
- `created_at`

### Delivery History

- `id`
- `customer_id`
- `delivered_cups`
- `balance_after`
- `note`
- `created_by_admin_id`
- `delivery_date`

## Derived Metrics And Reports

```text
total_customer_accounts = count(customer_accounts)
total_recorded_package_revenue = sum(package_purchases.amount_paid)
package_purchases_by_size = count(package_purchases grouped by package_size)
total_bonus_cups_granted = sum(package_purchases.bonus_cups)
total_cups_added = sum(package_purchases.total_cups_added)
total_cups_delivered = count(delivery_history rows)
total_outstanding_cups = sum(customer_accounts.current_balance)
low_balance_customers = customers where current_balance <= 5
```

Reports should also provide access to per-customer current balance and per-customer delivery history.

## Access Model

- Admin routes under `/admin/*` require authenticated admin session.
- Customer routes under `/customer/*` require authenticated customer session.
- Passwords are stored as bcrypt hashes.
- Logout clears the session.
- Authorization checks are enforced server-side.
- Admin and customer interfaces are separate.
- Customer users can only view their own account data.
- Admin functions must never appear in the customer interface.

## Success Criteria

- Admin can create customer accounts without accidental duplicates.
- Admin can record 10, 20, and 30 cup package purchases with correct bonus cups.
- Admin can record deliveries quickly without allowing negative balances.
- Customers can log in and verify current balance and delivery history.
- Reports show customer count, package revenue, package-size breakdown, bonus cups, cups added, delivered cups, outstanding cups, low balance customers, and recent deliveries.
- Customer users cannot access admin functions.

## Risks And Considerations

- Bonus cup mistakes directly affect customer trust, so calculation tests are required.
- Password and session handling must be implemented carefully.
- Recorded revenue is not full accounting revenue and should be labeled as operational reporting.
- Concurrent delivery recording must be handled with database transactions.
- Duplicate accounts can split customer activity and should be prevented during account creation.

## Recommended Next Step

Use this brief as the basis for the reconciled PRD and UX Specification, preserving Project Context requirements for authentication, package rules, bonus cup calculations, delivery tracking, reporting, and validation.
