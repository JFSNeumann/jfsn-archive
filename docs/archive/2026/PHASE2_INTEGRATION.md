# Phase 2 Integration Guide

## Advanced Enhancements Implemented ✅

4 new files created:
- `_shared/toast.js` — Toast notification system
- `_shared/toast.css` — Toast styles (success/error/warning/info)
- `_shared/skeleton.css` — Skeleton loader shimmer animations
- `_shared/hover-preview.js` — Metadata tooltip on hover
- `_shared/hover-preview.css` — Hover preview styling

Enhanced files:
- `_shared/lightbox.js` — Added copy-to-clipboard for work IDs (uses Toast)
- `_shared/lightbox.css` — Improved mobile layout (touch-friendly 44px targets)

## Integration Steps

### Step 1: Add CSS & JS to All Pages

Add these lines to the `<head>` section of **ALL 40 HTML files** (right before `</head>`):

```html
<!-- Phase 2 Enhancement Stylesheets -->
<link rel="stylesheet" href="/_shared/toast.css"/>
<link rel="stylesheet" href="/_shared/skeleton.css"/>
<link rel="stylesheet" href="/_shared/hover-preview.css"/>
```

Add these lines before `</body>` (after Phase 1 scripts):

```html
<!-- Phase 2 Enhancement Scripts -->
<script src="/_shared/toast.js" defer></script>
<script src="/_shared/hover-preview.js" defer></script>
```

### Step 2: Update Lightbox Script Link

**NO CHANGE NEEDED** — lightbox.js already exists and is linked in Phase 1. It now includes copy-to-clipboard functionality that automatically integrates with Toast notifications.

### Step 3: Use Toast Notifications in Your Code

Toast notifications can be triggered from anywhere:

```javascript
// Success message (auto-closes after 3s)
Toast.success('Item copied!');

// Error message
Toast.error('Failed to copy');

// Warning message
Toast.warning('Unsaved changes');

// Info message
Toast.info('Background processing...');

// Custom duration
Toast.show('Custom message', 'info', 5000);
```

Toast types: `success`, `error`, `warning`, `info`

### Step 4: Use Skeleton Loaders

Add skeleton loaders to any page with lazy-loaded content:

```html
<!-- Image skeleton -->
<div class="skeleton skeleton-image"></div>

<!-- Title skeleton -->
<div class="skeleton skeleton-title"></div>

<!-- Text skeleton (multiple lines) -->
<div class="skeleton skeleton-text"></div>

<!-- Grid of skeletons -->
<div class="skeleton-grid">
  <div class="skeleton-grid-item">
    <div class="skeleton skeleton-image"></div>
    <div class="skeleton skeleton-title"></div>
  </div>
  <!-- repeat for each item -->
</div>

<!-- Card skeleton -->
<div class="skeleton-card">
  <div class="skeleton skeleton-image"></div>
  <div class="skeleton skeleton-title"></div>
  <div class="skeleton skeleton-text"></div>
  <div class="skeleton skeleton-text"></div>
</div>
```

Replace with actual content when images/data load:

```javascript
// Hide skeleton, show content
skeleton.style.display = 'none';
actualContent.style.display = 'block';
```

### Step 5: Hover Preview Tooltips

**Automatic** — HoverPreview.js attaches to all elements with:
- `.thumb__link` class (archive thumbnails)
- `[data-work-id]` attribute

No additional HTML needed! Tooltips appear on hover showing:
- Work title
- Medium (work_type)
- Year (year_display or year)
- ID

To enable on custom elements, add `data-work-id="artNNNN"` attribute.

## Functionality Summary

### ✅ Toast Notifications
- Success, error, warning, info types
- Auto-close (configurable duration)
- Manual close button
- Stacks in top-right corner
- Mobile responsive (full width on small screens)
- Respects prefers-reduced-motion

### ✅ Skeleton Loaders
- Shimmer animation (1.5s loop)
- Image, title, text, button variants
- Grid layouts
- Card layouts
- Metadata layouts
- Respects prefers-reduced-motion

### ✅ Hover Preview Tooltips
- Shows on hover (200ms delay)
- Positioned near cursor
- Auto-adjusts if off-screen
- Shows work title, medium, year, ID
- Integrates with existing catalog data
- Touch-disabled on mobile devices
- Fully keyboard accessible

### ✅ Enhanced Lightbox (Phase 2)
- Better mobile layout (buttons at sides on phone)
- Copy work ID button with toast feedback
- Touch-friendly 44px minimum tap targets
- Improved button spacing on mobile
- Responsive breakpoints (600px, 768px)

## Performance Notes

- All CSS is ~800 lines total (minimal overhead)
- All JS is vanilla (no dependencies)
- Toast is ~150 LOC (small footprint)
- Skeleton loaders are pure CSS (zero JS)
- Hover preview is ~200 LOC (event-based, minimal DOM impact)
- All animations respect prefers-reduced-motion
- No layout shift issues (fixed positioning)

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge 88+)
- CSS: Flexbox, Grid, transform, transition, backdrop-filter
- JS: ES6+ (arrow functions, const/let, classList, addEventListener, Clipboard API)
- Fallback: Without JS, skeletons display, toasts don't show, hover preview disabled
- Fallback: Without CSS animations, site is fully functional (no visual shimmer)

## Lightbox Enhancements

### Mobile Layout Changes
- **Desktop (768px+):** Arrows on sides, classic modal layout
- **Tablet (600-768px):** Optimized button sizes (44px targets), reduced gaps
- **Mobile (<600px):** Buttons stacked horizontally at bottom, full-width image, top-right close button
- **Touch target size:** Minimum 44×44px on all interactive elements
- **Copy button:** New icon (clipboard) in lightbox-info section

### Copy to Clipboard
- Click the copy/clipboard icon to copy work ID
- Automatic Toast notification: "Copied: artNNNN"
- Works with Clipboard API (secure, no permissions needed)
- Graceful fallback if Toast is unavailable

## Testing Checklist

After integration:

1. **Check Toast Notifications**
   - Click copy button in lightbox → "Copied: artNNNN" toast appears
   - Manual test: `Toast.success('Test')` in browser console
   - Toast auto-closes after 3-4 seconds
   - Close button works
   - Multiple toasts stack vertically

2. **Check Skeleton Loaders**
   - Add `.skeleton` divs to any page
   - Verify shimmer animation smooth (1.5s loop)
   - Verify animation stops on `prefers-reduced-motion: reduce`

3. **Check Hover Preview**
   - Hover over artwork thumbnail
   - Tooltip appears with work metadata
   - Tooltip follows cursor (12px offset)
   - Adjusts if goes off-screen
   - Disappears on mouse-out (200ms grace period)

4. **Check Lightbox Mobile**
   - Test on phone: click thumbnail
   - Buttons are touch-friendly (min 44px)
   - Copy button works and triggers toast
   - Navigation arrows work with keyboard
   - Close button accessible
   - Layout doesn't shift on open/close

5. **Check Accessibility**
   - Tab through toasts and buttons
   - All controls have visible focus indicators
   - ARIA labels on all buttons
   - Keyboard navigation works (ESC to close modals)
   - Screen reader announces toasts (aria-live)

6. **Check Mobile Responsiveness**
   - Test at 375px (iPhone SE), 390px (iPhone 15), 768px (iPad)
   - No horizontal scroll
   - Touch targets are min 44×44px
   - Text is readable (min 14px font)
   - Modals fill viewport safely

## Next Steps (Phase 3)

Once Phase 2 is live and verified:
- Reveal-on-scroll animations (fade-in, slide-up)
- Form validation feedback
- Page transitions
- Lazy-load fade-in effects

## Rollback

To remove Phase 2 if needed:
1. Delete 5 new files: `toast.js`, `toast.css`, `skeleton.css`, `hover-preview.js`, `hover-preview.css`
2. Remove the 5 link/script tags from all 40 HTML pages
3. Revert `lightbox.js` and `lightbox.css` to Phase 1 versions (git checkout)

All changes are non-destructive and can be safely removed.
