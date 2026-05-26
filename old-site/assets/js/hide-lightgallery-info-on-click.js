/**
 * Hide LightGallery Info Panel on Click
 * 
 * COMMENTED OUT: This script aggressively removes the subHtml element,
 * which prevents CSS hover/focus reveal from working.
 * 
 * CSS-based approach in jfsn-authority.css (STEP 4) now handles
 * hiding/showing captions via opacity/visibility instead of DOM removal.
 */

/*
(function() {
  'use strict';

  let userHasHiddenPanel = false;
  let removalLoop = null;

  function removeSubHtml() {
    const subHtml = document.querySelector('.lg-sub-html');
    if (subHtml) {
      subHtml.remove();
      return true;
    }
    return false;
  }

  function startRemovalLoop() {
    if (removalLoop) return;
    
    removalLoop = requestAnimationFrame(function loop() {
      if (userHasHiddenPanel) {
        removeSubHtml();
        removalLoop = requestAnimationFrame(loop);
      } else {
        removalLoop = null;
      }
    });
  }

  function stopRemovalLoop() {
    if (removalLoop) {
      cancelAnimationFrame(removalLoop);
      removalLoop = null;
    }
  }

  function hideInfoPanel() {
    userHasHiddenPanel = true;
    removeSubHtml();
    startRemovalLoop();
    console.log('✅ Info panel hidden - continuous removal started');
  }

  function handleClick(e) {
    // Check if we're inside LightGallery
    const lgContainer = document.querySelector('.lg-container.lg-show');
    if (!lgContainer || !lgContainer.contains(e.target)) {
      return;
    }

    // Don't hide if clicking on controls
    if (e.target.closest('.lg-close') || 
        e.target.closest('.lg-prev') || 
        e.target.closest('.lg-next') ||
        e.target.closest('.lg-toolbar') ||
        e.target.closest('.lg-thumb-outer') ||
        e.target.closest('.lg-sub-html')) {
      return;
    }
    
    // Hide panel on click
    console.log('🖱️ Click detected - hiding info panel');
    hideInfoPanel();
  }

  // Set up click handler
  document.addEventListener('click', handleClick, true);

  // Also watch for subHtml creation and remove immediately
  const observer = new MutationObserver(() => {
    if (userHasHiddenPanel) {
      removeSubHtml();
    }
  });

  // Listen for slide changes
  document.addEventListener('lgAfterSlide', function() {
    if (userHasHiddenPanel) {
      removeSubHtml();
      startRemovalLoop();
    }
  });

  document.addEventListener('lgAfterAppendSubHtml', function() {
    if (userHasHiddenPanel) {
      removeSubHtml();
      startRemovalLoop();
    }
  });

  document.addEventListener('lgAfterOpen', function() {
    userHasHiddenPanel = false;
    stopRemovalLoop();
    
    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    console.log('🎬 LightGallery opened');
  });

  document.addEventListener('lgAfterClose', function() {
    userHasHiddenPanel = false;
    stopRemovalLoop();
    observer.disconnect();
    console.log('🚪 LightGallery closed');
  });

})();
*/