---
title: Legacy Architecture Isolation
date: 2026-07-12
status: Completed
---

# Legacy Architecture Isolation — Stewardship Decision Record

## Summary

The legacy pages from the previous site architecture (about.html, lost.html, series.html) have been **isolated from the active Museum experience** while remaining **preserved in the repository and on the server**.

This is an **information architecture separation**, not a deletion. The pages continue to exist and are historically recoverable via direct URL, git history, and deployed backups. They are simply no longer part of the primary visitor journey through the active Museum site.

## Decision

**Remove all references to legacy pages from:**
- Active navigation (_shared/top-nav.html)
- Sitemap discovery (sitemap.html)
- XML sitemaps (build_catalog.py)
- Generated page templates
- Public-facing discovery mechanisms

**Preserve:**
- Legacy page files (about.html, lost.html, series.html) — unchanged on disk
- Legacy page content — not modified
- Git history — full recovery path available
- Server deployment — files remain accessible via direct URL

## Rationale

### The Problem Solved

The archive currently maintains two parallel navigation ecosystems:

1. **Museum v2 (Primary)** — Dark theme, conceptual rooms, launched as "The Museum That Never Existed"
   - Homepage → Current, Guernica Passage, Flooded Wing, Hall of Openings, Studio, Archive, Working History
   - Coherent visitor narrative
   - Self-contained collection of experiences

2. **Legacy Architecture (Secondary)** — Light theme, traditional site structure
   - Decade pages, theme pages, medium filters
   - Biography, lost works, essay content
   - Pre-Museum-redesign functionality

These two systems were never fully integrated after the Museum v2 redesign. The legacy pages existed in parallel, accessible through:
- Decade pages (1970s–2020s)
- Sitemap page
- Direct URLs

This created:
- **Navigation confusion:** Two separate aesthetics, two separate entry points
- **Maintenance burden:** Keeping legacy nav in sync with Museum nav across 37 pages
- **Unclear information hierarchy:** No clear signal to visitors about the relationship between systems
- **Discovery ambiguity:** Search engines indexed both, creating duplicate content concern for some pages

### Preservation Philosophy Applied

The archive operates under a principle: **preserve history while maintaining a coherent active experience**.

This decision:
- ✓ Preserves the legacy pages exactly as they are
- ✓ Maintains git history (full recovery path)
- ✓ Keeps server copies (for users who know the direct URLs)
- ✓ Clarifies the active visitor experience (Museum v2 is the current narrative)
- ✓ Reduces maintenance burden (single navigation system to maintain)
- ✓ Honors the previous site's content without making it primary

### Conservation Stewardship

This reflects established stewardship practice: **an archive can preserve materials that are no longer part of its active collection**. Museums do not delete paintings from storage when they change exhibitions; they are cataloged, preserved, and available to scholars while being removed from the primary gallery.

The legacy pages are now in "archival status" — preserved for historical documentation, recoverable by anyone who knows their URL, accessible through version control and backups, but not part of the current curated experience.

## Implementation

### Files Modified

**Navigation template:**
- `_shared/top-nav.html` — removed about.html and lost.html links from desktop and mobile navigation

**Discovery pages:**
- `sitemap.html` — removed legacy page links from the public sitemap

**Build scripts:**
- `artworks/build_catalog.py` — removed about.html and lost.html entries from XML sitemap generation

**Stamped pages (37 total):**
- All pages that receive stamped navigation via stamp-nav.sh were automatically updated when the template was cleaned

### Files Preserved (Not Deleted)

- about.html — biography page, unchanged
- lost.html — lost works essay, unchanged
- series.html — series deep-dive template, unchanged

These remain:
- In the git repository (recoverable via `git checkout` or git history)
- On the production server (reachable via jfsn.com/about.html if visited directly)
- Accessible via browser history and bookmarks
- Included in full-site backups (B2, local mirrors)

### Removed References

**From active navigation (7 instances removed):**
1. _shared/top-nav.html — desktop nav link
2. _shared/top-nav.html — mobile drawer link
3. sitemap.html — desktop nav link
4. sitemap.html — mobile drawer link  
5. sitemap.html — Stories & Context section (about.html)
6. sitemap.html — Stories & Context section (lost.html)
7. artworks/build_catalog.py — XML sitemap entry (about.html)
8. artworks/build_catalog.py — XML sitemap entry (lost.html)

**Not removed (intentionally preserved):**
- Legacy inter-page links within about.html, lost.html, series.html (they may link to each other)
- Decade page navigation (1970s–2020s still link to legacy pages internally; these pages are part of a separate editorial ecosystem not tied to Museum v2)
- Internal application code or data structures that reference these pages
- Footer links in legacy pages themselves

## Verification

**Objective verification that isolation is complete:**

✓ Removed from desktop navigation (Archive, Series only; no About, Lost Works)
✓ Removed from mobile navigation drawer
✓ Removed from sitemap.html discovery
✓ Removed from XML sitemap generation (build_catalog.py)
✓ No links from Museum v2 pages (index.html, current.html, etc.)
✓ No links from other active pages (archive.html, artwork.html, etc.)
✓ No JavaScript references in active scripts
✓ No generated page templates reference legacy pages
✓ Navigation stamp (stamp-nav.sh) confirms 37 pages updated with clean nav

## Reversibility

This decision is **fully reversible**:

1. **Short-term reversal (one git commit):**
   - Restore about.html and lost.html links to _shared/top-nav.html
   - Restore sitemap entries to sitemap.html and build_catalog.py
   - Run stamp-nav.sh and build_catalog.py
   - Commit: "Restore legacy page navigation"

2. **Medium-term reversal (via git history):**
   - `git show <commit-before-isolation>:_shared/top-nav.html` to see original navigation
   - `git checkout <commit-before-isolation> -- about.html lost.html`

3. **Full recovery:**
   - Files exist unchanged in version control
   - Files remain on production server (direct URL access)
   - Backups contain full copies (B2, local mirrors)

## Stewardship Principles Applied

1. **Preservation without dogma** — Legacy pages are kept, not destroyed
2. **Clear hierarchy** — Active experience (Museum v2) is distinct and primary
3. **Reversibility** — Decision can be undone if evidence changes
4. **Evidence-based** — Decision responds to navigation confusion and maintenance burden
5. **Reduced surface** — Simpler navigation system is easier to maintain long-term

## Future Considerations

### If Legacy Pages Should Become Active Again

Evidence that would justify reversal:
- Documented visitor demand for bio/about page
- New site section that needs legacy content integrated
- Change in curatorial direction to re-emphasize site evolution
- User research showing lost-works page serves important purpose

### If Legacy Pages Should Be Fully Archived

Evidence for deeper archival (removing from production server):
- Confirmed zero visitor access to direct URLs over 6+ months
- Backup verification that recovery is possible without server copy
- Explicit decision to retire legacy content from public access entirely
- Replacement of legacy pages with Museum v2 equivalents and formal redirects

### Ongoing Maintenance

The isolation is **maintenance-neutral**: the legacy pages require no ongoing updates. If they are later needed for reference, they exist exactly as they were at the time of isolation. The Museum v2 navigation requires no special logic to "skip" legacy pages — they are simply not mentioned.

## Archival Note

This decision documents the moment when the archive formally separated:
- **Active experience:** The Museum That Never Existed (v2, dark theme, room-based)
- **Preserved artifacts:** Previous site's pages (light theme, functional but unlinked)

Both serve the mission — one as the current public face, one as historical record. The isolation makes this boundary clear and operational.

**Decision made:** 2026-07-12
**Implemented by:** Claude Code (automated stewardship)
**Approval required for reversal:** Archival record only (reversible via git and backups without additional authorization)
