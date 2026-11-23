# Hosted runtime configuration and trusted bootstrap

The app reads an external config.json over HTTPS through a native pinned transport. Operational settings may change without a binary release when they are within the already-shipped feature/schema/security boundaries. Remote configuration does not install native code or implement new screens.

## Bootstrap trust boundary

Bundle a small trusted bootstrap with the application: config URL, permitted hosts, current and backup SPKI pin sets, environment, schema versions, identity issuer/client/redirect registration and hard minimum safety defaults. Fetching pins from the untrusted first configuration response would be circular; establish trust before fetching config.

Validate normal TLS certificates and hostnames in addition to public-key pinning. No accept-all certificate handler and no remote flag to disable pinning. Test actual iOS/Android networking paths; a pinned API transport does not automatically pin an external browser or unrelated image loader. Limit the pinning requirement to traffic the native app controls and document each path.

## Runtime settings and limits

| Remotely configurable without redeployment | Bundled/reviewed or requires release |
| --- | --- |
| Display copy, support links constrained to allowed hosts | New native libraries, screens or executable JavaScript |
| Enable/disable implemented optional features | Authorization policies that grant additional access |
| File limits within compiled maxima | Removing validation/security checks or increasing limits beyond compiled safety maxima |
| Search pagination, timeout within bounded range | Arbitrary API origin/issuer/redirect URI changes |
| Approved theme values with contrast validation | Replacing trust anchors/pins from an untrusted source |
| Preapproved API path/version selection | Native capabilities/entitlements or package upgrades |

Application roles still come from verified auth/backend state, never config. Client feature flags can restrict presentation but cannot grant backend privileges. Configuration contains no passwords, tokens, private keys or confidential client secrets. A public native clientId is not a secret.

## Loading algorithm

1. Register the app and render launch/loading. Instantiate trusted transport, ConfigManager and AuthManager once.
2. Fetch from the bundled HTTPS config URL with pinned transport, timeout and cancellation. Do not use unpinned fetch as a fallback.
3. Enforce response-size limit, parse JSON, validate schema/version/types, issuedAt/expiresAt and minimum app build, then validate ranges and host allowlists. Reject unknown security-sensitive inputs; optional unknown presentation fields may be ignored under an explicit version rule.
4. Reject revisions older than the accepted last-known-good revision for this environment. Do not silently apply rollback. Publish a higher revision to restore older content intentionally. Device-clock anomalies require an explicit safe fallback/error policy.
5. Persist only validated non-secret last-known-good config and revision metadata. If remote fails, an unexpired compatible cached config may be used; otherwise show blocking Retry. Do not silently continue with expired config when it controls a safety-critical feature.
6. Apply a validated immutable snapshot atomically. Load once per launch and optionally refresh on foreground with a bounded TTL. Do not switch auth providers/endpoints midway through a transaction. Defer affected settings to the next safe boundary or next session.
7. Signal readiness to the app; inspect/restore auth, fetch profile and choose routes. Authentication may use compiled safe values, but the app does not enable workflows until configuration passes its gate.

## Example

[Example runtime JSON](runtime-config.example.json) is illustrative; example.com is a placeholder and no host is provisioned. It must not be used as a working pin configuration. Pins belong to native bootstrap, not this public runtime file.

## Rotation and failure cases

Ship overlapping current/backup public-key pins and plan rotation before certificate expiry. Introducing an unknown pin may require a binary release; remote operational settings do not eliminate that obligation. A future signed pinset-update protocol needs its own independently bundled verification key and review, and is outside this initial scope.

Test valid config; hostname/TLS/pin failure; timeout/offline; malformed JSON; wrong schema; out-of-range limit; expired cache; lower revision; wrong minimum build; unapproved host; forced refresh during a save; and missing/invalid native pin setup. Use real development/release-style device builds for pin enforcement, not the HTML prototype.

## Source and implementation ownership

SDK: ConfigManager, validation and pinned transport contracts/adapters. App: trusted bootstrap selection, launch/error UX, accepted feature flags and safe application points. UI: supplied labels/theme and loading/error components. See [repository mapping](06-repositories-and-workstreams.md).

Primary reference: [React Native security](https://reactnative.dev/docs/security). Selected native transport and pinning library versions must be verified during implementation; no library/version is selected by this document.
