# Sanity content model proposal

Analysis only. No Sanity project, schema deployment, dataset or credentials were created or assumed.

## Documents and source ownership

| Document | Editable content | Constraints |
| --- | --- | --- |
| siteSettings (singleton) | Site name, logo/alt text, approved navigation, announcement text/CTA, footer columns, social links, attribution, default SEO | One stable document ID; singleton desk entry; prevent duplicate creation; no arbitrary script/embed fields |
| homePage (singleton) | Hero heading/body/CTA, example prompt labels, section headings/descriptions, ordered features, featured customer logos, featured models, comparison copy, pricing introduction/emphasis, testimonial references, FAQs, article references, closing CTA, SEO override | Named field groups in page order; fixed structural sections; stable item keys and drag ordering |
| feature (document or embedded object) | Title, subtitle, description, icon/illustration, two benefit rows, CTA | Start embedded in homePage unless reused elsewhere; image alt required; bounded text guidance |
| customerLogo | Name, logo, destination, accessible label | Reusable document if shared across pages; ordered references from homepage |
| testimonial | Quote, person name, role/company, portrait with alt, optional approved video/link | Require quote/name; never infer quote from portrait; resolve repeated/placeholder roles with editors |
| article | Title, unique slug, summary, cover/alt, category, publish date, author and body OR confirmed external URL | Create body/detail route only if approved in scope; validate unique slug and one destination strategy |
| modelSpotlight | Public API model ID, optional editorial description/image, ordering | Runtime API owns availability; avoid hardcoded release claims or invented API fields |
| pricingPresentation | Package slug, label override, badge, approved supporting copy and display ordering | Optional embedded object; API owns actual price, currency, credit, token values, team limits and feature entitlements |

Actual model/price examples in Figma are not evidence those offerings exist. Match available API data before rendering model cards. Omit unavailable optional editorial spotlights or show explicit unavailability; never make a stale model purchasable through CMS.

## Reusable objects

- link: understandable label and explicit destination kind (marketing fragment, approved app route or external URL). Validate protocol/path; reject javascript/data schemes. Keep environment-specific host resolution in code. Preserve package query strings.
- accessibleImage: image with hotspot/crop plus alt text; decorative flag permits empty alt intentionally. Store intrinsic dimensions via asset metadata, not editor-entered CSS dimensions.
- sectionHeading: heading and optional short introduction.
- featureBenefit: label, value and selected approved icon.
- faqItem: question and plain text or limited rich-text answer with validated links.
- seo: title, description, social image and alt. Canonical origin/environment and preview noindex are deployment-owned; allow canonical override only if a demonstrated editorial use case is approved.
- limited rich text for approved article/FAQ content; render only supported blocks and links with a safe renderer. Never render editor HTML unsanitized.

## Editor experience and validation

Organize homepage groups as Hero, Features, Models, Comparison, Pricing, Social proof, FAQ, Articles, CTA and SEO. Give field descriptions with intended length/examples, thumbnails, readable previews and warning thresholds for headings that wrap beyond the design. Required text should have validation and reasonable maximums based on actual content slots; finalize limits through long-content browser tests rather than arbitrary truncation. Use arrays for editor-controlled order and document references for reused content. Keep colors, font sizes, spacing, breakpoints, script IDs and route ownership out of editor fields.

Prepare initial content from Figma, but flag repeated FAQ questions, missing answers, unapproved testimonials, future/product claims and savings assertions for editorial review. Do not seed invented answers or enable links without destinations. Marketing content changes should not allow editors to change purchasable billing terms.

## Fetching and failure policy

Central Sanity client reads configured project/dataset and pinned API date, with published perspective in production. Keep queries in src/sanity/queries.ts with narrow projections and dereferenced image metadata. Type/validate data at the boundary; normalize omitted optional arrays/strings and image metadata. Generated Sanity types may supplement runtime validation.

Missing optional sections are omitted with no empty headings; missing required singleton/essential content should fail a production build with an actionable message and leave the previous deployment live. Local development may use an explicit, clearly identified fixture. Do not silently replace production content with sample marketing claims. Public API failures get independent UI states; CMS success does not prove live product data works.

A public dataset can be queried without read secrets; a private dataset needs a least-privilege build/server token. Never expose write tokens or draft-preview secrets via PUBLIC variables. The Studio's authenticated editing experience does not justify embedding credentials into the marketing bundle.

## Publishing workflow

Editors save drafts, preview through a separate authenticated preview mechanism if approved, and publish when reviewed. A filtered Sanity webhook triggers a protected host build hook for relevant published changes and unpublishes/deletes. Build queries fresh published content, validates, then atomically deploys. Display or document build status and expected delay for marketing. Keep draft writes from triggering public deployment; webhook retries/coalescing and failed-build alerts belong in deployment setup. Without a configured host hook or manual rebuild, publishing Sanity changes will not update static Astro pages.
