> Archived baseline: superseded by the [human learning backlog](../../README.md). Old US IDs and estimates are historical, not additive to the new plan.

# User stories and acceptance criteria

Derived from [current requirements](../../requirements/00-current-requirements.md). These criteria describe the target; the prototype walkthrough records implementation limits.

| ID | Actor | Story | Acceptance criteria |
| --- | --- | --- | --- |
| US-01 | Associate | Activate account | Matching email/ID opens dummy SSO; mismatches show an error. |
| US-02 | Returning user | Unlock account | Biometric success opens an existing session; failure offers company login; expiry requires SSO. |
| US-03 | First-time user | Complete personal details | Editable contacts are saved; identity, job and manager fields cannot be edited. |
| US-04 | First-time user | Navigate onboarding | Three-step indicator, back navigation and session drafts preserve entered data. |
| US-05 | Associate | Declare skills | Search skill, expertise, years, project description and optional PDF create a pending request. |
| US-06 | Associate | Manage CV | Select/view/replace a PDF or explicitly skip CV; invalid files show errors. |
| US-07 | Associate | Edit dashboard | One page shows profile, skills, CV and learning; organisation fields remain read-only. |
| US-08 | Associate | Request progress change | Approved value remains visible while proposed value awaits approval; completion evidence is enforced. |
| US-09 | Manager | Review requests | Only direct-report requests appear; approve applies values; rejection records feedback. |
| US-10 | Associate | Revise rejected changes | Rejection reason is visible and a corrected request can be resubmitted. Full progress rejection history is pending in prototype. |
| US-11 | Manager | Assign learning | Search direct report by name/ID, choose learning and due date; duplicate active assignments are blocked. |
| US-12 | Admin | Edit roles | Search organisation by name/ID and save any valid combination of application roles. |
| US-13 | Admin | Protect access integrity | Cannot remove final admin, all roles, or manager capability while direct reports remain. |
| US-14 | Multi-role user | Switch workspaces | Only granted tabs render; manager-only users do not receive an Associate tab. |
| US-15 | Demo user | Reset session | Page reload/app process termination resets domain mutations; only demo login marker/native auth remains. |
| US-16 | User | Use accessible forms | Labelled inputs, keyboard controls, visible focus and validation feedback support essential journeys. |

## Skills follow-up stories

| ID | Actor | Story | Acceptance criteria |
| --- | --- | --- | --- |
| US-17 | Associate | Review existing skills | Table shows title, description, years of experience, last-used date and approval status for all added skills; mobile users can scroll horizontally. |
| US-18 | Associate | Add a skill on demand | Full-width Add new skills reveals the initially hidden form; Cancel closes it; submit adds a pending row and closes it. |
| US-19 | Associate | Submit complete skill history | Required skill fields are validated; future dates, invalid experience and duplicate approved/pending skills are rejected. |
| US-20 | Manager | Review seeded pending skills | Approval fixtures link to valid associates, skill IDs and the owner’s manager; pending rows appear in the matching manager inbox. |

## Account menu

| ID | Actor | Story | Acceptance criteria |
| --- | --- | --- | --- |
| US-21 | Signed-in user | Open account options | Menu beside dashboard avatar offers One Cognizant and Log out across role workspaces. |
| US-22 | Signed-in user | Log out completely | Application-owned stored authentication and private session data are cleared, login appears, and the old biometric session is unavailable. |

## Reusable implementation streams

| ID | Actor | Story | Acceptance criteria |
| --- | --- | --- | --- |
| US-23 | App developer | Reuse UI across apps | All reusable primitives listed in the repository plan ship as a versioned React Native UI package without HTTP/auth/business-screen dependencies. |
| US-24 | App developer | Select class-based auth strategy | Instantiate CompanySsoAuthStrategy or CredentialsAuthStrategy once with typed config and inject it into AuthManager; unsupported inputs fail safely. |
| US-25 | Returning user | Restore and unlock session | authenticate() checks secure storage, obtains biometric-gated credential access when appropriate, refreshes eligible sessions and returns an explicit authenticated/interaction-required/cancelled outcome. |
| US-26 | User | End session reliably | logout aborts protected work, rejects late responses, purges app-owned credentials/domain state and resets app navigation even when remote revocation fails. |
| US-27 | Operator | Adjust supported app settings | A validated compatible hosted config changes shipped labels/flags/limits without deployment; arbitrary trust/identity/code changes are rejected. |
| US-28 | User | Recover from config failure | Native pinned fetch failure uses only an eligible cached config or shows Retry; never falls back to unpinned transport. |

## Detailed implementation planning

The [detailed backlog and estimates](../02-detailed-backlog-and-estimates.md) expands these IDs and adds read-backend, typed API client, session-mutation repository and release-integration stories US-29–US-32. Use that file for owners, dependencies, effort, acceptance, failure tests and implementation status. This original file remains the concise feature register.
