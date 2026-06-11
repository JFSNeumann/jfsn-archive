# Hosting Independence Audit — JFSN Archive

**Date:** 2026-06-11. **Audience:** any future custodian, assumed to have no access to prior conversations. **Contains no credentials** — credential locations are referenced, never values (this file lives in a public repository).

## The question

Can the JFSN archive survive the loss of HostGator, cPanel/FTP access, the current Mac, and the current maintainer?

## The answer

**The CONTENT survives all of those — verified.** The 1,084 works, catalog, narrative pages, oral history, and the recovered earlier web presence exist in four independent stores. **What does NOT automatically survive is the NAME (jfsn.com) and the live service** — both have single points of failure outside the repository, ranked below.

## 1. Rebuild-from-zero matrix (verified 2026-06-11)

| Store | Site code + catalog | Images (full 404MB) | Images (medium 192MB) | thumbs/mini | old-site (1.5GB) | git history | Oral history docs | Credentials |
|---|---|---|---|---|---|---|---|---|
| **GitHub** (public) | ✅ | ❌ | ✅ all 1,092 in git — verified served | ❌ (regenerable from medium/full) | ❌ | ✅ | ✅ | ❌ (by design) |
| **Backblaze B2** `b2:jfsn-archive` | ✅ | ✅ | ✅ | ✅ | ✅ (verified 12,216 objects) | ❌ (.git excluded) | ✅ | ❌ (by design) |
| **JEFFS-4TB drive** `JFSN-backup/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ (.git included) | ✅ | ❌ (.ftp.env excluded by design) |
| **The Mac** `~/Documents/JFSN/` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ (.ftp.env, rclone config) |
| **HostGator** (live) | ✅ | ✅ | ✅ | ✅ | ✅ (original) | ❌ | ❌ (excluded from deploy) | — |

**Verdict per scenario:**
- Lose HostGator → nothing of substance is lost; the public site goes down until DNS is repointed (see SPOF #1) or visitors use jfsn-archive.netlify.app.
- Lose the Mac → restore from 4TB (complete + history) or B2 (complete, no history; pull history from GitHub). Credentials restored via Bitwarden + the printed handoff sheet.
- Lose the 4TB drive → B2 + GitHub + Mac still cover everything.
- Lose B2 → 4TB + GitHub + Mac still cover everything.
- Lose the maintainer → see CUSTODIAN-RECOVERY-PLAN.md.
- Lose EVERYTHING except any ONE of {Mac, 4TB, B2} → full rebuild possible. Except GitHub-only → degraded rebuild (medium-res images only — still a complete visual record of all 1,084 works).

## 2. Dependencies outside the repository

| Dependency | Where it lives | Failure impact | Mitigation status |
|---|---|---|---|
| Full-res images + thumbs/minis | B2, 4TB, Mac, HostGator (not git) | Loss of print-quality record if all four die | 4 copies — adequate |
| old-site (resume, design career, fine-art-2000) | B2, 4TB, Mac, HostGator | Biographical record | 4 copies — adequate |
| **Domain jfsn.com** | Registrar **Gandi SAS** — account held by **a friend of Jeff's**, not by Jeff. Registered 2001. **Expires 2027-03-05** | Every URL, QR code, printed reference, and inbound link dies; a 25-year-old domain would likely be sniped on expiry | ⚠️ **UNMITIGATED — SPOF #1** |
| **DNS zone** | ns31/ns32.websitewelcome.com = **HostGator's own nameservers** | If HostGator dies, DNS dies with it; only the friend (Gandi) can repoint | ⚠️ Tied to SPOF #1 |
| **jeff@jfsn.com email** | MX → HostGator itself | Site contact address dies with the host | Account-recovery email everywhere should be jfsneumann@gmail.com (Gmail, independent) — spot-verified for HostGator |
| B2 access | rclone config on the Mac only; account login via Bitwarden | Can't pull cloud backup until account login recovered | Acceptable — document in handoff |
| Netlify account + `ANTHROPIC_API_KEY` env var | Netlify dashboard (not in repo) | Companion AI stops; mirror site stops updating | Degradable — site works without Companion |
| GitHub account (JFSNeumann) | Login via Bitwarden | Repo orphaned (still clonable — public) | Acceptable |
| GoatCounter analytics | external account | Analytics lost | Expendable |
| Google Fonts CDN | external | Fonts fall back to system serif/sans | Degradable by design |
| Apache `.htaccess` behavior | HostGator-specific | Hero-image rewrite (`artworks/full/*.avif` → flat `/artworks/`), CSP headers, file blocks don't transfer to non-Apache hosts | Documented in DISASTER-RECOVERY-CHECKLIST §migration; Netlify mirror proves the site runs without Apache |

## 3. Single points of failure, ranked by preservation impact

1. **The domain.** jfsn.com's registrar account belongs to a friend; its nameservers belong to HostGator; it expires **2027-03-05**. The archive's permanent identity — every stable URL the preservation philosophy is built on — depends on one unnamed person renewing one account. *Fix that costs nothing today: record the friend's name/contact and the renewal plan in the handoff; ideally transfer the domain into an account Jeff or Allison controls (Gandi-to-anywhere transfer, ~$15).* 
2. **The Bitwarden master password** exists only handwritten on the printed handoff sheet. If the sheet is lost before Allison receives it, every account behind Bitwarden needs individual recovery flows. *Fix: confirm the sheet's location; consider a second sealed copy.*
3. **jeff@jfsn.com email on HostGator** — dies with the host while looking like a permanent address. *Fix: prefer jfsneumann@gmail.com as the canonical recovery/contact address everywhere; site already shows jeff@jfsn.com — decision for Jeff.*
4. **The Companion's API key** (Netlify env var) — single env var, no documentation of which Anthropic account funds it. Degradable; document only.
5. **rclone config** (B2 keys) on one Mac — recoverable via the B2 account; document only.

Items 4–5 are operational, not preservation. Items 1–2 are the only ones that can permanently damage the archive's continuity.

## 4. What is deliberately NOT a problem

- Git history not on B2: it exists on GitHub, the 4TB, and the Mac — three stores.
- Credentials not in backups: correct behavior; they live in Bitwarden + the printed sheet.
- Netlify staleness/decoupling: the live archive is HostGator; Netlify is a bonus mirror.
- The archive's open-source nature: GitHub being public is itself a survivability feature — anyone can clone the code, catalog, and medium-res corpus without any credentials at all.
