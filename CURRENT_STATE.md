# Current State
**Updated:** 2026-06-05

## Last commit
662f7cd — UI cleanup: orange audit, featured works, Companion mobile hardening

## What was done this session (2026-06-05)

### Homepage + archive heading cleanup (Stitch review items)
- **index.html** — removed "Featured Works" h2; reduced section top padding from py-24 to pt-16 pb-24 to compensate
- **archive.html** — "THE ARCHIVE" h1 demoted from font-display-lg (Playfair Display, large) to font-label-caps (Inter ALL CAPS) — same visual language as the filter labels, far less weight

### Scroll-reveal removal
- **lost.html** — removed `.reveal-para` CSS + JS observer, `.btn-transition` on CTA links, `reveal-para` class from all 9 elements
- **chromatic.html** — removed `.reveal-header` CSS + JS observer, `reveal-header` class from page header section

### Orange accent audit + cleanup (sitewide)
- Removed all decorative orange (content labels, section headers, pull-quote borders, horizontal rules, text-selection highlight, "Named Series" badge)
- Orange now appears only as interaction signal: hover states, active nav, focus rings, filter buttons, loading bar
- **about.html** — removed "Artist Biography" label, "Chronological" badge, exhibition year orange, "Contact/Archive/Now" section label orange; fixed OG description copy; portrait `loading="lazy"` → `loading="eager" fetchpriority="high"`; removed orphaned `padding-left` transition, `data-delay` attributes, stale GoatCounter comment
- **artwork.html** — byline `text-international-orange` → `text-secondary`
- **series-index.html** — removed `selection:bg-international-orange`, pull-quote border, "Archival Note" heading orange, horizontal rule orange, "Named Series" badge orange
- **index.html** — removed orange medium labels (PHOTOGRAPH, COLLAGE) from all three mobile folio cards
- **archive.html** — series label on work cards: `text-on-tertiary-container` → `text-secondary`
- **404.html** — removed "STATUS // UNVERIFIED" chip and flicker JS

### Decade keyboard nav badge removed
- **`_shared/ui.js`** — removed the `#kbd-hint` badge block (DOMContentLoaded listener, div injection, 4s timeout, keydown hide). Keyboard ← / → navigation itself unchanged. Affects all six decade pages (1970s–2020s).

### Featured works updated
- Homepage grid changed from art0483/art1009/art1010 (two 2020 collages + one 2020 sculpture) to:
  - **art0380** — Devo at WHK Auditorium, 1977, photograph
  - **art0002** — Reliquary, 1990, collage
  - **art0026** — Yellow Figure on Black Wall, 2010, photograph
- Updated in both desktop `FEATURED_IDS` and all three mobile folio snap sections

### Companion mobile hardening (companion.html)
- **AbortController** — 28-second fetch timeout; AbortError gives friendly message
- **Touch targets** — `.c-example` chips, `.c-submit`, `.c-deep-label`, `.c-again-btn` all raised to `min-height: 44px`
- **iOS keyboard** — `scrollIntoView` on textarea focus; `padding-bottom: calc(5rem + env(safe-area-inset-bottom, 0px))` on main
- **Catalog race condition** — catalog fetch stored as `catalogLoading` promise; submit handler awaits it before `renderResults`, fixing ?q= auto-submit showing raw IDs
- **Error messages** — 504/524 → user-friendly copy; 5xx → generic retry message; AbortError → timeout message
- **Textarea** — added `autocorrect="off" autocapitalize="off" spellcheck="false" autocomplete="off" inputmode="text"`
- **Card images** — `onerror="this.style.opacity='0'"` on result thumbnails

### Companion suggestion chips updated
- **companion.html** — `Mr. SNOWmann` added as second chip; set is now 8 archive-specific prompts matching SESSION_PROMPT spec

### Chromatic River mobile tap flash fixed
- **chromatic.html** — added `-webkit-tap-highlight-color: transparent` and `touch-action: manipulation` to `#river-canvas`. Cause: browser default tap highlight was flashing the entire canvas on touch before the click event fired. Fix suppresses that without adding transitions or animations.

### Mobile bottom nav removed (sitewide)
- Removed fixed-bottom `<nav>` element from all 31 HTML files
- ~540 lines deleted across: lost.html, companion.html, photography.html, index.html, chromatic.html, about.html, series.html, guernica.html, changes.html, 1980s–2020s.html, artwork.html, crosses.html, 404.html, painting.html, collaboration.html, framed.html, sculpture.html, targets.html, gallery-images.html, wall.html, mr-snowmann.html, series-index.html, torsos-faces.html, archive.html, privacy.html, collage.html
- Dead scroll-listener IIFE in archive.html also removed (lines 468–479)
- Verified: 0 instances of `fixed bottom-0` remain sitewide

### SESSION_PROMPT pruned
- Removed stale items: decade keyboard nav badge (was removed not built), preload first-row thumbnails (already shipped), archive lazy-load audit (already shipped)
- Items 2–9 renumbered to 1–5; completed items moved to "do NOT redo" list

### Sitemap confirmed clean
- `build_catalog.py` `entries` list confirmed clean — deleted pages (for-artists.html, timeline.html, mosaic.html, constellation.html) were never in it
- Sitemap regenerated: 1,103 URLs, 0 references to deleted pages ✅

## To do next session
- [ ] Test Companion live on iPhone (https://jfsn-archive.netlify.app/companion.html) — mobile hardening untested on device
- [ ] Review featured.txt / catalog-home.json — 30 homepage works still weighted toward 2020 (SESSION_PROMPT item 2)
- [ ] Offsite cloud backup via Backblaze B2/rclone (SESSION_PROMPT item 3)
- [ ] Archive "Recently Added" sort option (SESSION_PROMPT item 5)

## Known issues (standing)
- **sw.js CACHE_V** — `build_catalog.py` auto-bumps on every run. Check `git diff sw.js` before committing after any script run.
- **index.html has no FOOTER:START marker** — custom homepage footer, not stamped. Edit directly if footer changes.
- **Decade pages not in stamp-nav.sh** — edit 1970s–2020s.html directly for any nav/footer changes.
- **about-portrait.jpg** — only JPEG in the asset pipeline; all artworks are AVIF. Low priority.

---

## Site is live at
- jfsn.com  (primary — cPanel)
- jfsn-archive.netlify.app  (secondary — Netlify, has Companion function)

## Archive stats
- 1084 works cataloged, 0 errors
