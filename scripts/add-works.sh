#!/usr/bin/env bash
# add-works.sh — ingest new photos → catalog stubs → deploy
#
# Drop HEIC/JPG/PNG files into artworks/inbox/, then run:
#
#   ./add-works.sh              # ingest + build + deploy
#   ./add-works.sh --no-deploy  # ingest + build only (skip FTP upload)
#   ./add-works.sh --dry-run    # preview what would be ingested, no writes

set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
INBOX="$SCRIPT_DIR/artworks/inbox"

NO_DEPLOY=false
DRY_RUN=false

for arg in "$@"; do
  case "$arg" in
    --no-deploy) NO_DEPLOY=true ;;
    --dry-run)   DRY_RUN=true; NO_DEPLOY=true ;;
  esac
done

# ── check inbox ───────────────────────────────────────────────────────────────
INBOX_COUNT=$(find "$INBOX" -maxdepth 1 -type f \
  \( -iname "*.heic" -o -iname "*.heif" -o -iname "*.jpg" \
     -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.tiff" \
     -o -iname "*.tif"  -o -iname "*.webp" \) 2>/dev/null | wc -l | tr -d ' ')

if [[ "$INBOX_COUNT" -eq 0 ]]; then
  echo "📭  Nothing in artworks/inbox/ — drop photos there first."
  exit 0
fi

echo "📸  Found $INBOX_COUNT file(s) in artworks/inbox/"
echo ""

# ── 1. ingest ─────────────────────────────────────────────────────────────────
if $DRY_RUN; then
  echo "🔍  Dry run — previewing ingest..."
  python3 "$SCRIPT_DIR/artworks/ingest.py" --dry-run
  exit 0
fi

echo "⚙️   Ingesting..."
python3 "$SCRIPT_DIR/artworks/ingest.py"

echo ""

# ── 2. build catalog ──────────────────────────────────────────────────────────
echo "📚  Building catalog..."
python3 "$SCRIPT_DIR/artworks/build_catalog.py"

echo ""

# ── 3. deploy (optional) ──────────────────────────────────────────────────────
echo "✅  Done. Open JFSN.app to deploy to HostGator when ready."
