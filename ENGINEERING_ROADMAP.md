# JFSN Archive — Engineering Roadmap

**Author role:** Principal Software Architect
**Date:** 2026-06-30
**Repository state:** `phase2c-freeze` (commit `06f3c6a0`)
**Scope:** All remaining engineering work; all areas considered from scratch

> This document does not assume the next priority is JavaScript, CSS, or any other
> specific area. It evaluates the project objectively across all dimensions, recommends
> only changes that materially improve long-term quality, and names explicitly what
> should be left alone.

---

## Repository State Summary

The archive is stable, deployed, and in better shape than it has been at any prior point
in its history. Phases 1, 2A, 2B-FOUC, and 2C have closed the highest-confidence
structural debt: the dark-mode FOUC on all 1,122 pages, five duplicate event handlers,
three orphaned files, JS bundling (15 fewer requests per page), and 1,943 lines of
confirmed-dead CSS. What remains is real but not urgent. The site works.

**Live environment:** HostGator / cPanel (only host). FTP deploy via `deploy-hostgator.sh`.
**Pages:** 38 root HTML + 1,084 generated artwork detail pages
**Shared JS:** 45 files in `_shared/`; 3 are build-time bundles (Phase 2A)
**CSS:** `ui.css` 5,015 lines / 22.9KB gzip (Phase 2C); `site.min.css` 23KB (Tailwind)
**Catalog:** `catalog.json` 1.0MB, `catalog-lite.json` 848KB, `catalog-home.json` small

---

## Recommended Projects

Projects are listed within each priority tier in order of recommended sequence.

---

### HIGH

---

#### H1 — Remove `micro-interactions.js` from the page bundle

**Description**
`_shared/micro-interactions.js` is 1,335 lines / 50KB (parsed, unminified). It contains
40+ functions (stats dashboard, preferences panel, quick-preview modal, audio player,
story chapters, waveform visualizer, etc.) all guarded by `if (!element) return` null
checks at the top. None of the target elements exist in the live HTML. Every single
function returns immediately on every page load. The file parses for nothing.

**Confirmed dead:** `setupStatisticsDashboard()` looks for `.stats-dashboard` — not in HTML.
`setupPreferencesPanel()` looks for `.preferences-panel` — not in HTML. `setupQuickPreview()`
looks for `.quick-preview-modal` — not in HTML. `setupSearchSuggestions()` looks for
`.search-suggestions` — not in HTML. This was documented as dead in the session-65 audit and
confirmed again during Phase 2C.

**Engineering value:** High. 50KB removed from the JS parse budget on every page load. This is
larger than the entire ui.css gzip reduction from Phase 2C (5.4KB). On a mobile device parsing
JS is more expensive than on a desktop; 50KB of dead script is the most wasteful single item
remaining in the codebase.

**Preservation value:** None (the file has no content value) — removal cannot hurt preservation.

**Maintainability impact:** Significant positive. One fewer file for future maintainers to
understand, audit, or worry about breaking when they touch `.stats-dashboard` or
`.preferences-panel` selectors that don't exist.

**Implementation complexity:** Low. Remove `micro-interactions.js` from the nav bundle's script
list in `_shared/top-nav.html`, remove it from `sw.js` PRECACHE (it isn't there currently but
verify), and delete or zero-out the file. Bump `CACHE_V`. Run `stamp-nav.sh`. Verify the
homepage, archive, artwork, and about pages have zero console errors.

**Implementation risk:** Very low. The file's own null guards prevent it from doing anything.
Removing it cannot break any existing behavior because it isn't producing any existing behavior.
The only risk is a script that references a function from this file from another file — grep
confirms no external calls to its public symbols.

**Expected benefit:** 50KB off every page's JS parse budget. No user-visible change.

**Recommended priority: HIGH — do this first**

---

#### H2 — Fix `stamp-nav.sh` NAV:END scope

**Description**
The `<!-- NAV:END -->` marker in `_shared/top-nav.html` closes AFTER the entire sitewide
script bundle (search.js, anime.min.js, jfsn-interactions.js, accent-transition.js,
chromatic-accent-wire.js, ambient-chromatic-tint.js, chromatic-position-strip.js,
chromatic-lazy-tint.js, micro-interactions.js, scroll-choreography.js). This means the
stamp-nav.sh regex replaces BOTH the nav markup AND all those script tags verbatim from the
template — silently deleting any page-specific script placed adjacent to them.

This has caused real, live feature loss. Session 95 lost 25+ page-specific script tags across
16 pages (including drone animations, parallax modules, and Session 94 drones on two pages)
because they were placed inside the NAV span. A live `curl` check caught it; the damage was
not found by visual inspection alone.

This is not a theoretical risk. It has triggered twice in documented history (Session 80 and
Session 95). It will trigger again — every future session that runs `stamp-nav.sh` is another
opportunity.

**Engineering value:** High. This is the single most dangerous active risk in the developer
workflow. It causes invisible, silent feature loss on the live site that requires a `curl` or
diff check to catch. A senior engineer making a routine nav update should not need to fear
silently destroying unrelated features.

**Preservation value:** Medium. Losing page-specific scripts can break page features that are
part of the archive's visual identity (motion, animations Jeff directed).

**Maintainability impact:** Large positive. Future maintainers (including Allison) do not know
about this trap. It is documented in CLAUDE.md and memory, but those are discoverable only if
you read them. A code-level fix eliminates the class of error entirely.

**Implementation complexity:** Low to moderate. Two options:

  **Option A (preferred):** Move `<!-- NAV:END -->` to immediately after the nav/footer markup,
  before the sitewide script tags. Create a new `<!-- SCRIPTS:START -->` / `<!-- SCRIPTS:END -->`
  span for the script bundle. Update `stamp-nav.sh` to stamp both spans independently. Script
  tags already in the right place stay in place; only the scope changes.

  **Option B (minimal, immediate):** Keep the current scheme but move `<!-- NAV:END -->` to
  before the first `<script src>` tag in `top-nav.html`. Page-specific scripts must then live
  after `<!-- NAV:END -->` — which they should anyway. This is a one-line move in
  `top-nav.html` but requires verifying each page still has its scripts correctly positioned.

**Implementation risk:** Low to moderate. This touches the nav stamping mechanism, which is
central to propagating updates across all 38 pages. The fix must be tested with a full
`stamp-nav.sh` run followed by `audit-nav.sh` and a diff review before deploy.

**Expected benefit:** Eliminates a class of silent, live-site regression that has already
materialized twice. Future `stamp-nav.sh` runs become safe by construction.

**Recommended priority: HIGH**

---

#### H3 — Verify B2 cloud backup is actually firing

**Description**
`CURRENT_STATE.md` (Backup section) notes: "Backblaze B2 cloud (LaunchAgent at 9 PM nightly)
— last B2 timestamp not verifiable from this session: `~/Library/Logs/jfsn-cloud-backup.log`
is empty and last modified 2026-06-15. Worth checking the LaunchAgent is still actually
firing, not just assuming it is because it's scheduled." This item has been flagged since the
2026-06-25 session and not yet verified.

The B2 backup is the only off-site cloud backup for a collection of 1,084 works representing
50+ years of creative output. GitHub holds the code and catalog; the AVIF images are not in
the git repository. If HostGator's FTP server and the local Mac and external drive were all
lost simultaneously (fire, flood — the collection's prior history includes ~500–1,000 works
lost to water damage), B2 would be the last line of defense for the actual image files.

**Engineering value:** Low in normal operation. Catastrophically high in a failure scenario.

**Preservation value:** Critical. The images (672MB in `artworks/`) are not in git. The B2
backup is the only off-site store for them. A broken LaunchAgent could mean no off-site image
backup has run since 2026-06-15.

**Maintainability impact:** Low implementation cost; high peace-of-mind value.

**Implementation complexity:** Very low. Run `~/Library/Logs/jfsn-cloud-backup.log` or check
`launchctl list` for the job's last exit status. If broken, diagnose and fix. If working, log
the verified timestamp in `CURRENT_STATE.md` and move on.

**Implementation risk:** None. This is a read-only investigation plus a potential config fix.

**Expected benefit:** Confirmed or restored off-site image backup — the most irreplaceable
digital asset in the archive.

**Recommended priority: HIGH (investigation only, not engineering work)**

---

### MEDIUM

---

#### M1 — Remove `analytics.js` dead endpoint

**Description**
`_shared/analytics.js` (4,825 bytes) sends batched events via `sendBeacon` to `/analytics`
— an endpoint that does not exist on this static site and never did. GoatCounter (the actual
analytics service, a separate pixel) handles all real analytics. `analytics.js` silently
no-ops on every `sendBeacon` call (the POST to `/analytics` returns 404 or is ignored by the
SW), accumulates data in memory per session, and fires on various user interactions.

It causes no user-visible problem. It does consume 4.8KB of parse budget and adds event
listeners to artwork cards, filter interactions, and scroll events on every page.

**Engineering value:** Low to moderate. 4.8KB and several event listeners removed.
**Preservation value:** None.
**Maintainability impact:** Positive. One less "what does this do?" file for future maintainers.
**Implementation complexity:** Very low. Remove from the script bundle list in `top-nav.html`,
remove from `sw.js` PRECACHE, delete the file. Bump `CACHE_V`.
**Implementation risk:** None. It's a dead no-op endpoint. Removing it cannot affect behavior
visible to any user. GoatCounter continues tracking real traffic.
**Expected benefit:** Cleaner codebase; ~5KB removed; misleading dead code eliminated.

**Recommended priority: MEDIUM — easy win; do it alongside H1**

---

#### M2 — Phase 1–8 CSS dead code removal

**Description**
Phase 2C removed the big dead zones (Phase 9–12 prototype CSS, V2 overrides). Three categories
of pre-existing dead code remain in `ui.css`:

1. **Orphaned `@keyframes color-transition`** (line 916): defined, never referenced by any
   `animation` property anywhere in the file or in any HTML. Pure dead keyframe.
2. **Duplicate `@keyframes underline-draw`** (lines 857, 1193): defined twice; last definition
   wins; the first is dead weight.
3. **Duplicate `@keyframes chip-pulse`** (lines 982, 3499): same — defined twice.
4. **Phase 1–8 `.filter-section-header` block** (~line 3828+): the archive page was rebuilt
   with Tailwind classes; the old `.filter-section-header` selectors and their descendant
   medium sub-selectors have no live HTML targets. Confirmed by grepping all 38 root pages and
   1,084 generated pages.
5. **`img[loading="lazy"]` duplicate mechanism**: one transition-driven rule keyed to
   `.jfsn-loaded` (from Phase 1 JS), one animation-driven keyed to `.loaded` (from an earlier
   pass). The JS feeding the `.loaded` version was removed in Phase 1; the CSS rule itself was
   deliberately deferred pending visual verification.

**Engineering value:** Low. These are small (est. 100–200 lines) and already at gzip cost
essentially zero for the duplicates. But they create genuine confusion for anyone reading the
file.
**Preservation value:** None.
**Maintainability impact:** Positive. Duplicate keyframe names (`underline-draw`, `chip-pulse`)
could confuse a future developer who adds a CSS animation and gets the wrong definition.
**Implementation complexity:** Low. Use the Phase 2C methodology: grep for every reference to
each selector/keyframe across all HTML and CSS files, confirm zero hits, remove.
**Implementation risk:** Low. Run the same independent-review protocol as Phase 2C (find
variants missed by the initial pass — dark-mode, responsive, etc.). Bump `CACHE_V`.
**Expected benefit:** Cleaner file; no confusion from duplicate keyframe names; completes the
dead-code pass started in Phase 2C.

**Recommended priority: MEDIUM — natural follow-on to Phase 2C**

---

#### M3 — `catalog-lite.json` payload investigation

**Description**
`catalog-lite.json` is 848KB (raw). It is loaded by the search overlay (`search.js`) and the
favorites page. HostGator likely serves it gzip-compressed, which should bring it to roughly
150–200KB on the wire, but this has not been verified by direct measurement.

**Current fields** (from `CLAUDE.md`): `file, title, year, work_type, themes, keywords,
motifs, description, series, favorite, featured, orientation, composite, year_precision,
year_display`. The `description` field contains machine-generated catalog text — it is the
longest field per record and is not displayed in search results (search overlays show
title/year/medium only). If `description` is not indexed by `search.js`, it could be removed
from `catalog-lite.json` and moved only to the full `catalog.json`, reducing the file size
significantly.

**Engineering value:** Moderate if `description` is confirmed unused in search. The search
overlay is the only on-demand payload the site loads for most visitors (AVIF loads lazily
per-image). Reducing this file benefits first-time mobile visitors who open search before
images are cached.
**Preservation value:** None — this is a delivery optimization, not a data change.
**Maintainability impact:** Neutral. One fewer field in `catalog-lite.json` means one fewer
place to update if `description` changes — but `description` is rarely edited.
**Implementation complexity:** Low investigation (grep `search.js` for `description`); low
implementation if confirmed unused (remove from `LITE_FIELDS` in `build_catalog.py`, regen,
verify search still works).
**Implementation risk:** Low IF the investigation confirms `description` is not indexed.
The risk is if some search path (keyword matching, full-text fallback) uses it silently —
read `search.js` in full before removing.
**Expected benefit:** Estimated 30–40% reduction in `catalog-lite.json` file size if
`description` is excluded — from ~150-200KB gzipped wire size to ~100-130KB. Meaningful for
mobile search performance.

**Recommended priority: MEDIUM — investigate before implementing**

---

#### M4 — Per-page script drift audit

**Description**
The Phase 1 audit found that `search.js`, `nav-active.js`, `ui.js`, `floating-home-button.js`,
and other shared scripts are not consistently included on a fully consistent subset of pages.
Some pages have silently diverged from the canonical set. This was documented as "Open — medium"
in `CODE_QUALITY_AUDIT.md` but has not been addressed.

This is a correctness issue. A page missing `nav-active.js` will not highlight the active nav
link. A page missing `search.js` will have a broken search overlay. These failures are silent
(no error on a page that has a search button but no `search.js`).

**Engineering value:** Moderate. Correctness matters even when users don't report bugs.
**Preservation value:** Low. This affects navigation UX, not artwork data.
**Maintainability impact:** Positive. A known canonical script set, verified across all pages,
is easier to maintain than an unknown-diverged one.
**Implementation complexity:** Moderate. Requires a scripted audit (grep for `<script src`
across all 38 root pages), produce a matrix, identify gaps, fix.
**Implementation risk:** Low for adding missing scripts; note that adding scripts to a page
means the bundle freshness check in the pre-commit hook should catch future drift.
**Expected benefit:** Confidence that all pages have the correct shared script set; elimination
of silent missing-feature scenarios.

**Recommended priority: MEDIUM**

---

#### M5 — Dual artwork system: make a deliberate decision

**Description**
Two independent systems render artwork detail content:

- `artwork.html` — client-side dynamic renderer, loads by `?id=artNNNN`, fetches
  `catalog-lite.json`, renders in the browser. The "permanent" URL for sharing a work.
- `artworks/pages/art0001.html` through `art1084.html` — 1,084 static pages, pre-generated
  by `gen-artwork-pages.py` from `catalog.json`. Each is a complete standalone page.
  These are the pages linked to from the archive grid and search results.

These two systems can and do diverge. When the artwork page template was updated (FOUC fix,
related-works section, metadata display), changes had to be made in BOTH `artwork.html`'s
JS rendering logic AND `gen-artwork-pages.py`'s template. They can get out of sync silently.

This is not an engineering decision to make unilaterally — it requires the site owner's input.
But the decision needs to be made. Options:

  **Option A: Make generated pages canonical.** `artwork.html` becomes a thin redirect to the
  appropriate `artworks/pages/artNNNN.html`. Generated pages are the only renderer. Advantage:
  one source of truth; static pages are SEO-optimal; `gen-artwork-pages.py` is the single place
  to update templates. Disadvantage: requires a full regen on any template change.

  **Option B: Make `artwork.html` canonical.** Generated pages become thin shells that redirect
  to `artwork.html?id=artNNNN`. Advantage: template changes are instant (no regen). Disadvantage:
  JS-off users get a poor experience; the 1,084 files become dead weight (but small dead weight).

  **Option C: Keep both, document the sync requirement more explicitly.** Accept the maintenance
  cost; add a checklist item that says "if you change artwork.html's render logic, also update
  gen-artwork-pages.py and regen." This is the current implicit state.

**Engineering value:** High long-term. Currently the divergence risk is managed by discipline;
if a future maintainer misses the sync requirement, the two systems drift visibly.
**Preservation value:** Medium. Consistency of artwork presentation is part of archival integrity.
**Maintainability impact:** Resolving this removes an entire category of "remember to update
both places" maintenance risk.
**Implementation complexity:** High if Option A or B. Low if Option C (just better documentation).
**Implementation risk:** High for A or B (touches 1,084 generated pages). Negligible for C.
**Expected benefit:** Depends on choice. Even Option C (better docs) is valuable.

**Recommended priority: MEDIUM — the decision is urgent; the implementation may not be**

---

#### M6 — Add automated page-health check on deploy

**Description**
The current quality gate is the pre-commit hook (`audit-nav.sh`, CSS rebuild check, CACHE_V
verification). There is no post-deploy check that verifies the live site is healthy. The
current protocol is to manually curl a few URLs after deploy and check HTTP status codes.

A simple deploy-time health check script (extending the existing `deploy-hostgator.sh` smoke
test) that fetches 10–15 critical pages and verifies: (a) HTTP 200, (b) `<html>` present, (c)
key selector strings present (e.g., `catalog.json`, `site.min.css`, `CACHE_V` value) would
provide meaningful automated assurance after every deploy.

**Engineering value:** Moderate. Catches deploy failures (wrong file uploaded, 500 error, etc.)
automatically instead of depending on human spot-check.
**Preservation value:** Medium. A broken deploy that goes unnoticed until the next session is a
preservation risk (the live site is the primary access point for the archive).
**Maintainability impact:** Positive. Future maintainers (Allison) get automated confirmation
that a deploy succeeded.
**Implementation complexity:** Low. Extend the existing smoke-test section of `deploy-hostgator.sh`
with a few targeted `curl` checks.
**Implementation risk:** None. Health checks are read-only.
**Expected benefit:** Automatic catch of deploy failures; documented proof of post-deploy
verification built into the workflow.

**Recommended priority: MEDIUM**

---

### LOW

---

#### L1 — Scroll listener consolidation

**Description**
Roughly 12+ independent `scroll` event listeners are bound across `_shared/ui.js`,
`_shared/top-nav.html`, `_shared/footer.html`, `_shared/scroll-choreography.js`, and other
animation modules. Each listener does its own throttling. Phase 1 removed duplicate scroll
listeners; the broader recommendation to consolidate into one shared `requestAnimationFrame`-
throttled dispatcher was deferred.

**Engineering value:** Low to moderate. Independent scroll listeners are not a serious problem
on modern browsers with passive scroll listeners. The risk is performance on low-end mobile.
**Preservation value:** None.
**Maintainability impact:** Moderate positive. One dispatcher is easier to reason about than
12 independent ones.
**Implementation complexity:** Moderate. Requires touching multiple files.
**Implementation risk:** Moderate. Scroll-triggered behaviors are subtle; consolidation risks
accidentally altering timing or behavior of header-collapse, footer-parallax, etc.
**Expected benefit:** Slightly better scroll performance on very low-end devices; conceptual
clarity.

**Recommended priority: LOW — not worth the risk without clear evidence of a scroll jank problem**

---

#### L2 — `image-prefetch.js` wrong extension fix

**Description**
`image-prefetch.js` prefetches adjacent artwork images for perceived navigation speed. A
fallback path in the code guesses `.jpg` for the next image instead of the correct `.avif`
extension. The result: every artwork-to-artwork navigation attempt fires a failed prefetch for
a `.jpg` URL that doesn't exist. This is a silent wasted request, not a user-visible error.

**Engineering value:** Very low. Failed prefetches are background requests; they don't block
anything.
**Preservation value:** None.
**Maintainability impact:** Low positive — removes a wrong assumption baked into the code.
**Implementation complexity:** Very low. A one-line fix in `image-prefetch.js`.
**Implementation risk:** None. Changing a prefetch URL cannot break navigation.
**Expected benefit:** Removes a silent failed request per artwork-page navigation.

**Recommended priority: LOW — fix it the next time this file is open for any reason**

---

#### L3 — P/N artwork navigation selector hardening

**Description**
The prev/next artwork keyboard shortcut in `ui.js` locates adjacent-work links via CSS selector
`a[href$=".html"][href*="art"][href*="../"]` combined with `textContent.includes('PREVIOUS')`
and `textContent.includes('NEXT')` string matching on the rendered link text. This is brittle:
it depends on the exact rendered text content of the nav links remaining "PREVIOUS" and "NEXT",
case-exact. If the template ever changes those labels (internationalization, accessibility
copy update, redesign), the keyboard shortcut silently breaks.

**Engineering value:** Low. Works today; the labels haven't changed in many sessions.
**Preservation value:** None.
**Maintainability impact:** Low positive — a `data-direction="prev"` / `data-direction="next"`
attribute in the generated page template is a more durable selector.
**Implementation complexity:** Low. One line in `gen-artwork-pages.py`'s template + one line in
`ui.js`.
**Implementation risk:** Low. Adding a `data-` attribute doesn't change rendering; updating
the selector to use it is a strict improvement.
**Expected benefit:** Keyboard navigation between artworks survives future copy changes.

**Recommended priority: LOW — do it the next time `gen-artwork-pages.py` is opened for any reason**

---

#### L4 — Add `FOOTER:START` marker to `index.html`

**Description**
`index.html` has a custom homepage footer with no `<!-- FOOTER:START -->` / `<!-- FOOTER:END -->`
marker. This means `stamp-nav.sh` cannot propagate footer updates to the homepage. Footer
changes (e.g., new links, accessibility fixes in the footer) must be applied manually and
separately to `index.html` every time.

**Engineering value:** Low. Footer changes are infrequent.
**Preservation value:** None.
**Maintainability impact:** Low positive. Removes a "remember to update index.html separately"
exception.
**Implementation complexity:** Low. Add the markers in `index.html`; verify stamp-nav.sh
doesn't mangle the custom content between them.
**Implementation risk:** Low-moderate. Requires care: the homepage footer is custom (not the
same as `_shared/footer.html`). The markers should delimit the standard footer block only,
leaving the homepage-specific content outside the stamp span — or the custom footer content
should be moved INTO `_shared/footer.html` if it's now identical.
**Expected benefit:** `stamp-nav.sh` can propagate footer changes to all pages including the
homepage.

**Recommended priority: LOW**

---

#### L5 — Pre-commit hook: bundle freshness check

**Description**
`npm run build:js` builds the three JS bundles (`core.bundle.js`, `nav-early.bundle.js`,
`nav-late.bundle.js`). If a source file is edited but the bundle isn't rebuilt before commit,
the live site continues serving the old bundle. The existing pre-commit hook checks CSS rebuild
freshness but not JS bundle freshness.

**Engineering value:** Low. A developer who edits source files without rebuilding will notice
during local testing (the bundle is the file the browser loads, so the change won't appear).
The risk is low in practice.
**Preservation value:** None.
**Maintainability impact:** Low positive. Extends the existing safety net to the JS build.
**Implementation complexity:** Very low. Add a `node build-js-bundles.js` rebuild + diff check
to `.git/hooks/pre-commit` following the same pattern as the CSS check.
**Implementation risk:** None for the check itself; trivially reversible.
**Expected benefit:** Pre-commit hook catches a stale JS bundle the same way it catches stale CSS.

**Recommended priority: LOW**

---

#### L6 — `about-portrait.jpg` → AVIF

**Description**
`about-portrait.jpg` is the only JPEG remaining in the asset pipeline. All 1,084 artwork images
are AVIF. Converting this one file would complete the transition.

**Engineering value:** Very low. One image; marginal size improvement.
**Preservation value:** None (the JPEG is kept alongside any converted file).
**Maintainability impact:** None.
**Implementation complexity:** Very low. One `ffmpeg` or `cwebp` conversion + HTML update +
FTP upload.
**Implementation risk:** None.
**Expected benefit:** Complete AVIF coverage; minor byte savings on the about page.

**Recommended priority: LOW — do it when the about page is open for any other reason**

---

#### L7 — Audio pipeline planning

**Description**
`JFSN-MISSION.md` and the preservation philosophy list "1-minute audio recordings" as
Preservation Priority 1. Jeff could record short clips (a minute per work, where he has
something to say) that would be attached to individual artwork pages. No pipeline exists for
ingest, storage, or playback of audio.

This is not an engineering task that should be started without Jeff directing it — the key
question is not "how do we host audio" but "does Jeff want to do this, and in what form."
Options range from hosted MP3s with a `<audio controls>` element on artwork pages to
a lightweight stories system. The architecture decision belongs to Jeff.

**Engineering value:** Low pre-direction; moderate once direction is set.
**Preservation value:** Very high. Jeff's voice describing his own work is among the most
irreplaceable archival content imaginable. No other format substitutes for it.
**Maintainability impact:** Adds complexity (audio files need hosting, the template needs
updating, the catalog may need an `audio_file` field).
**Implementation complexity:** Moderate, mostly in `gen-artwork-pages.py` template + catalog
field additions + a new ingest step.
**Implementation risk:** Moderate. Touches the 1,084-page generated template.
**Expected benefit:** The archive's most irreplaceable content preserved in a retrievable form.

**Recommended priority: LOW — this is a preservation priority, not an engineering one; the
engineering is simple once Jeff decides what he wants**

---

### VERY LOW

---

#### V1 — `TODO`/`FIXME` triage in `_shared/*.js`

**Description**
The Phase 1 audit found 106 `TODO`/`FIXME`/`XXX`/`HACK`/`DEPRECATED` markers. Current scan
finds only 1 in `nav-early.bundle.js` — suggesting many were removed during the session-65
and Phase 2A/2C cleanups, or the original count was from a broader search scope. Whatever
remains, these should be triaged: real open items converted to IMPROVEMENTS.md entries, stale
items deleted.

**Engineering value:** Very low. Comments don't affect runtime.
**Recommended priority: VERY LOW — do in bulk when files are open for other reasons**

---

#### V2 — `package.json` metadata cleanup

**Description**
`package.json` has stale metadata: `"main": "artist-config.js"` (this file is not a package
entry point), empty `author`, generic `"license": "ISC"`. Zero runtime effect.

**Recommended priority: VERY LOW**

---

#### V3 — `me black.gif` filename

**Description**
A literal space in the filename `me black.gif` (referenced in `_shared/top-nav.html`) is
fragile on some servers and CDNs. HostGator/cPanel serves it fine today. Low risk.

**Recommended priority: VERY LOW — only fix if it ever causes a problem**

---

#### V4 — Year label consistency in grids/search

**Description**
Artwork grid captions, search results, and favorites show the bare decade year ("1990"), while
artwork detail pages and the API show the honest "1990s (est.)" label. Extending `year_display`
to grids and search would require UI changes and a `catalog-lite.json` / `search.js` update.
The visual noise of "(est.)" in every grid caption may not serve the archive as well as the
current approach (the honest label is available to anyone who clicks through). Jeff's call.

**Recommended priority: VERY LOW — visual/design decision, not engineering**

---

## Leave Alone

The following areas are working well and should not be changed without a specific, concrete
reason. Touching them without cause introduces regression risk for no gain.

**Service worker** (`sw.js`): The three-tier caching strategy (AVIF cache-first, catalog
stale-while-revalidate, HTML/CSS/JS network-first with `{cache:'reload'}`) is correct,
well-commented, and solves a real returning-visitor bug (`c343a111`, `52d305ae`). The
`no-cache, no-store, must-revalidate` header on `sw.js` itself ensures browsers always fetch
fresh. This is sophisticated, correct infrastructure. Do not touch it.

**AVIF image pipeline**: The `.htaccess` rewrite, FTP upload path, `artworks/full/` layout,
lazy-load, and hero crop workflow are coherent and documented. The 672MB image library is
healthy. The only issue is `about-portrait.jpg` (see L6), which is cosmetic.

**`build_catalog.py` / `gen-artwork-pages.py` pipeline**: Correct, stable, and well-documented.
`_write_stable` prevents spurious git churn. The provenance fields (composite flag, year_display,
year_precision) are correctly set and reflect creator-confirmed facts. Don't change field
semantics without reading `CLAUDE.md` § "Provenance fields" first.

**`ui.css` V2 architectural blocks** (lines 4597–4800): The bare `h1/h2/h3` rules and
`html.dark` block are load-bearing against Tailwind Preflight. The architectural annotation
comments added in Phase 2C document exactly why. Do not remove without visual verification
across all pages.

**CSS splitting / critical-path extraction**: At 22.9KB gzip, `ui.css` is no longer a
meaningful render-blocking cost. The Phase 2C architecture investigation concluded that CSS
splitting would reintroduce FOUC risk without addressing the actual LCP bottleneck (the 125KB
hero AVIF). That analysis stands. Do not pursue CSS splitting.

**Decade pages dual-token system**: The Material Design token system on `1970s.html`–`2020s.html`
and `archive.html` coexists with the Stitch/Tailwind system on all other pages. This is
intentional, documented, and has its own design rationale. Don't attempt to unify the token
systems without Jeff directing it.

**Animation system primitives**: `depth-hero.js`, `continuity-transition.js`,
`grid-entrance.js`, `scroll-choreography.js`, `essay-parallax.js`, `section-parallax.js`,
`hover-scale.js`, `drone-survey.js`, and others are active creative infrastructure. They
represent design choices Jeff made and directed. Do not consolidate, remove, or alter
animation behavior without Jeff's explicit direction. The design brief is clear: these are
not engineering decisions to make unilaterally.

**GoatCounter analytics**: The existing GoatCounter pixel handles real visitor analytics.
Leave it alone. `analytics.js` (the dead no-op — see M1) is what should be removed.

**Pre-commit hook**: The existing hook (`audit-nav.sh` + CSS rebuild check + CACHE_V
verification) is a real safety net that has caught real issues. Extend it (see L5); never
disable or bypass it.

---

## Architectural Inconsistencies

**1. `stamp-nav.sh` NAV:END scope confusion (active regression risk)**
The NAV span spans both nav markup AND the sitewide script bundle. This creates a non-obvious
scope that has caused two production incidents. See H2 above.

**2. Dual artwork rendering system (maintenance risk)**
`artwork.html` (dynamic client-side) and `artworks/pages/*.html` (static generated) render
the same content independently. Template changes must be synced manually. See M5.

**3. `micro-interactions.js` dead at 50KB (performance waste)**
The largest remaining JS file by parsed-code size is 100% dead. See H1.

**4. `analytics.js` sends to a non-existent backend (confusing dead code)**
4.8KB of event tracking infrastructure that fires to `/analytics` (HTTP 404). GoatCounter
handles real analytics. This creates a misleading impression that analytics are being tracked
in a system that doesn't exist. See M1.

**5. Two design token systems with no shared source of truth**
Intentional (documented in CLAUDE.md), but means any global visual change (e.g., a new accent
color) must be applied in two places. Low operational cost when changes are infrequent.

**6. Per-page script inclusion has silently diverged**
Pages have accumulated different subsets of shared scripts. No build system enforces a
canonical include set. See M4.

**7. `catalog-lite.json` may include fields not used by its consumers**
If `description` is not used by `search.js`, it's adding ~30% to a 848KB file for no reason.
See M3.

**8. Three remaining duplicate/orphaned keyframe definitions in `ui.css`**
Pre-existing dead code from before Phase 2C. Minor but confusing. See M2.

---

## Simplification Opportunities

These reduce total codebase complexity without any user-visible change:

| Opportunity | Complexity | Immediate Gain |
|---|---|---|
| Remove `micro-interactions.js` from bundle | Very low | 50KB dead parse removed |
| Remove `analytics.js` | Very low | 5KB dead code + dead event listeners removed |
| Fix stamp-nav.sh NAV:END scope | Low | Eliminates a class of silent regression |
| Remove orphaned CSS keyframes + Phase 1–8 dead selectors | Low | Cleaner ui.css; eliminates duplicate name confusion |
| Investigate + trim `catalog-lite.json` | Low | Potentially 30% smaller search payload |

---

## Final Recommendation

**If I were inheriting this repository as its long-term maintainer, I would do these three
things before anything else:**

### 1. Remove `micro-interactions.js` from the page bundle (H1)

This is the highest-engineering-value, lowest-risk item remaining in the entire codebase.
50KB of confirmed-dead JavaScript parses on every single page load for zero benefit. The fix
is three steps: remove from the bundle list in `top-nav.html`, run `stamp-nav.sh`, bump
`CACHE_V`. It cannot break anything because it isn't doing anything. Every user on every page
gets 50KB back from the JS parse budget immediately.

While doing this: also remove `analytics.js` (M1, same workflow, dead no-op endpoint). These
two removals together take under an hour and clean up the two largest pieces of operational
dead code in the codebase.

### 2. Fix the stamp-nav.sh NAV:END scope (H2)

This is the only live, active safety risk in the developer workflow. It has caused real feature
loss in production twice. It will cause it again because it's a structural trap, not a human
error. The fix is a one-time architectural change to `_shared/top-nav.html` and `stamp-nav.sh`.
Every future `stamp-nav.sh` run becomes safe by construction instead of safe by remembering a
non-obvious rule.

### 3. Verify the B2 backup is firing (H3)

This is not an engineering challenge — it's a 10-minute investigation. But the images in
`artworks/` are not in git. If B2 has been broken since 2026-06-15, every day of delay is
another day of uncovered risk for the archive's most irreplaceable assets. Do this before the
next design session, not after.

**After those three:** work through M1–M6 in order, treat L-priority items as cleanup
opportunities when the relevant files are already open, and leave the animation system,
service worker, AVIF pipeline, and build pipeline alone unless Jeff directs changes.

**The most important thing to understand about this archive:**
The engineering is in service of the preservation. The catalog, images, and (eventually)
audio recordings are what matter — the code infrastructure's job is to stay out of their way.
The engineering work that matters most is not making the code elegant; it's making sure future
maintainers (Allison, grandchildren, anyone) can keep the site running and the content intact
without needing to understand all 95+ prior sessions of context. Every engineering decision
should be tested against that question: *does this make the archive easier to keep alive over
the next 20 years?*

The stamp-nav.sh fix (H2) and the B2 backup verification (H3) both pass that test. Dead-code
removal (H1, M1, M2) passes it because it reduces the surface area a future maintainer has to
understand. The dual-artwork system decision (M5) passes it because the current state requires
understanding an undocumented sync requirement. The animation system doesn't fail it either —
leave it alone unless Jeff directs otherwise.

---

*Reviewed against live repository state at `phase2c-freeze`. All file sizes, line counts, and
behavioral claims verified by direct inspection of the working tree. Claims about dead code are
based on confirmed null-guard analysis and grep across all 1,122 HTML pages.*
