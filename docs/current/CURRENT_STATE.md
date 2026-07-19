# JFSN Current State
**Last updated:** 2026-07-19

This file describes what's currently true about the site. For ranked work, see `IMPROVEMENTS.md`. For the design brief and architecture, see `CLAUDE.md`. For the session-by-session historical log, see `docs/sessions-archive.md` or `git log`.

---

## 2026-07-19 — Archive interaction polish, sitewide scroll cues, room-veil bug fix, homepage wing crossfade, docs accuracy sweep ✅

**Archive.html card + controls polish:** shadow depth increased (`0 8px 24px` → `0 12px 32px rgba(255,102,0,.16)`), touch `:active` press feedback added, timing standardized to `.4s`/`.3s`, room-nav switched to horizontal layout. Search/sort/chips/Load More all got matching hover/focus/active states (previously chips were the only polished control).

**Room-veil bug fixed:** browser back-button navigation from any room page could leave the page-transition blackout veil stuck at `opacity:1`, silently blocking clicks until a manual refresh. Root cause: the `pageshow`/bfcache handler removed the `.on` class but never reset the inline `opacity`/`pointer-events` that class had set. Fixed on `index.html` + 8 room pages.

**Scroll cue added to 7 pages:** `flooded-wing.html` had one; `guernica-passage`, `the-studio`, `hall-of-openings`, `about`, `working-history`, `stories` did not. Same pattern now everywhere: 28px `↓`, pinned `bottom:6vh`, fades past 40px scroll.

**Fixed zero/near-zero top padding after hero on 6 pages** — body text was sitting directly against the hero photo on `stories`, `the-studio`, `guernica-passage`, `working-history`, `hall-of-openings`, `flooded-wing`. Standardized to `8vh` (the value `about.html` already had correct).

**Homepage (`index.html`):** "Museum" highlight-box now covers the full word (was only "Muse"). The two desktop wing images now crossfade through different works from `catalog-home.json` every ~11s (new — see DESIGN-SYSTEM.md § "Motion"), instead of being static mirrored/darkened copies of the center poster.

**Fixed a live `/api.html` 404** — `archive.html` linked to a docs page deleted in the 2026-07-16 pruning; pointed the sentence at GitHub instead rather than resurrecting a deliberately-cut page.

**Docs accuracy sweep across `docs/current/`:** `DESIGN-SYSTEM.md`, `STITCH.md`, `SESSION_PROMPT.md`, `CONSERVATION-CHECKLIST.md`, `WORKFLOW.md`, and this file were all found describing a retired architecture — a light "bone-white"/Inter theme, a `_shared/top-nav.html` + `stamp-nav.sh` nav-stamping system, decade pages, and several other deleted pages (`api.html`, `qa.html`, `curate.html`) — none of which match the live site (dark theme, fully inline per-page CSS/JS, 14 core pages). All rewritten against verified page source. See each file's own changelog for specifics.

---

## 2026-07-16 (later) — Homepage LCP fix, room-page polish, backup verification ✅

**Homepage LCP: 5.1s → 1.9s (Lighthouse score 81 → 100).** The hero image (`medium/art1010.avif`, 314KB) was fetched 3× eagerly — once as the LCP element (`fetchpriority="high"`) and twice more as decorative desktop "wing" flankers (`fetchpriority="low"`, same file), all competing for bandwidth. Found pre-built, unused LCP-optimized assets already sitting in `artworks/full/` (`art1010-hero-lcp.avif` / `-m.avif`, ~14x smaller) from an earlier perf pass that never got wired in. Wired them into `index.html` via `srcset`/`sizes` on the hero image and switched the two wing images to `loading="lazy"` + the smaller full-size variant. Verified visually (no quality loss) and via 3-run Lighthouse median before/after.

**Room-page polish:**
- Hero highlight-box color unified to orange (`var(--accent)`) across all 5 room pages — `flooded-wing.html`, `guernica-passage.html`, and `hall-of-openings.html` had drifted to black during a prior session while `about.html`/`the-studio.html` stayed orange.
- `archive.html`: tightened the room-links nav padding (8vh→4vh) so the search/filter bar surfaces on the first screen instead of requiring a scroll.
- `flooded-wing.html`: hero image repositioning synced between `#door` and `#door::before` after Jeff resized the source image externally.

**Backup verification — both LaunchAgents had silently unloaded from launchd.** `com.jfsn.backup` (JEFFS-4TB, 11pm) and `com.jfsn.cloud-backup` (B2, 9pm) hadn't fired — successful or failed — since 2026-07-08, an 8-day gap, because neither showed up in `launchctl list`. Re-loaded both and kickstarted immediate runs: JEFFS-4TB completed clean (13,215/13,215 files matched, `diskutil verifyVolume` clean, manual write/delete test passed — the earlier "I/O error" state from the 2026-07-01/07-06 reports appears resolved, possibly was an FDA-context issue like the B2 one); B2 completed clean (55 stale files deleted, mirroring local deletions from recent page cleanup). **Open question:** what unloaded the LaunchAgents in the first place (reboot, logout, manual unload) is unknown — worth checking Console.app around 2026-07-08/09 if it happens again.

---

## 2026-07-16 — Permanent Museum Approved; hero implementation complete; documentation cleanup ✅

**Latest commit:** `d4ad53b6` (markdown cleanup + orphan files)

**Museum approval (2026-07-15):** Comprehensive independent curatorial review complete. JFSN Archive approved for permanent preservation without revision required. Five main rooms certified (Current, Guernica Passage, Flooded Wing, Hall of Openings, Studio). Museum earns permanence through honest treatment of loss, clear visitor responsibility, and timeless core understanding. See `project_permanent_museum_approval.md` in MEMORY.md.

**Hero implementation (2026-07-14 to 2026-07-16):**
- **The Studio hero** (2026-07-16): art0241 background (15% opacity), NO parallax, contained to hero visual area only. Subtitle fade-in animation retained.
- **Guernica Passage hero** (2026-07-16): guernica-hero.avif background (15% opacity), parallax scroll (2.5x speed), subtitle fade-in animation. Deployed to `/artworks/guernica-hero.avif` (root, not subdirectory).
- **Hall of Openings hero** (2026-07-14): Border Grammar interaction redesign (threshold passage) as sole interaction language for doors. See `docs/archive/2026/BORDER-GRAMMAR-ANALYSIS.md` for full rationale.
- **Flooded Wing hero** (2026-07-14): water damage image with fade-to-black + text animations.

**Documentation cleanup (2026-07-16):**
- Renamed `docs/stewardship/REPOSITORY-VERIFICATION-STANDARD.md` → `IMPLEMENTATION-VERIFICATION-STANDARD.md` (eliminated naming confusion with root operational verification doc)
- Archived 8 old session closeout docs (Phase 1-2C, Conservation, Experience Studio, Hero Prep) to `docs/archive/2026/session-records/` for cleaner root structure
- Deleted orphan files: `me-white.png`, `_shared/drone-survey.js`, `hall-of-openings-prototype.html`, `hero-image-candidates.html`, `archive-v1/` legacy copies

---

## 2026-07-01 — Creative Brief 001 prototype committed (not yet deployed)

**Commit:** `81e27365`

**Bug fixed:** All `.reveal-section` elements were permanently invisible to JS users. `micro-interactions.js` (deleted Session B, H1) was the sole IntersectionObserver adding `.revealed`. IntersectionObserver restored to `_shared/ui.js` — its logical home as companion to `ui.css`'s `.reveal-section` system. `core.bundle.js` rebuilt.

**Brief 001 — Crossing the Threshold:** The "Where to Begin" heading now lands before its four explore cards. Removed `reveal-section` from the heading wrapper; bumped card animation delays from 0.1s/0.2s to 0.4s/0.5s. The heading is ground. The cards are figure. The room introduces itself before it fills.

**Status:** Committed, not deployed. The prototype will be experienced in context before any further iteration or deployment decision.

---

## 2026-07-01 — Engineering phase complete. Project transitions to Creative Brief–driven phase.

The engineering roadmap is complete. All high- and medium-priority items from `docs/archive/2026/ENGINEERING_ROADMAP.md` have been resolved. The remaining open item (R8: image fade-in consolidation) is intentionally deferred — it carries no active correctness risk and no Creative Brief is blocked by it today. It should be resolved immediately before the first Brief that materially changes image-loading behavior.

**From this point forward, engineering work is initiated only when:**
- it supports an approved Creative Brief,
- fixes a defect,
- improves reliability, or
- materially reduces unnecessary complexity.

Future sessions begin with Creative Briefs, not engineering tasks.

---

## 2026-07-01 — Session B: JS cleanup, CSS cleanup, catalog optimization, smoke test ✅ (committed, deployed)

**Latest commit:** `1fc1ab8e` (M6 smoke test) → session-end `c7966edb`

| Item | What | Result |
|------|------|--------|
| **R3** | Removed `setupImageParallax()` from `artwork-animations.js` — was applying `translateY` directly to `#work-image`, violating the artwork-plane hard rail | ✅ |
| **R4** | Consolidated two toast systems — redirected `toast.js`'s 2 call sites in `lightbox.js` to `window.showToast`, deleted `toast.js`. `core.bundle.js` −3.7KB | ✅ |
| **R5** | Removed `senior-ux-signposting.js` from `artwork.html`/`archive.html`/`series.html` — both signposting systems were rendering simultaneously; breadcrumb is the single "where am I" system | ✅ |
| **R6** | Deleted `_shared/image-prefetch.js` — inert on all templates (no `rel=next/prev` links, no `window.allWorks`, no `?id=` param). Removed from `core.bundle.js` | ✅ |
| **R7** | Fixed stale comments in `build-js-bundles.js` referencing deleted `micro-interactions.js` | ✅ |
| **R10** | Deleted `old-site/` (15MB) — was already untracked, never in git | ✅ |
| **R11** | Removed dead `if (pass.isHover && pass.tile)` block in `drone-survey.js` (branch always false, `containerRect` undefined in scope); removed `decadePalettes` + `originalDrawFunction` from `chromatic-animations.js` | ✅ |
| **M2** | Dead CSS removed from `ui.css`: orphaned `@keyframes color-transition`, duplicate `@keyframes underline-draw`, renamed first `chip-pulse` to `chip-pulse-remove` (restores intended behavior), dead `.filter-section-header` block, dead `img.loaded` rule. CSS rebuilt | ✅ |
| **M3** | Removed `description` field from `catalog-lite.json` — search.js never indexed it; no consumer reads it from lite. **152KB → 66KB gzipped (57% reduction)** on every search overlay open | ✅ |
| **M4** | Removed redundant standalone `search.js` tags from 7 root pages — `search.js` is bundled into `nav-early.bundle.js` and was loading twice. Fixed `audit-nav.sh` false "missing search.js" warnings | ✅ |
| **M6** | Deploy smoke test expanded from 1 check to 10 — homepage, archive, artwork, generated artwork page, catalog-lite.json, core.bundle.js, sw.js, site.min.css, 404, about. Each verifies HTTP 200 + content pattern | ✅ |

**Files deleted this session:** `_shared/image-prefetch.js`, `_shared/toast.js`, `_shared/senior-ux-signposting.js` (parallax function only removed from `artwork-animations.js`, file kept)

**Net JS removed from bundles:** ~10KB. Plus `old-site/` 15MB local cleanup.

**Deferred (intentional):**
- **R8** — Consolidate 4–5 image fade-in-on-load systems (`ui.js` ×2, `lazy-load.js`, `image-fade-load.js`, CSS). No active correctness risk; no Brief blocked today. Trigger: resolve before the first Creative Brief that materially changes image-loading behavior.
- **R9** — Shared observer-dispatch utility for the chromatic family. Lower priority; defer until the animation layer is otherwise being touched.

---

## 2026-07-01 — Pending user actions (not engineering — requires physical action)

- **macOS Full Disk Access for `/bin/bash`** — System Settings → Privacy & Security → Full Disk Access → add `/bin/bash`. Fixes B2 cloud backup LaunchAgent and rsync LaunchAgent (both silently failing without it).
- **JEFFS-4TB corrupted APFS container superblock** — Disk Utility → JEFFS-4TB → First Aid. If First Aid fails, reformat and repopulate with `bash backup.sh`. B2 is the only verified off-site backup until this is resolved.
- **`_shared/ui.css.phase2c-backup`** — untracked leftover from Phase 2C. Safe to delete: `rm _shared/ui.css.phase2c-backup`.

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

See `docs/archive/2026/session-records/SESSION-END-PHASE2C.md`, `docs/archive/2026/CSS_ARCHITECTURE_AUDIT.md`, and `docs/archive/2026/PHASE2C-REMOVAL-MAP.md` for full detail.

---

## 2026-06-29 — Phase 2 (FOUC): Dark-mode fix on 1,084 artwork pages ✅ (committed, deployed, frozen)

**Tag:** `phase2-fouc-freeze` → `0f2d1fbe`

**What changed:**
- THEME_INIT head-blocking script added to all 1,084 generated artwork pages in `artworks/pages/`
- One line added to `gen-artwork-pages.py` template — all future regeners inherit the fix automatically
- `CACHE_V` bumped to `jfsn-1782782983` and deployed to jfsn.com
- Every page on jfsn.com now prevents dark-mode FOUC (Phase 1 covered the 38 root pages; this closes the gap)

See `docs/archive/2026/session-records/SESSION-END-PHASE2-FOUC.md` and `docs/archive/2026/PHASE2-FOUC-PREDEPLOY-REVIEW.md` for full detail.

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

See `docs/archive/2026/session-records/SESSION-END-PHASE2A.md` for full detail.

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

## Creative Phase Status

### What we learned from Creative Brief 001

The most important lesson is methodological, not visual: the philosophy comes before the implementation. Creative Brief 001 began with a philosophical exploration — museum thresholds, antechambers, stillness, obligation, permission — and that exploration produced both the 7 Canonical Experience Principles and the specific insight that shaped the change. Without that groundwork, the implementation would have been one of three reasonable ideas rather than one obvious one.

The insight itself: when heading and content reveal simultaneously, the heading is subordinate to its own contents. Separating them — making the heading ground and the cards figure — creates the experience of a room that introduces itself. The implementation required three HTML attribute changes.

The discipline of asking "what is the single highest-value improvement" before touching anything, and then building the smallest possible thing, is the right method for this phase. It should govern every future Brief.

### What remains uncertain

Whether the prototype earns its place in the actual experience — as opposed to in a dev browser. The effect is subtle. On a slow scroll it is legible as intentional; on a fast scroll it is invisible. It has not been seen at real viewport sizes in a real browsing context. The remaining question is whether it creates a moment of stillness or a moment of waiting. Those are not the same thing.

The card delays (0.4s/0.5s) may need adjustment once experienced in context. They may be right, slightly long, or (less likely) too short. This is a judgment call that requires observation, not analysis.

### Why we are pausing before further refinement

The prototype has been built and committed. The correct next step is to experience it, not to iterate on it. Continued iteration from within a dev environment risks optimizing for a context that doesn't resemble how real visitors experience the site. The philosophy requires living with the work before deciding whether it earns its place.

The possible next-session outcomes are intentionally left open:
- Continue refining Brief 001 (delays, scope to other sections)
- Accept it as complete and deploy
- Remove it (a valid outcome — the Experience Test is a gate, not a promise)
- Move on to the Artwork page

All four outcomes are consistent with the Experience Philosophy. The goal is not to accumulate refinements. The goal is to serve the work.

---

## Site is live at
- **jfsn.com** — cPanel/HostGator, the only host. Netlify (secondary mirror) and the Companion AI chat feature were removed 2026-06-22.

## Archive stats
- 1,084 works cataloged, 0 errors
- Covers 1974–present (5 decades)

## Backup
Four redundant stores, listed in update order at end-session:
1. GitHub (`origin/main`) — latest commit: `d4ad53b6` (markdown cleanup + orphan file deletion, 2026-07-16); tags `phase2a-freeze`, `phase2-fouc-freeze`, `phase2c-freeze` pushed
2. Local Mac (working tree)
3. JEFFS-4TB external drive (rsync, nightly LaunchAgent at 11 PM, `scripts/backup.sh`)
4. Backblaze B2 cloud (LaunchAgent at 9 PM nightly, `scripts/cloud-backup.sh`)

**This has been a recurring failure point, not a one-time fix — re-verify both every session, not just once.** Both LaunchAgents were found fully unloaded from launchd twice (2026-07-06, 2026-07-16). Then, on 2026-07-17 and 2026-07-18, both plists were separately found to have the identical stale-script-path bug — discovered and fixed one job at a time on consecutive days (`cloud-backup` fixed 07-17, `backup` fixed 07-18) rather than both at once, because a clean `launchctl list` reading for one job doesn't confirm the sibling job is sound. Verified directly (not from memory) 2026-07-19: `launchctl list | grep jfsn` shows both `com.jfsn.backup` and `com.jfsn.cloud-backup` loaded, and both plists' `ProgramArguments` point at the correct current paths (`scripts/backup.sh`, `scripts/cloud-backup.sh`). **Action item unchanged:** check `launchctl list | grep jfsn` every session start — see `SESSION_START_PROCEDURES.md`.

---

## 🔴 Critical open items

**FTP password publicly exposed, still active, cannot be rotated.** cPanel/HostGator account access is unavailable and Pure-FTPd has no self-service password change (proven by live test 2026-06-12). Do NOT chase cPanel rotation. Impact is bounded: the archive is replicated 4× and only live-site defacement is at risk. Rotation is **ON HOLD by Jeff** — every public copy of the credential is now removed or blocked (see `docs/archive/2026/CREDENTIAL-EXPOSURE-REPORT.md`, session 34). **Domain note (corrected 2026-06-16):** Jeff owns and pays for the jfsn.com Gandi account directly (invoice confirmed) — there is no friend in the loop, and migrating off HostGator does not require contacting anyone else. Authoritative record: `docs/archive/2026/FINAL-DOMAIN-AND-PRESERVATION-HANDOFF.md` §5 (closed).

---

## Standing known issues

- **`sw.js` CACHE_V auto-bump is partial** — `build_catalog.py` only bumps `CACHE_V` when catalog content changes. Manual bump required after HTML/CSS/JS edits that don't trigger a catalog rebuild. Check `git diff sw.js` before deploy.
- **There is no shared nav/footer partial and no `stamp-nav.sh` anymore** (both retired; see `DESIGN-SYSTEM.md` § "Architecture"). Every page's header/footer is edited directly, in that page. The two bullets that used to live here — an `index.html`-specific footer-stamping gap and a decade-pages exception — described that retired system; decade pages themselves were also deleted in the 2026-07-16 pruning to 14 core pages, so both bullets were removed rather than corrected.
- **`about-portrait.jpg`** — only JPEG remaining in the asset pipeline; all artworks are AVIF. Low priority.
- **No physical dimensions in catalog** — `build_dims.py` reads pixel dimensions (for masonry layout). Physical artwork dimensions (inches/cm) require Jeff to measure surviving works; no tooling exists.
- **Grid/search/favorites year labels show bare decade** — only artwork detail pages + API carry the "(est.)" honesty label. See IMPROVEMENTS.md if this should be extended.

---

## What's on the homepage (current as of 2026-07-19 — verified against live source, supersedes the 2026-06-21 "Selected Works grid" description below)

**index.html is "the poster," not a grid.** That description is fully superseded — the CSS-Columns Selected Works masonry it describes doesn't exist anywhere in the current homepage (verified: zero matches for "Selected Works" or "CSS Columns" in index.html). The homepage was rebuilt as a fixed, chrome-free single screen sometime around 2026-07-12/13 ("v2: THE MUSEUM THAT NEVER EXISTED," promoted to root): title, creed, one artwork poster, the artist's signature, and the five-room door nav — identical every visit, no header/nav bar at all. On desktop (≥1200px) the poster gained two flanking "wing" images that crossfade through different featured works (added 2026-07-19); everything else is still static.

`archive.html` does **not** carry the old Session-77 `fc-*` interaction layer either (verified: zero `fc-` matches) — its card grid was rewritten with its own hover language (border/shadow/lift + staggered metadata reveal, polished 2026-07-18/19) unrelated to that older system. Whatever removed the `fc-*` classes wasn't logged here; don't trust the IMPROVEMENTS.md flag calling this a pending consistency pass — it's done, just not noted anywhere until now.

---

## Recent session history

See `docs/sessions-archive.md` for the full session-by-session narrative log (sessions 28 through 78+). For the last few sessions' highlights, see `IMPROVEMENTS.md` § "Completed" or `git log --oneline -20`.
