/* drone-survey.js — Multi-drone surveillance animation over wall grid

   Three distinct drones with different flight patterns:
   1. Horizontal sweeps with random hover pauses (scout)
   2. Vertical column scanning with faster rhythm (patrol)
   3. Perimeter orbit with systematic grid inspection (inspector)

   All use anime.js for smooth choreography. Respects prefers-reduced-motion.
*/

(function() {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.anime) return;

  // Support both index.html (#wall-band-d) and wall.html (.wall-grid)
  let wallGrid = document.getElementById('wall-band-d');
  if (!wallGrid) wallGrid = document.querySelector('.wall-grid');
  if (!wallGrid) return;

  const waitForGrid = setInterval(() => {
    const tiles = wallGrid.querySelectorAll('a');
    if (tiles.length >= 20) {
      clearInterval(waitForGrid);
      initDrones(tiles);
    }
  }, 100);

  setTimeout(() => clearInterval(waitForGrid), 5000);

  function initDrones(tiles) {
    const container = wallGrid.closest('section');
    if (!container) return;

    // Drone configs: different patterns, timings, colors
    const droneConfigs = [
      {
        id: 'scout',
        name: 'Scout Drone',
        delay: 0,
        pattern: 'horizontal-sweeps',
        rotorColor: '#FF6600',
        bodyColor: '#0B0B0B',
        hoverCount: 2,
      },
      {
        id: 'patrol',
        name: 'Patrol Drone',
        delay: 1200,
        pattern: 'vertical-columns',
        rotorColor: '#FF6600',
        bodyColor: '#575757',
        hoverCount: 3,
      },
      {
        id: 'inspector',
        name: 'Inspector Drone',
        delay: 2400,
        pattern: 'perimeter-orbit',
        rotorColor: '#FF9933',
        bodyColor: '#0B0B0B',
        hoverCount: 2,
      },
    ];

    droneConfigs.forEach((config) => {
      setTimeout(() => {
        spawnDrone(container, config, tiles);
      }, config.delay);
    });
  }

  function spawnDrone(container, config, tiles) {
    const wallGrid = document.getElementById('wall-band-d') || document.querySelector('.wall-grid');

    // Ensure container has position: relative for absolute positioning
    if (container.style.position !== 'absolute' && container.style.position !== 'fixed') {
      container.style.position = 'relative';
    }

    const droneWrap = document.createElement('div');
    droneWrap.className = 'drone-survey-wrap';
    droneWrap.setAttribute('data-drone', config.id);
    droneWrap.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
    `;

    const droneSvg = createDroneSvg(config);
    droneWrap.appendChild(droneSvg);

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

    wallGrid.parentNode.insertBefore(droneWrap, wallGrid);

    animateDrone(droneSvg, spotlight, config, tiles, droneWrap);
  }

  function createDroneSvg(config) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 80 80');
    svg.setAttribute('width', '60');
    svg.setAttribute('height', '60');
    svg.setAttribute('class', `drone-svg drone-${config.id}`);
    svg.style.cssText = `
      position: absolute;
      left: 0;
      top: 0;
      will-change: transform, opacity;
      filter: drop-shadow(0 2px 8px rgba(0,0,0,0.15));
    `;

    const body = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    body.setAttribute('x', '30');
    body.setAttribute('y', '35');
    body.setAttribute('width', '20');
    body.setAttribute('height', '10');
    body.setAttribute('fill', config.bodyColor);
    body.setAttribute('rx', '2');
    svg.appendChild(body);

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

      const rotor = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      rotor.setAttribute('cx', x2);
      rotor.setAttribute('cy', y2);
      rotor.setAttribute('r', '6');
      rotor.setAttribute('fill', 'none');
      rotor.setAttribute('stroke', config.rotorColor);
      rotor.setAttribute('stroke-width', '2');
      rotor.setAttribute('class', 'drone-rotor');
      rotor.style.transformOrigin = `${x2}px ${y2}px`;
      svg.appendChild(rotor);
    }

    const camera = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    camera.setAttribute('cx', '40');
    camera.setAttribute('cy', '55');
    camera.setAttribute('r', '4');
    camera.setAttribute('fill', config.rotorColor);
    svg.appendChild(camera);

    return svg;
  }

  function animateDrone(droneSvg, spotlight, config, tiles, container) {
    const wallGrid = document.getElementById('wall-band-d');
    const gridRect = wallGrid.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const gridWidth = wallGrid.offsetWidth;
    const gridHeight = wallGrid.offsetHeight;
    const droneSize = 60;

    let passes = [];

    if (config.pattern === 'horizontal-sweeps') {
      passes = generateHorizontalPasses(gridWidth, gridHeight, droneSize, config, tiles, containerRect);
    } else if (config.pattern === 'vertical-columns') {
      passes = generateVerticalPasses(gridWidth, gridHeight, droneSize, config, tiles, containerRect);
    } else if (config.pattern === 'perimeter-orbit') {
      passes = generatePerimeterPasses(gridWidth, gridHeight, droneSize, config, tiles, containerRect);
    }

    let timeline = anime.timeline({ autoplay: false });

    timeline.add({
      targets: droneSvg,
      opacity: [0, 1],
      duration: 400,
      easing: 'easeOutQuad',
    }, 0);

    passes.forEach((pass, idx) => {
      timeline.add({
        targets: droneSvg,
        left: pass.x,
        top: pass.y,
        duration: pass.duration,
        easing: pass.easing || 'linear',
      }, `-=${idx === 0 ? 0 : pass.duration * 0.1}`);

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

    timeline.add({
      targets: droneSvg,
      opacity: [1, 0],
      duration: 400,
      easing: 'easeInQuad',
    });

    anime({
      targets: container.querySelectorAll('.drone-rotor'),
      rotate: 360,
      duration: 800,
      loop: true,
      easing: 'linear',
    });

    timeline.play();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && timeline.paused) {
          timeline.restart();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(container);
  }

  function generateHorizontalPasses(gridWidth, gridHeight, droneSize, config, tiles, containerRect) {
    const passes = [];
    const passHeights = [60, 30, 80];

    for (let p = 0; p < 3; p++) {
      const isRightBound = p % 2 === 0;
      const height = passHeights[p % passHeights.length];
      const startX = isRightBound ? -droneSize : gridWidth;
      const endX = isRightBound ? gridWidth : -droneSize;

      passes.push({
        x: endX,
        y: height,
        duration: 3000,
        easing: 'linear',
      });

      const hoverCount = config.hoverCount;
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

    return passes;
  }

  function generateVerticalPasses(gridWidth, gridHeight, droneSize, config, tiles, containerRect) {
    const passes = [];
    const colCount = 3;
    const colWidth = gridWidth / colCount;

    for (let col = 0; col < colCount; col++) {
      const isDownward = col % 2 === 0;
      const colCenterX = col * colWidth + colWidth / 2 - droneSize / 2;
      const startY = isDownward ? -droneSize : gridHeight;
      const endY = isDownward ? gridHeight : -droneSize;

      passes.push({
        x: colCenterX,
        y: endY,
        duration: 2500,
        easing: 'linear',
      });

      const hoverCount = config.hoverCount;
      for (let h = 0; h < hoverCount; h++) {
        const randomTile = tiles[Math.floor(Math.random() * tiles.length)];
        const tileRect = randomTile.getBoundingClientRect();
        const tileX = tileRect.left - containerRect.left + tileRect.width / 2 - droneSize / 2;
        const tileY = tileRect.top - containerRect.top - droneSize - 20;

        passes.push({
          x: tileX,
          y: tileY,
          duration: 350,
          easing: 'easeInOutQuad',
          isHover: true,
          tile: randomTile,
        });
      }
    }

    return passes;
  }

  function generatePerimeterPasses(gridWidth, gridHeight, droneSize, config, tiles, containerRect) {
    const passes = [];
    const padding = 40;
    const points = [
      { x: padding, y: padding, duration: 1500 },
      { x: gridWidth - padding, y: padding, duration: 1500 },
      { x: gridWidth - padding, y: gridHeight - padding, duration: 1500 },
      { x: padding, y: gridHeight - padding, duration: 1500 },
      { x: padding, y: padding, duration: 1500 },
    ];

    points.forEach((point, idx) => {
      passes.push({
        x: point.x - droneSize / 2,
        y: point.y - droneSize / 2,
        duration: point.duration,
        easing: 'easeInOutCubic',
      });

      if (idx < points.length - 1) {
        const randomTile = tiles[Math.floor(Math.random() * tiles.length)];
        const tileRect = randomTile.getBoundingClientRect();
        const tileX = tileRect.left - containerRect.left + tileRect.width / 2 - droneSize / 2;
        const tileY = tileRect.top - containerRect.top - droneSize - 20;

        passes.push({
          x: tileX,
          y: tileY,
          duration: 300,
          easing: 'easeInOutQuad',
          isHover: true,
          tile: randomTile,
        });
      }
    });

    return passes;
  }
})();
