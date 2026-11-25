# Clickable prototype

Open `prototype.html` in a browser. No server, installation or internet connection is needed. All CSS, JavaScript and data are embedded in the HTML file. The HTML embeds a snapshot of all four DB fixtures: 40 people, 10 learnings, 142 assignments and application role mappings.

## Try the flows

1. Choose Alex Morgan in the demo-person selector, simulate company SSO, and complete Personal details, Skills and CV/review. Phone and address are required; CV and skills can be skipped. Alex has all three workspaces.
2. Update learning progress or submit a skill. Approved progress remains unchanged while the request is pending.
3. To test a manager approval, select an associate reporting to Sophie Taylor (for example Noah Williams, ID 6100009), complete onboarding and submit a skill or progress request. Switch to Sophie Taylor (6100004), complete her onboarding, and open Manager Workspace to approve or reject it. Return to Noah to inspect the outcome.
4. In a manager workspace, search a direct report and assign a learning with a due date. Duplicate active assignments are prevented.
5. As Alex, open Admin and search a person. Change application roles and save. The last admin and managers with direct reports are protected.
6. Log out and use the activation form with a matching dummy email/ID. Use Expire session to demonstrate company sign-in after expiry. Use Save and exit during onboarding to save the personal-details draft without logging out. Select Resume setup to return to the saved step.

## Persistence and simulation boundaries

All profile changes, uploads, assignments, approval requests and role changes live in memory. Reloading or closing the page resets them. Switching demo people keeps them during the current page session. Restart demo clears them immediately.

Only a fictional login marker with associate ID and expiry is kept in browser localStorage. It contains no real token, secret or credentials and is not secure authentication. Native secure storage, actual biometric verification, company SSO and server permission enforcement are future app responsibilities. Biometric outcomes are simulated with buttons.

Selected files can be opened during the page session using temporary object URLs. Files are not uploaded. Certificate filenames are checked for the prototype; production needs content validation and secure upload handling. Top-level managers without a reporting manager have no approval fallback in this prototype.

Role-based workspace visibility, direct-report filtering, matching email/ID validation, basic form validation, upload size checks and approval state changes are implemented. The visual prototype does not implement a production identity provider, audit backend, notification delivery or comprehensive skill editing. Existing fixture skills and new submissions contain structured experience and approval information.

## Verification

JavaScript syntax and ten screen-rendering paths were checked using a lightweight DOM stub. Native biometric and SSO behaviour cannot be validated in this browser prototype. Visual browser QA has not been performed.

## Personal-details fix

Name, phone and address are mandatory for Continue and dashboard profile saves. Empty or whitespace-only values show field-level errors and focus the first invalid field. Save and exit permits an incomplete draft, keeps the user signed in, and displays Resume setup.

The delegated click handler no longer re-renders submit buttons before form submission. Fourteen targeted interaction checks passed, including invalid/valid details, progression through Skills and CV to the dashboard, draft save and resume. These checks used a lightweight DOM test harness; visual browser/device QA remains outstanding.

## Mobile prototype v1.3

The prototype now represents phone screens for the React Native mobile app: a maximum 430px viewport, single-column forms/cards, bottom role navigation, and bottom-sheet dialogs. Demo controls are collapsed at the top. On a desktop, the centered narrow view represents a phone screen; no desktop app layout is intended. This remains HTML for reviewing flows, not React Native implementation code.

Fixed form submission by reading the form identifier via getAttribute: the read-only Associate ID input named id hides HTMLFormElement.id in real browsers. Regression checks now explicitly simulate that named-field behaviour. Activation, required-field validation, Personal details → Skills → CV → Dashboard and save/resume passed eight targeted checks. Native and visual device QA remain outstanding.

## Skills table — v1.4

Both onboarding Skills and dashboard Skills show a horizontally scrollable table with title, description, years of experience, last used and approval status. Add new skills is a full-width button that reveals the form. Submitting adds a pending row and hides the form; Cancel hides it without submitting. Superseded in v1.5: all initial table values now come from the structured synthetic JSON skill records. Five targeted rendering/interaction checks passed for the table and reveal/submit behaviour.

## Fixture update — v1.5

Structured skill data and seven pending skill approvals are embedded from the DB fixtures. To inspect a seeded approval, choose Daniel Chen (6100003) to see a pending skill, then Alex Morgan (6100001) as the reviewing manager. Newly submitted skills remain session-only.

## Account menu — v1.6

On any dashboard, open the three-dot menu beside the avatar. One Cognizant opens the company portal in a new tab. Log out clears the application login marker and application-prefixed session/local storage, resets domain changes, releases temporary uploads and returns to login. Seven targeted checks passed for menu rendering and logout cleanup; unrelated origin storage is preserved.

## Sliding account drawer — v1.7

Tap the menu beside the avatar to open the right-side 60%-width account drawer. It extends from under the header to the bottom and covers bottom navigation. Tap the menu again or the shaded outside region to close it; Escape also works. Six targeted behaviour/style checks passed. Visual browser QA remains outstanding.
