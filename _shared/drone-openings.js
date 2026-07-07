/* drone-openings.js — Cinematic quadcopter opening sequences for primary pages

   Each primary page features a realistic, museum-quality quadcopter establishing shot
   with distinct flight behaviors and cinematic motion. The drone is rendered as a
   detailed SVG with realistic proportions, and each sequence emphasizes a different
   emotional tone.

   Design philosophy:
   - Realistic quadcopter proportions and detail (2x larger than prototype)
   - Distinct flight behavior for each page with unique personality
   - Cinematic motion with realistic easing and physics
   - Subtle motion details: vibration, perspective, banking, momentum
   - Calm, deliberate tone suitable for museum experience
   - Performance optimized for desktop and mobile
   - Accessible and respects prefers-reduced-motion
*/

(function() {
  'use strict';

  // Exit early if reduced-motion is preferred
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Wait for anime.js to be loaded
  function waitForAnime(callback) {
    if (window.anime) {
      callback();
    } else {
      setTimeout(function() { waitForAnime(callback); }, 50);
    }
  }

  // Detect page from pathname
  var pagePath = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  // Quadcopter configurations for each primary page
  var OPENING_DRONES = {
    'index.html': {
      label: 'home-confident-arrival',
      size: 240,  // 2x larger than prototype
      emotion: 'confident arrival toward the archive',
      path: function(w, h) {
        // Broad cinematic establishing flyover: approaches from far left at high altitude,
        // descends gradually while spanning the full width, banking slightly at peak.
        return {
          duration: 4200,
          easing: 'easeInOutCubic',
          frames: [
            { x: -240, y: 20, opacity: 0, rot: 0 },
            { x: -120, y: 40, opacity: 1, rot: -2 },
            { x: w * 0.25, y: h * 0.3, opacity: 0.95, rot: -1 },
            { x: w * 0.5, y: h * 0.38, opacity: 0.92, rot: 0, hold: 500 },
            { x: w * 0.75, y: h * 0.4, opacity: 0.95, rot: 1 },
            { x: w + 120, y: h * 0.42, opacity: 0 }
          ]
        };
      }
    },

    'archive.html': {
      label: 'archive-methodical-survey',
      size: 220,
      emotion: 'methodical survey revealing scale',
      path: function(w, h) {
        // Slow, measured horizontal sweep with deliberate pauses: moves left to right
        // with multiple hover points, suggesting careful examination of the collection.
        return {
          duration: 5200,
          easing: 'easeInOutQuad',
          frames: [
            { x: -220, y: h * 0.3, opacity: 0, rot: 0 },
            { x: w * 0.1, y: h * 0.35, opacity: 1, rot: 0 },
            { x: w * 0.3, y: h * 0.32, opacity: 0.95, rot: 0.5, hold: 800 },
            { x: w * 0.5, y: h * 0.38, opacity: 0.93, rot: 0 },
            { x: w * 0.5, y: h * 0.38, opacity: 0.93, rot: 0, hold: 1000 },
            { x: w * 0.7, y: h * 0.35, opacity: 0.95, rot: -0.5 },
            { x: w * 0.9, y: h * 0.4, opacity: 0.9, rot: 0 },
            { x: w + 120, y: h * 0.4, opacity: 0 }
          ]
        };
      }
    },

    'stories.html': {
      label: 'stories-curious-exploration',
      size: 200,
      emotion: 'curious exploration emphasizing memory and place',
      path: function(w, h) {
        // Intimate vertical descent with gentle horizontal drift: suggests looking down
        // into a space, with subtle exploration of the area, hovering with tiny corrections.
        return {
          duration: 4600,
          easing: 'easeInOutQuad',
          frames: [
            { x: w * 0.4, y: -60, opacity: 0, rot: 0 },
            { x: w * 0.42, y: h * 0.2, opacity: 1, rot: 0 },
            { x: w * 0.45, y: h * 0.35, opacity: 0.95, rot: 0.3 },
            { x: w * 0.48, y: h * 0.45, opacity: 0.93, rot: 0 },
            { x: w * 0.48, y: h * 0.45, opacity: 0.93, rot: 0, hold: 900 },
            { x: w * 0.46, y: h * 0.55, opacity: 0.9, rot: -0.2 },
            { x: w * 0.4, y: h + 60, opacity: 0 }
          ]
        };
      }
    },

    'why-i-made-things.html': {
      label: 'reflection-quiet-contemplation',
      size: 210,
      emotion: 'quiet contemplation and reflection',
      path: function(w, h) {
        // Gentle vertical descent with long hovering pause: suggests stillness and thought.
        // Approaches slowly, hovers at center with minimal drift, departs with same care.
        return {
          duration: 5000,
          easing: 'easeInOutCubic',
          frames: [
            { x: w * 0.5, y: -80, opacity: 0, rot: 0 },
            { x: w * 0.52, y: h * 0.15, opacity: 1, rot: 0 },
            { x: w * 0.51, y: h * 0.3, opacity: 0.95, rot: 0 },
            { x: w * 0.5, y: h * 0.38, opacity: 0.93, rot: 0 },
            { x: w * 0.5, y: h * 0.38, opacity: 0.93, rot: 0, hold: 1400 },
            { x: w * 0.49, y: h * 0.48, opacity: 0.9, rot: 0 },
            { x: w * 0.48, y: h + 80, opacity: 0 }
          ]
        };
      }
    },

    'start-here.html': {
      label: 'welcome-gentle-introduction',
      size: 230,
      emotion: 'welcoming guide introducing first-time visitors',
      path: function(w, h) {
        // Gentle left-to-right approach with moderate pace: welcoming and inviting.
        // Approaches from left with slight upward arc, suggesting arrival and introduction.
        return {
          duration: 4400,
          easing: 'easeInOutQuad',
          frames: [
            { x: -230, y: h * 0.25, opacity: 0, rot: 0 },
            { x: w * 0.15, y: h * 0.3, opacity: 1, rot: -1 },
            { x: w * 0.4, y: h * 0.35, opacity: 0.95, rot: -0.5 },
            { x: w * 0.65, y: h * 0.38, opacity: 0.93, rot: 0 },
            { x: w * 0.9, y: h * 0.4, opacity: 0.9, rot: 0.5 },
            { x: w + 120, y: h * 0.42, opacity: 0 }
          ]
        };
      }
    }
  };

  // Get the drone config for this page, or exit if not found
  var config = OPENING_DRONES[pagePath];
  if (!config) return;

  // Initialize on DOM ready and anime.js loaded
  function initWhenReady() {
    waitForAnime(function() {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
      } else {
        init();
      }
    });
  }

  initWhenReady();

  function init() {
    // Create container
    var container = document.createElement('div');
    container.id = 'drone-opening-container';
    container.setAttribute('aria-hidden', 'true');
    container.style.cssText =
      'position: fixed; inset: 0; pointer-events: none; z-index: 25; ' +
      'overflow: hidden; display: block; height: 100vh;';

    // Insert at the very top of body
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

    // Build detailed SVG quadcopter
    var svg = buildQuadcopter(cfg);
    var mover = document.createElement('div');
    mover.style.cssText = 'position: absolute; left: 0; top: 0; will-change: transform;';
    mover.appendChild(svg);
    container.appendChild(mover);

    var pos = { x: route.frames[0].x, y: route.frames[0].y, rot: route.frames[0].rot || 0 };

    function render() {
      mover.style.transform = 'translate(' + pos.x + 'px, ' + pos.y + 'px) rotateZ(' + pos.rot + 'deg)';
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
      duration: 400,
      easing: 'easeOutQuad'
    }, 0);

    // Flight path with rotation and banking
    var legMs = route.duration / Math.max(route.frames.length - 1, 1);
    for (var i = 1; i < route.frames.length; i++) {
      var f = route.frames[i];
      var frameDuration = f.hold ? f.hold : legMs;
      var frameEasing = f.hold ? 'linear' : (route.easing || 'linear');

      tl.add({
        targets: pos,
        x: f.x,
        y: f.y,
        rot: f.rot !== undefined ? f.rot : pos.rot,
        duration: frameDuration,
        easing: frameEasing
      });
    }

    // Fade out
    var finalOpacity = route.frames[route.frames.length - 1].opacity;
    tl.add({
      targets: svg,
      opacity: finalOpacity !== undefined ? finalOpacity : 0,
      duration: 400,
      easing: 'easeInQuad'
    }, '-=400');

    // Propeller spin
    anime({
      targets: svg.querySelectorAll('.drone-propeller-blur'),
      rotate: 360,
      duration: 400,
      loop: true,
      easing: 'linear'
    });

    // Body vibration (subtle)
    anime({
      targets: svg.querySelectorAll('.drone-body'),
      translateY: [0, -0.5, 0.3, -0.2, 0],
      duration: 1800,
      loop: true,
      easing: 'easeInOutSine'
    });
  }

  function buildQuadcopter(cfg) {
    var NS = 'http://www.w3.org/2000/svg';
    var size = cfg.size;
    var viewBoxSize = 100;
    var scale = size / viewBoxSize;

    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + viewBoxSize + ' ' + viewBoxSize);
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.style.cssText =
      'position: absolute; left: 0; top: 0; opacity: 1; ' +
      'will-change: transform, opacity; ' +
      'filter: drop-shadow(0 4px 12px rgba(0,0,0,0.2));';

    // Define gradients for depth and lighting
    var defs = document.createElementNS(NS, 'defs');

    var bodyGrad = document.createElementNS(NS, 'linearGradient');
    bodyGrad.setAttribute('id', 'bodyGradient');
    bodyGrad.setAttribute('x1', '0%');
    bodyGrad.setAttribute('y1', '0%');
    bodyGrad.setAttribute('x2', '0%');
    bodyGrad.setAttribute('y2', '100%');
    var stop1 = document.createElementNS(NS, 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#1a1a1a');
    var stop2 = document.createElementNS(NS, 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#0a0a0a');
    bodyGrad.appendChild(stop1);
    bodyGrad.appendChild(stop2);
    defs.appendChild(bodyGrad);

    var armGrad = document.createElementNS(NS, 'linearGradient');
    armGrad.setAttribute('id', 'armGradient');
    armGrad.setAttribute('x1', '0%');
    armGrad.setAttribute('y1', '50%');
    armGrad.setAttribute('x2', '100%');
    armGrad.setAttribute('y2', '50%');
    var astop1 = document.createElementNS(NS, 'stop');
    astop1.setAttribute('offset', '0%');
    astop1.setAttribute('stop-color', '#2a2a2a');
    var astop2 = document.createElementNS(NS, 'stop');
    astop2.setAttribute('offset', '100%');
    astop2.setAttribute('stop-color', '#1a1a1a');
    armGrad.appendChild(astop1);
    armGrad.appendChild(astop2);
    defs.appendChild(armGrad);

    svg.appendChild(defs);

    // Central body (larger, more realistic proportions)
    var body = document.createElementNS(NS, 'ellipse');
    body.setAttribute('cx', '50');
    body.setAttribute('cy', '50');
    body.setAttribute('rx', '12');
    body.setAttribute('ry', '16');
    body.setAttribute('fill', 'url(#bodyGradient)');
    body.setAttribute('class', 'drone-body');
    svg.appendChild(body);

    // Landing gear (two legs visible from above)
    var gear1 = document.createElementNS(NS, 'g');
    var gl1 = document.createElementNS(NS, 'line');
    gl1.setAttribute('x1', '42');
    gl1.setAttribute('y1', '58');
    gl1.setAttribute('x2', '38');
    gl1.setAttribute('y2', '68');
    gl1.setAttribute('stroke', '#333');
    gl1.setAttribute('stroke-width', '1.5');
    gl1.setAttribute('stroke-linecap', 'round');
    gear1.appendChild(gl1);
    var gfoot1 = document.createElementNS(NS, 'circle');
    gfoot1.setAttribute('cx', '38');
    gfoot1.setAttribute('cy', '70');
    gfoot1.setAttribute('r', '2');
    gfoot1.setAttribute('fill', '#444');
    gear1.appendChild(gfoot1);
    svg.appendChild(gear1);

    var gear2 = document.createElementNS(NS, 'g');
    var gl2 = document.createElementNS(NS, 'line');
    gl2.setAttribute('x1', '58');
    gl2.setAttribute('y1', '58');
    gl2.setAttribute('x2', '62');
    gl2.setAttribute('y2', '68');
    gl2.setAttribute('stroke', '#333');
    gl2.setAttribute('stroke-width', '1.5');
    gl2.setAttribute('stroke-linecap', 'round');
    gear2.appendChild(gl2);
    var gfoot2 = document.createElementNS(NS, 'circle');
    gfoot2.setAttribute('cx', '62');
    gfoot2.setAttribute('cy', '70');
    gfoot2.setAttribute('r', '2');
    gfoot2.setAttribute('fill', '#444');
    gear2.appendChild(gfoot2);
    svg.appendChild(gear2);

    // Four articulated arms with motors and propellers
    var armPositions = [
      { x1: 50, y1: 38, x2: 30, y2: 18, rot: 45 },     // top-left
      { x1: 50, y1: 38, x2: 70, y2: 18, rot: 315 },    // top-right
      { x1: 50, y1: 62, x2: 30, y2: 82, rot: 225 },    // bottom-left
      { x1: 50, y1: 62, x2: 70, y2: 82, rot: 135 }     // bottom-right
    ];

    armPositions.forEach(function(pos) {
      // Arm
      var arm = document.createElementNS(NS, 'line');
      arm.setAttribute('x1', pos.x1);
      arm.setAttribute('y1', pos.y1);
      arm.setAttribute('x2', pos.x2);
      arm.setAttribute('y2', pos.y2);
      arm.setAttribute('stroke', 'url(#armGradient)');
      arm.setAttribute('stroke-width', '3');
      arm.setAttribute('stroke-linecap', 'round');
      svg.appendChild(arm);

      // Motor housing
      var motor = document.createElementNS(NS, 'circle');
      motor.setAttribute('cx', pos.x2);
      motor.setAttribute('cy', pos.y2);
      motor.setAttribute('r', '4.5');
      motor.setAttribute('fill', '#0a0a0a');
      motor.setAttribute('stroke', '#444');
      motor.setAttribute('stroke-width', '1');
      svg.appendChild(motor);

      // Propeller with motion blur effect
      var propellerGroup = document.createElementNS(NS, 'g');
      propellerGroup.setAttribute('class', 'drone-propeller-blur');
      propellerGroup.style.transformOrigin = pos.x2 + 'px ' + pos.y2 + 'px';

      // Outer blur circle (represents spinning motion)
      var blur = document.createElementNS(NS, 'circle');
      blur.setAttribute('cx', pos.x2);
      blur.setAttribute('cy', pos.y2);
      blur.setAttribute('r', '7');
      blur.setAttribute('fill', 'none');
      blur.setAttribute('stroke', 'rgba(255, 150, 0, 0.15)');
      blur.setAttribute('stroke-width', '1.5');
      blur.setAttribute('opacity', '0.6');
      propellerGroup.appendChild(blur);

      // Propeller blades (two visible blades in top view)
      var blade1 = document.createElementNS(NS, 'rect');
      blade1.setAttribute('x', pos.x2 - 1);
      blade1.setAttribute('y', pos.y2 - 8);
      blade1.setAttribute('width', '2');
      blade1.setAttribute('height', '8');
      blade1.setAttribute('fill', '#FF6600');
      blade1.setAttribute('opacity', '0.8');
      blade1.setAttribute('rx', '1');
      propellerGroup.appendChild(blade1);

      var blade2 = document.createElementNS(NS, 'rect');
      blade2.setAttribute('x', pos.x2 - 8);
      blade2.setAttribute('y', pos.y2 - 1);
      blade2.setAttribute('width', '8');
      blade2.setAttribute('height', '2');
      blade2.setAttribute('fill', '#FF6600');
      blade2.setAttribute('opacity', '0.6');
      blade2.setAttribute('rx', '1');
      propellerGroup.appendChild(blade2);

      svg.appendChild(propellerGroup);
    });

    // Camera lens (gimbal camera beneath body)
    var camera = document.createElementNS(NS, 'circle');
    camera.setAttribute('cx', '50');
    camera.setAttribute('cy', '62');
    camera.setAttribute('r', '3');
    camera.setAttribute('fill', '#1a1a1a');
    camera.setAttribute('stroke', '#FF6600');
    camera.setAttribute('stroke-width', '1');
    svg.appendChild(camera);

    // Highlight on body for depth
    var highlight = document.createElementNS(NS, 'ellipse');
    highlight.setAttribute('cx', '48');
    highlight.setAttribute('cy', '45');
    highlight.setAttribute('rx', '3');
    highlight.setAttribute('ry', '4');
    highlight.setAttribute('fill', '#333');
    highlight.setAttribute('opacity', '0.4');
    svg.appendChild(highlight);

    return svg;
  }
})();
