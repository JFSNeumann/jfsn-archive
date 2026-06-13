#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# deploy-netlify.sh — deploy the SECONDARY mirror (jfsn-archive.netlify.app) SAFELY
#
# Why this exists: the Netlify site has NO git integration, so deploys are manual
# CLI. A naive `netlify deploy` from the working dir publishes the repo verbatim —
# docs/, .ftp.env, *.py, *.pdf, scripts — which is exactly what caused the
# 2026-06 credential exposure. This script builds a CURATED staging copy, then
# refuses to deploy if anything sensitive slipped in.
#
# Usage:
#   bash deploy-netlify.sh --check   # build stage + run safety gate, DON'T deploy
#   bash deploy-netlify.sh           # build + safety gate + DRAFT deploy (preview URL)
#   bash deploy-netlify.sh --prod    # build + safety gate + PROD deploy (goes live)
#
# Recommended flow: --check, then (default) draft + eyeball the preview URL, then --prod.
# (HostGator/primary deploys via Deploy JFSN.app — this is the mirror only.)
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail
cd "$(dirname "$0")"

MODE="${1:-draft}"

STAGEROOT="$(mktemp -d)"
STAGE="$STAGEROOT/stage"
mkdir -p "$STAGE"
trap 'rm -rf "$STAGEROOT"' EXIT

echo "📦  Building curated staging copy → $STAGE"
# Mirror deploy.sh's proven exclude classes + the Netlify-specific ones from
# CREDENTIAL-EXPOSURE-REPORT.md §6. Keeps netlify/ (functions deploy via
# netlify.toml) and _redirects (the forced-404 layer); drops everything else
# that isn't a served static asset.
rsync -a ./ "$STAGE/" \
  --exclude '.git/' \
  --exclude '.claude/' \
  --exclude '.netlify/' \
  --exclude '.ftp.env' \
  --exclude '.DS_Store' \
  --exclude 'node_modules/' \
  --exclude '__pycache__/' \
  --exclude 'docs/' \
  --exclude 'old-site/' \
  --exclude 'artworks/inbox/' \
  --exclude 'artworks/logs/' \
  --exclude '*.py' \
  --exclude '*.pyc' \
  --exclude '*.sh' \
  --exclude '*.pdf' \
  --exclude '*.md' \
  --exclude 'package.json' \
  --exclude 'package-lock.json' \
  --exclude 'tailwind.config.js' \
  --exclude 'input.css' \
  --exclude '.gitignore' \
  --exclude 'deno.lock'

# ── Safety gate: never deploy a stage that contains sensitive files ───────────
echo "🔒  Scanning staging copy for sensitive files..."
LEAKS=$(cd "$STAGE" && find . \
  \( -name '.ftp.env' -o -name '*.pdf' -o -name '*.py' -o -name '*.sh' \
     -o -name '*.md' -o -path './docs/*' -o -path './old-site/*' \) 2>/dev/null || true)
if [ -n "$LEAKS" ]; then
  echo "❌  ABORT — sensitive files present in staging copy:"
  echo "$LEAKS"
  exit 1
fi
if [ ! -f "$STAGE/_redirects" ]; then
  echo "❌  ABORT — _redirects (forced-404 layer) missing from stage."
  exit 1
fi
if [ ! -f "$STAGE/index.html" ]; then
  echo "❌  ABORT — index.html missing from stage (rsync problem?)."
  exit 1
fi
FILES=$(cd "$STAGE" && find . -type f | wc -l | tr -d ' ')
echo "   ✅  Clean — no docs/scripts/credentials. $FILES files staged, _redirects present."

if [ "$MODE" = "--check" ]; then
  echo "🔎  --check only — nothing deployed. Stage was at: $STAGE (now removed)."
  exit 0
fi

if ! command -v netlify &>/dev/null; then
  echo "❌  netlify CLI not found. Install:  npm i -g netlify-cli  (then: netlify login)"
  exit 1
fi

if [ "$MODE" = "--prod" ]; then
  echo "🚀  PROD deploy → jfsn-archive.netlify.app"
  netlify deploy --prod --dir "$STAGE"
  echo "✅  Netlify PROD deploy complete."
  echo "   Verify: curl -s https://jfsn-archive.netlify.app/sw.js | grep -o 'jfsn-[0-9]*'"
  echo "   And:    curl -s -o /dev/null -w '%{http_code}' https://jfsn-archive.netlify.app/JFSN-Archive-Handoff-Allison.pdf   # expect 404"
else
  echo "📝  DRAFT deploy (preview only — not live). Re-run with --prod once the preview looks right."
  netlify deploy --dir "$STAGE"
fi
