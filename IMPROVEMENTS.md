# JFSN — Improvement List
**Updated:** 2026-06-09 (session 21)

A living list. Add to it. Cross things off. This is the backlog.

---

## 🔴 Do soon

- [ ] **Ingest new work** — drop photos into `artworks/inbox/`, run `bash add-works.sh`. Pipeline is ready.

---

## 🟡 High value, no deadline

### Content
- [ ] **Physical artwork dimensions** — no tooling exists yet. Essential archival data for works that will be distributed to heirs. Requires Jeff to measure surviving works. Start with the most significant pieces.
- [ ] **Oral history — unanswered questions** — see `docs/oral-history/master-notes.md` Section "Unresolved Questions" for priority list. Top item: why did he keep going after the Rauschenberg realization?
- [ ] **start-here.html** — oral history content written in (session 21). Review with Jeff and refine.

### Technical
- [ ] **favorites.html** — still fetches full `catalog.json` (898KB). Adding `favorite` to `LITE_FIELDS` would let it use `catalog-lite.json` (701KB). Low priority.
- [ ] **HSTS** — uncomment one line in `.htaccess` once SSL confirmed active in HostGator cPanel.

---

## 🟢 Nice to have, low urgency

### Physical
- [ ] **Print run of 12** — 12 prints of 12 works, numbered. Not a code problem.

---

## ✅ Completed (recent)
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
