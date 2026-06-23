# JFSN — Google Stitch Prompt Guide

Use this every time you generate a new page or component in Stitch.
Copy the template at the bottom, fill in the blanks, paste into Stitch.

---

## Why this exists

Stitch exports need heavy rework if the prompt is vague:
- Wrong colors (Stitch uses its own palette unless you paste exact hex codes)
- Rounded corners, drop shadows, gradients (all banned in this design system)
- Promotional patterns: carousels, CTAs, testimonials, newsletter signups
- Lorem Ipsum instead of real content (leads to wrong type sizing)
- Nav not marked for stamp-nav.sh (requires manual search-and-replace)

A good prompt reduces rework from ~2 hours to ~20 minutes.

---

## Design system — paste this into every prompt

```
Design system:
- Background: #fcf9f3 (bone-white)
- Text: #0B0B0B (deep-ink)
- Accent: #FF6600 (international-orange) — hover/active/focus states, fills, borders. For persistent (always-visible, non-hover) orange TEXT on this light background — eyebrow labels, bracket links — use #B84700 (orange-ink) instead; #FF6600 text only passes contrast on dark backgrounds (session 46 fix, don't reintroduce)
- Secondary text: #575757 (archive-gray)
- Border: #c4c7c7 (outline-variant)
- Footer background: #ebe8e2 (surface-container-high)
- Mobile nav background: #F3F0EA (bone-white)
- Headings: Playfair Display (400–700), italic where display
- UI / labels: Inter (400–600), ALL CAPS, letter-spacing 0.1em
- Body: Inter 16px / 18px
- No rounded corners (border-radius: 0)
- No heavy or hard-edged shadows (soft diffused shadow `0 0 20px rgba(0,0,0,0.05)` is OK on UI cards — NEVER on artwork thumbnails)
- No gradients
- Borders: 1px solid #c4c7c7
- Artwork thumbnails: full color always — no grayscale, ever
```

---

## Nav — always include this instruction

```
Mark the top nav exactly like this so stamp-nav.sh can replace it:
  <!-- NAV:START -->
  [nav HTML]
  <!-- NAV:END -->

Top nav contains: JFSN wordmark (links to index.html) + 4 nav links
(Archive · Series · About · Lost Works) + ⌘K search trigger.

Mobile nav is a hamburger button (mobile only) that opens a slide-in
drawer (#mobile-menu-drawer) — NOT a fixed bottom tab bar.
Drawer links carry inline feather-style SVG icons (24-viewBox,
1.8 stroke, currentColor — no icon fonts).
```

---

## Content philosophy — always include this

```
This is a personal archive, not a promotional platform.
- No calls to action ("Sign up", "Get started", "Subscribe")
- No testimonials section
- No pricing or tier mentions
- No newsletter signup
- No "hero" with a stock photo
- No engagement patterns
- Descriptions are spare: year, medium, dimensions if known
- The image is the primary object — UI recedes
```

---

## Export instruction — always include this

```
Export as a single HTML file.
- Tailwind CDN: <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
- Tailwind config inline in a <script id="tailwind-config"> block
- Page-specific CSS in a <style> block in <head>
- No external component libraries (no Bootstrap, no DaisyUI, no Flowbite)
- loading="lazy" on all artwork <img> tags
- loading="eager" on hero images
- Nav marked with NAV:START / NAV:END comments
- Footer marked with FOOTER:START / FOOTER:END comments
```

---

## Full prompt template

Copy this, fill in the `[brackets]`, paste into Stitch:

```
Design system:
Background #fcf9f3 · text #0B0B0B · accent #FF6600 (hover/active only) ·
secondary text #575757 · border #c4c7c7 · footer bg #ebe8e2 ·
headings Playfair Display · UI Inter ALL CAPS 0.1em tracking ·
no rounded corners · no shadows · no gradients.

Page: [filename.html]
Purpose: [One sentence — what this page does. Who uses it and why.]
Real content example:
  [Paste 1–2 actual items from the archive, not Lorem Ipsum.
   E.g. — Title: "XXXIII Días Installation View" · Year: 2000 · Medium: Photography]

Key interaction: [The one thing that makes this page worth visiting.
  E.g. — "Orange outline appears on image hover. Title turns orange. UI recedes."
  Or — "Horizontal scrub strip. Drag left/right to move through 50 years."]

Do not include:
- [List 3–5 things Stitch will add by default that you don't want]
- No [carousels / testimonials / newsletter signup / pricing table / etc.]
- No grayscale on artwork thumbnails — always full color

Mobile: [Describe mobile layout specifically — snap scroll? single column? hidden sidebar?]
Desktop: [Describe desktop layout — sidebar + main? full-bleed? grid?]

Nav: Mark top nav <!-- NAV:START --> / <!-- NAV:END --> for stamp-nav.sh.
Top nav has 4 items: Archive · Series · About · Lost Works.
Mobile nav is a hamburger button → slide-in drawer (#mobile-menu-drawer), NOT a bottom bar.

Content philosophy: personal archive, not promotional. No CTAs. No engagement patterns.
The image is the primary object. UI recedes.

Export: single HTML, Tailwind CDN, tailwind.config inline, page CSS in <style> block,
no external component libraries, loading="lazy" on artwork images.
```

---

## After you get the Stitch export

1. **Extract** layout structure, spacing, grid columns, typography hierarchy
2. **Extract** any interaction/animation code worth keeping
3. **Do NOT use the export directly** — it has placeholder content, wrong SEO, no analytics
4. **Apply** the extracted structure to a new HTML file using the real design system
5. **Swap Tailwind CDN** — replace `<script src="https://cdn.tailwindcss.com...">` with `<link rel="stylesheet" href="site.min.css"/>` and remove the inline `tailwind.config` script
6. **Add nav-active.js** — `<script src="_shared/nav-active.js" defer></script>` so the orange active nav link sets correctly
7. Run `bash stamp-nav.sh` to stamp the canonical nav
8. Test at 390px (iPhone 15 Pro) and 1440px

---

## Pages already built — reference these for consistency

| Page | Notes |
|------|-------|
| `collage.html` | Masonry grid, full color always |
| `photography.html` | Same structure as collage |
| `index.html` | Desktop + mobile: CSS Columns masonry Selected Works grid (4→3→2 cols). Image + always-visible caption + link — no hover overlays/badges/swatches (2026-06-21 simplicity pass) |
| `archive.html` | Sidebar filters + main grid, mobile sticky filter ledger. Still carries Session-77 fc-* interaction layer — flagged in IMPROVEMENTS.md |
| `about.html` | Multi-section: bio → contact → Lost Works bar → exhibition record |
| `lost.html` | Essay + ghost grid — sparse, no CTAs, memorial tone |
| `series-index.html` | Card grid, 8 series, Playfair Display titles |
| `wall.html` | 1,084 mini tiles, all full color |
| `guernica.html` | Static theme page — 232 works, full static grid |
| `api.html` | Developer docs — expandable endpoint cards, code blocks, light bg |
| `stories.html` | In nav. Long-form story/context entries. |
| `start-here.html` | Orientation page — who Jeff is, major themes, how to explore. Stamped. |
| `favorites.html` | 45 personally significant works from favorites.txt. Stamped. |
| **DELETED** | `constellation.html`, `for-artists.html`, `mosaic.html`, `companion.html` (AI chat feature, removed 2026-06-22 with Netlify) — do not recreate. Note: an earlier `timeline.html` was also deleted long ago, but a *new* `timeline.html` (decade skeleton) was built in session 23 and is live today — don't confuse the two. |
