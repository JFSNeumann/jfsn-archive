/**
 * CONTACT PAGE SPECIFIC JAVASCRIPT
 * Extracted from contact.html inline scripts
 * Date: January 9, 2026
 * 
 * Contains all page-specific functionality for contact.html:
 * - Hero images visibility
 * - Hamburger menu event delegation
 * - Keyboard shortcuts overlay
 * - Screen reader announcements
 * - Intersection Observer for animations
 * - Form validation with security features
 * - Toast notification system
 * - Drone animations
 * - UX/UI features component loading
 */

(function() {
  'use strict';

  // ============================================
  // 1. HERO IMAGES VISIBILITY
  // Force hero images visible IMMEDIATELY
  // ============================================
  (function() {
    const img1 = document.getElementById('heroImage1');
    const img2 = document.getElementById('heroImage2');
    const container = document.querySelector('.hero-image-container');
    
    if (img1) {
      img1.style.opacity = '1';
      img1.style.visibility = 'visible';
      img1.style.display = 'block';
      img1.style.position = 'absolute';
      img1.style.top = '0';
      img1.style.left = '0';
      img1.style.width = '100%';
      img1.style.height = '100%';
      img1.style.zIndex = '1';
      img1.style.objectFit = 'cover';
      img1.classList.add('hero-image-active');
    }
    if (img2) {
      img2.style.visibility = 'visible';
      img2.style.display = 'block';
      img2.style.position = 'absolute';
      img2.style.top = '0';
      img2.style.left = '0';
      img2.style.width = '100%';
      img2.style.height = '100%';
      img2.style.zIndex = '1';
      img2.style.objectFit = 'cover';
    }
  })();

  // ============================================
  // 2. HAMBURGER MENU EVENT DELEGATION
  // ============================================
  (function() {
    let menuInitialized = false;
    
    // Hamburger menu is handled by navbar.js - no custom handlers needed
    // navbar.js has MutationObserver to watch for dynamically loaded navbars
    
    // Ensure toggle button is always clickable (CSS only, no event handlers)
    function ensureToggleWorks() {
      const toggle = document.getElementById('editorialNavToggle');
      const overlay = document.getElementById('editorialNavOverlay');
      
      if (toggle && overlay) {
        // Make sure button is clickable and above other content
        toggle.style.pointerEvents = 'auto';
        toggle.style.cursor = 'pointer';
        toggle.style.zIndex = '10001';
        
        // Ensure overlay is properly positioned
        if (!overlay.style.position) {
          overlay.style.position = 'fixed';
          overlay.style.zIndex = '99998';
        }
      }
    }
    
    // Try multiple times to ensure CSS properties are set
    setTimeout(ensureToggleWorks, 100);
    setTimeout(ensureToggleWorks, 500);
    setTimeout(ensureToggleWorks, 1000);
    
    // Watch for navbar being loaded and ensure CSS properties
    const observer = new MutationObserver(function() {
      ensureToggleWorks();
    });
    
    const navbarSection = document.getElementById('navbar-section');
    if (navbarSection) {
      observer.observe(navbarSection, {
        childList: true,
        subtree: true
      });
    }
  })();

  // ============================================
  // 3. ENHANCED FEATURES JAVASCRIPT
  // Keyboard Shortcuts & Screen Reader Announcements
  // ============================================
  (function() {
    // Mark body as JS-enabled immediately
    document.documentElement.classList.add('js-enabled');
  
    // ============================================
    // KEYBOARD SHORTCUTS OVERLAY
    // ============================================
    function setupKeyboardShortcuts() {
      document.addEventListener('keydown', (e) => {
        // Don't trigger if typing in input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
          if (e.key === 'Escape' && e.target.id === 'navbarSearchInput') {
            const searchInput = document.getElementById('navbarSearchInput');
            if (searchInput && searchInput.value) {
              searchInput.value = '';
              const clearBtn = document.getElementById('navbarSearchClear');
              if (clearBtn) clearBtn.click();
            }
          }
          return;
        }
        
        // Escape - Close shortcuts overlay or search overlay
        if (e.key === 'Escape') {
          const shortcutsOverlay = document.getElementById('keyboardShortcutsOverlay');
          if (shortcutsOverlay && shortcutsOverlay.classList.contains('active')) {
            shortcutsOverlay.classList.remove('active');
            shortcutsOverlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            return;
          }
          
          const searchOverlay = document.getElementById('navbarSearchOverlay');
          if (searchOverlay && searchOverlay.classList.contains('active')) {
            const closeBtn = document.getElementById('navbarSearchClose');
            if (closeBtn) closeBtn.click();
            return;
          }
        }
        
        // ? - Show shortcuts help (DISABLED - user doesn't want to see this)
        // if (e.key === '?' && !e.shiftKey) {
        //   e.preventDefault();
        //   showKeyboardShortcutsHelp();
        // }
        
        // D - Toggle dark mode
        if ((e.key === 'd' || e.key === 'D') && !e.ctrlKey && !e.metaKey && !e.altKey) {
          const themeToggle = document.getElementById('themeToggle');
          if (themeToggle) {
            e.preventDefault();
            themeToggle.click();
          }
        }
      });
    }
    
    function showKeyboardShortcutsHelp() {
      const overlay = document.getElementById('keyboardShortcutsOverlay');
      if (!overlay) return;
      
      overlay.classList.add('active');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      
      // Focus close button
      const closeBtn = document.getElementById('keyboardShortcutsClose');
      if (closeBtn) {
        setTimeout(() => closeBtn.focus(), 100);
      }
      
      // Close handlers
      const closeOverlay = () => {
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      };
      
      // Close button (CSP compliant - use addEventListener)
      if (closeBtn) {
        closeBtn.addEventListener('click', closeOverlay);
      }
      
      // Close on backdrop click (CSP compliant - use addEventListener)
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          closeOverlay();
        }
      };
    }
    
    // ============================================
    // ENHANCED SCREEN READER ANNOUNCEMENTS
    // ============================================
    function announceToScreenReader(message, priority = 'polite') {
      let liveRegion;
      
      // Choose appropriate live region based on priority
      if (priority === 'assertive') {
        liveRegion = document.getElementById('aria-live-region-assertive');
      } else if (priority === 'status') {
        liveRegion = document.getElementById('aria-live-region-status');
      } else {
        liveRegion = document.getElementById('aria-live-region');
      }
      
      if (liveRegion) {
        // Clear previous message
        liveRegion.textContent = '';
        
        // Small delay to ensure screen reader picks up the change
        setTimeout(() => {
          liveRegion.textContent = message;
          
          // Clear after announcement (longer for assertive)
          const clearDelay = priority === 'assertive' ? 2000 : 1000;
          setTimeout(() => {
            liveRegion.textContent = '';
          }, clearDelay);
        }, 100);
      }
    }
    
    // Initialize functions
    setupKeyboardShortcuts();
    
    // Export functions globally
    window.announceToScreenReader = announceToScreenReader;
  })();

  // ============================================
  // 4. INTERSECTION OBSERVER FOR ANIMATIONS
  // ============================================
  (function() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('.card, section, .timeline-item').forEach(el => {
        el.classList.add('fade-in-on-scroll');
        observer.observe(el);
      });
    });
  })();

  // ============================================
  // 5. FORM VALIDATION WITH SECURITY FEATURES
  // ============================================
  (function() {
    const form = document.getElementById('contactForm');
    if (!form) return; // Exit if form doesn't exist
    
    const liveRegion = document.getElementById('aria-live-region');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = submitBtn ? submitBtn.querySelector('.submit-text') : null;
    const submitSpinner = submitBtn ? submitBtn.querySelector('.submit-spinner') : null;
    const rateLimitMessage = document.getElementById('rateLimitMessage');
    const messageTextarea = document.getElementById('message');
    const messageCharCount = document.getElementById('messageCharCount');
    const honeypotField = document.getElementById('website');

    // Rate Limiting - Store in sessionStorage
    const RATE_LIMIT_KEY = 'contactFormLastSubmit';
    const RATE_LIMIT_DELAY = 60000; // 60 seconds between submissions

    // CSRF Token Generation (client-side fallback, should be server-side)
    function generateCSRFToken() {
      const tokenField = document.getElementById('csrf_token');
      if (!tokenField) return;
      
      const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      tokenField.value = token;
      sessionStorage.setItem('csrf_token', token);
      return token;
    }

    // Input Sanitization
    function sanitizeInput(input) {
      if (!input) return '';
      return input
        .replace(/[<>]/g, '') // Remove HTML tags
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, '') // Remove event handlers
        .trim()
        .substring(0, 2000); // Limit length
    }

    // Email Validation
    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email) && email.length <= 255;
    }

    // Check Rate Limit
    function checkRateLimit() {
      if (!rateLimitMessage) return true;
      
      const lastSubmit = sessionStorage.getItem(RATE_LIMIT_KEY);
      if (lastSubmit) {
        const timeSinceLastSubmit = Date.now() - parseInt(lastSubmit, 10);
        if (timeSinceLastSubmit < RATE_LIMIT_DELAY) {
          const remainingTime = Math.ceil((RATE_LIMIT_DELAY - timeSinceLastSubmit) / 1000);
          rateLimitMessage.textContent = `Too many requests. Please wait ${remainingTime} seconds before submitting again.`;
          rateLimitMessage.style.display = 'block';
          return false;
        }
      }
      rateLimitMessage.style.display = 'none';
      return true;
    }

    // Set Rate Limit
    function setRateLimit() {
      sessionStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());
    }

    // Character Counter
    if (messageTextarea && messageCharCount) {
      messageTextarea.addEventListener('input', function() {
        const length = this.value.length;
        messageCharCount.textContent = length;
        if (length > 1900) {
          messageCharCount.classList.add('text-warning');
        } else {
          messageCharCount.classList.remove('text-warning');
        }
      });
    }

    // Initialize CSRF Token
    generateCSRFToken();

    // Initialize floating labels for select dropdowns
    function initSelectFloatingLabels() {
      const selectDropdowns = form.querySelectorAll('.form-floating-enhanced select');
      selectDropdowns.forEach(select => {
        // Update label position based on selected value
        function updateSelectLabel() {
          if (select.value && select.value !== '') {
            select.classList.add('has-value');
            select.setAttribute('data-has-value', 'true');
          } else {
            select.classList.remove('has-value');
            select.removeAttribute('data-has-value');
          }
        }
        
        // Initial check
        updateSelectLabel();
        
        // Update on change and focus
        select.addEventListener('change', updateSelectLabel);
        select.addEventListener('focus', updateSelectLabel);
        select.addEventListener('blur', updateSelectLabel);
      });
    }

    // Announce to screen readers
    function announce(message) {
      if (liveRegion) {
        liveRegion.textContent = message;
        setTimeout(() => {
          liveRegion.textContent = '';
        }, 1000);
      }
    }

    // Real-time validation with sanitization
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      // Skip honeypot field
      if (input.id === 'website' || input.name === 'website') return;

      input.addEventListener('blur', function() {
        // Sanitize on blur
        if (this.type !== 'email' && this.tagName !== 'SELECT') {
          const sanitized = sanitizeInput(this.value);
          if (sanitized !== this.value) {
            this.value = sanitized;
          }
        }
        
        // Email validation
        if (this.type === 'email' && this.value) {
          if (!isValidEmail(this.value)) {
            this.setCustomValidity('Please provide a valid email address.');
            this.classList.remove('is-valid');
            this.classList.add('is-invalid');
            return;
          } else {
            this.setCustomValidity('');
          }
        }
        
        if (this.checkValidity()) {
          this.classList.remove('is-invalid');
          this.classList.add('is-valid');
        } else {
          this.classList.remove('is-valid');
          this.classList.add('is-invalid');
        }
      });
      
      input.addEventListener('input', function() {
        if (this.classList.contains('is-invalid') && this.checkValidity()) {
          this.classList.remove('is-invalid');
          this.classList.add('is-valid');
        }
      });
    });

    // Initialize select floating labels after DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initSelectFloatingLabels);
    } else {
      initSelectFloatingLabels();
    }

    form.addEventListener('submit', function(event) {
      event.preventDefault();
      event.stopPropagation();

      // Check honeypot (if filled, it's a bot)
      if (honeypotField && honeypotField.value !== '') {
        if (window.DEBUG) console.warn('Bot detected via honeypot');
        announce('Submission blocked.');
        if (typeof showToast === 'function') {
          showToast('Submission blocked.', 'error', 3000);
        }
        form.reset();
        generateCSRFToken();
        return false;
      }

      // Check rate limit
      if (!checkRateLimit()) {
        announce('Please wait before submitting again.');
        return false;
      }

      // Validate form
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        
        // Clear previous error states
        inputs.forEach(input => {
          if (input.id !== 'website') {
            input.setAttribute('aria-invalid', 'false');
            const errorElement = document.getElementById(input.id + '-error');
            if (errorElement) {
              errorElement.textContent = input.validationMessage || getDefaultErrorMessage(input);
            }
          }
        });
        
        // Set error states for invalid fields
        const invalidFields = form.querySelectorAll(':invalid:not(#website)');
        invalidFields.forEach(field => {
          field.setAttribute('aria-invalid', 'true');
          field.classList.add('is-invalid');
          field.classList.remove('is-valid');
          
          // Update error message
          const errorElement = document.getElementById(field.id + '-error');
          if (errorElement) {
            errorElement.textContent = field.validationMessage || getDefaultErrorMessage(field);
            errorElement.style.display = 'block';
          }
          
          // Announce error
          announce(`${field.labels?.[0]?.textContent || field.name}: ${field.validationMessage || getDefaultErrorMessage(field)}`);
        });
        
        // Focus first invalid field
        const firstInvalid = invalidFields[0];
        if (firstInvalid) {
          firstInvalid.focus();
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        // General error message
        announce('Please correct the errors above before submitting.');
        if (typeof showToast === 'function') {
          showToast(`Please correct ${invalidFields.length} error${invalidFields.length > 1 ? 's' : ''} before submitting.`, 'error', 5000);
        }
        
        return false;
      }
      
      // Clear error states if form is valid
      inputs.forEach(input => {
        if (input.id !== 'website') {
          input.setAttribute('aria-invalid', 'false');
          input.classList.remove('is-invalid');
          input.classList.add('is-valid');
          const errorElement = document.getElementById(input.id + '-error');
          if (errorElement) {
            errorElement.style.display = 'none';
          }
        }
      });

      // Sanitize all inputs before submission
      const nameField = document.getElementById('name');
      const emailField = document.getElementById('email');
      const subjectField = document.getElementById('subject');
      const messageField = document.getElementById('message');
      const csrfField = document.getElementById('csrf_token');
      
      if (!nameField || !emailField || !subjectField || !messageField || !csrfField) {
        announce('Form fields not found.');
        return false;
      }
      
      const formData = {
        name: sanitizeInput(nameField.value),
        email: emailField.value.trim().toLowerCase(),
        subject: subjectField.value,
        message: sanitizeInput(messageField.value),
        csrf_token: csrfField.value,
        timestamp: Date.now()
      };

      // Validate email again
      if (!isValidEmail(formData.email)) {
        emailField.setCustomValidity('Please provide a valid email address.');
        emailField.classList.add('is-invalid');
        announce('Please provide a valid email address.');
        return false;
      }

      // Show loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        if (submitText) submitText.style.display = 'none';
        if (submitSpinner) submitSpinner.style.display = 'inline-block';
      }

      // Submit to server-side handler
      fetch('/api/contact.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => Promise.reject(err));
        }
        return response.json();
      })
      .then(data => {
        if (data.success) {
          // Set rate limit
          setRateLimit();
          
          // Success
          announce(data.message || 'Thank you for your message! I will get back to you soon.');
          if (typeof showToast === 'function') {
            showToast(data.message || 'Thank you for your message! I will get back to you soon.', 'success', 5000);
          } else {
            alert(data.message || 'Thank you for your message! I will get back to you soon.');
          }
          
          // Reset form
          form.reset();
          form.classList.remove('was-validated');
          generateCSRFToken();
          
          // Remove validation classes
          inputs.forEach(input => {
            input.classList.remove('is-valid', 'is-invalid');
            if (input.id === 'message' && messageCharCount) {
              messageCharCount.textContent = '0';
              messageCharCount.classList.remove('text-warning');
            }
          });
        } else {
          throw new Error(data.error || 'Submission failed');
        }
      })
      .catch(error => {
        // Handle errors
        let errorMessage = 'Failed to send message. Please try again later.';
        
        if (error.errors && Array.isArray(error.errors)) {
          // Field-specific errors
          error.errors.forEach(err => {
            const field = document.getElementById(err.field);
            if (field) {
              field.classList.add('is-invalid');
              field.setCustomValidity(err.message);
            }
          });
          errorMessage = 'Please correct the errors above.';
        } else if (error.error) {
          errorMessage = error.error;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        announce(errorMessage);
        if (typeof showToast === 'function') {
          showToast(errorMessage, 'error', 5000);
        } else {
          alert(errorMessage);
        }
        
        // Focus first invalid field
        const firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) {
          firstInvalid.focus();
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      })
      .finally(() => {
        // Reset button state
        if (submitBtn) {
          submitBtn.disabled = false;
          if (submitText) submitText.style.display = 'inline';
          if (submitSpinner) submitSpinner.style.display = 'none';
        }
      });
    }, false);
    
    // Initialize Bootstrap tooltips
    document.addEventListener('DOMContentLoaded', () => {
      if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
          return new bootstrap.Tooltip(tooltipTriggerEl);
        });
      }
    });
  })();

  // ============================================
  // 6. TOAST NOTIFICATION SYSTEM
  // ============================================
  (function() {
    function showToast(message, type = 'info', duration = 5000) {
      const container = document.getElementById('toastContainer');
      if (!container) return;
      
      const toast = document.createElement('div');
      toast.className = `toast-notification ${type}`;
      const icons = { 
        success: '<i class="bx bx-check-circle"></i>', 
        error: '<i class="bx bx-error-circle"></i>', 
        info: '<i class="bx bx-info-circle"></i>' 
      };
      toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" aria-label="Close">&times;</button>
      `;
      
      container.appendChild(toast);
      
      toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.style.animation = 'toastSlideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
      });
      
      setTimeout(() => {
        if (toast.parentNode) {
          toast.style.animation = 'toastSlideOut 0.3s ease forwards';
          setTimeout(() => toast.remove(), 300);
        }
      }, duration);
    }
    
    // Export globally
    window.showToast = showToast;
  })();

  // ============================================
  // 7. DRONE ANIMATIONS PERFORMANCE OPTIMIZATION
  // ============================================
  (function() {
    const squadron = document.querySelector('.contact-drone-squadron');
    if (!squadron) return;
    
    function shouldAnimate() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
      if (document.hidden) return false;
      return true;
    }
    
    function initAnimations() {
      if (shouldAnimate()) {
        if (document.readyState === 'complete') {
          setTimeout(() => squadron.classList.add('loaded'), 1500);
        } else {
          window.addEventListener('load', () => setTimeout(() => squadron.classList.add('loaded'), 1500));
        }
      } else {
        squadron.style.display = 'none';
      }
    }
    
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        squadron.classList.remove('loaded');
      } else if (shouldAnimate()) {
        squadron.classList.add('loaded');
      }
    });
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAnimations);
    } else {
      initAnimations();
    }
  })();

  // ============================================
  // 8. LOAD UX/UI FEATURES HTML COMPONENTS
  // ============================================
  (function() {
    const container = document.getElementById('ux-ui-features-section');
    if (!container) {
      // Create container if it doesn't exist
      const div = document.createElement('div');
      div.id = 'ux-ui-features-section';
      document.body.appendChild(div);
    }
    const targetContainer = document.getElementById('ux-ui-features-section');
    if (targetContainer) {
      fetch('components/ux-ui-features-2026.html')
        .then(response => response.text())
        .then(html => {
          targetContainer.innerHTML = html;
        })
        .catch(err => console.warn('Could not load UX/UI features components:', err));
    }
  })();

})();
