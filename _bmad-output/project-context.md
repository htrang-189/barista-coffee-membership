---
project_name: 'barista-coffee-membership'
user_name: 'TrangN'
date: '2026-06-01'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'code_quality_rules', 'workflow_rules', 'critical_rules']
existing_patterns_found: 0
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

**Core Technologies:**
- Frontend: HTML, CSS, JavaScript (vanilla - no frameworks)
- Backend: Node.js v22.x with Express.js v4.x
- Database: SQLite3 (file-based database)
- Development: Kiro IDE (AI-powered development environment)

**Key Dependencies:**
- express v4.x (web server framework)
- sqlite3 (database driver)
- bcrypt (password hashing for security)
- express-session (user session management)

**Deployment Target:**
- **Primary Option:** Railway or Render (full-stack Node.js hosting)
- **Alternative:** Heroku (classic full-stack hosting)
- **Hybrid Option:** Netlify (frontend) + Railway (backend API)
- Single server deployment (no microservices)
- SQLite database with automatic backups

**User-Friendly Design Principle:**
- Single language (JavaScript) for all components
- Minimal dependencies to reduce complexity
- File-based database (no server setup required)
- Clear, readable code structure for maintainability

## Critical Implementation Rules

### Language-Specific Rules (JavaScript/Node.js)

**Code Simplicity Requirements:**
- Use clear, descriptive variable names (e.g., `customerBalance` not `cb`)
- Avoid complex JavaScript features (no arrow functions in complex scenarios)
- Use traditional function declarations for main functions
- Always use `const` and `let`, never `var`
- Include comments explaining business logic

**Error Handling Patterns:**
- Always use try-catch blocks for database operations
- Return meaningful error messages for business scenarios
- Log errors with context for debugging
- Never let the app crash - always handle errors gracefully

**Database Interaction Rules:**
- Use prepared statements to prevent SQL injection
- Always validate input data before database operations
- Include clear error messages for constraint violations
- Use transactions for multi-step operations (like recording delivery + updating balance)

**Session Management:**
- Always check if user is logged in before protected operations
- Use secure session configuration
- Clear sessions on logout
- Implement proper role-based access (admin vs customer)

### Framework-Specific Rules (Express.js & Frontend)

**Express.js Server Rules:**
- Separate routes by function: `/admin/*` for admin operations, `/customer/*` for customer operations
- Use middleware for authentication checks before protected routes
- Always validate request data before processing
- Return consistent JSON response format: `{success: true/false, data: {...}, message: "..."}`

**Middleware Patterns:**
- Authentication middleware: Check session before admin/customer routes
- Input validation middleware: Validate all form data
- Error handling middleware: Catch and format all errors consistently
- Logging middleware: Log all admin actions for audit trail

**Frontend (HTML/CSS/JavaScript) Rules:**
- Separate admin and customer interfaces completely
- Use simple, clean HTML forms for all data entry
- Include client-side validation with clear error messages
- Make all buttons and actions clearly labeled for users
- Follow `docs/UI-IMPLEMENTATION-GUIDELINES.md` for future UI work
- Use a warm, premium coffee-shop visual language with card-based dashboards, clean typography, clear balance displays, consistent spacing, and mobile-first responsive layouts
- Use Starbucks public design-system analysis only as loose inspiration for coffee-retail warmth; do not copy Starbucks logos, trademarks, proprietary assets, exact branding, or brand names

**Coffee Business Logic:**
- Always display current cup balance prominently
- Show bonus cups calculation clearly (10→11, 20→22, 30→33)
- Calculate package price automatically at `30.000 ₫` per purchased cup
- Prevent negative balances with clear warnings
- Support positive integer multi-cup delivery quantities
- Support voiding mistaken deliveries with balance restoration and retained history records
- Display delivery history in reverse chronological order
- Show compact history previews with 5 recent records and `View All` full-history pages

**Security Rules:**
- Never expose admin functions to customer interface
- Shared balance links are bearer-token read-only views; never expose payment amounts or admin actions on them
- Always validate user permissions server-side
- Use HTTPS for all authentication pages
- Implement CSRF protection for forms

### Testing Rules

**Testing Strategy for User-Managed Projects:**
- Test all coffee business logic scenarios (10→11, 20→22, 30→33 bonus cups)
- Verify balance calculations after each delivery recording
- Test both admin and customer login flows
- Ensure customers cannot access admin functions

**Automated Testing Requirements:**
- Write simple unit tests for cup balance calculations
- Test database operations (add customer, record delivery, update balance)
- Test authentication and authorization logic
- Include tests for edge cases (zero balance, invalid login)

**Business Logic Testing:**
- Test bonus cup calculations: `if (packageSize === 10) totalCups = 11`
- Test fixed VND pricing: amount paid is calculated as purchased cups × `30.000 ₫`
- Test delivery recording: balance decreases by delivered cup quantity, delivery record created
- Test delivery voiding: cups are restored, record is marked voided, and double-void is blocked
- Test low balance warnings: show warning when balance ≤ 5
- Test duplicate customer prevention

**Error Scenario Testing:**
- Test delivery recording when balance is 0 (should prevent and show warning)
- Test delivery quantity greater than balance (should prevent and show warning)
- Test invalid login attempts (should show error message)
- Test database connection failures (should show user-friendly error)
- Test form validation (empty fields, invalid data)

**Testing File Organization:**
- Keep tests in `/tests` folder with clear names
- Name test files after the feature: `customer-balance.test.js`
- Include setup and teardown for database tests
- Use descriptive test names that explain business scenarios

### Code Quality & Style Rules

**File Organization:**
- `/routes` - Express.js route handlers (admin.js, customer.js, auth.js)
- `/models` - Database models and business logic
- `/public` - Static files (CSS, client-side JavaScript, images)
- `/views` - HTML templates (admin/, customer/, shared/)
- `/middleware` - Authentication and validation middleware
- `/tests` - All test files organized by feature

**Naming Conventions:**
- Files: kebab-case (`customer-balance.js`)
- Functions: camelCase (`calculateBonusCups()`)
- Variables: camelCase (`customerBalance`)
- Constants: UPPER_SNAKE_CASE (`MAX_DAILY_DELIVERIES`)
- Database tables: snake_case (`customer_accounts`, `delivery_history`)

**Code Documentation:**
- Comment all business logic functions
- Include JSDoc for public functions
- Document coffee-specific calculations clearly
- Add TODO comments for future enhancements

**Linting and Formatting:**
- Use ESLint with standard configuration
- Use Prettier for consistent code formatting
- No trailing whitespace or unused variables
- Consistent indentation (2 spaces)

### Development Workflow Rules

**Git Workflow:**
- Use feature branches for all changes (`feature/customer-login`)
- Commit messages: `feat: add customer balance display` or `fix: prevent negative balance`
- Never commit directly to main branch
- Include tests with all new features

**Database Management:**
- Keep database schema in `/database/schema.sql`
- Use migration scripts for schema changes
- Always backup database before major changes
- Include sample data for testing (`/database/sample-data.sql`)

**Environment Configuration:**
- Use `.env` file for configuration (never commit to git)
- Include `.env.example` with required variables
- Separate development and production configurations
- Document all environment variables

**Deployment Rules:**
- **Primary:** Use Railway or Render for full-stack deployment
- **Database:** SQLite with automated daily backups
- **Environment:** Use environment variables for configuration
- **SSL:** Ensure HTTPS for all customer-facing pages
- **Monitoring:** Set up uptime monitoring and error tracking
- Test locally before deploying
- Use environment variables for database paths and secrets
- Include startup scripts (`npm start`)
- Document deployment process in README

### Critical Don't-Miss Rules

**Security Anti-Patterns to Avoid:**
- Never store passwords in plain text (always use bcrypt)
- Never trust client-side validation alone
- Never expose database errors to users
- Never allow SQL injection (use prepared statements)
- Never skip authentication checks on protected routes

**Coffee Business Logic Edge Cases:**
- Prevent delivery recording when customer balance is 0
- Prevent delivery quantity greater than current balance
- Prevent voiding the same delivery twice
- Handle concurrent delivery recordings (use database transactions)
- Validate coffee package sizes (only allow 10, 20, 30)
- Ensure bonus cup calculations are always correct
- Prevent duplicate customer account creation

**Database Integrity Rules:**
- Always use transactions for multi-step operations
- Validate foreign key relationships
- Handle database connection failures gracefully
- Implement proper error logging for debugging
- Regular database backups (automated daily)

**Performance Considerations:**
- Index frequently queried columns (customer_id, delivery_date)
- Limit query results for large datasets
- Cache session data appropriately
- Optimize database queries for reporting features
- Monitor application performance in production

**User Experience Rules:**
- Always provide clear feedback for user actions
- Show loading states for database operations
- Display meaningful error messages (not technical errors)
- Ensure responsive design for different screen sizes
- Include confirmation dialogs for destructive actions (delete customer)
