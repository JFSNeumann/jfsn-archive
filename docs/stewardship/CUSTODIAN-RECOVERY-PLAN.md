# Custodian Recovery Plan — JFSN Archive

**Written:** 2026-06-11, for Allison (or any future custodian), assuming Jeff is unavailable and you have never seen the project's working sessions. **No passwords are in this file** — it tells you where they are.

## What this archive is

jfsn.com preserves 1,084 artworks by Jeffrey F. S. Neumann — about fifty years of collage, sculpture, and photography — plus his own words about the work (the oral history), the record of the 500–1,000 works lost to water damage, and his earlier websites. More than half his life's work was destroyed once because it had no backup. This plan exists so that never happens to the rest.

**What must stay true:** this plan keeps the archive alive; `../CONSTITUTION.md` governs what it must remain as it lives on. Read the Constitution before making any change beyond preservation.

**The one rule:** when in doubt, copy first, change later, delete never. Everything below is about keeping copies alive, not about running a website. The website can be down for a year and rebuilt; deleted is forever.

## Where everything is (the four copies)

1. **Jeff's Mac** — `/Users/jeffreyneumann/Documents/JFSN/` — the working copy: everything, including credentials (`.ftp.env`).
2. **The black 4TB drive labeled JEFFS-4TB** — folder `JFSN-backup/` — a full mirror including the images, the git history, and Jeff's earlier websites (`old-site/`). Also on that drive: older snapshots (`JFSN-V3`…`JFSN-2025-FTP`) — keep them all.
3. **Backblaze B2** (cloud) — bucket `jfsn-archive` — a full mirror including images and old-site. Log in at backblaze.com with **jfsneumann@gmail.com**; the password is in Bitwarden.
4. **GitHub** — github.com/JFSNeumann/jfsn-archive — public; the code, catalog, documents, and a medium-resolution copy of every artwork. Anyone can download this without any password: green "Code" button → Download ZIP.

**Plus the live server** (HostGator) — a fifth copy of the site, and the original of `old-site/`.

## The keys

- **The printed handoff sheet** (regenerate with `python3 make_handoff.py` on the Mac; Jeff has printed copies) — HostGator/FTP details, GitHub, and the hand-written **Bitwarden master password**. Bitwarden (vault.bitwarden.com, login jfsneumann@gmail.com) holds everything else (~16 accounts).
- **Apple Digital Legacy** is set up — it gives Allison access to Jeff's Apple account and therefore the Mac.
- **Credential warning (2026-06):** the old FTP password was publicly exposed and is being rotated — see `docs/archive-2026/CREDENTIAL-EXPOSURE-REPORT.md`. If the site is ever defaced, that's the likely cause; restore from backups and change the FTP password at HostGator.

## The domain — renewal is the #1 recurring duty

**jfsn.com is registered at Gandi (gandi.net) directly in Jeff's own account** (confirmed by invoice, 2026-06-16 — an earlier version of this document incorrectly said a friend held it; that was never true). It expires **2027-03-05** and must be renewed or every link to the archive dies and the domain will likely be bought by a squatter.

- Renewal is a normal Gandi account action — whoever has Jeff's Bitwarden/Gandi access (see "The keys" above) can do it directly, no third party needed.
- If the domain is ever lost, the archive still exists in all four backup copies — but printed URLs and links break, so treat domain renewal as the #1 recurring custodial duty. One renewal per year, roughly $20.

## If the website goes down

Don't panic; nothing is lost. In order of ease:
1. Call HostGator: **1-866-96-GATOR** — account email jfsneumann@gmail.com. Most outages are billing or support issues.
2. If HostGator is gone for good → `DISASTER-RECOVERY-CHECKLIST.md`, scenario B (move to a new host — it's a folder-copy job; the site is plain files, no database). There's no longer a standing live mirror to fall back on while that happens (Netlify, which used to serve that role, was removed 2026-06-22) — the site will be offline for the duration of the move.

## Recurring custodial duties (the whole job)

| When | What |
|---|---|
| Yearly, before March 5 | Confirm jfsn.com was renewed (whois jfsn.com → "Registry Expiry Date" should move out a year) |
| Yearly | Confirm HostGator hosting is paid (or pick a new host — see `DISASTER-RECOVERY-CHECKLIST.md` scenario B) |
| Yearly | Log into backblaze.com once — confirm the `jfsn-archive` bucket is alive and billed (~$1/month) |
| Whenever the Mac is replaced | Copy `~/Documents/JFSN/` to the new machine; keep the 4TB drive |
| Never | Delete anything from the 4TB drive, the B2 bucket, or `old-site/` |

## What matters most, in order

1. The images and catalog (the works themselves) — four copies; keep them four.
2. The oral history (`docs/oral-history/master-notes.md` — Jeff's own words; quotes are verbatim; treat as primary source. Note: catalog titles/descriptions are machine-written, NOT Jeff's words, and gallery/installation images are Photoshop composites, not real exhibitions — Jeff's corrections, 2026).
3. The domain (see above — Jeff's own Gandi account, renew yearly).
4. `old-site/` — Jeff's earlier websites, resume, and design career; family material from the grandchildren. Inventory: `OLD-SITE-PRESERVATION-INVENTORY.md`.
5. The live service — nice to have running, painless to rebuild.
