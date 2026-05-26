/**
 * FULL-SCREEN NAVIGATION MENU
 * Animated Overlay, Particles, Category Previews
 */

(function() {
  'use strict';

  let navOpen = false;
  let particles = [];

  // Initialize navigation
  function initNav() {
    createNavHTML();
    createParticles();
    setupEventListeners();
  }

  // Create navigation HTML
  function createNavHTML() {
    const navHTML = `
      <div class="fullscreen-nav" id="fullscreenNav" aria-hidden="true">
        <div class="nav-particles" id="navParticles"></div>
        <button class="nav-close" id="navClose" aria-label="Close navigation">
          <i class="bx bx-x"></i>
        </button>
        <div class="nav-content">
          <ul class="nav-links">
            <li><a href="/" data-preview="home">Home</a></li>
            <li><a href="about.html" data-preview="about">About</a></li>
            <li><a href="portfolio.html" data-preview="portfolio">Portfolio</a></li>
            <li><a href="art.html" data-preview="art">Art Gallery</a></li>
            <li><a href="contact.html" data-preview="contact">Contact</a></li>
          </ul>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', navHTML);
  }

  // Create particle background
  function createParticles() {
    const container = document.getElementById('navParticles');
    if (!container) return;

    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'nav-particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 15 + 's';
      particle.style.animationDuration = (10 + Math.random() * 10) + 's';
      container.appendChild(particle);
    }
  }

  // Setup event listeners
  function setupEventListeners() {
    const nav = document.getElementById('fullscreenNav');
    const navClose = document.getElementById('navClose');
    const navLinks = document.querySelectorAll('.nav-links a');
    const navToggle = document.querySelector('[data-nav-toggle]');

    // Open navigation
    if (navToggle) {
      navToggle.addEventListener('click', openNav);
    }

    // Close navigation
    if (navClose) {
      navClose.addEventListener('click', closeNav);
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // M key - Toggle navigation
      if ((e.key === 'm' || e.key === 'M') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        if (navOpen) {
          closeNav();
        } else {
          openNav();
        }
      }
      
      // Escape key - Close navigation
      if (e.key === 'Escape' && navOpen) {
        closeNav();
      }
    });

    // Close on backdrop click
    if (nav) {
      nav.addEventListener('click', (e) => {
        if (e.target === nav) {
          closeNav();
        }
      });
    }

    // Handle link clicks
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        // Close nav after short delay for smooth transition
        setTimeout(() => {
          closeNav();
        }, 100);
      });

      // Category previews on hover
      link.addEventListener('mouseenter', (e) => {
        showPreview(e.target.dataset.preview);
      });
      
      link.addEventListener('mouseleave', () => {
        // Remove preview after delay
        setTimeout(() => {
          const preview = nav.querySelector('.nav-category-preview');
          if (preview && !nav.matches(':hover')) {
            preview.remove();
          }
        }, 300);
      });
    });
  }

  // Open navigation
  function openNav() {
    const nav = document.getElementById('fullscreenNav');
    if (!nav) return;

    nav.classList.add('active');
    nav.setAttribute('aria-hidden', 'false');
    navOpen = true;
    document.body.style.overflow = 'hidden';

    // Announce to screen readers
    const liveRegion = document.getElementById('aria-live-region');
    if (liveRegion) {
      liveRegion.textContent = 'Navigation menu opened';
    }
  }

  // Close navigation
  function closeNav() {
    const nav = document.getElementById('fullscreenNav');
    if (!nav) return;

    nav.classList.remove('active');
    nav.setAttribute('aria-hidden', 'true');
    navOpen = false;
    document.body.style.overflow = '';

    // Announce to screen readers
    const liveRegion = document.getElementById('aria-live-region');
    if (liveRegion) {
      liveRegion.textContent = 'Navigation menu closed';
    }
  }

  // Show category preview
  function showPreview(previewType) {
    const nav = document.getElementById('fullscreenNav');
    if (!nav) return;
    
    // Remove existing preview
    const existingPreview = nav.querySelector('.nav-category-preview');
    if (existingPreview) {
      existingPreview.remove();
    }
    
    // Category preview data
    const previews = {
      home: {
        title: 'Home',
        description: 'Explore 50 years of visual rebellion',
        image: 'artworks/art1070.avif'
      },
      about: {
        title: 'About',
        description: 'Learn about the artist and creative journey',
        image: 'artworks/art1005.avif'
      },
      portfolio: {
        title: 'Portfolio',
        description: 'Professional design and creative work',
        image: 'artworks/art1020.avif'
      },
      art: {
        title: 'Art Gallery',
        description: '1,084+ original artworks spanning five decades',
        image: 'artworks/art1001.avif'
      },
      contact: {
        title: 'Contact',
        description: 'Get in touch about commissions and collaborations',
        image: 'artworks/art1002.avif'
      }
    };
    
    const preview = previews[previewType];
    if (!preview) return;
    
    // Create preview element
    const previewEl = document.createElement('div');
    previewEl.className = 'nav-category-preview';
    previewEl.innerHTML = `
      <div class="nav-preview-card">
        <img src="${preview.image}" alt="${preview.title}" loading="lazy">
        <h4>${preview.title}</h4>
        <p>${preview.description}</p>
      </div>
    `;
    
    const navContent = nav.querySelector('.nav-content');
    if (navContent) {
      navContent.appendChild(previewEl);
      // Trigger fade-in animation
      setTimeout(() => {
        previewEl.style.opacity = '1';
      }, 10);
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    initNav();
  }

  // Export for external use
  window.FullscreenNav = {
    open: openNav,
    close: closeNav
  };
})();

