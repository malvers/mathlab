#!/usr/bin/env bash
# PNG-Reihe unter HTML/resources/fractals → MP4 (ffmpeg).
# Standard-Eingaben: mandelbrot-zoom-step-*.png (beliebige Lücken in der Nummerierung OK).
#
#   ./fractals_png_sequence_to_mp4.sh
#   ./fractals_png_sequence_to_mp4.sh /pfad/zum/ordner 24 ausgabe.mp4

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HTML_DIR="$(dirname "$SCRIPT_DIR")"
DEFAULT_DIR="$HTML_DIR/resources/fractals"

DIR="${1:-$DEFAULT_DIR}"
FPS="${2:-30}"
OUT="${3:-}"

cd "$DIR"

shopt -s nullglob
FILES=()
while IFS= read -r line; do
    FILES+=("$line")
done < <(printf '%s\n' mandelbrot-zoom-step-*.png | LC_ALL=C sort -V)
shopt -u nullglob

if ((${#FILES[@]} == 0)); then
    echo "Keine mandelbrot-zoom-step-*.png in $DIR" >&2
    exit 1
fi

if [[ -z "$OUT" ]]; then
    OUT="$DIR/mandelbrot-zoom-from-png.mp4"
else
    [[ "$OUT" == /* ]] || OUT="$DIR/$OUT"
fi

TMP="$(mktemp)"
cleanup() { rm -f "$TMP"; }
trap cleanup EXIT

LAST="${FILES[${#FILES[@]} - 1]}"
for f in "${FILES[@]}"; do
    printf "file '%s'\n" "$DIR/$f" >>"$TMP"
    printf "duration %s\n" "$(awk -v fps="$FPS" 'BEGIN { printf "%.6f", 1/fps }')" >>"$TMP"
done
printf "file '%s'\n" "$DIR/$LAST" >>"$TMP"

ffmpeg -y -hide_banner -loglevel warning \
    -f concat -safe 0 -i "$TMP" \
    -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" \
    -c:v libx264 -pix_fmt yuv420p -crf 18 \
    "$OUT"

echo "Geschrieben: $OUT (${#FILES[@]} Frames @ ${FPS} fps)"
