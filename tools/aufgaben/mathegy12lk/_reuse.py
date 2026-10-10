"""_reuse.py - build a Leistungskurs-12 sheet from Grundkurs-12 questions (tools/aufgaben/mathegy12/wNN-*.py) plus new ones.

Same idea as tools/aufgaben/mathegy11lk/_reuse.py: the Grundkurs spec runs with a recorder instead of gy12(), its
Q.q(...) calls are collected, its check() is kept, nothing is written. So a question exists once (single source of
truth) and both courses build from it. On top: put() places harvested and new questions in one list and renumbers
references such as „Aufgabe 13“ or „Aufgaben 2 bis 4“ inside harvested questions to the new places; a reference to a
question that is not on the sheet stops the build.

    from _reuse import gk, new, put, gk_checks
    N = new()
    N.q(r'…', [...], [...])                                   # a new Leistungskurs question
    put(Q, [gk('w04-integrieren-cas.py', [0, 1, 5]), N.take(0, 3), gk('w02-stammfunktion.py')])
    def check():
        gk_checks()                                           # every harvested Grundkurs number stays checked
        ...                                                   # plus the checks of the new questions
"""
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
GK = os.path.join(HERE, '..', 'mathegy12')
_CHECKS = {}


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


class _New(_Recorder):
    def take(self, start=0, stop=None):
        """New questions start..stop-1 (all from start when stop is None), in the order they were written."""
        stop = len(self.qs) if stop is None else stop
        return [(a, k, None, i) for i, (a, k) in enumerate(self.qs[start:stop], start)]


def new():
    return _New()


def gk(name, pick=None):
    """Questions of a Grundkurs-12 spec in the order given by pick (None = all), as items for put()."""
    path = os.path.join(GK, name)
    src = open(path, encoding='utf-8').read()
    if src.count('Q = gy12(') != 1:
        raise SystemExit('%s: kein eindeutiges „Q = gy12(“' % name)
    src = src.replace('Q = gy12(', 'Q = _RECORDER(')
    ns = {'__name__': '_harvest', '__file__': path, '_RECORDER': _Recorder}
    exec(compile(src, path, 'exec'), ns)
    rec = ns['Q']
    _CHECKS[name] = rec.check
    idx = range(len(rec.qs)) if pick is None else pick
    return [(rec.qs[i][0], rec.qs[i][1], name, i) for i in idx]


def gk_checks():
    for check in _CHECKS.values():
        check()


_REF = re.compile(r'Aufgabe (\d+)|Aufgaben (\d+) bis (\d+)')


def _renumber(s, src, where, pos):
    def one(n):
        key = (src, int(n) - 1)
        if key not in pos:
            raise SystemExit('%s verweist auf Aufgabe %s aus %s, die nicht auf dem Blatt steht' % (where, n, src))
        return str(pos[key] + 1)

    def sub(m):
        if m.group(1):
            return 'Aufgabe ' + one(m.group(1))
        return 'Aufgaben %s bis %s' % (one(m.group(2)), one(m.group(3)))
    return _REF.sub(sub, s) if isinstance(s, str) else s


def put(Q, groups):
    """Add the items of all groups to Q in this order; references in harvested questions follow their targets."""
    items = [it for g in groups for it in g]
    pos = {(src, i): n for n, (_, _, src, i) in enumerate(items) if src}
    for n, (a, k, src, i) in enumerate(items):
        if src:
            where = 'Frage %d (%s #%d)' % (n + 1, src, i + 1)
            a = [_renumber(a[0], src, where, pos), a[1], [_renumber(s, src, where, pos) for s in a[2]]] + list(a[3:])
            a[1] = [_renumber(o, src, where, pos) for o in a[1]]
        Q.q(*a, **k)
