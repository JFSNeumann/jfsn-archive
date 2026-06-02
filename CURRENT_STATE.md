# Current State
**Updated:** 2026-06-02

## Last commit
4ad2db6 — Update CURRENT_STATE.md (pre-session state)

## Shipped this session
- **index.html — major overhaul:**
  - Butterfly icon added to header nav + footer JFSN lockup
  - Footer expanded to 5 columns: Explore, Medium, Visualizations, Contact
  - New footer links: Wall, Lost Works, Guernica Series, Collage, Sculpture, Photography, Painting, Constellation, Changes
  - Social links in footer: Instagram, LinkedIn, Twitter/X, YouTube, Behance, Dribbble
  - Hero: removed flat dark veil, added radial oval gradient behind text (center-dark, fades out)
  - Hero image shifted up to hide ceiling (scale + translateY)
  - Bouncing white chevron replaces SCROLL text+line; hides on scroll past hero (IntersectionObserver)
  - Featured 3 works renamed: My Favorite Early Cross / Kamikaze 101 / Kimono #3
  - Kamikaze 101 corrected to collage (was sculpture) in catalog-home.json + catalog.json
  - Color fade effect on featured 3: greyscale top, full color at bottom 25%
- **Butterfly image:** `jfsn-butterfly.png` copied from old-site to project root
- **Color fade sitewide:** bottom 25% of all greyscale thumbnails fades to original color
  - `_shared/ui.css` — mask-image gradient on `.thumb__link img`
  - `_shared/ui.js` — sets background-image + mask via JS (inline style to beat page CSS)
  - `collage.html`, `sculpture.html`, `photography.html`, `painting.html` — inline script added before `</body>` to apply mask directly (bypasses defer caching issue)
- **Mobile/tablet hero:** same fixes applied (image shift, radial oval, chevron)

## To do next session
- [ ] Verify butterfly shows on all other pages (update `_shared/top-nav.html` + run `stamp-nav.sh`)
- [ ] Deploy and test color fade on live site

## Known issues
- (none)

## Site is live at
- jfsn.com  (primary — cPanel)
- jfsn-archive.netlify.app  (secondary — Netlify, has Companion function)

## Archive stats
- 1084 works cataloged, 0 errors

## Deploy workflow
```
bash end-session.sh   # git commit + push + backup
bash deploy.sh        # FTP upload to HostGator (run after)
```
