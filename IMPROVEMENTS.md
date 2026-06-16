# JFSN — Improvement List
**Updated:** 2026-06-15 (session 39)

A living list. Add to it. Cross things off. This is the backlog.

---

## 🔴 Do soon

- [ ] **Ingest new work** — drop photos into `artworks/inbox/`, run `bash add-works.sh`. Pipeline is ready.
- [ ] **Re-run Lighthouse mobile + desktop** — sessions 36–44 fixes (mobile LCP static-hero, desktop CLS font-display=optional) are confirmed LIVE (verified live `sw.js` CACHE_V, live `display=optional`, live `wall.html` tap-target CSS, live `guernica.html` border — all match local 2026-06-16). Only the post-deploy Lighthouse confirmation is still outstanding.

---

## 🟡 High value, no deadline

### Content
- [ ] **Physical artwork dimensions (real measurements)** — orientation stand-in SHIPPED session 35 (vertical/horizontal/square from pixel dims via dims.json, shown on artwork pages + an archive filter). Actual inches/cm still need Jeff to measure surviving works; no tooling. Start with the most significant pieces.
- [ ] **Oral history — unanswered questions** — see `docs/oral-history/master-notes.md` Section "Unresolved Questions" for priority list. Top item: why did he keep going after the Rauschenberg realization?
- [ ] **start-here.html** — oral history content written in (session 21). Review with Jeff and refine.

### Technical
- [ ] **Grid/search/favorites year labels** (optional follow-up to provenance) — these still show the bare decade year ("1990"); only artwork detail pages + API carry the honest "1990s (est.)". Could extend `year_display` to grids, but it adds visual noise to terse captions — deferred pending Jeff's call.

---

## 🟢 Nice to have, low urgency

### Technical
- [ ] **Accessibility pass** — Lighthouse a11y is 93–96, not 100. Check small uppercase `#575757` labels' contrast on bone-white, `:focus-visible` states, and icon-button labels against the stated WCAG-AA goal.
- [ ] **series-index.html per-theme icons** — extend the session-35 icon vocabulary (inline feather SVGs) to the 8 series/themes, but ONLY if they read as earned rather than literal. Review with Jeff first.

---

## ✅ Completed (recent)
- [x] ~~**Decade pages (1970s–2020s) migrated to Stitch nav/footer**~~ — DONE 2026-06-16, closed the biggest visual-coherence gap found in a global review: decade pages were the only pages still on the old bespoke nav/footer (no Stories/Lost links, no ⌘K, no warm-brown borders, no bracket CTAs, no progress bar). All 6 pages now use the literal canonical `_shared/top-nav.html`/`footer.html`, warm-brown borders, orange eyebrow, `[ Browse with filters → ]` bracket CTA, and a reading progress bar — added to `stamp-nav.sh` TARGETS so future nav/footer edits propagate automatically. Artwork grid/thumbnail markup on these pages was intentionally left untouched (separate, larger effort). Preview-verified desktop + mobile, zero console errors, `audit-nav.sh` clean.
- [x] ~~**Sessions 36–44 fully deployed**~~ — VERIFIED LIVE 2026-06-16 (global review): live `sw.js` CACHE_V matches local exactly, live `index.html` carries `display=optional`, live `wall.html` has the 64px mobile tap-target CSS, live `guernica.html` carries the `#8e7164` border, the 3 recompressed hero AVIFs serve at their smaller live sizes, and the `sw.js` offline-fallback branded page is present live. Backlog had this listed as "not yet live" — it was stale.
- [x] ~~**Internal dev-tool exposure (curate.html / dedupe.html / qa.html / curate-session.json)**~~ — CLOSED 2026-06-16, found during a global review: these `noindex`-tagged local-curation tools were publicly reachable (HTTP 200) on jfsn.com because `deploy.sh` / `deploy-netlify.sh` never excluded them. Their POST targets (`/save-session`, `/rename-works`) only exist on the local `server.py` dev server, so nothing was exploitable — but the pages and the internal theme-grouping notes in `curate-session.json` had no business being public. Added all four to both deploy scripts' exclude lists and removed the live copies from HostGator via lftp; all four verified 404.
- [x] ~~**One ~1-minute audio recording**~~ — DONE 2026-06-16, first audio of Jeff ever recorded (~34s, iPhone Voice Memos, "a few words about who he is"). Saved as `audio/who-i-am.m4a`, wired into both `<audio>` placeholder slots in index.html (desktop "In His Own Words" card + mobile section), deployed + verified live.
- [x] ~~**DOMAIN: contact friend holding Gandi account**~~ — CLOSED 2026-06-16, this item was based on a wrong assumption. Jeff showed a Gandi invoice (N° 2026021000232) proving he owns the account directly: organization "jfsneumann", billed to his own address, paid by his own card, Feb 10 2026. No friend is involved; nothing to do here beyond paying the March 5 renewal each year as usual.
- [x] ~~**Session 44 (2026-06-16) — wall.html mobile tap-targets + responsive images**~~ — tiles were 40.7px on a 375px viewport (under the 44px guideline) with no srcset; raised the mobile `minmax()` floor to 64px (renders at 74px), added a touch-only 2px gap, and added a new 80px `micro` image tier (avg 2.7KB vs mini's 11KB) wired into `srcset`/`sizes` on all 1,084 tiles + the `ingest.py` pipeline for future works. Caveat: on Jeff's actual iPhone 15 Pro (DPR3) the micro tier mostly won't engage since 64px CSS × 3 DPR exceeds 80px — real savings land on standard-DPI screens, not retina mobile; zero regression either way.
- [x] ~~**Session 44 (2026-06-16) — Desktop CLS root cause found + fixed sitewide**~~ — hero h1 fallback font (`serif`) wraps to a 3rd line at `max-width:16ch`, 77px taller than the Playfair Display render, until the swap completes — classic font-swap CLS, explains the bouncing 0/0.05/0.147/0.16 Lighthouse numbers from session 36. Fixed by switching `&display=swap` → `&display=optional` on the Google Fonts link sitewide (1,122 files incl. the artwork-page template) — cached-font visitors still get Playfair Display; cold-cache slow-network visitors keep the fallback for the whole pageview with zero shift. Awaiting Jeff's post-deploy Lighthouse re-run to confirm.
- [x] ~~**Session 44 (2026-06-16) — Stitch pass on 8 theme pages**~~ — guernica/targets/framed/torsos-faces/gallery-images/mr-snowmann/crosses/collaboration: header border → `#8e7164`, reading progress bar, "All series & themes →" promoted to `[ bracket → ]` CTA. Closes the "Next Stitch pages" backlog item — all medium/theme/series pages now on Stitch June-2026 surface treatment. CACHE_V `jfsn-20260616120000`. Preview-verified, zero console errors.
- [x] ~~**Sessions 38–39 (2026-06-15) — Stitch "Home (Animated Archive)" pass on index.html**~~ — Nav: JFSN wordmark → Playfair Display 22px, links → uppercase label-caps flush right (stamped 31 pages). Hero: Stitch-matched overlay (radial warm glow + lighter 0.30 dark), solid white text, `[ EXPLORE THE RIVER → ]` fill button (hover → charcoal), `BROWSE ALL 1,084 WORKS` ghost underline button (hover → white border), staggered hero-reveal entrance animations, bottom strip "1,084 Works Cataloged · Cleveland, Ohio". Hero image: `scale-105 → scale-100` slow zoom on load + hover parallax, `opacity-90`. Text selection: orange site-wide. Selected Works cards: image zoom `scale-1.07` on hover, Playfair italic caption overlay slides up from bottom. Stagger reveal on all bento cards + Today band. Bento-dark Stories card: bg flips to #FF6600. Paper-lift on content cards. scroll-reveal on all major sections. Mobile hero: fully updated to match desktop (white text, Playfair subtitle, fill + ghost buttons, warm glow). sw.js CACHE_V bumped.
- [x] ~~**Session 36 (2026-06-13) — mobile hero LCP + provenance fields; BUILT + preview-verified (deploy pending, see Technical above)**~~ — **Mobile hero LCP:** `featured-hero.txt` leads with art0392 (lightest, 46 KB mobile), slide-0 made deterministic, media-aware `<head>` preload stamped by build_catalog. **Provenance:** all 1,084 years → `year_precision='estimated'` + `year_display="1990s (est.)"`; 250 works flagged `composite=True` (Gallery ∪ Studio ∪ placement-title, per Jeff's broadest-sweep choice); `description_source` skipped per Jeff. Shown on artwork.html + 1,084 regenerated static pages ("1990s (est.)" + "Photoshop composite — imagined placement" note) + api/v1. Hero recompression: 3 desktop heroes shrunk ~679 KB (originals backed up). All preview-verified, zero console errors.
- [x] ~~**Session 35 (2026-06-13) — Companion fix + orientation + icons + truth pass; ALL deployed + verified live**~~ — **Companion deep-mode 502 fixed**: root cause was Netlify's hard 30s function timeout (Sonnet 4.6 + adaptive thinking + 5-turn loop + 4000 tokens), NOT bad model output as previously logged; deep mode is now Sonnet 4.6 *without* extended thinking at 1024 tokens — verified live (HTTP 200 in ~17.5s). **gallery-images.html** rewritten to the composite truth ("Imagined Placements"; intro + meta + OG + JSON-LD). **Image-orientation stand-in**: `build_catalog.py` reads `dims.json` → `orientation` (vertical 424 / horizontal 573 / square 87) in catalog + lite; shown on artwork.html + all 1,084 regenerated static pages; new ORIENTATION filter on archive.html. **Artwork theme links** (themes row links via slug map; series.html?theme= fallback). **Decade-footer parity** (api/favorites/start-here/why-i-made-things added to all 6). **HSTS** enabled in .htaccess. **sw.js PRECACHE** +stories/why-i-made-things/timeline. **Hero keeps scaling on hover** (removed the pause rule). **Icons sitewide** (inline feather SVGs, no icon fonts): homepage "Where To Begin" (6 + Start Here orange feature), start-here "Begin Exploring" (8, Full Archive = orange primary), mobile drawer (4, re-stamped to 31 pages). **Lighthouse re-run** confirmed the perf pass: desktop ~86 / mobile ~78, LCP ~2.4–5.4s (was 18.2s). CACHE_V `jfsn-20260613180000`; audit-nav 11/11. NOTE: mobile nav is a hamburger drawer, not a fixed bottom bar (CLAUDE.md corrected).
- [x] ~~**Nine homepage/sitewide UX features (sessions 34b, both rounds)**~~ — river tooltip mini previews (homepage bands + chromatic.html), cross-document view-transition artwork morph SITEWIDE (incl. 1,084 regenerated static pages; old broken same-doc code removed), hero→river "you are here" marker, Today from the Archive daily strip, mobile folio dot rail, mini-river on artwork.html ("where this sits"), river touch scrubbing, clickable decade labels → filtered archive. All deployed + verified on jfsn.com and Netlify (2026-06-12)
- [x] ~~**Allison PDF removed from BOTH webroots**~~ — deleted from jfsn.com via FTP (404 verified); Netlify mirror refreshed via curated CLI deploy — PDF + make_handoff.py now 404 there too, `_redirects` 42 forced-404 rules finally live, mirror current through session 33 (was a stale June-5 snapshot; **site has NO git integration — Netlify deploys are manual CLI from a curated staging dir, see CREDENTIAL-EXPOSURE-REPORT.md §6**). deploy.sh `*.pdf`/`docs/` excludes were already in place since session 31. Every public copy of the credential is now CLOSED or BLOCKED (session 34, 2026-06-12)
- [x] ~~**Performance pass**~~ — mobile hero variants (1080px -hero-m, ~80% smaller), hero pool inlined via build_catalog stamp (featured-hero.txt still the editing surface), thumbs for featured cards 4–30, CLS min-height reserves, Material Symbols icon font → inline SVG sitewide incl. all 1,084 regenerated artwork pages; colors.json restored from git (session 33, 2026-06-12)
- [x] ~~**Hover pass**~~ — hero holds still on hover, Wall band tooltips, mat bloom (30→55% blend), ghost tiles join Lost hover, unified 0.25s card timing sitewide (session 33)
- [x] ~~**Homepage image UX pass**~~ — whole works on visible color mats (object-contain), 3 composite-titled works out of featured pool, folio frames hug artwork, mobile hero caption single line, 44px touch targets, mobile Wall title, stale preload removed (session 33)
- [x] ~~**Exhibition Record verified by Jeff**~~ — all six happened, with corrections (4 of 6 rows had wrong years/venues; most recent real show was 2012, the CIA show was a 1978 *student* exhibition; 2003 CCCA confirmed group show). about.html corrected + deployed + verified live; testimony in master-notes §27 (session 33, 2026-06-12)
- [x] ~~**fine-art-2000 lost-works lead closed**~~ — Jeff confirmed all 14 works from his ~2000 site are already in the catalog; bonus materials testimony (USPS/FedEx containers, CDs, Targets) recorded in §27 (session 33)
- [x] ~~**Deploy session 32**~~ — HTML deployed via JFSN.app; 6 hero AVIFs uploaded flat to /artworks/ + verified 200 live (session 33, 2026-06-12)
- [x] ~~**Full integrity audit**~~ — links, image pipeline, sitemap, live spot-checks all clean; found + fixed the hero 404s (session 33)
- [x] ~~**index.html WOW pass**~~ — Chromatic River band, Wall band, hero detail→reveal, In His Own Words card (verbatim quote + audio slot) (session 32)
- [x] ~~**Mobile About This Archive**~~ — compact prose + 2×2 stats + voice card on mobile; folio images full→medium (3.1MB→820KB) (session 32)
- [x] ~~**Hero caption truth fix**~~ — "XXXIII Días — imagined installation (Photoshop composite)" in all 4 locations (session 32)
- [x] ~~**Hero pool 4→10**~~ — one work per decade from favorites, curated reveal-origins, composite titles excluded (session 32)
- [x] ~~**favorites.html duplicate footer**~~ — old unmarked footer removed; sitewide footer audit clean (session 32)
- [x] ~~**Lost banner ghost tiles + "open one at random"**~~ — (session 32)
- [x] ~~**index.html session-26 UX gaps**~~ — hero scroll cue, About stat column, Where To Begin card warmth, section borders: all verified shipped (sessions 27–32)
- [x] ~~**start-here.html spacing**~~ — Begin Exploring no longer crowds footer; outer wrapper padding fixed (session 26)
- [x] ~~**Footer bottom bar breathing room**~~ — pb-8 added, stamped to all 31 pages (session 26)
- [x] ~~**jeff.html stale**~~ — full revision: all current pages, theme pages, Netlify URL, corrected tags (session 26)
- [x] ~~**`border-radius` on saturation overlay**~~ — `border-radius: inherit` added to `.thumb__link::after` in ui.css (session 25)
- [x] ~~**Two-column layout overflow fix**~~ — gap-16→gap-8, mobile padding fix on stories/why-i-made-things/start-here (session 24)
- [x] ~~**TOC on long pages**~~ — stories.html + why-i-made-things.html sidebar TOC with active tracking (session 24)
- [x] ~~**Search `/` shortcut**~~ — opens search overlay, modal + tooltip updated (session 24)
- [x] ~~**Archive filter chips**~~ — dismissible chips, clear all, count label, mobile fixes (session 24)
- [x] ~~**Artwork keyboard hint + copy link**~~ — keyboard hint below nav, copy link button (session 24)
- [x] ~~**Image hover system**~~ — saturation overlay on all artwork thumbnail pages; orange border image-only; Inter 600 captions (session 23)
- [x] ~~**Archive title-orange**~~ — was missing; added to archive.html h4 (session 23)
- [x] ~~**series.html missing ui.css**~~ — link added (session 23)
- [x] ~~**featured.txt**~~ — rebalanced 2026-06-05
- [x] ~~**search.js browse counts**~~ — auto-patched via build_catalog.py (session 21)
- [x] ~~**series.html named series broken**~~ — series field missing from catalog-lite.json (session 21)
- [x] ~~**dims.json missing**~~ — build_dims.py run, masonry layout restored (session 21)
- [x] ~~**start-here.html oral history**~~ — Jeff's voice written into page (session 21)
- [x] ~~**cache-stamp dead code**~~ — ?v=BUILD_TS now in index.html (session 21)
- [x] ~~**orphaned files**~~ — 13 files deleted (session 21)

---

## How to use this list

Start each session: paste the start prompt → `Read CURRENT_STATE.md and IMPROVEMENTS.md. Summarize open items by priority, flag anything stale, then ask what I want to work on.`

Add new ideas here any time. Delete completed items; history lives in git log.
