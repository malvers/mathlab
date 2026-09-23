#!/usr/bin/env python3
r"""quiz.py - builder for the 20-question exercise sets on js/quiz-engine.js.

Doc's "Aufgaben / Übungsaufgaben" always means this format (window.QUIZ, four
options, `steps` as the worked solution). The page frame is copied byte for
byte from an approved sheet (SKELETON); only <title> and window.QUIZ change.

A spec file describes one sheet:

    from quiz import fos12, vec, dec
    Q = fos12(nr=2, slug='vektoren', thema='Vektoren im Raum', lb='LB 1',
              blurb='Darstellung, Betrag, Addition, Vielfache')
    Q.q(r'Berechne $|\vec a|$ für $\vec a = ' + vec(2, 3, 6) + '$.',
        [r'$7$', r'$11$', r'$49$', r'$\sqrt{11}$'],
        [r'$|\vec a| = \sqrt{2^2 + 3^2 + 6^2} = \sqrt{49}$', r'$|\vec a| = 7$'],
        solution=0)
    ...
    def check():                      # every number recomputed independently
        assert (2**2 + 3**2 + 6**2) ** 0.5 == 7
    Q.verify(check)
    Q.save()

Texts are raw Python strings with SINGLE LaTeX backslashes; the builder doubles
them for JavaScript and proves it with a round trip (node evaluates the written
file, the result must equal the spec byte for byte). Every $...$ is rendered
with KaTeX in node - a formula that does not compile stops the build.
Straight quotes (' ") are refused in texts: use „“ and ’ (a figure's SVG may use ").

The correct option is spread over the four positions per sheet (deterministic
per sheet id), so a spec may always list the correct answer first.

    python3 tools/aufgaben/quiz.py wire <plan.html> <nr> <href> [label]
hooks a sheet into a plan row (quiz: { href, label }) - label defaults to
"Aufgaben 1 (20)", the counter is what makes the pill land in the Aufgaben tab.
"""
import html as _html
import json
import os
import random
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
HTML_DIR = os.path.join(ROOT, 'HTML')
SKELETON = os.path.join(HTML_DIR, 'mathetest11-gleichungen.html')
KATEX = os.path.join(HTML_DIR, 'morpheus', 'vendor', 'katex', 'katex.min.js')
N_QUESTIONS = 20
N_OPTS = 4


# ----------------------------------------------------------------- helpers ----
def vec(*c):
    """Column vector as LaTeX: vec(2, 3, 6) -> \\begin{pmatrix} 2 \\\\ 3 \\\\ 6 \\end{pmatrix}."""
    return r'\begin{pmatrix} ' + r' \\ '.join(dec(x) for x in c) + r' \end{pmatrix}'


def dec(x, nd=None):
    """Number as LaTeX with the German decimal comma: dec(0.6) -> 0{,}6, dec(3) -> 3.
    Fractions become \\dfrac; nd rounds floats to nd decimals."""
    from fractions import Fraction
    if isinstance(x, str):
        return x
    if isinstance(x, Fraction):
        if x.denominator == 1:
            return str(x.numerator)
        sign = '-' if x < 0 else ''
        return sign + r'\dfrac{%d}{%d}' % (abs(x.numerator), x.denominator)
    if isinstance(x, float):
        if nd is not None:
            x = round(x, nd)
        if x == int(x) and nd is None:
            return str(int(x))
        s = ('%.*f' % (nd, x)) if nd is not None else repr(x)
        return s.replace('.', '{,}')
    return str(x)


def frac(a, b):
    """\\dfrac{a}{b} without reducing - for a step that shows the unreduced fraction."""
    return r'\dfrac{%s}{%s}' % (dec(a), dec(b))


# --------------------------------------------------------------- the sheet ----
class Quiz:
    def __init__(self, id, file, title, subtitle, dash_sub, back, comment=''):
        self.id = id
        self.file = file if os.path.isabs(file) else os.path.join(HTML_DIR, file)
        self.title = title
        self.subtitle = subtitle
        self.dash_sub = dash_sub
        self.back = back
        self.comment = comment
        self.questions = []

    # spec API -------------------------------------------------------------
    def q(self, text, opts, steps, solution=0, fig=None, figcap=None):
        """One question. `solution` is the index of the correct option in `opts`
        (default 0: list the right answer first, the builder spreads it)."""
        n = len(self.questions) + 1
        _text('Frage %d' % n, text)
        if len(opts) != N_OPTS:
            raise SystemExit('Frage %d: %d Optionen statt %d' % (n, len(opts), N_OPTS))
        for o in opts:
            _text('Frage %d, Option' % n, o)
        norm = [re.sub(r'\s+', ' ', o).strip() for o in opts]
        if len(set(norm)) != N_OPTS:
            raise SystemExit('Frage %d: zwei Optionen sind gleich: %r' % (n, opts))
        if not steps:
            raise SystemExit('Frage %d: kein Lösungsweg (steps)' % n)
        for s in steps:
            _text('Frage %d, Lösungsschritt' % n, s)
        if not isinstance(solution, int) or not 0 <= solution < N_OPTS:
            raise SystemExit('Frage %d: solution muss 0..3 sein' % n)
        if fig is not None:
            _text('Frage %d, fig' % n, fig, allow_dquote=True)
            if '<svg' not in fig:
                raise SystemExit('Frage %d: fig ist kein SVG' % n)
        if figcap is not None:
            _text('Frage %d, figcap' % n, figcap)
        self.questions.append({'q': text, 'opts': list(opts), 'steps': list(steps),
                               'solution': solution, 'fig': fig, 'figcap': figcap})

    def verify(self, check):
        """Run the spec's own numeric check; any AssertionError stops the build."""
        try:
            check()
        except AssertionError as e:
            raise SystemExit('check() schlägt fehl in %s: %s' % (self.id, e or 'assert'))
        self._checked = True

    # build ----------------------------------------------------------------
    def spread(self):
        """Deterministic option order per sheet: the correct answer lands on each
        of the four positions five times, the others are shuffled."""
        targets = list(range(N_OPTS)) * (N_QUESTIONS // N_OPTS)
        random.Random(self.id).shuffle(targets)
        out = []
        for i, qu in enumerate(self.questions):
            rnd = random.Random('%s#%d' % (self.id, i))
            others = [o for j, o in enumerate(qu['opts']) if j != qu['solution']]
            rnd.shuffle(others)
            t = targets[i]
            opts = others[:t] + [qu['opts'][qu['solution']]] + others[t:]
            d = dict(qu)
            d['opts'] = opts
            d['solution'] = t
            out.append(d)
        return out

    def save(self):
        if len(self.questions) != N_QUESTIONS:
            raise SystemExit('%s: %d Fragen statt %d' % (self.id, len(self.questions), N_QUESTIONS))
        if not getattr(self, '_checked', False):
            raise SystemExit('%s: Q.verify(check) fehlt - jede Zahl wird nachgerechnet' % self.id)
        qs = self.spread()
        block = self._js_block(qs)
        skel = open(SKELETON, encoding='utf-8').read()
        title_tag = '<title>%s — Doc Alvers Mathe-Labor</title>' % _html.escape(
            self.title.replace('Aufgaben · ', 'Aufgaben: ', 1), quote=False)
        n_title = len(re.findall(r'<title>.*?</title>', skel))
        if n_title != 1:
            raise SystemExit('Gerüst: <title> nicht eindeutig')
        out = re.sub(r'<title>.*?</title>', lambda m: title_tag, skel, count=1)
        m = re.search(r'<script>\nwindow\.QUIZ = \{[\s\S]*?\n\};\n</script>', out)
        if not m or out.count('window.QUIZ = {') != 1:
            raise SystemExit('Gerüst: window.QUIZ-Block nicht gefunden')
        out = out[:m.start()] + '<script>\n' + block + '\n</script>' + out[m.end():]
        os.makedirs(os.path.dirname(self.file), exist_ok=True)
        with open(self.file, 'w', encoding='utf-8') as f:
            f.write(out)
        self._roundtrip(qs)
        self._katex(qs)
        self._frame_identical(out, skel)
        rel = os.path.relpath(self.file, ROOT)
        pos = [q['solution'] for q in qs]
        print('OK  %s  (%d Fragen, Lösung auf Position 0/1/2/3: %s)' % (
            rel, len(qs), '/'.join(str(pos.count(k)) for k in range(N_OPTS))))
        return self.file

    # internals ------------------------------------------------------------
    def _js_block(self, qs):
        L = ['window.QUIZ = {',
             '  id: %s,' % _js(self.id),
             "  version: 'v1',",
             "  submitLabel: 'Auswertung',   /* Uebungsblatt: der Knopf heisst Auswertung */",
             "  solutions: 'always',  /* Loesung pro Aufgabe sofort aufklappbar */",
             '  title: %s,' % _js(self.title),
             '  subtitle: %s,' % _js(self.subtitle),
             '  dashSub: %s,' % _js(self.dash_sub),
             '  back: %s, /* opened from the plan */' % _js(self.back)]
        if self.comment:
            L.append('  /* ' + self.comment.replace('*/', '* /') + ' */')
        L.append('  questions: [')
        for i, qu in enumerate(qs):
            L.append('    {')
            L.append('      q: %s,' % _js(qu['q']))
            if qu.get('fig'):
                L.append('      fig: %s,' % _js(qu['fig']))
                if qu.get('figcap'):
                    L.append('      figcap: %s,' % _js(qu['figcap']))
            L.append('      opts: [%s],' % ', '.join(_js(o) for o in qu['opts']))
            L.append('      steps: [')
            for k, s in enumerate(qu['steps']):
                L.append('        %s%s' % (_js(s), ',' if k < len(qu['steps']) - 1 else ''))
            L.append('      ],')
            L.append('      solution: %d' % qu['solution'])
            L.append('    }' + (',' if i < len(qs) - 1 else ''))
        L.append('  ]')
        L.append('};')
        return '\n'.join(L)

    def _expected(self, qs):
        exp = {'id': self.id, 'version': 'v1', 'submitLabel': 'Auswertung', 'solutions': 'always',
               'title': self.title, 'subtitle': self.subtitle, 'dashSub': self.dash_sub,
               'back': self.back, 'questions': []}
        for qu in qs:
            d = {'q': qu['q']}
            if qu.get('fig'):
                d['fig'] = qu['fig']
                if qu.get('figcap'):
                    d['figcap'] = qu['figcap']
            d['opts'] = qu['opts']
            d['steps'] = qu['steps']
            d['solution'] = qu['solution']
            exp['questions'].append(d)
        return exp

    def _roundtrip(self, qs):
        """node evaluates the written file; the object must equal the spec."""
        js = ("const fs=require('fs');const h=fs.readFileSync(process.argv[1],'utf8');"
              "const m=h.match(/<script>\\nwindow\\.QUIZ = ([\\s\\S]*?);\\n<\\/script>/);"
              "if(!m){console.error('no QUIZ block');process.exit(2)}"
              "const window={};eval('window.QUIZ = '+m[1]+';');"
              "process.stdout.write(JSON.stringify(window.QUIZ));")
        r = subprocess.run(['node', '-e', js, self.file], capture_output=True, text=True)
        if r.returncode != 0:
            raise SystemExit('Round-Trip: node scheitert: ' + r.stderr)
        got = json.loads(r.stdout)
        exp = self._expected(qs)
        if got != exp:
            for i, (a, b) in enumerate(zip(got['questions'], exp['questions'])):
                if a != b:
                    raise SystemExit('Round-Trip: Frage %d weicht ab:\n  HTML: %r\n  Spec: %r'
                                     % (i + 1, a, b))
            raise SystemExit('Round-Trip: Kopfdaten weichen ab')

    def _katex(self, qs):
        """Every $...$ must compile with KaTeX (throwOnError)."""
        segs = []
        for i, qu in enumerate(qs):
            texts = [qu['q']] + qu['opts'] + qu['steps'] + ([qu['figcap']] if qu.get('figcap') else [])
            for t in texts:
                if t.count('$') % 2:
                    raise SystemExit('Frage %d: ungerade Zahl von $ in %r' % (i + 1, t))
                for f in re.findall(r'\$(.+?)\$', t, re.S):
                    segs.append([i + 1, f])
        js = ("const katex=require(process.argv[1]);const segs=JSON.parse(process.argv[2]);"
              "let bad=0;for(const [n,f] of segs){try{katex.renderToString(f,{throwOnError:true,strict:false})}"
              "catch(e){bad++;console.error('Frage '+n+': '+f+'\\n   '+e.message)}}"
              "process.exit(bad?1:0)")
        r = subprocess.run(['node', '-e', js, KATEX, json.dumps(segs)], capture_output=True, text=True)
        if r.returncode != 0:
            raise SystemExit('KaTeX-Fehler:\n' + (r.stderr or r.stdout))

    def _frame_identical(self, out, skel):
        """Outside <title> and the QUIZ block the file must equal the skeleton."""
        strip = lambda s: re.sub(r'<script>\nwindow\.QUIZ = \{[\s\S]*?\n\};\n</script>', '@Q@',
                                 re.sub(r'<title>.*?</title>', '@T@', s, count=1))
        if strip(out) != strip(skel):
            raise SystemExit('Gerüst weicht vom abgenommenen Muster ab')


def _text(where, s, allow_dquote=False):
    if not isinstance(s, str) or not s.strip():
        raise SystemExit('%s: leerer Text' % where)
    if "'" in s:
        raise SystemExit("%s: gerades Anführungszeichen ' im Text - „“ oder ’ nehmen: %r" % (where, s))
    if '"' in s and not allow_dquote:
        raise SystemExit('%s: gerades Anführungszeichen " im Text - „“ nehmen: %r' % (where, s))
    if re.search(r'</script', s, re.I):
        raise SystemExit('%s: </script> im Text' % where)
    if '\n' in s:
        raise SystemExit('%s: Zeilenumbruch im Text' % where)
    for bad, good in (('ae', 'ä'), ('oe', 'ö'), ('ue', 'ü')):
        pass  # umlauts are the author's job; see feedback_real_umlauts


def _js(s):
    return "'" + s.replace('\\', '\\\\').replace("'", "\\'") + "'"


# ------------------------------------------------------------ FO 12 Mathe ----
def fos12(nr, slug, thema, lb, blurb, comment=''):
    """Sheet for the Fachoberschule-12 Mathematik plan (mathe/mathefos12.html)."""
    return Quiz(
        id='mathefos12-w%02d-%s' % (nr, slug),
        file='mathetestfos12-%s.html' % slug,
        title='Aufgaben · ' + thema,
        subtitle='Fachoberschule · Klasse 12 · Woche %d (%s) · 20 Aufgaben: %s · genau eine Antwort pro Aufgabe'
                 % (nr, lb, blurb),
        dash_sub='FO · Klasse 12 · Woche %d · Live-Auswertung: anonyme Einzelscores + Gruppenleistung pro Aufgabe' % nr,
        back='svp/mathe/mathefos12.html',
        comment=comment)


# ------------------------------------------------------------------ wiring ----
def wire(plan, nr, href, label='Aufgaben 1 (20)'):
    """Put quiz: { href, label } into the plan row with nr: <nr> (replacing an old one)."""
    path = plan if os.path.isabs(plan) else os.path.join(ROOT, plan)
    s = open(path, encoding='utf-8').read()
    S = r"'(?:[^'\\]|\\.)*'"
    pat = re.compile(r"(\{ nr: %d, kw: \d+, date: %s, type: %s, u: %s, topic: %s, remark: %s, )(quiz: \{[^}]*\}, )?"
                     % (nr, S, S, S, S, S))
    m = pat.search(s)
    if not m:
        raise SystemExit('%s: Zeile nr %d nicht gefunden' % (plan, nr))
    new = m.group(1) + "quiz: { href: %s, label: %s }, " % (_js(href), _js(label))
    s = s[:m.start()] + new + s[m.end():]
    open(path, 'w', encoding='utf-8').write(s)
    print('wired nr %d -> %s' % (nr, href))


if __name__ == '__main__':
    if len(sys.argv) >= 5 and sys.argv[1] == 'wire':
        wire(sys.argv[2], int(sys.argv[3]), sys.argv[4], *(sys.argv[5:6]))
    else:
        print(__doc__)
