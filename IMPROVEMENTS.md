# JFSN — Improvement List
**Updated:** 2026-06-10 (session 24)

A living list. Add to it. Cross things off. This is the backlog.

---

## 🔴 Do soon

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
- [ ] **favorites.html** — still fetches full `catalog.json` (898KB). Adding `favorite` to `LITE_FIELDS` would let it use `catalog-lite.json` (701KB). Low priority.
- [ ] **HSTS** — uncomment one line in `.htaccess` once SSL confirmed active in HostGator cPanel.

---

## 🟢 Nice to have, low urgency

### Technical
- [ ] **`favorites.html`** — still fetches full `catalog.json` (898KB). Adding `favorite` to `LITE_FIELDS` would let it use `catalog-lite.json` (701KB). Low priority.
- [ ] **HSTS** — uncomment one line in `.htaccess` once SSL confirmed active in HostGator cPanel.


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
