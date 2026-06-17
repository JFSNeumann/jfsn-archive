/**
 * nav-active.js — auto-highlights the current page's nav link
 * Add <script src="_shared/nav-active.js" defer></script> to any page using the new nav.
 * Maps filename → which nav link gets orange + underline.
 */
(function () {
  const PAGE_NAV = {
    'start-here.html':          'start-here.html', // START HERE
    'about.html':               'about.html',      // ABOUT JEFF
    'stories.html':             'about.html',      // About cluster
    'why-i-made-things.html':   'about.html',      // About cluster
    'timeline.html':            'about.html',      // About cluster
    'archive.html':             'archive.html',    // EXPLORE
    'favorites.html':           'archive.html',    // Explore cluster
    'chromatic.html':           'archive.html',
    'wall.html':                'archive.html',
    'curatorial-map.html':      'archive.html',
    'series-index.html':        'series-index.html', // COLLECTIONS
    'guernica.html':            'series-index.html', // Series/theme — COLLECTIONS
    'collage.html':             'archive.html',   // Medium page — EXPLORE
    'sculpture.html':           'archive.html',
    'photography.html':         'archive.html',
    'painting.html':            'archive.html',
    'collaboration.html':       'series-index.html', // Series — COLLECTIONS
    'api.html':                 'api.html',        // FOR RESEARCHERS
    'lost.html':                'lost.html',       // ARCHIVE INFO
  };

  const file = location.pathname.split('/').pop() || 'index.html';
  const target = PAGE_NAV[file];
  if (!target) return;

  // Desktop nav
  document.querySelectorAll('header nav a').forEach(a => {
    if (a.getAttribute('href') === target) {
      a.classList.add('text-international-orange', 'nav-underline-active');
      a.classList.remove('text-deep-ink');
      a.setAttribute('aria-current', 'page');
    }
  });

  // Mobile drawer
  document.querySelectorAll('#mobile-menu-drawer a').forEach(a => {
    if (a.getAttribute('href') === target) {
      a.classList.add('drawer-active');
      a.setAttribute('aria-current', 'page');
    }
  });
})();
