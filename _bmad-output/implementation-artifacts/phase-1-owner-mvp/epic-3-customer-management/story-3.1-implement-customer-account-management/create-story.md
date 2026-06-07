# Story Title

Story 3.1: Implement Customer Account Management

## Business Context

The coffee shop’s membership program depends on the owner being able to create and maintain a trusted record for each customer before any prepaid cups are purchased or delivered. Phase 1 is not a general CRM product and it is not a self-service customer portal yet. It is an owner-operated prepaid membership ledger. That means customer management is the identity foundation for the rest of the business workflow.

If the owner cannot create customers reliably, search them later, and open a durable account record, then the later package purchase and cup delivery features have no safe anchor. A wrong or duplicate account would cause balance changes to attach to the wrong person, which would undermine customer trust and make the application less reliable than a spreadsheet.

The delivered application shows that this story was correctly positioned as a core owner capability. The current app allows the owner to create customer accounts with required identity fields, prevents duplicate phone numbers and login identifiers, supports search by name/phone/login identifier, and opens a customer detail page that becomes the basis for package, delivery, and balance-link workflows.

## User Story

As the coffee shop owner,  
I want to create and manage customer membership accounts in the admin portal,  
so that I can reliably record prepaid cup activity against the correct customer and find that customer again later when I need to update their account.

## Acceptance Criteria

1. The owner can open a customer list page from the admin portal.
2. The customer list is visible only to authenticated owner users.
3. The customer list supports search by customer name, phone number, and login identifier.
4. The owner can open a customer creation page from the admin portal.
5. The customer creation page is visible only to authenticated owner users.
6. The owner can submit a new customer account from the admin portal.
7. Creating a customer requires a name.
8. Creating a customer requires a phone number.
9. Creating a customer requires a login identifier.
10. Creating a customer requires an initial password.
11. Creating a customer allows an optional email address.
12. The system rejects duplicate phone numbers.
13. The system rejects duplicate login identifiers.
14. A successful customer creation redirects the owner to the new customer detail page.
15. The customer detail page displays the customer’s name, phone number, email, login identifier, and current balance.
16. The customer detail page is visible only to authenticated owner users.
17. Customer records are stored in the SQLite database and can be retrieved later for search and detail views.
18. The customer account record includes the identity data needed for later package and delivery workflows.

## Functional Requirements

1. The system shall provide a customer list view under the admin portal.
2. The system shall provide a customer creation form under the admin portal.
3. The system shall persist customer accounts in SQLite.
4. The system shall enforce required fields for name, phone, login identifier, and password.
5. The system shall allow email to be optional.
6. The system shall prevent duplicate phone numbers.
7. The system shall prevent duplicate login identifiers.
8. The system shall hash the initial customer password before storing it.
9. The system shall provide a detail view for each customer record.
10. The system shall support customer lookup by name, phone, and login identifier.
11. The system shall display the current balance on the customer detail page.
12. The system shall keep customer-management routes behind owner authentication.

## Non-Functional Requirements

1. Customer management shall remain simple enough for a single small coffee shop to operate without dedicated support staff.
2. Customer creation and search shall be responsive enough for use during normal shop interactions.
3. Customer account data shall remain internally consistent and usable as the source of truth for later ledger workflows.
4. Password storage shall be secure and align with the application’s existing hashing approach.
5. The customer list and detail pages shall remain clear and practical rather than visually complex.
6. The implementation shall stay compatible with the project’s local-run SQLite architecture.

## UI Requirements

1. The customer list page shall present customers in a format the owner can scan quickly.
2. The customer creation page shall use a simple form with clear labels.
3. The customer detail page shall show identity information and current balance in one place.
4. Search shall be accessible directly from the customer list page.
5. Duplicate validation errors shall be shown clearly to the owner.
6. The UI shall remain owner-only and not expose customer self-service behavior yet.

## Database Requirements

1. Customer accounts shall be stored in the SQLite database.
2. Customer records shall include name, phone, email, login identifier, password hash, balance access token, and current balance.
3. Phone numbers shall be unique.
4. Login identifiers shall be unique.
5. Passwords shall never be stored in plaintext.
6. The customer record shall be structured to support later balance-link and customer-portal features without requiring a redesign.

## Technical Notes

1. The customer account model should own creation, search, and lookup logic rather than embedding database SQL directly in route handlers.
2. Password handling should reuse the application’s existing hashing helper.
3. Search should support the common identity fields the owner will actually use in the shop: name, phone, and login identifier.
4. The customer detail page should be the operational source of truth for the owner when following up on package purchases or delivery entries.
5. Duplicate prevention should happen before insert so the owner receives a clear business error rather than a low-level database failure.
6. The admin routes for customer management must remain protected by the owner-authentication layer already delivered.

## Testing Requirements

1. Verify that creating a customer with valid required fields succeeds.
2. Verify that missing required fields are rejected.
3. Verify that duplicate phone numbers are rejected.
4. Verify that duplicate login identifiers are rejected.
5. Verify that the customer list supports search by the expected fields.
6. Verify that the customer detail page renders for an existing record.
7. Verify that customer-management routes remain protected from unauthenticated access.
8. Verify that the stored customer password is hashed and not plaintext.

## Definition Of Done

The story is done when:

1. The owner can create customer accounts from the admin portal.
2. Duplicate phone numbers and duplicate login identifiers are blocked.
3. The customer list and customer detail views are usable from the owner portal.
4. Customer records are stored securely and are suitable for future package and delivery workflows.
5. Customer-management access remains protected behind owner authentication.
6. The application’s current SQLite data model supports the customer ledger without introducing unnecessary complexity.

