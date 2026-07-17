# JFSN Archive — Project Status

**This document is a snapshot, not a plan.** It records the archive's state as of the date below, verified by execution against the live repository and production site. It is not a roadmap, changelog, or marketing page. If a future maintainer reads nothing else in this repository, this file should be enough to understand what the project is, how it works, and what state it's in.

**Snapshot date:** 2026-07-07
**Verified against:** commit `d18098a5b6df248bb6e99e77d1e61b31088edf88` on `main`, and the live site at `https://jfsn.com`.

### Document Status

This document is both an architectural reference and a point-in-time stewardship snapshot.

Sections describing the archive's purpose, architecture, design philosophy, and stewardship principles (§1, §3, §8) are intended to remain stable over time.

Sections describing repository state, deployment status, cache versions, backup health, hardware condition, or other operational details (§2, §5, §6, §7, and the specific facts cited in §3's Service Worker/Backup subsections) reflect the state of the project when this document was last verified.

Before acting on operational information, verify the current repository and production environment by execution rather than relying solely on this document. In case of any discrepancy, the live repository, deployment, and production environment are the authoritative sources.

---

## 1. Project Overview

**Purpose.** The JFSN Archive preserves the creative life of Jeffrey F. S. Neumann — 1,084 surviving works of collage, sculpture, photography, painting, and assemblage, spanning 1974 to the present. It exists so that family, friends, researchers, and future descendants can understand both the work and the person behind it, after the work and its maker are gone. An estimated 500–1,000 additional works were lost to water damage and a subsequent infestation in the 2000s; the archive documents that loss honestly rather than concealing it.

**Design philosophy.** Six principles govern every structural and editorial decision:
- **Honesty** — nothing is fabricated. Years are decade estimates, always labeled as such. Composite/staged images are labeled as composites, never presented as real exhibitions. Absence is documented as absence.
- **Simplicity** — the simplest structure that serves existing content is correct. Pages exist to show work or preserve testimony, not to build hierarchy for its own sake.
- **Preservation** — every structural choice serves the archive's survival and the survival of the work and story it holds.
- **Long-Term Stewardship** — the archive is built to be maintained for decades by people who were not present for its construction.
- **Restraint** — nothing is added without evidence it solves a real, current problem. Speculative infrastructure is explicitly rejected.
- **Content Creates Structure** — new pages and navigation are added only when existing content demonstrably outgrows the existing structure, never in anticipation of content that doesn't yet exist.

**Scope.** A static, self-hosted personal archive: 1,084 cataloged works, an oral-history/testimony layer in the creator's own words, thematic and chronological browsing (decade pages, medium pages, series/theme pages), a color-based visualization of the whole collection ("Chromatic River"), and a lost-works memorial section.

**What the archive intentionally is — and is not.**
- It **is** a personal record and an act of preservation.
- It is **not** a portfolio, a commercial gallery, or a marketing site. There are no calls to action, no newsletter signups, no engagement metrics, no sales mechanism.
- It **is** honest about gaps, estimates, and loss.
- It is **not** a place where missing testimony, dates, or images are invented to complete a narrative.

---

## 2. Repository Status

Verified by direct execution on the snapshot date:

| Fact | Value |
|---|---|
| Branch | `main` |
| HEAD commit | `d18098a5b6df248bb6e99e77d1e61b31088edf88` |
| Working tree | Clean (no modified or untracked files) |
| Sync with `origin/main` | In sync — 0 commits ahead, 0 behind |
| Production (`jfsn.com`) | Matches HEAD exactly — homepage byte-hash confirmed identical between local `index.html` and the live response |
| Deployment method | `bash deploy-hostgator.sh` (FTP mirror via `lftp` to HostGator/cPanel) |

One non-blocking item exists in the repository: a single git stash (`stash@{0}`, dated 2026-06-17) touching only auto-generated files (`changes.json`, `sitemap.xml`) plus a trivial `index.html` diff. It predates the current development phase and is fully superseded by commits and regenerations since. It has not been applied or dropped — see §6.

---

## 3. Technical Architecture

**Static site structure.** Vanilla HTML/CSS/JS — no server-side framework, no build-time static-site generator beyond the project's own Python scripts. Production CSS is a single compiled file (`site.min.css`, built from Tailwind via `npm run build:css`). JavaScript is split into three shared bundles (`core.bundle.js`, `nav-early.bundle.js`, `nav-late.bundle.js`) to reduce per-page script tags, built via `node build-js-bundles.js`.

**Catalog system.** `catalog.json` is the source of truth for all 1,084 works, generated by `artworks/build_catalog.py`. Each record carries `year`, `year_precision` (currently `"estimated"` for every record — dates are decade-bucket estimates, never presented as exact), `year_display` (the honest human-readable form, e.g. `"1970s (est.)"`), `composite` (flags staged/Photoshop-composite images so they are never mistaken for real exhibitions), plus medium, themes, motifs, and series metadata. A reduced `catalog-lite.json` and `catalog-home.json` serve grid/search/homepage views without the full payload.

**Artwork data.** Two deliberately separate, permanent systems: `artwork.html` is a single dynamic template driven by `?id=artNNNN`, with the full animation/interaction layer. `artworks/pages/artNNNN.html` are 1,084 individually generated static pages (via `gen-artwork-pages.py`) — lightweight, no shared bundle, built for fast load, SEO, and no-JS resilience. This split is an intentional architectural decision, not a migration in progress; a feature added to one template is not automatically expected on the other.

**Search.** Client-side, instant search over `catalog-lite.json`. Implemented as `search.js`, bundled into `nav-early.bundle.js` (there is no standalone `_shared/search.js` file — it is generated into the bundle at build time). Supports keyboard navigation and an empty-state message.

**Navigation.** A shared header/footer template (`_shared/top-nav.html`, `_shared/footer.html`) is stamped into 37+ pages by `stamp-nav.sh` using three independently-updated markers (`NAV:START/END`, `SCRIPTS:START/END`, `FOOTER:START/END`). Active-page highlighting is handled by `_shared/nav-active.js`, which maps each page filename to its primary nav cluster (e.g. decade pages, chromatic, favorites, and medium pages all highlight "Archive"). Decade pages (1970s–2020s) and `archive.html` use a separate, older Material Design token system rather than the newer Stitch/Tailwind tokens used elsewhere; both are documented, live, and intentional.

**Service worker.** `sw.js` implements a network-first strategy with cache fallback and a versioned precache list (`PRECACHE`), gated by a `CACHE_V` string that must be bumped whenever cached assets (CSS/JS/HTML) change. The install handler purges old cache versions on activation — it is not a stale-forever cache; a failed network request without a cached match returns a `503`, not silently stale content. Current `CACHE_V`: `jfsn-1783386700`.

**Deployment.** `deploy-hostgator.sh` is the sole deployment path: it mirrors the working tree to HostGator via `lftp` and runs a post-deploy smoke test (checks homepage, archive, artwork, catalog JSON, service worker, and other key endpoints for HTTP 200 and expected content). `session-end.sh` is a separate, distinct step — it only commits, pushes to GitHub, and runs a local backup; it does **not** deploy. A pre-commit hook enforces a navigation audit and blocks commits if a precached asset changed without a corresponding `CACHE_V` bump (`auto-cache-bump.sh` performs that bump).

**Hosting.** HostGator/cPanel is the sole production host. A previous secondary mirror on Netlify (and the AI "Companion" chat feature it hosted) was removed; it is not part of the current architecture and should not be reintroduced without new evidence of need.

**Backup strategy.** Three independent redundancy layers:
1. **GitHub** (`origin/main`) — full source history, verified in sync as of this snapshot.
2. **Backblaze B2 cloud** (`b2:jfsn-archive`, via `rclone`) — automated nightly via a macOS LaunchAgent (`com.jfsn.cloud-backup.plist`, confirmed **loaded** as of this snapshot), with manual `bash cloud-backup.sh` as a verified working fallback.
3. **Local external drive (JEFFS-4TB)** — automated nightly via a second LaunchAgent (`com.jfsn.backup.plist`, confirmed **loaded**), but the drive itself currently fails `diskutil verifyVolume` (see §7, Known Non-Blocking Notes) — this layer is degraded, not absent; GitHub and B2 remain fully intact.

No public page depends on third-party JavaScript or CSS as of this snapshot — the last such dependency (a CDN-hosted copy of anime.js on `sitemap.html`) was replaced with the project's self-hosted copy in the prior development phase.

---

## 4. Completed Development

This section summarizes capabilities delivered, not individual commits.

**Preservation work.** The lost-works record (~500–1,000 pieces lost to water damage and a later infestation) is documented as honest absence — a "ghost grid" of unfilled placeholder tiles, first-person testimony, and no fabricated stand-in imagery. Every catalog year carries an explicit estimate label. Composite/staged images are flagged in the data layer and labeled on artwork pages so they are never mistaken for documentation of real exhibitions.

**UX and information architecture.** The site's navigation, orientation, and content structure were reviewed from multiple independent angles (first-time visitor, museum curator, family member, and heuristic/interaction-design perspectives) across this development phase. The architecture was found to already be mature and restrained; verified findings were corrected (see below) rather than used to justify redesign.

**Interaction refinements (this phase).** Five verified, evidence-based fixes were implemented and deployed:
- Decade pages (1970s–2020s) now correctly highlight "Archive" in primary navigation, matching the rest of the archive-family pages.
- The artwork "not found" state was rewritten in the archive's established voice (replacing a curt, uppercase system message) and no longer leaves an unused image element in the DOM.
- The "Copy link" control on artwork pages now has a genuine failure path — if clipboard access is denied or unavailable, the button gives clear feedback and never gets stuck in a loading state.
- Hover-transition timing across text-link patterns was unified to the site's existing design-system easing tokens, removing inconsistency that had accumulated across separate additions.
- The custom cursor's `cursor: none` behavior is now gated on the custom cursor actually having initialized, so a JavaScript failure falls back to the normal browser cursor instead of hiding it.

**Accessibility.** `aria-current="page"` is set correctly across primary and mobile navigation for essentially all page types (decade pages included, as of this phase). Skip-to-content links resolve to a real target. Focus-visible styling is defined globally. No accessibility regressions were identified in this phase's review passes.

**Stewardship improvements (this phase).** The one remaining third-party runtime dependency (a CDN-hosted JS library on a single page) was removed in favor of the project's existing self-hosted copy, so no public page now depends on external JavaScript or CSS staying available. Cloud backup automation was diagnosed and restored to a verified-working state (both LaunchAgents load correctly). This document was created to serve as the permanent handoff record for the conclusion of this phase.

---

## 5. Current Operational State

**Known infrastructure dependencies.**
- `lftp` (deployment) and `rclone` (cloud backup) must be installed on the machine running deploys/backups.
- Node.js is required to rebuild JS bundles (`build-js-bundles.js`) and CSS (`npm run build:css`, Tailwind).
- Python 3 is required for catalog/sitemap generation (`build_catalog.py`) and static artwork page generation (`gen-artwork-pages.py`).

**Hosting assumptions.** HostGator/cPanel via FTP is the only supported production target. The deploy script assumes `.ftp.env` (untracked, git-ignored) contains valid credentials.

**Deployment workflow.** Standard sequence: make changes → run relevant build step(s) if CSS/JS/catalog changed → `git commit` (pre-commit hook enforces nav-audit + `CACHE_V` bump if needed) → `git push` → `bash deploy-hostgator.sh` → verify via the script's own smoke test and/or direct `curl`/hash comparison against production.

**Cache/versioning process.** Any change to a precached asset (HTML/CSS/JS referenced in `sw.js`'s `PRECACHE` list) requires a `CACHE_V` bump before deploy, or returning visitors may be served stale content from their service worker cache. `auto-cache-bump.sh` automates this and is enforced by the pre-commit hook — a commit that changes a precached asset without a bump will be blocked.

**Backup locations.** GitHub (`origin/main`), Backblaze B2 (`b2:jfsn-archive`), and a local external drive (`/Volumes/JEFFS-4TB`). See §3 for current status of each.

**Recovery strategy.** In the event of production loss, `deploy-hostgator.sh` can re-mirror the entire site from any clean checkout of `origin/main`. In the event of local machine loss, the repository can be re-cloned from GitHub and cloud/local backups used to restore any non-git assets. No recovery path depends on a single point of failure among the three backup layers.

---

## 6. Remaining Items

### Required
None. No item currently blocks stewardship of the archive in its present state.

### Recommended
- Physically service the JEFFS-4TB drive (Disk Utility First Aid, or reformat and repopulate from the git source of truth) to restore full three-layer backup redundancy. This is a hardware task, not a software one.
- Review and resolve the pre-existing git stash (`stash@{0}`, 2026-06-17) — inspect, apply, or drop it. It is inert and does not block anything, but leaving it indefinitely is not a permanent state.

### Optional
- Future editorial/curatorial work (e.g., extending oral-history coverage, adding further testimony) is entirely content-driven and should proceed only as real material becomes available — not on a schedule, and not to fill a perceived structural gap. Per the archive's own governing principle, content creates structure, not the reverse.

---

## 7. Known Non-Blocking Notes

Verified during this session:

- **Pre-existing git stash.** `stash@{0}` ("WIP on main: 472eafaf Session update 2026-06-17 09:49") remains in the repository. It modifies only auto-generated files (`changes.json`, `sitemap.xml`) plus a two-line `index.html` diff, and is fully superseded by commits and regenerations made since. It was not created during the current development phase and has not been applied or dropped.
- **Local backup drive (JEFFS-4TB).** `diskutil verifyVolume /Volumes/JEFFS-4TB` currently returns a filesystem verify/repair failure (error -69845, underlying error 71). The drive is mounted and both backup LaunchAgents are loaded and correctly configured; the fault is specific to this drive's filesystem, not the backup automation. GitHub and Backblaze B2 remain fully intact as independent redundancy.
- **FTP credential exposure (historical, closed as bounded).** A HostGator FTP password was previously exposed and cannot be rotated through any available self-service mechanism. This is a known, accepted, bounded risk — the archive is replicated across three independent locations, and the only exposure is to live-site defacement, not data loss. Rotation is on hold by the project owner's own decision. See `CURRENT_STATE.md` and `docs/FINAL-DOMAIN-AND-PRESERVATION-HANDOFF.md` for the full historical record if needed.

---

## 8. Stewardship Principles

Future changes to this archive should be approached the same way this development phase was conducted:

- **Preservation first.** Every change should be tested against the question: does this help preserve the work, the story, or the archive's ability to keep doing both? A change that doesn't serve preservation should not be made merely because it is possible.
- **Restraint over expansion.** Do not add navigation, pages, indexes, or systems in anticipation of future content. Wait for the content to exist and demonstrably outgrow the current structure first.
- **Evidence over instinct.** Every claim in this document, and every change made during this development phase, was verified by direct execution — reading actual file state, running actual commands, checking actual production responses — rather than assumed from prior notes or memory. Future maintainers should hold the same standard: verify current state before acting on it, and verify the result after.
- **Avoid unnecessary redesign.** Multiple independent reviews during this phase (UX, interaction design, accessibility, information architecture, long-term stewardship) each concluded that the architecture is already mature and intentional. None recommended redesign. That conclusion should not be revisited without new, concrete evidence that the current structure has become insufficient — not because a newer trend or technique exists.
- **The smallest effective change.** When something is verified to be a real issue, fix it with the minimum change that resolves it, preserving existing behavior, URLs, and design language wherever possible.

---

## 9. Stewardship Verdict

**Is the archive technically stable?** Yes. As of this snapshot, the repository is clean, fully synchronized with its remote, and production is verified byte-identical to the committed source. The service worker's caching logic is sound (versioned, purges stale caches, degrades to a clear failure state rather than serving indefinitely stale content). No third-party runtime dependencies remain. All identified interaction and navigation issues from this development phase's reviews have been implemented, deployed, and verified live.

**Is it suitable for long-term maintenance?** Yes, with one qualification: the local backup drive should be serviced to restore full three-layer redundancy (see §6, Recommended). This is a hardware task outside the software repository and does not affect the archive's current technical soundness — GitHub and Backblaze B2 already provide independent, verified-working redundancy.

**Has the project transitioned from active development to stewardship?** Yes. Every completion criterion verified at the close of the prior development phase — clean repository, synchronized remote, production matching intent, all verified housekeeping items resolved, no known release-blocking issues — remains true as of this snapshot. This document itself is the marker of that transition: a permanent, evidence-based record intended to let a future maintainer pick up this project without needing to reconstruct months of prior sessions.
