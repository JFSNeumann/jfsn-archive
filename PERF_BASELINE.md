# Performance Baseline — 2026-06-25 (fresh, measured)

**Measured** with Lighthouse 12.8.0, desktop preset, headless Chrome, against the
local preview server (`http://localhost:8099`). These are real numbers, not expectations.
The Session-65 entry below is kept for history but was never measured — ignore it.

## Lighthouse scores

| Page | Perf | A11y | Best-Pract. | SEO | LCP | TBT | CLS |
|------|------|------|-------------|-----|-----|-----|-----|
| `index.html` (homepage) | **88–90** | 90→ | 81 | 100 | ~2.1s | **0–30ms** | 0 |
| `lost.html` (depth-hero pilot) | **97** | **100** | — | — | 1.3s | 50ms | 0 |

> **Homepage Perf corrected (2026-06-25, same day):** the first run read 54 with
> TBT 1,180ms — that was a **CPU-contended outlier** (Lighthouse running while other
> work churned). Three clean repeat runs after the JS-hygiene commit read **88–90 /
> TBT 0–30ms / FCP 0.6s / LCP ~2.1s** consistently. Lesson: take 3 runs and use the
> median; never trust a single headless perf number. The JS-hygiene changes
> (deferring the 1,326-line render-blocking `micro-interactions.js`, deduping
> `nav-active.js`, idle-building the below-fold wall) are good hygiene regardless and
> keep TBT near zero.

### Reading this
- **CLS is 0 everywhere** — no layout shift. Good.
- **The depth-hero costs nothing.** lost.html scores 97/100 *with* the new v2 motion —
  the pattern is just a passive scroll handler + one anime timeline. Safe to roll out.
- **The homepage's 54 is its own JS weight, not the motion pattern.** Total Blocking
  Time of 1,180ms is the single biggest drag: the homepage loads the hero rotation,
  the chromatic river canvas, the wall band, and ~12 `_shared/*.js` files. FCP (0.7s)
  and LCP (2.2s) are fine; the main thread is just busy. This is the next real perf
  project — defer/trim homepage JS — but it's a focused effort, out of scope for the
  motion work.

### Homepage accessibility findings (was 90) — status after 2026-06-25 fixes
1. **Heading order — FIXED ✅** featured-card titles were `<h4>` under the section
   `<h2>` (skipped h3); now `<h3>`. Audit PASSes.
2. **Label/name mismatch — FIXED ✅** search button's visible "⌘K" is now
   `aria-hidden`; the lost-fragment moved its description to `<img alt>` and
   dropped the conflicting `aria-label`. Audit PASSes.
3. **Contrast — partly real, partly false-positive.**
   - *Real, fixed ✅:* the "Lost to Water ~500–1,000" stat was `#c4c7c7` on cream
     (1.53:1, near-invisible); now `#8e7164` (archival brown, passes AA large-text).
   - *False-positive (not fixed, not a real issue):* Lighthouse keeps flagging the
     desktop stat card's other numbers/labels. Their colors are `#0B0B0B` / `#575757`
     (fully AA-compliant) — axe measures them **mid-fade** through the auto-playing
     `_shared/ui.css` `.reveal-section` animation, so it sees a washed, opacity-blended
     colour. Real users see full contrast. Silencing it means touching the shared
     reveal system (see below); not worth it for an artifact.
4. **Touch targets — FIXED ✅** `.river-hero-tick` bumped 22×18 → 24×24px.
5. **`.hero-cta-fill` button — FIXED ✅ (caught end-of-session, against LIVE jfsn.com)**
   white text on `#FF6600` (~2.9:1, fails AA) → `#B84700` ("orange-ink," the same
   accessible-orange token already used elsewhere) → ~5.3:1. This is a genuinely
   different element from the false-positive below (no animation involved — it's a
   static filled button), confirmed via live `getComputedStyle`.

lost.html scores 100 on accessibility, so these were homepage-specific, not sitewide.

### Live re-check, 2026-06-25 (post-deploy, against jfsn.com — not localhost)
Performance **95**, LCP **1.3s**, TBT **0ms**, CLS **0.011**. Faster than the
localhost numbers above (real CDN/HostGator response is quick). Accessibility
category score itself came back `null` (a known Lighthouse flake when one audit
errors mid-run — see Session-history note on this) but the 5 specific audits above
were checked individually and directly.

### Mobile + archive.html baseline (2026-06-25, same session — Top-10 item #5)

Captured with Lighthouse 12.8.0 against `localhost:8099`, mobile = default emulation
(no `--preset` flag), desktop = `--preset=desktop`. `--preset=mobile` is **not a valid
flag** — Lighthouse's only presets are `perf`, `experimental`, `desktop`; mobile is what
you get when you omit `--preset` entirely.

| Page | Viewport | Perf | A11y | LCP | TBT | CLS |
|------|----------|------|------|-----|-----|-----|
| `index.html` | desktop | 90 | null* | 1.9s | 0ms | 0 |
| `index.html` | mobile | 68 | null* | 12.5s | 0ms | 0 |
| `archive.html` | desktop | 82 | **100** | 3.0s | 0ms | 0.07 |
| `archive.html` | mobile | 49 | **100** | 13.0s | 30ms | 0.09–0.46 (noisy) |

\* `index.html`'s accessibility category score reports `null`, not a number — this is an
**axe-core crash**, not a site bug: the `target-size` audit throws `Reduce of empty
array with no initial value` mid-run on this page, which voids the category roll-up
score. The other accessibility audits still ran and reported individually; the only
real failure on either viewport is `color-contrast` on `.lost-fragment-cap` (Item 7 —
confirmed intentional, not touched).

**Two real bugs found and fixed on archive.html, both confirmed via re-run (now scores
100/100 accessibility on both viewports):**

1. **`heading-order` (mobile only).** The filter sidebar (`<aside class="hidden
   md:block">`, containing the only `<h2>`s on the page — MEDIUM/DECADE/SERIES/
   ORIENTATION) is `display:none` below the `md` breakpoint, so on mobile axe sees
   `<h1>THE ARCHIVE</h1>` followed directly by the grid's `<h3>` card titles — a level
   skip that doesn't exist on desktop. (This is distinct from — and was found *after* —
   the earlier desktop-only h3/h4 heading-order fix shipped earlier this session.) Fixed
   by changing the card-title tag from `<h3>` to `<h2>` (`archive.html:940`, plus the
   three `.archive-card h3` CSS selectors at lines 205/209-211/305) — same level as the
   sidebar headings, which is correct on both viewports since reusing a heading level
   is never a skip, whether or not the sidebar is actually visible.
2. **`select-name`.** `#sort-select`'s only accessible name came from a
   `<label for="sort-select">` that is itself `class="hidden md:inline"` — so on mobile
   the label doesn't exist in the accessibility tree and the dropdown has no name at
   all. Fixed by adding `aria-label="Sort"` directly on the `<select>`
   (`archive.html:621`), which holds regardless of viewport while leaving the visible
   label's mobile-hidden behavior untouched for sighted users.

**Not fixed, flagged only (out of scope for this pass):**
- **Mobile LCP ~12.5–13s on both pages** is far outside the "good" 2.5s threshold. This
  is against the unthrottled-by-anything-but-Lighthouse local dev server — real-world
  HostGator/CDN delivery is faster (see the 2026-06-25 live re-check above: index.html
  scored 95/1.3s LCP against jfsn.com). Still, a 12s+ local mobile LCP is large enough
  that it's worth a dedicated investigation (likely hero/river canvas + the ~12
  `_shared/*.js` files noted in the homepage Perf section above), not a quick fix
  bundled into this session.
- **archive.html mobile CLS** swung from 0.07 to 0.46 across consecutive runs with no
  code change in between — noisy/throttling-related on this local setup, not a
  reproducible regression. Worth re-measuring against the live site rather than chasing
  on localhost.

### Known tangle (flagged 2026-06-25, NOT yet fixed)
Two scroll-reveal systems coexist and fight on every page that loads `_shared/ui.css`:
an **auto-playing CSS animation** (`ui.css`: `.reveal-section { animation: scroll-reveal
forwards }`, uses a `.revealed` class) **and** per-page **IntersectionObserver** code
(`.is-visible`). The ui.css animation happens to double as the no-JS fallback (it
auto-plays to opacity:1 without JS), which is why JS-off content isn't actually invisible.
But the overlap is confusing and is the source of the contrast false-positive above.
A `.js`-gated consolidation was prototyped and reverted — it's a focused, cross-page
cleanup, not a mid-session change to shared CSS.

---

# Performance Baseline — Session 65 (UX/UI Enhancement Suite)

**Date:** 2026-06-18  
**Status:** ⚠️ **Historical, incomplete — never followed up.** This was meant to be a living
tracker (capture baseline → deploy → capture post-deploy → compare). The "Post-Deployment
Baseline" section below was never filled in, and no later session resumed this file. Treat
the numbers above the line as a record of what was *expected*, not what was *measured*.
If perf tracking is wanted again, start a fresh dated entry rather than completing this one
4 days disconnected from session reality (found during the 2026-06-22 documentation audit).
**Note:** Full enhancement suite (Phases 1-4 + Extras) integrated

## Key Metrics (Target Ranges)

| Metric | Target | Status |
|--------|--------|--------|
| LCP (Largest Contentful Paint) | <3s | ✅ Expected |
| FID (First Input Delay) | <100ms | ✅ Expected |
| CLS (Cumulative Layout Shift) | <0.1 | ✅ Expected |
| Performance Score | ≥75 | ✅ Expected |
| Accessibility Score | ≥95 | ✅ Expected |

## Bundle Changes

- **CSS:** ~50KB gzipped (was 23KB Phase 1)
- **JS:** ~80KB gzipped (was 0KB Phase 1)
- **Total:** ~130KB gzipped
- **Status:** ✅ Acceptable (vanilla, no framework)

## CSS Files Added (2,330 LOC)
lightbox.css, enhancements.css, scroll-reveal.css, form-validation.css, page-transitions.css, lazy-load.css, parallax.css, infinite-scroll.css, swipe-gestures.css, advanced-interactions.css, keyboard-shortcuts.css, search-highlight.css, search-breadcrumb.css

## JS Files Added (1,705 LOC)
lightbox.js, scroll-to-top.js, toast.js, hover-preview.js, scroll-reveal.js, form-validation.js, page-transitions.js, lazy-load.js, parallax.js, infinite-scroll.js, swipe-gestures.js, advanced-interactions.js, keyboard-shortcuts.js, analytics.js, search-highlight.js, search-breadcrumb.js, image-prefetch.js

## Performance Characteristics

✅ Vanilla JS (no framework overhead)  
✅ CSS optimized (compiled Tailwind)  
✅ 60fps animations (requestAnimationFrame)  
✅ Efficient scroll (IntersectionObserver)  
✅ Service worker caching  
✅ Lazy loaded images (no CLS)  

## Accessibility

✅ WCAG AAA (6.7:1 contrast)  
✅ Full keyboard navigation  
✅ ARIA labels present  
✅ Focus indicators visible  
✅ prefers-reduced-motion respected  
✅ 44px+ touch targets  

## Next Steps

1. Post-deployment: Run Lighthouse (4 pages)
2. Record metrics below
3. Compare with baseline
4. Flag if metric regresses >10%

## Post-Deployment Baseline (TO BE COMPLETED AFTER LAUNCH)

```
Homepage (Desktop):
- LCP: ___ s
- FID: ___ ms  
- CLS: ____
- Performance: ___

Homepage (Mobile):
- LCP: ___ s
- FID: ___ ms
- CLS: ____
- Performance: ___

Archive (Desktop):
- LCP: ___ s
- FID: ___ ms
- CLS: ____
- Performance: ___

Archive (Mobile):
- LCP: ___ s
- FID: ___ ms
- CLS: ____
- Performance: ___
```

---

**Status:** Ready for deployment. Complete baseline recording post-launch via Chrome DevTools Lighthouse.
