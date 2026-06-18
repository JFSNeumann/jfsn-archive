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
- [ ] What's the last cache version? (should be in PERF_BASELINE.md)

### Check Backups
```bash
# Verify B2 backup timestamp is recent
# Verify rsync backup has today's date
# Both should contain latest commit hash
```
✅ Backups are current and contain all commits.

---

## PHASE 4: PERFORMANCE BASELINE SETUP (2 min)

### Open Performance Baseline
```bash
cat /Documents/JFSN/PERF_BASELINE.md
```

### Note Previous Session Metrics
| Metric | Previous Session | This Session | Delta |
|--------|------------------|--------------|-------|
| Homepage LCP | X.Xs | — | — |
| Homepage Perf | X | — | — |
| Archive LCP | X.Xs | — | — |
| Archive Perf | X | — | — |

✅ Baseline metrics noted for comparison at session end.

---

## PHASE 5: FEATURE CHECKLIST SETUP (2 min)

### Open Feature Checklist
```bash
cat /Documents/JFSN/SESSION_FEATURE_CHECKLIST.md
```

### Create This Session's Checklist
```bash
cp /Documents/JFSN/SESSION_FEATURE_CHECKLIST.md \
   /Documents/JFSN/SESSION_[N]_FEATURE_CHECKLIST.md
```

### Add This Session's Features
Edit SESSION_[N]_FEATURE_CHECKLIST.md:
```markdown
## Session [N] Features to Verify

- [ ] Feature A: Description
  - [ ] Works on desktop
  - [ ] Works on mobile
  - [ ] Keyboard accessible
  - [ ] WCAG AA contrast

- [ ] Feature B: Description
  - [ ] Works on desktop
  - [ ] Works on mobile
  - [ ] Keyboard accessible
  - [ ] WCAG AA contrast
```

✅ Feature checklist ready for session.

---

## PHASE 6: VISUAL INSPECTION (3 min)

### Take Screenshots / Load Key Pages
- [ ] Homepage (light mode) — headings, spacing, images OK?
- [ ] Homepage (dark mode) — intentional aesthetic?
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

PHASE 4: Performance Baseline Setup (2 min)
- [ ] PERF_BASELINE.md opened
- [ ] Previous metrics noted
- [ ] Ready to capture new baseline

PHASE 5: Feature Checklist Setup (2 min)
- [ ] SESSION_FEATURE_CHECKLIST.md created
- [ ] This session's features defined
- [ ] Checklist ready to use

PHASE 6: Visual Inspection (3 min)
- [ ] Homepage looks good (light + dark)
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
