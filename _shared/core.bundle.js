/* GENERATED FILE — do not edit directly.
   Bundle: core.bundle.js — universal, all 38 pages
   Source: each section below is copied verbatim from its own file in
   _shared/ (or repo root). To change behavior, edit that source file,
   then regenerate with `npm run build:js`. Hand-editing this file will
   be silently overwritten on the next build.
   See BUNDLE_PLAN.md for why this exact file list and order. */

/* ===== _shared/ui.js ===== */
/* ui.js — shared interaction enhancements */

(function () {
  'use strict';

  // NOTE (Phase 1 cleanup): The old "disable keyboard-shortcuts modal" block
  // was removed here. The modal markup it suppressed no longer exists on any
  // page, its `el.style.x = '... !important'` lines were no-ops (the CSSOM
  // property setter ignores `!important`), and its capture-phase `?` handler
  // called stopPropagation() — which silently prevented search.js's real
  // shortcuts overlay (bubble-phase, search.js:284) from ever opening.

  // ─── Vertical "you are here" label ───────────────────────────────────────
  const label = document.body.dataset.pageLabel;
  if (label) {
    const el = document.createElement('div');
    el.className = 'page-label-vert';
    el.textContent = label;
    document.body.appendChild(el);
  }

  // NOTE (Phase 1 cleanup): A duplicate mobile-menu open/close handler lived
  // here. It bound the SAME #nav-menu-btn / #nav-menu-close / #mobile-menu-backdrop
  // elements as the canonical handler in _shared/top-nav.html, and opened the
  // drawer a different way (toggling parentElement display vs. the translateX
  // slide + body-scroll-lock + focus management in top-nav.html). The two
  // fought each other. The top-nav.html handler is the single source of truth.
  //
  // The removed block was also the only code keeping the hamburger's
  // aria-expanded in sync. That is now handled directly by the canonical
  // handler in _shared/top-nav.html: the button ships aria-expanded="false" in
  // markup, and openMenu()/closeMenu() set it to 'true'/'false'. No mirroring
  // needed here. (Phase 1 review regression fix.)

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

      // One-time orange light-sweep over the heading on load. A duplicate
      // of the heading, colored orange, is layered exactly on top of the
      // real heading and revealed left-to-right via clip-path, then swept
      // onward until fully hidden again — the real heading underneath is
      // untouched throughout, so this can only ever sit on top of it, never
      // replace or blank it. Independent of the scroll transform above
      // (that animates `transform`/`opacity` on the real heading; this
      // animates `clip-path` on a separate absolutely-positioned clone).
      if (window.anime) {
        const sweep = heading.cloneNode(true);
        sweep.classList.add('decade-heading-sweep');
        sweep.removeAttribute('id');
        heading.insertAdjacentElement('afterend', sweep);
        anime({
          targets: sweep,
          clipPath: [
            'inset(0% 100% 0% 0%)',
            'inset(0% 0% 0% 0%)',
            'inset(0% 0% 0% 100%)'
          ],
          easing: 'easeInOutQuad',
          duration: 1100,
          delay: 150,
          complete: () => sweep.remove()
        });
      }
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
  // DISABLED: Critical bug - modal auto-opens and won't close
  // Duplicate implementations caused state conflicts
  // Will be re-enabled after consolidation and fix (Session 67+)
  // See: Session 66 final summary for investigation details
  /*
  var keyboardShortcutsModal = null;

  function showKeyboardShortcuts() {
    // [DISABLED - 100+ lines of code removed]
  }
  */

  // NOTE (Phase 1 cleanup): A P/N keydown handler lived here that called
  // prevLink.click()/nextLink.click() with no transition. It duplicated the
  // richer handler further below (Session 52 #7) that adds the page-fade-out
  // transition before navigating. Because this earlier copy navigated
  // immediately, it pre-empted the fade version entirely. Removed; the
  // transition-aware handler below is the single source of truth.

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

  // NOTE (Phase 1 cleanup): A duplicate header-collapse scroll handler lived
  // here. _shared/top-nav.html already toggles `.header-hidden` on scroll AND
  // suppresses the hide while the mobile drawer is open (its `menuOpen` guard).
  // This copy lacked that guard, so it could hide the header with the drawer
  // open. The top-nav.html handler is the single source of truth.

  // ─── Scroll-Reveal: .reveal-section → .revealed on scroll into view ─────
  // Companion to ui.css's .reveal-section system (opacity:0 → scroll-reveal
  // keyframe). Previously owned by micro-interactions.js; restored here when
  // that file was removed (Session B, 2026-07-01).
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var revealSections = document.querySelectorAll('.reveal-section');
    if (revealSections.length) {
      var sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            sectionObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      revealSections.forEach(function(el) { sectionObserver.observe(el); });
    }
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

  // ─── Medium/series page title accent — draws in on scroll into view ──────
  // .medium-page__title is shared by Guernica/Crosses/etc. theme pages and
  // the medium browse pages (collage/sculpture/photography/painting). The
  // bar is fully visible by default (see ui.css) so it never depends on JS
  // for a correct resting state — this only adds a draw-in entrance.
  (function () {
    const title = document.querySelector('.medium-page__title');
    if (!title) return;

    const bar = document.createElement('span');
    bar.className = 'medium-page__title-accent';
    title.insertAdjacentElement('afterend', bar);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !window.anime || !('IntersectionObserver' in window)) return; // CSS keeps it fully visible

    bar.style.width = '0px';
    bar.style.opacity = '0';
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        anime({
          targets: bar,
          width: ['0px', '56px'],
          opacity: [0, 1],
          easing: 'easeOutQuad',
          duration: 500,
          delay: 150
        });
      });
    }, { threshold: 0.1 });
    observer.observe(title);
  })();

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

  // NOTE (Phase 1 cleanup): A second lazy-image fade-in loop lived here. It
  // added a `.loaded` class to the same images the block above already marks
  // with `.jfsn-loaded`. Both fades are also redundant with ui.css's
  // `img[loading="lazy"] { animation: image-fade-in … forwards }`, which fades
  // images in on its own. FOLLOW-UP (Phase 2 CSS pass): ui.css defines
  // `img[loading="lazy"]` twice with conflicting base rules (lines ~1685 and
  // ~2815, one transition-driven `.jfsn-loaded`, one animation-driven
  // `.loaded`); consolidate to one after visual verification.

  // ─── TIER 2: Keyboard Shortcut Hints ─────────────────────────────────────
  // Add hints to interactive elements showing keyboard shortcuts
  (function() {
    const hints = {
      '#nav-search-btn': '⌘K',
      '#mobile-menu-btn': 'ESC to close',
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

  // ─── Shared theme-page color map (used by the two background/footer fades) ──
  // Per-page tint, light + dark variants. Single source of truth — was
  // previously duplicated verbatim inside both IIFEs below (Phase 1 dedup).
  const JFSN_THEME_MAP = {
    'guernica.html':      { light: '#f5ccc0', dark: '#5a2018' }, // warm red/salmon
    'crosses.html':       { light: '#e6d5f5', dark: '#3a2a45' }, // purple
    'targets.html':       { light: '#fce4c5', dark: '#5a4410' }, // gold/yellow
    'framed.html':        { light: '#eee9e5', dark: '#4a4a4a' }, // neutral gray
    'torsos-faces.html':  { light: '#f5d0c8', dark: '#5a2835' }, // warm pink
    'mr-snowmann.html':   { light: '#d8ebf8', dark: '#1a3847' }, // cool blue
    'gallery-images.html':{ light: '#f5d0c0', dark: '#5a3820' }, // warm mixed
    'collaboration.html': { light: '#f5c8b8', dark: '#5a2818' }, // warm earth
    'collage.html':       { light: '#fce4c5', dark: '#5a4410' }, // warm gold
    'sculpture.html':     { light: '#d8ebf8', dark: '#1a3847' }, // cool gray/blue
    'photography.html':   { light: '#d8ebf8', dark: '#1a3847' }, // cool blue
    'painting.html':      { light: '#f5d0c0', dark: '#5a3820' }, // warm terra
    'about.html':         { light: '#ffe4cc', dark: '#664400' }, // warm orange
    'archive.html':       { light: '#ffe4cc', dark: '#664400' }  // warm orange
  };
  function jfsnThemeColor(isDark) {
    for (const [page, colors] of Object.entries(JFSN_THEME_MAP)) {
      if (document.location.pathname.includes(page)) {
        return isDark ? colors.dark : colors.light;
      }
    }
    return null;
  }

  // ─── Background Color Fade Animation (Option 1 + 2: Scroll + Hero) ─────────
  // Subtle page-specific background color animation: hero fade + scroll fade.
  // As hero exits viewport, background fades from neutral to theme color.
  // As user scrolls, background color intensity increases then decreases.
  // Respects dark mode (darker tints) and prefers-reduced-motion.
  (function() {
    if (!window.anime || !('IntersectionObserver' in window)) return;

    const isDarkMode = document.documentElement.classList.contains('dark');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const themeColor = jfsnThemeColor(isDarkMode);
    if (!themeColor) return; // Not a theme page

    const baseColor = isDarkMode ? '#1a1a1a' : '#fcf9f3';
    let currentBg = baseColor;

    // Option 2: Hero fade — background transitions as hero exits viewport
    const hero = document.querySelector('.medium-page__head, [class*="hero"]');
    if (hero && !reducedMotion) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          // Hero exits top of viewport
          if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
            if (currentBg === baseColor) {
              anime({
                targets: document.documentElement.style,
                backgroundColor: [baseColor, themeColor],
                easing: 'easeOutQuad',
                duration: 700,
                update: () => {
                  currentBg = window.getComputedStyle(document.documentElement).backgroundColor;
                }
              });
            }
          }
          // Hero re-enters viewport (scrolling back up)
          else if (entry.isIntersecting) {
            if (currentBg !== baseColor) {
              anime({
                targets: document.documentElement.style,
                backgroundColor: [themeColor, baseColor],
                easing: 'easeOutQuad',
                duration: 700,
                update: () => {
                  currentBg = window.getComputedStyle(document.documentElement).backgroundColor;
                }
              });
            }
          }
        });
      }, { threshold: 0.05 });

      observer.observe(hero);
    }

    // Option 1: Scroll fade — background shifts based on scroll progress
    if (!reducedMotion) {
      const main = document.querySelector('main');
      if (!main) return;

      let scrollAnimationActive = false;

      window.addEventListener('scroll', () => {
        const scrollProgress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);

        // Fade in from scroll start (0) to midpoint (0.3), then fade out to scroll end
        let intensity = 0;
        if (scrollProgress < 0.3) {
          intensity = scrollProgress / 0.3; // Ramp up to 30% scroll
        } else if (scrollProgress > 0.7) {
          intensity = (1 - scrollProgress) / 0.3; // Ramp down from 70% to 100%
        } else {
          intensity = 1; // Stay at max between 30-70%
        }

        // Blend: base color + theme color based on intensity
        const blendedColor = blendColors(baseColor, themeColor, Math.max(0, Math.min(1, intensity)));
        document.documentElement.style.backgroundColor = blendedColor;
      }, { passive: true });
    }

    // Helper: blend two RGB colors by percentage
    function blendColors(color1, color2, t) {
      const rgb1 = parseRGB(color1);
      const rgb2 = parseRGB(color2);
      if (!rgb1 || !rgb2) return color1;

      const r = Math.round(rgb1[0] + (rgb2[0] - rgb1[0]) * t);
      const g = Math.round(rgb1[1] + (rgb2[1] - rgb1[1]) * t);
      const b = Math.round(rgb1[2] + (rgb2[2] - rgb1[2]) * t);

      return `rgb(${r}, ${g}, ${b})`;
    }

    // Helper: parse RGB string to array [r, g, b]
    function parseRGB(color) {
      const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (match) return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];

      // Handle hex colors (#RRGGBB)
      if (color.startsWith('#')) {
        const hex = color.slice(1);
        return [
          parseInt(hex.substring(0, 2), 16),
          parseInt(hex.substring(2, 4), 16),
          parseInt(hex.substring(4, 6), 16)
        ];
      }
      return null;
    }

    // Apply base color immediately (no animation on load)
    document.documentElement.style.backgroundColor = baseColor;
  })();

  // ─── Footer Gradient Fade with Parallax (Tall animated fade above footer) ──
  // Vertical gradient fade (3x taller = 180px) from transparent → theme color.
  // Parallax effect: moves up as you scroll, creating depth sensation.
  (function() {
    const isDarkMode = document.documentElement.classList.contains('dark');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Theme color from the shared JFSN_THEME_MAP defined above (Phase 1 dedup).
    const themeColor = jfsnThemeColor(isDarkMode);
    if (!themeColor) return;

    // Find or create footer gradient fade (positioned ABOVE footer, in white area)
    const footer = document.querySelector('footer');
    if (!footer) return;

    let gradientFade = document.querySelector('.footer-gradient-fade');
    if (!gradientFade) {
      gradientFade = document.createElement('div');
      gradientFade.className = 'footer-gradient-fade';
      gradientFade.style.cssText = `
        display: block;
        height: 180px;
        background: linear-gradient(to bottom, transparent, ${themeColor});
        width: 100%;
        position: relative;
        z-index: 1;
        pointer-events: none;
        transform: translateY(0);
        transition: none;
        opacity: 0.75;
        margin-bottom: -30px;
      `;
      footer.parentNode.insertBefore(gradientFade, footer);
    }

    // Subtle parallax effect: moves up (negative transform) when footer enters viewport
    if (!reducedMotion) {
      window.addEventListener('scroll', () => {
        const footerRect = footer.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Only animate when footer is entering viewport (0 to viewportHeight)
        // Subtle upward movement, stays in white area above grey footer
        if (footerRect.top < viewportHeight) {
          const parallaxOffset = Math.min(30, (viewportHeight - footerRect.top) * 0.15);
          gradientFade.style.transform = `translateY(-${parallaxOffset}px)`;
        } else {
          // Reset when footer is below viewport
          gradientFade.style.transform = `translateY(0)`;
        }
      }, { passive: true });
    }
  })();

})();


/* ===== _shared/lightbox.js ===== */
/* lightbox.js — Simple image modal with keyboard navigation
   Click any artwork thumbnail to enlarge in modal
   Keyboard: ← → to navigate, ESC to close
   Features: Prev/Next arrows, keyboard nav, close button, click-outside to close */

const Lightbox = {
  currentImageIndex: 0,
  images: [],
  isOpen: false,

  init() {
    // NOTE (2026-06-22 audit): this used to also hijack .thumb__link grid
    // thumbnails into this bare modal (no title/year/medium shown), which
    // actively fought _shared/page-transitions.js's click handler — both
    // called preventDefault() on the same click, so every thumbnail click
    // sitewide briefly flashed this image-only modal before the real
    // page-transition navigation won a moment later. .thumb__link grids
    // already navigate correctly to the full artwork page (with all
    // metadata) on their own; this script no longer touches them.
    //
    // Only genuinely opt-in zoom targets remain: [data-zoomable]. As of
    // this audit nothing in the live site sets that attribute, so this is
    // dormant scaffolding for a future feature, not active code — left in
    // place rather than deleted since it does nothing now and isn't broken.
    const heroImages = Array.from(document.querySelectorAll('[data-zoomable]'));

    // Create virtual links for hero images
    const heroLinks = heroImages.map(img => {
      const link = document.createElement('a');
      link.href = img.getAttribute('href') || `?id=${img.getAttribute('data-work-id') || 'unknown'}`;

      // Create wrapper with img
      const wrapper = document.createElement('div');
      wrapper.style.display = 'none';
      const imgClone = document.createElement('img');
      imgClone.src = img.src;
      imgClone.alt = img.alt || 'Artwork';
      wrapper.appendChild(imgClone);
      link.appendChild(wrapper);

      return { link, img };
    });

    this.images = [];
    this.heroImages = heroLinks;

    if (this.images.length === 0 && this.heroImages.length === 0) return;

    // Inject modal HTML
    this.createModal();

    // Attach click listeners to hero images
    this.heroImages.forEach(({ img }, index) => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', (e) => {
        e.preventDefault();
        this.openHero(index);
      });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
      if (e.key === 'Escape') this.close();
    });
  },

  createModal() {
    const html = `
      <div id="lightbox-overlay" class="lightbox-overlay">
        <div class="lightbox-container">
          <button class="lightbox-close" aria-label="Close image viewer">×</button>
          <button class="lightbox-prev" aria-label="Previous image">‹</button>
          <div class="lightbox-image-wrapper">
            <img id="lightbox-image" src="" alt="" />
          </div>
          <button class="lightbox-next" aria-label="Next image">›</button>
          <div class="lightbox-info">
            <span id="lightbox-counter">1 / 1</span>
            <button id="lightbox-copy-id" class="lightbox-copy-btn" aria-label="Copy artwork ID">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              </svg>
            </button>
            <a id="lightbox-link" href="" target="_blank" rel="noopener" class="lightbox-open-btn">Open</a>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);

    // Attach event listeners
    document.getElementById('lightbox-overlay').addEventListener('click', (e) => {
      if (e.target.id === 'lightbox-overlay') this.close();
    });
    document.querySelector('.lightbox-close').addEventListener('click', () => this.close());
    document.querySelector('.lightbox-prev').addEventListener('click', () => this.prev());
    document.querySelector('.lightbox-next').addEventListener('click', () => this.next());
    document.getElementById('lightbox-copy-id').addEventListener('click', (e) => {
      e.preventDefault();
      this.copyWorkId();
    });
  },

  open(index) {
    this.currentImageIndex = index;
    this.isOpen = true;

    const link = this.images[index];
    const img = link.querySelector('img');
    const href = link.getAttribute('href');

    document.getElementById('lightbox-image').src = img.src;
    document.getElementById('lightbox-image').alt = img.alt;
    document.getElementById('lightbox-link').href = href;
    document.getElementById('lightbox-counter').textContent = `${index + 1} / ${this.images.length}`;

    document.getElementById('lightbox-overlay').classList.add('lightbox-open');
    document.body.style.overflow = 'hidden';
  },

  close() {
    this.isOpen = false;
    document.getElementById('lightbox-overlay').classList.remove('lightbox-open');
    document.body.style.overflow = '';
  },

  prev() {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
    this.open(this.currentImageIndex);
  },

  next() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    this.open(this.currentImageIndex);
  },

  copyWorkId() {
    const link = this.images[this.currentImageIndex];
    const href = link.getAttribute('href');
    const match = href.match(/[?&]id=([^&]+)/);
    const workId = match ? match[1] : '';

    if (workId) {
      navigator.clipboard.writeText(workId).then(() => {
        if (typeof window.showToast !== 'undefined') {
          window.showToast(`Copied: ${workId}`, 3000, 'success');
        }
      }).catch(() => {
        if (typeof window.showToast !== 'undefined') {
          window.showToast('Failed to copy', 4000, 'error');
        }
      });
    }
  },

  openHero(index) {
    this.currentImageIndex = index;
    this.isOpen = true;
    this.isHeroMode = true;

    const { link, img } = this.heroImages[index];
    const href = link.getAttribute('href');

    document.getElementById('lightbox-image').src = img.src;
    document.getElementById('lightbox-image').alt = img.alt;
    document.getElementById('lightbox-link').href = href;
    document.getElementById('lightbox-counter').textContent = `${index + 1} / ${this.heroImages.length}`;

    document.getElementById('lightbox-overlay').classList.add('lightbox-open');
    document.body.style.overflow = 'hidden';
  }
};

// Initialize when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Lightbox.init());
} else {
  Lightbox.init();
}


/* ===== _shared/page-transitions.js ===== */
/* page-transitions.js — Smooth page load and navigation transitions */

const PageTransitions = {
  isTransitioning: false,
  transitionDuration: 300,

  init() {
    this.setupPageLoad();
    this.setupNavigation();
  },

  setupPageLoad() {
    // Add fade-in animation to page on load
    document.addEventListener('DOMContentLoaded', () => {
      document.body.classList.remove('page-loading');
      document.body.classList.add('page-loaded');

      // Trigger initial elements to fade in
      this.revealInitialElements();
    });

    // Add loading state on page start
    document.body.classList.add('page-loading');
  },

  setupNavigation() {
    // Intercept navigation links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      const isExternal = link.getAttribute('target') === '_blank' || link.hasAttribute('rel');
      const isHash = href && href.startsWith('#');
      const isAnchor = href && (href.startsWith('http') && !href.includes(window.location.hostname));

      // Skip: external links, hash links, non-http
      if (isExternal || isAnchor || !href || isHash) return;

      // Skip: links with data-no-transition
      if (link.hasAttribute('data-no-transition')) return;

      // Same page, different path
      if (href && !href.startsWith('http') && !isHash) {
        e.preventDefault();
        this.transitionTo(href);
      }
    });
  },

  transitionTo(href) {
    if (this.isTransitioning) return;

    this.isTransitioning = true;

    // Fade out current page
    document.body.classList.add('page-exiting');

    setTimeout(() => {
      // Navigate to new page
      window.location.href = href;
    }, this.transitionDuration);

    // Safety timeout to prevent stuck transitions
    setTimeout(() => {
      this.isTransitioning = false;
    }, this.transitionDuration * 2);
  },

  revealInitialElements() {
    // Auto-reveal elements with reveal classes on page load
    document.querySelectorAll('[data-reveal], .reveal-fade, .reveal-up').forEach(el => {
      if (el.classList.contains('reveal-pending')) {
        setTimeout(() => {
          el.classList.remove('reveal-pending');
          el.classList.add('reveal-visible');
        }, 50);
      }
    });
  },

  // Utility: manually trigger transition
  goto(href) {
    this.transitionTo(href);
  },

  // Utility: set custom transition duration
  setDuration(ms) {
    this.transitionDuration = ms;
  }
};

// Initialize when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => PageTransitions.init());
} else {
  PageTransitions.init();
}


/* ===== _shared/lazy-load.js ===== */
/* lazy-load.js — Fade-in effect for lazy-loaded images */

const LazyLoad = {
  observer: null,
  loadingClass: 'lazy-loading',
  loadedClass: 'lazy-loaded',

  init() {
    this.setupObserver();
    this.attachToImages();
  },

  setupObserver() {
    const options = {
      threshold: 0.01,
      rootMargin: '50px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
        }
      });
    }, options);
  },

  attachToImages() {
    // Attach to all img[loading="lazy"]
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      this.observe(img);
    });

    // Also attach to images with data-lazy-src
    document.querySelectorAll('img[data-lazy-src]').forEach(img => {
      this.observe(img);
    });

    // Watch for dynamically added images
    this.observeDynamicImages();
  },

  observe(img) {
    img.classList.add(this.loadingClass);
    this.observer.observe(img);
  },

  loadImage(img) {
    const lazySource = img.getAttribute('data-lazy-src');
    const lazySet = img.getAttribute('data-lazy-srcset');

    // Handle data-lazy-src
    if (lazySource) {
      img.onload = () => this.onImageLoaded(img);
      img.onerror = () => this.onImageError(img);
      img.src = lazySource;

      if (lazySet) {
        img.srcset = lazySet;
      }
    } else {
      // For native lazy loading, just mark as loaded when visible
      this.onImageLoaded(img);
    }

    this.observer.unobserve(img);
  },

  onImageLoaded(img) {
    img.classList.remove(this.loadingClass);
    img.classList.add(this.loadedClass);
  },

  onImageError(img) {
    img.classList.remove(this.loadingClass);
    img.classList.add('lazy-error');
    console.warn('Failed to load image:', img.getAttribute('data-lazy-src'));
  },

  observeDynamicImages() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) { // Element node
            if (node.tagName === 'IMG') {
              if (node.hasAttribute('loading') || node.hasAttribute('data-lazy-src')) {
                this.observe(node);
              }
            } else {
              // Check descendants
              node.querySelectorAll('img[loading="lazy"], img[data-lazy-src]').forEach(img => {
                this.observe(img);
              });
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  },

  // Utility: manually load an image
  loadNow(img) {
    this.loadImage(img);
  },

  // Utility: preload image without observer
  preload(src) {
    const img = new Image();
    img.src = src;
    return new Promise((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load: ${src}`));
    });
  }
};

// Initialize when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => LazyLoad.init());
} else {
  LazyLoad.init();
}
