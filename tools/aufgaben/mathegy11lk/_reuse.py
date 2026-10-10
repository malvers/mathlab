"""_reuse.py - take questions from a Grundkurs spec (tools/aufgaben/mathegy11/wNN-*.py) into a Leistungskurs sheet.

The Grundkurs spec is run with a recorder instead of gy11(): its Q.q(...) calls are collected, its check() is kept,
nothing is written. So a question exists once (single source of truth) and both courses build from it.

    from _reuse import harvest
    qs, check_gk = harvest('w13-matrizen.py', [0, 1, 5, 6])   # pick by 0-based position, None = all
    for a, k in qs:
        Q.q(*a, **k)
    def check():
        check_gk()            # the Grundkurs numbers stay checked
        ...                   # plus the checks of the new questions
"""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
GK = os.path.join(HERE, '..', 'mathegy11')


class _Recorder:
    def __init__(self, *a, **k):
        self.qs = []
        self.check = lambda: None

    def q(self, *a, **k):
        self.qs.append((a, k))

    def verify(self, check):
        self.check = check

    def save(self):
        pass


def harvest(name, pick=None):
    """Questions (args, kwargs) of a Grundkurs spec in the order given by pick, and its check()."""
    path = os.path.join(GK, name)
    src = open(path, encoding='utf-8').read()
    if src.count('Q = gy11(') != 1:
        raise SystemExit('%s: kein eindeutiges „Q = gy11(“' % name)
    src = src.replace('Q = gy11(', 'Q = _RECORDER(')
    ns = {'__name__': '_harvest', '__file__': path, '_RECORDER': _Recorder}
    exec(compile(src, path, 'exec'), ns)
    rec = ns['Q']
    qs = rec.qs if pick is None else [rec.qs[i] for i in pick]
    return qs, rec.check
