# Working History Collection — Charter, Version 1.0

**Status: approved, permanent.** This document governs the Working History Collection the way `docs/curatorial/CURATORIAL-COMPANION-v1.0.md` governs the Curatorial Companion. Implementation follows this charter. Architectural decisions recorded here are closed. Future changes require repository evidence, not preference.

---

## Purpose

Jeffrey F. S. Neumann has made things for fifty years — collage, sculpture, photography, painting, and design. Some of that making happened on paper and canvas. Some of it happened on screens: portfolio sites, a print-sales site for a recurring character, two websites made for a grandson's LEGO and K'NEX creations. Those websites are not a footnote to the creative life this archive preserves. They are part of it.

The Working History Collection exists to preserve those websites — as they were, not as they might look if redesigned today — and to document what each one was, when it existed, why it was made, and what it connects to. The goal is the same goal that governs every other part of this archive: will this help a future grandchild understand Jeff and his life better. Nothing in this collection exists for any other reason.

---

## Philosophy

This collection follows the same standing rule that governs the rest of JFSN: **preservation is preferred over modernization, always.** A historical website is not a design problem to be improved. It is a fact about a specific year, built with whatever tools existed then, and it stays that way.

Three commitments follow from that:

- **Original source folders are immutable.** They are never hand-edited, never "cleaned up," never modernized. If a mistake is found in a source folder, it is documented — the mistake is not fixed by rewriting history.
- **What visitors see is a sanitized, derived copy** — never the source itself. The distinction between the two is permanent and always visible in the record (see Sanitization Policy).
- **A historical website is never redesigned to look better, function better, or read more favorably than it did at the time.** If a site had dead links, ugly tables, or a confused navigation, that is what visitors see. That confusion is itself part of the historical record.

---

## Archival Principles

Every record in this collection is held to the same evidentiary standard already governing the rest of the archive:

- Every factual field must be verifiable — from the site's own files, from git history, or from Jeff's own testimony, marked accordingly.
- Nothing is inferred and presented as fact. An inference is labeled as an inference.
- A gap in the record is shown as a gap. It is never quietly filled with a plausible guess.

---

## Honesty Rules

- A screenshot is always captioned with the date it was taken. It is never presented as a live view of anything.
- A sanitized copy is always documented as sanitized, with exactly what was changed and why (see Sanitization Policy). Visitors are never left to assume they are viewing the untouched original.
- Creator commentary is always labeled by its status — verbatim, paraphrase, or not yet captured (see Creator Commentary Policy). Silence about a quote's status is not permitted anywhere in this collection.
- A relationship between two records is only recorded where evidence supports it. An uncertain or unconfirmed connection is left out, not guessed at.

---

## Preservation Rules

- The source folders are preservation-grade: kept complete, kept exactly as found, never touched after their initial verification.
- The public-facing collection is built entirely from derived copies. The source is never served directly.
- Repairs to a sanitized copy — anything that makes it safely viewable — are documented at the time they're made, permanently, in that record's own action log. A repair is not a design decision; it is a conservation decision, and conservation decisions are recorded the way a museum records a restoration.

---

## Metadata Philosophy

Metadata for a historical website is held to the same discipline as metadata for an artwork: **fact and interpretation are never blended.** A record's metadata separates cleanly into:

- **What is known** — title, approximate date, the technology it was built with, what state it survives in.
- **What is remembered** — creator commentary: why it was made, what it meant, what came of it.
- **What is estimated** — anything dated or connected by inference rather than direct evidence, marked as such.

A record is complete when its known facts are documented, even if its remembered content is not yet captured. Completeness of *facts* and completeness of *testimony* are different, and the record is honest about which it currently has.

---

## Repository Structure

- **Source (immutable):** the original website folders, kept as a private, gitignored archive. Nothing here is ever hand-edited again after it is first verified and catalogued.
- **Public collection (derived, tracked):** sanitized copies, one metadata record per site, one screenshot per site, and one hand-authored page per site.
- **Collection index:** one hand-authored page presenting the whole collection — the entry point, not a generated listing.

There is no page generator for this collection. Each record page is hand-authored, the same way every other small, individually-meaningful page in this archive is hand-authored (`start-here.html`, `stories.html`, `why-i-made-things.html`, `imagined-museum.html`). Automation in this repository exists where content is produced at scale (1,084 artwork pages) or where a canonical external document must be protected from hand-editing (the Curatorial Companion). Neither condition applies to a collection of this size, and no automation beyond the sanitization step below should ever be built for it on that basis alone.

---

## Sanitization Policy

A historical website's source files may contain things that cannot safely or meaningfully be served today: a live form handler, a plugin no browser can run anymore, a call to some other company's tracking service. Sanitization exists to solve exactly that problem, and nothing more.

- Sanitization is performed by a single, small, auditable script — not a general-purpose build pipeline.
- Every sanitization action taken on a given site is recorded permanently in that record's action log: what was found, what was done about it, and when.
- Sanitization never changes how a site looks or reads. It only removes or neutralizes what can no longer safely run. A dead plugin is replaced with a plain, captioned static substitute. A live form handler is disabled. Nothing is added that wasn't there, and nothing that was there is prettied up.

---

## Historical Personal Information

A historical website's source files may contain real personal information from the time — a phone number, a private email address, a home address, or another person's name — that is not a technical hazard. It runs, or reads, exactly as intended. The question it raises is different: whether decades-old personal information should be republished today.

- Historical personal information is never removed from the immutable source. The source stays exactly as found, like every other rule in this charter.
- Whether it appears in the *published, sanitized copy* is Jeff's decision, made per record, not assumed either way by whoever is doing the preservation work.
- Until that decision is made for a given record, the information is noted as found, but the record is not published.
- This is not a new required field on every record. It is noted under that record's existing Preservation Assessment or Archival Notes, only when something is actually found — most records will have nothing to say here.

---

## Fixity Policy

Every record carries a fixity hash of both its source folder and its served, sanitized copy.

**Why this exists in addition to git:** git already protects this repository's history — every commit is verifiable, every change is recorded, and that record does not silently disappear. But a deployed website lives on a hosting server outside git entirely. Fixity hashes exist to verify that *what visitors actually see on the live site* still matches what this archive intended to serve — a check git cannot perform once a file leaves the repository. Git protects repository history. Fixity protects deployed archival objects. They are solving two different problems, and this collection needs both.

A fixity hash that has not been re-verified in a long time is not proof of anything — it is only as trustworthy as the last date it was checked. Every fixity record therefore carries its own last-verified date, and that date should be treated as an honest measure of how current the guarantee actually is.

---

## Creator Commentary Policy

Creator commentary is captured the same way every other piece of testimony in this archive is captured: from Jeff, in his own words wherever possible, one sitting at a time, "next" ending it instantly, no interrogation.

**If commentary for a given record is never captured, the permanent value `not yet captured` is an honest archival state.** It is not incomplete work. It is not a task waiting to be finished by someone else. A future maintainer must never write commentary in Jeff's voice to fill that gap — not a plausible guess, not a synthesis from other records, not an inference dressed up as a quote. The correct action, always, is to leave the field exactly as `not yet captured` and move on. An honest gap is worth infinitely more to a future grandchild than an invented certainty.

---

## Screenshot Policy

One current, dated screenshot per record. That screenshot is replaced — not added to — if and only if the record's preserved presentation genuinely changes (for example, if further sanitization work visibly alters how a site renders). There is no screenshot version history by default. A growing gallery of screenshots for a site that never changes would document nothing; it would just accumulate. If a genuine preservation reason ever arises to keep more than one screenshot for a single record — evidence that the rendering itself is decaying over time, for instance — that decision is made deliberately, on the evidence in front of it, not built in advance as a general feature.

---

## Related Sites Philosophy

Earlier drafts of this architecture modeled the collection as a single predecessor/successor chain — each site pointing to the one before it and the one after. That model was abandoned, and it should never be reintroduced.

**Why:** the actual evidence shows three creative threads running in parallel across the same twenty-five years — a professional design-career line, a personal fine-art line, and a family-collaboration line. A single linear chain forces all three into one sequence that never existed. Two sites can be closely related — a later version of the same project, a shared subject, a shared period of life — without one being the strict "next" step after the other. **Related Sites** records exactly that: a connection where the evidence supports one, with no claim about ordering unless ordering is itself what the evidence shows.

A record with no recorded relationships is not a broken record. It may simply be true that nothing else in the collection relates to it yet, or ever.

---

## Search Integration

Working History records must be discoverable through the archive's existing search (the same site-wide ⌘K search already indexing artwork records). This is a data-inclusion decision, not a new engineering project: Working History's records are added to the existing search index the same way any other content type would be. **No second search system is ever built for this collection.** If the existing search cannot represent something about a website record, that is a reason to extend the existing system, never to duplicate it.

---

## Navigation Philosophy

This collection does not receive its own primary navigation item. The existing four-item navigation — Archive, Series, About, Lost Works — is not expanded for this collection, and should not be expanded for any future one on this basis either.

Discovery happens through three existing, already-precedented mechanisms:
- A single sentence and link from `about.html`'s existing career narrative.
- One card in `start-here.html`'s existing "Guided Discovery Paths."
- One inline text link in the footer, matching the plain, all-caps, no-column style already used for "Open Source Code" and "Privacy."

No new visual pattern, no new navigation structure, no footer column. The archive's navigation stays exactly as minimal as it already is.

---

## Maintenance Rules

- Source folders are never touched after initial verification. If a maintainer believes a source folder is wrong or incomplete, the correct action is to document that belief in the record, not to edit the source.
- The sanitization script is the only automation this collection needs. It should be re-run, in full, whenever a record's source changes or when a fixity re-verification is due — never patched by hand against its output.
- A new record follows the same path every piece of preservation work in this archive follows: discovery, preservation of the source, factual metadata, creator testimony (if and when it comes), publication, verification. Testimony is never blocked on engineering, and engineering is never blocked on testimony arriving.
- Nothing in this collection is ever redesigned to modernize its appearance, improve its usability, or make it read more favorably. If it needs to change, the reason is preservation (a dead technology, a security concern) — never taste.

---

## Future Stewardship Guidance

Fifty years from now, whoever maintains this collection will likely be looking at technology that has moved further past these sites than these sites have moved past 1970. That is expected, and it is not a failure of this collection — it is the same condition every physical object in this archive is already in. The response is the same one already practiced everywhere else in JFSN: document the decay honestly, preserve what can still be preserved, and never quietly paper over a gap with something invented.

If in doubt about any decision this charter doesn't cover, the standing question that governs the whole archive still applies here without modification: will this help a future grandchild understand Jeff and his life better. If yes, it is probably worth doing. If no, it is probably not.

---

## Stewardship Statement

To whoever reads this next, possibly decades from now:

These websites were not incidental. They were how a working designer presented his professional life, how a grandfather documented a grandson's LEGO castles and K'NEX machines, how a recurring character found its way onto gallery walls and, once, onto a print-sales page of its own. They are as much a record of Jeff Neumann's creative life as any collage or sculpture in this archive, and they deserve exactly the same honesty this archive has always demanded of itself: no invented facts, no smoothed-over gaps, no quiet modernization dressed up as preservation.

Care for them the way you would care for a fragile photograph — not by restoring it to look new, but by making sure it survives long enough for someone else to still be able to look at it.
