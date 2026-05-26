/**
 * Gallery Randomization - Simple Direct Approach
 * Shuffles artworks array directly when detected
 */

(function() {
  'use strict';

  let shuffled = false;

  // Fisher-Yates shuffle
  function shuffleArray(arr) {
    if (!Array.isArray(arr) || arr.length < 2) return arr;
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  // Direct shuffle function
  function doShuffle() {
    if (shuffled) return;
    
    const state = window.ArtGallery?.state;
    if (!state) return false;

    // Shuffle filteredArtworks (what gets displayed)
    if (state.filteredArtworks && Array.isArray(state.filteredArtworks) && state.filteredArtworks.length > 0) {
      const original = state.filteredArtworks;
      const shuffled = shuffleArray(original);
      
      // Replace the array
      state.filteredArtworks = shuffled;
      
      // If allArtworks is the same reference, shuffle it too
      if (state.allArtworks === original) {
        state.allArtworks = shuffled;
      } else if (state.allArtworks && state.allArtworks.length === original.length) {
        state.allArtworks = shuffleArray(state.allArtworks);
      }
      
      console.log('🎲 SHUFFLED ARTWORKS!', {
        count: shuffled.length,
        first3: shuffled.slice(0, 3).map(a => a.file || a.title || 'unknown')
      });
      
      shuffled = true;
      return true;
    }
    
    // Fallback: shuffle allArtworks
    if (state.allArtworks && Array.isArray(state.allArtworks) && state.allArtworks.length > 0) {
      const shuffled = shuffleArray(state.allArtworks);
      state.allArtworks = shuffled;
      state.filteredArtworks = shuffled;
      
      console.log('🎲 SHUFFLED allArtworks!', {
        count: shuffled.length,
        first3: shuffled.slice(0, 3).map(a => a.file || a.title || 'unknown')
      });
      
      shuffled = true;
      return true;
    }
    
    return false;
  }

  // Aggressive polling - check every 50ms
  function startPolling() {
    let attempts = 0;
    const maxAttempts = 200; // 10 seconds total
    
    const poll = setInterval(() => {
      attempts++;
      
      if (doShuffle()) {
        clearInterval(poll);
        console.log('✅ Shuffle completed after', attempts * 50, 'ms');
        return;
      }
      
      if (attempts >= maxAttempts) {
        clearInterval(poll);
        console.warn('⚠️ Shuffle timeout - artworks may not be loaded yet');
      }
    }, 50);
  }

  // Override renderGallery to shuffle before rendering
  function hookRenderGallery() {
    let checkCount = 0;
    const maxChecks = 100;
    
    const check = setInterval(() => {
      checkCount++;
      const original = window.renderGallery || window.ArtGallery?.renderGallery;
      
      if (original) {
        clearInterval(check);
        
        window.renderGallery = function(append, fadeIn) {
          // Shuffle before first render
          if (!append && !shuffled) {
            doShuffle();
          }
          return original.call(this, append, fadeIn);
        };
        
        if (window.ArtGallery) {
          window.ArtGallery.renderGallery = window.renderGallery;
        }
        
        console.log('✅ renderGallery hooked');
      } else if (checkCount >= maxChecks) {
        clearInterval(check);
      }
    }, 50);
  }

  // Listen for categoriesPopulated event
  document.addEventListener('categoriesPopulated', () => {
    setTimeout(() => {
      if (!shuffled) {
        doShuffle();
      }
    }, 100);
  }, { once: false });

  // Create a shuffled array wrapper that intercepts push operations
  function createShuffledArrayWrapper(originalArray) {
    if (!Array.isArray(originalArray)) return originalArray;
    
    const shuffled = shuffleArray(originalArray);
    const wrapper = shuffled;
    
    // Override push to shuffle after adding items
    wrapper.push = function(...items) {
      const result = Array.prototype.push.apply(this, items);
      // Reshuffle the entire array after push
      const currentArray = [...this];
      const reshuffled = shuffleArray(currentArray);
      // Replace all items
      this.length = 0;
      Array.prototype.push.apply(this, reshuffled);
      return result;
    };
    
    return wrapper;
  }
  
  // Wrap state object properties immediately when available
  function wrapStateObject() {
    if (!window.ArtGallery) {
      window.ArtGallery = window.ArtGallery || {};
    }
    
    if (!window.ArtGallery.state) {
      window.ArtGallery.state = window.ArtGallery.state || {
        allArtworks: [],
        filteredArtworks: [],
        currentPage: 1,
        itemsPerPage: 24,
        isLoading: false,
        hasMoreItems: true,
        showingCategoryReps: false,
        hasUserInteracted: false
      };
    }
    
    const state = window.ArtGallery.state;
    
    // Wrap filteredArtworks
    let _filteredArtworks = state.filteredArtworks || [];
    Object.defineProperty(state, 'filteredArtworks', {
      get() { return _filteredArtworks; },
      set(value) {
        if (Array.isArray(value) && value.length > 0) {
          if (!shuffled) {
            // First time - shuffle it
            _filteredArtworks = shuffleArray(value);
            console.log('🎲 SHUFFLED filteredArtworks via setter!', { 
              count: _filteredArtworks.length,
              first3: _filteredArtworks.slice(0, 3).map(a => a.file || a.title || '?')
            });
            shuffled = true;
          } else {
            // Already shuffled - keep it shuffled if it's a new array
            if (value !== _filteredArtworks && value.length === _filteredArtworks.length) {
              // Same length but different reference - reshuffle
              _filteredArtworks = shuffleArray(value);
            } else {
              _filteredArtworks = value;
            }
          }
        } else {
          _filteredArtworks = value;
        }
      },
      enumerable: true,
      configurable: true
    });
    
    // Wrap allArtworks
    let _allArtworks = state.allArtworks || [];
    Object.defineProperty(state, 'allArtworks', {
      get() { return _allArtworks; },
      set(value) {
        if (Array.isArray(value) && value.length > 0) {
          if (!shuffled) {
            // First time - shuffle it
            _allArtworks = shuffleArray(value);
            console.log('🎲 SHUFFLED allArtworks via setter!', { 
              count: _allArtworks.length,
              first3: _allArtworks.slice(0, 3).map(a => a.file || a.title || '?')
            });
            shuffled = true;
            // Also update filteredArtworks if it's empty or same reference
            if (!_filteredArtworks || _filteredArtworks.length === 0 || _filteredArtworks === value) {
              _filteredArtworks = _allArtworks;
            }
          } else {
            // If push was used, we need to reshuffle
            if (value !== _allArtworks && value.length > _allArtworks.length) {
              // More items added - reshuffle
              _allArtworks = shuffleArray(value);
              console.log('🎲 RESHUFFLED allArtworks after items added!', { 
                count: _allArtworks.length
              });
              // Update filteredArtworks if it was the same
              if (_filteredArtworks === value || _filteredArtworks.length < _allArtworks.length) {
                _filteredArtworks = _allArtworks;
              }
            } else {
              _allArtworks = value;
            }
          }
        } else {
          _allArtworks = value;
        }
      },
      enumerable: true,
      configurable: true
    });
    
    console.log('✅ State object wrapped with setters');
  }
  
  // Wrap immediately
  wrapStateObject();
  
  // Also wrap after delays
  setTimeout(wrapStateObject, 10);
  setTimeout(wrapStateObject, 50);
  
  // Watch for when all artworks are loaded (after processRemainingArtworks completes)
  setTimeout(() => {
    const state = window.ArtGallery?.state;
    if (state && state.allArtworks && state.allArtworks.length > 100 && !shuffled) {
      // All artworks loaded but not shuffled yet - shuffle now
      state.allArtworks = shuffleArray(state.allArtworks);
      state.filteredArtworks = state.allArtworks;
      shuffled = true;
      console.log('🎲 SHUFFLED complete artwork list!', { count: state.allArtworks.length });
    }
  }, 3000);
  
  // Also check periodically for complete list
  let checkCount = 0;
  const completeCheck = setInterval(() => {
    checkCount++;
    const state = window.ArtGallery?.state;
    if (state && state.allArtworks && state.allArtworks.length >= 1000) {
      // Looks like all artworks are loaded
      if (!shuffled || state.allArtworks.length !== state.filteredArtworks.length) {
        state.allArtworks = shuffleArray(state.allArtworks);
        state.filteredArtworks = state.allArtworks;
        shuffled = true;
        console.log('🎲 SHUFFLED complete artwork list (late check)!', { count: state.allArtworks.length });
      }
      clearInterval(completeCheck);
    }
    if (checkCount >= 40) clearInterval(completeCheck); // Stop after 4 seconds
  }, 100);

  // Start immediately
  startPolling();
  hookRenderGallery();
  
  // Also try on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        startPolling();
        hookRenderGallery();
      }, 100);
    });
  }
  
  // Try after various delays
  [500, 1000, 2000, 3000].forEach(delay => {
    setTimeout(() => {
      if (!shuffled) {
        doShuffle();
      }
    }, delay);
  });

  console.log('🎲 Gallery randomization script loaded - will shuffle when artworks are detected');
})();
