# API security audit

19 October 2026. Scope: targeted legacy frontend evidence, existing Astro public catalog integration, and non-invasive public verification already recorded in Milestone 6. Backend code, authenticated responses, production secrets and payment provider configuration were not inspected. No penetration tests, brute force, account mutations or payment requests were performed.

## Findings and required actions

| Finding / evidence | Severity and impact | Mitigation / owner |
| --- | --- | --- |
| Public client initially permits arbitrary HTTP(S) configured bases and follows redirects | Medium configuration risk; requests could reach unintended hosts. Current calls omit credentials, so this is not proof of token leakage or server SSRF | Restrict API origins/paths, require production HTTPS, reject redirects; new-project hardening in progress |
| Validated catalog currently returns the upstream object, including unused fields | Medium boundary risk; unnecessary data reaches consumers and future spread/render code | Normalize to an explicit minimal schema; new-project hardening in progress |
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

Pending this work: exact API origin/path constraints, redirect rejection, minimal response normalizers, navigation URL boundary checks, and focused failure/security cases. Update this record after validation rather than treating a successful build as a backend security certification.

Baseline evidence: Milestone 6 recorded build/type checks, 52 Chromium tests against local HTTP simulation, and live production package/model GETs with 200 responses and no browser console/page errors. That evidence proves those public reads and their tested client behavior; it does not prove backend authorization, payment totals, webhook security, CSRF, cookies, rate limits, secret absence in every deployment, or security of the complete service.
