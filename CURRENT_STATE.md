# Current State
**Updated:** 2026-06-02 (PM session)

## Last commit
d7d08ea — Update api/v1, changes.json, feed.xml, sw.js

## To do next session
<!-- Edit this section before closing -->
- [ ] Run `bash end-session.sh` then `bash deploy.sh` after this session
- [ ] Test color fade effect in real browser after SW unregister (Application → Service Workers → Unregister, hard reload)

## What shipped this session
- **nav-active.js** — removed index.html→archive.html mapping; homepage no longer highlights Archive
- **Hamburger menus fixed** on 9 pages that had broken/decorative buttons: changes, chromatic, constellation, for-artists, guernica, privacy, series, wall, 404
- **stamp-nav.sh** now stamps both nav AND footer; _shared/footer.html is canonical footer source
- **All footers unified** — 21 Stitch pages now identical footer; decade pages identical; index.html intentionally unique
- **Mobile drawer added** to all 6 decade pages (1970s–2020s) with full nav + By Decade section
- **Decade page links** — Timeline decade labels → clickable links to decade pages; Archive sidebar → ↗ links next to each decade filter
- **Color fade at bottom of images** (mask-image + background-image) added to:
  - All 6 decade pages (1970s–2020s)
  - guernica.html, series.html (JS block added)
  - archive.html (renderCard template updated)
  - series-index.html (template + hover handlers)
  - collage/sculpture/photography/painting — already had it
- **Grayscale hover fix** — inline CSS rule added to all 6 decade pages so SW cache can't block it; rule also in site.min.css
- **sw.js CACHE_V** bumped to `jfsn-20260602-b`

## Known issues
- Service worker cache blocks new CSS/HTML until user unregisters SW in DevTools. Fix: deploy to HostGator (fresh files served without SW caching issues for new visitors).

## Site is live at
- jfsn.com  (primary — cPanel)
- jfsn-archive.netlify.app  (secondary — Netlify, has Companion function)

## Archive stats
- 1084 works cataloged, 0 errors
