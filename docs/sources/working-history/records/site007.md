# Working History Record — site007

**Status:** curatorial record complete. Not sanitized. Not published.

---

## Identification

- **Working History ID:** `site007`
- **Title:** "Hi, I'm Sebastian!" (confirmed directly from the page's own masthead text, as the inventory already states)
- **Approximate date:** capture date **known precisely** — `hts-log.txt` records: *"HTTrack3.49-2+htsswf+htsjava launched on Thu, 18 Nov 2021 09:23:48 at https://jfsn.myportfolio.com/"*, completing "in 1 minutes 11 seconds: 180 links scanned, 179 files written." The mirror's own local save path, logged in the same command line, was `C:\sebastians new test site\seb` — a Windows path, evidence of the machine used to run the mirror, not a claim about the site's own creation date. The site's actual live/creation date remains **unknown** — the inventory's existing note that this is unresolved still stands; nothing in this pass narrows it further.
- **Type:** family-collaboration
- **Thread(s):** family-collaboration

---

## Purpose

An Adobe Portfolio (`myportfolio.com`) gallery site presenting Sebastian's creative output as individually-titled pages, one per piece — matching the inventory's existing description. Direct inspection this session confirms and expands the page-title list: real, subject-titled content pages include `ape.html` ("Gorilla"), `dragon.html` ("Dragon"), `moose.html` ("Moose"), `rhinoceros.html` ("Rhinoceros"), `parrot.html` ("Parrot"), `elephant-1.html` ("Elephant"), `nice-bird-eating-spider.html` ("Nice Bird-Eating Spider"), `stick-man.html` ("Stick Man"), `face-collage.html` ("Face Collage"), `drawing.html` ("Drawing"), `funny-grandma.html` ("Funny Grandma"), `untitled-with-grandpa.html` ("Untitled With Grandpa"), `something-about-poop.html` ("Something About Poop"), plus two Adobe-Portfolio-hashed-URL pages: `1619437a90452d.html` ("Diplodocus") and `1619437ea87bbf.html` ("Dragon team: Toothless"). Alongside these, roughly two dozen placeholder-named pages (`bbb.html`, `bbb-1.html`, `cc.html`, `ccc.html`, `jjj.html`, `jjj-1.html`, `kkk.html`/`kkk-1.html`/`kkk-2.html`/`kkkkk.html`, `llll.html`/`llll-1.html`/`llll-2.html`, `mmm.html`, `mmmm.html`/`mmmm-1.html`/`mmmm-2.html`, `mjjkjj.html`, `sccssc.html`, `sdvsdvds.html`, `xxx.html`, `zzz.html`/`zzz-1.html`, `dear.html`, `untitled.html`/`untitled-1.html`) carry generic Adobe Portfolio template titles rather than subject names — these read as scaffold/draft pages within the same Portfolio account, not documented content.

**Confirmed cross-reference to `site003`:** "Dragon team: Toothless" is not only a standalone page title here — it also appears as an image caption inside `site003`'s `legos.html`. This is a direct, specific confirmation of the continuation relationship the inventory already asserts, beyond the general "shared subject matter" framing — the same named piece appears in both records.

---

## Technologies

- Adobe Portfolio platform (`myportfolio.com`), captured via **HTTrack Website Copier 3.49-2** (`hts-log.txt`, `hts-cache/`), confirmed unchanged from the inventory.
- **No server-side code of any kind** — `find . -iname "*.php"` returns zero results anywhere in this folder. This is architecturally different from every Muse-based record in the collection (`site002`, `site003`, `site005`, `site006`): Adobe Portfolio is a fully-hosted SaaS platform, and this capture is a static HTML mirror of it, not an export containing the platform's own server code.
- The folder contains **two near-duplicate mirror trees**: a flat set of files at the top level, and a nested `jfsn.myportfolio.com/` folder containing the same page set. Direct `diff` of `index.html` against `jfsn.myportfolio.com/index.html` found only one trivial difference (a single image filename variant, `_carw_202x158x323300.jpg` vs `_car_202x158.jpg`) — otherwise identical. This is HTTrack's standard mirror-plus-domain-folder output structure, not two independently-authored copies.
- Seven `pro2-bar-s3-cdn-cf*.myportfolio.com/` folders (`cf`, `cf1`–`cf6`, 6–27 files each) and a `use.typekit.net/ik/` folder — these are **locally-mirrored copies** of Adobe's own asset CDN and Adobe Fonts (Typekit) service, downloaded by HTTrack at capture time, not live remote calls in the preserved copy itself.
- `hts-cache/winprofile.ini` was checked directly per HTTrack's own bundled warning ("may contain sensitive information, such as username/password authentication") — **no credentials or site-specific sensitive data found**; the file contains only HTTrack's generic default configuration values (empty proxy/port/depth fields, a generic `UserID` string), not actual captured authentication. No privacy hazard found here.

---

## Historical Context

Unchanged from the inventory's existing framing: this documents the same grandson/grandfather collaboration as `site003`, in a more developed, portfolio-style presentation. The confirmed "Dragon team: Toothless" cross-reference (see Purpose) is the most specific piece of evidence yet found connecting the two records' actual content, not just their shared subject.

---

## Creator Commentary

**Status: not yet captured.** No question about this record was asked of Jeff in this session, per the charter's rule against manufacturing testimony.

---

## Preservation Assessment

- **Source integrity:** a third-party mirror (HTTrack), not Jeff's own site export — the inventory's framing is confirmed directly by the `hts-log.txt`/`hts-cache` evidence.
- **Capture method:** known precisely — HTTrack 3.49-2, 18 Nov 2021, run from a Windows machine, local save path `C:\sebastians new test site\seb`.
- **Condition:** 245 files total, 55 MB. Complete as a mirror of what HTTrack could reach at capture time (180 links scanned, 179 files written, "No errors, 0 warnings, 0 messages" per its own log) — the inventory's "98 files" figure appears to undercount; total file count including the CDN-mirror subfolders and `jfsn.myportfolio.com/`'s near-duplicate tree is 245.

---

## Technical Hazards — confirms and details the inventory's existing New Relic finding; no correction needed, but evidence now directly verified

**New Relic — confirmed directly, not merely carried over from the inventory:** `index.html` (and, by the mirror's nature, likely every other page) contains an inline New Relic Browser agent script with a real license key (`e7fb1b89a0`) and application ID (`750147145`). The script's own configuration specifies a live remote agent script it loads at runtime — `js-agent.newrelic.com/nr-1212.min.js` — and a live beacon endpoint, `bam.nr-data.net`. This is injected by the Adobe Portfolio platform itself (standard for `myportfolio.com` sites of this era), not something Jeff added. **Confirmed hazard requiring sanitization**, exactly as the inventory already states.

**New, not previously documented:** `video-test.html` embeds a live iframe pointed at Adobe's own video-hosting infrastructure: `https://www-ccv.adobe.io/v1/player/ccv/FHimWgtGu78/embed?...`. This is a second live third-party (Adobe-operated) call, distinct in kind from the New Relic monitoring script — a video player embed, not analytics. Whether this URL still resolves today was not tested in this pass (would require a live network request, out of scope for a documentation-only session). Recorded as a confirmed embed requiring the same sanitization consideration as the New Relic script.

**No hazard found regarding:** server-side code (none exists — see Technologies); credentials or sensitive data in `hts-cache/` (checked directly, none found); Flash content (none present).

---

## Dependencies

New Relic Browser agent (live remote script + beacon), Adobe CCV video-player iframe (`www-ccv.adobe.io`), plus locally-mirrored (not live) copies of Adobe's asset CDN and Typekit font service.

---

## Related Sites

- **`site003`** — confirmed continuation, strengthened this pass with a specific title match: "Dragon team: Toothless" appears both as a full page here and as an image caption in `site003`'s `legos.html`. This is the most concrete cross-reference found between the two records to date, beyond the general shared-subject-matter framing already in the inventory.
- **`site006`** — not independently compared this pass; `site006`'s own record already establishes it shares `site003`'s content almost entirely (see `site006.md`), so no new comparison was needed to confirm `site007`'s relationship runs through `site003` as already documented.

---

## Related Artworks

None found — unchanged from the inventory. This record documents a grandson's creative output and grandfather/grandson collaborative pieces, not the fine-art catalogue directly, though the "Funny Grandma"/"Untitled With Grandpa"/"Something About Poop" titles are the same candidates already flagged on `site003`'s record for a future `collaboration.html` cross-reference exercise.

---

## Outstanding Unknowns

- The site's actual live/creation date — still unknown; only the 18 Nov 2021 capture date is established.
- Whether `www-ccv.adobe.io/v1/player/ccv/FHimWgtGu78` still resolves today — not tested (would require a live network request).
- What the roughly two dozen placeholder-titled pages (`bbb.html`, `jjj.html`, `kkk.html`, etc.) actually contain — not opened in this pass; they read as Adobe Portfolio scaffold/draft pages by title alone, not confirmed by content.
- Whether any further specific title matches exist between this record and `site003`/`site006` beyond "Dragon team: Toothless" — not exhaustively cross-checked in this pass.

---

## Archival Notes

- **No correction to the inventory was required for this record** — the fourth time in this collection a close pass has confirmed rather than overturned a prior finding (after `site001`; unlike `site002`, `site003`, `site005`, `site006`, all of which required corrections). The New Relic hazard, the HTTrack capture method, and the general `site003` continuation relationship all held up under direct inspection.
- **One factual refinement, not a correction:** the inventory's "98 files" figure for this record's size undercounts the true total (245 files, including the near-duplicate `jfsn.myportfolio.com/` tree and seven CDN-mirror subfolders) — noted here as a refinement since it doesn't change any conclusion, only the file count's precision.
- **The "Dragon team: Toothless" cross-reference is the most specific evidence-based link found between any two family-collaboration records in this collection** — worth keeping in mind as a model for how future artwork/cross-record matching passes should proceed: by exact title string, not general subject-matter description.

---

## Evidence Used

- Full directory listing of `misc/sebastian V2/` (`find . -type f`, 245 files, 55 MB)
- Direct read of `hts-log.txt` (full contents) and `hts-cache/readme.txt`/`hts-cache/winprofile.ini` (full contents, checked specifically for credentials per HTTrack's own warning — none found)
- `diff index.html jfsn.myportfolio.com/index.html` — confirmed near-identical (one trivial image-filename difference)
- `find . -iname "*.php"` — confirmed zero results, establishing no server-side code exists in this capture
- `grep -rl "newrelic\|New Relic\|nr-data"` across all HTML files, plus direct read of the inline New Relic agent script in `index.html` (license key, application ID, remote agent/beacon URLs)
- `grep -ohE 'https?://[a-zA-Z0-9.-]+'` across all HTML files, sorted/deduplicated, to enumerate every external domain referenced
- `grep -rl "ccv.adobe.io"` and direct read of the matching context in `video-test.html`
- `grep -oE '<title>...'` across every named-subject HTML page (`ape.html`, `dragon.html`, `moose.html`, `funny-grandma.html`, `untitled-with-grandpa.html`, `something-about-poop.html`, `rhinoceros.html`, `parrot.html`, `elephant-1.html`, `nice-bird-eating-spider.html`, `stick-man.html`, `face-collage.html`, `drawing.html`, `1619437a90452d.html`, `1619437ea87bbf.html`)
- `grep -n -i "toothless\|dragon team"` in `docs/working-history/records/site003.md`, confirming the "Dragon team: Toothless" caption there, cross-referenced against this record's `1619437ea87bbf.html` page title
- `docs/oral-history/master-notes.md` — searched for existing testimony on "Diplodocus"/"Toothless"/"Dragon team" — none found
- `ls`/`find` on `pro2-bar-s3-cdn-cf*.myportfolio.com/` and `use.typekit.net/` to confirm these are locally-mirrored asset folders, not live-call evidence
