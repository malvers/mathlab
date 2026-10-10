#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Leistungskurs, Woche 18 (LB 8): Skalarprodukt und Vektorprodukt
mit ihrer geometrischen Interpretation - Winkel, Orthogonalität, Projektion, Flächeninhalt,
Rechenregeln.
Alle 20 Fragen kommen aus tools/aufgaben/mathegy12/w15-skalar-vektorprodukt.py (eine Quelle, Zahlen dort geprüft).
Plan: HTML/svp/mathe/mathegy12lk.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from quiz import gy12lk
from _reuse import gk, put, gk_checks

Q = gy12lk(nr=18, slug='skalar-vektorprodukt', thema='Skalarprodukt und Vektorprodukt', lb='LB 8',
           blurb='Winkel, Orthogonalität, Projektion, Flächen mit dem Vektorprodukt',
           comment='Alle 20 Fragen aus dem Grundkurs-Blatt w15-skalar-vektorprodukt (eine Quelle für beide Kurse). Blocks: Skalarprodukt und Winkel (1-4, 12, 13, 18, 20), Orthogonalität (14, 16), Vektorprodukt (5-11, 15, 17), Flächen (7, 8, 19). Taschenrechner erlaubt.')

put(Q, [gk('w15-skalar-vektorprodukt.py')])

Q.verify(gk_checks)
Q.save()
