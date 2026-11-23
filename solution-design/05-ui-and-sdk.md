> Superseded on repository/work planning: use the [current monorepo learning solution design](10-human-learning-implementation-plan.md) and [human backlog](../user-stories/README.md). Three separate repositories and old US estimates below are historical. Technical contracts still apply where they do not conflict.

> Detailed current ownership: [repository/work-stream map](06-repositories-and-workstreams.md), [auth API](07-auth-strategy-contract.md), [runtime configuration](08-runtime-configuration.md). These replace conflicting initial proposals below.

> Initial design baseline. Where behaviour differs, [current agreed requirements](../requirements/00-current-requirements.md) take precedence.

# UI library, SDK and native work

## Small RN component library

Start with Button, TextField, FormField, Card, ProgressIndicator and ScreenState. Add tokens for colour, spacing, typography and touch targets. Components cover disabled/loading/error states, labels, focus, scalable text and platform differences. Compose a profile step and assignment card in the app to prove reuse. Avoid embedding auth, API calls or domain policy in generic components.

Document props, examples and accessibility behaviour. Add a local component-gallery screen initially; a full component explorer is optional. Publish/package an internal prerelease or demonstrate npm pack consumption from a clean sample app. Use peer dependencies appropriately to avoid duplicate React/RN installations.

## TypeScript SDK

Expose operations such as auth.signIn, profiles.getMine/updateMine, assignments.listMine/updateProgress and files.upload/download. Keep transport DTOs distinct from domain models; validate untrusted responses. Support cancellation, timeouts, paginated results, typed domain errors and correlation IDs. Inject transport, token provider, clock and storage rather than importing native globals.

Token refresh orchestration belongs to one clearly designated auth service; avoid implementing competing refresh loops in SDK and UI. Retry only operations with safe semantics or an idempotency contract. UI translates typed errors into accessible user messages.

Use explicit public exports and side-effect-free modules; test SDK consumption outside RN with Node-based tests. Avoid exporting the whole application or depending on navigation/UI packages. Document package versioning, changelog and compatibility with API/contract versions.

## Native bridge exercise

Implement a small training utility: get platform application/build metadata and request a native haptic acknowledgement where supported. Provide a typed Promise interface, Android implementation, iOS implementation, unsupported-case handling and error mapping. Inspect thread/lifecycle concerns; add cleanup if extending to event listeners. Avoid device identifiers and permission-heavy capabilities without a business reason.

Choose Expo Modules API or the selected RN native-module approach after a build compatibility spike. Camera and biometrics initially use maintained platform libraries; the custom module is an explicit learning deliverable. Teach Swift/Kotlin basics, native dependency changes requiring a new binary, and the difference between JS-to-native calls and WebView messaging.

## Bundle and performance exercise

Capture release JS bundle, native binary and assets separately. Use the selected Metro/Expo version's supported analysis workflow and source maps; record tooling/version in an ADR. Compare baseline and a controlled dependency/asset change. Tree shaking support depends on toolchain and module format; verify output rather than promising automatic removal. Measure effects of barrel exports, side effects, image dimensions/compression, large dependencies, list virtualization and expensive renders. A dynamic import does not automatically prove smaller initial native delivery. Preserve readability unless measurements justify optimization.
