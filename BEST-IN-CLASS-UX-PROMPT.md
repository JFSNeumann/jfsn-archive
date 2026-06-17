# Best-in-Class UX/UI: Museum-Grade Micro-Interactions & Animation Refinement

## Vision

Transform JFSN archive from a clean, fast experience into a museum-grade interface with subtle, purposeful micro-interactions. Every animation serves discovery — fades, slides, color shifts, and timing cues that guide without distraction. No decorative motion. No scale/transform on artwork. Respect `prefers-reduced-motion` universally.

**Scope:** 17 items across 4 phases (12–16 hours total)  
**Constraint vocabulary:** fade · slide · color · lift (perspective depth only) · stagger · delay  
**Design tokens:** Warm-brown borders + orange accent + saturation overlay system (existing)  
**Entry point:** Phase A quick wins (2–4h) establish patterns; Phases B–D refine.

---

## Full 17-Item Inventory

### Phase A: Quick Wins (2–4h) ⭐ Start here
1. **Filter chip removal animation** — pulse + slide-left fade + haptic
2. **Data table row hover state** — background shift + border slide-in + text color
3. **Loading state refinement** — progress bar + dot scale stagger
4. **Cursor feedback tooltip** — "Click to view" fade-in at 300ms delay

### Phase B: State & Transition (4–6h)
5. **Page transitions** — fade-through-color overlay on nav (archive ↔ artwork)
6. **Archive grid staggered entrance** — items slide-up + fade in 40ms stagger (left→right, top→bottom)
7. **Related works sidebar** — staggered card entrance (50ms per card, fade + slide-up)
8. **Form input check animation** — checkbox/radio scale-in bounce on check
9. **Breadcrumb color shift** — current page text slides orange on focus

### Phase C: Refinements (2–4h)
10. **Hover link underline animation** — `⌘K` bracket links draw underline (color + width scale)
11. **Table sort indicator animation** — arrow rotates + color shifts on active sort column
12. **Search result highlight flash** — matching text gets subtle yellow flash on load
13. **Artwork modal entrance** — backdrop blur fade-in + image scale-in (100ms offset)
14. **Mobile gesture feedback** — swipe to navigate decade pages, haptic on slide-end

### Phase D: Polish (1–2h)
15. **Scrollbar styling** — custom warm-brown scrollbar (desktop only, system default fallback)
16. **Focus ring animation** — focus state outline pulses orange (200ms cycle) on keyboard nav
17. **Success/error toast animation** — slide-in from top, color-coded (green/red), auto-fade after 3s

---

## Phase A: Quick Wins Detailed (2–4h)

### 4.1 Filter Chip Removal Animation
**File:** `archive.html` (look for `.filter-chip` or `#filter-chips`)  
**Effort:** 30 min

**What:** When user clicks chip's × button, animate out:
- **150ms color pulse** (orange flash, 1 beat) 
- **200ms slide-left fade** (translateX(-20px) + opacity 0)
- Mobile: Add `navigator.vibrate(20)` haptic pulse on click

**CSS to add** (in `_shared/ui.css`):
```css
@keyframes chip-remove {
  0% { transform: translateX(0); opacity: 1; }
  100% { transform: translateX(-20px); opacity: 0; }
}

@keyframes chip-pulse {
  0%, 100% { background-color: #ebe8e2; }
  50% { background-color: #FFB366; }
}

.filter-chip.removing {
  animation: chip-pulse 0.15s ease, chip-remove 0.2s ease-out forwards;
}
```

**JS to add** (in archive.html or ui.js):
```js
document.querySelectorAll('.filter-chip .remove-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const chip = btn.closest('.filter-chip');
    chip.classList.add('removing');
    if (navigator.vibrate) navigator.vibrate(20);
    setTimeout(() => chip.remove(), 200);
  });
});
```

**Test:** Click chip × → see color pulse + slide-left fade  
**Mobile test:** iPhone 15 Pro, device vibrates on removal

---

### 4.2 Data Table Row Hover State
**File:** `archive.html` or `style-guide.html` (data table `<table>`)  
**Effort:** 40 min

**What:** On row hover:
- Background transitions to `#ebe8e2` (100ms ease)
- Work ID text transitions to orange-ink `#B84700` (same timing)
- Left border accent slides in (2px, `#FF6600`, scaleX 0→1, 150ms)

**CSS to add** (in `_shared/ui.css`):
```css
table tbody tr {
  transition: background-color 0.1s ease;
  position: relative;
}

table tbody tr::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #FF6600;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.15s ease;
}

table tbody tr:hover {
  background-color: #ebe8e2;
}

table tbody tr:hover::before {
  transform: scaleX(1);
}

table tbody tr:hover td:first-child {
  color: #B84700;
  transition: color 0.1s ease;
}
```

**Test:** Hover table row → background shifts, left border slides in, Work ID turns orange  
**Mobile test:** Tap row (focus simulation on supported browsers)

---

### 4.3 Loading State Refinement
**File:** `archive.html` (look for `#filter-loading` or `.loading-indicator`)  
**Effort:** 30 min

**What:** Enhance existing pulsing dots:
- Add subtle **progress bar** above grid (fills 0→90% over 200ms while loading)
- Refine **dot animation** (scale 0.8→1.0 with stagger, more visible)

**CSS to add** (in `_shared/ui.css`):
```css
@keyframes dot-pulse-scale {
  0%, 100% { transform: scale(0.8); opacity: 0.6; }
  50% { transform: scale(1); opacity: 1; }
}

@keyframes progress-fill {
  0% { width: 0%; }
  100% { width: 90%; }
}

.filter-loading {
  position: relative;
  margin-bottom: 16px;
}

.filter-loading::before {
  content: '';
  position: absolute;
  top: -4px;
  left: 0;
  height: 2px;
  background-color: #FF6600;
  animation: progress-fill 0.2s ease forwards;
}

.loader-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #FF6600;
  margin: 0 4px;
  animation: dot-pulse-scale 1s infinite;
}

.loader-dot:nth-child(1) { animation-delay: 0s; }
.loader-dot:nth-child(2) { animation-delay: 0.1s; }
.loader-dot:nth-child(3) { animation-delay: 0.2s; }
```

**Test:** Apply filter → see progress bar fill + dots pulse with stagger  
**Check:** After load, progress bar holds at 90%, dots stop

---

### 4.4 Cursor Feedback on Artworks (Tooltip)
**File:** `_shared/ui.css` (`.thumb__link` or artwork hover state)  
**Effort:** 20 min

**What:** On hover over artwork thumbnail:
- Cursor already set to `zoom-in` ✓
- Add optional **tooltip** "Click to view" (fade-in at 300ms delay)

**CSS to add** (in `_shared/ui.css`):
```css
.thumb__link::after {
  content: 'Click to view';
  position: absolute;
  bottom: -24px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(11, 11, 11, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 3px;
  font-size: 10px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease 0.3s; /* 300ms delay */
  z-index: 10;
}

.thumb__link:hover::after {
  opacity: 1;
}

/* Disable tooltip on touch devices */
@media (hover: none) {
  .thumb__link::after {
    display: none;
  }
}
```

**Constraint:** Don't scale the image itself (banned). Tooltip only.

**Test:** Hover thumbnail → tooltip appears after 300ms, reads "Click to view"  
**Mobile test:** No tooltip on tap (disabled via `@media (hover: none)`)

---

## Phase B: State & Transition Detailed (4–6h)

### 5. Page Transitions
**File:** All page navigation routes  
**Effort:** 1h

**What:** Fade-through-color overlay when navigating between pages.

**Decision Point:** Which pages?  
- Option A: All internal nav (archive → artwork → series → etc.)
- Option B: Archive-only (archive ↔ artwork detail)
- **Recommendation:** Archive-only for Phase A (less disruptive, easier to test)

**CSS:**
```css
@keyframes page-fade {
  0% { opacity: 0; }
  50% { opacity: 0.08; }
  100% { opacity: 0; }
}

.page-transition {
  position: fixed;
  inset: 0;
  background-color: #0B0B0B;
  opacity: 0;
  pointer-events: none;
  animation: page-fade 0.2s ease forwards;
  z-index: 999;
}
```

**JS:**
```js
// On internal nav link click:
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href*="#"]');
  if (!link) return;
  
  const overlay = document.createElement('div');
  overlay.className = 'page-transition';
  document.body.appendChild(overlay);
  
  setTimeout(() => { link.click(); overlay.remove(); }, 100);
});
```

**Test:** Navigate archive → artwork detail → see fade-through-color overlay

---

### 6. Archive Grid Staggered Entrance
**File:** `archive.html` (grid container + `.thumb` items)  
**Effort:** 1.5h

**What:** When archive grid loads, items fade + slide-up with 40ms stagger per item (left→right, top→bottom).

**Decision Point:** Inline delay styles or JS loop?  
- Option A: `animation-delay` inline on each `.thumb` (smaller JS footprint)
- Option B: JS loop adding `--delay` CSS variable (more flexible)
- **Recommendation:** CSS variables + JS (cleaner, easier to adjust)

**CSS:**
```css
@keyframes grid-enter {
  0% {
    opacity: 0;
    transform: translateY(16px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.thumb {
  animation: grid-enter 0.6s ease-out forwards;
  animation-delay: var(--delay, 0);
}

@media (prefers-reduced-motion: reduce) {
  .thumb {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
```

**JS** (in archive.html or ui.js):
```js
function staggerGridItems() {
  const items = document.querySelectorAll('.thumb');
  const columns = Math.ceil(window.innerWidth / 280); // rough column count
  
  items.forEach((item, i) => {
    const row = Math.floor(i / columns);
    const col = i % columns;
    const delay = (row * columns + col) * 0.04; // 40ms stagger
    item.style.setProperty('--delay', `${delay}s`);
  });
}

document.addEventListener('DOMContentLoaded', staggerGridItems);
window.addEventListener('resize', staggerGridItems);
```

**Test:** Load archive.html → grid items fade + slide-up with visible stagger  
**Reduced motion test:** No animation, items visible immediately

---

### 7. Related Works Sidebar
**File:** `artwork.html` (related works section)  
**Effort:** 1h

**What:** Related works cards fade + slide-up with 50ms stagger per card.

**CSS:**
```css
@keyframes related-enter {
  0% {
    opacity: 0;
    transform: translateY(12px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.related-work-card {
  animation: related-enter 0.5s ease-out forwards;
  animation-delay: var(--delay, 0);
}

@media (prefers-reduced-motion: reduce) {
  .related-work-card {
    animation: none;
  }
}
```

**JS:**
```js
const cards = document.querySelectorAll('.related-work-card');
cards.forEach((card, i) => {
  card.style.setProperty('--delay', `${i * 0.05}s`);
});
```

**Test:** Open artwork → related works slide up with stagger

---

### 8. Form Input Check Animation
**File:** Any `<input type="checkbox">` or `<input type="radio">`  
**Effort:** 45 min

**What:** On check/uncheck, checkmark/radio dot scales in (1.0 → 1.2 → 1.0, 150ms bounce).

**CSS:**
```css
@keyframes check-scale {
  0% { transform: scale(0.8); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

input[type="checkbox"]:checked,
input[type="radio"]:checked {
  animation: check-scale 0.15s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@media (prefers-reduced-motion: reduce) {
  input[type="checkbox"]:checked,
  input[type="radio"]:checked {
    animation: none;
  }
}
```

**Test:** Check/uncheck filter checkboxes → see bounce scale animation

---

### 9. Breadcrumb Color Shift
**File:** `artwork.html` breadcrumb trail  
**Effort:** 30 min

**What:** Current page link text slides from `#0B0B0B` to `#B84700` (orange-ink) when page loads or focus enters breadcrumb.

**CSS:**
```css
.breadcrumb-current {
  color: #0B0B0B;
  transition: color 0.3s ease;
}

.breadcrumb-current:focus,
.breadcrumb.active .breadcrumb-current {
  color: #B84700;
}
```

**Test:** Open artwork detail → breadcrumb "current page" turns orange

---

## Phase C: Refinements Detailed (2–4h)

### 10. Hover Link Underline Animation
**File:** `⌘K` bracket links (`[ EXPLORE → ]`)  
**Effort:** 45 min

**What:** Underline draws from left-to-right on hover, plus color shift from `#0B0B0B` to `#B84700`.

**CSS:**
```css
@keyframes underline-draw {
  0% {
    width: 0;
    left: 0;
  }
  100% {
    width: 100%;
    left: 0;
  }
}

.bracket-link {
  position: relative;
  color: #0B0B0B;
  transition: color 0.2s ease;
  text-decoration: none;
}

.bracket-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #FF6600;
  animation: underline-draw 0.3s ease forwards;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.bracket-link:hover {
  color: #B84700;
}

.bracket-link:hover::after {
  opacity: 1;
}
```

**Test:** Hover over bracket link → underline draws + text turns orange

---

### 11. Table Sort Indicator Animation
**File:** `archive.html` data table headers  
**Effort:** 45 min

**What:** When column is sorted, arrow rotates (180°) + color shifts to `#B84700`.

**CSS:**
```css
@keyframes arrow-rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(180deg); }
}

.sort-arrow {
  display: inline-block;
  color: #575757;
  transition: color 0.2s ease;
}

.sort-column .sort-arrow {
  color: #B84700;
  animation: arrow-rotate 0.3s ease;
}
```

**Test:** Click table sort header → arrow rotates + turns orange

---

### 12. Search Result Highlight Flash
**File:** `search.js` or search results display  
**Effort:** 30 min

**What:** Matching text gets subtle yellow flash on load (300ms duration, 30% opacity yellow).

**CSS:**
```css
@keyframes search-flash {
  0% { background-color: rgba(255, 255, 0, 0.3); }
  100% { background-color: rgba(255, 255, 0, 0); }
}

.search-match {
  animation: search-flash 0.3s ease-out;
}
```

**JS:**
```js
// On search result render:
const matches = document.querySelectorAll('.search-result .work-title');
matches.forEach(m => m.classList.add('search-match'));
```

**Test:** Search for term → results highlight yellow then fade

---

### 13. Artwork Modal Entrance
**File:** `artwork.html` modal or lightbox (if added)  
**Effort:** 1h

**What:** Backdrop blur fades in (150ms) + image scales in with 100ms offset (scale 0.9 → 1.0).

**CSS:**
```css
@keyframes backdrop-blur-in {
  0% { backdrop-filter: blur(0px); opacity: 0; }
  100% { backdrop-filter: blur(4px); opacity: 1; }
}

@keyframes image-scale-in {
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.modal-backdrop {
  animation: backdrop-blur-in 0.15s ease forwards;
}

.modal-image {
  animation: image-scale-in 0.3s ease forwards;
  animation-delay: 0.1s;
}
```

**Test:** Open artwork modal → backdrop blurs in, image scales in after

---

### 14. Mobile Gesture Feedback
**File:** `_shared/ui.js` (decade navigation)  
**Effort:** 1.5h

**What:** Swipe left/right to navigate decade pages. Haptic feedback on slide-end (if supported).

**JS:**
```js
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].clientX;
});

document.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].clientX;
  handleSwipe();
});

function handleSwipe() {
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) > 50) { // threshold: 50px
    if (diff > 0) { // swipe left
      navigateDecade('next');
    } else { // swipe right
      navigatePrevious('prev');
    }
    if (navigator.vibrate) navigator.vibrate([10, 5, 10]); // haptic pattern
  }
}
```

**Test:** On mobile, swipe left/right between decades → haptic feedback on slide-end

---

## Phase D: Polish (1–2h)

### 15. Scrollbar Styling
**File:** `_shared/ui.css`  
**Effort:** 20 min

**What:** Custom scrollbar matching design tokens (warm-brown + orange hover).

**CSS:**
```css
/* Webkit browsers */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: #8e7164; /* warm-brown */
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #FF6600; /* orange on hover */
}

/* Firefox */
* {
  scrollbar-color: #8e7164 transparent;
  scrollbar-width: thin;
}

@media (prefers-reduced-motion: reduce) {
  ::-webkit-scrollbar-thumb {
    transition: none;
  }
}
```

**Fallback:** System default scrollbar on older browsers (no error).

**Test:** Desktop only. Scroll page → custom scrollbar visible, orange on hover.

---

### 16. Focus Ring Animation
**File:** `_shared/ui.css`  
**Effort:** 30 min

**What:** Focus state outline pulses orange (200ms cycle) on keyboard nav.

**CSS:**
```css
@keyframes focus-pulse {
  0%, 100% { outline-color: rgba(255, 102, 0, 0.5); }
  50% { outline-color: rgba(255, 102, 0, 1); }
}

*:focus-visible {
  outline: 2px solid #FF6600;
  animation: focus-pulse 0.2s infinite;
}

@media (prefers-reduced-motion: reduce) {
  *:focus-visible {
    animation: none;
    outline: 2px solid #FF6600;
  }
}
```

**Test:** Tab through nav links → focus ring pulses orange

---

### 17. Success/Error Toast Animation
**File:** Toast or notification component  
**Effort:** 45 min

**What:** Toast slides in from top (200ms), holds for 3s, slides out + fades (200ms). Color-coded: green for success, red for error.

**CSS:**
```css
@keyframes toast-slide-in {
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes toast-slide-out {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-100%);
    opacity: 0;
  }
}

.toast {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 20px;
  border-radius: 4px;
  z-index: 1000;
  animation: toast-slide-in 0.2s ease forwards;
}

.toast.success {
  background-color: #4CAF50;
  color: white;
}

.toast.error {
  background-color: #F44336;
  color: white;
}

.toast.exit {
  animation: toast-slide-out 0.2s ease forwards;
}
```

**JS:**
```js
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('exit');
    setTimeout(() => toast.remove(), 200);
  }, 3000);
}

// Usage: showToast('Work added to favorites!', 'success');
```

**Test:** Trigger success/error action → toast slides in, holds, slides out

---

## Decision Points (Answer Before Phase A)

**Q1: Staggered Grid Animations**  
Archive grid items fade + slide-up with 40ms stagger per item?  
- [ ] Yes, proceed (Recommended)
- [ ] No, skip for now

**Q2: Page Transitions**  
Fade-through-color overlay on nav?  
- [ ] All internal nav
- [ ] Archive-only (Recommended)
- [ ] Skip for now

**Q3: Mobile Haptic Feedback**  
Filter chip removal + swipe gestures trigger `navigator.vibrate()`?  
- [ ] Yes, include (Recommended)
- [ ] No, skip haptics

**Q4: Scrollbar Styling**  
Custom warm-brown/orange scrollbar (desktop only)?  
- [ ] Yes, add it
- [ ] No, save for later (Recommended — low ROI)

---

## Design Tokens

**Colors:**
- Primary text: `#0B0B0B` (deep-ink)
- Secondary text: `#575757` (archive-gray)
- Accent (hover/fills): `#FF6600` (international-orange)
- Accent (persistent text on light bg): `#B84700` (orange-ink)
- Warm-brown border: `#8e7164` (archival-outline)
- Soft border: `#e3bfb1` (archival-outline-soft)
- Background: `#fcf9f3` (bone-white) or `#fdf8f8` (light)
- Hover background: `#ebe8e2` (surface-container-high)

**Timing:**
- Quick interactions: 0.15s (chip pulse, focus ring)
- Standard transitions: 0.2s–0.3s (hover, color shift)
- Entrance animations: 0.5s–0.6s (grid items, cards)
- Delays: 0.04s–0.3s (stagger, deferred entrance)
- Toast hold: 3000ms (3 seconds)

**Easing:**
- Entrance: `ease-out` (grid, cards)
- Hover: `ease` (standard)
- Bounce: `cubic-bezier(0.68, -0.55, 0.265, 1.55)` (scale animations)
- Linear: `linear` (progress bar, loading dots)

---

## Accessibility & Testing

### Mandatory Rules
1. **Respect `prefers-reduced-motion`** — all animations must disable when system preference is ON
   ```css
   @media (prefers-reduced-motion: reduce) {
     * { animation: none !important; }
   }
   ```

2. **No animation on artwork images** — constraint still stands
   - Grid items fade/slide, but image itself does NOT scale, transform, or filter
   - Caption/metadata can animate; image cannot

3. **Haptic feedback fallback** — check `navigator.vibrate` exists before calling
   ```js
   if (navigator.vibrate) navigator.vibrate(20);
   ```

4. **Focus indicators must remain visible** — focus-visible outline always 2px minimum

5. **Test on real devices** — mobile animation feels different at 60fps on hardware vs. browser

### Testing Checklist (After Each Item)

- [ ] **Visual test** on desktop (Chrome/Safari, DevTools, animation timing visible)
- [ ] **Mobile test** on iPhone 15 Pro (375px viewport, 60fps check)
- [ ] **Reduced motion test** (System → Accessibility → Reduce Motion → ON; animations must disable)
- [ ] **Keyboard nav test** (Tab through all interactive elements, focus rings visible)
- [ ] **Performance check** (Lighthouse on affected page; LCP must not degrade, CLS ≤ 0.1)
- [ ] **Console clean** (no errors, no warnings)
- [ ] **Touch-friendly delays** (300ms+ delay on tooltip/hover to avoid false positives on mobile)
- [ ] **Color contrast** (any text change must maintain WCAG AA ratio)

---

## Phase Roadmap & Commit Strategy

### Phase A: Launch (2–4h)
1. Add 4 quick-win animations to `_shared/ui.css` + `archive.html`/`ui.js`
2. Test each item before moving to next
3. **Commit:** `Phase A: Micro-interactions (chip removal, table hover, loader, tooltip)`
4. Run `npm run build:css` (CSS rebuild required)
5. Bump `CACHE_V` in `sw.js` + commit
6. Deploy to HostGator via JFSN.app
7. Test live at jfsn.com + screenshot/video each animation

### Phase B: State & Transition (4–6h)
1. Items 5–9 from Phase B detailed specs
2. Test each on preview before moving to next
3. **Commit:** `Phase B: Page transitions, grid stagger, form animations, breadcrumbs`
4. Deploy + verify live

### Phase C: Refinements (2–4h)
1. Items 10–14 from Phase C detailed specs
2. Test on both desktop and mobile
3. **Commit:** `Phase C: Link underlines, sort animations, search highlights, modals, gestures`
4. Deploy + verify live

### Phase D: Polish (1–2h)
1. Items 15–17 from Phase D detailed specs
2. Final accessibility sweep (reduced motion, focus rings, contrast)
3. **Commit:** `Phase D: Scrollbar, focus pulse, toasts`
4. Final Lighthouse check
5. Deploy + announce completion

---

## Build & Deploy Notes

**CSS Rebuild Rule:** After any Phase commit, run:
```bash
npm run build:css
```

This regenerates `site.min.css` from Tailwind + custom `_shared/ui.css` rules.

**Service Worker Cache Bump:** After every CSS rebuild:
1. Edit `sw.js`, find `CACHE_V = "jfsn-YYYYMMDD-HHMMSS"`
2. Bump timestamp: `CACHE_V = "jfsn-20260617-145000"`
3. Commit separately: `Bump CACHE_V for CSS rebuild`

**Deploy:**
- Via desktop JFSN.app to HostGator (primary)
- Optional: `bash deploy-netlify.sh` → (--check) → (live) for Netlify mirror

**Verification:**
- Live at jfsn.com, test all animations on desktop + iPhone 15 Pro
- Run Lighthouse: archive.html should maintain LCP ~3.9s, CLS ≤ 0.1
- Record video of each Phase completion for portfolio/documentation

---

## Reference

**Design tokens:** See CLAUDE.md § "Design System (current)"  
**Animation constraints:** See CLAUDE.md § "Artwork thumbnails — core rule"  
**CSS build:** `npm run build:css` (Tailwind → `site.min.css`)  
**UI utilities:** `_shared/ui.css` (shared animations + interactions)  
**Mobile test device:** iPhone 15 Pro, 375px viewport  
**Reduced motion system setting:** macOS → System Settings → Accessibility → Display → Reduce Motion

---

## Start Here: Phase A Checklist

- [ ] Review decisions (Q1–Q4 above)
- [ ] Open http://localhost:8099 (preview)
- [ ] Open `_shared/ui.css` in editor
- [ ] Implement 4.1 (chip removal)
- [ ] Test 4.1 on desktop + iPhone 15 Pro
- [ ] Implement 4.2 (table hover)
- [ ] Test 4.2
- [ ] Implement 4.3 (loading state)
- [ ] Test 4.3
- [ ] Implement 4.4 (tooltip)
- [ ] Test 4.4
- [ ] All tests pass + console clean
- [ ] `git add -A && git commit -m "Phase A: ..."`
- [ ] `npm run build:css`
- [ ] Bump CACHE_V + commit
- [ ] Deploy + verify live at jfsn.com

Good luck. You've got this. 🎨
