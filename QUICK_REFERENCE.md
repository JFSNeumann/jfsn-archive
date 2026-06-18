# QUICK REFERENCE — jfsn.com Sessions

**For Claude Code: Quick lookup of essential files, workflows, and status.**

---

## 🚀 SESSION STARTUP (15 min)

```bash
# 1. Read context
cat ~/.claude/projects/-Users-jeffreyneumann/memory/session63_complete.md

# 2. Verify production
curl -I https://jfsn.com/
grep CACHE_V /Users/jeffreyneumann/Documents/JFSN/sw.js

# 3. Check baselines
cat /Documents/JFSN/PERF_BASELINE.md

# 4. Ask Jeff: "What should we work on?"
```

---

## 🏗️ BUILDING (During Session)

### CSS (All visual changes)
```bash
# File: /Users/jeffreyneumann/Documents/JFSN/_shared/ui.css
# - Typography, colors, spacing, animations
# - Add your CSS at the end, before closing }
# - Rebuild: npm run build:css

# Common patterns:
# @keyframes name { ... }    # Animation definitions
# .class { ... }             # Component styling
# @media (max-width: 768px)  # Mobile adjustments
```

### JavaScript (All interactions)
```bash
# File: /Users/jeffreyneumann/Documents/JFSN/_shared/micro-interactions.js
# - Event listeners, DOM manipulation, state management
# - Add your functions before the initialization section
# - No rebuild needed (separate from CSS)

# Common patterns:
# function setupFeature() { ... }
# document.addEventListener('click', ...)
# localStorage.setItem/getItem(key, value)
```

### After Any CSS Change
```bash
npm run build:css          # Rebuild site.min.css
git add site.min.css       # Stage the output
# (Don't manually edit site.min.css)
```

---

## ✅ VERIFICATION (Before Deploy)

### Visual Check
```bash
bash /Documents/JFSN/preview-verify.sh
# Opens preview server, walks through visual checklist
# Verifies: typography, spacing, dark mode, mobile, hover states
```

### Feature Check
```bash
# Use: /Documents/JFSN/SESSION_64_CHECKLIST.md (or current session)
# Test each feature on iPhone 15 Pro + desktop
# Mark as pass/fail in checklist
```

### Performance Check
```bash
# Baseline before session: cat /Documents/JFSN/PERF_BASELINE.md
# After work: Re-run Lighthouse for homepage, archive, mobile
# Compare metrics (>10% LCP increase = investigate)
```

---

## 📤 DEPLOYING

```bash
# 1. Commit your changes
git add _shared/ui.css _shared/micro-interactions.js site.min.css
git commit -m "Brief description of what you built"

# 2. Push to GitHub
git push origin main

# 3. Update cache version (automatic via pre-commit hook)
# Verify: grep CACHE_V sw.js
# Should show new timestamp

# 4. Deploy to production
bash deploy.sh  # FTP upload to jfsn.com

# 5. Verify live
curl -I https://jfsn.com/
# Should show 200 and latest CACHE_V in sw.js
```

---

## 📝 SESSION CLOSEOUT (30 min)

Follow: `/Documents/JFSN/SESSION_END_PROCEDURES.md`

Quick checklist:
```
✅ Code verified (git clean, css built, cache bumped)
✅ Deployment verified (site live, visuals OK)
✅ Performance tracked (baseline captured)
✅ Features verified (all work, SESSION_XX_CHECKLIST.md complete)
✅ Memory documented (3 files created, MEMORY.md updated)
✅ Known issues logged (SESSION_KNOWN_ISSUES.md updated)
✅ Backups verified (latest commits backed up)
✅ Session summarized (next steps clear)
```

---

## 📁 KEY FILES AT A GLANCE

| File | Purpose | Edit? | Location |
|------|---------|-------|----------|
| `_shared/ui.css` | All styling | ✏️ YES | /Documents/JFSN/ |
| `_shared/micro-interactions.js` | All JavaScript | ✏️ YES | /Documents/JFSN/ |
| `site.min.css` | Compiled output | ❌ NO (rebuild) | /Documents/JFSN/ |
| `sw.js` | Service worker | ⚠️ Only CACHE_V | /Documents/JFSN/ |
| `CLAUDE.md` | Design constraints | 📖 READ ONLY | /Documents/JFSN/ |
| `PERF_BASELINE.md` | Performance tracking | 📝 APPEND | /Documents/JFSN/ |
| `SESSION_XX_CHECKLIST.md` | Feature verification | ✏️ YES | /Documents/JFSN/ |

---

## 🎨 DESIGN TOKENS (Copy/Paste Ready)

### Colors
```css
--color-bg: #faf8f5;              /* Warm cream */
--color-text: #0B0B0B;            /* Deep ink */
--color-text-secondary: #575757;  /* Gray */
--color-accent: #FF6600;          /* Orange */
--color-border-warm: #8e7164;     /* Archival brown */
--color-border-soft: #e3bfb1;     /* Soft brown */
--color-divider: #ebe8e2;         /* Light divider */
```

### Shadows
```css
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.04);
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.1);
--shadow-gallery: 0 0 40px rgba(0, 0, 0, 0.08);
```

### Typography
```css
--text-display-xl: clamp(2.8rem, 6vw, 3.5rem);
--text-heading-lg: 1.5rem;
--text-body-lg: 1.125rem;
--text-body: 1rem;
--text-caption: 0.8125rem;
--line-comfortable: 1.6;
--line-tight: 1.25;
--tracking-widest: 0.15em;
```

### Spacing
```css
--space-xs: 0.5rem;
--space-sm: 0.75rem;
--space-md: 1rem;
--space-lg: 1.5rem;
--space-xl: 2rem;
--space-2xl: 3rem;
--space-3xl: 4rem;
```

---

## 🔧 COMMON COMMANDS

```bash
# CSS
npm run build:css           # Rebuild after ui.css changes

# Git
git status                  # Check working tree
git log --oneline -5        # See recent commits
git add [files]             # Stage changes
git commit -m "msg"         # Create commit
git push origin main        # Push to GitHub

# Production
curl -I https://jfsn.com/   # Verify site up
bash deploy.sh              # Deploy to jfsn.com

# Performance
# Open Chrome DevTools → Lighthouse → Run
# Record in /Documents/JFSN/PERF_BASELINE.md

# Features
cat /Documents/JFSN/SESSION_XX_CHECKLIST.md  # Use to verify
```

---

## 🚨 EMERGENCY REFERENCE

**If something breaks:**
1. Check git status: `git status`
2. Review recent commits: `git log --oneline -5`
3. Check production: `curl -I https://jfsn.com/`
4. Check cache version: `grep CACHE_V sw.js`
5. Check memory: Read `/memory/session63_complete.md`

**If performance regressed:**
1. Read PERF_BASELINE.md (what's the baseline?)
2. Run Lighthouse (what are current metrics?)
3. Check what changed: `git diff HEAD~1`
4. Likely culprits: unused CSS, blocking JS, large images

**If visual looks wrong:**
1. Run preview-verify.sh (test on device)
2. Check dark mode: Ctrl+Shift+D or ⌘Shift+D
3. Check mobile: Resize to 390px
4. Check hover states: Mouse over images, buttons, cards

---

## 📚 MEMORY HIERARCHY (Read in This Order)

1. **session63_complete.md** — Overview of everything that's done
2. **session63_final_summary.md** — Detailed breakdown of Session 63
3. **session63_visual_design_v2.md** — Design decisions if you're changing visual
4. **session63_phases9to12.md** — Feature details if you're building on audio/interactions
5. **CLAUDE.md** — Constraints and rules (read before starting)

---

## ✨ SUCCESS IN ONE SENTENCE

**Code is working, production is live, tests pass, memory is updated, next session knows what to do.**

---

**Last Updated:** 2026-06-18  
**Status:** Session 63 complete, Session 64 ready  
**Next Update:** After Session 64 completes
