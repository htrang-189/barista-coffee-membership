# Problem Discovered

The original assumption for Story 3.1 would likely have been that customer management could be introduced as a fairly simple owner-facing form and list. The delivered solution shows that the story needed to do more than add a CRUD screen. It needed to establish a durable customer ledger record that could support later package purchase recording, delivery history, customer login, and shared balance-link access.

The problem, therefore, was that a shallow customer form would have underdesigned the role of the customer record. In this product, a customer is not merely a contact entry. A customer is the identity anchor for every later membership transaction.

## Root Cause

The root cause of the adjustment was the shift from a general admin form mindset to a membership-ledger mindset. Once the product definition settled on a prepaid cup ledger, customer records became foundational business objects. That introduced several requirements that a simple create/edit form would not have captured well:

- uniqueness for phone and login identifier
- a stable customer detail page
- search across common identity fields
- a password field for later customer portal use
- a balance access token for later shared read-only access
- a current balance field that future ledger operations can update

In other words, the original low-granularity assumption was too small for the actual data role of the customer record.

## Decision Taken

The delivered implementation expanded the story into a full customer-account management capability rather than limiting it to record creation. The key decision was to treat the customer ledger as a business capability with list, search, create, and detail behaviors, and to place the reusable identity logic in `models/customer-account.js`.

That decision also included:

- enforcing unique identity fields before insert
- hashing passwords at creation time
- storing balance access tokens on the customer record
- exposing a stable detail page in the owner portal

This is a more robust plan because it aligns the customer record with all downstream business workflows.

## Updated Implementation Plan

The final implementation plan became:

1. Build a dedicated customer-account model that handles input normalization, duplicate detection, password hashing, token generation, and lookup functions.
2. Extend the admin portal with:
   - customer list
   - customer search
   - customer creation form
   - customer detail page
3. Enforce required fields and duplicate prevention before insert.
4. Store the customer as the canonical source for later purchase, delivery, and balance-link features.
5. Support a consistent owner-only route boundary so the customer ledger remains protected.

This updated plan is broader than the original simple form assumption, but it is still intentionally lean.

## Impact On Architecture

The adjustment had a positive architectural impact because it clarified the customer ledger as a model-centric domain object.

1. It strengthened separation of concerns.  
   The route layer handles HTTP rendering and redirects; the model layer handles customer data logic.

2. It established a durable shared record for later stories.  
   Customer purchases, deliveries, portal authentication, and balance-link access all depend on the same identity record.

3. It aligned the schema with future feature growth.  
   By including password hash, balance token, and current balance early, the app avoids a later schema redesign.

No architectural component was replaced. The adjustment clarified and hardened how the existing architecture should be used.

## Impact On Future Stories

Story 3.1 directly shapes the feasibility of subsequent work.

1. Package purchase stories can attach to a stable customer record.
2. Delivery stories can update the correct current balance.
3. Customer portal stories can authenticate against the same record.
4. Shared balance-link stories can reuse the balance access token without introducing a new account table.

The adjustment also means future stories should treat customer records as already-mature domain entities rather than incomplete placeholders.

## Lessons From The Adjustment

1. Ledger identity stories should not be reduced to form creation tasks.  
   If a customer record is the anchor for money-adjacent or balance-adjacent behavior, it needs stronger planning than a standard CRUD form.

2. The model layer should carry the business rules.  
   Duplicate prevention, hashing, and token generation belong close to the data boundary where they can be consistently enforced.

3. A customer detail page is a workflow handoff, not just a profile page.  
   It becomes the owner’s operational anchor for future package and delivery interactions.

4. Future customer-facing features are easier when the underlying customer record is already rich enough.  
   The earlier decision to store login identifier, password hash, balance token, and current balance reduced future complexity.

5. Business analysis should follow the actual role of the record in the product.  
   The customer object is a ledger entity, not a generic contact record. Once that distinction is clear, the implementation plan becomes much better.

