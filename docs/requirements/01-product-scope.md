> Initial design baseline. Where behaviour differs, [current agreed requirements](./00-current-requirements.md) take precedence.

# Product scope

## Confirmed intent

Talent Readiness enables employees to maintain a profile and CV, receive training or business improvement assignments, and record progress with supporting evidence. Managers inspect associate profiles and assign work. Administrators additionally manage manager access. A person may be both an associate and a manager.

Target platforms: Android and iOS. React Native is the app framework. A small RN component library and a reusable TypeScript SDK are learning deliverables. Backend: mocked Node.js + Express REST API. UI prototypes, detailed profile fields and final fixtures are pending.

## Journeys

| Actor | Journey | Successful outcome |
| --- | --- | --- |
| Associate | Sign in → complete profile steps → add image/avatar → upload PDF CV | Profile is saved and recoverable after relaunch |
| Associate | Open assigned activity → update progress → attach evidence | Update is stored or clearly marked pending synchronization |
| Manager | Open team dashboard → inspect profile → download CV → assign activity | Authorized associate receives a visible assignment |
| Manager who is an associate | Switch between My Readiness and My Team | Personal progress and team responsibilities remain separate |
| Admin | Find user → grant/revoke manager capability | Access changes are enforced by API and reflected in the app |

## Proposed boundaries

- Managers access explicitly assigned associates; admins access all associates. This scope needs product confirmation.
- Progress is self-reported; manager approval and evidence review are future options.
- Core activities are training and business improvement, sharing one assignment model.
- One organization and seeded accounts initially; no public registration, real SSO, payroll, HR integrations or real training provider integration.
- Evidence initially supports images and PDFs. File size/type limits require confirmation.
- Advanced exercises include an embedded learning WebView, native capability module and certificate pinning. These support learning without expanding the business workflow unnecessarily.

## Success criteria

A fresh team member can follow setup documentation, run a seeded app and backend, complete each role's journey, demonstrate an authorization denial and an offline recovery, and explain the boundaries between app, UI library, SDK and native platform code.
