# Expo app: setup and complete user experience

Status: implementation work for humans. The repository currently contains documentation, fixtures and the supporting API/prototype, not these native workspaces. Do not interpret estimates or story descriptions as evidence of completion.

Read [learning solution design](../solution-design/10-human-learning-implementation-plan.md) first and use the [backlog map](README.md) to find prerequisites. All stories are required unless an explicitly described platform limitation is recorded. Each day below is six focused hours for a developer familiar with the tools; learner elapsed time is discussed in the backlog map.

## Stories

| ID | Outcome | Focused person-days | Prerequisites |
| --- | --- | --- | --- |
| [APP-01](#app-01) | Create the Expo TypeScript app and dependency baseline | 1–1.5 | [FND-08](00-foundations-and-tooling.md#fnd-08) |
| [APP-02](#app-02) | Run Android emulator and iOS development builds | 1–2 | [APP-01](03-expo-app-and-user-journeys.md#app-01) |
| [APP-03](#app-03) | Set up environments and backend connectivity | 1–1.5 | [APP-01](03-expo-app-and-user-journeys.md#app-01) |
| [APP-04](#app-04) | Compose SDK services and application navigation once | 1–2 | [APP-03](03-expo-app-and-user-journeys.md#app-03), [SDK-08](02-sdk-features.md#sdk-08), [SDK-11](02-sdk-features.md#sdk-11), [SDK-12](02-sdk-features.md#sdk-12) |
| [APP-05](#app-05) | Implement launch, hosted config and recoverable startup states | 1–1.5 | [APP-04](03-expo-app-and-user-journeys.md#app-04), [SDK-18](02-sdk-features.md#sdk-18), [UI-14](01-ui-library-components.md#ui-14) |
| [APP-06](#app-06) | Implement the first login screen | 0.5–1 | [APP-04](03-expo-app-and-user-journeys.md#app-04), [UI-03](01-ui-library-components.md#ui-03), [UI-07](01-ui-library-components.md#ui-07) |
| [APP-07](#app-07) | Implement first-visit activation identity form | 0.5–1 | [APP-06](03-expo-app-and-user-journeys.md#app-06), [SDK-07](02-sdk-features.md#sdk-07), [UI-04](01-ui-library-components.md#ui-04) |
| [APP-08](#app-08) | Implement company portal simulation and authentication result routing | 1–1.5 | [APP-07](03-expo-app-and-user-journeys.md#app-07), [APP-04](03-expo-app-and-user-journeys.md#app-04) |
| [APP-09](#app-09) | Implement returning-user biometric and expired-session UX | 0.5–1.5 | [APP-06](03-expo-app-and-user-journeys.md#app-06), [SDK-05](02-sdk-features.md#sdk-05), [SDK-09](02-sdk-features.md#sdk-09) |
| [APP-10](#app-10) | Implement onboarding personal details | 1–1.5 | [APP-08](03-expo-app-and-user-journeys.md#app-08), [UI-04](01-ui-library-components.md#ui-04), [UI-07](01-ui-library-components.md#ui-07), [UI-13](01-ui-library-components.md#ui-13), [SDK-15](02-sdk-features.md#sdk-15) |
| [APP-11](#app-11) | Implement onboarding timeline, back and save/resume | 0.5–1 | [APP-10](03-expo-app-and-user-journeys.md#app-10), [UI-10](01-ui-library-components.md#ui-10) |
| [APP-12](#app-12) | Implement skills table and add-form reveal | 0.5–1 | [APP-11](03-expo-app-and-user-journeys.md#app-11), [UI-11](01-ui-library-components.md#ui-11), [UI-03](01-ui-library-components.md#ui-03), [SDK-13](02-sdk-features.md#sdk-13) |
| [APP-13](#app-13) | Implement skill entry, evidence and pending submission | 1–1.5 | [APP-12](03-expo-app-and-user-journeys.md#app-12), [UI-05](01-ui-library-components.md#ui-05), [UI-13](01-ui-library-components.md#ui-13), [SDK-15](02-sdk-features.md#sdk-15), [SDK-16](02-sdk-features.md#sdk-16) |
| [APP-14](#app-14) | Implement CV upload and final profile review | 0.5–1 | [APP-11](03-expo-app-and-user-journeys.md#app-11), [UI-13](01-ui-library-components.md#ui-13), [UI-06](01-ui-library-components.md#ui-06), [SDK-15](02-sdk-features.md#sdk-15), [SDK-16](02-sdk-features.md#sdk-16) |
| [APP-15](#app-15) | Implement editable single-page associate dashboard | 1–2 | [APP-14](03-expo-app-and-user-journeys.md#app-14), [APP-12](03-expo-app-and-user-journeys.md#app-12), [APP-13](03-expo-app-and-user-journeys.md#app-13), [SDK-15](02-sdk-features.md#sdk-15) |
| [APP-16](#app-16) | Implement permitted workspace tabs and route guards | 0.5–1 | [APP-04](03-expo-app-and-user-journeys.md#app-04), [UI-10](01-ui-library-components.md#ui-10), [SDK-15](02-sdk-features.md#sdk-15) |
| [APP-17](#app-17) | Implement learning list and progress requests | 0.5–1.5 | [APP-15](03-expo-app-and-user-journeys.md#app-15), [UI-09](01-ui-library-components.md#ui-09), [SDK-14](02-sdk-features.md#sdk-14), [SDK-15](02-sdk-features.md#sdk-15) |
| [APP-18](#app-18) | Implement approval feedback and rejected-change resubmission | 0.5–1 | [APP-17](03-expo-app-and-user-journeys.md#app-17), [APP-13](03-expo-app-and-user-journeys.md#app-13), [SDK-15](02-sdk-features.md#sdk-15) |
| [APP-19](#app-19) | Implement manager approval inbox and request review | 1–1.5 | [APP-16](03-expo-app-and-user-journeys.md#app-16), [SDK-13](02-sdk-features.md#sdk-13), [SDK-15](02-sdk-features.md#sdk-15), [UI-08](01-ui-library-components.md#ui-08) |
| [APP-20](#app-20) | Implement manager associate search and learning assignment | 0.5–1.5 | [APP-19](03-expo-app-and-user-journeys.md#app-19), [UI-05](01-ui-library-components.md#ui-05), [SDK-14](02-sdk-features.md#sdk-14), [SDK-15](02-sdk-features.md#sdk-15) |
| [APP-21](#app-21) | Implement admin search, additive role editing and safeguards | 1–1.5 | [APP-16](03-expo-app-and-user-journeys.md#app-16), [SDK-14](02-sdk-features.md#sdk-14), [SDK-15](02-sdk-features.md#sdk-15), [UI-06](01-ui-library-components.md#ui-06) |
| [APP-22](#app-22) | Implement account drawer, external portal and full logout UX | 0.5–1 | [APP-16](03-expo-app-and-user-journeys.md#app-16), [UI-12](01-ui-library-components.md#ui-12), [SDK-10](02-sdk-features.md#sdk-10), [SDK-11](02-sdk-features.md#sdk-11) |
| [APP-23](#app-23) | Implement process-lifecycle reset and account isolation | 0.5–1 | [APP-22](03-expo-app-and-user-journeys.md#app-22), [SDK-15](02-sdk-features.md#sdk-15) |
| [APP-24](#app-24) | Enforce app unit coverage and run accessibility regression checks | 1–1.5 | [APP-15](03-expo-app-and-user-journeys.md#app-15), [APP-18](03-expo-app-and-user-journeys.md#app-18), [APP-19](03-expo-app-and-user-journeys.md#app-19), [APP-20](03-expo-app-and-user-journeys.md#app-20), [APP-21](03-expo-app-and-user-journeys.md#app-21), [APP-22](03-expo-app-and-user-journeys.md#app-22), [FND-04](00-foundations-and-tooling.md#fnd-04) |
| [APP-25](#app-25) | Demonstrate complete learner journey and packaged integration | 1–2 | [APP-24](03-expo-app-and-user-journeys.md#app-24), [UI-14](01-ui-library-components.md#ui-14), [SDK-20](02-sdk-features.md#sdk-20), [FND-07](00-foundations-and-tooling.md#fnd-07), [APP-23](03-expo-app-and-user-journeys.md#app-23) |

## APP-01

### Create the Expo TypeScript app and dependency baseline

**User story:** As a mobile app user and implementing learner, I want to create the Expo TypeScript app and dependency baseline so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | Expo app: setup and complete user experience |
| Suggested location | apps/mobile feature/controller/navigation modules |
| Dependencies | [FND-08](00-foundations-and-tooling.md#fnd-08) |
| Requirement trace | Platform setup |
| Focused estimate | 1–1.5 person-days (six focused hours/day) |
| Coverage gate | 70% on statements, branches, functions and lines; maintain while adding code |

### Learning context

An Expo app provides the native host; adding every library in advance creates compatibility problems.

### Work step by step

1. Create a blank TypeScript Expo app inside apps/mobile and integrate it into npm workspaces.
2. Select React Navigation or record an explicit alternative; install only required navigation/safe-area/screens dependencies compatibly.
3. Install expo-dev-client and record exact Node/npm/Expo/React/RN/native-package versions.

### Acceptance criteria

- App consumes local UI/SDK package identities without duplicate React.
- App manifest/root stay private; no standalone lockfile competes with workspace root.
- No feature screen or native capability is claimed implemented yet.

### Tests and failure cases

Run Expo doctor/dependency checks, app typecheck and test smoke; document actual commands.

### Hints

Use expo install for native compatibility and avoid combining Router/template conventions accidentally.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to APP-01; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## APP-02

### Run Android emulator and iOS development builds

**User story:** As a mobile app user and implementing learner, I want to run Android emulator and iOS development builds so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | Expo app: setup and complete user experience |
| Suggested location | apps/mobile feature/controller/navigation modules |
| Dependencies | [APP-01](03-expo-app-and-user-journeys.md#app-01) |
| Requirement trace | Native development |
| Focused estimate | 1–2 person-days (six focused hours/day) |
| Coverage gate | 70% on statements, branches, functions and lines; maintain while adding code |

### Learning context

Metro serves JS; a development client is a native binary that must contain the required native modules.

### Work step by step

1. Configure Android Studio/SDK/JDK and create/start a compatible emulator; build/install the development client.
2. On a Mac configure Xcode/simulator and build/install the iOS client, or document the separate authorised cloud/device route.
3. Start Metro with --dev-client, demonstrate Fast Refresh and document when a native rebuild is needed.

### Acceptance criteria

- A human can reproduce Android run instructions from clean setup.
- iOS is demonstrated on supported hardware or explicitly blocked with prerequisites/owner recorded.
- Expo Go is not presented as proof of custom native pinning/biometric integration.

### Tests and failure cases

Record device/OS/build/commands; change a JS label and explain why a native dependency change requires a new binary.

### Hints

Windows supports Android local development; it does not run a local iOS simulator.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to APP-02; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## APP-03

### Set up environments and backend connectivity

**User story:** As a mobile app user and implementing learner, I want to set up environments and backend connectivity so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | Expo app: setup and complete user experience |
| Suggested location | apps/mobile feature/controller/navigation modules |
| Dependencies | [APP-01](03-expo-app-and-user-journeys.md#app-01) |
| Requirement trace | Environment/API |
| Focused estimate | 1–1.5 person-days (six focused hours/day) |
| Coverage gate | 70% on statements, branches, functions and lines; maintain while adding code |

### Learning context

App-exposed configuration is not secret storage; emulator localhost is not always the host computer.

### Work step by step

1. Define development/test/production-shaped env selection and trusted bundled bootstraps with placeholders.
2. Start existing Node backend and configure emulator/device base URLs deliberately.
3. Separate early HTTP seed exercise from HTTPS/config/pinning acceptance and record setup requirements.

### Acceptance criteria

- No tokens/passwords enter client environment files or Git.
- Android emulator can read /health and obtain a dummy token; physical/iOS setup is documented distinctly.
- Production-shaped builds cannot silently enable development-only bypasses.

### Tests and failure cases

Test wrong URL/offline endpoint and verify safe user-visible failure; inspect configuration for secrets.

### Hints

Use host 10.0.2.2 for Android emulator reachability and explicit binding/network setup for physical devices.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to APP-03; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## APP-04

### Compose SDK services and application navigation once

**User story:** As a mobile app user and implementing learner, I want to compose SDK services and application navigation once so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | Expo app: setup and complete user experience |
| Suggested location | apps/mobile feature/controller/navigation modules |
| Dependencies | [APP-03](03-expo-app-and-user-journeys.md#app-03), [SDK-08](02-sdk-features.md#sdk-08), [SDK-11](02-sdk-features.md#sdk-11), [SDK-12](02-sdk-features.md#sdk-12) |
| Requirement trace | UX-08–14 |
| Focused estimate | 1–2 person-days (six focused hours/day) |
| Coverage gate | 70% on statements, branches, functions and lines; maintain while adding code |

### Learning context

Dependency injection belongs in one composition root; screen renders should not recreate authentication managers.

### Work step by step

1. Create app entry/bootstrap that builds chosen auth strategy/config, manager, transport and repository services once.
2. Adapt SDK navigation/interaction ports to concrete route graph and native/demo interactions.
3. Provide services to features and subscribe/dispose auth events with account/reset cleanup.

### Acceptance criteria

- App selects company SSO strategy without screen-owned raw tokens.
- Protected routes cannot be entered before auth/bootstrap resolution.
- Strict-mode/re-render does not duplicate listeners/prompts/services.

### Tests and failure cases

Test bootstrap instance counts, listener disposal and protected deep-link behaviour.

### Hints

Register the app immediately and render a launch gate while async bootstrap runs.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to APP-04; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## APP-05

### Implement launch, hosted config and recoverable startup states

**User story:** As a mobile app user and implementing learner, I want to implement launch, hosted config and recoverable startup states so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | Expo app: setup and complete user experience |
| Suggested location | apps/mobile feature/controller/navigation modules |
| Dependencies | [APP-04](03-expo-app-and-user-journeys.md#app-04), [SDK-18](02-sdk-features.md#sdk-18), [UI-14](01-ui-library-components.md#ui-14) |
| Requirement trace | UX-08–09 |
| Focused estimate | 1–1.5 person-days (six focused hours/day) |
| Coverage gate | 70% on statements, branches, functions and lines; maintain while adding code |

### Learning context

The first screen must explain waiting/failure instead of flashing private content or hanging indefinitely.

### Work step by step

1. Render branded loading while ConfigManager resolves remote or eligible cached configuration.
2. Show blocking Retry for invalid/unavailable config with no safe cache.
3. Inspect stored auth after readiness and route to login, onboarding resume or dashboard based on outcomes.

### Acceptance criteria

- No private screen flashes during startup.
- Retry is bounded/user-controlled and preserves safe bootstrap state.
- Config/schema/pin failures are distinguishable from credential failure in diagnostics without leaking secrets.

### Tests and failure cases

Test remote success, cached success, no-cache failure, retry and expired session.

### Hints

Use the SDK result rather than duplicating config validation in a component effect.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to APP-05; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## APP-06

### Implement the first login screen

**User story:** As a mobile app user and implementing learner, I want to implement the first login screen so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | Expo app: setup and complete user experience |
| Suggested location | apps/mobile feature/controller/navigation modules |
| Dependencies | [APP-04](03-expo-app-and-user-journeys.md#app-04), [UI-03](01-ui-library-components.md#ui-03), [UI-07](01-ui-library-components.md#ui-07) |
| Requirement trace | UX-10 |
| Focused estimate | 0.5–1 person-days (six focused hours/day) |
| Coverage gate | 70% on statements, branches, functions and lines; maintain while adding code |

### Learning context

A mobile login page needs clear hierarchy and consistent actions before any authentication succeeds.

### Work step by step

1. Compose greeting/login card with UI library only.
2. Stack equal full-width 54px actions for eligible biometric unlock, company login and first-visit activation.
3. Show working/error/cancel feedback and prevent double invocation.

### Acceptance criteria

- Buttons align and grow for large text.
- No biometric option is shown as a valid stored session when none exists.
- Company password is not requested on this screen.

### Tests and failure cases

Test conditional buttons, disabled/loading states and narrow/large-font layout.

### Hints

A saved mock marker in the HTML prototype is not the native secure session store.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to APP-06; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## APP-07

### Implement first-visit activation identity form

**User story:** As a mobile app user and implementing learner, I want to implement first-visit activation identity form so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | Expo app: setup and complete user experience |
| Suggested location | apps/mobile feature/controller/navigation modules |
| Dependencies | [APP-06](03-expo-app-and-user-journeys.md#app-06), [SDK-07](02-sdk-features.md#sdk-07), [UI-04](01-ui-library-components.md#ui-04) |
| Requirement trace | UX-11 |
| Focused estimate | 0.5–1 person-days (six focused hours/day) |
| Coverage gate | 70% on statements, branches, functions and lines; maintain while adding code |

### Learning context

An email/ID match identifies a dummy account but is not production authentication.

### Work step by step

1. Build required email and 6–7-digit string ID fields.
2. Trim/normalize email safely and preserve ID leading zeros; display inline validation.
3. Request selected SSO strategy with hints and handle mismatch/retry/cancel.

### Acceptance criteria

- Invalid/whitespace input never proceeds.
- Matching identity reaches dummy company authentication.
- No role or bench state is trusted merely from user-entered values.

### Tests and failure cases

Test empty/wrong email, numeric-vs-string ID, leading-zero validation and valid fixture.

### Hints

Avoid using a field name to inspect a form object property as happened in the HTML prototype.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to APP-07; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## APP-08

### Implement company portal simulation and authentication result routing

**User story:** As a mobile app user and implementing learner, I want to implement company portal simulation and authentication result routing so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | Expo app: setup and complete user experience |
| Suggested location | apps/mobile feature/controller/navigation modules |
| Dependencies | [APP-07](03-expo-app-and-user-journeys.md#app-07), [APP-04](03-expo-app-and-user-journeys.md#app-04) |
| Requirement trace | UX-12,14 |
| Focused estimate | 1–1.5 person-days (six focused hours/day) |
| Coverage gate | 70% on statements, branches, functions and lines; maintain while adding code |

### Learning context

The app presents auth UX while the strategy owns the provider exchange.

### Work step by step

1. Create clearly labelled dummy portal interaction screen/WebView with success/error/cancel actions.
2. Call SDK interaction/strategy, load verified identity and fetch associate profile.
3. Route first-time/incomplete profile to onboarding and completed session to granted workspace.

### Acceptance criteria

- Roles, job title and bench/project state are separate displayed attributes.
- Cancelled/failed portal does not leave protected routes open.
- Real provider integration would use the approved external native flow, not a real-password dummy WebView.

### Tests and failure cases

Test SSO success/mismatch/cancel, missing profile and manager/admin-only identity.

### Hints

Keep demo portal implementation isolated so another strategy does not need it.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to APP-08; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## APP-09

### Implement returning-user biometric and expired-session UX

**User story:** As a mobile app user and implementing learner, I want to implement returning-user biometric and expired-session UX so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | Expo app: setup and complete user experience |
| Suggested location | apps/mobile feature/controller/navigation modules |
| Dependencies | [APP-06](03-expo-app-and-user-journeys.md#app-06), [SDK-05](02-sdk-features.md#sdk-05), [SDK-09](02-sdk-features.md#sdk-09) |
| Requirement trace | UX-09,13–14 |
| Focused estimate | 0.5–1.5 person-days (six focused hours/day) |
| Coverage gate | 70% on statements, branches, functions and lines; maintain while adding code |

### Learning context

Local unlock can be cancelled; it must not erase a valid account or falsely validate an expired server session.

### Work step by step

1. Connect Unlock with biometrics to no-argument manager authentication.
2. Map cancel/lockout/unavailable/renewal failure to supported fallback actions.
3. Resume unfinished onboarding at its saved step within the session.

### Acceptance criteria

- Native prompt appears only when user flow permits it.
- Expired/revoked session cannot reach dashboard solely through a successful local prompt.
- No navigation loop occurs on cancellation/failed restore.

### Tests and failure cases

Use fake results for unit tests and record real-device biometric success/cancel evidence.

### Hints

Do not invoke authenticate on every render or foreground event without interaction policy.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to APP-09; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## APP-10

### Implement onboarding personal details

**User story:** As a mobile app user and implementing learner, I want to implement onboarding personal details so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | Expo app: setup and complete user experience |
| Suggested location | apps/mobile feature/controller/navigation modules |
| Dependencies | [APP-08](03-expo-app-and-user-journeys.md#app-08), [UI-04](01-ui-library-components.md#ui-04), [UI-07](01-ui-library-components.md#ui-07), [UI-13](01-ui-library-components.md#ui-13), [SDK-15](02-sdk-features.md#sdk-15) |
| Requirement trace | UX-15 |
| Focused estimate | 1–1.5 person-days (six focused hours/day) |
| Coverage gate | 70% on statements, branches, functions and lines; maintain while adding code |

### Learning context

Form validation and organisation-owned values must be obvious and consistent with the dashboard.

### Work step by step

1. Compose name, phone, address and optional profile image using reusable controls.
2. Display ID, email, manager, job title, location and staffing state read-only.
3. Validate required trimmed fields and save session draft; valid Continue advances to Skills.

### Acceptance criteria

- Name/phone/address errors are inline and focus first invalid field.
- User cannot edit organisation data through ordinary form state.
- Picker cancel/invalid image preserves prior valid details.

### Tests and failure cases

Test blank/whitespace values, successful navigation, read-only fields and image failure.

### Hints

Use one feature validation schema rather than duplicate rules across form and dashboard.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to APP-10; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## APP-11

### Implement onboarding timeline, back and save/resume

**User story:** As a mobile app user and implementing learner, I want to implement onboarding timeline, back and save/resume so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | Expo app: setup and complete user experience |
| Suggested location | apps/mobile feature/controller/navigation modules |
| Dependencies | [APP-10](03-expo-app-and-user-journeys.md#app-10), [UI-10](01-ui-library-components.md#ui-10) |
| Requirement trace | UX-14–18 |
| Focused estimate | 0.5–1 person-days (six focused hours/day) |
| Coverage gate | 70% on statements, branches, functions and lines; maintain while adding code |

### Learning context

A draft is user work; leaving a step must have an explicit preservation policy.

### Work step by step

1. Compose three-step timeline and step controllers.
2. Implement Back/Continue and Save and exit to a signed-in paused screen.
3. Resume exact saved step and values; explain process-kill reset contract.

### Acceptance criteria

- Save and exit does not log out.
- Incomplete personal-details draft can be saved but cannot Continue until valid.
- Back/resume do not erase accepted data or trigger duplicate submissions.

### Tests and failure cases

Test pause/resume each step, back navigation and invalid Continue.

### Hints

Separate completed submission state from the current unsaved form draft.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to APP-11; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## APP-12

### Implement skills table and add-form reveal

**User story:** As a mobile app user and implementing learner, I want to implement skills table and add-form reveal so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | Expo app: setup and complete user experience |
| Suggested location | apps/mobile feature/controller/navigation modules |
| Dependencies | [APP-11](03-expo-app-and-user-journeys.md#app-11), [UI-11](01-ui-library-components.md#ui-11), [UI-03](01-ui-library-components.md#ui-03), [SDK-13](02-sdk-features.md#sdk-13) |
| Requirement trace | UX-16–17 |
| Focused estimate | 0.5–1 person-days (six focused hours/day) |
| Coverage gate | 70% on statements, branches, functions and lines; maintain while adding code |

### Learning context

A reviewable table and a deliberate reveal action reduce mobile form clutter.

### Work step by step

1. Read structured seed/session skills and render title/description/experience/last-used/status.
2. Place full-width Add new skills beneath the table.
3. Reveal/cancel the add form; reuse this feature on dashboard.

### Acceptance criteria

- Table is present before add form is opened.
- All columns can be reached through horizontal scroll.
- Approved/pending/rejected states are labelled in text.

### Tests and failure cases

Test empty/long rows, seeded pending values, reveal/cancel and state reuse.

### Hints

Use skill_id as row identity; do not generate fake experience in the UI.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to APP-12; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## APP-13

### Implement skill entry, evidence and pending submission

**User story:** As a mobile app user and implementing learner, I want to implement skill entry, evidence and pending submission so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | Expo app: setup and complete user experience |
| Suggested location | apps/mobile feature/controller/navigation modules |
| Dependencies | [APP-12](03-expo-app-and-user-journeys.md#app-12), [UI-05](01-ui-library-components.md#ui-05), [UI-13](01-ui-library-components.md#ui-13), [SDK-15](02-sdk-features.md#sdk-15), [SDK-16](02-sdk-features.md#sdk-16) |
| Requirement trace | UX-17,19 |
| Focused estimate | 1–1.5 person-days (six focused hours/day) |
| Coverage gate | 70% on statements, branches, functions and lines; maintain while adding code |

### Learning context

The app owns required field UX while the repository owns cross-user approval invariants.

### Work step by step

1. Implement catalogue search, expertise, experience, project description, last-used date and optional PDF.
2. Validate mandatory values, 0–60 years, nonfuture date and duplicate constraints.
3. Submit to session repository; show pending row and collapse form; allow skipping new skills.

### Acceptance criteria

- Invalid values remain editable with specific messages.
- Successful submission appears in own table and appropriate manager inbox.
- Duplicate pending/approved title is rejected; corrected rejected entry can resubmit.

### Tests and failure cases

Test valid/pending path, each invalid field, file rules and duplicate requests.

### Hints

Never label a selected local PDF as permanently uploaded when no upload service exists.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to APP-13; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## APP-14

### Implement CV upload and final profile review

**User story:** As a mobile app user and implementing learner, I want to implement CV upload and final profile review so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | Expo app: setup and complete user experience |
| Suggested location | apps/mobile feature/controller/navigation modules |
| Dependencies | [APP-11](03-expo-app-and-user-journeys.md#app-11), [UI-13](01-ui-library-components.md#ui-13), [UI-06](01-ui-library-components.md#ui-06), [SDK-15](02-sdk-features.md#sdk-15), [SDK-16](02-sdk-features.md#sdk-16) |
| Requirement trace | UX-18–19 |
| Focused estimate | 0.5–1 person-days (six focused hours/day) |
| Coverage gate | 70% on statements, branches, functions and lines; maintain while adding code |

### Learning context

Review makes completion deliberate and separates optional file selection from account authentication.

### Work step by step

1. Build summary and PDF select/view/replace/remove interactions.
2. Require a valid CV or explicit no-CV choice.
3. Complete session profile and route to the first granted workspace.

### Acceptance criteria

- Selected CV has precedence over skip state and invalid files show feedback.
- Remove/replace cleans up temporary references.
- No Associate tab is invented for manager-only/admin-only users.

### Tests and failure cases

Test selected/no-CV/remove/replacement cases and role-specific completion.

### Hints

CV is editable domain state, not part of the auth token.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to APP-14; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## APP-15

### Implement editable single-page associate dashboard

**User story:** As a mobile app user and implementing learner, I want to implement editable single-page associate dashboard so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | Expo app: setup and complete user experience |
| Suggested location | apps/mobile feature/controller/navigation modules |
| Dependencies | [APP-14](03-expo-app-and-user-journeys.md#app-14), [APP-12](03-expo-app-and-user-journeys.md#app-12), [APP-13](03-expo-app-and-user-journeys.md#app-13), [SDK-15](02-sdk-features.md#sdk-15) |
| Requirement trace | UX-20 |
| Focused estimate | 1–2 person-days (six focused hours/day) |
| Coverage gate | 70% on statements, branches, functions and lines; maintain while adding code |

### Learning context

After onboarding the same data should be maintainable without returning to the wizard.

### Work step by step

1. Compose profile/contact/image/CV/skills and assignment sections in one scrollable screen.
2. Use Edit/Save/Cancel semantics and shared field validation.
3. Keep immutable organisation data visible, including job title distinct from application role.

### Acceptance criteria

- Saved session edits appear immediately and cancellation restores prior values.
- Mandatory contacts remain required during edits.
- No duplicate controller/schema diverges from onboarding behaviour.

### Tests and failure cases

Test dirty cancel, invalid save, successful edits, missing optional files and read-only data.

### Hints

Extract feature-level form logic, not an application-specific universal UI component.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to APP-15; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## APP-16

### Implement permitted workspace tabs and route guards

**User story:** As a mobile app user and implementing learner, I want to implement permitted workspace tabs and route guards so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | Expo app: setup and complete user experience |
| Suggested location | apps/mobile feature/controller/navigation modules |
| Dependencies | [APP-04](03-expo-app-and-user-journeys.md#app-04), [UI-10](01-ui-library-components.md#ui-10), [SDK-15](02-sdk-features.md#sdk-15) |
| Requirement trace | UX-05 |
| Focused estimate | 0.5–1 person-days (six focused hours/day) |
| Coverage gate | 70% on statements, branches, functions and lines; maintain while adding code |

### Learning context

Permissions shape route availability; a hidden tab alone does not protect data.

### Work step by step

1. Map verified role arrays to My profile/My team/Admin tabs.
2. Choose initial workspace deterministically and handle role refresh/revocation.
3. Guard protected/deep-linked screens and respect backend scope failures.

### Acceptance criteria

- All seven nonempty role combinations work, adding an admin-only runtime fixture.
- Job title never grants manager/admin access.
- Revoked route cannot be returned to through Back.

### Tests and failure cases

Test role matrix, unrelated direct links and effective-role changes.

### Hints

The 40-person seed does not contain admin-only; create it in test/session data rather than claiming it does.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to APP-16; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## APP-17

### Implement learning list and progress requests

**User story:** As a mobile app user and implementing learner, I want to implement learning list and progress requests so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | Expo app: setup and complete user experience |
| Suggested location | apps/mobile feature/controller/navigation modules |
| Dependencies | [APP-15](03-expo-app-and-user-journeys.md#app-15), [UI-09](01-ui-library-components.md#ui-09), [SDK-14](02-sdk-features.md#sdk-14), [SDK-15](02-sdk-features.md#sdk-15) |
| Requirement trace | UX-21 |
| Focused estimate | 0.5–1.5 person-days (six focused hours/day) |
| Coverage gate | 70% on statements, branches, functions and lines; maintain while adding code |

### Learning context

Approved progress and proposed progress are two values with separate status.

### Work step by step

1. Render learning cards with due/status/approved percentage.
2. Open progress form and require certificate evidence for completion when applicable.
3. Submit pending request without replacing approved value.

### Acceptance criteria

- Zero/100 and nonstarted/in-progress/completed states are correct.
- Duplicate pending request, same value and invalid percentage are rejected.
- Manager can see submitted request from shared session repository.

### Tests and failure cases

Test invalid ranges, required evidence, pending display and empty assignments.

### Hints

Use existing read API for initial data, session mutation adapter for updates; do not call an unsupported PATCH and ignore 405.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to APP-17; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## APP-18

### Implement approval feedback and rejected-change resubmission

**User story:** As a mobile app user and implementing learner, I want to implement approval feedback and rejected-change resubmission so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | Expo app: setup and complete user experience |
| Suggested location | apps/mobile feature/controller/navigation modules |
| Dependencies | [APP-17](03-expo-app-and-user-journeys.md#app-17), [APP-13](03-expo-app-and-user-journeys.md#app-13), [SDK-15](02-sdk-features.md#sdk-15) |
| Requirement trace | UX-22 |
| Focused estimate | 0.5–1 person-days (six focused hours/day) |
| Coverage gate | 70% on statements, branches, functions and lines; maintain while adding code |

### Learning context

Users need to understand what was approved versus what still needs correction.

### Work step by step

1. Show pending and approved value/evidence distinctly.
2. Display manager rejection reason and allow a corrected submission.
3. Refresh own view when a manager decides a request in the shared session.

### Acceptance criteria

- Rejected changes never overwrite approved records.
- Duplicate active resubmission is blocked.
- Learning status remains separate from approval status/history.

### Tests and failure cases

Test approve/reject/resubmit and preserved approved values across account views.

### Hints

A rejected progress request needs feedback too, not only rejected skills.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to APP-18; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## APP-19

### Implement manager approval inbox and request review

**User story:** As a mobile app user and implementing learner, I want to implement manager approval inbox and request review so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | Expo app: setup and complete user experience |
| Suggested location | apps/mobile feature/controller/navigation modules |
| Dependencies | [APP-16](03-expo-app-and-user-journeys.md#app-16), [SDK-13](02-sdk-features.md#sdk-13), [SDK-15](02-sdk-features.md#sdk-15), [UI-08](01-ui-library-components.md#ui-08) |
| Requirement trace | UX-26 |
| Focused estimate | 1–1.5 person-days (six focused hours/day) |
| Coverage gate | 70% on statements, branches, functions and lines; maintain while adding code |

### Learning context

Manager workflow is a scoped review of proposed changes, not a generic organisation feed.

### Work step by step

1. Render pending direct-report cards with old/proposed values, evidence and submitted date.
2. Implement approve and reject-with-required-reason; prevent double decision.
3. Refresh inbox and associate state, and show no-pending/loading/error states.

### Acceptance criteria

- Never approve own request or unrelated associate.
- Approved decision applies value atomically; rejection preserves prior value.
- Top-level-manager no-reviewer case has explicit guidance instead of silent approval.

### Tests and failure cases

Test unrelated request, self-review, missing reason, duplicate decision and seeded approvals.

### Hints

Read-only API exposes seed inbox; session repository owns interactive decisions.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to APP-19; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## APP-20

### Implement manager associate search and learning assignment

**User story:** As a mobile app user and implementing learner, I want to implement manager associate search and learning assignment so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | Expo app: setup and complete user experience |
| Suggested location | apps/mobile feature/controller/navigation modules |
| Dependencies | [APP-19](03-expo-app-and-user-journeys.md#app-19), [UI-05](01-ui-library-components.md#ui-05), [SDK-14](02-sdk-features.md#sdk-14), [SDK-15](02-sdk-features.md#sdk-15) |
| Requirement trace | UX-27 |
| Focused estimate | 0.5–1.5 person-days (six focused hours/day) |
| Coverage gate | 70% on statements, branches, functions and lines; maintain while adding code |

### Learning context

Resource scope applies to searches and mutations, not only to visible tabs.

### Work step by step

1. Search direct reports by name/organisation ID with pending/no-results states.
2. Show selected associate and catalogue assignment form with due date/instructions.
3. Create session assignment and show success/refreshed associate list.

### Acceptance criteria

- Unrelated people cannot be selected by forged ID.
- Missing/past due date and duplicate active learning are rejected.
- New task is visible to the target associate in current session.

### Tests and failure cases

Test search paging/scope, cancellation, invalid due date and duplicate assignment.

### Hints

Catalogue seniority is useful guidance; document whether mismatch is warning or hard block before implementing policy.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to APP-20; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## APP-21

### Implement admin search, additive role editing and safeguards

**User story:** As a mobile app user and implementing learner, I want to implement admin search, additive role editing and safeguards so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | Expo app: setup and complete user experience |
| Suggested location | apps/mobile feature/controller/navigation modules |
| Dependencies | [APP-16](03-expo-app-and-user-journeys.md#app-16), [SDK-14](02-sdk-features.md#sdk-14), [SDK-15](02-sdk-features.md#sdk-15), [UI-06](01-ui-library-components.md#ui-06) |
| Requirement trace | UX-28 |
| Focused estimate | 1–1.5 person-days (six focused hours/day) |
| Coverage gate | 70% on statements, branches, functions and lines; maintain while adding code |

### Learning context

Application capabilities are independent switches and must remain separate from HR job attributes.

### Work step by step

1. Search organisation and select user.
2. Edit independent Associate/Manager/Admin checkboxes and save with pending feedback.
3. Enforce final-admin/at-least-one-role/manager-direct-report safeguards and update effective tabs.

### Acceptance criteria

- Job title and reporting relationships are not silently rewritten.
- Save/cancel/error states retain a clear current versus proposed selection.
- Revoking own current workspace navigates to remaining allowed route safely.

### Tests and failure cases

Test all role combinations, final admin, no-role user, manager with reports and self-revocation.

### Hints

Do not assume every human must always have associate application permission.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to APP-21; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## APP-22

### Implement account drawer, external portal and full logout UX

**User story:** As a mobile app user and implementing learner, I want to implement account drawer, external portal and full logout UX so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | Expo app: setup and complete user experience |
| Suggested location | apps/mobile feature/controller/navigation modules |
| Dependencies | [APP-16](03-expo-app-and-user-journeys.md#app-16), [UI-12](01-ui-library-components.md#ui-12), [SDK-10](02-sdk-features.md#sdk-10), [SDK-11](02-sdk-features.md#sdk-11) |
| Requirement trace | UX-23–25 |
| Focused estimate | 0.5–1 person-days (six focused hours/day) |
| Coverage gate | 70% on statements, branches, functions and lines; maintain while adding code |

### Learning context

Account menu appearance is reusable UI; its actions and navigation outcome belong to the app.

### Work step by step

1. Compose avatar-adjacent toggle and full-height 60%-width navy glass drawer.
2. Supply One Cognizant external link and Log out actions.
3. On logout await/observe SDK local purge, clear app state/files and reset login route.

### Acceptance criteria

- Toggle/outside/native back dismiss drawer with accessibility and opaque fallback.
- Portal opens approved URL externally.
- Logged-out user cannot return to private routes or reuse prior biometric session.

### Tests and failure cases

Test dismissal variants, external URL action and logout during refresh/network failure.

### Hints

Anchor below measured safe-area/header, not a desktop fixed offset.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to APP-22; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## APP-23

### Implement process-lifecycle reset and account isolation

**User story:** As a mobile app user and implementing learner, I want to implement process-lifecycle reset and account isolation so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | Expo app: setup and complete user experience |
| Suggested location | apps/mobile feature/controller/navigation modules |
| Dependencies | [APP-22](03-expo-app-and-user-journeys.md#app-22), [SDK-15](02-sdk-features.md#sdk-15) |
| Requirement trace | UX-14,25 |
| Focused estimate | 0.5–1 person-days (six focused hours/day) |
| Coverage gate | 70% on statements, branches, functions and lines; maintain while adding code |

### Learning context

Authentication persistence and demo domain persistence intentionally have different lifetimes.

### Work step by step

1. Reset profile/draft/approval/assignment/role overlays on process restart.
2. Keep only eligible app-owned auth credential and validated nonsecret config metadata per agreed policy.
3. Purge previous account private draft/file state on logout/switch and reject late callbacks.

### Acceptance criteria

- Process kill restores seed domain state.
- Switching demo users within the same demo-review session follows documented policy without replaying another identity’s operation.
- Unrelated app storage remains untouched.

### Tests and failure cases

Test kill/relaunch manually, unit-test reset/generation/account boundaries and temporary-file cleanup.

### Hints

The prototype preserves cross-user session overlays to demonstrate approvals; production account switching must not expose another person’s private drafts.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to APP-23; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## APP-24

### Enforce app unit coverage and run accessibility regression checks

**User story:** As a mobile app user and implementing learner, I want to enforce app unit coverage and run accessibility regression checks so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | Expo app: setup and complete user experience |
| Suggested location | apps/mobile feature/controller/navigation modules |
| Dependencies | [APP-15](03-expo-app-and-user-journeys.md#app-15), [APP-18](03-expo-app-and-user-journeys.md#app-18), [APP-19](03-expo-app-and-user-journeys.md#app-19), [APP-20](03-expo-app-and-user-journeys.md#app-20), [APP-21](03-expo-app-and-user-journeys.md#app-21), [APP-22](03-expo-app-and-user-journeys.md#app-22), [FND-04](00-foundations-and-tooling.md#fnd-04) |
| Requirement trace | Coverage 70%,UX-07 |
| Focused estimate | 1–1.5 person-days (six focused hours/day) |
| Coverage gate | 70% on statements, branches, functions and lines; maintain while adding code |

### Learning context

Tests should follow user outcomes and must not only duplicate rendering implementation.

### Work step by step

1. Cover launch/login/onboarding/dashboard/role/menu controller and screen interactions.
2. Enforce 70% statements/branches/functions/lines for all owned app source.
3. Review screen-reader order, keyboard, fonts, reduce motion/transparency and contrast on device.

### Acceptance criteria

- CI fails on any app metric below 70%.
- Critical auth/permission/mandatory-field scenarios are tested even if aggregate percentage would pass without them.
- Native verification gaps are explicitly recorded.

### Tests and failure cases

Demonstrate uncovered branch failure, invalid personal-details Continue and role/logout regressions.

### Hints

A screenshot snapshot alone would not have caught the original Continue bug.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to APP-24; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## APP-25

### Demonstrate complete learner journey and packaged integration

**User story:** As a mobile app user and implementing learner, I want to demonstrate complete learner journey and packaged integration so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | Expo app: setup and complete user experience |
| Suggested location | apps/mobile feature/controller/navigation modules |
| Dependencies | [APP-24](03-expo-app-and-user-journeys.md#app-24), [UI-14](01-ui-library-components.md#ui-14), [SDK-20](02-sdk-features.md#sdk-20), [FND-07](00-foundations-and-tooling.md#fnd-07), [APP-23](03-expo-app-and-user-journeys.md#app-23) |
| Requirement trace | Complete journey |
| Focused estimate | 1–2 person-days (six focused hours/day) |
| Coverage gate | 70% on statements, branches, functions and lines; maintain while adding code |

### Learning context

A learning project is complete when another human can run it and explain its trade-offs.

### Work step by step

1. Run clean install/type/tests, library pack/consumer checks and Expo development builds.
2. Demonstrate first login → three steps → profile/progress → manager decision → admin role update → logout/returning session.
3. Record Android/iOS evidence, tool versions, known limitations and a short teach-back of UI/SDK/app boundaries.

### Acceptance criteria

- All three coverage gates pass and archived demo evidence is reproducible.
- No unsupported backend write, real SSO or pinning capability is claimed implemented without evidence.
- Another learner follows runbook without relying on chat history.

### Tests and failure cases

Use all-role, manager-only, associate-only and admin-only test cases and real-device auth/pinning checks where supported.

### Hints

Keep a local-only distribution route available; actual npm publishing is an optional owner-approved release step.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to APP-25; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.
