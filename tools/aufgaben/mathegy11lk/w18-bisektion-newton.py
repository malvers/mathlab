#!/usr/bin/env python3
"""Exercises GY Mathe 11 LK, week 18 / KW 1 (WB 2): solving graphically, bisection and Newton's method - 10 questions
each from the Grundkurs sheets mathegy11/w21 (bisection) and w22 (Newton). Plan: HTML/svp/mathe/mathegy11lk.html."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..')); sys.path.insert(0, HERE)
from quiz import gy11lk
from _reuse import harvest

Q = gy11lk(nr=18, slug='bisektion-newton', thema='Grafisch lösen, Bisektion und Newton-Verfahren', lb='WB 2',
           blurb='Vorzeichenwechsel, Intervallhalbierung und Genauigkeit, Tangentenidee, Konvergenz und Versagen',
           comment='Questions 1-10 from the Grundkurs sheet mathegy11/w21 (bisection), 11-20 from mathegy11/w22 (Newton).')

qs_b, check_b = harvest('w21-bisektion.py', [0, 2, 5, 6, 9, 10, 14, 15, 16, 18])
qs_n, check_n = harvest('w22-newton-verfahren.py', [0, 1, 2, 4, 5, 6, 9, 11, 12, 15])
for a, k in qs_b + qs_n:
    Q.q(*a, **k)


def check():
    check_b()
    check_n()


Q.verify(check)
Q.save()
