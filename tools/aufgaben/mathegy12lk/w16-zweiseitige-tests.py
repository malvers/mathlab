#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Leistungskurs, Woche 16 (LB 7): Zweiseitige Signifikanztests
für binomialverteilte Zufallsgrößen, statistische Sicherheit, Vergleich mit einseitigen
Tests, Deutung.
Alle 20 Fragen kommen aus tools/aufgaben/mathegy12/w13-zweiseitige-tests.py (eine Quelle, Zahlen dort geprüft).
Plan: HTML/svp/mathe/mathegy12lk.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from quiz import gy12lk
from _reuse import gk, put, gk_checks

Q = gy12lk(nr=16, slug='zweiseitige-tests', thema='Zweiseitige Tests und statistische Sicherheit', lb='LB 7',
           blurb='zweiseitiger Ablehnungsbereich, Niveau auf beide Seiten, statistische Sicherheit',
           comment='Alle 20 Fragen aus dem Grundkurs-Blatt w13-zweiseitige-tests (eine Quelle für beide Kurse). Blocks: Wann zweiseitig (1, 2, 15, 16), Niveau aufteilen und Bereich bestimmen (3-7, 11, 12, 17), statistische Sicherheit und tatsächliches Niveau (8-10, 18), Entscheidung und Deutung (13, 14, 19, 20). Mit CAS/Tabelle.')

put(Q, [gk('w13-zweiseitige-tests.py')])

Q.verify(gk_checks)
Q.save()
