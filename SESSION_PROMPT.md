# JFSN Session Handoff Prompt
**Generated:** 2026-06-05 (session — companion chips updated, chromatic tap flash fixed, stale items pruned)
**Copy everything below the line and paste it to start the next session.**

---

Read `/Documents/JFSN/CURRENT_STATE.md` and `/Documents/JFSN/IMPROVEMENTS.md` before doing anything. Then work through the ranked items below in order.

**Project:** JFSN Archive — personal archive site for Jeffrey F. S. Neumann, 1,084 works.
- Live: jfsn.com (HostGator/cPanel, primary) and jfsn-archive.netlify.app (Netlify — has Companion Netlify Function)
- Stack: vanilla HTML/CSS/JS, Tailwind compiled to `site.min.css` (31KB), service worker, no frameworks
- Design system: light/bone-white (`#fcf9f3`), deep-ink (`#0B0B0B`), orange accent (`#FF6600`), Playfair Display headings, Inter UI
- Nav: Archive · Series · Companion · About (4 items)
- Deploy workflow: `bash end-session.sh` (git commit + push + rsync backup) → `bash deploy.sh` (FTP to HostGator, separate step)
- Footer/nav: edit `_shared/top-nav.html` or `_shared/footer.html`, then `bash stamp-nav.sh`
- **Known sw.js behavior:** `build_catalog.py` auto-bumps CACHE_V — fixed to only bump if newer. After any script run, verify `git diff sw.js` shows no unexpected rollback.

---

## Ranked items — work top to bottom

---

### 1. 🔴 Test Companion live on iPhone
**What:** Open https://jfsn-archive.netlify.app/companion.html on iPhone 15 Pro (must use Netlify URL — Companion function doesn't exist on jfsn.com). Type a prompt: "targets" or "something blue and melancholy". Confirm a work title + thumbnail comes back.
**Why:** Untested since May 2026 redesign. Backend was fixed (model IDs, thinking API, netlify.toml) but UI flow never verified on device.
**If it fails:** Check Netlify dashboard → Functions → companion logs for errors. The function is at `netlify/functions/companion.mjs` (regular Netlify function, NOT edge function). Model names in code: `claude-haiku-4-5` (fast) and `claude-sonnet-4-6` (deep). Deep mode uses `thinking: {type: 'adaptive'}`.
**Done when:** Response returns with a work suggestion on iPhone.

---

### 2. 🟡 Review featured.txt / homepage works
**Problem:** `catalog-home.json` (30 works shown on homepage) is heavily weighted toward 2020 works — 22 of 30 are from 2020. The homepage should feel like a survey of 50 years, not a 2020 snapshot.
**File:** `featured.txt` — one artwork filename per line. Edit this, then:
```bash
python3 artworks/build_catalog.py   # regenerates catalog-home.json + bumps sw.js CACHE_V
bash end-session.sh
bash deploy.sh
```
**Goal:** Representation from at least 4 decades. Keep the strongest works — variety in era, medium (collage/sculpture/photography), and palette.
**Done when:** Homepage shows works from 1970s, 1980s/90s, 2000s, and 2020s. Jeff approves the selection.

---

### 3. 🟢 Offsite cloud backup
**Problem:** All three archive copies (MacBook, Time Machine, JEFFS-4TB) are in the same room — single point of physical failure.
**Recommended:** Backblaze B2 via rclone.
- Install: `brew install rclone` then `rclone config` to add B2 bucket
- Sync command: `rclone sync /Documents/JFSN/ b2:jfsn-archive/ --exclude "node_modules/**"`
- Cost: ~$0.50/month for ~800MB
- Add sync to `backup.sh` or create a separate `cloud-backup.sh` triggered from `end-session.sh`
**Minimal version (just the irreplaceable data):** Sync only `catalog.json`, `chromatic.json`, `catalog-home.json`, `featured.txt`, `artworks/*.json` — these are the files that can't be regenerated from scratch.
**Done when:** rclone configured, first sync completes, added to a script.

---

### 4. 🟢 Automated deploy after commit
**Current:** Two manual steps: `bash end-session.sh` then `bash deploy.sh`.
**Option A (simplest):** Append `bash "$(dirname "$0")/deploy.sh"` to end of `end-session.sh`, after the git push. FTP takes 2–5 min so it'll block — acceptable if sessions end that way.
**Option B (non-blocking):** Launch deploy in background: `bash deploy.sh &` — output goes to a log file.
**Option C (Netlify only):** Netlify already auto-deploys on GitHub push. HostGator requires FTP so can't be auto.
**Recommended:** Option A for simplicity.
**Done when:** A single `bash end-session.sh` handles git + FTP deploy.

---

### 5. 🟢 Archive sort by "recently added"
**File:** `archive.html` — find the sort logic (a JS sort function operating on the works array).
**Add:** A sort option `id_desc` that sorts by numeric ID descending (art1084, art1083… = most recently ingested first). Extract the number from the file/id string: `parseInt(a.file.replace(/\D/g,''))`.
**UI:** Add "Recently Added" option to the sort dropdown.
**Done when:** A "Recently Added" sort option appears and clicking it shows newest works first.

---

## After every item

```bash
bash end-session.sh   # git commit + push + rsync backup
bash deploy.sh        # FTP to HostGator
```

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
