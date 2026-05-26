/**
 * Enhanced Mobile Image Optimizer
 * Uses picture element and srcset for optimal mobile performance
 */

(function() {
  'use strict';

  const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;
  if (!isMobile) return;

  // ===== OPTIMIZE IMAGES WITH PICTURE ELEMENT =====
  function optimizeImagesWithPicture() {
    const images = document.querySelectorAll('img[data-mobile-src], img[data-thumb]');
    
    images.forEach(img => {
      // Skip if already optimized
      if (img.closest('picture')) return;
      
      const thumbSrc = img.dataset.thumb || img.dataset.mobileSrc;
      const fullSrc = img.src;
      
      if (!thumbSrc || thumbSrc === fullSrc) return;
      
      // Create picture element
      const picture = document.createElement('picture');
      
      // Mobile source (thumbnail)
      const mobileSource = document.createElement('source');
      mobileSource.media = '(max-width: 768px)';
      mobileSource.srcset = thumbSrc;
      picture.appendChild(mobileSource);
      
      // Desktop source (full image)
      const desktopSource = document.createElement('source');
      desktopSource.media = '(min-width: 769px)';
      desktopSource.srcset = fullSrc;
      picture.appendChild(desktopSource);
      
      // Fallback img
      const newImg = img.cloneNode(true);
      newImg.src = thumbSrc; // Default to thumbnail
      newImg.loading = 'lazy';
      newImg.decoding = 'async';
      
      picture.appendChild(newImg);
      
      // Replace img with picture
      img.parentNode.replaceChild(picture, img);
    });
  }

  // ===== OPTIMIZE WITH SRCSET =====
  function optimizeImagesWithSrcset() {
    const images = document.querySelectorAll('img:not([srcset]):not([data-optimized])');
    
    images.forEach(img => {
      if (img.dataset.optimized) return;
      
      const src = img.src;
      if (!src || src.includes('data:')) return;
      
      // Use MobileArtworkPathConverter if available, otherwise fallback
      let thumbSrc = src;
      if (window.MobileArtworkPathConverter && window.MobileArtworkPathConverter.isMobile()) {
        thumbSrc = window.MobileArtworkPathConverter.convertToThumbPath(src);
      } else {
        // Fallback: Check if thumbnail exists
        thumbSrc = src.replace('/artworks/', '/artworks/thumbs/');
        // Skip hero images
        if (src.includes('/artworks/hero/')) {
          thumbSrc = src;
        }
      }
      
      // Add srcset for responsive images
      if (isMobile && thumbSrc !== src) {
        img.srcset = `${thumbSrc} 400w, ${src} 800w`;
        img.sizes = '(max-width: 768px) 100vw, 50vw';
        img.src = thumbSrc; // Use thumbnail as default on mobile
      }
      
      img.dataset.optimized = 'true';
    });
  }

  // ===== ENSURE LAZY LOADING =====
  function ensureLazyLoading() {
    const images = document.querySelectorAll('img:not([loading])');
    
    images.forEach((img, index) => {
      // First 3 images should be eager, rest lazy
      if (index < 3) {
        img.loading = 'eager';
        img.fetchPriority = 'high';
      } else {
        img.loading = 'lazy';
        img.fetchPriority = 'low';
      }
      
      img.decoding = 'async';
    });
  }

  // ===== ADD PLACEHOLDERS =====
  function addImagePlaceholders() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    images.forEach(img => {
      if (img.complete) return;
      
      // Add placeholder background
      img.style.backgroundColor = '#f0f0f0';
      img.style.backgroundImage = 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)';
      img.style.backgroundSize = '200% 100%';
      img.style.backgroundPosition = '200% 0';
      img.style.animation = 'skeleton-loading 1.5s infinite';
      
      // Remove placeholder when loaded
      img.addEventListener('load', () => {
        img.style.backgroundColor = 'transparent';
        img.style.backgroundImage = 'none';
        img.style.animation = 'none';
      }, { once: true });
    });
  }

  // ===== INITIALIZE =====
  function init() {
    optimizeImagesWithSrcset();
    ensureLazyLoading();
    addImagePlaceholders();
    
    // Optimize images added dynamically
    const observer = new MutationObserver(() => {
      optimizeImagesWithSrcset();
      ensureLazyLoading();
      addImagePlaceholders();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export for debugging
  window.mobileImageOptimizer = {
    optimizeImagesWithSrcset,
    ensureLazyLoading,
    addImagePlaceholders,
    isMobile
  };

})();

