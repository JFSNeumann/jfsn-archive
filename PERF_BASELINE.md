# Performance Baseline — 2026-06-25 (fresh, measured)

**Measured** with Lighthouse 12.8.0, desktop preset, headless Chrome, against the
local preview server (`http://localhost:8099`). These are real numbers, not expectations.
The Session-65 entry below is kept for history but was never measured — ignore it.

## Lighthouse scores

| Page | Perf | A11y | Best-Pract. | SEO | LCP | TBT | CLS |
|------|------|------|-------------|-----|-----|-----|-----|
| `index.html` (homepage) | **54** | 90 | 81 | 100 | 2.2s | **1,180ms** | 0 |
| `lost.html` (depth-hero pilot) | **97** | **100** | — | — | 1.3s | 50ms | 0 |

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

### Homepage accessibility findings (90 — 4 fixable issues)
1. Contrast ratio fails on some text/background pair (find + fix).
2. Heading elements not in sequentially-descending order (h1→h3 skip somewhere).
3. Visible text labels don't match accessible names (bracket-link `aria-label`
   mismatch — the visible "[ Explore → ]" text vs a differently-worded aria-label).
4. Touch targets below 44×44px (some controls too small/close on the homepage).

lost.html scores 100 on accessibility, so these are homepage-specific, not sitewide.

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
