#!/usr/bin/env python3
"""Exercises GY Mathe 11 LK, week 27 / KW 12 (LB 3): planes in parametric and coordinate form - 10 questions each
from the Grundkurs sheets mathegy11/w28 (parametric form) and w29 (coordinate form). Plan: HTML/svp/mathe/mathegy11lk.html."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..')); sys.path.insert(0, HERE)
from quiz import gy11lk
from _reuse import harvest

Q = gy11lk(nr=27, slug='ebenen', thema='Ebenen in Parameter- und Koordinatenform', lb='LB 3',
           blurb='Ebene aus drei Punkten, Punktprobe, Koordinatenform, Achsenabschnitte, Wechsel der Darstellung',
           comment='Questions 1-10 from the Grundkurs sheet mathegy11/w28 (parametric form), 11-20 from mathegy11/w29 (coordinate form).')

qs_p, check_p = harvest('w28-ebenen-parameterform.py', [0, 1, 2, 3, 4, 7, 8, 12, 13, 17])
qs_k, check_k = harvest('w29-ebenen-koordinatenform.py', [0, 1, 3, 4, 5, 8, 10, 11, 13, 16])
for a, k in qs_p + qs_k:
    Q.q(*a, **k)


def check():
    check_p()
    check_k()


Q.verify(check)
Q.save()
