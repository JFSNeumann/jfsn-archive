# Working History Record — site008

**Status:** curatorial record complete. Not sanitized. Not published.

---

## Identification

- **Working History ID:** `site008`
- **Title (primary source):** "Bootstrap demo" (page `<title>`); visible on-page heading: "Human-Centered Designer" (on `index.html`)
- **Approximate date:** 2020 — folder-name estimate, as the inventory records. No generator metadata or other direct evidence found this session to confirm or refute this date.
- **Type:** professional-portfolio
- **Thread(s):** professional-design

---

## Purpose

A Bootstrap-framework portfolio site presenting categorized design work across six named focus areas: Web (Websites and Apps), Mobile (Mobile and Tablet Designs), CATS (Contract Administration Tracking System), AI/UX (AI/UX for Shoe App Design), Misc (Miscellaneous, containing accordion-expandable subsections for 2D/3D Animation, Print Work, and Research), and Home (the index/landing page, titled Human-Centered Designer). Each page consists of a brief introductory paragraph and a gallery of portfolio images, organized by category in the underlying file structure (`assets/images/web/`, `assets/images/mobile/`, `assets/images/cats/`, `assets/images/misc/`, `assets/images/old/`, `assets/images/small/`, `assets/images/print/`).

---

## Technologies

- **Bootstrap framework 5.3.2** — confirmed by direct CDN links in every HTML file, loading from `https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/...`. All CSS/JS loaded are Bootstrap dist files (unmodified framework, not customized).
- **No server-side code of any kind** — `find . -iname "*.php"` returns zero results; no form elements, no handlers, no back-end dependencies.
- **No custom CSS or JavaScript** — the folder contains unmodified Bootstrap dist files in `css/` and `js/` subdirectories. No custom stylesheet or site-specific JS is present. All styling is Bootstrap defaults + inline styles.
- **External dependencies:** Bootstrap CDN, Popper.js CDN (dependency of Bootstrap), one YouTube video embed (`https://www.youtube.com/embed/jUwi6mCKakw?autoplay=1&loop=1&playlist=jUwi6mCKakw&controls=0`) in one of the portfolio image grid sections.
- **Asset structure:** 100 images across 7 categorized subdirectories (`web/`, `mobile/`, `cats/`, `misc/`, `old/`, `small/`, `print/`); all images are present and correctly referenced from the HTML.

---

## Historical Context

The site's own introductory text on `misc.html` states: *"With over a decade of expertise, I take a methodical approach to deeply understand end users, rapidly ideate solutions, and iterate relentlessly..."* — positioned as a current statement of professional practice at the time of this site's creation. This aligns with the professional-design thread timeline (`site004` 2014 → `site005` 2016 → `site006` 2018 → `site008` 2020 → `site009` 2023).

---

## Creator Commentary

**Status: not yet captured.** No question about this record was asked of Jeff in this session, per the charter's rule against manufacturing testimony.

---

## Preservation Assessment

- **Source integrity:** appears to be Jeff's own work. No live-server-capture fingerprints (no `.htaccess`, cPanel artifacts, `.ftpquota`, etc.) — this folder does not carry the evidence of being pulled from a live hosting account the way `site002`/`site003` do. No evidence it was ever live-deployed.
- **Capture method:** unknown.
- **Condition:** complete and fully functional — all 7 HTML pages navigate correctly, all images are present, all links resolve correctly, all external scripts load from live CDNs (no broken dependencies as currently captured).

---

## Technical Hazards

- **No preservation hazards found** — no form handlers, no server-side code, no tracking scripts, no third-party widgets beyond YouTube embeds and standard CDN-hosted Bootstrap framework.
- **Bootstrap CDN dependency:** all CSS and JS are loaded from `https://cdn.jsdelivr.net/` (a live, active CDN). If jsdelivr goes offline or changes the URLs to these specific Bootstrap 5.3.2 files, those assets would become unavailable in a live-served copy. However, this is a standard-maintenance issue, not a preservation hazard — every modern portfolio site carries this kind of CDN dependency, and sanitization policy (per the charter) would handle this by either downloading the assets locally or accepting the external dependency if the site requires live updates.
- **YouTube embed:** embedded directly in one image grid (`https://www.youtube.com/embed/jUwi6mCKakw?autoplay=1&loop=1&playlist=jUwi6mCKakw&controls=0`). The embedded video is a live third-party dependency, subject to link rot if that video ID is deleted from YouTube. Not a security hazard, but a preservation consideration.

---

## Dependencies

- Bootstrap 5.3.2 (CDN-hosted, not a hazard but a live dependency)
- Popper.js 2.11.8 (CDN-hosted dependency of Bootstrap)
- One YouTube video embed (`jUwi6mCKakw`)

---

## Related Sites

- **`site006` (2018)** — related as part of the ongoing professional-portfolio lineage, per the inventory's existing framing.
- **`site009` (2023)** — the next, most recent node in the portfolio sequence.

---

## Related Artworks

None found — this record documents professional design work (UX/UI, web, mobile, animation, print), not the fine-art catalogue.

---

## Outstanding Unknowns

- Whether this site was ever deployed or live at `jfsn.com` or any other domain — no definitive evidence either way from the files alone; the absence of server-side code and hosting artifacts suggests it may have existed only as a local work-in-progress or test, but this is not confirmed.
- Why every HTML page's `<title>` tag is the generic "Bootstrap demo" — whether this was intentional (left as a placeholder for later personalization), an oversight, or evidence of an incomplete state. The site is fully functional and navigable, so the title issue does not prevent use, but it does suggest personalization was not completed.
- Whether the categorization on this site (Web, Mobile, CATS, AI/UX, Misc) reflects Jeff's own professional focus areas at the time, or a generic Bootstrap template structure adapted to his portfolio.
- What the YouTube video (`jUwi6mCKakw`) actually shows — its content and whether it is Jeff's own work or licensed content.

---

## Archival Notes

- **This record is the least technically hazardous of all nine Working History sites** — a pure-HTML Bootstrap portfolio with no server-side code, no forms, no analytics, no external embeds beyond a standard YouTube video and CDN-hosted CSS/JS. It has no preservation risk beyond the standard CDN-dependency and link-rot considerations that apply to any modern website.
- **The "incomplete/scaffold-like" characterization in the inventory is accurate but qualified:** the site is not broken or abandoned. Every page is navigable, every image is present, every link works. What is "incomplete" is the personalization — most notably, every page retains the default Bootstrap template title "Bootstrap demo," suggesting this step of customization was not finished. The minimal narrative structure (heading + intro paragraph + image gallery on most pages) is also characteristic of a template-based site that wasn't heavily customized beyond content insertion.
- **Compared to `site004`–`site006`, this record represents a marked simplification of the professional-portfolio presentation** — no case studies with detailed captions, no project links with descriptions, no "older work" references, no real chronological navigation. Whether this reflects a deliberate shift in how Jeff wanted to present his work, or simply a faster deployment of a template-based portfolio, is not answered by the files alone.

---

## Evidence Used

- Full directory listing of `misc/2020/` (`find . -type f`, 162 files, 44 MB)
- Direct read of every HTML file's `<title>` tag (all seven pages)
- `grep -oE '<h1[^>]*>[^<]*' *.html` to extract page headings
- `find . -iname "*.php" -o -iname ".htaccess*" -o -iname "*.muse"` — confirmed zero results
- `grep -r '<form\|<input\|<textarea' *.html` — confirmed zero form elements
- `grep -E 'google.*analytics|gtag|segment|hotjar|pendo|newrelic' *.html` — confirmed zero tracking scripts
- `grep -ohE 'src="https://[^"]*' *.html` to enumerate all external script references (Bootstrap CDN, Popper, YouTube)
- `grep -ohE 'https?://[a-zA-Z0-9.-]+' *.html` to enumerate all external domains
- `ls -lt` on the folder root to inspect file modification dates
- `find . -iname "README*" -o -iname "*.txt" -o -iname "notes*"` — confirmed zero documentation files
- Direct read of `index.html` (lines 1–100) and `web.html` (lines 1–80) and `misc.html` (lines 1–100) to examine structure
- `find assets/images -type f | wc -l` and subdirectory enumeration to confirm image inventory
