# JFSN Archive

Source repository for a static, personal art archive: image ingestion, AI-assisted cataloging, static site generation, deployment tooling, and project documentation, all in one place. The site itself is live at [jfsn.com](https://jfsn.com); this repository is everything that builds and maintains it.

> **Governing document:** [`docs/governance/CONSTITUTION.md`](docs/governance/CONSTITUTION.md) is this project's highest authority — read it before any significant decision. [`docs/governance/JFSN-MISSION.md`](docs/governance/JFSN-MISSION.md) explains why the archive exists.
>
> **If Jeff is unavailable:** start at [`docs/governance/SUCCESSION.md`](docs/governance/SUCCESSION.md) — the continuity plan for backups, hosting, and domain access.

## What this is

A personal record of Jeffrey F. S. Neumann's work — not a gallery, shop, or brand — built and maintained as an open-source, forkable template ([github.com/JFSNeumann/jfsn-archive](https://github.com/JFSNeumann/jfsn-archive), MIT-licensed; see `scripts/init.sh`) that any artist could adapt for their own archive. The philosophy and non-negotiable principles behind it live in the governance documents above, not here.

## Repository layout

| Path | Contents |
|------|----------|
| `*.html` | The site itself — 14 core pages, each self-contained (own inline `<style>`/`<script>`, no shared stylesheet or nav partial — see `docs/current/DESIGN-SYSTEM.md` § "Architecture") |
| `_shared/` | Confirmed dead code as of 2026-07-19 — zero pages reference any file in it. Not cleaned up yet; don't assume editing it has any live effect |
| `artworks/` | Image assets plus the ingestion and AI-cataloging pipeline |
| `config/` | Generated data (catalog, sitemap inputs, etc.) consumed by the site — not hand-edited |
| `tools/` | Python utilities: page generators, intake workflow, verification |
| `scripts/` | Shell tooling: deploy, backup, session start/end |
| `docs/` | All project documentation — see [`docs/README.md`](docs/README.md) for the full map |

## Documentation

- **[`CLAUDE.md`](CLAUDE.md)** — working guide for AI coding sessions on this repo.
- **[`docs/README.md`](docs/README.md)** — documentation index (`governance/`, `current/`, `archive/2026/`, `sources/`).
- **[`docs/current/WORKFLOW.md`](docs/current/WORKFLOW.md)** — artwork ingestion and cataloging pipeline.
- **[`docs/current/DEPLOY.md`](docs/current/DEPLOY.md)** — deployment procedure.
- **[`IMPROVEMENTS.md`](IMPROVEMENTS.md)** — living backlog, read at the start of every work session.

## Getting started

```bash
npm install
npm run build:css   # compile Tailwind -> site.min.css
```

Everything else — ingesting new work, deploying, and ending a session — is procedural and documented in `docs/current/`; this repo doesn't duplicate those steps here.

## License

Code: MIT. Metadata: CC BY 4.0. Artwork images belong to the artist and are not licensed for reuse.
