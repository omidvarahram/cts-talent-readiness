# ADR-001: Single npm monorepo with three product workspaces

Status: accepted

Date: 2026-11-24

Owner: project maintainer

## Context

Earlier drafts proposed three independent Git repositories for UI, SDK and app. The learning goal needs local iteration, clear package boundaries and one lockfile. Nested Git repositories would confuse ownership and CI.

## Options

1. Three separate remotes with published private packages
2. One Git monorepo with npm workspaces and independently packable UI/SDK
3. Single app package without library boundaries

## Decision

Use one Git monorepo (`cts-talent-readiness`) with npm workspaces: `packages/ui`, `packages/sdk`, `apps/mobile`, plus existing `dummy-backend`. Package names: `@cts-talent/ui` and `@cts-talent/sdk` (local-only learning scope; replace before real publication). Do not create nested `.git` directories.

Allowed imports: app → UI/SDK; UI never imports SDK/app; SDK core never imports UI, app routes or React Native globals; RN adapters live under `@cts-talent/sdk/react-native`.

## Consequences

Simpler learner setup and one lockfile. UI/SDK remain packable via `npm pack`. A later split into remotes remains possible without rewriting domain boundaries.

## Verification

Root `npm install` discovers all workspaces; UI and SDK pack without fixtures/secrets; import-boundary lint or typecheck fails when UI imports SDK.

## Revisit when

A real private registry publication requires independently versioned remotes, or workspace install becomes unmanageable.
