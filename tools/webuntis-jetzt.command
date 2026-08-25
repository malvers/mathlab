#!/bin/bash
# "Jetzt holen": pulls the current school year from WebUntis right away and
# shows the progress in a Terminal window. Double-click in Finder.
cd "$(dirname "$0")/.."
echo "WebUntis: Schuljahr holen ..."
node tools/webuntis.js year && node tools/webuntis.js names
echo
echo "Fertig - im Browser Cmd-Shift-R."
