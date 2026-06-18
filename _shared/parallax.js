/* parallax.js — Parallax scrolling depth effects */

const Parallax = {
  elements: [],
  observer: null,
  activeElements: new Set(),

  init() {
    this.setupObserver();
    this.attachToElements();
    this.setupScrollListener();
  },

  setupObserver() {
    const options = {
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.activeElements.add(entry.target);
        } else {
          this.activeElements.delete(entry.target);
        }
      });
    }, options);
  },

  attachToElements() {
    // Auto-attach to elements with parallax attributes
    const selectors = [
      '[data-parallax]',
      '[data-parallax-speed]',
      '[data-parallax-offset]'
    ];

    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        this.registerElement(el);
      });
    });
  },

  registerElement(element) {
    this.elements.push(element);
    this.observer.observe(element);
  },

  setupScrollListener() {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.updateParallax();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  },

  updateParallax() {
    this.activeElements.forEach(element => {
      const speed = parseFloat(element.getAttribute('data-parallax-speed')) || 0.5;
      const offset = parseFloat(element.getAttribute('data-parallax-offset')) || 0;

      // Get element position relative to viewport
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top;
      const elementHeight = rect.height;

      // Calculate parallax offset based on scroll position and speed
      // When element is centered in viewport, offset = 0
      const viewportCenter = window.innerHeight / 2;
      const elementCenter = elementTop + elementHeight / 2;
      const distanceFromCenter = elementCenter - viewportCenter;

      // Apply parallax transform
      const yOffset = distanceFromCenter * speed;
      element.style.transform = `translateY(${yOffset + offset}px)`;
    });
  },

  // Utility: set parallax speed for element
  setSpeed(element, speed) {
    element.setAttribute('data-parallax-speed', speed);
  },

  // Utility: trigger immediate update
  update() {
    this.updateParallax();
  }
};

// Initialize when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Parallax.init());
} else {
  Parallax.init();
}
