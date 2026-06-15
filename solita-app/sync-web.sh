#!/usr/bin/env bash
# Copy the tracker web assets from the forloop repo into www/ (single source of truth).
# tracker.html stays the ONE source — never hand-edit www/. Re-run this after changing
# tracker.html or cyber-clock.*, then `npx cap sync`.
set -euo pipefail

SRC="$(cd "$(dirname "$0")/../HTML" && pwd)"
DST="$(cd "$(dirname "$0")" && pwd)/www"

rm -rf "$DST"
mkdir -p "$DST/js" "$DST/resources"

# The app now lives in HTML/tracker/ and references ../js, ../resources. In the bundled
# app index.html sits at the www root, so rewrite ../ back to root-relative paths.
sed -e 's#\.\./js/#js/#g' -e 's#\.\./resources/#resources/#g' \
    "$SRC/tracker/tracker.html" > "$DST/index.html"
cp "$SRC/tracker/tracker.css"   "$DST/"
cp "$SRC/js/track-render.js"    "$DST/js/"
cp "$SRC/js/track-buffer.js"    "$DST/js/"
cp "$SRC/js/cyber-clock.js"     "$DST/js/"
cp "$SRC/js/cyber-clock.css"    "$DST/js/"
cp "$SRC/resources/favicon.png" "$DST/resources/" 2>/dev/null || true

echo "Web assets copied: $SRC/tracker/tracker.html -> $DST/index.html"
