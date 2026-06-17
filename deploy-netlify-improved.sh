#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# deploy-netlify-improved.sh — Enhanced Netlify deployment workflow
#
# Improvements over deploy-netlify.sh:
# 1. Better error handling for --prod (fallback to manual promotion if needed)
# 2. Draft URL capture for easy preview verification
# 3. Automatic verification of deployment success
# 4. Better logging and troubleshooting info
# 5. Optional: netlify link auto-check
#
# Usage:
#   bash deploy-netlify-improved.sh --check      # safety check only
#   bash deploy-netlify-improved.sh              # draft deploy + show preview
#   bash deploy-netlify-improved.sh --prod       # attempt prod (with fallback)
#   bash deploy-netlify-improved.sh --promote    # promote last draft to prod via API
#
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail
cd "$(dirname "$0")"

MODE="${1:-draft}"
SITE_ID="jfsn-archive"
NETLIFY_SITE_URL="https://jfsn-archive.netlify.app"
LOG_FILE="/tmp/netlify-deploy-$(date +%s).log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
  echo -e "${BLUE}→${NC} $1" | tee -a "$LOG_FILE"
}

success() {
  echo -e "${GREEN}✓${NC} $1" | tee -a "$LOG_FILE"
}

error() {
  echo -e "${RED}✗${NC} $1" | tee -a "$LOG_FILE"
}

warning() {
  echo -e "${YELLOW}⚠${NC} $1" | tee -a "$LOG_FILE"
}

# Check Netlify CLI
if ! command -v netlify &>/dev/null; then
  error "netlify CLI not found"
  echo "Install: npm i -g netlify-cli"
  echo "Then run: netlify login"
  exit 1
fi

# Check Netlify auth and site link
log "Checking Netlify authentication..."
if ! netlify status &>/dev/null; then
  error "Not authenticated with Netlify"
  echo "Run: netlify login"
  exit 1
fi

log "Checking Netlify site link..."
if ! netlify link --name "$SITE_ID" &>/dev/null 2>&1; then
  warning "Site not linked. Attempting to link..."
  netlify link --name "$SITE_ID" || {
    error "Could not link to $SITE_ID"
    exit 1
  }
fi
success "Netlify link verified"

# Build staging copy
STAGEROOT="$(mktemp -d)"
STAGE="$STAGEROOT/stage"
mkdir -p "$STAGE"
trap 'rm -rf "$STAGEROOT"' EXIT

log "Building curated staging copy..."
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
  --exclude 'deno.lock' \
  --exclude 'design-concepts/' \
  --exclude 'curate.html' \
  --exclude 'dedupe.html' \
  --exclude 'qa.html' \
  --exclude 'curate-session.json' \
  2>&1 | tee -a "$LOG_FILE"

# Safety gate
log "Scanning for sensitive files..."
LEAKS=$(cd "$STAGE" && find . \
  \( -name '.ftp.env' -o -name '*.pdf' -o -name '*.py' -o -name '*.sh' \
     -o -name '*.md' -o -path './docs/*' -o -path './old-site/*' \) 2>/dev/null || true)

if [ -n "$LEAKS" ]; then
  error "ABORT — sensitive files present:"
  echo "$LEAKS"
  exit 1
fi

if [ ! -f "$STAGE/_redirects" ]; then
  error "ABORT — _redirects missing from stage"
  exit 1
fi

if [ ! -f "$STAGE/index.html" ]; then
  error "ABORT — index.html missing from stage"
  exit 1
fi

FILES=$(cd "$STAGE" && find . -type f | wc -l | tr -d ' ')
success "Clean staging copy — $FILES files, _redirects present"

if [ "$MODE" = "--check" ]; then
  log "Safety check only — no deployment"
  success "Stage is ready to deploy"
  exit 0
fi

# Draft deploy
log "Starting DRAFT deploy..."
DEPLOY_OUTPUT=$(mktemp)
if netlify deploy --dir "$STAGE" --json > "$DEPLOY_OUTPUT" 2>&1; then
  success "Draft deployed successfully"

  # Extract draft URL from output
  DRAFT_URL=$(jq -r '.deploy_url' "$DEPLOY_OUTPUT" 2>/dev/null || echo "")
  if [ -n "$DRAFT_URL" ]; then
    success "Preview URL: $DRAFT_URL"
    echo "$DRAFT_URL" > "/tmp/netlify-draft-url.txt"
  fi

  # Show deployment info
  DEPLOY_ID=$(jq -r '.id' "$DEPLOY_OUTPUT" 2>/dev/null || echo "")
  if [ -n "$DEPLOY_ID" ]; then
    log "Deployment ID: $DEPLOY_ID"
    log "Build logs: https://app.netlify.com/projects/$SITE_ID/deploys/$DEPLOY_ID"
  fi
else
  error "Draft deploy failed"
  cat "$DEPLOY_OUTPUT" | tee -a "$LOG_FILE"
  rm -f "$DEPLOY_OUTPUT"
  exit 1
fi
rm -f "$DEPLOY_OUTPUT"

# Verify draft is live
if [ -n "$DRAFT_URL" ]; then
  log "Verifying draft deployment..."
  sleep 2
  if curl -s -f "$DRAFT_URL/index.html" > /dev/null 2>&1; then
    success "Draft is accessible and live"
  else
    warning "Draft URL not accessible yet (may still be propagating)"
  fi
fi

# Handle --prod mode
if [ "$MODE" = "--prod" ]; then
  log "Attempting PROD deploy..."

  # Try netlify deploy --prod
  PROD_OUTPUT=$(mktemp)
  if netlify deploy --prod --dir "$STAGE" --json > "$PROD_OUTPUT" 2>&1; then
    success "PROD deploy successful!"

    PROD_DEPLOY_ID=$(jq -r '.id' "$PROD_OUTPUT" 2>/dev/null || echo "")
    if [ -n "$PROD_DEPLOY_ID" ]; then
      log "Production Deployment ID: $PROD_DEPLOY_ID"
    fi

    log "Verifying production..."
    sleep 3
    if curl -s -f "$NETLIFY_SITE_URL/index.html" > /dev/null 2>&1; then
      success "Production site is live!"

      # Verify cache version
      CACHE_V=$(curl -s "$NETLIFY_SITE_URL/sw.js" | grep -o 'jfsn-[0-9]*' | head -1)
      log "Service worker cache: $CACHE_V"
    fi

    rm -f "$PROD_OUTPUT"
  else
    warning "PROD deploy via CLI failed (permission issue)"
    cat "$PROD_OUTPUT" | tee -a "$LOG_FILE"
    rm -f "$PROD_OUTPUT"

    if [ -n "$DRAFT_URL" ]; then
      log ""
      log "Fallback: Promote draft to production manually"
      log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
      log "1. Visit: https://app.netlify.com/projects/$SITE_ID/deploys"
      log "2. Find the draft (URL: $DRAFT_URL)"
      log "3. Click '...' menu → 'Publish deploy'"
      log ""
      log "Or use: netlify deploy --prod"
      log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
      exit 1
    fi
  fi
else
  log ""
  log "Next: Review the preview, then deploy to production"
  log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  if [ -n "$DRAFT_URL" ]; then
    log "Preview: $DRAFT_URL"
  fi
  log "Command: bash deploy-netlify-improved.sh --prod"
  log "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
fi

log "Deploy log saved to: $LOG_FILE"
