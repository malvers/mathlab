#!/usr/bin/env python3
"""Textaufgaben sheet -> HTML (one page per week, three tasks, AFB I-III, with solutions).

    from textaufgaben import Sheet
    s = Sheet("mathe11-nichtlinear", "Nichtlineare Gleichungen, Prozent, Binome", kw=37)
    s.task("Das E-Bike im Angebot", 1, intro, [parts...], solution=[...], falle="...")
    s.verify(lambda: check_numbers())      # Python asserts on every number in the solutions
    s.save()                               # -> HTML/aufgaben/mathe11-nichtlinear-textaufgaben.html

Text markup: **fett** -> <b>, $...$ stays for KaTeX in the browser (write raw strings, r"...",
so \\, and \\approx survive - a plain "\\a" is a BEL character and shows up as a blank box).
Layout, palette and type follow the deck generator (tools/pptx/design_lib.py), one look for
slides, quizzes and worksheets. Content stays in the per-week script next to this file.
"""
import html as _html
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(HERE, "..", "..", "HTML", "aufgaben")
KATEX = "../morpheus/vendor/katex"

AFB = {1: ("I", "Reproduzieren"), 2: ("II", "Zusammenhänge herstellen"), 3: ("III", "Reflektieren und Beurteilen")}


def markup(text):
    """Escape HTML, keep $...$ untouched for KaTeX, turn **x** into <b>x</b>.

    Bold is applied AFTER joining, so that it may span a formula - "**Zimmer $1$**"
    has its two markers in different pieces of the split and would otherwise survive
    as literal asterisks on the page (found 07.09.2026 in the Hilbert sheet)."""
    # every part is escaped, formulas included - a "<" inside $...$ would otherwise
    # swallow the rest of the line as a pseudo tag (found 07.09.2026 by check-sheet.mjs)
    joined = "".join(_html.escape(part, quote=False)
                     for part in re.split(r"(\$[^$]*\$)", text))
    assert "**" not in re.sub(r"\*\*(.+?)\*\*", "", joined, flags=re.S), \
        "unpaired ** in: " + text[:80]
    return re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", joined, flags=re.S)


class Sheet:
    def __init__(self, name, title, kw, klasse="Berufliches Gymnasium · Klasse 11"):
        assert re.fullmatch(r"[a-z0-9-]+", name), "lowercase names only: " + name
        self.name, self.title, self.kw, self.klasse = name, title, kw, klasse
        self.tasks = []
        self.verifiers = []

    def task(self, title, afb, intro, parts, solution, falle=None):
        assert afb in AFB, "afb must be 1, 2 or 3"
        assert 2 <= len(parts) <= 4, "2 to 4 parts per task"
        assert len(parts) == len(solution), "one solution paragraph per part (%s)" % title
        for s in solution:
            assert s.strip(), "empty solution in " + title
        self.tasks.append(dict(title=title, afb=afb, intro=intro, parts=list(parts),
                               solution=list(solution), falle=falle))

    def verify(self, fn):
        """Register a function with plain asserts - every number in the solutions gets
        recomputed here, so a typo in the prose cannot survive save()."""
        self.verifiers.append(fn)

    # ---------------------------------------------------------------- output --
    def _task_html(self, n, t):
        num, name = AFB[t["afb"]]
        parts = "\n".join("      <li>%s</li>" % markup(p) for p in t["parts"])
        return """  <section class="task afb%d">
    <div class="task-head"><h2>%s</h2><span class="afb">AFB <b>%s</b> · %s</span></div>
    <p>%s</p>
    <ol class="parts">
%s
    </ol>
  </section>""" % (t["afb"], markup(t["title"]), num, name, markup(t["intro"]), parts)

    def _sol_html(self, n, t):
        lines = "\n".join('      <p><b>%s)</b> %s</p>' % ("abcd"[i], markup(s))
                          for i, s in enumerate(t["solution"]))
        falle = ('\n      <p class="why">%s</p>' % markup(t["falle"])) if t["falle"] else ""
        return """    <div class="sol">
      <h3>%d · %s</h3>
%s%s
    </div>""" % (n, markup(t["title"]), lines, falle)

    def render(self):
        assert [t["afb"] for t in self.tasks] == [1, 2, 3], "exactly three tasks, AFB I, II, III in this order"
        tasks = "\n\n".join(self._task_html(i + 1, t) for i, t in enumerate(self.tasks))
        sols = "\n\n".join(self._sol_html(i + 1, t) for i, t in enumerate(self.tasks))
        sub = "%s · KW %s · drei Aufgaben, Anforderungsbereiche I bis III" % (self.klasse, self.kw)
        desc = ("Drei Textaufgaben mit Lösungen zu „%s“, KW %s: je eine Aufgabe für die "
                "Anforderungsbereiche I, II und III." % (self.title, self.kw))
        return (PAGE.replace("__TITLE__", _html.escape(self.title, quote=False))
                    .replace("__DESC__", _html.escape(desc, quote=True))
                    .replace("__SUB__", _html.escape(sub, quote=False))
                    .replace("__KATEX__", KATEX)
                    .replace("__CSS__", CSS)
                    .replace("__TASKS__", tasks)
                    .replace("__SOLS__", sols)
                    .replace("__JS__", JS))

    def save(self, path=None):
        assert self.verifiers, "no verify() registered - every sheet recomputes its numbers"
        for fn in self.verifiers:
            fn()
        page = self.render()
        for ch in page:
            assert ch == "\n" or ch == "\t" or ord(ch) >= 32, "control character in text (missing r-prefix?)"
        os.makedirs(OUT_DIR, exist_ok=True)
        path = path or os.path.join(OUT_DIR, self.name + "-textaufgaben.html")
        with open(path, "w", encoding="utf-8") as f:
            f.write(page)
        print("%s  (%d Aufgaben, %d Teilaufgaben)" % (os.path.normpath(path), len(self.tasks),
                                                     sum(len(t["parts"]) for t in self.tasks)))
        return path


# --------------------------------------------------------------- template ----
CSS = """
/* Palette and type follow the deck generator (tools/pptx/design_lib.py) - one look for
   slides, quizzes and worksheets. Light page on purpose: this sheet gets printed. */
:root{
  --ink:#0E244E; --body:#2C3C60; --muted:#6E7E9F; --card:#FFFFFF;
  --orange:#F5C242; --red:#B02418; --green:#799E31; --page:#EEF2F8;
}
*{box-sizing:border-box;margin:0;padding:0}
html{background:var(--page)}
body{font-family:Raleway,system-ui,sans-serif;color:var(--body);background:var(--page);
  line-height:1.45;font-size:17px}
h1,h2,h3,.afb,.brand,.btn{font-family:Orbitron,system-ui,sans-serif}
.sheet{max-width:820px;margin:0 auto;padding:32px 22px 60px}

/* header */
.brand{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:var(--red);font-weight:700}
h1{font-size:clamp(22px,4.2vw,32px);color:var(--ink);line-height:1.12;margin:10px 0 6px;letter-spacing:-.3px}
.sub{color:var(--muted);font-size:15px}
.rules{width:64px;height:3px;margin:16px 0 26px;position:relative}
.rules::before,.rules::after{content:"";position:absolute;top:0;height:3px}
.rules::before{left:0;width:44px;background:var(--orange)}
.rules::after{left:50px;width:14px;background:var(--green)}
.tools{display:flex;gap:10px;flex-wrap:wrap;margin:0 0 28px}
.btn{font-size:11px;letter-spacing:1px;color:var(--ink);background:var(--card);cursor:pointer;
  border:.75px solid rgba(14,36,78,.22);border-radius:4px;padding:8px 12px;text-decoration:none}
.btn:hover{border-color:var(--red);color:var(--red)}

/* tasks */
.task{background:var(--card);border:.75px solid rgba(14,36,78,.12);padding:22px 24px 20px;
  margin:0 0 18px;position:relative}
.task::before{content:"";position:absolute;left:0;top:0;right:0;height:3px;background:var(--orange)}
.task.afb2::before{background:var(--green)}
.task.afb3::before{background:var(--red)}
.task-head{display:flex;align-items:baseline;gap:14px;flex-wrap:wrap;margin-bottom:10px}
.task h2{font-size:17px;color:var(--ink);font-weight:700}
.afb{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);font-weight:700}
.afb b{color:var(--ink)}
.task p{margin:0 0 8px}
ol.parts{margin:10px 0 0 0;padding-left:0;list-style:none;counter-reset:part}
ol.parts>li{position:relative;padding-left:30px;margin:0 0 7px;counter-increment:part}
ol.parts>li::before{content:counter(part,lower-alpha) ")";position:absolute;left:0;top:0;
  color:var(--red);font-weight:700}
.hint{color:var(--muted);font-size:15px;margin-top:8px}
b{font-weight:700;color:var(--ink)}

/* solutions */
#sol{margin-top:36px}
#sol[hidden]{display:none}
#sol h2.big{font-size:20px;color:var(--ink);margin-bottom:14px}
.sol{background:rgba(255,255,255,.6);border-left:3px solid var(--green);padding:16px 20px;margin:0 0 14px}
.sol h3{font-size:14px;color:var(--ink);margin-bottom:8px}
.sol p{margin:0 0 6px}
.sol .why{color:var(--muted);font-size:15px}
.katex{font-size:1.02em}

/* print: A4, solutions on their own page so the sheet works without them */
@media print{
  @page{size:A4;margin:16mm 16mm 18mm}
  html,body{background:#fff}
  .sheet{max-width:none;padding:0}
  .tools{display:none}
  body{font-size:14.5px;line-height:1.38}
  h1{font-size:24px}
  .rules{margin:12px 0 18px}
  .task{break-inside:avoid;page-break-inside:avoid;padding:16px 20px 14px;margin-bottom:12px}
  ol.parts>li{margin-bottom:4px}
  .hint,.sol .why{font-size:13px}
  .sol{break-inside:avoid;page-break-inside:avoid;background:#fff;padding:12px 18px;margin-bottom:10px}
  #sol{display:block!important;break-before:page;page-break-before:always;margin-top:0}
}
"""

JS = """
// Formulas: every $...$ in the text is rendered by KaTeX, once the vendor script is in.
addEventListener('load', () => {
  if (!window.katex) return;
  const walker = document.createTreeWalker(document.querySelector('.sheet'), NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) if (walker.currentNode.nodeValue.includes('$')) nodes.push(walker.currentNode);
  nodes.forEach(node => {
    const parts = node.nodeValue.split(/\\$([^$]+)\\$/);
    if (parts.length < 3) return;
    const frag = document.createDocumentFragment();
    parts.forEach((part, i) => {
      if (i % 2 === 0) { if (part) frag.appendChild(document.createTextNode(part)); return; }
      const span = document.createElement('span');
      try { katex.render(part, span, { throwOnError: false, displayMode: false }); }
      catch (err) { span.textContent = part; }
      frag.appendChild(span);
    });
    node.parentNode.replaceChild(frag, node);
  });
});

// Solutions stay hidden until asked - in print they are always on, on their own page.
const sol = document.getElementById('sol'), toggle = document.getElementById('toggle');
toggle.onclick = () => {
  sol.hidden = !sol.hidden;
  toggle.textContent = sol.hidden ? 'Lösungen anzeigen' : 'Lösungen verbergen';
  if (!sol.hidden) sol.scrollIntoView({ behavior: 'smooth', block: 'start' });
};
"""

PAGE = """<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Textaufgaben: __TITLE__ — Doc Alvers Mathe-Labor</title>
<meta name="description" content="__DESC__">
<link rel="icon" type="image/svg+xml" href="../resources/favicon.svg">
<link rel="icon" type="image/png" sizes="256x256" href="../resources/favicon.png">
<link rel="stylesheet" href="__KATEX__/katex.min.css">
<script defer src="__KATEX__/katex.min.js"></script>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&family=Raleway:wght@400;600;700&display=swap" rel="stylesheet">
<style>__CSS__</style>
</head>
<body>
<main class="sheet">
  <div class="brand">Doc Alvers Mathe-Labor</div>
  <h1>Textaufgaben: __TITLE__</h1>
  <div class="sub">__SUB__</div>
  <div class="rules"></div>
  <div class="tools">
    <button class="btn" id="toggle" type="button">Lösungen anzeigen</button>
    <a class="btn" href="../svp/mathe/mathe11.html">Zum Plan</a>
  </div>

__TASKS__

  <section id="sol" hidden>
    <h2 class="big">Lösungen</h2>

__SOLS__
  </section>
</main>

<script>__JS__</script>
</body>
</html>
"""


# ------------------------------------------------------------------ runner ---
def build(script):
    """Run one content script (tools/aufgaben/mathe11/<thema>.py)."""
    import runpy
    path = script if os.path.isabs(script) else os.path.join(os.getcwd(), script)
    runpy.run_path(path, run_name="__textaufgaben__")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    for s in sys.argv[1:]:
        build(s)
