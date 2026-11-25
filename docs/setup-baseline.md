# Setup baseline (FND-08)

Recorded: 2026-11-24

## Toolchain

| Tool | Version |
| --- | --- |
| Node | >=22 (local spike: v24.9.0) |
| npm | 11.x |
| TypeScript | ~5.6.3 |
| Jest | 29.x |
| Expo | pinned during APP-01 spike (see apps/mobile) |

## Package identities

| Workspace | Package name | Private |
| --- | --- | --- |
| packages/ui | `@cts-talent/ui` | publishable when authorised |
| packages/sdk | `@cts-talent/sdk` | publishable when authorised |
| apps/mobile | `talent-mobile` | yes |
| dummy-backend | `talent-readiness-dummy-api` | yes |

`@cts-talent` is a **local learning scope**. Replace before any real registry publication ([FND-07](user-stories/00-foundations-and-tooling.md#fnd-07)).

## Commands

```bash
npm ci
npm run typecheck
npm run test:coverage
npm run build
npm run pack:libs
npm start --workspace talent-readiness-dummy-api
```

## Distribution

- Default: npm workspaces linking.
- Prove publishability with `npm pack` + clean consumer; no credentials in repo.
- Actual `npm publish` is optional and human-authorised only.

## Known platform limits

- Windows cannot run local iOS Simulator/Xcode.
- Certificate pinning and biometrics require Expo development builds / real devices, not Expo Go.
- Dummy API is loopback HTTP only; pinning acceptance uses a separate HTTPS gate.
