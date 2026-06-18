# JFSN Deployment Guide

Complete workflow for deploying changes to production (HostGator) and staging (Netlify).

---

## Quick Deploy (TL;DR)

```bash
# When you're done working:
bash session-end.sh --deploy --prod

# That's it. Script handles:
# ✓ Git commit + push
# ✓ Backup
# ✓ Netlify staging deploy
# ✓ Instructions for HostGator FTP
```

---

## Before You Deploy

### 1. **Verify Your Changes**

```bash
# Option A: Quick visual check
bash preview-verify.sh
# Opens local server, walks through key pages

# Option B: Full pre-deploy checklist
bash pre-deploy-check.sh
# Runs: CSS rebuild, nav audit, Lighthouse, 404 checks, etc.
```

### 2. **Ensure Code is Clean**

```bash
git status
# Should show: "On branch main, nothing to commit, working tree clean"
# If not, run: git add . && git commit -m "..."
```

### 3. **Check Performance Baseline** (optional)

```bash
cat PERF_BASELINE.md
# Compare this session's metrics to last session
# If LCP increased >10% or Perf dropped >5 points: investigate before deploying
```

---

## Deploy Workflow

### Step 1: Commit & Backup

```bash
bash session-end.sh
# Prompts for:
# 1. Commit message
# 2. Auto-bumps CACHE_V if CSS changed
# 3. Commits to git
# 4. Pushes to GitHub
# 5. Backs up to local rsync + B2 cloud
```

**What it does:**
- Stages all changes (`git add .`)
- Creates commit with your message
- Bumps service worker cache version if `site.min.css` changed
- Pushes to `origin/main`
- Backs up site to external drive + B2

**Stop here if you want to:**
- Review on staging first (Netlify mirror)
- Deploy later to production

---

### Step 2: Deploy to Netlify (Staging Mirror)

```bash
bash deploy-netlify.sh --prod
```

**What it does:**
- Deploys curated copy to `jfsn-archive.netlify.app` (staging)
- Filters out: `docs/`, `.ftp.env`, `*.py`, `*.sh`, `*.md`, `.git`
- Prevents credential/build-file leaks
- Takes ~30 seconds

**Verify:**
```bash
# Visit https://jfsn-archive.netlify.app
# Check: homepage, archive, artwork page, mobile
# If anything looks broken: fix locally, commit, re-deploy
```

---

### Step 3: Deploy to HostGator (Production)

Currently **manual FTP only** (Netlify has no git integration).

#### Option A: Desktop JFSN.app (recommended)
```bash
# Open the JFSN.app (macOS app you have locally)
# Click "Deploy to HostGator"
# Watches for local file changes, uploads via FTP automatically
```

#### Option B: Manual FTP (if JFSN.app unavailable)
```bash
# Credentials in: ~/.ftp.env (keep PRIVATE)
# Use your FTP client to upload changed files to jfsn.com root

# Or via lftp command line:
lftp -u $FTP_USER,$FTP_PASS jfsn.com <<< "
  mirror -R --parallel=4 --delete . /public_html
  quit
"
```

**⚠️ IMPORTANT:** Only new/changed files. Never do full replace.

---

### Step 4: Verify Production

```bash
# Visit https://jfsn.com
# Spot-check:
# ✓ Homepage loads
# ✓ Archive grid appears
# ✓ Click an artwork → loads
# ✓ Mobile layout responsive
# ✓ CSS is fresh (not cached old version)
```

**Verify CSS is fresh:**
```bash
# Open DevTools → Network → Find site.min.css
# Check the response header: "cache-control: max-age=2592000" (30 days)
# If you see old CSS, refresh hard: Cmd+Shift+R (macOS) or Ctrl+Shift+R (Windows)
# If still old after hard refresh: service worker has stale cache
#   → Try: DevTools → Application → Clear storage → Full reload
```

**Verify service worker updated:**
```bash
# DevTools → Application → Service Workers
# Should show latest CACHE_V version (e.g., jfsn-1718888888)
# If old version shown: user has stale cache, will refresh on next visit
```

---

## Automated Pre-Deploy Checklist

Run before deploying to catch issues:

```bash
bash pre-deploy-check.sh
```

**Checks:**
1. ✓ CSS file rebuilt (`site.min.css` is current)
2. ✓ Navigation audit passed (`audit-nav.sh`)
3. ✓ Performance baseline captured (Lighthouse)
4. ✓ No broken links (curl all pages)
5. ✓ CSS file size OK (<30 KB minified)
6. ✓ CACHE_V format valid
7. ✓ No uncommitted changes in git
8. ✓ Service worker cache version bumped (if CSS changed)

**If any check fails:**
- Script reports which checks failed
- Fix locally
- Re-run `bash pre-deploy-check.sh`
- Then deploy

---

## Troubleshooting

### "CSS is old/cached"
```bash
# Option 1: Hard refresh in browser (Cmd+Shift+R)
# Option 2: Clear service worker cache
#   → DevTools → Application → Storage → Clear site data
# Option 3: Check CACHE_V was bumped
#   → grep "CACHE_V" sw.js
#   → If unchanged: run auto-cache-bump.sh manually
```

### "One target updated, other didn't"
```bash
# If Netlify is live but HostGator isn't:
bash deploy-netlify.sh --prod  # Re-deploy Netlify
# Then: Open JFSN.app and upload to HostGator

# If HostGator is live but Netlify isn't:
bash deploy-netlify.sh --prod  # Deploy to Netlify
```

### "Pre-deploy check failed"
```bash
# Example: CSS file size too large (>30 KB)
# 1. Run: npm run build:css
# 2. Check size: ls -lh site.min.css
# 3. If still large: review recent CSS additions
# 4. Commit changes and re-run check
```

### "Changes pushed to GitHub but not deployed anywhere"
```bash
# GitHub ≠ Production
# Netlify watches: manual deploy-netlify.sh
# HostGator watches: manual JFSN.app upload
# 
# To deploy after pushing:
bash deploy-netlify.sh --prod        # Netlify
# Then open JFSN.app and click Deploy  # HostGator
```

---

## Deployment Targets

| Target | Type | URL | Auto? | Deploy Cmd |
|--------|------|-----|-------|-----------|
| GitHub | Repo | github.com/JFSNeumann/jfsn-archive | Manual git push | `git push` |
| Netlify | Staging | jfsn-archive.netlify.app | Manual script | `bash deploy-netlify.sh` |
| HostGator | Production | jfsn.com | Manual JFSN.app | JFSN.app UI |

---

## Sessions & Deployment Cadence

**Typical session workflow:**
1. 📝 Work (code, test, verify with preview-verify.sh)
2. ✅ End session: `bash session-end.sh` (commit + backup)
3. 🌐 Review on Netlify: `bash deploy-netlify.sh --prod`
4. 📦 If OK, deploy HostGator (JFSN.app)
5. ✔️ Spot-check production

**Never deploy:**
- With uncommitted changes
- Without running pre-deploy-check.sh
- If pre-deploy checks fail
- If performance baseline shows regression
- If any feature is broken

---

## Next: Upcoming Improvements

**Planned (Session 66+):**
- [ ] Master deploy script (one command: `bash deploy.sh --prod`)
- [ ] Git pre-commit hook (auto-validates before commits)
- [ ] Auto smoke tests (post-deploy verification)
- [ ] Session start script (auto-setup baseline + checklist)

---

**Questions?** See CLAUDE.md or SESSION_START_PROCEDURES.md for more context.
