/**
 * Enhanced Lazy Loading for Art Gallery
 * Uses Intersection Observer for optimal performance
 */

// Enhanced Lazy Loading with Intersection Observer
const lazyLoadConfig = {
  root: null,
  rootMargin: '200px', // Start loading 200px before entering viewport
  threshold: 0.01
};

let lazyLoadObserver = null;

function initLazyLoading() {
  // Check if Intersection Observer is supported
  if (!('IntersectionObserver' in window)) {
    return;
  }

  // Create observer instance
  lazyLoadObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.dataset.lazySrc || img.src;
        
        // Load the image
        if (img.dataset.lazySrc) {
          img.src = src;
          delete img.dataset.lazySrc;
        }
        
        // Add loaded class when image loads
        img.addEventListener('load', () => {
          img.classList.add('lazy-loaded');
          img.classList.remove('lazy-loading');
        }, { once: true });
        
        // Stop observing this image
        observer.unobserve(img);
      }
    });
  }, lazyLoadConfig);

  // Observe all images that need lazy loading
  observeLazyImages();
}

function observeLazyImages() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  
  lazyImages.forEach(img => {
    // Add loading indicator class
    if (!img.classList.contains('lazy-loaded')) {
      img.classList.add('lazy-loading');
    }
    
    // Observe the image
    if (lazyLoadObserver) {
      lazyLoadObserver.observe(img);
    }
  });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initLazyLoading);

// Re-observe when new images are added (for infinite scroll)
document.addEventListener('galleryUpdated', observeLazyImages);

// Export for use in other modules
window.initLazyLoading = initLazyLoading;
window.observeLazyImages = observeLazyImages;

