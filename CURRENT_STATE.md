# Current State
**Updated:** 2026-06-04 (sessions 9–11: artwork-first audit, dead-page purge, static page regen)

## Last commit
39d0c83 — Session: artwork-first audit — remove grayscale/effects, delete dead pages, regen static pages

## What was done in the last three sessions

### Interface / CSS strip (sessions 9–10)
- **Grayscale removed sitewide** — `filter: grayscale`, mask-image gradient, `.grayscale-img` class gone from all HTML, CSS, and JS. Verified clean by grep across all files including artworks/pages/.
- **Scale on hover removed** — `transform: scale(1.02)`, `scale(1.05)` gone from all pages.
- **Transition on img elements removed** — no `transition:` on artwork images anywhere.
- **`_shared/ui.css` stripped** — 3,704 → 746 bytes. All animations, border-draw, scroll-reveal, opacity/transform choreography removed.
- **`index.html` stripped** — 797 → 228 lines. Dust motte, Companion section, stats snap, hero H1/label/gradient/CTAs, scroll reveals, parallax, 5-column footer → 1 line, nav 5 → 2 links.
- **`series.html` stripped** — 919 → 591 lines. Series-room entrance overlay, mask JS, sibling dim, density toggle, progress bar, scroll-to-top, hover preload, more-series section all removed.
- **`artwork.html` stripped** — 594 → 378 lines. Grayscale/mask/scale on image, companion button, Buy a Print + FAA_URLS table, related works section, AI description, hover hint, opacity fade-in removed.

### Dead pages deleted
- `for-artists.html` — commercial service page. 1,147 references removed across 1,119 files.
- `timeline.html` — removed from nav, sitemap, CLAUDE.md, all internal links.
- `mosaic.html` — same.
- `constellation.html` — same.
- `old-site/` directory — deleted entirely.
- `WORKFLOW-CLIENT.md` — obsolete client onboarding doc, deleted.

### Static pages regenerated
- **`artworks/pages/`** — all 1,084 static artwork pages rebuilt from new `gen-artwork-pages.py`. Current nav (4 links: Archive / Series / Companion / About), full color images, no grayscale, no Buy a Print, no related works, correct footer, mobile nav.
- **`gen-artwork-pages.py`** — rewritten and committed. Source of truth for static page generation.

### Fonts consolidated
- All Google Fonts requests merged into a single `<link>` per page: Playfair Display + Inter + Material Symbols in one request. Two-link pattern eliminated.

### Docs updated
- `SESSION_PROMPT.md` — reflects current 18-page site (was referencing deleted pages).
- `CLAUDE.md` — updated.
- `sitemap.xml` — cleaned. No references to for-artists, timeline, mosaic, constellation.

---

## Current site shape

**32 public pages** at root:
- 6 decade pages (1970s–2020s)
- Core: index, archive, artwork, series, series-index, about, companion
- Medium: collage, sculpture, photography, painting
- Theme series: guernica, targets, framed, torsos-faces, mr-snowmann, crosses, collaboration
- Special: lost, chromatic, wall, gallery-images, changes, api
- Utility: 404, privacy

**1,084 works** cataloged, 0 errors.

---

## Known issues (standing)
- **sw.js CACHE_V** — `build_catalog.py` auto-bumps on every run. Still check `git diff sw.js` before committing after any script run.
- **index.html has no FOOTER:START marker** — custom homepage footer, not stamped. Edit directly if footer changes.
- **Decade pages not in stamp-nav.sh** — edit 1970s–2020s.html directly for any nav/footer changes.

---

## To do next session
- [ ] Test Companion live on iPhone (https://jfsn-archive.netlify.app/companion.html)
- [ ] Update Companion suggestion chips to archive-specific vocabulary

---

## Site is live at
- jfsn.com (primary — cPanel/HostGator)
- jfsn-archive.netlify.app (secondary — Netlify, Companion function only)
