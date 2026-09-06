#!/usr/bin/env python3
"""LaTeX -> OMML: real, editable PowerPoint formulas inside normal text runs.

PowerPoint stores formulas as OMML, not as LaTeX, so a formula in a bullet has to
be written as <a14:m><m:oMath>...</m:oMath></a14:m> inside the paragraph. That is
what this module does - the text around it stays real text (feedback_pptx_bullets_latex).

    set_runs_math(paragraph, "Loese **$3x + 7 = 25$** nach $x$")

Supported subset: \\frac \\dfrac \\tfrac \\sqrt \\sqrt[n] ^ _ \\left \\right
\\mathrm \\text \\operatorname, greek letters and the usual relation/operator
symbols. Anything unknown falls back to its literal name, never to a crash.
"""
import re

NS_A = 'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"'
NS_A14 = 'xmlns:a14="http://schemas.microsoft.com/office/drawing/2010/main"'
NS_M = 'xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"'
NS_MC = 'xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"'
NS_MATH = f"{NS_A} {NS_A14} {NS_M}"

GREEK = {
    "alpha": "\u03b1", "beta": "\u03b2", "gamma": "\u03b3", "delta": "\u03b4",
    "epsilon": "\u03b5", "varepsilon": "\u03b5", "zeta": "\u03b6", "eta": "\u03b7",
    "theta": "\u03b8", "iota": "\u03b9", "kappa": "\u03ba", "lambda": "\u03bb",
    "mu": "\u03bc", "nu": "\u03bd", "xi": "\u03be", "pi": "\u03c0", "rho": "\u03c1",
    "sigma": "\u03c3", "tau": "\u03c4", "phi": "\u03c6", "varphi": "\u03c6",
    "chi": "\u03c7", "psi": "\u03c8", "omega": "\u03c9",
    "Gamma": "\u0393", "Delta": "\u0394", "Theta": "\u0398", "Lambda": "\u039b",
    "Xi": "\u039e", "Pi": "\u03a0", "Sigma": "\u03a3", "Phi": "\u03a6",
    "Psi": "\u03a8", "Omega": "\u03a9",
}

SYMBOL = {
    "cdot": "\u00b7", "times": "\u00d7", "div": "\u00f7", "pm": "\u00b1", "mp": "\u2213",
    "leq": "\u2264", "le": "\u2264", "geq": "\u2265", "ge": "\u2265",
    "neq": "\u2260", "ne": "\u2260", "approx": "\u2248", "equiv": "\u2261",
    "infty": "\u221e", "to": "\u2192", "rightarrow": "\u2192", "longrightarrow": "\u27f6",
    "Rightarrow": "\u21d2", "Leftrightarrow": "\u21d4", "iff": "\u21d4",
    "in": "\u2208", "notin": "\u2209", "subset": "\u2282", "cup": "\u222a", "cap": "\u2229",
    "emptyset": "\u2205", "varnothing": "\u2205", "ldots": "\u2026", "dots": "\u2026",
    "cdots": "\u22ef", "circ": "\u2218", "angle": "\u2222", "perp": "\u22a5",
    "parallel": "\u2225", "sum": "\u2211", "prod": "\u220f", "int": "\u222b",
    "partial": "\u2202", "sqrtsign": "\u221a", "degree": "\u00b0", "prime": "\u2032",
    "quad": "\u2003", "qquad": "\u2003\u2003", "%": "%", "$": "$", "#": "#", "&": "&",
    "{": "{", "}": "}", "_": "_", "^": "^", ",": "\u2009", ";": "\u2009", "!": "",
    " ": " ",
}

# Function names that are set upright, like PowerPoint does it.
UPRIGHT_WORDS = {"sin", "cos", "tan", "log", "ln", "lg", "exp", "max", "min",
                 "ggT", "kgV", "lim"}


def _esc(t):
    return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def _run(text, italic):
    """One math run. Italic for variables, upright for digits, operators and words."""
    if not text:
        return ""
    if italic:
        rpr = '<a:rPr lang="de-DE" b="0" i="1"/>'
    else:
        rpr = '<m:rPr><m:sty m:val="p"/></m:rPr><a:rPr lang="de-DE" b="0" i="0"/>'
    return f'<m:r>{rpr}<m:t xml:space="preserve">{_esc(text)}</m:t></m:r>'


# ------------------------------------------------------------------ lexer ---
def _tokens(s):
    """[(kind, value, raw)] - kind is cmd | chr | sp | { | } | ^ | _ | [ | ]."""
    out, i = [], 0
    while i < len(s):
        c = s[i]
        if c == "\\":
            j = i + 1
            while j < len(s) and s[j].isalpha():
                j += 1
            if j == i + 1:                      # \, \{ \% ... - one literal char
                j = i + 2
            out.append(("cmd", s[i + 1:j], s[i:j]))
            i = j
        elif c in "{}^_[]":
            out.append((c, c, c))
            i += 1
        elif c.isspace():
            out.append(("sp", " ", " "))
            i += 1
        else:
            out.append(("chr", c, c))
            i += 1
    return out


# ----------------------------------------------------------------- parser ---
def _arg(toks, i):
    """One argument: a braced group or a single token. Returns (xml, i)."""
    while i < len(toks) and toks[i][0] == "sp":
        i += 1
    if i >= len(toks):
        return "", i
    if toks[i][0] == "{":
        nodes, i = _seq(toks, i + 1)
        if i < len(toks) and toks[i][0] == "}":
            i += 1
        return "".join(nodes), i
    node, i = _atom(toks, i)
    return node or "", i


def _raw_arg(toks, i):
    """One argument as plain text (for \\text and \\mathrm). Returns (str, i)."""
    while i < len(toks) and toks[i][0] == "sp":
        i += 1
    if i < len(toks) and toks[i][0] == "{":
        depth, i, buf = 1, i + 1, []
        while i < len(toks) and depth:
            k, _v, raw = toks[i]
            if k == "{":
                depth += 1
            elif k == "}":
                depth -= 1
                if not depth:
                    i += 1
                    break
            buf.append(raw)
            i += 1
        return "".join(buf), i
    if i < len(toks):
        return toks[i][2], i + 1
    return "", i


def _cmd(toks, i):
    name = toks[i][1]
    i += 1
    if name in ("frac", "dfrac", "tfrac"):
        num, i = _arg(toks, i)
        den, i = _arg(toks, i)
        return (f'<m:f><m:fPr><m:type m:val="bar"/></m:fPr>'
                f'<m:num>{num}</m:num><m:den>{den}</m:den></m:f>'), i
    if name == "sqrt":
        deg = ""
        if i < len(toks) and toks[i][0] == "[":
            depth, i, buf = 1, i + 1, []
            while i < len(toks) and depth:
                if toks[i][0] == "]":
                    depth -= 1
                    i += 1
                    break
                buf.append(toks[i])
                i += 1
            deg = "".join(_seq(buf, 0)[0])
        rad, i = _arg(toks, i)
        if deg:
            return (f'<m:rad><m:radPr><m:degHide m:val="0"/></m:radPr>'
                    f'<m:deg>{deg}</m:deg><m:e>{rad}</m:e></m:rad>'), i
        return (f'<m:rad><m:radPr><m:degHide m:val="1"/></m:radPr>'
                f'<m:deg/><m:e>{rad}</m:e></m:rad>'), i
    if name in ("text", "mathrm", "operatorname", "mathsf", "mbox"):
        raw, i = _raw_arg(toks, i)
        return _run(raw, False), i
    if name in ("mathbf", "boldsymbol"):
        raw, i = _raw_arg(toks, i)
        return (f'<m:r><m:rPr><m:sty m:val="b"/></m:rPr>'
                f'<a:rPr lang="de-DE" b="1" i="0"/>'
                f'<m:t xml:space="preserve">{_esc(raw)}</m:t></m:r>'), i
    if name == "left":
        opener, i = (toks[i][2], i + 1) if i < len(toks) else (".", i)
        body, i = _seq(toks, i, stop_at_right=True)
        closer = "."
        if i < len(toks) and toks[i][0] == "cmd" and toks[i][1] == "right":
            i += 1
            if i < len(toks):
                closer, i = toks[i][2], i + 1
        beg = "" if opener == "." else f'<m:begChr m:val="{_esc(opener)}"/>'
        end = "" if closer == "." else f'<m:endChr m:val="{_esc(closer)}"/>'
        return (f'<m:d><m:dPr>{beg}{end}<m:grow m:val="1"/></m:dPr>'
                f'<m:e>{"".join(body)}</m:e></m:d>'), i
    if name in GREEK:
        return _run(GREEK[name], False), i
    if name in SYMBOL:
        return _run(SYMBOL[name], False), i
    if name in UPRIGHT_WORDS:
        return _run(name, False), i
    return _run(name, False), i                 # unknown: show it, do not crash


def _atom(toks, i):
    k, v, _raw = toks[i]
    if k == "sp":
        return "", i + 1
    if k == "cmd":
        return _cmd(toks, i)
    if k == "{":
        nodes, j = _seq(toks, i + 1)
        if j < len(toks) and toks[j][0] == "}":
            j += 1
        return "".join(nodes), j
    if k == "chr":
        if v.isdigit():                          # keep a number in one run
            buf = v
            j = i + 1
            while j < len(toks) and toks[j][0] == "chr" and (
                    toks[j][1].isdigit() or (toks[j][1] in ".," and
                                             j + 1 < len(toks) and toks[j + 1][1].isdigit())):
                buf += toks[j][1]
                j += 1
            return _run(buf, False), j
        return _run(v, v.isalpha()), i + 1
    return "", i + 1                             # stray ] or }


def _seq(toks, i, stop_at_right=False):
    nodes = []
    while i < len(toks):
        k, v, _raw = toks[i]
        if k == "}":
            break
        if stop_at_right and k == "cmd" and v == "right":
            break
        if k in "^_":
            base = nodes.pop() if nodes else ""
            arg, i = _arg(toks, i + 1)
            sup = arg if k == "^" else None
            sub = None if k == "^" else arg
            if i < len(toks) and toks[i][0] in "^_" and toks[i][0] != k:
                k2 = toks[i][0]
                arg2, i = _arg(toks, i + 1)
                if k2 == "^":
                    sup = arg2
                else:
                    sub = arg2
            if sup is not None and sub is not None:
                nodes.append(f'<m:sSubSup><m:e>{base}</m:e>'
                             f'<m:sub>{sub}</m:sub><m:sup>{sup}</m:sup></m:sSubSup>')
            elif sup is not None:
                nodes.append(f'<m:sSup><m:e>{base}</m:e><m:sup>{sup}</m:sup></m:sSup>')
            else:
                nodes.append(f'<m:sSub><m:e>{base}</m:e><m:sub>{sub}</m:sub></m:sSub>')
            continue
        node, i = _atom(toks, i)
        if node:
            nodes.append(node)
    return nodes, i


def omath(latex, fallback=None):
    """LaTeX -> one inline formula, packed the way PowerPoint itself writes it.

    <mc:AlternateContent> gives PowerPoint the real OMML and every other renderer
    (QuickLook, Keynote, LibreOffice) a readable plain-text run - without the
    fallback those renderers drop the whole text body, silently and completely.
    """
    nodes, _ = _seq(_tokens(latex), 0)
    if fallback is None:
        fallback = math_plain("$" + latex + "$")
    return (f'<mc:AlternateContent {NS_MC} {NS_A}>'
            f'<mc:Choice {NS_A14} Requires="a14">'
            f'<a14:m {NS_M}><m:oMath>{"".join(nodes)}</m:oMath></a14:m>'
            f'</mc:Choice>'
            f'<mc:Fallback>'
            f'<a:r><a:rPr lang="de-DE" i="1"/><a:t>{_esc(fallback)}</a:t></a:r>'
            f'</mc:Fallback></mc:AlternateContent>')


# ------------------------------------------------------- paragraph filling ---
SPLIT = re.compile(r"(\$[^$]*\$|\*\*[^*]+\*\*)")


def set_runs_math(p, text):
    """Replace the runs of paragraph p. **word** is bold, $...$ becomes a real
    PowerPoint formula; everything else stays plain, editable text."""
    from pptx.oxml import parse_xml
    from pptx.oxml.ns import qn
    for r in list(p.runs):
        p._p.remove(r._r)
    for part in SPLIT.split(text):
        if not part:
            continue
        if part.startswith("$") and part.endswith("$") and len(part) > 1:
            el = parse_xml(omath(part[1:-1]))
            tail = p._p.find(qn("a:endParaRPr"))
            if tail is None:
                p._p.append(el)
            else:
                tail.addprevious(el)
        elif part.startswith("**") and part.endswith("**"):
            r = p.add_run()
            r.text = part[2:-2]
            r.font.bold = True
        else:
            r = p.add_run()
            r.text = part


# ------------------------------------------------------------- measuring ----
_PLAIN = {"\\left": "", "\\right": "", "\\,": "\u2009", "\\;": "\u2009", "\\!": "",
          "\\cdot": "\u00b7", "\\times": "\u00d7", "\\pm": "\u00b1", "\\to": "\u2192",
          "\\pi": "\u03c0", "\\neq": "\u2260", "\\leq": "\u2264", "\\geq": "\u2265",
          "\\Rightarrow": "\u21d2", "\\infty": "\u221e", "\\quad": "  "}

_SUP = str.maketrans("0123456789+-=()n", "\u2070\u00b9\u00b2\u00b3\u2074\u2075\u2076\u2077"
                                         "\u2078\u2079\u207a\u207b\u207c\u207d\u207e\u207f")


def _brace(s):
    """Parenthesise a fraction part unless it is a single symbol or number."""
    return s if re.fullmatch(r"[A-Za-z0-9\u03b1-\u03c9.,^]{1,3}", s) else f"({s})"


def _supers(s):
    """x^2 -> x2 as a real superscript, so the fallback still reads like maths."""
    def one(m):
        body = m.group(1) or m.group(2)
        try:
            return body.translate(_SUP)
        except Exception:
            return "^" + body
    return re.sub(r"\^\{([^{}]*)\}|\^(-?[0-9A-Za-z])", one, s)


def math_plain(text):
    """A readable plain-text stand-in: it is what non-PowerPoint renderers show
    (the mc:Fallback) and what the line measurement runs on."""
    def one(m):
        s = m.group(0)[1:-1]
        s = re.sub(r"\\(?:text|mathrm|operatorname)\s*\{([^{}]*)\}", r"\1", s)
        for _ in range(4):                                    # nested fractions
            s2 = re.sub(r"\\[dt]?frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}",
                        lambda m: f"{_brace(m.group(1))}/{_brace(m.group(2))}", s)
            if s2 == s:
                break
            s = s2
        s = re.sub(r"\\sqrt\s*\{([^{}]*)\}",
                   lambda m: "\u221a" + _brace(m.group(1)), s)
        for k, v in _PLAIN.items():
            s = s.replace(k, v)
        s = re.sub(r"\\[a-zA-Z]+", "", s)
        s = _supers(s)
        s = s.replace("{,}", ",")
        return re.sub(r"[{}_]", "", s)
    return re.sub(r"\$[^$]*\$", one, text)


def has_stacked_math(text):
    """True when a line contains a fraction or a root - those need a taller line."""
    return bool(re.search(r"\$[^$]*\\(dfrac|frac|tfrac|sqrt)", text))


# --------------------------------------------------------------- math deck ---
def _mathdeck():
    """Deck with math-aware measuring: LaTeX is measured as its rendered shape,
    and a line carrying a fraction or a root needs roughly two line heights."""
    from slides import Deck
    from tables import text_width_pt
    from design_lib import FONT_B
    import math as _math

    class MathDeck(Deck):
        @staticmethod
        def body_height(lines, width, sizes=(20, 17), spacing=1.25,
                        before=(12, 6), marl=(20, 44)):
            total = 0.0
            for i, (text, level) in enumerate(lines):
                size = sizes[min(level, len(sizes) - 1)]
                plain = math_plain(text).replace("**", "")
                tw = text_width_pt(plain, FONT_B, size) * 1.04
                avail = width - marl[min(level, 1)] - 14
                n = max(1, _math.ceil(tw / avail))
                h = n * size * spacing
                if has_stacked_math(text):
                    h += size * 0.75          # numerator/denominator stack
                total += h + (before[min(level, 1)] if i else 0)
            return total

    return MathDeck


def MathDeck(out_name, **kw):
    """MathDeck("mathe11-woche4.pptx") - a Deck that understands $...$."""
    return _mathdeck()(out_name, **kw)
