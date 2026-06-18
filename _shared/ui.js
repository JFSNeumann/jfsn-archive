/* ui.js — shared interaction enhancements */

(function () {
  'use strict';

  // ─── Vertical "you are here" label ───────────────────────────────────────
  const label = document.body.dataset.pageLabel;
  if (label) {
    const el = document.createElement('div');
    el.className = 'page-label-vert';
    el.textContent = label;
    document.body.appendChild(el);
  }

  // ─── Mobile menu button state ───────────────────────────────────────────
  const menuBtn = document.getElementById('nav-menu-btn');
  const menuDrawer = document.getElementById('mobile-menu-drawer');
  const menuBackdrop = document.getElementById('mobile-menu-backdrop');
  const menuClose = document.getElementById('nav-menu-close');

  if (menuBtn && menuDrawer) {
    const toggleMenu = function(open) {
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuDrawer.parentElement.style.display = open ? 'block' : 'none';
    };

    menuBtn.addEventListener('click', () => {
      const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
      toggleMenu(!isOpen);
    });

    if (menuClose) {
      menuClose.addEventListener('click', () => toggleMenu(false));
    }
    if (menuBackdrop) {
      menuBackdrop.addEventListener('click', () => toggleMenu(false));
    }
  }

  // ─── Phase C 14: Mobile swipe gesture feedback ──────────────────────────
  // Decade pages: swipe left/right to navigate, haptic on slide-end
  var touchStartX = 0;
  var touchEndX = 0;

  document.addEventListener('touchstart', function(e) {
    if (e.touches && e.touches.length > 0) {
      touchStartX = e.touches[0].clientX;
    }
  }, { passive: true });

  document.addEventListener('touchend', function(e) {
    if (e.changedTouches && e.changedTouches.length > 0) {
      touchEndX = e.changedTouches[0].clientX;
      handleSwipe();
    }
  }, { passive: true });

  function handleSwipe() {
    var diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) { // 50px threshold
      if (diff > 0) { // swipe left → next
        var nextEl = document.querySelector('[data-next-decade]');
        if (nextEl) {
          if (navigator.vibrate) navigator.vibrate([10, 5, 10]);
          setTimeout(function() { window.location.href = nextEl.href; }, 50);
        }
      } else { // swipe right → prev
        var prevEl = document.querySelector('[data-prev-decade]');
        if (prevEl) {
          if (navigator.vibrate) navigator.vibrate([10, 5, 10]);
          setTimeout(function() { window.location.href = prevEl.href; }, 50);
        }
      }
    }
  }

  // ─── Keyboard navigation ─────────────────────────────────────────────────
  // Decade pages: ← / → between decades
  // Visual feedback: brief label shows destination
  document.addEventListener('keydown', function (e) {
    // Don't fire when user is typing in an input/textarea
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    const showNavHint = function(label) {
      // Briefly flash a label when keyboard nav is pressed
      let hint = document.getElementById('decade-nav-hint');
      if (!hint) {
        hint = document.createElement('div');
        hint.id = 'decade-nav-hint';
        hint.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-family:Inter,sans-serif;font-size:14px;font-weight:600;letter-spacing:0.05em;color:#FF6600;pointer-events:none;z-index:100;opacity:0;transition:opacity 0.2s ease;';
        document.body.appendChild(hint);
      }
      hint.textContent = label;
      hint.style.opacity = '1';
      clearTimeout(hint._timeout);
      hint._timeout = setTimeout(() => {
        hint.style.opacity = '0';
      }, 600);
    };

    if (e.key === 'ArrowLeft') {
      const el = document.querySelector('[data-prev-decade]');
      if (el) {
        e.preventDefault();
        showNavHint('← ' + (el.textContent || 'Previous'));
        setTimeout(() => { window.location.href = el.href; }, 200);
      }
    }
    if (e.key === 'ArrowRight') {
      const el = document.querySelector('[data-next-decade]');
      if (el) {
        e.preventDefault();
        showNavHint((el.textContent || 'Next') + ' →');
        setTimeout(() => { window.location.href = el.href; }, 200);
      }
    }
  });

  // ─── Hero Scroll Animation: Refined zoom-out + color shift ──────────────
  // Heading scales and fades as hero scrolls away, with subtle color shift
  const hero    = document.querySelector('.decade-hero');
  const heading = document.querySelector('.decade-heading');

  if (hero && heading) {
    const onScroll = function () {
      const rect     = hero.getBoundingClientRect();
      const heroH    = hero.offsetHeight;
      // progress: 0 = hero fully visible, 1 = hero fully scrolled past
      const progress = Math.max(0, Math.min(1, -rect.top / heroH));

      // Enhanced refinement: smoother easing curve
      const easeProgress = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const scale    = 1 + easeProgress * 0.28; // zoom-out
      const opacity  = 1 - easeProgress * 1.4; // fade
      const blur     = easeProgress * 2; // subtle blur as it scales

      heading.style.transform = `scale(${scale}) blur(${blur}px)`;
      heading.style.opacity = Math.max(0, opacity);
    };

    // Only run if reduced-motion is not set
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll(); // init
    }
  }

  // ─── Toast notification system ──────────────────────────────────────────
  // Usage: window.showToast('Copied!', 2000, 'success')
  // Types: 'success' (green), 'error' (red), 'info' (blue), or default (neutral)
  window.showToast = function(message, duration = 3000, type = 'info') {
    let container = document.getElementById('jfsn-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'jfsn-toast-container';
      container.style.cssText = 'pointer-events:none;';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    // Phase D 17: Toast slide-in animation (CSS-driven)
    // Auto-remove and slide-out
    setTimeout(() => {
      toast.classList.add('exit');
      setTimeout(() => toast.remove(), 200);
    }, duration);
  };

  // Respect prefers-reduced-motion for toast animations
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const origToast = window.showToast;
    window.showToast = function(message, duration = 3000, type = 'info') {
      let container = document.getElementById('jfsn-toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'jfsn-toast-container';
        container.style.cssText = 'pointer-events:none;';
        document.body.appendChild(container);
      }
      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      toast.textContent = message;
      toast.style.animation = 'none';
      container.appendChild(toast);
      setTimeout(() => toast.remove(), duration);
    };
  }

  // ─── Scroll-to-section flash highlight ──────────────────────────────────
  // When a TOC link is clicked, briefly highlight the target section
  document.addEventListener('click', function(e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var targetId = link.getAttribute('href').substring(1);
    var section = document.getElementById(targetId);
    if (!section) return;

    // Add brief highlight
    section.style.transition = 'background-color 0.3s ease';
    var origBg = section.style.backgroundColor || '';
    section.style.backgroundColor = 'rgba(142, 113, 100, 0.08)';
    setTimeout(function() {
      section.style.backgroundColor = origBg;
    }, 600);
  });

  // ─── Lazy-load image fade-in + dominant color placeholder ─────────────
  var lazyImages = document.querySelectorAll('img[loading="lazy"]');
  lazyImages.forEach(function(img) {
    // Get dominant color from data attribute if available
    var dominantColor = img.dataset.dominantColor || '#f3f0ea';
    img.style.backgroundColor = dominantColor;

    // Trigger fade-in when image loads
    if (img.complete) {
      // Image already loaded (cached)
      img.classList.add('jfsn-loaded');
    } else {
      img.addEventListener('load', function() {
        img.classList.add('jfsn-loaded');
      });
      // Fallback: fade in after 1s even if load doesn't fire
      setTimeout(function() {
        if (!img.classList.contains('jfsn-loaded')) {
          img.classList.add('jfsn-loaded');
        }
      }, 1000);
    }
  });

  // ─── Search icon pulse hint on first visit ──────────────────────────────
  // Show users the search feature with a gentle pulse (once per session)
  var searchBtn = document.getElementById('nav-search-btn');
  if (searchBtn && !sessionStorage.getItem('jfsn-search-seen')) {
    // Add pulse animation after page settles (2s delay)
    setTimeout(function() {
      searchBtn.classList.add('hint-pulse');
      // Remove after animation completes (4s = 2 loops of 2s each)
      setTimeout(function() {
        searchBtn.classList.remove('hint-pulse');
        sessionStorage.setItem('jfsn-search-seen', 'true');
      }, 4500);
    }, 2000);
  }

  // ─── Keyboard Shortcuts Documentation Overlay ──────────────────────────
  // P/N: prev/next work, ←→: decade nav, ?: show shortcuts
  var keyboardShortcutsModal = null;

  function showKeyboardShortcuts() {
    if (keyboardShortcutsModal && keyboardShortcutsModal.style.display === 'flex') return; // Already open

    keyboardShortcutsModal = document.createElement('div');
    keyboardShortcutsModal.id = 'keyboard-shortcuts-modal';
    keyboardShortcutsModal.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      backdrop-filter: blur(4px);
    `;

    const content = document.createElement('div');
    content.style.cssText = `
      background: white;
      border: 1px solid #8e7164;
      padding: 32px;
      border-radius: 4px;
      max-width: 500px;
      max-height: 80vh;
      overflow-y: auto;
      animation: reveal-fade-in 0.3s ease-out;
    `;

    content.innerHTML = `
      <h2 style="font-family: 'Playfair Display', serif; font-size: 28px; margin: 0 0 24px; color: #0B0B0B;">Keyboard Shortcuts</h2>

      <div style="font-size: 12px; line-height: 1.8;">
        <h3 style="font-family: Inter; font-weight: 600; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #8e7164; margin: 16px 0 8px;">Artwork Pages</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #e3bfb1;">
            <td style="padding: 8px 0; font-weight: 600; color: #0B0B0B; width: 80px;">P</td>
            <td style="padding: 8px 0; color: #575757;">Previous work</td>
          </tr>
          <tr style="border-bottom: 1px solid #e3bfb1;">
            <td style="padding: 8px 0; font-weight: 600; color: #0B0B0B;">N</td>
            <td style="padding: 8px 0; color: #575757;">Next work</td>
          </tr>
        </table>

        <h3 style="font-family: Inter; font-weight: 600; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #8e7164; margin: 16px 0 8px;">Decade Pages</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #e3bfb1;">
            <td style="padding: 8px 0; font-weight: 600; color: #0B0B0B; width: 80px;">← →</td>
            <td style="padding: 8px 0; color: #575757;">Navigate decades</td>
          </tr>
        </table>

        <h3 style="font-family: Inter; font-weight: 600; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #8e7164; margin: 16px 0 8px;">General</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #e3bfb1;">
            <td style="padding: 8px 0; font-weight: 600; color: #0B0B0B; width: 80px;">?</td>
            <td style="padding: 8px 0; color: #575757;">Show this help</td>
          </tr>
        </table>
      </div>

      <p style="font-size: 10px; color: #8e7164; margin-top: 24px; margin-bottom: 0;">Press ESC to close</p>
    `;

    keyboardShortcutsModal.appendChild(content);
    document.body.appendChild(keyboardShortcutsModal);

    // Close on ESC
    var closeHandler = function(e) {
      if (e.key === 'Escape') {
        keyboardShortcutsModal.remove();
        document.removeEventListener('keydown', closeHandler);
      }
    };
    document.addEventListener('keydown', closeHandler);

    // Close on backdrop click
    keyboardShortcutsModal.addEventListener('click', function(e) {
      if (e.target === keyboardShortcutsModal) {
        keyboardShortcutsModal.remove();
      }
    });
  }

  document.addEventListener('keydown', function(e) {
    // Don't fire when user is typing in input/textarea
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    // P = previous work
    if (e.key === 'p' || e.key === 'P') {
      var prevLink = document.querySelector('a[href$=".html"][href*="art"][href*="../"]');
      if (prevLink && prevLink.textContent.includes('PREVIOUS')) {
        e.preventDefault();
        prevLink.click();
      }
    }

    // N = next work
    if (e.key === 'n' || e.key === 'N') {
      var nextLink = document.querySelector('a[href$=".html"][href*="art"][href*="../"]');
      if (nextLink && nextLink.textContent.includes('NEXT')) {
        e.preventDefault();
        var allLinks = Array.from(document.querySelectorAll('a[href$=".html"][href*="art"][href*="../"]'));
        nextLink = allLinks[allLinks.length - 1];
        if (nextLink) nextLink.click();
      }
    }

    // ? = show keyboard shortcuts help
    // DISABLED: using keyboard-shortcuts.js implementation instead
    // if (e.key === '?') {
    //   e.preventDefault();
    //   showKeyboardShortcuts();
    // }
  });

  // ─── Number counter animation (homepage hero) ─────────────────────────
  // Count up "1,084 works" on page load
  var counter = document.querySelector('[data-counter]');
  if (counter && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var target = parseInt(counter.dataset.counter) || 1084;
    var duration = 1500; // 1.5s
    var startTime = Date.now();
    var animate = function() {
      var elapsed = Date.now() - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var current = Math.floor(progress * target);
      counter.textContent = current.toLocaleString();
      if (progress < 1) requestAnimationFrame(animate);
      else {
        // Counter finished — add completion pulse (Phase 2 #10)
        counter.classList.add('pulse-complete');
        setTimeout(function() {
          counter.classList.remove('pulse-complete');
        }, 300);
      }
    };
    // Start after page settles
    setTimeout(animate, 300);
  }

  // ─── Keyboard shortcut hints on pages ────────────────────────────────
  var artworkNav = document.querySelector('nav[aria-label="Adjacent works"]');
  if (artworkNav) {
    var hint = document.createElement('div');
    hint.style.cssText = 'font-family:Inter,sans-serif;font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:#8e7164;margin-top:8px;';
    hint.textContent = '💡 P/N to navigate · ← → for decade';
    artworkNav.parentElement.appendChild(hint);
  }

  // ─── Scroll position indicator on long pages ─────────────────────────
  var sections = document.querySelectorAll('section[id], [id^="section"], [id^="part"]');
  if (sections.length > 3) {
    var indicator = document.createElement('div');
    indicator.id = 'scroll-indicator';
    indicator.className = 'visible';
    document.body.appendChild(indicator);

    window.addEventListener('scroll', function() {
      var current = 1;
      for (var i = 0; i < sections.length; i++) {
        var rect = sections[i].getBoundingClientRect();
        if (rect.top < window.innerHeight / 2) current = i + 1;
      }
      indicator.textContent = 'Section ' + current + ' of ' + sections.length;
    }, { passive: true });
  }

  // ─── Favorite functionality (localStorage) ──────────────────────────
  window.toggleFavorite = function(artId) {
    var favorites = JSON.parse(localStorage.getItem('jfsn-favorites') || '[]');
    var btn = document.querySelector('.favorite-btn');
    var isFavorited = favorites.includes(artId);
    var action = isFavorited ? 'remove' : 'add';

    if (isFavorited) {
      favorites = favorites.filter(function(id) { return id !== artId; });
      if (btn) btn.classList.remove('is-favorited');
    } else {
      favorites.push(artId);
      if (btn) {
        btn.classList.add('is-favorited');
        btn.classList.add('pulse');
        setTimeout(function() { btn.classList.remove('pulse'); }, 400);
      }
    }
    localStorage.setItem('jfsn-favorites', JSON.stringify(favorites));
    window.showToast(action === 'add' ? 'Added to favorites' : 'Removed from favorites');

    // Track analytics
    if (window.trackFavorite) {
      window.trackFavorite(artId, action);
    }
  };

  // Restore favorite state on page load
  var favBtn = document.querySelector('.favorite-btn');
  if (favBtn) {
    var artId = favBtn.dataset.artId;
    var favorites = JSON.parse(localStorage.getItem('jfsn-favorites') || '[]');
    if (favorites.includes(artId)) {
      favBtn.classList.add('is-favorited');
    }
  }

  // ─── Link destination previews (footer links) ───────────────────────
  var footerLinks = document.querySelectorAll('footer a[href]:not([href^="#"])');
  footerLinks.forEach(function(link) {
    var href = link.getAttribute('href');
    var title = link.textContent.trim();
    link.setAttribute('data-link-title', title);
  });

  // ─── Phase 1: Metadata rows stagger (Session 52 #2) ─────────────────────
  var aside = document.querySelector('aside.md\\:col-span-4');
  if (aside) {
    var metadataRows = aside.querySelectorAll('.grid.grid-cols-3');
    metadataRows.forEach(function(row, idx) {
      row.style.animationDelay = (idx * 0.1) + 's';
    });
  }

  // ─── Phase 1: Related works IntersectionObserver (Session 52 #4) ────────
  var relatedWorksSection = null;
  document.querySelectorAll('div.grid').forEach(function(el) {
    if (el.querySelector('h3') && el.textContent.includes('Related Works')) {
      relatedWorksSection = el;
    }
  });
  if (relatedWorksSection && 'IntersectionObserver' in window) {
    relatedWorksSection.classList.add('related-works');
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting && !entry.target.classList.contains('in-view')) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    observer.observe(relatedWorksSection);
  }

  // ─── Phase 4.6: Page transition direction feedback (artwork.html nav) ─────
  // Slide-left for previous, slide-right for next — directional feedback
  var adjNavBtns = document.querySelectorAll('a[data-direction]');
  adjNavBtns.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      var direction = this.getAttribute('data-direction');
      var href = this.getAttribute('href');
      var main = document.querySelector('main');
      if (!main || !href) return;

      e.preventDefault();

      // Determine animation direction: opposite of navigation direction
      // (prev navigates left, so we slide out left; next navigates right, so we slide out right)
      var outClass = direction === 'prev' ? 'page-exiting-left' : 'page-exiting-right';

      main.classList.add(outClass);
      setTimeout(function() {
        window.location.href = href;
      }, 250);
    });
  });

  // ─── Phase 2: Favorite heart rotation on click (Session 52 #9) ────────
  var favBtn = document.querySelector('.favorite-btn');
  if (favBtn) {
    favBtn.addEventListener('click', function() {
      this.classList.add('rotating');
      setTimeout(function(btn) {
        return function() { btn.classList.remove('rotating'); };
      }(this), 300);
    });
  }

  // ─── Phase 2: Page transition fade on P/N navigation (Session 52 #7) ───
  // Intercept prev/next work navigation with fade transition
  document.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    // P = previous work
    if (e.key === 'p' || e.key === 'P') {
      var prevLink = document.querySelector('a[href$=".html"][href*="art"][href*="../"]');
      if (prevLink && prevLink.textContent.includes('PREVIOUS')) {
        e.preventDefault();
        document.documentElement.classList.add('page-fade-out');
        setTimeout(function() {
          prevLink.click();
        }, 200);
      }
    }

    // N = next work
    if (e.key === 'n' || e.key === 'N') {
      var allLinks = Array.from(document.querySelectorAll('a[href$=".html"][href*="art"][href*="../"]'));
      var nextLink = allLinks[allLinks.length - 1];
      if (nextLink && nextLink.textContent.includes('NEXT')) {
        e.preventDefault();
        document.documentElement.classList.add('page-fade-out');
        setTimeout(function() {
          nextLink.click();
        }, 200);
      }
    }
  });

  // ─── Phase 2: Theme color transitions (Session 52 #8) ─────────────────
  // Already CSS-driven via header nav a::after with background-color transition

  // ─── Header collapse on scroll (Session 52 Enhancement) ────────────────
  // Hide header on scroll down, show on scroll up
  var header = document.querySelector('header');
  if (header) {
    var lastScrollY = 0;
    var ticking = false;

    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(function() {
          var currentScrollY = window.scrollY;

          if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Scrolling down, hide header
            header.classList.add('header-hidden');
          } else {
            // Scrolling up or near top, show header
            header.classList.remove('header-hidden');
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ─── Scroll-Reveal: Fade-in sections as they enter viewport ──────────────
  // Elements with .reveal-on-scroll animate in when they scroll into view
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(function(el, i) {
      el.style.animationPlayState = 'paused';
      el.style.setProperty('--reveal-delay', (i * 0.05) + 's');
      observer.observe(el);
    });
  }

  // Artwork thumbnails are full color always — no mask-image, no scroll-reveal.
  // (Removed session 8; banned — do not re-add.)

  // ─── TIER 1-3: Page Transition Loader ─────────────────────────────────────
  // Shows progress bar on page navigation
  (function() {
    let loader = document.getElementById('page-transition-loader');
    if (!loader) {
      loader = document.createElement('div');
      loader.id = 'page-transition-loader';
      document.body.insertBefore(loader, document.body.firstChild);
    }

    // Intercept link clicks to show loader
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a');
      if (link && link.href && !link.target && link.href.includes(window.location.origin)) {
        loader.classList.add('active');
        setTimeout(() => {
          loader.classList.add('complete');
          loader.classList.remove('active');
        }, 500);
      }
    }, true);
  })();

  // ─── TIER 2: Lazy-Load Image Fade-In Enhancement ──────────────────────────
  // Fade in images as they load
  (function() {
    if ('IntersectionObserver' in window) {
      const lazyImages = document.querySelectorAll('img[loading="lazy"]');
      lazyImages.forEach(img => {
        const originalSrc = img.src;
        img.addEventListener('load', function() {
          this.classList.add('loaded');
        });
        // Mark as loaded if already cached
        if (img.complete) {
          img.classList.add('loaded');
        }
      });
    }
  })();

  // ─── TIER 2: Keyboard Shortcut Hints ─────────────────────────────────────
  // Add hints to interactive elements showing keyboard shortcuts
  (function() {
    const hints = {
      '#nav-search-btn': '⌘K',
      '#mobile-menu-btn': 'ESC to close',
      '[href*="archive"]': 'A',
      '[href*="start-here"]': 'S'
    };

    Object.entries(hints).forEach(([selector, hint]) => {
      const el = document.querySelector(selector);
      if (el && !el.dataset.shortcutHint) {
        el.setAttribute('data-shortcut-hint', hint);
      }
    });
  })();

  // ─── TIER 2: Archive Filter Presets ────────────────────────────────────────
  // Add "Most Popular", "Recent", "Random" filter preset buttons
  (function() {
    const archivePage = document.querySelector('[data-page-label="archive"]');
    if (!archivePage) return;

    const filterChipsContainer = document.getElementById('filter-chips');
    if (!filterChipsContainer) return;

    // Create presets UI
    const presetsDiv = document.createElement('div');
    presetsDiv.id = 'filter-presets';
    presetsDiv.style.cssText = 'display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;';
    presetsDiv.innerHTML = `
      <span style="font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#575757;align-self:center;">Quick filters:</span>
      <button class="filter-preset-btn" data-preset="popular">Most Popular</button>
      <button class="filter-preset-btn" data-preset="recent">Recent Additions</button>
      <button class="filter-preset-btn filter-preset-random" data-preset="random">🎲 Random</button>
    `;
    filterChipsContainer.parentElement.insertBefore(presetsDiv, filterChipsContainer);

    // Wire preset buttons
    presetsDiv.querySelectorAll('.filter-preset-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const preset = this.dataset.preset;
        if (window.applyFilterPreset) {
          window.applyFilterPreset(preset);
        }
      });
    });
  })();

  // ─── TIER 2: Related Works Smart Loading ──────────────────────────────────
  // Show related works in batches with "Show more" button
  (function() {
    const relatedList = document.getElementById('related-works-list');
    if (!relatedList) return;

    const items = relatedList.querySelectorAll('.related-work-card');
    if (items.length <= 3) return;

    // Hide items after third
    items.forEach((item, i) => {
      if (i >= 3) {
        item.style.display = 'none';
        item.classList.add('related-works-item');
      }
    });

    // Add "Show more" button
    const showMoreBtn = document.createElement('button');
    showMoreBtn.className = 'related-works-show-more';
    showMoreBtn.textContent = `+ Show ${items.length - 3} more`;
    showMoreBtn.style.marginTop = '12px';
    relatedList.parentElement.insertBefore(showMoreBtn, relatedList.nextElementSibling);

    let expanded = false;
    showMoreBtn.addEventListener('click', function() {
      if (expanded) {
        items.forEach((item, i) => {
          if (i >= 3) item.style.display = 'none';
        });
        showMoreBtn.textContent = `+ Show ${items.length - 3} more`;
        expanded = false;
      } else {
        items.forEach(item => {
          item.style.display = 'block';
        });
        showMoreBtn.textContent = '- Show less';
        expanded = true;
      }
    });
  })();

  // ─── TIER 3: Favorite Count Animation ──────────────────────────────────────
  // Pulse animation when favorite count changes
  (function() {
    window.animateFavoriteCount = function(element) {
      if (!element) return;
      element.classList.add('incrementing');
      setTimeout(() => {
        element.classList.remove('incrementing');
      }, 300);
    };
  })();

  // ─── TIER 3: Keyboard Shortcut Palette Activation ────────────────────────
  // ESC dismisses modals, common shortcuts highlighted
  (function() {
    document.addEventListener('keydown', function(e) {
      // ESC closes modals
      if (e.key === 'Escape') {
        const modals = document.querySelectorAll('[id*="modal"]');
        modals.forEach(m => {
          if (m.style.display === 'block') {
            m.style.display = 'none';
          }
        });
      }
      // ⌘K or Ctrl+K opens search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchBtn = document.getElementById('nav-search-btn');
        if (searchBtn) searchBtn.click();
      }
    });
  })();

})();
