# SESSION-START — 2026-06-29

**Written by:** Claude Code, session start  
**Verified against:** live repository (not trusted from docs alone)  
**Method:** Read all key docs, then independently verified claims via git log, grep, and file inspection.

---

## Repository State

| Item | Value |
|---|---|
| Branch | `main` |
| Working tree | **Clean** — no uncommitted changes |
| Remote sync | In sync with `origin/main` |
| Latest commit | `57645885` — Phase 2A closeout docs (2026-06-29) |
| Tags | `phase1-freeze` → `13ed191a`, `phase2a-freeze` → `e938db90` |
| CACHE_V | `jfsn-1782767971` ✅ |
| Live on jfsn.com | Phase 2A deployed 2026-06-29 — **all commits live** |

---

## Documentation Drift Found

**CURRENT_STATE.md § "2026-06-25" still says:**  
> "NONE of the 2026-06-25 work is live on jfsn.com yet (12+ commits sit on origin/main). A deploy-hostgator.sh run ships it."

This was true when written (June 25) but is stale. Phase 2A was deployed on 2026-06-29 via `bash deploy-hostgator.sh`, which mirrors the full working tree to HostGator. Those June 25 commits are live. The note should be removed.

**Verified live via git:** the June 25 v2 rollout commits (`4ef0be71`, `43ebff46`, `5376d490`, `fa9153e3`, etc.) are all present in main and were deployed with Phase 2A. `depth-hero.js` is live in `_shared/` (2453 bytes, dated Jun 25). 13 pages reference it. `timeline.html` is gone. Archive.html simplicity pass is in.

---

## Architecture Summary

**Stack:** Vanilla HTML/CSS/JS. No framework. Static files served from HostGator/cPanel shared hosting.

**Pages:** 38 hand-maintained root HTML pages + 1,084 machine-generated artwork detail pages (`artworks/pages/artNNNN.html`, built by `gen-artwork-pages.py`).

**JS loading (post-Phase-2A):**  
- `anime.min.js` — standalone (vendor, unchanged)  
- `_shared/nav-early.bundle.js` — 8 nav-tier scripts (67,713 bytes)  
- `_shared/nav-late.bundle.js` — 3 nav-tier scripts (71,447 bytes)  
- `_shared/core.bundle.js` — 7 universal scripts (62,552 bytes)  
- Page-specific scripts — individual (depth-hero.js, continuity-transition.js, etc.)
- `nav-active.js` — standalone (preserved; folding it in would collapse pre-existing duplicates)

Net reduction: **15 fewer HTTP requests per stamped page** vs. pre-Phase-2A.

**CSS loading:**  
- `site.min.css` — compiled Tailwind (~22KB) ✅  
- `_shared/ui.css` — **158KB, unminified, render-blocking** ⚠️ (largest open performance item)

**Nav propagation:** `stamp-nav.sh` stamps `_shared/top-nav.html` + `_shared/footer.html` into all 38 root pages. **Critical known risk:** the NAV:START/NAV:END span covers the entire sitewide script bundle, not just markup — page-specific scripts placed adjacent to that block are silently deleted on re-stamp. Always run `git diff --stat` after any `stamp-nav.sh` invocation and check `index.html`'s diff size specifically.

**Two design-token systems** (intentional, by page tier):  
- Stitch/Tailwind light — most pages (bone-white #fcf9f3, deep-ink #0B0B0B, orange-ink #B84700)  
- Material Design light — decade pages 1970s–2020s (`archive-card-img`, `on-tertiary-container`)

**Service worker:** `sw.js` — cache-first AVIF, network-first HTML/CSS/JS/JSON. Must bump `CACHE_V` after any deploy-affecting change; `build_catalog.py` auto-bumps when catalog changes.

---

## Build Process

| Step | Command | When |
|---|---|---|
| Compile CSS | `npm run build:css` | After adding any new Tailwind utility class |
| Bundle JS | `npm run build:js` | After editing any of the 18 source files in `_shared/` |
| Rebuild catalog | `python3 artworks/build_catalog.py` | After catalog/sidecar changes |
| Regenerate artwork pages | `python3 gen-artwork-pages.py` | After template changes (use `--limit 5` to test first) |
| Bump CACHE_V | Edit `sw.js` | After CSS rebuild or any JS/CSS change |

**⚠️ Bundle freshness gap:** The pre-commit hook does NOT check whether JS bundle files are in sync with their source files. Editing any of the 18 bundled `_shared/*.js` files without running `npm run build:js` will commit a stale bundle with no warning. (Deferred since Phase 2A — not yet fixed.)

---

## Deployment Process

```bash
bash session-end.sh          # git commit + push to origin/main + rsync to JEFFS-4TB + B2 cloud backup
bash deploy-hostgator.sh     # FTP mirror to jfsn.com (the only host)
```

HostGator (jfsn.com/cPanel) is the **only host**. Netlify was removed 2026-06-22.  
`.ftp.env` — FTP credentials (gitignored). `FTP_REMOTE=/`.

---

## Current Technical Debt

Ordered by priority per `CODE_QUALITY_AUDIT.md` + `SESSION-END-PHASE2A.md`.

### Large / structural (still open)

1. **FOUC fix not on 1,084 generated artwork pages.** Phase 1 fixed the 38 root pages only. The generated `artworks/pages/artNNNN.html` still flash light-then-dark on load for dark-mode users. Recommended Phase 2 objective per `CODE_QUALITY_AUDIT.md`. Fix requires editing `gen-artwork-pages.py`'s template then running a full regen.

2. **`_shared/ui.css` is 158KB, unminified, render-blocking.** Larger than the entire Tailwind build (22KB). Render-blocking on every page. Phase 2B per `SESSION-END-PHASE2A.md`: split critical/non-critical, minify. Highest remaining load-time item.

3. **`stamp-nav.sh` marker-scheme fragility.** NAV:START/NAV:END span covers the entire sitewide script bundle. Routine nav changes carry clobber risk. Needs restructured markers or a real build-time partial system.

4. **Dual artwork renderer divergence.** `artwork.html` (~25 script tags post-Phase-2A) and `artworks/pages/artNNNN.html` (6 script tags) render the same content via independent templates that have drifted materially. Architecture decision required — not a unilateral engineering fix.

5. **Pre-commit hook doesn't check bundle freshness.** Editing a bundled source file without `npm run build:js` ships a stale bundle silently. The hook only watches `PRECACHE_FILES`; the three bundles aren't in that list.

### Medium (pre-existing, unchanged by Phase 2A)

6. **`audit-nav.sh` false positive on 30 pages.** Literal `search.js` substring check fails on pages where search.js is now inside `nav-early.bundle.js`. Non-fatal (exits 0), but noisy.

7. **Pre-existing duplicate script execution.** Four scripts execute twice on some pages (all pre-Phase-2A, preserved deliberately): `nav-active.js` (×8 pages), `floating-home-button.js` (×4), `accent-transition.js` (×1), `search.js` (×7).

8. **`micro-interactions.js` (1,326 lines) — confirmed dead code.** All 40+ functions are opt-in via classes/IDs (`hero-parallax-image`, `grid-stagger`, etc.) that don't exist in any live HTML. Executes unconditionally on every page via `nav-late.bundle.js` but does nothing. Its `setupScrollToTop()` also references a button class `floating-home-button.js` no longer creates. Open since the June 23 audit; not yet removed.

9. **`analytics.js` silently no-ops.** Sends batched events via `sendBeacon` to `/analytics`, which doesn't exist as a backend. Duplicates GoatCounter's actual job. Low risk, just wasted work.

10. **`image-prefetch.js` fallback path.** One code path guesses `.jpg` instead of `.avif` — failed prefetch, not user-visible.

11. **`ui.css` redundant `img[loading="lazy"]` rule.** Two definitions (~L1685 transition-driven, ~L2815 animation-driven); one unfed by JS since Phase 1. Flagged, not fixed.

12. **`ui.js` P/N keyboard shortcut has no delivery path.** Handler lives in `core.bundle.js` (38 root pages). Its link targets only exist on the 1,084 generated artwork pages, which don't load `core.bundle.js`. May not work in production.

### Small / cosmetic
- 106 TODO/FIXME/DEPRECATED comments across `_shared/*.js`
- Filename with literal space (`me black.gif`)
- `package.json` metadata stale (`"main"`, `"author"`, `"license"`)

---

## Open Items from IMPROVEMENTS.md

- [ ] **Ingest new work** — drop into `artworks/inbox/`, run `bash add-works.sh`
- [ ] **Verify B2 cloud backup** — LaunchAgent scheduled but `~/Library/Logs/jfsn-cloud-backup.log` was empty and last modified 2026-06-15 per CURRENT_STATE.md. Worth checking before any session-end backup relies on it.
- [ ] **Lighthouse mobile run** — one run after recent fixes; capture fresh baseline
- [ ] **Physical artwork dimensions** — actual inches/cm for surviving works; Jeff to measure
- [ ] **Oral history unanswered questions** — see `docs/oral-history/master-notes.md`
- [ ] **`index.html` inline `<style>` (34KB)** — investigated 2026-06-22; not reducible by simple dedup (intentional layering); consider raising `audit-nav.sh` threshold or a deliberate slow refactor
- [ ] **Grid/search/favorites year labels** — still show bare decade year; only artwork detail pages show "(est.)"
- [ ] **archive.html interaction layer consistency** — still carries Session-77 `fc-*` layer; homepage was simplified; flagged for future pass if Jeff asks

---

## Open Risks

| Risk | Severity | Status |
|---|---|---|
| FTP password exposed; cannot be rotated | Medium | Bounded — all public copies removed; on hold per Jeff's direction |
| B2 cloud backup possibly not firing | Medium | Unverified — log empty since 2026-06-15 |
| `stamp-nav.sh` clobber on routine nav changes | Medium | Known, documented, requires manual `git diff --stat` check every run |
| `micro-interactions.js` dead code in every page's nav-late bundle | Low | Confirmed harmless (no matching HTML); just wasted parse/exec |
| `ui.css` 158KB render-blocking on every page | Medium-perf | Open, no immediate fix, highest remaining perf item |

---

## Questions for Jeff

None required before proceeding. The state is fully understood. What would you like to work on?

**Recommended candidates (in priority order from the audit):**

1. **FOUC fix to 1,084 generated artwork pages** — lowest-risk, high-symmetry; closes the gap Phase 1 explicitly left open. One file to edit (`gen-artwork-pages.py` template), one command to run, visual verification.
2. **`ui.css` CSS split / minification (Phase 2B)** — highest remaining perf win. More complex; requires page-by-page visual verification.
3. **Design / motion work** — if Jeff has a specific page or feature in mind.
4. **New work ingest** — if there are photos in the inbox.
