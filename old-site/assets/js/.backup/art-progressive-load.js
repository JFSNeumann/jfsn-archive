/**
 * Progressive Image Loading with Blur-up Effect
 * Creates smooth transitions from low-res blur to high-res sharp
 */

function initProgressiveLoading() {
  // Find all images that should use progressive loading
  const progressiveImages = document.querySelectorAll('img[loading="lazy"]');
  
  progressiveImages.forEach(img => {
    // Skip if already processed
    if (img.dataset.progressiveLoaded) return;
    
    // Mark as processed
    img.dataset.progressiveLoaded = 'true';
    
    // Add blur effect initially
    img.style.filter = 'blur(10px)';
    img.style.transform = 'scale(1.05)'; // Slightly larger to hide blur edges
    img.style.transition = 'filter 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    
    // When image loads, remove blur
    const handleLoad = () => {
      setTimeout(() => {
        img.style.filter = 'blur(0px)';
        img.style.transform = 'scale(1)';
      }, 50);
    };
    
    if (img.complete && img.naturalHeight !== 0) {
      // Image already loaded
      handleLoad();
    } else {
      // Wait for image to load
      img.addEventListener('load', handleLoad, { once: true });
    }
  });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initProgressiveLoading, 100);
});

// Re-initialize when new images are added
document.addEventListener('galleryUpdated', initProgressiveLoading);

// Export
window.initProgressiveLoading = initProgressiveLoading;

