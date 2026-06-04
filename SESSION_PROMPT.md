# JFSN Session Handoff Prompt
**Generated:** 2026-06-03 (session 3)
**Copy and paste this entire prompt to start the next focused session.**

---

## Paste this at the start of a new session:

---

Read `/Documents/JFSN/CURRENT_STATE.md` and `/Documents/JFSN/IMPROVEMENTS.md` before doing anything else. Then work through the ranked items below in order. Each item includes exactly what to do, where the code lives, and what done looks like.

**Project:** JFSN Archive — personal archive site for Jeffrey F. S. Neumann, 1,084 works.
- Live: jfsn.com (HostGator/cPanel, primary) and jfsn-archive.netlify.app (Netlify, has Companion edge function)
- Stack: vanilla HTML/CSS/JS, Tailwind compiled to `site.min.css` (31KB), service worker, no frameworks
- Design system: light/bone-white (`#fcf9f3`), deep-ink (`#0B0B0B`), orange accent (`#FF6600`), Playfair Display headings, Inter UI
- Deploy: `bash end-session.sh` (git commit + push) then `bash deploy.sh` (FTP to HostGator)
- Footer/nav: edit `_shared/top-nav.html` or `_shared/footer.html`, then run `bash stamp-nav.sh` to stamp all 22 pages
- **sw.js bug:** something keeps regenerating sw.js with an older CACHE_V. If git shows sw.js modified with an older timestamp, always `git checkout sw.js` — do NOT commit the rollback

---

## Ranked items — work top to bottom

---

### 1. 🔴 Test Companion live on iPhone
**What:** Open jfsn.com/companion.html on iPhone 15 Pro. Type a prompt ("targets" or "blue and melancholy"). Confirm a work comes back with a thumbnail and title.
**Why:** Untested since the May 2026 redesign. The backend was fixed (model IDs, thinking API, netlify.toml) but the frontend flow was never verified on device.
**Note:** Companion only works on jfsn-archive.netlify.app, not jfsn.com directly — the edge function lives on Netlify. Test at: https://jfsn-archive.netlify.app/companion.html
**Done when:** A response returns with an artwork suggestion on the Netlify URL on iPhone. If it fails, check the Netlify function logs at netlify.com dashboard.

---

### 2. 🔴 Test for-artists inquiry form on Netlify
**What:** Go to https://jfsn-archive.netlify.app/for-artists.html. Fill in the form fields (name, email, message). Submit.
**Why:** Form submission has never been tested since launch. It's a Netlify Forms setup — redirect should go to `?sent=1#inquire`.
**Done when:** After submit, URL becomes `?sent=1#inquire` and the thank-you state appears. Check Netlify dashboard → Forms for the submission.
**If broken:** Inspect the `<form>` tag in for-artists.html. Needs `netlify` attribute and `action="?sent=1#inquire"`. Check netlify.toml for form config.

---

### 3. 🔴 Test timeline scrub on mobile
**What:** Open jfsn.com/timeline.html on iPhone. Try dragging the horizontal year strip left/right.
**Why:** No JavaScript touch handler was found in the code — it may rely on CSS `overflow-x: scroll` only, which can feel janky or broken on iOS.
**File:** `timeline.html` — search for touch events. If none exist, add:
```js
// Touch scrub is CSS-only via overflow-x:scroll on the strip container
// If janky: add -webkit-overflow-scrolling:touch or scroll-snap
```
**Done when:** The strip scrolls smoothly on iPhone and years are reachable without friction.

---

### 4. 🟡 Update Companion suggestion chips
**What:** `companion.html` lines 343–350 — 8 example prompt chips. Current chips are good but generic. Update to better reflect the actual archive (Guernica series, Mr. SNOWmann, lost works, etc.).
**Current chips:**
- "something blue and melancholy"
- "chaos under control"
- "found objects and memory"
- "human figure, faded"
- "black and white, minimal"
- "midwest winter"
- "obsessive detail"
- "something joyful"

**Suggested replacements** (pick the best mix — aim for 6–8, varied in tone):
- "the Guernica series" (232 works — biggest single series)
- "Mr. SNOWmann" (recurring figure, unique to this archive)
- "targets and warplanes"
- "something from the 1970s"
- "crosses and ritual"
- "found objects and memory" (keep — it's accurate)
- "midwest winter" (keep — evocative)
- "lost and undocumented"

**Done when:** Chips updated in companion.html, stamped if needed (companion.html uses stamp-nav so run stamp-nav.sh after any structural change, though chips are in the page body not the nav block).

---

### 5. 🟡 Decade page keyboard nav badge
**What:** On decade pages (1970s.html–2020s.html), add a small floating badge near the top or bottom that shows "← 1970s | 1990s →" so users know keyboard nav exists. Should fade out after first keypress or after a few seconds.
**Files:** `_shared/ui.js` (keyboard handler is at lines 16–30) + the 6 decade pages. The decade pages use `data-prev-decade` / `data-next-decade` attributes on existing nav anchors.
**Implementation:**
- Inject a `<div id="kbd-hint">` into decade pages via ui.js on DOMContentLoaded
- Read the prev/next decade links to populate the label text dynamically
- Show for 4 seconds or until first ArrowLeft/ArrowRight keypress, then `opacity: 0; pointer-events: none`
- Style: small, bottom-right corner, `font-label-caps`, `bg-surface-container-high`, `border border-outline-variant`, no rounded corners
**Done when:** Badge appears on 1970s.html desktop load, shows correct decade names, disappears after ← key is pressed.

---

### 6. 🟡 Chromatic River — mobile tap feedback
**What:** `chromatic.html` line 394–401. Clicking a color slice navigates to the artwork. On mobile there's no visual feedback before navigation — it feels unresponsive.
**Fix:** On `click` (and `touchstart`), briefly flash the tapped slice white or highlight it before navigating. Use a short timeout (120ms) so the flash is visible before `window.location.href` fires.
```js
canvas.addEventListener('click', function(e) {
  const idx = getIdx(e.clientX);
  const w = WORKS[idx];
  // Flash: draw a white overlay on the slice, then navigate
  const sliceW = canvas.width / WORKS.length;
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fillRect(idx * sliceW, 0, sliceW, canvas.height);
  setTimeout(() => { window.location.href = 'artwork.html?id=' + w[3]; }, 120);
});
```
**Done when:** Tapping a slice on iPhone shows a brief white flash on that column before navigating.

---

### 7. 🟡 Preload first-row artwork thumbnails
**What:** `collage.html`, `photography.html`, `sculpture.html`, `painting.html` — first 4 visible thumbnails all have `loading="lazy"` which delays LCP.
**Fix:** Change `loading="lazy"` → `loading="eager"` AND add `fetchpriority="high"` on the first 4 `<img>` tags in each of those 4 files. Also add matching `<link rel="preload">` in `<head>` for those same 4 image URLs.
**Note:** Decade pages (1970s–2020s) already have this fix applied (`loading="eager"` on first 4). Replicate the same pattern.
**Done when:** Lighthouse LCP improves on collage.html. Quick check: DevTools Network tab, filter images, confirm first 4 load without "lazy" deferral.

---

### 8. 🟡 Archive lazy-loading audit
**What:** `archive.html` — confirm above-the-fold artwork thumbnails don't have `loading="lazy"`. The archive dynamically renders via JS (it's not static HTML), so this may be a JS-side fix.
**File:** Search `archive.html` for where thumbnails are generated. If JS creates `<img>` tags with `loading="lazy"`, change the first N rendered items to `loading="eager"` based on their position.
**Done when:** On a fresh load of archive.html, the first visible row of artworks loads without lazy deferral.

---

### 9. 🟡 Review featured.txt / homepage works
**What:** `catalog-home.json` (30 works shown on homepage) — last reviewed early 2026. Currently heavily weighted toward 2020 works (22 of 30 are from 2020).
**Current state:**
- art0953 (2000), art0483 (1990), art0504 (2020) + 27 more, 22 of which are 2020
- Missing representation from 1970s, 1980s, 2010s
**Fix:** Review `featured.txt` (source file for homepage featured set). Consider diversifying across decades — a handful from each era makes the homepage feel like a real survey of 50 years, not just recent work.
**Note:** After editing `featured.txt`, re-run `python3 artworks/build_catalog.py` to regenerate `catalog-home.json`. Then bump SW CACHE_V in sw.js and deploy.
**Done when:** Homepage shows works from at least 4 different decades. Jeff approves the selection.

---

### 10. 🟢 Offsite cloud backup
**What:** All three copies of the archive (MacBook, Time Machine, JEFFS-4TB) are in the same room. Add Backblaze B2 for the critical files.
**Scope:** JSON files + HTML (~50MB), images (~800MB). Full backup costs ~$0.50/month on B2.
**Option A — just the data:** Backup `catalog.json`, `chromatic.json`, `catalog-home.json`, `artworks/*.json`, `api/v1/*.json` to B2 via rclone. Free tier covers this.
**Option B — full site:** rclone sync of entire `/Documents/JFSN/` → B2 bucket. ~$0.50/month.
**Done when:** rclone config set up, first sync complete, daily cron or launchd agent running.

---

### 11. 🟢 Automated deploy after commit
**What:** Currently two manual steps: `bash end-session.sh` (git) then `bash deploy.sh` (FTP). Could hook deploy.sh into end-session.sh automatically.
**Files:** `end-session.sh` (check its contents first — it already does git commit + push + rsync backup).
**Option:** Add `bash deploy.sh` as the last line of `end-session.sh`. Or: use Netlify's GitHub integration so Netlify auto-deploys on push (already partially set up — just needs the environment variables and build config confirmed).
**Caveat:** FTP deploy takes 2–5 minutes. Don't block the commit flow if deploy is slow. Consider running deploy in background or separating it into a confirm step.
**Done when:** Running `bash end-session.sh` results in both GitHub push and HostGator deploy completing.

---

### 12. 🟢 Archive sort by "recently added"
**What:** `archive.html` — currently sorts by artwork ID (which is intake order, roughly chronological). Add a "Recently Added" sort option that surfaces highest IDs first.
**File:** `archive.html` — find the sort logic (likely a JS sort function). Add a new sort key `id_desc` that sorts by numeric ID descending.
**Done when:** A "Recently Added" option appears in the sort dropdown and clicking it puts art1084, art1083... at the top.

---

## After each item

Run `bash end-session.sh` then `bash deploy.sh` to ship. Update `CURRENT_STATE.md` with what changed. Cross off the item in `IMPROVEMENTS.md`.

**Watch for sw.js rollback:** After any script runs (build_catalog.py, gen-artwork-pages.py, etc.), check `git diff sw.js`. If it shows an older CACHE_V, do `git checkout sw.js` before committing.

---

## Architecture quick-ref

| File | Purpose |
|------|---------|
| `_shared/top-nav.html` | Canonical nav — edit here, then `bash stamp-nav.sh` |
| `_shared/footer.html` | Canonical footer — edit here, then `bash stamp-nav.sh` |
| `_shared/ui.js` | Keyboard nav, scroll reveal, hero zoom, decade transitions |
| `_shared/ui.css` | Grayscale→color hover, border draw, scroll reveal styles |
| `catalog.json` | All 1,084 works — generated by `artworks/build_catalog.py` |
| `sw.js` | Service worker — bump `CACHE_V` whenever deploy may be cached |
| `deploy.sh` | FTP mirror to HostGator (run after end-session.sh) |
| `end-session.sh` | git commit + push + rsync backup (does NOT deploy to HostGator) |
| `stamp-nav.sh` | Stamps nav + footer into all 22 Stitch pages |

**Decade pages** (1970s–2020s) are NOT stamped by stamp-nav.sh — they use the Material Design token system and inline nav. Edit them directly.
