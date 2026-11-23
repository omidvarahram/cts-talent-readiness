# Unit testing, coverage and native verification

This policy supersedes the initial test proposal. Tests are set up in every workspace during FND-04 and added with each implementation story. The monorepo root aggregates project commands; it does not replace independent workspace configuration.

| Project | Statements | Branches | Functions | Lines | Environment |
| --- | --- | --- | --- | --- | --- |
| packages/sdk | 100% | 100% | 100% | 100% | Jest Node core; injected fake native adapters |
| packages/ui | 90% | 90% | 90% | 90% | Compatible RN/Expo Jest transform and RN testing library |
| apps/mobile | 70% | 70% | 70% | 70% | jest-expo, RN testing library, fake service providers |

The existing dummy backend retains its separate Node HTTP integration suite and seed-hash checks. It does not count toward the three product percentages.

## Coverage configuration and exclusions

Collect from all authored executable src TS/TSX, not only imported files. SDK native TypeScript wrappers count toward SDK coverage. Only generated code/declarations, test code, fixtures and explicitly isolated gallery/example code may be excluded; review exclusions. No passWithNoTests, lowered per-directory override or ignored auth/error branch is allowed to bypass the requested gate. Pure type-only declarations need typecheck even when they contain no executable statements.

Measure all four metrics separately. Run coverage in CI for each product package. Prove the thresholds by temporarily adding an untested branch and observing failure, then remove/fix it. Do not make useless tests just to execute lines: assertions must detect an incorrect result or observable state.

## Behavioural test ownership

| Layer | What to demonstrate |
| --- | --- |
| UI | controlled props/events, required/error/disabled/pending states, focus/labels, long text, drawer dismissal and opaque fallback |
| SDK | DTO rejection, HTTP/abort/timeout, token origin boundaries, strategy inputs, protected storage, biometric outcomes, refresh races, logout generation, scoped clients, immutable seeds and session commands |
| App | launch/config gate, aligned login, invalid/valid personal details, timeline/back/pause, skills reveal/pending, CV skip/upload, all role combinations, manager/admin decisions, drawer/logout and reset |
| Native device | real store/biometric cancellation/lockout, native TLS good/bad/backup pins, keyboard/safe areas/back, screen readers, text scaling and reduced transparency/motion |
| API | live loopback endpoints, missing/expired/tampered tokens, role scope, pagination/validation and no DB writes |

Use fake clocks and deferred promises for races; do not depend on arbitrary sleeps. Integration and component tests can be authored in the same Jest project but keep their purpose clear. JS coverage does not measure third-party native internals or prove hardware security; document device evidence separately. Authored Kotlin/Swift needs its own native unit-test/build plan if introduced.

## Learner review evidence

Every story supplies positive and negative test scenarios, human demo and teach-back. Record commands, relevant report and device/build details. Reviewer asks why the boundary/state rule exists and how a test would fail if it were wrong. UI-14, SDK-20, APP-24 and APP-25 close the major assurance gates, but do not defer all tests until those stories.

Sources: [Expo unit testing](https://docs.expo.dev/develop/unit-testing/), [Jest coverage configuration](https://jestjs.io/docs/configuration#coveragethreshold-object). See [setup examples](../12-setup-and-tooling-guide.md) and [backlog](../../user-stories/README.md).
