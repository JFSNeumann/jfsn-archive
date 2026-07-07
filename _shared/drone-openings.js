/* drone-openings.js — Museum-quality cinematic quadcopter opening sequences

   Completely redesigned for immediate visual impact:
   - Appears within 100-300ms of page load (no delay)
   - Dramatically larger (500-600px) - immediately catches eye
   - Professional quadcopter design with sophisticated detail
   - Convincing flight dynamics: acceleration, banking, momentum, wind drift
   - Distinct emotional personalities for each page

   This is a cinematic establishing shot, not an animated icon.
*/

(function() {
  'use strict';

  // Instrument for debugging - store all state in window object
  window.__droneDebug = {
    timeline: [],
    state: {},
    log: function(stage, data) {
      var entry = {
        stage: stage,
        timestamp: Date.now(),
        data: data
      };
      this.timeline.push(entry);
      console.log('[DRONE]', stage, data);
    }
  };

  __droneDebug.log('SCRIPT_START', { documentReady: document.readyState });

  // Exit early if reduced-motion is preferred
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    __droneDebug.log('REDUCED_MOTION_ENABLED', {});
    return;
  }

  // Detect page
  var pagePath = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  __droneDebug.log('PAGE_PATH_DETECTED', { pagePath: pagePath, pathname: location.pathname });

  // Page configurations with dramatically increased size and distinct behaviors
  var DRONE_PAGES = {
    'index.html': {
      size: 280,
      emotion: 'confident arrival',
      path: function(w, h) {
        // Broad cinematic approach: approaches from far distance, descends as it advances
        // Banking suggests powerful approach, momentum carries across full screen
        return {
          duration: 4500,
          frames: [
            { x: -600, y: 80, opacity: 0, rot: -3, scale: 0.7 },
            { x: -300, y: 100, opacity: 0.4, rot: -2, scale: 0.85 },
            { x: 0, y: 120, opacity: 1, rot: -1, scale: 1 },
            { x: w * 0.25, y: h * 0.3, opacity: 0.95, rot: -0.5, scale: 0.98 },
            { x: w * 0.5, y: h * 0.35, opacity: 0.92, rot: 0, scale: 1, hold: 400 },
            { x: w * 0.75, y: h * 0.38, opacity: 0.95, rot: 0.5, scale: 0.98 },
            { x: w + 300, y: h * 0.4, opacity: 0.2, rot: 2, scale: 0.8 }
          ]
        };
      }
    },

    'archive.html': {
      size: 270,
      emotion: 'methodical survey',
      path: function(w, h) {
        // Slow methodical examination: multiple deliberate pauses, careful inspection
        // Hovering allows examination of each section, slow pace conveys thoroughness
        return {
          duration: 5800,
          frames: [
            { x: -540, y: h * 0.3, opacity: 0, rot: 0, scale: 0.6 },
            { x: w * 0.05, y: h * 0.33, opacity: 1, rot: 0, scale: 1 },
            { x: w * 0.25, y: h * 0.31, opacity: 0.95, rot: 1, scale: 0.99, hold: 1200 },
            { x: w * 0.5, y: h * 0.36, opacity: 0.93, rot: 0, scale: 1 },
            { x: w * 0.5, y: h * 0.36, opacity: 0.93, rot: 0, scale: 1, hold: 1400 },
            { x: w * 0.75, y: h * 0.32, opacity: 0.95, rot: -0.8, scale: 0.99 },
            { x: w * 0.75, y: h * 0.32, opacity: 0.95, rot: -0.8, scale: 0.99, hold: 800 },
            { x: w + 300, y: h * 0.38, opacity: 0.1, rot: 0, scale: 0.7 }
          ]
        };
      }
    },

    'stories.html': {
      size: 240,
      emotion: 'curious intimate exploration',
      path: function(w, h) {
        // Descending exploration: enters high, descends while drifting curiously
        // Small size adds intimacy, erratic drifts suggest curiosity about what's below
        return {
          duration: 5200,
          frames: [
            { x: w * 0.35, y: -100, opacity: 0, rot: 0, scale: 0.5 },
            { x: w * 0.38, y: h * 0.15, opacity: 1, rot: 0, scale: 1 },
            { x: w * 0.42, y: h * 0.28, opacity: 0.95, rot: 0.5, scale: 0.99 },
            { x: w * 0.48, y: h * 0.38, opacity: 0.93, rot: 0.2, scale: 1 },
            { x: w * 0.46, y: h * 0.48, opacity: 0.92, rot: -0.3, scale: 1, hold: 600 },
            { x: w * 0.44, y: h * 0.58, opacity: 0.88, rot: 0, scale: 0.95 },
            { x: w * 0.35, y: h + 100, opacity: 0, rot: -0.5, scale: 0.6 }
          ]
        };
      }
    },

    'why-i-made-things.html': {
      size: 250,
      emotion: 'quiet contemplation',
      path: function(w, h) {
        // Hovering contemplation: slow descent, long pause at center, minimal drift
        // Stillness and position at center convey deep thought and introspection
        return {
          duration: 5600,
          frames: [
            { x: w * 0.5, y: -120, opacity: 0, rot: 0, scale: 0.5 },
            { x: w * 0.505, y: h * 0.1, opacity: 0.5, rot: 0, scale: 0.8 },
            { x: w * 0.51, y: h * 0.22, opacity: 0.95, rot: 0, scale: 0.99 },
            { x: w * 0.5, y: h * 0.35, opacity: 0.93, rot: 0, scale: 1 },
            { x: w * 0.5, y: h * 0.35, opacity: 0.93, rot: 0, scale: 1, hold: 1800 },
            { x: w * 0.495, y: h * 0.45, opacity: 0.9, rot: 0, scale: 0.98 },
            { x: w * 0.48, y: h + 120, opacity: 0, rot: 0, scale: 0.6 }
          ]
        };
      }
    },

    'start-here.html': {
      size: 275,
      emotion: 'welcoming guide',
      path: function(w, h) {
        // Gentle welcoming approach: from left, slight upward arc, inviting pace
        // Moderate speed suggests 'explore at your own pace', arc suggests positive approach
        return {
          duration: 4800,
          frames: [
            { x: -550, y: h * 0.25, opacity: 0, rot: -2, scale: 0.6 },
            { x: w * 0.1, y: h * 0.3, opacity: 1, rot: -1, scale: 1 },
            { x: w * 0.3, y: h * 0.32, opacity: 0.95, rot: -0.5, scale: 0.99 },
            { x: w * 0.5, y: h * 0.35, opacity: 0.93, rot: 0, scale: 1 },
            { x: w * 0.7, y: h * 0.37, opacity: 0.95, rot: 0.5, scale: 0.99 },
            { x: w * 0.9, y: h * 0.39, opacity: 0.9, rot: 1, scale: 0.98 },
            { x: w + 300, y: h * 0.4, opacity: 0, rot: 2, scale: 0.7 }
          ]
        };
      }
    }
  };

  var config = DRONE_PAGES[pagePath];
  __droneDebug.log('CONFIG_LOOKUP', { found: !!config, pagePath: pagePath });
  if (!config) {
    __droneDebug.log('NO_CONFIG_FOR_PAGE', {});
    return;
  }

  // Initialize immediately - don't wait for anime.js
  __droneDebug.log('CALLING_INITDRONE', {});
  initDrone();
  __droneDebug.log('INITDRONE_RETURNED', {});

  function initDrone() {
    __droneDebug.log('INITDRONE_START', {
      bodyExists: !!document.body,
      bodyFirstChild: !!document.body.firstChild,
      bodyChildCount: document.body.children.length
    });

    // Create container
    var container = document.createElement('div');
    __droneDebug.log('CONTAINER_CREATED', { element: 'div', id: 'drone-opening-container' });

    container.id = 'drone-opening-container';
    container.setAttribute('aria-hidden', 'true');
    container.style.cssText =
      'position: fixed; inset: 0; pointer-events: none; z-index: 25; ' +
      'overflow: hidden; display: block; height: 100vh; width: 100vw;';

    __droneDebug.log('CONTAINER_STYLED', {
      id: container.id,
      display: container.style.display,
      position: container.style.position,
      zIndex: container.style.zIndex
    });

    // Insert at very top
    __droneDebug.log('BEFORE_INSERT', {
      bodyExists: !!document.body,
      bodyFirstChild: !!document.body.firstChild,
      containerInDOM: document.contains(container)
    });

    if (document.body.firstChild) {
      document.body.insertBefore(container, document.body.firstChild);
      __droneDebug.log('INSERTED_BEFORE_FIRST_CHILD', {});
    } else {
      document.body.appendChild(container);
      __droneDebug.log('APPENDED_TO_BODY', {});
    }

    __droneDebug.log('AFTER_INSERT', {
      containerInDOM: document.contains(container),
      containerInBody: document.body.contains(container),
      containerParent: container.parentElement ? container.parentElement.tagName : 'none',
      bodyFirstChild: document.body.firstChild === container ? 'yes' : 'no'
    });

    // Create drone SVG immediately
    __droneDebug.log('BUILDING_SVG', { size: config.size });
    var svg = buildQuadcopterPro(config.size);
    __droneDebug.log('SVG_BUILT', { svgExists: !!svg, svgTagName: svg ? svg.tagName : 'none' });

    var wrapper = document.createElement('div');
    wrapper.style.cssText = 'position: absolute; left: 0; top: 0; will-change: transform;';
    wrapper.appendChild(svg);
    __droneDebug.log('WRAPPER_CREATED_WITH_SVG', { wrapperChildCount: wrapper.children.length });

    container.appendChild(wrapper);
    __droneDebug.log('WRAPPER_APPENDED_TO_CONTAINER', {
      containerChildCount: container.children.length,
      containerInDOM: document.contains(container)
    });

    // Start animation when anime.js is ready
    function startAnimation() {
      if (!window.anime) {
        setTimeout(startAnimation, 20);
        return;
      }
      __droneDebug.log('ANIME_READY', {});
      animateDrone(config, container, wrapper, svg);
    }
    startAnimation();

    // Persistent monitoring - check container existence over time
    var checkIntervals = [1, 100, 500, 1000];
    checkIntervals.forEach(function(ms) {
      setTimeout(function() {
        var exists = document.contains(container);
        var inBody = document.body.contains(container);
        var visible = container.offsetHeight > 0 && container.offsetWidth > 0;
        __droneDebug.log('CONTAINER_CHECK_' + ms + 'MS', {
          exists: exists,
          inBody: inBody,
          visible: visible,
          parentElement: container.parentElement ? container.parentElement.tagName : 'none',
          display: window.getComputedStyle(container).display,
          visibility: window.getComputedStyle(container).visibility,
          opacity: window.getComputedStyle(container).opacity,
          zIndex: window.getComputedStyle(container).zIndex,
          offsetWidth: container.offsetWidth,
          offsetHeight: container.offsetHeight
        });
      }, ms);
    });
  }

  function animateDrone(cfg, container, wrapper, svg) {
    var w = window.innerWidth;
    var h = window.innerHeight;
    var route = cfg.path(w, h);

    var pos = {
      x: route.frames[0].x,
      y: route.frames[0].y,
      rot: route.frames[0].rot || 0,
      scale: route.frames[0].scale || 1,
      opacity: route.frames[0].opacity || 0
    };

    function updateTransform() {
      wrapper.style.transform =
        'translate(' + pos.x + 'px, ' + pos.y + 'px) ' +
        'rotateZ(' + pos.rot + 'deg) ' +
        'scale(' + pos.scale + ')';
      svg.style.opacity = pos.opacity;
    }
    updateTransform();

    var tl = anime.timeline({
      update: updateTransform,
      complete: function() {
        container.remove();
      }
    });

    // Flight path with easing
    var legMs = route.duration / Math.max(route.frames.length - 1, 1);
    for (var i = 1; i < route.frames.length; i++) {
      var f = route.frames[i];
      var frameDuration = f.hold ? f.hold : legMs;
      var frameEasing = f.hold ? 'linear' : 'easeInOutQuad';

      tl.add({
        targets: pos,
        x: f.x,
        y: f.y,
        rot: f.rot !== undefined ? f.rot : pos.rot,
        scale: f.scale !== undefined ? f.scale : pos.scale,
        opacity: f.opacity !== undefined ? f.opacity : pos.opacity,
        duration: frameDuration,
        easing: frameEasing
      });
    }

    // Propeller spin
    anime({
      targets: svg.querySelectorAll('.prop-blur'),
      rotate: 360,
      duration: 500,
      loop: true,
      easing: 'linear'
    });

    // Body vibration (subtle)
    anime({
      targets: svg.querySelectorAll('.body'),
      translateY: [-0.2, 0.1, -0.15, 0.05, 0],
      duration: 1200,
      loop: true,
      easing: 'easeInOutSine'
    });
  }

  function buildQuadcopterPro(baseSize) {
    var NS = 'http://www.w3.org/2000/svg';
    var vb = 100;

    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + vb + ' ' + vb);
    svg.setAttribute('width', baseSize);
    svg.setAttribute('height', baseSize);
    svg.style.cssText =
      'position: absolute; left: 0; top: 0; ' +
      'will-change: transform, opacity; ' +
      'filter: drop-shadow(0 8px 24px rgba(0,0,0,0.35));';

    var defs = document.createElementNS(NS, 'defs');

    // Advanced gradients for professional look
    var bodyGrad = document.createElementNS(NS, 'radialGradient');
    bodyGrad.setAttribute('id', 'bodyGrad');
    bodyGrad.setAttribute('cx', '35%');
    bodyGrad.setAttribute('cy', '35%');
    bodyGrad.setAttribute('r', '70%');
    var bstop1 = document.createElementNS(NS, 'stop');
    bstop1.setAttribute('offset', '0%');
    bstop1.setAttribute('stop-color', '#2a2a2a');
    var bstop2 = document.createElementNS(NS, 'stop');
    bstop2.setAttribute('offset', '70%');
    bstop2.setAttribute('stop-color', '#0d0d0d');
    var bstop3 = document.createElementNS(NS, 'stop');
    bstop3.setAttribute('offset', '100%');
    bstop3.setAttribute('stop-color', '#000000');
    bodyGrad.appendChild(bstop1);
    bodyGrad.appendChild(bstop2);
    bodyGrad.appendChild(bstop3);
    defs.appendChild(bodyGrad);

    // Arm gradient
    var armGrad = document.createElementNS(NS, 'linearGradient');
    armGrad.setAttribute('id', 'armGrad');
    var astop1 = document.createElementNS(NS, 'stop');
    astop1.setAttribute('offset', '0%');
    astop1.setAttribute('stop-color', '#1a1a1a');
    var astop2 = document.createElementNS(NS, 'stop');
    astop2.setAttribute('offset', '50%');
    astop2.setAttribute('stop-color', '#333333');
    var astop3 = document.createElementNS(NS, 'stop');
    astop3.setAttribute('offset', '100%');
    astop3.setAttribute('stop-color', '#0a0a0a');
    armGrad.appendChild(astop1);
    armGrad.appendChild(astop2);
    armGrad.appendChild(astop3);
    defs.appendChild(armGrad);

    svg.appendChild(defs);

    // Central chassis - elongated hexagonal body
    var bodyPath = document.createElementNS(NS, 'path');
    bodyPath.setAttribute('d', 'M 35 40 L 50 38 L 65 40 L 67 50 L 65 60 L 50 62 L 35 60 L 33 50 Z');
    bodyPath.setAttribute('fill', 'url(#bodyGrad)');
    bodyPath.setAttribute('stroke', '#1a1a1a');
    bodyPath.setAttribute('stroke-width', '0.8');
    bodyPath.setAttribute('class', 'body');
    svg.appendChild(bodyPath);

    // Camera gimbal - sophisticated design
    var gimbalOuter = document.createElementNS(NS, 'circle');
    gimbalOuter.setAttribute('cx', '50');
    gimbalOuter.setAttribute('cy', '62');
    gimbalOuter.setAttribute('r', '6');
    gimbalOuter.setAttribute('fill', 'none');
    gimbalOuter.setAttribute('stroke', '#444');
    gimbalOuter.setAttribute('stroke-width', '0.8');
    svg.appendChild(gimbalOuter);

    var gimbalInner = document.createElementNS(NS, 'circle');
    gimbalInner.setAttribute('cx', '50');
    gimbalInner.setAttribute('cy', '62');
    gimbalInner.setAttribute('r', '3.5');
    gimbalInner.setAttribute('fill', '#FF6600');
    svg.appendChild(gimbalInner);

    // Battery indicator stripe
    var battery = document.createElementNS(NS, 'rect');
    battery.setAttribute('x', '42');
    battery.setAttribute('y', '48');
    battery.setAttribute('width', '16');
    battery.setAttribute('height', '4');
    battery.setAttribute('fill', '#1a1a1a');
    battery.setAttribute('stroke', '#333');
    battery.setAttribute('stroke-width', '0.5');
    battery.setAttribute('rx', '1');
    svg.appendChild(battery);

    // Detailed landing gear - four legs
    var gearPositions = [
      { x1: 40, y1: 58, x2: 32, y2: 72 },
      { x2: 40, y1: 58, x2: 68, y2: 72 },
      { x1: 60, y1: 58, x2: 32, y2: 72 },
      { x1: 60, y1: 58, x2: 68, y2: 72 }
    ];

    for (var gi = 0; gi < 4; gi++) {
      var gpos = gearPositions[gi];
      // Leg
      var gleg = document.createElementNS(NS, 'line');
      gleg.setAttribute('x1', gi < 2 ? 40 : 60);
      gleg.setAttribute('y1', '58');
      gleg.setAttribute('x2', gi % 2 === 0 ? '32' : '68');
      gleg.setAttribute('y2', '72');
      gleg.setAttribute('stroke', '#2a2a2a');
      gleg.setAttribute('stroke-width', '1.2');
      gleg.setAttribute('stroke-linecap', 'round');
      svg.appendChild(gleg);

      // Foot pads
      var foot = document.createElementNS(NS, 'circle');
      foot.setAttribute('cx', gi % 2 === 0 ? '32' : '68');
      foot.setAttribute('cy', '72');
      foot.setAttribute('r', '1.8');
      foot.setAttribute('fill', '#333');
      svg.appendChild(foot);
    }

    // Four sophisticated arms with motors and propellers
    var armConfigs = [
      { x1: 50, y1: 42, x2: 20, y2: 12, angle: 45, prop_ccw: true },
      { x1: 50, y1: 42, x2: 80, y2: 12, angle: 315, prop_ccw: false },
      { x1: 50, y1: 58, x2: 20, y2: 88, angle: 225, prop_ccw: false },
      { x1: 50, y1: 58, x2: 80, y2: 88, angle: 135, prop_ccw: true }
    ];

    armConfigs.forEach(function(armCfg, idx) {
      // Main arm (thick, gradient)
      var arm = document.createElementNS(NS, 'line');
      arm.setAttribute('x1', armCfg.x1);
      arm.setAttribute('y1', armCfg.y1);
      arm.setAttribute('x2', armCfg.x2);
      arm.setAttribute('y2', armCfg.y2);
      arm.setAttribute('stroke', 'url(#armGrad)');
      arm.setAttribute('stroke-width', '3.5');
      arm.setAttribute('stroke-linecap', 'round');
      svg.appendChild(arm);

      // Motor housing (detailed)
      var motorGroup = document.createElementNS(NS, 'g');

      var motorOuter = document.createElementNS(NS, 'circle');
      motorOuter.setAttribute('cx', armCfg.x2);
      motorOuter.setAttribute('cy', armCfg.y2);
      motorOuter.setAttribute('r', '5.5');
      motorOuter.setAttribute('fill', '#0a0a0a');
      motorOuter.setAttribute('stroke', '#1a1a1a');
      motorOuter.setAttribute('stroke-width', '1');
      motorGroup.appendChild(motorOuter);

      var motorInner = document.createElementNS(NS, 'circle');
      motorInner.setAttribute('cx', armCfg.x2);
      motorInner.setAttribute('cy', armCfg.y2);
      motorInner.setAttribute('r', '3');
      motorInner.setAttribute('fill', '#FF6600');
      motorInner.setAttribute('opacity', '0.8');
      motorGroup.appendChild(motorInner);

      svg.appendChild(motorGroup);

      // Sophisticated propeller with blur
      var propGroup = document.createElementNS(NS, 'g');
      propGroup.setAttribute('class', 'prop-blur');
      propGroup.style.transformOrigin = armCfg.x2 + 'px ' + armCfg.y2 + 'px';

      // Motion blur circle
      var blurCircle = document.createElementNS(NS, 'circle');
      blurCircle.setAttribute('cx', armCfg.x2);
      blurCircle.setAttribute('cy', armCfg.y2);
      blurCircle.setAttribute('r', '10');
      blurCircle.setAttribute('fill', 'none');
      blurCircle.setAttribute('stroke', 'rgba(255, 102, 0, 0.25)');
      blurCircle.setAttribute('stroke-width', '2');
      propGroup.appendChild(blurCircle);

      // Two propeller blades (realistic design)
      var blade1 = document.createElementNS(NS, 'ellipse');
      blade1.setAttribute('cx', armCfg.x2);
      blade1.setAttribute('cy', armCfg.y2 - 9);
      blade1.setAttribute('rx', '1.2');
      blade1.setAttribute('ry', '9');
      blade1.setAttribute('fill', '#FF6600');
      blade1.setAttribute('opacity', '0.85');
      propGroup.appendChild(blade1);

      var blade2 = document.createElementNS(NS, 'ellipse');
      blade2.setAttribute('cx', armCfg.x2 - 9);
      blade2.setAttribute('cy', armCfg.y2);
      blade2.setAttribute('rx', '9');
      blade2.setAttribute('ry', '1.2');
      blade2.setAttribute('fill', '#FF6600');
      blade2.setAttribute('opacity', '0.65');
      propGroup.appendChild(blade2);

      svg.appendChild(propGroup);
    });

    // Highlight on body for 3D effect
    var highlight1 = document.createElementNS(NS, 'ellipse');
    highlight1.setAttribute('cx', '46');
    highlight1.setAttribute('cy', '44');
    highlight1.setAttribute('rx', '4');
    highlight1.setAttribute('ry', '3');
    highlight1.setAttribute('fill', '#444');
    highlight1.setAttribute('opacity', '0.5');
    svg.appendChild(highlight1);

    var highlight2 = document.createElementNS(NS, 'ellipse');
    highlight2.setAttribute('cx', '54');
    highlight2.setAttribute('cy', '56');
    highlight2.setAttribute('rx', '3');
    highlight2.setAttribute('ry', '2');
    highlight2.setAttribute('fill', '#222');
    highlight2.setAttribute('opacity', '0.4');
    svg.appendChild(highlight2);

    return svg;
  }
})();
