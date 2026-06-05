# Story P1-9: Dashboard Metrics And Owner Histories

Status: Implemented
Phase: Phase 1 Owner/Admin Portal

## Objective

Provide operational dashboard metrics and readable owner history views.

## Requirements

- Dashboard shows customer count, outstanding cups, recorded revenue, delivered cups, bonus cups, low-balance customers, and recent deliveries.
- Customer detail shows recent package and delivery histories.
- Full owner history pages are newest first.
- Admin delivery history is paginated.

## Scope

Included: dashboard metric queries, customer history previews, full-history pages, paginated admin deliveries.

Excluded: advanced reporting.

## Files Created/Modified

- `models/dashboard.js`
- `routes/admin.js`
- `views/admin/dashboard.html`
- `tests/phase1-owner.test.js`
- `tests/customer-portal.test.js`

## Routes/Models/Views Involved

- `GET /admin/dashboard`
- `GET /admin/customers/:customerId/package-purchases`
- `GET /admin/customers/:customerId/deliveries`
- `GET /admin/deliveries`

## Testing Evidence

- Dashboard metrics tests.
- Recent delivery limit tests.
- Admin delivery pagination tests.
- Browser QA screenshots for dashboard/delivery pages.

## Delivered Output

Owner dashboard and history navigation.

## Notes/Concerns

Browser QA found and fixed admin mobile overflow and pagination alignment.
