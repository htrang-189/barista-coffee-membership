# PRFAQ: Barista Coffee Membership

Date: 2026-06-01
Project: barista-coffee-membership

## Press Release

### Barista Coffee Membership Helps Small Coffee Shops Track Prepaid Cups Without Spreadsheets Or Paper Cards

Independent coffee shops that sell prepaid drink packages now have a simpler way to track customer balances. Barista Coffee Membership is a lightweight prepaid cup ledger for shops that sell memberships and need clear records of purchases, cup deliveries, remaining cups, and customer usage history.

The product is designed for very small membership programs, especially shops with only a handful of prepaid customers. Instead of forcing the shop into a full POS, loyalty, or rewards platform, Barista Coffee Membership focuses on one job: keeping an accurate ledger of prepaid cups.

Shop owners can create customers, record purchases with automatic VND pricing, record one or more delivered cups, void mistaken deliveries, and share a read-only QR or balance link. Customers can log in or use the shared link to check remaining cups, used cups, package history, and delivery history without seeing payment amounts or owner actions.

For shops currently relying on paper punch cards, notebooks, or spreadsheets, Barista Coffee Membership provides a clearer and more trustworthy way to manage prepaid coffee memberships while staying intentionally lean.

## FAQ

### 1. What problem does this solve?

Small coffee shops may sell prepaid memberships but track them manually with paper cards, spreadsheets, or memory. That creates risk of lost cards, unclear balances, accidental overuse, and customer uncertainty. This product gives the owner and customer a shared, simple source of truth.

### 2. Why would a shop use this instead of a spreadsheet?

A spreadsheet can track balances, but it is awkward during counter service and easy to edit incorrectly. This product gives the owner purpose-built actions: record purchase, record delivery quantity, and void a mistaken delivery. It also gives customers a read-only view, which spreadsheets do not handle cleanly without exposing too much information.

### 3. Why would a shop use this instead of paper punch cards?

Paper cards can be lost, forgotten, damaged, or punched incorrectly. They also do not give the owner reliable revenue or outstanding cup visibility. This app keeps the balance history in one place and lets customers check their status without carrying a physical card.

### 4. Why is this positioned as a prepaid cup ledger instead of a loyalty platform?

The customer has already paid for future drinks. The main need is not promotion, rewards, or gamification; it is accurate tracking of an obligation the shop needs to honor. Calling it a ledger keeps the product focused on trust, clarity, and balance accuracy.

### 5. Does the MVP include loyalty rewards?

No. Loyalty rewards, stamps, discounts, campaigns, referrals, and marketing automation are out of scope. The MVP tracks prepaid cup purchases, automatically calculated VND package totals, cup deliveries, voided delivery corrections, balances, and usage history.

### 6. How does the product help shop owners?

It helps owners see each customer's remaining cups, record package purchases and operational revenue, track outstanding cups, and void mistaken deliveries while preserving history. It reduces reliance on paper cards or informal records while staying simple enough for a very small shop.

### 7. How does the product help customers?

Customers can independently check how many cups they have remaining, how many they have used, and when deliveries happened through the customer portal or a shared read-only balance link. This improves transparency and reduces the need to ask the shop owner for balance updates.

### 8. Why does the MVP support both customer login and shared balance links?

Customer login gives each member a clear read-only account view. Shared balance links and QR codes give the owner an easy way to send the same read-only balance page without adding payment, ordering, or a separate app.

### 9. Are shared customer links secure?

They are bearer links, so anyone with the link can view that customer's read-only balance page. The MVP mitigates this by hiding payment amounts and admin actions, preventing mutations, and allowing the owner to regenerate the access token, which invalidates the old link.

### 10. Does the app process payments?

No. Payments happen outside the app. The owner records that a package purchase occurred; the app calculates the recorded VND amount automatically at `30.000 ₫` per purchased cup for simple revenue visibility.

### 11. Is recorded revenue the same as accounting revenue?

No. The MVP shows recorded package revenue from purchases entered into the app. It does not provide formal accounting, tax, deferred revenue, or liability compliance. It can show outstanding cups so the owner understands remaining drink obligations.

### 12. What happens when a mistake is made?

The owner can void/cancel a mistaken delivery. The delivered cups are restored to the customer's balance, and the delivery record remains visible as voided/cancelled instead of being deleted.

### 13. Why use transactions instead of storing only a customer balance?

Package purchase and delivery history explains how the balance was reached. It supports customer trust, correction history, usage history, and revenue reporting. A single hidden balance is simpler at first but harder to verify later.

### 14. What are the biggest MVP limitations?

The MVP has no staff accounts, no POS integration, no offline mode, no payment processing, no loyalty features, no wallet pass, and no multi-shop support. These limitations are intentional to keep the first version focused.

### 15. Who is this not for?

It is not for chains, shops needing integrated POS gift cards, businesses with complex staff permissions, or companies running advanced loyalty campaigns. It is for a single small shop that wants a clear prepaid cup tracker.

### 16. What would make the MVP successful?

The MVP is successful if the owner can stop using paper or spreadsheets for prepaid cup tracking, customers can verify their balances independently, and package/delivery history is clear enough to resolve mistakes or disputes.

## Product Principles

- Keep the product ledger-first.
- Optimize for speed at the counter.
- Make customer balances transparent.
- Prefer clear history over hidden mutable balances.
- Avoid loyalty, POS, payment, ordering, and multi-shop complexity in MVP.

## Recommended Next Step

Use this PRFAQ and the approved Product Brief as inputs for the PRD.
