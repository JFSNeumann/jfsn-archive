# JFSN Session Handoff Prompt
**Generated:** 2026-06-13 (session 35)
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
- **Icons: inline feather-style SVGs only** (24-viewBox, 1.8 stroke, `currentColor`). No icon fonts — Material Symbols was removed sitewide.
- Deploy: `bash end-session.sh` (git commit + push + 4TB rsync + Backblaze B2) → deploy to HostGator via **JFSN.app** desktop app (NOT deploy.sh). **Netlify has NO git integration** — function/Companion changes deploy via a curated CLI stage (`netlify deploy --prod`); recipe in `docs/CREDENTIAL-EXPOSURE-REPORT.md` §6.
- Footer/nav: edit `_shared/top-nav.html` / `_shared/footer.html`, then `bash stamp-nav.sh` (31 pages; decade pages NOT included — edit directly).
- **CSS rebuild:** `npm run build:css` after any new Tailwind utility, then bump `CACHE_V` in `sw.js`. `build_catalog.py` auto-bumps CACHE_V only when catalog content changes — check `git diff sw.js`.
- **B2 daily cap:** Backblaze hits a transaction cap most days; it resets midnight GMT (≈ 8 PM EDT). If `end-session.sh` reports B2 skipped, run `bash cloud-backup.sh` after the reset.

---

## Ranked items — work top to bottom

### 1. 🔴 DOMAIN — Jeff contacts the friend holding the Gandi account  *(Jeff's action; keystone)*
| | |
|---|---|
| **Why** | jfsn.com is registered at Gandi in a *friend's* account. Jeff is registrant of record but can't renew (expires **2027-03-05**), move nameservers, or transfer. SPOF #1, and the durable fix for the unrotatable exposed FTP password (recover domain → move serving off HostGator → let hosting lapse). |
| **Do** | Ask the friend for a Change-of-Owner to a Jeff-controlled Gandi account, or the transfer code. Everything prepared in `docs/DOMAIN-RECOVERY-DOCUMENT-PACK.md` + `docs/FINAL-DOMAIN-AND-PRESERVATION-HANDOFF.md`. |
| **Done when** | Domain is in Jeff's own account, or the transfer code is in hand. |

### 2. 🟡 One ~1-minute audio recording  *(standing #1 creator-context priority — offer gently, don't push)*
No audio of Jeff exists anywhere. He declined once (2026-06-12) — offer occasionally, never insist. Also: listen to `old-site/BB/audio/sample.wav` (21s — possibly the only existing audio).

### 3. 🟡 Real physical dimensions (inches/cm)
Orientation stand-in already shipped (vertical/horizontal/square from `dims.json`, on artwork pages + archive filter). Real measurements need Jeff to measure surviving works — no tooling. Start with the most significant pieces.

### 4. 🟡 Catalog provenance fields  *(RECOMMENDED FIRST BUILD — the one multi-session project)*
Lets the site show the truth it currently hides: decade-estimate years presented as hard years, machine-written descriptions presented as authoritative, composite images presented as real. **Same pipeline as the `orientation` field (session 35):** `build_catalog.py` → catalog + lite → api/v1 → artwork.html + `gen-artwork-pages.py` template display → JSON-LD → regenerate 1,084 pages.

**⚠️ Do NOT write these blind — guessing mislabels 1,084 records, the opposite of the goal. Put these three decisions to Jeff FIRST, then build once:**

| Field | What's known | Decision Jeff must make |
|---|---|---|
| `year_precision` | ~1,075/1,084 years are round decade-bucket estimates; ~9 are non-round | Are ANY years genuinely exact, or are all estimates? Display format: **"c. 1974"** vs **"1970s (est.)"**? Proposed safe default: mark all `estimated`, display "c. <year>", Jeff flags any he knows exactly. |
| `composite` | Jeff confirmed ALL gallery/installation images are Photoshop composites (master-notes §22/§25); gallery-images.html already says so | Is the composite set **only** the "Gallery" theme (149), or are there installation/crowd works outside it? Need the exact set or a rule before flagging — flagging only the Gallery theme would falsely imply every other work is real. Surface as a small "Photoshop composite — imagined placement" note on those artwork pages. |
| `description_source` | ALL descriptions are machine-written (known fact) — safe to flag uniformly `ai-generated`, no Jeff input needed | Note: descriptions aren't shown on artwork pages (removed session 9), so this mainly makes the **open API** honest. Worth it? |

Recommended order once decisions are in: `composite` first (highest truth value, gallery-images groundwork done), then `year_precision`, then `description_source`.

### 5. 🟡 Oral history — unanswered questions
`docs/oral-history/master-notes.md` → "Unresolved Questions". Top item: why did he keep going after the Rauschenberg realization? Approach gently; spare answers are the voice.

### 6. 🟢 series-index.html per-theme icons  *(review first)*
Extend the session-35 inline-SVG icon vocabulary to the 8 series/themes — ONLY if they read as earned, not literal (target/cross/face icons risk feeling cheesy on an art site). Show Jeff before committing.

### 7. 🟢 Ingest new work (pipeline ready)
Drop photos into `artworks/inbox/`, run `bash add-works.sh`.

---

## After every item
```bash
bash end-session.sh   # git commit + push + 4TB rsync + Backblaze B2
```
Then deploy via JFSN.app (HostGator). **If a Netlify function / the Companion changed, also redeploy Netlify via the curated CLI stage.** Cross off the item in `IMPROVEMENTS.md`; update `CURRENT_STATE.md`.

---

## Done recently — do NOT redo
- ✅ **Companion deep-mode 502 = Netlify 30s timeout** (NOT "Unexpected model response"). Deep is now Sonnet 4.6 **without** extended thinking, 1024 tokens. Verified live (session 35). Don't re-add `thinking` to deep mode on a synchronous function.
- ✅ **Image orientation** field + archive filter (session 35). `dims.json` → `orientation` in catalog + lite.
- ✅ **gallery-images.html** rewritten to composite truth ("Imagined Placements") — these are Photoshop composites, NOT real exhibitions (master-notes §22/§25).
- ✅ **Icons sitewide** — homepage "Where To Begin", start-here "Begin Exploring", mobile drawer. Inline SVG, no icon fonts.
- ✅ **Material Symbols icon font removed sitewide** — all icons inline SVG (`artworks/replace_icons.py`). Never re-add the font.
- ✅ **HSTS** enabled in `.htaccess`. **Performance pass** confirmed by Lighthouse (desktop ~86 / mobile ~78, LCP ~2.4–5.4s, was 18.2s).
- ✅ **Allison PDF + FTP-password exposure** — every public copy closed/blocked (`docs/CREDENTIAL-EXPOSURE-REPORT.md`). FTP password **cannot be rotated** (no cPanel access) — don't chase it; the fix is the domain move (item 1).
- ✅ **Netlify has NO git integration** — proven 2026-06-12. Deploys are manual curated CLI only. Don't expect a push to deploy it.
- ✅ **Exhibition Record** verified by Jeff (master-notes §27); **catalog images are composites, not event records** — never treat a gallery/installation image as proof an event happened.
- ✅ Banned thumbnail patterns (grayscale filter, scale/transform on hover, sibling dim, scroll-reveal, hero text labels over artwork) — removed; do not reintroduce.

---

## Architecture quick-ref

| File | Purpose |
|------|---------|
| `_shared/top-nav.html` | Canonical nav + mobile drawer (stamp-nav.sh → 31 pages). Nav: Archive · About · Stories · Lost. Drawer links carry inline-SVG icons. |
| `_shared/footer.html` | Canonical footer — analytics + SW registration |
| `_shared/ui.js` | Keyboard nav (← / → decade pages), vertical page label. No scroll-reveal. |
| `_shared/ui.css` | `.thumb__link` micro-interactions (saturation overlay, orange outline on img on hover) |
| `_shared/nav-active.js` | Sets orange active nav link by pathname |
| `_shared/jfsn-interactions.js` | Cursor ring, film grain, view-transition stamper, serendipity, etc. |
| `stamp-nav.sh` | Stamps nav/footer into Stitch pages. Decade pages NOT included — edit directly. |
| `catalog.json` | All 1,084 works — generated by `artworks/build_catalog.py` |
| `catalog-lite.json` | Trimmed catalog for search.js + edge function. Fields incl. `series, favorite, featured, orientation`. |
| `gen-artwork-pages.py` | Regenerates all 1,084 `artworks/pages/` static pages (needs `colors.json`). `--limit 5` to test. |
| `sw.js` | Service worker — network-first HTML/CSS/JS, cache-first AVIF. CACHE_V auto-bumped by build_catalog when catalog changes. |
| `end-session.sh` | git commit + push + 4TB rsync + Backblaze B2 (does NOT deploy to HostGator) |
| `netlify/functions/companion.mjs` | Companion (Netlify only). Deep = Sonnet w/o thinking. |

**Decade pages (1970s–2020s):** NOT in stamp-nav.sh — Material Design tokens. Edit directly.
**Dev tools (curate.html, dedupe.html, qa.html, jeff.html):** noindex, not in sitemap.
**Hero AVIFs on server:** upload to `/artworks/artNNNN-hero.avif` (flat dir) — `.htaccess` rewrites from `artworks/full/`. Each hero needs `-hero.avif` (desktop) + `-hero-m.avif` (1080px mobile).
**api/.htaccess:** auto-generated by `build_catalog.py` — edit the template in that script. No mod_security (HTTP 500 on HostGator).
