/* jfsn-interactions.js — living museum interaction layer
   Covers: progress bar, custom cursor, film grain, kinetic typography,
   view transitions, serendipity mode (S key / shake).
   All features respect prefers-reduced-motion.
   Loads deferred — safe to place anywhere in the document. */

(function () {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch   = window.matchMedia('(hover: none)').matches;

  /* ─── Inject styles (self-contained — works regardless of which CSS loads) */
  if (!document.getElementById('jfsn-ix-styles')) {
    const s = document.createElement('style');
    s.id = 'jfsn-ix-styles';
    s.textContent = `
#jfsn-progress{position:fixed;top:0;left:0;height:2px;width:0%;background:#FF6600;z-index:9999;pointer-events:none;transition:width .1s ease,opacity .3s ease;}
#jfsn-cursor-dot{position:fixed;top:0;left:0;width:6px;height:6px;background:#FF6600;border-radius:50%;pointer-events:none;z-index:9998;opacity:0;transition:opacity .2s ease;will-change:transform;}
#jfsn-cursor-ring{position:fixed;top:0;left:0;width:32px;height:32px;border:1.5px solid rgba(255,102,0,.55);border-radius:50%;pointer-events:none;z-index:9997;opacity:0;transition:opacity .2s ease,width .2s ease,height .2s ease,border-color .2s ease,margin .2s ease;will-change:transform;}
#jfsn-cursor-ring.jfsn-cursor-expanded{width:48px;height:48px;border-color:rgba(255,102,0,.85);margin-left:-8px;margin-top:-8px;}
#jfsn-cursor-ring.jfsn-cursor-clicked{width:20px;height:20px;border-color:#FF6600;opacity:.8!important;margin-left:6px;margin-top:6px;}
@media(hover:hover){.thumb__link,.card-img,[data-cursor-expand]{cursor:none;}}
#jfsn-grain{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9996;opacity:.028;mix-blend-mode:multiply;}
@keyframes letter-settle{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
.ls-ready .ls-char{opacity:0;animation:letter-settle .32s cubic-bezier(.22,1,.36,1) forwards;}
@keyframes artwork-develop{from{filter:brightness(.6) saturate(.35)}to{filter:brightness(1) saturate(1)}}
.artwork-developing{animation:artwork-develop .5s ease-out forwards;}
#jfsn-ser{position:fixed;inset:0;z-index:9990;display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .35s ease;}
#jfsn-ser.jfsn-ser-open{opacity:1;pointer-events:auto;}
#jfsn-ser-bg{position:absolute;inset:0;background:#fcf9f3;}
#jfsn-ser-img{position:relative;max-width:min(72vw,640px);max-height:80vh;object-fit:contain;display:block;cursor:pointer;opacity:0;transition:opacity .5s ease;z-index:1;box-shadow:0 0 0 1px rgba(11,11,11,.08);}
#jfsn-ser-img.jfsn-ser-img-in{opacity:1;}
#jfsn-ser-meta{position:absolute;bottom:48px;left:50%;transform:translateX(-50%);font-family:'Inter',sans-serif;font-size:11px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:#575757;white-space:nowrap;opacity:0;transition:opacity .4s ease;z-index:2;pointer-events:none;}
#jfsn-ser-meta.jfsn-ser-meta-in{opacity:1;}
#jfsn-ser-close{position:absolute;top:24px;right:24px;background:none;border:1px solid #c4c7c7;font-family:'Inter',sans-serif;font-size:10px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:#575757;padding:6px 12px;cursor:pointer;z-index:3;transition:color .15s ease,border-color .15s ease;}
#jfsn-ser-close:hover{color:#FF6600;border-color:#FF6600;}
#jfsn-ser-hint{position:absolute;bottom:24px;left:50%;transform:translateX(-50%);font-family:'Inter',sans-serif;font-size:10px;letter-spacing:.1em;color:#c4c7c7;white-space:nowrap;z-index:2;pointer-events:none;}
#jfsn-ser-hint kbd{font-family:inherit;border:1px solid #c4c7c7;padding:1px 5px;font-size:9px;}
@media(prefers-reduced-motion:reduce){#jfsn-progress,#jfsn-cursor-dot,#jfsn-cursor-ring,#jfsn-grain{display:none!important;}.ls-ready .ls-char{opacity:1;animation:none;}.artwork-developing{animation:none;filter:none;}#jfsn-ser,#jfsn-ser-img,#jfsn-ser-meta{transition:none;}}
    `;
    document.head.appendChild(s);
  }

  /* ─── 1. Page load progress bar ──────────────────────────────────────── */
  if (!reduced) {
    const bar = document.createElement('div');
    bar.id = 'jfsn-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);

    let w = 0;
    const step = function () {
      w = Math.min(w + (100 - w) * 0.09, 92);
      bar.style.width = w + '%';
    };
    bar.style.opacity = '1';
    const iv = setInterval(step, 70);
    window.addEventListener('load', function () {
      clearInterval(iv);
      bar.style.width = '100%';
      setTimeout(function () { bar.style.opacity = '0'; }, 300);
      setTimeout(function () { if (bar.parentNode) bar.parentNode.removeChild(bar); }, 700);
    }, { once: true });
  }

  /* ─── 2. Custom cursor (desktop / hover-capable devices only) ─────────── */
  if (!reduced && !touch) {
    const dot  = document.createElement('div');
    const ring = document.createElement('div');
    dot.id  = 'jfsn-cursor-dot';
    ring.id = 'jfsn-cursor-ring';
    dot.setAttribute('aria-hidden', 'true');
    ring.setAttribute('aria-hidden', 'true');
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    var mx = -200, my = -200, rx = -200, ry = -200;
    var expanded = false, hidden = true;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (hidden) {
        hidden = false;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }
    });
    document.addEventListener('mouseleave', function () {
      hidden = true;
      dot.style.opacity  = '0';
      ring.style.opacity = '0';
    });

    function lerp(a, b, t) { return a + (b - a) * t; }

    (function animCursor() {
      rx = lerp(rx, mx, 0.13);
      ry = lerp(ry, my, 0.13);
      dot.style.transform  = 'translate(' + (mx - 3) + 'px,' + (my - 3) + 'px)';
      ring.style.transform = 'translate(' + (rx - 16) + 'px,' + (ry - 16) + 'px)';
      requestAnimationFrame(animCursor);
    })();

    document.addEventListener('mouseover', function (e) {
      var over = e.target.closest('.thumb__link, .card-img, [data-cursor-expand]');
      if (over && !expanded) {
        expanded = true;
        ring.classList.add('jfsn-cursor-expanded');
      } else if (!over && expanded) {
        expanded = false;
        ring.classList.remove('jfsn-cursor-expanded');
      }
    });

    document.addEventListener('mousedown', function () {
      ring.classList.add('jfsn-cursor-clicked');
      setTimeout(function () { ring.classList.remove('jfsn-cursor-clicked'); }, 180);
    });
  }

  /* ─── 3. Film grain ambient layer ────────────────────────────────────── */
  if (!reduced) {
    var grain = document.createElement('canvas');
    grain.id = 'jfsn-grain';
    grain.setAttribute('aria-hidden', 'true');
    document.body.appendChild(grain);

    var gctx = grain.getContext('2d');
    var gw, gh, gdata;

    function resizeGrain() {
      gw = grain.width  = window.innerWidth;
      gh = grain.height = window.innerHeight;
      gdata = gctx.createImageData(gw, gh);
    }
    resizeGrain();
    window.addEventListener('resize', resizeGrain, { passive: true });

    var gframe = 0;
    (function tickGrain() {
      gframe++;
      if (gframe % 3 === 0) {  // ~20fps
        var d = gdata.data;
        for (var i = 0; i < d.length; i += 4) {
          var v = (Math.random() * 255) | 0;
          d[i] = d[i + 1] = d[i + 2] = v;
          d[i + 3] = 16; // very faint — just physical texture
        }
        gctx.putImageData(gdata, 0, 0);
      }
      requestAnimationFrame(tickGrain);
    })();
  }

  /* ─── 4. Kinetic letter-settle for decade headings ───────────────────── */
  var settleTargets = document.querySelectorAll('.decade-heading, [data-letter-settle]');
  if (settleTargets.length) {
    settleTargets.forEach(function (el) {
      var text = el.textContent;
      if (!text.trim()) return;
      var chars = text.split('');
      el.setAttribute('aria-label', text);
      if (reduced) return; // screen readers get aria-label; sighted gets animation
      el.innerHTML = chars.map(function (c, i) {
        var escaped = c === '&' ? '&amp;' : c === '<' ? '&lt;' : c === '>' ? '&gt;' : c;
        var sp = c === ' ' ? '&nbsp;' : escaped;
        return '<span class="ls-char" style="animation-delay:' + (i * 38) + 'ms" aria-hidden="true">' + sp + '</span>';
      }).join('');
      el.classList.add('ls-ready');
    });
  }

  /* ─── 5. View Transitions API — thumbnail → artwork morphing ─────────── */
  if (!reduced && document.startViewTransition) {
    // On grid pages: intercept .thumb__link clicks
    document.addEventListener('click', function (e) {
      var link = e.target.closest('.thumb__link');
      if (!link || !link.href) return;
      if (!link.href.includes('artwork.html')) return;

      var img = link.querySelector('img');
      var id  = new URL(link.href).searchParams.get('id');
      if (!img || !id) return;

      e.preventDefault();
      img.style.viewTransitionName = 'vt-artwork-' + id;

      document.startViewTransition(function () {
        return new Promise(function (resolve) {
          window.location.href = link.href;
          // resolve is never called — navigation takes over
          // browser handles the transition frame
          setTimeout(resolve, 100);
        });
      });
    });

    // On artwork.html: set view-transition-name on the main image
    // (done in artwork.html inline script after the id is known)
  }

  /* ─── 6. Serendipity mode (S key / shake) ────────────────────────────── */
  (function () {
    var active = false;
    var works  = null;
    var current = 0;
    var timer   = null;
    var overlay, serImg, serMeta, serHint;
    var serendipityCatalogPath = (function () {
      // Works from any directory depth
      var depth = (location.pathname.match(/\//g) || []).length - 1;
      var prefix = depth > 0 ? '../'.repeat(depth) : '';
      return prefix + 'catalog-lite.json';
    })();

    function buildOverlay() {
      overlay = document.createElement('div');
      overlay.id = 'jfsn-ser';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-label', 'Serendipity mode — press Escape to close');
      overlay.innerHTML =
        '<div id="jfsn-ser-bg" aria-hidden="true"></div>' +
        '<img id="jfsn-ser-img" alt="" />' +
        '<div id="jfsn-ser-meta" aria-live="polite"></div>' +
        '<button id="jfsn-ser-close" aria-label="Close serendipity mode">ESC</button>' +
        '<div id="jfsn-ser-hint">Click image to open &nbsp;·&nbsp; <kbd>S</kbd> or <kbd>Esc</kbd> to close</div>';
      document.body.appendChild(overlay);
      serImg  = document.getElementById('jfsn-ser-img');
      serMeta = document.getElementById('jfsn-ser-meta');
      document.getElementById('jfsn-ser-close').addEventListener('click', closeMode);
      document.getElementById('jfsn-ser-bg').addEventListener('click', closeMode);
      serImg.addEventListener('click', function () {
        if (!works) return;
        var id = works[current].file.replace('.avif', '');
        closeMode();
        window.location.href = 'artwork.html?id=' + id;
      });
    }

    function showWork(w) {
      serImg.classList.remove('jfsn-ser-img-in');
      serMeta.classList.remove('jfsn-ser-meta-in');
      var src = 'artworks/thumbs/' + w.file;
      serImg.src = src;
      serImg.alt = w.title || '';
      serImg.onload = function () {
        serImg.classList.add('jfsn-ser-img-in');
        setTimeout(function () { serMeta.classList.add('jfsn-ser-meta-in'); }, 1400);
      };
      var label = (w.title || 'Untitled') + (w.year ? ' &nbsp;·&nbsp; ' + w.year : '');
      serMeta.innerHTML = label;
    }

    function advance() {
      if (!works || !works.length) return;
      current = (current + 1) % works.length;
      showWork(works[current]);
    }

    function openMode() {
      if (active) return;
      var ae = document.activeElement;
      if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA')) return;
      active = true;
      if (!overlay) buildOverlay();
      overlay.classList.add('jfsn-ser-open');
      document.body.style.overflow = 'hidden';

      function startSlide() {
        current = Math.floor(Math.random() * works.length);
        showWork(works[current]);
        timer = setInterval(advance, 4800);
      }

      if (works) {
        startSlide();
      } else {
        fetch(serendipityCatalogPath)
          .then(function (r) { return r.json(); })
          .then(function (data) {
            works = data.slice();
            for (var i = works.length - 1; i > 0; i--) {
              var j = (Math.random() * (i + 1)) | 0;
              var tmp = works[i]; works[i] = works[j]; works[j] = tmp;
            }
            startSlide();
          })
          .catch(closeMode);
      }
    }

    function closeMode() {
      if (!active) return;
      active = false;
      clearInterval(timer);
      if (overlay) overlay.classList.remove('jfsn-ser-open');
      document.body.style.overflow = '';
    }

    document.addEventListener('keydown', function (e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'Escape' && active) { closeMode(); return; }
      if (e.key === 's' || e.key === 'S') {
        if (active) closeMode(); else openMode();
      }
    });

    // Mobile shake gesture
    if (typeof DeviceMotionEvent !== 'undefined') {
      var lastShake = 0;
      window.addEventListener('devicemotion', function (e) {
        var acc = e.accelerationIncludingGravity;
        if (!acc) return;
        var mag = Math.abs(acc.x || 0) + Math.abs(acc.y || 0) + Math.abs(acc.z || 0);
        var now = Date.now();
        if (mag > 45 && now - lastShake > 2000) {
          lastShake = now;
          if (!active) openMode();
        }
      }, { passive: true });
    }
  })();

})();
