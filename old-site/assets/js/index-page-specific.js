/**
 * INDEX PAGE SPECIFIC JAVASCRIPT
 * Extracted from index.html inline scripts
 * Date: January 9, 2026
 * 
 * Contains all page-specific functionality for index.html:
 * - Hamburger menu event delegation
 * - Keyboard shortcuts overlay
 * - Screen reader announcements
 * - Artwork of the day initialization
 * - Drone animations
 * - Bullet animations
 * - Comic arrow animations
 * - Footer link fixes
 * - UX/UI features component loading
 * - Drone searchlight removal
 */

(function() {
  'use strict';

  // ============================================
  // 1. HAMBURGER MENU EVENT DELEGATION
  // ============================================
  (function() {
    let menuInitialized = false;
    
    // Hamburger menu is handled by navbar.js - no custom handlers needed
    // navbar.js has MutationObserver to watch for dynamically loaded navbars
    
    // Ensure toggle button is always clickable (CSS only, no event handlers)
    function ensureToggleWorks() {
      const toggle = document.getElementById('editorialNavToggle');
      const overlay = document.getElementById('editorialNavOverlay');
      
      if (toggle && overlay) {
        // Make sure button is clickable and above other content
        toggle.style.pointerEvents = 'auto';
        toggle.style.cursor = 'pointer';
        toggle.style.zIndex = '10001';
        
        // Ensure overlay is properly positioned
        if (!overlay.style.position) {
          overlay.style.position = 'fixed';
          overlay.style.zIndex = '99998';
        }
      }
    }
    
    // Try multiple times to ensure CSS properties are set
    setTimeout(ensureToggleWorks, 100);
    setTimeout(ensureToggleWorks, 500);
    setTimeout(ensureToggleWorks, 1000);
    
    // Watch for navbar being loaded and ensure CSS properties
    const observer = new MutationObserver(function() {
      ensureToggleWorks();
    });
    
    const navbarSection = document.getElementById('navbar-section');
    if (navbarSection) {
      observer.observe(navbarSection, {
        childList: true,
        subtree: true
      });
    }
  })();

  // ============================================
  // 2. ENHANCED FEATURES JAVASCRIPT
  // Keyboard Shortcuts & Screen Reader Announcements
  // ============================================
  (function() {
    // Mark body as JS-enabled immediately
    document.documentElement.classList.add('js-enabled');
  
    // ============================================
    // KEYBOARD SHORTCUTS OVERLAY
    // ============================================
    function setupKeyboardShortcuts() {
      document.addEventListener('keydown', (e) => {
        // Don't trigger if typing in input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
          if (e.key === 'Escape' && e.target.id === 'navbarSearchInput') {
            const searchInput = document.getElementById('navbarSearchInput');
            if (searchInput && searchInput.value) {
              searchInput.value = '';
              const clearBtn = document.getElementById('navbarSearchClear');
              if (clearBtn) clearBtn.click();
            }
          }
          return;
        }
        
        // Escape - Close shortcuts overlay or search overlay
        if (e.key === 'Escape') {
          const shortcutsOverlay = document.getElementById('keyboardShortcutsOverlay');
          if (shortcutsOverlay && shortcutsOverlay.classList.contains('active')) {
            shortcutsOverlay.classList.remove('active');
            shortcutsOverlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            return;
          }
          
          const searchOverlay = document.getElementById('navbarSearchOverlay');
          if (searchOverlay && searchOverlay.classList.contains('active')) {
            const closeBtn = document.getElementById('navbarSearchClose');
            if (closeBtn) closeBtn.click();
            return;
          }
        }
        
        // ? - Show shortcuts help (DISABLED - user doesn't want to see this)
        // if (e.key === '?' && !e.shiftKey) {
        //   e.preventDefault();
        //   showKeyboardShortcutsHelp();
        // }
        
        // D - Toggle dark mode
        if ((e.key === 'd' || e.key === 'D') && !e.ctrlKey && !e.metaKey && !e.altKey) {
          const themeToggle = document.getElementById('themeToggle');
          if (themeToggle) {
            e.preventDefault();
            themeToggle.click();
          }
        }
      });
    }
    
    function showKeyboardShortcutsHelp() {
      const overlay = document.getElementById('keyboardShortcutsOverlay');
      if (!overlay) return;
      
      overlay.classList.add('active');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      
      // Focus close button
      const closeBtn = document.getElementById('keyboardShortcutsClose');
      if (closeBtn) {
        setTimeout(() => closeBtn.focus(), 100);
      }
      
      // Close handlers
      const closeOverlay = () => {
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      };
      
      // Close button (CSP compliant - use addEventListener)
      if (closeBtn) {
        closeBtn.addEventListener('click', closeOverlay);
      }
      
      // Close on backdrop click (CSP compliant - use addEventListener)
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          closeOverlay();
        }
      });
    }
    
    // ============================================
    // ENHANCED SCREEN READER ANNOUNCEMENTS
    // ============================================
    function announceToScreenReader(message, priority = 'polite') {
      let liveRegion;
      
      // Choose appropriate live region based on priority
      if (priority === 'assertive') {
        liveRegion = document.getElementById('aria-live-region-assertive');
      } else if (priority === 'status') {
        liveRegion = document.getElementById('aria-live-region-status');
      } else {
        liveRegion = document.getElementById('aria-live-region');
      }
      
      if (liveRegion) {
        // Clear previous message
        liveRegion.textContent = '';
        
        // Small delay to ensure screen reader picks up the change
        setTimeout(() => {
          liveRegion.textContent = message;
          
          // Clear after announcement (longer for assertive)
          const clearDelay = priority === 'assertive' ? 2000 : 1000;
          setTimeout(() => {
            liveRegion.textContent = '';
          }, clearDelay);
        }, 100);
      }
    }
    
    // Initialize functions
    setupKeyboardShortcuts();
    
    // Export functions globally
    window.announceToScreenReader = announceToScreenReader;
  })();

  // ============================================
  // 3. ARTWORK OF THE DAY SCRIPT
  // Immediate initialization to show content ASAP
  // ============================================
  (function() {
    function showContentImmediately() {
      const skeleton = document.getElementById('artworkOfDaySkeleton');
      const content = document.getElementById('artworkOfDayContent');
      const image = document.getElementById('artworkOfDayImage');
      
      if (skeleton && content) {
        // Set fallback image if not set - use thumbs on mobile
        if (image && (!image.src || image.src === '')) {
          const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;
          image.src = isMobile ? 'artworks/thumbs/art0001.avif' : 'artworks/art0001.avif';
          image.alt = 'Featured Artwork';
        }
        
        // Hide skeleton and show content
        skeleton.style.display = 'none';
        skeleton.classList.add('hidden');
        content.style.display = 'block';
        content.style.visibility = 'visible';
        content.classList.add('loaded');
      }
    }
    
    // Try immediately if DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showContentImmediately);
    } else {
      showContentImmediately();
    }
    
    // Also try after a short delay as backup
    setTimeout(showContentImmediately, 100);
  })();

  // ============================================
  // 4. DRONE ANIMATIONS PERFORMANCE OPTIMIZATION
  // ============================================
  (function() {
    const squadron = document.querySelector('.home-drone-squadron');
    if (!squadron) return;
    
    function shouldAnimate() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
      if (document.hidden) return false;
      return true;
    }
    
    function initAnimations() {
      if (shouldAnimate()) {
        if (document.readyState === 'complete') {
          setTimeout(() => squadron.classList.add('loaded'), 1500);
        } else {
          window.addEventListener('load', () => setTimeout(() => squadron.classList.add('loaded'), 1500));
        }
      } else {
        squadron.style.display = 'none';
      }
    }
    
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        squadron.classList.remove('loaded');
      } else if (shouldAnimate()) {
        squadron.classList.add('loaded');
      }
    });
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAnimations);
    } else {
      initAnimations();
    }
  })();

  // ============================================
  // 5. BUTTON DRONE ANIMATIONS
  // Orbiting around View Art Gallery button
  // ============================================
  (function() {
    const buttonSquadron = document.querySelector('.button-drone-squadron');
    if (!buttonSquadron) return;
    
    function shouldAnimate() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
      if (document.hidden) return false;
      return true;
    }
    
    function initButtonAnimations() {
      if (shouldAnimate()) {
        if (document.readyState === 'complete') {
          setTimeout(() => buttonSquadron.classList.add('loaded'), 2000);
        } else {
          window.addEventListener('load', () => setTimeout(() => buttonSquadron.classList.add('loaded'), 2000));
        }
      } else {
        buttonSquadron.style.display = 'none';
      }
    }
    
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        buttonSquadron.classList.remove('loaded');
      } else if (shouldAnimate()) {
        buttonSquadron.classList.add('loaded');
      }
    });
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initButtonAnimations);
    } else {
      initButtonAnimations();
    }
  })();

  // ============================================
  // 6. BULLET ANIMATION FOR FEATURED PROJECTS CHARACTER
  // ============================================
  (function() {
    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    
    function initBulletAnimation() {
      var characterWrapper = document.querySelector('.featured-projects-character-wrapper');
      
      if (!characterWrapper) {
        return;
      }
      
      var hatchetTriggered = false;
      
      // Observe when section enters viewport
      var hatchetObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting && !hatchetTriggered) {
            hatchetTriggered = true;
            setTimeout(function() {
              throwBullets();
            }, 800); // Small delay after section visible
          }
        });
      }, { threshold: 0.3 });
      
      hatchetObserver.observe(characterWrapper);
      
      function throwBullets() {
        // Get wrapper dimensions
        var wrapperWidth = characterWrapper.offsetWidth;
        var wrapperHeight = characterWrapper.offsetHeight;
        
        // Scatter 84 bullet holes randomly around the character (bias to right side)
        var centerX = wrapperWidth / 2;
        var centerY = wrapperHeight / 2;
        var minRadius = Math.max(wrapperWidth, wrapperHeight) * 0.4; // Closer but don't hit
        var maxRadius = Math.max(wrapperWidth, wrapperHeight) * 1.2; // Spread wider
        
        var bulletPositions = [];
        for (var i = 0; i < 84; i++) {
          // Bias angles to the right side (more bullets on right)
          var angle;
          if (Math.random() > 0.3) {
            // 70% of bullets on right side (-90 to 90 degrees)
            angle = (Math.random() * 180) - 90;
          } else {
            // 30% on left side (90 to 270 degrees)
            angle = 90 + (Math.random() * 180);
          }
          var radians = angle * Math.PI / 180;
          
          // Random radius between min and max
          var radius = minRadius + Math.random() * (maxRadius - minRadius);
          
          var x = centerX + Math.cos(radians) * radius;
          var y = centerY + Math.sin(radians) * radius;
          
          bulletPositions.push({
            left: x / wrapperWidth,
            top: y / wrapperHeight,
            rotation: Math.random() * 360 // Random rotation
          });
        }
        
        // Create each bullet hole
        bulletPositions.forEach(function(pos, index) {
          var bulletHole = document.createElement('div');
          bulletHole.className = 'flying-hatchet';
          bulletHole.style.cssText = `
            position: absolute;
            z-index: 9999;
            pointer-events: none;
          `;
          
          // Bullet hole SVG - TINY (22px)
          bulletHole.innerHTML = `
            <div class="hatchet-spin">
              <svg width="22" height="22" viewBox="0 0 100 100">
                <!-- Outer impact cracks -->
                <g opacity="0.4">
                  <line x1="50" y1="15" x2="50" y2="5" stroke="#333" stroke-width="2"/>
                  <line x1="70" y1="20" x2="78" y2="12" stroke="#333" stroke-width="2"/>
                  <line x1="85" y1="50" x2="95" y2="50" stroke="#333" stroke-width="2"/>
                  <line x1="70" y1="80" x2="78" y2="88" stroke="#333" stroke-width="2"/>
                  <line x1="50" y1="85" x2="50" y2="95" stroke="#333" stroke-width="2"/>
                  <line x1="30" y1="80" x2="22" y2="88" stroke="#333" stroke-width="2"/>
                  <line x1="15" y1="50" x2="5" y2="50" stroke="#333" stroke-width="2"/>
                  <line x1="30" y1="20" x2="22" y2="12" stroke="#333" stroke-width="2"/>
                </g>
                
                <!-- Outer ring (impact zone) -->
                <circle cx="50" cy="50" r="20" fill="#2a2a2a" opacity="0.3"/>
                
                <!-- Main hole -->
                <circle cx="50" cy="50" r="15" fill="#1a1a1a"/>
                
                <!-- Inner shadow for depth -->
                <circle cx="50" cy="50" r="15" fill="url(#bulletGradient${index})"/>
                
                <!-- Highlight for 3D effect -->
                <ellipse cx="48" cy="48" rx="5" ry="4" fill="#000" opacity="0.8"/>
                
                <!-- Gradient definition -->
                <defs>
                  <radialGradient id="bulletGradient${index}">
                    <stop offset="0%" style="stop-color:#000;stop-opacity:1" />
                    <stop offset="70%" style="stop-color:#1a1a1a;stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:#333;stop-opacity:0.3" />
                  </radialGradient>
                </defs>
              </svg>
            </div>
          `;
          
          // Position bullet hole
          var stickLeft = wrapperWidth * pos.left;
          var stickTop = wrapperHeight * pos.top;
          
          bulletHole.style.left = stickLeft + 'px';
          bulletHole.style.top = stickTop + 'px';
          bulletHole.style.opacity = '0';
          bulletHole.style.transform = 'scale(0.2)';
          bulletHole.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
          
          var spinner = bulletHole.querySelector('.hatchet-spin');
          if (spinner) {
            spinner.style.transform = 'rotate(' + pos.rotation + 'deg)';
          }
          
          characterWrapper.appendChild(bulletHole);
          
          // Animate in with slower staggered timing for visibility
          setTimeout(function() {
            bulletHole.style.opacity = '1';
            bulletHole.style.transform = 'scale(1)';
          }, index * 50); // 50ms delay between each bullet (slower)
          
        });
      }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initBulletAnimation);
    } else {
      initBulletAnimation();
    }
  })();

  // ============================================
  // 7. COMIC BOOK ARROW ATTACK ANIMATION
  // ============================================
  (function() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    
    // Comic Book Arrow Attack Function
    function initComicArrows() {
      var fullBleedContainer = document.querySelector('.full-bleed-image-container');
      
      if (!fullBleedContainer) return;
      
      var arrowsTriggered = false;
      
      // Observe when section enters viewport
      var arrowObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting && !arrowsTriggered) {
            arrowsTriggered = true;
            setTimeout(function() {
              shootComicArrows();
            }, 500); // Small delay after section visible
          }
        });
      }, { threshold: 0.3 });
      
      arrowObserver.observe(fullBleedContainer);
      
      function shootComicArrows() {
        // Arrow configurations - 14 arrows positioned lower around character
        var arrowConfigs = [
          // First wave - 7 arrows (moved down +15-20%)
          { startSide: 'left', endX: 35, endY: 40, angle: 25, delay: 0, color: '#FF4444' },
          { startSide: 'right', endX: 68, endY: 45, angle: -160, delay: 0.15, color: '#4444FF' },
          { startSide: 'top', endX: 48, endY: 35, angle: 95, delay: 0.3, color: '#FFD700' },
          { startSide: 'left', endX: 32, endY: 78, angle: 15, delay: 0.45, color: '#FF44FF' },
          { startSide: 'right', endX: 65, endY: 70, angle: -145, delay: 0.6, color: '#44FFFF' },
          { startSide: 'top', endX: 40, endY: 30, angle: 75, delay: 0.75, color: '#FF8844' },
          { startSide: 'left', endX: 38, endY: 58, angle: 20, delay: 0.9, color: '#88FF44' },
          
          // Second wave - 7 more arrows (moved down +15-20%)
          { startSide: 'right', endX: 70, endY: 52, angle: -150, delay: 1.05, color: '#FF6B6B' },
          { startSide: 'left', endX: 30, endY: 48, angle: 30, delay: 1.2, color: '#4ECDC4' },
          { startSide: 'top', endX: 55, endY: 38, angle: 85, delay: 1.35, color: '#FFE66D' },
          { startSide: 'right', endX: 72, endY: 62, angle: -140, delay: 1.5, color: '#A8E6CF' },
          { startSide: 'left', endX: 28, endY: 68, angle: 25, delay: 1.65, color: '#FF8B94' },
          { startSide: 'top', endX: 45, endY: 32, angle: 90, delay: 1.8, color: '#C7CEEA' },
          { startSide: 'right', endX: 67, endY: 60, angle: -155, delay: 1.95, color: '#FFDAB9' }
        ];
        
        arrowConfigs.forEach(function(config) {
          setTimeout(function() {
            createComicArrow(fullBleedContainer, config);
          }, config.delay * 1000);
        });
        
        // Show speech bubble after all arrows land
        setTimeout(function() {
          showCharacterSpeechBubble();
        }, 3500);
      }
      
      function showCharacterSpeechBubble() {
        var character = document.querySelector('.full-bleed-animation');
        if (!character) return;
        
        var bubble = document.createElement('div');
        bubble.className = 'character-speech-bubble';
        bubble.innerHTML = `
          <div class="speech-bubble-content">
            Nice try! 😎
          </div>
          <div class="speech-bubble-tail"></div>
        `;
        
        character.appendChild(bubble);
        
        // Fade in
        setTimeout(function() {
          bubble.classList.add('active');
        }, 100);
        
        // Remove after 4 seconds
        setTimeout(function() {
          bubble.classList.remove('active');
          setTimeout(function() {
            bubble.remove();
          }, 500);
        }, 4000);
      }
      
      function createComicArrow(container, config) {
        // Create arrow container
        var arrowWrapper = document.createElement('div');
        arrowWrapper.className = 'comic-arrow-wrapper';
        
        // Set starting position based on side
        var startPositions = {
          'left': { x: -15, y: config.endY },
          'right': { x: 115, y: config.endY },
          'top': { x: config.endX, y: -15 }
        };
        
        var startPos = startPositions[config.startSide];
        arrowWrapper.style.left = startPos.x + '%';
        arrowWrapper.style.top = startPos.y + '%';
        
        // Create arrow SVG with comic book styling
        arrowWrapper.innerHTML = `
          <div class="comic-arrow" style="transform: rotate(${config.angle}deg)">
            <!-- Motion lines -->
            <div class="motion-lines">
              <div class="motion-line" style="width: 60px; top: 5px; animation-delay: 0s;"></div>
              <div class="motion-line" style="width: 45px; top: 10px; animation-delay: 0.05s;"></div>
              <div class="motion-line" style="width: 50px; top: 15px; animation-delay: 0.1s;"></div>
            </div>
            
            <!-- Arrow SVG -->
            <svg width="80" height="20" viewBox="0 0 80 20" class="arrow-svg">
              <!-- Arrow shaft with comic outline -->
              <line x1="0" y1="10" x2="65" y2="10" 
                    stroke="${config.color}" stroke-width="4" stroke-linecap="round"/>
              <line x1="0" y1="10" x2="65" y2="10" 
                    stroke="#000" stroke-width="6" stroke-linecap="round" opacity="0.3"/>
              
              <!-- Arrow point -->
              <polygon points="65,10 55,5 55,15" 
                       fill="${config.color}" stroke="#000" stroke-width="2"/>
              
              <!-- Feathers -->
              <line x1="10" y1="6" x2="5" y2="3" stroke="${config.color}" stroke-width="2"/>
              <line x1="10" y1="14" x2="5" y2="17" stroke="${config.color}" stroke-width="2"/>
            </svg>
            
            <!-- Impact burst (hidden initially) -->
            <div class="impact-burst">
              <div class="burst-star">★</div>
              <div class="burst-line burst-line-1"></div>
              <div class="burst-line burst-line-2"></div>
              <div class="burst-line burst-line-3"></div>
              <div class="burst-line burst-line-4"></div>
              <div class="impact-text">THUNK!</div>
            </div>
          </div>
        `;
        
        container.appendChild(arrowWrapper);
        
        // Animate to final position
        setTimeout(function() {
          arrowWrapper.style.left = config.endX + '%';
          arrowWrapper.style.top = config.endY + '%';
          arrowWrapper.classList.add('flying');
          
          // Impact effect
          setTimeout(function() {
            arrowWrapper.classList.add('stuck');
            var burst = arrowWrapper.querySelector('.impact-burst');
            if (burst) burst.classList.add('active');
            
            // Trigger character reaction
            makeCharacterReact();
            
            // Wobble effect
            setTimeout(function() {
              arrowWrapper.classList.add('wobble');
            }, 100);
          }, 800); // Match CSS transition time
        }, 50);
      }
      
      // Character reaction when arrows hit
      function makeCharacterReact() {
        var character = document.querySelector('.full-bleed-gif');
        if (!character) return;
        
        // Flinch/bounce animation
        character.style.transform = 'translateX(-50%) translateY(-30px) rotate(-8deg) scale(1.05)';
        character.style.transition = 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
        
        setTimeout(function() {
          character.style.transform = 'translateX(-50%) translateY(0) rotate(0deg) scale(1)';
          character.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        }, 200);
      }
    }
    
    document.addEventListener('DOMContentLoaded', initComicArrows);
  })();

  // ============================================
  // 8. FOOTER LINKS FIX
  // CRITICAL: Remove inline styles from footer bottom links and apply positioning
  // ============================================
  (function() {
    function fixFooterLinks() {
      const footerLinks = document.querySelectorAll('.footer-bottom-link, .footer-bottom-links a');
      const footerLinksContainer = document.querySelector('.footer-bottom-links');
      
      if (footerLinksContainer) {
        // Remove inline styles from container
        footerLinksContainer.style.removeProperty('margin-left');
        footerLinksContainer.style.removeProperty('right');
        footerLinksContainer.style.removeProperty('left');
        // Apply transform
        footerLinksContainer.style.setProperty('transform', 'translateX(-150px)', 'important');
      }
      
      footerLinks.forEach(link => {
        // Remove all inline positioning styles
        link.style.removeProperty('margin-right');
        link.style.removeProperty('margin-left');
        link.style.removeProperty('right');
        link.style.removeProperty('left');
        link.style.removeProperty('position');
        link.style.removeProperty('transform');
      });
    }
    
    // Run immediately and after DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fixFooterLinks);
    } else {
      fixFooterLinks();
    }
    
    // Also run after a short delay to catch any dynamically added styles
    setTimeout(fixFooterLinks, 100);
    setTimeout(fixFooterLinks, 500);
    setTimeout(fixFooterLinks, 1000);
  })();

  // ============================================
  // 9. LOAD UX/UI FEATURES HTML COMPONENTS
  // ============================================
  (function() {
    const container = document.getElementById('ux-ui-features-section');
    if (!container) {
      // Create container if it doesn't exist
      const div = document.createElement('div');
      div.id = 'ux-ui-features-section';
      document.body.appendChild(div);
    }
    const targetContainer = document.getElementById('ux-ui-features-section');
    if (targetContainer) {
      fetch('components/ux-ui-features-2026.html')
        .then(response => response.text())
        .then(html => {
          targetContainer.innerHTML = html;
        })
        .catch(err => console.warn('Could not load UX/UI features components:', err));
    }
  })();

  // ============================================
  // 10. REMOVE DRONE SEARCHLIGHTS
  // Aggressively remove drone searchlights after all CSS loads
  // ============================================
  (function() {
    function removeSearchlights() {
      const drones = document.querySelectorAll('.home-drone-1, .home-drone-2, .home-drone-3, .home-drone-4, .home-drone-5, .home-drone-6');
      drones.forEach(drone => {
        // Remove ::before pseudo-element by setting content to none
        const style = document.createElement('style');
        style.textContent = `
          .home-drone-squadron .home-drone-1::before,
          .home-drone-squadron .home-drone-2::before,
          .home-drone-squadron .home-drone-3::before,
          .home-drone-squadron .home-drone-4::before,
          .home-drone-squadron .home-drone-5::before,
          .home-drone-squadron .home-drone-6::before,
          .home-drone-1::before,
          .home-drone-2::before,
          .home-drone-3::before,
          .home-drone-4::before,
          .home-drone-5::before,
          .home-drone-6::before {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            content: none !important;
            width: 0 !important;
            height: 0 !important;
            background: none !important;
            background-image: none !important;
            box-shadow: none !important;
            filter: none !important;
            transform: none !important;
            animation: none !important;
            -webkit-animation: none !important;
            pointer-events: none !important;
            z-index: -9999 !important;
          }
        `;
        document.head.appendChild(style);
      });
    }
    
    // Run immediately
    removeSearchlights();
    
    // Run after DOM loads
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', removeSearchlights);
    }
    
    // Run after window loads (all CSS loaded)
    window.addEventListener('load', removeSearchlights);
    
    // Run periodically to catch dynamically added searchlights
    setInterval(removeSearchlights, 1000);
  })();

})();
