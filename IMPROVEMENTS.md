# JFSN — Improvement List
**Updated:** 2026-06-04 (session 4)

A living list. Add to it. Cross things off. This is the backlog.

---

## 🔴 Do soon

- [x] **index.html duplicate h1** ✅ — added `aria-hidden="true"` to mobile h1 2026-06-03.
- [x] **api.html — migrate off old dark system** ✅ — migrated to light Tailwind system; site.css deleted; SW cache bumped. Deploy to HostGator + delete site.css from server via FileZilla.
- [x] **site.css deleted from server** ✅ — confirmed removed via FileZilla 2026-06-03.
- [ ] ~~**Delete `old-site/` locally**~~ — keeping intentionally.
- [ ] ~~**Delete `old-site/` on server**~~ — keeping intentionally.

- [x] **Test Companion live** ✅ — confirmed working on iPhone 2026-06-04.
- [x] **Test for-artists inquiry form** ✅ — confirmed working 2026-06-04; 1 submission received in Netlify dashboard.
- [x] **Test timeline scrub on mobile** ✅ — fixed jank 2026-06-04: removed manual touchmove handler, added native momentum scrolling. Confirmed working on iPhone.
- [x] **Google Search Console** ✅ — sitemap submitted 2026-06-03. 2,190 URLs including all 1,084 artwork pages.
- [ ] **Ingest new work** — drop photos into `artworks/inbox/`, run `bash add-works.sh`. Pipeline is ready.

---

## 🟡 High value, no deadline

### SEO
- [x] **Static theme pages** — 8 fully crawlable pages: `guernica.html` (232), `targets.html` (403), `framed.html` (230), `torsos-faces.html` (172), `gallery-images.html` (149), `mr-snowmann.html` (72), `crosses.html` (69), `collaboration.html` (31). CollectionPage + BreadcrumbList JSON-LD, canonical, OG tags, full static figure grids. Wired from series-index.html, added to sitemap.xml, added to SW precache. Generator: `gen-theme-pages.py`.
- [x] **About page expansion** ✅ — strengthened meta description + opening bio paragraph with Cleveland, collage, assemblage, mixed-media keywords for Knowledge Panel signals. 2026-06-03.
- [x] **Static artwork pages** — All 1,084 `artworks/pages/artNNNN.html` rebuilt from redirect stubs to full static pages: artwork image, title, year, medium, description, palette, motifs, composition, theme/series links, prev/next strip, 4 related works, VisualArtwork + BreadcrumbList JSON-LD, canonical, OG tags. Sitemap updated to point to static pages. Generator: `gen-artwork-pages.py`.

### Performance
- [x] **Preload first-row artwork thumbnails** ✅ — `collage.html`, `photography.html`, `sculpture.html`, `painting.html`: first 4 imgs set to `loading="eager" fetchpriority="high"` + `<link rel="preload">` in head. 2026-06-04.
- [x] **Image lazy-loading fine-tune** ✅ — `archive.html` `renderCard` updated to `loading="eager" fetchpriority="high"` for first 8 cards on page 0. 2026-06-04.

### Features
- [x] **Decade page keyboard nav badge** ✅ — floating hint badge added to `_shared/ui.js`; shows decade names, fades after 4s or first arrow key. 2026-06-04.
- [x] **Timeline touch-scrub indicator** ✅ — added mobile-only "Drag to explore" hint badge that fades out on first drag 2026-06-03.
- [x] **Chromatic River click feedback** ✅ — white flash on tapped slice before navigation; ctx fetched fresh inside click handler. 2026-06-04.
- [x] **Companion suggestion chips** ✅ — updated to archive-specific prompts: Guernica, Mr. SNOWmann, targets/warplanes, 1970s, crosses, found objects, midwest winter, lost/undocumented. 2026-06-04.

### Content
- [x] **about.html exhibitions** ✅ — confirmed: generic names (Group Exhibition, Two-Person Exhibition, etc.) are accurate, not placeholders.
- [x] **lost.html SEO** ✅ — link was already present in about.html bio (line 230): "500–1,000 early pieces are gone — lost to water damage…" with href to lost.html.
- [ ] **featured.txt** — review which works are on the homepage. Last reviewed early 2026.

---

## 🟢 Nice to have, low urgency

### Physical
- [ ] **Print run of 12** — 12 prints of 12 works, numbered. Last item from the wow-factor backlog. Not a code problem.

### Architecture
- [x] **Offsite cloud backup** ✅ — rclone configured, B2 bucket `jfsn-archive` live. First sync complete: 6,664 files / 462MB. Run `bash cloud-backup.sh` each session. ~$0.50/month. 2026-06-04.
- [x] **Automated deploy after commit** ✅ — `end-session.sh` now prompts "Deploy to HostGator now? (y/N)" and runs `deploy.sh` if confirmed. Single command handles git + FTP. 2026-06-04.
- [x] **Static artwork pages** ✅ — all 1,084 `artworks/pages/artNNNN.html` are fully static (not redirect stubs): full image, metadata, JSON-LD, prev/next, related works. Generator: `gen-artwork-pages.py`.

### UX
- [x] **Search result thumbnails** ✅ — already implemented in search.js (`.sse-thumb` img in every result row); backlog item was stale.
- [x] **Archive sort by "recently added"** ✅ — sort dropdown added to archive.html header: Default / Oldest first / Newest first / Recently Added. JS `sortWorks()` handles all four. 2026-06-04.
- [x] **Artwork page: visible ← → navigation buttons** — reverted; user preferred clean image with no overlay buttons. Prev/next strip at bottom remains.

---

## ✅ Done (recent)

- [x] **SW hero black screen on index.html** — `art0953.avif` added to SW precache; dark warm fallback bg (`#1a1814`) on both mobile + desktop hero sections; CACHE_V bumped. Deploy required.
- [x] **Companion broken** — three fixes: model IDs updated to `claude-haiku-4-5` + `claude-sonnet-4-6` (was using wrong/dated strings); `budget_tokens` → `thinking: {type: 'adaptive'}` (was 400ing on Sonnet 4.6); `netlify.toml` syntax error fixed (`[edge_functions]` → `[[edge_functions]]` with path/function); `npm install` run in functions dir; Netlify redeployed. Confirmed working.
- [x] **Netlify stale** — site hadn't deployed since before the redesign. Fixed `netlify.toml` TOML syntax error that was blocking all deploys. Full prod deploy complete 2026-06-02.
- [x] **Artwork page ← → keyboard nav** — added `_prevHref`/`_nextHref` vars + keydown handler; shortcut now works after catalog loads
- [x] **Dead TERMS link** — `href="#"` on 11 pages (6 decade + about, artwork, companion, series-index, timeline) → now points to `privacy.html`
- [x] **Search button dead on 11 pages** — `search.js` missing from decade pages, chromatic, wall, constellation, guernica, privacy (fixed prior session)

- [x] Tailwind CDN (1.5MB) → built `site.min.css` (31KB)
- [x] Search button wired on all 13 Stitch pages
- [x] 1,084 static artwork pages (`artworks/pages/`)
- [x] sitemap.xml: 1,106 → 2,190 URLs
- [x] Canvas keyboard accessibility (constellation, chromatic, mosaic)
- [x] Mobile hero redesign — full-bleed, dark veil, CTAs, SCROLL
- [x] Skip-to-content on all 22 pages
- [x] All nav borders consistent (`border-deep-ink`)
- [x] Companion model name fixed (`claude-sonnet-4-6-20250514`)
- [x] CSP cleaned of stale CDN entries
- [x] Archive mobile filter touch targets raised to 44px
- [x] Canvas aria-labels, tabindex, focus rings, Escape handlers
- [x] LCP fix: first 4 thumbnails on decade pages now `loading="eager"`
- [x] Hero preload + fetchpriority on index.html
- [x] sw.js PRECACHE expanded from 8 → 21 URLs
- [x] STITCH.md prompt guide + auto-load hook
- [x] Daily automated backup via launchd

---

## How to use this list

Start each session: `Read CURRENT_STATE.md and IMPROVEMENTS.md — I want to work on [item].`

Add new ideas here any time. Move items to ✅ Done when shipped.
