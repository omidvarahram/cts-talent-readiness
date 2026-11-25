> Current decisions: [ADR-001 monorepo](ADR-001-monorepo.md), [ADR-002 product defaults](ADR-002-product-defaults.md), and [npm monorepo learning plan](../10-human-learning-implementation-plan.md) supersede the interim three-independent-repository decision and older D01/D03/D06 entries.

> Historical proposal register. The [three-repository plan](../06-repositories-and-workstreams.md), [auth contract](../07-auth-strategy-contract.md), [runtime config contract](../08-runtime-configuration.md) and [current requirements](../../requirements/00-current-requirements.md) override conflicting entries below. D01 is superseded by three independent repositories; D04/D05 by independent additive roles including admin editing; D07 by manager approval; D08 by structured fixtures; D09 by session-only domain persistence; D11/D14 by configurable strategy classes and dummy company SSO.

# Decisions, assumptions and open questions

All entries start proposed. Confirmed user requirements are documented separately; these defaults must not silently become product policy.

| ID | Decision/question | Initial proposal | Reason/impact |
| --- | --- | --- | --- |
| D01 | Workspace vs multiple repos | npm workspace; preserve independent package boundaries | Simpler local learning; separate repos possible later |
| D02 | Native workflow | Expo development builds | Custom native work requires own binary |
| D03 | Manager visibility | Explicit managed-associate scope | User's 'every associate' may mean global; confirm |
| D04 | Multi-role identity | Associate base + manager/admin capabilities | Supports simultaneous learner and manager |
| D05 | Admin provisioning | Seed admins; admin may grant/revoke manager only | Admin creation UI not requested |
| D06 | Hierarchy | Explicit relationships, no cycles/self-management | Confirm multiple-manager requirement |
| D07 | Assignment completion | Self-report; required evidence uploaded first | Approval workflow not specified |
| D08 | Profile fields and files | Minimal fields, image/PDF evidence, provisional limits | Await actual mock data and prototypes |
| D09 | Offline scope | Own cache/drafts/progress only | Restricts complexity and private team caching |
| D10 | Libraries/versions | Select after compatibility spike | Avoid premature framework commitment |
| D11 | Identity | Mock credential/session service | Production SSO explicitly outside first build |
| D12 | Schedule | Milestone gates without dates | Need team size/hours and hardware availability |
| D13 | Data lifecycle | Synthetic only; resettable fixtures | Retention, export and cleanup policies pending |
| D14 | WebView use case | Embedded training completion exercise | Business content and hosting pending |
| D15 | Native module | Build metadata + haptics | Small useful cross-platform lab |
| D16 | Devices, CI and distribution | Android/iOS targets to be named | Need Mac/build service and real biometric devices |

When a choice is accepted, add an ADR, record owner/date and link it here. Revisit requirements/tests when the choice changes.
