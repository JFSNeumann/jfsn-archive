/**
 * Enhanced Intersection Observer for Mobile Lazy Loading
 * Optimized for mobile performance with better loading strategies
 */

(function() {
  'use strict';

  const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;
  
  // ===== CONFIGURATION =====
  const config = {
    root: null,
    rootMargin: isMobile ? '100px' : '200px', // Smaller margin on mobile
    threshold: 0.01
  };

  let imageObserver = null;
  let skeletonObserver = null;

  // ===== IMAGE LAZY LOADING =====
  function initImageLazyLoading() {
    if (!('IntersectionObserver' in window)) {
      // Fallback to native lazy loading
      return;
    }

    imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          loadImage(img);
          observer.unobserve(img);
        }
      });
    }, config);

    // Observe all lazy images
    const lazyImages = document.querySelectorAll('img[loading="lazy"], img[data-lazy-src]');
    lazyImages.forEach(img => {
      // Add skeleton placeholder if not already loaded
      if (!img.complete && !img.classList.contains('skeleton-processed')) {
        addSkeletonPlaceholder(img);
        img.classList.add('skeleton-processed');
      }
      
      imageObserver.observe(img);
    });
  }

  function loadImage(img) {
    // Load from data-lazy-src if available
    if (img.dataset.lazySrc) {
      img.src = img.dataset.lazySrc;
      img.removeAttribute('data-lazy-src');
    }

    // Add loading class
    img.classList.add('lazy-loading');
    img.classList.remove('lazy-loading');

    // Handle load
    img.addEventListener('load', () => {
      img.classList.add('lazy-loaded');
      removeSkeletonPlaceholder(img);
      
      // Fade in effect
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.3s ease-in';
      requestAnimationFrame(() => {
        img.style.opacity = '1';
      });
    }, { once: true });

    // Handle error
    img.addEventListener('error', () => {
      img.classList.add('lazy-error');
      removeSkeletonPlaceholder(img);
      showImageError(img);
    }, { once: true });
  }

  function addSkeletonPlaceholder(img) {
    const container = img.parentElement;
    if (!container || container.classList.contains('skeleton-container')) return;

    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton-image skeleton';
    skeleton.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    `;
    
    container.style.position = 'relative';
    container.classList.add('skeleton-container');
    container.insertBefore(skeleton, img);
  }

  function removeSkeletonPlaceholder(img) {
    const container = img.parentElement;
    if (!container) return;
    
    const skeleton = container.querySelector('.skeleton-image');
    if (skeleton) {
      skeleton.classList.add('skeleton-fade-out');
      setTimeout(() => {
        skeleton.remove();
      }, 300);
    }
  }

  function showImageError(img) {
    const container = img.parentElement;
    if (!container) return;

    const errorDiv = document.createElement('div');
    errorDiv.className = 'image-error';
    errorDiv.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        color: #666;
        text-align: center;
      ">
        <i class="bx bx-error-circle" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
        <p style="margin: 0; font-size: 0.875rem;">Failed to load image</p>
        <button onclick="this.parentElement.parentElement.querySelector('img').src=this.parentElement.parentElement.querySelector('img').src" 
                style="margin-top: 0.5rem; padding: 0.5rem 1rem; background: #6366f1; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Retry
        </button>
      </div>
    `;
    
    container.appendChild(errorDiv);
  }

  // ===== SKELETON SCREEN OBSERVER =====
  function initSkeletonObserver() {
    if (!('IntersectionObserver' in window)) return;

    skeletonObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const skeleton = entry.target;
          // Skeleton is visible, content should load soon
          skeleton.classList.add('skeleton-visible');
        }
      });
    }, { rootMargin: '50px' });

    // Observe skeleton screens
    const skeletons = document.querySelectorAll('.skeleton-card, .skeleton-artwork-card');
    skeletons.forEach(skeleton => {
      skeletonObserver.observe(skeleton);
    });
  }

  // ===== PROGRESSIVE ENHANCEMENT =====
  function enhanceExistingLazyLoad() {
    // Enhance images that already have loading="lazy"
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    lazyImages.forEach(img => {
      // Add better loading states
      if (!img.complete) {
        img.classList.add('lazy-loading');
        
        img.addEventListener('load', () => {
          img.classList.remove('lazy-loading');
          img.classList.add('lazy-loaded');
        }, { once: true });
      }
    });
  }

  // ===== INITIALIZE =====
  function init() {
    initImageLazyLoading();
    initSkeletonObserver();
    enhanceExistingLazyLoad();
    
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-observe when new content is added
  const originalAppendChild = Node.prototype.appendChild;
  Node.prototype.appendChild = function(child) {
    const result = originalAppendChild.call(this, child);
    
    if (child.tagName === 'IMG' && (child.loading === 'lazy' || child.dataset.lazySrc)) {
      if (imageObserver) {
        imageObserver.observe(child);
      }
    }
    
    return result;
  };

  // Export for debugging
  window.mobileLazyLoad = {
    imageObserver,
    skeletonObserver,
    isMobile
  };

})();

