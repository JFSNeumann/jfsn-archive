# JFSN Session Handoff Prompt
**Generated:** 2026-06-16 (end of session 47)
**Copy everything below the line and paste it to start the next session.**

> Note: the **v3 verification-first start prompt** (in memory `jfsn_session_prompts.md`) is the primary way to open a session — it checks backups + live drift first. This file is the ranked *work* handoff to use after that.

---

Read `/Documents/JFSN/CURRENT_STATE.md` and `/Documents/JFSN/IMPROVEMENTS.md` before doing anything. Then work the ranked items below in order.

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

## What happened in session 47

Decade-page artwork grid migration: all 6 decade pages (1970s–2020s, 1,084 thumbnails total) migrated from the old `div.break-inside-avoid / div.thumb-frame / a.group.block` masonry markup to the modern `figure.thumb / a.thumb__link / figcaption.thumb__caption` system used on collage/sculpture/photography/painting pages. Decade pages now get the saturation-overlay hover treatment sitewide — grey-at-top at rest, full color + orange outline on hover, caption title turns orange. `.medium-grid` and `.thumb` base rules added to `_shared/ui.css`. Also shipped the `index.html` audio indicator (`[ Audio recording available ↓ ]` in archival brown before the `<audio>` element). GitHub commit `1cec2dee`, deployed to both HostGator and Netlify.

---

## Ranked items — work top to bottom

### 1. Ask Jeff for a fresh Lighthouse run (mobile + desktop, accessibility tab included)
Session 46 fixed the accessibility score's likely main cause (orange-text contrast) plus a real focus-visible gap. Session 47 closed the decade-page visual split. A fresh run will confirm whether a11y is at 100 and whether performance has held.

### 2. Oral history — unanswered questions
See `docs/oral-history/master-notes.md` "Unresolved Questions." Top item: why did Jeff keep going after the Rauschenberg realization? Approach gently, in his own time — this needs Jeff, not autonomous work.

### 3. Physical artwork dimensions
Orientation stand-in (vertical/horizontal/square) shipped session 35. Actual inches/cm need Jeff to measure surviving works by hand — no tooling exists for this. Start with the most significant pieces if he wants to begin.

### 4. series-index.html per-theme icons (low urgency)
Extend the session-35 icon vocabulary (inline feather SVGs) to the 8 series/themes pages, but only if they read as earned rather than literal. Review with Jeff first.

### 5. Always available
Ingest new work: drop photos into `artworks/inbox/`, run `bash add-works.sh`.

---

## Standing rules (don't relitigate these)
- **Never reintroduce:** grayscale thumbnails, scale-on-hover, sibling-dim, hero overlays with promotional copy, fabricated provenance/verification/DPI/quotes. Composite ("imagined placement") works must keep their honesty note; years stay decade estimates ("1990s (est.)").
- **The image is the primary object — UI recedes.** This is why captions/badges/decoration get questioned by default.
- **Don't recommend big documentation projects.** The best preservation work is work Jeff will actually enjoy doing.
- **Orange-text contrast (session 46):** `international-orange` (#FF6600) for fills/borders/hover/dark-bg text only. `orange-ink` (#B84700) for persistent text on light bg. Don't reintroduce the old pattern in new pages or Stitch exports.
- **Decade pages are NOT in `stamp-nav.sh`** — they have a different nav token system (Material Design). Edit them directly. But they DO load `_shared/ui.css` and `_shared/ui.js`.
