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
- **Relationships to other records — corrected again 2026-07-05, during `site006`'s own close pass:** no longer framed as "two independently-drifting captures." Direct byte-for-byte comparison (the `.muse` project file, the throttle database, all three form handlers, and four of five shared HTML pages) shows the two records share the same single underlying capture; the only difference anywhere is a manually-added "Drone Animation Styles" block in this record's `sebastian.html`. See `docs/working-history/records/site003.md` and `site006.md`. Related in theme and confirmed continuation to `site007` (a later, separate, more developed Sebastian site) — this direction is unchanged.
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
- **Approximate year — corrected, per the detailed record in `docs/working-history/records/site005.md`:** folder name gives 2016, but every HTML page and PHP form handler in this folder carries `<meta name="generator" content="2018.1.0.386"/>` / the literal comment "Adobe Muse CC 2018.1.0.386" — the same folder-name-vs-export-metadata gap already found on `site003`. Both dates are now recorded as known; neither overrides the other (2016 likely reflects when the project began, 2018 reflects a later export/re-save).
- **Type:** professional-portfolio
- **Thread(s):** professional-design
- **Technologies (known):** Adobe Muse export (`muse_manifest.xml` present), responsive breakpoint folders (`phone/`, `tablet/`). **New this pass:** Windows-origin capture artifacts (`desktop.ini`, `Thumbs.db`, `Internet Explorer.lnk`) not seen on other records; evidence of a fragment-of-a-larger-project pattern matching `site003` — an orphaned `master_notify-master.css` with no matching page in this capture.
- **Preservation concerns — corrected, per the detailed record:** the "not yet assessed in detail" status is resolved. **Confirmed live hazard:** four complete, functioning PHP form handlers in `scripts/` (`form-u643.php`, `form-u1240.php`, `form-u1841.php`, `form-u2361.php`) — unlike `site003`, all required helper files are present and intact, so these would genuinely execute `mail()` on a POST request. None are wired to any HTML page in this folder (orphaned, most likely from a missing "Notify"/"A-Master" page). Email destination is the placeholder `x@x.com`, not Jeff's real address, but the reachable endpoint itself is still a hazard requiring removal.
- **Current condition — expanded, per the detailed record:** the inventory's "genuine client case study" description undersold this record. Direct inspection of `tablet/index.html`'s captions found **four** named projects, not one: "CGI Notify Home Page (Responsive Design)," "CGI Bank Responsive Website (Sales tool, not all links are active)," "CGI Federal BPS Website (Business Process Services)," and "CampusMonkey Splash Page (Early Prototype Design)." `phone/`/`tablet/` variants also embed a locally-hosted video ("Ewa matava Laurance") not present in the desktop `index.html` at all.
- **Historical significance:** documents real client work (CGI, a genuine IT consultancy, across three named CGI projects) plus a CampusMonkey prototype, directly substantiating the career narrative already in `master-notes.md` §4. **New, high-confidence relationship finding:** `tablet/index.html`'s own "VIEW OLDER WORK" link points directly to `http://www.jfsn.com/2014` — the first hard, site-authored evidence of directional lineage anywhere in the professional-design thread (see Related Sites correction below).
- **Relationships to other records — strengthened:** `site004` — no longer just "part of the same portfolio lineage" by inference; this record's own "VIEW OLDER WORK" link directly names `/2014` as prior work, confirmed by direct inspection. `site002` — both document real CGI client work; whether they document the *same* CGI Notify engagement or two separate ones is **unknown**, not yet compared directly. `site006` — unchanged, not independently re-verified this pass.
- **Relationships to artworks:** none found

---

### `site006` — JFSN portfolio, 2018 ("DESIGNER")

- **Title (known):** "Jeffrey F. S. Neumann | DESIGNER"
- **Approximate year (known, from folder name):** 2018
- **Type:** professional-portfolio
- **Thread(s):** **professional-design, family-collaboration, fine-art** — the one record in the collection genuinely spanning all three threads
- **Technologies — corrected 2026-07-05, per the detailed record `docs/working-history/records/site006.md`:** `site006`'s own close pass found this and `site003` share the exact same underlying Muse capture: `Images/jfsn-sebastian-03.muse` is byte-for-byte identical to `site003`'s copy (same SHA-1), as are `scripts/muse-throttle-db.sqlite3`'s one row, all three `form-uXXXX.php` handlers, and four of the five shared HTML pages (`aquabeads.html`, `k-nex.html`, `legos.html`, `miscellaneous.html`). The **only** difference anywhere is `sebastian.html`, where `site003`'s copy carries an additional, non-Muse-styled "Drone Animation Styles" block absent here. This supersedes last session's framing (that the two records were "independently-drifting captures of an evolving site") — the better-supported reading is two copies of the same single export, with one file in one copy manually modified afterward. This folder also includes two full responsive-breakpoint subsites, `tablet/` and `public_ftp/phone/` (35 more HTML files combined), not counted in the "37 HTML files" figure below.
- **Preservation concerns — corrected 2026-07-05:** `JFSN_2009.swf` is confirmed **not referenced by any HTML page in this folder** (checked directly across all three variants: top-level, `tablet/`, `public_ftp/phone/`) — orphaned, the same pattern as `site004`'s 22 `.swf` files, not an embedded/live-page risk as previously assumed. It still requires the same static-substitute treatment at sanitization if ever surfaced, but is no longer "the collection's one confirmed hard preservation problem" in the sense of being actively wired to a live page. **Also corrected:** the three `form-uXXXX.php` handlers already known from `site003` are **not** purely orphaned in this folder — `tablet/contact.html` and `public_ftp/phone/contact.html` (real pages that exist here but not in `site003`) wire two of the three (`form-u18738.php`, `form-u18959.php`) as genuine, submittable `<form>` elements. Execution risk remains mitigated by the same missing `form_throttle.php`/`form_check.php`/`form_process.php` dependency chain already found on `site003`.
- **Current condition — expanded:** the largest and most complete record in the collection. The "37 HTML files" figure covers only the top-level desktop pages; `tablet/` (12 pages) and `public_ftp/phone/` (11 pages) add 35 more, including `contact.html`, `design.html`, `thank-you.html` — pages `site003`'s record previously (and incorrectly) said had no matching HTML page anywhere in `misc/`. A top-level cache of real personal/professional documents is also present: `CATS.pdf`, `Jeff Neumann - Recent Designs 2.pdf`, plus `assets/red30---project-inquiry.pdf` (real evidence "Red30," from `site003`'s open question, was an actual project/client), `academia-application.pdf`, a Sketch file, and a `.mov` video — none opened/transcribed this pass.
- **Historical significance:** **the single richest record in the collection** — the one place professional, personal-art, and family threads coexist on one site at one point in time
- **Relationships to other records — corrected again 2026-07-05:** no longer "no longer a confirmed successor... which one is earlier is not established." `site006`'s own inspection found the two records share a near-identical file set (see Technologies) — the relationship is now understood as two copies of the same capture, not two points in an evolving site, and not a predecessor/successor claim in either direction. Related to `site004`/`site005` (portfolio lineage, both reference the same "CGI Notify"/"CGI Bank" projects as `site005` — whether the same case study or separate engagements is **unknown**) and `site008` (portfolio lineage continues)
- **Relationships to artworks:** none confirmed in this pass, though `fine-art.html`/`early-years.html` sections likely reference specific catalogued works — **unknown, requires a matching pass** (not read in detail this session either — out of scope for the site003-relationship/Flash/case-study focus this pass required)

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
  site004 → site005 is now CONFIRMED, not inferred: site005's own tablet/index.html
    contains a "VIEW OLDER WORK" link pointing directly to http://www.jfsn.com/2014
    (added 2026-07-05; see docs/working-history/records/site005.md). This is the
    first directional lineage claim in this thread backed by site-authored evidence
    rather than folder-name chronology or shared subject matter alone.

Family Collaboration thread:
  site003 (Sebastian, original) — site007 (Sebastian, Adobe Portfolio)
  site003 and site006 are two COPIES OF THE SAME CAPTURE, not two points in an evolving
    site — the .muse project file, throttle database, all three form handlers, and 4 of
    5 shared HTML pages are byte-for-byte identical; the only difference anywhere is a
    manually-added "Drone Animation Styles" block in site003's copy of sebastian.html
    (corrected again 2026-07-05, during site006's close pass; see
    docs/working-history/records/site003.md and site006.md)

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
2. **`site005`** — **new this pass, moved up from "not yet assessed."** Confirmed **four complete, functioning PHP form handlers** in `scripts/` — unlike `site003`, all required helper files are present and intact, so these would genuinely execute `mail()` on a POST request, plus the same external CDN fallback (`musecdn2.businesscatalyst.com`) already found on `site002`. See `docs/working-history/records/site005.md`. Ranked alongside `site002` because both carry fully-functional live handlers, ahead of `site003` whose equivalent handlers are dependency-broken.
3. **`site003`** — **corrected in this pass, moved up from "no confirmed hazards."** Confirmed live (though currently dependency-broken) PHP contact-form handlers in `scripts/`, plus a live third-party POWr comments-widget script embedded directly in `sebastian.html`, plus external CDN calls — see `docs/working-history/records/site003.md`. A third consecutive confirmation that the survey-level pass alone is not reliable for any Muse-based record in this collection.
4. **`site009`** — live `mail.php` handler confirmed.
5. **`site004`** — **new this pass.** Not a live hazard as captured (its contact-form handler is missing, not present-and-dangerous), but confirmed to carry **22 unplayable Flash (`.swf`) files** in a leftover `img/slider/New folder/` — see `docs/working-history/records/site004.md`. Ranked below the live-hazard records above because nothing here is currently wired to run.
6. **`site006`** — confirmed unplayable Flash asset (`JFSN_2009.swf`) requiring a static substitute. **Corrected again this pass:** the file is confirmed **not referenced by any HTML page in this folder** (checked across all three variants — top-level, `tablet/`, `public_ftp/phone/`) — orphaned, the same status as `site004`'s Flash files, not embedded in "an actual, presumably-live page" as previously assumed. The two records now carry equivalent Flash risk (both orphaned, neither currently wired), rather than `site006` being ranked as more urgent. **Also confirmed this pass:** two of `site006`'s three shared form handlers (identical to `site003`'s) *are* genuinely wired, as real `<form>` elements on `tablet/contact.html` and `public_ftp/phone/contact.html` — pages that exist in `site006`'s folder but not `site003`'s. Execution risk remains mitigated by the same missing helper-file dependency chain already documented for `site003`.
7. **`site007`** — confirmed external monitoring calls requiring removal.
8. **`site001`** — **closely inspected, technical hazards confirmed absent** (`docs/working-history/records/site001.md`) — the one record so far where the close pass matched the survey's original finding rather than correcting it. Carries a separate, non-technical publication concern instead: personal contact information (phone number, email) in the page footer, requiring Jeff's input before any public sanitized copy.
9. **`site008`** — no confirmed hazards found in the survey pass only; per the `site002`/`site003`/`site004`/`site005`/`site006` lesson, this should be read as "not yet closely inspected," not "confirmed clean," until it receives its own detailed record.

---

## Implementation Priority

Recommended order, independent of preservation-risk ranking, based on historical significance and readiness:

1. **`site002`** (Mr. SNOWmann) — highest historical significance in the entire collection. Its dated 2015 photographs prompted the question that resolved a previously open oral-history item (`master-notes.md` §28); this record should still be prioritized first, now to make sure that confirmed testimony is properly reflected in its published record.
2. **`site001`** (fine-art-2000) — lowest technical risk, already-resolved historical questions, straightforward first full pass through the preservation → metadata → publication pipeline.
3. **`site003` / `site007`** (Sebastian, both generations) — high family value; should be scheduled together since they document the same subject across time, and testimony about one will likely inform the other. **`site003`'s close-pass record is now complete** (`docs/working-history/records/site003.md`, 2026-07-05, corrected again the same day during `site006`'s pass) — its relationship to `site006` is now resolved as far as file comparison can take it (see Related Sites); the remaining open question is when/how the drone-animation block was manually added, which is a testimony question, not a file-inspection one.
4. **`site004` / `site005` / `site006` / `site008` / `site009`** (professional-portfolio lineage) — lowest urgency; career-history value is real but not time-sensitive the way the family and fine-art threads are. **`site004`'s, `site005`'s, and now `site006`'s close-pass records are all complete** (`docs/working-history/records/site004.md`, `site005.md`, `site006.md`). `site006`'s pass did not find the "jfsn2007" gap-site material `site004` flagged — no reference to it was found in `site006`'s files — so that lead remains fully open, not advanced by any record so far. `site006` also shares `site005`'s open "CGI Notify"/"CGI Bank" cross-reference question (both records reference the same two named projects); worth resolving whenever either is revisited. Only `site008`/`site009` remain for this lineage, neither yet given its own close-pass record.

---

## Outstanding Creator Testimony Still Required

Per the charter, every item below may permanently read "not yet captured" and that is an accepted, honest state — this list is not a task list with a deadline.

- **All nine records:** why each was made, what period of life it represents, what came of it — the core creator-commentary content for every record in the collection.
- **`site002` — resolved:** the street-art photographs in `street-art.html` are confirmed as Jeff's own physical tagging practice, over other artists' existing graffiti (`master-notes.md` §28, 2026-07-05). Still open, and not yet asked: which walls, which city, how many occasions.
- **`site009` — resolved:** the Unilever "Brand Brain" material is confirmed real client work (Jeff, 2026-07-05). Still open, and unrelated to that confirmation: whether the "Silicon"-branded landing pages and the two "Your Portfolio" files in the same folder are template demo content or something else.
- **`site001`/`site004` relationship:** whether the fine-art-2000 site genuinely preceded the 2014 portfolio, or whether there's a gap site not yet found. **Partially advanced, not resolved:** `site004`'s own internal links reference a specific named predecessor, "jfsn2007" (`docs/working-history/records/site004.md`), which does not exist anywhere in the currently preserved source tree. Whether it survives anywhere else, and whether it — rather than `site001` — is the true immediate predecessor, is not yet asked.
- **`site003`/`site007` timing:** roughly when each Sebastian site was live, and roughly how much time passed between them.
- **`site003`/`site006` relationship — reframed 2026-07-05, during `site006`'s close pass, not fully resolved:** file comparison now shows the two records share a single underlying capture almost entirely intact; the open question is no longer "which site came first" but specifically when and how the manually-added "Drone Animation Styles" block got into `site003`'s copy of `sebastian.html` — a testimony question a file comparison can't answer.
- **`site003` — partially advanced 2026-07-05:** what "Red30" refers to. `site006`'s folder contains `assets/red30---project-inquiry.pdf`, real evidence it was an actual project/client — the PDF's own contents weren't read this pass, so which client/project it names is still unasked.
- **Artwork cross-references** for `site002`, `site003`, and `site006`: which specific catalogued works, if any, these sites originally presented — a matching exercise, not testimony, but not yet performed. For `site003` specifically, several images captioned "FINE ART" and titled "...with Grandpa" on `legos.html`/`miscellaneous.html` are the most promising candidates for this exercise.
- **`site005` — new:** what the "Ewa matava Laurance" video (`phone/`/`tablet/`-only, not on the desktop page) actually is — personal project, client project, or licensed content — not yet asked.
- **`site005`/`site006`/`site002` relationship — new, unresolved, now spans three records:** whether the "CGI Notify"/"CGI Bank" material referenced on both `site005` and `site006`, and the nested `notify/` subsite on `site002`, document the same client engagement(s) or separate ones. Not yet compared directly (would require dedicated diffs, not testimony) and not yet asked of Jeff either.
- **`site006` — new:** contents of `assets/red30---project-inquiry.pdf`, `academia-application.pdf`, and the second YouTube video (`tyg5t1eK6f4`) embedded in its video-tutorials pages — none opened/identified this pass.

Nothing above blocks publication of the factual portions of any record. Per the charter's metadata philosophy, a record with complete facts and incomplete testimony is a complete record, not a partial one.
