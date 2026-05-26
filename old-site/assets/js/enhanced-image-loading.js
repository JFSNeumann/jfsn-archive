/**
 * ENHANCED IMAGE LOADING & PERFORMANCE
 * Blur-up placeholders, aspect ratios, progressive loading
 */

(function() {
  'use strict';

  // Create low-quality placeholder from thumbnail
  function createBlurPlaceholder(imgSrc) {
    // Use thumbnail as blur placeholder
    const thumbSrc = imgSrc.replace('/artworks/', '/artworks/thumbs/');
    return `url(${thumbSrc})`;
  }

  // Load image with blur-up effect
  function loadImageWithBlur(container, imgElement) {
    const imgSrc = imgElement.dataset.src || imgElement.src;
    
    // Set blur placeholder
    container.style.setProperty('--blur-placeholder', createBlurPlaceholder(imgSrc));
    
    // Create new image for progressive loading
    const newImg = new Image();
    
    // Set up loading states
    container.classList.add('image-loading');
    container.classList.remove('image-loaded');
    
    // Load full image (CSP compliant - use addEventListener instead of onload/onerror)
    newImg.addEventListener('load', function() {
      // Update src
      imgElement.src = newImg.src;
      
      // Mark as loaded
      imgElement.classList.add('image-loaded');
      container.classList.add('image-loaded');
      container.classList.remove('image-loading', 'loading');
      
      // Dispatch custom event
      container.dispatchEvent(new CustomEvent('imageLoaded', {
        detail: { src: imgSrc }
      }));
    });
    
    newImg.addEventListener('error', function() {
      container.classList.add('image-error');
      container.classList.remove('image-loading', 'loading');
      
      // Dispatch error event
      container.dispatchEvent(new CustomEvent('imageError', {
        detail: { src: imgSrc }
      }));
    });
    
    // Start loading
    newImg.src = imgSrc;
  }

  // Initialize Intersection Observer for lazy loading
  function initLazyLoading() {
    // Support both .artwork-image-container and direct img tags in artwork cards
    const imageContainers = document.querySelectorAll('.artwork-image-container:not(.image-loaded)');
    const artworkImages = document.querySelectorAll('.artwork-card img:not(.image-loaded)');
    
    if (!('IntersectionObserver' in window)) {
      // Fallback: load all images immediately
      imageContainers.forEach(container => {
        const img = container.querySelector('img');
        if (img) loadImageWithBlur(container, img);
      });
      artworkImages.forEach(img => {
        const container = img.closest('.artwork-card') || img.parentElement;
        if (container) loadImageWithBlur(container, img);
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          
          // Handle .artwork-image-container
          if (target.classList.contains('artwork-image-container')) {
            const img = target.querySelector('img');
            if (img && !target.classList.contains('image-loaded')) {
              loadImageWithBlur(target, img);
              observer.unobserve(target);
            }
          }
          // Handle direct img tags
          else if (target.tagName === 'IMG') {
            const container = target.closest('.artwork-card') || target.parentElement;
            if (container && !target.classList.contains('image-loaded')) {
              loadImageWithBlur(container, target);
              observer.unobserve(target);
            }
          }
        }
      });
    }, {
      rootMargin: '200px', // Start loading 200px before entering viewport
      threshold: 0.01
    });

    imageContainers.forEach(container => {
      observer.observe(container);
    });
    
    artworkImages.forEach(img => {
      observer.observe(img);
    });
  }

  // Handle existing image load events
  function handleImageLoad(img) {
    const container = img.closest('.artwork-image-container');
    if (container) {
      img.classList.add('image-loaded');
      container.classList.add('image-loaded');
      container.classList.remove('loading', 'image-loading');
    }
  }

  // Expose to global scope
  window.handleImageLoad = handleImageLoad;

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLazyLoading);
  } else {
    initLazyLoading();
  }

  // Re-initialize after dynamic content loads
  document.addEventListener('galleryUpdated', initLazyLoading);
})();

