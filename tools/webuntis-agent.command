#!/bin/bash
# Installs (or updates) the macOS LaunchAgent that pulls the school timetable
# from WebUntis twice a day (06:00, 12:30) and at every login. Missed runs (Mac was
# asleep) are caught up on wake - that is why this is launchd, not cron.
#
# Double-click in Finder, or:  bash tools/webuntis-agent.command
# Remove again:                 bash tools/webuntis-agent.command remove
#
# What runs:  node tools/webuntis.js year && node tools/webuntis.js names
# Log:        ~/Library/Logs/webuntis.log

set -e
LABEL="de.docalvers.webuntis"
REPO="$(cd "$(dirname "$0")/.." && pwd)"
NODE="$(command -v node || echo /usr/local/bin/node)"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
LOG="$HOME/Library/Logs/webuntis.log"

if [ "$1" = "remove" ]; then
  launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
  rm -f "$PLIST"
  echo "LaunchAgent $LABEL entfernt."
  exit 0
fi

mkdir -p "$HOME/Library/LaunchAgents"
cat > "$PLIST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>$LABEL</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>-lc</string>
    <string>cd "$REPO" &amp;&amp; "$NODE" tools/webuntis.js year &amp;&amp; "$NODE" tools/webuntis.js names</string>
  </array>
  <key>StartCalendarInterval</key>
  <array>
    <dict><key>Hour</key><integer>6</integer><key>Minute</key><integer>0</integer></dict>
    <dict><key>Hour</key><integer>12</integer><key>Minute</key><integer>30</integer></dict>
  </array>
  <key>RunAtLoad</key><true/>
  <key>StandardOutPath</key><string>$LOG</string>
  <key>StandardErrorPath</key><string>$LOG</string>
</dict>
</plist>
EOF

# (re)load for the current user session
launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
launchctl bootstrap "gui/$(id -u)" "$PLIST"
echo "LaunchAgent $LABEL installiert: täglich 06:00 und 12:30 + bei Anmeldung."
echo "Erster Lauf startet jetzt im Hintergrund (~1 Minute). Log: $LOG"
