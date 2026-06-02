# JFSN — Improvement List
**Updated:** 2026-06-02

A living list. Add to it. Cross things off. This is the backlog.

---

## 🔴 Do soon

- [ ] **Test Companion live** — open jfsn.com/companion.html on iPhone, type something, confirm a work comes back. Known untested since the redesign.
- [ ] **Test for-artists inquiry form** — go to `jfsn-archive.netlify.app/for-artists.html`, submit form, confirm redirect to `?sent=1#inquire` (form only works on Netlify, not HostGator)
- [ ] **Test timeline scrub on mobile** — drag the strip left/right on iPhone, confirm it scrolls through years (no touch handler found in code — may be CSS scroll only)
- [ ] **Google Search Console** — submit sitemap.xml if not done yet. sitemap now has 2,190 URLs including all 1,084 artwork pages.
- [ ] **Ingest new work** — drop photos into `artworks/inbox/`, run `bash add-works.sh`. Pipeline is ready.

---

## 🟡 High value, no deadline

### SEO
- [ ] **Series page URLs** — `/series.html?theme=Targets` is JS-only. Generate static `targets.html`, `torsos.html` etc. from `catalog.json` for direct Google indexing.
- [ ] **About page expansion** — more bio keywords in body text (Cleveland, mixed-media, assemblage) for Knowledge Panel signals.
- [ ] **artwork.html JSON-LD in static shell** — JSON-LD is currently JS-injected per work. Static shell has no JSON-LD so server-side scrapers that don't execute JS see nothing. The 1,084 `artworks/pages/` redirect pages each have proper JSON-LD — this is the real fix path (generate full static pages instead of redirect stubs).
- [ ] **index.html duplicate h1** — mobile and desktop sections each render an h1 ("Five Decades of Making"). Not a ranking penalty but worth cleaning: hide one with `aria-hidden` or consolidate to a single h1 visible in both contexts.

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
