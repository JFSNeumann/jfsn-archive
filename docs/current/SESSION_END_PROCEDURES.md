# SESSION END PROCEDURES

**Purpose:** Checklist to close out a session safely and hand off to the next one.

**Typical Duration:** 5–10 minutes for a normal stewardship session (cataloging, small fixes,
copy edits). Longer only if the session shipped a design/feature change — see the note at
the end of Phase 1.

**Status:** Rewritten 2026-07-17. The prior version (Session 63 era) described a 9-phase,
20–30 minute ritual — mandatory Lighthouse baselines, 3 memory files, and checklist files
(`PERF_BASELINE.md`, `SESSION_FEATURE_CHECKLIST.md`, `SESSION_KNOWN_ISSUES.md`) — none of
which exist in the repo anymore and none of which match how sessions have actually run
since the migration project closed (2026-07-09). This version reflects current practice.

---

## PHASE 1: COMMIT, PUSH, BACKUP

Use the script — it already does this correctly (commit with `Co-Authored-By`, push to
`origin/main`, cold backup via `backup.sh` → JEFFS-4TB with file-count verification):

```bash
bash scripts/session-end.sh
```

`session-end.sh` does **not** deploy the live site — that's a separate, deliberate step
(Phase 2). Don't assume a push means jfsn.com changed.

If the session made a **design or visual change**, don't let the script's auto-commit
message stand in for a real one — commit that work yourself with a message that describes
the change, before running `session-end.sh` (or let it fold in as "nothing new to commit").

---

## PHASE 2: DEPLOY (only if the session changed anything the live site serves)

```bash
bash scripts/deploy-hostgator.sh
```

This uploads, then runs its own smoke test (10 checks against jfsn.com) and reports
pass/fail. Read the output — don't assume "DEPLOYMENT SUCCESSFUL" means the smoke tests
passed too; they're reported separately below that banner. If a smoke check fails, verify
directly against the live site (`curl`) before deciding whether it's a real regression or a
stale/flaky check — this repo has a history of both.

**Skip this phase entirely** for changes that don't touch anything jfsn.com serves (docs-only
edits, script/tooling changes, memory updates).

---

## PHASE 3: SANITY-CHECK THE LIVE SITE (only if you deployed)

```bash
curl -I https://jfsn.com/                              # 200?
curl -s https://jfsn.com/ | grep -o site.min.css        # CSS served?
curl -s https://jfsn.com/sw.js | grep CACHE_V           # cache version bumped, if CSS/JS changed?
```

For a visual/design change, actually load the page in a browser (light + dark, mobile
width) rather than trusting curl alone — see `feedback_mandatory_visual_verification_gate`
in memory.

---

## PHASE 4: BACKUP LAUNCHAGENTS CHECK

Both backup LaunchAgents have gone silently unloaded from launchd twice before (see
`project_backup_automation_broken` in memory — recurring gotcha, most recently 2026-07-16).
Check every session, not just when something feels off:

```bash
launchctl list | grep jfsn
```

Two entries expected. If either is missing, reload it and flag it — don't assume it'll
self-heal.

---

## PHASE 5: MEMORY UPDATE

Not a fixed template of "3 files" — write what's actually worth keeping for a future
session, per the memory-system rules in this environment (user/feedback/project/reference
types). In practice, most stewardship sessions need:

- One **project** memory entry if something shipped, was decided, or a fact changed
  (commit hash, what/why, current state) — update `MEMORY.md`'s index line for it.
- A **feedback** memory only if Jeff corrected or confirmed an approach worth remembering
  next time.
- Nothing else. Don't manufacture a "visual design" or "feature" memory file if the session
  didn't do either.

---

## PHASE 6: DOCUMENTATION REVIEW

**If this session shipped operational/procedural changes, update the corresponding docs/current/ file now.**

Operational changes include:
- Backup/deploy processes → update `DEPLOY.md` + `SESSION_START_PROCEDURES.md`
- Archive features or workflows → update `IMPROVEMENTS.md` + any feature docs
- Content management procedures → update `WORKFLOW.md`
- Catalog or metadata systems → update relevant governance file

For any file you touch:
- Update the `Last Updated` date to today (YYYY-MM-DD format)
- Add a brief note of what changed (e.g., "Added backup-health-check.sh step, 2026-07-19")

**Why:** Stale docs create confusion and false confidence. If a procedure changed, the doc that describes it must change too, in the same session. This is not optional cleanup — it's operational integrity.

---

## PHASE 7: LIVING BACKLOG

If the session closed out or surfaced a backlog item, update `IMPROVEMENTS.md` directly —
add to `✅ Completed` with commit hashes, or add/adjust an open item. This is the source of
truth Jeff reads at the start of each session; don't let it drift from what actually
happened (see `git log` for the record if unsure what shipped).

---

## PHASE 8: FINAL CHECK

```bash
echo "=== GIT ===" && git status --short && git log --oneline -3
echo "=== BACKUP LAUNCHAGENTS ===" && launchctl list | grep jfsn
```

Clean tree, latest commit visible, both LaunchAgents present. That's session-end for a
normal stewardship session.

---

## NEXT SESSION STARTUP

- `cat /Users/jeffreyneumann/.claude/projects/-Users-jeffreyneumann/memory/MEMORY.md`
- Read `IMPROVEMENTS.md` for the open backlog
- Follow `docs/current/SESSION_START_PROCEDURES.md`

---

**Last Updated:** 2026-07-22
**Status:** Active SOP, reflects post-migration stewardship-mode sessions
