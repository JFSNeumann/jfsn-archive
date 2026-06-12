# Current State
**Updated:** 2026-06-12 (session 33 — integrity audit, hero AVIF deploy fix, domain docs preserved)

## What was done session 33 (2026-06-12)
- **Domain & preservation handoff finalized** — `docs/FINAL-DOMAIN-AND-PRESERVATION-HANDOFF.md` + the three DOMAIN-RECOVERY-* docs. Key facts: Jeff is the Gandi registrant of record for jfsn.com (paid to 2027-03-05, unlocked, in a friend's account); the FTP password **cannot be rotated** (no cPanel access, Pure-FTPd has no self-service change) — the "rotate in cPanel" guidance below is SUPERSEDED. Keystone action: Jeff contacts the friend (see handoff §9).
- **Full integrity audit** — internal links, image pipeline (1,084/1,084 full+mini+thumbs), sitemap, live spot-checks: clean. audit-nav 11/11.
- **FIXED: live hero 404s** — session 32's HTML had been deployed but the 6 new hero AVIFs were never uploaded; 6 of 10 hero slides 404'd on the live homepage. Uploaded flat to /artworks/ via lftp, verified all 200 via the rewrite path (2026-06-12).
- Committed + pushed + backed up the domain-recovery docs (were single-copy on the laptop).
- **Exhibition Record VERIFIED by Jeff (typed, no audio)** — all six shows happened, with corrections: CIA was a 1978 *student* exhibition (not 2022 alumni), 78th Street was 2009 (not 2019), Waterloo Arts was 2006 (not 2016), the 2008 solo was at Grumpy's Cafe (not Negative Space), 2003 was at the Cleveland Center for Contemporary Art. Most recent real show: 2012. about.html corrected, deployed via lftp, verified live. Testimony: master-notes **§27**. Open: exhibition type for the 2003 row (one word from Jeff).
- **fine-art-2000 lead closed** — Jeff confirmed all 14 works from the ~2000 site are already in the catalog (not lost). Materials testimony captured: USPS/FedEx package containers, CDs, Targets (§27).
- sw.js CACHE_V bumped to `jfsn-20260612124500` (about.html change), deployed.
- end-session.sh/backup.sh fixed: benign count mismatch no longer aborts before cloud backup; dest count now uses source-side filters.

## What was done session 32 (2026-06-11 — index.html only)
- **Chromatic River band** — full-bleed canvas under the hero (desktop + mobile): all 1,084 works as chronological color slices from chromatic.json; hover tooltip, click-through to artwork, decade labels with collision-skip; links to chromatic.html. Sections hide themselves if chromatic.json fails to load.
- **The Wall band** — full-bleed grid above the Lost banner (desktop 4 rows, mobile 3): even chronological sample of mini thumbnails sized to fill exact rows, color-block backgrounds from chromatic.json, links to wall.html. Replaced the plain "View all" text links (desktop CTA now reads "Browse with filters →").
- **Hero detail→reveal** — Ken Burns drift replaced with scale(1.7)→1 pull-back from a per-slide focus point (`kb-reveal`). featured-hero.txt gains optional 4th field `reveal-origin`; defaults to object-position. prefers-reduced-motion still disables all hero animation.
- **"In His Own Words" card** — in About This Archive (desktop) + own section (mobile). VERBATIM quote only: "Something that still had a life left in it." (master-notes §verified, already on stories.html). Contains an `AUDIO:WHEN-RECORDED` comment template for the future "Why I Make Things" recording — **no fabricated quotes, ever; Jeff declined-by-rule.** Audio publishes only with Jeff's explicit approval.
- **Mobile "About This Archive"** — compact section after the river band (Playfair lead, two prose paragraphs, 2×2 stats grid); the In His Own Words card now lives inside it. Mobile visitors finally get the framing prose desktop always had.
- **Mobile folio perf** — folio images switched `artworks/full/` → `artworks/medium/` (3.1MB → 820KB; art0380 alone was 2MB).
- **favorites.html duplicate footer removed** — old unmarked footer deleted; stamped FOOTER:START block is the only one. All other pages verified single-footer; audit-nav passes.
- **Hero caption corrected** — now "XXXIII Días — imagined installation (Photoshop composite) · 2022 · COLLAGE" in all 4 locations (2 static captions, JS FALLBACK, featured-hero.txt). Wording applied per Jeff's "do all"; he can supply different words any time (one-line change).
- **Hero pool expanded 4 → 10** — added art0585 Cube Grid 1970 · art0250 Crown Tower 1990 · art0779 Defining Years 2000 · art0392 Art Machine 2010 · art0663 XXXIII Aunt Mary 2010 · art1020 Clockwork Targets 2020 (picked from favorites.txt, composite-titled works excluded, visually checked). Each has a curated reveal-origin in featured-hero.txt. New files: `artworks/full/artNNNN-hero.avif` ×6 (byte-copies of the full images — already in hero size/quality range). **⚠️ DEPLOY: the 6 new hero AVIFs must be uploaded FLAT to /artworks/ on HostGator (NOT /artworks/full/)** — the .htaccess rewrite sends `artworks/full/*-hero.avif` requests to `/artworks/`. lftp: `put artworks/full/art0585-hero.avif -o /artworks/art0585-hero.avif` (repeat for art0250, art0779, art0392, art0663, art1020).
- **Lost banner ghost tiles** — three empty 20px outlined frames beside the banner text (both mobile + desktop copies); motif borrowed from lost.html's ghost grid; static, aria-hidden.
- **"Open one at random"** — link in both Wall band headers; picks a random work from the already-fetched chromatic.json on each click; falls back to archive.html if data never loaded.
- sw.js CACHE_V bumped to `jfsn-20260611180000`. No new Tailwind utilities (no CSS rebuild needed). Verified in preview: desktop + mobile, zero console errors.
- ~~⚠️ Not yet deployed~~ **DEPLOYED** — session 32 HTML went live via JFSN.app; the 6 hero AVIFs were uploaded + verified 2026-06-12 (session 33). The hero caption truth issue was RESOLVED (see Hero caption bullet); gallery-images.html intro/meta is the remaining composite-wording item (IMPROVEMENTS.md 🟡).

## Deploy status
Sessions 25–32 **deployed** to HostGator (session 32 HTML verified live 2026-06-12; hero AVIFs uploaded same day). Sessions 29–31 + 33 are documentation-only beyond the AVIF upload.

## ⚠️ Critical open item — UPDATED 2026-06-12
**The FTP password is publicly exposed, still active, and CANNOT be rotated** — cPanel/HostGator account access is unavailable and Pure-FTPd has no self-service password change (proven by live test 2026-06-12). Do NOT chase cPanel rotation. Impact is bounded: the archive is replicated 4× and only live-site defacement is at risk. Durable fix: recover jfsn.com (Jeff contacts the friend holding the Gandi account), move serving off HostGator, let the hosting lapse. Authoritative record: `docs/FINAL-DOMAIN-AND-PRESERVATION-HANDOFF.md`. Within-reach mitigation: delete the Allison PDF from the webroot over FTP (write access still works).

## What was done session 31 (2026-06-11 — verification, no site changes)
- Re-verified all session-30 review findings from scratch (credential exposure, backup gaps, narrative claims). Companion cleared; old-site origin of the exhibition table disproven.
- **Git forensics on about.html "Exhibition Record":** grew from hidden "TBD gallery" placeholders into six specific venues in a technical commit (438fb034, 2026-05-30) — no source. Recorded as master-notes **§26** with the question protocol for Jeff.
- Found master-notes §20–25 + lost-works-register.md + SESSION-29-CHECKPOINT.md existed in ONE copy (laptop only — git, GitHub, 4TB, B2 all stale). Committed, pushed, and backed up this session.
- Created `docs/SESSION-31-PRESERVATION-HANDOFF.md` — full truth report, classification, quick wins, unresolved questions.
- IMPROVEMENTS.md cleaned (duplicates/stale removed, 🔴 security items added).

## What was done this session (2026-06-10 — session 28)

### UX/UI + micro-interactions overhaul

**Micro-interactions (_shared/jfsn-interactions.js):**
- Custom cursor ring: replaced `margin` offset hack with `translate(rx - r, ry - r)` centered positioning — no drift on expand/contract
- Cursor sitewide: `cursor: none` now applies to `body *` (was only on artwork areas); ring also expands on `a` and `button` elements
- Cursor velocity scaling: lerp factor scales 0.13→0.38 based on per-frame mouse speed — ring snaps tighter on fast swipes
- Letter-settle: fires via IntersectionObserver (threshold 0.2) when element enters viewport, not on page load; total stagger capped at 260ms regardless of heading length
- Film grain: skipped entirely on touch devices (was running on mobile at ~20fps, burning battery, invisible at 2.8% opacity); pauses when browser tab is hidden
- Serendipity images: full-res `artworks/` served (was thumbnail quality); next image preloaded in hidden `Image()` after each `onload` for instant transitions
- Serendipity path resolution: replaced slash-counting hack with proper `pathname` strip; works from any directory depth
- Serendipity `→` / spacebar: advances slideshow manually, resets interval timer
- Serendipity swipe-left: touch gesture on overlay advances to next work (40px threshold, passive)
- Serendipity hint text: context-aware — touch devices see "Tap to open · Swipe left to advance"; desktop sees keyboard shortcuts
- Serendipity image size on mobile: `94vw` (was `80vw` = 300px at 375px); reverts to `min(80vw, 860px)` above 600px
- Serendipity focus trap: Tab cycles only within open dialog; focus moves to ESC button on open
- View transition: timeout reduced 100ms → 80ms

**Nav fade (_shared/top-nav.html, stamped to all 31 pages):**
- `header::after` with `rgba(11,11,11,0.07)→transparent` over 40px below nav border; subtle depth below fixed header

**artwork.html:**
- Desktop metadata column: `← → BROWSE WORKS` hint with `border-top` separator below COPY LINK — anchors empty space in right column
- Mobile: gradient title overlay at bottom of image (`rgba(11,11,11,0.58)` → transparent); title + year visible without scrolling; hidden on md+

**stories.html + why-i-made-things.html:**
- Mobile jump nav: collapsible "JUMP TO SECTION ↓" bar between page header and content; chevron rotates on open; collapses on link tap; hidden on md+ (sidebar TOC handles desktop)

**about.html:**
- Portrait photo: saturation overlay treatment matching artwork thumbnails — grey-at-top at rest, full colour on hover; inline `<style>` scoped to page

**collage.html / sculpture.html / photography.html / painting.html:**
- "Browse with filters →" extracted from `<p>` and promoted to full-width bordered button on mobile; reverts to inline link on 768px+

**lost.html:**
- Ghost grid label updated to "WORKS WITHOUT IMAGES — ESTIMATED 500–1,000" in #c4c7c7

**start-here.html:**
- Sidebar quote cards ("On loss", "On finishing"): `border-left: 2px solid #FF6600`, quote text to `#0B0B0B`, font-size 13px

**sw.js:** CACHE_V bumped to `jfsn-20260610235900`

**Files modified:**
- `_shared/jfsn-interactions.js` — full micro-interactions overhaul
- `_shared/top-nav.html` — nav fade added, stamped to all 31 pages
- `artwork.html` — desktop keyboard hint, mobile title overlay
- `stories.html` — mobile jump nav
- `why-i-made-things.html` — mobile jump nav
- `about.html` — portrait hover treatment
- `collage.html` — browse CTA, CSS
- `sculpture.html` — browse CTA, CSS
- `photography.html` — browse CTA, CSS
- `painting.html` — browse CTA, CSS
- `lost.html` — ghost grid label
- `start-here.html` — quote card visual weight
- `sw.js` — CACHE_V bumped

**⚠️ Not yet deployed — run JFSN.app**

---

## What was done last session (2026-06-10 — session 27)

*(see SESSION-26-CHECKPOINT.md for full detail)*

Session 25: Header/footer UX pass — hide-on-scroll, backdrop blur, ⌘K badge, back-to-top, dynamic copyright year, email to col 1, col 4 renamed ABOUT.

Session 26: start-here.html spacing, footer breathing room (pb-8 stamped sitewide), jeff.html full revision, sitewide content audit (all clean).

---

## To do next session
- [ ] **Deploy** — sessions 25–28 not yet on HostGator. Run JFSN.app.
- [ ] **Oral history** — "Why did Jeff keep going after the Rauschenberg realization?" — most important unanswered question. Approach gently.
- [ ] **start-here.html** — read aloud together. Oral history content is in; review for accuracy and voice.
- [ ] **Physical dimensions for surviving works** — requires Jeff to measure. No tooling exists. Essential for heirs.
- [ ] **HSTS** — uncomment one line in `.htaccess` once SSL confirmed active in HostGator cPanel.
- [ ] **favorites.html fetch size** — still uses full `catalog.json` (898KB); easy fix but low priority.

## Known issues (standing)
- **sw.js CACHE_V** — `build_catalog.py` auto-bumps only when catalog content changes. Manual bump required after HTML/CSS/JS edits without catalog rebuild.
- **index.html has no FOOTER:START marker** — custom homepage footer, not stamped. Edit directly if footer changes.
- **Decade pages not in stamp-nav.sh** — edit 1970s–2020s.html directly for any nav/footer changes.
- **about-portrait.jpg** — only JPEG in the asset pipeline; all artworks are AVIF. Low priority.
- **No physical dimensions in catalog** — `build_dims.py` reads pixel dimensions (masonry layout). Physical artwork dimensions (inches/cm) require Jeff to measure; no tooling exists.

---

## Site is live at
- jfsn.com  (primary — cPanel)
- jfsn-archive.netlify.app  (secondary — Netlify, has Companion function)

## Archive stats
- 1,084 works cataloged, 0 errors

## Backup status
**Last B2 backup:** 2026-06-12 12:22:32
