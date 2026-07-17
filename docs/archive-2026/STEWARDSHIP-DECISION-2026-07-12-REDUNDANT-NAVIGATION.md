---
title: Stewardship Decision — Retire Redundant Cross-Page Navigation
date: 2026-07-12
status: Completed
---

# Stewardship Decision: Retire Redundant Cross-Page Navigation

## Summary

The duplicated navigation sections ("Alternative views" / "Explore the archive in other ways") that appeared on about.html, lost.html, and series.html have been retired as a conservation intervention.

## Background

**Introduced:** June 25, 2026 (Commit 0f85055cd8e991d1b672f0ea9cf4c439632ed8ac)

**Original purpose:** "Improve discoverability of secondary view options across the site"

**Pages affected:** about.html, lost.html, series.html

## Conservation Review Findings

During long-term stewardship review, the following was established:

1. **Redundancy:** The navigation links in these sections (Wall, Chromatic River, Curatorial Map, Archive) were already available in:
   - The page footer under "Collection Views"
   - The page header navigation (Archive link)

2. **Purpose not achieved:** No objective evidence was found demonstrating that the duplicated sections improved discoverability beyond what existing navigation already provided.

3. **Maintenance burden:** The sections created an ongoing obligation to:
   - Maintain duplicate copies of navigation links across multiple pages
   - Keep link destinations in sync with footer navigation
   - Manage page-specific styling (.about-alt-link, .lost-alt-link, .series-alt-link)

4. **Architectural misalignment:** ARCHITECTURE-DECISIONS.md explicitly states:
   > "Dynamic Discovery Is Preferred Over Duplicate Static Navigation Where Appropriate... This approach avoids creating redundant navigation and distributes discovery naturally across the archive."
   
   The duplicated sections violated this principle.

## Decision

The sections were retired as the smallest justified conservation intervention because:

- They duplicated functionality already present in preserved navigation systems
- Their stated purpose (improve discoverability) was achieved through existing footer/header navigation
- They created maintenance burden without preservation value
- They became inconsistent with later-ratified architectural guidance

## Implementation

**Commit:** 6d6727d8165d4db1e16b43cac49e56be15e3294c  
**Date:** 2026-07-12  
**Message:** "Stewardship: retire redundant cross-page navigation sections"

**Changes:**
- Removed "Alternative views" section from about.html (16 lines)
- Removed "Explore the archive" section from lost.html (16 lines)
- Removed "Explore more ways to see the work" section from series.html (16 lines)
- Total: 48 lines deleted, 0 lines added

**Preserved:**
- Footer navigation remains intact on all pages
- Header navigation remains unchanged
- All links to Wall, Chromatic River, Curatorial Map remain accessible through footer "Collection Views"
- Archive link remains in header navigation
- Accessibility unaffected
- Page structure and styling (except removed sections) unchanged

## Verification

**Repository verification:**
- Pre-commit navigation audit: PASSED
- Only intended files modified: PASSED
- Footer structure intact: PASSED
- Header navigation intact: PASSED

**Production verification:**
- Removed sections absent from live site: PASSED
- Footer "Collection Views" present: PASSED
- Links to Wall, Chromatic River, Curatorial Map accessible: PASSED
- Links to Archive accessible via header: PASSED

## Reversibility

This decision is fully reversible. The removed sections can be restored from version control if future evidence justifies their retention.

## Stewardship Principle Applied

This implementation exemplifies conservation stewardship principle: *"The archive should become quieter by removing elements whose continued stewardship could no longer be objectively justified."*

The intervention is:
- ✓ Minimal (deletion only; no replacement or redesign)
- ✓ Evidence-based (grounded in conservation review findings)
- ✓ Reversible (can restore from git history)
- ✓ Consistent with ARCHITECTURE-DECISIONS.md
- ✓ Preserves all preservation value (navigation access unchanged)

## Archival Note

The duplicated navigation was a good-faith attempt to improve discoverability that did not achieve its goal beyond existing systems. In long-term stewardship, recognizing when a feature's purpose is already served elsewhere is as important as recognizing when new features are needed. This decision represents disciplined stewardship: simplification in service of long-term maintainability.
