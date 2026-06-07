# JFSN Session Handoff Prompt
**Generated:** 2026-06-06 (session 11)
**Copy everything below the line and paste it to start the next session.**

---

Read `/Documents/JFSN/CURRENT_STATE.md` and `/Documents/JFSN/IMPROVEMENTS.md` before doing anything. Then work through the ranked items below in order.

**Project:** JFSN Archive — personal archive site for Jeffrey F. S. Neumann, 1,084 works.
- Live: jfsn.com (HostGator/cPanel, primary) and jfsn-archive.netlify.app (Netlify — has Companion Netlify Function)
- Stack: vanilla HTML/CSS/JS, Tailwind compiled to `site.min.css` (22,530 bytes), service worker, no frameworks
- Design system: light/bone-white (`#fcf9f3`), deep-ink (`#0B0B0B`), orange accent (`#FF6600`), Playfair Display headings, Inter UI
- Nav: Archive · Series · Companion · About · Lost (5 items)
- Deploy workflow: `bash end-session.sh` (git commit + push + rsync + Backblaze B2 backup) → deploy via **JFSN.app** desktop app (NOT deploy.sh)
- Footer/nav: edit `_shared/top-nav.html` or `_shared/footer.html`, then `bash stamp-nav.sh`
- **CSS rebuild:** `npm run build:css` — run after adding any new Tailwind utility class, then commit `site.min.css`
- **SW cache:** bump `CACHE_V` in `sw.js` after any CSS rebuild or asset change. `build_catalog.py` auto-bumps on every run — check `git diff sw.js` before committing.

---

## Ranked items — work top to bottom

---

### 1. 🔴 Test Companion live on iPhone
| | |
|---|---|
| **File** | n/a — live test only |
| **Change** | Open https://jfsn-archive.netlify.app/companion.html on iPhone 15 Pro. Type prompt: "targets" or "something blue and melancholy". |
| **If it fails** | Netlify dashboard → Functions → companion logs. Function: `netlify/functions/companion.mjs`. Models: `claude-haiku-4-5` (fast), `claude-sonnet-4-6` (deep). |
| **Done when** | A work title + thumbnail returns on iPhone. |

---

### 2. 🟢 Print run of 12
Physical — 12 prints of 12 works, numbered. Not a code problem.

---

### 3. ✅ ~~Review homepage works (decade balance)~~ — done 2026-06-05
### 4. ✅ ~~Offsite cloud backup~~ — done 2026-06-06
### 5. ✅ ~~Server cleanup (stale deleted pages)~~ — done 2026-06-06
### 6. ✅ ~~API 500 error~~ — done 2026-06-06 (mod_security in api/.htaccess)
### 7. ✅ ~~catalog-lite.json oversized~~ — done 2026-06-06 (814KB → 667KB)
### 8. ✅ ~~Static artwork pages missing search~~ — done 2026-06-06 (all 1,084 regenerated)

---

## After every item

```bash
bash end-session.sh   # git commit + push + rsync + Backblaze B2 backup
```
Then deploy via JFSN.app. Cross off the item in `IMPROVEMENTS.md`. Update `CURRENT_STATE.md`.

---

## Things found and fixed — do NOT redo

- ✅ **Hero AVIF upload path** — hero crops go to `/artworks/` on HostGator (flat dir, .htaccess rewrites). NOT `/artworks/full/`.
- ✅ **GoatCounter CSP** — `gc.zgo.at` in `script-src`, `jfsn.goatcounter.com` in `connect-src` in root `.htaccess`
- ✅ **API 500 fixed** — mod_security directives removed from `api/.htaccess` template in `build_catalog.py`
- ✅ **catalog-lite.json trimmed** — only `file, title, year, work_type, themes, keywords, motifs, description` (147KB saved)
- ✅ **Recently-viewed** — `artwork.html` now writes `jfsn-recently-viewed` localStorage; search overlay reads it
- ✅ **Archive filter URL state** — `replaceState` on every filter change; `applyURLParams` restores all filters + sort on load/back-nav
- ✅ **artworks/pages/ regenerated with search** — all 1,084 static artwork pages have `search.js` + `nav-active.js`
- ✅ **ui.js banned patterns removed** — mask-image gradient and scroll-reveal IntersectionObserver on `.thumb` were re-introduced; removed session 11
- ✅ **Analytics (GoatCounter) unblocked** — previously blocked by CSP; fixed 2026-06-06
- ✅ **for-artists.html deleted** — service page removed; all references cleaned
- ✅ **timeline.html, mosaic.html, constellation.html deleted** — removed from nav, stamp-nav.sh, sw.js PRECACHE, verify_deploy.py, jeff.html
- ✅ **manifest.json colors** — theme_color/background_color updated from dark `#0b0b0b` to light `#fcf9f3`
- ✅ **Grayscale filter and transform:scale removed sitewide** — banned; confirmed by grep
- ✅ **Companion suggestion chips updated** — 8 archive-specific chips on companion.html
- ✅ **Chromatic River mobile tap flash fixed**
- ✅ **curate.html + dedupe.html noindex** — dev tools not crawlable

---

## Architecture quick-ref

| File | Purpose |
|------|---------|
| `_shared/top-nav.html` | Canonical nav (stamp-nav.sh). Nav: Archive · Series · Companion · About · Lost |
| `_shared/footer.html` | Canonical footer — analytics + SW registration |
| `_shared/ui.js` | Keyboard nav (← / → decade pages), vertical page label. No scroll-reveal. |
| `_shared/ui.css` | `.thumb__link` micro-interactions (cursor:zoom-in, orange outline-color, brightness) |
| `_shared/nav-active.js` | Sets orange active nav link by pathname (5 entries, all live pages) |
| `stamp-nav.sh` | Stamps nav + footer into Stitch pages. Decade pages NOT included — edit directly |
| `catalog.json` | All 1,084 works — generated by `artworks/build_catalog.py` |
| `catalog-lite.json` | Trimmed catalog for search.js + edge function (667KB) |
| `gen-artwork-pages.py` | Regenerates all 1,084 `artworks/pages/` static HTML pages |
| `sw.js` | Service worker — CACHE_V auto-bumped by build_catalog.py |
| `end-session.sh` | git commit + push + rsync + Backblaze B2 (does NOT deploy to HostGator) |

**Decade pages (1970s–2020s):** NOT in stamp-nav.sh — Material Design tokens. Edit directly.
**Dev tools (curate.html, dedupe.html, qa.html, jeff.html):** noindex, not in sitemap.
**artworks/pages/ regeneration:** `python3 gen-artwork-pages.py` — rebuilds all 1,084. Use `--limit 5` to test, `--id art0001` for one page.
**Hero AVIFs on server:** upload to `/artworks/artNNNN-hero.avif` (flat dir) — .htaccess rewrites from `artworks/full/` on the fly.
**api/.htaccess:** auto-generated by `build_catalog.py` — edit the template in that script, not the file directly.
