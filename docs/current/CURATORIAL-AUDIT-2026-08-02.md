# Ruthless Curatorial Audit — jfsn.com

**Date:** 2026-08-02
**Method:** Site treated as unfamiliar work by an unknown team. Every claim below is
measured, not recalled. Commands and counts are reproducible from this repository.
**Governing question:** does this make the work more understandable, more memorable,
and more likely to survive?

**Standing constraint:** design and motion decisions are Jeff's. Sections 1 and 4 are
recommendations with evidence, not changes made. Defects (broken, invisible, 404) are
excluded here — those get fixed directly, not proposed.

---

## Measurements this audit rests on

| Quantity | Value |
|---|---|
| Machine-written description text | 44,561 words across 1,087 records |
| Machine-written title text | 4,145 words; 463 titles (43%) begin "Untitled" |
| Human prose, all 14 core pages incl. repeated nav/footer | ~5,144 words |
| Ratio, machine : human | ~8.7 : 1 |
| Oral-history working notes in repo | 12,148 words (`master-notes.md`) |
| Testimony actually published | ~1,240 words (`stories.html`) |
| `@keyframes` blocks / `animation:` / `transition:` declarations | 95 / 134 / 179 |
| `animation-delay` declarations / `setTimeout` calls | 48 / 54 |
| Font-size declarations ≤11px | 142 (6 at 8px, 22 at 9px, 62 at 10px, 51 at 11px) |
| Generated artwork pages loading a third-party script | 1,087 of 1,087 |
| Core pages loading a third-party script | 0 of 14 |
| Works with no theme / no series | 201 (18%) / 855 (79%) |
| Works flagged by Jeff as favorites | 45 — surfaced on 0 pages |

Contrast, computed against `--room #0c0a09`: `--ink` 16.27:1, `--dim` 8.57:1,
`--faint` 4.78:1, `--accent` 6.73:1. **All pass WCAG AA.** Colour is not this site's
problem; type size is, and no automated check will ever tell you so.

---

## 1. Everything that should be removed

Nine items. Ranked by damage to the archive.

### 1. The third-party analytics script on all 1,087 generated artwork pages

`<script src="//gc.zgo.at/count.js">` appears on **1,087 of 1,087** generated pages and
**0 of 14** core pages.

This is the most serious item in the audit, for three compounding reasons.

- **It falsifies the archive's own central technical claim.** The durable static pages
  are the thing that is supposed to outlive everything — "no external runtime
  dependencies, no CDN, no font host." That is true of the 14 curated pages and false
  of the 1,087 pages that constitute the actual record.
- **It is a longevity dependency in the one layer that must not have one.** These pages
  are the permanent copy. Their integrity now rides on a third-party domain continuing
  to exist and continuing to serve benign JavaScript. Archives are ruined by exactly
  this: a small convenience wired into the durable layer.
- **It is undisclosed surveillance at the point of entry.** Search traffic lands on
  generated pages, not the homepage. Every reader of every artwork is reported to a
  third party, on pages that carry no privacy notice.

No visitor-facing function is lost by deleting it. Pure subtraction.

### 2. The 3.4-second gate on `hall-of-openings.html`'s coda

`setTimeout(() => line2.classList.add('seen'), 1700)` and
`setTimeout(() => revealNav.classList.add('seen'), 3400)`.

A reader who reaches the end of the finest page on the site sees one sentence, then
nothing — no second line, no way onward — for 3.4 seconds. Every exit from the page is
inside `revealNav`.

The decisive evidence is in the code itself: the `prefers-reduced-motion` branch reveals
all of it instantly. **The page is considered complete, by its own authors, without the
delay.** A delay that one class of user is correctly spared is decorative for everyone.
Remove the timers; the fade can stay.

### 3. The infinite decorative animations

Never terminate. Never carry information. Consume battery for as long as a tab is open:

`sink 2.6s infinite` (6 pages), `hero-drift 22s infinite`, `tv-flicker 5.3s infinite`,
`tv-roll 13s infinite`, `wing-drift-l 14s` / `wing-drift-r 16s infinite`,
`drone-fly 18s`, `led-pulse infinite`, `vault-pulse`, `spinLoader`,
`scroll-cue-bounce 1.2s infinite`, `pulse-glow infinite`.

The bouncing scroll cue is the clearest case: it solves "the visitor may not know to
scroll," which has not been a real problem for over a decade. What evidence proves any
of these makes the archive more understandable? There isn't any. They make it feel
designed — a different goal, and on this site a competing one.

### 4. The visitor "favorite" button

`toggleFavorite()` writes art IDs to `localStorage`. Nothing ever reads them back except
the button's own highlight state. There is no page where a visitor can see what they
favorited. It is a collection mechanism with no collection.

It also actively confuses the record: it borrows the vocabulary of social software for
an archive, and it occupies the exact concept — "favorites" — that Jeff's own 45
selections should own (see §4.2).

### 5. Type below 12px

142 declarations at ≤11px, including 6 at 8px and 22 at 9px, much of it uppercase with
`.26em` letter-spacing.

Contrast passes AA everywhere, which is precisely why this has survived: automated
accessibility checks do not test font size, so nothing has ever flagged it. This is
gallery-signage typography — appropriate on a wall at arm's length, hostile on a screen.
The likely readers are family, and researchers decades from now. Set a 12px floor.
That removes an affectation; it is not a redesign.

### 6. The orange chip animation on `stories.html`

`.devo-chip-b` at 2.2s, `.devo-chip-a` at 2.45s, `.highlight-devo` ink-stamp at 1.6s.

Ornament on the one page holding material that cannot be reconstructed. The flood, the
sculpture sold to a stranger, the Devo stage build — this page should be the plainest on
the site, and instead it is the most choreographed. Nothing about a rectangle settling
into place helps anyone understand what was lost.

### 7. The `room-in` page-load fade

`.js body{animation:room-in .4s ease}` on every page. 400ms of fade on every navigation
in an archive built for traversal across 1,087 works.

### 8. Legacy bone-white from the superseded design system

`background: #fcf9f3` in `_shared/ui.css` — a remnant of the abandoned light system,
still shipping inside a dark site.

### 9. Click-to-copy on the archive number

`onclick="navigator.clipboard.writeText('ART0379')…"` plus a toast. Undiscoverable
(nothing indicates it is clickable but a cursor change), and copying an ID is not a need
anyone has demonstrated.

---

## 2. Everything that must never change

**The composite disclosure, carried through every layer.** 250 works marked in the
grid, on each static page, in the lite catalog, and in the public API. An artist who
spent decades photographing exhibitions that never happened had every incentive to let
them pass as documentation. This archive made them the subject and titled the site after
them. It converts the collection's largest liability into its most distinctive claim,
and the engineering carries it consistently rather than mentioning it once.

**Artwork images are never cropped, filtered, or tilted.** Verified: `object-fit:
contain` on the artwork presentation; `cover` appears only on hero photography and an
80px hover thumbnail. The single `filter:` in `artwork.html` targets a UI strip, not a
work. This is the non-negotiable rule of an art archive and it is being kept.

**The 1,087 static pages that render completely without JavaScript.** Full record,
image, description, schema.org `VisualArtwork`. When the animations have stopped
working, this still opens.

**The `<noscript>` blocks.** They do not say "enable JavaScript." They say what is lost
and where the durable copy is — *"The Current is a river of every work in the archive,
drawn and steered by script. Without JavaScript the water can't flow."* Written in the
site's own voice, telling the truth about its own degradation. Almost no one does this.

**`hall-of-openings.html`'s coda.** It states the brutal number (six real exhibitions
against 250 imagined), then names the sentimental misreading and refuses it, then defers
to the creator's testimony. Evidence, anticipated misreading, deference — correct
archival practice, and better writing than the subject would have claimed for himself.

**`stories.html`'s verbatim, dated testimony.** Labeled as to source and session. The
only material here that could not be reconstructed from images and data.

**`flooded-wing.html`'s representation of absence.** *"The frames below depict nothing.
They stand for what is missing."* An archive that can show its own gaps without
fabricating them can be trusted about everything else.

**`year_precision` as a first-class field.** 1,084 estimated, 3 exact, and the three
were promoted only after looking at the works at full resolution — explicitly refusing
the machine-written description as evidence when it contradicted the object.

**CC BY 4.0 with a real versioned API,** and the provenance disclosure now carried on
all 1,087 pages.

---

## 3. Hidden strengths

**The archive documents its own failures in public.** `ARCHIVAL-REVIEW-2026-08-01.md`
records a regression that destroyed the audio metadata and shipped it live, names the
commit that caused it, and keeps the finding after correction. Institutions with
professional archivists rarely manage this. It is the single strongest evidence that
everything else on the site can be believed.

**43% of titles begin "Untitled" — and that is integrity, not laziness.** The machinery
that produced 4,145 words of titles could trivially have invented evocative ones. It
didn't, and §8.2 of the metadata constitution forbids it from ever doing so. Most
archives would have quietly generated poetry.

**Structured data nobody asked for.** `motifs`, `palette`, `composition`, `materials`,
`work_type` on every record. A researcher can ask questions of this collection —
*where does the compact-disc motif appear across decades* — that most artist estates
cannot answer at all.

**Emotional pacing that was probably never planned as such.** The homepage withholds;
the rooms specialize; `stories.html` finally lets the maker speak. The sequence moves
from artifact toward person, which is the correct direction and the harder one.

**Restraint about the imagined exhibitions.** The composites are the most seductive
material here, and the site neither hides them nor exploits them. It flags them 250
times and lets them be strange.

**Uncertainty is preserved rather than resolved.** Decade buckets stay decade buckets.
The temptation to firm up a date because a range looks unprofessional is enormous, and
it has been resisted 1,084 times.

---

## 4. Hidden weaknesses

Structural, not cosmetic. Familiar enough to have stopped being visible.

### 1. Roughly a tenth of the recorded testimony is published

`docs/sources/oral-history/master-notes.md` holds **12,148 words** — first-person
drafts, confirmed quotes, session records. `stories.html` publishes **~1,240**.

The rest sits in a source file, in the repository, not on the website.

This is not a hypothetical loss. `master-notes.md` §13 is a first-person draft titled
*"What Making Things Gave Me"* — and Jeff's recorded verdict on it is **"feels true."**
It contains:

> I kept going because the making itself was the point.

That sentence answers the question `master-notes.md` itself ranks as **"#1. The most
important unanswered question"** — why he kept going after the Rauschenberg realization.

And `hall-of-openings.html` *cites this testimony to the visitor*: "Jeff's own testimony
refuses that reading. Asked why he kept making things for fifty years, he answered in
terms of the making itself." The archive tells the reader that the answer exists,
summarizes it in the third person, and does not show it to them.

**This is the largest structural weakness on the site, and it is a subtraction problem,
not an addition one.** Nothing needs building. The words exist, are confirmed, and are
already in the repository. They are merely not where a reader can reach them.

### 2. Jeff's own 45 favorites are invisible

`favorites.txt` marks 45 works and its header states: *"These appear on
favorites.html."* That page **does not exist** — it was removed in commit `41461e45f`.
No page links it; the flag is built into `catalog.json` and consumed by nothing.

The creator's own judgment about which of his 1,087 works matter most — the single most
valuable piece of curatorial metadata any archive can hold, and one nobody else will
ever be able to supply — is collected, versioned, built, and shown to no one. Meanwhile
the site invites *visitors* to favorite things (§1.4).

### 3. The reader's dominant experience is software prose about the work

44,561 machine-written words against roughly 5,100 human ones, and the human figure is
inflated by nav and footer text repeated across 14 pages. Provenance is now disclosed —
that was the right fix and it is done. But disclosure does not change the ratio. Someone
reading deeply here spends most of their time with descriptions generated from
photographs, not with Jeff. §4.1 is the cheapest available correction to this.

### 4. The durable pages omit the only recording

`artworks/pages/art0379.html` contains **zero** audio references. The 34 seconds of
Jeff's voice — repeatedly and correctly identified as the least reproducible material in
the collection — exists only on `artwork.html?id=art0379`, the JavaScript-dependent URL.
The copy built to survive is the copy without the voice.

### 5. Two canonical forms, and the durable one is unlinked

`artwork.html?id=artNNNN` is canonical and linked everywhere; the 1,087 static pages are
more durable and linked from nowhere on the live site. This was audited and deliberately
parked, which was reasonable. It remains true that the archive's survival layer is the
layer no visitor is ever sent to.

### 6. Discovery is uneven where the metadata is thin

201 works (18%) carry no theme; 855 (79%) carry no series. The filter interface presents
itself as a complete way through the collection while a fifth of it is unreachable by
theme.

### 7. Warning fatigue is an active, demonstrated risk

`audit-nav.sh` emits 66 warnings nobody acts on. This exact failure mode already cost
this archive: description text at 1.13:1 shipped invisible on all 1,087 pages past
`verify`, `npm test`, and human review. Already logged in `IMPROVEMENTS.md`; repeated
here because its precedent is not theoretical.

---

## 5. Final verdict

### If JFSN disappeared tomorrow, what would the art world lose?

Not a major artist — and the site's refusal to pretend otherwise is why it can be
trusted. It would lose something rarer: a **complete, honestly-catalogued record of a
serious fifty-year private practice**, the kind that normally vanishes entirely. Almost
everything we know about art history is the survival record of people who were already
famous. This is the other case, documented to a standard the famous cases rarely get.

It would also lose a genuine curatorial invention: 250 photographed exhibitions that
never happened, flagged as fiction and presented as the subject rather than suppressed.
That is a real idea, and it is Jeff's.

### Would this archive still matter in fifty years?

Yes — with one qualifier. As a record of an ordinary-in-scale, extraordinary-in-persistence
American practice, it will matter more in fifty years than it does now, because its
peers will not have survived. The static pages, open licence, and structured data are
built correctly for that horizon.

The qualifier: what will matter most in fifty years is the part that is currently least
published. Images survive on their own. Testimony does not.

### Single greatest strength

**It tells the truth against its own interest, systematically.** 250 composites flagged.
1,084 dates left as estimates. Machine authorship disclosed. Six real exhibitions stated
plainly next to 250 imagined ones. Its own shipped regression documented in public. Any
archive can assert accuracy; this one keeps producing evidence that it does not flinch.

### Single greatest weakness

**The man is the scarcest thing here and the least present.** 12,148 words of his
recorded testimony in the repository, ~1,240 on the site; 34 seconds of voice, absent
from the durable pages; 45 works he personally chose, shown nowhere. Everything else can
be reconstructed from the images and the data. This cannot, and it is the part being
withheld — not by decision, but by accumulated inattention.

### If I could change only ONE thing

**Publish the oral history that already exists.**

Not record more — that is the second-best action and it depends on Jeff's appetite.
Publish what is written, confirmed, and sitting in `master-notes.md` right now: the
first-person drafts he has already verified as true, the confirmed quotes, the answer to
the question the archive itself calls the most important unanswered one.

It requires no new feature, no design work, and no decision Jeff has not already made —
he has confirmed the material. It corrects the machine-to-human ratio in the only way
that matters. It closes the gap where the site cites testimony the reader cannot see.
And it converts the single most perishable asset in this collection from a file in a
repository into a published record.

Everything in Section 1 is worth doing. This is worth more than all of it combined.

---

### Scores

| Area | Score | Reasoning |
|---|---|---|
| **Preservation** | 7/10 | Four redundant repository stores, verified nightly with file counts; 1,087 static pages that need nothing to render. Held back by: masters on a **single** external drive with no second copy recorded; the highest-resolution copy in-repo is a lossy delivery encode; the durable pages omit the audio; and 1,087 of them now depend on a third-party script. |
| **Emotional impact** | 8/10 | The flood, the sculpture sold to a stranger, the 250 openings that never happened, and "the frames below depict nothing" all land hard and land honestly. Docked because the most affecting material is rationed — the deepest testimony is unpublished, and the page carrying what there is animates ornament over it. |
| **Curatorial quality** | 9/10 | The composite reframing is a genuine curatorial act, and `hall-of-openings.html` is better thinking than most institutional wall text. Docked one point because the creator's own 45 selections — the highest-value curatorial judgment available — are not surfaced at all. |
| **Historical value** | 7/10 | High and rising as a specimen of a private practice, strengthened by structured motif/palette/composition data that supports real research questions. Capped by the testimony gap: the interpretive material that would make this a source rather than a specimen is mostly unpublished. |
| **Clarity** | 6/10 | The lowest score, and deservedly. 142 type declarations at ≤11px including 8px and 9px uppercase; two competing canonical URL forms; 18% of works unreachable by theme; a favorites mechanism that collects nothing; and prose dominated 8.7:1 by machine text. Individually minor, cumulatively a record that is harder to read than it needs to be. |
| **Trustworthiness** | 9/10 | Exceptional. Composites flagged everywhere, estimates left as estimates, machine authorship disclosed on every page and in the API, its own regressions published. The one deduction is real: an undisclosed third-party script on all 1,087 record pages contradicts the site's stated posture, and trustworthiness is exactly the axis where an unnoticed contradiction costs most. |
| **Originality** | 9/10 | 250 imagined exhibitions, flagged as fiction and made the organizing idea, is something I have not seen another archive do. The `<noscript>` blocks that describe their own degradation in the site's voice are a second, quieter original act. |
| **Longevity** | 7/10 | Static HTML, no build step required to read, open licence, versioned API, schema.org markup — correct choices for a fifty-year horizon. Reduced by the third-party dependency in the durable layer, the single-copy masters, and 95 `@keyframes` blocks of motion that will be the first thing to rot and will make the site look broken while the record underneath is fine. |

**Composite: 7.75/10.** As a *record*, this is already better than most artist estates
will ever produce. As a *portrait of the person who made the work*, it is incomplete —
and the missing part is written, confirmed, and already in the repository.
