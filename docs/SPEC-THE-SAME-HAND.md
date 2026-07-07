# Production Specification — *The Same Hand*

*The build specification for the archive's canonical interaction.*
*Translates the approved philosophy (docs/DESIGN-STUDY-THE-SAME-HAND.md, Experience Studio Phase V) into implementable behavior. The philosophy is not revisited here; where this spec and the philosophy differ, the philosophy governs, and where either and CONSTITUTION.md differ, the Constitution governs.*
*Written 2026-07-07. Values are defaults chosen to realize the philosophy; those marked TUNABLE may be adjusted by a custodian without changing the idea.*

---

## 0. Purpose and scope

This document lets a designer who has never spoken to us build *The Same Hand* exactly as intended. It specifies observable behavior, values, and states — not code — so that it survives framework and platform change. Every rule traces to a clause of the philosophy; the trace is named in parentheses.

*The Same Hand* is a quiet, earned margin presence on the **artwork page** that confirms, at the moment a visitor returns to a shape Jeff returned to, that the work before them is one instance of a fifty-year recurrence — and lets them follow that single shape through the decades.

It is **not** a recommendation engine, a filter, a gallery mode, or a named feature. It has no home in any menu. (Phil. §1, §8 "too feature-like.")

---

## 1. Data model and canonical definitions

**1.1 Source data.** All inputs already exist in `catalog.json` (fetched by the artwork page today). Per-work fields used: `file`, `title`, `year`, `year_display`, `year_precision`, `motifs[]`, `themes[]`, `series`. No new dataset is required.

**1.2 The recognized-motif set (CURATED, SMALL, VERSION-CONTROLLED).** *The Same Hand* recognizes only a short, curated list of the shapes Jeff genuinely returned to — never raw tags. (Phil. §3 "small, curated, true set.") Each entry is a static config record:

| id | Display noun | Catalog query (a work belongs if…) | Gathering page (no-JS floor) | Instances |
|----|--------------|-------------------------------------|------------------------------|-----------|
| `targets` | target | `themes` contains "Targets" | `targets.html` | 403 |
| `crosses` | cross | `themes` contains "Crosses" | `crosses.html` | 69 |
| `snowmann` | Mr. Snowmann | `themes` contains "Mr. Snowmann" | `mr-snowmann.html` | 72 |
| `guernica` | Guernica | `series` == "Guernica" | `guernica.html` | 232 |
| `warplane` | warplane | `motifs` contains "warplane-topdown" or "warplane-side" | *(requires a gathering page before activation — see 10.4)* | ~238 |

**Curation constraints (enforced, not stylistic):**
- **No near-ubiquitous motif.** A shape present in a large fraction of the archive is a constant, not a return; including it would make the presence fire constantly (Phil. §8 "too frequent"). Concretely: exclude any candidate whose instance count exceeds **35% of the catalog** (TUNABLE). This is why `compact-disc` (597 works, ~55%) and `concentric-rings` (580) are **excluded** by default despite appearing in the philosophy's illustrative list — they are materials/constants, not distinctive returns. A custodian may reinstate one only with a curatorial rationale recorded in this table.
- **No entry without a gathering page.** A motif may not be activated in the set until a no-JS gathering page exists for it (see §9). `warplane` is specified but **inactive** until its page exists.
- **Changing the set is a curatorial act,** logged in this table with a date and reason (Phil. §9 stewardship; Constitution §X).

**1.3 The ordinal N — a deterministic fact, not a visitor tally.** For a work *w* belonging to motif *M*, **N** is the 1-indexed chronological rank of *w* among all works of *M*, ordered by `year` ascending, then by stable catalog order for ties. N is a fixed property of (*w*, *M*): identical on every visit, every device, every visitor. It means *"the Nth of this shape he made, as the record best orders them"* — never "the Nth you have seen." (Phil. §2 "the forty-seventh time he made this"; Constitution §IX honesty.)

Because years are decade estimates (`year_display` = "1990s (est.)"), N is **decade-accurate, not finer.** This limit is disclosed, never hidden (see §3.4). (Constitution §IX.)

**1.4 The visit ledger.** A session-scoped set of recognized-motif ids the visitor has *attended* this visit. Storage: `sessionStorage`, key `jfsn:same-hand:attended`, value a JSON array of ids. It clears when the tab closes (a visit, not a history). If `sessionStorage` is unavailable, the ledger is empty for the visit and the presence simply never triggers across pages — never an error. (Phil. §7 "loses no meaning when simplified.")

**1.5 "Attended" (the return signal).** On an artwork page whose work belongs to motif *M*, the visitor is recorded as having attended *M* when **all** hold: the work's primary image has been at least 50% in the viewport; the tab has been focused; and **8 seconds** (TUNABLE) of continuous on-page time have elapsed. At that instant, add *M* to the ledger. This operationalizes "opened an earlier work of that shape, and stayed rather than bounced." (Phil. §3.)

---

## 2. Trigger logic (when the presence appears)

The presence for motif *M* renders on an artwork page **if and only if** both:
1. the current work belongs to *M* (per the §1.2 query), **and**
2. *M* is already in the visit ledger from a **prior page** this visit (a different work, attended earlier).

That is: the presence appears on the **second or later attended encounter** with a recognized shape — the moment the visitor has, unknowingly, returned. (Phil. §3 "the trigger is *return to the motif*.")

**On the first attended encounter, nothing renders** — there is nothing yet to confirm — but *M* enters the ledger so the next instance will trigger. (Phil. §1 "it confirms; it never announces.")

**Must never trigger on** (each an explicit negative test): the first encounter with a shape; dwell/idle without a prior attended sibling; hover, pointer-rest, or pause; scroll depth, exit intent, or any engagement signal; the homepage, grid, or any non-artwork page; mid-contemplation of the current work (the presence is computed at page load and is simply present when the visitor turns to the margin — it never animates in during looking). (Phil. §3 "what must never trigger it.")

**At most one presence per page.** If a work belongs to more than one recognized motif that qualifies, show the one that entered the ledger **earliest** this visit (the thread the visitor has been on longest). Never render two. (Phil. §8 "never two.")

---

## 3. Visual behavior

**3.1 Form.** One line of text: the ordinal noun phrase. It is a link. Nothing else — no icon, no rule, no swatch, no shape-glyph, no container chrome. (Phil. §2 "type and truth, never decoration"; Constitution §VI square/flat/no-ornament.)

**3.2 Canonical string.**
- N < 100: spelled-out ordinal, e.g. `THE FORTY-SEVENTH TARGET`.
- N ≥ 100: numeral + ordinal suffix, e.g. `THE 214TH GUERNICA` (spelled-out becomes unwieldy; still ordinal, still honest). (Phil. §9 "numeral vs word may evolve," bounded here.)
- Noun is the Display noun from §1.2, uppercased by the caps style, singular.
- The current work's year already appears in the primary metadata; **do not repeat it** in the presence line.

**3.3 Color.**
- At rest: `#575757` (archive-gray). Never orange at rest (persistent orange text fails AA on light ground). 
- Hover/focus: underline draws in and text color moves to `#B84700` (orange-ink, AA-safe). Transient `#FF6600` is permitted only as the animating underline stroke, never as resting text. (Design system; Constitution §VI accessibility.)

**3.4 Honesty disclosure.** The ordinal's decade-level precision is never dressed as exactness. The presence carries no false "#47 of 403" cardinal framing. If a secondary honest note is ever shown (TUNABLE, default **off**), it must read as estimate, e.g. a title/`aria` note "ordered by decade; exact sequence within a decade is not known." (Constitution §IX.)

**3.5 The work is never touched.** No state of this feature may filter, recolor, crop, scale, tilt, overlay, or animate the artwork image. The margin is the only territory. (Constitution §II.1 — hard rail.)

---

## 4. Spatial behavior

**4.1 Desktop (≥768px).** The presence renders inside the existing artwork sidebar `<aside>` (the sticky metadata column), **below** the primary metadata block (title/year/medium) and **immediately above** the "Where this sits — fifty years" mini-river strip. Order enforces *presence before interpretation*: the work and its essential facts come first; the recurrence is a quiet aside beneath them. (Phil. §2; Phase VI §2 first-artwork absv.)

**4.2 Mobile (<768px).** The sidebar stacks below the image and metadata; the presence keeps the same relative order — after metadata, above the mini-river strip, before any related section.

**4.3 Never.** Never a floating, fixed, sticky-to-viewport, modal, popover, toast, or overlay element. Never positioned over the image. Never introduced by a tooltip. It is in-flow margin text with no z-index concerns. (Phil. §2 "it is not navigation"; §8 "too feature-like.")

**4.4 Reserved space (no layout shift).** The presence's line box is reserved in the sidebar layout so that its appearance never reflows the work or the metadata. When absent (§2), the reserved line collapses cleanly with no visible gap. Target Cumulative Layout Shift contribution: **0**. (Success cri, §11.)

---

## 5. Typography

| Property | Value |
|---|---|
| Family | Inter (the archive's UI/label voice — never a third voice) |
| Size | 11px (TUNABLE 10–11px) — one notch above the smallest micro-label, and quieter than the Playfair caption |
| Weight | 500 |
| Letter-spacing | 0.12em |
| Case | UPPERCASE (applied by style; DOM text may be normal case for readers — see §7) |
| Line-height | 1.4 |
| Underline | none at rest; draws in on hover/focus (scaleX origin-left, per house link convention) |

The presence must always be typographically **subordinate to the work's caption** (Playfair title) and never the loudest element in the margin. (Phil. §2 "quieter than the caption.")

---

## 6. Timing and choreography

House motion (from DESIGN-SYSTEM.md §Motion v2): reveal easing `cubic-bezier(0.22,1,0.36,1)`; UI easing `cubic-bezier(0.4,0,0.2,1)`; hover 150–200ms; continuity 450–600ms; load 600–800ms.

**6.1 Appearance.** The presence is in the DOM at page load and rendered as part of the page's **single staged reveal**, synchronized with the metadata settle — **opacity 0→1 over ≤200ms**, no translate, no slide, no separate entrance, never a "pop" after the sidebar. It must feel *already there when the visitor turns to it*. (Phil. §2; §8 "too obvious.") It never animates in during contemplation of the work.

**6.2 Hover/focus.** Underline draw + color to orange-ink over **150ms**, UI easing. (§3.3, §5.)

**6.3 Following (entering/advancing a thread).** Activating the presence, and each advance to the next instance, navigates to that work's page using the site's **continuity transition** (shared-element morph on the artwork image, `view-transition-name` = `artwork-hero`, the existing mechanism) over **450–600ms**. The thread "grows" one instance into the next; it is never a generic fade. (Phil. §4 "accompaniment"; Phase VI §4 "continuity, not fade.")

**6.4 Pace.** Following is unhurried by construction: it is one full page per instance, each work shown whole. There is no autoplay, no timed advance, no slideshow. The visitor sets the tempo. (Phil. §4.)

---

## 7. Interaction states

| State | Condition | Rendering / behavior |
|---|---|---|
| **Absent** | Trigger (§2) not met | Nothing renders; reserved line collapses; ledger may still update per §1.5 |
| **At-rest** | Triggered; thread not active | The ordinal line, grey, no underline; a link that enters thread mode at this work |
| **Hover/Focus** | Pointer over / keyboard focus | Underline draws in; color → orange-ink; 150ms |
| **Active (thread mode)** | Visitor has entered the thread for motif *M* | URL carries `?thread=<id>`; in-margin **← previous / next →** controls scoped to *M*'s chronological instances appear beside the presence; the mini-river strip highlights *M*'s sibling instances (the one sanctioned River intersection); the ordinal updates per instance as the visitor advances |
| **Thread edge** | At the earliest or latest instance of *M* | The far control resolves to an honest terminal line — earliest: "the first of this shape in the record"; latest: "the most recent, so far" — and is non-actionable in that direction; the opposite control still works; the visitor is never dead-ended and may step off at any time |
| **Stepped off** | Visitor navigates anywhere without `?thread` | Thread mode simply ends; nothing to dismiss (the work was always fully shown); no confirmation, no modal |

**7.1 Entering thread mode** never obscures, shrinks, or alters the work. Thread mode only (a) scopes the prev/next affordance to *M* and (b) lights the mini-river. The artwork remains fully, honestly shown in every state. (Constitution §II.1; Phil. §4 "never trapped.")

**7.2 No gamification.** No counter of "threads found," no completion, no badge, no streak, no progress meter, no reward on reaching an edge. The only outcome of following is understanding. (Phil. §8 "too clever/gamified.")

---

## 8. Accessibility

**8.1 Semantics.** The presence is a real link (`<a>`), not a scripted `div`. Its accessible name is a full honest sentence in natural case, e.g. *"The forty-seventh target — follow this shape through the archive."* Screen readers announce a clear statement, not a decorative fragment. (Phil. §7.)

**8.2 Keyboard.** Everything is operable by keyboard alone: the presence is focusable in normal reading order; Enter/Space enters thread mode; the thread prev/next are focusable links/buttons with clear names ("previous target, 1994 estimated" / "next target"). No pointer gesture, hover, or drag is ever required. Focus is visible (`outline: 2px solid #FF6600; outline-offset: 2px`). (Design system focus rule.)

**8.3 Live region.** When the ordinal updates on advancing within a page (if a future build advances without full navigation), the presence is an `aria-live="polite"` region so the change is announced. In the default full-navigation build, the new page's presence is announced on load — no live region needed.

**8.4 Contrast.** Resting `#575757` on bone-white and the `#B84700` hover both meet WCAG AA. `#FF6600` is used only as a transient underline stroke, never as resting text. (Constitution §VI.)

**8.5 Touch.** The return trigger (§1.5) needs no hover. Entering/advancing a thread are taps on real links. Targets ≥44px. Behavior is identical to pointer. (Phil. §7.)

---

## 9. No-JavaScript fallback (the permanent floor)

With JavaScript unavailable, *The Same Hand* degrades to what the archive already provides and **loses no meaning**:

- Every recognized motif's **gathering page** (§1.2: `targets.html`, `crosses.html`, `mr-snowmann.html`, `guernica.html`) is a complete, honest, static listing of every instance of that shape — *The Same Hand* in its plainest permanent form. (Phil. §7 "the theme pages *are* The Same Hand.")
- The artwork page's static markup includes, for each recognized motif the current work belongs to, a plain link to that gathering page (rendered server-side / at build time, present in the HTML with no script). Label: the same ordinal line where N is computable at build time; otherwise the honest noun link, e.g. `MORE OF THIS SHAPE — TARGETS`.
- The scripted experience of §§2–7 is an **enhancement layer** over this floor: earned, quieter, in-context, timed. It adds grace, never meaning. It may never be *more true* than the floor. (Phil. §7, §9.)

**Constraint:** the enhancement must never be the only path to a thread. If script fails to load or errors, the static gathering link remains. (§10.)

---

## 10. Implementation constraints

1. **No new blocking request.** All inputs come from `catalog.json`, already fetched by the artwork page. N and motif membership are computed client-side from that data. If the fetch fails, the presence is absent and the static fallback (§9) stands. Added JS payload budget: **≤ 6KB gzipped** (TUNABLE) beyond existing artwork-page script.
2. **Progressive enhancement, layered.** Static fallback (§9) → ledger + trigger + at-rest presence → thread mode → continuity transition. Each layer must degrade to the one below without error if a capability (sessionStorage, View Transitions API, etc.) is missing.
3. **Curated set is static config,** version-controlled in the §1.2 form; no motif without a gathering page (§1.2, §9). The 35%-ubiquity exclusion (§1.2) is enforced at config time.
4. **`warplane` stays inactive** until a gathering page exists; specifying it does not activate it.
5. **No dependency** on removed or optional effects (custom cursor, film grain) or on any element that filters/moves the work. (Constitution §II.1.)
6. **URL contract.** `?thread=<id>` is the only state carried across navigation; absent or unrecognized, the page renders normally (thread simply inactive). The param is harmless to share/bookmark and must never change what work is shown, only whether the thread scoping/river-highlight is active.
7. **Determinism.** Given the same `catalog.json`, the ordinal N for a (work, motif) pair is identical across builds, devices, and visits (§1.3). Any change to N must come only from a real change to the catalog.
8. **One presence per page** is a hard constraint, not a preference (§2).
9. **Naming.** The strings "The Same Hand" and this feature's internal id must never appear in visitor-facing UI, page source visible copy, menus, tooltips, analytics labels shown to users, or marketing. (Phil. §1, §8.)
10. **Reduced motion** (next section) is a first-class build target, not an afterthought.

---

## 11. Reduced motion

When `prefers-reduced-motion: reduce`:
- The presence **appears with no transition** — it is simply present at load (opacity 1). (It carried no meaning in motion, so nothing is lost.)
- Hover/focus color/underline change is **instant** (no draw).
- Following a thread is an **instant navigation** — no continuity morph, no view-transition animation; the next work simply loads.
- The mini-river highlight in thread mode appears **statically** (no animated sweep).
- Every value elsewhere in this spec that specifies a duration collapses to 0ms under this query.

No state, count, link, or meaning differs between full-motion and reduced-motion. (Phil. §7; Constitution §VI.)

---

## 12. Success criteria (acceptance tests)

A build is correct only if all pass:

1. **Earned, never announced.** A visitor who opens works without meeting the attend threshold (§1.5) never sees the presence. First attended encounter with a shape shows nothing; the second attended instance shows it. (Phil. §1, §3.)
2. **Silent to the inattentive.** A visitor can complete a full visit and never discover it, losing no access to any work. (Phil. §1.)
3. **At most once per page, in the margin only.** Never two presences; never over the work; never a modal/overlay/tooltip. (§2, §4.)
4. **The work is inviolate.** In every state, the artwork image is unfiltered, unmoved, uncropped, full-color. (Constitution §II.1.)
5. **Deterministic ordinal.** The same (work, motif) yields the same N on every device and visit; N changes only if the catalog changes. (§1.3.)
6. **No-JS parity of meaning.** With scripts disabled, every recognized shape remains fully reachable via its gathering page from the artwork page. (§9.)
7. **Reduced-motion parity.** With reduced motion, no count, link, or meaning is lost; only transitions are removed. (§11.)
8. **Keyboard & screen-reader complete.** The presence and thread navigation are fully operable by keyboard and announced as honest sentences. (§8.)
9. **Zero layout shift.** Appearance/absence of the presence contributes 0 to CLS. (§4.4.)
10. **Unnamed.** The feature's name appears nowhere a visitor can see. (§10.9.)
11. **No new blocking network cost;** payload within budget; graceful absence on data failure. (§10.1.)
12. **Honest precision.** No cardinal "#N of total" framing; ordinal reflects decade-level ordering and never implies finer certainty. (§1.3, §3.4; Constitution §IX.)

---

## 13. What a future custodian may and may not change

**May evolve (mechanics):** the 8-second attend threshold; the 35% ubiquity cap; the exact recognized-motif set (with a gathering page and a logged rationale); numeral-vs-word ordinal boundary; the presence's exact size within 10–11px; the transport of thread state (URL param today, whatever is idiomatic later); the rendering technology, data format, and transition API. (Phil. §9 "temporary mechanics.")

**Must not change (this spec's expression of the philosophy):** it confirms and never announces; it is earned by a genuine return; it never demands attention and some visitors never find it; only curated, distinctive, non-ubiquitous shapes are recognized; the work is never touched; at most one presence per page; it degrades to the gathering pages with no loss of meaning; it is never named, never gamified, never an overlay. These are the philosophy, restated as build law; change them and it is no longer *The Same Hand*. (Phil. §9 "enduring philosophy"; Constitution §X.)

---

*Built to this specification, The Same Hand will arrive for its first visitor not as a feature that launched, but as something the archive seems always to have known how to do.*
