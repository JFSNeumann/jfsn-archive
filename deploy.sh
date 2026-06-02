#!/usr/bin/env bash
# deploy.sh — upload changed site files to jfsn.com
# Usage: ./deploy.sh
# First run: fill in .ftp.env with your cPanel credentials.

set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.ftp.env"

# ── Load credentials ──────────────────────────────────────────────────────────
if [[ ! -f "$ENV_FILE" ]]; then
  echo "❌  .ftp.env not found. Copy the template and fill in your credentials:"
  echo "    cp .ftp.env.example .ftp.env"
  exit 1
fi
source "$ENV_FILE"

if [[ "$FTP_USER" == "your_cpanel_username" ]]; then
  echo "❌  .ftp.env still has placeholder values. Edit it with your real credentials."
  exit 1
fi

echo "🔨  Building catalog..."
python3 artworks/build_catalog.py

echo ""
echo "📡  Uploading to $FTP_HOST..."

lftp -u "$FTP_USER","$FTP_PASS" "$FTP_HOST" << LFTP
set ftp:ssl-allow no
set net:timeout 30
set net:max-retries 3

# Upload all site files except images (too large), private folders, and Python scripts
mirror -R --verbose=1 \
  --exclude-glob=".git/" \
  --exclude-glob=".claude/" \
  --exclude-glob=".netlify/" \
  --exclude-glob=".ftp.env" \
  --exclude-glob="artworks/full/*.avif" \
  --exclude-glob="artworks/thumbs/*.avif" \
  --exclude-glob="artworks/mini/*.avif" \
  --exclude-glob="artworks/*.py" \
  --exclude-glob="artworks/logs/" \
  --exclude-glob="__pycache__/" \
  --exclude-glob="*.pyc" \
  --exclude-glob="node_modules/" \
  --exclude-glob="package-lock.json" \
  --exclude-glob="input.css" \
  --exclude-glob="curate-session.json" \
  --exclude-glob="server.py" \
  --exclude-glob="*.md" \
  --exclude-glob="PROMPT_TEST.md" \
  --exclude-glob="WORKFLOW.md" \
  $SCRIPT_DIR/ $FTP_REMOTE/

bye
LFTP

echo ""
echo "✅  Deploy complete. Running post-deploy check..."
python3 artworks/verify_deploy.py
