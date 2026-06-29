#!/usr/bin/env node
/* build-js-bundles.js — Phase 2A JS bundling (packaging only, not a refactor)
 *
 * Concatenates existing, unmodified source files into two generated bundle
 * files. Source files in _shared/ (and root-level search.js) remain the
 * single source of truth — this script only reads them. Order matters and
 * is preserved deliberately:
 *   - CORE_FILES: today's relative tag order on a representative page
 *     (index.html / qa.html), confirmed identical across samples.
 *   - NAV_FILES: today's literal order inside _shared/top-nav.html's
 *     NAV:START/NAV:END span, plus floating-home-button.js from
 *     _shared/footer.html's FOOTER span (folded in here to avoid loading it
 *     twice once its standalone tag is removed).
 * Do not reorder either list without re-checking BUNDLE_PLAN.md §1 and §6 —
 * anime.min.js (loaded separately, NOT bundled) must still execute before
 * nav.bundle.js, and nav.bundle.js's tag must still execute before
 * core.bundle.js's tag, to preserve the existing window.showToast outcome
 * (ui.js's definition must keep winning over micro-interactions.js's).
 *
 * Run: node build-js-bundles.js   (or: npm run build:js)
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

const CORE_FILES = [
  '_shared/ui.js',
  '_shared/nav-active.js',
  '_shared/lightbox.js',
  '_shared/toast.js',
  '_shared/page-transitions.js',
  '_shared/lazy-load.js',
  '_shared/analytics.js',
  '_shared/image-prefetch.js',
];

const NAV_FILES = [
  'search.js',
  '_shared/jfsn-interactions.js',
  '_shared/accent-transition.js',
  '_shared/chromatic-accent-wire.js',
  '_shared/ambient-chromatic-tint.js',
  '_shared/chromatic-position-strip.js',
  '_shared/chromatic-lazy-tint.js',
  '_shared/click-feedback.js',
  '_shared/micro-interactions.js',
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
buildBundle(NAV_FILES, '_shared/nav.bundle.js', 'nav.bundle.js — sitewide nav block, 37 stamped pages');
