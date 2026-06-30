# JFSN Current State
**Last updated:** 2026-06-30

This file describes what's currently true about the site. For ranked work, see `IMPROVEMENTS.md`. For the design brief and architecture, see `CLAUDE.md`. For the session-by-session historical log, see `docs/sessions-archive.md` or `git log`.

---

## 2026-06-30 — R2 decision + R1 fix: dual artwork-page system ✅ (committed, deployed)

**R2 decision (architectural, Jeff-confirmed):** `artwork.html` (dynamic, `?id=artNNNN`, full
animation/interaction stack) and the 1,084 static generated `artworks/pages/artNNNN.html`
pages (lightweight, no bundles, no animation layer) are a **permanent, intentional split**,
not a migration-in-progress. The generated pages stay deliberately minimal — fast load, no
animation budget, good for SEO/crawlers/no-JS resilience. `artwork.html` stays the rich
interactive view. **The contract:** generated pages get their own small, self-contained JS for
any interactive feature they expose (see `_shared/artwork-page-min.js`) — they do not load
`core.bundle.js` or any part of the animation layer. If a feature is added to one template, it
is not automatically expected on the other; each template's interactivity is scoped to what
that template intentionally supports.

**R1 fix (shipped as R2's first concrete output):**
- Root cause was two-fold, not one: (1) the generated pages' `onclick` handlers called
  `window.showToast`/`window.toggleFavorite`, which were never defined on those pages (only
  shipped via `core.bundle.js`, which they don't load); (2) independently, `gen-artwork-pages.py`
  was emitting malformed `onclick` attributes — literal backslash-escaped quotes
  (`onclick="...(\"art0001\")"`) inside an HTML attribute, which is invalid outside a JS string
  context and silently broke attribute parsing even where the JS itself was correct.
- Fixed both: added `_shared/artwork-page-min.js` (a minimal, hand-maintained toast +
  favorite implementation, ~50 lines, reusing the existing `.toast`/`.favorite-btn` CSS already
  shipped in `ui.css`) and corrected the attribute quoting in `gen-artwork-pages.py` to use
  single quotes inside the double-quoted HTML attribute.
- Regenerated all 1,084 pages via `python3 gen-artwork-pages.py`. Verified live in-browser on
  `art0001.html`: Favorite button toggles `is-favorited` + localStorage + toast; Copy-ID toast
  fires; no console errors.
- `audit-nav.sh` run clean except pre-existing, unrelated "missing search.js" warnings on
  six theme/essay pages — not touched by this change.

---

## 2026-06-30 — H1+M1+H2: Dead JS removal + stamp-nav.sh fix ✅ (committed, deployed)

**Commits:** `5fcedd17` (H1+M1), `1b429181` (H2), `dfcf00c0` (roadmap)

**H1+M1 — Dead JS removed from bundles:**
- `_shared/micro-interactions.js` (50KB, 1,335 lines, 40+ null-guarded dead functions) deleted from `nav-late.bundle.js` and repo
- `_shared/analytics.js` (5KB, sent to non-existent `/analytics` endpoint) deleted from `core.bundle.js` and repo
- `nav-late.bundle.js`: 71,447 → 19,702 bytes; `core.bundle.js`: 62,552 → 56,002 bytes
- Total sitewide JS parse budget reduction: ~58KB
- CACHE_V bumped to `jfsn-1782827955`

**H2 — stamp-nav.sh NAV:END scope fixed:**
- `<!-- NAV:END -->` moved to before sitewide script bundle in `_shared/top-nav.html`
- New `<!-- SCRIPTS:START -->` / `<!-- SCRIPTS:END -->` span wraps sitewide bundle
- `stamp-nav.sh` updated to stamp all three spans (NAV, SCRIPTS, FOOTER) independently
- All 37 stamped pages migrated in one pass; idempotent on second pass
- Page-specific scripts (after SCRIPTS:END) are now safe from re-stamp deletion by construction
- `CLAUDE.md` updated with new three-span structure and retired stale NAV-span warning

**Backup situation (H3):**
- B2 cloud backup: manually synced (9,506 objects / 683MB current). LaunchAgent had been
  failing for 15 days: macOS Full Disk Access blocks launchd from running scripts in ~/Documents.
  **User action required:** System Settings → Privacy & Security → Full Disk Access → add /bin/bash
- JEFFS-4TB: corrupted APFS container superblock (`diskutil verifyVolume` returned exit 8 / "Container
  superblock is invalid"). rsync writes fail. B2 is the only off-site backup.
  **User action required:** Open Disk Utility → JEFFS-4TB → First Aid. If it fails, reformat and repopulate with `bash backup.sh`.

---

## 2026-06-30 — Phase 2C: Dead CSS removal ✅ (committed, deployed, frozen)

**Tag:** `phase2c-freeze` (recommended) → `06f3c6a0`

**What changed:**
- `_shared/ui.css`: 6,958 → 5,015 lines; 158KB → 118KB raw; 28.3KB → 22.9KB gzip (−19.1%)
- 1,943 net lines removed: Phases 9–12 prototype CSS (never had HTML infrastructure), V2 design-system override blocks with zero live references, 4 orphaned dark-mode/responsive variants found in independent review
- `.thumb` animation fixed: V2 `grid-entrance-slow` was silently overriding the Phase 3 stagger animation AND bypassing the `prefers-reduced-motion` accessibility guard via cascade order — both restored
- Two architectural annotation comments added: `.thumb` stagger anomaly, load-bearing `h1/h2/h3` rules
- V2 section numbering corrected from gapped (1–4, 6, 7, 11–13) to sequential (1–9)
- `CACHE_V` bumped to `jfsn-1782824794`
- All 1,084 generated artwork pages: zero code changes (CSS loaded by `<link>` — no regen needed)

See `SESSION-END-PHASE2C.md`, `CSS_ARCHITECTURE_AUDIT.md`, and `PHASE2C-REMOVAL-MAP.md` for full detail.

---

## 2026-06-29 — Phase 2 (FOUC): Dark-mode fix on 1,084 artwork pages ✅ (committed, deployed, frozen)

**Tag:** `phase2-fouc-freeze` → `0f2d1fbe`

**What changed:**
- THEME_INIT head-blocking script added to all 1,084 generated artwork pages in `artworks/pages/`
- One line added to `gen-artwork-pages.py` template — all future regeners inherit the fix automatically
- `CACHE_V` bumped to `jfsn-1782782983` and deployed to jfsn.com
- Every page on jfsn.com now prevents dark-mode FOUC (Phase 1 covered the 38 root pages; this closes the gap)

See `SESSION-END-PHASE2-FOUC.md` and `PHASE2-FOUC-PREDEPLOY-REVIEW.md` for full detail.

---

## 2026-06-29 — Phase 2A: JS Bundling ✅ (committed, deployed, frozen)

**Tag:** `phase2a-freeze` → `e938db90`

**What changed:**
- Introduced three JS bundles: `_shared/core.bundle.js` (7 files), `_shared/nav-early.bundle.js` (8 files), `_shared/nav-late.bundle.js` (3 files)
- Reduced JS requests by **15 per stamped page** (e.g. index.html: 46 → 31 script tags)
- Added `npm run build:js` script (`node build-js-bundles.js`) — mirrors the existing `npm run build:css` pattern
- Bumped `CACHE_V` to `jfsn-1782767971` and deployed to jfsn.com
- No behavior changes; no source files deleted; 1,084 generated artwork pages untouched

**Deferred to a future phase:** pre-commit hook bundle freshness check, audit-nav.sh search.js false positive on 30 pages, pre-existing duplicate script executions (nav-active.js × 8 pages, etc.), ui.css 158KB render-blocking, stamp-nav.sh fragility.

See `SESSION-END-PHASE2A.md` for full detail.

---

## 2026-06-25 — v2 rollout begun: homepage cleaned, depth-hero piloted, archive simplified

**What changed (all committed + pushed to GitHub; NOT yet deployed to jfsn.com):**
- **Homepage cleanup ✅** — stripped the accreted broken motion from `index.html`: invalid `translateY(24px) blur(4px)` reveal, dead `#featured-grid` column-count block, leftover `perspective:1000px`, duplicate reduced-motion block, unused skeleton shimmer + its stylesheet link, three stray `border-radius:2px`, gradient section divider + nav-dot connector, a duplicate scroll-reveal observer, and a redundant JS grid-resize handler. Encoded the v2 "Surface treatment" rule (flat dividers, square corners, gradients only as functional scrims) in `DESIGN-SYSTEM.md`.
- **Homepage orientation consolidated ✅** — the two modules ("Navigate the Studio" mobile + "How to Explore" desktop) are now one responsive **"Where to Begin"** section (2 cols mobile, 4 cols desktop), single source of truth.
- **Homepage data integrity ✅** — "WORKS CATALOGED" was a hardcoded `0` with an unused `data-counter`; now a static `1,084` (honest with JS off). Featured-card metadata had `opacity:0` inline (a hover/JS gate); now always-visible (anime.js fade-in still runs as load choreography). **Second instance found + fixed 2026-06-25:** the desktop "About This Archive" stat card (`#about-stat-works`) had its own count-up `<script>` that reset the already-correct static `1,084` to `0` and animated it back up on scroll-into-view — a JS-only regression (no-JS users never saw it, but the vast majority with JS enabled saw the number flash to zero first). Script deleted; the static `1,084` is now the only thing that ever renders, for everyone.
- **`timeline.html` retired ✅** — file deleted (commit `ed0cd3b9`); delinked from start-here.html, `stamp-nav.sh`, `build_catalog.py` sitemap. **Swept remaining stragglers 2026-06-25:** `sw.js` PRECACHE, `_shared/nav-active.js`'s page-nav map, `_shared/chromatic-position-strip.js`'s explanatory comment, the stale `sitemap.xml` entry (regenerated since `build_catalog.py` was already correct), and `README.md`'s now-wrong "should not be deleted" note.
- **Depth-hero — shared primitive, now on 12 pages ✅** — extracted to `_shared/depth-hero.js` (single source of truth; pages opt in with `.dh-rise` on hero layers + `id="dh-word"` on the display headline). Live on: `lost.html`, `chromatic.html`, `about.html`, `start-here.html`, and all 8 theme pages (guernica, targets, framed, torsos-faces, crosses, mr-snowmann, gallery-images, collaboration). Display-type parallax (the big Playfair word drifts up faster than scroll, capped 64px) + load-choreography stagger; the artwork/photo/canvas plane stays locked at 1.0×. Gated for `prefers-reduced-motion` (skip) and JS-off (no hidden initial state). Added to `sw.js` precache. **Lighthouse: lost.html scored 97 perf / 100 a11y WITH the motion — the pattern costs ~nothing.**
- **`archive.html` simplified ✅** — removed the Session-77 interaction layer (fc-ripple/badge/swatch/peek + quick-preview modal: ~120 CSS + ~80 JS lines). Now matches the homepage's "image + always-visible caption" model. Kept the accent bar, view-transition morph, filters, sort.
- **Homepage a11y fixes ✅** — heading-order (h4→h3), label/name mismatch (⌘K aria-hidden, lost-fragment alt), the real contrast fail (lost-stat #c4c7c7→#8e7164), and touch targets (river ticks 24px). Remaining Lighthouse contrast flag is a confirmed false-positive (axe measuring stat text mid-fade through the shared reveal animation). See `PERF_BASELINE.md`.
- **Homepage JS hygiene ✅** — deferred the 1,326-line render-blocking `micro-interactions.js`, removed a duplicate `nav-active.js`, idle-built the below-fold wall. Re-measured: Perf 88–90 / TBT 0–30ms (the earlier 54/1,180ms was a CPU-contended outlier).
- **Fresh perf baseline ✅** — `PERF_BASELINE.md` now has real, corrected Lighthouse 12.8.0 numbers.

**Open threads — next real building work:**
- ~~**Deploy when ready**~~ — **DEPLOYED** as part of Phase 2A (2026-06-29). All 2026-06-25 work is live on jfsn.com.
- **The two-reveal-systems tangle** (`_shared/ui.css` auto-animation vs per-page IntersectionObserver) — flagged as a background task; causes the contrast false-positive. Cross-page shared-CSS cleanup, own session.
- **Homepage depth-hero** — deliberately NOT added; the homepage hero is already its own animated instrument (mosaic/slice/river). Revisit only if the two should be reconciled.
- Optional: extend depth-hero to `series-index.html` / `series.html` if their heroes fit the pattern.

**Decided 2026-06-24 — do not reopen:**
- `curatorial-map.html` → **KEEP as-is** (the earlier "rebuild as a relationship visual" idea is reversed).
- Voice threading (oral history on the works) → **deferred to the final phase**; not live work now.

---

## Site is live at
- **jfsn.com** — cPanel/HostGator, the only host. Netlify (secondary mirror) and the Companion AI chat feature were removed 2026-06-22.

## Archive stats
- 1,084 works cataloged, 0 errors
- Covers 1974–present (5 decades)

## Backup
Four redundant stores, listed in update order at end-session:
1. GitHub (`origin/main`) — last known commit: `06f3c6a0` (Phase 2C docs, 2026-06-30); tags `phase2a-freeze`, `phase2-fouc-freeze` pushed; `phase2c-freeze` pending push
2. Local Mac (working tree)
3. JEFFS-4TB external drive (rsync, nightly LaunchAgent at 11 PM)
4. Backblaze B2 cloud (LaunchAgent at 9 PM nightly; rides `session-end.sh` / manual `cloud-backup.sh` when capped — daily cap resets ~midnight GMT / ~8 PM EDT) — **last B2 timestamp not verifiable from this session:** `~/Library/Logs/jfsn-cloud-backup.log` is empty and last modified 2026-06-15. Worth checking the LaunchAgent is still actually firing, not just assuming it is because it's scheduled.

Refresh this section at the end of each session with the latest commit hash + last B2 backup timestamp.

---

## 🔴 Critical open items

**FTP password publicly exposed, still active, cannot be rotated.** cPanel/HostGator account access is unavailable and Pure-FTPd has no self-service password change (proven by live test 2026-06-12). Do NOT chase cPanel rotation. Impact is bounded: the archive is replicated 4× and only live-site defacement is at risk. Rotation is **ON HOLD by Jeff** — every public copy of the credential is now removed or blocked (see `CREDENTIAL-EXPOSURE-REPORT.md`, session 34). **Domain note (corrected 2026-06-16):** Jeff owns and pays for the jfsn.com Gandi account directly (invoice confirmed) — there is no friend in the loop, and migrating off HostGator does not require contacting anyone else. Authoritative record: `docs/FINAL-DOMAIN-AND-PRESERVATION-HANDOFF.md` §5 (closed).

---

## Standing known issues

- **`sw.js` CACHE_V auto-bump is partial** — `build_catalog.py` only bumps `CACHE_V` when catalog content changes. Manual bump required after HTML/CSS/JS edits that don't trigger a catalog rebuild. Check `git diff sw.js` before deploy.
- **`index.html` has no `FOOTER:START` marker** — custom homepage footer, not stamped by `stamp-nav.sh`. Edit directly if footer changes.
- **Decade pages (1970s–2020s.html) not in `stamp-nav.sh`** — different token system (Material Design). Edit directly for any nav/footer changes. They DO load `_shared/ui.css` and `_shared/ui.js`.
- **`about-portrait.jpg`** — only JPEG remaining in the asset pipeline; all artworks are AVIF. Low priority.
- **No physical dimensions in catalog** — `build_dims.py` reads pixel dimensions (for masonry layout). Physical artwork dimensions (inches/cm) require Jeff to measure surviving works; no tooling exists.
- **Grid/search/favorites year labels show bare decade** — only artwork detail pages + API carry the "(est.)" honesty label. See IMPROVEMENTS.md if this should be extended.

---

## What's on the homepage (current as of 2026-06-21)

The Selected Works grid uses CSS Columns masonry (4→3→2 cols responsive). Each card is a faithful image with an always-visible title/year/medium caption beneath it and a single link to the artwork page. Hover/focus shows a quiet orange outline (#e05900) — no scale, brightness, title color-shift, overlay, medium badge, color swatch, click ripple, 3D tilt, or quick-preview modal. The Session-77 `fc-*` interaction layer was cut in the 2026-06-21 simplicity pass.

`archive.html` still carries that Session-77 interaction layer — flagged in IMPROVEMENTS.md as a candidate for the same consistency pass if/when Jeff asks.

---

## Recent session history

See `docs/sessions-archive.md` for the full session-by-session narrative log (sessions 28 through 78+). For the last few sessions' highlights, see `IMPROVEMENTS.md` § "Completed" or `git log --oneline -20`.
