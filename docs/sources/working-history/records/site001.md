# Working History Record — site001

**Status:** curatorial record complete. Not sanitized. Not published.

---

## Identification

- **Working History ID:** `site001`
- **Title:** no on-page title (`<title>Untitled Document</title>`); the page's own visible banner reads "WORKS OF ART BY JEFFREY FRANCIS STANLEY NEUMANN"
- **Approximate date:** c. 2000 — **estimated**, from the folder name (`fine-art-2000`) and the page's own technical style (table-based layout, no CSS framework, `iso-8859-1` charset declaration). No internal date string was found in the file itself.
- **Type:** personal-art
- **Thread(s):** fine-art

---

## Historical Context

This is the earliest site in the collection by estimated date. It presents fourteen numbered artworks in a single wide, horizontally-scrolling table row, framed by decorative photographs (a crowd, a wall, two unnamed figures) rather than any written description of the work itself. Per `master-notes.md` §27, Jeff has already directly confirmed the substance of this site's content: *"these are allready in the archive... made from different USPS & Fedex package containers, CDs, Targets/ etc."* — meaning the works shown here are not lost, and their materials are already documented testimony. This record documents the site as an artifact in its own right, separate from that already-resolved question about the works themselves.

---

## Technologies

- Hand-authored HTML, `<table>`-based layout, no CSS framework
- One stylesheet, `jfsn.css` (single-line file)
- No JavaScript anywhere in the folder
- No forms, no server-side code of any kind
- `iso-8859-1` character encoding (era-appropriate; not UTF-8)

This is, by a wide margin, the simplest and least technically hazardous site in the entire collection.

---

## Purpose

A personal portfolio page presenting fourteen artworks, framed as "Works of Art by Jeffrey Francis Stanley Neumann." No accompanying text describes the works individually — captions do not exist; each image is presented plainly, side by side, identified only by filename (`artwork1.jpg` through `artwork14.jpg`).

---

## Creator Commentary

**Status: paraphrase**, carried forward from existing testimony rather than newly captured this session — no new question was asked of Jeff for this record.

From `master-notes.md` §27 (2026-06-12 session), shown the 14 numbered works from this site directly and asked about them, Jeff answered, verbatim:

> these are allready in the archive
>
> made from different USPS & Fedex package containers, CDs, Targets/ etc.

No commentary specific to *the website itself* — why it was built, who it was for, whether it was ever actually put online — has been captured. That remains **not yet captured**, an accepted archival state, not a gap requiring action.

---

## Preservation Assessment

- **Source integrity:** original files, unmirrored — appears to be Jeff's own retained copy.
- **Capture method:** unknown.
- **Condition:** complete. 26 files total — one HTML page, one stylesheet, 24 images (14 numbered artworks plus 10 decorative/background images).
- **Fixity:** not yet computed for any record in the collection; noted here as outstanding for every site, not specific to this one.

---

## Technical Hazards

**None found.** Direct inspection of `index.htm` and `jfsn.css` found no external URLs, no scripts, no forms, and no references to any third-party service of any kind. This is the cleanest record in the collection from a technical-hazard standpoint — sanitization for this site, when performed, should require no content changes at all, only the standard fixity and packaging steps every record receives.

**One risk found that is not technical, and needs its own category:** the page's footer contains Jeff's personal contact information from the time — a phone number, "(440) 821-9949," and an email address, `jeff@jfsn.com` (displayed as "Jefft@JFSN.com," a typo in the visible text; the `mailto:` link itself reads `jeff@jfsn.com`). **This is a genuine privacy consideration for publication, separate from the charter's technical-hazard framing, and it is not addressed by the existing Sanitization Policy, which only discusses removing things that can no longer safely *run* — a phone number runs fine, it's just personal information from twenty-five years ago that may or may not still be current, and may or may not be something Jeff wants published verbatim on a public page today.** This should be raised with Jeff directly before any sanitized copy of this record is made public — flagged here, not decided here.

---

## Dependencies

None. No external calls, no CDN references, no fonts, no analytics.

---

## Related Sites

None confirmed. A possible chronological relationship to `site004` (2014 portfolio) was noted in the collection-wide inventory as an estimate only — no direct evidence connecting the two sites was found in this record-level pass either. Remains unconfirmed.

---

## Related Artworks

Confirmed by testimony (§27): all 14 numbered works on this site are already catalogued in the live archive. **Which specific `art####` IDs they correspond to remains unknown, and — this is worth recording precisely — it cannot be resolved by simple file comparison.** I checked: the live catalog stores every image exclusively in AVIF format, while this site's images are JPEGs from a different era of the same works (if they are even the same source files at all, rather than separate photographs of the same physical pieces). A byte-for-byte or checksum match is therefore structurally impossible, not merely unattempted. Resolving this would require a visual, side-by-side human comparison between these 14 JPEGs and the catalog's featured/favorite Guernica-and-related works — a distinct task from anything achievable by file inspection alone, and not performed in this pass.

---

## Outstanding Unknowns

- Whether this site was ever actually published live, or only ever existed locally
- Why it was built — for a specific purpose (a show, a sale, a personal record) or as a general portfolio
- The exact correspondence between its 14 images and specific catalogued `art####` records
- Whether Jeff wants the phone number and email address removed, redacted, or left as historical record before any public sanitized copy is made

---

## Archival Notes

- **No corrections to the collection-wide inventory were required for the technical/hazard fields** — the original inventory's characterization of this site as low-risk holds up under close inspection, unlike `site002`, where the close pass overturned the survey-level finding. This is worth recording precisely because Phase 2's methodology note said the inventory should get *more* accurate as records are completed, not necessarily that every record will surface a correction — this one didn't, and that is itself useful confirmation that the original survey pass was reliable for this specific site.
- **One genuinely new finding, not previously documented anywhere in this collection's records:** the embedded personal contact information (phone number, email). This is a new category of preservation/publication concern — privacy, not technical hazard — that the charter's Sanitization Policy does not currently name. Recorded here as a finding for the person building the sanitization step to consider, not resolved in this session.

---

## Evidence Used

- Direct read of `misc/fine-art-2000/index.htm` (36 lines, full file)
- Direct read of `misc/fine-art-2000/jfsn.css` (1 line, full file)
- `grep` for external URLs, `<script>`, `<form>`, and `.php` references across both files — zero matches
- Full file listing of `misc/fine-art-2000/` (26 files)
- Attempted checksum comparison between this site's 14 numbered images and the live catalog's image assets — confirmed structurally inconclusive (different file formats), not a false negative
- `docs/oral-history/master-notes.md` §27, existing testimony (not newly captured this session)
