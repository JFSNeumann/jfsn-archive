#!/usr/bin/env bash
# JFSN backup health check — catches silent LaunchAgent failures early
#
# Why this exists: both nightly backup LaunchAgents (JEFFS-4TB at 11pm,
# Backblaze B2 at 9pm) have gone silently broken three separate times —
# unloaded from launchd entirely (2026-07-06, 2026-07-16), then a stale
# script-path bug in both plists found one job at a time on consecutive
# days (2026-07-17, 2026-07-18). Each time, the only way it was caught was
# a custodian manually running `launchctl list | grep jfsn`. A clean
# reading for one job has never guaranteed the sibling job is sound.
#
# This script makes that check a 2-second, repeatable command instead of
# something a custodian has to remember and interpret by hand — run it at
# the start of every session (see SESSION_START_PROCEDURES.md § "Check
# Backups").
#
# What it checks, per job (backup.sh -> JEFFS-4TB, cloud-backup.sh -> B2):
#   1. The LaunchAgent is actually loaded (launchctl list)
#   2. The plist's ProgramArguments point at a script that exists on disk
#      (the exact class of bug found 2026-07-17/18)
#   3. The job's stdout log was written within the last 26 hours (both
#      jobs are scheduled daily; 26h gives a 2h buffer past the 24h mark
#      before flagging a miss)
#
# Read-only. Modifies nothing. Exit 0 if both jobs are healthy, 1 otherwise.

set -uo pipefail

PASS="✓"
FAIL="✗"
overall_ok=1

check_job() {
  local label="$1" plist="$2" logfile="$3"

  echo "── $label ──"

  # 1. Loaded in launchd?
  # (captured to a variable first, not piped directly into `grep -q` — under
  # `set -o pipefail`, grep -q's early exit on first match sends SIGPIPE to
  # the still-writing `launchctl list`, and pipefail reports that as the
  # pipeline's exit code instead of grep's real 0/1 result. Cost a debugging
  # round to find; leaving this note so it isn't reintroduced.)
  local launchctl_output
  launchctl_output=$(launchctl list 2>/dev/null)
  if echo "$launchctl_output" | grep -q "$label"; then
    echo "  $PASS loaded in launchd"
  else
    echo "  $FAIL NOT loaded in launchd — run: launchctl load $plist"
    overall_ok=0
  fi

  # 2. Script path in the plist actually exists?
  local script_path
  script_path=$(plutil -extract ProgramArguments.1 raw -o - "$plist" 2>/dev/null)
  if [ -z "$script_path" ]; then
    echo "  $FAIL could not read ProgramArguments from $plist"
    overall_ok=0
  elif [ -f "$script_path" ]; then
    echo "  $PASS script path valid ($script_path)"
  else
    echo "  $FAIL script path in plist does not exist: $script_path"
    echo "     (this is the exact bug found 2026-07-17/18 — fix the plist's ProgramArguments)"
    overall_ok=0
  fi

  # 3. Log written recently?
  if [ -f "$logfile" ]; then
    local age_hours
    age_hours=$(( ( $(date +%s) - $(stat -f %m "$logfile") ) / 3600 ))
    if [ "$age_hours" -le 26 ]; then
      echo "  $PASS last ran ${age_hours}h ago ($logfile)"
    else
      echo "  $FAIL last run was ${age_hours}h ago — expected within 26h ($logfile)"
      overall_ok=0
    fi
  else
    echo "  $FAIL no log file found at $logfile — job may never have run"
    overall_ok=0
  fi

  echo ""
}

check_job "com.jfsn.backup" \
  "$HOME/Library/LaunchAgents/com.jfsn.backup.plist" \
  "$HOME/Library/Logs/jfsn-backup.log"

check_job "com.jfsn.cloud-backup" \
  "$HOME/Library/LaunchAgents/com.jfsn.cloud-backup.plist" \
  "$HOME/Library/Logs/jfsn-cloud-backup.log"

if [ "$overall_ok" -eq 1 ]; then
  echo "Both backup jobs healthy."
  exit 0
else
  echo "⚠️  At least one backup job needs attention — see $FAIL lines above."
  exit 1
fi
