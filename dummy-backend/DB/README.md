# Dummy organisation database

All records are fictional. Snapshot date: 2026-11-20. Emails use example.com. Certificate links are placeholders, not real certificates. Each JSON file contains a top-level array.

## Files and relationships

- `associates.db.json`: 40 people. `associate_manager` references `associate_id`. `associate_direct_reports` is a derived snapshot of the inverse relationship. `learning_assignments` contains IDs referencing `learning_assignments.db.json`.
- `learnings.db.json`: 10 reusable learning definitions covering foundation, intermediate, advanced and leadership levels. `target_associate_roles` refers to job titles, not application permissions.
- `learning_assignments.db.json`: 142 assignments. `associate_id` references a person, `learning_code` references the learning catalogue and `assigned_by` references a manager. Assignment subject, description and certificate requirement are snapshots of the catalogue at assignment time.
- `auth_users.db.json`: dummy authentication mappings and trusted application roles. Join to people using `auth_user_id` or `associate_id`. No credentials or tokens are included. Production roles must come from verified authorization data, never a client-editable file.

## Scenario coverage

The five managers are additional to the three admins. There are six users with the manager application role because one admin is also a manager.

| Associate ID | Name | Application roles | Staffing status | Learning assignments |
| --- | --- | --- | --- | --- |
| 6100001 | Alex Morgan | admin, manager, associate | on_bench | Yes |
| 6100002 | Priya Sharma | admin, associate | assigned | None |
| 6100003 | Daniel Chen | admin, associate | on_bench | Yes |
| 6100004 | Sophie Taylor | manager, associate | on_bench | Yes |
| 6100005 | Omar Hassan | manager, associate | on_bench | Yes |
| 6100006 | Grace Wilson | manager | assigned | None |
| 6100007 | Liam Nguyen | manager, associate | assigned | None |
| 6100008 | Amelia Patel | manager | assigned | None |
| 6100009–6100040 | Remaining 32 people | associate | on_bench | Yes |

The requested admin scenarios all include the associate role, so there is deliberately no admin-only person. Manager-only users still have complete person records. Role tabs are determined exclusively by `application_roles`.

There are 36 people on bench and four assigned. Every bench person has learnings matched to their job seniority. Progress includes 0%, 25%, 50%, 75% and 100%, mapped to `not_started`, `in_progress` and `completed`. Completed certificate-required assignments contain a placeholder certificate URL. Dates are ISO 8601. Staffing status supports one active assignment per person.

## Validation

The creation script checks unique IDs and emails, requested cohort counts, manager cycles, direct-report consistency, assignment links, learning relevance, status/progress consistency, certificate requirements and JSON round trips before completing. All checks passed for this snapshot.

[Generation reference](../generation-reference.md) preserves the deterministic creation logic as Markdown.

## Updated skill fixtures

- [Skill catalogue](skills.db.json): 16 searchable titles.
- [Approval requests](approval_requests.db.json): seven pending skill requests linked to associates, skills and managers.
- [Data contract](data-contract.md): structured fields, validation and lifecycle.

Associates now hold 243 structured skill records rather than strings. Original creation checks describe the historical generator; the updated fixtures were separately validated for unique skill IDs, catalogue references, experience/date limits and approval-manager consistency.
