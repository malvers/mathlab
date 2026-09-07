#!/usr/bin/env python3
"""Render a deck build script as a sharp HTML slide show instead of a .pptx.

    python3 tools/pptx/html_deck.py build_nichtlinear_mathe11.py

The build scripts describe every slide semantically (title, bullets, chapter,
merksatz, two columns). This module offers a stand-in for `omml.MathDeck` that
records those calls and writes a 960x540 HTML deck: real text, CSS instead of a
background bitmap, KaTeX for the $...$ formulas, one click per level-0 bullet
exactly like the PowerPoint build. Nothing in the .pptx pipeline is touched.

Slide 0 (Auftaktfolie) is left out on purpose: the morning images are foreign
material and this repo is public.
"""
import html as _html
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

from design_lib import (INK, BODY, MUTED, STROKE, CARD, CODE_BG, CODE_INK, CODE_MUTED,
                        ORANGE, RED, GREEN, W, H, MARGIN, CONTENT_W, TITLE_Y, RULE_Y,
                        BODY_Y, BODY_H, FOOT_Y, FOOTER_TEXT)

OUT_DIR = os.path.join(HERE, "..", "..", "HTML", "decks")
LAB_MIN_H = 640.0         # labs warn below 980x620 - give them a window that clears it
KATEX = "../morpheus/vendor/katex"


# ------------------------------------------------------------------ markup ---
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


def click_groups(lines):
    """One click per level-0 line; deeper lines join the group above them."""
    groups = []
    for i, (_, level) in enumerate(lines):
        if level == 0 or not groups:
            groups.append([i])
        else:
            groups[-1].append(i)
    return groups


def bullet_list(lines, kind="line", start=0):
    """Render [(text, level)] as one paragraph per line, grouped for the build.
    `start` continues the click numbering - the right column comes after the left."""
    out = []
    groups = click_groups(lines)
    for gi, group in enumerate(groups):
        for i in group:
            text, level = lines[i]
            out.append('<p class="%s l%d step" data-g="%d">%s</p>'
                       % (kind, level, start + gi, markup(text)))
    return "\n".join(out), start + len(groups)


# -------------------------------------------------------------------- deck ---
class HtmlDeck:
    """Same call surface as slides.Deck / omml.MathDeck - writes HTML."""

    def __init__(self, out_name, **kw):
        self.name = os.path.splitext(os.path.basename(out_name))[0]
        self.slides = []
        self.doc_title = self.name
        self.subtitle = ""

    # ------------------------------------------------------------ slides ---
    def _slide(self, cls, body):
        foot = ('<p class="foot">%s</p><p class="pageno"></p>'
                % _html.escape(FOOTER_TEXT, quote=False))
        self.slides.append('<section class="slide %s">%s%s</section>' % (cls, body, foot))

    def greeting(self, *a, **kw):
        return None                     # Folie 0 stays out of the web version

    def title(self, kicker, title, sub):
        self.doc_title, self.subtitle = title, sub
        self._slide("title", """
      <div class="ring"></div><div class="ring-inner"></div><div class="orbit-dot"></div>
      <div class="title-bar"></div>
      <p class="kicker">%s</p>
      <h1>%s</h1>
      <p class="sub">%s</p>""" % (markup(kicker), markup(title), markup(sub)))

    def chapter(self, num, title, sub):
        self._slide("chapter", """
      <div class="chapter-bar"></div>
      <p class="kicker">Kapitel %02d</p>
      <h2>%s</h2>
      <p class="sub">%s</p>
      <div class="hair"></div>""" % (num, markup(title), markup(sub)))

    def bullets(self, title, lines):
        body, _ = bullet_list(lines)
        self._slide("content", '<h3>%s</h3><div class="rules"></div><div class="body">%s</div>'
                    % (markup(title), body))

    def two_cols(self, title, left_lines, right_lines):
        left, n = bullet_list(left_lines, "col")
        right, _ = bullet_list(right_lines, "col", start=n)
        self._slide("content twocols", """
      <h3>%s</h3><div class="rules"></div>
      <div class="colgrid">
        <div class="card left">%s</div>
        <div class="card right">%s</div>
      </div>""" % (markup(title), left, right))

    def merksatz(self, text, label="Merksatz"):
        self._slide("merksatz", '<div class="quote-bar"></div><p class="satz">%s</p>'
                    '<p class="label">%s</p>' % (markup(text), markup(label)))

    def code(self, title, lines, size=None):
        rows = []
        for line in lines:
            rows.append(_html.escape(line if isinstance(line, str)
                                     else "".join(t for t, _ in line), quote=False))
        self._slide("content code", '<h3>%s</h3><div class="rules"></div>'
                    '<div class="codepanel"><pre>%s</pre></div>'
                    % (markup(title), "\n".join(rows) or " "))

    def lab(self, title, src, lines=None, note="", bottom=486.0):
        """A Mathe-Labor page inside the slide - the thing PowerPoint cannot do.
        `src` is relative to the site root, e.g. "binomischeslabor.html". The lab is
        laid out wide (LAB_W) and scaled into the content column, so its own
        responsive layout gets a landscape window instead of a letterbox."""
        if not note and lines:
            first = lines[0]
            note = first[0] if isinstance(first, tuple) else first
        top = BODY_Y + (26.0 if note else 0.0)
        # the lab gets a landscape window of its own, then rides a scale into the
        # content column - below 980x620 the labs put a warning over themselves
        scale = (bottom - top) / LAB_MIN_H
        lab_w = CONTENT_W / scale
        cap = ('<p class="labnote" style="top:%gpx">%s</p>' % (BODY_Y, markup(note))
               if note else "")
        self._slide("content lab", """
      <h3>%s</h3><div class="rules"></div>%s
      <div class="labframe" style="top:%gpx;height:%gpx">
        <iframe src="../%s" title="%s" style="width:%gpx;height:%gpx;transform:scale(%g)"></iframe>
      </div>
      <div class="labbar">
        <a href="../%s" target="_blank" rel="noopener">Neuer Tab</a>
        <button class="labnext">Weiter &#9656;</button>
      </div>""" % (markup(title), cap, top, bottom - top, _html.escape(src, quote=True),
                   _html.escape(title, quote=True), lab_w, LAB_MIN_H, scale,
                   _html.escape(src, quote=True)))

    def picture(self, title, path, lines=None, **kw):
        src = os.path.relpath(path, OUT_DIR) if os.path.isabs(path) else path
        self._slide("content", '<h3>%s</h3><div class="rules"></div>'
                    '<div class="pic"><img src="%s" alt=""></div>%s'
                    % (markup(title), _html.escape(src, quote=True),
                       '<div class="body">%s</div>' % bullet_list(lines)[0] if lines else ""))

    # ------------------------------------------------------------- output ---
    def save(self, path=None):
        os.makedirs(OUT_DIR, exist_ok=True)
        path = path or os.path.join(OUT_DIR, self.name + ".html")
        with open(path, "w", encoding="utf-8") as f:
            f.write(self.render())
        print("%s  (%d Folien)" % (os.path.normpath(path), len(self.slides)))
        return path

    def render(self):
        return (PAGE.replace("__TITLE__", _html.escape(self.doc_title, quote=False))
                    .replace("__SUB__", _html.escape(self.subtitle, quote=False))
                    .replace("__KATEX__", KATEX)
                    .replace("__CSS__", CSS)
                    .replace("__SLIDES__", "\n".join(self.slides))
                    .replace("__JS__", JS))


# --------------------------------------------------------------- template ----
CSS = """
:root{
  --ink:#__INK__; --body:#__BODY__; --muted:#__MUTED__; --stroke:#__STROKE__;
  --card:#__CARD__; --orange:#__ORANGE__; --red:#__RED__; --green:#__GREEN__;
  --codebg:#__CODEBG__; --codeink:#__CODEINK__;
}
*{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;background:#0E244E;overflow:hidden}
body{font-family:Raleway,system-ui,sans-serif;color:var(--body)}
#stage{position:fixed;inset:0;display:grid;place-items:center}
#deck{width:__W__px;height:__H__px;position:relative;transform-origin:center center}
.slide{position:absolute;inset:0;display:none;overflow:hidden;
  background-image:
    radial-gradient(rgba(14,36,78,.10) 1px, transparent 1px),
    radial-gradient(58% 62% at 84% 10%, rgba(245,194,66,.30), transparent 70%),
    radial-gradient(52% 55% at 4% 96%, rgba(121,158,49,.20), transparent 70%),
    linear-gradient(122deg,#fff 0%, #b0c4e2 100%);
  background-size:24px 24px, auto, auto, auto;
}
.slide.on{display:block}

/* footer, shared by every slide */
.slide::before{content:"";position:absolute;left:__M__px;top:__FOOT__px;
  width:__CW__px;height:1px;background:rgba(14,36,78,.16)}
.foot{position:absolute;left:__M__px;top:__FOOTT__px;font-size:10px;letter-spacing:1.2px;
  color:var(--muted)}
.pageno{position:absolute;right:__M__px;top:__FOOTT__px;font-size:10px;letter-spacing:1.2px;
  color:var(--muted)}

h1,h2,h3,.kicker,.label,.card>.col.l0{font-family:Orbitron,system-ui,sans-serif}
b{font-weight:600;color:var(--ink)}
.c1{color:var(--orange)}.c2{color:var(--red)}.c3{color:var(--green)}

/* --- content ------------------------------------------------------------ */
.slide h3{position:absolute;left:__M__px;top:__TY__px;width:__CW__px;font-size:28px;font-weight:700;
  color:var(--ink);letter-spacing:-.2px;line-height:1.05}
.rules{position:absolute;left:__M__px;top:__RY__px;width:64px;height:3px}
.rules::before,.rules::after{content:"";position:absolute;top:0;height:3px}
.rules::before{left:0;width:44px;background:var(--orange)}
.rules::after{left:50px;width:14px;background:var(--green)}
.body{position:absolute;left:__M__px;top:__BY__px;width:__CW__px;height:__BH__px}

p.line{position:relative;line-height:1.25}
p.line.l0{font-size:20px;color:var(--body);margin-top:12px;padding-left:20px}
p.line.l1{font-size:17px;color:var(--muted);margin-top:6px;margin-left:24px;padding-left:20px;
  line-height:1.2}
p.line.l2{font-size:15px;color:var(--muted);margin-top:4px;margin-left:48px;padding-left:20px}
p.line:first-child{margin-top:0}
p.line::before{content:"";position:absolute;left:0;width:7px;height:7px;top:.55em}
p.line.l0::before{background:var(--red)}
p.line.l1::before{background:var(--green);width:6px;height:6px}
p.line.l2::before{background:#4A79C9;width:6px;height:6px}

/* --- two columns -------------------------------------------------------- */
.colgrid{position:absolute;left:__M__px;top:__BY__px;width:__CW__px;height:304px;
  display:grid;grid-template-columns:396px 396px;gap:24px}
.card{background:var(--card);border:.75px solid rgba(14,36,78,.12);padding:26px;
  position:relative}
.card::before{content:"";position:absolute;left:0;top:0;right:0;height:3px}
.card.left::before{background:var(--orange)}
.card.right::before{background:var(--green)}
p.col{position:relative;line-height:1.25}
p.col.l0{font-size:15px;font-weight:700;color:var(--ink);letter-spacing:2px;
  text-transform:uppercase;line-height:1.2}
p.col.l1{font-size:17px;color:var(--body);margin-top:10px;padding-left:20px}
p.col.l1::before{content:"";position:absolute;left:0;top:.55em;width:7px;height:7px}
.card.left p.col.l1::before{background:var(--red)}
.card.right p.col.l1::before{background:var(--green)}

/* --- title -------------------------------------------------------------- */
.slide.title .ring{position:absolute;left:690px;top:96px;width:340px;height:340px;
  border:1px solid rgba(14,36,78,.14);border-radius:50%}
.slide.title .ring-inner{position:absolute;left:762px;top:168px;width:196px;height:196px;
  border:1.5px solid rgba(245,194,66,.7);border-radius:50%}
.slide.title .orbit-dot{position:absolute;left:848px;top:158px;width:20px;height:20px;
  border-radius:50%;background:var(--orange)}
.slide.title .title-bar{position:absolute;left:__M__px;top:214px;width:64px;height:4px;
  background:var(--orange)}
.slide.title .kicker{position:absolute;left:__M__px;top:232px;font-size:12px;font-weight:700;
  color:var(--red);letter-spacing:3px;text-transform:uppercase}
.slide.title h1{position:absolute;left:__M__px;top:262px;width:600px;font-size:44px;
  font-weight:700;color:var(--ink);line-height:1.08;letter-spacing:-.5px}
.slide.title .sub{position:absolute;left:__M__px;top:392px;width:600px;font-size:19px;
  color:var(--muted);line-height:1.3}

/* --- chapter ------------------------------------------------------------ */
.slide.chapter .chapter-bar{position:absolute;left:__M__px;top:188px;width:4px;height:128px;
  background:var(--orange)}
.slide.chapter .kicker{position:absolute;left:__MC__px;top:188px;font-size:12px;font-weight:700;
  color:var(--red);letter-spacing:3px;text-transform:uppercase}
.slide.chapter h2{position:absolute;left:__MC__px;top:216px;width:700px;font-size:34px;
  font-weight:700;color:var(--ink);line-height:1.1;letter-spacing:-.3px}
.slide.chapter .sub{position:absolute;left:__MC__px;top:312px;width:640px;font-size:17px;
  color:var(--muted);line-height:1.3}
.slide.chapter .hair{position:absolute;left:__M__px;top:356px;width:__CW__px;height:1px;
  background:rgba(14,36,78,.14)}

/* --- merksatz ----------------------------------------------------------- */
.slide.merksatz .quote-bar{position:absolute;left:__M__px;top:190px;width:4px;height:150px;
  background:var(--orange)}
.slide.merksatz .satz{position:absolute;left:__MQ__px;top:186px;width:760px;font-size:30px;
  font-weight:700;color:var(--ink);line-height:1.28}
.slide.merksatz .label{position:absolute;left:__MQ__px;top:362px;font-size:12px;font-weight:700;
  color:var(--red);letter-spacing:2.4px;text-transform:uppercase}

/* --- code --------------------------------------------------------------- */
.codepanel{position:absolute;left:__M__px;top:__BY__px;width:__CW__px;height:300px;
  background:var(--codebg);border-left:3px solid var(--green);padding:40px 28px}
.codepanel pre{font-family:Menlo,monospace;font-size:13.5px;line-height:1.3;color:var(--codeink)}
.pic{position:absolute;left:__M__px;top:__BY__px;width:__CW__px;height:__BH__px;
  display:grid;place-items:center}
.pic img{max-width:100%;max-height:100%}

/* --- lab in a slide ------------------------------------------------------ */
.labnote{position:absolute;left:__M__px;width:__CW__px;font-size:15px;color:var(--muted)}
.labframe{position:absolute;left:__M__px;width:__CW__px;overflow:hidden;
  background:var(--card);border:.75px solid rgba(14,36,78,.12)}
.labframe iframe{border:0;transform-origin:0 0;display:block}
.labbar{position:absolute;right:__M__px;top:__LABBAR__px;display:flex;gap:10px;
  align-items:center;font-family:Orbitron,sans-serif;font-size:11px}
.labbar a{color:var(--muted);text-decoration:none;letter-spacing:1px}
.labbar a:hover{color:var(--red)}
.labbar button{font:inherit;color:var(--ink);background:var(--card);cursor:pointer;
  border:.75px solid rgba(14,36,78,.20);border-radius:4px;padding:5px 10px;letter-spacing:1px}
.labbar button:hover{border-color:var(--red);color:var(--red)}

/* --- click build -------------------------------------------------------- */
.step{opacity:0;transition:opacity .4s ease}
.step.on{opacity:1}

/* --- HUD ---------------------------------------------------------------- */
#hud{position:fixed;right:10px;bottom:8px;z-index:9}
#hud button{display:block;width:28px;height:28px;padding:0;border:0;background:transparent;
  color:var(--body);opacity:.7;cursor:pointer;transition:opacity .2s}
#hud button:hover{opacity:1}
#hud button svg{display:block;width:18px;height:18px;margin:auto}
#bar{position:fixed;left:0;bottom:0;height:3px;background:var(--orange);width:0;
  transition:width .25s ease;z-index:9}

@media print{
  html,body{overflow:visible;background:#fff}
  #hud,#bar{display:none}
  #stage{position:static;display:block}
  #deck{transform:none!important;width:auto;height:auto}
  .slide{display:block!important;position:relative;width:__W__px;height:__H__px;
    page-break-after:always;break-after:page}
  .step{opacity:1!important}
}
"""

JS = """
const deck = document.getElementById('deck');
const slides = [...document.querySelectorAll('.slide')];
let si = 0, step = 0;
slides.forEach((s, i) => {
  const p = s.querySelector('.pageno');
  if (p) p.textContent = (i + 1) + ' / ' + slides.length;
});

// keep the 960x540 stage as large as the window allows - phone, beamer, print
function fit(){
  const s = Math.min(innerWidth / __W__, innerHeight / __H__);
  deck.style.transform = 'scale(' + s + ')';
}
addEventListener('resize', fit); fit();

function groups(sl){
  return [...new Set([...sl.querySelectorAll('.step')].map(e => +e.dataset.g))].length;
}
function paint(){
  slides.forEach((s, i) => s.classList.toggle('on', i === si));
  const sl = slides[si];
  sl.querySelectorAll('.step').forEach(e => e.classList.toggle('on', +e.dataset.g < step));
  document.getElementById('bar').style.width = ((si + 1) / slides.length * 100) + '%';
}
function next(){
  if (step < groups(slides[si])) { step++; }
  else if (si < slides.length - 1) { si++; step = 0; }
  paint();
}
function prev(){
  if (step > 0) { step--; }
  else if (si > 0) { si--; step = groups(slides[si]); }
  paint();
}
addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;     // never eat Cmd-Shift-R
  const k = e.key;
  if (k === 'ArrowRight' || k === 'ArrowDown' || k === ' ' || k === 'PageDown') { next(); e.preventDefault(); }
  else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp') { prev(); e.preventDefault(); }
  else if (k === 'Home') { si = 0; step = 0; paint(); }
  else if (k === 'End') { si = slides.length - 1; step = groups(slides[si]); paint(); }
  else if (k === 'f' || k === 'F') { full(); }
});
addEventListener('click', e => {
  if (e.target.closest('#hud') || e.target.closest('.labbar a')) return;
  if (e.target.closest('.labbar button')) { next(); return; }
  next();
});   // clicks inside a lab stay in the lab - they never reach this document
// fullscreen toggle - the same corner-bracket icon as the SVP pill, in and out
const ICON_ENTER = '<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M16 3h3a2 2 0 0 1 2 2v3"/>'
  + '<path d="M8 21H5a2 2 0 0 1-2-2v-3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>';
const ICON_EXIT = '<path d="M3 8h3a2 2 0 0 0 2-2V3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/>'
  + '<path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/>';
const fullBtn = document.getElementById('full');
const fsOn = () => !!(document.fullscreenElement || document.webkitFullscreenElement);
function paintFull(){
  fullBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" '
    + 'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    + (fsOn() ? ICON_EXIT : ICON_ENTER) + '</svg>';
  fullBtn.title = fsOn() ? 'Vollbild verlassen (Esc)' : 'Vollbild (f)';
}
function full(){
  const el = document.documentElement;
  if (fsOn()) (document.exitFullscreen || document.webkitExitFullscreen).call(document);
  else {
    const req = el.requestFullscreen || el.webkitRequestFullscreen;
    if (req) Promise.resolve(req.call(el)).catch(() => {});
  }
}
fullBtn.onclick = full;
document.addEventListener('fullscreenchange', paintFull);
document.addEventListener('webkitfullscreenchange', paintFull);
if (document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen) paintFull();
else fullBtn.hidden = true;   // no fullscreen API (iPhone Safari) - nothing to press

// #7 in the URL opens slide 7 fully built - handy for linking a single slide
function fromHash(){
  const n = parseInt(location.hash.slice(1), 10);
  if (n >= 1 && n <= slides.length) { si = n - 1; step = groups(slides[si]); paint(); }
}
addEventListener('hashchange', fromHash);

// formulas: KaTeX renders every $...$ the build script wrote
addEventListener('load', () => {
  if (!window.katex) return;
  document.querySelectorAll('.tex').forEach(el => {
    try { katex.render(el.dataset.tex, el, { throwOnError: false, displayMode: false }); }
    catch (err) { el.textContent = el.dataset.tex; }
  });
});
paint();
fromHash();
"""

PAGE = """<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>__TITLE__</title>
<meta name="description" content="__SUB__">
<link rel="icon" type="image/svg+xml" href="../resources/favicon.svg">
<link rel="icon" type="image/png" sizes="256x256" href="../resources/favicon.png">
<link rel="stylesheet" href="__KATEX__/katex.min.css">
<script defer src="__KATEX__/katex.min.js"></script>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Raleway:wght@300;400;600&display=swap" rel="stylesheet">
<style>__CSS__</style>
</head>
<body>
<div id="stage"><div id="deck">
__SLIDES__
</div></div>
<div id="bar"></div>
<div id="hud"><button id="full" title="Vollbild (f)" aria-label="Vollbild"></button></div>
<script>__JS__</script>
</body>
</html>
"""

# geometry and palette are substituted once, from design_lib - single source
for _k, _v in {"__INK__": INK, "__BODY__": BODY, "__MUTED__": MUTED, "__STROKE__": STROKE,
               "__CARD__": CARD, "__ORANGE__": ORANGE, "__RED__": RED, "__GREEN__": GREEN,
               "__CODEBG__": CODE_BG, "__CODEINK__": CODE_INK,
               "__W__": W, "__H__": H, "__M__": MARGIN, "__CW__": CONTENT_W,
               "__TY__": TITLE_Y, "__RY__": RULE_Y, "__BY__": BODY_Y, "__BH__": BODY_H,
               "__FOOT__": FOOT_Y, "__FOOTT__": FOOT_Y + 8,
               "__MC__": MARGIN + 28, "__MQ__": MARGIN + 32,
               "__LABBAR__": TITLE_Y + 4}.items():
    _s = ("%g" % _v) if isinstance(_v, float) else str(_v)
    CSS = CSS.replace(_k, _s)
    JS = JS.replace(_k, _s)


# ------------------------------------------------------------------ runner ---
def build(script):
    """Run a build_*.py with MathDeck/Deck replaced by HtmlDeck."""
    import runpy
    import omml, slides
    omml.MathDeck = HtmlDeck
    slides.Deck = HtmlDeck
    path = script if os.path.isabs(script) else os.path.join(HERE, script)
    runpy.run_path(path, run_name="__html_deck__")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    build(sys.argv[1])
