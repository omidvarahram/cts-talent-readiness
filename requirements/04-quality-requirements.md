> Initial design baseline. Where behaviour differs, [current agreed requirements](../requirements/00-current-requirements.md) take precedence.

# Quality requirements

| ID | Area | Proposed measurable gate |
| --- | --- | --- |
| NFR-01 | Platforms | Core journeys verified on one Android and one iOS target; exact minimum OS/device matrix recorded before build |
| NFR-02 | Accessibility | VoiceOver/TalkBack complete sign-in, profile and progress flows; labels/roles/errors are announced; large text does not hide actions; status never relies only on colour |
| NFR-03 | Resilience | Timeout, offline, 401, 403, 409, 429 and 500 each produce a recoverable UI; background/resume does not duplicate a mutation |
| NFR-04 | Privacy | No tokens, CV bytes, credentials or profile payloads in logs; account switch/logout purges private caches and queued actions |
| NFR-05 | Performance | Record release-build cold start, long-list scrolling, JS bundle and installed app sizes on named devices; review regressions above 10% against the milestone baseline |
| NFR-06 | Maintainability | Strict TypeScript, lint, package boundary checks, deterministic lockfile installation and automated tests pass in CI |
| NFR-07 | Testability | Fake clock, deterministic IDs/fixtures and controllable failure modes reproduce acceptance scenarios |
| NFR-08 | Portability | SDK domain/client entry point has no RN dependency; platform capabilities use injected adapters |

Performance targets are initial learning gates, not a production SLA. Set absolute device-specific budgets after the first measured release build. Test degraded networks and smaller devices; emulator results alone do not establish hardware behaviour.
