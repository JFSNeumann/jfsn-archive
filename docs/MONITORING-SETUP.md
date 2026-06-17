# Monitoring Setup Guide

Everything is now in place to track usage, performance, and health of jfsn.com.

---

## 🎯 Three Monitoring Systems

### 1. **GoatCounter Analytics** (Already running)
**URL:** https://jfsn.goatcounter.com/  
**What it tracks:**
- Page views (which pages are visited most)
- Visitor geography/browser/device
- Bounce rates
- Time on page

**Enhanced tracking (NEW):**
- Favorite button clicks: `/event/favorite/add/artNNNN`
- Theme views: `/view/category/guernica`
- Keyboard shortcuts: `/event/keyboard/P` (etc.)
- Performance: `/perf/LCP` (milliseconds)

**How to check:**
```
1. Go to https://jfsn.goatcounter.com/
2. Review "Pages" tab → see which pages get traffic
3. Review "Events" tab → see favorite clicks, keyboard usage
```

### 2. **Local Analytics (localStorage)**
**What it is:** Client-side stats stored in user's browser  
**What it tracks:**
- User's personal favorite list
- Theme pages visited (local log)
- Session start time
- Keyboard shortcuts used (local)

**How to view (browser DevTools):**
```
1. Open browser console (F12)
2. Type: window.getLocalStats()
3. See: your favorites list, theme views, session info
```

**Useful command:**
```javascript
// In browser console
var stats = window.getLocalStats();
console.log('Favorites:', stats.favorites);
console.log('Themes viewed:', stats.themes);
```

### 3. **Uptime Monitoring** (NEW)
**What it does:** Hourly health checks on jfsn.com  
**Setup:**

```bash
# Make script executable
chmod +x /Users/jeffreyneumann/Documents/JFSN/scripts/uptime-check.sh

# Add to crontab (runs every hour)
crontab -e

# Paste this line:
0 * * * * /Users/jeffreyneumann/Documents/JFSN/scripts/uptime-check.sh

# Verify cron is set:
crontab -l
```

**Alert:** If site is down, you'll get an email to jfsneumann@gmail.com

**Manual check:**
```bash
curl -I https://jfsn.com
# Should see: HTTP/1.1 200 OK
```

---

## 📊 Weekly Checklist

**Every Monday morning:**

1. ✅ Check GoatCounter → "Pages" tab
   - Which artworks got views?
   - Which theme pages popular?
   - Any suspicious spike in 404s?

2. ✅ Check uptime log
   ```bash
   tail -20 /tmp/jfsn-uptime-log.txt
   # Should be: [date] HTTP 200 for all lines
   ```

3. ✅ Run Lighthouse
   ```bash
   lighthouse https://jfsn.com --view
   # Note: Performance score (target: 82+)
   ```

4. ✅ Check favorites in console
   ```javascript
   // See what people favorited
   var stats = window.getLocalStats();
   stats.favorites.slice(0, 10)  // Top 10
   ```

---

## 🚨 Critical Alerts

You'll get emails if:
- **Site is down** (HTTP 500 or timeout)
- **SSL cert expires** (if set up)
- **Disk full** (if set up)

Current alerts: **Uptime only** (HTTP code)

---

## 📈 Sample Insights You'll See

**After 1 week:**
- "art0500 was favorited 3 times"
- "guernica.html had 23 page views"
- "Users spend avg 2.5 min on artwork pages"
- "Mobile: 40%, Desktop: 60%"

**After 1 month:**
- Most popular theme (Guernica? Torsos?)
- Most favorited work
- Peak traffic times
- Mobile vs. desktop split

---

## 🔄 Feedback Loop

1. **See what's popular** (GoatCounter)
   ↓
2. **Highlight those works** (add to Favorites page)
   ↓
3. **Record oral history** on popular pieces
   ↓
4. **Share insights** if you want

---

## Troubleshooting

**Q: I don't see /event/favorite/ in GoatCounter**
- A: Takes ~1 hour to appear, then batch-updates

**Q: Uptime script not sending emails**
- A: Check: `mail` command works on Mac (`mail -v` to test)
- A: Check: crontab loaded (`crontab -l`)
- A: Check: logs at `/tmp/jfsn-uptime-log.txt`

**Q: localStorage stats show nothing**
- A: Visit art page, click favorite, then check
- A: Different browser = different localStorage

**Q: Lighthouse performance stuck at 77**
- A: Could be LCP 5.3s is deterministic (not a bug)
- A: Run DevTools Performance tab on real iPhone to diagnose

---

## Advanced: Custom Queries

**See which artworks are most favorited (across all users):**
- Currently: localStorage is per-browser only
- Future: Could aggregate server-side
- For now: Ask users to share their favorites list

**See theme popularity:**
```javascript
// In console on theme page
window.trackThemeView();
// Then check GoatCounter > Events tab
```

---

## What NOT to do

❌ Don't delete `/tmp/jfsn-uptime-log.txt` — it's your historical uptime record  
❌ Don't change uptime check interval to <5 min — wastes resources  
❌ Don't expose localStorage stats publicly (users' privacy)  

---

## Next Steps

1. ✅ Verify uptime script is in crontab
2. ✅ Wait 24 hours, check logs
3. ✅ Check GoatCounter > Events for favorite tracking
4. ✅ Share insights with interested users (optional)
