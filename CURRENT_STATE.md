# Current State
**Updated:** 2026-06-02

## Site status — clean ✅

Everything from this session is live on jfsn.com.

---

## What shipped this session

| | What | Impact |
|---|---|---|
| ✅ | Tailwind CDN (1.5MB) → `site.min.css` (31KB) | ~300ms faster load on every page |
| ✅ | Search button wired on all pages | Was dead since the May redesign |
| ✅ | 1,084 static artwork pages (`artworks/pages/`) | Googlebot reads every work without JS |
| ✅ | sitemap.xml: 1,106 → 2,190 URLs | All 1,084 artwork pages discoverable |
| ✅ | Companion model: `claude-sonnet-4-6-20250514` | Fixed missing date suffix |
| ✅ | CSP: stale cdn.tailwindcss.com removed | Tighter security |
| ✅ | Canvas a11y: constellation, chromatic, mosaic | tabindex, role, focus ring, Escape |
| ✅ | Mobile hero snap 1 redesign | Full-bleed, dark veil, CTAs, SCROLL indicator |
| ✅ | All nav/mobile/desktop QA passes | Borders, skip links, touch targets |

---

## One manual step — do this now
**Google Search Console → Sitemaps → submit `sitemap.xml`**
jfsn.com already verified. Submitting tells Google to index the 2,190 URLs including all 1,084 artwork pages.

---

## To do next session
- [ ] Ingest new work when photos are ready (`bash add-works.sh` → catalog → deploy)
- [ ] about.html: add real exhibition details when ready (~line 184)
- [ ] Test companion.html live on iPhone: open jfsn.com/companion.html, type something, confirm a work comes back

## Rebuild CSS (if you add new pages or tokens)
```
cd /Users/jeffreyneumann/Documents/JFSN
./node_modules/.bin/tailwindcss -i input.css -o site.min.css --minify
```
Then commit + deploy.

## Site is live at
- jfsn.com (primary — cPanel/HostGator)
- jfsn-archive.netlify.app (secondary — has Companion edge function)

## Archive stats
- 1,084 works cataloged · 0 errors · 2,190 sitemap URLs
