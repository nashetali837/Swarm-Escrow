# Security Specification: SwarmEscrow™

## 1. Data Invariants
- A transaction must have a valid non-empty ID.
- Status is restricted to `locked`, `released`, or `disputed`.
- Fraud score and Trust consensus must be between 0 and 1.
- Agent logs must be linked to an existing transaction ID.

## 2. Dirty Dozen Payloads (Targeting Rejection)
1. **Malicious ID**: `{ "id": "../system/hack" }` -> Fails `isValidId()`
2. **Negative Amount**: `{ "amount": -100 }` -> Fails range validation
3. **Invalid Status**: `{ "status": "stolen" }` -> Fails enum check
4. **Huge Message**: `{ "message": "A".repeat(1000000) }` -> Fails size limit
5. **Score Poisoning**: `{ "fraudScore": 1.5 }` -> Fails probability range
6. **Shadow Update**: `{ "updatedAt": request.time, "isAdmin": true }` -> Fails `affectedKeys()`
7. **Identity Spoofing**: `{ "buyer": "attacker_id" }` in a transaction not belonging to them.
8. **Recursive Cost Attack**: Deeply nested objects in a Flat collection.
9. **Timestamp Manipulation**: Providing a client-side `createdAt` in the future.
10. **Orphan Log**: Creating a log for a transaction that doesn't exist.
11. **Status Shortcut**: Moving from `locked` to `released` without proper trust score > 0.9. (Logic implementation dependent)
12. **Member Bypass**: Reading transactions without being a participant (buyer/seller).

## 3. Test Runner (Draft)
A `firestore.rules.test.ts` would verify these payloads return `PERMISSION_DENIED`.
