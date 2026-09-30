# Builds Gauss steps as LaTeX: rows of an augmented matrix, row operations like "II-2I", the matrices in between.
from fractions import Fraction as F
import sys, json
ROEM = ['I', 'II', 'III']
def tex_zahl(z):
    z = F(z)
    if z.denominator == 1: return str(z.numerator)
    s = '-' if z < 0 else ''
    return f'{s}\\\\frac{{{abs(z.numerator)}}}{{{z.denominator}}}'
def tex_matrix(rows):
    n = len(rows[0]) - 1
    spalten = 'c' * n + '|c'
    inner = '\\\\\\\\'.join('&'.join(tex_zahl(v) for v in r) for r in rows)
    return f'\\\\left(\\\\begin{{array}}{{{spalten}}}{inner}\\\\end{{array}}\\\\right)'
def op(rows, ziel, a, quelle, b):
    """row ziel := a*row ziel + b*row quelle"""
    rows = [list(r) for r in rows]
    rows[ziel] = [a * x + b * y for x, y in zip(rows[ziel], rows[quelle])]
    return rows
def op_tex(ziel, a, quelle, b):
    s = (f'{a}\\\\cdot\\\\text{{{ROEM[ziel]}}}' if a != 1 else f'\\\\text{{{ROEM[ziel]}}}')
    if b < 0: s += '-' + (f'{-b}\\\\cdot' if b != -1 else '') + f'\\\\text{{{ROEM[quelle]}}}'
    else: s += '+' + (f'{b}\\\\cdot' if b != 1 else '') + f'\\\\text{{{ROEM[quelle]}}}'
    return s
if __name__ == '__main__':
    rows = [list(map(F, r)) for r in json.loads(sys.argv[1])]
    schritte = json.loads(sys.argv[2])   # [[ [ziel,a,quelle,b], ... ], ...] one list per step
    print('A:', tex_matrix(rows))
    for s in schritte:
        for (z, a, q, b) in s:
            rows = op(rows, z, a, q, b)
        print('S:', tex_matrix(rows), '|', ',\\\\ '.join(op_tex(*o) for o in s))
