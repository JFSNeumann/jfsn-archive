# Guernica Passage — Room Arrival Choreography Redesign

**Status:** In Progress (2026-07-19)  
**Target:** Award-winning room entrance using anime.js choreography  
**Reference:** MOTION-SPEC.md § V, Pattern: Room Arrival

---

## Vision

Transform the Guernica Passage arrival from a simple fade-in to a **spatial, theatrical entrance** that:
- Welcomes you into the room deliberately
- Honors the work's formal, ceremonial nature
- Establishes motion design language for other rooms
- Maintains 60fps on mobile (4G throttled)
- Respects `prefers-reduced-motion: reduce` with intentional alternate choreography

---

## Current State (Before Redesign)

### Hero Image
```css
/* Simple fade-in via CSS keyframe */
animation: fade-in 0.6s ease-out 0.1s both;
```

### Title (h1)
```css
/* Simple fade-in via CSS keyframe */
animation: fade-up 0.6s ease-out 0.1s both;
```

### Subtitle
```css
/* Simple fade-in via CSS keyframe */
animation: fade-up 0.6s ease-out 0.2s both;
```

---

## New Choreography (After Redesign)

### Timeline (anime.js)

```
  0ms: Hero image fades in
       └─ opacity 0→1, duration 800ms (Medium, Discovery easing)
       └─ subtle parallax: subtle downward motion for immersion

200ms: (delayed) Title enters with ink-stamp scale
       └─ opacity 0→1, scale 0→1.08→1, duration 500ms (Discovery easing)
       └─ feels like a signature stamp hitting the page

800ms: (delayed) Subtitle fades up from below
       └─ opacity 0→1, translateY 8px→0, duration 400ms (Discovery easing)
       └─ invites scroll to read more

1000ms: (parallel) Header.hud slides in from edges
       └─ opacity 0→1, duration 300ms (Discovery easing)
       └─ subtle movement indicates navigability

≈1200ms: Complete arrival sequence, page ready for interaction
```

### Room Color Integration

```javascript
// Guernica's room color: warm black (#0d0a08)
// Veil background transitions from neutral #0c0a09 → #0d0a08
// Subtle but intentional: guides visitor into the room's space
```

### Accessibility Mode (prefers-reduced-motion: reduce)

```
  0ms: All elements appear immediately
       └─ Hero opacity: 1 (no animation)
       └─ Title scale: 1 (no animation)
       └─ Subtitle transform: none (no animation)
       └─ Header opacity: 1 (no animation)
       └─ But: All color/size changes still present (not degraded, different)
```

---

## Implementation Steps

### 1. Wire up the animation bundle
- Add `<script src="/dist/anime-utils.umd.js"></script>` to guernica-passage.html
- Create inline script that calls animation utilities

### 2. Identify target elements
```html
<!-- Hero image container -->
<div id="hero">
  <img src="..." alt="Guernica Passage">
</div>

<!-- Title -->
<h1 class="highlight-devo">...</h1>

<!-- Subtitle -->
<p class="subtitle">...</p>

<!-- Header nav -->
<header class="hud">...</header>
```

### 3. Build the timeline
```javascript
const tl = animeUtils.roomArrival({
  hero: '#hero img',
  title: 'h1',
  subtitle: '.subtitle',
  header: 'header.hud',
  heroDelay: 0,
  autoplay: true
})
```

### 4. Handle prefers-reduced-motion
```javascript
if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Skip timeline, use CSS fallback
  document.body.classList.add('reduce-motion')
}
```

### 5. Test and measure
- Lighthouse Performance score (target ≥ 90)
- Frame rate on 4G throttle (target 60fps)
- Visual verification: light mode, dark mode, mobile, desktop
- Accessibility: keyboard navigation + reduced motion

---

## Success Criteria

✅ **Coherence:** Animation follows MOTION-SPEC.md § V (Room Arrival pattern)  
✅ **Performance:** Guernica Passage Lighthouse ≥ 90 after changes  
✅ **Visual:** Hero fade feels deliberate, title entrance is elegant, subtitle is readable  
✅ **Accessibility:** Both motion modes work; no motion sickness; keyboard nav intact  
✅ **Tested:** Verified in browser (light + dark, mobile + desktop, 4G throttled)  

---

## Notes

### Why Guernica First?
- Most elaborate room hero currently (perfect showcase)
- Formal, ceremonial tone matches sophisticated choreography
- Accessible for testing (easy to navigate to)
- Can serve as model for other rooms (The Studio, Hall of Openings, etc.)

### What This Establishes
- anime.js integration working + performant
- Motion design system in production (not theoretical)
- Template for room arrival choreography (replicable across other rooms)
- Performance gate + measurement system

---

**Status:** Ready for implementation  
**Next:** Update guernica-passage.html to use new choreography
