# Session 57: Best-in-Class UX/UI — Phase A (Quick Wins)

## Start Here

You're implementing museum-grade micro-interactions and animation refinement. Session 56 created the design system showcase and scoped all work.

**Reference:** `/Documents/JFSN/BEST-IN-CLASS-UX-PROMPT.md` — full specs, all 17 items, Tier 1–4 roadmap.

---

## 1. Verify Current State

```bash
cd /Users/jeffreyneumann/Documents/JFSN
git status
git log --oneline -5
```

✓ Latest commit should be "Session update 2026-06-17 14:02" with BEST-IN-CLASS-UX-PROMPT.md  
✓ Backups complete (check /Volumes/JEFFS-4TB/JFSN-backup/ modification time)  
✓ Preview server running on port 8099

---

## 2. Preview Setup

```bash
npm run serve
# Preview at http://localhost:8099
```

Test on:
- Desktop (full width)
- Mobile (iPhone 15 Pro 375px viewport, use DevTools)

---

## 3. Decision Points — Answer These Now

Before implementing, decide:

**Q1: Staggered Grid Animations**
- Archive grid items fade in + slide up with 40ms stagger per item (left→right, top→bottom)
- Requires either: (a) inline `animation-delay` styles, or (b) small JS loop adding delays
- **Your call:** Proceed with this? (Recommended: YES, high impact)

**Q2: Page Transitions**
- Fade-through-color overlay (200ms, 8% opacity) when navigating
- Which pages? (a) all internal nav, or (b) just archive → artwork detail?
- **Your call:** All nav or archive-only? (Recommended: archive-only, simpler)

**Q3: Mobile Haptic Feedback**
- Filter chip removal triggers `navigator.vibrate(20)` if available
- **Your call:** Include this? (Recommended: YES, great UX signal, no fallback needed)

**Q4: Scrollbar Styling**
- Custom scrollbar matching design tokens (archival warm-brown, hover orange)
- Desktop only. System default fallback on older browsers.
- **Your call:** Worth adding? (Recommended: NO, very low ROI, save for Phase C if energy)

---

## 4. Phase A: Quick Wins (2–4 hours)

Implement these 4 items in order. Test each on preview before moving to next.

### 4.1 Filter Chip Removal Animation
**File:** `archive.html` (look for `.filter-chip` or `#filter-chips`)  
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

**Test:** Click chip × button → see color pulse + slide-left fade  
**Mobile test:** iPhone 15 Pro, device vibrates on removal (if haptic enabled)

---

### 4.2 Data Table Row Hover State
**File:** `archive.html` or `style-guide.html` (data table `<table>`)  
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

**Test:** Hover over table row → background shifts, left border slides in, Work ID turns orange  
**Mobile test:** Tap row on iPhone (on supported browsers, hover simulates via focus)

---

### 4.3 Loading State Refinement
**File:** `archive.html` (look for `#filter-loading` or `.loading-indicator`)  
**What:** Enhance the existing pulsing dots loader:
- Add a subtle **progress bar** above grid (fills 0→90% over 200ms while loading)
- Refine the **dot animation** (scale 0.8→1.0 with stagger, more visible pulse)

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

**Test:** Apply a filter on archive.html → see progress bar fill + dots pulse with stagger  
**Check:** After grid loads, progress bar holds at 90% then fades, dots stop

---

### 4.4 Cursor Feedback on Artworks (Tooltip)
**File:** `_shared/ui.css` (`.thumb__link` or artwork hover state)  
**What:** On hover over artwork thumbnail:
- Cursor already set to `zoom-in` ✓
- Add optional **tooltip** "Click to view" (fade-in at 300ms delay, fade-out on leave)

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
```

**Constraint:** Don't scale the image itself (banned). Tooltip only.

**Test:** Hover over thumbnail → tooltip appears after 300ms delay, reads "Click to view"  
**Mobile test:** No tooltip on tap (::after disabled in touch context, or add `@media (hover: hover)`)

---

## 5. Testing Checklist (After Each Item)

- [ ] **Visually test** on desktop (full width, DevTools open to watch animation timing)
- [ ] **Mobile test** on iPhone 15 Pro (375px viewport, animation feels responsive not jarring)
- [ ] **Reduced motion test** (System Prefs → Accessibility → Reduce Motion → ON; animations should disable)
- [ ] **No performance regression** (Lighthouse on archive.html; LCP should stay ~3.9s, CLS ≤ 0.1)
- [ ] **Console clean** (no errors or warnings)

---

## 6. After Phase A: Commit & Next Steps

**When all 4 items pass testing:**

```bash
git add -A
git commit -m "Phase A: Micro-interactions (chip removal, table hover, loader, cursor feedback)"
# If you modified CSS:
npm run build:css
# Then bump CACHE_V in sw.js (e.g., jfsn-20260617-143000 → jfsn-20260617-145000)
git add sw.js
git commit -m "Bump CACHE_V for CSS rebuild"
```

**Then:**
- Deploy via JFSN.app to HostGator
- Test live at jfsn.com
- Take screenshots/video of each animation
- Update this session prompt with results

---

## 7. Phase B: Next (If Energy & Time)

Once Phase A is solid, move to Phase B (4–6 hours):
1. **Loading state refinement** (progress bar + dot scale) ← already in Phase A
2. **Page transitions** (fade-through-color, 200ms on archive → artwork)
3. **Related works sidebar** (staggered entrance, 50ms per card)
4. **Archive grid masonry reveal** (3D perspective on desktop, 40ms stagger)
5. **Form input check animation** (scale-in bounce on checkbox check)

See BEST-IN-CLASS-UX-PROMPT.md Tier 2 for full specs.

---

## 8. Reference Files

- **Full prompt:** `/Documents/JFSN/BEST-IN-CLASS-UX-PROMPT.md`
- **Design tokens:** `CLAUDE.md` (color section)
- **CSS builds:** `npm run build:css` (regenerates `site.min.css`)
- **Preview:** http://localhost:8099 (archive.html, artwork.html, style-guide.html)

---

## Go.

Start with 4.1. Test. Move to 4.2. When all 4 pass, commit + deploy. Report back with before/after video or screenshots.

Good luck. You've got this. 🎨
