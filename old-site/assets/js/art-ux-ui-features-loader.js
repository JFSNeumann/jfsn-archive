/**
 * UX/UI Features Component Loader for art.html
 * Loads UX/UI features HTML components dynamically
 */

(function() {
  'use strict';
  
  const container = document.getElementById('ux-ui-features-section');
  if (!container) {
    // Create container if it doesn't exist
    const div = document.createElement('div');
    div.id = 'ux-ui-features-section';
    document.body.appendChild(div);
  }
  const targetContainer = document.getElementById('ux-ui-features-section');
  if (targetContainer) {
    fetch('components/ux-ui-features-2026.html')
      .then(response => response.text())
      .then(html => {
        targetContainer.innerHTML = html;
      })
      .catch(err => console.warn('Could not load UX/UI features components:', err));
  }
})();
