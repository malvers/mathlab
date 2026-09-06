#!/bin/bash
# Builds the whole focus-timer deck, one slide per duration given in minutes.
#   ./build.sh ~/Desktop/focus-timer.pptx 15s 20s 25s 2 3 5 10
# Plain numbers are minutes, an s suffix means seconds.
# The countdown numerals are baked per duration, so a different length means rebuilding.
# MEDIA=<dir> says where lake_loop.mp4 and focus_audio.m4a live - they are not in the repo.
# LONGSTEP=n sets the interval above 10 min (default 60). STEP=n forces one for all; by default it is per second up to 10 min, then whole minutes.
set -e
OUT="$1"; shift
MINS=("$@")
HERE="$(cd "$(dirname "$0")" && pwd)"
NAME="$(basename "$OUT")"


# Close ONLY our own document if it happens to be open. Never "close every presentation":
# other sessions use PowerPoint too, and their unsaved edits live in memory only.
osascript -e "tell application \"Microsoft PowerPoint\"
 repeat with pp in presentations
  if (name of pp) is \"$NAME\" then close pp saving no
 end repeat
end tell" >/dev/null 2>&1 || true
python3 "$HERE/build_focus_slide.py" ${STEP:+--step=$STEP} ${LONGSTEP:+--longstep=$LONGSTEP} --media="${MEDIA:-$HERE}" "$OUT" "${MINS[@]}"
# the builder sorts and de-duplicates, so the durations come back from it
SECS=$(python3 -c "import json,sys; print(','.join(str(float(x)) for x in json.load(open(sys.argv[1]))))" "${OUT%.pptx}.seconds.json")
osascript "$HERE/finish.applescript" "$OUT" "$NAME" "$SECS" >/dev/null
osascript -e "tell application \"Microsoft PowerPoint\" to close presentation \"$NAME\" saving no" >/dev/null
python3 "$HERE/post_fix.py" "$OUT"
echo "ready: $OUT"
