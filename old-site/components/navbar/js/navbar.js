/**
 * JFSN UNIFIED NAVBAR - BEST-IN-CLASS UX/UI
 * Advanced navbar functionality for all pages
 * Features: Scroll detection, active page highlighting, keyboard nav, focus management
 */

(function() {
  'use strict';
  
  // ===== CONFIGURATION =====
  const CONFIG = {
    scrollThreshold: 50,           // Pixels scrolled before navbar changes
    scrollHideThreshold: 100,       // Pixels scrolled before hiding navbar
    scrollShowThreshold: 10,         // Pixels scrolled before showing navbar
    scrollProgress: true,           // Enable scroll progress indicator
    autoHideOnScroll: true,        // Auto-hide navbar on scroll down
    compactOnScroll: true,          // Make navbar compact on scroll
    smartSticky: true,              // Smart sticky behavior (hide down, show up)
    animationDuration: 300,         // Animation duration in ms
    debounceDelay: 10,              // Debounce delay for scroll events
    lastScrollY: 0,                 // Track last scroll position
    scrollDirection: 'up',          // Track scroll direction
    isScrolling: false,             // Track if currently scrolling
    scrollTimeout: null,            // Timeout for scroll end detection
  };
  
  // ===== STATE MANAGEMENT =====
  const state = {
    navbar: null,
    overlay: null,
    toggle: null,
    close: null,
    links: [],
    scrollProgress: null,
    isOverlayOpen: false,
    currentPage: null,
    initialized: false,
    announcement: null,
    announcementClose: null,
    searchOverlay: null,
    searchToggle: null,
    searchInput: null,
    searchClose: null,
    isSearchOpen: false,
  };
  
  // ===== INITIALIZATION =====
  function init() {
    // Wait for DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }
    
    // Ensure body overflow is reset on init (fix stuck overlays)
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    
    // Find navbar elements
    state.navbar = document.querySelector('.editorial-navbar') || 
                   document.querySelector('.navbar-enhanced') ||
                   document.querySelector('.header.navbar');
    
    if (!state.navbar) {
      // If navbar not found, try again after a short delay (for dynamically loaded navbars)
      if (!state.initialized) {
        setTimeout(init, 100);
      }
      return;
    }
    
    // Reset initialization state if navbar was dynamically loaded
    if (state.initialized) {
      state.initialized = false;
      // Re-find all elements
      state.overlay = null;
      state.toggle = null;
      state.close = null;
      state.links = [];
    }
    
    // Ensure overlays are closed on init
    const navOverlay = document.getElementById('editorialNavOverlay');
    const searchOverlay = document.getElementById('navbarSearchOverlay');
    if (navOverlay) {
      navOverlay.classList.remove('active');
      navOverlay.setAttribute('aria-hidden', 'true');
    }
    if (searchOverlay) {
      searchOverlay.classList.remove('active');
      searchOverlay.setAttribute('aria-hidden', 'true');
    }
    
    // Find overlay elements
    state.overlay = document.getElementById('editorialNavOverlay');
    state.toggle = document.getElementById('editorialNavToggle') || 
                   document.querySelector('.editorial-navbar-toggle') ||
                   document.querySelector('.navbar-toggler');
    state.close = document.getElementById('editorialNavClose');
    state.links = document.querySelectorAll('.editorial-nav-link, .nav-link');
    
    // Initialize scroll progress
    if (CONFIG.scrollProgress) {
      initScrollProgress();
    }
    
    // Initialize scroll detection
    initScrollDetection();
    
    // Initialize overlay (always try, even if elements not found yet)
    initOverlay();
    
    // Initialize active page highlighting
    initActivePage();
    
    // Initialize keyboard navigation
    initKeyboardNav();
    
    // Initialize focus management
    initFocusManagement();
    
    // Initialize resize handler
    initResizeHandler();
    
    // Initialize announcement bar
    initAnnouncementBar();
    
    // Initialize search
    initSearch();
    
    // Initialize analytics
    initAnalytics();
    
    // Mark as initialized
    state.initialized = true;
    
    // Add initialized class
    document.body.classList.add('navbar-initialized');
  }
  
  // ===== SCROLL PROGRESS INDICATOR =====
  function initScrollProgress() {
    // Create progress bar if it doesn't exist
    let progressBar = document.querySelector('.navbar-scroll-progress');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.className = 'navbar-scroll-progress';
      progressBar.innerHTML = '<div class="navbar-scroll-progress-bar"></div>';
      document.body.appendChild(progressBar);
    }
    
    state.scrollProgress = progressBar.querySelector('.navbar-scroll-progress-bar');
  }
  
  function updateScrollProgress() {
    if (!state.scrollProgress) return;
    
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollableHeight = documentHeight - windowHeight;
    
    // Calculate scroll percentage
    const scrollPercent = scrollableHeight > 0 
      ? Math.min((scrollTop / scrollableHeight) * 100, 100)
      : 0;
    
    // Update progress bar width
    state.scrollProgress.style.width = scrollPercent + '%';
    
    // Show/hide based on scroll position (hide at top)
    if (scrollTop < 10) {
      state.scrollProgress.style.opacity = '0';
    } else {
      state.scrollProgress.style.opacity = '1';
    }
  }
  
  // ===== SCROLL DETECTION =====
  function initScrollDetection() {
    let ticking = false;
    
    function handleScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.pageYOffset || document.documentElement.scrollTop;
          
          // Update scroll progress
          if (CONFIG.scrollProgress) {
            updateScrollProgress();
          }
          
          // Determine scroll direction
          if (scrollY > CONFIG.lastScrollY) {
            CONFIG.scrollDirection = 'down';
          } else {
            CONFIG.scrollDirection = 'up';
          }
          
          CONFIG.lastScrollY = scrollY;
          
          // Handle navbar states
          if (CONFIG.compactOnScroll && scrollY > CONFIG.scrollThreshold) {
            state.navbar.classList.add('scrolled');
          } else {
            state.navbar.classList.remove('scrolled');
          }
          
          // Detect hero section height (typically first section or viewport height)
          const heroSection = document.querySelector('section.hero, .hero-section, main > section:first-child, .template-hero');
          const heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;
          
          // Add glow effect when past hero
          if (scrollY > heroHeight * 0.8) {
            state.navbar.classList.add('scrolled-past-hero');
          } else {
            state.navbar.classList.remove('scrolled-past-hero');
          }
          
          // Dynamic color shift based on current section
          const sections = document.querySelectorAll('section[id], .section[id], main > section, [data-section]');
          let currentSection = 'hero';
          
          sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
              currentSection = section.id || 
                              section.getAttribute('data-section') || 
                              section.className.split(' ').find(c => c.includes('section')) ||
                              'hero';
            }
          });
          
          // Remove all section classes
          state.navbar.classList.remove('data-section-hero', 'data-section-about', 'data-section-portfolio', 'data-section-art', 'data-section-contact');
          state.navbar.setAttribute('data-section', currentSection);
          
          // Parallax effect for brand logo
          if (state.navbar) {
            state.navbar.style.setProperty('--scroll-parallax', scrollY);
          }
          
          // Smart sticky behavior - hide on scroll down, show on scroll up
          if (CONFIG.smartSticky) {
            // At top of page, always show
            if (scrollY < CONFIG.scrollShowThreshold) {
              state.navbar.classList.remove('hidden');
              state.navbar.classList.add('at-top');
              state.navbar.classList.remove('visible');
            } else {
              state.navbar.classList.remove('at-top');
              
              // Hide when scrolling down past threshold
              if (CONFIG.scrollDirection === 'down' && scrollY > CONFIG.scrollHideThreshold) {
                state.navbar.classList.add('hidden');
                state.navbar.classList.remove('visible');
              } 
              // Show when scrolling up
              else if (CONFIG.scrollDirection === 'up') {
                state.navbar.classList.remove('hidden');
                state.navbar.classList.add('visible');
              }
            }
          }
          // Fallback to original auto-hide behavior
          else if (CONFIG.autoHideOnScroll) {
            if (CONFIG.scrollDirection === 'down' && scrollY > CONFIG.scrollHideThreshold) {
              state.navbar.classList.add('hidden');
            } else if (CONFIG.scrollDirection === 'up' || scrollY < CONFIG.scrollShowThreshold) {
              state.navbar.classList.remove('hidden');
            }
          }
          
          // Clear scroll timeout
          clearTimeout(CONFIG.scrollTimeout);
          CONFIG.isScrolling = true;
          
          // Detect scroll end
          CONFIG.scrollTimeout = setTimeout(() => {
            CONFIG.isScrolling = false;
          }, 150);
          
          ticking = false;
        });
        
        ticking = true;
      }
    }
  
    // Throttled scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial state
    handleScroll();
  }
  
  // ===== OVERLAY MANAGEMENT =====
  // Store handlers to prevent duplicate listeners
  let overlayHandlers = {
    toggleClick: null,
    closeClick: null,
    linkClicks: [],
    escapeKey: null,
    overlayClick: null,
    visibilityChange: null,
    resize: null
  };
  
  function initOverlay() {
    if (!state.overlay || !state.toggle) {
      // Try to find elements again
      state.overlay = document.getElementById('editorialNavOverlay');
      state.toggle = document.getElementById('editorialNavToggle') || 
                     document.querySelector('.editorial-navbar-toggle') ||
                     document.querySelector('.navbar-toggler');
      state.close = document.getElementById('editorialNavClose');
      
      if (!state.overlay || !state.toggle) {
        // Still not found, try again later
        setTimeout(() => {
          if (!state.initialized) {
            initOverlay();
          }
        }, 100);
        return;
      }
    }
    
    // CRITICAL: Move overlay to body if it's not already there
    // This ensures proper z-index stacking and prevents CSS conflicts
    if (state.overlay && state.overlay.parentElement !== document.body) {
      document.body.appendChild(state.overlay);
    }
    
    // Remove old event listeners if they exist
    if (overlayHandlers.toggleClick && state.toggle) {
      state.toggle.removeEventListener('click', overlayHandlers.toggleClick);
    }
    if (overlayHandlers.closeClick && state.close) {
      state.close.removeEventListener('click', overlayHandlers.closeClick);
    }
    overlayHandlers.linkClicks.forEach(({link, handler}) => {
      link.removeEventListener('click', handler);
    });
    overlayHandlers.linkClicks = [];
    
    // Open overlay
    function openOverlay() {
      if (!state.overlay || !state.toggle) return;
      
      // Ensure overlay is in body (required for proper z-index stacking)
      if (state.overlay.parentElement !== document.body) {
        document.body.appendChild(state.overlay);
      }
      
      state.overlay.classList.add('active');
      state.toggle.classList.add('active');
      state.toggle.setAttribute('aria-expanded', 'true');
      state.overlay.setAttribute('aria-hidden', 'false');
      
      // Set context for blur backdrop
      const currentPath = window.location.pathname.toLowerCase();
      let context = 'home';
      if (currentPath.includes('art') || currentPath.includes('gallery')) context = 'art';
      else if (currentPath.includes('portfolio')) context = 'portfolio';
      else if (currentPath.includes('contact')) context = 'contact';
      state.overlay.setAttribute('data-context', context);
      
      document.body.style.overflow = 'hidden';
      state.isOverlayOpen = true;
      
      // Focus trap - trap focus within overlay
      if (typeof window.navbarFocusTrap !== 'undefined' && window.navbarFocusTrap.trap) {
        const content = state.overlay.querySelector('.editorial-nav-overlay-content');
        if (content) {
          state.focusTrapRelease = window.navbarFocusTrap.trap(content);
        }
      } else {
        // Fallback: Focus first link
        const firstLink = state.overlay.querySelector('.editorial-nav-link, .editorial-nav-overlay-close');
        if (firstLink) {
          setTimeout(() => firstLink.focus(), 100);
        }
      }
      
      // Announce to screen readers
      if (typeof announceToScreenReader === 'function') {
        announceToScreenReader('Navigation menu opened');
      }
      
      // Track analytics
      if (typeof trackEvent === 'function') {
        trackEvent('navbar', 'overlay_opened');
      }
    }
    
    // Close overlay
    function closeOverlay() {
      if (!state.overlay) return;
      
      // Release focus trap
      if (state.focusTrapRelease && typeof state.focusTrapRelease === 'function') {
        state.focusTrapRelease();
        state.focusTrapRelease = null;
      }
      
      state.overlay.classList.remove('active');
      if (state.toggle) {
        state.toggle.classList.remove('active');
        state.toggle.setAttribute('aria-expanded', 'false');
      }
      state.overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      state.isOverlayOpen = false;
      
      // Return focus to toggle
      if (state.toggle) {
        setTimeout(() => state.toggle.focus(), 100);
      }
      
      // Announce to screen readers
      if (typeof announceToScreenReader === 'function') {
        announceToScreenReader('Navigation menu closed');
      }
      
      // Track analytics
      if (typeof trackEvent === 'function') {
        trackEvent('navbar', 'overlay_closed');
      }
    }
    
    // Toggle overlay
    function toggleOverlay() {
      // Ensure overlay and toggle are found
      if (!state.overlay) {
        state.overlay = document.getElementById('editorialNavOverlay');
      }
      if (!state.toggle) {
        state.toggle = document.getElementById('editorialNavToggle');
      }
      
      if (!state.overlay || !state.toggle) {
        return;
      }
      
      if (state.isOverlayOpen) {
        closeOverlay();
      } else {
        openOverlay();
      }
    }
    
    // Expose toggleOverlay globally for fallback handlers
    window.toggleNavbarOverlay = toggleOverlay;
    
    // Store handlers and attach event listeners
    overlayHandlers.toggleClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleOverlay();
    };
    
    if (state.toggle) {
      // Remove any existing listeners first
      state.toggle.removeEventListener('click', overlayHandlers.toggleClick);
      
      // Add click handler
      state.toggle.addEventListener('click', overlayHandlers.toggleClick);
      
      // Also add direct onclick as backup
      state.toggle.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleOverlay();
      };
      
      // Also ensure button is clickable
      state.toggle.style.pointerEvents = 'auto';
      state.toggle.style.cursor = 'pointer';
      state.toggle.style.zIndex = '10001';
      
    }
    
    overlayHandlers.closeClick = closeOverlay;
    if (state.close) {
      state.close.addEventListener('click', overlayHandlers.closeClick);
    }
    
    // Close on link click
    state.links = document.querySelectorAll('.editorial-nav-link, .nav-link');
    state.links.forEach(link => {
      const handler = () => {
        if (state.isOverlayOpen) {
          closeOverlay();
        }
      };
      link.addEventListener('click', handler);
      overlayHandlers.linkClicks.push({link, handler});
    });
    
    // Close on Escape key (only attach once globally)
    if (!overlayHandlers.escapeKey) {
      overlayHandlers.escapeKey = (e) => {
        if (e.key === 'Escape') {
          if (state.isOverlayOpen) {
            closeOverlay();
          }
          // Also close search if open
          if (state.isSearchOpen && state.searchOverlay && typeof closeSearch === 'function') {
            closeSearch();
          }
        }
      };
      document.addEventListener('keydown', overlayHandlers.escapeKey);
    }
    
    // Close on outside click
    if (!overlayHandlers.overlayClick) {
      overlayHandlers.overlayClick = (e) => {
        if (!state.overlay) return;
        // Don't close if clicking on theme toggle button
        if (e.target.closest('#themeToggle')) {
          return;
        }
        if (e.target === state.overlay || e.target.closest('.editorial-nav-overlay-content') === null) {
          if (e.target === state.overlay) {
            closeOverlay();
          }
        }
      };
      state.overlay.addEventListener('click', overlayHandlers.overlayClick);
    }
    
    // Ensure overlay closes on page visibility change (only attach once)
    if (!overlayHandlers.visibilityChange) {
      overlayHandlers.visibilityChange = () => {
        if (document.hidden && state.isOverlayOpen) {
          closeOverlay();
        }
      };
      document.addEventListener('visibilitychange', overlayHandlers.visibilityChange);
    }
    
    // Close on window resize (only attach once)
    if (!overlayHandlers.resize) {
      overlayHandlers.resize = () => {
        if (state.isOverlayOpen && window.innerWidth > 991) {
          closeOverlay();
        }
      };
      window.addEventListener('resize', overlayHandlers.resize);
    }
  }
  
  // ===== ACTIVE PAGE HIGHLIGHTING =====
  function initActivePage() {
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;
    
    // Find current page - normalize path
    state.currentPage = currentPath.split('/').pop() || 'index.html';
    if (state.currentPage === '') state.currentPage = 'index.html';
    
    // Determine current context/section
    const determineContext = () => {
      const path = currentPath.toLowerCase();
      if (path.includes('art') || path.includes('gallery')) return 'art';
      if (path.includes('portfolio')) return 'portfolio';
      if (path.includes('about')) return 'about';
      if (path.includes('contact')) return 'contact';
      if (path.includes('timeline')) return 'timeline';
      return 'home';
    };
    
    const currentContext = determineContext();
    
    // Set context on overlay menu
    if (state.overlay) {
      const menu = state.overlay.querySelector('.editorial-nav-overlay-menu');
      const quickActions = state.overlay.querySelector('.editorial-nav-overlay-quick-actions');
      if (menu) menu.setAttribute('data-section', currentContext);
      if (quickActions) quickActions.setAttribute('data-context', currentContext);
    }
    
    // Normalize: remove query strings and ensure consistent comparison
    const normalizePath = (path) => {
      if (!path) return 'index.html';
      const normalized = path.split('#')[0].split('?')[0].split('/').pop() || 'index.html';
      return normalized === '' ? 'index.html' : normalized;
    };
    
    // Highlight active links and set context
    state.links.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      
      // Normalize link path
      const linkPath = normalizePath(href);
      const currentPageNormalized = normalizePath(state.currentPage);
      
      // Check if link matches current page
      const isActive = linkPath === currentPageNormalized || 
                      (currentPageNormalized === 'index.html' && (linkPath === '' || linkPath === '/' || linkPath === 'index.html' || href === '/' || href === './'));
      
      if (isActive) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
        link.setAttribute('data-current-section', 'true');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
        link.setAttribute('data-current-section', 'false');
      }
      
      // Set context attribute
      const linkContext = href.includes('art') ? 'art' : 
                         href.includes('portfolio') ? 'portfolio' :
                         href.includes('about') ? 'about' :
                         href.includes('contact') ? 'contact' :
                         href.includes('timeline') ? 'timeline' : 'home';
      link.setAttribute('data-context', linkContext);
      
      // Handle hash links
      if (currentHash && href.includes(currentHash)) {
        link.classList.add('active');
        link.setAttribute('data-current-section', 'true');
      }
    });
    
    // Re-run after a short delay to catch dynamically loaded links
    setTimeout(() => {
      state.links = document.querySelectorAll('.editorial-nav-link, .nav-link');
      if (state.links.length > 0) {
        initActivePage();
      }
    }, 200);
  }
  
  // ===== KEYBOARD NAVIGATION =====
  function initKeyboardNav() {
    // Arrow key navigation in overlay
    document.addEventListener('keydown', (e) => {
      if (!state.isOverlayOpen || !state.overlay) return;
      
      const links = Array.from(state.overlay.querySelectorAll('.editorial-nav-link'));
      if (links.length === 0) return;
      
      const currentIndex = links.indexOf(document.activeElement);
      let nextIndex = currentIndex;
      
      switch(e.key) {
        case 'ArrowDown':
          e.preventDefault();
          nextIndex = currentIndex < links.length - 1 ? currentIndex + 1 : 0;
          links[nextIndex].focus();
          break;
        case 'ArrowUp':
          e.preventDefault();
          nextIndex = currentIndex > 0 ? currentIndex - 1 : links.length - 1;
          links[nextIndex].focus();
          break;
        case 'Home':
          e.preventDefault();
          links[0].focus();
          break;
        case 'End':
          e.preventDefault();
          links[links.length - 1].focus();
          break;
      }
    });
  }
  
  // ===== FOCUS MANAGEMENT =====
  function initFocusManagement() {
    // Trap focus in overlay
    if (state.overlay) {
      state.overlay.addEventListener('keydown', (e) => {
        if (!state.isOverlayOpen) return;
        
        if (e.key === 'Tab') {
          const focusableElements = state.overlay.querySelectorAll(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
          );
          
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];
          
          if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            // Tab
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      });
    }
  }
  
  // ===== RESIZE HANDLER =====
  function initResizeHandler() {
    let resizeTimeout;
    
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        // Recalculate scroll progress
        if (CONFIG.scrollProgress) {
          updateScrollProgress();
        }
        
        // Close overlay on large screens (if mobile menu was open)
        if (state.isOverlayOpen && window.innerWidth > 991) {
          if (state.overlay) state.overlay.classList.remove('active');
          if (state.toggle) state.toggle.classList.remove('active');
          document.body.style.overflow = '';
          state.isOverlayOpen = false;
        }
      }, 250);
    });
  }
  
  // ===== SCREEN READER ANNOUNCEMENTS =====
  function announceToScreenReader(message) {
    let liveRegion = document.getElementById('aria-live-region');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'aria-live-region';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only visually-hidden';
      document.body.appendChild(liveRegion);
    }
    
    liveRegion.textContent = message;
    
    // Clear after announcement
    setTimeout(() => {
      liveRegion.textContent = '';
    }, 1000);
  }
  
  // ===== ANNOUNCEMENT BAR =====
  function initAnnouncementBar() {
    state.announcement = document.getElementById('navbarAnnouncement');
    state.announcementClose = document.getElementById('navbarAnnouncementClose');
    
    if (!state.announcement) return;
    
    // Check if already dismissed
    const dismissed = localStorage.getItem('navbar-announcement-dismissed');
    if (dismissed) {
      state.announcement.classList.add('hidden');
      return;
    }
    
    // Update navbar position based on announcement bar visibility
    function updateNavbarPosition() {
      if (!state.navbar) return;
      
      if (state.announcement && !state.announcement.classList.contains('hidden')) {
        const announcementHeight = state.announcement.offsetHeight || 48;
        state.navbar.style.top = announcementHeight + 'px';
        document.body.classList.add('has-announcement');
        document.body.style.paddingTop = `calc(var(--navbar-height, 80px) + ${announcementHeight}px)`;
      } else {
        state.navbar.style.top = '0px';
        document.body.classList.remove('has-announcement');
        document.body.style.paddingTop = 'var(--navbar-height, 80px)';
      }
    }
    
    // Close handler
    if (state.announcementClose) {
      state.announcementClose.addEventListener('click', () => {
        state.announcement.classList.add('hidden');
        localStorage.setItem('navbar-announcement-dismissed', 'true');
        trackEvent('announcement', 'dismissed');
        updateNavbarPosition();
      });
    }
    
    // Initial position update
    updateNavbarPosition();
    
    // Watch for changes in announcement bar visibility
    if (state.announcement) {
      const observer = new MutationObserver(() => {
        updateNavbarPosition();
      });
      observer.observe(state.announcement, {
        attributes: true,
        attributeFilter: ['class']
      });
      
      // Also watch for resize
      window.addEventListener('resize', updateNavbarPosition);
    }
  }
  
  // ===== SEARCH FUNCTIONALITY =====
  function initSearch() {
    state.searchOverlay = document.getElementById('navbarSearchOverlay');
    state.searchToggle = document.getElementById('navbarSearchToggle');
    state.searchInput = document.getElementById('navbarSearchInput');
    state.searchClose = document.getElementById('navbarSearchClose');
    const searchClear = document.getElementById('navbarSearchClear');
    
    if (!state.searchOverlay || !state.searchToggle) return;
    
    // Open search
    function openSearch() {
      state.searchOverlay.classList.add('active');
      state.searchToggle.setAttribute('aria-expanded', 'true');
      state.searchOverlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      state.isSearchOpen = true;
      
      // Focus input
      if (state.searchInput) {
        setTimeout(() => state.searchInput.focus(), 100);
      }
      
      trackEvent('search', 'opened');
    }
    
    // Close search
    function closeSearch() {
      state.searchOverlay.classList.remove('active');
      state.searchToggle.setAttribute('aria-expanded', 'false');
      state.searchOverlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      state.isSearchOpen = false;
      
      // Clear input
      if (state.searchInput) {
        state.searchInput.value = '';
        updateSearchClear();
      }
      
      trackEvent('search', 'closed');
    }
    
    // Toggle search
    function toggleSearch() {
      if (state.isSearchOpen) {
        closeSearch();
      } else {
        openSearch();
      }
    }
    
    // Event listeners
    state.searchToggle.addEventListener('click', toggleSearch);
    
    if (state.searchClose) {
      state.searchClose.addEventListener('click', closeSearch);
    }
    
    // Close on outside click
    state.searchOverlay.addEventListener('click', (e) => {
      if (e.target === state.searchOverlay) {
        closeSearch();
      }
    });
    
    // Ensure search closes on page visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && state.isSearchOpen) {
        closeSearch();
      }
    });
    
    // Search input handling
    if (state.searchInput) {
      state.searchInput.addEventListener('input', (e) => {
        updateSearchClear();
        handleSearch(e.target.value);
      });
      
      state.searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          performSearch(state.searchInput.value);
        }
      });
    }
    
    // Clear button
    if (searchClear) {
      searchClear.addEventListener('click', () => {
        if (state.searchInput) {
          state.searchInput.value = '';
          state.searchInput.focus();
          updateSearchClear();
          handleSearch('');
        }
      });
    }
    
    function updateSearchClear() {
      if (searchClear && state.searchInput) {
        searchClear.style.display = state.searchInput.value ? 'flex' : 'none';
      }
    }
    
    function handleSearch(query) {
      // Simple search implementation
      // You can enhance this with actual search functionality
      if (query.length > 0) {
        trackEvent('search', 'query', query);
      }
    }
    
    function performSearch(query) {
      if (query.trim()) {
        trackEvent('search', 'performed', query);
        // Redirect to search results or perform search
        // window.location.href = `/search.html?q=${encodeURIComponent(query)}`;
      }
    }
    
    // Keyboard shortcut (Cmd/Ctrl + K)
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleSearch();
      }
    });
  }
  
  // ===== ANALYTICS INTEGRATION =====
  function initAnalytics() {
    // Analytics is ready - functions will be called via trackEvent
    // Track page view
    trackEvent('navbar', 'page_view', window.location.pathname);
  }
  
  function trackEvent(category, action, label = '') {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        'event_category': category,
        'event_label': label,
        'value': 1
      });
    }
    
    // Google Analytics Universal
    if (typeof ga !== 'undefined') {
      ga('send', 'event', category, action, label);
    }
    
    // Custom analytics
    if (window.dataLayer) {
      window.dataLayer.push({
        'event': action,
        'eventCategory': category,
        'eventLabel': label
      });
    }
    
    // Analytics tracking only - no console logging
  }
  
  // Track navbar interactions
  const originalOpenOverlay = window.JFSNNavbar?.open;
  const originalCloseOverlay = window.JFSNNavbar?.close;
  
  // ===== PUBLIC API =====
  window.JFSNNavbar = {
    open: () => {
      if (state.overlay && state.toggle) {
        state.overlay.classList.add('active');
        state.toggle.classList.add('active');
        document.body.style.overflow = 'hidden';
        state.isOverlayOpen = true;
        trackEvent('navbar', 'overlay_opened');
      }
    },
    close: () => {
      if (state.overlay && state.toggle) {
        state.overlay.classList.remove('active');
        state.toggle.classList.remove('active');
        document.body.style.overflow = '';
        state.isOverlayOpen = false;
        trackEvent('navbar', 'overlay_closed');
      }
    },
    toggle: () => {
      if (state.isOverlayOpen) {
        window.JFSNNavbar.close();
      } else {
        window.JFSNNavbar.open();
      }
    },
    isOpen: () => state.isOverlayOpen,
    updateActivePage: () => initActivePage(),
    openSearch: () => {
      if (state.searchToggle) {
        state.searchToggle.click();
      }
    },
    closeSearch: () => {
      if (state.searchClose) {
        state.searchClose.click();
      }
    },
    trackEvent: trackEvent,
  };
  
  // Track link clicks
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.href) {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
        trackEvent('navbar', 'link_clicked', href);
      }
    }
  });
  
  // ===== HANDLE DYNAMICALLY LOADED NAVBARS =====
  // Watch for navbar container being populated (for dynamically loaded navbars)
  // Check both navbar-container and navbar-section (template.html uses navbar-section)
  const navbarContainer = document.getElementById('navbar-container') || document.getElementById('navbar-section');
  
  // Function to check and initialize navbar
  function checkAndInit() {
    const navbar = document.querySelector('.editorial-navbar');
    if (navbar && !state.initialized) {
      setTimeout(() => {
        init();
      }, 50);
    }
  }
  
  if (navbarContainer) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          // Check if navbar was added
          checkAndInit();
        }
      });
    });
    
    observer.observe(navbarContainer, {
      childList: true,
      subtree: true
    });
    
    // Check immediately if navbar already exists (for pages that load navbar before script)
    checkAndInit();
    
    // Also check periodically as fallback (for slow network connections)
    let checkAttempts = 0;
    const maxCheckAttempts = 30; // 3 seconds max
    const checkInterval = setInterval(() => {
      checkAttempts++;
      if (document.querySelector('.editorial-navbar') && !state.initialized) {
        checkAndInit();
        clearInterval(checkInterval);
      } else if (checkAttempts >= maxCheckAttempts) {
        clearInterval(checkInterval);
      }
    }, 100);
  } else {
    // If no container, try direct initialization (for pages with inline navbar)
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(checkAndInit, 100);
      });
    } else {
      setTimeout(checkAndInit, 100);
    }
  }
  
  // ===== MAGNETIC HOVER EFFECT =====
  function initMagneticHover() {
    const magneticElements = document.querySelectorAll(
      '.editorial-nav-link, .navbar-quick-action-btn, .editorial-navbar-toggle, .navbar-search-toggle'
    );
    
    magneticElements.forEach(element => {
      element.setAttribute('data-magnetic', 'true');
      
      element.addEventListener('mousemove', function(e) {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        // Calculate magnetic pull (stronger near center)
        const distance = Math.sqrt(x * x + y * y);
        const maxDistance = Math.max(rect.width, rect.height) / 2;
        const strength = Math.max(0, 1 - distance / maxDistance);
        
        // Apply magnetic effect (subtle movement)
        const magneticX = (x / maxDistance) * strength * 8;
        const magneticY = (y / maxDistance) * strength * 8;
        
        element.style.setProperty('--magnetic-x', magneticX + 'px');
        element.style.setProperty('--magnetic-y', magneticY + 'px');
      });
      
      element.addEventListener('mouseleave', function() {
        element.style.setProperty('--magnetic-x', '0px');
        element.style.setProperty('--magnetic-y', '0px');
      });
    });
  }
  
  // Initialize magnetic hover after navbar is ready
  setTimeout(() => {
    initMagneticHover();
  }, 500);
  
  // ===== BREADCRUMB INTEGRATION =====
  function initBreadcrumbs() {
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split('/').filter(p => p && p !== 'index.html');
    
    // Don't show breadcrumbs on home page
    if (pathParts.length === 0 || (pathParts.length === 1 && pathParts[0] === '')) {
      return;
    }
    
    const breadcrumbs = [
      { name: 'Home', url: '/' }
    ];
    
    let currentUrl = '/';
    pathParts.forEach((part, index) => {
      currentUrl += (currentUrl !== '/' ? '/' : '') + part;
      const name = part.replace(/\.html$/, '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      breadcrumbs.push({
        name: name,
        url: currentUrl + (part.includes('.html') ? '' : '.html')
      });
    });
    
    // Render breadcrumbs in navbar (desktop)
    const navbarBreadcrumbs = document.getElementById('navbarBreadcrumbs');
    if (navbarBreadcrumbs) {
      navbarBreadcrumbs.innerHTML = breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        return `
          <span class="navbar-breadcrumb-item">
            ${isLast 
              ? `<span class="navbar-breadcrumb-current">${crumb.name}</span>`
              : `<a href="${crumb.url}" class="navbar-breadcrumb-link">${crumb.name}</a>`
            }
            ${!isLast ? '<span class="navbar-breadcrumb-separator">/</span>' : ''}
          </span>
        `;
      }).join('');
      navbarBreadcrumbs.classList.add('show');
      if (state.navbar) {
        state.navbar.classList.add('has-breadcrumbs');
      }
    }
    
    // Render breadcrumbs in overlay (mobile)
    const overlayBreadcrumbs = document.getElementById('overlayBreadcrumbs');
    if (overlayBreadcrumbs) {
      overlayBreadcrumbs.innerHTML = breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        return `
          <span class="navbar-breadcrumb-item">
            ${isLast 
              ? `<span class="navbar-breadcrumb-current">${crumb.name}</span>`
              : `<a href="${crumb.url}" class="navbar-breadcrumb-link">${crumb.name}</a>`
            }
            ${!isLast ? '<span class="navbar-breadcrumb-separator">/</span>' : ''}
          </span>
        `;
      }).join('');
      overlayBreadcrumbs.classList.add('show');
    }
  }
  
  // Initialize breadcrumbs after navbar is ready
  setTimeout(() => {
    initBreadcrumbs();
  }, 600);
  
  // Expose init function globally so loader scripts can call it
  window.initNavbar = function() {
    state.initialized = false;
    init();
    setTimeout(initMagneticHover, 500);
  };
  
  // Also expose a ready check function
  window.navbarReady = function() {
    return typeof window.initNavbar === 'function';
  };
  
  // ===== CONTEXT-AWARE SECONDARY LINKS =====
  function initContextAwareSecondaryLinks() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const exploreMoreSection = document.getElementById('exploreMoreSection');
    const relatedProjectsSection = document.getElementById('relatedProjectsSection');
    const relatedProjectsGrid = document.getElementById('relatedProjectsGrid');
    
    if (!exploreMoreSection || !relatedProjectsSection || !relatedProjectsGrid) {
      return; // Elements not found yet (navbar might still be loading)
    }
    
    const quickActionsSection = document.getElementById('quickActionsSection');
    const quickActionsGrid = document.getElementById('quickActionsGrid');
    const portfolioCategoriesSection = document.getElementById('portfolioCategoriesSection');
    const portfolioCategoriesGrid = document.getElementById('portfolioCategoriesGrid');
    const artGalleryQuickLinksSection = document.getElementById('artGalleryQuickLinksSection');
    const artGalleryQuickLinksGrid = document.getElementById('artGalleryQuickLinksGrid');
    
    // Portfolio sub-pages mapping
    const portfolioSubPages = {
      'enterprise-platforms.html': [
        { href: 'ai-powered-solutions.html', icon: 'bx-brain', label: 'AI-Powered Solutions' },
        { href: 'mobile-applications.html', icon: 'bx-mobile-alt', label: 'Mobile Applications' },
        { href: 'portfolio.html', icon: 'bx-briefcase', label: 'View All Portfolio' }
      ],
      'ai-powered-solutions.html': [
        { href: 'enterprise-platforms.html', icon: 'bx-building', label: 'Enterprise Platforms' },
        { href: 'mobile-applications.html', icon: 'bx-mobile-alt', label: 'Mobile Applications' },
        { href: 'portfolio.html', icon: 'bx-briefcase', label: 'View All Portfolio' }
      ],
      'mobile-applications.html': [
        { href: 'enterprise-platforms.html', icon: 'bx-building', label: 'Enterprise Platforms' },
        { href: 'ai-powered-solutions.html', icon: 'bx-brain', label: 'AI-Powered Solutions' },
        { href: 'portfolio.html', icon: 'bx-briefcase', label: 'View All Portfolio' }
      ]
    };
    
    // About page quick actions
    const aboutPageActions = [
      { href: 'art.html', icon: 'bx-palette', label: 'View Art Gallery' },
      { href: 'portfolio.html', icon: 'bx-briefcase', label: 'View Portfolio' },
      { href: 'contact.html', icon: 'bx-envelope', label: 'Get in Touch' }
    ];
    
    // Portfolio main page categories
    const portfolioCategories = [
      { href: 'enterprise-platforms.html', icon: 'bx-building', label: 'Enterprise Platforms' },
      { href: 'ai-powered-solutions.html', icon: 'bx-brain', label: 'AI-Powered Solutions' },
      { href: 'mobile-applications.html', icon: 'bx-mobile-alt', label: 'Mobile Applications' },
      { href: 'website.html', icon: 'bx-globe', label: 'Web Solutions' }
    ];
    
    // Art Gallery quick links
    const artGalleryQuickLinks = [
      { href: 'art.html#guernica', icon: 'bx-palette', label: 'Guernica Series' },
      { href: 'art.html#mr-snowmann', icon: 'bx-snowflake', label: 'Mr. Snowmann' },
      { href: 'timeline.html', icon: 'bx-time', label: '50-Year Timeline' },
      { href: 'art.html', icon: 'bx-collection', label: 'All Artworks' }
    ];
    
    // Helper function to hide all secondary link sections
    function hideAllSecondarySections() {
      exploreMoreSection.style.display = 'none';
      if (relatedProjectsSection) relatedProjectsSection.style.display = 'none';
      if (quickActionsSection) quickActionsSection.style.display = 'none';
      if (portfolioCategoriesSection) portfolioCategoriesSection.style.display = 'none';
      if (artGalleryQuickLinksSection) artGalleryQuickLinksSection.style.display = 'none';
    }
    
    // REMOVED: Related Projects, Quick Actions, Portfolio Categories, and Quick Links sections
    // Always show "Explore More" section (default)
    hideAllSecondarySections();
    
    // Show "Explore More" section (default)
    exploreMoreSection.style.display = 'block';
  }
  
  // Initialize context-aware secondary links after navbar loads
  function initSecondaryLinks() {
    // Try immediately
    initContextAwareSecondaryLinks();
    
    // Also try after delays (in case navbar is still loading)
    setTimeout(initContextAwareSecondaryLinks, 100);
    setTimeout(initContextAwareSecondaryLinks, 500);
    setTimeout(initContextAwareSecondaryLinks, 1000);
    
    // Watch for navbar changes (MutationObserver)
    const navbarSection = document.getElementById('navbar-section');
    if (navbarSection) {
      const observer = new MutationObserver(() => {
        initContextAwareSecondaryLinks();
      });
      observer.observe(navbarSection, {
        childList: true,
        subtree: true
      });
    }
  }
  
  // Initialize context-aware secondary links
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSecondaryLinks);
  } else {
    initSecondaryLinks();
  }
  
  // ===== COPY URL TO CLIPBOARD =====
  function initCopyUrl() {
    const copyUrlBtn = document.getElementById('navbarCopyUrl');
    if (!copyUrlBtn) return;
    
    // Show toast notification
    function showToast(message, type = 'success') {
      // Remove existing toast if any
      const existingToast = document.querySelector('.navbar-toast');
      if (existingToast) {
        existingToast.remove();
      }
      
      // Create toast element
      const toast = document.createElement('div');
      toast.className = `navbar-toast navbar-toast-${type}`;
      toast.setAttribute('role', 'alert');
      toast.setAttribute('aria-live', 'polite');
      toast.innerHTML = `
        <span class="navbar-toast-icon">
          <i class="bx ${type === 'success' ? 'bx-check-circle' : 'bx-error-circle'}"></i>
        </span>
        <span class="navbar-toast-message">${message}</span>
      `;
      
      // Add to body
      document.body.appendChild(toast);
      
      // Show toast
      setTimeout(() => {
        toast.classList.add('show');
      }, 10);
      
      // Hide and remove after delay
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
          }
        }, 300);
      }, 3000);
    }
    
    // Copy URL to clipboard
    async function copyUrlToClipboard() {
      const url = window.location.href;
      
      try {
        // Use modern Clipboard API
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(url);
          showToast('URL copied to clipboard!', 'success');
          trackEvent('navbar', 'url_copied', url);
        } else {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = url;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          document.body.appendChild(textArea);
          textArea.select();
          
          try {
            document.execCommand('copy');
            showToast('URL copied to clipboard!', 'success');
            trackEvent('navbar', 'url_copied', url);
          } catch (err) {
            showToast('Failed to copy URL', 'error');
          } finally {
            document.body.removeChild(textArea);
          }
        }
      } catch (err) {
        showToast('Failed to copy URL', 'error');
        if (window.DEBUG) console.error('Failed to copy URL:', err);
      }
    }
    
    // Add click handler
    copyUrlBtn.addEventListener('click', copyUrlToClipboard);
    
    // Add keyboard support (Enter/Space)
    copyUrlBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        copyUrlToClipboard();
      }
    });
  }
  
  // Initialize copy URL
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCopyUrl);
  } else {
    initCopyUrl();
  }
  
  // Also try after navbar loads (for dynamically loaded navbars)
  setTimeout(initCopyUrl, 100);
  setTimeout(initCopyUrl, 500);
  
  // ===== ENHANCED FOCUS INDICATORS =====
  function initFocusIndicators() {
    // Add focus-visible polyfill for older browsers
    // This ensures :focus-visible works even without native support
    if (!CSS.supports('selector(:focus-visible)')) {
      // Add class to body to enable polyfill styles
      document.body.classList.add('js-focus-visible');
      
      // Track if keyboard is being used
      let hadKeyboardEvent = false;
      let keyboardThrottleTimeout = null;
      
      // Detect keyboard usage
      function onKeyboardEvent(e) {
        hadKeyboardEvent = true;
        
        // Clear throttle timeout
        if (keyboardThrottleTimeout) {
          clearTimeout(keyboardThrottleTimeout);
        }
        
        // Reset after a delay
        keyboardThrottleTimeout = setTimeout(() => {
          hadKeyboardEvent = false;
        }, 100);
      }
      
      // Detect mouse usage
      function onMouseEvent() {
        hadKeyboardEvent = false;
      }
      
      // Add event listeners
      document.addEventListener('keydown', onKeyboardEvent, true);
      document.addEventListener('keyup', onKeyboardEvent, true);
      document.addEventListener('mousedown', onMouseEvent, true);
      document.addEventListener('mousemove', onMouseEvent, true);
      
      // Handle focus events
      document.addEventListener('focus', (e) => {
        if (hadKeyboardEvent && e.target.matches('button, a, input, textarea, select, [tabindex]')) {
          e.target.classList.add('focus-visible');
        }
      }, true);
      
      document.addEventListener('blur', (e) => {
        e.target.classList.remove('focus-visible');
      }, true);
    }
    
    // Enhance focus visibility for all interactive elements
    const interactiveElements = document.querySelectorAll(
      'button, a, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    interactiveElements.forEach(element => {
      // Ensure elements are keyboard accessible
      if (element.tagName === 'DIV' && element.hasAttribute('tabindex')) {
        element.setAttribute('role', 'button');
      }
      
      // Add keyboard event listeners for better focus management
      element.addEventListener('keydown', (e) => {
        // Enter or Space activates buttons/links
        if ((e.key === 'Enter' || e.key === ' ') && 
            (element.tagName === 'BUTTON' || 
             (element.tagName === 'A' && element.hasAttribute('role') && element.getAttribute('role') === 'button'))) {
          e.preventDefault();
          element.click();
        }
      });
    });
  }
  
  // Initialize focus indicators
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFocusIndicators);
  } else {
    initFocusIndicators();
  }
  
  // Also try after navbar loads
  setTimeout(initFocusIndicators, 100);
  setTimeout(initFocusIndicators, 500);
  
  // ===== SMOOTH SCROLL ENHANCEMENT =====
  function initSmoothScroll() {
    // Handle anchor link clicks with smooth scroll
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      
      const href = link.getAttribute('href');
      if (href === '#' || href === '#!') return;
      
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId) || 
                           document.querySelector(`[name="${targetId}"]`);
      
      if (targetElement) {
        e.preventDefault();
        
        // Calculate offset for navbar height
        const navbar = document.querySelector('.editorial-navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
        
        // Smooth scroll to target
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Update URL without jumping
        if (history.pushState) {
          history.pushState(null, null, href);
        }
        
        // Track analytics
        if (typeof trackEvent === 'function') {
          trackEvent('navbar', 'anchor_link_click', href);
        }
      }
    }, true);
  }
  
  // Initialize smooth scroll
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSmoothScroll);
  } else {
    initSmoothScroll();
  }
  
})();
