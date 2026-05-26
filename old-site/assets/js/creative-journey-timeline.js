/**
 * CREATIVE JOURNEY TIMELINE
 * Interactive 50-year creative evolution showcase
 * Created: 2025-11-06
 */

(function() {
  'use strict';

  // ===== TIMELINE DATA (50 Years of Creative Evolution) =====
  const timelineData = [
    {
      year: 1975,
      era: 'Origins',
      title: 'The Journey Begins',
      description: 'Jeff Neumann embarks on a creative journey spanning art, design, and innovation. Early experiments in traditional media set the foundation for decades of visual exploration.',
      tags: ['Traditional Art', 'Foundation', 'Exploration'],
      image: 'index/artworks/art0001.avif',
      milestone: true
    },
    {
      year: 1985,
      era: 'Evolution',
      title: 'Digital Awakening',
      description: 'Embracing emerging digital tools, Jeff pioneers new techniques in computer-aided design and early digital art, bridging traditional craft with technological innovation.',
      tags: ['Digital Art', 'Innovation', 'Technology'],
      image: 'index/artworks/art0050.avif'
    },
    {
      year: 1995,
      era: 'Mastery',
      title: 'UX/UI Design Renaissance',
      description: 'Transitioning into UX/UI design, Jeff shapes user experiences for enterprise platforms, applying artistic vision to functional design challenges.',
      tags: ['UX Design', 'Enterprise', 'User-Centered'],
      image: 'index/artworks/art0100.avif'
    },
    {
      year: 2005,
      era: 'Innovation',
      title: 'Guernica Series & Mixed Media',
      description: 'The iconic Guernica reimagined series begins, blending historical tragedy with contemporary commentary. Explosive mixed media work challenges perceptions of memory and war.',
      tags: ['Guernica', 'Mixed Media', 'Social Commentary'],
      image: 'index/artworks/art0150.avif',
      milestone: true
    },
    {
      year: 2015,
      era: 'Digital Age',
      title: 'AI-Powered Design Solutions',
      description: 'Pioneering AI integration in design workflows, Jeff creates intelligent design systems for healthcare and enterprise clients, merging art with machine learning.',
      tags: ['AI', 'Healthcare', 'Enterprise'],
      image: 'index/artworks/art0300.avif'
    },
    {
      year: 2020,
      era: 'Renaissance',
      title: 'Mr. Snowmann & Studio Series',
      description: 'Prolific year of experimental art production: Mr. Snowmann, Studio works, Torsos & Faces. Over 1,000 pieces created during pandemic isolation.',
      tags: ['Mr. Snowmann', 'Studio', 'Experimental'],
      image: 'index/artworks/art0500.avif',
      milestone: true
    },
    {
      year: 2025,
      era: 'Present',
      title: '1,084 Artworks & Counting',
      description: 'Complete portfolio site launched featuring 1,084 original artworks, award-winning UX/UI, and 50 years of creative rebellion. The journey continues.',
      tags: ['Portfolio', 'Complete Archive', '50 Years'],
      image: 'index/artworks/art1005.avif',
      milestone: true
    }
  ];

  // ===== GENERATE TIMELINE HTML =====
  function generateTimelineHTML() {
    const container = document.getElementById('creative-timeline');
    if (!container) return;

    container.innerHTML = `
      <div class="timeline-line"></div>
      
      <div class="timeline-header">
        <h2 class="timeline-title">50 Years of Creative Rebellion</h2>
        <p class="timeline-subtitle">A Journey Through Art, Design, and Innovation</p>
      </div>
      
      <div class="timeline-items">
        ${timelineData.map((item, index) => `
          <div class="timeline-item ${item.milestone ? 'milestone' : ''}" data-year="${item.year}">
            <div class="timeline-dot"></div>
            <div class="timeline-content" onclick="toggleTimelineItem(${index})">
              <div class="timeline-year" data-era="${item.era}">${item.year}</div>
              <h3 class="timeline-item-title">${item.title}</h3>
              <p class="timeline-item-description">${item.description}</p>
              <div class="timeline-tags">
                ${item.tags.map(tag => `<span class="timeline-tag">${tag}</span>`).join('')}
              </div>
              ${item.image ? `<img src="${item.image}" alt="${item.title}" class="timeline-image" loading="lazy">` : ''}
              <div class="timeline-expandable" id="expand-${index}">
                <!-- Additional content can go here -->
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Initialize intersection observer for reveal animations
    setupRevealAnimations();
  }

  // ===== REVEAL ANIMATIONS =====
  function setupRevealAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            // Stagger delay for sequential reveals
            setTimeout(() => {
              entry.target.classList.add('revealed');
            }, index * 100);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '50px'
      }
    );

    const items = document.querySelectorAll('.timeline-item');
    items.forEach(item => observer.observe(item));
  }

  // ===== TOGGLE EXPANDABLE CONTENT =====
  window.toggleTimelineItem = function(index) {
    const item = document.querySelectorAll('.timeline-item')[index];
    item.classList.toggle('expanded');
  };

  // ===== SCROLL TO YEAR =====
  window.scrollToYear = function(year) {
    const item = document.querySelector(`.timeline-item[data-year="${year}"]`);
    if (item) {
      item.scrollIntoView({ behavior: 'smooth', block: 'center' });
      item.classList.add('revealed');
      
      // Flash effect
      const content = item.querySelector('.timeline-content');
      content.style.animation = 'none';
      setTimeout(() => {
        content.style.animation = 'flash 0.6s ease';
      }, 10);
    }
  };

  // Flash animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes flash {
      0%, 100% { background: white; }
      50% { background: rgba(99, 102, 241, 0.1); }
    }
  `;
  document.head.appendChild(style);

  // ===== YEAR NAVIGATOR =====
  function createYearNavigator() {
    const nav = document.createElement('div');
    nav.className = 'timeline-year-nav';
    nav.style.cssText = `
      position: fixed;
      right: 2rem;
      top: 50%;
      transform: translateY(-50%);
      background: white;
      padding: 1rem;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      z-index: 100;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    `;

    timelineData.forEach(item => {
      const btn = document.createElement('button');
      btn.textContent = item.year;
      btn.className = item.milestone ? 'year-btn milestone' : 'year-btn';
      btn.style.cssText = `
        padding: 0.5rem 1rem;
        background: ${item.milestone ? 'linear-gradient(135deg, #f59e0b, #f97316)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)'};
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 700;
        cursor: pointer;
        transition: transform 0.2s ease;
        font-size: 0.875rem;
      `;
      btn.onmouseover = () => btn.style.transform = 'scale(1.1)';
      btn.onmouseout = () => btn.style.transform = 'scale(1)';
      btn.onclick = () => scrollToYear(item.year);
      nav.appendChild(btn);
    });

    // Hide on mobile
    if (window.innerWidth > 768) {
      document.body.appendChild(nav);
    }
  }

  // ===== EXPORT TIMELINE DATA =====
  window.TimelineData = timelineData;

  // ===== PUBLIC API =====
  window.CreativeTimeline = {
    generate: generateTimelineHTML,
    scrollToYear: scrollToYear,
    data: timelineData
  };

  // ===== AUTO-INITIALIZE =====
  function init() {
    // Generate timeline if container exists
    if (document.getElementById('creative-timeline')) {
      generateTimelineHTML();
      createYearNavigator();
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

// Cache bust Thu Nov 13 09:42:30 EST 2025
