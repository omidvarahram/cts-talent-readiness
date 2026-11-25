# Documentation

All product documentation lives under `docs/`. Repository root keeps only project files, `apps/`, `packages/`, and `dummy-backend/`.

## Start here

1. **[Design and security evaluation](design-and-security-evaluation.md)** — architect review of gaps, UX issues, security findings, implementation quality and learning-oriented alternatives.
2. [Learning solution design](solution-design/10-human-learning-implementation-plan.md) — authoritative monorepo plan and inventories.
3. [Current requirements](requirements/00-current-requirements.md) — product behaviour that wins when older drafts conflict.
4. [Human backlog](user-stories/README.md) — 67 sequenced stories.
5. [Mobile UX specification](requirements/05-mobile-ui-ux-specification.md) and [prototype](requirements/prototypes/prototype.html).

## Layout

| Path | Contents |
| --- | --- |
| [requirements/](requirements/) | Scope, functional/NFR, permissions, UX, prototypes |
| [solution-design/](solution-design/) | Architecture, security, auth, config, diagrams, ADRs, testing |
| [user-stories/](user-stories/) | Authoritative learning backlog (+ archive) |
| [mobile/platform-runbook.md](mobile/platform-runbook.md) | Expo/Android/iOS lab notes |
| [setup-baseline.md](setup-baseline.md) | Toolchain checkpoint |
| [release-workflow.md](release-workflow.md) | Registry readiness (no auto-publish) |
| [sensitivity-matrix.md](sensitivity-matrix.md) | What may be cached / secured / never stored |

Supporting API docs remain next to the server: [`../dummy-backend/`](../dummy-backend/).
