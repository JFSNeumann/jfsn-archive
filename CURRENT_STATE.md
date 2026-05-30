# Current State
**Updated:** 2026-05-30 (session 19)

## Last commit
2978fb9 — Session 18: update CURRENT_STATE + rebuild artifacts

## To do next session
- [ ] Copy catalog-lite.json from outputs → JFSN folder, then commit
- [ ] Clean up backup files: catalog-lite.json.bak, .bak2, .bak3, .bak4 (keep only most recent)
- [ ] Delete fix_catalog.py from JFSN root

## Catalog audit — completed 2026-05-30
55 metadata fixes across 1,084 works:
- 7 misapplied Crosses/Targets themes removed
- 10 Gallery/Studio theme confusions corrected
- 11 Guernica series tags removed from wrong works
- 27 unthemed Guernica collages given "Targets" theme
catalog-lite.json updated on disk and synced to Claude project knowledge.

## Remaining audit work
- None. All 1,084 works are themed. ✅

## To do (outside code)
- [x] GoatCounter: account created at jfsn.goatcounter.com — live ✅
- [ ] GitHub Sponsors: Stripe Connect + identity verification pending — finish at github.com/sponsors/accounts
- [ ] README screenshot: swap og-card.jpg placeholder with a real archive grid screenshot
- [ ] Netlify Forms: email notification — configure after first inquiry submission arrives (Forms → archive-inquiry → Form notifications)

## Known issues
- companion.html: FIXED session 18 — test live at jfsn.com/companion.html to confirm
- artwork.html SEO: FIXED — edge function injects per-work meta tags server-side
- about.html exhibitions: LIVE — update table rows with real show history when ready (~line 375)

## Site is live at
- jfsn.com  (primary — cPanel)
- jfsn-archive.netlify.app  (secondary — Netlify, has Companion function)

## Archive stats
- 1084 works cataloged, all themed ✅
- Theme distribution: Targets 562, Framed 230, Torsos & Faces 201, Gallery 153, Studio 104, Mr. Snowmann 72, Crosses 69, Art School 52, Collaboration 31, Tracings 12
