# The composite flag has false positives

**Found:** 2026-08-03, incidentally, while checking the 43 *Torsos & Faces* works for Priority 2.
**Status:** reported, **not fixed.** No catalog data was changed. This needs Jeff's decision.
**Severity:** high in truth terms. It affects the archive's single most defensible disclosure.

---

## What the archive currently says

`config/catalog.json` flags 250 of 1,087 works `composite: true`. The public API defines that
flag as:

> *"composite: true marks a Photoshop composite depicting an imagined installation. These are
> artworks, not documentation — the exhibitions they show never happened."*

The live artwork page renders it as **"composite — imagined placement."**

## What is actually happening

`artworks/build_catalog.py:210`:

```python
r['composite'] = ('Gallery' in th) or ('Studio' in th) or bool(PLACEMENT_RE.search(r.get('title') or ''))
```

**Every work themed `Studio` is flagged as a fabrication.** There are 87 of them, and all 87 are
flagged. Verified by looking at the images, not the descriptions:

- `art0142`, `art0143`, `art0148`, `art0151`, `art0175`, `art0177`, `art0179` — real photographs
  of a real basement/warehouse studio. Exposed joists, office chairs, work tables, drying racks,
  cardboard boxes, a camera tripod, fluorescent fixtures, works leaning against walls.
- `art0161`, `art0162`, `art0163` — panoramas of the same room, showing the lens distortion of a
  genuine multi-exposure stitch.
- **`art0240`** — a photograph of **Jeff himself**, in a white t-shirt and glasses, leaning over
  a work in progress on the floor. Its page currently tells every reader it is an *imagined
  placement* depicting an exhibition that never happened.

## Why this is the wrong error to have

The word *composite* is doing two unrelated jobs:

1. **A fabricated exhibition** — a Photoshop scene of a show that never occurred. Flagging these
   is the archive's principal curatorial act and the thing its integrity rests on.
2. **A photographic composite** — a panorama stitched from real exposures of a real room.

Plus a third category that is neither: an ordinary, single-exposure photograph that merely
happens to be *of* the studio.

The 149 `Gallery`-themed works appear correctly flagged — those are the invented shows. The
87 `Studio` works are documentation of a real place, and the archive is calling them fiction.

The consequence: **the room where Jeff worked for fifty years, and the one photograph of him
working in it, are currently published as things that never existed.** For an archive whose
stated purpose is that his grandchildren remember him, this is precisely inverted.

## Knock-on effects

- The figure **"250 composites"** appears in `PROJECT-STATUS-2026.md`, the public API, the
  catalog disclosure and the site copy. If the 87 Studio works are not fabrications, that number
  is wrong everywhere it appears.
- `PROJECT-STATUS-2026.md` Decision 2 holds that the composite regime is settled and central.
  **This finding does not reopen that decision.** Whether to flag fabrications is settled; this
  is a false-positive bug in how the flag is computed.

## What is not known, and needs Jeff

Only Jeff can say, per work or per group:

1. Which `Studio` images are ordinary photographs of the real studio.
2. Which are stitched panoramas — real, but composites in the photographic sense.
3. Whether any `Studio` image genuinely is a fabricated placement and belongs in the 250.

## Recommended fix, once Jeff decides

Separate the concepts rather than widening the regex:

- Keep `composite` meaning **fabricated installation** only.
- Give panoramas their own honest label (`panorama` or `stitched`) — real photograph, assembled.
- Leave plain studio documentation unflagged.
- Re-derive the published count from the data instead of restating 250 by hand.

Not done. No data changed. Awaiting Jeff.
