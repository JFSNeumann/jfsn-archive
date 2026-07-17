# Credential Exposure Report — jfsn.com FTP Account

**Created:** 2026-06-11. **Update this file whenever any status below changes.**
**For:** any future custodian. Assume no access to the conversations that produced it.

## The exposed credential

The FTP password for `jeffery@jfsn.com` (HostGator, full write access to the jfsn.com webroot) was hardcoded in `tools/utils/make_handoff.py` and embedded in the generated handoff PDF, both of which were published. **As of this report the exposed password is still the live, working credential** — verified by comparing the published value against the active `.ftp.env`.

> ## ⚠️ CREDENTIAL STILL COMPROMISED — AND ROTATION IS IMPOSSIBLE
> Blocking individual download paths does not un-leak a password. **UPDATE 2026-06-12: rotation is NOT possible** — there is no HostGator cPanel access and Pure-FTPd has no self-service password change (proven by live test; see `docs/FINAL-DOMAIN-AND-PRESERVATION-HANDOFF.md`). The durable fix is domain recovery → move serving off HostGator → let the hosting lapse. Until then, the statuses below are the complete mitigation: every public copy of the credential removed or blocked. Impact is bounded — the archive is replicated 4×; worst case is live-site defacement.

## Exposure locations and status

| # | Location | How exposed | Status (2026-06-11) |
|---|---|---|---|
| 1 | `https://jfsn.com/tools/utils/make_handoff.py` | Plain-text source served from the primary domain (deploy excluded `artworks/*.py` but not root `.py`; `.htaccess` didn't block `.py`) | **EXPOSURE BLOCKED** — returns 403 since 2026-06-11 (.htaccess FilesMatch now includes `py`). File still on server; deletion pending Jeff approval |
| 2 | `https://jfsn.com/JFSN-Archive-Handoff-Allison.pdf` | PDF with embedded credentials, uploaded because deploy excluded `*.md` but not `*.pdf` | **CLOSED 2026-06-12** — deleted from the webroot via FTP with Jeff's approval; verified 404. Re-upload prevented by deploy.sh `*.pdf` exclude (live in deploy.sh since session 31) |
| 3 | `https://jfsn-archive.netlify.app/tools/utils/make_handoff.py` | Netlify published the whole working dir (`publish="."`); was serving a stale June-5 snapshot | **CLOSED 2026-06-12** — verified 404. Mirror refreshed via curated CLI deploy (sensitive files excluded from the upload entirely + `_redirects` forced-404 rules now live as second layer). Site has NO git integration — deploys are manual CLI only |
| 4 | `https://jfsn-archive.netlify.app/JFSN-Archive-Handoff-Allison.pdf` | Same | **CLOSED 2026-06-12** — verified 404 (same deploy; the PDF is not in the deploy at all) |
| 5 | GitHub repo, current tip — `tools/utils/make_handoff.py:144` | Public repository, unauthenticated raw access | **CLOSED** — pushed session 30; re-verified 2026-06-12: raw tip serves the `.ftp.env`-reading version, 0 password occurrences |
| 6 | GitHub repo, current tip — the PDF | Same | **CLOSED** — pushed session 30; re-verified 2026-06-12: raw tip returns 404 (history copies remain, see #7) |
| 7 | Git history — the password appears in ≥2 commits (e.g. 8c8ac871, 793a0e7f) and the PDF in several | Public repository history | **PERMANENT BY POLICY** — history will NOT be rewritten (deliberate archival decision: commit history is provenance evidence; the Exhibition Record forensics in master-notes §26 depended on it). Made harmless by rotation |
| 8 | `.ftp.env` (Mac), printed PDF copies, 4TB/B2 backups | Private credential stores | **NOT EXPOSURES** — these are where credentials are supposed to live. (.ftp.env was never committed; verified 403/absent on both hosts) |
| 9 | `https://jfsn.com/jeff.html` (+ Netlify + GitHub) | The "Studio" machine-reference page carried the password in a plain-HTML credentials row — labeled "private, not linked" but publicly reachable. Found 2026-06-11 by a full-tree literal sweep during pre-push verification; missed earlier because sweeps targeted tools/utils/make_handoff.py and the PDF specifically | **FIXED IN SOURCE 2026-06-11** (value replaced with a pointer to .ftp.env/Bitwarden); live copies remediated with the same day's push + server upload — verify all three hosts when updating this report |

## Exact actions still required, in order

1. ~~Rotate the password~~ — **IMPOSSIBLE** (no cPanel access, proven 2026-06-12). Durable fix: domain recovery → move off HostGator (see FINAL-DOMAIN-AND-PRESERVATION-HANDOFF.md).
2. ~~Push the locally-committed fixes~~ — **DONE session 30** (GitHub tip verified clean 2026-06-12).
3. ~~Delete the Allison PDF from the HostGator webroot~~ — **DONE 2026-06-12**, verified 404.
4. Run `python3 tools/utils/make_handoff.py` → print the regenerated PDF for Allison's physical folder. Do not commit it (now gitignored).
5. Optional server cleanup (with approval): delete from the HostGator webroot: `tools/utils/make_handoff.py`, `tools/generators/gen-artwork-pages.py`, `curate-session.json` (all preserved elsewhere first — see SESSION-30 checkpoint §5; all already 403-blocked by .htaccess).
6. ~~Refresh the Netlify mirror (rows #3–4)~~ — **DONE 2026-06-12** via `netlify deploy --prod` from a curated staging dir (rsync excludes: docs/, old-site/, *.py, *.pdf, *.md, *.sh, .ftp.env, configs). The mirror now carries sessions 25–33 content. **Future Netlify deploys must use the same curated-staging method** — the site has no git integration, and a naive `netlify deploy` from the working dir would re-publish everything.
7. Re-run the verification sweep in this report; update every status; when every public copy reads CLOSED/BLOCKED, archive this report (the credential itself stays live until HostGator is abandoned). **As of 2026-06-12 every public copy is CLOSED or BLOCKED** — remaining: #1 (403-blocked, file still on server), #7 (git history, permanent by policy).

## How this happened (for future prevention)

Three independent gaps aligned: a secret hardcoded in tooling instead of read from `.ftp.env`; deploy excludes written per-file instead of per-class (`artworks/*.py` but not `*.py`; `*.md` but not `*.pdf`); and a mirror host (Netlify) publishing the repo root verbatim. The staged hardening closes all three classes, not just the three instances.
