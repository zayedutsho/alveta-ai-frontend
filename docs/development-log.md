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
- Commit: `5dc43dc` — `feat: implement responsive Figma header and application navigation`.
- Remaining: endpoint/CORS must be configured and live model flow verified before production; full auth redirect parity, tracking and cross-domain attribution remain later integration work. No new Resources destination was invented for the hidden Figma layer.

## Milestone 3 — Hero

- Implemented Faculty Glyphic headline, responsive copy, five tool entry points, original layered/masked wing/dot/glow artwork, assistant link, model-logo picker, prompt input, comparison checkbox and Generate signup action. Desktop uses the measured 780px workspace and 670px copy width. Updated mobile context supplies distinct 24px icons and compact toolbar. Layout under 390px and tablet behavior are derived and documented.
- Original desktop and mobile SVGs remain local with original root dimensions; asset-to-node/callsite mapping is in asset-manifest.md. Desktop 1440 and mobile 430 screenshots were visually inspected; no whole-page screenshot or invented replacement artwork is shipped. This is not a claim of pixel-perfect accuracy.
- Hero/header motion context returned no animated nodes. The previously discovered 4s feature animations remain outside scope. CSS transitions respect reduced motion. Prompt submission preserves signup behavior without transmitting/saving entered text; the design credit balance is explicitly labeled illustrative for assistive technology. No AI generation or billing contract was invented.
- Converted Inter Display to WOFF2: 813868 bytes total TTF → 272940 bytes total WOFF2 (~66% smaller). Original copied TTFs are ignored outside public; compressed files and both font licenses are tracked. Faculty Glyphic is locally bundled and preloaded. Existing social image/favicon are preserved; noindex remains the default for this partial page.
- Intentional accessibility deviation: Beta badge uses black text on the original pink gradient. White contrast ranges approximately 1.65–4.36:1; black starts at 4.81:1. Interactive textarea replaces the drawn placeholder/cursor; no typewriter animation is invented.
- Final validation: Astro Check reports zero errors/warnings/hints, production static build succeeds, and all 12 Chromium tests pass with exit code 0. Viewports: 320/375/430/768/1024/1440/1920. Tests cover no overflow, no broken/failed assets or page errors, application route targets, keyboard dropdown/menu dismissal/focus return, reduced motion, comparison input, and no prompt persistence/transmission. Local screenshots: .work/validation/hero-{320,430,768,1024,1440}.png. Browser tests now start Astro directly to avoid a nested npm preview process lingering on Windows.
- Commit: `33da668` — `feat: implement responsive Figma hero with original assets`.

## Review boundary and outstanding integration

Stop after Milestone 3. No customer-logo strip, feature panels, pricing section, testimonials, FAQ, articles, closing CTA, footer, separate 02_Pricing page or full Sanity integration was implemented. No feature branch push, merge or deployment was performed.

Confirm production/staging origins, API/CORS and authoritative integration destinations before enabling live traffic. The optional Models loader has not been checked against the real backend. Authenticated-home redirect across origins, tracking migration/cross-domain attribution, consent/cookie-preferences behavior and live contact/checkout flows remain unverified; the existing application owns and retains those routes. The new partial marketing page is not ready to replace production by itself. Full Sanity schemas, dataset, published queries, preview and rebuild hook belong to the later CMS milestone.

Recommended next milestone after review: customer-logo strip and five feature panels in desktop 02 order, with the specified feature motion and responsive adaptations. Continue CMS work only when that milestone is approved.
