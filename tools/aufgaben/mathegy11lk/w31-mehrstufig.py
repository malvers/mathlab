#!/usr/bin/env python3
"""Exercises GY Mathe 11 LK, week 31 / KW 17 (LB 4): multistage experiments - urn model, tree, path rules,
complementary event, two-way table. 15 questions from the Grundkurs sheet mathegy11/w31, 5 from mathegy11/w32.
Plan: HTML/svp/mathe/mathegy11lk.html."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..')); sys.path.insert(0, HERE)
from quiz import gy11lk
from _reuse import harvest

Q = gy11lk(nr=31, slug='mehrstufig', thema='Mehrstufige Zufallsexperimente', lb='LB 4',
           blurb='Urnenmodell mit und ohne Zurücklegen, Baumdiagramm, Pfadregeln, Gegenereignis, Vierfeldertafel',
           comment='Questions 1-15 from the Grundkurs sheet mathegy11/w31, 16-20 from mathegy11/w32 (two-way table).')

qs_m, check_m = harvest('w31-mehrstufig.py', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 15, 16])
qs_v, check_v = harvest('w32-vierfeldertafel.py', [0, 1, 2, 3, 17])
for a, k in qs_m + qs_v:
    Q.q(*a, **k)


def check():
    check_m()
    check_v()


Q.verify(check)
Q.save()
