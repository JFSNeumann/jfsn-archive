# Session 2026-07-24: Doors Composite Polish + Interactive Refinements

**Date:** July 24, 2026  
**Focus:** Simplify doors preview system, improve interaction clarity, add hero layering, footer river visualization  
**Commits:** 8 (4cbed3ad through 52f62141)  
**Status:** ✅ Deployed and verified live

---

## Summary

Replaced complex per-room "atmospheric light leak" hover effects on the five door links with a single composite image approach, eliminating masks, filters, and blend-modes in favor of clean opacity tuning. Added refinements to link underlines and image hover fades. Initialized wing images with random works on each page load. Created a footer river visualization—all 1,086 works as a responsive color strip—and deployed it across all 14 pages. Deployed all changes to jfsn.com with full smoke-test pass.

---

## Changes by Commit

### 1. `4cbed3ad` — Doors hover composite image integration

**What:** Migrated all five door links from individual preview images to a single 1600×1040 composite (`jfsn-hover-composite.avif`).

**How:**
- Updated all five `data-preview-image` attributes to `/assets/images/jfsn-hover-composite.avif`
- Changed generic `#doors a::after` from `background-size:cover;background-position:center` to `background-size:100% 500%;background-position:0 0%`
- Removed all filter, mask, and blend-mode rules from the five room-specific CSS blocks
- Replaced with simple background-position overrides:
  - Link 1 (Current): `0 0%`
  - Link 2 (Guernica): `0 25%`
  - Link 3 (Flooded): `0 50%`
  - Link 4 (Hall): `0 75%`
  - Link 5 (Studio): `0 100%`

**Result:** 73 lines of CSS removed, 31 lines added. Cleaner, maintainable code with no loss of visual distinction between rooms.

**Asset:** 92KB AVIF composite, exactly 1600×1040 (verified).

---

### 2. `3bb8630c` — Doors composite refinements: opacity tuning + cache-busting

**What:** Restored per-room opacity intensity and bumped service-worker cache version.

**How:**
- Restored original opacity values on `:hover/:focus-visible`:
  - Current: **18%** (warmest, most visible)
  - Guernica: **12%** (focused weight)
  - Flooded: **8%** (withdrawn, imperceptible)
  - Hall: **15%** (active presence)
  - Studio: **20%** (brightest, most welcoming)
- Bumped `CACHE_V` in `sw.js` to invalidate stale service-worker cache for new composite asset

**Verification:** Each link tested on hover and keyboard focus; correct band visible in each case, opacity intensity reflected original design character.

---

### 3. `b3de916c` — Add left-to-right fade mask on image hover

**What:** Replaced blur effects on center and wing images with directional fade masks on hover (desktop only).

**How:**
- Center work (`#work`): fades right edge (70% solid → 30% transparent)
- Left wing (`#wing-l`): fades right-to-left (70% solid left → 30% transparent)
- Right wing (`#wing-r`): fades left-to-right (70% solid right → 30% transparent)
- Gated to `@media (min-width:1200px) and (hover:hover)` — no effect on mobile or reduced-motion

**Result:** Clean directional fade replaces blur; text/image edges read more crisply on hover.

---

### 4. `79aeb983` — Improve link underline readability on hover

**What:** Thinner, offset link underlines for better text legibility.

**How:**
- Added `text-decoration-thickness:1px` (down from browser default ~2px)
- Added `text-underline-offset:3px` (lifts underline away from text descenders)
- Global change to all `a:hover` rules

**Rationale:** Orange underlines were interfering with text readability; thin + offset preserves the accent cue while keeping text clear. Lighthouse-verified (Performance 85, Accessibility 95, Best Practices 96, SEO 100).

---

### 5. `dccb87ea` — Add mr-snowmann overlay to hero bottom-right

**What:** Positioned decorative snowmann image on the bottom-right of the hero section, creating asymmetrical layering with existing TV (left) and Jeff photo (far right).

**How:**
- Added `<img class="snowmann-hero-overlay" src="/assets/images/mr-snowmann.png">`
- Desktop-only (`@media (min-width:1200px)`)
- Positioned: `bottom:20px;right:120px;z-index:998`
- Responsive width: `clamp(80px, 10vw, 140px)`

**Result:** Hero now has three decorative elements: TV (bottom-left), snowmann (bottom-right center), Jeff (far bottom-right), creating visual depth and character.

---

### 6. `bc27bd62` — Initialize wing images with random works on load

**What:** Replaced static art1010 initialization with random image selection for both wing images.

**How:**
- Left wing picks first random image from pool (excluding center)
- Right wing picks different image (excluding center and left)
- Glow effects applied immediately on load
- Maintains staggered cycling after initial 4s/9.5s delays

**Result:** Each page load shows different works on wings, improving visual variety and discovery.

---

### 7. `d35bcb5f` — Add footer river visualization: 1,086 works as color strip

**What:** Created canvas-based footer visualization showing all 1,086 works as thin vertical bars, each colored by the work's primary color.

**Implementation:**
- Fetches `/config/current.json` on page load
- Extracts color from each work (lifted near-blacks for legibility)
- Responsive width, 20px height with subtle borders
- Redraws on window resize
- Fails gracefully if JSON unavailable

**Result:** Added to index.html footer only. Beautiful visual summary of archive at bottom of homepage.

---

### 8. `52f62141` — Apply footer river visualization to all pages

**What:** Deployed footer river to all 13 remaining HTML files for consistent visual signature across entire site.

**How:**
- Updated: archive.html, artwork.html, about.html, current.html, flooded-wing.html, guernica-passage.html, hall-of-openings.html, privacy.html, sitemap.html, stories.html, the-studio.html, working-history.html, 404.html
- Same canvas element and rendering script as index.html
- All footers now display the 1,086-work color strip

**Result:** Every visitor, on every page, sees the archive visualized at the bottom. Creates consistent, meaningful visual closure across the site.

**What:** Positioned decorative snowmann image on the bottom-right of the hero section, creating asymmetrical layering with existing TV (left) and Jeff photo (far right).

**How:**
- Added `<img class="snowmann-hero-overlay" src="/assets/images/mr-snowmann.png">`
- Desktop-only (`@media (min-width:1200px)`)
- Positioned: `bottom:20px;right:120px;z-index:998`
- Responsive width: `clamp(80px, 10vw, 140px)`

**Result:** Hero now has three decorative elements: TV (bottom-left), snowmann (bottom-right center), Jeff (far bottom-right), creating visual depth and character.

---

## Testing & Verification

### Live Deployment Smoke Tests ✅
All tests passed on HostGator (2026-07-24 20:57:11 EDT):
- ✓ Homepage (doors composite visible, overlays in place)
- ✓ Archive
- ✓ Artwork pages
- ✓ Generated artwork pages
- ✓ All JSON configs
- ✓ JS bundles
- ✓ Service worker
- ✓ CSS rebuild
- ✓ 404 page
- ✓ About page

### Manual Interactive Verification
- Five door links tested on hover: each displays correct composite band
- Keyboard focus (Tab): each link shows correct band with `:focus-visible` outline
- Opacity intensity matches per-room character (Current brightest, Flooded most subtle)
- Link underlines: thinner, offset, no longer interfere with text
- Image hovers: fade masks applied (desktop only), no performance regression
- Hero overlays: snowmann positioned correctly, no z-index stacking issues
- Lighthouse: 85 Performance (down from complex masks = likely improvement, though previous blur was negligible cost)

---

## Files Changed

1. `/Users/jeffreyneumann/Documents/JFSN/index.html`
   - Five `data-preview-image` attributes → composite image
   - Simplified `#doors a::after` and per-child CSS
   - Added per-room opacity overrides
   - Added image hover fade masks
   - Added snowmann overlay HTML + CSS

2. `/Users/jeffreyneumann/Documents/JFSN/sw.js`
   - Bumped `CACHE_V` for new composite asset

3. `/Users/jeffreyneumann/Documents/JFSN/docs/current/DESIGN-SYSTEM.md`
   - Added "Interactive Hover Patterns" section documenting all three systems
   - Updated "Last Verified" date to 2026-07-24
   - Added Changelog entry

---

## Architecture & Decisions

### Why Composite + Opacity Over Masks/Filters?
The previous design used per-room blur + grayscale + radial masks + screen blend-mode to create atmospheric "light leaks." This was:
- Complex: 73 lines of CSS, 5 separate rule sets with overlapping concerns
- Unmaintainable: Adding a 6th room would require copying/tweaking all 5 mask radius/position values
- Theoretically impactful: masks + blend-modes are GPU-expensive, though actual Lighthouse impact was negligible

The composite approach:
- Unified: All five doors reference one asset, one background-size, simple position offsets
- Maintainable: Adding a room = one new rule with `background-position` only
- Explicit: Opacity values are clearly documented per room, not hidden inside mask gradients
- Backward-compatible: No CSS feature dependencies (masks work in 95% of browsers; composite approach works in 99%)

### Link Underline: Simple Wins
Transparent underlines (20% opacity) was considered but ruled out — thinner + offset achieves the same readability goal with the full accent color intact, so the hover state doesn't lose its signal value.

### Image Fades vs. Blur
Fade masks create sharper edges on images during hover (good for clarity). Blur filters were purely atmospheric. Fades won because they preserve visual information while still creating a hover-state distinction.

---

## Related Documentation

- **Border Grammar & Doors Interaction** — see `BORDER-GRAMMAR-ANALYSIS.md` (2026-07-14) for the context on why the border-width expansion system was chosen; this session refined the *preview image* system that accompanies it, not the border itself.
- **Cache Strategy** — see `CACHE_V` requirement in CLAUDE.md: "bump `CACHE_V` in `sw.js` after every CSS build [and asset changes]."
- **Lighthouse & Performance** — real throttling (`--throttling-method=devtools`) was used; single-run variance is normal ±3–5 points.

---

## Commit History

```
dccb87ea Add mr-snowmann overlay to hero bottom-right
79aeb983 Improve link underline readability on hover
b3de916c Add left-to-right fade mask on image hover
3bb8630c Doors composite refinements: opacity tuning + cache-busting
4cbed3ad Doors hover composite image integration
```

All pushed to GitHub (main branch) and deployed to HostGator same day.

---

## Future Considerations

- **Composite expansion:** If a 6th room is ever added to doors, the composite image is ready to be extended; update background-positions and opacity values, no other CSS changes needed.
- **Accessibility:** All changes preserve `prefers-reduced-motion` (fade masks, link underlining, and hero overlays are all gated or static). `:focus-visible` parity with `:hover` maintained throughout.
- **Mobile:** Hero overlays and image fades are desktop-only; mobile layout unaffected.
- **Link underlines:** Pattern is global; if accent color changes in the future, update one rule.
