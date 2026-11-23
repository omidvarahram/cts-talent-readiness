# CTS Talent Readiness — human learning project

Working clone: C:\projects\cts-talent-readiness. Target: React Native phones using Expo development builds. One Git monorepo will contain three product projects: UI library, SDK and app. They have separate module/test/release boundaries; UI/SDK may be published or consumed locally.

## Start with solution design

1. [Current learning solution design](solution-design/10-human-learning-implementation-plan.md): architecture, full UI component list, SDK feature list, app inventory, dependencies and coverage.
2. [Clone/path audit](solution-design/11-clone-audit.md): copied files, fixed path, missing implementation scaffolding and verified API relocation.
3. [Human setup/tooling guide](solution-design/12-setup-and-tooling-guide.md): npm workspaces, TypeScript/testing examples, registry readiness, local packaging and Expo runbook.
4. [Authoritative learning backlog](user-stories/README.md): 67 sequenced stories with context, steps, hints, acceptance, tests, dependencies and estimates.
5. [Screen-by-screen mobile UX](requirements/05-mobile-ui-ux-specification.md) and [clickable prototype](requirements/prototypes/prototype.html).

## Three projects and quality gates

| Project to create | Responsibility | Unit-test coverage: statements/branches/functions/lines |
| --- | --- | --- |
| packages/ui | Controlled reusable React Native components | At least 90% each |
| packages/sdk | Auth classes/manager, HTTP, storage, biometrics, clients, session commands, pinning/config and ports | 100% each |
| apps/mobile | Expo host, composition, environments, navigation and complete user experience | At least 70% each |

The project is for people to implement and understand. This update creates documentation/backlog, not the workspace scaffolding or native application. Existing supporting API/prototype are implemented; their tests do not establish native-project coverage. No registry publication, Git commit or push has been performed.

## Learn in phases

- [Eight foundation stories](user-stories/00-foundations-and-tooling.md) — repo boundaries, npm/TS/tests/CI, local packaging and registry preparation.
- [14 UI stories](user-stories/01-ui-library-components.md) — components/groups with reusable controlled APIs.
- [20 SDK stories](user-stories/02-sdk-features.md) — one shared feature or cohesive capability at a time.
- [25 app stories](user-stories/03-expo-app-and-user-journeys.md) — Expo/platform setup then first launch through every role and logout.

APP-01–03 create an early native test host before SDK pinning/device acceptance. The remaining app UX follows UI/SDK contracts. Estimates and learner pacing are explained in the backlog; do not add archived US estimates.

## Supporting references

- [Read-only API startup/contracts](dummy-backend/API.md), [OpenAPI](dummy-backend/openapi.json), [future write contracts](dummy-backend/write-contracts.md).
- [Auth class/manager contract](solution-design/07-auth-strategy-contract.md), [runtime config](solution-design/08-runtime-configuration.md), [system diagrams](solution-design/09-system-design-and-diagrams.md).
- [Testing policy](solution-design/testing/01-test-strategy.md), [current requirements](requirements/00-current-requirements.md), [data guide](dummy-backend/DB/README.md).

The Node server reads seeds only and does not receive prototype/session mutations. Real SSO, native secure storage/biometrics, hosted HTTPS pinning and production mutation services remain human implementation/integration work. Earlier separate-repository proposals and old stories are marked historical.

## Complete file index

### solution-design

- [01-architecture.md](solution-design/01-architecture.md)
- [02-domain-and-api.md](solution-design/02-domain-and-api.md)
- [03-security.md](solution-design/03-security.md)
- [04-state-and-offline.md](solution-design/04-state-and-offline.md)
- [05-ui-and-sdk.md](solution-design/05-ui-and-sdk.md)
- [06-repositories-and-workstreams.md](solution-design/06-repositories-and-workstreams.md)
- [07-auth-strategy-contract.md](solution-design/07-auth-strategy-contract.md)
- [08-runtime-configuration.md](solution-design/08-runtime-configuration.md)
- [09-system-design-and-diagrams.md](solution-design/09-system-design-and-diagrams.md)
- [10-human-learning-implementation-plan.md](solution-design/10-human-learning-implementation-plan.md)
- [11-clone-audit.md](solution-design/11-clone-audit.md)
- [12-setup-and-tooling-guide.md](solution-design/12-setup-and-tooling-guide.md)
- [decisions/ADR-template.md](solution-design/decisions/ADR-template.md)
- [decisions/README.md](solution-design/decisions/README.md)
- [delivery/01-milestones.md](solution-design/delivery/01-milestones.md)
- [learning/01-curriculum.md](solution-design/learning/01-curriculum.md)
- [references/README.md](solution-design/references/README.md)
- [runtime-config.example.json](solution-design/runtime-config.example.json)
- [testing/01-test-strategy.md](solution-design/testing/01-test-strategy.md)

### requirements

- [00-current-requirements.md](requirements/00-current-requirements.md)
- [01-product-scope.md](requirements/01-product-scope.md)
- [02-functional-requirements.md](requirements/02-functional-requirements.md)
- [03-permissions.md](requirements/03-permissions.md)
- [04-quality-requirements.md](requirements/04-quality-requirements.md)
- [05-mobile-ui-ux-specification.md](requirements/05-mobile-ui-ux-specification.md)
- [inputs/README.md](requirements/inputs/README.md)
- [prototypes/assets-reference.md](requirements/prototypes/assets-reference.md)
- [prototypes/design-guide.md](requirements/prototypes/design-guide.md)
- [prototypes/design-tokens.json](requirements/prototypes/design-tokens.json)
- [prototypes/preview.html](requirements/prototypes/preview.html)
- [prototypes/prototype.html](requirements/prototypes/prototype.html)
- [prototypes/walkthrough.md](requirements/prototypes/walkthrough.md)

### dummy-backend

- [API.md](dummy-backend/API.md)
- [DB/README.md](dummy-backend/DB/README.md)
- [DB/approval_requests.db.json](dummy-backend/DB/approval_requests.db.json)
- [DB/associates.db.json](dummy-backend/DB/associates.db.json)
- [DB/auth_users.db.json](dummy-backend/DB/auth_users.db.json)
- [DB/data-contract.md](dummy-backend/DB/data-contract.md)
- [DB/learning_assignments.db.json](dummy-backend/DB/learning_assignments.db.json)
- [DB/learnings.db.json](dummy-backend/DB/learnings.db.json)
- [DB/skills.db.json](dummy-backend/DB/skills.db.json)
- [README.md](dummy-backend/README.md)
- [generation-reference.md](dummy-backend/generation-reference.md)
- [openapi.json](dummy-backend/openapi.json)
- [package.json](dummy-backend/package.json)
- [server.mjs](dummy-backend/server.mjs)
- [server.test.mjs](dummy-backend/server.test.mjs)
- [write-contracts.md](dummy-backend/write-contracts.md)

### user-stories

- [00-foundations-and-tooling.md](user-stories/00-foundations-and-tooling.md)
- [01-ui-library-components.md](user-stories/01-ui-library-components.md)
- [01-user-stories.md](user-stories/01-user-stories.md)
- [02-detailed-backlog-and-estimates.md](user-stories/02-detailed-backlog-and-estimates.md)
- [02-sdk-features.md](user-stories/02-sdk-features.md)
- [03-expo-app-and-user-journeys.md](user-stories/03-expo-app-and-user-journeys.md)
- [README.md](user-stories/README.md)
- [archive/01-user-stories.md](user-stories/archive/01-user-stories.md)
- [archive/02-detailed-backlog-and-estimates.md](user-stories/archive/02-detailed-backlog-and-estimates.md)
- [archive/README.md](user-stories/archive/README.md)

