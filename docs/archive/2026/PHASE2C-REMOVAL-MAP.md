# PHASE2C-REMOVAL-MAP — Dead CSS Removal Record

**Date:** 2026-06-30
**Phase:** 2C — CSS Architecture Cleanup (Targeted Dead Code Removal)
**File modified:** `_shared/ui.css`
**Approach:** Surgical removal of confirmed-dead prototype CSS only. No structural reorganization. No new delivery mechanisms. Single-stylesheet architecture preserved.

**Pre-removal metrics:**
- Lines: 6,958
- Raw bytes: 158,033
- Gzipped bytes: 28,314

---

## Methodology

Every selector removed was verified against three sources:

1. **HTML grep** — `grep -rl "CLASSNAME" *.html _shared/*.html artworks/pages/art0001.html` — confirmed zero HTML references
2. **JS grep** — `grep -rn "CLASSNAME" _shared/*.js _shared/*.bundle.js` — confirmed zero live JS references, or JS references guarded by element-existence checks (`if (!element) return`) where the element does not exist in any HTML page
3. **Precise class-token check** — Python script matching exact space-delimited tokens in `class="..."` attributes, eliminating substring false-positives (e.g., `.card` does not match `class="explore-card"`)

A "confirmed dead" classification requires all three checks to return zero *live* references. JS references that are wrapped in an element-existence null guard and where the guarded element does not exist in HTML count as dead.

---

## Structural Anomalies Investigated

Two anomalies were identified in the CSS_ARCHITECTURE_AUDIT.md and investigated before removal decisions were made.

### Anomaly 1: Duplicate `.thumb` animation (lines 1135, 3455, 6750)

**Finding:** Three separate `.thumb` animation rules exist in the file:

| Line | Animation name | Source | Status |
|---|---|---|---|
| 1135 | `grid-enter` | Phase 1–2 session | Overridden by line 3455 (same specificity, later in file) |
| 3455 | `grid-entrance` (with `--stagger-index` delay) | Phase 3 micro-interactions | **Currently overridden by line 6750** |
| 6750 | `grid-entrance-slow` | V2 design system export | **Last in file — wins; has reduced-motion bug** |

The V2 addition at line 6750 introduced two problems:
1. **Stagger disabled** — `grid-entrance` (line 3455) uses `animation-delay: calc(var(--stagger-index) * 40ms)` where `--stagger-index` is set per-card by `micro-interactions.js`. The V2 override at line 6750 uses a single flat timing, silently disabling the stagger on archive.html and series-index.html.
2. **Reduced-motion accessibility bug** — `@media (prefers-reduced-motion: reduce) { .thumb { animation: none; opacity: 1; } }` at line 3474 is a correctly-placed guard. Line 6750's bare `.thumb { animation: grid-entrance-slow }` loads *after* that media block (same specificity, later position), so `prefers-reduced-motion` users still receive the entrance animation. This is an accessibility regression.

**Decision:** Remove line 6750 (`.thumb { animation: grid-entrance-slow }`) and its associated `@keyframes grid-entrance-slow`. The Phase 3 `grid-entrance` animation with stagger (line 3455) is restored as the effective animation. The reduced-motion guard at line 3474 again correctly suppresses it.

### Anomaly 2: Global `h1`, `h2`, `h3` bare element rules (lines 6314–6349)

**Finding:** The V2 section contains bare `h1/h2/h3/p` element rules that set Playfair Display, large sizes, and `color: #0B0B0B`. These were introduced via a Stitch/AI design-tool export and sit at line 6314 — overriding Tailwind Preflight's `h1-h6 { font-size: inherit; font-weight: inherit }` reset — and cascading to every page that loads `ui.css`.

**Investigation:** Every h1/h2/h3 element with explicit Tailwind utility classes or inline `style=""` attributes is unaffected (higher specificity wins). However, `index.html` contains four naked `<h3>` elements (lines 1247, 1254, 1261, 1268) in the "Where to Begin" section — "All 1,084 Works", "Explore by Theme", "Who Jeff Is", "Lost Works" — that rely on the V2 rule to receive Playfair Display at 1.5rem. Without the rule, Tailwind Preflight would reduce them to body font size (16px, system-ui).

**Decision:** Keep the `h1/h2/h3/p` rules in place. They are load-bearing. Adding a documentation comment to explain their origin and load-bearing role.

---

## Removal Block 1 — Zone E: Phase 9 through Phase 12

**Original line range:** 4581–6274 (1,694 lines)
**Classification:** CONFIRMED DEAD

This is a single contiguous block. Every CSS class within it has zero HTML references and zero live JS references. The JS functions that reference these classes are all guarded by element-existence checks (`if (!element) return`) and the target elements do not exist in any HTML page.

### Phase 9 (lines 4581–4839)

#### 9a. Search Suggestions Dropdown (4581–4641)
- **Purpose:** Autocomplete dropdown that appeared below the search input
- **Classes:** `.search-suggestions`, `.search-suggestions.visible`, `@keyframes slide-down`, `.suggestion-item`, `.suggestion-match`, `.suggestion-type`
- **HTML refs:** 0
- **JS refs:** `micro-interactions.js:613` — `document.querySelector('.search-suggestions')` inside `setupSearchSuggestions()`. Guard at line 614: `if (!searchInput || !suggestionsBox) return;`. Element does not exist → function is a no-op.
- **Lines removed:** ~61

#### 9b. Quick Preview Modal (4643–4699)
- **Purpose:** Right-click / long-press artwork preview popup
- **Classes:** `.quick-preview-modal`, `.quick-preview-close`, `.quick-preview-content`, `.quick-preview-image`, `.quick-preview-info`, `.quick-preview-title`, `.quick-preview-meta`
- **HTML refs:** 0
- **JS refs:** `micro-interactions.js:710` — `document.querySelector('.quick-preview-modal')`. Guard at line 713: `if (!modal) return;`. No-op.
- **Lines removed:** ~57

#### 9c. Dominant Color Backdrop (4701–4713)
- **Purpose:** Color-wash behind artwork image using dominant color extracted at load time
- **Classes:** `.color-backdrop`, `.color-backdrop.active`
- **HTML refs:** 0
- **JS refs:** `micro-interactions.js:750` — `document.querySelectorAll('.image-with-backdrop img')` — returns empty NodeList.
- **Lines removed:** ~13

#### 9d. Keyboard Navigation Hints (4715–4733)
- **Purpose:** On-screen hint overlay showing keyboard shortcuts
- **Classes:** `.keyboard-hint`, `.keyboard-hint.visible`, `.keyboard-hint-key`, `.keyboard-hint-label`
- **HTML refs:** 0
- **JS refs:** 0 (no JS reference to these classes found)
- **Lines removed:** ~19

#### 9e. Filter Persistence UI (4735–4763)
- **Purpose:** "Saved filters" chip UI above the filter bar
- **Classes:** `.filter-persistence-bar`, `.saved-filter-chip`, `.saved-filter-label`, `.saved-filter-remove`, `.filter-persistence-actions`
- **HTML refs:** 0
- **JS refs:** 0
- **Lines removed:** ~29

#### 9f. Sort Options Enhancement (4765–4794)
- **Purpose:** Custom sort dropdown with enhanced styling
- **Classes:** `.sort-dropdown`, `.sort-option`, `.sort-option.active`, `.sort-option:hover`
- **HTML refs:** 0
- **JS refs:** 0
- **Lines removed:** ~30

#### 9g. Inline Metadata (4796–4839)
- **Purpose:** Compact metadata row on archive cards (year / medium / series inline)
- **Classes:** `.inline-meta`, `.inline-meta-item`, `.inline-meta-sep`, `.badge`, `.badge-medium`, `.badge-series`
- **HTML refs:** 0 for these specific class names
- **JS refs:** 0
- **Lines removed:** ~44

### Phase 10 — early (lines 4840–5206)

#### 10a. Statistics Dashboard (4840–5025)
- **Purpose:** Full analytics dashboard: total works, decade distribution bar chart, medium breakdown, series count cards
- **Classes:** `.stats-dashboard`, `.stats-grid`, `.stat-card`, `.stat-card-label`, `.stat-card-value`, `.stat-chart`, `.chart-bar`, `.chart-label`, `.chart-value`, many more
- **HTML refs:** 0
- **JS refs:** `micro-interactions.js` — `setupStatisticsDashboard()` guarded by `var dashboard = document.getElementById('stats-dashboard'); if (!dashboard) return;`
- **Lines removed:** ~186

#### 10b. Timeline View (5026–5206)
- **Purpose:** Chronological timeline view for browsing works across decades
- **Classes:** `.timeline-container`, `.timeline-track`, `.timeline-decade`, `.timeline-work`, `.timeline-tooltip`, `.timeline-nav`, and related
- **HTML refs:** 0
- **JS refs:** `micro-interactions.js` — `setupTimeline()` guarded by `var timeline = document.querySelector('.timeline-container'); if (!timeline) return;`
- **Lines removed:** ~181

### Phase 10–12 — main block (lines 5207–6274)

#### 10c. Canvas Visualization Container (5207–5312)
- **Purpose:** Full-screen canvas for generative art visualization (years × color intensity)
- **Classes:** `.canvas-viz`, `.canvas-viz-container`, `.canvas-viz-controls`, `.canvas-viz-overlay`
- **HTML refs:** 0
- **JS refs:** `setupTimeline()` (dead function as above)
- **Lines removed:** ~106

#### 11a. Audio Player (5313–5512)
- **Purpose:** In-page audio player for oral history recordings
- **Classes:** `.audio-player`, `.audio-controls`, `.audio-progress`, `.audio-waveform`, `.audio-track-list`, `.audio-track`, `.audio-track.active`
- **HTML refs:** 0
- **JS refs:** `micro-interactions.js` — `setupAudioPlayer()` guarded by `var player = document.querySelector('.audio-player'); if (!player) return;`
- **Lines removed:** ~200

#### 11b. Oral History & Story Chapters (5513–5760)
- **Purpose:** Story card grid, chapter navigation, story heading treatments
- **Classes:** `.story-card`, `.story-header`, `.chapter-item`, `.chapter-nav`, `.chapter-number`, `.story-content`, `.oral-history-section`, `.quote-pull`
- **HTML refs:** 0 (note: `stories.html` uses `.story-heading` and `.story-card-image` which are different classes with inline `<style>` definitions on that page)
- **JS refs:** `setupRelatedStories()` and `setupChapterNavigation()` — each guarded by element-existence checks
- **Lines removed:** ~248

#### 12a. Transcription & Waveform (5761–5900)
- **Purpose:** Real-time transcript sync during audio playback; waveform animation
- **Classes:** `.transcription-panel`, `.transcript-line`, `.transcript-line.active`, `.waveform-bar`, `.waveform-container`
- **HTML refs:** 0
- **JS refs:** `setupTranscriptionSync()` and `setupWaveformAnimation()` guarded by element-existence checks
- **Lines removed:** ~140

#### 12b. Fullscreen Gallery (5901–6050)
- **Purpose:** Immersive fullscreen artwork viewer with keyboard navigation
- **Classes:** `.fullscreen-gallery`, `.fullscreen-gallery-image`, `.fullscreen-gallery-close`, `.fullscreen-gallery-nav`, `.fullscreen-gallery-info`
- **HTML refs:** 0
- **JS refs:** `setupFullscreenGallery()` at micro-interactions.js:1129 — `var gallery = document.querySelector('.fullscreen-gallery')` — element does not exist; `gallery?.querySelector()` returns undefined; function proceeds but produces no visible effect
- **Lines removed:** ~150

#### 12c. Keyboard Shortcuts Dialog (6051–6180)
- **Purpose:** Modal overlay listing all keyboard shortcuts (the `?` key feature)
- **Classes:** `.shortcuts-dialog`, `.shortcuts-dialog-backdrop`, `.shortcuts-list`, `.shortcut-row`, `.shortcut-key`, `.shortcut-description`
- **HTML refs:** 0
- **JS refs:** `setupShortcutsDialog()` guarded by `var dialog = document.querySelector('.shortcuts-dialog'); if (!dialog) return;`
- **Notes:** `setupEnhancedShortcuts()` (the P/N/V shortcut handler) is live and correctly in Zone A of micro-interactions.js — it does not depend on these CSS classes
- **Lines removed:** ~130

#### 12d. User Preferences Panel (6181–6274)
- **Purpose:** Slide-out settings panel for user preferences (focus mode, reduced motion, font size)
- **Classes:** `.preferences-panel`, `.preferences-panel.open`, `.preferences-close`, `.preference-item`, `.preference-toggle`, `.preference-toggle.active`, `.preferences-overlay`
- **HTML refs:** 0
- **JS refs:** `setupPreferencesPanel()` at micro-interactions.js:1165 — guarded by `var panel = document.querySelector('.preferences-panel'); if (!panel) return;` at line 1169. The `focus-mode` toggle at line 1190 is inside the `panel.querySelectorAll('.preference-toggle')` forEach — this forEach never executes because the function returns early.
- **Lines removed:** ~94

**Zone E total: 1,694 lines / ~37,148 raw bytes / ~6,828 gzipped bytes**

---

## Removal Block 2 — Zone F: Targeted Dead Sections in "VISUAL DESIGN SYSTEM v2"

The V2 section (lines 6275–6958 in original file) is a mixed zone. Only sections where every selector has zero live references are removed. Sections with even one live selector are preserved in full.

### 2a. `.metadata-label, .page-eyebrow` (original lines 6351–6362)
- **Purpose:** Archive metadata label styling for a planned "eyebrow" label above section headings
- **Classes:** `.metadata-label`, `.page-eyebrow`
- **HTML refs:** 0 (verified with precise class-token matching)
- **JS refs:** 0
- **Dependencies investigated:** No other CSS rule references these classes; removing has no cascade effect
- **Lines removed:** 12

### 2b. `.page-section` + `::before` (original lines 6392–6406)
- **Purpose:** Section divider drawn as a centered gradient line above each `.page-section`
- **Classes:** `.page-section`, `.page-section::before`
- **HTML refs:** 0 (verified with class-token matching)
- **JS refs:** 0
- **Dependencies investigated:** None
- **Lines removed:** 15

### 2c. Gallery image treatment + `.image-with-backdrop` + `.card-featured` + `.work-featured` (original lines 6459–6475)
- **Purpose:** Border/shadow treatment for artwork display images, backdrop color container, and featured work frames
- **Classes:** `.artwork-display img` (this specific block), `.hero-image img`, `.image-with-backdrop`, `.card-featured`, `.work-featured`
- **HTML refs:** 0 (verified)
- **JS refs:** `micro-interactions.js:750` references `.image-with-backdrop img` but via `querySelectorAll` which returns empty NodeList — no-op
- **Note:** A DIFFERENT `.artwork-display img` rule is also in this zone (Section 9 Museum Aesthetic) — both are dead. The `.artwork-display` class does not exist in any HTML page.
- **Lines removed:** 17

### 2d. Shadows & Depth section (Section 5) (original lines 6477–6502)
- **Purpose:** Box-shadow depth system for card components
- **Classes:** `.card`, `.stat-card`, `.story-card`, `.chapter-item` (and `:hover` variants), `.modal-backdrop`, `.quick-preview-modal`
- **HTML refs:** 0 (precise token check confirms `.card` as bare class does not appear — `explore-card`, `archive-card`, etc. are compound names that do NOT match `.card`)
- **JS refs:** 0 for modal-backdrop; stat-card / story-card / chapter-item already confirmed dead (Zone E)
- **Dependencies investigated:** Section 6 (`* { --transition-duration }`) is kept; removing Section 5 does not affect it
- **Lines removed:** 26

### 2e. Archive page visual hierarchy header + `.filter-section-header` (original lines 6581–6614)
- **Purpose:** Section header styling for filter panels ("Collage", "Sculpture" etc.) and medium-specific icon prefixes
- **Classes:** `.filter-section-header`, `.collage-section .filter-section-header::before`, `.sculpture-section .filter-section-header::before`, `.photography-section .filter-section-header::before`, `.painting-section .filter-section-header::before`
- **HTML refs:** 0 for all selectors (`.filter-section-header`, `.collage-section`, `.sculpture-section`, `.photography-section`, `.painting-section`)
- **JS refs:** `micro-interactions.js:304` — `document.querySelectorAll('.filter-section-header')` inside `setupCollapsibleFilters()` — returns empty NodeList, forEach is a no-op
- **Note:** `.thumb:nth-child(5n+1)` and `.thumb:nth-child(13n+1)` rules on lines 6616–6623 are retained (target live `.thumb` elements)
- **Lines removed:** 34

### 2f. Artwork Page — Museum Aesthetic (Section 9) (original lines 6625–6705)
- **Purpose:** Full museum-style artwork detail page layout: page header, title treatment, metadata grid, image container, gallery display, related works section
- **Classes:** `.artwork-page-header`, `.artwork-title`, `.artwork-metadata`, `.artwork-meta-item`, `.artwork-meta-label`, `.artwork-meta-value`, `.artwork-container`, `.artwork-display` (this block), `.artwork-display img` (this block), `.related-works`, `.related-works-label`
- **HTML refs:** 0 for all. Note: `artwork.html` uses `id="related-works"` and `id="related-works-section"` (ID selectors), not `class="related-works"`. The CSS targets class selectors — entirely different.
- **JS refs:** `.artwork-display` is referenced in `micro-interactions.js:950` (inside `setupExportModal` Phase 10 dead zone) and `micro-interactions.js:1132` (inside `setupFullscreenGallery` Phase 12 dead zone). Both are in dead Phase 10–12 functions guarded by non-existent elements.
- **Dependencies investigated:** `artwork.html` has its own inline `<style>` for artwork page layout — this removal has no effect on artwork page rendering
- **Lines removed:** 81

### 2g. Focus Mode (Section 10) (original lines 6707–6731)
- **Purpose:** "Distraction-free" reading mode toggling via `body.focus-mode` class
- **Classes:** `body.focus-mode`, `body.focus-mode header`, `body.focus-mode nav`, `body.focus-mode header:hover`, `body.focus-mode nav:hover`, `body.focus-mode .artwork-display`
- **HTML refs:** 0 (precise class-token check: `focus-mode` never appears as a class in any HTML file)
- **JS refs:** `micro-interactions.js:1190` — `document.body.classList.toggle('focus-mode')` inside `setupPreferencesPanel()`. Guard at line 1169: `if (!panel) return;` where `panel = document.querySelector('.preferences-panel')` returns null (element does not exist). The toggle never executes.
- **Dependencies investigated:** None
- **Lines removed:** 25

### 2h. Duplicate `.thumb` animation + `@keyframes grid-entrance-slow` + `.card:hover` hover lift (original lines 6749–6770)

This block resolves Anomaly 1 documented above.

- **`.thumb { animation: grid-entrance-slow }` (lines 6750–6753)**
  - **Classification:** Duplicate with accessibility defect (overrides reduced-motion guard)
  - **Effect of removal:** Phase 3 `grid-entrance` animation (line 3455) becomes the effective `.thumb` animation. The stagger mechanism (`--stagger-index` set by `micro-interactions.js`) is restored. The reduced-motion guard at line 3474 again correctly suppresses the animation.
  - **HTML refs:** Not applicable (selector is live, but the rule is a duplicate that produces a regression)

- **`@keyframes grid-entrance-slow` (lines 6755–6764)**
  - **Classification:** Confirmed dead after removal of its sole consumer (line 6750 above)
  - **HTML refs:** Not applicable (keyframe, not a selector)
  - **JS refs:** 0

- **`.card:hover, .stat-card:hover { transform: translateY(-4px) }` (lines 6767–6770)**
  - **Classification:** Confirmed dead — `.card` bare class: 0 HTML refs (precise token check); `.stat-card`: 0 HTML refs
  - **Note:** This is a second hover lift definition for `.card:hover` in this section. The first is at line 6489 (removed in block 2d above).
  - **Lines removed:** 22

### 2i. `.card-bg` utility (original lines 6774–6777)
- **Purpose:** Surface background color shorthand for card backgrounds
- **Classes:** `.card-bg`
- **HTML refs:** 0 (precise token check)
- **JS refs:** 0
- **Lines removed:** 4

### 2j. `.scroll-anchor` utility (original lines 6805–6809)
- **Purpose:** Scroll margin for heading anchor links
- **Classes:** `.scroll-anchor`
- **HTML refs:** 0 (precise token check)
- **JS refs:** 0
- **Lines removed:** 5

### 2k. `.code-block` utility (original lines 6850–6860)
- **Purpose:** Styled code block with monospace font and border
- **Classes:** `.code-block`
- **HTML refs:** 0 (precise token check, including style-guide.html)
- **JS refs:** 0
- **Note:** style-guide.html uses other Section 12 utilities (`nav-link`, `heading-6`, `label-caps`, `color-warm`, `border-warm`, `data-table`, `mono-text`, `pad-sm`, `bg-surface-high`) — all retained. Only `.code-block`, `.card-bg`, and `.scroll-anchor` had zero references even in style-guide.html.
- **Lines removed:** 11

**Zone F total: ~252 lines**

---

## Rules Explicitly Retained (and Why)

The following rules were candidates for removal but are confirmed live:

| Selector | Location | Evidence for retention |
|---|---|---|
| `h1`, `h2`, `h3`, `p` (bare element) | V2 line 6314 | Load-bearing for naked `<h3>` elements in index.html "Where to Begin" section; see Anomaly 2 above |
| `main > section` | V2 line 6421 | Live on `about.html` (6 `<section>` inside `<main>`), `index.html`, and others |
| `.page-transition` (V2, line 6745) | V2 line 6745 | Live — `archive.html:1421` creates overlay with this class; `nav-late.bundle.js:242` adds it to documentElement |
| `@keyframes page-fade-gentle` | V2 line 6736 | Used by `.page-transition` rule above |
| `.lazy-placeholder` | V2 line 6519 | `setupLazyImageFade()` in micro-interactions.js:905 adds this class to all `img[loading="lazy"]` — called live at DOMContentLoaded |
| `html.dark` block (dark mode tokens) | V2 line 6549 | Live — dark mode is a first-class feature; FOUC fix depends on these tokens being available |
| `a`, `button`, `.cursor-pointer` transitions | V2 line 6530 | Live — global link underline and transition system |
| `.flex-no-shrink` | V2 line 6885 | Live — used on 4 SVG icons in `_shared/top-nav.html` mobile drawer, propagated to all 38 root pages via stamp-nav.sh |
| `.border-bottom-soft` | V2 line 6880 | Live — used in `archive.html`, `artwork.html`, `start-here.html` |
| `.decade-heading-sweep` | V2 line 6929 | Live — dynamically created by `_shared/ui.js:153` on decade pages |
| `.medium-page__title-accent` | V2 line 6949 | Live — dynamically created by `_shared/ui.js:525` on theme/medium pages |
| `.medium-grid` (V2 override) | V2 line 6434 | Live — 66+ HTML file references |
| `.thumb` (margin-bottom only, V2 line 6439) | V2 line 6439 | Live — sets `margin-bottom: 1rem` (no animation, no conflict) |
| `.thumb__link img` border/shadow | V2 line 6446 | Live — 13+ HTML file references |
| `focus-mode` body toggle | V2 line 6709 | **Retained because:** Although the JS toggle path is dead (`setupPreferencesPanel()` returns early due to missing `.preferences-panel` element), removing CSS that would be visually load-bearing if the feature were ever enabled falls into uncertain territory. However on further analysis: 0 HTML refs, JS path is provably dead, removed under confirmed-dead classification. |

**Correction:** `body.focus-mode` IS removed (Block 2g above). The analysis confirms the toggle never fires at runtime.

---

## Summary

| Block | Description | Original lines | Lines removed | Gzipped bytes saved |
|---|---|---|---|---|
| 1 | Zone E: Phase 9–12 (entire) | 4581–6274 | 1,694 | ~6,828 |
| 2a | `.metadata-label, .page-eyebrow` | 6351–6362 | 12 | ~90 |
| 2b | `.page-section` + `::before` | 6392–6406 | 15 | ~110 |
| 2c | Gallery image/backdrop/featured frames | 6459–6475 | 17 | ~130 |
| 2d | Shadows & Depth section (Section 5) | 6477–6502 | 26 | ~180 |
| 2e | Filter section headers | 6581–6614 | 34 | ~230 |
| 2f | Artwork museum aesthetic (Section 9) | 6625–6705 | 81 | ~530 |
| 2g | Focus mode (Section 10) | 6707–6731 | 25 | ~165 |
| 2h | Duplicate .thumb + keyframes + .card:hover | 6749–6770 | 22 | ~175 |
| 2i | `.card-bg` utility | 6774–6777 | 4 | ~30 |
| 2j | `.scroll-anchor` utility | 6805–6809 | 5 | ~35 |
| 2k | `.code-block` utility | 6850–6860 | 11 | ~75 |
| **Total** | | | **~1,946** | **~8,578** |

**Independent review pass (2026-06-30):** Post-implementation review found 4 orphaned selectors missed in the initial removal — dark-mode and responsive variants whose base rules had been removed but whose media-query/pseudo-selector variants were between the targeted ranges and were overlooked. Additionally, V2 section numbers (originally 1–4, 6–7, 11–13) had gaps from removed sections; renumbered to 1–9. These were fixed before deployment.

**Review-pass additional removals:**
| Block | Description | Lines removed |
|---|---|---|
| R1 | `html.dark .artwork-display img` (orphaned dark-mode variant) | 1 line from selector |
| R2 | `html.dark .card, html.dark .stat-card` block | 5 |
| R3 | `.artwork-metadata` in @media (max-width: 768px) | 4 |
| R4 | `.artwork-page-header` in @media (max-width: 480px) | 4 |
| R5 | V2 section comment renumbering (1–9, no gaps) | 0 net lines |

**Final verified metrics (post-review):**
- Lines: 5,015 (was 6,958) — 1,943 net lines removed
- Raw bytes: 118,522 (was 158,033) — 39,511 raw bytes saved (25.0%)
- Gzipped bytes: 22,913 (was 28,314) — 5,401 gzipped bytes saved (19.1%)

---

## Validation Results

Validation performed 2026-06-30 against preview server (port 8099, local Python HTTP server at `/Users/jeffreyneumann/Documents/JFSN`).

### Console errors
- Homepage: **0 errors**
- Archive: **0 errors**
- Artwork page (art0001.html): **0 errors**
- About: **0 errors**

### Typography
- `index.html` "Where to Begin" h3 headings: **Playfair Display, 22px, weight 600** ✅ (load-bearing h3 rule confirmed active)
- `about.html` h1: **Playfair Display, large** ✅
- `collage.html` `.medium-page__title` h1: **Playfair Display, large** ✅
- `artworks/pages/art0001.html` h1: **Playfair Display, 28px** ✅

### Thumbnail animation
- `.thumb` on archive page receives `grid-fade-in` from archive.html's own inline `<style>` block (page-level cascade override — pre-existing, unaffected by Phase 2C)
- `grid-entrance-slow` keyframe: **completely absent** from file ✅
- `grid-entrance` (Phase 3, with `--stagger-index` stagger): **restored as effective animation** for pages without inline overrides ✅
- `prefers-reduced-motion` guard at line 3474: **now correctly suppresses animation** (no longer bypassed by the removed `grid-entrance-slow` rule) ✅

### Reduced-motion accessibility
- Three `.thumb { animation: none }` guards found active in browser stylesheet: from ui.css, from archive.html inline style, and from a third source ✅

### Dark mode
- `html.dark` token block confirmed active ✅
- Dark backgrounds, readable text, card contrast verified ✅

### Mobile navigation
- Hamburger drawer opens correctly ✅
- Archive, Series, About, Lost Works items visible with SVG icons ✅
- `.flex-no-shrink` on SVG icons confirmed working ✅

### Search
- ⌘K palette opens correctly ✅
- "Surprise me", series browse list, keyboard shortcuts footer all rendered ✅

### Archive page
- Masonry grid renders ✅
- Decade / medium / series / orientation filters visible ✅
- Sort control present ✅
- Result count ("1,084 results") displayed ✅

### Artwork page
- Image + metadata panel layout intact ✅
- Related works section renders with thumbnails ✅
- Next/prev navigation present ✅
- Footer renders ✅

### Main > section spacing (about.html)
- Six `<section>` elements in `<main>` render with correct spacing ✅

### Pages NOT individually checked but covered by shared template
- `archive.html`, `series.html`, `lost-works.html`, `start-here.html`, `wall.html`, `style-guide.html`, all generated `artworks/pages/art*.html` — all load the same `_shared/ui.css`; no HTML was modified in Phase 2C

---

## Rollback

All changes are git-tracked. Rollback is:

```bash
git checkout HEAD -- _shared/ui.css
```

No other files are modified in Phase 2C.

---

## Deployment Recommendation

**Ready to deploy**, subject to:
1. `CACHE_V` bump in `sw.js` (required per project protocol — service worker caches CSS for returning visitors)
2. `npm run build:css` is NOT required — no Tailwind-dependent selectors were changed
3. Deploy via `bash deploy-hostgator.sh` as usual

---

*This document is the permanent architectural record for these removals. Future maintainers: do not re-add these CSS sections without also building the corresponding HTML infrastructure.*
