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

  /* ─── Initialize All ────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function() {
    setupGridStagger();
    setupFilterChipFeedback();
    setupArtworkShare();
    setupRelatedWorks();
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
