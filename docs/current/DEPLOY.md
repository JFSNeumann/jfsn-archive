# JFSN Deployment Guide

Complete workflow for deploying changes to production (HostGator, the only host). (Netlify secondary mirror + the Companion AI chat feature it hosted were removed 2026-06-22 — Netlify had no git integration, and Companion only ran as a Netlify Function, so dropping one meant dropping the other.)

---

## Quick Deploy (TL;DR)

```bash
# 1. Commit, push, and back up
bash scripts/session-end.sh

# 2. Deploy the live site
bash scripts/deploy-hostgator.sh
```

`session-end.sh` (no `--deploy` flag) handles git commit + push + local 4TB backup only. It does **not** touch jfsn.com — that's a separate, deliberate step.

---

## Before You Deploy

### 1. Verify your changes

```bash
bash scripts/preview-verify.sh
# Opens a local server, walks through a visual checklist of key pages
```

### 2. Ensure code is clean

```bash
git status
# Should show: "nothing to commit, working tree clean"
```

### 3. Optional — run the full pre-deploy checklist

```bash
bash scripts/pre-deploy-check.sh
# CSS rebuild check, nav audit, CACHE_V format, file-size sanity, uncommitted-changes check
```

---

## Deploy Workflow

### Step 1: Commit & local backup

```bash
bash scripts/session-end.sh
```

What it does:
- Stages and commits all changes
- Pushes to `origin/main`
- Backs up to JEFFS-4TB via `backup.sh`

**This step never touches the live site.** Deployment is always a separate, explicit step below.

### Step 2: Deploy to HostGator (production — jfsn.com)

```bash
bash scripts/deploy-hostgator.sh
```

This is the **primary deploy path** as of Session 70 (replaces the old JFSN.app desktop tool, which is no longer used). It:
- Refuses to run if the working tree is dirty (`git status --porcelain`) — prints the modified/untracked files and aborts with a non-zero exit. Override with `--force` or `DEPLOY_FORCE=1` for an intentional dirty deploy.
- Prints a short deployment summary first (branch, commit hash + subject, tree status, destination host, timestamp)
- Reads FTP credentials from `.ftp.env`
- Mirrors changed files via `lftp`
- Runs a smoke test against jfsn.com

The dirty-tree guard exists because `deploy-hostgator.sh` mirrors the working tree, not git — an uncommitted file ships exactly as it sits on disk, whether or not that was the intent. Commit or discard changes before deploying; use `--force` only when you deliberately want to test something live before it's committed.

The legacy full-mirror script `deploy.sh` no longer exists in the repo (re-verified 2026-06-23 — several docs still pointed to it as a live fallback, which was wrong since at least the 2026-06-22 Netlify-removal pass, possibly earlier). `deploy-hostgator.sh` is the only deploy script now; if it breaks, fix it rather than reaching for a deleted fallback.

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
bash scripts/pre-deploy-check.sh
```

Checks: CSS rebuilt, `audit-nav.sh` passes, CACHE_V format valid, no uncommitted changes, CSS file size sane. Fix anything it flags, re-run, then deploy.

---

## Troubleshooting

### "CSS is old/cached"
1. Hard refresh (Cmd+Shift+R).
2. If still old: DevTools → Application → Clear storage → reload.
3. Confirm `CACHE_V` was bumped: `grep CACHE_V sw.js`.

### "Pushed to GitHub but nothing changed live"
GitHub ≠ production. HostGator does not auto-deploy on push. Run `bash scripts/deploy-hostgator.sh`.

---

## Deployment Targets

| Target | Type | URL | Auto? | Deploy command |
|--------|------|-----|-------|-----------------|
| GitHub | Repo | github.com/JFSNeumann/jfsn-archive | Manual `git push` (via `session-end.sh`) | — |
| HostGator | **Production (the only host)** | jfsn.com | Manual | `bash scripts/deploy-hostgator.sh` |

---

## Never deploy

- With uncommitted changes — `deploy-hostgator.sh` enforces this automatically now (aborts unless `--force`/`DEPLOY_FORCE=1` is set); this line is the reason the guard exists, not just a reminder
- Without running `pre-deploy-check.sh` (or at least `audit-nav.sh`)
- If a pre-deploy check fails
- If a Lighthouse run shows a performance regression you haven't investigated

---

**Questions?** See `CLAUDE.md` or `SESSION_START_PROCEDURES.md` for more context.

---

## Smoke-test note — homepage false alarm fixed 2026-08-02

For three consecutive deploys the smoke test reported the homepage as
`✗ Homepage — pattern not found: Jeffrey F. S. Neumann` while the page was live
and correct (HTTP 200, pattern present three times, verified by `curl`).

Cause: `smoke_check()` issued **two separate curl calls** — one for the body, one
for the status code — and judged them as a single result. When the body call hit
`--max-time 10` on the homepage (69KB, by far the largest file checked, fetched
cold immediately after upload), `$body` came back empty while the status call
succeeded against a now-warm file. That produced "HTTP 200 + pattern missing" on
a healthy page, and the retries could not help because each attempt repeated the
same split fetch.

Fixed: one fetch, with the status code appended to the body via `-w`, and the
timeout raised to 30s. Verified by deliberately breaking it — a bogus pattern
still fails, and a missing URL still reports HTTP 404.

**Consequence for future sessions:** the smoke test is trustworthy again. If it
reports a failure now, check the site rather than assuming the checker is wrong.
