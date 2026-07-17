# CONSERVATION-CHECKLIST.md

*JFSN Archive — Pre-Release Conservation Checklist*
*Complete before every deployment or merge.*

---

## 1. Visitor Experience

- [ ] Primary navigation functions on all page types (index, archive, artwork, stories, about, lost, series-index, start-here, favorites, wall, why-i-made-things)
- [ ] No page returns a 404 or blank body
- [ ] `#lost-section` text is visible after scroll (`.reveal-section` elements receive `.revealed` class)
- [ ] Scroll-reveal animations trigger on natural scroll; confirm `core.bundle.js` IntersectionObserver is active
- [ ] Artwork images load on archive grid and individual artwork pages
- [ ] Homepage hero image loads; mosaic intro plays (or is correctly suppressed on mobile)
- [ ] Console is clean on index.html, archive.html, and one artwork page — no uncaught errors or warnings
- [ ] Search overlay opens, returns results, and closes cleanly

---

## 2. Accessibility

- [ ] `#sse-input` has `aria-label` ("Search works, themes, year…")
- [ ] `#nav-menu-btn` has `aria-expanded` (toggled by JS) and `aria-controls="mobile-menu-drawer"`
- [ ] `#mobile-menu` has `aria-hidden="true"` when closed; `aria-hidden="false"` when open
- [ ] `#cps-canvas` has `aria-hidden="true"`; parent `#cps-wrap` retains `role="img"` and its `aria-label`
- [ ] Decorative images and SVGs carry `aria-hidden="true"` or empty `alt=""`
- [ ] Tab order is logical on desktop; focus does not enter the closed mobile menu
- [ ] Closing the mobile menu returns focus to `#nav-menu-btn`
- [ ] Keyboard shortcut ⌘K opens search overlay

---

## 3. Preservation Integrity

- [ ] Total work count in archive grid matches catalog.json (1,084 works)
- [ ] Composite works (250 total) display "Photoshop composite — imagined placement" on their artwork pages; non-composite works show no badge
- [ ] Year display format is "1970s (est.)" — the `(est.)` suffix is present on all artwork pages
- [ ] Stories content and oral-history text are intact and unaltered
- [ ] Lost-works register (docs/lost-works-register.md) has not been modified unintentionally
- [ ] No catalog.json fields (title, year, series, composite, year_precision) have changed without explicit intent
- [ ] No fabricated provenance, exhibition claims, or composite-as-real imagery has been introduced

---

## 4. Runtime Integrity

- [ ] `core.bundle.js` loads after `<!-- FOOTER:END -->` on all stamped pages (not clobbered by `stamp-nav.sh`)
- [ ] `nav-early.bundle.js` and `anime.min.js` load in the SCRIPTS span on all pages
- [ ] No page loads `micro-interactions.js` (removed in H1+M1) or `analytics.js` (removed in H1+M1)
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

*Last updated: 2026-07-02*
