# JFSN — Improvement List
**Updated:** 2026-06-02

A living list. Add to it. Cross things off. This is the backlog.

---

## 🔴 Do soon

- [ ] **index.html duplicate h1** — mobile and desktop sections each render an `<h1>`. Add `aria-hidden="true"` to the mobile one (it's visually hidden on desktop anyway). One-liner.
- [ ] **api.html — migrate off old dark system** — still loads `site.css` and uses dark CSS vars (`--muted`, `--dim`, `--accent`, `--font-display`). Last page on the old system. Once migrated, `site.css` can be deleted from both local and server. Medium effort — bespoke styles are mostly inline.
- [ ] **Delete `old-site/` locally** — 197MB of the pre-redesign site. Not deployed. Trash it. (`rm -rf /Users/jeffreyneumann/Documents/JFSN/old-site/`)
- [ ] **Delete `old-site/` on server** — leftover folder at jfsn.com/old-site/ with files like `ai-powered-solutions.html`, `automobile-designs.html` from previous tenant. Delete via FileZilla or cPanel File Manager.

- [ ] **Test Companion live** — open jfsn.com/companion.html on iPhone, type something, confirm a work comes back. Known untested since the redesign.
- [ ] **Test for-artists inquiry form** — go to `jfsn-archive.netlify.app/for-artists.html`, submit form, confirm redirect to `?sent=1#inquire` (form only works on Netlify, not HostGator)
- [ ] **Test timeline scrub on mobile** — drag the strip left/right on iPhone, confirm it scrolls through years (no touch handler found in code — may be CSS scroll only)
- [ ] **Google Search Console** — submit sitemap.xml if not done yet. sitemap now has 2,190 URLs including all 1,084 artwork pages.
- [ ] **Ingest new work** — drop photos into `artworks/inbox/`, run `bash add-works.sh`. Pipeline is ready.

---

## 🟡 High value, no deadline

### SEO
- [x] **Static theme pages** — 8 fully crawlable pages: `guernica.html` (232), `targets.html` (403), `framed.html` (230), `torsos-faces.html` (172), `gallery-images.html` (149), `mr-snowmann.html` (72), `crosses.html` (69), `collaboration.html` (31). CollectionPage + BreadcrumbList JSON-LD, canonical, OG tags, full static figure grids. Wired from series-index.html, added to sitemap.xml, added to SW precache. Generator: `gen-theme-pages.py`.
- [ ] **About page expansion** — more bio keywords in body text (Cleveland, mixed-media, assemblage) for Knowledge Panel signals.
- [x] **Static artwork pages** — All 1,084 `artworks/pages/artNNNN.html` rebuilt from redirect stubs to full static pages: artwork image, title, year, medium, description, palette, motifs, composition, theme/series links, prev/next strip, 4 related works, VisualArtwork + BreadcrumbList JSON-LD, canonical, OG tags. Sitemap updated to point to static pages. Generator: `gen-artwork-pages.py`.

### Performance
- [ ] **Preload first-row artwork thumbnails** — `collage.html`, `photography.html`, `sculpture.html`, `painting.html` should add `<link rel="preload">` for the first 4 visible thumbs.
- [ ] **Image lazy-loading fine-tune** — audit `loading="lazy"` on above-the-fold images on archive.html.

### Features
- [ ] **Decade page keyboard nav badge** — show "← 1980s | 1990s →" as a small floating badge on decade pages so keyboard nav is discoverable.
- [ ] **Timeline touch-scrub indicator** — add a visible drag handle or "drag to explore" hint for mobile users.
- [ ] **Chromatic River click feedback** — clicking a slice navigates to the artwork, but there's no visual tap feedback on mobile. Add a brief highlight.
- [ ] **Companion suggestion chips** — update the 3 example prompts to reflect the actual archive themes and series.

### Content
- [ ] **about.html exhibitions** — fill in real show details at ~line 184. Currently has 5 placeholder entries.
- [ ] **lost.html SEO** — link from about.html with a sentence about the lost works. Currently not discoverable unless you know it exists.
- [ ] **featured.txt** — review which works are on the homepage. Last reviewed early 2026.

---

## 🟢 Nice to have, low urgency

### Physical
- [ ] **Print run of 12** — 12 prints of 12 works, numbered. Last item from the wow-factor backlog. Not a code problem.

### Architecture
- [ ] **Offsite cloud backup** — all three current copies (MacBook, Time Machine, JEFFS-4TB) are in the same room. Add Backblaze B2 or iCloud Drive sync for the critical JSON files and HTML. Images are ~800MB — full cloud backup would cost ~$0.50/month on B2.
- [ ] **Automated deploy after commit** — currently: `bash end-session.sh` (git) then `bash deploy.sh` (FTP) manually. Could hook deploy.sh into end-session.sh or Netlify auto-deploy.
- [ ] **Static site generation for artwork pages** — `artworks/pages/artNNNN.html` currently does meta-refresh redirect. A proper SSG would render the full artwork page statically for Googlebot. Bigger project.

### UX
- [ ] **Search result thumbnails** — the ⌘K overlay shows titles/metadata but not the image thumbnail. Adding the thumb makes it much easier to recognize works.
- [ ] **Archive sort by "recently added"** — useful once new work is ingested. Currently sorts by ID (same as intake order) but could surface newest works explicitly.
- [ ] **Artwork page: adjacent work navigation** — ← / → arrows on desktop to move between works in the same series or decade.

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
