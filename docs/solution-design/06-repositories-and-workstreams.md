> **SUPERSEDED (repository/work-stream map for three remotes):** use [10-human-learning-implementation-plan.md](10-human-learning-implementation-plan.md) and [ADR-001](decisions/ADR-001-monorepo.md). UX-to-owner mapping below remains useful only as a responsibility checklist inside the monorepo.
>
> Superseded on repository/work planning: use the [current monorepo learning solution design](10-human-learning-implementation-plan.md) and [human backlog](../user-stories/README.md). Three separate repositories and old US estimates below are historical. Technical contracts still apply where they do not conflict.

# Three repositories and implementation work streams

Status: agreed repository boundaries, proposed package names. This is an implementation plan; repositories/packages have not been created. It replaces the older single-workspace default. All examples are documentation, not executable source.

| Repository | Suggested package | Owns | Does not own |
| --- | --- | --- | --- |
| talent-ui | @talent/ui | Reusable React Native visual components, tokens, accessibility and native appearance fallbacks | Auth, HTTP, employee policy, route graphs, backend mutations |
| talent-sdk | @talent/sdk; optional @talent/sdk-react-native entry point | TypeScript auth strategies/manager, HTTP, validation/encoding utilities, configuration service, platform contracts and reusable native adapters | Business screens and their navigation flow or presentation |
| talent-app | Mobile application | Screen composition, UX, route graph, form flow, business rules/validators, SDK/UI wiring and environment bootstrap | Copies of UI primitives or independent competing token managers |

The app depends on versioned releases of UI and SDK. UI and SDK never import the app or each other. SDK core runs without React Native; native adapters are isolated exports with explicit peer dependencies. Each repo has its own tests, build, release notes and independent versioning. Backend JSON references stay under dummy-backend in this documentation project; they are not a fourth required implementation repository. Initially the app can consume them through an injected in-memory repository. A standalone mock HTTP service is a later optional integration harness.

## UI library inventory

| Component family | Reusable components and contract |
| --- | --- |
| Foundation | ThemeProvider, Text, Icon, Box, Stack, Divider, ScreenContainer/SafeArea, spacing/colour/type tokens |
| Forms | Form, FormItem, TextField, ReadOnlyField, PhoneField, SearchField, Select/Combobox, DateField, Checkbox, TextArea, FilePickerField presentation. Controlled values; labels/errors/help text; disabled/pending states. Native file picker invocation is supplied through callbacks. |
| Actions | Button, IconButton, Link; variants, fullWidth, loading, consistent minimum sizes |
| Structure | AppHeader, Avatar, Card, SectionHeader, BottomTabs, ProgressBar, ProgressLabel, StepTimeline |
| Collections | DataTable with horizontal scrolling, EmptyState, LoadingState, ErrorState, StatusBadge, NotificationCard primitives |
| Overlays | SideDrawer (edge/width/insets/backdrop/onDismiss), BottomSheet, Dialog, Toast, InlineAlert; focus/native back and motion handling |

Forms accept error state and render controls; the app supplies domain validation schemas and submission behaviour. Generic cards do not know what an associate is. Drawer receives items/actions and a glass/opaque theme option, not hardcoded company URLs or logout logic. The glass effect uses a capability-tested native adapter and supports reduced transparency without changing app UX code.

## SDK modules and ownership

| Module | Responsibilities |
| --- | --- |
| auth | Abstract TypeScript class plus CompanySsoAuthStrategy and CredentialsAuthStrategy; AuthManager owns session storage, restore/unlock, refresh, logout and events |
| transport | HttpClient, typed errors, timeout, abort, request metadata, redaction, endpoint restrictions and pinned native transport; AuthManager supplies tokens |
| storage | SecureCredentialStore, SessionStore and temporary-file contracts; namespace/account isolation; native Keychain/Keystore adapter and test memory adapter |
| biometric | Biometric capability/enrolment/unlock interface; native prompt adapter and fake adapter; local unlock is not remote authentication |
| navigation | NavigationPort and typed auth interaction events; optional reusable adapter utilities. App owns route names, navigation container and screen transitions. SDK core never calls a concrete navigator singleton. |
| config | Pinned fetch, runtime schema validation, revision/expiry compatibility rules, allowed-host restrictions and last-known-good policy |
| data | Associate/learning/skill/approval types, repository contracts, API clients and deterministic mock implementation |
| input/files | Reusable safe URL construction/encoding, response validation, filename normalization and upload constraints. App-specific validation lives with the feature; backend validates again. No blanket string-stripping “sanitizer” or HTML injection into native labels. |

## Complete UX-to-repository ownership map

Requirement details and acceptance are in [mobile UI/UX specification](./05-mobile-ui-ux-specification.md). Every UX ID is mapped below. The named lead owns the integrated result; supporting repositories provide the listed contract.

| Requirements | UI deliverable | SDK deliverable | App deliverable / integration lead |
| --- | --- | --- | --- |
| UX-01–03 | Layout, tokens, accessible controls | None | Phone screen composition; UI lead for primitives, app for acceptance |
| UX-04, UX-06–07 | State/error/focus/overlay primitives | Typed failures | Map failures, required rules, native back/keyboard and screen reader journeys |
| UX-05 | Controlled BottomTabs | Verified identity/role state | Authorised route graph and initial workspace |
| UX-08–09 | Launch/error/retry presentation | Config bootstrap and session inspection | Bootstrap sequence and protected-screen gate |
| UX-10–14 | Buttons/fields/step/paused-screen primitives | Auth strategies, AuthManager, biometric and interaction adapters | Login, activation, SSO presentation, restore and route decisions |
| UX-15 | Form/read-only/image fields | Profiles/files repository | Personal-details schema and save/draft flow |
| UX-16–17 | Table, search/select/date/form/button | Skills catalogue and approval operations | Skills list, reveal state, validation and pending UX |
| UX-18–19 | File row, picker field, review layout | File lifecycle/contracts | CV/image interaction, permissions feedback and completion |
| UX-20 | Profile/section components | Profile read/update | Single-page dashboard, edit/save/cancel |
| UX-21–22 | Progress/card/status/evidence primitives | Assignments/approval DTOs and operations | Requested vs approved values, feedback and resubmission |
| UX-23–24 | Sliding/glass drawer | External-link/navigation adapter contract | Drawer actions and One Cognizant URL |
| UX-25 | Pending/error presentation | Logout, credential purge, cancellation and session generation | Reset app domain state and navigation; lifecycle subscription |
| UX-26–27 | Inbox cards, search and assignment form | Scoped team/approval/assignment repositories | Manager workflows and no-self-approval UX |
| UX-28 | Search/checkbox/form controls | Role update and refreshed identity contract | Admin workflow, safeguards, effective-access refresh |

## Sequenced implementation streams

These are backlog deliverables, not completion claims. Work in separate repos can proceed against approved contracts after the first gate.

| Stage | UI library stream | SDK stream | App stream | Exit gate |
| --- | --- | --- | --- | --- |
| R0 Contracts | Token/props and component list | Auth/config/transport/storage contracts | Route map and screen acceptance | Approve contracts and mock identity scenarios |
| R1 Foundation | Theme, layout, controls, gallery | DTOs, typed errors, memory repository and transport | Native project, package consumption and launch shell | One real phone screen using released UI/SDK packages |
| R2 Authentication | Login fields/buttons, header, drawer | Both strategy classes, AuthManager, fake + native secure/biometric adapters | Configure one strategy at entry point, login/activation/paused routes | Invalid/valid login, expiry, cancel and logout demonstrated |
| R3 Onboarding | Form items, timeline, table, upload rows | Profiles/skills/files operations | Three steps, required fields, skills reveal and CV | Personal details → Skills → CV → dashboard |
| R4 Workspaces | Cards/progress/tabs/notification primitives | Approval, team assignment and admin operations | Associate/manager/admin workflows | Cross-user pending/approve/reject and role-change demo |
| R5 Hosted config | Configurable labels/theme within supplied tokens | Pinned config retrieval and safe fallback | Load config before app services become ready | Valid config applied; invalid/pin-failed config rejected |
| R6 Quality/release | VoiceOver/TalkBack, scaling, reduce transparency | Refresh/logout race, schema and pinning device tests | Native back, lifecycle reset, end-to-end role flows | Independent package releases and reproducible app build |

## Integration rules

- Publish prerelease packages and test clean consumption; avoid app-relative imports across repositories.
- SDK public API changes and runtime config schema changes are versioned. The app pins compatible package versions and validates schemaVersion/minimum build.
- UI contract tests cover behaviour, not exact screenshots alone. SDK tests cover session races and denied requests. App tests cover integrated UX and permission boundaries.
- The mock backend is responsible for simulated server authorization, while a production backend must independently enforce it. Hiding tabs is never sufficient.
- Keep advanced persistent offline queues out of the initial demo; the agreed process-kill reset contract still applies.

## Supporting backend and estimated story plan

The [read-only Node service](../../dummy-backend/README.md) is an implemented support harness inside this documentation project, not a fourth required product repository. [Detailed story estimates](../user-stories/02-detailed-backlog-and-estimates.md) allocate remaining work without charging shared UI/SDK work twice. See [system diagrams](09-system-design-and-diagrams.md) for components, data, auth, onboarding, approval and logout sequences.
