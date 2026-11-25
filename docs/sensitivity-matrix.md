# Sensitivity Matrix

## Memory only

- Access tokens (AuthManager in-process session)
- Onboarding drafts
- Session mutation queue / `SessionMutationRepository` domain writes
- Approvals inbox edits
- Unsaved profile, skill, CV, and assignment edits
- UI-only state such as drawer visibility and role-tab selection

## Secure storage (OS-backed)

- Refresh token marker used for biometric restore (`cts-talent.refresh-token`)
- Never use AsyncStorage for secrets

## Never persisted

- Passwords
- SSO credentials typed into the simulated portal
- API secrets / private keys
- A remote switch that disables certificate pinning
- Dummy-backend seed DBs (read-only; never written by the app)

## Purge on logout / account switch

- Clear secure refresh marker
- Clear in-memory session + mutation repository + offline queue
- Release temporary file references
- Return to login; do not wipe unrelated app storage

## Transport trust

- Local lab: HTTP via `InsecureDevTransport` (explicitly not production TLS)
- Target: native pinned HTTPS on development/release builds; Expo Go is insufficient

