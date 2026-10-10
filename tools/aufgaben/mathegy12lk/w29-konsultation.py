#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Leistungskurs, Woche 29 (Konsultationen): die typischen
Fehlerfallen kurz vor der Prüfung - Kettenregel, Stammfunktionen, Fläche gegen Integral,
notwendige und hinreichende Bedingungen, Abstands- und Winkelformeln, Gegenereignis.
Alle 20 Fragen kommen aus tools/aufgaben/mathegy12/w29-konsultation.py (eine Quelle, Zahlen dort geprüft).
Plan: HTML/svp/mathe/mathegy12lk.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from quiz import gy12lk
from _reuse import gk, put, gk_checks

Q = gy12lk(nr=29, slug='konsultation', thema='Fehlerfallen vor der Prüfung', lb='Abitur',
           blurb='Die Klassiker unter den Fehlern: erkennen und vermeiden',
           comment='Alle 20 Fragen aus dem Grundkurs-Blatt w29-konsultation (eine Quelle für beide Kurse). Blocks: Ableiten (1, 5, 6, 15, 16), Stammfunktion und Integral (2, 3, 14, 18), Kurvendiskussion (4, 20), Logarithmus (17), Vektoren (7-10, 19), Stochastik (11-13). Ohne Hilfsmittel.')

put(Q, [gk('w29-konsultation.py')])

Q.verify(gk_checks)
Q.save()
