/**
 * MICRO-INTERACTIONS & FEEDBACK
 * Ripple effects, haptic feedback, smooth transitions
 */

(function() {
  'use strict';

  // Ripple effect on click
  function createRipple(e) {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple-effect');

    const existingRipple = button.querySelector('.ripple-effect');
    if (existingRipple) {
      existingRipple.remove();
    }

    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  // Add ripple to all buttons
  function initRippleEffects() {
    const buttons = document.querySelectorAll('.btn, button, a.btn, .artwork-card, .card');
    buttons.forEach(button => {
      // Only add if not already added
      if (!button.dataset.rippleAdded) {
        button.addEventListener('click', createRipple);
        button.dataset.rippleAdded = 'true';
      }
    });
  }

  // Haptic feedback (mobile)
  function hapticFeedback(type = 'light') {
    if ('vibrate' in navigator) {
      const patterns = {
        light: 10,
        medium: 20,
        heavy: 30,
        success: [10, 50, 10],
        error: [20, 50, 20, 50, 20]
      };
      
      navigator.vibrate(patterns[type] || patterns.light);
    }
  }

  // Success animation
  function showSuccess(element) {
    element.classList.add('success-animation');
    hapticFeedback('success');
    
    setTimeout(() => {
      element.classList.remove('success-animation');
    }, 500);
  }

  // Scroll animations
  function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    const elements = document.querySelectorAll('.fade-in-up');
    elements.forEach(el => observer.observe(el));
  }

  // Magnetic effect
  function initMagneticEffect() {
    const magneticElements = document.querySelectorAll('.magnetic');
    
    magneticElements.forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const moveX = x * 0.1;
        const moveY = y * 0.1;
        
        element.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.transform = '';
      });
    });
  }

  // Page transition
  function initPageTransitions() {
    const pageElements = document.querySelectorAll('.page-transition');
    
    setTimeout(() => {
      pageElements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('loaded');
        }, index * 100);
      });
    }, 100);
  }

  // Expose to global scope
  window.hapticFeedback = hapticFeedback;
  window.showSuccess = showSuccess;

  // Initialize
  function init() {
    initRippleEffects();
    initScrollAnimations();
    initMagneticEffect();
    initPageTransitions();

    // Re-initialize after dynamic content
    document.addEventListener('galleryUpdated', () => {
      setTimeout(() => {
        initRippleEffects();
        initScrollAnimations();
      }, 100);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

