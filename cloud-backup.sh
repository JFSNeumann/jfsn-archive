#!/usr/bin/env bash
# cloud-backup.sh — sync critical archive files to Backblaze B2
#
# SETUP (one-time):
#   1. brew install rclone
#   2. rclone config
#      - New remote → name: b2
#      - Type: Backblaze B2
#      - Account ID: (your B2 account ID)
#      - Application Key: (your B2 app key)
#   3. Create a bucket at backblaze.com: jfsn-archive
#   4. Run this script once to verify: bash cloud-backup.sh
#
# COST: ~$0.50/month for ~800MB
# ─────────────────────────────────────────────────────────────────────────────
set -e
cd "$(dirname "$0")"

if ! command -v rclone &>/dev/null; then
  echo "❌  rclone not found. Run: brew install rclone"
  echo "   Then: rclone config  (see setup notes at top of this file)"
  exit 1
fi

BUCKET="b2:jfsn-archive"

echo ""
echo "☁️   Cloud backup → Backblaze B2"
echo ""

# Full sync excluding large/regeneratable directories.
# old-site/ IS included deliberately: it is Jeff's earlier website — archival
# material whose only other complete copy is the HostGator server itself.
rclone sync . "$BUCKET" \
  --exclude "node_modules/**" \
  --exclude ".git/**" \
  --exclude "artworks/inbox/**" \
  --progress

echo ""
echo "✅  Cloud backup complete."
echo ""
