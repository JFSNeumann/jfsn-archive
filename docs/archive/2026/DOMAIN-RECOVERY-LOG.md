# Domain Recovery — Running Log

**Purpose:** a dated, append-only record of every action taken to recover and secure **jfsn.com**. Add a new row whenever anything happens — a call, an email, a reply, a status change. Never delete rows; this log is the evidence trail if the recovery ever needs to be escalated to Gandi or ICANN.

**Rule:** no passwords in this file. Record *what was done*, not secrets.

---

## Pre-populated: actions already completed during the 2026 investigation

These rows record the investigation that established the recovery picture. They are historical and complete — they are logged here so a future custodian sees what was already learned and does not repeat it.

| Date | Person/System contacted | Organization | Email | Phone | Action taken | Response received | Next action | Status |
|---|---|---|---|---|---|---|---|---|
| 2026-06 | HostGator support chat | HostGator | — | 1-866-96-GATOR (on file) | Attempted to regain hosting/cPanel account access | Account recovery did not succeed | Treat HostGator account + cPanel as unavailable | ❌ Closed — unavailable |
| 2026-06-12 | FTP investigation | HostGator FTP server (192.185.77.119) | — | — | Tested whether the domain/credentials could be changed using FTP access alone | FTP works for files only; server is Pure-FTPd with no password-change capability; cannot affect domain or DNS | Rule out FTP as a recovery route | ✅ Done — FTP not a recovery path |
| 2026-06-12 | Registrar investigation | Gandi SAS | — | — | Looked up the registrar of record for jfsn.com | Registrar = Gandi SAS; registrar URL gandi.net; whois server whois.gandi.net | Use Gandi as the recovery channel | ✅ Done |
| 2026-06-12 | DNS investigation | Public DNS / whois | — | — | Checked where jfsn.com points and how DNS is delegated | Nameservers = ns31/ns32.websitewelcome.com (HostGator); site IP 192.185.77.119; DNSSEC unsigned | Plan to move nameservers to a Jeff-controlled provider after recovery | ✅ Done |
| 2026-06-12 | Domain ownership investigation | Public registry whois | — | — | Checked who legally owns jfsn.com | Registrant of record = **Jeff Neumann, Ohio, US**; created 2001-03-05; expiry 2027-03-05; status "ok" (unlocked) | Pursue recovery on the basis that Jeff is the registrant | ✅ Done — Jeff confirmed as registrant of record |
| 2026-06-16 | Jeff Neumann (direct) | Gandi US Inc | — | — | Jeff produced his own Gandi invoice (N° 2026021000232: org "jfsneumann", billed to his own address, paid by his own card, jfsn.com renewal, Feb 10 2026) | **Confirmed: Jeff already controls the Gandi account directly — there is no friend in the loop.** The earlier "registered in a friend's account" finding from the whois/registrant investigation was an incorrect inference. | None — domain is already in Jeff's own account | 🟢 Recovered — was never actually lost |

**Summary of the 2026 investigation:** HostGator account access is gone and cannot be used. FTP still works but cannot recover the domain. The domain is held in a friend's Gandi account, but **Jeff Neumann is the legal registrant of record**, the domain is **unlocked**, and it is **paid through 2027-03-05**. Recovery is therefore both possible and favorable. The recovery itself (contacting the friend, or proving ownership to Gandi) had **not yet been started** as of this log's creation — the rows below are for that work.

---

## Recovery actions (to be filled in going forward)

| Date | Person/System contacted | Organization | Email | Phone | Action taken | Response received | Next action | Status |
|---|---|---|---|---|---|---|---|---|
| ____ | Jeff's own Gandi account | Gandi | ____ | — | Create destination account with 2FA | ____ | Contact friend | ____ |
| ____ | The friend | (account holder) | ____ | ____ | Requested Change of Owner / auth code | ____ | ____ | ____ |
| ____ | | | | | | | | |
| ____ | | | | | | | | |
| ____ | | | | | | | | |
| ____ | | | | | | | | |
| ____ | | | | | | | | |
| ____ | | | | | | | | |

---

## Status key

- ✅ **Done** — action complete, no further work
- 🔄 **In progress** — waiting on a reply or a process
- ⏳ **Waiting** — blocked on someone else (friend, Gandi, etc.)
- ❌ **Closed** — route ruled out or no longer relevant
- 🟢 **Recovered** — use this when the domain is confirmed in Jeff's account

*Companion documents: `DOMAIN-RECOVERY-DOCUMENT-PACK.md` (the evidence checklist) and `DOMAIN-RECOVERY-HANDOFF.md` (the plain-language explanation).*
