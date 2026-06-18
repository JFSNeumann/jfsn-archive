/* lazy-load.js — Fade-in effect for lazy-loaded images */

const LazyLoad = {
  observer: null,
  loadingClass: 'lazy-loading',
  loadedClass: 'lazy-loaded',

  init() {
    this.setupObserver();
    this.attachToImages();
  },

  setupObserver() {
    const options = {
      threshold: 0.01,
      rootMargin: '50px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
        }
      });
    }, options);
  },

  attachToImages() {
    // Attach to all img[loading="lazy"]
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      this.observe(img);
    });

    // Also attach to images with data-lazy-src
    document.querySelectorAll('img[data-lazy-src]').forEach(img => {
      this.observe(img);
    });

    // Watch for dynamically added images
    this.observeDynamicImages();
  },

  observe(img) {
    img.classList.add(this.loadingClass);
    this.observer.observe(img);
  },

  loadImage(img) {
    const lazySource = img.getAttribute('data-lazy-src');
    const lazySet = img.getAttribute('data-lazy-srcset');

    // Handle data-lazy-src
    if (lazySource) {
      img.onload = () => this.onImageLoaded(img);
      img.onerror = () => this.onImageError(img);
      img.src = lazySource;

      if (lazySet) {
        img.srcset = lazySet;
      }
    } else {
      // For native lazy loading, just mark as loaded when visible
      this.onImageLoaded(img);
    }

    this.observer.unobserve(img);
  },

  onImageLoaded(img) {
    img.classList.remove(this.loadingClass);
    img.classList.add(this.loadedClass);
  },

  onImageError(img) {
    img.classList.remove(this.loadingClass);
    img.classList.add('lazy-error');
    console.warn('Failed to load image:', img.getAttribute('data-lazy-src'));
  },

  observeDynamicImages() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) { // Element node
            if (node.tagName === 'IMG') {
              if (node.hasAttribute('loading') || node.hasAttribute('data-lazy-src')) {
                this.observe(node);
              }
            } else {
              // Check descendants
              node.querySelectorAll('img[loading="lazy"], img[data-lazy-src]').forEach(img => {
                this.observe(img);
              });
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  },

  // Utility: manually load an image
  loadNow(img) {
    this.loadImage(img);
  },

  // Utility: preload image without observer
  preload(src) {
    const img = new Image();
    img.src = src;
    return new Promise((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load: ${src}`));
    });
  }
};

// Initialize when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => LazyLoad.init());
} else {
  LazyLoad.init();
}
