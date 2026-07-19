# JFSN Archive — Claude Code Working Guide

> **Highest governing document:** [`docs/governance/CONSTITUTION.md`](docs/governance/CONSTITUTION.md). When any guidance here conflicts with it, the Constitution governs. This file operates beneath it and does not restate its principles — read it directly.
>
> **Why this archive exists:** [`docs/governance/JFSN-MISSION.md`](docs/governance/JFSN-MISSION.md).
>
> **If Jeff is unavailable:** stop here and read [`docs/governance/SUCCESSION.md`](docs/governance/SUCCESSION.md) first — the entry point for continuity, backups, hosting, and domain matters.
>
> **Before touching any catalog metadata (title, year, themes, series, description, materials, etc.):** read [`docs/governance/METADATA-STEWARDSHIP-CONSTITUTION.md`](docs/governance/METADATA-STEWARDSHIP-CONSTITUTION.md) — the governing framework for what AI may and may never do with archive metadata (§8), burden-of-proof rules for changes (§4), and confidence-level standards (§5). Effective 2026-07-12; found undiscoverable from this file until 2026-07-19 — treat that gap as the bug it was, not evidence the rules were optional.
>
> **The guiding question:** *"Will this help a future grandchild understand Jeff and his life better?"* Test every non-trivial change against it before testing anything else.

This file is operational guidance for AI coding sessions on this repository — conventions, verification standards, and stewardship expectations. For what the repository *is* and how it's laid out, see [`README.md`](README.md). For design system and visual specifics, see [`docs/current/DESIGN-SYSTEM.md`](docs/current/DESIGN-SYSTEM.md).

---

## Repository conventions

- **CSS build:** Tailwind compiles to `site.min.css` via `npm run build:css` — no CDN in production. Any new utility class added to HTML must be rebuilt, or it is silently ignored at runtime with no error.
- **No arbitrary values:** never use `p-[10px]` when a standard scale value exists. Check `tailwind.config.js`'s spacing scale first — arbitrary values force a rebuild and pollute the class list.
- **Service worker cache:** after any CSS/JS rebuild, bump `CACHE_V` in `sw.js` before deploying. Any unique value works as long as it changes; skipping this serves stale assets to visitors with an active service worker for days.
- **Accessibility baseline:** `loading="lazy"` on artwork images, `prefers-reduced-motion` respected in transitions, `aria-current="page"` set on the active nav link (`_shared/nav-active.js`). Preserve these on any page you touch.
- **`favorites.txt` / `featured.txt`:** one art ID per line (`#` = comment), read directly by `artworks/build_catalog.py` to set `favorite`/`featured` flags in the catalog data. `featured.txt` drives the homepage; `favorites.txt`'s flag currently has no dedicated page consuming it — don't assume one exists without checking.

## Verification standards

**Verify by execution, not by reading.** Every high-value bug or stale-fact catch in this project's history came from running a script, `curl`, grep, or a browser check and comparing real output to a claim — never from trusting doc prose or a prior session's note at face value. Treat this file, and your own prior session summaries, the same way: re-verify a specific file, path, or number before relying on it, especially after a repository reorganization. Reorganizations reliably break things that aren't directly in the diff — generated-file paths, sitemap contents, and cross-references have all silently drifted from reality in past sessions without any single commit looking wrong on its own. Before running or trusting the output of a publishing/generation script (anything under `artworks/` or `tools/` that writes site data), confirm its input and output paths still match where the repository actually reads from today — don't assume a script that hasn't been touched is still correct just because it hasn't errored.

**Lighthouse:** don't trust the default (simulated "lantern" throttling) run to judge whether a performance fix worked — it estimates timings from a dependency graph and can be completely insensitive to a real fix. Use `lighthouse <url> --throttling-method=devtools` for real trace-based throttling, and take the median of 3 runs (single runs have shown CPU-contention outliers).

**Decisions: design vs. process.** Design and motion calls on this site are Jeff's to make — he directs them. Code, performance, and process calls are not — make those directly, don't ask. The distinguishing question: would changing this alter what the site *does or looks like* (ask Jeff), or just *how reliably/quickly it does it* (fix it)?

Fixing a demonstrated defect (a crash, a missing state, a broken transition) is process — verify it and fix it directly, no permission needed. Adding a new interaction concept the site doesn't already have (a new motion, a new affordance, a new choreography) is design, and per [`docs/governance/STEWARDSHIP-DECLARATION.md`](docs/governance/STEWARDSHIP-DECLARATION.md) the design phase is closed: it does not reopen on opinion, however well-argued, including a critique Jeff himself asked for. It reopens only on evidence from real visitor observation, or preservation necessity (a format dying, a link breaking). Before implementing a proposed *addition* rather than a *correction*, name which of those two triggers applies — don't infer authorization from having been asked to propose or critique.

## Documentation architecture

`docs/` is organized into four categories, each with one rule — see [`docs/README.md`](docs/README.md) for the full map:

- `governance/` — mission, constitution, succession. Slow-changing.
- `current/` — actively maintained: workflow, deploy, design system, architecture decisions, recovery plans. **Keep accurate as things change.**
- `archive/2026/` — historical session records and closed decisions. **Never edit after landing** — if something there is wrong, that's a fact about history, not a bug to fix.
- `sources/` — primary source material (oral history, curatorial, working history). **Only ever add to; never revise.**

When you finish work that changes something a `docs/current/` file describes, update that file in the same session — it's the one tier with an accuracy obligation.

## Session workflow

Start and end procedures, the artwork ingestion/cataloging pipeline, and the deploy checklist are documented in `docs/current/` (`SESSION_START_PROCEDURES.md`, `SESSION_END_PROCEDURES.md`, `WORKFLOW.md`, `DEPLOY.md`) — read them there rather than expecting a duplicate copy here. `IMPROVEMENTS.md` is the living backlog; check it at the start of a session and cross items off when shipped.
