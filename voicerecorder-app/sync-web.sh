#!/usr/bin/env bash
# Copy the Voice Recorder web assets from the repo into www/ (single source of truth).
# HTML/voicerecorder/ stays the ONE source — never hand-edit www/. Re-run this after changing
# the web app, then `npx cap sync`.
#
# Note: with Plan A (server.url in capacitor.config.json) the app loads the LIVE page from
# docalvers.de, so www/ is only the required local fallback. Keeping it in sync means the app
# still opens (offline copy) if the live URL is unreachable.
set -euo pipefail

SRC="$(cd "$(dirname "$0")/../HTML" && pwd)"
DST="$(cd "$(dirname "$0")" && pwd)/www"

rm -rf "$DST"
mkdir -p "$DST/js"

# voicerecorder.html sits at HTML/voicerecorder/ and references ../js/radial-menu.js and js/*.
# In the bundled app index.html sits at the www root, so rewrite ../js/ back to js/.
sed -e 's#\.\./js/#js/#g' \
    "$SRC/voicerecorder/voicerecorder.html" > "$DST/index.html"
cp "$SRC/voicerecorder/voicerecorder.css" "$DST/"
cp "$SRC/voicerecorder/js/"*.js          "$DST/js/"
cp "$SRC/js/radial-menu.js"              "$DST/js/"

echo "Web assets copied: $SRC/voicerecorder/voicerecorder.html -> $DST/index.html"
