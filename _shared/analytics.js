/* analytics.js — Lightweight phase adoption tracking */

const Analytics = {
  enabled: true,
  endpoint: '/analytics',
  batchSize: 10,
  queue: [],
  sessionId: null,

  init() {
    // Only enable if not in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      this.enabled = false;
      return;
    }

    this.sessionId = this.generateSessionId();
    this.setupPhaseTracking();
    this.setupInteractionTracking();

    // Flush queue on page unload
    window.addEventListener('beforeunload', () => this.flush());
  },

  generateSessionId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  // Track Phase 1 features
  setupPhaseTracking() {
    // Lightbox
    document.addEventListener('click', (e) => {
      if (e.target.closest('.lightbox-open')) {
        this.track('phase1', 'lightbox_opened');
      }
    });

    // Scroll to top
    document.addEventListener('click', (e) => {
      if (e.target.closest('.scroll-to-top')) {
        this.track('phase1', 'scroll_to_top_clicked');
      }
    });

    // Search focus
    document.addEventListener('focus', (e) => {
      if (e.target.matches('#nav-search-input, .search-input')) {
        this.track('phase1', 'search_focused');
      }
    }, true);

    // Empty state view (archive)
    if (document.getElementById('empty-state')) {
      const observer = new MutationObserver(() => {
        const emptyState = document.getElementById('empty-state');
        if (emptyState && !emptyState.classList.contains('hidden')) {
          this.track('phase1', 'empty_state_shown');
        }
      });
      observer.observe(document.getElementById('empty-state'), {
        attributes: true,
        attributeFilter: ['class']
      });
    }
  },

  setupInteractionTracking() {
    // Phase 3: Scroll reveals
    document.addEventListener('reveal-visible', (e) => {
      this.track('phase3', 'scroll_reveal_triggered');
    });

    // Phase 3: Form validation
    document.addEventListener('submit', (e) => {
      if (e.target.hasAttribute('data-validate')) {
        this.track('phase3', 'form_submitted');
      }
    });

    // Phase 3: Page transitions
    if (window.PageTransitions) {
      window.addEventListener('beforeunload', () => {
        if (document.body.classList.contains('page-exiting')) {
          this.track('phase3', 'page_transition');
        }
      });
    }

    // Phase 4: Parallax
    if (document.querySelector('[data-parallax-speed]')) {
      window.addEventListener('scroll', () => {
        if (!this.parallaxTracked && window.pageYOffset > 100) {
          this.track('phase4', 'parallax_observed');
          this.parallaxTracked = true;
        }
      }, { passive: true, once: true });
    }

    // Phase 4: Swipe
    document.addEventListener('swipe', (e) => {
      this.track('phase4', `swipe_${e.detail.direction}`);
    });

    // Phase 4: Drag start
    document.addEventListener('drag-start', (e) => {
      this.track('phase4', 'drag_started');
    });

    // Phase 4: Long press
    document.addEventListener('long-press', (e) => {
      this.track('phase4', 'long_press_triggered');
    });

    // Phase 2: Toast
    if (window.Toast) {
      const originalShow = Toast.show;
      Toast.show = function(message, type, duration) {
        Analytics.track('phase2', `toast_${type}`);
        return originalShow.call(this, message, type, duration);
      };
    }
  },

  track(phase, action, metadata = {}) {
    if (!this.enabled) return;

    const event = {
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      phase,
      action,
      page: window.location.pathname,
      userAgent: navigator.userAgent.slice(0, 100),
      ...metadata
    };

    this.queue.push(event);

    // Auto-flush when batch size reached
    if (this.queue.length >= this.batchSize) {
      this.flush();
    }
  },

  flush() {
    if (!this.enabled || this.queue.length === 0) return;

    const payload = JSON.stringify(this.queue);

    // Use sendBeacon for reliability (survives page unload)
    if (navigator.sendBeacon) {
      navigator.sendBeacon(this.endpoint, payload);
    } else {
      // Fallback to fetch
      fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true
      }).catch(() => {
        // Silently fail; analytics is non-critical
      });
    }

    this.queue = [];
  },

  // Utility: manual tracking
  trackEvent(phase, action) {
    this.track(phase, action);
    this.flush();
  }
};

// Initialize when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Analytics.init());
} else {
  Analytics.init();
}
