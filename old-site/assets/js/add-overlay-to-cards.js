/**
 * Add Overlay Structure to Artwork Cards
 * Adds .artwork-overlay and .artwork-overlay-inner structure for hover/tap reveal
 */

(function() {
  'use strict';

  function addOverlayToCards() {
    const cards = document.querySelectorAll('.artwork-card');
    
    cards.forEach(card => {
      // Skip if overlay already exists
      if (card.querySelector('.artwork-overlay')) return;
      
      const imageContainer = card.querySelector('.artwork-image-container');
      if (!imageContainer) return;
      
      // Get existing content
      const title = card.querySelector('.artwork-title');
      const meta = card.querySelector('.artwork-meta');
      const description = card.querySelector('.artwork-description');
      
      if (!title && !meta && !description) return;
      
      // Create overlay structure
      const overlay = document.createElement('div');
      overlay.className = 'artwork-overlay';
      
      const overlayInner = document.createElement('div');
      overlayInner.className = 'artwork-overlay-inner';
      
      // Clone title if exists
      if (title) {
        const overlayTitle = title.cloneNode(true);
        overlayTitle.className = 'artwork-title';
        overlayInner.appendChild(overlayTitle);
      }
      
      // Clone meta if exists
      if (meta) {
        const overlayMeta = meta.cloneNode(true);
        overlayMeta.className = 'artwork-meta';
        overlayInner.appendChild(overlayMeta);
      }
      
      // Clone description if exists (limit length)
      if (description) {
        const overlayDesc = description.cloneNode(true);
        overlayDesc.className = 'artwork-description';
        // Limit to 2 lines
        overlayDesc.style.display = '-webkit-box';
        overlayDesc.style.webkitLineClamp = '2';
        overlayDesc.style.webkitBoxOrient = 'vertical';
        overlayDesc.style.overflow = 'hidden';
        overlayInner.appendChild(overlayDesc);
      }
      
      overlay.appendChild(overlayInner);
      imageContainer.appendChild(overlay);
      
      // Make card focusable for mobile tap
      if (!card.hasAttribute('tabindex')) {
        card.setAttribute('tabindex', '0');
      }
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addOverlayToCards);
  } else {
    addOverlayToCards();
  }

  // Re-run when gallery updates
  const observer = new MutationObserver(() => {
    setTimeout(addOverlayToCards, 100);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Also listen for gallery update events
  document.addEventListener('galleryUpdated', () => {
    setTimeout(addOverlayToCards, 100);
  });
})();

