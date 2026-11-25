# Foundations, monorepo and distribution

Status: implementation work for humans. The repository currently contains documentation, fixtures and the supporting API/prototype, not these native workspaces. Do not interpret estimates or story descriptions as evidence of completion.

Read [learning solution design](../solution-design/10-human-learning-implementation-plan.md) first and use the [backlog map](README.md) to find prerequisites. All stories are required unless an explicitly described platform limitation is recorded. Each day below is six focused hours for a developer familiar with the tools; learner elapsed time is discussed in the backlog map.

## Stories

| ID | Outcome | Focused person-days | Prerequisites |
| --- | --- | --- | --- |
| [FND-01](#fnd-01) | Understand the clone and agree the monorepo boundaries | 0.5–1 | Read solution design |
| [FND-02](#fnd-02) | Create npm workspaces and choose a compatible toolchain | 1–2 | [FND-01](00-foundations-and-tooling.md#fnd-01) |
| [FND-03](#fnd-03) | Set up strict TypeScript and project source boundaries | 1–1.5 | [FND-02](00-foundations-and-tooling.md#fnd-02) |
| [FND-04](#fnd-04) | Install unit-test harnesses and coverage gates in all projects | 1.5–2.5 | [FND-02](00-foundations-and-tooling.md#fnd-02), [FND-03](00-foundations-and-tooling.md#fnd-03) |
| [FND-05](#fnd-05) | Add formatting, lint, contribution rules and CI | 1–1.5 | [FND-03](00-foundations-and-tooling.md#fnd-03), [FND-04](00-foundations-and-tooling.md#fnd-04) |
| [FND-06](#fnd-06) | Prepare package manifests, exports and local tarball consumption | 1–2 | [FND-02](00-foundations-and-tooling.md#fnd-02), [FND-03](00-foundations-and-tooling.md#fnd-03) |
| [FND-07](#fnd-07) | Prepare npm registry access and a human-controlled release workflow | 1–1.5 | [FND-06](00-foundations-and-tooling.md#fnd-06) |
| [FND-08](#fnd-08) | Review setup as a learner and establish the implementation baseline | 0.5–1 | [FND-04](00-foundations-and-tooling.md#fnd-04), [FND-05](00-foundations-and-tooling.md#fnd-05), [FND-06](00-foundations-and-tooling.md#fnd-06) |

## FND-01

### Understand the clone and agree the monorepo boundaries

**User story:** As a project contributor, I want to understand the clone and agree the monorepo boundaries so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | Foundations, monorepo and distribution |
| Suggested location | Repository root and shared setup, without implementing feature code |
| Dependencies | Approved solution design |
| Requirement trace | Architecture |
| Focused estimate | 0.5–1 person-days (six focused hours/day) |
| Coverage gate | SDK 100%, UI 90%, app 70% on statements, branches, functions and lines; maintain while adding code |

### Learning context

A Git repository is a versioned source tree; an npm workspace is a package inside it. They are not interchangeable.

### Work step by step

1. Read the audit, current UX and learning solution design.
2. Identify the three product projects and supporting read-only backend; draw the allowed import directions.
3. Agree naming/branch/review conventions; record who owns UI, SDK, app and reviews.

### Acceptance criteria

- Existing documentation/fixtures remain intact.
- Explain why nested Git repositories are unnecessary and why package boundaries still matter.
- Create a written architecture decision for one monorepo, not three new remotes.

### Tests and failure cases

Review the diagram and demonstrate an import that should be forbidden.

### Hints

Do not initialise Git again inside packages/ui or packages/sdk.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to FND-01; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## FND-02

### Create npm workspaces and choose a compatible toolchain

**User story:** As a project contributor, I want to create npm workspaces and choose a compatible toolchain so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | Foundations, monorepo and distribution |
| Suggested location | Repository root and shared setup, without implementing feature code |
| Dependencies | [FND-01](00-foundations-and-tooling.md#fnd-01) |
| Requirement trace | Architecture |
| Focused estimate | 1–2 person-days (six focused hours/day) |
| Coverage gate | SDK 100%, UI 90%, app 70% on statements, branches, functions and lines; maintain while adding code |

### Learning context

Workspaces link local packages; the lockfile resolves the complete reproducible dependency tree.

### Work step by step

1. Select compatible Node/npm/Expo/React/RN/Jest versions from official docs and record them.
2. Create a private root package.json with workspaces for apps/*, packages/* and dummy-backend; create private placeholder manifests where needed.
3. Generate and commit one root lockfile; document root install/clean-clone commands and package identities.

### Acceptance criteria

- Root installation discovers all workspaces.
- UI/SDK have unique intended package names and root/app/backend cannot be published.
- A clean install reproduces the selected toolchain without committing node_modules.

### Tests and failure cases

Use a disposable clean checkout/consumer to run npm ci and inspect npm ls for duplicate React versions.

### Hints

Use normal matching semver for local package links; adding multiple lockfiles makes reproducibility harder.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to FND-02; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## FND-03

### Set up strict TypeScript and project source boundaries

**User story:** As a project contributor, I want to set up strict TypeScript and project source boundaries so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | Foundations, monorepo and distribution |
| Suggested location | Repository root and shared setup, without implementing feature code |
| Dependencies | [FND-02](00-foundations-and-tooling.md#fnd-02) |
| Requirement trace | Architecture |
| Focused estimate | 1–1.5 person-days (six focused hours/day) |
| Coverage gate | SDK 100%, UI 90%, app 70% on statements, branches, functions and lines; maintain while adding code |

### Learning context

TypeScript checks contracts before runtime; Babel/Metro transformation and declaration emission solve different problems.

### Work step by step

1. Create a strict base tsconfig and workspace-specific configurations for SDK core, UI TSX and mobile.
2. Define src/public exports and output paths; choose SDK/UI declaration build rules.
3. Add root and workspace typecheck scripts; document why the SDK core must import without React Native.

### Acceptance criteria

- Invalid types fail typecheck in the correct workspace.
- UI JSX and app Expo settings do not leak into SDK core.
- Document how built exports resolve from a package consumer without relying on app-only aliases.

### Tests and failure cases

Add temporary wrong assignments/missing imports to prove the gate, then remove them.

### Hints

Do not point exports at a dist file that has never been built.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to FND-03; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## FND-04

### Install unit-test harnesses and coverage gates in all projects

**User story:** As a project contributor, I want to install unit-test harnesses and coverage gates in all projects so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | Foundations, monorepo and distribution |
| Suggested location | Repository root and shared setup, without implementing feature code |
| Dependencies | [FND-02](00-foundations-and-tooling.md#fnd-02), [FND-03](00-foundations-and-tooling.md#fnd-03) |
| Requirement trace | Coverage |
| Focused estimate | 1.5–2.5 person-days (six focused hours/day) |
| Coverage gate | SDK 100%, UI 90%, app 70% on statements, branches, functions and lines; maintain while adding code |

### Learning context

Coverage counts executed code; behaviour assertions prove that execution produces the right outcome. Both are required.

### Work step by step

1. Configure SDK Jest Node environment and UI/app compatible RN/Expo presets.
2. Add test, test:watch and test:coverage scripts per project; configure collectCoverageFrom for all owned source.
3. Set all four metrics to SDK 100/UI 90/app 70 and add one meaningful smoke test to each workspace.

### Acceptance criteria

- Root test commands report individual workspace failure without swallowing it.
- New unimported executable code appears as uncovered.
- No passWithNoTests or auth/adapter exclusions bypass the thresholds.

### Tests and failure cases

Demonstrate one failed test and one failed coverage threshold, then restore green checks.

### Hints

Use mocks for native bridges in unit tests; do not claim that a mocked biometric prompt tests device security.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to FND-04; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## FND-05

### Add formatting, lint, contribution rules and CI

**User story:** As a project contributor, I want to add formatting, lint, contribution rules and CI so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | Foundations, monorepo and distribution |
| Suggested location | Repository root and shared setup, without implementing feature code |
| Dependencies | [FND-03](00-foundations-and-tooling.md#fnd-03), [FND-04](00-foundations-and-tooling.md#fnd-04) |
| Requirement trace | Quality |
| Focused estimate | 1–1.5 person-days (six focused hours/day) |
| Coverage gate | SDK 100%, UI 90%, app 70% on statements, branches, functions and lines; maintain while adding code |

### Learning context

A repeatable PR workflow prevents local-only success and creates reviewable learning evidence.

### Work step by step

1. Choose compatible lint/format tooling and add root commands.
2. Create CI that installs from lockfile, typechecks, runs workspace tests/coverage and existing API integration tests.
3. Write a PR template requiring story ID, explanation, demo evidence and tests.

### Acceptance criteria

- A failing workspace blocks CI.
- CI does not expose tokens or require public package publication.
- Contributors can explain each CI stage and reproduce it locally.

### Tests and failure cases

Make a deliberate lint/type/test failure on a branch and show that the relevant CI stage rejects it.

### Hints

Start with clear ordinary scripts before adding a task runner or caching complexity.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to FND-05; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## FND-06

### Prepare package manifests, exports and local tarball consumption

**User story:** As a project contributor, I want to prepare package manifests, exports and local tarball consumption so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | Foundations, monorepo and distribution |
| Suggested location | Repository root and shared setup, without implementing feature code |
| Dependencies | [FND-02](00-foundations-and-tooling.md#fnd-02), [FND-03](00-foundations-and-tooling.md#fnd-03) |
| Requirement trace | Distribution |
| Focused estimate | 1–2 person-days (six focused hours/day) |
| Coverage gate | SDK 100%, UI 90%, app 70% on statements, branches, functions and lines; maintain while adding code |

### Learning context

A workspace symlink can hide missing packaged files; npm pack tests the actual consumer artifact.

### Work step by step

1. Define files, types, exports, version, licence/README and React/RN peer policy for UI and SDK.
2. Add build and prepack checks; keep fixtures, tests, secrets and app code out of packed artifacts.
3. Build and npm pack each library, then install tarballs in a clean sample consumer.

### Acceptance criteria

- Both packages resolve their public entry points and declarations outside the monorepo.
- Packed SDK core imports in Node without RN.
- Local tarball workflow is documented and does not publish to a registry.

### Tests and failure cases

Inspect npm pack --dry-run output and run a consumer typecheck/import.

### Hints

An npm registry is not needed for local workspace linking or tarball installation.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to FND-06; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## FND-07

### Prepare npm registry access and a human-controlled release workflow

**User story:** As a project contributor, I want to prepare npm registry access and a human-controlled release workflow so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | Foundations, monorepo and distribution |
| Suggested location | Repository root and shared setup, without implementing feature code |
| Dependencies | [FND-06](00-foundations-and-tooling.md#fnd-06) |
| Requirement trace | Distribution |
| Focused estimate | 1–1.5 person-days (six focused hours/day) |
| Coverage gate | SDK 100%, UI 90%, app 70% on statements, branches, functions and lines; maintain while adding code |

### Learning context

A package name, scope, visibility and registry are separate choices; publication is an external action.

### Work step by step

1. Choose an owned scope and npmjs/private registry/local-only mode; record visibility and access requirements.
2. Document human account login/2FA or trusted publishing setup with no committed credentials.
3. Prepare version/changelog/prerelease and dry-run CI steps; document the manual publish and rollback/deprecation procedure.

### Acceptance criteria

- A local developer can pack without registry access.
- An authorised human can identify exactly what would publish and where.
- No actual publish/account mutation occurs as part of preparing this story unless separately authorised by the owner.

### Tests and failure cases

Use a dry run and inspect the tarball; verify no credentials/DBs/company artwork are included.

### Hints

A placeholder @your-scope must be replaced before real publication; do not assume you own @cts.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to FND-07; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## FND-08

### Review setup as a learner and establish the implementation baseline

**User story:** As a project contributor, I want to review setup as a learner and establish the implementation baseline so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | Foundations, monorepo and distribution |
| Suggested location | Repository root and shared setup, without implementing feature code |
| Dependencies | [FND-04](00-foundations-and-tooling.md#fnd-04), [FND-05](00-foundations-and-tooling.md#fnd-05), [FND-06](00-foundations-and-tooling.md#fnd-06) |
| Requirement trace | Learning |
| Focused estimate | 0.5–1 person-days (six focused hours/day) |
| Coverage gate | SDK 100%, UI 90%, app 70% on statements, branches, functions and lines; maintain while adding code |

### Learning context

A project is ready when another person can reproduce setup and explain it, not when a manifest exists.

### Work step by step

1. Ask a second learner to follow setup from a clean clone.
2. Record tool versions, successful commands, limitations and unresolved native compatibility decisions.
3. Tag/document the setup checkpoint and agree the order UI → SDK → app.

### Acceptance criteria

- Second person can install, typecheck, test and pack from instructions.
- Coverage targets and package boundaries are visible in CI output.
- Remaining work is mapped to the component/feature stories below.

### Tests and failure cases

Perform a teach-back of npm workspaces, peer dependencies, TypeScript and test presets.

### Hints

Keep errors and their fixes in a troubleshooting section instead of relying on chat memory.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to FND-08; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.
