# v2 — THE MUSEUM THAT NEVER EXISTED

The next version of jfsn.com, built from zero on Jeff's 2026-07-10 directive:
all prior design locks void, no design limits, do not hold back. The one rail
that still stands is honesty toward the work — nothing fabricated, composites
always flagged, absence shown as absence.

**Concept:** for fifty years Jeff composited imaginary museums in Photoshop.
This version stops being a website about the work and becomes the museum
itself — the only one that ever existed. Rooms, not pages.

## Built so far

- **The Threshold** (`index.html`) — the front door. Staged arrival: name in
  the dark → "A personal record, not a gallery." → one work (Cassette Torso,
  art1010) resolving out of black → the museum named, with the honest framing
  (composites flagged, this building is the one that exists) → doors to the
  three rooms + the archive vault. Any input skips the wait; reduced-motion
  shows everything at once.
- **The Current** (`current.html`) — the spine of the building. All 1,084 works
  as a river of color, 1970s → 2020s, full-viewport canvas. Drag / scroll /
  arrow keys / minimap to move through fifty years. Hover or tap a work to
  raise it out of the water (title, decade-estimate year, medium, composite
  flag when applicable); open it to reach its archive page. Reduced-motion
  and touch supported. Self-contained — no dependency on the v1 shared
  bundles.
- `current.json` — the data spine: id / year / dominant color / title /
  year_display / medium / orientation / composite for all 1,084 works.
  Regenerate with `python3 v2/build-current.py` after any catalog rebuild.
- **The Flooded Wing** (`flooded-wing.html`) — the room for what is missing.
  A door ("Lost."), the verbatim account, then 1,000 empty frames — one per
  work in the estimated range, frames past 500 fading with the certainty of
  the estimate; milestone counts in the walk. At the far end, the Guernica
  wall: 11 × 25 ft at true proportion against a 5′9″ scale figure, drag-panned
  because it doesn't fit a screen, labeled only with what is known. Then the
  one photograph (artwork-in-trash-can.jpg), and the exit: "Not be careful.
  Be early." All copy verbatim from lost.html / oral history — the frames
  depict nothing and say so. Frame reveal uses scroll position + a heartbeat
  (never IntersectionObserver — throttled/embedded tabs stall it silently).

- **The Guernica Passage** (`guernica-passage.html`) — one structure walked
  for thirty years. All 232 series works in chronological order (chapters
  1990s 47 · 2000s 104 · 2010s 57 · 2020s 24, counts computed from data),
  `thumbs/` tier (~5 MB lazy, first 3 eager), true aspect ratios from
  dims.json, WORK N OF 232 counter, composite flags. Mid-passage, before the
  2010s ("the decade is not documented"), the interruption: "That work is not
  in this archive." → door to the Flooded Wing's wall. All wall text verbatim
  from guernica.html. Data: `guernica.json`, emitted by build-current.py.

- **The Hall of Openings** (`hall-of-openings.html`) — the 250 flagged
  composites hung together for the first time, in three movements sectioned
  from catalog data (I The Galleries 149 · II The Studio Views 87 · III The
  Placements 14), salon-style CSS-columns hang, thumbs tier, every caption
  carrying the composite flag. Wall text verbatim from imagined-museum.html
  ("rooms that never held it", "a picture of being seen", the coda). Ends on
  the reveal: "You are standing in one of these pictures now… This building
  is the composite that came true." Data: `openings.json` (build-current.py,
  sections via themes Gallery/Studio/placement).

- **The Studio** (`the-studio.html`) — the last room, the only one that
  faces forward. Jeff's real voice (audio/who-i-am.m4a, the archive's first
  recording), the practice today (grandchildren named, "Getting hard to tell
  where they end and I begin. I think that's right."), the living count read
  from current.json with today's date, the letter to whoever finds this
  (curatorial voice, documented facts only, the grandchild quote as pivot:
  "all the works in one space" → you are standing in that space), and the
  plaque: "The museum never existed. The record does."

**All six rooms of the 2026-07-10 concept are built.** Future possibilities:
more passages (Torsos & Faces, Targets, Working History).

## Resilience rule (learned by execution, keep it)

Throttled/embedded contexts (incl. the Claude preview pane) can stall RAF,
never fire IntersectionObserver, drop scroll/resize events, and never fetch
`loading="lazy"` images. Every room therefore runs a ~500ms heartbeat:
scroll rooms re-reveal from scroll position and re-measure when scrollHeight
changes; canvas rooms re-render when RAF hasn't ticked in >600ms. Core
content is never gated on IO/lazy; above-the-fold images load eager.

Still wanted from Jeff: more voice recordings (esp. "Sad. Enough." for the
Flooded Wing) — reserved silent slots exist in every room's head comment.
The Studio already carries the one real recording (audio/who-i-am.m4a).

## Ground rules

- v1 (site root) stays untouched and live until v2 is walkable.
- Work happens on the `v2-museum` branch — do not merge to `main` or deploy
  until Jeff says the building is ready.
- Local preview: `python3 -m http.server 8123` from repo root →
  http://localhost:8123/v2/ (the preview_start helper can't read ~/Documents).
