#!/bin/bash
# ULTRA v6.7.0 - Lab Multi-Launcher
# Öffnet alle Labore in Google Chrome (lokal als file://).
# Alle Labs als Tabs in genau einem neuen Fenster (ein AppleScript, Fenster-Referenz w).
#
# Gegenstück Online: open_all_labs_in_chrome_online.sh

set -euo pipefail

BASE_DIR="/Users/malvers/IdeaProjects/forloop/HTML"

file_uri_from_path() {
    python3 -c 'import pathlib, sys; print(pathlib.Path(sys.argv[1]).resolve().as_uri())' "$1"
}

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

echo "Starte ULTRA v6.7.0 Suite in Google Chrome (inkl. Standalone-Labs)..."
echo "Ein neues Fenster, alle Labs darin als Tabs."

urls=()
while read -r f; do
    echo "  → $(basename "$f")"
    urls+=("$(file_uri_from_path "$f")")
done < <(find "$BASE_DIR" -name "*.html" ! -name "index.html" ! -name "impressum.html" ! -path "*/scripts/*")

if [[ ${#urls[@]} -eq 0 ]]; then
    echo "Keine Labore gefunden."
    exit 0
fi

chrome_open_all_urls_one_window "${urls[@]}"

echo "Alle Labore (inkl. Standalone) wurden in einem Chrome-Fenster gestartet! 🚀"
