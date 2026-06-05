# Story P1-2: Owner Authentication And Route Protection

Status: Implemented
Phase: Phase 1 Owner/Admin Portal

## Objective

Allow the owner to log in/out and protect all admin routes.

## Requirements

- Admin login validates credentials.
- Logout clears session.
- Passwords are bcrypt hashed.
- `/admin/*` requires role `admin`.
- Customer sessions cannot access admin routes.

## Scope

Included: admin auth model, password helper, session role checks, admin login view.

Excluded: customer login and shared token access.

## Files Created/Modified

- `models/admin-user.js`
- `models/password.js`
- `middleware/auth.js`
- `routes/admin.js`
- `views/shared/admin-login.html`
- `tests/admin-auth.test.js`

## Routes/Models/Views Involved

- `GET /admin/login`
- `POST /admin/login`
- `POST /admin/logout`
- `middleware/auth.js`

## Testing Evidence

- Admin password hash test.
- Login success/failure tests.
- Logout test.
- Unauthenticated admin route redirect test.

## Delivered Output

Protected owner portal.

## Notes/Concerns

Session cookies use MVP settings and should be reviewed before production deployment.
