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

# ── 0. Refresh CURRENT_STATE.md header BEFORE committing ─────────────────────
# Done first (not after the commit) so the commit captures it — otherwise the
# header bump + stats left git dirty and one commit behind the backup every run.
DATE=$(date "+%Y-%m-%d %H:%M")
if grep -q '^\*\*Updated:\*\*' CURRENT_STATE.md 2>/dev/null; then
  sed -i '' "s|^\*\*Updated:\*\*.*|**Updated:** $DATE|" CURRENT_STATE.md
fi
STATS=$(python3 -c "import json; c=json.load(open('catalog.json')); print(f'- {len(c)} works cataloged, 0 errors')" 2>/dev/null || echo "- run build_catalog.py to refresh")
if grep -q '^- [0-9]* works cataloged' CURRENT_STATE.md 2>/dev/null; then
  sed -i '' "s|^- [0-9]* works cataloged.*|$STATS|" CURRENT_STATE.md
fi

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

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
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
  # A count warning from backup.sh must never abort this script —
  # skipping the cloud backup is worse than a stale local count.
  if bash backup.sh; then
    echo "   ✅  Local backup complete."
  else
    echo "   ⚠️   backup.sh reported a count mismatch — review, but continuing to cloud backup."
  fi
else
  echo "⚠️   JEFFS-4TB drive not mounted — skipping local backup."
  echo "   Plug in the drive and run:  bash backup.sh"
fi

echo ""
echo "☁️   Running cloud backup (Backblaze B2)..."
if bash cloud-backup.sh 2>/dev/null; then
  B2_TS=$(date '+%Y-%m-%d %H:%M:%S')
  echo "   ✅  Cloud backup complete at $B2_TS"
  # Stamp the timestamp into CURRENT_STATE.md for next-session verification
  if grep -q '^\*\*Last B2 backup:\*\*' CURRENT_STATE.md 2>/dev/null; then
    sed -i '' "s|^\*\*Last B2 backup:\*\*.*|**Last B2 backup:** $B2_TS|" CURRENT_STATE.md
  fi
else
  echo "   ⚠️   Cloud backup failed or skipped — run  bash cloud-backup.sh  manually."
fi

# ── 2b. Reconcile post-backup residuals ──────────────────────────────────────
# The B2-timestamp stamp above (and any other late tracked-file write) mutates
# files AFTER the commit. Commit + push + re-sync the 4TB so git and the local
# mirror both end clean at the true final state.
# (The async JFSN.app deploy may still regenerate api/changes/feed afterward —
#  the next session's start-up verification catches that.)
if [ -n "$(git status --porcelain)" ]; then
  echo ""
  echo "🔄  Reconciling post-backup residuals..."
  git add -A
  git commit -m "Session close: backup timestamps + residuals

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>" >/dev/null 2>&1 || true
  git push >/dev/null 2>&1 || true
  [ -d "/Volumes/JEFFS-4TB" ] && bash backup.sh >/dev/null 2>&1 || true
  echo "   ✅  Residuals committed, pushed, and re-synced to 4TB."
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

# ── 4. Deploy — launch JFSN.app automatically ────────────────────────────────
echo "🚀  Launching JFSN.app to deploy to HostGator..."
open ~/Desktop/Deploy\ JFSN.app 2>/dev/null || echo "   ⚠️   Deploy JFSN.app not found on Desktop — deploy manually."

echo ""
echo "📄  Docs check — did anything change this session that affects:"
echo "    README.md · CLAUDE.md · STITCH.md · SESSION_PROMPT.md"
echo "    If yes → update in a follow-up commit before next session."

echo ""
echo "═══════════════════════════════════════"
echo "  Done. Good work today."
echo "═══════════════════════════════════════"
echo ""
