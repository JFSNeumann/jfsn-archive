#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# setup-client.sh
# Creates a clean copy of the JFSN archive template for a new client.
# Usage:  bash setup-client.sh <clientname>
# Example: bash setup-client.sh sarah-jones
# ─────────────────────────────────────────────────────────────────────────────
set -e

CLIENT="${1:-}"
if [ -z "$CLIENT" ]; then
  echo "Usage: bash setup-client.sh <clientname>"
  echo "Example: bash setup-client.sh sarah-jones"
  exit 1
fi

SOURCE="$(cd "$(dirname "$0")" && pwd)"
TARGET="$(dirname "$SOURCE")/JFSN-${CLIENT}"

if [ -d "$TARGET" ]; then
  echo "❌  $TARGET already exists. Choose a different name or remove it first."
  exit 1
fi

echo "Creating archive for: $CLIENT"
echo "Source:  $SOURCE"
echo "Target:  $TARGET"
echo ""

# ── Copy template (skip artwork images and client-specific data) ──────────────
rsync -a --progress \
  --exclude='.git/' \
  --exclude='artworks/full/*.avif' \
  --exclude='artworks/full/*.jpg' \
  --exclude='artworks/full/*.jpeg' \
  --exclude='artworks/full/*.heic' \
  --exclude='artworks/full/*.HEIC' \
  --exclude='artworks/full/*.png' \
  --exclude='artworks/full/*.webp' \
  --exclude='artworks/full/*.json' \
  --exclude='artworks/thumbs/' \
  --exclude='artworks/mini/' \
  --exclude='catalog.json' \
  --exclude='catalog-lite.json' \
  --exclude='catalog-home.json' \
  --exclude='dims.json' \
  --exclude='colors.json' \
  --exclude='changes.json' \
  --exclude='featured.txt' \
  --exclude='pending-themes.json' \
  --exclude='curate-session.json' \
  --exclude='artist-config.json' \
  --exclude='artist-config.js' \
  --exclude='.ftp.env' \
  --exclude='old-site/' \
  --exclude='__pycache__/' \
  --exclude='.venv/' \
  --exclude='node_modules/' \
  --exclude='.DS_Store' \
  --exclude='JFSN-*/' \
  "$SOURCE/" "$TARGET/"

# ── Create empty artwork directories ─────────────────────────────────────────
mkdir -p "$TARGET/artworks/full"
mkdir -p "$TARGET/artworks/thumbs"
mkdir -p "$TARGET/artworks/mini"

# ── Create a blank featured.txt ───────────────────────────────────────────────
echo "" > "$TARGET/featured.txt"

# ── Initialize fresh git repo ─────────────────────────────────────────────────
cd "$TARGET"
git init -q
git add .
git commit -q -m "Initial commit: archive template for ${CLIENT}"

echo ""
echo "✅  Done. Project at: $TARGET"
echo ""
echo "Next:"
echo "  cd $TARGET"
echo "  bash init.sh                              # configure for this artist"
echo "  cp -R ~/path/to/photos/* artworks/full/   # add their photos"
echo "  python3 artworks/ingest.py artworks/full/ # make thumbnails"
echo "  python3 artworks/catalog.py               # AI catalog (slow — let it run)"
echo "  python3 server.py                         # then open localhost:3900/curate.html"
echo "  python3 artworks/build_catalog.py         # rebuild when curation is done"
echo ""
echo "See WORKFLOW-CLIENT.md for the full guide."
