# The composite flag has false positives

**Found:** 2026-08-03, incidentally, while checking the 43 *Torsos & Faces* works for Priority 2.
**Status: ✅ FIXED AND DEPLOYED 2026-08-03**, on Jeff's decision: *"the studio photos are all
real, fix it."* 250 → 163 composites. See *Resolution* at the foot of this document.
**Severity:** high in truth terms. It affected the archive's single most defensible disclosure.

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

---

## Resolution — 2026-08-03

Jeff's decision: **"the studio photos are all real, fix it."** All 87 are now unflagged.

**What changed.** `build_catalog.py` exempts Studio-themed works from the flag entirely — not
just by dropping the theme clause, because `PLACEMENT_RE` matches *panorama* and *installation*
and would have re-flagged 21 of them by title. Gallery is untouched: its 149 still flag, and
that disclosure stands. **250 → 163.**

**Where it reached.** The flag is published in four places and every one had to be corrected:

1. `config/catalog.json` and the API — 163 of 1,087.
2. The 1,087 static artwork pages — exactly 87 changed, one line each. `art0001.html` byte-identical, confirming the diff was surgical.
3. `api/v1/meta.json` — the count is now **computed from the data**, never restated by hand. The old hardcoded "250 of 1087" is precisely what outlived the rule that produced it.
4. `hall-of-openings.html` — **this one nearly shipped broken.** The page renders its labels from the static `config/openings.json`, not from the catalog, so fixing the catalog left all 87 studio views still captioned *"Photoshop composite — imagined placement"* while the section above them read *"The real place, pictured."* Caught by reading the rendered page rather than trusting the catalog fix. Studio items now caption *"Photograph — the real studio."*

**Verified.** 250 items in the hall = 163 imagined + 87 real, matching the catalog exactly.
`art0240` no longer claims imagined placement; `art0381` (Gallery) still does. `archive verify`
PASS, 0 failures. No console errors.

**Left alone deliberately.** The coda's phrase *"these 250 works"* refers to the hall's contents
as a whole, which is still 250 items. Rewriting Jeff's curatorial prose was out of scope for a
factual correction.

**Still open, and Jeff's to answer if he ever wants to:** which studio images are single
exposures and which are stitched panoramas. Both are real photographs of a real room, so nothing
on the site is now false either way — but the archive does not record the distinction. No field
was invented for it, per the standing rule that an empty field preserves nothing.
