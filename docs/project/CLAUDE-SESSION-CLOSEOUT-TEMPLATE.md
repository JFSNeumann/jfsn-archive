# JFSN Archive — Claude Code Session Closeout

**Status:** Canonical session closeout template. Update only when repeated
stewardship practice demonstrates a clear improvement.

This is the standard closeout for every JFSN Archive stewardship session. Copy this
template at the end of a session and fill in each section. Do not skip sections —
if a section has nothing to report, say so explicitly rather than omitting it.

**The one rule that governs this whole document:** never present an architectural
judgment, interpretation, or opinion as a verified fact. A fact is something you
checked by running a command, fetching a URL, or reading console/network output.
A decision is something that was chosen and carried out. A recommendation is
something suggested but not done. Keep these three in separate places and never
let one borrow the confidence of another.

---

## 1. Repository Verification (verified by execution)

Report only what was actually run and its actual output.

- `git status`: [paste result]
- Current branch: `[branch name]`
- Current HEAD commit: `[full commit hash]`
- `origin/main` after `git fetch`: `[full commit hash]`
- **HEAD == origin/main:** [confirmed / not confirmed — state which]
- Working tree cleanliness: [clean / dirty — list untracked or modified files if dirty]

---

## 2. Deployment Verification (verified by execution)

Report only verified deployment facts — not assumptions about what "should" have
happened.

- Deployment method used: `[e.g. deploy-hostgator.sh]`
- Deployment completed without error: [yes / no — paste the relevant log lines]
- Evidence the latest commit is live: `[e.g. diff between live URL and local file, or explicit statement that this was not checked]`
- **Limitations:** [state anything not verified this session — e.g. "smoke test not re-run," "no new deploy occurred this session"]

---

## 3. Runtime Verification (verified by execution — directly or by proxy)

Separate what was checked directly from what was checked by proxy. Never imply
direct verification of the live site if direct verification was not possible.

### Verified directly

Checks performed against the live production URL itself (e.g. `curl` against the
live domain, direct HTTP status checks on live links/images, direct browser
navigation to the live URL if permitted in this session's environment).

- [item]: [result]
- [item]: [result]

### Verified by proxy

Checks performed against a stand-in for the live site (e.g. a local mirror,
a byte-identical copy) because direct verification was not possible in this
session's environment. If no proxy verification was needed this session, replace
this entire subsection with: "All runtime checks this session were performed
directly against the live site." Otherwise, complete every field below.

- **Why proxy verification was used:** [state the concrete blocker — e.g. "browser navigation to the production domain is restricted in this session's environment"]
- **How equivalence was established:** [state the concrete evidence — e.g. "diff between the live file and the local committed file returned byte-identical"]
- [item]: [result]
- [item]: [result]

---

## 4. Session Summary

**Completed work:**
- [what was actually done]

**Problems identified:**
- [problems found, stated plainly, no speculation about cause unless confirmed]

**Problems resolved:**
- [which of the above were fixed, and how it was confirmed fixed]

**Decisions implemented:**
*(Architectural, editorial, or design choices that were carried out this session.
These are decisions, not facts about the archive — phrase them as "X was changed
to Y," not as conclusions about what the archive "is" or "needs.")*
- [decision] — [why, briefly]

**Recommendations only:**
*(Anything suggested but not implemented. Label clearly as not yet done.)*
- [recommendation]

**Intentionally deferred items:**
- [item] — [why it was deferred, if known]

---

## 5. Claude Code Work Summary

- **Files created:** [list, or "none"]
- **Files modified:** [list, or "none"]
- **Files removed:** [list, or "none"]
- **Commits:** [hash — message, or "none this session"]
- **Pushes:** [branch and range pushed, or "none this session"]
- **Deployments:** [what was deployed, or "none this session"]
- **Repository verification:** [one-line restatement of §1's result]
- **Runtime verification:** [one-line restatement of §3's result, noting direct vs. proxy]

---

## 6. Remaining Open Questions

List only items that were checked and found unresolved. Do not speculate about
issues that were not actually investigated this session.

If there are none, write exactly:

"No verified open issues remain from this session."

---

## 7. Ready for Next Session

**Current project state:** [factual, one or two sentences — what's live, what's clean]

**Architectural decisions implemented during this session:** [restate §4's
"Decisions implemented" briefly, or "none — this was a verification-only session"]

**Logical next stewardship task (if any):** [state only if something concrete and
verified surfaced this session — do not propose new features, redesigns, or
speculative work here]

---

## Principles this closeout protects

- **Honesty** — a claim in this document is either checked or labeled as unchecked. Nothing is asserted from memory or inference alone.
- **Simplicity** — seven sections, filled plainly. No extra ceremony.
- **Preservation** — this closeout is itself part of the archive's record; it should read clearly to someone years from now with no session context.
- **Long-Term Stewardship** — the next session (or the next steward, human or otherwise) should be able to pick up from §7 alone.
- **Restraint** — report what was verified and decided. Do not use this document to argue for new work.
- **Content Creates Structure** — the template imposes no navigation, no tooling, no process beyond the sections above; the discipline lives in what's written, not in new infrastructure.
