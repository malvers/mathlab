#!/bin/bash
# Pull the handwriting probes Doc recorded on the tablet (downloaded there because
# the live site has no /__proben/ endpoint), number them into the corpus, score them.
#
#   tools/proben_vom_tablet.sh            # pull, import, score
#
# Files on the tablet are named probe-<slug>-<timestamp>.json (the page's fallback);
# in the corpus they become probe-NN-<slug>.json, NN continuing after the last one.
set -u
cd "$(dirname "$0")/.." || exit 1
DIR=HTML/morpheus/handschrift-proben
TMP=$(mktemp -d)

if ! adb devices 2>/dev/null | tail -n +2 | grep -q 'device$'; then
    echo "kein Tablet per USB (adb devices) - anstecken, USB-Debugging bestätigen"; exit 1
fi

# every probe file in the tablet's Download folder
adb shell 'ls /sdcard/Download/ 2>/dev/null' | tr -d '\r' | grep -E '^probe-.*\.json$' > "$TMP/liste" || true
n=$(wc -l < "$TMP/liste" | tr -d ' ')
if [ "$n" = "0" ]; then echo "keine probe-*.json im Download-Ordner des Tablets"; exit 1; fi
echo "$n Probe(n) auf dem Tablet"

mkdir -p "$TMP/roh"
while read -r f; do adb pull "/sdcard/Download/$f" "$TMP/roh/$f" >/dev/null 2>&1 || echo "  konnte $f nicht holen"; done < "$TMP/liste"

# import - the same tool that takes a zip from OneDrive
python3 tools/proben_importieren.py "$TMP/roh"

echo; echo "=== Prüfstand ==="
node tools/handschrift_auswerten.mjs
rm -rf "$TMP"
