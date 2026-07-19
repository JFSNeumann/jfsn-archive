/**
 * JFSN Archive — Motion Utilities
 * Exports reusable choreography patterns powered by anime.js v4
 * Reference: docs/current/MOTION-SPEC.md
 *
 * anime.js v4 API note: Timeline#add(targets, params, position) takes
 * targets as a SEPARATE first argument, not a `targets` key inside params.
 * Property names are `ease` (not `easing`), `onComplete` (not `complete`),
 * `onUpdate` (not `update`). Timeline instances are thenable directly
 * (no `.finished` property) — await the timeline itself.
 */

import { createTimeline, stagger as animeStagger, eases } from 'animejs'

const anime = {
  timeline: (config) => createTimeline(config),
  stagger: animeStagger,
  eases
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
    .add(hero, { opacity: [0, 1], duration: 800, ease: 'outQuad' }, heroDelay)
    .add(title, { opacity: [0, 1], scale: [0, 1.08, 1], duration: 500, ease: 'outQuad' }, heroDelay + 200)
    .add(subtitle, { opacity: [0, 1], translateY: [8, 0], duration: 400, ease: 'outQuad' }, heroDelay + 800)
    .add(header, { opacity: [0, 1], duration: 300, ease: 'outQuad' }, heroDelay + 800)

  return timeline
}

/**
 * PATTERN: Room Retreat (Spatial Exit Theater)
 * Current room content fades + scales down as visitor leaves
 * Veil fades in and transitions to new room color
 * Total duration: 300ms
 * Reference: MOTION-SPEC.md § V (WOW expansion)
 */
export const roomRetreat = ({
  body,
  veil,
  newRoomColor = '#0c0a09',
  autoplay = true
}) => {
  const timeline = anime.timeline({ autoplay })

  timeline
    .add(body, { opacity: [1, 0], scale: [1, 0.92], duration: 300, ease: 'inQuad' }, 0)
    .add(veil, { opacity: [0, 1], backgroundColor: newRoomColor, duration: 300, ease: 'inQuad' }, 0)

  return timeline
}

/**
 * PATTERN: Room Approach (Spatial Entry Theater — Veil Reveal)
 * Veil fades out, revealing the room's hero + content
 * Hero and content cascade in behind the veil
 * Total duration: ~1200ms
 * Reference: MOTION-SPEC.md § V (WOW expansion)
 */
export const roomApproach = ({
  body,
  hero,
  title,
  subtitle,
  header,
  veil,
  roomColor = '#0c0a09',
  autoplay = true
}) => {
  const timeline = anime.timeline({ autoplay })

  timeline
    .add(hero, { opacity: [0, 1], duration: 800, ease: 'outQuad' }, 0)
    .add(title, { opacity: [0, 1], scale: [0, 1.08, 1], duration: 500, ease: 'outQuad' }, 200)
    .add(veil, { opacity: [1, 0], duration: 300, ease: 'inQuad' }, 300)
    .add(subtitle, { opacity: [0, 1], translateY: [8, 0], duration: 400, ease: 'outQuad' }, 800)
    .add(header, { opacity: [0, 1], duration: 300, ease: 'outQuad' }, 800)

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
    .add(clickedDoor, { borderLeftWidth: ['0px', '100%'], opacity: [1, 0], duration: 400, ease: 'outQuad' }, 0)
    .add(`${clickedDoor} .sub`, { opacity: [1, 0], translateX: [0, 12], duration: 200, ease: 'inQuad' }, 150)
    .add(veil, {
      backgroundColor: [
        'rgb(12, 10, 9)',
        `rgb(${parseInt(roomColor.slice(1, 3), 16)}, ${parseInt(roomColor.slice(3, 5), 16)}, ${parseInt(roomColor.slice(5, 7), 16)})`
      ],
      opacity: [0, 1],
      duration: 300,
      ease: 'inQuad'
    }, 0)
    .add(siblings, {
      opacity: [1, 0],
      translateX: (el, i) => (i % 2 === 0 ? -10 : 10),
      duration: 300,
      ease: 'inQuad',
      delay: anime.stagger(50)
    }, 50)

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
  const effectiveStagger = Math.min(staggerDelay, capAt / (cards.length || 1))

  timeline.add(cards, {
    opacity: [0, 1],
    translateY: [8, 0],
    duration: 350,
    ease: 'outQuad',
    delay: anime.stagger(effectiveStagger, { start: 0 })
  }, 0)

  return timeline
}

/**
 * PATTERN: Decade Pulse (Temporal Threshold Marker)
 * Numeral scale-pulses when the visitor crosses into a new decade
 * Duration: 600ms (single bounce, discovery-adjacent)
 * Reference: MOTION-SPEC.md § V (WOW expansion, The Current)
 */
export const decadePulse = ({ element, autoplay = true }) => {
  return anime.timeline({ autoplay })
    .add(element, { scale: [1, 1.07, 1], duration: 600, ease: 'outElastic' }, 0)
}

/**
 * PATTERN: Focus Card Morph (The Current — work card arrival)
 * Each newly-focused work's card scales+fades in as a distinct arrival,
 * not just a flat opacity fade — reinforces "one work at a time" as you
 * move through the river.
 * Duration: 320ms (discovery easing)
 * Reference: MOTION-SPEC.md § V (WOW expansion, The Current)
 */
export const focusCardMorph = ({ mat, autoplay = true }) => {
  return anime.timeline({ autoplay })
    .add(mat, { scale: [0.92, 1], opacity: [0.35, 1], duration: 320, ease: 'outQuad' }, 0)
}

/**
 * PATTERN: Chip Pulse (Filter Selection Feedback)
 * Quick bounce-scale pop when a filter chip is toggled on/off
 * Duration: 250ms (interaction easing, bounce-back)
 * Reference: MOTION-SPEC.md § V (WOW expansion, Archive Discovery)
 */
export const chipPulse = ({ chip, autoplay = true }) => {
  return anime.timeline({ autoplay })
    .add(chip, { scale: [1, 1.12, 1], duration: 250, ease: 'outElastic' }, 0)
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
    .add(card, {
      translateY: -liftDistance,
      boxShadow: '0 12px 32px rgba(255, 102, 0, 0.16)',
      duration,
      ease: 'outElastic'
    }, 0)
}

export const cardHoverSettle = ({
  card,
  duration = 100,
  autoplay = false
}) => {
  return anime.timeline({ autoplay })
    .add(card, {
      translateY: 0,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0)',
      duration,
      ease: 'outQuad'
    }, 0)
}

/**
 * PATTERN: Veil Fade (Page Transition Overlay)
 * Fade in on navigation, reset on bfcache return
 * Duration: 220ms (closure easing)
 * Reference: MOTION-SPEC.md § V
 */
export const veilFade = ({ veil, fadeIn = true, autoplay = true }) => {
  return anime.timeline({ autoplay })
    .add(veil, { opacity: fadeIn ? [0, 1] : [1, 0], duration: 220, ease: 'inQuad' }, 0)
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
    .add(element, {
      opacity: [fromOpacity, 1],
      scale: [fromScale, 0.85],
      translateZ: [fromZ, 10],
      duration: 320,
      ease: 'outQuad'
    }, 0)
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
    .add(element, {
      opacity: [1, toOpacity],
      scale: [0.85, toScale],
      translateZ: [10, toZ],
      duration: 240,
      ease: 'inQuad',
      onComplete: callback
    }, 0)
}

/**
 * PATTERN: Scroll Cue Pulse (Bounce animation)
 * Infinite vertical bounce
 * Duration: 2s loop
 * Reference: MOTION-SPEC.md § II (Micro duration, but looped)
 */
export const scrollCuePulse = ({ element, autoplay = true }) => {
  return anime.timeline({ autoplay, loop: true })
    .add(element, { translateY: [0, -8, 0], duration: 2000, ease: 'inOutQuad' }, 0)
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
