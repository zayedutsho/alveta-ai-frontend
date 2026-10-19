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
- Commit reference: `chore: initialize Astro foundation and Figma design tokens` (hash recorded after commit).
- Remaining: deployment origins and canonical ownership require confirmation before publishing; CMS integration is intentionally deferred.
