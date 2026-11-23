# Visual design reference

Inspired by the supplied OneCognizant screenshots; approximate colours, not an official brand specification.

- Deep navy navigation, white cards and a pale-blue page background.
- Blue-to-mint-to-yellow hero gradient, purple shortcuts and cyan selected controls.
- Rounded 10px corners, thin blue borders and generous card spacing.
- Poppins when locally available, with Segoe UI/Arial fallbacks; no font download required.
- Responsive cards and role-specific navigation.

## References

- [Interactive prototype](prototype.html)
- [Static component preview](preview.html)
- [Design tokens](design-tokens.json)
- [Asset and inline CSS reference](assets-reference.md)
- [Walkthrough and simulation limits](walkthrough.md)

Both HTML files embed their CSS and icons. The interactive prototype embeds its JavaScript and dummy data. No external CSS, JavaScript, SVG or font files are required.

## Mobile target

React Native on phones is the only application target. HTML is a clickable design reference. Use a single-column layout, safe-area spacing, 48px primary controls, compact three-step onboarding, bottom workspace navigation and bottom-sheet dialogs. The desktop browser presents a centered 430px phone-width mock-up.

## Authentication and account drawer — v1.8

Login actions use a vertical stack of equal full-width buttons, 54px minimum height, with consistent padding and label typography. The drawer uses the header navy (#080541) at 86% opacity, white foreground text, a subtle light border and a blurred/saturated backdrop. An opaque navy fallback supports environments without backdrop filtering. This is a browser glass-effect approximation; native iOS liquid-glass integration is a later implementation choice. Preserve readable contrast and reduced-transparency accessibility in the native version.
