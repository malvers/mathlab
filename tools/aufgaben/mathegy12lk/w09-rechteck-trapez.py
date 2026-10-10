#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Leistungskurs, Woche 9 (WB 5): Rechteck- und Trapezverfahren.
Alle Fragen kommen aus den Grundkurs-Blättern w09-rechteckverfahren.py, w10-trapezverfahren.py in tools/aufgaben/mathegy12/
(eine Quelle, Zahlen dort geprüft). Plan: HTML/svp/mathe/mathegy12lk.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from quiz import gy12lk
from _reuse import gk, put, gk_checks

Q = gy12lk(nr=9, slug='rechteck-trapez', thema='Rechteck- und Trapezverfahren', lb='WB 5',
           blurb='Archimedes, Leibniz, Riemann, Links-, Rechts- und Mittelpunktsumme, Trapezsumme',
           comment='Wahlbereich 5 Numerische Integrationsverfahren, erste Woche: Geschichte und Rechteckverfahren (1-10), Trapezverfahren (11-20)')

put(Q, [gk('w09-rechteckverfahren.py', [0, 1, 2, 3, 4, 5, 8, 9, 10, 14]),
        gk('w10-trapezverfahren.py', [0, 1, 2, 3, 5, 7, 8, 11, 12, 19])])

Q.verify(gk_checks)
Q.save()
