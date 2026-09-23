#!/usr/bin/env python3
"""How wide a word really is in Raleway - measured once, not estimated.

A figure that draws a plate around its own text has to know the text width, and guessing it
from character classes was up to 12 % off, which shows as an uneven gap (Doc, 23.09.2026:
"achte bitte auf die gaps x & y -> gleich"). raleway-breiten.json holds the advance width of
every glyph the decks use at 100 px, for weight 400 and 600.

Measured by tools/pptx/messung-raleway.html: copy it next to a deck (it needs deck.css beside
it) and open it, then put the JSON it prints into raleway-breiten.json. It measures inside a
real <p class="fl"> label, which matters - measuring the same font in a bare span, or with
canvas measureText, came out 8 to 10 % narrow. Checked against whole words: under 1 % off.

    from textmass import breite
    breite("Das Zweistromland", 15, 600)   # -> 136.6 px

Kerning is ignored - it stays below a pixel at these sizes.
"""
import json
import os

_PFAD = os.path.join(os.path.dirname(os.path.abspath(__file__)), "raleway-breiten.json")
_TAB = None


def _tabelle():
    global _TAB
    if _TAB is None:
        with open(_PFAD, encoding="utf-8") as f:
            _TAB = json.load(f)
    return _TAB


def breite(text, size, weight=400):
    """Width of `text` in px. Unknown glyphs are billed as an 'n'."""
    tab = _tabelle()[str(600 if weight >= 600 else 400)]
    ersatz = tab.get("n", 55.0)
    return sum(tab.get(ch, ersatz) for ch in text) * size / 100.0


# A line box is 1.28 x the type size (deck.css), but the letters only fill the middle of it.
# This is the empty part above the capitals and below the baseline, per side, as a share of the
# size - subtracting it is what makes a plate's visible gap the same above as beside the text.
LUFT = 0.26


def zeilenhoehe(size):
    return size * 1.28
