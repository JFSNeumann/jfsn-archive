# JFSN Session Handoff Prompt
**Generated:** 2026-06-03 (session 3 — deep audit)
**Copy everything below the line and paste it to start the next session.**

---

Read `/Documents/JFSN/CURRENT_STATE.md` and `/Documents/JFSN/IMPROVEMENTS.md` before doing anything. Then work through the ranked items below in order.

**Project:** JFSN Archive — personal archive site for Jeffrey F. S. Neumann, 1,084 works.
- Live: jfsn.com (HostGator/cPanel, primary) and jfsn-archive.netlify.app (Netlify — has Companion edge function)
- Stack: vanilla HTML/CSS/JS, Tailwind compiled to `site.min.css` (31KB), service worker, no frameworks
- Design system: light/bone-white (`#fcf9f3`), deep-ink (`#0B0B0B`), orange accent (`#FF6600`), Playfair Display headings, Inter UI
- Deploy workflow: `bash end-session.sh` (git commit + push + rsync backup) → `bash deploy.sh` (FTP to HostGator, separate step)
- Footer/nav: edit `_shared/top-nav.html` or `_shared/footer.html`, then `bash stamp-nav.sh` (now targets 30 pages)
- **Known sw.js behavior:** `build_catalog.py` auto-bumps CACHE_V — now fixed to only bump if newer. Still: after any script run, verify `git diff sw.js` shows no unexpected rollback.

---

## Ranked items — work top to bottom

---

### 1. 🔴 Test Companion live on iPhone
**What:** Open https://jfsn-archive.netlify.app/companion.html on iPhone 15 Pro (must use Netlify URL — Companion edge function doesn't exist on jfsn.com). Type a prompt: "targets" or "something blue and melancholy". Confirm a work title + thumbnail comes back.
**Why:** Untested since May 2026 redesign. Backend was fixed (model IDs, thinking API, netlify.toml) but UI flow never verified on device.
**If it fails:** Check Netlify dashboard → Functions → companion logs for errors. The function is at `netlify/edge-functions/companion.js`. Known issues fixed: model names are `claude-haiku-4-5` and `claude-sonnet-4-6-20250514`, thinking uses `{type: 'adaptive'}`.
**Done when:** Response returns with a work suggestion on iPhone.

---

### 2. 🔴 Test for-artists inquiry form on Netlify
**What:** Go to https://jfsn-archive.netlify.app/for-artists.html. Fill in name, email, message. Submit.
**Why:** Never tested since launch.
**Expected:** After submit, URL becomes `?sent=1#inquire` and thank-you state shows.
**If broken:** Check `<form>` tag in `for-artists.html` — needs `netlify` attribute and `action="?sent=1#inquire"`. Also check Netlify dashboard → Forms for submissions.
**Done when:** Submission goes through; check Netlify dashboard confirms receipt.

---

### 3. 🔴 Test timeline scrub on mobile
**What:** Open jfsn.com/timeline.html on iPhone. Drag the horizontal year strip left/right.
**Why:** No JavaScript touch handler found in code — it may rely on CSS `overflow-x: scroll` only.
**If janky:** Open `timeline.html`, find the strip container. Add `-webkit-overflow-scrolling: touch` and `scroll-snap-type: x mandatory` with `scroll-snap-align: start` on children if needed.
**Done when:** Strip scrolls smoothly on iPhone through all years without sticking or dead zones.

---

### 4. 🟡 Update Companion suggestion chips
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
After editing: run `bash stamp-nav.sh` (the chips are in page body, not the nav block, but stamp-nav will update the footer — run it to keep everything in sync).
**Done when:** Chips show archive-specific prompts on companion.html.

---

### 5. 🟡 Decade page keyboard nav badge
**Why it matters:** The ← / → keyboard shortcut works (implemented in `_shared/ui.js` lines 16–30 via `data-prev-decade` / `data-next-decade` attributes) but nobody knows it's there.
**What to build:** A floating hint badge that shows "← 1970s | 1990s →" (text pulled from the existing `data-prev-decade` / `data-next-decade` anchors). Badge appears on page load, fades out after 4 seconds OR on first ArrowLeft/ArrowRight keypress.
**Where to add it:** `_shared/ui.js` — inject on DOMContentLoaded, only if both prev/next anchors exist (so it only appears on decade pages). Example:
```js
// Keyboard nav hint badge for decade pages
document.addEventListener('DOMContentLoaded', function() {
  const prev = document.querySelector('[data-prev-decade]');
  const next = document.querySelector('[data-next-decade]');
  if (!prev && !next) return;
  const badge = document.createElement('div');
  badge.id = 'kbd-hint';
  badge.style.cssText = 'position:fixed;bottom:72px;right:16px;z-index:40;background:#ebe8e2;border:1px solid #c4c7c7;padding:6px 12px;font-family:Inter,sans-serif;font-size:10px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;color:#575757;transition:opacity 0.4s;pointer-events:none;';
  badge.textContent = (prev ? '← ' + prev.textContent.trim() + '  ' : '') + (next ? next.textContent.trim() + ' →' : '');
  document.body.appendChild(badge);
  const hide = () => { badge.style.opacity = '0'; };
  setTimeout(hide, 4000);
  document.addEventListener('keydown', function(e) { if(e.key==='ArrowLeft'||e.key==='ArrowRight') hide(); }, {once:true});
});
```
**Note:** `_shared/ui.js` is loaded on ALL pages, but the badge only renders when prev/next decade anchors exist — safe to add globally.
**Done when:** Badge appears bottom-right on 1980s.html desktop, shows correct decade names, disappears after arrow key or 4 sec.

---

### 6. 🟡 Chromatic River — mobile tap feedback
**File:** `chromatic.html` — find the `canvas.addEventListener('click', ...)` block (around line 394–401).
**Problem:** No visual feedback before `window.location.href` fires — feels dead on mobile.
**Fix:** Flash the tapped slice, then navigate:
```js
canvas.addEventListener('click', function(e) {
  const idx = getIdx(e.clientX);
  const w = WORKS[idx];
  // Brief flash on tapped slice
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

### 7. 🟡 Preload first-row artwork thumbnails
**Files:** `collage.html`, `photography.html`, `sculpture.html`, `painting.html`
**Problem:** All thumbnails use `loading="lazy"` including above-the-fold first row — delays LCP.
**Fix:** On each of the 4 pages:
1. Change `loading="lazy"` → `loading="eager"` on the first 4 `<img>` tags only
2. Add `fetchpriority="high"` to those same 4 images
3. Add `<link rel="preload">` in `<head>` for those 4 image URLs
**Reference:** Decade pages already have this fix applied. Look at `1980s.html` head for the preload pattern to copy.
**Done when:** Lighthouse LCP improves on collage.html. Quick check: DevTools Network → filter images → first 4 load without "lazy" deferral.

---

### 8. 🟡 Archive lazy-loading audit
**File:** `archive.html` — archive renders via JS, not static HTML.
**Find:** Search for where `<img>` tags are created in the JS (grep for `loading` or `createElement`). 
**Fix:** First N rendered items (those in the initial viewport ~8 items at typical screen size) should not be lazy. Change `loading="lazy"` to `loading="eager"` for items where `index < 8` (or calculate based on columns × visible rows).
**Done when:** First row of archive.html renders without deferral on a fresh load.

---

### 9. 🟡 Review featured.txt / homepage works
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

### 10. 🟢 Offsite cloud backup
**Problem:** All three archive copies (MacBook, Time Machine, JEFFS-4TB) are in the same room — single point of physical failure.
**Recommended:** Backblaze B2 via rclone.
- Install: `brew install rclone` then `rclone config` to add B2 bucket
- Sync command: `rclone sync /Documents/JFSN/ b2:jfsn-archive/ --exclude "old-site/**" --exclude "node_modules/**"`
- Cost: ~$0.50/month for ~800MB
- Add sync to `backup.sh` or create a separate `cloud-backup.sh` triggered from `end-session.sh`
**Minimal version (just the irreplaceable data):** Sync only `catalog.json`, `chromatic.json`, `catalog-home.json`, `featured.txt`, `artworks/*.json` — these are the files that can't be regenerated from scratch.
**Done when:** rclone configured, first sync completes, added to a script.

---

### 11. 🟢 Automated deploy after commit
**Current:** Two manual steps: `bash end-session.sh` then `bash deploy.sh`.
**Option A (simplest):** Append `bash "$(dirname "$0")/deploy.sh"` to end of `end-session.sh`, after the git push. FTP takes 2–5 min so it'll block — acceptable if sessions end that way.
**Option B (non-blocking):** Launch deploy in background: `bash deploy.sh &` — output goes to a log file.
**Option C (Netlify only):** Netlify already auto-deploys on GitHub push. HostGator requires FTP so can't be auto.
**Recommended:** Option A for simplicity. Run `bash end-session.sh` and get both done in one step.
**Done when:** A single `bash end-session.sh` handles git + FTP deploy.

---

### 12. 🟢 Archive sort by "recently added"
**File:** `archive.html` — find the sort logic (a JS sort function operating on the works array).
**Add:** A sort option `id_desc` that sorts by numeric ID descending (art1084, art1083… = most recently ingested first). Extract the number from the file/id string: `parseInt(a.file.replace(/\D/g,''))`.
**UI:** Add "Recently Added" option to the sort dropdown.
**Useful once new works are ingested** — currently all IDs are in intake order, so this is equivalent to reverse-chronological by ingest date.
**Done when:** A "Recently Added" sort option appears and clicking it shows newest works first.

---

## After every item

```bash
bash end-session.sh   # git commit + push + rsync backup
bash deploy.sh        # FTP to HostGator
```

Cross off the item in `IMPROVEMENTS.md`. Update `CURRENT_STATE.md`.

---

## Things found and fixed in session 3 (deep audit) — do NOT redo

- ✅ **Analytics (Goatcounter) missing from 21 pages** — now in `_shared/footer.html`; all 36 public pages have exactly 1 snippet
- ✅ **stamp-nav.sh TARGETS expanded** — now includes all 7 static theme pages + api.html (30 pages total)
- ✅ **site.min.css added to SW PRECACHE** — was missing; now offline-first load works
- ✅ **build_catalog.py sw.js rollback bug fixed** — now only bumps CACHE_V if new timestamp is strictly newer
- ✅ **curate.html + dedupe.html noindex added** — dev tools were crawlable; now protected
- ✅ **Footer duplicate About removed** — replaced with Lost Works + For Artists
- ✅ **about.html keyword expansion** — meta description + opening paragraph strengthened for Knowledge Panel

---

## Architecture quick-ref

| File | Purpose |
|------|---------|
| `_shared/top-nav.html` | Canonical nav (stamp-nav.sh, 30 pages) |
| `_shared/footer.html` | Canonical footer — also contains analytics + SW registration |
| `_shared/ui.js` | Keyboard nav, scroll reveal, hero zoom, decade transitions |
| `_shared/ui.css` | Grayscale→color hover, border draw, scroll reveal |
| `stamp-nav.sh` | Stamps nav + footer into 30 pages. Decade pages NOT included — edit directly |
| `catalog.json` | All 1,084 works — generated by `artworks/build_catalog.py` |
| `sw.js` | Service worker — CACHE_V auto-bumped by build_catalog.py (now safely) |
| `deploy.sh` | FTP mirror to HostGator |
| `end-session.sh` | git commit + push + rsync backup (does NOT deploy to HostGator) |

**Decade pages (1970s–2020s):** NOT in stamp-nav.sh — use Material Design tokens. Edit directly.
**Dev tools (curate.html, dedupe.html, qa.html, jeff.html):** noindex, not in sitemap. Keep that way.
