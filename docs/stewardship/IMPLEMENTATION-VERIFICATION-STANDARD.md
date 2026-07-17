# JFSN Archive — Repository Verification Standard

**Final Stewardship Edition**

This standard governs all future work on the JFSN Archive.

Its purpose is to ensure that every implementation is evaluated using the strongest evidence appropriate to the work being performed.

---

## Scope

This document governs how implementation work is verified and reported for the JFSN Archive.

It applies to all implementation work, including:

* source code
* styling
* JavaScript
* accessibility
* documentation
* deployment
* repository maintenance
* archival infrastructure
* tooling
* metadata

This document does not define design direction.

Design intent remains governed by:

* the Constitution
* CANON.md
* Experience Studio documents
* Stewardship policies

Where those documents define what the archive should be, this document defines how implementation is verified and reported.

---

## Verification Status (Required)

Every implementation report must begin with exactly one of the following:

* **Verification Status: Production verified**
* **Verification Status: Ready for deployment**
* **Verification Status: Ready for commit**
* **Verification Status: Not ready**
* **Verification Status: Verification could not be completed**

No additional status labels may be introduced.

---

## Evidence Hierarchy

Use the strongest applicable evidence.

### Level 3 — Visitor Experience (Highest Authority)

For visitor-facing work, this is the final authority.

Examples:

* direct observation in a real foreground browser
* production verification
* screenshots
* interaction testing
* actual visitor experience
* real visitor feedback

**If Level 3 evidence exists, it overrides Levels 1 and 2.**

### Level 2 — Behavioral Evidence

Demonstrates that the interface behaves correctly.

Examples:

* keyboard navigation
* accessibility behavior
* responsive layouts
* scrolling
* animation behavior
* browser compatibility
* interaction testing
* regression testing

### Level 1 — Supporting Evidence

Useful but never sufficient by itself for visitor-facing work.

Examples:

* code inspection
* successful compilation
* linting
* automated tests
* repository state
* deployment logs
* console output
* DOM inspection
* network requests
* performance metrics

Implementation evidence supports conclusions but does not replace observation.

---

## Commit Gate

Before any production commit:

* requested feature is visibly present
* behavior matches the request
* no JavaScript errors
* no observed regressions
* accessibility preserved
* responsive behavior verified

**If any item fails:**

**Stop.**

**Do not commit.**

---

## Deployment Gate

**Before deployment:**

* local verification completed using the highest applicable evidence

**After deployment:**

* verify the live production site (for visitor-facing work)
* confirm production matches local behavior
* verify using a real foreground browser whenever visual behavior is involved

**Never assume deployment success equals implementation success.**

---

## Reporting Format

Every implementation report must contain:

1. **Verification Status**
2. **Verified Facts**
3. **Observations**
4. **Evidence**
5. **Unknowns**
6. **Decision**

---

## Approved Decisions

Exactly one:

* **Ready for commit**
* **Ready for deployment**
* **Production verified**
* **Not ready**
* **Verification could not be completed**

---

## Prohibited Statements

Do not state:

* "Fixed"
* "Resolved"
* "Working"
* "Verified"
* "Production-ready"

unless those statements are supported by the appropriate level of evidence.

---

## Stewardship Exception

Not all work has a visitor-facing manifestation.

Examples include:

* repository organization
* documentation
* deployment tooling
* backup systems
* metadata cleanup
* indexing
* build automation
* archival infrastructure

**For these tasks:**

* use the strongest applicable evidence
* explain why visual verification is not applicable
* identify what evidence was used instead
* clearly state any remaining unknowns

**Do not require browser-based visual verification when there is nothing for a visitor to observe.**

---

## Stewardship Principle

**The rendered visitor experience is the final authority for visitor-facing features.**

For non-visual work, use the strongest applicable evidence and clearly distinguish verified facts from assumptions.

The purpose of this standard is not to slow development.

Its purpose is to ensure that every conclusion accurately reflects the quality of the evidence supporting it, protecting both the integrity of the archive and the trust placed in its stewardship.

---

## References

This document is the authoritative source for implementation verification and reporting. 

Contributors should reference this standard when:
* Reporting implementation status
* Evaluating whether work is ready for commit/deployment
* Creating deployment documentation
* Establishing new verification procedures

For design direction and archival intent, refer to the Constitution, CANON.md, and Experience Studio documents.
