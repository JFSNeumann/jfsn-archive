# JFSN — Improvement List
**Updated:** 2026-06-13 (session 35)

A living list. Add to it. Cross things off. This is the backlog.

---

## 🔴 Do soon

- [ ] **DOMAIN: Jeff contacts the friend holding the Gandi account** — ask for a Change of Owner to a Jeff-controlled account, or the transfer code. The keystone action; everything needed is in docs/DOMAIN-RECOVERY-DOCUMENT-PACK.md. (FTP password rotation is IMPOSSIBLE — no cPanel access, proven 2026-06-12; superseded as an action item. See docs/FINAL-DOMAIN-AND-PRESERVATION-HANDOFF.md.)
- [ ] **One ~1-minute audio recording** — standing #1 creator-context priority (§25). No audio of Jeff exists anywhere (he declined for the exhibition answers 2026-06-12 — don't push; offer occasionally). Also: listen to `old-site/BB/audio/sample.wav` (21s — possibly the only existing audio).
- [ ] **Ingest new work** — drop photos into `artworks/inbox/`, run `bash add-works.sh`. Pipeline is ready.

---

## 🟡 High value, no deadline

### Content
- [ ] **Physical artwork dimensions (real measurements)** — orientation stand-in SHIPPED session 35 (vertical/horizontal/square from pixel dims via dims.json, shown on artwork pages + an archive filter). Actual inches/cm still need Jeff to measure surviving works; no tooling. Start with the most significant pieces.
- [ ] **Oral history — unanswered questions** — see `docs/oral-history/master-notes.md` Section "Unresolved Questions" for priority list. Top item: why did he keep going after the Rauschenberg realization?
- [ ] **start-here.html** — oral history content written in (session 21). Review with Jeff and refine.

### Technical
- [ ] **Catalog provenance fields** — `year_precision`, `description_source`, `composite` flags through build_catalog → lite → api/v1 → artwork.html ("c. 1970s" display) → JSON-LD. The one multi-session project worth doing (handoff §3). NB: the `orientation` field added session 35 is the same pipeline pattern to follow.

---

## 🟢 Nice to have, low urgency

### Technical
- [ ] **series-index.html per-theme icons** — extend the session-35 icon vocabulary (inline feather SVGs) to the 8 series/themes, but ONLY if they read as earned rather than literal. Review with Jeff first.

---

## ✅ Completed (recent)
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
