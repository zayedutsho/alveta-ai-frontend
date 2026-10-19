# Proposed architecture and implementation milestones

Status: analysis only, awaiting approval before scaffolding or implementation. Recommended source: desktop Figma 02, with mobile gaps explicitly recorded in design-system.md.

## Application boundary

Use Astro + TypeScript for marketing, native Astro components and small browser scripts. Do not add React to the marketing runtime merely to reuse existing JSX. Sanity Studio has its own framework/runtime dependencies; isolate those from the delivered marketing page, preferably as a separately deployed Studio within the new repository. Select and lock compatible stable Astro/Sanity/Node versions at implementation time after checking host support; do not copy the existing Docker Node version without compatibility checks.

Recommended safest initial deployment: separate marketing origin and existing application origin, with configured absolute app links. Existing Next routes, auth, Firebase callback, checkout, billing, contact and legal pages remain served by the current application. The actual marketing/app domain pair must be confirmed; metadata currently names app.alveta.ai, which does not establish where the new site should live.

Tradeoff: localStorage and host-only cookies are not shared across origins. A separate marketing domain cannot reproduce the current authenticated homepage redirect by inspecting the app's session. Do not transfer tokens via query strings, broaden cookies or treat a marker as authentication. Either explicitly accept a public marketing homepage for returning users, or choose same-origin routing with a tested minimal session bridge before claiming parity.

Alternative: edge/router sends only `/` and explicitly owned marketing routes to Astro, keeping every product/auth/API path on Next or gateway. In this case preserve same-origin auth redirect through a minimal, reviewed bridge compatible with `auth-storage`; do not copy the auth store or use its persisted flag as authorization. Prefix or origin-isolate Astro assets (e.g. `/marketing-assets/`) and distinguish them from Next `/_next/*` and existing public files. Route decisions belong to deployment config, not changes to the read-only app. Neither scheme can be deployed safely until the real proxy/CDN configuration is available.

## Proposed folders

```text
alveta-ai-frontend/
  public/{images,fonts,icons}/
  src/
    components/
      common/{Button,SectionHeading,ResponsiveImage}.astro
      layout/{Announcement,Header,Footer}.astro
      sections/{Hero,CustomerLogos,Features,LatestModels,
                SubscriptionComparison,Pricing,Testimonials,
                Faq,Articles,ClosingCta}.astro
    layouts/MarketingLayout.astro
    pages/index.astro
    styles/{tokens,global}.css
    scripts/{navigation,pricing,models}.ts
    lib/{app-links,public-api,content-validation}.ts
    sanity/{client,queries,images,normalize}.ts
    types/{content,public-api}.ts
  sanity/
    schemas/{documents,objects}/
    structure/index.ts
    sanity.config.ts
  docs/
    existing-app-audit.md
    design-system.md
    architecture.md
    cms-content-map.md
  .env.example
  astro.config.mjs
  package.json
  tsconfig.json
```

Paths are proposed, not scaffolding already created. Additional article/testimonial pages require an explicit scope decision and supplied content; until then their links must use confirmed destinations rather than dead placeholders.

## Rendering and updates

Pre-render marketing copy and imagery from published Sanity documents. Use one centralized typed GROQ boundary and normalizer, explicit published perspective, validated links, image dimensions and alt text. Sanity image rendering should use responsive widths/formats and hotspot/crop support. Keep first-viewport assets eager and reserve geometry; lazy-load below-fold art. Self-host licensed font subsets with font-display: swap and preload only critical faces.

Editorial updates follow: publish/unpublish relevant Sanity document → authenticated deployment/build hook → build reads fresh published content → checks pass → atomic deployment → CDN refresh. Draft edits must not deploy. Queue/coalesce duplicate hooks, provide failure alerts/retry, and retain last successful deployment if build/content fetch fails. Use non-CDN reads for release builds when freshness is required; do not accidentally build from stale CDN data. Preview is separate and authenticated; no draft tokens in browser bundles or public HTML.

Official references: [Sanity's Astro rendering guidance](https://www.sanity.io/docs/astro/static-and-server-rendering), [webhooks](https://www.sanity.io/docs/content-lake/webhooks), [published perspective](https://www.sanity.io/docs/content-lake/perspectives). Static content does not update merely because an editor clicked Publish; build/deploy completion defines visibility.

Pricing and model availability stay dynamic through existing public APIs. Browser-side pricing preserves visitor-specific detected currency; a global build-time API fetch would freeze one price/currency for everybody. Deduplicate requests across comparison/pricing, reserve space, show honest loading/error/empty states and retry, and avoid presenting guessed prices as live. If server-rendered pricing is later required, define visitor-header forwarding and cache variation explicitly. CMS controls marketing copy and arrangement, not checkout totals or entitlements.

## Integration and SEO strategy

- Configure public marketing origin, app origin and API origin independently by environment, with production validation and no localhost fallback.
- Preserve package query values and existing model/signup behavior. Verify whether team=1 is consumed downstream; source shows it emitted, but register only visibly reads package in the inspected code.
- Keep contact submission in existing app initially. Migrating the form requires endpoint/CORS/error/rate-limit verification; never invent a newsletter backend.
- Carry existing tracker IDs/scope through environment-controlled script injection and test one pageview per navigation. Review cross-domain attribution if origins split. Keep product session replay scope unchanged.
- Set canonical, title/description, OG/Twitter, language, robots and sitemap for owned marketing URLs after domain ownership is resolved. Retain existing incoming legal/contact paths through app links/proxying or reviewed redirects. Preview environments should be noindex.
- Use one h1, semantic landmarks, keyboard menus with expanded state/focus return/Escape handling, visible focus, labeled controls, real links and reduced motion. FAQs can use native details/summary unless design behavior requires more.

## Milestones and acceptance gates

1. Resolve scope decisions: authoritative desktop/mobile, deployment domains/route ownership, authenticated-home behavior, destinations, pricing comparison claims, missing copy/assets and Sanity project.
2. Initialize only the new repository after approval; lock compatible versions, document environment names, create token stylesheet, native component foundation and local asset manifest. Preserve existing app untouched.
3. Build sections in the exact Figma order; implement updated mobile hero, derive missing responsive sections with documented assumptions; implement accessible menus/FAQ and specified CSS motion.
4. Add Sanity schemas, editor-friendly singleton structure, typed published queries, seed approved content and verify missing-field handling. Keep private tokens server/build-only.
5. Integrate dynamic packages/models, full signup query links and existing app destinations; configure monitoring/analytics without duplication. Add newsletter only with a supplied contract.
6. Validate Astro build and TypeScript, schema validation, real dataset queries and publish-to-preview/deploy flow. Browser-check at corresponding desktop/mobile sizes, screenshot compare, keyboard use, contrast, reduced motion, image/font failures, console/network errors, overflow at 320–1920px and layout stability.
7. Test source-derived contracts against staging: USD/BDT, team mode, package slug/case, public API failures, existing login/OAuth/verification/checkout callbacks, contact success/errors and origin/session behavior. Perform approved production routing rollout with rollback to previous landing deployment.

No build, live API test, Sanity query or visual implementation comparison has run during this analysis. Do not claim pixel-perfect output or backward compatibility until those gates pass.

## Required access/information

Sanity project ID/dataset, access role, public/private dataset decision, editor accounts, Studio host/CORS, preview expectations and build-hook setup; production/staging domains and proxy/CDN config; API origins and staging access; approved full mobile treatment; additional font files/licensing; original media rights; article/testimonial destinations/content; announcement/Products/Resources routes; newsletter service and cookie-preferences behavior. Credentials should be provisioned through environment/secret management, never pasted into committed files.
