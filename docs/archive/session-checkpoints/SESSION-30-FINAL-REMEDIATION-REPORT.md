# SESSION-30 — Final Remediation Report

**Date:** 2026-06-11
**Audience:** a future custodian with no access to the conversations behind it.
**Companion documents:** `SESSION-30-REMEDIATION-CHECKPOINT.md` (the gate this session passed through), `CREDENTIAL-EXPOSURE-REPORT.md` (live status of the leaked password), `OLD-SITE-PRESERVATION-INVENTORY.md` (the recovered earlier web presence), `SESSION-31-PRESERVATION-HANDOFF.md` (the wider truth report), `oral-history/master-notes.md` §22/§25/§26 (creator corrections — always authoritative).

---

## 1. What happened

A maintainer/preservation review (2026-06-11) found that the live FTP password for jfsn.com was publicly readable — hardcoded in `tools/utils/make_handoff.py` and embedded in a handoff PDF, both published on the primary site, the Netlify mirror, and the public GitHub repo. The same review found the archive's most-citable false history (an unverified six-show "Exhibition Record" on about.html — see master-notes §26), and that several irreplaceable documents existed in exactly one copy.

This session prepared and verified remediation under one rule: **preservation before cleanup**. Nothing was deleted anywhere. Git history was not rewritten (deliberately — it is provenance evidence). The single live change was additive: an `.htaccess` rule that stopped jfsn.com from serving Python source.

## 2. What was discovered

- `old-site/` on the server — Jeff's complete pre-2026 web presence, existing **nowhere else on earth** — 12,914 files / 1.5 GB: his resume, a decade of dated site generations (2014–2023), the earliest digital art site (`fine-art-2000`, ~23 artwork JPEGs that may show works lost to the water damage), grandson material, the Brand Brain design product with Unilever client work, a 21-second WAV of unknown content (possibly the only audio of Jeff — he should listen: `old-site/BB/audio/sample.wav`), and a pre-AI catalog metadata snapshot proving the works' digital titles were originally bare numbers. Full inventory: `OLD-SITE-PRESERVATION-INVENTORY.md`.
- `curate-session.json` on the server (server-only) — 757 curation decisions including four themes that never became site pages (Aviation, Reliquaries, Studio, Art School). Preserved to `docs/server-artifacts/curate-session-2026-06-11.json`.
- Netlify had been serving a stale ~June-7 snapshot (deploys quietly stopped), which delayed — but did not prevent — exposure of the oral-history documents committed since.

## 3. What was preserved

| Asset | Before | After |
|---|---|---|
| old-site (1.5 GB, 12,914 files) | 1 copy (server) | **4 copies**: server + Mac (conclusively verified: dry-run comparison, zero diffs) + JEFFS-4TB (verified: zero content files missing; only regenerable npm packages/.DS_Store excluded) + Backblaze B2 (see §6) |
| curate-session.json | 1 copy (server) | server + repo docs/ (+ backups) |
| master-notes §20–26, lost-works register, all checkpoints | secured earlier the same day | 4 copies maintained |
| Git history incl. leaked-credential commits | intact | intact — **kept deliberately** as archival evidence |

## 4. What was fixed (and how to undo each)

- **Live:** `.htaccess` — `py|toml|lock` added to the deny block; jfsn.com/tools/utils/make_handoff.py went 200→403 with site/API verified healthy. Rollback: `/tmp/htaccess.rollback`, or git history.
- **Committed locally (push pending approval):** `tools/utils/make_handoff.py` reads credentials from `.ftp.env` (the hardcoded password is gone from source — never `git checkout` the old version); the credential PDF untracked + gitignored; `deploy.sh` excludes by class (`*.py`, `*.pdf`, `*.md`, `docs/*`, configs) — proven against the real server by dry-run; `_redirects` gained 42 forced-404 rules for Netlify (docs, scripts, configs, the PDF, itself); `cloud-backup.sh` now includes old-site.
- **Verification record:** audit-nav 11/11; Companion answered live; handoff PDF regenerates from `.ftp.env`; API/catalog/images 200 after the live change; Netlify rules cover **47/47** sensitive tracked files and block **0** public pages.

## 5. What remains unresolved

1. **THE PASSWORD IS STILL LIVE AND STILL LEAKED.** Rotation in HostGator cPanel is the only resolution. Everything else is containment. → `CREDENTIAL-EXPOSURE-REPORT.md`
2. The push (carries the Netlify protections; ends GitHub-tip and Netlify exposure) — approved-pending.
3. Server deletions of the four exposed/leftover files — approved-pending, all preserved elsewhere first.
4. The oral-history PDF (`jfsn.com/docs/oral-history/JFSN-Oral-History.pdf`, also GitHub) is publicly downloadable — **Jeff's privacy decision, not a defect.**
5. Content integrity items needing Jeff's testimony: the about.html Exhibition Record (six rows, proven sourceless — master-notes §26), gallery-images.html intro, homepage hero composite caption.
6. Research enabled by this session: cross-reference `old-site/old/fine-art-2000/images/` against the catalog (lost-work candidates); Jeff listens to `old-site/BB/audio/sample.wav`.

## 6. Pre-deployment checklist (run before the next push/deploy, any host)

- [ ] `_redirects` present in the commit, with the forced-404 (`404!`) block rules intact — **never push without it**
- [ ] Coverage check passes (47/47): sensitive tracked files all covered, zero .html pages blocked (script in session log; re-run: compare `git ls-files` classes vs `_redirects` rules)
- [ ] `deploy.sh` dry-run shows no `*.py`, `*.pdf`, `*.md`, or `docs/` in the transfer plan
- [ ] `tools/utils/make_handoff.py` in the commit contains **no literal password** (grep the file for the old and current password strings — both must return zero)
- [ ] PDF absent from `git ls-files`
- [ ] After Netlify deploys: spot-check `https://jfsn-archive.netlify.app/tools/utils/make_handoff.py`, `/JFSN-Archive-Handoff-Allison.pdf`, `/docs/oral-history/master-notes.md`, `/CURRENT_STATE.md` → all must be 404; `/`, `/archive.html`, `/companion.html`, Companion function → working
- [ ] After any HostGator deploy: `/tools/utils/make_handoff.py` 403, `/catalog.json` 200, `/api/v1/works.json` 200

## 7. What should happen next, in order

1. Jeff rotates the FTP password (cPanel) → update `.ftp.env` → regenerate + print the Allison PDF.
2. Push (with checklist §6) → verify Netlify per checklist.
3. Approved server deletions → verify each with curl → update `CREDENTIAL-EXPOSURE-REPORT.md` statuses to "dead credential."
4. Jeff decides oral-history PDF visibility.
5. Back to the preservation priorities that outrank all of this (master-notes §25): the one-minute audio recordings, the Exhibition Record question, the lost-works register.

## 8. B2 verification addendum

**VERIFIED 2026-06-11.** `cloud-backup.sh` completed (exit 0). `rclone size b2:jfsn-archive/old-site`: **12,216 objects / 1,583,901,811 bytes (1.475 GiB)** — exactly the local copy (12,914 files) minus the 698 third-party npm files under `old-site/index/node_modules/` that the sync excludes by design (regenerable from the backed-up package.json). Spot checks on B2: `Jeff Neumann Resume.pdf` (52,124 B) and `BB/audio/sample.wav` (6,145,156 B) both present. **old-site now exists in four locations: HostGator (original, untouched), the Mac (byte-complete, conclusively verified), JEFFS-4TB, and Backblaze B2.**
