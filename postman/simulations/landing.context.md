# Landing frontend dependency simulation

Run `postman simulation run postman/simulations/landing.sim.yaml --port 4372 --output ndjson`.

Members:
- `/alveta`: existing package/model contract snapshots; this remains the source of price and entitlement data.
- `/sanity`: published marketing Content Lake query response. `POST /sanity/__control` accepts `document`, `empty`, or `failure`; `GET /sanity/__calls` records the actual SDK query and perspective. Unsupported routes return 501.

The marketing integration tests point only the server-side Sanity client at `http://127.0.0.1:4372/sanity` using `SANITY_API_HOST`, restricted in Astro config to local simulation origins. Browser application API calls still use the existing fixture's real HTTP simulation. No production data is modified by tests.

Mocks do not reload automatically; restart the simulation after changing either member. A stale already-running instance may not have the `/sanity` member.
