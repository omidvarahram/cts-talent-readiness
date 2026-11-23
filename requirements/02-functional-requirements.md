> Initial design baseline. Where behaviour differs, [current agreed requirements](../requirements/00-current-requirements.md) take precedence.

# Functional requirements

Status: confirmed feature intent with proposed acceptance details. Defaults are reviewable in the decision register.

| ID | Requirement | Acceptance scenario |
| --- | --- | --- |
| FR-01 | Sign in and sign out | Seeded valid credentials work; invalid credentials show a safe error; logout clears the account session and cached private data |
| FR-02 | Secure session persistence and biometric unlock | Relaunch can restore a valid session; cancellation, no enrolled biometric and revoked session have explicit outcomes; biometrics do not grant new server privileges |
| FR-03 | Multi-step profile | Personal details, skills, attachments and review steps validate; back navigation preserves draft; restart restores a saved draft for the same account |
| FR-04 | Avatar and camera | User can choose a supplied avatar or capture/select an image; denial, limited permission and cancellation are handled |
| FR-05 | PDF CV | Associate can upload/replace their CV; invalid type/oversize is rejected by the server; authorized manager can download the current CV |
| FR-06 | Personal assignments | Associate sees own training and improvement tasks with status, due date and progress; list handles empty/loading/error states |
| FR-07 | Progress and evidence | Associate updates own assignment and attaches evidence; duplicate retries do not create duplicate changes; failed attachments remain visibly incomplete |
| FR-08 | Manager dashboard | Manager sees assigned associates, profile completeness and activity summaries; unrelated users are inaccessible even by direct API call |
| FR-09 | Assign activities | Manager assigns a catalogue item to an authorized associate with due date; validation and duplicate submission are handled |
| FR-10 | Role administration | Admin grants/revokes manager capability; manager receives 403 for the same endpoint; last active admin cannot be removed |
| FR-11 | Multiple capabilities | A manager retains personal associate workflows; changing UI mode never changes server authorization |
| FR-12 | Runtime JSON configuration | App validates config, handles unavailable/invalid/expired config and uses safe bundled defaults; no secrets in JSON |
| FR-13 | Embedded learning | Approved WebView content exchanges schema-validated messages; unsupported origins, methods and malformed payloads are rejected |
| FR-14 | Custom native module | One small capability works through typed JS interface on Android/iOS; unsupported or failed native calls have a visible fallback |
| FR-15 | Offline operation | Cached own assignments and draft profile remain usable; queued progress reconciles after reconnection; conflicts do not silently overwrite server data |
| FR-16 | Navigation and links | Protected routes respect session/capability; unauthorized deep links cannot expose another associate's profile; back and unsaved-change handling work |
| FR-17 | Deterministic mock service | Resetting fixtures reproduces role, offline-conflict, pagination and upload scenarios; fault injection is available only in the learning environment |

Progress proposal: not_started, in_progress, completed; integer percentage 0–100, completed requires 100. Evidence requirement is configurable per catalogue item; completion is blocked while required evidence is not successfully uploaded. Approval workflow is not assumed.
