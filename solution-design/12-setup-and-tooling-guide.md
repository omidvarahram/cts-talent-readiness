# Setup and tooling learning guide

Read alongside the FND and APP setup stories. These are examples for humans to adapt after choosing compatible versions, not files already generated or a script to run blindly.

## Start with the existing clone

```powershell
cd C:\projects\cts-talent-readiness
git status --short
node --version
npm --version
```

Keep a record of results. The repository already exists; do not create another .git directory inside a workspace. Create a branch for setup, review the existing API/docs and choose the package scope before installing anything.

## Root workspace manifest concept

```json
{
  "name": "cts-talent-readiness",
  "private": true,
  "workspaces": ["apps/*", "packages/*", "dummy-backend"],
  "scripts": {
    "typecheck": "npm run typecheck --workspaces --if-present",
    "test": "npm run test --workspaces",
    "test:coverage": "npm run test:coverage --workspace @your-scope/talent-sdk && npm run test:coverage --workspace @your-scope/talent-ui && npm run test:coverage --workspace talent-mobile"
  }
}
```

Replace package names with the chosen actual names. Each workspace must expose test; the existing backend already does. Coverage is explicitly invoked for the three product workspaces, not silently skipped through --if-present. A typecheck aggregate can temporarily use --if-present for the JS backend, but ensure all three product workspaces define it. One root lockfile is authoritative.

Create workspace placeholder manifests before trying root-wide scripts. In the app declare dependencies on matching UI/SDK versions, for example 0.1.0 while those packages are at 0.1.0. Check that npm links the local workspaces rather than accidentally downloading similarly named registry packages.

## TypeScript decisions to explain

- strict catches implicit any/null assumptions. noEmit is appropriate for app type checking; UI/SDK also need a deliberate declaration/build step for consumers.
- A compiler path alias alone does not create a valid npm export or runtime module path.
- React Native/Expo own the app's compatible React/JSX/native toolchain. Do not independently upgrade React in the UI workspace.
- SDK core should be importable in Node; native adapter entry points must not eagerly execute when core is imported.
- Node/npm/Expo versions belong in the setup record/engine/tooling policy. Do not combine random latest dependencies without running the compatibility spike.

## Configure coverage early

Use the SDK Node Jest preset/transform appropriate to selected TypeScript build and the compatible RN/Expo preset for UI/app. Example threshold fragment for SDK:

```json
{
  "collectCoverageFrom": ["src/**/*.{ts,tsx}", "!src/**/*.d.ts"],
  "coverageThreshold": {
    "global": {
      "statements": 100,
      "branches": 100,
      "functions": 100,
      "lines": 100
    }
  }
}
```

UI uses 90 for each metric; app uses 70. Add explicit exclusions only for generated source, tests, fixture/example/gallery-only paths. Do not copy a fragment without a compatible test transform and native mocks. Keep tests outside product source or exclude their exact paths consistently. Collecting only imported files creates misleading reports: demonstrate that a newly added untested source file reduces coverage.

Commands after scripts exist:

```powershell
npm run typecheck
npm run test:coverage --workspace @your-scope/talent-sdk
npm run test:coverage --workspace @your-scope/talent-ui
npm run test:coverage --workspace talent-mobile
npm test --workspace talent-readiness-dummy-api
```

The last workspace name is already present in dummy-backend/package.json. Product names above are proposed and must match actual manifests. A mocked native call does not replace device testing.

## Local packaging before registry access

```powershell
npm run build --workspace @your-scope/talent-ui
npm pack --workspace @your-scope/talent-ui --dry-run
npm pack --workspace @your-scope/talent-ui
npm run build --workspace @your-scope/talent-sdk
npm pack --workspace @your-scope/talent-sdk --dry-run
npm pack --workspace @your-scope/talent-sdk
```

Inspect actual generated filenames; install them in a disposable consumer using their real paths. Test runtime exports and TypeScript declarations. Verify no node_modules, fixtures, private documents, credentials or entire application source enter a tarball. Workspace success alone is not enough.

## Registry preparation as a human task

1. Decide local-only versus npmjs/private host. Workspaces and tarballs need no account.
2. Choose a scope you own and explicit package visibility. Check provider requirements for private access.
3. Inspect the selected registry and account; a human can run npm config get registry, npm whoami and npm login where appropriate.
4. Keep credentials in user/CI secret management, never a committed literal token. If a project .npmrc maps a scope, document its purpose without a secret.
5. Prepare changelogs, semantic versions, prerelease tags and a dry-run package/release pipeline. Rehearse from a clean consumer.
6. Actual npm publish is optional for this dummy project and requires the owner's explicit release decision. Never publish just to demonstrate setup.

## Minimal Expo development-client sequence

Pick the blank TypeScript template deliberately to match the React Navigation plan. From repository root, after workspace planning:

```powershell
npx create-expo-app@latest apps/mobile --template blank-typescript
```

Inspect generated manifests and lockfiles; reconcile with the root npm workspaces/lockfile rather than keeping two competing installs. Select/install compatible UI peers and navigation dependencies. From apps/mobile:

```powershell
npx expo install expo-dev-client
npx expo run:android
npx expo start --dev-client
```

Prerequisites: Android SDK/JDK/emulator and device tooling compatible with the chosen Expo version. Start the emulator before building, and record actual output rather than assume the command succeeded. On macOS with Xcode/simulator, npx expo run:ios is the local iOS equivalent. Windows cannot run local Xcode/iOS simulator. An EAS/cloud development-build path can build remotely but still needs a physical/simulator runtime and account/device setup.

Use Expo Go only for initial pure UI experiments. The project’s eventual native pinning and platform integrations require an appropriate development client. Rebuild after native dependencies/config change; ordinary JS edits use Metro/Fast Refresh. Do not run destructive native regeneration commands without understanding their effect on handwritten native changes.

## Backend/device connectivity

From dummy-backend, npm start launches the existing read API on 127.0.0.1:3001. Android emulator uses the host alias 10.0.2.2; physical devices require an explicitly reachable listener/dev host. Keep this HTTP lab separate from the later trusted HTTPS/pinning story. Config URL/pins/identity trust are bundled bootstrap inputs; a public client env variable is not a secret.

## Teach-back questions

Why one lockfile? What is the difference between peer and runtime dependency? What does npm pack prove that local linking does not? Why is React Native not imported by SDK core? Which tests count toward each coverage gate? Why can an expired server session not be accepted solely after biometric success? When must an Expo native binary be rebuilt?

Sources: [Expo monorepos](https://docs.expo.dev/guides/monorepos/), [development builds](https://docs.expo.dev/develop/development-builds/introduction/), [Expo testing](https://docs.expo.dev/develop/unit-testing/), [npm manifests](https://docs.npmjs.com/cli/configuring-npm/package-json/), [Jest config](https://jestjs.io/docs/configuration).
