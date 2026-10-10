#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Leistungskurs, Woche 27: Probe zur Klausur 12/II unter
Abiturbedingungen - Schwerpunkt LB 7 und LB 8, dazu Integral, Stochastik und WB 5.
Alle 20 Fragen kommen aus tools/aufgaben/mathegy12/w27-klausur2.py (eine Quelle, Zahlen dort geprüft).
Plan: HTML/svp/mathe/mathegy12lk.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from quiz import gy12lk
from _reuse import gk, put, gk_checks

Q = gy12lk(nr=27, slug='klausur2', thema='Probeklausur 12/II', lb='Klausur',
           blurb='Abstände, Winkel, Spiegelung, Scharen, dazu Integral und Stochastik',
           comment='Alle 20 Fragen aus dem Grundkurs-Blatt w27-klausur2 (eine Quelle für beide Kurse). Blocks: Ebene ABC und Punkt P (3-10), Vektoren und Winkel (1, 2), Abstand und Scharen (11-13, 20), Integral und WB 5 (14, 15, 18, 19), Stochastik (16, 17). Teil A ohne Hilfsmittel.')

put(Q, [gk('w27-klausur2.py')])

Q.verify(gk_checks)
Q.save()
