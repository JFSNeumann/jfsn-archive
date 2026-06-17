# JFSN Archive — Design System

**Living design documentation**  
Last updated: 2026-06-17  
Framework: Tailwind CSS + vanilla HTML/CSS/JS  
Philosophy: Artwork first. UI recedes. Light, minimal, archival aesthetic.

---

## Overview

This design system formalizes the JFSN Archive visual language across 1,084 works and 31 public pages. It serves three personas: **first-time visitors** (visual, narrative entry), **researchers** (data, analysis, patterns), and **family** (legacy, inheritance, personal context).

**Core principle:** The work is the primary object. Everything else supports discovery and understanding.

---

## Color System

### Token Reference

All colors are defined in two systems: **Stitch light** (primary UI pages) and **Material Design light** (decade/archive pages). Both converge on the same visual language.

#### Stitch Light (Primary)
Used on: collage.html, sculpture.html, photography.html, painting.html, lost.html, series index, start-here, favorites, api, stories, etc.

```
background:             #fcf9f3   (bone-white, page bg)
deep-ink:               #0B0B0B   (primary text — dark gray)
archive-gray:           #575757   (secondary text, labels)
orange-ink:             #B84700   (persistent orange text — 5.07:1 AA contrast on light bg)
international-orange:   #FF6600   (accent orange — only for hover/active/fills on dark sections — 6.7:1 on dark)
outline-variant:        #c4c7c7   (neutral border)
archival-outline:       #8e7164   (warm-brown archival border — Stitch June-2026)
archival-outline-soft:  #e3bfb1   (warm-brown soft divider — Stitch June-2026)
surface-container-high: #ebe8e2   (footer bg)
bone-white:             #F3F0EA   (mobile nav bg)
```

#### Material Design Light (Archive/Decade Pages)
Used on: archive.html, 1970s–2020s decade pages

```
background:             #fdf8f8   (warm off-white)
primary:                #000000   (deep black text)
secondary:              #5e5e5e   (gray secondary)
on-tertiary-container:  #e05900   (orange accent)
outline-variant:        #c4c7c7   (neutral border)
surface-container-high: #ebe7e6   (footer bg)
on-surface:             #1c1b1b   (text)
on-surface-variant:     #444748   (secondary text)
```

### Contrast Requirements

**WCAG AA compliance:**
- `#FF6600` (international-orange): **6.7:1** on dark backgrounds only. FAILS (2.79:1) on light bone-white.
- `#B84700` (orange-ink): **5.07:1** on light backgrounds. Use for persistent text (labels, links, active states).
- `#0B0B0B` (deep-ink): **20:1** on light backgrounds. Highest contrast.
- `#575757` (archive-gray): **8.59:1** on light backgrounds. Good for secondary text.

**Rule:** Orange text on light backgrounds must use `orange-ink` (#B84700). Hover/active states, fills, and sections on dark bg can use `international-orange` (#FF6600).

### Soft Shadows (Stitch June-2026)
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
- Hover: image outline animates to `#e05900`, title text turns `#e05900`
- Overlay: `::after` pseudo-element with `background:#808080; mix-blend-mode:saturation` on top 40% of image (desaturated top, fades to color at bottom)
- On hover: overlay opacity→0 (full color revealed)

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
- **Images:** Outline animates in, saturation overlay fades out, color revealed
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

#### Entrance Animations (Phase 1 & 2, shipped)
- **Fade-in:** opacity 0→1, 0.6s
- **Slide-up:** transform translateY(20px→0), 0.6s
- **Stagger:** 50ms between items in grid/list
- **Reduced motion:** No animation, instant appearance

#### Loading States
- **Skeleton:** ~~pulse animation~~ (REMOVED — use static placeholder)
- **Progress bar:** #FF6600 width animation (archive-progress bar)

#### Page Transitions
- **View Transition API:** Morph hero card on navigation (if supported)
- **Fallback:** Fade-in 0.3s

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
- Respect `prefers-reduced-motion: reduce`
- No parallax, no auto-playing animations
- Users should always control motion

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
- **Interactions:** Fade, slide, color shifts — no scale/transform
- **Animation:** Fade-in, stagger on grids, reduced-motion support required
- **Focus:** Always visible, high-contrast outline

### Don'ts ❌

- **Grayscale filter** on thumbnails (removed session 18 — keep full color)
- **Mask-image gradient** hiding parts of images
- **Scroll-reveal** (opacity 0 on intersection) — items visible by default
- **Scale/transform** on hover (`scale(1.05)`, `scale(1.02)`)
- **Sibling dim** (`.grid:has(:hover) .thumb { opacity:0.5 }`)
- **Hover overlays** on artwork cards
- **Hero text labels** over artwork ("PERSONAL ARCHIVE")
- **Particle/canvas effects** over artwork (dust, grain)
- **Skeleton loading** animations
- **International-orange text** on light backgrounds (use orange-ink instead)

### Archive Integrity
- **Dimensions:** Leave blank if unknown (don't guess)
- **Year precision:** Always show decade estimates ("1990s (est.)")
- **Composite flag:** Show "Photoshop composite — imagined placement" for ~250 works
- **Provenance:** Never fabricate accession numbers, verification badges, or DPI

---

## Polishing Opportunities (Future Iterations)

### High Priority
1. **Decade page navigation visibility** — Links to 1980s–2020s are not discoverable; consider adding to explore.html or nav
2. **Search UX** — No visual feedback during filter loading; consider subtle loading state
3. **Mobile breadcrumbs** — Truncate long breadcrumb paths on small screens (e.g., "Archive › ... › Guernica")
4. **Hover state enhancement** — Card shadow could intensify on hover (optional, maintain restraint)

### Medium Priority
5. **Dark mode** — Consider optional dark theme for researchers doing night-time analysis
6. **Data table** — Researcher CSV/API results could benefit from styled table component
7. **Related works sidebar** — On artwork pages, suggest next/previous in series (if present)
8. **Print styles** — Optimize artwork pages for printing (hide nav, optimize image sizing)

### Low Priority
9. **Animations on scroll** — Gentle fade-in as sections come into view (if motion not reduced)
10. **Micro-interactions** — Button press feedback, success confirmations
11. **Custom scrollbar** — Match design system (optional, low UX impact)
12. **Loading skeleton** — Placeholder while images load (if bandwidth warrants)

---

## Performance & Constraints

### Image Optimization
- **Format:** AVIF (primary), with fallback consideration for older browsers
- **Sizes:** Thumbs (400w), medium (900w), full (1200w+)
- **Preload:** Hero images only (fetchpriority="high")
- **Lazy loading:** All grid/archive images (`loading="lazy"`)

### LCP Target
- **Goal:** 3-4s (good range per Web Vitals)
- **Current:** 3.9s (homepage), 5.1s (archive)
- **Optimization:** Hero image swap (preload lightweight, swap to full after LCP fires)

### Cache & SW
- **Service Worker:** Cache-first for AVIF, network-first for JSON/HTML/CSS/JS
- **Cache version:** Bump CACHE_V in sw.js after CSS rebuild or major deployment
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

**2026-06-17** — Initial formalization from CLAUDE.md. Added breadcrumb component, polishing opportunities, performance notes.

**2026-06-14** — Stitch June-2026 adoption: soft shadows, warm-brown borders, orange-ink (accessible orange) added for persistent text.

**2026-06-10** — Accessibility audit: discovered international-orange text contrast failure on light backgrounds, introduced orange-ink.

