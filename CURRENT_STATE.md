# Current State
**Updated:** 2026-06-16 11:36

## ✅ SESSION 45 (2026-06-16) — Global review punch list: dev-tool exposure fix, decade-page Stitch migration (READY TO DEPLOY)
- **Global review across security, deploy hygiene, content integrity, performance, backlog health, and visual coherence** (full findings not duplicated here — see the punch list delivered in-session). Two real findings, both closed:
- **Security fix — internal dev tools were live on jfsn.com.** `curate.html`, `dedupe.html`, `qa.html` (local-curation tools, `noindex` but not access-blocked) and `curate-session.json` (internal theme-grouping notes) were all HTTP 200 on the public site — `deploy.sh`/`deploy-netlify.sh` never excluded them. Their POST targets (`/save-session`, `/rename-works`) only exist on the local `server.py` dev server so nothing was exploitable, but they had no business being public. Added all four to both deploy scripts' exclude lists; removed the live copies from HostGator via lftp; verified all four now 404.
- **Backlog correction — sessions 36–44 were already live, IMPROVEMENTS.md said otherwise.** Verified directly against jfsn.com: live `sw.js` CACHE_V matched local exactly, live `index.html` carried `display=optional`, live `wall.html` had the 64px mobile tap-target CSS, live `guernica.html` carried the `#8e7164` border, the 3 recompressed hero AVIFs served at their smaller live sizes, and the `sw.js` offline-fallback page was present live. Updated IMPROVEMENTS.md to stop tracking these as pending.
- **Decade pages (1970s–2020s) migrated to the Stitch June-2026 nav/footer.** This was the biggest visual-coherence gap found: decade pages were the only public pages still on the old bespoke nav/footer, visibly a different show from the rest of the site (no orange eyebrow, no warm-brown border, plain inline "Browse with filters" link, no reading-progress bar, no Stories/Lost nav links, no ⌘K). Fix, applied identically to all 6 pages via a one-off script (written, run, deleted):
  - Header/footer swapped for the literal canonical `_shared/top-nav.html` / `_shared/footer.html` includes (same NAV:START/FOOTER:END markers as every other page) — gains Stories/Lost nav links, ⌘K search badge, glassmorphism header, mono footer signature, back-to-top. The old bespoke decade-only mobile drawer (with a by-decade jump list) was retired in favor of the canonical drawer; decade-to-decade navigation still works via the existing prev/next strip and `archive.html?decade=` filtering.
  - Prev/next decade strip + hero section borders → warm-brown `#8e7164` (inline style, matching the precedent set by the theme-page pass — these colors aren't in `tailwind.config.js`, so no rebuild needed anywhere in this session).
  - Hero eyebrow ("307 WORKS · 2010–2017") → orange mono, matching every other Stitch page's eyebrow treatment.
  - "Browse with filters →" promoted from an inline paragraph link to the `[ Browse with filters → ]` bracket-CTA used on collage/sculpture/photography/painting.
  - Reading progress bar added (2px orange fixed line, same pattern as guernica.html etc).
  - `main` top offset `pt-[72px]` → `pt-[100px]` to match the canonical header's spacing convention (class already compiled, no CSS rebuild).
  - Added all 6 decade pages to `stamp-nav.sh`'s TARGETS array — future nav/footer edits now propagate here automatically; ran `bash stamp-nav.sh` after the migration and confirmed all 6 report "unchanged" (manual stamp matched the canonical source exactly).
  - **Did NOT touch:** the artwork grid/thumbnail markup (masonry layout, `.thumb-frame` divs, full-color-always treatment) on any of the 6 pages — that's a much larger, separate effort and was out of scope for "header/footer/border/CTA parity."
- **No new Tailwind utilities** — `pt-[100px]` and all other classes used were already compiled (present on archive.html). No CSS rebuild needed.
- **CACHE_V bumped** to `jfsn-20260616153300` in sw.js.
- Preview-verified all 6 pages at desktop + mobile: nav, footer, mobile drawer (opens/closes correctly), eyebrow, borders, bracket CTA, progress bar all render correctly; edge cases (1970s has no "prev" link, 2020s has no "next" link) don't break layout; zero console errors. `audit-nav.sh` and `verify_deploy.py` both clean after the dev-tool removal.
- **🟡 NEEDS DEPLOY:** run `bash end-session.sh` then deploy via **JFSN.app** (HostGator) — this ships the decade-page migration + the corrected `deploy.sh` exclude list together. The dev-tool files (`curate.html`/`dedupe.html`/`qa.html`/`curate-session.json`) were already removed live directly via lftp this session, independent of the next full deploy.

## ✅ SESSION 44 CONTINUED AGAIN (2026-06-16) — wall.html mobile tap-targets + responsive images (READY TO DEPLOY)
- **Diagnosed wall.html's mobile UX**, asked at Jeff's request: measured the live DOM at 375px width and confirmed `.wall-tile` rendered at **40.7×40.7px** with ~1px gaps — well under the 44px tap-target guideline, on a page that's 1,084 adjacent tappable squares with no labels. Also confirmed zero `srcset`/`sizes` anywhere — every tile downloaded the same 200×200 AVIF regardless of display size.
- **Fix 1 — tap targets:** raised the `<600px` `.wall-grid` `minmax()` floor from 40px → **64px** (`wall.html` line ~74); added `gap: 2px` under `@media(hover:none)` for touch devices specifically (desktop mouse precision keeps the tight 1px gap). Verified live: tiles now render at **74×74px** on a 375px viewport — well clear of the guideline.
- **Fix 2 — responsive images:** added a new **`micro` image tier** (80px wide, `Q_MICRO=62`) to the asset pipeline:
  - `artworks/ingest.py` — added `MICRO_W=80`/`Q_MICRO=62` constants + a `micro` output step in `process()`, so all future ingested works get a micro AVIF automatically alongside full/medium/thumb/mini.
  - **Backfilled all 1,084 existing works** — generated `artworks/micro/artNNNN.avif` for every work by downscaling from the existing `mini` source (visually identical at this size, much faster than re-deriving from full-res). Avg file size: **2.7 KB** (vs mini's 11 KB) — **~8.8 MB saved off the full wall.html page weight** for any visitor whose resolved tile size actually qualifies for the micro tier (see DPR caveat below).
  - Added `srcset="artworks/micro/artNNNN.avif 80w, artworks/mini/artNNNN.avif 200w" sizes="(max-width:600px) 64px, 56px"` to all 1,084 `<img>` tags in `wall.html` via a scripted regex pass (verified 1,084/1,084 replaced, markup spot-checked).
  - **Honest caveat found during verification:** the `sizes` value reflects the actual CSS tile size at each breakpoint (64px mobile / 56px desktop), which is correct — but on a real retina phone (DPR 2–3, e.g. Jeff's iPhone 15 Pro), the *effective* pixel need at a 64px CSS tile is 128–192px, which still exceeds the 80px micro tier, so the browser correctly keeps choosing `mini` there — **no quality loss, but also no byte savings on Jeff's actual test device.** The micro tier genuinely helps standard-DPI (DPR 1) displays and any tile that renders ≤80px CSS-wide. This is a correct, zero-risk addition (strictly non-regressive — same `mini` fallback as before wherever `micro` doesn't qualify) but the practical savings are smaller than the file-size math alone suggests for premium phones.
- **No new Tailwind utilities** — no CSS rebuild needed.
- **CACHE_V bumped** to `jfsn-20260616143000` in sw.js.
- Preview-verified at 375px (mobile) and 1280px (desktop): tile sizes correct, srcset/sizes present and spec-correct on every tile, zero console errors.
- **🟡 NEEDS DEPLOY:** the new `artworks/micro/` directory (1,084 new files, ~5 MB total) must be uploaded to HostGator alongside the HTML changes — not just the usual JFSN.app mirror, confirm it includes the new directory.

## ✅ SESSION 44 CONTINUED (2026-06-16) — Desktop CLS root cause found + fixed sitewide (READY TO DEPLOY)
- **Root cause confirmed for the session-36 "desktop CLS 0.16, highly variable" mystery.** Measured the live homepage DOM with both fonts: hero `<h1>` ("Jeffrey F. S. Neumann — Personal Archive") renders at **153px tall / 745px wide with Playfair Display loaded**, but **230px tall / 578px wide with the fallback** (`font-family:'Playfair Display',serif` — generic `serif` is much narrower per character than Playfair Display). Combined with the `max-width:16ch` constraint, the narrower fallback wraps to a 3rd line, making the box **77px taller** until the real font swaps in — a textbook CLS-causing element, and it only registers when the network is slow enough that layout has already painted once before the swap. Matches Jeff's bouncing Lighthouse numbers exactly (0/0.05/0.147/0.16 — throttle/timing-dependent).
- **Fix:** changed the Google Fonts link's `&display=swap` → `&display=optional` **sitewide** (1,122 files: all hand-written pages + `gen-artwork-pages.py` template + all 1,084 generated artwork pages, via a scoped find/replace on the exact `&display=swap"` string — verified it appears nowhere else in the codebase). `optional` means: use the cached font if available; otherwise give it ~100ms and if it's not ready, **keep the fallback for the whole pageview — no swap, no shift.** Returning visitors (font cached) always see Playfair Display; only a cold-cache slow-network visitor sees the fallback typeface, but with zero layout shift.
- Verified live in preview: the served HTML now carries `display=optional` (had to clear the SW cache + hard-reload to see past the cached old page — expected, not a bug), zero console errors, hero renders correctly.
- **No CSS/JS rebuild needed** — single query-param change in existing `<link>` tags.
- **Ask Jeff to re-run Lighthouse desktop after this deploys** — expect CLS to drop to ~0 and stay stable across runs (no more swap-driven shift to vary on).

## ✅ SESSION 44 (2026-06-16) — Stitch pass: 8 theme pages (READY TO DEPLOY)
- **guernica.html / targets.html / framed.html / torsos-faces.html / gallery-images.html / mr-snowmann.html / crosses.html / collaboration.html** — identical surface pass on all eight:
  - Page header border (`.medium-page__head`) → warm-brown `#8e7164` (was neutral `rgba(11,11,11,0.12)`)
  - Reading progress bar — 2px orange fixed line at top of viewport, fills on scroll (same CSS+div+script pattern as collage/sculpture/photography/painting)
  - Trailing "All series & themes →" link converted from a plain inline link to a `[ All series & themes → ]` bracket CTA (`.browse-filters-link` class, orange-bordered, fills orange on hover) — promoted out of the intro paragraph onto its own line, matching the `[ Browse with filters → ]` treatment used on the 4 medium pages in session 43
  - guernica.html + collaboration.html (the two pages with custom multi-paragraph intros and extra inline links) handled individually — their other inline links (`Read the full story →`, `Read the story →`, `On making with others →`) were left as plain inline links, only the trailing series-index link was promoted to bracket style
  - Kind/badge tags ("Named Series" / "Recurring Theme" / "Imagined Placements" / etc.) and existing breadcrumbs unchanged
- **This closes the "Next Stitch pages" backlog item** — all medium/theme/series pages are now on the Stitch June-2026 surface treatment. Remaining unconverted page types: decade pages (1970s–2020s, different Material Design token system — intentionally separate) and a few utility pages (api.html, changes.html, privacy.html, 404.html — never in scope for this pass).
- **CACHE_V bumped** to `jfsn-20260616120000` in sw.js.
- **No new Tailwind utilities** — no CSS rebuild needed (only existing classes + inline styles).
- Preview-verified guernica.html + collaboration.html: border, progress bar, bracket CTA all render correctly, zero console errors.
- **🟡 NEEDS DEPLOY:** run `bash end-session.sh` then deploy via **JFSN.app** (HostGator). Sessions 36–44 ship together.
- **Next session:** oral history pass, or the accessibility/CLS backlog items.

## ✅ SESSION 43 (2026-06-15) — Stitch pass: archive, series-index, 4 medium pages, favorites (READY TO DEPLOY)
- **archive.html** — orange mono eyebrow + Playfair italic subline; page header border → `#8e7164`; archive card borders → `#8e7164` + paper-shadow (desktop, media-query override); sidebar filter section dividers → `#e3bfb1`; mobile ledger border → `#e3bfb1`; reading progress bar.
- **series-index.html** — orange eyebrow + Playfair subline + `#8e7164` header border + warm-brown left rule on intro; bracket context links `[ Why I Made Things → ]` etc.; series card borders → `#8e7164` + paper-shadow (CSS override); skeleton loading placeholders removed (animate-pulse — banned); fabricated "Archival Note" quote removed → replaced with charcoal closing strip (factual Playfair line + `[ BROWSE ALL WORKS → ]`); reading progress bar.
- **collage.html / sculpture.html / photography.html / painting.html** — identical surface pass on all four: orange mono eyebrow; Playfair italic sublines drawn from each page's own intro text ("Anything can be a mark." / "Extended into space." / "Five decades of looking." / "Present since the beginning."); page header border → `#8e7164`; `[ Browse with filters → ]` bracket CTA replacing old full-width button; fixed filter URL param `?type=` → `?medium=` to match archive.html; reading progress bar on all four.
- **favorites.html** — orange mono eyebrow; h1 promoted from muted `text-archive-gray` → `text-deep-ink`; Playfair italic subline; page header border → `#8e7164`; `fav-whisper` upgraded from near-invisible `#c4c7c7` → warm-brown mono `#8e7164`, text now dynamically populated as `45 Works · Marked by Jeff`; reading progress bar.
- **CACHE_V bumped** to `jfsn-20260615235900` in sw.js.
- **No new Tailwind utilities** — no CSS rebuild needed.
- **🟡 NEEDS DEPLOY:** run `bash end-session.sh` then deploy via **JFSN.app** (HostGator). Sessions 36–43 ship together.
- **Next session:** 8 theme pages Stitch pass (guernica, targets, framed, torsos-faces, gallery-images, mr-snowmann, crosses, collaboration) — or oral history pass.

## ✅ SESSION 42 (2026-06-15) — artwork.html Stitch port (READY TO DEPLOY)
- **artwork.html fully ported to Stitch June-2026 design language.** Surface pass — all JS, lightbox, mini-river, keyboard nav, swipe, and prev/next behaviour unchanged.
  - **Reading progress bar** — 2px orange fixed line at top of viewport, matching about/stories/lost/why-i-made-things
  - **`[ ← Back to Archive ]`** bracket link (was plain arrow + text link)
  - **Image card** — warm-brown archival border `#8e7164` + paper-shadow `0 0 20px rgba(0,0,0,0.05)` replacing `border-deep-ink`; bottom bar border → soft `#e3bfb1`
  - **`[ Full resolution → ]`** bracket format button (was uppercase label)
  - **Orange mono eyebrow** `ART0392 — 2010S (EST.)` in monospace orange above the h1 title, populated by JS from archive ID + year_display
  - **Playfair italic subline** showing medium type (e.g. "Collage") below the title — populated by JS
  - **Aside title divider** → warm-brown `#e3bfb1` (was `border-deep-ink`)
  - **Meta rows** dividers → warm-brown `#e3bfb1` (was `border-deep-ink` / solid black)
  - **Archive No. row** value → mono warm-brown `#8e7164` font (matches Stitch monospace ID style)
  - **`[ Copy link → ]`** bracket format button
  - **`[ ← → Browse Works ]`** keyboard hint in monospace
  - **Prev/Next bar** — top/bottom borders → warm-brown `#8e7164` (was `border-deep-ink`); scroll-reveal fade-in on enter
  - **`.artwork-developing`** keyframe defined inline (was referenced in JS but not defined; now provides a saturation develop animation on image load)
- **No new Tailwind utilities** — no CSS rebuild needed.
- **🟡 NEEDS DEPLOY:** run `bash end-session.sh` then deploy via **JFSN.app** (HostGator). Sessions 36–42 ship together.
- **Next session:** archive.html Stitch port, or oral history pass.

## ✅ SESSION 41 (2026-06-15) — Cross-page consistency + lost.html Stitch pass (READY TO DEPLOY)
- **Active-section tracking** added to mobile jump navs on start-here.html + about.html: IntersectionObserver watches each section, highlights the matching TOC link orange (`.toc-active`) as you scroll. Sections watched: `#sh-welcome` → `#sh-begin` (start-here); `#about-hero` / `#contact` / `#exhibition-record` / `#in-his-words` (about).
- **Reading progress bar** added to why-i-made-things.html — 2px orange fixed line at top of viewport, fills on scroll (CSS + div + JS, matching stories.html / about.html / start-here.html).
- **lost.html Stitch surface pass:**
  - Orange eyebrow "WHAT IS NOT HERE" (was archive-gray)
  - Image card → warm-brown border `#8e7164` + paper-shadow
  - Second section divider → soft `#e3bfb1` (was cool neutral)
  - Sidebar CTAs → bracket-link format `[ VIEW THE ARCHIVE → ]` etc. (was deep-ink underline)
  - Reading progress bar added
- **B2 nightly LaunchAgent** created: `~/Library/LaunchAgents/com.jfsn.cloud-backup.plist` fires `cloud-backup.sh` at 9 PM daily; loaded + registered (`launchctl list` verified). Logs to `~/Library/Logs/jfsn-cloud-backup.log`. B2 is now automated on the same schedule as the 4TB rsync.
- **CACHE_V bumped** to `jfsn-20260615230000` in sw.js.
- **No new Tailwind utilities** — no CSS rebuild needed.
- **end-session.sh already auto-updates CURRENT_STATE.md date** (lines 17–22) — the `sed` was already in place; no change needed.
- **🟡 NEEDS DEPLOY:** run `bash end-session.sh` then deploy via **JFSN.app** (HostGator). Sessions 36–41 ship together.
- **Next session:** artwork.html Stitch port or oral history pass.

## ✅ SESSION 40 (2026-06-15) — about.html Stitch port (READY TO DEPLOY)
- **about.html fully ported to Stitch June-2026 design language.** Surface pass — content, bio text, exhibition record, and In Jeff's Own Words links unchanged.
  - **Orange section label** ("THE ARCHIVE — CLEVELAND, OHIO") + Playfair italic subline ("Five decades of making.") above the bio h1
  - **Portrait card** — warm-brown archival border `#8e7164` + soft paper-shadow `0 0 20px rgba(0,0,0,0.05)`; "HOVER TO REVEAL" mono label below-left in `#8e7164`
  - **`[ Browse all 1,084 works → ]`** bracket CTA below the bio
  - **3-col strip** — warm-brown `#e3bfb1` top divider; mono data lines (`CONTACT` / `1,084 WORKS · 1974–PRESENT` / `CLEVELAND, OHIO`) above each column label; Archive column CTA → `[ Browse all works → ]` bracket style
  - **Lost Works bar** — border upgraded from `border-deep-ink` (black) to warm-brown `#8e7164`
  - **Exhibition Record** — heading gets Playfair italic subline ("A public record, verified by Jeff."); top rule → warm-brown `#8e7164`
  - **NEW charcoal quote section** — Jeff's verbatim "Something that still had a life left in it." in large Playfair italic on `#0B0B0B` ground; `[ WHY I MADE THINGS → ]` bracket link; bleeds edge-to-edge (verified mobile + desktop)
  - **In Jeff's Own Words cards** — warm-brown `#8e7164` borders + paper-shadow + paper-lift hover (`translateY(-2px)`) + `[ READ → ]` bracket links
  - **Scroll-reveal** on 3-col strip, Exhibition Record, quote section, In Jeff's Own Words (IntersectionObserver, `prefers-reduced-motion` respected)
- **No new Tailwind utilities** — no CSS rebuild needed.
- **🟡 NEEDS DEPLOY:** run `bash end-session.sh` then deploy via **JFSN.app** (HostGator). Sessions 36–40 all ship together.
- **Next session:** start-here.html or artwork.html Stitch port.

## ✅ SESSION 39 (2026-06-15) — stories.html Stitch port (READY TO DEPLOY)
- **stories.html fully ported to Stitch design language.** Targeted surface pass — content, layout, and two-column structure unchanged.
  - **Orange "ORAL HISTORY" eyebrow** above h1; page header border → warm-brown `#8e7164`
  - **Story section dividers** → `#e3bfb1` warm-brown (was cool gray `#c4c7c7`)
  - **"About These Stories" sidebar card** → `#8e7164` border + paper-shadow `0 0 20px rgba(0,0,0,0.05)` + hover lift
  - **Key Quotes sidebar** → warm-brown `#e3bfb1` left rule on each quote
  - **All `→` links** → `[ bracket → ]` format (Related sidebar + inline content links)
  - **Placeholder boxes** → solid `#e3bfb1` border (was dashed gray)
  - **Section labels** (dateline/location) → `#8e7164` warm-brown (reads as archival metadata, not text)
  - **Scroll-reveal** on story articles 2–10 (IntersectionObserver, `prefers-reduced-motion` respected; first story above fold is static)
  - **Reading progress bar** — 2px orange line at top of viewport, fills on scroll
  - **Blockquote breathing room** — `margin: 2em 0` (was `1.5em`)
  - **art1056 hover thumbnail** — `[ View art1056 → ]` shows mini image on hover
  - **"Stories Not Yet Documented" added to both TOCs** (desktop sidebar + mobile jump nav) — was missing
- **No new Tailwind utilities** — no CSS rebuild needed.
- **🟡 NEEDS DEPLOY:** run `bash end-session.sh` then deploy via **JFSN.app** (HostGator). Sessions 36–39 all ship together.
- **Next session:** about.html Stitch port (same approach as stories.html).

## ⚠️ SESSION 38 CONTINUED (2026-06-15) — Stitch detail pass + nav refinement (NEEDS DEPLOY)
- **Homepage Stitch detail pass** — four targeted changes to close the gap between the live homepage and the Stitch reference design:
  - **Hero subhead font:** Inter → **Playfair Display italic** (`index.html` line 774). Mobile hero already had Playfair italic for "Personal Archive" span — now consistent across both viewports.
  - **Lost section image:** opacity `0.28 → 0.45` + `filter:blur(1.5px)` at rest; clears to `opacity:0.75 blur(0)` on hover. The art0585 fragment is now visibly atmospheric against the charcoal bg. (`index.html` `.lost-fragment img` CSS).
  - **Nav wordmark:** Playfair Display `text-headline-md tracking-tighter` → **Inter 18px weight 700 letter-spacing -0.03em**. Matches Stitch's compact logo treatment. (`_shared/top-nav.html` line 32).
  - **Nav links:** removed `uppercase font-label-caps text-label-caps` → **title-case Inter 14px weight 500**. Matches Stitch exactly (Archive / About / Stories / Lost). (`_shared/top-nav.html` lines 34-37 + `stamp-nav.sh` run → 31 pages).
- **Items already done (verified this continuation, NOT changed):** Wall tooltip already 2× (144px via `.tip-wall`); hero bottom gradient already present; Selected Works already `object-cover`; art1010 already LCP anchor + preloaded.
- **Stitch MCP added** to Claude config (`claude mcp add stitch https://stitch.googleapis.com/mcp --transport http`). Active in the NEXT session — requires a new Claude Code session to load.
- **CACHE_V bumped** to `jfsn-20260615180000` in `sw.js`.
- **🟡 NEEDS DEPLOY:** run `bash end-session.sh` then deploy via **JFSN.app** (HostGator). No CSS rebuild needed (inline styles only, no new Tailwind utilities).
- **Not yet done:** paper-texture decision (Jeff to approve/delete); Archive/Series/Stories/artwork-detail redesign (next session).

## ⚠️ SESSION 38 (2026-06-14→15) — Stitch June-2026 HOMEPAGE adoption (DEPLOYED + live-verified)
- **Big visual session: `index.html` rebuilt to the Google Stitch June-2026 design, and DEPLOYED to jfsn.com.** Jeff accepted the Stitch direction; decision = **ship homepage-first** (redesign Archive/Series/Stories/artwork-detail in later sessions). Preview-verified then **deployed via `deploy.sh` (full lftp mirror) + live-verified**: masthead h1, bento, section eyebrows, footer mono signature all live; live `sw.js` CACHE_V `jfsn-20260614220000`. Commits `149375f1` (build) + `3029e4c6` (deploy fix). All 4 stores synced.
- **What changed on the homepage** (surface pass — the page was already Stitch-structured):
  - **Editorial masthead hero** — static cover (`art0392`), centered Playfair "Jeffrey F. S. Neumann — Personal Archive", filled-orange "Explore the river" button + "[ Browse all 1,084 → ]" bracket, bottom-corner cover-credit + mono "1,084 works · 1974–present · Cleveland". **Rotation retired (`MAX_SLIDES=1`); the LCP cover stays the preloaded static `art0392`; the chromatic-river "you are here" marker still fires via `activate(0)`.** Hero now has a real `<h1>` (didn't before). Don't re-add a transform animation to slide 0.
  - **Where To Begin → bento** (Start Here feature tile + charcoal Stories card + wide Full Archive); **Selected Works** mono captions + `[ View → ]` + orange frame-bloom; **Lost** charcoal "The Void in the Record" + truthful prose + outlined button + ghost tiles (NO grayscale image — rejected); **section headers** upgraded to orange eyebrow + Playfair headline (About/Where-To-Begin/Selected/Wall); **bracket CTAs** across the page; **paper-texture prototype** (`#paper-texture-proto`, subtle 0.04 grain on the bone ground, never over artwork — Jeff to approve/tune/propagate).
  - **⌘K command palette already existed in `search.js`** — my earlier "it does nothing" was WRONG; it works (⌘K / `/` / search icon, lazy-loads catalog-lite.json). Added **mono catalog IDs** to results.
- **Footer reconciled to ONE source (Jeff: "do A").** Homepage no longer has a bespoke inline footer — it now uses `_shared/footer.html` via `<!-- FOOTER:START/END -->` (stamped by `stamp-nav.sh`). Promoted the **mono signature** into the canonical footer → now on all 31 pages. Removed the homepage's **duplicate** goatcounter + SW-register (shared footer bundles them; verified 1 each). Homepage gained the ABOUT column, dynamic `#footer-year`, and floating back-to-top it lacked. **`stamp-nav.sh` ran (31 files) — every page's footer changed (mono signature added sitewide).**
- **Design rules updated** to record the adoption: `CLAUDE.md` Visual rules (soft paper-shadow now allowed, warm-brown archival borders, mono IDs, ⌘K, brackets, collage-overlap) + integrity clause (NEVER fabricate provenance/verification/DPI/quotes) + STILL-BANNED line (grayscale, scale-hover, etc. — Jeff re-confirmed "keep full-color"). `design-concepts/stitch-june-2026/DESIGN.md` adoption block. Memory `project_stitch_adoption.md` (+ MEMORY.md pointer).
- **Deploy-prep DONE:** `npm run build:css` (compiled the `pl-1` bracket-nudge) + `CACHE_V` → `jfsn-20260614220000`. `audit-nav` all green.
- **✅ DEPLOYED homepage-first.** **Only `index.html` got the full redesign — the other 30 pages still have the OLD body design** (their footers got the mono signature). **Next session: redesign Archive ("The Wall") / Series Index / Stories oral-history / artwork detail ("Technical Record")** from `design-concepts/stitch-june-2026/` (extract-don't-ship + integrity carve-outs).
- **🔴 DEPLOY INCIDENT (found + FIXED this session):** the first session-38 deploy **leaked `design-concepts/`** (Stitch mockups + 7 screenshots) to the public site — `deploy.sh`'s `--exclude-glob="design-concepts/"` does NOT match nested paths (files were under `design-concepts/stitch-june-2026/`). **Removed the folder from the live server (verified 404)** + switched `deploy.sh` to the regex `--exclude="design-concepts/"` form (commit `3029e4c6`). **Lesson: `verify_deploy.py` does NOT check for leaked private dirs** — when deploying after adding a new top-level folder, curl-check it's 404 on jfsn.com. (Pre-existing, NOT addressed: `old-site/` and `*.sh` scripts are also mirrored to HostGator — long-standing, low-risk since `.ftp.env` is excluded.)
- **🔴 Security UNCHANGED / ON HOLD:** three exposed Anthropic API keys; KEY-A still in `.ftp.env:6`. Not touched this session.

## ⚠️ SESSION 37 (2026-06-14) — verification + security finding (NO site/repo content changed)
- **No site work this session.** Activity was: (1) start-of-session verification, (2) cleanup of Claude Code's permission allowlist (`~/.claude/settings.local.json`, NOT this repo), (3) a security finding (below). Nothing deployed.
- **Backups verified + brought current at start:** all four stores hold commit `0c23b24c` (GitHub ✓, Mac ✓, 4TB rsynced ✓, B2 synced ✓ — cap not hit; 4TB had been 1 commit behind via the known end-session ordering gap, now caught up). **Live drift clean:** homepage byte-matches local index.html, live `sw.js = jfsn-20260614050000`, Allison PDF 404 on both HostGator + Netlify.
- **🔴 SECURITY — ON HOLD (Jeff):** three **active** Anthropic API keys found in plaintext, all verified HTTP 200. **KEY-A `sk-ant-api03-Yfu_u…hxwQAA` is live + in use in `.ftp.env:6`.** KEY-B `…bL_4x…54cgAA` + KEY-C `…xMeKO…SvhQAA` were stale copies removed from the allowlist today (copies linger in `/tmp/settings.local.json.bak-*`). **Pending Jeff action:** revoke all 3 at console, make 1 new key, put it in `.ftp.env`. Full detail in memory `project_exposed_keys`.
- **Two perf items from session 36 are STILL OPEN + UNVERIFIED** (Jeff never pasted Lighthouse): mobile LCP (static-hero fix) + desktop CLS 0.16 (font-swap suspect). See the session-36 verify block below + SESSION_PROMPT §0.
- **Next session focus (Jeff): review the new Google Stitch concepts** at `design-concepts/stitch-june-2026/` (7 DESIGN*.md + 7 code*.html + 7 screen*.png). Read STITCH.md first; apply the suggestion filter.

## ⚠️ NEXT-SESSION VERIFY (session 36 carryover) — check these first
- **Session 36 is DEPLOYED + verified live on jfsn.com** (commit `2097325e`, doc-fix `7b1caea3`). HostGator deploy via JFSN.app (`deploy.sh` full mirror); the 3 recompressed heroes went via `lftp` (`artworks/full/*.avif` is excluded from deploy.sh). All four stores synced at close (GitHub + 4TB + Mac + **B2 current**, backup 21:10). Live-verified: homepage byte-match, static composite pages show "(est.)" + the composite note, recompressed heroes serve at the smaller sizes.
- **Deploy timing note (corrected — NOT a skip):** `deploy.sh` mirrors the FULL site INCLUDING `artworks/pages/` (it only excludes `artworks/full|thumbs|mini/*.avif`, scripts, docs). It runs `build_catalog.py` first then a large mirror, so live freshness lags a few minutes after JFSN.app launches — don't check immediately. This session I redundantly `lftp mirror`-ed `artworks/pages/` before deploy.sh finished; that was unnecessary. **Only hero AVIFs (`artworks/full/*.avif`, excluded) genuinely need a manual lftp** — the long-standing hero-upload pattern.
- **B2:** has NO recurring schedule — only the 11 PM `com.jfsn.backup` LaunchAgent, which runs `backup.sh` = **4TB rsync ONLY**. B2 rides on `end-session.sh` / manual `cloud-backup.sh` (cap resets ~8 PM EDT). Worth making B2 recurring someday.
- **Live sw.js on jfsn.com = `jfsn-20260614010023`** (deployed + verified this session; auto-bumped by build_catalog when the catalog gained provenance fields).
- **Netlify mirror is intentionally behind on the SW offline fix** (`jfsn-20260612212319`). Run `bash deploy-netlify.sh` (`--check` → draft → `--prod`) for parity if wanted; not urgent.
- **Post-deploy Lighthouse (Jeff, 2026-06-14) + two follow-up fixes:**
  - ✅ **Desktop CLS 0.147 → 0** — the river full-screen bug WAS the desktop CLS culprit (the compounding canvas height was the layout shift). Fixed by the `data-h` river fix. Desktop: perf 89, LCP 1.9s (art0392).
  - 🔴→🛠 **Mobile LCP was STILL 7.6s** after the lead+preload fix. Root cause: the hero **kb-reveal animation** (`transform: scale(1.7→1)` over **7.6s**) keeps the hero image producing a changing paint size for the whole animation, so Chrome finalizes LCP at the animation's END (7.6s — exact match). **Fix (commit `03086654`, LIVE):** slide 0 (the LCP element) no longer gets `data-kb="reveal"` → renders statically at final scale, so LCP fires at the preloaded image's load time; slides 2+ keep the Ken Burns reveal. CACHE_V `jfsn-20260614040000`. **Could NOT verify throttled LCP locally (preview is unthrottled) — Jeff must RE-RUN mobile Lighthouse to confirm the drop.** If still high, next suspects: shorten/soften kb-reveal globally, or the heavier later `-hero-m` slides.
  - Note: this is a textbook LCP anti-pattern (animating the LCP element). General rule for this site's hero: the first/eager slide must not transform-animate.
  - **Mobile LCP progression across the fixes: 7.6s → 7.2s → 5.9s.** Still red after the animation fix, because the deeper cause is that the hero `<img>` was **JS-injected** into an empty `#hero-slides-{d,m}` div — under Lighthouse's *simulated* throttling the LCP element sits at the end of a long dependency chain (HTML → render-blocking external Google Fonts → JS exec → img). **Fix (commit `d5ca52b9`, LIVE, CACHE_V `jfsn-20260614050000`):** slide 0 is now a **static `<img>` stamped into the HTML** by `build_catalog.py` (HERO_SLIDE0_{M,D} markers, from pool[0]) — preloaded, `is-active`, no animation; `init()` reuses it (skips `i===0`) and only builds slides 1..N. Also the snap-2 folio image `art0380` `eager → lazy`. Verified the slideshow still works (3 slides, no dup, cycles). **RE-RUN mobile Lighthouse — expect LCP to drop toward the desktop's ~1.5s.**
  - 🔴 **NEW desktop CLS regression: 0.16** (was 0 after the river fix; Jeff's runs bounce 0 / 0.05 / 0.147 / 0.16 — highly variable). Locally only reproduces at **0.0118** (top local shift: the river `SECTION.border-t` / `DIV.px-4` moving ~44px), so the big number is throttle/timing-dependent — most likely **web-font swap** on the large Playfair headings reflowing after paint (bigger on desktop). **NEXT: expand Lighthouse "Layout shift culprits" to get the exact node before fixing** (don't guess CLS — burned twice). Likely fix = preload/self-host the 2 fonts or `size-adjust`.

## What was done session 36 (2026-06-13 — mobile hero LCP + provenance fields; DEPLOYED + verified live)

- **Mobile hero LCP fix (warm-up).** Root cause confirmed by Jeff's Lighthouse: the first hero slide was random, so mobile LCP swung 1.3s–7.1s depending on which (heavy) slide loaded. Fixes: (1) `featured-hero.txt` now LEADS with **art0392** (Art Machine — lightest crop, 46 KB mobile / 133 KB desktop, and a real non-composite work); (2) `index.html init()` makes **slide 0 deterministic** (`[pool[0]].concat(shuffle(rest))`) so the LCP image is fixed; (3) media-aware `<link rel=preload as=image>` for slide-0's `-hero-m`/`-hero` variants, **stamped into `<head>` by `build_catalog.py`** from `featured-hero.txt` line 1 (HERO_PRELOAD markers) so it stays in sync. art0392's hero assets are already live (200) so the preload works on deploy. Preview-verified: art0392 leads both viewports, both preloads present, zero console errors. **Re-run Lighthouse AFTER deploy to confirm the mobile swing closes.**
- **Hero recompression (guarded).** Re-encoded desktop `-hero.avif` at q55/--yuv 420; KEPT only files that shrank ≥20% → **art0953 654→349 KB, art1008 624→397 KB, art1009 492→355 KB (~679 KB saved)**; originals backed up to `artworks/_hero-orig-backup/`. Spot-checked art0953 visually — no visible quality loss. The other 7 desktop heroes either grew or barely moved (content-dependent) so were left alone. The mobile `-hero-m` files are already near-optimal at their dimensions — re-quantizing only bloated them, so none were touched. **These 3 AVIFs were uploaded via `lftp` to `/artworks/` (flat) and verified live at the smaller sizes — they are NOT LCP (art0392 leads), so this was an optional page-weight win, decoupled from the LCP fix.**
- **Provenance fields (the main build).** Jeff's three decisions: (a) ALL years are estimates, display decade-bucket **"1990s (est.)"**; (b) composite set = **broadest sweep** (Gallery ∪ Studio ∪ placement-title); (c) skip `description_source`. Implemented in `build_catalog.py` (one uniform loop after the records sort): `year_precision='estimated'` + `year_display="<decade>s (est.)"` for all 1,084; `composite=True` for **250** works (`PLACEMENT_RE` + Gallery/Studio themes). Added all three to `LITE_FIELDS`. Display: `artwork.html` (dynamic) + `gen-artwork-pages.py` template both show `year_display` for the Year row + an **"Image — Photoshop composite — imagined placement"** meta row when `composite`. JSON-LD `dateCreated` kept as the numeric decade anchor (machine-parseable). **All 1,084 static pages regenerated.** api/v1 + catalog-lite now carry the fields (API honesty). Preview-verified: composite art0953 shows the note + "2000s (est.)"; non-composite art0392 shows neither. CACHE_V auto-bumped to `jfsn-20260614010023`. **Scope note:** grid/search/favorites captions still show the bare decade year (e.g. "1990") — only detail pages + API carry "(est.)". Extending to grids is an optional follow-up (would add visual noise; deferred).
- **Hotfix — chromatic river band grew to full-screen on mobile (Jeff-reported, FIXED + live, commit `da8d8c24`).** `drawRiver()` in index.html read its logical height from `canvas.getAttribute('height')` — the SAME attribute it overwrites via `canvas.height = H*dpr`. Every redraw (each `resize` event — frequent on mobile Safari as the address bar shows/hides) re-read the inflated value and multiplied by dpr again: 56→112→224→… until the band filled the screen. Fix: read the logical height from a stable **`data-h`** attribute drawRiver never mutates (`river-canvas-m` data-h="56", `-d` data-h="72"). chromatic.html was NOT affected (its 220px height is hardcoded, not read from the attribute). Verified in preview: canvas holds at 56/72px across repeated resizes. Deployed via lftp (index.html + sw.js); CACHE_V `jfsn-20260614030000`. **Preview gotcha hit while testing:** the registered service worker served a STALE cached index.html so my edit didn't show — had to `navigator.serviceWorker.getRegistrations()→unregister()` + `caches.delete()` + hard reload before the preview ran the new code. Remember this when preview-testing HTML/JS changes on this site.

## What was done session 35 (2026-06-13 — Companion fix + orientation + icons + truth pass; ALL DEPLOYED by Jeff + verified live)

- **Companion deep-mode 502 — FIXED + verified live.** Reproduced it: fast mode (Haiku) always returned 200; deep mode (`deep:true`) **timed out at Netlify's hard 30s limit every time** (Sonnet 4.6 + adaptive thinking + 5-turn agentic loop + 4000 max_tokens → `Sandbox.Timedout`). The old "Unexpected model response" label was a misdiagnosis; model IDs + thinking shape were always valid (confirmed against the claude-api reference). Fix in `netlify/functions/companion.mjs`: **deep = Sonnet 4.6 *without* extended thinking, max_tokens 1024** (deep now means "Sonnet instead of Haiku," a real quality bump that fits the budget). Deployed to Netlify via curated CLI; **verified live: deep POST → HTTP 200 in ~17.5s.** If deeper reasoning is ever wanted back, the function must move to a streaming/background architecture (30s cap can't be raised on a sync function).
- **gallery-images.html — composite-truth rewrite.** Kind label → "Imagined Placements"; meta "149 composites"; intro + meta description + OG + JSON-LD all rewritten to state these are Photoshop composites / imagined placements, NOT exhibition records (per master-notes §22/§25). Closes the IMPROVEMENTS 🟡 item.
- **Image-orientation stand-in (for "physical dimensions").** `build_catalog.py` now loads `dims.json` and writes `orientation` (vertical 424 / horizontal 573 / square 87) into catalog.json + catalog-lite.json; artwork.html + all 1,084 regenerated static pages display it (links to the archive filter); archive.html gained an ORIENTATION filter. Real inches/cm still need Jeff to measure — this is the proportions stand-in he asked for.
- **Artwork theme links** — themes metadata row now links to theme pages (slug map; `series.html?theme=` fallback), in artwork.html + the gen-artwork-pages template + 1,084 regenerated pages.
- **Decade-footer parity** — api / favorites / start-here / why-i-made-things added to all 6 decade page footers.
- **HSTS** enabled (`.htaccess` — SSL confirmed). **sw.js PRECACHE** +stories/why-i-made-things/timeline.
- **Hero keeps scaling on hover** — removed the `animation-play-state: paused` rule (Jeff asked; the Ken-Burns reveal no longer freezes on mouseover).
- **Icons (inline feather SVGs, no icon fonts):** homepage "Where To Begin" 6 cards + **Start Here orange feature** (tint + persistent bar + orange icon); start-here.html "Begin Exploring" 8 pills + Full Archive orange primary; **mobile drawer** 4 links (Archive/About/Stories/Lost) — re-stamped to all 31 pages via stamp-nav.sh. **Discovery: there is NO fixed bottom tab bar — mobile nav is a hamburger drawer** (CLAUDE.md "fixed bottom nav" line corrected).
- **Lighthouse re-run (Jeff):** desktop ~86 / mobile ~78, LCP ~2.4–5.4s — down from 18.2s. The session-33 perf pass is confirmed working; that 🔴 item is closed.
- CACHE_V `jfsn-20260613180000`; audit-nav 11/11. No CSS rebuild (reused utilities / inline). All shipped + deployed to HostGator (JFSN.app) and the Companion fix to Netlify.

## What was done session 34b (2026-06-12, evening — 9 homepage/sitewide features, ALL DEPLOYED + verified live on both hosts)

**Round 1 (homepage, deployed mid-session):**
- **River preview** — #band-tooltip carries the work's mini image (72px fixed box, no layout shift) on river + Wall band hover; text-only on touch.
- **Cross-document View Transitions** — `@view-transition` on index + artwork.html; clicked featured/wall images stamp `artwork-hero`, pairing with `#work-image`. Progressive enhancement; reduced-motion neutralized.
- **Hero→river marker** — orange notch + year chip on the river at the current hero work's chronological spot; glides on slide change (`herowork` event + `window.__heroWorkId`).
- **Today from the Archive** — date-seeded daily pick (`Math.imul(seed, 2654435761) % len` over year-sorted chromatic.json), slim strip both viewports between About and Where To Begin; hides with the other bands on data failure.
- **Mobile folio rail** — 4 fixed dots right edge, IO-synced, 44px targets, aria-current + sr-only live text; visible only while the folio is on screen.

**Round 2 (sitewide, deployed end of session):**
- **Sitewide morph** — VT rules now ship in jfsn-interactions.js's injected CSS (all 37 pages); generic capture-phase stamper marks any clicked `a[href*="artwork.html?id="], a[href*="/pages/art"]` image. **Old session-27 same-document startViewTransition block REMOVED** (never worked cross-page, delayed clicks 80ms; its inline `vt-artwork-<id>` stamp in artwork.html removed too — it overrode the CSS name). gen-artwork-pages.py template: `@view-transition` + `.vt-artwork-main` on the main img — **all 1,084 pages regenerated + deployed**.
- **Mini-river on artwork.html** — "Where this sits — fifty years" strip in the metadata aside: chromatic slices + orange notch/year chip at the current work; links to chromatic.html. `draw()` retries via rAF until the box has width (desktop layout race found in preview).
- **River touch scrub** — press-drag on homepage river shows mini+title chip above the finger, release opens the work; tap unchanged; `touch-action: pan-y` preserves scrolling.
- **Clickable decade labels** — homepage + chromatic.html link to `archive.html?decade=YYYYs` (filter verified applying), ~49px tap targets; chromatic.html also gained the mini-thumb hover preview (its #river-thumb was scaffolded but never wired) and the homepage's label collision-skip.
- sw.js CACHE_V `jfsn-20260612212319`. audit-nav 11/11. No new Tailwind utilities (no CSS rebuild). Both hosts verified: HostGator byte-identical (incl. sampled regenerated pages), Netlify redeployed via curated stage (PDF still 404).
- Committed e1fabdb4 + pushed; all four stores synced at session close (B2 cap had reset by 9:30 PM). **Correction (session 35 verify):** the 4TB rsync at 21:39 ran *before* the final commit de112913 (21:43, the IMPROVEMENTS B2-item edit), so the 4TB was one commit behind until session 35's start-of-session backup caught it up — end-session.sh runs backup.sh before its own final auto-commit, which opens this gap. GitHub + B2 + Mac were current at close.

## What was done session 34 (2026-06-12, evening)
- **Allison PDF deleted from the jfsn.com webroot** (FTP `rm`, verified 404; homepage/site healthy). deploy.sh `*.pdf`/`docs/` excludes were already in place since session 31 — no change needed.
- **Netlify mirror fixed** — discovered the site has **NO git integration** (build_settings empty, all deploys were manual CLI; that's why pushes never deployed — the pipeline wasn't broken, it never existed). Deployed a curated staging copy (rsync excludes: docs/, old-site/, *.py/*.pdf/*.md/*.sh, .ftp.env, configs — 0 sensitive files) via `netlify deploy --prod`; draft-verified first. `_redirects` 42 forced-404 rules now live. Mirror is current through session 33 (start-here/stories/favorites were 404 on the old June-5 snapshot, now 200). **Future Netlify deploys: same curated-staging method** — staging recipe in CREDENTIAL-EXPOSURE-REPORT.md §6.
- **Credential exposure report updated** — every public copy of the FTP password is now CLOSED or BLOCKED (rows 2–6 closed; row 1 is 403-blocked; row 7 git history permanent by policy). GitHub tip re-verified clean.
- **Found: Companion 502 "Unexpected model response"** — pre-existing on prod (not caused by the refresh; identical on old snapshot). Logged in IMPROVEMENTS 🔴.
- B2 still transaction-capped at session start (verified by rclone 403); cap resets midnight GMT ≈ 8 PM EDT. Last good B2 sync 12:22 today.

## What was done session 33 (2026-06-12)
- **Domain & preservation handoff finalized** — `docs/FINAL-DOMAIN-AND-PRESERVATION-HANDOFF.md` + the three DOMAIN-RECOVERY-* docs. Key facts: Jeff is the Gandi registrant of record for jfsn.com (paid to 2027-03-05, unlocked, in a friend's account); the FTP password **cannot be rotated** (no cPanel access, Pure-FTPd has no self-service change) — the "rotate in cPanel" guidance below is SUPERSEDED. Keystone action: Jeff contacts the friend (see handoff §9).
- **Full integrity audit** — internal links, image pipeline (1,084/1,084 full+mini+thumbs), sitemap, live spot-checks: clean. audit-nav 11/11.
- **FIXED: live hero 404s** — session 32's HTML had been deployed but the 6 new hero AVIFs were never uploaded; 6 of 10 hero slides 404'd on the live homepage. Uploaded flat to /artworks/ via lftp, verified all 200 via the rewrite path (2026-06-12).
- Committed + pushed + backed up the domain-recovery docs (were single-copy on the laptop).
- **Exhibition Record VERIFIED by Jeff (typed, no audio)** — all six shows happened, with corrections: CIA was a 1978 *student* exhibition (not 2022 alumni), 78th Street was 2009 (not 2019), Waterloo Arts was 2006 (not 2016), the 2008 solo was at Grumpy's Cafe (not Negative Space), 2003 was at the Cleveland Center for Contemporary Art. Most recent real show: 2012. about.html corrected, deployed via lftp, verified live. Testimony: master-notes **§27**. (2003 row confirmed same session: group show.)
- **fine-art-2000 lead closed** — Jeff confirmed all 14 works from the ~2000 site are already in the catalog (not lost). Materials testimony captured: USPS/FedEx package containers, CDs, Targets (§27).
- sw.js CACHE_V bumped to `jfsn-20260612124500` (about.html change), deployed.
- end-session.sh/backup.sh fixed: benign count mismatch no longer aborts before cloud backup; dest count now uses source-side filters.
- **Homepage image UX pass (7 items, deployed + verified live):** featured cards now `object-contain` on visible dominant-color mats (the mat was computed but invisible behind `object-cover` crops); 3 composite-titled works swapped out of featured.txt (art0029/art0028/art0953 → art0340/art0296/art0391, catalog rebuilt); mobile hero caption full-width single line (stats line removed); folio frames hug the artwork not the letterbox (flex-center + natural img size, outline moved to img); hero pause button ~44px hit area + dot tap areas via ::after, dots gap 8→14; mobile Wall title shortened to "THE WALL"; stale art0953 hero preload removed (~650KB saved on most visits).
- **Hover pass (5 items, deployed + verified live):** hero freezes (reveal drift pauses, timer already paused) while pointer rests on it `@media (hover:hover)`; Wall band tiles get river-style tooltips (year — title, delegated `wireWall()`); featured mats deepen on hover (`--mat` 30% → `--mat-hover` 55% blend); Lost banner ghost tiles turn orange with the text (`.ghost-tile`); all card hover timings unified to 0.25s ease (index + `_shared/ui.css` thumb overlay 0.3→0.25, caption 0.2→0.25 — sitewide).
- **Jeff rule update: new hover effects are welcome again** (he edited my restraint line); the do-not-reintroduce list (scale, sibling dim, overlays, grayscale, etc.) still stands.
- site.min.css rebuilt (23,572 B); CACHE_V auto-bumped to jfsn-20260612165115 by build_catalog. ⚠️ B2 cloud backup hit Backblaze's daily transaction cap — run `bash cloud-backup.sh` after the cap resets (tomorrow).
- **Performance pass (5 items, deployed + verified live; from Jeff's Lighthouse runs: desktop 79 / mobile 74, mobile LCP 18.2s):**
  1. **Mobile hero variants** — `artNNNN-hero-m.avif` ×10 (1080px, q55, 45–173KB vs 130–942KB full; ~80% cut). `heroSrc()` picks `-m` under 768px (slides + preload-next). Uploaded flat to /artworks/.
  2. **Hero pool inlined** — `HERO_POOL:START/END` markers in index.html, stamped by build_catalog.py from artworks/featured-hero.txt (still the editing surface; rerun build_catalog after editing it). No featured-hero.txt fetch on the LCP critical path; parseTxt removed.
  3. **Featured cards 4–30 use thumbs/** (400px ~39KB) instead of medium/ (900px ~312KB); top 3 editorial keep medium.
  4. **CLS reserves** — #wall-band-d 230px / #wall-band-m 136px / #featured-grid 640px (md+) min-heights.
  5. **Material Symbols icon font REMOVED sitewide** — all glyphs replaced with inline SVG (search/menu/close/arrows/zoom_in/home/inventory_2/auto_awesome_motion/chat_bubble/scan_delete) via `artworks/replace_icons.py` (kept, idempotent); family stripped from every fonts URL; 40 root pages + _shared/top-nav.html + gen-artwork-pages.py template; **all 1,084 artwork pages regenerated + deployed**. `colors.json` (gen-artwork-pages dependency) was missing — restored from git (deleted in 1704d146 cleanup).
  - CACHE_V `jfsn-20260612201522`. audit-nav 11/11. Preview-verified desktop (full-res hero, 3 medium + 27 thumbs, 640px reserve) + mobile (hero-m, icon SVGs, 136px reserve). NOTE: hidden preview tab freezes CSS animation clock — hero opacity 0 in background screenshots is a preview artifact, not a bug.
  - **Ask Jeff to re-run Lighthouse** to confirm the scores moved.
- JEFFS-4TB threw write I/O errors once mid-day (USB glitch) — resolved by replug; final backup verified, 24,309 files counts match. If it recurs, suspect the cable/port before the drive.

## What was done session 32 (2026-06-11 — index.html only)
- **Chromatic River band** — full-bleed canvas under the hero (desktop + mobile): all 1,084 works as chronological color slices from chromatic.json; hover tooltip, click-through to artwork, decade labels with collision-skip; links to chromatic.html. Sections hide themselves if chromatic.json fails to load.
- **The Wall band** — full-bleed grid above the Lost banner (desktop 4 rows, mobile 3): even chronological sample of mini thumbnails sized to fill exact rows, color-block backgrounds from chromatic.json, links to wall.html. Replaced the plain "View all" text links (desktop CTA now reads "Browse with filters →").
- **Hero detail→reveal** — Ken Burns drift replaced with scale(1.7)→1 pull-back from a per-slide focus point (`kb-reveal`). featured-hero.txt gains optional 4th field `reveal-origin`; defaults to object-position. prefers-reduced-motion still disables all hero animation.
- **"In His Own Words" card** — in About This Archive (desktop) + own section (mobile). VERBATIM quote only: "Something that still had a life left in it." (master-notes §verified, already on stories.html). Contains an `AUDIO:WHEN-RECORDED` comment template for the future "Why I Make Things" recording — **no fabricated quotes, ever; Jeff declined-by-rule.** Audio publishes only with Jeff's explicit approval.
- **Mobile "About This Archive"** — compact section after the river band (Playfair lead, two prose paragraphs, 2×2 stats grid); the In His Own Words card now lives inside it. Mobile visitors finally get the framing prose desktop always had.
- **Mobile folio perf** — folio images switched `artworks/full/` → `artworks/medium/` (3.1MB → 820KB; art0380 alone was 2MB).
- **favorites.html duplicate footer removed** — old unmarked footer deleted; stamped FOOTER:START block is the only one. All other pages verified single-footer; audit-nav passes.
- **Hero caption corrected** — now "XXXIII Días — imagined installation (Photoshop composite) · 2022 · COLLAGE" in all 4 locations (2 static captions, JS FALLBACK, featured-hero.txt). Wording applied per Jeff's "do all"; he can supply different words any time (one-line change).
- **Hero pool expanded 4 → 10** — added art0585 Cube Grid 1970 · art0250 Crown Tower 1990 · art0779 Defining Years 2000 · art0392 Art Machine 2010 · art0663 XXXIII Aunt Mary 2010 · art1020 Clockwork Targets 2020 (picked from favorites.txt, composite-titled works excluded, visually checked). Each has a curated reveal-origin in featured-hero.txt. New files: `artworks/full/artNNNN-hero.avif` ×6 (byte-copies of the full images — already in hero size/quality range). **⚠️ DEPLOY: the 6 new hero AVIFs must be uploaded FLAT to /artworks/ on HostGator (NOT /artworks/full/)** — the .htaccess rewrite sends `artworks/full/*-hero.avif` requests to `/artworks/`. lftp: `put artworks/full/art0585-hero.avif -o /artworks/art0585-hero.avif` (repeat for art0250, art0779, art0392, art0663, art1020).
- **Lost banner ghost tiles** — three empty 20px outlined frames beside the banner text (both mobile + desktop copies); motif borrowed from lost.html's ghost grid; static, aria-hidden.
- **"Open one at random"** — link in both Wall band headers; picks a random work from the already-fetched chromatic.json on each click; falls back to archive.html if data never loaded.
- sw.js CACHE_V bumped to `jfsn-20260611180000`. No new Tailwind utilities (no CSS rebuild needed). Verified in preview: desktop + mobile, zero console errors.
- ~~⚠️ Not yet deployed~~ **DEPLOYED** — session 32 HTML went live via JFSN.app; the 6 hero AVIFs were uploaded + verified 2026-06-12 (session 33). The hero caption truth issue was RESOLVED (see Hero caption bullet); gallery-images.html intro/meta is the remaining composite-wording item (IMPROVEMENTS.md 🟡).

## Deploy status
Sessions 25–32 **deployed** to HostGator (session 32 HTML verified live 2026-06-12; hero AVIFs uploaded same day). Sessions 29–31 + 33 are documentation-only beyond the AVIF upload.

## ⚠️ Critical open item — UPDATED 2026-06-12
**The FTP password is publicly exposed, still active, and CANNOT be rotated** — cPanel/HostGator account access is unavailable and Pure-FTPd has no self-service password change (proven by live test 2026-06-12). Do NOT chase cPanel rotation. Impact is bounded: the archive is replicated 4× and only live-site defacement is at risk. Durable fix: recover jfsn.com (Jeff contacts the friend holding the Gandi account), move serving off HostGator, let the hosting lapse. Authoritative record: `docs/FINAL-DOMAIN-AND-PRESERVATION-HANDOFF.md`. ~~Within-reach mitigation: delete the Allison PDF from the webroot~~ **DONE session 34** — every public copy of the credential is now removed or blocked (see CREDENTIAL-EXPOSURE-REPORT.md).

## What was done session 31 (2026-06-11 — verification, no site changes)
- Re-verified all session-30 review findings from scratch (credential exposure, backup gaps, narrative claims). Companion cleared; old-site origin of the exhibition table disproven.
- **Git forensics on about.html "Exhibition Record":** grew from hidden "TBD gallery" placeholders into six specific venues in a technical commit (438fb034, 2026-05-30) — no source. Recorded as master-notes **§26** with the question protocol for Jeff.
- Found master-notes §20–25 + lost-works-register.md + SESSION-29-CHECKPOINT.md existed in ONE copy (laptop only — git, GitHub, 4TB, B2 all stale). Committed, pushed, and backed up this session.
- Created `docs/SESSION-31-PRESERVATION-HANDOFF.md` — full truth report, classification, quick wins, unresolved questions.
- IMPROVEMENTS.md cleaned (duplicates/stale removed, 🔴 security items added).

## What was done this session (2026-06-10 — session 28)

### UX/UI + micro-interactions overhaul

**Micro-interactions (_shared/jfsn-interactions.js):**
- Custom cursor ring: replaced `margin` offset hack with `translate(rx - r, ry - r)` centered positioning — no drift on expand/contract
- Cursor sitewide: `cursor: none` now applies to `body *` (was only on artwork areas); ring also expands on `a` and `button` elements
- Cursor velocity scaling: lerp factor scales 0.13→0.38 based on per-frame mouse speed — ring snaps tighter on fast swipes
- Letter-settle: fires via IntersectionObserver (threshold 0.2) when element enters viewport, not on page load; total stagger capped at 260ms regardless of heading length
- Film grain: skipped entirely on touch devices (was running on mobile at ~20fps, burning battery, invisible at 2.8% opacity); pauses when browser tab is hidden
- Serendipity images: full-res `artworks/` served (was thumbnail quality); next image preloaded in hidden `Image()` after each `onload` for instant transitions
- Serendipity path resolution: replaced slash-counting hack with proper `pathname` strip; works from any directory depth
- Serendipity `→` / spacebar: advances slideshow manually, resets interval timer
- Serendipity swipe-left: touch gesture on overlay advances to next work (40px threshold, passive)
- Serendipity hint text: context-aware — touch devices see "Tap to open · Swipe left to advance"; desktop sees keyboard shortcuts
- Serendipity image size on mobile: `94vw` (was `80vw` = 300px at 375px); reverts to `min(80vw, 860px)` above 600px
- Serendipity focus trap: Tab cycles only within open dialog; focus moves to ESC button on open
- View transition: timeout reduced 100ms → 80ms

**Nav fade (_shared/top-nav.html, stamped to all 31 pages):**
- `header::after` with `rgba(11,11,11,0.07)→transparent` over 40px below nav border; subtle depth below fixed header

**artwork.html:**
- Desktop metadata column: `← → BROWSE WORKS` hint with `border-top` separator below COPY LINK — anchors empty space in right column
- Mobile: gradient title overlay at bottom of image (`rgba(11,11,11,0.58)` → transparent); title + year visible without scrolling; hidden on md+

**stories.html + why-i-made-things.html:**
- Mobile jump nav: collapsible "JUMP TO SECTION ↓" bar between page header and content; chevron rotates on open; collapses on link tap; hidden on md+ (sidebar TOC handles desktop)

**about.html:**
- Portrait photo: saturation overlay treatment matching artwork thumbnails — grey-at-top at rest, full colour on hover; inline `<style>` scoped to page

**collage.html / sculpture.html / photography.html / painting.html:**
- "Browse with filters →" extracted from `<p>` and promoted to full-width bordered button on mobile; reverts to inline link on 768px+

**lost.html:**
- Ghost grid label updated to "WORKS WITHOUT IMAGES — ESTIMATED 500–1,000" in #c4c7c7

**start-here.html:**
- Sidebar quote cards ("On loss", "On finishing"): `border-left: 2px solid #FF6600`, quote text to `#0B0B0B`, font-size 13px

**sw.js:** CACHE_V bumped to `jfsn-20260610235900`

**Files modified:**
- `_shared/jfsn-interactions.js` — full micro-interactions overhaul
- `_shared/top-nav.html` — nav fade added, stamped to all 31 pages
- `artwork.html` — desktop keyboard hint, mobile title overlay
- `stories.html` — mobile jump nav
- `why-i-made-things.html` — mobile jump nav
- `about.html` — portrait hover treatment
- `collage.html` — browse CTA, CSS
- `sculpture.html` — browse CTA, CSS
- `photography.html` — browse CTA, CSS
- `painting.html` — browse CTA, CSS
- `lost.html` — ghost grid label
- `start-here.html` — quote card visual weight
- `sw.js` — CACHE_V bumped

~~⚠️ Not yet deployed~~ **DEPLOYED 2026-06-11** (sessions 25–28 went live together via JFSN.app).

---

## What was done last session (2026-06-10 — session 27)

*(see SESSION-26-CHECKPOINT.md for full detail)*

Session 25: Header/footer UX pass — hide-on-scroll, backdrop blur, ⌘K badge, back-to-top, dynamic copyright year, email to col 1, col 4 renamed ABOUT.

Session 26: start-here.html spacing, footer breathing room (pb-8 stamped sitewide), jeff.html full revision, sitewide content audit (all clean).

---

## To do next session
*(superseded — IMPROVEMENTS.md is the live backlog; deploy of sessions 25–28 done 2026-06-11)*
- [ ] **Oral history** — "Why did Jeff keep going after the Rauschenberg realization?" — most important unanswered question. Approach gently.
- [ ] **start-here.html** — read aloud together. Oral history content is in; review for accuracy and voice.
- [ ] **Physical dimensions for surviving works** — requires Jeff to measure. No tooling exists. Essential for heirs.

## Known issues (standing)
- **sw.js CACHE_V** — `build_catalog.py` auto-bumps only when catalog content changes. Manual bump required after HTML/CSS/JS edits without catalog rebuild.
- **index.html has no FOOTER:START marker** — custom homepage footer, not stamped. Edit directly if footer changes.
- **Decade pages not in stamp-nav.sh** — edit 1970s–2020s.html directly for any nav/footer changes.
- **about-portrait.jpg** — only JPEG in the asset pipeline; all artworks are AVIF. Low priority.
- **No physical dimensions in catalog** — `build_dims.py` reads pixel dimensions (masonry layout). Physical artwork dimensions (inches/cm) require Jeff to measure; no tooling exists.

---

## Site is live at
- jfsn.com  (primary — cPanel)
- jfsn-archive.netlify.app  (secondary — Netlify, has Companion function)

## Archive stats
- 1,084 works cataloged, 0 errors

## Backup status
**Last B2 backup:** 2026-06-15 21:02:21
**⚠️ B2 cloud backup FAILED this session (2026-06-16 ~08:35)** — `transaction_cap_exceeded` (403). GitHub + 4TB are both current through commit `fd3ae8a6`; B2 is one session behind. Run `bash cloud-backup.sh` once the cap resets (~midnight GMT / ~8 PM EDT) to catch it up.
