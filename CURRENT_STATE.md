# Current State
**Updated:** 2026-05-29 (end of session 17)

## Last commit
TBD — run end-session.sh to commit

## What was done today
- mosaic.html: flagship photomosaic page built from scratch
  - All 1,084 mini works color-matched to Jeff's portrait (about-portrait.jpg)
  - Canvas rendering with ghost portrait overlay at 28% opacity
  - Portrait comparison thumbnail in header black space (upper right)
  - Hover tooltip: title + year per tile
  - Click any tile → artwork.html?id=artXXXX
  - Mouse wheel + pinch zoom, click-drag pan, +/− Reset buttons
  - Loads in batches of 80 with progress bar
- Mosaic added to primary nav (after Constellation) on all 16 pages
- Mosaic added to footer nav on all 16 pages

## Do next session (in order)
- [ ] Fix CSP in .htaccess — add gc.zgo.at + jfsn-archive.netlify.app to connect-src
- [ ] Fix "Get in touch" button → href="#inquire" (not mailto:)
- [ ] Netlify Forms email notification (2 min in dashboard)
- [ ] Add companion.html + changes.html missing footer nav items
- [ ] Sign up GoatCounter (after CSP fix)
- [ ] Test Companion on jfsn-archive.netlify.app
- [ ] Add description to archive search (one line in archive.html + search.js)
- [ ] Rotate Anthropic API key

## Known issues
- companion.html URL bug + CSP both block Companion on jfsn.com
- GoatCounter snippets live but CSP-blocked + account not created
- Netlify Forms not end-to-end tested
- artwork.html needs static title/description for SEO (big build)
- 209 works have no theme (19% of catalog)
- HSTS commented out in .htaccess

## Archive stats
- 1,084 works · 0 errors · 0 duplicate titles
- Themes: Targets 403 · Framed 230 · Torsos & Faces 172 · Gallery 149
  Studio 87 · Mr. SNOWmann 72 · Crosses 69 · Art School 52
  Collaboration 31 · Tracings 12
- 209 works with no theme

## Site locations
- jfsn.com — primary (cPanel FTP, DNS via friend)
- jfsn-archive.netlify.app — secondary (auto-deploys from GitHub)
- github.com/JFSNeumann/jfsn-archive — public repo

## Key files to know
- end-session.sh — run when done working
- WORKFLOW-CLIENT.md — how to onboard a new client
- CURRENT_STATE.md — this file
- .ftp.env — credentials (never commit)
