# Clone and path migration audit

Date: 23 November 2026. Target: C:\projects\cts-talent-readiness. Remote configured in the clone: https://github.com/omidvarahram/cts-talent-readiness, local branch master at inspection.

## Inspection before this documentation rewrite

| Check | Result |
| --- | --- |
| Original project files | All 48 present; text content matched the original project copy |
| Missing copied files | None found |
| Markdown relative file links | No broken targets found |
| API fixture paths | Module-relative new URL paths remain correct after relocation |
| Prototype | Self-contained HTML with embedded CSS/JS/data; no relocated asset dependency |
| JSON/OpenAPI data | Present and parseable; linked seed data retained |
| API integration at new path | Passed live loopback route/scope/token/response-contract and unchanged-DB hash checks |
| Old absolute path | Found in dummy-backend/API.md startup instructions; changed to cd dummy-backend from repository root |
| Local instructions | No AGENTS.md found at C:/, C:/projects or repository root during inspection |

Final git status --short was inspected successfully. README.md and the dummy-backend, requirements, solution-design and user-stories trees are currently untracked. They have not yet been added/committed to this clone. No commit, branch change, package installation or push was performed. Existing remote/branch were read locally, not verified against GitHub.

## Missing implementation scaffolding: expected, not lost in the move

The clone contains documentation, backend/prototype and data. It does not yet contain the three product workspaces or their root build pipeline. Humans should create these through FND/APP setup stories:

- Root private npm workspace manifest and single lockfile, TypeScript base/project configs and root scripts.
- packages/ui, packages/sdk and apps/mobile project sources/manifests/public exports.
- Workspace unit-test configuration and SDK 100/UI 90/app 70 coverage gates.
- Git ignore rules for node_modules, Expo/native build output, coverage, local env/secrets and packed artifacts as appropriate.
- CI, package release/version policy, owned npm scope/registry access and pack/dry-run workflow.
- Expo/native development-client configuration and Android/iOS environment evidence.

These are documented tasks, not automatically generated solutions. The supporting backend already has its own package.json and Node integration tests; do not mistake them for the missing root package/test setup.

## Design corrections made now

- One Git monorepo with three product workspaces supersedes three separate product repositories.
- UI and SDK remain independently publishable, with local workspace/tarball consumption as the default learning path.
- Replaced feature-first backlog with 67 sequenced human-learning stories: eight foundation, 14 UI, 20 SDK and 25 app.
- Exact toolchain/native package compatibility must be established by a human spike; the plan does not claim a working Expo app exists.
- Preserve real provider/native pinning constraints and read-only API limitations; app-session repositories still simulate mutations.

## Portability expectations

Use relative Markdown links and import.meta.url-relative API data reads. Setup examples may mention this machine's clone path, but scripts/config must not depend on it. A fresh clone at another absolute location should keep links/API reads valid. The standalone prototype remains a review artifact and is not automatically connected to the local server.

Read [learning solution design](10-human-learning-implementation-plan.md), [setup guide](12-setup-and-tooling-guide.md) and [new backlog](../user-stories/README.md).

## Final documentation checks

After the rewrite: 59 reference/source files, 10 parseable JSON files, 67 detailed learning stories, 665 valid local Markdown links/anchors and no stale original-workspace absolute paths. Story prerequisites form an acyclic graph. The API relocation integration suite passed. No native app/package coverage or device run is claimed; those are explicit human stories.
