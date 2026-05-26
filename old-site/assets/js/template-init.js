/**
 * Template Initialization Script
 * Handles template-specific initialization
 */

(function() {
  'use strict';
  
  // Mark body as JS-enabled immediately
  document.documentElement.classList.add('js-enabled');
  
  // Immediately reveal collection cards and featured projects (before DOM ready)
  function forceRevealSections() {
    const collectionCardsRow = document.querySelector('#collections .reveal-stagger');
    const featuredProjectsRow = document.querySelector('#featured-projects .reveal-stagger');
    const featuredCards = document.querySelectorAll('#featured-projects .scroll-reveal-enhanced');
    
    if (collectionCardsRow) {
      collectionCardsRow.classList.add('revealed');
      collectionCardsRow.setAttribute('data-reveal-immediate', 'true');
      const collectionChildren = collectionCardsRow.querySelectorAll(':scope > *');
      collectionChildren.forEach((child) => {
        child.style.opacity = '1';
        child.style.transform = 'translateY(0)';
      });
    }
    
    if (featuredProjectsRow) {
      featuredProjectsRow.classList.add('revealed');
      featuredProjectsRow.setAttribute('data-reveal-immediate', 'true');
      const featuredChildren = featuredProjectsRow.querySelectorAll(':scope > *');
      featuredChildren.forEach((child) => {
        child.style.opacity = '1';
        child.style.transform = 'translateY(0)';
      });
    }
    
    featuredCards.forEach((card) => {
      card.classList.add('revealed');
      card.setAttribute('data-reveal-immediate', 'true');
    });
  }
  
  // Try immediately
  forceRevealSections();
  
  // Try again when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', forceRevealSections);
  } else {
    forceRevealSections();
  }
  
  // Final fallback after a short delay
  setTimeout(forceRevealSections, 100);
  
  // Initialize all features on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize FAB Menu
    if (typeof setupFABMenu === 'function') {
      setupFABMenu();
    }
    
    // Initialize Keyboard Shortcuts
    if (typeof setupKeyboardShortcuts === 'function') {
      setupKeyboardShortcuts();
    }
    
    // Initialize Advanced Search (if function exists)
    if (typeof setupAdvancedSearch === 'function') {
      setupAdvancedSearch();
    }
    
    // Initialize Table of Contents
    if (typeof initTableOfContents === 'function') {
      initTableOfContents();
    }
  });
})();
