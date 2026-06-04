# Current State
**Updated:** 2026-06-03 (session 3)

## Last commit
e93fad8 — Regenerate API JSON and feed.xml post-session

## Last deployed
- HostGator: ✅ 2026-06-03 (session 3) — about.html keywords + footer fix live
- Netlify: 2026-06-02

## To do next session
See IMPROVEMENTS.md open items — ranked prompt exists for handoff.

## Known issues
- **sw.js regeneration bug** — something (likely build_catalog.py or a script) keeps writing an older CACHE_V timestamp to sw.js after sessions. Caught and discarded twice (sessions 2 and 3). Investigate source; do not commit the rollback.

## Site is live at
- jfsn.com  (primary — cPanel)
- jfsn-archive.netlify.app  (secondary — Netlify, has Companion function)

## Archive stats
- 1084 works cataloged, 0 errors
