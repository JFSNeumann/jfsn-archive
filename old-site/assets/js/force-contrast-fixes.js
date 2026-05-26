/**
 * Force Contrast Fixes - Ensures all badges and buttons have proper text contrast
 * This script runs after page load to fix any elements that might have been missed
 */

(function() {
  'use strict';
  
  function forceBadgeContrast() {
    // Find all badges with purple/gradient backgrounds
    const badges = document.querySelectorAll('.badge, span.badge, [class*="badge"]');
    
    badges.forEach(badge => {
      const computedStyle = window.getComputedStyle(badge);
      const bg = computedStyle.background || computedStyle.backgroundColor || '';
      const bgColor = computedStyle.backgroundColor || '';
      const classes = badge.className || '';
      
      // Check if badge has purple background or gradient
      const hasPurpleBg = bg.includes('6366f1') || 
                         bg.includes('8b5cf6') || 
                         bg.includes('purple') || 
                         bg.includes('gradient') ||
                         classes.includes('bg-primary') ||
                         classes.includes('category-badge');
      
      // Check if badge has dark gray background (secondary)
      const hasDarkBg = bg.includes('4b5563') || 
                       bg.includes('6b7280') || 
                       bg.includes('374151') ||
                       classes.includes('bg-secondary') ||
                       classes.includes('bg-dark');
      
      if (hasPurpleBg || hasDarkBg) {
        // Force white text
        badge.style.setProperty('color', '#ffffff', 'important');
        badge.style.setProperty('-webkit-text-fill-color', '#ffffff', 'important');
        badge.style.setProperty('text-shadow', '0 1px 2px rgba(0, 0, 0, 0.3)', 'important');
        
        // Fix all child elements
        Array.from(badge.children).forEach(child => {
          child.style.setProperty('color', '#ffffff', 'important');
          child.style.setProperty('-webkit-text-fill-color', '#ffffff', 'important');
        });
      }
    });
  }
  
  function forceButtonContrast() {
    // Find all primary buttons
    const buttons = document.querySelectorAll('.btn-primary, a.btn-primary, button.btn-primary, span.btn-primary, [class*="btn-primary"]');
    
    buttons.forEach(btn => {
      const computedStyle = window.getComputedStyle(btn);
      const bg = computedStyle.background || computedStyle.backgroundColor || '';
      const classes = btn.className || '';
      
      // Check if button has purple background
      const hasPurpleBg = bg.includes('6366f1') || 
                         bg.includes('8b5cf6') || 
                         bg.includes('purple') || 
                         bg.includes('gradient') ||
                         classes.includes('btn-primary');
      
      if (hasPurpleBg) {
        // Force white text
        btn.style.setProperty('color', '#ffffff', 'important');
        btn.style.setProperty('-webkit-text-fill-color', '#ffffff', 'important');
        
        // Fix all child elements
        Array.from(btn.children).forEach(child => {
          child.style.setProperty('color', '#ffffff', 'important');
          child.style.setProperty('-webkit-text-fill-color', '#ffffff', 'important');
        });
      }
    });
  }
  
  function runFixes() {
    forceBadgeContrast();
    forceButtonContrast();
  }
  
  // Run immediately if DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runFixes);
  } else {
    runFixes();
  }
  
  // Run again after a short delay to catch dynamically added content
  setTimeout(runFixes, 500);
  setTimeout(runFixes, 1000);
  
  // Watch for dynamically added elements
  function initObserver() {
    if (!document.body) {
      // Wait for body to be available
      setTimeout(initObserver, 100);
      return;
    }
    
  const observer = new MutationObserver(function(mutations) {
    let shouldRun = false;
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) { // Element node
            if (node.classList && (
              node.classList.contains('badge') || 
              node.classList.contains('btn-primary') ||
              node.querySelector('.badge') ||
              node.querySelector('.btn-primary')
            )) {
              shouldRun = true;
            }
          }
        });
      }
    });
    if (shouldRun) {
      setTimeout(runFixes, 100);
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  }
  
  // Initialize observer when body is ready
  if (document.body) {
    initObserver();
  } else {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initObserver);
    } else {
      setTimeout(initObserver, 100);
    }
  }
})();

