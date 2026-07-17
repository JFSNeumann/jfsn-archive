# JFSN Archive — Architectural Modernization Audit

**Date:** 2026-07-17
**Type:** Read-only architectural audit (no files modified)
**Scope:** Full repository at `/Users/jeffreyneumann/Documents/JFSN`

---

## Executive Summary

The repository is in **good working health at the root/production layer**: a single, coherent, live implementation (index.html, archive.html, about.html, artwork.html, current.html, the-studio.html, guernica-passage.html, hall-of-openings.html, flooded-wing.html, working-history.html, stories.html, privacy.html, sitemap.html, 404.html) deploys cleanly via `scripts/deploy-hostgator.sh`, with no dirty working tree and a clean `git status`. Netlify was deliberately and thoroughly removed in a documented 2026-06-22/23 session (see `config/changes.json`) — that decision was correct and complete at the code level.

However, the audit found that **several pieces of tooling infrastructure have silently gone stale relative to the current production architecture**, and two small pockets of untracked local cruft exist. Neither is urgent, but both violate the "one current implementation" principle in a way worth fixing:

1. **`scripts/stamp-nav.sh` is dead/broken tooling.** It requires `_shared/top-nav.html` and `_shared/footer.html`, neither of which exists in the repository. Its `TARGETS` array lists ~30 pages (series-index.html, lost.html, collage.html, chromatic.html, guernica.html, decade pages, etc.) that do not exist at root today. Root pages carry no `<!-- NAV:START -->` marker at all — confirmed by direct grep of index.html. This script would fail immediately (`exit 1`) if run today. This is a leftover from the pre-"v2 purification" (pre-2026-07-12) site architecture.
2. **`.netlify/` (local, gitignored) contains a stale `netlify.toml` that still 302-redirects `/` to `/v2/`** — a redirect rule from the era when `v2/` was a prototype and Netlify was a secondary host. Netlify itself was correctly deleted from the *tracked* repo; this is just an untouched local build-state directory that never got cleaned up after the tool was removed.
3. **A near-empty local `v2/` directory has reappeared** (just the folder plus a stray `__pycache__/build-current.cpython-314.pyc`), untracked by git. The actual `v2/` source tree was deleted for real in commit `e9921ad3` ("Stewardship: remove redundant v2/ dev-source directory"). What exists on disk now is not a resurrected implementation — it's regenerated Python bytecode cruft from some later local run of a script that still references a `v2/` output path, plus an empty directory. Not a code-architecture problem, but worth a local `rm -rf`.
4. **A stray empty `archive/` directory exists at root**, untracked, with no contents. Likely a leftover from a typo'd command or manual `mkdir`. Zero value, zero risk to remove.
5. **`about.html.archive-2026-07-13` is committed at the repository root** rather than in `docs/archive-2026/` or another archive location — it's tracked, has a clear preservation purpose (confirmed via commit `4ed31614` and cross-referenced in `docs/archive-2026/STEWARDSHIP-SESSION-ABOUT-PAGE-2026-07-13.md`), but its location clutters the root alongside the live site.
6. **Memory/notes drift from reality**: prior session notes claim `_shared/drone-fleet.js` and `_shared/top-nav.html`/`footer.html` are live shared includes. Neither exists in `_shared/` today (`_shared/` currently holds only CSS files, `artwork-page-min.js`, `nav-active.js`, and a PNG). Git history confirms deliberate removal (`38ccec8c "Delete orphaned _shared/*.js bundle system — dead since v1 site removal"`, `adbdc6ac "Phase 1 Decision: Remove drone-openings implementation"`). This is not a code problem — it's a documentation/memory staleness problem worth a note update, separate from this audit.
7. **`archive-v1/` does not exist anywhere in the repository.** The "load-bearing, decade pages link into it" claim from prior session notes could not be verified because the directory is absent. Either it was already fully removed in a prior session (most likely, given the "v2 purification" history) or the claim was always aspirational. No action needed — just flagging that the claim is stale and should not be repeated.

Aside from these tooling/documentation drift issues, the repository is well-organized: `docs/` is cleanly partitioned (archive, archive-2026, curatorial, governance, operations, oral-history, project, reference, server-artifacts, working-history, STEWARDSHIP), `tools/` is organized into generators/intake/utils, `scripts/` holds all shell tooling in one place, and `config/`, `api/`, `_shared/`, `artworks/`, `fonts/`, `audio/` are all single-purpose, referenced directories with no obvious duplication.

**Overall architectural health: good.** No urgent risk. The main opportunity is deciding whether the pre-2026-07-12 nav-templating system (`stamp-nav.sh` + the `_shared/top-nav.html`/`footer.html` pattern it assumes) should be formally retired/archived, since the live site has already moved past it to per-page inline nav markup, or whether nav should be re-templated using a script that matches current reality.

---

## Dependency Map

**Core systems (production-critical, actively deployed):**
- Root HTML pages (index.html, archive.html, artwork.html, about.html, current.html, the-studio.html, guernica-passage.html, hall-of-openings.html, flooded-wing.html, working-history.html, stories.html, privacy.html, sitemap.html, 404.html) — the live site.
- `site.min.css` (built from `input.css` via `npm run build:css` / Tailwind), `sw.js` (service worker, CACHE_V-gated), `artist-config.js`.
- `config/*.json` (catalog, manifest, dims, colors, chromatic, current, openings, artist-config, changes) — data backing the site and its API.
- `api/v1/*.json` — static JSON API surface, presumably fetched by search.js and/or third parties.
- `artworks/` (full/thumbs/mini AVIFs, gitignored — "already on server") — the image corpus.
- `_shared/*.css` and the two remaining `_shared/*.js` files (`artwork-page-min.js`, `nav-active.js`) — currently-used per-page includes.
- `scripts/deploy-hostgator.sh` — the sole active deploy path (lftp mirror, exclude list for qa.html/curate.html/dedupe.html/*.md/docs/*).
- `hooks/pre-commit` — active git hook.
- `tools/generators/gen-artwork-pages.py`, `tools/intake/*` — actively used to regenerate the 1,084 artwork pages (confirmed via `config/changes.json` entries describing recent regenerations).

**Supporting systems:**
- `scripts/session-end.sh` (commit+push+backup, no deploy), `scripts/backup.sh` / `cloud-backup.sh`, `scripts/auto-cache-bump.sh`, `scripts/audit-nav.sh`, `scripts/pre-deploy-check.sh`, `scripts/preview-verify.sh`, `scripts/uptime-check.sh`, `scripts/setup-hooks.sh`, `scripts/upload-fix.sh`, `scripts/add-works.sh`, `scripts/init.sh`.
- `docs/` subtree — governance, operations, curatorial, reference material supporting the workflow, not the runtime site.
- `fonts/`, `favicon.svg`, `icon-192.png`, `icon-512.png` — static assets referenced by the manifest/site.

**Leaf systems:**
- `working-history/` (design-studies, professional-record, video-documentation, websites, LinkedIn PDF) — self-contained archival content, not code.
- `docs/oral-history/`, `docs/stewardship/` — reference-only documents.

**Orphan systems:**
- `scripts/stamp-nav.sh` — orphaned relative to current site architecture (see Executive Summary #1). Still present, still executable, but would fail on first run.
- Stray empty `archive/` dir (root) — orphaned, zero references anywhere.
- Local `v2/` remnant (empty dir + one `.pyc`) — orphaned build artifact, untracked.
- `.netlify/` local directory — orphaned local state from a removed integration; gitignored, so it isn't a repo problem, only a machine-local cleanup item.

**Circular dependencies:** None found. The architecture is a straightforward static-site + build-script + deploy-script pipeline with no circular imports.

**Duplicate systems:**
- No duplicate *live* implementations were found at the code level (the v1/v2 duplication that existed before 2026-07-12 has actually been resolved — v2 was promoted to root and the old v2/ source deleted for real, per `e9921ad3`).
- The one duplication that exists is conceptual, not code: two different "canonical nav" ideas are simultaneously represented in the repo — the current reality (inline per-page nav/header markup, e.g. `<nav id="doors">` in index.html) and the tooling's belief (`stamp-nav.sh`'s marker-and-shared-file model). Only one of these is real; the other is not deleted.

**Single points of failure:**
- `scripts/deploy-hostgator.sh` is the only deploy path (by design, post-Netlify-removal — this is intentional simplification, not a flaw, but means there is zero deploy redundancy if HostGator/lftp credentials or connectivity fail).
- `sw.js`'s `CACHE_V` is manually bumped per the existing "CACHE_V bump not sufficient" gotcha already tracked in memory; `scripts/auto-cache-bump.sh` exists to help but its actual current usage wasn't verified in this pass.

---

## Highest-Priority Cleanup (safe to REMOVE immediately)

1. **Local `v2/` directory remnant** — `/Users/jeffreyneumann/Documents/JFSN/v2/` containing only `__pycache__/build-current.cpython-314.pyc`.
   - Evidence: untracked by git (`git ls-files v2` returns nothing); the real `v2/` source tree was deleted in commit `e9921ad3` on 2026-07-13; nothing in the live site or any script references a `v2/` path today (confirmed by grep across `.html`/`.js`/`.sh`/`.json`, zero hits).
   - Action: `rm -rf v2/` locally. No git operation needed since it isn't tracked.

2. **Stray empty `archive/` directory** at repo root.
   - Evidence: contains no files (`find archive` returns only the directory itself); not tracked by git; nothing references `archive/` as a path in HTML/JS/scripts.
   - Action: `rmdir archive/` locally.

3. **`.netlify/` local directory** (gitignored, machine-local).
   - Evidence: `.netlify/` is in `.gitignore`, so it's not a repo-cleanliness issue, but it is dead weight on disk — contains a stale `functions/companion.zip` (the deleted Companion feature) and a `netlify.toml` that still redirects `/` → `/v2/`, both of which are historical remnants from a fully-removed integration (per `config/changes.json`'s 2026-06-22/23 Netlify-removal entry).
   - Action: safe to delete locally (`rm -rf .netlify/`) any time; regenerates harmlessly if a Netlify CLI command is ever run again, but nothing in the current workflow invokes Netlify.

None of these three items carry any historical or preservation value — they are regenerated/leftover artifacts of already-completed, already-documented cleanup work, not source material.

---

## Modernization Opportunities

**MODERNIZE-1: `scripts/stamp-nav.sh`**
- What's wrong: assumes a `_shared/top-nav.html` + `_shared/footer.html` marker-injection model that no longer exists; its `TARGETS` list is a snapshot of a much larger page set (series pages, decade pages, curatorial-companion.html, style-guide.html, etc.) that predates the current 14-page root site.
- What to match: the current live site's actual nav pattern — inline, per-page `<nav>`/`<header>` markup (confirmed in index.html at line 378, `<nav id="doors" aria-label="Rooms">`) with no shared-template injection step.
- Effort estimate: **Medium.** Two real choices: (a) rebuild `_shared/top-nav.html`/`footer.html` and re-templatize the current 14 pages if Jeff wants a single-source-of-truth nav again (worthwhile if nav changes are currently being hand-copied across pages, which is itself a duplication risk), or (b) formally retire the script and document that nav is intentionally per-page/bespoke now (given each "room" page — the-studio.html, guernica-passage.html, etc. — has been designed with individually distinct hero treatments per the recent session notes, a single shared nav *template* may already be the wrong model). Recommend Jeff decide the intended model before any code changes; don't rebuild blindly.

**MODERNIZE-2 (optional, low priority): consolidate root backup file**
- `about.html.archive-2026-07-13` sits at root next to the live `about.html`. It has genuine preservation value (documented in `docs/archive-2026/STEWARDSHIP-SESSION-ABOUT-PAGE-2026-07-13.md`) but its current location makes root `ls` noisier than necessary and risks being mistaken for a live page.
- Effort estimate: **Trivial** (`git mv about.html.archive-2026-07-13 docs/archive-2026/`, then fix the one cross-reference in the stewardship doc). See Archive Candidates below — this is really an archive-relocation, not a modernization.

---

## Archive Candidates

**ARCHIVE-1: `about.html.archive-2026-07-13`**
- Why preserve: it's a deliberate point-in-time snapshot of the About page, created and documented in the same session (commit `4ed31614`, "Preserve historical About page artifact"), cross-referenced from `docs/archive-2026/STEWARDSHIP-SESSION-ABOUT-PAGE-2026-07-13.md`. Clear historical value, zero reason to delete.
- Recommended destination: `docs/archive-2026/` (alongside the stewardship doc that already documents it), or a dedicated `docs/archive-2026/snapshots/` subfolder if more such snapshots are expected. Use `git mv` to preserve history.

**ARCHIVE-2 (conditional): `scripts/stamp-nav.sh` and any nav-marker assumptions it embodies**
- Why preserve rather than delete: it documents a real, deliberate prior architecture (the shared-nav-template model) that was in production use for a long time based on the `TARGETS` list's page inventory. Even if retired, it has value as a record of "how nav used to work" and could be resurrected if Jeff wants centralized nav again.
- Recommended destination: if Jeff confirms the inline-per-page nav model is the permanent direction, move `stamp-nav.sh` to `docs/archive-2026/scripts/` or `working-history/` with a short note explaining why it was retired, rather than leaving it live in `scripts/` where a future session might run it and hit a confusing failure.
- Do NOT delete outright — constitution rule 4 (archive before deleting) applies directly here since it's real prior architecture, not disposable cruft.

---

## Consolidation Opportunities

No live code-level duplication was found (the v1/v2 site duplication that historically existed appears to have been fully and correctly resolved by the 2026-07-12/13 "purification" work — this audit found no surviving second implementation of the site).

The one soft consolidation opportunity is conceptual: **nav/footer markup is currently duplicated by hand across each of the ~14 root pages** (since no shared-template mechanism is active). This isn't a "two systems" duplication in the audit sense, but it is the classic single-source-of-truth risk the old `stamp-nav.sh` system existed to prevent. Whether to re-introduce a build-time nav template (matching current page structure) or accept per-page hand-maintenance (given each room page has bespoke hero treatment) is a design decision for Jeff, not something this audit should decide unilaterally.

---

## Technical Debt

- **Stale tooling risk**: `scripts/stamp-nav.sh` sitting live in `scripts/` with a hard failure mode (`exit 1` on missing `_shared/top-nav.html`) is a trap for a future session that runs "the nav script" out of habit without checking if it still applies. Low likelihood, but the failure mode is a hard stop rather than a graceful no-op, so worth flagging.
- **Local/tracked drift**: the `.netlify/` local directory retaining a `/` → `/v2/` redirect and the local `v2/` `__pycache__` remnant are evidence that *some* local script or workflow still occasionally touches `v2/`-related paths, even though the tracked repo has no such references. Worth a quick check of whatever local automation (LaunchAgents, cron, or a forgotten terminal alias) might still be invoking a `v2/`-aware build step, since the backup-LaunchAgent gotcha already tracked in memory shows local automation silently going stale is a recurring pattern for this project.
- **Documentation/memory drift**: session notes referencing `_shared/drone-fleet.js`, `_shared/top-nav.html`/`footer.html`, and `archive-v1/` as currently-live no longer match the repository. None of this is a code problem, but it's worth a memory-consolidation pass so future sessions don't act on stale assumptions (e.g., trying to "add a page to the drone fleet" when that system was deliberately removed).

---

## Modernization Roadmap

**Phase 1 — zero-risk cleanup (do any time, no review needed)**
- `rm -rf v2/` (local untracked remnant).
- `rmdir archive/` (local untracked empty dir).
- `rm -rf .netlify/` (local gitignored remnant of a removed integration).
- Benefit: cleaner root `find`/`ls` output, one less confusing directory name collision with the historical "v2" concept. Risk: none — none of these are tracked or referenced.

**Phase 2 — legacy consolidation (small, reviewed change)**
- `git mv about.html.archive-2026-07-13 docs/archive-2026/` and fix the one cross-reference in `docs/archive-2026/STEWARDSHIP-SESSION-ABOUT-PAGE-2026-07-13.md`.
- Benefit: root directory contains only live site files plus standard project files (README, LICENSE, CLAUDE.md, etc.); the archived page is preserved and easier to find alongside its documentation. Risk: trivial — pure file move with one doc reference to update; not part of the deployed site (deploy script excludes non-target files by allowlist-of-behavior via lftp mirror of the whole tree, so verify it isn't accidentally deployed either way, but its `.archive-2026-07-13` suffix means it was never a `.html` page the site would route to).

**Phase 3 — architectural simplification (needs Jeff's decision)**
- Decide the fate of `scripts/stamp-nav.sh`: either rebuild it to match the current inline-per-page nav architecture (if Jeff wants centralized nav back), or formally retire it to `docs/archive-2026/scripts/` with a short explanatory note. Do not leave it live-but-broken.
- Benefit: removes the single piece of genuinely stale, failure-prone tooling found in this audit. Risk: low, but requires a real decision from Jeff about the intended nav architecture going forward — this audit deliberately does not make that call.

**Phase 4 — repository organization (optional, low priority)**
- Light memory-consolidation pass to correct the drone-fleet/`_shared/top-nav.html`/`archive-v1/` staleness noted above, so future session-start summaries don't reference systems that no longer exist.
- Benefit: fewer wasted investigation cycles in future sessions (this audit itself spent real effort verifying claims that turned out to be false). Risk: none — pure documentation hygiene, no code touched.

---

## Notes on Constitution Compliance

Every REMOVE recommendation above is confined to items with zero git tracking and zero references anywhere in code, docs, or build scripts (the `v2/` remnant, the empty `archive/` dir, and the gitignored `.netlify/` directory) — all regenerated/leftover artifacts of already-completed, already-documented work, not source material. Everything with any documented historical value (`about.html.archive-2026-07-13`, `scripts/stamp-nav.sh`) is routed to ARCHIVE, not REMOVE, per rule 4 ("archive before deleting") and rule 5 ("delete only with compelling evidence of no value"). No modification, move, rename, or deletion was performed as part of this audit — all actions above are recommendations only.
