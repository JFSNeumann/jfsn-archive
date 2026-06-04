#!/usr/bin/env bash
# start-session.sh — run this at the beginning of every session
cd "$(dirname "$0")"

echo ""
echo "═══════════════════════════════════════"
echo "  JFSN — Session Start"
echo "═══════════════════════════════════════"
echo ""

# Last commit
echo "📌  Last commit:"
git log -1 --pretty="   %h — %s (%ar)"
echo ""

# Open items from IMPROVEMENTS.md
echo "📋  Open items:"
grep -E '^\- \[ \]' IMPROVEMENTS.md | grep -v '~~' | sed 's/- \[ \] /   🔲  /' | head -10
echo ""

# Run full audit
echo "🔍  Running audit..."
bash audit-nav.sh
echo ""

echo "───────────────────────────────────────"
echo "  Ready. What do you want to work on?"
echo "═══════════════════════════════════════"
echo ""
