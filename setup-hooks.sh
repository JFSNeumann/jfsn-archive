#!/usr/bin/env bash
# setup-hooks.sh — install this repo's tracked git hooks into .git/hooks/
# Run once after cloning. Git does not install hooks automatically — anything
# in .git/hooks/ is local-only and invisible to a fresh clone, which is how
# this project's pre-commit checks (nav audit, CSS-rebuild guard, CACHE_V
# guard) went unenforced on at least one machine until this script existed.
set -e
cd "$(git rev-parse --show-toplevel)"
cp hooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
echo "✓ Installed hooks/pre-commit -> .git/hooks/pre-commit"
