# SDK: feature-by-feature

Status: implementation work for humans. The repository currently contains documentation, fixtures and the supporting API/prototype, not these native workspaces. Do not interpret estimates or story descriptions as evidence of completion.

Read [learning solution design](../solution-design/10-human-learning-implementation-plan.md) first and use the [backlog map](README.md) to find prerequisites. All stories are required unless an explicitly described platform limitation is recorded. Each day below is six focused hours for a developer familiar with the tools; learner elapsed time is discussed in the backlog map.

## Stories

| ID | Outcome | Focused person-days | Prerequisites |
| --- | --- | --- | --- |
| [SDK-01](#sdk-01) | Model domain data and validate API responses | 1–2 | [FND-08](00-foundations-and-tooling.md#fnd-08) |
| [SDK-02](#sdk-02) | Implement the injectable HTTP client | 1–2 | [SDK-01](02-sdk-features.md#sdk-01) |
| [SDK-03](#sdk-03) | Add approved-origin token injection and bounded authentication retry | 1–1.5 | [SDK-02](02-sdk-features.md#sdk-02), [SDK-08](02-sdk-features.md#sdk-08) |
| [SDK-04](#sdk-04) | Implement namespaced secure credential storage | 1–2 | [SDK-01](02-sdk-features.md#sdk-01), [FND-04](00-foundations-and-tooling.md#fnd-04) |
| [SDK-05](#sdk-05) | Implement biometric capability and gated unlock adapters | 1–2 | [SDK-04](02-sdk-features.md#sdk-04) |
| [SDK-06](#sdk-06) | Implement abstract auth strategy and credentials class | 1–2 | [SDK-01](02-sdk-features.md#sdk-01), [SDK-02](02-sdk-features.md#sdk-02) |
| [SDK-07](#sdk-07) | Implement company SSO strategy with demo/native interaction ports | 1.5–2.5 | [SDK-06](02-sdk-features.md#sdk-06), [SDK-11](02-sdk-features.md#sdk-11) |
| [SDK-08](#sdk-08) | Implement AuthManager authenticate and session restoration | 1.5–2.5 | [SDK-04](02-sdk-features.md#sdk-04), [SDK-05](02-sdk-features.md#sdk-05), [SDK-06](02-sdk-features.md#sdk-06) |
| [SDK-09](#sdk-09) | Implement refresh coordination and stale-session race protection | 1–2 | [SDK-08](02-sdk-features.md#sdk-08) |
| [SDK-10](#sdk-10) | Implement complete logout and protected-work cancellation | 1–1.5 | [SDK-08](02-sdk-features.md#sdk-08), [SDK-09](02-sdk-features.md#sdk-09) |
| [SDK-11](#sdk-11) | Define reusable navigation and auth interaction ports | 0.5–1 | [SDK-01](02-sdk-features.md#sdk-01) |
| [SDK-12](#sdk-12) | Implement identity and associate read clients | 0.5–1 | [SDK-01](02-sdk-features.md#sdk-01), [SDK-02](02-sdk-features.md#sdk-02) |
| [SDK-13](#sdk-13) | Implement skill catalogue and approval read clients | 0.5–1 | [SDK-12](02-sdk-features.md#sdk-12) |
| [SDK-14](#sdk-14) | Implement learning, team and administration read clients | 0.5–1 | [SDK-12](02-sdk-features.md#sdk-12) |
| [SDK-15](#sdk-15) | Implement session-only domain mutation repositories | 2–3.5 | [SDK-12](02-sdk-features.md#sdk-12), [SDK-13](02-sdk-features.md#sdk-13), [SDK-14](02-sdk-features.md#sdk-14), [SDK-16](02-sdk-features.md#sdk-16) |
| [SDK-16](#sdk-16) | Implement file lifecycle, bounded validation and safe encoding utilities | 1–2 | [SDK-01](02-sdk-features.md#sdk-01), [SDK-04](02-sdk-features.md#sdk-04) |
| [SDK-17](#sdk-17) | Implement native HTTPS/public-key pinning transport | 1.5–3 | [SDK-02](02-sdk-features.md#sdk-02), [APP-02](03-expo-app-and-user-journeys.md#app-02) |
| [SDK-18](#sdk-18) | Implement validated runtime configuration and safe cache fallback | 1–2 | [SDK-17](02-sdk-features.md#sdk-17), [SDK-01](02-sdk-features.md#sdk-01) |
| [SDK-19](#sdk-19) | Verify SDK packaging, exports and consumer documentation | 0.5–1 | [SDK-03](02-sdk-features.md#sdk-03), [SDK-10](02-sdk-features.md#sdk-10), [SDK-13](02-sdk-features.md#sdk-13), [SDK-14](02-sdk-features.md#sdk-14), [SDK-15](02-sdk-features.md#sdk-15), [SDK-18](02-sdk-features.md#sdk-18), [FND-06](00-foundations-and-tooling.md#fnd-06) |
| [SDK-20](#sdk-20) | Achieve SDK coverage and review all failure/race contracts | 1–2 | [SDK-19](02-sdk-features.md#sdk-19), [FND-04](00-foundations-and-tooling.md#fnd-04) |

## SDK-01

### Model domain data and validate API responses

**User story:** As a developer consuming the SDK, I want to model domain data and validate API responses so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | SDK: feature-by-feature |
| Suggested location | packages/sdk core/native entry points; native checks use apps/mobile |
| Dependencies | [FND-08](00-foundations-and-tooling.md#fnd-08) |
| Requirement trace | Domain/API |
| Focused estimate | 1–2 person-days (six focused hours/day) |
| Coverage gate | 100% on statements, branches, functions and lines; maintain while adding code |

### Learning context

Compile-time types do not validate JSON returned by a server.

### Work step by step

1. Model identity roles, staffing union, associate skills, learning and approvals from existing DB/OpenAPI.
2. Choose runtime validation approach and map invalid responses to typed domain errors.
3. Document DTO versus app model and optional profile fields absent from read seeds.

### Acceptance criteria

- All six datasets map without dropping linked IDs.
- Malformed status/percentage/ID responses fail before UI consumption.
- No fabricated phone/CV/onboarding values are presented as server records.

### Tests and failure cases

Test valid fixtures and wrong/missing/null/unknown fields, including both staffing states.

### Hints

Keep job title and application roles as separate types.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to SDK-01; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## SDK-02

### Implement the injectable HTTP client

**User story:** As a developer consuming the SDK, I want to implement the injectable HTTP client so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | SDK: feature-by-feature |
| Suggested location | packages/sdk core/native entry points; native checks use apps/mobile |
| Dependencies | [SDK-01](02-sdk-features.md#sdk-01) |
| Requirement trace | Transport |
| Focused estimate | 1–2 person-days (six focused hours/day) |
| Coverage gate | 100% on statements, branches, functions and lines; maintain while adding code |

### Learning context

HTTP needs cancellation, bounded time and typed failures, not only fetch(url).then(json).

### Work step by step

1. Define HttpTransport and injected clock/cancellation contracts.
2. Implement JSON requests, safe URL/query construction, timeout and response parsing.
3. Map network, 4xx/5xx and malformed JSON to redacted typed errors with request correlation.

### Acceptance criteria

- Core client can run in Node with fake transport.
- Cancellation stops stale work and timeout is deterministic.
- URLs encode query data rather than concatenate raw user input.

### Tests and failure cases

Test every status/error branch, abort, timeout, empty/malformed body and pagination query encoding.

### Hints

Public config/login requests must be possible without calling an auth interceptor.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to SDK-02; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## SDK-03

### Add approved-origin token injection and bounded authentication retry

**User story:** As a developer consuming the SDK, I want to add approved-origin token injection and bounded authentication retry so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | SDK: feature-by-feature |
| Suggested location | packages/sdk core/native entry points; native checks use apps/mobile |
| Dependencies | [SDK-02](02-sdk-features.md#sdk-02), [SDK-08](02-sdk-features.md#sdk-08) |
| Requirement trace | Auth/transport |
| Focused estimate | 1–1.5 person-days (six focused hours/day) |
| Coverage gate | 100% on statements, branches, functions and lines; maintain while adding code |

### Learning context

Bearer credentials must only reach trusted resource hosts; retry policy depends on semantics.

### Work step by step

1. Inject an AuthManager/token-provider port into authenticated client.
2. Attach tokens only to configured API origins and bypass provider/config requests.
3. Coordinate one refresh/retry on eligible 401s; leave 403 as authorization failure.

### Acceptance criteria

- No token is sent to One Cognizant/external file/config hosts accidentally.
- Repeated 401 never loops.
- Mutations are not blindly retried without an idempotency contract.

### Tests and failure cases

Assert headers per host, concurrent 401 behaviour, 403 and aborted-retry cases.

### Hints

Use exact origin comparison, not a hostname substring check.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to SDK-03; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## SDK-04

### Implement namespaced secure credential storage

**User story:** As a developer consuming the SDK, I want to implement namespaced secure credential storage so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | SDK: feature-by-feature |
| Suggested location | packages/sdk core/native entry points; native checks use apps/mobile |
| Dependencies | [SDK-01](02-sdk-features.md#sdk-01), [FND-04](00-foundations-and-tooling.md#fnd-04) |
| Requirement trace | Security/storage |
| Focused estimate | 1–2 person-days (six focused hours/day) |
| Coverage gate | 100% on statements, branches, functions and lines; maintain while adding code |

### Learning context

OS credential storage protects small secrets; normal app storage and file caches serve different purposes.

### Work step by step

1. Define secure-store interface and memory fake with per-app/account namespace.
2. Implement selected compatible native adapter with explicit protected-read policy.
3. Define clearing, missing/corrupt entry and store-failure outcomes without plaintext fallback.

### Acceptance criteria

- SDK core contains no direct RN import.
- Passwords and PDF/image contents are never saved in credential slots.
- Account/app namespace purge cannot delete unrelated application data.

### Tests and failure cases

Test missing/corrupt entries, read/write/delete errors, namespace isolation and native-wrapper calls; record real-device verification later.

### Hints

Do not assume a generic preference store is secure just because its API is asynchronous.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to SDK-04; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## SDK-05

### Implement biometric capability and gated unlock adapters

**User story:** As a developer consuming the SDK, I want to implement biometric capability and gated unlock adapters so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | SDK: feature-by-feature |
| Suggested location | packages/sdk core/native entry points; native checks use apps/mobile |
| Dependencies | [SDK-04](02-sdk-features.md#sdk-04) |
| Requirement trace | UX-13 |
| Focused estimate | 1–2 person-days (six focused hours/day) |
| Coverage gate | 100% on statements, branches, functions and lines; maintain while adding code |

### Learning context

Biometrics unlock local credential access; they do not prove that a remote token remains valid.

### Work step by step

1. Define capability/enrolment/authentication result types and fake adapter.
2. Implement native cancel/lockout/unavailable/enrolment handling.
3. Connect protected credential access so success does not merely set an unrelated boolean.

### Acceptance criteria

- Cancelled prompts return a typed cancellation without deleting healthy credentials.
- Unavailable biometrics follow configured fallback policy.
- A successful local prompt still requires session expiry/renewal checks.

### Tests and failure cases

Unit-test all result mappings with fake OS bridge; manually record hardware outcomes.

### Hints

Unit-test a native wrapper with fakes, then separately prove OS behaviour on a phone.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to SDK-05; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## SDK-06

### Implement abstract auth strategy and credentials class

**User story:** As a developer consuming the SDK, I want to implement abstract auth strategy and credentials class so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | SDK: feature-by-feature |
| Suggested location | packages/sdk core/native entry points; native checks use apps/mobile |
| Dependencies | [SDK-01](02-sdk-features.md#sdk-01), [SDK-02](02-sdk-features.md#sdk-02) |
| Requirement trace | Auth class contract |
| Focused estimate | 1–2 person-days (six focused hours/day) |
| Coverage gate | 100% on statements, branches, functions and lines; maintain while adding code |

### Learning context

The strategy pattern changes provider behaviour behind a stable TypeScript contract.

### Work step by step

1. Define AuthStrategy abstract class, discriminated AuthConfig/AuthInput and provider session types.
2. Implement CredentialsAuthStrategy using a dummy app-owned provider transport.
3. Reject incompatible input/config combinations and never persist passwords.

### Acceptance criteria

- A second app can supply its own base URL/config without copying auth code.
- Wrong credentials and unsupported SSO input become typed errors.
- The class does not own app navigation or secure-store lifecycle.

### Tests and failure cases

Test constructor/config validation, credentials success/failure and unsupported arguments.

### Hints

Credentials strategy is not a way to collect actual company passwords in this app.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to SDK-06; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## SDK-07

### Implement company SSO strategy with demo/native interaction ports

**User story:** As a developer consuming the SDK, I want to implement company SSO strategy with demo/native interaction ports so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | SDK: feature-by-feature |
| Suggested location | packages/sdk core/native entry points; native checks use apps/mobile |
| Dependencies | [SDK-06](02-sdk-features.md#sdk-06), [SDK-11](02-sdk-features.md#sdk-11) |
| Requirement trace | UX-11–12 |
| Focused estimate | 1.5–2.5 person-days (six focused hours/day) |
| Coverage gate | 100% on statements, branches, functions and lines; maintain while adding code |

### Learning context

Native SSO protocol handling and a simulated portal are different adapters behind the same interface.

### Work step by step

1. Implement CompanySsoAuthStrategy with email/ID hints and interaction port.
2. Provide demo exchange against POST /auth/demo and a separately specified native provider adapter.
3. Handle cancellation, callback/state validation and provider errors; document PKCE flow for real provider.

### Acceptance criteria

- Talent app can select SSO strategy once via config.
- No real credentials are collected inside the dummy portal.
- Demo token limitations are visible: no real provider refresh/revocation.

### Tests and failure cases

Test success, mismatch, cancel, invalid callback/state and transport failures without a real identity account.

### Hints

Use approved external system authentication for real OAuth; WebView remains an educational simulation.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to SDK-07; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## SDK-08

### Implement AuthManager authenticate and session restoration

**User story:** As a developer consuming the SDK, I want to implement AuthManager authenticate and session restoration so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | SDK: feature-by-feature |
| Suggested location | packages/sdk core/native entry points; native checks use apps/mobile |
| Dependencies | [SDK-04](02-sdk-features.md#sdk-04), [SDK-05](02-sdk-features.md#sdk-05), [SDK-06](02-sdk-features.md#sdk-06) |
| Requirement trace | UX-09–14 |
| Focused estimate | 1.5–2.5 person-days (six focused hours/day) |
| Coverage gate | 100% on statements, branches, functions and lines; maintain while adding code |

### Learning context

An orchestrator coordinates storage/provider/device interactions while keeping screen decisions outside the SDK.

### Work step by step

1. Implement manager states, subscription/dispose and explicit/no-argument authenticate.
2. Restore protected stored session or return interaction_required/cancelled.
3. Validate identity, preserve roles array and emit authenticated only when a session is usable.

### Acceptance criteria

- Repeated React renders do not instantiate or authenticate new managers.
- No-argument call handles no session, locked session, usable and expired session explicitly.
- Raw refresh credentials never reach screen props.

### Tests and failure cases

Test state transitions, subscribers, cancellation and storage/provider failures.

### Hints

Return typed outcomes instead of navigating to a hardcoded LoginScreen.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to SDK-08; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## SDK-09

### Implement refresh coordination and stale-session race protection

**User story:** As a developer consuming the SDK, I want to implement refresh coordination and stale-session race protection so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | SDK: feature-by-feature |
| Suggested location | packages/sdk core/native entry points; native checks use apps/mobile |
| Dependencies | [SDK-08](02-sdk-features.md#sdk-08) |
| Requirement trace | Auth concurrency |
| Focused estimate | 1–2 person-days (six focused hours/day) |
| Coverage gate | 100% on statements, branches, functions and lines; maintain while adding code |

### Learning context

Concurrent requests and logout can race; correctness requires shared promises and session identity.

### Work step by step

1. Implement one in-flight refresh per session with injected clock/provider.
2. Rotate recoverable credential and reject terminal refresh failure.
3. Use generation/account checks so late responses cannot restore an old session.

### Acceptance criteria

- Concurrent expiry/401 requests produce one provider refresh.
- Logout/account switch invalidates pending refresh results.
- The dummy no-refresh provider returns interaction_required instead of inventing credentials.

### Tests and failure cases

Use deferred promises/fake clock to test simultaneous requests, rotation failure, logout during refresh and old-account callbacks.

### Hints

A race test should control event order, not sleep for arbitrary time.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to SDK-09; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## SDK-10

### Implement complete logout and protected-work cancellation

**User story:** As a developer consuming the SDK, I want to implement complete logout and protected-work cancellation so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | SDK: feature-by-feature |
| Suggested location | packages/sdk core/native entry points; native checks use apps/mobile |
| Dependencies | [SDK-08](02-sdk-features.md#sdk-08), [SDK-09](02-sdk-features.md#sdk-09) |
| Requirement trace | UX-25 |
| Focused estimate | 1–1.5 person-days (six focused hours/day) |
| Coverage gate | 100% on statements, branches, functions and lines; maintain while adding code |

### Learning context

Local access must end even if remote revocation or one cleanup step fails.

### Work step by step

1. Lock auth and increment generation before clearing namespaced stored credentials.
2. Abort protected work and run all registered cleanup hooks.
3. Attempt bounded best-effort revoke when supported, emit unauthenticated and expose safe cleanup failures.

### Acceptance criteria

- Old callbacks cannot reauthenticate the user.
- Every cleanup step is attempted; no network failure traps the app in authenticated state.
- Unrelated storage remains untouched.

### Tests and failure cases

Test logout during refresh, no session, multiple calls, revoke timeout and each cleanup failure.

### Hints

App state purge is an injected hook/event subscriber; manager should not import app caches directly.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to SDK-10; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## SDK-11

### Define reusable navigation and auth interaction ports

**User story:** As a developer consuming the SDK, I want to define reusable navigation and auth interaction ports so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | SDK: feature-by-feature |
| Suggested location | packages/sdk core/native entry points; native checks use apps/mobile |
| Dependencies | [SDK-01](02-sdk-features.md#sdk-01) |
| Requirement trace | Navigation/auth |
| Focused estimate | 0.5–1 person-days (six focused hours/day) |
| Coverage gate | 100% on statements, branches, functions and lines; maintain while adding code |

### Learning context

A reusable service requests an interaction; the host app chooses how to display it.

### Work step by step

1. Define typed navigation/auth/external-link requests and async results.
2. Create a fake port for SDK tests and document app adapter responsibilities.
3. Support cancellation and listener cleanup without importing app route names.

### Acceptance criteria

- SDK tests run without NavigationContainer.
- App can map requests to a simulator portal, native session or login screen.
- Disposing subscriptions cannot leave an outstanding prompt unresolved.

### Tests and failure cases

Test emitted requests, completion/cancel and disposal/unsubscribe.

### Hints

Ports prevent a shared SDK from becoming a second application.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to SDK-11; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## SDK-12

### Implement identity and associate read clients

**User story:** As a developer consuming the SDK, I want to implement identity and associate read clients so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | SDK: feature-by-feature |
| Suggested location | packages/sdk core/native entry points; native checks use apps/mobile |
| Dependencies | [SDK-01](02-sdk-features.md#sdk-01), [SDK-02](02-sdk-features.md#sdk-02) |
| Requirement trace | API |
| Focused estimate | 0.5–1 person-days (six focused hours/day) |
| Coverage gate | 100% on statements, branches, functions and lines; maintain while adding code |

### Learning context

The verified identity determines /me; a caller-supplied organisation ID is not authorization.

### Work step by step

1. Wrap /me, /me/profile, associate list/detail/skills routes.
2. Parse DTOs, encode q/limit/offset and expose Page results.
3. Document immutable fields and profile values owned only by current-session drafts.

### Acceptance criteria

- Own/manager/admin reads obey backend outcomes.
- 404/403 are preserved as distinct typed failures.
- Read methods never write the DB or mutate shared fixture objects.

### Tests and failure cases

Use fake transport and local API contract cases for own/unrelated/direct-report IDs.

### Hints

Do not implement client-only filtering as a substitute for server scope.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to SDK-12; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## SDK-13

### Implement skill catalogue and approval read clients

**User story:** As a developer consuming the SDK, I want to implement skill catalogue and approval read clients so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | SDK: feature-by-feature |
| Suggested location | packages/sdk core/native entry points; native checks use apps/mobile |
| Dependencies | [SDK-12](02-sdk-features.md#sdk-12) |
| Requirement trace | UX-16,26 |
| Focused estimate | 0.5–1 person-days (six focused hours/day) |
| Coverage gate | 100% on statements, branches, functions and lines; maintain while adding code |

### Learning context

Linked resources need stable identity and scope-aware mapping.

### Work step by step

1. Wrap /skills, /me/skills and approval list/detail queries.
2. Map structured skills plus designated owner/reviewer links.
3. Expose pending/rejected/approved state without overwriting learning status.

### Acceptance criteria

- Seven seeded pending requests map to valid skill/owner/reviewer records.
- Search/paging/status filters use documented query types.
- A manager cannot read an unrelated approval through a forged ID.

### Tests and failure cases

Test empty/paged data, missing links, invalid statuses and scope denials.

### Hints

Current approval seed targets skills only; progress approvals come from the session-mutation model.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to SDK-13; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## SDK-14

### Implement learning, team and administration read clients

**User story:** As a developer consuming the SDK, I want to implement learning, team and administration read clients so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | SDK: feature-by-feature |
| Suggested location | packages/sdk core/native entry points; native checks use apps/mobile |
| Dependencies | [SDK-12](02-sdk-features.md#sdk-12) |
| Requirement trace | UX-21,27–28 |
| Focused estimate | 0.5–1 person-days (six focused hours/day) |
| Coverage gate | 100% on statements, branches, functions and lines; maintain while adding code |

### Learning context

Reuse a transport but keep resource contracts and permission failures explicit.

### Work step by step

1. Wrap learning catalogue/detail, assignment lists/detail, /team and /admin/users.
2. Map filtering/paging and application role arrays.
3. Keep manager-only /team semantics distinct from admin-wide associate search.

### Acceptance criteria

- All documented read endpoints have typed client methods.
- Role-specific failures do not silently downgrade to unrelated data.
- Catalogue skill strings are not confused with associate experience records.

### Tests and failure cases

Test admin/manager/associate fixtures, pagination, empty list and malformed assignment.

### Hints

Admin scope does not imply the manager-only endpoint should list every person.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to SDK-14; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## SDK-15

### Implement session-only domain mutation repositories

**User story:** As a developer consuming the SDK, I want to implement session-only domain mutation repositories so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | SDK: feature-by-feature |
| Suggested location | packages/sdk core/native entry points; native checks use apps/mobile |
| Dependencies | [SDK-12](02-sdk-features.md#sdk-12), [SDK-13](02-sdk-features.md#sdk-13), [SDK-14](02-sdk-features.md#sdk-14), [SDK-16](02-sdk-features.md#sdk-16) |
| Requirement trace | Future write contracts |
| Focused estimate | 2–3.5 person-days (six focused hours/day) |
| Coverage gate | 100% on statements, branches, functions and lines; maintain while adding code |

### Learning context

A fake backend needs business invariants and shared state; it is more than pushing objects into arrays.

### Work step by step

1. Hydrate cloned seed/read data and implement editable profile, skills, progress requests, review decisions, new assignments and role changes.
2. Preserve approved/proposed values, enforce direct-report/no-self-review/duplicate/final-admin rules and record decision feedback.
3. Expose reset/account cleanup; never persist changes to seed JSON or pretend HTTP 405 succeeded.

### Acceptance criteria

- Associate/manager views share the same session state and approvals apply atomically.
- Conflict/duplicate/missing-reviewer cases return typed errors.
- Process reset restores seeds while secure auth follows separate lifecycle.

### Tests and failure cases

Test every command positive/negative, decision races, role safeguards, no seed mutation and cross-account isolation.

### Hints

Organise commands into small domains rather than one giant mutable global store.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to SDK-15; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## SDK-16

### Implement file lifecycle, bounded validation and safe encoding utilities

**User story:** As a developer consuming the SDK, I want to implement file lifecycle, bounded validation and safe encoding utilities so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | SDK: feature-by-feature |
| Suggested location | packages/sdk core/native entry points; native checks use apps/mobile |
| Dependencies | [SDK-01](02-sdk-features.md#sdk-01), [SDK-04](02-sdk-features.md#sdk-04) |
| Requirement trace | UX-19 |
| Focused estimate | 1–2 person-days (six focused hours/day) |
| Coverage gate | 100% on statements, branches, functions and lines; maintain while adding code |

### Learning context

Temporary picker URIs, metadata, uploaded references and private files have different lifetimes.

### Work step by step

1. Define file/picker/temporary-store adapters and safe filename/URL handling.
2. Implement PDF/image type/size rules and selected/removed/replaced cleanup.
3. Provide reusable bounded text/number/date validation helpers; app composes field rules, backend validates again.

### Acceptance criteria

- Cancelled selection is not an error or an uploaded file.
- Logout/reset/replacement release temporary references.
- No broad sanitizer destroys valid names/text or enables arbitrary URL/HTML execution.

### Tests and failure cases

Test malformed filename, invalid MIME/extension/size, cancelled picker, duplicate cleanup and future dates.

### Hints

Extension-only checking is acceptable for a labelled prototype, not final server file validation.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to SDK-16; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## SDK-17

### Implement native HTTPS/public-key pinning transport

**User story:** As a developer consuming the SDK, I want to implement native HTTPS/public-key pinning transport so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | SDK: feature-by-feature |
| Suggested location | packages/sdk core/native entry points; native checks use apps/mobile |
| Dependencies | [SDK-02](02-sdk-features.md#sdk-02), [APP-02](03-expo-app-and-user-journeys.md#app-02) |
| Requirement trace | Security/pinning |
| Focused estimate | 1.5–3 person-days (six focused hours/day) |
| Coverage gate | 100% on statements, branches, functions and lines; maintain while adding code |

### Learning context

Pinning supplements ordinary TLS validation and needs a native build; a mocked fetch cannot prove it.

### Work step by step

1. Select a compatible native library/config plugin and document its Expo/new-architecture requirements.
2. Bundle current/backup pins and approved hosts before fetching remote config.
3. Wire controlled API/config/file traffic to pinned transport and document browser/native exceptions.

### Acceptance criteria

- Good pin succeeds; wrong pin and untrusted TLS fail.
- No runtime switch disables pinning or falls back to unpinned fetch.
- Native network changes require rebuilding the development client.

### Tests and failure cases

Unit-test wrapper/config decisions plus device tests for correct/wrong/backup pin and certificate expiry.

### Hints

Use a separate trusted HTTPS dev endpoint; localhost HTTP exercises do not prove this feature.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to SDK-17; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## SDK-18

### Implement validated runtime configuration and safe cache fallback

**User story:** As a developer consuming the SDK, I want to implement validated runtime configuration and safe cache fallback so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | SDK: feature-by-feature |
| Suggested location | packages/sdk core/native entry points; native checks use apps/mobile |
| Dependencies | [SDK-17](02-sdk-features.md#sdk-17), [SDK-01](02-sdk-features.md#sdk-01) |
| Requirement trace | UX-08 |
| Focused estimate | 1–2 person-days (six focused hours/day) |
| Coverage gate | 100% on statements, branches, functions and lines; maintain while adding code |

### Learning context

Configuration is untrusted data constrained by shipped schema and security bounds, not remote code.

### Work step by step

1. Fetch hosted config through pinned transport and validate schema/revision/expiry/ranges/hosts.
2. Apply immutable snapshots; use eligible non-secret last-known-good cache with explicit freshness policy.
3. Reject arbitrary identity/pin changes and apply refresh at a safe boundary.

### Acceptance criteria

- Invalid/unreachable config uses only an eligible cache or typed blocking error.
- Lower revision, incompatible build and expired cache are rejected.
- Configuration cannot grant app roles or execute new code.

### Tests and failure cases

Test all trust/expiry/revision/range branches with fake clock and transport, then device pinned fetch.

### Hints

Bootstrap pins and trusted config URL must exist before remote config can be trusted.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to SDK-18; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## SDK-19

### Verify SDK packaging, exports and consumer documentation

**User story:** As a developer consuming the SDK, I want to verify SDK packaging, exports and consumer documentation so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | SDK: feature-by-feature |
| Suggested location | packages/sdk core/native entry points; native checks use apps/mobile |
| Dependencies | [SDK-03](02-sdk-features.md#sdk-03), [SDK-10](02-sdk-features.md#sdk-10), [SDK-13](02-sdk-features.md#sdk-13), [SDK-14](02-sdk-features.md#sdk-14), [SDK-15](02-sdk-features.md#sdk-15), [SDK-18](02-sdk-features.md#sdk-18), [FND-06](00-foundations-and-tooling.md#fnd-06) |
| Requirement trace | Distribution |
| Focused estimate | 0.5–1 person-days (six focused hours/day) |
| Coverage gate | 100% on statements, branches, functions and lines; maintain while adding code |

### Learning context

Consumers depend on public exports/types, not internal workspace file paths.

### Work step by step

1. Document configuration, auth examples, API adapters and native setup requirements.
2. Build/pack SDK and import core in clean Node consumer and native entry in app.
3. Version the public contract and record API/config compatibility.

### Acceptance criteria

- No app/UI import is required to consume core.
- Declarations and intended entry points exist in tarball.
- Native peer setup is documented and core does not eagerly load native bridges.

### Tests and failure cases

Run packed-consumer type/import tests and inspect included files for secrets/fixtures.

### Hints

A package that only works through a TS path alias is not ready to publish.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to SDK-19; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## SDK-20

### Achieve SDK coverage and review all failure/race contracts

**User story:** As a developer consuming the SDK, I want to achieve SDK coverage and review all failure/race contracts so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | SDK: feature-by-feature |
| Suggested location | packages/sdk core/native entry points; native checks use apps/mobile |
| Dependencies | [SDK-19](02-sdk-features.md#sdk-19), [FND-04](00-foundations-and-tooling.md#fnd-04) |
| Requirement trace | Coverage 100% |
| Focused estimate | 1–2 person-days (six focused hours/day) |
| Coverage gate | 100% on statements, branches, functions and lines; maintain while adding code |

### Learning context

100% coverage is a hard project gate; tests must also explain why each branch exists.

### Work step by step

1. Run collectCoverageFrom across all owned executable SDK TS, including native wrappers.
2. Fill behavioural gaps with deterministic negative/race tests, not coverage-only calls.
3. Review auth/network/config/storage/file/domain contracts with another learner and capture native evidence separately.

### Acceptance criteria

- Statements/branches/functions/lines are each 100%, with no business-logic exclusions.
- CI demonstrates a failing uncovered branch and returns to green.
- Every native fake is identified and real-device verification gaps are written down.

### Tests and failure cases

Review reports and intentionally mutate an important decision to ensure a test detects wrong behaviour.

### Hints

Third-party OS internals are not JS coverage targets; the wrapper you own still is.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to SDK-20; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.
