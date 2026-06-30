# JFSN Archive — Code Quality Audit

**Audit date:** 2026-06-26
**Auditor role:** Principal Front-End Engineer / Staff Software Architect review of jfsn.com.
**Status of this document:** Permanent engineering baseline. Supersedes any in-conversation audit findings from prior sessions — this file is the durable record going forward.
**Relationship to other docs:** [`PHASE1_REVIEW.md`](PHASE1_REVIEW.md) documents the regression review of the Phase 1 changes below. [`SESSION-END-PHASE1.md`](SESSION-END-PHASE1.md) is the session handoff. This document is the standing technical assessment; update it (don't replace it) as future phases land.

> **Read this first when starting a future session on this codebase's engineering quality.** It separates what has already been verified and fixed from what is still open, so a fresh session does not re-discover or re-litigate Phase 1.

---

## Executive Summary

The JFSN Archive is a static, vanilla HTML/CSS/JS archive of 1,084 works (1974–present), built and run by its subject as a personal record rather than a commercial site. The data layer and mission discipline are strong: catalog data is honest (composites flagged, years kept as decade estimates), the build pipeline (`build_catalog.py`, `gen-artwork-pages.py`) is coherent, and the service worker / AVIF pipeline reflect real performance engineering effort.

The front-end **runtime layer** — shared JS/CSS, nav scripting, page-level script tags — had accumulated debt across roughly 95 prior sessions: overlapping shared modules, hand-duplicated event handlers that fought each other, a render-blocking unminified stylesheet larger than the entire compiled Tailwind build, and a dark-mode flash-of-wrong-theme bug present on every page.

**Phase 1 (this audit's first execution pass) has been completed, reviewed for regressions, committed, tagged, deployed, and verified live on production.** It closed the highest-confidence, zero-visual-risk subset of findings: the theme-flash bug, five duplicate/conflicting handlers in `_shared/ui.js`, and three fully orphaned files. One regression introduced during that work (loss of `aria-expanded` on the mobile-menu button) was found by a dedicated second review pass and fixed at its root — the canonical handler now owns that attribute directly.

Everything else identified in the original audit — JS bundling, CSS splitting, `stamp-nav.sh`'s fragile marker scheme, the dual artwork-rendering system, animation-module sprawl, and a long tail of smaller items — **remains open** and is catalogued below as the active backlog.

| Dimension | Score (1–10) | Status as of this document |
|---|---|---|
| Overall health | 6 | Improved from pre-Phase-1 baseline; runtime layer still the weak point |
| Maintainability | 4 → 5 | `ui.js` dedup helps; 38-page hand-maintenance + `stamp-nav.sh` fragility unchanged |
| Architecture | 4 | No bundling; dual artwork system; ~60-module sprawl — unchanged |
| Performance | 5 | Unminified 158 KB `ui.css` still render-blocking; ~21–33 scripts/page unchanged |
| Accessibility | 7 → 8 | FOUC fixed sitewide (Phase 1: 38 root pages; Phase 2B: 1,084 generated pages); `aria-expanded` regression caught and fixed |
| Consistency | 5 | Inline-style sprawl, per-page asset drift — unchanged |
| Technical debt | 3 → 4 | Phase 1 removed real debt; the larger structural items are still ahead |

---

## Architecture Assessment

**Pages:** 38 hand-maintained root HTML pages + 1,084 machine-generated artwork detail pages (`artworks/pages/*.html`, built by `gen-artwork-pages.py`) + a separate client-side artwork renderer (`artwork.html`, loads by `?id=artNNNN`). **These last two are two independent systems rendering the same content and must be kept in sync by hand** — a structural risk, not yet resolved.

**Shared layer:** ~60 files under `_shared/` (JS + CSS), loaded piecemeal per page via individual `<script src>`/`<link>` tags — no bundler, no build step beyond the Tailwind CLI for `site.min.css`. A typical page loads 21–33 separate script files and 9–15 separate stylesheets.

**Nav/footer propagation:** `_shared/top-nav.html` and `_shared/footer.html` are the canonical partials; `stamp-nav.sh` propagates them into the 38 root pages by replacing everything between `<!-- NAV:START -->`/`<!-- NAV:END -->` (and the footer equivalent) verbatim. **The NAV span covers more than markup — it spans the entire sitewide `<script>` bundle**, which means any page-specific script tag placed near that block sits inside the span and is destroyed on the next re-stamp. This has caused real, previously-shipped feature loss in earlier sessions and remains unresolved.

**Two parallel design-token systems** coexist by deliberate choice (a Stitch/Tailwind light system for most pages, a Material Design system for the six decade pages + `archive.html`) — this is documented and intentional, not a defect, but it means there is no single source of truth for color/spacing tokens across the whole site.

**Data/build pipeline:** `build_catalog.py` → `catalog.json`/`catalog-lite.json`/`api/`/`sitemap.xml`/`feed.xml`; `gen-artwork-pages.py` → the 1,084 static pages. This pipeline is coherent and well-documented in `CLAUDE.md`; it was read and understood as part of this audit but not modified.

---

## Technical Debt

Ordered by current status, not by original severity — this reflects what's actually still owed.

### Closed by Phase 1
- Dark-mode FOUC (theme applied post-paint, deep in `<body>`) — **fixed**, head-blocking init on all 38 root pages.
- Five duplicate/conflicting event handlers inside `_shared/ui.js` (mobile-menu open/close, header-collapse-on-scroll, lazy-image fade loop, P/N keyboard nav, two identical 14-entry theme-color maps) — **removed**, canonical copies kept, one helper function extracted.
- Dead, broken keyboard-shortcuts-modal-hider code (its `!important`-via-`.style` lines were no-ops; its capture-phase handler was silently blocking the real shortcuts overlay) — **removed**.
- Three fully orphaned files with zero references anywhere in the codebase — **deleted**, all `<link>`/array references removed across 38 pages.
- `aria-expanded` regression introduced mid-Phase-1 and caught by review — **fixed at the root**: the canonical mobile-menu handler in `_shared/top-nav.html` now sets the attribute directly (button ships `aria-expanded="false"` in markup; `openMenu()`/`closeMenu()` set `true`/`false`), propagated to the 37 pages that carry the menu.

### Still open — large, structural
- **No JS bundling.** 21–33 separate script requests per page. Highest-ROI item not yet attempted; deferred because it requires a build-step decision and touches every page's script block.
- **`ui.css` is 158 KB, unminified, 6,958 lines, larger than the entire compiled Tailwind output, and render-blocking on every page.** Splitting critical/non-critical CSS requires page-by-page visual verification — explicitly out of scope for the no-visual-risk Phase 1.
- **`stamp-nav.sh`'s marker-span fragility** (above). Needs a restructured marker scheme (separate `NAV:`/`SCRIPTS:` spans, or a real build-time partial system) before it can be trusted for routine nav changes without manual diff review.
- **Dual artwork-rendering system** (`artwork.html` vs. `artworks/pages/*.html`) — an architecture decision for the site owner, not a unilateral engineering fix.
- **~60-module animation/effects layer** under `_shared/` with real overlap (multiple "chromatic"/"ambient" tint scripts, multiple parallax variants, several single-purpose entrance-animation files). Per the project's own design brief, this is the site owner's creative domain — consolidation needs sign-off, not a unilateral cleanup.

### Still open — medium
- `_shared/ui.css` defines `img[loading="lazy"]` **twice** with two different mechanisms (one transition-driven keyed to `.jfsn-loaded`, one animation-driven keyed to `.loaded`, around lines 1685 and 2815). The JS side feeding the second one was removed in Phase 1; the redundant CSS rule itself was deliberately left in place, flagged inline, pending visual verification.
- The kept P/N (prev/next artwork) keyboard-shortcut handler in `ui.js` still locates adjacent-work links via `a[href$=".html"][href*="art"][href*="../"]` + `textContent.includes('PREVIOUS'/'NEXT')` — fragile string matching, not an explicit `data-direction` attribute. Pre-existing; works today; not touched.
- Per-page script/stylesheet drift: `search.js`, `nav-active.js`, `ui.js`, `floating-home-button.js` etc. are not included on a fully consistent subset of pages — verified via script-tag census; pages have silently diverged over prior sessions.
- ~~The **dark-mode FOUC fix was applied only to the 38 hand-maintained root pages — not to the 1,084 generated artwork detail pages.**~~ **Fixed in Phase 2B (FOUC):** `gen-artwork-pages.py` template updated; all 1,084 pages regenerated and deployed 2026-06-29 (commit `0f2d1fbe`, tag `phase2-fouc-freeze`). FOUC fix is now sitewide.
- Remaining (non-duplicate) `scroll` listeners are still scattered across roughly a dozen `_shared/*.js` files plus `ui.js` itself (4 single-purpose listeners: hero zoom-out, background-color fade, footer-gradient parallax, and one more) and `top-nav.html`/`footer.html` (1 each) — Phase 1 removed *duplicates*, but the broader recommendation to consolidate into one shared rAF-throttled scroll dispatcher is still undone.

### Still open — small / cosmetic
- 106 `TODO`/`FIXME`/`XXX`/`HACK`/`DEPRECATED` markers across `_shared/*.js` and root HTML — not triaged.
- A filename with a literal space (`me black.gif`, referenced in `_shared/top-nav.html`) — fragile across some servers/CDNs; low risk on the current host, not fixed.
- Stale `package.json` metadata (`"main": "artist-config.js"`, empty `author`, generic `"license": "ISC"`) — cosmetic, zero runtime effect.

---

## Dead Code Found

| Item | Status |
|---|---|
| `_shared/keyboard-shortcuts.js` (0 references anywhere) | **Deleted** (Phase 1) |
| `_shared/scroll-to-top.js` (0 references anywhere) | **Deleted** (Phase 1) |
| `_shared/keyboard-shortcuts.css` (styled only non-existent modal markup) | **Deleted** (Phase 1), all 38 `<link>`/array references removed |
| Disabled keyboard-shortcuts-modal-hider IIFE in `ui.js` (broken `!important`-via-`.style`, blocked the real shortcuts overlay) | **Removed** (Phase 1) |
| Duplicate mobile-menu handler in `ui.js` | **Removed** (Phase 1) — canonical copy in `top-nav.html` kept |
| Duplicate header-collapse scroll handler in `ui.js` | **Removed** (Phase 1) |
| Duplicate lazy-image fade-in loop in `ui.js` (`.loaded` class, unread by any CSS that mattered) | **Removed** (Phase 1) |
| Duplicate P/N keydown handler in `ui.js` (pre-empted the transition-aware copy) | **Removed** (Phase 1) |
| Two identical 14-entry `themeMap` objects in `ui.js` | **Deduped** into shared `JFSN_THEME_MAP` + `jfsnThemeColor()` (Phase 1) |
| Redundant `img[loading="lazy"]` CSS rule pair in `ui.css` (one side now unfed by JS) | **Open** — CSS itself not yet touched, pending visual verification |
| 106 TODO/FIXME/DEPRECATED comments | **Open** — not triaged |
| `old-site/` (15 MB, gitignored, local-only) | **Open, low priority** — correctly excluded from git; could be archived off the working tree but is harmless where it sits |

---

## Bugs Found

| # | Bug | Status |
|---|---|---|
| Dark-mode theme applied post-paint → flash of wrong theme on every load | **Fixed** (Phase 1: head-blocking init, all 38 root pages) |
| Two handlers bound to the same mobile-menu elements, opening the drawer two different (conflicting) ways | **Fixed** (Phase 1: duplicate removed) |
| Header could hide while the mobile drawer was open (duplicate scroll handler lacked the `menuOpen` guard the canonical one has) | **Fixed** (Phase 1) |
| `?` keyboard-shortcut for the shortcuts overlay was silently blocked by a capture-phase handler calling `stopPropagation()` | **Fixed** (Phase 1) |
| `el.style.x = '... !important'` no-ops (CSSOM property setter ignores `!important`) in the dead modal-hider | **Fixed** (Phase 1 — code removed entirely) |
| *(Found and fixed during the Phase 1 regression review, not present in the original audit pass)* Removing the duplicate mobile-menu handler also removed the only code maintaining `aria-expanded` on the hamburger button | **Fixed** (canonical handler now sets it directly; verified live) |
| `stamp-nav.sh`'s NAV-span regex can silently delete page-specific scripts placed near the sitewide bundle on re-stamp | **Open** — known, previously-triggered, requires a marker-scheme redesign |
| P/N artwork-nav selector relies on brittle `textContent` string matching | **Open** — works today, not hardened |
| Filename with a literal space (`me black.gif`) | **Open** — low risk, not fixed |
| Background-color-fade and footer-gradient-parallax scroll handlers in `ui.js` run on every scroll event without throttling beyond their own internal logic | **Open** — not consolidated into a shared rAF dispatcher |
| Dark-mode FOUC fix not yet applied to the 1,084 generated artwork detail pages | **Fixed** (Phase 2B, commit `0f2d1fbe`, 2026-06-29) |

---

## Performance Findings

- **No JS bundling.** 21–33 separate `<script src>` requests per page (verified by direct count on `index.html`, `archive.html`, `artwork.html`, `collage.html`, `about.html`, a decade page). Largest unaddressed performance cost on shared hosting. **Open.**
- **`_shared/ui.css` is 158 KB, unminified, 6,958 lines** — larger than the entire compiled `site.min.css` Tailwind build (24 KB) — and is render-blocking, loaded before the Tailwind stylesheet in `<head>` on every page. **Open.**
- **`catalog-lite.json` is 848 KB**, loaded by the search overlay and favorites page. Not yet assessed for compression/trimming opportunities beyond what HostGator's server-level gzip may already provide. **Open, not yet investigated further.**
- The service worker (`sw.js`) implements a sound, differentiated caching strategy (cache-first for AVIF, stale-while-revalidate for catalog JSON, network-first-with-offline-fallback for HTML/CSS/JS) and correctly bypasses the browser's own HTTP cache via `{cache:'reload'}` to avoid a previously-fixed bug where bugfixes sat invisible for 30 days. This is **solid, already-good engineering** — no audit action needed here beyond the routine `CACHE_V` bump discipline, which Phase 1 followed correctly.
- Several independent `scroll` listeners remain across `_shared/*.js`, `ui.js`, `top-nav.html`, and `footer.html` (a dozen-plus files). Phase 1 removed the *duplicates*; the broader recommendation — one shared rAF-throttled scroll dispatcher that effects subscribe to — remains **open**.

---

## Accessibility Findings

- **Dark-mode FOUC** disproportionately affected the stated audience (the site explicitly targets a 70+ demographic per its own UX priorities) — **fixed sitewide**: Phase 1 covered the 38 root pages; Phase 2B (FOUC, 2026-06-29) extended the fix to all 1,084 generated artwork pages. Every page on jfsn.com now loads in the correct theme with no flash.
- **`aria-expanded` on the mobile-menu hamburger** — found missing during the Phase 1 regression review (a side effect of removing a duplicate handler, not a pre-existing defect), and **fixed** at the root: the canonical handler now owns it directly, with a correct default in static markup.
- The site's stated accessibility intent is otherwise strong by design: skip-to-content link, `prefers-reduced-motion` respected broadly across `ui.css` and the animation modules, WCAG AA-tuned color tokens (with an explicit `orange-ink` accessible variant for persistent text), and `aria-current="page"` nav-state handling. This audit did not re-verify every individual claim (e.g., did not run a full contrast or screen-reader pass) — that remains a reasonable Phase 2+ candidate if accessibility is prioritized further.
- No other accessibility regressions were introduced or found during Phase 1 beyond the one caught and fixed.

---

## Workflow Findings

- **No build step beyond Tailwind compilation.** Adding any shared JS/CSS still means hand-editing per-page `<script>`/`<link>` lists across up to 38 files — this is the root cause of the per-page asset drift noted above.
- **`stamp-nav.sh` is the only propagation mechanism for nav/footer changes**, and its regex span is broader than it looks (see Architecture Assessment). Phase 1's one nav-markup change (`aria-expanded`) was deliberately propagated via a surgical, string-identical find-and-replace across the 37 affected pages rather than a full re-stamp, specifically to avoid this risk. **This is the safer pattern for small nav changes until the script itself is restructured.**
- **A pre-commit hook already exists and is working well**: it runs `audit-nav.sh`, rebuilds and diffs `site.min.css` (only failing the commit if the rebuild produces *unstaged* changes — not a blunt "did CSS change" check), and verifies `CACHE_V` was both bumped and correctly formatted whenever a precached asset changes. This caught nothing wrong in Phase 1 (everything passed cleanly) but is a real safety net worth preserving and extending, not replacing.
- **The original audit report itself was not persisted as a file** during the session that produced it — a process gap, now closed by this document.

---

## Phase 1 Work Completed

(Full detail, validation steps, and production-verification evidence for each item live in [`SESSION-END-PHASE1.md`](SESSION-END-PHASE1.md) and [`PHASE1_REVIEW.md`](PHASE1_REVIEW.md). Summarized here for the permanent baseline.)

1. **Dark-mode FOUC fix** — head-blocking theme-init script added to all 38 root HTML pages, before any stylesheet.
2. **`_shared/ui.js` cleanup** — removed dead modal-hider code, and five duplicate/conflicting handlers (mobile-menu, header-collapse, lazy-image fade, P/N keyboard nav, theme-color map); file went from 1021 to 908 lines.
3. **`aria-expanded` regression found and fixed** — caught by a dedicated second review pass; fixed by having the canonical `_shared/top-nav.html` handler set the attribute directly (not via an indirect observer), propagated to the 37 menu-bearing pages.
4. **Three orphaned files deleted** (`keyboard-shortcuts.js`, `keyboard-shortcuts.css`, `scroll-to-top.js`) and all references removed.
5. **`sw.js` `CACHE_V` bumped** per project convention.

**Repository state:** committed as `13ed191a` on `main`, tagged `phase1-freeze`, pushed to `origin`, deployed to HostGator, and verified live against jfsn.com (theme-init present, `aria-expanded` correct, deleted files 404, dead code absent from live `ui.js`, `CACHE_V` updated).

---

## Remaining Roadmap

In priority order, consistent with the "Remaining Technical Debt" section above:

1. ~~**Phase 2 (FOUC):** Extend the FOUC fix to the 1,084 generated artwork detail pages.~~ **COMPLETE** — Phase 2B (FOUC), 2026-06-29 (tag `phase2-fouc-freeze`).
2. ~~**JS bundling** — collapse the 21–33 per-page script requests into a single built bundle.~~ **COMPLETE** — Phase 2A, 2026-06-29 (tag `phase2a-freeze`).
3. **CSS split/minify** — get `ui.css` out of the render-blocking critical path; minify it regardless. **(Recommended next phase.)**
4. **`stamp-nav.sh` marker-scheme redesign** — separate the nav-markup span from the sitewide script-bundle span (or replace with a real build-time partial system) so routine nav changes stop carrying clobber risk.
5. **Single rAF-throttled scroll dispatcher** — consolidate the dozen-plus independent `scroll` listeners.
6. **Dual artwork-renderer unification** — requires site-owner input on which system (`artwork.html` vs. generated pages) is canonical.
7. **Animation-module consolidation** — requires site-owner sign-off; this is explicitly the site owner's creative domain per the project's design brief, not a unilateral engineering call.
8. **Smaller items** — redundant `img[loading="lazy"]` CSS rule, brittle P/N selector, TODO/FIXME triage, `package.json` metadata, the spaced filename.

---

## ~~Recommended Phase 2~~ COMPLETE ✅

**Closed 2026-06-29** — Phase 2B (FOUC), commit `0f2d1fbe`, tag `phase2-fouc-freeze`.

The FOUC fix now covers all 1,084 generated artwork detail pages. `gen-artwork-pages.py`'s template was updated with the THEME_INIT script; all future regeners inherit it automatically. See `SESSION-END-PHASE2B-FOUC.md` and `PHASE2-FOUC-PREDEPLOY-REVIEW.md` for the full implementation and review record.

**Recommended next phase: CSS Architecture Cleanup** — `_shared/ui.css` (158KB, render-blocking) is the highest remaining performance item. See "Remaining Roadmap" item 3 above.

---

## Long-Term Recommendations

- **Adopt a real build step** (even a minimal one) that can bundle/minify JS and CSS and inject shared head/nav/footer partials at build time. This single change would make most of the "still open — large, structural" items above tractable, and would retire `stamp-nav.sh`'s riskiest behavior by construction rather than by careful hand-propagation.
- **Resolve the dual artwork-rendering system deliberately, not by accretion.** Decide whether `artwork.html` or the generated `artworks/pages/*.html` is canonical, and make the other a thin redirect or remove it — don't let both keep evolving independently.
- **Treat the animation/effects layer as a first-class system, not a pile of one-off scripts.** The project's own design brief already calls for "a small FIXED set of named primitives" — converging the ~60-module sprawl toward that stated goal (with the site owner directing which primitives survive) is worth a dedicated phase of its own.
- **Keep the audit/fix/regression-review/freeze cycle that Phase 1 used.** Specifically: scope a phase to verifiably safe changes, execute, run a *separate* adversarial review pass looking only for regressions (this caught a real bug Phase 1's own original reasoning missed), then commit/tag/deploy/verify-on-production as one atomic unit. Don't skip the separate review step even when a phase feels low-risk — it found something here.
- **Persist audit findings to a file as they're produced, not only in conversation.** This document exists because that gap was caught after the fact; future audit work should write to a file like this one from the start.
- **Continue verifying claims by execution** (`grep`, `diff`, `curl` against production, live browser checks) rather than trusting prior session notes, comments, or this document's own claims at face value as time passes. Re-check before building on top of anything written here, the same way every fact in this document was re-checked against the live repository and live site immediately before being written down.

---

*This document reflects verified state as of the Phase 1 freeze (commit `13ed191a`, tag `phase1-freeze`). Update it — rather than letting a future phase's findings live only in conversation — as subsequent phases land.*
