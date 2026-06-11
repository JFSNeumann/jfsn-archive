# Session 31 — Preservation Truth Report & Handoff

**Date:** 2026-06-11
**Session type:** Verification only. Every finding below was re-tested from scratch this session; nothing was assumed from the previous review. Site pages, catalog, CSS, and JS were NOT modified. Documentation files modified: this file (created), master-notes.md (§26 appended), IMPROVEMENTS.md, CURRENT_STATE.md.
**Written for:** a future contributor with no memory of the sessions that produced it.

---

## 1. What Was Verified (and how)

### 1.1 FTP credential exposure — CONFIRMED, all four points, still live

Tested 2026-06-11:

| Exposure point | Test | Result |
|---|---|---|
| `make_handoff.py:144` hardcodes the FTP password | grep | **present** |
| Same file in public GitHub repo | unauthenticated fetch of raw.githubusercontent.com/JFSNeumann/jfsn-archive/main/make_handoff.py | **password readable** |
| `JFSN-Archive-Handoff-Allison.pdf` committed to that public repo | unauthenticated fetch | **200** |
| Same PDF on the live site | https://jfsn.com/JFSN-Archive-Handoff-Allison.pdf | **200** |
| Is the exposed password still the active credential? | compared against `.ftp.env` | **yes — identical** |

Anyone who finds any of the four can log into HostGator FTP and delete or deface jfsn.com — all 1,084 works' public record.

**Exact remediation, in order (order matters):**
1. HostGator cPanel → FTP Accounts → change the password for `jeffery@jfsn.com`. (~5 min, Jeff or Allison)
2. Update `FTP_PASS` in `/Documents/JFSN/.ftp.env` so JFSN.app deploys keep working.
3. Delete the PDF from the webroot: `lftp` → `rm /JFSN-Archive-Handoff-Allison.pdf`.
4. Edit `make_handoff.py` to read FTP creds from `.ftp.env` at generation time (never hardcode), then regenerate the PDF for printing only — do not commit it.
5. `git rm --cached JFSN-Archive-Handoff-Allison.pdf`, add `JFSN-Archive-Handoff-Allison.pdf` and `*.pdf` deploy exclusion to `deploy.sh`, add the PDF to `.gitignore`, commit.
6. Optional once 1–5 are done: scrub git history (git-filter-repo). With the password rotated, the old history exposes only a dead credential — low urgency.

**Related, Jeff's decision needed:** `https://jfsn.com/docs/oral-history/JFSN-Oral-History.pdf` is also publicly downloadable (200). It is his private testimony. Whether it stays public is his call — not a defect until he says so.

### 1.2 Backup state — CONFIRMED WORSE than previously reported

Measured 2026-06-11, before this session's commit:

| Item | Laptop | Git HEAD | GitHub | 4TB drive | B2 |
|---|---|---|---|---|---|
| master-notes §20–25 (incl. BOTH creator corrections) | ✅ 53,229 B | ❌ 27,594 B (ends at §19) | ❌ | ❌ 27,594 B | ❌ 20,421 B (06-09) |
| docs/lost-works-register.md | ✅ | ❌ untracked | ❌ 404 | ❌ | ❌ |
| docs/SESSION-29-CHECKPOINT.md | ✅ | ❌ untracked | ❌ 404 | ❌ | ❌ |
| Last local commit (b45bf87f) | ✅ | ✅ | ❌ unpushed (ahead 1) | — | — |

In plain terms: **the composite correction (§22 analysis aftermath, §25), the sole-source-facts inventory, the craftsman questions, and the lost-works register existed in exactly one copy — this laptop — for over a day.** Last 4TB rsync and B2 sync: 2026-06-10 21:04, before session 29's content was written.

**Remediated this session:** committed, pushed to GitHub, rsynced to JEFFS-4TB, synced to B2 (see §5).

### 1.3 Public narrative integrity — full inventory

Authority chain used: creator testimony (§22 verbatim 2026-06-10; §25 paraphrase 2026-06-11) > everything else. "All gallery/installation-view/crowd images are Photoshop composites; very few actual exhibitions ever occurred."

**A. VERIFIED CREATOR TESTIMONY on the site (correct, protect it):**
- timeline.html — CIA sculpture "Shown in a student exhibition. Sold." — matches §12 testimony. The only exhibition claim on the site with a source.
- stories.html, why-i-made-things.html quotes — verbatim/confirmed (one passing "imagined making" phrase is the site's sole acknowledgment of imagined content).

**B. POTENTIALLY FALSE — unverified generated content presented as fact:**
1. **about.html:324–366 "Exhibition Record"** — six dated venue rows. Git forensics (full detail: master-notes §26): began life in the initial commit as a *hidden* block of "TBD gallery" placeholders marked "hidden until ready to publish"; a technical commit (438fb034, 2026-05-30) replaced the placeholders with six specific Cleveland venues and published it — before any oral-history session existed. **No established source.** Directly contradicts §25 ("very few"). Recommended state until Jeff verifies: re-hidden, not deleted — preserve the conflict.
2. **gallery-images.html intro + meta + og descriptions** — "Exhibition views and installation photographs from five decades of showing work… 149 photographs documenting shows… across gallery and museum spaces." Machine-written; creator-corrected as false. Needs a Jeff-approved rewrite (the true sentence — composites/imagined placements — is arguably more remarkable).
3. **index.html hero caption (lines ~377, ~502, ~855)** — "XXXIII Días Installation View · 2022 · COLLAGE," unmarked. Per §25 the image is a composite and the title references an expected film title, not an event.
4. **jeff.html** — describes Gallery Images theme as "Installation views and exhibition documentation"; "About — Bio, exhibitions, contact." Machine-reference page; same correction applies.

**C. INFERRED/MACHINE CONTENT presented without provenance markers (not false per se, unmarked):**
- 87 catalog titles containing Installation/Gallery View/Crowd; 93 descriptions using "installation view," 117 mentioning "gallery" — flow into all grid pages (gallery-images, framed, targets, photography, guernica, crosses, collage, sculpture, torsos-faces, collaboration, decade pages), 1,084 static pages, catalog.json/catalog-lite.json/api/v1, JSON-LD, og tags.
- 1,084/1,084 descriptions machine-written — no `description_source` field (verified: only `dimensions_source`/`dimensions_estimated` exist).
- 1,075/1,084 years are round decade buckets (re-verified this session; specific years: 1976, 1977, 2004, 2012×2, 2013×2, 2017, 2022) — displayed bare on artwork.html (`metaRow('Year', w.year)`) and asserted as `dateCreated` in JSON-LD.

**D. CLEARED — prior concerns that did NOT survive verification:**
- **AI Companion** (netlify/functions/companion.mjs): system prompt makes no exhibition claims; it's a narrow work-finder returning a JSON array of work IDs. Not a misinformation vector. (Minor residue: its one-sentence "reasons" draw on machine descriptions.)
- **stories/why-i-made-things/start-here/about prose** (outside the Exhibition Record): no unsourced exhibition claims found in a full-text sweep of every public page.
- **Old-site provenance theory disproven:** the exhibition table did NOT come from Jeff's pre-2026 site. The archived 2014 site (web.archive.org) is a design-portfolio site with no exhibition list, and old-site/ contains no venue names. The table's only source is the 2026-05-30 commit.

---

## 2. Classification (ranked by preservation impact)

| # | Finding | Class | Severity |
|---|---|---|---|
| 1 | FTP password public + active | **Archive Risk** | Critical — could erase the public archive |
| 2 | §20–25 + register existed in one copy | **Archive Risk** | Critical — remediated this session; root cause (no same-day backup habit after doc-only sessions) remains |
| 3 | about.html Exhibition Record unverified | **Historical Accuracy Risk** | High — most citable false-history candidate; needs testimony |
| 4 | gallery-images.html intro/meta claims | **Historical Accuracy Risk** | High — contradicts creator correction |
| 5 | Hero caption "Installation View" unmarked | **Historical Accuracy Risk** | Medium — front-page first impression |
| 6 | No provenance fields in catalog/api (description_source, year_precision, composite) | **Historical Accuracy Risk / Technical Debt** | Medium-high — every downstream consumer inherits unmarked machine content |
| 7 | Oral-history PDF publicly downloadable | **Decision needed (privacy)** | Jeff's call |
| 8 | deploy.sh excludes `*.md` but not `*.pdf`/docs | **Workflow Risk** | Medium — root cause of #1's PDF leg and #7 |
| 9 | Decade footers drifted (4 links missing ×6 pages, re-verified) | **Workflow Risk / UX** | Low-medium |
| 10 | artwork.html: themes unlinked, bare bucket years | **UX/UI + Accuracy** | Low-medium |
| 11 | IMPROVEMENTS.md duplicates/stale items | **Workflow Risk** | Low — fixed this session |

---

## 3. Quick Wins

**10-minute:**
- Rotate FTP password + update .ftp.env (kills finding #1's teeth instantly)
- `lftp rm` the PDF from the webroot; add `*.pdf` + `docs/` excludes to deploy.sh
- Ask Jeff the six-row Exhibition Record question (master-notes §26) — one sitting, settles the §25 residual question with a concrete checklist
- Record one ~1-minute audio (still the standing #1 creator-context priority; no audio of Jeff exists anywhere)

**1-hour:**
- make_handoff.py reads creds from .ftp.env; regenerate PDF for print only; git rm --cached the committed PDF
- Re-hide the Exhibition Record pending verification (restore pre-438fb034 hidden state) — only after/with Jeff's go-ahead
- Jeff-approved one-line rewrite of gallery-images.html intro + meta/og + hero caption marker
- Decade footer parity via a stamped Material footer block

**Multi-session (the only ones that clear the §25 completion bar):**
- Catalog provenance fields (`year_precision`, `description_source`, `composite: true` on the ~149 Gallery-theme works) flowing build_catalog → lite → api/v1 → artwork.html display ("c. 1970s") → JSON-LD
- Nothing else. Per-image classification remains dead (§25); no new audits needed.

---

## 4. Unresolved Questions Requiring Jeff's Testimony

1. **The Exhibition Record, row by row** (§26): did each of the six happen? → becomes the permanent real-exhibitions list.
2. **Wording approval** for: gallery-images.html intro, hero-caption composite marker, and (if desired) a year-display convention ("c. 1970s").
3. **Privacy decision:** does the oral-history PDF stay publicly downloadable?
4. Standing from §25 (unchanged priority): the three 1-minute audio recordings; who Aunt Mary is; occasional lost-works register entries.

## 5. What Changed This Session

- master-notes.md — **§26 appended** (Exhibition Record provenance + question protocol)
- docs/SESSION-31-PRESERVATION-HANDOFF.md — created (this file)
- IMPROVEMENTS.md — duplicates removed, stale items cleared, 🔴 security/verification items added
- CURRENT_STATE.md — corrected stale "not yet deployed" note; session-31 state recorded
- **All of the above + previously single-copy documents committed, pushed to GitHub, rsynced to JEFFS-4TB, synced to B2** (see CURRENT_STATE for the commit hash)
- No site pages, catalog, CSS, or JS touched. sw.js untouched. Nothing needs deploying for visitors.

## 6. What Remains Uncertain

- Whether any of the six listed exhibitions occurred (only Jeff knows).
- Whether the 2008 "Negative Space" / 2016 "Waterloo Arts" etc. entries were invented by a model or relayed from something Jeff once said off-record — git can't distinguish; the table is unverified either way.
- Which "very few" real exhibitions occurred beyond the late-1970s CIA student show (§12).
- Whether the oral-history PDF's public availability is intentional.

## 7. Recommended Next Actions (in order)

1. Jeff rotates the FTP password (everything else about finding #1 is housekeeping once this is done).
2. The six-row exhibition question, as audio if Jeff permits — one stone, three birds: settles the table, settles §25's residual list, captures his voice.
3. PDF removal + deploy excludes.
4. Jeff-approved gallery-images/hero wording.
5. Provenance fields, when a code session is wanted.

*Verification session, 2026-06-11. Companion documents: master-notes §22/§25/§26, SESSION-29-CHECKPOINT.md.*
