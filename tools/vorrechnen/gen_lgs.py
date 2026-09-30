# Generates Vorrechnen tasks for linear systems (JS source lines): the task as "{\begin{cases}..\end{cases}}", the
# augmented matrix, the Gauss steps computed here (no hand arithmetic), the result by back substitution.
from fractions import Fraction as F
from gauss import op, op_tex, tex_matrix, tex_zahl
import sympy as sp
VARS = ['x', 'y', 'z']

def term(koeff):
    s = ''
    for k, v in zip(koeff, VARS):
        k = F(k)
        if k == 0: continue
        t = ('' if abs(k) == 1 else tex_zahl(abs(k))) + v
        s += ('-' if k < 0 else ('+' if s else '')) + t
    return s or '0'

def cases(rows):
    return '{\\\\begin{cases}' + '\\\\\\\\'.join(term(r[:-1]) + '=' + tex_zahl(r[-1]) for r in rows) + '\\\\end{cases}}'

def loesung(rows):
    n = len(rows[0]) - 1
    xs = sp.symbols(VARS[:n])
    eqs = [sum(sp.Rational(str(F(a))) * v for a, v in zip(r[:-1], xs)) - sp.Rational(str(F(r[-1]))) for r in rows]
    return sp.linsolve(eqs, xs)

def ergebnis(rows):
    l = loesung(rows)
    if l == sp.EmptySet: return 'L=\\\\{\\\\}'
    tup = next(iter(l))
    t = sp.Symbol('t')
    frei = [v for v in sp.symbols(VARS[:len(tup)]) if any(e.has(v) for e in tup)]
    sub = {frei[0]: t} if frei else {}
    teile = []
    for v, e in zip(VARS, tup):
        e = sp.simplify(e.subs(sub))
        teile.append(v + '=' + sp.latex(e).replace('\\', '\\\\'))
    return '\\\\quad '.join(teile)

def aufgabe(slug, rows, schritte, mit_matrix=True, ende_op='\\\\text{rückwärts einsetzen}'):
    rows = [list(map(F, r)) for r in rows]
    out = []
    if mit_matrix:
        out.append((tex_matrix(rows), '\\\\text{Koeffizientenmatrix}'))
    for s in schritte:
        for (z, a, q, b) in s:
            rows = op(rows, z, a, q, b)
        out.append((tex_matrix(rows), ',\\\\ '.join(op_tex(*o) for o in s)))
    out.append((ergebnis(rows), ende_op))
    return out

def js(slug, rows, schritte, **kw):
    a = f"        ['{slug}', '{cases([list(map(F, r)) for r in rows])}', ''],"
    st = aufgabe(slug, rows, schritte, **kw)
    l = f"        '{slug}': [" + ', '.join(f"['{s}', '{o}']" for s, o in st) + '],'
    return a, l
