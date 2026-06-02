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
- Accent: #FF6600 (international-orange) — hover states, active links, labels only
- Secondary text: #575757 (archive-gray)
- Border: #c4c7c7 (outline-variant)
- Footer background: #ebe8e2 (surface-container-high)
- Mobile nav background: #F3F0EA (bone-white)
- Headings: Playfair Display (400–700), italic where display
- UI / labels: Inter (400–600), ALL CAPS, letter-spacing 0.1em
- Body: Inter 16px / 18px
- No rounded corners (border-radius: 0)
- No drop shadows
- No gradients
- Borders: 1px solid #c4c7c7
- Artwork thumbnails: grayscale by default, full color on hover
```

---

## Nav — always include this instruction

```
Mark the top nav exactly like this so stamp-nav.sh can replace it:
  <!-- NAV:START -->
  [nav HTML]
  <!-- NAV:END -->

The nav contains: JFSN wordmark (links to index.html) + Archive · Series ·
Timeline · Companion · About links + search icon + mobile menu icon.
Mobile bottom nav: fixed bottom, bg #F3F0EA, border-top 1px solid #0B0B0B,
icons for Archive / Series / Timeline / Companion.
```

---

## Content philosophy — always include this

```
This is a personal archive, not a promotional platform.
- No calls to action ("Sign up", "Get started", "Subscribe")
- No testimonials section
- No pricing or tier mentions (unless this IS for-artists.html)
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
  E.g. — "Grayscale thumbnail → full color on hover. Everything else recedes."
  Or — "Horizontal scrub strip. Drag left/right to move through 50 years."]

Do not include:
- [List 3–5 things Stitch will add by default that you don't want]
- No [carousels / testimonials / newsletter signup / pricing table / etc.]

Mobile: [Describe mobile layout specifically — snap scroll? single column? hidden sidebar?]
Desktop: [Describe desktop layout — sidebar + main? full-bleed? grid?]

Nav: Mark top nav <!-- NAV:START --> / <!-- NAV:END --> for stamp-nav.sh.
Mobile bottom nav: bg #F3F0EA, border-top 1px solid #0B0B0B.

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
5. Run `bash stamp-nav.sh` to stamp the canonical nav
6. Test at 390px (iPhone 15 Pro) and 1440px

---

## Pages already built — reference these for consistency

| Page | Notes |
|------|-------|
| `collage.html` | Masonry grid, grayscale→color hover, scroll reveal |
| `photography.html` | Same structure as collage |
| `index.html` | Desktop: full-bleed hero + featured grid. Mobile: snap-scroll folio |
| `archive.html` | Sidebar filters + main grid, mobile sticky filter ledger |
| `about.html` | Multi-section: bio, exhibition record, contact |
| `lost.html` | Essay + ghost grid — sparse, no CTAs, memorial tone |
| `series-index.html` | Card grid, 8 series, Playfair Display titles |
| `constellation.html` | Dark canvas interface, light nav/footer surround |
