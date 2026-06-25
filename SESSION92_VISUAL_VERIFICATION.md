# Session 92 Visual Verification Checklist

**Date:** 2026-06-25  
**Objective:** Verify motion primitives look and feel correct in a real browser (not preview tab, which suspends rAF)

---

## Quick visual tests (5–10 min total)

### 1. **Depth-hero parallax** (about.html)
- [ ] Open https://jfsn.com/about.html
- [ ] Scroll slowly down the page
- [ ] **Watch the headline "Jeffrey F. S. Neumann"** — it should drift UPWARD as you scroll (counterintuitive but correct: display-type parallax "pulls away" from the viewport)
- [ ] **Movement should be smooth and subtle** (~2–3px per 20px scroll)
- [ ] **The portrait below should NOT move** — only the display type
- [ ] **Test reduced-motion:** Set OS to "Reduce motion" → headline stays still on scroll (no parallax)
- [ ] **Test JS-off:** Open DevTools Console, type `document.documentElement.className = ''` to simulate no-JS → headline should still be visible and readable

### 2. **Essay parallax** (stories.html)
- [ ] Open https://jfsn.com/stories.html
- [ ] Scroll down through the pull quotes (blockquotes)
- [ ] **Watch the pull quotes drifting upward** as you scroll (they move LESS than the page scroll, so they drift up relative to the body text)
- [ ] **Movement should be subtle** — quotes shouldn't visibly oscillate, just a gentle drift
- [ ] **Different quotes should have slightly different drift rates** (0.88, 0.90, 0.92) — hard to perceive individually but creates a sense of depth/layering
- [ ] **Body text stays locked** — prose paragraphs don't move
- [ ] **Test reduced-motion:** OS motion setting → quotes stay still
- [ ] **Test JS-off:** Quotes should stay visible and readable

### 3. **Continuity transition** (favorites.html → artwork.html)
- [ ] Open https://jfsn.com/favorites.html
- [ ] Click any thumbnail
- [ ] **Watch the thumbnail morph into the hero image on artwork.html** — should be a smooth shared-element transition
- [ ] **The transition should feel instant and connected**, not a fade/jump
- [ ] **Test on a different grid page** (e.g., guernica.html) — same effect should work
- [ ] **Test on a non-artwork page** (e.g., changes.html) — continuity transition won't apply there (fine, expected)

### 4. **Chromatic river motion** (chromatic.html)
- [ ] Open https://jfsn.com/chromatic.html
- [ ] Scroll down slowly through the entire page
- [ ] **Watch the decade labels (top of canvas)** — they should drift UPWARD slightly (0.90× rate)
- [ ] **Watch the count strip (below canvas)** — it should drift UPWARD but less than the labels (0.95× rate)
- [ ] **Watch the footer** — it should drift DOWNWARD as you scroll (1.05× rate, "pulls forward")
- [ ] **The river canvas itself should NOT move** — only scroll normally (1.0×)
- [ ] **The hero title should drift upward fastest** (1.12× rate from depth-hero.js)
- [ ] **Result:** You should feel a sense of LAYERING — the canvas is the primary content plane, surrounded by layers moving at different rates
- [ ] **Test reduced-motion:** OS motion setting → all elements stay still, no parallax
- [ ] **Test JS-off:** All elements visible and readable, no motion

---

## Success criteria

- ✅ All motion is smooth (no jank/stuttering)
- ✅ Parallax rates feel proportional to their spec (environment-plate slower, scrim faster)
- ✅ No parallax "snapping" or sudden jumps
- ✅ Reduced-motion mode disables all parallax
- ✅ JS-off mode keeps all content visible
- ✅ No console errors or warnings

---

## Known limitations in this session

- Could not verify via Chrome extension (extension wasn't responding)
- Verified code logic and math instead (all correct)
- Real-world visual smoothness best confirmed in a real browser when extension is available
