# Integration configuration

The project builds static Astro output (`astro.config.mjs`); it has no deployed request-time server or authentication/payment proxy. Anonymous public catalog reads go directly from the visitor's browser to the verified API. Login, contact and billing stay on the existing application.

| Variable | Visibility / purpose | Default or status |
| --- | --- | --- |
| `PUBLIC_API_ORIGIN` | Public, intentionally exposed backend base | Verified production `https://api.alveta.ai`; missing/empty setting uses that verified default |
| `PUBLIC_APP_ORIGIN` | Public app navigation base | `https://app.alveta.ai`; preserve registration query strings |
| `PUBLIC_SITE_ORIGIN` | Public canonical/social image origin | Unset until deployment is agreed |
| `PUBLIC_INDEXABLE` | Public indexing decision | `false` for this partial landing page |
| `SANITY_PROJECT_ID`, `SANITY_DATASET` | Reserved CMS configuration | Not integrated |
| `SANITY_READ_TOKEN` | Private/server-only CMS credential | Not integrated; never rename to `PUBLIC_*` |
| `API_ORIGIN` | Possible future server-only backend base | Not currently read; adding this alone does not create a server |

`.env.example` contains only non-secret examples/names; do not commit `.env` files. No private API credential is required by the current integration. Neither Firebase nor Stripe libraries/credentials are needed on this marketing page. Legacy variable names (not values) include `NEXT_PUBLIC_API_URL`, `API_GATEWAY_URL`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, and `NEXT_PUBLIC_FIREBASE_{API_KEY,AUTH_DOMAIN,PROJECT_ID,STORAGE_BUCKET,MESSAGING_SENDER_ID,APP_ID}`. Firebase config and Stripe publishable keys are intentionally client-visible in their own app; they are not substitutes for backend authorization. Do not copy them here.

## Origin selection and browser behavior

Production public origin and staging override are documented in [the API reference](legacy-api-reference.md). Runtime hostname `staging.alveta.ai` selects the existing staging API. Explicit development configuration must remain loopback-only; the test simulation uses `http://127.0.0.1:4372/alveta`. Never accept a visitor-supplied target URL or use a localhost production fallback. Origin/path/redirect constraints are maintained in the public API client/config modules.

Public requests use GET, omit credentials/authorization, and time out after ten seconds. Only packages and public models are requested. Cache only normalized public catalog data in browser memory for five minutes; never cache users, checkout sessions, tokens or authenticated subscription data there. Visitor currency is not fetched globally at build time. Backend/CDN cache variation for geo-sensitive currency must be confirmed before any additional caching layer is introduced.

Production public package GET returned `Access-Control-Allow-Origin: *` and both public endpoints loaded successfully in Chromium from local preview on 19 October 2026. This supports these anonymous reads only. Staging CORS, authenticated CORS/cookies, rate limits, arbitrary deployment origins and backend permissions were not verified. CORS is not authentication.

The legacy JWT session is stored in the app origin's localStorage. Its JS-created `has_session` cookie is only a routing marker (`SameSite=Lax`, 30 days), not an authorization token. Marketing must not read, copy or depend on it. A different origin cannot inspect the app's localStorage. Leave authenticated-home redirects and all session handling with the existing app.

## Before adding protected server communication

Obtain explicit approval for a server-capable deployment: an Astro SSR/server adapter or separate trusted serverless/BFF service, hosting secret storage and route ownership. Then define endpoint-specific fixed upstreams, validated inputs, backend user authorization, secure HttpOnly/Secure/SameSite session cookies if adopted, CSRF defenses for cookie-authenticated writes, no shared authenticated-response caching, safe logs and rate limits. Do not add a catch-all proxy or forward arbitrary URLs/headers. Payment providers require server-side amount/coupon/seat validation, signed callback/webhook verification and idempotency. No such functionality is authorized or implemented by this audit.

See [security findings](api-security-audit.md), [public API implementation](../src/lib/public-catalog.ts), and [local HTTP simulation](../postman/README.md). Billing redirects/checkout correctness still need backend-owner verification; displayed prices are informational.
