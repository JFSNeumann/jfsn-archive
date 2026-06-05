# Current State
**Updated:** 2026-06-05 (session — UI cleanup, orange audit, featured works, Companion mobile hardening)

## Last commit
9d2c65b — Update CURRENT_STATE.md; bump auto-generated artifacts

## What was done this session

### Scroll-reveal removal
- **lost.html** — removed `.reveal-para` CSS + JS observer, `.btn-transition` on CTA links, `reveal-para` class from all 9 elements
- **chromatic.html** — removed `.reveal-header` CSS + JS observer, `reveal-header` class from page header section

### Orange accent audit + cleanup (sitewide)
- Removed all decorative orange (content labels, section headers, pull-quote borders, horizontal rules, text-selection highlight, "Named Series" badge)
- Orange now appears only as interaction signal: hover states, active nav, focus rings, filter buttons, loading bar
- **about.html** — removed "Artist Biography" label, "Chronological" badge, exhibition year orange, "Contact/Archive/Now" section label orange; fixed OG description copy; portrait `loading="lazy"` → `loading="eager" fetchpriority="high"`; removed orphaned `padding-left` transition, `data-delay` attributes, stale GoatCounter comment
- **artwork.html** — byline `text-international-orange` → `text-secondary`
- **series-index.html** — removed `selection:bg-international-orange`, pull-quote border, "Archival Note" heading orange, horizontal rule orange, "Named Series" badge orange

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

## To do next session
- [ ] Test Companion live on iPhone (https://jfsn-archive.netlify.app/companion.html) — mobile hardening untested on device
- [ ] Update Companion suggestion chips (SESSION_PROMPT item 2 — already has copy ready)
- [ ] Decade page keyboard nav badge (SESSION_PROMPT item 3)
- [ ] Chromatic River mobile tap flash (SESSION_PROMPT item 4)
- [ ] build_catalog.py sitemap still references deleted pages (for-artists.html, timeline.html, constellation.html) — quick cleanup

## Known issues (standing)
- **sw.js CACHE_V** — `build_catalog.py` auto-bumps on every run. Still check `git diff sw.js` before committing after any script run.
- **index.html has no FOOTER:START marker** — custom homepage footer, not stamped. Edit directly if footer changes.
- **Decade pages not in stamp-nav.sh** — edit 1970s–2020s.html directly for any nav/footer changes.
- **about-portrait.jpg** — only JPEG image in the asset pipeline; all artworks are AVIF. Low priority.

---

## Site is live at
- jfsn.com  (primary — cPanel)
- jfsn-archive.netlify.app  (secondary — Netlify, has Companion function)

## Archive stats
- 1084 works cataloged, 0 errors
