/* Monitoring & Analytics for jfsn.com
   Tracks: uptime, favorites, theme views, performance
   Uses: GoatCounter (existing) + localStorage + fetch
*/

(function() {
  'use strict';

  // ─── TRACK 1: Favorite button analytics ───────────────────────────────
  window.trackFavorite = function(artId, action) {
    // Log to GoatCounter
    if (window.goat && window.goat.count) {
      window.goat.count({
        path: '/event/favorite/' + action + '/' + artId,
        title: 'Favorite ' + action.toUpperCase() + ': ' + artId,
        referrer: window.location.pathname
      });
    }

    // Also log to localStorage for local stats
    var favoriteLog = JSON.parse(localStorage.getItem('jfsn-favorite-log') || '[]');
    favoriteLog.push({
      artId: artId,
      action: action, // 'add' or 'remove'
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('jfsn-favorite-log', JSON.stringify(favoriteLog));
  };

  // ─── TRACK 2: Theme/series view analytics ──────────────────────────
  window.trackThemeView = function() {
    var pageTheme = document.body.dataset.theme;
    var pageMedium = document.body.dataset.medium;

    if (pageTheme || pageMedium) {
      var category = pageTheme || pageMedium || 'unknown';
      if (window.goat && window.goat.count) {
        window.goat.count({
          path: '/view/category/' + category,
          title: 'View: ' + category,
          referrer: window.location.pathname
        });
      }

      // Also track locally
      var themeLog = JSON.parse(localStorage.getItem('jfsn-theme-log') || '{}');
      themeLog[category] = (themeLog[category] || 0) + 1;
      localStorage.setItem('jfsn-theme-log', JSON.stringify(themeLog));
    }
  };

  // ─── TRACK 3: Keyboard shortcut usage ──────────────────────────────
  window.trackKeyboardShortcut = function(key) {
    if (window.goat && window.goat.count) {
      window.goat.count({
        path: '/event/keyboard/' + key,
        title: 'Keyboard: ' + key,
        referrer: window.location.pathname
      });
    }
  };

  // ─── TRACK 4: Performance metrics ──────────────────────────────────
  if (window.PerformanceObserver && window.goat) {
    try {
      var observer = new PerformanceObserver(function(list) {
        for (var entry of list.getEntries()) {
          if (entry.name.includes('LCP') || entry.name.includes('FCP')) {
            window.goat.count({
              path: '/perf/' + entry.name,
              title: 'Performance: ' + entry.name + ' ' + Math.round(entry.startTime) + 'ms',
              referrer: window.location.pathname,
              no_session: true
            });
          }
        }
      });
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-contentful-paint'] });
    } catch (e) {
      // Observer not supported
    }
  }

  // ─── TRACK 5: Auto-track theme view on page load ──────────────────
  window.addEventListener('load', function() {
    setTimeout(trackThemeView, 100);
  });

  // ─── EXPOSE LOCAL STATS for debugging ──────────────────────────────
  window.getLocalStats = function() {
    return {
      favorites: JSON.parse(localStorage.getItem('jfsn-favorite-log') || '[]'),
      themes: JSON.parse(localStorage.getItem('jfsn-theme-log') || '{}'),
      session: {
        startTime: sessionStorage.getItem('jfsn-session-start') || new Date().toISOString(),
        pageViews: sessionStorage.getItem('jfsn-page-views') || 0
      }
    };
  };

  // ─── UPTIME CHECK (call from external service) ──────────────────────
  window.healthCheck = function() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      url: window.location.href,
      performance: {
        memory: performance.memory ? performance.memory.usedJSHeapSize : 'n/a',
        navigation: performance.getEntriesByType('navigation')[0]
      }
    };
  };

})();
