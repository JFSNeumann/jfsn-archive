# JFSN — Google Stitch Prompt Guide

Use this every time you generate a new page or component in Stitch.
Copy the template at the bottom, fill in the blanks, paste into Stitch.

> **Rewritten 2026-07-19.** The previous version of this guide pasted a light "bone-white" design system (from the 2026-05-31 Stitch redesign) and a `stamp-nav.sh`/`NAV:START`-`NAV:END` nav workflow into every prompt. Neither matches the live site anymore — the site moved to a dark "room" theme and per-page inline nav sometime after that redesign, and `stamp-nav.sh` and its shared nav partial no longer exist (see `DESIGN-SYSTEM.md` § "Architecture"). Everything below is rewritten to match what's actually live, verified against page source rather than carried forward from the old doc.

---

## Why this exists

Stitch exports need heavy rework if the prompt is vague:
- Wrong colors (Stitch uses its own palette unless you paste exact hex codes)
- Rounded corners (this site is square-cornered everywhere except true circles)
- Promotional patterns: carousels, CTAs, testimonials, newsletter signups
- Lorem Ipsum instead of real content (leads to wrong type sizing)
- A nav/footer that isn't hand-editable inline (there's no shared partial or stamping script to lean on — see Nav section below)

A good prompt reduces rework significantly. **Also worth stating up front: nothing on the live site currently looks Stitch-generated** — the last several months of work (card hover language, room-veil transitions, scroll cues, the homepage wing crossfade) were all hand-built directly in each page's HTML/CSS/JS, not extracted from a Stitch export. Reach for this workflow only if generating a genuinely new page from scratch is faster than hand-building one in the established pattern — for most changes to existing pages, editing the page directly (per `DESIGN-SYSTEM.md`) is the right tool, not Stitch.

---

## Design system — paste this into every prompt

```
Design system (dark theme):
- Background: #0c0a09 (--room, near-black, warm undertone)
- Primary text: #e8e2d9 (--ink, warm off-white)
- Secondary text: #7a7168 (--dim)
- Faint/disabled text, dividers: #3a332d (--faint)
- Borders (cards, inputs, buttons): #2b241e (--frame), 1px solid, at rest
- Accent: #FF6600 (--accent, international-orange) — used directly for hover/active/
  focus states AND persistent text on this dark background (6.7:1 contrast against
  #0c0a09 — no separate lower-contrast "text-safe" orange is needed here, unlike on
  a light background)
- Headings: 'Playfair Display', Georgia, serif — italic, font-weight 400, NOT bold
- Body/prose: Georgia, 'Times New Roman', serif
- UI labels/buttons/nav ("caps" style): -apple-system,BlinkMacSystemFont,"Segoe UI",
  Roboto,Helvetica,Arial,sans-serif — 10px, letter-spacing .26em, uppercase, color #7a7168
- No Inter anywhere on this site — do not substitute it for the sans-serif role
- No rounded corners (border-radius: 0) except true circles (border-radius: 50% on
  small dot/marker elements only)
- Shadows grow on hover from transparent, never present statically. Three tiers:
  small/controls "0 4px 12px rgba(0,0,0,.06)", cards/buttons "0 8px 24px rgba(255,102,0,.12)"
  to "0 12px 32px rgba(255,102,0,.16)", large/focal "0 28px 64px rgba(0,0,0,.6)"
  combined with an accent glow
- No gradients except functional scrims (a radial dark ellipse behind hero text for
  legibility, or a fade at the header edge) — never as decorative section dividers
- Artwork thumbnails: full color always — no grayscale, no filter, no mix-blend-mode, ever
```

---

## Nav — always include this instruction

```
There is no shared nav partial or nav-stamping script on this site — every page
hand-codes its own header. Match this exact pattern (header.hud):

  <header class="hud">
    <a class="who" href="index.html">JEFFREY&nbsp;F.&nbsp;S.&nbsp;NEUMANN</a>
    <span class="caps room-name">[ROOM NAME, e.g. THE ARCHIVE]</span>  <!-- optional -->
    <a class="caps" href="index.html">[ THE MUSEUM → ]</a>
  </header>

Position: absolute, top:0, full width, gradient background fading from --room to
transparent, pointer-events:none on the container with pointer-events:auto on the
links (lets hero content underneath still receive clicks/hover).

Nav is text-bracket links ("[ TEXT → ]" style) — identical on mobile and desktop,
reflowing naturally. There is NO hamburger menu, NO slide-in drawer, NO ⌘K search
trigger, NO icon system anywhere on this site. Do not generate any of those.

Exception: if this page IS the homepage (index.html), it has NO header at all —
it's built as a deliberately chrome-free "poster." Only omit the header if
explicitly told this is a homepage replacement.
```

---

## Content philosophy — always include this

```
This is a personal archive, not a promotional platform.
- No calls to action ("Sign up", "Get started", "Subscribe")
- No testimonials section
- No pricing or tier mentions
- No newsletter signup
- No "hero" with a stock photo — only real archive works or real photographs
- No engagement patterns
- Descriptions are spare: year (as a decade estimate, e.g. "1990s (est.)"), medium
- Composite/imagined-placement works must show the flag "Photoshop composite —
  imagined placement" visibly in the DOM, never hidden behind hover-only
- The image is the primary object — UI recedes
```

---

## Export instruction — always include this

```
Export as a single HTML file, self-contained inline <style>/<script> in <head> and
end-of-<body> — this matches how every other page on the site is built (no shared
stylesheet is loaded; see design-system note above).
- Tailwind CDN is fine for the Stitch draft, but the export must be de-CDN'd before
  it goes live (see step 5 below) — this site's real pages don't load Tailwind CDN
  or compile most of their styling through Tailwind at all; inline CSS is normal here
- loading="lazy" on all artwork <img> tags except the first ~12 in a grid
- loading="eager" + fetchpriority="high" on the LCP/hero image only
- Respect prefers-reduced-motion on every transition/animation — pair a
  @media (prefers-reduced-motion: no-preference) motion block with a
  @media (prefers-reduced-motion: reduce) static fallback, always
```

---

## Full prompt template

Copy this, fill in the `[brackets]`, paste into Stitch:

```
Design system: dark theme, background #0c0a09, primary text #e8e2d9, accent #FF6600
(used directly, hover/active/persistent text alike — this is a dark background),
borders #2b241e 1px solid · headings Playfair Display italic (not bold) · body
Georgia serif · UI labels Georgia/system-sans 10px uppercase 0.26em tracking ·
no rounded corners except true circles · no gradients except functional scrims.

Page: [filename.html]
Purpose: [One sentence — what this page does. Who uses it and why.]
Real content example:
  [Paste 1–2 actual items from the archive, not Lorem Ipsum.
   E.g. — Title: "Untitled (Cassette Torso)" · Year: 2020s (est.) · Medium: Collage]

Key interaction: [The one thing that makes this page worth visiting.
  E.g. — "Card image lifts on hover with an orange border and shadow; caption
  fades up 0.08s later, title turns accent-colored." Match the existing archive
  card-hover language in DESIGN-SYSTEM.md if this is a grid of works.]

Do not include:
- [List 3–5 things Stitch will add by default that you don't want]
- No carousels / testimonials / newsletter signup / pricing table
- No hamburger menu, slide-in drawer, or ⌘K search trigger
- No grayscale on artwork thumbnails — always full color

Mobile: [Describe mobile layout specifically — single column? hidden filters
  behind a toggle (see archive.html's #filters-toggle pattern)?]
Desktop: [Describe desktop layout — sidebar + main? full-bleed? grid?]

Nav: header.hud pattern — site name link + optional room-name label + one exit
link, text-bracket style, same on every viewport. No shared nav file to stamp;
this page hand-codes its own header, matching the pattern in every other room page.

Content philosophy: personal archive, not promotional. No CTAs. No engagement
patterns. The image is the primary object. UI recedes.

Export: single HTML file, inline <style>/<script>, no external component
libraries, loading="lazy" on artwork images, prefers-reduced-motion respected
on every transition.
```

---

## After you get the Stitch export

1. **Extract** layout structure, spacing, grid columns, typography hierarchy
2. **Extract** any interaction/animation code worth keeping
3. **Do NOT use the export directly** — it will default to Stitch's own light palette and generic component patterns regardless of what was pasted into the prompt; treat it as a structural sketch, not a finished page
4. **Apply** the extracted structure to a new HTML file using the real dark-theme tokens above, matching the inline `<style>`/`<script>` pattern every other page uses
5. **Remove the Tailwind CDN script tag and inline `tailwind.config` block** entirely — write plain CSS matching the tokens above; don't wire this page into `site.min.css` unless you're intentionally adding new Tailwind utility classes sitewide (rare — most pages don't)
6. **Do not add `_shared/nav-active.js` or run `stamp-nav.sh`** — neither exists. Hand-code the header per the Nav section above.
7. Test the full interaction set: hover, `:focus-visible` keyboard nav, touch `:active` states, and `prefers-reduced-motion: reduce`
8. Test at a small mobile width (~390px) and a wide desktop width (~1440px)

---

## Pages that exist today — reference these for consistency

The site was pruned to 14 core pages on 2026-07-16 (commit `41461e45`) — most of the page list this doc previously referenced (`collage.html`, `lost.html`, `series-index.html`, `wall.html`, `guernica.html`, `api.html`, `start-here.html`, `favorites.html`, and more) no longer exists and should not be recreated without Jeff explicitly reopening that scope. The current 14:

| Page | Notes |
|---|---|
| `index.html` | The homepage "poster" — no header, five fixed elements, wing-image crossfade on desktop. See DESIGN-SYSTEM.md. |
| `archive.html` | Search + filter chips + infinite-scroll-style grid with the canonical card-hover language. Best reference for any new grid/card page. |
| `current.html` | Scroll-river page, structurally unique — not a useful Stitch-generation reference. |
| `guernica-passage.html`, `flooded-wing.html`, `the-studio.html`, `hall-of-openings.html`, `working-history.html`, `about.html`, `stories.html` | The `#door`/`#hero` full-viewport hero pattern — background image, radial vignette, scroll cue, `header.hud`. Best reference for any new narrative/essay-style page. |
| `artwork.html` | Client-rendered template (reads `?id=` from the query string) — not a static page, don't treat as one. |
| `404.html`, `privacy.html`, `sitemap.html` | Plain text utility pages, no hero/card patterns — simplest possible reference if generating another utility page. |

---

## Changelog

**2026-07-19** — Full rewrite. Replaced the light "bone-white" design system, the `stamp-nav.sh`/`NAV:START`-`NAV:END` nav workflow, the 4-item-nav-plus-⌘K spec, and the "pages already built" reference table (which listed mostly-deleted pages) with what's actually live, verified against page source. See `DESIGN-SYSTEM.md`'s 2026-07-19 rewrite for the fuller token/pattern reference this doc now derives from.
