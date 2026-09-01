#!/bin/bash
# "Ist mein Stand oben?" - vergleicht lokale Dateien mit docalvers.de.
#
# Warum: ein Push von der Kommandozeile stoesst GitHub Pages NICHT an, und Pages
# liefert alles mit cache-control: max-age=600 aus. Beides sieht im Browser gleich
# aus - "die Aenderung ist nicht da" - hat aber verschiedene Ursachen. Dieses
# Skript trennt sie, statt zu raten (Doc, 01.09.2026).
#
# Doppelklick im Finder prueft die Dateien des letzten Commits, oder:
#   bash tools/live-check.command                       # letzter Commit
#   bash tools/live-check.command HTML/svp/svp-plan.js  # bestimmte Dateien
#   bash tools/live-check.command --dirty               # alles Geaenderte im Baum
#
# Lesart der Ausgabe:
#   gleich    - oben liegt genau deine Datei
#   ALT       - oben liegt etwas anderes: Deploy fehlt oder laeuft noch
#   FEHLT     - die Datei gibt es oben gar nicht (noch nie deployed?)

cd "$(dirname "$0")/.."
BASE="https://docalvers.de"

# docalvers.de servt HTML/ als Wurzel - der Pfad oben ist also der ohne HTML/.
live_url() { printf '%s/%s' "$BASE" "${1#HTML/}"; }

case "$1" in
  --dirty) FILES=$(git status --porcelain -- 'HTML/*' | awk '{print $2}') ;;
  "")      FILES=$(git diff-tree --no-commit-id --name-only -r HEAD -- 'HTML/*') ;;
  *)       FILES="$*" ;;
esac

# --- 1. Ist der lokale Stand ueberhaupt gepusht? ---------------------------
git fetch --quiet origin 2>/dev/null
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main 2>/dev/null)
echo
if [ "$LOCAL" = "$REMOTE" ]; then
  echo "Git:   HEAD ist auf origin/main  ($(git log -1 --format='%h %s' | cut -c1-60))"
else
  AHEAD=$(git rev-list --count origin/main..HEAD 2>/dev/null)
  echo "Git:   $AHEAD Commit(s) NICHT gepusht - oben kann dein Stand gar nicht liegen."
fi

# --- 2. Laeuft/lief der Pages-Deploy? --------------------------------------
if command -v gh >/dev/null 2>&1; then
  RUN=$(gh run list --workflow=deploy-pages.yml --limit 1 \
        --json status,conclusion,createdAt -q '.[0] | .status+" "+(.conclusion//"-")+"  "+.createdAt' 2>/dev/null)
  [ -n "$RUN" ] && echo "Pages: letzter Deploy: $RUN"
fi

# --- 3. Datei fuer Datei vergleichen ---------------------------------------
if [ -z "$FILES" ]; then
  echo
  echo "Keine Dateien zu pruefen."
  exit 0
fi

echo
BAD=0
for f in $FILES; do
  [ -f "$f" ] || continue
  MINE=$(shasum -a 256 "$f" | cut -c1-16)
  URL=$(live_url "$f")
  # Cache-Buster, sonst antwortet ein Zwischenspeicher statt des Servers
  CODE=$(curl -s -o /tmp/_lc_body -w '%{http_code}' -H 'Cache-Control: no-cache' "$URL?_=$RANDOM$$")
  if [ "$CODE" != "200" ]; then
    printf '  %-52s FEHLT (HTTP %s)\n' "${f#HTML/}" "$CODE"
    BAD=$((BAD+1)); continue
  fi
  THEIRS=$(shasum -a 256 /tmp/_lc_body | cut -c1-16)
  if [ "$MINE" = "$THEIRS" ]; then
    printf '  %-52s gleich\n' "${f#HTML/}"
  else
    LM=$(curl -sI "$URL" | awk -F': ' 'tolower($1)=="last-modified"{print $2}' | tr -d '\r')
    printf '  %-52s ALT   (oben: %s)\n' "${f#HTML/}" "${LM:-unbekannt}"
    BAD=$((BAD+1))
  fi
  rm -f /tmp/_lc_body
done

echo
if [ "$BAD" -eq 0 ]; then
  echo "Alles oben aktuell."
else
  echo "$BAD Datei(en) nicht aktuell."
  echo "Naechster Schritt: git push, dann  gh workflow run deploy-pages.yml  (ein CLI-Push loest Pages nicht aus)."
fi
