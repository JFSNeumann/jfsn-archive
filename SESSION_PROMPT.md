# JFSN Session Handoff Prompt
**Generated:** 2026-06-16 (end of session 46)
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
- **New page checklist:** add to `build_catalog.py`'s sitemap `entries` list + rerun it, add to `stamp-nav.sh` TARGETS, add a footer link if it should be discoverable, run `audit-nav.sh` to confirm sitemap coverage.
- **B2 daily cap:** Backblaze hits a transaction cap most days; resets midnight GMT (≈ 8 PM EDT). **Currently capped as of session 46 close — retried twice, both failed.** Run `bash cloud-backup.sh` after the reset. GitHub + 4TB are current through commit `4f66d666`.
- **Color contrast rule (session 46):** `international-orange` (#FF6600) text only passes WCAG AA on dark backgrounds. For persistent (non-hover) orange text on a light background, use `orange-ink` (#B84700) instead. See `CLAUDE.md` Visual rules and `STITCH.md` for the full rule — don't reintroduce the old pattern when adding new pages or Stitch exports.

---

## What happened in session 46

A full accessibility pass, run end-to-end and deployed: found `international-orange` failing WCAG AA contrast (2.79:1, needs 4.5:1) as persistent text sitewide — eyebrow labels, bracket links, nav active-states. Added an accessible `orange-ink` token and swapped it in everywhere orange text sits on a light background, while leaving the original color untouched on dark backgrounds (Lost banner, Stories card, lightbox overlays, river year chips) where it already passed. Covered all 38 hand-written pages, the artwork-page template, and regenerated all 1,084 static pages. Also fixed a real `:focus-visible` gap on `archive.html`'s sort dropdown (`outline:none` with zero replacement) and the custom checkbox filters. Audited every icon-only button/link sitewide for `aria-label` — no gaps found. Deployed to both HostGator and Netlify, verified live on both. Updated `CLAUDE.md`, `README.md`, and `STITCH.md` so the contrast rule doesn't get reintroduced.

---

## Ranked items — work top to bottom

### 0. Catch up B2 backup
Run `bash cloud-backup.sh` once the daily transaction cap has reset (check the time — resets ~8 PM EDT). GitHub and the 4TB drive are current; only B2 is behind, and it's been capped across sessions 45 and 46.

### 1. Ask Jeff for a fresh Lighthouse run (mobile + desktop, accessibility tab included)
Session 45 closed out the performance chase (worst-case LCP 8.7s → ~5.2s). Session 46 fixed the accessibility score's likely main cause (orange-text contrast) plus a real focus-visible gap. A fresh run will show whether a11y is at 100 now, and whether performance has held steady.

### 2. Decide whether to spend a session on the decade-page artwork grids
Session 45 gave the 6 decade pages (1970s–2020s) nav/footer/border/CTA parity with the rest of the site, but deliberately did NOT touch their masonry grid/thumbnail markup (different system from the `.thumb__link` saturation-overlay treatment used elsewhere). That's the one remaining visual-system split on the site. Worth asking Jeff if it's worth the effort — it's a real chunk of work, not a quick pass.

### 3. Oral history — unanswered questions
See `docs/oral-history/master-notes.md` "Unresolved Questions." Top item: why did Jeff keep going after the Rauschenberg realization? Approach gently, in his own time — this needs Jeff, not autonomous work.

### 4. Physical artwork dimensions
Orientation stand-in (vertical/horizontal/square) shipped session 35. Actual inches/cm need Jeff to measure surviving works by hand — no tooling exists for this. Start with the most significant pieces if he wants to begin.

### 5. series-index.html per-theme icons (low urgency)
Extend the session-35 icon vocabulary (inline feather SVGs) to the 8 series/themes pages, but only if they read as earned rather than literal. Review with Jeff first.

### 6. Always available
Ingest new work: drop photos into `artworks/inbox/`, run `bash add-works.sh`.

---

## Standing rules (don't relitigate these)
- **Never reintroduce:** grayscale thumbnails, scale-on-hover, sibling-dim, hero overlays with promotional copy, fabricated provenance/verification/DPI/quotes. Composite ("imagined placement") works must keep their honesty note; years stay decade estimates ("1990s (est.)").
- **The image is the primary object — UI recedes.** This is why captions/badges/decoration get questioned by default, and why three different sessions have removed and re-added the Selected Works captions — it's a real, live tension Jeff is still tuning, not a settled question.
- **Don't recommend big documentation projects.** The best preservation work is work Jeff will actually enjoy doing.
- **Orange-text contrast (new, session 46):** `international-orange` (#FF6600) for fills/borders/hover/dark-bg text only. `orange-ink` (#B84700) for persistent text on light bg. Don't reintroduce the old pattern in new pages or Stitch exports.
