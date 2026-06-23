/* floating-home-button.js — Persistent "Home" button for 70+ UX safety
   Always visible, gives users confidence they can return to homepage
   Reduces "lost" anxiety. Positioned alongside back-to-top button.
*/

(function() {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── Create Floating Home Button ──────────────────────────────────────── */
  function createHomeButton() {
    const btn = document.createElement('button');
    btn.id = 'floating-home-btn';
    btn.setAttribute('aria-label', 'Return to home');
    btn.setAttribute('title', 'Return to home');
    btn.innerHTML = '⌂'; // House icon

    btn.style.cssText = `
      position: fixed;
      bottom: 28px;
      right: calc(28px + 64px); /* Right of back-to-top button (48px + 16px gap) */
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fcf9f3;
      border: 1px solid #c4c7c7;
      cursor: pointer;
      font-size: 20px;
      color: #575757;
      z-index: 401;
      opacity: 0;
      transform: translateY(8px);
      transition: opacity 0.22s ease, transform 0.22s ease, color 0.15s ease, border-color 0.15s ease;
      pointer-events: none;
      border-radius: 2px;
    `;

    document.body.appendChild(btn);

    // Show on scroll past hero
    window.addEventListener('scroll', () => {
      const isVisible = window.scrollY > 300;
      btn.classList.toggle('home-visible', isVisible);

      if (isVisible && btn.style.opacity === '0') {
        btn.style.opacity = '1';
        btn.style.transform = 'translateY(0)';
        btn.style.pointerEvents = 'auto';
      } else if (!isVisible && btn.style.opacity === '1') {
        btn.style.opacity = '0';
        btn.style.transform = 'translateY(8px)';
        btn.style.pointerEvents = 'none';
      }
    }, { passive: true });

    // Hover state
    btn.addEventListener('mouseenter', () => {
      btn.style.color = '#FF6600';
      btn.style.borderColor = '#FF6600';
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.color = '#575757';
      btn.style.borderColor = '#c4c7c7';
    });

    // Click to go home
    btn.addEventListener('click', () => {
      window.location.href = '/';
    });

    // Adjust for mobile (position above bottom nav bar if present)
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const adjustPosition = () => {
      if (mediaQuery.matches) {
        btn.style.bottom = '88px'; // Above mobile nav
        btn.style.right = '16px';
      } else {
        btn.style.bottom = '28px';
        btn.style.right = 'calc(28px + 64px)';
      }
    };

    adjustPosition();
    mediaQuery.addEventListener('change', adjustPosition);
  }

  /* ─── Animate Entrance (if anime.js available) ────────────────────────── */
  function setupEntrance() {
    if (!window.anime || prefersReducedMotion) return;

    const btn = document.getElementById('floating-home-btn');
    if (!btn) return;

    // One-time entrance animation when button first becomes visible
    let hasAnimated = false;
    const checkScroll = () => {
      if (window.scrollY > 300 && !hasAnimated) {
        hasAnimated = true;
        anime({
          targets: btn,
          scale: [0.8, 1],
          duration: 300,
          easing: 'easeOutElastic(1, 0.6)'
        });
        window.removeEventListener('scroll', checkScroll);
      }
    };

    window.addEventListener('scroll', checkScroll, { passive: true });
  }

  /* ─── Init ──────────────────────────────────────────────────────────────– */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    createHomeButton();
    setupEntrance();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
