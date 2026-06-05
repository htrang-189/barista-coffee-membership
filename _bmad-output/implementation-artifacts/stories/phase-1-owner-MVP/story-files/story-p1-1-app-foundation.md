# Story P1-1: App Foundation

Status: Implemented
Phase: Phase 1 Owner/Admin Portal

## Objective

Create the local runnable Express/SQLite foundation for the delivered membership app.

## Requirements

- Express server starts locally.
- SQLite schema/setup exists.
- Static assets, views, routes, middleware, and models are organized.
- Tests run with `npm test`.

## Scope

Included: app scaffold, config, database helper, migrations, schema, static assets, test runner.

Excluded: customer-facing workflows and package/delivery business behavior.

## Files Created/Modified

- `server.js`
- `config.js`
- `database/schema.sql`
- `database/setup.js`
- `database/database.js`
- `database/migrations.js`
- `public/css/styles.css`
- `public/js/admin.js`
- `package.json`

## Routes/Models/Views Involved

- Root redirect.
- Shared 404/error views.
- Static asset serving.

## Testing Evidence

- `npm test` passes.
- Foundation is exercised by all route tests.

## Delivered Output

Runnable single Express app with SQLite persistence.

## Notes/Concerns

Retrospective artifact generated after implementation.
