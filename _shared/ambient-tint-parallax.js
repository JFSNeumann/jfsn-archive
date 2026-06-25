/* ambient-tint-parallax.js — scroll-coupled background color tint

   Applies subtle, scroll-coupled background color tint to main content
   sections on about.html and lost.html. As you scroll, the page tint
   shifts from warm to cool (archival brown → soft blue → back).

   No opt-in markup needed. Targets main > section elements. Respects
   prefers-reduced-motion. JS-off safe (no color applied via JS, subtle
   effect only). */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var mainContent = document.querySelector('main');
  if (!mainContent) return;

  // Define color palette for tinting: warm → cool → neutral
  // Using very subtle alpha values to preserve readability
  var colors = [
    { h: 28, s: 25, l: 92, a: 0.02 },   // Warm brown tint
    { h: 200, s: 30, l: 88, a: 0.015 }, // Cool blue tint
    { h: 28, s: 20, l: 93, a: 0.01 }    // Neutral warm
  ];

  var ticking = false;

  function updateTint() {
    var y = window.scrollY || window.pageYOffset || 0;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? y / docHeight : 0;

    // Cycle through colors over the page scroll
    var colorPhase = progress * colors.length;
    var colorIdx = Math.floor(colorPhase) % colors.length;
    var nextIdx = (colorIdx + 1) % colors.length;
    var t = colorPhase - colorIdx; // Blend factor (0-1)

    var c1 = colors[colorIdx];
    var c2 = colors[nextIdx];

    // Lerp between colors
    var h = c1.h + (c2.h - c1.h) * t;
    var s = c1.s + (c2.s - c1.s) * t;
    var l = c1.l + (c2.l - c1.l) * t;
    var a = c1.a + (c2.a - c1.a) * t;

    var color = 'hsla(' + Math.round(h) + ', ' + Math.round(s) + '%, ' + Math.round(l) + '%, ' + a.toFixed(3) + ')';
    mainContent.style.backgroundColor = color;

    ticking = false;
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateTint);
  }

  // Set initial background
  mainContent.style.backgroundColor = 'hsla(28, 25%, 92%, 0.02)';

  window.addEventListener('scroll', onScroll, { passive: true });
})();
