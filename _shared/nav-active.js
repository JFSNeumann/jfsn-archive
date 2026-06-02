/**
 * nav-active.js — auto-highlights the current page's nav link
 * Add <script src="_shared/nav-active.js" defer></script> to any page using the new nav.
 * Maps filename → which nav link gets orange + underline.
 */
(function () {
  const PAGE_NAV = {
    'archive.html':      'archive.html',
    'series-index.html': 'series-index.html',
    'timeline.html':     'timeline.html',
    'companion.html':    'companion.html',
    'about.html':        'about.html',
  };

  const file = location.pathname.split('/').pop() || 'index.html';
  const target = PAGE_NAV[file];
  if (!target) return;

  document.querySelectorAll('header nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === target) {
      a.classList.add('text-international-orange', 'nav-underline-active');
      a.classList.remove('text-deep-ink');
      a.setAttribute('aria-current', 'page');
    }
  });
})();
