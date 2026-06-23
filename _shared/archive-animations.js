/* archive-animations.js — Archive filter orchestration with anime.js
   Makes filtering feel responsive and alive
   - Filter chip animations (click feedback, color shifts)
   - Grid result orchestration (stagger-in, cross-dissolve)
   - Filter type accent colors (medium/decade colors)
   - Result count pulsing on filter change
   - Clear filters fade-out animation
*/

(function() {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Filter color mapping
  const filterColors = {
    'collage': '#FF6600',      // Orange
    'sculpture': '#9d7e5d',    // Brown
    'photography': '#4a6fa5',  // Blue
    '1970s': '#8B4513',
    '1980s': '#CD853F',
    '1990s': '#DAA520',
    '2000s': '#FF8C00',
    '2010s': '#FF6347',
    '2020s': '#DC143C'
  };

  /* ─── Filter Chip Click Feedback ────────────────────────────────────────── */
  function setupChipFeedback() {
    if (prefersReducedMotion) return;

    const chips = document.querySelectorAll('.filter-chip');
    if (chips.length === 0) return;

    chips.forEach((chip) => {
      chip.addEventListener('click', function() {
        // Pulse effect
        anime({
          targets: chip,
          scale: [1, 1.05, 1],
          duration: 300,
          easing: 'easeOutQuad'
        });

        // Extract filter type from chip text
        const text = chip.textContent.toLowerCase();
        let filterType = 'collage';
        for (let key of Object.keys(filterColors)) {
          if (text.includes(key)) {
            filterType = key;
            break;
          }
        }

        // Animate to filter color
        const color = filterColors[filterType] || '#FF6600';
        anime({
          targets: chip,
          backgroundColor: color,
          color: '#fff',
          duration: 400,
          easing: 'easeOutQuad',
          delay: 50
        });

        // Fade back to default after 800ms
        setTimeout(() => {
          anime({
            targets: chip,
            backgroundColor: '#d3d1c7',
            color: '#0B0B0B',
            duration: 300,
            easing: 'easeOutQuad'
          });
        }, 800);
      });
    });
  }

  /* ─── Grid Result Orchestration ─────────────────────────────────────────– */
  function setupGridOrchestration() {
    if (prefersReducedMotion) return;

    // Watch for grid updates (filter changes)
    const observer = new MutationObserver(() => {
      const grid = document.querySelector('[id*="grid"], .archive-grid, .masonry, [class*="grid"]');
      if (grid) {
        const items = grid.querySelectorAll('.thumb, [class*="card"], > div');
        if (items.length > 0) {
          // Stagger-fade all items
          anime.set(items, { opacity: 0, translateY: 6 });
          anime({
            targets: items,
            opacity: [0, 1],
            translateY: [6, 0],
            duration: 320,
            easing: 'easeOutQuad',
            delay: anime.stagger(30)
          });
        }
      }
    });

    // Watch for filter container changes
    const filterContainer = document.querySelector('[class*="filter"], [id*="filter"]');
    if (filterContainer) {
      observer.observe(filterContainer, {
        childList: true,
        subtree: true,
        attributes: false
      });
    }
  }

  /* ─── Result Count Animation ────────────────────────────────────────────── */
  function setupCountAnimation() {
    if (prefersReducedMotion) return;

    const countEl = document.querySelector('[id*="count"], .result-count, [class*="count"]');
    if (!countEl) return;

    // Original text
    const originalText = countEl.textContent;
    let isAnimating = false;

    const observer = new MutationObserver(() => {
      if (!isAnimating) {
        isAnimating = true;
        // Pulse animation
        anime({
          targets: countEl,
          scale: [1, 1.12, 1],
          duration: 400,
          easing: 'easeOutElastic(1, 0.6)'
        });

        setTimeout(() => {
          isAnimating = false;
        }, 500);
      }
    });

    observer.observe(countEl, { childList: true, characterData: true, subtree: true });
  }

  /* ─── Clear Filters Animation ───────────────────────────────────────────── */
  function setupClearAnimation() {
    if (prefersReducedMotion) return;

    const clearBtn = document.querySelector('.filter-chip-clear, [id*="clear"]');
    if (clearBtn) {
      clearBtn.addEventListener('click', function() {
        // Fade out all filter chips
        const chips = document.querySelectorAll('.filter-chip');
        if (chips.length > 0) {
          anime({
            targets: chips,
            opacity: [1, 0],
            translateX: [0, -8],
            duration: 250,
            easing: 'easeOutQuad',
            delay: anime.stagger(30)
          });
        }

        // Then fade in fresh grid
        setTimeout(() => {
          const grid = document.querySelector('[id*="grid"], .archive-grid');
          if (grid) {
            const items = grid.querySelectorAll('.thumb, [class*="card"], > div');
            if (items.length > 0) {
              anime.set(items, { opacity: 0, scale: 0.96 });
              anime({
                targets: items,
                opacity: [0, 1],
                scale: [0.96, 1],
                duration: 350,
                easing: 'easeOutQuad',
                delay: anime.stagger(25)
              });
            }
          }
        }, 200);
      });
    }
  }

  /* ─── Mobile Filter Drawer Animation ────────────────────────────────────── */
  function setupMobileFilters() {
    if (prefersReducedMotion) return;

    const filterDrawer = document.querySelector('[id*="drawer"], [class*="drawer"]');
    if (!filterDrawer) return;

    // Observe drawer visibility
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const items = entry.target.querySelectorAll('.filter-chip, [class*="filter-item"]');
          if (items.length > 0) {
            anime.set(items, { opacity: 0, translateX: -16 });
            anime({
              targets: items,
              opacity: [0, 1],
              translateX: [-16, 0],
              duration: 300,
              easing: 'easeOutQuad',
              delay: anime.stagger(40)
            });
          }
        }
      });
    }, { threshold: 0.2 });

    observer.observe(filterDrawer);
  }

  /* ─── Grid Layout Smooth Reflow ────────────────────────────────────────── */
  function setupSmoothReflow() {
    if (prefersReducedMotion) return;

    const grid = document.querySelector('[id*="grid"], .archive-grid, .masonry');
    if (!grid) return;

    // Smooth height transition on grid layout changes
    anime.set(grid, { minHeight: grid.offsetHeight });
    anime({
      targets: grid,
      minHeight: [grid.offsetHeight, 'auto'],
      duration: 400,
      easing: 'easeOutQuad'
    });
  }

  /* ─── Init ──────────────────────────────────────────────────────────────── */
  function init() {
    if (!window.anime) return; // anime.js not loaded

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    setupChipFeedback();
    setupGridOrchestration();
    setupCountAnimation();
    setupClearAnimation();
    setupMobileFilters();
    setupSmoothReflow();
  }

  // Start when anime.js is available
  if (window.anime) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }
})();
