# Problem Discovered

The original assumption for Story 3.2 would likely have been that customer-management hardening could be treated as a small validation add-on after customer creation existed. The delivered solution shows that the story needed to do more. It needed to protect the customer ledger as a business-critical identity system by making search reliable, keeping the detail page operationally useful, and enforcing duplicate and required-field rules in a way that could not be bypassed.

The problem was not that the simpler assumption was invalid. It was that it underestimates how central customer records are to the rest of the membership program. If the owner cannot find the right customer quickly or if invalid records can enter the system, later package and delivery workflows become unreliable.

## Root Cause

The root cause of the adjustment was that the customer ledger is not just a record list. It is the identity backbone for a prepaid membership system. That means the story needed to be more than UI validation and more than a search convenience. It needed to guarantee that:

- the owner can locate records using practical identity fields
- the customer detail page consistently shows the correct account
- duplicate customer identities do not enter the ledger
- missing required fields are blocked before persistence
- future workflows can trust the customer data without compensating logic

The original assumption was too shallow for the actual business role of the customer record.

## Decision Taken

The delivered implementation kept the story tightly focused but broadened it from a simple validation task into a ledger reliability story.

The main decisions were:

1. Implement search in the customer-account model across the owner’s common lookup fields.
2. Treat the customer detail page as the owner’s account snapshot, not a decorative profile.
3. Enforce required-field and duplicate validation at the server/model boundary.
4. Cover search, detail, and validation with automated tests so the behavior is protected from regression.

This is the correct decision because it makes customer management dependable without turning it into a large CRM feature.

## Updated Implementation Plan

The final implementation plan became:

1. Strengthen `models/customer-account.js` so it can validate inputs, search by identity fields, and support lookup for detail rendering.
2. Extend the existing admin routes to:
   - search customers from the list page
   - render the customer detail page as a stable source of truth
   - return business-readable validation errors when create attempts fail
3. Preserve owner-only access control.
4. Add automated tests for search, detail rendering, required fields, duplicate prevention, and protected access.

This updated plan is still lean, but it treats the customer ledger as a real business capability rather than a form-only enhancement.

## Impact On Architecture

The adjustment improved the architecture by making the customer-account model the authoritative place for identity and validation logic.

1. It reinforced separation of concerns.  
   Search and validation belong in the model, while the routes remain responsible for HTTP flow and rendering.

2. It made the customer detail page a first-class operational object.  
   That page becomes the handoff point for later purchase, delivery, and balance-link workflows.

3. It preserved a single customer source of truth.  
   The same SQLite record supports the owner portal now and the customer portal later.

No architectural direction changed. The adjustment simply made the existing architecture more explicit and more durable.

## Impact On Future Stories

Story 3.2 improves the reliability of everything that comes after it.

1. Package purchase stories can rely on customer records being unique and complete.
2. Delivery stories can assume the owner is operating on the correct customer record.
3. Customer portal stories can authenticate and present the correct identity data.
4. Shared balance-link stories can rely on the underlying customer record without extra reconciliation logic.

The adjustment also means future stories should continue to treat the customer account as a ledger object and not as a loose contact record.

## Lessons From The Adjustment

1. Search and validation stories can be business-critical, not just technical polish.  
   In a ledger application, usability and data integrity are inseparable.

2. The detail page is part of the workflow, not just a display screen.  
   It is where the owner confirms they are operating on the right customer.

3. Server-side validation matters more than browser validation.  
   The ledger must reject bad data at the model boundary.

4. Automated tests should reflect the business risk.  
   Search, duplicate prevention, required-field enforcement, and protected access are the behaviors most likely to matter later.

5. A small MVP still needs a disciplined identity model.  
   Even a single-shop application becomes unreliable quickly if customer identity rules are vague.

The final delivered solution is stronger than the original simple-hardening assumption because it treats customer management as part of the core operational ledger, which is the correct framing for this product.

