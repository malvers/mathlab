"""How a text of an HTML deck is written: the one formatter for html_deck.py (build) and deck_edit.py (browser edit).

Kept free of design_lib and PIL on purpose: serve.py imports it through deck_edit.py, and the LaunchAgent's
Python cannot load PIL (Doc's Mac, 17.09.2026: x86_64 wheel under an arm64 Python).
"""
import html as _html
import re

# the slides of a deck page sit between these two - reshell and the editor cut there
_DECK_START = '<div id="stage"><div id="deck">\n'
_DECK_END = '\n</div></div>\n<div id="bar"></div>'


_B_OPEN, _B_CLOSE = "\x02", "\x03"   # a **...** around a formula, kept through the split at $
# one of our little pictures in a text (HTML/svp/emo, the Fahrplan's cow): <emo:kuh.webp>, as tall as the letters
# (deck.css img.emo) - only a plain name from that folder, nothing else gets in
_EMO = re.compile(r"&lt;emo:([a-z0-9-]+)\.(webp|png)&gt;")


def _emo(m):
    return '<img class="emo" src="../svp/emo/%s.%s" alt="%s">' % (m.group(1), m.group(2), m.group(1))


def _tex_spans(text):
    """$...$ becomes a KaTeX placeholder, everything else is escaped text.
    **...** around a formula ("heißt **mal $1{,}15$**") is paired over the whole text first - split at $,
    each half kept a lone ** and printed it as it is (Doc, 17.09.2026). Pairs without a formula stay
    with _bold, so every other line keeps its markup byte for byte."""
    text = re.sub(r"\*\*((?:[^*$]|\*(?!\*)|\$[^$]*\$)+?)\*\*",
                  lambda m: _B_OPEN + m.group(1) + _B_CLOSE if "$" in m.group(1) else m.group(0), text)
    out = []
    for i, part in enumerate(re.split(r"\$([^$]*)\$", text)):
        if i % 2:
            out.append('<span class="tex" data-tex="%s"></span>'
                       % _html.escape(part, quote=True))
        else:
            out.append(_bold(part).replace(_B_OPEN, "<b>").replace(_B_CLOSE, "</b>"))
    return "".join(out)


def _bold(part):
    """**word** becomes bold; <b>, <i>, <u>, <s> and the <c2>/<f3> tags survive.

    Nine colours <c1>..<c9> and four typefaces <f1>..<f4> - the toolbar over the slide writes them
    (Doc, 22.09.2026: "deutlich mehr ... Farben etc. Fonts ... Raleway Times etc."). The three colours
    that were here first keep their numbers, so every deck built before reads exactly as before.
    Nine type sizes <z1>..<z9> (z1-z4 smaller, z5-z9 larger than the text around them, deck.css) - the small and
    big A step through them for the marked words only (Doc, 05.10.2026: "das, was selektiert ist, soll größer
    gemacht werden ... So wie es immer ist"). <m1> is the marker and <emo:kuh.webp> one of the Fahrplan's
    pictures - the rest of the Fahrplan's tools in the deck bar (Doc, 05.10.2026: "alles, was dort ist, auch hierher").
    """
    esc = _html.escape(part, quote=False)
    esc = re.sub(r"\*\*((?:[^*]|\*(?!\*))+?)\*\*", r"<b>\1</b>", esc)   # a lone * may sit inside: **COUNT(*)**
    esc = re.sub(r"&lt;(/?)([bius])&gt;", r"<\1\2>", esc)
    esc = re.sub(r"&lt;([cfmz])([1-9])&gt;", r'<span class="\1\2">', esc)
    esc = re.sub(r"&lt;/[cfmz][1-9]&gt;", "</span>", esc)
    return _EMO.sub(_emo, esc)


def markup(text):
    return _tex_spans(text) if "$" in text else _bold(text)
