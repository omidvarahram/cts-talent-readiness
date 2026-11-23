# Dummy REST API reference

## Run locally

Requires Node.js 22 or newer. No npm dependencies or installation step.

From the cloned repository root (`C:\projects\cts-talent-readiness` on this machine):

```powershell
cd dummy-backend
npm start
# In another terminal:
npm test
```

Default base URL: `http://127.0.0.1:3001/v1`. Public health/config URLs are outside /v1. HOST/PORT environment variables override binding. The default loopback binding is intentional. An Android emulator may use host address 10.0.2.2, but exposing a device-accessible listener requires an explicit development binding/network setup; real devices do not resolve the development machine via their own localhost.

This local server is HTTP, not an implemented HTTPS/pinning environment. Native pinning tests require a separately provisioned trusted HTTPS development endpoint. It is not safe to treat HTTP localhost success as pinning verification. Browser CORS is not enabled; the self-contained HTML prototype still uses its embedded fixture snapshot and is not connected to this server. React Native networking is the intended client.

## Read-only guarantee and limitations

The six JSON databases are read once at server startup, recursively frozen, and never written. Restart after editing seeds. GETs return seed snapshots. The only implemented POST, /auth/demo, validates a fictional email/ID and issues an expiring signed token in memory; it changes no database. There is no password, real SSO, refresh service, server-side logout/revocation, file upload/download or persisted session. App logout must remove its token locally; an already copied dummy token remains usable until expiry/server restart. Do not use real employee data or credentials.

Unimplemented domain mutations return 405 after authentication. Interactive edits remain in app-session mock state for this phase. The server therefore supports all specified read contracts below, not the production mutation workflows. [Future write contracts](write-contracts.md) describe the remaining operations.

## Headers and common types

| Header | Requirement |
| --- | --- |
| Authorization | `Bearer <access_token>` on every /v1 read; not needed for POST /v1/auth/demo |
| Content-Type | `application/json` for dummy token POST; maximum body 16 KiB |
| Accept | `application/json` recommended; server always responds JSON |
| X-Request-Id | Response-generated correlation identifier; included in error envelope |
| Cache-Control | Responses use no-store |

All GET endpoints have **no request body**. Unknown query parameters are ignored; clients should send only documented ones. All list endpoints accept limit (integer 1–100, default 20) and offset (nonnegative integer, default 0). q is a case-insensitive substring search only on the documented fields. Dates are YYYY-MM-DD; timestamps are ISO UTC strings. IDs are strings, including numeric organisation IDs.

```typescript
interface Page<T> {
  items: T[];
  total: number; // after scope and search/status filters, before pagination
  limit: number;
  offset: number;
  next_offset: number | null;
}
interface ApiError {
  error: { code: string; message: string; request_id: string };
}
type ApplicationRole = 'associate' | 'manager' | 'admin';
interface Identity {
  auth_user_id: string;
  associate_id: string;
  application_roles: ApplicationRole[];
}
interface AuthResponse {
  access_token: string;
  token_type: 'Bearer';
  expires_in: 3600;
  identity: Identity;
}
```

Token claims include sub, associate_id, roles[], issuer/audience and one-hour expiry. Tokens are HMAC-signed using an ephemeral process secret. Authorization rechecks identity/roles from the frozen seed, never a caller-supplied role header. The token and its signature are a dummy implementation, not a production identity-provider integration. Server restart invalidates issued tokens.

## Implemented endpoints

The paths in this table are relative to the /v1 base unless shown with an absolute public path.

| Method / URL | Access | Query or body | 200 response type |
| --- | --- | --- | --- |
| GET /health (public root) | Public | None | HealthResponse: status, mode, counts |
| GET /config.json (public root) | Public | None | RuntimeConfig; from example config with current issuedAt and one-day expiry |
| POST /auth/demo | Public; dummy identities only | JSON email:string, associate_id:string | AuthResponse |
| GET /me | Authenticated | None | Identity |
| GET /me/profile | Authenticated | None | Associate |
| GET /me/skills | Authenticated | limit, offset, q on title/description | Page<AssociateSkill> |
| GET /me/assignments | Authenticated | limit, offset, q on subject/learning_code | Page<LearningAssignment> |
| GET /learnings | Authenticated | limit, offset, q on subject/learning_code | Page<Learning> |
| GET /learnings/{learning_code} | Authenticated | Path ID | Learning |
| GET /skills | Authenticated | limit, offset, q on title/skill_code | Page<SkillCatalogueItem> |
| GET /associates | Scoped | limit, offset, q on associate_name/associate_id | Page<Associate> |
| GET /associates/{associate_id} | Scoped | Path ID | Associate |
| GET /associates/{associate_id}/profile | Scoped | Path ID | Associate; alias of preceding endpoint |
| GET /associates/{associate_id}/skills | Scoped | Path ID; limit, offset, q on title/description | Page<AssociateSkill> |
| GET /associates/{associate_id}/assignments | Scoped | Path ID; limit, offset, q on subject/learning_code | Page<LearningAssignment> |
| GET /assignments/{learning_assignment_id} | Assignment owner/scoped manager/admin | Path ID | LearningAssignment |
| GET /team | Manager role required, even if admin | limit, offset, q on associate_name/associate_id | Page<Associate> for direct reports only |
| GET /approvals | Scoped | limit, offset, optional status=pending/approved/rejected | Page<ApprovalRequest> |
| GET /approvals/{approval_request_id} | Owner/designated reviewer/admin | Path ID | ApprovalRequest |
| GET /admin/users | Admin only | limit, offset, q on associate_name/associate_id | Page<AdminUser> |

Scoped associate access means own record, direct reports when manager role is granted, or organisation-wide when admin. Manager-only users can still read their own person record; this does not grant them an Associate workspace. Approval scope is owner, designated manager reviewer, or admin. Search cannot widen scope. /team remains direct-report-specific rather than becoming an organisation-wide admin query.

## Response DTOs and DB mapping

| Type | Fields / source |
| --- | --- |
| Associate | Full record in associates.db.json: associate_id, auth_user_id, associate_name, associate_email, associate_group, associate_role, date_join, associate_manager:string/null, associate_direct_reports:string[], location, skills:AssociateSkill[], associate_status:StaffingStatus, learning_assignments:string[], is_active:boolean, date_leave:string/null, created_at, updated_at |
| StaffingStatus | Union: {status:'on_bench',unassigned_start_date:string} or {status:'assigned',assignment_code:string,start_date:string,end_date:string,assignment_role:string,billing_code:string} |
| AssociateSkill | skill_id, skill_code, title, description, expertise:'beginner'/'intermediate'/'advanced'/'expert', years_of_experience:number, last_used:string, approval_status:'approved'/'pending'/'rejected', evidence:FileReference/null |
| SkillCatalogueItem | skill_code:string, title:string; skills.db.json |
| Learning | learning_code, subject, seniority_level:string, target_associate_roles:string[], skills:string[], description:string, estimated_hours:number, certificate_required:boolean, is_active:boolean; learnings.db.json |
| LearningAssignment | learning_assignment_id, associate_id, learning_code, subject, date_assigned, date_due, status:'not_started'/'in_progress'/'completed', status_percentage:number, description:string, certificate_required:boolean, certificate:string/null, assigned_by:string, date_completed:string/null; learning_assignments.db.json |
| ApprovalRequest | approval_request_id, request_type:'skill', associate_id, skill_id, reviewer_id, status:'pending'/'approved'/'rejected', date_submitted:string, reviewed_at:string/null, rejection_reason:string/null; approval_requests.db.json. Current seed contains skill requests only. |
| AdminUser | Identity plus associate_name:string and associate_email:string |
| FileReference | Proposed {file_id:string,name:string,mime_type:string,size_bytes:number}; evidence is null in current fixtures. No file bytes are served. |
| RuntimeConfig | Fields in solution-design/runtime-config.example.json, with dynamically current issuedAt/expiresAt for this local response |
| HealthResponse | {status:'ok',mode:'read-only',counts:Record<string,number>} |

The current seed profile does not include phone/address/avatar/CV or onboarding completion; the app holds those editable fields in its current-session draft. A future persisted profile contract must add them explicitly. Do not assume these fields exist in a read response. Target progress approval histories and certificate files likewise require the future contracts, not fabricated GET data.

## Example requests and responses

```http
POST /v1/auth/demo HTTP/1.1
Host: 127.0.0.1:3001
Content-Type: application/json

{"email":"alex.morgan@example.com","associate_id":"6100001"}
```

```json
{
  "access_token": "<signed-demo-token>",
  "token_type": "Bearer",
  "expires_in": 3600,
  "identity": {
    "auth_user_id": "dummy-user-6100001",
    "associate_id": "6100001",
    "application_roles": ["admin", "manager", "associate"]
  }
}
```

```http
GET /v1/skills?q=aws&limit=20&offset=0 HTTP/1.1
Host: 127.0.0.1:3001
Authorization: Bearer <signed-demo-token>
Accept: application/json
```

```json
{
  "items": [{"skill_code":"SKL-001","title":"AWS"}],
  "total": 1,
  "limit": 20,
  "offset": 0,
  "next_offset": null
}
```

Use Noah Williams/noah.williams@example.com/6100009 for associate-only scope; Sophie Taylor/sophie.taylor@example.com/6100004 for direct-report manager scope; Alex Morgan/alex.morgan@example.com/6100001 for all roles. All are fictional.

## Errors

| Status | Typical codes / trigger |
| --- | --- |
| 400 | INVALID_JSON, INVALID_PAGINATION, INVALID_STATUS |
| 401 | UNAUTHENTICATED, INVALID_TOKEN, EXPIRED_TOKEN, IDENTITY_MISMATCH, INACTIVE_ACCOUNT |
| 403 | FORBIDDEN: role/relationship mismatch |
| 404 | NOT_FOUND: unknown route/resource |
| 405 | READ_ONLY for authenticated domain mutations; METHOD_NOT_ALLOWED for HEAD; Allow: GET |
| 413 | PAYLOAD_TOO_LARGE: dummy-login body exceeds 16 KiB |
| 415 | UNSUPPORTED_MEDIA_TYPE: dummy-login body is not JSON |
| 422 | VALIDATION_ERROR: missing/invalid dummy identity fields |
| 500 | INTERNAL_ERROR: generic response, no stack or secret |

Validation errors share ApiError; field-level errors are a future extension. Lists are deterministic fixture order with offset pagination, not cursor pagination. Earlier API drafts using nextCursor are superseded for this implementation.

## Verification

server.test.mjs runs live loopback HTTP calls, checking every implemented read route, three identity scopes, missing/tampered/expired tokens, pagination/search validation, refused mutations and byte-hash equality of all DB files before/after requests. Tests passed in the available Node runtime. Native network, HTTPS/pinning and device connectivity remain unverified.

See [OpenAPI JSON](openapi.json), [write contracts](write-contracts.md) and [architecture diagrams](../solution-design/09-system-design-and-diagrams.md).
