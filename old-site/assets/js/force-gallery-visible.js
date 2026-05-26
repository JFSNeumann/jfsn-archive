/**
 * Force Gallery Visible
 * Ensures gallery container is visible so JavaScript can populate it
 */

(function() {
  'use strict';

  function forceGalleryVisible() {
    const galleryContainer = document.getElementById('galleryContainer') || 
                            document.getElementById('gallery');
    
    if (galleryContainer) {
      // Remove display-none class
      galleryContainer.classList.remove('display-none');
      
      // Force visibility with inline styles (highest priority)
      galleryContainer.style.display = 'grid';
      galleryContainer.style.visibility = 'visible';
      galleryContainer.style.opacity = '1';
      galleryContainer.style.height = 'auto';
      galleryContainer.style.maxHeight = 'none';
      galleryContainer.style.overflow = 'visible';
      
      console.log('✅ Gallery container forced visible');
      
      // CRITICAL: Force images visible with inline styles (overrides CSS)
      // This ensures images are visible even if enhanced-image-loading.css loads after our CSS
      const images = galleryContainer.querySelectorAll('.artwork-card img');
      images.forEach(img => {
        img.style.opacity = '1';
        img.style.visibility = 'visible';
        img.style.display = 'block';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.position = 'absolute';
        img.style.inset = '0';
        img.style.objectFit = 'cover';
        img.style.zIndex = '2';
      });
      
      const imageContainers = galleryContainer.querySelectorAll('.artwork-image-container');
      imageContainers.forEach(container => {
        container.style.display = 'block';
        container.style.visibility = 'visible';
        container.style.opacity = '1';
        container.style.position = 'relative';
        container.style.width = '100%';
        container.style.height = 'auto';
        container.style.minHeight = '200px';
        container.style.overflow = 'hidden';
        container.style.aspectRatio = '4 / 3';
      });
      
      if (images.length > 0) {
        console.log(`✅ Forced ${images.length} images visible with inline styles`);
      }
      
      // Check if gallery is empty and trigger renderGallery if needed
      const isEmpty = !galleryContainer.innerHTML || 
                      galleryContainer.innerHTML.trim() === '' ||
                      galleryContainer.querySelectorAll('.artwork-card').length === 0;
      
      const hasArtworks = window.ArtGallery?.state?.filteredArtworks?.length > 0 ||
                          window.ArtGallery?.state?.allArtworks?.length > 0;
      
      if (isEmpty && hasArtworks) {
        console.log('🔄 Gallery empty but artworks available - triggering renderGallery', {
          filteredArtworks: window.ArtGallery?.state?.filteredArtworks?.length,
          allArtworks: window.ArtGallery?.state?.allArtworks?.length,
          hasRenderGallery: !!(window.ArtGallery?.renderGallery || window.renderGallery)
        });
        
        // Try multiple times with increasing delays
        setTimeout(() => {
          if (window.ArtGallery?.renderGallery) {
            console.log('📸 Calling ArtGallery.renderGallery()');
            try {
              window.ArtGallery.renderGallery(false, false);
            } catch (e) {
              console.error('❌ Error calling renderGallery:', e);
            }
          } else if (window.renderGallery) {
            console.log('📸 Calling window.renderGallery()');
            try {
              window.renderGallery(false, false);
            } catch (e) {
              console.error('❌ Error calling renderGallery:', e);
            }
          } else {
            console.warn('⚠️ renderGallery function not found');
          }
        }, 500);
        
        setTimeout(() => {
          if (isEmpty && hasArtworks) {
            console.log('🔄 Retry: Gallery still empty - triggering renderGallery again');
            if (window.ArtGallery?.renderGallery) {
              window.ArtGallery.renderGallery(false, false);
            } else if (window.renderGallery) {
              window.renderGallery(false, false);
            }
          }
        }, 2000);
      }
    }
  }

  // Run immediately
  forceGalleryVisible();

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', forceGalleryVisible);
  } else {
    forceGalleryVisible();
  }

  // Run after a short delay to catch late-loading scripts
  setTimeout(forceGalleryVisible, 100);
  setTimeout(forceGalleryVisible, 500);
  setTimeout(forceGalleryVisible, 1000);
  setTimeout(forceGalleryVisible, 2000);
  
  // Also listen for artwork data loading
  document.addEventListener('categoriesPopulated', () => {
    setTimeout(forceGalleryVisible, 200);
  });
  
  // Watch for ArtGallery state changes
  if (window.ArtGallery && window.ArtGallery.state) {
    const originalSetter = Object.getOwnPropertyDescriptor(window.ArtGallery.state, 'filteredArtworks')?.set;
    if (originalSetter) {
      Object.defineProperty(window.ArtGallery.state, 'filteredArtworks', {
        get: () => window.ArtGallery.state._filteredArtworks || [],
        set: (value) => {
          window.ArtGallery.state._filteredArtworks = value;
          if (value && value.length > 0) {
            setTimeout(forceGalleryVisible, 100);
          }
        },
        configurable: true
      });
    }
  }
  
  // CRITICAL: Watch for new images added to gallery and force them visible
  // This catches images added dynamically after CSS loads
  function forceImageVisible(img) {
    if (!img || img.tagName !== 'IMG') return;
    
    // Force visible with inline styles (highest CSS priority)
    img.style.opacity = '1';
    img.style.visibility = 'visible';
    img.style.display = 'block';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.position = 'absolute';
    img.style.inset = '0';
    img.style.objectFit = 'cover';
    img.style.zIndex = '2';
    
    // Also ensure container is visible
    const container = img.closest('.artwork-image-container');
    if (container) {
      container.style.display = 'block';
      container.style.visibility = 'visible';
      container.style.opacity = '1';
      container.style.position = 'relative';
      container.style.width = '100%';
      container.style.height = 'auto';
      container.style.minHeight = '200px';
      container.style.overflow = 'hidden';
      container.style.aspectRatio = '4 / 3';
    }
  }
  
  // Watch for new images added to DOM
  const imageObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // Element node
          // Check if node is an image
          if (node.tagName === 'IMG' && node.closest('.artwork-card')) {
            forceImageVisible(node);
          }
          // Check for images inside added nodes
          const images = node.querySelectorAll && node.querySelectorAll('.artwork-card img');
          if (images) {
            images.forEach(forceImageVisible);
          }
        }
      });
    });
  });
  
  // Start observing gallery container
  const galleryContainer = document.getElementById('galleryContainer') || 
                          document.getElementById('gallery');
  if (galleryContainer) {
    imageObserver.observe(galleryContainer, {
      childList: true,
      subtree: true
    });
  }
  
  // Also observe document body for gallery container creation
  const bodyObserver = new MutationObserver(() => {
    const container = document.getElementById('galleryContainer') || 
                     document.getElementById('gallery');
    if (container && !container.dataset.observed) {
      container.dataset.observed = 'true';
      imageObserver.observe(container, {
        childList: true,
        subtree: true
      });
    }
  });
  
  bodyObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
})();

