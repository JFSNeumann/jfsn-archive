# JFSN Archive — Design System

**Living design documentation**
Last verified against live pages: 2026-07-24
Framework: vanilla HTML/CSS/JS. Each page owns its own inline `<style>`/`<script>` — there is no shared stylesheet or component library (see "Architecture" below).
Theme: dark "room" — near-black background, warm off-white text, italic serif headlines, single orange accent.

> **This document replaces a prior version describing a light "bone-white"/Inter/Tailwind theme.** That theme is not present on any live page as of this rewrite — it was superseded at some point after 2026-06-22 by the dark theme documented here, without the doc being updated. If you find a page that still matches the old description, treat it as unmigrated, not as evidence the old doc was right.
>
> The prior version also claimed CLAUDE.md canonically defines tokens in a section called "Design System (current — Stitch/Tailwind, light)". **That section does not exist in CLAUDE.md** (verified 2026-07-19 — CLAUDE.md is 46 lines and contains no design-token content). This document is now the only design reference for the site; nothing to defer to.

---

## Architecture — read this before editing anything

**There is no central design-system file.** `index.html`, `archive.html`, `the-studio.html`, `guernica-passage.html`, `hall-of-openings.html`, `flooded-wing.html`, `working-history.html`, `about.html`, `stories.html`, `current.html`, `artwork.html`, `404.html`, `privacy.html`, and `sitemap.html` each carry their own `<style>` and `<script>` blocks in `<head>`/end-of-`<body>`. The same CSS custom properties, the same `.caps` label rule, the same card-hover language, etc. are **redeclared per page**, not imported.

**Practical consequence:** a sitewide tweak (accent color, shadow depth, transition timing) means editing every page that uses it, one at a time. This document exists so those edits stay consistent instead of drifting page to page — it is a pattern reference, not a single source of truth the browser actually loads.

**`_shared/*.css` and `_shared/*.js` are dead code.** Verified 2026-07-19: `dark-mode.css`, `ui.css`, `enhancements.css`, `nav-active.js`, `page-transitions.css`, `section-tints.css`, `hover-preview.css`, `lazy-load.css`, `skeleton.css`, `toast.css`, `ux-improvements.css`, `senior-ux-touch-targets.css`, `archive-quick-filters.css`, `artwork-page-min.js` — none are referenced by any `<link>` or `<script>` tag on any page (`grep -o "_shared/[a-zA-Z0-9_.-]*" *.html` returns nothing). Do not assume editing a `_shared/` file changes anything live. If you need shared behavior, either edit each page or propose extracting a real shared file — don't edit `_shared/` expecting effect.

**What *is* actually shared:**
- `site.min.css` — built from `input.css` via `tailwind.config.js` (`npm run build:css`). Used sparingly; most page styling is inline, not Tailwind utility classes. Bump `CACHE_V` in `sw.js` after every rebuild.
- `sw.js` — service worker, caching only, no visual effect.
- `search.js` — search/filter logic used by archive.html's search bar.
- `config/catalog-home.json`, `config/current.json`, `config/catalog-lite.json` — data, not design, but referenced by name below since several interaction patterns (wing crossfade, archive grid) depend on which one a page fetches.

**`artwork.html` is a client-rendered template**, not 1,084 static files — it reads `?id=` from the query string and populates itself via JS. There's no per-artwork HTML to hunt for.

**`current.html`** is the scroll-river page — no `<section>`/hero structure, doesn't participate in most patterns below.

---

## Color Tokens

Six CSS custom properties, redeclared identically at the top of every room page's `<style>`:

```css
:root{
  --room:#0c0a09;    /* page background — near-black, warm undertone */
  --ink:#e8e2d9;     /* primary text — warm off-white */
  --dim:#7a7168;     /* secondary text, inactive labels */
  --faint:#3a332d;   /* dividers, disabled/faint borders */
  --frame:#2b241e;   /* card/input/button borders */
  --accent:#FF6600;  /* international orange — the one accent color, used everywhere */
}
```

No light-mode variant exists anywhere in the live site. `#B84700` ("orange-ink," a lower-contrast orange for light backgrounds) does not appear on any page — it was part of the retired light theme. Because the background is always dark, `--accent` (#FF6600) is used directly for hover states, active states, and highlighted text with no contrast-driven color swap needed (6.7:1 against `--room`).

**Highlight-box pattern** (used on every room-page `<h1>`, one word or phrase per page):
```css
.highlight-devo{ /* or .highlight-dark, .highlight-work — name varies by page, styling identical */
  background:var(--accent);color:#fff;padding:0 4px;font-style:normal;
  display:inline-block;transform-origin:left center;
}
```
Animates in once on load via an "ink-stamp" keyframe (`scaleX(0)→1.08→1`), landing like a stamp hitting paper. See "Motion" below.

---

## Typography

**No Inter anywhere.** The old doc's "Inter for UI/labels" spec does not match any live page — checked via `grep -c Inter *.html` (zero real matches; the only hits were substring collisions inside `IntersectionObserver`/`setInterval`).

Three font roles, consistent across all room pages:

| Role | Stack | Used for |
|---|---|---|
| Display serif | `'Playfair Display', Georgia, serif` — always `font-style:italic;font-weight:400` | `<h1>` hero titles, pull-quotes, artwork titles in cards |
| Body serif | `Georgia, 'Times New Roman', serif` | Prose paragraphs, `.prose` blocks |
| UI sans | `-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif` | `.caps` labels, buttons, nav, metadata |

`@font-face` self-hosts Playfair Display italic (`/fonts/playfair-display-italic-latin.woff2`) with `font-display:swap` and `<link rel="preload">` in `<head>`.

**The `.caps` label** — the single most-repeated typographic pattern on the site, identical wherever it appears:
```css
.caps{font-size:10px;letter-spacing:.26em;text-transform:uppercase;color:var(--dim)}
```
Used for room eyebrow labels ("THE ARCHIVE"), nav links, button text (`[ ENTER → ]` style), metadata rows.

No fixed type-scale table exists — hero `<h1>` sizes are set per page with `clamp(38px,7vw,76px)` (fluid, not a discrete scale step).

---

## Shape & Surface

**Square corners, sitewide, no exceptions except true circles.** Verified via `grep -c border-radius *.html`: zero on 12 of 14 pages; the two hits (`the-studio.html`, `flooded-wing.html`) are both `border-radius:50%` on 9×9px dot elements — full circles, not rounded rectangles. There is no card, button, input, or image anywhere with a partial border-radius.

**Borders:** always `1px solid var(--frame)` (`#2b241e`) at rest. No gradient dividers, no decorative `::after` rules on section boundaries.

---

## Shadow Scale

Three real tiers, drawn from actual values in use (not a designed scale imposed after the fact — this is what's there):

| Tier | Value | Used for |
|---|---|---|
| **Small / controls** | `0 4px 12px rgba(0,0,0,.06)` hover; `0 4px 12px rgba(255,102,0,.12)` active/accent | Filter chips, small toggle buttons |
| **Medium / cards & buttons** | `0 8px 24px rgba(255,102,0,.12)` to `0 12px 32px rgba(255,102,0,.16)` | Archive grid cards, Hall of Openings cards, Load More / room-nav buttons |
| **Large / focal elements** | `0 28px 64px rgba(0,0,0,.6)` combined with `0 8px 24px rgba(255,102,0,.12)` | current.html's single focal work card — the one element on the site meant to read as physically lifted off the wall |

Shadows are always `0` at rest (`box-shadow:0 2px 8px rgba(0,0,0,0)` — transparent, not `none`, so the transition has something to animate from) and grow on hover/focus, never present statically.

---

## Motion

### Timing
`.3s ease` is the dominant transition duration (58 occurrences across the codebase) — the default choice for hover/focus color, border, and shadow transitions. `.4s ease` is used for the card-hover "language" specifically (image border/shadow/lift + staggered metadata reveal) where a slightly slower, more deliberate feel was chosen deliberately (see Archive card polish, 2026-07-18). `.22s`–`.25s` shows up for veil/overlay opacity (room-veil, back-to-top button). There is no single canonical duration — pick `.3s` unless matching an existing nearby element.

### The card-hover language
The canonical interactive-card pattern, used on archive.html's grid, hall-of-openings.html's `.op` cards, and (in reduced form) current.html's focal card:

```css
.card img{
  border:1px solid var(--frame);
  transition:border-color .4s ease,box-shadow .4s ease,transform .4s ease;
  box-shadow:0 2px 8px rgba(0,0,0,0);
}
.card a:hover img,.card a:focus-visible img{
  border-color:var(--accent);
  box-shadow:0 12px 32px rgba(255,102,0,.16);
  transform:translateY(-2px);
}
/* Metadata enters from below on hover, staggered after the image */
.card figcaption{opacity:0;transform:translateY(8px);transition:opacity .4s ease .08s,transform .4s ease .08s}
.card a:hover figcaption,.card a:focus-visible figcaption{opacity:1;transform:none}
.card .t{transition:color .4s ease,font-weight .4s ease}
.card a:hover .t,.card a:focus-visible .t{color:var(--accent);font-weight:500}
```
Three-phase reveal: image lifts first, then caption fades up (.08s delay), then title gains color/weight. `:focus-visible` is paired with `:hover` throughout — keyboard and mouse get identical feedback, no separate focus-only styling to fall out of sync.

**Touch press feedback** — gated to touch devices, absent from the old doc entirely:
```css
@media (hover:none) and (pointer:coarse){
  .card a:active{
    background-color:color-mix(in srgb, var(--accent) 6%, transparent);
    transform:scale(.98);
  }
}
```

### `prefers-reduced-motion`
Every animation/transition-heavy rule on the site is wrapped in `@media (prefers-reduced-motion: no-preference)`, with a paired `@media (prefers-reduced-motion: reduce)` block that snaps straight to the resting/revealed state (no animation, `opacity:1`, no transform). This is genuinely non-negotiable and consistently applied — verified across all room pages during the 2026-07 interaction-polish sessions.

### Ink-stamp (title highlight entrance)
```css
@media (prefers-reduced-motion: no-preference){
  .highlight-devo{animation:ink-stamp .5s cubic-bezier(.2,1.6,.4,1) both;animation-delay:.5s}
  @keyframes ink-stamp{0%{transform:scaleX(0)}60%{transform:scaleX(1.08)}100%{transform:scaleX(1)}}
}
```

### Wing crossfade (index.html only, desktop only)
The homepage's two flanking "wall" images cycle through featured works from `config/catalog-home.json`, preloading the next image before a `.6s` opacity crossfade, staggered so both wings never fade at once. Guarded behind `matchMedia('(min-width:1200px)')` and `prefers-reduced-motion`. See `index.html`'s end-of-body script for the full implementation — this is the newest and most elaborate motion pattern on the site (added 2026-07-19), not yet generalized to any other page.

---

## Page Anatomy

### `header.hud` — every room page except `index.html`
```css
header.hud{
  position:absolute;top:0;left:0;right:0;z-index:10;
  display:flex;justify-content:space-between;align-items:baseline;
  padding:calc(env(safe-area-inset-top,0px) + 22px) 26px 14px;
  background:linear-gradient(var(--room) 55%,rgba(12,10,9,0.82) 78%,transparent);
  pointer-events:none;
}
header.hud a{pointer-events:auto}
```
Left: site name link back to `index.html`. Center (optional): current room name. Right: `[ THE MUSEUM → ]` or `[ THE ARCHIVE → ]` exit link. `pointer-events:none` on the container with `auto` re-enabled on links only — lets hero content underneath still receive pointer events in the header's visual footprint.

**`index.html` is the one deliberate exception** — no `header.hud`, no nav at all. It's built as "the poster": five fixed elements (title, creed, one artwork, signature, doors), identical every visit, no chrome. This is a documented intentional choice, not a missing feature (see `docs/current/session_2026_07_13_poster_hero.md` in memory / git history).

### `#door` / `#hero` — full-viewport hero section
Present on six room pages (`guernica-passage`, `the-studio`, `hall-of-openings` [as `#hero-image`], `about`, `working-history`, `stories`) plus `flooded-wing.html`. Pattern:
```css
#door{
  min-height:100vh;display:flex;flex-direction:column;
  justify-content:center;align-items:center;text-align:center;gap:28px;
  position:relative;overflow:hidden;isolation:isolate;
}
#door::before{ /* full-bleed background image */ }
#hero-content::before{ /* radial-gradient ellipse fade behind text, scales in on load */ }
```
Content sits inside a radial dark-ellipse vignette (`radial-gradient(ellipse at center, rgba(12,10,9,.94) 0%, ... transparent 75%)`) so the hero title stays legible over any background image without needing a flat scrim.

**First content section after the hero needs `padding-top:8vh`.** This was a real, repeated bug (fixed 2026-07-19 across 6 pages): several pages had zero or near-zero top padding on the section right after the hero, so body text sat crammed against the photo. `about.html`'s `#biography{padding-top:8vh}` was the one page that had it right from the start — use `8vh` as the standard gap on any new hero-adjacent section.

### Scroll cue (`.down` / `.threshold::after`)
Every full-viewport hero has a bouncing `↓` pinned near the bottom, fading out once the visitor scrolls past ~40px:
```css
#door .down{
  position:absolute;bottom:6vh;left:50%;transform:translateX(-50%);
  color:var(--dim);font-size:28px;
  animation:sink 2.6s ease-in-out infinite;transition:opacity .3s ease;
}
@keyframes sink{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(12px)}}
#door.scrolled .down{opacity:0}
```
```js
(function(){
  const door = document.getElementById('door'); // or #hero, or #hero-image on hall-of-openings
  if (!door) return;
  function check(){ door.classList.toggle('scrolled', window.scrollY > 40); }
  window.addEventListener('scroll', check, { passive: true });
  check();
})();
```
28px, `bottom:6vh` — standardized across all seven hero pages 2026-07-18/19 (previously only `flooded-wing.html` had one, at a smaller 18px).

### Room-veil (page-transition blackout)
```css
#room-veil{position:fixed;inset:0;background:#0c0a09;opacity:0;pointer-events:none;transition:opacity .22s ease;z-index:99}
#room-veil.on{opacity:1;pointer-events:auto}
```
```js
document.addEventListener('click', e => {
  const a = e.target.closest('a');
  if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === '_blank') return;
  const h = a.getAttribute('href') || '';
  if (!h || /^(https?:|#|mailto:)/.test(h)) return;
  e.preventDefault();
  v.classList.add('on');
  setTimeout(() => { location.href = a.href; }, 200);
}, true);
```
Present on 14 of 14 pages. **On `pageshow` with `event.persisted` (bfcache back-navigation), must explicitly reset both the class and inline `opacity`/`pointer-events`** — a real bug (fixed 2026-07-19) where the veil could persist at `opacity:1` after browser back-button navigation, silently blocking clicks until a manual refresh:
```js
addEventListener('pageshow', e => {
  if (e.persisted) {
    v.classList.remove('on');
    v.style.opacity = '0';
    v.style.pointerEvents = 'none';
  }
});
```

### Back-to-top button
Present on 11 of 14 pages (injected via inline script, not markup):
```js
var btn = document.createElement('button');
btn.id = 'btt-float';
btn.style.cssText = 'position:fixed;bottom:28px;right:28px;width:44px;height:44px;...';
window.addEventListener('scroll', function(){
  if(window.scrollY > 300){ btn.style.opacity = '1'; btn.style.pointerEvents = 'auto'; }
  else { btn.style.opacity = '0'; btn.style.pointerEvents = 'none'; }
}, {passive:true});
```

---

## Interactive Hover Patterns

### Doors Preview System (index.html)
The five room-navigation links display ghosted previews from a single composite image (`jfsn-hover-composite.avif`, 1600×1040) on hover and keyboard focus:

```css
#doors a::after{
  content:'';position:absolute;inset:0;z-index:-1;
  background-image:var(--preview-url);
  background-size:100% 500%;  /* Five bands at full width; height = 5× container */
  background-position:0 0%;   /* Overridden per link below */
  opacity:0;
  transition:opacity .5s ease;
}

/* Each link reveals its band via background-position offset */
#doors a:nth-child(1)::after{background-position:0 0%;} /* Current: 18% opacity */
#doors a:nth-child(2)::after{background-position:0 25%;} /* Guernica: 12% opacity */
#doors a:nth-child(3)::after{background-position:0 50%;} /* Flooded: 8% opacity (withdrawn) */
#doors a:nth-child(4)::after{background-position:0 75%;} /* Hall: 15% opacity */
#doors a:nth-child(5)::after{background-position:0 100%;} /* Studio: 20% opacity (brightest) */
```

**Per-room opacity on hover:** Each room's preview has distinct intensity reflecting its character — warmest/energy (Current 18%) to most withdrawn/imperceptible (Flooded 8%). Achieved via per-child `:hover/:focus-visible` opacity overrides, not uniform opacity.

**No filters/masks/blend-modes:** Previous design used blur, grayscale, radial masks, and screen blend-mode to create atmospheric "light leaks." Current approach prioritizes simplicity and clarity: single composite asset, pure opacity fade, sharp band transitions.

### Link Underlines (Global)
All `a:hover` links display orange underlines with improved readability:

```css
a:hover{
  color:var(--accent);
  text-decoration:underline;
  text-decoration-color:var(--accent);
  text-decoration-thickness:1px;    /* Thin line, not default */
  text-underline-offset:3px;        /* Lifts underline away from descenders */
}
```

Rationale: Default 2–3px thickness plus zero offset makes underlines interfere with text readability. `1px` thickness + `3px` offset preserves the orange accent cue while keeping text legible.

### Image Hover Fade Masks (index.html, desktop only)
Center and wing hero images apply directional fade masks on hover, creating a "fading to the edge" effect:

```css
/* Center work fades right edge on hover */
#work:hover img{
  -webkit-mask-image:linear-gradient(to right, #000 0%, #000 70%, transparent 100%);
  mask-image:linear-gradient(to right, #000 0%, #000 70%, transparent 100%);
}

/* Left wing fades right-to-left; right wing fades left-to-right */
#wing-l:hover img{
  -webkit-mask-image:linear-gradient(to left, #000 0%, #000 70%, transparent 100%);
  mask-image:linear-gradient(to left, #000 0%, #000 70%, transparent 100%);
}
#wing-r:hover img{
  -webkit-mask-image:linear-gradient(to right, #000 0%, #000 70%, transparent 100%);
  mask-image:linear-gradient(to right, #000 0%, #000 70%, transparent 100%);
}
```

Replaces previous blur/filter approach with clean mask-based transparency. Gated to `@media (min-width:1200px) and (hover:hover)` — no effect on mobile or under `prefers-reduced-motion`.

### Footer River (all pages)
Every page footer features a static canvas visualization of the entire archive—all 1,086 works rendered as thin vertical bars, each colored by the work's primary color. Located at the top of `footer.site-footer`, above navigation and metadata.

```html
<canvas id="footer-river" role="img" aria-label="The archive: 1,086 works..."></canvas>
```

**Implementation:**
- Fetches `/config/current.json` on page load
- Extracts color from each work's `.c` (color) field
- Lifts near-black works (+26/+24/+22 RGB) for legibility against dark background
- Renders to full footer width; bars scale responsively
- Redraws on window resize
- Responsive height: 20px with subtle borders
- Accessible: aria-label describes the visualization for screen readers
- Fails gracefully if JSON fetch unavailable

**Purpose:** Provides visual closure and summary of the archive—a compressed view of 50 years and 1,086 works. Consistent signature across all 14 pages.

---

## Accessibility

- `:focus-visible` is paired with `:hover` on every interactive element, not styled separately — verified across all room-page CSS. Standard outline: `outline:2px solid var(--accent);outline-offset:4px` (2px offset on smaller controls like chips).
- `alt=""` + `aria-hidden="true"` on purely decorative/atmospheric images (e.g. index.html's wing images, once their content became a rotating crossfade rather than a fixed, describable work).
- `loading="lazy"` on all grid/archive images; hero images use `fetchpriority="high"` + `loading="eager"` instead.
- `aria-expanded` / `aria-controls` on the mobile filters toggle (archive.html); `aria-pressed` on filter chips.
- Composite works carry a visible flag (`Photoshop composite — imagined placement`), not just a data attribute — this is an archive-integrity requirement, not a generic a11y one (see below).

---

## Archive Integrity (non-negotiable, unrelated to visual style)

These rules exist independent of whatever the visual theme is and survived the light→dark rewrite unchanged:

- Never filter, recolor, distort, mask, or tilt an artwork image.
- Never hide a work's title/year/medium behind a hover-only state.
- Years are always shown as decade estimates ("1990s (est.)"), never fabricated precision.
- Composite works (~250) are always flagged in the UI, never presented as real installation photography.
- Never fabricate provenance, accession numbers, or verification badges.

---

## Changelog

**2026-07-24** — Added "Interactive Hover Patterns" section documenting: (1) Doors preview composite system (single image, per-room opacity tuning, no masks/filters); (2) Link underline readability improvements (1px thickness, 3px offset); (3) Image hover fade masks (directional mask-image gradients replacing blur). Added "Footer River" section documenting canvas-based archive visualization (all 1,086 works as color strip) applied to all 14 pages. Updated Last Verified date to 2026-07-24.

**2026-07-19** — Full rewrite. The previous version (light "bone-white"/Inter/Tailwind theme, "Stitch June-2026 adoption") did not match any live page — verified by grep across all 14 HTML files (zero `bone-white`, zero `#B84700`, zero real `Inter` usage; the dark `:root` tokens and Playfair/Georgia stack are what's actually there). The previous version's canonical-source claim (CLAUDE.md § "Design System (current — Stitch/Tailwind, light)") pointed to a section that does not exist in CLAUDE.md. Replaced entirely with patterns verified against live page source: color tokens, typography, shadow scale, card-hover language, page anatomy (header.hud, hero/door, scroll-cue, room-veil, back-to-top), and the `_shared/` dead-code finding. Added architecture note explaining there is no shared stylesheet — this was previously undocumented and caused confusion about where to edit for sitewide changes.

**2026-06-22 through 2026-06-10 (superseded)** — Prior changelog entries described the light-theme era (Stitch adoption, orange-ink contrast fix, "Design language v2" motion/surface rules). That theme and its rules are no longer live; history preserved in git (`git log -- docs/current/DESIGN-SYSTEM.md`) rather than restated here.
