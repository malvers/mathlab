#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Leistungskurs, Woche 15 (LB 7): Einseitige Signifikanztests für
binomialverteilte Zufallsgrößen - Nullhypothese, Testgröße, Signifikanzniveau, kritischer
Wert, Ablehnungsbereich, Entscheidungsregel.
Alle 20 Fragen kommen aus tools/aufgaben/mathegy12/w12-signifikanztest.py (eine Quelle, Zahlen dort geprüft).
Plan: HTML/svp/mathe/mathegy12lk.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from quiz import gy12lk
from _reuse import gk, put, gk_checks

Q = gy12lk(nr=15, slug='signifikanztest', thema='Einseitige Signifikanztests', lb='LB 7',
           blurb='Nullhypothese, Signifikanzniveau, kritischer Wert, Ablehnungsbereich',
           comment='Alle 20 Fragen aus dem Grundkurs-Blatt w12-signifikanztest (eine Quelle für beide Kurse). Blocks: Hypothese, Testgröße, Richtung (1-4, 19), Ablehnungsbereich rechtsseitig (5, 6, 9, 14-17), linksseitig (10), Entscheidung und Deutung (7, 8, 11-13, 18, 20). Mit CAS/Tabelle der kumulierten Binomialverteilung.')

put(Q, [gk('w12-signifikanztest.py')])

Q.verify(gk_checks)
Q.save()
