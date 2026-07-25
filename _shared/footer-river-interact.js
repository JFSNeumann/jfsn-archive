/* footer-river-interact.js — Interactive reveal on footer Chromatic River
   Maps pointer/touch/keyboard movement across the river to artwork previews.
   Lightweight, no dependencies, single shared instance. */

(function() {
  'use strict';

  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let works = [];
  let canvas = null;
  let preview = null;
  let currentIndex = -1;
  let isDragging = false;
  let hasPointerCapability = null;

  // ─────────────────────── Setup ───────────────────────

  async function init() {
    // Find or create preview element
    canvas = document.getElementById('footer-river');
    if (!canvas) return; // No river on this page

    preview = createPreviewElement();

    // Load works data
    try {
      const resp = await fetch('/config/current.json', { cache: 'no-cache' });
      works = await resp.json();
      if (!works || works.length === 0) return;
    } catch (e) {
      return; // Graceful: if data fails, river stays static
    }

    // Determine pointer capability once
    hasPointerCapability = matchMedia('(hover: hover) and (pointer: fine)').matches;

    // Attach handlers
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointerleave', onPointerLeave);
    canvas.addEventListener('pointercancel', onPointerUp);

    // Keyboard
    canvas.setAttribute('tabindex', '0');
    canvas.addEventListener('keydown', onKeyDown);
    canvas.addEventListener('focus', onFocus);
    canvas.addEventListener('blur', onBlur);
  }

  // ─────────────────────── Preview Element ───────────────────────

  function createPreviewElement() {
    let el = document.getElementById('footer-preview');
    if (el) return el;

    el = document.createElement('div');
    el.id = 'footer-preview';
    el.className = 'footer-preview';
    el.innerHTML = `
      <a href="#" class="footer-preview-link" style="text-decoration:none;color:inherit">
        <img class="footer-preview-img" alt="" decoding="async" style="display:block;width:100%;height:auto">
        <div class="footer-preview-cap">
          <div class="footer-preview-title"></div>
          <div class="footer-preview-meta"></div>
          <div class="footer-preview-id"></div>
        </div>
      </a>
    `;
    document.body.appendChild(el);
    return el;
  }

  // ─────────────────────── Index Mapping ───────────────────────

  function indexFromPointerX(pointerX) {
    if (!canvas) return -1;
    const rect = canvas.getBoundingClientRect();
    const localX = pointerX - rect.left;
    const progress = Math.max(0, Math.min(1, localX / rect.width));
    return Math.floor(progress * works.length);
  }

  // ─────────────────────── Preview Update ───────────────────────

  function showPreview(index) {
    if (index < 0 || index >= works.length) {
      hidePreview();
      return;
    }
    if (index === currentIndex) return; // No change

    currentIndex = index;
    const w = works[index];

    // Update content
    const link = preview.querySelector('.footer-preview-link');
    link.href = 'artwork.html?id=' + w.i;

    const img = preview.querySelector('.footer-preview-img');
    img.src = '/artworks/thumbs/' + w.i + '.avif';
    img.srcset = '/artworks/thumbs/' + w.i + '.avif 400w, /artworks/medium/' + w.i + '.avif 900w';
    img.sizes = '(max-width: 640px) 160px, 220px';
    img.alt = w.t;

    preview.querySelector('.footer-preview-title').textContent = w.t;
    preview.querySelector('.footer-preview-meta').textContent = w.yd + ' · ' + w.m;
    preview.querySelector('.footer-preview-id').textContent = w.i;

    // Show and position
    if (!preview.classList.contains('show')) {
      preview.classList.add('show');
    }
    positionPreview();

    // Announce to screen readers (throttled, not on every pixel)
    announceWork(w);
  }

  function hidePreview() {
    if (currentIndex !== -1) {
      currentIndex = -1;
      preview.classList.remove('show');
    }
  }

  function positionPreview() {
    if (currentIndex < 0 || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    const progress = currentIndex / works.length;
    const centerX = rect.left + progress * rect.width;

    const previewW = preview.offsetWidth || 220;
    const x = Math.max(10, Math.min(window.innerWidth - previewW - 10, centerX - previewW / 2));
    const y = Math.max(10, rect.top - preview.offsetHeight - 14);

    preview.style.left = x + 'px';
    preview.style.top = y + 'px';
  }

  // ─────────────────────── Input Handlers ───────────────────────

  function onPointerMove(e) {
    if (isDragging || !hasPointerCapability || e.pointerType === 'touch') return;
    const idx = indexFromPointerX(e.clientX);
    showPreview(idx);
  }

  function onPointerDown(e) {
    if (e.pointerType === 'touch') {
      isDragging = true;
      try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
      const idx = indexFromPointerX(e.clientX);
      showPreview(idx);
    }
  }

  function onPointerUp(e) {
    if (!isDragging) return;
    isDragging = false;
    try { canvas.releasePointerCapture(e.pointerId); } catch (_) {}
  }

  function onPointerLeave() {
    if (!isDragging) hidePreview();
  }

  function onKeyDown(e) {
    if (currentIndex < 0) return;
    if (e.key === 'ArrowLeft' && currentIndex > 0) {
      showPreview(currentIndex - Math.max(1, Math.floor(works.length / 20)));
      e.preventDefault();
    } else if (e.key === 'ArrowRight' && currentIndex < works.length - 1) {
      showPreview(currentIndex + Math.max(1, Math.floor(works.length / 20)));
      e.preventDefault();
    } else if (e.key === 'Enter' || e.key === ' ') {
      if (currentIndex >= 0) {
        window.location.href = 'artwork.html?id=' + works[currentIndex].i;
      }
      e.preventDefault();
    }
  }

  function onFocus() {
    if (currentIndex < 0 && works.length > 0) {
      showPreview(0);
    }
  }

  function onBlur() {
    if (!isDragging) hidePreview();
  }

  // ─────────────────────── Accessibility ───────────────────────

  let lastAnnounce = 0;
  function announceWork(w) {
    const now = Date.now();
    if (now - lastAnnounce < 400) return; // Throttle announcements
    lastAnnounce = now;

    let live = document.getElementById('footer-live');
    if (!live) {
      live = document.createElement('div');
      live.id = 'footer-live';
      live.className = 'sr-only';
      live.setAttribute('aria-live', 'polite');
      live.setAttribute('aria-atomic', 'true');
      document.body.appendChild(live);
    }
    live.textContent = w.t + ', ' + w.yd;
  }

  // ─────────────────────── Reposition on Resize ───────────────────────

  window.addEventListener('resize', () => {
    if (currentIndex >= 0) positionPreview();
  });

  // ─────────────────────── Go ───────────────────────

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
