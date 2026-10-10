#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Leistungskurs, Woche 2 (LB 5): Stammfunktion und unbestimmtes
Integral - Umkehrung des Differenzierens, Integrationskonstante, Stammfunktion durch
einen Punkt, Zusammenhang der Graphen von f und F.
Alle 20 Fragen kommen aus tools/aufgaben/mathegy12/w02-stammfunktion.py (eine Quelle, Zahlen dort geprüft).
Plan: HTML/svp/mathe/mathegy12lk.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from quiz import gy12lk
from _reuse import gk, put, gk_checks

Q = gy12lk(nr=2, slug='stammfunktion', thema='Stammfunktion und unbestimmtes Integral', lb='LB 5',
           blurb='Stammfunktionen finden und prüfen, Integrationskonstante, Graphen von f und F',
           comment='Alle 20 Fragen aus dem Grundkurs-Blatt w02-stammfunktion (eine Quelle für beide Kurse). Blocks: Stammfunktion finden (1-8), Konstante und Punkt (6, 8, 14, 15), Graphen von f und F (9-11), Anwendung und Geschichte (16, 17), Umformen (12, 13, 18-20). Ohne Hilfsmittel.')

put(Q, [gk('w02-stammfunktion.py')])

Q.verify(gk_checks)
Q.save()
