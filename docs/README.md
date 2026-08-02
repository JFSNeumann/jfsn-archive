# Documentation

The JFSN Archive documentation is organized into four categories, each with a single rule:

- **[governance/](governance/)** — Mission, constitution, succession. Slow-changing.
- **[current/](current/)** — Actively maintained: procedures, workflow, design system, architecture decisions, recovery plans, checklists, intake docs. **Kept accurate.**
- **[archive/2026/](archive/2026/)** — Historical session records, audits, and closed decisions, dated 2026 (the repository's full history to date). **Never edited after landing.**
- **[sources/](sources/)** — Primary source material: `curatorial/`, `oral-history/`, `working-history/`. **Only ever added to, never revised.**

**[server-artifacts/](server-artifacts/)** holds one machine-generated JSON file. It's an out-of-scope, temporary location — not part of the four-category model above — pending relocation outside `docs/` in a future session.

## Quick Navigation

**Starting a session?** → [current/SESSION_START_PROCEDURES.md](current/SESSION_START_PROCEDURES.md)

**Need to deploy?** → [current/DEPLOY.md](current/DEPLOY.md)

**Reference the architecture?** → [current/ARCHITECTURE-DECISIONS.md](current/ARCHITECTURE-DECISIONS.md)

**Understanding the mission?** → [governance/JFSN-MISSION.md](governance/JFSN-MISSION.md)

**Touching catalog metadata (title, year, themes, description, etc.)?** → [governance/METADATA-STEWARDSHIP-CONSTITUTION.md](governance/METADATA-STEWARDSHIP-CONSTITUTION.md) — governs what AI may and may never do with archive metadata; was undiscoverable from here until 2026-07-19

**Recovery procedures?** → [current/DISASTER-RECOVERY-CHECKLIST.md](current/DISASTER-RECOVERY-CHECKLIST.md)

**Wondering what most needs doing?** → [current/ARCHIVAL-REVIEW-2026-08-01.md](current/ARCHIVAL-REVIEW-2026-08-01.md) — full-archive review with an open, ranked checklist. Top finding: the ~424MB full-resolution master set is the only unrecoverable asset here and currently has no independent custody. (Written under a hypothetical premise, stated and explained at the top of the file — the premise is not a real event.)

**Fixing something broken, or proposing something new?** These require different authority. A defect (crash, missing state, broken transition) is fixed directly — see [current/IMPLEMENTATION-VERIFICATION-STANDARD.md](current/IMPLEMENTATION-VERIFICATION-STANDARD.md) for how to verify and report it. A new interaction or design concept needs Jeff's direction, not self-authorization — see [governance/DESIGN-REOPENED.md](governance/DESIGN-REOPENED.md) (current) and [governance/STEWARDSHIP-DECLARATION.md](governance/STEWARDSHIP-DECLARATION.md) (historical record, 2026-07-08–2026-07-21) for the history of what's been required.
