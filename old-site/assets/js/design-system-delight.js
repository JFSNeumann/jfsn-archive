/* =========================================== */
/* UNIFIED DESIGN SYSTEM - DELIGHT JAVASCRIPT */
/* Advanced micro-interactions & delightful UX */
/* Award-winning interaction design */
/* =========================================== */

(function() {
  'use strict';
  
  // ===== MAGNETIC CURSOR FOLLOW =====
  function initMagneticEffect() {
    const magneticElements = document.querySelectorAll('.magnetic');
    
    magneticElements.forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const moveX = x * 0.1;
        const moveY = y * 0.1;
        
        element.style.setProperty('--magnetic-x', `${moveX}px`);
        element.style.setProperty('--magnetic-y', `${moveY}px`);
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.setProperty('--magnetic-x', '0');
        element.style.setProperty('--magnetic-y', '0');
      });
    });
  }
  
  // ===== 3D TILT ON MOUSE MOVE =====
  function init3DTilt() {
    const tiltElements = document.querySelectorAll('.tilt-3d-interactive');
    
    tiltElements.forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / centerY * -5;
        const rotateY = (x - centerX) / centerX * 5;
        
        element.style.setProperty('--tilt-x', `${rotateX}`);
        element.style.setProperty('--tilt-y', `${rotateY}`);
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.setProperty('--tilt-x', '0');
        element.style.setProperty('--tilt-y', '0');
      });
    });
  }
  
  // ===== SCROLL REVEAL ANIMATIONS =====
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll, .reveal-left, .reveal-right, .reveal-scale');
    
    if (revealElements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => observer.observe(el));
  }
  
  // ===== PARALLAX EFFECTS =====
  function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax-slow, .parallax-medium, .parallax-fast');
    
    if (parallaxElements.length === 0) return;
    
    let ticking = false;
    
    const updateParallax = () => {
      const scrollY = window.scrollY;
      
      parallaxElements.forEach(element => {
        const speed = element.classList.contains('parallax-fast') ? 0.5 :
                     element.classList.contains('parallax-medium') ? 0.3 : 0.1;
        const yPos = scrollY * speed;
        element.style.transform = `translateY(${yPos}px)`;
      });
      
      ticking = false;
    };
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }
  
  // ===== CELEBRATION EFFECT =====
  function celebrate(element) {
    if (!element) return;
    
    element.classList.add('celebrate');
    
    setTimeout(() => {
      element.classList.remove('celebrate');
    }, 600);
  }
  
  // ===== PARTICLE EFFECT TRIGGER =====
  function triggerParticleEffect(element) {
    if (!element) return;
    
    element.classList.add('particle-effect');
    
    setTimeout(() => {
      element.classList.remove('particle-effect');
    }, 2000);
  }
  
  // ===== INITIALIZE ALL EFFECTS =====
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }
    
    initMagneticEffect();
    init3DTilt();
    initScrollReveal();
    initParallax();
    
    // Re-initialize after dynamic content loads
    document.addEventListener('contentLoaded', () => {
      initMagneticEffect();
      init3DTilt();
      initScrollReveal();
    });
  }
  
  // Expose to global scope
  window.designSystemDelight = {
    celebrate,
    triggerParticleEffect,
    initMagneticEffect,
    init3DTilt,
    initScrollReveal,
    initParallax
  };
  
  // Initialize
  init();
})();

