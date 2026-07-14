# Border Grammar: Creative Director's Analysis

**Date:** 2026-07-14
**Implemented:** Direction B (Border Grammar)
**Commits:** fcafd970 (initial), c3dc7c2b (threshold fix)

---

## AUDIT: What the Previous System Did Wrong

The old system (pre-Direction B) had **multiple overlapping animations per interaction:**

- Border transforms (personality per room)
- Ghosted image overlays (0px → 15% opacity)
- Arrow decoration (.go element translating from right)
- Spatial depth at rest (translateY 0-4px per room)
- Cascading transforms on hover (different per room)

**Result:** CSS conflicts, cognitive overload, unclear emotional meaning. The border was supposed to show personality, but spatial depth CSS rules OVERRODE it. Broken implementation.

---

## THE CHOICE: Direction B (Border Grammar)

**Core insight:** The border IS the only animation. It carries all emotional weight.

### Why This Won

| Criterion | Silence | Border Grammar | Anticipatory |
|-----------|---------|----------------|--------------|
| Distinctiveness | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| Museum feeling | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| Technical purity | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| Uniqueness to JFSN | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |

**The decision:** Direction B is impossible to confuse with another website. No other archive uses border-width expansion as the sole interaction language.

---

## IMPLEMENTATION

### CSS Grammar

**Rest state:** `border-left: 0px solid transparent` (invisible)

**Hover state:** Border-left-width expands (personality in width alone)
```css
#doors a:nth-child(1):hover { border-left-width: 6px }    /* Energy */
#doors a:nth-child(2):hover { border-left-width: 3px }    /* Focus */
#doors a:nth-child(3):hover { border-left-width: 1px }    /* Withdrawn */
#doors a:nth-child(4):hover { border-left-width: 4px }    /* Multiplicity */
#doors a:nth-child(5):hover { border-left-width: 5px }    /* Warmth */
```

**Landing choreography:** Borders draw themselves from 0→1px over .8s (staggered .05s per room)

**Threshold/Passage:** Border expands to 100% width as user enters (0→100%, .4s ease-out)

### What Was Removed

- Ghosted image overlays (decorative, not purposeful)
- Arrow decoration (.go element, unnecessary)
- Spatial depth at rest (misalignment without benefit)
- Cascading transforms (conflicted with personality rules)
- Arc visualization (invisible, served no purpose)
- Transform animations (contradicted pure border language)

### What Was Kept

- Custom cursor: thin vertical arrow (hints at passage intent)
- Color feedback: border-color changes on hover (accessibility signal)
- Transition: `.3s ease` on border-left-width (smooth, perceivable)

---

## SELF-CRITIQUE

### What's Working

✅ **Single truth:** Border carries ALL emotional meaning  
✅ **No conflicts:** All competing CSS rules removed  
✅ **Museum-grade:** Quiet, inevitable, crafted feeling  
✅ **Semantic:** Border expanding = room becoming present to you  
✅ **Accessible:** Color + width feedback, focus-visible mirrors hover  
✅ **Distinctive:** No other site does this  

### What's Questionable

⚠️ **Room 3 (FLOODED WING) at 1px:** Almost invisible on hover. Semantic (withdrawn) but nearly imperceptible. **Verdict:** Keep. The invisibility IS the point.

⚠️ **Custom cursor:** Nice detail but not load-bearing. Could be removed. **Verdict:** Keep for now; test with users.

⚠️ **Border-left-width: 100%:** CSS width limitation. Expands to element width (~400px), not true full-screen. **Verdict:** Acceptable metaphor; the "passage through" moment still reads.

---

## THE ONE CORE INTERACTION

**THRESHOLD PASSAGE:** The moment the border expands as you enter a room (0→100%, .4s).

This is the ONLY interaction that matters. If this fails, the entire museum metaphor collapses.

### Everything Supports This Moment

1. **Landing choreography:** Draws borders in (sets anticipation)
2. **Hover states:** Expand to personality width (focuses attention on the door you're about to enter)
3. **Color feedback:** Border color changes (primes the user to expect response)
4. **Custom cursor:** Hints at passage (signals intent before clicking)
5. **Threshold animation:** THE MOMENT — border fills the space as you cross the threshold

No element is decorative. Every detail serves the passage moment.

---

## WHY NOT CHANGE archive.html + hall-of-openings.html?

**Short answer:** Different interaction languages for different narrative moments.

**Detailed rationale:**

The border grammar is **specific to the threshold moment of entering a room** (homepage doors).

Once inside a room, users interact with different content (artworks, images), which need different interaction languages:
- **Archive = Study Room:** Intimate, focused examination. Needs card-hover interactions that amplify artwork presence (box-shadow, border-color, typography reveal).
- **Hall of Openings = Exhibition Procession:** Movement and discovery. Needs image-hover that suggests procession, not selection.

Applying border grammar to artwork selection would:
- Create semantic repetition (every interaction is border-based)
- Misrepresent the purpose (these aren't "rooms to enter," they're "artworks to examine")
- Reduce distinctiveness (repetition weakens the grammar)

**Architectural principle:** Use different interaction languages for different semantic contexts. This creates coherence through *rightness*, not through repetition.

**Museum metaphor supports this:**
1. Approaching rooms → border grammar (threshold language)
2. Examining artworks inside → room-specific language (study language)
3. Leaving room, entering another → back to border grammar (repeat cycle)

---

## DEPLOYMENT & VERIFICATION

- **Deployed:** 2026-07-14 19:41 UTC (commit fcafd970)
- **CACHE_V:** `jfsn-1784051200`
- **Verified:** Doors load with border-left: 0px at rest
- **Bug fix:** 2026-07-14 19:46 UTC (commit c3dc7c2b) — threshold animation now starts from 0px, not inherit

---

## NEXT PHASES (Not Started)

1. **User testing:** Validate Room 3's near-invisible hover state feels right
2. **Cursor testing:** Verify custom cursor adds value vs. removes clutter
3. **Full-site audit:** Ensure landing choreography + threshold feel cohesive across rooms
4. **Fine-tuning:** Timing, easing, minor adjustments based on live feedback

