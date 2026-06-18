/* scroll-to-top.js — Floating button that appears on scroll */

const ScrollToTop = {
  button: null,
  threshold: 300, // Show after scrolling past 300px

  init() {
    this.createButton();
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    this.button.addEventListener('click', () => this.scrollToTop());
  },

  createButton() {
    const html = `
      <button id="scroll-to-top" class="scroll-to-top" aria-label="Scroll to top">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="19" x2="12" y2="5"></line>
          <polyline points="5 12 12 5 19 12"></polyline>
        </svg>
      </button>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
    this.button = document.getElementById('scroll-to-top');
  },

  handleScroll() {
    if (window.pageYOffset > this.threshold) {
      this.button.classList.add('scroll-to-top-show');
    } else {
      this.button.classList.remove('scroll-to-top-show');
    }
  },

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
};

// Initialize when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ScrollToTop.init());
} else {
  ScrollToTop.init();
}
