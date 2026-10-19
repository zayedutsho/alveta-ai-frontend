# Legacy API reference

Audited 19 October 2026. Legacy root: `D:/alveta/alveta-frontend` (read-only). Reuse this reference before scanning that repository again; revisit only a missing, conflicting or changed contract.

Evidence: **Live** = anonymous GET and Chromium/CORS verification during Milestone 6 on this date; **Source** = observed caller/type definition only. Source evidence does not prove deployed authorization, rate limiting or response completeness. No authenticated, payment, contact or administrative request was executed.

## Origins and transport

| Environment | API base | Evidence |
| --- | --- | --- |
| Production | `https://api.alveta.ai` | Live; extracted from deployed `app.alveta.ai` public JavaScript, then verified public endpoints |
| Staging | `https://staging-api.alveta.ai` | Source: `src/lib/api-url.ts`, selected when browser hostname is `staging.alveta.ai`; not live-tested |
| Development | `http://localhost:8000` | Source fallback and `.env.example`; not a production fallback |

Legacy `api-client.ts` uses Axios, JSON Content-Type/Accept, a 40s timeout, and a stored bearer token when present. It refreshes once on 401 with a shared refresh queue. No Axios `withCredentials: true` was found in this client. Firebase exchange uses JSON `fetch`. New anonymous catalog reads intentionally omit cookies and authorization and do not refresh/login on 401.

`next.config.mjs:14–18` maps `/api/:path*` to the server-side `API_GATEWAY_URL` (development fallback localhost:8000). That rewrite is not an Astro proxy and must not be assumed to exist on the static marketing host.

## Public catalog contracts — used by Astro

| Method/path | Contract | Classification / evidence |
| --- | --- | --- |
| GET `/api/v1/packages` | `{ packages: Package[], detected_currency: 'USD' | 'BDT' }` | Public read-only / Live |
| GET `/api/v1/models/public` | `{ models: PublicModel[] }` | Public read-only / Live |

Consumed Package fields: `id`, original-case `slug`, `name`, `description`, `price:{usd:number,bdt:number|null}`, `token_value:number|null`, `model_access:string[]`, `features`, `is_team_enabled:boolean`, `per_seat_price:{usd:number|null,bdt:number|null}`, `min_team_seats:number`. Feature booleans consumed: `image_gen`, `video_gen`, `voice_gen`, `api_access`, `ide_integration`, `prompt_library`; `support_tier` is `standard|priority`. Additional upstream fields are unnecessary for this UI. Type declarations omit `Play` from their slug union, but live data includes original-case `Play`; retain that exact value in registration links.

Consumed PublicModel fields: `model_id`, `name`, `provider` (strings). The upstream interface also contains capabilities/pricing; do not forward them unnecessarily. Some package model IDs are absent from the public model response; display known names with an explicit incomplete-name notice.

Package BDT prices are independent sticker prices, not converted USD wallet balances. Use detected visitor currency, permit display switching, fall back to USD when a BDT value is null, and never convert or manufacture token values. Team seat prices/minimums are separate from individual prices. Monthly display comes from legacy PricingCard/TeamPlanChooser behavior; the public package contract inspected has no billing-period selector. Discounts are not part of the public package read contract.

## Authentication and navigation — remain in the existing app

| Method/path | Request / consumed response | Classification / evidence |
| --- | --- | --- |
| POST `/api/v1/auth/login` | Login form email/password → `{access_token,refresh_token,token_type,expires_in}` | Authentication entry (public write), Source |
| POST `/api/v1/auth/register` | `{name,email,password,password_confirmation,currency}`; success is sufficient for UI | Authentication entry (public write), Source |
| POST `/api/v1/auth/firebase` | `{id_token}` → tokens and user | Authentication entry (public write), Source |
| GET `/api/v1/auth/me` | Bearer token → current user | Authenticated user API, Source |
| POST `/api/v1/auth/refresh` | `{refresh_token}` → replacement access/refresh tokens | Sensitive session API, Source |
| POST `/api/v1/auth/logout` | Authenticated logout; dashboard/admin caller | Authenticated user API, Source |
| POST `/api/v1/auth/password/forgot` | Email form; UI handles success | Authentication entry (public write), Source |
| POST `/api/v1/auth/password/reset` | `{token,password,password_confirmation}` | Sensitive session API, Source |

Authentication/contact entry points are public **writes**, not public read-only APIs; that additional classification avoids incorrectly treating them as safe catalog requests. Their deployed anonymous access and backend validation were not tested.

Use existing `/login`, `/register?package=<original-slug>` and optional `&team=1`. `register/page.tsx` consumes `package`, and `intended-package.ts` stores it as `alveta_intended_package` for later selection. Landing team seats are informational; do not invent a seat-count query contract. No `team` consumer was verified in registration. Post-login destination comes from `post-login-redirect.ts` (`/chat` or `/admin`). Do not implement cross-origin localStorage session detection in marketing.

## Billing and payment — do not call from the landing page

All rows below are **Source** evidence and expected to require the existing app's bearer session; backend enforcement is unverified. Payment-related rows also require backend ownership/price validation and must not use the public catalog cache.

| Method/path | Request / consumed response | Classification |
| --- | --- | --- |
| GET `/api/v1/subscription` | `{subscription: Subscription|null,organization_role:'admin'|'member'|null}` | Authenticated user API |
| POST `/api/v1/subscription/subscribe` | `{package_slug,payment_source:'card'|'bkash'|'upay',currency,coupon_code?}` → `{checkout_url?}` | Sensitive payment API |
| POST `/api/v1/subscription/team` | `{package_slug,seat_count,payment_source,currency}` → `{checkout_url?,message?}` | Sensitive payment API |
| POST `/api/v1/subscription/upgrade` | `{package_slug,payment_source,currency}` → `{checkout_url?,message?}` | Sensitive payment API |
| POST `/api/v1/subscription/retry-renewal` | `{payment_source,currency}` → `{checkout_url?}` | Sensitive payment API |
| POST `/api/v1/subscription/cancel` | `{}` → `{access_until}` | Authenticated billing API |
| POST `/api/v1/subscription/coupons/preview` | `{code,package_slug,currency}` → `{valid,message?,coupon?,currency?,original_price?,discount?,final_price?}` | Sensitive payment API |
| GET `/api/v1/checkout/{sessionId}/verify` | `{status,reason?}`; source says it can reconcile/activate payment | Sensitive payment API, despite GET |
| POST `/api/v1/topup` | `{amount,currency:'USD',gateway:'stripe'|'bkash'|'upay'}` → `{checkout_url}` | Sensitive payment API |
| GET/POST `/api/v1/payment-methods` | Read `{payment_methods: PaymentMethod[]}`; create `{payment_method_token}` | Sensitive payment API |
| PATCH `/api/v1/payment-methods/{id}/default`; DELETE `/api/v1/payment-methods/{id}` | Method ownership required; caller only checks success | Sensitive payment API |

PaymentMethod presentation includes id/gateway/type/last_four/card_brand/expires_at/is_default/is_active/created_at, never full card details. Legacy Stripe Elements uses a publishable frontend key and posts a token; secret keys remain a backend concern. Hosted checkout navigation is driven by backend `checkout_url`. Callback identifiers include Stripe `session_id`, bKash `paymentID`, and Upay `invoice_id`; query `status` is not proof of payment. Currency, prices, coupons, seat limits, ownership, signatures and idempotency must be enforced by the backend, not marketing JavaScript. Backend code was not supplied for verification.

## Contact, integrations and privileged boundaries

POST `/api/v1/contact` takes `{name,email,message}`; `src/app/contact/page.tsx` treats a successful response as sent. Classification: intended public intake/write, Source only. Keep the existing app contact flow; no lead form/API was added. Backend anti-spam, consent handling, retention and rate limits require confirmation.

`components/landing/IntegrationsSection.tsx` reuses public packages for comparison. No separate customer-facing integration provisioning/API-key endpoint was found in the targeted settings/hooks searches. `api_access`/`ide_integration` flags do not prove a particular public integration route exists. Do not invent one.

Admin package management calls GET `/api/v1/packages/admin`, POST `/api/v1/packages`, and PATCH `/api/v1/packages/{slug}` from `src/app/admin/packages/page.tsx`. Classification: privileged/server-restricted operations, Source only; require backend admin authorization. GET `/api/v1/packages` being public does not make POST public. No privileged operation is implemented in Astro.

## Source index

Legacy paths: `src/lib/{api-url,api-client,intended-package,post-login-redirect}.ts`, `next.config.mjs`, `src/stores/auth-store.ts`, `src/middleware.ts`, `src/types/index.ts`, `src/hooks/{usePublicModels,useCurrentSubscription,useDisplayCurrency,useFirebaseAuth}.ts`, `src/components/landing/{PricingSection,IntegrationsSection}.tsx`, `src/components/pricing/{PricingCard,TeamPlanChooser,CouponInput}.tsx`, `src/components/settings/{PlansView,PaymentMethodsView,WalletView}.tsx`, `src/app/(auth)/{login,register,forgot-password,reset-password}/page.tsx`, `src/app/(dashboard)/billing/checkout-callback/page.tsx`, `src/app/contact/page.tsx`, `src/app/admin/packages/page.tsx`.
