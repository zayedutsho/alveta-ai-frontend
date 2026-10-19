# API security audit

19 October 2026. Scope: targeted legacy frontend evidence, existing Astro public catalog integration, and non-invasive public verification already recorded in Milestone 6. Backend code, authenticated responses, production secrets and payment provider configuration were not inspected. No penetration tests, brute force, account mutations or payment requests were performed.

## Findings and required actions

| Finding / evidence | Severity and impact | Mitigation / owner |
| --- | --- | --- |
| Public client initially permitted arbitrary HTTP(S) configured bases and followed redirects | Medium configuration risk; requests could reach unintended hosts. This was not proof of token leakage or server SSRF | Implemented: exact HTTPS service allowlist, constrained loopback exceptions, origin/path validation before use, redirect rejection |
| Validated catalog initially returned the upstream object, including unused fields | Medium boundary risk; unnecessary data reached consumers and future spread/render code | Implemented: explicit minimal package/model normalizers, copied nested data, strict primitive currency/tier validation, bounded numeric values and package slugs |
| Legacy access/refresh tokens persist in origin-local browser storage | High impact if XSS occurs; storage is readable by JavaScript. This is a source-observed design, not an exploit finding | Backend/app owner: audit XSS/CSP and consider an approved HttpOnly-session/BFF migration; do not copy sessions into marketing |
| `has_session` marker is JS-writable and source omits `Secure` | Low for marker integrity; it contains no token. Treating it as authorization would be high risk | Never trust marker for access control; backend authorization remains mandatory. Secure flag/redirect handling belongs to legacy owner |
| Backend authorization, object ownership and admin checks are not available for audit | High **if missing**, unverified | Backend owner must verify per-user subscription/payment-method/checkout ownership and admin permissions. UI guards and CORS are not evidence |
| Checkout callers send package slug/currency/coupon/seat inputs, then follow upstream checkout URLs | High **if backend trusts inputs or returns arbitrary URLs**, unverified | Backend must recalculate authoritative totals, validate coupons/seats/currency and allowlist checkout/return destinations; marketing only links to registration |
| GET checkout verification is described as reconciliation/activation by legacy source | High **if ownership, provider verification or replay protection is missing**, unverified | Backend owner must verify signatures/status/ownership/idempotency; do not expose it as an anonymous marketing read |
| Anonymous public GET uses wildcard CORS | Informational; acceptable for intentionally public, credential-free catalogs | Do not generalize to sensitive endpoints; never use CORS as authentication. Authenticated CORS remains untested |
| Contact/auth writes and public reads have no verified backend rate-limit/abuse policy | Medium **if missing**, unverified | Backend: rate limits, validation, generic auth errors, lead anti-spam and retention controls. Do not generate abuse traffic to test this audit |
| Geo-sensitive detected currency could be frozen by shared caches | Medium display/currency correctness risk | Browser-per-visitor reads; no static-build/SSR shared pricing cache. Backend/CDN variation remains a confirmation item |
| Package access IDs and public model names are incomplete relative to each other | Low presentation limitation, observed live contract | Preserve entitlements/counts, display known names and an honest notice; backend owner should reconcile catalogs |

## Existing controls retained

- Only anonymous packages/public models are fetched; no protected auth/admin/payment endpoint or Astro proxy is added.
- Requests omit cookies and Authorization; pricing does not import the legacy auth store or refresh interceptor. A 401 must become a generic catalog error, not an automatic login or privileged retry.
- Package prices/nullable BDT/team fields and features are runtime validated. DOM API text uses `textContent`, and registration package/team query parameters use `URLSearchParams`.
- The five-minute cache is per browser module and used only for public catalogs. Errors are evicted; UI errors do not include upstream response bodies.
- Registration links select a plan, not a trusted payable amount. Editing browser prices cannot grant a subscription through this landing page; backend billing guarantees remain unverified.
- Static hosting holds no request-time secrets and has no open server proxy. Existing Sanity token placeholders are private and unused; no actual credential was copied, printed or committed.

## Hardening and verification record

Implemented in `api-config.ts`, `public-catalog.ts` and `app-links.ts`: allowlisted API origins, HTTP only for documented local development/simulation on a loopback page, exact allowed base paths, no credentials/query/fragment in API configuration, redirect rejection, minimal normalization, no HTTP-cache reuse, generic errors and same-origin app navigation with backslash/control-character rejection. Only two fixed public endpoint functions are exposed. No proxy, authentication, contact submission or payment operation was added. Malformed operator configuration fails early; missing `PUBLIC_API_ORIGIN` deliberately retains the already-verified production default. Missing/mutated runtime configuration fails safely without a request.

Client normalization does not prevent an upstream server from oversharing in its original network response. The backend must redact sensitive fields before sending any public response; no sensitive field exposure was established by this audit. Browser price edits remain possible and harmless only because marketing submits no charge amount and performs no checkout. Backend-authoritative billing still requires owner verification.

Focused tests exercise missing/unapproved origins, invalid/missing prices and team fields, strict response projection, unsafe navigation, 401/403 without auth refresh or upstream-error rendering, rejected redirects, and credential omission with synthetic cookies/localStorage tokens present. Static HTML/JS inspection checks private configuration identifiers and a controlled non-secret canary. The build was run with synthetic `SANITY_READ_TOKEN` and `ALVETA_SECURITY_TEST_CANARY` values; those values were absent from browser output. This is a bounded test, not a claim that arbitrary production secrets or all service vulnerabilities have been exhaustively audited. `@types/node` is a development-only requirement for typed filesystem inspection.

The hardened client was checked live in Chromium: production packages/models both returned 200, all four plans rendered, and no console/page errors were observed. Authenticated requests, staging and checkout were not executed. Final full-suite results are recorded in the development log. A race in the existing loading-state test was corrected using a local simulation response hold/release rather than a timing-dependent assertion.

Baseline evidence: Milestone 6 recorded build/type checks, 52 Chromium tests against local HTTP simulation, and live production package/model GETs with 200 responses and no browser console/page errors. That evidence proves those public reads and their tested client behavior; it does not prove backend authorization, payment totals, webhook security, CSRF, cookies, rate limits, secret absence in every deployment, or security of the complete service.
