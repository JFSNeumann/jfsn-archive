# Phase 2A — Pre-Deployment Independent Review

**Date:** 2026-06-29
**Reviewer stance:** Treated as an external reviewer of someone else's pull request. Every claim below was re-derived directly from the repository (`git show`, `git diff`, `grep`, `node --check`, fresh browser sessions) during this review — none of it is carried over from the implementing session's own self-reported summary.
**Commits under review:** `4b1095de`, `4fb61445`, `99ce579e` (the three Phase 2A commits, currently local-only — not pushed, not deployed).

---

## Executive Summary

**Recommendation: 🟢 GREEN — APPROVE FOR DEPLOYMENT**

*(Updated after the CACHE_V fix below was applied and independently re-verified. Original recommendation at first pass was 🟡 YELLOW — APPROVE WITH CONDITIONS; the single condition has been satisfied.)*

The implementation is behaviorally sound. Every duplicate, every reordering risk, and every page-cohort was checked exhaustively (not sampled) against the pre-session baseline, and in every case the measured outcome is **identical execution behavior, fewer HTTP requests**. No regression was found in console errors, network failures, accessibility state, or any of the specific interactive systems on the required checklist.

The one condition from the first pass — **`sw.js`'s `CACHE_V` was never bumped** — has been resolved: `CACHE_V` is now `jfsn-1782767971`, applied as its own dedicated commit, and independently re-verified (fresh service-worker install, cache contents inspected directly) rather than just assumed correct. See "CACHE_V Fix — Applied and Verified" below for the full record.

A second pass of validation specifically prompted by this fix (running `audit-nav.sh` surfaced a lead worth chasing) found a **third pre-existing duplicate-script situation** — `search.js` on 7 pages — that the original review's own sweep missed due to a regex bug (it required a `/` before the filename, which a bare `src="search.js"` tag doesn't have). It has been fully verified, exhaustively, to be the same pattern as the other two: pre-existing, unchanged by this work, and harmless in practice (confirmed live: two `#sse-overlay` elements exist on `chromatic.html`, both toggle together, zero console errors, the feature works correctly for the user). Documented below rather than silently folded in.

---

## Files Reviewed

**Added:** `build-js-bundles.js`, `_shared/core.bundle.js`, `_shared/nav-early.bundle.js`, `_shared/nav-late.bundle.js`
**Removed:** `_shared/nav.bundle.js` (superseded same-session artifact, never referenced by any page — see Commit 1 note below)
**Modified (source of truth):** `package.json`, `_shared/top-nav.html`, `_shared/footer.html`
**Modified (propagated, mechanical):** all 38 root `*.html` pages
**Read for context, confirmed untouched across all 3 commits:** `sw.js`, `stamp-nav.sh`, `tools/generators/gen-artwork-pages.py`, every file under `artworks/`, `deploy-hostgator.sh`, `session-end.sh`, `.htaccess`, `audit-nav.sh`, `hooks/pre-commit`, `auto-cache-bump.sh`

---

## Commits Reviewed

### Commit 1 — `4b1095de`: build script + generated bundles (unreferenced)

**Strengths:** Genuinely zero-risk as committed — confirmed no HTML referenced either generated file at this point in history, so this commit cannot have changed any page's behavior. Mirrors the existing `npm run build:css` convention well.

**Risk found:** This commit, taken alone, is **not self-consistent with the final design**. Its `build-js-bundles.js` still includes `_shared/nav-active.js` in `CORE_FILES` and produces a single `_shared/nav.bundle.js` — both corrected two commits later. A `git checkout 4b1095de` followed by `node build-js-bundles.js` today would regenerate the *wrong*, superseded version. Not a deployed regression (nothing pointed at it), but worth naming plainly: this is mid-iteration code, not a finished snapshot. Normal for incremental work; just don't treat commit 1 in isolation as authoritative.

**Possible regressions:** None — confirmed no HTML changed.

### Commit 2 — `4fb61445`: wire `core.bundle.js` into all 38 pages

**Strengths:** The diff is mechanically uniform across all 38 pages (verified, not sampled — see Regression Checklist). The commit message correctly and specifically calls out the `nav-active.js` duplicate-tag discovery and the reasoning for excluding it. `node --check` passes on the bundle.

**Risk found:** None new. Re-verified independently this session: every one of the 38 pages has exactly one `core.bundle.js` tag, and grep across all 38 pages for the 7 bundled filenames as standalone tags returns zero matches.

**Possible regressions:** None confirmed. The nav-active.js duplicate-preservation claim in the commit message was independently re-checked against the pre-session commit (`667edd4a`) for **all 38 pages**, not just the 8 named ones — zero mismatches.

### Commit 3 — `99ce579e`: wire nav-tier bundles, propagate via `stamp-nav.sh`

**Strengths:** The two-bundle split (`nav-early`/`nav-late`) is the strongest engineering decision in this set — it was made specifically to avoid reordering `micro-interactions.js`/`scroll-choreography.js` relative to the two inline `<script>` blocks in `top-nav.html`, and the diff confirms the inline blocks are untouched, byte-for-byte, sitting in their original relative position between the two new bundle tags. The `git diff --stat` clobber-risk check the commit message claims was performed is real and reproducible: re-ran it this session, all 37 stamped pages show the identical 13-line diff shape, `index.html` is not an outlier.

**Risk found (the main finding of this review):** The commit message documents that `floating-home-button.js`'s standalone footer tag was removed because "it's now inside `nav-late.bundle.js`" — true, but **incomplete**: it does not mention that `floating-home-button.js` (4 pages: archive, artwork, chromatic, series) and `accent-transition.js` (1 page: artwork) each have a *second*, page-specific standalone tag, outside the footer/nav span entirely, that this commit did not touch and that now coexists with the bundle. This is the same category of finding as the `nav-active.js` duplicate that commit 2 *did* catch and document — this one wasn't caught during implementation. See Verified Findings below for why it's safe anyway.

**Possible regressions:** None confirmed — see exhaustive verification below. `CACHE_V` was not bumped in this commit (or either of the other two); see Executive Summary.

---

## Verified Findings

### Confirmed Safe

- **All 38 pages have exactly one `core.bundle.js` tag**, and zero remaining standalone tags for any of the 7 files it replaces. (Exhaustive grep, not sampled.)
- **All 37 stamped pages have exactly one `nav-early.bundle.js` and one `nav-late.bundle.js` tag**; `qa.html` has zero of either, by design. (Exhaustive grep.)
- **`anime.min.js` distribution is unchanged**: exactly 1 per stamped page, 0 on `qa.html`.
- **`nav-active.js`'s duplicate-tag count is unchanged on every single page** (38/38 compared against pre-session commit `667edd4a` — zero mismatches, not just the 8 pages named in the commit message).
- **`floating-home-button.js`'s effective execution count is unchanged on every page** (verified 1→0 on 33 pages, 2→1 on the 4 pages with the extra tag, 0→0 on `qa.html` — the "1" or "2" reflects content now living in the bundle plus, where it existed, the untouched extra tag). Confirmed live in-browser on `archive.html`: `document.querySelectorAll('#floating-home-btn').length === 2`, matching the pre-existing duplicate exactly, not a new one.
- **`accent-transition.js`'s effective execution count is unchanged**: only `artwork.html` deviates from the normal 1→0 pattern (2→1), matching its pre-existing extra tag exactly.
- **`search.js`'s effective execution count is unchanged** (found during the CACHE_V fix's validation pass, not the original review — see Executive Summary). 7 pages (`404.html`, `changes.html`, `chromatic.html`, `curatorial-map.html`, `privacy.html`, `style-guide.html`, `wall.html`) have a pre-existing standalone `<script src="search.js" defer></script>` tag outside the nav span, in addition to the copy now inside `nav-early.bundle.js`. Verified against pre-session commit `667edd4a`: all 7 went from 2 tags → 1 tag (the canonical one moved into the bundle; the page-specific extra is untouched) — exactly the `floating-home-button.js`/`accent-transition.js` pattern. Confirmed live on `chromatic.html`: two `#sse-overlay` elements exist, both toggle together on ⌘K with no console errors; the visible/interactive one functions correctly (same "invisible harmless duplicate" shape as `floating-home-button.js`'s two stacked buttons).
- **Generated bundles are byte-correct**: regenerating from current source via `node build-js-bundles.js` during this review produced a zero-diff result against the committed files. All 3 pass `node --check`.
- **Cross-bundle execution order is preserved**: `anime.min.js` → `nav-early.bundle.js` → [inline header-scroll + dark-mode scripts, untouched] → `nav-late.bundle.js` → ... → `core.bundle.js`, confirmed by direct diff of `_shared/top-nav.html` and live `document.querySelectorAll('script[src]')` ordering on `index.html`.
- **`window.showToast` precedence is unchanged**: `core.bundle.js`'s tag still loads after `nav-late.bundle.js`'s tag on every sampled page; live test on `index.html` and `archive.html` confirms `window.showToast(...)` still produces `ui.js`'s exact output (`#jfsn-toast-container`, `toast {type}` class) — `micro-interactions.js`'s competing definition is still overwritten before any call site can reach it, exactly as before.
- **`window.__chromaticBgById` cooperative cache is intact**: confirmed `typeof window.__chromaticBgById === 'object'` on `index.html` and `chromatic.html` after navigation.
- **Mobile drawer + `aria-expanded`**: live-tested open/close on `index.html`; `aria-expanded` correctly toggles `false→true→false`, `aria-hidden` and `display` track correctly.
- **Dark-mode toggle**: live-tested on `index.html`; `html.classList.contains('dark')` correctly toggles and restores.
- **Keyboard shortcuts**: live-tested `?` (opens shortcuts modal), `Escape` (closes it), `⌘K` (opens search overlay) on `index.html` — all fire correctly once dispatched with `bubbles:true` (a flaw in this review's first test attempt, not in the app — see Browser Validation).
- **Toast notifications**: live-tested on `index.html` and `archive.html`.
- **Accessibility (Phase 1 regression surface)**: `THEME_INIT` (the dark-mode FOUC fix) is present and untouched on all 38 pages; `aria-expanded="false"` static default and the `openMenu()`/`closeMenu()` `setAttribute` calls in `top-nav.html` are byte-identical to before.
- **Deployment script compatibility**: `deploy-hostgator.sh`'s `lftp mirror` exclude list (`.git/*`, `.DS_Store`, `node_modules/*`, `qa.html`, `curate.html`, `dedupe.html`, `curate-session.json`, `*.md`, `docs/*`) does not exclude any new bundle file or `build-js-bundles.js`; all will deploy correctly with no script changes needed.
- **`sw.js` is byte-for-byte untouched** across all 3 commits (`git diff --stat` empty for the path across the full range). `stamp-nav.sh`, `tools/generators/gen-artwork-pages.py`, and everything under `artworks/` are likewise confirmed untouched.
- **Rollback safety**: every one of the 18 bundled source files is still present on disk, unmodified, and independently servable.

### Needs Attention

1. **Commit messages under-document three pre-existing duplicates, not two.** Neither the original implementation nor the first pass of this review caught `search.js`'s pre-existing duplicate on 7 pages (see Confirmed Safe) — found only while chasing an `audit-nav.sh` warning during the CACHE_V fix's validation. Verified harmless, same as the other two. Worth adding all three to `build-js-bundles.js`'s comments for the next reader. Not a functional issue; a documentation completeness gap.
2. **`audit-nav.sh` now produces a false-positive "missing search.js" warning on 30 of the 37 bundled pages.** Confirmed by reading the script (`audit-nav.sh:47`): `if 'search.js' not in content:` is a literal substring check against the page's raw HTML — true before bundling (the tag was always present as text), no longer true now that most pages load `search.js`'s code via `nav-early.bundle.js` instead of a tag containing that literal string. The 7 pages with the pre-existing standalone tag (finding 1, just above) don't trigger this warning, which is what surfaced the inconsistency in the first place. Non-blocking: the check is advisory (script still exits 0), and `search.js`'s actual functionality is independently verified working (⌘K, `/`, `?` all live-tested). Same root cause family as finding 3 below — the project's static-analysis tooling doesn't know bundles exist yet.
3. **`hooks/pre-commit` / `auto-cache-bump.sh`'s hardcoded file lists don't know about the new bundles.** Worth a future tooling update (add `_shared/core.bundle.js`, `_shared/nav-early.bundle.js`, `_shared/nav-late.bundle.js` to both lists, and reconsider `audit-nav.sh`'s search.js check) so a *future* edit to a bundled source file gets the same automatic protection `ui.js` used to have. Explicitly **not** proposed as part of this fix — touching these scripts is its own small change, separate from Phase 2A's JS-bundling mandate.

### Could Not Verify

- **Visual/pixel confirmation of the chromatic ambient-tint color actually changing on scroll.** Confirmed the cooperative cache (`window.__chromaticBgById`) populates correctly and the three consuming files are present and correctly ordered, but did not capture a before/after screenshot of the tinted background color itself — this requires scroll-triggered `IntersectionObserver` callbacks that are timing-sensitive in a headless eval context. Low risk: the underlying mechanism (file presence, cache population, no console errors on the pages that use it) is verified; only the final paint step is unconfirmed.
- **Live production behavior under HTTP/2 + real `mod_deflate` gzip** for the *new* bundle files specifically. The gzip ratios used in `BUNDLE_PLAN.md` §8 were measured against the *old* individual files on production; the new bundle files have not yet been deployed, so their actual on-the-wire compressed size is an estimate, not a measurement, until a real deploy happens.

---

## CACHE_V Fix — Applied and Verified

**Change:** `sw.js`'s `CACHE_V` updated from `jfsn-1782700000` to `jfsn-1782767971`, with an updated comment (`// Phase 2A: JS bundling (core/nav-early/nav-late bundles)`). One line changed, nothing else in `sw.js` touched — confirmed by diff (`git diff sw.js` shows exactly this one line).

**Validation performed, independently, not assumed:**
- `audit-nav.sh`: exits 0; explicitly reports `✅ sw.js: CACHE_V is current (0d old)`.
- **Service worker install, tested from a clean slate**: unregistered all existing service workers and deleted all caches in the preview browser, then navigated to `index.html`. `navigator.serviceWorker.getRegistration()` resolved with `state: "activated"` — the install→activate lifecycle completed successfully against the new `sw.js`.
- **Cache identity confirmed**: `caches.keys()` returns exactly `["jfsn-1782767971"]` — the new `CACHE_V` value, not a stale one, and old caches were not left behind (the `activate` handler's prune-old-caches logic ran correctly).
- **Bundle caching confirmed, with a real subtlety surfaced and resolved**: immediately after the very first (registering) navigation, the new bundle files were **not yet** in the cache — `hasCore`/`hasNavEarly`/`hasNavLate` all `false`. This is correct, expected service-worker behavior, not a bug: the page that triggers a service worker's first registration is not controlled by it for its own sub-resource fetches, so those first requests bypass the fetch handler entirely. A second navigation (now under SW control, confirmed via `navigator.serviceWorker.controller`) was performed, and the recheck showed all three bundle files present in the cache (174 total entries, up from the 58-entry `PRECACHE` baseline) — confirming the network-first-and-cache-as-you-go runtime path works exactly as `BUNDLE_PLAN.md` §9 predicted for files not in `PRECACHE`.
- **Console clean** throughout every step of the above (checked with `level: 'error'` after each navigation).
- `pre-deploy-check.sh`'s first gate ("no uncommitted changes") was deliberately not satisfied until after the dedicated commit below — see Final Recommendation for that script's full, post-commit run.

---

## Regression Checklist

| Item | Status |
|---|---|
| Execution-order regression (anime.min.js before its 16 dependents) | **Verified safe** — tag order preserved exactly, confirmed via diff + live DOM order |
| Execution-order regression (nav-early/inline/nav-late relative order) | **Verified safe** — inline scripts byte-identical, sitting in original relative position |
| `window.showToast` collision outcome change | **Verified safe** — `ui.js`'s version still wins, confirmed live on 2 pages |
| `window.__chromaticBgById` cooperative cache broken | **Verified safe** — object present, no console errors on chromatic-heavy pages |
| New duplicate execution introduced | **Verified safe** — every duplicate found (`nav-active.js` ×8, `floating-home-button.js` ×4, `accent-transition.js` ×1, `search.js` ×7) is pre-existing and unchanged, confirmed against pre-session git history for all 38 pages |
| Race condition from reordering relative to inline scripts | **Verified safe** — confirmed no capture-phase listeners in any of the 11 nav-tier files, and the only header/dark-mode-class references in them are inside deferred event callbacks (scroll/intersection), not top-level code, so timing relative to the 2 inline scripts is irrelevant |
| HTML structural breakage (broken tags, stray fragments) | **Verified safe** — all sampled diffs are clean; orphaned "Phase 1/2/3/4 Enhancement Scripts" HTML comments remain (cosmetic only, pre-existing comment markers with nothing under some of them now) |
| `stamp-nav.sh` clobber risk | **Verified safe** — re-ran the project's own documented check, all 37 pages show identical diff shape, `index.html` not an outlier |
| Generated bundle drift from source | **Verified safe** — fresh regeneration during this review is byte-identical to committed bundles |
| `sw.js` PRECACHE staleness (`ui.js`, `search.js` entries) | **Verified, not blocking** — entries are stale-but-harmless (files still exist, still resolve 200); confirmed live this session that the new bundles populate the runtime cache correctly on the first SW-controlled fetch |
| `CACHE_V` not bumped | **Resolved** — bumped to `jfsn-1782767971`, independently re-verified (fresh install, correct cache identity, bundles confirmed cached) |
| Accessibility (`aria-expanded`, FOUC) | **Verified safe** — both confirmed byte-identical/functionally identical to pre-session state |
| Deploy script compatibility | **Verified safe** — exclude patterns checked, no conflicts |

---

## Browser Validation

Fresh preview-server session (not reused from the implementing session), `python3 -m http.server` per `.claude/launch.json`:

- **`index.html`**: console clean, zero failed network requests, `core.bundle.js`/`nav-early.bundle.js`/`nav-late.bundle.js` all 200 OK. Live-tested: `?` shortcuts modal (first attempt with `document.dispatchEvent(..., {key:'?'})` and no `bubbles:true` produced a false negative — corrected to `document.body.dispatchEvent(..., {bubbles:true})`, which then worked; noted here because it's a reminder that a "could not reproduce" result needs a second look at the test itself before it's trusted), `Escape` close, `⌘K` search open, mobile-drawer open/close with `aria-expanded` tracking, dark-mode toggle with restore, `window.showToast(...)` producing `ui.js`'s exact DOM signature.
- **`archive.html`**: console clean, zero failed requests. Confirmed `document.querySelectorAll('#floating-home-btn').length === 2` (the pre-existing duplicate, unchanged). `window.showToast(...)` retested, correct.
- **`artwork.html?id=art0001`**: console clean, zero failed requests, correct title rendered. Confirmed `nav-active.js` tag count = 2 and `accent-transition.js` tag count = 1 (both matching the pre-existing-duplicate arithmetic exactly).
- **`1980s.html`** (decade page): console clean, zero failed requests, all 3 bundle tags present.
- **`targets.html`** (theme page): console clean, zero failed requests.
- **`qa.html`**: console clean, zero failed requests, exactly 3 external scripts (`core.bundle.js`, `nav-active.js`, `hover-preview.js`) — matches the intended qa.html-specific composition exactly.
- **`chromatic.html`**: console clean, zero failed requests (checked during implementation validation; re-confirmed `nav-active.js` duplicate present and `canvas` element renders).

---

## Performance Comparison

| Metric | Before | After | Matches expectation? |
|---|---|---|---|
| Common-tier requests, 37 stamped pages | 19 (7 core + 11 nav + 1 vendor) | 4 (3 bundles + 1 vendor) | Yes — 15 fewer per page, matches `BUNDLE_PLAN.md`'s request-reduction goal |
| Common-tier requests, `qa.html` | 7 | 1 | Yes — 6 fewer |
| `index.html` total external scripts | 29 | 14 | Matches arithmetic exactly (29 − 15) |
| Raw bytes, 18 bundled source files | 199,529 | 201,712 (3 bundle files) | **Slightly larger, not smaller** — expected and explicitly called out in `BUNDLE_PLAN.md` §8: concatenation adds banner/section-marker overhead; bundling's win here is request count, not byte count. The +2,183 bytes is exactly that overhead, nothing unexplained. |
| Bundle count (common tier) | 18 files | 3 files | As planned |

The measured numbers match `BUNDLE_PLAN.md`'s predictions closely, including its own explicit caveat that the byte-count "win" would be negligible-to-flat. No surprise in either direction.

---

## Maintainability Review

**Net positive, with one new process dependency that isn't yet tooled.**

Positive: 18 small, individually-named files collapsed into 3 generated artifacts with a real build step (`npm run build:js`), mirroring the project's existing `build:css` convention. Source files are unmodified and still the thing a future session edits — the bundle is clearly banner-marked as generated, non-editable output. This is a meaningfully smaller mental model for anyone reasoning about "what loads on this page" going forward, and the explicit, code-commented rationale for *why* the nav tier is two bundles (not one) and why `nav-active.js` is excluded will save a future session from re-discovering both the hard way.

The new risk: editing any of the 18 now-bundled source files requires remembering to run `npm run build:js` afterward, or the live bundle silently drifts from source. Unlike CSS (`hooks/pre-commit` actively rebuilds and diffs `site.min.css` on every commit), **nothing currently enforces this for JS bundles** — a future edit to, say, `_shared/ui.js` without re-running the build script would commit cleanly and ship a stale bundle with no warning. This is the single most important latent maintainability gap this review surfaces, and it's a direct consequence of the CACHE_V finding's root cause: the project's safety tooling was built around a flat list of individually-tracked files and hasn't been taught about bundles yet.

---

## Rollback Review

**Yes — cleanly, provided the three commits are reverted in reverse order.**

No source file was ever modified or deleted; every change is additive (new files) or a swap of `<script>` tag references. Reverting `99ce579e` restores `top-nav.html`/`footer.html` and the 37 stamped pages to their individual nav-tier tags; reverting `4fb61445` restores the Core-tier tags on all 38 pages; reverting `4b1095de` removes the now-unreferenced build script and bundle files. Because commit 1 alone is not self-consistent with the final state (see Commit 1 review above), reverting must happen as a stack (3 → 2 → 1), not arbitrarily — but that's exactly how `git revert` of a linear history naturally works, so this isn't a practical obstacle, just a fact worth knowing before anyone tries to cherry-pick a partial rollback.

---

## Final Recommendation

### APPROVE FOR DEPLOYMENT

The single condition from the first pass — bump `CACHE_V` — is applied (commit `961ddb59`, `sw.js` only, one line) and independently re-verified: `audit-nav.sh` reports it current, a from-scratch service-worker install reaches `activated` under the new cache name, and a second SW-controlled navigation confirms all three new bundle files land in that cache via the existing runtime fetch-and-cache path. Zero console errors at every step.

Two things surfaced *while* verifying the fix, both already folded into this document and neither a reason to withhold approval:
- A third pre-existing duplicate-script pattern (`search.js` on 7 pages), missed by this review's first pass due to a regex bug, now fully verified as pre-existing and harmless — same shape as the other two.
- `audit-nav.sh`'s "missing search.js" warning is a now-expected false positive (literal substring check, doesn't know about bundling), non-blocking, explained above.

Neither requires a code change under this phase's mandate, and neither was introduced by this work — both are pre-existing site characteristics this review happened to be thorough enough to notice.

**Four commits now make up Phase 2A, ready as a unit:**

| Commit | Content |
|---|---|
| `4b1095de` | Build script + generated bundles (unreferenced) |
| `4fb61445` | Core-tier bundle wired into all 38 pages |
| `99ce579e` | Nav-tier bundles wired via `top-nav.html`/`footer.html` + `stamp-nav.sh` |
| `961ddb59` | `CACHE_V` bump (this fix) |

**Not required, but recommended for a future, separate pass (no action requested, none taken):**
- Add the `floating-home-button.js`/`accent-transition.js`/`search.js` pre-existing-duplicate notes to `build-js-bundles.js`'s comments, alongside the existing `nav-active.js` note.
- Add the 3 new bundle filenames to `hooks/pre-commit`'s and `auto-cache-bump.sh`'s `PRECACHE_FILES` lists, and reconsider `audit-nav.sh`'s `search.js` substring check, so future edits to bundled source get the same automatic protection `ui.js` used to have.

This is the next frozen baseline.
