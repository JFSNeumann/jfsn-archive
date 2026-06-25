# JFSN Current State
**Last updated:** 2026-06-24

This file describes what's currently true about the site. For ranked work, see `IMPROVEMENTS.md`. For the design brief and architecture, see `CLAUDE.md`. For the session-by-session historical log, see `docs/sessions-archive.md` or `git log`.

---

## 2026-06-25 — v2 rollout begun: homepage cleaned, depth-hero piloted, archive simplified

**What changed (all committed + pushed to GitHub; NOT yet deployed to jfsn.com):**
- **Homepage cleanup ✅** — stripped the accreted broken motion from `index.html`: invalid `translateY(24px) blur(4px)` reveal, dead `#featured-grid` column-count block, leftover `perspective:1000px`, duplicate reduced-motion block, unused skeleton shimmer + its stylesheet link, three stray `border-radius:2px`, gradient section divider + nav-dot connector, a duplicate scroll-reveal observer, and a redundant JS grid-resize handler. Encoded the v2 "Surface treatment" rule (flat dividers, square corners, gradients only as functional scrims) in `DESIGN-SYSTEM.md`.
- **Homepage orientation consolidated ✅** — the two modules ("Navigate the Studio" mobile + "How to Explore" desktop) are now one responsive **"Where to Begin"** section (2 cols mobile, 4 cols desktop), single source of truth.
- **Homepage data integrity ✅** — "WORKS CATALOGED" was a hardcoded `0` with an unused `data-counter`; now a static `1,084` (honest with JS off). Featured-card metadata had `opacity:0` inline (a hover/JS gate); now always-visible (anime.js fade-in still runs as load choreography).
- **`timeline.html` retired ✅** — file deleted; delinked from 3 HTML pages, `stamp-nav.sh`, `build_catalog.py` sitemap, and 4 docs.
- **Depth-hero piloted on TWO pages ✅** — `lost.html` and `chromatic.html`. Same named primitive: display-type parallax (the big Playfair word drifts up faster than scroll, capped 64px) + a load-choreography stagger; the artwork plane (photo / river canvas) stays locked at 1.0×. Gated for `prefers-reduced-motion` (early-return) and JS-off (no hidden initial state). **Lighthouse: lost.html scored 97 perf / 100 a11y WITH the motion — the pattern costs ~nothing.** Ready to roll out to more pages.
- **`archive.html` simplified ✅** — removed the Session-77 interaction layer (fc-ripple/badge/swatch/peek + quick-preview modal: ~120 CSS + ~80 JS lines). Now matches the homepage's "image + always-visible caption" model. Kept the accent bar, view-transition morph, filters, sort.
- **Fresh perf baseline ✅** — `PERF_BASELINE.md` now has real Lighthouse 12.8.0 numbers (was never measured before).

**Open threads — next real building work:**
- **Homepage performance is the next real project.** Lighthouse perf **54**, dragged down by **TBT 1,180ms** — the homepage loads hero rotation + river canvas + wall band + ~12 `_shared/*.js`. FCP/LCP/CLS are fine (0.7s / 2.2s / 0); the main thread is just busy. Defer/trim homepage JS. Focused effort.
- **4 homepage-specific a11y issues** (it scores 90; lost.html scores 100, so not sitewide): a contrast pair, non-sequential heading order, a visible-label/aria-label mismatch on bracket links, and sub-44px touch targets. See `PERF_BASELINE.md`.
- **Roll the depth-hero out to more pages** — about.html, start-here.html, the theme pages. The artwork DETAIL page stays quiet (no depth-hero on a single-work view).
- **Deploy when ready** — none of today's work is live on jfsn.com yet.

**Decided 2026-06-24 — do not reopen:**
- `curatorial-map.html` → **KEEP as-is** (the earlier "rebuild as a relationship visual" idea is reversed).
- Voice threading (oral history on the works) → **deferred to the final phase**; not live work now.

---

## Site is live at
- **jfsn.com** — cPanel/HostGator, the only host. Netlify (secondary mirror) and the Companion AI chat feature were removed 2026-06-22.

## Archive stats
- 1,084 works cataloged, 0 errors
- Covers 1974–present (5 decades)

## Backup
Four redundant stores, listed in update order at end-session:
1. GitHub (`origin/main`) — last known commit as of this writing: `a9e8bf09` (uncommitted doc-audit work sits on top of this as of 2026-06-22)
2. Local Mac (working tree)
3. JEFFS-4TB external drive (rsync, nightly LaunchAgent at 11 PM)
4. Backblaze B2 cloud (LaunchAgent at 9 PM nightly; rides `session-end.sh` / manual `cloud-backup.sh` when capped — daily cap resets ~midnight GMT / ~8 PM EDT) — **last B2 timestamp not verifiable from this session:** `~/Library/Logs/jfsn-cloud-backup.log` is empty and last modified 2026-06-15. Worth checking the LaunchAgent is still actually firing, not just assuming it is because it's scheduled.

Refresh this section at the end of each session with the latest commit hash + last B2 backup timestamp.

---

## 🔴 Critical open items

**FTP password publicly exposed, still active, cannot be rotated.** cPanel/HostGator account access is unavailable and Pure-FTPd has no self-service password change (proven by live test 2026-06-12). Do NOT chase cPanel rotation. Impact is bounded: the archive is replicated 4× and only live-site defacement is at risk. Rotation is **ON HOLD by Jeff** — every public copy of the credential is now removed or blocked (see `CREDENTIAL-EXPOSURE-REPORT.md`, session 34). **Domain note (corrected 2026-06-16):** Jeff owns and pays for the jfsn.com Gandi account directly (invoice confirmed) — there is no friend in the loop, and migrating off HostGator does not require contacting anyone else. Authoritative record: `docs/FINAL-DOMAIN-AND-PRESERVATION-HANDOFF.md` §5 (closed).

---

## Standing known issues

- **`sw.js` CACHE_V auto-bump is partial** — `build_catalog.py` only bumps `CACHE_V` when catalog content changes. Manual bump required after HTML/CSS/JS edits that don't trigger a catalog rebuild. Check `git diff sw.js` before deploy.
- **`index.html` has no `FOOTER:START` marker** — custom homepage footer, not stamped by `stamp-nav.sh`. Edit directly if footer changes.
- **Decade pages (1970s–2020s.html) not in `stamp-nav.sh`** — different token system (Material Design). Edit directly for any nav/footer changes. They DO load `_shared/ui.css` and `_shared/ui.js`.
- **`about-portrait.jpg`** — only JPEG remaining in the asset pipeline; all artworks are AVIF. Low priority.
- **No physical dimensions in catalog** — `build_dims.py` reads pixel dimensions (for masonry layout). Physical artwork dimensions (inches/cm) require Jeff to measure surviving works; no tooling exists.
- **Grid/search/favorites year labels show bare decade** — only artwork detail pages + API carry the "(est.)" honesty label. See IMPROVEMENTS.md if this should be extended.

---

## What's on the homepage (current as of 2026-06-21)

The Selected Works grid uses CSS Columns masonry (4→3→2 cols responsive). Each card is a faithful image with an always-visible title/year/medium caption beneath it and a single link to the artwork page. Hover/focus shows a quiet orange outline (#e05900) — no scale, brightness, title color-shift, overlay, medium badge, color swatch, click ripple, 3D tilt, or quick-preview modal. The Session-77 `fc-*` interaction layer was cut in the 2026-06-21 simplicity pass.

`archive.html` still carries that Session-77 interaction layer — flagged in IMPROVEMENTS.md as a candidate for the same consistency pass if/when Jeff asks.

---

## Recent session history

See `docs/sessions-archive.md` for the full session-by-session narrative log (sessions 28 through 78+). For the last few sessions' highlights, see `IMPROVEMENTS.md` § "Completed" or `git log --oneline -20`.
