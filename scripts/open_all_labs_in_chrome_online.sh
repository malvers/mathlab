#!/bin/bash
# ULTRA v6.7.0 - Lab Multi-Launcher (Online)
# Öffnet dieselben Labore wie open_all_labs_in_chrome.sh, aber als HTTPS-URLs.
#
# Standard: https://docalvers.de — alle Labs als Tabs in genau einem neuen Fenster
# (ein AppleScript-Lauf, Fenster-Referenz w — nicht „front window“ pro Tab).
#
#   export FORLOOP_LABS_BASE_URL='https://staging.example.com'  # optional
#   ./open_all_labs_in_chrome_online.sh

set -euo pipefail

BASE_DIR="/Users/malvers/IdeaProjects/forloop/HTML"
BASE_URL="${FORLOOP_LABS_BASE_URL:-https://docalvers.de}"

BASE_URL="${BASE_URL%/}"
BASE_DIR="${BASE_DIR%/}"

chrome_open_all_urls_one_window() {
    [[ $# -gt 0 ]] || return 0
    osascript -e 'on run argv
	tell application "Google Chrome"
		activate
		set w to make new window
		set URL of active tab of w to item 1 of argv
		repeat with i from 2 to (count argv)
			tell w to make new tab with properties {URL:(item i of argv)}
		end repeat
	end tell
end run' -- "$@"
}

echo "Starte ULTRA v6.7.0 Suite in Google Chrome (Online · BASE_URL=$BASE_URL)..."
echo "Ein neues Fenster, alle Labs darin als Tabs."

urls=()
while read -r f; do
    rel="${f#"$BASE_DIR"/}"
    url="$BASE_URL/$rel"
    echo "  → $url"
    urls+=("$url")
done < <(find "$BASE_DIR" -name "*.html" ! -name "index.html" ! -name "impressum.html" ! -path "*/scripts/*")

if [[ ${#urls[@]} -eq 0 ]]; then
    echo "Keine Labore gefunden."
    exit 0
fi

chrome_open_all_urls_one_window "${urls[@]}"

echo "Alle Labore wurden in einem Chrome-Fenster geöffnet."
