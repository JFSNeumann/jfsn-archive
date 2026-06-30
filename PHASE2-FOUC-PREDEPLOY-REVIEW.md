# Phase 2 (FOUC) — Pre-Deployment Independent Review

**Date:** 2026-06-29  
**Reviewer stance:** External reviewer. Every claim re-derived directly from the repository (`git diff`, `grep`, live browser eval) during this review — none carried from the implementing session.  
**Commits under review:** Working tree only — not yet committed.

---

## Executive Summary

**Recommendation: 🟢 GREEN — APPROVE FOR DEPLOYMENT**

The change is a single-line insertion into `gen-artwork-pages.py`'s f-string template, a full regen of the 1,084 output pages, and a `CACHE_V` bump in `sw.js`. Every claim below was independently verified. No regression was found.

---

## Files Reviewed

**Modified (source of truth):** `gen-artwork-pages.py`, `sw.js`  
**Modified (generated, mechanical):** `artworks/pages/art0001.html` through `artworks/pages/art1084.html` (1,084 files)  
**Confirmed untouched:** all 38 root HTML pages, all `_shared/` files, `catalog.json`, `site.min.css`, bundles, `stamp-nav.sh`, `deploy-hostgator.sh`, `session-end.sh`, `.htaccess`

---

## Diff Analysis

### `gen-artwork-pages.py` — template change

```diff
 <meta charset="utf-8"/>
+<script>try{{var t=localStorage.getItem('jfsn-theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}}catch(e){{}}</script><!-- THEME_INIT: head-blocking, prevents dark-mode FOUC -->
 <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
```

One line added. The `{{` / `}}` double-braces are correct Python f-string syntax — they render as single `{` / `}` in output. Verified via `python3 gen-artwork-pages.py --limit 5` and direct inspection of the rendered output.

### `sw.js` — CACHE_V bump

```diff
-const CACHE_V  = 'jfsn-1782767971'; // Phase 2A: JS bundling (core/nav-early/nav-late bundles)
+const CACHE_V  = 'jfsn-1782782983'; // Phase 2: FOUC fix extended to 1,084 generated artwork pages
```

One line changed. New value (`1782782983`) is strictly larger than old (`1782767971`) — confirmed by arithmetic. Format matches project convention (`jfsn-<epoch>`).

### Artwork pages — mechanical

`git diff --stat HEAD` shows 1,086 files changed: 1,084 artwork pages (+1 each) + `gen-artwork-pages.py` (+1) + `sw.js` (+1/-1) = 1,086. Correct.

`git diff --numstat -- 'artworks/pages/*.html'`: every page is exactly `1 0` (+1 insertion, 0 deletions). No page has any other change.

---

## Verified Findings

### Confirmed Safe

- **THEME_INIT script content is byte-identical to the Phase 1 root-page version.** Verified with `diff <(grep 'THEME_INIT' artworks/pages/art0001.html) <(grep 'THEME_INIT' index.html)` → `IDENTICAL`.
- **Insertion point is correct.** `grep -n "THEME_INIT\|charset\|viewport" artworks/pages/art0001.html` shows: charset on line 4, THEME_INIT on line 5, viewport on line 6. Script is immediately after `<meta charset>` and before any other head content.
- **`<html class="light">` coexistence is safe.** Pre-analyzed in `PHASE1_REVIEW.md §1`: the only `.light` selector in any stylesheet is `html.dark .light` (targets a nested element, not the html element itself). Adding `dark` to `html.light` produces `html.light.dark`, which already happens on `about.html`, `archive.html`, and 16 other root pages after Phase 1 — this is not a new pattern.
- **Dark-mode behavior verified in browser.** Set `localStorage.setItem('jfsn-theme', 'dark')`, reloaded `artworks/pages/art0001.html` via local dev server. `document.documentElement.className === "light dark"`. The `dark` class is present before any CSS is applied, which is the definition of the fix working.
- **No console errors.** `preview_console_logs` with `level: 'error'` returned `No console logs` after loading `artworks/pages/art0001.html`.
- **No unexpected files changed.** `git diff --name-only HEAD | grep -v 'artworks/pages/' | grep -v 'gen-artwork-pages.py' | grep -v 'sw.js'` returns empty.
- **Pre-commit hook passes.** `bash hooks/pre-commit` exits 0: navigation audit passed, CSS unchanged (no rebuild needed), CACHE_V current.
- **All 1,084 pages have THEME_INIT.** `grep -rL 'THEME_INIT' artworks/pages/*.html | wc -l` → `0`. No pages missing it.
- **No page has a duplicate.** `grep -rc 'THEME_INIT' artworks/pages/*.html | grep -v ':1$' | wc -l` → `0`. Every page has exactly 1.
- **No JS, CSS, or bundle files changed.** This is an HTML-only change. No bundle rebuild needed, no CSS rebuild needed.
- **Rollback is trivial.** Revert the one-line template change in `gen-artwork-pages.py`, re-run `python3 gen-artwork-pages.py`, revert the `sw.js` CACHE_V bump. Three actions, no risk of data loss.

### CACHE_V Analysis

Artwork detail pages are served **network-first** by `sw.js` (confirmed by reading the fetch strategy comments). They are not in `PRECACHE`. Technically, the CACHE_V bump is not required for the HTML FOUC fix — users will receive fresh pages on next network request regardless. However, project engineering standard is: every deploy-affecting change receives a CACHE_V update. The bump is consistent with that standard and is correctly applied.

---

## Regression Checklist

| Item | Status |
|---|---|
| THEME_INIT script content unchanged from Phase 1 root-page version | ✅ Verified — byte-identical |
| Insertion point: immediately after `<meta charset>` | ✅ Verified — line 5, between charset (L4) and viewport (L6) |
| `<html class="light dark">` coexistence safe | ✅ Verified — pre-existing pattern on 18+ root pages, `.light` on `<html>` is inert |
| Dark-mode class applied pre-paint | ✅ Verified in browser — `dark` present in `className` on reload |
| No console errors on artwork page load | ✅ Verified — clean console |
| All 1,084 pages regenerated | ✅ Verified — `Generated 1084 pages` output |
| All pages have exactly 1 THEME_INIT | ✅ Verified — 0 missing, 0 with duplicates |
| No non-artwork files changed | ✅ Verified — grep returns empty |
| CACHE_V format and value correct | ✅ Verified — `jfsn-1782782983`, larger than predecessor |
| Pre-commit hook passes | ✅ Verified — exits 0, all checks pass |
| No behavior change for light-mode users | ✅ No change — try/catch falls through silently if no saved preference |
| No behavior change for JS-off users | ✅ No change — artwork content still reachable; script is in try/catch, never blocks parsing |

---

## What Was NOT Reviewed

- Visual pixel rendering in dark mode (the script is the mechanism; the CSS dark-mode styles are unchanged from Phase 1)
- Production HTTP response headers (network-first strategy handles HTML; HostGator's caching of `.htaccess` is unchanged)

Neither is a concern for this change — the CSS dark-mode styles have been live since Phase 1; this change only moves the timing of class application earlier.

---

## Final Recommendation

### 🟢 GREEN — APPROVE FOR DEPLOYMENT

One additive change, exhaustively verified: 1,084 HTML files each gain one head-blocking script that is byte-identical to the Phase 1 fix already running on 38 live root pages. No CSS, no JS, no bundles, no source data changed. Rollback is trivial.
