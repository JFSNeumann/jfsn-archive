# SESSION START PROCEDURES

**Purpose:** Standardized workflow to begin a session with full context and ready to work.

**Typical Duration:** 10-15 minutes  
**Frequency:** Start of every session  
**Status:** Established Session 63

---

## PHASE 1: MEMORY REVIEW (3 min)

### Read in This Order
1. **MEMORY.md** — Index only (first 30 lines)
   ```bash
   head -30 /Users/jeffreyneumann/.claude/projects/-Users-jeffreyneumann/memory/MEMORY.md
   ```

2. **FINAL SUMMARY from Previous Session** — Read entirely
   - Find the link at top of "The site" section
   - Example: `[Session 63 FINAL SUMMARY](session63_final_summary.md)`
   - Read this completely (tells you everything that shipped)

3. **CLAUDE.md** — Skim for any new constraints
   ```bash
   cat /Users/jeffreyneumann/Documents/JFSN/CLAUDE.md
   ```

4. **SESSION_KNOWN_ISSUES.md** — Check for anything to address
   ```bash
   cat /Users/jeffreyneumann/Documents/JFSN/SESSION_KNOWN_ISSUES.md
   ```

✅ **PASS:** You know what was shipped, what's broken, what the constraints are

---

## PHASE 2: LIVE STATE AUDIT (5 min)

### Check Git State
```bash
cd /Users/jeffreyneumann/Documents/JFSN
git status                              # Working tree clean?
git log --oneline -3                    # Latest commits visible?
git diff origin/main                    # Any uncommitted changes?
```
✅ All clean. If not clean, investigate before proceeding.

### Verify Production is Live
```bash
curl -I https://jfsn.com/              # HTTP 200?
curl -s https://jfsn.com/index.html | grep site.min.css  # CSS loaded?
```
✅ Site is live and accessible.

### Check Cache Version
```bash
grep CACHE_V /Users/jeffreyneumann/Documents/JFSN/sw.js
curl -s https://jfsn.com/sw.js | grep CACHE_V
# Both should match
```
✅ Cache version deployed and live.

### File Size Check
```bash
wc -l _shared/ui.css                    # CSS line count
wc -l _shared/micro-interactions.js     # JS line count
# Compare to previous session in memory
```
✅ Code metrics baseline established.

---

## PHASE 3: BASELINE & CONTEXT (3 min)

### Ask Yourself
- [ ] What was the last thing shipped? (from FINAL SUMMARY)
- [ ] Are there known issues to fix? (from SESSION_KNOWN_ISSUES.md)
- [ ] Did any issues surface in production? (check CLAUDE.md notes)
- [ ] What's the current visual aesthetic? (homepage, archive, mobile)
- [ ] What's the last cache version? (`CACHE_V` in `sw.js` — check `git log -1 -- sw.js`, not PERF_BASELINE.md)

### Check Backups

**Both nightly LaunchAgents (JEFFS-4TB, B2) have gone silently broken multiple times** — unloaded from launchd entirely (2026-07-06, 2026-07-16), then a stale script-path bug in both plists found one job at a time on consecutive days (2026-07-17, 2026-07-18). A clean reading for one job has never guaranteed the sibling job is sound — always check both, every session, with the real command below rather than eyeballing it:

```bash
bash scripts/backup-health-check.sh
```

Exit 0 + "Both backup jobs healthy." = good. Any `✗` line names exactly what's wrong (job unloaded, plist pointing at a missing script, or the log hasn't been touched in >26h) — fix that specific thing, then re-run to confirm before moving on.

---

## PHASE 4: PERFORMANCE BASELINE (as needed)

**Corrected 2026-07-19:** `PERF_BASELINE.md` is a dated one-off session record (Session 95, 2026-06-25), not a running document — it was moved to `docs/archive/2026/PERF_BASELINE.md` and won't be updated by future sessions. There is no standing "performance baseline" to open and compare against at the start of every session; treat this phase as optional, only relevant to a session specifically doing performance work.

```bash
# For historical numbers from the last dedicated perf pass:
cat docs/archive/2026/PERF_BASELINE.md

# To capture a fresh baseline, use the standard measured to date:
lighthouse <url> --throttling-method=devtools   # median of 3 runs
```

---

## PHASE 5: FEATURE CHECKLIST (as needed)

**Corrected 2026-07-19:** `SESSION_FEATURE_CHECKLIST.md` was a one-off checklist from Session 65 (2026-06-18) — it was moved to `docs/archive/2026/SESSION_FEATURE_CHECKLIST.md`. The "copy it to `SESSION_[N]_FEATURE_CHECKLIST.md` every session" ritual this phase used to prescribe was never actually followed after that session (verified: zero `SESSION_*_FEATURE_CHECKLIST.md` files exist anywhere in the repo besides the original). Don't treat this as a standing per-session step. If a session is shipping enough new features to warrant a dedicated verification pass, write one inline in that session's own notes instead of resurrecting this file-copy pattern.

---

## PHASE 6: VISUAL INSPECTION (3 min)

### Take Screenshots / Load Key Pages
- [ ] Homepage — headings, spacing, images OK? (permanently dark-themed, no light-mode toggle)
- [ ] Archive page — grid spacing, headers, hierarchy OK?
- [ ] Single artwork page — metadata, image, related works OK?
- [ ] Mobile (390px) — responsive, readable, touch-friendly?

### Quick Feature Spot-Check
- [ ] Search bar visible and functional
- [ ] Dark mode toggle works
- [ ] Audio player (if exists) visible
- [ ] Keyboard shortcuts work (P, N, V, B, ?)
- [ ] Focus mode works (if exists)

✅ Visual baseline established, no obvious regressions.

---

## PHASE 7: DEFINE SESSION WORK (2 min)

### Ask: What Should We Build?
Based on:
- Session 63 FINAL SUMMARY (opportunities listed)
- SESSION_KNOWN_ISSUES.md (issues to fix)
- Jeff's explicit request (from conversation)

### Examples
- "Continue with audio recordings on artwork pages"
- "Fix the focus mode transition"
- "Improve lost works section visibility"
- "Add export/sharing features"

✅ Session work defined and ready to start.

---

## QUICK REFERENCE CHECKLIST

```
SESSION START CHECKLIST (15 min)

PHASE 1: Memory Review (3 min)
- [ ] Read MEMORY.md (first 30 lines)
- [ ] Read FINAL SUMMARY from previous session
- [ ] Skim CLAUDE.md for constraints
- [ ] Check SESSION_KNOWN_ISSUES.md

PHASE 2: Live State Audit (5 min)
- [ ] git status clean
- [ ] git log shows latest commits
- [ ] curl https://jfsn.com/ → 200
- [ ] site.min.css loaded
- [ ] CACHE_V deployed and live

PHASE 3: Baseline & Context (3 min)
- [ ] Last shipped work understood
- [ ] Known issues identified
- [ ] Production issues checked
- [ ] Backups verified current

PHASE 4: Performance Baseline (only if doing perf work this session)
- [ ] docs/archive/2026/PERF_BASELINE.md checked for historical numbers, if relevant

PHASE 5: Feature Checklist (only if shipping enough features to warrant one)
- [ ] Inline verification notes written for this session, if warranted — no standing file to create

PHASE 6: Visual Inspection (3 min)
- [ ] Homepage looks good (the site is permanently dark-themed — there is no light-mode toggle)
- [ ] Archive looks good
- [ ] Artwork page looks good
- [ ] Mobile looks good (390px)
- [ ] Key features spot-checked

PHASE 7: Define Session Work (2 min)
- [ ] What should we build? (defined)
- [ ] Why? (rationale clear)
- [ ] How? (approach sketched)

✅ READY TO START — All context loaded, ready to code
```

---

## NEXT STEPS

1. **Run this entire checklist** — 15 min
2. **Ask user: "What should we work on?"**
3. **Start coding** when goal is clear

---

## ONE-LINER SESSION START

```bash
#!/bin/bash
echo "=== MEMORY ===" && \
head -30 ~/.claude/projects/-Users-jeffreyneumann/memory/MEMORY.md && \
echo "" && \
echo "=== STATE ===" && \
git status && \
echo "" && \
echo "=== METRICS ===" && \
echo "CSS: $(wc -l _shared/ui.css | awk '{print $1}') | JS: $(wc -l _shared/micro-interactions.js | awk '{print $1}')" && \
echo "" && \
echo "=== READY ===" && \
echo "✅ Session startup complete. What should we work on?"
```

---

**Last Updated:** 2026-06-18  
**Status:** Active SOP for Session 64+  
**Estimated Duration:** 10-15 minutes per session

**Pair this with:** `/Documents/JFSN/SESSION_END_PROCEDURES.md`
