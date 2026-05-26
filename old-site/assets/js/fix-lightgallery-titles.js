/**
 * Fix LightGallery Titles - Remove Duplicate Artwork Numbers
 * 
 * This script removes duplicate artwork numbers from LightGallery titles.
 * If a title is just the artwork number (e.g., "0070"), it replaces it with
 * the first line of the description or a generated title.
 */

(function() {
  'use strict';

  // Helper function to clean artwork title (remove ID number if it's just the ID)
  function cleanArtworkTitle(artwork, artworkId) {
    if (!artworkId) return artwork.title || 'Untitled';
    
    let cleanTitle = artwork.title || 'Untitled';
    
    // Remove ID pattern from beginning of title (e.g., "0101 Title" -> "Title")
    const idPattern = new RegExp(`^0?${artworkId}\\s*[-:]?\\s*`, 'i');
    cleanTitle = cleanTitle.replace(idPattern, '').trim();
    
    // If title was just the ID number (or becomes empty after cleaning), use alternative
    if (cleanTitle === '' || cleanTitle === artworkId || cleanTitle.match(/^\d{4}$/)) {
      // Use description first line, or fallback
      if (artwork.description && artwork.description.length > 0) {
        // Extract first part of description (before first sentence end)
        const descFirstLine = artwork.description.split(/[.!?]/)[0].trim();
        // Remove quotes and attribution if present
        let title = descFirstLine.replace(/^["']|["']\s*-\s*.*$/g, '').trim();
        cleanTitle = title.length > 60 ? title.substring(0, 60) + '...' : title;
      } else {
        // Fallback to category-based title or "Untitled"
        cleanTitle = artwork.category ? `${artwork.category} Artwork` : 'Untitled';
      }
    }
    
    return cleanTitle;
  }

  // Function to fix a single title element
  function fixTitleElement(titleEl) {
    const titleText = titleEl.textContent.trim();
    
    // Check if title is just a 4-digit number (like "0070" or "0137")
    if (!titleText.match(/^\d{4}$/)) {
      return; // Not a duplicate number, skip
    }
    
    // Find the artwork ID badge to get the ID
    const subHtmlContainer = titleEl.closest('.lg-artwork-details');
    if (!subHtmlContainer) return;
    
    const idBadge = subHtmlContainer.querySelector('.lg-artwork-id');
    if (!idBadge) return;
    
    const artworkIdMatch = idBadge.textContent.match(/#(\d{4})/);
    if (!artworkIdMatch) return;
    
    const artworkId = artworkIdMatch[1];
    
    // Try to find artwork in the gallery state
    let artwork = null;
    const allArtworks = window.ArtGallery?.state?.allArtworks || [];
    artwork = allArtworks.find(a => {
      const match = a.file?.match(/art(\d{4})/);
      return match && match[1] === artworkId;
    });
    
    if (artwork) {
      const cleanTitle = cleanArtworkTitle(artwork, artworkId);
      if (cleanTitle && cleanTitle !== titleText) {
        titleEl.textContent = cleanTitle;
        console.log(`✅ Fixed title for artwork #${artworkId}: "${titleText}" → "${cleanTitle}"`);
      }
    } else {
      // Fallback: use description from subHtml
      const descEl = subHtmlContainer.querySelector('.lg-artwork-description');
      if (descEl) {
        const descText = descEl.textContent.trim();
        const descFirstLine = descText.split(/[.!?]/)[0].trim();
        // Remove quotes and attribution
        const title = descFirstLine.replace(/^["']|["']\s*-\s*.*$/g, '').trim();
        const cleanTitle = title.length > 60 ? title.substring(0, 60) + '...' : title;
        if (cleanTitle && cleanTitle !== titleText) {
          titleEl.textContent = cleanTitle || 'Untitled';
          console.log(`✅ Fixed title for artwork #${artworkId} (from description): "${titleText}" → "${cleanTitle}"`);
        }
      } else {
        titleEl.textContent = 'Untitled';
        console.log(`✅ Fixed title for artwork #${artworkId}: "${titleText}" → "Untitled"`);
      }
    }
  }

  // Function to fix all titles currently visible
  function fixAllTitles() {
    const titleElements = document.querySelectorAll('.lg-sub-html .lg-artwork-title');
    titleElements.forEach(fixTitleElement);
  }

  // Use MutationObserver to watch for title changes
  function setupTitleObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // Check if a title element was added
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            // Check if it's a title element
            if (node.classList && node.classList.contains('lg-artwork-title')) {
              fixTitleElement(node);
            }
            // Check if it contains title elements
            const titleEls = node.querySelectorAll && node.querySelectorAll('.lg-artwork-title');
            if (titleEls) {
              titleEls.forEach(fixTitleElement);
            }
          }
        });
        
        // Check if text content changed
        if (mutation.type === 'characterData' || mutation.type === 'childList') {
          const titleEl = mutation.target.closest && mutation.target.closest('.lg-artwork-title');
          if (titleEl) {
            fixTitleElement(titleEl);
          }
        }
      });
    });

    // Observe the document body for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    return observer;
  }

  // Function to initialize the fix
  function initTitleFix() {
    // Fix titles immediately if gallery is already open
    if (document.querySelector('.lg-container.lg-show')) {
      setTimeout(fixAllTitles, 100);
    }

    // Set up observer
    setupTitleObserver();

    // Listen for LightGallery events
    document.addEventListener('lgAfterOpen', () => {
      setTimeout(fixAllTitles, 50);
      setTimeout(fixAllTitles, 200);
      setTimeout(fixAllTitles, 500);
    }, { once: false });

    document.addEventListener('lgAfterSlide', () => {
      setTimeout(fixAllTitles, 50);
      setTimeout(fixAllTitles, 200);
    }, { once: false });

    // Also listen for subHtml updates
    document.addEventListener('lgAfterAppendSubHtml', () => {
      setTimeout(fixAllTitles, 50);
    }, { once: false });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTitleFix);
  } else {
    initTitleFix();
  }

  // Also try to initialize after a delay to catch late-loading galleries
  setTimeout(initTitleFix, 1000);
  setTimeout(initTitleFix, 3000);

})();
