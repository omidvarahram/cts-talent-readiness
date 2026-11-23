# Future mutation contracts — not implemented

These operations are required by the target app UX but deliberately excluded from the read-only Node server. Calls currently receive 405 when authenticated. In the learning app, implement these interfaces through session-only mock repositories, without modifying the seed DBs. A production implementation must use real authenticated server storage and permission checks.

All paths are under /v1. Use Authorization: Bearer, Accept: application/json and Content-Type: application/json except multipart file upload. For repeatable domain writes use an account-scoped Idempotency-Key and expected_version for conflicting updates. Versioning/idempotency are future features, not implemented by the read-only server.

| Method / path | JSON body or multipart input | Access | Target response |
| --- | --- | --- | --- |
| PATCH /me/profile | {name:string,phone:string,address:string,avatar_file_id?:string/null,cv_file_id?:string/null,expected_version:number} | Own record | 200 Profile with version, updated_at; immutable identity/job/manager fields rejected |
| POST /me/skills | {skill_code:string,expertise:enum,years_of_experience:number,last_used:date,description:string,evidence_file_id?:string} | Own record | 201 {skill:AssociateSkill,approval:SkillApprovalRequest} |
| PATCH /me/skills/{skill_id} | Editable skill fields plus expected_version | Owner; reject duplicate pending change | 202 SkillApprovalRequest; existing approved record unchanged |
| PATCH /assignments/{id}/progress | {status_percentage:number,certificate_file_id?:string,expected_version:number} | Assignment owner | 202 ProgressApprovalRequest with old/proposed values |
| POST /files | multipart purpose:'avatar'/'cv'/'skill_evidence'/'certificate', file:binary | Authenticated owner | 201 FileReference after validation; pending upload is not evidence |
| GET /files/{id}/content | No body; authenticated scoped request | File owner/scoped authorised reader | 200 binary content with correct MIME and safe Content-Disposition; separate from read-only seed API |
| POST /approvals/{id}/decision | {decision:'approved'/'rejected',reason?:string,expected_version:number} | Designated manager; never requester | 200 ApprovalDecisionResult; rejection requires reason; approval atomically applies proposed value |
| POST /associates/{id}/assignments | {learning_code:string,date_due:date,instructions?:string} | Direct-report manager (admin policy must be explicit) | 201 LearningAssignment; duplicate active learning rejected |
| PATCH /admin/users/{id}/roles | {application_roles:ApplicationRole[],expected_version:number} | Admin | 200 AdminUser/version; protect final admin, at least one role, resolve manager reports |
| POST /auth/refresh | {refresh_token:string} or provider-specific protected exchange | Valid recoverable session | 200 provider session; rotation/reuse detection required |
| POST /auth/logout | Session identified by verified access/refresh context | Current identity | 204; idempotent revocation; local purge never waits indefinitely |

## Additional types

```typescript
interface Profile {
  associate_id: string;
  name: string;
  phone: string;
  address: string;
  avatar_file_id: string | null;
  cv_file_id: string | null;
  onboarding_completed: boolean;
  version: number;
  updated_at: string;
}
interface ProgressApprovalRequest {
  approval_request_id: string;
  request_type: 'progress';
  associate_id: string;
  learning_assignment_id: string;
  reviewer_id: string;
  approved_percentage: number;
  proposed_percentage: number;
  certificate_file_id: string | null;
  status: 'pending' | 'approved' | 'rejected';
  version: number;
}
interface SkillApprovalRequest {
  approval_request_id: string;
  request_type: 'skill';
  associate_id: string;
  skill_id: string;
  reviewer_id: string;
  proposed_skill: AssociateSkill;
  status: 'pending' | 'approved' | 'rejected';
  version: number;
}
type ApprovalDecisionResult = {
  approval: SkillApprovalRequest | ProgressApprovalRequest;
  updated_resource: AssociateSkill | LearningAssignment | null;
};
```

Scope and validation errors: 400 malformed, 401 unauthenticated, 403 forbidden, 404 missing, 409 version/duplicate conflict, 413 too large, 415 invalid file type, 422 field/business validation, 429 bounded throttling. Add field_errors and version metadata to the future ApiError contract explicitly. Server checks content signature/type, ownership, file safety and evidence readiness; extension-only browser checks are insufficient.

The third-party SSO exchange is provider-specific. Do not pretend POST /auth/demo is a real OAuth exchange. Demo login has no refresh credential and must repeat dummy SSO after token expiry/restart. Native auth strategy adapters can simulate refresh for separate SDK tests, clearly labelled as a different test harness.
