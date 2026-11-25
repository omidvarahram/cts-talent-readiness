# UI library: component-by-component

Status: implementation work for humans. The repository currently contains documentation, fixtures and the supporting API/prototype, not these native workspaces. Do not interpret estimates or story descriptions as evidence of completion.

Read [learning solution design](../solution-design/10-human-learning-implementation-plan.md) first and use the [backlog map](README.md) to find prerequisites. All stories are required unless an explicitly described platform limitation is recorded. Each day below is six focused hours for a developer familiar with the tools; learner elapsed time is discussed in the backlog map.

## Stories

| ID | Outcome | Focused person-days | Prerequisites |
| --- | --- | --- | --- |
| [UI-01](#ui-01) | Build theme tokens, typography and icon primitives | 1–1.5 | [FND-08](00-foundations-and-tooling.md#fnd-08) |
| [UI-02](#ui-02) | Build layout and screen composition primitives | 1–1.5 | [UI-01](01-ui-library-components.md#ui-01) |
| [UI-03](#ui-03) | Build buttons, icon buttons and links | 0.5–1 | [UI-01](01-ui-library-components.md#ui-01) |
| [UI-04](#ui-04) | Build form layout and text input components | 1.5–2.5 | [UI-01](01-ui-library-components.md#ui-01), [UI-02](01-ui-library-components.md#ui-02), [UI-03](01-ui-library-components.md#ui-03) |
| [UI-05](#ui-05) | Build phone, search, select and date form controls | 1.5–2.5 | [UI-04](01-ui-library-components.md#ui-04) |
| [UI-06](#ui-06) | Build checkbox groups and form feedback summaries | 0.5–1 | [UI-04](01-ui-library-components.md#ui-04) |
| [UI-07](#ui-07) | Build header and avatar components | 0.5–1 | [UI-01](01-ui-library-components.md#ui-01), [UI-02](01-ui-library-components.md#ui-02), [UI-03](01-ui-library-components.md#ui-03) |
| [UI-08](#ui-08) | Build cards, badges and inline alerts | 0.5–1 | [UI-01](01-ui-library-components.md#ui-01), [UI-02](01-ui-library-components.md#ui-02) |
| [UI-09](#ui-09) | Build progress indicators and labels | 0.5–1 | [UI-01](01-ui-library-components.md#ui-01), [UI-08](01-ui-library-components.md#ui-08) |
| [UI-10](#ui-10) | Build onboarding timeline and bottom workspace tabs | 1–1.5 | [UI-01](01-ui-library-components.md#ui-01), [UI-03](01-ui-library-components.md#ui-03) |
| [UI-11](#ui-11) | Build the mobile data table and scrolling hints | 1–1.5 | [UI-01](01-ui-library-components.md#ui-01), [UI-02](01-ui-library-components.md#ui-02), [UI-08](01-ui-library-components.md#ui-08) |
| [UI-12](#ui-12) | Build drawer, bottom sheet and modal primitives | 1.5–2.5 | [UI-01](01-ui-library-components.md#ui-01), [UI-03](01-ui-library-components.md#ui-03), [UI-07](01-ui-library-components.md#ui-07) |
| [UI-13](#ui-13) | Build file field, file row and image preview presentation | 0.5–1.5 | [UI-03](01-ui-library-components.md#ui-03), [UI-04](01-ui-library-components.md#ui-04), [UI-08](01-ui-library-components.md#ui-08) |
| [UI-14](#ui-14) | Complete state components, gallery and UI release gate | 1–2 | [UI-02](01-ui-library-components.md#ui-02), [UI-03](01-ui-library-components.md#ui-03), [UI-04](01-ui-library-components.md#ui-04), [UI-05](01-ui-library-components.md#ui-05), [UI-06](01-ui-library-components.md#ui-06), [UI-07](01-ui-library-components.md#ui-07), [UI-08](01-ui-library-components.md#ui-08), [UI-09](01-ui-library-components.md#ui-09), [UI-10](01-ui-library-components.md#ui-10), [UI-11](01-ui-library-components.md#ui-11), [UI-12](01-ui-library-components.md#ui-12), [UI-13](01-ui-library-components.md#ui-13), [FND-06](00-foundations-and-tooling.md#fnd-06) |

## UI-01

### Build theme tokens, typography and icon primitives

**User story:** As a developer consuming the UI library, I want to build theme tokens, typography and icon primitives so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | UI library: component-by-component |
| Suggested location | packages/ui; gallery hosted by apps/mobile or a disposable consumer |
| Dependencies | [FND-08](00-foundations-and-tooling.md#fnd-08) |
| Requirement trace | UX-01–03,06–07 |
| Focused estimate | 1–1.5 person-days (six focused hours/day) |
| Coverage gate | 90% on statements, branches, functions and lines; maintain while adding code |

### Learning context

Semantic tokens prevent screen-specific colour/spacing values and make accessibility changes reusable.

### Work step by step

1. Translate the approved navy/pale-blue/cyan/purple design into semantic tokens.
2. Implement ThemeProvider, Text and Icon APIs with sensible defaults and caller overrides.
3. Create examples for body/heading/error text, scaled text and light/opaque surfaces.

### Acceptance criteria

- Consumers style through tokens rather than copying raw values.
- Text remains readable with font scaling and status is not colour-only.
- Icons have correct decorative versus labelled accessibility semantics.

### Tests and failure cases

Render defaults/overrides and test theme context, labels and scaled layout contract.

### Hints

Use semantic names like surface and textMuted, not component-specific loginBlue.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to UI-01; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## UI-02

### Build layout and screen composition primitives

**User story:** As a developer consuming the UI library, I want to build layout and screen composition primitives so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | UI library: component-by-component |
| Suggested location | packages/ui; gallery hosted by apps/mobile or a disposable consumer |
| Dependencies | [UI-01](01-ui-library-components.md#ui-01) |
| Requirement trace | UX-01,07 |
| Focused estimate | 1–1.5 person-days (six focused hours/day) |
| Coverage gate | 90% on statements, branches, functions and lines; maintain while adding code |

### Learning context

React Native layout uses Flexbox and platform insets; a reusable wrapper should not prescribe business navigation.

### Work step by step

1. Implement Box, Stack, Divider, SectionHeader and ScreenContainer.
2. Support safe-area padding, scroll and keyboard-friendly composition via explicit props.
3. Show narrow-screen, long-content and nested-stack examples.

### Acceptance criteria

- No horizontal overflow is introduced by ordinary screen composition.
- Layout accepts children and accessible headings without hardcoded feature names.
- Insets and spacing can be tested/overridden by consumers.

### Tests and failure cases

Test supplied spacing/style props and demonstrate a keyboard-safe form on emulator.

### Hints

Safe-area ownership must be explicit to avoid applying top/bottom padding twice.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to UI-02; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## UI-03

### Build buttons, icon buttons and links

**User story:** As a developer consuming the UI library, I want to build buttons, icon buttons and links so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | UI library: component-by-component |
| Suggested location | packages/ui; gallery hosted by apps/mobile or a disposable consumer |
| Dependencies | [UI-01](01-ui-library-components.md#ui-01) |
| Requirement trace | UX-03–04,10 |
| Focused estimate | 0.5–1 person-days (six focused hours/day) |
| Coverage gate | 90% on statements, branches, functions and lines; maintain while adding code |

### Learning context

An action component needs predictable sizing, disabled/pending behaviour and accessible meaning.

### Work step by step

1. Implement primary/secondary/text variants, fullWidth, loading and disabled states.
2. Create IconButton and external Link presentation with callbacks.
3. Demonstrate equal full-width login buttons and long labels.

### Acceptance criteria

- Actions have at least 48px targets; login example has 54px minimum equal widths.
- Pending buttons prevent duplicate action while preserving label/accessible state.
- Links do not embed company URL policy or authentication logic.

### Tests and failure cases

Press/disabled/loading tests and long-label/screen-reader examples.

### Hints

Minimum height may grow for larger text; avoid fixed-height clipping.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to UI-03; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## UI-04

### Build form layout and text input components

**User story:** As a developer consuming the UI library, I want to build form layout and text input components so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | UI library: component-by-component |
| Suggested location | packages/ui; gallery hosted by apps/mobile or a disposable consumer |
| Dependencies | [UI-01](01-ui-library-components.md#ui-01), [UI-02](01-ui-library-components.md#ui-02), [UI-03](01-ui-library-components.md#ui-03) |
| Requirement trace | UX-06,15,20 |
| Focused estimate | 1.5–2.5 person-days (six focused hours/day) |
| Coverage gate | 90% on statements, branches, functions and lines; maintain while adding code |

### Learning context

Controlled inputs render caller state; domain validation belongs to the app/controller.

### Work step by step

1. Build Form, FormItem, TextField, ReadOnlyField and TextArea with persistent labels.
2. Support required/help/error metadata, focus refs, editable flags and pending state.
3. Create a sample required three-field form with caller-owned validation.

### Acceptance criteria

- Error text is associated with its field and first-invalid focus is possible.
- Read-only values remain visible and cannot trigger change callbacks.
- No HTTP or employee-specific validation is imported into the UI package.

### Tests and failure cases

Type, blur, error, disabled and read-only interaction tests; demonstrate whitespace error supplied by caller.

### Hints

Do not store a second copy of form values inside each wrapper.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to UI-04; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## UI-05

### Build phone, search, select and date form controls

**User story:** As a developer consuming the UI library, I want to build phone, search, select and date form controls so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | UI library: component-by-component |
| Suggested location | packages/ui; gallery hosted by apps/mobile or a disposable consumer |
| Dependencies | [UI-04](01-ui-library-components.md#ui-04) |
| Requirement trace | UX-11,16–17,27 |
| Focused estimate | 1.5–2.5 person-days (six focused hours/day) |
| Coverage gate | 90% on statements, branches, functions and lines; maintain while adding code |

### Learning context

Search and selection have different state from free text; dates need an explicit display/storage contract.

### Work step by step

1. Implement PhoneField keyboard hint and SearchField clear/pending/no-results states.
2. Build a controlled Select/Combobox for skill search and expertise selection.
3. Build DateField with controlled date, maximum/minimum constraints supplied by caller and accessible selected value.

### Acceptance criteria

- Selected option identity is stable even when labels change.
- Search supports no-result/clear and keyboard selection where supported.
- Date value uses documented YYYY-MM-DD contract; app owns future-date rule.

### Tests and failure cases

Test callbacks, options filtering integration, no result and date boundaries with a fake date adapter.

### Hints

Do not convert a date-only last-used value through a timezone-changing timestamp unnecessarily.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to UI-05; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## UI-06

### Build checkbox groups and form feedback summaries

**User story:** As a developer consuming the UI library, I want to build checkbox groups and form feedback summaries so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | UI library: component-by-component |
| Suggested location | packages/ui; gallery hosted by apps/mobile or a disposable consumer |
| Dependencies | [UI-04](01-ui-library-components.md#ui-04) |
| Requirement trace | UX-06,18,28 |
| Focused estimate | 0.5–1 person-days (six focused hours/day) |
| Coverage gate | 90% on statements, branches, functions and lines; maintain while adding code |

### Learning context

Boolean and multi-select values need clear selected state and a discoverable error summary.

### Work step by step

1. Implement Checkbox and CheckboxGroup with supplied values/options.
2. Add help text and reusable validation summary that can focus a linked field.
3. Show CV skip and independent application-role examples using generic labels.

### Acceptance criteria

- All checks have accessible name/checked/disabled state.
- Group supports independent selections without hardcoded roles.
- Error summary remains understandable without colour.

### Tests and failure cases

Toggle via label/keyboard and test disabled/group/error states.

### Hints

The checkbox component should not decide that at least one admin must exist.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to UI-06; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## UI-07

### Build header and avatar components

**User story:** As a developer consuming the UI library, I want to build header and avatar components so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | UI library: component-by-component |
| Suggested location | packages/ui; gallery hosted by apps/mobile or a disposable consumer |
| Dependencies | [UI-01](01-ui-library-components.md#ui-01), [UI-02](01-ui-library-components.md#ui-02), [UI-03](01-ui-library-components.md#ui-03) |
| Requirement trace | UX-01,20,23 |
| Focused estimate | 0.5–1 person-days (six focused hours/day) |
| Coverage gate | 90% on statements, branches, functions and lines; maintain while adding code |

### Learning context

Slots compose reusable headers without binding them to a specific feature or account menu.

### Work step by step

1. Implement AppHeader with title, leading/trailing slots and safe-area contract.
2. Implement Avatar with image, initials, fallback and accessible label.
3. Show avatar/menu-button alignment using supplied children.

### Acceptance criteria

- Long titles and missing images do not overlap controls.
- Avatar falls back to initials when image unavailable.
- Header exposes layout information needed to anchor a drawer without owning logout.

### Tests and failure cases

Test title slots and image failure/fallback; demonstrate narrow width.

### Hints

Choose one component as the safe-area owner.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to UI-07; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## UI-08

### Build cards, badges and inline alerts

**User story:** As a developer consuming the UI library, I want to build cards, badges and inline alerts so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | UI library: component-by-component |
| Suggested location | packages/ui; gallery hosted by apps/mobile or a disposable consumer |
| Dependencies | [UI-01](01-ui-library-components.md#ui-01), [UI-02](01-ui-library-components.md#ui-02) |
| Requirement trace | UX-04,16,21–22,26 |
| Focused estimate | 0.5–1 person-days (six focused hours/day) |
| Coverage gate | 90% on statements, branches, functions and lines; maintain while adding code |

### Learning context

Composable surfaces should communicate state without importing domain objects.

### Work step by step

1. Implement Card with header/body/action slots.
2. Implement StatusBadge with supplied label/tone and InlineAlert with severity/action.
3. Show approved/pending/rejected and staffing examples as consumer data.

### Acceptance criteria

- Status labels remain text-based and readable.
- Cards accept variable content and do not clip evidence/action controls.
- Alert can announce errors without taking focus unnecessarily.

### Tests and failure cases

Test slots/labels/actions and accessible alert semantics.

### Hints

A generic badge receives label and tone; it does not parse an Associate model.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to UI-08; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## UI-09

### Build progress indicators and labels

**User story:** As a developer consuming the UI library, I want to build progress indicators and labels so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | UI library: component-by-component |
| Suggested location | packages/ui; gallery hosted by apps/mobile or a disposable consumer |
| Dependencies | [UI-01](01-ui-library-components.md#ui-01), [UI-08](01-ui-library-components.md#ui-08) |
| Requirement trace | UX-21–22 |
| Focused estimate | 0.5–1 person-days (six focused hours/day) |
| Coverage gate | 90% on statements, branches, functions and lines; maintain while adding code |

### Learning context

Progress is numeric data with bounds and accessibility semantics; requested progress is separate state.

### Work step by step

1. Implement ProgressBar and ProgressLabel with current/max and optional pending/proposed label.
2. Decide/document invalid-number handling consistently.
3. Create approved 25%, requested 75% and completed examples.

### Acceptance criteria

- Accessibility exposes approved numeric progress accurately.
- Pending value never overwrites the approved value automatically.
- Zero/100 and invalid inputs render deterministically.

### Tests and failure cases

Test boundaries, invalid input policy and text/numeric accessibility values.

### Hints

Do not animate a proposed value as though it is approved.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to UI-09; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## UI-10

### Build onboarding timeline and bottom workspace tabs

**User story:** As a developer consuming the UI library, I want to build onboarding timeline and bottom workspace tabs so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | UI library: component-by-component |
| Suggested location | packages/ui; gallery hosted by apps/mobile or a disposable consumer |
| Dependencies | [UI-01](01-ui-library-components.md#ui-01), [UI-03](01-ui-library-components.md#ui-03) |
| Requirement trace | UX-05,14–18 |
| Focused estimate | 1–1.5 person-days (six focused hours/day) |
| Coverage gate | 90% on statements, branches, functions and lines; maintain while adding code |

### Learning context

A navigation indicator displays supplied state; it must not enforce the application role graph.

### Work step by step

1. Implement StepTimeline current/completed/future states.
2. Implement BottomTabs with supplied items, selected key and onSelect callback.
3. Show three-step onboarding and every subset of role tabs.

### Acceptance criteria

- Current step/tab is announced and touch targets remain usable.
- One/two/three granted items render without empty reserved tabs.
- Controls do not navigate to app routes themselves.

### Tests and failure cases

Test selection callbacks and unavailable/future-item policies with one/two/three items.

### Hints

SDK/app decide which tabs are allowed, UI only displays the supplied list.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to UI-10; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## UI-11

### Build the mobile data table and scrolling hints

**User story:** As a developer consuming the UI library, I want to build the mobile data table and scrolling hints so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | UI library: component-by-component |
| Suggested location | packages/ui; gallery hosted by apps/mobile or a disposable consumer |
| Dependencies | [UI-01](01-ui-library-components.md#ui-01), [UI-02](01-ui-library-components.md#ui-02), [UI-08](01-ui-library-components.md#ui-08) |
| Requirement trace | UX-16 |
| Focused estimate | 1–1.5 person-days (six focused hours/day) |
| Coverage gate | 90% on statements, branches, functions and lines; maintain while adding code |

### Learning context

Tables trade compact comparison against mobile width; reachable columns matter more than squeezing every value.

### Work step by step

1. Implement generic columns, rowKey and cell renderers.
2. Support horizontal scroll, meaningful header labels and an optional hint.
3. Show the full skills table with long description, status and evidence action.

### Acceptance criteria

- Title/description/years/last-used/status columns remain reachable.
- Empty data and stable row identity are supported.
- No skill DTO or approval policy is built into the generic table.

### Tests and failure cases

Test headings/cell content/empty data and demonstrate horizontal scrolling on phone width.

### Hints

Avoid using array indices when a stable skill ID is available.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to UI-11; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## UI-12

### Build drawer, bottom sheet and modal primitives

**User story:** As a developer consuming the UI library, I want to build drawer, bottom sheet and modal primitives so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | UI library: component-by-component |
| Suggested location | packages/ui; gallery hosted by apps/mobile or a disposable consumer |
| Dependencies | [UI-01](01-ui-library-components.md#ui-01), [UI-03](01-ui-library-components.md#ui-03), [UI-07](01-ui-library-components.md#ui-07) |
| Requirement trace | UX-07,23–24 |
| Focused estimate | 1.5–2.5 person-days (six focused hours/day) |
| Coverage gate | 90% on statements, branches, functions and lines; maintain while adding code |

### Learning context

Overlays need dismissal, focus, safe insets and motion/transparency fallbacks, not just a positioned box.

### Work step by step

1. Implement controlled SideDrawer anchored below header with right edge, width fraction and backdrop.
2. Implement Dialog and BottomSheet with supplied content and close callbacks.
3. Support back/backdrop/toggle dismissal, focus return, reduced motion and opaque glass fallback.

### Acceptance criteria

- Drawer reference spans 60% width to bottom and animates in/out correctly.
- Hidden content cannot receive focus; overlay does not leak actions to background.
- Company links/logout remain supplied actions rather than library policy.

### Tests and failure cases

Test close callbacks/focus/accessibility states; manually demonstrate back, reduce-motion/transparency and keyboard interactions.

### Hints

Do not use one fixed pixel header height for all devices.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to UI-12; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## UI-13

### Build file field, file row and image preview presentation

**User story:** As a developer consuming the UI library, I want to build file field, file row and image preview presentation so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | UI library: component-by-component |
| Suggested location | packages/ui; gallery hosted by apps/mobile or a disposable consumer |
| Dependencies | [UI-03](01-ui-library-components.md#ui-03), [UI-04](01-ui-library-components.md#ui-04), [UI-08](01-ui-library-components.md#ui-08) |
| Requirement trace | UX-15,18–19 |
| Focused estimate | 0.5–1.5 person-days (six focused hours/day) |
| Coverage gate | 90% on statements, branches, functions and lines; maintain while adding code |

### Learning context

File selection, upload and preview are different states; visual components should not own file permissions.

### Work step by step

1. Implement FilePickerField that invokes supplied picker callback.
2. Implement selected/error/pending FileRow with view/replace/remove callbacks.
3. Implement ImagePreview/avatar selection example with loading/failure fallback.

### Acceptance criteria

- Filename/status/action states are readable on narrow screens.
- Picker cancellation does not create a false selected file.
- Components never persist binary contents or assume a temporary URI is permanent.

### Tests and failure cases

Test callbacks, error/cancel metadata and image failure state.

### Hints

Inject file metadata; native picker and secure file handling live outside UI.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to UI-13; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.

## UI-14

### Complete state components, gallery and UI release gate

**User story:** As a developer consuming the UI library, I want to complete state components, gallery and UI release gate so that the capability is usable, understandable and verified without duplicating another project’s responsibility.

| Planning field | Value |
| --- | --- |
| Status | Not started; implement and demonstrate as a human learning exercise |
| Owner | UI library: component-by-component |
| Suggested location | packages/ui; gallery hosted by apps/mobile or a disposable consumer |
| Dependencies | [UI-02](01-ui-library-components.md#ui-02), [UI-03](01-ui-library-components.md#ui-03), [UI-04](01-ui-library-components.md#ui-04), [UI-05](01-ui-library-components.md#ui-05), [UI-06](01-ui-library-components.md#ui-06), [UI-07](01-ui-library-components.md#ui-07), [UI-08](01-ui-library-components.md#ui-08), [UI-09](01-ui-library-components.md#ui-09), [UI-10](01-ui-library-components.md#ui-10), [UI-11](01-ui-library-components.md#ui-11), [UI-12](01-ui-library-components.md#ui-12), [UI-13](01-ui-library-components.md#ui-13), [FND-06](00-foundations-and-tooling.md#fnd-06) |
| Requirement trace | UX-01–07, quality |
| Focused estimate | 1–2 person-days (six focused hours/day) |
| Coverage gate | 90% on statements, branches, functions and lines; maintain while adding code |

### Learning context

A reusable library needs discoverability and evidence, not only exported functions.

### Work step by step

1. Implement LoadingState, EmptyState, ErrorState and Toast.
2. Build a local gallery route in the app or disposable consumer showing every component/state.
3. Run package/type/interaction checks and enforce at least 90% statements/branches/functions/lines.

### Acceptance criteria

- Every component has a documented public example and relevant failure state.
- Coverage includes unimported owned source and does not exclude difficult branches.
- Packed UI imports cleanly with a single React/RN runtime.

### Tests and failure cases

Run coverage and tarball consumer tests; review screen-reader/font-scale gallery on device.

### Hints

A gallery can be excluded from product coverage; the components it demonstrates cannot.

### Demonstrate and explain

Show the working outcome and one failure case to a reviewer. Explain why the code belongs in this workspace, how state/dependencies are supplied, and one trade-off. Record the commands, output and device/build details when relevant. The reviewer should be able to reproduce it without this chat.

### Done means

- Public contracts and examples are documented; no secrets or real employee files are committed.
- Typecheck and relevant workspace tests pass, including the required coverage gate.
- Failure/cancellation/accessibility cases relevant to the story are exercised, not hidden with exclusions.
- Deliver a small reviewable change linked to UI-14; note platform checks still blocked and their owner instead of claiming success.
- No real npm publication, account creation or production identity configuration is performed merely because a dry-run story describes it.
