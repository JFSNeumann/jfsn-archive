#!/usr/bin/env bash
# JFSN cold backup → external drive (JEFFS-4TB)
#
# Why this exists: the founding fact of this archive is that ~500-1,000 prior
# works were lost to water damage. This script ensures the digital record
# doesn't repeat that loss. Run after meaningful changes.
#
# What it does: incremental rsync of the whole project to a single mirror
# folder on JEFFS-4TB. Unchanged files are skipped (fast). Sensitive and
# regeneratable files are excluded.
#
# What it does NOT include:
#   .ftp.env           — FTP credentials (don't propagate secrets to portable drive)
#   __pycache__/       — regenerable
#   .DS_Store          — macOS junk
#   .venv/, node_modules/ — regenerable
#
# Run from anywhere:   bash /Users/jeffreyneumann/Documents/JFSN/backup.sh
# Or with a shortcut:  cd ~/Documents/JFSN && ./backup.sh

set -euo pipefail

SRC="/Users/jeffreyneumann/Documents/JFSN/"
DEST="/Volumes/JEFFS-4TB/JFSN-backup/"
LOG="/Volumes/JEFFS-4TB/JFSN-backup.log"

# Sanity: external drive present?
if [ ! -d "/Volumes/JEFFS-4TB" ]; then
  echo "ERROR: JEFFS-4TB drive not mounted. Plug it in and try again." >&2
  exit 1
fi

# Sanity: drive writable? (catches the "looks mounted but actually failing" case)
if ! touch "/Volumes/JEFFS-4TB/.backup-probe-$$" 2>/dev/null; then
  echo "ERROR: JEFFS-4TB is mounted but writes are failing." >&2
  echo "Try: unplug, replug, or reboot. Run 'diskutil verifyVolume /Volumes/JEFFS-4TB' to check filesystem health." >&2
  exit 1
fi
rm -f "/Volumes/JEFFS-4TB/.backup-probe-$$"

mkdir -p "$DEST"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting backup..."
echo "  Source: $SRC"
echo "  Dest:   $DEST"

rsync -a --stats --delete \
  --exclude='.DS_Store' \
  --exclude='__pycache__/' \
  --exclude='.ftp.env' \
  --exclude='.venv/' \
  --exclude='node_modules/' \
  "$SRC" "$DEST" 2>&1 | tail -15

# Record when this ran (in the backup itself, so it travels with the data)
date '+%Y-%m-%d %H:%M:%S' > "${DEST}LAST-BACKUP.txt"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Backup complete." | tee -a "$LOG"

# Quick sanity check: file counts match?
SRC_COUNT=$(find "$SRC" -type f ! -name '.DS_Store' ! -name '.ftp.env' ! -path '*__pycache__*' ! -path '*.venv*' ! -path '*node_modules*' 2>/dev/null | wc -l | tr -d ' ')
DEST_COUNT=$(find "$DEST" -type f ! -name 'LAST-BACKUP.txt' 2>/dev/null | wc -l | tr -d ' ')
echo "  File count — source: $SRC_COUNT  backup: $DEST_COUNT"
if [ "$SRC_COUNT" != "$DEST_COUNT" ]; then
  echo "  ⚠  File counts differ. Investigate before trusting this backup." >&2
  exit 2
fi
echo "  ✓ Counts match."
