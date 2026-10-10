#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Leistungskurs, Woche 14 (LB 7): Grundprobleme der beurteilenden
Statistik, Schätzen von Parametern - Grundgesamtheit und Stichprobe, Hochrechnung,
Stichprobenmittel, Stichprobenvarianz.
Alle 20 Fragen kommen aus tools/aufgaben/mathegy12/w11-schaetzen.py (eine Quelle, Zahlen dort geprüft).
Plan: HTML/svp/mathe/mathegy12lk.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from quiz import gy12lk
from _reuse import gk, put, gk_checks

Q = gy12lk(nr=14, slug='schaetzen', thema='Schätzen von Parametern', lb='LB 7',
           blurb='Stichprobe und Grundgesamtheit, Hochrechnung, Stichprobenmittel und -varianz',
           comment='Alle 20 Fragen aus dem Grundkurs-Blatt w11-schaetzen (eine Quelle für beide Kurse). Blocks: Grundbegriffe und Stichprobe (7-9, 12, 19), Anteile schätzen und hochrechnen (1, 2, 13-16, 18), Stichprobenmittel und -varianz (3-6, 10, 11, 17, 20). Stichprobenvarianz mit 1/(n-1). Taschenrechner erlaubt.')

put(Q, [gk('w11-schaetzen.py')])

Q.verify(gk_checks)
Q.save()
