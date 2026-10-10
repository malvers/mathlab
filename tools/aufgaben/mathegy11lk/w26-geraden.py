#!/usr/bin/env python3
"""Exercises GY Mathe 11 LK, week 26 / KW 11 (LB 3): lines in parametric form and the relative position of two
lines - 10 questions each from the Grundkurs sheets mathegy11/w26 (lines) and w27 (position of lines).
Plan: HTML/svp/mathe/mathegy11lk.html."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..')); sys.path.insert(0, HERE)
from quiz import gy11lk
from _reuse import harvest

Q = gy11lk(nr=26, slug='geraden', thema='Geraden und ihre Lage zueinander', lb='LB 3',
           blurb='Parameterform, Punktprobe, Spurpunkte, identisch, parallel, schneidend, windschief',
           comment='Questions 1-10 from the Grundkurs sheet mathegy11/w26 (lines), 11-20 from mathegy11/w27 (position of lines).')

qs_g, check_g = harvest('w26-geraden.py', [0, 1, 3, 6, 7, 9, 12, 13, 15, 19])
qs_l, check_l = harvest('w27-lage-geraden.py', [0, 1, 4, 5, 7, 9, 11, 12, 13, 17])
for a, k in qs_g + qs_l:
    Q.q(*a, **k)


def check():
    check_g()
    check_l()


Q.verify(check)
Q.save()
