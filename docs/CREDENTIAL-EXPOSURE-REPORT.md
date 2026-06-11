# Credential Exposure Report — jfsn.com FTP Account

**Created:** 2026-06-11. **Update this file whenever any status below changes.**
**For:** any future custodian. Assume no access to the conversations that produced it.

## The exposed credential

The FTP password for `jeffery@jfsn.com` (HostGator, full write access to the jfsn.com webroot) was hardcoded in `make_handoff.py` and embedded in the generated handoff PDF, both of which were published. **As of this report the exposed password is still the live, working credential** — verified by comparing the published value against the active `.ftp.env`.

> ## ⚠️ CREDENTIAL STILL COMPROMISED
> Blocking individual download paths does not un-leak a password. Until the password is **rotated in HostGator cPanel**, every status below — including "BLOCKED" — describes door-locking on a house whose key is copied. **Rotation is the only action that resolves this report.** After rotation, every entry below automatically becomes "dead credential."

## Exposure locations and status

| # | Location | How exposed | Status (2026-06-11) |
|---|---|---|---|
| 1 | `https://jfsn.com/make_handoff.py` | Plain-text source served from the primary domain (deploy excluded `artworks/*.py` but not root `.py`; `.htaccess` didn't block `.py`) | **EXPOSURE BLOCKED** — returns 403 since 2026-06-11 (.htaccess FilesMatch now includes `py`). File still on server; deletion pending Jeff approval |
| 2 | `https://jfsn.com/JFSN-Archive-Handoff-Allison.pdf` | PDF with embedded credentials, uploaded because deploy excluded `*.md` but not `*.pdf` | **ACTIVE** — returns 200. Deletion pending Jeff approval; future re-upload prevented by staged deploy.sh `*.pdf` exclude |
| 3 | `https://jfsn-archive.netlify.app/make_handoff.py` | Netlify publishes the whole repo (`publish="."`); currently serving a stale ~June-7 snapshot | **ACTIVE** — returns 200. Fix staged: `_redirects` forced-404 rule + password removed from source; takes effect on next push/deploy |
| 4 | `https://jfsn-archive.netlify.app/JFSN-Archive-Handoff-Allison.pdf` | Same | **ACTIVE** — same fix staged (plus the PDF is untracked from git, so future deploys won't even contain it) |
| 5 | GitHub repo, current tip — `make_handoff.py:144` | Public repository, unauthenticated raw access | **ACTIVE** — fix (creds read from `.ftp.env`, hardcoded value deleted) committed locally; active until pushed |
| 6 | GitHub repo, current tip — the PDF | Same | **ACTIVE** — `git rm --cached` committed locally; active until pushed |
| 7 | Git history — the password appears in ≥2 commits (e.g. 8c8ac871, 793a0e7f) and the PDF in several | Public repository history | **PERMANENT BY POLICY** — history will NOT be rewritten (deliberate archival decision: commit history is provenance evidence; the Exhibition Record forensics in master-notes §26 depended on it). Made harmless by rotation |
| 8 | `.ftp.env` (Mac), printed PDF copies, 4TB/B2 backups | Private credential stores | **NOT EXPOSURES** — these are where credentials are supposed to live. (.ftp.env was never committed; verified 403/absent on both hosts) |
| 9 | `https://jfsn.com/jeff.html` (+ Netlify + GitHub) | The "Studio" machine-reference page carried the password in a plain-HTML credentials row — labeled "private, not linked" but publicly reachable. Found 2026-06-11 by a full-tree literal sweep during pre-push verification; missed earlier because sweeps targeted make_handoff.py and the PDF specifically | **FIXED IN SOURCE 2026-06-11** (value replaced with a pointer to .ftp.env/Bitwarden); live copies remediated with the same day's push + server upload — verify all three hosts when updating this report |

## Exact actions still required, in order

1. **Jeff: rotate the password.** HostGator cPanel → FTP Accounts → `jeffery@jfsn.com` → Change Password. (~5 min. The single action that resolves this report.)
2. Update `FTP_PASS` in `/Documents/JFSN/.ftp.env` (deploys via JFSN.app break until this is done).
3. Run `python3 make_handoff.py` → print the regenerated PDF for Allison's physical folder. Do not commit it (now gitignored).
4. Push the locally-committed fixes (#3–6 above go dead on Netlify/GitHub tip). The push **must** include the new `_redirects`.
5. With approval: delete from the HostGator webroot: `JFSN-Archive-Handoff-Allison.pdf`, `make_handoff.py`, `gen-artwork-pages.py`, `curate-session.json` (all preserved elsewhere first — see SESSION-30 checkpoint §5).
6. Re-run the verification sweep in this report; update every status; when all read "dead credential," archive this report.

## How this happened (for future prevention)

Three independent gaps aligned: a secret hardcoded in tooling instead of read from `.ftp.env`; deploy excludes written per-file instead of per-class (`artworks/*.py` but not `*.py`; `*.md` but not `*.pdf`); and a mirror host (Netlify) publishing the repo root verbatim. The staged hardening closes all three classes, not just the three instances.
