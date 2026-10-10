#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Leistungskurs, Woche 20 (LB 8): Schnittwinkel.
Alle Fragen kommen aus den Grundkurs-Blättern w18-schnittwinkel.py, w19-ebenenwinkel.py in tools/aufgaben/mathegy12/
(eine Quelle, Zahlen dort geprüft). Plan: HTML/svp/mathe/mathegy12lk.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from quiz import gy12lk
from _reuse import gk, put, gk_checks

Q = gy12lk(nr=20, slug='schnittwinkel', thema='Schnittwinkel', lb='LB 8',
           blurb='Gerade–Gerade, Gerade–Ebene, Ebene–Ebene, Dächer und Pyramiden',
           comment='Schnittwinkel Gerade–Gerade und Gerade–Ebene (1-10), Ebene–Ebene (11-20)')

put(Q, [gk('w18-schnittwinkel.py', [0, 2, 3, 5, 6, 7, 9, 13, 17, 19]),
        gk('w19-ebenenwinkel.py', [0, 2, 3, 4, 5, 8, 9, 14, 16, 18])])

Q.verify(gk_checks)
Q.save()
