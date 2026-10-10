#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Leistungskurs, Woche 17 (Puffer): Vermischte Aufgaben vor Weihnachten.
Alle Fragen kommen aus den Grundkurs-Blättern w04-integrieren-cas.py, w07-flaechen-achse.py, w08-flaechen-graphen.py, w14-klausur1.py in tools/aufgaben/mathegy12/
(eine Quelle, Zahlen dort geprüft). Plan: HTML/svp/mathe/mathegy12lk.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from quiz import gy12lk
from _reuse import gk, put, gk_checks

Q = gy12lk(nr=17, slug='jahresausklang', thema='Vermischte Aufgaben vor Weihnachten', lb='Puffer',
           blurb='Integralrechnung mit Hilfsmitteln, Flächen, Schätzen und Testen',
           comment='Puffer vor den Weihnachtsferien: Integrieren mit CAS (1-5), Flächen (6-14), Schätzen und Testen (15-20)')

put(Q, [gk('w04-integrieren-cas.py', [6, 7, 14, 17, 19]),
        gk('w07-flaechen-achse.py', [11, 12, 14, 19]),
        gk('w08-flaechen-graphen.py', [6, 10, 13, 16, 17]),
        gk('w14-klausur1.py', [14, 15, 16, 17, 18, 19])])

Q.verify(gk_checks)
Q.save()
