/**
 * Footer Component JavaScript
 * Handles footer interactions: scroll progress, orb effects, taco hover
 */

(function() {
  'use strict';
  
  function initFooter() {
    // Fix footer image paths to work from any directory level
    function fixFooterImagePaths() {
      // Calculate relative path to root
      const path = window.location.pathname;
      const depth = path.split('/').filter(p => p && !p.endsWith('.html')).length;
      const rootPath = depth > 0 ? '../'.repeat(depth) : './';
      
      // Fix profile image path
      const footerCharacter = document.querySelector('.footer-character');
      if (footerCharacter) {
        const src = footerCharacter.getAttribute('src');
        if (src && (src.startsWith('/template/') || src.startsWith('template/'))) {
          // Convert to relative path from current location
          const relativePath = src.startsWith('/') ? src.substring(1) : src;
          footerCharacter.src = rootPath + relativePath;
        }
      }
      
      // Fix TACO image path
      const tacoImg = document.querySelector('.taco-img');
      if (tacoImg) {
        const src = tacoImg.getAttribute('src');
        if (src && (src.startsWith('/template/') || src.startsWith('template/'))) {
          const relativePath = src.startsWith('/') ? src.substring(1) : src;
          tacoImg.src = rootPath + relativePath;
        }
      }
    }
    
    // Fix paths after footer loads
    fixFooterImagePaths();
    setTimeout(fixFooterImagePaths, 100);
    setTimeout(fixFooterImagePaths, 500);
    
    // Scroll Progress Indicator
    const scrollProgress = document.querySelector('.footer-scroll-progress');
    const scrollProgressBar = document.querySelector('.footer-scroll-progress-bar');
    
    function updateScrollProgress() {
      if (!scrollProgress || !scrollProgressBar) return;
      
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollableHeight = documentHeight - windowHeight;
      const scrollPercentage = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;
      
      scrollProgressBar.style.width = Math.min(scrollPercentage, 100) + '%';
      scrollProgress.setAttribute('aria-valuenow', Math.round(scrollPercentage));
    }
    
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();
    
    // Footer Character Hover Effects (Orb + Taco)
    const footerCharacter = document.querySelector('.footer-character');
    const footerCharacterContainer = document.querySelector('.footer-character-container');
    const orbTest = document.querySelector('.orb-test');
    const tacoImage = document.querySelector('.taco-hover-image');
    const tacoImg = tacoImage?.querySelector('img');
    let colorTimeout;
    

    // Add footer-loaded class when image loads (for progressive disclosure)
    // This ensures the image is visible even if footer-enhancements.js hasn't run yet
    if (footerCharacter) {
      const markAsLoaded = () => {
        footerCharacter.classList.add('footer-loaded');
      };
      
      if (footerCharacter.complete && footerCharacter.naturalHeight !== 0) {
        // Image already loaded
        markAsLoaded();
      } else {
        // Wait for image to load
        footerCharacter.addEventListener('load', markAsLoaded, { once: true });
        footerCharacter.addEventListener('error', markAsLoaded, { once: true });
        
        // Fallback: if image doesn't load within 2 seconds, show it anyway
        setTimeout(() => {
          if (!footerCharacter.classList.contains('footer-loaded')) {
            markAsLoaded();
          }
        }, 2000);
      }
    }

    // Initialize TACO animation - check for elements
    // Wait a bit for footer to be fully loaded
    setTimeout(() => {
      const tacoImageRetry = document.querySelector('.taco-hover-image');
      const footerCharacterRetry = document.querySelector('.footer-character');
      const footerCharacterContainerRetry = document.querySelector('.footer-character-container');
      const orbTestRetry = document.querySelector('.orb-test');
      
      if (tacoImageRetry && (footerCharacterRetry || footerCharacterContainerRetry)) {
        // Use footerCharacterContainer for better hover area
        const hoverTarget = footerCharacterContainerRetry || footerCharacterRetry;
        let isHovering = false;
        let visibilityCheckInterval = null;
        const tacoImgRetry = tacoImageRetry.querySelector('img');
        
        const keepTacoVisible = () => {
          if (isHovering && tacoImageRetry) {
            // Continuously ensure TACO stays visible while hovering
            tacoImageRetry.classList.remove('exiting');
            tacoImageRetry.classList.add('visible');
            // Force display
            tacoImageRetry.style.display = 'block';
            tacoImageRetry.style.opacity = '1';
            tacoImageRetry.style.visibility = 'visible';
            tacoImageRetry.style.zIndex = '99999';
            tacoImageRetry.style.position = 'fixed';
            tacoImageRetry.style.right = '160px';
            tacoImageRetry.style.bottom = '135px';
          }
        };
        
        hoverTarget.addEventListener('mouseenter', () => {
          isHovering = true;
          if (orbTestRetry) {
            orbTestRetry.style.opacity = '1';
          }
          if (tacoImageRetry) {
            // Remove exiting class and ensure visible
            tacoImageRetry.classList.remove('exiting');
            tacoImageRetry.classList.add('visible');
            // Force display and visibility
            tacoImageRetry.style.display = 'block';
            tacoImageRetry.style.opacity = '1';
            tacoImageRetry.style.visibility = 'visible';
            tacoImageRetry.style.zIndex = '99999';
            tacoImageRetry.style.position = 'fixed';
            tacoImageRetry.style.right = '160px';
            tacoImageRetry.style.bottom = '135px';
            tacoImageRetry.style.transform = 'translateY(0) scale(1)';
            
            // Start checking visibility periodically
            if (visibilityCheckInterval) {
              clearInterval(visibilityCheckInterval);
            }
            visibilityCheckInterval = setInterval(keepTacoVisible, 100);
          }
          if (tacoImgRetry) {
            colorTimeout = setTimeout(() => {
              if (isHovering && tacoImgRetry) {
                tacoImgRetry.classList.add('taco-colored');
              }
            }, 1000);
          }
        });
        
        hoverTarget.addEventListener('mouseleave', () => {
          isHovering = false;
          if (orbTestRetry) {
            orbTestRetry.style.opacity = '0';
          }
          
          // Stop visibility check
          if (visibilityCheckInterval) {
            clearInterval(visibilityCheckInterval);
            visibilityCheckInterval = null;
          }
          
          if (colorTimeout) {
            clearTimeout(colorTimeout);
            colorTimeout = null;
          }
          if (tacoImageRetry) {
            tacoImageRetry.classList.add('exiting');
            tacoImageRetry.classList.remove('visible');
            // Force hide
            setTimeout(() => {
              if (!isHovering && tacoImageRetry) {
                tacoImageRetry.style.opacity = '0';
                tacoImageRetry.style.visibility = 'hidden';
              }
            }, 400);
          }
          if (tacoImgRetry) {
            tacoImgRetry.classList.remove('taco-colored');
          }
        });
        
        // Ensure taco is hidden initially
        if (tacoImageRetry) {
          tacoImageRetry.classList.remove('visible');
          tacoImageRetry.classList.remove('exiting');
          tacoImageRetry.style.opacity = '0';
          tacoImageRetry.style.visibility = 'hidden';
        }
      }
    }, 500);
    
    // Also try immediately
    if (footerCharacter || footerCharacterContainer) {
      // Use footerCharacterContainer for better hover area
      const hoverTarget = footerCharacterContainer || footerCharacter;
      let isHovering = false;
      let visibilityCheckInterval = null;
      
      const keepTacoVisible = () => {
        if (isHovering && tacoImage) {
          // Continuously ensure TACO stays visible while hovering
          tacoImage.classList.remove('exiting');
          tacoImage.classList.add('visible');
          // Force display
          tacoImage.style.display = 'block';
          tacoImage.style.opacity = '1';
          tacoImage.style.visibility = 'visible';
          tacoImage.style.zIndex = '99999';
          tacoImage.style.position = 'fixed';
          tacoImage.style.right = '160px';
          tacoImage.style.bottom = '135px';
        }
      };
      
      hoverTarget.addEventListener('mouseenter', () => {
        isHovering = true;
        if (orbTest) {
          orbTest.style.opacity = '1';
        }
        if (tacoImage) {
          // Remove exiting class and ensure visible
          tacoImage.classList.remove('exiting');
          tacoImage.classList.add('visible');
          // Force display and visibility
          tacoImage.style.display = 'block';
          tacoImage.style.opacity = '1';
          tacoImage.style.visibility = 'visible';
          tacoImage.style.zIndex = '99999';
          tacoImage.style.position = 'fixed';
          tacoImage.style.right = '160px';
          tacoImage.style.bottom = '135px';
          tacoImage.style.transform = 'translateY(0) scale(1)';
          
          // Start checking visibility periodically
          if (visibilityCheckInterval) {
            clearInterval(visibilityCheckInterval);
          }
          visibilityCheckInterval = setInterval(keepTacoVisible, 100);
        }
        if (tacoImg) {
          colorTimeout = setTimeout(() => {
            if (isHovering && tacoImg) {
              tacoImg.classList.add('taco-colored');
            }
          }, 1000);
        }
      });
      
      hoverTarget.addEventListener('mouseleave', () => {
        isHovering = false;
        if (orbTest) {
          orbTest.style.opacity = '0';
        }
        
        // Stop visibility check
        if (visibilityCheckInterval) {
          clearInterval(visibilityCheckInterval);
          visibilityCheckInterval = null;
        }
        
        if (colorTimeout) {
          clearTimeout(colorTimeout);
          colorTimeout = null;
        }
        if (tacoImage) {
          tacoImage.classList.add('exiting');
          tacoImage.classList.remove('visible');
          // Force hide
          setTimeout(() => {
            if (!isHovering && tacoImage) {
              tacoImage.style.opacity = '0';
              tacoImage.style.visibility = 'hidden';
            }
          }, 400);
        }
        if (tacoImg) {
          tacoImg.classList.remove('taco-colored');
        }
      });
      
      // Ensure taco is hidden initially
      if (tacoImage) {
        tacoImage.classList.remove('visible');
        tacoImage.classList.remove('exiting');
        tacoImage.style.opacity = '0';
        tacoImage.style.visibility = 'hidden';
      }
    }

    // Footer Character Click - Scroll to Top (Enhanced with keyboard support)
    if (footerCharacterContainer) {
      const scrollToTop = () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        // Announce to screen readers
        const announcement = document.createElement('div');
        announcement.className = 'footer-announcement';
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.textContent = 'Scrolled to top of page';
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
      };
      
      footerCharacterContainer.addEventListener('click', scrollToTop);
      footerCharacterContainer.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          scrollToTop();
        }
      });
      // Remove title attribute to prevent tooltip (tooltip removal requested)
      footerCharacterContainer.removeAttribute('title');
      // Cursor style handled by CSS (.footer-character-container { cursor: pointer; })
    }

    // Footer Dropdown Menu
    const footerDropdowns = document.querySelectorAll('.footer-dropdown');
    footerDropdowns.forEach(dropdown => {
      const toggle = dropdown.querySelector('.footer-dropdown-toggle');
      const menu = dropdown.querySelector('.footer-dropdown-menu');
      
      if (!toggle || !menu) return;
      
      // Toggle dropdown on click
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !isExpanded);
      });
      
      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
      
      // Keyboard support
      toggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
          toggle.setAttribute('aria-expanded', !isExpanded);
        }
        if (e.key === 'Escape') {
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }
  
  // Export initFooter for manual initialization
  // The footer loader script will call initFooter() after footer HTML is inserted
  window.initFooter = initFooter;
  
  // Auto-initialize only if footer HTML is already in the DOM
  // Otherwise, wait for footer loader script to call initFooter() manually
  if (document.querySelector('.footer-enhanced')) {
    // Footer HTML already exists, initialize immediately
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initFooter);
    } else {
      initFooter();
    }
  }
  // If footer HTML doesn't exist yet, footer loader script will call initFooter() manually
})();

