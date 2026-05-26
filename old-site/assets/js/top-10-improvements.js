/**
 * TOP 10 HIGH-IMPACT UX/UI IMPROVEMENTS
 * JavaScript Implementation
 */

(function() {
  'use strict';

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ===========================================
     1. SCROLL PROGRESS BAR
     =========================================== */
  function initScrollProgress() {
    // Create progress bar if it doesn't exist
    let progressBar = document.querySelector('.scroll-progress-top');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.className = 'scroll-progress-top';
      document.body.appendChild(progressBar);
    }

    function updateProgress() {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
      
      progressBar.style.width = Math.min(Math.max(scrollPercent, 0), 100) + '%';
    }

    // Throttle scroll events
    let ticking = false;
    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', requestTick, { passive: true });
    updateProgress(); // Initial update
  }

  /* ===========================================
     2. ENHANCED BUTTON STATES
     Magnetic Hover Effect
     =========================================== */
  function initMagneticButtons() {
    if (prefersReducedMotion) return;

    const buttons = document.querySelectorAll('.btn-enhanced, .btn');
    const magneticStrength = 15; // Adjust for stronger/weaker effect

    buttons.forEach(button => {
      // Only apply to desktop
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        button.addEventListener('mousemove', (e) => {
          const rect = button.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          
          const moveX = (x / rect.width) * magneticStrength;
          const moveY = (y / rect.height) * magneticStrength;
          
          button.style.setProperty('--magnetic-x', moveX + 'px');
          button.style.setProperty('--magnetic-y', moveY + 'px');
        });

        button.addEventListener('mouseleave', () => {
          button.style.setProperty('--magnetic-x', '0px');
          button.style.setProperty('--magnetic-y', '0px');
        });
      }
    });
  }

  /* ===========================================
     4. SMOOTH SCROLL & BACK TO TOP
     =========================================== */
  function initSmoothScroll() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#!') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const navbarHeight = 70; // Adjust based on your navbar height
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
          });
        }
      });
    });

    // Back to Top Button
    // Check if button already exists
    let backToTop = document.querySelector('.back-to-top');
    
    console.log('🔍 initSmoothScroll called, backToTop exists:', !!backToTop);
    
    if (!backToTop) {
      console.log('🔨 Creating back-to-top button...');
      backToTop = document.createElement('button');
      backToTop.className = 'back-to-top';
      backToTop.type = 'button';
      backToTop.setAttribute('aria-label', 'Back to top');
      backToTop.setAttribute('title', 'Back to top');
      backToTop.setAttribute('role', 'button');
      backToTop.setAttribute('tabindex', '0');
      // Use SVG instead of icon font for better reliability
      backToTop.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M18 15l-6-6-6 6"/>
        </svg>
      `;
      
      // Set initial styles explicitly with !important to override CSS (Best Practices)
      backToTop.setAttribute('style', `
        position: fixed !important;
        bottom: 2rem !important;
        right: 2rem !important;
        width: 48px !important;
        height: 48px !important;
        min-width: 48px !important;
        min-height: 48px !important;
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%) !important;
        color: white !important;
        border: none !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
        z-index: 100001 !important;
        box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4) !important;
        font-size: 1.25rem !important;
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
        transform: translateY(20px) scale(0.8) !important;
        transition: ${prefersReducedMotion 
          ? 'opacity 0.2s ease, visibility 0.2s ease'
          : 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'} !important;
        outline: none !important;
        user-select: none !important;
        -webkit-tap-highlight-color: transparent !important;
      `);
      
      // Mobile adjustments
      if (window.matchMedia('(max-width: 768px)').matches) {
        backToTop.style.setProperty('bottom', '5rem', 'important');
        backToTop.style.setProperty('right', '1rem', 'important');
        backToTop.style.setProperty('width', '44px', 'important');
        backToTop.style.setProperty('height', '44px', 'important');
        backToTop.style.setProperty('min-width', '44px', 'important');
        backToTop.style.setProperty('min-height', '44px', 'important');
      }
      
      // Append to body
      if (document.body) {
        document.body.appendChild(backToTop);
        console.log('✅ Back-to-top button created and appended to body');
        console.log('Button element:', backToTop);
        console.log('Button computed styles:', window.getComputedStyle(backToTop));
        
        // TEMPORARY: Force button visible for testing
        setTimeout(() => {
          console.log('🧪 TEST MODE: Forcing button visible...');
          backToTop.style.setProperty('opacity', '1', 'important');
          backToTop.style.setProperty('visibility', 'visible', 'important');
          backToTop.style.setProperty('pointer-events', 'auto', 'important');
          backToTop.style.setProperty('display', 'flex', 'important');
          backToTop.style.setProperty('transform', 'translateY(0) scale(1)', 'important');
          backToTop.classList.add('visible');
          console.log('🧪 Button should now be visible! Check bottom-right corner.');
          console.log('Button position:', backToTop.getBoundingClientRect());
        }, 2000);
      } else {
        // Wait for body to be ready
        setTimeout(() => {
          if (document.body) {
            document.body.appendChild(backToTop);
            console.log('✅ Back-to-top button created (delayed)');
            // TEMPORARY: Force visible
            setTimeout(() => {
              backToTop.style.setProperty('opacity', '1', 'important');
              backToTop.style.setProperty('visibility', 'visible', 'important');
              backToTop.style.setProperty('pointer-events', 'auto', 'important');
              backToTop.style.setProperty('display', 'flex', 'important');
            }, 1000);
          }
        }, 100);
      }
    } else {
      console.log('⚠️ Back-to-top button already exists:', backToTop);
    }
    
    function toggleBackToTop() {
      if (!backToTop) {
        console.warn('⚠️ toggleBackToTop: backToTop is null');
        return;
      }
      
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const scrollThreshold = 300; // Best practice: Show after 300px scroll
      
      if (scrollTop > scrollThreshold) {
        // Show button only after threshold scroll (Best Practice)
        backToTop.classList.add('visible');
        backToTop.style.setProperty('opacity', '1', 'important');
        backToTop.style.setProperty('visibility', 'visible', 'important');
        backToTop.style.setProperty('pointer-events', 'auto', 'important');
        backToTop.style.setProperty('display', 'flex', 'important');
        backToTop.style.setProperty('transform', prefersReducedMotion ? 'translateY(0)' : 'translateY(0) scale(1)', 'important');
        console.log('✅ Back-to-top button shown (scroll:', scrollTop, 'px)');
      } else {
        // Hide button when at top or less than threshold (Best Practice)
        backToTop.classList.remove('visible');
        backToTop.style.setProperty('opacity', '0', 'important');
        backToTop.style.setProperty('visibility', 'hidden', 'important');
        backToTop.style.setProperty('pointer-events', 'none', 'important');
        backToTop.style.setProperty('transform', prefersReducedMotion ? 'translateY(20px)' : 'translateY(20px) scale(0.8)', 'important');
      }
    }

    if (backToTop) {
      // Click handler (Best Practice: Smooth scroll with fallback)
      backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Smooth scroll to top (Best Practice)
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
        
        // Fallback for older browsers
        if (!window.scrollTo || prefersReducedMotion) {
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }
        
        // Hide button immediately (Best Practice: Immediate feedback)
        backToTop.classList.remove('visible');
        backToTop.style.opacity = '0';
        backToTop.style.visibility = 'hidden';
        backToTop.style.pointerEvents = 'none';
        
        // Focus management (Best Practice: Return focus to top)
        const firstFocusable = document.querySelector('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
          setTimeout(() => firstFocusable.focus(), 100);
        }
        
        return false;
      });
      
      // Keyboard support (Best Practice: Enter and Space keys)
      backToTop.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          backToTop.click();
        }
      });
      
      // Focus styles (Best Practice: Visible focus indicator)
      backToTop.addEventListener('focus', function() {
        this.style.outline = '3px solid rgba(99, 102, 241, 0.8)';
        this.style.outlineOffset = '4px';
      });
      
      backToTop.addEventListener('blur', function() {
        this.style.outline = 'none';
      });
    }

    // Throttle scroll events
    let ticking = false;
    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(() => {
          toggleBackToTop();
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', requestTick, { passive: true });
    toggleBackToTop(); // Initial check
    
    // Debug: Check button after a delay
    setTimeout(() => {
      const btn = document.querySelector('.back-to-top');
      if (btn) {
        console.log('🔍 Button check after 2s:', {
          exists: !!btn,
          inDOM: document.body.contains(btn),
          computedStyle: window.getComputedStyle(btn),
          scrollTop: window.pageYOffset || document.documentElement.scrollTop
        });
      } else {
        console.error('❌ Button not found in DOM after 2s');
      }
    }, 2000);
    
    // Handle resize for mobile adjustments (Best Practice: Responsive behavior)
    let resizeTimeout;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (backToTop && window.matchMedia('(max-width: 768px)').matches) {
          backToTop.style.bottom = '5rem';
          backToTop.style.right = '1rem';
          backToTop.style.width = '44px';
          backToTop.style.height = '44px';
          backToTop.style.minWidth = '44px';
          backToTop.style.minHeight = '44px';
        } else if (backToTop) {
          backToTop.style.bottom = '2rem';
          backToTop.style.right = '2rem';
          backToTop.style.width = '48px';
          backToTop.style.height = '48px';
          backToTop.style.minWidth = '48px';
          backToTop.style.minHeight = '48px';
        }
      }, 150);
    }, { passive: true });
  }

  /* ===========================================
     6. SECTION REVEAL ANIMATIONS
     =========================================== */
  function initScrollReveals() {
    if (prefersReducedMotion) {
      // Show all elements immediately
      document.querySelectorAll('.reveal-on-scroll, .reveal-stagger').forEach(el => {
        el.classList.add('revealed');
      });
      return;
    }

    const revealElements = document.querySelectorAll('.reveal-on-scroll, .reveal-stagger');
    if (revealElements.length === 0) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
  }

  /* ===========================================
     9. LOADING STATES
     =========================================== */
  function initLoadingStates() {
    // Add loading class to images while loading
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      if (!img.complete) {
        img.classList.add('loading');
        img.addEventListener('load', () => {
          img.classList.remove('loading');
        });
        img.addEventListener('error', () => {
          img.classList.remove('loading');
        });
      }
    });

    // Add loading state to buttons on form submission
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
        if (submitBtn) {
          submitBtn.classList.add('loading');
        }
      });
    });
  }

  /* ===========================================
     INITIALIZATION
     =========================================== */
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    // Initialize all features
    initScrollProgress();
    initMagneticButtons();
    initSmoothScroll();
    initScrollReveals();
    initLoadingStates();

    // Add enhanced classes to existing elements
    document.querySelectorAll('.card').forEach(card => {
      if (!card.classList.contains('card-enhanced')) {
        card.classList.add('card-enhanced');
      }
    });

    document.querySelectorAll('.btn').forEach(btn => {
      if (!btn.classList.contains('btn-enhanced')) {
        btn.classList.add('btn-enhanced');
      }
    });
  }

  // Start initialization
  init();

  // Re-initialize on dynamic content load
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(() => {
      initMagneticButtons();
      initScrollReveals();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
})();

