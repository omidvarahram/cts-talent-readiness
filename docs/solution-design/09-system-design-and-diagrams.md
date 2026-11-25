> Superseded on repository/work planning: use the [current monorepo learning solution design](10-human-learning-implementation-plan.md) and [human backlog](../user-stories/README.md). Three separate repositories and old US estimates below are historical. Technical contracts still apply where they do not conflict.

# System solution design and diagrams

This is the detailed system view for [all mobile UX requirements](./05-mobile-ui-ux-specification.md). Mermaid class, sequence and state diagrams provide UML-style models directly renderable in GitHub Markdown; flowcharts describe components and decision paths. No external PlantUML renderer is required. Source code, API delivery and target design are distinguished below.

## Scope and implemented baseline

Implemented: structured JSON fixtures, self-contained mobile HTML prototype, and read-only built-in Node HTTP server. Designed but not yet implemented: three independent React Native/SDK/UI repositories, native authentication/biometrics, secure storage, native pinning, remote configuration deployment and production domain writes. Current browser mutations live only in memory. The server does not receive them automatically.

## Component dependencies

```mermaid
flowchart TD
  App["Mobile app: screens and routes"] --> UI["UI library: controlled components"]
  App --> SDK["SDK: auth, HTTP, data, config"]
  SDK --> Native["Native adapters: storage, biometrics, TLS"]
  SDK --> API["Read-only Node REST API"]
  SDK --> Config["Hosted config.json"]
  API --> DB["Frozen JSON seed databases"]
```

Only the app composes user journeys. UI components emit events; SDK services emit typed results/state. Repository boundaries, package releases and every UX ownership assignment are in [work streams](06-repositories-and-workstreams.md). Server endpoint types are in [API reference](../../dummy-backend/API.md).

## Data model

```mermaid
classDiagram
  direction TB
  class Associate {
    string associate_id
    string associate_manager
    string associate_role
    StaffingStatus associate_status
  }
  class Identity {
    string auth_user_id
    ApplicationRole[] application_roles
  }
  class AssociateSkill {
    string skill_id
    string skill_code
    number years_of_experience
    date last_used
    ApprovalStatus approval_status
  }
  class LearningAssignment {
    string learning_assignment_id
    number status_percentage
    LearningStatus status
  }
  class Learning {
    string learning_code
    boolean certificate_required
  }
  class ApprovalRequest {
    string approval_request_id
    string reviewer_id
    ApprovalStatus status
  }
  Associate "1" --> "1" Identity : authentication mapping
  Associate "1" *-- "0..*" AssociateSkill : declares
  Associate "1" --> "0..*" LearningAssignment : receives
  LearningAssignment "0..*" --> "1" Learning : references
  ApprovalRequest "0..*" --> "1" AssociateSkill : current seed target
  Associate "0..1" --> "0..*" Associate : manages
```

IDs remain strings. No circular manager links or self-management. Application roles and job titles remain distinct. Learning.skills is a catalogue tag list, not a substitute for an associate’s experience records. Current approval seeds reference skills; progress approval types are a target extension. [Data contract](../../dummy-backend/DB/data-contract.md) defines skills and approvals.

## Authentication class model

```mermaid
classDiagram
  direction TB
  class AuthStrategy {
    <<abstract>>
    +authenticate(input, context) ProviderSession
    +refresh(credential, context) ProviderSession
    +revoke(session, context) void
  }
  class CompanySsoAuthStrategy
  class CredentialsAuthStrategy
  class AuthManager {
    +authenticate(input) AuthResult
    +getAccessToken() string
    +logout() void
  }
  class SecureCredentialStore
  AuthStrategy <|-- CompanySsoAuthStrategy
  AuthStrategy <|-- CredentialsAuthStrategy
  AuthManager --> AuthStrategy : selects once at bootstrap
  AuthManager --> SecureCredentialStore : gated session access
```

Two strategies are configurable per app; this app chooses company SSO. Manager owns refresh/persistence/races. App implements interaction/navigation ports and selects screens. See [auth contracts](07-auth-strategy-contract.md) for signatures and failure rules.

## Launch and returning-session flow

```mermaid
flowchart TD
  Start["Launch: compose services once"] --> Fetch["Pinned config fetch and validation"]
  Fetch --> ConfigOK{"Valid remote or eligible cache?"}
  ConfigOK -->|No| Retry["Blocking error and Retry"]
  Retry --> Fetch
  ConfigOK -->|Yes| Restore["Inspect secure session"]
  Restore --> Session{"Recoverable session?"}
  Session -->|No| Login["Login or activate account"]
  Session -->|Yes| Unlock["Unlock and renew if required"]
  Unlock --> Auth{"Server session usable?"}
  Auth -->|No or cancelled| Login
  Auth -->|Yes| Profile["Fetch verified associate"]
  Login --> Interactive["Selected strategy authentication"]
  Interactive --> Profile
  Profile --> Complete{"Session onboarding complete?"}
  Complete -->|No| Wizard["Personal details, Skills, CV"]
  Complete -->|Yes| Dashboard["Permitted dashboard workspace"]
  Wizard --> Dashboard
```

Config pin trust is bundled, never supplied by the first untrusted response. The HTTP dummy server does not fulfil native pinning. Biometric success alone does not authenticate the remote account. No domain draft survives process termination in the demo contract.

## First-login sequence

```mermaid
sequenceDiagram
  actor User
  participant App
  participant Auth as AuthManager
  participant Provider as Selected auth strategy
  participant API as Data API
  User->>App: Enter email and associate ID
  App->>Auth: authenticate(sso input)
  Auth->>Provider: authenticate through interaction port
  Provider-->>User: Company portal or demo simulation
  User-->>Provider: Complete or cancel
  Provider-->>Auth: Session or typed outcome
  Auth-->>App: Persist recoverable credential, emit identity
  App->>API: GET /me/profile with access token
  API-->>App: Scoped associate record
  App-->>User: Three-step onboarding
```

The demo /auth/demo checks fictional email/ID and issues only an expiring access token. Production SSO is external authentication, not the embedded demo portal. A future provider adapter may supply refresh credentials; the current dummy server does not.

## Onboarding state model

```mermaid
stateDiagram-v2
  [*] --> PersonalDetails
  PersonalDetails --> PersonalDetails: invalid mandatory fields
  PersonalDetails --> Skills: valid Continue
  Skills --> AddSkill: Add new skills
  AddSkill --> Skills: cancel or submit pending row
  Skills --> PersonalDetails: Back
  Skills --> CVReview: Continue
  CVReview --> Skills: Back
  CVReview --> Dashboard: valid upload or explicit skip
  PersonalDetails --> Paused: Save and exit
  Skills --> Paused: Save and exit
  CVReview --> Paused: Save and exit
  Paused --> PersonalDetails: resume step one
  Paused --> Skills: resume step two
  Paused --> CVReview: resume step three
```

Personal details requires name, phone and address. Organisation fields are visible/read-only. Skills form is initially hidden. User input survives back/paused transitions within the same session. The detailed UI specification, not this state diagram alone, defines validation and incomplete-form behaviour.

## Approval workflow

```mermaid
sequenceDiagram
  actor Associate
  participant App
  participant Repo as Session repository
  participant Manager as Manager workspace
  Associate->>App: Submit skill or proposed progress
  App->>Repo: Create pending request
  Repo-->>App: Pending, approved value unchanged
  Manager->>Repo: Read direct-report inbox
  Repo-->>Manager: Proposed value and evidence
  alt Approve
    Manager->>Repo: Approve request
    Repo-->>App: Apply value and close pending state
  else Reject
    Manager->>Repo: Reject with reason
    Repo-->>App: Preserve approved value and show feedback
  end
```

This diagram models the app-session mock contract. Equivalent real writes are future API contracts and currently return 405 on the read-only service. Decision application must be atomic in a real backend; double decisions require conflict handling.

## Logout and race handling

```mermaid
sequenceDiagram
  actor User
  participant App
  participant Auth as AuthManager
  participant Store as Secure storage
  participant API
  User->>App: Drawer, Log out
  App->>Auth: logout()
  Auth->>Auth: Lock session, bump generation, cancel work
  Auth->>Store: Purge app credentials/private state
  Auth-->>App: Unauthenticated event
  App->>App: Clear drafts/files and reset login routes
  Auth->>API: Best-effort revoke when supported
  API-->>Auth: Success, timeout or unsupported
  Note over App,Auth: Late responses cannot restore the old session
```

The read-only server has no revocation endpoint. Native/local logout is still mandatory; copied demo tokens remain valid until expiry/restart. Browser prototype cleanup is not evidence of native secure-store cleanup.

## Runtime configuration, quality and rollout

- [Runtime config](08-runtime-configuration.md) defines trusted bootstrap, allowed changes, schema/revision/expiry validation and bounded cache use.
- [API reference](../../dummy-backend/API.md) defines URL, headers, request/response types, scope and implemented errors; [OpenAPI](../../dummy-backend/openapi.json) is machine-readable for implemented routes only.
- [Detailed user stories](../user-stories/02-detailed-backlog-and-estimates.md) provide ownership, dependencies, acceptance, tests and estimates. Development gates follow contract → package foundations → auth → onboarding → roles → config/device assurance.
- Device gates: biometric cancel/lockout, secure-store failures, release-style pinning, keyboard/back/safe areas, screen readers, text scaling, reduced motion/transparency and process-kill reset.
- Avoid logging credentials/documents. Production identity, file safety, mutation auditing, conflict/idempotency and retention require backend work beyond this read-only server.
