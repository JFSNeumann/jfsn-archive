/**
 * Editorial Navigation Script - Shared
 * Use this script on all pages for consistent navigation
 */

(function() {
  'use strict';
  
  // Editorial Navigation Toggle
  function initEditorialNav() {
    const navToggle = document.getElementById('editorialNavToggle');
    const navClose = document.getElementById('editorialNavClose');
    const navOverlay = document.getElementById('editorialNavOverlay');
    const navLinks = document.querySelectorAll('.editorial-nav-link');
    
    if (!navToggle || !navOverlay) return;
    
    function openNav() {
      navOverlay.classList.add('active');
      navToggle.classList.add('active');
      navToggle.setAttribute('aria-expanded', 'true');
      navOverlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    
    function closeNav() {
      navOverlay.classList.remove('active');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      navOverlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
    
    navToggle.addEventListener('click', openNav);
    if (navClose) navClose.addEventListener('click', closeNav);
    
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeNav();
      });
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navOverlay.classList.contains('active')) {
        closeNav();
      }
    });
    
    // Close on outside click
    navOverlay.addEventListener('click', (e) => {
      if (e.target === navOverlay) {
        closeNav();
      }
    });
    
    // Navbar scroll effect
    const navbar = document.querySelector('.editorial-navbar');
    if (navbar) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      });
    }
  }
  
  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEditorialNav);
  } else {
    initEditorialNav();
  }
})();

