#!/bin/bash
# Checks the Vorrechnen week blocks (js/vorrechnen-aufgaben-*.js with a calendar week): every formula with KaTeX
# strictly, every step with sympy. Without arguments all weeks, else the weeks named: ./pruefe.sh 44 45
# A new block: write the file, enter it in HTML/vorrechnen.html (the one list), run this. Only the summary lines and
# "Fehler gesamt: 0" may remain.
cd "$(dirname "$0")" || exit 1
tmp="$(mktemp -t vorrechnen-bloecke).json"
node bloecke.mjs "$tmp" "$@" || exit 1
PYTHONDONTWRITEBYTECODE=1 python3 pruef.py "$tmp" | grep -v "^  ok"
