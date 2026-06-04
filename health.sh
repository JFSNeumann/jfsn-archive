#!/usr/bin/env bash
# health.sh — full site health check with score
# Usage: bash health.sh
cd "$(dirname "$0")"

echo ""
echo "═══════════════════════════════════════"
echo "  JFSN — Site Health Check"
echo "═══════════════════════════════════════"
echo ""

# Run audit and capture output
OUTPUT=$(bash audit-nav.sh 2>&1)
echo "$OUTPUT"

# Score
PASS=$(echo "$OUTPUT" | grep -c "^✅")
WARN=$(echo "$OUTPUT" | grep -c "⚠")

TOTAL=$((PASS + (WARN > 0 ? 1 : 0)))
echo ""
echo "───────────────────────────────────────"
if [ "$WARN" -eq 0 ]; then
  echo "  Score: $PASS/$PASS checks passed ✅"
else
  echo "  Score: $PASS passed, $WARN warning(s) ⚠"
fi
echo "  $(date '+%Y-%m-%d %H:%M')"
echo "═══════════════════════════════════════"
echo ""
