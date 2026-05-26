/* ===========================================
   INDEX.HTML 3D EFFECTS & PERSPECTIVE
   3D tilt, parallax depth, floating animations, scroll parallax
   =========================================== */

(function() {
  'use strict';
  
  // 3D Tilt on Mouse Move
  function init3DTilt() {
    const cards = document.querySelectorAll('.card-3d, .artwork-card-3d, .tilt-3d');
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }
  
  // Parallax Depth Effect
  function initParallaxDepth() {
    const parallaxElements = document.querySelectorAll('.parallax-depth');
    
    parallaxElements.forEach(element => {
      const children = Array.from(element.children);
      children.forEach((child, index) => {
        child.style.transitionDelay = `${index * 0.1}s`;
      });
    });
  }
  
  // Floating Animation
  function initFloating() {
    const floatingElements = document.querySelectorAll('.float-3d, .floating');
    floatingElements.forEach(el => {
      el.classList.add('floating');
    });
  }
  
  // 3D Button Effects
  function init3DButtons() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(btn => {
      btn.classList.add('btn-3d');
    });
  }
  
  // Scroll-based 3D Parallax
  function initScrollParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax-3d]');
    
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      
      parallaxElements.forEach(element => {
        const speed = parseFloat(element.dataset.parallax3d) || 0.5;
        const translateZ = scrollY * speed;
        element.style.transform = `translateZ(${translateZ}px)`;
      });
    });
  }
  
  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init3DTilt();
      initParallaxDepth();
      initFloating();
      init3DButtons();
      initScrollParallax();
    });
  } else {
    init3DTilt();
    initParallaxDepth();
    initFloating();
    init3DButtons();
    initScrollParallax();
  }
  
  // Re-initialize on dynamic content
  const observer = new MutationObserver(() => {
    init3DTilt();
    initParallaxDepth();
    initFloating();
    init3DButtons();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();

