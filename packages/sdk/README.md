# @cts-talent/sdk

TypeScript SDK for auth, HTTP, config, read clients and session-only mutations.

## Entries

- `@cts-talent/sdk` — Node-safe core (no React Native imports)
- `@cts-talent/sdk/react-native` — SecureStore / LocalAuthentication adapters

## Mutations

Write interfaces match [`dummy-backend/write-contracts.md`](../../dummy-backend/write-contracts.md) and are implemented by `SessionMutationRepository` (in-memory). Swap to an HTTP write client later without changing app call sites. See [design evaluation](../../docs/design-and-security-evaluation.md) for lab vs trusted-transport guidance.

## Security notes

- Access tokens stay in memory; refresh markers use secure storage
- Runtime config cannot disable pinning or carry secrets
- Local HTTP uses `InsecureDevTransport` for the lab only

Coverage gate: 100% statements/branches/functions/lines.
