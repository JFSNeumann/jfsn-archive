# JFSN Session Handoff Prompt
**Generated:** 2026-06-16 (end of session 45)
**Copy everything below the line and paste it to start the next session.**

> Note: the **v3 verification-first start prompt** (in memory `jfsn_session_prompts.md`) is the primary way to open a session — it checks backups + live drift first. This file is the ranked *work* handoff to use after that.

---

Read `/Documents/JFSN/CURRENT_STATE.md` and `/Documents/JFSN/IMPROVEMENTS.md` before doing anything. Then work the ranked items below in order.

**Project:** JFSN Archive — personal archive site for Jeffrey F. S. Neumann, 1,084 works. A *preservation project*, not a website project — optimize for completion, not ambition. Making is the point; never push outreach/promotion.
- Live: **jfsn.com** (HostGator/cPanel, primary) and **jfsn-archive.netlify.app** (Netlify — has the Companion function + artwork-meta edge function)
- Stack: vanilla HTML/CSS/JS, Tailwind compiled to `site.min.css` (no CDN), service worker, no frameworks
- Design system: light/bone-white (`#fcf9f3`), deep-ink (`#0B0B0B`), orange accent (`#FF6600`), warm-brown archival borders (`#8e7164`/`#e3bfb1`), Playfair Display headings, Inter UI, monospace bracket-buttons (`[ LABEL → ]`) for actions. No gradients, no rounded corners, 1px borders.
- **Nav: Archive · About · Stories · Lost (4 items) + ⌘K search.** Series + Companion are footer-only.
- **Mobile nav is a hamburger → slide-in drawer** (`#mobile-menu-drawer`), NOT a fixed bottom bar.
- **Icons: inline feather-style SVGs only** (24-viewBox, 1.8 stroke, `currentColor`). No icon fonts.
- Deploy: `bash end-session.sh` (git commit + push + 4TB rsync + Backblaze B2) → deploy to HostGator via **JFSN.app** desktop app (NOT `deploy.sh` directly — that's what the app wraps). Hero AVIFs (`artNNNN-hero*.avif`) need a **separate flat lftp upload to `/artworks/`** — `deploy.sh` excludes `artworks/full/*.avif` from the normal mirror.
- Footer/nav: edit `_shared/top-nav.html` / `_shared/footer.html`, then `bash stamp-nav.sh` (now **38 pages**, including the 6 decade pages and the new `curatorial-map.html` as of session 45).
- **CSS rebuild:** `npm run build:css` after any new Tailwind utility, then bump `CACHE_V` in `sw.js`. Most session-45 work used inline `<style>` + existing classes only — no rebuild needed. `build_catalog.py` auto-bumps CACHE_V only when catalog content changes — check `git diff sw.js`.
- **New page checklist** (just used for `curatorial-map.html`): add to `build_catalog.py`'s sitemap `entries` list + rerun it, add to `stamp-nav.sh` TARGETS, add a footer link if it should be discoverable, run `audit-nav.sh` to confirm sitemap coverage.
- **B2 daily cap:** Backblaze hits a transaction cap most days; resets midnight GMT (≈ 8 PM EDT). **Currently capped as of session 45 close** — run `bash cloud-backup.sh` after the reset. GitHub + 4TB are current through commit `e8befe4d`.

---

## What happened in session 45 (long session, several continuations)

1. **Full global review** across security, deploy hygiene, content integrity, performance, backlog health, and visual coherence (the user explicitly asked for this). Found and closed two real issues: internal dev-tool pages (`curate.html`/`dedupe.html`/`qa.html`/`curate-session.json`) were live on jfsn.com despite being local-only tools — now excluded from both deploy scripts and removed from HostGator; and IMPROVEMENTS.md had a stale "not yet deployed" item for sessions 36–44 that were actually already live.
2. **Decade pages (1970s–2020s) migrated to the Stitch nav/footer** — the single biggest visual-coherence gap on the site (they were the only pages still on the old bespoke chrome). Artwork grid/thumbnail markup on those 6 pages was deliberately left untouched — that's a separate, larger effort if ever wanted.
3. **A real performance chase, driven entirely by Jeff's own Lighthouse runs** (not guessing): found and fixed a hero-image regression (heavy image silently became the permanent preloaded LCP element when the homepage hero rotation was retired), added `srcset` to the homepage's top-3 "Selected Works" cards, and converted sitewide render-blocking Google Fonts to async preload+swap (confirmed gone from Lighthouse's insights list after deploying). Worst-case mobile LCP dropped from 8.7s to ~5.2s across the day.
4. **Two design-consistency fixes Jeff caught by eye**: restored the Selected Works hover captions he'd removed the day before (his call, not a revert of judgment — he asked to bring them back), and fixed the artwork.html full-resolution lightbox's two identically-labeled "ROTATE" buttons + its one-off button style.
5. **Three new "wow factor" features**, all requested in one go ("do all"): slideshow mode on `artwork.html`, touch scrub on the Chromatic River, and a brand-new `curatorial-map.html` page (the one navigational pillar that was named in the Stitch adoption doc but never built).

Every change above was preview-verified (desktop + mobile, console-checked) before deploying, and every deploy was confirmed live via curl against jfsn.com — not just "should be live."

---

## Ranked items — work top to bottom

### 0. Catch up B2 backup
Run `bash cloud-backup.sh` once the daily transaction cap has reset (check the time — resets ~8 PM EDT). GitHub and the 4TB drive are current; only B2 is behind.

### 1. Ask Jeff for one more Lighthouse mobile run
Session 45 fixed three concrete, verified things in response to four rounds of his real Lighthouse data. One more run will show whether the LCP swing has genuinely settled (~1.6–5s range) or whether there's still something concrete left, vs. just Lighthouse's own simulated-throttling noise. Don't speculate on numbers — wait for his data like this session did.

### 2. Decide whether to spend a session on the decade-page artwork grids
Session 45 gave the 6 decade pages (1970s–2020s) nav/footer/border/CTA parity with the rest of the site, but deliberately did NOT touch their masonry grid/thumbnail markup (different system from the `.thumb__link` saturation-overlay treatment used elsewhere). That's the one remaining visual-system split on the site. Worth asking Jeff if it's worth the effort — it's a real chunk of work, not a quick pass.

### 3. Oral history — unanswered questions
See `docs/oral-history/master-notes.md` "Unresolved Questions." Top item: why did Jeff keep going after the Rauschenberg realization? Approach gently, in his own time — this needs Jeff, not autonomous work.

### 4. Physical artwork dimensions
Orientation stand-in (vertical/horizontal/square) shipped session 35. Actual inches/cm need Jeff to measure surviving works by hand — no tooling exists for this. Start with the most significant pieces if he wants to begin.

### 5. Accessibility pass (low urgency, but real)
Lighthouse a11y sits at 93–96, not 100. Check small uppercase `#575757` labels' contrast on bone-white, `:focus-visible` states, and icon-button labels against the project's stated WCAG-AA goal. Bounded, verifiable, doesn't need Jeff's input first — a good one to just do.

### 6. Always available
Ingest new work: drop photos into `artworks/inbox/`, run `bash add-works.sh`.

---

## Standing rules (don't relitigate these)
- **Never reintroduce:** grayscale thumbnails, scale-on-hover, sibling-dim, hero overlays with promotional copy, fabricated provenance/verification/DPI/quotes. Composite ("imagined placement") works must keep their honesty note; years stay decade estimates ("1990s (est.)").
- **The image is the primary object — UI recedes.** This is why captions/badges/decoration get questioned by default, and why three different sessions have removed and re-added the Selected Works captions — it's a real, live tension Jeff is still tuning, not a settled question.
- **Don't recommend big documentation projects.** The best preservation work is work Jeff will actually enjoy doing.
