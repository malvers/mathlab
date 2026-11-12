#!/usr/bin/env python3
"""The training book HTML/buch/pruefung/ from the exam sheets (Doc, 01.11.2026: "ich möchte daraus ein Mathebuch bauen").

    python3 tools/buch-pruefung/build.py            # all chapters, index.html, druck.html, kapitel.js
    python3 tools/buch-pruefung/build.py abi-schar  # only these chapters

Tasks, figures, solutions and traps come unchanged from the generators of the sheets (tools/aufgaben/abi, blf, va): each one
runs here with Sheet.save replaced, so its verify() checks every number and nothing is written to HTML/aufgaben. What a
chapter adds around them (lead, key box, widget, self-checks) stands in kapitel.py; every self-check answer is recomputed
here. Same rule as the other books: run it to frame the chapters, after that the HTML is the source - a later run
overwrites hand edits, so build single chapters only.
"""
import glob
import html as _html
import json
import math
import os
import re
import runpy
import sys
from fractions import Fraction

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.join(HERE, "..", "..")
OUT = os.path.join(REPO, "HTML", "buch", "pruefung")
sys.path.insert(0, os.path.join(REPO, "tools", "aufgaben"))
sys.path.insert(0, HERE)
import textaufgaben as T                                            # noqa: E402

AFB = {1: "AFB I · REPRODUZIEREN", 2: "AFB II · ZUSAMMENHÄNGE", 3: "AFB III · BEURTEILEN"}
TOP = "PRÜFUNGSTRAINING · ABITUR · BLF · VA"
BASE = ["buch-plot.js", "buch-funktionen.js"]
FOOT = ("Doc Alvers Mathe-Labor · Prüfungstraining Mathematik · nach den Aufgabentypen der sächsischen Abitur- und "
        "BLF-Prüfungen und der Vergleichsarbeiten Klasse 11 von 2021/22 bis 2024/25.")
FOOT2 = "Alle Texte, Aufgaben und Abbildungen sind eigene Inhalte. Die Originalprüfungen werden nicht wiedergegeben."


def md(text):
    return T.markup(text)


def esc(text):
    return _html.escape(text, quote=True)


# ---------------------------------------------------------------- sheets ---
def sheets():
    """All 32 sheets as Sheet objects, every verify() run: Abitur, BLF and, since 12.11.2026, the Vergleichsarbeit."""
    got = {}

    def save(self, path=None):
        for fn in self.verifiers:
            fn()
        self.render()
        got[self.name] = self

    T.Sheet.save = save
    for f in sorted(glob.glob(os.path.join(REPO, "tools", "aufgaben", "abi", "*.py"))
                    + glob.glob(os.path.join(REPO, "tools", "aufgaben", "blf", "*.py"))
                    + glob.glob(os.path.join(REPO, "tools", "aufgaben", "va", "*.py"))):
        runpy.run_path(f, run_name="__main__")
    return got


def widget_modules():
    """Which js/buch-*.js registers which widget."""
    out = {}
    for f in sorted(glob.glob(os.path.join(REPO, "HTML", "js", "buch-*.js"))):
        for name in re.findall(r"^\s*(?:Buch\.widget|B\.widget|widget|W)\('([a-zA-Z0-9_-]+)'",
                               open(f, encoding="utf-8").read(), re.M):
            out.setdefault(name, os.path.basename(f))
    return out


# ----------------------------------------------------------- self-checks ---
def number(ans):
    """The value a pupil's answer has to hit, read like parseAnswer() in js/buch.js."""
    s = str(ans).replace(",", ".")
    if "/" in s:
        return float(Fraction(s))
    return float(s)


def check_answer(q):
    ns = {k: getattr(math, k) for k in dir(math) if not k.startswith("_")}
    ns["comb"] = math.comb
    want = eval(q["py"], ns)                                        # the spec is ours, see kapitel.py
    got = number(q["ans"])
    tol = float(q.get("tol") or (0.005 if "/" in str(q["ans"]) or "," in str(q["ans"]) else 1e-9))
    assert abs(want - got) <= tol + 1e-12, "wrong answer %r (computed %r): %s" % (q["ans"], want, q["text"])


def q_html(q):
    check_answer(q)
    tol = (' data-tol="%s"' % q["tol"]) if q.get("tol") else ""
    return ('<div class="b-q" data-ans="%s"%s data-ph="%s"><p class="b-q-text">%s</p>'
            '<div class="b-sol"><p>%s</p></div></div>'
            % (esc(str(q["ans"])), tol, esc(q.get("ph", "Ergebnis")), md(q["text"]), md(q["sol"])))


def check_box(cid, title, qs):
    return ('<div class="b-box b-check" data-check="%s">\n    <div class="b-box-title">%s</div>\n    %s\n</div>'
            % (cid, title, "\n    ".join(q_html(q) for q in qs)))


# ---------------------------------------------------------------- pieces ---
def fig_html(svg, caption):
    # the page has KaTeX's fonts, the copy of the font inside an SVG is only needed where the SVG stands as <img>
    svg = re.sub(r"<style>[^<]*@font-face[^<]*</style>", "", svg)
    cap = "<figcaption>%s</figcaption>" % md(caption) if caption else ""
    return '<figure class="b-fig"><div class="b-fig-blatt">%s</div>%s</figure>' % (svg, cap)


def part_html(text):
    """A part of a task; the multiple-choice parts carry their options after bullets."""
    head, *opts = text.split(" • ")
    out = "<p>%s</p>" % md(head)
    if opts:
        out += '<ul class="b-optionen">%s</ul>' % "".join("<li>%s</li>" % md(o) for o in opts)
    return out


def task_section(n, t):
    parts = []
    last = len(t["parts"]) - 1
    for i, (p, s) in enumerate(zip(t["parts"], t["solution"])):
        extra = "".join(fig_html(*f) for f in t["solfigs"]) if i == last else ""
        parts.append('        <div class="b-task" data-lvl="%d">\n            <div class="b-task-q">%s</div>\n'
                     '            <div class="b-sol"><p>%s</p>%s</div>\n        </div>'
                     % (t["afb"], part_html(p), md(s), extra))
    figs = "\n".join("    " + fig_html(*f) for f in t["figs"])
    return """<section class="b-sec" id="a%d" data-kind="afb%d" data-toc="%s" data-toc-k="%d" data-toc-short="Aufgabe %d">
    <div class="b-band"><span class="b-band-tag">AUFGABE %d</span><span class="b-band-sub">%s</span></div>
    <h2><span class="b-no">%d</span>%s</h2>
    <div class="b-text"><p>%s</p></div>
%s
    <div class="b-tasks" data-abc="%d">
%s
    </div>
</section>""" % (n, t["afb"], esc(re.sub(r"[*$]", "", t["title"])), n, n, n, AFB[t["afb"]], n, md(t["title"]),
                 md(t["intro"]), figs, n, "\n".join(parts))


def lab_cards(items):
    return '<div class="b-labs" style="margin:0">%s</div>' % "".join(
        '<a class="b-lab" href="%s"><span class="b-lab-icon"></span><span><span class="b-lab-name">%s</span>'
        '<span class="b-lab-what">%s</span></span></a>' % (esc(h), n, w) for h, n, w in items)


def merke_box(title, lines, cls="b-merk"):
    return ('<div class="b-box %s">\n    <div class="b-box-title">%s</div>\n    <div class="b-text">%s</div>\n</div>'
            % (cls, title, "".join("<p>%s</p>" % md(x) for x in lines)))


def widget_box(w):
    attrs = "".join(' %s="%s"' % (k, esc(str(v))) for k, v in w.get("attrs", {}).items())
    hlp = '    <p class="b-help" style="margin:0 0 12px">%s</p>\n' % md(w["help"]) if w["help"] else ""
    return ('<div class="b-box b-widget">\n    <div class="b-box-title">%s</div>\n%s    <div data-widget="%s"%s></div>\n</div>'
            % (w["title"], hlp, w["name"], attrs))


def hero_html(h):
    if "svgfrom" in h:                                              # a drawn hero of a sister book
        src = open(os.path.join(REPO, "HTML", "buch", h["svgfrom"]), encoding="utf-8").read()
        return re.search(r'<div class="b-hero-art"><svg.*?</svg></div>', src, re.S).group(0)
    attrs = "".join(" %s='%s'" % (k, v) for k, v in h.items() if k != "widget")
    return '<div class="b-hero-art" data-widget="%s"%s></div>' % (h["widget"], attrs)


PAGE = """<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prüfungstraining · Kapitel __K__ · __TITLE__ | Doc Alvers Mathe-Labor</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
    <link rel="icon" type="image/svg+xml" href="../../resources/favicon.svg">
    <link rel="icon" type="image/png" sizes="256x256" href="../../resources/favicon.png">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
    <link rel="stylesheet" href="../../js/buch.css">
    <script src="../../js/farbschema.js"></script>
</head>
<body class="b-book">

<header class="b-top">
    <a class="b-brand" href="../../index.html"><span class="b-logo" aria-hidden="true"></span><span>Doc Alvers Mathe-Labor</span></a>
    <span class="b-top-book">__TOP__</span>
    <div class="b-progress"></div>
</header>
<nav class="b-strip" aria-label="Kapitel"></nav>

<div class="b-wrap">
    <nav class="b-toc b-scroll" aria-label="Inhalt des Kapitels">
        <p class="b-toc-title">KAPITEL __K__ · __LBUP__</p>
        <div class="b-toc-list"></div>
    </nav>

    <main class="b-main">

__BODY__

<footer class="b-foot">
    <p>__FOOT__</p>
    <p>__FOOT2__</p>
</footer>

    </main>
</div>

<script src="../../js/labs-icons.js"></script>
<script src="../../js/apple-emoji.js"></script>
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js" onload="window.dispatchEvent(new Event('katex-ready'))"></script>
<script src="kapitel.js"></script>
<script src="../../js/buch.js"></script>
__SCRIPTS__
</body>
</html>
"""


def scripts(mods):
    return "\n".join('<script src="../../js/%s"></script>' % m for m in mods)


def modules_of(c, where):
    names = re.findall(r'data-widget="([a-zA-Z0-9_-]+)"', c)
    mods = list(BASE)
    for n in names:
        assert n in where, "unknown widget " + n
        if where[n] not in mods:
            mods.append(where[n])
    return mods


def frame(k, title, lb, body, where):
    return (PAGE.replace("__K__", str(k)).replace("__TITLE__", esc(title)).replace("__TOP__", TOP)
            .replace("__LBUP__", esc(lb.upper())).replace("__BODY__", body).replace("__FOOT__", FOOT)
            .replace("__FOOT2__", FOOT2).replace("__SCRIPTS__", scripts(modules_of(body, where))))


def auftakt(c):
    chips = "".join('<span class="b-chip">%s</span>' % x for x in c["chips"])
    pruef = "".join("<li>%s</li>" % md(x) for x in c["pruef"])
    return """<section class="b-sec" id="auftakt" data-toc="Auftakt" data-toc-k="A" data-toc-short="Auftakt" style="margin-top:0">
    <div class="b-hero">
        <div>
            <p class="b-kicker">KAPITEL %s · %s · %s</p>
            <h1>%s</h1>
            <p class="b-hero-lead">%s</p>
            <div class="b-chips">%s</div>
        </div>
        %s
    </div>
    <div class="b-grid2">
        <div class="b-box">
            <div class="b-box-title">DAS WIRD GEPRÜFT</div>
            <div class="b-text"><ul>%s</ul></div>
        </div>
        %s
    </div>
</section>""" % (c["k"], esc(c["lb"].upper()), esc(c["when"].upper()), esc(c["title"]), md(c["lead"]), chips,
                 hero_html(c["hero"]), pruef, check_box("checkin", "CHECK-IN: DAS BRAUCHST DU", c["checkin"]))


def werkzeug(c):
    boxes = [merke_box(c["merke"][0], c["merke"][1])]
    if c.get("methode"):
        boxes.append(merke_box(c["methode"][0], c["methode"][1], "b-methode"))
    boxes.extend(widget_box(w) for w in c["widgets"])
    labs = ""
    if c.get("repeat"):
        labs = ('    <div class="b-box">\n        <div class="b-box-title">ZUM WIEDERHOLEN</div>\n        %s\n    </div>\n'
                % lab_cards(c["repeat"]))
    return """<section class="b-sec" id="werkzeug" data-kind="le" data-toc="Werkzeugkasten" data-toc-k="W" data-toc-short="Werkzeug">
    <div class="b-band"><span class="b-band-tag">WERKZEUGKASTEN</span><span class="b-band-sub">DAS BRAUCHST DU FÜR DIESES KAPITEL</span></div>
    %s
%s</section>""" % ("\n    ".join(boxes), labs)


def rueckblick(c, tasks):
    rows = []
    for i, t in enumerate(tasks):
        rows.append('    <div class="b-rueck"><div><h4>AUFGABE %d · %s</h4><p>%s</p></div>\n        <div><p><b>Falle:</b> %s</p></div></div>'
                    % (i + 1, md(t["title"].upper()), md(c["kern"][i]), md(t["falle"])))
    return """<section class="b-sec" id="rueckblick" data-kind="rueckblick" data-toc="Rückblick" data-toc-k="R" data-toc-short="Rückblick">
    <div class="b-band"><span class="b-band-tag">RÜCKBLICK</span><span class="b-band-sub">DIE IDEE UND DIE FALLE</span></div>
%s
</section>""" % "\n".join(rows)


def test(c):
    half = (len(c["test"]) + 1) // 2
    return """<section class="b-sec" id="test" data-kind="test" data-toc="Test" data-toc-k="T" data-toc-short="Test">
    <div class="b-band"><span class="b-band-tag">TEST</span><span class="b-band-sub">DIESELBEN IDEEN, NEUE ZAHLEN</span></div>
    <div class="b-grid2">
        %s
        %s
    </div>
</section>""" % (check_box("test1", "RUNDE 1", c["test"][:half]), check_box("test2", "RUNDE 2", c["test"][half:]))


def chapter(c, sheet, where):
    assert len(c["kern"]) == 3, c["file"]
    body = "\n\n".join([auftakt(c), werkzeug(c)]
                       + [task_section(i + 1, t) for i, t in enumerate(sheet.tasks)]
                       + [rueckblick(c, sheet.tasks), test(c)])
    return frame(c["k"], c["title"], c["lb"], body, where)


def overview(c, where):
    body = c["body"]
    return frame(c["k"], c["title"], c["lb"], body, where)


def kapitel_js(book, widmung=""):
    rows = []
    for c in book:
        rows.append("        { file: %s, lb: %s, k: %s, title: %s,\n          sub: %s, when: %s, ustd: 0 }"
                    % (js(c["file"] + ".html"), js(c["lb"]), js(str(c["k"])), js(c["title"]), js(c["sub"]), js(c["when"])))
    return ("/* kapitel.js — the chapters of the training book, Abitur first, then the BLF, then the Vergleichsarbeit. Written by\n"
            " * tools/buch-pruefung/build.py.\n"
            " * Single source for the table of contents (index.html) and the previous/next cards at the end of every chapter.\n"
            " */\nwindow.BUCH = {\n    title: 'Prüfungstraining Mathematik · Abitur, BLF und Vergleichsarbeit',\n    short: 'Prüfungstraining',\n"
            + ("    // the dedication page at the front of the print edition (js/buch-druck.js), kapitel.py WIDMUNG\n"
               "    widmung: %s,\n" % js(widmung) if widmung else "")
            + "    description: 'Interaktives Übungsbuch für die Prüfungen in Sachsen: Abitur am Beruflichen Gymnasium, Besondere "
            "Leistungsfeststellung in Klasse 10 und Vergleichsarbeit in Klasse 11 am Beruflichen Gymnasium, %d Kapitel mit %d Aufgaben "
            "im Prüfungsformat, Lösungen, Fallen, Widgets und Selbsttests.',\n"
            "    chapters: [\n%s\n    ]\n};\n" % (len(book), sum(1 for c in book if "sheet" in c) * 3, ",\n".join(rows)))


def js(s):
    return "'" + s.replace("\\", "\\\\").replace("'", "\\'") + "'"


def main():
    import kapitel
    only = set(sys.argv[1:])
    where = widget_modules()
    got = sheets()
    assert len(got) == 32, len(got)
    used = {c["sheet"] for c in kapitel.BUCH if "sheet" in c}
    assert used == set(got), "sheets without a chapter: %s" % (set(got) - used)
    os.makedirs(OUT, exist_ok=True)
    mods, n_q = list(BASE), 0
    for c in kapitel.BUCH:
        page = chapter(c, got[c["sheet"]], where) if "sheet" in c else overview(c, where)
        n_q += page.count('class="b-q"')
        for m in modules_of(page, where):
            if m not in mods:
                mods.append(m)
        if not only or c["file"] in only:
            open(os.path.join(OUT, c["file"] + ".html"), "w", encoding="utf-8").write(page)
    open(os.path.join(OUT, "kapitel.js"), "w", encoding="utf-8").write(kapitel_js(kapitel.BUCH, getattr(kapitel, "WIDMUNG", "")))
    for name in ("index.html", "druck.html"):
        tpl = open(os.path.join(HERE, name + ".tpl"), encoding="utf-8").read()
        n_tasks = sum(len(got[c["sheet"]].tasks) for c in kapitel.BUCH if "sheet" in c)
        open(os.path.join(OUT, name), "w", encoding="utf-8").write(tpl.replace("__SCRIPTS__", scripts(mods))
                                                                  .replace("__N__", str(len(kapitel.BUCH)))
                                                                  .replace("__TASKS__", str(n_tasks)))
    print("%d chapters, %d self-check questions, all recomputed" % (len(kapitel.BUCH), n_q))


if __name__ == "__main__":
    main()
