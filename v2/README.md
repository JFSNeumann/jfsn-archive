# v2 — THE MUSEUM THAT NEVER EXISTED

The next version of jfsn.com, built from zero on Jeff's 2026-07-10 directive:
all prior design locks void, no design limits, do not hold back. The one rail
that still stands is honesty toward the work — nothing fabricated, composites
always flagged, absence shown as absence.

**Concept:** for fifty years Jeff composited imaginary museums in Photoshop.
This version stops being a website about the work and becomes the museum
itself — the only one that ever existed. Rooms, not pages.

## Built so far

- **The Current** (`index.html`) — the spine of the building. All 1,084 works
  as a river of color, 1970s → 2020s, full-viewport canvas. Drag / scroll /
  arrow keys / minimap to move through fifty years. Hover or tap a work to
  raise it out of the water (title, decade-estimate year, medium, composite
  flag when applicable); open it to reach its archive page. Reduced-motion
  and touch supported. Self-contained — no dependency on the v1 shared
  bundles.
- `current.json` — the data spine: id / year / dominant color / title /
  year_display / medium / orientation / composite for all 1,084 works.
  Regenerate with `python3 v2/build-current.py` after any catalog rebuild.

## Planned rooms (from the 2026-07-10 concept)

1. The Threshold — dark arrival, one line, one work resolving. (Stub lives at
   the top of The Current for now.)
2. The Flooded Wing — 500–1,000 empty frames at estimated scale; the 11×25 ft
   Guernica wall, empty, at true proportion. Absence as architecture.
3. The Rooms — Guernica (232 works, thirty years, one continuous passage),
   Torsos & Faces, Targets, Working History.
4. The Hall of Openings — the composites, flagged, ending on the reveal that
   this site is the composite that came true.
5. The Studio — today, the live count, the letter to the future.

Blocked on Jeff: audio recordings of him reading fragments (esp. "Sad.
Enough.") — the voice layer for every room.

## Ground rules

- v1 (site root) stays untouched and live until v2 is walkable.
- Work happens on the `v2-museum` branch — do not merge to `main` or deploy
  until Jeff says the building is ready.
- Local preview: `python3 -m http.server 8123` from repo root →
  http://localhost:8123/v2/ (the preview_start helper can't read ~/Documents).
