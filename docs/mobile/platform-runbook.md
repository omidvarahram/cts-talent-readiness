# Platform Runbook

## Local development

- Windows cannot launch the iOS simulator. Use Android Emulator on Windows for local validation.
- Android emulator should point at `http://10.0.2.2:3001` for the dummy backend.
- iOS simulator and physical iOS devices use `http://127.0.0.1:3001` during local development.

## Expo and pinning

- Expo Go is not sufficient for certificate pinning flows.
- `pinningRequired` is `true` in the trusted bootstrap config, but local HTTP lab traffic uses the insecure dev transport.
- Real pinning requires HTTPS and a native build that includes the pinning implementation.

## Process lifecycle

- Auth material is persisted in secure storage so biometrics can restore a prior session.
- Domain mutations, onboarding drafts, and session mutation queues are in memory only and reset when the process dies.
- APP-02 should be treated as blocked until an emulator or device is available.

