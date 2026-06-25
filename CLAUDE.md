# JFSN Archive — Claude Code Design Brief

> **Primary guiding document:** `JFSN-MISSION.md` — read it before making any significant development or content decision.

> **The guiding question** (from JFSN-MISSION.md):
>
> *"Will this help a future grandchild understand Jeff and his life better?"*
>
> Every addition, improvement, or change is tested against that question first. If the answer is yes, it's likely worth doing. If the answer is no, it's lower priority. The litmus below is the operational test the guiding question expects you to run.

> **The litmus** — before adding any interaction, animation, dependency, or page:
> 1. Does it help someone understand Jeff and his work — *or* is it Jeff's own craft? (He is a web/motion designer and animator with 40 years of practice. Motion is part of who he is, not decoration bolted on.)
> 2. **Is the work itself still shown honestly?** Never filter, recolour, crop-distort, or tilt the artwork; never hide its title/year/medium behind a hover (it vanishes on touch and for screen readers); no fabricated provenance, badges, or composites-as-real.
> 3. Will a maintainer in 20 years thank you for it — one considered move, not five sloppy ones?
>
> **Point 2 is the hard rail, and it is about the *work and the viewer* — that line does not move.** Points 1 and 3 are craft, and the craft is Jeff's: animate *around* and *between* works freely; just don't animate away the truth of a piece. "Restraint" here means a motion designer's restraint — impeccable timing, one gesture that earns its place — **not** minimalism, not an empty page, not "default to removal." When Jeff is directing the design, his intent is the brief. This document is the floor that protects the *work*; it is not a cap on the *design*.

## Project
Personal archive site for Jeffrey F. S. Neumann — 1,084 works spanning 1974–present.
Collage, sculpture, photography. This is a personal record, not a promotional platform.
Making is the point.

Live: jfsn.com (cPanel/HostGator) — the only host. Netlify (secondary mirror) and the Companion AI chat feature it hosted were removed 2026-06-22.

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

### Design is open — Jeff's craft, with the work protected
Jeff is a web/motion designer and animator with 40 years of practice. Motion and design are part of how the maker of this archive thinks — not ornament added after the fact. The full toolkit is his: timelines, staggers, transitions, scroll-reveals, parallax, transforms, type, colour. **anime.js** (https://animejs.com) is the chosen library for choreographed motion.

Two things stay true no matter how expressive the design gets:

1. **The work is shown honestly.** Never filter, recolour, crop-distort, or tilt the artwork itself; never gate its title/year/medium behind a hover; never fake provenance, badges, or composites-as-real. Animate *around* and *between* works freely — don't animate away the truth of a piece. (This is why Session 78 was right to cut the brightness/saturate filter and the hover-only captions — both touched the *work* and the *viewer*. It was wrong only where it read those cuts as a mandate for minimalism everywhere.)
2. **One move that earns its place.** Restraint here is a craftsman's, not a minimalist's — prefer the single well-timed gesture to a pile of effects. This guards against AI sessions (or anyone) accreting novelty; it is **not** a cap on Jeff's own direction.

When Jeff is directing the design, his intent is the brief. Earlier versions of this file read "default to removal / the most restrained way" as minimalism and walked back legitimate motion work (Session 78 on the homepage, Session 76–77 enhancements). **That over-correction is retired.** The floor protects the *work*; it does not flatten the *design*. The only non-negotiable is point 1 above — data and the honest presentation of the work.

---

## Design language v2 — Jeff-directed expressiveness (2026-06-24)

Jeff has set a clearer direction: a higher-end, more expressive site that shows off 40 years of animator / Flash / web-design craft — **more** motion and parallax, not less. This *refines* "Design is open" above; it does not contradict it. The "default to removal / minimalism" reading was already retired 2026-06-22 — this goes one step further: the design *around* the work should be **staged**, not merely permitted.

**Stance:** *The work is shown straight. The space around it is staged.* This refines "Artwork first. UI recedes." — the UI no longer recedes apologetically; it is composed and it moves. Expressiveness lives in type, space, and choreography, around and between works.

**Restraint, reframed:** "one considered move, not five" no longer means *prefer fewer effects*. It means **every gesture must land — no half-built motion**. The brake is on sloppiness and on AI sessions accreting novelty, NOT on Jeff's expressiveness when he is directing.

**Motion system:** a small FIXED set of named primitives — depth-hero, continuity transition, river motion, load choreography — with house easing, durations, and parallax-rate rules. Specs live in `DESIGN-SYSTEM.md` § "Motion system (v2)" (single source of truth — do NOT duplicate the values here). `anime.js` remains the choreography library. Artwork plane is locked at 1.0× scroll.

**The one rule for motion on an artwork plane:** motion is allowed on a piece ONLY if it *resolves to the work shown whole* — hero zoom-OUT settling on the full image is fine; a zoom-IN that ends cropped is not; never pan/tilt/parallax the artwork node itself. Depth comes from everything *around* the work. (This is point 2 of the hard rail, extended to motion.)

**Structural decisions (this revision):**
- Collapse the two homepage orientation modules ("Navigate the Studio" + "How to Explore") into one honest "where to begin."
- One responsive source of truth per section — retire dual mobile/desktop markup.
- `curatorial-map.html` → **KEEP AS-IS** (decade×medium grid + theme chips). Jeff finds it interesting; do NOT rebuild it into a relationship visual. (Decision reversed 2026-06-24 after reviewing what the page actually does.)

**Preservation principles (weight equal to the hard rail):**
1. **Voice threading** — Jeff's oral history on the works/series it describes; real clips only, never autoplay or synthesized. **DEFERRED to the final phase** — one of the last things Jeff will do; do NOT treat as live work in the rollout.
2. **Lost works as honored absence** — never AI-fill, mock, or stand-in for a missing image; the gap stays a gap.
3. **Resilience** — every work fully reachable AND honest with JavaScript off and with `prefers-reduced-motion`. Motion enhances, never gates. (Extends the existing reduced-motion rule to the no-JS case.)
4. **A personal record, not a gallery** — rising polish must elevate craft, never imply provenance / exhibition history / market standing (no faux wall labels, accession numbers, "exhibited at," prices, critic quotes).

**Rollout discipline:** pilot the new language on ONE page (index or chromatic) — including its JS-off and reduced-motion states — before propagating to all pages, incl. the 1,084 generated pages via `gen-artwork-pages.py`. The artwork DETAIL page stays quiet (no depth-hero on a single-work view) and is the highest-leverage template.

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
- `deploy-hostgator.sh` — FTP upload to HostGator, the only deploy script (re-verified 2026-06-23 — `deploy.sh` no longer exists; this file and several docs had stale references to it as a fallback)
- `session-end.sh` — git commit + push + backup (does NOT deploy)
- `make_handoff.py` — regenerates Allison handoff PDF; run after any credential change

### Page inventory (31 public pages)
| Page | Notes |
|------|-------|
| `index.html` | Homepage, featured works from catalog-home.json |
| `archive.html` | 1,084 works, filters by medium/decade/series |
| `artwork.html` | Single work, loaded by `?id=artNNNN` |
| `series-index.html` | Guernica + 7 themes |
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
| `stories.html` | Oral-history stories — 8 documented + named placeholders, verbatim quotes. In stamp-nav.sh. |
| `why-i-made-things.html` | First-person essay built from oral-history sessions, Jeff-confirmed. In stamp-nav.sh. |
| `style-guide.html` | Standalone design-system reference page, with its own page-local section TOC (`.guide-nav`). Wired into `stamp-nav.sh`'s TARGETS as of 2026-06-23 — it previously had a `NAV:START` marker with no matching `NAV:END`, so it carried a bespoke, never-updated header for months. |

### Interactions (live)
- **Homepage Selected Works (index.html):** CSS Columns masonry grid (4→3→2 columns responsive). Featured cards use `.featured-card` + `.featured-card-img` + `.featured-metadata` structure. The image is shown **faithfully (no filter)** with an **always-visible** title/year/medium caption beneath it; the whole card links to the artwork page. Hover/focus shows only a quiet orange outline (#e05900) — **no** scale, brightness, title colour-shift, overlay, medium badge, colour swatch, click ripple, 3D tilt, or quick-preview modal (all removed in the 2026-06-21 simplicity pass — see `docs/archive/README.md`). NOTE: the structure still matches archive.html, but archive.html *still carries* the Session-77 interaction layer (ripple/badge/swatch/peek-modal) and is a candidate for the same simplification.
- Orange outline on hover: `_shared/ui.css` `.thumb__link` — `outline-color` transition from `rgba(255,102,0,0)` → `#FF6600`. Archive cards + decade pages use `.archive-card-img` with `#e05900` (Material Design orange)
- Keyboard ← / → between decade pages: `_shared/ui.js`
- Vertical "you are here" margin label: `_shared/ui.js` + `data-page-label` on `<body>`
- Hero heading zoom-out on scroll: `_shared/ui.js` `.decade-hero` / `.decade-heading`
- Ghost grid (lost.html): 10 JS-generated empty tiles
- Chromatic River (chromatic.html): HiDPI canvas, 1,084 color slices, hover + click
- Wall (wall.html): 1,084 tiles, all color, no sibling dim (removed session 10)

### Nav systems (two, keep separate)
1. **Stitch nav** (`_shared/top-nav.html`) — `font-nav-link`, `text-deep-ink`, `international-orange` hover. Used by collage, sculpture, photography, painting, lost, etc. Nav links: Archive · Series · About · Lost Works.
2. **Material Design nav** (inline on decade pages) — `font-label-lg`, uppercase, `text-on-tertiary-container` active. Used by 1970s–2020s.

### Deployment
- `.claude/launch.json` configured with `autoPort: true` for flexible dev server assignment (no hardcoded port 9000)
- `bash session-end.sh` — git commit, push to GitHub, rsync backup to external drive
- `bash deploy-hostgator.sh` — CLI deployment script (replaces JFSN.app, Session 70+). Reads .ftp.env, mirrors files via lftp, runs smoke test
- Deploy to HostGator via `bash deploy-hostgator.sh` (primary) or desktop JFSN.app (legacy) — the only host. (Netlify secondary mirror + `deploy-netlify.sh` removed 2026-06-22.)
- `build_catalog.py` writes the api JSON + feed.xml through `_write_stable` — they are NOT rewritten when only the `generated`/date timestamp would change. If you see those files *not* updating on a no-content build, that's intentional (kills git churn / end-session residuals), not a bug.
- Service worker: `sw.js` — bump `CACHE_V` whenever deploy may be cached by old SW
- **Hero AVIF upload path:** `.htaccess` rewrites `artworks/full/*.avif` → `/artworks/*.avif` (legacy flat dir). New hero crops (`artNNNN-hero.avif`) must be uploaded to `/artworks/` on HostGator — NOT `/artworks/full/`. Use lftp: `put artNNNN-hero.avif -o /artworks/artNNNN-hero.avif`
- **`api/.htaccess` is auto-generated:** `build_catalog.py` overwrites it on every run. Edit the `htaccess` template string in that script — never the file directly. Do NOT add `SecFilterEngine`/`SecRuleEngine` — they cause HTTP 500 on HostGator.
- **`catalog-lite.json` fields:** `file, title, year, work_type, themes, keywords, motifs, description, series, favorite, featured, orientation, composite, year_precision, year_display` (`orientation` = vertical/horizontal/square from `dims.json`, session 35; `composite`/`year_precision`/`year_display` = provenance fields, session 36). Source of truth is `LITE_FIELDS` in `build_catalog.py`.

  **Adding a field is a multi-file change, NOT just an edit to `LITE_FIELDS`.** Consumers don't validate; they ignore unknown fields and break when expected fields disappear. Before adding or renaming any field, check:
  1. `_shared/search.js` — does it index this field? read it?
  2. `gen-artwork-pages.py` — does the artwork-page template render this field?
  3. `api.html` — is the field documented for API users?

  If any consumer needs to know about it, update that consumer in the same commit. If you're removing or renaming a field, the same four locations need updates first.
- **Provenance fields (session 36, set in `build_catalog.py` after the records sort):** `year_precision` is `'estimated'` for ALL works and `year_display` is the decade-bucket form `"1990s (est.)"` — every catalog year is a decade estimate (creator-confirmed), so artwork pages + API show "1990s (est.)", never a hard year. `composite` is `True` for the ~250 "imagined placement" works (rule: Gallery theme OR Studio theme OR a placement-language title via `PLACEMENT_RE`) — these are Photoshop composites, NOT real single works/exhibitions (master-notes §22/§25); artwork pages show an "Image — Photoshop composite — imagined placement" meta row. To change the composite set, edit the rule/`PLACEMENT_RE` and rerun `build_catalog.py` + `gen-artwork-pages.py`. NOTE: grid/search/favorites captions still show the bare decade year (e.g. "1990"); only the artwork detail pages + API carry the "(est.)" label.
- **`artworks/pages/` regen:** `python3 gen-artwork-pages.py` rebuilds all 1,084 static pages. All include `search.js` + `nav-active.js` as of session 11. Use `--limit 5` to test template changes first.
- **New page checklist:** When adding any new public `.html` page: (1) add to sitemap entries list in `build_catalog.py`, (2) run `python3 artworks/build_catalog.py` to rebuild sitemap, (3) add to TARGETS array in `stamp-nav.sh` so future nav updates propagate to it, (4) run `bash audit-nav.sh` — the reverse sitemap check will catch if it's missing from the sitemap.

### Global Design System Reference
The in-page ⌘Shift+D modal (and its footer button) was removed 2026-06-23 — it was a developer reference panel that didn't serve the archive's mission and was duplicated across every page. `style-guide.html` remains as the standalone design-system reference page.

### Conventions
- Vanilla HTML/CSS/JS. Production uses `site.min.css` (23,071 bytes compiled Tailwind — not CDN). Stitch exports start with Tailwind CDN and get swapped to `site.min.css` during post-export cleanup.
- **Tailwind rebuild rule:** Any time a new utility class is added to any HTML file, run `npm run build:css` and commit the updated `site.min.css`. Classes not in the build are silently ignored at runtime — there is no error, just a missing style.
- **No arbitrary values:** Never use `p-[10px]` when a standard scale value exists (`p-2.5` = 10px). Arbitrary values require a rebuild and pollute the class list. Check the spacing scale in `tailwind.config.js` first.
- `loading="lazy"` on all artwork images
- `prefers-reduced-motion` respected in all transitions (in `_shared/ui.css`)
- `aria-current="page"` on active nav link (set by nav-active.js)
- Mobile nav is a **hamburger button → slide-in drawer** (`#mobile-menu-drawer` in `_shared/top-nav.html`), NOT a fixed bottom tab bar. Drawer links (Archive/Series/About/Lost Works, corrected Session 80 — was Archive/About/Stories/Lost) carry inline feather-SVG icons as of session 35; edit the source then run `bash stamp-nav.sh` to propagate to all 38 pages.

---

## Working notes for Claude

**Decisions: design vs. process.** Design and motion calls on this site are Jeff's
— he's the 40-year motion designer directing it (see the litmus above). Code,
performance, and process calls are not — make those directly, don't ask. The
distinguishing question: would changing this alter what the *site does or looks
like* (ask Jeff), or just *how reliably/quickly it does it* (just fix it)? Session
95's mobile-LCP work is the model: deferred CSS fetch timing was fixed without
asking; skipping the mosaic-intro animation on mobile was confirmed with Jeff first
because it touches a deliberate Session-79 design choice.

**Verify by execution, not by reading.** Every high-value bug or stale-fact catch
in this project's history came from running a script, `curl`, grep, or browser
click and comparing real output to a claim — never from trusting doc prose or a
prior session's "fixed" note at face value. Treat your own past session summaries
the same way: re-check before relying on a specific file/line/number they cite.

**Lighthouse: don't trust the default mode for "did this fix work?"** Lighthouse's
default run uses *simulated* ("lantern") throttling — it estimates timings from a
dependency graph rather than measuring real throttled network/CPU. It can be
completely insensitive to a real fix (Session 95: two genuine improvements showed
zero score change under default mode). Before concluding a perf fix worked or
didn't, re-check with `lighthouse <url> --throttling-method=devtools`, which runs
real trace-based throttling instead. Always take 3 runs and use the median — single
runs have shown CPU-contention outliers as low as 54 on a normally-90 page.

**`stamp-nav.sh` can clobber drift.** It overwrites the NAV+FOOTER blocks verbatim
from `_shared/top-nav.html`/`footer.html` on every TARGET page. `index.html`
specifically tends to drift *ahead* of those shared templates (new hero/animation
work lands there first). After any `stamp-nav.sh` run, check `git diff --stat` —
if `index.html` shows a noticeably bigger diff than the other targets, inspect it
before trusting it; a past run silently deleted a live script tag this way.

**The `NAV:START`/`NAV:END` span is bigger than it looks — it includes the
standard script bundle, not just markup.** `_shared/top-nav.html`'s own content
runs all the way through the sitewide `<script>` tags (search.js, anime.min.js,
jfsn-interactions.js, accent-transition.js, chromatic-accent-wire.js,
ambient-chromatic-tint.js, chromatic-position-strip.js, chromatic-lazy-tint.js,
micro-interactions.js, scroll-choreography.js) before `<!-- NAV:END -->` closes.
Session 95 (wow-factor rollout) added several new page-specific script tags
right next to that block, assuming it was past the nav — `stamp-nav.sh`'s regex
(`<!-- NAV:START -->.*?<!-- NAV:END -->`) replaces that *entire* span verbatim,
so every one of those new tags was silently deleted on the next re-stamp, and it
went unnoticed until a live-site `curl` check caught it. **Any new page-specific
script include must go immediately *after* `<!-- NAV:END -->`** (or be added to
`_shared/top-nav.html` itself if it's meant to be sitewide) — never adjacent to
the existing per-page script list, which is actually still inside the nav span.

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
