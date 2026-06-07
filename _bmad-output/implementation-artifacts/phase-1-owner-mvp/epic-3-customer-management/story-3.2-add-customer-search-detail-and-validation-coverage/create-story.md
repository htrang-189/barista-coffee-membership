# Story Title

Story 3.2: Add Customer Search, Detail, And Validation Coverage

## Business Context

The coffee shop owner’s customer ledger is only useful if customer records can be found quickly and trusted to be accurate. Story 3.1 created the customer account capability, but that capability must also be dependable in day-to-day operation. The owner needs to search by the most common identity fields, open a customer detail page that clearly confirms the right person, and rely on validation rules that stop duplicate or incomplete records from entering the ledger.

In the prepaid membership model, a customer record is not simply contact information. It is the identity anchor for every future package purchase, cup delivery, and balance-linked workflow. If the owner cannot reliably find the right customer or if the system allows ambiguous records, the rest of the membership program loses operational trust. Story 3.2 exists to protect that trust.

The delivered application confirms that this is the correct business framing. The current app supports searching customers by name, phone, and login identifier, keeps the customer detail page as the owner’s operational account snapshot, and validates duplicate and required customer data before creation.

## User Story

As the coffee shop owner,  
I want customer search, detail, and validation behavior to be reliable and clear,  
so that I can find the right customer quickly and prevent bad or duplicate records from entering the membership ledger.

## Acceptance Criteria

1. The owner can search customer records by name, phone, or login identifier.
2. The customer list returns stable and predictable results when search is used.
3. The customer detail page is available at `GET /admin/customers/:customerId`.
4. The customer detail page shows the customer’s identity and current balance context.
5. The customer detail page is accessible only to authenticated owner users.
6. Creating a customer with a duplicate phone number is rejected.
7. Creating a customer with a duplicate login identifier is rejected.
8. Creating a customer without a name is rejected.
9. Creating a customer without a phone number is rejected.
10. Creating a customer without a login identifier is rejected.
11. Creating a customer without a password is rejected.
12. Creating a customer with an email address is allowed, but the email field remains optional.
13. Duplicate and validation errors are presented to the owner in clear business language.
14. Search and validation behavior are covered by automated tests.
15. The customer detail page remains a dependable operational source of truth for later workflows.

## Functional Requirements

1. The system shall support search by customer name, phone, and login identifier.
2. The system shall support a customer detail route for existing customers.
3. The system shall display the current balance on the customer detail page.
4. The system shall enforce required fields for customer creation.
5. The system shall reject duplicate phone numbers before insert.
6. The system shall reject duplicate login identifiers before insert.
7. The system shall allow email as an optional field.
8. The system shall return business-friendly validation messages for invalid customer creation attempts.
9. The system shall keep customer-management functionality protected behind owner authentication.
10. The system shall preserve the customer detail page as the owner’s working record for later account activity.

## Non-Functional Requirements

1. Search shall be fast enough for a small coffee shop to use during normal service.
2. Validation shall be reliable and consistent across the model and route layers.
3. Customer detail data shall remain accurate and stable so later workflows can trust it.
4. The UI shall remain simple and legible rather than becoming a CRM-style control panel.
5. The implementation shall fit the project’s low-maintenance local SQLite architecture.
6. The validation strategy shall prevent bad records rather than trying to repair them later.

## UI Requirements

1. The customer list page shall provide a search field for the owner.
2. The customer list page shall support scanning and locating customers by identity fields.
3. The customer detail page shall show identity and balance information in one place.
4. Validation errors on the add-customer form shall be clear and visible to the owner.
5. The UI shall keep the customer record as an operational account snapshot rather than a decorative profile page.
6. The UI shall remain owner-only and not introduce customer self-service behavior.

## Database Requirements

1. Customer records shall continue to be stored in SQLite as the source of truth.
2. The customer record shall support name, phone, email, login identifier, password hash, balance access token, and current balance.
3. Phone numbers shall remain unique.
4. Login identifiers shall remain unique.
5. Passwords shall continue to be hashed before storage.
6. The data model shall remain suitable for later package, delivery, and customer portal work.

## Technical Notes

1. Search logic should live in the customer-account model rather than route handlers.
2. Duplicate prevention should be performed before insert so the owner gets a clean validation message.
3. The customer detail page should rely on the same customer-account model used by later purchase and delivery workflows.
4. Validation should not be limited to HTML form attributes; it must also exist in server-side logic.
5. Tests should cover both success and failure paths because the business risk here is data integrity, not just UI rendering.
6. The route layer should continue to defer to owner authentication middleware for access control.

## Testing Requirements

1. Verify that searching by name, phone, and login identifier returns expected records.
2. Verify that the customer detail page renders for an existing customer.
3. Verify that duplicate phone numbers are rejected.
4. Verify that duplicate login identifiers are rejected.
5. Verify that missing required fields are rejected.
6. Verify that optional email values are accepted.
7. Verify that protected customer-management routes remain owner-only.
8. Verify that validation and search behavior do not break the existing customer ledger model.

## Definition Of Done

The story is done when:

1. Customer search works across the expected identity fields.
2. Customer detail pages remain stable and operationally useful.
3. Duplicate and missing-field validation is enforced before invalid records are stored.
4. The customer ledger remains trustworthy enough to support package, delivery, and portal stories.
5. The customer-management experience remains owner-only and aligned with the rest of the MVP.

