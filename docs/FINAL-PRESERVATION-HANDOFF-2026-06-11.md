# Final Preservation Handoff — 2026-06-11

> **Correction and supersession note — 2026-06-16:** §2's "Known constraints" below states that "jfsn.com remains in a friend's Gandi account." That was incorrect — Jeff produced his own Gandi invoice proving he owns and controls the account directly; there was never a friend in the loop. For all domain and hosting matters, this document is **superseded by** `docs/FINAL-DOMAIN-AND-PRESERVATION-HANDOFF.md` (see its own closure banner and `docs/DOMAIN-RECOVERY-LOG.md`). If Jeff is unavailable, start at `SUCCESSION.md` instead of this document. Everything else below — the preservation status, backup architecture, and knowledge-at-risk findings — remains accurate and is preserved unaltered as the historical record of the Session 30–31 arc.

**This document assumes the conversations that produced it are gone.** It is the durable record of the Session 30–31 arc (one long working day, 2026-06-11) and the entry point for anyone — contributor, family, future custodian — picking up the JFSN archive cold. It contains no credentials and is safe in the public repository.

**What JFSN is:** the personal archive of Jeffrey F. S. Neumann (b. 1954, Cleveland) — 1,084 works across ~50 years of collage, sculpture, and photography, plus his own recorded testimony. An estimated 500–1,000 further works were destroyed in storage by water damage; that loss is the founding fact of this project. *"The goal is not to build a better art website. The goal is to preserve a creative life."*

---

## 1. What This Session Actually Accomplished

**Preservation work (the highest-value outcomes):**
- **Rescued `old-site/`** — Jeff's complete pre-2026 web presence (12,914 files / 1.5 GB: his resume, his design career 2014–2023, his earliest art site from ~2000, grandson material) — from existing in exactly ONE copy on a rented server to four verified locations.
- Rescued `curate-session.json` (757 curation decisions, four never-published themes) from server-only existence.
- Closed a backup gap in which the oral history's most important sections (§20–26, including two creator corrections) had existed only on one laptop.

**Continuity work:** hosting-independence audit (the archive content survives the loss of any single store — verified, not assumed), custodian recovery plan written directly to Allison, disaster-recovery checklist by scenario, handoff-PDF generator extended to cover the domain, cloud backup, and mirror site.

**Creator-context work:** the about.html "Exhibition Record" was proven sourceless by git forensics (it grew from "TBD gallery" placeholders — master-notes §26); a six-row verification worksheet, a three-recording voice plan, a knowledge-at-risk inventory, and a ready-to-run 30-minute session were prepared.

**Documentation/security work:** a publicly leaked FTP password was contained across nine exposure locations (removed from current source, the live site hardened same-day, all current public copies cleaned or blocked); deployment was hardened so the leak class cannot recur; everything was documented for cold readers.

## 2. Repository State (end of 2026-06-11)

- **Commits pushed to GitHub** (github.com/JFSNeumann/jfsn-archive, public): `77cbb134` (master-notes §26 + truth report + register), `ae3011b4` (credential containment + deploy hardening + 8 continuity/remediation docs), `34006df2` (session closure), `61ea5682` (creator-context phase docs). Working tree clean.
- **Documents created** (all in `docs/` at the time — 2026-06-22 note: SESSION-31-PRESERVATION-HANDOFF, SESSION-30-REMEDIATION-CHECKPOINT, SESSION-30-FINAL-REMEDIATION-REPORT, and SESSION-30-CLOSURE were later moved to `docs/archive/session-checkpoints/`; everything else below stayed put): SESSION-31-PRESERVATION-HANDOFF · SESSION-30-REMEDIATION-CHECKPOINT · SESSION-30-FINAL-REMEDIATION-REPORT · SESSION-30-CLOSURE · CREDENTIAL-EXPOSURE-REPORT (living — update its statuses) · OLD-SITE-PRESERVATION-INVENTORY · HOSTING-INDEPENDENCE-AUDIT · CUSTODIAN-RECOVERY-PLAN · DISASTER-RECOVERY-CHECKLIST · CREATOR-VOICE-PLAN · EXHIBITION-VERIFICATION-WORKSHEET · KNOWLEDGE-AT-RISK-INVENTORY · NEXT-30-MINUTE-PRESERVATION-SESSION · lost-works-register (earlier same day) · server-artifacts/curate-session-2026-06-11.json · this handoff.
- **Modified:** master-notes.md (§26 appended — append-only, as always), make_handoff.py (credentials now read from `.ftp.env`, never hardcoded), deploy.sh (class-based excludes), `_redirects` (42 forced-404 rules protecting internal files on Netlify), .htaccess (`py/toml/lock` blocked — uploaded live), .gitignore (credential PDF), cloud-backup.sh (old-site included), jeff.html (password removed — uploaded live), CURRENT_STATE.md, IMPROVEMENTS.md.
- **Deployment status:** jfsn.com current and healthy (hardened .htaccess + corrected jeff.html uploaded directly). **Netlify mirror is STALE (~June 7) — its deploy pipeline is broken/paused and a git push does not wake it**; the repo's protections take effect there on the next successful deploy, which requires the Netlify dashboard login (Bitwarden).
- **Backup status:** GitHub ✅ (code, catalog, docs, and medium-res images of all 1,084 works) · JEFFS-4TB ✅ (everything + git history + old-site) · Backblaze B2 ✅ (everything + old-site; no git history) · the Mac ✅ (everything + credentials).
- **Known constraints (accepted by Jeff, 2026-06-11):** FTP password rotation not currently possible — **the leaked credential is contained but still valid** (see CREDENTIAL-EXPOSURE-REPORT.md); domain transfer will not happen — jfsn.com remains in a friend's Gandi account [**correction, 2026-06-16: false — Jeff owns the Gandi account directly, no friend was ever involved; see `docs/FINAL-DOMAIN-AND-PRESERVATION-HANDOFF.md`**], **expires 2027-03-05, renewal is custodial duty #1**; git history intentionally NOT rewritten (it is provenance evidence and still contains the old password — harmless once rotation ever happens).

## 3. Preservation Gains, and why each matters

- **old-site** — Jeff's biography in website form: the design career the art archive doesn't document, the earliest photographs of the art (~2000, possibly including lost works), family material. It was one disk failure away from nonexistence; now it cannot be lost to any single failure. Inventory: OLD-SITE-PRESERVATION-INVENTORY.md.
- **Continuity planning** — the archive no longer depends on any one company, machine, or person to survive. Rebuild-from-any-single-backup was verified, not assumed.
- **Creator-voice planning** — no recording of Jeff's voice exists anywhere (one 21-second candidate, unidentified: `old-site/BB/audio/sample.wav`). The voice plan reduces the capture cost to one minute and one button.
- **Exhibition verification prep** — the archive's most-citable potential false history (six dated shows with venues) is now one five-minute worksheet away from being permanently settled instead of permanently misleading.
- **Lost-works prep** — the register exists with two entries and a template; the highest-value next entry is identified (one of the "great large pieces" Jeff called "really good" — most have no photograph at all).

## 4. Open Questions (Jeff's input only — nothing else blocks)

**Decisions:** Does the oral-history PDF stay publicly downloadable (jfsn.com + GitHub)? · Approve removal of four leftover server files (all preserved elsewhere; all blocked or harmless) · Approved wording for gallery-images.html's intro and the homepage hero caption (both still describe composites as real exhibitions) · Whether/when the Netlify pipeline gets revived.

**Testimony:** The six exhibition rows — happened or not (EXHIBITION-VERIFICATION-WORKSHEET.md) · Which few real exhibitions occurred beyond the late-1970s CIA student show.

**Memories:** The three one-minute recordings · One lost large work, described · Which grandchild made which marks in the 31 collaboration works · Which faces in the works are family · What happened in the 1980s · Who Aunt Mary is · Why he kept going after the Rauschenberg realization (he ended a session at this question once — never push).

**Future research (parked by Jeff, 2026-06-11):** cross-referencing the 23 fine-art-2000 JPEGs against the catalog for lost-work candidates · identifying sample.wav · the catalog provenance-fields project (`year_precision`, `description_source`, `composite` flags).

## 5. Things Future Contributors Must Not Forget

1. **Creator testimony outranks inference — always.** Jeff's corrections override anything the data seems to say. When they conflict, preserve the conflict and ask.
2. **ALL gallery/installation/crowd images are Photoshop composites** — imagined placements, not exhibition documentation (Jeff's corrections, master-notes §22 + §25). Very few real exhibitions ever occurred. An image of an event is not evidence the event occurred.
3. **Machine-generated text is not creator voice.** All 1,084 catalog descriptions are machine-written; titles were originally bare numbers (proven by `old-site/index/metadata-backup-pre-enhancement-*.json`); 1,075 of 1,084 years are decade-bucket estimates. Never quote catalog text as Jeff's words. stories.html quotes ARE verbatim; why-i-made-things.html is a synthesis Jeff confirmed "feels true."
4. **Preservation outranks feature development.** Optimize for completion, not ambition; the best preservation work is work Jeff will enjoy (§25). No campaigns, no audits-for-their-own-sake, no big projects.
5. **Stable URLs outrank repository tidiness.** Never reorganize published paths.
6. **"Next" / "boring" / "don't know" are final answers.** Move on instantly; never convert unanswered questions into campaigns; never re-ask answered ones (the CIA sculpture's whereabouts and the Guernica painting's year are already answered "don't know" — they are gone).
7. **Never delete archival material** — old-site (including the folder named "can delete"), the 4TB drive's old snapshots, the B2 bucket, git history. The founding fact of this archive is what deletion costs.
8. **master-notes.md is append-only.** Corrections get new sections; nothing is edited in place. Verbatim quotes are sacred; paraphrases are marked.
9. **Artwork first on the site:** no grayscale/scroll-reveal/scale/sibling-dim/overlays on artwork (the banned-pattern list in CLAUDE.md was earned, not arbitrary).
10. **Sweep whole trees, not suspect files** — the ninth credential exposure (jeff.html) survived eight targeted sweeps and fell to one `git grep`.

## 6. Recommended Next Session (30 minutes)

**Run `docs/NEXT-30-MINUTE-PRESERVATION-SESSION.md` exactly as written.** Part 1: six one-word answers settle the exhibition record (~5 min). Part 2: one Voice Memo, "Why I Make Things" (~5 min, one take — the archive's first recording of Jeff). Part 3, optional: one lost large work described in six questions (~15 min — register entry #3). Every part is independently complete; stopping at any point is success. Nothing in this archive returns more preservation per minute.

## 7. If Jeff Never Returns

**Already safe:** all 1,084 works in four stores at multiple resolutions; his written testimony (master-notes — the loss, the materials, Guernica, the grandchildren, the doubt: *"getting old / no one really cares"* — and the laugh: *"Ha Ha Ha — 30 odd years later, still making"*); both creator corrections that keep the archive honest; the lost-works register's first two entries (the 11×25-ft Guernica painting no one ever saw; the CIA sculpture someone has lived with for fifty years); his earlier websites and resume; the family names: Sebastian, Caspar, Anthony, Emilia; recovery documentation any custodian can follow.

**Still at risk, in order:** his voice (zero recordings — the single greatest gap); what the lost works were (no other source will ever exist); which marks belong to which grandchild; which faces are family; whether the six listed exhibitions happened; the 1980s; why he kept going. Every one of these dies with him, and every one costs minutes to capture. That asymmetry — minutes against forever — is the entire argument of this document.

## 8. Custodian Notes — for Allison, or whoever holds this next

Your father built this twice: the works, over fifty years, and then the archive of them, alone, in his seventies (*"took a fucking long time"*). Half his life's work was thrown into a garbage truck while he watched from six feet away. Everything here exists so the rest can't follow it.

**What exists:** jfsn.com; this repository (public — anyone can copy it, which is protection, not exposure); the black 4TB drive; the Backblaze cloud account; the Mac. Start with `CUSTODIAN-RECOVERY-PLAN.md` — it was written for you, for the day you need it, and it tells you where the keys are (the printed sheet, Bitwarden, Apple Digital Legacy).

**What was saved this session:** his earlier websites — including his design career and his resume — which until today existed in exactly one place; and the documentation that lets you or anyone rebuild all of it without him.

**What remains to be captured:** his voice, more of the lost works, and the small attributions only he can make (which grandchild drew what; whose faces are in the collages). If you ever have thirty minutes together, `docs/NEXT-30-MINUTE-PRESERVATION-SESSION.md` is the best way anyone has found to spend them.

**What deserves protection:** the four copies (never let it drop below three); the domain renewal every March 5 — it's in a family friend's hands and it is the one thing money can't recover late; the 4TB drive and `old-site/` folder, which must never be "cleaned up"; and his words exactly as he said them. The archive's value to your children isn't the website — it's that when they ask who he was, the answer is here, in his own voice, *"whatever they want and whatever I want — getting hard to tell where they end and I begin. I think that's right."*

---

*Handoff complete. Companion index: every document named in §2 lives in `docs/`. The catalog of record is `catalog.json`; the testimony of record is `docs/oral-history/master-notes.md`; the priority of record is §25: completion over ambition.*
