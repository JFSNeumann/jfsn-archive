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
/**
 * Hide Duplicate Descriptions
 * 
 * If the artwork title matches the beginning of the description,
 * hide the description to avoid duplication.
 */

(function() {
  'use strict';

  function hideDuplicateDescriptions() {
    const artworkCards = document.querySelectorAll('.artwork-card');
    
    artworkCards.forEach(card => {
      const titleEl = card.querySelector('.artwork-title');
      const descEl = card.querySelector('.artwork-description');
      const descWrapper = card.querySelector('.artwork-description-wrapper');
      
      if (!titleEl || !descEl || !descWrapper) return;
      
      const titleText = titleEl.textContent.trim();
      const descText = descEl.textContent.trim();
      
      // Check if description starts with the same text as title (allowing for truncation)
      // Remove quotes and attribution from title for comparison
      const cleanTitle = titleText.replace(/^["']|["']\s*-\s*.*$/g, '').trim();
      const cleanDesc = descText.replace(/^["']|["']\s*-\s*.*$/g, '').trim();
      
      // If description starts with title (or title is first 60 chars of description), hide it
      if (cleanDesc.toLowerCase().startsWith(cleanTitle.toLowerCase().substring(0, Math.min(60, cleanTitle.length)).toLowerCase())) {
        descWrapper.style.display = 'none';
      } else if (cleanTitle.length > 0 && cleanDesc.length > 0) {
        // Also check if they're very similar (title is substring of description start)
        const titleWords = cleanTitle.split(/\s+/).slice(0, 5).join(' '); // First 5 words
        if (cleanDesc.toLowerCase().startsWith(titleWords.toLowerCase())) {
          descWrapper.style.display = 'none';
        }
      }
    });
  }

  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(hideDuplicateDescriptions, 500);
      setTimeout(hideDuplicateDescriptions, 1500);
    });
  } else {
    setTimeout(hideDuplicateDescriptions, 500);
    setTimeout(hideDuplicateDescriptions, 1500);
  }

  // Also run when gallery updates
  document.addEventListener('galleryUpdated', () => {
    setTimeout(hideDuplicateDescriptions, 300);
  });

  // Use MutationObserver to catch dynamically added cards
  const observer = new MutationObserver(() => {
    hideDuplicateDescriptions();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

})();

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

/**
 * Change Artwork Titles from H3 to H4
 * 
 * Converts all artwork title elements from <h3> to <h4> tags.
 */

(function() {
  'use strict';

  function changeTitlesToH4() {
    // Find all h3 elements with artwork-title class
    const h3Titles = document.querySelectorAll('h3.artwork-title');
    
    h3Titles.forEach(h3 => {
      // Create new h4 element
      const h4 = document.createElement('h4');
      
      // Copy all attributes
      Array.from(h3.attributes).forEach(attr => {
        h4.setAttribute(attr.name, attr.value);
      });
      
      // Copy innerHTML/content
      h4.innerHTML = h3.innerHTML;
      
      // Replace h3 with h4
      h3.parentNode.replaceChild(h4, h3);
    });
    
    if (h3Titles.length > 0) {
      console.log(`✅ Changed ${h3Titles.length} artwork titles from h3 to h4`);
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', changeTitlesToH4);
  } else {
    changeTitlesToH4();
  }

  // Watch for dynamically added cards
  const observer = new MutationObserver(function(mutations) {
    let shouldUpdate = false;
    
    mutations.forEach(mutation => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if added node or its children contain h3.artwork-title
            if (node.matches && node.matches('h3.artwork-title')) {
              shouldUpdate = true;
            } else if (node.querySelector && node.querySelector('h3.artwork-title')) {
              shouldUpdate = true;
            }
          }
        });
      }
    });
    
    if (shouldUpdate) {
      setTimeout(changeTitlesToH4, 50);
    }
  });

  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Also run after gallery updates
  document.addEventListener('galleryUpdated', () => {
    setTimeout(changeTitlesToH4, 100);
  });

})();

/**
 * Move Category Pills to Top Right Corner
 * 
 * Moves category badges from their current location to the top right corner
 * of artwork images, aligned with the artwork ID numbers.
 */

(function() {
  'use strict';

  function moveCategoryToTopRight() {
    const artworkCards = document.querySelectorAll('.artwork-card');
    
    artworkCards.forEach(card => {
      // Find the image container
      const imageContainer = card.querySelector('.artwork-image-container') || 
                            card.querySelector('.artwork-card-image-wrapper');
      
      if (!imageContainer) return;
      
      // Find category badge in various possible locations
      const categoryBadge = card.querySelector('.artwork-category') ||
                           card.querySelector('.artwork-meta .artwork-category') ||
                           card.querySelector('.category-badge') ||
                           card.querySelector('.badge.category-badge') ||
                           card.querySelector('.card-category') ||
                           card.querySelector('.artwork-meta');
      
      if (!categoryBadge) return;
      
      // Check if already moved
      if (categoryBadge.hasAttribute('data-moved-to-top-right')) return;
      
      // Clone and move to image container
      const clonedBadge = categoryBadge.cloneNode(true);
      clonedBadge.setAttribute('data-moved-to-top-right', 'true');
      clonedBadge.style.cssText = 'position: absolute !important; top: 0.75rem !important; right: 0.75rem !important; z-index: 10 !important;';
      
      // Add to image container
      imageContainer.appendChild(clonedBadge);
      
      // Remove original completely
      categoryBadge.remove();
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', moveCategoryToTopRight);
  } else {
    moveCategoryToTopRight();
  }

  // Watch for dynamically added cards
  const observer = new MutationObserver(function(mutations) {
    let shouldUpdate = false;
    
    mutations.forEach(mutation => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if added node is an artwork card or contains one
            if (node.matches && node.matches('.artwork-card')) {
              shouldUpdate = true;
            } else if (node.querySelector && node.querySelector('.artwork-card')) {
              shouldUpdate = true;
            }
          }
        });
      }
    });
    
    if (shouldUpdate) {
      setTimeout(moveCategoryToTopRight, 50);
    }
  });

  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Also run after gallery updates
  document.addEventListener('galleryUpdated', () => {
    setTimeout(moveCategoryToTopRight, 100);
  });

})();

/**
 * Remove Duplicate Keywords
 * 
 * Hides keyword tags that duplicate the category badge shown in the top right corner.
 */

(function() {
  'use strict';

  function removeDuplicateKeywords() {
    const artworkCards = document.querySelectorAll('.artwork-card');
    
    artworkCards.forEach(card => {
      // Find category badge in top right corner
      const imageContainer = card.querySelector('.artwork-image-container') || 
                            card.querySelector('.artwork-card-image-wrapper');
      
      if (!imageContainer) return;
      
      // Get category from badge in top right
      const categoryBadge = imageContainer.querySelector('.artwork-category') ||
                           imageContainer.querySelector('.category-badge') ||
                           imageContainer.querySelector('.badge.category-badge') ||
                           imageContainer.querySelector('.artwork-meta .artwork-category');
      
      if (!categoryBadge) return;
      
      const categoryText = categoryBadge.textContent.trim();
      if (!categoryText) return;
      
      // Find all keyword tags
      const keywordTags = card.querySelectorAll('.keyword-tag, .artwork-keywords .badge, .card-keywords .badge');
      
      keywordTags.forEach(tag => {
        const tagText = tag.textContent.trim();
        
        // If keyword matches category, hide it
        if (tagText.toLowerCase() === categoryText.toLowerCase()) {
          tag.style.display = 'none';
          tag.style.visibility = 'hidden';
          tag.style.opacity = '0';
          tag.style.height = '0';
          tag.style.margin = '0';
          tag.style.padding = '0';
        }
      });
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeDuplicateKeywords);
  } else {
    removeDuplicateKeywords();
  }

  // Watch for dynamically added cards
  const observer = new MutationObserver(function(mutations) {
    let shouldUpdate = false;
    
    mutations.forEach(mutation => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.matches && node.matches('.artwork-card')) {
              shouldUpdate = true;
            } else if (node.querySelector && node.querySelector('.artwork-card')) {
              shouldUpdate = true;
            }
          }
        });
      }
    });
    
    if (shouldUpdate) {
      setTimeout(removeDuplicateKeywords, 50);
    }
  });

  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Also run after gallery updates
  document.addEventListener('galleryUpdated', () => {
    setTimeout(removeDuplicateKeywords, 100);
  });

  // Also run after category badges are moved
  setTimeout(() => {
    removeDuplicateKeywords();
  }, 500);

})();

/**
 * Remove Category Names from Description Text
 * 
 * Removes category names (like "Guernica", "Studio", "Misc", "Mr. Snowmann") 
 * that appear embedded within artwork description text.
 */

(function() {
  'use strict';

  // List of category names to remove from descriptions
  const categoriesToRemove = [
    'Guernica',
    'Studio',
    'Misc',
    'Mr. Snowmann',
    'Mr Snowmann',
    'Torsos & Faces',
    'Art School',
    'Tracings',
    'Galleries',
    'Collaboration',
    'Framed',
    '2000s'
  ];

  function cleanDescriptionText(text, category) {
    if (!text) return text;
    
    let cleaned = text;
    
    // Remove the specific category if provided
    if (category) {
      // Remove category name with various patterns
      const patterns = [
        new RegExp(`\\b${category}\\b`, 'gi'),
        new RegExp(`\\s+${category}\\s+`, 'gi'),
        new RegExp(`${category}\\s+`, 'gi'),
        new RegExp(`\\s+${category}\\b`, 'gi')
      ];
      
      patterns.forEach(pattern => {
        cleaned = cleaned.replace(pattern, ' ');
      });
    }
    
    // Also remove all known categories
    categoriesToRemove.forEach(cat => {
      const patterns = [
        new RegExp(`\\b${cat}\\b`, 'gi'),
        new RegExp(`\\s+${cat}\\s+`, 'gi'),
        new RegExp(`${cat}\\s+`, 'gi'),
        new RegExp(`\\s+${cat}\\b`, 'gi')
      ];
      
      patterns.forEach(pattern => {
        cleaned = cleaned.replace(pattern, ' ');
      });
    });
    
    // Clean up multiple spaces
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    
    return cleaned;
  }

  function removeCategoriesFromDescriptions() {
    const artworkCards = document.querySelectorAll('.artwork-card');
    
    artworkCards.forEach(card => {
      // Find category badge
      const imageContainer = card.querySelector('.artwork-image-container') || 
                            card.querySelector('.artwork-card-image-wrapper');
      
      let category = null;
      if (imageContainer) {
        const categoryBadge = imageContainer.querySelector('.artwork-category') ||
                             imageContainer.querySelector('.category-badge') ||
                             imageContainer.querySelector('.badge.category-badge') ||
                             imageContainer.querySelector('.artwork-meta .artwork-category');
        
        if (categoryBadge) {
          category = categoryBadge.textContent.trim();
        }
      }
      
      // Find description elements
      const descriptionElements = card.querySelectorAll('.artwork-description, .card-description');
      
      descriptionElements.forEach(descEl => {
        const originalText = descEl.textContent || descEl.innerText;
        const cleanedText = cleanDescriptionText(originalText, category);
        
        if (cleanedText !== originalText) {
          descEl.textContent = cleanedText;
        }
      });
      
      // Also check title/description in artwork-title
      const titleEl = card.querySelector('.artwork-title, h4.artwork-title, h3.artwork-title');
      if (titleEl) {
        const originalText = titleEl.textContent || titleEl.innerText;
        const cleanedText = cleanDescriptionText(originalText, category);
        
        if (cleanedText !== originalText) {
          titleEl.textContent = cleanedText;
        }
      }
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeCategoriesFromDescriptions);
  } else {
    removeCategoriesFromDescriptions();
  }

  // Watch for dynamically added cards
  const observer = new MutationObserver(function(mutations) {
    let shouldUpdate = false;
    
    mutations.forEach(mutation => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.matches && node.matches('.artwork-card')) {
              shouldUpdate = true;
            } else if (node.querySelector && node.querySelector('.artwork-card')) {
              shouldUpdate = true;
            }
          }
        });
      }
      
      // Also watch for text changes
      if (mutation.type === 'characterData' || 
          (mutation.type === 'childList' && mutation.target.classList && 
           (mutation.target.classList.contains('artwork-description') || 
            mutation.target.classList.contains('artwork-title')))) {
        shouldUpdate = true;
      }
    });
    
    if (shouldUpdate) {
      setTimeout(removeCategoriesFromDescriptions, 50);
    }
  });

  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });

  // Also run after gallery updates
  document.addEventListener('galleryUpdated', () => {
    setTimeout(removeCategoriesFromDescriptions, 100);
  });

  // Also run after category badges are moved
  setTimeout(() => {
    removeCategoriesFromDescriptions();
  }, 500);

})();

/**
 * Remove Original Category Badges
 * 
 * Completely removes category badge elements from their original locations
 * in the artwork-info section, since they've been moved to the top right corner.
 */

(function() {
  'use strict';

  function removeOriginalCategoryBadges() {
    // Find all category badges in artwork-info sections
    const categoryBadges = document.querySelectorAll('.artwork-info .artwork-category, .artwork-info .artwork-meta .artwork-category, .artwork-info .category-badge, .card-body .artwork-category, .card-body .category-badge');
    
    categoryBadges.forEach(badge => {
      // Remove the element completely
      badge.remove();
    });
    
    // Also remove empty artwork-meta containers
    const metaContainers = document.querySelectorAll('.artwork-meta');
    metaContainers.forEach(meta => {
      // If meta container is empty or only contains whitespace, remove it
      if (!meta.textContent.trim() || meta.children.length === 0) {
        meta.remove();
      }
    });
    
    if (categoryBadges.length > 0) {
      console.log(`✅ Removed ${categoryBadges.length} original category badges`);
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeOriginalCategoryBadges);
  } else {
    removeOriginalCategoryBadges();
  }

  // Watch for dynamically added cards
  const observer = new MutationObserver(function(mutations) {
    let shouldUpdate = false;
    
    mutations.forEach(mutation => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.matches && (node.matches('.artwork-card') || node.matches('.artwork-info') || node.matches('.artwork-meta'))) {
              shouldUpdate = true;
            } else if (node.querySelector && node.querySelector('.artwork-card, .artwork-info, .artwork-meta')) {
              shouldUpdate = true;
            }
          }
        });
      }
    });
    
    if (shouldUpdate) {
      setTimeout(removeOriginalCategoryBadges, 50);
    }
  });

  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Also run after gallery updates
  document.addEventListener('galleryUpdated', () => {
    setTimeout(removeOriginalCategoryBadges, 100);
  });

  // Run after a delay to catch elements added by other scripts
  setTimeout(removeOriginalCategoryBadges, 500);
  setTimeout(removeOriginalCategoryBadges, 1000);

})();

