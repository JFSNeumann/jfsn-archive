# JFSN — Improvement List
**Updated:** 2026-07-16

A living list. Add to it. Cross things off. This is the backlog.

---

## 🔴 Do soon

- [ ] **Ingest new work** — drop photos into `artworks/inbox/`, run `bash scripts/add-works.sh`. Pipeline is ready.

---

## 🟡 High value, no deadline

### Content
- [ ] **Physical artwork dimensions (real measurements)** — orientation stand-in SHIPPED session 35 (vertical/horizontal/square from pixel dims via `dims.json`, shown on artwork pages + an archive filter). Actual inches/cm still need Jeff to measure surviving works; no tooling. Start with the most significant pieces.
- [ ] **Oral history — unanswered questions** — see `docs/sources/oral-history/master-notes.md` § "Unresolved Questions" for priority list. Top item: why did he keep going after the Rauschenberg realization?
- [ ] **start-here.html** — oral history content written in (session 21). Review with Jeff and refine.

### Technical
- [ ] **`index.html`'s inline `<style>` (34KB, 8 blocks) — investigated in depth 2026-06-22, concluded NOT safely reducible by simple dedup.** Programmatically diffed every selector appearing in more than one block (9 candidates: `.hero-cta-ghost`, `.reveal-section` + its `.is-visible`/`.reveal-delay-1/2/3` variants, `.wtb-card`, `#hero-scroll-cue`). Every single one turned out to be **intentional layering, not redundancy** — e.g. `.hero-cta-ghost`'s visual properties (color/border/font) live in one block while its motion timing and `@media (prefers-reduced-motion: reduce)` override live in another, added in different sessions targeting different concerns of the same component. Merging the 8 `<style>` tags into one in their exact current order would be a zero-risk no-op (CSS cascade only cares about source order, not tag count) but **would not reduce the 34KB** — the audit-nav.sh threshold is on byte count, not tag count, so a pure merge doesn't address what it's actually warning about. Genuinely cutting bytes would mean rewriting cascading rules rather than just moving them, which risks regressing the most complex, most-edited page on the site (245 commits) for a cosmetic warning, not a real bug. Recommend either: raise the threshold (34KB for the page carrying Session 79's full hero/river animation system may simply be reasonable), or treat this as a slow, deliberate refactor with full visual regression testing — not a quick pass.
- [x] **17 Session-65 interaction scripts audited in full, 2026-06-22** (resolves the earlier same-day flag, which was based on a stale Don'ts list — corrected separately in `DESIGN-SYSTEM.md`; generic motion like parallax/scroll-reveal/scale-transform is NOT banned per `CLAUDE.md`'s actual current stance, so that was never the real question). Read every file and checked live attribute/class usage against each one. Findings:
  - **Two real, fixed bugs:** (1) `lightbox.js` unconditionally hijacked every `.thumb__link` click (21 pages) with `preventDefault()`, racing `page-transitions.js`'s own click handler — every thumbnail click briefly flashed a bare image-only modal (no title/year/medium) before the real navigation won a moment later. Confirmed live via dispatched click events. Fixed: `lightbox.js` no longer touches `.thumb__link`; the modal now only attaches to the (currently unused) `[data-zoomable]` opt-in. (2) `scroll-to-top.js` injected its own floating button at almost the exact position/size as `_shared/footer.html`'s `#btt-float` (28px/44px vs. 24px/48px from bottom-right) — two overlapping buttons on every page past 300px scroll. Disabled `scroll-to-top.js` (emptied, same pattern as the already-disabled `keyboard-shortcuts.js`); `#btt-float` is the one actually wired into the canonical footer.
  - **Confirmed 100% dead code (zero matching attributes/classes anywhere in the live HTML), harmless but parsed/executed on every page for nothing:** `advanced-interactions.js` (drag-drop/long-press/context-menu), `infinite-scroll.js`, `parallax.js`, `scroll-reveal.js`, `swipe-gestures.js`, `form-validation.js`, `search-highlight.js`, `search-breadcrumb.js` (reachable only via a specific sessionStorage sequence nothing currently sets). `micro-interactions.js` (1,326 lines, ~40 functions, all invoked unconditionally on every page) is the same story at larger scale — re-implements many of the same features under different selectors, all opt-in via classes/IDs that don't exist in the live HTML (`.hero-parallax-image`, `.grid-stagger`, etc.), so none of it does anything either, including its own `setupScrollToTop()` (now permanently inert since the button it looks for is never created).
  - **Active, harmless, no artwork-honesty issue:** `hover-preview.js` (supplementary metadata tooltip, doesn't hide anything), `toast.js` (passive utility called by other scripts), `analytics.js` (live on production, sends batched events via `sendBeacon` to `/analytics` — which doesn't exist as a backend on this static site, so it silently no-ops; duplicates GoatCounter's actual job for no benefit, but causes no visible problem), `image-prefetch.js` (prefetches adjacent artwork images; one fallback path guesses `.jpg` instead of the real `.avif` extension — harmless since it's just a failed prefetch, not user-visible).
  - **None of the 17+1 files filter, recolor, distort, or tilt an artwork image, or hide a work's title/year/medium behind a hover-only state** — the actual non-negotiable rule. Confirmed clean.
  - **2026-06-23 — decided and done.** Jeff: delete the ~8 confirmed-dead files. Independently re-verified zero live references for every opt-in selector (`data-drop-zone`, `data-long-press`, `data-infinite-scroll`, `data-parallax`, `data-reveal=`, `.reveal-fade`/`.reveal-up`/`.reveal-scale`, `data-swipe-*`, `data-validate`, `data-search-result`, `data-work-title`, `breadcrumb-container`) across all 39 root HTML pages + all 1,084 generated artwork pages before deleting. Removed `advanced-interactions.{js,css}`, `infinite-scroll.{js,css}`, `parallax.{js,css}`, `scroll-reveal.{js,css}`, `swipe-gestures.{js,css}`, `form-validation.{js,css}`, `search-highlight.{js,css}`, `search-breadcrumb.{js,css}` (16 files) and their `<script>`/`<link>` tags from all 39 pages. `tools/generators/gen-artwork-pages.py`'s template never referenced them, so the 1,084 generated pages needed no changes. `micro-interactions.js` (the larger, same-pattern dead file) was left in place — not part of this specific decision, still open.
- [ ] **Grid/search/favorites year labels** (optional follow-up to provenance) — these still show the bare decade year ("1990"); only artwork detail pages + API carry the honest "1990s (est.)". Could extend `year_display` to grids, but it adds visual noise to terse captions — deferred pending Jeff's call.
- [ ] **archive.html interaction layer consistency pass** — archive.html still carries the Session-77 `fc-*` interaction layer (ripple/badge/swatch/peek-modal) that the homepage's Selected Works grid no longer has (cut in the 2026-06-21 simplicity pass). Flagged as a future consistency pass, not in scope unless Jeff asks.

---

## 🟢 Nice to have, low urgency

### Technical
- [ ] **series-index.html per-theme icons** — extend the session-35 icon vocabulary (inline feather SVGs) to the 8 series/themes, but ONLY if they read as earned rather than literal. Review with Jeff first.

---

## ✅ Completed

History lives in `git log` — `git log --oneline --all` for the full record. A few recent highlights for orientation:

- **2026-07-16 (later)** — **Homepage LCP fixed: 5.1s → 1.9s, Lighthouse 81 → 100.** Root cause: hero image fetched 3× eagerly (LCP element + 2 decorative wing flankers, same 314KB file). Wired in pre-built-but-unused LCP assets (`art1010-hero-lcp.avif`/`-m.avif`) via srcset; wings switched to lazy-load. Also: hero highlight-box color unified to orange across all 5 room pages, archive.html search bar surfaced above the fold, both backup LaunchAgents found unloaded from launchd since 2026-07-08 and reloaded + verified with live kickstarted runs (see CURRENT_STATE.md for full detail).
- **2026-07-14 to 2026-07-16** — **Permanent Museum Approved** (curatorial review complete, 2026-07-15; all five main rooms certified without revision required). Hero implementation complete across four rooms (The Studio, Guernica Passage, Hall of Openings, Flooded Wing). Border Grammar analysis + implementation for doors as sole interaction language. Documentation cleanup: renamed duplicate verification-standard file, archived 8 old session closeout docs, deleted orphan assets/files. Commit `d4ad53b6`.
- **2026-06-22/23** — Full documentation/preservation audit (every `.md` file reviewed) followed by **Netlify and the Companion AI chat feature removed entirely** — Netlify had no git integration and was a recurring source of deploy friction; Companion only ran as a Netlify Function, so dropping one meant dropping the other. HostGator is now the only host. Touched: `companion.html` + `netlify/` deleted, `tools/generators/gen-artwork-pages.py`'s static-page template fixed (all 1,084 pages regenerated), `session-end.sh`/`stamp-nav.sh`/`build_catalog.py`/`verify_deploy.py`/`make_handoff.py` cleaned up, 10 active docs corrected (including rewriting `DISASTER-RECOVERY-CHECKLIST.md`'s Scenario B, which depended on the now-gone Netlify mirror as the "immediately reachable" fallback). Also caught and fixed a 6-day-old propagation gap from the 2026-06-16 domain-ownership correction (`docs/KNOWLEDGE-AT-RISK-INVENTORY.md` still listed "the domain-friend's name" as an open to-do). Committed `047aab54` + `139a2ce9`, pushed, deployed to jfsn.com (verified live), 4TB backup verified (file counts matched after a drive reseat).
- **2026-06-21** (sessions 76–78) — Homepage Selected Works simplification: removed Session-77 interaction layer (ripple/badge/swatch/peek-modal); kept image + always-visible caption + link. CLAUDE.md updated to retire the "default to removal" framing as an over-correction (motion designer's craft restored as the design stance).
- **2026-06-20** (session 75) — Selected Works masonry redesign to match archive.html (CSS Columns 4→3→2, simplified card structure). series-index.html responsive padding + image overlay removal.
- **2026-06-19** (session 74) — Archive grid masonry fix (CSS Columns), saturation overlay removed sitewide (true vibrant color revealed), series page tooltip cleanup.

Older entries removed per this file's own rule ("Delete completed items; history lives in git log"). If a longer narrative log is wanted, see `docs/sessions-archive.md`.

---

## How to use this list

Start each session: paste the start prompt → `Read CURRENT_STATE.md and IMPROVEMENTS.md. Summarize open items by priority, flag anything stale, then ask what I want to work on.`

Add new ideas here any time. Delete completed items; history lives in git log.
