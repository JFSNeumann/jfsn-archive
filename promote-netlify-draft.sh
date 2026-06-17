#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# promote-netlify-draft.sh — Promote a draft deployment to production via API
#
# Usage:
#   bash promote-netlify-draft.sh                   # promote latest draft
#   bash promote-netlify-draft.sh <deploy-id>       # promote specific draft
#   bash promote-netlify-draft.sh --list             # list recent drafts
#
# This script uses the Netlify API directly to promote a draft to production.
# Useful when the CLI --prod flag has permission issues.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail
cd "$(dirname "$0")"

SITE_ID="jfsn-archive"
NETLIFY_API="https://api.netlify.com/api/v1"

# Get auth token
if [ -z "${NETLIFY_AUTH_TOKEN:-}" ]; then
  # Try to get from netlify CLI
  if command -v netlify &>/dev/null; then
    NETLIFY_AUTH_TOKEN=$(netlify status 2>/dev/null | grep -i "auth" | head -1 | awk '{print $NF}' || echo "")
  fi
fi

if [ -z "${NETLIFY_AUTH_TOKEN:-}" ]; then
  echo "❌  NETLIFY_AUTH_TOKEN not set and couldn't retrieve from netlify CLI"
  echo "Set: export NETLIFY_AUTH_TOKEN=<your-token>"
  echo "Or run: netlify login"
  exit 1
fi

case "${1:-latest}" in
  --list)
    echo "📋  Recent deployments for $SITE_ID:"
    curl -s -H "Authorization: Bearer $NETLIFY_AUTH_TOKEN" \
      "$NETLIFY_API/sites/$SITE_ID/builds?limit=10" | jq -r '.[] | "\(.id): \(.state) - \(.created_at)"'
    ;;

  --latest|"")
    # Get site ID for API
    SITE_API_ID=$(curl -s -H "Authorization: Bearer $NETLIFY_AUTH_TOKEN" \
      "$NETLIFY_API/sites?filter=name&name=$SITE_ID" | jq -r '.[0].id')

    if [ -z "$SITE_API_ID" ] || [ "$SITE_API_ID" = "null" ]; then
      echo "❌  Could not find site $SITE_ID"
      exit 1
    fi

    echo "🔍  Finding latest draft for $SITE_ID..."
    LATEST_DEPLOY=$(curl -s -H "Authorization: Bearer $NETLIFY_AUTH_TOKEN" \
      "$NETLIFY_API/sites/$SITE_API_ID/builds?limit=1" | jq -r '.[0].id')

    if [ -z "$LATEST_DEPLOY" ] || [ "$LATEST_DEPLOY" = "null" ]; then
      echo "❌  No recent deployments found"
      exit 1
    fi

    echo "📤  Promoting $LATEST_DEPLOY to production..."
    curl -s -X POST \
      -H "Authorization: Bearer $NETLIFY_AUTH_TOKEN" \
      "$NETLIFY_API/sites/$SITE_API_ID/deploys/$LATEST_DEPLOY/restore" | jq '.'

    echo "✅  Deploy promoted to production!"
    echo "🌐  Verify: https://jfsn-archive.netlify.app"
    ;;

  *)
    # Specific deploy ID provided
    DEPLOY_ID="$1"
    echo "📤  Promoting $DEPLOY_ID to production..."

    SITE_API_ID=$(curl -s -H "Authorization: Bearer $NETLIFY_AUTH_TOKEN" \
      "$NETLIFY_API/sites?filter=name&name=$SITE_ID" | jq -r '.[0].id')

    curl -s -X POST \
      -H "Authorization: Bearer $NETLIFY_AUTH_TOKEN" \
      "$NETLIFY_API/sites/$SITE_API_ID/deploys/$DEPLOY_ID/restore" | jq '.'

    echo "✅  Deploy promoted to production!"
    echo "🌐  Verify: https://jfsn-archive.netlify.app"
    ;;
esac
