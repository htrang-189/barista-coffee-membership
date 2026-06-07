# Phase 2: Customer Portal Retrospective Story Map

## Phase Objective

Phase 2 turns the authenticated customer portal into a usable self-service experience. The phase focus is not only access control, but also the customer-facing surfaces that make the portal valuable after login: membership visibility, history review, notifications, and a coherent UX. The current application source of truth shows that the customer portal is built around a session-protected customer experience layered on top of the owner and core membership foundation delivered earlier.

## Epic Objectives

### Epic 1: Customer Access & Authentication

Establish a secure customer-facing access boundary so customers can authenticate, remain signed in across portal navigation, and end their session cleanly.

### Epic 2: Customer Membership Dashboard

Provide the customer with a dashboard entry point that makes membership status understandable at a glance and gives the portal a stable landing experience.

### Epic 3: Package History

Expose package purchase history so customers can review how their membership packages were purchased, credited, and consumed over time.

### Epic 4: Delivery History

Expose delivery history so customers can review actual delivered cups, understand balance impacts, and track how their membership is being used.

### Epic 5: Customer Notifications

Add lightweight customer-facing notification surfaces that warn about low balance conditions and other important membership events.

### Epic 6: Customer Portal UX

Improve the portal experience so it is responsive, legible, and easy to navigate on common customer devices.

### Epic 7: Customer Portal QA

Ensure the customer portal remains safe and stable through focused automated coverage for authentication, dashboard/history surfaces, and notifications.

## Story Inventory Note

The requested structure contains 22 stories, not 19. The list below reflects the explicit story set provided in the request so the documentation matches the intended future structure. The inventory also shows the current application mapping, which is concentrated in the Phase 2 customer access layer today.

## Delivered Capability Summary

The current application source of truth shows a completed customer portal foundation with:

- secure customer access links
- customer login authentication
- customer session management

These delivered capabilities underpin the Phase 2 customer portal and provide the security boundary needed for the rest of the planned dashboard, history, notification, UX, and QA stories.

## Story Map

### Epic 1: Customer Access & Authentication

#### Story 1.1: Secure Customer Access Links

- Story title: Secure Customer Access Links
- Business objective: give customers a safe, direct path into the portal without exposing reusable account access links
- User value: customers can open the portal from trusted link entry points and reach the login flow securely
- Scope summary: secure link handling, entry-point protection, and access redirection behavior
- Related screens: customer login entry point, access-link landing behavior
- Related routes: `/customer/login`, secure link entry redirects
- Related files: customer route handlers, auth middleware, login view, customer access tests
- Dependencies: customer account records, session middleware, route protection helpers
- Acceptance criteria: link entry routes do not expose protected content; unauthorized users are redirected appropriately; the customer login path remains secure
- Delivered status: Delivered

#### Story 1.2: Customer Login Authentication

- Story title: Customer Login Authentication
- Business objective: authenticate customers into the portal through a reliable login flow
- User value: customers can sign in using their account credentials and reach their portal experience
- Scope summary: login form submission, credential verification, session creation, redirect after login
- Related screens: customer login page, login error state, post-login redirect target
- Related routes: `GET /customer/login`, `POST /customer/login`
- Related files: `routes/customer.js`, `models/customer-account.js`, login UI, auth tests
- Dependencies: password verification, session handling, customer account data
- Acceptance criteria: valid credentials log in successfully; invalid credentials are rejected; successful login routes to the customer portal
- Delivered status: Delivered

#### Story 1.3: Customer Session Management

- Story title: Customer Session Management
- Business objective: keep authenticated customers signed in while they navigate the portal
- User value: customers do not need to repeatedly reauthenticate during a portal session
- Scope summary: session persistence, protected route checks, logout invalidation, role separation
- Related screens: customer dashboard and protected customer views
- Related routes: `POST /customer/logout`, protected customer routes
- Related files: `middleware/auth.js`, `routes/customer.js`, session tests
- Dependencies: login authentication, middleware-based access control
- Acceptance criteria: protected routes require an active session; logout destroys session state; customer and owner access remain separate
- Delivered status: Delivered

### Epic 2: Customer Membership Dashboard

#### Story 2.1: Dashboard Layout Foundation

- Story title: Dashboard Layout Foundation
- Business objective: give customers a clean dashboard landing area after login
- User value: customers can orient themselves quickly and recognize the membership area of the portal
- Scope summary: base dashboard page structure, visual regions, responsive layout foundation
- Related screens: dashboard landing page, summary layout shells
- Related routes: dashboard entry route in the customer portal
- Related files: customer-facing dashboard views, shared styling, layout templates
- Dependencies: customer authentication, session management, shared UI layout
- Acceptance criteria: the customer reaches a dashboard after login; the page is responsive; the structure supports later dashboard widgets
- Delivered status: Planned

#### Story 2.2: Membership Summary Cards

- Story title: Membership Summary Cards
- Business objective: surface key membership data in concise dashboard cards
- User value: customers can understand their account state at a glance
- Scope summary: summary cards for membership data, balance status, and account visibility
- Related screens: dashboard summary area
- Related routes: dashboard data endpoints or page rendering path
- Related files: dashboard view fragments, summary data helpers, tests
- Dependencies: dashboard layout foundation, membership data aggregation
- Acceptance criteria: summary cards display the correct membership data; cards render consistently on portal landing
- Delivered status: Planned

#### Story 2.3: Dynamic Welcome Experience

- Story title: Dynamic Welcome Experience
- Business objective: personalize the portal greeting to reinforce membership ownership
- User value: customers see a portal that feels directly addressed to them
- Scope summary: customer-specific welcome message, display name or contextual greeting logic
- Related screens: dashboard header / welcome banner
- Related routes: dashboard entry route
- Related files: customer view templates, welcome helper logic
- Dependencies: authenticated customer identity, dashboard shell
- Acceptance criteria: welcome messaging changes based on the signed-in customer; messaging remains safe and consistent
- Delivered status: Planned

#### Story 2.4: Premium Hero Banner

- Story title: Premium Hero Banner
- Business objective: strengthen the portal’s premium feel and visual trust
- User value: customers experience a polished membership product instead of a utilitarian admin screen
- Scope summary: banner treatment, branding layer, dashboard hero presentation
- Related screens: dashboard hero / top-of-page banner area
- Related routes: dashboard route
- Related files: dashboard view styles, shared UI components
- Dependencies: dashboard layout foundation, UX direction
- Acceptance criteria: banner renders on dashboard; design remains consistent across devices
- Delivered status: Planned

### Epic 3: Package History

#### Story 3.1: Recent Package History

- Story title: Recent Package History
- Business objective: show customers the latest package purchase activity
- User value: customers can review recent spending and package usage
- Scope summary: recent purchase list, limited history summary, display of recent package events
- Related screens: package history section
- Related routes: package history view
- Related files: history query helpers, customer portal templates
- Dependencies: package purchase records, dashboard/history data access
- Acceptance criteria: recent package events display correctly; the newest entries are easy to review
- Delivered status: Planned

#### Story 3.2: Full Package History

- Story title: Full Package History
- Business objective: provide access to complete package purchase history
- User value: customers can audit prior package purchases when needed
- Scope summary: full purchase history listing, filtering or pagination if needed
- Related screens: package history page or expanded history panel
- Related routes: package history route
- Related files: package history query logic, templates, tests
- Dependencies: recent package history, history data model
- Acceptance criteria: customers can view the full purchase history; entries are ordered and understandable
- Delivered status: Planned

#### Story 3.3: Package Bonus Display

- Story title: Package Bonus Display
- Business objective: make bonus package credits visible to the customer
- User value: customers understand what extra value came with their package purchases
- Scope summary: bonus cup display, package credit breakdown, visible bonus annotations
- Related screens: package history and dashboard summary sections
- Related routes: package history and dashboard routes
- Related files: history rendering helpers, summary components
- Dependencies: package purchase data, bonus-credit logic from owner foundation
- Acceptance criteria: bonus credits are displayed clearly and accurately wherever relevant
- Delivered status: Planned

### Epic 4: Delivery History

#### Story 4.1: Recent Delivery History

- Story title: Recent Delivery History
- Business objective: expose the latest delivery events to the customer
- User value: customers can see what was just delivered and how it affected their balance
- Scope summary: recent delivery list, latest cup activity, balance impact visibility
- Related screens: recent delivery area
- Related routes: delivery history view
- Related files: delivery history query logic, customer portal templates
- Dependencies: delivery records, balance calculation logic
- Acceptance criteria: recent deliveries display in correct order; balance impact is understandable
- Delivered status: Planned

#### Story 4.2: Full Delivery History

- Story title: Full Delivery History
- Business objective: give customers complete visibility into delivered cups over time
- User value: customers can audit all delivery usage, not just recent activity
- Scope summary: full delivery history list, historical display, ordered detail views
- Related screens: delivery history page
- Related routes: delivery history route
- Related files: delivery history query and rendering code
- Dependencies: recent delivery history, delivery record model
- Acceptance criteria: customers can review the full delivery history accurately and in order
- Delivered status: Planned

#### Story 4.3: Balance Snapshot Tracking

- Story title: Balance Snapshot Tracking
- Business objective: make balance changes understandable over time
- User value: customers can see how each delivery affects the remaining balance
- Scope summary: balance snapshot display, history-linked balance state, current balance context
- Related screens: delivery history and dashboard balance areas
- Related routes: balance-aware customer views
- Related files: balance helpers, delivery history integration
- Dependencies: delivery history, package balance logic
- Acceptance criteria: the balance snapshot reflects the correct current state after deliveries
- Delivered status: Planned

### Epic 5: Customer Notifications

#### Story 5.1: Low Balance Warning

- Story title: Low Balance Warning
- Business objective: alert customers before their balance becomes problematic
- User value: customers can react before they run out of credits
- Scope summary: low balance messaging, warning thresholds, customer-facing alert state
- Related screens: dashboard alert area, balance page warning state
- Related routes: dashboard/balance routes
- Related files: notification helpers, customer portal views
- Dependencies: balance tracking, customer session context
- Acceptance criteria: low balance warnings appear when the threshold is reached; alerts are accurate and visible
- Delivered status: Planned

#### Story 5.2: Notification Bell

- Story title: Notification Bell
- Business objective: give customers a persistent indicator of portal alerts
- User value: customers can notice important account events quickly
- Scope summary: bell icon, unread indicator, portal notification entry point
- Related screens: portal header/navigation
- Related routes: notification feed or notification panel route
- Related files: header components, notification rendering logic
- Dependencies: customer portal shell, alert sources
- Acceptance criteria: notification bell appears consistently and reflects alert state
- Delivered status: Planned

#### Story 5.3: Package Exhausted Alerts

- Story title: Package Exhausted Alerts
- Business objective: warn customers when package credits are depleted
- User value: customers know when a package has been used up and can take action
- Scope summary: exhausted-package warning messaging, alert state, portal visibility
- Related screens: balance/dashboard alert surfaces
- Related routes: customer portal alert display paths
- Related files: alert logic, customer view components
- Dependencies: package balance calculations, notification model
- Acceptance criteria: exhausted-package alerts are shown when appropriate and do not misfire
- Delivered status: Planned

### Epic 6: Customer Portal UX

#### Story 6.1: Responsive Customer Experience

- Story title: Responsive Customer Experience
- Business objective: make the customer portal usable on common customer devices
- User value: customers can use the portal comfortably on desktop and mobile
- Scope summary: responsive layout behavior, viewport adaptation, spacing and readability improvements
- Related screens: all customer portal screens
- Related routes: all customer portal routes
- Related files: shared CSS/layout, responsive UI components
- Dependencies: dashboard and portal views, shared style system
- Acceptance criteria: pages remain usable across major viewport sizes; no layout breakage on mobile
- Delivered status: Planned

#### Story 6.2: Visual Design Refresh

- Story title: Visual Design Refresh
- Business objective: improve the visual quality and trustworthiness of the customer portal
- User value: the portal feels polished and premium
- Scope summary: visual refinement, styling consistency, brand presentation improvements
- Related screens: dashboard, balance, history, and notification areas
- Related routes: all customer views
- Related files: style sheets, component styling, shared templates
- Dependencies: responsive layout, portal UI foundation
- Acceptance criteria: the portal has a consistent, updated visual style that remains readable
- Delivered status: Planned

#### Story 6.3: Navigation And History Actions

- Story title: Navigation And History Actions
- Business objective: make it easy for customers to move between key portal sections
- User value: customers can find balance, history, and notification actions quickly
- Scope summary: navigation controls, history action links, portal action patterns
- Related screens: portal header, dashboard links, history action surfaces
- Related routes: customer portal navigation routes
- Related files: navigation components, action handlers
- Dependencies: dashboard, package history, delivery history
- Acceptance criteria: navigation is intuitive and actions lead to the correct customer portal pages
- Delivered status: Planned

### Epic 7: Customer Portal QA

#### Story 7.1: Customer Authentication Tests

- Story title: Customer Authentication Tests
- Business objective: keep customer login and session behavior reliable
- User value: customers can trust that sign-in and sign-out work consistently
- Scope summary: login/logout tests, access-control tests, session invalidation tests
- Related screens: login flow and protected portal screens
- Related routes: customer auth and session routes
- Related files: customer portal tests
- Dependencies: customer authentication and session handling
- Acceptance criteria: auth flows are covered by automated regression tests
- Delivered status: Planned

#### Story 7.2: Dashboard And History Tests

- Story title: Dashboard And History Tests
- Business objective: protect the dashboard and history experience from regressions
- User value: customers can rely on stable dashboard and history behavior
- Scope summary: dashboard rendering tests, package history tests, delivery history tests
- Related screens: dashboard and history screens
- Related routes: dashboard/history routes
- Related files: dashboard and history test suites
- Dependencies: dashboard layout and history features
- Acceptance criteria: dashboard and history behavior are covered by regression tests
- Delivered status: Planned

#### Story 7.3: Notification Tests

- Story title: Notification Tests
- Business objective: ensure customer alerts and notification indicators remain correct
- User value: customers do not miss important balance or package alerts
- Scope summary: notification rendering tests, warning tests, alert state tests
- Related screens: dashboard notifications, notification bell, alert surfaces
- Related routes: notification endpoints or UI paths
- Related files: notification test suites
- Dependencies: notification logic, alert thresholds, portal UI
- Acceptance criteria: notification states are test-covered and render correctly
- Delivered status: Planned

## Current Application Mapping

The current application maps directly to the following Phase 2 delivered capabilities:

- Story 1.1 Secure Customer Access Links
- Story 1.2 Customer Login Authentication
- Story 1.3 Customer Session Management

These stories are already implemented in the current customer portal source of truth. The remaining stories are planned future customer-portal capabilities that are structurally defined here for documentation and retrospective planning purposes.

## Documentation Notes

- This file is an inventory and retrospective story map, not an implementation workflow artifact.
- It intentionally does not include create-story, sprint planning, dev-story, code review, correct-course, retrospective, or investigate output.
- The current application source of truth supports the delivered status only for the access/authentication stories listed above.
- The epic/story structure in this inventory is preserved exactly as requested, even though the requested total story count does not match the enumerated list.
