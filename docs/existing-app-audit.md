# Existing application audit

Inspected 19 October 2026. Analysis only; no application code changed or commands run that build or install dependencies in the existing project. `alveta-ai-frontend` was empty, including hidden entries. No AGENTS.md was found in the workspace excluding dependency/build directories. Existing repository `git status --short` was clean (using a command-local safe.directory override; no global Git configuration changed).

## Actual stack and page composition

The supplied repository is Next.js 14.2.29 App Router with React 18, TypeScript, Tailwind, Zustand persistence, TanStack Query, Axios, Firebase, Radix, Stripe and Sentry. It is not a standalone HTML landing page. `src/app/page.tsx` composes Hero (including Header), FeaturesSection, IntegrationsSection, PricingSection, CtaBanner, FaqSection and Footer. Most landing components are client components. Root layout also includes query/lightbox providers, toast UI, math and syntax styles used by the product.

The public landing renders without waiting for auth hydration, preserving initial HTML. Once `auth-storage` hydrates, authenticated visitors leave `/` for `/chat` or `/admin` using `postLoginPath`. Access/refresh tokens and the authentication flag persist in localStorage. `has_session` is a non-authoritative, host-scoped, SameSite=Lax marker cookie; backend JWT verification remains the authorization boundary. Do not treat the marker as proof of login.

## Compatibility inventory

| Behavior | Source evidence | Migration requirement |
| --- | --- | --- |
| Login and signup | landing Header, Hero, CtaBanner | Keep `/login`, `/register` on existing app; preserve complete query strings |
| Plan selection | landing PricingSection; `(auth)/register/page.tsx`; `lib/intended-package.ts` | Preserve `/register?package=<original-slug>` and `&team=1`. Registration reads package and stores `alveta_intended_package`; do not change slug case |
| Public pricing | PricingSection and IntegrationsSection | `GET /api/v1/packages` returns `{packages, detected_currency}`; share one browser request/cache and retain USD/BDT and individual/team behavior |
| Model menu | Header; hooks/usePublicModels.ts | `GET /api/v1/models/public` returns `{models}`; current cache is five minutes; selection routes to signup |
| Contact form | `src/app/contact/page.tsx` | Preserve existing `/contact`; POST `/api/v1/contact` with `{name,email,message}`. UI limits name/email to 255 and message to 5000 characters, with pending/success/error states |
| Legal links | Footer, FaqSection and app route files | Retain `/privacy`, `/terms`, `/refund-policy` |
| Fragment navigation | Header, FeaturesSection, CtaBanner | Preserve `#features`, `#pricing`, `#models`; use absolute marketing-home fragments when linking from app pages |
| Social destinations | Footer | Keep existing Facebook, Instagram and LinkedIn URLs; other Figma icons need real destinations |
| Marketing tracking | analytics/MarketingTrackers.tsx | GA4, Meta Pixel, Microsoft Clarity and AdRoll currently run only on `/`, `/login`, `/register`; prevent duplicate injection and preserve this scope |
| Error monitoring | next.config.mjs and sentry.* | Keep product Sentry configuration intact; marketing monitoring is a separate integration decision |

## API and session boundaries

`lib/api-url.ts` uses `https://staging-api.alveta.ai` when browser hostname is `staging.alveta.ai`; otherwise it uses `NEXT_PUBLIC_API_URL` with localhost fallback. `api-client.ts` attaches stored JWTs and refreshes on 401, eventually navigating to login. Marketing-only public requests should use a small unauthenticated client instead of copying token refresh logic. Do not publish a localhost fallback in production.

The Next config also proxies `/api/:path*` to `API_GATEWAY_URL` (localhost:8000 fallback). Actual browser traffic can go directly to a different API origin. The real production origin, CORS policy and geolocation header forwarding must be confirmed. The packages response's detected currency depends on visitor context according to source comments; backend implementation was not supplied and these comments are not live verification.

Protected and product routes include auth callback, password reset, invites, welcome, chat, images, designs, projects, pricing, wallet, billing/checkout-callback, profile, tips, and admin pages. The edge middleware explicitly covers chat/pricing/wallet/billing/profile/admin; other protection also lives in dashboard code. No product route should be shadowed by a marketing catch-all.

## Existing gaps and risks

- Newsletter form only calls preventDefault; it has no submission API. A provider/contract is required before promising a functioning subscription.
- `/cookie-preferences` is linked but has no route in the supplied source.
- Header links on `/contact` use same-page fragments even though that page has no features/pricing sections. New marketing links should resolve against the marketing homepage.
- Package type restricts slug to basic/standard/pro while landing logic also handles Play. Treat upstream slug as validated data in the new boundary rather than copying this inconsistent union.
- Figma model labels, prices and entitlement claims are design content, not verified product contracts. Some existing type comments describe entitlement flags whose backing features do not exist yet.
- Existing integrations graphic changes for BDT/USD; replacing it with a single Bangla-priced asset would regress international display.
- SEO currently sets metadataBase to `https://app.alveta.ai`, title/description, OG and Twitter images. No source sitemap/robots route or explicit canonical was found. Canonical ownership after migration needs a domain decision.

## Deployment evidence and limits

Next uses standalone output. Docker builds with node:20-alpine, exposes port 3000 and runs standalone server.js; a separate development stage runs next dev. Comments refer to Caddy/compose configurations, but those files are not present in the supplied checkout. Their actual routing, TLS, CDN and rollout settings are unknown.

Conceptually reuse navigation destinations, API shapes, pricing logic, currency handling, FAQs/legal links, tracker scope and asset inventory. Rebuild layout, styling, responsive behavior and interactive presentation in Astro. Do not copy app auth, billing or chat logic into marketing.

This is a source audit, not a compatibility certification: no live API, login, contact submission, checkout or production deployment was tested.
