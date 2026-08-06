# Redesign Deployment Approved — 2026-08-06

**Decision:** JFSN_2027 (design-tree) is approved to replace the live jfsn.com.

The current JFSN codebase (this folder, `jfsn-archive` repo) is being preserved as a backup at ~/JFSN_backup_2026-08-XX. All governance, data, and mission remain unchanged — this is a presentation redesign only.

**Pre-deployment checklist:**
- [ ] Resolve 4 composite-flag false positives
- [ ] Fix 3 deferred heading-skip issues
- [ ] Full site crawl + API validation
- [ ] Lighthouse baseline
- [ ] a11y re-check
- [ ] Mobile verification
- [ ] URL compatibility (artwork.html?id= links)

**No changes to:**
- Data integrity, schema, catalog
- Composite flagging or disclosure
- Date precision rules
- Mission or governance

**Backup location:** ~/JFSN_backup_2026-08-XX (created before deploy)

This is a one-way transition. The JFSN repo becomes historical; JFSN_2027 becomes the canonical working tree for all future work.
