# Hall of Openings Prototype — Evaluation Framework

**Status:** Experimental design study  
**Created:** 2026-07-15  
**File:** `hall-of-openings-prototype.html`  
**Principle Under Test:** Visitor encounters imagined gallery evidence before interpretation

---

## What Changed: The Opening Sequence

### Current Live Version (Hall of Openings)
```
1. Text hero section (full viewport height, centered)
   - "THE HALL OF OPENINGS"
   - "Rooms that never held it."
   - "250 WORKS · PHOTOSHOP COMPOSITES · EVERY ONE FLAGGED"

2. Prose explanation paragraph
   - "In fifty years of making, Jeff Neumann's work appeared in six exhibitions..."

3. JavaScript builds the grid from openings.json
   - Three movements (Galleries, Studio Views, Placements)
   - Column masonry layout
   - Lazy-loaded thumbnail cards
```

**Result:** Visitor reads four layers of text/heading before encountering any composite image. The interpretation precedes the evidence.

---

### Prototype Version (Hall of Openings Prototype)
```
1. Hero image (full width, generous height ~65vh)
   - art0028: "Installation View, Wall of Works" (2000s composite)
   - A full gallery interior showing multiple works on walls
   - Loaded eagerly, unambiguous
   - No overlay text, no animation

2. Minimal museum-style label (immediately below image)
   - Title: "Installation View, Wall of Works"
   - Meta: "2000s (est.) · photograph"
   - Flag: "Photoshop composite · Imagined placement"

3. Single introductory paragraph
   - "In fifty years of making, Jeff Neumann's work appeared in six exhibitions..."
   - Confirms what the visitor just saw: imagined spaces

4. "Browse all 250 →" link

5. Same grid as live version (Galleries, Studio Views, Placements)
```

**Result:** Visitor encounters a striking gallery composite image first. The label immediately clarifies it's a composite. The prose confirms understanding. The grid follows naturally. Evidence precedes interpretation.

---

## Comparison: What a Curator Observes

### The Current Live Version

**First visual impression (0–5 seconds):**
- Visitor sees only text in a black void
- No visual reference yet
- The title "Rooms that never held it" is poetic but abstract
- Visitor hasn't yet understood: what are these rooms? What does "never held it" mean?

**Understanding develops (5–15 seconds):**
- Visitor reads: "250 works in all — is a Photoshop composite"
- Intellectual grasp: these are fake rooms, imagined places
- No visceral sense yet of what those places look like
- Visitor must decide: continue scrolling or leave?

**First visual encounter (15–30 seconds):**
- Grid begins to load
- Small thumbnails appear
- Only after scrolling past multiple sections do gallery composites become prominent
- The emotional weight of "imagined galleries" comes late

---

### The Prototype Version

**First visual impression (0–2 seconds):**
- Visitor sees a striking gallery interior image
- Immediate visual engagement
- Their eye reads the space: walls, works displayed, architecture
- Curiosity: "What is this?"

**Clarification moment (2–5 seconds):**
- Label appears below: "Photoshop composite · Imagined placement"
- Understanding crystallizes: "Oh—this is imagined, not real"
- Trust increases: the archive isn't hiding what this is

**Deepening understanding (5–12 seconds):**
- Prose confirms: "He imagined 250 more—rooms, walls, crowds that never held it"
- The abstract concept now has visual grounding
- Visitor understands: there are 250 of these imagined spaces
- Emotional resonance: longing, imagination, absence

**Natural progression (12–20 seconds):**
- "Browse all 250 →" link
- Visitor has appetite to see more because they understand the concept
- Grid follows naturally

---

## Architectural Principles at Work

### Evidence First
The prototype trusts that a striking composite image is stronger than a poetic title. The image *shows* what "rooms that never held it" means.

### Immediate Clarity
The label removes ambiguity instantly. "Photoshop composite" prevents the misreading: "Is this a real photograph of a real gallery?" No. It's imagined. That's clearer and more honest.

### Proportional Emphasis
The image occupies the attention space that text currently occupies. The image is what matters; text supports it.

### No Performance
There is no animation, no reveal, no timing game. The image is there. The label is there. That's it. Invisible design.

---

## What to Observe During Testing

### Quantitative Signals
- **Time to grid:** How quickly does the visitor reach "Browse all 250"?
- **Scroll engagement:** Do visitors scroll past the intro paragraph, or does the image prompt enough curiosity?
- **Grid interaction:** Do visitors click on composites, or leave after browsing?

### Qualitative Observations

**Prototype advantage if:**
- Visitor immediately understands the concept without reading the prose
- Visitor feels the emotional weight of "imagined galleries" from the image alone
- Trust increases (composite flagging is clear and immediate)
- The gallery composite becomes memorable (not the prose)

**Live version advantage if:**
- The abstract title "Rooms that never held it" is powerful enough on its own
- Visitors prefer intellectual framing before visual evidence
- The text-first approach feels more curatorial (explanation-driven)
- The composite doesn't overwhelm interpretation

### Risk Signals

**Prototype risks:**
- The image might feel like decoration if it's not striking enough
- Removing the text hero might lose the poetic framing
- On mobile, the large hero image might feel unwieldy
- Some visitors might scroll past the image without engaging ("nice photo, moving on")

**Live version risks:**
- Visitors leave before reaching the grid, having absorbed concept but not desired to explore
- The prose is too much interpretation before evidence (cognitive load)
- "Rooms that never held it" creates curiosity that isn't satisfied until scrolling far
- The gap between concept and visualization feels like a missed opportunity

---

## How to Deploy for Testing

### Safe Deployment
1. Create the prototype as a separate file (✓ done: `hall-of-openings-prototype.html`)
2. Do NOT modify the live `hall-of-openings.html`
3. Deploy the prototype to the staging environment or a subdirectory
4. Test on multiple devices (desktop, tablet, mobile)
5. Compare both versions back-to-back

### Testing Duration
- Minimum 1 week of observation
- Collect visitor behavior data (if possible) from both versions
- Informal feedback from people who visit the archive

### Success Criteria
The prototype should be adopted if:
- ✓ Visitor understanding improves (concept grasped faster)
- ✓ Emotional resonance increases (imagined galleries feel more real, more poignant)
- ✓ Trust doesn't decrease (composite flagging is clear)
- ✓ Engagement with the grid remains equal or higher
- ✓ Accessibility is maintained (alt text, keyboard nav, reduced-motion)

### Rejection Criteria
The live version should be kept if:
- ✓ The text-only hero creates stronger philosophical impact
- ✓ Visitors prefer guidance before discovery
- ✓ The large image feels gratuitous on mobile
- ✓ The intro paragraph's poetic resonance is lost without the text context

---

## Deployment Checklist

### Image Verification ✓
- [x] Hero image exists: `/artworks/medium/art0028.avif` (278 KB)
- [x] Hero thumbnail exists: `/artworks/thumbs/art0028.avif` (32 KB)
- [x] All 250 composites in openings.json have corresponding images
- [x] Image paths in prototype are correct (`/artworks/medium/`, `/artworks/thumbs/`)

### File Status
- [x] Prototype HTML created: `hall-of-openings-prototype.html` (local, ready to deploy)
- [x] Evaluation framework complete: `PROTOTYPE-EVALUATION.md`
- [ ] Prototype uploaded to server (pending your decision)

### To Deploy
1. Copy `hall-of-openings-prototype.html` to JFSN repo root
2. Run `bash deploy-hostgator.sh` (includes the prototype)
3. Access at: `https://jfsn.com/hall-of-openings-prototype.html`
4. Verify on desktop, tablet, mobile
5. Compare with live: `https://jfsn.com/hall-of-openings.html`

---

## Next Steps

1. **Decide:** Deploy for testing, refine first, or reject the principle
2. **If deploying:** Run the deployment checklist above
3. **If testing:** Observe visitor behavior for 1–2 weeks on both versions
4. **Gather evidence:** Do visitors understand faster? Is emotional impact stronger?
5. **Decide:** Adopt prototype, refine and retest, or keep live version

---

## Notes for Implementation

### If Adopted
- Update the live `hall-of-openings.html` with the prototype structure
- Preserve all existing grid functionality and hover interactions
- Test on `prefers-reduced-motion` to ensure animations/transitions work
- Verify opening.json loads correctly
- Run `audit-nav.sh` to ensure sitemap and nav consistency

### If Refined
- Test different hero images from the composite set (maybe a more dramatic gallery view)
- Experiment with label placement (beside vs. below the image)
- Try different intro paragraph length/tone
- Test the grid loading behavior (eager vs. lazy, intersection observer thresholds)

### If Rejected
- Keep the live version as-is
- Document why the prototype didn't improve the experience
- Preserve the prototype file as a reference for future experiments

---

## Archive Principles Preserved in Prototype

- ✓ Honesty: Composites are flagged immediately and clearly
- ✓ Restraint: No theatrical effects, no surprise reveals
- ✓ Museum Quality: Museum-style label, clear hierarchy
- ✓ Accessibility: Alt text, keyboard nav, no animation-gated content
- ✓ Performance: Eager load on hero, lazy on grid (same as live)
- ✓ Visual Language: Existing Stitch color system, typography, spacing

---

## Comparison at a Glance

| Aspect | Live Version | Prototype |
|--------|--------------|-----------|
| **First Encounter** | Text (poetic) | Image (evidence) |
| **Time to First Visual** | ~15–20s after scroll | Immediate (0–2s) |
| **Clarification** | After reading prose | Immediate label |
| **Emotional Arc** | Intellectual → Visceral | Visceral → Intellectual |
| **Trust Signal** | Prose honesty | Composite flag clarity |
| **Grid Access** | After 2+ sections of prose | After 1 paragraph + CTA |
| **Mobile UX** | Text-heavy hero | Image-dominant hero |
| **Curatorial Tone** | Explanation-first | Discovery-first |

---

## Conclusion

This prototype tests whether the principle **"visitor encounters evidence before interpretation"** genuinely improves the Hall of Openings opening experience. The current live version is the benchmark. The prototype must earn adoption through clear evidence of improved understanding, engagement, and emotional resonance.

The experiment is low-risk (separate file, no live modification) and high-learning (validates or refutes a fundamental curatorial principle that could apply to other JFSN pages).
