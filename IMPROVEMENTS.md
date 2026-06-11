# JFSN — Improvement List
**Updated:** 2026-06-11 (session 31)

A living list. Add to it. Cross things off. This is the backlog.

---

## 🔴 Do soon

- [ ] **SECURITY: rotate the FTP password** — it is public (hardcoded in make_handoff.py on public GitHub + inside the Allison PDF on GitHub and at jfsn.com/JFSN-Archive-Handoff-Allison.pdf). cPanel → FTP Accounts → change password → update `.ftp.env`. Full steps: docs/SESSION-31-PRESERVATION-HANDOFF.md §1.1.
- [ ] **Remove the Allison PDF from the webroot** + add `*.pdf` and `docs/` excludes to deploy.sh; make make_handoff.py read creds from .ftp.env.
- [ ] **Ask Jeff the Exhibition Record question** — about.html lists six shows with venues; git forensics shows it grew from "TBD gallery" placeholders, no source (master-notes §26). Read the six rows to Jeff: which happened? Then fix or re-hide the table.
- [ ] **One ~1-minute audio recording** — standing #1 creator-context priority (§25). No audio of Jeff exists anywhere.
- [ ] **Ingest new work** — drop photos into `artworks/inbox/`, run `bash add-works.sh`. Pipeline is ready.

---

## 🟡 High value, no deadline

### index.html UX/UI — best-in-class pass
Four specific gaps identified session 26 (2026-06-10):
- [ ] **Hero scroll cue** — no signal that content exists below the hero. Add a subtle animated `↓` fading in after 2s at bottom center. CSS only, prefers-reduced-motion safe.
- [ ] **"About This Archive" visual hierarchy** — three dense paragraphs, no visual weight. Promote first sentence to Playfair pull-quote, or add a stat column (1,084 · 1974–present · Cleveland) to the right. Or move section below the art grid so art leads.
- [ ] **"Where To Begin" card warmth** — reads like a nav table. Consider orange left-bar on hover (instead of full invert), more padding, or italic descriptor line. Keep existing `→` micro-labels.
- [ ] **Section separation** — bone-white sections blur together on scroll. Add `border-top: 1px solid #c4c7c7` between hero / about / where-to-begin / selected-works.

### Content
- [ ] **Physical artwork dimensions** — no tooling exists yet. Essential archival data for works that will be distributed to heirs. Requires Jeff to measure surviving works. Start with the most significant pieces.
- [ ] **Oral history — unanswered questions** — see `docs/oral-history/master-notes.md` Section "Unresolved Questions" for priority list. Top item: why did he keep going after the Rauschenberg realization?
- [ ] **start-here.html** — oral history content written in (session 21). Review with Jeff and refine.

### Technical
- [ ] **HSTS** — uncomment line 93 in `.htaccess`; SSL is confirmed working (site serves https with full security headers).
- [ ] **Catalog provenance fields** — `year_precision`, `description_source`, `composite` flags through build_catalog → lite → api/v1 → artwork.html ("c. 1970s" display) → JSON-LD. The one multi-session project worth doing (handoff §3).
- [ ] **gallery-images.html intro + hero caption** — needs Jeff-approved rewrite; current text states the composites are real exhibition documentation (false per master-notes §22/§25).

---

## 🟢 Nice to have, low urgency

### Technical
- [ ] **Decade footer parity** — all 6 decade pages missing api/favorites/start-here/why-i-made-things links vs shared footer. Best fixed with a stamped Material footer block, not hand edits.
- [ ] **artwork.html theme links** — Themes metadata row is plain text; link to theme pages via a small slug map (also in gen-artwork-pages.py template).
- [ ] **sw.js PRECACHE** — add stories.html, why-i-made-things.html, timeline.html.

---

## ✅ Completed (recent)
- [x] ~~**start-here.html spacing**~~ — Begin Exploring no longer crowds footer; outer wrapper padding fixed (session 26)
- [x] ~~**Footer bottom bar breathing room**~~ — pb-8 added, stamped to all 31 pages (session 26)
- [x] ~~**jeff.html stale**~~ — full revision: all current pages, theme pages, Netlify URL, corrected tags (session 26)
- [x] ~~**`border-radius` on saturation overlay**~~ — `border-radius: inherit` added to `.thumb__link::after` in ui.css (session 25)
- [x] ~~**Two-column layout overflow fix**~~ — gap-16→gap-8, mobile padding fix on stories/why-i-made-things/start-here (session 24)
- [x] ~~**TOC on long pages**~~ — stories.html + why-i-made-things.html sidebar TOC with active tracking (session 24)
- [x] ~~**Search `/` shortcut**~~ — opens search overlay, modal + tooltip updated (session 24)
- [x] ~~**Archive filter chips**~~ — dismissible chips, clear all, count label, mobile fixes (session 24)
- [x] ~~**Artwork keyboard hint + copy link**~~ — keyboard hint below nav, copy link button (session 24)
- [x] ~~**Image hover system**~~ — saturation overlay on all artwork thumbnail pages; orange border image-only; Inter 600 captions (session 23)
- [x] ~~**Archive title-orange**~~ — was missing; added to archive.html h4 (session 23)
- [x] ~~**series.html missing ui.css**~~ — link added (session 23)
- [x] ~~**featured.txt**~~ — rebalanced 2026-06-05
- [x] ~~**search.js browse counts**~~ — auto-patched via build_catalog.py (session 21)
- [x] ~~**series.html named series broken**~~ — series field missing from catalog-lite.json (session 21)
- [x] ~~**dims.json missing**~~ — build_dims.py run, masonry layout restored (session 21)
- [x] ~~**start-here.html oral history**~~ — Jeff's voice written into page (session 21)
- [x] ~~**cache-stamp dead code**~~ — ?v=BUILD_TS now in index.html (session 21)
- [x] ~~**orphaned files**~~ — 13 files deleted (session 21)

---

## How to use this list

Start each session: paste the start prompt → `Read CURRENT_STATE.md and IMPROVEMENTS.md. Summarize open items by priority, flag anything stale, then ask what I want to work on.`

Add new ideas here any time. Delete completed items; history lives in git log.
