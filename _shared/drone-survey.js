/* drone-survey.js — Drone surveillance animation over wall grid

   Animated quadcopter hovering & surveying the wall band, making
   passes left-to-right with random photo pauses. Uses anime.js
   for smooth choreography. Respects prefers-reduced-motion.

   Features:
   - SVG drone with rotor spin
   - Path animation: takeoff → survey passes → landing
   - Camera spotlight with color-match glow (chromatic-aware)
   - Hover pauses over random tiles with flash effect
   - Loop or single-pass based on viewport
*/

(function() {
  'use strict';

  // Skip if reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Skip if anime not loaded
  if (!window.anime) return;

  const wallGrid = document.getElementById('wall-band-d');
  if (!wallGrid) return;

  // Wait for grid to populate
  const waitForGrid = setInterval(() => {
    const tiles = wallGrid.querySelectorAll('a');
    if (tiles.length >= 20) {
      clearInterval(waitForGrid);
      initDrone(tiles);
    }
  }, 100);

  // Timeout to prevent infinite loop
  setTimeout(() => clearInterval(waitForGrid), 5000);

  function initDrone(tiles) {
    const container = wallGrid.closest('section');
    if (!container) return;

    // Create drone container
    const droneWrap = document.createElement('div');
    droneWrap.id = 'drone-survey-wrap';
    droneWrap.style.cssText = `
      position: relative;
      pointer-events: none;
      margin-bottom: 16px;
    `;

    // Create SVG drone
    const droneSvg = createDroneSvg();
    droneWrap.appendChild(droneSvg);

    // Create spotlight beam
    const spotlight = document.createElement('div');
    spotlight.className = 'drone-spotlight';
    spotlight.style.cssText = `
      position: absolute;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255,102,0,0.3) 0%, rgba(255,102,0,0.1) 70%, transparent 100%);
      pointer-events: none;
      opacity: 0;
      left: 0;
      top: 0;
      box-shadow: 0 0 30px rgba(255,102,0,0.2);
      will-change: opacity, left, top;
    `;
    droneWrap.appendChild(spotlight);

    // Insert before grid
    wallGrid.parentNode.insertBefore(droneWrap, wallGrid);

    // Start animation
    animateDroneSurvey(droneSvg, spotlight, tiles, droneWrap);
  }

  function createDroneSvg() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 80 80');
    svg.setAttribute('width', '60');
    svg.setAttribute('height', '60');
    svg.setAttribute('id', 'drone-svg');
    svg.style.cssText = `
      position: absolute;
      left: 0;
      top: 0;
      will-change: transform, opacity;
      filter: drop-shadow(0 2px 8px rgba(0,0,0,0.15));
    `;

    // Fuselage (body)
    const body = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    body.setAttribute('x', '30');
    body.setAttribute('y', '35');
    body.setAttribute('width', '20');
    body.setAttribute('height', '10');
    body.setAttribute('fill', '#0B0B0B');
    body.setAttribute('rx', '2');
    svg.appendChild(body);

    // Arms (4 rotors)
    for (let i = 0; i < 4; i++) {
      const arm = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      const angle = (i * 90) * Math.PI / 180;
      const x1 = 40 + Math.cos(angle) * 8;
      const y1 = 40 + Math.sin(angle) * 8;
      const x2 = 40 + Math.cos(angle) * 28;
      const y2 = 40 + Math.sin(angle) * 28;
      arm.setAttribute('x1', x1);
      arm.setAttribute('y1', y1);
      arm.setAttribute('x2', x2);
      arm.setAttribute('y2', y2);
      arm.setAttribute('stroke', '#575757');
      arm.setAttribute('stroke-width', '2');
      svg.appendChild(arm);

      // Rotor (spinning circle)
      const rotor = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      rotor.setAttribute('cx', x2);
      rotor.setAttribute('cy', y2);
      rotor.setAttribute('r', '6');
      rotor.setAttribute('fill', 'none');
      rotor.setAttribute('stroke', '#FF6600');
      rotor.setAttribute('stroke-width', '2');
      rotor.setAttribute('class', 'drone-rotor');
      rotor.style.transformOrigin = `${x2}px ${y2}px`;
      svg.appendChild(rotor);
    }

    // Camera gimbal (circle below center)
    const camera = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    camera.setAttribute('cx', '40');
    camera.setAttribute('cy', '55');
    camera.setAttribute('r', '4');
    camera.setAttribute('fill', '#FF6600');
    svg.appendChild(camera);

    return svg;
  }

  function animateDroneSurvey(droneSvg, spotlight, tiles, container) {
    const wallGrid = document.getElementById('wall-band-d');
    const gridRect = wallGrid.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const gridWidth = wallGrid.offsetWidth;
    const gridHeight = wallGrid.offsetHeight;
    const droneSize = 60;

    // Define surveillance path: left-to-right passes at different altitudes
    const passes = [];
    const passCount = 3; // 3 survey passes
    const passHeights = [60, 30, 80]; // varying altitudes for depth

    for (let p = 0; p < passCount; p++) {
      const isRightBound = p % 2 === 0; // alternate direction
      const height = passHeights[p % passHeights.length];
      const startX = isRightBound ? -droneSize : gridWidth;
      const endX = isRightBound ? gridWidth : -droneSize;

      // Main pass
      passes.push({
        x: endX,
        y: height,
        duration: 3000,
        easing: 'linear',
      });

      // Hover points (random tiles)
      const hoverCount = 2 + Math.floor(Math.random() * 2);
      for (let h = 0; h < hoverCount; h++) {
        const randomTile = tiles[Math.floor(Math.random() * tiles.length)];
        const tileRect = randomTile.getBoundingClientRect();
        const tileX = tileRect.left - containerRect.left + tileRect.width / 2 - droneSize / 2;
        const tileY = tileRect.top - containerRect.top - droneSize - 20;

        passes.push({
          x: tileX,
          y: tileY,
          duration: 400,
          easing: 'easeInOutQuad',
          isHover: true,
          tile: randomTile,
        });
      }
    }

    // Animate drone through all passes
    let timeline = anime.timeline({ autoplay: false });

    // Takeoff
    timeline.add({
      targets: droneSvg,
      opacity: [0, 1],
      duration: 400,
      easing: 'easeOutQuad',
    }, 0);

    // Passes
    passes.forEach((pass, idx) => {
      const prevPass = passes[idx - 1];
      const startDelay = idx === 0 ? 400 : 0;

      timeline.add({
        targets: droneSvg,
        left: pass.x,
        top: pass.y,
        duration: pass.duration,
        easing: pass.easing || 'linear',
      }, `-=${idx === 0 ? 0 : pass.duration * 0.1}`);

      // Spotlight effect on hover
      if (pass.isHover && pass.tile) {
        const tileRect = pass.tile.getBoundingClientRect();
        const spotX = tileRect.left - containerRect.left + tileRect.width / 2 - 60;
        const spotY = tileRect.top - containerRect.top + tileRect.height / 2 - 60;

        timeline.add({
          targets: spotlight,
          left: spotX,
          top: spotY,
          opacity: [0, 1, 0],
          duration: 600,
          easing: 'easeInOutQuad',
        }, `-=${pass.duration * 0.5}`);

        // Flash effect
        timeline.add({
          targets: spotlight,
          boxShadow: [
            '0 0 30px rgba(255,102,0,0.2)',
            '0 0 60px rgba(255,102,0,0.5)',
            '0 0 30px rgba(255,102,0,0.2)',
          ],
          duration: 200,
        }, `-=${600}`);
      }
    });

    // Landing
    timeline.add({
      targets: droneSvg,
      opacity: [1, 0],
      duration: 400,
      easing: 'easeInQuad',
    });

    // Rotor spin (continuous)
    anime({
      targets: '#drone-survey-wrap .drone-rotor',
      rotate: 360,
      duration: 800,
      loop: true,
      easing: 'linear',
    });

    // Play timeline
    timeline.play();

    // Restart on scroll back into view (if in viewport again)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && timeline.paused) {
          timeline.restart();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(container);
  }
})();
