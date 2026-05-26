// Put at: /assets/js/page-loaded.js
// Purpose: flip on a class after the browser has a chance to lay out the page.
// This lets us delay some transforms/animations to reduce CLS.

(function () {
  function markLoaded() {
    document.documentElement.classList.add('page-loaded');
  }

  if (document.readyState === 'complete') {
    // Already loaded
    markLoaded();
    return;
  }

  window.addEventListener('load', function () {
    // One extra frame helps prevent a last-moment shift
    requestAnimationFrame(markLoaded);
  }, { once: true });
})();
