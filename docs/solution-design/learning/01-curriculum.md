> Earlier supporting baseline. Use the [current human-learning solution design](../10-human-learning-implementation-plan.md) and [67-story implementation backlog](../../user-stories/README.md) for sequence, estimates and current persistence/coverage requirements.

# Practical curriculum

Levels indicate sequencing, not job titles. Learners should complete a thin end-to-end feature before tackling advanced platform internals. Pair web/frontend and backend engineers; rotate responsibilities so everyone touches UI, SDK and mock API.

| Level | Topic | Practical exercise | Review evidence |
| --- | --- | --- | --- |
| Foundation | JS | Modules, closures, promises, errors, immutable updates | Async catalogue client with cancellation/error explanation |
| Foundation | TypeScript | Unions, narrowing, generics, unknown, strict null checks | Typed assignment state and runtime-validated response |
| Foundation | React | Props, hooks, effects, cleanup, rendering, stable keys | Assignment screen without fetch loops/stale state |
| Foundation | RN/mobile | Flexbox, Text/View, lists, safe areas, platform behaviour | Screen on Android/iOS, keyboard and rotation checks |
| Foundation | Repository/tooling | Git, PRs, npm, scripts, lockfiles, TS/Babel/Metro | Clean clone, deterministic install, documented commands |
| Foundation | Component library | Tokens, composition, peer dependencies, accessibility | Reusable controls and clean package consumption |
| Intermediate | REST and SDK | HTTP, validation, pagination, errors, cancellation | App uses SDK; SDK tests run outside RN |
| Intermediate | Navigation | Auth stacks, typed params, back, deep links | Protected link and unsaved form scenarios |
| Intermediate | Multi-step forms | Conditional fields, validation, review, draft | Draft survives relaunch and maps server errors |
| Intermediate | State | Server cache vs context/reducer vs form state | Explain ownership and invalidation after updates |
| Intermediate | Authentication/storage | Session expiry, secure secrets, account isolation | Concurrent expiry and logout purge demonstrated |
| Intermediate | Camera/files | Permission UX, camera/gallery, picker, PDF upload | Denial, cancellation, size/type and temporary-file cases |
| Intermediate | Roles | Capability and resource checks | Manager/associate dual journey and forbidden API call |
| Intermediate | Testing | Unit tests, component behaviour, contracts, E2E | Critical journey and permission regression tests |
| Advanced | Offline | Queue, idempotency, retries, conflict, app kill | Lost acknowledgement and 409 recovery demonstration |
| Advanced | Runtime config | Schema, trust boundary, expiry, fallback | Invalid/unreachable config safely handled |
| Advanced | WebView | Navigation trust, validated message bridge | Valid completion plus forged/malformed event rejection |
| Advanced | Biometrics | Local unlock and hardware lifecycle | Cancel/lockout/no-enrollment and expired-session checks |
| Advanced | Pinning | TLS, host coverage, rotation, build differences | Good/wrong/rotated pin lab report |
| Advanced | Native modules | Swift/Kotlin, typed bridge, lifecycle | Android/iOS module plus fallback |
| Advanced | Bundling | Metro, exports, side effects, release measurement | Before/after size report with proven change |

## Additional mobile topics

Include application foreground/background lifecycle; process death; permissions rationale and settings recovery; Android hardware back; iOS safe areas; device versus simulator limits; low-memory/image handling; touch/keyboard ergonomics; internationalization and date/timezones; network transitions; crash reporting and redacted logs; dependency/license review; CI build signing and secret handling; internal build distribution; release channels, version/build numbers and rollback; compatibility of over-the-air JS changes with native binaries.

Stretch only after core completion: push notifications and permission/token lifecycle, accessible notifications-to-deep-link flow, encrypted schema migrations, upload resumption and background work. Do not add these merely to increase feature count.

For each feature, ask learners to explain one platform difference, one unhappy path, one test and one design trade-off. Avoid requiring beginners to implement every advanced lab simultaneously.
