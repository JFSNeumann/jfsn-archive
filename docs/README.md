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

**Fixing something broken, or proposing something new?** These require different authority. A defect (crash, missing state, broken transition) is fixed directly — see [current/IMPLEMENTATION-VERIFICATION-STANDARD.md](current/IMPLEMENTATION-VERIFICATION-STANDARD.md) for how to verify and report it. A new interaction or design concept is not self-authorizing — see [governance/STEWARDSHIP-DECLARATION.md](governance/STEWARDSHIP-DECLARATION.md) for what's required before it may be implemented.
