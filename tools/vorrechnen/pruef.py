# Checks the week blocks written by bloecke.mjs: every step of an equation has exactly the solution set of its task
# (over the reals, or the range written behind the task as "\quad(0\le x<2\pi)"), every step of a term has its value,
# the last step isolates the variable. "\approx" steps are compared by value (rounded as written). A step may hold
# several equations side by side ("x_1=2\quad x_2=-3", "x=2\vee x=-3"): their solutions together.
# A solution may end with its solution set (Doc, 23.11.2026: "Vorrechnen-Aufgaben zu Lösungsmengen"): "L=\{-2;3\}" -
# the elements by ";" in the order of size, each once - "L=\{\}", "L=\emptyset", "L=\mathbb{R}"; it must be exactly the
# task's. A step "D=\mathbb{R}\setminus\{0\}" is the task's domain (checked against it); the steps after it are solved
# within it, so multiplying by a denominator changes nothing. A row without the variable is true ("0=0": every x) or
# false ("3=-1": none). After squaring (op "quadrieren") a step may have more solutions than the task - the Probe takes
# them out - but the last step must be the task's solution set again.
# Systems of linear equations and matrix terms: lgs.py. Helpers to write Gauss tasks without hand arithmetic: gen_lgs.py.
# usage: python3 pruef.py bloecke.json   (bloecke.json from bloecke.mjs) - or ./pruefe.sh [kw ...]
# needs sympy and antlr4-python3-runtime 4.11 (sympy's LaTeX parser)
import json, re, sys
from sympy import (ConditionSet, E, Eq, FiniteSet, Interval, S, Symbol, N, nsimplify, pi, simplify, solveset, Union, EmptySet,
                   Intersection, oo, log, sqrt)
from sympy.calculus.util import continuous_domain
from sympy.parsing.latex import parse_latex
import lgs
from sympy import Matrix

def vor(tex):
    t = tex.replace('{,}', '.').replace('\\tfrac', '\\frac').replace('\\dfrac', '\\frac')
    t = re.sub(r'\\(left|right)\s*(?=[()\[\]|.])', '', t)
    t = re.sub(r'\\(left|right)\\([{}])', r'\\\2', t)
    t = re.sub(r'\\(?:[,;:! ]|quad|qquad)', ' ', t)
    t = t.replace('\\textcolor', '')
    # looks only (js/vorrechnen-aufgaben-wurzeln.js, w-doppelt: two roots the same size): a phantom adds nothing, a
    # smash stands for its content
    t = re.sub(r'\\vphantom\{\\rule\{[^{}]*\}\{[^{}]*\}\}', '', t).replace('\\smash[b]', '')
    # a root's index lifted off the hook, "\sqrt[{}^{90} ]{..}" (js/vorrechnen-aufgaben-wurzeln.js): the plain index
    t = re.sub(r'\\sqrt\[\s*\{\}\^\{?(\d+)\}?\s*\]', r'\\sqrt[\1]', t)
    # logarithms: the base in braces, a plain argument in brackets - parse_latex reads "\log_2 32" as base 23 and takes
    # everything after "\log_3 9" into the argument
    t = re.sub(r'\\log_([0-9a-zA-Z])', r'\\log_{\1}', t)
    ARG = r'(\\frac\{[^{}]*\}\{[^{}]*\}|[0-9.]+(?:\^(?:\{[^{}]*\}|[0-9a-zA-Z]))?|[a-zA-Z](?:\^(?:\{[^{}]*\}|[0-9a-zA-Z]))?)'
    t = re.sub(r'(\\log_\{[^{}]*\}|\\ln)\s*' + ARG, r'\1(\2)', t)
    # a letter before a bracket is a product, not a function: t(t-4), a(3-1)^2
    t = re.sub(r'(?<![\\a-zA-Z])([a-zA-Z](?:_\{?[0-9a-z]+\}?)?)\s*\(', r'\1\\cdot(', t)
    return t.strip()

def parse(tex):
    e = parse_latex(vor(tex))
    return e.subs({Symbol('e'): E, Symbol('pi'): pi})

def bereich(aufgabe):
    m = re.search(r'\\quad\s*\((.*)\)\s*$', aufgabe)
    if not m:
        return aufgabe, S.Reals
    innen = m.group(1)
    g = re.match(r'(.+?)(<|\\le)\s*[a-zA-Z_{}0-9]+\s*(<|\\le)\s*(.+)$', innen)
    if g:
        a, b = parse(g.group(1)), parse(g.group(4))
        return aufgabe[:m.start()], Interval(a, b, g.group(2) == '<', g.group(3) == '<')
    g = re.match(r'\s*[a-zA-Z_{}0-9]+\s*(>|\\ge|<|\\le|\\ne)\s*(.+)$', innen)
    c, w = g.group(1), parse(g.group(2))
    return aufgabe[:m.start()], {'>': Interval.open(w, oo), '\\ge': Interval(w, oo), '<': Interval.open(-oo, w),
                                 '\\le': Interval(-oo, w), '\\ne': S.Reals - FiniteSet(w)}[c]

def teile(tex):
    # several equations side by side: "\vee" or "\quad" between them
    t = re.sub(r'\\[,;:! ]', ' ', tex)
    stuecke = [s for s in re.split(r'\\vee|\\qquad|\\quad', t) if s.strip()]
    return stuecke

INDEX = r'_\{?(?:1,2|[1-9])\}?(?=\s*(?:=|\\approx))'

def ist_menge(tex, name='L'):
    """A step that states a set: the solution set L (or the domain D) - not a formula solved for a quantity L or D."""
    return re.match(r'\s*' + name + r'\s*=\s*(?:\\\{|\\mathbb\{R\}|\\emptyset|\\varnothing)', tex) is not None

def eine_menge(s):
    s = s.strip()
    if s in ('\\emptyset', '\\varnothing') or re.fullmatch(r'\\\{\s*\\\}', s):
        return EmptySet
    m = re.fullmatch(r'\\mathbb\{R\}(?:\s*\\setminus\s*\\\{(.*)\\\})?', s)
    if m:
        return S.Reals - FiniteSet(*[parse(z) for z in m.group(1).split(';')]) if m.group(1) else S.Reals
    m = re.fullmatch(r'\\\{(.*)\\\}', s)
    if not m:
        raise ValueError('keine Menge: ' + s)
    elemente = [parse(z) for z in m.group(1).split(';')]
    if len(set(elemente)) != len(elemente) or sorted(elemente, key=lambda w: float(N(w))) != elemente:
        raise ValueError('nicht der Größe nach oder doppelt: ' + s)
    return FiniteSet(*elemente)

def als_menge(tex):
    r"""The set a step "L=..." or "D=..." states; several forms side by side ("L=\{\}=\emptyset") must agree."""
    mengen = [eine_menge(s) for s in re.sub(r'\\[,;:! ]', ' ', tex).split('=')[1:]]
    if any(not (m.is_subset(mengen[0]) and mengen[0].is_subset(m)) for m in mengen[1:]):
        raise ValueError('verschiedene Mengen: ' + tex)
    return mengen[0]

def enthalten(a, b):
    """Every solution of a is one of b (finite sets) - a step after squaring may have more."""
    ea, eb = endlich(a), endlich(b)
    if ea is None or eb is None:
        return False
    return all(any(abs(complex(N(x - y, 30))) <= 1e-9 for y in eb) for x in ea)

def loesungen(tex, v, dom):
    menge = EmptySet
    if ist_menge(tex):
        return als_menge(tex), False
    stuecke = []
    for s in teile(tex):
        stuecke += [s.replace('\\pm', '+'), s.replace('\\pm', '-')] if '\\pm' in s else [s]
    for s in stuecke:
        s2 = re.sub(INDEX, '', s)
        ungefaehr = '\\approx' in s2
        e = parse(s2.replace('\\approx', '='))
        if e in (S.true, S.false):
            # no variable left: "0=0" holds for every x of the range, "3=-1" for none
            menge = Union(menge, dom) if e == S.true else menge
            continue
        # the other letters of a formula are quantities: positive
        e = e.subs({x: Symbol(x.name, positive=True) for x in e.free_symbols if x != v})
        if not isinstance(e, Eq):
            raise ValueError('keine Gleichung: ' + s)
        menge = Union(menge, solveset(e, v, dom))
    return menge, '\\approx' in tex

def endlich(menge):
    """The elements of a finite solution set, also when sympy wraps it (Intersection with the reals), else None."""
    if isinstance(menge, FiniteSet):
        return list(menge)
    if isinstance(menge, Intersection):
        for a in menge.args:
            if isinstance(a, FiniteSet):
                return [x for x in a if x.is_real is not False]
    return None

def gleich(a, b, grob):
    ea, eb = endlich(a), endlich(b)
    if ea is None or eb is None:
        return not grob and simplify(a) == simplify(b)
    if len(ea) != len(eb):
        return False
    try:
        za = sorted(complex(N(x, 30)).real for x in ea)
        zb = sorted(complex(N(x, 30)).real for x in eb)
        tol = 0.006 if grob else 1e-9
        return all(abs(x - y) <= tol * max(1, abs(y)) for x, y in zip(za, zb))
    except TypeError:
        # with letters in it (a formula): every solution has an equal one on the other side
        return all(any(simplify(x - y) == 0 for y in eb) for x in ea) and all(any(simplify(x - y) == 0 for x in ea) for y in eb)

fehler = 0
for block in json.load(open(sys.argv[1])):
    print(f"== KW {block['kw']}: {block['titel']} ({len(block['aufgaben'])} Aufgaben)")
    for a in block['aufgaben']:
        slug, nach = a['slug'], a['nach']
        try:
            if re.search(r'\\begin\{(cases|array)\}', a['latex']):
                # a system of linear equations: every step has the task's solutions
                vs = lgs.variablen(a['latex'])
                ziel = lgs.gleichungen(a['latex'], vs, parse)
                for k, st in enumerate(a['schritte'], 1):
                    eqs = lgs.gleichungen(st, vs, parse)
                    t = Symbol('t')
                    if eqs == []:
                        # "0=0" after subtracting: a row that says nothing - right only where one equation (right side
                        # included) is a combination of the others
                        erw = Matrix([[e.coeff(v) for v in vs] + [e.subs({v: 0 for v in vs})] for e in ziel])
                        ok = erw.rank() < len(ziel)
                    elif eqs is not None and any(e.has(t) for e in eqs):
                        # a parameter: the step's solutions solve the task, and as many free as the task has
                        sol = lgs.loesung(eqs, vs)
                        tup = next(iter(sol))
                        ok = all(simplify(e.subs(dict(zip(vs, tup)))) == 0 for e in ziel)
                        frei = len(vs) - Matrix([[e.coeff(v) for v in vs] for e in ziel]).rank()
                        ok = ok and frei == 1
                    elif eqs is not None and 0 < len(teil := [v for v in vs if any(e.has(v) for e in eqs)]) < len(vs):
                        # a step about some of the unknowns only ("3x-4=x+2" after setting equal, "y=3+2" after
                        # inserting): its solutions are the task's, read in those unknowns
                        ok = set(lgs.loesung(eqs, teil)) == {tuple(tup[vs.index(v)] for v in teil) for tup in lgs.loesung(ziel, vs)}
                    else:
                        ok = lgs.gleich(ziel, eqs, vs)
                    if not ok:
                        fehler += 1
                        print(f'  FALSCH {slug} Schritt {k}: {st}  ->  {lgs.loesung(eqs, vs)}  statt  {lgs.loesung(ziel, vs)}')
                print(f'  ok {slug}: {lgs.loesung(ziel, vs)}')
                continue
            if not nach and '\\begin{pmatrix}' in a['latex']:
                # a matrix term: every step the same matrix
                wert = lgs.matrix_ausdruck(a['latex'], parse)
                for k, st in enumerate(a['schritte'], 1):
                    w = lgs.matrix_ausdruck(re.sub(r'^\s*=', '', st), parse)
                    if w.shape != wert.shape or any(simplify(x - y) != 0 for x, y in zip(list(w), list(wert))):
                        fehler += 1
                        print(f'  FALSCH {slug} Schritt {k}: {st} = {w} statt {wert}')
                print(f'  ok {slug}: {wert}')
                continue
            if (a.get('kopf') or '').startswith('Nullstelle') and re.match(r'\s*y\s*=', a['latex']):
                # "Nullstelle berechnen" over y = f(x) (KOEPFE, js/vorrechnen-aufgaben.js): the task is f(x) = 0, for x
                a, nach = dict(a, latex=re.sub(r'^\s*y\s*=', '', a['latex']) + '=0'), 'x'
            pkt = re.fullmatch(r'\s*y\s*=(.*?)\\quad\s*[A-Z]\((.*?)\\mid(.*?)\)\s*', a['latex'])
            if (a.get('kopf') or '').startswith('Achsenabschnitt') and pkt:
                # "Achsenabschnitt berechnen" over y = mx + n and a point P(a | b): the point put in, the task is for n
                px, py = pkt.group(2).strip(), pkt.group(3).strip()
                rechts = re.sub(r'(?<=[0-9}])x', '\\\\cdot(' + px + ')', pkt.group(1))
                rechts = re.sub(r'(?<![a-zA-Z\\])x(?![a-zA-Z])', '(' + px + ')', rechts)
                a, nach = dict(a, latex='(' + py + ')=' + rechts), 'n'
            if nach:
                v = parse(nach)
                aufg, dom = bereich(a['latex'])
                ziel, _ = loesungen(aufg, v, dom)
                if ziel.has(ConditionSet):
                    # sympy cannot solve it (two logarithms): the last step's solutions must satisfy the task
                    ziel, _ = loesungen(a['schritte'][-1], v, dom)
                    e = parse(aufg)
                    for w in endlich(ziel):
                        if abs(complex(N((e.lhs - e.rhs).subs(v, w)))) > 1e-9:
                            raise ValueError(f'{w} erfüllt die Aufgabe nicht')
                    print(f'  (nur Probe) {slug}: {ziel}')
                if ziel == EmptySet and not ist_menge(a['schritte'][-1]):
                    raise ValueError('die Aufgabe hat keine Lösung')
                feld, folgerung, n = dom, False, len(a['schritte'])
                for k, st in enumerate(a['schritte'], 1):
                    if ist_menge(st, 'D'):
                        # the domain: what the task allows (no denominator 0, no negative radicand)
                        e = parse(aufg)
                        d, soll = als_menge(st), continuous_domain(e.lhs - e.rhs, v, dom)
                        if not (d.is_subset(soll) and soll.is_subset(d)):
                            fehler += 1
                            print(f'  FALSCH {slug} Schritt {k}: {st}  ->  {d}  statt  {soll}')
                        feld = Intersection(dom, d)
                        continue
                    if 'quadrieren' in ((a.get('ops') or [''] * n)[k - 1] or ''):
                        folgerung = True
                    l, grob = loesungen(st, v, feld)
                    ok = enthalten(ziel, l) if folgerung and k < n and not ist_menge(st) else gleich(l, ziel, grob)
                    if not ok:
                        fehler += 1
                        print(f'  FALSCH {slug} Schritt {k}: {st}  ->  {l}  statt  {ziel}')
                letzte = a['schritte'][-1]
                for s in ([] if ist_menge(letzte) else teile(letzte)):
                    links, rechts = re.split(r'=|\\approx', s, maxsplit=1)
                    lv = re.sub(r'_\{?(?:1,2|[1-9])\}?\s*$', '', links.strip())
                    rv = parse(rechts)
                    if parse(lv) != v or v in getattr(rv, 'free_symbols', set()):
                        fehler += 1
                        print(f'  NICHT FREI {slug}: {letzte}')
                print(f'  ok {slug}: {ziel}')
            else:
                wert = parse(a['latex'])
                # a term's letters are positive too (roots as powers)
                pos = {x: Symbol(x.name, positive=True) for x in wert.free_symbols}
                wert = wert.subs(pos)
                for k, st in enumerate(a['schritte'], 1):
                    grob = '\\approx' in st
                    w = parse(re.sub(r'^\s*(=|\\approx)', '', st)).subs(pos)
                    if grob:
                        ok = abs(complex(N(w - wert)).real) <= 0.006 * max(1, abs(complex(N(wert)).real))
                    elif not wert.free_symbols and not w.free_symbols:
                        ok = abs(complex(N(w - wert, 30))) <= 1e-9 * max(1, abs(complex(N(wert))))
                    else:
                        ok = simplify(w - wert) == 0
                    if not ok:
                        fehler += 1
                        print(f'  FALSCH {slug} Schritt {k}: {st} = {N(w)} statt {N(wert)}')
                print(f'  ok {slug}: {wert} = {N(wert, 6)}')
        except Exception as e:
            fehler += 1
            print(f'  FEHLER {slug}: {type(e).__name__}: {e}')
print('Fehler gesamt:', fehler)
