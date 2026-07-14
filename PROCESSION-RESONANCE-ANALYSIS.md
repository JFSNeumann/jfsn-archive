# Procession Resonance: Guernica Passage Image Interactions

**Date:** 2026-07-14  
**Implemented:** Direction A (Procession Resonance)  
**Commit:** 4a1787e9

---

## AUDIT: What the Previous System Did Wrong

The previous guernica-passage.html had **zero image-specific hover interaction:**
- Images appeared on scroll (fade + slide), but no response to proximity
- Only link text color changed on hover (a:hover{color:var(--accent)})
- Featured works had larger size + darker border, but same interaction as regular works
- No visual feedback when you try to engage with artwork
- Images felt passive within the walk

**What Worked:**
- Scroll-reveal (fade + slide) created anticipation
- Random left/right positioning added rhythm
- Counter showed progress (WORK N OF 232)
- Featured works visually distinct via size + border

**What Failed:**
- Images didn't acknowledge your presence
- No distinction between featured and regular through interaction
- "Walk" metaphor lacking reciprocal engagement
- Minimal hover state felt unfinished

---

## THE CHOICE: Direction A (Procession Resonance)

**Core Insight:** Images should *acknowledge your presence* through upward rise + shadow expansion, creating visual reciprocity in the walk.

### Why This Won

| Criterion | A: Resonance | B: Border Weight | C: Watermark Bloom |
|-----------|--------------|------------------|-------------------|
| **Distinctive** | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **Honors walk** | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **Thematic** | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **Image clarity** | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Technical elegance** | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |

**Winner:** Direction A (Procession Resonance)

**Why:** 
- **Opposite of threshold passage** — This is presence-recognition, not room-entering
- **Reciprocal engagement** — Images rise to meet you as you approach
- **Featured works distinguished through strength** — Larger rise signals "pause here"
- **No visual noise** — Images stay clear; only rise + shadow + text color
- **Coherent but distinct** — Different language from doors (appropriate for different room)

---

## IMPLEMENTATION

### CSS Grammar

**Base State:**
```css
.work img {
  transition: border-color .25s ease, box-shadow .25s ease, transform .25s ease;
}
```

**Hover State (Regular Works):**
```css
.work a:hover img {
  transform: translateY(-4px);
  border-color: var(--accent);
  box-shadow: 0 12px 32px rgba(255, 102, 0, .12);
}
```

**Hover State (Featured Works):**
```css
.work.feature a:hover img {
  transform: translateY(-8px);
  box-shadow: 0 20px 48px rgba(255, 102, 0, .16);
}
```

**Figcaption Resonance:**
```css
.work figcaption {
  transition: transform .25s ease;
}
.work a:hover figcaption {
  transform: translateY(-2px);
}
.work.feature a:hover figcaption {
  transform: translateY(-4px);
}
```

**Title (Text) Resonance:**
```css
.work .t {
  transition: color .25s ease, transform .25s ease;
}
.work a:hover .t {
  color: var(--accent);
  transform: scale(1.02);
}
```

**Metadata Resonance:**
```css
.work .m {
  transition: color .25s ease;
}
.work a:hover .m {
  color: var(--accent);
}
```

**Composite Flag Resonance:**
```css
.work .x {
  transition: opacity .25s ease;
}
.work a:hover .x {
  opacity: .8;
}
```

---

## THE CORE INTERACTION

**PRESENCE-RECOGNITION:** When you hover, the image rises to acknowledge your approach, with featured works commanding stronger response.

### Layered Resonance

1. **Image rises** (translateY -4px or -8px)
   - Physical presence signal: "I'm here, I see you"
   
2. **Shadow expands** (12px→32px blur radius)
   - Depth cue: image becomes more prominent
   
3. **Border color changes** (to var(--accent))
   - Accessibility signal: clickable now active
   
4. **Figcaption follows** (rises -2px or -4px)
   - Unified movement: text belongs with image
   
5. **Title scales + color** (1.02x, color var(--accent))
   - Text emphasis: title demands attention
   
6. **Metadata color changes** (to var(--accent))
   - Context becomes prominent
   
7. **Composite flag fades** (opacity .8)
   - Context: imagined placement acknowledged but softened

---

## SELF-CRITIQUE

### What's Working

✅ **Presence-recognition:** Images acknowledge hover through rise  
✅ **Featured works distinguished:** Stronger rise (2x) signals importance  
✅ **Unified movement:** Image + figcaption + text all rise together  
✅ **No visual noise:** Image stays clear; shadow + color only  
✅ **Timing consistent:** All transitions .25s ease  
✅ **Accessible:** Color + movement feedback, focus-visible handled by inherited styles  
✅ **Respects prefers-reduced-motion:** All in @media block  

### What's Questionable

⚠️ **Shadow color (orange at .12 opacity):** Is it visible enough? Currently very subtle (12px blur, .12 opacity). **Verdict:** Keep. Subtle is appropriate for museum. Users will feel it through movement, not just shadow.

⚠️ **Title scale 1.02x:** Small. Does it feel earned or just decorative? **Verdict:** Keep. It's just enough to signal engagement without being obvious.

⚠️ **Figcaption rise -2px:** Barely perceptible. **Verdict:** Keep. It's intentional. The image rise is the star; caption is subtle support.

### Why This is Different from Doors

**Doors (Border Grammar):**
- Interaction language: Threshold passage
- Core moment: Entering the room
- Semantic: Border expanding = room becoming present
- Visual: Border-width only

**Guernica Passage (Procession Resonance):**
- Interaction language: Presence-recognition
- Core moment: Image acknowledging your approach
- Semantic: Image rising = acknowledging you within the walk
- Visual: Rise + shadow + color (multi-layered feedback)

**Why both exist in the museum:**
- Doors select which room to enter (threshold language)
- Inside rooms, artworks engage with you (presence language)
- The two languages support different moments in the narrative

---

## DEPLOYMENT

- **Deployed:** 2026-07-14 (commit 4a1787e9)
- **CACHE_V:** `jfsn-1784052400`
- **Status:** Live at jfsn.com/guernica-passage.html

---

## NEXT PHASES (Not Started)

### Phase 1: Validation
- User testing: Does the rise feel like presence-recognition or just animation?
- Shadow visibility: Is .12 opacity sufficient, or needs stronger glow?
- Title scale: Does 1.02x read as engagement, or is it too subtle?

### Phase 2: Propagation
- Apply same resonance principles to other room pages (current.html, flooded-wing.html, hall-of-openings.html, the-studio.html)
- Adapt to each room's content type and personality
- Archive.html already has Study Room language (keep it — different interaction language appropriate for that room)

### Phase 3: Fine-Tuning
- Adjust rise distance per screen size (mobile vs desktop)
- Easing curve exploration (currently .25s ease)
- Shadow color intensity per room (var(--accent) works for Guernica; other rooms might need adjustment)

---

## CONCLUSION

Guernica Passage now has **presence-based image interactions** that transform it from a passive scroll-walk into an **engaged procession** where artworks acknowledge your presence through reciprocal rise.

The interaction language is:
- **Semantically coherent:** Images rising = acknowledging you
- **Visually distinct:** Different from doors' threshold passage
- **Technically elegant:** Rise + shadow + color (no complexity)
- **Thematically appropriate:** Honors 30-year Guernica-inspired walk

**The ONE interaction that defines this room: Presence-Recognition** — images rise to meet you as you approach.

---

**Session prepared by:** Claude Haiku 4.5  
**Date:** 2026-07-14  
**Status:** COMPLETE — Ready for user testing
