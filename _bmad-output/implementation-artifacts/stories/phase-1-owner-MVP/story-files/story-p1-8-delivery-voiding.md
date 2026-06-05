# Story P1-8: Void/Cancel Mistaken Deliveries

Status: Implemented
Phase: Phase 1 Owner/Admin Portal

## Objective

Allow the owner to correct mistaken delivery entries without deleting history.

## Requirements

- Non-voided delivery can be voided.
- Voiding restores delivered cups to current balance.
- Voided delivery remains visible and labelled.
- Same delivery cannot be voided twice.
- Dashboard totals exclude voided deliveries.

## Scope

Included: void model function, admin route, void UI action, dashboard exclusion.

Excluded: deleting delivery records.

## Files Created/Modified

- `models/delivery-history.js`
- `models/dashboard.js`
- `routes/admin.js`
- `tests/phase1-owner.test.js`

## Routes/Models/Views Involved

- `POST /admin/deliveries/:deliveryId/void`
- `voidDelivery()`
- Dashboard delivered-cup query.

## Testing Evidence

- Void restores balance.
- Double void blocked.
- Voided delivery excluded from dashboard delivered total.

## Delivered Output

Reversible delivery correction.

## Notes/Concerns

Voiding is admin-only.
