/* ===========================================
   INDEX.HTML MICRO-INTERACTIONS
   Button ripples, scroll reveals, celebrations, random artwork button
   =========================================== */

(function() {
  'use strict';
  
  // Add ripple effect to buttons
  function addRippleEffect() {
    const buttons = document.querySelectorAll('.btn:not(.btn-ripple)');
    buttons.forEach(btn => {
      btn.classList.add('btn-ripple');
    });
  }
  
  // Scroll reveal animations
  function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal-on-scroll');
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
    
    elements.forEach(el => observer.observe(el));
  }
  
  // Success celebration
  function celebrate(element) {
    element.classList.add('celebrate');
    setTimeout(() => {
      element.classList.remove('celebrate');
    }, 600);
  }
  
  // Particle effect on click
  function addParticleEffect(element) {
    element.classList.add('particle-effect');
    setTimeout(() => {
      element.classList.remove('particle-effect');
    }, 2000);
  }
  
  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      addRippleEffect();
      initScrollReveal();
    });
  } else {
    addRippleEffect();
    initScrollReveal();
  }
  
  // Re-initialize on dynamic content
  const observer = new MutationObserver(() => {
    addRippleEffect();
    initScrollReveal();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Expose globally
  window.celebrate = celebrate;
  window.addParticleEffect = addParticleEffect;
  
  // ===== RANDOM ARTWORK BUTTON =====
  function initRandomArtworkButton() {
    // Check if we're on a page with artworks
    const gallery = document.getElementById('gallery');
    if (!gallery) return;
    
    // Create floating random artwork button
    const randomBtn = document.createElement('button');
    randomBtn.className = 'random-artwork-btn';
    randomBtn.innerHTML = '<i class="fas fa-shuffle"></i><span>Random Artwork</span>';
    randomBtn.setAttribute('aria-label', 'View random artwork');
    randomBtn.setAttribute('title', 'Discover a random artwork');
    document.body.appendChild(randomBtn);
    
    randomBtn.addEventListener('click', () => {
      // Get all artwork cards
      const artworkCards = document.querySelectorAll('.artwork-card, a[data-fancybox="artwork-gallery"]');
      if (artworkCards.length === 0) return;
      
      // Select random artwork
      const randomIndex = Math.floor(Math.random() * artworkCards.length);
      const randomCard = artworkCards[randomIndex];
      
      // Celebrate button
      celebrate(randomBtn);
      addParticleEffect(randomBtn);
      
      // Scroll to random artwork with smooth animation
      randomCard.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'nearest'
      });
      
      // Highlight the artwork
      randomCard.classList.add('random-highlight');
      setTimeout(() => {
        randomCard.classList.remove('random-highlight');
      }, 2000);
      
      // Optional: Open in lightbox after a delay
      setTimeout(() => {
        if (randomCard.tagName === 'A' && randomCard.hasAttribute('data-fancybox')) {
          randomCard.click();
        }
      }, 800);
    });
  }
  
  // ===== ENHANCED SCROLL REVEAL FOR GALLERY =====
  function initEnhancedGalleryReveal() {
    const gallery = document.getElementById('gallery');
    if (!gallery) return;
    
    // Add reveal-on-scroll class to all artwork cards
    const observer = new MutationObserver(() => {
      const cards = gallery.querySelectorAll('.artwork-card:not(.reveal-on-scroll)');
      cards.forEach((card, index) => {
        card.classList.add('reveal-on-scroll');
        // Stagger delay
        card.style.transitionDelay = `${(index % 20) * 0.05}s`;
      });
    });
    
    observer.observe(gallery, { childList: true, subtree: true });
    
    // Initial setup
    const initialCards = gallery.querySelectorAll('.artwork-card');
    initialCards.forEach((card, index) => {
      card.classList.add('reveal-on-scroll');
      card.style.transitionDelay = `${(index % 20) * 0.05}s`;
    });
  }
  
  // Initialize new features
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initRandomArtworkButton();
      initEnhancedGalleryReveal();
    });
  } else {
    initRandomArtworkButton();
    initEnhancedGalleryReveal();
  }
})();

