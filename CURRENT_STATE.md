# Current State
**Updated:** 2026-06-02

## This session — Full improvement run

### Performance
- Tailwind CDN (1.5MB, render-blocking) replaced with built `site.min.css` (31KB) on all 29 pages
- `tailwind.config.js` + `input.css` added; rebuild: `./node_modules/.bin/tailwindcss -i input.css -o site.min.css --minify`
- `node_modules/` gitignored + deploy-excluded; `package.json` stays for dep tracking
- index.html desktop + mobile hero: `fetchpriority="high"` + `<link rel="preload">` on art0953
- 1970s–2020s: first 4 thumbnails each changed `loading="lazy"` → `loading="eager" fetchpriority="high"`
- sw.js PRECACHE expanded 8 → 21 URLs

### Search — now works everywhere
- `search.js` loads on all 13 Stitch pages (was never loaded after redesign)
- Nav search button wired: clicking the 🔍 icon opens the ⌘K overlay
- `search.js` is self-contained: injects its own CSS, works on any page

### SEO — 1,084 pages now indexable
- `artworks/pages/artNNNN.html` — static pre-rendered page for every work
- Each has unique `<title>`, `<meta description>`, JSON-LD VisualArtwork schema, OG tags
- Instant `<meta http-equiv="refresh">` redirect for real visitors; Googlebot reads full metadata
- `artwork.html` JS: unique description constructed per work + `VisualArtwork` JSON-LD injected on load

### Canvas accessibility
- constellation, chromatic, mosaic canvases: `tabindex="0"`, `role`, focus ring, Escape-to-blur
- wall.html: already fine (`<a>` tiles, no canvas)

### QA fixes (nav, mobile, a11y)
- All 22 pages: nav border `border-deep-ink`; mobile bottom nav `border-deep-ink`
- Skip-to-content on all pages via stamped nav
- `id="main"` on all `<main>` elements
- Mobile hero snap 1: full-bleed redesign matching desktop (dark veil, overlay text+CTAs, SCROLL indicator)
- archive.html mobile filter buttons: touch targets raised to 44px

---

## To do next session
- [ ] Test companion.html live at jfsn.com/companion.html (AI still working?)
- [ ] about.html exhibitions: add real show history when ready (~line 184)
- [ ] Submit `artworks/pages/` URLs to Google Search Console (or add to sitemap.xml)
- [ ] Consider adding artworks/pages/ links to sitemap.xml for faster Googlebot discovery

## Rebuild CSS (after adding new pages or tokens)
```
./node_modules/.bin/tailwindcss -i input.css -o site.min.css --minify
```

## Known issues
- companion.html: test live at jfsn.com/companion.html to confirm AI still works
- artwork.html canonical: JS-only static fallback still lacks `?id=`. Static pages in artworks/pages/ solve this for Googlebot.
- artworks/pages/ not yet in sitemap.xml — add when ready to accelerate indexing

## Site is live at
- jfsn.com  (primary — cPanel)
- jfsn-archive.netlify.app  (secondary — Netlify, has Companion function)

## Archive stats
- 1084 works cataloged, 0 errors
