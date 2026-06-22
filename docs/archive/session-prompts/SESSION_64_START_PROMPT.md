# SESSION 64 START PROMPT

**Copy this entire prompt at the start of Session 64 and paste into Claude Code.**

---

## Context & Status

Session 63 shipped 150+ UX/UI improvements + visual design system overhaul + workflow procedures. All work is live on jfsn.com (cache version jfsn-20260618014522). Everything verified working.

Current state:
- Homepage LCP: 3.5s, Performance: 95
- Archive: Responsive, all features working
- Artwork pages: Museum aesthetic, audio ready
- Mobile: Touch-friendly, 44px targets
- Dark mode: Intentional aesthetic (not inverted)
- 24 major features verified ✅

**Memory files to read first:**
1. `/Users/jeffreyneumann/.claude/projects/-Users-jeffreyneumann/memory/session63_complete.md` (comprehensive overview)
2. `/Users/jeffreyneumann/.claude/projects/-Users-jeffreyneumann/memory/session63_final_summary.md` (detailed breakdown)

**Key workflow files:**
- `/Documents/JFSN/PERF_BASELINE.md` — Performance baselines (LCP 3.5s, Perf 95)
- `/Documents/JFSN/SESSION_START_PROCEDURES.md` — 7-phase startup checklist
- `/Documents/JFSN/SESSION_END_PROCEDURES.md` — End-of-session procedures
- `/Documents/JFSN/SESSION_FEATURE_CHECKLIST.md` — Feature verification template

---

## Your Role

You are helping Jeff improve jfsn.com — a personal archive of 1,084 artworks spanning 50 years (collage, sculpture, photography). The site is now a gallery-like experience with 150+ UX/UI improvements and a refined visual design system.

**Core principle:** Archive first — every decision serves the work, not the designer. "Just enjoy" — Jeff wants people to enjoy the archive. Making is the point.

**Design is open:** All visual design constraints removed. Use judgment. If it serves the work, ship it. Only non-negotiable rule: data integrity (no fabricated provenance, badges, or composites-as-real).

---

## Session 64 Goals (Suggested)

Based on Session 63 work, here are high-value next opportunities:

### 🔴 HIGH PRIORITY (Preservation-focused)
1. **Audio recordings on artwork pages** — Use the audio player built in Session 63. Add 1-minute Jeff recordings on 10-20 core works. He talks about why he made it, materials, story. Starts small, scalable.
2. **Lost works recovery** — 500-1K works lost to water damage. Make this prominent: homepage section, dedicated page, recovery initiative framing. This is the *story*.
3. **Hand-written metadata** — Choose 20-30 personally significant works. Add Jeff's actual words (quotes, memories, context). Replace machine-generated descriptions.

### 🟡 MEDIUM PRIORITY (Technical)
4. **Performance audit** — LCP is 3.5s, stable. Can we get under 3s? Critical CSS inlining? Image optimization? Measure before/after with PERF_BASELINE.md.
5. **Family context** — Add section for family/personal narrative. 2-3 paragraphs, photos, stories. Lean into preservation mission.

### 🟢 LOW PRIORITY (Polish)
6. **Variable grid masonry** — Partially prepared. Feature some works larger for visual interest.
7. **Advanced metadata visualization** — Canvas color analysis. Timeline by decade with work counts.

---

## Before You Start: Checklist

Run this verification before picking what to work on:

```bash
# 1. Memory review
echo "=== READING SESSION 63 SUMMARY ==="
head -100 ~/.claude/projects/-Users-jeffreyneumann/memory/session63_complete.md

# 2. Live state
echo "=== VERIFYING PRODUCTION ==="
curl -I https://jfsn.com/              # Should return 200
grep CACHE_V /Users/jeffreyneumann/Documents/JFSN/sw.js  # Latest version

# 3. Git state
echo "=== GIT STATUS ==="
cd /Users/jeffreyneumann/Documents/JFSN && git status  # Should be clean
git log --oneline -3                    # Latest commits

# 4. Performance baseline
echo "=== PERFORMANCE BASELINE ==="
cat /Documents/JFSN/PERF_BASELINE.md    # Review previous metrics

# 5. Feature checklist ready
echo "=== FEATURE CHECKLIST READY ==="
cp /Documents/JFSN/SESSION_FEATURE_CHECKLIST.md /Documents/JFSN/SESSION_64_CHECKLIST.md
echo "✅ Ready: SESSION_64_CHECKLIST.md"
```

---

## What To Ask Jeff

**After reviewing memory, ask:**

1. **"What should we focus on this session?"** — Preservation (lost works, audio, metadata)? Performance? Polish? Family context?

2. **"Audio recordings — ready to go?"** — We have the player built. Does Jeff have recordings ready? Or should we prep the UI and integrate them later?

3. **"Lost works — what's the strategy?"** — Homepage section? Dedicated page? Recovery narrative? Just documentation?

4. **"Timeline — do we know the story?"** — What makes certain works personally significant? That becomes the guide for hand-written metadata.

---

## Workflow for This Session

1. **Define scope** — Ask above questions, narrow to 1-2 focus areas
2. **Performance baseline** — Capture Lighthouse metrics at session start (use PERF_BASELINE.md)
3. **Build & test** — Follow established patterns (CSS in ui.css, JS in micro-interactions.js)
4. **Visual verification** — Before deploy, run `bash preview-verify.sh` to verify changes look good
5. **Feature checklist** — Use SESSION_64_CHECKLIST.md to verify all features work before shipping
6. **End procedures** — Follow SESSION_END_PROCEDURES.md (9 phases, ~30 min)

---

## Key Files to Know

| File | Purpose | When to Use |
|------|---------|-----------|
| `_shared/ui.css` | All styling (6,826 lines, add here) | Every visual change |
| `_shared/micro-interactions.js` | All JavaScript (1,900 lines, add here) | Every interaction |
| `/Documents/JFSN/CLAUDE.md` | Design constraints & rules | Before starting work |
| `/Documents/JFSN/PERF_BASELINE.md` | Performance tracking | Session start/end |
| `/Documents/JFSN/SESSION_64_CHECKLIST.md` | Feature verification | Before deployment |
| `/Documents/JFSN/preview-verify.sh` | Visual verification | Before deployment |
| `sw.js` | Service worker (update CACHE_V after CSS changes) | After every deploy |

---

## Build Pattern (Proven in Session 63)

1. **Design foundation** — Add CSS variables, color system, typography scale (ui.css)
2. **Build features** — Add JavaScript functions (micro-interactions.js)
3. **Rebuild & verify** — `npm run build:css`, test locally
4. **Commit atomically** — One feature per commit with clear message
5. **Deploy** — `git push` + `bash deploy.sh`
6. **Verify production** — Visual check, cache version verified
7. **Document** — Memory files created, next steps clear

---

## On Data Integrity (NON-NEGOTIABLE)

**Never ship:**
- Fabricated provenance or accession numbers
- Invented badges or DPI/resolution claims
- Fake exhibition references or composite images as real
- Made-up quotes or attributions

**Always preserve:**
- Actual years as decade estimates (e.g., "1990s (est.)")
- Composite images flagged as "Photoshop composite — imagined placement"
- Creator's actual voice when available
- Honest acknowledgment of what's lost/unknown

---

## Success Criteria

Session 64 is successful when:

✅ **Work is meaningful** — Serves the archive's preservation mission, not designer ego  
✅ **Changes are visible** — User experience improves (faster, clearer, more intentional)  
✅ **Quality is verified** — All features tested, performance tracked, visuals approved  
✅ **Code is clean** — Atomic commits, pre-commit audits pass, CSS rebuilt  
✅ **Production is stable** — jfsn.com live, cache invalidated, zero regressions  
✅ **Memory is updated** — Session docs created, next session guidance clear  

---

## Session 64 Ready

You have:
- ✅ Full context from Session 63
- ✅ Performance baselines to track
- ✅ Feature checklist template
- ✅ Visual verification script
- ✅ Start/end procedures
- ✅ Build patterns proven
- ✅ Memory system established

**You are ready to start building.**

---

## Call to Action

**Ask Jeff:** "What should we focus on this session?"

**Once you know:**
1. Create SESSION_64_CHECKLIST.md (copy the template)
2. Capture performance baseline (Lighthouse)
3. Start building

---

**Session 64: Ready to Begin** 🚀
