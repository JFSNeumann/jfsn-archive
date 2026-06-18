# UX/UI Overhaul — Complete Implementation Plan

**Status:** In progress (Phase 1 starting 2026-06-18)  
**Scope:** 15 improvements across all pages  
**Estimated:** 30–40 hours over 4 phases  
**Deploy strategy:** Per-phase verification + staged rollout

---

## Phase 1: Foundation & Archive UX (6–8 hours)

**Goal:** Improve core discovery experience and archive page usability

### 1.1 Breadcrumbs on all pages (1 hour)
- **Files:** `_shared/top-nav.html` (template), all 31 HTML pages
- **Changes:** Add breadcrumb trail above main content
- **Style:** `Home / Archive / [Filter]` or `Home / Series / Guernica`
- **Implementation:** Generate breadcrumbs in each page template
- **Test:** All decade pages, theme pages, artwork pages

### 1.2 Archive filter UI polish (2 hours)
- **File:** `archive.html` + `_shared/ui.css`
- **Changes:**
  - Enhance filter chip styling (better remove button, visual feedback)
  - Add inline result count: "Showing X of 1,084 works"
  - Improve "Clear filters" button visibility/styling
  - Enhance empty-state messaging with suggestions
  - Add filter chip animations (fade-in + underline draw on apply)
- **Test:** Apply/remove filters, check mobile experience

### 1.3 Color coding by medium (2 hours)
- **Files:** `_shared/ui.css`, `archive.html`, decade/theme pages
- **Implementation:**
  - Define subtle background tints:
    - Collage: `#f0e8e0` (warm beige)
    - Sculpture: `#e8f0f8` (cool blue)
    - Photography: `#f0e8f0` (soft lavender)
    - Painting: `#e8f8f0` (soft mint)
  - Apply to:
    - Filter chip backgrounds (when active)
    - Grid thumbnail borders/backgrounds
    - Theme page headers
  - Create CSS custom properties for easy reuse
- **Test:** Verify colors don't break contrast, look good on cards

### 1.4 Mobile spacing & touch targets (1.5 hours)
- **Files:** `_shared/ui.css`, `site.min.css` (Tailwind)
- **Changes:**
  - Ensure all buttons/links are minimum 44px tap target
  - Increase grid card padding to 16px on mobile
  - Increase nav drawer item height/padding
  - Better spacing in filter sidebar
  - Consistent 8px/12px/16px spacing scale
- **Test:** Tap every button on iPhone 15 Pro, verify no overlap

### 1.5 Hover states — shadow lift (1 hour)
- **File:** `_shared/ui.css`
- **Changes:**
  - On card hover: add shadow lift
    - Resting: `0 0 20px rgba(0,0,0,0.05)`
    - Hover: `0 4px 20px rgba(0,0,0,0.12)` + subtle `transform: translateY(-2px)`
  - Apply to: `.archive-card`, `.thumb`, `.card-frame`, all interactive cards
  - Use `transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1)`
- **Test:** Hover on desktop, ensure smooth transitions

### 1.6 Better empty states (1 hour)
- **File:** `archive.html`
- **Changes:**
  - Enhance empty-state message
  - Show what filters are active + "Try removing X"
  - Suggest popular searches/filters
  - Add illustration or icon (can use existing SVG patterns)
- **Test:** Apply filters that return no results

---

## Phase 2: Search & Card Depth (5–6 hours)

**Goal:** Enhance search, improve visual hierarchy via shadows, add loading feedback

### 2.1 Search enhancements — archive only (2.5 hours)
- **File:** `archive.html`, `search.js` enhancement
- **Changes:**
  - Increase search input size on archive page
  - Add search icon (feather-SVG)
  - Add **search suggestions** as user types (titles, series, themes)
  - Show result count inline
  - Highlight matching results (fade non-matches slightly, emphasize matches)
  - Add "Popular searches" placeholder text with suggestions: Guernica, Photography, 1990s, Sculpture
- **Test:** Search for various terms, check suggestion quality

### 2.2 Card depth & shadow treatment (1.5 hours)
- **File:** `_shared/ui.css`
- **Changes:**
  - Archive cards: add subtle warm-brown border (#8e7164) on hover
  - Enhance shadow gradation (resting → hover → active)
  - Apply consistent shadow to decade page cards, theme page cards
  - Use layered shadows for depth: `0 2px 8px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.08)`
- **Test:** Verify visual hierarchy improves, shadows don't look heavy

### 2.3 Loading states — skeleton shimmer (1.5 hours)
- **File:** `_shared/ui.css`, `archive.html`
- **Changes:**
  - Add skeleton card placeholders (grid layout, same height/width as real cards)
  - Create shimmer animation: gradient slides left-to-right
  - Show skeleton cards while filter results load (even if perceived delay is minimal)
  - Remove skeletons when results render
- **Implementation:** CSS-only, no JavaScript loader needed
- **Test:** Verify shimmer is smooth, removes quickly

### 2.4 Link underline animations (1 hour)
- **File:** `_shared/ui.css`
- **Changes:**
  - Text links: add underline that draws from left on hover
  - Use `border-bottom: 1px solid` + `clip-path` or `text-decoration-color` transition
  - Apply to: nav links, filter underlines, breadcrumb links
- **Test:** Hover on various links, ensure underline animation is smooth

---

## Phase 3: Micro-Interactions & Polish (6–8 hours)

**Goal:** Add delighter animations, improve feedback, refine interactions

### 3.1 Card entrance stagger (1.5 hours)
- **File:** `archive.html`, `_shared/ui.css`
- **Changes:**
  - When archive grid populates, each card fades in with 30ms stagger
  - Use CSS `animation-delay: calc(var(--index) * 30ms)`
  - On filter change, re-trigger animation
  - Respect `prefers-reduced-motion`
- **Test:** Apply filter, watch smooth cascade entrance

### 3.2 Filter chip feedback (1 hour)
- **File:** `archive.html`, `_shared/ui.css`
- **Changes:**
  - On filter apply: chip pulses (scale 1.0 → 1.05 → 1.0 over 0.3s)
  - Remove button hover: orange color + small rotation
  - Add checkmark icon animation on apply
- **Test:** Apply/remove filters multiple times

### 3.3 Button press feedback (1 hour)
- **File:** `_shared/ui.css`
- **Changes:**
  - On `:active`: slight scale (1.0 → 0.98) + inset shadow
  - Return to 1.0 on release
  - Apply to: all buttons, filter chips, nav items
  - Duration: 100ms
- **Test:** Click buttons, verify tactile feedback

### 3.4 Copy-to-clipboard toast (1 hour)
- **File:** `artwork.html`, new `_shared/share.js`
- **Changes:**
  - When copying artwork URL, show toast: "Copied to clipboard"
  - Toast slides up from bottom, fades out after 2s
  - Use `position: fixed; bottom: 20px; right: 20px`
- **Implementation:** Vanilla JS, no dependencies
- **Test:** Copy URL on artwork page

### 3.5 Search result highlights (1.5 hours)
- **File:** `archive.html`, CSS
- **Changes:**
  - When search has results, non-matching cards fade to 0.5 opacity
  - Matching cards stay 1.0 opacity + subtle glow
  - Add highlight class on results
- **Test:** Search, verify fading effect

### 3.6 Breadcrumb interactions (0.5 hour)
- **File:** `_shared/top-nav.html` + CSS
- **Changes:**
  - Breadcrumbs are clickable
  - Hover: color change + underline draw
  - Click: navigate back (no page reload, smooth transition)
- **Test:** Click breadcrumbs on various pages

### 3.7 Dark mode toggle (2 hours)
- **Files:** `_shared/top-nav.html`, `_shared/ui.css`, `site.min.css`
- **Implementation:**
  - Add toggle button in header (moon/sun icon)
  - Store preference in `localStorage`
  - Respect `prefers-color-scheme`
  - Create dark palette:
    - Background: `#1a1a1a` (charcoal)
    - Text: `#e8e8e8` (off-white)
    - Accent: `#FF6600` (keep same)
    - Cards: `#2a2a2a`
  - Apply to all 31 pages via CSS custom properties
- **Test:** Toggle dark/light mode, verify all pages work

---

## Phase 4: Discovery & Refinement (6–8 hours)

**Goal:** Add curation, related works, responsive improvements, final polish

### 4.1 Related works on artwork pages (2 hours)
- **File:** `artwork.html`, `artworks/pages/` template, new JS logic
- **Changes:**
  - Below artwork detail, show 4–6 related works:
    - Same series (if applicable)
    - Same medium
    - Same decade
    - Similar color palette
  - Show as 2-column grid, with lazy-loading
  - Click to navigate to related artwork
- **Implementation:** Filter catalog.json by criteria, show top 6
- **Test:** Click through related works, verify logic

### 4.2 Curated collections section on homepage (2 hours)
- **File:** `index.html`
- **Changes:**
  - Add new section: "Explore by Theme"
  - Show 4–6 curated paths:
    - Guernica Series (232 works)
    - Photography (328 works)
    - Sculpture (76 works)
    - Favorites (45 works)
    - A theme user selects
  - Each tile: image + title + count + "Explore →"
  - Link to filtered archive or dedicated theme page
- **Design:** Use Stitch to mockup, implement in HTML
- **Test:** Click through paths, verify filter persistence

### 4.3 Responsive grid masonry (2 hours)
- **File:** `archive.html`, `site.min.css`
- **Changes:**
  - On desktop: use CSS Grid `auto-flow: dense` for masonry effect
  - On tablet: 2–3 columns (responsive)
  - Mobile: 1 column (unchanged)
  - Prioritize tall works (collages) at top, small photos below
  - Maintain aspect ratios
- **Implementation:** Use CSS Grid, no JavaScript
- **Test:** Verify layout on all breakpoints

### 4.4 Performance optimizations (1.5 hours)
- **Files:** `sw.js`, image preloads, Tailwind
- **Changes:**
  - Optimize hero preload (ensure AVIF + WebP priority)
  - Lazy-load below-fold thumbnails more aggressively
  - Consider code-splitting for archive filter logic
  - Monitor LCP/CLS post-deploy
- **Test:** Lighthouse mobile (target: LCP < 3s, CLS < 0.1)

### 4.5 Accessibility audit & polish (1.5 hours)
- **Files:** All HTML files
- **Changes:**
  - Verify WCAG AA contrast on all new colors
  - Add `aria-labels` to icon buttons
  - Verify keyboard navigation (Tab through all pages)
  - Test screen reader on new components
  - Ensure focus indicators are clear
- **Test:** Navigate entire site with keyboard only, test with screen reader

### 4.6 Final polish & testing (1 hour)
- **Changes:**
  - Cross-browser testing (Safari, Chrome, Firefox on iOS + macOS)
  - Mobile testing on iPhone 15 Pro (primary device)
  - Performance re-baseline (Lighthouse)
  - User testing (if possible)
  - Edge case handling (empty states, errors, slow networks)
- **Test:** Full site walkthrough

---

## Deployment Strategy

### Per-Phase Rollout

**Phase 1:** Breadcrumbs + Archive UX + Color coding + Mobile spacing + Hover states + Empty states
- Commit: `UX/UI Phase 1 — Archive improvements + breadcrumbs`
- Deploy: HostGator FTP
- Cache bump: `CACHE_V` in `sw.js`
- Verify: All pages load, no contrast issues, iPhone 15 Pro works

**Phase 2:** Search + Card depth + Loading states + Link animations
- Commit: `UX/UI Phase 2 — Search enhancements + shadow depth`
- Deploy: HostGator FTP
- Verify: Search works, loading shimmer smooth, no performance regression

**Phase 3:** Micro-interactions + Dark mode
- Commit: `UX/UI Phase 3 — Micro-interactions + dark mode`
- Deploy: HostGator FTP
- Verify: All animations smooth, dark mode works on all pages

**Phase 4:** Related works + Curation + Masonry + Performance
- Commit: `UX/UI Phase 4 — Discovery features + responsive grid`
- Deploy: HostGator FTP
- Final verify: Full site audit, Lighthouse re-baseline

---

## Testing Checklist (Per Phase)

- [ ] No console errors
- [ ] Mobile on iPhone 15 Pro (primary)
- [ ] Tablet (iPad landscape)
- [ ] Desktop (1920px+)
- [ ] Lighthouse mobile (LCP, CLS, Performance)
- [ ] WCAG AA contrast check
- [ ] Keyboard navigation (Tab, Shift+Tab, Enter)
- [ ] Dark mode toggle (if Phase 3+)
- [ ] Search works
- [ ] Filters apply/remove
- [ ] No performance regression
- [ ] All 31 pages load correctly

---

## Timeline

- **Phase 1:** 6–8 hours → Ready to ship by end of session
- **Phase 2:** 5–6 hours → Next session
- **Phase 3:** 6–8 hours → Next session
- **Phase 4:** 6–8 hours → Final session

**Total:** 30–40 hours over 4 sessions

---

**Next Step:** Start Phase 1 immediately. Begin with breadcrumbs on all pages, then move to archive filter improvements.
