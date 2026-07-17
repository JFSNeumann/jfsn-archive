# Working History Record — site002

**Status:** curatorial record complete. Not sanitized. Not published. This document is the content standard the remaining records will follow, per `WORKING-HISTORY-CHARTER-v1.0.md` and `WORKING-HISTORY-INVENTORY-v1.0.md`.

---

## Identification

- **Working History ID:** `site002`
- **Title:** mR_sNOWmann
- **Approximate date:** 2015 — **known**, confirmed directly from an on-page copyright line in the source: "© 2015 | JFSN.com/"
- **Type:** print-commerce
- **Thread(s):** fine-art

---

## Purpose

A dedicated site selling framed Giclée prints of the Mr. SNOWmann character, built as a small Adobe Muse export. Product captions on the homepage read, for example, "Get this framed Giclee print and stay in style with my mR_sNOWmann 001." Its `street-art.html` page separately presents street photography, captioned "Photographs from the late spring and early summer of 2015 (69 images)."

---

## Technologies

- **Adobe Muse export** — confirmed via `muse_manifest.xml` and Muse's characteristic script set (`jquery.musemenu.js`, `jquery.museoverlay.js`, `jquery.musepolyfill.bgsize.js`, `museutils.js`, `museredirect.js`, `webpro.js`, `pie.js`, `html5shiv.js`, `touchswipe.js`, jQuery 1.8.3).
- Responsive breakpoint folders present (`phone/`), matching Muse's standard responsive-export pattern.
- Contains a nested, separate Adobe Muse export subsite at `notify/` — a full case-study presentation for a "CGI Notify" project (matches the client work already noted on Working History `site005`'s 2016 portfolio). **This is a significant finding not previously documented**: the Mr. SNOWmann folder contains an entire second, unrelated professional case-study site bundled inside it, complete with its own scripts, images, and PHP form handlers. This raises a cross-collection question — whether `notify/` should be treated as part of `site002`'s record or extracted as a related fact pointing to `site005` — noted here as an open curatorial question, not resolved in this pass, and not an architectural change.

---

## Historical Context

This is the collection's fine-art thread continuing from `site001` (fine-art-2000) into a dedicated commercial presentation of a single recurring character. It is also, per Jeff's confirmed testimony below, physical evidence of a real street-level practice that predates or runs alongside the character's studio and print-sale life. Cross-referenced against `master-notes.md`: the Mr. SNOWmann theme already exists as a live archive section (`mr-snowmann.html`); this record documents an earlier, dedicated site for the same character, plus new testimony about its origins.

---

## Creator Commentary

**Status: verbatim.**

Asked directly whether the wall photographs in `street-art.html` are his own street paste-ups, Photoshop composites, or documentation of someone else's work, Jeff answered, in his own words (2026-07-05):

> photos of me tagging over other peoples graffiti

Recorded exactly as given, without reinterpretation or embellishment. This is also logged as the primary testimony record in `docs/oral-history/master-notes.md` §28, which resolves the previously open questions at §21 finding 3 and §23 item 10.

No further creator commentary has yet been captured for this record — the print-commerce purpose of the site itself, why this particular presentation was built, and what came of it remain **not yet captured**, an accepted archival state per the charter, not a gap requiring action.

---

## Preservation Status

- **Source integrity:** original files, unmirrored — this appears to be Jeff's own retained copy, not a third-party mirror.
- **Capture method:** unknown — not yet confirmed whether this is an FTP backup, a personal export, or another source.
- **Condition:** complete. 15 top-level HTML files plus a large, complete image asset set (64 numbered Mr. SNOWmann product photographs, both horizontal and vertical crops, plus the `street-art.html` photograph set) and a fully complete nested `notify/` subsite.

---

## Technical Hazards (verified directly, this session — supersedes any earlier, less precise characterization)

**Live server-side components — confirmed, must be addressed before publication:**
- `scripts/form_process.php`, `scripts/form_check.php`, `scripts/form_throttle.php`, `scripts/form-u1146.php`, `scripts/form-u1702.php` — Adobe-Muse-generated live contact-form handlers in the site's own root scripts folder.
- `notify/scripts/form_process.php`, `notify/scripts/form_check.php`, `notify/scripts/form_throttle.php`, `notify/scripts/form-u1240.php`, `notify/scripts/form-u1841.php`, `notify/scripts/form-u2361.php`, `notify/scripts/form-u643.php` — a **second, separate** full set of the same live form handlers inside the nested `notify/` subsite.
- All of the above will attempt to process form submissions if PHP is active on whatever serves the sanitized copy. **Every one of these files must be disabled or removed, not just the ones in the main folder** — the earlier inventory pass did not catch the `notify/` subsite and understated this risk.

**External dependencies found:**
- `http://musecdn2.businesscatalyst.com` — Adobe Business Catalyst CDN reference in the CSS, likely a font or asset call baked into the Muse export template.
- `http://demo.muse-themes.com`, `http://www.muse-themes.com` — third-party template vendor references, likely leftover credit/demo links from the purchased Muse theme, not functional to this site's actual content.
- `https://www.facebook.com`, `http://www.twitter.com`, `https://plus.google.com` — static social-share icon links. The Google+ link points to a service that no longer exists (shut down 2019) — a dead link, not a security risk, but a fact worth recording as link rot.
- `http://jfsn.com`, `http://www.jfsn.com` — internal cross-links from the nested `notify/` subsite back to the live jfsn.com domain; these need to be addressed at sanitization so an archived fragment doesn't link confusingly back to the current production site.

**No hazard found regarding:** the Flash file present elsewhere in the collection (`site006`) — this record has no Flash content. No evidence of analytics/tracking scripts (New Relic, Google Analytics, etc.) in this record, unlike `site007`.

---

## Related Sites

- `site001` (fine-art-2000) — same fine-art thread; no other confirmed connection.
- `site005` (2016 portfolio) — the nested `notify/` subsite documents the same "CGI Notify" client project already referenced on `site005`'s case-study page. This is a confirmed content overlap between two Working History records, not yet resolved as an architectural matter (see Technologies section above).

## Related Artworks

None confirmed. The Mr. SNOWmann theme exists as a live section of the current archive (`mr-snowmann.html`), but no specific `art####` cross-references have been matched to this site's own product photographs in this pass — **unknown, requires a dedicated matching exercise**, not new testimony.

---

## Archival Notes

- This record required direct re-inspection beyond what the original collection-wide inventory pass captured — the nested `notify/` subsite and its duplicate set of live PHP handlers were not caught in the initial survey. This is recorded here as a lesson for the remaining eight records: each one should receive the same close, individual inspection this record just received before its hazard list is considered final, rather than relying on the collection-wide inventory pass alone.
- The cross-collection overlap with `site005` (same CGI Notify project) should be flagged for the person who eventually builds the Related Sites data, but resolving it is not required to publish this record — a record with a known, unresolved cross-reference is still a complete record per the charter's metadata philosophy.
