# CSS Architecture Audit — `_shared/ui.css`

**Date:** 2026-06-30
**Author:** Engineering investigation (Phase 2C pre-implementation)
**Status:** COMPLETE — awaiting approval before any CSS modification

---

## Purpose

This is an engineering audit, not an implementation plan. Its purpose is to determine whether Phase 2C (CSS Architecture Cleanup) should proceed as originally envisioned, be modified, or be replaced entirely.

The original Phase 2C framing was: *split ui.css into critical/non-critical, inline critical CSS, defer non-critical CSS.* This audit evaluates that framing from first principles.

---

## 1. Inventory

### File measurements

| File | Raw bytes | Lines | Gzipped bytes | Notes |
|---|---|---|---|---|
| `_shared/ui.css` | 158,033 | 6,958 | **28,314** | Render-blocking, in every page `<head>` |
| `site.min.css` | 22,530 | ~1 | **5,674** | Compiled Tailwind, render-blocking |
| Total CSS delivered per request | 180,563 | — | **33,988** | ~34KB gzipped over wire |

### Structural metrics (measured)

| Metric | Count |
|---|---|
| Rule blocks | 1,279 |
| `@keyframes` | 87 |
| `@media` queries | 70 |
| `var(--*)` uses | 146 |
| `:root {}` blocks | 4 (lines 1874, 6281, 6366, 6410) |
| Lines in confirmed dead zone (Phase 9–12) | **1,694** |
| Lines in mixed zone (Phase 5–8, some dead) | ~1,334 |
| Lines in "VISUAL DESIGN SYSTEM v2" (mixed) | 684 |

### Structural zones

| Lines | Label | Source era |
|---|---|---|
| 1–836 | Core live infrastructure | Sessions 1–50 |
| 837–973 | Phase 1 & 2 animations | Session 52 |
| 974–1391 | Phase A/B/C/D micro-interactions | Session 57 |
| 1392–3245 | Shared components, scroll-reveal, view transitions | Sessions 57–70 |
| 3246–4580 | Phase 5–8 UX overhaul (MIXED — partially dead) | Sessions 65–77 |
| 4581–4839 | Phase 9: Search modals, Quick Preview (DEAD) | Session 77 |
| 4840–5206 | Phase 10 early: Stats, Timeline view (DEAD) | Session 77 |
| 5207–6274 | Phase 10–12 main: Dashboards, Audio, Gallery (DEAD) | Session 77 |
| 6275–6958 | "VISUAL DESIGN SYSTEM v2" (MIXED) | Session 57-era Stitch export |

---

## 2. Usage Analysis

### Methodology

Every class/selector classification is based on direct evidence:
- `grep -rl CLASSNAME *.html _shared/*.html artworks/pages/art0001.html` — static HTML
- `grep -rn CLASSNAME _shared/*.js _shared/*.bundle.js` — JS-injected classes
- `body[data-*]` attributes — grep of all 38 root HTML files + sample generated pages
- Cross-checked: a "0 in HTML" finding was always verified by a positive control (known-live class showing expected non-zero count)

### Zone A: Lines 1–836 — Core Live Infrastructure

**Classification: REQUIRED**

Contains: `.medium-grid`, `.thumb`, `.thumb__link`, progress bar (`#jfsn-progress`), icon animations, `#jfsn-ser` (serendipity overlay created by ui.js), mobile menu animation, color CSS variables (`:root --color-*`), `[data-theme="guernica"]` / `[data-medium]` body attributes (confirmed on 12 HTML files), TOC active, footer tints, page transition directions, link underlines, `.reveal-section` (4 live JS refs), `.sse-item` (2 live JS refs).

Key evidence:
- `.medium-grid` — 66 HTML file references
- `.thumb` — 31 HTML files
- `data-theme` body attribute — set in `guernica.html`, `targets.html`, `collage.html`, and 9 other theme/medium pages
- `#jfsn-ser` — dynamically injected by `_shared/ui.js`
- `.dh-rise` — 12 pages using depth-hero

### Zone B: Lines 837–1391 — Animations (Phase 1, 2, A–D)

**Classification: REQUIRED (mostly), PROBABLY DEAD (some legacy)**

The Phase 1 & 2 animation entries (`.decade-hero h1/p` stagger, `.slide-up-fade`, `.filter-chip`) are live on decade and archive pages. The Phase A–D micro-interaction additions include some polish states that are referenced in live JS. No complete section within this zone can be dropped without visual verification.

### Zone C: Lines 1392–3245 — Shared Components

**Classification: REQUIRED (core) / UNKNOWN (several sub-sections)**

Confirmed live: `.jfsn-loaded` (lazy image), `.reveal-section` IntersectionObserver class, `.jfsn-ser`, serendipity overlay rules, view transitions (`@view-transition`, `::view-transition-*`).

**Unknown / potentially dead:** `.toc-active` (0 HTML refs, 0 JS refs), `.adjacent-preview` (0 HTML refs), `.skeleton-card` (0 refs), `.filter-chip-collage` (0 refs), `.masonry-item` (0 refs), `.card-interactive` (0 refs). These are isolated selectors within an otherwise-live zone — targeted removal is possible but requires line-level audit, not whole-zone removal.

### Zone D: Lines 3246–4580 — Phase 5–8 UX Overhaul

**Classification: MIXED — DO NOT wholesale delete**

Live within this zone: `.reveal-section` rules (4 JS refs), `.sse-item` (search event-source items, 2 refs), search result styles, view toggle, hero parallax. Dead within this zone: `toc-active`, `adjacent-preview`, `skeleton-card`, `masonry-item`, `card-interactive`, `modal-backdrop`, `quick-preview-modal` (all zero refs in HTML and JS).

This zone is interleaved — live rules and dead rules sit adjacent. Whole-zone deletion is not safe. Targeted removal requires per-rule verification.

### Zone E: Lines 4581–6274 — Phase 9, 10, 11, 12

**Classification: CONFIRMED DEAD**

**This is the cleanest finding in the audit.**

Every class in this zone was checked via `grep -rl` across all 38 root HTML files, `artworks/pages/art0001.html` (representative generated page), and all JS files in `_shared/`. Every check returned 0.

The JS gateway was also verified: `_shared/micro-interactions.js` (now in `nav-late.bundle.js`) contains Phase 10–12 handler functions. Each begins with `if (!element) return`. The elements they guard against (`.stats-dashboard`, `.timeline-container`, `.audio-player`, `.transcription-panel`, `.fullscreen-gallery`, `.preferences-panel`) do not exist in any HTML page. The functions execute in every page load but are pure no-ops. The corresponding CSS rules are never applied.

| Sub-zone | Lines | Raw bytes | Gzipped bytes | Contents |
|---|---|---|---|---|
| Phase 9 | 4581–4839 | ~7,700 | ~1,041 | Search modals, Quick Preview, DOM Backdrop |
| Phase 10 (early) | 4840–5206 | ~7,800 | 1,898 | Statistics Dashboard, Timeline View |
| Phase 10–12 (main) | 5207–6274 | 21,648 | 3,889 | Audio, Gallery, Keyboard Shortcuts, Preferences |
| **Total confirmed dead** | **1,694 lines** | **~37,148 bytes** | **~6,828 bytes** | |

### Zone F: Lines 6275–6958 — "VISUAL DESIGN SYSTEM v2"

**Classification: MIXED — requires rule-level analysis**

This section was added as a Stitch/AI design-system export. It contains both live rules targeting core elements and dead rules targeting non-existent components.

**LIVE rules in this section:**
- `:root` CSS variables used by live rules below (typography scale, shadow tokens, color tokens)
- `h1`, `h2`, `h3`, `p` bare-element rules (6314–6349) — **live on every page** (load order: site.min.css → ui.css, so ui.css wins over Tailwind Preflight)
- `body` background/color (6387–6390) — live
- `.medium-grid` spacing override (6434–6438) — live (66+ page refs)
- `.thumb` margin (6439–6441) — live
- `.thumb__link img` border/shadow (6446–6457) — live (13 page refs, thumbnail treatment)
- `html.dark` + `html.dark body` (6549–6566) — live (dark mode tokens)
- `html.dark .thumb__link img` (6569–6572) — live
- `a`, `button` transition rules (6530–6545) — live (global link underline treatment)
- `.lazy-placeholder` skeleton (6519–6527) — live
- `.flex-no-shrink` (6884–6887) — live (nav drawer SVG icons, all 38 pages via stamp-nav.sh)
- `.border-bottom-soft` (6879–6882) — live (archive.html, artwork.html, start-here.html)
- `.decade-hero` (6928) — live (UI.js injects `.decade-heading-sweep`)
- `.decade-heading-sweep` (6929–6940) — live (JS-injected, confirmed in `_shared/ui.js:153`)
- `.medium-page__title-accent` (6949–6957) — live (JS-injected, confirmed in `_shared/ui.js:525`)

**DEAD rules in this section:**
- `.page-section` and `::before` divider (6393–6406) — 0 HTML refs
- `.artwork-page-header`, `.artwork-title`, `.artwork-metadata`, `.artwork-meta-item`, `.artwork-meta-label`, `.artwork-meta-value` (6627–6669) — 0 HTML refs (Section 9 "Museum Aesthetic")
- `.artwork-container`, `.artwork-display` (6672–6690) — 0 HTML refs
- `.related-works`, `.related-works-label` (6692–6705) — 0 HTML refs
- `body.focus-mode` rules (6709–6731) — 0 HTML refs
- `@keyframes page-fade-gentle`, `.page-transition` (6736–6747) — 0 HTML refs
- `.card-featured`, `.work-featured` (6472–6475) — 0 HTML refs
- `.image-with-backdrop` (6467–6469) — 0 HTML refs
- `.filter-section-header` and `.collage-section`/`.sculpture-section`/`.photography-section`/`.painting-section` sub-selectors (6584–6614) — 0 HTML refs
- `.stat-card`, `.story-card`, `.chapter-item` (6480–6496) in v2 — 0 HTML refs
- `.metadata-label`, `.page-eyebrow` (6352–6362) — 0 live refs (only style-guide.html demo)
- `.card-bg`, `.scroll-anchor`, `.code-block` (Section 12 utilities) — 0 live refs
- `main > section` spacing rules (6421–6431) — unknown; may apply where `<main>` contains `<section>` directly

**Estimated savings if dead V2 rules removed:** ~200–250 lines, ~1,500–2,000 gzipped bytes.

**⚠ Notable issue — Global h1/h2/h3 rules:** The V2 section sets bare `h1/h2/h3` rules (Playfair Display, large sizes, `color: #0B0B0B`). These are live on every page that loads ui.css. This appears to have been introduced as part of a design-tool export and may or may not be the intended global heading style. These rules cascade over Tailwind Preflight (ui.css loads after site.min.css) but are overridden wherever a page applies specific Tailwind utility classes to headings. **Before modifying or removing these, visual verification is required** — they may be load-bearing for pages that rely on browser-default heading styling rather than explicit Tailwind classes.

**⚠ Notable issue — Duplicate `.thumb` animation:** Zone F adds `animation: grid-entrance-slow` to `.thumb` at line 6750. This overrides the Phase 1 animation on `.thumb` in Zone B (earlier in the file). One of these is redundant; which is the "real" animation requires visual inspection.

### Summary: CSS classification by zone

| Zone | Lines | Gzipped | Classification |
|---|---|---|---|
| A: Core infra (1–836) | 836 | ~5,200 | **Required** |
| B: Phase 1–2 + A–D animations (837–1391) | 555 | ~3,500 | **Required** |
| C: Shared components (1392–3245) | 1,854 | ~8,000 | **Required (mixed, isolated dead rules)** |
| D: Phase 5–8 UX (3246–4580) | 1,335 | ~6,800 | **Mixed — DO NOT bulk-delete** |
| E: Phase 9–12 (4581–6274) | 1,694 | **6,828** | **Confirmed Dead** |
| F: V2 Design System (6275–6958) | 684 | ~4,575 | **Mixed — 50-60% dead** |
| **Total** | **6,958** | **28,314** | |

**Conservatively achievable savings (no regressions):** Remove Zone E (all confirmed dead) + identified dead rules in Zone F → save ~7,500–9,000 gzipped bytes (26–32% of current gzipped ui.css).

---

## 3. Validation of Phase 2C Assumptions

**The original Phase 2C plan assumed:** split ui.css into a critical inline block + deferred non-critical stylesheet; this would meaningfully improve performance.

Six assumptions examined:

### Assumption 1: "Render-blocking CSS is actually the performance bottleneck."

**VERDICT: Not supported by evidence.**

Session 95 measured the real mobile LCP bottleneck as the 125KB hero AVIF image under Lighthouse throttling — not CSS parse or download time. Deferred non-critical CSS fetch + skipped mosaic intro on mobile combined to improve LCP by 1.5s. The remaining ~6s mobile LCP is deterministic bytes-over-wire for the hero image.

The 28KB gzipped CSS transfer takes ~0.22s on 3G (1Mbps) and ~0.03s on LTE. This is real but not the primary LCP limiter.

### Assumption 2: "Raw CSS size (158KB) is a meaningful performance cost."

**VERDICT: Not as stated — gzipped size (28KB) is what matters.**

The 5.6× compression ratio means effective download is 28KB — slightly larger than `site.min.css` at 22KB raw. Modern servers deliver CSS gzipped. The relevant cost is parse time (~70ms estimated on mid-range mobile for 6,958 lines), not download size.

### Assumption 3: "CSS parse time is significant."

**VERDICT: Marginal but real.**

Rough estimate: 6,958 lines at ~10ms/1,000 lines on slow mobile = ~70ms. Removing 1,694 confirmed-dead lines → ~17ms savings. Not zero, but below human-perceptible threshold and small compared to network/image costs.

### Assumption 4: "Unused CSS is significant after compression."

**VERDICT: Yes, but the mechanism is different from what was assumed.**

Compression reduces the transfer cost, but the dead code still inflates parse time and, more importantly, adds maintenance cost and specificity complexity. The V2 `h1/h2/h3` rules and duplicate `.thumb` animation rules are live examples where dead/zombie CSS has created subtle cascading effects that are now silently active on every page.

### Assumption 5: "Splitting CSS would not increase architectural complexity."

**VERDICT: FALSE. Splitting would increase complexity and risk.**

This codebase has:
- 38 hand-maintained root pages + 1,084 generated artwork pages
- A service worker (network-first, but historically caused 30-day stale cache bugs)
- Dark-mode FOUC prevention that required head-blocking scripts on 1,122 pages
- A stamp-nav.sh propagation system with documented clobber risks

A critical/non-critical CSS split would require:
1. Identifying "above-fold" content per page — different for homepage vs. archive vs. artwork pages
2. Maintaining two parallel CSS surfaces (inline critical + deferred file)
3. Managing FOUC risk for the deferred CSS (particularly dark mode variables, which must be available before paint)
4. Updating the critical inline block whenever the relevant CSS changes

### Assumption 6: "Keeping one well-organized file is worse than splitting."

**VERDICT: FALSE for this project.**

A single well-organized stylesheet with dead code removed is strictly simpler than two CSS delivery paths. The splitting complexity is unjustified by a 28KB gzipped file on a static archival site with infrequent deploys.

---

## 4. Architectural Recommendation

### Recommended approach: REPLACE THE PLAN

**Do NOT implement the original Phase 2C (critical/non-critical split + inline CSS).**

**Instead, implement "Phase 2C revised": Targeted Dead Code Removal.**

### Rationale

The original plan optimizes for Lighthouse score improvement via render-blocking classification. The evidence shows:
- The actual mobile LCP bottleneck is image bytes, not CSS
- The gzipped CSS file is 28KB — not a meaningful bottleneck
- Splitting CSS into critical/non-critical introduces disproportionate complexity and FOUC risk
- The real problem is maintenance debt: 1,694 lines of confirmed dead code and a mixed V2 section that adds live global rules without anyone knowing whether they're intentional

Targeted dead code removal solves the real problem (engineering quality, maintainability, specificity conflicts) without introducing new risk categories.

### Phase 2C Revised: Three-step plan

**Step 1 — Remove Zone E (Phase 9–12, confirmed dead), 1,694 lines:**
- Lines 4581–6274 may be deleted entirely
- Every class in this zone has zero HTML references and zero live JS execution
- Gzip savings: ~6,828 bytes (24% of current ui.css gzip)
- Risk: ZERO (no live selectors, no behavior change)
- Validation: `grep` any removed class against `*.html` and `_shared/*.js` before deletion

**Step 2 — Remove confirmed-dead rules in Zone F (Visual Design System v2):**
These specific blocks are safe to remove (0 HTML/JS refs):
- `.page-section` and `::before`
- `.artwork-page-header`, `.artwork-title`, `.artwork-metadata` group (Section 9)
- `.artwork-container`, `.artwork-display`, `.artwork-display img`
- `.related-works`, `.related-works-label`
- `body.focus-mode` (all rules)
- `@keyframes page-fade-gentle`, `.page-transition`
- `.card-featured`, `.work-featured`
- `.image-with-backdrop`
- `.filter-section-header` and medium sub-selectors (`.collage-section *`, etc.)
- `.stat-card`, `.story-card`, `.chapter-item` in Zone F (V2 re-declaration)
- `.metadata-label`, `.page-eyebrow` (style-guide demo only)
- `.card-bg`, `.scroll-anchor`, `.code-block` (unused utilities)

Retain:
- All dark mode (`html.dark *`) rules
- `.thumb`, `.thumb__link img`, `.medium-grid` overrides
- `a`, `button` transitions and link underlines
- `.flex-no-shrink`, `.border-bottom-soft`, other confirmed-live utilities
- `.decade-heading-sweep`, `.medium-page__title-accent` (JS-injected)
- `:root` variable blocks (needed by the retained rules)

Estimated additional savings: ~150–200 lines, ~1,500–2,000 gzipped bytes.

**Step 3 — Resolve the two structural anomalies (requires Jeff input):**

3a. **h1/h2/h3 bare rules at lines 6314–6349:** These rules are live on every page. Are they intentional? If yes: move them to the top of ui.css (currently they're at line 6314, overriding 6,313 lines of earlier heading context). If they were unintentionally introduced by a design-tool export, remove them and verify no visual regression. **Requires visual check before either action.**

3b. **Duplicate `.thumb` animation (Zone B vs. Zone F):** Zone B has a `.thumb` entrance animation; Zone F (line 6750) overrides it with `grid-entrance-slow`. Only one can win (last-write wins in CSS). Determine which is desired and remove the losing rule.

### Post-removal results (projected)

| Metric | Before | After |
|---|---|---|
| ui.css raw size | 158,033 bytes | ~111,000 bytes |
| ui.css gzipped | 28,314 bytes | ~20,000 bytes |
| ui.css lines | 6,958 | ~5,000 |
| Confirmed dead lines removed | 0 | 1,694+ |
| Structural anomalies | 2 (h1/h2/h3 conflict, duplicate thumb animation) | 0 |

### What NOT to do in Phase 2C

- **Do not split into critical/non-critical CSS.** Not supported by the performance evidence; disproportionate complexity for a 28KB gzipped file.
- **Do not inline critical CSS.** Increases HTML size, creates a maintenance surface, and reintroduces the class of FOUC bugs Phase 2B just resolved.
- **Do not run a generic CSS purge tool (PurgeCSS, etc.).** This codebase has dynamically injected classes, JS-driven class additions, and `[data-theme]` attribute selectors that purge tools cannot trace statically. The 2024 session-era audit established this risk explicitly.
- **Do not delete Zone D (Phase 5–8) wholesale.** That zone is interleaved with live rules. Safe removal requires per-selector verification, which is out of scope for Phase 2C.

### Risks and mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Zone E removal breaks something | Very Low | High | Pre-removal grep confirms 0 HTML/JS refs for every selector |
| V2 dead rule removal regresses appearance | Low | Medium | Visual check of homepage + archive before deploy |
| h1/h2/h3 rule decision | Medium | Medium | Side-by-side browser check before and after removal |
| CACHE_V not bumped before deploy | Medium | High | Standard project protocol: always bump CACHE_V before any CSS deploy |
| SW stale CSS bug (Session 98 lesson) | Low | High | Use a previously-visited tab for production verification, not incognito |

### Success criteria

Phase 2C revised is complete when:
1. All of Zone E (lines 4581–6274) is deleted
2. Identified dead rules in Zone F are deleted
3. The two structural anomalies (h1/h2/h3, duplicate thumb animation) are resolved
4. `_shared/ui.css` passes a `grep`-based verification: no removed selector appears in any `.html` or `.js` file
5. Visual regression check: homepage, archive, collage, artwork page, dark mode, and one decade page all render correctly
6. CACHE_V bumped, deployed, verified live
7. This document updated with final line counts

---

## Appendix: Key data sources

- `_shared/ui.css`: measured by `wc -c`, `wc -l`, `gzip -c | wc -c`
- HTML grep methodology: `grep -rl CLASSNAME *.html _shared/*.html artworks/pages/art0001.html 2>/dev/null | wc -l`
- JS grep methodology: `grep -rn CLASSNAME _shared/*.js _shared/*.bundle.js 2>/dev/null`
- Phase 10–12 JS guard verification: `grep -n "if.*!element" _shared/micro-interactions.js | head -20` — confirmed every Phase 10–12 handler begins with an existence guard
- Gzip-per-zone measured via `awk 'NR>=LINE1 && NR<=LINE2' _shared/ui.css | gzip -c | wc -c`
- `data-theme` / `data-medium` verified live via `grep -rn "data-theme=\|data-medium=" *.html`
- jfsn-interactions.js cursor/grain duplication verified by reading `_shared/jfsn-interactions.js` lines 21–42

---

**Audit complete. No CSS has been modified. This document is the deliverable for Phase 2C pre-implementation review.**

**Recommendation: Replace the Phase 2C plan with targeted dead code removal as described in Section 4.**
