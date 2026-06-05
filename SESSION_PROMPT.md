# JFSN Session Handoff Prompt
**Generated:** 2026-06-04 (session cleanup — deleted pages, grayscale audit, static page regen)
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

### 2. 🟡 Update Companion suggestion chips
**File:** `companion.html` lines 343–350 — 8 `.c-example` button elements.
**Current chips are decent but generic.** Update to reflect the actual archive vocabulary:
```html
<button class="c-example" type="button">the Guernica series</button>
<button class="c-example" type="button">Mr. SNOWmann</button>
<button class="c-example" type="button">targets and warplanes</button>
<button class="c-example" type="button">something from the 1970s</button>
<button class="c-example" type="button">crosses and ritual</button>
<button class="c-example" type="button">found objects and memory</button>
<button class="c-example" type="button">midwest winter</button>
<button class="c-example" type="button">lost and undocumented</button>
```
After editing: run `bash stamp-nav.sh` to keep nav/footer in sync.
**Done when:** Chips show archive-specific prompts on companion.html.

---

### 3. 🟡 Decade page keyboard nav badge
**Why it matters:** The ← / → keyboard shortcut works (implemented in `_shared/ui.js` via `data-prev-decade` / `data-next-decade` attributes) but nobody knows it's there.
**What to build:** A floating hint badge that shows "← 1970s | 1990s →" (text pulled from the existing anchors). Badge appears on page load, fades out after 4 seconds OR on first ArrowLeft/ArrowRight keypress.
**Where to add it:** `_shared/ui.js` — inject on DOMContentLoaded, only if both prev/next anchors exist (so it only appears on decade pages). Example:
```js
document.addEventListener('DOMContentLoaded', function() {
  const prev = document.querySelector('[data-prev-decade]');
  const next = document.querySelector('[data-next-decade]');
  if (!prev && !next) return;
  const badge = document.createElement('div');
  badge.id = 'kbd-hint';
  badge.style.cssText = 'position:fixed;bottom:72px;right:16px;z-index:40;background:#ebe8e2;border:1px solid #c4c7c7;padding:6px 12px;font-family:Inter,sans-serif;font-size:10px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;color:#575757;transition:opacity 0.4s;pointer-events:none;';
  const prevLabel = prev ? prev.getAttribute('aria-label').replace('Previous decade: ','') : '';
  const nextLabel = next ? next.getAttribute('aria-label').replace('Next decade: ','') : '';
  badge.textContent = (prevLabel ? '← ' + prevLabel + '  ' : '') + (nextLabel ? nextLabel + ' →' : '');
  document.body.appendChild(badge);
  const hide = () => { badge.style.opacity = '0'; };
  setTimeout(hide, 4000);
  document.addEventListener('keydown', function(e) { if(e.key==='ArrowLeft'||e.key==='ArrowRight') hide(); }, {once:true});
});
```
**Done when:** Badge appears bottom-right on 1980s.html desktop, shows correct decade names, disappears after arrow key or 4 sec.

---

### 4. 🟡 Chromatic River — mobile tap feedback
**File:** `chromatic.html` — find the `canvas.addEventListener('click', ...)` block (around line 394–401).
**Problem:** No visual feedback before `window.location.href` fires — feels dead on mobile.
**Important scope note:** `ctx` is defined inside `draw()` — it's NOT accessible at the click handler level. Get a fresh reference inside the handler:
```js
canvas.addEventListener('click', function(e) {
  const idx = getIdx(e.clientX);
  const w = WORKS[idx];
  const ctx = canvas.getContext('2d');
  const sliceW = canvas.width / WORKS.length;
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.fillRect(idx * sliceW, 0, sliceW, canvas.height);
  ctx.restore();
  setTimeout(() => { window.location.href = 'artwork.html?id=' + w[3]; }, 130);
});
```
**Done when:** Tapping a slice on iPhone shows a white flash on that column before navigating.

---

### 5. 🟡 Preload first-row artwork thumbnails
**Files:** `collage.html`, `photography.html`, `sculpture.html`, `painting.html`
**Problem:** All thumbnails use `loading="lazy"` including above-the-fold first row — delays LCP.
**Fix:** On each of the 4 pages:
1. Change `loading="lazy"` → `loading="eager"` on the first 4 `<img>` tags only
2. Add `fetchpriority="high"` to those same 4 images
3. Add `<link rel="preload">` in `<head>` for those 4 image URLs
**Reference:** Decade pages already have this fix applied. Look at `1980s.html` head for the preload pattern to copy.
**Done when:** Lighthouse LCP improves on collage.html. Quick check: DevTools Network → filter images → first 4 load without "lazy" deferral.

---

### 6. 🟡 Archive lazy-loading audit
**File:** `archive.html` — archive renders via JS. All images are created by `renderCard(w)` at line 461 using a template literal with `loading="lazy"` hardcoded.
**The fix requires modifying `renderCard` to accept an index:**
```js
function renderCard(w, idx) {
  // ... existing code ...
  // change loading="lazy" to:
  loading="${idx < 8 ? 'eager' : 'lazy'}"
}

// Update the call in renderPage():
slice.forEach((w, i) => { grid.innerHTML += renderCard(w, page * PAGE_SIZE + i); });
```
**Note:** Only applies to the first page load (page 0). Subsequent paginated loads can stay lazy — those are below the fold.
**Done when:** DevTools Network → filter images on archive.html fresh load → first 8 images load without lazy deferral.

---

### 7. 🟡 Review featured.txt / homepage works
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

### 8. 🟢 Offsite cloud backup
**Problem:** All three archive copies (MacBook, Time Machine, JEFFS-4TB) are in the same room — single point of physical failure.
**Recommended:** Backblaze B2 via rclone.
- Install: `brew install rclone` then `rclone config` to add B2 bucket
- Sync command: `rclone sync /Documents/JFSN/ b2:jfsn-archive/ --exclude "node_modules/**"`
- Cost: ~$0.50/month for ~800MB
- Add sync to `backup.sh` or create a separate `cloud-backup.sh` triggered from `end-session.sh`
**Minimal version (just the irreplaceable data):** Sync only `catalog.json`, `chromatic.json`, `catalog-home.json`, `featured.txt`, `artworks/*.json` — these are the files that can't be regenerated from scratch.
**Done when:** rclone configured, first sync completes, added to a script.

---

### 9. 🟢 Automated deploy after commit
**Current:** Two manual steps: `bash end-session.sh` then `bash deploy.sh`.
**Option A (simplest):** Append `bash "$(dirname "$0")/deploy.sh"` to end of `end-session.sh`, after the git push. FTP takes 2–5 min so it'll block — acceptable if sessions end that way.
**Option B (non-blocking):** Launch deploy in background: `bash deploy.sh &` — output goes to a log file.
**Option C (Netlify only):** Netlify already auto-deploys on GitHub push. HostGator requires FTP so can't be auto.
**Recommended:** Option A for simplicity.
**Done when:** A single `bash end-session.sh` handles git + FTP deploy.

---

### 10. 🟢 Archive sort by "recently added"
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
