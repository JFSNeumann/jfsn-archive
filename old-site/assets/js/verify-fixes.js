/**
 * Verify Fixes Uploaded
 * Checks if critical fixes are on server
 */

(function() {
  'use strict';
  
  const results = document.getElementById('results');
  if (!results) return;
  
  const checks = [
    {
      file: '/assets/js/debug-utils.js',
      check: 'let localStorageDebug = false',
      name: 'debug-utils.js (localStorage fix)'
    },
    {
      file: '/assets/js/navbar-loader.js',
      check: 'AbortController',
      name: 'navbar-loader.js (AbortController timeout)'
    },
    {
      file: '/assets/js/hamburger-menu-fix.js',
      check: 'overlay.style.opacity = \'0\'',
      name: 'hamburger-menu-fix.js (overlay starts closed)'
    },
    {
      file: '/assets/js/image-fallback-handler.js',
      check: 'data-fallback',
      name: 'image-fallback-handler.js (NEW file)'
    }
  ];
  
  let checked = 0;
  let passed = 0;
  
  checks.forEach((check, index) => {
    const div = document.createElement('div');
    div.className = 'check';
    div.textContent = `Checking ${check.name}...`;
    results.appendChild(div);
    
    fetch(check.file + '?v=' + Date.now())
      .then(response => {
        if (!response.ok) {
          div.className = 'check fail';
          div.textContent = `❌ ${check.name} - NOT FOUND (${response.status})`;
          checked++;
          return;
        }
        return response.text();
      })
      .then(text => {
        checked++;
        if (text && text.includes(check.check)) {
          div.className = 'check pass';
          div.textContent = `✅ ${check.name} - FIX PRESENT`;
          passed++;
        } else {
          div.className = 'check fail';
          div.textContent = `❌ ${check.name} - FIX NOT FOUND (old version?)`;
        }
        
        if (checked === checks.length) {
          const summary = document.createElement('div');
          summary.className = 'check ' + (passed === checks.length ? 'pass' : 'fail');
          summary.style.marginTop = '20px';
          summary.style.fontWeight = 'bold';
          summary.textContent = `Summary: ${passed}/${checks.length} fixes found on server`;
          results.appendChild(summary);
        }
      })
      .catch(error => {
        checked++;
        div.className = 'check fail';
        div.textContent = `❌ ${check.name} - ERROR: ${error.message}`;
        
        if (checked === checks.length) {
          const summary = document.createElement('div');
          summary.className = 'check fail';
          summary.style.marginTop = '20px';
          summary.style.fontWeight = 'bold';
          summary.textContent = `Summary: ${passed}/${checks.length} fixes found on server`;
          results.appendChild(summary);
        }
      });
  });
})();
