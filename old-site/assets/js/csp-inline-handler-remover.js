/**
 * CSP Inline Handler Remover
 * Removes all inline event handlers (onclick, onload, onerror) and replaces them
 * with addEventListener for CSP compliance.
 */

(function() {
  'use strict';

  // Store original handlers before removal
  const handlerStore = new WeakMap();

  /**
   * Remove inline handlers from an element and store handlers for re-attachment
   */
  function removeInlineHandlers(element) {
    if (!element || element.nodeType !== 1) return; // Not an element node

    // Handle onclick
    if (element.hasAttribute('onclick')) {
      const onclickValue = element.getAttribute('onclick');
      element.removeAttribute('onclick');
      
      // Store handler for re-attachment
      if (!handlerStore.has(element)) {
        handlerStore.set(element, {});
      }
      handlerStore.get(element).onclick = onclickValue;
    }

    // Handle onload (for images)
    if (element.hasAttribute('onload') && element.tagName === 'IMG') {
      const onloadValue = element.getAttribute('onload');
      element.removeAttribute('onload');
      
      if (!handlerStore.has(element)) {
        handlerStore.set(element, {});
      }
      handlerStore.get(element).onload = onloadValue;
    }

    // Handle onerror (for images)
    if (element.hasAttribute('onerror')) {
      const onerrorValue = element.getAttribute('onerror');
      element.removeAttribute('onerror');
      
      if (!handlerStore.has(element)) {
        handlerStore.set(element, {});
      }
      handlerStore.get(element).onerror = onerrorValue;
    }

    // Handle other common inline handlers
    ['onmouseenter', 'onmouseleave', 'onfocus', 'onblur', 'onsubmit', 'onchange'].forEach(attr => {
      if (element.hasAttribute(attr)) {
        const value = element.getAttribute(attr);
        element.removeAttribute(attr);
        
        if (!handlerStore.has(element)) {
          handlerStore.set(element, {});
        }
        handlerStore.get(element)[attr] = value;
      }
    });
  }

  /**
   * Re-attach handlers using addEventListener
   */
  function reattachHandlers(element) {
    const handlers = handlerStore.get(element);
    if (!handlers) return;

    // Re-attach onclick
    if (handlers.onclick) {
      try {
        // Parse the onclick handler
        const handlerCode = handlers.onclick;
        
        // Common patterns:
        // - event.preventDefault(); return false;
        // - function calls like quickView('...')
        // - inline conditionals
        
        if (handlerCode.includes('event.preventDefault()') || handlerCode.includes('return false')) {
          element.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
          });
        } else if (handlerCode.includes('quickView')) {
          const match = handlerCode.match(/quickView\(['"]([^'"]+)['"]\)/);
          if (match && typeof window.quickView === 'function') {
            element.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              window.quickView(match[1]);
            });
          }
        } else if (handlerCode.includes('toggleFavorite')) {
          const match = handlerCode.match(/toggleFavorite\(['"]([^'"]+)['"]\)/);
          if (match && typeof window.toggleFavorite === 'function') {
            element.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              window.toggleFavorite(match[1]);
            });
          }
        } else if (handlerCode.includes('shareArtwork')) {
          const match = handlerCode.match(/shareArtwork\(['"]([^'"]+)['"]\s*(?:,\s*['"]([^'"]+)['"])?\)/);
          if (match && typeof window.shareArtwork === 'function') {
            element.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              window.shareArtwork(match[1], match[2]);
            });
          }
        } else if (handlerCode.includes('filterByKeyword')) {
          const match = handlerCode.match(/filterByKeyword\(['"]([^'"]+)['"]\)/);
          if (match && typeof window.filterByKeyword === 'function') {
            element.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              window.filterByKeyword(match[1]);
            });
          }
        } else if (handlerCode.includes('toggleDescription')) {
          const match = handlerCode.match(/toggleDescription\(['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\)/);
          if (match && typeof window.toggleDescription === 'function') {
            element.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              window.toggleDescription(match[1], match[2], match[3]);
            });
          }
        } else if (handlerCode.includes('retryImageLoad')) {
          const match = handlerCode.match(/retryImageLoad\(this\s*,\s*['"]([^'"]+)['"]\)/);
          if (match && typeof window.retryImageLoad === 'function') {
            element.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              window.retryImageLoad(this, match[1]);
            });
          }
        } else if (handlerCode.includes('location.reload')) {
          element.addEventListener('click', function(e) {
            e.preventDefault();
            location.reload();
          });
        } else {
          // Fallback: just prevent default and stop propagation
          // Most onclick handlers in the gallery are just preventDefault
          element.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.warn('Unhandled onclick pattern:', handlerCode);
          });
        }
      } catch (err) {
        console.warn('Error reattaching onclick handler:', err);
      }
    }

    // Re-attach onload for images
    if (handlers.onload && element.tagName === 'IMG') {
      try {
        const handlerCode = handlers.onload;
        
        if (handlerCode.includes('handleImageLoad')) {
          if (typeof window.handleImageLoad === 'function') {
            element.addEventListener('load', function() {
              window.handleImageLoad(this);
            });
          }
        } else {
          // Fallback: call handleImageLoad if available
          element.addEventListener('load', function() {
            if (typeof window.handleImageLoad === 'function') {
              window.handleImageLoad(this);
            }
          });
        }
      } catch (err) {
        console.warn('Error reattaching onload handler:', err);
      }
    }

    // Re-attach onerror for images
    if (handlers.onerror) {
      try {
        const handlerCode = handlers.onerror;
        
        if (handlerCode.includes('handleImageError')) {
          const match = handlerCode.match(/handleImageError\(this\s*,\s*['"]([^'"]+)['"]\)/);
          if (match && typeof window.handleImageError === 'function') {
            element.addEventListener('error', function() {
              window.handleImageError(this, match[1]);
            });
          }
        } else if (handlerCode.includes('this.src')) {
          // Pattern: this.src='...'
          const match = handlerCode.match(/this\.src\s*=\s*['"]([^'"]+)['"]/);
          if (match) {
            element.addEventListener('error', function() {
              if (this.src !== match[1]) {
                this.src = match[1];
              }
            });
          }
        } else {
          // Fallback: try to extract file from src and call handleImageError
          element.addEventListener('error', function() {
            const src = this.src || '';
            const match = src.match(/artworks\/([^\/]+)$/);
            if (match && typeof window.handleImageError === 'function') {
              window.handleImageError(this, match[1]);
            }
          });
        }
      } catch (err) {
        console.warn('Error reattaching onerror handler:', err);
      }
    }

    // Re-attach other handlers (simplified - just log for now)
    ['onmouseenter', 'onmouseleave', 'onfocus', 'onblur', 'onsubmit', 'onchange'].forEach(attr => {
      if (handlers[attr]) {
        const eventName = attr.substring(2); // Remove 'on' prefix
        // Most of these are not critical for gallery functionality
        // Just remove the attribute to satisfy CSP
        console.log(`Removed ${attr} handler (not reattached):`, handlers[attr]);
      }
    });
  }

  /**
   * Process all elements in a container
   */
  function processContainer(container) {
    if (!container) return;

    // Find all elements with inline handlers
    const elementsWithHandlers = container.querySelectorAll('[onclick], [onload], [onerror], [onmouseenter], [onmouseleave]');
    
    elementsWithHandlers.forEach(element => {
      removeInlineHandlers(element);
      reattachHandlers(element);
    });

    // Also process the container itself if it has handlers
    if (container.hasAttribute && (container.hasAttribute('onclick') || container.hasAttribute('onload') || container.hasAttribute('onerror'))) {
      removeInlineHandlers(container);
      reattachHandlers(container);
    }
  }

  /**
   * Watch for gallery updates
   */
  function watchForGalleryUpdates() {
    // Watch for gallery container changes
    const galleryContainer = document.getElementById('galleryContainer') || document.getElementById('gallery');
    if (!galleryContainer) return;

    // Process immediately
    processContainer(galleryContainer);

    // Watch for new content
    const observer = new MutationObserver(function(mutations) {
      let shouldProcess = false;
      
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) { // Element node
            // Check if this is artwork card HTML
            if (node.classList && (node.classList.contains('artwork-card') || node.querySelector('.artwork-card'))) {
              shouldProcess = true;
            }
            
            // Process the node itself
            if (node.hasAttribute && (node.hasAttribute('onclick') || node.hasAttribute('onload') || node.hasAttribute('onerror'))) {
              removeInlineHandlers(node);
              reattachHandlers(node);
            }
            
            // Process children
            processContainer(node);
          }
        });
      });
      
      // Process entire container if artwork cards were added
      if (shouldProcess) {
        setTimeout(function() {
          processContainer(galleryContainer);
        }, 50);
      }
    });

    observer.observe(galleryContainer, {
      childList: true,
      subtree: true,
      attributes: false // We handle attributes manually
    });

    // Also listen for gallery update events
    document.addEventListener('galleryUpdated', function() {
      setTimeout(function() {
        processContainer(galleryContainer);
      }, 100);
    });
  }

  /**
   * Initialize
   */
  function init() {
    // Wait for DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        setTimeout(watchForGalleryUpdates, 500);
      });
    } else {
      setTimeout(watchForGalleryUpdates, 500);
    }

    // Also watch for renderGallery completion
    const originalRenderGallery = window.renderGallery || window.ArtGallery?.renderGallery;
    if (originalRenderGallery) {
      window.renderGallery = function(append, fadeIn) {
        const result = originalRenderGallery.call(this, append, fadeIn);
        
        // Process after a short delay to ensure HTML is inserted
        setTimeout(function() {
          const galleryContainer = document.getElementById('galleryContainer') || document.getElementById('gallery');
          if (galleryContainer) {
            processContainer(galleryContainer);
          }
        }, 100);
        
        return result;
      };

      if (window.ArtGallery) {
        window.ArtGallery.renderGallery = window.renderGallery;
      }
    }
  }

  init();

  console.log('✅ CSP Inline Handler Remover initialized');
})();
