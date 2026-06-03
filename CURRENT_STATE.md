# Current State
**Updated:** 2026-06-02 (evening)

## Last commit
7c714a9 — Nav/footer audit + color fade on all image grids
*(uncommitted: SW hero-preload fix + Companion fixes + netlify.toml fix — run end-session.sh)*

## To do next session
- [ ] **Deploy** — run `bash end-session.sh && bash deploy.sh` if not done
- [ ] **Test Companion live** — open jfsn.com/companion.html on iPhone, confirm a work comes back
- [ ] **Test for-artists form** — `jfsn-archive.netlify.app/for-artists.html`, submit, confirm redirect
- [ ] **Submit sitemap to Google Search Console** — 2,190 URLs ready

## Cleanup pending (safe to do any time)
- `old-site/` local — 197MB, `rm -rf /Users/jeffreyneumann/Documents/JFSN/old-site/`
- `old-site/` on server — delete via FileZilla (contains previous-tenant HTML, not your work)
- `site.css` — can go once `api.html` is migrated to light system (only remaining user)
- Internal tools on server (`curate.html`, `dedupe.html`) — harmless but publicly reachable; consider excluding from `deploy.sh`

## Known issues
- ~~Service worker black screen on index.html first load~~ — **FIXED 2026-06-02**: hero AVIF added to SW precache; dark fallback bg added to hero section; CACHE_V bumped. Deploy required to take effect.
- **Companion — WORKING** ✅ confirmed live 2026-06-02. Returns real artwork matches.
- **for-artists form** — Netlify now up to date. Submit a test inquiry from the live site to confirm email notifications are enabled in Netlify dashboard (Forms → Notifications).

## Site is live at
- jfsn.com  (primary — cPanel)
- jfsn-archive.netlify.app  (secondary — Netlify, has Companion function)

## Archive stats
- 1,084 works cataloged, 0 errors
