#!/bin/bash
# Uptime monitoring for jfsn.com
# Run via cron: 0 * * * * /path/to/uptime-check.sh
# (Every hour, sends alert if site is down)

SITE="https://jfsn.com"
TIMEOUT=10
STATUS_FILE="/tmp/jfsn-uptime-status.txt"
ALERT_EMAIL="jfsneumann@gmail.com"

# Check if site is up
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout $TIMEOUT "$SITE")

# Log the check
echo "[$(date)] HTTP $HTTP_CODE" >> /tmp/jfsn-uptime-log.txt

# Alert if down
if [ "$HTTP_CODE" != "200" ]; then
  echo "ALERT: jfsn.com returned HTTP $HTTP_CODE at $(date)" | \
  mail -s "🚨 jfsn.com DOWN" "$ALERT_EMAIL"
  echo "DOWN" > "$STATUS_FILE"
else
  echo "UP" > "$STATUS_FILE"
fi
