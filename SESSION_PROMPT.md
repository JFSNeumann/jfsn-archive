# JFSN Session Startup Handoff
**This is the project orientation document, not a session-specific prompt.**
The primary guiding document is `JFSN-MISSION.md` — read it first.
For ranked work to tackle, see `IMPROVEMENTS.md`. For what's currently live, see `CURRENT_STATE.md`. For the design brief and architecture, see `CLAUDE.md`. For recovery/handoff information, see `SUCCESSION.md`.

> Note: the **v3 verification-first start prompt** (in memory `jfsn_session_prompts.md`) is the primary way to open a session — it checks backups + live drift first. This file is the standing handoff to read after that.

---

## How to start a session

**Paste this into Claude Code:**

> Verify the last session shipped correctly (check deployment status, live site freshness, no regressions). Read `JFSN-MISSION.md` (why this archive exists), `CLAUDE.md`, `CURRENT_STATE.md`, and `IMPROVEMENTS.md`. Summarize open items by priority, flag anything stale, then ask what I want to work on.

---

## Project at a glance

JFSN Archive — personal archive site for Jeffrey F. S. Neumann, 1,084 works. A *preservation project*, not a website project — optimize for completion, not ambition. Making is the point; never push outreach/promotion.

- Live: **jfsn.com** (HostGator/cPanel) — the only host. Netlify (secondary mirror) and the Companion AI chat feature were removed 2026-06-22 — Netlify had no git integration and Companion only ran as a Netlify Function, so dropping Netlify meant dropping Companion too.
- Stack: vanilla HTML/CSS/JS, Tailwind compiled to `site.min.css` (no CDN), service worker, no frameworks
- Design tokens, typography, visual rules: see `CLAUDE.md` § "Design System (current — Stitch/Tailwind, light)"
- **Nav: Archive · Series · About · Lost Works (4 items) + ⌘K search.**
- **Mobile nav:** hamburger → slide-in drawer (`#mobile-menu-drawer`), NOT a fixed bottom bar.
- **Icons:** inline feather-style SVGs only (24-viewBox, 1.8 stroke, `currentColor`). No icon fonts.

## Deploy

- Close session: `bash session-end.sh` (git commit + push + 4TB rsync + Backblaze B2)
- Deploy: `bash deploy-hostgator.sh` (the only deploy target — Netlify removed 2026-06-22)
- Hero AVIFs (`artNNNN-hero*.avif`) need a separate flat lftp upload to `/artworks/`
- Footer/nav: edit `_shared/top-nav.html` / `_shared/footer.html`, then `bash stamp-nav.sh` (37 pages)
- CSS rebuild: `npm run build:css` after any new Tailwind utility, then bump `CACHE_V` in `sw.js`. `build_catalog.py` auto-bumps `CACHE_V` only when catalog content changes — check `git diff sw.js`.

---

## Standing rules

**`CLAUDE.md` is canonical for the full rules and design stance — read it, don't rely on a summary.** The one line worth repeating here because it's truly non-negotiable: the work itself is always shown honestly — no filter/recolor/crop-distort/tilt on the artwork, no title/year/medium hidden behind a hover, composite "imagined placement" works keep their honesty note, years stay decade estimates, no fabricated provenance/badges/DPI/quotes, ever. Everything else (design freedom, color tokens, decade-page quirks, preservation-over-promotion philosophy) lives in `CLAUDE.md` and `JFSN-MISSION.md` — check those directly rather than trusting this file to have kept up, since duplicating rules in two places is exactly how they drift out of sync.
