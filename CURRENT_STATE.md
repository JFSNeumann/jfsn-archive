# Current State
**Updated:** 2026-05-28 (end of session 13)

## Last commit
13a2c98 — Title dedupe pass: ~300 works renamed + dedupe tool

## What was done today
- Drop-and-preview demo on for-artists.html (wow #3) ✅
- The Companion — text prompt → matched works (wow #4) ✅
- Hero mosaic fixed: 4 rows, no gap
- Full theme repass: Mr. SNOWmann 791→72, Gallery 211→149
- Art School (52) + Collaboration (31) restored from curate-session.json
- Title dedupe: 0 duplicate titles remaining
- dedupe.html tool + /rename-works server endpoint
- WORKFLOW-CLIENT.md + setup-client.sh for onboarding clients
- Two full audit/critique reports written

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
- github.com/JFSNeumann/jfsn-archive — public repo (29 commits)

## Key files to know
- end-session.sh — run when done working
- WORKFLOW-CLIENT.md — how to onboard a new client
- CURRENT_STATE.md — this file
- .ftp.env — credentials (never commit)
