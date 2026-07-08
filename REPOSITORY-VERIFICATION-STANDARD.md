# Repository Verification Standard — JFSN Archive

**Purpose:** Establish the operational procedures by which a custodian verifies that the archive is intact, the backups are current, and the site is live and correct.

**Governing principle:** Verify by execution, never by assumption. Do not trust that something works because a log file says so or a prior custodian left a note. Run the check yourself and observe the actual result.

**Version:** 1.0 — 2026-07-07

---

## I. Quick Health Check (Run Anytime)

Verify the archive is safe and the site is live.

```bash
cd ~/Documents/JFSN

# 1. Repository state
git status                           # should show "nothing to commit, working tree clean"
git log --oneline -3                 # last 3 commits
git remote -v                        # should show origin/https

# 2. Backup automation
launchctl list | grep -i jfsn        # should show both com.jfsn.cloud-backup and com.jfsn.backup

# 3. Last backup timestamps
ls -lh ~/Library/Logs/jfsn*.log      # check modification dates
tail -5 ~/Library/Logs/jfsn-cloud-backup.log      # last 5 lines of cloud backup

# 4. Catalog integrity
python3 artworks/validate_catalog.py # must pass (1,084 works)

# 5. Live site (visit in browser)
# https://jfsn.com
# - Homepage loads (check one featured work)
# - Archive.html loads (test one filter)
# - One artwork page loads (click from archive)
```

**Time:** ~5 minutes. **Frequency:** weekly or after any deploy.

---

## II. Annual Restore Verification

Verify the archive is actually recoverable from backups (not just backed up). Performed annually, or triggered by any backup failure reported in the error logs.

**Goal:** Confirm that at least TWO of the four backup copies (Mac, JEFFS-4TB, B2, GitHub) are healthy and sufficient to recover the complete archive.

### Phase 1: Check Backup Integrity (15 minutes)

```bash
# 1. GitHub (public, always accessible)
git branch -vv                       # confirms branch is tracking origin/main
cd /tmp && git clone https://github.com/JFSNeumann/jfsn-archive.git jfsn-test
cd jfsn-test
git log --oneline -3                 # confirm history is intact
ls -la | head -20                    # confirm key files exist
python3 artworks/validate_catalog.py # confirm catalog is valid
rm -rf /tmp/jfsn-test
# PASS: GitHub is a complete backup

# 2. Backblaze B2 (cloud, requires Bitwarden access)
# Visit https://backblaze.com → login (creds in Bitwarden: jfsneumann@gmail.com)
# → Buckets → jfsn-archive
# - Confirm bucket exists
# - Check "Files" → sort by "Last Modified"
# - Confirm last upload is recent (within 24 hours if automated, within 1 week manual)
# - Confirm file count is >12,000 (rough sanity check for ~5 MB of compressed data)
# PASS: B2 is a current backup

# 3. JEFFS-4TB (local external drive, requires physical access)
# Plug in drive
ls -la /Volumes/JEFFS-4TB/JFSN-backup/
ls -l /Volumes/JEFFS-4TB/JFSN-backup/artworks/full/ | head -5  # confirm images exist
cat /Volumes/JEFFS-4TB/JFSN-backup/LAST-BACKUP.txt           # check timestamp
# PASS: JEFFS-4TB is a complete backup (or FAIL if drive is unavailable / has I/O errors)

# 4. Mac (working tree, always accessible)
cd ~/Documents/JFSN
git status                           # confirm clean
du -sh .                             # confirm size is ~2.6 GB (working tree) + ~630 MB (images)
ls artworks/full/ | wc -l            # should be ~1,200+ image files
# PASS: Mac is the live working tree
```

**Expected outcome:** At least TWO of {GitHub, B2, JEFFS-4TB, Mac} are healthy and current. If one is missing, the archive is still safe; two independent copies is the threshold for survivability.

### Phase 2: Partial Restore Test (15 minutes, optional but recommended)

If you have time, verify one recovery path actually works:

**Test path A: Restore from GitHub only** (simulates "Mac is lost, nothing else available")

```bash
mkdir -p /tmp/restore-test/a
cd /tmp/restore-test/a
git clone https://github.com/JFSNeumann/jfsn-archive.git .
# ^ This downloads the entire git history (~600 MB) plus all committed files

# Verify essential files are present
ls -la CONSTITUTION.md CANON.md catalog.json    # must exist
python3 artworks/validate_catalog.py            # must pass
find artworks/pages/ -name "*.html" | head -5   # should have ~1,084 pages

rm -rf /tmp/restore-test/a
echo "✓ GitHub restore test passed"
```

**Test path B: Restore from B2 only** (simulates "Mac+JEFFS-4TB are lost")

```bash
# Requires rclone configured (see cloud-backup.sh preamble)
mkdir -p /tmp/restore-test/b
cd /tmp/restore-test/b
rclone copy b2:jfsn-archive . --progress

# Verify essential files are present
ls -la CONSTITUTION.md CANON.md catalog.json    # must exist
python3 artworks/validate_catalog.py            # must pass
echo "✓ B2 restore test passed"

rm -rf /tmp/restore-test/b
```

**Record the results in BACKUP-LOG.md** (see Section III below).

---

## III. Annual Review Checklist

**When:** once per year, in early January, or triggered by backup failure.  
**Who:** the current custodian.  
**Time:** 1 hour total.  
**Output:** update BACKUP-LOG.md with results and next review date.

1. **Run Phase 1 above** (check all backup integrity).
2. **Run Phase 2 test** (at least one restore path).
3. **Check launchd logs for errors:**
   ```bash
   tail -30 ~/Library/Logs/jfsn-cloud-backup-error.log
   tail -30 ~/Library/Logs/jfsn-backup-error.log
   ```
4. **Verify the domain is active and renewed:**
   ```bash
   whois jfsn.com | grep -i "expir"
   # Or visit Gandi.net → login → Domains → jfsn.com → check expiry date
   ```
5. **Check GitHub's branch status:**
   ```bash
   cd ~/Documents/JFSN
   git fetch origin
   git log --oneline origin/main -1
   ```
6. **Update BACKUP-LOG.md** with:
   - Verification date
   - Result of Phase 1 (which backups are healthy)
   - Result of Phase 2 (which restore path tested, did it work)
   - Any new operational issues discovered
   - Date of next scheduled review (one year ahead)

---

## IV. Operational Baseline

The archive's four backup layers and their characteristics:

| Copy | Location | Automatic? | Cadence | Current Status | Loss Risk |
|------|----------|-----------|---------|-----------------|-----------|
| Mac | `/Users/jeffreyneumann/Documents/JFSN/` | — | working tree | Live, up-to-date | Single point of failure without backups |
| JEFFS-4TB | `/Volumes/JEFFS-4TB/JFSN-backup/` | ✓ launchd | 11 PM daily | Hardware I/O errors (expected) | Drive failure / physical loss |
| B2 (Backblaze) | `b2:jfsn-archive` | ✓ launchd | 9 PM daily | ✓ Working, current | Account access loss / Backblaze company failure |
| GitHub | `github.com/JFSNeumann/jfsn-archive` (public) | ✓ via `session-end.sh` | Manual | ✓ Working, current | Account access loss / GitHub company failure |

**Minimum survivability:** Two independent copies, in two different forms and locations.  
**Current state (2026-07-07):** Mac + B2 are always healthy; JEFFS-4TB is hardware-blocked (acceptable); GitHub is current via manual pushes.  
**Status:** Archive is safe.

---

## V. Common Verification Failures and Recovery

### Failure: `launchctl list` shows no jfsn agents

**Symptom:** Backup agents are not running.

**Recovery:**
```bash
# Re-load the launchd configurations
launchctl load ~/Library/LaunchAgents/com.jfsn.backup.plist
launchctl load ~/Library/LaunchAgents/com.jfsn.cloud-backup.plist

# Verify they loaded
launchctl list | grep -i jfsn

# Check logs for any errors
tail -20 ~/Library/Logs/jfsn-cloud-backup-error.log
```

### Failure: `jfsn-backup-error.log` shows "Operation not permitted"

**Symptom:** Backup.sh is running but failing.

**Investigation:** This likely means the JEFFS-4TB drive is failing (hardware I/O error) or permissions changed. Check:
```bash
ls -la /Volumes/JEFFS-4TB/
diskutil verifyVolume /Volumes/JEFFS-4TB   # reports actual filesystem errors
```

**Action:** If the drive is actually failing, note it in BACKUP-LOG.md as a known issue. Cloud backup (B2) remains the active layer; the drive will be addressed when hardware replacement is possible.

### Failure: GitHub clone fails

**Symptom:** Cannot clone or pull from GitHub.

**Investigation:**
```bash
cd ~/Documents/JFSN
git fetch origin  # if this hangs, network is broken
git status        # if this reports "not a git repo", the .git folder is missing
```

**Recovery:** If the .git folder is missing, restore from backup:
```bash
# Restore from B2
rclone copy b2:jfsn-archive ~/Documents/JFSN-restore --progress
# Then compare local vs restored to understand what was lost
```

### Failure: `python3 artworks/validate_catalog.py` reports errors

**Symptom:** Catalog integrity is compromised.

**Investigation:** The error message will indicate which work record is malformed.

**Recovery:** Check `git log artworks/catalog.json` for the last known-good commit, then:
```bash
cd ~/Documents/JFSN
git show COMMIT_HASH:artworks/catalog.json > /tmp/good-catalog.json
# Review the diff
diff -u /tmp/good-catalog.json artworks/catalog.json
# Restore if needed
git checkout COMMIT_HASH -- artworks/catalog.json
```

---

## VI. Annual Schedule

| Date | Task |
|------|------|
| 2027-01-15 | Annual Restore Verification + BACKUP-LOG.md update |
| 2027-03-05 | **Domain renewal deadline** — check Gandi account before this date |
| 2027-07-07 | One-year stewardship checkpoint (optional, for continuity handoff) |

---

## References

- `CONSTITUTION.md` — The why (what must remain true).
- `SUCCESSION.md` — The who and where (custody and locations).
- `DISASTER-RECOVERY-CHECKLIST.md` — The how for specific failure scenarios.
- `BACKUP-LOG.md` — The current state and verification history.

---

**Version 1.0 — Adopted 2026-07-07**

### Amendment History

- **v1.0 — 2026-07-07.** Initial adoption as the operational verification standard.
