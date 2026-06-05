```yaml
sprint_status:
  phase: "Phase 1: Owner MVP"
  epic: "Epic 1: Application Foundation"
  story:
    id: "Story 1.2"
    title: "Add Environment Configuration"
  output_type: "sprint-status.yaml"
  timing: "Immediately before development"
  status: "planned"
  sprint_goal: >
    Establish a centralized environment configuration layer so the Express and
    SQLite Owner MVP can run locally, use predictable runtime settings, and
    support later authentication, database setup, and testing workflows without
    hardcoded environment values.
  story_scope:
    in_scope:
      - "Create a central configuration module."
      - "Load environment variables with dotenv."
      - "Configure runtime environment."
      - "Configure server host and port."
      - "Configure SQLite database path."
      - "Configure session secret."
      - "Configure bcrypt rounds for later password hashing utilities."
      - "Wire configuration into server startup."
      - "Wire configuration into database setup and database helper code."
      - "Preserve local development defaults."
    out_of_scope:
      - "Admin login and logout implementation."
      - "Customer login implementation."
      - "Package purchase business logic."
      - "Delivery recording business logic."
      - "Dashboard metrics."
      - "Customer portal UI."
      - "QR/shared balance link behavior."
      - "Production deployment automation."
      - "Changing database schema for business records."
  deliverables:
    - "Root-level config.js module."
    - "Environment-variable loading through dotenv."
    - "Local defaults for host, port, database path, session secret, and bcrypt rounds."
    - "Server startup using configured host and port."
    - "Session middleware using configured session secret."
    - "Database setup using configured SQLite path."
    - "Database helper using configured SQLite path by default."
  risks:
    - id: "R1"
      description: "Runtime values remain hardcoded in multiple files."
      mitigation: "Centralize values in config.js and import that module where needed."
    - id: "R2"
      description: "Development defaults are mistaken for production-safe settings."
      mitigation: "Keep SESSION_SECRET overrideable and document that default values are local-development only."
    - id: "R3"
      description: "Database setup and runtime app use different SQLite database paths."
      mitigation: "Use config.databasePath consistently in setup and database helper modules."
    - id: "R4"
      description: "Configuration becomes mixed with business rules."
      mitigation: "Keep package pricing, bonus rules, delivery rules, and dashboard logic in model modules."
    - id: "R5"
      description: "Local startup becomes dependent on a complete .env file."
      mitigation: "Provide sensible local defaults while allowing environment overrides."
  dependencies:
    upstream:
      - "Story 1.1: Express and SQLite Application Foundation"
      - "Decision to use a single Express app"
      - "Decision to use SQLite for MVP persistence"
      - "dotenv dependency availability"
    downstream:
      - "Owner authentication"
      - "Password hashing utilities"
      - "SQLite database setup"
      - "Database connection helper"
      - "Automated route and workflow tests"
      - "Future customer authentication"
  planned_files:
    create:
      - "config.js"
    modify:
      - "server.js"
      - "database/setup.js"
      - "database/database.js"
      - "package.json"
      - "package-lock.json"
    no_change_expected:
      - "routes/admin.js"
      - "routes/customer.js"
      - "views/*"
      - "public/*"
      - "database/schema.sql"
  planned_routes:
    create: []
    modify: []
    affected_indirectly:
      - "GET /"
      - "/admin/*"
      - "/customer/*"
    notes: >
      No route behavior should be introduced by this story. Existing and future
      routes benefit indirectly because server startup and sessions use the
      centralized configuration.
  planned_database_changes:
    schema_changes: []
    data_migrations: []
    configuration_changes:
      - "Add configurable SQLite database path."
      - "Ensure setup and runtime database access use the same configured path."
    notes: "No business tables or records should change as part of this story."
  planned_tests:
    manual:
      - "Run npm run dev and confirm the app starts with default host and port."
      - "Run npm run db:setup and confirm database setup uses configured database path."
      - "Confirm app can start without a required production .env file."
    automated:
      - "Confirm npm test remains available."
      - "Add or rely on foundation tests that instantiate the app through createApp."
      - "Later route tests should indirectly validate configuration wiring."
  completion_criteria:
    - "config.js exists and exports required runtime values."
    - "server.js imports and uses config.js."
    - "database/setup.js imports and uses config.js."
    - "database/database.js imports and uses config.js."
    - "Local defaults support development startup."
    - "Environment variables can override defaults."
    - "No business logic is moved into configuration."
```

# Sprint Planning Explanation

## Sprint Goal

The sprint goal for Story 1.2 was to add a reliable environment configuration layer to the application foundation before owner-facing business workflows were built. This goal supports the Owner MVP by making the app easier to run locally, easier to test, and safer to adapt to future environments.

The owner does not interact directly with environment configuration, but the owner depends on it. If the app starts on an unexpected host or port, points to the wrong database file, or uses scattered session settings, the owner workflow becomes unreliable. A prepaid cup ledger depends on trust, and trust begins with predictable runtime behavior.

## Story Scope

The planned scope was intentionally narrow. The story was not meant to implement admin login, customer records, package purchases, deliveries, or dashboard metrics. It was meant to provide the runtime settings those later stories would need.

The central implementation unit was `config.js`. This file would load environment variables through `dotenv`, provide local defaults, and export a single configuration object. The planned values were runtime environment, host, port, SQLite database path, session secret, and bcrypt rounds.

This scope was appropriate because configuration is a cross-cutting concern. If each later story parsed `process.env` independently, the codebase would become harder to maintain. Centralizing configuration early reduced that risk.

## Deliverables

The primary deliverable was a root-level `config.js` file. This file would become the source of truth for runtime settings.

The secondary deliverables were integrations. `server.js` needed to consume configuration for host, port, runtime environment, and session secret. `database/setup.js` needed to consume the configured database path. `database/database.js` needed to use the configured database path when a path was not passed explicitly.

These deliverables mattered because the environment configuration story only creates value when the rest of the foundation actually uses it.

## Risks

The main implementation risk was configuration drift. If settings remained hardcoded after `config.js` was introduced, the story would only partially solve the problem. The sprint plan therefore required wiring configuration into server and database files.

Another risk was unsafe assumptions around the session secret. A development default is useful for local runnability, but it should not be treated as production-safe. The mitigation was to make `SESSION_SECRET` overrideable and keep the default clearly limited to development use.

A third risk was database path mismatch. If setup initialized one SQLite file while runtime opened another, the app would behave as if data had disappeared. The mitigation was to use `config.databasePath` consistently in setup and runtime access.

## Dependencies

Story 1.2 depended on the Express and SQLite foundation from Story 1.1. The app needed a server and database direction before environment configuration could be meaningful.

It also depended on the decision to use SQLite for MVP persistence. SQLite makes the database path an important configuration value because the database is file-backed.

Downstream, the story unblocked cleaner implementation of owner authentication, password hashing, database setup, route testing, and later customer authentication. This made it a high-leverage foundation story despite having no visible UI.

## Planned Files

The only planned created file was `config.js`.

The planned modified files were `server.js`, `database/setup.js`, `database/database.js`, `package.json`, and `package-lock.json`. These changes were expected because the server and database foundation needed to consume the new configuration, and `dotenv` needed to be available as a dependency.

No view files, route files, or database schema files were expected to change for this story. That boundary helped keep the story focused.

## Planned Routes

No route creation or route behavior change was planned. This story affects routes only indirectly by configuring the server that hosts them and the session middleware that later protects them.

The route surface expected to benefit from configuration was the existing single-app structure: root navigation, `/admin/*`, and later `/customer/*`.

## Planned Database Changes

No schema change was planned. No business data migration was planned.

The only database-related change was configuration of the SQLite database path. This matters because setup and runtime must point to the same database file. For a ledger product, writing to the wrong database path would create serious confusion for owner workflows.

## Planned Tests

The planned validation was mostly foundation-level. The app should start with `npm run dev`, the database setup should run with `npm run db:setup`, and automated tests should remain available through `npm test`.

Later tests would indirectly validate this story by exercising server startup, sessions, database setup, route behavior, authentication, and data workflows. The delivered web app now confirms that this plan was sufficient because the full test suite runs on top of the centralized configuration layer.

## Sprint Completion Criteria

The story would be complete when `config.js` existed, exported the required values, and was used by server and database foundation code. It would also be complete only if configuration remained focused on runtime settings and did not absorb business rules such as package pricing, bonus credits, or delivery behavior.
