/**
 * Page Config Loader
 * Dynamically populates meta tags and structured data from page-config JSON
 * 
 * Usage:
 *   <script type="application/json" id="page-config">
 *   {
 *     "title": "Page Title",
 *     "description": "Page description",
 *     ...
 *   }
 *   </script>
 *   <script src="assets/js/page-config-loader.js"></script>
 */

(function() {
  'use strict';

  function loadPageConfig() {
    const configEl = document.getElementById('page-config');
    if (!configEl) return;
    
    try {
      const config = JSON.parse(configEl.textContent);
      
      // Update title
      if (config.title) {
        const titleEl = document.getElementById('page-title');
        if (titleEl) {
          titleEl.textContent = config.title;
        }
        document.title = config.title;
      }
      
      // Update meta tags
      if (config.description) {
        const descEl = document.getElementById('page-description');
        if (descEl) descEl.setAttribute('content', config.description);
        
        const ogDescEl = document.getElementById('og-description');
        if (ogDescEl) ogDescEl.setAttribute('content', config.description);
        
        const twitterDescEl = document.getElementById('twitter-description');
        if (twitterDescEl) twitterDescEl.setAttribute('content', config.description);
      }
      
      if (config.keywords) {
        const keywordsEl = document.getElementById('page-keywords');
        if (keywordsEl) keywordsEl.setAttribute('content', config.keywords);
      }
      
      if (config.canonical) {
        const canonicalEl = document.getElementById('canonical-url');
        if (canonicalEl) canonicalEl.setAttribute('href', config.canonical);
      }
      
      if (config.ogImage) {
        const ogImageEl = document.getElementById('og-image');
        if (ogImageEl) ogImageEl.setAttribute('content', config.ogImage);
        
        const twitterImageEl = document.getElementById('twitter-image');
        if (twitterImageEl) twitterImageEl.setAttribute('content', config.ogImage);
      }
      
      if (config.title) {
        const ogTitleEl = document.getElementById('og-title');
        if (ogTitleEl) ogTitleEl.setAttribute('content', config.title);
        
        const twitterTitleEl = document.getElementById('twitter-title');
        if (twitterTitleEl) twitterTitleEl.setAttribute('content', config.title);
      }
      
      // Update structured data
      if (config.breadcrumb && Array.isArray(config.breadcrumb)) {
        const structuredDataEl = document.getElementById('structured-data');
        if (structuredDataEl) {
          try {
            const structuredData = JSON.parse(structuredDataEl.textContent);
            structuredData.name = config.title || structuredData.name;
            structuredData.description = config.description || structuredData.description;
            structuredData.url = config.canonical || structuredData.url;
            
            if (config.breadcrumb.length > 0) {
              structuredData.breadcrumb.itemListElement = config.breadcrumb.map((item, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": item.name,
                "item": item.url
              }));
            }
            
            structuredDataEl.textContent = JSON.stringify(structuredData);
          } catch (e) {
            // Failed to update structured data - silently fail
            if (window.debugError) window.debugError('Failed to update structured data', e);
          }
        }
      }
    } catch (e) {
      // Failed to parse page config - silently fail
      if (window.debugError) window.debugError('Failed to parse page config', e);
    }
  }

  // Run immediately if DOM is ready, otherwise wait for DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPageConfig);
  } else {
    loadPageConfig();
  }
})();

