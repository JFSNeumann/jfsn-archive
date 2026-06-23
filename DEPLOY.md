# JFSN Deployment Guide

Complete workflow for deploying changes to production (HostGator, the only host). (Netlify secondary mirror + the Companion AI chat feature it hosted were removed 2026-06-22 — Netlify had no git integration, and Companion only ran as a Netlify Function, so dropping one meant dropping the other.)

---

## Quick Deploy (TL;DR)

```bash
# 1. Commit, push, and back up
bash session-end.sh

# 2. Deploy the live site
bash deploy-hostgator.sh
```

`session-end.sh` (no `--deploy` flag) handles git commit + push + local 4TB backup only. It does **not** touch jfsn.com — that's a separate, deliberate step.

---

## Before You Deploy

### 1. Verify your changes

```bash
bash preview-verify.sh
# Opens a local server, walks through a visual checklist of key pages
```

### 2. Ensure code is clean

```bash
git status
# Should show: "nothing to commit, working tree clean"
```

### 3. Optional — run the full pre-deploy checklist

```bash
bash pre-deploy-check.sh
# CSS rebuild check, nav audit, CACHE_V format, file-size sanity, uncommitted-changes check
```

---

## Deploy Workflow

### Step 1: Commit & local backup

```bash
bash session-end.sh
```

What it does:
- Stages and commits all changes
- Pushes to `origin/main`
- Backs up to JEFFS-4TB via `backup.sh`

**This step never touches the live site.** Deployment is always a separate, explicit step below.

### Step 2: Deploy to HostGator (production — jfsn.com)

```bash
bash deploy-hostgator.sh
```

This is the **primary deploy path** as of Session 70 (replaces the old JFSN.app desktop tool, which is no longer used). It:
- Reads FTP credentials from `.ftp.env`
- Mirrors changed files via `lftp`
- Runs a smoke test against jfsn.com

The legacy full-mirror script `deploy.sh` still exists in the repo but is superseded by `deploy-hostgator.sh` — don't use it unless `deploy-hostgator.sh` is broken.

**Hero AVIFs need a separate upload:** `artworks/full/*.avif` is excluded from the normal mirror (`.htaccess` rewrites it to a flat `/artworks/` path on the server). New or recompressed hero crops (`artNNNN-hero.avif`, `artNNNN-hero-m.avif`) must be uploaded flat via `lftp` directly — see `CLAUDE.md` § Deployment.

### Step 3: Verify production

```bash
curl -I https://jfsn.com/
# Check: homepage, archive, an artwork page, mobile layout, CSS freshness
```

**If CSS looks stale:** hard refresh (Cmd+Shift+R). If still stale, the service worker has a cached copy — DevTools → Application → Clear storage → reload, and confirm `CACHE_V` in `sw.js` was bumped before this deploy.

---

## Automated Pre-Deploy Checklist

```bash
bash pre-deploy-check.sh
```

Checks: CSS rebuilt, `audit-nav.sh` passes, CACHE_V format valid, no uncommitted changes, CSS file size sane. Fix anything it flags, re-run, then deploy.

---

## Troubleshooting

### "CSS is old/cached"
1. Hard refresh (Cmd+Shift+R).
2. If still old: DevTools → Application → Clear storage → reload.
3. Confirm `CACHE_V` was bumped: `grep CACHE_V sw.js`.

### "Pushed to GitHub but nothing changed live"
GitHub ≠ production. HostGator does not auto-deploy on push. Run `bash deploy-hostgator.sh`.

---

## Deployment Targets

| Target | Type | URL | Auto? | Deploy command |
|--------|------|-----|-------|-----------------|
| GitHub | Repo | github.com/JFSNeumann/jfsn-archive | Manual `git push` (via `session-end.sh`) | — |
| HostGator | **Production (the only host)** | jfsn.com | Manual | `bash deploy-hostgator.sh` |

---

## Never deploy

- With uncommitted changes
- Without running `pre-deploy-check.sh` (or at least `audit-nav.sh`)
- If a pre-deploy check fails
- If a Lighthouse run shows a performance regression you haven't investigated

---

**Questions?** See `CLAUDE.md` or `SESSION_START_PROCEDURES.md` for more context.
