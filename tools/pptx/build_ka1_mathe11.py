#!/usr/bin/env python3
"""Wiederholung vor Klassenarbeit 1 - Mathe 11 (BGY), KW 45, LB 2 + LB 3."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck

d = MathDeck("mathe11-ka1.pptx")

d.title("Mathematik · Berufliches Gymnasium 11 · KW 45",
        "Wiederholung vor Klassenarbeit 1",
        "Alles aus Lernbereich 2 und dem Start von Lernbereich 3 — in vier Blöcken")

d.bullets("Was in der Arbeit drankommt", [
    ("**Klassenarbeit 1**, Termin nach Klausurplan, $45$ bis $90$ Minuten", 0),
    ("Stoff: **Gleichungen**, **Figuren und Körper**, **Funktionsbegriff**, **Wachstum**", 0),
    ("Ein Teil **ohne Hilfsmittel** — die Grundformen müssen sitzen", 0),
    ("Heute: die vier Blöcke einmal durch, danach **20 Aufgaben** zum Selbsttest", 0),
])

d.chapter(1, "Gleichungen und Terme", "Der Teil ohne Hilfsmittel")

d.bullets("Lineare Gleichungen in drei Schritten", [
    ("$4x + 9 = x - 6$: sortieren, isolieren, normieren", 0),
    ("$3x = -15$, also $x = -5$", 0),
    ("Mit Klammern: $2(3x - 4) = 4(x + 1)$ zuerst ausmultiplizieren", 0),
    ("$6x - 8 = 4x + 4$ ergibt $2x = 12$, also $x = 6$", 0),
])

d.bullets("Sonderfälle und Umformregeln", [
    ("$3(x + 2) = 3x + 6$ ist eine Identität — **unendlich viele** Lösungen", 0),
    ("Addieren und Subtrahieren sind **immer** erlaubt", 0),
    ("Teilen nur durch etwas, das **sicher nicht null** ist", 0),
    ("Deshalb darf man aus $x^2 = x$ nicht einfach durch $x$ teilen", 0),
])

d.bullets("Formeln umstellen und Potenzen", [
    ("$A = \\dfrac{1}{2}\\,g\\,h$ nach $h$: mal $2$, durch $g$, also $h = \\dfrac{2A}{g}$", 0),
    ("$(x - 6)^2 = x^2 - 12x + 36$ — der Mittelterm fehlt nie", 0),
    ("$x^2 - 100 = (x + 10)(x - 10)$ — dritte binomische Formel rückwärts", 0),
    ("$\\dfrac{(2x)^3}{4x} = \\dfrac{8x^3}{4x} = 2x^2$", 0),
])

d.bullets("Nichtlineare Gleichungen im Kopf", [
    ("$x^2 = 121$ hat **zwei** Lösungen: $x = 11$ und $x = -11$", 0),
    ("$3^x = 81$: wie oft $3$ mal genommen? $x = 4$", 0),
    ("Preis fällt von $250$ € auf $200$ €: Änderung $50$, bezogen auf $250$", 0),
    ("Also $\\dfrac{50}{250} = 0{,}2$, ein Rückgang um $20\\,\\%$", 0),
])

d.chapter(2, "Figuren und Körper", "Formelsammlung ja — auswählen musst du selbst")

d.bullets("Volumen vorwärts und rückwärts", [
    ("Zylinder mit $r = 2$ cm, $h = 5$ cm: $V = \\pi \\cdot 4 \\cdot 5 = 20\\pi$ cm³", 0),
    ("Rückwärts: $V = 100\\pi$ cm³ bei $r = 5$ cm", 0),
    ("$100\\pi = \\pi \\cdot 25 \\cdot h$, also $h = 4$ cm", 0),
    ("Einheitenprobe: cm³ durch cm² ergibt cm — passt zu einer Höhe", 0),
])

d.merksatz("In der Arbeit zählt nicht, ob du die Formel kennst, sondern ob du die richtige auswählst.")

d.chapter(3, "Funktionen", "Der neue Teil aus Lernbereich 3")

d.bullets("Definitionsbereich, Nullstelle, Symmetrie", [
    ("$f(x) = \\dfrac{2}{x + 3}$: alle reellen Zahlen **außer** $x = -3$", 0),
    ("Nullstelle von $f(x) = -3x + 12$: $3x = 12$, also $x = 4$", 0),
    ("$f(4) = 0$ heißt genau das — an der Stelle $4$ ist der Wert null", 0),
    ("$f(x) = x^2 - 5$ hat nur gerade Exponenten: **achsensymmetrisch**", 0),
])

d.bullets("Anstieg und Wachstum", [
    ("Gerade durch $(2 \\mid 3)$ und $(6 \\mid 11)$: $m = \\dfrac{8}{4} = 2$", 0),
    ("$2000$ € mit $4\\,\\%$: nach einem Jahr $2000 \\cdot 1{,}04 = 2080$ €", 0),
    ("Exponentiell erkennt man am **gleichen Quotienten** in der Tabelle", 0),
    ("Linear dagegen an der **gleichen Differenz**", 0),
])

d.two_cols("Die Fehler, die in Arbeiten am meisten kosten", [
    ("Beim Rechnen", 0),
    ("nur eine Lösung bei $x^2 = a$", 1),
    ("Minus vor der Klammer verschluckt", 1),
    ("Prozent auf den falschen Grundwert", 1),
], [
    ("Beim Aufschreiben", 0),
    ("Definitionsbereich nicht genannt", 1),
    ("Einheit vergessen", 1),
    ("Antwortsatz fehlt", 1),
])

d.bullets("So gehst du in die Arbeit", [
    ("**Erst alles überfliegen**, dann mit der sichersten Aufgabe anfangen", 0),
    ("Zwischenschritte hinschreiben — dafür gibt es Punkte, auch ohne Ergebnis", 0),
    ("**Probe** machen, wo sie schnell geht: einsetzen und vergleichen", 0),
    ("Am Ende Einheiten und Antwortsätze prüfen", 0),
])

d.bullets("Jetzt ihr", [
    ("**20 Aufgaben** im Mathe-Labor — Querschnitt durch den gesamten Prüfungsstoff", 0),
    ("Was hier hakt, ist die Liste für die letzten Tage vor der Arbeit", 0),
    ("Lösungswege erst aufklappen, wenn ihr wirklich gerechnet habt", 0),
    ("**docalvers.de/mathetest11-ka1.html**", 0),
])

d.save()
