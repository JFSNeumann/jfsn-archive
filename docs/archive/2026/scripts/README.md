# Retired scripts

## stamp-nav.sh

**What it did:** Stamped a shared nav/footer template into a fixed list of
site pages by injecting content between `<!-- NAV:START -->` / `<!-- NAV:END -->`
marker comments, reading the shared markup from `_shared/top-nav.html` and
`_shared/footer.html`.

**Architecture it supported:** The pre-2026-07-12 site, where nav and footer
markup lived in one shared template file and was mechanically stamped into
every page to keep them in sync.

**Why it no longer matches the current repository:** The 2026-07-12 v2→root
migration moved the site to per-page inline nav markup (each room page,
e.g. `current.html`, `the-studio.html`, has its own bespoke hero/nav
treatment). `_shared/top-nav.html` and `_shared/footer.html` no longer exist,
and root pages carry no `NAV:START`/`NAV:END` markers. Running this script
against the current repository fails immediately, since its source
templates are gone.

**Restoring it:** Reviving this script — or reintroducing any shared-template
nav system — requires an intentional architectural decision: do the site's
14 root pages move back to a single shared nav/footer template, or does the
current per-page inline approach stay permanent? That decision has not been
made. This script is preserved here as a record of the prior architecture,
not as a drop-in tool.
