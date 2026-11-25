# Human learning backlog: start from the beginning

This is the authoritative backlog. It replaces the earlier US-01–US-32 feature-first estimate. The existing Git repository is already created/cloned; FND-01 reviews that fact and defines a monorepo, rather than instructing learners to create duplicate remotes. The three projects are workspaces with separate package boundaries and coverage targets.

## Read first

1. [Migration audit](../solution-design/11-clone-audit.md).
2. [Learning solution design and complete inventories](../solution-design/10-human-learning-implementation-plan.md).
3. [Mobile screen specification](./05-mobile-ui-ux-specification.md).
4. Work through the phases below; each story contains steps, context, hints, tests and a teach-back.

## Learning phases

| Phase | Stories | Focused effort |
| --- | --- | --- |
| [Foundations, monorepo and distribution](00-foundations-and-tooling.md) | 8 | 7.5–13 person-days |
| [UI library: component-by-component](01-ui-library-components.md) | 14 | 12.5–22 person-days |
| [SDK: feature-by-feature](02-sdk-features.md) | 20 | 20–37.5 person-days |
| [Expo app: setup and complete user experience](03-expo-app-and-user-journeys.md) | 25 | 19–35 person-days |
| Total | 67 | 59–107.5 person-days |

Estimates are six-hour focused days for someone familiar with the toolchain, including implementation and local tests/review. For active learners, initially allow roughly 1.5–2 times the focused effort and recalibrate after the foundation and first component stories; that is a planning allowance, not a promised delivery date. Environment/account/certificate delays and access to a Mac/device are additional. Do not add the old US-story estimates to this new total. Shared component/SDK work is charged in its own phase; app stories primarily cover composition/UX.

## Dependency order and checkpoints

- FND-01–08: root/toolchain/TypeScript/tests/CI/local-pack/registry preparation.
- UI-01–14: reusable component groups and gallery; maintain 90% coverage from the first component.
- Start APP-01–03 early as the minimal Expo/native test host. This is a deliberate exception to the headline phase order: SDK-17 pinning requires a real development client and SDK wrappers need device verification. These app setup stories do not depend on completed SDK/UI features.
- SDK-01–20: core contracts, transport, storage/biometrics, strategy classes/manager, clients/session mutations and config/pinning; maintain 100%.
- APP-04–25: wire services and implement launch → login/activate/restore → onboarding → profile → manager/admin → drawer/logout/reset; maintain 70%.
- UI-14, SDK-20 and APP-25 close the respective package/device/demo gates. A blocked native gate remains explicitly blocked, not completed because mocks pass.

## Coverage and review policy

SDK 100%, UI 90%, app 70% apply separately to statements, branches, functions and lines. See [test strategy](../solution-design/testing/01-test-strategy.md). Use unit tests for owned code and device checks for OS behaviour. Coverage is required but not evidence that a native prompt, security trust or user journey is correct.

No new source package, registry account, publication or Expo environment has been created by this backlog rewrite. Humans perform the tasks, explain the concepts and retain evidence. The existing read-only server/prototype remain usable supporting references.

## Distribution outcomes

Local npm workspaces are the default development path. npm pack plus a clean consumer proves publishability without registry access. Registry stories prepare owned scope, manifests, visibility, authentication and human-controlled release; actual publication is optional for the dummy project. A separate registry server is not a prerequisite.

## Historical backlog

Earlier stories are preserved under [archive](archive/README.md) for context. Their estimates and three-independent-repository assumption are superseded. New IDs are FND-, UI-, SDK- and APP- to make implementation order and ownership clear.
