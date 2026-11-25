> Initial design baseline. Where behaviour differs, [current agreed requirements](./00-current-requirements.md) take precedence.

# Domain, REST API and mock service

## Proposed domain

| Entity | Principal fields and rules |
| --- | --- |
| User | id, email, displayName, capabilities[], active; synthetic identity only |
| ManagerRelationship | managerId, associateId; authorization scope |
| Profile | userId, contact details TBD, skills[], avatarFileId or avatarKey, cvFileId, version, updatedAt |
| Activity | id, type training/improvement, title, description, requiresEvidence |
| Assignment | id, activityId, associateId, assignedBy, dueDate, status, progress, version |
| Evidence | id, assignmentId, fileId, note, createdBy, createdAt |
| File | id, ownerId, purpose, detectedMime, size, privateStorageKey, uploadStatus |
| Session | id, userId, refreshTokenHash, expiresAt, revokedAt |
| AuditEvent | actorId, action, targetId, timestamp, correlationId; redact payloads |

Dates use UTC ISO timestamps; due dates use YYYY-MM-DD with a documented business timezone. Percentage is an integer. Server-generated IDs and timestamps are authoritative. Deletion/retention policies are pending.

## Draft endpoint catalogue

All routes below are under /v1 except runtime config. Authentication and scope checks apply to file routes as well as JSON routes.

| Method | Route | Purpose/access |
| --- | --- | --- |
| POST | /auth/login | Seeded credential validation; return access/refresh tokens |
| POST | /auth/refresh | Rotate refresh token; reject reuse/revocation |
| POST | /auth/logout | Revoke session; idempotent |
| GET | /me | Current identity and capabilities |
| GET, PATCH | /me/profile | Own profile with optimistic version control |
| GET | /me/assignments | Own paginated/filterable assignments |
| PATCH | /assignments/:id/progress | Owner only; version and idempotency key required |
| POST | /assignments/:id/evidence | Owner links an authorized completed upload |
| POST | /files | Authenticated multipart upload with purpose and ownership validation |
| GET | /files/:id/content | Authorized download; no public file directory |
| GET | /activities | Catalogue |
| GET | /associates | Manager scope/admin global; pagination and filtering |
| GET | /associates/:id/profile | Scoped profile view |
| GET | /associates/:id/assignments | Scoped progress view |
| POST | /associates/:id/assignments | Manager/admin assignment |
| GET | /admin/users | Admin user lookup |
| PATCH | /admin/users/:id/capabilities | Admin grant/revoke manager only |
| PUT, DELETE | /admin/relationships/:managerId/:associateId | Proposed relationship maintenance |
| GET | /runtime-config.json | Public non-secret, validated runtime configuration |

List envelope: items, nextCursor. Error envelope: code, safe message, fieldErrors if relevant, correlationId. Use 400 malformed, 401 unauthenticated, 403 unauthorized, 404 absent or deliberately concealed resource, 409 version conflict, 413 too large, 415 unsupported media, 422 invalid domain data, 429 throttled, 500 unexpected error. Final schemas and examples belong in a later contract deliverable.

PATCH supplies expectedVersion; successful writes increment version. Mutations supporting retries accept an account-scoped Idempotency-Key, retain result and request hash, and reject the same key with a different body. Define retention duration before implementing the offline queue.

## Mock fidelity

Use deterministic JSON seeds with in-memory working state initially; local file storage and optional snapshot persistence are proposals. Provide reset, fake clock, configurable latency, expired sessions, rate limiting, upload rejection and version conflicts through development-only controls. Include associate, manager+associate, admin, unrelated associate, unassigned associate and revoked manager fixtures. Reset must clear sessions, files and idempotency history consistently.

Run ordinary local HTTP only for early non-sensitive exercises; use an HTTPS test endpoint with a trusted development certificate for the pinning lab. The entire service remains synthetic and mocked, including identity and file review; no real company identity or employee documents are needed.
