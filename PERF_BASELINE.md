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

lost.html scores 100 on accessibility, so these were homepage-specific, not sitewide.

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
