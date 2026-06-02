# UI Implementation Guidelines

Project: Barista Coffee Membership
Status: Active for future UI implementation

## Purpose

These guidelines define the visual direction for future UI work in the Barista Coffee Membership application. They apply to HTML, CSS, and client-side JavaScript implementation only.

They do not change:

- Architecture.
- Database design.
- API design.
- Authentication logic.
- Business rules.
- Delivery or package calculations.

## Visual Inspiration

Use the public Starbucks design-system analysis as loose visual inspiration for coffee-retail warmth, premium spacing, cream-toned surfaces, green accents, and rounded interactive controls.

Apply only the general design language. Do not copy Starbucks branding.

## Brand Safety Rules

Do not use:

- Starbucks logos.
- Starbucks trademarks.
- Starbucks proprietary assets.
- Starbucks product photography.
- Starbucks brand names in UI.
- Exact Starbucks visual identity or brand marks.

The application should look like an independent coffee shop operations tool, not like Starbucks.

## Desired Feel

- Coffee-shop aesthetic.
- Warm and premium.
- Calm, operational, and easy to scan.
- Trustworthy for balance and delivery tracking.
- Friendly without becoming decorative or marketing-heavy.

## Color Direction

Use a warm neutral canvas with restrained coffee-shop accents.

Recommended roles:

- Background: warm cream or off-white.
- Primary text: dark espresso or charcoal.
- Secondary text: muted taupe or warm gray.
- Primary accent: deep coffee green.
- Supporting accent: warm caramel, oat, or muted gold.
- Error: clear red used sparingly.
- Success: green used sparingly and semantically.

Avoid:

- Direct Starbucks green reproduction as a dominant brand signal.
- Overly bright promotional palettes.
- One-note brown-only palettes.
- Heavy gradients or decorative blobs.

## Layout Principles

- Mobile-first responsive design.
- Card-based dashboard layout for owner metrics and customer summaries.
- Clear page hierarchy with one primary action per workflow.
- Consistent spacing across forms, cards, tables, and history lists.
- Keep content dense enough for shop operations but not cramped.
- Use cards for discrete dashboard metrics, customer summaries, forms, and history sections.
- Do not nest cards inside cards.

## Typography

- Use clean system fonts unless a project font is explicitly added later.
- Prioritize readability over brand expression.
- Use strong but restrained headings.
- Use plain operational labels.
- Keep balance numbers visually prominent.
- Avoid oversized marketing-style hero typography inside the app.

## Component Guidance

### Dashboard Cards

- Use simple metric cards for totals such as customers, outstanding cups, recorded revenue, and recent deliveries.
- Balance-related cards should be highly scannable.
- Use consistent card padding, border radius, and border treatment.

### Buttons

- Primary actions should be visually clear.
- Use rounded buttons, but keep them practical and not brand-imitative.
- Destructive or corrective actions should have distinct treatment.
- Button text should be action-specific, such as `Record delivery`, `Add customer`, or `Record package`.

### Forms

- Use simple, clean HTML forms.
- Labels should be visible.
- Required fields should be clear.
- Error messages should appear near the relevant input.
- Submit buttons should show loading or disabled states when practical.

### Balance Display

- Current cup balance must be prominent on customer detail screens.
- Low-balance warnings should be clear when balance is `<= 5`.
- Do not hide balance information in dense tables.

### History Lists

- Delivery history should be in reverse chronological order.
- Package history should show package size, bonus cups, total cups added, and amount when relevant.
- Use readable spacing and clear date/time formatting.

## Navigation

- Keep navigation simple.
- Owner MVP should focus on:
  - Dashboard.
  - Customers.
  - Add customer.
  - Customer detail.
- Avoid customer-facing navigation until customer self-service is implemented.

## Responsive Rules

- Design for mobile first.
- Forms should fit comfortably on narrow screens.
- Dashboard cards should stack on mobile and form a compact grid on larger screens.
- Tables may become stacked list rows on mobile.
- Touch targets should be easy to tap.

## Accessibility

- Maintain good contrast.
- Do not rely on color alone to show status.
- Buttons and inputs must have clear labels.
- Keep focus states visible.
- Error text should be readable and specific.

## Implementation Notes

- Apply these guidelines through project CSS in `/public/css/styles.css`.
- Keep vanilla HTML/CSS/JavaScript.
- Do not introduce a UI framework or design dependency for these guidelines.
- Prefer reusable CSS classes for cards, buttons, forms, metrics, alerts, and page layout.

## Future UI Review Checklist

- Does the screen feel warm, premium, and coffee-shop appropriate?
- Is the current balance easy to find?
- Is the primary action obvious?
- Are spacing and card treatments consistent?
- Does the screen work on mobile?
- Is there any accidental Starbucks branding or trademark usage?
- Did the change avoid architecture, API, database, and business-logic changes?
