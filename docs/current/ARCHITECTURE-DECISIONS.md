# ARCHITECTURE-DECISIONS.md

## Purpose

This document preserves the architectural decisions that have guided the JFSN Archive's development.

Its purpose is to explain why important structural choices were made, so that future changes remain consistent with the archive's philosophy. A future maintainer, encountering ambiguity about whether to add a navigation page, create a new index, or reorganize content, should find clarity here about what has already been decided and why.

Architecture is a servant of preservation, not its master. This document exists so that future decisions remain coherent with the archive's true purpose: preserving a creative life honestly and completely, in a way that will remain coherent and navigable indefinitely.

---

## Core Philosophy

The JFSN Archive is guided by six foundational principles that inform every structural decision:

**Honesty** — The archive shows what exists without fabrication or distortion. Absent works are documented as absence, not filled. Data is never invented to complete a narrative. Composites are labeled as such. Years remain estimates with transparency.

**Simplicity** — The simplest structure that serves the content is the right one. Navigation is restrained. Pages exist to show work or preserve testimony, not to create hierarchy. Categories are natural groupings of content, never imposed structures in search of something to organize.

**Preservation** — The archive exists because Jeff's creative work and testimony would otherwise be lost. Every structural choice serves this purpose. A feature that increases complexity without increasing preservation value has failed its test.

**Long-Term Stewardship** — The archive is expected to grow over many years. Decisions must accommodate growth without requiring periodic redesigns. A structure that cannot scale from its current size to double or triple that size was not built to last.

**Restraint** — The archive does not grow by default. New features, pages, navigation items, and systems are added deliberately, with evidence that they solve a real problem. Restraint is not minimalism—it is the discipline to refuse additions that do not serve the archive's core purpose.

**Content Creates Structure** — Pages should emerge from content that exists, not precede it. When new material arrives, the existing structure should accommodate it when possible. New architecture should be added only when content demonstrably demands it. Structure should not create content slots waiting to be filled.

---

## Architectural Decisions

The following decisions have been made and are considered settled. Future changes should remain consistent with them.

### The Archive Is Not a Commercial Website

The JFSN Archive is a long-term preservation archive, not a marketing platform, portfolio, or commercial project. This means:

- No calls to action exist to drive engagement or sales
- No newsletter signups, social media buttons, or promotional features
- No engagement metrics, recommendation feeds, or trending items
- The archive's purpose is completeness and honesty, not visibility

This decision protects the archive from feature creep and keeps the focus on preservation rather than growth metrics.

### Navigation Remains Intentionally Restrained

Primary navigation is kept minimal. This is appropriate for a preservation archive. Each additional navigation item creates cognitive load and suggests equal importance to disparate functions.

New primary navigation items should not be added without clear evidence they serve the archive's core mission. If a section grows substantially, that does not automatically justify a new navigation item; it justifies extending or reorganizing the existing pages.

### New Navigation Should Be Added Only When Justified by Real Content

The archive was designed with a principle of restraint: do not create infrastructure for hypothetical futures. Do not add collection indexes before multiple collections exist and demand easier discovery. Do not create preservation documentation hubs to organize documentation that does not yet exist.

The principle of content creating structure governs this decision. Wait for evidence before adding infrastructure.

### New Index Pages Should Be Created Only When Existing Content Genuinely Requires Them

Index pages should be created when:

- Content exceeds what a single page can naturally hold, AND
- Existing structure (pagination, jump indices, excerpt cards, or existing pages) cannot accommodate the growth

Do not create an index page because it is "cleaner" or more "architecturally pure." Create it when the content demands it and existing structure proves insufficient.

### Related Pages Should Be Connected Where Meaningful

The archive benefits when readers can navigate between related content. Lost works (absence) naturally connects to family collaborations (presence), creator testimony (why loss happened), and preservation documentation (why the archive exists).

However, not every page needs to link to every other page. Avoid creating spurious connections. The signal-to-noise ratio of navigation matters.

### Dynamic Discovery Is Preferred Over Duplicate Static Navigation Where Appropriate

Some content types are discoverable through multiple mechanisms—data-driven navigation, dynamic routing, and cross-referenced links from relevant contexts—without requiring static HTML links from centralized pages.

These mechanisms are sufficient. This approach avoids creating redundant navigation and distributes discovery naturally across the archive.

---

## Decisions Rejected

The following architectural approaches were evaluated and intentionally rejected:

### Creating Infrastructure for Hypothetical Future Content

Proposals to create index pages before the content that would fill them reached substantial size were rejected. Hypothetical infrastructure ossifies; it becomes harder to change. Creating pages for content that does not yet exist violates the principle that content creates structure.

### Adding Hub Pages Before They Are Needed

Index pages should not be created in anticipation of future growth. Create them when:

- The archive's own content demonstrates that discovery is difficult, AND
- Existing pages can no longer comfortably serve their function

Creating infrastructure before these conditions are met is speculative architecture—expensive and inflexible.

### Expanding Navigation Without Evidence

Expanding primary navigation requires evidence that visitors are unable to find existing sections. Primary navigation is already discoverable via homepage, footer, and cross-page links. Expansion creates a scaling problem and violates the restraint principle.

### Creating Categories Simply to Organize Pages

Forcing pages into predetermined categories—systems, buckets, or organizational frameworks—creates architecture that serves the framework rather than the content. Pages are kept separate when they serve distinct purposes and connected when visitors would naturally move between them.

### Redesigning for Its Own Sake

The archive has no organizational debt justifying redesign. Redesign should be driven by evidence of real problems, not by the desire to improve aesthetics or create architectural purity. If the structure works, it should remain unchanged unless preservation or discoverability genuinely requires change.

---

## Growth Philosophy

The JFSN Archive will continue to grow. Expect:

- Additional artworks and collections
- Additional oral histories and essays
- Additional curated exhibitions and special projects
- Additional preservation documentation

This growth should be accommodated through extension of existing structure, not redesign.

### How Growth Should Be Handled

**New artworks** belong in the existing Works Archive. No new architecture required. `archive.html`'s single grid with client-side medium/decade/orientation filter chips is the whole discovery mechanism as of the 2026-07-16 pruning — the separate medium-filter pages, decade pages, and theme pages this line used to describe were deleted in that pass (in favor of one filterable grid over per-category static pages) and should not be recreated without Jeff reopening that scope.

**New oral histories and essays** should be added to existing pages, extended as content grows. When a single page becomes unwieldy, pagination or excerpt cards can be added to the existing page without requiring a new folder or index.

**New curated exhibitions and special projects** should be added as individual pages. When sufficient exhibitions exist and discovery becomes difficult, an index may become justified. This page is created only when evidence supports it.

**New preservation documentation** should be linked contextually from relevant pages. If preservation documentation grows substantially, a dedicated index may become justified.

In all cases: add content first, architecture second. Let evidence determine structure.

---

## Stewardship Guidance

Before introducing structural changes to the archive, a future maintainer should ask:

**Does this preserve something important?** The archive exists to preserve a creative life. Every structural change should serve this purpose. A feature that increases discoverability of lost works is justified. A feature that increases engagement is not.

**Does it improve discovery?** Can a visitor find what they need more easily? Does it remove genuine confusion or dead-ends? Changes grounded in solving real discovery problems are justified. Anticipatory infrastructure is not.

**Is it supported by evidence?** Are visitors reporting that they cannot find something? Does the existing structure demonstrably fail? Changes grounded in evidence are justified. Proposals in anticipation of future growth are not.

**Can the existing structure already accommodate it?** Before creating a new page or index, verify that existing pages cannot be extended to hold the content. Extending an existing page is preferable to creating a new one.

**Is this consistent with past decisions?** The archive has consistently rejected hub pages for hypothetical content, resisted expanding navigation without evidence, and declined to force pages into predetermined systems. New decisions should remain consistent with this restraint.

If the answer to any of these questions is no, the archive should remain unchanged. Add the content, wait for evidence that structure is insufficient, then add infrastructure deliberately.

---

## Closing Statement

The JFSN Archive is a long-term preservation archive whose purpose is to remain a durable record of a creative life. Its structure should evolve slowly, deliberately, and only when the archive itself demonstrates a genuine need for change.

Architecture should be a servant of preservation, never its distraction. A page that preserves creator testimony is worth creating. A hub that organizes hypothetical future content is not. A link that connects loss to family collaboration is worth adding. A navigation item that expands primary options without evidence is not.

Future maintainers should approach structural change with healthy skepticism. The simplest structure that serves the content is the right one. When in doubt, do less, not more. The archive has already proven it can preserve works, tell a creator's story, and honor loss with restraint and honesty. It will continue to do so.
