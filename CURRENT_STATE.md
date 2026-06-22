# JFSN Current State
**Last updated:** 2026-06-22

This file describes what's currently true about the site. For ranked work, see `IMPROVEMENTS.md`. For the design brief and architecture, see `CLAUDE.md`. For the session-by-session historical log, see `docs/sessions-archive.md` or `git log`.

---

## Site is live at
- **jfsn.com** — primary, cPanel/HostGator
- **jfsn-archive.netlify.app** — secondary, Netlify, has the Companion function + artwork-meta edge function

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
