# Header and hero asset audit

Source: Figma file `ek43i9shC60M3eI0puloVx`, desktop `1276:110`, mobile header `1302:6433`, mobile hero `1302:6668`, `1302:6671`, `1302:6706`. Original SVGs/PNGs downloaded through the URLs supplied by get_design_context. No SVG paths were extracted/redrawn and no whole-screen screenshot is used as an implementation asset. Temporary source URLs are not present in runtime code.

All exported files are local under public/images/figma. Exact original SVG root dimensions are recorded in src/content/figma-assets.json and passed unchanged by FigmaAsset. ResponsiveAsset chooses the distinct mobile exports; only decorative background wrappers scale. Provider logo geometry uses the original root size and scaled wrapper (Gemini), rather than a broad img width/height override. Background masks preserve original multi-layer positions and composite behavior.

| Asset files (all .svg unless stated) | Figma slot / node | Component callsite and geometry |
| --- | --- | --- |
| logo5, logo-mobile | `1276:119`, `1302:6444` | Header; 165.549×40.069 desktop, 133.636×32.3448 mobile |
| menu11 | `1302:6445` | Header; original 24×24 inside 44px target |
| huge-icon-arrows-outline-direction-down2 | `1276:126`, `1276:129` | Header dropdown summaries; 20×20 |
| square-unlock02, arrow-right02 | `1276:137`, header CTA | Header; original 20px lock/18px arrow |
| anausment.png, arrow-right3, huge-icon-interface-outline-remove | `1276:269`, `1276:275`, `1276:278` | Announcement; full-width background, 18px arrow, 28px dismissal icon |
| background.png | `1276:111` background image | HeroBackground; raster dot texture at 10.88%/59.39% desktop; mobile crop derived from mobile background context |
| group, group1, group2 | `1276:113` opposing wing component mask layers | HeroBackground; left mask sources at original 500×900, 1151.73×753.75, 1428×900 sizes |
| group3, group4, group5 | `1276:113` left wing component visible artwork | HeroBackground; original 1146×750, 87.9264×238.604, 1428×900 geometry; masks position/crop the artwork |
| group6, group7 | `1276:115` right wing masks | HeroBackground; original mask dimensions; group reused for common clip |
| group8, group9, group10 | `1276:115` right wing artwork | HeroBackground; original dimensions, right-side placements and mirrored detail wrapper |
| bg | `1276:117` glow | HeroBackground; original 2064.34×1388.34 export, offset within clipped background |
| ai-browser, ai-image-edit, ai-programming, ai-voice, ai-video | `1276:154`, `160`, `167`, `174`, `182` | Hero mode links; original 28px icons inside 52px discs |
| mobile-ai-browser, mobile-ai-image-edit, mobile-ai-programming, mobile-ai-voice, mobile-ai-video | `1302:6674`, `6680`, `6687`, `6694`, `6702` | ResponsiveAsset; original 24px mobile icons inside 52px discs |
| vector, mobile-vector | `1276:158`, `1302:6678` | Hero; original 32×18 active-mode pointer |
| robotic, arrow-down01, line9 | `1276:190`, `201`, `200` | Hero assistant link; 24px robot, 20px arrow, original 12×1 divider rotated by wrapper |
| mobile-robotic, mobile-arrow-down01, mobile-line9 | `1302:6710`, `6721`, `6720` | Same mobile slots using mobile exports |
| add-money-circle, mobile-add-money-circle | `1276:204`, `1302:6724` | Hero credit example; original 24px icon |
| wand-sparkles, mobile-wand-sparkles | `1276:212`, `1302:6732` | Hero prompt enhancement signup link; desktop/mobile original exports |
| plus, mobile-plus | `1276:219`, `1302:6739` | Hero attachment signup link, 46px desktop / 40px mobile control |
| line10, mobile-line10 | `1276:221`, `241`, `1302:6741`, `6755` | Hero toolbar/model-picker dividers, original dimensions with rotated wrapper |
| chat-gpt, logo, claude, logo1 | `1276:233`, `235`, `237`, `239` | Hero model group; OpenAI/Gemini/Claude/Copilot in overlapping 36px discs |
| mobile-chat-gpt, mobile-telescope01 | `1302:6753`, `6744` | Hero mobile model group (32px disc) / research signup control |
| arrow-down2, mobile-arrow-down2 | `1276:242`, `1302:6756` | Hero model-picker arrow |
| filter-horizontal | `1276:245` | Hero desktop settings signup control |
| mic01, mobile-mic01 | `1276:259`, `1302:6762` | Hero voice signup link |
| ai-sparkles, mobile-ai-sparkles | `1276:265`, `1302:6777` | Hero Generate button; original 20px exports |

Fonts: original Inter Display Regular/Medium from the existing application, copied read-only and losslessly compressed with wawoff2 to WOFF2 (134088/138852 bytes). Original copied TTFs are retained only in ignored .work/font-sources, not shipped in public or tracked in the final tree. Fontsource Faculty Glyphic Latin 400 is bundled locally with a locked package version; both font licenses are included under public/fonts. No Google Fonts network dependency.

Existing application OpenGraphbanner.png and icon.svg were copied read-only as public/OpenGraphbanner.png and public/favicon.svg, preserving brand/share metadata.

Validation: all local images loaded without broken/empty files or failing asset responses across seven Chromium widths. Desktop 1440 and mobile 430 screenshots were inspected against Figma; 320/768/1024 captures support responsive review. CSS mask sources were requested successfully. Original root dimensions are preserved; effective logo/icon scaling and content slots were visually inspected. This is a close implementation, not a pixel-perfect certification: interactive placeholder text replaces the drawn cursor, mobile under 390px is derived, and original desktop wing layers are scaled for mobile. No original asset is replaced with an invented drawing.

## Milestone 4 assets

Customer source: desktop 1276:1266 and mobile 1320:11309. Nine customer-*.svg desktop exports map to FedEx, Nexthink, Xplor Pay, Verifone, Lightspeed, Ericsson, Amazon, Carta (legacy filename customer-cmt) and Cisco. customer-mobile-0 through customer-mobile-16 preserve Figma's distinct mobile exports and row order; their exact dimensions are in figma-assets.json. CustomerLogos uses shared ResponsiveAsset, with decorative repeated rows and a unique accessible name list. No logo artwork was redrawn.

Feature source: 1284:667, panels 1284:672 / 727 / 778 / 1007 / 1057. Original SVG files have a feature- prefix in public/images/figma; dimensions remain in figma-assets.json. FeaturePanel references heading and benefit icons from typed content. The first CTA uses feature-arrow-right02; remaining CTAs use feature-arrow-right3. Original dot pattern is reused as a cropped background on every panel.

| Artwork | Original node/asset | Rendering |
| --- | --- | --- |
| Shared flower/photo backdrop | 1284:723 / 774 / 827 / 1053 / 1103; feature-image1.png | src/assets/features; responsive Astro Image at 520×472, original feature-image.svg mask |
| Multi-model visual | 1284:726; feature-product.png | 472×424 at 22/22 within artwork; contain |
| Balance illustration | 1284:777; feature-product1.png | 472×424 at 22/22; white 85% backing |
| Comparison network | 1284:834 subtree | Original exported SVG layers, positioned from Figma absolute bounding/render boxes; local comparison-art.json records each source node, asset and slot. Outer 472×424 clipping preserved. Six scale tracks follow current motion context |
| Privacy illustration | 1284:1056; feature-product2.png | 472×424 at 22/22; white 85% backing |
| File illustration | 1284:1106; feature-product3.png | Original 128.93% width/107.65% height/-14.47% left crop and 98% opacity |

Only optimized WebP derivatives are emitted for the original large raster files; originals remain under src/assets. FigmaAsset retains SVG root dimensions; wrapper transforms preserve their effective positions/sizes. Art-stage transforms apply only to decorative geometry, not panel text or layout. Browser checks decode every panel image at all representative widths and check no failing requests or aspect-ratio distortion. Original source/export SVGs and geometric masks are retained alongside the manifest; unused mask exports are not used as invented visual elements.

## Milestone 6 assets

Milestone 6 adds seven original pricing SVGs from `1286:1669`: `pricing-stars` (20px token strip), `pricing-chatgpt`/`pricing-claude`/`pricing-claude1` (16.6667px model icons), `pricing-arrowup01` (18px disclosure, flipped closed), `pricing-icon` (9px check inside a 16px circle), and `pricing-container` (16px unavailable indicator). Metadata is in figma-assets.json; Pricing templates preserve SVG root dimensions. Existing original Gemini artwork is reused through a wrapper transform. Model names, providers, prices, allowances and feature flags come from public APIs rather than Figma placeholders. Header/plan controls and responsive adaptations are derived from the existing application behavior.

## Milestone 5 assets

Source sections: latest models `1286:1108`, comparison `1286:1259`. Twenty-six original exports total 37,138 bytes. Temporary Figma download URLs are absent from runtime source. All SVGs retain original root dimensions, with fixed illustration coordinates confined to the responsive comparison stage. Text remains native HTML and typed editorial content.

| Files / slots | Original Figma nodes | Effective geometry and callsite |
| --- | --- | --- |
| model-arrow-down-left01.svg | card arrow `1286:1119` and repeated instances | LatestModels, 24×24 with a 180° wrapper rotation |
| model-thesvg-color-openai-chatgpt.svg, model-devicon-claude.svg, model-logos-grok-icon.svg | `1286:1122`, `1286:1166`, `1286:1179` | LatestModels, original 32×32 / 32×32 / 33.09×33.09 |
| model-gemini.png | `1286:1135` | Original composited icon export, 32×32; preserves all masked gradient layers |
| subscription-bg.svg | `1286:1265` | Original 1200×496 background, CSS background on comparison canvas; cover crop on derived mobile layout |
| subscription-vector{6,7,8,9,10,11,12,13,14}.svg and subscription-line{70,71,74,75}.svg | `1286:1270–1275`, `1286:1305–1311` | Thirteen original connector slots, stroke offsets and flips recorded in subscription-art.ts; responsive desktop stage scales uniformly; connectors hidden in derived stacked layout |
| subscription-icon{,1,2,3}.svg | `1286:1278`, `1286:1288`, `1286:1297`, `1286:1364` | Grok, DeepSeek, ChatGPT, Claude; original 31.9922px icons inside 32px slots |
| subscription-kimi.png, subscription-gemini.png | `1286:1314`, `1286:1329` | Original 32×32 composited exports retain internal masks |
| subscription-alveta.png | `1286:1372` | Original 74×74 composited logo/gradient export; 48px mobile wrapper transform |

Only individual icon composites were exported as PNG, never a section screenshot. The Figma screenshot remains the visual reference, not a shipped asset. Small originals are retained losslessly; no large raster was added. Webfont files and embedding licenses for the Bangla price fonts (Li Mehdi Ekushey Unicode and November Bangla Traditional) and Google Sans Flex were not provided; system Bangla/Inter Display fallbacks are used, with smaller central price typography to prevent overflow. Savings red is darkened from Figma #f04438 to #c02c22 for readable contrast on #feeceb. These are documented fidelity differences.

## Milestone 7 — Testimonials

Source `1286:2123`; all eleven supplied assets are local in `public/images/testimonials`, used by `Testimonials.astro`. Original SVG root dimensions are unchanged. Raster exports use lossless WebP; large portraits are resized to twice their desktop crop dimensions, and the background texture to its 1101px display size. Total assets: 1,624,594 bytes. No section screenshot or temporary asset URL is shipped.

| Files | Source nodes | Rendered slot |
| --- | --- | --- |
| dots.webp | 1286:2124 | Decorative background, original 162.45% width / 88.66% height crop and offsets |
| ellipse-mask.svg, ellipse.svg, texture.webp | 1286:2125–2128 | 1101px circular masked layers at x217/y335 relative to the 1440px section; clipped to section |
| card-mask.svg | 1286:2139 and repeated cards | 282×400 rounded card mask, responsive proportional scaling |
| hasin.webp | 1286:2148 | First portrait, original nested 271×381 crop and luminosity blend |
| sumit.webp | 1286:2166 | Second portrait, original 282×420 placement at y−20 |
| atiqur.webp | 1286:2184 | Third portrait, 348px square at x−33/y52, under quote blur |
| avatar.webp, avatar-mask.svg | 1286:2193 | 44px circular quote attribution avatar |
| sumon.webp | 1286:2210 | Fourth portrait, 453px square at x−86/y52 |

Names, roles and the one supplied quote remain native text in typed editorial content, explicitly marked as unverified design examples. No extra quotes, video actions or unknown View all destination are invented. Mobile uses derived 2/1-column layouts; cards retain desktop proportions and readable type.

## Remaining landing sections — FAQ, articles, closing CTA and footer

Nodes `1286:2216`, `1286:2259`, `1286:2560`, `1298:1230`. Eighteen originals in `public/images/ending` total 496,507 bytes. SVG roots are retained; article PNGs are converted to lossless WebP at 700px width (twice desktop slots). Temporary asset URLs and section screenshots are not shipped.

| Assets | Figma slots | Callsite / geometry |
| --- | --- | --- |
| faq-arrowdown01.svg | 1286:2224 and repeated instances | Faq, 24px arrow; flips on native details open |
| articles-image{1,2,3}.webp, articles-image.svg | 1286:2268–2269, 2280–2281, 2292–2293 | Articles, 350×192 masked luminosity slots; third retains 136.72% image height/top crop |
| articles-ellipse13.svg, articles-line76.svg | 1286:2273, 2275 and repeats | Articles, original 4px metadata dot and 350×1 separator |
| cta-artwork.svg | 1286:3035 | Original vector-only illustration group exported through Plugin API as SVG; 477.59×263.70 design bounds at x779/y46 inside CTA. Includes original connectors, provider pills and Alveta diamond; no page screenshot or marketing heading/buttons. Read in bounded chunks due MCP output limit; not a Figma mutation. ClosingCta scales the intact SVG uniformly on smaller screens. |
| footer-logo6.svg | I1286:3196;60:61 | Footer, original 174×42 logo |
| footer-icon{,1,2,3,4}.svg | 1286:3200, 3203, 3206, 3209, 3212 | Footer, original 28px social icons; inactive until profile destinations are supplied |
| footer-mail.svg | 1286:3248 | Footer, original 20px newsletter icon |
| footer-logo5.svg | 1286:3164 | Footer, original 1204×248 watermark; wrapper uniformly scales on mobile |
| footer-vector18.svg | 1286:3169 | Footer, original 1752×1760 glow, clipped to footer; original export overflow offset retained |
| footer-logo11.svg | 1286:3175 | Footer, original 129×24 SubscriptionPro attribution |

FAQ/article/CTA/footer marketing copy remains native HTML in `landing-end.ts`. Provider words within the original decorative CTA illustration are outlined vector artwork. Source typos in CTA button labels are corrected. Unpublished article cards have no guessed destinations; newsletter is disabled with an honest coming-soon notice. FAQ repeats are preserved and explicitly flagged for review. Mobile layouts are derived from desktop; new notices add height relative to the design.
