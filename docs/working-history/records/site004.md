# Working History Record — site004

**Status:** curatorial record complete. Not sanitized. Not published.

---

## Identification

- **Working History ID:** `site004`
- **Title:** "JFSN - Jeffrey F.S. Neumann" (page `<title>`)
- **Approximate date:** 2014 — **known, from folder name**, as the inventory already states. One piece of corroborating-but-not-identical evidence found this session: `MyFontsWebfontsKit.css`'s own license header carries an internal build timestamp, `Build ID 2537831, 2013-04-23T18:46:57-0400`. This file is **not** actually linked from `index.html` (see Dependencies), so it doesn't pin the site's own live date — it only shows a font kit dated April 2013 was sitting in this folder, evidence the underlying template/asset set traces back to at least early 2013, not necessarily that the site went live then.
- **Type:** professional-portfolio
- **Thread(s):** professional-design

---

## Purpose

A single-page (plus duplicate draft, see Archival Notes) personal/professional portfolio site: hero introduction ("I'm a Designer/Animator/Artist"), a skills section, an "About" narrative in Jeff's own site-authored words, a portfolio/project grid (`img/projects/`, `img/service/`), a client-work slider (`img/slider/`), and a contact form. This is the earliest node in the professional-portfolio lineage per the inventory.

---

## Technologies

- Hand-built jQuery-era site (not Adobe Muse, unlike `site002`/`site003`/`site005`) — custom `js/jeffneumann.js` on top of a purchased/adapted theme stack: `jquery.fancybox.js`, `jquery.flexslider-min.js`, `jquery.isotope.min.js`, `jquery.hoverdir.js`, `jquery.nicescroll.min.js`, `jquery.parallax-1.1.3.js`, `modernizr.custom.97074.js`, `swfobject.js`, `html5.js`, jQuery 1.8.2.
- Self-hosted webfont: `css/museo/stylesheet.css` + Museo 300 font files (`.eot`/`.svg`/`.ttf`/`.woff`), all present and correctly linked from `index.html`.
- A **live contact form is present** — `<form action="" method="post" id="contactForm" name="contactForm" class="form">` — and `js/jeffneumann.js:151` wires it via AJAX: `$.post('plugin/sendmail.php', $('#contactForm').serialize(), function(msg) {...})`. **Neither `plugin/sendmail.php` nor the `plugin/` folder it would live in, nor the `plugin/jquery.form.js` the page's own `<script src="plugin/jquery.form.js">` tag requests, exist anywhere in this captured folder.** As preserved, the form is inert: submitting it would 404 rather than send mail, and the page's own script tag for `plugin/jquery.form.js` already 404s today. This is evidence of an incomplete capture (the `plugin/` folder was never copied), not evidence the form was never live — the wiring in `jeffneumann.js` is complete and specific (a real endpoint name, `sendmail.php`, not a placeholder).
- A Google Maps embed (`http://maps.googleapis.com/maps/api/js?sensor=false`) — the deprecated `sensor` parameter and lack of an API key mean this call would fail against Google's current API requirements; dead by policy change, not a security risk.
- `MyFontsWebfontsKit.css` (root-level) is present but **not referenced by `index.html` at all** — an orphaned leftover file. Its own `@font-face` rule points at a `webfonts/` subfolder that also does not exist in this capture. Confirmed inert on both counts (unreferenced, and its own dependency is missing too).

---

## Historical Context

The page's own "About" text (not testimony — this is the site's own authored content, read directly) states: *"In 1995, Sun Microsystems introduced Java - and a mascot named 'Duke', I created & animated 'Wayne' for my first website I designed/developed. In 2002 I started teaching at ITT, classes have included Photoshop, InDesign, Dreamweaver, After Effects, Flash, Illustrator, and 3DS MAX... I recieved a BFA in ID from CIA in 1978."* The CIA (Cleveland Institute of Art) reference corroborates existing oral-history testimony (`master-notes.md` §12, line 24) that already independently documents Jeff's time at CIA — this is the site's own text lining up with separately-captured testimony, not new testimony itself.

**A previously undocumented lead:** `index.html` and its draft copies (`img/slider/index.html`, `img/slider/zindex.html`) contain internal links to `http://www.jfsn.com/jfsn2007/index.html`, `http://www.jfsn.com/jfsn2007/old/index.html`, `http://www.jfsn.com/jfsn2007/old/indexArt.html`, and `http://www.jfsn.com/jfsn2007/old/indexArt2.html`, plus other legacy paths (`/OXO`, `/art/`, `/Spark/`, `/m7.html` through `/m11.html`, `/test/`, `/zzzindex.html`). **No `jfsn2007` folder, or any folder matching these other legacy paths, exists anywhere in the currently preserved `misc/` tree.** This is the first direct, site-internal evidence of a specific earlier website (referenced by name and date, "jfsn2007") that has not been found or preserved — a genuine gap site, not a guess. This bears directly on the open question already listed in the inventory ("`site001`/`site004` relationship: whether the fine-art-2000 site genuinely preceded the 2014 portfolio, or whether there's a gap site not yet found") — the answer now looks like yes, there is a specific named gap site, though it remains unconfirmed whether it still exists anywhere.

---

## Creator Commentary

**Status: not yet captured.** No question about this record was asked of Jeff in this session, per the charter's rule against manufacturing testimony to fill a record.

---

## Preservation Assessment

- **Source integrity:** appears to be Jeff's own retained copy; a `.ftpquota` file is present (evidence of FTP-based hosting), but unlike `site002`/`site003` there is **no `.htaccess` file of any kind anywhere in this folder** — no cPanel PHP-handler artifacts, no Muse-redirect markers. This folder does not carry the same live-server-capture fingerprint `site002`/`site003` do.
- **Capture method:** unknown.
- **Condition:** complete but layered with leftover material, detailed below. 87 MB total; one top-level HTML page (`index.html`), plus two byte-for-byte-adjacent-but-not-identical draft copies nested inside `img/slider/`.

---

## Technical Hazards — corrects the inventory's "none structurally hazardous found" characterization

The inventory's original entry states "none structurally hazardous found in this pass." Close inspection this session found real content the survey missed, though — importantly — the practical risk is currently lower than at first glance, because key dependencies are missing rather than live:

- **Contact form wiring is real but non-functional as captured** (see Technologies) — `plugin/sendmail.php` does not exist in this folder. If that file is ever found and reunited with this capture, it becomes a live hazard requiring the same sanitization already applied elsewhere in this collection (`site002`, `site003`, `site009`). As currently captured, there is nothing that would actually run.
- **22 unplayable Flash (`.swf`) files**, found in `img/slider/New folder/`: `safeway2.swf`, `LifeCare.swf`, `spark_heat1.swf`, `How to Put In a Sink.swf`, `How to Caulk.swf`, `largent1.swf`, `web6_v7.swf`, `wrs_inc.swf`, `contact4.swf`, `MILLBROOK.swf`, `zoomhmv200.swf`, `How to Clean a Deck.swf`, `Spark_Logo.swf`, `How to Fix a Gutter.swf`, `lc.swf`, `all-awards03A.swf`, `neighborhood_progress.swf`, `QuoteMe.swf`, `moog-logo-animation.swf`, `a16MYSAMPLES.swf`, `a05SURVEYPROCESSOVERVIEW.swf`, `Survey Process Overview.swf`. **Checked directly: none of these are referenced by `index.html`, its draft copies, or any `.js` file in this folder** (only the generic, unused `swfobject.js` library and a generic FancyBox `.swf`-handling code path are present — neither invokes a specific file). This is a substantial, previously undocumented Flash cache — **22 files versus the single `JFSN_2009.swf` the inventory's Preservation Priority ranking currently calls "the collection's one confirmed hard preservation problem" (`site006`)**. That characterization needs correcting: `site004` now also carries confirmed unplayable Flash content, in far greater quantity, even though none of it is currently wired to a live page. See Archival Notes.
- Google Maps API call uses the deprecated `sensor=false` parameter with no API key — would fail under Google's current API requirements. Link rot / API policy change, not a security risk.

**No hazard found regarding:** any live, wired server-side script (the one form endpoint that exists in the JS is not backed by a present file); any third-party analytics/tracking call; any external comment/widget embed of the kind found on `site003`.

---

## Dependencies

- Google Maps JS API (dead by policy, see above)
- `css/museo/` self-hosted Museo 300 webfont — present and correctly wired, no external call
- `MyFontsWebfontsKit.css` — present but unreferenced, and its own `webfonts/` dependency folder is also absent
- `plugin/jquery.form.js`, `plugin/sendmail.php` — referenced by `index.html`/`jeffneumann.js` but **absent from this capture entirely**

---

## Related Sites

- `site005` (2016) / `site006` (2018) — related as part of the same ongoing professional-portfolio lineage, per the inventory's existing "related sequence, not a claimed strict chain" framing. Unchanged by this pass.
- **New, unconfirmed:** a specific named predecessor site, "jfsn2007," is directly referenced from this record's own internal links (see Historical Context) but has not been located anywhere in the currently preserved `misc/` tree. Not recorded as a confirmed relationship — there is nothing to link to — but recorded here as a specific, evidence-backed lead for a future search, distinct from the inventory's previous vaguer "possible predecessor... by rough chronology only" framing for `site001`.

---

## Related Artworks

None found. The portfolio/service/project image grids (`img/projects/`, `img/service/`) document professional client work, not the fine-art catalogue; no `art####` cross-references are expected or found here.

---

## Archival Notes

- **This folder contains a genuine draft-history artifact, not previously documented:** `img/slider/index.html` and `img/slider/zindex.html` are byte-for-byte identical to each other (confirmed by `diff`) but differ meaningfully from the top-level, final `index.html` — an earlier draft of the homepage's own bio copy, containing typos later fixed ("Designer/Animaor/Artist," "HTL / CSS" for "HTML5 / CSS"), a shorter/rougher About paragraph, and a different in-progress skills-bar layout. This is evidence of Jeff's own editing process on his self-description, not a separate site. The `css/` folder shows the same pattern: `zbase.css`, `zflexslider.css`, and `zstyle.css` each differ from their non-`z` counterparts (draft/backup copies of Jeff's own hand-edited files), while `zjquery.fancybox.css` is byte-identical to `jquery.fancybox.css` (an unmodified vendor library, never diverged). The "z"-prefix-as-backup-copy convention is now confirmed across two separate records in this collection (this one and, differently, the "New folder" pattern in this same record) — worth keeping in mind when inspecting remaining records, since a "z"-prefixed file is not automatically a duplicate to be treated as inert; it must be diffed to know whether it diverges.
- **The Flash-asset count in the inventory's Preservation Priority ranking is now understated.** `site006`'s single `JFSN_2009.swf` was recorded as "the collection's one confirmed hard preservation problem" before this record existed. `site004` adds 22 more unplayable `.swf` files (none currently wired to a live page, all orphaned inside a "New folder" leftover-asset dump alongside real client-work PDFs — resumes, ad proofs, product sheets). The inventory's Preservation Priority section is updated in this session to reflect this.
- The `img/slider/New folder/New folder/` PDFs are genuine professional-history artifacts worth naming precisely, not just as a hazard note: `Jeff Neumann's resume.pdf`, `Jeff_Neumann_Print.pdf`, `Designs_Large.pdf`, and client-project files for what appear to be Moen, MOOG, NAPA, and other named clients (`MOEN-118_dsn_ad_r4.pdf`, `MOG-030_CDN-Tire_Launch_Consumer-PSTR_02.pdf`, `nappa-fuel-pump-news.pdf`, etc.). None of these are technical hazards — they are static PDFs — but they are real, dated professional-history material bundled inside what looks like an incidental leftover folder, worth flagging for whoever eventually reviews this record's content for anything career-narrative-worthy, separate from the sanitization pass.

---

## Evidence Used

- Full directory listing of `misc/2014/` (`find . -type f`, 87 MB)
- Direct read of `index.html`'s `<title>`, form markup, and `<script src>` tags
- `grep -oE` across `index.html`, `img/slider/index.html`, `img/slider/zindex.html` for external URLs
- `grep -n` in `js/jeffneumann.js` for the `.php`/AJAX form-submission wiring
- `find . -iname "plugin*" -o -iname "*.php"` — confirmed both `plugin/` and any `.php` file are absent
- `diff index.html img/slider/index.html` and `diff img/slider/index.html img/slider/zindex.html` — full output reviewed, basis for the draft-copy finding
- `find . -iname "*.swf"` (22 results) plus a `grep -n "\.swf"` sweep of `index.html` and every `.js` file, confirming none are actively referenced
- Direct read of `MyFontsWebfontsKit.css`'s license header (build timestamp) and its `@font-face` rule; `find . -iname webfonts -o -iname "26B967*"` confirming that referenced folder is absent
- `grep -n "MyFontsWebfontsKit\|museo" index.html`, confirming only the Museo stylesheet (with its fonts present) is actually linked
- `ls -la "img/slider/New folder/New folder/"` — direct listing of the PDF set
- A per-file `diff -q` loop comparing each `css/<name>.css` against its `css/z<name>.css` counterpart
- `docs/oral-history/master-notes.md` §12 (line 24), cross-checked against this site's own "BFA in ID from CIA in 1978" text
- `find misc -maxdepth 1 -iname "*2007*"` and a full `ls misc/`, confirming no `jfsn2007` folder (or any folder matching the other legacy paths referenced) exists anywhere in the preserved source tree
