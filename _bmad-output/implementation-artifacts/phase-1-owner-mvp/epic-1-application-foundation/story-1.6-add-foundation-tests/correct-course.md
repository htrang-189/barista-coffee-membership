# Story 1.6: Add Foundation Tests

Output type: Updated Plan

Status: Complete / Delivered

## Problem Discovered

The package bonus rule changed during implementation, especially the 30-cup package now crediting 33 cups.

## Root Cause

Business policy was clarified after early assumptions.

## Decision Taken

Keep foundation tests focused on the central package credit function and update expected values to the delivered package policy.

## Updated Implementation Plan

Use direct pure-function tests for `calculatePackageCredits`, cover all supported package sizes, and assert invalid package rejection.

## Impact On Architecture

No architecture change. Tests remain in `tests/` and run with `node --test`.

## Impact On Future Stories

Later package purchase, dashboard, and customer history stories inherit tested credit behavior.

## Lessons From The Adjustment

Business rules that affect balances should receive early direct tests. Pure functions make policy changes safer.

## Final Updated Plan Status

Updated plan status: Implemented / Delivered
