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
# Accepts optional commit message as $1 (for non-interactive / Claude Code use)
CHANGED=$(git status --porcelain | wc -l | tr -d ' ')
if [ "$CHANGED" -gt 0 ]; then
  echo "📝  $CHANGED uncommitted file(s):"
  git status --short
  echo ""
  if [ -n "$1" ]; then
    MSG="$1"
  elif [ -t 0 ]; then
    # Interactive terminal — prompt for message
    read -p "   Commit message (or press Enter to skip): " MSG
  else
    # Non-interactive (piped / Claude Code) — auto-commit with timestamp
    MSG="Session update $(date '+%Y-%m-%d %H:%M')"
    echo "   Non-interactive mode — using: $MSG"
  fi
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
  echo "💾  Running local backup..."
  bash backup.sh
  echo "   ✅  Local backup complete."
else
  echo "⚠️   JEFFS-4TB drive not mounted — skipping local backup."
  echo "   Plug in the drive and run:  bash backup.sh"
fi

echo ""
echo "☁️   Running cloud backup (Backblaze B2)..."
if bash cloud-backup.sh 2>/dev/null; then
  echo "   ✅  Cloud backup complete."
else
  echo "   ⚠️   Cloud backup failed or skipped — run  bash cloud-backup.sh  manually."
fi

echo ""

# ── 3. Show what to tell Claude ───────────────────────────────────────────────
echo "───────────────────────────────────────"
echo "  Visual check (do before committing CSS/layout changes):"
echo ""
echo "  1. index.html — desktop + mobile (375px)"
echo "  2. archive.html — desktop + mobile"
echo "  3. Confirm no regressions, then commit"
echo ""
echo "  Paste this to Claude to update memory:"
echo ""
echo "  Update memory."
echo ""
echo "───────────────────────────────────────"
echo ""

# ── 4. Update CURRENT_STATE.md ────────────────────────────────────────────────
# Only updates the metadata header (Updated / Last commit).
# All session notes written by Claude or Jeff are PRESERVED.
DATE=$(date "+%Y-%m-%d %H:%M")
LAST_COMMIT=$(git log -1 --pretty="%h — %s")

# Update the **Updated:** line
if grep -q '^\*\*Updated:\*\*' CURRENT_STATE.md 2>/dev/null; then
  sed -i '' "s|^\*\*Updated:\*\*.*|**Updated:** $DATE|" CURRENT_STATE.md
fi

# Update the last commit line (line after "## Last commit")
if grep -q '^## Last commit' CURRENT_STATE.md 2>/dev/null; then
  # Replace the line immediately after the heading
  awk -v commit="$LAST_COMMIT" '
    /^## Last commit/ { print; getline; print commit; next }
    { print }
  ' CURRENT_STATE.md > CURRENT_STATE.tmp && mv CURRENT_STATE.tmp CURRENT_STATE.md
fi

# Refresh archive stats line (won't fail if catalog.json is missing)
STATS=$(python3 -c "import json; c=json.load(open('catalog.json')); print(f'- {len(c)} works cataloged, 0 errors')" 2>/dev/null || echo "- run build_catalog.py to refresh")
if grep -q '^- [0-9]* works cataloged' CURRENT_STATE.md 2>/dev/null; then
  sed -i '' "s|^- [0-9]* works cataloged.*|$STATS|" CURRENT_STATE.md
fi

echo "📄  CURRENT_STATE.md header updated (session notes preserved)."
echo ""

# ── 5. Deploy — launch JFSN.app automatically ────────────────────────────────
echo "🚀  Launching JFSN.app to deploy to HostGator..."
open /Applications/JFSN.app 2>/dev/null || echo "   ⚠️   JFSN.app not found — deploy manually."

echo ""
echo "📄  Docs check — did anything change this session that affects:"
echo "    README.md · CLAUDE.md · STITCH.md · SESSION_PROMPT.md"
echo "    If yes → update in a follow-up commit before next session."

echo ""
echo "═══════════════════════════════════════"
echo "  Done. Good work today."
echo "═══════════════════════════════════════"
echo ""
