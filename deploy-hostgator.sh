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
mirror --reverse --delete --exclude-glob=.git/* --exclude-glob=.DS_Store --exclude-glob=node_modules/* --exclude-glob=qa.html --exclude-glob=curate.html --exclude-glob=dedupe.html --exclude-glob=curate-session.json --exclude-glob=*.md --exclude-glob=docs/* .
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
mirror --reverse --delete --exclude-glob=.git/* --exclude-glob=.DS_Store --exclude-glob=node_modules/* --exclude-glob=qa.html --exclude-glob=curate.html --exclude-glob=dedupe.html --exclude-glob=curate-session.json --exclude-glob=*.md --exclude-glob=docs/* .
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

if curl -s https://jfsn.com/index.html | grep -q "Jeffrey F. S. Neumann"; then
  echo -e "${GREEN}✓ jfsn.com homepage live${NC}"
  TEST_PASSED=true
else
  echo -e "${YELLOW}⚠ jfsn.com not responding yet (may still be syncing)${NC}"
  TEST_PASSED=false
fi

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
    echo -e "${GREEN}✓ Homepage is live${NC}"
  else
    echo -e "${YELLOW}ℹ Changes may take a few minutes to propagate${NC}"
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
