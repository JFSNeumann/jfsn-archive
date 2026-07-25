/* audio-player.js — JFSN oral history audio player
   Minimal, accessible, keyboard-friendly. */

(function() {
  'use strict';

  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init() {
    const player = document.getElementById('audio-player');
    if (!player) return;

    const audio = player.querySelector('audio');
    const playBtn = player.querySelector('[data-action="play"]');
    const timeline = player.querySelector('[data-action="timeline"]');
    const volumeControl = player.querySelector('[data-action="volume"]');
    const currentTimeEl = player.querySelector('.audio-time-current');
    const durationEl = player.querySelector('.audio-time-total');

    if (!audio || !playBtn || !timeline) return;

    // ─────────────────────── State ───────────────────────

    let isPlaying = false;
    let isDraggingTimeline = false;

    // ─────────────────────── Play/Pause ───────────────────────

    function updatePlayButton() {
      playBtn.textContent = isPlaying ? '⏸' : '▶';
      playBtn.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
    }

    playBtn.addEventListener('click', () => {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    });

    audio.addEventListener('play', () => {
      isPlaying = true;
      updatePlayButton();
    });

    audio.addEventListener('pause', () => {
      isPlaying = false;
      updatePlayButton();
    });

    // ─────────────────────── Timeline ───────────────────────

    function formatTime(seconds) {
      if (isNaN(seconds)) return '0:00';
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60);
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    }

    audio.addEventListener('loadedmetadata', () => {
      if (durationEl) durationEl.textContent = formatTime(audio.duration);
      timeline.max = audio.duration;
    });

    audio.addEventListener('timeupdate', () => {
      if (!isDraggingTimeline) {
        timeline.value = audio.currentTime;
      }
      if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
    });

    timeline.addEventListener('pointerdown', () => {
      isDraggingTimeline = true;
    });

    timeline.addEventListener('pointermove', (e) => {
      if (!isDraggingTimeline) return;
      const rect = timeline.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      const newTime = pos * audio.duration;
      if (!isNaN(newTime)) {
        audio.currentTime = Math.max(0, Math.min(newTime, audio.duration));
        timeline.value = audio.currentTime;
        if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
      }
    });

    timeline.addEventListener('pointerup', () => {
      isDraggingTimeline = false;
    });

    timeline.addEventListener('pointerleave', () => {
      isDraggingTimeline = false;
    });

    // Fallback: mouse/touch input on timeline (non-pointer)
    timeline.addEventListener('input', () => {
      audio.currentTime = timeline.value;
    });

    // ─────────────────────── Volume ───────────────────────

    if (volumeControl) {
      volumeControl.value = audio.volume;
      volumeControl.addEventListener('input', () => {
        audio.volume = volumeControl.value;
      });
    }

    // ─────────────────────── Keyboard Shortcuts ───────────────────────

    player.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        playBtn.click();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        audio.currentTime = Math.max(0, audio.currentTime - 5);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
      }
    });

    // ─────────────────────── A11y ───────────────────────

    player.setAttribute('tabindex', '0');
    timeline.setAttribute('aria-label', 'Audio timeline');
    if (volumeControl) volumeControl.setAttribute('aria-label', 'Volume');

    // Live region for screen readers
    let liveRegion = document.getElementById('audio-live');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'audio-live';
      liveRegion.className = 'sr-only';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      document.body.appendChild(liveRegion);
    }

    // Announce when playing starts
    audio.addEventListener('play', () => {
      const title = player.dataset.title || 'Audio';
      liveRegion.textContent = `Now playing: ${title}`;
    });

    audio.addEventListener('pause', () => {
      liveRegion.textContent = '';
    });
  }

  // ─────────────────────── Go ───────────────────────

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
