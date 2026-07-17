# Session 29 Checkpoint — Archival Investigation & Oral-History Strategy

**Date:** 2026-06-10
**Session type:** Research and documentation only. No site pages, CSS, JS, or catalog files were modified. Nothing needs deploying.
**Written for:** A future contributor who has never seen the conversation that produced this. Everything of value from that conversation is preserved in this file and in `docs/oral-history/master-notes.md` §§20–24.

---

## 1. Work Completed

Seven analyses, in order:

1. **Site UX review** (6 findings) — mobile identity gap on index.html, hidden serendipity mode, one-directional story↔artwork linking, archive.html sequential-only access, monolithic JSON scaling, timeline.html as unbuilt spine. Recommendations only; none implemented this session.
2. **Legacy/preservation review** (6 findings) — voice provenance unmarked on site, no physical-status metadata, design career undocumented, no rework states, no studio documentation, no audio of Jeff's voice.
3. **Knowledge-gap audit** — written into master-notes.md as **§20**. First catalog data analysis: decade-bucketed dating, the XXXIII Días title cluster, the near-empty 1980s, the 328-photograph practice, zero sentences by Jeff about any individual work.
4. **Archival investigation** (10 findings) — written into master-notes.md as **§21**. Second data analysis: war imagery prevalence, "Buy Me" titles, wall snowmen, the apparent 2000s exhibiting period, anachronistic materials, the painting hiatus, block sculptures, Tracings, Christmas works, "Guernica London Spain."
5. **Creator correction processed** — written into master-notes.md as **§22**. See section 3 below. This is the session's most important event.
6. **Misinterpretation-vulnerability analysis** (10 findings) — preserved in section 7 below (was conversation-only).
7. **Question-strategy audits** — written into master-notes.md as **§23** (15 sole-source facts, ranked by recoverability) and **§24** (15 craftsman/custodian questions the interview record never asks).

---

## 2. New Historical Findings

All from catalog.json (1,084 records) data analysis. Re-runnable with python3/json.

### Confirmed (data facts)

- **Dating is decade-bucketed:** 1,075 of 1,084 works carry round years (56 at "1970," 11 at "1980," 193 at "1990," 273 at "2000," 302 at "2010," 240 at "2020"). Only 9 works have specific years (1976, 1977, 2004, 2012×2, 2013×2, 2017, 2022).
- **Anachronistic materials:** three works dated 1970 contain compact discs (post-1982 technology): art0001, art0145 "Felix Double Disc," art1026 "Silk Torpedo Intervention." Also art0085 "Merry Christmas 2013, Black" sits in the 2000 bucket. Proof of misdating and/or physical reworking.
- **Dominant motifs:** compact-disc 597 works, concentric-rings 580, target 459, bullseye 293, warplane (top-down + side + roundel) ~460, photographic-face 268, american-football 178, chess-piece 125, numerals 195.
- **Hidden themes (in catalog, no site presence):** Studio 87 works (46 in 2020s), Art School 52 (51 in 1970 bucket), Tracings 12 (10 in 2020s). Gallery theme: 149 works (80 in 2000s, 54 in 2010s).
- **Painting hiatus:** paintings per decade: 10 / 4 / 0 / 0 / 7 / 21. Zero paintings in the 1990s and 2000s; half of all surviving paintings made after age 65.
- **"Buy Me" recurs across three decades:** art0518 (1990), art0762 (2010), art0937 (2012).
- **Street-art keyword cluster:** 41 photographs (40 in 2010s) keyworded street-art/paste-up/stencil/tag-on-other-work, including "Reaper, Snowman," "Star of David, Snowman," "Sticker Wall, CAID." `tag-on-other-work` is the catalog's most common keyword.
- **XXXIII Días cluster:** 16 works, including "XXXIII Aunt Mary" and multiple "Installation View" titles, ~2022.
- **1970s sculptures are painted block constructions** ("Painted Block Wall," "Chromatic Block Grid," "Painted Block Pyramid") — formalist, unlike everything later.
- **Metadata coverage:** dimensions exist on 1 of 1,084 works; `materials` empty on 246; 463 titles are "Untitled (…)" form; all 1,084 descriptions are machine-written; favorites.txt is bare IDs with no rationale recorded anywhere.
- **One design artifact in the art catalog:** art1078 "Design: Electrical Gulf Cart" (1976).

### Plausible but unconfirmed (interpretations — DO NOT publish without Jeff)

- The target/warplane corpus as war commentary (production peaks in the 2000s, the Iraq decade; "Face of Death V" dated 2004).
- Mr. SNOWmann as alter ego (SNOWmann/Neumann) and/or street character.
- "Buy Me" as inscribed plea contradicting stated indifference to selling.
- "Guernica London Spain" (art0507, 2017) as evidence of travel to see the painting.
- "Merry Christmas 2013, Black" as marking a dark family year.
- The Photoshop composites as expressions of wanting-to-be-shown (this reading is *strengthened* by the correction below, but remains interpretation).

### Withdrawn or corrected

- **"A sustained exhibiting period in the 2000s" — WITHDRAWN** (§21 finding 4). The Gallery-themed works document a compositing practice, not shows.
- **"An exhibition happened and is unrecorded" (XXXIII Días) — DOWNGRADED to open question** (§20). May be wholly or partly imagined.
- **Mr. SNOWmann street practice — DOWNGRADED to Low confidence** (composites make digital placement equally plausible).

---

## 3. Creator Corrections

**One correction, with large blast radius (2026-06-10, recorded verbatim in master-notes §22):**

Many of the gallery/installation/crowd/exhibition-view images are **Photoshop composites** — Jeff inserted his own artwork into existing galleries, museums, exhibition photographs, public spaces, and other people's installations. They are visualizations, imagined placements, artistic experiments, or presentation studies — **not documentary evidence of actual exhibitions.**

**Why it matters:**
- Two independent analyses in one day constructed a false exhibition history from these images. A future researcher with less context would do the same with confidence.
- It establishes a previously unknown fact: Jeff has a **digital compositing practice** (~149 Gallery-themed works, concentrated 2000s–2010s), undocumented in the oral history and misclassified as "photograph" in the catalog's work_type field.
- It does NOT touch the findings that don't depend on installation images being real (war imagery, Buy Me, anachronisms, painting hiatus, block sculptures, Tracings, Christmas works).
- The standing rule it produced (§22): **in this archive, an image of an event is not evidence the event occurred. Verify with the artist before treating any image as a record.**

---

## 4. Knowledge Gaps Identified

Full ranked inventories: master-notes **§20** (10 items), **§23** (15 sole-source facts), **§24** (15 craftsman questions). Top of the combined ranking by recoverability risk — items with **zero** alternative recovery routes if Jeff never answers:

1. **What the 500–1,000 lost works were** — no inventory, no photos, no other witness.
2. **What the Guernica-scale painting (~11×25 ft) looked like** — seen by no one, ever. (Its *year* is already lost — Jeff answered "don't know"; do not re-ask. Same for the CIA sculpture's location.)
3. **Whether any physical exhibition ever happened, anywhere, in fifty years** — including whether XXXIII Días had a physical component.
4. **What XXXIII Días means, and who Aunt Mary is in it.**
5. **Which marks in the 31 collaboration works belong to which grandchild.**
6. **Which faces in the 268 photographic-face works are family.**
7. **What happened in the 1980s** (destroyed / dispersed / not made).

Below these: reworking history, titles authorship, wall snowmen, dispersed-works holders, "Buy Me" authorship, Guernica pilgrimage, block sculptures' fate, composites' purpose (§23 items 8–15), and the entire craftsman layer — adhesives/supports, signatures, fate of failures, the material morgue, digitization provenance, sketchbooks, economics, physical adaptation (§24).

Separate from interview gaps: **no audio or video of Jeff exists in the archive.** The entire oral history is typed. Ten minutes of his voice is the cheapest irreplaceable capture available.

---

## 5. Repository Changes

| File | Change | Purpose / Impact |
|------|--------|------------------|
| `docs/oral-history/master-notes.md` | "Last updated" bumped to 2026-06-10 | Currency of the primary source |
| `docs/oral-history/master-notes.md` | **§20 appended** — Knowledge-Gap Audit (data findings + 10 ranked questions) | First data-driven gap inventory; surfaced XXXIII Días, dating buckets, the 1980s |
| `docs/oral-history/master-notes.md` | **§21 appended** — Archival Investigation (10 findings, evidence/interpretation split) | Contradictions and anomalies record; warning banner added after §22 |
| `docs/oral-history/master-notes.md` | **§22 appended** — Creator Correction (composites) | Supersedes parts of §20/§21; itemizes what is withdrawn vs. untouched; states the verify-with-artist rule. **Read before trusting anything in §20–21.** |
| `docs/oral-history/master-notes.md` | **§23 appended** — Sole-Source Facts (15, ranked by recoverability) | The interview priority list for facts with one living source |
| `docs/oral-history/master-notes.md` | **§24 appended** — Craftsman Questions (15) | The overlooked craft/custodian layer; designed as low-risk session openers |
| `docs/SESSION-29-CHECKPOINT.md` | **Created** (this file) | Durable handoff of the session |

No site pages, no catalog files, no scripts, no CSS/JS were touched. `sw.js` CACHE_V untouched. **Reminder carried forward from session 28: sessions 25–28 are committed to GitHub but NOT deployed to HostGator — run JFSN.app.**

---

## 6. Outstanding Research Threads

1. **The composite practice** — extent, origin date, purpose, whether any were ever submitted anywhere. Evidence: §22; 149 Gallery-themed works. Confidence that the practice exists: certain (creator-stated). Everything else: unknown. *Matters because* ~14% of the catalog is currently misread as documentation.
2. **The war-content reading** — targets/warplanes/bullseyes across ~40–60% of post-1990 work, peaking in the 2000s. Confidence: pattern High, meaning Medium. *Matters because* it would reframe what the entire archive is about.
3. **The recognition tension** — "Buy Me" titles, imagined exhibitions, vs. the stated "you were supposed to want them." Confidence: Medium. *Matters because* it's the central biographical question in material form. Handle per §22's rule: hold the catalog and the voice as two true primary sources; edit neither to match the other.
4. **The 1980s** — see §23 item 7. Confidence in the gap: High; explanation: none yet.
5. **Tracings** — a new method emerging in the 2020s bucket, observable in real time. Confidence: cluster High. *Matters because* late-style shifts are only explainable while they're happening.
6. **The block sculptures → collage turn** — the untold first transition, ~1970s. Confidence: cluster High, sequence Medium.
7. **The street photographs** — physical paste-ups vs. composites vs. documentation of others (Robin Rhode appears in one title; "CAID" suggests Detroit). Confidence: Low until asked.

---

## 7. Risks and Warnings — Where This Archive Will Be Misread

These ten vulnerabilities were identified after (and partly because of) being misled twice in one session. Ranked by risk:

1. **Composite installation views read as exhibition documentation.** The homepage hero is "XXXIII Días Installation View · 2022" — a possibly imagined event, presented without comment. Highest-risk misread in the archive; it already happened twice.
2. **AI-written titles and descriptions read as the artist's words.** All 1,084 descriptions are machine-generated; title authorship is unestablished. Never quote catalog text as Jeff's voice. (Also: why-i-made-things.html is a synthesized essay Jeff confirmed "feels true" — not his writing. stories.html quotes ARE verbatim.)
3. **XXXIII Días repeated as a real 2022 show** — especially as family lore. Status: open question.
4. **The street photographs given a single confident reading.** Three biographies are possible; none is established.
5. **Decade-bucket years read as dates.** A work "dated 2010" was made sometime in that decade, maybe.
6. **Catalog images read as original states.** Works may have been physically reworked decades after their assigned year ("could be unfinished till the end" is method).
7. **work_type "photograph" (328 works) read as one practice.** It conflates photographic artworks, incidental records, and Photoshop composites (which are closer to digital collage).
8. **Theme names ("Targets," "Framed," "Torsos & Faces") read as Jeff's own categories.** Authorship of the taxonomy is unestablished; only "Guernica" is confirmed as his framework.
9. **The 45 favorites read as a best-of canon.** Selection criteria unrecorded; could be sentimental, aesthetic, or arbitrary.
10. **catalog.json/the API read as the oeuvre.** The data layer carries no marker that >50% of the life's work was destroyed and more was dispersed. Quantitative studies using the JSON alone will mistake the survivors for the output.

**Standing rules:** (a) §22 — verify with the artist before treating any image as a record; (b) §21 header — interpretations must never be written into site pages without Jeff's confirmation; (c) when Jeff says "boring/next," move on — spare answers are the voice.

---

## 8. Recommended Next Session

**The exhibition/composite clarification, recorded as audio if Jeff permits.**

One factual question — *"In fifty years, was your work ever physically on a wall in public — even once — and where? And the installation images: which, if any, show something that happened?"* — followed, if energy remains, by §23 item 1 (describe one lost work, visually).

Why this outranks the alternatives:

- **It gates everything.** The recognition narrative, the treatment of 149 works, the XXXIII Días story, and the top misinterpretation risk all hang on one binary, low-emotion, factual answer. No other single question de-contaminates as much.
- **The door is open now.** Jeff volunteered the composites correction himself this session — the topic is warm, and oral history runs on momentum.
- **It's cheap.** Ten minutes, no "boring/next" risk, and it converts the archive's most dangerous ambiguity into settled fact.
- The lost works (§23 item 1) are the *biggest* gap but a heavier session; the craftsman questions (§24) are ideal warm-ups any session. Neither is blocked by waiting; the exhibition question blocks correct understanding of the catalog every day it stays open.

---

## 9. State of JFSN

**Strengths.** 1,084 works cataloged with zero errors and full image coverage; an active oral-history practice with a disciplined primary-source document (verbatim quotes, marked interpretation, append-only corrections); narrative pages in Jeff's confirmed voice; redundant backups (GitHub, external drive, Backblaze B2); a creator who is alive, lucid, and answering questions.

**Weaknesses.** The interpretive layer is fragile: machine-written metadata is indistinguishable from creator testimony to an outside reader, dating is estimated, and the catalog's images can depict imagined events — a combination that *actively generates* false narratives (demonstrated twice this session). The physical collection is under-documented in exactly the ways the website can't fix: no conservation facts, no signature record, no storage map, no dimensions. And the archive contains no recording of Jeff's voice.

**Preservation priorities, in order:** (1) Jeff's testimony on the §23 sole-source facts — the only knowledge with a single living copy; (2) ten minutes of audio — the cheapest irreplaceable object the archive lacks; (3) the craftsman layer (§24), especially construction materials and signatures, on which the physical works' future depends; (4) everything else. The website is in good shape. The race is not against the software — it is against time with the one source every open question shares.

*End of checkpoint. Companion document: `docs/oral-history/master-notes.md` §§20–24, same date.*
