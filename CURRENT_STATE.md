# Current State
**Updated:** 2026-06-05

## Last commit
47052b7 — Add hover underline draw to mobile drawer links

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
- [x] ~~Review featured.txt / catalog-home.json — decade representation~~ — done 2026-06-05 session 4
- [ ] Offsite cloud backup via Backblaze B2/rclone

## Known issues (standing)
- **sw.js CACHE_V** — `build_catalog.py` auto-bumps on every run. Check `git diff sw.js` before committing after any script run.
- **index.html has no FOOTER:START marker** — custom homepage footer, not stamped. Edit directly if footer changes.
- **Decade pages not in stamp-nav.sh** — edit 1970s–2020s.html directly for any nav/footer changes.
- **about-portrait.jpg** — only JPEG in the asset pipeline; all artworks are AVIF. Low priority.

---

## Site is live at
- jfsn.com  (primary — cPanel)
- jfsn-archive.netlify.app  (secondary — Netlify, has Companion function)

## Archive stats
- 1084 works cataloged, 0 errors
