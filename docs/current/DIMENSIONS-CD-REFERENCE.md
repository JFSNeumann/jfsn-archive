# Physical dimensions from CD-reference scaling

**Last Updated:** 2026-08-04
**Status:** active, ongoing. 21 works estimated so far, out of a candidate pool that is
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

## Never a reference: xeroxed elements

Jeff: *"many things are xerox copies at different sizes and taped onto artwork — example,
airplanes, targets, drones, etc."* A recurring visual motif in this corpus is not evidence of a
recurring *size* — it's evidence of a recurring photocopied original, reproduced at whatever
scale that particular copy happened to be run at. Confirmed xeroxed and **never usable as a
size reference, no matter how consistent it looks across works:**

- targets / concentric-rings
- warplanes (top-down and side profile)
- drones

Treat any other frequently-repeated graphic element the same way by default — confirmed
physical objects with a real, fixed manufactured size (a CD, a real hammer, a real hole punch)
are the only valid reference class. If it's a recognizable printed image glued or taped onto
the surface rather than a physical object photographed in place, assume it's a xerox at an
arbitrary scale until there's a specific reason to think otherwise.

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

Dropping the color filter to fix the above surfaced a lot of noise: target and concentric-ring
motifs are extremely common in this corpus (580–459 instances) and are, to a shape detector,
indistinguishable from a real disc — a single busy work can produce 20–40 raw circle detections.
Color was the wrong filter to reject real CDs with, but it briefly looked like the fix needed to
be a better shape/reflectivity classifier instead.

**It doesn't. Jeff: "forget these / all different sizes" — the targets aren't painted, they're
xerox copies, in different sizes."** And it's broader than targets: *"many things are xerox
copies at different sizes and taped onto artwork — example, airplanes, targets, drones, etc."*
Several of this corpus's most recurring visual elements — targets, concentric rings, the
top-down and side-profile warplanes (238 and 225 instances), whatever else reads as a repeated
graphic motif — are photocopies taped onto the work, each copy at whatever reproduction scale it
happened to be run at. Unlike a manufactured CD (always 4.72 in, because a CD is a manufacturing
standard, not a reproduction of one), none of these has a fixed real-world size to anchor a scale
to — two copies of the same warplane silhouette can be different sizes from each other, even
printed from the same original. The failure mode was never "the script can't tell a disc from a
target" — a xeroxed motif categorically cannot be a size reference, full stop, no matter how
confidently it's detected, and this applies to every recurring taped-on graphic element in the
corpus, not only the ones that happen to be circular.

Which means the fix was never a smarter detector. **Visual confirmation that a candidate is a
real, fixed-size manufactured object is the correct filter, and it's already the process.** The
automated circle detection is a rough first pass to generate candidates worth looking at; it was
never meant to decide anything on its own, and there's no reflectivity re-tuning worth building
to make it decide more.

## A caught arithmetic bug, for the record

The first computed batch was wrong for one of the six works. `[128.8]*7*2` in Python does not
multiply each list element by 2 — it duplicates the list's length, from 7 elements to 14, each
still 128.8. The diameter for art0461 was silently computed as its radius, halving the implied
scale and doubling the implied size (a plausible-looking but wrong 64.8 × 102.6 in). Caught by
sanity-checking the output against the other five estimates before writing anything, not by the
code being obviously wrong to read. Corrected to explicit, unambiguous per-work arithmetic
before any number was committed. This is exactly the class of error this archive has been
built to catch in other people's shortcuts — it does not get a pass for being mine.

## Confirmed so far (21 of 1,087)

| work | estimate | reference | confidence |
|---|---|---|---|
| art0461 | approx. 32 × 51 in | 7 discs, 0% spread | high |
| art0083 | approx. 45 × 76 in | 2 discs, 0% spread | high |
| art0703 | approx. 43 × 69 in | 2 of many discs (corners), 0% spread | high |
| art0064 | approx. 29 × 40 in | 2 discs, 8.9% spread | medium |
| art0424 | approx. 51 × 67 in | 1 disc (2nd excluded, cropped) | medium |
| art0287 | approx. 19 × 25 in | 1 disc, 3 readings averaged | medium |
| art0690 | approx. 55 × 94 in | 14 discs (two 7-disc rows), ~7% between rows | high |
| art0066 | approx. 32 × 42 in | 2 discs, 1.6% spread; target motifs in the same piece explicitly excluded | high |
| art0673 | approx. 46 × 51 in | 8 of 16 discs (cross formation), 9.3% spread | high |
| art0674 | approx. 44 × 50 in | 7-disc row, 4.3% spread | high |
| art0623 | approx. 27 × 39 in | 5 discs, identical radius, 0% spread | high |
| art0367 | approx. 55 × 42 in | 5 discs, 4.8% spread | high |
| art0438 | approx. 52 × 39 in | 2 discs, measured manually (automated candidates were noise), 4.0% spread | high |
| art0111 | approx. 45 × 34 in | 3 discs, 1.5% spread | high |
| art0364 | approx. 14 × 31 in | 4 discs in a 2×2 grid, 1.7% spread | high |
| art0200 | approx. 57 × 59 in | 8 discs in one row, 1.07% spread — tightest measured | high |
| art0666 | approx. 19 × 30 in | 3 discs, 1.3% spread, fit confirmed at zoom | high |
| art0361 | approx. 37 × 29 in | 3 discs, 1.6% spread, fit confirmed at zoom | high |
| art0476 | approx. 39 × 67 in | 3 discs, 2.9% spread, fit confirmed at zoom | high |
| art0583 | approx. 40 × 55 in | 3 discs, 4.8% spread, fit confirmed at zoom | medium |
| art0633 | approx. 22 × 32 in | 2 discs, 0% spread, fit confirmed at zoom | high |

All thirteen sizes land in a broadly similar family, with art0690 the largest so far (55 × 94 in) —
plausible given it's built almost entirely from a dense CD lattice, but the largest single
outlier to date and worth someone's second look if the method is ever audited.

### Checked, not confidently pinned down (not written to the catalog)

- **art0255** — a tall, CD-dense "totem" piece. Some circular objects read ambiguously (large
  tan/gold discs with no clear metallic sheen or paper hub — could be wood, could be worn CDs);
  time-boxed rather than force a low-confidence number.
- **art0401** — has real CDs, but a full-resolution crop didn't line up with where they appeared
  in a smaller preview; needs a cleaner crop pass, not attempted further this round.
- **art0355** — its detected circles are the piece's own concentric-ring target motifs. Correctly
  excluded on category (see *Never a reference: xeroxed elements*), not attempted further.
- **art0249** — mixes real CDs with checkerboard-target circles and large ambiguous discs; not
  confidently sorted without more work than this pass had time for.
- **art0961, art0706** — each depicts two separately framed works photographed side by side.
  A single "canvas size" wouldn't clearly belong to either one. Same exclusion reason both times.
- **art0033** — a real CD is visible, but it sits embedded within/behind a printed dartboard-style
  target graphic, and the boundary between the disc's own edge and the printed rings around it
  isn't confidently readable. Set aside rather than guess where one stops and the other starts.
- **art0939** — mixes real vinyl records with printed target motifs; not disambiguated this round.
- **art0731** — small round objects that may be beads or marbles rather than CDs; too small and
  ambiguous to confirm either way from the available resolution.
- **art0332** — its circular elements read as a printed decorative pattern, not real discs.

### What this project has learned about automated detection at scale

Circle detection behaves differently depending on how busy the piece is, and both failure modes
matter:

- **On busy, CD-dense works (60–90 raw detections per image),** what looks like tight radius
  agreement frequently isn't: adjacent radii across a near-continuous noise distribution can
  cluster within 5–8% of each other by chance, not because they're the same physical object
  measured multiple times. art0690 and art0066 were measured by direct manual crop-and-grid
  after the automated candidates for those works turned out to be unusable noise.
- **On cleaner, lower-detection-count works (≤20 raw detections),** the automated list has
  proven trustworthy once cross-checked against the image — art0673, art0674, art0623, and
  art0367 were all confirmed this way, faster than a full manual re-measurement. Large-radius
  outliers in these same images (fabric folds, foil bunting, shadow) were still false positives
  and were excluded by eye, same as always.

**Working rule going forward:** prioritize low-total-detection candidates first — they're both
faster to confirm and less prone to false agreement — and fall back to manual crop-and-grid
measurement only when a promising piece turns out to be too busy for the automated list to be
trusted. A large agreeing-circle count is still never evidence by itself; it always has to be
looked at.

## What every estimate explicitly is not

- Not a physical measurement. Nobody has touched these objects.
- Not more precise than the photograph and the reference object allow. Rounded to the nearest
  inch; the word "approx." is load-bearing, not decoration.
- Not applied to any work without a human-confirmed real, unobscured reference object in that
  specific image.
- Not surfaced in the site's interface. That is a design decision and is Jeff's to make, not
  assumed here.

## The contact-sheet method (adopted 2026-08-04)

Measuring one work at a time cost 3–5 image inspections each — far too slow for 542 candidates.
Replaced with: draw the detected circles onto each image, tile 25 works into one contact sheet,
and accept/reject 25 at a glance. Roughly 25x cheaper, and it makes the common failure obvious —
a circle sitting on busy collage rather than on a disc is visible instantly at thumbnail size.

Survivors then get one zoomed montage showing each candidate disc with its fitted circle drawn
on, at high magnification. That second pass is what catches the near-misses: a circle that looks
right at thumbnail scale but visibly overshoots the disc edge when enlarged. Two of seven
finalists were rejected at exactly that step (`art0248`, `art0671`), and both would have produced
an undersized estimate.

**A bug this caught in the tooling itself.** The first sheet run stored the cluster's mean
*radius* in a field named `mean_d` and then divided it by 4.72 as though it were a diameter —
making every implied size exactly 2x too large. It surfaced only because the numbers were
absurd on their face: an 11-foot-tall collage. Sanity-checking the output against plausible
physical size is a real check, not a formality.


## Rejected after inspection, and why

Kept as a record so a future pass does not re-litigate them:

| work | reason |
|---|---|
| art0248 | circle visibly overshoots the disc edge at zoom; a better-fitting inner arc exists |
| art0671 | circle overshoots slightly on one side; borderline, excluded on the conservative standard |
| art0850 | every disc overlapped by other objects — no clean edge-to-edge read available |
| art0573 | the rounded forms are not discs |
| art0110 | xeroxed warplane outlines produced 250+ candidate circles; hand-placed coordinates gave a 153% spread, meaning centres were being missed rather than measured. Four readings did cluster within 3.9%, but taking that cluster would be fitting noise from coordinates already shown to be wrong |

## Remaining work

- 542 non-composite works carry the `compact-disc` motif; 6 are done. The rest require the same
  one-by-one visual confirmation — there is no shortcut that has proven safe yet.
- Some discs are physically cut in half by the artist, or overlapped by other collage elements,
  per Jeff. These may still be measurable from a visible arc or a straight cut edge, but need
  more careful per-work geometry than a full, unobstructed disc does. Not yet attempted.
- `art0706` ("Diptych with Targets and Chess 2") and `art0961` both surfaced the same possible
  gap in the composite disclosure: each depicts two separately framed works photographed side by
  side, themed "Framed" rather than "Gallery," so neither was caught by the composite-flag
  correction. Two independent instances now — worth a real look in a future session, not just a
  one-off. Not investigated further here.

**Not pursuing:** a better shape/reflectivity classifier to distinguish real discs from xeroxed
motifs automatically. Confirmed not worth building — see *Never a reference: xeroxed elements*
and *What changed the scope* above. Xeroxed elements are excluded on category (no fixed
real-world size — each copy can be reproduced at a different scale), not on how well they can be
told apart from a CD by shape or sheen, and the category isn't limited to circular ones —
warplanes and drones fail the same way. Human visual confirmation of "is this a real,
manufactured object, not a taped-on photocopy" remains correct and sufficient; there is no
smarter detector that removes the need for it.
