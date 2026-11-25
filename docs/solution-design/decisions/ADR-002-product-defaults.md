# ADR-002: Product defaults for permissions and approvals

Status: accepted

Date: 2026-11-24

Owner: project maintainer

## Context

[`requirements/03-permissions.md`](../../requirements/03-permissions.md) left manager visibility, multi-manager relationships and reporting maintenance open. [`requirements/00-current-requirements.md`](../../requirements/00-current-requirements.md) left the top-level manager reviewer unresolved. Implementation cannot proceed without defaults for a learning project.

## Options

See historical proposals in [decisions README](README.md) D03/D06 and current requirements approval rules.

## Decision

1. **Manager visibility:** managers see and act on **direct reports only**. Admins search organisation-wide.
2. **Reporting relationships:** one manager per associate in seed data; no multi-manager for v1. Admins do **not** get a reporting-relationship editor in the first app release; relationships stay in seed/session fixtures.
3. **Top-level manager reviewer:** configurable `topLevelReviewerAssociateId` in bundled runtime config (default: first seeded admin associate). Session approval repositories route top-level manager submissions to that reviewer. Never allow self-approval.
4. **Mutations:** reads from dummy-backend; writes through SDK interfaces shaped like [`write-contracts.md`](../../dummy-backend/write-contracts.md), backed by session-only repositories (process kill resets domain state). Swap-ready for a future HTTP write client.

## Consequences

Matches current agreed journeys. Avoids building admin hierarchy UI early. Config must be documented so learners can change the top-level reviewer without code changes.

## Verification

Manager cannot load non-report associate detail (403/empty). Top-level manager skill submission creates an approval owned by the configured reviewer. Session mutations disappear after process restart; seeds remain unchanged.

## Revisit when

Product requires multi-manager, relationship maintenance UI, or durable backend writes.
