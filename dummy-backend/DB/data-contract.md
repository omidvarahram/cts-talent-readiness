# Skills and approvals data contract

Updated 23 November 2026. Skills are structured objects in associates.db.json, replacing the original string array.

| Field | Type / rule |
| --- | --- |
| skill_id | Unique associate-skill record identifier |
| skill_code | References skills.db.json |
| title | Catalogue title |
| description | Required project usage description |
| expertise | beginner, intermediate, advanced, expert |
| years_of_experience | Number, 0–60 |
| last_used | Required ISO date, not in the future |
| approval_status | approved, pending, rejected |
| evidence | null or file reference metadata; no real files in seed |

approval_requests.db.json contains approval_request_id, request_type, associate_id, skill_id, reviewer_id, status, date_submitted, reviewed_at and rejection_reason. reviewer_id must match the associate’s manager for these seeded skill requests. Request status and skill approval status must agree.

The seed contains 40 people, 243 skill records, 16 catalogue skills and seven pending skill approval requests. Existing auth mappings, 10 learnings and 142 learning assignments retain their relationships. The browser prototype embeds the same fixture snapshot and adapts field names to its session-only view model.

## Persistence

JSON files are seed references. Prototype edits do not write back to JSON. Reload resets domain state and keeps only the fictional login marker. A native implementation should retain only authentication material securely under the agreed demo contract.

## Historical generator

The generation-reference.md file preserves the original generator and produces the old string-only skill schema. It is historical, not a current rebuild command. Use the JSON fixtures and this contract as authoritative.
