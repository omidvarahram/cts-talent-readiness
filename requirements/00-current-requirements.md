> Current implementation planning: [monorepo learning solution design](../solution-design/10-human-learning-implementation-plan.md) and [new human backlog](../user-stories/README.md) supersede older separate-repository and feature-first planning text.

# Current agreed requirements

This document takes precedence over the initial 20 November design proposals where they differ. Updated 23 November 2026. The prototype is an executable browser demonstration; the intended implementation is a React Native app for mobile phones only. The HTML prototype must use phone-width screens rather than a desktop web layout.

## Identity and workspaces

Every person has an associate record. Application roles are an independent additive array of associate, manager and admin. Job title and staffing status do not determine permissions. Show only the workspaces granted to the current identity, including manager-only users. Managers access direct reports; admins search the organisation.

## Journeys

1. First visit: activate using matching email and associate ID, complete dummy company SSO in a simulated WebView, receive a mock session, and complete onboarding.
2. Returning visit: offer biometric unlock and company SSO. Expired sessions require SSO when renewal is unavailable. Credentials belong in the company portal.
3. Onboarding: Personal details → Skills → CV/review, with a top step indicator, back navigation and session draft preservation.
4. Dashboard: single editable profile page with skills, CV and learning assignments. Organisation-controlled fields stay read-only.
5. Manager: approval inbox, review evidence, approve/reject with feedback, search direct reports and assign catalogue learning.
6. Admin: search by name/ID, edit additive application roles and save. Keep at least one role and one active admin; resolve direct reports before manager removal.

## Data and editable fields

Editable: name, phone, address, profile image, CV and skill submissions. Read-only: associate ID, registered email, manager, job title, location and staffing status. Skills include name, expertise, years of experience, project description and optional PDF evidence. CV may be skipped explicitly. Prototype file limit is 5 MB and uses PDF for CV/evidence, PNG/JPEG for profile image.

## Approval rules

New skills and progress changes require manager approval. Preserve approved and requested progress separately. Approval status (pending/approved/rejected) is separate from learning status (not_started/in_progress/completed). Reject with a reason; allow revision and resubmission. Block duplicate pending updates. Required completion evidence must exist before a completion request. Never approve your own submission. A designated reviewer for the top-level manager remains to be configured.

## Demo persistence

Keep profile edits, files, onboarding completion, assignments, approvals and role edits only for the running app session. On process termination reset to seed data; retain only login/authentication material securely in the intended native app. The browser prototype resets on page reload and retains only a fictional login marker in localStorage, not a secure token. Switching demo users preserves the current in-memory session.

## Scope and implementation boundaries

Three implementation areas: UI library, shared SDK and app. UI components do not read DB files or enforce backend permissions. SDK owns domain operations and injected transport/storage contracts. App owns navigation and native adapters. Existing offline queue, encrypted profile persistence, pinning and native module proposals are future learning exercises and do not override the demo reset contract.

## Prototype limits

The delivered HTML simulates SSO and biometrics and has no real backend authorization. Fixture skills and submitted skills both contain structured experience and approval information. Profile image selection is retained as file metadata/object URL but not rendered as an avatar. Full skill editing, complete rejection history, audit storage, native storage, network errors and notification delivery need implementation. Syntax and screen-render checks passed; visual browser and device QA are outstanding.

## Data references

- [Associates](../dummy-backend/DB/associates.db.json)
- [Application roles](../dummy-backend/DB/auth_users.db.json)
- [Learning catalogue](../dummy-backend/DB/learnings.db.json)
- [Assignments](../dummy-backend/DB/learning_assignments.db.json)
- [Clickable prototype](prototypes/prototype.html)
- [User stories](../user-stories/01-user-stories.md)

## Skills screen and data — agreed update

- Onboarding Skills and dashboard Skills display already added skills in a horizontally scrollable mobile table. Columns: title, description, years of experience, last used and approval status. Display approved and pending clearly; retain rejected status and feedback when applicable.
- A full-width **Add new skills** button appears below the table. The add form is hidden until tapped, and supports Cancel. Successful submission adds a pending row and hides the form.
- Skill title, expertise, years of experience, description and last-used date are required. Evidence PDF is optional. Experience is a nonnegative number up to 60; last used cannot be in the future. Duplicate approved skills and duplicate pending submissions are blocked.
- Skill records include skill_id, skill_code, title, description, expertise, years_of_experience, last_used, approval_status and optional evidence. Existing fixture values are synthetic but come from JSON, not UI-generated placeholders.
- [Skill catalogue](../dummy-backend/DB/skills.db.json) provides skill codes/titles. [Approval requests](../dummy-backend/DB/approval_requests.db.json) links pending skills to their owner and reviewing manager. New runtime prototype mutations remain session-only.

## Dashboard account menu

Place an account options menu beside the avatar on every authorised dashboard workspace. It contains One Cognizant, opening https://onecognizant.cognizant.com/ externally, and Log out. Logout removes application-owned persistent authentication/storage, resets private session state, releases temporary file references and returns to login. Do not erase unrelated applications’ storage. Browser prototype opens the portal in a new tab; the native app should use the system browser.

## Account drawer presentation

The avatar-adjacent menu opens a right-side drawer spanning 60% of the mobile screen width, from immediately below the measured app header to the screen bottom. Animate entry from right to left and exit back to the right. Tapping the menu toggle again, tapping the shaded area outside the drawer, or pressing Escape closes it. Keep One Cognizant and Log out inside the drawer. Hidden drawer controls are inert; honour reduced-motion preferences.

## Login and drawer visual refinement

All login actions must align in a vertical stack with equal full width, consistent height and spacing. The account drawer matches the top-bar navy with a translucent glass-like finish, white labels and visible focus. Native platform implementation should support an opaque fallback when transparency is disabled or unsupported.

## Full UX and three-repository implementation contract

The [mobile UI/UX specification](05-mobile-ui-ux-specification.md) captures the complete journey from launch through login, onboarding, dashboard, approvals and administration with stable UX-01–UX-28 acceptance IDs. Implementation is split into three independently structured projects in one npm monorepo: reusable React Native UI library, shared SDK, and Expo mobile app. The [repository/work-stream map](../solution-design/06-repositories-and-workstreams.md) assigns every UX requirement. The current monorepo learning plan supersedes the interim separate-repository proposal.

The SDK exposes TypeScript class-based authentication strategies and an AuthManager initialized once at the app entry point with a small typed configuration. The initial second strategy is proposed as app-owned credentials, alongside company SSO. No-argument authenticate restores/unlocks/renews a session or requests login; explicit arguments start the selected interactive strategy. The manager owns token persistence, biometric-gated access, refresh coordination and logout. Navigation interfaces are reusable SDK contracts, while screens/routes and ultimate UX belong to the app. See [auth contract](../solution-design/07-auth-strategy-contract.md).

The app loads hosted config.json through native HTTPS public-key pinning and validates it before enabling workflows. Allowed operational changes do not require deployment; new code, native capabilities or changes beyond shipped trust/schema boundaries do. See [runtime config contract](../solution-design/08-runtime-configuration.md). These are specifications, not claims that native SDK/auth/config functionality exists in the HTML prototype.

## Read-only backend and detailed delivery backlog

A dependency-free Node HTTP service now supplies fixture-backed read endpoints with scoped access and a dummy token-issuance endpoint. It never writes seed DBs. Domain mutation routes remain intentionally unimplemented (405); app-session repositories own demo interactions. See [API reference](../dummy-backend/API.md), [OpenAPI](../dummy-backend/openapi.json) and [future mutation contracts](../dummy-backend/write-contracts.md). Local HTTP is a development transport only and does not satisfy the separately specified native HTTPS/pinning requirement.

[System design diagrams](../solution-design/09-system-design-and-diagrams.md) provide GitHub-renderable UML-style class/sequence/state diagrams and flowcharts. [Detailed backlog](../user-stories/02-detailed-backlog-and-estimates.md) expands the story register to 32 owner-scoped implementation slices with acceptance, dependencies, failure cases, verification and person-day estimates. Their completion status distinguishes the implemented backend from native app/SDK/UI work.

## Human implementation and coverage requirements

The existing cts-talent-readiness Git repository is the implementation monorepo. Root workspace/TypeScript/test/CI/registry-ready setup precedes component, SDK and app stories. UI and SDK are independently packable/publishable, with local workspace and tarball consumption available without registry publication. Humans perform setup and implementation, using contextual stories, hints, failure cases and teach-back.

Coverage is mandatory in each project for statements, branches, functions and lines: SDK 100%, UI 90%, app 70%. Configure collection over all authored executable source from the beginning and fail CI below any threshold. Native mocks do not substitute for real-device verification. See [test strategy](../solution-design/testing/01-test-strategy.md), [setup guide](../solution-design/12-setup-and-tooling-guide.md) and [67-story backlog](../user-stories/README.md).
