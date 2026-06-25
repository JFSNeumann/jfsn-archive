/* ambient-tint-parallax.js — scroll-coupled background color tint + static page identity

   Applies two-layer background to main content sections:
   1. Static base tint (page identity) — set via data-ambient-base attribute
   2. Dynamic scroll-coupled parallax shift (motion) — cycles through page-specific colors

   Each page defines its color palette via data-ambient-colors JSON on <main>.
   No palette → uses default. Respects prefers-reduced-motion.
   JS-off safe (static tint visible via CSS, parallax just JS enhancement). */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var mainContent = document.querySelector('main');
  if (!mainContent) return;

  // Parse page-specific color palette from data attribute
  // Format: data-ambient-colors='[{"h":28,"s":25,"l":92,"a":0.02},...]'
  var colorsJson = mainContent.getAttribute('data-ambient-colors');
  var colors = colorsJson ? JSON.parse(colorsJson) : [
    { h: 28, s: 25, l: 92, a: 0.02 },   // Default: warm brown
    { h: 200, s: 30, l: 88, a: 0.015 }, // Default: cool blue
    { h: 28, s: 20, l: 93, a: 0.01 }    // Default: neutral warm
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

  // Set initial background (first color in palette)
  var initialColor = colors[0];
  var initialBg = 'hsla(' + initialColor.h + ', ' + initialColor.s + '%, ' + initialColor.l + '%, ' + initialColor.a.toFixed(3) + ')';
  mainContent.style.backgroundColor = initialBg;

  window.addEventListener('scroll', onScroll, { passive: true });
})();
