/* DISABLED 2026-06-22 (documentation/code audit): this injected its own
   floating "#scroll-to-top" button at bottom:24px/right:24px, 48px circle —
   nearly identical position and size to "#btt-float", the floating
   back-to-top button already built into _shared/footer.html
   (bottom:28px/right:28px, 44px circle). Both showed after 300px of scroll,
   so every page rendered two overlapping scroll-to-top buttons stacked on
   top of each other. _shared/footer.html's #btt-float is the one actually
   wired into the canonical, stamped footer template — keep that one.
   Following the same disable pattern already used for keyboard-shortcuts.js:
   leave the <script> tags in the 40 pages that reference this file (removing
   them individually is a bigger, more error-prone change for the same
   result), just make this file a no-op.
*/

// Intentionally empty - duplicate of _shared/footer.html's #btt-float
