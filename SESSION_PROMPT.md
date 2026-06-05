# JFSN Session Handoff Prompt
**Generated:** 2026-06-05
**Copy everything below the line and paste it to start the next session.**

---

Read `/Documents/JFSN/CURRENT_STATE.md` and `/Documents/JFSN/IMPROVEMENTS.md` before doing anything. Then work through the ranked items below in order.

**Project:** JFSN Archive — personal archive site for Jeffrey F. S. Neumann, 1,084 works.
- Live: jfsn.com (HostGator/cPanel, primary) and jfsn-archive.netlify.app (Netlify — has Companion Netlify Function)
- Stack: vanilla HTML/CSS/JS, Tailwind compiled to `site.min.css` (31KB), service worker, no frameworks
- Design system: light/bone-white (`#fcf9f3`), deep-ink (`#0B0B0B`), orange accent (`#FF6600`), Playfair Display headings, Inter UI
- Nav: Archive · Series · Companion · About (4 items)
- Deploy workflow: `bash end-session.sh` (git commit + push + rsync backup) → deploy via desktop app (JFSN.app)
- Footer/nav: edit `_shared/top-nav.html` or `_shared/footer.html`, then `bash stamp-nav.sh`
- **CSS rebuild:** `npm run build:css` — run this after adding any new Tailwind utility class, then commit `site.min.css`
- **Known sw.js behavior:** `build_catalog.py` auto-bumps CACHE_V — fixed to only bump if newer. After any script run, verify `git diff sw.js` shows no unexpected rollback.

---

## Ranked items — work top to bottom

---

### 1. 🔴 Test Companion live on iPhone
| | |
|---|---|
| **File** | n/a — live test only |
| **Change** | Open https://jfsn-archive.netlify.app/companion.html on iPhone 15 Pro. Type prompt: “targets” or “something blue and melancholy”. |
| **If it fails** | Netlify dashboard → Functions → companion logs. Function: `netlify/functions/companion.mjs`. Models: `claude-haiku-4-5` (fast), `claude-sonnet-4-6` (deep). Deep mode uses `thinking: {type: 'adaptive'}`. |
| **Done when** | A work title + thumbnail returns on iPhone. |

---

### 2. 🟡 Review homepage works (decade balance)
| | |
|---|---|
| **File** | `featured.txt` — one artwork filename per line |
| **Change** | Edit `featured.txt` so the 30 works span at least 4 decades. Currently 22/30 are from 2020. Keep the strongest works; vary era, medium (collage/sculpture/photography), palette. |
| **Rebuild** | `python3 artworks/build_catalog.py` → regenerates `catalog-home.json` + bumps `sw.js CACHE_V` |
| **Done when** | Homepage shows works from 1970s, 1980s–90s, 2000s, and 2020s. Jeff approves the selection. |

---

### 3. 🟢 Offsite cloud backup
| | |
|---|---|
| **File** | New: `cloud-backup.sh` (or append to `backup.sh`) |
| **Change** | Install rclone (`brew install rclone`), configure B2 bucket (`rclone config`), then create script: `rclone sync /Documents/JFSN/ b2:jfsn-archive/ --exclude "node_modules/**"` |
| **Cost** | ~$0.50/month for ~800MB |
| **Done when** | `rclone` configured, first sync completes, script runs from `end-session.sh`. |

---

### 4. 🟢 Single-command deploy
| | |
|---|---|
| **File** | `end-session.sh` |
| **Change** | Append `bash "$(dirname "$0")/deploy.sh"` at the end (after git push + backup). FTP takes 2–5 min — acceptable blocking. |
| **Done when** | `bash end-session.sh` handles git + backup + FTP in one run. |

---

## After every item

```bash
bash end-session.sh   # git commit + push + rsync backup
```
Then deploy via the JFSN desktop app.

Cross off the item in `IMPROVEMENTS.md`. Update `CURRENT_STATE.md`.

---

## Things found and fixed — do NOT redo

- ✅ **Analytics (Goatcounter) missing from pages** — now in `_shared/footer.html`; all public pages have exactly 1 snippet
- ✅ **stamp-nav.sh TARGETS expanded** — now includes all static theme pages + api.html
- ✅ **site.min.css added to SW PRECACHE** — was missing; now offline-first load works
- ✅ **build_catalog.py sw.js rollback bug fixed** — now only bumps CACHE_V if new timestamp is strictly newer
- ✅ **curate.html + dedupe.html noindex added** — dev tools were crawlable; now protected
- ✅ **for-artists.html deleted** — service page removed; all 1,147 internal references cleaned
- ✅ **timeline.html, mosaic.html, constellation.html deleted** — removed from nav, sitemap, docs
- ✅ **Grayscale filter and transform:scale removed sitewide** — no images anywhere on the site have filter:grayscale, transition on img, or scale hover. Confirmed by grep across all HTML outside artworks/.
- ✅ **artworks/pages/ regenerated** — all 1,084 static artwork pages rebuilt from `gen-artwork-pages.py`. New pages: current 4-item nav, full color images, full footer, mobile nav, complete metadata (description, palette, motifs, composition).
- ✅ **WORKFLOW-CLIENT.md deleted** — entire client archive onboarding workflow; obsolete since service offering ended
- ✅ **CLAUDE.md / WORKFLOW.md / SESSION_PROMPT.md updated** — reflect current 18-page site, correct nav, no deleted-page references
- ✅ **Companion suggestion chips updated** — 8 archive-specific chips live on companion.html; Mr. SNOWmann added (2026-06-05)
- ✅ **Chromatic River mobile tap flash fixed** — `-webkit-tap-highlight-color: transparent` + `touch-action: manipulation` on canvas; browser full-canvas flash suppressed (2026-06-05)
- ✅ **Preload first-row thumbnails** — first 4 imgs eager + fetchpriority="high" + `<link rel="preload">` on collage, photography, sculpture, painting (already shipped prior session)
- ✅ **Archive lazy-load audit** — `renderCard(w, idx)` passes absolute index; first 8 cards eager on archive.html (already shipped prior session)

---

## Architecture quick-ref

| File | Purpose |
|------|---------|
| `_shared/top-nav.html` | Canonical nav (stamp-nav.sh). Nav: Archive · Series · Companion · About |
| `_shared/footer.html` | Canonical footer — analytics + SW registration. EXPLORE: Complete Archive · Series Index · Lost Works |
| `_shared/ui.js` | Keyboard nav (← / → decade pages), vertical page label, hero zoom |
| `_shared/ui.css` | Structural: `.thumb-frame` positioning, `.page-label-vert` |
| `stamp-nav.sh` | Stamps nav + footer into Stitch pages. Decade pages NOT included — edit directly |
| `catalog.json` | All 1,084 works — generated by `artworks/build_catalog.py` |
| `gen-artwork-pages.py` | Regenerates all 1,084 `artworks/pages/` static HTML pages |
| `sw.js` | Service worker — CACHE_V auto-bumped by build_catalog.py (safely) |
| `deploy.sh` | FTP mirror to HostGator |
| `end-session.sh` | git commit + push + rsync backup (does NOT deploy to HostGator) |

**Decade pages (1970s–2020s):** NOT in stamp-nav.sh — use Material Design tokens. Edit directly.
**Dev tools (curate.html, dedupe.html, qa.html, jeff.html):** noindex, not in sitemap. Keep that way.
**artworks/pages/ regeneration:** `python3 gen-artwork-pages.py` — rebuilds all 1,084. Use `--limit 5` to test, `--id art0001` for a single page.
