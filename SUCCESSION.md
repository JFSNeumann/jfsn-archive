# JFSN Succession & Recovery

**Purpose:** If Jeff is unavailable, this document is enough to keep the archive intact and the site live (or to migrate it elsewhere). JFSN-MISSION.md frames the *why*; this frames the *how, by whom*.

**Last reviewed:** 2026-06-22  
**Review cadence:** annually, and any time a credential or contact changes.

> This document contains pointers, not credentials. The actual passwords/keys/recovery codes live in Jeff's 1Password vault (or equivalent — fill in below). Anyone reading this needs vault access to act on it.

---

## Named people

| Role | Name | Contact | Notes |
|------|------|---------|-------|
| Primary owner | Jeffrey F. S. Neumann | jeff@jfsn.com | |
| Domain holder (Gandi) | _[FILL IN]_ | _[FILL IN]_ | Friend who registered jfsn.com on Jeff's behalf. Holds the Gandi account that controls DNS. Recovery path for the FTP-credential issue (see CURRENT_STATE.md). |
| Backup family contact | _[FILL IN]_ | _[FILL IN]_ | Family member with knowledge of where the archive lives and who to call. |
| Technical successor (optional) | _[FILL IN]_ | _[FILL IN]_ | Someone who can run `bash end-session.sh`, deploy, and maintain the archive if Jeff cannot. May be unfilled. |

---

## Where the archive lives (4 redundant stores)

1. **GitHub** — `github.com/JFSNeumann/jfsn-archive` (private/public — _[CONFIRM]_)
   - Account owner: Jeffrey F. S. Neumann
   - Account email: _[FILL IN — the email GitHub will use for password recovery]_
   - 2FA recovery codes: _[VAULT LOCATION]_
   - Collaborators with push access: _[FILL IN, or "none"]_

2. **Local Mac** — `/Users/jeffreyneumann/Documents/JFSN/`
   - Physical location of the Mac: _[FILL IN — home address or studio location]_
   - Disk encryption: FileVault enabled / disabled (_[CONFIRM]_)
   - Login credentials: _[VAULT LOCATION]_

3. **JEFFS-4TB external drive** — rsync nightly via LaunchAgent (11 PM)
   - Physical location of the drive: _[FILL IN — desk drawer, safe, etc.]_
   - Connection: _[USB-C / Thunderbolt / etc.]_
   - Encrypted: yes / no (_[CONFIRM]_)
   - If encrypted, key location: _[VAULT LOCATION]_

4. **Backblaze B2 cloud** — LaunchAgent nightly (9 PM)
   - Account owner: _[FILL IN — Jeff or someone else?]_
   - Account email: _[FILL IN]_
   - Bucket name: _[FILL IN]_
   - Account credentials: _[VAULT LOCATION]_
   - Recovery email/2FA: _[VAULT LOCATION]_
   - Estimated monthly cost: _[FILL IN — so the next maintainer knows what they're inheriting]_

---

## Hosting

- **HostGator (jfsn.com primary)** — cPanel/Pure-FTPd
  - Account email / login: _[FILL IN]_
  - Credentials: _[VAULT LOCATION]_
  - **KNOWN ISSUE:** cPanel access is currently unavailable; the FTP password is publicly exposed and cannot be rotated through self-service. See CURRENT_STATE.md "Critical open items." The durable fix is to recover the Gandi account and migrate hosting off HostGator.
  - FTP credentials in repo: `.ftp.env` (gitignored — never commit)

- **Netlify (jfsn-archive.netlify.app mirror)** — manual CLI deploys
  - Account email / login: _[FILL IN]_
  - Credentials: _[VAULT LOCATION]_
  - Includes the Companion Netlify Function + artwork-meta edge function

- **Gandi (domain registrar)**
  - Account holder: _[see "Named people" → Domain holder above]_
  - This is the durable recovery path for jfsn.com if HostGator becomes unreachable. The domain holder can change DNS to point elsewhere.

---

## Other accounts that touch the archive

- **Email at jfsn.com** — `jeff@jfsn.com` — provider: _[FILL IN — HostGator? Workspace?]_, login: _[VAULT LOCATION]_
- **Anthropic / Claude account** (for AI sessions) — _[VAULT LOCATION]_
- **Google account** (if Drive, Docs, or Photos hold any source material): _[FILL IN if used]_
- **Adobe / Creative Cloud** (if source files for composites are in Adobe Cloud): _[FILL IN if used]_

---

## What to do if Jeff is unavailable

**Goal:** keep the archive intact. Keeping the site live is secondary; the work is what matters.

**Minimum:** Make sure GitHub + JEFFS-4TB + B2 all have a current snapshot. As long as two of those three survive, the archive can be reconstructed.

**Steps in priority order:**

1. **Confirm the archive is safe.** Check that GitHub is accessible, JEFFS-4TB is in known physical custody, and Backblaze B2 still has recent backups (login → check Last Modified on the bucket).
2. **Decide if the live site needs to keep running.** It does not. jfsn.com going dark does not lose the archive; it just makes it temporarily inaccessible to visitors. Take time to make the right decision rather than rush a deploy.
3. **If site must stay live:** the deploy commands are in `DEPLOY.md`. The credentials for HostGator are in `.ftp.env` in the local repo (or in the vault).
4. **If migrating off HostGator:** contact the Gandi domain holder named above. They can point DNS at a new host (Netlify can serve as a long-term home; the staging mirror already runs there).
5. **If the archive needs to find a new permanent home:** contact a regional archive, library, or museum. The JFSN-MISSION.md document explains what the archive is and what it preserves; lead with that. The Cleveland Museum of Art, Cleveland Public Library Special Collections, and Case Western Reserve University Archives are reasonable starting points to inquire. _[Jeff to confirm/refine this list.]_

---

## What NOT to do

- **Do not delete anything** in a hurry. The redundant backups make accidental loss recoverable; deletion is forever.
- **Do not change the design or content** as a memorial or tribute. The archive is what it is. Adding "in memoriam" framing or rewriting About contradicts the archive's own framing of itself.
- **Do not pursue audience growth, social channels, or promotion** on Jeff's behalf. JFSN-MISSION.md is explicit that this isn't what the archive is for.
- **Do not change the URL.** If hosting moves, point DNS at the new host. The URL `jfsn.com` is part of the archive's identity for anyone who's referenced or linked to it.

---

## Maintenance after this document is updated

When something on this page changes (new credential, new contact, drive moves, account changes hands), update the date stamp at the top and re-share with whoever needs to know. A succession doc that's six months stale is worse than no succession doc, because it points the next person at the wrong place.
