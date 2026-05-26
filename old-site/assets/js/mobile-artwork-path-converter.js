/**
 * Mobile Artwork Path Converter
 * Converts all artworks/ paths to artworks/thumbs/ on mobile devices
 * This ensures mobile devices only load thumbnail images for better performance
 */

(function() {
  'use strict';

  // Detect mobile device
  const isMobile = () => {
    return window.innerWidth <= 768 || 
           'ontouchstart' in window || 
           /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  };

  // Convert artwork path to thumbnail path
  const convertToThumbPath = (path) => {
    if (!path || typeof path !== 'string') return path;
    
    // Skip if already using thumbs
    if (path.includes('/artworks/thumbs/')) return path;
    
    // Skip hero images (they're already optimized)
    if (path.includes('/artworks/hero/')) return path;
    
    // Convert artworks/ to artworks/thumbs/
    return path.replace(/artworks\/(?!thumbs\/|hero\/)([^\/]+)/g, 'artworks/thumbs/$1');
  };

  // Convert all artwork paths in a string (for HTML content)
  const convertPathsInString = (str) => {
    if (!str || typeof str !== 'string') return str;
    
    // Pattern to match artworks/ paths (excluding thumbs and hero)
    const pattern = /(artworks\/(?!thumbs\/|hero\/)[^"'\s<>]+)/g;
    
    return str.replace(pattern, (match) => {
      return convertToThumbPath(match);
    });
  };

  // Convert image src attributes
  const convertImageSrcs = () => {
    if (!isMobile()) return;
    
    const images = document.querySelectorAll('img[src*="artworks/"]:not([src*="thumbs/"]):not([src*="hero/"])');
    
    images.forEach(img => {
      const originalSrc = img.src || img.getAttribute('src');
      if (!originalSrc) return;
      
      const thumbSrc = convertToThumbPath(originalSrc);
      if (thumbSrc !== originalSrc) {
        img.src = thumbSrc;
        // Store original for potential later use
        img.dataset.originalSrc = originalSrc;
      }
    });
  };

  // Watch for src attribute changes on images
  const watchImageSrcChanges = () => {
    if (!isMobile()) return;
    
    // Watch for src attribute changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
          const img = mutation.target;
          if (img.tagName === 'IMG') {
            const src = img.getAttribute('src') || img.src;
            if (src && src.includes('artworks/') && !src.includes('thumbs/') && !src.includes('hero/')) {
              const thumbSrc = convertToThumbPath(src);
              if (thumbSrc !== src) {
                img.src = thumbSrc;
                img.dataset.originalSrc = src;
              }
            }
          }
        }
      });
    });
    
    // Observe all images
    document.querySelectorAll('img').forEach(img => {
      observer.observe(img, { attributes: true, attributeFilter: ['src'] });
    });
    
    // Watch for new images added to DOM
    const domObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            if (node.tagName === 'IMG') {
              observer.observe(node, { attributes: true, attributeFilter: ['src'] });
              // Convert immediately if it has a src
              const src = node.src || node.getAttribute('src');
              if (src && src.includes('artworks/') && !src.includes('thumbs/') && !src.includes('hero/')) {
                const thumbSrc = convertToThumbPath(src);
                if (thumbSrc !== src) {
                  node.src = thumbSrc;
                  node.dataset.originalSrc = src;
                }
              }
            }
            // Also check for images within the added node
            node.querySelectorAll && node.querySelectorAll('img').forEach(img => {
              observer.observe(img, { attributes: true, attributeFilter: ['src'] });
              const src = img.src || img.getAttribute('src');
              if (src && src.includes('artworks/') && !src.includes('thumbs/') && !src.includes('hero/')) {
                const thumbSrc = convertToThumbPath(src);
                if (thumbSrc !== src) {
                  img.src = thumbSrc;
                  img.dataset.originalSrc = src;
                }
              }
            });
          }
        });
      });
    });
    
    domObserver.observe(document.body, { childList: true, subtree: true });
  };

  // Convert data attributes (data-src, data-full-src, etc.)
  const convertDataAttributes = () => {
    if (!isMobile()) return;
    
    const dataAttrs = ['data-src', 'data-full-src', 'data-image-src', 'data-thumb', 'data-mobile-src'];
    
    document.querySelectorAll('*').forEach(el => {
      dataAttrs.forEach(attr => {
        const value = el.getAttribute(attr);
        if (value && value.includes('artworks/') && !value.includes('thumbs/') && !value.includes('hero/')) {
          const converted = convertToThumbPath(value);
          if (converted !== value) {
            el.setAttribute(attr, converted);
          }
        }
      });
    });
  };

  // Convert href attributes in links
  const convertLinkHrefs = () => {
    if (!isMobile()) return;
    
    const links = document.querySelectorAll('a[href*="artworks/"]:not([href*="thumbs/"]):not([href*="hero/"])');
    
    links.forEach(link => {
      const originalHref = link.href || link.getAttribute('href');
      if (!originalHref) return;
      
      const thumbHref = convertToThumbPath(originalHref);
      if (thumbHref !== originalHref) {
        link.href = thumbHref;
        link.setAttribute('href', thumbHref);
        // Store original for lightbox/fullscreen views
        link.dataset.originalHref = originalHref;
      }
    });
  };

  // Convert background images
  const convertBackgroundImages = () => {
    if (!isMobile()) return;
    
    const elements = document.querySelectorAll('*');
    
    elements.forEach(el => {
      const bgImage = window.getComputedStyle(el).backgroundImage;
      if (bgImage && bgImage.includes('artworks/') && !bgImage.includes('thumbs/') && !bgImage.includes('hero/')) {
        const converted = convertPathsInString(bgImage);
        if (converted !== bgImage) {
          el.style.backgroundImage = converted;
        }
      }
      
      // Also check inline style
      const inlineBg = el.style.backgroundImage;
      if (inlineBg && inlineBg.includes('artworks/') && !inlineBg.includes('thumbs/') && !inlineBg.includes('hero/')) {
        const converted = convertPathsInString(inlineBg);
        if (converted !== inlineBg) {
          el.style.backgroundImage = converted;
        }
      }
    });
  };

  // Convert paths in JavaScript-generated HTML
  const convertDynamicContent = () => {
    if (!isMobile()) return;
    
    // Override common methods that might create artwork paths
    const originalCreateElement = document.createElement.bind(document);
    
    // Intercept innerHTML assignments
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Element node
              convertImageSrcs();
              convertDataAttributes();
              convertLinkHrefs();
              convertBackgroundImages();
            }
          });
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  };

  // Main initialization function
  const init = () => {
    if (!isMobile()) {
      // Add class to document for CSS targeting
      document.documentElement.classList.add('desktop-device');
      return;
    }
    
    // Add mobile class
    document.documentElement.classList.add('mobile-device');
    
    // Convert existing content
    convertImageSrcs();
    convertDataAttributes();
    convertLinkHrefs();
    convertBackgroundImages();
    
    // Set up for dynamic content
    convertDynamicContent();
    
    // Watch for src changes on images
    watchImageSrcChanges();
    
    // Re-run on window resize (in case device orientation changes)
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (isMobile()) {
          convertImageSrcs();
          convertDataAttributes();
          convertLinkHrefs();
          convertBackgroundImages();
        }
      }, 250);
    });
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export utility functions for use in other scripts
  window.MobileArtworkPathConverter = {
    isMobile,
    convertToThumbPath,
    convertPathsInString,
    convertImageSrcs,
    convertDataAttributes,
    convertLinkHrefs,
    convertBackgroundImages
  };

})();

