# Local public API simulation

Requires Postman CLI 1.70+ (validated with 1.75.0) and Playwright Chromium. No Postman sign-in or cloud upload is needed. `npm run test:browser` starts the simulation on loopback port 4372 and Astro preview on 4371. Leave those ports available; stop a manually started simulation after use.

```sh
postman simulation run postman/simulations/landing.sim.yaml --port 4372 --output ndjson
```

Contract: the existing frontend's Package/PublicAiModel interfaces and verified public responses from `https://api.alveta.ai/api/v1/packages` and `/api/v1/models/public`, captured 19 October 2026. Snapshots contain only fields used here and are test fixtures, never production fallbacks. Owner-mock discovery was skipped because Postman is signed out.

The browser fixture changes only HTML API configuration, then uses real HTTP against the simulation. It grants Chromium permission to reach loopback; production browser security is unchanged and the fetch client is not stubbed. `/__control` resets local scenarios; `/__calls` records requests and whether authentication/cookies were sent; `/__release` releases a held pricing response for deterministic loading-state assertions. Security scenarios include 401/403 with synthetic error canaries and a redirect that must not be followed. Unsupported routes return 501. Do not deploy this handler or its control endpoints.

`tests/api-security.spec.ts` also inspects built HTML/JavaScript for private config names, private-key markers and `ALVETA_TEST_PRIVATE_CANARY_NOT_A_SECRET`. The audit build sets that explicitly non-secret canary in `SANITY_READ_TOKEN` and `ALVETA_SECURITY_TEST_CANARY`; neither variable is a browser configuration value. This proves only the tested build boundary, not absence of arbitrary secrets in every deployment. Do not use real credentials for this check.
