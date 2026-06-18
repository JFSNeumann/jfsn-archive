/* scroll-reveal.js — Reveal elements on scroll with fade/slide animations */

const ScrollReveal = {
  elements: [],
  observer: null,

  init() {
    this.setupObserver();
    this.attachToElements();
  },

  setupObserver() {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.reveal(entry.target);
        }
      });
    }, options);
  },

  attachToElements() {
    // Auto-attach to elements with reveal classes
    const selectors = [
      '[data-reveal="fade"]',
      '[data-reveal="fade-up"]',
      '[data-reveal="fade-down"]',
      '[data-reveal="fade-left"]',
      '[data-reveal="fade-right"]',
      '[data-reveal="scale"]',
      '.reveal-fade',
      '.reveal-up',
      '.reveal-scale'
    ];

    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        this.observe(el);
      });
    });
  },

  observe(element) {
    if (!element) return;
    element.classList.add('reveal-pending');
    this.observer.observe(element);
  },

  reveal(element) {
    element.classList.remove('reveal-pending');
    element.classList.add('reveal-visible');
    this.observer.unobserve(element);
  },

  // Utility: manually reveal an element
  revealNow(element) {
    if (element) {
      this.reveal(element);
    }
  },

  // Utility: observe custom element
  observeCustom(selector) {
    document.querySelectorAll(selector).forEach(el => {
      this.observe(el);
    });
  }
};

// Initialize when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ScrollReveal.init());
} else {
  ScrollReveal.init();
}
