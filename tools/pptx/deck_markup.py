"""How a text of an HTML deck is written: the one formatter for html_deck.py (build) and deck_edit.py (browser edit).

Kept free of design_lib and PIL on purpose: serve.py imports it through deck_edit.py, and the LaunchAgent's
Python cannot load PIL (Doc's Mac, 17.09.2026: x86_64 wheel under an arm64 Python).
"""
import html as _html
import re

# the slides of a deck page sit between these two - reshell and the editor cut there
_DECK_START = '<div id="stage"><div id="deck">\n'
_DECK_END = '\n</div></div>\n<div id="bar"></div>'


def _tex_spans(text):
    """$...$ becomes a KaTeX placeholder, everything else is escaped text."""
    out = []
    for i, part in enumerate(re.split(r"\$([^$]*)\$", text)):
        if i % 2:
            out.append('<span class="tex" data-tex="%s"></span>'
                       % _html.escape(part, quote=True))
        else:
            out.append(_bold(part))
    return "".join(out)


def _bold(part):
    """**word** becomes bold; <b>, <i> and the <c2>/<c3> colour tags survive."""
    esc = _html.escape(part, quote=False)
    esc = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", esc)
    esc = esc.replace("&lt;b&gt;", "<b>").replace("&lt;/b&gt;", "</b>")
    esc = esc.replace("&lt;i&gt;", "<i>").replace("&lt;/i&gt;", "</i>")
    esc = re.sub(r"&lt;c([123])&gt;", r'<span class="c\1">', esc)
    return esc.replace("&lt;/c1&gt;", "</span>").replace("&lt;/c2&gt;", "</span>") \
              .replace("&lt;/c3&gt;", "</span>")


def markup(text):
    return _tex_spans(text) if "$" in text else _bold(text)
