> Initial design baseline. Where behaviour differs, [current agreed requirements](./00-current-requirements.md) take precedence.

# State, forms and offline design

Separate server state, local workflow state and session state. Proposed tools: a server-query cache, a form library with schema validation, and React Context plus reducer for small app-level workflows. Evaluate specific libraries in an ADR. Complexity should come from real workflows, not duplicate stores.

| State | Owner | Persistence |
| --- | --- | --- |
| Session/unlock | Auth service/context | Refresh credential secure storage only |
| Assignment/profile response | Query layer | Selected encrypted per-user cache |
| Profile wizard | Form workflow | Encrypted versioned draft |
| UI mode/theme | App preferences | Non-secret preferences |
| Pending progress | Sync service | Encrypted per-user mutation queue |

Profile steps: identity/contact → skills/experience → image/CV → review. Final fields remain pending. Validate steps and final submission; support back/edit, keyboard avoidance, dirty-navigation prompt, draft schema migration and server field errors. File upload is a separate operation; a saved profile must reference only successfully uploaded files. Cancelled/replaced uploads require orphan cleanup.

## Offline contract

Core: read cached own assignments, edit profile drafts, queue own progress text/percentage. New login, role changes, task assignment, file upload and privileged dashboards require online access. Attachments may be selected while offline but remain local pending items and never count as submitted evidence. Avoid persisting temporary picker URIs as if they were durable files.

Queue record: id, userId, operation, assignmentId, payload, expectedVersion, idempotencyKey, createdAt, attempts, state. Replay FIFO per assignment after validated session recovery; different assignments may replay independently. Use bounded exponential backoff with jitter for transient failures. Connectivity indicators are hints; HTTP results decide availability.

- 401: refresh once, then pause until sign-in.
- 403: stop operation and inform user; never keep retrying revoked privileges.
- 409: fetch server version, present server/local values and require explicit reapply or discard.
- 422: show actionable validation error; do not retry automatically.
- 429/5xx/timeouts: bounded retry; respect Retry-After when supplied.

If killed after server acceptance but before acknowledgement, replay with the same key. Logout/account switch removes the previous account's queue and private caches after warning about unsent work. No pending mutation may replay under another identity. Background execution is best-effort; foreground reconnect is the guaranteed sync trigger. File transfer resumption and offline manager workflows are stretch work.
