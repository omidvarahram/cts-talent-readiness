> Earlier supporting baseline. Use the [current human-learning solution design](../10-human-learning-implementation-plan.md) and [67-story implementation backlog](../../user-stories/README.md) for sequence, estimates and current persistence/coverage requirements.

# Milestones and progress tracking

Durations are intentionally unset until team size, experience and available hours are known. Each milestone produces a runnable increment. Advanced work can be mentor-led but should retain an assessable learner deliverable.

| ID | Outcome | Exit gate | Status |
| --- | --- | --- | --- |
| M01 | Workspace and native build spike | Learners create repository/scripts/config; Android/iOS build; document Metro/native roles | Not started |
| M02 | UI library and seeded screen | Accessible components consumed by app; loading/empty/error gallery | Not started |
| M03 | Mock API, SDK and sign-in | Login → own assignments; package boundary and server authorization tests | Not started |
| M04 | Profile and attachments | Multi-step draft, camera/avatar, CV upload/download; permission handling | Not started |
| M05 | Roles and assignments | Manager dashboard, admin role change, dual-capability journey; object-scope denials | Not started |
| M06 | Progress and offline | Evidence, queue, idempotency, conflict and process-kill recovery | Not started |
| M07 | Security/platform labs | Runtime config, biometric unlock, trusted WebView, pinning and native module | Not started |
| M08 | Quality and distribution | Device accessibility checks, measured bundle improvement, CI and internal release demo | Not started |

## Definition of ready

Issue references FR/NFR IDs, states user outcome and allowed scope, includes mock data needs, acceptance examples, error/offline behaviour and platform considerations. Dependencies and proposed defaults are identified.

## Definition of done

Working behaviour demonstrated on relevant platforms; appropriate tests pass; no secret/PII logging; accessibility states covered; package boundaries preserved; docs and ADRs updated where needed; reviewer can reproduce the demonstration from a clean setup. Security labs must show a rejected case as well as success.

## Issue template

- ID/title:
- Milestone and requirement IDs:
- Owner/reviewer:
- User outcome:
- Scope and dependencies:
- Acceptance examples:
- Failure/offline/permission cases:
- Android/iOS differences:
- Verification evidence:
- Status: backlog / ready / in_progress / review / done / blocked

## Learner progress template

| Learner | Milestone | Deliverable/PR | Demo evidence | Can explain trade-off | Reviewer | Status/blocker |
| --- | --- | --- | --- | --- | --- | --- |
| TBD | M01 | TBD | TBD | Pending | TBD | Not started |

Assess working behaviour and explanation, not just coverage percentages or number of technologies used.
