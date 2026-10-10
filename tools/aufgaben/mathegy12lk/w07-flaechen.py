#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Leistungskurs, Woche 7 (LB 5): Flächeninhalte.
Alle Fragen kommen aus den Grundkurs-Blättern w07-flaechen-achse.py, w08-flaechen-graphen.py in tools/aufgaben/mathegy12/
(eine Quelle, Zahlen dort geprüft). Plan: HTML/svp/mathe/mathegy12lk.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from quiz import gy12lk
from _reuse import gk, put, gk_checks

Q = gy12lk(nr=7, slug='flaechen', thema='Flächeninhalte', lb='LB 5',
           blurb='Flächen zwischen Graph und x-Achse und zwischen zwei Graphen, Grenzen und Parameter',
           comment='Berechnung von Flächeninhalten: zwischen Graph und x-Achse (1-10), zwischen zwei Graphen (11-20)')

put(Q, [gk('w07-flaechen-achse.py', [1, 2, 3, 4, 5, 6, 9, 10, 13, 16]),
        gk('w08-flaechen-graphen.py', [0, 2, 3, 4, 5, 7, 9, 12, 15, 19])])

Q.verify(gk_checks)
Q.save()
