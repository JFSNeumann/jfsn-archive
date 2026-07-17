# Session Start Summary — Phase 2A Kickoff

**Date:** 2026-06-29
**Status:** Research only. No code changed. Written for approval before any Phase 2A work begins.
**Method:** Every claim below was checked directly against the repository (`grep`, `wc`, `git log`/`diff`, direct file reads) — not taken on faith from `CLAUDE.md`, `CODE_QUALITY_AUDIT.md`, `PHASE1_REVIEW.md`, or `SESSION-END-PHASE1.md`, per this project's own stated norm ("verify by execution, not by reading," `CLAUDE.md` § Working notes). Three small discrepancies between those docs and the live repo turned up; they're called out inline below, not silently corrected.

Phase 1 is treated as closed per instruction — nothing below revisits, second-guesses, or proposes changes to it.

---

## Project purpose

JFSN Archive (jfsn.com) is a personal, non-commercial archive of Jeffrey F. S. Neumann's work — 1,084 cataloged pieces (collage, sculpture, photography, painting) spanning 1974–present, with an estimated 500–1,000 additional early works lost to water damage and not recoverable. It is a static site (no CMS, no database) on a $5/month shared host (HostGator/cPanel), maintained collaboratively with Claude Code across roughly 95+ prior sessions.

The project's own guiding question (`JFSN-MISSION.md`, restated in `CLAUDE.md`): *"Will this help a future grandchild understand Jeff and his life better?"* The one non-negotiable rail is honest treatment of the work itself (no fabricated provenance, no composites presented as real exhibitions, full-color images always). Design and motion are explicitly the site owner's own 40-year craft domain and are deliberately *not* constrained by conventional minimalism — relevant context for Phase 2A, since "bundling" must not be read as license to also prune or "simplify" the animation layer.

## Architecture overview

**Three distinct page-rendering systems**, verified independently rather than assumed to be one:

| System | Pages | Confirmed script/style footprint |
|---|---|---|
| 1. Hand-maintained root pages | 38 (`index.html`, `archive.html`, decade pages, theme pages, etc.) | 30–46 `<script` tags, 8–14 stylesheet links per page (measured directly across all 38 — see table below) |
| 2. Generated artwork detail pages | 1,084 (`artworks/pages/artNNNN.html`, built by `tools/generators/gen-artwork-pages.py`) | Only **6** script tags and **2** stylesheets, verified across 3 samples spanning the full ID range (`art0001`, `art0500`, `art1084`) |
| 3. Client-side artwork renderer | 1 (`artwork.html`, loads by `?id=artNNNN`) | 40 script tags — closer to System 1's profile; confirmed it does load `_shared/ui.js` (`artwork.html:1123`) |

Systems 2 and 3 render the *same content* (a single work) through *independently maintained* templates — `CODE_QUALITY_AUDIT.md` already flags this as unresolved structural debt, and this session's direct comparison confirms they've drifted further than "two templates, same output": their `<header>` markup carries different Tailwind classes, and their script loadouts are not a subset/superset of each other.

**Of the 38 root pages:** 37 carry the canonical stamped nav/footer (`stamp-nav.sh`'s `TARGETS` array, source-of-truth in `_shared/top-nav.html` / `_shared/footer.html`). The 38th, `qa.html`, is an internal dev/QA tool intentionally excluded from both the nav system and the sitemap (`CLAUDE.md`'s "New page checklist" explicitly lists `qa` among excluded dev tools) — not a gap, by design.

**Shared module count:** `_shared/` holds 57 files (41 `.js`, 13 `.css`, 2 HTML partials — `top-nav.html` + `footer.html` — and 1 image asset), close to the audit's "~60" estimate. No bundler; every file is loaded via an individual `<script src>` or `<link>` tag.

**The sitewide "nav bundle" is physically embedded in `_shared/top-nav.html`.** Read directly: the content between that file's own `<!-- NAV:START -->` and `<!-- NAV:END -->` comments — which is what `stamp-nav.sh` copies verbatim into all 37 stamped pages — contains not just header/drawer markup but **11 external `<script src>` tags** (`search.js`, `anime.min.js`, `jfsn-interactions.js`, `accent-transition.js`, `chromatic-accent-wire.js`, `ambient-chromatic-tint.js`, `chromatic-position-strip.js`, `chromatic-lazy-tint.js`, `click-feedback.js`, `micro-interactions.js`, `scroll-choreography.js`) plus 3 inline `<script>` blocks (mobile-menu open/close, header-hide-on-scroll, dark-mode toggle). This matches the known `stamp-nav.sh` clobber risk already documented in `CLAUDE.md`/`SESSION-END-PHASE1.md` — it's restated here because Phase 2A's bundling work will almost certainly need to *edit this exact span*, which makes every future `stamp-nav.sh` run a propagation event for the bundle, not just nav markup.

**Reference-count census** (how many of the 38 root pages load each shared file — full sorted list available on request, summarized here):
- Universal (38/38, including `qa.html`): `analytics.js`, `image-prefetch.js`, `lazy-load.js/.css`, `lightbox.js/.css`, `nav-active.js`, `page-transitions.js/.css`, `toast.js/.css`, `ui.js`, `ui.css`, `enhancements.css`
- Sitewide-minus-qa (37/38 — the nav-bundle list above, plus `archive-river.js`, `floating-home-button.js`, `dark-mode.css`, `skeleton.css`)
- Broad but not universal: `hover-preview.js/.css` (30), `section-tints.css` (31), `depth-hero.js` (13 — matches `CURRENT_STATE.md`'s "now on 12 pages" claim closely enough), `continuity-transition.js` (10)
- Narrow, single- or few-page features (1–6 references): `archive-animations.js`, `artwork-animations.js`, `chromatic-animations.js`, `chromatic-river-parallax.js`, `filter-slide-in.js`, `archive-quick-filters.js/.css`, `ux-improvements.css`, `drone-survey.js`, `essay-parallax.js`, `hover-scale.js`, `breadcrumb-navigation.js`, `section-reveal-stagger.js`, `senior-ux-signposting.js`, `grid-entrance.js`, `hero-zoom-settle.js`, `section-parallax.js`, `counter-animate.js`, `image-fade-load.js`, `stat-card-entrance.js` — these are correctly page-specific, not orphans.

**A new finding, not present in any doc read this session:** `tools/generators/gen-artwork-pages.py` never references `ui.js`, and none of the 1,084 generated pages load it (confirmed by direct grep, 3 samples). `PHASE1_REVIEW.md` §7 states the P/N (prev/next-artwork) keyboard shortcut's handler in `ui.js` "takes effect once `ui.js` is deployed" on "artwork detail pages," and that its links "only have targets on the generated artwork detail pages." Both can't be true at once: if the feature's only targets live on pages that never load the file containing its handler, the feature has no working delivery path in production. This was checked by grep/absence-of-reference only, not by an actual browser click — flagged as a question below rather than asserted as fully confirmed.

## Build pipeline

- **No JS bundler or build step exists today.** `package.json`'s only `devDependency` is `tailwindcss` (`^3.4.19`); its only real script is `build:css` (`npx tailwindcss -i input.css -o site.min.css --minify`). Confirmed no esbuild/webpack/rollup/vite/parcel anywhere in the tree. The `test` script is a placeholder (`exit 1`) — there is no test suite.
- **Data/catalog pipeline** (mature, unrelated to JS architecture, out of scope for Phase 2A): `artworks/ingest.py` → `catalog.py` (AI cataloging via `claude-haiku-4-5`) → `validate_catalog.py` → `artworks/build_catalog.py` (publishes `catalog.json`, `catalog-lite.json`, `sitemap.xml`, `feed.xml`, `api/v1/`) → `tools/generators/gen-artwork-pages.py` (regenerates the 1,084 static pages from one Python-string template).
- **Local dev:** `python3 -m http.server` from the repo root, configured in `.claude/launch.json` (`autoPort: true`).
- **Pre-commit hook** (`hooks/pre-commit`, installed via `setup-hooks.sh`) runs `audit-nav.sh`, rebuilds and diffs `site.min.css`, and verifies `CACHE_V` was bumped (and correctly formatted) whenever a precached asset changed. This is a real, working safety net `CODE_QUALITY_AUDIT.md` calls out as worth preserving — Phase 2A should extend it, not bypass it, once bundling changes what counts as a "precached asset."

## Deployment workflow

- `bash session-end.sh` — git commit + push to `origin/main` + rsync to JEFFS-4TB external drive + Backblaze B2 cloud backup. **Does not deploy.**
- `bash deploy-hostgator.sh` — the only deploy path. FTP/`lftp` mirror to HostGator, reads `.ftp.env`, runs a smoke test. Netlify (former secondary mirror) was removed 2026-06-22.
- `sw.js`'s `CACHE_V` (currently `jfsn-1782700000`) must be bumped manually after any deploy-affecting JS/CSS/HTML change; `artworks/build_catalog.py` only auto-bumps it when catalog *content* changes, not on arbitrary JS/CSS edits.
- **Current repo state, verified via `git`, not assumed:** branch `main`; tag `phase1-freeze` → `13ed191a`. HEAD is 2 commits ahead at `667edd4a`. Diffed both post-tag commits directly: they add `CODE_QUALITY_AUDIT.md` + `SESSION-END-PHASE1.md` (docs only) and make small prose edits to `index.html`/`about.html`/`archive.html` (bio text, a caption, a subtitle — confirmed via `git diff`, zero script-tag or structural changes). Working tree is clean (`git status --short` empty). **This means the audit's technical findings are current as of right now**, not stale.

## Current technical debt

Per `CODE_QUALITY_AUDIT.md`'s open backlog, with this session's direct measurements layered in:

1. **No JS bundling** — 30–46 `<script` tags per root page (this session's direct count across all 38 pages; corrects the audit's stated "21–33" range, which appears to undercount the heavier pages — `index.html` (46), `archive.html` (44), `artwork.html` (40), `about.html` (42), `chromatic.html` (41), `series.html` (41) all exceed 33). The "21–33" figure may have been measured against an older or differently-selected page subset.
2. **The 11-script sitewide nav bundle lives inside `_shared/top-nav.html`'s `NAV:START`/`NAV:END` span**, not as a separable include — any bundling change here is simultaneously a `stamp-nav.sh` propagation event (see Risks).
3. **Dual artwork-rendering system** — confirmed materially diverged (different header markup, 40 vs. 6 script tags), not just "two templates to keep in sync." A bundling plan has to treat them as two separate problems, not one.
4. **`ui.js`'s P/N shortcut likely has no working delivery path** (new finding above) — distinct from the existing "brittle selector" note in `PHASE1_REVIEW.md`/`CODE_QUALITY_AUDIT.md`, which describes it as fragile-but-working.
5. **~57 modules in `_shared/`**, many single-purpose and tiny (400 bytes–2.8 KB) — `counter-animate.js`, `hero-zoom-settle.js`, `filter-slide-in.js`, `stat-card-entrance.js`, `grid-entrance.js`, `hover-scale.js`, `image-fade-load.js`, `section-reveal-stagger.js`, etc. This cluster is the clearest bundling ROI: high request-count-to-byte ratio.
6. **Minor doc-accuracy drift** (low stakes, noted because the project explicitly values catching this): `_shared/ui.js`'s real current line count is **908** (`wc -l`, verified just now). `PHASE1_REVIEW.md` says 923; `CODE_QUALITY_AUDIT.md` and `SESSION-END-PHASE1.md` both say 908. 908 is correct as of this moment.
7. `_shared/ui.css` (158 KB unminified, render-blocking) and `stamp-nav.sh`'s marker-scheme fragility are real, already well-documented, and explicitly **not** Phase 2A's concern (separate roadmap items: CSS split/minify, marker-scheme redesign) — noted only as adjacent context, not pulled into scope.

## Risks

- **Editing `_shared/top-nav.html`'s script list is unavoidable for bundling system 1**, and the very next `stamp-nav.sh` run will propagate that edit verbatim into all 37 stamped pages. That's the desired outcome here (unlike past incidents where `stamp-nav.sh` accidentally destroyed unrelated page-specific scripts sitting too close to the span) — but it must be a deliberate, single, reviewed run, with `git diff --stat` checked immediately after, specifically watching `index.html` for a larger-than-expected diff (the project's own standing rule, restated in `CLAUDE.md`, after this exact thing happened twice before).
- **Two independent JS-loading systems mean two independent bundling decisions.** The 1,084 generated pages are already lean (6 script tags, 2 stylesheets) — bundling them may have low ROI or may not be in scope at all (see Assumptions/Questions).
- **`tools/generators/gen-artwork-pages.py` changes require a full 1,084-file regeneration + diff review**, never a hand-edit of a generated page (it'll be silently overwritten on the next regen).
- **`sw.js`'s `PRECACHE` array hardcodes exact paths to 17 of the `_shared/*.js` files.** If bundling changes any of those filenames or paths without updating `PRECACHE` in the same change, `cache.addAll()` rejects on the first 404 and the *entire* service-worker install fails — not just that one asset. This is already a documented risk pattern (`SESSION-END-PHASE1.md` "Known Risks"); it now applies directly and concretely to whichever files get merged into a bundle.
- **The animation/motion layer is explicitly the site owner's creative domain**, per `CLAUDE.md`'s design brief. Concatenating files for fewer HTTP requests is a packaging change; it must not become a backdoor for quietly merging, removing, or "simplifying" animation modules that look redundant from a pure code-reuse lens — that needs separate sign-off, same as `CODE_QUALITY_AUDIT.md` already insists for the broader "~60-module sprawl" item.

## Assumptions

- **Phase 2A's "JavaScript Bundling Strategy" scope = System 1 (the 38 root pages)**, since that's where the "many small requests" problem this session measured actually lives. I'm assuming the 1,084 generated pages (System 2) are out of scope by default, since they're already down to 2 non-essential external scripts (`search.js`, `nav-active.js`) — bundling 2 files isn't a meaningful win, and touching `tools/generators/gen-artwork-pages.py` carries the regeneration risk above for comparatively little payoff. Flagged explicitly as a question below rather than decided unilaterally.
- **"Bundling" means combining/concatenating (and likely minifying) existing vanilla files into fewer HTTP requests** — not introducing a new JS framework, ES module/import-map system, or transpilation step. Nothing in the project's stated conventions ("Vanilla HTML/CSS/JS," no build step beyond Tailwind CLI) suggests appetite for a heavier toolchain, but `BUNDLE_PLAN.md` will lay out options rather than assume a specific tool.
- **The existing Tailwind CLI build pattern (`npm run build:css`) is the right model to extend**, i.e. a comparably lightweight `npm run build:js`-style step, rather than a full bundler with its own config/plugin ecosystem. Again, surfaced as an explicit option in the plan rather than decided here.

## Questions

1. **Should Phase 2A's bundling scope include the 1,084 generated artwork pages at all?** My working assumption above is no (they're already lean and structurally separate) — want that confirmed before `BUNDLE_PLAN.md` scopes around it.
2. **Want the `ui.js` / P/N-shortcut-on-generated-pages finding verified live in a browser** before Phase 2A treats the existing docs' "works today, just brittle" framing as accurate? This session's evidence (absence of any `ui.js` reference) is strong but was checked by grep, not by an actual click — and the project's own norm is "verify by execution" for exactly this kind of claim. This is a one-off side finding, not something I'd fix under Phase 2A's bundling mandate without separate direction.
3. **Tooling preference for the eventual bundle step** (esbuild-based concat+minify vs. a small dependency-free concatenation script, etc.) — not blocking for this summary, but `BUNDLE_PLAN.md` will present it as a decision point rather than assume an answer.

---

**Waiting for approval before proceeding to `BUNDLE_PLAN.md` (Phase 2A).**
