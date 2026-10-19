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

## Milestone 4 — Customer logos

- Continued on feature/astro-sanity-landing with a clean initial worktree and all previous commits preserved. Original app remains read-only. No push, merge or deployment.
- Implemented two centered, offset rows in Figma order (8 and 9 tiles), with nine original desktop SVGs and seventeen distinct mobile exports. Desktop tiles are 186×88 with 24px gaps; mobile tiles are 80×36 with 10.44px gaps. Section begins at y=925 on 1440px desktop, y≈605 on 430px mobile. Deliberate viewport clipping matches Figma; an accessible unique-name list avoids repetitive announcements. No marquee was specified or invented.
- Editorial names/order/assets live in typed landing content, not presentation components. Shared ResponsiveAsset preserves original SVG root dimensions. Main landmark now contains both hero and logos while retaining the measured hero boundary.
- Validation: Astro Check zero errors/warnings/hints; production build passes; all 18 Chromium tests pass across 320–1920px, including six new logo tests and existing hero/navigation regressions. Desktop/mobile logo screenshots inspected against Figma. Corrected CSS grid intrinsic sizing so rows remain centered rather than expanding their container. Mobile position assertion permits subpixel rounding (0.016px).
- Test preview uses isolated port 4371 because existing port 4321 is occupied; that existing server was left untouched. Screenshots: .work/validation/m4-logos-{430,1440}.png.
- Commit: `b4339bc` — `feat: implement responsive customer logo section`. Feature panels follow in a separate commit; full Sanity integration remains deferred.

## Milestone 4 — Feature panels

- Implemented all five panels in Figma order: Multi-Agent AI Platform Workspace; Flexible Balance & Top-Ups; Side-by-Side Model Comparison; Private Chat & Vanish Mode; Analyze Files. Uncover Insights. Shared SectionHeading, Button and SVG components use centralized gradient/border tokens. Each panel has semantic heading/definition-list benefits, meaningful illustration alt text and the existing signup CTA. Header Features now navigates to the local #features section; other destinations are preserved.
- Marketing copy/benefits/CTA/alt text live in src/content/features.ts; original raster mappings live in feature-media.ts. Interfaces prepare the future Sanity normalization boundary; no schemas, SDK, Studio, live queries or rebuild hooks were introduced. Small final logo is identified as Carta after inspecting its original export; its legacy asset filename remains customer-cmt.svg.
- Desktop: 1200px section at y=1225, centered 632px introduction, first panel at y=1445, 537px panels/32px gaps, 520×472 artwork. Tablet below 1024px stacks content over artwork. Mobile uses 28px section heading, 20px panel headings and tighter spacing, derived because the supplied mobile frames do not contain these updated panels. Original illustration geometry scales inside a clipping container without modifying SVG paths/root attributes. A responsive test caught and corrected an intrinsic-height issue so the artwork ratio remains consistent at narrow widths.
- Original PNGs are retained in src/assets/features, not copied unoptimized to public output. Astro produces responsive WebP variants at high quality, lazy-loaded with reserved geometry. Example 2.39MB photo becomes approximately 55KB at the 520px rendition; product renditions are approximately 6–36KB at 472px. Original backdrop, crop/masks, document illustration and provider art are retained; no substitute visuals were generated. Comparison layers have a node/geometry manifest in comparison-art.json.
- Refreshed get_motion_context reports a 2000ms repeating timeline (initial audit reported 4000ms). Its two boundary-collapsed tracks (1284:932/979) resolve to static scale and another return is truncated at the boundary. The current exported CSS tracks are preserved rather than inventing replacement timing; reduced motion disables them. Designer confirmation of those tracks remains advisable. No new client JavaScript or animation dependency was added.
- Validation: production build and Astro Check pass. Expanded suite contains 25 Chromium tests, including panel order, link destinations, local Features navigation, reduced motion, aspect ratio/stacking across 320/430/768/1024/1440/1920, all panel image decoding, no overflow, no page/console errors or failed requests, and earlier logo/header/hero regressions (including 375px). Desktop section/first panel/comparison artwork and mobile stacked panels were visually inspected against Figma. Screenshots reset scroll position before full-page capture to avoid an off-viewport fixed skip-link capture artifact.
- Captures: .work/validation/m4-page-{320,430,768,1024,1440,1920}.png; m4-features-{same widths}.png; m4-first-panel-1440.png; m4-comparison-1440.png; logo captures remain m4-logos-{430,1440}.png. Screenshots and build/test outputs remain ignored.
- Commit: `1959e98` — `feat: implement Figma feature panels`.
- Limits: Chromium visual/browser validation only; no Safari/Firefox, screen-reader, Lighthouse or live backend validation was performed. Minor raster/SVG rendering differences and derived mobile behavior mean this is not a pixel-perfect certification. Existing deployment, tracking and cross-origin session dependencies remain unchanged.

## Current review boundary

Milestone 4 is complete at customer logos and feature panels. Do not implement additional sections, 02_Pricing, or full Sanity integration, push, merge or deploy before approval. Original application remains unchanged. Recommended next milestone: latest-model cards and subscription-comparison section, preserving backend ownership of model availability and pricing claims.
