# JFSN Archive — Claude Code Design Brief

> **Primary guiding document:** `JFSN-MISSION.md` — read it before making any significant development or content decision.

## Project
Personal archive site for Jeffrey F. S. Neumann — 1,084 works spanning 1974–present.
Collage, sculpture, photography. This is a personal record, not a promotional platform.
Making is the point.

Live: jfsn.com (cPanel/HostGator) and jfsn-archive.netlify.app (Netlify, has Companion Netlify Function + artwork-meta edge function)

---

## Design System (current — Stitch/Tailwind, light)

The site was fully redesigned in May 2026 from a dark system to a light system. All pages are on the light system. `site.css` has been deleted — do not reference it or the old dark tokens.

### Token reference (two configs in use)

**Stitch pages** (collage, sculpture, photography, painting, lost, etc.):
```js
colors: {
  "background":             "#fcf9f3",   // bone-white page bg
  "deep-ink":               "#0B0B0B",   // primary text
  "archive-gray":           "#575757",   // secondary text / labels
  "international-orange":   "#FF6600",   // accent — hover/focus/active states, fills, borders, and text ON DARK backgrounds only (6.7:1 there). Fails WCAG AA (2.79:1) as persistent text on light bone-white/white backgrounds.
  "orange-ink":             "#B84700",   // accessible orange (5.07:1 AA) — use for ANY persistent (non-hover) orange TEXT on a light background: eyebrow labels, bracket links, nav active-states. Added session 46 (accessibility pass) after an audit found international-orange text failing contrast sitewide.
  "outline-variant":        "#c4c7c7",   // neutral border (still valid)
  "archival-outline":       "#8e7164",   // warm-brown archival border (Stitch June-2026 — adopted)
  "archival-outline-soft":  "#e3bfb1",   // warm-brown soft border / divider
  "surface-container-high": "#ebe8e2",   // footer bg
  "bone-white":             "#F3F0EA",   // mobile nav bg
}
// paper-shadow: 0 0 20px rgba(0,0,0,0.05)  — soft diffused card shadow (Stitch June-2026 — adopted; soft only, never heavy)
```

**Material Design pages** (decade pages 1970s–2020s, archive.html):
```js
colors: {
  "background":             "#fdf8f8",
  "primary":                "#000000",
  "secondary":              "#5e5e5e",
  "on-tertiary-container":  "#e05900",   // accent (orange)
  "outline-variant":        "#c4c7c7",
  "surface-container-high": "#ebe7e6",
  "on-surface":             "#1c1b1b",
  "on-surface-variant":     "#444748",
}
```

### Typography
- **Headings:** Playfair Display (400–700)
- **UI / labels:** Inter (400–600), ALL CAPS, letter-spacing 0.1em
- **Display:** `font-display-lg` = 64px, tracking -0.02em, weight 700
- **Body:** Inter 16px / 18px

### Visual rules
- **Foundation colors:** bone-white/light backgrounds (#fcf9f3), deep-ink text (#0B0B0B), orange accents (#FF6600 / #e05900)
- **Accessibility:** WCAG AA contrast minimum on all persistent text. Test text/background pairs before shipping.
- **Data integrity clause (NON-NEGOTIABLE):** Never ship fabricated provenance / accession numbers, invented badges, fake DPI/resolution, fabricated quotes, or composite images presented as real exhibitions. Years stay decade estimates; composites stay flagged. Design can evolve; data stays honest.

### Design is open
All visual constraints have been removed. You now have full creative control:
- ✅ Gradients, rounded corners, shadows, filters — all available
- ✅ Hover scales, transforms, overlays, scroll-reveals — all available
- ✅ Grayscale, sibling dim, skeleton loaders, particles — all available
- ✅ Typography, spacing, layering, color — experiment freely

**Apply judgment:** Does it serve the work? Does it help users navigate or understand the archive? If yes, ship it. The only non-negotiable rule is data integrity.

---

## Stitch workflow

When Jeff mentions Stitch, a new page, or a design export — read `STITCH.md` first.
It contains the full prompt template, design system values to paste, and the post-export
checklist. Never use a Stitch export directly; extract layout/interactions and apply to
real HTML. Key rule: nav must be marked `<!-- NAV:START -->` / `<!-- NAV:END -->` for
`stamp-nav.sh`, and the Tailwind build must be run after adding new pages.

---

## Architecture

### Key files
- `_shared/top-nav.html` — canonical nav for Stitch pages (stamp-nav.sh)
- `_shared/ui.css` — shared styles: thumbnail interactions, nav underlines, page labels, animations
- `_shared/ui.js` — keyboard nav (← / → decade pages), vertical "you are here" label
- `_shared/nav-active.js` — auto-sets orange active link by pathname
- `stamp-nav.sh` — stamps nav into all Stitch pages (NOT decade pages — different token system). **New pages must be added to the TARGETS array manually** — they are not auto-discovered.
- `favorites.txt` — one art ID per line; lines starting with `#` ignored. Parsed by `build_catalog.py` → sets `favorite: true` on matching records in catalog.json. Add an ID here + rebuild catalog to include it on favorites.html.
- `catalog.json` — all 1,084 works, generated by `artworks/build_catalog.py`
- `chromatic.json` — per-work dominant color data (year / title / bgcolor / id), used by chromatic.html
- `deploy.sh` — FTP upload to HostGator (legacy — deploy via desktop JFSN.app instead)
- `end-session.sh` — git commit + push + backup (does NOT deploy)
- `make_handoff.py` — regenerates Allison handoff PDF; run after any credential change

### Page inventory (31 public pages)
| Page | Notes |
|------|-------|
| `index.html` | Homepage, featured works from catalog-home.json |
| `archive.html` | 1,084 works, filters by medium/decade/series |
| `artwork.html` | Single work, loaded by `?id=artNNNN` |
| `series-index.html` | Guernica + 7 themes |
| `companion.html` | AI companion (Netlify Function — `netlify/functions/companion.mjs`) |
| `about.html` | Bio, exhibitions, contact |
| `lost.html` | Essay + ghost grid of 10 tiles |
| `chromatic.html` | Color-slice canvas of all works by year |
| `collage.html` | 638 works, masonry grid |
| `sculpture.html` | 76 works |
| `photography.html` | 328 works |
| `painting.html` | 42 works |
| `1970s.html`–`2020s.html` | 6 decade pages, Material Design tokens, ← / → keyboard nav |
| `series.html` | Single series deep-dive |
| `guernica.html` | 232 Guernica works, static theme page |
| `targets.html` | Targets theme page |
| `framed.html` | Framed theme page |
| `torsos-faces.html` | Torsos & Faces theme page |
| `crosses.html` | Crosses theme page |
| `mr-snowmann.html` | Mr. SNOWmann theme page |
| `gallery-images.html` | Gallery Images theme page |
| `collaboration.html` | Collaboration theme page — grandchildren + family work |
| `wall.html` | 1,084 mini images, all full color, no sibling dim |
| `curatorial-map.html` | All 1,084 works in a decade × medium grid, with theme filter chips (session 45) |
| `api.html` | Developer API docs, light system |
| `changes.html` | Git log feed |
| `privacy.html` | Privacy page |
| `404.html` | Error page |
| `start-here.html` | Orientation page — who Jeff is, major themes, how to explore. In stamp-nav.sh. |
| `favorites.html` | 45 personally significant works from favorites.txt. Fetches catalog-lite.json. In stamp-nav.sh. |

### Interactions (live)
- Orange outline on hover: `_shared/ui.css` `.thumb__link` — `outline-color` transition from `rgba(255,102,0,0)` → `#FF6600`. Homepage cards use `.card-frame` overlay div instead (image is `absolute inset-0` and covers CSS outline)
- Keyboard ← / → between decade pages: `_shared/ui.js`
- Vertical "you are here" margin label: `_shared/ui.js` + `data-page-label` on `<body>`
- Hero heading zoom-out on scroll: `_shared/ui.js` `.decade-hero` / `.decade-heading`
- Ghost grid (lost.html): 10 JS-generated empty tiles
- Chromatic River (chromatic.html): HiDPI canvas, 1,084 color slices, hover + click
- Wall (wall.html): 1,084 tiles, all color, no sibling dim (removed session 10)

### Nav systems (two, keep separate)
1. **Stitch nav** (`_shared/top-nav.html`) — `font-nav-link`, `text-deep-ink`, `international-orange` hover. Used by collage, sculpture, photography, painting, lost, etc. Nav links: Archive · Series · About · Lost. (Companion is footer-only — not in nav.)
2. **Material Design nav** (inline on decade pages) — `font-label-lg`, uppercase, `text-on-tertiary-container` active. Used by 1970s–2020s.

### Deployment
- `bash end-session.sh` — git commit, push to GitHub, rsync backup to external drive
- Deploy to HostGator via desktop JFSN.app (not deploy.sh)
- Deploy the **Netlify mirror** via `bash deploy-netlify.sh` (`--check` = dry safety scan → default = draft/preview → `--prod` = live). It builds a curated staging copy + refuses to deploy if any `docs/`/`.ftp.env`/`*.py`/`*.sh`/`*.pdf`/`*.md` slipped in — the guardrail against the 2026-06 credential-exposure failure mode. Netlify has NO git integration.
- `build_catalog.py` writes the api JSON + feed.xml through `_write_stable` — they are NOT rewritten when only the `generated`/date timestamp would change. If you see those files *not* updating on a no-content build, that's intentional (kills git churn / end-session residuals), not a bug.
- Service worker: `sw.js` — bump `CACHE_V` whenever deploy may be cached by old SW
- **Hero AVIF upload path:** `.htaccess` rewrites `artworks/full/*.avif` → `/artworks/*.avif` (legacy flat dir). New hero crops (`artNNNN-hero.avif`) must be uploaded to `/artworks/` on HostGator — NOT `/artworks/full/`. Use lftp: `put artNNNN-hero.avif -o /artworks/artNNNN-hero.avif`
- **`api/.htaccess` is auto-generated:** `build_catalog.py` overwrites it on every run. Edit the `htaccess` template string in that script — never the file directly. Do NOT add `SecFilterEngine`/`SecRuleEngine` — they cause HTTP 500 on HostGator.
- **`catalog-lite.json` fields:** `file, title, year, work_type, themes, keywords, motifs, description, series, favorite, featured, orientation, composite, year_precision, year_display` (`orientation` = vertical/horizontal/square from `dims.json`, session 35; `composite`/`year_precision`/`year_display` = provenance fields, session 36). Source of truth is `LITE_FIELDS` in `build_catalog.py`. Don't add fields without checking what `search.js` and the Netlify edge function actually use.
- **Provenance fields (session 36, set in `build_catalog.py` after the records sort):** `year_precision` is `'estimated'` for ALL works and `year_display` is the decade-bucket form `"1990s (est.)"` — every catalog year is a decade estimate (creator-confirmed), so artwork pages + API show "1990s (est.)", never a hard year. `composite` is `True` for the ~250 "imagined placement" works (rule: Gallery theme OR Studio theme OR a placement-language title via `PLACEMENT_RE`) — these are Photoshop composites, NOT real single works/exhibitions (master-notes §22/§25); artwork pages show an "Image — Photoshop composite — imagined placement" meta row. To change the composite set, edit the rule/`PLACEMENT_RE` and rerun `build_catalog.py` + `gen-artwork-pages.py`. NOTE: grid/search/favorites captions still show the bare decade year (e.g. "1990"); only the artwork detail pages + API carry the "(est.)" label.
- **`artworks/pages/` regen:** `python3 gen-artwork-pages.py` rebuilds all 1,084 static pages. All include `search.js` + `nav-active.js` as of session 11. Use `--limit 5` to test template changes first.
- **New page checklist:** When adding any new public `.html` page: (1) add to sitemap entries list in `build_catalog.py`, (2) run `python3 artworks/build_catalog.py` to rebuild sitemap, (3) add to TARGETS array in `stamp-nav.sh` so future nav updates propagate to it, (4) run `bash audit-nav.sh` — the reverse sitemap check will catch if it's missing from the sitemap.

### Global Design System Reference
- **Keyboard shortcut:** ⌘Shift+D (Mac) or Ctrl+Shift+D (Windows/Linux) opens a full-screen modal with the complete design system
- **Footer button:** All pages show ⌘SHIFT+D in the footer — click to open the modal
- **Contents:** Colors with contrast ratios, typography (Playfair/Inter), spacing scale, animation timing, design tokens, z-index scale, copy-paste code snippets, accessibility rules
- **Search:** Sidebar search filters sections in real-time (Principles, Colors, Typography, Spacing, Animations, Design Tokens, Code Snippets, Accessibility)
- **Navigation:** Click a sidebar link to jump to that section; active link highlights on scroll
- **Esc to close:** Press Esc or click the backdrop to close
- **Always stamped:** The modal is built into `_shared/top-nav.html` and stamped to all 38 pages by `stamp-nav.sh`, so it's available everywhere for continuous UX/UI reference and refinement

### Conventions
- Vanilla HTML/CSS/JS. Production uses `site.min.css` (23,071 bytes compiled Tailwind — not CDN). Stitch exports start with Tailwind CDN and get swapped to `site.min.css` during post-export cleanup.
- **Tailwind rebuild rule:** Any time a new utility class is added to any HTML file, run `npm run build:css` and commit the updated `site.min.css`. Classes not in the build are silently ignored at runtime — there is no error, just a missing style.
- **No arbitrary values:** Never use `p-[10px]` when a standard scale value exists (`p-2.5` = 10px). Arbitrary values require a rebuild and pollute the class list. Check the spacing scale in `tailwind.config.js` first.
- `loading="lazy"` on all artwork images
- `prefers-reduced-motion` respected in all transitions (in `_shared/ui.css`)
- `aria-current="page"` on active nav link (set by nav-active.js)
- Mobile nav is a **hamburger button → slide-in drawer** (`#mobile-menu-drawer` in `_shared/top-nav.html`), NOT a fixed bottom tab bar. Drawer links (Archive/About/Stories/Lost) carry inline feather-SVG icons as of session 35; edit the source then run `bash stamp-nav.sh` to propagate to all 31 pages.

---

## Content philosophy
- Archive first — every decision serves the work, not the designer
- No calls to action, no newsletter signups, no engagement patterns
- Descriptions are spare — year, medium, dimensions if known
- This is a personal record, not a promotional platform. Don't suggest outreach.

## UX priorities
1. The image is the primary object — UI recedes
2. Fast load (1,084 items — lazy load, AVIF, service worker cache)
3. Filter/search must be instant-feeling
4. Mobile: iPhone 15 Pro is the primary test device
5. Accessibility: WCAG AA contrast, keyboard nav, screen reader labels
