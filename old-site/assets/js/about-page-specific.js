/**
 * ABOUT PAGE SPECIFIC JAVASCRIPT
 * Extracted from about.html inline scripts
 * Date: January 9, 2026
 * 
 * Contains all page-specific functionality for about.html:
 * - Scroll reveal fallback for browsers without animation-timeline support
 * - Drone animations performance optimization
 * - UX/UI features component loading
 */

(function() {
  'use strict';

  // ============================================
  // 1. SCROLL REVEAL FALLBACK
  // Fallback for browsers without animation-timeline support
  // ============================================
  (function() {
    // Fallback for browsers without animation-timeline support
    if (!CSS.supports('animation-timeline: view()')) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      }, { threshold: 0.1 });
      
      document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
    }
  })();

  // ============================================
  // 2. DRONE ANIMATIONS PERFORMANCE OPTIMIZATION
  // ============================================
  (function() {
    const squadron = document.querySelector('.about-drone-squadron');
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
  // 3. LOAD UX/UI FEATURES HTML COMPONENTS
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

})();
