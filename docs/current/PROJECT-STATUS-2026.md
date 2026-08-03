# PROJECT-STATUS-2026

**The official status of the JFSN Archive**
**Adopted:** 2026-08-02 · **Last updated:** 2026-08-03 (Priority 3 shipped) ·
**Supersedes:** all audit and trustee reports listed in *Lessons Learned*

This document closes six investigations conducted between 2026-08-01 and 2026-08-02. It is
not another opinion. Where those reports disagreed, this document decides. Where they agreed
on weak evidence, it rejects them. It is intended to be the single document a family member,
custodian, museum professional, or historian reads to understand what this archive is.

Every figure below was verified by execution against the repository on the date of adoption.
Where evidence is insufficient to settle a question, that is stated rather than resolved.

---

# Executive Summary

**What JFSN has become.** A complete, honestly-catalogued photographic and documentary record
of one artist's fifty-year practice: 1,087 works, each with a permanent static page that
renders without JavaScript, an open data set under CC BY 4.0, a versioned public API, and a
body of governance documents written for people who will never meet its subject. Its most
distinctive holding is 250 photographic composites depicting exhibitions that never occurred,
every one flagged as fiction in the interface, the catalog, and the machine-readable data.
Its most irreplaceable holding is a small quantity of first-person testimony — 34 seconds of
recorded voice and roughly 264 words of strictly verbatim speech.

**What it is not.** It is not a custodial archive. It holds no physical works, records the
location of none, and knows the physical dimensions of none of the 1,087. It is not a chronology: 99.0% of
works carry a bare decade estimate, and the entire fifty-year sequence rests on six distinct
year values. It is not an authored account by its subject: the catalog's titles and
descriptions were written by software, and the interpretive prose across the site was
substantially drafted by AI under Jeff's direction — a fact the site has disclosed on
`about.html`, in his name, since 2026-08-03. It is not, and has never been, examined by any
party outside the system that built it.

**What is complete.** The design phase. The photographic capture of the surviving collection.
The composite disclosure regime. The technical foundation for long-term survival — static
HTML, no runtime dependencies on the core pages, a standard-library-only build chain, four
redundant stores verified nightly, an owned domain. The accessibility work. The exhibition
record, verified against the creator's testimony after forensics showed the original table
had no source. The governance corpus. These should be treated as finished and not reopened.

**What remains.** Two things, both of which only Jeff can supply: the physical facts of the
collection (where the works are, how large they are, what they are built from), and the
identification of the people in the work (268 works with faces, 31 made with grandchildren).
The third — a single sentence disclosing who wrote the archive's interpretive prose — was
shipped on 2026-08-03 and is recorded under *Remaining Priorities* below. Everything else on
every prior list can be done by any custodian, at any time, including after his death.

---

# Current State

Verified 2026-08-02. `archive verify` reports PASS, 0 failures.

**Holdings.** 1,087 works: 641 collages, 328 photographs, 76 sculptures, 42 paintings. 250
are Photoshop composites depicting imagined installations and are flagged as such in every
layer. Approximately 100 non-composite photographs document street art; creator testimony of
2026-07-05 establishes that at least some record his own physical tagging practice
(*"photos of me tagging over other peoples graffiti"*), though which specific works is not
established.

**Dating.** 1,076 of 1,087 works (99.0%) are dated to a bare decade bucket. Three works carry
`year_precision: exact`, each verified against the object at full resolution rather than
against its catalog description. Fourteen distinct year values exist across the corpus.

**Physical description.** **Zero works of 1,087 carry a physical dimension.** *(Corrected
2026-08-03. This document previously said one. That figure traced to a machine-written
description of `Design: Electrical Gulf Cart` — "a dimensional annotation of 19 inches width" —
which is the width of the golf cart drawn in the artwork, annotated by Jeff inside the 1976
rendering, not the size of the object. `config/dims.json` holds pixel dimensions of the image
files; `verify.py`'s `check_dimensions` only asserts those are positive integers. No field for
physical size exists in the schema.)* `materials` is populated for
880 works but was inferred from photographs, not from knowledge of substrate or adhesive; 242
works are recorded as containing tape of unknown type. There is no field for condition,
location, ownership, or physical survival.

**Textual provenance.** 624 titles (57%) are descriptive rather than "Untitled" and were
machine-written. 232 works are assigned to a "Guernica" series by automated detection over
machine-written title text; 12 of those cite Guernica in their own description. 201 works
(18%) carry no theme. The site discloses that titles and descriptions were written by
software. It does not disclose that `materials` and `palette` were derived the same way.

**Testimony.** One audio recording, 34 seconds. `master-notes.md` runs to 12,148 words, of
which approximately 264 sit inside block quotes, the document's own convention for verbatim
speech; the remainder is archivist narration, analysis, session records, and synthesized
first-person drafts confirmed by Jeff but not spoken by him. `stories.html` publishes roughly
1,240 words labelled verbatim at section level over content that mixes testimony and framing
at sentence level.

**Digital form.** 5,478 AVIF files and one JPEG. There is no format redundancy; the four
redundant stores replicate the same codec. The photographic masters are held on a separate
external drive outside the repository and the backup chain; their format is not recorded and
their physical location is not recorded.

**Technical posture.** Static HTML; the 14 core pages carry no third-party runtime
dependency; the 1,087 generated pages each load one external analytics script. The Python
build chain uses only the standard library and shells out to `avifenc` and ImageMagick. The
sitemap carries 1,099 URLs. Backup LaunchAgents run nightly and are verified by file count.

**Authorship.** 1,345 of 1,601 commits (84%) carry AI co-authorship, including the commit
that introduced the site's curatorial prose.

---

# Decisions Now Considered Final

Closed. Not to be reopened without extraordinary evidence.

**1. The design is finished.** The five rooms, the animations, the typography, the transitions,
the hero treatments. Closed because design was Jeff's to direct, he directed it, and the
work is coherent and complete. Prior audits recommended removing individual animations and
raising the type floor; those recommendations are rejected as aesthetic preference presented
as archival evidence.

**2. The composites are published, flagged, and central.** Closed. The disclosure is carried
in the grid, on every static page, in the lite catalog, and in the API. This is the archive's
principal curatorial act and its most defensible one.

**3. Artwork images are never cropped, filtered, or altered.** Closed and non-negotiable.

**4. Dates remain estimates unless the work is dated in Jeff's own hand.** Closed. The blanket
default is honest and the three exceptions were verified against the objects. Note for the
record: the blanket application was a build-script default, not a per-work finding, and
should be described as such rather than as scholarly caution.

**5. The preserved working-history sites are never edited.** Closed by Jeff's decision of
2026-08-02, including the full date of birth published on one of them. A future privacy,
accessibility, or SEO review will find that date and read it as an exposure. It is not.
Redaction would be falsification. Ask; do not tidy.

**6. `about.html` reads "Still making. Still in Cleveland."** Closed by Jeff's decision of
2026-08-02: *"i'm alive."* Not to be re-flagged.

**7. The exhibition record is six shows and is settled.** Closed. Git forensics established
the original table grew from placeholders with no source; all six rows were put to Jeff
directly and his answers re-verified byte-for-byte.

**8. `artwork.html?id=` remains the canonical URL form.** Closed as parked, deliberately, in
2026-07-21. Revisit only on concrete evidence of harm.

**9. Scoring the archive is abandoned as a practice.** A 0–10 rating is unfalsifiable and
invites managing a number rather than a collection. The scores published in the curatorial
audit are withdrawn.

**10. The masters are on a separate external hard drive.** Recorded in `SUCCESSION.md` per
Jeff, 2026-08-02, at exactly the resolution he gave. He considers the matter closed. Format
and precise location remain unrecorded and are listed below as open, but the question is not
to be pressed.

---

# Open Questions

Genuinely unresolved. Ranked by historical importance.

**1. Where are the physical works?** Recorded in no document, field, or plan. Only Jeff knows.
This blocks conservation, any future loan, any transfer of custody, and the only route to the
archive's own highest confidence tier that survives him — physical examination.

**2. What are the works physically made of?** `materials` was inferred from photographs. The
conservation-critical facts — substrate, adhesive — are unrecorded. §24.1 of the oral history
asked the right question in his lifetime and it is unanswered.

**3. How large are the works?** Zero records of 1,087 (corrected 2026-08-03; see *Current
State*). All three works in the lost-works
register carry measurements; the surviving collection does not.

**4. Who is in the work?** *(List pinned 2026-08-03 — see `FACES-LIST-PINNED-2026-08-03.md`.
The 268 figure is the machine-detected `photographic-face` motif, not a count of identifiable
people: 31 are composites, and spot-checking the images showed the label is unreliable in both
directions. Working list is the 30 non-composite Collaboration works plus ~7 works that name
their subject in Jeff's or a grandchild's own hand.)* 268 works contain photographic faces; 31 were made with
grandchildren. None identified. The children were too young to recover their own hands later.

**5. What format are the masters, and where is that drive?** The repository is a format
monoculture — 5,478 AVIF files, one JPEG. The masters may be the only format diversity the
collection possesses, and neither their format nor their location is written down.

**6. Who owns the works, and who inherits them?** No title or heir record exists in any
governance document. `SUCCESSION.md` lists the technical successor as undecided, annotated
*"not an oversight, an open question."*

**7. Which street marks are his?** §28 confirms the practice and explicitly leaves open which
walls, which city, and how many occasions. 63 works are individually ambiguous.

**8. What happened in the 1980s?** Eleven works survive; roughly five are artworks. Two
explanations exist — the ordinary weight of career, marriage, and small children, or loss in
the flood — and **the archive cannot distinguish them.** A prior trustee report asserted the
first with confidence and had no basis to.

**9. How were the 45 favorites chosen?** `favorites.txt` records them; no document records
the criteria or whether Jeff selected them himself. A 2026 session checkpoint flagged this
independently.

**10. Has any party outside this system examined the archive?** No. All governance documents,
the curatorial prose, 84% of commits, and all six investigations share one author. This is
not evidence of dishonesty — the evidence suggests unusual honesty — but the archive's
reputation for integrity is entirely self-certified.

---

# Remaining Priorities

Ranked by historical value, preservation value, uniqueness, and irrecoverability.

### 1. The physical pass — location, size, substrate and adhesive

**Why it matters.** Half this life's output — five hundred to a thousand works — was destroyed
in a rented storage space nobody was monitoring. That is not a hypothetical risk profile; it
is this collection's history, and the same exposure applies now to the works that survived.
Size is not metadata for collage and sculpture; it is the work. Adhesive and substrate decide
whether the objects physically last another fifty years.

**Who can do it.** Jeff, and only Jeff, for as long as he is here. After that, partially
recoverable for works someone finds, and not at all for works nobody finds.

**If never done.** The physical collection becomes unfindable and then vanishes the ordinary
way — a cleanout, a move, an estate sale. The archive would document the second loss no
better than it documented the first: perfect photographs, no address. Conservation becomes
impossible. The photographs remain, and lose most of their evidentiary value as art history.

### 2. Naming the people

**Why it matters.** It is the only remaining item where the archive's guiding question — *will
this help a future grandchild understand Jeff?* — is answered literally. A grandchild will one
day look at a work containing their own four-year-old hand and nothing in the archive can tell
them it is theirs.

**Who can do it.** Jeff alone. Fragment recognition dies with the person who watched it happen.

**If never done.** A quarter of the archive becomes permanently anonymous. This is the loss
that will be felt most and complained about least, because nobody will know what is missing.

### 3. Disclosing who wrote the interpretive prose — ✅ DONE 2026-08-03

**Why it mattered.** This archive's standing rests on volunteered honesty — composites flagged,
machine authorship of catalog text declared, its own shipped regressions published, its
exhibition record corrected after forensics. There was one gap in that regime and it sat in
the layer with the most authority: the essays that tell a reader how to understand the work.
The commit history preserves the evidence permanently, so this was never about concealment. It
was about who says it first.

**Resolved.** Jeff authorized the disclosure on 2026-08-03 and it shipped the same day to the
`#philosophy` block on `about.html`, in first person and signed:

> *I directed this archive but I didn't write most of it.* The essays here were drafted with AI
> to my instruction, and I approved them. Where you see quotation marks, those are my words.
>
> — Jeffrey F. S. Neumann · The catalog titles and descriptions were written by software; see
> The Archive.

He chose the wording from three drafted options and did not rephrase it — so the disclosure is
his authorization in the archivist's words, which is itself the condition the sentence
describes. Recorded here rather than smoothed over. Commit `82dbf6a88`.

**Still open, and smaller.** `materials` and `palette` were derived the same machine way and
are not yet covered by any disclosure. That remains on the custodian list below.

### 4. More recorded voice

**Why it matters.** 34 seconds exist, and roughly 264 words of strictly verbatim text. This is
the one category that cannot be written down, and the second investigation's assumption that
the great interpretive question had been captured in time was **false** — what was captured was
a reconstruction Jeff assented to.

**Who can do it.** Jeff alone.

**If never done.** The archive holds no record of how he actually spoke, and its most-quoted
line about him remains a sentence he agreed with rather than said.

**Status:** raised once, answered *"maybe tomorrow."* That is his decision and it stands. This
entry exists so the item is not lost from the record, not to reopen it.

---

# Work Explicitly Deferred

Not being pursued. Each is deferred for a stated reason, not by neglect.

- **Cosmetic redesign, animation refinement, typography, interface polish.** The design is
  finished and was Jeff's to direct. Recommendations to remove specific animations, chips,
  fades, or to raise the type floor were taste presented as evidence, and are rejected.
- **Further audits.** Six investigations in two days reached diminishing returns and began
  producing corrections to each other rather than new findings. The archive does not need
  another opinion from inside itself; if further examination is ever wanted, it should come
  from outside.
- **Publishing the oral history as a priority.** The material is replicated four ways and
  cannot be lost. Publishing improves the website and improves preservation by zero. Worth
  doing; not a priority, and not Jeff's to do.
- **Rebuilding `favorites.html`.** The 45 selections survive in `favorites.txt`. Any custodian
  can rebuild the page at any time.
- **Adding a survival or condition field to the schema.** An empty field preserves nothing.
  The knowledge is the asset and it is Priority 1.
- **Remediating the 624 machine-written titles.** The constitution postdates them and §8.2
  bars AI from authoring replacements. Correcting them requires Jeff's confirmation per title,
  which is a poor use of the time Priorities 1 and 2 need. Recorded as a known condition.
- **Re-drawing the 232-work Guernica series boundary.** The practice is creator-confirmed;
  only the extent is machine-inferred. Recorded rather than corrected.

---

# Future Custodian Guide

### Requires Jeff

- Where the works are, how large, what they are made of
- Who is in the 268 face works and the 31 collaborations
- ~~Authorization and wording of the interpretive-prose disclosure~~ — done 2026-08-03
- Any further voice recording
- Which street marks are his
- What the masters' format is and where that drive is
- Which of the 624 machine titles, if any, should change
- What happened in the 1980s
- Who owns the works and who inherits them

### Requires any future custodian

- Removing the third-party analytics script from the 1,087 generated pages
- Removing the 3.4-second reveal timer on `hall-of-openings.html`
- Publishing the oral-history material that already exists
- Rebuilding a favorites page from `favorites.txt`
- Disclosing the street practice in the general terms §28 already supports
- Extending the machine-authorship disclosure to cover `materials` and `palette`
- Resolving or deleting the 66 standing `audit-nav.sh` warnings — a permanent warning is a
  broken check
- Establishing format redundancy for the image corpus
- ~~Adding the disclosure from the git record if Jeff never does~~ — moot; Jeff disclosed it
  himself, 2026-08-03

### Requires neither

- Paying for the domain and hosting, on time, forever. This is custodial duty number one.
- Verifying the backups by restoring from them rather than trusting the logs
- Leaving `working-history/` untouched
- Leaving the design alone

---

# Lessons Learned

Six investigations, 2026-08-01 to 2026-08-02: the archival review; a curatorial audit; a
trustee report; an adjudication of the first two; a two-pass stewardship simulation set twenty
years forward; and a devil's-advocate prosecution. *(Note: the adjudication and the trustee
decision exist only in session transcript. They were reported as filed and were not. This
document consolidates them; no back-fill is required.)*

**Conclusions that survived.** The third-party script on 1,087 durable pages. The absence of
any location record. One dimensioned work in 1,087. The unpublished street practice. The
schema's inability to express loss. The composites having no work type of their own. 99%
decade-bucketing. The stranded 45 favorites. The undisclosed interpretive voice.

**Conclusions overturned.**

- *"Publish the oral history"* as the single highest-value action. **Overturned** — the
  material is replicated four ways and is not at risk. This confused *unpublished* with
  *endangered*.
- *"12,148 words of testimony."* **Overturned** — roughly 264 words are strictly verbatim.
  Three reports repeated the larger figure and it flattered the archive.
- *"Preserve immediately and without conditions."* **Revised** — no institution should accept
  without reservation a collection whose every credential is self-issued.
- *"The 1980s gap is the biography."* **Overturned** — two explanations, indistinguishable.
- *"The lost works are buried."* **Overturned by evidence during the investigation** — they are
  published twice, and better than professional practice.
- The 0–10 scores. **Withdrawn.**

**Assumptions that proved false.** That an audit which measures is more rigorous than one which
reads — the measurement pass missed the authorship question entirely. That agreement between
reports constitutes corroboration — all six shared an author. That the photographic record is
an adequate surrogate for the works. That "1,087 works" is a homogeneous unit.

**What surprised the investigators most.** That the archive's greatest strength and its central
blind spot are the same act. Photographing everything was the correct response to the flood,
and the completeness of that response is precisely what stopped anyone from asking the ordinary
question underneath it. Once every work is photographed, described, backed up four ways and
verified nightly, the collection *feels* safe. Nobody checked the closets. The archive itself
wrote the diagnosis in June 2026, in the right words, and filed it under the wrong priority:
*"the handoff covers FTP, not closets."*

---

# Definition of Done

The JFSN project is complete when the following are true. Not perfect. Complete.

**Complete means:**

1. The photographic and documentary record of the surviving collection exists, is honest about
   its own provenance and uncertainty, and renders without dependency on any living technology
   company. **This condition is met.**
2. The physical collection is described well enough that someone who never met Jeff could find
   it, handle it correctly, and know how large each work is. **This condition is not met and is
   Priority 1.**
3. The people in the work are named by the only person who can name them. **Not met. Priority 2.**
4. A reader can tell, without reading a commit log, which words in the archive are Jeff's, which
   are software's, and which are the archivist's. **Substantially met as of 2026-08-03 —
   catalog text and interpretive prose are both disclosed, and quoted text is identified as
   Jeff's own words. Two residuals, neither a priority: `materials` and `palette` are not yet
   covered, and the disclosure treats "software's" and "the archivist's" as one category rather
   than two.**
5. The succession documents identify who holds the archive, who holds the works, and who pays
   the domain. **Partially met.**

When those five are true, the project is done. Further additions of artwork are the archive
fulfilling its purpose, not unfinished business.

**What should continue forever.** Paying the domain and hosting on time. Verifying the backups
by restoring from them. Adding new work when work is found, on the existing terms — photographed,
described truthfully, dated no more precisely than is honestly known, and never guessed at for
attribution. Recording the questions that could not be answered, in ranked order, so that a
future custodian knows the difference between what was never true and what was never written
down. That last practice is the most valuable thing this archive does and the least likely to
be recognized as such.

**What should stop.** Auditing. Six investigations in two days produced their most useful work
early and then began correcting one another. The archive has been examined enough from the
inside; what it lacks is examination from outside, which is a different thing and cannot be
supplied by more of the same. Design revision should stop, having reached a coherent end.
Re-litigating settled decisions should stop; that is what the list above exists to prevent.

**What should never be revisited.** The preserved working-history sites, including the date of
birth published on one of them. The present-tense sentence on `about.html`. The composite
disclosure. The rule that artwork images are never altered. The decision to leave 1,084 dates
as estimates. The exhibition record. These were decided by the person whose life this is, on
the evidence, and every one of them will look to some future reviewer like an error worth
fixing. They are not.

---

*This document reflects the state of the archive on 2026-08-02 and the adjudicated conclusions
of the investigations conducted on that date. It should be revised only when one of the five
conditions above changes state, and should not be replaced by further review.*
