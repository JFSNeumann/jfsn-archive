/**
 * SHAKE TO SHUFFLE - Creative Easter Egg!
 * Shake your phone to see a random artwork
 */

(function() {
  'use strict';

  // Only run on mobile
  if (window.innerWidth > 992) return;

  const CONFIG = {
    shakeThreshold: 15, // Acceleration threshold
    shakeTimeout: 1000, // Time between shakes
    cooldown: 3000 // Cooldown between activations
  };

  let lastShakeTime = 0;
  let shakeCount = 0;
  let cooldownTimer = null;

  /**
   * Show shake animation overlay
   */
  const showShakeOverlay = () => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.95);
      backdrop-filter: blur(20px);
      color: white;
      padding: 2rem;
      border-radius: 24px;
      z-index: 10000;
      text-align: center;
      max-width: 280px;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
    `;
    
    overlay.innerHTML = `
      <div style="font-size: 4rem; margin-bottom: 1rem; animation: shakeIcon 0.5s ease;">
        🎲
      </div>
      <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem;">
        Shake Detected!
      </h3>
      <p style="font-size: 0.875rem; opacity: 0.9; margin-bottom: 0;">
        Loading random artwork...
      </p>
    `;
    
    // Add shake animation
    if (!document.getElementById('shakeIconStyles')) {
      const style = document.createElement('style');
      style.id = 'shakeIconStyles';
      style.textContent = `
        @keyframes shakeIcon {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-15deg); }
          75% { transform: rotate(15deg); }
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(overlay);
    
    setTimeout(() => overlay.style.opacity = '1', 10);
    setTimeout(() => overlay.style.opacity = '0', 1500);
    setTimeout(() => overlay.remove(), 1800);
  };

  /**
   * Navigate to random artwork
   */
  const goToRandomArtwork = () => {
    showShakeOverlay();
    
    // Heavy haptic feedback pattern
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate([50, 100, 50, 100, 50]);
    }
    
    setTimeout(() => {
      window.location.href = 'art.html?random=true';
    }, 1500);
  };

  /**
   * Handle device motion
   */
  const handleMotion = (event) => {
    if (cooldownTimer) return;
    
    const acceleration = event.accelerationIncludingGravity;
    if (!acceleration) return;
    
    const totalAcceleration = Math.abs(acceleration.x) + 
                             Math.abs(acceleration.y) + 
                             Math.abs(acceleration.z);
    
    const now = Date.now();
    
    if (totalAcceleration > CONFIG.shakeThreshold) {
      if (now - lastShakeTime < CONFIG.shakeTimeout) {
        shakeCount++;
        
        // If shaken 2+ times quickly, trigger
        if (shakeCount >= 2) {
          goToRandomArtwork();
          shakeCount = 0;
          
          // Set cooldown
          cooldownTimer = setTimeout(() => {
            cooldownTimer = null;
          }, CONFIG.cooldown);
        }
      } else {
        shakeCount = 1;
      }
      
      lastShakeTime = now;
    }
  };

  /**
   * Request motion permission (iOS 13+)
   */
  const requestMotionPermission = () => {
    if (typeof DeviceMotionEvent !== 'undefined' && 
        typeof DeviceMotionEvent.requestPermission === 'function') {
      
      // iOS 13+ requires permission
      DeviceMotionEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            window.addEventListener('devicemotion', handleMotion, { passive: true });
          }
        })
        .catch(console.error);
    } else {
      // Non-iOS or older iOS
      window.addEventListener('devicemotion', handleMotion, { passive: true });
    }
  };

  /**
   * Show first-time tutorial
   */
  const showTutorial = () => {
    // Check if tutorial was shown before
    if (localStorage.getItem('shakeTutorialShown')) return;
    
    const tutorial = document.createElement('div');
    tutorial.style.cssText = `
      position: fixed;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(99, 102, 241, 0.95);
      backdrop-filter: blur(10px);
      color: white;
      padding: 16px 24px;
      border-radius: 24px;
      font-size: 0.875rem;
      font-weight: 600;
      z-index: 2003;
      text-align: center;
      max-width: 280px;
      opacity: 0;
      transition: opacity 0.3s ease;
      box-shadow: 0 4px 20px rgba(99, 102, 241, 0.5);
    `;
    
    tutorial.innerHTML = `
      <div style="font-size: 2rem; margin-bottom: 0.5rem;">📱</div>
      <div style="margin-bottom: 0.75rem;">
        <strong>Secret Feature Unlocked!</strong>
      </div>
      <div style="opacity: 0.95; font-size: 0.8rem; line-height: 1.4;">
        Shake your phone to discover random artwork
      </div>
    `;
    
    document.body.appendChild(tutorial);
    
    setTimeout(() => tutorial.style.opacity = '1', 100);
    setTimeout(() => tutorial.style.opacity = '0', 5000);
    setTimeout(() => tutorial.remove(), 5300);
    
    localStorage.setItem('shakeTutorialShown', 'true');
  };

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    // Auto-request permission after 3 seconds
    setTimeout(() => {
      requestMotionPermission();
      
      // Show tutorial after 5 seconds
      setTimeout(showTutorial, 2000);
    }, 3000);
  });

  // Export for manual trigger
  window.ShakeToShuffle = {
    requestPermission: requestMotionPermission,
    showTutorial: showTutorial
  };

})();

