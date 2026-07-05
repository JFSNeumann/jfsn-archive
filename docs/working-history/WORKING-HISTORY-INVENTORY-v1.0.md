# Working History Collection — Curatorial Inventory, Version 1.0

**Status:** definitive inventory for implementation, prepared under `WORKING-HISTORY-CHARTER-v1.0.md`. Nothing in this document has been implemented — no files moved, sanitized, or generated. Per the charter's metadata philosophy, every field below is marked as **known** (verified directly against the source files), **estimated** (inferred, labeled as such), or **unknown** (explicitly marked, never guessed).

Source inspected: `misc/` (to be renamed `working-history-source/` at implementation time, per the charter's repository structure — not renamed in this session).

---

## Complete Inventory

### `site001` — Untitled fine-art site (fine-art-2000)

- **Title (known):** no on-page title beyond `<title>Untitled Document</title>`; homepage banner reads "WORKS OF ART BY JEFFREY FRANCIS STANLEY NEUMANN"
- **Approximate year (estimated):** c. 2000, from folder name and site's own visual/technical style (table layout, no CSS framework)
- **Type:** personal-art
- **Thread(s):** fine-art
- **Technologies (known):** hand-authored HTML tables, no CSS framework, `jfsn.css` stylesheet
- **Preservation concerns — confirmed by close record-level inspection (`docs/working-history/records/site001.md`):** no technical hazards found — no scripts, no forms, no external calls of any kind. This is the one record so far where the close pass *confirmed* the survey's original finding rather than overturning it. **One new, non-technical concern found:** the page's footer contains Jeff's real personal contact information from the time — a phone number and an email address — which the charter's Sanitization Policy does not currently address, since it only covers things that can no longer safely run, not personal information that runs fine but may not be intended for republication. Flagged for Jeff's input before any public sanitized copy is made.
- **Current condition:** complete, single small folder (26 files: 1 HTML page, 1 stylesheet, 24 images)
- **Historical significance:** **already resolved by prior testimony** — `master-notes.md` §27 confirms all numbered works from this site are already catalogued in the live archive ("these are already in the archive... made from different USPS & FedEx package containers, CDs, Targets/ etc."). This record documents the *site itself* as an artifact; it is not a source of new lost-works material.
- **Relationships to other records:** none confirmed; possible predecessor relationship to `site004` (2014 portfolio) by rough chronology only — **unconfirmed, not recorded as fact**
- **Relationships to artworks:** confirmed by testimony that all 14 works are already catalogued. Exact `art####` cross-references remain unknown — **confirmed structurally unresolvable by file comparison**, since the live catalog stores every image exclusively in AVIF while this site's images are JPEGs; a checksum match is not possible regardless of effort. Resolving this would require direct visual comparison, not repeated file inspection.

---

### `site002` — mR_sNOWmann (print-sales site)

- **Title (known):** "mR_sNOWmann" (site branding, product captions e.g. "Get this framed Giclee print and stay in style with my mR_sNOWmann 001")
- **Approximate year (known):** **2015**, confirmed directly from an on-page copyright line: "© 2015 | JFSN.com/"
- **Type:** print-commerce
- **Thread(s):** fine-art
- **Technologies (known):** Adobe Muse export (`muse_manifest.xml`, Muse's characteristic jQuery/`museutils`/`webpro` script set) — supersedes an earlier, less precise "purchased template" characterization from the initial survey pass.
- **Preservation concerns — corrected, per the detailed record in `docs/working-history/records/site002.md`:** contains `street-art.html`, described as "Photographs from the late spring and early summer of 2015 (69 images)" — dated, real photographic content, now confirmed by testimony as Jeff's own street practice. **The initial survey's "no live scripts or server-side handlers found" was incorrect** — a closer pass found live Adobe-Muse-generated PHP form handlers in two locations (`scripts/` and a nested `notify/` subsite), plus external CDN/template-vendor references. See the full record for the precise list. This folder also contains an entire second, separate case-study site ("CGI Notify") nested at `notify/`, overlapping with `site005`.
- **Current condition:** complete, 15 top-level HTML files plus a large image set and a fully complete nested subsite
- **Historical significance:** **high — and resolved.** The dated 2015 street-art photographs were the open question this record was prioritized for; Jeff has now confirmed directly (`master-notes.md` §28, 2026-07-05): *"photos of me tagging over other peoples graffiti."* This is his own physical street practice, not a Photoshop composite and not documentation of someone else's work. §21 finding 3 and §23 item 10 are resolved by this testimony.
- **Relationships to other records:** none confirmed
- **Relationships to artworks:** likely connects to the live `mr-snowmann.html` theme page's works, but no specific `art####` cross-references confirmed in this pass — **unknown, requires a matching pass**

---

### `site003` — Sebastian's site (original)

- **Title (known):** "Sebastian" (page `<title>`)
- **Approximate year — CORRECTED, per the detailed record in `docs/working-history/records/site003.md`:** **the direct-diff claim below was backwards.** Re-running the same diff this session shows `2018/sebastian.html` (`site006`) is the *shorter* file (296 lines) and is **missing** an entire "Drone Animation Styles" block (~260 lines) that this record's own `sebastian.html` (599 lines) has. That is the opposite of "site006 contains all of this site's content plus additional styling." No clean predecessor/successor direction is established by this evidence — see the record for the full correction. Independently, this record's `k-nex.html` and `miscellaneous.html` carry genuine captions dated **2020** ("Grandpa's version 2020," "Remember Grandpa=) 2020"), and its `scripts/muse-throttle-db.sqlite3` carries one real submission timestamp of **2018-10-15**. This is a live-server capture (cPanel/`.htaccess.phpupgrader.*`/`.ftpquota` artifacts) whose content spans at least 2018–2020, not a single dated snapshot.
- **Type:** family-collaboration
- **Thread(s):** family-collaboration
- **Technologies — CORRECTED, per the detailed record:** **this is an Adobe Muse export, not hand-authored HTML** — confirmed by `<meta name="generator" content="2018.1.1.386"/>`, Muse's characteristic script set in `scripts/`, and the Muse-generated-redirects comment in `.htaccess`. The folder also preserves the actual Muse project source file, `images/jfsn-sebastian-03.muse` (a 34MB SQLite database). This folder is additionally a **fragment of a larger site** — its `css/` directory contains 18 stylesheets with no matching HTML page in this folder, 15 of which match real pages that exist in `site006`'s own folder (`1990s.html`, `art.html`, `current.html`, `early-years.html`, `fine-art.html`, `index.html`, etc.), meaning `site003` and `site006` are two different captures of the same evolving site, not two independent artifacts.
- **Preservation concerns — CORRECTED, per the detailed record:** the original "not functional risk" characterization missed real hazards, the same class of miss `site002` received. Confirmed: three live (though currently dependency-broken) PHP contact-form handlers in `scripts/`, none wired to any of the five present pages; a live third-party POWr comments-widget script embedded directly in `sebastian.html`; a YouTube iframe embed; external CDN calls to Adobe Business Catalyst and cdnjs. See the record for the complete list.
- **Current condition:** complete but partial-of-a-whole — 5 top-level HTML files, but the surrounding `css`/`scripts`/`images` assets show clear evidence of a larger site this folder was cut from.
- **Historical significance:** high, family/legacy value — documents a grandson's creative output, including several grandfather/grandson collaborative pieces captioned "FINE ART" (e.g. "Funny Grandma with Grandpa," "Untitled with Grandpa") whose titles recur in `site007`.
- **Relationships to other records:** **corrected** — no longer recorded as a confirmed predecessor to `site006`. Direct evidence shows real content overlap with `site006` in both directions, with the strict "site003 came first" claim unsupported. Related in theme and confirmed continuation to `site007` (a later, separate, more developed Sebastian site) — this direction is unchanged.
- **Relationships to artworks:** none confirmed to a specific `art####` ID. Several "...with Grandpa" pieces captioned "FINE ART" are plausible candidates for the live `collaboration.html` theme page — **unknown, requires a dedicated matching exercise**, not yet performed.

---

### `site004` — JFSN portfolio, 2014

- **Title (known):** "JFSN - Jeffrey F.S. Neumann"
- **Approximate year (known, from folder name):** 2014
- **Type:** professional-portfolio
- **Thread(s):** professional-design
- **Technologies (known):** custom jQuery-era site (not Adobe Muse — the only professional-portfolio record so far that isn't), self-hosted Museo webfont; `MyFontsWebfontsKit.css` present but unreferenced/orphaned (its own `webfonts/` dependency is also absent)
- **Preservation concerns — corrected, per the detailed record in `docs/working-history/records/site004.md`:** the original "none structurally hazardous" finding missed real content. A live-wired contact form (`plugin/sendmail.php`, called from `js/jeffneumann.js`) exists but its handler file and the `plugin/` folder it lives in are entirely absent from this capture — inert as preserved, not hazard-free by design. **22 unplayable Flash (`.swf`) files** were found in `img/slider/New folder/`, none currently referenced by any live page — see Preservation Priority correction below.
- **Current condition:** complete but layered — 1 top-level HTML page (`index.html`) plus two identical-to-each-other, earlier draft copies of the homepage nested inside `img/slider/` (`index.html`, `zindex.html`), plus a leftover "New folder" of older client-work assets (22 `.swf` files, several real professional PDFs including a resume).
- **Historical significance:** earliest confirmed node in the professional-portfolio lineage. **New finding:** the page's own internal links reference a specific, named predecessor site — "jfsn2007" — that does not exist anywhere in the currently preserved source tree. This is the first concrete, site-internal evidence of a specific gap site for this record, not merely a chronological guess.
- **Relationships to other records:** related to `site005` (2016) and `site006` (2018) as successive iterations of the same ongoing professional portfolio — **a related sequence, not a claimed strict predecessor/successor chain**, per the charter's Related Sites philosophy. A specific named predecessor ("jfsn2007") is referenced from this record's own content but not located — see the record for the full finding.
- **Relationships to artworks:** none found

---

### `site005` — JFSN portfolio, 2016

- **Title (known):** "Jeffrey F. S. Neumann"
- **Approximate year (known, from folder name):** 2016
- **Type:** professional-portfolio
- **Thread(s):** professional-design
- **Technologies (known):** Adobe Muse export (`muse_manifest.xml` present), responsive breakpoint folders (`phone/`, `tablet/`)
- **Preservation concerns:** Muse-exported sites are known to carry proprietary widget code and font-service calls; needs sanitization review for any external calls at implementation time — **not yet assessed in detail in this pass**
- **Current condition:** complete, includes a genuine client case study ("CGI Notify Home Page (Responsive Design)") — real professional work, not template filler
- **Historical significance:** documents real client work (CGI, a genuine IT consultancy), directly substantiating the career narrative already in `master-notes.md` §4
- **Relationships to other records:** related to `site004` and `site006` as part of the same portfolio lineage
- **Relationships to artworks:** none found

---

### `site006` — JFSN portfolio, 2018 ("DESIGNER")

- **Title (known):** "Jeffrey F. S. Neumann | DESIGNER"
- **Approximate year (known, from folder name):** 2018
- **Type:** professional-portfolio
- **Thread(s):** **professional-design, family-collaboration, fine-art** — the one record in the collection genuinely spanning all three threads
- **Technologies (known):** Adobe Muse export, embeds a copy of `site003`'s Sebastian page. **Correction (2026-07-05, per `docs/working-history/records/site003.md`):** the direction of this relationship was previously stated backwards. A direct diff shows `site003`'s own copy of `sebastian.html` — not this record's embedded copy — is the one carrying the additional "Drone Animation Styles" CSS/JS block; this record's embedded copy is the shorter, plainer file. Not yet re-verified from `site006`'s own close pass — flagged here for that record's own inspection to confirm directly against this folder's files rather than relying on `site003`'s record alone.
- **Preservation concerns:** contains a Flash file, `JFSN_2009.swf` — **cannot render in any current browser.** Per the charter's sanitization policy, this requires a static, captioned substitute at implementation time. This is the collection's one confirmed hard preservation problem.
- **Current condition:** the largest and most complete record in the collection (37 HTML files), including `fine-art.html`, `early-years.html`, `current.html`, `video-tutorials.html` sections alongside the Sebastian pages
- **Historical significance:** **the single richest record in the collection** — the one place professional, personal-art, and family threads coexist on one site at one point in time
- **Relationships to other records — corrected (2026-07-05):** no longer recorded as a confirmed successor-in-content to `site003`. Real content overlap with `site003` is confirmed (see `site003`'s record); which one is earlier is not established by current evidence. Related to `site004`/`site005` (portfolio lineage) and `site008` (portfolio lineage continues)
- **Relationships to artworks:** none confirmed in this pass, though `fine-art.html`/`early-years.html` sections likely reference specific catalogued works — **unknown, requires a matching pass**

---

### `site007` — Sebastian's site (Adobe Portfolio, "Hi, I'm Sebastian!")

- **Title (known):** confirmed directly from the page's own masthead text: "Hi, I'm Sebastian!"
- **Approximate year (known/estimated):** content likely built earlier; mirror capture explicitly dated **18 Nov 2021** in the HTTrack log (`hts-log.txt`) — the capture date is known precisely; the site's actual creation/live date is not
- **Type:** family-collaboration
- **Thread(s):** family-collaboration
- **Technologies (known):** Adobe Portfolio platform (`myportfolio.com`), captured via HTTrack Website Copier 3.49-2. Individual gallery pages are titled by artwork subject ("Gorilla," "Dragon," "Moose," "Funny Grandma," "Untitled With Grandpa"), plus continuity pages carried over from `site003` (`knex.html`, `aquabeads.html`)
- **Preservation concerns:** the mirror carries injected third-party monitoring code (New Relic calls pointed at Adobe's live infrastructure) — **confirmed external-call risk requiring sanitization** per the charter. This is the collection's second confirmed hard preservation case, alongside `site006`'s Flash file.
- **Current condition:** the largest Sebastian-related record (98 files), genuinely more developed than `site003` — a gallery-style expansion, not a simple continuation
- **Historical significance:** high family/legacy value — documents the same collaboration maturing into a more developed, portfolio-style presentation
- **Relationships to other records:** confirmed continuation of `site003` (shared K'NEX/Aquabeads content, same subject)
- **Relationships to artworks:** none found

---

### `site008` — JFSN portfolio, 2020 ("Human-Centered Designer")

- **Title (known):** "Bootstrap demo" (raw page title — **never actually set to a real title in the source**, worth noting honestly rather than papering over); visible on-page heading reads "Human-Centered Designer"
- **Approximate year (known, from folder name):** 2020
- **Type:** professional-portfolio
- **Thread(s):** professional-design
- **Technologies (known):** Bootstrap framework
- **Preservation concerns:** thinnest record in the professional-portfolio lineage — several sub-pages (`mobile.html`, `misc.html`, `web.html`, `ai-ux.html`, `cats.html`) all share the same unedited "Bootstrap demo" title, suggesting this portfolio was left in an unfinished or scaffold state. This is a fact about the record's condition, not a flaw in this inventory.
- **Current condition:** incomplete/scaffold-like, 7 HTML files
- **Historical significance:** documents a career-portfolio period, but with less substantive content than `site004`–`site006`
- **Relationships to other records:** related to `site006` and `site009` as part of the portfolio lineage
- **Relationships to artworks:** none found

---

### `site009` — Jeff Neumann Portfolio, 2023

- **Title (known):** "Jeff Neumann Portfolio: Unveiling Excellence in Design" (`index.html`)
- **Approximate year (known, from folder name):** 2023
- **Type:** professional-portfolio (**mixed — see below**)
- **Thread(s):** professional-design
- **Technologies (known):** mixed sourcing. `index.html` and `websites.html` ("jfsn.com | Websites") are genuinely Jeff's own pages. `brand-brain.html` through `brand-brain-9.html` (titled "Unilever | Brand Brain Homepage") are **confirmed real client work — Jeff's own creative-director-era case study for Unilever**, per his direct confirmation (2026-07-05). This is now recorded as fact, not an open question. The several "Silicon | ..." landing pages and the two files literally titled "Your Portfolio" remain **unconfirmed** — Jeff's confirmation covered the Unilever material specifically, not these; they still read as purchased-template demo content pending a separate check.
- **Preservation concerns:** `mail.php` present — a live server-side form handler. **Confirmed, must be disabled or removed at sanitization**, per the charter's sanitization policy.
- **Current condition:** complete, 22 HTML files, mixed authorship as noted above
- **Historical significance:** most recent node in the professional-portfolio lineage; the confirmed Unilever/Brand Brain case study is real evidence of Jeff's creative-director-era client work, corroborating `master-notes.md` §4 ("worked as a product designer and creative director for decades")
- **Relationships to other records:** related to `site006` and `site008` as the most recent entry in the portfolio lineage
- **Relationships to artworks:** none found

---

## Not Included in This Inventory

- **`linkedin.pdf`** — a LinkedIn profile export, not a website. Per the charter, this collection documents *websites*; a PDF export doesn't fit the record type this charter governs. Recommend preserving it as a plain document artifact (career-history cross-reference), not as a Working History record — this is outside this inventory's scope, not a gap in it.
- **Showspace profile** (external, `https://showspace.so/...`) — a currently-live, externally-maintained profile, not a historical artifact. Per the prior architecture session's conclusion (still standing, not revisited here): stays external, referenced rather than archived.

---

## Recommended Permanent IDs

| ID | Title | Year (confidence) |
|---|---|---|
| `site001` | Untitled fine-art site | c. 2000 (estimated) |
| `site002` | mR_sNOWmann | 2015 (known) |
| `site003` | Sebastian's site (original) | pre-2018 (estimated, relative only) |
| `site004` | JFSN portfolio, 2014 | 2014 (known, folder-name-sourced) |
| `site005` | JFSN portfolio, 2016 | 2016 (known, folder-name-sourced) |
| `site006` | JFSN portfolio, 2018 ("DESIGNER") | 2018 (known, folder-name-sourced) |
| `site007` | Sebastian's site (Adobe Portfolio) | captured Nov 2021 (known); live date unknown |
| `site008` | JFSN portfolio, 2020 | 2020 (known, folder-name-sourced) |
| `site009` | JFSN portfolio, 2023 | 2023 (known, folder-name-sourced) |

IDs are assigned once and are permanent regardless of any future revision to dating confidence, per the charter.

---

## Chronological Ordering (display convenience only — not a claimed single history)

`site001` (c. 2000) → `site004` (2014) → `site005` (2016) → `site002` (2015, sits between `site004` and `site005` chronologically) → `site003` (2018–2020, content spans this range) / `site006` (2018, folder-name estimate) — **relative order between these two no longer asserted, see below** → `site007` (captured 2021, content likely earlier) → `site008` (2020) → `site009` (2023)

Note the ordering above deliberately does not resolve into one clean line — `site002` (2015) chronologically falls between `site004` (2014) and `site005` (2016), and `site007`'s actual creation date remains unknown despite a known capture date. **`site003` and `site006` — corrected in this pass:** the close record-level inspection for `site003` (`docs/working-history/records/site003.md`) found the collection-wide inventory's claimed direction ("`site006` contains `site003`'s content plus additions, so `site003` is earlier") is contradicted by direct diff evidence — the drone-animation content this diff was based on actually exists only in `site003`'s copy, not `site006`'s. No clean predecessor/successor direction between these two is established; they read as two different captures of the same evolving live site rather than sequential versions. This is presented as a display convenience for a timeline view, not as an assertion that one strict sequence exists. Per the charter's Related Sites philosophy, the professional-design thread (`site004`→`site005`→`site006`→`site008`→`site009`) and the family-collaboration thread (`site003`↔`site006` overlap, then →`site007`) are separate, parallel lines that should be visually distinguishable wherever this ordering is displayed.

---

## Relationship Map

```
Professional Design thread:
  site004 (2014) — site005 (2016) — site006 (2018) — site008 (2020) — site009 (2023)

Family Collaboration thread:
  site003 (Sebastian, original) — site007 (Sebastian, Adobe Portfolio)
  site003 and site006 are two different captures of the same evolving site, with real
    content overlap in both directions — NOT a confirmed predecessor/successor pair
    (corrected 2026-07-05; see docs/working-history/records/site003.md)

Fine Art thread:
  site001 (fine-art-2000) — site002 (mR_sNOWmann)
  (no confirmed direct relationship between these two beyond shared thread)

Cross-thread node:
  site006 — the only record carrying all three threads at once
```

Artwork relationships confirmed: `site001` ↔ 14 already-catalogued works (§27). All other artwork relationships are unknown and require a dedicated matching pass, not new testimony.

---

## Preservation Priority

Ranked by confirmed technical risk, not historical importance:

1. **`site002`** — **corrected in this pass (2026-07-04/05).** Confirmed live PHP form handlers in *two* locations (`scripts/` and the nested `notify/` subsite), plus external CDN references. Moved from "no confirmed hazards" to top priority — a closer per-record inspection (see `docs/working-history/records/site002.md`) found what the collection-wide survey missed. This is the reason every remaining record needs the same close individual pass before its hazard list is trusted, not just the survey-level pass already done.
2. **`site003`** — **corrected in this pass, moved up from "no confirmed hazards."** Confirmed live (though currently dependency-broken) PHP contact-form handlers in `scripts/`, plus a live third-party POWr comments-widget script embedded directly in `sebastian.html`, plus external CDN calls — see `docs/working-history/records/site003.md`. A third consecutive confirmation that the survey-level pass alone is not reliable for any Muse-based record in this collection.
3. **`site009`** — live `mail.php` handler confirmed.
4. **`site004`** — **new this pass.** Not a live hazard as captured (its contact-form handler is missing, not present-and-dangerous), but confirmed to carry **22 unplayable Flash (`.swf`) files** in a leftover `img/slider/New folder/` — see `docs/working-history/records/site004.md`. Ranked below the live-hazard records above because nothing here is currently wired to run; ranked above `site006` because of sheer Flash-asset volume.
5. **`site006`** — confirmed unplayable Flash asset requiring a static substitute. **Corrected this pass:** no longer "the collection's one confirmed hard preservation problem" — `site004` was just found to carry 22 more `.swf` files, none wired to a live page, versus `site006`'s single file. Both need the same static-substitute treatment at sanitization; `site006`'s file being embedded in an actual, presumably-live page still likely makes it the more urgent of the two, but the "only one Flash problem" framing itself no longer holds.
6. **`site007`** — confirmed external monitoring calls requiring removal.
7. **`site005`** — Adobe Muse export, not yet individually assessed for external calls; flagged for the same close review `site002`/`site003` already received, since both prove the survey-level pass alone is not reliable enough to clear a Muse export as hazard-free.
8. **`site001`** — **closely inspected, technical hazards confirmed absent** (`docs/working-history/records/site001.md`) — the one record so far where the close pass matched the survey's original finding rather than correcting it. Carries a separate, non-technical publication concern instead: personal contact information (phone number, email) in the page footer, requiring Jeff's input before any public sanitized copy.
9. **`site008`** — no confirmed hazards found in the survey pass only; per the `site002`/`site003`/`site004` lesson, this should be read as "not yet closely inspected," not "confirmed clean," until it receives its own detailed record.

---

## Implementation Priority

Recommended order, independent of preservation-risk ranking, based on historical significance and readiness:

1. **`site002`** (Mr. SNOWmann) — highest historical significance in the entire collection. Its dated 2015 photographs prompted the question that resolved a previously open oral-history item (`master-notes.md` §28); this record should still be prioritized first, now to make sure that confirmed testimony is properly reflected in its published record.
2. **`site001`** (fine-art-2000) — lowest technical risk, already-resolved historical questions, straightforward first full pass through the preservation → metadata → publication pipeline.
3. **`site003` / `site007`** (Sebastian, both generations) — high family value; should be scheduled together since they document the same subject across time, and testimony about one will likely inform the other. **`site003`'s close-pass record is now complete** (`docs/working-history/records/site003.md`, 2026-07-05) — it also directly overlaps with `site006` (see Related Sites correction above), so `site006`'s own eventual close pass should cross-check `site003`'s record before asserting any date or lineage claim.
4. **`site004` / `site005` / `site006` / `site008` / `site009`** (professional-portfolio lineage) — lowest urgency; career-history value is real but not time-sensitive the way the family and fine-art threads are. **`site006` in particular now also carries a preservation-risk reason to move it up** (see Preservation Priority above) and should be inspected with the `site003` overlap specifically in mind. **`site004`'s close-pass record is now complete** (`docs/working-history/records/site004.md`, 2026-07-05) — it surfaced a specific named gap-site lead ("jfsn2007," see below) that `site005`'s eventual close pass should watch for, since it's the next-earliest record in the same professional-design thread.

---

## Outstanding Creator Testimony Still Required

Per the charter, every item below may permanently read "not yet captured" and that is an accepted, honest state — this list is not a task list with a deadline.

- **All nine records:** why each was made, what period of life it represents, what came of it — the core creator-commentary content for every record in the collection.
- **`site002` — resolved:** the street-art photographs in `street-art.html` are confirmed as Jeff's own physical tagging practice, over other artists' existing graffiti (`master-notes.md` §28, 2026-07-05). Still open, and not yet asked: which walls, which city, how many occasions.
- **`site009` — resolved:** the Unilever "Brand Brain" material is confirmed real client work (Jeff, 2026-07-05). Still open, and unrelated to that confirmation: whether the "Silicon"-branded landing pages and the two "Your Portfolio" files in the same folder are template demo content or something else.
- **`site001`/`site004` relationship:** whether the fine-art-2000 site genuinely preceded the 2014 portfolio, or whether there's a gap site not yet found. **Partially advanced, not resolved:** `site004`'s own internal links reference a specific named predecessor, "jfsn2007" (`docs/working-history/records/site004.md`), which does not exist anywhere in the currently preserved source tree. Whether it survives anywhere else, and whether it — rather than `site001` — is the true immediate predecessor, is not yet asked.
- **`site003`/`site007` timing:** roughly when each Sebastian site was live, and roughly how much time passed between them.
- **`site003`/`site006` relationship — reopened, not resolved:** the close pass found the inventory's claimed direction ("`site006` is the later, enhanced version") is contradicted by direct diff evidence, but which record actually came first — if either did, cleanly — is now unknown rather than wrongly-known. Not yet asked of Jeff.
- **`site003` — new, unrelated to the above:** what "Red30" refers to (the subject line inside one of the three orphaned PHP form handlers in `scripts/`, unrelated to Sebastian or JFSN branding) — not yet asked.
- **Artwork cross-references** for `site002`, `site003`, and `site006`: which specific catalogued works, if any, these sites originally presented — a matching exercise, not testimony, but not yet performed. For `site003` specifically, several images captioned "FINE ART" and titled "...with Grandpa" on `legos.html`/`miscellaneous.html` are the most promising candidates for this exercise.

Nothing above blocks publication of the factual portions of any record. Per the charter's metadata philosophy, a record with complete facts and incomplete testimony is a complete record, not a partial one.
