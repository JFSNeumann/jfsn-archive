# Working History Record — site003

**Status:** curatorial record complete. Not sanitized. Not published.

---

## Identification

- **Working History ID:** `site003`
- **Title:** "Sebastian" (page `<title>`)
- **Approximate date:** **corrected in this pass — not a clean single date.** No internal date string sets the folder's origin. Evidence found this session narrows it as follows:
  - All five pages share `<meta name="generator" content="2018.1.1.386"/>` — an Adobe Muse application-version string, not a page-authored date. Muse's "2018"-branded release line continued receiving stability updates for years after 2018, so this is evidence of *which app version last exported these files*, not proof the content is from 2018 itself.
  - `k-nex.html` and `miscellaneous.html` each carry a genuine, human-written caption dated **2020** ("Grandpa's version 2020"; "Remember Grandpa=) 2020") — real content, not code artifacts (verified by context, see Evidence Used). This site's content was still being added to in 2020.
  - `scripts/muse-throttle-db.sqlite3` contains one real submission-history row timestamped **2018-10-15 15:08:06**, evidence the contact-form pipeline was live (or at least being tested) on that date.
  - The source folder's server-hosting artifacts (`.htaccess.phpupgrader.*` chain, `.ftpquota`, cPanel PHP-handler block) indicate this is a **live-server capture**, not a static local export — consistent with a site that was actively hosted and edited over a span of years rather than published once.
  - **Net finding:** this record is not a single frozen moment. It reflects an actively-maintained live site with content spanning from at least 2018 through 2020.
- **Type:** family-collaboration
- **Thread(s):** family-collaboration

---

## Purpose

Documents a grandson's (Sebastian's) creative output — LEGO builds, K'NEX constructions, Aquabeads pieces, and a "Miscellaneous" section — across five pages: `sebastian.html` (landing/hub), `legos.html`, `k-nex.html`, `aquabeads.html`, `miscellaneous.html`. The `miscellaneous.html` and `legos.html` pages also carry several images captioned "FINE ART" and titled with "...with Grandpa" (e.g. "Collage Face with Grandpa," "Something about poop with Grandpa," "Funny Grandma with Grandpa," "Untitled with Grandpa," "Untitled II with Grandpa," "Remember Grandpa=) 2020") — these read as genuine grandfather/grandson collaborative pieces, not solely the child's solo work. Nav on every page also links to a `video-tutorials.html`, which does not exist in this folder (see Technologies).

---

## Technologies

**Corrected in this pass — supersedes the inventory's "hand-authored HTML pages" characterization.** Direct inspection confirms this is an **Adobe Muse export**, not hand-authored HTML:

- `<meta name="generator" content="2018.1.1.386"/>` present on all five pages.
- Root `.htaccess` contains the literal comment `# Begin Muse Generated redirects` / `# End Muse Generated redirects`.
- `scripts/` contains the same Muse-signature script set found on `site002`/`site005`: `jquery-1.8.3.min.js`, `jquery.musemenu.js`, `jquery.museoverlay.js`, `jquery.musepolyfill.bgsize.js`, `jquery.scrolleffects.js`, `jquery.tobrowserwidth.js`, `jquery.watch.js`, `museconfig.js`, `museutils.js`, `musewpdisclosure.js`, `musewpslideshow.js`, `webpro.js`, `html5shiv.js`, `touchswipe.js`, `whatinput.js`, `require.js`.
- `images/jfsn-sebastian-03.muse` is a **34,471,936-byte SQLite database** (`file` confirms: "SQLite 3.x database... last written using SQLite version 0"), which is Adobe Muse's native project-file format. **This is the actual Muse source project file, preserved intact** — not just its exported HTML output. Its internal tables (`active`, `refIndex`) hold compressed/opaque data; page-name strings could not be recovered by direct text search, so its full contents are unconfirmed beyond "this is a genuine Muse project database," not read page-by-page in this pass.

**This folder is a fragment of a larger site, not a self-contained one.** `css/` holds 24 stylesheets, and only 6 have a matching HTML page anywhere in this folder (`aquabeads.css`, `k-nex.css`, `legos.css`, `miscellaneous.css`, `sebastian.css`/`seb.css`/`sebastion.css` — three variant names for the one `sebastian.html` page). The other 18 — `1990s.css`, `art.css`, `contact.css`, `current.css`, `design.css`, `early-years.css`, `fine-art.css`, `index.css`, `jeffrey-f_-s_-neumann--artist.css`, `thank-you.css`, `video-tutorials.css`, plus their `iefonts_*` and `master_*-master` companions — have **no matching HTML page in this folder at all**. Checked directly: 15 of those 18 correspond exactly to real pages that *do* exist in the separately-catalogued `misc/2018/` folder (`site006`): `1990s.html`, `art.html`, `current.html`, `early-years.html`, `fine-art.html`, `index.html`, `jeffrey-f.-s.-neumann--artist.html`, `video-tutorials.html`, `sebastion.html`. Three — `contact.html`, `design.html`, `thank-you.html` — have no matching HTML page anywhere in the currently preserved `misc/` tree at all; their CSS is the only surviving trace of those pages.

**This means `site003` and `site006` are not simply two separate, self-contained records — they are two different captures of the same evolving site**, one (`site003`, this folder) apparently pulled from a live, actively-hosted server account (per its cPanel/`.htaccess` artifacts), the other (`site006`) a broader, more complete export bundling the fine-art/professional/family sections together. See Related Sites below for what this changes about the previously recorded relationship.

---

## Historical Context

Grandchildren are named in existing testimony (`master-notes.md` line 175: "Sebastian, Caspar, Anthony, and Emilia"). No creator commentary specific to *this website* — why it was built, when it went live, how long it ran — has yet been captured. The titles "Funny Grandma" and "Untitled with Grandpa" recur as individual gallery-page titles in `site007` (the later Adobe Portfolio "Hi, I'm Sebastian!" site), reinforcing the already-confirmed continuation relationship between the two Sebastian records (see Related Sites).

---

## Creator Commentary

**Status: not yet captured.** No question about this record was asked of Jeff in this session, per the charter's rule that testimony is never manufactured to fill a record. This is an accepted archival state, not a gap requiring action.

---

## Preservation Assessment

- **Source integrity:** appears to be a direct live-server capture, not a third-party mirror — supported by `.htaccess.phpupgrader.2eb1f8c6`, `.htaccess.phpupgrader.9aa51422`, `.htaccess.phpupgrader.initial`, `.htaccess_ea3` (successive cPanel PHP-version-upgrade artifacts, each retaining the same "Muse Generated redirects" marker), a `.ftpquota` file, and a live cPanel PHP-handler block in the active `.htaccess` (`AddHandler application/x-httpd-ea-php74___lsphp .php .php7 .phtml`).
- **Capture method:** unknown — not confirmed whether this is Jeff's own FTP download of a live hosting account or another source.
- **Condition:** complete but partial-of-a-whole, as described above: 5 top-level HTML pages, 33 files in `scripts/`, 837 files in `images/` (144 MB total for the folder), 33 CSS files (only 6 have a corresponding page in this folder).
- **Fixity:** not yet computed for any record in the collection, per the standing note in `site001`/`site002`.

---

## Technical Hazards (verified directly this session — corrects the inventory's "no functional risk" characterization)

The inventory's original entry for `site003` states only that the `.htaccess.phpupgrader.*` files are "not functional risk to a static copy." **That characterization missed real, live hazards** — the same class of miss the `site002` close-pass corrected:

**Live server-side form handlers, present but not currently wired to any page in this folder:**
- `scripts/form-u18738.php`, `scripts/form-u18959.php`, `scripts/form-u3460.php` — Adobe-Muse-generated contact-form endpoints (subjects found in source: "CONTACT Form Submission" ×2, "Contact Red30 Submission" ×1 — "Red30" is an unidentified third name, not Sebastian or JFSN branding, suggesting at least one of these handlers was built for a different page/client entirely, now lost from this folder — unconfirmed, not investigated further this pass).
- **None of the five present HTML pages (`sebastian.html`, `aquabeads.html`, `k-nex.html`, `legos.html`, `miscellaneous.html`) reference any of these form IDs directly** — checked by grep, zero matches. These handlers are orphaned, most likely leftovers from the missing `contact.html` page (see Technologies).
- **Each of the three handler files calls `require_once('form_throttle.php')` — and `form_throttle.php` itself is not present anywhere in `scripts/`.** As currently constituted, running any of these three files would produce a PHP fatal error rather than actually send an email. This reduces the practical risk somewhat versus `site002` (where the full handler chain is intact and would genuinely fire), but a missing dependency is not a safeguard to rely on — sanitization should still remove or neutralize these files outright, per the charter, rather than leave three broken entry points in place.

**Live third-party embeds, found directly in `sebastian.html`'s content (not previously documented anywhere in this collection):**
- A YouTube iframe embed (`https://www.youtube.com/embed/7MFXf1ZUvY4`) — external video content; which video this is has not been confirmed.
- A **POWr comments widget** — `<div class="powr-comments" id="e644907d_1591652227"></div><script src="https://www.powr.io/powr.js?platform=html"></script>` — a live third-party comment-hosting service embedded directly in page content. This is the same category of concern as `site007`'s New Relic monitoring call: a call to a live, currently-operated external service baked into preserved content, which would attempt to load and render on any sanitized copy that serves this HTML as-is. **Confirmed hazard requiring sanitization.**

**External CDN dependencies found:**
- `http://musecdn.businesscatalyst.com/scripts/4.0/jquery-1.8.3.min.js` — Adobe Business Catalyst CDN (same CDN family as `site002`'s `musecdn2.businesscatalyst.com` reference).
- `https://cdnjs.cloudflare.com/ajax/libs/gsap/1.18.0/TweenMax.min.js` — GSAP animation library loaded from cdnjs, not bundled locally.
- `https://www.aquabeadsart.com/en-us/` — a plain outbound content link (an `<a href>` to the real Aquabeads product brand site, not a script call). Low risk, not a technical hazard — flagged only as an outbound reference that may or may not still resolve.

**Legacy self-referential dead paths:**
- `http://www.jfsn.com/phone/*.html`, `http://www.jfsn.com/tablet/*.html`, `http://www.jfsn.com/ms` — Muse's standard responsive-breakpoint URL scheme, pointing back at the live `jfsn.com` domain rather than this archive. These are almost certainly dead paths on the current production site today — link rot, not a security risk, the same category already noted for `site002`.

**No hazard found regarding:** Flash content (none present in this record); analytics/tracking scripts of the New Relic/Google-Analytics kind (none found — the only third-party live call found here is the POWr widget, a different category).

**Non-technical note:** `scripts/muse-throttle-db.sqlite3` contains exactly one row: `IP='256.256.256.256'`, `Submission_Date='2018-10-15 15:08:06'`. `256.256.256.256` is not a valid IPv4 address (256 is out of range for any octet) — this reads as placeholder or test data, not a real visitor's address. No privacy concern found here, unlike `site001`'s footer contact information.

---

## Dependencies

See Technical Hazards above for the full list: Adobe Business Catalyst CDN (jQuery), cdnjs (GSAP TweenMax), YouTube embed, POWr third-party widget script.

---

## Related Sites

**Corrected in this pass — the previously recorded relationship direction is not supported by direct evidence, and may run the other way.**

The collection-wide inventory states: *"`2018/sebastian.html` contains all of this site's content plus additional drone-animation styling layered on top, meaning this version is strictly earlier."* A direct `diff` between `misc/sebastian V1/sebastian.html` (this record, 599 lines) and `misc/2018/sebastian.html` (`site006`'s embedded copy, 296 lines) run this session shows the opposite: **the entire "Drone Animation Styles" CSS/JS block (roughly 260 lines, including `@keyframes droneWaveFly`, `propellerSpin2`, `droneHover2`, and their supporting markup) exists only in *this* record's copy and is absent from `site006`'s embedded copy** — not the other way around. The only other difference found is a single trivial line near the end of Muse's boilerplate asset-check script (a `suppressMissingFileError` branch present in `site006`'s copy but not this one) — not evidence of a broader lineage in either direction.

Combined with:
- This folder's live-server hosting artifacts (absent from `site006`'s folder),
- The genuine 2020-dated captions found on this folder's `k-nex.html` and `miscellaneous.html` (content `site006`'s snapshot cannot be shown to share, since it wasn't compared page-for-page beyond `sebastian.html`),
- The fact that `site006`'s own folder-name date ("2018") is itself only a folder-name estimate, not a verified internal date,

**the fair reading is: `site003` and `site006` are not a clean predecessor/successor pair.** They more likely represent two independently-drifting captures of the same underlying, continuously-edited live site — one (`site003`) a later live-server pull that had the drone animation and 2020 updates added, the other (`site006`) an earlier or simply differently-synced snapshot bundled into a broader portfolio export. **The direction of "which came first" cannot be established from this evidence alone**, and the inventory's specific claim that `site006`'s copy is the later, enhanced one should be treated as incorrect, not merely unconfirmed. This is flagged as a correction to `WORKING-HISTORY-INVENTORY-v1.0.md`, not a new architectural question — the charter's Related Sites philosophy already anticipates exactly this kind of non-linear, overlapping relationship.

- **`site006`** — confirmed content overlap (shared base content across `sebastian.html`, plus 15 of `site003`'s 18 "orphaned" CSS files matching real pages inside `site006`'s folder: `1990s.html`, `art.html`, `current.html`, `early-years.html`, `fine-art.html`, `index.html`, `jeffrey-f.-s.-neumann--artist.html`, `video-tutorials.html`, `sebastion.html`). Relationship is real and close; direction is **not** the strict "predecessor" the inventory previously claimed.
- **`site007`** ("Hi, I'm Sebastian!", Adobe Portfolio) — confirmed continuation, unchanged from prior finding: shared subject matter and titles ("Funny Grandma," "Untitled with Grandpa" recur as individual gallery-page titles in `site007`; K'NEX/Aquabeads content carried forward as `knex.html`/`aquabeads.html`).

---

## Related Artworks

None confirmed to a specific `art####` ID. **New observation, not previously documented:** several images on `legos.html` and `miscellaneous.html` are captioned "FINE ART" and titled as grandfather/grandson collaborations — "Collage Face with Grandpa," "Something about poop with Grandpa," "Funny Grandma with Grandpa," "Untitled with Grandpa," "Untitled II with Grandpa," "Remember Grandpa=) 2020." These read as genuine candidates for cross-reference against the live catalog's `collaboration.html` theme page, but no specific `art####` match was attempted or confirmed in this pass — **unknown, requires a dedicated matching exercise**, consistent with the same open item already listed for `site002`/`site006` in the inventory.

---

## Outstanding Unknowns

- Why and when this site was first built, and how long it stayed live.
- What "Red30" refers to — the subject line of one of the three orphaned PHP form handlers, unrelated to Sebastian or JFSN branding; not investigated further this pass.
- Whether the three CSS-only orphan pages (`contact.html`, `design.html`, `thank-you.html`) survive anywhere else not yet located, or are permanently lost.
- Full contents of `images/jfsn-sebastian-03.muse` — confirmed to be a genuine Muse project database, but not readable page-by-page without Adobe Muse itself.
- Which specific `art####` catalogued works, if any, correspond to the "...with Grandpa" collaborative pieces on `legos.html`/`miscellaneous.html`.
- The actual chronological relationship between this record and `site006` — evidence now shows the inventory's claimed direction is unsupported, but the correct direction (if one exists at all) has not been established.

---

## Archival Notes

- **This record required a correction to the inventory's Related Sites claim, not just its Technical Hazards claim** — a first for this collection. `site002`'s close pass corrected a hazard-severity understatement; this record corrects a stated *relationship direction* that direct diff evidence contradicts. `WORKING-HISTORY-INVENTORY-v1.0.md` should be updated accordingly (see below).
- **The "hand-authored HTML" technology characterization in the original inventory was wrong**, in the same way the original inventory undersold `site002`'s hazard profile — this is now the second record in the collection where the collection-wide survey pass has been overturned by close individual inspection, reinforcing the standing lesson from `site002`'s record that every remaining record needs its own close pass, not reliance on the survey.
- **This record is evidence that `site003` and `site006` are fragments of the same underlying, continuously-live site**, not two independent artifacts. This doesn't require an architectural change — the charter's Related Sites model already allows exactly this kind of non-linear overlap — but it does mean future work on either record should cross-check the other before asserting any date or lineage claim.

---

## Evidence Used

- Full directory listing of `misc/sebastian V1/` (`find . -type f`, 900+ files, 144 MB)
- Direct read of all five HTML pages' `<title>`, `<meta name="generator">`, nav `href` links, and rendered text content (via a small Python/regex pass extracting visible text nodes)
- `grep`/`grep -oE` across all five HTML files for external URLs, `<script>` tags, `<form>` tags, and `.php` references
- Direct read of `scripts/form-u18738.php`, `scripts/form-u18959.php`, `scripts/form-u3460.php` (first ~30 lines each)
- `ls scripts/*.php` plus a `require_once` grep, confirming `form_throttle.php` is absent
- `file` + `sqlite3 .tables` on `images/jfsn-sebastian-03.muse`, confirming it is a genuine SQLite-backed Muse project database
- `sqlite3 .dump` on `scripts/muse-throttle-db.sqlite3`, confirming its one submission-history row and the invalid placeholder IP
- Direct read of `.htaccess`, `.htaccess.phpupgrader.2eb1f8c6`, `.htaccess.phpupgrader.9aa51422`, `.htaccess.phpupgrader.initial`, `.htaccess_ea3`, `.ftpquota`
- A shell loop matching every `css/*.css` basename against a same-named `.html` file in this folder, to identify the 18 orphaned stylesheets
- Directory listing of `misc/2018/` (`site006`), confirming 15 of those 18 orphaned CSS names have a real matching HTML page there, and that `contact.html`/`design.html`/`thank-you.html` are not found anywhere in `misc/`
- `find misc -maxdepth 2 -iname contact.html -o -iname thank-you.html -o -iname design.html`, confirming only `Mr_SNOWmann/contact.html` (`site002`'s own, unrelated contact page) exists
- Direct `diff` between `misc/sebastian V1/sebastian.html` and `misc/2018/sebastian.html`, full output reviewed — the basis for the Related Sites correction above
- `docs/oral-history/master-notes.md`, confirmed grandchildren's names (line 175); confirmed no existing testimony specific to this website
- `docs/working-history/WORKING-HISTORY-INVENTORY-v1.0.md` and `docs/working-history/records/site001.md`/`site002.md`, read in full for methodology and cross-reference before this record was written
