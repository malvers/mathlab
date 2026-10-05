# Systems of linear equations and matrix expressions for pruef.py: a system "{\begin{cases}..\end{cases}}", an augmented
# matrix "\left(\begin{array}{cc|c}..\end{array}\right)", a matrix equation "A\cdot v=b", the result "x=3\quad y=2" (or
# with a parameter t), "L=\{\}". Two systems are equal when every solution of one solves the other.
import re
from sympy import Matrix, Symbol, linsolve, EmptySet, simplify, symbols, FiniteSet, expand, Rational
from sympy.parsing.latex import parse_latex

def _parse(tex, parse):
    return parse(tex)

def matrix_ausdruck(tex, parse):
    mats = []
    def ersetze(m):
        zeilen = [z for z in re.split(r'\\\\', m.group(1)) if z.strip()]
        mats.append(Matrix([[parse(c) for c in z.split('&')] for z in zeilen]))
        return f' M{len(mats) - 1} '
    t = re.sub(r'\\begin\{pmatrix\}(.*?)\\end\{pmatrix\}', ersetze, tex, flags=re.S)
    t = re.sub(r'\^\{?(?:T|\\mathsf\{T\}|\\top)\}?', '.T', t)
    t = re.sub(r'\\frac\{(\d+)\}\{(\d+)\}', r'R(\1,\2)', t)
    t = re.sub(r'\\left|\\right', '', t).replace('\\cdot', '*').replace('{,}', '.')
    t = re.sub(r'\\[,;:! ]|\\quad', ' ', t)
    return eval(t, {'__builtins__': {}}, dict({f'M{i}': m for i, m in enumerate(mats)}, R=Rational))

def gleichungen(tex, vars_, parse):
    """The equations a step stands for, as expressions = 0; None for L = {} (no solution)."""
    t = tex.strip()
    if re.fullmatch(r'L\s*=\s*\\\{\s*\\\}', t):
        return None
    m = re.search(r'\\begin\{cases\}(.*?)\\end\{cases\}', t, re.S)
    if m:
        out = []
        for z in re.split(r'\\\\', m.group(1)):
            if z.strip():
                e = parse(z.replace('&', ''))
                out.append(expand(e.lhs - e.rhs))
        return out
    m = re.search(r'\\begin\{array\}\{[^}]*\}(.*?)\\end\{array\}', t, re.S)
    if m:
        out = []
        for z in re.split(r'\\\\', m.group(1)):
            if z.strip():
                zahlen = [parse(c) for c in z.split('&')]
                out.append(sum(a * v for a, v in zip(zahlen[:-1], vars_)) - zahlen[-1])
        return out
    if '\\begin{pmatrix}' in t:
        links, rechts = t.split('=', 1) if re.search(r'\\end\{pmatrix\}\s*=', t) else (None, None)
        L, R = matrix_ausdruck(links, parse), matrix_ausdruck(rechts, parse)
        return [simplify(a - b) for a, b in zip(list(L), list(R))]
    # a point, "S(3\mid 5)": its coordinates in the order of the unknowns (the intersection of two lines)
    m = re.fullmatch(r'[A-Z](?:_\{?\w+\}?)?\s*(?:\\left)?\((.*?)(?:\\right)?\)', t)
    if m and '\\mid' in m.group(1):
        return [v - parse(c) for v, c in zip(vars_, m.group(1).split('\\mid'))]
    out = []
    for s in re.split(r'\\quad|\\qquad|\;|,\\ ', t):
        if s.strip():
            e = parse(s)
            out.append(expand(e.lhs - e.rhs))
    return out

def loesung(eqs, vars_):
    if eqs is None:
        return EmptySet
    return linsolve(eqs, vars_)

def gleich(eqs_a, eqs_b, vars_):
    """Every solution of a solves b and the other way round."""
    la, lb = loesung(eqs_a, vars_), loesung(eqs_b, vars_)
    if la == EmptySet or lb == EmptySet:
        return la == lb
    def passt(l, eqs):
        if eqs is None:
            return False
        for tup in l:
            sub = dict(zip(vars_, tup))
            if any(simplify(e.subs(sub)) != 0 for e in eqs):
                return False
        return True
    return passt(la, eqs_b) and passt(lb, eqs_a)

def variablen(tex):
    """x, y (and z) - by the columns of an augmented matrix or the letters used."""
    m = re.search(r'\\begin\{array\}\{([^}]*)\}', tex)
    n = len(m.group(1).split('|')[0].strip()) if m else None
    namen = ['x', 'y', 'z', 'w'][:n] if n else [c for c in 'xyz' if re.search(r'(?<![a-zA-Z\\])' + c + r'(?![a-zA-Z])', tex)]
    return [Symbol(c) for c in namen]
