# Current State
**Updated:** 2026-06-04 (session — deleted pages, grayscale audit, docs update, static page regen)

## Last commit
3769903 — Auto: bump CACHE_V, update changelog + feed + API manifests

## To do next session
- [ ] Test Companion live on iPhone (https://jfsn-archive.netlify.app/companion.html)
- [ ] Update Companion suggestion chips to archive-specific vocabulary

## What was done this session
- **for-artists.html deleted** — all internal references cleaned
- **timeline.html, mosaic.html, constellation.html deleted** — removed from nav, sitemap, docs
- **Grayscale, transform:scale, mask-image, transition on img removed sitewide** — verified clean by grep across all HTML outside artworks/. companion.html and curate.html also patched.
- **artworks/pages/ regenerated** — all 1,084 static pages rebuilt from new `gen-artwork-pages.py`. Current nav (4 items), full color images, full footer, mobile nav.
- **WORKFLOW-CLIENT.md deleted** — client onboarding workflow, fully obsolete
- **CLAUDE.md, WORKFLOW.md, SESSION_PROMPT.md updated** — reflect current 18-page site
- **build_catalog.py sitemap** — still references for-artists.html, timeline.html, constellation.html (needs cleanup next session)

## Known issues
- **sw.js CACHE_V**: build_catalog.py auto-bumps on every run — fixed to only write if newer. Still check `git diff sw.js` before committing after any script run.
- **index.html has no FOOTER:START marker** — custom homepage footer, not stamped. Edit directly if footer changes.
- **Decade pages not in stamp-nav.sh** — edit 1970s–2020s.html directly for any nav/footer changes.
- **build_catalog.py sitemap entries** — still lists for-artists.html, timeline.html, constellation.html. Remove those entries next session.

## Site is live at
- jfsn.com  (primary — cPanel)
- jfsn-archive.netlify.app  (secondary — Netlify, has Companion function)

## Archive stats
- 1084 works cataloged, 0 errors
