#!/bin/bash
# tools/buch-feedback/ruf.sh — calls Doc when reports of "Fehler melden" wait (Doc, 10.10.2026: "Unten einen button
# 'Fix please' der ruft Dich auf den Plan. Lass uns das täglich 18:10 machen").
# The safe way (agreed 10.10.2026, after the auto-mode check refused an unattended fixing agent - pupils' text must never
# steer a push): this script only CALLS - a notification and Solita over the speakers. The fixing happens in a Claude
# session in front of Doc, who says "fix" (tools/buch-feedback/auftrag.md), and nothing is pushed without his word.
#
# The LaunchAgent de.docalvers.buch-feedback (tools/buch-feedback/de.docalvers.buch-feedback.plist) starts it every minute:
#   - a new "Fix please" from HTML/buch/meldungen.html → call at once, once per request
#   - from 18:10, once a day → if reports are open, call; that 18:10 run is closed at once with the count
set -u -o pipefail
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
TOOL="$HOME/IdeaProjects/forloop/tools/buch-feedback/meldungen.py"
STATE="$HOME/Library/Application Support/buch-feedback"
LAUT=100                                              # Doc, 09.10.2026: "man muss mich rufen, ich bin nicht hier"
mkdir -p "$STATE"

# one at a time: a PID in the lock file that is still alive wins (the file is emptied, never deleted)
LOCK="$STATE/lock"
if [ -s "$LOCK" ] && kill -0 "$(cat "$LOCK")" 2>/dev/null; then exit 0; fi
echo $$ > "$LOCK"
trap ': > "$LOCK"' EXIT

ruf() {                                               # $1 the notification, $2 what Solita says
    osascript -e "display notification \"$1\" with title \"Fehler melden\" sound name \"Glass\"" > /dev/null 2>&1
    SOLITA_FORCE=1 node "$HOME/.claude/hooks/solita-ruf.mjs" "Doc, hier ist Solíta. $2" "$LAUT" > /dev/null 2>&1
    echo "$(date '+%F %T') ruf: $1"
}
meldungen() { [ "$1" -eq 1 ] && echo "eine Meldung wartet" || echo "$1 Meldungen warten"; }

# offline: one line, overwritten - a dead Wi-Fi fills no log
P=$(python3 "$TOOL" anstehend 2>&1) || { echo "$(date '+%F %T') $P" > "$STATE/letzter-fehler"; exit 0; }

if [ "$P" != "null" ]; then
    if [ "$P" != "$(cat "$STATE/gerufen-knopf" 2>/dev/null)" ]; then
        echo "$P" > "$STATE/gerufen-knopf"
        ruf "Fix please - sag Claude „fix“." "Du hast Fix please gedrückt. Sag Claude einfach: fix."
    fi
    exit 0                                            # a waiting request is Claude's to claim - never closed here
fi

if [ "$(date +%H%M)" -ge 1810 ] && [ "$(cat "$STATE/letzter-1810" 2>/dev/null)" != "$(date +%F)" ]; then
    date +%F > "$STATE/letzter-1810"
    N=$(python3 "$TOOL" holen --anlass 18:10 | python3 -c 'import json,sys; print(len(json.load(sys.stdin)["meldungen"]))') || {
        echo "$(date '+%F %T') 18:10: holen failed"; exit 0; }
    if [ "$N" -gt 0 ]; then
        python3 "$TOOL" schliessen "18:10: $(meldungen "$N") - Doc gerufen." > /dev/null
        ruf "18:10: $(meldungen "$N") - sag Claude „fix“." "Aus den Büchern: $(meldungen "$N"). Sag Claude einfach: fix."
    else
        python3 "$TOOL" schliessen "18:10: nichts offen." > /dev/null
        echo "$(date '+%F %T') 18:10: nichts offen"
    fi
fi
