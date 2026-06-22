# Archived design-direction docs — SUPERSEDED

These documents drove an earlier "best-in-class / museum-grade / full-creative-freedom"
direction for jfsn.com. **That direction is superseded** by:

- `JFSN-MISSION.md` — *"Design should serve understanding, not distraction. Simplicity
  should be preferred whenever possible."*
- The **litmus test** and the reconciled **"Design is open — in service of the mission"**
  section at the top of `CLAUDE.md`.

They are kept for reference only. **Do NOT treat them as live design direction.** Several
of the interactions they specify were intentionally removed — see the homepage Selected
Works simplification (2026-06-21), which stripped the ripple / badge / colour-swatch /
magnifier-modal / overlay / brightness / 3D-tilt layer back to *image + always-visible
caption + one link*.

The standard going forward is **high-end restraint**: fewer, better, impeccably executed —
not maximal interaction coverage.

Archived 2026-06-21:

**Design-direction docs** (the "what to build" vision):
- `BEST-IN-CLASS-UX-PROMPT.md`
- `UX-UI-OVERHAUL-PLAN.md`
- `COMPLETE_UX_SUITE.md`
- `SESSION_PROMPT_UNRESTRICTED.md`

**Integration / wiring guides** (how the interaction-suite modules in `_shared/` were
wired up — kept for reference if a module ever needs tracing, but not live direction):
- `PHASE1_INTEGRATION.md`
- `PHASE2_INTEGRATION.md`
- `PHASE3_INTEGRATION.md`
- `PHASE4_INTEGRATION.md`
- `EXTRAS_INTEGRATION.md`

> ⚠️ **Caveat found during the 2026-06-22 documentation audit:** "superseded" above describes
> the *design-direction docs*, not the actual `_shared/*.js` files they once specified. The
> homepage Selected Works simplification (2026-06-21) only touched `index.html`'s featured
> grid. The other ~17 Session-65 interaction scripts these docs describe (`lightbox.js`,
> `parallax.js`, `infinite-scroll.js`, `toast.js`, `scroll-reveal.js`, etc.) are **still
> loaded on all 40 HTML pages** and several directly contradict `CLAUDE.md`'s current
> Don'ts list (skeleton loading, scale/transform on hover, parallax). This is a real,
> unresolved discrepancy between current design philosophy and live code — not something
> this archive folder's framing should be read as having already fixed. See `IMPROVEMENTS.md`.

---

## Subfolders added 2026-06-22 (documentation audit)

- **`session-prompts/`** — 5 numbered session-startup prompts (Sessions 57, 61, 64, 65, 66),
  superseded by the canonical `SESSION_START_PROCEDURES.md` / `SESSION_END_PROCEDURES.md`
  (established Session 63). Kept for historical detail only.
- **`session-checkpoints/`** — 7 point-in-time checkpoints from Sessions 26–50
  (`docs/SESSION-*-CHECKPOINT.md` and related). Accurate records of their moment; not
  living documents.
- **`domain-recovery/`** — 2 documents from the 2026-06-11/12 domain-ownership
  investigation, both self-marked "🟢 CLOSED 2026-06-16" once Jeff produced a Gandi
  invoice proving he owns the account directly (there was never a friend in the loop).
  `docs/DOMAIN-RECOVERY-LOG.md` (the evidence trail) stays active in `docs/` since it's
  the authoritative record of how that was confirmed.
