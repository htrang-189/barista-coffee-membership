# Research Findings: Barista Coffee Membership

Date: 2026-06-01
Project: barista-coffee-membership

## Research Goal

Validate the lean MVP direction for a very small coffee shop membership app where customers prepay for 20 cups and both the owner and customer need a clear balance and usage history.

## Sources Reviewed

- Toast gift card product and support materials: https://pos.toasttab.com/products/gift-card/ and https://support.toasttab.com/en/article/Gift-Card-FAQ-1492723819694
- Square Loyalty and gift-card responsibility materials: https://squareup.com/us/en/software/loyalty and https://squareup.com/us/en/legal/general/pos-annotated
- Digital punch card and coffee loyalty examples: https://baristacard.com/, https://perkpad.io/, https://www.stampme.com/cafes-and-restaurants-old
- Gift card liability/accounting references: https://www.bookkeep.com/docs/apps/square/accurate-gift-card-liability-reporting-with-square, https://quickbooks.intuit.com/ca/resources/accountants/gift-card-accounting/, https://www.double-entry-bookkeeping.com/deferred-revenue/accounting-for-gift-cards/
- Customer balance lookup patterns from gift-card systems and passwordless customer portal patterns.

## Market Pattern

Most comparable tools are not narrow prepaid cup trackers. They are broader systems in one of these categories:

- POS-integrated gift cards.
- Digital loyalty or punch cards.
- Wallet-based customer cards.
- Marketing and retention platforms.

These systems often emphasize repeat visits, QR scanning, Apple/Google Wallet, POS integrations, rewards, marketing, and multi-location use. That is useful context, but too broad for this MVP.

## Relevant Product Lessons

### 1. Customer Balance Visibility Is Expected

Toast advertises customer-accessible gift card balance management, and gift-card systems commonly provide ways for customers to check remaining balances. This supports the decision to include a customer view in the MVP.

MVP implication: the customer view should be included from the start, even if it is simple.

### 2. Manual Lookup Still Matters

POS gift-card workflows often support scanning but also allow manual entry or lookup. Since this MVP excludes QR codes, manual customer lookup by name or phone is acceptable for the owner view.

MVP implication: owner lookup should be fast and forgiving, but does not need QR or wallet support.

### 3. A Ledger Is Better Than Separate Hidden Counters

Gift card and stored-value systems rely on transaction histories and balance reporting. For this product, a transaction ledger is the simplest way to support purchases, redemptions, corrections, and customer-visible history.

MVP implication: model balance from transactions instead of mutating a standalone balance without history.

### 4. Corrections Need Audit Notes

Small shops will make occasional entry mistakes. A manual adjustment transaction with a required note is simpler and more transparent than allowing silent edits or deletes.

MVP implication: support `adjustment` transactions in MVP.

### 5. Accounting Language Should Be Practical, Not Overbuilt

Gift card accounting sources consistently treat prepaid balances as future obligations or deferred revenue/liability until redeemed. For a tiny shop, the app does not need formal accounting automation, but the reporting should avoid hiding outstanding cup obligations.

MVP implication: show:

- Total recorded package sales.
- Total cups sold.
- Total cups redeemed.
- Total outstanding cups.

Avoid claiming full accounting compliance in MVP.

### 6. Existing Loyalty Tools Are Too Broad For This Use Case

Digital punch-card products focus on earning stamps toward rewards. This app is different: customers have already paid, and the shop owes future drinks. That makes accuracy and trust more important than promotion or gamification.

MVP implication: do not frame the product as loyalty software. Frame it as prepaid membership tracking.

## Recommended MVP Positioning

Barista Coffee Membership is a tiny prepaid cup ledger for independent coffee shops that sell simple drink packages.

It should be optimized for:

- Owner trust.
- Customer balance transparency.
- Fast cup redemption.
- Simple revenue visibility.
- Easy correction of mistakes.

It should not compete directly with full POS, gift-card, or loyalty systems.

## Suggested MVP Access Pattern

For the customer view, use a private customer link rather than full customer accounts.

Recommended approach:

- Each customer has a private, hard-to-guess view URL.
- The owner can share the link manually.
- The customer page is read-only.
- No password, no staff accounts, no customer account setup.

This matches the lean scope better than login, OTP, QR codes, or wallet passes.

Risk: anyone with the link can view that customer's balance and history.

Mitigation for MVP:

- Do not show sensitive payment details.
- Show only first name or display name if desired.
- Allow the owner to regenerate the private link.

## Recommended Transaction Types

Use one `transactions` table or collection with:

- `purchase`: cup delta `+20`, amount recorded, note optional.
- `redemption`: cup delta `-1`, amount `0`, note optional.
- `adjustment`: positive or negative cup delta, amount `0`, note required.

Derived metrics:

```text
remaining_cups = sum(cup_delta)
used_cups = abs(sum(cup_delta where type = redemption))
recorded_revenue = sum(amount where type = purchase)
outstanding_cups = sum(cup_delta)
```

## Product Risks

- A public customer link may be shared accidentally.
- Duplicate customer records could split balances.
- Owner may expect accounting-grade reporting from simple revenue totals.
- Without staff accounts, all edits are effectively attributed to the shop owner/system.
- If package price changes later, historical purchase amounts must remain transaction-specific.

## Research Conclusion

The brainstormed MVP is appropriately lean. The strongest research-backed adjustment is to treat the product as a transparent stored-cup ledger, not as loyalty software. The transaction-based model is a good fit because it keeps the implementation simple while supporting usage history, customer trust, revenue visibility, and corrections.

## Recommended Next Step

Review and confirm these research findings. After approval, create the Product Brief using this positioning:

> A tiny prepaid cup ledger for independent coffee shops, with owner-managed transactions and read-only customer balance views.
