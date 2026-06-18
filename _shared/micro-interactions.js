/* micro-interactions.js — Phase 3: Delighter animations and feedback
   - Grid entrance stagger
   - Filter chip pulse feedback
   - Button press feedback
   - Copy-to-clipboard toast
   - Related works auto-scroll
*/

(function() {
  'use strict';

  /* ─── Grid Entrance Stagger ─────────────────────────────────────────────── */
  function setupGridStagger() {
    var grids = [
      document.getElementById('works-grid'),
      document.getElementById('series-grid'),
      document.getElementById('collage-grid'),
      document.getElementById('sculpture-grid'),
      document.getElementById('photography-grid'),
      document.getElementById('painting-grid')
    ];

    grids.forEach(function(grid) {
      if (!grid) return;

      // Set stagger index on each child
      var children = grid.querySelectorAll('.thumb, [class*="card"]');
      children.forEach(function(child, index) {
        child.style.setProperty('--stagger-index', index);
      });
    });
  }

  /* ─── Filter Chip Pulse Feedback ────────────────────────────────────────── */
  function setupFilterChipFeedback() {
    var filterChips = document.querySelectorAll('.filter-chip button');
    filterChips.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var chip = btn.closest('.filter-chip');
        if (chip) {
          chip.classList.add('applying');
          setTimeout(function() {
            chip.classList.remove('applying');
          }, 400);
        }
      });
    });
  }

  /* ─── Copy to Clipboard Toast ────────────────────────────────────────────── */
  function showToast(message) {
    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(function() {
      toast.classList.add('exiting');
      setTimeout(function() {
        toast.remove();
      }, 300);
    }, 2000);
  }

  window.showToast = showToast; // Expose for artwork.html

  // Setup copy-to-clipboard on artwork pages
  function setupArtworkShare() {
    var shareBtn = document.getElementById('artwork-share-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', function(e) {
        e.preventDefault();
        var url = window.location.href;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(function() {
            showToast('Copied to clipboard');
          }).catch(function() {
            showToast('Failed to copy');
          });
        } else {
          // Fallback for older browsers
          var input = document.createElement('input');
          input.value = url;
          document.body.appendChild(input);
          input.select();
          try {
            document.execCommand('copy');
            showToast('Copied to clipboard');
          } catch (err) {
            showToast('Failed to copy');
          }
          document.body.removeChild(input);
        }
      });
    }
  }

  /* ─── Related Works on Artwork Pages ────────────────────────────────────── */
  function setupRelatedWorks() {
    var relatedGrid = document.getElementById('related-works-grid');
    if (!relatedGrid) return;

    // Get current artwork ID from URL
    var url = new URL(window.location);
    var currentId = url.searchParams.get('id');
    if (!currentId) return;

    // Fetch catalog to find related works
    fetch('/catalog-lite.json')
      .then(function(r) { return r.json(); })
      .then(function(works) {
        // Find current work
        var current = works.find(function(w) { return w.file === currentId; });
        if (!current) return;

        // Find related works: same series, medium, or decade
        var related = works.filter(function(w) {
          if (w.file === currentId) return false; // Exclude self
          if (current.series && w.series === current.series) return true; // Same series
          if (w.work_type === current.work_type) return true; // Same medium
          if (w.year === current.year) return true; // Same decade
          return false;
        }).slice(0, 8); // Limit to 8

        // Populate grid
        relatedGrid.innerHTML = '';
        related.forEach(function(work, idx) {
          var img = work.file + '.avif';
          var html = '<a href="artwork.html?id=' + work.file + '" class="thumb" style="--stagger-index:' + idx + ';">' +
            '<div class="thumb__link" style="display:block;position:relative;cursor:zoom-in;"> ' +
            '<img src="artworks/medium/' + img + '" alt="' + (work.title || 'Untitled') + '" loading="lazy" style="width:100%;height:auto;display:block;"> ' +
            '</div>' +
            '<div class="thumb__caption" style="padding:8px;font-family:Inter,sans-serif;font-size:13px;color:#0B0B0B;"> ' +
            '<a href="artwork.html?id=' + work.file + '" style="color:inherit;text-decoration:none;">' + (work.title || 'Untitled') + '</a>' +
            '<br><span style="color:#575757;font-size:11px;">' + (work.year_display || work.year) + '</span>' +
            '</div>' +
            '</a>';
          var li = document.createElement('li');
          li.innerHTML = html;
          li.style.listStyle = 'none';
          relatedGrid.appendChild(li);
        });

        // Re-setup stagger for related works
        setupGridStagger();
      })
      .catch(function(e) {
        console.log('Related works load error:', e);
        relatedGrid.style.display = 'none';
      });
  }

  /* ─── Phase 5: Scroll-Reveal Animations ────────────────────────────────────── */
  function setupScrollReveal() {
    var revealElements = document.querySelectorAll('.reveal-section');
    if (revealElements.length === 0) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(function(el) {
      observer.observe(el);
    });
  }

  /* ─── Phase 5: Hero Parallax Effect ────────────────────────────────────── */
  function setupHeroParallax() {
    var heroImages = document.querySelectorAll('.hero-parallax-image');
    if (heroImages.length === 0) return;

    window.addEventListener('scroll', function() {
      heroImages.forEach(function(img) {
        var scrolled = window.pageYOffset;
        var parent = img.closest('.hero-parallax');
        if (!parent) return;

        var rect = parent.getBoundingClientRect();
        var offset = rect.top / 10; // Subtle parallax: 1/10 of scroll
        img.style.transform = 'translateY(' + offset + 'px) scale(1.05)';
      });
    }, { passive: true });
  }

  /* ─── Phase 5: Search Result Highlighting ────────────────────────────────── */
  function setupSearchHighlighting() {
    var searchInput = document.querySelector('.search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', function() {
      var query = this.value.toLowerCase();
      var results = document.querySelectorAll('[data-searchable]');

      results.forEach(function(result) {
        var text = result.textContent.toLowerCase();
        if (query && !text.includes(query)) {
          result.classList.add('search-result-nomatch');
          result.classList.remove('search-result-glow');
        } else if (query) {
          result.classList.remove('search-result-nomatch');
          result.classList.add('search-result-glow');
        } else {
          result.classList.remove('search-result-nomatch', 'search-result-glow');
        }
      });
    });
  }

  /* ─── Phase 5: Page Transition Fade ────────────────────────────────────── */
  function setupPageTransitions() {
    var navLinks = document.querySelectorAll('a[href*=".html"]');
    navLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        if (link.target === '_blank' || link.hasAttribute('download')) return;

        var href = this.href;
        if (href.includes('#')) return; // Skip anchor links

        e.preventDefault();
        document.documentElement.classList.add('page-transition');

        setTimeout(function() {
          window.location.href = href;
        }, 300);
      });
    });
  }

  /* ─── Phase 5: Lazy Load Image Fade-In ────────────────────────────────── */
  function setupLazyLoadFadeIn() {
    var images = document.querySelectorAll('img[loading="lazy"]');

    images.forEach(function(img) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var image = entry.target;
            image.classList.add('lazy-loaded');

            // Fade in on load
            image.addEventListener('load', function() {
              this.style.opacity = '0';
              this.style.transition = 'opacity 0.4s ease';
              setTimeout(function() {
                image.style.opacity = '1';
              }, 50);
            }, { once: true });

            observer.unobserve(image);
          }
        });
      }, { threshold: 0.1 });

      observer.observe(img);
    });
  }

  /* ─── Phase 5: Bookmark Management (LocalStorage) ────────────────────────── */
  window.toggleBookmark = function(workId) {
    var bookmarks = JSON.parse(localStorage.getItem('jfsn-bookmarks') || '[]');
    var idx = bookmarks.indexOf(workId);

    if (idx > -1) {
      bookmarks.splice(idx, 1);
      showToast('Removed from bookmarks');
    } else {
      bookmarks.push(workId);
      showToast('Added to bookmarks');
    }

    localStorage.setItem('jfsn-bookmarks', JSON.stringify(bookmarks));
    updateBookmarkUI(workId);
  };

  function updateBookmarkUI(workId) {
    var bookmarks = JSON.parse(localStorage.getItem('jfsn-bookmarks') || '[]');
    var btn = document.querySelector('[data-bookmark-id="' + workId + '"]');
    if (btn) {
      if (bookmarks.includes(workId)) {
        btn.classList.add('bookmarked');
        btn.innerHTML = '♥';
      } else {
        btn.classList.remove('bookmarked');
        btn.innerHTML = '♡';
      }
    }
  }

  /* ─── Phase 6: Collapsible Filter Sections ────────────────────────────────── */
  function setupCollapsibleFilters() {
    var headers = document.querySelectorAll('.filter-section-header');
    headers.forEach(function(header) {
      header.addEventListener('click', function() {
        var section = this.closest('.filter-section');
        var toggle = section.querySelector('.filter-section-toggle');
        var content = section.querySelector('.filter-section-content');

        if (content.classList.contains('collapsed')) {
          content.classList.remove('collapsed');
          toggle.classList.remove('collapsed');
        } else {
          content.classList.add('collapsed');
          toggle.classList.add('collapsed');
        }
      });
    });
  }

  /* ─── Phase 6: View Mode Toggle ────────────────────────────────────────── */
  window.switchViewMode = function(mode) {
    var grid = document.getElementById('works-grid');
    if (!grid) return;

    grid.classList.remove('grid-view', 'list-view', 'masonry-view');
    grid.classList.add(mode + '-view');

    // Update button states
    var buttons = document.querySelectorAll('.view-toggle button');
    buttons.forEach(function(btn) {
      btn.classList.remove('active');
      if (btn.dataset.mode === mode) {
        btn.classList.add('active');
      }
    });

    localStorage.setItem('jfsn-view-mode', mode);
  };

  // Restore view mode from localStorage
  function restoreViewMode() {
    var mode = localStorage.getItem('jfsn-view-mode') || 'grid';
    window.switchViewMode(mode);
  }

  /* ─── Phase 6: Color Filter Tags ───────────────────────────────────────── */
  window.toggleColorFilter = function(colorValue) {
    var swatch = document.querySelector('[data-color="' + colorValue + '"]');
    if (swatch) {
      swatch.classList.toggle('active');
      var colors = [];
      document.querySelectorAll('.color-swatch.active').forEach(function(s) {
        colors.push(s.dataset.color);
      });
      localStorage.setItem('jfsn-color-filters', JSON.stringify(colors));
      filterByColor(colors);
    }
  };

  function filterByColor(colors) {
    if (colors.length === 0) {
      document.querySelectorAll('[data-work-color]').forEach(function(el) {
        el.style.display = '';
      });
      return;
    }

    document.querySelectorAll('[data-work-color]').forEach(function(el) {
      var workColor = el.getAttribute('data-work-color');
      el.style.display = colors.includes(workColor) ? '' : 'none';
    });
  }

  /* ─── Phase 6: Smart Shortcuts Hint ────────────────────────────────────── */
  function setupShortcutsHint() {
    var hint = document.querySelector('.shortcuts-hint');
    if (!hint) return;

    // Hide hint after 5 seconds, show on hover
    var hideTimer;
    function autoHide() {
      hideTimer = setTimeout(function() {
        hint.style.opacity = '0.5';
      }, 5000);
    }

    hint.addEventListener('mouseenter', function() {
      clearTimeout(hideTimer);
      this.style.opacity = '1';
    });

    hint.addEventListener('mouseleave', function() {
      autoHide();
    });

    autoHide();
  }

  /* ─── Phase 7: Reading History ────────────────────────────────────────────── */
  window.addToViewingHistory = function(workId, title) {
    var history = JSON.parse(localStorage.getItem('jfsn-viewing-history') || '[]');

    // Remove if already in history
    history = history.filter(function(item) { return item.id !== workId; });

    // Add to front
    history.unshift({
      id: workId,
      title: title,
      timestamp: new Date().toISOString()
    });

    // Keep last 20
    history = history.slice(0, 20);

    localStorage.setItem('jfsn-viewing-history', JSON.stringify(history));
  };

  function getViewingHistory() {
    return JSON.parse(localStorage.getItem('jfsn-viewing-history') || '[]');
  }

  /* ─── Phase 7: Enhanced Keyboard Shortcuts ──────────────────────────────── */
  function setupEnhancedShortcuts() {
    // Previous work (P key)
    document.addEventListener('keydown', function(e) {
      if (e.key === 'p' || e.key === 'P') {
        var prevLink = document.getElementById('prev-link');
        if (prevLink) prevLink.click();
      }

      // Next work (N key)
      if (e.key === 'n' || e.key === 'N') {
        var nextLink = document.getElementById('next-link');
        if (nextLink) nextLink.click();
      }

      // Toggle view mode (V key on archive)
      if (e.key === 'v' || e.key === 'V') {
        var modes = ['grid', 'list', 'masonry'];
        var current = localStorage.getItem('jfsn-view-mode') || 'grid';
        var idx = modes.indexOf(current);
        var next = modes[(idx + 1) % modes.length];
        window.switchViewMode(next);
      }

      // Bookmark (B key on artwork)
      if (e.key === 'b' || e.key === 'B') {
        var url = new URL(window.location);
        var workId = url.searchParams.get('id');
        if (workId) window.toggleBookmark(workId);
      }

      // Show shortcuts (? key)
      if (e.shiftKey && e.key === '?') {
        e.preventDefault();
        var modal = document.getElementById('shortcuts-modal');
        if (modal) modal.style.display = 'block';
      }
    });
  }

  /* ─── Phase 7: Touch Gestures ────────────────────────────────────────────── */
  function setupTouchGestures() {
    var touchStartX = 0;
    var touchEndX = 0;

    document.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    }, false);

    document.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, false);

    function handleSwipe() {
      var diff = touchStartX - touchEndX;
      if (Math.abs(diff) < 50) return; // Minimum swipe distance

      if (diff > 0) {
        // Swiped left → next
        var nextLink = document.getElementById('next-link');
        if (nextLink) nextLink.click();
      } else {
        // Swiped right → previous
        var prevLink = document.getElementById('prev-link');
        if (prevLink) prevLink.click();
      }
    }
  }

  /* ─── Phase 7: ARIA Live Announcements ──────────────────────────────────── */
  window.announceToScreenReader = function(message) {
    var announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-9999px';
    announcement.textContent = message;
    document.body.appendChild(announcement);

    setTimeout(function() {
      document.body.removeChild(announcement);
    }, 1000);
  };

  /* ─── Phase 8: Scroll-to-Top Button ────────────────────────────────────── */
  function setupScrollToTop() {
    var btn = document.getElementById('scroll-to-top');
    if (!btn) return;

    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ─── Phase 8: Animated Counters ────────────────────────────────────────── */
  window.animateCounter = function(element, target, duration) {
    duration = duration || 2000;
    var start = parseInt(element.textContent) || 0;
    var increment = (target - start) / (duration / 16);
    var current = start;

    var timer = setInterval(function() {
      current += increment;
      if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current).toLocaleString();
    }, 16);
  };

  // Auto-animate counters on page load
  function setupAnimatedCounters() {
    var counters = document.querySelectorAll('.counter[data-count]');
    counters.forEach(function(counter) {
      var target = parseInt(counter.getAttribute('data-count'));
      animateCounter(counter, target);
    });
  }

  /* ─── Phase 8: Progress Bar Manager ────────────────────────────────────── */
  window.showProgress = function(percentage) {
    var fill = document.querySelector('.progress-fill');
    if (!fill) return;
    fill.style.width = percentage + '%';
  };

  window.completeProgress = function() {
    var fill = document.querySelector('.progress-fill');
    if (!fill) return;
    fill.style.width = '100%';
    fill.classList.add('complete');
  };

  /* ─── Phase 8: Sticky Footer Actions ────────────────────────────────────── */
  window.showStickyFooter = function(show) {
    var footer = document.querySelector('.sticky-footer-actions');
    if (!footer) return;
    if (show) {
      footer.classList.add('visible');
    } else {
      footer.classList.remove('visible');
    }
  };

  /* ─── Phase 8: Form Input Enhancement ────────────────────────────────────── */
  function setupFormEnhancements() {
    var inputs = document.querySelectorAll('input, textarea, select');

    inputs.forEach(function(input) {
      // Show success state on valid input
      input.addEventListener('input', function() {
        if (this.hasAttribute('required') && this.value.trim()) {
          this.removeAttribute('aria-invalid');
        }
      });

      // Validation on blur
      input.addEventListener('blur', function() {
        if (this.hasAttribute('required') && !this.value.trim()) {
          this.setAttribute('aria-invalid', 'true');
        }
      });
    });
  }

  /* ─── Initialize All ────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function() {
    setupGridStagger();
    setupFilterChipFeedback();
    setupArtworkShare();
    setupRelatedWorks();
    setupScrollReveal();
    setupHeroParallax();
    setupSearchHighlighting();
    setupPageTransitions();
    setupLazyLoadFadeIn();
    setupCollapsibleFilters();
    restoreViewMode();
    setupShortcutsHint();
    setupEnhancedShortcuts();
    setupTouchGestures();
    setupScrollToTop();
    setupAnimatedCounters();
    setupFormEnhancements();
  });

  // Re-setup grid stagger when filter changes
  var observer = new MutationObserver(function() {
    setupGridStagger();
  });

  var config = { childList: true, subtree: false };
  var gridsToObserve = [
    'works-grid',
    'series-grid',
    'collage-grid',
    'sculpture-grid',
    'photography-grid',
    'painting-grid'
  ];

  gridsToObserve.forEach(function(gridId) {
    var grid = document.getElementById(gridId);
    if (grid) {
      observer.observe(grid, config);
    }
  });
})();
