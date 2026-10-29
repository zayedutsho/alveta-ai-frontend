# Landing frontend dependency simulation

Run `postman simulation run postman/simulations/landing.sim.yaml --port 4372 --output ndjson`.

Members:
- `/alveta`: existing package/model contract snapshots; this remains the source of price and entitlement data.
- `/sanity`: published marketing Content Lake query response. `POST /sanity/__control` accepts `document`, `empty`, or `failure`; `GET /sanity/__calls` records the actual SDK query and perspective. Unsupported routes return 501.

The marketing integration tests point only the server-side Sanity client at `http://127.0.0.1:4372/sanity` using `SANITY_API_HOST`, restricted in Astro config to local simulation origins. Browser application API calls still use the existing fixture's real HTTP simulation. No production data is modified by tests.

Mocks do not reload automatically; restart the simulation after changing either member. A stale already-running instance may not have the `/sanity` member.

## Models navigation and library (2026-10-29)

The redesigned navigation and `/models` library reuse the existing public model loader and its `model_id`, `name`, and `provider` fields. Provider names and local logo assets are presentation mappings. Capability tags are omitted because this contract does not establish model capabilities. Featured navigation entries select the first available model from OpenAI, Anthropic, and Google; they do not assert a performance ranking.

Subsequent scope correction on 2026-10-29 supersedes that page and featured-entry design: the separate `/models` page was removed. All API-returned models now appear directly in the navigation dropdown, with search, provider filters, an internal scrolling grid, and retry. Loading remains lazy until the dropdown opens. The production build now generates only the home page.

The updated dropdown-only checks and existing navigation checks passed all nine tests at 320, 430, 1024, and 1440 pixels. They verify all 55 fixture entries render, the final entry can scroll into view, filtering and search stay on the home page, retry recovers after an intercepted 503, logos decode, and dropdown bounds fit the viewport. Tests also read `/alveta/__calls` and confirm `/api/v1/models/public` was requested through the real catalog client. Mobile and desktop dropdown screenshots were visually inspected. Astro check reported zero errors, warnings, or hints, and the production build passed. This evidence applies to the repository stand-ins; production availability is not established by it.

Initial verification was blocked by missing Astro dependencies and an `ENOTEMPTY` installation failure. After dependencies became available, verification on 2026-10-29 passed: `npm run check` reported zero errors, warnings, or hints; `npm run build` generated both pages; and `npx playwright test tests/model-catalog.spec.ts tests/navigation.spec.ts` passed all nine tests against the existing local Postman simulation.

`tests/model-catalog.spec.ts` exercised menu bounds at 320, 430, 1024, and 1440 pixels, provider filtering, search, empty results, logo loading, and recovery after an intercepted HTTP 503. The browser rendered all 55 fixture models after loading and retrying through the actual public catalog client. Dropdown screenshots at 430 and 1440 pixels and the desktop catalog screenshot were visually inspected. These results establish browser behavior against the repository's stand-ins, not production model availability or capabilities. Navigation checks also passed for keyboard handling, outside click, focus return, and sticky positioning.
