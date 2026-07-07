/* drone-openings.js — Customized establishing-shot drone sequences for primary pages

   Each primary page (home, archive, stories, why-i-made-things, start-here) gets
   a unique cinematic opening drone sequence that plays on page load.

   Design philosophy:
   - Each drone has its own personality and flight pattern
   - Sequences are 2–4 seconds, setting an arrival mood
   - Animation respects prefers-reduced-motion
   - SVG is built dynamically; container is optional
   - Gracefully absent if anime.js is not loaded or if JS is disabled
*/

(function() {
  'use strict';

  // Exit early if anime.js is not loaded
  if (!window.anime) return;

  // Exit early if reduced-motion is preferred
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Detect page from pathname
  var pagePath = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  // Map of pages to their drone configurations
  var OPENING_DRONES = {
    'index.html': {
      label: 'home-approach',
      size: 120,
      body: '#0B0B0B',
      rotor: '#FF6600',
      description: 'Broad establishing approach toward the archive',
      path: function(w, h) {
        // Drone approaches from far left/top, descending slightly, broad establishing move
        return {
          duration: 3200,
          easing: 'easeInOutQuad',
          frames: [
            { x: -120, y: 40, opacity: 0 },
            { x: -80, y: 60, opacity: 1 },
            { x: w * 0.3, y: h * 0.35, opacity: 0.9 },
            { x: w * 0.7, y: h * 0.4, opacity: 0.85 },
            { x: w + 60, y: h * 0.42, opacity: 0 }
          ]
        };
      }
    },

    'archive.html': {
      label: 'archive-survey',
      size: 100,
      body: '#575757',
      rotor: '#FF9933',
      description: 'Slow flight revealing the scale of the collection',
      path: function(w, h) {
        // Measured, methodical panning revealing scale; horizontal emphasis
        return {
          duration: 3800,
          easing: 'easeInOutSine',
          frames: [
            { x: -100, y: h * 0.32, opacity: 0 },
            { x: w * 0.15, y: h * 0.35, opacity: 1 },
            { x: w * 0.5, y: h * 0.3, opacity: 1, hold: 600 },
            { x: w * 0.85, y: h * 0.38, opacity: 0.9 },
            { x: w + 60, y: h * 0.4, opacity: 0 }
          ]
        };
      }
    },

    'stories.html': {
      label: 'stories-intimate',
      size: 88,
      body: '#0B0B0B',
      rotor: '#B84700',
      description: 'Intimate movement emphasizing memory and place',
      path: function(w, h) {
        // Smaller, slower, more personal vertical movement; hovering quality
        return {
          duration: 3400,
          easing: 'easeInOutCubic',
          frames: [
            { x: w * 0.4, y: -60, opacity: 0 },
            { x: w * 0.45, y: h * 0.25, opacity: 1 },
            { x: w * 0.48, y: h * 0.45, opacity: 0.95, hold: 700 },
            { x: w * 0.42, y: h * 0.6, opacity: 0.8 },
            { x: w * 0.35, y: h + 40, opacity: 0 }
          ]
        };
      }
    },

    'why-i-made-things.html': {
      label: 'reflection-contemplative',
      size: 96,
      body: '#0B0B0B',
      rotor: '#FF6600',
      description: 'Thoughtful cinematic movement suggesting reflection',
      path: function(w, h) {
        // Contemplative, almost stationary hovering; thoughtful pacing
        return {
          duration: 4000,
          easing: 'easeInOutQuad',
          frames: [
            { x: w * 0.5, y: -80, opacity: 0 },
            { x: w * 0.52, y: h * 0.2, opacity: 1 },
            { x: w * 0.48, y: h * 0.35, opacity: 1 },
            { x: w * 0.5, y: h * 0.35, opacity: 1, hold: 1000 },
            { x: w * 0.46, y: h * 0.5, opacity: 0.85 },
            { x: w * 0.38, y: h + 60, opacity: 0 }
          ]
        };
      }
    },

    'start-here.html': {
      label: 'welcome-arrival',
      size: 104,
      body: '#575757',
      rotor: '#FF6600',
      description: 'Welcoming approach introducing first-time visitors',
      path: function(w, h) {
        // Gentle, inviting approach from left; moderate pace welcoming mood
        return {
          duration: 3600,
          easing: 'easeInOutQuad',
          frames: [
            { x: -104, y: h * 0.28, opacity: 0 },
            { x: w * 0.2, y: h * 0.32, opacity: 1 },
            { x: w * 0.6, y: h * 0.38, opacity: 0.95 },
            { x: w + 60, y: h * 0.4, opacity: 0 }
          ]
        };
      }
    }
  };

  // Get the drone config for this page, or exit if not found
  var config = OPENING_DRONES[pagePath];
  if (!config) return;

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    // Create container
    var container = document.createElement('div');
    container.id = 'drone-opening-container';
    container.setAttribute('aria-hidden', 'true');
    container.style.cssText =
      'position: fixed; inset: 0; pointer-events: none; z-index: 25; ' +
      'overflow: hidden; display: block; height: 100vh;';

    // Insert at the very top of body (before everything)
    if (document.body.firstChild) {
      document.body.insertBefore(container, document.body.firstChild);
    } else {
      document.body.appendChild(container);
    }

    fly(config, container);
  }

  function fly(cfg, container) {
    var w = window.innerWidth;
    var h = window.innerHeight;
    var route = cfg.path(w, h);

    // Build SVG drone
    var svg = buildDrone(cfg);
    var mover = document.createElement('div');
    mover.style.cssText = 'position: absolute; left: 0; top: 0; will-change: transform;';
    mover.appendChild(svg);
    container.appendChild(mover);

    var pos = { x: route.frames[0].x, y: route.frames[0].y };

    function render() {
      mover.style.transform = 'translate(' + pos.x + 'px, ' + pos.y + 'px)';
    }
    render();

    var tl = anime.timeline({
      update: render,
      complete: function() {
        container.remove();
      }
    });

    // Fade in
    tl.add({
      targets: svg,
      opacity: route.frames[0].opacity !== undefined ? route.frames[0].opacity : 0,
      duration: 300,
      easing: 'easeOutQuad'
    }, 0);

    // Flight path
    var legMs = route.duration / Math.max(route.frames.length - 1, 1);
    for (var i = 1; i < route.frames.length; i++) {
      var f = route.frames[i];
      var frameDuration = f.hold ? f.hold : legMs;
      var frameEasing = f.hold ? 'linear' : (route.easing || 'linear');

      tl.add({
        targets: pos,
        x: f.x,
        y: f.y,
        duration: frameDuration,
        easing: frameEasing
      });
    }

    // Fade out (final opacity from last frame)
    var finalOpacity = route.frames[route.frames.length - 1].opacity;
    tl.add({
      targets: svg,
      opacity: finalOpacity !== undefined ? finalOpacity : 0,
      duration: 300,
      easing: 'easeInQuad'
    }, '-=300');

    // Rotor spin
    anime({
      targets: svg.querySelectorAll('.drone-rotor'),
      rotate: 360,
      duration: cfg.rotorMs || 800,
      loop: true,
      easing: 'linear'
    });

    // Subtle bobbing (optional for some drones)
    if (cfg.bob !== false) {
      anime({
        targets: svg,
        translateY: [0, -2, 0, 2, 0],
        duration: 1400,
        loop: true,
        easing: 'easeInOutSine'
      });
    }
  }

  function buildDrone(cfg) {
    var NS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 80 80');
    svg.setAttribute('width', cfg.size);
    svg.setAttribute('height', cfg.size);
    svg.style.cssText =
      'position: absolute; left: 0; top: 0; opacity: 1; ' +
      'will-change: transform, opacity; ' +
      'filter: drop-shadow(0 2px 8px rgba(0,0,0,0.12));';

    // Body
    var body = document.createElementNS(NS, 'rect');
    body.setAttribute('x', '30');
    body.setAttribute('y', '35');
    body.setAttribute('width', '20');
    body.setAttribute('height', '10');
    body.setAttribute('rx', '2');
    body.setAttribute('fill', cfg.body);
    svg.appendChild(body);

    // Four arms with rotors
    for (var i = 0; i < 4; i++) {
      var angle = i * 90 * Math.PI / 180;
      var x1 = 40 + Math.cos(angle) * 8;
      var y1 = 40 + Math.sin(angle) * 8;
      var x2 = 40 + Math.cos(angle) * 28;
      var y2 = 40 + Math.sin(angle) * 28;

      var arm = document.createElementNS(NS, 'line');
      arm.setAttribute('x1', x1);
      arm.setAttribute('y1', y1);
      arm.setAttribute('x2', x2);
      arm.setAttribute('y2', y2);
      arm.setAttribute('stroke', '#575757');
      arm.setAttribute('stroke-width', '2');
      svg.appendChild(arm);

      var rotor = document.createElementNS(NS, 'circle');
      rotor.setAttribute('cx', x2);
      rotor.setAttribute('cy', y2);
      rotor.setAttribute('r', '6');
      rotor.setAttribute('fill', 'none');
      rotor.setAttribute('stroke', cfg.rotor);
      rotor.setAttribute('stroke-width', '2');
      rotor.setAttribute('class', 'drone-rotor');
      rotor.style.transformOrigin = x2 + 'px ' + y2 + 'px';
      svg.appendChild(rotor);
    }

    // Camera
    var camera = document.createElementNS(NS, 'circle');
    camera.setAttribute('cx', '40');
    camera.setAttribute('cy', '55');
    camera.setAttribute('r', '4');
    camera.setAttribute('fill', cfg.rotor);
    svg.appendChild(camera);

    return svg;
  }
})();
