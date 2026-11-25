> Current project layout: [one monorepo, three projects](10-human-learning-implementation-plan.md). Package identifiers below are illustrative. In Expo use the template-compatible registration/entry mechanism; the AppRegistry example expresses one-time composition, not a command to replace Expo bootstrap blindly.

# TypeScript authentication strategies and manager

Status: proposed public contract for the SDK, aligned with the requested entry-point initialization. This document is a design/implementation specification, not an implemented SDK.

## Two strategies

Because the second strategy was not named, the initial pair is explicitly proposed as follows. Both are TypeScript classes with a common base class, usable by different apps through a small configuration object.

| Strategy | Interactive input | Intended use |
| --- | --- | --- |
| CompanySsoAuthStrategy | Company SSO request; optional email/associate ID hints | This application. Demo adapter shows dummy portal WebView; a real identity-provider adapter uses system authentication session with authorization code and PKCE. |
| CredentialsAuthStrategy | Username/password for the app’s own identity service | A different app or explicit dummy-credentials exercise. Never use this to collect actual Cognizant passwords. |

The strategy performs provider-specific authenticate/refresh/revoke operations. AuthManager coordinates secure persistence, local unlock, HTTP access tokens, session state, concurrency and logout. Having both strategy classes does not mean every application exposes both login methods. This app selects CompanySsoAuthStrategy at startup.

## Public types and class shapes

```typescript
type ApplicationRole = 'associate' | 'manager' | 'admin';
type AuthInput =
  | { kind: 'credentials'; username: string; password: string }
  | { kind: 'sso'; emailHint?: string; associateIdHint?: string };

type AuthResult =
  | { status: 'authenticated'; identity: Identity }
  | { status: 'interaction_required'; reason: 'login' | 'unlock' | 'expired' }
  | { status: 'cancelled' };

interface Identity {
  subject: string;
  associateId: string;
  roles: ApplicationRole[];
}

interface ProviderSession {
  accessToken: string;
  refreshToken?: string;
  accessExpiresAt: number;
  identity: Identity;
}

type AuthConfig = {
  appId: string;
  storageNamespace: string;
  biometricPolicy: 'disabled' | 'offer' | 'required';
  apiBaseUrl: string;
} & (
  | { strategy: 'company-sso'; issuer: string; clientId: string;
      redirectUri: string; scopes: string[] }
  | { strategy: 'credentials'; loginPath: string; refreshPath: string }
);

// Interfaces imported from SDK modules; platform implementations are injected.
interface ProviderContext {
  transport: HttpTransport;
  interaction: AuthInteractionPort;
  signal?: AbortSignal;
}

abstract class AuthStrategy {
  constructor(readonly config: AuthConfig) {}
  abstract authenticate(input: AuthInput, context: ProviderContext): Promise<ProviderSession>;
  abstract refresh(refreshToken: string, context: ProviderContext): Promise<ProviderSession>;
  abstract revoke(session: ProviderSession, context: ProviderContext): Promise<void>;
}

// Concrete exported SDK classes implement the three methods above.
// CompanySsoAuthStrategy rejects credential input; CredentialsAuthStrategy
// rejects SSO input. Neither class persists passwords.

interface AuthManagerContract {
  // No args: inspect session, unlock when appropriate, refresh, or request UI.
  authenticate(input?: AuthInput): Promise<AuthResult>;
  inspectSession(): Promise<'none' | 'locked' | 'restorable'>;
  getAccessToken(signal?: AbortSignal): Promise<string>;
  logout(): Promise<void>;
  subscribe(listener: (state: AuthState) => void): () => void;
  dispose(): void;
}
```

HttpTransport, AuthInteractionPort and AuthState are SDK contracts described below. Keep raw tokens internal to AuthManager and the transport integration; do not return refresh credentials to screens. getAccessToken is an infrastructure interface, not a screen requirement. Reject unsupported input/config combinations before sending requests.

## App entry point example

The example names illustrate the API to implement. It intentionally lives in Markdown while the project is in design phase.

```typescript
// index.ts — application composition root
import { AppRegistry } from 'react-native';
import {
  AuthManager, CompanySsoAuthStrategy, createHttpClient,
  ConfigManager, createReactNativeAdapters,
} from '@talent/sdk';
import { App } from './src/App';
import { trustedBootstrap } from './src/bootstrap';

const adapters = createReactNativeAdapters(trustedBootstrap);
const strategy = new CompanySsoAuthStrategy({
  strategy: 'company-sso',
  appId: 'talent-readiness',
  storageNamespace: 'talent-readiness.auth',
  biometricPolicy: 'offer',
  apiBaseUrl: trustedBootstrap.apiBaseUrl,
  issuer: trustedBootstrap.issuer,
  clientId: trustedBootstrap.clientId,
  redirectUri: trustedBootstrap.redirectUri,
  scopes: ['openid', 'profile'],
});

const auth = new AuthManager(strategy, {
  transport: adapters.pinnedTransport,
  secureStore: adapters.secureCredentialStore,
  biometric: adapters.biometric,
  interaction: adapters.authInteraction,
  clock: adapters.clock,
});
const http = createHttpClient({ transport: adapters.pinnedTransport, auth });
const config = new ConfigManager({
  transport: adapters.pinnedTransport,
  bootstrap: trustedBootstrap,
  cache: adapters.nonSecretConfigCache,
});
const services = { auth, http, config };

// Registered immediately so config/network failure does not prevent rendering.
// App renders a launch gate; it loads config, inspects session and then enables
// login. It subscribes to auth state and owns navigation decisions.
AppRegistry.registerComponent('TalentReadiness', () => () => (
  <App services={services} />
));

// In a login controller after bootstrap, never directly during render:
// await auth.authenticate();                     // restore/unlock or UI request
// await auth.authenticate({ kind: 'sso' });      // explicit company sign-in
// await auth.logout();                          // purge, emit unauthenticated
```

Switching to CredentialsAuthStrategy changes initialization/config and the app's login UX; callers still use the same manager operations. The strategy and manager are instantiated once, not per component render. Runtime config supplies approved non-secret operational values after bootstrap; it cannot switch the identity issuer or pin trust to an arbitrary value.

## No-argument authenticate algorithm

1. Wait for safe bootstrap completion; reject concurrent interactive sign-ins with a typed busy result/error rather than launch overlapping prompts.
2. Inspect namespaced secure session metadata. If absent, return interaction_required/login and emit an event; the app navigates to login.
3. If biometric protection applies, use the native protected-store access/unlock adapter. Cancellation returns cancelled, never clears valid credentials merely because the prompt was cancelled. Handle unavailable/no-enrolment/lockout according to the configured policy.
4. Validate session identity and expiry; refresh an expired access token when a usable refresh credential exists. If renewal fails terminally, clear unusable credentials and return interaction_required/expired.
5. Hold the access token in memory; persist only the minimum recoverable credential/session in OS-backed secure storage. If the provider has no refresh credential, define an explicitly short-lived protected stored-session mode or require SSO after restart. Do not silently claim durable recovery without a recoverable credential.
6. Emit authenticated identity; app fetches the associate by verified associateId and routes to unfinished onboarding or dashboard. Token decoding alone is not server-side proof of authorization.

Biometrics unlock local credential access, not the remote account. The manager should use OS-gated secure credential retrieval where supported, not a standalone success boolean followed by unrestricted credential retrieval. Passwords and PINs are never persisted.

## Interaction and navigation contract

AuthInteractionPort exposes requestCompanySignIn(request), requestBiometricUnlock(policy) through the appropriate native adapter, and cancellation. These are asynchronous results/events, not imported app screen components. The demo implementation may use an app-controlled portal screen; production SSO uses an approved external authentication session. NavigationPort can request login/reset and open approved external URLs, while the app supplies the actual navigator/route mapping.

The strategy handles protocol state, PKCE, callback validation, code exchange and provider errors. The app handles loading, button labels, cancellation UI, activation forms and route transitions. Neither generic UI components nor a concrete SDK screen should decide onboarding completion.

## HTTP/session coordination

- Public bootstrap/auth requests bypass the authenticated interceptor deliberately, preventing recursive refresh.
- Only attach Authorization to approved API origins; never leak tokens to config, One Cognizant links or arbitrary upload URLs.
- A single refresh promise handles simultaneous expiry/401 responses. Retry an eligible request once after refresh; unsafe mutation retries require idempotency semantics.
- A failed 403 is an authorization failure, not a reason to refresh forever. Aborted requests do not become successful UI mutations.
- Logout increments a session generation, aborts protected requests/refresh, locks local auth, purges secure credentials and app-owned persistent private data, emits unauthenticated and attempts bounded best-effort server revocation. Any late response from the old generation is discarded.
- The app subscribes to logout/expiry and clears domain caches, draft forms and temporary files before resetting navigation. Every purge step runs even if another cleanup or remote call fails; never leave the UI authenticated due to a network error.
- OS secure-store errors produce a recoverable login state, not silent fallback to unencrypted storage. Redact tokens/passwords from all logs.

## State and test gates

States: idle, restoring, locked, authenticating, authenticated, refreshing, logging_out, unauthenticated, error. Refreshing need not dismiss a valid visible screen; terminal auth loss does. Background/restart behaviour follows the demo process-kill reset requirement for domain data.

Required tests: both strategy configurations; unsupported input; credentials success/failure; SSO cancel/state mismatch; no stored credential; biometric cancel/lockout/unavailable; expired/rotated/revoked refresh; concurrent 401s; storage failures; logout during refresh; late-response rejection; account isolation; token redaction and role-refresh navigation. Native biometric/store behaviour requires device evidence.

## Primary guidance

- [React Native security](https://reactnative.dev/docs/security): sensitive storage and network considerations.
- [RFC 8252: OAuth 2.0 for Native Apps](https://www.rfc-editor.org/rfc/rfc8252.html): external user-agent and PKCE guidance. Demo WebView remains a simulation only.
