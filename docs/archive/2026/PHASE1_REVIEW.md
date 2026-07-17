# Phase 1 Change Review

**Date:** 2026-06-26
**Scope:** Review of every change made in Phase 1 of the code-quality audit.
**Status:** All changes in the working tree — **not committed, not deployed.**
**Verification method:** Static analysis + `node --check` + live browser verification on a local `python3 -m http.server` (per project's "verify by execution" norm). Zero console errors observed throughout.

> **One real regression was found during this review and fixed** — the loss of `aria-expanded` on the mobile-menu button (see §3). It was the only behavioral loss; everything else is behavior-preserving. No other code was modified.

**Net diff:** 41 files changed. `ui.js` 1021 → 923 lines. 3 files deleted (−59 lines). 38 HTML pages each gained one head line; `archive.html` also lost 2 dead asset refs + a stale comment; `sw.js` `CACHE_V` bumped.

---

## 1. FOUC fix — head-blocking theme-init on all 38 root pages

**Change:** Inserted immediately after `<meta charset="utf-8">` on every root `*.html`:
```html
<script>try{var t=localStorage.getItem('jfsn-theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}catch(e){}</script><!-- THEME_INIT: head-blocking, prevents dark-mode FOUC -->
```

**Why it is safe:**
- The logic is identical to the existing `getTheme()` in `_shared/top-nav.html` (saved theme wins; otherwise `prefers-color-scheme`). It only *adds* the `dark` class earlier — the body script (`setTheme`) still runs afterward and is the source of truth for the toggle. End state is unchanged; only the *timing* moves from post-paint to pre-paint.
- Wrapped in `try/catch`, so a throw from `localStorage` (privacy mode) or a missing `matchMedia` cannot block parsing/rendering — it silently falls back to light.
- Idempotent: keyed on the `THEME_INIT` marker; re-running the injector skips already-patched pages (verified: a second run reported 0 changes).
- Verified placed **before the first stylesheet** on all 38 pages, and as the **first** `<head>` script — so `html.dark` is present before any CSS is applied. Confirmed live: `htmlHasDarkClass: true` at parse, first head script is the theme-init.
- `<meta charset>` remains the first element in `<head>` (the script follows it), so charset detection is unaffected.

**Possible regressions considered → none found:**
- *Pages hardcoding `<html class="light">` (18 pages, e.g. `about.html`, `archive.html`):* my script produces `html.light.dark` when dark is active. **This coexistence already happened pre-change** — the body `setTheme` added `dark` to those same pages after paint. The only `.light` selector in the CSS is `html.dark .light` (a nested element, unrelated to the `<html>` class), so `.light` on `<html>` is inert and does not override `.dark`. End state identical; fix only makes it earlier.
- *Double class application:* head adds `dark`; body `setTheme` later re-adds/removes — `classList.add` is idempotent, `remove` of an absent class is a no-op. No conflict.

**Functionality removed:** None. Pure addition.

**Edge cases to manually test:**
- [ ] Dark-mode user reloads any page → **no light flash** (the actual goal; hard to assert programmatically — eyeball it).
- [ ] First-time visitor with OS set to dark, no `jfsn-theme` saved → page opens dark with no flash.
- [ ] `localStorage` disabled (Safari private mode / blocked cookies) → page opens light, no console error, toggle still usable in-session.
- [ ] `about.html` / `archive.html` (hardcoded `class="light"`) in dark mode → renders fully dark, no half-styled elements.
- [ ] The 3 pages that also have the `add('js')` script (`index`, …) → both head scripts run, order correct.

---

## 2. `ui.js` — removed the disabled keyboard-shortcuts-modal hider

**Change:** Deleted the top IIFE (`hideKeyboardShortcutsModal` + its timers + the capture-phase `?` handler), replaced with an explanatory comment.

**Why it is safe:**
- The markup it targeted (`#keyboard-shortcuts-overlay`, `.keyboard-shortcuts-modal`, `.shortcuts-dialog`, etc.) **no longer exists on any page** — verified with a tree-wide grep returning zero matches in live HTML.
- Its `el.style.display = 'none !important'` lines were **no-ops** — the CSSOM property setter ignores `!important`. The block's only real effect was `el.remove()`, which had nothing to remove.

**Possible regression → actually a fix:** Its capture-phase `keydown` handler called `e.stopPropagation()` on `?`, which pre-empted `search.js`'s real shortcuts overlay (`search.js:284`, bubble phase). Removing it should make `?` work again.

**Functionality removed:** Only dead code. The intended "show shortcuts on `?`" feature lives in `search.js` and is now reachable.

**Edge cases to manually test:**
- [ ] Press `?` on any page (not in an input) → `search.js` shortcuts modal opens (was previously blocked).
- [ ] Confirm no orphan keyboard-shortcuts modal ever auto-appears (the original Session-66 bug) — markup is gone, so it can't.

---

## 3. `ui.js` — removed duplicate mobile-menu handler  ⚠️ REGRESSION FOUND & FIXED

**Change:** Deleted the `ui.js` mobile-menu open/close handler (bound to `#nav-menu-btn` / `#nav-menu-close` / `#mobile-menu-backdrop`). The canonical handler in `_shared/top-nav.html` (slide + scroll-lock + focus + ESC + search wiring) remains.

**Regression found during this review:** The removed block was the **only** code setting `aria-expanded` on the hamburger button. `top-nav.html`'s handler maintains `aria-hidden` on the overlay and moves focus, but never touched `aria-expanded`, and the button markup has none. So after the deletion, screen readers lost the expanded/collapsed announcement on the toggle.

**Fix applied (this review):** The **canonical handler now sets `aria-expanded` directly** — the proper single-source-of-truth fix. In `_shared/top-nav.html` (and propagated to the 37 stamped pages that carry the menu; `qa.html` has none): the button ships `aria-expanded="false"` in static markup, `openMenu()` sets it `'true'`, `closeMenu()` sets it `'false'`. The earlier interim fix (a passive `MutationObserver` in `ui.js`) was removed in favor of this.

> **Why direct-set over the observer:** the menu's own open/close functions now own *all* their ARIA state (cleaner, one fewer moving part), and the button carries a correct `aria-expanded="false"` in the HTML itself — accurate even before JS runs, which an observer cannot provide. Propagated surgically (byte-identical block replace across 37 pages), **not** via a full `stamp-nav.sh` re-stamp, to avoid that script's documented whole-NAV-span clobber risk.

**Why the deletion (plus fix) is safe:**
- The canonical `top-nav.html` handler is a superset of the removed one in every respect *except* `aria-expanded`, which it now sets directly.
- All three close paths (×, backdrop, ESC) route through `closeMenu()`, so each resets the attribute.
- Verified live (mobile viewport): static markup default `aria-expanded="false"`; open → `display:block`, `aria-hidden:false`, `aria-expanded:true`; close via backdrop **and** ESC → `aria-expanded:false`. No console errors.

**Functionality removed:** The conflicting duplicate open/close path (intended). `aria-expanded` was unintentionally lost and has been restored.

**Edge cases to manually test:**
- [ ] Hamburger → drawer slides in; close (×), backdrop tap, and ESC all close it.
- [ ] Screen reader (VoiceOver) announces the button as "collapsed/expanded" as it toggles.
- [ ] Body scroll is locked while open and restored on close.
- [ ] Focus moves to the close button on open and back to the hamburger on close.
- [ ] Rapid open/close clicks don't desync `aria-expanded` (observer is state-driven, so it self-heals).

---

## 4. `ui.js` — removed duplicate header-collapse scroll handler

**Change:** Deleted the `ui.js` "hide header on scroll down" handler. `_shared/top-nav.html` has its own (toggles `.header-hidden` and `.header-scrolled`, **and** suppresses the hide while the drawer is open via its `menuOpen` guard).

**Why it is safe:**
- Both handlers toggled the *same* `.header-hidden` class; before, the net result depended on listener registration order — redundant and racy. The `top-nav.html` version is strictly more capable (adds `header-scrolled`, respects `menuOpen`).
- Removing the `ui.js` copy fixes a latent bug: it could hide the header while the mobile drawer was open (no `menuOpen` guard).

**Possible regression:** The threshold changed from `> 100` (ui.js) to `> 80` (top-nav). Minor and pre-existing — `top-nav`'s handler was *already* running, so 80 was already in effect on every scroll. Not a new behavior.

**Functionality removed:** Only the redundant/buggy duplicate. Header hide-on-scroll-down / show-on-scroll-up is preserved by `top-nav.html`.

**Edge cases to manually test:**
- [ ] Scroll down → header hides; scroll up → header reappears.
- [ ] Open mobile drawer, then scroll → header does **not** hide (the bug this removal fixes).
- [ ] Near top of page (`y < 80`) → header stays visible.

---

## 5. `ui.js` — removed duplicate lazy-image fade loop (kept the richer one)

**Change:** Deleted the "TIER 2: Lazy-Load Image Fade-In Enhancement" IIFE (added a `.loaded` class). Kept the earlier block (adds `.jfsn-loaded` **and** the dominant-color background placeholder, with a 1s fallback). Verified the kept block is fully intact (`ui.js:233–247`).

**Why it is safe:**
- Image visibility does **not** depend on the removed loop: `ui.css` styles `img[loading="lazy"]` with `animation: image-fade-in 0.4s … forwards`, which brings opacity to 1 on its own. The kept `.jfsn-loaded` rule also sets opacity:1. Both converge to visible; the removed `.loaded` adder was a third redundant path to the same end state.
- No JS reads the `.loaded` class on `img[loading="lazy"]`; the now-dormant CSS rule `img[loading="lazy"].loaded{opacity:1}` is harmless.

**Possible regression:** None to visible behavior. **Documented follow-up (not a regression):** `ui.css` defines `img[loading="lazy"]` twice with conflicting base rules (~L1685 transition-driven, ~L2815 animation-driven). This pre-existing CSS duplication is flagged inline for the Phase 2 CSS pass; it was not touched here.

**Functionality removed:** Only the redundant class-adder. The dominant-color placeholder and fade remain.

**Edge cases to manually test:**
- [ ] Scroll a long grid (archive/collage) → thumbnails fade in; no images stuck at opacity 0.
- [ ] Cached reload → images appear immediately (no stuck-hidden images).
- [ ] `prefers-reduced-motion` → images appear without animation (covered by the `@media` rule in `ui.css`).

---

## 6. `ui.js` — deduped the two `themeMap` objects → `JFSN_THEME_MAP` + `jfsnThemeColor()`

**Change:** Two identical 14-entry maps + `getCurrentPageColor()` (one in the background-fade IIFE, one in the footer-gradient IIFE) replaced by a single `const JFSN_THEME_MAP` and `function jfsnThemeColor(isDark)` hoisted to the file's IIFE scope; both consumers call `jfsnThemeColor(isDarkMode)`.

**Why it is safe:**
- Pure data + pure function extraction. The values are byte-for-byte the same (only alignment/comment text differs). The lookup logic (`pathname.includes(page)`, return `dark`/`light`) is identical.
- Both consumer IIFEs are nested inside the same outer IIFE, so the hoisted `const`/`function` are in scope via closure (no globals leaked).
- Verified live on `collage.html` (in the map, dark mode): `document.documentElement.style.backgroundColor` resolved to `rgb(26,26,26)` (the dark `baseColor`), proving `jfsnThemeColor()` returned non-null and the IIFE proceeded. No console errors.

**Possible regressions considered → none:**
- *Scope/reference error:* ruled out by `node --check` + live run.
- *Early-return change:* `if (!themeColor) return;` semantics unchanged in both IIFEs.

**Functionality removed:** None. Identical behavior, one definition.

**Edge cases to manually test:**
- [ ] Each theme page in `JFSN_THEME_MAP` (guernica, crosses, targets, framed, torsos-faces, mr-snowmann, gallery-images, collaboration, collage, sculpture, photography, painting, about, archive): background tint fades in on scroll, light + dark.
- [ ] A non-theme page (e.g. `lost.html`) → no tint applied (function returns null, IIFE returns early).
- [ ] Footer gradient fade still appears above the footer on a theme page (second consumer).

---

## 7. `ui.js` — removed the earlier P/N keydown handler (kept the fade-transition one)

**Change:** Deleted the first P/N artwork-nav `keydown` handler (immediate `.click()`). Kept the "Session 52 #7" handler (`ui.js:448–472`) that adds `page-fade-out` before navigating. Verified the kept handler is present and handles both P and N with the input/textarea guard.

**Why it is safe:**
- Both handlers implemented the same prev/next logic with the same brittle selector. The earlier one navigated immediately and **pre-empted** the fade version (which used a `setTimeout`), so the fade never ran. Removing the earlier copy lets the intended transition work.
- Same input-field guard (`INPUT`/`TEXTAREA`) and modifier-key guard exist in the kept handler.

**Possible regression:** The kept handler shares the same fragile selector `a[href$=".html"][href*="art"][href*="../"]` + `textContent.includes('PREVIOUS'/'NEXT')`. This brittleness is **pre-existing** (both copies had it) and is noted as a Phase 2 item (B8) — not introduced here. These shortcuts only have targets on the generated artwork detail pages.

**Functionality removed:** Only the redundant non-animated duplicate. P/N navigation is preserved (now with its fade).

**Edge cases to manually test (on an artwork detail page, `artworks/pages/artNNNN.html`):**
- [ ] Press `P` → previous work loads (with fade); `N` → next work loads.
- [ ] Press `P`/`N` while focused in the search input → does nothing (guard).
- [ ] First/last work in sequence → no broken navigation.
- [ ] Note: artwork detail pages load the shared `ui.js`, so this takes effect once `ui.js` is deployed; the generated pages themselves were not edited.

---

## 8. Deleted 3 orphaned files + removed all references

**Files deleted:** `_shared/keyboard-shortcuts.js`, `_shared/scroll-to-top.js`, `_shared/keyboard-shortcuts.css`.
**References removed:** 38 `<link>` tags to `keyboard-shortcuts.css` (incl. `<noscript>` copies) + 2 deferred-`forEach` array entries (`index.html`, `archive.html`).

**Why it is safe:**
- `keyboard-shortcuts.js` and `scroll-to-top.js` had **zero** `<script src>` references anywhere — they were never loaded, so deleting them removes no active behavior. (`scroll-to-top.js`'s floating button was therefore never rendering; the live "home" button is the separate `floating-home-button.js`, untouched.)
- `keyboard-shortcuts.css` styled only the 5 modal selectors that no longer exist in any markup — verified. Removing it changes nothing visually. Confirmed live: `hasKbShortcutsCss: false`, no layout shift.
- **None of the three were in `sw.js`'s `PRECACHE`** — verified. (Important: a precached file that 404s would make `cache.addAll` reject and the SW install fail. Not the case here.)
- The only remaining textual references are in `changes.json` (historical changelog *data* — describing past commits, not a code dependency) and were intentionally left as a historical record.

**Possible regressions considered → none:**
- *Broken `<link>`/`<script>` 404s:* all live references removed; tree-wide grep of `*.html` returns no residual refs.
- *No-JS path:* the `<noscript>` copies of the CSS link were also removed, keeping the no-JS fallback consistent.

**Functionality removed:** None active. All three were dead.

**Edge cases to manually test:**
- [ ] DevTools Network tab on a few pages → no 404 for `keyboard-shortcuts.css/.js` or `scroll-to-top.js`.
- [ ] No-JS mode on `archive.html`/`index.html` → page still styled (remaining `<noscript>` stylesheets intact).

---

## 9. `archive.html` — removed stale comment

**Change:** Deleted a 4-line HTML comment referencing the disabled keyboard-shortcuts system between two `<script>` tags.

**Why it is safe / functionality removed:** Comment only; no executable effect. Safe.

---

## 10. `sw.js` — `CACHE_V` bump

**Change:** `jfsn-1782436319` → `jfsn-1782700000` (+ updated comment).

**Why it is safe:**
- The value is a cache-busting token only; the new value is unique vs. the old one, so on deploy old caches are pruned and a fresh precache is built.
- No `PRECACHE` entries were removed, and every listed asset still exists (verified none of the deleted files were in the list). The fetch strategy is unchanged.

**Possible regression:** None. This is the documented project convention after any deploy-affecting JS/CSS change. (Without it, returning visitors could serve stale shell assets from the old SW cache.)

**Edge cases to manually test (post-deploy):**
- [ ] Returning visitor (previously-visited tab) gets the new `ui.js`/pages after one reload — not stale.
- [ ] Offline reload still serves the cached shell (SW install succeeded — check Application → Service Workers).

---

## Summary of regressions

| # | Regression | Severity | Status |
|---|---|---|---|
| 3 | `aria-expanded` on mobile-menu button no longer maintained after removing the duplicate handler | Low (a11y) | **Fixed** — canonical `top-nav.html` openMenu/closeMenu set it directly + `aria-expanded="false"` in markup (propagated to 37 pages); verified `false→true→false` via click/backdrop/ESC |

No other regressions found. All remaining changes are behavior-preserving or behavior-correcting (the `?` shortcut and the header-hide-while-drawer-open bug were *fixed* as side effects).

## Deferred (not regressions — flagged for later phases)
- `ui.css` defines `img[loading="lazy"]` twice with conflicting base rules (Phase 2 CSS pass).
- P/N shortcut selector is brittle (`textContent.includes('PREVIOUS'/'NEXT')`) — Phase 2 (B8).
- The 1,084 generated artwork pages still FOUC — needs the head theme-init added to `tools/generators/gen-artwork-pages.py`'s template + a regen (Phase 1 follow-up).

## Recommended manual test pass before deploy
1. Dark-mode reload on `index`, `archive`, `about`, a decade page → no flash.
2. Mobile drawer open/close + VoiceOver announcement of the hamburger.
3. `?` opens the search shortcuts modal.
4. Scroll a long grid → images fade in; scroll header hide/show; drawer-open suppresses header hide.
5. One theme page (light + dark) → background tint + footer gradient.
6. DevTools Network → zero 404s for the deleted assets.
