# CTS Talent Readiness — human learning project

Local-first React Native (Expo development builds) learning monorepo: UI library, SDK and mobile app, plus a read-only dummy API.

## Repository layout

| Path | Role |
| --- | --- |
| [apps/](apps/) | Expo mobile app (`talent-mobile`) |
| [packages/](packages/) | `@cts-talent/ui`, `@cts-talent/sdk` |
| [dummy-backend/](dummy-backend/) | Read-only fixture API |
| [docs/](docs/) | All requirements, solution design, backlog and reviews |
| Project files | `package.json`, lockfile, TS/ESLint/Prettier, CI |

## Start here

1. **[Design and security evaluation](docs/design-and-security-evaluation.md)** — gaps, UX issues, security findings, implementation quality and alternatives (read this before treating the app as “production-shaped”).
2. [Docs index](docs/README.md)
3. [Learning solution design](docs/solution-design/10-human-learning-implementation-plan.md)
4. [Authoritative backlog](docs/user-stories/README.md)
5. [Current requirements](docs/requirements/00-current-requirements.md) and [prototype](docs/requirements/prototypes/prototype.html)

Product defaults: [ADR-001 monorepo](docs/solution-design/decisions/ADR-001-monorepo.md), [ADR-002 permissions/approvals](docs/solution-design/decisions/ADR-002-product-defaults.md).

## Quality gates

| Workspace | Coverage |
| --- | --- |
| `@cts-talent/sdk` | 100% |
| `@cts-talent/ui` | ≥90% |
| `talent-mobile` | ≥70% |

Mutations are **session-only** behind write-contract-shaped SDK APIs. Local HTTP is a **lab transport**; certificate pinning is not satisfied by the dummy API. See [sensitivity matrix](docs/sensitivity-matrix.md) and [platform runbook](docs/mobile/platform-runbook.md).

```bash
export NODE_OPTIONS=--use-system-ca   # if corporate TLS interception breaks npm
npm ci
npm run typecheck
npm run test:coverage
npm start --workspace talent-readiness-dummy-api
npm start --workspace talent-mobile
```

## Learn in phases

- [Foundations](docs/user-stories/00-foundations-and-tooling.md)
- [UI library](docs/user-stories/01-ui-library-components.md)
- [SDK](docs/user-stories/02-sdk-features.md)
- [Expo app journeys](docs/user-stories/03-expo-app-and-user-journeys.md)

APP-01–03 create an early native host because pinning/device checks need a development client. Full file indexes live under [docs/](docs/).
