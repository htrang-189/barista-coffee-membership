# Story 2.1: Implement Owner Authentication And Route Protection

Phase: Phase 1: Owner MVP

Epic: Epic 2: Owner Authentication

Output type: Updated Plan

Workflow context: BMAD correct-course output

Status: Complete / Delivered

## Correct-Course Summary

Story 2.1 began from an earlier assumption that owner authentication could be tracked as several smaller technical stories: password hashing, initial admin creation, login/logout, and route protection. The final delivered application showed that these parts only make real business sense when treated as one coherent owner-access capability.

The correction was therefore not only technical. It was structural. The plan needed to move away from fragmented authentication tasks and toward a single business-deliverable story that secures the entire admin portal. That adjustment improved clarity, sequencing, and traceability while preserving the underlying implementation detail.

The delivered application now reflects this corrected plan. Password security, owner login, owner logout, session behavior, and `/admin/*` protection work together as one capability rather than as disconnected implementation fragments.

## Problem Discovered

The problem discovered was that the original authentication work had been decomposed too narrowly.

In the earlier planning approach, these concerns existed as separate technical slices:

- password hashing utilities
- initial admin user creation
- admin login and logout
- admin route protection

Each of those pieces is valid in isolation from an engineering perspective, but the owner does not experience them independently. From the product point of view, the owner needs one thing: secure access to the admin portal.

If the documentation or implementation plan treats these pieces too separately, two risks appear:

1. The story trail becomes too granular and harder to understand.
2. The capability can appear partially complete even when the owner still does not have a full secure login boundary.

The completed application made it clear that the meaningful delivery unit is not "password hashing" by itself. The meaningful unit is "owner authentication and route protection."

## Root Cause

The root cause was that the earlier story structure optimized for technical decomposition rather than business capability.

This often happens in early implementation planning. Security work is naturally broken into utilities, models, routes, and middleware because those are the technical layers where code is written. However, once the application is delivered, the more accurate documentation model is the user-facing business outcome.

In this case, the owner does not care whether hashing utilities and login routes were delivered on separate days. What matters is whether the admin portal is protected and usable.

A second root cause was that authentication logic touches multiple layers:

- model utilities
- admin-user model logic
- session middleware
- login/logout routes
- login UI
- tests

Because the capability spans several layers, it was easy for the original planning to break it into micro-stories. The correction was to recognize that these are implementation parts of one business story rather than separate business stories.

## Decision Taken

The decision taken was to consolidate the earlier owner-authentication micro-stories into one primary business-capability story:

- Story 2.1: Implement Owner Authentication And Route Protection

The consolidated story now explicitly includes:

- secure password hashing
- password verification
- initial admin readiness
- owner login and logout
- session-backed admin access
- route protection for `/admin/*`

This decision did not remove implementation detail from the archive. Instead, it changed the primary planning and retrospective framing so that the delivered artifact set reflects what the owner portal actually needed to become operational.

The codebase itself did not require a major rewrite to support this correction, because the implementation was already layered cleanly. The correction was mainly in how the work is understood and documented.

## Updated Implementation Plan

The updated implementation plan became:

1. Keep password hashing and verification in a dedicated utility module.
2. Use the admin-user model to own account creation, lookup, and credential verification.
3. Add reusable admin route-protection middleware.
4. Implement owner login and logout routes in the admin route layer.
5. Use session-backed authenticated state for protected owner access.
6. Ensure the login route returns generic failure messages.
7. Redirect unauthenticated users away from protected admin routes.
8. Redirect already-authenticated admins away from the login page.
9. Validate the capability with automated tests for password storage, login success, login failure, route protection, and logout behavior.

This corrected implementation plan matches the delivered application exactly.

## Impact On Architecture

The impact on architecture was positive and clarifying rather than disruptive.

The correction reinforced the existing separation of concerns:

- `models/password.js` owns cryptographic password behavior
- `models/admin-user.js` owns admin credential lifecycle and verification
- `middleware/auth.js` owns route protection and redirect rules
- `routes/admin.js` owns HTTP flow for login/logout
- `views/shared/admin-login.html` owns the owner login interface

The architecture did not need to change to support the correction. In fact, the clean layering made the correction easier because the implementation was already capable of being described as one coherent story.

The main architectural impact was on documentation clarity. The system is better represented as one owner-auth capability spanning multiple layers, rather than as isolated pieces that do not independently deliver owner value.

## Impact On Future Stories

The correction improved future planning and traceability.

Impact on Story 2.2:

Owner authentication tests can now be documented as validating one consolidated auth capability rather than validating a scattered set of technical fragments.

Impact on later owner workflows:

Customer management, package purchase, delivery recording, and dashboard access now clearly depend on one prior business capability: authenticated owner access to `/admin/*`.

Impact on documentation maintainability:

Future readers can understand the purpose of Epic 2 more quickly because the primary story structure is closer to what the product actually delivers.

Impact on retrospective traceability:

The archive preserves the earlier technical decomposition, while the new primary structure makes the delivered product easier to explain without losing evidence.

## Lessons From The Adjustment

The first lesson is that security features often need dual framing: a technical decomposition for implementation and a business-capability framing for retrospective documentation.

The second lesson is that micro-stories can be useful while building, but they should not automatically remain the primary delivery structure once the product outcome is clearer.

The third lesson is that one clean capability may span many technical layers. In this case, authentication touches models, middleware, routes, views, sessions, and tests, but it is still one owner-facing story.

The fourth lesson is that strong code separation makes later documentation correction easier. Because the auth implementation was layered well, the story could be consolidated without confusion or evidence loss.

The fifth lesson is that the right unit of Phase 1 documentation is the business operation the owner can actually perform. For authentication, that unit is secure admin access, not merely password hashing by itself.

## Final Updated Plan Status

Updated plan status: Implemented / Delivered

The corrected plan was successfully delivered. Story 2.1 is now properly represented as a consolidated owner-authentication capability that includes secure credential handling, owner login/logout, session behavior, and admin route protection. The adjustment improved documentation fidelity without requiring application code changes.
