#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Leistungskurs, Woche 24 (LB 9): Spiegelung von Punkten und
Geraden an Punkten, Geraden und Ebenen, Spiegelebene, Reflexion und kürzeste Wege.
Alle 20 Fragen kommen aus tools/aufgaben/mathegy12/w23-spiegelung.py (eine Quelle, Zahlen dort geprüft).
Plan: HTML/svp/mathe/mathegy12lk.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from quiz import gy12lk
from _reuse import gk, put, gk_checks

Q = gy12lk(nr=24, slug='spiegelung', thema='Spiegelung im Raum', lb='LB 9',
           blurb='Spiegeln an Punkten, Geraden und Ebenen, Reflexion und kürzeste Wege',
           comment='Alle 20 Fragen aus dem Grundkurs-Blatt w23-spiegelung (eine Quelle für beide Kurse). Blocks: Koordinatenebenen und Punkte (1-4, 10), an Ebenen (5-7, 16, 17), an Geraden (8, 9), Geraden und Strahlen (11, 12), Spiegelebene (13-15, 20), kürzester Weg (18, 19). Ohne Hilfsmittel.')

put(Q, [gk('w23-spiegelung.py')])

Q.verify(gk_checks)
Q.save()
