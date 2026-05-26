/**
 * BREADCRUMB NAVIGATION
 * Auto-generates breadcrumbs with SEO schema
 * Created: 2025-11-06
 */

(function() {
  'use strict';

  // ===== PAGE MAPPING =====
  const pageMap = {
    'index.html': { title: 'Home', icon: 'house-fill', parent: null },
    '': { title: 'Home', icon: 'house-fill', parent: null },
    'art.html': { title: 'Art Archive', icon: 'image-fill', parent: 'index.html' },
    'timeline.html': { title: '50-Year Journey', icon: 'clock-history', parent: 'index.html' },
    'portfolio.html': { title: 'Portfolio', icon: 'briefcase-fill', parent: 'index.html' },
    'about.html': { title: 'About', icon: 'person-fill', parent: 'index.html' },
    'contact.html': { title: 'Contact', icon: 'envelope-fill', parent: 'index.html' },
    'studies.html': { title: 'Case Studies', icon: 'journal-text', parent: 'portfolio.html' },
    'ai.html': { title: 'AI/UX Innovation', icon: 'cpu-fill', parent: 'portfolio.html' },
    'design.html': { title: 'Design Work', icon: 'palette-fill', parent: 'portfolio.html' },
    'websites.html': { title: 'Websites', icon: 'globe', parent: 'portfolio.html' },
    'sebastian-3.html': { title: 'Sebastian V3', icon: 'stars', parent: 'index.html' }
  };

  // ===== GET CURRENT PAGE =====
  function getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';
    return filename;
  }

  // ===== BUILD BREADCRUMB TRAIL =====
  function buildBreadcrumbTrail(currentPage) {
    const trail = [];
    let page = currentPage;

    // Build trail backwards from current page to home
    while (page && pageMap[page]) {
      trail.unshift({
        title: pageMap[page].title,
        icon: pageMap[page].icon,
        url: page,
        isCurrent: page === currentPage
      });

      page = pageMap[page].parent;
    }

    return trail;
  }

  // ===== RENDER BREADCRUMBS =====
  function renderBreadcrumbs() {
    const currentPage = getCurrentPage();
    const trail = buildBreadcrumbTrail(currentPage);

    // Don't show breadcrumbs on homepage
    if (currentPage === 'index.html' || currentPage === '') {
      return;
    }

    // Create breadcrumb HTML
    const breadcrumbHTML = `
      <nav class="breadcrumb-nav" id="breadcrumbNav" aria-label="Breadcrumb">
        <div class="container px-3">
          <ol class="breadcrumb-list" itemscope itemtype="https://schema.org/BreadcrumbList">
            ${trail.map((item, index) => {
              if (item.isCurrent) {
                return `
                  <li class="breadcrumb-item" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                    <span class="breadcrumb-current">
                      <i class="bi bi-${item.icon}"></i>
                      <span itemprop="name">${item.title}</span>
                    </span>
                    <meta itemprop="position" content="${index + 1}">
                  </li>
                `;
              } else {
                return `
                  <li class="breadcrumb-item" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                    <a href="${item.url}" class="breadcrumb-link" itemprop="item">
                      <i class="bi bi-${item.icon} ${item.icon === 'house-fill' ? 'breadcrumb-home' : ''}"></i>
                      <span itemprop="name">${item.title}</span>
                    </a>
                    <meta itemprop="position" content="${index + 1}">
                    ${index < trail.length - 1 ? '<span class="breadcrumb-separator">›</span>' : ''}
                  </li>
                `;
              }
            }).join('')}
          </ol>
        </div>
      </nav>
    `;

    // Insert after navbar
    const navbar = document.querySelector('.navbar, nav.header');
    if (navbar && navbar.parentNode) {
      const breadcrumb = document.createElement('div');
      breadcrumb.innerHTML = breadcrumbHTML;
      navbar.parentNode.insertBefore(breadcrumb.firstElementChild, navbar.nextSibling);
    }
  }

  // ===== SHOW/HIDE ON SCROLL =====
  function initScrollBehavior() {
    const breadcrumb = document.getElementById('breadcrumbNav');
    if (!breadcrumb) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateBreadcrumb() {
      const currentScrollY = window.scrollY;

      // Show breadcrumb after scrolling down 150px
      if (currentScrollY > 150) {
        breadcrumb.classList.add('visible');
      } else {
        breadcrumb.classList.remove('visible');
      }

      lastScrollY = currentScrollY;
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateBreadcrumb);
        ticking = true;
      }
    }, { passive: true });

    // Initial check
    updateBreadcrumb();
  }

  // ===== GENERATE JSON-LD SCHEMA =====
  function generateBreadcrumbSchema() {
    const currentPage = getCurrentPage();
    const trail = buildBreadcrumbTrail(currentPage);

    // Don't add schema to homepage
    if (currentPage === 'index.html' || currentPage === '' || trail.length <= 1) {
      return;
    }

    const schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": trail.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.title,
        "item": `https://jfsn.com/${item.url}`
      }))
    };

    // Check if schema already exists
    const existingSchema = document.querySelector('script[type="application/ld+json"]');
    let schemaExists = false;

    if (existingSchema) {
      try {
        const existingData = JSON.parse(existingSchema.textContent);
        if (existingData['@type'] === 'BreadcrumbList') {
          schemaExists = true;
        }
      } catch(e) {
        // Invalid JSON, continue
      }
    }

    // Only add if doesn't exist
    if (!schemaExists) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema, null, 2);
      document.head.appendChild(script);
    }
  }

  // ===== INITIALIZE =====
  function init() {
    renderBreadcrumbs();
    initScrollBehavior();
    generateBreadcrumbSchema();
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

