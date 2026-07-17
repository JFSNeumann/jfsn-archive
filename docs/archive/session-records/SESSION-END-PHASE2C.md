# SESSION-END-PHASE2C — Dead CSS Removal Closeout

**Date:** 2026-06-30
**Phase:** 2C — CSS Architecture Cleanup (Targeted Dead Code Removal)
**Result:** COMPLETE ✅
**Commits:** `90075767` (code + SW), `06f3c6a0` (docs)
**Tag:** `phase2c-freeze` (recommended — see below)

---

## Executive Summary

Phase 2C removed 1,943 lines of confirmed-dead prototype CSS from `_shared/ui.css`, reducing the file from 6,958 lines (158KB raw / 28.3KB gzip) to 5,015 lines (118KB raw / 22.9KB gzip) — a 19.1% reduction in gzip size with zero rendering changes to any live page.

The original Phase 2C plan was CSS splitting (critical/non-critical). An architecture investigation (`CSS_ARCHITECTURE_AUDIT.md`) determined this was the wrong approach: the file is only 28KB gzipped, the actual LCP bottleneck is a 125KB hero image, and splitting would reintroduce FOUC risks without addressing the real bottleneck. The plan was replaced with targeted dead-code removal — a lower-risk approach with higher long-term maintainability value.

A notable secondary fix: the V2 design-system export had silently introduced `grid-entrance-slow` on `.thumb`, which (a) overrode the Phase 3 stagger animation via CSS cascade order and (b) bypassed the `prefers-reduced-motion` accessibility guard. Both are now restored.

An independent post-implementation review found 4 additional orphaned selectors (dark-mode and responsive variants missed in the initial pass) and a section numbering gap (1–4, 6, 7, 11–13 → renumbered 1–9). All fixed before deployment.

---

## What Changed

### `_shared/ui.css`

**Removed (1,943 net lines):**

| Block | Description | Original lines |
|---|---|---|
| Zone E (entire) | Phase 9–12: Search Suggestions, Quick Preview Modal, Stats Dashboard, Timeline View, Canvas Visualization, Audio Player, Oral History, Story Chapters, Transcription, Waveform, Fullscreen Gallery, Keyboard Shortcuts Dialog, User Preferences Panel | 4581–6274 |
| 2a | `.metadata-label`, `.page-eyebrow` | 6351–6362 |
| 2b | `.page-section` + `::before` | 6392–6406 |
| 2c | Gallery image/backdrop/featured frames | 6459–6475 |
| 2d | Shadows & Depth section (`.card`, `.stat-card`, `.modal-backdrop`) | 6477–6502 |
| 2e | Filter section headers + medium sub-selectors | 6581–6614 |
| 2f | Artwork museum aesthetic (9 selectors) | 6625–6705 |
| 2g | `body.focus-mode` rules | 6707–6731 |
| 2h | Duplicate `.thumb` animation (`grid-entrance-slow`) + `.card:hover` transform | 6749–6770 |
| 2i–2k | `.card-bg`, `.scroll-anchor`, `.code-block` | 6774–6860 |
| R1–R4 | Orphaned dark-mode/responsive variants found in review | scattered |

**Added (17 lines annotation + 0 net from renumber):**
- Architectural comment on `.thumb` animation explaining the anomaly and Phase 3 stagger restoration
- Architectural comment on bare `h1/h2/h3` rules explaining load-bearing role against Tailwind Preflight
- V2 section numbers renumbered 1–9 (sequential, no gaps)

**Final metrics:**

| Metric | Before | After | Change |
|---|---|---|---|
| Lines | 6,958 | 5,015 | −1,943 |
| Raw bytes | 158,033 | 118,522 | −39,511 (−25.0%) |
| Gzipped bytes | 28,314 | 22,913 | −5,401 (−19.1%) |

### `sw.js`

- `CACHE_V`: `jfsn-1782782983` → `jfsn-1782824794`

### New documentation files

- `CSS_ARCHITECTURE_AUDIT.md` — investigation report; inventory by zone; six validation questions; architectural recommendation
- `PHASE2C-REMOVAL-MAP.md` — permanent record of every removed selector with evidence methodology, structural anomaly findings, validation results, review-pass corrections, and deployment recommendation

---

## Files Changed

| File | Change |
|---|---|
| `_shared/ui.css` | −1,943 net lines; +2 architectural annotation comments |
| `sw.js` | CACHE_V: `jfsn-1782782983` → `jfsn-1782824794` |
| `CSS_ARCHITECTURE_AUDIT.md` | New — investigation report |
| `PHASE2C-REMOVAL-MAP.md` | New — permanent removal record |
| `SESSION-START.md` | Updated for session context |

**Not changed:** No HTML pages. No generated artwork pages. No JS files. No build pipeline. No Tailwind. No other shared assets.

---

## Structural Anomalies Resolved

### `.thumb` animation cascade override (fixed)

The V2 design-system export added `grid-entrance-slow` on `.thumb` at original line 6750, which:
1. Overrode the Phase 3 `grid-entrance` stagger via same-specificity cascade (later wins)
2. Bypassed the `prefers-reduced-motion: reduce` guard at line 3474 (the bare rule loaded after the media block)

Both are fixed. The Phase 3 `grid-entrance` animation with `--stagger-index` stagger is now the effective animation. The reduced-motion guard correctly suppresses it.

Note: `archive.html` has its own inline `<style>` block with `grid-fade-in` that overrides ui.css for the archive page specifically — pre-existing, intentional, unaffected.

### Bare `h1/h2/h3` rules (documented, retained)

V2 bare element rules are load-bearing: Tailwind Preflight resets `h1–h6` to `font-size: inherit; font-weight: inherit`. The naked `<h3>` elements in `index.html`'s "Where to Begin" section rely on the V2 rule to receive Playfair Display at 22px. Retained with documentation comment.

---

## Validation Summary

All validation performed against local preview server before deployment.

| Check | Result |
|---|---|
| Console errors (homepage, archive, artwork, about) | 0 errors |
| `index.html` h3 "Where to Begin" headings | Playfair Display, 22px ✅ |
| `about.html` h1 | Playfair Display ✅ |
| `collage.html` `.medium-page__title` h1 | Playfair Display ✅ |
| Artwork page (art0001.html) h1 | Playfair Display, 28px ✅ |
| Artwork page related works section | Renders ✅ |
| Archive page grid + filters | Renders ✅ |
| Dark mode (`html.dark`) | Correct ✅ |
| Mobile nav drawer | Opens, all items visible ✅ |
| Search / ⌘K palette | Opens correctly ✅ |
| `prefers-reduced-motion` guards on `.thumb` | Active from 3 sources ✅ |
| Brace balance | Final depth 0 ✅ |
| Generated artwork pages (1,084) | Zero hits for any removed selector ✅ |

---

## Production Verification

Deployed 2026-06-30 via `bash deploy-hostgator.sh`.

| Check | Result |
|---|---|
| Live `sw.js` CACHE_V | `jfsn-1782824794` ✅ |
| Live `ui.css` line count | 5,015 ✅ |
| Live `ui.css` byte count | 118,522 ✅ |
| Key pages HTTP status | 200 (/, /archive.html, /_shared/ui.css) ✅ |
| Removed selectors absent from live CSS | ✅ (false positive was documentation comment text) |
| Retained selectors present in live CSS | ✅ |
| Section numbering sequential (1–9) | ✅ |

### Service worker update behavior

**`sw.js` cache headers:** `no-cache, no-store, must-revalidate` — browsers always fetch the live sw.js on page load.

**First-time visitors:**
- No SW installed; page served directly from origin
- SW registers, caches resources under new `CACHE_V = jfsn-1782824794`
- Receives new `ui.css` from the origin

**Returning visitors:**
- Browser fetches fresh `sw.js` (no-cache headers bypass browser disk cache)
- SW detects CACHE_V change (`jfsn-1782782983` ≠ `jfsn-1782824794`)
- Old cache deleted; new cache created
- CSS/JS fetched via `fetch(request, {cache:'reload'})` — this bypasses the server-set 30-day HTTP cache (`max-age=2592000`) on `ui.css` and all JS files
- New `ui.css` (118,522 bytes) served to returning visitor on next page load

The `{cache:'reload'}` mechanism (commits `c343a111`, `52d305ae`) is confirmed active on the live sw.js and is what ensures returning visitors cannot be stranded on a 30-day-cached old version of CSS.

---

## Known Pre-existing Issues (not introduced by Phase 2C)

These were discovered during the review but predate this change:

- `@keyframes color-transition` (ui.css line 916) — defined, never referenced by any `animation` property. Harmless dead keyframe. Candidate for future cleanup.
- `@keyframes underline-draw` defined twice (lines 857, 1193). Duplicate; last definition wins; no visual effect.
- `@keyframes chip-pulse` defined twice (lines 982, 3499). Same.
- `html.dark .thumb__link img` dark glow rule — present and correctly specified in CSS; cascade investigation suggests a higher-specificity rule may be winning at runtime in some contexts. Pre-existing behavior, not introduced by Phase 2C.
- Phase 1–8 CSS for `.filter-section-header` and related selectors still in file (lines 3828+); the archive page was rebuilt with Tailwind classes and no longer uses these. Harmless; candidate for a future Phase 1–8 audit pass.

---

## Recommended Freeze Tag

```bash
git tag phase2c-freeze
git push origin phase2c-freeze
```

This marks the stable, deployed, independently-reviewed state of the repository after Phase 2C completion.

---

## What's Next

**Do not begin Phase 3 without a new session.**

Remaining engineering phases (from `IMPROVEMENTS.md`):
- **Phase 3:** Bundle optimization (further JS consolidation)
- **Phase 4:** `ui.css` structural reorganization (now more tractable at 5,015 lines)
- **Retire `stamp-nav.sh`** — fragility documented; replacement design pending

The pre-existing dead-code items noted above (orphaned keyframes, Phase 1–8 dead selectors) would fit naturally into Phase 4.
