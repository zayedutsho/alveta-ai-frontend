# Marketing content in Sanity

For editors: [Marketing team quick guide](marketing-team-guide.md).

Project: `iwd3xpdu` · Dataset: `production` · Studio: `studio/`.

Open Studio with `npm run dev` from `studio`, then open **Landing Page**. Its tabs cover SEO, navigation, announcement, hero/chatbar copy, customer logos, features, model spotlights, subscription comparison, pricing copy, testimonials, FAQs, article previews, closing CTA, footer, and images/logos.

## Editing and publishing

Edit text in its section tab. Replace customer/brand logos and feature illustrations in **Images & Logos**. Portraits, social icons, and article covers have image upload fields inside their content items. Add alternative text and use the image hotspot/crop tool when needed.

Content lists can be reordered. Fixed design slots retain their identifiers and artwork geometry. Decorative textures, masks, UI icons, animation paths, and application routing remain in code. The two optional artwork replacement slots preserve the existing animated illustration while empty.

Click **Publish** to make edits available to the frontend. This is a **static Astro site**: production content is read during `npm run build`, so a new build/deploy is required after publishing. During local development, refresh the page to fetch published changes. Studio drafts are never shown publicly.

The frontend is hosted on Vercel. To automate production updates:

1. Deploy the current frontend code to Vercel first. Use the frontend repository root, build command `npm run build`, and output directory `dist`. The Studio in `studio/` is separate from this frontend deployment.
2. In the Vercel project, open **Settings → Git → Deploy Hooks**. Create a hook named **Sanity Publish**, selecting the project's actual production branch.
3. Save the generated URL in the frontend's gitignored `.env.local` file as `VERCEL_DEPLOY_HOOK_URL=...`. Do not commit or share the URL; it can trigger builds.
4. From `studio`, run `npx sanity exec scripts/configure-vercel-hook.ts --with-user-token` to check the configuration without writing anything.
5. To register the webhook, run:

```powershell
$env:SANITY_DEPLOY_HOOK_APPLY = '1'
try { npx sanity exec scripts/configure-vercel-hook.ts --with-user-token }
finally { Remove-Item Env:SANITY_DEPLOY_HOOK_APPLY }
```

The helper creates one Sanity document webhook for this Landing Page in `production`, using POST. Draft and version events are excluded. It does not replace an existing mismatched webhook and never prints the deploy URL. No hook or deployment is created until the URL is supplied and the apply command runs.

After setup, publish a content edit, check **Sanity → API → Webhooks** for successful delivery, then check Vercel's deployment status. The live site updates when the build finishes; saving drafts does not trigger a deployment. A successful webhook response only confirms Vercel accepted the deployment request, not that the build completed.

## Product API boundary

Sanity controls marketing copy only. Package prices, token allowances, model availability, feature entitlements, team seat rules, currencies, registration, and checkout still come from the existing application API and routes. The model spotlight cards and subscription-comparison amounts are editorial design examples, not checkout data; retain their explanatory notices until reviewed.

The newsletter and article previews retain their existing behavior; publishing copy does not activate a newsletter backend or full article routes.

## Configuration

The frontend uses the official `@sanity/astro` integration and Sanity image URL builder. Project/dataset defaults match this Studio; override `SANITY_PROJECT_ID` and `SANITY_DATASET` through deployment environment variables. A public dataset does not require a read token. If a private dataset is used, configure `SANITY_READ_TOKEN` as a server-only secret. Never put a token into a `PUBLIC_` or `SANITY_STUDIO_` variable or commit it.

Missing or unavailable CMS content falls back to the current local editorial defaults. Application API data never falls back to CMS prices. Invalid links are rejected by the content normalizer, which only accepts known editorial fields.

## Import plan and reruns

Source: the existing TypeScript content files and local marketing media. Target: the existing Landing Page document, with a singleton Studio entry; existing hero edits and any existing draft are preserved. Section-owned data stays embedded in that document; Sanity assets are referenced from image fields. There are no URL or route changes and no redirects are needed.

From `studio`, run `npx sanity exec scripts/seed-marketing.ts --with-user-token` for a read-only plan and snapshot. The script records source data, a document backup, and an inventory in the gitignored `.work/sanity/` directory.

To apply the import in PowerShell:

```powershell
$env:SANITY_SEED_APPLY = '1'
try { npx sanity exec scripts/seed-marketing.ts --with-user-token }
finally { Remove-Item Env:SANITY_SEED_APPLY }
```

The importer uses checksum-cached asset uploads, stable array keys, revision checks, and `setIfMissing` patches. It never replaces an existing section or publishes a draft. Review `.work/sanity/import-report.json` for added fields and verified image counts. Existing remote edits remain authoritative on rerun.

After schema/query changes, run `npx sanity schemas extract --force` and `npx sanity typegen generate` from `studio`. Build and validate both Studio and frontend before deploying.

## Validation notes

The initial import filled 14 section groups plus the media library and verified 44 uploaded image assets. Studio build, schema validation, generated types, and frontend build/type checks passed. The CMS/API/image regression tests use the existing Postman simulation; they verify published-only content, local fallback during an outage, safe links, editable image URLs with fixed slot geometry, and unchanged application pricing.

Six older customer-logo tests remain outside this CMS change: five look for a `data-marquee-toggle` control absent from the existing component, and one expects a 430px mobile page position from before the interactive hero changes. The CMS comparison test confirms imported content and local defaults have the same mobile flow. These tests were not weakened or the carousel redesigned to conceal the pre-existing mismatch.
