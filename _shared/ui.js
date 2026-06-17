/* ui.js — shared interaction enhancements */

(function () {
  'use strict';

  // ─── Vertical "you are here" label ───────────────────────────────────────
  const label = document.body.dataset.pageLabel;
  if (label) {
    const el = document.createElement('div');
    el.className = 'page-label-vert';
    el.textContent = label;
    document.body.appendChild(el);
  }

  // ─── Mobile menu button state ───────────────────────────────────────────
  const menuBtn = document.getElementById('nav-menu-btn');
  const menuDrawer = document.getElementById('mobile-menu-drawer');
  const menuBackdrop = document.getElementById('mobile-menu-backdrop');
  const menuClose = document.getElementById('nav-menu-close');

  if (menuBtn && menuDrawer) {
    const toggleMenu = function(open) {
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuDrawer.parentElement.style.display = open ? 'block' : 'none';
    };

    menuBtn.addEventListener('click', () => {
      const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
      toggleMenu(!isOpen);
    });

    if (menuClose) {
      menuClose.addEventListener('click', () => toggleMenu(false));
    }
    if (menuBackdrop) {
      menuBackdrop.addEventListener('click', () => toggleMenu(false));
    }
  }

  // ─── Keyboard navigation ─────────────────────────────────────────────────
  // Decade pages: ← / → between decades
  // Visual feedback: brief label shows destination
  document.addEventListener('keydown', function (e) {
    // Don't fire when user is typing in an input/textarea
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    const showNavHint = function(label) {
      // Briefly flash a label when keyboard nav is pressed
      let hint = document.getElementById('decade-nav-hint');
      if (!hint) {
        hint = document.createElement('div');
        hint.id = 'decade-nav-hint';
        hint.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-family:Inter,sans-serif;font-size:14px;font-weight:600;letter-spacing:0.05em;color:#FF6600;pointer-events:none;z-index:100;opacity:0;transition:opacity 0.2s ease;';
        document.body.appendChild(hint);
      }
      hint.textContent = label;
      hint.style.opacity = '1';
      clearTimeout(hint._timeout);
      hint._timeout = setTimeout(() => {
        hint.style.opacity = '0';
      }, 600);
    };

    if (e.key === 'ArrowLeft') {
      const el = document.querySelector('[data-prev-decade]');
      if (el) {
        e.preventDefault();
        showNavHint('← ' + (el.textContent || 'Previous'));
        setTimeout(() => { window.location.href = el.href; }, 200);
      }
    }
    if (e.key === 'ArrowRight') {
      const el = document.querySelector('[data-next-decade]');
      if (el) {
        e.preventDefault();
        showNavHint((el.textContent || 'Next') + ' →');
        setTimeout(() => { window.location.href = el.href; }, 200);
      }
    }
  });

  // ─── Decade hero heading: zoom-out as hero scrolls away ──────────────────
  const hero    = document.querySelector('.decade-hero');
  const heading = document.querySelector('.decade-heading');

  if (hero && heading) {
    const onScroll = function () {
      const rect     = hero.getBoundingClientRect();
      const heroH    = hero.offsetHeight;
      // progress: 0 = hero fully visible, 1 = hero fully scrolled past
      const progress = Math.max(0, Math.min(1, -rect.top / heroH));
      const scale    = 1 + progress * 0.28;
      const opacity  = 1 - progress * 1.4; // fade faster than scale
      heading.style.transform = 'scale(' + scale + ')';
      heading.style.opacity   = Math.max(0, opacity);
    };

    // Only run if reduced-motion is not set
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll(); // init
    }
  }

  // ─── Toast notification system ──────────────────────────────────────────
  // Usage: window.showToast('Copied!', 2000)
  window.showToast = function(message, duration = 2000) {
    let container = document.getElementById('jfsn-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'jfsn-toast-container';
      container.style.cssText = 'position:fixed;bottom:28px;right:28px;z-index:1000;pointer-events:none;';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'jfsn-toast';
    toast.textContent = message;
    toast.style.cssText = `
      font-family: Inter, sans-serif;
      font-size: 12px;
      font-weight: 500;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #0B0B0B;
      background: #fcf9f3;
      border: 1px solid #8e7164;
      padding: 10px 14px;
      border-radius: 0;
      margin-bottom: 8px;
      opacity: 0;
      transform: translateY(8px);
      transition: opacity 0.25s ease, transform 0.25s ease;
      pointer-events: auto;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    `;
    container.appendChild(toast);

    // Trigger entrance animation
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    // Auto-remove
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      setTimeout(() => toast.remove(), 250);
    }, duration);
  };

  // Respect prefers-reduced-motion for all toast animations
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const origToast = window.showToast;
    window.showToast = function(message, duration = 2000) {
      let container = document.getElementById('jfsn-toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'jfsn-toast-container';
        container.style.cssText = 'position:fixed;bottom:28px;right:28px;z-index:1000;pointer-events:none;';
        document.body.appendChild(container);
      }
      const toast = document.createElement('div');
      toast.textContent = message;
      toast.style.cssText = `
        font-family: Inter, sans-serif;
        font-size: 12px;
        font-weight: 500;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: #0B0B0B;
        background: #fcf9f3;
        border: 1px solid #8e7164;
        padding: 10px 14px;
        margin-bottom: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      `;
      container.appendChild(toast);
      setTimeout(() => toast.remove(), duration);
    };
  }

  // Artwork thumbnails are full color always — no mask-image, no scroll-reveal.
  // (Removed session 8; banned — do not re-add.)

})();
