# Read-only dummy backend

Start with [API.md](API.md) for startup commands, all REST URLs, headers, request bodies, response DTOs, scope and errors.

- [OpenAPI JSON](openapi.json): machine-readable implemented contract.
- [server.mjs](server.mjs): dependency-free Node.js HTTP implementation.
- [server.test.mjs](server.test.mjs): live HTTP integration/contract checks and immutable DB hashes.
- [package.json](package.json): npm start / npm test.
- [DB guide](DB/README.md): six linked JSON datasets.
- [Future write contracts](write-contracts.md): documented, deliberately not implemented by this read-only service.

The latest request explicitly adds executable Node source (.mjs); all other project references remain Markdown, JSON or HTML. The server reads frozen seeds and never writes them. Dummy login issues a temporary token only; no production authentication, TLS endpoint or native pinning is claimed.
