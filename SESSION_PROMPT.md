# JFSN Session Handoff Prompt
**Generated:** 2026-06-13 (session 36)
**Copy everything below the line and paste it to start the next session.**

> Note: the **v3 verification-first start prompt** (in memory `jfsn_session_prompts.md`) is the primary way to open a session — it checks backups + live drift first. This file is the ranked *work* handoff to use after that.

---

Read `/Documents/JFSN/CURRENT_STATE.md` and `/Documents/JFSN/IMPROVEMENTS.md` before doing anything. Then work the ranked items below in order.

**Project:** JFSN Archive — personal archive site for Jeffrey F. S. Neumann, 1,084 works. A *preservation project*, not a website project — optimize for completion, not ambition. Making is the point; never push outreach/promotion.
- Live: **jfsn.com** (HostGator/cPanel, primary) and **jfsn-archive.netlify.app** (Netlify — has the Companion function + artwork-meta edge function)
- Stack: vanilla HTML/CSS/JS, Tailwind compiled to `site.min.css` (no CDN), service worker, no frameworks
- Design system: light/bone-white (`#fcf9f3`), deep-ink (`#0B0B0B`), orange accent (`#FF6600`), Playfair Display headings, Inter UI. No gradients, no rounded corners, 1px borders.
- **Nav: Archive · About · Stories · Lost (4 items).** Series + Companion are footer-only.
- **Mobile nav is a hamburger → slide-in drawer** (`#mobile-menu-drawer`), NOT a fixed bottom bar.
- **Icons: inline feather-style SVGs only** (24-viewBox, 1.8 stroke, `currentColor`). No icon fonts.
- Deploy: `bash end-session.sh` (git commit + push + 4TB rsync + Backblaze B2) → deploy to HostGator via **JFSN.app** desktop app (NOT deploy.sh). **Netlify has NO git integration** — function/Companion changes deploy via a curated CLI stage (`netlify deploy --prod`); recipe in `docs/CREDENTIAL-EXPOSURE-REPORT.md` §6.
- Footer/nav: edit `_shared/top-nav.html` / `_shared/footer.html`, then `bash stamp-nav.sh` (31 pages; decade pages NOT included — edit directly).
- **CSS rebuild:** `npm run build:css` after any new Tailwind utility, then bump `CACHE_V` in `sw.js`. `build_catalog.py` auto-bumps CACHE_V only when catalog content changes — check `git diff sw.js`.
- **B2 daily cap:** Backblaze hits a transaction cap most days; it resets midnight GMT (≈ 8 PM EDT). If `end-session.sh` reports B2 skipped, run `bash cloud-backup.sh` after the reset. (B2 has NO recurring schedule — only the 11 PM `com.jfsn.backup` LaunchAgent, which runs `backup.sh` = 4TB rsync ONLY.)

---

## Ranked items — work top to bottom

### 0. ⏏ FIRST: confirm the two open perf items (session 36 close)
Everything below was DEPLOYED + verified live this session (commit `414c872f`; all 4 stores synced). Two perf items are still open and need Jeff's Lighthouse:

**0a. Mobile LCP — confirm the static-hero fix landed.** Mobile LCP went 7.6→7.2→5.9s across fixes; the final fix (slide 0 is now a static `<img>` in the HTML, off the JS critical path — commit `d5ca52b9`) should drop it toward desktop's ~1.5s. **Re-run mobile Lighthouse on jfsn.com.** If LCP is now green/good → close it. If still >2.5s, next levers: make Google Fonts non-render-blocking (render-blocking ~780ms is still flagged), or defer hero slides 1–2 loading so only slide 0's 46 KB loads first. (Background: the hero is a JS slideshow; slide 0 = static HTML stamped by build_catalog from featured-hero.txt line 1; init() reuses it. Don't re-introduce a transform animation on slide 0.)

**0b. Desktop CLS = 0.16 — get the culprit, then fix.** Highly variable across runs (0 / 0.05 / 0.147 / 0.16); locally only reproduces at 0.012, so it's throttle/timing-dependent — suspected **web-font swap on the large Playfair headings** reflowing after paint. **In the desktop Lighthouse run, EXPAND the "Layout shift culprits" row and read the shifting node.** Then fix surgically (likely: preload or self-host the 2 Google Fonts, or add `size-adjust`/reserve heading space). DON'T guess CLS — it's been chased blind twice already.

### 2. 🔴 DOMAIN — Jeff contacts the friend holding the Gandi account  *(Jeff's action; keystone)*
jfsn.com is registered at Gandi in a *friend's* account. Jeff is registrant of record but can't renew (expires **2027-03-05**), move nameservers, or transfer. SPOF #1, and the durable fix for the unrotatable exposed FTP password (recover domain → move serving off HostGator → let hosting lapse). Ask the friend for a Change-of-Owner or the transfer code. Prepared in `docs/DOMAIN-RECOVERY-DOCUMENT-PACK.md` + `docs/FINAL-DOMAIN-AND-PRESERVATION-HANDOFF.md`.

### 3. 🟡 One ~1-minute audio recording  *(standing #1 creator-context priority — offer gently, don't push)*
No audio of Jeff exists anywhere. He declined once (2026-06-12) — offer occasionally, never insist. Also: listen to `old-site/BB/audio/sample.wav` (21s — possibly the only existing audio).

### 4. 🟡 Real physical dimensions (inches/cm)
Orientation stand-in shipped (session 35); `composite` + `year (est.)` provenance shipped (session 36). Real measurements need Jeff to measure surviving works — no tooling. Start with the most significant pieces.

### 5. 🟢 Grid/search/favorites year labels  *(optional follow-up to session-36 provenance)*
Detail pages + API now show "1990s (est.)", but grid/search/favorites captions still show the bare decade year ("1990"). Could extend `year_display` to grids — but it adds visual noise to terse captions. Jeff's call.

### 6. 🟡 Oral history — unanswered questions
`docs/oral-history/master-notes.md` → "Unresolved Questions". Top item: why did he keep going after the Rauschenberg realization? Approach gently; spare answers are the voice.

### 7. 🟢 series-index.html per-theme icons  *(review first)*
Extend the inline-SVG icon vocabulary to the 8 series/themes — ONLY if they read as earned, not literal. Show Jeff before committing.

### 8. 🟢 Ingest new work (pipeline ready)
Drop photos into `artworks/inbox/`, run `bash add-works.sh`.

---

## After every item
```bash
bash end-session.sh   # git commit + push + 4TB rsync + Backblaze B2
```
Then deploy via JFSN.app (HostGator). **If a Netlify function / the Companion changed, also redeploy the mirror with `bash deploy-netlify.sh`.** Cross off the item in `IMPROVEMENTS.md`; update `CURRENT_STATE.md`.

---

## Done recently — do NOT redo
- ✅ **Mobile hero LCP** (session 36) — `featured-hero.txt` leads with **art0392** (lightest); slide-0 deterministic in `index.html init()`; media-aware `<head>` preload stamped by `build_catalog.py` (HERO_PRELOAD markers). Don't re-randomize slide 0 — it breaks the preload match.
- ✅ **Provenance fields** (session 36) — `year_precision='estimated'` + `year_display="1990s (est.)"` on ALL 1,084; `composite=True` on 250 works (Gallery ∪ Studio ∪ `PLACEMENT_RE` title). Shown on artwork pages + API. `description_source` deliberately SKIPPED (Jeff's call). To change the composite set, edit the rule in `build_catalog.py` + rerun gen-artwork-pages.
- ✅ **Companion deep-mode 502 = Netlify 30s timeout** (session 35). Deep = Sonnet 4.6 **without** extended thinking, 1024 tokens. Don't re-add `thinking` to deep mode on a sync function.
- ✅ **Image orientation** field + archive filter (session 35).
- ✅ **gallery-images.html** rewritten to composite truth ("Imagined Placements") — Photoshop composites, NOT real exhibitions.
- ✅ **Icons sitewide** inline SVG; **Material Symbols icon font removed sitewide** — never re-add.
- ✅ **HSTS** enabled. **Performance pass** confirmed (Lighthouse, was 18.2s LCP).
- ✅ **Allison PDF + FTP-password exposure** — every public copy closed/blocked. FTP password **cannot be rotated** (no cPanel) — fix is the domain move (item 2).
- ✅ **Netlify has NO git integration** — deploys are manual curated CLI only.
- ✅ **Exhibition Record** verified by Jeff (master-notes §27); **catalog images are composites, not event records.**
- ✅ Banned thumbnail patterns (grayscale, scale/transform hover, sibling dim, scroll-reveal, hero text labels over artwork) — do not reintroduce.

---

## Architecture quick-ref

| File | Purpose |
|------|---------|
| `_shared/top-nav.html` | Canonical nav + mobile drawer (stamp-nav.sh → 31 pages). Nav: Archive · About · Stories · Lost. |
| `_shared/footer.html` | Canonical footer — analytics + SW registration |
| `_shared/ui.js` | Keyboard nav (← / → decade pages), vertical page label. No scroll-reveal. |
| `_shared/ui.css` | `.thumb__link` micro-interactions (saturation overlay, orange outline on img on hover) |
| `catalog.json` | All 1,084 works — generated by `artworks/build_catalog.py` |
| `catalog-lite.json` | Trimmed catalog for search.js + edge function. Fields incl. `series, favorite, featured, orientation, composite, year_precision, year_display`. |
| `artworks/featured-hero.txt` | Hero pool. **Line 1 = LCP anchor** (always shows first, preloaded) — keep it the lightest crop. build_catalog stamps HERO_POOL + `<head>` preload from it. |
| `gen-artwork-pages.py` | Regenerates all 1,084 `artworks/pages/` static pages (needs `colors.json`). `--limit 5` to test. |
| `sw.js` | Service worker. CACHE_V auto-bumped by build_catalog when catalog changes; else bump manually. |
| `end-session.sh` | git commit + push + 4TB rsync + Backblaze B2 (does NOT deploy to HostGator) |
| `netlify/functions/companion.mjs` | Companion (Netlify only). Deep = Sonnet w/o thinking. |

**Decade pages (1970s–2020s):** NOT in stamp-nav.sh — Material Design tokens. Edit directly.
**Hero AVIFs on server:** upload to `/artworks/artNNNN-hero.avif` (flat dir) — `.htaccess` rewrites from `artworks/full/`. Each hero needs `-hero.avif` (desktop) + `-hero-m.avif` (1080px mobile). Recompressed-hero originals are backed up in `artworks/_hero-orig-backup/`.
**api/.htaccess:** auto-generated by `build_catalog.py` — edit the template in that script. No mod_security (HTTP 500 on HostGator).
