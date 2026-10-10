#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Leistungskurs, Woche 3 (LB 5): Integrieren ohne Hilfsmittel -
Potenzfunktionen mit rationalen Exponenten, Grundintegrale von e^x, 1/x und sin x,
Faktor- und Summenregel, einfache bestimmte Integrale.
Alle 20 Fragen kommen aus tools/aufgaben/mathegy12/w03-grundintegrale.py (eine Quelle, Zahlen dort geprüft).
Plan: HTML/svp/mathe/mathegy12lk.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from quiz import gy12lk
from _reuse import gk, put, gk_checks

Q = gy12lk(nr=3, slug='grundintegrale', thema='Integrieren ohne Hilfsmittel', lb='LB 5',
           blurb='Potenzfunktionen mit rationalen Exponenten, e hoch x, 1 durch x, sin x',
           comment='Alle 20 Fragen aus dem Grundkurs-Blatt w03-grundintegrale (eine Quelle für beide Kurse). Blocks: Potenzregel mit Wurzeln und Brüchen (1, 2, 8, 9, 19), Grundintegrale e^x, 1/x, sin, cos (3-7, 20), bestimmte Integrale (10-13, 15), Umformen und Probe (14, 16-18). Ohne Hilfsmittel.')

put(Q, [gk('w03-grundintegrale.py')])

Q.verify(gk_checks)
Q.save()
