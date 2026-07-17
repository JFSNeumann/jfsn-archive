# SESSION END PROCEDURES

**Purpose:** Standardized checklist to close out a session safely and hand off to the next one.

**Typical Duration:** 20-30 minutes  
**Frequency:** End of every session  
**Status:** Established Session 63

---

## PHASE 1: CODE VERIFICATION (5 min)

### Git State
```bash
git status                          # Should be clean
git log --oneline -5               # Latest commits visible?
git diff origin/main               # No uncommitted changes?
```
✅ **PASS:** Working tree clean, latest commits on origin/main

### CSS Build
```bash
npm run build:css                  # Rebuilt successfully?
wc -l _shared/ui.css               # Lines tracked (for history)
wc -l _shared/micro-interactions.js # Lines tracked (for history)
```
✅ **PASS:** CSS rebuilt, files compressed properly

### Cache Version
```bash
grep CACHE_V sw.js                 # Version bumped?
git log --oneline -1 | grep -i cache  # Cache bump in latest commit?
```
✅ **PASS:** CACHE_V is new timestamp, auto-incremented by linter

### Fact Propagation Check (added 2026-06-22)
**If this session corrected a previously-documented fact** (a credential status, an
account-ownership claim, a deploy method, anything stated as true elsewhere in the repo),
grep for the *old* fact across all `.md` files before closing the item — don't assume
fixing it in one place is enough:
```bash
grep -rln "the old wording" --include="*.md" .
```
This exists because the 2026-06-16 domain-ownership correction was recorded accurately in
one place but propagated to zero of the six other files that stated the old "friend holds
the domain" claim — including `CURRENT_STATE.md`, the first file read at every session
start. Found and fixed in the 2026-06-22 documentation audit; don't let it recur with the
next fact that changes.
✅ **PASS:** No other file in the repo still states the corrected fact's old version

---

## PHASE 2: DEPLOYMENT VERIFICATION (5 min)

### Live Site Check
```bash
curl -I https://jfsn.com/          # HTTP 200?
curl -I https://jfsn.com/archive.html
curl -s https://jfsn.com/index.html | grep site.min.css  # CSS served?
```
✅ **PASS:** All URLs return 200, CSS loaded

### Cache Version Live
```bash
# Check browser F12 → Network → site.min.css → Response Headers
# Should show new CACHE_V
# Or check service worker:
curl -s https://jfsn.com/sw.js | grep CACHE_V
```
✅ **PASS:** Latest CACHE_V deployed, SW cache invalidated

### Visual Spot-Check
- [ ] Homepage loads (light mode)
- [ ] Dark mode toggle works (⌘Shift+D / Ctrl+Shift+D)
- [ ] Archive page loads
- [ ] Single artwork page loads
- [ ] Mobile viewport works (resize to 390px)
- [ ] Key features work (search, audio if added, etc.)

✅ **PASS:** All visual checks pass, no obvious regressions

---

## PHASE 3: PERFORMANCE BASELINE (5 min)

### Capture Final Metrics
```bash
# Open Chrome DevTools → Lighthouse
# Run for:
# - Desktop homepage
# - Mobile homepage
# - Desktop archive
# - Mobile archive

# Record in: /Documents/JFSN/PERF_BASELINE.md
```

**Metrics to capture:**
- Homepage LCP, CLS, Performance score
- Archive LCP, CLS, Performance score
- Mobile performance scores

✅ **PASS:** Baseline recorded, no unexpected regressions

---

## PHASE 4: FEATURE VERIFICATION (5 min)

### Check All Features Work
**Use:** `/Documents/JFSN/SESSION_FEATURE_CHECKLIST.md`

Go through checklist:
- [ ] All new features from this session work
- [ ] Previous features still work (regression check)
- [ ] No broken keyboard nav
- [ ] No broken accessibility
- [ ] No visual regressions

✅ **PASS:** All features verified, SESSION_FEATURE_CHECKLIST.md complete

---

## PHASE 5: MEMORY DOCUMENTATION (5-10 min)

### Create 3 Memory Files

#### 1. Individual Feature Memory (if features added)
**File:** `session[N]_features.md` or `session[N]_[feature].md`
- What features were built
- Technical implementation details
- Testing notes
- Known issues with this feature

#### 2. Visual/Design Memory (if visual changes)
**File:** `session[N]_visual.md` or `session[N]_design.md`
- Design decisions made
- CSS changes (+X lines)
- Visual direction established
- Dark mode changes
- Responsive refinements

#### 3. Final Summary (MANDATORY)
**File:** `session[N]_final_summary.md`
- **Complete work breakdown** (features + improvements count)
- What shipped vs. what was punted
- Total commits, CSS lines, JS lines
- Cache version final
- Next opportunities
- **Mark as "READ THIS FIRST"** for next session

### Update MEMORY.md Index
```markdown
## The site
- [Session 63 FINAL SUMMARY](session63_final_summary.md) — Read this first. Complete breakdown.
- [Session 63 Visual Design v2](session63_visual_design_v2.md) — Design decisions.
- [Session 63 Phases 9-12](session63_phases9to12.md) — Feature details.
```

✅ **PASS:** 3 memory files created, MEMORY.md index updated

---

## PHASE 6: KNOWN ISSUES LOG (2 min)

### Document Any Issues Found
**File:** `/Documents/JFSN/SESSION_KNOWN_ISSUES.md`

```markdown
## Session 63 Known Issues

- [ ] Audio player on Firefox (needs testing next session)
- [x] Dark mode on Safari iOS (fixed in commit abc123)
- [ ] Timeline view pagination (half-done, continue next session)

[Format: checkbox, description, resolution status]
```

If issues found:
- Document with steps to reproduce
- Mark as resolved or "next session"
- If critical: fix before considering session done

✅ **PASS:** All known issues documented

---

## PHASE 7: BACKUPS VERIFICATION (3 min)

### Check Backups Contain Latest Commit

```bash
# Verify B2 backup
# (Check manually or via backup script)

# Verify rsync backup
# ls -lh /Volumes/[external-drive]/JFSN/Documents/JFSN/
# Should show today's timestamp

# Verify git commits are backed up
git log --oneline -1  # Get latest commit hash
# Verify that hash is in backup
```

✅ **PASS:** Backups contain latest commits (not just stamps)

---

## PHASE 8: SESSION SUMMARY (2 min)

### Quick Recap
Document in session end notes:

```markdown
## Session 63 Summary

**Date:** 2026-06-18  
**Duration:** ~8 hours continuous

**Work:**
- 150+ UX/UI improvements
- Visual design system overhaul
- 5 major commits
- 2,450+ CSS + 1,080+ JS lines

**Shipped:**
- 21 major features
- 12 design areas refined
- All tested and verified
- All deployed to production

**Cache Version:** jfsn-20260618014522

**Known Issues:** [See SESSION_KNOWN_ISSUES.md]

**Next Session Should:**
1. Continue with [specific feature]
2. Address [known issue]
3. Consider [future improvement]
```

✅ **PASS:** Session summarized, next session guidance clear

---

## PHASE 9: FINAL CHECKLIST

```bash
# Run this final verification:

echo "=== GIT ==="
git status                              # Clean?
git log --oneline -3                    # Latest commits visible?

echo "=== PRODUCTION ==="
curl -I https://jfsn.com/              # Live?
grep CACHE_V /Users/jeffreyneumann/Documents/JFSN/sw.js  # Bumped?

echo "=== MEMORY ==="
ls -lh /Users/jeffreyneumann/.claude/projects/-Users-jeffreyneumann/memory/session*final*  # Latest summary exists?

echo "=== BACKUPS ==="
git log --oneline -1                   # Get latest commit hash
echo "Verify backup contains: $(git log --oneline -1 --format=%H)"

echo "=== READY? ==="
echo "✅ All phases complete"
echo "Safe to end session"
```

---

## ✅ SESSION END COMPLETE

**When all 9 phases pass:**
- ✅ Code verified (git clean, CSS built, cache bumped)
- ✅ Deployment verified (live, visually OK)
- ✅ Performance tracked (baseline captured)
- ✅ Features verified (all work, none broken)
- ✅ Memory documented (3 files created, index updated)
- ✅ Known issues logged (documented with status)
- ✅ Backups verified (contain latest commits)
- ✅ Session summarized (next steps clear)
- ✅ Final checklist passed (everything green)

**Session is officially complete. Safe to close.**

---

## QUICK REFERENCE CHECKLIST

```
SESSION END CHECKLIST (30 min)

PHASE 1: Code Verification (5 min)
- [ ] git status clean
- [ ] npm run build:css passed
- [ ] CACHE_V bumped in sw.js

PHASE 2: Deployment Verification (5 min)
- [ ] curl -I https://jfsn.com/ → 200
- [ ] site.min.css served
- [ ] Visual spot-check (light, dark, mobile)

PHASE 3: Performance Baseline (5 min)
- [ ] Lighthouse: homepage desktop/mobile
- [ ] Lighthouse: archive desktop/mobile
- [ ] Recorded in PERF_BASELINE.md

PHASE 4: Feature Verification (5 min)
- [ ] All new features work
- [ ] Previous features not broken
- [ ] SESSION_FEATURE_CHECKLIST.md complete

PHASE 5: Memory Documentation (5-10 min)
- [ ] session[N]_features.md created (if features)
- [ ] session[N]_visual.md created (if visual changes)
- [ ] session[N]_final_summary.md created
- [ ] MEMORY.md index updated

PHASE 6: Known Issues Log (2 min)
- [ ] SESSION_KNOWN_ISSUES.md updated
- [ ] All issues documented with status

PHASE 7: Backups Verification (3 min)
- [ ] B2 backup contains latest commit
- [ ] rsync backup has today's timestamp
- [ ] git history backed up

PHASE 8: Session Summary (2 min)
- [ ] Work summarized
- [ ] Next session guidance clear

PHASE 9: Final Checklist (2 min)
- [ ] All verifications passed
- [ ] Ready to end session

✅ SESSION COMPLETE — Safe to close
```

---

## NEXT SESSION STARTUP

When you start next session, use:
- `cat /Users/jeffreyneumann/.claude/projects/-Users-jeffreyneumann/memory/MEMORY.md`
- Read the **FINAL SUMMARY** (first in list)
- Then follow `/Documents/JFSN/SESSION_START_PROCEDURES.md` (when created)

---

**Last Updated:** 2026-06-18  
**Status:** Active SOP for Session 63+  
**Estimated Duration:** 20-30 minutes per session
