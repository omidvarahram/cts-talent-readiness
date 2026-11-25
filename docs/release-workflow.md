# Registry readiness and release workflow (FND-07)

## Choices

- **Mode:** local-only by default (workspaces + tarballs).
- **Scope:** `@cts-talent` placeholder for learning; replace with an owned scope before publish.
- **Visibility:** restricted / private if published.
- **Registry:** npmjs or private host — not required for development.

## Human steps (no secrets in git)

1. `npm login` / 2FA or trusted publishing on the owner account.
2. Confirm `npm whoami` and registry URL.
3. `npm run build && npm pack --workspace @cts-talent/ui --dry-run` (same for sdk).
4. Inspect tarball: no `DB/`, credentials, fixtures or app source.
5. Bump version + changelog in the package.
6. `npm publish --dry-run` then, only if authorised, `npm publish`.

## Rollback

Deprecate or unpublish per registry policy; pin consumers to previous semver.

## CI

CI packs/tests only. Publication is never automatic from this learning project.
