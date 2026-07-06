#!/usr/bin/env node
/* build-js-bundles.js — Phase 2A JS bundling (packaging only, not a refactor)
 *
 * Concatenates existing, unmodified source files into two generated bundle
 * files. Source files in _shared/ (and root-level search.js) remain the
 * single source of truth — this script only reads them. Order matters and
 * is preserved deliberately:
 *   - CORE_FILES: today's relative tag order on a representative page
 *     (index.html / qa.html), confirmed identical across samples.
 *   - NAV_EARLY_FILES / NAV_LATE_FILES: the nav-span files split into two
 *     bundles because scroll-choreography.js must execute AFTER two inline
 *     <script> blocks (header-scroll-hide, dark-mode toggle) that live inside
 *     _shared/top-nav.html. A single merged nav bundle would place all files
 *     at one tag position, flipping that relative order — so TWO bundles,
 *     each at the exact tag position its members occupy, preserves execution
 *     order exactly. (micro-interactions.js was previously in NAV_LATE_FILES
 *     for the same reason; it was deleted in H1 2026-06-30.)
 * Do not reorder either list without re-checking BUNDLE_PLAN.md §1 and §6 —
 * anime.min.js (loaded separately, NOT bundled) must still execute before
 * nav-early.bundle.js, and both nav bundles' tags must still execute before
 * core.bundle.js's tag.
 *
 * Run: node build-js-bundles.js   (or: npm run build:js)
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

const CORE_FILES = [
  '_shared/ui.js',
  '_shared/page-transitions.js',
  '_shared/lazy-load.js',
];
// nav-active.js is deliberately excluded: it has a duplicate <script> tag on
// 8 of the 38 pages (404, artwork, changes, chromatic, curatorial-map,
// gallery-images, style-guide, wall — discovered while wiring up this
// bundle). Folding it into a single universal bundle would collapse that
// duplicate to a single execution everywhere — a real behavior change, not
// just packaging. Left as its own individual tag, unchanged, exactly as it
// is on every page today (single tag on 30 pages, duplicate on 8).

const NAV_EARLY_FILES = [
  'search.js',
  '_shared/jfsn-interactions.js',
  '_shared/accent-transition.js',
  '_shared/chromatic-accent-wire.js',
  '_shared/ambient-chromatic-tint.js',
  '_shared/chromatic-position-strip.js',
  '_shared/chromatic-lazy-tint.js',
  '_shared/click-feedback.js',
];

const NAV_LATE_FILES = [
  '_shared/scroll-choreography.js',
  '_shared/floating-home-button.js',
];

function buildBundle(files, outPath, label) {
  const banner =
    '/* GENERATED FILE — do not edit directly.\n' +
    `   Bundle: ${label}\n` +
    '   Source: each section below is copied verbatim from its own file in\n' +
    '   _shared/ (or repo root). To change behavior, edit that source file,\n' +
    '   then regenerate with `npm run build:js`. Hand-editing this file will\n' +
    '   be silently overwritten on the next build.\n' +
    '   See BUNDLE_PLAN.md for why this exact file list and order. */\n';

  const sections = files.map((rel) => {
    const abs = path.join(ROOT, rel);
    const content = fs.readFileSync(abs, 'utf8');
    return `/* ===== ${rel} ===== */\n${content}`;
  });

  const out = banner + '\n' + sections.join('\n\n');
  fs.writeFileSync(path.join(ROOT, outPath), out);
  console.log(`Wrote ${outPath} (${out.length} bytes, ${files.length} source files)`);
}

buildBundle(CORE_FILES, '_shared/core.bundle.js', 'core.bundle.js — universal, all 38 pages');
buildBundle(NAV_EARLY_FILES, '_shared/nav-early.bundle.js', 'nav-early.bundle.js — runs before the inline header/dark-mode scripts, 37 stamped pages');
buildBundle(NAV_LATE_FILES, '_shared/nav-late.bundle.js', 'nav-late.bundle.js — runs after the inline header/dark-mode scripts, 37 stamped pages');
