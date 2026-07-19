/**
 * JFSN Archive — Motion Utilities
 * Exports reusable choreography patterns powered by anime.js
 * Reference: docs/current/MOTION-SPEC.md
 */

import { Timeline, animate, easings } from 'animejs'

// Create a simple anime object interface for consistency with the UMD build
const anime = {
  timeline: (config) => new Timeline(config),
  animate: animate,
  stagger: (value, config) => {
    // Create a stagger function compatible with timeline
    if (typeof value === 'number') {
      return (target, index) => index * value + (config?.start || 0)
    }
    return value
  },
  easings: easings
}

/**
 * PATTERN: Room Arrival (Guernica Passage model)
 * Hero fades in → Title enters (staggered) → Subtitle reveals → Header slides
 * Total duration: ~1200ms
 * Reference: MOTION-SPEC.md § V, Pattern: Room Arrival
 */
export const roomArrival = ({
  hero,
  title,
  subtitle,
  header,
  heroDelay = 0,
  autoplay = true
}) => {
  const timeline = anime.timeline({ autoplay })

  timeline
    // Hero: fade in with discovery easing (800ms)
    .add(
      {
        targets: hero,
        opacity: [0, 1],
        duration: 800,
        easing: 'easeOutQuad'
      },
      heroDelay
    )
    // Title: scale + opacity, ink-stamp style (500ms, delayed 200ms from hero start)
    .add(
      {
        targets: title,
        opacity: [0, 1],
        scale: [0, 1.08, 1],
        duration: 500,
        easing: 'easeOutQuad'
      },
      heroDelay + 200
    )
    // Subtitle: fade up from below (400ms, delayed 800ms from hero start)
    .add(
      {
        targets: subtitle,
        opacity: [0, 1],
        translateY: [8, 0],
        duration: 400,
        easing: 'easeOutQuad'
      },
      heroDelay + 800
    )
    // Header: fade in (300ms, parallel with subtitle)
    .add(
      {
        targets: header,
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuad'
      },
      heroDelay + 800
    )

  return timeline
}

/**
 * PATTERN: Door Passage (Threshold Ritual)
 * Clicked door border sweeps → Veil colors room → Siblings retreat
 * Total duration: 400ms
 * Reference: MOTION-SPEC.md § V, Pattern: Door Passage
 */
export const doorPassage = ({
  clickedDoor,
  siblings,
  veil,
  roomColor = '#0c0a09',
  autoplay = true
}) => {
  const timeline = anime.timeline({ autoplay })

  timeline
    // Clicked door: border expands left-to-right (400ms, discovery easing)
    .add(
      {
        targets: clickedDoor,
        borderLeftWidth: ['0px', '100%'],
        opacity: [1, 0],
        duration: 400,
        easing: 'easeOutQuad'
      },
      0
    )
    // Door text: fade right (200ms, closure easing, staggered start)
    .add(
      {
        targets: `${clickedDoor} .sub`,
        opacity: [1, 0],
        translateX: [0, 12],
        duration: 200,
        easing: 'easeInQuad'
      },
      150
    )
    // Veil: color transition to room color (300ms, closure easing, immediate)
    .add(
      {
        targets: veil,
        backgroundColor: [
          'rgb(12, 10, 9)',
          `rgb(${parseInt(roomColor.slice(1, 3), 16)}, ${parseInt(roomColor.slice(3, 5), 16)}, ${parseInt(roomColor.slice(5, 7), 16)})`
        ],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeInQuad'
      },
      0
    )
    // Siblings: fade out + retreat (300ms each, staggered by 50ms)
    .add(
      {
        targets: siblings,
        opacity: [1, 0],
        translateX: (el, i) => (i % 2 === 0 ? -10 : 10), // alternate left/right
        duration: 300,
        easing: 'easeInQuad',
        delay: anime.stagger(50)
      },
      50
    )

  return timeline
}

/**
 * PATTERN: Grid Stagger (Load More / Filter Results)
 * Cards enter with staggered fade + rise
 * Duration per card: 350ms, stagger: 40ms (light) or 30ms (capped)
 * Reference: MOTION-SPEC.md § V, Pattern: Grid Stagger
 */
export const gridStagger = ({
  cards,
  staggerDelay = 40,
  capAt = 300,
  autoplay = true
}) => {
  const timeline = anime.timeline({ autoplay })

  // If capAt is set, calculate effective stagger to not exceed cap
  const effectiveStagger = Math.min(staggerDelay, capAt / cards.length)

  timeline.add(
    {
      targets: cards,
      opacity: [0, 1],
      translateY: [8, 0],
      duration: 350,
      easing: 'easeOutQuad',
      delay: anime.stagger(effectiveStagger, { start: 0 })
    },
    0
  )

  return timeline
}

/**
 * PATTERN: Micro-Interaction (Hover Feedback)
 * Card lifts, shadow grows → user moves away → snappy settle back
 * Duration: 250ms out, 100ms in
 * Reference: MOTION-SPEC.md § V, Pattern: Micro-Interaction
 */
export const cardHoverLift = ({
  card,
  duration = 200,
  liftDistance = 2,
  autoplay = false
}) => {
  return anime.timeline({ autoplay })
    .add(
      {
        targets: card,
        translateY: -liftDistance,
        boxShadow: '0 12px 32px rgba(255, 102, 0, 0.16)',
        duration: duration,
        easing: 'easeOutElastic'
      },
      0
    )
}

export const cardHoverSettle = ({
  card,
  duration = 100,
  autoplay = false
}) => {
  return anime.timeline({ autoplay })
    .add(
      {
        targets: card,
        translateY: 0,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0)',
        duration: duration,
        easing: 'easeOutQuad'
      },
      0
    )
}

/**
 * PATTERN: Veil Fade (Page Transition Overlay)
 * Fade in on navigation, reset on bfcache return
 * Duration: 220ms (closure easing)
 * Reference: MOTION-SPEC.md § V
 */
export const veilFade = ({ veil, fadeIn = true, autoplay = true }) => {
  return anime.timeline({ autoplay })
    .add(
      {
        targets: veil,
        opacity: fadeIn ? [0, 1] : [1, 0],
        duration: 220,
        easing: 'easeInQuad'
      },
      0
    )
}

/**
 * PATTERN: Accumulation Stack (Artwork page)
 * New stack item enters with depth-based scale + opacity
 * Duration: 320ms entrance, 240ms exit
 * Reference: docs/current/MOTION-SPEC.md § V (future expansion)
 */
export const stackItemEnter = ({
  element,
  fromOpacity = 0,
  fromScale = 0.7,
  fromZ = 60,
  autoplay = true
}) => {
  return anime.timeline({ autoplay })
    .add(
      {
        targets: element,
        opacity: [fromOpacity, 1],
        scale: [fromScale, 0.85],
        translateZ: [fromZ, 10],
        duration: 320,
        easing: 'easeOutQuad'
      },
      0
    )
}

export const stackItemExit = ({
  element,
  toOpacity = 0,
  toScale = 0.7,
  toZ = 60,
  autoplay = true,
  callback = null
}) => {
  return anime.timeline({ autoplay })
    .add(
      {
        targets: element,
        opacity: [1, toOpacity],
        scale: [0.85, toScale],
        translateZ: [10, toZ],
        duration: 240,
        easing: 'easeInQuad',
        complete: callback
      },
      0
    )
}

/**
 * PATTERN: Scroll Cue Pulse (Bounce animation)
 * Infinite vertical bounce
 * Duration: 2s loop
 * Reference: MOTION-SPEC.md § II (Micro duration, but looped)
 */
export const scrollCuePulse = ({ element, autoplay = true }) => {
  return anime.timeline({ autoplay, loop: true })
    .add(
      {
        targets: element,
        translateY: [0, -8, 0],
        duration: 2000,
        easing: 'easeInOutQuad'
      },
      0
    )
}

/**
 * Utility: Get room color by room name
 * Reference: MOTION-SPEC.md § IV, Room Identity Colors
 */
export const getRoomColor = (roomName) => {
  const roomColors = {
    guernica: '#0d0a08', // warm black
    studio: '#0c0a09', // neutral
    openings: '#0c0a09', // neutral
    flooded: '#0a0d12', // cool black
    archive: '#0c0a09', // neutral
    current: '#0c0a09' // neutral
  }
  return roomColors[roomName.toLowerCase()] || '#0c0a09'
}

// Export anime itself for advanced timelines
export { anime }
