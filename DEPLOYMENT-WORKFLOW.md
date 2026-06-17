# Improved Deployment Workflow

## Overview

Three new scripts have been added to streamline the deployment process:

1. **`deploy-netlify-improved.sh`** — Enhanced Netlify deployment with better error handling
2. **`promote-netlify-draft.sh`** — Promote draft deployments to production via API
3. **`session-end.sh`** — Unified session workflow (commit + push + backup + optional deploy)

## Quick Start

### Option A: Simple Workflow (Recommended)

```bash
# Make changes, then at end of session:
bash session-end.sh                    # Git commit + push + backup
bash session-end.sh --deploy           # + Deploy draft to Netlify for preview
bash session-end.sh --deploy --prod    # + Deploy to production (after reviewing preview)
```

### Option B: Step-by-Step

```bash
# After making changes:
bash end-session.sh                    # Original: commit + push + backup

# Then deploy:
bash deploy-netlify-improved.sh        # Draft deploy (shows preview URL)
bash deploy-netlify-improved.sh --prod # Production deploy (or manual if CLI auth fails)
```

### Option C: Troubleshooting --prod Issues

If `--prod` flag fails with "Forbidden":

```bash
# Option 1: Promote via API (more reliable)
bash promote-netlify-draft.sh          # Promote latest draft to prod

# Option 2: Manual promotion
# - Visit: https://app.netlify.com/projects/jfsn-archive/deploys
# - Click '...' menu on latest deploy → 'Publish deploy'

# Option 3: List recent deployments
bash promote-netlify-draft.sh --list   # Show deployment IDs
bash promote-netlify-draft.sh <id>     # Promote specific ID
```

## Detailed Usage

### `deploy-netlify-improved.sh`

Enhanced Netlify deployment script with:
- Better error handling and logging
- Auto-verification of deployments
- Fallback guidance for --prod permission issues
- JSON output parsing for deployment info
- Comprehensive logging to `/tmp/netlify-deploy-*.log`

**Usage:**
```bash
bash deploy-netlify-improved.sh --check      # Safety check only (no deployment)
bash deploy-netlify-improved.sh              # Draft deploy (shows preview URL)
bash deploy-netlify-improved.sh --prod       # Production deploy
```

**Features:**
- ✓ Automatic Netlify CLI auth check
- ✓ Auto-link to site if needed
- ✓ Draft URL capture and verification
- ✓ Cache version verification (sw.js)
- ✓ Fallback instructions for --prod issues
- ✓ Detailed logging for troubleshooting

### `promote-netlify-draft.sh`

Promote draft deployments to production via Netlify API:

**Usage:**
```bash
bash promote-netlify-draft.sh              # Promote latest draft to prod
bash promote-netlify-draft.sh <deploy-id>  # Promote specific deploy
bash promote-netlify-draft.sh --list       # List recent deployments
```

**Notes:**
- Uses Netlify API directly (bypasses CLI --prod permission issues)
- Requires `NETLIFY_AUTH_TOKEN` env var (auto-detected from `netlify login`)
- Requires `jq` for JSON parsing (`brew install jq`)

**Example workflow:**
```bash
# Deploy draft
bash deploy-netlify-improved.sh

# Review preview at displayed URL

# Promote to production (if CLI --prod failed)
bash promote-netlify-draft.sh
```

### `session-end.sh`

Unified session workflow:

**Usage:**
```bash
bash session-end.sh                    # Commit + push + backup (no deploy)
bash session-end.sh --deploy           # + Draft deploy
bash session-end.sh --deploy --prod    # + Production deploy
```

**Steps:**
1. Check git status (prompts if uncommitted changes)
2. Commit with Co-Authored-By footer
3. Push to origin/main
4. Rsync backup to external drive
5. Optional: Deploy to Netlify

**Environment:**
- `BACKUP_DIR` — custom backup path (default: `/Volumes/Backup-JFSN`)

## Common Issues & Solutions

### Issue: "Forbidden" error on `netlify deploy --prod`

This is a known Netlify CLI edge case with team permissions.

**Solution A (Recommended):**
```bash
bash promote-netlify-draft.sh
```

**Solution B:**
```bash
# Manual promotion via UI
# 1. Visit: https://app.netlify.com/projects/jfsn-archive/deploys
# 2. Find latest draft → '...' menu → 'Publish deploy'
```

**Solution C:**
```bash
# Re-authenticate
netlify logout
netlify login
bash deploy-netlify-improved.sh --prod
```

### Issue: "Not authenticated with Netlify"

Run:
```bash
netlify login
netlify link --name jfsn-archive
```

### Issue: Draft deploy succeeds but can't verify

The CDN may still be propagating. Wait 10-15 seconds and manually check the draft URL shown in terminal.

## Workflow Comparison

| Task | Old | New |
|------|-----|-----|
| Commit + Push | `bash end-session.sh` | `bash session-end.sh` |
| Draft Deploy | `bash deploy-netlify.sh` | `bash deploy-netlify-improved.sh` |
| Prod Deploy | `bash deploy-netlify.sh --prod` ⚠️ (fails) | `bash promote-netlify-draft.sh` ✓ (works) |
| Full Pipeline | 3 separate commands | `bash session-end.sh --deploy --prod` |

## Logging & Debugging

All deploys create detailed logs:

```bash
# View latest deployment log
less /tmp/netlify-deploy-*.log

# Search for errors
grep "Error\|error\|Failed" /tmp/netlify-deploy-*.log
```

## Environment Setup (One-Time)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Authenticate
netlify login

# Link site
cd ~/Documents/JFSN
netlify link --name jfsn-archive

# (Optional) Install jq for API-based promotion
brew install jq

# Test
bash deploy-netlify-improved.sh --check
```

## Next Steps

After successful deployment:

1. **Verify live:** https://jfsn-archive.netlify.app
2. **Check cache:** `curl -s https://jfsn-archive.netlify.app/sw.js | grep -o 'jfsn-[0-9]*'`
3. **Security check:** `curl -s -o /dev/null -w '%{http_code}' https://jfsn-archive.netlify.app/JFSN-Archive-Handoff-Allison.pdf` (should return 404)

---

**Updated:** 2026-06-17  
**Tested with:** netlify-cli v17.x, jq 1.6+
