# Current State
**Updated:** 2026-06-03 21:47

## Last commit
9d2ee5f — Regenerate API JSON, feed.xml, changes.json; bump SW CACHE_V post-session

## Last deployed
- HostGator: ✅ 2026-06-03 (session 3 deep audit)
- Netlify: 2026-06-02

## To do next session
Paste SESSION_PROMPT.md into a new session. Start with items 1–3 (iPhone tests), then 4–6 (code).

## Known issues
- **sw.js CACHE_V**: build_catalog.py auto-bumps on every run — fixed to only write if newer. Still check `git diff sw.js` before committing after any script run.
- **index.html has no FOOTER:START marker** — custom homepage footer, not stamped. Edit directly if footer changes.
- **Decade pages not in stamp-nav.sh** — edit 1970s–2020s.html directly for any nav/footer changes.

## Site is live at
- jfsn.com  (primary — cPanel)
- jfsn-archive.netlify.app  (secondary — Netlify, has Companion function)

## Archive stats
- 1084 works cataloged, 0 errors
