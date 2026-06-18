/* page-transitions.js — Smooth page load and navigation transitions */

const PageTransitions = {
  isTransitioning: false,
  transitionDuration: 300,

  init() {
    this.setupPageLoad();
    this.setupNavigation();
  },

  setupPageLoad() {
    // Add fade-in animation to page on load
    document.addEventListener('DOMContentLoaded', () => {
      document.body.classList.add('page-loaded');

      // Trigger initial elements to fade in
      this.revealInitialElements();
    });

    // Add loading state on page start
    document.body.classList.add('page-loading');
  },

  setupNavigation() {
    // Intercept navigation links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      const isExternal = link.getAttribute('target') === '_blank' || link.hasAttribute('rel');
      const isHash = href && href.startsWith('#');
      const isAnchor = href && (href.startsWith('http') && !href.includes(window.location.hostname));

      // Skip: external links, hash links, non-http
      if (isExternal || isAnchor || !href || isHash) return;

      // Skip: links with data-no-transition
      if (link.hasAttribute('data-no-transition')) return;

      // Same page, different path
      if (href && !href.startsWith('http') && !isHash) {
        e.preventDefault();
        this.transitionTo(href);
      }
    });
  },

  transitionTo(href) {
    if (this.isTransitioning) return;

    this.isTransitioning = true;

    // Fade out current page
    document.body.classList.add('page-exiting');

    setTimeout(() => {
      // Navigate to new page
      window.location.href = href;
    }, this.transitionDuration);

    // Safety timeout to prevent stuck transitions
    setTimeout(() => {
      this.isTransitioning = false;
    }, this.transitionDuration * 2);
  },

  revealInitialElements() {
    // Auto-reveal elements with reveal classes on page load
    document.querySelectorAll('[data-reveal], .reveal-fade, .reveal-up').forEach(el => {
      if (el.classList.contains('reveal-pending')) {
        setTimeout(() => {
          el.classList.remove('reveal-pending');
          el.classList.add('reveal-visible');
        }, 50);
      }
    });
  },

  // Utility: manually trigger transition
  goto(href) {
    this.transitionTo(href);
  },

  // Utility: set custom transition duration
  setDuration(ms) {
    this.transitionDuration = ms;
  }
};

// Initialize when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => PageTransitions.init());
} else {
  PageTransitions.init();
}
