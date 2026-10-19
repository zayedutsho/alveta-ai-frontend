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
