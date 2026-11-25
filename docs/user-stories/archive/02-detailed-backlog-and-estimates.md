> Archived baseline: superseded by the [human learning backlog](../../README.md). Old US IDs and estimates are historical, not additive to the new plan.

# Detailed implementation backlog and estimates

Status: planning estimates, 23 November 2026. Native app/package implementation is still backlog. US-29 is the implemented read-only backend baseline.

## Estimation assumptions

One person-day means six focused engineering hours by an experienced TypeScript/React Native developer. Estimates include implementation, focused tests and a review/demo pass. Excluded: enterprise identity registration, certificate hosting, signing/device procurement, design rework, external security review and production backend writes. Effort ranges are not calendar commitments.

UI work is charged once to US-23. SDK auth/platform/network/mock work is charged to the SDK stories. App feature stories cover composition and integration only. US-20 owns approval read mapping, US-31 mutable session workflows, US-30 typed API clients and US-28 transport/config. Do not add full supporting-package effort again to each app story.

## Remaining effort by stream

| Stream | Person-days |
| --- | --- |
| App | 24–44 |
| SDK | 18–29.5 |
| UI | 8–12 |
| Backend support | 0–0 |
| Total | 50–85.5 |

With a 20% native/platform planning reserve: 60.0–102.6 person-days. Parallel execution depends on contract readiness and review/device capacity. Production mutation services and live enterprise SSO onboarding require separate estimates.

## Story index

| ID | Owner | Outcome | Person-days | Dependencies |
| --- | --- | --- | --- | --- |
| [US-01](#us-01) | App | Activate account | 1–2 | US-24, US-30 |
| [US-02](#us-02) | App | Log in and unlock | 1–2 | US-24, US-25 |
| [US-03](#us-03) | App | Complete personal details | 1.5–2.5 | US-23, US-31 |
| [US-04](#us-04) | App | Navigate and pause onboarding | 1–2 | US-03 |
| [US-05](#us-05) | App | Submit skill experience | 1.5–2.5 | US-17, US-18, US-31 |
| [US-06](#us-06) | App | Manage CV | 1–2 | US-23, US-31 |
| [US-07](#us-07) | App | Edit a single-page dashboard | 1.5–2.5 | US-03, US-06, US-17 |
| [US-08](#us-08) | App | Request learning progress change | 1–2 | US-31 |
| [US-09](#us-09) | App | Review approval inbox | 1.5–2.5 | US-31, US-14 |
| [US-10](#us-10) | App | Revise rejected changes | 1–1.5 | US-08, US-09 |
| [US-11](#us-11) | App | Find direct reports and assign learning | 1.5–2.5 | US-31, US-14 |
| [US-12](#us-12) | App | Edit application roles | 1–2 | US-31, US-14 |
| [US-13](#us-13) | App | Protect role and manager integrity | 0.5–1 | US-12 |
| [US-14](#us-14) | App | Navigate permitted workspaces | 1–2 | US-23, US-24 |
| [US-15](#us-15) | App | Reset app-session domain data | 0.5–1 | US-31, US-25 |
| [US-16](#us-16) | App | Use accessible screen journeys | 2–3 | US-07, US-09, US-12, US-23 |
| [US-17](#us-17) | App | Read structured skills table | 0.5–1 | US-23, US-29 |
| [US-18](#us-18) | App | Reveal add-skill form on demand | 0.5–1 | US-17 |
| [US-19](#us-19) | App | Validate skill submission | 0.5–1 | US-05 |
| [US-20](#us-20) | SDK | Read scoped seeded approvals | 0.5–1 | US-29 |
| [US-21](#us-21) | App | Open translucent account drawer | 0.5–1 | US-23 |
| [US-22](#us-22) | App | Integrate logout UX | 0.5–1 | US-26, US-21 |
| [US-23](#us-23) | UI | Deliver reusable component library | 8–12 | None |
| [US-24](#us-24) | SDK | Configure TypeScript auth strategies | 4–6 | None |
| [US-25](#us-25) | SDK | Restore secure biometric-gated session | 3–5 | US-24 |
| [US-26](#us-26) | SDK | Terminate sessions without races | 2–3 | US-24, US-25 |
| [US-27](#us-27) | App | Apply allowed hosted settings | 1–2 | US-28 |
| [US-28](#us-28) | SDK | Load config through pinned transport | 4–7 | None |
| [US-29](#us-29) | Backend support | Consume documented read-only REST API | 0–0 | None |
| [US-30](#us-30) | SDK | Integrate read API client | 1.5–2.5 | US-29, US-24 |
| [US-31](#us-31) | SDK | Implement session-only domain repositories | 3–5 | US-29 |
| [US-32](#us-32) | App | Integrate and release phone builds | 2–4 | US-16, US-22, US-27 |

## US-01

**Activate account**

As a associate, I want to activate account so that the mobile journey has clear feedback and consistent state.

| Planning field | Detail |
| --- | --- |
| Owner | App stream |
| Status | Backlog; native implementation not started |
| Requirement trace | UX-11 |
| Dependencies | US-24, US-30 |
| Estimate | 1–2 person-days |
| Deliverable | App feature/controller/navigation slice using UI and SDK |

### Acceptance criteria

1. Matching email and string ID proceeds to company authentication.
2. Empty, invalid or mismatched identity shows an actionable error without losing inputs.

### Failure cases and verification

Empty fields, malformed ID, mismatch and cancelled SSO.

Verification: screen/controller interaction tests plus a focused native end-to-end demonstration. Use relevant fictional identities: Alex (all roles), Sophie (manager+associate), Grace (manager-only), Noah (associate-only). Add an admin-only runtime fixture for the role-matrix test; current seeds have no admin-only user.

### Completion gate

Changes reference this story and its requirement IDs; relevant checks pass; package boundaries remain intact; errors are user-visible; no credentials or private files enter logs; documentation and reproducible demo steps are updated. The estimate covers this owner’s slice; prerequisites supply supporting behaviour.

## US-02

**Log in and unlock**

As a returning user, I want to log in and unlock so that the mobile journey has clear feedback and consistent state.

| Planning field | Detail |
| --- | --- |
| Owner | App stream |
| Status | Backlog; native implementation not started |
| Requirement trace | UX-09–13 |
| Dependencies | US-24, US-25 |
| Estimate | 1–2 person-days |
| Deliverable | App feature/controller/navigation slice using UI and SDK |

### Acceptance criteria

1. Stack equal full-width login actions.
2. Map biometric cancel/unavailable/expiry to the correct fallback without navigation loops.

### Failure cases and verification

No enrollment, lockout, cancelled unlock, expired token and provider failure.

Verification: screen/controller interaction tests plus a focused native end-to-end demonstration. Use relevant fictional identities: Alex (all roles), Sophie (manager+associate), Grace (manager-only), Noah (associate-only). Add an admin-only runtime fixture for the role-matrix test; current seeds have no admin-only user.

### Completion gate

Changes reference this story and its requirement IDs; relevant checks pass; package boundaries remain intact; errors are user-visible; no credentials or private files enter logs; documentation and reproducible demo steps are updated. The estimate covers this owner’s slice; prerequisites supply supporting behaviour.

## US-03

**Complete personal details**

As a associate, I want to complete personal details so that the mobile journey has clear feedback and consistent state.

| Planning field | Detail |
| --- | --- |
| Owner | App stream |
| Status | Backlog; native implementation not started |
| Requirement trace | UX-15 |
| Dependencies | US-23, US-31 |
| Estimate | 1.5–2.5 person-days |
| Deliverable | App feature/controller/navigation slice using UI and SDK |

### Acceptance criteria

1. Name, phone and address are required; invalid Continue stays on the step with inline feedback.
2. Organisation ID, email, manager, job title, location and staffing status remain visible/read-only.

### Failure cases and verification

Whitespace-only required values, picker cancellation and read-only field tampering.

Verification: screen/controller interaction tests plus a focused native end-to-end demonstration. Use relevant fictional identities: Alex (all roles), Sophie (manager+associate), Grace (manager-only), Noah (associate-only). Add an admin-only runtime fixture for the role-matrix test; current seeds have no admin-only user.

### Completion gate

Changes reference this story and its requirement IDs; relevant checks pass; package boundaries remain intact; errors are user-visible; no credentials or private files enter logs; documentation and reproducible demo steps are updated. The estimate covers this owner’s slice; prerequisites supply supporting behaviour.

## US-04

**Navigate and pause onboarding**

As a first-time user, I want to navigate and pause onboarding so that the mobile journey has clear feedback and consistent state.

| Planning field | Detail |
| --- | --- |
| Owner | App stream |
| Status | Backlog; native implementation not started |
| Requirement trace | UX-14–15 |
| Dependencies | US-03 |
| Estimate | 1–2 person-days |
| Deliverable | App feature/controller/navigation slice using UI and SDK |

### Acceptance criteria

1. Back and Continue preserve accepted inputs and current timeline state.
2. Save and exit preserves an incomplete session draft and offers Resume without logging out.

### Failure cases and verification

Back with draft, pause incomplete step, resume step two/three and process restart.

Verification: screen/controller interaction tests plus a focused native end-to-end demonstration. Use relevant fictional identities: Alex (all roles), Sophie (manager+associate), Grace (manager-only), Noah (associate-only). Add an admin-only runtime fixture for the role-matrix test; current seeds have no admin-only user.

### Completion gate

Changes reference this story and its requirement IDs; relevant checks pass; package boundaries remain intact; errors are user-visible; no credentials or private files enter logs; documentation and reproducible demo steps are updated. The estimate covers this owner’s slice; prerequisites supply supporting behaviour.

## US-05

**Submit skill experience**

As a associate, I want to submit skill experience so that the mobile journey has clear feedback and consistent state.

| Planning field | Detail |
| --- | --- |
| Owner | App stream |
| Status | Backlog; native implementation not started |
| Requirement trace | UX-17 |
| Dependencies | US-17, US-18, US-31 |
| Estimate | 1.5–2.5 person-days |
| Deliverable | App feature/controller/navigation slice using UI and SDK |

### Acceptance criteria

1. Submit title, expertise, experience, description, last-used date and optional evidence.
2. Create pending request while preserving already approved data.

### Failure cases and verification

Duplicate pending skill, invalid evidence and missing reviewer.

Verification: screen/controller interaction tests plus a focused native end-to-end demonstration. Use relevant fictional identities: Alex (all roles), Sophie (manager+associate), Grace (manager-only), Noah (associate-only). Add an admin-only runtime fixture for the role-matrix test; current seeds have no admin-only user.

### Completion gate

Changes reference this story and its requirement IDs; relevant checks pass; package boundaries remain intact; errors are user-visible; no credentials or private files enter logs; documentation and reproducible demo steps are updated. The estimate covers this owner’s slice; prerequisites supply supporting behaviour.

## US-06

**Manage CV**

As a associate, I want to manage CV so that the mobile journey has clear feedback and consistent state.

| Planning field | Detail |
| --- | --- |
| Owner | App stream |
| Status | Backlog; native implementation not started |
| Requirement trace | UX-18 |
| Dependencies | US-23, US-31 |
| Estimate | 1–2 person-days |
| Deliverable | App feature/controller/navigation slice using UI and SDK |

### Acceptance criteria

1. Select/view/replace/remove PDF or explicitly skip CV.
2. Valid completion opens a permitted dashboard workspace.

### Failure cases and verification

Wrong file type/size, remove/replace, skip unchecked without file and picker cancellation.

Verification: screen/controller interaction tests plus a focused native end-to-end demonstration. Use relevant fictional identities: Alex (all roles), Sophie (manager+associate), Grace (manager-only), Noah (associate-only). Add an admin-only runtime fixture for the role-matrix test; current seeds have no admin-only user.

### Completion gate

Changes reference this story and its requirement IDs; relevant checks pass; package boundaries remain intact; errors are user-visible; no credentials or private files enter logs; documentation and reproducible demo steps are updated. The estimate covers this owner’s slice; prerequisites supply supporting behaviour.

## US-07

**Edit a single-page dashboard**

As a associate, I want to edit a single-page dashboard so that the mobile journey has clear feedback and consistent state.

| Planning field | Detail |
| --- | --- |
| Owner | App stream |
| Status | Backlog; native implementation not started |
| Requirement trace | UX-20 |
| Dependencies | US-03, US-06, US-17 |
| Estimate | 1.5–2.5 person-days |
| Deliverable | App feature/controller/navigation slice using UI and SDK |

### Acceptance criteria

1. Show profile, skills, CV and learning in one scrollable page.
2. Save validates; Cancel restores saved values; immutable fields cannot change.

### Failure cases and verification

Invalid save, cancel dirty edits and profile query failure.

Verification: screen/controller interaction tests plus a focused native end-to-end demonstration. Use relevant fictional identities: Alex (all roles), Sophie (manager+associate), Grace (manager-only), Noah (associate-only). Add an admin-only runtime fixture for the role-matrix test; current seeds have no admin-only user.

### Completion gate

Changes reference this story and its requirement IDs; relevant checks pass; package boundaries remain intact; errors are user-visible; no credentials or private files enter logs; documentation and reproducible demo steps are updated. The estimate covers this owner’s slice; prerequisites supply supporting behaviour.

## US-08

**Request learning progress change**

As a associate, I want to request learning progress change so that the mobile journey has clear feedback and consistent state.

| Planning field | Detail |
| --- | --- |
| Owner | App stream |
| Status | Backlog; native implementation not started |
| Requirement trace | UX-21 |
| Dependencies | US-31 |
| Estimate | 1–2 person-days |
| Deliverable | App feature/controller/navigation slice using UI and SDK |

### Acceptance criteria

1. Show approved percentage separately from proposed percentage.
2. Block duplicate pending changes and require completion evidence when applicable.

### Failure cases and verification

Same value, out-of-range percentage, missing required certificate and duplicate pending update.

Verification: screen/controller interaction tests plus a focused native end-to-end demonstration. Use relevant fictional identities: Alex (all roles), Sophie (manager+associate), Grace (manager-only), Noah (associate-only). Add an admin-only runtime fixture for the role-matrix test; current seeds have no admin-only user.

### Completion gate

Changes reference this story and its requirement IDs; relevant checks pass; package boundaries remain intact; errors are user-visible; no credentials or private files enter logs; documentation and reproducible demo steps are updated. The estimate covers this owner’s slice; prerequisites supply supporting behaviour.

## US-09

**Review approval inbox**

As a manager, I want to review approval inbox so that the mobile journey has clear feedback and consistent state.

| Planning field | Detail |
| --- | --- |
| Owner | App stream |
| Status | Backlog; native implementation not started |
| Requirement trace | UX-26 |
| Dependencies | US-31, US-14 |
| Estimate | 1.5–2.5 person-days |
| Deliverable | App feature/controller/navigation slice using UI and SDK |

### Acceptance criteria

1. Show only designated direct-report requests with prior/proposed data and evidence.
2. Approve applies values; reject requires reason; never approve own request.

### Failure cases and verification

Unrelated associate request, self-approval, duplicate decision and missing rejection reason.

Verification: screen/controller interaction tests plus a focused native end-to-end demonstration. Use relevant fictional identities: Alex (all roles), Sophie (manager+associate), Grace (manager-only), Noah (associate-only). Add an admin-only runtime fixture for the role-matrix test; current seeds have no admin-only user.

### Completion gate

Changes reference this story and its requirement IDs; relevant checks pass; package boundaries remain intact; errors are user-visible; no credentials or private files enter logs; documentation and reproducible demo steps are updated. The estimate covers this owner’s slice; prerequisites supply supporting behaviour.

## US-10

**Revise rejected changes**

As a associate, I want to revise rejected changes so that the mobile journey has clear feedback and consistent state.

| Planning field | Detail |
| --- | --- |
| Owner | App stream |
| Status | Backlog; native implementation not started |
| Requirement trace | UX-22 |
| Dependencies | US-08, US-09 |
| Estimate | 1–1.5 person-days |
| Deliverable | App feature/controller/navigation slice using UI and SDK |

### Acceptance criteria

1. Show rejection feedback and keep approved values intact.
2. A corrected submission creates a new pending state without duplicating active requests.

### Failure cases and verification

Rejected versus already pending state, resubmission and old approved value integrity.

Verification: screen/controller interaction tests plus a focused native end-to-end demonstration. Use relevant fictional identities: Alex (all roles), Sophie (manager+associate), Grace (manager-only), Noah (associate-only). Add an admin-only runtime fixture for the role-matrix test; current seeds have no admin-only user.

### Completion gate

Changes reference this story and its requirement IDs; relevant checks pass; package boundaries remain intact; errors are user-visible; no credentials or private files enter logs; documentation and reproducible demo steps are updated. The estimate covers this owner’s slice; prerequisites supply supporting behaviour.

## US-11

**Find direct reports and assign learning**

As a manager, I want to find direct reports and assign learning so that the mobile journey has clear feedback and consistent state.

| Planning field | Detail |
| --- | --- |
| Owner | App stream |
| Status | Backlog; native implementation not started |
| Requirement trace | UX-27 |
| Dependencies | US-31, US-14 |
| Estimate | 1.5–2.5 person-days |
| Deliverable | App feature/controller/navigation slice using UI and SDK |

### Acceptance criteria

1. Search name/ID within direct reports and display empty results.
2. Assign catalogue learning with required valid due date; reject duplicate active assignment.

### Failure cases and verification

No results, unrelated ID, missing/past due date and duplicate active learning.

Verification: screen/controller interaction tests plus a focused native end-to-end demonstration. Use relevant fictional identities: Alex (all roles), Sophie (manager+associate), Grace (manager-only), Noah (associate-only). Add an admin-only runtime fixture for the role-matrix test; current seeds have no admin-only user.

### Completion gate

Changes reference this story and its requirement IDs; relevant checks pass; package boundaries remain intact; errors are user-visible; no credentials or private files enter logs; documentation and reproducible demo steps are updated. The estimate covers this owner’s slice; prerequisites supply supporting behaviour.

## US-12

**Edit application roles**

As a admin, I want to edit application roles so that the mobile journey has clear feedback and consistent state.

| Planning field | Detail |
| --- | --- |
| Owner | App stream |
| Status | Backlog; native implementation not started |
| Requirement trace | UX-28 |
| Dependencies | US-31, US-14 |
| Estimate | 1–2 person-days |
| Deliverable | App feature/controller/navigation slice using UI and SDK |

### Acceptance criteria

1. Search organisation and edit independent role checkboxes.
2. Save effective roles without changing job title or manager relationships.

### Failure cases and verification

Read-only job title and invalid role update, stale identity and lost admin access.

Verification: screen/controller interaction tests plus a focused native end-to-end demonstration. Use relevant fictional identities: Alex (all roles), Sophie (manager+associate), Grace (manager-only), Noah (associate-only). Add an admin-only runtime fixture for the role-matrix test; current seeds have no admin-only user.

### Completion gate

Changes reference this story and its requirement IDs; relevant checks pass; package boundaries remain intact; errors are user-visible; no credentials or private files enter logs; documentation and reproducible demo steps are updated. The estimate covers this owner’s slice; prerequisites supply supporting behaviour.

## US-13

**Protect role and manager integrity**

As a admin, I want to protect role and manager integrity so that the mobile journey has clear feedback and consistent state.

| Planning field | Detail |
| --- | --- |
| Owner | App stream |
| Status | Backlog; native implementation not started |
| Requirement trace | UX-28 |
| Dependencies | US-12 |
| Estimate | 0.5–1 person-days |
| Deliverable | App feature/controller/navigation slice using UI and SDK |

### Acceptance criteria

1. Protect final active admin and at least one role per user.
2. Refuse manager removal while direct reports remain; show resolution guidance.

### Failure cases and verification

Final admin, no roles and manager with direct reports.

Verification: screen/controller interaction tests plus a focused native end-to-end demonstration. Use relevant fictional identities: Alex (all roles), Sophie (manager+associate), Grace (manager-only), Noah (associate-only). Add an admin-only runtime fixture for the role-matrix test; current seeds have no admin-only user.

### Completion gate

Changes reference this story and its requirement IDs; relevant checks pass; package boundaries remain intact; errors are user-visible; no credentials or private files enter logs; documentation and reproducible demo steps are updated. The estimate covers this owner’s slice; prerequisites supply supporting behaviour.

## US-14

**Navigate permitted workspaces**

As a multi-role user, I want to navigate permitted workspaces so that the mobile journey has clear feedback and consistent state.

| Planning field | Detail |
| --- | --- |
| Owner | App stream |
| Status | Backlog; native implementation not started |
| Requirement trace | UX-05 |
| Dependencies | US-23, US-24 |
| Estimate | 1–2 person-days |
| Deliverable | App feature/controller/navigation slice using UI and SDK |

### Acceptance criteria

1. Additive granted tabs only; support associate-only, manager-only and admin-only route fixtures.
2. Role revocation invalidates inaccessible routes and updates visible workspace safely.

### Failure cases and verification

All seven nonempty role combinations and protected deep-link/back navigation after revocation.

Verification: screen/controller interaction tests plus a focused native end-to-end demonstration. Use relevant fictional identities: Alex (all roles), Sophie (manager+associate), Grace (manager-only), Noah (associate-only). Add an admin-only runtime fixture for the role-matrix test; current seeds have no admin-only user.

### Completion gate

Changes reference this story and its requirement IDs; relevant checks pass; package boundaries remain intact; errors are user-visible; no credentials or private files enter logs; documentation and reproducible demo steps are updated. The estimate covers this owner’s slice; prerequisites supply supporting behaviour.

## US-15

**Reset app-session domain data**

As a demo user, I want to reset app-session domain data so that the mobile journey has clear feedback and consistent state.

| Planning field | Detail |
| --- | --- |
| Owner | App stream |
| Status | Backlog; native implementation not started |
| Requirement trace | UX-14 |
| Dependencies | US-31, US-25 |
| Estimate | 0.5–1 person-days |
| Deliverable | App feature/controller/navigation slice using UI and SDK |

### Acceptance criteria

1. Process restart resets domain mutations/onboarding to fixtures while preserving eligible auth material.
2. Account switching isolates drafts and no old mutation replays as another user.

### Failure cases and verification

Kill/relaunch, logout and cross-account draft/file isolation.

Verification: screen/controller interaction tests plus a focused native end-to-end demonstration. Use relevant fictional identities: Alex (all roles), Sophie (manager+associate), Grace (manager-only), Noah (associate-only). Add an admin-only runtime fixture for the role-matrix test; current seeds have no admin-only user.

### Completion gate

Changes reference this story and its requirement IDs; relevant checks pass; package boundaries remain intact; errors are user-visible; no credentials or private files enter logs; documentation and reproducible demo steps are updated. The estimate covers this owner’s slice; prerequisites supply supporting behaviour.

## US-16

**Use accessible screen journeys**

As a mobile user, I want to use accessible screen journeys so that the mobile journey has clear feedback and consistent state.

| Planning field | Detail |
| --- | --- |
| Owner | App stream |
| Status | Backlog; native implementation not started |
| Requirement trace | UX-01–07 |
| Dependencies | US-07, US-09, US-12, US-23 |
| Estimate | 2–3 person-days |
| Deliverable | App feature/controller/navigation slice using UI and SDK |

### Acceptance criteria

1. Check TalkBack/VoiceOver, scaling, keyboard, safe areas and native back.
2. Validate focus and reduced-motion/transparency behaviour on both platforms.

### Failure cases and verification

Large fonts, screen reader focus, keyboard overlap and reduced motion/transparency.

Verification: screen/controller interaction tests plus a focused native end-to-end demonstration. Use relevant fictional identities: Alex (all roles), Sophie (manager+associate), Grace (manager-only), Noah (associate-only). Add an admin-only runtime fixture for the role-matrix test; current seeds have no admin-only user.

### Completion gate

Changes reference this story and its requirement IDs; relevant checks pass; package boundaries remain intact; errors are user-visible; no credentials or private files enter logs; documentation and reproducible demo steps are updated. The estimate covers this owner’s slice; prerequisites supply supporting behaviour.

## US-17

**Read structured skills table**

As a associate, I want to read structured skills table so that the mobile journey has clear feedback and consistent state.

| Planning field | Detail |
| --- | --- |
| Owner | App stream |
| Status | Backlog; native implementation not started |
| Requirement trace | UX-16 |
| Dependencies | US-23, US-29 |
| Estimate | 0.5–1 person-days |
| Deliverable | App feature/controller/navigation slice using UI and SDK |

### Acceptance criteria

1. Show title, description, years, last-used date and text approval status.
2. All columns remain reachable on narrow screens; seeded pending rows match reviewer inbox.

### Failure cases and verification

Empty skills, long text, horizontal table scroll and pending/rejected labels.

Verification: screen/controller interaction tests plus a focused native end-to-end demonstration. Use relevant fictional identities: Alex (all roles), Sophie (manager+associate), Grace (manager-only), Noah (associate-only). Add an admin-only runtime fixture for the role-matrix test; current seeds have no admin-only user.

### Completion gate

Changes reference this story and its requirement IDs; relevant checks pass; package boundaries remain intact; errors are user-visible; no credentials or private files enter logs; documentation and reproducible demo steps are updated. The estimate covers this owner’s slice; prerequisites supply supporting behaviour.

## US-18

**Reveal add-skill form on demand**

As a associate, I want to reveal add-skill form on demand so that the mobile journey has clear feedback and consistent state.

| Planning field | Detail |
| --- | --- |
| Owner | App stream |
| Status | Backlog; native implementation not started |
| Requirement trace | UX-17 |
| Dependencies | US-17 |
| Estimate | 0.5–1 person-days |
| Deliverable | App feature/controller/navigation slice using UI and SDK |

### Acceptance criteria

1. Full-width Add new skills reveals initially hidden form.
2. Cancel collapses it; successful submission adds pending row then collapses.

### Failure cases and verification

Initial hidden state, repeated toggle, cancel and successful submit collapse.

Verification: screen/controller interaction tests plus a focused native end-to-end demonstration. Use relevant fictional identities: Alex (all roles), Sophie (manager+associate), Grace (manager-only), Noah (associate-only). Add an admin-only runtime fixture for the role-matrix test; current seeds have no admin-only user.

### Completion gate

Changes reference this story and its requirement IDs; relevant checks pass; package boundaries remain intact; errors are user-visible; no credentials or private files enter logs; documentation and reproducible demo steps are updated. The estimate covers this owner’s slice; prerequisites supply supporting behaviour.

## US-19

**Validate skill submission**

As a associate, I want to validate skill submission so that the mobile journey has clear feedback and consistent state.

| Planning field | Detail |
| --- | --- |
| Owner | App stream |
| Status | Backlog; native implementation not started |
| Requirement trace | UX-17 |
| Dependencies | US-05 |
| Estimate | 0.5–1 person-days |
| Deliverable | App feature/controller/navigation slice using UI and SDK |

### Acceptance criteria

1. Reject whitespace-only required input, years outside 0–60 and future last-used dates.
2. Reject existing approved skill or duplicate pending submission; allow corrected rejected resubmission.

### Failure cases and verification

Whitespace text, negative/over-60 experience, future date and duplicate titles.

Verification: screen/controller interaction tests plus a focused native end-to-end demonstration. Use relevant fictional identities: Alex (all roles), Sophie (manager+associate), Grace (manager-only), Noah (associate-only). Add an admin-only runtime fixture for the role-matrix test; current seeds have no admin-only user.

### Completion gate

Changes reference this story and its requirement IDs; relevant checks pass; package boundaries remain intact; errors are user-visible; no credentials or private files enter logs; documentation and reproducible demo steps are updated. The estimate covers this owner’s slice; prerequisites supply supporting behaviour.

## US-20

**Read scoped seeded approvals**

As a manager, I want to read scoped seeded approvals so that the mobile journey has clear feedback and consistent state.

| Planning field | Detail |
| --- | --- |
| Owner | SDK stream |
| Status | Backlog; native implementation not started |
| Requirement trace | UX-26 |
| Dependencies | US-29 |
| Estimate | 0.5–1 person-days |
| Deliverable | Public SDK module, adapters and contract tests |

### Acceptance criteria

1. Map seed requests to valid skill, owner and designated manager IDs.
2. Provide SDK repository responses for both owner and reviewer without widening scope.

### Failure cases and verification

Missing skill reference, unrelated reviewer and valid owner visibility.

Verification: unit/contract tests with fake adapters, plus real-device evidence for native capabilities. Use relevant fictional identities: Alex (all roles), Sophie (manager+associate), Grace (manager-only), Noah (associate-only). Add an admin-only runtime fixture for the role-matrix test; current seeds have no admin-only user.

### Completion gate

Changes reference this story and its requirement IDs; relevant checks pass; package boundaries remain intact; errors are user-visible; no credentials or private files enter logs; documentation and reproducible demo steps are updated. The estimate covers this owner’s slice; prerequisites supply supporting behaviour.

## US-21

**Open translucent account drawer**

As a signed-in user, I want to open translucent account drawer so that the mobile journey has clear feedback and consistent state.

| Planning field | Detail |
| --- | --- |
| Owner | App stream |
| Status | Backlog; native implementation not started |
| Requirement trace | UX-23–24 |
| Dependencies | US-23 |
| Estimate | 0.5–1 person-days |
| Deliverable | App feature/controller/navigation slice using UI and SDK |

### Acceptance criteria

1. Drawer starts under header, spans to bottom and covers 60% width.
2. Toggle/outside/back dismiss with animation; One Cognizant opens externally.

### Failure cases and verification

Outside tap, repeated toggle, native back, Escape and no-blur fallback.

Verification: screen/controller interaction tests plus a focused native end-to-end demonstration. Use relevant fictional identities: Alex (all roles), Sophie (manager+associate), Grace (manager-only), Noah (associate-only). Add an admin-only runtime fixture for the role-matrix test; current seeds have no admin-only user.

### Completion gate

Changes reference this story and its requirement IDs; relevant checks pass; package boundaries remain intact; errors are user-visible; no credentials or private files enter logs; documentation and reproducible demo steps are updated. The estimate covers this owner’s slice; prerequisites supply supporting behaviour.

## US-22

**Integrate logout UX**

As a signed-in user, I want to integrate logout UX so that the mobile journey has clear feedback and consistent state.

| Planning field | Detail |
| --- | --- |
| Owner | App stream |
| Status | Backlog; native implementation not started |
| Requirement trace | UX-25 |
| Dependencies | US-26, US-21 |
| Estimate | 0.5–1 person-days |
| Deliverable | App feature/controller/navigation slice using UI and SDK |

### Acceptance criteria

1. Drawer Log out invokes SDK cleanup and clears app form/file/query state.
2. Reset navigation to login with no back access to private screens.

### Failure cases and verification

Revocation timeout, secure cleanup failure feedback and late callback after logout.

Verification: screen/controller interaction tests plus a focused native end-to-end demonstration. Use relevant fictional identities: Alex (all roles), Sophie (manager+associate), Grace (manager-only), Noah (associate-only). Add an admin-only runtime fixture for the role-matrix test; current seeds have no admin-only user.

### Completion gate

Changes reference this story and its requirement IDs; relevant checks pass; package boundaries remain intact; errors are user-visible; no credentials or private files enter logs; documentation and reproducible demo steps are updated. The estimate covers this owner’s slice; prerequisites supply supporting behaviour.

## US-23

**Deliver reusable component library**

As a app developer, I want to deliver reusable component library so that the mobile journey has clear feedback and consistent state.

| Planning field | Detail |
| --- | --- |
| Owner | UI stream |
| Status | Backlog; native implementation not started |
| Requirement trace | UX-01–07,15–28 |
| Dependencies | Approved contracts only |
| Estimate | 8–12 person-days |
| Deliverable | Versioned reusable UI package, gallery and props/examples |

### Acceptance criteria

1. Ship controlled foundations, forms, table, cards, header/avatar, progress/timeline, tabs, drawer and overlays.
2. Gallery demonstrates loading/error/disabled/focus/scaling/motion/transparency states; consume a packaged release from app.

### Failure cases and verification

Every component loading/error/disabled state plus keyboard, scaling and accessible focus.

Verification: component behaviour/gallery and manual native accessibility checks. Use relevant fictional identities: Alex (all roles), Sophie (manager+associate), Grace (manager-only), Noah (associate-only). Add an admin-only runtime fixture for the role-matrix test; current seeds have no admin-only user.

### Completion gate

Changes reference this story and its requirement IDs; relevant checks pass; package boundaries remain intact; errors are user-visible; no credentials or private files enter logs; documentation and reproducible demo steps are updated. The estimate covers this owner’s slice; prerequisites supply supporting behaviour.

## US-24

**Configure TypeScript auth strategies**

As a app developer, I want to configure TypeScript auth strategies so that the mobile journey has clear feedback and consistent state.

| Planning field | Detail |
| --- | --- |
| Owner | SDK stream |
| Status | Backlog; native implementation not started |
| Requirement trace | UX-09–13 |
| Dependencies | Approved contracts only |
| Estimate | 4–6 person-days |
| Deliverable | Public SDK module, adapters and contract tests |

### Acceptance criteria

1. Implement abstract class plus CompanySsoAuthStrategy and CredentialsAuthStrategy with typed config/input.
2. Instantiate once at bootstrap with injected native/demo ports; reject unsupported inputs.

### Failure cases and verification

Unsupported strategy input, invalid config, SSO state mismatch and provider cancellation.

Verification: unit/contract tests with fake adapters, plus real-device evidence for native capabilities. Use relevant fictional identities: Alex (all roles), Sophie (manager+associate), Grace (manager-only), Noah (associate-only). Add an admin-only runtime fixture for the role-matrix test; current seeds have no admin-only user.

### Completion gate

Changes reference this story and its requirement IDs; relevant checks pass; package boundaries remain intact; errors are user-visible; no credentials or private files enter logs; documentation and reproducible demo steps are updated. The estimate covers this owner’s slice; prerequisites supply supporting behaviour.

## US-25

**Restore secure biometric-gated session**

As a returning user, I want to restore secure biometric-gated session so that the mobile journey has clear feedback and consistent state.

| Planning field | Detail |
| --- | --- |
| Owner | SDK stream |
| Status | Backlog; native implementation not started |
| Requirement trace | UX-09,13–14 |
| Dependencies | US-24 |
| Estimate | 3–5 person-days |
| Deliverable | Public SDK module, adapters and contract tests |

### Acceptance criteria

1. authenticate() inspects secure storage, unlocks and renews or returns explicit interaction-required/cancelled.
2. Handle enrolment/lockout/store failure; serialize refresh and isolate account credentials.

### Failure cases and verification

No stored session, biometric cancellation, store failure, refresh rotation and simultaneous 401s.

Verification: unit/contract tests with fake adapters, plus real-device evidence for native capabilities. Use relevant fictional identities: Alex (all roles), Sophie (manager+associate), Grace (manager-only), Noah (associate-only). Add an admin-only runtime fixture for the role-matrix test; current seeds have no admin-only user.

### Completion gate

Changes reference this story and its requirement IDs; relevant checks pass; package boundaries remain intact; errors are user-visible; no credentials or private files enter logs; documentation and reproducible demo steps are updated. The estimate covers this owner’s slice; prerequisites supply supporting behaviour.

## US-26

**Terminate sessions without races**

As a user, I want to terminate sessions without races so that the mobile journey has clear feedback and consistent state.

| Planning field | Detail |
| --- | --- |
| Owner | SDK stream |
| Status | Backlog; native implementation not started |
| Requirement trace | UX-25 |
| Dependencies | US-24, US-25 |
| Estimate | 2–3 person-days |
| Deliverable | Public SDK module, adapters and contract tests |

### Acceptance criteria

1. Cancel protected work, invalidate generation and purge namespaced stored credentials even when revocation fails.
2. Discard late refresh/HTTP responses; emit unauthenticated for app route reset.

### Failure cases and verification

Logout during refresh, late request completion, cleanup failure and account switching.

Verification: unit/contract tests with fake adapters, plus real-device evidence for native capabilities. Use relevant fictional identities: Alex (all roles), Sophie (manager+associate), Grace (manager-only), Noah (associate-only). Add an admin-only runtime fixture for the role-matrix test; current seeds have no admin-only user.

### Completion gate

Changes reference this story and its requirement IDs; relevant checks pass; package boundaries remain intact; errors are user-visible; no credentials or private files enter logs; documentation and reproducible demo steps are updated. The estimate covers this owner’s slice; prerequisites supply supporting behaviour.

## US-27

**Apply allowed hosted settings**

As a operator, I want to apply allowed hosted settings so that the mobile journey has clear feedback and consistent state.

| Planning field | Detail |
| --- | --- |
| Owner | App stream |
| Status | Backlog; native implementation not started |
| Requirement trace | UX-08 |
| Dependencies | US-28 |
| Estimate | 1–2 person-days |
| Deliverable | App feature/controller/navigation slice using UI and SDK |

### Acceptance criteria

1. Apply validated labels/flags/limits at safe launch/session boundaries.
2. Existing feature changes need no binary release; unimplemented feature/code changes remain outside config.

### Failure cases and verification

Feature disabling, config reload during editing and unsupported field/version.

Verification: screen/controller interaction tests plus a focused native end-to-end demonstration. Use relevant fictional identities: Alex (all roles), Sophie (manager+associate), Grace (manager-only), Noah (associate-only). Add an admin-only runtime fixture for the role-matrix test; current seeds have no admin-only user.

### Completion gate

Changes reference this story and its requirement IDs; relevant checks pass; package boundaries remain intact; errors are user-visible; no credentials or private files enter logs; documentation and reproducible demo steps are updated. The estimate covers this owner’s slice; prerequisites supply supporting behaviour.

## US-28

**Load config through pinned transport**

As a mobile user, I want to load config through pinned transport so that the mobile journey has clear feedback and consistent state.

| Planning field | Detail |
| --- | --- |
| Owner | SDK stream |
| Status | Backlog; native implementation not started |
| Requirement trace | UX-08–09 |
| Dependencies | Approved contracts only |
| Estimate | 4–7 person-days |
| Deliverable | Public SDK module, adapters and contract tests |

### Acceptance criteria

1. Implement pinned native HTTP, safe API token injection, typed errors/abort, config validation and eligible cache fallback.
2. Reject TLS/pin/host/schema/expiry/revision failures; verify on native builds; do not fall back unpinned.

### Failure cases and verification

TLS/host/pin failure, malformed/expired/old config, offline cache and timeout.

Verification: unit/contract tests with fake adapters, plus real-device evidence for native capabilities. Use relevant fictional identities: Alex (all roles), Sophie (manager+associate), Grace (manager-only), Noah (associate-only). Add an admin-only runtime fixture for the role-matrix test; current seeds have no admin-only user.

### Completion gate

Changes reference this story and its requirement IDs; relevant checks pass; package boundaries remain intact; errors are user-visible; no credentials or private files enter logs; documentation and reproducible demo steps are updated. The estimate covers this owner’s slice; prerequisites supply supporting behaviour.

## US-29

**Consume documented read-only REST API**

As a app developer, I want to consume documented read-only REST API so that the mobile journey has clear feedback and consistent state.

| Planning field | Detail |
| --- | --- |
| Owner | Backend support stream |
| Status | Implemented; live loopback integration checks passed |
| Requirement trace | API contract |
| Dependencies | Approved contracts only |
| Estimate | 0–0 person-days |
| Deliverable | Read-only server, API reference, OpenAPI and integration suite |

### Acceptance criteria

1. Node built-in server serves fixture-backed scoped reads and demo token endpoint.
2. API Markdown and OpenAPI define body/headers/types/errors; integration tests verify immutable DB hashes.

### Failure cases and verification

Missing/tampered/expired auth, scope denials, malformed pagination/JSON and refused writes.

Verification: live loopback HTTP integration suite and before/after DB hashes. Use relevant fictional identities: Alex (all roles), Sophie (manager+associate), Grace (manager-only), Noah (associate-only). Add an admin-only runtime fixture for the role-matrix test; current seeds have no admin-only user.

### Completion gate

Changes reference this story and its requirement IDs; relevant checks pass; package boundaries remain intact; errors are user-visible; no credentials or private files enter logs; documentation and reproducible demo steps are updated. The estimate covers this owner’s slice; prerequisites supply supporting behaviour.

## US-30

**Integrate read API client**

As a app developer, I want to integrate read API client so that the mobile journey has clear feedback and consistent state.

| Planning field | Detail |
| --- | --- |
| Owner | SDK stream |
| Status | Backlog; native implementation not started |
| Requirement trace | API contract |
| Dependencies | US-29, US-24 |
| Estimate | 1.5–2.5 person-days |
| Deliverable | Public SDK module, adapters and contract tests |

### Acceptance criteria

1. Typed clients map paged identity/profile/skills/learning/team/approval/admin responses.
2. Test scope denials, pagination, malformed responses, timeout and token expiry; no unsafe automatic write retries.

### Failure cases and verification

Malformed DTO, 401/403 distinction, abort, pagination and structured error response.

Verification: unit/contract tests with fake adapters, plus real-device evidence for native capabilities. Use relevant fictional identities: Alex (all roles), Sophie (manager+associate), Grace (manager-only), Noah (associate-only). Add an admin-only runtime fixture for the role-matrix test; current seeds have no admin-only user.

### Completion gate

Changes reference this story and its requirement IDs; relevant checks pass; package boundaries remain intact; errors are user-visible; no credentials or private files enter logs; documentation and reproducible demo steps are updated. The estimate covers this owner’s slice; prerequisites supply supporting behaviour.

## US-31

**Implement session-only domain repositories**

As a app developer, I want to implement session-only domain repositories so that the mobile journey has clear feedback and consistent state.

| Planning field | Detail |
| --- | --- |
| Owner | SDK stream |
| Status | Backlog; native implementation not started |
| Requirement trace | Future write contracts |
| Dependencies | US-29 |
| Estimate | 3–5 person-days |
| Deliverable | Public SDK module, adapters and contract tests |

### Acceptance criteria

1. Hydrate fixtures/read responses and implement profile/skill/progress/decision/assignment/role mutation contracts in memory.
2. Preserve approved versus pending values; enforce reference/duplicate/version rules and reset lifecycle; never write JSON seeds.

### Failure cases and verification

Invalid relationship, duplicate requests, conflicting decisions, restart reset and immutable seed preservation.

Verification: unit/contract tests with fake adapters, plus real-device evidence for native capabilities. Use relevant fictional identities: Alex (all roles), Sophie (manager+associate), Grace (manager-only), Noah (associate-only). Add an admin-only runtime fixture for the role-matrix test; current seeds have no admin-only user.

### Completion gate

Changes reference this story and its requirement IDs; relevant checks pass; package boundaries remain intact; errors are user-visible; no credentials or private files enter logs; documentation and reproducible demo steps are updated. The estimate covers this owner’s slice; prerequisites supply supporting behaviour.

## US-32

**Integrate and release phone builds**

As a team, I want to integrate and release phone builds so that the mobile journey has clear feedback and consistent state.

| Planning field | Detail |
| --- | --- |
| Owner | App stream |
| Status | Backlog; native implementation not started |
| Requirement trace | All UX |
| Dependencies | US-16, US-22, US-27 |
| Estimate | 2–4 person-days |
| Deliverable | App feature/controller/navigation slice using UI and SDK |

### Acceptance criteria

1. Consume independently versioned UI/SDK packages with clean Android/iOS builds.
2. Critical auth/onboarding/approval/role/logout and restart journeys have recorded device evidence and reproducible setup.

### Failure cases and verification

Clean install, process kill, native back, token expiry and release-build-only failures.

Verification: screen/controller interaction tests plus a focused native end-to-end demonstration. Use relevant fictional identities: Alex (all roles), Sophie (manager+associate), Grace (manager-only), Noah (associate-only). Add an admin-only runtime fixture for the role-matrix test; current seeds have no admin-only user.

### Completion gate

Changes reference this story and its requirement IDs; relevant checks pass; package boundaries remain intact; errors are user-visible; no credentials or private files enter logs; documentation and reproducible demo steps are updated. The estimate covers this owner’s slice; prerequisites supply supporting behaviour.

## Release gates and critical dependencies

1. Agree UI/SDK/API/config contracts; start US-23, US-24, US-28 and US-29 in parallel.
2. Connect SDK read clients and session mock mutations (US-30/31), then build app auth and onboarding.
3. Add role workspaces and approval/administration flows after mutable contracts and navigation are stable.
4. Integrate hosted config and test native storage, biometrics, pinning, accessibility and process lifecycle.
5. Package independent releases and complete US-32 with Android/iOS evidence.

References: [UX specification](../../requirements/05-mobile-ui-ux-specification.md), [repository map](../../solution-design/06-repositories-and-workstreams.md), [auth](../../solution-design/07-auth-strategy-contract.md), [runtime config](../../solution-design/08-runtime-configuration.md), [API](../../../dummy-backend/API.md), [future writes](../../../dummy-backend/write-contracts.md).
