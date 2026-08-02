# Archival Review — jfsn.com

**Date:** 2026-08-01
**Reviewer:** Claude Opus 5, at Jeff's direction
**Status:** Recommendations open. Cross items off here as they are addressed.

---

## About this document — read before the report

This review was written under a deliberate hypothetical that Jeff set as the framing
for the exercise: *assume the creator is gone, the site is now the permanent public
record, and no further work will ever be done on it.* The framing was a lens for
forcing hard priorities, nothing more.

**Jeff was alive and well when this was written, and commissioned it himself.** No
part of this document reports a real event about his health or death. It is preserved
here because the findings are real and the priorities it produced are the right ones,
not because the premise was.

The lens was useful for one specific reason: it separates what is *recoverable* from
what is not. Anything a living creator can redo — a page, a caption, a design — is
cheap. Anything that only exists once is priceless. That distinction drives the
ranking below and is why preservation outranks presentation throughout.

---

## Verdict

This is a serious, unusually honest archive, and it is better than most artist estates
will ever produce. Its intellectual framing is genuinely distinguished. Its principal
weakness is not design or presentation — those are finished.

**The weakness is that the archive does not tell the reader who wrote its words.**
That is fixable without adding a single feature.

*(An earlier version of this verdict also claimed the artwork had no preservation
master. Jeff corrected that the same day — masters exist outside the repository. See
§II.1 for what remains of that finding, which is now a documentation gap rather than a
preservation risk.)*

---

## Scope of review

All 14 core pages, the 1,087 generated artwork pages, `catalog.json` and the public
`api/v1` endpoints, the build scripts, and the preservation/backup layout.

---

## Disclosure — a regression introduced and fixed during this session

Regenerating `config/current.json` earlier in the same session erased the metadata
linking Jeff's only voice recording to the archive, and that loss was deployed. The
audio player was dead on jfsn.com until it was caught here.

The root cause predates the session: commit `f40a5398` hand-wrote that metadata
into a *generated* file, which guaranteed erasure on the next rebuild. But the
rebuild was run without checking, which is what turned a latent trap into live data
loss.

Fixed in commit `81e74cf2`: source of truth moved to the sidecar
(`artworks/full/art0379.json`), so the chain
`sidecar → build_catalog.py → catalog.json → build-current.py → current.json` now
carries it and regeneration cannot erase it. Verified by rebuilding twice, then
loading the live page: player visible, src resolving, duration 33.856s, readyState 4,
no error. Audio now also appears in `api/v1`, which it never did before.

Recorded here because an archive's credibility rests on disclosing its own failures,
and because it demonstrates the class of risk that most threatens this collection:
quiet, invisible loss in a derived file that no one is watching.

---

## I. What succeeds beyond expectation

**The central curatorial idea is the best thing here.** For decades Jeff photographed
and composited museums showing his work — crowds, walls, openings that never happened.
A lesser archive would have hidden those, or worse, let them pass as documentation.
This one made them the subject and titled the whole site after them. The homepage
states it plainly: *"walls, crowds, openings that never happened. Every one of them
is flagged as composite. This building is the one that exists."* That is a real
curatorial act, and it converts the collection's most dangerous liability into its
most distinctive claim.

**`hall-of-openings.html` is the finest page on the site.** It states that his work
appeared in six exhibitions in fifty years, against 250 imagined ones — a brutal
number, published without flinching. Then it names the sentimental reading and
refuses it: *"It would be easy — and wrong — to read these 250 works as compensation...
Jeff's own testimony refuses that reading."* Presenting the evidence, anticipating the
misreading, and deferring to the creator's own words is exactly correct archival
practice. **Do not touch this page.**

**`stories.html` holds the only irreplaceable material in the collection.** The flood
that destroyed five hundred to a thousand works, the art-school sculpture sold to a
stranger in the late 1970s and never seen again, the Devo stage build at WHK
Auditorium for $500 in 24 hours. It is verbatim, dated, and labeled *"Verbatim from
oral history session, June 2026."* Every other page could be reconstructed from the
images and the data. This one could not.

**The composite disclosure is carried rigorously through every layer** — the browse
grid, each static page, the lite catalog, and the public API all mark all 250. That is
engineering discipline in service of truth, and it is rarer than it should be.

**The technical posture for long-term survival is excellent.** No external runtime
dependencies — no CDN, no font host, no framework fetched at load. Every one of the
1,087 artwork pages renders its full record, image, and description as static HTML
with JavaScript disabled. Each carries valid schema.org `VisualArtwork` markup. The
data is open under CC BY 4.0 with a real, versioned API. In twenty years, when the
animations have stopped working, the record will still open in a browser. That is the
right priority and it was clearly deliberate.

**`flooded-wing.html` handles absence honestly:** *"The frames below depict nothing.
They stand for what is missing."* An archive that can represent its own gaps without
fabricating them is trustworthy.

---

## II. Where it fails, ranked by consequence

### 0. The description text was invisible on all 1,087 artwork pages — FIXED

**Found and fixed 2026-08-01, commit `7e4e628d`.** Added after the original
review, and had it been found during it, it would have ranked first.

Every generated artwork page ships `<html class="dark">` hardcoded, and the
shared theme-init script only ever *adds* that class, never removes it — so the
pages were dark for every visitor regardless of system preference. None of them
loaded `_shared/dark-mode.css`.

The catalog description, the primary textual content of every record, therefore
rendered `#0B0B0B` on `#1a1a1a`: **contrast 1.13:1, effectively invisible,
live, for everyone.** The work title was similarly unreadable.

The irony is worth recording. This review spent its length worrying about the
accuracy and provenance of descriptions that no visitor could actually read.

`dark-mode.css` already contained attribute selectors written for exactly this
inline-styled markup; it was simply never linked from the generator template.
One line. Description went to 8.77:1, title to 15.27:1.

**Lesson for future custodians:** every check in the original review read the
*source* — catalog JSON, HTML, build scripts. None of it rendered a page and
measured what a human eye would receive. Text present in the markup is not the
same as text a reader can see. Check the rendered result, not the record.

### 1. Preservation masters exist, but the repository cannot see them

**Corrected 2026-08-01, same day.** The original version of this review ranked this
first and claimed no preservation master existed. **That was wrong.** Jeff confirms he
holds master files outside the repository. The finding below is what survives that
correction, and it is a much smaller problem.

What the repository *can* see: the highest-resolution copy tracked anywhere in this
project is a **lossy AVIF delivery encode** — 1400×2800, averaging 381 KB, 424 MB for
the collection — and it is gitignored, so the public redundancy on GitHub is the
`medium` tier at 900×1800. Only 6 original camera files are present on disk, all from
recent intake.

So a future custodian working only from this repository would reach exactly the wrong
conclusion I reached: that the originals are gone. That is the real remaining issue —
not the masters' existence, but the fact that **nothing in the repository records
where they are.** The succession documents cover hosting, domain, and accounts; they
do not point at the masters.

This is a documentation task, not a preservation emergency.

- [x] Record the masters' location and format in
      [`docs/governance/SUCCESSION.md`](../governance/SUCCESSION.md) — done
      2026-08-02. Jeff: the masters are on a separate external hard drive,
      outside the repository and outside the nightly backup chain. Format not
      specified and not inferred; left marked as unrecorded rather than guessed.
- [x] Note in that entry whether any copy lives outside Jeff's own accounts —
      done. None recorded, so the masters are a single-copy store while the
      repository has four. Jeff considers the matter closed; the entry states
      the position without reopening it.

### 2. Nothing discloses that titles and descriptions are machine-written

The archive is scrupulous about disclosing decade estimates and composites. It says
nothing, anywhere, about the provenance of its own prose. The words
"machine-generated," "AI," or any equivalent appear on **zero** of the 14 pages, and
nowhere in the API's discovery document — which ships a citation line inviting
scholarly reuse.

This is not theoretical. `art0001` is featured on the homepage and titled **"Untitled
(Figure, Blue Ground)."** The ground is red. Its own description says "on red ground."
Its own extracted dominant color is `#ff003c`. The title is wrong, and the system
already contains the evidence that it is wrong. One narrow automated test found **12
more** title/description color contradictions.

The consequence compounds: that incorrect title is published into the page's
schema.org JSON-LD, where aggregators and knowledge graphs will harvest it as the
artist's own. A title is the handle by which a work is cited forever. These are the
archive's weakest data presented with its strongest authority.

**The descriptions themselves are good** — accurate, specific, useful. They should
stay. What is missing is one honest paragraph saying who wrote them.

- [x] Disclosure paragraph on `archive.html` and in `api/v1/meta.json` — done
      2026-08-01, commit `164482da`. `meta.json` gained a `metadata_provenance`
      block covering titles, years, the composite flag, and known error classes.
- [x] Correct `art0001`'s title — done 2026-08-01. Now *Untitled (Figure, Red
      Ground)*, on Jeff's explicit instruction, which makes it Confirmed under
      §5.1. §8.2 bars AI from authoring titles, so the alternatives were put to
      him rather than chosen.
- [x] Disclosure carried onto all 1,087 artwork pages — done 2026-08-01,
      commit `7e4e628d`. Worded "most catalog text" rather than asserting the
      provenance of the record in view, since a few records are curator-authored
      and no per-record flag distinguishes them.
- [x] The "12 other title/description colour contradictions" were re-measured
      2026-08-02. The original one-off scan was not kept, so it was rebuilt and
      run in two passes. **Hard contradictions — a title colour whose family
      appears nowhere in the description or palette, the `art0001` class of
      error — now number zero.** Six soft mismatches remain, all naming
      granularity rather than error: five works titled "Blue" whose grounds the
      description calls turquoise (`art0491`, `art0492`, `art0495`, `art0503`,
      `art0516`), and `art0123` titled "Hot Pink" against a magenta palette.
      Calling a turquoise ground blue is not wrong the way calling a red ground
      blue was wrong. Left as they are; §8.2 bars AI from retitling, and the
      options were put to Jeff rather than chosen.

### 3. The record is nearly invisible to search engines

`sitemap.xml` contains **12 URLs — none of them artworks.** In `build_catalog.py`,
line 263, the code that would add all 1,087 is commented out, rationale: *"discovery
via archive.html + filters instead."* But that path is built entirely in JavaScript: a
crawler without JS finds exactly **one** link into the collection. Pages do chain
prev/next, so a crawl is theoretically possible, but it requires walking a 1,087-deep
sequence from a single buried entry point — precisely what crawlers abandon.

A historian searching for this work will most likely not find it. The fix is
uncommenting three lines that are already written.

- [x] Uncomment `build_catalog.py:263` — done 2026-08-01. Verified 2026-08-02:
      `sitemap.xml` now carries 1,099 `<loc>` entries.

### 4. Every date is "estimated," including the certain ones

All 1,087 records carry `year_precision: estimated`. Yet `art0379`'s own description
reads *"signed and dated 11/30/2022 at lower right."* The work is signed, the archive
knows it in writing, and still reports the date as a guess. Understating certainty is
a smaller sin than overstating it, but it is still an inaccuracy and it makes the
dating apparatus less useful than the evidence permits.

- [x] Mark visibly-signed works as exact — done 2026-08-01 (`44e219a08`) for the
      three works dated in Jeff's own hand (`art0083`, `art0379`, `art0937`),
      each verified against the artwork at full resolution rather than against
      the catalog description. 1,084 of 1,087 remain estimated, which is
      correct: the years are decade buckets. Note the method — `art0379`'s
      machine-written description claims the signature reads 11/30/2022; the
      work reads 1/30/2022. The description was not treated as evidence.

### 5. The voice is 34 seconds, and unlabeled

One recording, `who-i-am.m4a`, 33.8 seconds. It renders as an unlabeled play button —
`data-title` is populated and announced *only* to screen readers, so a sighted visitor
sees a bare triangle with no indication it is the artist speaking. Separately,
`art1069` points at `neon-city-nocturne.m4a`, which does not exist on disk.

- [x] Visible label on the player — done 2026-08-02 on Jeff's direction. The
      player now carries a `RECORDING — THE ARTIST'S VOICE` kicker plus the
      recording's title, stamped from the catalog's `audio_title`, and is a
      labelled `role="region"`. A sighted visitor no longer sees a bare triangle.
- [x] Resolve or remove the `art1069` pointer — verified resolved 2026-08-02.
      `neon-city-nocturne.m4a` no longer appears in the sidecar, `catalog.json`,
      or `current.json`. The only live audio reference is `art0379`, whose file
      exists.
- [ ] **Record more voice while that is possible** — still the highest-value
      action available. Raised with Jeff 2026-08-02; his answer was "maybe
      tomorrow." Not to be pushed. The pipeline is proven and will accept a new
      recording whenever he wants to make one.

### 6. No biographical anchor

No birth year appears anywhere on the site. There is no `Person` structured data on
the homepage or about page — only inside individual artwork records. A researcher
cannot establish from this archive when its subject lived. And `about.html` reads
*"Still making. Still in Cleveland."* — present tense a permanent record cannot hold.

- [x] Birth year + one `Person` JSON-LD block — done 2026-08-01 (`1850e9c3a`).
      Verified 2026-08-02: `about.html` carries `"birthDate": "1955"` in a
      `Person` block, year only, with the reasoning recorded inline.
- [x] Revisit present-tense phrasing in `about.html` — **raised and declined by
      Jeff, 2026-08-02.** "Still making. Still in Cleveland." stays. His reason:
      he is alive, and the sentence is true. Do not re-flag this; a future
      audit reading it as stale would be correcting a fact rather than an error.

### 7. Work count stale in 70 places

Every page says 1,086. The catalog holds 1,087.

- [x] Regenerate the count sitewide — done 2026-08-01 (`f2f1dffac`); the figure
      is now stamped by `build_catalog.py` on every rebuild rather than
      hand-maintained. Verified 2026-08-02: no file anywhere still reads 1,086.

### 8. Five links were invisible on `working-history.html` — FIXED

**Found and fixed 2026-08-02.** The same class of defect as §II.0, found the same
way: by measuring what a reader actually receives rather than reading the source.

`working-history.html` carried a second `<script>` block whose string literals used
curly quotes (`'`) instead of straight ones — 38 of them. That is a JavaScript
**syntax error**, so the block never parsed and never executed, for any visitor,
ever. The `try { … } catch` wrapped around it could not help: a parse error is
raised before any code in the block runs, so the catch never fires. Its error
handler, which would have painted a red banner, was unreachable by construction.

That dead block held the reveal-on-scroll logic. With it gone:

- `#records` (professional record PDF, video archive, design studies) and
  `#presence` (LinkedIn PDF, Showspace) sat at **`opacity: 0` permanently** —
  five outbound links, live, that no sighted visitor could see.
- The eight gallery cards survived only because someone had patched around the
  symptom with an `a.rec { opacity: 1 }` rescue rule. They still rendered
  permanently 16px low, their reveal never completing.

Fixed by deleting the corrupted 94-line duplicate, moving the reveal logic into the
block that does parse, and **gating the hidden state behind `.js`** — so a no-JS
visitor, or any future script failure, now receives full-opacity content instead of
an invisible page. `a.rec { opacity: 1 }` was removed as no longer needed.

Two lessons worth keeping:

1. **A `try/catch` around a whole script block is not a safety net.** It cannot
   catch the failure mode most likely to kill the block outright.
2. **A workaround that treats the symptom hides the cause.** The rescue rule and
   the hand-copied duplicate of `RECORDS` both made the page look fine enough that
   nobody asked why they were needed. The answer had been sitting in the file the
   whole time.

Also fixed in passing: `og:image` on seven pages pointed at
`artworks/full/art1010-hero-lcp.avif`, which returns **404** on jfsn.com — every
social-media preview card for those pages was broken. Repointed to
`artworks/medium/art1010.avif`, which exists and was already in use elsewhere.

**Still open, noted not fixed:** `scripts/audit-nav.sh` emits 66 warnings, present
before this session's work and unrelated to it — `no FOOTER:START`, `missing
search.js`, `missing nav-active.js`, across 13 of the 14 core pages. Under the
standing rule that a permanent warning is a broken check, this needs resolving one
way or the other: either the check is stale after the nav/script-span refactor, or
13 pages are genuinely missing something. It should not be left humming.

---

## III. Priority order

1. ~~Disclosure paragraph + fix `art0001`'s title~~ — **done 2026-08-01** (`164482da`)
2. Record more voice while that is possible — the one item with a closing window
3. Carry the disclosure onto the 1,087 artwork pages, where descriptions are read
4. Uncomment `build_catalog.py:263` (sitemap)
5. Mark signed works as exact-dated
6. Label the recording; fix `art1069`
7. Birth year + `Person` structured data
8. Regenerate the work count

---

## IV. What to leave alone

The five rooms, the animations, the typography, the vault hero, the river, the page
transitions. They are finished, coherent, and better than the work they present has
any right to expect. Every remaining hour belongs to the artwork and its metadata,
not to the interface. **Resist the temptation to redesign a thing that is already
done.**

---

## Standing decision — the preserved working-history sites are not to be edited

**Decided by Jeff, 2026-08-02.**

The archived sites under `working-history/websites/` are published as they were
written, and that includes personal detail. The mr-snowmann site states his full
date of birth in his own words. It is live, and it stays live.

**Do not redact, alter, or exclude these pages.** They are preserved artifacts.
Editing a historical document to change a fact it contains is the one thing this
archive exists not to do, and a redaction would be indistinguishable from
falsification to anyone reading it later.

This is recorded because it is a predictable trap: a future accessibility,
privacy, or SEO audit will find a full date of birth on a public page, read it
as an exposure, and "fix" it. That fix would destroy an artifact to solve a
problem the creator has already considered and declined. **Ask Jeff. Do not
tidy it.**

Note that the same pages are useful primary sources — they carry a BFA year
(1978) and a first-person account of when he began making work seriously, both
in his own words and both predating the current archive.
