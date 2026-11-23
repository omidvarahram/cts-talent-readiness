# Technical reference starting points

Reviewed 20 November 2026. Recheck selected toolchain documentation when implementing; no package versions are prescribed in this baseline.

- [Expo development builds](https://docs.expo.dev/develop/development-builds/introduction/): own native runtime for native libraries/configuration beyond Expo Go.
- [Expo custom native code](https://docs.expo.dev/workflow/customizing/): native modules, development builds and local native development.
- [React Native security](https://reactnative.dev/docs/security): sensitive storage and network security guidance; unencrypted key-value storage is unsuitable for credentials.

Architecture, role scopes, endpoint contracts and curriculum in this repository are project proposals, not vendor recommendations. Verify library-specific pinning, WebView, secure storage, native architecture and Metro optimization behaviour against the versions selected in D10.

## Human-learning setup references (checked 23 November 2026)

- [Expo monorepos](https://docs.expo.dev/guides/monorepos/)
- [Expo development clients](https://docs.expo.dev/develop/development-builds/introduction/)
- [Expo unit testing](https://docs.expo.dev/develop/unit-testing/)
- [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces/)
- [npm package manifests](https://docs.npmjs.com/cli/configuring-npm/package-json/)
- [Scoped package publication](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages/)
- [Jest coverage thresholds](https://jestjs.io/docs/configuration#coveragethreshold-object)

These guide a human compatibility spike; no new package versions have been installed or validated in an Expo app yet.
