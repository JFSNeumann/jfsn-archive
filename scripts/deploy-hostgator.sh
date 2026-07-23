#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# deploy-hostgator.sh — HostGator FTP deployment (CLI replacement for JFSN.app)
#
# USAGE:
#   bash deploy-hostgator.sh
#
# WHAT IT DOES:
#   1. Reads FTP credentials from .ftp.env
#   2. Uploads all files to HostGator via lftp
#   3. Verifies deployment with smoke test
#   4. Reports status
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# --force (or DEPLOY_FORCE=1) overrides the dirty-working-tree guard below.
FORCE_DEPLOY=false
for arg in "$@"; do
  if [ "$arg" = "--force" ]; then
    FORCE_DEPLOY=true
  fi
done
if [ "${DEPLOY_FORCE:-}" = "1" ]; then
  FORCE_DEPLOY=true
fi

echo "╔════════════════════════════════════════════════════════════╗"
echo "║ HostGator Deployment (FTP)                                 ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# ─────────────────────────────────────────────────────────────────────────────
# PHASE 1: Check prerequisites
# ─────────────────────────────────────────────────────────────────────────────

echo -e "${BLUE}PHASE 1: Checking Prerequisites${NC}"
echo ""

# Check if .ftp.env exists
if [ ! -f .ftp.env ]; then
  echo -e "${RED}✗ .ftp.env not found${NC}"
  echo "Cannot proceed without FTP credentials."
  exit 1
fi

# Check if lftp is installed
if ! command -v lftp &> /dev/null; then
  echo -e "${RED}✗ lftp not installed${NC}"
  echo "Install with: brew install lftp"
  exit 1
fi

echo -e "${GREEN}✓ .ftp.env found${NC}"
echo -e "${GREEN}✓ lftp available${NC}"
echo ""

# ─────────────────────────────────────────────────────────────────────────────
# PHASE 2: Load FTP credentials
# ─────────────────────────────────────────────────────────────────────────────

echo -e "${BLUE}PHASE 2: Loading FTP Credentials${NC}"
echo ""

# Source the FTP env file
source .ftp.env

if [ -z "${FTP_HOST:-}" ] || [ -z "${FTP_USER:-}" ] || [ -z "${FTP_PASS:-}" ]; then
  echo -e "${RED}✗ FTP credentials incomplete${NC}"
  echo "Ensure .ftp.env has FTP_HOST, FTP_USER, FTP_PASS"
  exit 1
fi

echo -e "${GREEN}✓ Credentials loaded${NC}"
echo "  Host: $FTP_HOST"
echo "  User: $FTP_USER"
echo ""

# ─────────────────────────────────────────────────────────────────────────────
# PHASE 2.5: Dirty working tree guard + deployment summary
# ─────────────────────────────────────────────────────────────────────────────

echo -e "${BLUE}PHASE 2.5: Pre-Deploy Check${NC}"
echo ""

GIT_STATUS="$(git status --porcelain)"
GIT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
GIT_HASH="$(git rev-parse --short HEAD)"
GIT_SUBJECT="$(git log -1 --pretty=%s)"

if [ -n "$GIT_STATUS" ]; then
  TREE_STATE="Dirty"
else
  TREE_STATE="Clean"
fi

echo "Deployment Summary"
echo "  Branch:       $GIT_BRANCH"
echo "  Commit:       $GIT_HASH ($GIT_SUBJECT)"
echo "  Tree status:  $TREE_STATE"
echo "  Destination:  $FTP_HOST"
echo "  Timestamp:    $(date '+%Y-%m-%d %H:%M:%S %Z')"
echo ""

if [ -n "$GIT_STATUS" ]; then
  echo -e "${RED}✗ Working tree is not clean${NC}"
  echo "$GIT_STATUS"
  echo ""
  if [ "$FORCE_DEPLOY" = true ]; then
    echo -e "${YELLOW}⚠ --force set — deploying dirty working tree anyway${NC}"
    echo ""
  else
    echo "Deployment aborted: uncommitted changes would be shipped to production."
    echo "Commit, stash, or discard these changes, or re-run with --force to deploy anyway."
    exit 1
  fi
else
  echo -e "${GREEN}✓ Working tree clean${NC}"
  echo ""
fi

# ─────────────────────────────────────────────────────────────────────────────
# PHASE 3: Upload via FTP
# ─────────────────────────────────────────────────────────────────────────────

echo -e "${BLUE}PHASE 3: Uploading to HostGator${NC}"
echo ""

# Create FTP command script
FTP_SCRIPT=$(mktemp)
cat > "$FTP_SCRIPT" << 'FTPSCRIPT'
set ftp:ssl-allow/all yes
set ssl:verify-certificate no
open -u $FTP_USER,$FTP_PASS $FTP_HOST
set ftp:passive-mode on
mirror --reverse --delete --exclude-glob=.git/* --exclude-glob=.DS_Store --exclude-glob=node_modules/* --exclude-glob=qa.html --exclude-glob=curate.html --exclude-glob=dedupe.html --exclude-glob=curate-session.json --exclude-glob=*.md --exclude-glob=docs/* --exclude-glob=JFSN-Archive-Handoff-Allison.pdf --exclude-glob=archive .
quit
FTPSCRIPT

# Run lftp with credentials
echo "Connecting to $FTP_HOST and uploading files..."
echo ""

if lftp -f <(echo "
set ftp:ssl-allow/all yes
set ssl:verify-certificate no
open -u $FTP_USER:$FTP_PASS $FTP_HOST
set ftp:passive-mode on
mirror --reverse --delete --exclude-glob=.git/* --exclude-glob=.DS_Store --exclude-glob=node_modules/* --exclude-glob=qa.html --exclude-glob=curate.html --exclude-glob=dedupe.html --exclude-glob=curate-session.json --exclude-glob=*.md --exclude-glob=docs/* --exclude-glob=JFSN-Archive-Handoff-Allison.pdf --exclude-glob=archive .
quit
"); then
  echo ""
  echo -e "${GREEN}✓ Upload complete${NC}"
  UPLOAD_SUCCESS=true
else
  echo ""
  echo -e "${RED}✗ Upload failed${NC}"
  echo "Check FTP credentials and connection."
  rm -f "$FTP_SCRIPT"
  exit 1
fi

rm -f "$FTP_SCRIPT"

# ─────────────────────────────────────────────────────────────────────────────
# PHASE 4: Smoke test
# ─────────────────────────────────────────────────────────────────────────────

echo ""
echo -e "${BLUE}PHASE 4: Smoke Test${NC}"
echo ""

echo "Testing jfsn.com..."
sleep 3

TEST_PASSED=true
SMOKE_FAILURES=()

SMOKE_RETRIES=3      # attempts per check (HostGator can still be syncing right after upload)
SMOKE_RETRY_WAIT=25  # seconds between attempts

smoke_check() {
  local url="$1"
  local pattern="$2"
  local label="$3"
  local body http_code attempt
  for attempt in $(seq 1 "$SMOKE_RETRIES"); do
    body=$(curl -s --max-time 10 "$url")
    http_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url")
    if [ "$http_code" = "200" ] && echo "$body" | grep -q "$pattern"; then
      echo -e "${GREEN}✓ $label${NC}"
      return 0
    fi
    if [ "$attempt" -lt "$SMOKE_RETRIES" ]; then
      echo -e "${YELLOW}… $label — not ready (attempt $attempt/$SMOKE_RETRIES), retrying in ${SMOKE_RETRY_WAIT}s${NC}"
      sleep "$SMOKE_RETRY_WAIT"
    fi
  done
  if [ "$http_code" != "200" ]; then
    echo -e "${RED}✗ $label — HTTP $http_code${NC}"
    SMOKE_FAILURES+=("$label (HTTP $http_code)")
  else
    echo -e "${RED}✗ $label — pattern not found: $pattern${NC}"
    SMOKE_FAILURES+=("$label (missing: $pattern)")
  fi
  TEST_PASSED=false
}

smoke_check "https://jfsn.com/index.html"                    "Jeffrey F. S. Neumann"  "Homepage"
smoke_check "https://jfsn.com/archive.html"                  "current.json"           "Archive"
smoke_check "https://jfsn.com/artwork.html"                  "room-veil"              "Artwork page"
smoke_check "https://jfsn.com/artworks/pages/art0001.html"  "art0001"                "Generated artwork page"
smoke_check "https://jfsn.com/config/catalog-lite.json"     "\"file\""               "catalog-lite.json"
smoke_check "https://jfsn.com/_shared/artwork-page-min.js"  "showToast"              "artwork-page-min.js"
smoke_check "https://jfsn.com/sw.js"                        "CACHE_V"                "Service worker"
smoke_check "https://jfsn.com/site.min.css"                 "font-family"            "site.min.css"
smoke_check "https://jfsn.com/404.html"                     "Not Found"              "404 page"
smoke_check "https://jfsn.com/about.html"                   "Jeffrey"                "About page"

# ─────────────────────────────────────────────────────────────────────────────
# FINAL REPORT
# ─────────────────────────────────────────────────────────────────────────────

echo ""
echo "╔════════════════════════════════════════════════════════════╗"

if [ "$UPLOAD_SUCCESS" = true ]; then
  echo -e "║ ${GREEN}✓ DEPLOYMENT SUCCESSFUL${NC}                            ║"
  echo "╚════════════════════════════════════════════════════════════╝"
  echo ""
  echo "✓ Files uploaded to HostGator"
  echo "✓ jfsn.com deployment initiated"
  echo ""
  if [ "$TEST_PASSED" = true ]; then
    echo -e "${GREEN}✓ All smoke checks passed${NC}"
  else
    echo -e "${RED}✗ Smoke check failures:${NC}"
    for f in "${SMOKE_FAILURES[@]}"; do
      echo -e "  ${RED}• $f${NC}"
    done
    echo -e "${YELLOW}ℹ The site may still be syncing — recheck in 2 minutes.${NC}"
    echo -e "${YELLOW}ℹ If failures persist, the deploy may be incomplete.${NC}"
  fi
  echo ""
  echo "Visit: https://jfsn.com"
  echo ""
  exit 0
else
  echo -e "║ ${RED}✗ DEPLOYMENT FAILED${NC}                              ║"
  echo "╚════════════════════════════════════════════════════════════╝"
  echo ""
  echo "Check FTP credentials in .ftp.env and try again."
  echo ""
  exit 1
fi
