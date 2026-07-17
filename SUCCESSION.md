# JFSN Succession & Recovery

**Purpose:** If Jeff is unavailable, this document is enough to keep the archive intact and the site live (or to migrate it elsewhere). `CONSTITUTION.md` governs *what must stay true* under any change; JFSN-MISSION.md frames the *why*; this frames the *how, by whom*.

**Last reviewed:** 2026-06-22  
**Review cadence:** annually, and any time a credential or contact changes.

> This document contains pointers, not credentials. The actual passwords/keys/recovery codes live in Jeff's 1Password vault (or equivalent — fill in below). Anyone reading this needs vault access to act on it.

---

## Named people

| Role | Name | Contact | Notes |
|------|------|---------|-------|
| Primary owner | Jeffrey F. S. Neumann | jeff@jfsn.com | |
| Domain holder (Gandi) | Jeffrey F. S. Neumann | jeff@jfsn.com | **Jeff owns and pays for the Gandi account directly** (invoice confirmed 2026-06-16) — there is no friend in the loop. This was a stale assumption in earlier docs; corrected here. Jeff (or whoever inherits Bitwarden access) can change DNS/nameservers directly. |
| Backup family contact | Allison | _[FILL IN — phone/email]_ | Named throughout `docs/` as the designated custodian (`docs/archive-2026/FINAL-PRESERVATION-HANDOFF-2026-06-11.md` is addressed to her; Apple Digital Legacy already grants her Mac access). Contact details still need filling in here. |
| Technical successor (optional) | _[FILL IN]_ | _[FILL IN]_ | Someone who can run `bash session-end.sh`, deploy, and maintain the archive if Jeff cannot. Genuinely undecided — not an oversight, an open question. |

---

## Where the archive lives (4 redundant stores)

1. **GitHub** — `github.com/JFSNeumann/jfsn-archive` (**public** — confirmed in `docs/CUSTODIAN-RECOVERY-PLAN.md`: "Anyone can download this without any password")
   - Account owner: Jeffrey F. S. Neumann
   - Account email: likely `jfsneumann@gmail.com` (the recovery email used consistently for Bitwarden/B2/HostGator elsewhere in this repo) — _[CONFIRM, don't assume]_
   - 2FA recovery codes: Bitwarden (vault.bitwarden.com, login `jfsneumann@gmail.com`) — same vault as everything else per `docs/CUSTODIAN-RECOVERY-PLAN.md`
   - Collaborators with push access: likely none (one-person project) — _[CONFIRM]_

2. **Local Mac** — `/Users/jeffreyneumann/Documents/JFSN/`
   - Physical location of the Mac: _[FILL IN — home address or studio location]_
   - Disk encryption: _[CONFIRM — not stated anywhere in the repo's docs]_
   - Login credentials: Bitwarden (same vault as everything else)

3. **JEFFS-4TB external drive** — rsync nightly via LaunchAgent (11 PM)
   - Physical location of the drive: _[FILL IN — desk drawer, safe, etc.]_
   - Connection: _[FILL IN — USB-C / Thunderbolt / etc.]_
   - Encrypted: _[CONFIRM — not stated anywhere in the repo's docs]_
   - If encrypted, key location: _[VAULT LOCATION]_

4. **Backblaze B2 cloud** — LaunchAgent nightly (9 PM)
   - Account owner: Jeffrey F. S. Neumann (confirmed — `docs/CUSTODIAN-RECOVERY-PLAN.md` names this as Jeff's account)
   - Account email: `jfsneumann@gmail.com` (confirmed in `docs/CUSTODIAN-RECOVERY-PLAN.md`)
   - Bucket name: `jfsn-archive` (confirmed in `docs/CUSTODIAN-RECOVERY-PLAN.md` and `docs/HOSTING-INDEPENDENCE-AUDIT.md`)
   - Account credentials: Bitwarden
   - Recovery email/2FA: `jfsneumann@gmail.com` / Bitwarden
   - Estimated monthly cost: ~$1/month (confirmed in `docs/CUSTODIAN-RECOVERY-PLAN.md`)

---

## Hosting

- **HostGator (jfsn.com primary)** — cPanel/Pure-FTPd
  - Account email / login: `jfsneumann@gmail.com` (confirmed in `docs/DISASTER-RECOVERY-CHECKLIST.md`); support line **1-866-96-GATOR**
  - Credentials: Bitwarden + the printed handoff sheet
  - **KNOWN ISSUE:** cPanel access is currently unavailable; the FTP password is publicly exposed and rotation is on hold (Jeff's call). See `CURRENT_STATE.md` "Critical open items." Migrating hosting off HostGator does **not** require contacting anyone else — Jeff owns the Gandi domain account directly (corrected 2026-06-16).
  - FTP credentials in repo: `.ftp.env` (gitignored — never commit)

- **Gandi (domain registrar)**
  - Account holder: Jeffrey F. S. Neumann, directly (see "Named people" → Domain holder above)
  - This is the durable recovery path for jfsn.com if HostGator becomes unreachable. Jeff (or anyone with his Bitwarden access) can change DNS to point elsewhere — no third party needs to be contacted.

---

## Other accounts that touch the archive

- **Email at jfsn.com** — `jeff@jfsn.com` — provider: HostGator (MX records point there, confirmed in `docs/HOSTING-INDEPENDENCE-AUDIT.md` — this address dies if HostGator hosting lapses), login: Bitwarden
- **Anthropic / Claude account** (for AI sessions) — Bitwarden — _[CONFIRM which account funds the API key; not documented anywhere in this repo]_
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
4. **If migrating off HostGator:** Jeff (or whoever has his Bitwarden/Gandi access) can point DNS at a new host directly — no third party needs to be contacted. (Netlify was previously kept as a standing mirror for exactly this scenario; it was removed 2026-06-22 — a new host would need to be stood up from scratch, e.g. Netlify, Cloudflare Pages, or any static host, using the deploy steps in `DEPLOY.md` as a starting template.)
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
