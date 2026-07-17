# Known Issues & Edge Cases

Monitor these after deployment. Check weekly for first month.

---

## 🟡 Performance (likely but non-blocking)

**LCP still ~5.3–5.6s deterministic**
- Status: Identified, root cause unclear
- Action: Monitor Lighthouse trends
- Hypothesis: JavaScript initialization or font swap timing
- Next step: DevTools Performance timeline on real device
- Risk: Low (acceptable for archive)

**Images on decade pages may load slowly**
- Status: Expected (1000+ images per page)
- Action: Watch for complaints, consider pagination
- Risk: Low

---

## 🟡 Mobile Edge Cases

**Scroll indicator hidden on mobile (intentional)**
- Status: Hidden via CSS media query
- Verify: Should NOT appear on iPhone
- If appears: Bug in responsive CSS

**Favorite button on iPhone**
- Test: Click heart, see pulse, check localStorage
- Risk: Touch events may behave differently than hover
- Watch for: Users reporting favorites not persisting across sessions

**Print on mobile**
- Status: Print styles should hide nav/footer
- Test: Print from iPhone → verify clean output
- Risk: Low (users rarely print from phone)

---

## 🔴 Critical (watch closely)

**Keyboard shortcuts on artwork pages (P/N) — DISABLED, not a live risk**
- Status: `_shared/keyboard-shortcuts.js` is an intentionally-empty stub (disabled in Session 66). The script tag is still included sitewide but does nothing.
- Verified 2026-06-23: contents are just a disable comment, no listener code.
- Action: none needed unless the feature is reintroduced — if so, update this entry back to active and re-test P/N.

**Favorite localStorage could fill up**
- Status: Unlikely (1084 * 4 bytes = ~4KB max)
- Risk: Very low
- Watch for: Never (unless user favors >1000 works)

**Related works logic may show duplicates**
- Status: Gen script filters out self, then finds 3 by theme
- Risk: If work has multiple themes, could appear multiple times
- Watch for: User report of same work appearing twice
- Fix: Add Set to deduplicate

---

## 🟢 Expected Behaviors (not bugs)

✅ **Breadcrumbs animate in sequentially** — By design  
✅ **Search hint pulses only once per session** — sessionStorage tracks it  
✅ **Favorite heart is unfilled at first visit** — localStorage check on load  
✅ **Scroll indicator only on pages with 4+ sections** — Intentional (reduces clutter)  
✅ **Number counter "1,084" starts at 0** — Intentional (satisfying animation)  
✅ **Print hides footer** — Intentional (cleaner output)  
✅ **Theme colors vary by page** — Intentional (visual distinction)  

---

## 🧪 Testing Checklist (weekly)

- [ ] jfsn.com homepage loads
- [ ] Click 5 random artwork links → all pages load
- [ ] Favorite a work → heart fills + persists refresh
- [ ] ~~Press P/N on artwork page → navigate correctly~~ (feature disabled, skip)
- [ ] On mobile: hamburger menu animates to X
- [ ] On Lighthouse: Performance score vs. baseline (was 77)
- [ ] GoatCounter dashboard: any errors or spike in 404s?
- [ ] HostGator uptime: any downtime logs?
- [ ] Related works show below descriptions
- [ ] Metadata tags have colored bullets

---

## 📊 Metrics to Monitor

| Metric | Current | Target | Check |
|--------|---------|--------|-------|
| Performance | 77 | 82+ | Weekly Lighthouse |
| LCP | 5.3s | <2.5s | DevTools on real device |
| Uptime | ? | 99.9% | Monthly average |
| 404 rate | <0.1% | <0.05% | GoatCounter |
| JS errors | 0 | 0 | Browser console |

---

## If Something Goes Wrong

**Site is down:**
- Check uptime-check.sh logs: `/tmp/jfsn-uptime-log.txt`
- Check HostGator cPanel status — it's the only host now (Netlify mirror removed 2026-06-22)

**Keyboard shortcuts not working:**
- Check browser console for JS errors
- (`monitor.js`, referenced here previously, was deleted in Session 52 as unused — don't expect to find it)

**Favorites not persisting:**
- Check localStorage: DevTools > Application > localStorage
- Verify favorite-btn data-art-id attribute is correct

**Images not loading:**
- Check /artworks/thumbs/ paths exist
- Run broken-link check: `curl -s | grep -c 404`

---

## Future Improvements (not blocking)

- [ ] Add pagination to decade pages (reduce initial load)
- [ ] Deduplicate related works if multiple themes
- [ ] Add "recently viewed" section on homepage
- [ ] Track which themes are most popular (analytics)
- [ ] Add skip-to-next button on keyboard shortcut hint
- [ ] Consider HTTP/2 Push for critical fonts
- [ ] Monitor Real User Metrics (RUM) vs Lighthouse
