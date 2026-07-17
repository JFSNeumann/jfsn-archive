> **🟢 CLOSED 2026-06-16 — this recovery effort is no longer needed.** Jeff produced his own Gandi invoice (org "jfsneumann", billed/paid by him) proving he already owns and controls the Gandi account directly — there was never a friend in the loop. The "friend holds the account" premise below was an incorrect inference from the registrant-of-record whois lookup. Kept for historical record; see `DOMAIN-RECOVERY-LOG.md` for the closing entry.

# Domain Recovery — Document Pack & Evidence Template

**Purpose:** one place to hold everything needed to recover and keep control of **jfsn.com**. Fill in the blanks as facts are gathered. No passwords belong in this file — record *where* a credential lives, never the credential itself. This file is safe to keep in the public repository.

**How to use:** work top to bottom. Anything marked `____` is for Jeff or a future custodian to complete. Items already known from the 2026 investigation are pre-filled and marked **(known 2026)**.

---

## 1. The Domain

| Field | Value |
|---|---|
| Domain name | **jfsn.com** (known 2026) |
| First registered | **2001-03-05** (known 2026) |
| Expiry / renewal date | **2027-03-05** — must be renewed before this date (known 2026) |
| Auto-renew enabled? | ____ |
| Registry status | **"ok"** — not locked, transferable (known 2026) |
| DNSSEC | **Unsigned** — no extra security records to manage (known 2026) |

## 2. The Registrar (the company that holds the domain)

| Field | Value |
|---|---|
| Registrar | **Gandi SAS** (known 2026) |
| Registrar website | **https://www.gandi.net** (known 2026) |
| Registrar support / contact | ____ (Gandi support portal) |
| Account the domain currently sits in | **A friend of Jeff's Gandi account** — not Jeff's own (known 2026) |
| Friend's name | ____ |
| Friend's email | ____ |
| Friend's phone | ____ |
| Is the friend reachable? | ____ |
| Jeff's own Gandi account (destination) | ____ (create with 2FA; this is where the domain should end up) |

## 3. The Registrant (the legal owner of record)

| Field | Value |
|---|---|
| Registrant organization | **Jeff Neumann** (known 2026 — this is the key fact: Jeff is the owner of record) |
| Registrant state | **Ohio, US** (known 2026) |
| Registrant contact email on file | ____ (masked in public records; Gandi holds it — confirm whether it is Jeff's) |
| Can Jeff prove control of that email? | ____ (if yes, this is the strongest recovery evidence) |

## 4. Known DNS Information (where the domain currently points)

| Field | Value |
|---|---|
| Current nameservers | **ns31.websitewelcome.com / ns32.websitewelcome.com** (these belong to HostGator) (known 2026) |
| Current website IP | **192.185.77.119** (HostGator server) (known 2026) |
| Desired nameservers after recovery | ____ (a DNS provider Jeff controls — e.g. Gandi's own DNS) |
| TTL lowered before cutover? | ____ |

## 5. Known Hosting Information

| Field | Value |
|---|---|
| Current web host | **HostGator** (known 2026) |
| HostGator account access | **Unavailable** (known 2026) |
| cPanel access | **Unavailable** (known 2026) |
| FTP access | **Working** (known 2026) — file access only; cannot change domain or DNS |
| Where the archive is independently stored | See the Handoff document, section "Where the archive exists" |

## 6. Recovery Status

| Step | Status | Date |
|---|---|---|
| Jeff-owned Gandi account created (with 2FA) | ____ | ____ |
| Friend contacted | ____ | ____ |
| Friend responded | ____ | ____ |
| Change of Owner / transfer started | ____ | ____ |
| Domain confirmed in Jeff's account | ____ | ____ |
| Gandi support case opened (if needed) | ____ | ____ |
| Identity documents submitted (if needed) | ____ | ____ |
| Domain locked + auto-renew set | ____ | ____ |
| Nameservers moved off HostGator | ____ | ____ |
| jfsn.com confirmed resolving to the archive | ____ | ____ |

## 7. Required Identification (for Jeff or his estate)

- [ ] Government photo ID for **Jeff Neumann** (name must match "Jeff Neumann")
- [ ] Proof of Ohio address (driver's license, utility bill)
- [ ] If acting on Jeff's behalf: legal authority (executor letter, power of attorney, or estate documentation)

## 8. Proof of Ownership Items (gather any that exist)

- [ ] Original 2001 domain registration receipt
- [ ] Any past Gandi invoices or renewal emails
- [ ] Emails sent to or from the registrant contact address
- [ ] Screenshots of this domain's records showing "Registrant: Jeff Neumann"
- [ ] Proof Jeff controls the registrant contact email (if it is his)
- [ ] This document pack itself (shows insider knowledge: creation date 2001-03-05, registrar Gandi, registrant Jeff Neumann)

## 9. Recovery Contacts

| Who | Why | Details |
|---|---|---|
| The friend (current account holder) | Fastest recovery path | ____ |
| Gandi support | Registrant recovery if friend unreachable | https://www.gandi.net (support portal) |
| ICANN | Last-resort owner-rights complaint | https://www.icann.org (registrant rights) |
| Jeff's family / executor | Authority if Jeff is unavailable | ____ |

## 10. Timeline

| Marker | Target |
|---|---|
| Start recovery | ____ (sooner is better) |
| Friend path expected to complete | within days of friend's cooperation |
| Gandi recovery path (if needed) | 2–6 weeks |
| ICANN escalation (only if needed) | 1–3 months |
| **Absolute deadline** | **2027-03-05** — the domain must be renewed/recovered before it expires, or it may be lost to an outside buyer |

## 11. Notes

_Free space for whoever works the recovery. Record dates, names, ticket numbers, and anything learned. Keep the companion file **DOMAIN-RECOVERY-LOG.md** updated alongside this one._

```
____________________________________________________________
____________________________________________________________
____________________________________________________________
```

---

*Companion documents: `DOMAIN-RECOVERY-LOG.md` (the running record of actions) and `DOMAIN-RECOVERY-HANDOFF.md` (the plain-language explanation for a future custodian).*
