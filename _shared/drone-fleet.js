/* drone-fleet.js — One custodian drone per page, each with its own personality.

   Companion to drone-survey.js (which runs the multi-drone crews on
   index.html and wall.html). This file covers the rest of the site:
   a single drone per page, appearing once per visit, ~1.5–2.5s, in the
   margins of the viewport — never over reading columns, never interactive.

   Personality is expressed only through path, speed, altitude, pauses,
   size, palette, and rotor rhythm. Palette stays within the design system
   (deep-ink / archive-gray / archival-outline bodies; orange-family rotors).

   Respects prefers-reduced-motion. Requires anime.js (already in the
   sitewide script bundle); silently absent without it or without JS. */

(function () {
  'use strict';

  var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  /* Each entry: how the drone is summoned (trigger) and who it is (drone).
     Paths are built at fire time from the live viewport so they stay in
     the top/bottom/side bands, clear of content. */
  var FLEET = {

    /* Start Here — the courier. A brief glimpse passing between galleries:
       one quick, confident, level transit high across the page. No pauses —
       it is on its way somewhere else. */
    'start-here.html': {
      trigger: { scroll: 0.25, time: 10000 },
      drone: {
        size: 68, body: '#575757', rotor: '#FF6600', peak: 0.85, rotorMs: 600,
        path: function (w, h) {
          return {
            duration: 3000, easing: 'linear',
            frames: [
              { x: -60, y: 96 },
              { x: w + 60, y: 108 }
            ]
          };
        }
      }
    },

    /* Stories — the listener. Almost absent: once per browsing session,
       only when the visitor reaches the end. Small, dim, slow; it rises
       from the lower corner, holds a moment, and withdraws. */
    'stories.html': {
      trigger: { footer: true },
      oncePerSession: 'jfsn-drone-stories',
      drone: {
        size: 48, body: '#0B0B0B', rotor: '#B84700', peak: 0.5, rotorMs: 1100,
        path: function (w, h) {
          return {
            duration: 2400, easing: 'easeInOutSine',
            frames: [
              { x: w - 80, y: h + 40 },
              { x: w - 96, y: h - 130 },
              { x: w - 96, y: h - 130, hold: 2000 },
              { x: w - 60, y: h + 40 }
            ]
          };
        }
      }
    },

    /* Why I Made Things — the reader's companion. Respectful and
       unobtrusive: it descends a short way along the left margin, pauses
       as if out of courtesy, and leaves the way it came. */
    'why-i-made-things.html': {
      trigger: { scroll: 0.6 },
      drone: {
        size: 56, body: '#0B0B0B', rotor: '#B84700', peak: 0.6, rotorMs: 950,
        path: function (w, h) {
          return {
            duration: 2200, easing: 'easeInOutQuad',
            frames: [
              { x: 20, y: -50 },
              { x: 26, y: h * 0.3 },
              { x: 26, y: h * 0.3, hold: 1900 },
              { x: 20, y: -50 }
            ]
          };
        }
      }
    },

    /* The Imagined Museum — the docent. Slightly more exploratory: it
       crosses the room in two considered legs, pausing twice at different
       heights as though examining an imagined exhibition wall. */
    'imagined-museum.html': {
      trigger: { scroll: 0.3, time: 14000 },
      drone: {
        size: 76, body: '#8e7164', rotor: '#FF9933', peak: 0.9, rotorMs: 750,
        path: function (w, h) {
          return {
            duration: 2600, easing: 'easeInOutQuad',
            frames: [
              { x: w + 60, y: 120 },
              { x: w * 0.68, y: 88 },
              { x: w * 0.68, y: 88, hold: 1200 },
              { x: w * 0.3, y: 132 },
              { x: w * 0.3, y: 132, hold: 1200 },
              { x: -60, y: 100 }
            ]
          };
        }
      }
    },

    /* About — the steward. Maintenance rounds: a level, unhurried pass
       with one brief, routine stop at the midpoint. Nothing found;
       nothing needed; carry on. */
    'about.html': {
      trigger: { scroll: 0.4, time: 12000 },
      drone: {
        size: 64, body: '#575757', rotor: '#B84700', peak: 0.8, rotorMs: 850,
        path: function (w, h) {
          var y = h - 170;
          return {
            duration: 2400, easing: 'linear',
            frames: [
              { x: w + 60, y: y },
              { x: w * 0.5, y: y },
              { x: w * 0.5, y: y, hold: 2000 },
              { x: -60, y: y }
            ]
          };
        }
      }
    },

    /* Archive — the closer. One subtle appearance near the footer after
       real browsing (20s dwell minimum): a low, quick end-of-aisle pass.
       It never guides and never points at a work. */
    'archive.html': {
      trigger: { footer: true, minDwell: 20000 },
      drone: {
        size: 60, body: '#0B0B0B', rotor: '#FF6600', peak: 0.7, rotorMs: 700,
        path: function (w, h) {
          var y = h - 140;
          return {
            duration: 3200, easing: 'linear',
            frames: [
              { x: -60, y: y },
              { x: w + 60, y: y - 12 }
            ]
          };
        }
      }
    },

    /* Artwork pages — the registrar. Appears only when the visitor reaches
       the "You Might Also Like" wall, crosses it in one considered pass
       with a single brief stop — as if checking the neighboring works are
       properly hung — and leaves. Never over the artwork itself. */
    'artwork.html': {
      trigger: { element: '#related-works-section' },
      drone: {
        size: 60, body: '#575757', rotor: '#FF9933', peak: 0.7, rotorMs: 800,
        path: function (w, h) {
          var y = h * 0.42;
          return {
            duration: 2800, easing: 'easeInOutQuad',
            frames: [
              { x: w + 60, y: y },
              { x: w * 0.55, y: y - 16 },
              { x: w * 0.55, y: y - 16, hold: 1600 },
              { x: -60, y: y + 8 }
            ]
          };
        }
      }
    },

    /* Chromatic (the site's timeline) — the chronicler. Moving steadily
       forward, left to right like the years themselves: constant velocity,
       perfectly level, no pauses, no drift. */
    'chromatic.html': {
      trigger: { scroll: 0.2, time: 8000 },
      drone: {
        size: 64, body: '#0B0B0B', rotor: '#FF6600', peak: 0.8, rotorMs: 800,
        bob: false,
        path: function (w, h) {
          return {
            duration: 3500, easing: 'linear',
            frames: [
              { x: -60, y: 84 },
              { x: w + 60, y: 84 }
            ]
          };
        }
      }
    }
  };

  var entry = FLEET[page];
  if (!entry) return;
  if (entry.oncePerSession) {
    try { if (sessionStorage.getItem(entry.oncePerSession)) return; } catch (e) {}
  }

  var fired = false;
  var loadedAt = performance.now();
  var cleanups = [];

  function arm() {
    var t = entry.trigger;

    if (t.scroll) {
      var onScroll = function () {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        if (max > 0 && window.scrollY / max >= t.scroll) fire();
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      cleanups.push(function () { window.removeEventListener('scroll', onScroll); });
    }

    if (t.time) {
      var timer = setTimeout(fire, t.time);
      cleanups.push(function () { clearTimeout(timer); });
    }

    if (t.element) {
      var target = document.querySelector(t.element);
      if (target && 'IntersectionObserver' in window) {
        var elObs = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) { if (en.isIntersecting) fire(); });
        }, { threshold: 0.25 });
        elObs.observe(target);
        cleanups.push(function () { elObs.disconnect(); });
      }
    }

    if (t.footer) {
      var footer = document.querySelector('footer');
      if (footer && 'IntersectionObserver' in window) {
        var obs = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (!en.isIntersecting) return;
            if (t.minDwell && performance.now() - loadedAt < t.minDwell) return;
            fire();
          });
        }, { threshold: 0.1 });
        obs.observe(footer);
        cleanups.push(function () { obs.disconnect(); });
      }
    }
  }

  function fire() {
    if (fired || !window.anime || document.visibilityState !== 'visible') return;
    /* Checked at fire time (not load) so a mid-session toggle is honored. */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    fired = true;
    cleanups.forEach(function (fn) { fn(); });
    if (entry.oncePerSession) {
      try { sessionStorage.setItem(entry.oncePerSession, '1'); } catch (e) {}
    }
    fly(entry.drone);
  }

  function fly(d) {
    var w = window.innerWidth;
    var h = window.innerHeight;
    var scale = w < 640 ? 0.75 : 1;
    var size = Math.round(d.size * scale);
    var route = d.path(w, h);

    var wrap = document.createElement('div');
    wrap.setAttribute('aria-hidden', 'true');
    wrap.style.cssText =
      'position:fixed;inset:0;pointer-events:none;z-index:30;overflow:hidden;';

    var svg = buildDrone(d, size);
    /* The mover carries the flight path; the svg inside it carries the
       bob and fade, so the two transforms never fight. */
    var mover = document.createElement('div');
    mover.style.cssText = 'position:absolute;left:0;top:0;will-change:transform;';
    mover.appendChild(svg);
    wrap.appendChild(mover);
    document.body.appendChild(wrap);

    var pos = { x: route.frames[0].x, y: route.frames[0].y };
    function render() {
      mover.style.transform = 'translate(' + pos.x + 'px,' + pos.y + 'px)';
    }
    render();

    var tl = anime.timeline({
      update: render,
      complete: function () { wrap.remove(); }
    });

    tl.add({ targets: svg, opacity: [0, d.peak], duration: 350, easing: 'easeOutQuad' }, 0);

    var legMs = route.duration / Math.max(route.frames.length - 1, 1);
    for (var i = 1; i < route.frames.length; i++) {
      var f = route.frames[i];
      tl.add({
        targets: pos,
        x: f.x,
        y: f.y,
        duration: f.hold ? f.hold : legMs,
        easing: f.hold ? 'linear' : (route.easing || 'linear')
      });
    }

    tl.add({
      targets: svg,
      opacity: 0,
      duration: 350,
      easing: 'easeInQuad'
    }, '-=' + Math.min(350, legMs));

    if (d.bob !== false) {
      anime({
        targets: svg,
        translateY: [0, -3, 0, 3, 0],
        duration: 1400,
        loop: true,
        easing: 'easeInOutSine'
      });
    }

    anime({
      targets: svg.querySelectorAll('.drone-rotor'),
      rotate: 360,
      duration: d.rotorMs,
      loop: true,
      easing: 'linear'
    });
  }

  function buildDrone(d, size) {
    var NS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 80 80');
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.style.cssText =
      'position:absolute;left:0;top:0;opacity:0;' +
      'will-change:transform,opacity;' +
      'filter:drop-shadow(0 2px 8px rgba(0,0,0,0.12));';

    var body = document.createElementNS(NS, 'rect');
    body.setAttribute('x', '30'); body.setAttribute('y', '35');
    body.setAttribute('width', '20'); body.setAttribute('height', '10');
    body.setAttribute('rx', '2'); body.setAttribute('fill', d.body);
    svg.appendChild(body);

    for (var i = 0; i < 4; i++) {
      var angle = i * 90 * Math.PI / 180;
      var x1 = 40 + Math.cos(angle) * 8, y1 = 40 + Math.sin(angle) * 8;
      var x2 = 40 + Math.cos(angle) * 28, y2 = 40 + Math.sin(angle) * 28;
      var arm = document.createElementNS(NS, 'line');
      arm.setAttribute('x1', x1); arm.setAttribute('y1', y1);
      arm.setAttribute('x2', x2); arm.setAttribute('y2', y2);
      arm.setAttribute('stroke', '#575757'); arm.setAttribute('stroke-width', '2');
      svg.appendChild(arm);
      var rotor = document.createElementNS(NS, 'circle');
      rotor.setAttribute('cx', x2); rotor.setAttribute('cy', y2);
      rotor.setAttribute('r', '6'); rotor.setAttribute('fill', 'none');
      rotor.setAttribute('stroke', d.rotor); rotor.setAttribute('stroke-width', '2');
      rotor.setAttribute('class', 'drone-rotor');
      rotor.style.transformOrigin = x2 + 'px ' + y2 + 'px';
      svg.appendChild(rotor);
    }

    var camera = document.createElementNS(NS, 'circle');
    camera.setAttribute('cx', '40'); camera.setAttribute('cy', '55');
    camera.setAttribute('r', '4'); camera.setAttribute('fill', d.rotor);
    svg.appendChild(camera);

    return svg;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', arm);
  } else {
    arm();
  }
})();
