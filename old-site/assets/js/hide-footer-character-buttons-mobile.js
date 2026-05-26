/**
 * Hide Footer Character Buttons on Mobile
 * 
 * Aggressively hides purple buttons on the footer character (snowman)
 * Works even if buttons are created dynamically
 */

(function() {
  'use strict';

  // Only run on mobile
  if (window.innerWidth > 768) {
    return;
  }

  function hideCharacterButtons() {
    const characterContainer = document.querySelector('.footer-character-container');
    const profileHeader = document.querySelector('.footer-profile-header');
    const brandColumn = document.querySelector('.footer-brand-column');
    const footer = document.querySelector('.footer-enhanced');
    
    if (!characterContainer && !profileHeader && !brandColumn && !footer) {
      return;
    }

    // Find all buttons in the character area
    const selectors = [
      '.footer-character-container button',
      '.footer-character-container .btn',
      '.footer-character-container a.btn',
      '.footer-profile-header button',
      '.footer-profile-header .btn',
      '.footer-profile-header a.btn',
      '.footer-brand-column button',
      '.footer-brand-column .btn',
      '.footer-brand-column a.btn'
    ];

    // Exclude social buttons and badge
    const excludeSelectors = [
      '.social-btn',
      '.footer-badge-link',
      '.badge',
      '[role="group"][aria-label="Social media links"]',
      'nav[role="group"]'
    ];
    
    // Specifically target UX/UI feature buttons (reading mode toggle, help trigger, and back to top)
    const uxButtons = [
      '.reading-mode-toggle',
      '#readingModeToggle',
      '.help-trigger',
      '#helpTrigger',
      '.contextual-help',
      '#backToTopBtn',
      'button#backToTopBtn',
      '.back-to-top-btn',
      '[id*="backToTop"]',
      '[id*="back-to-top"]'
    ];
    
    uxButtons.forEach(selector => {
      const buttons = document.querySelectorAll(selector);
      buttons.forEach(btn => {
        btn.style.setProperty('display', 'none', 'important');
        btn.style.setProperty('visibility', 'hidden', 'important');
        btn.style.setProperty('opacity', '0', 'important');
        btn.style.setProperty('pointer-events', 'none', 'important');
        btn.style.setProperty('position', 'absolute', 'important');
        btn.style.setProperty('left', '-9999px', 'important');
        btn.style.setProperty('top', '-9999px', 'important');
        btn.style.setProperty('width', '0', 'important');
        btn.style.setProperty('height', '0', 'important');
        btn.style.setProperty('z-index', '-9999', 'important');
      });
    });

    selectors.forEach(selector => {
      const buttons = document.querySelectorAll(selector);
      buttons.forEach(btn => {
        // Skip if it's a social button or badge
        let shouldExclude = false;
        excludeSelectors.forEach(exclude => {
          if (btn.matches(exclude) || btn.closest(exclude)) {
            shouldExclude = true;
          }
        });

        if (!shouldExclude) {
          // Aggressively hide
          btn.style.setProperty('display', 'none', 'important');
          btn.style.setProperty('visibility', 'hidden', 'important');
          btn.style.setProperty('opacity', '0', 'important');
          btn.style.setProperty('pointer-events', 'none', 'important');
          btn.style.setProperty('position', 'absolute', 'important');
          btn.style.setProperty('left', '-9999px', 'important');
          btn.style.setProperty('top', '-9999px', 'important');
          btn.style.setProperty('width', '0', 'important');
          btn.style.setProperty('height', '0', 'important');
          btn.style.setProperty('z-index', '-9999', 'important');
        }
      });
    });
    
    // Also check ALL buttons in footer and hide purple ones near character
    if (footer && characterContainer) {
      const charRect = characterContainer.getBoundingClientRect();
      const allButtons = footer.querySelectorAll('button, .btn, a.btn');
      
      allButtons.forEach(btn => {
        // Skip if already excluded
        let shouldExclude = false;
        excludeSelectors.forEach(exclude => {
          if (btn.matches(exclude) || btn.closest(exclude)) {
            shouldExclude = true;
          }
        });
        
        if (shouldExclude) return;
        
        const btnRect = btn.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(btn);
        const bg = computedStyle.background || computedStyle.backgroundColor || '';
        const isPurple = bg.includes('6366f1') || 
                         bg.includes('8b5cf6') || 
                         bg.includes('rgb(99, 102, 241)') ||
                         bg.includes('rgb(139, 92, 246)');
        
        // Check if button overlaps or is near character
        const overlaps = !(btnRect.right < charRect.left || 
                          btnRect.left > charRect.right || 
                          btnRect.bottom < charRect.top || 
                          btnRect.top > charRect.bottom);
        
        const distance = Math.sqrt(
          Math.pow((btnRect.left + btnRect.width/2) - (charRect.left + charRect.width/2), 2) +
          Math.pow((btnRect.top + btnRect.height/2) - (charRect.top + charRect.height/2), 2)
        );
        
        // Hide if purple and within 300px of character center
        if (isPurple && (overlaps || distance < 300)) {
          btn.style.setProperty('display', 'none', 'important');
          btn.style.setProperty('visibility', 'hidden', 'important');
          btn.style.setProperty('opacity', '0', 'important');
          btn.style.setProperty('pointer-events', 'none', 'important');
        }
      });
    }

    // Also check for buttons with purple backgrounds
    const allButtons = document.querySelectorAll('button, .btn, a.btn');
    allButtons.forEach(btn => {
      const computedStyle = window.getComputedStyle(btn);
      const bg = computedStyle.background || computedStyle.backgroundColor || '';
      const bgColor = computedStyle.backgroundColor || '';
      
      // Check if button is purple and near character
      const isPurple = bg.includes('6366f1') || 
                       bg.includes('8b5cf6') || 
                       bgColor.includes('rgb(99, 102, 241)') ||
                       bgColor.includes('rgb(139, 92, 246)');
      
      if (isPurple) {
        // Check if it's near the character
        const rect = btn.getBoundingClientRect();
        const charRect = characterContainer?.getBoundingClientRect();
        
        if (charRect) {
          const distance = Math.abs(rect.left - charRect.right);
          // If button is within 200px of character, hide it
          if (distance < 200 && rect.top < charRect.bottom + 100) {
            // Skip if it's a social button or badge
            let shouldExclude = false;
            excludeSelectors.forEach(exclude => {
              if (btn.matches(exclude) || btn.closest(exclude)) {
                shouldExclude = true;
              }
            });

            if (!shouldExclude) {
              btn.style.setProperty('display', 'none', 'important');
              btn.style.setProperty('visibility', 'hidden', 'important');
              btn.style.setProperty('opacity', '0', 'important');
              btn.style.setProperty('pointer-events', 'none', 'important');
            }
          }
        }
      }
    });
  }

  // Run immediately
  hideCharacterButtons();

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hideCharacterButtons);
  }

  // Watch for dynamically added buttons
  const observer = new MutationObserver(() => {
    hideCharacterButtons();
  });

  // Start observing
  const footer = document.querySelector('.footer-enhanced') || document.body;
  if (footer) {
    observer.observe(footer, {
      childList: true,
      subtree: true
    });
  }

  // Also run on resize (in case viewport changes)
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (window.innerWidth <= 768) {
        hideCharacterButtons();
      }
    }, 100);
  });

})();

