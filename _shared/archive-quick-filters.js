/* archive-quick-filters.js — Simplified filter UI for 70+ users
   Large, clear buttons for Medium and Decade
   Wires to existing filter system for backward compatibility
*/

(function() {
  'use strict';

  /* ─── Get Current Active Filters ────────────────────────────────────────– */
  function getActiveFilters() {
    const chips = document.querySelectorAll('.filter-chip');
    const active = {
      mediums: [],
      decades: [],
      other: []
    };

    chips.forEach(chip => {
      const text = chip.textContent.trim().replace('✕', '').trim().toLowerCase();

      if (text.includes('collage') || text.includes('sculpture') || text.includes('photography') || text.includes('painting')) {
        active.mediums.push(text.split('(')[0].trim());
      } else if (text.includes('s') && /\d/.test(text)) {
        active.decades.push(text);
      } else {
        active.other.push(text);
      }
    });

    return active;
  }

  /* ─── Create Quick Filter UI ────────────────────────────────────────────– */
  function createQuickFilters() {
    const filterSection = document.querySelector('[class*="filter"]');
    if (!filterSection) return;

    const container = document.createElement('div');
    container.id = 'quick-filters-container';
    container.className = 'quick-filters';

    // Mediums
    const mediumsHTML = `
      <div class="quick-filter-group">
        <div class="quick-filter-label">By Medium</div>
        <div class="quick-filter-buttons">
          <button class="quick-filter-btn" data-filter="all" data-category="medium">All</button>
          <button class="quick-filter-btn" data-filter="collage" data-category="medium">Collage</button>
          <button class="quick-filter-btn" data-filter="sculpture" data-category="medium">Sculpture</button>
          <button class="quick-filter-btn" data-filter="photography" data-category="medium">Photography</button>
          <button class="quick-filter-btn" data-filter="painting" data-category="medium">Painting</button>
        </div>
      </div>
    `;

    // Decades
    const decadesHTML = `
      <div class="quick-filter-group">
        <div class="quick-filter-label">By Decade</div>
        <div class="quick-filter-buttons">
          <button class="quick-filter-btn" data-filter="all" data-category="decade">All</button>
          <button class="quick-filter-btn" data-filter="1970s" data-category="decade">1970s</button>
          <button class="quick-filter-btn" data-filter="1980s" data-category="decade">1980s</button>
          <button class="quick-filter-btn" data-filter="1990s" data-category="decade">1990s</button>
          <button class="quick-filter-btn" data-filter="2000s" data-category="decade">2000s</button>
          <button class="quick-filter-btn" data-filter="2010s" data-category="decade">2010s</button>
          <button class="quick-filter-btn" data-filter="2020s" data-category="decade">2020s</button>
        </div>
      </div>
    `;

    container.innerHTML = mediumsHTML + decadesHTML;

    // Wire up button clicks
    container.querySelectorAll('.quick-filter-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const filter = this.getAttribute('data-filter');
        const category = this.getAttribute('data-category');

        // Clear previous filters in this category
        const oldChips = document.querySelectorAll(`.filter-chip[data-filter-type="${category}"]`);
        oldChips.forEach(chip => {
          const closeBtn = chip.querySelector('button');
          if (closeBtn) closeBtn.click();
        });

        // Click the new filter unless "all" is selected
        if (filter !== 'all') {
          const filterChip = document.querySelector(`.filter-chip:has(button[data-label="${filter}"])`);
          if (filterChip) {
            filterChip.click();
          } else {
            // Try to find by text content
            const chips = Array.from(document.querySelectorAll('.filter-chip'));
            const match = chips.find(chip => chip.textContent.toLowerCase().includes(filter));
            if (match) match.click();
          }
        }

        // Update active button states
        updateButtonStates();
      });
    });

    // Insert before old filter controls
    const oldFilters = document.getElementById('filter-controls');
    if (oldFilters) {
      oldFilters.parentElement.insertBefore(container, oldFilters);
    } else {
      filterSection.insertBefore(container, filterSection.firstChild);
    }

    // Add toggle for advanced filters
    const toggle = document.createElement('button');
    toggle.className = 'advanced-filters-toggle';
    toggle.textContent = '+ More Filter Options';
    toggle.addEventListener('click', () => {
      const oldFilters = document.getElementById('filter-controls');
      if (oldFilters) {
        oldFilters.classList.toggle('show');
        toggle.textContent = oldFilters.classList.contains('show') ? '- Hide Filter Options' : '+ More Filter Options';
      }
    });

    container.appendChild(toggle);
    updateButtonStates();
  }

  /* ─── Update Button Active States ──────────────────────────────────────– */
  function updateButtonStates() {
    const active = getActiveFilters();
    const buttons = document.querySelectorAll('.quick-filter-btn');

    buttons.forEach(btn => {
      const filter = btn.getAttribute('data-filter');
      const category = btn.getAttribute('data-category');
      let isActive = false;

      if (filter === 'all') {
        if (category === 'medium') isActive = active.mediums.length === 0;
        else if (category === 'decade') isActive = active.decades.length === 0;
      } else {
        if (category === 'medium') isActive = active.mediums.includes(filter);
        else if (category === 'decade') isActive = active.decades.includes(filter);
      }

      btn.classList.toggle('active', isActive);
    });
  }

  /* ─── Watch for Filter Changes ─────────────────────────────────────────– */
  function watchFilterChanges() {
    const filterContainer = document.querySelector('[class*="filter"]');
    if (!filterContainer) return;

    const observer = new MutationObserver(() => {
      updateButtonStates();
    });

    observer.observe(filterContainer, { childList: true, subtree: true });
  }

  /* ─── Init ──────────────────────────────────────────────────────────────– */
  function init() {
    if (!window.location.pathname.includes('archive')) return;

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    createQuickFilters();
    watchFilterChanges();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
