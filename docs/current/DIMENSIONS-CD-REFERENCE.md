# Physical dimensions from CD-reference scaling

**Last Updated:** 2026-08-03
**Status:** active, ongoing. 6 works estimated so far, out of a candidate pool that is
larger than initially scoped (see *What changed the scope* below).

---

## Why this exists

`PROJECT-STATUS-2026.md` recorded zero of 1,087 works with a physical dimension — corrected
that same day from an orphaned, unverified pilot value (see
`COMPOSITE-FLAG-FALSE-POSITIVES-2026-08-03.md` and the git history of `artworks/full/art0053.json`).

Jeff: *"75% of images i can only guess at their sizes — do not have — destroyed."* The physical
originals for most of the archive no longer exist. No walkthrough, no tape measure, no amount of
better interview questions produces a size for an object that was lost in the flood. For that
majority, the only remaining evidence is whatever real, known-size object happens to appear
*in* the photograph — almost always a compact disc, since `compact-disc` is the single most
common motif in the corpus (600 works).

Jeff, on the method: *"you can guess at sizes as good as me by looking at details (example — CDs,
paper clips, hole punches, etc.)"* — and explicitly authorized building it out: *"go through the
CD works, start building verified estimates."*

## The method

1. A real CD is 4.72 in (120 mm) diameter, regardless of color — gold, silver, blue-tinted,
   rainbow. This is the one fixed, external fact the whole method rests on.
2. Measure the CD's pixel diameter in the native full-resolution image.
3. `scale = diameter_px / 4.72` gives pixels-per-inch.
4. Apply that scale to the full native image dimensions to get an implied canvas size.

## What must be true before a number gets written

**Every candidate is visually confirmed by a human before anything enters a sidecar.** Automated
detection produces candidates; it does not produce data. Two corrections already earned this
rule:

- **A "ruler" in art0469 was not a ruler.** No printed markings anywhere on it, cropped by the
  frame edge — most likely a paint stick or scrap wood the machine-written description labeled
  by shape alone. It was excluded before any number was computed from it.
- **Color is not evidence of authenticity.** The first pass filtered candidates by a "gold-like"
  hue signature and rejected art0287's disc as three duplicate false detections. It is a single,
  entirely real CD — just blue-tinted, with a paper "Arsenal" sticker over the hub — and the
  three detections were Hough noise on one true object, not three fake ones. Corrected on Jeff's
  direct pushback: *"blue/holographic disc detected three times, so use them... no one said what
  color CDs are."* The three readings were averaged rather than discarded, since they agree
  within about 4% of each other.

## What changed the scope

Dropping the color filter to fix the above created a worse problem: painted target and
concentric-ring motifs are extremely common in this corpus (580–459 instances) and are, to a
shape detector, indistinguishable from a real disc — a single busy work can produce 20–40 raw
circle detections, nearly all of them false. Color was the wrong filter, but no filter is not
the fix either.

**The correct signal is reflectivity, not hue.** A real CD has a metallic sheen — strong local
brightness variance and specular highlights. A painted circle is flat and matte. The detection
script's `v_std` (brightness standard deviation within the ring) already captures this and was
the more reliable half of the original filter; hue was the part that needed removing, not
`v_std`. Re-tuning the automated first pass to score on sheen rather than color is the next
technical step, not yet done.

Until that re-tuning happens, **every candidate is being confirmed by looking at the actual
image**, not by trusting either the color filter or the raw circle count. This is slow. It is
also the only version of this that is honest.

## A caught arithmetic bug, for the record

The first computed batch was wrong for one of the six works. `[128.8]*7*2` in Python does not
multiply each list element by 2 — it duplicates the list's length, from 7 elements to 14, each
still 128.8. The diameter for art0461 was silently computed as its radius, halving the implied
scale and doubling the implied size (a plausible-looking but wrong 64.8 × 102.6 in). Caught by
sanity-checking the output against the other five estimates before writing anything, not by the
code being obviously wrong to read. Corrected to explicit, unambiguous per-work arithmetic
before any number was committed. This is exactly the class of error this archive has been
built to catch in other people's shortcuts — it does not get a pass for being mine.

## Confirmed so far (6 of 1,087)

| work | estimate | reference | confidence |
|---|---|---|---|
| art0461 | approx. 32 × 51 in | 7 discs, 0% spread | high |
| art0083 | approx. 45 × 76 in | 2 discs, 0% spread | high |
| art0703 | approx. 43 × 69 in | 2 of many discs (corners), 0% spread | high |
| art0064 | approx. 29 × 40 in | 2 discs, 8.9% spread | medium |
| art0424 | approx. 51 × 67 in | 1 disc (2nd excluded, cropped) | medium |
| art0287 | approx. 19 × 25 in | 1 disc, 3 readings averaged | medium |

All six sizes land in the same rough family — no absurd outliers — which is itself a weak
sanity check on the method, not proof of accuracy.

## What every estimate explicitly is not

- Not a physical measurement. Nobody has touched these objects.
- Not more precise than the photograph and the reference object allow. Rounded to the nearest
  inch; the word "approx." is load-bearing, not decoration.
- Not applied to any work without a human-confirmed real, unobscured reference object in that
  specific image.
- Not surfaced in the site's interface. That is a design decision and is Jeff's to make, not
  assumed here.

## Remaining work

- 542 non-composite works carry the `compact-disc` motif; 6 are done. The rest require the same
  one-by-one visual confirmation — there is no shortcut that has proven safe yet.
- Some discs are physically cut in half by the artist, or overlapped by other collage elements,
  per Jeff. These may still be measurable from a visible arc or a straight cut edge, but need
  more careful per-work geometry than a full, unobstructed disc does. Not yet attempted.
- `art0706` ("Diptych with Targets and Chess 2") surfaced a possible second gap in the composite
  disclosure: it depicts two separately framed works photographed side by side, themed "Framed"
  rather than "Gallery," so it was not caught by the composite-flag correction. Not investigated
  further here — flagged for a future session.
- Re-scoring the automated first pass on reflectivity (`v_std`) rather than hue, to cut down how
  much of the 542 has to be checked by eye rather than pre-filtered by the script.
