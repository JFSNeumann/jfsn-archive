# Current State
**Updated:** 2026-06-02

## This session — Three-part technical audit + mobile hero redesign

### QA Pass 1 — Nav & design consistency
- All 22 pages: nav border fixed `border-outline-variant` → `border-deep-ink` (top nav + mobile bottom nav)
- `_shared/top-nav.html` updated as source of truth; stamp-nav.sh re-run across all 13 Stitch pages
- `archive.html` Tailwind config: added missing Stitch tokens (`deep-ink`, `bone-white`, `international-orange`, `archive-gray`, `nav-link`, `label-caps`)
- `constellation.html` footer added (was missing entirely — no PRIVACY link, no 4-column layout)
- Decade pages (1970s–2020s): `deep-ink` token added to each config; nav borders fixed
- `companion.html` sub-12px text fixed: `--c-cap` 0.6875rem → 0.75rem
- `archive.html` dead TERMS link removed

### QA Pass 2 — Mobile UX
- `index.html` folio snap-scroll: `100vh` → `100dvh` (iOS Safari address bar fix)
- `archive.html` mobile filter buttons: `py-1` → `py-3 min-h-[44px]` (touch target 22px → 44px+)

### QA Pass 3 — Desktop & accessibility
- Skip-to-content link added to `_shared/top-nav.html` (stamps to all Stitch pages)
- `id="main"` added to `<main>` on: index, archive, artwork, series-index, timeline, about
- `mosaic.html` canvas: `aria-label` added
- Duplicate skip links removed from pages that already had them (lost, mosaic, collage, photography, sculpture, painting)

### Part 1 — Performance audit
- `index.html` hero: `<link rel="preload">` for art0953.avif + `fetchpriority="high"` added
- `1970s–2020s` all 6 decade pages: first 4 thumbnails `loading="lazy"` → `loading="eager" fetchpriority="high"` (LCP fix)
- `sw.js` PRECACHE expanded from 8 → 21 URLs; CACHE_V bumped to `jfsn-20260602-audit`
- **Known architectural issue:** Tailwind CDN is render-blocking (~1.5MB) on all 26 pages. Proper fix = `npx tailwindcss` build step generating purged CSS. ~200–400ms FCP gain. Deferred — dedicated session needed.

### Part 2 — Canvas keyboard accessibility
- `constellation.html` `#cv`: `tabindex="0"`, `role="application"`, full aria-label, orange `:focus` ring, Escape-to-blur handler
- `chromatic.html` `#river-canvas`: `tabindex="0"`, `role="img"`, updated aria-label, focus ring, Escape-to-blur handler
- `mosaic.html` `#mosaic-canvas`: `tabindex="0"`, `role="application"`, updated aria-label, focus ring, Escape-to-blur handler
- `wall.html`: no fix needed — it's `<a>` tiles, already keyboard-navigable

### Part 3 — SEO crawlability
- `artwork.html` static title improved: "Artwork —" → "Archive —" (less confusing fallback)
- `artwork.html` static description improved: generic → informative (mentions 1,084 works, mediums, date range)
- `artwork.html` JS description: now unique per work — uses `w.description` with attribution, or constructs "Title, Year — Medium by Jeffrey F. S. Neumann"
- `artwork.html` JSON-LD `VisualArtwork` schema added (JS-injected per artwork load): name, url, image, dateCreated, artMedium, description, creator, isPartOf collection
- **Known issue:** `artwork.html` canonical still JS-only (static fallback = `artwork.html` without `?id=`). Full fix requires SSG or server-side rendering. Google resolves via sitemap + JS rendering.

### Mobile hero redesign
- `index.html` mobile snap 1: complete redesign — full-bleed `object-cover` filling snap height, `rgba(11,11,11,0.42)` dark veil, text/buttons centered over image (mirrors desktop hero exactly)
- Hero now full color (removed `folio-artwork-img` grayscale class from hero image)
- `fetchpriority="high"` added to mobile hero image
- "Five Decades of Making" heading (36px italic, bone-white) + "1,084 works · 1974–present" body
- Two stacked CTAs: EXPLORE ARCHIVE (orange fill) + VIEW SERIES (ghost border)
- Pulsing SCROLL indicator at bottom
- Artwork snaps 2–4: image borders `border-outline-variant` → `border-deep-ink`

---

## To do next session
- [ ] bash deploy.sh — push everything live to jfsn.com
- [ ] Test companion.html live at jfsn.com/companion.html (AI still working?)
- [ ] about.html exhibitions: add real show history when ready (~line 375)
- [ ] **Tailwind CDN → build step** — replace CDN with purged `npx tailwindcss` output. ~200–400ms FCP gain across all 26 pages. Biggest remaining performance win.

## Known issues
- companion.html: test live at jfsn.com/companion.html to confirm AI still works
- about.html exhibitions: update table rows with real show history when ready (~line 375)
- artwork.html canonical: JS-only, static fallback missing `?id=`. SSG needed for full fix.
- Tailwind CDN render-blocking on all 26 pages (architectural — needs build step)

## Site is live at
- jfsn.com  (primary — cPanel)
- jfsn-archive.netlify.app  (secondary — Netlify, has Companion function)

## Archive stats
- 1084 works cataloged, 0 errors
