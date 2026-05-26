/**
 * Emotion-Based Design System
 * Adapts UI based on user interactions and time of day
 */

(function() {
  'use strict';
  
  // Wait for unified observer manager to be available
  function initEmotionDesign() {
    if (!window.ObserverManager || !window.DOMCache) {
      setTimeout(initEmotionDesign, 50);
      return;
    }
    
    // Emotional feedback for interactions
    function addEmotionalFeedback() {
      // Energy highlights for call-to-action
      const energyElements = window.DOMCache.getAll('.energy-highlight, [data-energy="true"]');
      energyElements.forEach(el => {
        el.classList.add('energy-highlight');
      });
    }
    
    // Color transitions on scroll
    function initColorTransitions() {
      const sections = window.DOMCache.getAll('.color-transition-section, section');
      
      sections.forEach(section => {
        window.ObserverManager.observe(section, function(entry) {
          if (entry.isIntersecting) {
            const scrollPercent = entry.intersectionRatio;
            const hue = Math.floor(scrollPercent * 360);
            entry.target.style.setProperty('--scroll-hue', hue);
          }
        }, {
          threshold: Array.from({ length: 100 }, (_, i) => i / 100)
        });
      });
    }
    
    // Time-based adaptations
    function initTimeBasedAdaptations() {
      const hour = new Date().getHours();
      const isNight = hour >= 22 || hour < 6;
      const isEvening = hour >= 18 && hour < 22;
      
      if (isNight || isEvening) {
        document.documentElement.setAttribute('data-time-context', isNight ? 'night' : 'evening');
        
        // Warmer colors for evening/night
        const style = document.createElement('style');
        style.textContent = `
          [data-time-context="night"] {
            --brand-primary: #7c3aed;
            filter: brightness(0.95);
          }
          [data-time-context="evening"] {
            --brand-primary: #8b5cf6;
          }
        `;
        document.head.appendChild(style);
      }
    }
    
    // Emotional state detection
    function detectEmotionalState() {
      // Based on user interactions
      let interactionCount = 0;
      let lastInteraction = Date.now();
      
      document.addEventListener('click', () => {
        interactionCount++;
        lastInteraction = Date.now();
      });
      
      // High engagement = energy mode
      setInterval(() => {
        const timeSinceLastInteraction = Date.now() - lastInteraction;
        if (interactionCount > 10 && timeSinceLastInteraction < 5000) {
          document.body.classList.add('high-engagement');
        } else {
          document.body.classList.remove('high-engagement');
        }
      }, 1000);
    }
    
    // Initialize
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        addEmotionalFeedback();
        initColorTransitions();
        initTimeBasedAdaptations();
        detectEmotionalState();
      });
    } else {
      addEmotionalFeedback();
      initColorTransitions();
      initTimeBasedAdaptations();
      detectEmotionalState();
    }
  }
  
  // Start initialization
  initEmotionDesign();
})();
