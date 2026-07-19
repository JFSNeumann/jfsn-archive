# CONSERVATION-CHECKLIST.md

*JFSN Archive — Pre-Release Conservation Checklist*
*Complete before every deployment or merge.*

---

## 1. Visitor Experience

- [ ] Primary navigation (`header.hud`'s exit link + room-to-room links) functions on all 14 core pages: `index`, `archive`, `current`, `guernica-passage`, `flooded-wing`, `the-studio`, `hall-of-openings`, `working-history`, `about`, `stories`, `artwork` (template, test via `?id=`), `404`, `privacy`, `sitemap`. `index.html` deliberately has no header — verify its five room-nav doors instead.
- [ ] No page returns a 404 or blank body — this includes checking for dangling links to pages deleted in the 2026-07-16 pruning (decade pages, series pages, `api.html`, `curate.html`, `qa.html`, etc.); a link pointing at one of those is a bug, the deletion itself was not
- [ ] `.reveal-el` elements receive their reveal state on scroll (`guernica-passage.html`, `the-studio.html`, `hall-of-openings.html`, `working-history.html` — the "reveal-on-walk" pattern, driven by scroll position + a heartbeat check, not IntersectionObserver)
- [ ] Full-viewport hero sections (`#door`/`#hero`) show their scroll cue (`↓`, animates, fades past 40px scroll) on all 7 pages that have one: `flooded-wing`, `guernica-passage`, `the-studio`, `hall-of-openings`, `about`, `working-history`, `stories`
- [ ] Room-veil transition (blackout fade between internal link clicks) fires correctly, and clears itself on browser back-button return (bfcache `pageshow` — verify the veil doesn't persist at `opacity:1` and block clicks; this was a real bug, fixed 2026-07-19)
- [ ] Artwork images load on archive grid and individual artwork pages (`artwork.html?id=...`)
- [ ] Homepage hero: center poster image loads; on desktop (≥1200px) the two flanking wing images crossfade through different featured works every ~11s (added 2026-07-19) — confirm they never show the same work as each other or as the center poster, and that the crossfade doesn't run under `prefers-reduced-motion` or below 1200px
- [ ] Console is clean on index.html, archive.html, and one artwork page — no uncaught errors or warnings
- [ ] Archive's inline search bar (`#search` in `archive.html`'s controls bar — not an overlay) filters the grid live, and `#sort` re-orders correctly

---

## 2. Accessibility

*There is no mobile hamburger/drawer nav or ⌘K search overlay on this site — nav is the same text-bracket `header.hud` links on every viewport. Don't check for either; check the patterns actually in use below.*

- [ ] `#search` (archive.html) has `aria-label="Search the archive"`
- [ ] `#filters-toggle` (archive.html, mobile filter collapse) has `aria-expanded` (toggled by JS) and `aria-controls="filter-groups"`
- [ ] Filter chips have `aria-pressed` reflecting active state
- [ ] Decorative/atmospheric images carry `aria-hidden="true"` on their `<figure>` and `alt=""` on the `<img>` — e.g. index.html's wing images, whose content rotates and can't carry a stable description
- [ ] `:focus-visible` styling is present and paired with `:hover` on every interactive element (cards, buttons, links, chips) — not styled hover-only
- [ ] Tab order is logical; keyboard-only navigation can reach and activate every link and control reachable by mouse
- [ ] Composite-work flag ("Photoshop composite — imagined placement") is in the visible DOM, not hidden behind a hover-only state — it must be reachable by screen readers and visible on touch

---

## 3. Preservation Integrity

- [ ] Total work count in archive grid matches catalog.json (1,084 works)
- [ ] Composite works (250 total) display "Photoshop composite — imagined placement" on their artwork pages; non-composite works show no badge
- [ ] Year display format is "1970s (est.)" — the `(est.)` suffix is present on all artwork pages
- [ ] Stories content and oral-history text are intact and unaltered
- [ ] Lost-works register (`docs/archive/2026/lost-works-register.md`) has not been modified unintentionally
- [ ] No catalog.json fields (title, year, series, composite, year_precision) have changed without explicit intent
- [ ] No fabricated provenance, exhibition claims, or composite-as-real imagery has been introduced

---

## 4. Runtime Integrity

- [ ] No page loads a shared bundle or `_shared/*.js` file — confirmed dead code as of 2026-07-19 (`core.bundle.js`, `nav-early.bundle.js`, `anime.min.js`, `stamp-nav.sh`, and the SCRIPTS/NAV stamped-span system no longer exist; each page's script is inline in its own `<head>`/end-of-`<body>`)
- [ ] No page loads `micro-interactions.js` or `analytics.js` (both removed)
- [ ] Service worker (`sw.js`): confirm `CACHE_V` was bumped after any CSS rebuild (`npm run build:css`)
- [ ] No script tag appears twice on any page
- [ ] Lazy-loaded artwork images in archive grid load on scroll
- [ ] Network tab shows no unexpected 4xx or 5xx responses

---

## 5. Experience Studio Compliance

*For every visitor-facing change before release, answer all three questions and record a decision.*

**What does this protect?**
*(State which aspect of visitor experience, accessibility, or preservation the change serves.)*

**What does this risk?**
*(State any regression, visual change, or behavioral change introduced.)*

**What does this interrupt?**
*(State any animation, interaction, or flow the change affects, even benignly.)*

**Decision:**
- [ ] Implement
- [ ] Prototype
- [ ] Reject

---

## 6. Release Decision

A release is approved only when all of the following are true:

- [ ] **No Critical issues remain.** *(Critical: broken navigation, invisible content, console errors, broken images, AT lockout.)*
- [ ] **Any Major issues are consciously accepted and documented.** *(Major: WCAG AA contrast failures, degraded animation, missing accessible names. Document in known-issues or commit message.)*
- [ ] **Minor issues are recorded for future maintenance.** *(Minor: convention inconsistencies, non-blocking AT improvements, cosmetic edge cases.)*
- [ ] **The visitor experience has not been unintentionally altered.** *(No layout shift, no animation regression, no navigation change the Experience Studio did not authorize.)*

If all boxes are checked, proceed with `bash deploy-hostgator.sh`.

---

*Last updated: 2026-07-19 — full accuracy pass; see DESIGN-SYSTEM.md's "Architecture" section for why the old shared-nav/bundle references were wrong*
