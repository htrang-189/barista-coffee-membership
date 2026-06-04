# UX Design Specification: Barista Coffee Membership

Date: 2026-06-01
Project: barista-coffee-membership
Status: Draft - Reconciled with Current Implementation And QA Gate

## 1. UX Goal

Design a small authenticated web app for coffee membership management. The interface should help admins create customer accounts, record package purchases with calculated VND pricing, show bonus cup calculations, record multi-cup deliveries, void mistaken deliveries, share read-only balance links/QR codes, and monitor balances. Customers should be able to log in or use a shared read-only balance link to understand their current balance, package history, and delivery history.

The UX specification follows Project Context and the updated PRD as the source of truth. Screens and flows should assume a vanilla HTML/CSS/JavaScript frontend served by a Node.js/Express application with SQLite-backed data.

## 2. Design Principles

- Make current cup balance prominent on every balance-related screen.
- Show bonus cup calculation clearly before saving package purchases.
- Show fixed price calculation clearly: `30.000 ₫` per purchased cup.
- Keep delivery recording fast for counter service.
- Keep delivery correction safe by marking mistaken deliveries voided instead of deleting records.
- Separate admin and customer interfaces completely.
- Use Project Context terminology: package purchase, bonus cups, delivery, delivery history, current balance.
- Make validation errors clear and close to the action.
- Avoid POS, loyalty campaign, and accounting-grade language.

## 3. Information Architecture

### Admin Area

- Admin login
- Admin dashboard
- Customer list
- Add customer account
- Customer detail
- Record package purchase
- Record delivery
- Void delivery
- Share balance link / QR code
- Reports
- Logout

### Customer Area

- Customer login
- Customer balance page
- Package history
- Delivery history
- Shared read-only balance link pages
- Logout

## 4. Navigation Model

Admin view:

- Admin routes live under `/admin/*`.
- Admin login opens the admin dashboard.
- Dashboard links to customer list, low balance customers, recent deliveries, and reports.
- Customer rows link to customer detail.
- Customer detail contains primary actions for package purchase and delivery recording.
- Admin logout is always available in the admin area.

Customer view:

- Customer routes live under `/customer/*`.
- Customer login opens the customer balance page.
- Customer balance page shows balance, low balance warning, package history, and delivery history.
- Customer logout is available.
- No admin navigation or admin actions appear in customer UI.

Unauthenticated route behavior:

- Unauthenticated admin-route access redirects to admin login.
- Unauthenticated customer-route access redirects to customer login.
- Customer attempts to access admin routes are denied and should not reveal admin navigation or data.

## 5. Key Screens

### 5.1 Admin Login

Purpose: protect admin operations.

Fields:

- Username or admin login identifier.
- Password.

Actions:

- Log in.

Validation and errors:

- Missing username.
- Missing password.
- Invalid login.
- Session expired.

UX notes:

- Do not reveal whether username or password was incorrect.
- Show loading feedback while login is being checked.
- On logout, return to admin login.

### 5.2 Customer Login

Purpose: allow customers to access only their own balance information.

Fields:

- Customer login identifier.
- Password.

Actions:

- Log in.

Validation and errors:

- Missing login identifier.
- Missing password.
- Invalid login.
- Session expired.

UX notes:

- Do not reveal whether login identifier or password was incorrect.
- Show loading feedback while login is being checked.
- On logout, return to customer login.

### 5.3 Admin Dashboard

Purpose: give the admin an immediate view of membership health and recent activity.

Required content:

- Total customer accounts.
- Total outstanding cups.
- Recorded package revenue.
- Bonus cups granted.
- Total cups delivered.
- Low balance customers.
- Recent deliveries, limited to the 5 newest records with a `View all deliveries` link.

Primary actions:

- Add customer.
- Open customer detail.
- Open full delivery history.

UX notes:

- Current balance and low balance indicators should be scannable.
- Recent deliveries should show newest first and stay compact.
- Dashboard metrics should use concise labels.
- Show loading states while metrics and recent deliveries load.
- Display user-friendly error states if dashboard data cannot load.

### 5.4 Customer List

Purpose: help admins find customer accounts quickly.

Required content:

- Customer name.
- Phone.
- Email when available.
- Current balance.
- Low balance status.
- Last delivery date.

Actions:

- Open customer detail.
- Add customer.

UX notes:

- Search by name, phone, or login identifier.
- Duplicate prevention should be emphasized during customer creation.
- Show loading feedback while search or list data refreshes.
- Empty search results should clearly say no matching customer was found.

### 5.5 Add Customer Account

Purpose: create an authenticated customer account.

Fields:

- Name, required.
- Phone, required.
- Email, optional.
- Login identifier, required.
- Initial password or temporary password, required.

Actions:

- Save customer.
- Cancel.

Validation:

- Name is required.
- Phone is required.
- Login identifier is required.
- Password is required.
- Duplicate phone or login identifier is blocked or requires explicit resolution.

Post-save behavior:

- Show customer detail page.
- Show confirmation that the customer account was created.

UX notes:

- Use simple HTML form fields.
- Show field-level errors near the relevant input.
- Show loading feedback while saving.
- Do not display technical database errors to the admin.

### 5.6 Customer Detail

Purpose: admin workspace for one customer account.

Required content:

- Customer name.
- Phone.
- Optional email.
- Login identifier.
- Current cup balance.
- Low balance warning when balance <= 5.
- Package purchase history.
- Delivery history in reverse chronological order.
- Shareable balance link and QR code controls.

Primary actions:

- Record delivery.
- Record package purchase.
- Copy balance link.
- Show QR code.
- Regenerate balance link.
- Edit customer details.

Conditional destructive action:

- Delete customer, only if implemented.

UX notes:

- `Record delivery` should be prominent when balance is above 0.
- If balance is 0, disable delivery recording and show a clear warning.
- Current balance should update immediately after package purchase or delivery.
- Package purchase and delivery history previews should show only the 5 newest records with `View All` links.
- Full history pages should show complete history newest first.
- Regenerating a balance link should invalidate the old link.
- If delete customer is implemented, require a confirmation dialog before completion.
- Show loading feedback while package and delivery history load.

### 5.7 Record Package Purchase

Purpose: record a package and add the correct number of cups.

Fields:

- Package size, required: 10, 20, or 30.

System behavior:

- Validates package size.
- Calculates amount paid automatically at `30.000 ₫` per purchased cup.
- Shows bonus cups.
- Shows total cups added.
- Shows calculated amount paid using VND formatting.
- Creates package purchase record.
- Adds total cups to current balance.

Package display rules:

- `10 -> 11`: 10 package cups + 1 bonus cup = 11 total cups.
- `20 -> 22`: 20 package cups + 2 bonus cups = 22 total cups.
- `30 -> 33`: 30 package cups + 3 bonus cups = 33 total cups.

UX notes:

- Use a segmented control or select with only valid package sizes.
- The purchased cups, calculated amount, bonus note, and total credited cups should be visible before save.
- Invalid package sizes should not be user-selectable.
- Show current balance before save and projected balance after save.
- Show loading feedback while saving the package purchase.
- If save fails, keep the selected package visible so the admin can retry.

### 5.8 Record Delivery

Purpose: subtract one or more delivered cups quickly during counter service.

Fields:

- Delivered cups, required, positive integer, default `1`.
- Optional note.

System behavior:

- Creates delivery history record.
- Subtracts delivered cup quantity from current balance.
- Stores balance after delivery.
- Blocks delivery if current balance is 0.
- Blocks delivery quantity greater than current balance.

UX notes:

- Show current balance before confirming delivery.
- Use a fast confirmation-light interaction.
- Show immediate success state with updated balance.
- At 0 balance, explain that delivery cannot be recorded until a package is purchased.
- If quantity exceeds balance, explain that the delivery quantity is greater than current balance.
- Show loading feedback while recording delivery.
- If another delivery changes the balance concurrently, show the latest balance and a clear retry message.

### 5.8A Void Delivery

Purpose: correct mistaken delivery recording without deleting history.

Actions:

- Void delivery, available to admins only on non-voided delivery records.

System behavior:

- Restores the delivered cup quantity to current balance.
- Marks the delivery as voided/cancelled.
- Prevents voiding the same delivery twice.
- Excludes voided deliveries from dashboard delivered-cup totals.

UX notes:

- Show voided deliveries with a clear `Voided` label.
- Do not delete voided rows from history.
- Show a confirmation or clear feedback after voiding.

### 5.9 Reports

Purpose: summarize operational activity.

Required content:

- Total customer accounts.
- Total recorded package revenue.
- Package purchases by package size.
- Bonus cups granted.
- Total cups added.
- Total cups delivered.
- Total outstanding cups.
- Low balance customers.
- Recent deliveries, limited to 5 on the dashboard with a `View all deliveries` link.
- Per-customer current balance.
- Per-customer delivery history access.

UX notes:

- Label revenue as recorded package revenue.
- Avoid accounting compliance language.
- Show loading states while report data loads.
- Display report errors as user-friendly messages, not technical errors.

### 5.10 Customer Balance Page

Purpose: let the customer verify their membership balance and activity.

Required content:

- Customer display name.
- Time-of-day greeting: morning, afternoon, or evening.
- Member-since message.
- Current cup balance in the right-side balance card.
- Used cups.
- Cup consumption progress bar based on used cups and remaining cups.
- Low balance warning when balance <= 5.
- Notification bell in the header with badge, periodic shake, and popover for low or exhausted balance.
- Package purchase history.
- Delivery history in reverse chronological order.
- Recent package and delivery history previews limited to 3-5 records each.
- `View All` links for complete package and delivery history.

Visual direction:

- Warm cream page background.
- Dark green hero membership card.
- Dynamic greeting and friendly membership copy in the hero.
- Subtle low-opacity coffee-themed decoration in the hero card.
- Current balance remains outside the hero card in the right-side balance panel.
- Package history and cup history appear as compact side-by-side cards on desktop and stacked cards on smaller screens.

Forbidden content:

- Admin actions.
- Other customer data.
- Admin-only reports.
- Payment amounts.

### 5.11 Shared Balance Link Page

Purpose: let customers view read-only balance information from an owner-generated link or QR code.

Required content:

- Customer display name.
- Time-of-day greeting and member-since message.
- Current cup balance in the right-side balance card.
- Used cups.
- Cup consumption progress bar.
- Low balance warning when balance <= 5.
- Notification bell with low-balance popover.
- Package history preview limited to 3-5 records.
- Delivery history preview limited to 3-5 records.
- `View All` links to read-only full-history pages.

Forbidden content:

- Admin actions.
- Payment amounts.
- Login identifier.
- Other customer data.

UX notes:

- Responsive desktop web layout, centered around 1100-1200px max width, stacking cards on smaller screens.
- Current balance should appear near the top without scrolling.
- Delivery entries should be plain and readable.
- Show loading feedback while account data loads.
- If the customer session expires, return to customer login with a clear message.

## 6. Display Rules

### Package Purchase Display

Admin view:

- Show package size.
- Show bonus cups.
- Show total cups added.
- Show calculated amount paid using VND formatting.
- Use VND formatting such as `300.000 ₫`.
- Show date/time.

Customer view:

- Show package size.
- Show bonus cups.
- Show total cups added.
- Show date/time.
- Hide admin-only metadata.
- Hide payment amounts.

### Delivery History Display

Admin view:

- Show customer name.
- Show delivery date/time.
- Show delivered cups.
- Show balance after delivery.
- Show admin actor.
- Show note when present.

Customer view:

- Show delivery date/time.
- Show delivered cups.
- Show balance after delivery.
- Show note when appropriate.
- Show voided/cancelled label when applicable.

### History Preview Display

- Customer detail, customer balance, and shared balance pages show recent package records and recent delivery records, currently 3-5 records depending on the section.
- `View All` opens a dedicated full-history page.
- Admin deliveries page is paginated newest first.

### Balance Display

- Current balance should be visually prominent.
- Low balance warning appears at 5 cups or fewer.
- Zero balance should use a clear warning state.

### Loading And Feedback Display

- Database-backed actions should show loading feedback.
- Successful package purchase and delivery actions should show confirmation and updated balance.
- Failed actions should show meaningful user-facing errors without technical details.

## 7. Empty, Error, And Edge States

### No Customer Accounts

Show a simple empty state with one primary action: Add customer.

### Duplicate Customer

Warn that a customer with the same phone or login identifier already exists and link to the existing account when possible.

### Invalid Package Size

Block submission and explain that only 10, 20, and 30 cup packages are supported.

### Balance Is 0

- Display current balance prominently.
- Disable record delivery.
- Show message that a package purchase is needed before delivery can be recorded.

### Low Balance

Show a warning when current balance is 5 cups or fewer.

### Delivery Quantity Exceeds Balance

Block submission and explain that the delivery quantity is greater than current balance.

### Voided Delivery

Keep the delivery visible with a clear voided label and restored balance reflected in current balance.

### Invalid Login

Show a clear login error without exposing whether username or password was wrong.

### Unauthorized Route

Redirect unauthenticated users to the correct login page.

Customers attempting admin routes should be denied and returned to the customer area or login.

### Session Expired

Show a clear message and return the user to the appropriate login page.

### Database Operation Failed

Show a user-friendly error and preserve entered form data when possible.

### Concurrent Delivery Conflict

If delivery cannot be saved because balance changed, show the latest balance and ask the admin to retry.

### Destructive Action

If delete customer or another destructive action is implemented, require confirmation before completion.

## 8. Responsive Behavior

Admin views:

- Desktop and tablet should show metrics, customer list, and recent deliveries efficiently.
- Mobile admin view should preserve all core actions with stacked sections.

Customer views:

- Mobile-first.
- Current balance should be visible near the top.
- Delivery history should be readable as a vertical list.
- History preview lists should remain compact, with full history available through `View All`.

## 9. Content Guidelines

Use concise operational labels:

- `Current balance`
- `Low balance`
- `Package purchase`
- `Package size`
- `Bonus cups`
- `Total cups added`
- `Record delivery`
- `Delivery history`
- `View All`
- `View all deliveries`
- `Copy link`
- `Show QR code`
- `Regenerate link`
- `Voided`
- `Recorded package revenue`
- `Outstanding cups`
- `Customer login`
- `Admin login`
- `Session expired`
- `Try again`
- `Save package purchase`

Avoid:

- `Redeem`
- `Redemption`
- `Private link`
- Payment amount on customer-facing pages.
- Loyalty campaign language.
- Accounting-grade claims.
- Payment-processing language.

## 10. Suggested UI Structure

### Admin Dashboard Layout

```text
Header
  Shop/product name
  Logout

Summary metrics
  Customers | Outstanding cups | Recorded revenue | Bonus cups | Delivered cups

Main area
  Low balance customers
  Recent deliveries
  Customer list shortcut
  Reports shortcut
```

### Customer Detail Layout

```text
Customer header
  Name, phone, login identifier
  Current balance, low balance status

Actions
  Record delivery
  Record package purchase
  Edit customer

History
  Package purchases
  Delivery history
```

### Package Purchase Layout

```text
Customer name
Current balance

Package size
Bonus cups
Total cups added
Amount paid

Save package purchase
```

### Record Delivery Layout

```text
Customer name
Current balance
Low balance warning if needed

Optional note
Record delivery
```

### Reports Layout

```text
Summary metrics
  Total customer accounts
  Recorded package revenue
  Outstanding cups
  Bonus cups granted
  Cups added
  Cups delivered

Breakdowns
  Package purchases by size
  Low balance customers
  Recent deliveries
```

### Customer Balance Layout

```text
Header with Barista Membership and notification bell
Hero membership card with time-of-day greeting and member-since message
Right-side balance card with current balance
Low balance warning if needed
Cup consumption progress bar

Package history
Delivery history
Logout
```

## 11. Accessibility Requirements

- All actions must be keyboard reachable.
- Buttons and form inputs must have clear labels.
- Color must not be the only way to show low balance or errors.
- Balance and history values should be readable at mobile sizes.
- Error messages should appear near the relevant field.
- Login forms should support password manager behavior.

## 12. MVP UX Acceptance Criteria

- Admin can log in and log out.
- Customer can log in and log out.
- Admin and customer interfaces are separate.
- Admin routes and customer routes have distinct navigation and login destinations.
- Admin can add a customer account with required login information.
- Duplicate customer creation is prevented or clearly warned.
- Admin can record package purchases for 10, 20, and 30 cup packages only.
- Bonus cup calculation is visible and correct for 10->11, 20->22, and 30->33.
- Admin can record delivered-cup quantity quickly.
- Delivery is blocked when balance is 0.
- Current balance is prominent in admin and customer views.
- Low balance warning appears at balance <= 5.
- Customer portal and shared balance link use the premium coffee membership visual style.
- Customer portal and shared balance link include notification bell and cup progress bar.
- Delivery history appears in reverse chronological order.
- Reports include customer count, recorded package revenue, package-size breakdown, bonus cups, cups added, cups delivered, outstanding cups, low balance customers, and recent deliveries.
- Database-backed actions show loading feedback and user-friendly errors.
- Customer cannot access admin actions.

## 13. Inputs

This UX specification is based on:

- Project Context: `_bmad-output/project-context.md`
- PRD: `_bmad-output/planning-artifacts/prd.md`
- Product Brief: `_bmad-output/planning-artifacts/product-brief.md`
- Research Findings: `_bmad-output/planning-artifacts/research-findings.md`

## 14. Recommended Next Step

Proceed to architecture and implementation planning using the Project Context and reconciled PRD as the primary references.
