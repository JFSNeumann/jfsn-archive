/* chromatic-animations.js — Canvas interactivity enhancements with anime.js
   Makes the chromatic river scroll-driven and gesture-responsive
   - Vertex wave animations on scroll
   - Color palette morphing between decades
   - Hover state expansions
   - Swipe gesture controls (mobile)
*/

(function() {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Decade color palette
  const decadePalettes = {
    '1970s': { label: '1970s', color: '#8B4513', hue: 30 },
    '1980s': { label: '1980s', color: '#CD853F', hue: 25 },
    '1990s': { label: '1990s', color: '#DAA520', hue: 45 },
    '2000s': { label: '2000s', color: '#FF8C00', hue: 38 },
    '2010s': { label: '2010s', color: '#FF6347', hue: 9 },
    '2020s': { label: '2020s', color: '#DC143C', hue: 0 }
  };

  /* ─── Scroll-Driven Wave Animation ──────────────────────────────────────── */
  function setupScrollWaves() {
    if (prefersReducedMotion) return;

    const canvas = document.getElementById('river-canvas');
    const wrap = document.getElementById('river-wrap');
    if (!canvas || !wrap) return;

    let scrollProgress = 0;
    const originalDrawFunction = window.__drawRiver; // Assumes river has a draw function

    window.addEventListener('scroll', function() {
      const wrapRect = wrap.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate scroll progress (0 = off-screen bottom, 1 = off-screen top)
      scrollProgress = Math.max(0, Math.min(1,
        (windowHeight - wrapRect.top) / (windowHeight + wrapRect.height)
      ));

      // Apply subtle wave effect via canvas transform
      const waveOffset = Math.sin(scrollProgress * Math.PI) * 2;
      canvas.style.transform = `translateY(${waveOffset}px)`;
    }, { passive: true });
  }

  /* ─── Decade Label Animation ────────────────────────────────────────────── */
  function setupDecadeLabels() {
    if (prefersReducedMotion) return;

    const decadeLabels = document.getElementById('decade-labels');
    if (!decadeLabels) return;

    // Animate decade labels on scroll
    const labels = decadeLabels.querySelectorAll('.decade-label, span');
    if (labels.length === 0) return;

    window.addEventListener('scroll', function() {
      const rect = decadeLabels.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

      if (isVisible) {
        // Highlight visible decade
        const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        const hoverIndex = Math.floor(scrollPercent * labels.length);

        labels.forEach((label, idx) => {
          const opacity = idx === hoverIndex ? 1 : 0.4;
          anime({
            targets: label,
            opacity: opacity,
            duration: 200,
            easing: 'easeOutQuad'
          });
        });
      }
    }, { passive: true });
  }

  /* ─── Hover State Expansion ──────────────────────────────────────────────── */
  function setupHoverExpansion() {
    if (prefersReducedMotion) return;

    const canvas = document.getElementById('river-canvas');
    if (!canvas) return;

    canvas.addEventListener('mouseenter', function() {
      anime({
        targets: '#river-thumb',
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuad'
      });
    });

    canvas.addEventListener('mouseleave', function() {
      anime({
        targets: '#river-thumb',
        opacity: [1, 0],
        duration: 200,
        easing: 'easeOutQuad'
      });
    });
  }

  /* ─── Gesture-Responsive Swipe Controls ──────────────────────────────────– */
  function setupGestureControls() {
    if (prefersReducedMotion) return;

    const canvas = document.getElementById('river-canvas');
    if (!canvas) return;

    let lastTouchX = 0;
    let swipeVelocity = 0;

    canvas.addEventListener('touchstart', (e) => {
      lastTouchX = e.touches[0].clientX;
    }, { passive: true });

    canvas.addEventListener('touchmove', (e) => {
      const currentX = e.touches[0].clientX;
      const deltaX = currentX - lastTouchX;
      swipeVelocity = Math.abs(deltaX);
      lastTouchX = currentX;

      // High-velocity swipe: brighten canvas hint
      if (swipeVelocity > 5) {
        const hint = document.querySelector('[aria-label*="Color slices"]');
        if (hint) {
          anime({
            targets: hint,
            opacity: [anime.getEasing('easeOutQuad')(swipeVelocity / 20), 0.6],
            duration: 150,
            easing: 'easeOutQuad'
          });
        }
      }
    }, { passive: true });

    canvas.addEventListener('touchend', () => {
      // Reset hint on touch end
      const hint = document.querySelector('[aria-label*="Color slices"]');
      if (hint) {
        anime({
          targets: hint,
          opacity: [0.6, 1],
          duration: 200,
          easing: 'easeOutQuad'
        });
      }
    }, { passive: true });
  }

  /* ─── Count Animation on Page Load ──────────────────────────────────────── */
  function setupCountAnimation() {
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Animate the count up from a lower number
          const countEl = document.getElementById('chrom-count-works');
          if (countEl && countEl.textContent === '1,084') {
            anime({
              targets: { count: 900 },
              count: 1084,
              duration: 1200,
              easing: 'easeOutQuad',
              round: true,
              update: function(anim) {
                countEl.textContent = Math.round(anim.progress * 184 + 900).toLocaleString();
              }
            });
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    const countSection = document.getElementById('chromatic-counts');
    if (countSection) observer.observe(countSection);
  }

  /* ─── Init ──────────────────────────────────────────────────────────────── */
  function init() {
    if (!window.anime) return; // anime.js not loaded

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    setupScrollWaves();
    setupDecadeLabels();
    setupHoverExpansion();
    setupGestureControls();
    setupCountAnimation();
  }

  // Start when anime.js is available
  if (window.anime) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }
})();
