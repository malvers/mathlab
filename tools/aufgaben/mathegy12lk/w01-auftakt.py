#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Leistungskurs, Woche 1 (Kursauftakt): Wiederholung der
Differentialrechnung aus Jahrgangsstufe 11 - Ableitungsregeln, Tangente und Normale,
Extrem- und Wendepunkte, Grenzwerte, Steckbrief und Extremwertproblem.
Alle 20 Fragen kommen aus tools/aufgaben/mathegy12/w01-auftakt.py (eine Quelle, Zahlen dort geprüft).
Plan: HTML/svp/mathe/mathegy12lk.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from quiz import gy12lk
from _reuse import gk, put, gk_checks

Q = gy12lk(nr=1, slug='auftakt', thema='Kursauftakt: Wiederholung Differentialrechnung', lb='Auftakt',
           blurb='Ableitungsregeln, Tangenten, Extrem- und Wendepunkte, Grenzwerte',
           comment='Alle 20 Fragen aus dem Grundkurs-Blatt w01-auftakt (eine Quelle für beide Kurse). Blocks: Ableitungsregeln (1-7), Tangente und Normale (8, 14), Kurvenuntersuchung (9-11, 17, 20), Grenzwerte und Stetigkeit (12, 13, 19), Steckbrief und Optimieren (15, 16), Verkettung (18). Ohne Hilfsmittel.')

put(Q, [gk('w01-auftakt.py')])

Q.verify(gk_checks)
Q.save()
