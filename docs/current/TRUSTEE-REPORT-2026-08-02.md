# Trustee's Report — jfsn.com

**Date:** 2026-08-02
**Standing:** Written as museum director and archive trustee, not as designer or developer.
**Standard applied:** *If every other record of Jeffrey Neumann disappeared tomorrow, would
this archive preserve the creative life honestly and completely?*

**Note on method.** This report starts from zero. It does not inherit the conclusions of
`ARCHIVAL-REVIEW-2026-08-01.md` or `CURATORIAL-AUDIT-2026-08-02.md`, and it overturns the
central recommendation of the second one. Where I set out to prove something and the
evidence refused, I have said so in place rather than quietly dropping it.

---

## 1. What this archive is actually about

The site says it is a museum of 1,087 works across fifty years. That is what it contains,
not what it is about.

Read end to end, every distinctive thing here concerns the same subject. 250 photographed
exhibitions that never happened. An 11 × 25-foot Guernica built in a basement that no one
but its maker ever saw, never photographed, destroyed. Six real exhibitions in fifty years.
A collage titled *Buy Me*, which he explains as *"desperate=)"* — trying to sell when
nothing sold. Sixty-three photographs from 2015 of a man in his late fifties going out at
night to tag over other people's graffiti, anonymously. Five hundred to a thousand works
destroyed in storage with no inventory, so that most of them cannot even be named.

None of that is about art reaching an audience. All of it is about making that continued
in the absence of one.

**In one sentence:** *This is not an archive of artworks — it is the fifty-year evidence
file for the proposition that making is sufficient reason to make, and the 1,087 images are
the exhibits.*

That is a more interesting archive than the one the site thinks it is running, and it is
why this collection deserves preservation. The work itself is accomplished but not
singular. The *case* is singular.

---

## 2. The biggest misunderstanding

**The website believes it is the archive.**

This is not a figure of speech. It is written into the governing document. `SUCCESSION.md`
opens its instructions for Jeff's absence with:

> **Goal:** keep the archive intact. Keeping the site live is secondary; **the work is what
> matters.**

Every one of the five priority steps that follows concerns digital files: check GitHub,
check the external drive, check Backblaze, decide whether to keep the site up, find a new
host, contact a library. In that document, "the work" means the repository.

The physical artworks — the actual objects, roughly a thousand of them, somewhere in
Cleveland — appear **zero times**. The only three physical locations the succession plan
asks anyone to record are the Mac, the backup drive, and (as of today) the drive holding
the photographic masters. A trustee following this document to the letter would secure four
redundant copies of the photographs and never learn that the art exists.

The clearest evidence is on `flooded-wing.html`, in a sentence written with total sincerity:

> Every surviving piece is photographed, described, and backed up — **so the work doesn't
> disappear twice.**

A photograph cannot stop a work from disappearing. It stops the *memory* of it from
disappearing. Those are different protections against different failures, and the flood
proved which failure this life is actually exposed to. The 2000s catastrophe did not happen
because the works were undocumented. It happened because they sat in a rented space that
nobody was monitoring, and the documentation gap is why they cannot now be *named* — a
second, lesser injury layered on top of the first.

The archive absorbed the lesser lesson completely and the greater one not at all.

**Why it matters:** this single conflation explains, without any other cause, three
otherwise puzzling facts — the catalog schema's missing field (§3.4), the succession plan's
blind spot, and why the archive's own correctly-written question about physical storage has
sat unasked for two months (§5). It is one mistake, made once, propagating everywhere.

---

## 3. What every previous review missed

These required reading the whole thing. None are cosmetic; each changed my understanding.

### 3.1 The archive has almost no chronology, and every temporal feature is built on six numbers

**99.0% of works — 1,076 of 1,087 — are dated to a bare decade bucket.** Only eleven records
carry a specific year. The entire catalog contains fourteen distinct year values, and six of
them (1970, 1980, 1990, 2000, 2010, 2020) account for everything but those eleven.

The consequence is not obvious until you notice how much the site builds on time. The
Current is "a river of every work in the archive," ordered chronologically. The archive
offers a decade filter. `guernica-passage.html` narrates a thirty-year series. Every page
footer reads *1,087 WORKS · 50 YEARS · 1974–PRESENT*.

All of it rests on six real data points. The river is not a chronology; it is six shelves
displayed as a current. This is disclosed honestly at the record level — `year_precision:
estimated`, `year_display: "1990s (est.)"` — and I want to be exact about the finding: **the
data is not dishonest, the interface is more confident than the data.** A researcher in 2075
who sorts this collection by year is sorting six buckets and will not necessarily realize it.

### 3.2 The 1980s hole is the biography, and no page says so

Eleven works survive from the entire decade — 1.0% of the archive. Of those eleven, five are
flagged composites, and four of the rest are photographs *of* the studio rather than
artworks: *Untitled (Studio Desk View)*, *Untitled (Electric Typewriter)*, *Polaroid
Self-Portrait*. Roughly **five actual artworks** represent 1980–1989.

Jeff was 25 to 35 in that decade. The oral history explains it precisely, in his own
confirmed voice: *"life went a different direction. Career. Marriage. Children. Bills. The
ordinary weight of a life that needed to be lived… The studio work moved to the edges."*

So the largest gap in the archive is not a preservation failure. **It is the most human fact
in the collection rendered as an empty bin.** A visitor filtering by decade sees the 1980s
return almost nothing and will read it as missing data, or as a man who stopped. It was
neither. It was a marriage and small children.

`flooded-wing.html` proves this archive knows how to present an absence with meaning. It
does it for the flood, magnificently. It has not done it for the decade where the absence
means something entirely different and entirely ordinary.

### 3.3 A confirmed physical practice is completely unpublished — and the archive's rigor runs only one way

Sixty-three catalogued works carry street-art keywords; sixty of them are dated 2010s. They
are photographs of walls covered in murals, stencils, paste-ups, and tags. The machine-written
descriptions treat them as documentation: *"Narrow urban alleyway surfaces covered in layered
spray-paint murals."*

`master-notes.md` §28, dated 2026-07-05, records Jeff answering the direct question about
these photographs, verbatim:

> photos of me tagging over other peoples graffiti

A man approaching sixty went out and tagged over other people's graffiti, and photographed
it. That is among the most striking biographical facts in this entire collection.

**The words "tagging," "street art," "graffiti," "paste-up," and "stencil" appear on zero of
the fourteen core pages.** I checked for each independently.

The structural observation matters more than the omission. This archive has built formidable
machinery against *overclaiming* — 250 composites flagged in the grid, on every static page,
in the lite catalog, and in the API, so that no visitor can mistake an imagined exhibition
for a real one. It has **no machinery at all against underclaiming.** A reader looking at
art0004 will conclude Jeff photographed someone else's mural. The truth is that at least
some of those marks are his.

And the honest version is worse than a simple omission. §28 explicitly leaves open *which*
walls, *which* city, and *how many* occasions. So for any individual street photograph, the
archive cannot say whether Jeff made the mark or documented someone else's — and that
distinction is exactly the sort that dies with the man.

### 3.4 The catalog cannot express whether a work still exists

Twenty-four fields have ever appeared on a catalog record. I checked for every plausible
name: *survives, extant, location, status, lost, destroyed, whereabouts, condition,
physical.* **None exists.**

Every record silently asserts that its object is accounted for. The archive's own notes spot
this, in §29, while recording testimony about art0262: *"The schema has no field for physical
survival/location status — every catalog entry implicitly presumes the work is accounted
for."*

Jeff's own words about that work, from the same session:

> wanted to keep everything, not sure what happened to this one/might have been thrown out
> during massive cleanup

then, on clarification:

> i might still have this one

That is the true epistemic state of an unknown number of the 1,087, and the catalog has no
way to hold it. **An archive founded on a storage catastrophe cannot record loss in its
data.** It can only narrate loss in prose, on hand-built pages — which it does superbly, and
which is precisely what conceals the gap.

### 3.5 The archive's signature body of work has no name in its own taxonomy

The 250 composites are the intellectual centerpiece — the site is titled after them. In
`work_type`, they are filed as: photograph (228), collage (12), sculpture (8), painting (2).

There is no `composite` work type. `composite` exists only as a boolean warning flag. So the
one practice that is unmistakably and originally Jeff's is classified, in the archive's own
vocabulary, as four other things. `master-notes.md` reaches the same conclusion independently:
*"Jeff has a digital compositing practice — Photoshop as a medium for imagined placements…
documented nowhere in the oral history and not represented in the catalog's work_type
taxonomy."*

The taxonomy can describe what he borrowed. It has no word for what he invented.

### 3.6 What I set out to prove and could not

I expected to find that the archive buries its lost works. **That is false, and I was wrong
to suspect it.** The 11 × 25-foot Guernica is published twice, and both treatments are
better than professional practice. `flooded-wing.html` gives it a wall at the far end with a
5′9″ human figure for scale and a twenty-five-foot drag interaction — you measure the absence
with your own hand. `guernica-passage.html` interrupts the sequence of surviving works with
it: *"SOMEWHERE IN THIS PERIOD — THE DECADE IS NOT DOCUMENTED… No one else ever saw it. Lost
to water damage. Never photographed."*

Placing a lost work *in sequence* with surviving ones, as an interruption, is a genuinely
sophisticated curatorial act. I could not find another archive that does it.

I also expected the six-exhibition record to be unverified marketing residue. It is the
opposite: `EXHIBITION-VERIFICATION-WORKSHEET.md` records that git forensics caught the table
growing out of "TBD gallery" placeholders with no source, that Jeff was asked all six rows
directly, and that his answers were then re-verified byte-for-byte against his testimony
during a later audit. That is a higher evidentiary standard than most museums apply to their
own wall text.

Both corrections sharpen rather than soften the central finding: **this archive's narrative
layer handles absence with real sophistication, and its data layer cannot express absence at
all.** The prose is on fourteen hand-built pages. The data is what the API serves, what the
1,087 durable pages carry, and what will survive when the pages stop rendering.

---

## 4. Preservation audit

**Artwork — strong, with one qualification.** 1,087 works photographed, described,
structurally catalogued, and rendered as static HTML that needs nothing to open. Images are
never cropped or filtered: `object-fit: contain` throughout, `cover` only on hero photography.
Qualification: the highest-resolution copy inside the repository is a lossy delivery encode,
and the masters are on a **single** external drive with no second copy recorded.

**Creator — the weakest dimension, and the most surprising one.** The archive holds 12,148
words of oral history and publishes roughly 1,240. It holds a first-person account Jeff
confirmed as *"feels true"* which answers the question its own notes rank as *"#1. The most
important unanswered question."* It holds a confirmed street practice it never mentions. It
holds 45 works he personally marked as mattering most, on a page (`favorites.html`) that no
longer exists. The man is the scarcest material here and the least present.

**Context — good and improving.** The Cleveland grounding, the material history (prism paper
from school, CDs, floppies, keyboards), the Guernica through-line across thirty years, the
Rauschenberg realization. The eight preserved working-history websites are unusually valuable
primary sources: they predate the archive, carry a BFA year in his own words, and — via
`street-art.html` and its "late spring and early summer of 2015" caption — are what made §28
possible in the first place.

**Testimony — excellent in quality, poor in reach.** Verbatim, dated, session-attributed,
and scrupulous about marking paraphrase versus quotation. §29's structure — Creator
Testimony / Creator Context / Unresolved, with an explicit refusal to attach a sculpture
memory to a specific catalog record that Jeff could not confirm — is textbook. Almost none of
it is on the website.

**Uncertainty — best-in-class, and unusually principled.** 1,084 dates left as estimates
against enormous temptation. Confidence levels recorded and revised downward when evidence
weakened. Answered "don't know"s marked *never re-ask*. §29 keeps two facts deliberately
unconnected rather than joining them into a better story. This is the single most impressive
discipline in the archive.

**Provenance — asymmetric.** Rigorous against overclaiming: composites flagged everywhere,
machine authorship disclosed on all 1,087 pages and in the API, a title corrected only on
Jeff's explicit instruction because §8.2 forbids AI from authoring titles. Defenceless
against underclaiming: see §3.3.

**Future research value — high, and higher than the site realizes.** Structured `motifs`,
`palette`, `composition`, and `materials` on every record let a researcher ask real questions
of the collection. §24's economics question — *"what did making art cost, and where did the
money come from?"* — is correctly identified as among the rarest records in art history, and
is unanswered.

**Independence from future technology — strong at the record layer, compromised at the edges.**
Static HTML, no build step required to read, CC BY 4.0, versioned API, schema.org markup. But
all 1,087 durable pages load a third-party analytics script from `gc.zgo.at`, which none of
the 14 core pages do — so the layer built to outlive everything is the only layer with an
external runtime dependency.

### Impossible to reconstruct if lost

In strict order of irreversibility:

1. **Where the physical works are.** Recorded nowhere, in any document, in any store.
2. **Which street marks are his.** §28 confirms the practice and leaves the attribution open.
3. **His voice.** 34 seconds exist; the durable pages carry none of it.
4. **Which marks in the 31 collaboration works belong to which grandchild.** The children were
   too young to recover their own hands later.
5. **Which faces among 268 photographic-face works are family.**
6. **What the lost 500–1,000 works were.** No inventory, no photographs, no witness.
7. **What the works are physically made of** — the board, the glue — which decides whether the
   objects survive the next fifty years at all.

Everything else in this archive is already redundant across four stores.

---

## 5. The one change

**Record where the physical artworks are, and put it in `SUCCESSION.md`.**

Room by room, building by building, in whatever resolution Jeff will give — even three
sentences. Then say plainly, in the same entry, what remains unknown.

### Why this and not anything else

I recommended a different single change earlier today — publish the oral history — and that
recommendation was wrong. The reasoning that overturned it is simple and I should have applied
it the first time: **the oral history is not at risk.** All 12,148 words sit in the repository,
in git history, replicated to GitHub, an external drive, and Backblaze, verified nightly by
file count. Publishing it would improve the website. It would not improve preservation by one
unit, because nothing about it can be lost. I had confused *unpublished* with *endangered*.

The location of the physical works is in the opposite condition. It is written in no document,
no catalog field, no oral-history section, and no succession plan. It exists in exactly one
place — Jeff's memory — and it is the only item on the irreversibility list whose loss would
also destroy the primary objects rather than merely the knowledge about them.

Four further reasons it outranks every alternative:

**It has a proven failure precedent in this specific life.** Five hundred to a thousand works
— over half of everything he made — were destroyed in unmonitored storage. Not in a fire, not
in a flood of nature, but in a rented space nobody was checking. That exact exposure is live
right now for the surviving thousand, and no document names a single room they occupy.

**The archive already diagnosed it, correctly, and then filed it too low.** §24.8, written
2026-06-10: *"Physical housing of the 1,084 now (the water damage proved storage is where this
work dies; **the handoff covers FTP, not closets**) — 'Room by room — where do the works live,
and which storage worries you?'"* The question is already written, in the right words, by this
archive. It sits in Tier 4 of the knowledge inventory, below *"Who Aunt Mary is."* By the
inventory's own stated formula — irreplaceability × risk of loss × value to a future
grandchild — it belongs in Tier 1.

**It is subtraction-shaped, not a feature.** No page, no design, no interaction. Three
sentences in a document that already exists and that I edited today for a smaller version of
the same gap.

**It is the easiest possible conversation.** §24 correctly identifies the craftsman questions
as the low-risk ones: lists, objects, shop talk, no emotional weight, no *"boring/next"* risk.
This is a man being asked where he keeps his things. It is the least intrusive question on the
entire list and it protects the most.

Everything else worth doing stays worth doing. This is the only one where the alternative to
doing it is that a thousand physical artworks quietly become unfindable, and the archive
becomes a perfect, redundant, beautifully-built catalogue of objects no one can locate.

---

## 6. Final judgment

**What will historians value most?** Not the artwork. The *economics and persistence of an
unwitnessed practice* — six exhibitions in fifty years, a title called *Buy Me* explained as
*"desperate=),"* an 11 × 25-foot painting made for no audience, materials chosen because
supplies cost too much. Art history is overwhelmingly the survival record of people who were
already visible. This is a rigorously documented instance of the other case, and there are
almost none.

**What will artists value most?** The 250 composites, and the decision to publish them flagged
rather than suppressed. Every artist has imagined the room. This one photographed it for
decades and then refused to let the images pass as documentation. That is a real idea, it is
his, and the archive's flagging discipline is what converts it from wishful thinking into a
body of work.

**What will Jeff's family value most?** Not the museum. The five minutes of him talking — 34
seconds of which exist — and the answers to questions like which grandchild's hand is in which
collaboration, which faces in the collages are theirs, and where the things actually are. The
grandchild the guiding question invokes will not want the interface. They will want to find
the object and know he touched it.

**What currently weakens all three?** One thing, and it is the same thing in each case: **the
archive has protected the record of the work and not the work.** Historians will find a
catalogue and no economics. Artists will find composites and no account of the compositing
practice or the street practice. Family will find 1,087 photographs and no address. Every
weakness in this report is a variant of the misunderstanding in §2.

**Would I preserve this archive exactly as it exists?** **Yes — immediately, and without
conditions.** It exceeds the standard for permanent preservation as it stands today. It
discloses its composites, its estimates, its machine authorship, and its own shipped
regressions. It publishes a work that no longer exists and lets you measure its absence with
your hand. It corrected its own exhibition history after git forensics showed the table had no
source. I would accept this collection today and consider the institution fortunate.

That answer is not in tension with everything above. Preserving it exactly as it exists
preserves a *record*. The recommendation in §5 is what preserves the *work*, and only Jeff can
supply it — which is the entire reason it outranks the rest.

---

### What truth about this archive took the longest to discover

That its greatest strength and its central blind spot are the same act.

Photographing all 1,087 works was the correct, disciplined, admirable response to losing half
a life's output. It is why this archive exists and why it is worth preserving. But the
completeness of that response is precisely what stopped anyone — including three prior audits,
two of them mine — from asking the more ordinary question underneath it. Once every work has
been photographed, described, backed up four ways, and verified nightly, the collection *feels*
safe. The anxiety the flood created has been fully discharged into the digital record.

So nobody checked the closets. Not out of negligence — because the rigor of the digital work
produced a genuine and entirely reasonable sense of safety about a domain it never touched.
The archive built four redundant copies of the evidence and left the exhibits exactly where
they were in 2005.

I did not see it while measuring animations, contrast ratios, or word counts. I saw it only
after reading §24.8 — a sentence this archive wrote about itself two months ago, filed in the
right words under the wrong priority, and never came back to:

> the handoff covers FTP, not closets.
