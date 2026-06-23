/* scroll-choreography.js — Unified navbar/footer scroll orchestration
   Coordinates entrance animations + scroll-responsive header/footer behavior
   Master timeline system for site-wide motion
*/

(function() {
  'use strict';

  // Check if animations are disabled
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Color palette per page section — maps section class/data-* to accent color
  const sectionAccents = {
    'archive': '#e05900',      // Archive orange
    'guernica': '#c41e3a',     // Guernica red
    'targets': '#f4a259',      // Targets warm orange
    'framed': '#9d7e5d',       // Framed brown
    'torsos': '#7b5a6e',       // Torsos purple
    'crosses': '#4a6fa5',      // Crosses blue
    'snowmann': '#2d5a3d',     // Snowmann green
    'gallery': '#d4a574',      // Gallery gold
    'collaboration': '#8b6f47',// Collab brown
    'default': '#FF6600'       // Default core orange
  };

  // Chromatic decade colors (from chromatic.json era)
  const decadeColors = {
    '1970s': '#8B4513',
    '1980s': '#CD853F',
    '1990s': '#DAA520',
    '2000s': '#FF8C00',
    '2010s': '#FF6347',
    '2020s': '#DC143C'
  };

  /* ─── State Tracking ─────────────────────────────────────────────────────── */
  let state = {
    scrollY: 0,
    scrollDir: 'down',
    scrollVel: 0,
    lastScrollY: 0,
    lastScrollTime: 0,
    isReading: false,      // Slow scroll = reading state
    currentSection: 'default',
    headerCompact: false
  };

  /* ─── Entrance Animation (Page Load) ────────────────────────────────────── */
  function animateEntrance() {
    if (prefersReducedMotion) return;

    const header = document.querySelector('header');
    const logo = document.querySelector('.jfsn-wordmark');
    const navLinks = document.querySelectorAll('header nav a');
    const sideButtons = document.querySelectorAll('header button');
    const footer = document.querySelector('footer');
    const footerLinks = document.querySelectorAll('footer a');

    if (!header) return;

    // Logo + wordmark entrance
    if (logo) {
      anime.set(logo, { opacity: 0, scale: 0.9 });
      anime({
        targets: logo,
        opacity: [0, 1],
        scale: [0.9, 1],
        duration: 400,
        easing: 'easeOutCubic',
        delay: 0
      });
    }

    // Desktop nav links stagger from above
    if (navLinks.length > 0) {
      anime.set(navLinks, { opacity: 0, translateY: -8 });
      anime({
        targets: navLinks,
        opacity: [0, 1],
        translateY: [-8, 0],
        duration: 350,
        easing: 'easeOutCubic',
        delay: anime.stagger(80, { start: 200 })
      });
    }

    // Side buttons (search, theme) fade in
    if (sideButtons.length > 0) {
      anime.set(sideButtons, { opacity: 0 });
      anime({
        targets: sideButtons,
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuad',
        delay: 300
      });
    }

    // Footer mirror choreography (stagger from below on scroll-into-view)
    if (footer) {
      const footerObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              anime.set(footerLinks, { opacity: 0, translateY: 8 });
              anime({
                targets: footerLinks,
                opacity: [0, 1],
                translateY: [8, 0],
                duration: 350,
                easing: 'easeOutCubic',
                delay: anime.stagger(60)
              });
              footerObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );
      footerObserver.observe(footer);
    }
  }

  /* ─── Scroll Direction & Velocity Detection ──────────────────────────────── */
  function updateScrollState() {
    const now = Date.now();
    const dy = state.scrollY - state.lastScrollY;
    const dt = Math.max(now - state.lastScrollTime, 1);

    state.scrollDir = dy > 0 ? 'down' : dy < 0 ? 'up' : state.scrollDir;
    state.scrollVel = Math.abs(dy / dt); // pixels per ms
    state.isReading = state.scrollVel < 0.3; // Slow scroll = reading
    state.lastScrollY = state.scrollY;
    state.lastScrollTime = now;
  }

  /* ─── Detect Current Section (for accent color mapping) ──────────────────── */
  function detectCurrentSection() {
    // Check for data-section attribute on body or main sections
    const main = document.querySelector('main');
    if (main) {
      const sections = main.querySelectorAll('[data-section]');
      for (let section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2) {
          const sectionName = section.getAttribute('data-section');
          if (sectionName) state.currentSection = sectionName;
        }
      }
    }

    // Fallback: detect from page class or current page
    const body = document.body;
    for (let [key, color] of Object.entries(sectionAccents)) {
      if (body.classList.contains(`page-${key}`) || window.location.pathname.includes(key)) {
        state.currentSection = key;
        break;
      }
    }
  }

  /* ─── Header Scroll Response ─────────────────────────────────────────────── */
  function updateHeaderOnScroll() {
    if (prefersReducedMotion) return;

    const header = document.querySelector('header');
    const navLinks = document.querySelectorAll('header nav a');
    if (!header) return;

    // Reading state: nav links fade to 60%, blur intensifies
    if (state.isReading && state.scrollY > 80) {
      if (navLinks.length > 0) {
        anime({
          targets: navLinks,
          opacity: [anime.getEasing('easeOutQuad')(state.scrollVel / 0.5), 0.6],
          duration: 200,
          easing: 'easeOutQuad'
        });
      }
    } else if (state.scrollY > 80 && !state.isReading) {
      // Skimming: nav links brighten
      if (navLinks.length > 0) {
        anime({
          targets: navLinks,
          opacity: [anime.getEasing('easeOutQuad')(state.scrollVel / 0.5), 1],
          duration: 200,
          easing: 'easeOutQuad'
        });
      }
    }
  }

  /* ─── Accent Color Transition ────────────────────────────────────────────── */
  function updateAccentColor() {
    if (prefersReducedMotion) return;

    const targetColor = sectionAccents[state.currentSection] || sectionAccents.default;
    const butterfly = document.querySelector('.jfsn-wordmark img');

    if (butterfly) {
      // Get current color from computed style or animate from current
      anime({
        targets: butterfly,
        filter: getFilterForColor(targetColor),
        duration: 600,
        easing: 'easeInOutQuad'
      });
    }
  }

  // Helper: map accent color to SVG filter
  function getFilterForColor(hexColor) {
    // Core orange (#FF6600) is the default filter state
    // Interpolate hue-rotate based on target color
    const colorMap = {
      '#FF6600': 'invert(63%) sepia(72%) saturate(1500%) hue-rotate(-30deg) brightness(105%) contrast(101%)',
      '#e05900': 'invert(53%) sepia(85%) saturate(1200%) hue-rotate(-10deg) brightness(100%) contrast(110%)',
      '#c41e3a': 'invert(45%) sepia(90%) saturate(1400%) hue-rotate(340deg) brightness(95%) contrast(115%)',
      '#f4a259': 'invert(70%) sepia(60%) saturate(1000%) hue-rotate(0deg) brightness(105%) contrast(100%)',
      '#2d5a3d': 'invert(35%) sepia(40%) saturate(800%) hue-rotate(120deg) brightness(95%) contrast(110%)',
      'default': 'invert(63%) sepia(72%) saturate(1500%) hue-rotate(-30deg) brightness(105%) contrast(101%)'
    };
    return colorMap[hexColor] || colorMap.default;
  }

  /* ─── Back-to-Top Pulse Beacon ──────────────────────────────────────────── */
  function setupBTTBeacon() {
    if (prefersReducedMotion) return;

    const bttFloat = document.getElementById('btt-float');
    if (!bttFloat) return;

    // Observe visibility changes
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // BTT is visible — pulse entrance
          anime.set(bttFloat, { opacity: 0, scale: 0.8 });
          anime({
            targets: bttFloat,
            opacity: [0, 1],
            scale: [0.8, 1],
            duration: 400,
            easing: 'easeOutElastic(1, 0.6)'
          });

          // Then start breathing loop
          anime({
            targets: bttFloat,
            scale: [1, 1.08, 1],
            duration: 3000,
            easing: 'easeInOutQuad',
            loop: true
          });

          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(bttFloat);
  }

  /* ─── Scroll Event Handler ───────────────────────────────────────────────── */
  function onScroll() {
    state.scrollY = window.scrollY;
    updateScrollState();
    detectCurrentSection();
    updateHeaderOnScroll();
    updateAccentColor();
  }

  /* ─── Init ──────────────────────────────────────────────────────────────── */
  function init() {
    if (!window.anime) {
      // anime.js not loaded; exit gracefully
      return;
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    // Run entrance animation
    animateEntrance();

    // Setup BTT beacon
    setupBTTBeacon();

    // Add scroll listener (passive for performance)
    window.addEventListener('scroll', onScroll, { passive: true });

    // Initial state
    onScroll();
  }

  // Start when anime.js is available
  if (window.anime) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  } else {
    // Wait for anime.js to load
    document.addEventListener('DOMContentLoaded', init);
  }
})();
