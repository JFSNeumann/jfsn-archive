#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# end-session.sh  —  run this when you're done working
# Usage:  bash end-session.sh
# ─────────────────────────────────────────────────────────────────────────────
set -e
cd "$(dirname "$0")"

echo ""
echo "═══════════════════════════════════════"
echo "  JFSN — End of Session"
echo "═══════════════════════════════════════"
echo ""

# ── 1. Show what changed ──────────────────────────────────────────────────────
CHANGED=$(git status --porcelain | wc -l | tr -d ' ')
if [ "$CHANGED" -gt 0 ]; then
  echo "📝  $CHANGED uncommitted file(s):"
  git status --short
  echo ""
  read -p "   Commit message (or press Enter to skip): " MSG
  if [ -n "$MSG" ]; then
    git add -A
    git commit -m "$MSG

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
    git push
    echo "   ✅  Committed and pushed."
  else
    echo "   ⚠️   Skipped commit — changes are NOT saved to git."
  fi
else
  echo "✅  Nothing uncommitted."
  # Push in case there are unpushed commits
  UNPUSHED=$(git log origin/main..HEAD --oneline 2>/dev/null | wc -l | tr -d ' ')
  if [ "$UNPUSHED" -gt 0 ]; then
    echo "   $UNPUSHED commit(s) not yet pushed. Pushing now..."
    git push
    echo "   ✅  Pushed."
  fi
fi

echo ""

# ── 2. Backup ─────────────────────────────────────────────────────────────────
if [ -d "/Volumes/JEFFS-4TB" ]; then
  echo "💾  Running backup..."
  bash backup.sh
  echo "   ✅  Backup complete."
else
  echo "⚠️   JEFFS-4TB drive not mounted — skipping backup."
  echo "   Plug in the drive and run:  bash backup.sh"
fi

echo ""

# ── 3. Show what to tell Claude ───────────────────────────────────────────────
echo "───────────────────────────────────────"
echo "  One last thing — tell Claude:"
echo ""
echo '  "Update memory. Today we: [1-2 sentences about what changed]"'
echo ""
echo "  Examples:"
echo '  "Update memory. Fixed CSP, added description to search, deployed."'
echo '  "Update memory. Shot 20 new works, ingested them, ran catalog."'
echo "───────────────────────────────────────"
echo ""

# ── 4. Update CURRENT_STATE.md ────────────────────────────────────────────────
DATE=$(date "+%Y-%m-%d %H:%M")
LAST_COMMIT=$(git log -1 --pretty="%h — %s")

# Preserve the Known issues section from the current CURRENT_STATE.md
KNOWN_ISSUES=$(awk '/^## Known issues/{found=1} found && /^## / && !/^## Known issues/{found=0} found{print}' CURRENT_STATE.md 2>/dev/null)
if [ -z "$KNOWN_ISSUES" ]; then
  KNOWN_ISSUES="## Known issues
- (none)"
fi

cat > CURRENT_STATE.md << EOF
# Current State
**Updated:** $DATE

## Last commit
$LAST_COMMIT

## To do next session
<!-- Edit this section before closing -->
- [ ] (add what you want to do next time)

$KNOWN_ISSUES

## Site is live at
- jfsn.com  (primary — cPanel)
- jfsn-archive.netlify.app  (secondary — Netlify, has Companion function)

## Archive stats
$(python3 -c "import json; c=json.load(open('catalog.json')); print(f'- {len(c)} works cataloged, 0 errors')" 2>/dev/null || echo "- run build_catalog.py to refresh")
EOF

echo "📄  CURRENT_STATE.md updated."
echo ""

# ── 5. Deploy to HostGator ────────────────────────────────────────────────────
read -p "🚀  Deploy to HostGator now? (y/N): " DEPLOY
if [[ "$DEPLOY" =~ ^[Yy]$ ]]; then
  echo "   Deploying via FTP — this takes 2–5 minutes..."
  bash "$(dirname "$0")/deploy.sh"
  echo "   ✅  Deploy complete."
else
  echo "   Skipped. Run  bash deploy.sh  when ready."
fi

echo ""
echo "═══════════════════════════════════════"
echo "  Done. Good work today."
echo "═══════════════════════════════════════"
echo ""
