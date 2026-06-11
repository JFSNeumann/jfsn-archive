# Current State
**Updated:** 2026-06-10

## Last commit
6301b536 — Session update 2026-06-10 21:04
*(not yet deployed — run JFSN.app)*

## What was done this session (2026-06-10 — session 28)

### UX/UI + micro-interactions overhaul

**Micro-interactions (_shared/jfsn-interactions.js):**
- Custom cursor ring: replaced `margin` offset hack with `translate(rx - r, ry - r)` centered positioning — no drift on expand/contract
- Cursor sitewide: `cursor: none` now applies to `body *` (was only on artwork areas); ring also expands on `a` and `button` elements
- Cursor velocity scaling: lerp factor scales 0.13→0.38 based on per-frame mouse speed — ring snaps tighter on fast swipes
- Letter-settle: fires via IntersectionObserver (threshold 0.2) when element enters viewport, not on page load; total stagger capped at 260ms regardless of heading length
- Film grain: skipped entirely on touch devices (was running on mobile at ~20fps, burning battery, invisible at 2.8% opacity); pauses when browser tab is hidden
- Serendipity images: full-res `artworks/` served (was thumbnail quality); next image preloaded in hidden `Image()` after each `onload` for instant transitions
- Serendipity path resolution: replaced slash-counting hack with proper `pathname` strip; works from any directory depth
- Serendipity `→` / spacebar: advances slideshow manually, resets interval timer
- Serendipity swipe-left: touch gesture on overlay advances to next work (40px threshold, passive)
- Serendipity hint text: context-aware — touch devices see "Tap to open · Swipe left to advance"; desktop sees keyboard shortcuts
- Serendipity image size on mobile: `94vw` (was `80vw` = 300px at 375px); reverts to `min(80vw, 860px)` above 600px
- Serendipity focus trap: Tab cycles only within open dialog; focus moves to ESC button on open
- View transition: timeout reduced 100ms → 80ms

**Nav fade (_shared/top-nav.html, stamped to all 31 pages):**
- `header::after` with `rgba(11,11,11,0.07)→transparent` over 40px below nav border; subtle depth below fixed header

**artwork.html:**
- Desktop metadata column: `← → BROWSE WORKS` hint with `border-top` separator below COPY LINK — anchors empty space in right column
- Mobile: gradient title overlay at bottom of image (`rgba(11,11,11,0.58)` → transparent); title + year visible without scrolling; hidden on md+

**stories.html + why-i-made-things.html:**
- Mobile jump nav: collapsible "JUMP TO SECTION ↓" bar between page header and content; chevron rotates on open; collapses on link tap; hidden on md+ (sidebar TOC handles desktop)

**about.html:**
- Portrait photo: saturation overlay treatment matching artwork thumbnails — grey-at-top at rest, full colour on hover; inline `<style>` scoped to page

**collage.html / sculpture.html / photography.html / painting.html:**
- "Browse with filters →" extracted from `<p>` and promoted to full-width bordered button on mobile; reverts to inline link on 768px+

**lost.html:**
- Ghost grid label updated to "WORKS WITHOUT IMAGES — ESTIMATED 500–1,000" in #c4c7c7

**start-here.html:**
- Sidebar quote cards ("On loss", "On finishing"): `border-left: 2px solid #FF6600`, quote text to `#0B0B0B`, font-size 13px

**sw.js:** CACHE_V bumped to `jfsn-20260610235900`

**Files modified:**
- `_shared/jfsn-interactions.js` — full micro-interactions overhaul
- `_shared/top-nav.html` — nav fade added, stamped to all 31 pages
- `artwork.html` — desktop keyboard hint, mobile title overlay
- `stories.html` — mobile jump nav
- `why-i-made-things.html` — mobile jump nav
- `about.html` — portrait hover treatment
- `collage.html` — browse CTA, CSS
- `sculpture.html` — browse CTA, CSS
- `photography.html` — browse CTA, CSS
- `painting.html` — browse CTA, CSS
- `lost.html` — ghost grid label
- `start-here.html` — quote card visual weight
- `sw.js` — CACHE_V bumped

**⚠️ Not yet deployed — run JFSN.app**

---

## What was done last session (2026-06-10 — session 27)

*(see SESSION-26-CHECKPOINT.md for full detail)*

Session 25: Header/footer UX pass — hide-on-scroll, backdrop blur, ⌘K badge, back-to-top, dynamic copyright year, email to col 1, col 4 renamed ABOUT.

Session 26: start-here.html spacing, footer breathing room (pb-8 stamped sitewide), jeff.html full revision, sitewide content audit (all clean).

---

## To do next session
- [ ] **Deploy** — sessions 25–28 not yet on HostGator. Run JFSN.app.
- [ ] **Oral history** — "Why did Jeff keep going after the Rauschenberg realization?" — most important unanswered question. Approach gently.
- [ ] **start-here.html** — read aloud together. Oral history content is in; review for accuracy and voice.
- [ ] **Physical dimensions for surviving works** — requires Jeff to measure. No tooling exists. Essential for heirs.
- [ ] **HSTS** — uncomment one line in `.htaccess` once SSL confirmed active in HostGator cPanel.
- [ ] **favorites.html fetch size** — still uses full `catalog.json` (898KB); easy fix but low priority.

## Known issues (standing)
- **sw.js CACHE_V** — `build_catalog.py` auto-bumps only when catalog content changes. Manual bump required after HTML/CSS/JS edits without catalog rebuild.
- **index.html has no FOOTER:START marker** — custom homepage footer, not stamped. Edit directly if footer changes.
- **Decade pages not in stamp-nav.sh** — edit 1970s–2020s.html directly for any nav/footer changes.
- **about-portrait.jpg** — only JPEG in the asset pipeline; all artworks are AVIF. Low priority.
- **No physical dimensions in catalog** — `build_dims.py` reads pixel dimensions (masonry layout). Physical artwork dimensions (inches/cm) require Jeff to measure; no tooling exists.

---

## Site is live at
- jfsn.com  (primary — cPanel)
- jfsn-archive.netlify.app  (secondary — Netlify, has Companion function)

## Archive stats
- 1,084 works cataloged, 0 errors

## Backup status
**Last B2 backup:** 2026-06-10 21:04:37
