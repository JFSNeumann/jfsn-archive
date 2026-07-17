# SESSION-30 — Remediation Checkpoint

**Date:** 2026-06-11
**Covers:** the sessions 30–31 review → verification → remediation-preparation arc.
**State at this checkpoint: nothing deleted, nothing deployed, nothing pushed, no credentials rotated.** One additive protection applied live (.htaccess hardening, §3) with saved rollback. Checkpoint first, actions second.

---

## 1. Verified Critical Findings

All evidence gathered fresh on 2026-06-11; nothing assumed from earlier sessions.

### 1.1 tools/utils/make_handoff.py exposure
- **Description:** The handoff-PDF generator hardcoded the live FTP password at line 144 and was being served publicly.
- **Evidence:** `curl https://jfsn.com/tools/utils/make_handoff.py` → was 200 with password in body; same file 200 on Netlify; readable unauthenticated via raw.githubusercontent.com (public repo).
- **Current status:** jfsn.com now returns **403** (.htaccess hardening, this session). Netlify copy still 200 (stale deploy; blocking rules staged, unpushed). GitHub copy still exposed until the staged fix (password removed from source) is pushed.
- **Risk level:** was CRITICAL; now HIGH (two of three avenues still open, credential still valid).

### 1.2 FTP credential exposure
- **Description:** The exposed password `(.ftp.env value)` is **still the active credential** for jeffery@jfsn.com on HostGator.
- **Evidence:** byte-identical match between the published value and `.ftp.env` used by working deploys.
- **Current status:** ACTIVE. Rotation not performed (requires Jeff, cPanel).
- **Risk level:** **CRITICAL — the gating risk.** Anyone holding it can erase or deface the public archive. (The archive itself survives in 4 stores, but the public record would go down.)

### 1.3 Allison PDF exposure
- **Description:** `JFSN-Archive-Handoff-Allison.pdf` embeds the FTP password (by design — it's a print handoff) but was published in three places.
- **Evidence:** 200 at jfsn.com, 200 at Netlify, 200 at GitHub raw.
- **Current status:** ACTIVE in all three. Local mitigations staged: untracked from git (`git rm --cached`, local file kept and regenerated), added to `.gitignore`, `*.pdf` added to deploy excludes, Netlify 404 rule written. Server deletion awaits approval (§5).
- **Risk level:** CRITICAL until rotation; HIGH after.

### 1.4 Netlify exposure
- **Description:** `netlify.toml` uses `publish = "."` with no exclusions — the mirror serves the entire repo: internal docs (CURRENT_STATE.md, IMPROVEMENTS.md, STITCH.md — all verified 200), all tooling (deploy.sh, end-session.sh, artworks/*.py — 200), tools/utils/make_handoff.py, and the PDF.
- **Evidence:** curl probes 2026-06-11. Additionally: **Netlify deploys have been stale since ~June 7** (start-here.html, stories.html, favorites.html → 404 there), so docs/oral-history content committed since then is NOT yet exposed — a time bomb, not a current leak: the next successful deploy publishes everything unless the staged `_redirects` rules ship with it.
- **Current status:** ACTIVE (stale snapshot still serves the password file). 41 forced-404 rules staged locally, unpushed.
- **Risk level:** HIGH.

### 1.5 Oral-history exposure
- **Description:** Jeff's private testimony PDF is publicly downloadable.
- **Evidence:** `https://jfsn.com/docs/oral-history/JFSN-Oral-History.pdf` → 200; GitHub raw → 200; Netlify → 404 (staleness only).
- **Current status:** ACTIVE. This is a **privacy decision, not a defect** — only Jeff can say whether his testimony is meant to be public. Note master-notes.md (the full oral-history record) has been public on GitHub by long-standing practice.
- **Risk level:** privacy-dependent; technical risk none.

## 2. Preservation Verification — old-site

- **Source location:** `jfsn.com:/old-site/` (HostGator webroot). Before this session, the **only copy in existence** — not in git (ignored), not local, not on B2 (was explicitly excluded), not on the 4TB mirror (nothing local to rsync).
- **What it contains:** Jeff's complete pre-2026 web presence: design-portfolio pages (automobile-designs.html, ai.html, enterprise-platforms.html…), **`Jeff Neumann Resume.pdf`**, grandson material (`grandson/`, `grandson_yass_submission_2025/`, `sebastian-3.html`), nested earlier generations (`old/` 460MB, `index/` 433MB). Archival/biographical material — the undocumented design career — not technical debt.
- **File count:** **12,914 files**
- **Total size:** **1.5 GB** (far above the 197MB estimate in .gitignore — the directory holds multiple site generations)
- **Local copy location:** `/Users/jeffreyneumann/Documents/JFSN/old-site/` (gitignored; will NOT enter the public repo)
- **Download method:** `lftp mirror` (read-only on the server side), exit code 0.
- **Conclusively verified?** **Pending at checkpoint write** — a second `lftp mirror --dry-run` comparison pass (local vs. server, file-by-file) is running; "zero pending transfers" is the conclusive criterion. Result will be appended below. Spot checks passed (valid PDF resume, intact HTML).
- **Backup status:** server + local = 2 copies now. 4TB and B2 copies are queued behind your review (§6 SAFE NOW) — `backup.sh`/`cloud-backup.sh` were deliberately NOT run yet because both use delete-style sync and you said checkpoint first.

> **VERIFICATION RESULT (appended):** _see addendum at end of file._

## 3. Remediation Changes Prepared (all local; only .htaccess is live)

| File | Purpose | Exact risk addressed | Rollback path |
|---|---|---|---|
| `.htaccess` | Added `py\|toml\|lock` to the existing FilesMatch deny block. **Uploaded to HostGator** (the one live change — additive, blocks access, deletes nothing) | Password served as plain text from jfsn.com/tools/utils/make_handoff.py | `/tmp/htaccess.rollback` (pre-change copy) — re-upload via lftp, ~1 min; also in git history |
| `deploy.sh` | Excludes added: `*.py`, `*.pdf`, `*.md`, `docs/*`, package.json, tailwind.config.js, deno.lock, netlify.toml | Future deploys re-uploading credentials, handoff PDFs, oral-history docs, internal notes | `/tmp/deploy.sh.rollback` or `git checkout deploy.sh` |
| `tools/utils/make_handoff.py` | Reads FTP_USER/FTP_PASS from `.ftp.env` at runtime; hardcoded password deleted from source | A live secret sitting in a public GitHub repo | `git checkout tools/utils/make_handoff.py` (restores old version — do NOT, it contains the password) |
| `_redirects` | 41 forced-404 rules (`/docs/*`, all root .md, all .py/.sh tooling, the PDF, config files) ahead of the existing catch-all | Netlify serving internal documentation and tooling; the stale-deploy time bomb | `/tmp/redirects.rollback` or `git checkout _redirects` |
| `.gitignore` | `JFSN-Archive-Handoff-Allison.pdf` added | Credential artifact ever being committed again | remove the line |
| git index | `git rm --cached JFSN-Archive-Handoff-Allison.pdf` (staged) — local file kept and regenerated | PDF in the repo tip → on GitHub and in every Netlify deploy | `git restore --staged JFSN-Archive-Handoff-Allison.pdf` |
| `cloud-backup.sh` | Removed `--exclude "old-site/**"` (with explanatory comment) | old-site having no cloud copy | re-add the exclude line |
| `docs/server-artifacts/curate-session-2026-06-11.json` | NEW — preserved server-only curation state (757 theme assignments incl. unpublished themes: Aviation, Reliquaries, Studio, Art School) | A single-copy, server-only file with archival value | n/a (additive) |
| `docs/SESSION-30-REMEDIATION-CHECKPOINT.md` | NEW — this document | Session ending without a durable record | n/a |

Git history was **not** rewritten and will not be (deliberate: history is archival evidence — the §26 Exhibition Record forensics depended on it; rotation makes leaked history a dead credential).

## 4. Functional Verification

| Test | Result | Detail |
|---|---|---|
| `audit-nav.sh` | **PASSED** | 11/11 checks clean after all edits |
| Companion | **PASSED** | Live POST to `/.netlify/functions/companion` returned real matches (art0577, art0053…); `_redirects` rules do not touch function paths |
| Deployment dry run | **PASSED** | `lftp mirror -R --dry-run` with the new excludes against the real server: modified files (deploy.sh, _redirects, .gitignore, cloud-backup.sh) listed for upload; **zero** occurrences of tools/utils/make_handoff.py, the PDF, docs/, or any .md in the transfer plan |
| Handoff generation | **PASSED** | `tools/utils/make_handoff.py` runs, reads creds from .ftp.env, emits valid 3-page PDF (6,224 B); output ignored by git |
| API access | **PASSED** | After live .htaccess change: jfsn.com 200, archive.html 200, catalog.json 200, api/v1/works.json 200, AVIF thumbnails 200; tools/utils/make_handoff.py/tools/generators/gen-artwork-pages.py now 403 |
| Netlify compatibility | **PASSED (static analysis) / NOT TESTED (live)** | 41 rules: 0 block any .html page; no blocked path appears in sitemap.xml; syntax follows Netlify `_redirects` format (path-segment splats only — extension wildcards deliberately avoided because Netlify doesn't support them). Live behavior untestable until a deploy is permitted |
| Old-site preservation | **PASSED (download) / verification pass running** | exit 0, 12,914 files, 1.5GB; conclusive dry-run comparison in progress (addendum below) |

Nothing **FAILED**.

## 5. Actions Requiring Jeff Approval (will not proceed automatically)

1. **FTP password rotation** — HostGator cPanel → FTP Accounts → change password for jeffery@jfsn.com, then tell Claude (or update `.ftp.env` yourself). *Gates everything below.*
2. **Deleting server files:** `/JFSN-Archive-Handoff-Allison.pdf`, `/tools/utils/make_handoff.py`, `/tools/generators/gen-artwork-pages.py`, `/curate-session.json` from the HostGator webroot. All four now exist in ≥2 other locations (will be ≥4 after backups run); the .py files are already 403-blocked.
3. **Committing + pushing the staged changes** — push auto-triggers a Netlify deploy. The deploy *carries the 404 protections* and removes the stale exposed files there, but it is still a deploy and you said not yet.
4. **Running the backups** (`backup.sh` → 4TB, `cloud-backup.sh` → B2) — both use delete-style sync (mirror semantics); held for your nod even though no local deletions occurred this session.
5. **Oral-history visibility decision** — does `JFSN-Oral-History.pdf` (and master-notes.md on GitHub) stay public? Your testimony, your call.
6. **Netlify publication policy** — accept the 41-rule blocklist as-is, or later move to an allowlisted publish directory (§6 hardening).
7. (Standing, content not security) Exhibition Record verification row-by-row; gallery-images.html intro wording; hero caption composite marker.

## 6. Safe Next Steps

**SAFE NOW (after you review this checkpoint):**
- Run `backup.sh` + `cloud-backup.sh` → old-site and this checkpoint reach the 4TB drive and B2 (3–4 copies of everything).
- Commit + push staged hardening → GitHub stops serving the password in current source; Netlify redeploys with 404 rules, un-stales, and stops serving tools/utils/make_handoff.py/PDF.

**AFTER PASSWORD ROTATION:**
- Update `.ftp.env`; rerun `tools/utils/make_handoff.py`; print fresh PDF for Allison's folder.
- Delete the four server files (§5.2); verify each with curl.
- Re-verify the full exposure matrix end-to-end (expect: every avenue dead).

**OPTIONAL FUTURE HARDENING:**
- HSTS — uncomment `.htaccess` line ~93 (SSL verified working).
- Netlify allowlisted publish dir instead of blocklist.
- `audit-nav.sh` check asserting tools/utils/make_handoff.py/PDF return non-200 on both hosts (regression tripwire).
- Git history scrub — **recommended against**, recorded as a decision: history = provenance evidence; rotation kills the credential.

## 7. Preservation Handoff (if this session ends unexpectedly)

**Completed today:** all critical findings re-verified with evidence; jfsn.com no longer serves the password (.htaccess, live, verified, rollback at `/tmp/htaccess.rollback`); old-site (1.5GB, 12,914 files — resume, design career, grandson material) downloaded from its single-copy home to the Mac; server-only curate-session.json preserved into `docs/server-artifacts/`; every other fix written, validated, and staged locally — uncommitted by instruction.

**Pending:** Jeff's review of this checkpoint → backups → commit/push → **password rotation (the one that matters)** → server file deletions → privacy decision on the oral-history PDF.

**Must happen first:** password rotation before/with any cleanup; backups before any server deletion.

**Must never be forgotten:**
- `old-site/` is gitignored — it exists on the Mac and the server only until `backup.sh`/`cloud-backup.sh` run. **Do not clean it up; it is Jeff's biography in website form.**
- The staged git changes include the password *removal* — `git checkout tools/utils/make_handoff.py` would put the password back.
- The next `git push`, whenever it happens, MUST include the new `_redirects` — pushing without it publishes docs/oral-history on Netlify.
- The exposed password remains live until Jeff rotates it. Everything else is secondary.

---

## ADDENDUM — old-site conclusive verification result

**CONCLUSIVELY VERIFIED — 2026-06-11.** A full `lftp mirror --dry-run` comparison pass (server vs. local, file-by-file by size and timestamp) completed with exit 0 and **zero pending transfers**: the local copy is byte-complete against the server. Final numbers: **12,914 files / 1,586,489,182 bytes (1.5 GB)** at `/Users/jeffreyneumann/Documents/JFSN/old-site/`. Spot integrity checks passed (e.g., `Jeff Neumann Resume.pdf` opens as a valid 2-page PDF). old-site now exists in **two** verified locations (server + Mac); the third and fourth (4TB, B2) are one approved `backup.sh`/`cloud-backup.sh` run away.
