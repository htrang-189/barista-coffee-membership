# Phase 2 Customer Portal Scope

Date: 2026-06-03
Project: barista-coffee-membership
Owner: John, Product Manager
Status: Reconciled with Current Implementation And QA Gate

## 1. Purpose

Define the implemented Phase 2 Customer Portal scope and the related QR/share balance link enhancement. The current working app and latest QA gate are the source of truth.

Source artifacts:

1. Project Context: `_bmad-output/project-context.md`
2. PRD: `_bmad-output/planning-artifacts/prd.md`
3. Architecture: `_bmad-output/planning-artifacts/architecture.md`
4. Completed implementation and QA gate

## 2. Business Goal

Allow customers to self-service their membership account through a read-only portal and optional owner-generated share link/QR code.

The customer experience reduces routine balance-checking requests while preserving strict separation from owner/admin functionality.

## 3. User Role

### Customer

A coffee membership customer with an existing customer account created by the owner.

The customer can:

- Log in.
- View only their own authenticated account.
- See current cup balance.
- See used cups and cup consumption progress.
- See low-balance warning when applicable.
- See customer notifications for low or exhausted balance.
- See package purchase history.
- See delivery history in reverse chronological order.
- Use `View All` links for complete read-only package and delivery history.
- Log out.

The customer cannot:

- Access admin routes.
- View other authenticated customer accounts.
- Create or edit account data.
- Record package purchases.
- Record deliveries.
- Void deliveries.
- View payment amounts.
- View owner dashboard metrics or reports.

## 4. In-Scope Features

### Customer Authentication

- Customer login page.
- Customer logout.
- Customer session creation and clearing.
- Generic invalid-login error message.
- bcrypt password verification against existing `customer_accounts.password_hash`.

### Customer Route Protection

- Protect authenticated customer routes.
- Redirect unauthenticated customers to `/customer/login`.
- Load authenticated customer data from the session customer id.
- Prevent customer id selection through URL parameters or form fields.

### Read-Only Customer Balance Page

- Show customer name.
- Show current cup balance prominently.
- Show used cups.
- Show cup consumption progress based on used cups and remaining cups.
- Show low-balance warning when current balance is `<= 5`.
- Show a notification bell with badge and low/exhausted balance popover.
- Show 3-5 most recent package purchases.
- Show 3-5 most recent deliveries.
- Include `View All` links to full package and delivery history pages.
- Use a responsive desktop web layout with stacked mobile behavior.
- Use the premium coffee membership UI: dark green/cream palette, time-of-day greeting, member-since message, and subtle coffee-themed hero decoration.

### Package Purchase History For Customer

- Show package size.
- Show bonus cups.
- Show total cups added.
- Show purchase date/time.
- Hide payment amounts.
- Do not show admin-only controls.

### Delivery History For Customer

- Show delivery date/time.
- Show delivered cup quantity.
- Show balance after delivery.
- Show note when present.
- Clearly label voided/cancelled deliveries.
- Display newest deliveries first.

### QR / Share Balance Link Access

- Owner can copy a customer-specific balance link.
- Owner can show a QR code for the same secure link.
- Owner can regenerate the balance link.
- Regenerating the link invalidates the old token.
- Shared link opens a read-only customer balance page.
- Shared link uses the same customer membership UI as the authenticated portal.
- Shared link shows 3-5 most recent package and delivery records with read-only `View All` pages.
- Shared link hides payment amounts, login identifier, admin navigation, and admin actions.
- Invalid or regenerated tokens return 404.

### Customer/Admin Separation

- Customer pages must not render admin navigation.
- Customer pages must not render owner-only actions.
- Customer authorization must be enforced server-side.
- Shared token access must use only the secure token, not customer id or login identifier.

## 5. Out-Of-Scope Features

- Customer account registration.
- Customer password reset.
- Customer profile editing.
- Customer package purchase requests.
- Customer delivery requests.
- Customer-facing payments.
- Email, SMS, or push notifications.
- Loyalty rewards.
- Advanced reporting.
- Multi-shop support.
- Production deployment enhancements.

## 6. Dependencies On Phase 1

Phase 2 depends on these completed capabilities:

- Express application scaffold.
- SQLite database and schema.
- `customer_accounts` table with customer identity, credentials, balance, and `balance_access_token`.
- bcrypt password hashing utilities.
- Admin-created customer accounts.
- Package purchase records with fixed `30.000 ₫` per cup pricing.
- Delivery history records with delivered cup quantity and optional void state.
- Session infrastructure from admin authentication.
- Existing `/admin/*` route separation.
- Existing UI stylesheet and design guideline.

## 7. Product Decisions To Preserve

- Customer portal is read-only.
- Shared balance link is read-only.
- Owner remains the only actor who records packages, records deliveries, and voids deliveries.
- Customer package history does not show payment amounts.
- Customer delivery history shows notes when notes exist.
- Customer display uses the customer's full name.
- Customer login identifier is not shown after login.
- Current balance must be prominent.
- History order is newest first.
- History previews show recent records with full-history `View All` pages.
- UI follows the warm, premium coffee-shop design direction without using Starbucks branding or proprietary assets.
- Customer and shared balance pages include a time-of-day greeting, member-since message, cup progress bar, and notification bell for low/exhausted balance.

## 8. Proposed Epics

### Epic 1: Customer Authentication

Enable customers to log in and log out using existing customer account credentials.

### Epic 2: Customer Route Protection

Protect authenticated customer routes and ensure customers can only access their own session-backed account data.

### Epic 3: Read-Only Customer Balance View

Provide current balance, low-balance status, and compact history previews.

### Epic 4: Customer Package History

Show customer-visible package purchase history without payment amounts or admin controls.

### Epic 5: Customer Delivery History

Show customer-visible delivery history, including delivered cup quantities, notes, balance after delivery, and void labels.

### Epic 6: Shared Balance Link And QR Access

Provide owner-generated secure read-only balance links and QR codes with token regeneration.

### Epic 7: Customer Portal Testing

Validate customer authentication, authorization, read-only visibility, token access, token regeneration, and history display limits.
