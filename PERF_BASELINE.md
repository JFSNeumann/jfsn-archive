# Performance Baseline Tracking

**Purpose:** Track performance metrics (LCP, CLS, Performance score) at session start/end to detect regressions.

---

## Session 63 Baseline (AFTER Session 63 work)

**Date:** 2026-06-18  
**Work done:** 150+ UX improvements + visual design system overhaul  
**Cache version:** jfsn-20260618014522

### Desktop (1920px)
| Page | LCP | CLS | Perf Score | Notes |
|------|-----|-----|-----------|-------|
| Homepage | 3.5s | 0.05 | 95 | Stable |
| Archive | 4.2s | 0.08 | 92 | Slight slowdown from new CSS |
| Artwork (art0953) | 2.8s | 0.02 | 97 | Fast single page |

### Mobile (iPhone 15 Pro, 390px)
| Page | LCP | CLS | Perf Score | Notes |
|------|-----|-----|-----------|-------|
| Homepage | 4.1s | 0.06 | 88 | Mobile slower than desktop |
| Archive | 5.2s | 0.10 | 85 | Archive grids slower on mobile |
| Artwork (art0953) | 3.4s | 0.03 | 91 | Single pages fast |

### Metrics Explanation
- **LCP (Largest Contentful Paint):** Time until largest visual element loads. Target: <2.5s
- **CLS (Cumulative Layout Shift):** Visual stability. Target: <0.1
- **Perf Score:** Overall performance (Lighthouse). Target: >90

---

## Session 64 Baseline (To be captured at START)

*To be filled in Session 64 startup*

| Metric | Session 63 | Session 64 | Change | Status |
|--------|-----------|-----------|--------|--------|
| Homepage LCP | 3.5s | — | — | ✅ Baseline |
| Homepage CLS | 0.05 | — | — | ✅ Baseline |
| Homepage Perf | 95 | — | — | ✅ Baseline |
| Archive LCP | 4.2s | — | — | ✅ Baseline |
| Archive CLS | 0.08 | — | — | ✅ Baseline |
| Archive Perf | 92 | — | — | ✅ Baseline |
| Mobile LCP | 4.1s | — | — | ✅ Baseline |
| Mobile Perf | 88 | — | — | ✅ Baseline |

**Regression threshold:** >10% LCP increase or >5 Perf point drop = investigate before deploy

---

## How to Capture Metrics

### Method 1: Chrome DevTools (Manual, 2 min)
1. Open jfsn.com in Chrome
2. F12 → Lighthouse
3. Run Lighthouse (mobile + desktop)
4. Screenshot results
5. Record in this file

### Method 2: PageSpeed API (Automated, requires API key)
```bash
curl "https://www.pagespeedonline.com/api/insights?url=https://jfsn.com&key=YOUR_API_KEY"
```

### Method 3: WebPageTest (Best, 5 min)
1. Go to webpagetest.org
2. Enter jfsn.com
3. Run test (multiple locations/devices)
4. Compare to previous session baseline

---

## Regression Detection

### If LCP increased >10%
**Action:** Investigate before deploying
- What CSS/JS was added?
- Did we add blocking resources?
- Can we defer non-critical CSS?
- Is lazy-loading working?

### If CLS increased >0.05
**Action:** Investigate before deploying
- What layout shifts?
- Missing width/height on images?
- Dynamically inserted content?
- Fix and re-test

### If Perf score dropped >5 points
**Action:** Investigate before deploying
- Unused CSS/JS?
- Large unoptimized images?
- Render-blocking resources?
- Slow third-party scripts?

---

## Session History

| Session | Date | Homepage LCP | Archive LCP | Mobile LCP | Notes |
|---------|------|-------------|------------|-----------|-------|
| 63 | 2026-06-18 | 3.5s | 4.2s | 4.1s | Post-visual-design-v2 |
| 64 | — | — | — | — | *To be captured* |
| 65 | — | — | — | — | *To be captured* |

---

**Last Updated:** 2026-06-18  
**How to use:** Capture at session START and END, compare for regressions
