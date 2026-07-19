# JFSN Archive — Motion Design Specification

**Purpose:** Define the motion grammar that governs all animations on JFSN. Every choreography references this spec, ensuring visual coherence and intentionality.

**Status:** Living document — updated as new patterns are discovered or refined.  
**Effective:** 2026-07-19 (anime.js integration + award-winning redesign)

---

## I. Easing Curves

Three canonical easing functions drive all motion. Named for their emotional character, not technical nomenclature.

### 1. Discovery (Entrance, Reveal)
**CSS:** `cubic-bezier(0.25, 0.46, 0.45, 0.94)`  
**anime.js:** `'easeOutQuad'` or custom above  
**Character:** Feels like opening a door, discovering something. Snappy entrance, gentle settle.

**When:**
- Hero images fade in
- Titles scale up
- Content sections enter
- Cards appear on scroll
- Metadata lines reveal
- Anything revealing hidden content

**Code reference:**
```javascript
anime.timeline()
  .add({targets: '.hero', opacity: [0, 1], duration: 800, easing: 'easeOutQuad'})
```

### 2. Closure (Exit, Fade)
**CSS:** `cubic-bezier(0.4, 0, 1, 1)` (pure ease-in)  
**anime.js:** `'easeInQuad'`  
**Character:** Feels like closing a book, stepping back. Gentle start, swift finish.

**When:**
- Overlay/veil fades in (closing the scene)
- Content fades out (leaving a room)
- Sibling elements retreat
- Anything leaving or concluding

**Code reference:**
```javascript
anime.timeline()
  .add({targets: '.veil', opacity: [0, 1], duration: 400, easing: 'easeInQuad'})
```

### 3. Interaction (Hover, Feedback)
**CSS:** `cubic-bezier(0.2, 0.8, 0.3, 1)` (bounce-back)  
**anime.js:** custom via `[{value: 0.2}, {value: 0.8}, {value: 0.3}, {value: 1}]`  
**Character:** Feels tactile, responsive. Bounces slightly; gives haptic feedback.

**When:**
- Cards lift on hover (and settle back)
- Buttons press/release
- Hover feedback animations
- Anything requiring tactile response

**Code reference:**
```javascript
anime.timeline()
  .add({targets: '.card', transform: ['translateY(0)', 'translateY(-2px)'], duration: 250, easing: 'easeOutElastic'})
```

---

## II. Duration Grammar

Durations are not arbitrary. They map to the narrative arc of the interaction.

### Micro (Fast Feedback)
**200ms**  
**Sensation:** Immediate response; the system heard you.

**When:**
- Hover color shifts
- Button active states
- Chip selection feedback
- Anything under 200ms reads as instant

### Small (Card/Element)
**350ms**  
**Sensation:** A single element's journey (entrance, exit, transform).

**When:**
- Individual card enters archive grid
- Single metadata line reveals
- One image fades
- A button animates

### Medium (Page/Section)
**600–800ms**  
**Sensation:** The page welcomes you; you sense the space opening.

**When:**
- Hero image entrance
- Title reveal
- Header navigation slides in
- Full section cross-fade
- **Guernica Passage:** Hero fade-in = 800ms (formal, unhurried)

### Large (Transition/Passage)
**400ms**  
**Sensation:** You're moving between rooms; the threshold is active.

**When:**
- Door click → room veil color fade (400ms)
- Threshold Passage border sweep (400ms)
- Page-to-page transition (already 200ms, could extend for drama)

### Orchestrated (Timeline)
**1.2–2s total**  
**Sensation:** A complete sequence unfolds as one coherent gesture.

**When:**
- Guernica Passage entire arrival: hero (800ms) + title (500ms, delayed 200ms) + subtitle (400ms, delayed 800ms) = 1.2s total
- The Current scroll reveal (2–3s as you scroll, not fixed time)
- Archive filter cross-fade + stagger (1s total for all cards)

---

## III. Stagger Patterns

Staggering creates rhythm and prevents visual chaos. Timing is intentional.

### Light Stagger (Readable, Intimate)
**Delay:** 40ms between items  
**Total:** 6 items = 240ms overhead  
**Sensation:** Elements arrive one by one, like pages turning.

**When:**
- Archive grid Load More (new cards enter)
- Metadata lines reveal (year, medium, dimensions)
- Related works section

**Code reference:**
```javascript
anime.stagger(40, {start: 200}) // start after 200ms, then stagger by 40ms
```

### Medium Stagger (Energetic, Choreographed)
**Delay:** 60ms between items  
**Total:** 6 items = 360ms overhead  
**Sensation:** Deliberate cascade; feels designed.

**When:**
- Room sibling fade-out (when clicking a door)
- Filter group expansion
- Card grid replacing (search/filter results)

### Capped Stagger (Progressive, Scalable)
**Delay:** 30ms per item, max 300ms total  
**Formula:** `Math.min(index * 30, 300)`  
**Sensation:** First items pop, later items feel part of a wave.

**When:**
- Load More with variable batch sizes (20, 50, 100+)
- Prevents "wait forever" feeling on large result sets
- Archive grid Load More capped at 300ms, not 600ms for 20 items

---

## IV. Color Transitions (Spatial Storytelling)

Colors don't just change; they **carry meaning**. Room colors bleed into transitions to guide navigation.

### Room Identity Colors
Each room has a primary color that appears in choreography:

| Room | CSS Variable | Color | When Active |
|------|--------------|-------|-------------|
| Guernica Passage | `--room-guernica` | `#1a1410` (warm black) | Door click, hero fade, veil |
| The Studio | `--room-studio` | `#0c0a09` (default dark) | Door click, veil |
| Hall of Openings | `--room-openings` | `#0c0a09` (default dark) | Door click, veil |
| Flooded Wing | `--room-flooded` | `#0a1015` (cool black) | Door click, veil |
| The Archive | `--room-archive` | `#0c0a09` (default) | Header tint on scroll |
| The Current | `--room-current` | `#0c0a09` | Focal card highlight |

### Color Fade Rules

**Door Click → Veil:**
- User clicks Guernica Passage door
- Veil background fades from `#0c0a09` (neutral) to `--room-guernica` (warm black)
- Duration: 300ms (Closure easing)
- Effect: You sense the room's presence before arriving

**Hero Load → Accent Highlight:**
- Hero image fades in (Discovery easing, 800ms)
- Title enters with `--accent` (#FF6600) pulse (ink-stamp scale)
- Effect: The work stands out; you know it's important

**Scroll → Room Tint:**
- As you scroll Guernica Passage, background subtly shifts toward `--room-guernica`
- Duration: Continuous, tied to scroll position
- Effect: Immersion deepens; you're moving through the room

---

## V. Choreography Patterns (Reusable Sequences)

Each choreography pattern is a named, reusable timeline. Reference these in code.

### Pattern: Room Arrival (Guernica Passage Model)
**Total Duration:** 1200ms  
**Easing:** Discovery (entrance), Closure (exit)

**Timeline:**
```
  0ms: Hero image opacity 0→1 (800ms, Discovery)
       ↓ (subtle parallax: translateY -20px→0)
200ms: (delayed) Title scale 0→1 (500ms, Discovery)
       ↓ (ink-stamp: scaleX 0→1.08→1)
800ms: (delayed) Subtitle opacity 0→1 (400ms, Discovery)
       ↓ (translateY 8px→0)
1000ms: Header.hud slides in from edges (300ms, Discovery)
```

**Pattern Code:**
```javascript
export const roomArrival = (hero, title, subtitle, header) => {
  return anime.timeline({autoplay: false})
    .add({targets: hero, opacity: [0, 1], duration: 800, easing: 'easeOutQuad'})
    .add({targets: title, opacity: [0, 1], scale: [0, 1], duration: 500, easing: 'easeOutQuad'}, 200)
    .add({targets: subtitle, opacity: [0, 1], translateY: [8, 0], duration: 400, easing: 'easeOutQuad'}, 800)
    .add({targets: header, opacity: [0, 1], duration: 300}, 800)
}
```

### Pattern: Door Passage (Threshold Ritual)
**Total Duration:** 400ms  
**Easing:** Discovery (entrance), Closure (exit)

**Timeline:**
```
  0ms: Clicked door border-left expands 0→100% (400ms, Discovery easing)
       Veil background tints to room color (300ms, Closure easing)
 50ms: (staggered) Sibling doors fade out (300ms, Closure) + retreat left/right
150ms: Clicked door text slides right + fades (200ms, Closure)
       Favicon pulses orange (haptic)
400ms: Navigate to room
```

### Pattern: Grid Stagger (Load More / Filter)
**Total Duration:** 350ms base + capped stagger  
**Easing:** Discovery

**Timeline:**
```
  0ms: If filtering: old grid fades + shrinks (150ms)
150ms: New grid renders
200ms: Cards enter with staggered entrance
       Stagger: 40ms between items, capped at 300ms total
       Duration per card: 350ms (Small)
```

### Pattern: Micro-Interaction (Hover Feedback)
**Total Duration:** 250ms  
**Easing:** Interaction (bounce-back)

**Timeline:**
```
  0ms: Card lifts +2px, shadow grows (200ms, Interaction)
200ms: User moves mouse away
       Card settles back (100ms, Interaction) — snappy return
```

---

## VI. Accessibility: Two Motion Modes

All choreography exists in two variants. Neither is "reduced" — both are intentional.

### Mode 1: `prefers-reduced-motion: no-preference`
**Full choreography with timings above.**

Example (Room Arrival):
```
Hero fades in 800ms → Title enters 500ms (delayed 200ms) → Subtitle fades in 400ms (delayed 800ms)
= Staggered, choreographed, ~1.2s total
```

### Mode 2: `prefers-reduced-motion: reduce`
**Instant cascade, color-driven feedback, no motion.**

Example (Room Arrival):
```
Hero appears instantly (opacity 1)
Title appears instantly (scale 1)
Subtitle appears instantly (transform none)
= All visible immediately, but entrance color/size shifts show intentionality
```

**Key rule:** Reduce mode is not "disabled" — it's a different choreography. Use:
```css
@media (prefers-reduced-motion: reduce) {
  .hero { opacity: 1; animation: none; }
  .title { opacity: 1; transform: scale(1); animation: none; }
}
```

---

## VII. Performance Budget

Every animation must stay within the budget. Measured, not hoped.

### Target: 60fps on Mobile (4G throttled)

**Per Page:**
- Hero entrance: max 800ms (can't be longer; visitors won't wait)
- Full page arrival (hero + content + header): max 1.2s
- Scroll interactions: 60fps maintained (no drops on scroll)
- Load More stagger: max 300ms total (capped, not cumulative)

**Measurement:**
```bash
lighthouse https://jfsn.com/guernica-passage.html --throttling-method=devtools
# Target: Performance ≥ 90, CLS < 0.1, LCP < 1.6s
```

**Red lines (failures):**
- LCP > 2.5s (perceived performance drops)
- CLS > 0.25 (layout shifts break animations)
- Frame drops on scroll (60fps target missed)

---

## VIII. Data-Driven Choreography (Future)

When animations respond to catalog metadata, these rules apply:

### Decade-Based Duration
- Works from **1970s–1980s** (historical): +20% duration (feel weightier)
- Works from **1990s–2000s** (middle): standard duration
- Works from **2010s–present** (recent): -10% duration (feel more energetic)

### Series-Based Stagger
- **Single work:** no stagger
- **Series (2–5 works):** 40ms stagger
- **Collection (6+ works):** capped 30ms stagger (prevent excessive delay)

### Metadata Density
- **Minimal metadata** (year + medium): fast reveal (200ms)
- **Dense metadata** (full catalog record): slow reveal (600ms, reading speed)

---

## IX. Choreography Checklist (Before Commit)

Every animation must pass:

- [ ] **Intentional:** Does this motion serve the narrative? (Not decorative)
- [ ] **Coherent:** Does it follow one of the patterns above? (Not ad-hoc)
- [ ] **Performant:** Lighthouse score unchanged? (60fps on 4G)
- [ ] **Accessible:** Works in both motion modes? (no motion sickness)
- [ ] **Tested:** Verified in browser (light + dark, desktop + mobile)?
- [ ] **Documented:** Code references this spec? (future readers understand why)

---

## X. Pattern Reference (Quick Lookup)

### Entry Choreography
- **Hero arrival:** Room Arrival pattern (800ms hero, staggered title/subtitle)
- **Card entrance:** Small stagger (350ms, 40ms between items)
- **Section reveal:** Medium timing (600ms, Discovery easing)

### Exit Choreography
- **Room exit:** Closure easing (400ms), sibling retreat (300ms staggered)
- **Veil fade:** Closure easing (300ms)
- **Content fade:** Closure easing (250ms)

### Interaction Choreography
- **Hover feedback:** Interaction easing (200–250ms bounce-back)
- **Click press:** Tactile feedback (press 100ms, release 150ms)
- **Scroll reveal:** Continuous (tied to scroll position, 60fps)

### Feedback Choreography
- **Error state:** Red accent highlight + subtle shake (3–4 keyframes, 300ms)
- **Success state:** Green accent + scale pulse (2 keyframes, 250ms)
- **Loading state:** Spinner + opacity pulse (continuous loop)

---

## XI. Implementation Notes

### anime.js Integration
All patterns use anime.js timelines (`anime.timeline()`), not CSS keyframes.

**Reason:** Timelines allow precise sequencing, easy stagger calculation, and dynamic control (pause/resume/reverse) that CSS can't provide.

**Exceptions:** Infinite loops (scroll cues, spinners) may remain CSS if anime.js timeline loop becomes expensive.

### CSS Variables Sync
Every animation that uses a color references `--room`, `--accent`, `--ink`, etc.

**Reason:** Room identity is consistent across all transitions.

### Page-Specific Modules
Each animated page loads its own choreography module:
```html
<script src="/dist/animations.js"></script>
<script>
  const tl = animeUtils.roomArrival(hero, title, subtitle, header);
  tl.play();
</script>
```

---

## XII. Versioning This Spec

**Current Version:** 1.0 (2026-07-19, anime.js + Guernica Passage redesign)

**When to update:**
- New pattern discovered (e.g., "Scroll Reveal Choreography")
- Duration or stagger rules refined (with measured data)
- New room identity added
- Accessibility mode expanded

**Do NOT update for:**
- Individual page tweaks (document in session notes, not here)
- Bug fixes (track in git history)
- One-off animations (must fit pattern or spec needs updating)

---

**Last Updated:** 2026-07-19  
**Owner:** JFSN Motion Design (Jeff + Claude)  
**Reference:** All animations in production must cite this spec by section number.
