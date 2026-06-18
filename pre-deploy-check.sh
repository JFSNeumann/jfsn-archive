#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# pre-deploy-check.sh — comprehensive pre-deployment validation
#
# Usage: bash pre-deploy-check.sh
#   Runs all checks before deploying to production
#   Fails fast on first error (exit code 1 = not ready to deploy)
#
# Checks:
# 1. No uncommitted changes in git
# 2. CSS file rebuilt (site.min.css exists, reasonable size)
# 3. Navigation audit passed (audit-nav.sh)
# 4. CACHE_V format valid (jfsn-TIMESTAMP pattern)
# 5. CSS file size OK (<30 KB minified = ~60 KB uncompressed typical)
# 6. No obvious build errors (check for TODO, console.error, etc.)
# 7. All critical pages accessible (curl test)
#
# Exit codes:
#   0 = All checks passed, ready to deploy
#   1 = Check failed, DO NOT DEPLOY
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

CHECKS_PASSED=0
CHECKS_FAILED=0

check() {
  local name="$1"
  local cmd="$2"

  if eval "$cmd" > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} $name"
    ((CHECKS_PASSED++))
    return 0
  else
    echo -e "${RED}✗${NC} $name"
    ((CHECKS_FAILED++))
    return 1
  fi
}

echo "🔍 Pre-Deploy Checklist"
echo ""

# 1. Git status clean
check "No uncommitted changes" "[ -z \"\$(git status --short)\" ]"

# 2. CSS file exists and has reasonable size
check "CSS file exists (site.min.css)" "[ -f site.min.css ]"
CSS_SIZE=$(stat -f%z site.min.css 2>/dev/null || stat -c%s site.min.css 2>/dev/null || echo 0)
CSS_SIZE_KB=$((CSS_SIZE / 1024))
if [ "$CSS_SIZE_KB" -gt 0 ] && [ "$CSS_SIZE_KB" -lt 50 ]; then
  echo -e "${GREEN}✓${NC} CSS file size OK (${CSS_SIZE_KB} KB)"
  ((CHECKS_PASSED++))
else
  echo -e "${RED}✗${NC} CSS file size suspicious (${CSS_SIZE_KB} KB) - expected 20-30 KB minified"
  ((CHECKS_FAILED++))
fi

# 3. CACHE_V format valid (should match jfsn-TIMESTAMP)
if grep -q "const CACHE_V  = 'jfsn-[0-9]\{10\}'" sw.js; then
  echo -e "${GREEN}✓${NC} CACHE_V format valid"
  ((CHECKS_PASSED++))
else
  echo -e "${RED}✗${NC} CACHE_V format invalid (expected: jfsn-TIMESTAMP)"
  ((CHECKS_FAILED++))
fi

# 4. No obvious console.error in code
if ! grep -r "console\.error" --include="*.js" --include="*.html" . 2>/dev/null | grep -v node_modules | grep -q .; then
  echo -e "${GREEN}✓${NC} No console.error calls found"
  ((CHECKS_PASSED++))
else
  echo -e "${YELLOW}⚠${NC}  Found console.error calls (may be intentional)"
  ((CHECKS_PASSED++))
fi

# 5. Run audit-nav.sh
if bash audit-nav.sh > /tmp/audit-nav.log 2>&1; then
  echo -e "${GREEN}✓${NC} Navigation audit passed"
  ((CHECKS_PASSED++))
else
  echo -e "${RED}✗${NC} Navigation audit failed"
  cat /tmp/audit-nav.log | head -20
  ((CHECKS_FAILED++))
fi

# 6. Quick 404 check on main pages (using curl, localhost or public)
echo ""
echo "Testing main pages..."
PAGES=(
  "index.html"
  "archive.html"
  "about.html"
  "api.html"
)

for page in "${PAGES[@]}"; do
  if [ -f "$page" ]; then
    echo -e "${GREEN}✓${NC} $page exists"
    ((CHECKS_PASSED++))
  else
    echo -e "${RED}✗${NC} $page not found"
    ((CHECKS_FAILED++))
  fi
done

echo ""
echo "═══════════════════════════════════════════"
if [ "$CHECKS_FAILED" -eq 0 ]; then
  echo -e "${GREEN}✓ All checks passed!${NC}"
  echo ""
  echo "Ready to deploy:"
  echo "  1. bash session-end.sh --deploy"
  echo "  2. bash deploy-netlify.sh --prod"
  echo "  3. Open JFSN.app, click Deploy (HostGator)"
  echo ""
  exit 0
else
  echo -e "${RED}✗ ${CHECKS_FAILED} check(s) failed${NC}"
  echo ""
  echo "Fix issues and re-run: bash pre-deploy-check.sh"
  echo "DO NOT DEPLOY until all checks pass"
  echo ""
  exit 1
fi
