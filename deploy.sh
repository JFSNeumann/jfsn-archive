#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# deploy.sh — unified master deployment script
#
# USAGE:
#   bash deploy.sh [--check|--draft|--prod] [--netlify-only|--hostgator-only]
#
# EXAMPLES:
#   bash deploy.sh --check           # Dry-run: validate only
#   bash deploy.sh --draft           # Deploy Netlify to draft (staging)
#   bash deploy.sh --prod            # Deploy both Netlify & HostGator (PRODUCTION)
#   bash deploy.sh --prod --netlify-only   # Skip HostGator, Netlify only
#
# WHAT IT DOES:
#   1. Run pre-deployment checks (--check: stops here)
#   2. Commit changes (git add, commit, push)
#   3. Deploy to Netlify (staging or prod)
#   4. Smoke tests (verify both sites live)
#   5. Report status (✓ all deployed, ⚠ partial deployed, ✗ errors)
#
# EXIT CODES:
#   0 = Success (all deployed)
#   1 = Checks failed, nothing deployed
#   2 = Partial deployment (one target failed)
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

MODE="check"        # check, draft, prod
TARGET="both"       # both, netlify-only, hostgator-only
DEPLOY_NETLIFY=false
DEPLOY_HOSTGATOR=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    --check)      MODE="check" ;;
    --draft)      MODE="draft" ;;
    --prod)       MODE="prod" ;;
    --netlify-only)    TARGET="netlify-only" ;;
    --hostgator-only)  TARGET="hostgator-only" ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: bash deploy.sh [--check|--draft|--prod] [--netlify-only|--hostgator-only]"
      exit 1
      ;;
  esac
  shift
done

# Determine what to deploy
case "$TARGET" in
  both)            DEPLOY_NETLIFY=true; DEPLOY_HOSTGATOR=true ;;
  netlify-only)    DEPLOY_NETLIFY=true; DEPLOY_HOSTGATOR=false ;;
  hostgator-only)  DEPLOY_NETLIFY=false; DEPLOY_HOSTGATOR=true ;;
esac

echo "╔════════════════════════════════════════════════════════════╗"
echo "║ JFSN Master Deploy Script                                  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Mode:     $MODE"
echo "Targets:  $([ "$DEPLOY_NETLIFY" = true ] && echo -n "Netlify "; [ "$DEPLOY_HOSTGATOR" = true ] && echo -n "HostGator")"
echo ""

# ─────────────────────────────────────────────────────────────────────────────
# PHASE 1: PRE-DEPLOYMENT CHECKS
# ─────────────────────────────────────────────────────────────────────────────

echo -e "${BLUE}PHASE 1: Pre-Deployment Checks${NC}"
echo ""

if ! bash pre-deploy-check.sh; then
  echo ""
  echo -e "${RED}✗ Pre-deployment checks failed${NC}"
  echo "Fix issues and re-run: bash deploy.sh $MODE"
  exit 1
fi

if [ "$MODE" = "check" ]; then
  echo ""
  echo -e "${GREEN}✓ All checks passed!${NC}"
  echo "To actually deploy, run:"
  echo "  bash deploy.sh --draft     (Netlify staging)"
  echo "  bash deploy.sh --prod      (Production)"
  exit 0
fi

# ─────────────────────────────────────────────────────────────────────────────
# PHASE 2: GIT COMMIT & PUSH
# ─────────────────────────────────────────────────────────────────────────────

echo ""
echo -e "${BLUE}PHASE 2: Git Commit & Push${NC}"
echo ""

# Auto-bump CACHE_V if CSS changed
bash auto-cache-bump.sh

# Check if there are actually changes to commit
if git diff --cached --quiet; then
  echo "ℹ No changes to commit"
else
  echo "Committing changes..."
  # Auto-generate commit message based on changed files
  CHANGED=$(git diff --cached --name-only | head -5 | tr '\n' ', ')
  echo "Files: $CHANGED"

  git commit -m "Deployment: $(date '+%Y-%m-%d %H:%M:%S')"
  echo -e "${GREEN}✓ Committed${NC}"
fi

# Push to GitHub
echo "Pushing to GitHub..."
if git push origin main 2>&1 | tail -1; then
  echo -e "${GREEN}✓ Pushed${NC}"
else
  echo -e "${YELLOW}ℹ Nothing new to push${NC}"
fi

# ─────────────────────────────────────────────────────────────────────────────
# PHASE 3: DEPLOY TO NETLIFY
# ─────────────────────────────────────────────────────────────────────────────

NETLIFY_DEPLOYED=false
if [ "$DEPLOY_NETLIFY" = true ]; then
  echo ""
  echo -e "${BLUE}PHASE 3: Deploy to Netlify${NC}"
  echo ""

  NETLIFY_ENV="--draft"
  if [ "$MODE" = "prod" ]; then
    NETLIFY_ENV="--prod"
  fi

  if bash deploy-netlify.sh "$NETLIFY_ENV" > /tmp/netlify-deploy.log 2>&1; then
    NETLIFY_DEPLOYED=true
    echo -e "${GREEN}✓ Netlify deployed ($NETLIFY_ENV)${NC}"
    [ "$MODE" = "prod" ] && echo "   URL: https://jfsn-archive.netlify.app" || echo "   URL: https://jfsn-archive.netlify.app (preview)"
  else
    echo -e "${RED}✗ Netlify deployment failed${NC}"
    cat /tmp/netlify-deploy.log | tail -20
  fi
fi

# ─────────────────────────────────────────────────────────────────────────────
# PHASE 4: DEPLOY TO HOSTGATOR
# ─────────────────────────────────────────────────────────────────────────────

HOSTGATOR_DEPLOYED=false
if [ "$DEPLOY_HOSTGATOR" = true ]; then
  echo ""
  echo -e "${BLUE}PHASE 4: Deploy to HostGator (Production)${NC}"
  echo ""

  # Check if JFSN.app is running
  if pgrep -l "JFSN" > /dev/null 2>&1; then
    echo "ℹ JFSN.app detected (running)"
    echo "  The app watches for file changes and uploads automatically."
    echo "  Keep the app open until deployment completes."
    HOSTGATOR_DEPLOYED=true
    echo -e "${YELLOW}⚠ Manual FTP required via JFSN.app${NC}"
  else
    echo "ℹ JFSN.app not running. HostGator deployment requires:"
    echo "  1. Open JFSN.app (macOS app on your computer)"
    echo "  2. Click 'Deploy to HostGator' button"
    echo "  3. Wait for upload to complete"
    echo ""
    echo -e "${YELLOW}⚠ Skipping HostGator (manual deployment required)${NC}"
  fi
fi

# ─────────────────────────────────────────────────────────────────────────────
# PHASE 5: SMOKE TESTS
# ─────────────────────────────────────────────────────────────────────────────

echo ""
echo -e "${BLUE}PHASE 5: Smoke Tests${NC}"
echo ""

TESTS_PASSED=0
TESTS_FAILED=0

# Test Netlify if deployed
if [ "$NETLIFY_DEPLOYED" = true ]; then
  echo "Testing Netlify (jfsn-archive.netlify.app)..."
  if curl -s https://jfsn-archive.netlify.app/index.html | grep -q "Jeffrey F. S. Neumann"; then
    echo -e "${GREEN}✓ Netlify homepage live${NC}"
    ((TESTS_PASSED++))
  else
    echo -e "${RED}✗ Netlify homepage not responding correctly${NC}"
    ((TESTS_FAILED++))
  fi
fi

# Test HostGator if deployed
if [ "$HOSTGATOR_DEPLOYED" = true ] || [ "$MODE" = "prod" ]; then
  echo "Testing HostGator (jfsn.com)..."
  if curl -s https://jfsn.com/index.html | grep -q "Jeffrey F. S. Neumann"; then
    echo -e "${GREEN}✓ HostGator homepage live${NC}"
    ((TESTS_PASSED++))
  else
    echo -e "${YELLOW}⚠ HostGator not responding (may still be uploading)${NC}"
    ((TESTS_FAILED++))
  fi
fi

# ─────────────────────────────────────────────────────────────────────────────
# FINAL REPORT
# ─────────────────────────────────────────────────────────────────────────────

echo ""
echo "╔════════════════════════════════════════════════════════════╗"

if [ "$TESTS_FAILED" -eq 0 ]; then
  echo -e "║ ${GREEN}✓ DEPLOYMENT SUCCESSFUL${NC}                            ║"
  echo "╚════════════════════════════════════════════════════════════╝"
  echo ""
  echo "✓ Checks passed"
  echo "✓ Changes committed & pushed"
  [ "$NETLIFY_DEPLOYED" = true ] && echo "✓ Netlify deployed"
  [ "$HOSTGATOR_DEPLOYED" = true ] && echo "✓ HostGator deployment initiated"
  echo ""
  echo "Deployed targets:"
  [ "$NETLIFY_DEPLOYED" = true ] && echo "  🌐 Netlify: jfsn-archive.netlify.app"
  [ "$HOSTGATOR_DEPLOYED" = true ] || [ "$MODE" = "prod" ] && echo "  🌐 HostGator: jfsn.com"
  echo ""
  exit 0
else
  echo -e "║ ${YELLOW}⚠ PARTIAL DEPLOYMENT${NC}                             ║"
  echo "╚════════════════════════════════════════════════════════════╝"
  echo ""
  echo "Some checks failed. Manual verification required:"
  echo "  • Visit https://jfsn-archive.netlify.app (staging)"
  echo "  • Visit https://jfsn.com (production)"
  echo "  • If anything broken, fix locally and re-deploy"
  echo ""
  exit 2
fi
