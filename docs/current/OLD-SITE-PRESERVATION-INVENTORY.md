# Old-Site Preservation Inventory

**Created:** 2026-06-11 (remediation sessions 30–31)
**For:** any future custodian, with or without access to the sessions that produced this.

## What this is

`old-site/` is Jeffrey F. S. Neumann's complete pre-2026 web presence, recovered from the HostGator server at `jfsn.com:/old-site/`, where it existed as the **only copy in the world** — it was excluded from git, from the Backblaze B2 cloud backup, and (because no local copy existed) from the external-drive backup. It was downloaded and verified on 2026-06-11 as a preservation act, before any server cleanup was permitted.

**This directory is archival material, not technical debt. Do not delete it. Do not "clean it up."**

## Preservation status

| Property | Value |
|---|---|
| Source | `jfsn.com:/old-site/` (HostGator webroot) — still in place, untouched |
| Local copy | `/Users/jeffreyneumann/Documents/JFSN/old-site/` (gitignored — deliberately outside the public repo) |
| File count | **12,914 files** |
| Total size | **1,586,489,182 bytes (1.5 GB)** |
| Integrity | **Conclusively verified** — second `lftp mirror --dry-run` comparison pass returned zero pending transfers (local matches server file-for-file); spot checks passed |
| 4TB drive (JEFFS-4TB) | ✅ backed up 2026-06-11 14:28 — 12,139 files; verified that the 775-file gap is exactly 698 third-party npm files (`old-site/index/node_modules/`, regenerable) + 78 `.DS_Store` — **zero content files missing** |
| Backblaze B2 | sync run 2026-06-11 (same node_modules exclusion applies) — see `docs/archive/2026/session-checkpoints/SESSION-30-FINAL-REMEDIATION-REPORT.md` for completion verification |
| Copies of Jeff's actual content | **4** — server, Mac, 4TB, B2 |

## Historically significant contents

### Family material
- `grandson/`, `grandson_yass_submission_2025/` — grandson project material, including what appears to be a 2025 competition/submission
- `sebastian-3.html` (root), `old/sebastian V1/`, `old/sebastian V2/` — multiple generations of pages made with/for grandson Sebastian (named in the oral history as one of the four collaborating grandchildren)

### The art record
- **`old/fine-art-2000/`** — the earliest known digital presentation of Jeff's art: "WORKS OF ART BY JEFFREY FRANCIS STANLEY NEUMANN," ~23 artwork JPEGs, period contact info. **These photographs predate the loss event and the current catalog — they should be cross-referenced against the 1,084 current works; any image not matching a surviving work may be the only photograph of a lost work.** (High-value, low-effort future task.)
- `old/Mr_SNOWmann/` — dedicated earlier site/section for the Mr. SNOWmann figure
- `index/` (433 MB) — a complete prior generation of the JFSN art archive itself, including **`metadata-backup-pre-enhancement-1763044006977.json`**: a 1,084-entry catalog snapshot from before the current AI cataloging. Provenance evidence: in it, titles are bare numbers ("0001") and descriptions are an earlier, different machine-written generation — documentary proof that (a) the works carried no creator-written titles in the digital record, and (b) the current descriptions replaced earlier machine text, not Jeff's words. Also `metadata-backup-20251113.json` (Nov 2025 snapshot).

### The design career (almost undocumented elsewhere — oral-history §24 territory)
- **`Jeff Neumann Resume.pdf`** (root) — valid 2-page PDF; biographical primary source
- `old/2014/`, `old/2016/`, `old/2018 - not used - can delete/`, `old/2020/`, `old/2023/` — five dated site generations spanning a decade of self-presentation. (Note: the folder named "can delete" must NOT be deleted — that label was the working designer's note, not the archivist's verdict.)
- `BB/` ("Brand Brain," 25 MB) — professional design product: presentation PDFs including **Unilever client work** (`Unilever-1/2/3.pdf`), `brand-brain-*.html` versions (10–13), and `audio/sample.wav` — a 21-second 48kHz/24-bit WAV (Aug 2025). **Whether this is Jeff's voice is unknown — if it is, it would be the only audio of Jeff in the archive. Jeff should listen to it.** Path: `old-site/BB/audio/sample.wav`.
- Root portfolio pages: `automobile-designs.html`, `ai.html`, `ai-powered-solutions.html`, `enterprise-platforms.html`, `mobile-applications.html`, `design.html`, `unilever-3.html` (in old/), etc. — the Product Designer/GenAI-UX career the art archive doesn't cover.

### Site-history artifacts
- Prior `timeline.html`, `art.html`, `art-companions.html`, `ra-companion/`, `ra-tools/` — earlier experiments and tooling generations
- `metadata/`, `docs/`, `components/`, `template*/` — the prior site's own infrastructure

## Standing rules for this material

1. **Never delete** any of it, including folders whose names say "can delete."
2. It stays **out of the public git repo** (gitignored) — it contains a resume with personal contact details and family material; publishing is a Jeff decision, item by item.
3. The server copy at `jfsn.com:/old-site/` is the original — leave it in place; it costs nothing and is a fifth copy.
4. The `fine-art-2000` cross-reference against the catalog (lost-work candidates) is the highest-value research task this material enables.
5. If `BB/audio/sample.wav` turns out to be Jeff's voice, register it in the oral-history record immediately.
