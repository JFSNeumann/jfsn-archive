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

  // ─── Decade hero heading: zoom-out as hero scrolls away ──────────────────
  const hero    = document.querySelector('.decade-hero');
  const heading = document.querySelector('.decade-heading');

  if (hero && heading) {
    const onScroll = function () {
      const rect     = hero.getBoundingClientRect();
      const heroH    = hero.offsetHeight;
      // progress: 0 = hero fully visible, 1 = hero fully scrolled past
      const progress = Math.max(0, Math.min(1, -rect.top / heroH));
      const scale    = 1 + progress * 0.28;
      const opacity  = 1 - progress * 1.4; // fade faster than scale
      heading.style.transform = 'scale(' + scale + ')';
      heading.style.opacity   = Math.max(0, opacity);
    };

    // Only run if reduced-motion is not set
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll(); // init
    }
  }

  // ─── Toast notification system ──────────────────────────────────────────
  // Usage: window.showToast('Copied!', 2000)
  window.showToast = function(message, duration = 2000) {
    let container = document.getElementById('jfsn-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'jfsn-toast-container';
      container.style.cssText = 'position:fixed;bottom:28px;right:28px;z-index:1000;pointer-events:none;';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'jfsn-toast';
    toast.textContent = message;
    toast.style.cssText = `
      font-family: Inter, sans-serif;
      font-size: 12px;
      font-weight: 500;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #0B0B0B;
      background: #fcf9f3;
      border: 1px solid #8e7164;
      padding: 10px 14px;
      border-radius: 0;
      margin-bottom: 8px;
      opacity: 0;
      transform: translateY(8px);
      transition: opacity 0.25s ease, transform 0.25s ease;
      pointer-events: auto;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    `;
    container.appendChild(toast);

    // Trigger entrance animation
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    // Auto-remove
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      setTimeout(() => toast.remove(), 250);
    }, duration);
  };

  // Respect prefers-reduced-motion for all toast animations
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const origToast = window.showToast;
    window.showToast = function(message, duration = 2000) {
      let container = document.getElementById('jfsn-toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'jfsn-toast-container';
        container.style.cssText = 'position:fixed;bottom:28px;right:28px;z-index:1000;pointer-events:none;';
        document.body.appendChild(container);
      }
      const toast = document.createElement('div');
      toast.textContent = message;
      toast.style.cssText = `
        font-family: Inter, sans-serif;
        font-size: 12px;
        font-weight: 500;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: #0B0B0B;
        background: #fcf9f3;
        border: 1px solid #8e7164;
        padding: 10px 14px;
        margin-bottom: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      `;
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

  // ─── Keyboard shortcuts ───────────────────────────────────────────────────
  // P/N: prev/next work on artwork pages
  // ?: show shortcuts help
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

    // ? = show keyboard shortcuts help (if available)
    if (e.key === '?') {
      var tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      // Check if search is loaded (has openSiteSearch function)
      if (window.openSiteSearch) {
        // Trigger search keyboard shortcuts modal (? key in search)
        var event = new KeyboardEvent('keydown', { key: '?' });
        document.dispatchEvent(event);
      }
    }
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

  // Artwork thumbnails are full color always — no mask-image, no scroll-reveal.
  // (Removed session 8; banned — do not re-add.)

})();
