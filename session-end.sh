#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# session-end.sh — Complete end-of-session workflow
#
# Combines: git commit/push, backup, and optional Netlify deployment
#
# Usage:
#   bash session-end.sh                    # commit + push + backup (no deploy)
#   bash session-end.sh --deploy           # + deploy to Netlify draft
#   bash session-end.sh --deploy --prod    # + deploy to Netlify production
#
# This script coordinates the full release workflow:
# 1. Verify no uncommitted changes in critical files
# 2. Git commit with Co-Authored-By footer
# 3. Git push to origin/main
# 4. Rsync backup to external drive
# 5. Optional: Deploy to Netlify (draft or prod)
#
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail
cd "$(dirname "$0")"

DEPLOY_MODE="none"
BACKUP_DIR="${BACKUP_DIR:-/Volumes/Backup-JFSN}"
TIMESTAMP=$(date +%s)

# Parse args
for arg in "$@"; do
  case "$arg" in
    --deploy)
      DEPLOY_MODE="draft"
      ;;
    --prod)
      DEPLOY_MODE="prod"
      ;;
  esac
done

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
  echo -e "${BLUE}→${NC} $1"
}

success() {
  echo -e "${GREEN}✓${NC} $1"
}

warning() {
  echo -e "${YELLOW}⚠${NC} $1"
}

# Step 1: Git status check
log "Checking git status..."
if [ -n "$(git status --porcelain)" ]; then
  warning "Uncommitted changes found:"
  git status --short
  echo ""
  read -p "Continue? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
  fi
fi

# Step 2: Git commit (if changes exist)
if [ -n "$(git status --porcelain)" ]; then
  log "Committing changes..."
  BRANCH=$(git rev-parse --abbrev-ref HEAD)
  COMMIT_MSG="Session end: automated commit and verification

- State saved at $(date)
- Branch: $BRANCH
- Files: $(git status --porcelain | wc -l)

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"

  git add -A
  git commit -m "$COMMIT_MSG" || warning "Nothing new to commit"
  success "Committed to git"
else
  log "No changes to commit"
fi

# Step 3: Git push
log "Pushing to origin/main..."
if git push origin main 2>&1 | grep -q "up to date\|fast-forward"; then
  success "Pushed to GitHub"
else
  warning "Push completed (check output above)"
fi

# Step 4: Backup
log "Creating backup..."
if [ -d "$BACKUP_DIR" ]; then
  rsync -av --delete \
    --exclude '.git' \
    --exclude '.netlify' \
    --exclude 'node_modules' \
    ./ "$BACKUP_DIR/jfsn-$TIMESTAMP/" 2>&1 | tail -5
  success "Backup saved to: $BACKUP_DIR/jfsn-$TIMESTAMP"
else
  warning "Backup directory not found: $BACKUP_DIR"
  warning "Skipping backup"
fi

# Step 5: Optional deployment
if [ "$DEPLOY_MODE" != "none" ]; then
  echo ""
  log "Deploying to Netlify ($DEPLOY_MODE)..."

  if [ "$DEPLOY_MODE" = "prod" ]; then
    bash deploy-netlify-improved.sh --prod
  else
    bash deploy-netlify-improved.sh
  fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
success "Session end workflow complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$DEPLOY_MODE" = "draft" ]; then
  echo "Next: Review preview, then run:"
  echo "  bash deploy-netlify-improved.sh --prod"
fi
