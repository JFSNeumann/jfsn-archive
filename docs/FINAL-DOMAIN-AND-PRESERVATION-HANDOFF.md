# Final Domain & Preservation Handoff

**Created:** 2026-06-12. **Assumption:** the conversation that produced this is gone; only repository files and this document survive. **Written for:** a future contributor, maintainer, family member, or custodian with no prior context. **Contains no credentials** — it is safe in the public repository.

**The one thing to know:** the 1,084-work archive is safe in four independent places and cannot be lost. The unfinished business is the **name jfsn.com** (recoverable — Jeff is the legal owner) and a **leaked FTP password that cannot be changed without HostGator access** (contained in impact, because the content is replicated). Everything below is the detail.

---

## 1. What Was Actually Accomplished

**Preservation findings.** Confirmed the complete archive exists, intact, in four independent stores; verified reconstruction is possible from any of the primary ones. Confirmed the site is 100% static, so it can be served by any static host with no special software.

**Security findings.** Confirmed (by live login) that the exposed FTP password is the *active* credential, that it is additionally a weak keyboard-pattern password, and that it remains publicly retrievable from several locations. Confirmed it **cannot be rotated** with the available access. Ruled out two feared worst cases: the Bitwarden master password is **not** in the public PDF, and the Anthropic API key is **not** publicly exposed.

**Hosting findings.** Confirmed the web host is HostGator, that FTP file access still works, and that the FTP server type makes a self-service password change impossible. HostGator account/cPanel access is taken as unavailable.

**Domain findings.** Confirmed the registrar is Gandi, that **Jeff Neumann is the registrant (legal owner) of record**, that the domain is unlocked and paid through 2027-03-05, and that its nameservers belong to HostGator.

**Recovery findings.** Established that domain recovery is favorable and achievable on the strength of Jeff's registrant status, and produced a complete, ready-to-execute recovery document set (see §7). The recovery itself has **not yet been started**.

## 2. Confirmed Facts

**Confirmed — verified live this session (2026-06-12):**
- The FTP credential **authenticates successfully** (a live login connected and listed the webroot). It is **live and valid**, not merely "reported."
- The leaked password **equals** the active password (cryptographic fingerprint match).
- The active password is a **short keyboard-pattern string** (weak independent of the leak).
- The password is **publicly retrievable** from: the handoff PDF on jfsn.com; the stale Netlify mirror (in `make_handoff.py`, the PDF, and `jeff.html`); and at least one GitHub history commit.
- **Clean / contained:** `jfsn.com/make_handoff.py` returns 403; `jfsn.com/jeff.html` is clean; GitHub current-branch `make_handoff.py` is clean (reads from `.ftp.env`); `.ftp.env` was never committed, is gitignored, and returns 403/404 live.
- **Bitwarden master password is NOT in the public PDF**; **Anthropic API key is NOT publicly exposed** (present only in local `.ftp.env`).
- FTP server is **Pure-FTPd**; its only recognized SITE commands are `ALIAS, CHMOD, IDLE, UTIME` — **no password-change path** without cPanel/root.
- Registrant of record: **Jeff Neumann, Ohio, US**. Registrar: **Gandi SAS**. Domain status: **ok (unlocked)**. DNSSEC: **unsigned**. Created **2001-03-05**, expiry **2027-03-05**, last updated **2026-02-10**.
- Nameservers: **ns31/ns32.websitewelcome.com** (HostGator). Site IP: **192.185.77.119**.
- Archive contents present: **Local Mac** — catalog 1,084 works, 1,092 medium + 1,098 full + 1,084 mini images, old-site 12,914 files. **Backblaze B2** — full-res ~402 MiB, old-site 12,216 objects / 1.475 GiB. **GitHub** — code, catalog, docs, 1,092 medium images, full git history. The site is **fully static** (zero PHP; one optional serverless function).

**Probable — strong but not proven this session:**
- jfsn.com is recoverable by Jeff via the friend or via Gandi registrant recovery (registrant status is strong; recovery not yet attempted).
- The friend who holds the Gandi account is reachable (the 2026-02-10 update implies an active account).
- Copies of the leaked credential exist beyond the known URLs (forks, archive caches) — unenumerable.
- HostGator hosting will eventually lapse on its own once unmanaged, which would end the FTP exposure by attrition.

**Unknown — not determined this session:**
- The registrant contact email value, and whether Jeff controls it (this would strongly speed recovery).
- The friend's current reachability (not yet contacted).
- The full set of external locations that may have cached the credential.
- HostGator account/cPanel access is **assumed unavailable** (treated as a given; not re-tested this session).

## 3. Archive Preservation Status

| Store | Holds | Completeness |
|---|---|---|
| **Local Mac** (`~/Documents/JFSN/`) | Everything: code, catalog, all image sizes, old-site, git history, credentials | **100%** |
| **GitHub** (github.com/JFSNeumann/jfsn-archive, public) | Code, catalog, docs, 1,092 medium images, full history | Complete record; **no** full-res, mini, or old-site (regenerable / stored elsewhere) |
| **Backblaze B2** (bucket `jfsn-archive`) | Everything incl. full-res (~402 MiB) + old-site (1.475 GiB); no git history | Complete bar history (history is on GitHub + Mac) |
| **FTP webroot** (HostGator, live) | The deployed site at all image sizes + old-site original | Complete; still pullable today over FTP |

**Is the archive recoverable? YES — redundantly.** It can be fully reconstructed from the Local Mac alone, or from Backblaze B2 (pull history from GitHub), or — as a complete record though without full-resolution images — from GitHub alone. No single failure can erase it.

## 4. Security Status

- **FTP credential exposure:** the active FTP password is publicly retrievable (PDF on jfsn.com, the stale Netlify mirror, GitHub history) and was confirmed to still work by live login. It grants write access to the jfsn.com webroot.
- **Current limitation:** the password **cannot be rotated** without HostGator/cPanel access (Pure-FTPd offers no self-service change; the file copies on GitHub history and the Netlify mirror are outside the primary host's control).
- **What was verified:** the credential is live; it is weak; it is the same value that leaked; the source-side fixes on the primary domain and GitHub current branch are real and effective; `.ftp.env` is contained; the master password and API key are not publicly exposed.
- **What remains unresolved:** the credential stays valid and exposed for as long as the HostGator hosting account remains active. Because the archive content is replicated four times, the practical impact is **integrity/abuse of the live site**, not loss of the works. The durable resolution is to stop serving the canonical archive from HostGator (which the domain recovery enables) and let the HostGator hosting lapse.

## 5. Domain Status

- **Registrar:** Gandi SAS (gandi.net; whois.gandi.net; IANA 81).
- **Registrant (legal owner):** **Jeff Neumann, Ohio, US** — the decisive recovery fact.
- **Managing account:** a friend of Jeff's Gandi account (not Jeff's own login).
- **Nameservers:** ns31/ns32.websitewelcome.com (HostGator's).
- **Ownership findings:** Jeff is the owner of record; the domain is unlocked (`status: ok`), DNSSEC unsigned, paid through 2027-03-05, account active as of 2026-02-10.
- **Recovery findings:** recovery is favorable. Best path — the friend initiates a Gandi Change of Owner to a Jeff-controlled account, or supplies the transfer code. Backup path — Gandi registrant-identity recovery using Jeff's ID and the domain's ownership record. Last resort — ICANN registrant-rights complaint. Full procedure is in the recovery document set (§7).

## 6. Hosting Status

- **HostGator findings:** the web host; account access assumed unavailable; it holds nothing unique (all content replicated elsewhere). The live site and the Apache `.htaccess` behaviors live here but are replaceable/translatable.
- **FTP findings:** working for file transfer only; Pure-FTPd; cannot change credentials or touch the domain/DNS; still usable to read/delete webroot files.
- **cPanel findings:** assumed unavailable; it is the only place the FTP password could be rotated, which is why rotation is currently impossible.
- **Operational risks:** (a) a live, weak, leaked FTP credential that cannot be rotated; (b) the live site cannot be maintained through the normal account; (c) the domain points at HostGator's nameservers, so the live address depends on HostGator until DNS is moved. None of these threaten the preserved content.

## 7. Documents Created This Session

- `docs/DOMAIN-RECOVERY-DOCUMENT-PACK.md` — fill-in checklist and evidence template for recovering jfsn.com (known facts pre-filled, blanks for the custodian).
- `docs/DOMAIN-RECOVERY-LOG.md` — append-only action log, pre-populated with the completed 2026 investigation rows (HostGator chat, FTP, registrar, DNS, ownership).
- `docs/DOMAIN-RECOVERY-HANDOFF.md` — plain-language explanation of the domain situation for a non-technical custodian.
- `docs/FINAL-DOMAIN-AND-PRESERVATION-HANDOFF.md` — this document.
- **Site work (session 32, also this period):** homepage features (chromatic-river band, wall band, hero detail-reveal, expanded hero pool, "in his own words" card, mobile About section), the favorites.html duplicate-footer fix, the hero caption truth correction, six new hero image files, and the corresponding `CURRENT_STATE.md` / `IMPROVEMENTS.md` updates.

## 8. Open Items (genuinely unresolved only)

1. **jfsn.com is not yet in a Jeff-controlled account** — recovery prepared but not started.
2. **The FTP password is live, leaked, and unrotatable** with current access — resolved only by HostGator action or by the hosting lapsing.
3. **The friend has not yet been contacted**, and the registrant contact email is not yet confirmed.
4. **The site still depends on HostGator's nameservers** until DNS is moved (which requires domain recovery first).

## 9. Recommended Next Action (exactly one)

**Contact the friend who holds the Gandi account and ask them to either start a Gandi "Change of Owner" to a Jeff-controlled account or provide the domain's transfer code.** This is the single highest-value action: it is the keystone that secures jfsn.com as the permanent archive identity *and* the path that ultimately lets the archive move off the compromised HostGator server, neutralizing the credential exposure's impact. Everything needed to do it is in `DOMAIN-RECOVERY-DOCUMENT-PACK.md`.

## 10. Future Custodian Briefing (if Jeff is unavailable)

**What matters:** keeping the 1,084 works and Jeff's written history safe (already done — four copies), and keeping the name **jfsn.com** by recovering it into family control and renewing it each year (deadline **March 5**).

**What does not matter:** the HostGator account, the live server, and the leaked FTP password — none of these can destroy the archive, and all are replaceable. Do not spend effort trying to fix or log into HostGator.

**What must be preserved:** the four copies of the archive (Mac, the black "JEFFS-4TB" drive, the Backblaze online backup, and the public GitHub copy) — never let them fall below three; and the domain name jfsn.com.

**Where to start:** read `DOMAIN-RECOVERY-HANDOFF.md` (written in plain language for exactly this moment), then work through `DOMAIN-RECOVERY-DOCUMENT-PACK.md`, logging each step in `DOMAIN-RECOVERY-LOG.md`. The first move is the single action in §9 above: contact the friend.

## 11. Session Summary (for preservation records)

This session verified, from live evidence, that the JFSN archive (1,084 works + creator history) is safely replicated across four independent stores and is fully recoverable; that the previously reported FTP credential exposure is real, the credential is live, weak, and cannot be rotated without HostGator access, but its impact is bounded because the content is replicated and the two worst-case secrets (master password, API key) are not publicly exposed; and that jfsn.com is **recoverable** because Jeff Neumann is the unlocked domain's registrant of record at Gandi, paid through 2027-03-05. A complete, plain-language domain-recovery document set was produced. The one outstanding keystone action is to contact the friend who holds the Gandi account to move the domain into Jeff's control. Preservation is secure; continuity now depends on domain recovery, not on any infrastructure repair.

---

*Companion files: `DOMAIN-RECOVERY-DOCUMENT-PACK.md`, `DOMAIN-RECOVERY-LOG.md`, `DOMAIN-RECOVERY-HANDOFF.md`. Archive of record: `catalog.json` (1,084 works). Testimony of record: `docs/oral-history/master-notes.md`. The works are safe; keep the name, and keep the copies.*
