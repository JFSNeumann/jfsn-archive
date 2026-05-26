# Navbar Component

This folder contains all navbar-related files for the JFSN website.

## 📁 Structure

```
components/navbar/
├── navbar.html                    # Main navbar HTML component
├── css/
│   ├── navbar.css                 # Core navbar styles
│   ├── navbar-improvements.css    # Navbar enhancement styles
│   └── navbar-micro-animations.css # Micro-animation styles
├── js/
│   └── navbar.js                  # Navbar JavaScript functionality
└── images/
    └── jfsn-butterfly-1.png      # Navbar logo image
```

## 🚀 Usage

### Automatic Loading
The navbar is automatically loaded via `component-loader.js` on all pages:

```html
<div id="navbar-section">
  <div id="navbar-loading">Loading navigation...</div>
</div>
```

The component loader handles:
- Fetching navbar HTML
- Injecting into page
- Initializing JavaScript
- Error handling

### Manual Loading
If needed, load manually:

```html
<div id="navbar-section"></div>
<script>
  fetch('components/navbar/navbar.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('navbar-section').innerHTML = html;
      // Load navbar JS after HTML is injected
      const script = document.createElement('script');
      script.src = 'components/navbar/js/navbar.js';
      script.defer = true;
      document.head.appendChild(script);
    });
</script>
```

### JavaScript
Navbar JavaScript is automatically loaded via component-loader.js, or include manually:

```html
<script src="components/navbar/js/navbar.js" defer></script>
```

### CSS
The navbar CSS files are automatically included in:
- `assets/css/shared-components-bundle.css` (for all pages)
- `components/navbar/css/navbar-enhancements-bundle.css`

## ✨ Features

### Accessibility
- **ARIA Landmarks** - `role="banner"` for screen readers
- **Keyboard Navigation** - Full keyboard support
- **Focus Management** - Proper focus trapping
- **Screen Reader Support** - ARIA labels and live regions

### Performance
- **Lazy Loading** - Loads dynamically via component-loader.js
- **Optimized Assets** - Minified CSS/JS bundles
- **Resource Hints** - Preconnect for faster loading

### UX/UI
- **Responsive Design** - Mobile-first approach
- **Search Overlay** - Full-screen search interface
- **Quick Actions** - Get in Touch, View Work buttons
- **Breadcrumbs** - Desktop breadcrumb navigation
- **Copy URL** - One-click URL copying

## 📄 Files

### `navbar.html`
The main navbar HTML component containing:
- Announcement bar (dismissible)
- Navigation menu
- Search overlay
- Mobile menu overlay
- Quick action buttons (Get in Touch, View Work)

### `navbar.js`
JavaScript functionality for:
- Navbar initialization
- Overlay management (search, mobile menu)
- Search functionality
- Active page detection
- Keyboard navigation
- Scroll detection
- Responsive behavior

### `navbar.css`
Core navbar styles including:
- Layout and positioning
- Brand styling
- Navigation links
- Responsive breakpoints
- Scroll behavior

### `navbar-improvements.css`
Enhancement styles for:
- Hover effects
- Transitions
- Visual improvements
- UX enhancements

### `navbar-micro-animations.css`
Micro-animation styles for:
- Button interactions
- Menu transitions
- Scroll effects
- Smooth animations

## 🔗 Integration

The navbar is automatically loaded on all pages via:
1. HTML component loader script in each page
2. JavaScript initialization via `navbar.js`
3. CSS via `shared-components-bundle.css`

## 🛠️ Maintenance

When updating navbar files:
1. Edit files in this folder
2. Rebuild `shared-components-bundle.css` using `bundle-design-system.js` (if applicable)
3. Test on all pages to ensure consistency

## 📝 Notes

- All navbar files are centralized in this folder for better organization
- The navbar component is loaded dynamically via `fetch()`
- CSS is bundled into `shared-components-bundle.css` for performance
- JavaScript uses MutationObserver to detect when HTML is loaded
- Navbar is responsive and includes mobile menu support

---

**Last Updated:** December 2024  
**Maintained By:** JFSN Development Team
