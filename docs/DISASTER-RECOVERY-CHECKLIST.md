# Disaster Recovery Checklist — JFSN Archive

**Written:** 2026-06-11. Step-by-step, scenario-based. Assumes you have `CUSTODIAN-RECOVERY-PLAN.md` (where things are) and no other context. No credentials appear here — they're in Bitwarden and on the printed handoff sheet.

---

## Scenario A — The Mac is lost (stolen, dead, replaced)

1. Get any Mac/PC. Install: git, rclone (`brew install rclone` on Mac).
2. Full restore, choose one:
   - **From the 4TB drive (fastest, most complete):** copy `/Volumes/JEFFS-4TB/JFSN-backup/` → `~/Documents/JFSN/`. This includes git history.
   - **From B2:** log into backblaze.com (creds: Bitwarden) → create an app key → `rclone config` a remote named `b2` → `rclone copy b2:jfsn-archive ~/Documents/JFSN`. Then `git clone https://github.com/JFSNeumann/jfsn-archive.git /tmp/hist` and copy `/tmp/hist/.git` into the restored folder for history.
3. Recreate `.ftp.env` from the printed handoff sheet (or HostGator cPanel → new FTP credentials).
4. Verify: `bash audit-nav.sh` → 11/11; open `index.html` in a browser.
5. Resume backups: plug in the 4TB → `bash backup.sh`; then `bash cloud-backup.sh`.

## Scenario B — HostGator is gone (company, account, or access lost permanently)

*Nothing of substance is lost — the server held nothing unique except `old-site/`, which was preserved to all four stores on 2026-06-11.*

1. **Immediately:** the mirror at jfsn-archive.netlify.app keeps the archive publicly reachable. (To bring it current: **Netlify has no git integration** — pushing to GitHub does NOT redeploy it. Run `bash deploy-netlify.sh --prod` manually; see `DEPLOY.md`. Pre-deployment checklist: `docs/archive/session-checkpoints/SESSION-30-FINAL-REMEDIATION-REPORT.md` §6.)
2. **Pick a new permanent host.** Requirements: static files only (no database, no server code needed), ~3 GB storage, custom domain + SSL. Netlify itself, Cloudflare Pages, or any Apache shared host all work.
3. **Upload the site** — the working tree minus internal files. If using an Apache host, `deploy.sh` works as-is after editing `.ftp.env`. If not Apache, note these `.htaccess` behaviors that must be reproduced or worked around:
   - Rewrite `artworks/full/*.avif` → `/artworks/*.avif` (on HostGator, full-res images live flat in `/artworks/`; simplest fix on a new host: upload `artworks/full/` as a real directory and the rewrite becomes unnecessary)
   - Security headers / CSP (copy from `.htaccess` into the host's header config — see `netlify.toml` for the Netlify translation)
   - Blocking of `.py/.sh/.env/.md` etc. (FilesMatch block — translate or rely on not uploading those files)
   - `api/.htaccess` (CORS for the JSON API)
4. **Point the domain:** Jeff owns the Gandi account directly (corrected 2026-06-16 — no friend/third party involved) — log in and change jfsn.com's nameservers/DNS to the new host. Until DNS moves, the archive lives at the new host's subdomain.
5. Verify: homepage, archive.html, one artwork page, catalog.json, api/v1/works.json, search, one image at each size.
6. Update `CUSTODIAN-RECOVERY-PLAN.md` and the printed handoff with the new host's details.

## Scenario C — The maintainer (Jeff) is unavailable

1. Read `CUSTODIAN-RECOVERY-PLAN.md` end to end. It was written for exactly this.
2. Apple Digital Legacy → access to the Mac. Printed handoff sheet → Bitwarden master password → everything else.
3. Nothing needs to be done quickly. The site runs unattended; backups only go stale, they don't vanish. The only clock is the **annual domain renewal (March 5)**.
4. The archive's content rules, in Jeff's absence: creator testimony in `docs/oral-history/master-notes.md` is authoritative; machine-written catalog text is not Jeff's voice; installation/gallery images are composites, not events (his corrections, §22/§25); never delete `old-site/` or anything on the 4TB drive.

## Scenario D — The domain expires unrenewed

*(Jeff owns the Gandi account directly — confirmed 2026-06-16 — so the original "friend is unreachable" framing of this scenario no longer applies. This is now just a renewal-lapse scenario.)*

1. Before expiry: whoever has Bitwarden/Gandi access can renew directly — routine, ~$20/year.
2. If expiry passes: registrars hold domains in grace/redemption for ~30–75 days — log into Gandi (or call their support) immediately; redemption is expensive but possible.
3. If truly gone: the archive continues at jfsn-archive.netlify.app (or any new domain). Update the `siteUrl` in `artist-config.json`, rebuild (`python3 artworks/build_catalog.py`), redeploy, and accept that printed/inbound jfsn.com links are dead. This is the one loss money can't always fix — which is why renewal is custodial duty #1.

## Scenario E — Total digital loss except ONE backup

Any single survivor of {Mac, 4TB drive, B2 bucket} rebuilds everything (Scenario A logic). GitHub alone rebuilds everything except full-resolution images and old-site — still a complete medium-resolution visual record of all 1,084 works plus the entire written archive. Print the handoff sheet again, re-establish the other three stores, and carry on.

## Scenario F — Defacement / unauthorized FTP access

1. Don't investigate on the server; restore first. Change the FTP password in cPanel.
2. Redeploy the whole site from the Mac (JFSN.app or `bash deploy.sh`).
3. Compare server vs. local if curious afterward (`lftp mirror --dry-run`).
4. Context: the old FTP password was publicly exposed in 2026 (`CREDENTIAL-EXPOSURE-REPORT.md`); if rotation never happened, assume that's the vector.

---

## The five numbers that matter

| What | Value (2026-06-11) |
|---|---|
| Works | 1,084 (catalog.json — `python3 artworks/validate_catalog.py` must pass) |
| Full archive size | ~2.6 GB working tree; images ~634 MB; old-site 1.5 GB |
| Copies required | 4 (Mac, 4TB, B2, GitHub) + server |
| Domain expiry | **2027-03-05** — renew yearly, registrar Gandi (Jeff's own account, corrected 2026-06-16) |
| HostGator support | 1-866-96-GATOR (account: jfsneumann@gmail.com) |
