# JFSN Design Session — Full Creative Freedom

**Status:** Design constraints lifted. All visual decisions now open.  
**Mission:** Improve jfsn.com to better serve the archive and its users.

---

## Current State

**Live:** jfsn.com (1,084 works, 31 public pages)  
**Latest shipped:** Phase 3 animations (5 delight touches), cache `jfsn-20260618002549`  
**Design system:** Light, bone-white bg, orange accents, Playfair/Inter typography  
**Architecture:** Vanilla HTML/CSS/JS + Tailwind, service worker cache, responsive

---

## Design Freedom

**Everything is open.** Gradients, rounded corners, shadows, filters, transforms, scales, overlays, scroll-reveals, animations — all available. Apply judgment: if it serves the work and helps users navigate the archive, ship it.

### The One Rule

**Data integrity.** Never fabricate provenance, badges, composites-as-real-exhibitions, or quotes. Design can evolve; catalog data stays honest.

---

## Your Prompt

**What would improve jfsn.com?**

Here are some areas to consider:
- **Homepage:** Hero, featured works flow, entry points to the archive
- **Archive.html:** 1,084 works, filters, search, grid layout, responsiveness
- **Thumbnail design:** Current full-color treatment + saturation overlay. Could be enhanced?
- **Interactions:** Hover states, transitions, feedback, polish
- **Typography:** Sizes, weights, spacing, hierarchy on any page
- **Navigation:** Current Stitch nav works; any UX improvements?
- **Long-form pages:** stories.html, why-i-made-things.html, about.html — readability, pacing, visuals
- **Theme pages:** guernica.html, targets.html, etc. — each could be distinctive
- **Mobile experience:** iPhone 15 Pro is primary test device; any friction points?
- **Performance:** LCP/CLS targets; any heavy sections worth optimizing?
- **Accessibility:** WCAG AA contrast check, keyboard nav, screen reader labels

**Or suggest something entirely new** — a feature, a page, a experience that would make the archive feel more complete or alive.

---

## How to Proceed

1. **Propose improvements** — describe what you want to change and why
2. **I'll design/code** — Stitch for UI mockups, HTML/CSS for production code
3. **Test on iPhone 15 Pro** — ensure mobile works well
4. **Verify performance** — Lighthouse LCP/CLS shouldn't regress
5. **Ship it** — commit, push, deploy via HostGator FTP

---

## Key Files to Know

- **CLAUDE.md** — Updated 2026-06-18, all constraints removed. Read "Design is open" section.
- **MEMORY.md** — Tracks sessions, deployments, design decisions. Updated with feedback_design_open.
- **_shared/ui.css** — Shared styles for thumbnails, nav, animations. Edit freely.
- **site.min.css** — Compiled Tailwind output. Rebuild after any new utility classes: `npm run build:css`
- **sw.js** — Service worker. Bump `CACHE_V` before every deploy.

---

## Production Checklist

After any changes:
- [ ] Test on iPhone 15 Pro (primary device)
- [ ] Check WCAG AA contrast on new text
- [ ] Run Lighthouse (mobile) — verify no LCP/CLS regression
- [ ] Rebuild CSS if new Tailwind classes added: `npm run build:css`
- [ ] Update sw.js cache version
- [ ] Commit with clear message
- [ ] Push to GitHub
- [ ] Deploy: `bash deploy.sh` (FTP to HostGator)
- [ ] Verify live on jfsn.com

---

## Go

What would you like to improve?
