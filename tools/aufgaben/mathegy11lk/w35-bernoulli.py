#!/usr/bin/env python3
"""Exercises GY Mathe 11 LK, week 35 / KW 21 (LB 4): Bernoulli chains, single and cumulative probabilities,
derivation of the formula - questions from the Grundkurs sheets mathegy11/w33 (8), w34 (6) and w35 (6).
Plan: HTML/svp/mathe/mathegy11lk.html."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..')); sys.path.insert(0, HERE)
from quiz import gy11lk
from _reuse import harvest

Q = gy11lk(nr=35, slug='bernoulli', thema='Bernoulli-Ketten: Einzel- und kumulierte Wahrscheinlichkeiten', lb='LB 4',
           blurb='Bernoulli-Experiment und -Kette, Formel herleiten, Einzelwahrscheinlichkeiten, Summensymbol, Gegenereignis',
           comment='Questions 1-8 from mathegy11/w33, 9-14 from mathegy11/w34, 15-20 from mathegy11/w35 (Grundkurs).')

qs_b, check_b = harvest('w33-bernoulli.py', [0, 1, 2, 12, 13, 14, 17, 18])
qs_v, check_v = harvest('w34-binomialverteilung.py', [0, 1, 4, 8, 9, 12])
qs_k, check_k = harvest('w35-kumuliert.py', [0, 3, 4, 6, 8, 14])
for a, k in qs_b + qs_v + qs_k:
    Q.q(*a, **k)


def check():
    check_b()
    check_v()
    check_k()


Q.verify(check)
Q.save()
