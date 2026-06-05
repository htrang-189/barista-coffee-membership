# Story P2-7: Notification Bell And Low-Balance Messaging

Status: Implemented
Phase: Phase 2 Customer Portal

## Objective

Notify customers visually when their package is running low or exhausted.

## Requirements

- Bell appears in customer header.
- Badge appears when balance is `<= 5`.
- Critical state appears when balance is `0`.
- Bell shakes periodically, not continuously.
- Clicking opens a popover.
- Popover can be closed.
- Low-balance banner remains under hero.
- No raw template placeholders.

## Scope

Included: notification markup, CSS animation, vanilla JS click behavior.

Excluded: email, SMS, push notifications.

## Files Created/Modified

- `routes/customer.js`
- `public/css/styles.css`
- `public/js/admin.js`
- `tests/customer-portal.test.js`
- Browser QA screenshots.

## Routes/Models/Views Involved

- Customer balance rendering.
- Shared balance rendering.

## Testing Evidence

- Notification HTML tests.
- Placeholder absence tests.
- Browser QA confirmed popover opens on customer and shared pages.

## Delivered Output

Read-only low-balance notification UI.

## Notes/Concerns

Old server processes should be restarted after code changes to avoid stale markup during manual review.
