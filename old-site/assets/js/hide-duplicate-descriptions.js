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

