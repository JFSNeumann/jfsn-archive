# Working History Record — site006

**Status:** curatorial record complete. Not sanitized. Not published.

---

## Identification

- **Working History ID:** `site006`
- **Title:** "Jeffrey F. S. Neumann | DESIGNER" (page `<title>`)
- **Approximate date:** 2018 — folder-name estimate, as the inventory records. `<meta name="generator" content="2018.1.1.386"/>` is present on every page checked (`index.html`, `sebastian.html`, `tablet/index.html`, `public_ftp/phone/index.html`) — **this is the exact same Muse generator version string found on every page of `site003`** (also "2018.1.1.386"). This is direct, strong evidence the two records share the same underlying Muse export, not merely a folder-name coincidence.
- **Type:** professional-portfolio
- **Thread(s):** professional-design, family-collaboration, fine-art — unchanged, still the one record spanning all three threads.

---

## Purpose

The largest record in the collection: a full personal/professional site with `index.html`, `fine-art.html`, `early-years.html`, `current.html`, `video-tutorials.html`, `art.html`, `1990s.html`, `jeffrey-f.-s.-neumann--artist.html` sections, plus the same five family-collaboration pages found on `site003` (`sebastian.html`, `aquabeads.html`, `k-nex.html`, `legos.html`, `miscellaneous.html`). **New this pass:** the folder also contains two full responsive-breakpoint copies, `tablet/` and `public_ftp/phone/`, each a near-complete parallel site (11–12 pages each) — the inventory's "37 HTML files" count only reflects the top-level desktop pages plus `sebastian.html`/`sebastion.html`/`zindex.html`; the true file count including both responsive variants is higher (35 more HTML files across `tablet/` and `public_ftp/phone/` combined).

---

## Technologies

- Adobe Muse export, confirmed by `muse_manifest.xml`, `<meta name="generator">`, and the same Muse script set already documented for `site002`/`site003`/`site005`.
- **`Images/jfsn-sebastian-03.muse` is present here too — and is byte-for-byte identical to `site003`'s copy of the same file** (SHA-1 `799d2cc0d240d8cb4591ce2cfd863fb454ec4f32` on both). This is the actual Muse project source database (see `site003`'s record for its format).
- **`scripts/form-u18738.php`, `form-u18959.php`, `form-u3460.php` are present here too — and are byte-for-byte identical to `site003`'s copies** (confirmed by direct `diff`, zero output on all three).
- **`scripts/muse-throttle-db.sqlite3` is present here too — and contains the exact same single row as `site003`'s copy**: `IP='256.256.256.256'`, `Submission_Date='2018-10-15 15:08:06'`.
- **`aquabeads.html`, `k-nex.html`, `legos.html`, `miscellaneous.html` are byte-for-byte identical to `site003`'s copies of the same four pages** (confirmed by direct `diff`, zero output on all four).
- **`sebastian.html` is the only file shared between the two records that differs**, and only by the "Drone Animation Styles" block already described in `site003`'s record — present in `site003`'s copy, absent here.
- Windows-origin capture artifacts present here too: `desktop.ini`, `Thumbs.db` (21.5 MB), `Internet Explorer.lnk` — the same pattern already found on `site004`/`site005`.
- A `public_ftp/` folder at the top level, containing only a `phone/` subfolder — the name itself (`public_ftp`) is evidence this was pulled directly from the root of a live FTP/hosting account, not assembled after the fact.

**This collectively upgrades last session's finding on `site003` from "two independently-drifting captures of the same evolving site" to something more precise: these are two captures of the *same single export*, not two different points in a continuously-edited site.** Five of the six files directly comparable between the two records (the `.muse` project database, the throttle database, all three form-handler PHP files, and four of five shared HTML pages) are byte-identical. The only divergence found anywhere is `sebastian.html`, and only by a self-contained decorative CSS/JS block that reads as a manual, non-Muse addition — its keyframe names (`droneWaveFly`, `propellerSpin2`, `droneHover2`) and code style are distinct from the surrounding Muse-generated markup, unlike anything else in either record. This suggests it was hand-added to `site003`'s copy of the file after both copies already existed, rather than reflecting any difference in the underlying Muse project or a genuine chronological gap between the two records. See Related Sites, and the correction now applied to `site003`'s own record.

---

## Historical Context

**Confirms and resolves part of `site003`'s open "what is Red30" question, without new testimony.** `assets/red30---project-inquiry.pdf` is present in this folder — a real PDF document (`file` confirms: "PDF document, version 1.4, 1 pages"). Its existence, alongside `site003`'s orphaned "Contact Red30 Submission" form handler, is direct evidence that "Red30" was a real project or client name Jeff was in some contact with, not a mystery. The PDF's actual contents were not read in this pass (out of scope — this is a metadata/inventory session, not a document-transcription one); its existence is recorded as evidence, its contents remain unread.

`assets/` also contains `academia-application.pdf`, `fc_bootstrap_grids_3.sketch` (a Sketch design file), and `img_2289.mov` — none of these were opened or transcribed; recorded here as inventory only.

The top-level pages reference `http://www.jfsn.com/notify` and `http://www.jfsn.com/cgi-bank` — the same two named CGI projects ("CGI Notify," "CGI Bank") already documented on `site005`. Whether this is the same case-study content presented again, or independently-authored references to the same real client engagements, is **unknown** — not resolved by this pass, matching the same open question already recorded for `site005`.

---

## Creator Commentary

**Status: not yet captured.** No question about this record was asked of Jeff in this session, per the charter's rule against manufacturing testimony.

---

## Preservation Assessment

- **Source integrity:** the same live-server-capture fingerprint as `site003` — `.htaccess.phpupgrader.2eb1f8c6`, `.htaccess.phpupgrader.9aa51422`, `.htaccess.phpupgrader.initial`, `.htaccess_ea3`, `.ftpquota` are all present here too, and the `public_ftp/` folder name itself indicates a direct FTP-root pull.
- **Capture method:** unknown, but see above — this appears to be, at minimum, a very close sibling capture to `site003`'s, likely from the same hosting account.
- **Condition:** the largest record in the collection — 12 top-level HTML pages, plus two full responsive-variant subsites (`tablet/`, 12 pages; `public_ftp/phone/`, 11 pages), 1,290 files in `Images/`, plus a top-level cache of real personal/professional documents (`CATS.pdf`, `Jeff Neumann - Recent Designs 2.pdf`, `Jeff.jpg`, `Jeff2.jpg`, `Nupner-innovations.png`, `Portfolio.jpg`) not bundled into any "leftover" subfolder the way `site004`'s equivalent material was.

---

## Technical Hazards — corrects the inventory's Flash-only characterization and the "orphaned form handler" framing carried over from site003

**Flash — corrected, matching the `site004` pattern:** `JFSN_2009.swf` (Macromedia Flash data, version 10, 3.99 MB) is present at the root. **Checked directly: it is not referenced by any HTML page in this folder** (top-level, `tablet/`, or `public_ftp/phone/` — zero matches for `.swf` or `JFSN_2009` in any HTML file), and no `swfobject.js` or other Flash-embedding script is present anywhere in this folder. The inventory's framing of this file as embedded in "an actual, presumably-live page" is **not supported by evidence** — like `site004`'s 22 `.swf` files, this one is orphaned, not currently wired to run. It still requires the same static, captioned substitute at implementation time if it is ever surfaced, per the charter, but the previous ranking logic (that `site006`'s Flash is "more urgent" than `site004`'s because it's embedded) does not hold.

**Form handlers — corrected, contradicting `site003`'s "orphaned" finding for these same files:** `site003`'s record states none of its five pages reference `form-u18738.php`/`form-u18959.php`/`form-u3460.php` directly. **This folder's `tablet/contact.html` and `public_ftp/phone/contact.html` — genuine pages that exist in this capture but not in `site003`'s — do wire two of these three identical files as real, submittable forms:**
- `tablet/contact.html:81` — `<form ... action="../scripts/form-u18738.php">`, with `Muse.Utils.initWidget('#widgetu18738', ...)` JS wiring at line 258.
- `public_ftp/phone/contact.html:80` — `<form ... action="../scripts/form-u18959.php">`, with matching JS wiring at line 190.
- `form-u3460.php` (the "Contact Red30 Submission" handler) remains unwired in this folder too — checked across all three variants (top-level, `tablet/`, `public_ftp/phone/`), no page references it.

**Net finding:** these are not orphaned server-side leftovers in the way `site003`'s record characterized them — they are real, wired contact forms, just on pages (`contact.html`) that only exist in this record's responsive-breakpoint subfolders, not at either record's top level. **However, the practical execution risk remains the same as `site003`'s finding:** `form_throttle.php`, `form_check.php`, and `form_process.php` — the three shared helper files every `form-uXXXX.php` requires via `require_once` — are absent from this folder's `scripts/`, identical to `site003`. As currently captured, submitting either wired form would produce a PHP fatal error, not an actual sent email. This does not make removal at sanitization any less necessary — a live, dependency-broken entry point is still not something to leave in place, per the same reasoning already applied to `site003`.

**External dependencies found:** the same `http://musecdn.businesscatalyst.com/scripts/4.0/jquery-1.8.3.min.js` CDN reference and `https://cdnjs.cloudflare.com/ajax/libs/gsap/1.18.0/TweenMax.min.js` already documented on `site003`. **New here:** `https://view360portaldev.cgicledev.com` (a CGI development/staging portal reference) and `https://photos.app.goo.gl/WZTsQ2v8axiv1KXF6` (a Google Photos shared-album link) — both outbound content links, not script calls; both plausible candidates for link rot, neither confirmed still live in this pass.
**Two YouTube embeds found:** `https://www.youtube.com/embed/7MFXf1ZUvY4` (in `sebastian.html` — the same video already noted on `site003`) and `https://www.youtube.com/embed/tyg5t1eK6f4` (in `video-tutorials.html`/`tablet/tutorials.html`/`public_ftp/phone/tutorials.html` — a second, distinct video not previously documented; its content is unconfirmed).

**No hazard found regarding:** the POWr comments widget found on `site003`'s `sebastian.html` — checked directly, this folder's `sebastian.html` does not contain it (consistent with the two files' one confirmed difference being only the drone-animation block, not the POWr script — meaning the POWr widget must have been added to `site003`'s copy independently of, or at the same time as, the drone-animation addition; not investigated further in this pass).

---

## Dependencies

Adobe Business Catalyst CDN (jQuery fallback), cdnjs (GSAP TweenMax), two YouTube embeds, a CGI dev-portal link, a Google Photos shared-album link. See Technical Hazards for the complete, evidenced list.

---

## Related Sites

**`site003` — corrected in this pass, superseding last session's conclusion.** The prior record for `site003` concluded these were "two independently-drifting captures of the same underlying, continuously-edited live site," with no direction establishable. Direct comparison performed this session shows that conclusion undersold how close the two records actually are: the `.muse` project database, the form-throttle database, all three form-handler PHP files, and four of the five HTML pages shared between the two records are **byte-for-byte identical**. The only difference found anywhere is `sebastian.html`, and only by a self-contained, distinctly non-Muse-styled "Drone Animation Styles" block present in `site003`'s copy and absent here. **The better-supported reading is that these two folders are two copies of the same single capture/export, not two points in an evolving site** — with `site003`'s copy of one file (`sebastian.html`) having received a small manual addition at some point after both copies existed. This is corrected directly in `site003`'s own record as part of this session (see that record's updated Related Sites section).
- **`site007`** — unchanged from the existing inventory framing; not independently re-verified this pass, since this record's own `sebastian.html`/`aquabeads.html`/etc. content is identical to `site003`'s, and `site003`'s continuation relationship to `site007` already stands on its own evidence.
- **`site005`** — both records reference the same two named CGI projects ("CGI Notify," "CGI Bank"). Whether this is the same case-study content or independently-authored references to the same real engagements is **unknown**, matching the open question already recorded on `site005`.
- **`site004`/`site008`/`site009`** — unchanged, per the inventory's existing "related sequence" framing for the professional-portfolio lineage; not independently re-verified this pass.

---

## Related Artworks

None confirmed to a specific `art####` ID. `fine-art.html`/`early-years.html` were not read in detail in this pass (out of scope — this session's focus was the site003 relationship, Flash hazards, and case-study cross-references per the working method); whether they reference specific catalogued works remains **unknown, requires a matching pass**, unchanged from the inventory's existing note.

---

## Outstanding Unknowns

- The actual contents of `assets/red30---project-inquiry.pdf`, `academia-application.pdf`, `fc_bootstrap_grids_3.sketch`, and `img_2289.mov` — none were opened in this pass.
- What the second YouTube video (`tyg5t1eK6f4`, embedded in the video-tutorials pages) actually is.
- Whether this record's "CGI Notify"/"CGI Bank" references and `site005`'s are the same case-study content or separate engagements.
- Whether `fine-art.html`/`early-years.html` reference any specific catalogued `art####` works.
- Exactly when the drone-animation block was added to `site003`'s copy of `sebastian.html`, and by what process (manual hand-edit, or some other tool) — not established by this evidence, only that it is not Muse-generated and not present in this record's otherwise-identical copy.

---

## Archival Notes

- **This record required a correction to the inventory's Flash-hazard ranking rationale** (`JFSN_2009.swf` is not wired to any page, contrary to the assumption underlying its "more urgent than `site004`" ranking) and **a correction to `site003`'s own Related Sites conclusion**, made directly in that record per the session's Consistency Rule, since both corrections were discovered while inspecting `site006` and directly bear on `site006`'s own accuracy and the inventory.
- **This is the fourth record in the collection where a close pass overturned or refined the collection-wide survey/prior-session finding** (after `site002`, `site003`, and `site005`), and the second time a *prior record's own conclusion* (not just the original survey) needed correcting once more evidence became available — reinforcing that even a completed close-pass record should be revisited if a later record's inspection produces directly comparable evidence (here, a literal byte-for-byte file comparison that wasn't possible until `site006` was itself inspected).
- **The `contact.html`/`design.html`/`thank-you.html` pages `site003`'s record said were unlocated anywhere in `misc/` do exist** — in this record's `tablet/` and `public_ftp/phone/` subfolders. They do not exist at either record's top/desktop level. This is corrected directly in `site003`'s Technologies section as part of this session.

---

## Evidence Used

- Full directory listing of `misc/2018/` (`find . -type f`, 76 MB top-level + `Images/` at 1,290 files)
- `ls`/`find` on `css/`, `scripts/`, `assets/`, `public_ftp/`, `tablet/` to enumerate all HTML, CSS, and PHP files
- `grep -oE '<meta name="generator"...'` across `index.html`, `sebastian.html`, `tablet/index.html`, `public_ftp/phone/index.html`
- Direct `diff` between this folder's `aquabeads.html`/`k-nex.html`/`legos.html`/`miscellaneous.html` and `site003`'s copies of the same four files — all four byte-identical (zero diff output)
- `shasum` on `Images/jfsn-sebastian-03.muse` here and `site003`'s `images/jfsn-sebastian-03.muse` — identical SHA-1
- Direct `diff` on all three `form-u18738.php`/`form-u18959.php`/`form-u3460.php` files against `site003`'s copies — zero diff output on all three
- `sqlite3 .dump` on `scripts/muse-throttle-db.sqlite3` — identical single row to `site003`'s copy
- `ls scripts/form_throttle.php scripts/form_check.php scripts/form_process.php` — confirmed absent, matching `site003`
- `grep -rn "u18738\|u18959\|u3460"` across every HTML page in this folder (top-level, `tablet/`, `public_ftp/phone/`) — found the two wired `contact.html` instances
- `grep -rln "JFSN_2009\|\.swf"` across every HTML page — zero matches, confirming the Flash file is unwired
- `find . -iname swfobject*` — confirmed absent
- `grep -ohE 'https?://...'` across the top-level content pages, and `grep -rl` for the two YouTube video IDs across all HTML variants
- `file JFSN_2009.swf` and `file assets/red30---project-inquiry.pdf` — confirmed file types without opening/transcribing contents
- `docs/oral-history/master-notes.md` — searched for existing testimony on CGI/Notify/Red30/drone-animation — none found beyond what's already cited in `site003`'s record
- `docs/working-history/records/site003.md`, read in full before this record was written, as the basis for every direct comparison above
