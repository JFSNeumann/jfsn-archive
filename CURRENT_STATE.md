# Current State
**Updated:** 2026-06-14 10:11

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
**Last B2 backup:** 2026-06-14 10:12:35
