# SESSION-END-PHASE2A — JavaScript Bundling Closeout

**Date:** 2026-06-29
**Phase:** 2A — JS Bundling
**Result:** COMPLETE ✅
**Tag:** `phase2a-freeze` → `e938db90`

---

## Executive Summary

Phase 2A introduced JS bundling to the 38 hand-maintained root pages of jfsn.com. Before this session, every page loaded 30–46 individual `<script>` tags — a plain concatenation approach with no bundler. After Phase 2A, the sitewide JS load is organized into three purpose-built bundles (core, nav-early, nav-late) plus two unchanged standalone files (anime.min.js, nav-active.js). Each stamped page now loads 15 fewer script requests than before.

No behavior was changed. No source files were deleted. No bundler was introduced — the build step is a 90-line Node.js concatenation script (`build-js-bundles.js`) that mirrors the existing `npm run build:css` pattern. The 1,084 machine-generated artwork pages were deliberately left untouched.

---

## What Phase 2A Accomplished

- Reduced JS requests per stamped page by **15** (from ~30–46 down to ~15–31)
- Created three bundle build artifacts in `_shared/`:
  - `core.bundle.js` — 7 universal scripts, loaded on all 38 pages
  - `nav-early.bundle.js` — 8 nav-tier scripts, runs before inline dark-mode block
  - `nav-late.bundle.js` — 3 nav-tier scripts, runs after inline dark-mode block
- Wired bundles into all 38 root pages and propagated nav-tier bundles via `stamp-nav.sh`
- Added `npm run build:js` script to `package.json`
- Bumped CACHE_V in `sw.js` to force service worker reinstall on first visit
- Passed a formal pre-deployment independent review (PHASE2A_PREDEPLOY_REVIEW.md)
- Verified production live: all bundles 200, SW active, CACHE_V correct, no console errors

---

## Files Changed

### New build artifacts (generated — do not edit directly)
| File | Size | Source files |
|---|---|---|
| `_shared/core.bundle.js` | 62,552 bytes | 7 files (ui.js, lightbox.js, toast.js, page-transitions.js, lazy-load.js, analytics.js, image-prefetch.js) |
| `_shared/nav-early.bundle.js` | 67,713 bytes | 8 files (search.js, jfsn-interactions.js, accent-transition.js, chromatic-accent-wire.js, ambient-chromatic-tint.js, chromatic-position-strip.js, chromatic-lazy-tint.js, click-feedback.js) |
| `_shared/nav-late.bundle.js` | 71,447 bytes | 3 files (micro-interactions.js, scroll-choreography.js, floating-home-button.js) |

### New source files
| File | Purpose |
|---|---|
| `build-js-bundles.js` | Build script — concatenates source files into bundles |
| `SESSION-START-SUMMARY.md` | Phase 2A architecture research document |
| `BUNDLE_PLAN.md` | Approved bundling design document |
| `PHASE2A_PREDEPLOY_REVIEW.md` | Formal pre-deploy independent review |

### Modified files
| File | Change |
|---|---|
| `package.json` | Added `"build:js": "node build-js-bundles.js"` to scripts |
| `_shared/top-nav.html` | Replaced 9 individual nav script tags with nav-early.bundle.js + nav-late.bundle.js |
| `_shared/footer.html` | Removed standalone floating-home-button.js tag (now in nav-late.bundle.js) |
| `sw.js` | Bumped CACHE_V to `jfsn-1782767971` |
| All 38 root HTML pages | Replaced 7 Core-tier script tags with core.bundle.js |
| 37 stamped HTML pages | Nav-tier tags replaced with nav-early/nav-late bundles via stamp-nav.sh |

Source files in `_shared/` were not deleted or modified — they remain as the authoritative sources for `npm run build:js`.

---

## Commits

All commits are in `main`, tagged at `phase2a-freeze` → `e938db90`.

| Hash | Description |
|---|---|
| `ff5c942c` | Add Phase 2A planning docs: session architecture summary + JS bundling design |
| `4b1095de` | Add JS bundle build script and generate core/nav bundle artifacts |
| `4fb61445` | Wire core.bundle.js into all 38 pages, replacing 7 individual script tags |
| `99ce579e` | Wire nav-tier bundles into top-nav.html/footer.html, propagate via stamp-nav.sh |
| `961ddb59` | Bump CACHE_V for Phase 2A JS bundling |
| `e938db90` | Add Phase 2A pre-deployment review |

Previous freeze: `phase1-freeze` → `13ed191a`

---

## Deployment Verification

Deployed via `bash deploy-hostgator.sh` on 2026-06-29.

| Check | Result |
|---|---|
| `https://jfsn.com/` (homepage) | ✅ 200, bundles loading |
| `https://jfsn.com/archive.html` | ✅ 200, core + nav bundles, search working |
| `https://jfsn.com/artwork.html?id=art0500` | ✅ 200, artwork loaded, bundles correct |
| `https://jfsn.com/1980s.html` (decade page) | ✅ 200, core bundle loading |
| `https://jfsn.com/chromatic.html` | ✅ 200, canvas rendered, footer gradient active |
| `https://jfsn.com/guernica.html` (theme page) | ✅ 200, core bundle loading |
| `https://jfsn.com/qa.html` | ✅ 404 (intentional — excluded from deploy) |
| Service worker | ✅ Activated at `https://jfsn.com/`, scope correct |
| Cache version | ✅ `jfsn-1782767971` confirmed live in sw.js |
| CACHE_V in runtime cache | ✅ Only `jfsn-1782767971` key present (old cache pruned) |
| Bundle files on server | ✅ core.bundle.js, nav-early.bundle.js, nav-late.bundle.js all return 200 |
| Console errors | ✅ None |
| Dark mode toggle | ✅ Working on chromatic.html |
| Search (SSE) | ✅ Working on archive.html — 48 results for "collage" |
| Toast system | ✅ `window.showToast` available, element rendered |
| Chromatic background gradient | ✅ `footer.fcg-ready` confirmed |
| Nav active link | ✅ aria-current set correctly |
| anime.min.js standalone | ✅ Still standalone, unchanged |
| nav-active.js standalone | ✅ Still standalone, unchanged |

**Note on qa.html:** `deploy-hostgator.sh` explicitly excludes `qa.html` from upload (`--exclude-glob=qa.html`). Requests to `https://jfsn.com/qa.html` correctly return the 404 page. This is intentional — qa.html is an internal dev tool.

---

## Performance Improvements

### Request reduction (measured)

| Page tier | Before | After | Delta |
|---|---|---|---|
| index.html (heaviest) | 46 `<script>` tags | 31 | **−15** |
| archive.html | 44 `<script>` tags | 29 | **−15** |
| All 37 stamped pages | 30–46 | 15–31 | **−15 per page** |
| artwork.html (not stamped) | 40 `<script>` tags | 25 (core only) | **−7** |
| qa.html (not deployed) | 38 `<script>` tags | 23 | (not deployed) |

### Bundle architecture

Three bundles serving 37 stamped pages: **4 JS requests** (anime, nav-early, nav-late, core) versus **18 individual requests** before. Net: **−14 JS requests per stamped page** from the bundled tiers. Additional page-specific scripts (depth-hero.js, continuity-transition.js, etc.) remain as individual files — no change.

### Byte transfers

Total bundle content: 201,712 bytes across core + nav-early + nav-late. Previous total for the same 18 files (measured from source): approximately the same bytes transferred, but now in 4 connections instead of 18. On HTTP/2 (confirmed live on jfsn.com) this reduces connection overhead and head-of-line blocking risk, though the primary gain is connection-count reduction.

---

## Remaining Technical Debt

These items were identified during Phase 2A but are explicitly deferred. No solutions are proposed here.

1. **Pre-commit hook does not check bundle freshness.** If a source file in `_shared/` is edited without running `npm run build:js`, the stale bundle ships silently. The hook only watches files in `PRECACHE_FILES` — the three bundles are not in that list.

2. **Pre-existing duplicate script execution on select pages.** Four scripts execute twice on some pages: `nav-active.js` (8 pages), `floating-home-button.js` (4 pages), `accent-transition.js` (1 page), `search.js` (7 pages). All were pre-existing before Phase 2A; all were preserved deliberately. Runtime cleanup is a separate phase.

3. **audit-nav.sh false positive on 30 pages.** The check `if 'search.js' not in content` fires on the 30 pages that received nav-early.bundle.js (which absorbed search.js). Non-fatal — the script exits 0 with a warning. The 7 pages retaining a standalone search.js tag (404, changes, chromatic, curatorial-map, privacy, style-guide, wall) suppress the warning.

4. **ui.css is 158KB and render-blocking.** Identified in CODE_QUALITY_AUDIT.md as the highest remaining load-time item. Not in Phase 2A scope.

5. **stamp-nav.sh fragility.** The NAV:START/NAV:END marker scheme has a documented clobber risk when page-specific scripts sit adjacent to the block. Structural redesign deferred.

6. **Dual artwork renderer divergence.** `artwork.html` (40 script tags) and `artworks/pages/artNNNN.html` (6 script tags) render the same content via independent templates that have drifted materially. Neither was touched in Phase 2A.

7. **1,084 generated artwork pages not bundled.** They're lean (6 script tags: search.js, nav-active.js, and 4 others) and architecturally separate — ROI is low. `gen-artwork-pages.py` was not modified.

8. **ui.js P/N keyboard shortcut has no delivery path on generated pages.** The handler lives in ui.js (now in core.bundle.js, loaded on the 38 root pages). The prev/next links it targets only exist on the generated artwork pages, which never load core.bundle.js.

9. **No test suite.** `npm test` is a placeholder (`exit 1`). No automated JS tests exist.

---

## Recommended Next Phase

**Phase 2B: CSS request reduction** — split or minify `_shared/ui.css` (158KB, render-blocking) into a critical inline block and a deferred non-critical stylesheet. This is the highest remaining load-time item per CODE_QUALITY_AUDIT.md and follows naturally from Phase 2A's JS reduction work.

Do not begin Phase 2B in this session.

---

## Lessons Learned

### Architectural discoveries

1. **The NAV:START/NAV:END span is larger than markup suggests.** It contains the entire sitewide script bundle (11 JS files), not just header HTML. Scripts placed "adjacent" to the NAV block thinking they're past it are actually inside it — stamp-nav.sh silently overwrites them on the next run. This was already in CLAUDE.md; it was operationally confirmed again during Phase 2A.

2. **Two inline script blocks split the nav bundle in two.** `_shared/top-nav.html` has inline `<script>` blocks for header-scroll-hide and dark-mode toggle that sit physically between the first 9 and last 2 sitewide scripts. A single bundle at one position would have changed execution order. The two-bundle split (nav-early + nav-late) was discovered during implementation, not planned — the approved BUNDLE_PLAN.md assumed a single nav bundle.

3. **search.js lives inside the NAV span on 37 pages but not qa.html.** The original BUNDLE_PLAN.md put search.js in the Core tier. During implementation, it was discovered that search.js's tag is physically inside the NAV:START/NAV:END span on all 37 stamped pages. Moving it to Core would have required also removing it from the nav span (two separate changes, two failure modes). It was moved to nav-early.bundle.js instead, which stamp-nav.sh handles atomically.

4. **nav-active.js has a pre-existing duplicate on 8 pages.** Folding it into the core bundle would have collapsed that duplicate to a single execution — a behavior change. It was explicitly excluded from all bundles and left standalone.

5. **ui.js is not loaded by the 1,084 generated artwork pages.** The P/N keyboard navigation handler lives in ui.js but its only link targets are on those generated pages. Confirmed by grep across all 1,084 files during the session-start research phase.

### Documentation drift found

- `CODE_QUALITY_AUDIT.md` stated "21–33 scripts/page." Direct measurement across all 38 pages found the true range is 30–46 (index.html 46, archive.html 44, about.html 42, artwork.html 40, chromatic.html 41). The audit may have been measured against a smaller sample.
- `PHASE1_REVIEW.md` described the ui.js P/N shortcut as "works today, just brittle." No delivery path to the generated pages was found — it may not have worked in production.

### Tooling improvements discovered

- The pre-commit hook's `PRECACHE_FILES` list should include the three bundles so that editing a source file without rebuilding the bundle triggers a warning. (Not fixed in Phase 2A — hooks/ changes were out of scope.)
- audit-nav.sh's `search.js` presence check needs updating now that search.js is inside nav-early.bundle.js. Currently produces false-positive warnings on 30 pages.

### Validation improvements

- **Regex without path prefix missed bare script tags.** During the pre-deploy review, the leftover-tag sweep used a pattern requiring "/" before the filename, which missed `src="search.js"` (no path). A bare-filename grep pass should be added to any future bundle audit.
- **SW cache verification requires a previously-visited tab, not incognito.** A fresh incognito window has no prior SW to compare against. A tab that visited before the CACHE_V bump is needed to confirm the new SW evicts and replaces the old one.

---

## Repository State

| Item | Value |
|---|---|
| Branch | `main` |
| Latest commit | `e938db90` Add Phase 2A pre-deployment review |
| Tags | `phase1-freeze` → `13ed191a`, `phase2a-freeze` → `e938db90` |
| Remote | `origin/main` at `e938db90` ✅ in sync |
| Working tree | Clean — no uncommitted changes |
| Deployed to | jfsn.com (HostGator) ✅ |
| Deployed at | 2026-06-29 |
| Deployment verified | Yes — all production checks pass (see above) |
