#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Leistungskurs, Woche 23 (LB 9): Minimale und maximale Entfernungen.
Alle Fragen kommen aus den Grundkurs-Blättern w22-extremale-abstaende.py, w21-abstaende-anwendungen.py in tools/aufgaben/mathegy12/
(eine Quelle, Zahlen dort geprüft). Plan: HTML/svp/mathe/mathegy12lk.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from quiz import gy12lk
from _reuse import gk, put, gk_checks

Q = gy12lk(nr=23, slug='extremale-abstaende', thema='Minimale und maximale Entfernungen', lb='LB 9',
           blurb='kürzeste Wege zu Graphen, bewegte Objekte, Abstände und Winkel an einer Pyramide',
           comment='Abstandsfunktionen minimieren (1-12), vernetzte Aufgabe an einer Pyramide (13-20)')

put(Q, [gk('w22-extremale-abstaende.py', [0, 5, 6, 7, 8, 9, 10, 11, 14, 15, 16, 18]),
        gk('w21-abstaende-anwendungen.py', [0, 1, 2, 3, 4, 5, 6, 7])])

Q.verify(gk_checks)
Q.save()
