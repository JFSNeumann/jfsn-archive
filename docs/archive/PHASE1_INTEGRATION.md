# Phase 1 Integration Guide

## Quick Wins Implemented ✅

5 new files created:
- `_shared/lightbox.js` — Image modal (click to enlarge)
- `_shared/lightbox.css` — Modal styles
- `_shared/scroll-to-top.js` — Scroll-to-top button
- `_shared/enhancements.css` — All other styles (empty states, search glow, card gradients)

## Integration Steps

### Step 1: Add CSS & JS to All Pages

Add these lines to the `<head>` section of **ALL 31 HTML files** (right before `</head>`):

```html
<!-- Phase 1 Enhancement Stylesheets -->
<link rel="stylesheet" href="/_shared/lightbox.css"/>
<link rel="stylesheet" href="/_shared/enhancements.css"/>
```

Add these lines before `</body>` (right after existing script tags):

```html
<!-- Phase 1 Enhancement Scripts -->
<script src="/_shared/lightbox.js" defer></script>
<script src="/_shared/scroll-to-top.js" defer></script>
```

### Step 2: Add Empty State HTML (Archive & Search)

In `archive.html`, add this HTML where the grid results appear (as a fallback when no results):

```html
<!-- Empty state (shown when no results) -->
<div id="empty-state" class="empty-state" style="display: none;">
  <div class="empty-state-icon">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
    </svg>
  </div>
  <h2 class="empty-state-title">No results found</h2>
  <p class="empty-state-message">Try adjusting your filters or search terms to find what you're looking for.</p>
</div>
```

Then add this JavaScript in `archive.html` (after existing filter logic):

```javascript
// Show/hide empty state based on results
function updateEmptyState() {
  const results = document.querySelectorAll('.thumb').length;
  const emptyState = document.getElementById('empty-state');
  if (results === 0) {
    emptyState.style.display = 'flex';
  } else {
    emptyState.style.display = 'none';
  }
}
```

### Step 3: Verify Installation

After adding files to all pages:

1. **Check Lightbox**: Click any artwork thumbnail → should open in modal with prev/next arrows
2. **Check Scroll-to-Top**: Scroll down past 300px → button appears at bottom-right
3. **Check Search Glow**: Click search input → should see orange glow effect
4. **Check Card Hovers**: Hover over any card → subtle gradient background shift
5. **Check Empty States**: Filter archive to zero results → should see "No results found" message

## Files Affected

### Add to ALL 31 pages:
- 1970s.html, 1980s.html, 1990s.html, 2000s.html, 2010s.html, 2020s.html
- 404.html, about.html, api.html, archive.html, chromatic.html
- collage.html, companion.html, crosses.html, curatorial-map.html
- favorites.html, framed.html, gallery-images.html, guernica.html
- index.html, lost.html, mr-snowmann.html, painting.html
- photography.html, privacy.html, sculpture.html, series-index.html
- series.html, start-here.html, style-guide.html, targets.html
- timeline.html, torsos-faces.html, wall.html

### Specific updates:
- `archive.html` — Add empty state HTML + JavaScript
- `index.html` — (optional) Add empty state if featuring results
- All pages with `.thumb__link` thumbnails — Lightbox will auto-activate

## Functionality Summary

### ✅ Lightbox
- Click any artwork → opens in modal
- ← → arrows to navigate
- ESC to close
- Click outside to close
- "Open" button to navigate to full artwork page
- Keyboard accessible (focus indicators, ARIA labels)

### ✅ Scroll-to-Top Button
- Appears after scrolling 300px down
- Fixed position bottom-right (24px from edges)
- Smooth scroll animation
- Hover effect (color + lift)
- Fades in/out smoothly

### ✅ Search Focus Glow
- Orange glow effect on focus
- 4px border + inset glow
- Smooth transition
- Placeholder text darkens on focus

### ✅ Card Gradient Hovers
- Subtle warm gradient on hover (135° angle)
- Affects: all card elements, quote cards, components
- 200ms smooth transition
- Works on touch devices (no hover state)

### ✅ Empty States
- Shows when archive/search has zero results
- Animated fade-in (0.5s ease)
- SVG icon + title + message
- Mobile responsive

## Performance Notes

- All CSS is ~400 lines (minimal overhead)
- All JS is vanilla (no dependencies)
- Lightbox is ~100 LOC (small footprint)
- Uses requestAnimationFrame for smooth scroll
- All animations respect prefers-reduced-motion
- No layout shift issues (all fixed/absolute positioning)

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge 88+)
- CSS: Flexbox, Grid, CSS Grid, transform, transition all supported
- JS: ES6+ (arrow functions, const/let, classList, addEventListener)
- Fallback: Without JS, lightbox won't work but site functions normally
- Fallback: Without CSS animations, site is fully functional

## Next Steps (Phase 2)

Once Phase 1 is live and verified:
- Modal image lightbox enhancements (better mobile layout)
- Toast notifications (copy to clipboard)
- Skeleton loaders (image loading shimmer)
- Hover preview tooltips (metadata on hover)

## Rollback

To remove Phase 1 if needed:
1. Delete 4 new files: `lightbox.js`, `lightbox.css`, `scroll-to-top.js`, `enhancements.css`
2. Remove the 4 link/script tags from all 31 HTML pages
3. Remove empty state HTML/JS from archive.html

All changes are non-destructive and can be safely removed.
