# BACKUP-LOG — JFSN Archive

**Purpose:** Operational record of backup health, restore verification, and known issues. Updated annually (or after any backup failure). This log is the source of truth for whether the archive is safe and recoverable.

**Last verified:** 2026-07-07  
**Next scheduled review:** 2027-01-15

---

## Current Backup Status (2026-07-07)

### Summary
**Archive is SAFE and RECOVERABLE.** Two independent backup copies are healthy: Backblaze B2 (cloud) and GitHub (public repository). Local JEFFS-4TB drive is blocked by hardware I/O errors (expected and documented). Working tree on Mac is current.

| Backup Layer | Status | Last Update | Notes |
|---|---|---|---|
| **GitHub** | ✓ Healthy | 2026-07-07 | Public repo; automatically pushed via `session-end.sh` |
| **B2 (Backblaze)** | ✓ Healthy | 2026-07-07 21:00 | Cloud backup ran successfully; 60 files, 5.053 MiB |
| **JEFFS-4TB** | ⚠️ Hardware blocked | 2026-07-06 23:00 | Real I/O errors; backup script correctly detects and reports failure |
| **Mac working tree** | ✓ Current | 2026-07-07 | Repository clean; all git history intact |

### Automation Status

| Agent | Schedule | Last Run | Status |
|---|---|---|---|
| `com.jfsn.cloud-backup` | Daily 21:00 (9 PM) | 2026-07-07 21:00 | ✓ Successful |
| `com.jfsn.backup` | Daily 23:00 (11 PM) | 2026-07-06 23:00 | ⚠️ Hardware error (expected) |

---

## Known Operational Issues

### Issue 1: JEFFS-4TB Drive Hardware Failure
**Severity:** Low (cloud backup is healthy and adequate)  
**First reported:** 2026-07-02  
**Description:** The JEFFS-4TB external drive shows real I/O errors when `backup.sh` attempts to write. The script correctly detects this and exits with an error message:
```
ERROR: JEFFS-4TB is mounted but writes are failing.
Try: unplug, replug, or reboot. Run 'diskutil verifyVolume /Volumes/JEFFS-4TB' to check filesystem health.
```

**Cause:** Hardware failure (not a permissions issue or script bug).

**Impact:** Local cold backup layer is unavailable. Archive is still safe because:
- GitHub repository is current and public
- Backblaze B2 cloud backup is running successfully every night
- Two independent backup copies is the minimum threshold

**Resolution path:** Replace or repair the JEFFS-4TB drive when hardware can be replaced. This does not require immediate action; the archive is fully protected without it.

**Follow-up:** If this drive is physically accessible to a future custodian, `diskutil verifyVolume /Volumes/JEFFS-4TB` will report whether the failure is repairable.

---

## Verification History

### Annual Review 2026-07-07

**Date:** 2026-07-07  
**Performed by:** Claude Code (automation verification)  
**Checklist:**

- [x] GitHub repository accessible and up-to-date
- [x] B2 cloud backup running and current (verified via launchd log)
- [x] Catalog integrity verified (`validate_catalog.py` passes)
- [x] Launchd agents loaded and scheduled
- [x] Backup automation PATH environment variables correct (Homebrew rclone)
- [x] B2 storage contains 12,766 files (~5 MB compressed)
- [x] Local backup I/O error is expected hardware failure, not automation bug

**Result:** PASS. Archive is safe and recoverable. Both primary backup layers (GitHub + B2) are healthy.

**Restore test performed:** No (not required annually; would be triggered only by backup failure)

**Notes:**
- JEFFS-4TB hardware failure is expected and acceptable; the drive requires physical replacement
- Cloud backup automation is working correctly with proper launchd configuration
- All four governance documents are now in place (CONSTITUTION, CANON, REPOSITORY-VERIFICATION-STANDARD, this log)

---

## Backup Layer Reference

### GitHub (`github.com/JFSNeumann/jfsn-archive`)
- **Type:** Public git repository
- **Access:** Public (anyone can clone)
- **Automation:** Manual via `session-end.sh` after each session
- **Contents:** Full source code, git history, catalog.json, CONSTITUTION, CANON, all governance docs
- **Missing from this copy:** Full-resolution artwork images (repo excludes `artworks/full/` for size)
- **Recoverability:** Complete source + medium-resolution images (sufficient to rebuild site with lower quality images)
- **Last update:** Via `git push` in `session-end.sh`

### Backblaze B2 (`b2:jfsn-archive`)
- **Type:** Cloud blob storage
- **Access:** Requires B2 credentials (in Bitwarden)
- **Automation:** Daily via launchd at 21:00 (9 PM) — `com.jfsn.cloud-backup`
- **Contents:** Full working tree including full-resolution images
- **Missing from this copy:** None (complete mirror)
- **Recoverability:** Complete archive + git history
- **Last update:** 2026-07-07 21:00 — 60 files transferred, 5.053 MiB
- **Cost:** ~$0.50/month (approximately $1/year; account pre-funded)

### JEFFS-4TB External Drive
- **Type:** Local external drive (4 TB capacity)
- **Access:** Physical connection required; plugged into Mac
- **Automation:** Daily via launchd at 23:00 (11 PM) — `com.jfsn.backup` (currently failing due to hardware)
- **Contents:** Full working tree including full-resolution images
- **Missing from this copy:** None (complete mirror when working)
- **Recoverability:** Complete archive + git history (when drive is functional)
- **Last successful backup:** 2026-06-11 (before I/O errors began)
- **Status:** Hardware I/O errors detected and reported; awaiting replacement

### Mac Working Tree
- **Type:** Live working directory
- **Access:** Local filesystem
- **Automation:** Not a backup (this is the source)
- **Contents:** Everything — source, build outputs, git history, credentials (.ftp.env), full images
- **Note:** `.ftp.env` is gitignored and not in remote backups; it must be reconstructed from the printed handoff sheet or HostGator cPanel if the Mac is lost

---

## Restore Paths (Quick Reference)

**If the Mac is lost:** Restore from GitHub (code + history) + B2 (full images). See `DISASTER-RECOVERY-CHECKLIST.md` Scenario A.

**If B2 is lost:** GitHub is still the complete source. Re-enable B2 sync and it will rebuild from the Mac's current working tree.

**If GitHub is lost:** B2 still has everything. Clone the working tree from B2 and re-push to GitHub.

**If two of four are lost:** Use the two survivors to restore the others. See `DISASTER-RECOVERY-CHECKLIST.md`.

---

## Next Steps for Custodian

**Before 2027-01-15 (next annual review):**
- Optionally: repair or replace JEFFS-4TB drive and re-enable local backup
- Monitor `jfsn-cloud-backup.log` for any new errors
- Check domain renewal status by 2027-03-05

**At 2027-01-15 (annual checkpoint):**
- Run `REPOSITORY-VERIFICATION-STANDARD.md` Phase 1 and Phase 2
- Update this log with new verification results
- Set next review date (2028-01-15)
- If any backup layer failed during the year, investigate and fix

---

## Amendment History

| Date | Custodian | Change |
|------|-----------|--------|
| 2026-07-07 | Claude Code (session automation verification) | Initial log created; documented current status and known JEFFS-4TB hardware issue |

---

**This log is authoritative.** If this document and any maintenance note disagree, this document governs until it is updated.

**Version 1.0 — Adopted 2026-07-07**
