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

  // ─── Keyboard navigation ─────────────────────────────────────────────────
  // Decade pages: ← / → between decades
  // Works best when data-prev-decade and data-next-decade are on the nav anchors
  document.addEventListener('keydown', function (e) {
    // Don't fire when user is typing in an input/textarea
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    if (e.key === 'ArrowLeft') {
      const el = document.querySelector('[data-prev-decade]');
      if (el) { e.preventDefault(); window.location.href = el.href; }
    }
    if (e.key === 'ArrowRight') {
      const el = document.querySelector('[data-next-decade]');
      if (el) { e.preventDefault(); window.location.href = el.href; }
    }
  });

  // ─── Keyboard nav hint badge for decade pages ────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    const prev = document.querySelector('[data-prev-decade]');
    const next = document.querySelector('[data-next-decade]');
    if (!prev && !next) return;
    const badge = document.createElement('div');
    badge.id = 'kbd-hint';
    badge.style.cssText = 'position:fixed;bottom:72px;right:16px;z-index:40;background:#ebe8e2;border:1px solid #c4c7c7;padding:6px 12px;font-family:Inter,sans-serif;font-size:10px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;color:#575757;transition:opacity 0.4s;pointer-events:none;';
    const prevLabel = prev ? prev.getAttribute('aria-label').replace('Previous decade: ', '') : '';
    const nextLabel = next ? next.getAttribute('aria-label').replace('Next decade: ', '') : '';
    badge.textContent = (prevLabel ? '← ' + prevLabel + '  ' : '') + (nextLabel ? nextLabel + ' →' : '');
    document.body.appendChild(badge);
    const hide = function () { badge.style.opacity = '0'; };
    setTimeout(hide, 4000);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') hide();
    }, { once: true });
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

  // ─── Color-fade reveal: color image behind greyscale + mask fade ──────────
  var MASK = 'linear-gradient(to bottom, black 0%, black 65%, transparent 100%)';
  document.querySelectorAll('.thumb__link').forEach(function(link) {
    var img = link.querySelector('img');
    if (!img) return;
    var src = img.getAttribute('src');
    if (src) {
      link.style.backgroundImage = 'url(' + src + ')';
      link.style.backgroundSize = 'cover';
      link.style.backgroundPosition = 'center';
    }
    img.style.webkitMaskImage = MASK;
    img.style.maskImage = MASK;
    link.addEventListener('mouseenter', function() {
      img.style.webkitMaskImage = 'none';
      img.style.maskImage = 'none';
    });
    link.addEventListener('mouseleave', function() {
      img.style.webkitMaskImage = MASK;
      img.style.maskImage = MASK;
    });
  });

  // ─── Scroll reveal for .thumb items (medium pages) ───────────────────────
  const thumbs = document.querySelectorAll('.thumb');
  if (thumbs.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const thumbObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), (i % 6) * 50);
          thumbObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });
    thumbs.forEach(t => thumbObserver.observe(t));
  } else {
    // Reduced motion: show immediately
    thumbs.forEach(t => t.classList.add('visible'));
  }

})();
