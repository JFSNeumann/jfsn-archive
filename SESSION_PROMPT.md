# JFSN Session 59 Startup Prompt
**Generated:** 2026-06-17 (end of session 58)
**Copy everything below the line and paste it to start the next session.**

> Note: the **v3 verification-first start prompt** (in memory `jfsn_session_prompts.md`) is the primary way to open a session — it checks backups + live drift first. This file is the ranked *work* handoff to use after that.

---

---

## ⚡ How to Start Session 59

**Paste this into Claude Code:**

> Verify Session 58 shipped correctly (check deployment status, live site freshness, archive filters work). Then show me what to work on next from the ranked items.

Then read:
- `/Documents/JFSN/CURRENT_STATE.md` — current page inventory + status
- `/Documents/JFSN/IMPROVEMENTS.md` — living backlog (check what's done, what's pending)

Work the ranked items below in order.

---

**Project:** JFSN Archive — personal archive site for Jeffrey F. S. Neumann, 1,084 works. A *preservation project*, not a website project — optimize for completion, not ambition. Making is the point; never push outreach/promotion.
- Live: **jfsn.com** (HostGator/cPanel, primary) and **jfsn-archive.netlify.app** (Netlify — has the Companion function + artwork-meta edge function)
- Stack: vanilla HTML/CSS/JS, Tailwind compiled to `site.min.css` (no CDN), service worker, no frameworks
- Design system: light/bone-white (`#fcf9f3`), deep-ink (`#0B0B0B`), orange accent `international-orange` (`#FF6600` — fills/borders/hover/dark-bg text only) and `orange-ink` (`#B84700` — persistent text on light bg, added session 46), warm-brown archival borders (`#8e7164`/`#e3bfb1`), Playfair Display headings, Inter UI, monospace bracket-buttons (`[ LABEL → ]`) for actions. No gradients, no rounded corners, 1px borders.
- **Nav: Archive · About · Stories · Lost (4 items) + ⌘K search.** Series + Companion are footer-only.
- **Mobile nav is a hamburger → slide-in drawer** (`#mobile-menu-drawer`), NOT a fixed bottom bar.
- **Icons: inline feather-style SVGs only** (24-viewBox, 1.8 stroke, `currentColor`). No icon fonts.
- Deploy: `bash end-session.sh` (git commit + push + 4TB rsync + Backblaze B2) → deploy to HostGator via **JFSN.app** desktop app (NOT `deploy.sh` directly — that's what the app wraps). Hero AVIFs (`artNNNN-hero*.avif`) need a **separate flat lftp upload to `/artworks/`** — `deploy.sh` excludes `artworks/full/*.avif` from the normal mirror. Netlify is separate: `bash deploy-netlify.sh --check` (safety scan) → default (draft) → `--prod`.
- Footer/nav: edit `_shared/top-nav.html` / `_shared/footer.html`, then `bash stamp-nav.sh` (38 pages, including the 6 decade pages and `curatorial-map.html`).
- **CSS rebuild:** `npm run build:css` after any new Tailwind utility, then bump `CACHE_V` in `sw.js`. `build_catalog.py` auto-bumps CACHE_V only when catalog content changes — check `git diff sw.js`.
- **B2 daily cap:** Backblaze hits a transaction cap most days; resets midnight GMT (≈ 8 PM EDT). B2 caught up session 47 (2026-06-16) — GitHub + 4TB + B2 all current through commit `1cec2dee`.
- **Color contrast rule (session 46):** `international-orange` (#FF6600) text only passes WCAG AA on dark backgrounds. For persistent (non-hover) orange text on a light background, use `orange-ink` (#B84700) instead. See `CLAUDE.md` Visual rules and `STITCH.md` for the full rule — don't reintroduce the old pattern when adding new pages or Stitch exports.

---

## What happened in session 58

**Fixed archive.html bug:** Syntax error on line 677 (extra closing brace before `else` statement) broke filter JavaScript. Fixed and committed.

**Added style guide UX improvements:** Sticky sidebar nav with real-time search, design tokens reference table (colors/spacing/timing/z-index), and 3 copy-paste code snippets for developers. Added navigation IDs to all major sections. 229 lines added, all committed to GitHub (`52259f71`).

**Status:** Code is committed and pushed, but NOT YET DEPLOYED to jfsn.com. Ready for deployment via JFSN.app or `bash deploy-netlify.sh --prod`.

---

## Ranked items — work top to bottom

### 1. **DEPLOY Session 58 changes** (Critical)
- Use JFSN.app to push archive.html (bug fix) + style-guide.html (nav/tokens/snippets) to HostGator
- Test archive.html filters work (they're fixed now)
- Test style-guide.html sidebar, search, tokens visible
- Confirm no regressions on other pages

### 2. **Oral history refinement** (Preservation priority)
See `docs/oral-history/master-notes.md` for context. Options:
- Record 1-minute audio clips (if microphone ready)
- Add favorite work notes (light, occasional)
- Light family context to About page
- No large projects — just small wins Jeff enjoys

### 3. **Dark mode decision** (Optional design work)
- Review dark mode exploration in style guide (section 12, marked "exploratory")
- Decide: ship it, defer to v2, or drop it?
- If shipping: test contrast on all components, add toggle, announce

### 4. **Style guide mobile testing** (UX polish)
- Test sticky nav on iPhone 15 Pro (375px)
- Ensure search input stays usable
- Test token table horizontal scroll

### 5. **Always available**
- Ingest new work: drop photos into `artworks/inbox/`, run `bash add-works.sh`
- Record audio notes for any works
- Expand lost-works register as Jeff remembers pieces

---

## Standing rules (don't relitigate these)
- **Never reintroduce:** grayscale thumbnails, scale-on-hover, sibling-dim, hero overlays with promotional copy, fabricated provenance/verification/DPI/quotes. Composite ("imagined placement") works must keep their honesty note; years stay decade estimates ("1990s (est.)").
- **The image is the primary object — UI recedes.** This is why captions/badges/decoration get questioned by default.
- **Don't recommend big documentation projects.** The best preservation work is work Jeff will actually enjoy doing.
- **Orange-text contrast (session 46):** `international-orange` (#FF6600) for fills/borders/hover/dark-bg text only. `orange-ink` (#B84700) for persistent text on light bg. Don't reintroduce the old pattern in new pages or Stitch exports.
- **Decade pages are NOT in `stamp-nav.sh`** — they have a different nav token system (Material Design). Edit them directly. But they DO load `_shared/ui.css` and `_shared/ui.js`.
