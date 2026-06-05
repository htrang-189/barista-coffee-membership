# Story 1.3: Create SQLite Schema And Setup Script

Phase: Phase 1: Owner MVP

Epic: Epic 1: Application Foundation

Output type: Updated Plan

Workflow context: BMAD correct-course output

Status: Complete / Delivered

## Correct-Course Summary

Story 1.3 began as a foundation story to create the SQLite schema and setup script for the Owner MVP. During implementation, the delivered solution expanded slightly beyond a minimal initial schema because the final application needed to support later delivered behavior: customer access tokens, multi-cup deliveries, delivery void/cancel metadata, fixed VND amount storage, and repeatable migrations.

The correction did not change the core architecture. The app remained a single Express web application backed by SQLite. The adjustment was to make the database foundation more complete and resilient so it could support the full delivered Owner MVP and Customer Portal without replacing the persistence layer.

## Problem Discovered

The problem discovered was that a minimal Phase 1-only schema would not fully support the final delivered application.

The early foundation assumption could have limited the schema to only admin users, customer accounts, simple package purchase rows, and one-cup delivery rows. That would have been enough for a narrow first iteration, but it would not have supported the product as it evolved.

During implementation, the app needed additional persistence capabilities:

- Customer balance access tokens for QR/shared balance links.
- Multi-cup delivery quantities instead of one-cup-only delivery records.
- Delivery void/cancel metadata so mistaken deliveries could be reversed without deleting records.
- `amount_paid_cents` for fixed VND package pricing and dashboard revenue metrics.
- Migration behavior to update existing local databases safely.

The problem was therefore not that SQLite was wrong. The problem was that the initial schema needed to be flexible enough to support the actual delivered application while remaining MVP-focused.

## Root Cause

The root cause was iterative product discovery and implementation growth.

The Owner MVP started with a lean scope, but the delivered application added several pragmatic enhancements that became part of the accepted product:

- Fixed VND pricing replaced manual amount entry.
- The 30-cup package bonus changed to 33 credited cups.
- Delivery recording evolved from one-cup records to multi-cup quantities.
- Mistaken deliveries needed void/cancel behavior with balance restoration.
- Customer portal and shared QR/token access became delivered scope.
- History views and dashboard metrics needed reliable query fields.

These changes affected database needs. A schema designed only for the earliest assumptions would have required repeated manual changes. To avoid that, the implementation needed migration support and a schema that reflected the current delivered product.

## Decision Taken

The decision was to keep SQLite as the MVP database but strengthen the schema and setup path.

The delivered solution includes:

- `database/schema.sql` with the current core tables and constraints.
- `database/setup.js` for repeatable local initialization.
- `database/migrations.js` for incremental schema evolution.
- `balance_access_token` on `customer_accounts`.
- `amount_paid_cents` on `package_purchases`.
- Multi-cup `delivered_cups` support on `delivery_history`.
- `voided_at` and `voided_by_admin_id` on `delivery_history`.
- Unique indexes and constraints for key identity/access fields.
- Check constraints for balances, package sizes, package amounts, delivery quantities, and balance-after values.

The decision preserved the MVP's simplicity while avoiding a fragile, one-time-only schema.

## Updated Implementation Plan

The updated implementation plan became:

1. Define the schema in `database/schema.sql`.
2. Include tables for admin users, customer accounts, package purchases, delivery history, and admin action logs.
3. Add customer access token support directly to the customer table.
4. Store package revenue as integer cents through `amount_paid_cents`.
5. Support package sizes `10`, `20`, and `30` through schema constraints.
6. Support multi-cup delivery quantities with `delivered_cups > 0`.
7. Support delivery voiding through `voided_at` and `voided_by_admin_id`.
8. Add foreign keys from package and delivery records to customer/admin records.
9. Add indexes for common lookup and history queries.
10. Create `database/setup.js` to initialize the configured SQLite database.
11. Have setup run schema SQL, run migrations, and seed or confirm an initial admin.
12. Create `database/migrations.js` to backfill tokens and rebuild delivery history if older schema assumptions exist.

The final delivered app follows this updated plan.

## Impact On Architecture

The architecture impact was positive and contained.

The project remained a single Express application with SQLite persistence. No external database infrastructure was introduced. No ORM layer was added. No separate database service was required.

The main architecture improvement was the introduction of migration support. This made the SQLite foundation more durable during iterative implementation. The app could evolve from earlier schema assumptions to the delivered schema without requiring a manual reset every time requirements changed.

The schema also became a stronger ledger foundation. Constraints and foreign keys enforce important invariants close to the data layer. This complements route/model validation and protects against invalid records.

The architecture remained practical for a small shop because the schema stayed focused on the membership ledger. It did not add non-MVP tables for payments, orders, loyalty campaigns, POS systems, or multiple shops.

## Impact On Future Stories

The updated schema improved future story delivery.

Impact on owner authentication:

The `admin_users` table supports initial admin setup and later admin login.

Impact on customer management:

The `customer_accounts` table supports required phone number, optional email, login identifier, password hash, current balance, and balance access token.

Impact on package purchase stories:

The `package_purchases` table supports fixed package sizes, bonus cups, total cups added, and amount stored in cents. This supports fixed VND pricing and dashboard revenue metrics.

Impact on delivery stories:

The `delivery_history` table supports positive multi-cup deliveries, balance-after values, notes, and void metadata. This enables delivery correction without deleting records.

Impact on dashboard stories:

Indexes and structured tables support metrics for customers, outstanding cups, revenue, delivered cups, bonus cups, low-balance customers, and recent deliveries.

Impact on customer portal stories:

The customer portal can read current balance, package history, and delivery history from the same schema.

Impact on QR/shared link stories:

`balance_access_token` supports secure token-based read-only balance links and token regeneration behavior.

Impact on testing:

Tests can exercise realistic workflows because the schema supports the full delivered data model.

## Lessons From The Adjustment

The first lesson is that a database foundation should be lean but not naive. A schema that only supports the first visible UI can create churn when practical owner workflows evolve.

The second lesson is that migrations are valuable even for SQLite MVPs. A local database still needs a safe way to evolve.

The third lesson is that ledger apps need database constraints. Route validation is useful, but constraints provide another layer of protection for balances, package records, and delivery history.

The fourth lesson is that correction workflows should be designed early. Voiding a mistaken delivery is more trustworthy than deleting history, so the schema should preserve records and mark their state.

The fifth lesson is that future customer-facing read-only features can affect early data design. Shared access tokens and customer history views are not owner dashboard features, but they depend on the customer and history tables created in the foundation.

## Final Updated Plan Status

Updated plan status: Implemented / Delivered

The correction was successful. Story 1.3 delivered a SQLite schema, setup script, and migration path that support the completed Owner MVP, Customer Portal, QR/shared balance links, delivery voiding, dashboard metrics, and automated tests.
