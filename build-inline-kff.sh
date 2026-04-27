#!/usr/bin/env bash
# Liegt eine Etage über orbitals/ — baut den KFF-<script type="module">-Block in orbitals.html
# aus orbitals/orbital-math.js + orbitals/main.js.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
HTML="$ROOT/orbitals.html"
MATH="$ROOT/orbitals/orbital-math.js"
MAIN="$ROOT/orbitals/main.js"
TMPM="$(mktemp)"
trap 'rm -f "$TMPM"' EXIT

tail -n +9 "$MAIN" > "$TMPM"
LINE=$(grep -n '^fillOrbitalSelect();$' "$TMPM" | head -1 | cut -d: -f1) || {
  echo "fillOrbitalSelect(); nicht in $MAIN (ab Zeile 9)" >&2
  exit 1
}
DEFS="$(mktemp)"
TAIL="$(mktemp)"
trap 'rm -f "$TMPM" "$DEFS" "$TAIL"' EXIT
head -n $((LINE - 1)) "$TMPM" > "$DEFS"
tail -n +$LINE "$TMPM" > "$TAIL"

FRAG="$(mktemp)"
trap 'rm -f "$TMPM" "$DEFS" "$TAIL" "$FRAG"' EXIT
{
  cat <<'HEADER'
import * as THREE from "three";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

HEADER
  sed 's/^export //' "$MATH"
  cat "$DEFS"
  {
    echo "try {"
    sed 's/^/  /' "$TAIL"
    echo '  window.dispatchEvent(new Event("resize"));'
    echo "} catch (e) {"
    echo '  const el = document.getElementById("kff-error");'
    echo "  if (el) {"
    echo "    el.hidden = false;"
    # shellcheck disable=SC2016
    echo '    el.innerHTML = "<strong>KFF konnte nicht starten.</strong><br>Prüfe die Netzwerkverbindung (Three.js) oder die Konsole." + "<br><br><small style=\"opacity:0.85\">" + (e && e.message ? e.message : String(e)) + "</small>";'
    echo "  }"
    echo "  console.error(e);"
    echo "}"
  }
} | perl -pe 's#</script#"<" + "script"#gi' > "$FRAG"

START=$(grep -n '    <script type="module">' "$HTML" | head -1 | cut -d: -f1) || {
  echo "orbitals.html: <script type=\"module\"> fehlt" >&2
  exit 1
}
END=$(awk -v s="$START" 'NR > s && /^    <\/script>$/ { print NR; exit }' "$HTML") || true
if [[ -z "${END:-}" ]]; then
  echo "orbitals.html: schließendes </script> nach KFF-Modul fehlt" >&2
  exit 1
fi

OUT="$(mktemp)"
trap 'rm -f "$TMPM" "$DEFS" "$TAIL" "$FRAG" "$OUT"' EXIT
{
  head -n $((START - 1)) "$HTML"
  echo '    <script type="module">'
  sed 's/^/        /' "$FRAG"
  echo '    </script>'
  tail -n +$((END + 1)) "$HTML"
} > "$OUT"
mv "$OUT" "$HTML"
echo "ok  $HTML  (KFF-Modul: Zeilen $START–$END ersetzt)"
trap - EXIT
rm -f "$TMPM" "$DEFS" "$TAIL" "$FRAG"
