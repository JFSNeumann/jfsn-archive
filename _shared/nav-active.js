/**
 * nav-active.js — auto-highlights the current page's nav link
 * Add <script src="_shared/nav-active.js" defer></script> to any page using the new nav.
 * Maps filename → which nav link gets orange + underline.
 */
(function () {
  const PAGE_NAV = {
    'archive.html':             'archive.html',
    'series-index.html':        'archive.html',   // catalog tool — highlight Archive
    'about.html':               'about.html',
    'lost.html':                'lost.html',
    'favorites.html':           'archive.html',
    'stories.html':             'stories.html',
    'why-i-made-things.html':   'about.html',     // About cluster
    'timeline.html':            'about.html',     // About cluster
    'start-here.html':          'about.html',     // About cluster
    'collaboration.html':       'archive.html',   // medium/theme page
    'guernica.html':            'archive.html',   // series page
    'collage.html':             'archive.html',
    'sculpture.html':           'archive.html',
    'photography.html':         'archive.html',
    'painting.html':            'archive.html',
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
