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

**The weakness is that the artwork itself has no preservation master, and that the
archive does not tell the reader who wrote its words.** Both are fixable without
adding a single feature.

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

### 1. There is no preservation master — the only unrecoverable finding

The highest-resolution surviving copy of nearly every work is a **lossy AVIF delivery
encode**: 1400×2800, averaging 381 KB, 424 MB for the collection. AVIF is a web
format, not a preservation format.

Only **6 original camera files survive**, all from recent intake. For roughly 1,081
works the original photograph is gone, and the compressed derivative *is* the master.

That 424 MB master set exists in three places, none institutional: this Mac, the
HostGator server, and Backblaze. It is deliberately gitignored. The public redundancy
on GitHub is the `medium` tier — 900×1800, a derivative of a derivative. A future
curator forking the repository receives a study image, not a reproduction.

The entire master set is 424 MB. That is smaller than a single modern video file. The
disproportion between the value of the asset and the cost of protecting it is the most
striking thing in this review.

- [ ] Two additional copies minimum, at least one outside a personal vendor account
- [ ] Consider institutional deposit (university or regional archive, Cleveland)

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

- [ ] Disclosure paragraph on `archive.html` and in `api/v1/meta.json`
- [ ] Correct `art0001`'s title

### 3. The record is nearly invisible to search engines

`sitemap.xml` contains **12 URLs — none of them artworks.** In `build_catalog.py`,
line 263, the code that would add all 1,087 is commented out, rationale: *"discovery
via archive.html + filters instead."* But that path is built entirely in JavaScript: a
crawler without JS finds exactly **one** link into the collection. Pages do chain
prev/next, so a crawl is theoretically possible, but it requires walking a 1,087-deep
sequence from a single buried entry point — precisely what crawlers abandon.

A historian searching for this work will most likely not find it. The fix is
uncommenting three lines that are already written.

- [ ] Uncomment `build_catalog.py:263`

### 4. Every date is "estimated," including the certain ones

All 1,087 records carry `year_precision: estimated`. Yet `art0379`'s own description
reads *"signed and dated 11/30/2022 at lower right."* The work is signed, the archive
knows it in writing, and still reports the date as a guess. Understating certainty is
a smaller sin than overstating it, but it is still an inaccuracy and it makes the
dating apparatus less useful than the evidence permits.

- [ ] Mark visibly-signed works as exact, starting with those whose descriptions say so

### 5. The voice is 34 seconds, and unlabeled

One recording, `who-i-am.m4a`, 33.8 seconds. It renders as an unlabeled play button —
`data-title` is populated and announced *only* to screen readers, so a sighted visitor
sees a bare triangle with no indication it is the artist speaking. Separately,
`art1069` points at `neon-city-nocturne.m4a`, which does not exist on disk.

- [ ] Visible label on the player (design call — Jeff's to direct)
- [ ] Resolve or remove the `art1069` pointer
- [ ] **Record more voice while that is possible** — this is the highest-value action available

### 6. No biographical anchor

No birth year appears anywhere on the site. There is no `Person` structured data on
the homepage or about page — only inside individual artwork records. A researcher
cannot establish from this archive when its subject lived. And `about.html` reads
*"Still making. Still in Cleveland."* — present tense a permanent record cannot hold.

- [ ] Birth year + one `Person` JSON-LD block
- [ ] Revisit present-tense phrasing in `about.html`

### 7. Work count stale in 70 places

Every page says 1,086. The catalog holds 1,087.

- [ ] Regenerate the count sitewide

---

## III. Priority order

1. Get the 424 MB master set into durable, independent custody
2. Disclosure paragraph on machine-written metadata + fix `art0001`'s title
3. Uncomment `build_catalog.py:263` (sitemap)
4. Mark signed works as exact-dated
5. Label the recording; fix `art1069`; record more voice
6. Birth year + `Person` structured data
7. Regenerate the work count

---

## IV. What to leave alone

The five rooms, the animations, the typography, the vault hero, the river, the page
transitions. They are finished, coherent, and better than the work they present has
any right to expect. Every remaining hour belongs to the artwork and its metadata,
not to the interface. **Resist the temptation to redesign a thing that is already
done.**
