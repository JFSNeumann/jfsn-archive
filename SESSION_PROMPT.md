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

- Live: **jfsn.com** (HostGator/cPanel, primary) and **jfsn-archive.netlify.app** (Netlify — has the Companion function + artwork-meta edge function)
- Stack: vanilla HTML/CSS/JS, Tailwind compiled to `site.min.css` (no CDN), service worker, no frameworks
- Design tokens, typography, visual rules: see `CLAUDE.md` § "Design System (current — Stitch/Tailwind, light)"
- **Nav: Archive · About · Stories · Lost (4 items) + ⌘K search.** Series + Companion are footer-only.
- **Mobile nav:** hamburger → slide-in drawer (`#mobile-menu-drawer`), NOT a fixed bottom bar.
- **Icons:** inline feather-style SVGs only (24-viewBox, 1.8 stroke, `currentColor`). No icon fonts.

## Deploy

- Close session: `bash end-session.sh` (git commit + push + 4TB rsync + Backblaze B2)
- HostGator (primary): `bash deploy-hostgator.sh` or desktop JFSN.app
- Netlify mirror (secondary): `bash deploy-netlify.sh --check` → default (draft) → `--prod`
- Hero AVIFs (`artNNNN-hero*.avif`) need a separate flat lftp upload to `/artworks/` — `deploy.sh` excludes `artworks/full/*.avif` from the normal mirror
- Footer/nav: edit `_shared/top-nav.html` / `_shared/footer.html`, then `bash stamp-nav.sh` (38 pages)
- CSS rebuild: `npm run build:css` after any new Tailwind utility, then bump `CACHE_V` in `sw.js`. `build_catalog.py` auto-bumps `CACHE_V` only when catalog content changes — check `git diff sw.js`.

---

## Standing rules

Two things are non-negotiable on this archive, regardless of what direction a session takes. First, the work itself is shown honestly: no filter, recolor, crop-distort, or tilt on the artwork; no title/year/medium hidden behind a hover (vanishes on touch, invisible to screen readers); composite "imagined placement" works keep their honesty note; years stay decade estimates ("1990s (est.)"); no fabricated provenance, badges, DPI, accession numbers, or quotes — ever. Second, prefer one well-timed gesture to a pile of effects; this guards against AI sessions accreting novelty across commits, not against Jeff's own direction (see CLAUDE.md's "Design is open" section — that document is canonical for stance).

Beyond the non-negotiables: use `orange-ink` (#B84700) for persistent orange text on light backgrounds; `international-orange` (#FF6600) only for fills, borders, hover-states, and text on dark backgrounds (session 46 contrast pass). Decade pages (1970s–2020s.html) use the Material Design token system and are NOT in `stamp-nav.sh` — edit them directly, but note that they do load `_shared/ui.css` and `_shared/ui.js`. This is a preservation project, not a promotional one — don't recommend large documentation expansions, outreach, or engagement patterns; the best preservation work is what Jeff actually wants to do.
