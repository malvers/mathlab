#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Leistungskurs, Woche 28: Generalprobe zum Abitur - ein
Querschnitt durch die Lernbereiche der Jahrgangsstufen 11 und 12 im Stil des
hilfsmittelfreien Teils.
Alle 20 Fragen kommen aus tools/aufgaben/mathegy12/w28-abiturvorbereitung.py (eine Quelle, Zahlen dort geprüft).
Plan: HTML/svp/mathe/mathegy12lk.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from quiz import gy12lk
from _reuse import gk, put, gk_checks

Q = gy12lk(nr=28, slug='abiturvorbereitung', thema='Generalprobe Abitur', lb='Abitur',
           blurb='Querschnitt durch Analysis, Integral, Stochastik und Geometrie',
           comment='Alle 20 Fragen aus dem Grundkurs-Blatt w28-abiturvorbereitung (eine Quelle für beide Kurse). Blocks: Ableiten und Kurven (1-8, 20), Integral (9-11), Stochastik (12-14), Vektoren, Geraden, Ebenen (15, 16, 18, 19), Gleichungssysteme (17). Ohne Hilfsmittel.')

put(Q, [gk('w28-abiturvorbereitung.py')])

Q.verify(gk_checks)
Q.save()
