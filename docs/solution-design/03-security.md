> Initial design baseline. Where behaviour differs, [current agreed requirements](./00-current-requirements.md) take precedence.

# Security design and advanced labs

## Session and storage

Proposed learning flow: seeded login returns short-lived access token and rotating refresh token. Keep access token in memory and refresh token in OS-backed secure storage. Serialize refresh so concurrent 401 responses trigger one refresh; retry each request once and end the session when refresh fails. Mock authentication demonstrates lifecycle concepts, not production SSO.

Biometrics unlock an existing locally stored credential or session capability; they are not server authentication or authorization. Handle unavailable hardware, no enrollment, changed enrollment, cancellation and lockout. Expired/revoked sessions still require server validation. Define device-passcode fallback deliberately.

Async storage is not suitable for secrets. Store preferences separately from encrypted drafts/cache. Do not put PDFs or images into keychain-style small-value storage: protect app-private files with an appropriate encryption/key strategy, delete temporary files, and review OS backups and sharing. Initial release excludes offline CV/evidence downloads to keep this tractable. Purge private caches on logout/account switch; offline logout immediately blocks the local session even if server revocation must retry later.

## TLS certificate/public-key pinning lab

Use normal TLS validation plus a native-capable pinning transport selected after compatibility review. Demonstrate expected pin success, wrong pin failure, certificate rotation using overlapping current/backup pins, and an expired/untrusted certificate failing ordinary TLS. Test on a real development/release-style build. Inventory SDK, upload, image and WebView networking paths: pinning one fetch client does not automatically protect all network traffic. Document intended host coverage and gaps. No accept-all certificate bypass or remote switch that disables pinning.

## Runtime configuration

Bootstrap from a bundled trusted config endpoint and safe defaults. JSON contains schemaVersion, configVersion, expiresAt, featureFlags and allowlisted display/network options. Validate schema, size, expiry and app compatibility; cache last-known-good non-secret values. Invalid/unavailable config falls back safely. Config must not supply secrets, arbitrary executable code, arbitrary trusted WebView origins or a mechanism to bypass authorization/pinning. Endpoint trust changes require a separately reviewed strategy.

## WebView bridge lab

Serve a controlled training page and implement a narrow bridge such as training.ready and training.completed. Message envelope: version, requestId, sessionNonce, type, payload. Validate size, schema, method allowlist, current authenticated user and assignment scope. Issue a new nonce per trusted page load; clear pending requests on navigation, timeout or logout. Deduplicate completion events and acknowledge safely.

Restrict top-level navigation and new windows to exact approved HTTPS origins; block unexpected redirects, mixed content and untrusted HTML. Avoid interpolating user strings into injected JavaScript; use safe serialization and a fixed bridge. Never pass refresh tokens or arbitrary native capabilities to web content. A nonce is not proof that trusted content is uncompromised; isolate the page and minimize third-party scripts. Do not assume WebView message events provide reliable origin authentication on every platform: verify the selected library/platform behaviour and maintain navigation-level trust controls. The server independently validates completion mutations.

## Authorization and files

Server evaluates capability plus resource relationship for every request. Never trust UI mode, client-supplied ownerId or a hidden button. Test object-ID substitution attacks. Validate file size, extension, content signature and ownership; sanitize download names and prevent path traversal. Provisional limits: avatar 5 MiB, PDF CV 10 MiB, evidence image/PDF 10 MiB. Limits are proposals. Mock scanning explicitly; do not claim a file is malware-free. Audit role changes and CV downloads without logging personal document contents.
