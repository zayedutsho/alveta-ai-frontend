# Figma design system and coverage

Analysis captured 19 October 2026 through Figma MCP. Source: https://www.figma.com/design/ek43i9shC60M3eI0puloVx/Alveta-_-AI-ChatHub--Copy-?node-id=1133-4153

## Coverage and authoritative-frame decision

The URL identifies canvas `1133:4153`, named `Redesign - 19 Oct`, not one landing frame. Page metadata, direct Plugin API inspection, section-level design context, variables, desktop/mobile screenshots and motion context were used. Full-frame desktop design context was sparse; detailed context was retrieved for all major content sections before extracting recommendations. No design or application nodes were edited.

| Frame | Dimensions | Observation |
| --- | --- | --- |
| `1138:14859` 01_ Home | 1440 × 9710 | Alternate complete desktop composition with broadly matching section structure |
| `1276:108` 02 | 1440 × 9684 | Recommended desktop reference; expanded content and animated feature art |
| `1302:4839` Mobile 1 | 430 × 5682 | Older hero, feature grid, dollar pricing and older CTA; not a complete responsive equivalent of desktop 02 |
| `1302:5785` Mobile 2 | 430 × 5682 | Updated Faculty Glyphic hero and logo rows; middle is largely blank; older CTA/FAQ/footer remain |
| `1298:734` Pricing | 1440 × 3190 | Separate pricing composition; potential collision with existing authenticated `/pricing` |
| `1298:1325` Pricing | 1440 × 876 | Alternate/cropped pricing experiment with children outside frame bounds |

Detached feature, logo-strip, testimonial and illustration explorations also exist on this canvas. They are not automatically extra landing sections. The two connector accounts exposed inconsistent file/page context; the working official Figma MCP session supplied the canvas and design details above. Top-level metadata listing returned only Cover despite direct access to this canvas, so this audit does not claim that every page/library in the file was accessible.

## Desktop section order and layout

| Section / node | Size and placement within desktop 02 |
| --- | --- |
| Announcement, nav and hero / `1276:110` | 1440 × 855 at y=0; announcement 40 high; nav x=120/y=62, 1200 × 72, 14 padding, radius 12; hero content x=330/y=234, 780 × 480 |
| Customer/logo rows / `1276:1266` | 1200 × 200 at x=119/y=925; two rows of logos, some deliberately extend outside strip bounds |
| Features / `1284:667` | 1200 × 3033 at x=120/y=1225; centered 632 × 176 introduction; panels begin y=220 with gap 32 |
| Latest models / `1286:1108` | 1440 × 532 at y=4331; four model cards |
| Subscription comparison / `1286:1259` | 1200 × 644 at x=120/y=4963; heading/copy plus connected provider diagram |
| Pricing / `1286:1669` | 1200 × 907 at x=120/y=5734; Basic, Play, Standard, Pro; Play emphasized |
| Testimonials / `1286:2123` | 1440 × 696 at y=6741; content x=120/y=100 within section; four portrait/quote cards |
| FAQ / `1286:2216` | 1188 × 520 at x=120/y=7537; two columns, one expanded answer shown |
| Articles / `1286:2259` | 1200 × 437 at x=120/y=8157; three 384 × 341 cards, 24 gaps, 350 × 192 image slots |
| Closing CTA / `1286:2560` | 1440 × 400 at y=8655; text left, provider network right |
| Footer / `1298:1230` | Component, 1440 × 629 at y=9055; links/newsletter, large watermark logo, product attribution |

Five feature panels, in order: Multi-Agent AI Platform Workspace; Flexible Balance & Top-Ups; Side-by-Side Model Comparison; Private Chat & Vanish Mode; Analyze Files. Uncover Insights. Each includes icon, heading/subtitle, body, two benefit rows, CTA and distinct illustration. Typical panel padding 32, radius 24, inner image radius 16 and two-column composition; preserve panel-specific geometry from design context.

## Typography

| Role | Measured specification |
| --- | --- |
| Desktop hero | Faculty Glyphic Regular, 46px, automatic line height, 0 tracking |
| Updated mobile hero | Faculty Glyphic Regular, 32px / 38px |
| Section heading | Inter Display Medium 500, 40px / 52px; feature introduction uses 54px line height |
| Feature/plan heading | Inter Display Medium, 24px, automatic line height; feature headings use 1% tracking |
| Model title | Inter Display Medium, 28px, automatic line height |
| Large body | Inter Display Regular, 18px / 135% |
| Body/nav | Inter Display Regular, 16px / 150% |
| Small body | Inter Display Regular, 14px / 140% |
| Extra-small body | Inter Display Regular, 12px / 135% |
| Small button label | Inter Display Medium, 14px / 100%, 3% tracking (0.42px) |
| Tiny label | Inter Display Medium, 12px / 100%, 2% tracking |
| Older mobile section headings | Inter Display Medium, 28px, auto line height; guidance only until responsive content is resolved |

Comparison artwork also uses Google Sans Flex Medium, Li Mehdi Ekushey Unicode Regular and November Bangla Traditional Bold. Existing app supplies Inter Display TTFs and LICENSE, but the additional font files and web licensing/embedding rights have not been supplied. Mixed-font runs occur in prices/copy; do not interpret missing scalar fontSize/fontName on mixed nodes as zero. Variable labels reporting heading lineHeight 100 are ambiguous without units; actual heading nodes and generated context above are the implementation reference.

## Colors, effects and spacing

Measured variables: primary `#7D52F4`; primary light `#9E86F8`; primary wash `#F5F3FF`; deep purple `#380E87`; darkest purple `#16033F`; heading `#111111`; text `#262626`; paragraph `#464545`; muted `#6F6F6F` and `#8A8A8A`; borders `#E4E4E4` (often 50% opacity); white `#FFFFFF`; surface `#FAFAFA`; neutral `#F7F8FD`; footer divider `#282828`. Error `#F04438`, error wash `#FEECEB`, warning `#F9A63A`.

Hero base gradient is approximately 132.068deg from `#F3F0FF` to `#F0F6FF`, layered with original wing/pattern assets and white fade. Testimonials use `#F5F3FF`; final CTA uses `#380E87`; footer uses `#111111`. Gradient variable names themselves contain no usable stop values, so use node-level paint/context, not empty variable strings.

Observed recurring gaps: 4, 8, 12, 16, 20, 24, 28, 32, 40, 44, 48, 52px. Typical large section separation is 100px; use actual measured section bounds where exceptions occur. Main desktop content max-width is 1200px with 120px gutters at 1440. Border radii include 8, 12, 16, 20, 24 and 99px (pill). Main CTA buttons are generally 44px tall, with design minimum height 36px. Mobile horizontal gutters are 16–17px.

Named nav shadow: x=0/y=2, blur=4, spread=0, `#919EAB29`. Input shadow: x=0/y=1, blur=3, spread=1, `#00000014`. Article/pricing cards use subtle 0/1/3px black 8% shadow. Buttons contain multiple subtle outer/inset shadows; retain their exact generated specifications during implementation rather than flattening all controls to one global shadow.

## Components, assets and behavior

Logo instance properties inspected: Color=Default, White=No, Fav Icon=No. Background Component 1 has variants 1 and 2 (opposing wings). Footer is a component and pricing page uses an instance. No local component sets were found on the inspected canvas; do not infer a full hover/disabled/active state system from static instances. Menus show chevrons, but their actual interaction contracts need matching to product destinations.

Use original exported provider/customer logos, hero wings, dot patterns, five feature illustrations, comparison network, testimonial portraits, article thumbnails, footer watermark and attribution logo. Asset URLs were returned by section context; no assets were downloaded during analysis. Implementation needs a local asset manifest preserving Figma node/slot, dimensions, file and callsite. Never ship temporary Figma URLs or a whole-page screenshot as UI.

Motion context on desktop 02 identifies six vectors (`1284:889`, `914`, `932`, `953`, `979`, `1000`) coordinated on one 4000ms repeating timeline. Each scales from 1 to about 1.14 and back with staggered peaks (10.5%, 23%, 35.5%, 48%, 60.5%, 73%). Reproduce with CSS keyframes; disable decorative motion under prefers-reduced-motion. Do not assume a marquee, hover-flip testimonial or scroll effect is specified merely because the static composition suggests one. Existing app typewriter and SVG signal motion are separate implementation behavior, not new Figma evidence.

## Unresolved design specifications

- Confirm desktop 02 as the source and updated Mobile 2 hero as the mobile reference. Mobile 2 omits most new desktop sections; Mobile 1 contains older content and different plans. Neither is a complete mobile specification for desktop 02.
- No tablet frame was identified on this canvas. Proposed responsive strategy: fluid 1200px max-width; mobile nav when links no longer fit; feature/image and CTA columns stack; card grids 4→2→1; FAQ 2→1. These are proposals, not extracted Figma breakpoints. Validate 1440+, 1024–1439, 768–1023, and below 768 including 320/375/430.
- Navigation adds Products and Resources, announcement says use Alveta inside other tools, and View all links exist for testimonials/articles. Destinations and implementation scope are not supplied.
- Pricing pages are outside the landing scope unless explicitly included; `/pricing` is already protected product functionality.
- Duplicate FAQ questions and repeated payment questions are present; several answers are absent. Testimonials repeat a role, and article body/destination content is not supplied. These need editorial decisions, not silent invented content.
- Savings percentages, Bangla prices, model names/dates and composer credit count are unverified design claims. CMS may own approved comparison copy; backend must own actual purchasable prices/entitlements.
- Hover/focus/disabled behavior and mobile menu-open layout need derived accessible specifications. Muted text and small labels require measured browser contrast checks.
