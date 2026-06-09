# Current State
**Updated:** 2026-06-09

## Last commit
fc117b52 — Session 22: oral history analysis, two essay drafts, checkpoint

## What was done this session (2026-06-09 — session 22)

### Documentation housekeeping + Allison handoff PDF regeneration

No new features. Cleanup session.

**Documentation fixed:**
- CURRENT_STATE.md: session number corrected (was "session 20"), stale known issue removed (favorites.html fetch size — resolved session 21), last commit updated
- CLAUDE.md: page inventory updated to 30 public pages (was "20"), seven theme pages added, start-here/favorites stale notes removed, site.min.css size corrected (23,071 bytes), ghost grid count corrected (10, not 25), nav links corrected
- Allison handoff PDF regenerated (was June 3, now current)

**Files modified:**
- `CURRENT_STATE.md` — session number, last commit, stale known issue
- `CLAUDE.md` — page inventory, site.min.css size, ghost grid count, nav links, stamp-nav.sh status
- `JFSN-Archive-Handoff-Allison.pdf` — regenerated via make_handoff.py

**Oral history work (sessions 20–21, same day):**
- Checkpoint validation of all documentation against project state
- Two first-person essay drafts written: "What Making Things Gave Me" (confirmed by Jeff as true) and "What Didn't Survive" (not yet confirmed)
- master-notes.md: Sections 13–16 added — drafts, analytical conclusions, elevated quotes, updated open questions
- Central finding: the archive is the survivor, not the complete record

## What was done last session (2026-06-09 — session 20–21)

### Deep legacy audits + oral history continuation

No code written. Preservation and oral history sessions.

**Audits completed:**
- Deep Legacy Audit Round 1: evaluated site as archivist/oral historian; identified top 10 missing stories, missing context, unanswered questions, and preservation priorities. Central finding: the site preserves the inventory of a creative life but not the person behind it.
- Deep Legacy Audit Round 2: identified 10 strongest themes, 10 most unusual aspects of Jeff's story, 10 statements future family would find surprising, 10 implicit ideas not yet stated, 10 assumptions future visitors won't share, 10 stories most at risk of being lost. Concluded the central human story is: a person trusted his own eye for fifty years without much external confirmation that he was right.
- Ranked the 10 most important things still unknown about Jeff. Most important single question identified: "What did making things give Jeff that he couldn't get elsewhere?"

**Oral history captured:**
- Jeff's position on incompleteness: *"Always have the option to add/subtract — could be unfinished till the end."* This is structural, not incidental.
- First specific lost work described in detail: CIA sculpture, late 1970s, prism paper on iron gridwork from a junkyard, magazine element, ~38"W × 24"T × 3–4"D, hung on wall, shown at student show, sold. No image exists. Someone has lived with it for ~50 years. Jeff doesn't know where it is.

**Files modified:**
- `docs/oral-history/master-notes.md` — Sections 11–16 added across sessions 20–22

## What was done previously (2026-06-08 — session 19)

### Oral history interview + start-here.html content review

Conducted a full content review of start-here.html from three perspectives (grandchild in 20 years, first-time visitor, friend of Jeff), identifying what was clear, confusing, personal, generic, and missing — with specific recommendations for what only Jeff can write. Ran an oral history interview session capturing Jeff's voice across topics: why he made things, found materials, the Guernica series, the water damage loss, who the archive is for, and the grandchildren collaboration. Draft paragraphs in Jeff's voice were produced for use on start-here.html, lost.html, and about.html. Confirmed favorites.txt — all 45 works kept, no changes.

## What was done last session (2026-06-08 — session 18)

### Homepage evolution — favorites, start-here, image treatment, mobile padding

- Added `favorites.txt` (45 art IDs), `favorites.html` (masonry grid of personally significant works), and `start-here.html` (orientation page: who Jeff is, major themes, how to explore). Both new pages include footer markers, JSON-LD, and sitemap entries.
- Corrected `_shared/ui.css` image hover treatment to final form: `::after` pseudo-element with `mix-blend-mode:saturation`, grey background, and `mask-image: linear-gradient(to bottom, black 0%, black 25%, transparent 100%)` — top 25% greyscale, fading to full colour at bottom; hover removes overlay. `.thumb__link` has `isolation:isolate` + `position:relative`. Title turns orange via `.thumb:hover .thumb__caption a`.
- Fixed mobile text edge-bleed on all 12 medium/theme pages (collage, sculpture, photography, painting, guernica, targets, framed, torsos-faces, crosses, mr-snowmann, gallery-images, collaboration): added `padding-left/right: clamp(1rem, 4vw, 4rem)` to `.medium-page`.

## What was done last session (2026-06-08 — session 17)

### Image hover effect + sw.js fix
- Fixed `build_catalog.py` sw.js CACHE_V bump: now only increments when catalog.json content actually changes, eliminating noisy git diffs on no-op runs.
- Implemented sitewide image hover effect: thumbnails show full color at the bottom fading to grey at the top via a `mix-blend-mode: saturation` `::after` overlay with a gradient mask; hover removes the overlay for full color. Applied via `_shared/ui.css` (`.thumb__link`) and `index.html` homepage cards. CLAUDE.md updated to document the new permitted treatment.

## What was done last session (2026-06-07 — session 16)

### Footer, nav, and lost.html overhaul
- Footer redesigned sitewide: portrait image with radial glow added to col 1, Companion moved to footer-only (removed from desktop nav and mobile drawer on all 26 Stitch pages + 6 decade pages), nav columns top-aligned with padding-bottom, pb-28 bottom breathing room, Lost Works added to decade page Explore lists, stale Terms link removed from decade footers.
- lost.html redesigned to match about.html layout: two-column hero with `Lost.` display heading + essay left, trash-can photo right (artwork-in-trash-can.jpg, desaturated/cropped), second essay section with sidebar archive links, ghost grid reduced from 25 to 10 tiles.
- Mobile drawer updated sitewide: portrait image (50%, centered) added above Search Archive button; nav-active.js cleaned up (companion.html removed from PAGE_NAV).

## What was done last session (2026-06-07 — session 14)

### Workflow automation + session prompt cleanup
- Simplified end-session workflow: JFSN.app now launches automatically from end-session.sh (no more manual double-click); memory prompt reduced to just "Update memory."
- Revised session start/end prompts to match new workflow; updated jfsn_session_prompts.md memory file.
- deploy.sh + backup.sh + cloud-backup.sh restored after accidental deletion; all three documented as required (do not delete).

## What was done last session (2026-06-07 — session 13)

### Cleanup, sitemap fix, audit improvements
- Deleted 12 stale files: empty jsons, one-time migration scripts, legacy deploy/backup scripts, test file; all superseded by current workflow.
- Fixed sitemap: 1,092 → 1,124 URLs — added lost.html, chromatic.html, wall.html, all 6 decade pages, all 4 medium pages, 8 theme/series deep-dive pages that were missing since creation.
- Added reverse sitemap check to audit-nav.sh (now 11 checks) — catches any future page added without a sitemap entry; documented new-page checklist in CLAUDE.md, README.md, and build_catalog.py; fixed index.html mobile skip-to-content (#main target was desktop-only).

## What was done last session (2026-06-06 — session 12)

### Homepage polish + a11y + UX
- Replaced minimal one-liner footer with full shared 4-column footer (matching all other pages); added footer underline-draw styles inline.
- Added visually-hidden `<h1>`, promoted "Selected Works" `<p>` to `<h2>`, fixed generated card alt text to include year, added "View all 1,084 works →" CTA on both desktop and mobile, added `folio-art-link` cursor/orange-outline treatment to 3 mobile folio art links, shuffled uniform grid (cards 4–30) on each load while keeping editorial top 3 fixed.
- Regenerated Allison handoff PDF (no content changes — date refresh only).

## What was done last session (2026-06-06 — session 11)

### Hero AVIFs + CSP fixes
- Fixed hero 404s on jfsn.com: `.htaccess` rewrites `artworks/full/*.avif` → `/artworks/*.avif` (legacy flat dir); hero crops must be uploaded to `/artworks/` on server. Uploaded art0953/1008/1009/1010-hero.avif to correct path — all return 200.
- Fixed GoatCounter CSP violations: added `gc.zgo.at` to `script-src` and `jfsn.goatcounter.com` to `connect-src` in `.htaccess`. Analytics now unblocked on jfsn.com.
- Documented hero upload path gotcha in README.md and CLAUDE.md.

## What was done last session (2026-06-06 — session 10)

### Homepage polish + full docs overhaul
- Orange hover frame on homepage cards fixed: replaced `outline` (hidden behind absolute-positioned image) with `.card-frame` overlay div at `z-index:2`; spacing improved `mt-4` image→title, `mt-16` between editorial and 4-col grid
- `README.md` completely rewritten as a human-readable master reference covering pages, architecture, design system, workflow, scripts, gotchas, and hosting
- All `.md` files audited across 4 passes — fixed stale facts: grayscale rule in STITCH.md, nav count (4→5), site.min.css size, deleted page references, Companion function type, theme count (14→10), retired series (XXIII/Squadron), repass completion status; added docs check reminder to `end-session.sh`

## What was done last session (2026-06-06 — session 9)

### Hero rotator refinements (index.html, _shared/top-nav.html → stamped sitewide)
- Touch swipe on mobile hero (40px threshold, both hero sections)
- Sequential cycle replacing random: `(idx+1) % n`; MAX_SLIDES reduced 4→3 so one slide rotates out per visit
- Mobile `-mobile.avif` crop removed — always uses `-hero.avif`; mobile preload ref cleaned up
- Interval extended 6000→8000ms so Ken Burns 7s animation fully completes before crossfade
- Keyboard ArrowLeft/ArrowRight advance hero; guarded against firing in input/textarea
- Caption hover cue: underlines + brightens to full white on hover
- JFSN wordmark tooltip sitewide: hover shows "Jeffrey Francis Stanley Neumann" in a small bordered label; CSS-only, stamped into all 26 pages via `stamp-nav.sh`
- Sitewide image micro-interactions: `cursor: zoom-in`, orange outline on hover, `brightness(1.04)`, focus ring — applied via `_shared/ui.css` (`.thumb__link`) and inline `<style>` on index.html and archive.html
- Homepage featured grid: dominant color mats from `chromatic.json` (30% blend), split into editorial (#featured-grid, 3 cards) + uniform (#featured-grid-small, 27 cards), title→orange on hover, metadata reordered (title first)

## What was done last session (2026-06-06 — session 8)

### Hero rotator — full UX overhaul (index.html, artworks/featured-hero.txt)
Built a complete hero system: Ken Burns zoom-out effect (4 direction variants, 1.04× scale, 7s, data-kb attribute per slide), crossfade scrim for caption legibility, pause on hover, ‹ › arrows, dot indicators, aria-live on captions, next-slide preload, and caption sync to crossfade midpoint. Slides are now generated dynamically from `artworks/featured-hero.txt` — add a line to the file to expand the hero pool without touching HTML. Fixed KB animation re-trigger bug (reflow reset), reduced scale from 1.07→1.04 to eliminate pop at transition seam.

## What was done this session (2026-06-05 — session 7)

### Nav underline draw sitewide + mobile drawer polish
- Header nav underline CSS embedded in `top-nav.html` so it reaches every stamped page (was only on ui.css pages). Underline repositioned from `bottom:6px` to `bottom:10px` — now sits just below the text baseline on "Archive", "Series", etc.
- Mobile drawer upgraded to match desktop: hover + tap underline draw, active-page orange text + 3px left bar via `.drawer-active` class, tap flash on `:active`. Fixed z-index conflict with archive filter bar (overlay 40→45). Lost Works bars on homepage switched to `px-4 md:px-margin-desktop` so mobile gets 16px padding instead of 64px.

## Previous session (2026-06-05 — session 6)

### Nav + footer underline polish (_shared/ui.css, nav-active.js)
- Header nav links get a left-to-right orange underline draw on hover (0.2s), stays solid on the active page via `.nav-underline-active`; `lost.html` added to the `PAGE_NAV` map so the Lost link activates correctly.
- Footer links get the same gesture at 1px height; email link exempted to avoid double-underline; stamped into all 26 pages via `stamp-nav.sh`.

### Featured grid image fade (index.html)
- Lazy-loaded thumbnails now fade in at `opacity 0.4s` via `onload` → `.is-loaded` rather than popping in; `prefers-reduced-motion` shows them instantly; hero image unaffected.

### Featured grid title size (index.html)
- Card titles changed from `text-headline-md` (28px Playfair) to `font-label-lg text-label-lg uppercase` (14px Inter) — now matches archive page thumbnail labels.

## Previous session (2026-06-05 — session 5)

### Lightbox on artwork pages (artwork.html)
- "Full resolution" link replaced with a button that opens a full-screen overlay — no new tab, no navigation away
- Controls: rotate CW/CCW, flip H/V, reset, close (✕ button, Escape key, or backdrop click)
- Fixed inline `style="display:none"` conflict with CSS class toggle by removing it from the div; CSS `#lr-overlay { display:none }` handles initial state

## Previous session (2026-06-05 — session 4)

### Lost Works wired into site
- Added Lost as 5th nav link sitewide (desktop + mobile drawer) — stamped into all 26 pages
- Homepage: Lost Works full-width bar between featured grid and footer (desktop + mobile)
- about.html: Lost Works bar between contact section and Exhibition Record
- about.html: contact section moved above Exhibition Record

### about.html cleanup
- Section order: about-hero → contact → Lost Works bar → Exhibition Record
- Removed duplicate skip-to-content link from changes.html
- Removed stale link to changes.html from jeff.html tool grid

### Homepage and nav polish
- Hero caption added bottom-left: "XXXIII Días Installation View · 2022 · COLLAGE"
- Companion desktop nav tooltip: `title="Ask the archive — AI search"`
- featured.txt rebalanced: 30 works across all decades, varied medium per era; catalog-home.json rebuilt

## Previous session (2026-06-05 — session 3)

### Email replaced sitewide (33 files)
- `jfsneumann@gmail.com` → `jeff@jfsn.com` in all `mailto:` hrefs and visible link text
- Covered `_shared/footer.html`, `about.html`, all 6 decade pages, `index.html`, `privacy.html`, and all remaining stamped pages

### Removed for-artists reference (about.html)
- Deleted "I also build archives for other artists" sentence/link — gone, no trace

### Homepage featured grid expanded (index.html)
- Removed hardcoded `FEATURED_IDS` array (3 works); grid now renders all 30 works from `catalog-home.json`
- Cards 1–3 keep existing asymmetric layout (7-col / 5-col / 5-col)
- Cards 4+ fall into uniform 4-column grid (`col-span-3` each)

### Fixed card 4+ height containment (index.html)
- Root cause: `grid-auto-rows: 80px` with no explicit row span on cards 4+, causing metadata to overflow into next card
- Fix: `nth-child(n+4)` now claims `grid-row: span 5` (5×80px=400px) and is `flex-col`
- `flex:1` on `.card-img` scoped to cards 1–3 only; cards 4+ use natural `aspect-[3/4]`

### Tailwind build fixed (tailwind.config.js + site.min.css)
- `input.css` already existed with `@tailwind` directives; `npm run build:css` confirmed working
- Added `_shared/*.js` to content scan so dynamically-added classes (e.g. `text-international-orange` in `nav-active.js`) are always included
- `site.min.css` rebuilt at 22,974 bytes (was stale at 31,664 bytes from deleted pages / dark-era classes)

## Previous session (2026-06-05 — session 2)

### Archive sort: "Recently Added" (archive.html)
- Moved `id_desc` option to first position in sort dropdown
- Label updated to title case: "Recently Added"
- Sort logic (`parseInt(b.file) - parseInt(a.file)`) was already correct — no JS changes needed

### Featured works grid spacing (index.html)
- Grid gap: `gap-gutter` (24px) → `gap-x-6 gap-y-8` (24px horizontal, 32px vertical)
- Card image wrapper: added `p-3` (12px) — mat-frame breathing room inside bone slab
- No change to aspect ratios, work order, or which works are shown

### Nav touch targets (sitewide — _shared/top-nav.html + stamp-nav.sh)
- Desktop nav links: added `py-3` → 44px tall (was 20px)
- Search button: added `style="padding:10px"` → 44×44 (was 24×24)
- Hamburger button: added `style="padding:10px"` → 44×44 (was 24×24)
- Drawer close (×): padding `8px` → `10px 14px`, margin-right adjusted → ~44×52
- Drawer search button: padding `10px 14px` → `12px 14px` → 44px tall
- Stamped into all 26 pages via stamp-nav.sh

### Previous session (2026-06-05 — session 1)
### Active filter demote (archive.html)
- Mobile filter buttons: orange active state (`text-on-tertiary-container`, `border-on-tertiary-container`) → weight+underline (`font-semibold`, `text-on-surface`, `border-on-surface`)
- "CLEAR ALL FILTERS" button: `text-on-tertiary-container` → `text-secondary`
- Orange now reserved for hover only; active selection reads via weight + near-black underline

### Playfair Display → Inter audit (sitewide)
- JFSN wordmark (desktop nav + mobile drawer + footer): `font-headline-md` → Inter across all 31 pages via `_shared/top-nav.html` + `_shared/footer.html` → stamp-nav.sh
- Decade pages (1970s–2020s): desktop nav + footer wordmarks swapped directly (×6)
- `changes.html`: `.ch__title`, `.ch__intro`, `.ch-entry__title` → Inter
- `series.html`: `.thumb__caption` → Inter
- `companion.html`: `--c-font-display` → Inter; `.c-title` pinned to Playfair explicitly (KEEP)
- `about.html`: Exhibition Record h2 + 6 exhibition title entries → Inter; bio paragraph (KEEP)
- `chromatic.html`: stat values (1,084 · years · mediums) → Inter
- `artwork.html`: work title h1 → Inter
- `index.html`: folio + homepage grid artwork title classes → Inter
- `series-index.html`: JS card title classes → Inter (+ added `font-semibold`)
- `api.html`: `.stat-val` + page h1 → Inter
- Playfair remains only on: decade page heroes, `about.html` name h1 + bio paragraph, `series-index.html` h1, `series.html` + medium-page `.series-title` / `.medium-page__title`, `companion.html` `.c-title`

### Featured works card metadata (index.html)
- Mobile folio: year+medium stacked below title as single line (`1977 · PHOTOGRAPH`) with `mt-2` breathing room; removed flex justify-between
- Desktop grid: medium line `mt-1` → `mt-2`

## To do next session
- [ ] Test Companion live on iPhone (https://jfsn-archive.netlify.app/companion.html)
- [ ] Begin capturing physical dimensions for surviving works (requires Jeff)
- [ ] Auto-patch `search.js` hard-coded series counts via `build_catalog.py` (next ingest session)
- [ ] Enable HSTS in `.htaccess` (verify HostGator SSL is active in cPanel first)

## Known issues (standing)
- **sw.js CACHE_V** — `build_catalog.py` auto-bumps only when catalog content changes. If you edit HTML/CSS/JS without rebuilding the catalog, bump CACHE_V manually before deploying.
- **index.html has no FOOTER:START marker** — custom homepage footer, not stamped. Edit directly if footer changes.
- **Decade pages not in stamp-nav.sh** — edit 1970s–2020s.html directly for any nav/footer changes.
- **about-portrait.jpg** — only JPEG in the asset pipeline; all artworks are AVIF. Low priority.
- **No physical dimensions in catalog** — `build_dims.py` is a layout utility (reads pixel dimensions from thumbnails for masonry grid; now run, dims.json committed). Physical artwork dimensions (inches/cm) are a separate gap — no tooling exists yet. These are essential archival data for works that will be distributed to heirs.

---

## Site is live at
- jfsn.com  (primary — cPanel)
- jfsn-archive.netlify.app  (secondary — Netlify, has Companion function)

## Archive stats
- 1084 works cataloged, 0 errors

## Backup status
**Last B2 backup:** 2026-06-09 13:19:02
