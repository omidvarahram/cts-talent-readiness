> Implementation ownership now follows the [three-project npm monorepo learning design](../solution-design/10-human-learning-implementation-plan.md). The screen/UX contracts below remain current.

# Mobile UI and UX specification

Status: implementation requirements, 23 November 2026. Target: React Native on iOS and Android phones. HTML prototypes illustrate interaction and appearance; they are not application source. This specification, [current requirements](00-current-requirements.md) and the linked architecture contracts supersede conflicting initial proposals.

## Shared visual and interaction rules

| ID | Requirement and acceptance |
| --- | --- |
| UX-01 | Phone-only composition: one vertical content column, safe areas, scrollable content and keyboard avoidance. The browser preview is capped at 430px; native screens adapt to actual device width and text scaling. |
| UX-02 | Navy #080541 header, pale-blue #eff7ff background, white cards, blue borders, purple actions and cyan selected states. Use the [design tokens](prototypes/design-tokens.json), local font/fallbacks and consistent 10–12px radii. No required remote font download. |
| UX-03 | All actionable controls have at least 48px touch targets. Login actions use equal full width, 54px minimum height, stacked with 12px gaps. Text scaling must not clip labels; controls may grow. |
| UX-04 | Every screen defines loading, empty, validation, failure and success states where relevant. Disable repeated submission while working; announce feedback, retain entered values on errors, and focus the first invalid field. |
| UX-05 | Render only authorised workspace tabs: My profile, My team and Admin. Their order is fixed, their presence is additive, and manager-only/admin-only users do not receive an Associate tab. Initial workspace is Associate when granted, otherwise Manager, otherwise Admin. Server authorization remains authoritative. |
| UX-06 | Labels persist above fields. Read-only organisation fields remain visible and recognisable. Required fields carry an asterisk and accessible required state. Never rely only on colour for state. |
| UX-07 | Native back, keyboard navigation, screen readers and focus management work. Dialogs restore focus when dismissed. Respect reduced motion and reduced transparency. Do not let a hidden drawer remain focusable. |

## Screen-by-screen journey, starting at launch

### Launch and bootstrap

| ID | Presentation | Behaviour / acceptance |
| --- | --- | --- |
| UX-08 | Branded launch/loading state | Create SDK/auth services once; fetch and validate hosted configuration using the pinned transport. Use an eligible last-known-good configuration when allowed. A blocking config error offers Retry; protected screens never flash before auth resolution. |
| UX-09 | Session resolution | Inspect secure stored session without silently invoking biometrics at module import. If interactive unlock is required, show the login screen. A confirmed session routes to onboarding or dashboard. Handle cancellation, expiry and revocation without a navigation loop. |

### Login and account activation

| ID | Presentation | Behaviour / acceptance |
| --- | --- | --- |
| UX-10 | Greeting and login card | Stack Unlock with biometrics when enrolled/session eligible, Continue with company account, and First visit? Activate account. Buttons share alignment/size. Never display a real password field for company SSO inside this app. |
| UX-11 | Activate account | Email and 6–7-digit associate ID are mandatory. Trim email, compare case-insensitively; preserve ID as a string. Show field errors and a safe mismatch message. Only a matching dummy identity proceeds to the demo company portal. This check alone is not authentication. |
| UX-12 | Company authentication | Display the simulated company portal and cancel/error/retry outcomes in the learning build. Obtain identity, additive application roles and session; fetch the associate by verified ID. Staffing status and job title are separate domain attributes. Real SSO uses the approved external system authentication session, rather than collecting credentials in a WebView. |
| UX-13 | Biometric unlock | Use native prompt in the app and labelled success/failure simulation only in the HTML prototype. Cancel returns to login; unavailable hardware/enrolment/lockout offers company login. An unusable stored session requires renewal or full sign-in. No success screen based solely on local biometric success. |
| UX-14 | Interrupted onboarding | Resume the saved step within the same app session. Demo domain state resets on process termination, so a retained authenticated identity may need onboarding again. Make this demo behaviour explicit. |

### Onboarding: three-step timeline

Timeline labels: Personal details → Skills → CV and review. Current and completed steps are visually distinct and announced. Back does not lose accepted inputs. Save and exit stores an incomplete session draft and displays a signed-in paused screen with Resume setup; it does not log out.

| ID | Screen | Fields / behaviour / acceptance |
| --- | --- | --- |
| UX-15 | Personal details | Required editable name, phone and address. Optional profile image, PNG/JPEG up to 5 MB. Visible read-only associate ID, registered email, manager, job title, location and staffing status. Empty and whitespace-only required values block Continue, show inline errors and focus the first error. Valid Continue advances to Skills. Server repeats validation. |
| UX-16 | Skills list | Show existing skills in a horizontally scrollable table: title, description, years of experience, last used and approval status. Maintain readable columns and indicate horizontal scroll. Approved/pending/rejected are text labels. Evidence and rejection feedback are available per relevant row. |
| UX-17 | Add skill | A full-width Add new skills button reveals the initially hidden form. Required searchable title, expertise, years (0–60), project description and last-used date (not future). Optional PDF evidence up to 5 MB. Cancel collapses the form. Successful submit adds a pending row and collapses it. Block duplicate approved skills and duplicate pending requests. Continue can skip adding skills. |
| UX-18 | CV and review | Show profile summary and skill count. Select/view/replace/remove PDF CV up to 5 MB, or explicitly select I don’t have a CV yet. A selected CV takes precedence over the skip checkbox. Complete profile opens the user's permitted workspace. |
| UX-19 | File interactions | Handle picker cancellation, denied permission, invalid type, oversized file, failure and retry. Show selected filename and view/replace/remove where appropriate. Native image selection should preview the avatar. Temporary file references must not be treated as permanent uploads. |

### Dashboard and account drawer

| ID | Screen / component | Behaviour / acceptance |
| --- | --- | --- |
| UX-20 | Associate dashboard | Single scrollable page: greeting/status, profile, skills, CV, then assignments. Editing permissions match onboarding. Personal details Save validates mandatory values; Cancel restores saved values in the target app. Organisation fields remain read-only. |
| UX-21 | Learning cards | Show title, due date, approved percentage, progress bar and learning status. Update progress opens a form. Required completion evidence must exist for 100% when required. Keep approved value unchanged while a proposed update is pending. Prevent duplicate pending submissions. |
| UX-22 | Approval feedback | Show proposed value and Pending manager approval separately from approved progress. Rejection shows reason and permits corrected resubmission. Completion status and approval status are distinct. Preserve history in the target backend; the current prototype implements only part of that history. |
| UX-23 | Account drawer | A menu button beside the avatar toggles a right-side drawer, width 60%, extending from immediately below the top bar to screen bottom over bottom navigation. Slide in right-to-left and out left-to-right. Tap outside, tap toggle again, Escape or native back closes it. |
| UX-24 | Drawer appearance/content | Use translucent header navy, white foreground and glass-like blur, with an opaque accessible fallback. Contains One Cognizant and Log out. Open https://onecognizant.cognizant.com/ in the system browser. HTML uses a separate tab. The glass effect is a reference, not a promise of identical rendering on Android/iOS. |
| UX-25 | Log out | SDK manager immediately locks the session, clears app-owned secure credentials and persistent private storage, cancels refresh/in-flight protected work, clears app session/domain state and temporary files, then app resets navigation to login. Late responses cannot restore access. Do not clear unrelated application storage. Attempt remote revocation when supported; network failure must not prevent local logout. |

### Manager and administrator workspaces

| ID | Screen | Behaviour / acceptance |
| --- | --- | --- |
| UX-26 | Manager inbox | Cards show direct-report identity, request type, approved/proposed values, evidence and submission date. Approve applies the proposed change; Reject requires feedback. Pending state prevents double action; success removes request from inbox and updates associate view. No self-approval. Top-level manager needs a designated reviewer; do not silently approve. |
| UX-27 | Manager search/assignment | Search direct reports by name/ID, show no-result state, inspect relevant profile and select catalogue learning, required due date and optional instructions. Reject duplicate active learning assignment. Show success and refreshed list. |
| UX-28 | Admin role editor | Search organisation by name/ID; select a person; edit independent Associate/Manager/Admin checkboxes and Save. At least one role and one active admin remain. Reassign direct reports before removing Manager. Job title/reporting links are not implicitly rewritten. Refresh effective role state and audit the change. |

## Prototype and target differences

The HTML prototype remains a demo: no real SSO, biometrics, pinning, native storage or server authorization. Full editing/cancellation, full rejection history, file cleanup/error paths, accessible native back handling and audit delivery are target requirements rather than completed features. The latest prototype walkthrough records known implementation limits. Do not infer implementation completion from this specification.

## References

- [Clickable prototype](prototypes/prototype.html)
- [Walkthrough](prototypes/walkthrough.md)
- [Repository ownership and work streams](../solution-design/06-repositories-and-workstreams.md)
- [Auth strategies and manager](../solution-design/07-auth-strategy-contract.md)
- [Runtime configuration](../solution-design/08-runtime-configuration.md)
