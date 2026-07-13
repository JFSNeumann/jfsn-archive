---
title: JFSN Archive — Metadata Stewardship Constitution
date: 2026-07-12
status: Governing Document
authority: Archive Stewardship
applies_to: All metadata modifications, curator decisions, AI participation, long-term preservation
revision_history: Established 2026-07-12 (Jeff Neumann Archive)
---

# JFSN Archive — Metadata Stewardship Constitution

## Preamble

This document establishes the governing principles for the stewardship of factual metadata in the JFSN Archive. It is intended to outlive software implementations, website redesigns, institutional transitions, and individual custodians. It applies to every decision to add, modify, correct, or remove metadata from the archive's record.

The archive exists to preserve the historical record of Jeffrey F. S. Neumann's work across fifty years of making. That record is entrusted to custodians across time. This constitution defines their responsibilities.

---

## 1. PURPOSE

### 1.1 The Role of Metadata

Metadata in the JFSN Archive exists to serve three interdependent purposes:

1. **Documentation** — to record observable facts about each work (medium, date, dimensions, composition, historical associations)
2. **Scholarship** — to support research by future viewers, family, and historians who wish to understand the work and its context
3. **Preservation** — to maintain an authoritative record that survives media migration, institutional change, and technology obsolescence

### 1.2 Metadata Is Not Opinion

Metadata documents the work. It does not interpret it.

Metadata does not record:
- Aesthetic judgments (whether a work is "successful" or "important")
- Market assessment (value, rarity, investment potential)
- Critical interpretation (what the work "means")
- Promotional claims (exhibition prestige, artist recognition)
- Curated significance (whether a work is "representative" or "typical")

Metadata records:
- Observable properties (materials, dimensions, orientation)
- Historical facts (date, series association, exhibition history when documented)
- Creator intention (when explicitly stated)
- Documented relationships (reworkings, series membership, known provenance)
- Absence (when works are known to be lost or unavailable)

### 1.3 Audience

Metadata serves:
- **The archive itself** — enabling users to discover and understand works
- **The family** — preserving knowledge and material inheritance for Jeff's daughters and grandchildren
- **Future scholars** — enabling research fifty or a hundred years from now
- **Preservation** — ensuring the record survives institutional transitions and technology change

In order of priority: **accuracy first, then accessibility, then completeness.**

---

## 2. FOUNDING PRINCIPLES

These principles define how every metadata decision should be made.

### 2.1 Truth Over Narrative

**The archive is a historical record, not a story.**

When there is tension between a complete narrative and an accurate record, accuracy prevails.

Example: If Jeff describes the Guernica-scale painting as lost, that loss is recorded. The archive does not invent "imagined reconstruction" or create a placeholder. The absence is a fact.

### 2.2 Unknown Is Preferable to Invented

**An honest gap is preferable to a fabricated certainty.**

When a fact is unknown:
- Record it as unknown
- Do not guess
- Do not mark as estimated if estimation is unfounded
- Do not invent supporting details

Example: If Jeff cannot recall the year a work was made, the year remains unknown. It is not assigned to a decade as a default.

### 2.3 Preserve Uncertainty

**Uncertainty is information.**

When metadata is incomplete, contradictory, or fallible:
- Mark it as such
- Preserve the original uncertain state
- Add confidence levels without overwriting original data
- Future custodians must be able to see what was uncertain

Example: "Title: Untitled (Figure, Blue Ground) [inferred from visual description]" preserves both the working title and the knowledge that it was inferred.

### 2.4 Evidence Takes Precedence Over Absence

**What is documented governs; what is undocumented does not contradict.**

If a work has documented exhibition history, that history is a fact. If documentation is absent for other periods, that absence does not negate the documented history.

Example: XXXIII Días (2022) is documented in work titles. The absence of prior exhibition record does not mean there was no prior exhibition—only that documentation does not exist.

### 2.5 Original Evidence Is Irreplaceable

**Primary sources are authoritative; interpretations are provisional.**

When original evidence exists (handwritten notes, photographs, creator testimony), it takes precedence over any summary, interpretation, or later reconstruction.

Example: A handwritten note by Jeff about a work's materials is authoritative. A later guess based on visual inspection is provisional and must be marked as such.

### 2.6 The Work Speaks First

**Metadata serves the work, not the archive system.**

Metadata design decisions should be driven by what preserves the work's integrity and accessibility, not by what is easiest to implement.

Example: If a choice is between omitting uncertain dimensions (honest) and including inferred dimensions (incomplete but convenient), omit them.

### 2.7 Metadata Documents the Work, Not Opinions About It

**Avoid attributions of value, importance, or representativeness.**

What is recorded:
- Observable facts (medium, size, date)
- Documented associations (series, exhibition, themes)
- Creator statements

What is not recorded:
- "Important", "significant", "representative", "best", "breakthrough"
- Comparative rankings
- Qualitative assessments
- Predictions about future scholarship

The work's importance will be evident to future readers. Do not pre-judge it.

### 2.8 Absence Is Part of the Story

**Lost works, water-damaged collections, and gaps in documentation are facts worth preserving.**

The archive does not hide knowledge by omission. The absence of 500–1,000 works due to water damage is as much a part of the historical record as the 1,084 works that survive.

Example: A formal "Lost Works Register" is part of the archive. It documents known losses with whatever information exists (scale, approximate year, materials visible in photographs, etc.).

### 2.9 The Archive Survives Software

**Metadata must remain human-readable and portable across technological change.**

Metadata should be:
- Expressed in open formats (JSON, plaintext, XML)
- Free of software-specific encoding
- Documented in language-independent schemas
- Organized around conceptual relationships, not database structures

Example: A "confidence" level should be stored as "estimated" or "confirmed", not as a numeric code that only a specific software understands.

---

## 3. AUTHORITY HIERARCHY

When there is a question about what to believe, consult this hierarchy. Higher authority takes precedence over lower.

### 3.1 The Five Tiers of Authority

#### Tier 1: Creator Testimony — Highest Authority

**Jeff's direct testimony about his own work is the highest authority.**

This includes:
- Explicit statements about creation date, materials, series membership, or intent
- Documented memory (oral history recordings, verified notes)
- Direct confirmation of existing metadata

Creator testimony is authoritative because:
- Only the creator knows his own intentions
- Only the creator has lived memory of the work's making
- Only the creator can confirm or correct interpreter readings

Limitations:
- Memory is fallible after 50+ years
- Jeff may not remember details he never consciously registered
- When Jeff cannot recall something, that absence is recorded, not assumed

Example: Jeff states "I made this as part of the Guernica series in the 1990s." This is authoritative. If Jeff says "I don't remember," that uncertainty is preserved.

#### Tier 2: Documented Contemporary Evidence — High Authority

**Evidence created at or near the time of the work is reliable.**

This includes:
- Exhibition catalogs, press materials, gallery records from the time
- Photographs with visible dates
- Handwritten notes with timestamps
- Conservation or acquisition records with documented dates
- Provenance chains with supporting documents

Documented evidence is authoritative because:
- It was created when facts were fresh
- It typically has identified sources
- It can be examined for consistency and contradiction

Example: An exhibition catalog from 1995 listing a work is strong evidence. A handwritten note from Jeff dated "1995" is strong evidence.

#### Tier 3: Physical Artifact Examination — Moderate-High Authority

**The artwork itself can provide evidence when examined carefully.**

This includes:
- Materials visible in the work (collage materials, photographs, tape)
- Condition evidence (aging, deterioration patterns)
- Dimensions measured from extant work
- Stylistic analysis (when supported by surrounding context)

Physical evidence is authoritative because:
- The work cannot lie about its own materials
- Examination can verify claims
- Measurements are objective

Limitations:
- Visual inspection is not infallible (materials may be obscured)
- Stylistic dating is provisional without supporting evidence
- Condition does not guarantee date

Example: "The work incorporates compact discs and floppy disks" is observable. "Based on the style, this was made in the 1990s" is provisional.

#### Tier 4: Repository Records — Moderate Authority

**Institutional knowledge and accession history provide evidence.**

This includes:
- How the work entered the archive (date, source, condition notes)
- Where it has been stored and for how long
- Conservation history if any
- Inventory records

Repository records are authoritative because:
- They document institutional decisions and knowledge
- They are typically contemporaneous with the work's arrival
- They are more recent than the work itself

Limitations:
- They document the archive's knowledge, not the work's creation
- They may be incomplete or incorrectly recorded initially

Example: "Accession date 2024-05-15, received from artist's studio" is repository evidence.

#### Tier 5: Derivative Analysis — Moderate Authority

**Reasoned interpretation based on multiple sources is useful but provisional.**

This includes:
- Thematic analysis (identifying Guernica elements in a composition)
- Series grouping (identifying related works based on style and content)
- Chronological sequencing (placing undated works in order based on context)
- Inference (concluding likely date or materials from surrounding evidence)

Derivative analysis is authoritative only when:
- The reasoning is documented and transparent
- Multiple independent sources support the conclusion
- The interpreter's qualifications are clear

Limitations:
- Interpretation is subject to error
- Different interpreters may reach different conclusions
- Fashion in scholarship changes

Example: "This work is likely from the 1980s based on (a) similar materials in confirmed 1980s works, (b) Jeff's statement he was making intensively then, (c) the work's position in the catalog sequence." This reasoning is explicit and defensible.

#### Tier 6: AI-Organized Material — Lower Authority

**Artificial intelligence may organize and detect patterns but may not assert new facts.**

AI serves these functions:
- Organizing existing metadata (grouping by theme, sorting by date)
- Detecting inconsistencies (flagging when two records conflict)
- Suggesting questions (identifying gaps where evidence is needed)
- Summarizing documented information
- Verifying format consistency

AI does NOT serve these functions:
- Inventing new facts
- Inferring provenance
- Making curator judgments
- Assigning confidence levels
- Creating titles or descriptions not based on documented sources

Example (permitted): "This work shares materials with 12 other works categorized as 'collage'; should it also be assigned to that category?"

Example (prohibited): "Based on style analysis, this work was probably made in 1998."

---

## 4. BURDEN OF PROOF

Before any metadata is changed, added, or removed, the burden of proof must be met. The standard varies by the type of change.

### 4.1 Correcting Metadata

**Standard: Primary source evidence that existing metadata is wrong.**

To correct an error, you must:

1. Identify what is currently recorded
2. Provide evidence that it is incorrect
3. Cite the source of the correcting information
4. Document the change in version control with reasoning

Examples of adequate evidence:
- Jeff states the current date is wrong; the work is from a different decade
- An exhibition catalog documents a different title than currently recorded
- Visual inspection of the work contradicts materials listed
- Handwritten notes by Jeff correct a prior understanding

Example of inadequate evidence:
- "The materials list looks incomplete" (not wrong, just incomplete)
- "This doesn't seem like it was made in 2000" (speculation without evidence)
- A different curator's opinion (derivative analysis without documentation)

**Reversibility:** Corrections must preserve the prior metadata. Store both old and new values in version control, not just the change.

### 4.2 Adding Metadata

**Standard: Same as correcting (Primary source required).**

To add a new metadata field or value, you must have evidence that:

1. The information is factually accurate
2. The source of that information is documented
3. The source meets the Authority Hierarchy standard

Examples of adequate evidence:
- Jeff provides the information directly
- A contemporary document contains the information
- The work itself provides the evidence (visible materials, measurable dimensions)

Examples of inadequate evidence:
- "This work is probably part of this series" (derivative analysis without confirmation)
- "These materials are typical for this period" (inference without specificity)
- "It seems like this should be included" (preference or intuition)

**Exception for optional fields:** If a field is optional and documentation is minimal, it may be left empty rather than filled with provisional data.

### 4.3 Removing Metadata

**Standard: Evidence that the metadata is false, not merely uncertain.**

To remove recorded information, you must demonstrate:

1. The information is demonstrably incorrect
2. You have evidence of what should replace it (or that nothing should)

This is the highest standard because:
- Metadata should be cumulative, not destructive
- Removal erases knowledge
- Future custodians lose access to prior interpretations

**Permitted removals:**
- An entry that is demonstrably a duplicate
- Information proven false by new evidence
- Data that is corrupted or malformed

**Prohibited removals:**
- Information that is merely uncertain (preserve it; add confidence level)
- Information from prior custodians you disagree with (leave it; add your own assessment)
- Optional fields simply because they're incomplete (leave empty; don't delete)

**Default:** When in doubt, preserve what exists.

### 4.4 Changing Dates

**Standard: Documentary evidence or creator confirmation.**

Changing a date requires:

1. Documentary evidence (catalog, exhibition record, handwritten note with date)
2. OR creator confirmation (Jeff explicitly states the date)
3. The prior date must be preserved in version control
4. The reason for change must be documented

**For decade-bucketed dates (1970, 1980, etc.):**
- These are estimates, not assertions of specific years
- They may be refined if specific evidence emerges
- The estimate should be marked as such ("1970s est.")
- A specific year requires higher evidence standard

**For partial dates (year known, specific month/day unknown):**
- Record what is known; do not invent specificity
- Mark confidence appropriately

### 4.5 Changing Titles

**Standard: Documentary evidence or explicit creator confirmation.**

Changing a title requires:

1. Evidence that the current title is inferred or provisional
2. Documentary evidence of the authoritative title (exhibition catalog, Jeff's notes)
3. OR explicit confirmation from Jeff

**For untitled works:**
- If currently recorded as "Untitled (description inferred from visual)", preserve that marker
- If documentary evidence establishes an actual title, replace it and note the change
- If Jeff provides a title late, add it with the source and date provided

**For works with inferred titles:**
- Mark that the title is inferred: "Untitled (Figure on Red Ground) [inferred]"
- Only replace with documented title if evidence emerges
- Do not "improve" an inferred title; preserve what is recorded

### 4.6 Changing Series or Theme Assignment

**Standard: Creator confirmation or explicit documentary evidence.**

Series and theme assignments are curator judgments. To change them requires:

1. Creator confirmation (Jeff states the work is/is not part of this series)
2. OR documentary evidence (exhibition record showing series membership)
3. Reasoning must be documented

**Why this is strict:** Series membership fundamentally affects how the work is understood and accessed. Changing it without evidence scrambles historical understanding.

**Permitted additions:** Adding an additional theme or series assignment without removing the prior one (a work can belong to multiple themes).

**Problematic change:** Removing a long-standing series assignment without new evidence. If you believe an assignment is wrong, add a note; do not erase it.

### 4.7 Changing Materials

**Standard: Visual evidence or creator testimony.**

Materials are central to understanding the work. To change the materials list requires:

1. Visual inspection of the actual work (if it exists)
2. OR creator testimony about what materials were used
3. OR documentary evidence (conservation notes, artist's statement)

**For works that no longer exist:**
- Rely on creator memory and any photographs that survive
- Mark materials as "based on oral history" or "from photograph, partially visible"
- Preserve uncertainty about obscured or unclear materials

**For works where materials are partially visible:**
- Record only what can be verified
- Mark inferences separately: "Also contains [inferred from attached fragments]: …"

### 4.8 Establishing Provenance

**Standard: Documentary evidence for every claim.**

Provenance is the documented history of ownership and location. To record provenance, you must:

1. Document each transfer or location with evidence
2. Identify the source of each claim
3. Mark any gaps or uncertainties

**Permitted provenance claims:**
- "Created in artist's studio, 1990s (oral history)"
- "Exhibited in XXXIII Días, 2022 (documented in work titles)"
- "In artist's collection, 2024-present (archive record)"

**Prohibited provenance claims:**
- "Exhibited at [venue]" without documentation
- "Owned by [collector]" without evidence
- "Created as commission for [client]" without documentation
- Anything marking the work as "authenticated", "verified", or "certified" without authority to do so

---

## 5. CONFIDENCE LEVELS

Metadata must express how certain it is. The archive uses five confidence levels.

### 5.1 The Five Confidence States

#### Confirmed
**Multiple independent sources agree; creator explicitly affirms.**

Requirements:
- Two or more independent documentary sources, OR
- Creator explicit confirmation, OR
- Physical evidence verified by examination

Examples:
- A work titled in an exhibition catalog + Jeff confirms it
- A work's materials visible in photograph + confirmed in person
- Jeff explicitly states "I made this in 1990"

Duration: Confirmed information remains confirmed across custodian changes.

#### Probable
**Strong documentary evidence + creator memory; minor uncertainties resolved.**

Requirements:
- Contemporary documentary evidence (exhibition record, dated photograph) AND
- Creator memory corroborates it AND
- No contradictory evidence
- Small details may be estimated

Examples:
- "1990s work" based on (a) similar materials in documented 1990s works, (b) Jeff's memory of what he was making then
- "Collage" because exhibition catalog says so and work is visually consistent
- Title from exhibition catalog but Jeff has mild uncertainty about exact wording

Duration: Probable information may be refined with new evidence but is reliable for research.

#### Estimated
**Substantial evidence suggests this value; specific accuracy is uncertain.**

Requirements:
- Creator memory or documentary evidence covering the general scope
- Specific details are educated guesses
- Marked as estimate, not assertion

Examples:
- Year "1970" when Jeff says "early 1970s" but exact year unknown
- Materials "collage incorporating found objects" when constituent materials are unclear
- Series "Guernica" inferred from visual evidence, not explicit assignment

Duration: Estimated information may be replaced or refined.

#### Uncertain
**Some evidence exists but contradictions or gaps prevent confidence.**

Requirements:
- Conflicting sources that cannot be resolved without new evidence
- Partial information (materials partially visible in photograph)
- Creator memory is hazy ("might be from late 70s or early 80s")

Examples:
- Date range given as "1980–1990" when sources disagree
- Materials listed as "partially visible: appears to include fabric, unknown materials beneath"
- Title noted as "Jeff uncertain; possibly 'Guernica Study' or descriptive title"

Duration: Uncertain information is preserved exactly as recorded, allowing future custodians to add confidence if new evidence emerges.

#### Unknown
**No evidence exists; fact is not recorded.**

Requirements:
- Genuine absence of information
- Not confused with "not yet recorded" (which is also unknown, but actionable)

Examples:
- Dimensions: unknown (physical work unavailable for measurement)
- Original exhibition history: unknown (no records located)
- Specific creation date: unknown (creator has no memory)

Duration: Unknown information may be discovered and upgraded. The archive maintains a record of unknowns as information gaps worth investigating.

### 5.2 Representing Confidence

Confidence is recorded in metadata in these ways:

**In field values:**
- `year_display: "1970s (est.)"` — tells reader it's a decade estimate
- `date_precision: "estimated"` — explicit metadata field
- `materials: "Collage; specific materials partially visible"` — text qualification

**In separate confidence fields (if implemented):**
- `title_confidence: "confirmed"` — explicit confidence marker
- `date_confidence: "uncertain"` — explicit confidence marker

**In source notes (if implemented):**
- `date_source: "Oral history, 2026-06-09; Jeff uncertain about exact year"`
- `materials_source: "Physical inspection, 2024-05-15; some materials obscured"`

**Default representation:** If no confidence level is recorded, information should be assumed Probable (documentary evidence). Any lower confidence must be marked explicitly.

### 5.3 When Uncertainty Must Remain Visible

Some uncertainty should never be "resolved" by overwriting:

1. **Creator uncertainty.** If Jeff says "I don't remember," that uncertainty is preserved. It is not replaced with an estimate.

2. **Conflicting evidence.** If two sources disagree (Jeff's memory vs. exhibition catalog), both are recorded. The archive does not pick one winner.

3. **Partial information.** If materials are partially visible, the archive records what is visible and notes what is hidden, rather than completing the picture with guesses.

4. **Lost information.** If a work was lost before documentation, the loss is recorded exactly as known (materials visible in photograph, approximate scale, no other record).

**Principle:** Uncertainty preserved is more useful for future scholarship than false confidence.

---

## 6. PROVENANCE

Provenance is the documented history of an artwork. The archive records it carefully and narrowly.

### 6.1 What Provenance Means

Provenance in the JFSN Archive means: the documented record of a work's physical location, ownership, exhibition, and condition over time.

**In provenance:**
- Who owned it
- Where it was exhibited (with documentation)
- Conservation or alteration history
- Changes in location
- Known photographs or records

**Not in provenance:**
- Interpretations of meaning
- Aesthetic judgments
- Attributions of influence or importance
- Speculative ownership (works that might have been owned by someone)
- Intentions or purpose assigned after the fact

### 6.2 Documentary Evidence Standard

Provenance claims must be documented. The archive uses this hierarchy:

**Certain provenance:**
- Documented with primary source (exhibition catalog, invoice, accession record)
- Corroborated by multiple independent sources
- Example: "Exhibited at XXXIII Días, 2022 (documented in exhibition record and work titles)"

**Probable provenance:**
- Documented with primary source but not independently corroborated
- Example: "In artist's possession, 2024 (archive accession record)"

**Speculative provenance:**
- Not recorded in the archive
- Example: "Might have been seen by Rauschenberg" — NO

### 6.3 Lost Provenance

When documentation is missing, the archive records what is NOT known:

Example: "No exhibition record located prior to 2022. Work may have been exhibited earlier; documentation not found."

This is more valuable than inventing a provenance ("Local exhibition, circa 1995 [unconfirmed]").

### 6.4 The Lost Works Register

Works known to be lost are part of provenance. The archive maintains a Lost Works Register recording:

- Documented lost works (e.g., water damage, 500–1,000 works)
- Known characteristics (scale, materials visible in photographs, maker's description)
- Date and cause of loss
- Information sources
- What exists (photographs, memory, fragments)

Example entry:
```
Lost Work: Untitled (Guernica Interpretation, Full Scale)
Created: Unknown decade (post-1970, made in home studio basement)
Scale: Approximately 11 ft × 25 ft (est.)
Materials: Mixed media collage on flexible material (rolled, not stretched)
Loss: Water damage, 2020, during storage
Status: No photograph exists. Artist memory only.
Source: Oral history, 2026-06-09
```

The absence of this work is as much a historical fact as the presence of the 1,084 works that survive.

---

## 7. CREATOR TESTIMONY

Jeff's testimony about his own work is the highest authority. It must be handled carefully.

### 7.1 When Creator Testimony Is Authoritative

Creator testimony is highest authority when:

1. **Explicit about personal intention.** "I made this as a response to [X]" — only Jeff can know this
2. **Direct memory of creation.** "I used prism paper from art school" — Jeff was there
3. **Confirmation of existing metadata.** "Yes, that title is correct" — authoritative confirmation
4. **Explicit series assignment.** "This is part of my Guernica series" — only maker knows series boundaries
5. **Materials and technique.** "I built this with [materials]" — creator is expert witness to their own work

### 7.2 When Creator Testimony Should Be Qualified

Creator testimony is provisional when:

1. **Distant memory.** Jeff is describing events 50+ years past with uncertainty ("I think it was…", "probably", "might have been")
2. **Incomplete recall.** "I don't remember the specific year" — absence is more reliable than invention
3. **Changed work.** A piece reworked multiple times ("I may have added to this later") — memory of original state is provisional
4. **Series membership uncertain.** "This might be part of that series but I'm not sure" — less authoritative than explicit assignment
5. **Stated uncertainty.** When Jeff says "I can't recall" or expresses doubt, that doubt is part of the record

### 7.3 Documenting Creator Testimony

Every significant creator testimony is documented:

1. **Recorded.** Oral history sessions are recorded (audio or detailed notes)
2. **Dated.** Every piece of testimony includes the date it was given
3. **Contextualized.** The circumstances matter (Was Jeff tired? Was this recalled under pressure? Was there time for reflection?)
4. **Preserved exactly.** Direct quotes are preserved verbatim, not paraphrased
5. **Uncertainty preserved.** If Jeff was uncertain, that uncertainty is recorded

Example:
```
Creator Testimony, 2026-06-09:
"I made a full-size version of Guernica in the basement. It was rolled material, 
flexible. It was about time — I'd been working with Guernica for so long. 
But I don't really think about it much now."

Source: Oral history session 4, recorded audio available
Confidence: Confirmed (direct testimony) regarding existence and scale
Confidence: Estimated regarding year (not specified; likely 1990s based on context)
Confidence: Uncertain regarding current condition (piece was lost in water damage)
```

### 7.4 Conflicting Testimony

If creator testimony changes or conflicts (Jeff remembers two different dates for the same work, for example):

1. **Record both.** The archive preserves the conflict
2. **Document dates.** Note when each version was stated
3. **Don't force resolution.** The conflict is useful information about memory
4. **Preserve original.** Do not replace earlier testimony with later revision

Example:
```
Date: 1970 (oral history 2026-06-08)
Date (revised): 1972 (oral history 2026-06-10)

Revision note: "Initially recalled as 1970, upon reflection recalls as early 1970s, 
possibly 1972. The earlier guess and later reflection are both recorded. 
Confidence: Estimated decade range 1970–1972."
```

### 7.5 What Creator Testimony Cannot Establish

Creator testimony is not authoritative for:

- **Authenticity of attribution.** Jeff may attribute a work to himself that was collaborative or assisted
- **Objective facts he didn't witness.** "This sold for a lot of money" — only if he observed the sale
- **Others' intentions or knowledge.** "The buyer understood my concept" — he cannot speak for others
- **Lost works' current condition.** "I wonder what happened to it" — speculation, not testimony

---

## 8. AI POLICY

Artificial intelligence may participate in archive stewardship under strict constraints.

### 8.1 What AI May Do

AI serves these archival functions:

**Organization:**
- Group works by theme, medium, or date
- Sort catalog by ID, year, or title
- Generate index pages
- Extract metadata structure from documents

**Detection:**
- Flag contradictions (e.g., "title in catalog A says X, title in catalog B says Y")
- Identify missing required fields
- Detect duplicate records
- Verify format consistency (e.g., all years are integers)

**Suggestion:**
- "These 12 works share similar materials; should they share a theme?"
- "This work is titled with XXXIII Días; other works with this title cluster together"
- "You have three different dates recorded for this work; which is authoritative?"

**Summary (with caveats):**
- Summarize documented information ("This work is documented in three exhibitions")
- Do NOT invent additional context
- Reference original sources directly, not through AI synthesis

**Transcription:**
- Convert handwritten notes to text (with proofreading by human)
- Extract structured data from documents
- Organize oral history transcripts

### 8.2 What AI Must Never Do

AI is prohibited from:

**Inventing facts:**
- Creating titles for untitled works beyond "Untitled"
- Assigning dates when none are documented
- Suggesting materials not visible or documented
- Inferring a work's purpose or meaning

**Making curator judgments:**
- Assigning series membership without evidence
- Deciding whether works are "important" or "representative"
- Interpreting thematic relationships as curator assignments (may suggest, not assign)
- Marking works with quality descriptors

**Fabricating confidence:**
- Marking uncertain information as "confirmed"
- Claiming certainty for inferred data
- Removing uncertainty markers
- Creating false consensus from partial evidence

**Inferring provenance:**
- Claiming to know ownership history without documentation
- Suggesting exhibition history without catalogs
- Connecting unrelated works into false narratives
- Making assumptions about market value or prestige

**Processing creator testimony:**
- Paraphrasing or summarizing quoted testimony (preserve verbatim)
- Inferring intent from words used
- Correcting what creator said
- Adding interpretation to creator's statement

### 8.3 AI Transparency

Any AI-generated material in the archive is:

1. **Clearly marked.** "Generated by [algorithm/model] on [date]"
2. **Auditable.** The prompts and instructions are documented
3. **Reversible.** Original information is preserved; AI output is supplementary
4. **Supervised.** A human curator reviews AI work before it enters the archive
5. **Versioned.** Changes to AI methods are tracked

Example (acceptable):
```
Title: Untitled (Figure, Blue Ground)
Description: Vertical mixed-media collage on red ground...
[Generated: Computer vision analysis of image, 2026-05-15, reviewed by curator]
```

Example (prohibited):
```
Title: Cassette Torso Arrangement #3
[AI inferred the title from visual content; no documentation provided]
```

---

## 9. STEWARDSHIP RULES

These rules guide every decision by every custodian.

### 9.1 The Core Rules

**Rule 1: Every change has a reason documented in version control.**

No metadata is changed without explanation. The commit message includes:
- What was changed
- Why it was changed
- What evidence supports the change
- Who made the change and when

Example:
```
git commit -m "Correct date for art0582 to 2022 (confirmed), not 2020 (estimated)

Evidence: XXXIII Días exhibition catalog, 2022
Source: Exhibition records + artwork titles reference XXXIII Días 2022
Confidence: Confirmed (documentary evidence)
Custodian: [name], 2026-07-12"
```

**Rule 2: When in doubt, leave it untouched.**

If you are uncertain whether a change is justified, do not make it. Instead:
- Note the question
- Document what evidence would be needed
- Leave the metadata as-is for the next custodian

This preserves the archive's integrity across custodian transitions.

**Rule 3: Preserve prior information.**

When correcting or updating metadata:
- Do NOT delete what was previously recorded
- Add the correction alongside the prior record in version control
- Version control history shows the evolution

**Rule 4: Uncertainty must remain visible.**

Do not:
- Replace uncertain dates with guesses
- Complete partial information with inference
- Mark provisional data as confirmed
- Remove confidence qualifiers

If data must be updated, add confidence levels without removing uncertainty.

**Rule 5: Lost works are part of the archive.**

Works known to be lost are documented in the Lost Works Register with:
- What is known about them
- How they were lost
- What evidence remains
- Information sources

Absence is a fact.

**Rule 6: Creator memory takes precedence over interpretation.**

If Jeff's memory conflicts with a previous curator's interpretation:
- Preserve both in the record
- Mark which is creator testimony and which is interpretation
- Do not let interpretation erase creator knowledge

**Rule 7: Future custodians inherit uncertainty.**

When handing off the archive to the next custodian:
- Document what is known confidently
- Document what is estimated
- Document what is unknown
- Document what questions remain unanswered

The archive is not "finished." It is maintained with integrity across generations.

### 9.2 Before Changing Metadata, Ask These Questions

Every prospective change should satisfy these questions:

1. **Is there evidence?** What source documents this claim? (Authority Hierarchy)

2. **Is it certain enough?** Does the evidence meet the Burden of Proof standard? (Section 4)

3. **What confidence level is appropriate?** (Section 5)

4. **What will be lost if I make this change?** Will any prior information be hidden?

5. **What will be gained?** Does this change serve scholarship, preservation, or access?

6. **Is this a correction (something was wrong) or an addition (something was missing)?** Each has different standards.

7. **Can I document this in version control?** If I cannot explain it clearly in a commit message, I probably should not make it.

8. **Would the next custodian understand why this was done?** 

9. **Is there any chance future evidence will contradict this?** If so, how certain am I?

10. **Am I the right person to make this decision?** Do I have sufficient authority (creator? registrar? scholarship credentials)?

**If you cannot answer these questions confidently: do not change the metadata.**

---

## 10. LONG-TERM PRESERVATION

The archive must survive institutional transitions, technology change, and decades of stewardship.

### 10.1 Principles of Durability

**The archive is substrate-independent.**

Metadata is:
- Stored in open formats (JSON, plaintext, XML, not proprietary databases)
- Free of software-specific encoding or dependencies
- Documented in standards that outlive particular tools
- Organized around conceptual relationships, not technical structures

**The archive is self-documenting.**

Someone reading the archive 50 years from now should understand:
- Why each piece of metadata exists
- What evidence supports it
- What confidence level it has
- What questions remain unanswered

**The archive is version-controlled.**

All changes are tracked in git with:
- Commit messages documenting reasoning
- Ability to see what was changed and when
- Ability to recover prior states
- Provenance of every decision

**The archive is human-readable.**

Metadata can be read by a human without specialized software:
- JSON files can be opened in a text editor
- Confidence levels are spelled out ("estimated"), not encoded
- Sources are documented in human language
- Schema is simple and comprehensible

### 10.2 Metadata as Constitutional Record

This document itself is part of the archive:

1. **Stored with the metadata.** This constitution is version-controlled alongside the catalog
2. **Updated when necessary.** If future custodians clarify these principles, they do so transparently with dated amendments
3. **Amendments are additions.** Prior versions remain in git history; new principles are added, not substituted

Example future amendment:
```
Amendment, 2040-xx-xx:
"Section 4.2 revised to include Digital Image Evidence as Tier 3 
(previously absent in 2026 version). Reason: High-resolution 
image analysis now widely available; authority of pixel-level 
inspection established through scholarship."

Original language preserved in git; change dated and reasoned.
```

### 10.3 Migration Across Platforms

When the archive must migrate to new software or platforms:

1. **Metadata structure remains identical.** The JSON schema is copied exactly
2. **No data is lost or simplified.** Every field is preserved
3. **Confidence levels are preserved verbatim.** "estimated" stays "estimated"; it is not converted to a code
4. **Version history is carried forward.** All prior commits are available
5. **This constitution remains authoritative.** New software must conform to these principles

### 10.4 Catalogue Raisonné Publication

If the archive's metadata is ever published as a formal Catalogue Raisonné:

1. **Confidence levels must be visible.** No "confirmed" information is presented without marking what remains estimated
2. **Sources must be cited.** Every fact is traceable to its evidence
3. **Uncertainties are acknowledged.** Unknown elements are noted, not hidden
4. **Lost works are documented.** Absences are part of the historical record

### 10.5 Institutional Donation or Transfer

If stewardship of the archive is transferred to an institution:

1. **This constitution governs the transfer.** The receiving institution inherits these principles
2. **Metadata is not re-curated.** Existing metadata is accepted as-is; new stewards add their own findings alongside
3. **Version control is preserved.** Git history is complete; prior decisions are transparent
4. **Creator testimony is paramount.** If institutional policies conflict with Section 7 (Creator Testimony), creator testimony prevails

---

## 11. AMENDMENTS AND GOVERNANCE

This constitution may be amended. Amendments follow these principles:

### 11.1 Amendment Process

1. **Proposed in writing.** Any custodian may propose amendment; reasoning must be documented
2. **Justified in detail.** The proposal explains why the current rule is inadequate
3. **Evidence-based.** The proposal is not preference; it responds to real archival need
4. **Transparent.** Amendment is a dated git commit; prior language is preserved
5. **Minimal.** Only the affected section is revised; rest of constitution remains stable

### 11.2 Authority to Amend

Amendments are made by:
- **Creator (Jeff Neumann)** — highest authority for changes affecting Section 7, creator testimony, or fundamental principles
- **Designated custodian** — the person formally responsible for archive stewardship
- **Collegial consultation** — major amendments warrant input from family members, scholars, or archivists

Amendments are NOT made unilaterally by temporary editors or volunteers.

### 11.3 Principle Preservation

Amendments must not contradict the founding principles (Section 2):
- Truth over narrative
- Unknown is preferable to invented
- Preserve uncertainty
- Evidence takes precedence

If an amendment would weaken these principles, it is not approved.

---

## 12. GLOSSARY

**Authority:** In metadata, the source of a fact's credibility. See Authority Hierarchy (Section 3).

**Burden of Proof:** The standard of evidence required before metadata is changed. Standards vary by type of change (Section 4).

**Confidence Level:** The degree of certainty about a piece of metadata. Five levels defined (Section 5).

**Composite (flag):** A work marked as an imagined placement or Photoshop composition, not a documentation of physical exhibition.

**Confirmed:** Metadata supported by multiple independent sources or creator explicit confirmation (Section 5).

**Creator Testimony:** Jeff's direct statements about his own work. Highest authority (Section 7).

**Derived Metadata:** Information computed from other metadata (e.g., orientation from image dimensions).

**Estimated:** Metadata based on strong evidence but specific details uncertain (e.g., "1970s" for decade-bucketed year).

**Lost Works Register:** Formal record of works known to be destroyed, lost, or unavailable.

**Metadata:** Factual information about artworks (title, date, materials, series) — not interpretation or opinion.

**Orphan Record:** A metadata entry with no corresponding work (prevented by archive design).

**Provenance:** Documented history of a work's location, exhibition, ownership, and condition.

**Sidecar:** Individual JSON file containing metadata for one work.

**Uncertain:** Metadata conflicting evidence or gaps prevent confidence.

**Unknown:** Metadata for which no evidence exists.

---

## 13. EFFECTIVE DATE AND AUTHORITY

**Effective Date:** This constitution is effective 2026-07-12.

**Authority:** This document is adopted by Jeffrey F. S. Neumann Archive stewardship as the governing framework for all metadata decisions.

**Revision Control:** Stored in `JFSN-Archive/METADATA-STEWARDSHIP-CONSTITUTION.md` in version control. All amendments are dated and justified.

**Successor Adoption:** Each new custodian inherits this constitution and is bound by it. Amendments occur through the amendment process (Section 11), not unilaterally.

---

## CLOSING

The archive exists to preserve the historical record of Jeff's work across fifty years. That record is entrusted to you.

You inherit:
- 1,084 documented works
- Complete version history
- Creator testimony
- Conservative metadata practices
- A commitment to truth over narrative

Your responsibility is:
- To preserve what you inherit with integrity
- To document your changes clearly
- To leave the archive in better condition for the next custodian
- To hold creator memory and evidence as sacred

**The work speaks first. Metadata serves the work. Stewardship is responsibility, not authority.**

---

**Custodians across time:** Read Section 2 (Founding Principles) before making any metadata decision. The principles are your guide.

**Addendum:** If you are reading this 20 or 50 years after it was written, and the archive is still intact, you have honored your stewardship. Thank you. Leave it better than you found it.

---

**End of Constitution**

*Established 2026-07-12*  
*Archive: Jeffrey F. S. Neumann*  
*Custodian: Claude Code (Stewardship Phase)*  
*Next Custodian: [Unknown; to be named]*

