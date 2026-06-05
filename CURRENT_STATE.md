# Current State
**Updated:** 2026-06-05 11:25

## Last commit
(pending end-session.sh)

## What was done this session (2026-06-05 — session 2)

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
- Note: `p-[10px]` arbitrary Tailwind class won't rebuild cleanly — buttons use inline style instead; Tailwind build process needs a proper `@tailwind`-directive input file before next rebuild

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
- [ ] Review featured.txt / catalog-home.json — decade representation (SESSION_PROMPT item 2)
- [ ] Offsite cloud backup via Backblaze B2/rclone (SESSION_PROMPT item 3)
- [ ] Automated deploy: append deploy.sh to end-session.sh (SESSION_PROMPT item 4)
- [ ] Fix Tailwind build: create proper input CSS file with @tailwind directives so new utility classes can be compiled into site.min.css

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
