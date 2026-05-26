/**
 * ARTWORK CARD MICRO-INTERACTIONS
 * Award-winning, aggressive animations and interactions
 * Created: 2025-11-06
 */

(function() {
  'use strict';

  // ===== RIPPLE EFFECT ON CLICK =====
  function addRippleEffect() {
    document.addEventListener('click', function(e) {
      const card = e.target.closest('.artwork-card, .bento-card');
      if (!card) return;

      // Add ripple class
      card.classList.add('ripple-active');

      // Remove class after animation
      setTimeout(() => {
        card.classList.remove('ripple-active');
      }, 600);
    });
  }

  // ===== MAGNETIC PULL EFFECT (Cards follow cursor) =====
  function addMagneticPull() {
    // Only on desktop/tablets (not mobile)
    if (window.innerWidth < 768) return;

    const cards = document.querySelectorAll('.artwork-card, .bento-card');

    cards.forEach(card => {
      card.addEventListener('mousemove', function(e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;
        
        // Subtle tilt based on cursor position
        const tiltX = deltaY * 10; // Max 10deg tilt
        const tiltY = -deltaX * 10;
        
        card.style.transform = `translateY(-12px) scale(1.03) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      });

      card.addEventListener('mouseleave', function() {
        card.style.transform = '';
      });
    });
  }

  // ===== PARALLAX IMAGE MOVEMENT =====
  function addParallaxImages() {
    if (window.innerWidth < 768) return;

    const cards = document.querySelectorAll('.artwork-card, .bento-card');

    cards.forEach(card => {
      const img = card.querySelector('img');
      if (!img) return;

      card.addEventListener('mousemove', function(e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;
        
        // Subtle parallax movement
        const moveX = deltaX * 8;
        const moveY = deltaY * 8;
        
        img.style.transform = `scale(1.08) translate(${moveX}px, ${moveY}px) translateZ(20px)`;
      });

      card.addEventListener('mouseleave', function() {
        img.style.transform = '';
      });
    });
  }

  // ===== FAVORITE BUTTON ANIMATION =====
  function addFavoriteAnimation() {
    document.addEventListener('click', function(e) {
      const btn = e.target.closest('.artwork-favorite-btn, .favorite-btn');
      if (!btn) return;

      e.stopPropagation(); // Prevent card click
      e.preventDefault();

      // Toggle active state
      btn.classList.toggle('active');

      // Create floating hearts
      if (btn.classList.contains('active')) {
        createFloatingHearts(btn);
        
        // Vibrate if supported
        if ('vibrate' in navigator) {
          navigator.vibrate([50, 30, 50]);
        }
      }
    });
  }

  function createFloatingHearts(btn) {
    for (let i = 0; i < 5; i++) {
      const heart = document.createElement('div');
      heart.innerHTML = '❤️';
      heart.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        font-size: ${12 + Math.random() * 12}px;
        pointer-events: none;
        z-index: 9999;
        animation: float-heart ${1 + Math.random()}s ease-out forwards;
        animation-delay: ${i * 0.1}s;
      `;

      document.body.appendChild(heart);

      // Remove after animation
      setTimeout(() => heart.remove(), 2000);
    }

    // Add floating animation
    if (!document.getElementById('float-heart-style')) {
      const style = document.createElement('style');
      style.id = 'float-heart-style';
      style.textContent = `
        @keyframes float-heart {
          0% {
            transform: translate(-50%, -50%) translateY(0) scale(0);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -50%) translateY(-40px) scale(1.2);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) translateY(-80px) scale(0.8);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // ===== QUICK VIEW BUTTON =====
  function addQuickViewListeners() {
    document.addEventListener('click', function(e) {
      const btn = e.target.closest('.artwork-quick-view-btn, .quick-view-btn');
      if (!btn) return;

      e.stopPropagation(); // Prevent card click
      e.preventDefault();

      const card = btn.closest('.artwork-card, .bento-card');
      const artworkId = card?.dataset?.artworkId || card?.dataset?.id;

      // Trigger lightbox/modal
      if (artworkId) {
        // You can integrate with existing lightbox here
        // For now, just add a visual feedback
        btn.style.transform = 'translateX(-50%) scale(0.9)';
        setTimeout(() => {
          btn.style.transform = '';
        }, 200);
      }
    });
  }

  // ===== INTERSECTION OBSERVER FOR ENTRANCE ANIMATIONS =====
  function setupEntranceAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    const cards = document.querySelectorAll('.artwork-card, .bento-card');
    cards.forEach(card => observer.observe(card));
  }

  // ===== SOUND EFFECTS (Optional, user-controlled) =====
  let soundEnabled = false;
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  function playHoverSound() {
    if (!soundEnabled) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }

  function playClickSound() {
    if (!soundEnabled) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 1200;
    oscillator.type = 'square';

    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.05);
  }

  // Optional: Enable sound via console command
  window.enableArtworkSounds = function() {
    soundEnabled = true;
  };

  window.disableArtworkSounds = function() {
    soundEnabled = false;
  };

  // ===== PERFORMANCE MONITORING =====
  function checkPerformance() {
    // Disable heavy effects on low-end devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      document.documentElement.classList.add('low-performance-mode');
    }

    // Disable effects if battery is low
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        if (battery.level < 0.15) {
          document.documentElement.classList.add('low-battery-mode');
        }
      });
    }
  }

  // ===== KEYBOARD NAVIGATION =====
  function addKeyboardNav() {
    let currentIndex = -1;
    const cards = Array.from(document.querySelectorAll('.artwork-card, .bento-card'));

    document.addEventListener('keydown', function(e) {
      // Only if focus is on body (not in form fields)
      if (document.activeElement !== document.body) return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        currentIndex = Math.min(currentIndex + 1, cards.length - 1);
        cards[currentIndex]?.focus();
        cards[currentIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        currentIndex = Math.max(currentIndex - 1, 0);
        cards[currentIndex]?.focus();
        cards[currentIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (e.key === 'Enter' && currentIndex >= 0) {
        e.preventDefault();
        cards[currentIndex]?.click();
      }
    });

    // Make cards focusable
    cards.forEach((card, index) => {
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `View artwork ${index + 1}`);
    });
  }

  // ===== INITIALIZE ALL INTERACTIONS =====
  function init() {
    // Check if we should run (not on reduced motion preference)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setupEntranceAnimations(); // Still show entrance, but simplified
      return;
    }

    // Initialize all micro-interactions
    addRippleEffect();
    addMagneticPull();
    addParallaxImages();
    addFavoriteAnimation();
    addQuickViewListeners();
    setupEntranceAnimations();
    addKeyboardNav();
    checkPerformance();

  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-initialize when new cards are added (e.g., infinite scroll)
  window.reinitArtworkInteractions = function() {
    addMagneticPull();
    addParallaxImages();
    setupEntranceAnimations();
  };

})();

