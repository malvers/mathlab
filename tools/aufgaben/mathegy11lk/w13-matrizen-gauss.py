#!/usr/bin/env python3
"""Exercises GY Mathe 11 LK, week 13 / KW 48 (LB 2): systems as A x = b, matrix multiplication, Gauss-Jordan and
solvability - 10 questions each from the Grundkurs sheets on matrices and on Gauss-Jordan. Plan: HTML/svp/mathe/mathegy11lk.html."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..')); sys.path.insert(0, HERE)
from quiz import gy11lk
from _reuse import harvest

Q = gy11lk(nr=13, slug='matrizen-gauss', thema='Matrizen und Gauß-Jordan-Verfahren', lb='LB 2',
           blurb='Gleichungssysteme als A · x = b, Matrizenmultiplikation, Gauß-Jordan, Lösbarkeit',
           comment='Questions 1-10 from the Grundkurs sheet mathegy11/w13 (matrices), 11-20 from mathegy11/w14 (Gauss-Jordan).')

qs_m, check_m = harvest('w13-matrizen.py', [0, 1, 3, 5, 6, 7, 8, 9, 10, 11])
qs_g, check_g = harvest('w14-gauss-jordan.py', [0, 1, 2, 3, 7, 8, 10, 11, 12, 13])
for a, k in qs_m + qs_g:
    Q.q(*a, **k)


def check():
    check_m()
    check_g()


Q.verify(check)
Q.save()
