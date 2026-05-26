/**
 * Table of Contents Navigation
 * Auto-generated sticky sidebar navigation
 */

(function() {
  'use strict';
  
  let tocContainer = null;
  let tocList = null;
  let tocToggle = null;
  let sections = [];
  let activeSection = null;
  let observer = null;
  let isVisible = false;
  
  // Initialize Table of Contents
  function initTableOfContents() {
    // Create TOC container if it doesn't exist
    if (!document.getElementById('tableOfContents')) {
      createTOCContainer();
    }
    
    tocContainer = document.getElementById('tableOfContents');
    tocList = document.getElementById('tocList');
    tocToggle = document.getElementById('tocToggle');
    
    if (!tocContainer || !tocList) return;
    
    // Find all sections with headings
    sections = findSections();
    
    if (sections.length === 0) {
      tocContainer.style.display = 'none';
      return;
    }
    
    // Generate TOC items
    generateTOC();
    
    // Setup scroll spy
    setupScrollSpy();
    
    // Setup toggle button
    if (tocToggle) {
      // Initialize toggle state (collapsed by default)
      tocToggle.setAttribute('aria-expanded', 'false');
      const icon = tocToggle.querySelector('i');
      if (icon) {
        icon.className = 'bx bx-chevron-down';
      }
      tocToggle.addEventListener('click', toggleTOC);
    }
    
    // Show TOC immediately if sections exist, then update on scroll
    if (sections.length > 0) {
      tocContainer.style.display = 'block';
      // Show immediately but keep collapsed by default
      setTimeout(() => {
        tocContainer.classList.add('visible');
        tocContainer.classList.add('collapsed'); // Default to collapsed
        isVisible = true;
      }, 100);
    }
    checkTOCVisibility();
    window.addEventListener('scroll', throttle(checkTOCVisibility, 100), { passive: true });
    
    // Handle window resize
    window.addEventListener('resize', debounce(handleResize, 250), { passive: true });
  }
  
    // Create TOC container HTML
    function createTOCContainer() {
      const toc = document.createElement('nav');
      toc.id = 'tableOfContents';
      toc.className = 'table-of-contents';
      toc.setAttribute('aria-label', 'Table of contents');
      toc.style.display = 'block'; // Make sure it's visible
      toc.innerHTML = `
        <div class="table-of-contents-header">
          <h2 class="table-of-contents-title">Contents</h2>
          <button class="table-of-contents-toggle" id="tocToggle" aria-label="Toggle table of contents" aria-expanded="false">
            <i class="bx bx-chevron-down"></i>
          </button>
        </div>
        <ul class="table-of-contents-list" id="tocList"></ul>
      `;
      document.body.appendChild(toc);
    }
  
  // Find all sections with headings
  function findSections() {
    const headings = document.querySelectorAll('main h2, main h3, main h4, section h2, section h3, section h4, #main-content h2, #main-content h3, #main-content h4');
    const foundSections = [];
    
    headings.forEach((heading, index) => {
      // Skip if heading is inside a modal or keyboard shortcuts overlay
      if (heading.closest('.modal, .keyboard-shortcuts-overlay')) return;
      
      // Allow headings inside cards (they're valid content)
      
      // Get or create ID
      let id = heading.id;
      if (!id) {
        id = `section-${index}-${heading.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        heading.id = id;
      }
      
      const level = parseInt(heading.tagName.charAt(1));
      const text = heading.textContent.trim();
      
      foundSections.push({
        id,
        text,
        level,
        element: heading,
        top: heading.getBoundingClientRect().top + window.scrollY
      });
    });
    
    return foundSections;
  }
  
  // Generate TOC items
  function generateTOC() {
    if (!tocList) return;
    
    tocList.innerHTML = '';
    
    sections.forEach(section => {
      const li = document.createElement('li');
      li.className = `table-of-contents-item level-${section.level}`;
      
      const a = document.createElement('a');
      a.href = `#${section.id}`;
      a.className = 'table-of-contents-link';
      a.textContent = section.text;
      a.setAttribute('data-section-id', section.id);
      
      // Smooth scroll
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById(section.id);
        if (target) {
          const offset = 80;
          const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Update URL without jumping
          history.pushState(null, '', `#${section.id}`);
        }
      });
      
      li.appendChild(a);
      tocList.appendChild(li);
    });
  }
  
  // Setup scroll spy
  function setupScrollSpy() {
    if (!window.IntersectionObserver) {
      // Fallback for older browsers
      window.addEventListener('scroll', throttle(updateActiveSection, 100), { passive: true });
      return;
    }
    
    const options = {
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };
    
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const sectionId = entry.target.id;
        const link = tocList?.querySelector(`[data-section-id="${sectionId}"]`);
        
        if (entry.isIntersecting) {
          if (link) {
            setActiveLink(link);
            activeSection = sectionId;
          }
        }
      });
    }, options);
    
    sections.forEach(section => {
      if (section.element) {
        observer.observe(section.element);
      }
    });
  }
  
  // Update active section (fallback)
  function updateActiveSection() {
    if (!tocList) return;
    
    const scrollPosition = window.scrollY + 100;
    let current = null;
    
    sections.forEach(section => {
      if (section.top <= scrollPosition) {
        current = section;
      }
    });
    
    if (current && current.id !== activeSection) {
      const link = tocList.querySelector(`[data-section-id="${current.id}"]`);
      if (link) {
        setActiveLink(link);
        activeSection = current.id;
      }
    }
  }
  
  // Set active link
  function setActiveLink(activeLink) {
    if (!tocList) return;
    
    const links = tocList.querySelectorAll('.table-of-contents-link');
    links.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
    
    // Scroll TOC to show active link
    const tocRect = tocContainer.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();
    
    if (linkRect.bottom > tocRect.bottom || linkRect.top < tocRect.top) {
      activeLink.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
  
    // Check TOC visibility
    function checkTOCVisibility() {
      if (!tocContainer) return;
      
      const scrollY = window.scrollY;
      const shouldShow = scrollY > 300 && sections.length > 0;
      
      if (shouldShow && !isVisible) {
        tocContainer.classList.add('visible');
        tocContainer.style.display = 'block';
        isVisible = true;
      } else if (!shouldShow && isVisible) {
        tocContainer.classList.remove('visible');
        // Don't hide completely, just make it less visible
        // tocContainer.style.display = 'none';
        isVisible = false;
      }
      
      // Always show if we have sections, regardless of scroll
      if (sections.length > 0) {
        tocContainer.style.display = 'block';
        if (scrollY > 100) {
          tocContainer.classList.add('visible');
          isVisible = true;
        }
      }
    }
  
  // Toggle TOC
  function toggleTOC() {
    if (!tocContainer || !tocToggle) return;
    
    const isExpanded = tocToggle.getAttribute('aria-expanded') === 'true';
    const newExpandedState = !isExpanded;
    tocToggle.setAttribute('aria-expanded', newExpandedState);
    
    const icon = tocToggle.querySelector('i');
    if (icon) {
      icon.className = newExpandedState ? 'bx bx-chevron-up' : 'bx bx-chevron-down';
    }
    
    // On mobile, toggle entire TOC visibility
    if (window.innerWidth <= 992) {
      tocContainer.classList.toggle('visible');
    } else {
      // On desktop, toggle list collapse/expand
      tocContainer.classList.toggle('collapsed');
    }
  }
  
  // Handle resize
  function handleResize() {
    sections = findSections();
    generateTOC();
    
    if (observer) {
      observer.disconnect();
      setupScrollSpy();
    }
  }
  
  // Utility: Throttle
  function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // Utility: Debounce
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTableOfContents);
  } else {
    initTableOfContents();
  }
  
  // Export for global use
  window.initTableOfContents = initTableOfContents;
})();

