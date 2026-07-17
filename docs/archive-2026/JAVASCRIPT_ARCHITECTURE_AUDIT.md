# JavaScript Architecture Audit — JFSN Archive

**Date:** 2026-06-30
**Role:** Principal Software Architect investigation (read-only — no code changed in this session)
**Scope:** Every JavaScript module in the repository — bundles, source modules, vendor code, build tooling, service worker
**Priority frame:** preservation > maintainability > reliability > accessibility > performance, per CLAUDE.md and this session's brief

---

## 1. Executive Summary

The JS architecture is in better shape than its size suggests, but it carries one structural fault line that matters more than anything else found here, two confirmed live bugs, and a long tail of duplicate subsystems that accreted because nothing was ever reconciled — not because anyone wrote bad code.

**The one finding that should drive everything else:** JFSN Archive renders "an artwork page" through **two completely independent code paths** that have never been reconciled:

- `artwork.html?id=art0001` — a hand-coded, JS-driven template. Fetches the catalog client-side, builds the DOM at runtime, and carries the full animation/interaction stack: `artwork-animations.js`, `hover-preview.js`, `accent-transition.js`, `senior-ux-signposting.js`, `breadcrumb-navigation.js`, `floating-home-button.js`, plus the universal `core.bundle.js` / `nav-early.bundle.js` / `nav-late.bundle.js`. 25 `<script>` tags.
- `artworks/pages/art0001.html` (× 1,084) — a statically generated, pre-rendered template from `gen-artwork-pages.py`. Hand-rolled nav markup with its own 4th independent mobile-menu implementation. Loads only `search.js` and `nav-active.js` — none of `core.bundle.js`, none of the nav bundles, none of the animation layer. 7 `<script>` tags.

These two templates render different HTML for the same conceptual page, evolve independently, and have already drifted out of sync in a way that **breaks live functionality on all 1,084 generated pages** (§6). Every recommendation in this report is secondary to the decision of what to do about this dual system — it is the one finding that, left alone, will keep producing this class of bug indefinitely.

**Two confirmed, currently-live bugs**, both consequences of that drift:
1. `window.showToast` and `window.toggleFavorite` (defined in `ui.js`, shipped only via `core.bundle.js`) are called by inline `onclick` handlers on **every one of the 1,084 generated artwork pages**, which never load `core.bundle.js`. The Favorite button does nothing; the Copy-ID toast throws a `ReferenceError` after the clipboard write succeeds. (§6, Critical)
2. `artwork-animations.js`'s `setupImageParallax()` applies a scroll-driven `translateY` transform directly to `#work-image` on `artwork.html` — the one CLAUDE.md hard rail this whole codebase is supposed to honor ("never pan/tilt/parallax the artwork node itself") is being violated on the one template that still carries it. Every other parallax-family module in the codebase (`depth-hero.js`, `essay-parallax.js`, `chromatic-river-parallax.js`, `section-parallax.js`) was written carefully to respect this rule, with comments saying so. This one wasn't, or predates that discipline. (§6, High)

**What's actually well-built:** a cluster of roughly a dozen modules — the "chromatic" family (`chromatic-accent-wire.js`, `ambient-chromatic-tint.js`, `chromatic-position-strip.js`, `chromatic-lazy-tint.js`) and the parallax-primitive family (`depth-hero.js`, `essay-parallax.js`, `chromatic-river-parallax.js`, `section-parallax.js`) — are genuinely good architecture: self-scoping, defensively coded, sharing a single `window.__chromaticBgById` cache instead of re-fetching, consistently honoring `prefers-reduced-motion` and JS-off safety, and carrying comments that explain *why*, including documented bug-fixes from earlier sessions (the scrollY-cap bug, the `anime.getEasing` absence). This is not legacy cruft. Leave it alone (§9).

**What's accreted:** five separate problems each got solved more than once, by different sessions, none of which removed the others: toast notifications (2 systems), page-transition/navigation interception (3 systems), image fade-in-on-load (4-5 systems), footer-gradient-parallax (2 systems), and "where am I" orientation signposting (2 systems stacked on the same page). None of these are broken — they coexist without visibly fighting — but the codebase pays a real, measurable cost in parse weight, duplicate observers, and the cognitive load of a future maintainer needing to know which of five fade-in implementations actually owns a given image. None of it is urgent. All of it is real (§5, §7).

**Performance, measured but not optimized per this brief's instructions:** roughly a dozen independent `IntersectionObserver` instances and ten independent `MutationObserver` instances are live across the module set, several watching the identical `document.body` subtree and re-running `querySelectorAll('a[href*="artwork.html?id="]')` on every mutation, independently of each other. This is evidence, not a verdict — see §7 Performance Review.

---

## 2. Complete Module Inventory

43 hand-written files in `_shared/`, 3 generated bundles, 2 root-level runtime scripts, 1 service worker, plus build/tooling scripts and a legacy vendor tree. Grouped by classification.

### 2.1 Core infrastructure

| Module | Purpose | Loaded by | Pages | Globals/Exports | Observers/Listeners |
|---|---|---|---|---|---|
| `build-js-bundles.js` | Concatenates source files into the 3 bundles below, verbatim, with a banner. Source of truth stays in `_shared/`. | `npm run build:js` (manual) | n/a (build tool) | none | none |
| `_shared/core.bundle.js` | Generated. Concatenation of `ui.js`, `lightbox.js`, `toast.js`, `page-transitions.js`, `lazy-load.js`, `image-prefetch.js`. | `<script defer>` | All 38 root/stamped pages | inherits all child exports | inherits all child observers |
| `_shared/nav-early.bundle.js` | Generated. Concatenation of `search.js`, `jfsn-interactions.js`, `accent-transition.js`, `chromatic-accent-wire.js`, `ambient-chromatic-tint.js`, `chromatic-position-strip.js`, `chromatic-lazy-tint.js`, `click-feedback.js`. Must run before two inline scripts in `top-nav.html` (header-scroll-hide, dark-mode toggle). | `<script defer>`, before `nav-late.bundle.js` | 37 stamped pages | inherits child exports | inherits child observers |
| `_shared/nav-late.bundle.js` | Generated. Concatenation of `scroll-choreography.js`, `floating-home-button.js`. Must run after the same two inline scripts. | `<script defer>`, after `nav-early.bundle.js` | 37 stamped pages | inherits child exports | inherits child observers |
| `_shared/ui.js` | The largest hand-written module (908 lines). ~20 distinct feature blocks accreted across many sessions — see §5.4. | bundled into `core.bundle.js` | 38 pages | `window.showToast`, `window.toggleFavorite`, `JFSN_THEME_MAP`, `jfsnThemeColor()` | 3 IntersectionObservers, multiple scroll/click/keydown listeners |
| `_shared/page-transitions.js` | `PageTransitions` object. Intercepts internal `<a>` clicks (bubble phase), fades out, navigates. One of 3 competing page-transition systems — see §5.2. | bundled into `core.bundle.js` | 38 pages | `window.PageTransitions` | 1 click listener (bubble) |
| `_shared/toast.js` | `Toast` object — independent toast implementation #2. See §5.1. | bundled into `core.bundle.js` | 38 pages | `window.Toast` | none |
| `_shared/lightbox.js` | `Lightbox` object. Dormant: only activates on `[data-zoomable]`, which nothing in the live site sets — confirmed in the file's own comment. Inert by design, not dead code. | bundled into `core.bundle.js` | 38 pages | `window.Lightbox` | click listener (currently a no-op) |
| `_shared/lazy-load.js` | `LazyLoad` object. IntersectionObserver + a sitewide `MutationObserver` on `document.body` to catch newly-added lazy images. | bundled into `core.bundle.js` | 38 pages | `window.LazyLoad` | 1 IntersectionObserver, 1 MutationObserver (body, subtree) |
| `_shared/image-prefetch.js` | `ImagePrefetch` object. Primary mechanism (`a[rel="next"/"prev"]`) and fallback (`window.allWorks`) are **both confirmed dead** — see §6. | bundled into `core.bundle.js` | 38 pages | `window.ImagePrefetch` | none effective |
| `_shared/nav-active.js` | Maps filename → nav-highlight target. Deliberately excluded from bundling because it has a duplicate `<script>` tag on 8 of 38 pages (intentional, documented, preserved as-is). | individual `<script>` tag | 38 pages (+ executes twice on 8 of them) | none | none |
| `sw.js` | Service worker. Cache-first for AVIF, stale-while-revalidate for catalog JSON, network-first (with `{cache:'reload'}`) for HTML/CSS/JS. `CACHE_V` versioning. | browser, via `navigator.serviceWorker.register()` | all pages | n/a (worker scope) | `install`/`activate`/`fetch` events |
| `search.js` | Site-wide ⌘K search overlay + `?` shortcuts modal. Self-contained: injects own CSS/HTML. Lazy-loads `catalog-lite.json`. | individual `<script>` tag (root pages: bundled in `nav-early.bundle.js`; generated pages: standalone tag) | 38 root pages (bundled) + all 1,084 generated pages (standalone) | `window.openSiteSearch`, `window.jfsnFavs` | 1 keydown listener, click listeners |

### 2.2 Shared runtime (sitewide enhancement layer, the "chromatic family")

All four of these share one fetch-once cache (`window.__chromaticBgById`) and self-scope cleanly. See §4 — this is the strongest-architected cluster in the codebase.

| Module | Purpose | Pages | Self-scoping guard |
|---|---|---|---|
| `_shared/chromatic-accent-wire.js` | Tags every `a[href*="artwork.html?id="]` with `data-accent-color` from `chromatic.json`, for `accent-transition.js` to consume. | bundled, 37 pages | no-op if no matching links |
| `_shared/ambient-chromatic-tint.js` | Faint background wash, averaged from the chromatic colors of works currently in viewport; also syncs `<meta name="theme-color">`. | bundled, 37 pages | no-op if no matching links |
| `_shared/chromatic-position-strip.js` | Sitewide companion to `archive-river.js` — a slim fixed color strip mapping the page's works across 1974–present. | bundled, 37 pages | **explicitly bails if `#archive-river-bar` exists** (i.e. on archive.html, which has its own richer version) |
| `_shared/chromatic-lazy-tint.js` | Sets `--lazy-tint` custom property on images inside artwork links, for the shimmer placeholder to use the work's real color instead of a generic shimmer. | bundled, 37 pages | no-op if no matching links |
| `_shared/click-feedback.js` | Tactile scale-pulse on click for bracket-links, back-to-top, floating home button. Reuses the existing archive filter-chip pulse rather than inventing a third. | bundled, 37 pages | reduced-motion early-return |
| `_shared/accent-transition.js` | Color-cued page transitions: washes the screen in the destination work's real accent color before navigating (capture-phase, only on links carrying `data-accent-color`). | bundled, 37 pages | no-op on links without the attribute |
| `_shared/jfsn-interactions.js` | "Living museum interaction layer" (422 lines): page-load progress bar #2, custom cursor, film-grain canvas, kinetic letter-settle, view-transition naming, "Serendipity mode" (press S, random work cycling). | bundled, 37 pages | desktop/non-touch gates on cursor + film grain; reduced-motion gates throughout |
| `_shared/scroll-choreography.js` | Unified navbar/footer scroll orchestration: entrance stagger, header opacity by "reading vs. skimming" velocity heuristic, accent-color sync, footer-gradient parallax #2, section-reveal nav highlighting, gesture-responsive nav opacity #2, BTT beacon. | bundled, 37 pages | reduced-motion gates throughout |

### 2.3 Page-specific

| Module | Purpose | Pages (verified ref count) |
|---|---|---|
| `_shared/hover-preview.js` | Metadata tooltip on thumbnail hover. Falls back through `window.allWorks` (confirmed never assigned — dead path) → `window.CATALOG` → minimal `{id}`. | 30 |
| `_shared/depth-hero.js` | v2 named motion primitive. Display-headline parallax (capped 64px) + load stagger. Artwork plane never moves — by design, and documented as such. | 13 |
| `_shared/continuity-transition.js` | Stamps `viewTransitionName` on clicked thumbnails for the cross-document image morph into artwork.html. | 10 |
| `_shared/archive-quick-filters.js` | archive.html-only. Builds a redundant "Quick filters" UI that programmatically clicks the *real* `.filter-chip` elements to stay in sync. | 1 (path-guarded) |
| `_shared/archive-river.js` | The canonical chromatic-position river on archive.html — richer in-page version that `chromatic-position-strip.js` explicitly defers to. Well-structured; documents a deliberate mode-vs-mean statistics fix. | 1 |
| `_shared/archive-animations.js` | archive.html-only. Filter-chip pulse/flash, grid stagger-fade via **fragile wildcard selectors** (`[class*="grid"]`, `[class*="card"]`), result-count pulse. | 1 |
| `_shared/artwork-animations.js` | artwork.html-only. Master entrance timeline + **the confirmed parallax hard-rail violation** (§6). | 1 |
| `_shared/hover-scale.js` | Subtle 1.0→1.02 hover scale on `.archive-card, .thumb__link`. | 4 |
| `_shared/stat-card-entrance.js` | Scale+fade entrance for `[data-stat-card]`, `#work-count`, `#chrom-count-works`, `#ghost-grid`. | 6 |
| `_shared/image-fade-load.js` | Fade-in-on-load for **all `<img>` tags sitewide** — fade system #4/5, see §5.3. | 6 |
| `_shared/counter-animate.js` | Count-up animation for `[data-count-target]` on scroll-into-view. | 5 |
| `_shared/section-parallax.js` | Layered parallax for prose pages (about/series/lost). Explicitly skips `[data-hero]` elements to avoid fighting `hero-zoom-settle.js`. Documents the scrollY-cap bug fix. | 4 |
| `_shared/hero-zoom-settle.js` | Hero zoom-settle entrance (0.95×→1.0×) on load. | 4 |
| `_shared/grid-entrance.js` | Staggered card entrance via the existing CSS `.reveal-section`/`.reveal-delay-*` classes. | 4 |
| `_shared/senior-ux-signposting.js` | "You are here" orientation boxes on archive/artwork/series pages. Overlaps directly with `breadcrumb-navigation.js` on artwork.html — see §5.5. | 3 |
| `_shared/section-reveal-stagger.js` | Sequential section fade/slide on load via the same CSS reveal system as `grid-entrance.js`. | 3 |
| `_shared/breadcrumb-navigation.js` | Injects a fixed, sticky breadcrumb bar. Listens for `artwork:loaded` custom event (confirmed dispatched by artwork.html) to render work-specific crumbs. Overlaps with `senior-ux-signposting.js` — see §5.5. | 3 |
| `_shared/hover-scale.js`, `_shared/essay-parallax.js`, `_shared/drone-survey.js`, `_shared/ambient-tint-parallax.js` | (essay-parallax: blockquote parallax on stories/why-i-made-things, documents the same scrollY-cap fix as section-parallax.js). (drone-survey: decorative drone animation over wall grids — contains a latent dead-code bug, §6). (ambient-tint-parallax: scroll-coupled background tint cycling through page-defined palette). | 2 each |
| `_shared/filter-slide-in.js`, `_shared/chromatic-river-parallax.js`, `_shared/chromatic-animations.js`, `_shared/archive-quick-filters.js`, `_shared/archive-animations.js`, `_shared/accent-transition.js`(dup ref) | Single-page-referenced modules; chromatic-animations.js contains dead code (`decadePalettes`, `originalDrawFunction`) — see §6. | 1 each |
| `_shared/floating-home-button.js` | Injects a fixed "⌂" home button after `scrollY > 300`. Redundant with the existing nav wordmark/drawer home links. | bundled (nav-late), 37 pages |

### 2.4 Legacy / dormant

| Module | Status |
|---|---|
| `_shared/lightbox.js` | Fully built, zero live activations — see 2.1. Not dead code in the technical sense (no error, intentional design), but dormant. |
| `_shared/image-prefetch.js` | Both of its data sources are confirmed non-existent in production markup/globals — functionally inert. |
| `old-site/` | 15MB legacy directory: full vendor copies of PrismJS, Rellax, Shuffle.js, multi-framework Swiper (React/Vue/Svelte/Solid), vanilla-tilt. **Zero references from any live HTML or JS.** Git shows it untouched for 5+ weeks. Confirmed abandoned. |

### 2.5 Build tooling / generators

`gen-artwork-pages.py`, `build_catalog.py`, `build_dims.py`, ingest/catalog Python scripts under `artworks/`, `stamp-nav.sh`, `deploy-hostgator.sh`, `backup.sh`, `cloud-backup.sh`, `session-end.sh`, `audit-nav.sh` — read for context this session, not modified. `gen-artwork-pages.py`'s template is the source of the generated-page architecture described throughout this report; confirmed via grep to contain **no reference** to `work-image`, `artwork-animations`, `essay-parallax`, or `continuity-transition` — i.e. the generated-page template was never updated to carry the animation layer that `artwork.html` has.

### 2.6 Generated (non-source)

The 1,084 files under `artworks/pages/*.html` are themselves generated output, not hand-authored — their JS payload (`search.js` + `nav-active.js`, 7 `<script>` tags) is fixed by `gen-artwork-pages.py`'s template, not edited per-file.

---

## 3. Dependency Overview

**Bundle load order (37 stamped pages):**
```
anime.min.js (vendor, not bundled)
  → nav-early.bundle.js  [search.js, jfsn-interactions.js, accent-transition.js,
                           chromatic-accent-wire.js, ambient-chromatic-tint.js,
                           chromatic-position-strip.js, chromatic-lazy-tint.js,
                           click-feedback.js]
  → [inline] header-scroll-hide script (in top-nav.html)
  → [inline] dark-mode toggle script (in top-nav.html)
  → nav-late.bundle.js   [scroll-choreography.js, floating-home-button.js]
  → core.bundle.js       [ui.js, lightbox.js, toast.js, page-transitions.js,
                           lazy-load.js, image-prefetch.js]
  → nav-active.js (individual tag; duplicate tag on 8 pages)
  → [page-specific scripts, placed after <!-- SCRIPTS:END -->]
```
This two-bundle split (`nav-early`/`nav-late`) exists solely to preserve execution order around the two inline scripts in `top-nav.html` — confirmed still accurate by re-reading `build-js-bundles.js` this session, except for one now-stale comment (the file references "micro-interactions.js" execution-order reasoning for a file deleted in the prior session — harmless, but should be corrected next time anyone touches that comment).

**Generated artwork pages (1,084 files) load order:**
```
search.js (standalone tag, not the bundled copy)
  → nav-active.js (standalone tag)
```
No `anime.min.js`, no bundles, no animation layer at all. This is by design (the static template is deliberately lightweight) but it means `window.showToast`/`window.toggleFavorite` are never defined when this template's inline `onclick` handlers call them (§6).

**Shared runtime caches / cross-module contracts:**
- `window.__chromaticBgById` — populated once by whichever of the four chromatic-family modules runs first; the rest reuse it instead of re-fetching `chromatic.json`.
- `chromatic:ready` custom event + `window.__chromaticWorks` — used by `archive-river.js`.
- `artwork:loaded` custom event — dispatched by `artwork.html` after its async catalog fetch resolves; consumed by `breadcrumb-navigation.js`'s `watchArtworkData()`. Confirmed both sides exist and match.
- `window.anime` — required by roughly a dozen modules; each independently checks `if (!window.anime) return`, so the codebase already tolerates anime.js failing to load.
- `JFSN_THEME_MAP` / `jfsnThemeColor()` — single source of truth in `ui.js` (confirmed still deduplicated from the Phase 1 cleanup, 3 references total — 1 definition + 2 call sites).

**Hidden ordering dependency:** any new page-specific script must be placed *after* `<!-- SCRIPTS:END -->` in the stamped page, not adjacent to the bundle tags — this was the root cause of two prior production incidents (documented in CURRENT_STATE.md, fixed this cycle via the three-span `stamp-nav.sh` rework). Still a sharp edge for a future maintainer who doesn't know the span boundaries exist.

---

## 4. Architectural Strengths

1. **The chromatic family (§2.2) is genuinely well-designed.** Four independently-loadable modules sharing one fetch-once cache, each with an explicit self-scoping guard, each documented with a comment explaining *why* it exists relative to its siblings (e.g. `chromatic-position-strip.js` explicitly defers to `archive-river.js` on archive.html rather than duplicating it). This is the opposite of the accretion pattern seen elsewhere — it's how the rest of the codebase should have grown.

2. **The parallax-primitive family is internally consistent and rule-following.** `depth-hero.js`, `essay-parallax.js`, `chromatic-river-parallax.js`, `section-parallax.js` all independently arrived at the same correct technique (viewport-relative offset, not raw `scrollY`) after the same bug (a global scrollY-based offset caps out and freezes after one screen of scroll) was found and fixed — and each one's comment cites the others. `section-parallax.js` explicitly checks for `[data-hero]` to avoid fighting `hero-zoom-settle.js` on the same element. This is a family of modules that talk to each other through comments and conventions even though they don't share code — a low-tech but functioning form of architecture.

3. **`prefers-reduced-motion` discipline is near-universal.** Of the ~30 page-specific/shared-runtime animation modules read this session, all but a small number open with the reduced-motion early-return. This is a real, consistently-applied accessibility commitment, not a checkbox done once and forgotten.

4. **JS-off safety is a stated, followed convention in the newer motion primitives.** `depth-hero.js`'s own comment states the rule explicitly ("this script ADDS the hidden initial state... never put opacity:0 in the HTML") and every later module in that family follows it.

5. **The service worker's caching strategy is deliberate and documents its own incident.** The HTML/CSS/JS fetch handler's `{cache:'reload'}` flag exists specifically because, per its own comment, the original "network-first" implementation was silently honoring the browser's 30-day HTTP cache — a real bug, found, fixed, and the fix is explained in place so it won't be "simplified" away by a future session that doesn't know why it's there.

6. **The bundle-splitting rationale in `build-js-bundles.js` is unusually well-documented for a build script** — it explains *why* there are two nav bundles instead of one (preserving execution order around two inline scripts), which is exactly the kind of context that normally gets lost.

7. **The recently-fixed three-span `stamp-nav.sh` architecture (NAV/SCRIPTS/FOOTER)** closes a real, twice-incident-causing gap and is a structural improvement, not a patch.

---

## 5. Architectural Weaknesses

### 5.1 Toast notifications — two independent systems
`ui.js`'s `window.showToast()` and `toast.js`'s `Toast` object (different container IDs, different markup, different APIs) both ship on every page via `core.bundle.js`. `lightbox.js` calls `Toast.success()/error()`; `ui.js`'s own `toggleFavorite()` calls `window.showToast()`. Neither consumer knows the other system exists. No conflict today only because their DOM never overlaps — but a future page that needs a toast has to guess which one is canonical.

### 5.2 Page-transition / navigation interception — three independent systems
- `ui.js`'s `#page-transition-loader` ("TIER 1-3" per its own comments)
- `page-transitions.js`'s `PageTransitions.transitionTo()` (bubble-phase, all internal links)
- `accent-transition.js`'s capture-phase handler for links carrying `data-accent-color` (explicitly calls `stopImmediatePropagation()` to win against the other two for its subset of links)

The third one is a deliberate, documented override of the first two for a specific case — that's reasonable layering. But the first two were never reconciled with each other, and a maintainer reading either file in isolation has no way to know the other exists.

### 5.3 Image fade-in-on-load — four to five independent systems
`ui.js` (two separate blocks, per its own Phase-1-cleanup comments), `lazy-load.js`, `image-fade-load.js` (targets *all* `<img>` tags sitewide, not just lazy ones), plus a CSS-only `img[loading="lazy"]` animation flagged in a prior-session comment as conflicting. `image-fade-load.js` and `lazy-load.js` both attach `load`/opacity logic to images that may be the same `<img>` element on a given page — not confirmed broken, but confirmed redundant: two different rAF-driven opacity ramps are plausible on the same element depending on page.

### 5.4 `ui.js` is a kitchen-drawer module
908 lines, ~20 unrelated feature blocks, each tagged with a "Phase N"/"Session NN #M" comment but with no ownership boundary. The file's own comments document several past dedup passes (mobile-menu handler moved out, header-collapse handler moved out, a duplicate lazy-image loop removed, a duplicate P/N keydown handler removed) — meaning this file has already been the subject of multiple "find the duplicate inside ui.js" cleanup passes, and is large enough that it will keep producing more.

### 5.5 "Where am I" orientation signposting — two systems stacked on the same page
`senior-ux-signposting.js`'s `setupArtworkSignposting()` and `breadcrumb-navigation.js` both inject location/orientation UI on `artwork.html`, confirmed via both files' `<script>` tags present together on that page. One is an inline box pushed in next to the back-link; the other is a fixed sticky bar that pushes `<main>` down 48px. Both compute overlapping information (archive → series/decade → medium → title) independently, from different DOM read strategies, neither aware of the other.

### 5.6 No shared observer utility — duplicated IntersectionObserver/MutationObserver instantiation
12 distinct modules independently call `new IntersectionObserver(...)`; 10 distinct modules independently call `new MutationObserver(...)`. Several of these (the chromatic family) watch the *same* `document.body` subtree and re-run the *same* `querySelectorAll('a[href*="artwork.html?id="]')` pattern independently on every mutation. Each instance is individually well-written (debounced via rAF where appropriate, scoped reasonably) — this isn't a correctness bug, it's a missed opportunity to do the same work once and dispatch to multiple consumers.

### 5.7 `nav-active.js`'s page map is incomplete
`PAGE_NAV` has no entries for several real pages in the site (theme pages, `favorites.html`, `start-here.html`, `stories.html`, decade pages, etc.) — those pages get no active-nav highlight. Separately and intentionally, it executes twice on 8 of 38 pages (a known, documented, deliberately-preserved quirk from the bundling work, not a new finding).

### 5.8 Stale documentation inside source
`build-js-bundles.js`'s top comment still explains an execution-order constraint in terms of `micro-interactions.js`, which was deleted from the codebase entirely in the prior session. The reasoning it documents (anime.js before nav-early, both nav bundles before core) is still correct and still load-bearing — only the example file name is wrong now.

---

## 6. Hidden Risks

These are the findings with the highest "a future maintainer won't notice until something breaks" cost, in roughly descending severity.

1. **`window.showToast`/`window.toggleFavorite` are undefined on all 1,084 generated artwork pages.** Confirmed by direct comparison: `ui.js` (lines 175, 200, 347) defines both on `window`, but `ui.js` only ships inside `core.bundle.js`, and the generated-page template (`gen-artwork-pages.py` → `artworks/pages/art*.html`) loads only `search.js` and `nav-active.js`. Verified neither function is defined in either of those two files. Live consequence: the Favorite button is a complete no-op on all 1,084 pages (its entire `onclick` handler is `window.toggleFavorite(...)`), and the "Copy ID" control throws a `ReferenceError` in the console after the clipboard write (which itself still succeeds, since it runs first in the promise chain) — so the user sees no toast confirmation and gets silent failure on favoriting. This is the single highest-confidence, highest-impact finding in this audit: a real, currently-shipping break, reachable by any visitor on any of the 1,084 pages, that has likely gone unnoticed because the failure is silent (console-only) rather than visually broken.

2. **`artwork-animations.js`'s `setupImageParallax()` violates CLAUDE.md's hard rail on `artwork.html`.** Lines ~119-134 apply `translateY` directly to `#work-image` on every scroll event (up to 20px). The hard rail — "never pan/tilt/parallax the artwork node itself" — is treated as non-negotiable everywhere else in the codebase (every other parallax module explicitly carves out the artwork/hero-image plane and documents doing so). This module is the one exception, and it's live on the one template (`artwork.html?id=...`) that still has the richer animation layer. Whether this is a pre-existing violation predating the hard rail's adoption, or an oversight, isn't determinable from the code alone — but it is currently live and currently in conflict with a documented, deliberate design constraint.

3. **`image-prefetch.js`'s primary and fallback mechanisms are both confirmed dead.** `a[rel="next"/"prev"]` does not exist anywhere in live markup (zero matches across the repo). `window.allWorks` is never assigned to the global scope anywhere — `index.html` and `archive.html` both have local variables of that name, never exposed on `window`. The module loads on all 38 pages via `core.bundle.js`, runs, finds nothing, and does nothing. Not a bug (it fails safely) but it is dead weight shipped to every page load, and its existence could mislead a future maintainer into thinking adjacent-work prefetching is implemented when it isn't.

4. **`drone-survey.js` has an unreachable but real bug.** `animateDrone()` references `containerRect.left`/`containerRect.top` (line ~229) inside a branch gated on `pass.isHover && pass.tile` — but `pass.tile` is never set by any of the three pass-generator functions (`generateHorizontalPasses`, `generateVerticalPasses`, `generatePerimeterPasses`), despite each of them receiving a `tiles` parameter that goes otherwise unused. The branch can never execute today, so the `containerRect` `ReferenceError` can never fire — but the `tiles` parameter being threaded through three function signatures and never used suggests an intended "spotlight a specific tile" feature was started and abandoned mid-implementation. Low risk today; a trap for whoever next edits this file's hover logic without noticing the dead parameter.

5. **`chromatic-animations.js` has two confirmed-dead identifiers**: `decadePalettes` (a 6-entry color map, defined, never read anywhere in the file) and `originalDrawFunction` (assigned from `window.__drawRiver`, never used). Harmless, but both suggest a feature (palette-driven recoloring) that was planned and not finished.

6. **The generated-page mobile menu is a fourth independent implementation of the same hamburger-menu logic** that already lives canonically in `top-nav.html` (per existing project memory). It is inline, per-generated-page (not shared), and would need to be kept in sync by hand with any future change to the canonical version — there is no mechanism that would catch drift between them.

7. **`old-site/` (15MB, zero live references, untouched 5+ weeks) is unambiguously dead weight in the working tree**, though it carries no runtime risk since nothing references it. Its main risk is to a future session's investigation time, not to the live site.

---

## 7. Performance Review (measured only — no optimization performed or recommended here, per this session's brief)

**Bundle weights (current, post H1+M1 dead-code removal):**
| File | Bytes | Lines | Generated from |
|---|---|---|---|
| `nav-early.bundle.js` | 67,713 | 1,547 | 8 source files |
| `core.bundle.js` | 57,686 | 1,532 | 6 source files |
| `ui.js` (largest hand-written, inside core) | 38,175 | 908 | — |
| `nav-late.bundle.js` | 21,112 | 597 | 2 source files |
| `jfsn-interactions.js` (inside nav-early) | 18,616 | 422 | — |
| `anime.min.js` (vendor, not bundled) | 17,384 | — | — |
| `scroll-choreography.js` (inside nav-late) | 16,292 | 453 | — |

Combined deferred-script payload on a stamped page (anime + 3 bundles + nav-active.js): roughly 165KB before gzip. Generated artwork pages, by contrast, load only `search.js` + `nav-active.js` — a small fraction of that weight, by design.

**Observer/listener counts (sitewide module set, bundle-file double-counting removed):**
- 12 distinct modules independently instantiate `IntersectionObserver`
- 10 distinct modules independently instantiate `MutationObserver` (4 of them — the chromatic family — watch the identical `document.body` subtree with `{childList:true, subtree:true}`)
- 10 distinct modules attach a `scroll` listener (all confirmed `{passive:true}` and rAF-throttled where checked — no evidence of unthrottled scroll handlers)

**Script-tag count per page type:**
- `artwork.html` (dynamic template): 25 `<script>` tags
- `artworks/pages/art0001.html` (generated template, representative of 1,084): 7 `<script>` tags

**DOMContentLoaded / init-time work:** the majority of page-specific modules gate their setup behind `document.readyState === 'loading' ? addEventListener('DOMContentLoaded', ...) : init()`, which is correct and avoids the common double-init bug. No forced-synchronous-layout pattern (`el.offsetHeight` read immediately followed by a style write in the same tick) was found in the newer modules; `grid-entrance.js` and `section-reveal-stagger.js` do read `el.offsetHeight` to force a reflow before adding the `.revealed` class — this is a deliberate (if old-school) reflow-trigger technique, not an accidental one, and is cheap at the element counts involved (≤5 staggered items per the `Math.min(i, 4)` cap in both files).

**No dynamic `import()` was found anywhere in the codebase** — every module is a classic IIFE loaded via a `<script>` tag. This is consistent with the static-site, no-build-step philosophy and isn't a finding so much as a confirmation of the architecture's actual shape.

This data supports, but does not by itself justify, the consolidation opportunities listed in §8 — per the brief, this section reports, it does not recommend.

---

## 8. Opportunities for Simplification

(Ordered roughly by leverage — biggest preservation/maintainability win first. None of these are urgent; see §10 for actual prioritization with risk/complexity attached.)

1. **Decide the fate of the dual artwork-page system** (§1, §6 #1). This is not a simplification so much as the precondition for every other artwork-page fix being worth doing once instead of twice.
2. **Pick one toast system and delete the other.** Low complexity, low risk — two call sites total (`lightbox.js`, `ui.js`'s own `toggleFavorite`).
3. **Reconcile the two breadcrumb/signposting systems on artwork.html** into one, or make their scopes explicitly non-overlapping (e.g. one is "filter state," the other is "you are here") rather than both rendering competing versions of the same trail.
4. **Consolidate the image fade-in-on-load logic** into a single owner, after confirming with a real page (not just code-reading) which of the 4-5 systems is actually winning visually today.
5. **Extract a shared IntersectionObserver/MutationObserver dispatch utility** for the chromatic family at minimum (4 modules, identical fetch pattern, identical observer pattern) — would cut 4 independent `document.body` mutation watchers down to 1.
6. **Quarantine or remove `old-site/`** — 15MB of confirmed-unreferenced legacy vendor code.
7. **Fix the two confirmed-dead `image-prefetch.js` data sources**, or remove the module — it currently does nothing on every page load.
8. **Correct the stale `micro-interactions.js` reference** in `build-js-bundles.js`'s top comment.

---

## 9. Things That Should Not Be Changed

1. **The chromatic-family module cluster** (§2.2, §4#1) — this is some of the best-architected code in the project. Any "simplification" pass should study its pattern (shared cache, self-scoping guards, explanatory comments) before touching anything else, not flatten it into something more generic.
2. **The parallax-primitive family and its viewport-relative-offset convention** (§4#2) — already correctly battle-tested against a real bug across 4 files.
3. **The reduced-motion and JS-off-safety conventions** — near-universal, load-bearing for accessibility, and should be the template for any new motion code, not relaxed for convenience.
4. **The service worker's caching strategy**, including the `{cache:'reload'}` fix and its documenting comment — this fixed a real, hard-to-diagnose incident (stale JS surviving a deploy for up to 30 days in a returning visitor's tab). Don't simplify this back toward the bug it fixed.
5. **The two-bundle (`nav-early`/`nav-late`) split**, despite looking at first glance like it could be merged into one — the split exists to preserve a real ordering dependency around two inline scripts in `top-nav.html`. Merging them without re-verifying that ordering would silently break dark-mode toggle or header-scroll-hide on some page.
6. **The three-span (`NAV`/`SCRIPTS`/`FOOTER`) `stamp-nav.sh` architecture** — fixed this cycle specifically to stop a recurring data-loss incident; do not collapse the spans back together.
7. **The generated artwork pages' minimalism itself** (7 script tags, no animation layer) is not a defect to "fix" by adding the same complexity `artwork.html` has — it is arguably the more honest, more maintainable, more accessible template of the two. The defect is narrowly that two of its `onclick` handlers call undefined functions (§6 #1) — fixing that does not require giving 1,084 pages the full animation stack.
8. **`lightbox.js`'s dormancy** — it is not dead code to delete; it's a built, working feature with zero current activations because nothing sets `data-zoomable` yet. Removing it would be removing working capability, not cleaning up debt.

---

## 10. Prioritized Recommendations

Each entry: **why it matters → engineering value → preservation value → implementation complexity → implementation risk → expected benefit.**

### Critical
**R1 — Fix the broken `showToast`/`toggleFavorite` calls on the 1,084 generated artwork pages.**
Why: confirmed live functional break (favoriting silently does nothing; copy-ID throws), reachable on every one of 1,084 pages today.
Engineering value: high — closes a real correctness gap.
Preservation value: high — favoriting/saving works is a real feature for someone building a personal relationship with this archive; it should work.
Complexity: low — either (a) add minimal standalone implementations of both functions to the generated-page template (consistent with its lightweight philosophy), or (b) load `toast.js` + the relevant `ui.js` exports there. Decision depends on R-Dual-System below.
Risk: low — additive, isolated, testable on a single regenerated page before a full `gen-artwork-pages.py` re-run.
Benefit: immediate, verifiable, user-visible fix.

### High
**R2 — Resolve the dual artwork-page system.** (Not a code change by itself — a decision.)
Why: every other artwork-page finding in this report (R1, the parallax violation, the signposting duplication, the 4th mobile-menu copy) traces back to two templates evolving independently with no shared source of truth.
Engineering value: very high — this is the one decision that, made once, prevents the next 5 years of "which template did I forget to also fix" bugs.
Preservation value: very high — a future maintainer (or AI assistant) auditing "the artwork page" needs to know there are two before they can trust any finding about either.
Complexity: high — this is an architectural decision (unify into one template? keep both deliberately, with an explicit contract for what diverges and why? retire one?), not a quick patch.
Risk: high if rushed, low if scoped as "decide and document first, migrate later."
Benefit: converts an open-ended class of bugs into a closed, documented, intentional split (or eliminates the split entirely).

**R3 — Remove or correct the artwork-plane parallax in `artwork-animations.js`.**
Why: confirmed violation of CLAUDE.md's one non-negotiable motion rule, live on `artwork.html`.
Engineering value: medium — isolated, ~15 lines.
Preservation value: high — this rule exists specifically to protect how the work itself is presented; it is the kind of rule this whole project is built around honoring.
Complexity: low.
Risk: low — removing a `translateY` on scroll has no functional dependents elsewhere in the file (confirmed: nothing else in `artwork-animations.js` reads `image.style.transform`).
Benefit: brings the one exception back in line with a rule the rest of the codebase already follows correctly.

### Medium
**R4 — Consolidate the two toast systems into one.**
Engineering value: medium. Preservation value: medium (one less thing to explain to a future maintainer). Complexity: low (2 call sites to repoint). Risk: low.

**R5 — Reconcile `senior-ux-signposting.js` and `breadcrumb-navigation.js` on artwork.html.**
Engineering value: medium. Preservation value: medium-high (current state visually/semantically redundant to a real visitor, not just to a code reader). Complexity: low-medium (need to confirm visually which renders "on top" / whether both are simultaneously visible before deciding which to keep). Risk: low.

**R6 — Remove or fix `image-prefetch.js`.**
Engineering value: low (currently inert, so removing costs nothing functionally). Preservation value: medium (a dead module that looks alive is a documentation liability — it claims a capability the site doesn't have). Complexity: very low. Risk: none.

**R7 — Correct the stale `micro-interactions.js` reference in `build-js-bundles.js`'s top comment.**
Engineering value: low. Preservation value: medium (stale comments actively mislead the next reader about *why* the ordering constraint exists). Complexity: trivial. Risk: none.

### Low
**R8 — Consolidate the image fade-in-on-load systems** after a real-browser check of which currently wins. Complexity: medium (need to verify visually first, not just by reading code). Risk: low-medium (touches every page's image loading).

**R9 — Extract a shared observer-dispatch utility for the chromatic family.** Engineering value: medium (real, measurable: 4 MutationObservers → 1). Preservation/clarity value: low-medium. Complexity: medium. Risk: low-medium (must preserve each module's exact current behavior).

### Very Low
**R10 — Remove `old-site/`** (15MB, zero references, 5+ weeks stale) — pure housekeeping, no functional stakes either way.
**R11 — Clean up `drone-survey.js`'s unused `tiles`/`pass.tile`/`containerRect` dead branch**, and `chromatic-animations.js`'s unused `decadePalettes`/`originalDrawFunction` — cosmetic, zero live risk either way since both are unreachable/unused.

---

## 11. Proposed JavaScript Roadmap

This ordering follows the brief's stated priority: preservation and reliability first, simplification opportunistically, performance last and only as a byproduct.

**Phase A — Fix what's actually broken (R1, R3).**
Both are small, isolated, currently-shipping defects with no architectural prerequisite. Ship these independent of any larger decision. R3 in particular should probably happen on its own, quickly, since it's a violation of a rule the project treats as a hard line.

**Phase B — Decide the dual-artwork-system question (R2).**
This is a decision phase, not a code phase. Output should be a short written decision: either (a) the two templates are an intentional, permanent split with a documented contract for what's allowed to diverge (and R1's fix becomes "give the generated template its own minimal, correct favorite/toast implementation, on purpose"), or (b) one template should absorb the other over time, with a migration plan. Either answer is legitimate — what's not legitimate is the current state, where the split is accidental and undocumented.

**Phase C — Consolidate the duplicate subsystems opportunistically (R4, R5, R6, R7).**
None of these are urgent and none block anything else. Good candidates for "next time someone is already in that file for an unrelated reason" rather than a dedicated sprint — except R5, which has a real user-facing redundancy and might be worth a deliberate look sooner.

**Phase D — Infrastructure improvement: shared observer utility (R9).**
Only worth doing once Phase C has settled which modules survive — no point building shared infrastructure for code that's about to be merged or removed.

**Phase E — Housekeeping (R8, R10, R11).**
Lowest stakes, do whenever convenient. R8 specifically needs a real-browser pass first (this audit could not visually verify which fade system currently "wins" on a given image without violating the read-only constraint of this session).

**Explicitly not in this roadmap:** any bundle-size, parse-time, or Lighthouse-driven optimization work. Per this session's brief, performance was measured (§7) and is not being prioritized — nothing in §7 surfaced a correctness or preservation risk severe enough to warrant moving performance ahead of the items above.
