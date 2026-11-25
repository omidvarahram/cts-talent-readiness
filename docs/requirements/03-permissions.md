> Initial design baseline. Where behaviour differs, [current agreed requirements](./00-current-requirements.md) take precedence.

# Permissions and account model

Roles are additive capabilities, not mutually exclusive modes. Every active person has associate capabilities. A manager additionally has a defined managed-associate scope. Admin adds global management and role administration. UI modes are presentation only.

| Action | Associate | Manager | Admin |
| --- | --- | --- | --- |
| Edit own profile/CV/image | Own | Own | Own |
| View/update own assignments and evidence | Own | Own | Own |
| Inspect associate profiles and progress | Own | Assigned associates | All associates |
| Download associate CV | Own | Assigned associates | All associates |
| Assign activity | No | Assigned associates | All associates |
| Change someone else's progress | No | No by default | No by default |
| Grant/revoke manager capability | No | No | Yes |
| Change admin capability | No | No | Deferred; seeded admins initially |

Proposed rules:

- No self-assignment through manager endpoints. Use admin assignment or another manager for the manager's own learning tasks.
- Manager relationships are explicit records, independent of capabilities; admins maintain relationships in the mock service.
- Prevent self-management relationships and relationship cycles for the initial hierarchy.
- Revoking manager capability removes management access even if stale relationship records remain. Existing personal assignments stay intact.
- Enforce permissions on every API and file download using current server-side account state. Token role claims alone may become stale.
- On role revocation, reject the next privileged request and remove restricted cached views on refresh/403. Offline manager/admin data is disabled initially.

Closed (2026-11-24) — see [ADR-002](../solution-design/decisions/ADR-002-product-defaults.md):

- Managers see **direct reports only**; admins search organisation-wide.
- One manager per associate for v1; no multi-manager relationships.
- Reporting relationships stay in seed/session fixtures; no admin relationship-editor UI in the first release.
- Top-level manager submissions route to configurable `topLevelReviewerAssociateId` in runtime config.
