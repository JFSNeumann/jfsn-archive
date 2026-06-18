#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# auto-cache-bump.sh — auto-bump service worker cache version if CSS changed
#
# Usage: bash auto-cache-bump.sh [--check]
#   --check: dry-run (show what would happen)
#   (default): actually bump and stage sw.js
#
# When to run: After `npm run build:css` and before `git add`
# Or: Can be called from git pre-commit hook to auto-bump
#
# Why: Prevents users from getting stale CSS from old service worker cache.
#      CSS changes MUST update CACHE_V or users won't see them for days.
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

DRY_RUN=false
if [[ "${1:-}" == "--check" ]]; then
  DRY_RUN=true
fi

# Check if site.min.css changed in staging area
if ! git diff --cached site.min.css | grep -q .; then
  # No CSS changes staged
  exit 0
fi

# CSS changed — bump cache version
NEW_CACHE_V="jfsn-$(date +%s)"
SW_FILE="sw.js"

if [[ ! -f "$SW_FILE" ]]; then
  echo "❌ Error: $SW_FILE not found"
  exit 1
fi

OLD_CACHE_V=$(grep "const CACHE_V" "$SW_FILE" | head -1 | sed "s/.*'\(.*\)'.*/\1/")

if $DRY_RUN; then
  echo "🔍 DRY RUN: Would update cache version"
  echo "   Old: $OLD_CACHE_V"
  echo "   New: $NEW_CACHE_V"
  exit 0
fi

# Actually bump
sed -i "" "s|const CACHE_V  = '.*';|const CACHE_V  = '$NEW_CACHE_V';|" "$SW_FILE"
git add "$SW_FILE"

echo "✓ Cache version bumped: $NEW_CACHE_V"
echo "  Old: $OLD_CACHE_V"
echo "  File: $SW_FILE (staged)"
