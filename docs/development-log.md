# Development log

## Repository setup — 19 October 2026

- Verified both workspace roots were outside a parent Git working tree. The new directory contained only the four analysis documents. The old application is read-only.
- `git ls-remote` confirmed the target GitHub repository was empty before initialization.
- Published initial commit `c956702` (`first commit`) to origin/main. Created feature/astro-sanity-landing. No feature commits are authorized for push.
- Windows sandbox ownership requires a command-local safe.directory override; no global Git configuration was changed.

## Milestone 1 — Astro foundation

- Astro 7.4.0 static output; strict TypeScript; reusable layout, token/global styles, isolated marketing asset prefix, typed editorial contracts and a documented later Sanity boundary.
- Node 24.20.0 satisfies Astro's >=22.22 requirement. TypeScript 6 is used because current Astro Check does not support TypeScript 7; no forced peer resolution.
- Inter Display Regular/Medium copied from the read-only application with its license. Faculty Glyphic Latin 400 comes from the version-locked Fontsource package, self-hosted by the build.
- Environment template separates marketing, application, API and future Sanity settings. Partial/preview builds default to noindex; canonical is emitted only with an explicit marketing origin.
- Validation: Astro Check reported zero errors/warnings/hints; static production build passed; npm audit reported zero vulnerabilities at install.
- Commit: `c1a1bc8` — `chore: initialize Astro foundation and Figma design tokens`.
- Remaining: deployment origins and canonical ownership require confirmation before publishing; CMS integration is intentionally deferred.

## Milestone 2 — Header and navigation

- Implemented desktop 1200×72 navigation, 40px announcement, mobile 64px header/36px announcement, original logos/icons and dismiss control. Native dropdowns support keyboard and Escape; mobile disclosure supports outside-click dismissal, breakpoint reset and focus return.
- App origin is validated centrally. Sign In, signup and product links stay on the existing app; Features/Pricing link to its existing homepage fragments because later sections are outside this milestone. Products opens a menu of existing app destinations. Announcement Try it now uses existing signup pending a confirmed integration-specific destination.
- Optional public Models loader uses the audited endpoint/response, no auth tokens, timeout/error/empty states and retry on reopen. With API origin unset, menu offers signup instead of inventing API settings. No live backend was contacted.
- Local typed editorial data prepares the later Sanity boundary. SVG dimensions are captured in a static manifest, avoiding runtime filesystem dependencies and retaining original exports.
- Validation: production build and Astro Check pass. Three Chromium tests pass (desktop routes/dropdown keyboard, mobile disclosure/Escape/outside click, announcement dismissal/focus). Desktop/mobile screenshots inspected against Figma header geometry. Test selector was corrected to account for the accessible button label changing when expanded.
- Commit reference: `feat: implement responsive Figma header and application navigation` (hash recorded after commit).
- Remaining: endpoint/CORS must be configured and live model flow verified before production; full auth redirect parity, tracking and cross-domain attribution remain later integration work. No new Resources destination was invented for the hidden Figma layer.
