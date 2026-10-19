# alveta-ai-frontend

Alveta marketing landing page, built with Astro and TypeScript. Sanity content integration is planned for a later milestone.

Design reference: Figma landing frame `1276:108` (02). The existing application in `../alveta-frontend` is read-only.

## Local development

Requires Node >=22.22 and npm >=9.6.5. On Windows PowerShell, use `npm.cmd` if script execution policy blocks `npm.ps1`.

```sh
npm ci
npm run dev
```

The development server prints its local URL. `npm run check` runs Astro/TypeScript checks; `npm run build` produces static `dist/`; `npm run preview` serves that build locally. Browser validation: `npx playwright install chromium`, then `npm run build` and `npm run test:browser`.

## Current scope

Milestones 1–5 implement the Astro foundation, responsive announcement/navigation, hero, customer logo marquee, five feature panels, latest-model cards and subscription comparison. Remaining landing sections, separate pricing page, full Sanity integration and production deployment are outside this iteration. No React runtime or CSS framework is shipped. Sanity's later content boundary is described in [the CMS plan](docs/cms-content-map.md) and `sanity/README.md`.

The model and subscription sections are explicitly labelled design examples. Their model names, benchmark figures, dates, prices and savings come from Figma and have not been verified against live product data. Model cards link to general registration, without selecting or purchasing a named model. Typed content is separate from presentation; replace these examples with approved model/API and comparison data before production use. The supplied Bangla fonts are unavailable, so the comparison uses system Bangla fonts with adjusted sizing; responsive layouts below 1024px are derived from desktop 02.

Copy `.env.example` to `.env` to configure origins. `PUBLIC_APP_ORIGIN` defaults to the existing app's documented origin; confirm it before deployment. Optional `PUBLIC_API_ORIGIN` enables the public Models request. Unset API configuration leaves a working signup link. `PUBLIC_SITE_ORIGIN` controls canonical/social image URLs. This partial implementation is noindex by default. Never place Sanity tokens in PUBLIC variables.

The hero is a signup entry point: tools and Generate route to registration. Prompt text is neither sent nor saved; the credit count is illustrative. Features navigates locally to #features; Pricing resolves to the existing application's homepage until that section is approved. Feature CTAs retain the registration destination. Existing contact, legal, OAuth, billing and protected product routes remain owned by that application. The new origin cannot inspect its localStorage session; automatic authenticated-home redirects, analytics migration and live backend connectivity still require integration validation.

Feature copy, logo ordering, CTA destinations and image descriptions are centralized in typed content modules. Original raster artwork lives in src/assets/features and is emitted as responsive, lazy WebP derivatives; SVG exports retain their root dimensions. Comparison artwork uses the refreshed two-second Figma tracks with reduced-motion support. Responsive illustration scaling uses modern CSS container units and typed arithmetic; the current browser validation targets Chromium. Playwright uses port 4371 to avoid an existing local server on 4321.

## References

- [Design system](docs/design-system.md)
- [Architecture and compatibility plan](docs/architecture.md)
- [Development log and validation](docs/development-log.md)
- [Original asset mapping](docs/asset-manifest.md)

Only the initial main commit was published. Development commits remain local on `feature/astro-sanity-landing`; do not push, merge or deploy without approval.
