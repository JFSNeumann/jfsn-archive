/* GENERATED FILE — do not edit directly.
   Bundle: nav-late.bundle.js — runs after the inline header/dark-mode scripts, 37 stamped pages
   Source: each section below is copied verbatim from its own file in
   _shared/ (or repo root). To change behavior, edit that source file,
   then regenerate with `npm run build:js`. Hand-editing this file will
   be silently overwritten on the next build.
   See BUNDLE_PLAN.md for why this exact file list and order. */

/* ===== _shared/scroll-choreography.js ===== */
/* scroll-choreography.js — Unified navbar/footer scroll orchestration
   Coordinates entrance animations + scroll-responsive header/footer behavior
   Master timeline system for site-wide motion + parallax + gesture-responsive animations

   Enhancements:
   - Parallax choreography: hero/footer layers move at different rates
   - Gesture-responsive: mobile swipe velocity triggers animations
   - Scroll-section reveals: nav items + content light up as sections enter viewport
*/

(function() {
  'use strict';

  // Check if animations are disabled
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // anime.js (this bundled build) doesn't expose `anime.getEasing` — calling
  // it threw on every scroll event, silently aborting updateHeaderOnScroll()
  // before it ever animated anything. This is a standalone easeOutQuad
  // clamped to [0,1], used the same way the missing helper would have been:
  // as a velocity-responsive starting opacity.
  function easeOutQuad(t) {
    t = Math.min(Math.max(t, 0), 1);
    return 1 - (1 - t) * (1 - t);
  }

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
          opacity: [easeOutQuad(state.scrollVel / 0.5), 0.6],
          duration: 200,
          easing: 'easeOutQuad'
        });
      }
    } else if (state.scrollY > 80 && !state.isReading) {
      // Skimming: nav links brighten
      if (navLinks.length > 0) {
        anime({
          targets: navLinks,
          opacity: [easeOutQuad(state.scrollVel / 0.5), 1],
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

  /* ─── Parallax Choreography ──────────────────────────────────────────────── */
  function setupParallax() {
    if (prefersReducedMotion) return;

    const footer = document.querySelector('footer');

    // NOTE: this used to also parallax #hero-slides-d (the hero artwork image
    // container) at 0.25x scroll — removed because it violated CLAUDE.md's
    // hard rail that the artwork plane must stay locked at 1.0x scroll.
    // depth-hero.js now carries the index.html hero's motion budget instead,
    // via the surrounding headline (#dh-word), never the artwork itself.

    // Footer gradient parallax (drifts upward on scroll)
    if (footer) {
      const footerGradient = footer.querySelector('[class*="gradient"], [class*="fade"]');
      if (footerGradient) {
        window.addEventListener('scroll', function() {
          const footerRect = footer.getBoundingClientRect();
          if (footerRect.top < window.innerHeight) {
            const visibleProgress = 1 - (footerRect.top / window.innerHeight);
            const driftOffset = Math.min(visibleProgress * 30, 30);
            footerGradient.style.transform = `translateY(-${driftOffset}px)`;
          }
        }, { passive: true });
      }
    }
  }

  /* ─── Scroll-Section Nav Reveals ──────────────────────────────────────────── */
  function setupSectionReveals() {
    if (prefersReducedMotion) return;

    const navLinks = document.querySelectorAll('header nav a');
    if (navLinks.length === 0) return;

    // Map nav links to sections (by href)
    const linkMap = {};
    navLinks.forEach((link, idx) => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('http')) {
        const page = href.split('/').pop().replace('.html', '');
        linkMap[page] = link;
      }
    });

    // Observe main sections for visibility
    const sections = document.querySelectorAll('[data-section], main > section, main > article');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const sectionName = entry.target.getAttribute('data-section') ||
                           entry.target.id ||
                           entry.target.className.split(' ')[0];

        if (entry.isIntersecting) {
          // Section entered viewport — highlight corresponding nav link
          navLinks.forEach(link => {
            const linkHref = link.getAttribute('href').replace('.html', '');
            if (linkHref.includes(sectionName) || sectionName.includes('main')) {
              // Gentle highlight
              anime({
                targets: link,
                color: '#FF6600',
                duration: 300,
                easing: 'easeOutQuad'
              });
            }
          });
        }
      });
    }, { threshold: 0.3 });

    sections.forEach(section => observer.observe(section));
  }

  /* ─── Gesture Velocity Detection (Mobile) ────────────────────────────────── */
  function setupGestureResponsive() {
    if (prefersReducedMotion) return;

    let lastTouchY = 0;
    let lastTouchTime = 0;
    let swipeVelocity = 0;

    document.addEventListener('touchstart', (e) => {
      lastTouchY = e.touches[0].clientY;
      lastTouchTime = Date.now();
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      const currentY = e.touches[0].clientY;
      const currentTime = Date.now();
      const deltaY = currentY - lastTouchY;
      const deltaTime = currentTime - lastTouchTime;

      swipeVelocity = Math.abs(deltaY / deltaTime);
      lastTouchY = currentY;
      lastTouchTime = currentTime;

      // High-velocity swipe (fling): compress header, brighten nav
      const header = document.querySelector('header');
      if (header && swipeVelocity > 1.0) {
        const navLinks = header.querySelectorAll('nav a');
        anime({
          targets: navLinks,
          opacity: [easeOutQuad(swipeVelocity / 2), 0.8],
          duration: 150,
          easing: 'easeOutQuad'
        });
      }
    }, { passive: true });

    document.addEventListener('touchend', () => {
      // Reset nav opacity back to normal on touch end
      const header = document.querySelector('header');
      if (header) {
        const navLinks = header.querySelectorAll('nav a');
        anime({
          targets: navLinks,
          opacity: [0.8, 1],
          duration: 200,
          easing: 'easeOutQuad'
        });
      }
    }, { passive: true });
  }

  /* ─── Back-to-Top Pulse Beacon ──────────────────────────────────────────── */
  function setupBTTBeacon() {
    if (prefersReducedMotion) return;

    const bttFloat = document.getElementById('btt-float');
    if (!bttFloat) return;

    // Trigger once the button has actually crossed the site's real
    // visibility threshold (scrollY > 300, same value each page's own
    // inline script uses to toggle .btt-visible). An IntersectionObserver
    // alone is the wrong signal here: #btt-float is position:fixed, so it
    // is always geometrically inside the viewport and was firing this
    // pulse on first paint, before the button was meant to be visible.
    function checkVisible() {
      if (window.scrollY <= 300) return;

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

      window.removeEventListener('scroll', checkVisible);
    }

    window.addEventListener('scroll', checkVisible, { passive: true });
  }

  /* ─── Scroll Event Handler ───────────────────────────────────────────────── */
  // Throttled via requestAnimationFrame — the raw 'scroll' event can fire far
  // more than once per frame (trackpads especially), and each call below
  // creates new anime.js tweens on the same nav-link opacity / logo filter
  // targets. Without this, concurrent competing tweens stack up and cause
  // visible flicker during scroll. Same ticking-flag pattern as
  // section-parallax.js.
  let scrollTicking = false;
  function onScroll() {
    state.scrollY = window.scrollY;
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(function () {
      updateScrollState();
      detectCurrentSection();
      updateHeaderOnScroll();
      updateAccentColor();
      scrollTicking = false;
    });
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

    // Setup enhancements
    setupBTTBeacon();
    setupParallax();
    setupSectionReveals();
    setupGestureResponsive();

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


/* ===== _shared/floating-home-button.js ===== */
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
