/**
 * FILTER DROPDOWNS 2026
 * Converts Series, Status, and Orientation filter buttons to dropdown menus
 */

(function() {
  'use strict';

  class FilterDropdowns {
    constructor() {
      this.dropdowns = new Map();
      this.selectedFilters = {
        series: null,
        status: null,
        orientation: null
      };
      this.init();
    }

    init() {
      // Wait for filter section to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.waitForFilters());
      } else {
        this.waitForFilters();
      }
    }

    waitForFilters() {
      // Wait for filter buttons to be loaded (they might be dynamically loaded)
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max
      
      const checkInterval = setInterval(() => {
        attempts++;
        const container = document.getElementById('filterButtonsContainer');
        const seriesButtons = document.querySelectorAll('.filter-btn-series[data-category]');
        const statusButtons = document.querySelectorAll('.filter-btn-status[data-category]');
        const orientationButtons = document.querySelectorAll('.filter-btn-orientation[data-category]');
        
        if (container && (seriesButtons.length > 0 || statusButtons.length > 0 || orientationButtons.length > 0)) {
          clearInterval(checkInterval);
          console.log('✅ Filter buttons found, setting up dropdowns...', {
            series: seriesButtons.length,
            status: statusButtons.length,
            orientation: orientationButtons.length
          });
          // Small delay to ensure all buttons are rendered
          setTimeout(() => this.setupDropdowns(), 200);
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          console.warn('⚠️ Filter buttons not found after', maxAttempts, 'attempts');
          // Try to setup anyway - might work with what we have
          this.setupDropdowns();
        }
      }, 100);
    }

    setupDropdowns() {
      console.log('🔧 Setting up filter dropdowns...');
      
      // Convert Series buttons to dropdown
      const seriesItems = this.getSeriesItems();
      if (seriesItems.length > 0) {
        this.convertToDropdown('series', {
          label: 'Series',
          icon: 'bx-palette',
          items: seriesItems
        });
      } else {
        console.warn('⚠️ No series items found');
      }

      // Convert Status buttons to dropdown
      const statusItems = this.getStatusItems();
      if (statusItems.length > 0) {
        this.convertToDropdown('status', {
          label: 'Status',
          icon: 'bx-info-circle',
          items: statusItems
        });
      } else {
        console.warn('⚠️ No status items found');
      }

      // Convert Orientation buttons to dropdown
      const orientationItems = this.getOrientationItems();
      if (orientationItems.length > 0) {
        this.convertToDropdown('orientation', {
          label: 'Orientation',
          icon: 'bx-expand',
          items: orientationItems
        });
      } else {
        console.warn('⚠️ No orientation items found');
      }

      // Close dropdowns when clicking outside (only add once)
      if (!this.clickHandlerAdded) {
        document.addEventListener('click', (e) => {
          if (!e.target.closest('.filter-dropdown-wrapper')) {
            this.closeAllDropdowns();
          }
        });
        this.clickHandlerAdded = true;
      }

      // Handle keyboard navigation
      this.setupKeyboardNavigation();
      
      // Update counts after artwork data loads
      this.waitForArtworkData();
      
      console.log('✅ Filter dropdowns setup complete', {
        dropdowns: this.dropdowns.size
      });
    }

    waitForArtworkData() {
      let attempts = 0;
      const maxAttempts = 60; // Increased to wait longer for data
      
      const checkInterval = setInterval(() => {
        attempts++;
        const artworkData = this.getArtworkData();
        
        console.log(`🔄 Checking artwork data (attempt ${attempts}/${maxAttempts}):`, {
          count: artworkData?.length || 0,
          source: window.ArtGallery?.state?.allArtworks ? 'ArtGallery.state.allArtworks' :
                 window.galleryData ? 'window.galleryData' :
                 window.allArtworks ? 'window.allArtworks' : 'none'
        });
        
        if (artworkData && artworkData.length > 0) {
          clearInterval(checkInterval);
          console.log(`✅ Artwork data loaded: ${artworkData.length} artworks`);
          
          // Reset debug flag
          this._debugLogged = false;
          
          // Update all dropdown counts with multiple retries
          setTimeout(() => {
            console.log('🔄 First count update...');
            this.updateAllDropdownCounts();
          }, 500);
          setTimeout(() => {
            console.log('🔄 Second count update...');
            this.updateAllDropdownCounts();
          }, 1500);
          setTimeout(() => {
            console.log('🔄 Final count update...');
            this.updateAllDropdownCounts();
          }, 3000);
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          console.warn('⚠️ Artwork data not loaded after', maxAttempts, 'attempts');
          // Try to update anyway - might have partial data
          this.updateAllDropdownCounts();
        }
      }, 500); // Increased interval to 500ms
      
      // Also listen for custom events that indicate artwork data is ready
      const handleGalleryReady = () => {
        console.log('📢 Gallery ready event received');
        this._debugLogged = false; // Reset debug flag
        setTimeout(() => {
          this.updateAllDropdownCounts();
        }, 500);
      };
      
      const handleArtworkDataLoaded = () => {
        console.log('📢 Artwork data loaded event received');
        this._debugLogged = false; // Reset debug flag
        setTimeout(() => {
          this.updateAllDropdownCounts();
        }, 500);
      };
      
      document.addEventListener('galleryReady', handleGalleryReady);
      document.addEventListener('artworkDataLoaded', handleArtworkDataLoaded);
      
      // Also listen for DOMContentLoaded as fallback
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          setTimeout(() => {
            const data = this.getArtworkData();
            if (data && data.length > 0) {
              console.log('📢 DOMContentLoaded: artwork data available');
              this.updateAllDropdownCounts();
            }
          }, 2000);
        });
      }
      
      // Watch for changes to ArtGallery.state.allArtworks using a polling approach
      let lastDataLength = 0;
      const dataWatcher = setInterval(() => {
        const currentData = this.getArtworkData();
        const currentLength = currentData?.length || 0;
        
        if (currentLength > lastDataLength && currentLength > 0) {
          console.log(`📢 Artwork data changed: ${lastDataLength} → ${currentLength}`);
          lastDataLength = currentLength;
          this._debugLogged = false; // Reset debug flag
          this.updateAllDropdownCounts();
          
          // Stop watching after we have a reasonable amount of data
          if (currentLength >= 100) {
            clearInterval(dataWatcher);
          }
        } else if (currentLength > 0) {
          lastDataLength = currentLength;
        }
      }, 1000);
      
      // Stop watching after 60 seconds
      setTimeout(() => {
        clearInterval(dataWatcher);
      }, 60000);
    }

    // Get artwork data from metadata - check multiple sources
    getArtworkData() {
      // Check fullDataset first (might be populated before allArtworks)
      if (window.ArtGallery?.fullDataset && window.ArtGallery.fullDataset.length > 0) {
        return window.ArtGallery.fullDataset;
      }
      // Then check state.allArtworks
      if (window.ArtGallery?.state?.allArtworks && window.ArtGallery.state.allArtworks.length > 0) {
        return window.ArtGallery.state.allArtworks;
      }
      // Fallback to galleryData
      if (window.galleryData && window.galleryData.length > 0) {
        return window.galleryData;
      }
      // Last resort
      if (window.allArtworks && window.allArtworks.length > 0) {
        return window.allArtworks;
      }
      return [];
    }

    // Calculate count from metadata - matches gallery filtering logic exactly
    calculateCount(category, type = 'series') {
      const artworks = this.getArtworkData();
      
      // Debug logging for first few calculations
      if (!this._debugLogged) {
        console.log('🔍 calculateCount debug:', {
          category,
          type,
          artworksCount: artworks?.length || 0,
          dataSource: window.ArtGallery?.state?.allArtworks ? 'ArtGallery.state.allArtworks' :
                     window.galleryData ? 'window.galleryData' :
                     window.allArtworks ? 'window.allArtworks' : 'none'
        });
        this._debugLogged = true;
      }
      
      if (!artworks || artworks.length === 0) {
        console.warn(`⚠️ No artwork data for ${category} (${type})`);
        return 0;
      }

      if (category === 'all') {
        return artworks.length;
      }

      if (category === 'favorites') {
        const favorites = JSON.parse(localStorage.getItem('artworkFavorites') || '[]');
        return artworks.filter(art => favorites.includes(art.id?.toString())).length;
      }

      if (type === 'orientation') {
        const orientation = category.replace('orientation-', '');
        return artworks.filter(art => {
          // Check orientation from metadata - exact match
          if (art.orientation) {
            return art.orientation.toLowerCase() === orientation.toLowerCase();
          }
          // Fallback: check dimensions if available
          if (art.width && art.height) {
            const ratio = art.width / art.height;
            if (orientation === 'horizontal' && ratio > 1.1) return true;
            if (orientation === 'vertical' && ratio < 0.9) return true;
            if (orientation === 'square' && ratio >= 0.9 && ratio <= 1.1) return true;
          }
          return false;
        }).length;
      }

      // For status filters, check art.status field
      if (type === 'status') {
        const matches = artworks.filter(art => {
          // Exact match on status field
          if (art.status) {
            return art.status.toLowerCase() === category.toLowerCase();
          }
          // Fallback: check category field for "New"
          if (category === 'New' && art.category && art.category.toLowerCase() === 'new') {
            return true;
          }
          return false;
        });
        return matches.length;
      }

      // For series filters, use exact match on category field (like gallery does)
      const matches = artworks.filter(art => {
        if (!art.category) return false;
        // Exact match (case-insensitive) - matches gallery filtering logic
        const matches = art.category.toLowerCase() === category.toLowerCase();
        return matches;
      });
      
      // Debug specific categories
      if (['Tracings', 'Galleries', 'Collaboration', 'Framed', 'Studio'].includes(category)) {
        console.log(`📊 ${category} count:`, {
          totalArtworks: artworks.length,
          matches: matches.length,
          sampleCategories: [...new Set(artworks.slice(0, 20).map(a => a.category))]
        });
      }
      
      return matches.length;
    }

    getSeriesItems() {
      const buttons = document.querySelectorAll('.filter-btn-series[data-category]');
      return Array.from(buttons).map(btn => {
        // Clone the button to work with text without modifying original
        const clone = btn.cloneNode(true);
        // Remove count badge from clone
        const countBadge = clone.querySelector('.artwork-count-badge, .badge-animated');
        if (countBadge) countBadge.remove();
        
        // Get text content (this preserves years like "2000s")
        let label = clone.textContent.trim();
        
        // Clean up extra whitespace but preserve the actual text
        label = label.replace(/\s+/g, ' ').trim();
        
        // If label is empty or too short, use the category name as fallback
        if (!label || label.length < 2) {
          label = btn.dataset.category || 'Unknown';
          // Format category name nicely (e.g., "2000s" stays "2000s", "mr-snowmann" -> "Mr Snowmann")
          if (label.includes('-')) {
            label = label.split('-').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
          } else if (label.match(/^\d{4}s?$/)) {
            // Preserve year format like "2000s"
            label = label;
          } else {
            label = label.charAt(0).toUpperCase() + label.slice(1);
          }
        }
        
        const iconMatch = btn.querySelector('i')?.className.match(/bx-[\w-]+/);
        const icon = iconMatch ? iconMatch[0] : 'bx-palette';
        const category = btn.dataset.category;
        
        // Calculate count from metadata
        const count = this.calculateCount(category, 'series');
        
        return {
          value: category,
          label: label,
          icon: icon,
          count: count,
          element: btn
        };
      });
    }

    getStatusItems() {
      const buttons = document.querySelectorAll('.filter-btn-status[data-category]');
      return Array.from(buttons).map(btn => {
        // Clone the button to work with text without modifying original
        const clone = btn.cloneNode(true);
        // Remove count badge from clone
        const countBadge = clone.querySelector('.artwork-count-badge, .badge-animated');
        if (countBadge) countBadge.remove();
        
        // Get text content
        let label = clone.textContent.trim();
        
        // Clean up extra whitespace but preserve the actual text
        label = label.replace(/\s+/g, ' ').trim();
        
        // If label is empty or too short, use the category name as fallback
        if (!label || label.length < 2) {
          label = btn.dataset.category || 'Unknown';
          // Format category name nicely
          if (label.includes('-')) {
            label = label.split('-').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
          } else {
            label = label.charAt(0).toUpperCase() + label.slice(1);
          }
        }
        
        const iconMatch = btn.querySelector('i')?.className.match(/bx-[\w-]+/);
        const icon = iconMatch ? iconMatch[0] : 'bx-info-circle';
        const category = btn.dataset.category;
        
        // Calculate count from metadata
        const count = this.calculateCount(category, 'status');
        
        return {
          value: category,
          label: label,
          icon: icon,
          count: count,
          element: btn
        };
      });
    }

    getOrientationItems() {
      const buttons = document.querySelectorAll('.filter-btn-orientation[data-category]');
      return Array.from(buttons).map(btn => {
        // Clone the button to work with text without modifying original
        const clone = btn.cloneNode(true);
        // Remove count badge from clone
        const countBadge = clone.querySelector('.artwork-count-badge, .badge-animated');
        if (countBadge) countBadge.remove();
        
        // Get text content
        let label = clone.textContent.trim();
        
        // Clean up extra whitespace but preserve the actual text
        label = label.replace(/\s+/g, ' ').trim();
        
        // If label is empty or too short, use the category name as fallback
        if (!label || label.length < 2) {
          label = btn.dataset.category || 'Unknown';
          // Format category name nicely (e.g., "orientation-horizontal" -> "Horizontal")
          if (label.includes('-')) {
            const parts = label.split('-');
            // Skip "orientation" prefix if present
            const relevantParts = parts[0] === 'orientation' ? parts.slice(1) : parts;
            label = relevantParts.map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
          } else {
            label = label.charAt(0).toUpperCase() + label.slice(1);
          }
        }
        
        const iconMatch = btn.querySelector('i')?.className.match(/bx-[\w-]+/);
        const icon = iconMatch ? iconMatch[0] : 'bx-expand';
        const category = btn.dataset.category;
        
        // Calculate count from metadata
        const count = this.calculateCount(category, 'orientation');
        
        return {
          value: category,
          label: label,
          icon: icon,
          count: count,
          element: btn
        };
      });
    }

    convertToDropdown(type, config) {
      const container = document.getElementById('filterButtonsContainer');
      if (!container) {
        console.error('❌ Filter buttons container not found');
        return;
      }

      // Find the section label and buttons
      const label = container.querySelector(`.filter-section-label[aria-label*="${config.label}"]`);
      const buttons = Array.from(container.querySelectorAll(`.filter-btn-${type}[data-category]`));
      
      if (buttons.length === 0) {
        console.warn(`⚠️ No ${type} buttons found`);
        return;
      }
      
      console.log(`📋 Converting ${type} to dropdown:`, buttons.length, 'buttons');

      // Create dropdown wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'filter-dropdown-wrapper';
      wrapper.dataset.filterType = type;

      // Create dropdown button
      const dropdownBtn = document.createElement('button');
      dropdownBtn.className = 'filter-dropdown-btn';
      dropdownBtn.type = 'button'; // Prevent form submission
      dropdownBtn.setAttribute('aria-expanded', 'false');
      dropdownBtn.setAttribute('aria-haspopup', 'true');
      dropdownBtn.setAttribute('aria-label', `Filter by ${config.label.toLowerCase()}`);

      const labelDiv = document.createElement('div');
      labelDiv.className = 'filter-dropdown-label';
      labelDiv.innerHTML = `
        <i class="bx ${config.icon}"></i>
        <span class="filter-dropdown-label-text">${config.label}</span>
      `;

      const countSpan = document.createElement('span');
      countSpan.className = 'filter-dropdown-count';
      countSpan.textContent = '0';
      countSpan.style.display = 'none';

      const iconSpan = document.createElement('span');
      iconSpan.className = 'filter-dropdown-icon';
      iconSpan.innerHTML = '<i class="bx bx-chevron-down"></i>';

      dropdownBtn.appendChild(labelDiv);
      dropdownBtn.appendChild(countSpan);
      dropdownBtn.appendChild(iconSpan);

      // Create dropdown menu
      const menu = document.createElement('div');
      menu.className = 'filter-dropdown-menu';
      menu.setAttribute('role', 'menu');

      const menuHeader = document.createElement('div');
      menuHeader.className = 'filter-dropdown-menu-header';
      menuHeader.innerHTML = `
        <span class="filter-dropdown-menu-title">Select ${config.label}</span>
        <button class="filter-dropdown-menu-close" aria-label="Close menu">
          <i class="bx bx-x"></i>
        </button>
      `;

      const menuItems = document.createElement('div');
      menuItems.className = 'filter-dropdown-menu-items';

      // Add "All" option with calculated count
      const allCount = this.calculateCount('all', type);
      const allItem = this.createDropdownItem({
        value: 'all',
        label: `All ${config.label}`,
        icon: 'bx-grid-alt',
        count: allCount,
        isAll: true
      }, type);
      menuItems.appendChild(allItem);

      // Add separator
      const separator = document.createElement('div');
      separator.style.height = '1px';
      separator.style.background = 'var(--border-color, rgba(0, 0, 0, 0.1))';
      separator.style.margin = '0.5rem 0';
      menuItems.appendChild(separator);

      // Add items
      config.items.forEach(item => {
        const itemElement = this.createDropdownItem(item, type);
        menuItems.appendChild(itemElement);
      });

      menu.appendChild(menuHeader);
      menu.appendChild(menuItems);
      wrapper.appendChild(dropdownBtn);
      
      // Append menu to body instead of wrapper to avoid clipping issues
      // We'll position it fixed relative to the button
      document.body.appendChild(menu);
      menu.style.position = 'fixed';
      menu.style.display = 'none';
      menu.style.opacity = '0';
      menu.style.visibility = 'hidden';
      menu.style.zIndex = '99999';
      
      // Store reference to button for positioning
      menu.dataset.buttonId = `dropdown-btn-${type}-${Date.now()}`;
      dropdownBtn.id = menu.dataset.buttonId;

      // Replace buttons with dropdown
      if (label) {
        label.style.display = 'none';
      }
      
      buttons.forEach(btn => {
        btn.style.display = 'none';
      });

      // Ensure container allows overflow
      const containerStyle = window.getComputedStyle(container);
      if (containerStyle.overflow === 'hidden') {
        console.warn('⚠️ Container has overflow:hidden, fixing...');
        container.style.overflow = 'visible';
      }
      
      // Insert dropdown after "All Artworks" button and before the first divider
      const allBtn = container.querySelector('.filter-btn-all');
      const dividers = container.querySelectorAll('.filter-section-divider');
      
      if (allBtn && allBtn.nextElementSibling) {
        // Insert after "All Artworks" button
        container.insertBefore(wrapper, allBtn.nextElementSibling);
      } else if (dividers.length > 0 && dividers[0].nextElementSibling) {
        // Insert after first divider
        container.insertBefore(wrapper, dividers[0].nextElementSibling);
      } else {
        // Fallback: append to container
        container.appendChild(wrapper);
      }
      
      // Ensure wrapper is positioned correctly
      wrapper.style.position = 'relative';
      wrapper.style.zIndex = '10001';
      
      console.log(`✅ ${type} dropdown created and inserted`);

      // Store reference BEFORE setupDropdown (so menu is available)
      this.dropdowns.set(type, {
        wrapper,
        button: dropdownBtn,
        menu,
        items: config.items
      });

      // Setup dropdown functionality (after storing reference)
      this.setupDropdown(wrapper, type, config);
      
      // Update counts after a delay to ensure artwork data is loaded
      // Multiple attempts to catch data when it loads
      setTimeout(() => {
        this.updateDropdownCounts(type);
      }, 500);
      setTimeout(() => {
        this.updateDropdownCounts(type);
      }, 2000);
      setTimeout(() => {
        this.updateDropdownCounts(type);
      }, 5000);
    }

    createDropdownItem(item, type) {
      const itemElement = document.createElement('div');
      itemElement.className = `filter-dropdown-item ${item.isAll ? 'all-option' : ''}`;
      itemElement.setAttribute('role', 'menuitem');
      itemElement.dataset.value = item.value;
      itemElement.dataset.filterType = type;

      const content = document.createElement('div');
      content.className = 'filter-dropdown-item-content';
      content.innerHTML = `
        <i class="bx ${item.icon} filter-dropdown-item-icon"></i>
        <span class="filter-dropdown-item-text">${item.label}</span>
      `;

      const badge = document.createElement('span');
      badge.className = 'filter-dropdown-item-badge';
      // Format count with commas if > 0, otherwise show 0
      const countNum = parseInt(item.count) || 0;
      badge.textContent = countNum > 0 ? countNum.toLocaleString() : '0';

      itemElement.appendChild(content);
      itemElement.appendChild(badge);

      // Click handler with better error handling
      itemElement.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log(`🖱️ Dropdown item clicked: ${type} = ${item.value}`);
        this.selectFilter(type, item.value, item.label);
      });

      return itemElement;
    }

    setupDropdown(wrapper, type, config) {
      const button = wrapper.querySelector('.filter-dropdown-btn');
      
      // Get menu from dropdowns map (it's stored there after creation)
      const dropdown = this.dropdowns.get(type);
      const menu = dropdown ? dropdown.menu : null;
      
      if (!button || !menu) {
        console.error(`❌ Missing elements for ${type} dropdown:`, { button: !!button, menu: !!menu });
        return;
      }

      const closeBtn = menu.querySelector('.filter-dropdown-menu-close');

      console.log(`🔧 Setting up ${type} dropdown handlers`);

      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        console.log(`🖱️ ${type} button clicked`);
        this.toggleDropdown(type);
      });
      
      // Also handle mousedown to prevent conflicts
      button.addEventListener('mousedown', (e) => {
        e.preventDefault();
      });

      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log(`❌ ${type} close button clicked`);
          this.closeDropdown(type);
        });
      }

      // Prevent menu clicks from closing
      menu.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }

    toggleDropdown(type) {
      const dropdown = this.dropdowns.get(type);
      if (!dropdown) {
        console.error('❌ Dropdown not found for type:', type);
        return;
      }

      const isOpen = dropdown.menu.classList.contains('show');
      console.log(`🔄 Toggling ${type} dropdown:`, isOpen ? 'closing' : 'opening');

      // Close all dropdowns first
      this.closeAllDropdowns();

      if (!isOpen) {
        // Get button position for fixed positioning
        const buttonRect = dropdown.button.getBoundingClientRect();
        
        dropdown.menu.classList.add('show');
        dropdown.button.setAttribute('aria-expanded', 'true');
        dropdown.button.classList.add('active');
        
        // Position menu relative to button using fixed positioning
        // Fixed positioning uses viewport coordinates, not document coordinates
        dropdown.menu.style.position = 'fixed';
        dropdown.menu.style.top = `${buttonRect.bottom + 8}px`; // No scrollY needed for fixed
        dropdown.menu.style.left = `${buttonRect.left}px`; // No scrollX needed for fixed
        dropdown.menu.style.width = `${Math.max(220, buttonRect.width)}px`;
        dropdown.menu.style.maxWidth = '300px';
        dropdown.menu.style.zIndex = '99999';
        dropdown.menu.style.minHeight = '100px'; // Ensure it has height
        
        // Force visibility with inline styles
        dropdown.menu.style.display = 'block';
        dropdown.menu.style.opacity = '1';
        dropdown.menu.style.visibility = 'visible';
        dropdown.menu.style.pointerEvents = 'auto';
        dropdown.menu.style.transform = 'translateY(0)';
        dropdown.menu.style.background = 'white';
        dropdown.menu.style.border = '2px solid rgba(0, 0, 0, 0.1)';
        dropdown.menu.style.borderRadius = '12px';
        dropdown.menu.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)';
        dropdown.menu.style.margin = '0';
        dropdown.menu.style.padding = '0';
        dropdown.menu.style.overflow = 'visible';
        
        // Force all computed styles
        const computed = window.getComputedStyle(dropdown.menu);
        console.log(`✅ ${type} dropdown opened`, {
          buttonRect: {
            top: buttonRect.top,
            bottom: buttonRect.bottom,
            left: buttonRect.left,
            width: buttonRect.width,
            height: buttonRect.height
          },
          menuPosition: {
            top: dropdown.menu.style.top,
            left: dropdown.menu.style.left,
            width: dropdown.menu.style.width
          },
          menuRect: (() => {
            const rect = dropdown.menu.getBoundingClientRect();
            return {
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
              visible: rect.width > 0 && rect.height > 0
            };
          })(),
          computedStyles: {
            display: computed.display,
            opacity: computed.opacity,
            visibility: computed.visibility,
            zIndex: computed.zIndex,
            position: computed.position,
            top: computed.top,
            left: computed.left
          },
          inlineStyles: {
            display: dropdown.menu.style.display,
            opacity: dropdown.menu.style.opacity,
            visibility: dropdown.menu.style.visibility,
            zIndex: dropdown.menu.style.zIndex,
            position: dropdown.menu.style.position
          },
          inDOM: document.body.contains(dropdown.menu)
        });
        
        // Visual test - add a bright border temporarily
        dropdown.menu.style.border = '3px solid red';
        setTimeout(() => {
          dropdown.menu.style.border = '2px solid rgba(0, 0, 0, 0.1)';
        }, 2000);
      }
    }

    closeDropdown(type) {
      const dropdown = this.dropdowns.get(type);
      if (!dropdown) return;

      dropdown.menu.classList.remove('show');
      dropdown.button.setAttribute('aria-expanded', 'false');
      dropdown.button.classList.remove('active');
      
      // Force hide
      dropdown.menu.style.opacity = '0';
      dropdown.menu.style.visibility = 'hidden';
      dropdown.menu.style.pointerEvents = 'none';
      dropdown.menu.style.display = 'none';
    }

    closeAllDropdowns() {
      this.dropdowns.forEach((dropdown, type) => {
        this.closeDropdown(type);
      });
    }

    selectFilter(type, value, label) {
      console.log(`🎯 Selecting filter: ${type} = ${value} (${label})`);
      
      this.selectedFilters[type] = value === 'all' ? null : value;

      const dropdown = this.dropdowns.get(type);
      if (!dropdown) {
        console.error(`❌ Dropdown not found for type: ${type}`);
        return;
      }

      // Update button text and state
      const labelText = dropdown.button.querySelector('.filter-dropdown-label-text');
      const countBadge = dropdown.button.querySelector('.filter-dropdown-count');
      
      if (value === 'all') {
        // Reset to default label
        const defaultLabel = type.charAt(0).toUpperCase() + type.slice(1);
        if (labelText) labelText.textContent = defaultLabel;
        dropdown.button.classList.remove('active');
        if (countBadge) countBadge.style.display = 'none';
      } else {
        // Update with selected label
        if (labelText) labelText.textContent = label;
        dropdown.button.classList.add('active');
        // Show count if available
        const selectedItem = dropdown.menu.querySelector(`[data-value="${value}"]`);
        if (selectedItem && countBadge) {
          const itemBadge = selectedItem.querySelector('.filter-dropdown-item-badge');
          if (itemBadge && itemBadge.textContent) {
            countBadge.textContent = itemBadge.textContent;
            countBadge.style.display = 'inline-flex';
          }
        }
      }

      // Update selected state in menu
      const items = dropdown.menu.querySelectorAll('.filter-dropdown-item');
      items.forEach(item => {
        if (item.dataset.value === value) {
          item.classList.add('selected');
        } else {
          item.classList.remove('selected');
        }
      });

      // Close dropdown
      this.closeDropdown(type);

      // Trigger original filter button click
      let filterApplied = false;
      
      if (value === 'all') {
        // Click "All Artworks" button
        const allBtn = document.querySelector('.filter-btn-all[data-category="all"]');
        if (allBtn) {
          allBtn.click();
          filterApplied = true;
          console.log('✅ Clicked "All Artworks" button');
        }
      } else {
        // Find and click the matching filter button
        const originalButton = document.querySelector(`.filter-btn-${type}[data-category="${value}"]`);
        if (originalButton) {
          originalButton.click();
          filterApplied = true;
          console.log(`✅ Clicked original ${type} button for: ${value}`);
        } else {
          // Try alternative selector
          const altButton = document.querySelector(`[data-filter-group="${type}"][data-category="${value}"]`);
          if (altButton) {
            altButton.click();
            filterApplied = true;
            console.log(`✅ Clicked alternative ${type} button for: ${value}`);
          }
        }
      }

      if (!filterApplied) {
        console.warn(`⚠️ Could not find filter button for ${type}: ${value}`);
        // Try calling filterArtworks directly if available
        if (window.filterArtworks) {
          const categoryParam = value === 'all' ? null : value;
          window.filterArtworks(categoryParam, null, null, null, null);
          console.log('✅ Called filterArtworks directly');
        }
      }

      // Update active filters display
      this.updateActiveFilters();
      
      // Show feedback if method exists (optional, no error if missing)
      if (typeof this.showFilterFeedback === 'function') {
        this.showFilterFeedback(type, value, label);
      }
    }

    updateActiveFilters() {
      // This will be handled by the existing filter system
      // We just need to ensure the UI reflects the selections
    }

    // Optional method for showing filter feedback (can be overridden or extended)
    showFilterFeedback(type, value, label) {
      // Default implementation: just log to console
      // Can be extended to show visual feedback if needed
      console.log(`📢 Filter applied: ${type} = ${value} (${label})`);
    }

    // Update counts in dropdown menu items from metadata
    updateDropdownCounts(type) {
      const dropdown = this.dropdowns.get(type);
      if (!dropdown || !dropdown.menu) {
        console.warn(`⚠️ Cannot update ${type} dropdown counts: dropdown or menu missing`);
        return;
      }

      const artworkData = this.getArtworkData();
      console.log(`📊 Updating ${type} dropdown counts:`, {
        type,
        totalArtworks: artworkData?.length || 0,
        itemsToUpdate: dropdown.menu.querySelectorAll('.filter-dropdown-item').length,
        dataSource: window.ArtGallery?.state?.allArtworks ? 'ArtGallery.state.allArtworks' :
                   window.galleryData ? 'window.galleryData' :
                   window.allArtworks ? 'window.allArtworks' : 'none'
      });

      if (!artworkData || artworkData.length === 0) {
        console.warn(`⚠️ No artwork data available for ${type} dropdown counts`);
        return;
      }

      const items = dropdown.menu.querySelectorAll('.filter-dropdown-item');
      let updatedCount = 0;
      
      items.forEach(item => {
        const value = item.dataset.value;
        if (!value) return;

        const count = this.calculateCount(value, type);
        const badge = item.querySelector('.filter-dropdown-item-badge');
        if (badge) {
          badge.textContent = count > 0 ? count.toLocaleString() : '0';
          updatedCount++;
          
          // Debug all items for series type
          if (type === 'series') {
            console.log(`  ${value}: ${count} artworks`);
          }
        }
      });

      // Also update the dropdown button's count badge
      const buttonBadge = dropdown.button.querySelector('.filter-dropdown-count');
      if (buttonBadge && this.selectedFilters[type]) {
        const selectedCount = this.calculateCount(this.selectedFilters[type], type);
        buttonBadge.textContent = selectedCount > 0 ? selectedCount.toLocaleString() : '0';
      }

      console.log(`✅ Updated ${type} dropdown: ${updatedCount} items`);
    }

    // Update all dropdown counts
    updateAllDropdownCounts() {
      this.dropdowns.forEach((dropdown, type) => {
        this.updateDropdownCounts(type);
      });
    }

    setupKeyboardNavigation() {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeAllDropdowns();
        }
      });
    }

    // Public API
    getSelectedFilters() {
      return { ...this.selectedFilters };
    }

    clearFilter(type) {
      if (type) {
        this.selectFilter(type, 'all', '');
      } else {
        // Clear all
        Object.keys(this.selectedFilters).forEach(key => {
          this.selectFilter(key, 'all', '');
        });
      }
    }
  }

  // Initialize - wait for page to be ready
  function initializeFilterDropdowns() {
    if (window.filterDropdowns) {
      console.log('⚠️ Filter dropdowns already initialized');
      return;
    }
    
    console.log('🚀 Initializing filter dropdowns...');
    window.filterDropdowns = new FilterDropdowns();
  }

  // Try to initialize immediately if DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFilterDropdowns);
  } else {
    // DOM already loaded, but wait a bit for other scripts
    setTimeout(initializeFilterDropdowns, 500);
  }

  // Also listen for gallery ready event if it exists
  window.addEventListener('galleryReady', initializeFilterDropdowns);
  window.addEventListener('artGalleryReady', initializeFilterDropdowns);
  window.addEventListener('filterButtonsReady', initializeFilterDropdowns);

  // Fallback: try again after a delay
  setTimeout(() => {
    if (!window.filterDropdowns) {
      console.log('🔄 Retrying filter dropdown initialization...');
      initializeFilterDropdowns();
    }
  }, 2000);

  // Expose API
  window.FilterDropdowns = FilterDropdowns;

})();

