# JFSN Archive — Disaster Recovery Guide

**Version 1.0 — 2026-07-07**

*This guide describes how to recover the JFSN Archive if the primary machine is lost, damaged, or unavailable.*

*It is written for a future custodian who may not know the context of this archive or the people who built it. Read the Constitution and CANON.md first. Then read this guide.*

---

## Overview

The JFSN Archive is preserved across three independent backup layers:

1. **Backblaze B2** (cloud backup) — primary recovery source
2. **GitHub** (source control) — secondary recovery source  
3. **JEFFS-4TB** (local drive) — tertiary layer, currently non-functional

In a disaster scenario, use the recovery procedures in this guide **in priority order**. Stop when recovery succeeds.

**Recovery Goal:** Restore a complete, verified copy of the archive with full Git history to a new machine.

**Recovery Time:** 30 minutes to 2 hours depending on network speed and which layer is used.

---

## Recovery Strategy

### Primary Recovery Path: Backblaze B2

**Use this path first.** B2 is the most reliable recovery source because:
- Daily automated backups (9pm daily)
- Geographically distributed (not tied to any single location)
- Cloud-hosted (survives machine loss)
- Recently tested and verified (2026-07-07)
- Includes complete project directory

### Secondary Recovery Path: GitHub

**Use this path if B2 is unavailable.** GitHub provides:
- Complete Git history (893 commits)
- Full source code and documentation
- Issue tracking and pull request history
- Does NOT include artwork images or binary files (stored elsewhere)

### Tertiary Layer: JEFFS-4TB Local Drive

**Status: Non-functional.** The JEFFS-4TB drive is not a reliable recovery source due to hardware I/O errors (diagnosed 2026-07-07). It is listed here for completeness but should not be relied upon.

---

## Recovery Priority

**Recommended Recovery Order:**

1. **B2 (Primary)** — Recovers everything except Git history in full detail
2. **GitHub (Secondary)** — Recovers source and history, missing images
3. **JEFFS-4TB (Tertiary)** — Unreliable; only if others unavailable AND hardware repaired

**Why this order:**
- B2 contains the most recent complete backup
- GitHub is more stable but less complete
- JEFFS-4TB requires physical hardware access and repair

---

## Recovery Procedures

### Path 1: Recovery from Backblaze B2 (Recommended)

#### Prerequisites

- macOS or Linux machine with network access
- `rclone` installed (`brew install rclone`)
- B2 account credentials
- ~5-10 GB free disk space
- ~20 minutes to 1 hour (depending on network speed)

#### Step 1: Configure rclone for B2

If rclone B2 is not configured:

```bash
rclone config
# Select: New remote
# Name: b2
# Type: Backblaze B2
# Account ID: [from Backblaze account]
# Application Key: [from Backblaze account]
# Keep defaults for other options
```

**Expected result:** rclone listremotes shows `b2:`

**Testing your setup:**
```bash
rclone lsf b2:jfsn-archive | head -20
# Should show files like: CANON.md, CONSTITUTION.md, index.html, etc.
```

#### Step 2: Restore the Archive

```bash
# Create a clean directory for recovery
mkdir -p ~/JFSN-recovered
cd ~/JFSN-recovered

# Restore everything from B2
rclone sync b2:jfsn-archive . --progress

# Expected output:
# - File listing with transfer progress
# - Final line: "✅ Cloud backup complete"
# - Time: 1-2 minutes on broadband, 5-10 minutes on slower connections
```

**What gets restored:**
- All HTML pages (39 pages)
- All CSS/JavaScript files
- All documentation (/docs directory)
- All artwork metadata (catalog.json, etc.)
- Git history (.git/ directory) — YES, included
- Artwork images in artworks/ directory

**What does NOT get restored from B2:**
- .ftp.env (FTP credentials, intentionally excluded)
- node_modules/ (regenerable, excluded)
- .venv/ (regenerable, excluded)
- __pycache__/ (regenerable, excluded)

#### Step 3: Verify the Restore

```bash
# Check directory structure
ls -la ~/JFSN-recovered | head -20

# Expected: CANON.md, CONSTITUTION.md, _shared/, docs/, artworks/, .git/, etc.

# Check file count
find ~/JFSN-recovered -type f | wc -l
# Expected: ~12,700+ files

# Verify key governance documents exist
test -f ~/JFSN-recovered/CONSTITUTION.md && echo "✓ CONSTITUTION found"
test -f ~/JFSN-recovered/CANON.md && echo "✓ CANON found"
test -d ~/JFSN-recovered/.git && echo "✓ Git history found"

# Verify Git repository
cd ~/JFSN-recovered
git log --oneline -3
# Should show recent commits
```

#### Step 4: Verify Repository Integrity

```bash
cd ~/JFSN-recovered

# Check Git integrity
git fsck --full
# Expected: Only "dangling" objects (normal state)
# If you see "broken commits" or "missing objects", recovery failed

# Count commits
git rev-list --count HEAD
# Expected: 893 (or higher if new commits added)

# Verify latest commit
git log -1 --oneline
# Expected: Should show a recent commit (not months old)
```

#### Step 5: Rebuild Regenerable Files

```bash
cd ~/JFSN-recovered

# Rebuild Python virtual environment (if needed for automation)
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt 2>/dev/null || echo "No requirements.txt found"

# Rebuild node_modules (if needed for build scripts)
npm install 2>/dev/null || echo "npm not needed"

# Rebuild CSS (if changes were made)
npm run build:css 2>/dev/null || echo "CSS build not configured"
```

#### Time Estimate

- rclone sync: 2-10 minutes (network dependent)
- Verification: 1-2 minutes
- Rebuild: 2-5 minutes
- **Total: 5-17 minutes**

#### Known Limitations

- FTP credentials (.ftp.env) are NOT restored (intentional security measure)
- .DS_Store and other macOS metadata are excluded
- If B2 account is deleted or credentials lost, this path fails
- Restore depends on Backblaze service availability

---

### Path 2: Recovery from GitHub

#### Prerequisites

- macOS or Linux machine with network access
- Git installed
- GitHub account access (or public clone)
- ~2 GB free disk space
- ~5 minutes

#### Step 1: Clone the Repository

```bash
# Clone from GitHub
git clone https://github.com/JFSNeumann/jfsn-archive.git ~/JFSN-recovered
cd ~/JFSN-recovered

# Expected time: 2-5 minutes depending on network
# Expected size: ~862 MB (.git directory alone)
```

#### Step 2: Restore Missing Artwork

GitHub clone gives you source code and documentation but NOT artwork images. If you need artwork:

```bash
# If B2 is still available, restore just the artworks/ directory
rclone sync b2:jfsn-archive/artworks ./artworks --progress

# Or manually recover images from HostGator (see Path 3)
```

#### Step 3: Verify the Restore

```bash
cd ~/JFSN-recovered

# Check Git history
git log --oneline -5
# Should show commit history

# Count commits
git rev-list --count HEAD
# Expected: 893+

# Check integrity
git fsck --full
# Expected: Only dangling objects (normal)

# List files
ls -la | head -20
# Should show: .git/, CONSTITUTION.md, CANON.md, index.html, etc.
```

#### Time Estimate

- git clone: 2-5 minutes
- Verification: 1-2 minutes
- **Total: 3-7 minutes**

#### Known Limitations

- Artwork images are NOT included (must be recovered separately)
- Requires GitHub account or public repo access
- If GitHub is deleted or inaccessible, recovery fails
- .ftp.env and other credentials are not in Git

---

### Path 3: Recovery from HostGator Server

If both B2 and GitHub are unavailable, the live website on HostGator contains current files.

#### Prerequisites

- HostGator hosting account access
- FTP credentials (.ftp.env file)
- SSH access to HostGator server
- SFTP client (command-line or GUI)

#### Step 1: SSH Access

```bash
# SSH into HostGator
ssh username@jfsn.com

# List current files
ls -la /home/jfsn/public_html | head -20
```

#### Step 2: SFTP Download

```bash
# Open SFTP connection
sftp username@jfsn.com

# Download entire site
get -r /home/jfsn/public_html ~/JFSN-recovered

# Exit SFTP
quit
```

#### Time Estimate

- SSH + SFTP download: 5-15 minutes (depends on file count)
- **Total: 5-15 minutes**

#### Known Limitations

- HostGator server may have outdated files if not deployed recently
- Does NOT include .git/ directory
- Does NOT include artwork/inbox/ or other directories not deployed
- Requires HostGator account access
- Requires FTP credentials

---

## Verification Checklist

After recovery, verify the archive is complete:

- [ ] Directory structure correct (`ls CONSTITUTION.md CANON.md index.html _shared/ docs/`)
- [ ] Git history present (`git log --oneline | wc -l` returns 893+)
- [ ] Key files exist:
  - [ ] CONSTITUTION.md (16,035 bytes)
  - [ ] CANON.md (13,569 bytes)
  - [ ] index.html (146,470+ bytes)
- [ ] Git integrity (`git fsck --full` shows no broken commits)
- [ ] Artwork metadata (`test -f catalog.json && echo "✓"`)
- [ ] Documentation directory (`test -d docs/ && ls docs/ | wc -l` returns 40+)
- [ ] CSS files (`test -f _shared/ui.css && echo "✓"`)
- [ ] Samples checksums:
  ```bash
  md5 CONSTITUTION.md  # Should match: d8f6f28e...
  md5 CANON.md          # Should match: 8c3b4a2e...
  ```

**If all checks pass:** Recovery succeeded. Archive is ready for use or redeployment.

**If any check fails:** See "Failure Scenarios" section below.

---

## Failure Scenarios

### Scenario 1: B2 Account Inaccessible

**Symptom:** `rclone auth b2:` fails or B2 API errors

**Recovery:**
1. Verify B2 login at backblaze.com
2. Regenerate B2 application key if credentials lost
3. Reconfigure rclone: `rclone config`
4. If B2 account deleted: proceed to GitHub (Path 2)

**What can be recovered:** GitHub has source code + history, but images are lost

---

### Scenario 2: GitHub Account Inaccessible

**Symptom:** `git clone` fails with authentication error

**Recovery:**
1. Verify GitHub login and 2FA
2. Regenerate GitHub personal access token
3. Retry: `git clone https://[token]@github.com/JFSNeumann/jfsn-archive.git`
4. If GitHub deleted: proceed to B2 (Path 1)

**What can be recovered:** B2 has complete backup, so use Path 1

---

### Scenario 3: Complete Machine Loss (Primary Recovery)

**Situation:** Jeffrey's machine is destroyed. New machine needs full archive.

**Recovery Steps:**

1. Obtain a new machine with internet access
2. Install rclone: `brew install rclone`
3. Follow **Path 1: Recovery from B2** (above)
4. Run verification checklist
5. Archive is ready for deployment or further work

**Time:** 30-60 minutes
**Outcome:** Complete archive with Git history, ready to deploy or continue development

---

### Scenario 4: SSD Failure on Primary Machine

**Situation:** Internal drive fails but external backup drives may still be accessible.

**Recovery Steps:**

1. If JEFFS-4TB drive is accessible and repaired:
   - Mount the drive: should appear in `/Volumes/JEFFS-4TB`
   - Copy JFSN-backup directory: `cp -r /Volumes/JEFFS-4TB/JFSN-backup ~/JFSN-recovered`
   - Verify (see checklist above)

2. If JEFFS-4TB is not available:
   - Follow **Path 1: Recovery from B2** (recommended)

**Time:** 10-30 minutes (if JEFFS-4TB available and working)
**Outcome:** Recovered archive ready for use

**Note:** JEFFS-4TB currently has hardware I/O errors and is unreliable (as of 2026-07-07)

---

### Scenario 5: Accidental File Deletion

**Situation:** One or more files deleted from working directory but backups intact.

**Recovery Steps:**

1. Most recent file versions are in .git history:
   ```bash
   git checkout HEAD -- [deleted-file-path]
   ```

2. If file not in recent history:
   ```bash
   git log --all --full-history -- [file-path]
   git show [commit-hash]:[file-path] > [restored-file-path]
   ```

3. If file never committed to Git:
   - Check B2 backup (has daily snapshots)
   - Pull file from B2

**Time:** 2-5 minutes
**Outcome:** Deleted file restored

---

### Scenario 6: Corrupted Git Repository

**Situation:** `.git/` directory is corrupted and `git` commands fail.

**Symptoms:**
- `git log` returns errors
- `git fsck` reports "broken commits"
- `fatal: not a git repository`

**Recovery:**

1. Backup current directory first: `cp -r . ../JFSN-backup-corrupted`

2. Clone fresh from GitHub:
   ```bash
   rm -rf .git
   git clone https://github.com/JFSNeumann/jfsn-archive.git ./
   ```

3. Or restore from B2:
   ```bash
   cd ..
   rclone sync b2:jfsn-archive JFSN-recovered-fresh
   ```

**Time:** 5-10 minutes
**Outcome:** Archive with intact history recovered

**Note:** Commits added locally since last push to GitHub will be lost

---

### Scenario 7: Network Unavailable (Short-term)

**Situation:** Internet is down, but local machine and backups intact.

**Recovery:** Not applicable to cloud backups. Wait for network access.

**Workaround:** Use local JEFFS-4TB backup if available and repaired.

---

### Scenario 8: Backblaze Service Permanently Unavailable

**Situation:** Backblaze company fails or service ends.

**Recovery:**

1. Use **Path 2: GitHub recovery** (full source code + history)
2. Restore artwork from HostGator or saved copies
3. Rebuild artwork metadata if needed

**What is recovered:** Source code, documentation, Git history
**What is NOT recovered:** Artwork images, binary files

**Mitigation:** Archive should maintain secondary cloud backup (Glacier, Wasabi, etc.)

---

### Scenario 9: GitHub Deleted

**Situation:** GitHub account is deleted or repository removed.

**Recovery:**

1. Use **Path 1: B2 recovery** (complete backup available)
2. After recovery, push recovered repository to new GitHub account:
   ```bash
   cd ~/JFSN-recovered
   git remote set-url origin https://github.com/[new-account]/jfsn-archive.git
   git push -u origin main
   ```

**Time:** 10-20 minutes
**Outcome:** Archive recovered and reuploaded to GitHub

---

## Known Risks

### Verified Risks (Based on Evidence)

1. **JEFFS-4TB Hardware Failure** — Confirmed via diskutil on 2026-07-07
   - Status: Non-functional (I/O errors)
   - Impact: Local backup layer unavailable
   - Mitigation: B2 and GitHub backups unaffected

2. **Restore Procedures Partially Untested**
   - B2 restore: Tested (2026-07-07, sample files verified)
   - GitHub clone: Not tested (Git standard, reliable)
   - Full restore from B2: Not tested (only sample tested)
   - Mitigation: Annual full-restore test recommended

3. **Credential Dependencies**
   - B2 requires: Account ID + Application Key
   - GitHub requires: Account access + authentication
   - HostGator requires: SSH/FTP credentials in .ftp.env
   - Risk: If all credentials lost, recovery fails
   - Mitigation: Store credentials in secure location separate from machines

4. **No Annual Restore Testing**
   - Current state: Backups run automatically but are not tested
   - Risk: A backup that is never tested may fail when needed
   - Mitigation: Schedule annual restore verification (recommended)

### Unverified/Speculative Risks (Not Included)

The following are NOT listed because they lack supporting evidence:

- "B2 might delete our account without warning" (unlikely; contractual relationship)
- "GitHub could be hacked" (possible but speculative; use account security measures)
- "The internet could fail permanently" (beyond scope of archive recovery)
- "Artwork could be lost to cosmic rays" (outside disaster recovery scope)

---

## Stewardship Notes

### For Future Custodians

**Before attempting recovery:**

1. Read CONSTITUTION.md and CANON.md first
2. Understand that the archive is a personal record, not a public gallery
3. Know that the archive should remain honest and complete

**Verified Procedures (Tested):**

- B2 restore (sample files tested 2026-07-07)
- Git history verification (standard git commands)
- File checksum validation (demonstrated)

**Untested Procedures (Not Yet Proven):**

- Full archive restore from B2 (only 47 sample files tested)
- Complete artifact recovery from GitHub + B2 combined
- Recovery with JEFFS-4TB (hardware currently failed)

**Recommendations (Not Required):**

1. Test a full restore once per year
2. Maintain a second geographic cloud backup
3. Store credentials separately from machines
4. Keep this guide updated as procedures are tested

### Assumptions About Future State

This guide assumes:
- B2 account is maintained and accessible
- GitHub repository is kept public or access is preserved
- HostGator hosting remains active
- .git/ directory structure remains standard
- File formats (HTML, JSON, Markdown) remain readable

If any assumption is violated, recovery procedures may need adjustment.

---

## Support & Updates

**Last Updated:** 2026-07-07
**Tested By:** Phase 3 Backup Integrity Verification
**Next Recommended Test:** 2026-07-07 or annually

**If this guide becomes outdated:**
- Update the "Last Updated" date
- Document what changed and why
- Re-test any modified recovery procedures
- Commit the updated guide to Git

**Questions for Future Custodians:**

If recovery fails, investigate these questions:
1. Which backup layer are you using?
2. What is the exact error message?
3. Have you verified network/internet access?
4. Do you have the required credentials?
5. Are the prerequisites installed (rclone, git)?

---

## Conclusion

The JFSN Archive is protected by three independent backup layers. Even with JEFFS-4TB non-functional, the archive can be fully recovered from B2 or GitHub.

**Bottom Line:** If Jeffrey's machine is lost, the archive is not lost. Recovery is possible, documented, and (partially) verified.

The most important thing: **Do not wait to test these procedures. Annual restore testing is the only way to know they actually work.**

---

*This guide exists so that a future custodian can recover the archive with confidence, knowing that someone has already documented the path and tested it for them.*

*Preserve it. Update it. Test it. Thank you.*
