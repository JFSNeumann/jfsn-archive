# JFSN — Improvement List
**Updated:** 2026-06-12 (session 33)

A living list. Add to it. Cross things off. This is the backlog.

---

## 🔴 Do soon

- [ ] **Run `bash cloud-backup.sh`** — B2 hit its daily transaction cap 2026-06-12 (still capped at session-34 start; cap resets midnight GMT ≈ 8 PM EDT). B2's last good sync was 2026-06-12 12:22 — it's missing the afternoon performance pass + final session-33 commits (all safe on laptop + GitHub + 4TB).
- [ ] **Re-run Lighthouse on jfsn.com** — confirm the 2026-06-12 performance pass moved the scores (was desktop 79 / mobile 74, mobile LCP 18.2s; expect mobile LCP ~3–4s).
- [ ] **DOMAIN: Jeff contacts the friend holding the Gandi account** — ask for a Change of Owner to a Jeff-controlled account, or the transfer code. The keystone action; everything needed is in docs/DOMAIN-RECOVERY-DOCUMENT-PACK.md. (FTP password rotation is IMPOSSIBLE — no cPanel access, proven 2026-06-12; superseded as an action item. See docs/FINAL-DOMAIN-AND-PRESERVATION-HANDOFF.md.)
- [ ] **Companion function returns 502 "Unexpected model response"** — pre-existing on BOTH Netlify prod and fresh deploys (found 2026-06-12 during mirror refresh; valid `{"prompt":...}` POST reproduces it). Debug `netlify/functions/companion.mjs` response handling.
- [ ] **One ~1-minute audio recording** — standing #1 creator-context priority (§25). No audio of Jeff exists anywhere (he declined for the exhibition answers 2026-06-12 — don't push; offer occasionally). Also: listen to `old-site/BB/audio/sample.wav` (21s — possibly the only existing audio).
- [ ] **Ingest new work** — drop photos into `artworks/inbox/`, run `bash add-works.sh`. Pipeline is ready.

---

## 🟡 High value, no deadline

### Content
- [ ] **Physical artwork dimensions** — no tooling exists yet. Essential archival data for works that will be distributed to heirs. Requires Jeff to measure surviving works. Start with the most significant pieces.
- [ ] **Oral history — unanswered questions** — see `docs/oral-history/master-notes.md` Section "Unresolved Questions" for priority list. Top item: why did he keep going after the Rauschenberg realization?
- [ ] **start-here.html** — oral history content written in (session 21). Review with Jeff and refine.

### Technical
- [ ] **HSTS** — uncomment line 93 in `.htaccess`; SSL is confirmed working (site serves https with full security headers).
- [ ] **Catalog provenance fields** — `year_precision`, `description_source`, `composite` flags through build_catalog → lite → api/v1 → artwork.html ("c. 1970s" display) → JSON-LD. The one multi-session project worth doing (handoff §3).
- [ ] **gallery-images.html intro + meta/og** — needs Jeff-approved rewrite; current text states the composites are real exhibition documentation (false per master-notes §22/§25). (Homepage hero caption half DONE session 32 — "imagined installation (Photoshop composite)".)

---

## 🟢 Nice to have, low urgency

### Technical
- [ ] **Decade footer parity** — all 6 decade pages missing api/favorites/start-here/why-i-made-things links vs shared footer. Best fixed with a stamped Material footer block, not hand edits.
- [ ] **artwork.html theme links** — Themes metadata row is plain text; link to theme pages via a small slug map (also in gen-artwork-pages.py template).
- [ ] **sw.js PRECACHE** — add stories.html, why-i-made-things.html, timeline.html.

---

## ✅ Completed (recent)
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
