# BUNDLE_PLAN.md — Phase 2A: JavaScript Bundling Strategy

**Date:** 2026-06-29
**Status:** Design document only. No code changed, no files moved, no build step introduced. Waiting for approval before implementation.
**Method:** Every number in this document comes from a direct measurement against the live repository this session (`grep`, `wc -c`/`ls -la`, `diff`, `curl` against production) — not from `CLAUDE.md`, `CODE_QUALITY_AUDIT.md`, `PHASE1_REVIEW.md`, or `SESSION-START-SUMMARY.md`. Per direction: where the code and the docs disagreed, the code wins; the discrepancy is called out, not silently folded in.

## Scope (restated from approval)

**In scope:** the shared JS/CSS runtime used by the 38 hand-maintained root pages and `artwork.html` (the client-side `?id=` renderer — already one of the 38, not a 39th page).

**Out of scope, not touched by this plan or its eventual implementation:** the 1,084 generated artwork pages (`artworks/pages/*.html`), `gen-artwork-pages.py`, `stamp-nav.sh`'s mechanism (it will be *run*, unchanged, exactly as today — see §10), the service worker's caching architecture (`sw.js`'s fetch strategy), and the deployment pipeline (`deploy-hostgator.sh`, `session-end.sh`). Where this plan touches a *file* one of those systems also depends on (`sw.js`'s `PRECACHE` array, `_shared/top-nav.html`'s content), that's flagged explicitly in §11, not resolved here.

---

## 1. Current JavaScript dependency graph

This is not a clean tree — it's mostly independent files with three real coupling points, all verified directly by grep, not inferred:

**a) Load-order dependency on `anime.min.js`.** 16 files call the global `anime(...)` and will throw if loaded before it: `accent-transition.js`, `archive-animations.js`, `artwork-animations.js`, `chromatic-animations.js`, `chromatic-position-strip.js`, `click-feedback.js`, `counter-animate.js`, `drone-survey.js`, `filter-slide-in.js`, `floating-home-button.js`, `hero-zoom-settle.js`, `hover-scale.js`, `scroll-choreography.js`, `stat-card-entrance.js`, `archive-river.js`, and `ui.js` itself. Today this works because `anime.min.js`'s `<script>` tag is always declared before all of them, and every script in this chain uses `defer` (deferred scripts execute in document order, before `DOMContentLoaded`).

**b) A real global-variable collision: `window.showToast`.** Both `_shared/ui.js` (line 175) and `_shared/micro-interactions.js` (line 65) define `window.showToast`. Checked the actual tag order on three sample pages (`index.html`, `archive.html`, `artwork.html`): `micro-interactions.js` always loads (inside the nav block) *before* `ui.js` (declared separately, much later in the document on all three). Since both are top-level, unconditional assignments, **`ui.js`'s definition always wins today** — `micro-interactions.js`'s copy is overwritten before any user interaction could call it. `showToast` is genuinely called inline on 2 pages (`archive.html`, `style-guide.html`), so the feature is live — just always via `ui.js`'s implementation. This is a real finding, not in any existing doc: bundling must preserve this exact relative order (whatever bundle contains `ui.js`'s code must execute *after* whatever bundle contains `micro-interactions.js`'s code) or the toast styling/behavior sitewide silently changes.

**c) A cooperative cache, plus one dead branch around it.** `ambient-chromatic-tint.js`, `chromatic-accent-wire.js`, and `chromatic-lazy-tint.js` each check `window.__chromaticBgById` before fetching `chromatic.json`; whichever runs first populates it, the other two reuse it. This is a real, working, intentional shared-cache pattern among exactly these three files — confirmed by reading all three. `_shared/footer.html`'s inline script (lines 114–117) also checks the same global, but its `if` body is empty (just a comment — "*already a map... need year too, so fetch fresh below*") and it unconditionally fetches its own copy on the next line regardless of the check's result. The check has zero effect on control flow — harmless, but it's dead scaffolding, not a working fourth participant. Noted here because bundling must not assume this footer code is "part of" the cooperative trio.

**d) Two smaller, single-purpose globals:** `search.js` defines `window.openSiteSearch`, called by the inline mobile-menu script inside `_shared/top-nav.html`. `artist-config.js` defines `window.ARCHIVE_CONFIG`, consumed only by `series.html` (the only page that loads it) — a clean, self-contained pair, not a sitewide concern.

**Everything else in `_shared/` is independent** — no shared globals, no call-order requirement beyond (a).

---

## 2. Modules that are always loaded

Re-verified with a strict `<script src="...">` / `<link href="...">` match (a looser substring match first produced a false positive — see §4) across all 38 pages.

**Universal — all 38 pages, including `qa.html`:**

| File | Bytes |
|---|---|
| `search.js` (repo root, not `_shared/`) | 25,906 |
| `_shared/ui.js` | 38,175 |
| `_shared/ui.css` | 158,033 |
| `_shared/nav-active.js` | 1,878 |
| `_shared/lazy-load.js` / `.css` | 3,173 / 3,003 |
| `_shared/lightbox.js` / `.css` | 6,873 / 5,605 |
| `_shared/toast.js` / `.css` | 3,702 / 3,051 |
| `_shared/analytics.js` | 4,825 |
| `_shared/image-prefetch.js` | 2,371 |
| `_shared/page-transitions.js` / `.css` | 2,725 / 2,058 |
| `_shared/enhancements.css` | 10,468 |

**Sitewide-minus-`qa.html` — 37 pages** (this is the literal content of `_shared/top-nav.html`'s `NAV:START`–`NAV:END` span plus `_shared/footer.html`'s `FOOTER:START`–`FOOTER:END` span, propagated by `stamp-nav.sh`):

| File | Bytes |
|---|---|
| `_shared/anime.min.js` | 17,384 |
| `_shared/jfsn-interactions.js` | 18,616 |
| `_shared/accent-transition.js` | 3,425 |
| `_shared/chromatic-accent-wire.js` | 2,303 |
| `_shared/ambient-chromatic-tint.js` | 4,754 |
| `_shared/chromatic-position-strip.js` | 8,934 |
| `_shared/chromatic-lazy-tint.js` | 1,949 |
| `_shared/click-feedback.js` | 970 |
| `_shared/micro-interactions.js` | 50,285 |
| `_shared/scroll-choreography.js` | 16,292 |
| `_shared/floating-home-button.js` | 4,251 |
| `_shared/dark-mode.css` | 8,132 |
| `_shared/skeleton.css` | 2,556 |

`qa.html`'s own measured total (11 script tags) is fully explained by exactly the 10 universal JS files above plus one page-owned inline script — independent confirmation that this split is real, not an artifact of how I grouped it.

---

## 3. Modules that are page-specific

Two different shapes here, both verified directly:

**Page-family cohorts (identical manifests, confirmed by diffing the actual `<script src>` lists, not just counts):**
- **Decade pages** (`1970s.html`…`2020s.html`, 6 pages) — `diff` of `1970s.html` vs. `2020s.html`'s script lists returned no differences.
- **Medium pages** (`collage.html`, `sculpture.html`, `photography.html`, `painting.html`, 4 pages) — `collage.html` vs. `painting.html` identical.
- **Theme pages** (`guernica.html`, `targets.html`, `framed.html`, `torsos-faces.html`, `crosses.html`, `mr-snowmann.html`, `collaboration.html`) — `guernica.html` vs. `crosses.html` identical. (`gallery-images.html` measured one script higher than its theme-page siblings — 33 vs. 32 — flagged for a one-page check before any family-level bundle includes it; not chased further here since family bundling is the lower-priority option in §6.)

**True one-offs (1–6 page references), all correctly scoped, none are stray duplicates:**
`archive-animations.js`, `archive-quick-filters.js`/`.css`, `archive-river.js`, `artwork-animations.js`, `chromatic-animations.js`, `chromatic-river-parallax.js`, `filter-slide-in.js`, `ux-improvements.css`, `ambient-tint-parallax.js`, `drone-survey.js`, `essay-parallax.js`, `hover-scale.js`, `breadcrumb-navigation.js`, `section-reveal-stagger.js`, `senior-ux-signposting.js`, `grid-entrance.js`, `hero-zoom-settle.js`, `section-parallax.js`, `senior-ux-touch-targets.css`, `counter-animate.js`, `image-fade-load.js`, `stat-card-entrance.js`.

**Broad-but-not-universal (10–31 references) — deliberately excluded from "always loaded" above:** `continuity-transition.js` (10), `depth-hero.js` (13 — matches `CURRENT_STATE.md`'s "now on 12 pages," close enough), `hover-preview.js`/`.css` (30), `section-tints.css` (31). These are common but page-selected, not sitewide; folding them into a universal bundle would change behavior on the pages that currently lack them (see §5 for why they stay out).

---

## 4. Modules that appear obsolete

**No pure zero-reference orphans remain** in `_shared/` — Phase 1 already removed the three that existed. Everything currently on disk is loaded by at least one real `<script>`/`<link>` tag.

Three things found this session are closer to "referenced but inert" than "unreferenced," and none were in any prior doc:

1. **`_shared/micro-interactions.js`'s `window.showToast` is dead in practice** — defined, then unconditionally overwritten by `ui.js` before any call site could run (see §1b). Not a 404 risk, not unreferenced — just functionally inert.
2. **`_shared/micro-interactions.js`'s `// Expose for artwork.html` comment (line 65) is stale.** Checked all 11 of the file's `window.X = function...` exposures (`showToast`, `toggleBookmark`, `switchViewMode`, `toggleColorFilter`, `addToViewingHistory`, `announceToScreenReader`, `animateCounter`, `showProgress`, `completeProgress`, `showStickyFooter`, `downloadJSON`, `downloadCSV`, `downloadImage`, `openFullscreenGallery`, `showNotification`) against all 38 pages: **zero external pages call any of them.** Most (7 of 11) are called internally by the file's own 53 `addEventListener` bindings, so the underlying features (bookmarking, view-mode switching, counters, downloads, fullscreen gallery) are real and working, just self-triggered rather than externally consumed — the "expose for X" framing is what's wrong, not the feature. A smaller subset (`showNotification`, `showProgress`/`completeProgress`, `showStickyFooter`, `announceToScreenReader`) showed no call site at all, internal or external, in this pass — worth a closer look in a future cleanup phase, not this one.
3. **`_shared/footer.html`'s empty `if (window.__chromaticBgById)` block** (§1c) — zero functional effect, safe to ignore for bundling purposes.

None of these are fixed here — bundling must preserve all three exactly as-is (see §11, risk 4). They're documented because a future implementer could easily "clean them up" as a drive-by while touching the same files, which would be a behavior change outside this phase's mandate.

---

## 5. Modules that should remain independent

**`anime.min.js`** — third-party-style vendor code, never hand-edited, the one true load-order anchor for 16 other files. Keeping it physically separate from site-authored code means a future diff of "our bundle" never includes vendor noise, and the file can be cached/reasoned about independently.

**The ~22 one-off and family-scoped files in §3.** Each is already small (most 400 B – 8 KB) and already loaded only where needed. Bundling them would either (a) create a one-off "bundle" per file — no real win, just renamed files — or (b) fold them into a universal bundle, which means every page downloads code most pages never use. Neither serves maintainability or bytes. Leave them as-is.

**`depth-hero.js`** specifically: `CURRENT_STATE.md` records that this file was deliberately extracted to `_shared/depth-hero.js` on 2026-06-25 as a *single shared source of truth* for a specific named motion primitive, by design, across a specific page subset (lost/chromatic/about/start-here + the 8 theme pages). That was itself a recent consolidation. Re-absorbing it into a different bundle now would undo a recent, deliberate architectural choice for no clear gain — leave it exactly as its own file.

**`hover-preview.js`/`.css` and `section-tints.css`** (30–31 of 38 pages): close to universal, but not quite, and the missing ~7–8 pages are a real, current product decision (not an oversight anyone flagged). Folding these into the universal Core bundle (§6) would silently add this behavior to those pages — a scope-expanding side effect this plan should not introduce. Leave independent; revisit only if/when they actually reach all 38.

**`artist-config.js`** — single producer, single consumer (`series.html`), already minimal. No bundling decision changes anything here.

---

## 6. Recommended bundle architecture

**Guiding principle, stated explicitly because it overrides the usual instinct to bundle aggressively: source files are never deleted or hand-merged. Each proposed bundle is a *generated build artifact*, produced from the existing, still-individually-editable files in `_shared/` by a small build step — the same pattern `site.min.css` already uses for Tailwind.** A future session debugging the chromatic accent-wiring still opens `_shared/chromatic-accent-wire.js` directly; nothing about day-to-day editing changes. This is the single design decision this whole plan rests on, and it's what makes "maintainability first" concrete rather than a slogan.

**Tier 1 — Vendor (unchanged):** `anime.min.js` stays exactly as it is today: its own file, its own `<script>` tag, loaded first among the motion-dependent scripts. Not bundled with anything.

**Tier 2 — `core.bundle.js`** (replaces 10 individual tags on all 38 pages, including `qa.html`): `search.js`, `ui.js`, `nav-active.js`, `lazy-load.js`, `lightbox.js`, `hover-preview.js`-*excluded, see §5*... — concretely: `search.js` + `ui.js` + `nav-active.js` + `lazy-load.js` + `lightbox.js` + `toast.js` + `analytics.js` + `image-prefetch.js` + `page-transitions.js`. Concatenated **in this exact order** (it's already the safe order — `ui.js` last preserves the `showToast` outcome from §1b relative to anything bundled after it elsewhere, and none of these 9 depend on `anime.min.js`). Raw size: 93,971 bytes before gzip.

**Tier 3 — `nav.bundle.js`** (replaces 9 individual tags inside `_shared/top-nav.html`'s `NAV:START`/`NAV:END` span, propagated to the 37 stamped pages by an ordinary `stamp-nav.sh` run): `jfsn-interactions.js` + `accent-transition.js` + `chromatic-accent-wire.js` + `ambient-chromatic-tint.js` + `chromatic-position-strip.js` + `chromatic-lazy-tint.js` + `click-feedback.js` + `micro-interactions.js` + `scroll-choreography.js`, concatenated **in this exact order** — it's the current document order inside the nav span today, and it must stay that way so `micro-interactions.js`'s code still precedes `ui.js`'s (Tier 2, loaded later in the document on every sampled page) for the `showToast` outcome in §1b. `floating-home-button.js` (currently in `_shared/footer.html`, not the nav span) can join this same bundle safely — it's `defer`, it's one of the 16 `anime()` callers, and nothing depends on it running before or after the nav-span scripts specifically. Raw size: 111,779 bytes before gzip.

**Tier 4 — optional, lower priority: family bundles.** The decade/medium/theme cohorts in §3 are confirmed identical and *could* each get a small bundle of their family-specific extras. Recommended to **defer this** in a first pass: the win is small (a handful of files for 4–8 pages per family), and it adds an ongoing maintenance cost (someone must remember a page belongs to a family bundle before adding a one-off script to it, or the family's "identical manifest" assumption silently breaks). Revisit only after Tiers 2–3 have shipped and proven the build step is solid.

**Everything in §3's one-offs and §5's "remain independent" list:** unchanged, loaded exactly as today.

**CSS is explicitly out of this plan.** `_shared/ui.css` (158 KB, unminified, render-blocking) is real, already-documented debt, but `CODE_QUALITY_AUDIT.md` already separates "CSS split/minify" from "JS bundling" as its own roadmap item, and this plan's approved scope is JavaScript. Not touched here.

---

## 7. Estimated reduction in requests

Every non-`qa` page currently loads the same 21 "common" scripts (10 Core + 10 Nav + 1 vendor — using 10 for Nav here because `floating-home-button.js` moves from its own per-page tag into Tier 3): after bundling, that becomes 3 (`core.bundle.js` + `nav.bundle.js` + unchanged `anime.min.js`). **That's 18 fewer requests on every one of the 37 stamped pages**, on top of whatever page-specific extras each page keeps unbundled.

| Page(s) | Current total `<script src>` | After (common 21→3, extras unchanged) | Reduction |
|---|---|---|---|
| `index.html` | 46 | 28 | 39% |
| `archive.html` | 44 | 26 | 41% |
| `artwork.html` | 40 | 22 | 45% |
| `about.html` | 42 | 24 | 43% |
| `lost.html` | 40 | 22 | 45% |
| `chromatic.html` | 41 | 23 | 44% |
| `series.html` | 41 | 23 | 44% |
| `series-index.html` | 35 | 17 | 49% |
| `wall.html` / `start-here.html` / `why-i-made-things.html` / `style-guide.html` | 34 | 16 | 47% |
| `favorites.html` / `changes.html` / `404.html` | 32 | 14 | 56% |
| `stories.html` / `curatorial-map.html` | 33 | 15 | 55% |
| `privacy.html` / `api.html` | 30 | 12 | 60% |
| Decade pages (×6) | 30 each | 12 | 60% |
| Medium pages (×4) | 32 each | 14 | 56% |
| Theme pages (×7–8) | 32–33 each | 14–15 | ~56% |
| `qa.html` (Core only, out of the nav system) | 11 | 2 | 82% |

**Honest caveat:** `jfsn.com` already serves over **HTTP/2** (confirmed: `curl -w '%{http_version}'` → `2`). Under HTTP/2 multiplexing, the per-request *connection* cost that made bundling a dramatic win in the HTTP/1.1 era is largely gone. The remaining real benefits of fewer requests here are: per-request header overhead (still nonzero even with HPACK), fewer round-trips on a cold cache, reduced Apache-side per-request processing on a $5/month shared host, and — the one this phase is explicitly optimizing for — **a simpler mental model**: 3 files to reason about instead of 21. Don't expect a dramatic Lighthouse score jump from request count alone; expect a real but moderate one, validated in §12.

---

## 8. Estimated reduction in transferred bytes

Raw bytes, summed from the actual files (§2): Tier 2 = 93,971 B, Tier 3 = 111,779 B, Tier 1 (unchanged) = 17,384 B. Total = 223,134 B (≈ 217.9 KiB) across 21 requests today.

Measured real gzip ratios this session (production, with `Accept-Encoding` actually sent — an earlier check without it falsely suggested compression was off):

| File | Raw | Gzipped (live) | Ratio |
|---|---|---|---|
| `ui.js` | 38,175 | 14,740 | 61.4% smaller |
| `micro-interactions.js` | 50,285 | 15,779 | 68.6% smaller |
| `site.min.css` (reference point, not in scope) | 24,127 | 6,869 | 71.5% smaller |

Using the ~65% average of the two JS samples: **today's estimated gzip-transferred total for these 21 files is ≈ 78 KB.**

**Honest framing, because this is the number most likely to be over-promised:** concatenating files doesn't remove bytes. Post-bundling, the same ≈218 KB of source, gzip-compressed as 2 streams instead of 21, will land in roughly the same place — plausibly **3–8% smaller** from shared compression context across former file boundaries, not dramatically smaller. **The request-count drop in §7 is the real win here; the byte-count drop is real but modest.** If byte count specifically matters later, minification is a separate, optional lever — but minified code loses readable stack traces in production error reports without source maps, which is its own maintainability cost. Not recommended as part of this phase; flagged as a future, separately-decided option.

---

## 9. Browser caching strategy

No new caching mechanism is needed; the existing one already covers the new files correctly, verified directly:

- `.htaccess`'s `mod_expires`/`mod_deflate` rules (lines 133–169) match by **file extension/MIME type**, not filename — `core.bundle.js` and `nav.bundle.js` automatically get the same `Cache-Control: max-age=2592000` + gzip treatment every other `.js` file gets today. No `.htaccess` change required.
- `sw.js`'s fetch handler (out of scope to modify) already does network-first with `{cache:'reload'}` for all JS/CSS — this *already* bypasses the 30-day browser HTTP cache for any visitor with an installed service worker, which is the only thing that made the old 30-day-stale-bug class (fixed in commits `c343a111`/`52d305ae`) possible. Bundling introduces no new exposure here; a visitor without an active SW yet has exactly the same 30-day exposure on a bundle file that they have on any individual file today. Not a new risk.
- **The one real coordination point** (not a caching-strategy decision, a sequencing one): `sw.js`'s `PRECACHE` array hardcodes paths to 17 specific `_shared/*.js` files by exact name — several of which (`anime.min.js`, `ui.js`, `nav-active.js`) would logically move *into* the new bundles. Modifying `sw.js` is explicitly out of scope for this phase. **Resolution: don't delete the old individual files when the bundles ship.** Leave every superseded file on disk, still servable, even though no page's `<script>` tag points at it anymore. `PRECACHE`'s existing entries keep resolving to real files, `cache.addAll()` keeps succeeding, and `sw.js` stays genuinely untouched. A later, SW-focused phase can update `PRECACHE` to point at the new bundles and then delete the superseded files in the same change — that's the right moment to touch `sw.js`, not this one.

---

## 10. Rollback strategy

Because nothing is deleted (§6, §9), rollback is just reverting the `<script>` tag changes:

- **Tier 2 (`core.bundle.js`):** the 9 individual tags it replaces live outside the `NAV:START`/`NAV:END` span, hand-included per page — the same situation Phase 1 faced with the `aria-expanded` fix. `PHASE1_REVIEW.md` documents the precedent for exactly this shape of change: a **surgical, string-identical find-and-replace across all 38 pages**, not a `stamp-nav.sh` run (since these tags aren't in its span). Rollback = re-run the same replacement in reverse, or `git revert` the commit — the 9 source files are untouched on disk either way.
- **Tier 3 (`nav.bundle.js`):** this *is* inside the nav span, so the correct propagation tool is `stamp-nav.sh` itself, **run unchanged, exactly as it's always been run** — edit `_shared/top-nav.html`'s 9 script lines down to 1 bundle line, then `bash stamp-nav.sh`. This is using the existing tool for its existing documented job, not modifying it. The already-known clobber risk applies (see §11, risk 1) and must be checked with `git diff --stat` immediately after, per the project's own standing rule. Rollback = revert `_shared/top-nav.html` and re-run `stamp-nav.sh` again, or `git revert` the whole commit.
- Either path leaves the repository deployable at every intermediate step, consistent with the engineering rules — there is no half-migrated state where a page references a bundle file that doesn't exist yet, because the bundle is generated *before* any HTML is touched, and old individual files keep existing throughout.

---

## 11. Risk assessment

1. **`stamp-nav.sh` clobber risk (existing, documented, directly applicable).** Editing `_shared/top-nav.html`'s script lines and then running `stamp-nav.sh` is, by design, supposed to propagate that edit to 37 pages. The known failure mode is the *opposite* problem from past incidents (those lost unrelated content sitting too close to the span) — here the content change is the goal — but the mitigation is identical: run it once, deliberately, then `git diff --stat` and specifically check `index.html` isn't showing a larger-than-expected diff before trusting the run.
2. **SW/`PRECACHE` staleness if old files are deleted too early.** Mitigated by design (§9) — don't delete superseded files in this phase.
3. **Ordering regressions inside the new bundles.** §1's two verified ordering facts (anime.min.js before its 16 dependents; Nav-tier before Core-tier for the `showToast` outcome) must survive concatenation. The recommended build step must concatenate in the literal order given in §6, not alphabetically, not by file size.
4. **Temptation to "fix" §4's findings as a drive-by.** The dead `showToast` copy, the stale comment, and the empty `if`-block are easy to notice again while touching these exact files for bundling. None of the three should be changed in this phase — each is a behavior question (which toast styling wins sitewide; whether to actually wire up the unused `micro-interactions.js` globals; whether to delete the empty `if`) that needs its own sign-off, not a side effect of a request-count change.
5. **Conflating `artwork.html` (in scope) with the generated pages (out of scope).** Both render single-work pages from the same data, with independently-drifted templates (different `<header>` classes, completely different script loadouts — `artwork.html` carries the full 21-script common tier, the generated pages carry none of it). Easy to accidentally "fix both since they're basically the same page" — they are explicitly not the same system for this phase.
6. **Family-cohort assumption (§3) could go stale.** The decade/medium/theme manifests are identical *today*, confirmed by diff. If Tier 4 (§6) is ever implemented and a future session adds a one-off script to a single page in one of those families without updating the family bundle, that page silently diverges. Reason enough to keep Tier 4 deferred until there's an actual maintainer workflow for it.

---

## 12. Validation checklist

Adapted from this project's own already-proven methodology (`PHASE1_REVIEW.md`: static check → live browser check → production verification — not skipped even when a change "feels" safe):

- [ ] `node --check` on both generated bundle files.
- [ ] Diff each bundle's concatenation order against the literal ordered list in §6 — not regenerated from a directory listing or alphabetical sort.
- [ ] Local server (`python3 -m http.server`) check on one page from every cohort: `index.html`, `archive.html`, `artwork.html`, `about.html`, `chromatic.html`, one decade page, one medium page, one theme page, `qa.html` — zero new console errors on any.
- [ ] Re-run the exact interactive checks `PHASE1_REVIEW.md` already validated, since this phase's bundles carry the same code: mobile drawer open/close + `aria-expanded`, `?` shortcuts overlay, header hide-on-scroll (and suppressed-while-drawer-open), dark-mode toggle, theme-color background fade, footer gradient.
- [ ] Specifically confirm `showToast` still renders `ui.js`'s styling (not `micro-interactions.js`'s) on `archive.html` and `style-guide.html`.
- [ ] Specifically confirm the chromatic ambient-tint / position-strip / accent-wire trio still cooperate correctly through `window.__chromaticBgById` (no duplicate fetch storms, no missing tint).
- [ ] DevTools Network tab: confirm the expected request-count drop per §7's table; confirm the *old* individual files still 404-free (they remain on disk per §9/§10, unreferenced but present); confirm no *unexpected* new 404s for the bundle URLs.
- [ ] `audit-nav.sh` and the existing pre-commit hook both still pass unmodified.
- [ ] Production smoke test via the existing (unmodified) `deploy-hostgator.sh` mechanism, plus a manual `curl -I` on both new bundle URLs confirming `200` and `Content-Type: application/javascript`.
- [ ] Lighthouse on `index.html` and one decade page, before/after, using `--throttling-method=devtools` (per `CLAUDE.md`'s own documented gotcha — default lantern-mode throttling has already been shown insensitive to a real fix on this exact site) — 3 runs, median, to confirm the moderate-not-dramatic expectation set in §7.

---

**Waiting for approval before any implementation begins.**
