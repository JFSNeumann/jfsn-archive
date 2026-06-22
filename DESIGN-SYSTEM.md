# JFSN Archive — Design System

**Living design documentation**  
Last meaningfully updated: 2026-06-22  
Framework: Tailwind CSS + vanilla HTML/CSS/JS  
Philosophy: Artwork first. UI recedes. Light, archival aesthetic.

> Tokens, typography, and visual rules are canonically defined in `CLAUDE.md` § "Design System (current — Stitch/Tailwind, light)". This document is the implementation-level reference (component specs, accessibility patterns, interaction behavior, JSON export for automation). Where the two overlap, CLAUDE.md wins.

---

## Overview

This design system documents the JFSN Archive visual language across 1,084 works and 31+ public pages.

The archive welcomes a range of visitors — first-time arrivals coming for the work, family encountering personal history, researchers and collectors interested in a specific theme. The design serves *the work and its honest presentation*, not a user-type optimization. JFSN-MISSION.md is the authority on who this archive exists for and why.

**Core principle:** The work is the primary object. Everything else supports discovery and understanding.

---

## Color System

Token definitions (Stitch light + Material Design light) live in `CLAUDE.md` § "Token reference (two configs in use)". This document does not duplicate them; reference CLAUDE.md when implementing.

### Contrast rule (load-bearing — repeated here because component specs depend on it)

- `#FF6600` (international-orange): **6.7:1** on dark backgrounds only. **FAILS** (2.79:1) on light bone-white.
- `#B84700` (orange-ink): **5.07:1** on light backgrounds. Use for persistent text (labels, links, active states).
- `#0B0B0B` (deep-ink): **20:1** on light backgrounds. Highest contrast.
- `#575757` (archive-gray): **8.59:1** on light backgrounds. Good for secondary text.

**Operative rule:** Orange text on light backgrounds must use `orange-ink` (#B84700). Hover/active states, fills, and sections on dark backgrounds can use `international-orange` (#FF6600).

### Soft shadows
Card shadow for UI elements only (NOT artwork thumbnails):
```css
box-shadow: 0 0 20px rgba(0,0,0,0.05);  /* soft, diffused — never hard-edged */
```

---

## Typography

### Font Stack
- **Headings:** Playfair Display (400–700, serif)
- **UI/labels:** Inter (400–600, sans-serif)
- **Monospace:** `ui-monospace, 'SF Mono', Menlo, monospace` (metadata, IDs)

### Scale

| Role | Font | Size | Weight | Line Height | Letter Spacing | Usage |
|------|------|------|--------|-------------|----------------|-------|
| Display Large | Playfair | 64px | 700 | 1 | -0.02em | Hero headlines |
| Heading 1 | Playfair | 40px | 700 | 1.2 | -0.01em | Page titles |
| Heading 2 | Playfair | 28px | 600 | 1.3 | 0 | Section headers |
| Body Large | Inter | 18px | 400 | 1.6 | 0 | Rich text, essays |
| Body Medium | Inter | 16px | 400 | 1.6 | 0 | Default body text |
| Label Large | Inter | 13px | 600 | 1.3 | 0.08em | Card titles, eyebrows |
| Label Medium | Inter | 11px | 600 | 1.3 | 0.08em | Metadata, filter labels |
| Caption | Inter | 10px | 500 | 1.4 | 0.08em | Fine print, timestamps |
| Monospace | SF Mono | 10px | 400 | 1.4 | 0.08em | Archive IDs (art1234) |

### Headings
All caps, uppercase, except Playfair display headings (sentence case).

### Links
- **Style:** Underline (1px) on `<a>` tags
- **Color:** `orange-ink` (#B84700) on light backgrounds
- **Hover:** Underline animates in via `transform: scaleX(0→1)`
- **Transition:** `0.2s ease`
- **Reduced motion:** No transition

---

## Spacing & Sizing

### Tailwind Scale (Standard)
Used throughout: padding, margins, gaps, widths.

```
px-2 / py-2        = 8px (x-small gaps, tight spacing)
px-3 / py-3        = 12px (xs)
px-4 / py-4        = 16px (sm — most common)
px-6 / py-6        = 24px (md)
px-8 / py-8        = 32px (lg)
px-12 / py-12      = 48px (xl)
px-16 / py-16      = 64px (2xl)
px-20 / py-20      = 80px (3xl)
```

### Margin aliases
- `mb-lg` = 24px bottom margin (between sections)
- `mt-xl` = 48px top margin (major breaks)
- `gap-gutter` = 20px (grid gaps on desktop, tighter on mobile)

### Mobile vs Desktop
- **Mobile margins:** `px-margin-mobile` = 16px (tight, readable on small screens)
- **Desktop margins:** `px-margin-desktop` = 32px (breathing room)
- **Max width:** `max-w-container-max` = 1440px (archive grid expansion point)

---

## Component Library

### Cards (UI Elements)

#### Quote Card (Sidebar, callouts)
```html
<div class="quote-card">
  <span style="display:block;font-weight:500;color:#0B0B0B;margin-bottom:6px;">Heading</span>
  <p style="font-size:13px;line-height:1.65;color:#575757;margin:0;">Body text...</p>
</div>
```
**Styling:**
- Background: `#fcf9f3` (bone-white)
- Border: `1px solid #8e7164` (warm-brown archival)
- Padding: `16px`
- Shadow: `0 0 20px rgba(0,0,0,0.05)` (soft)
- Margin: `16px 0`

#### Archive Card (Grid thumbnail)
```html
<a href="artwork.html?id=art1234" class="archive-card">
  <div class="archive-card-img">
    <img src="artworks/thumbs/art1234.avif" alt="Title" loading="lazy"/>
  </div>
  <div class="space-y-1">
    <h4>Title</h4>
    <span>1990s | Photography</span>
  </div>
</a>
```
**Styling:**
- Image wrapper: relative, overflow hidden, border `#8e7164`, soft shadow (desktop only)
- Image: full color always — no overlays, no filters, no mix-blend-mode. The saturation overlay that lived here was removed sitewide in Session 74.
- Hover: image outline animates to `#e05900`, title text turns `#e05900`

### Links

#### Bracket Links
```html
<a href="path" class="bracket-link">
  <span>Text</span>
  <span>[ Arrow → ]</span>
</a>
```
**Styling:**
- `display: flex; justify-content: space-between`
- Text: `orange-ink` (#B84700)
- Underline: 1px on `<a>`, animates in on hover
- No transform, no scale

#### Nav Links
```html
<a href="path" class="nav-link">Text</a>
```
**Styling (with nav-active.js):**
- Default: `text-deep-ink` (#0B0B0B)
- Hover: `text-international-orange` (#FF6600)
- Active: `aria-current="page"` + underline drawn via `::after` transform
- Transition: `0.2s ease` (reduced-motion: none)

### Forms

#### Custom Checkbox (Archive filters)
```html
<input type="checkbox" class="custom-checkbox" value="collage"/>
```
**Styling:**
- Size: 14×14px
- Border: `1px solid #c4c7c7` (outline-variant)
- Checked: `background:#000000; border:#000000`
- Checked::after: white checkmark (rotated SVG path)
- Focus: `outline: 2px solid #FF6600; outline-offset: 2px`

#### Select Dropdown
```html
<select id="sort-select">
  <option>Sort by...</option>
</select>
```
**Styling:**
- Font: Inter 13px
- Border: `1px solid #c4c7c7`
- Focus: `outline: 2px solid #FF6600; outline-offset: 2px`

### Buttons

#### CTA Buttons (Hero, primary actions)
```html
<a href="#" class="hero-cta-fill">[ Text → ]</a>
```
**Styling:**
- Background: `#FF6600` (international-orange)
- Text: white
- Border: 2px solid `#FF6600`
- Padding: `12px 20px`
- Font: Inter 13px bold
- Hover: opacity transition
- Focus: outline `2px solid #0B0B0B`

#### Secondary Buttons
```html
<a href="#" class="hero-cta-ghost">[ Text ]</a>
```
**Styling:**
- Background: transparent
- Border: 2px solid white
- Text: white
- Hover: invert colors

### Breadcrumbs
```html
<div id="breadcrumb">
  <a href="archive.html">Archive</a>
  <span> › </span>
  <a href="archive.html?series=Guernica">Guernica</a>
</div>
```
**Styling:**
- Font: Inter 12px, `#575757`
- Separator: ` › ` in `#8e7164` (archival warm-brown)
- Links: underline `1px solid #575757`, hover `#FF6600`
- Margin: `16px 0`

### Filter Chips
```html
<span class="filter-chip">
  Collage
  <button>×</button>
</span>
```
**Styling:**
- Background: `#ebe8e2` (surface-container-high)
- Border: `1px solid #c4c7c7`
- Padding: `4px 10px`
- Font: Inter 11px uppercase, letter-spacing 0.08em
- Close button: `#575757` hover `#FF6600`
- Margin: `4px`

---

## Interactions & Animations

### Hover States
- **Images:** Outline animates in orange, caption title turns orange
- **Links:** Underline draws in (transform: scaleX)
- **Buttons:** Opacity/color transition, no scale
- **Cards:** Soft shadow may intensify (optional enhancement)

### Focus States
- **All interactive:** `outline: 2px solid #FF6600; outline-offset: 2px`
- **Accessible:** Always visible, never removed

### Transitions
- **Standard:** `0.2s ease` (most interactions)
- **Longer:** `0.3s ease` (drawer open/close, page transitions)
- **Reduced motion:** All transitions disabled when `prefers-reduced-motion: reduce`

### Animations

#### Entrance Animations
- **Fade-in:** opacity 0→1, 0.6s (when used; respect `prefers-reduced-motion`)
- **Slide-up:** transform translateY(20px→0), 0.6s
- **Stagger:** 50ms between items in grid/list
- **Reduced motion:** No animation, instant appearance

Per CLAUDE.md's "Design is open" stance: entrance motion, scroll-reveals, parallax, and transforms are all part of Jeff's craft and may be used per page — that restriction was retired in CLAUDE.md and the Don'ts list below has been corrected to match (2026-06-22). The only non-negotiable motion rule is `prefers-reduced-motion` support, always.

#### Loading States
- **Progress bar:** `#FF6600` width animation (archive-progress bar)
- Skeleton/shimmer loading states are no longer categorically banned — see the Don'ts correction below. Use judgment per page.

#### Drawer Animation (Mobile nav)
- **Stagger entrance:** Each link fades in with 50ms delay
- **Slide-in:** translateX(-100%→0), 0.25s ease
- **Reduced motion:** No stagger, instant

### Canvas Animations
- **Chromatic River:** Hover reveals year, click expands
- **River canvas (homepage):** Deferred to requestIdleCallback (after FCP)

---

## Accessibility Guidelines

### Contrast (WCAG AA Minimum)
- Text on background: 4.5:1
- Large text (18px+): 3:1
- Graphical elements: 3:1
- **Audit:** `#FF6600` on bone-white FAILS (2.79:1) — use `orange-ink` instead for persistent text

### Keyboard Navigation
- Tab order: logical, left-to-right, top-to-bottom
- Focus visible: always, never hidden
- Skip link: "Skip to content" available on all pages
- Decade pages: ← / → arrow keys navigate between decades

### Screen Readers
- Images: descriptive `alt` text (work title, medium, year)
- Links: context clear from text (not "click here")
- Buttons: `aria-label` for icon-only buttons
- Active nav: `aria-current="page"` on current section
- Live regions: `aria-live="polite"` for filter updates

### Color Independence
- Don't convey information via color alone
- Use text labels + icons + color together
- Sufficient contrast ratios (see above)

### Motion & Vestibular
- **Respect `prefers-reduced-motion: reduce` — this is the actual non-negotiable rule, not a ban on any specific motion technique.** Parallax, auto-playing hero rotation, and other motion are allowed (per CLAUDE.md's "Design is open" stance) as long as a reduced-motion fallback exists.
- Users should always have a way to stop or skip auto-playing motion that runs longer than ~5s (the hero rotation already supports pause-on-attention — see Session 79).

### Touch Targets
- Minimum 44×44px (mobile tap targets)
- Icons: 20–24px with padding for spacing
- Buttons: 44px height minimum

---

## Usage Patterns & Do's/Don'ts

### Do's ✅

- **Color:** Use `orange-ink` (#B84700) for persistent text on light backgrounds
- **Artwork first:** Minimize UI chrome, maximize image real estate
- **Whitespace:** Generous margins between sections (24px–64px)
- **Typography:** Use Playfair for headlines (elegant), Inter for body (readable)
- **Borders:** Warm-brown archival (#8e7164) for intentional sections, neutral (#c4c7c7) for general UI
- **Shadows:** Soft, diffused only — `0 0 20px rgba(0,0,0,0.05)` for cards
- **Interactions:** Fade, slide, color shifts, scale/transform — all fair game on UI chrome; reduced-motion support required
- **Animation:** Fade-in, stagger, scroll-reveal, parallax — Jeff's craft, used per page; reduced-motion support required
- **Focus:** Always visible, high-contrast outline

### Don'ts ❌ — corrected 2026-06-22 to match CLAUDE.md's actual current stance

**This list previously banned several generic motion patterns (scroll-reveal, scale/transform on hover, sibling dim, skeleton loading) as a blanket restraint policy. CLAUDE.md explicitly retired that policy** ("Earlier versions of this file read 'default to removal' as minimalism and walked back legitimate motion work... That over-correction is retired"). The only non-negotiable category is **honest treatment of the artwork itself** — that's what actually belongs in a Don'ts list:

- **Grayscale filter, recolor, or any color/saturation filter on the artwork image itself** (removed session 18 — keep full color, always)
- **Mask-image gradient or crop-distort hiding parts of an artwork image**
- **Tilting or transforming the artwork image itself** (transforms on surrounding UI chrome are fine; the work stays undistorted)
- **Hiding a work's title/year/medium behind a hover-only state** — it vanishes on touch and is invisible to screen readers
- **Hero text labels printed directly over artwork** (covers the work)
- **Particle/canvas effects rendered over artwork** (dust, grain — obscures the work)
- **Fabricated provenance, badges, DPI, accession numbers, or composites presented as real exhibitions** — see Archive Integrity below
- **International-orange text** on light backgrounds (use orange-ink instead — this one's an accessibility/contrast rule, unrelated to the motion-restraint reversal above)

**No longer banned (Jeff's craft, not a violation):** scroll-reveal, scale/transform on hover (on UI chrome, not the artwork), sibling dim, skeleton loading, parallax, auto-playing hero motion. Use judgment; the litmus in `CLAUDE.md` is the test, not this list.

### Archive Integrity
- **Dimensions:** Leave blank if unknown (don't guess)
- **Year precision:** Always show decade estimates ("1990s (est.)")
- **Composite flag:** Show "Photoshop composite — imagined placement" for ~250 works
- **Provenance:** Never fabricate accession numbers, verification badges, or DPI

---

## Performance & Constraints

### Image Optimization
- **Format:** AVIF (primary), with fallback consideration for older browsers
- **Sizes:** Thumbs (400w), medium (900w), full (1200w+)
- **Preload:** Hero images only (fetchpriority="high")
- **Lazy loading:** All grid/archive images (`loading="lazy"`)

### LCP
- **Goal:** Web Vitals "good" range
- **Live numbers move** — capture current Lighthouse mobile baseline at end of each performance pass; do not bake numbers into this document.
- **Optimization pattern:** Hero image swap (preload lightweight, swap to full after LCP fires); `srcset` on top-3 homepage cards; self-host fonts to avoid render-blocking Google Fonts.

### Cache & SW
- **Service Worker:** Cache-first for AVIF, network-first for JSON/HTML/CSS/JS
- **Cache version:** Bump `CACHE_V` in `sw.js` after CSS rebuild or major deployment
- **TTL:** AVIF images cached for 1 year; HTML/CSS/JS always fresh

---

## Design Tokens Export (for tools/automation)

```json
{
  "colors": {
    "bone-white": "#fcf9f3",
    "deep-ink": "#0B0B0B",
    "archive-gray": "#575757",
    "orange-ink": "#B84700",
    "international-orange": "#FF6600",
    "outline-variant": "#c4c7c7",
    "archival-outline": "#8e7164",
    "archival-outline-soft": "#e3bfb1",
    "surface-container-high": "#ebe8e2"
  },
  "typography": {
    "font-family": {
      "serif": "'Playfair Display', Georgia, serif",
      "sans": "Inter, system-ui, sans-serif",
      "mono": "ui-monospace, 'SF Mono', Menlo, monospace"
    },
    "scale": {
      "display-lg": { "size": "64px", "weight": 700, "line-height": 1 },
      "heading-1": { "size": "40px", "weight": 700, "line-height": 1.2 },
      "body-md": { "size": "16px", "weight": 400, "line-height": 1.6 }
    }
  },
  "spacing": {
    "xs": "8px",
    "sm": "16px",
    "md": "24px",
    "lg": "32px",
    "xl": "48px",
    "2xl": "64px"
  },
  "shadows": {
    "card": "0 0 20px rgba(0,0,0,0.05)"
  }
}
```

---

## Changelog

**2026-06-22 (later same day)** — Corrected the Don'ts list, which still banned scroll-reveal/scale-transform-on-hover/sibling-dim/skeleton-loading/parallax as a blanket restraint policy — directly contradicting CLAUDE.md's "Design is open" reversal of exactly that policy. Rewrote Don'ts to contain only what's actually non-negotiable: honest treatment of the artwork itself (no filter/recolor/distort/tilt, no metadata hidden behind hover, no fabricated provenance) plus the orange-ink contrast rule. Also fixed the Motion & Vestibular section, which banned parallax outright instead of stating the real rule (respect `prefers-reduced-motion`).

**2026-06-22** — Doc-vs-reality sync. Removed the saturation-overlay spec from Archive Card (the overlay was removed sitewide in Session 74). Deleted "Polishing Opportunities" section (contradicted the Don'ts list above it; live items moved to IMPROVEMENTS.md). Removed duplicated token tables — CLAUDE.md is now the canonical source for tokens. Softened the "three personas" framing to match JFSN-MISSION.md (visitors welcomed, not user-types optimized). Removed stale LCP numbers; performance section now points to live measurement instead.

**2026-06-17** — Initial formalization from CLAUDE.md. Added breadcrumb component, polishing opportunities, performance notes.

**2026-06-14** — Stitch June-2026 adoption: soft shadows, warm-brown borders, orange-ink (accessible orange) added for persistent text.

**2026-06-10** — Accessibility audit: discovered international-orange text contrast failure on light backgrounds, introduced orange-ink.

