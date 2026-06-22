# JFSN — Improvement List
**Updated:** 2026-06-22

A living list. Add to it. Cross things off. This is the backlog.

---

## 🔴 Do soon

- [ ] **Ingest new work** — drop photos into `artworks/inbox/`, run `bash add-works.sh`. Pipeline is ready.
- [ ] **B2 cloud backup** — if capped, run `bash cloud-backup.sh` after ~8 PM EDT reset.
- [ ] **One more Lighthouse mobile run, after a day of real fixes (not just hope).** Session 45 went through 4 rounds of Jeff's actual Lighthouse runs and fixed something concrete each time — heavy mis-chosen hero image (8.7s → 5.2s worst-case LCP), missing `srcset` on the homepage's top-3 cards, sitewide render-blocking Google Fonts (confirmed gone from the insights list after the fix). Worst-case LCP dropped from 8.7s to ~5.2s; CLS stayed healthy (≤0.087). What's left ("Improve image delivery" ~500KiB) is mostly explained by Jeff's iPhone's high DPR defeating the `srcset` fix — not something to chase without new evidence. One more run will show whether the remaining LCP variance is genuinely settled or still Lighthouse run-to-run noise.

---

## 🟡 High value, no deadline

### Content
- [ ] **Physical artwork dimensions (real measurements)** — orientation stand-in SHIPPED session 35 (vertical/horizontal/square from pixel dims via `dims.json`, shown on artwork pages + an archive filter). Actual inches/cm still need Jeff to measure surviving works; no tooling. Start with the most significant pieces.
- [ ] **Oral history — unanswered questions** — see `docs/oral-history/master-notes.md` § "Unresolved Questions" for priority list. Top item: why did he keep going after the Rauschenberg realization?
- [ ] **start-here.html** — oral history content written in (session 21). Review with Jeff and refine.

### Technical
- [ ] **Grid/search/favorites year labels** (optional follow-up to provenance) — these still show the bare decade year ("1990"); only artwork detail pages + API carry the honest "1990s (est.)". Could extend `year_display` to grids, but it adds visual noise to terse captions — deferred pending Jeff's call.
- [ ] **archive.html interaction layer consistency pass** — archive.html still carries the Session-77 `fc-*` interaction layer (ripple/badge/swatch/peek-modal) that the homepage's Selected Works grid no longer has (cut in the 2026-06-21 simplicity pass). Flagged as a future consistency pass, not in scope unless Jeff asks.

---

## 🟢 Nice to have, low urgency

### Technical
- [ ] **series-index.html per-theme icons** — extend the session-35 icon vocabulary (inline feather SVGs) to the 8 series/themes, but ONLY if they read as earned rather than literal. Review with Jeff first.

---

## ✅ Completed

History lives in `git log` — `git log --oneline --all` for the full record. A few recent highlights for orientation:

- **2026-06-21** (sessions 76–78) — Homepage Selected Works simplification: removed Session-77 interaction layer (ripple/badge/swatch/peek-modal); kept image + always-visible caption + link. CLAUDE.md updated to retire the "default to removal" framing as an over-correction (motion designer's craft restored as the design stance).
- **2026-06-20** (session 75) — Selected Works masonry redesign to match archive.html (CSS Columns 4→3→2, simplified card structure). series-index.html responsive padding + image overlay removal.
- **2026-06-19** (session 74) — Archive grid masonry fix (CSS Columns), saturation overlay removed sitewide (true vibrant color revealed), series page tooltip cleanup.

Older entries removed per this file's own rule ("Delete completed items; history lives in git log"). If a longer narrative log is wanted, see `docs/sessions-archive.md`.

---

## How to use this list

Start each session: paste the start prompt → `Read CURRENT_STATE.md and IMPROVEMENTS.md. Summarize open items by priority, flag anything stale, then ask what I want to work on.`

Add new ideas here any time. Delete completed items; history lives in git log.
