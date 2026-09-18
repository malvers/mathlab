#!/bin/bash
# Watcher for the film review tool (tools/filmkritik.py): waits for the FINAL submit and lets Solita thank - once.
#
#     tools/filmkritik_waechter.sh [film-dir]        default: ~/Movies/videopipeline/vektoren
#
# Run it OUTSIDE the agent's sandbox - inside, afplay exits 0 and stays silent.
#
# "Final" (Doc, 18.09.2026, class 9b: "der Kommentar von ihr kam zu zeitig ... erst nach dem Abschicken"): he had
# pressed ABSCHICKEN after every remark and Solita thanked after the first one. So fertig.json only counts when it
# has been lying there for WAIT seconds (20) and no remark was saved after it. When the review goes on - the film
# plays on, a new remark starts - the page takes the submit back and the server removes fertig.json again.
#
# This file lives in the repo on purpose: the first watcher was an inline loop in a chat session and could not
# be found again two hours later. VOL sets the volume (70 = classroom), DRY=1 only prints.
DIR="${1:-$HOME/Movies/videopipeline/vektoren}"
K="$DIR/kritik"
WAIT="${WAIT:-20}"
VOL="${VOL:-70}"
echo "Wächter läuft: $K (dankt $WAIT s nach dem endgültigen Abschicken)"
while true; do
  if [ -f "$K/fertig.json" ]; then
    now=$(date +%s)
    f=$(stat -f %m "$K/fertig.json" 2>/dev/null || echo "$now")
    j=$(stat -f %m "$K/kritik.json" 2>/dev/null || echo 0)
    if [ $((now - f)) -ge "$WAIT" ] && [ "$j" -le "$f" ]; then
      n=$(python3 -c "import json,sys; print(json.load(open(sys.argv[1])).get('anzahl',0))" "$K/fertig.json" 2>/dev/null || echo 0)
      if [ "$n" -gt 0 ]; then
        if [ -n "$DRY" ]; then echo "(DRY) würde danke.mp3 mit Lautstärke $VOL spielen"
        else osascript -e "set volume output volume $VOL without output muted"; afplay "$DIR/solita/danke.mp3"; fi
        echo "ABGESCHICKT mit $n Kommentaren um $(date +%H:%M:%S) — Solita hat gedankt: $(tr -d '\n' < "$K/fertig.json")"
      else
        echo "ABGESCHICKT ohne Kommentare um $(date +%H:%M:%S) — kein Dank"
      fi
      exit 0
    fi
  fi
  sleep 2
done
