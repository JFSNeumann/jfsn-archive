#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# auto-cache-bump.sh — auto-bump service worker cache version if any
# explicitly precached static asset (CSS or JS) changed
#
# Usage: bash auto-cache-bump.sh [--check]
#   --check: dry-run (show what would happen)
#   (default): actually bump and stage sw.js
#
# When to run: After `npm run build:css` and before `git add`
# Or: Can be called from git pre-commit hook to auto-bump
#
# Why: Prevents users from getting a stale precached file from an old
#      service worker cache. .htaccess sets a 1-month browser Expires
#      header on JS/CSS with no cache-busting filenames anywhere, so a
#      CACHE_V bump is the ONLY thing that forces a fresh fetch for
#      these specific files — cache.addAll() in sw.js's install handler
#      bypasses HTTP cache per spec, but only for files actually listed
#      in PRECACHE. Originally CSS-only; extended 2026-06-23 after a
#      JS-only bugfix to search.js sat invisible to this check, even
#      though search.js is itself precached by name. PRECACHE_FILES
#      below must stay in sync with sw.js's PRECACHE array (the static
#      asset entries only — HTML pages and the one hardcoded AVIF aren't
#      relevant to this CSS/JS-staleness check).
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

DRY_RUN=false
if [[ "${1:-}" == "--check" ]]; then
  DRY_RUN=true
fi

PRECACHE_FILES=(
  site.min.css
  search.js
  _shared/ui.css
  _shared/ui.js
  _shared/nav-active.js
  _shared/anime.min.js
)

# Check if any precached static asset changed in staging area
CHANGED=false
for f in "${PRECACHE_FILES[@]}"; do
  if git diff --cached "$f" 2>/dev/null | grep -q .; then
    CHANGED=true
    break
  fi
done

if ! $CHANGED; then
  exit 0
fi

# A precached asset changed — bump cache version
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
