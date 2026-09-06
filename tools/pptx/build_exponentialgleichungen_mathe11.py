#!/usr/bin/env python3
"""Exponentialgleichungen a^x = b - Mathe 11 (BGY), KW 3, LB 3."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck

d = MathDeck("mathe11-exponentialgleichungen.pptx")

d.title("Mathematik · Berufliches Gymnasium 11 · KW 3",
        "Exponentialgleichungen",
        "Wenn das x im Exponenten steht — Halbwertszeit und Verdopplungszeit ausrechnen")

d.bullets("Der Fahrplan dieser Woche", [
    ("Lernbereich 3 — Stunden **56 bis 60 von 75**", 0),
    ("Drei Blöcke: **im Kopf lösen**, **mit Logarithmus**, **Anwendungen**", 0),
    ("Endlich können wir die Frage beantworten: **wann ist es so weit?**", 0),
    ("Übungen bewusst **ohne und mit** Hilfsmitteln", 0),
])

d.chapter(1, "Ohne Rechner", "Wenn beide Seiten dieselbe Basis haben")

d.bullets("Auf gleiche Basis bringen", [
    ("$2^x = 32$: rechts steht $2^5$, also $x = 5$", 0),
    ("$3^x = \\dfrac{1}{27} = 3^{-3}$, also $x = -3$", 0),
    ("$10^x = 0{,}001 = 10^{-3}$, also $x = -3$", 0),
    ("Regel: gleiche Basis, dann **Exponenten vergleichen**", 0),
])

d.bullets("Wenn die Basen verschieden aussehen", [
    ("$4^x = 8$ — beide sind Potenzen von $2$", 0),
    ("$2^{2x} = 2^3$, also $2x = 3$ und damit $x = 1{,}5$", 0),
    ("$3^{x+1} = 81 = 3^4$ gibt $x + 1 = 4$, also $x = 3$", 0),
    ("$e^x = 1$ gibt $x = 0$ — jede Basis hoch null ist eins", 0),
])

d.bullets("Vorfaktoren zuerst wegräumen", [
    ("$2 \\cdot 3^x = 54$: erst durch $2$ teilen", 0),
    ("$3^x = 27$, also $x = 3$", 0),
    ("Niemals den Vorfaktor in den Exponenten ziehen", 0),
    ("$2^x = -8$ hat **keine** Lösung: eine Potenz wird nie negativ", 0),
])

d.merksatz("Erst prüfen, ob beide Seiten dieselbe Basis haben. Der Logarithmus ist für den Rest da.")

d.chapter(2, "Mit Logarithmus", "Der allgemeine Weg")

d.bullets("Die allgemeine Lösung", [
    ("$a^x = b$ hat die Lösung $x = \\log_a b$", 0),
    ("Mit dem Taschenrechner: $x = \\dfrac{\\log b}{\\log a}$", 0),
    ("Der Logarithmus holt das $x$ **aus dem Exponenten heraus**", 0),
    ("Genau dafür ist das Gesetz $\\log(a^x) = x \\cdot \\log a$ da", 0),
])

d.bullets("Zwei Beispiele mit Rechner", [
    ("$5^x = 20$ gibt $x = \\dfrac{\\log 20}{\\log 5} \\approx 1{,}86$", 0),
    ("$2^x = 7$ gibt $x = \\dfrac{\\log 7}{\\log 2} \\approx 2{,}81$", 0),
    ("**Probe**: $2^{2{,}81} \\approx 7$ — einsetzen und nachsehen", 0),
    ("Bei gerundeten Lösungen ist die Probe nie exakt, aber nah dran", 0),
])

d.bullets("Die Falle beim Teilen durch etwas Negatives", [
    ("$0{,}9^t = 0{,}5$ logarithmiert: $t \\cdot \\log 0{,}9 = \\log 0{,}5$", 0),
    ("$\\log 0{,}9$ ist **negativ**, weil $0{,}9 < 1$ ist", 0),
    ("Beim Teilen durch eine negative Zahl dreht sich bei **Ungleichungen** das Zeichen", 0),
    ("Hier steht ein Gleichheitszeichen — da dreht sich **nichts**", 0),
])

d.chapter(3, "Anwendungen", "Verdopplungs- und Halbwertszeit")

d.bullets("Wann hat sich das Kapital verdoppelt?", [
    ("$5\\,\\%$ jährlich heißt $1{,}05^t = 2$", 0),
    ("$t = \\dfrac{\\log 2}{\\log 1{,}05} \\approx 14{,}2$ Jahre", 0),
    ("Allgemein: Verdopplungszeit $= \\dfrac{\\log 2}{\\log q}$", 0),
    ("Faustregel für den Kopf: **$70$ geteilt durch den Prozentsatz**", 0),
])

d.bullets("Wann ist die Hälfte zerfallen?", [
    ("Faktor $0{,}9$ pro Tag: $0{,}9^t = 0{,}5$", 0),
    ("$t = \\dfrac{\\log 0{,}5}{\\log 0{,}9} \\approx 6{,}6$ Tage", 0),
    ("Auto verliert $15\\,\\%$ jährlich: $0{,}85^t = 0{,}5$ gibt rund $4{,}3$ Jahre", 0),
    ("Wald nimmt $3\\,\\%$ ab, noch $80\\,\\%$ übrig: $0{,}97^t = 0{,}8$, rund $7{,}3$ Jahre", 0),
])

d.bullets("Ein Bestand erreicht eine Zielgröße", [
    ("$N(t) = 500 \\cdot 2^t$ soll $8000$ erreichen", 0),
    ("Erst den Vorfaktor wegteilen: $2^t = 16$", 0),
    ("Also $t = 4$ Stunden — hier geht es sogar im Kopf", 0),
    ("**Immer zuerst freistellen**, dann logarithmieren", 0),
])

d.two_cols("Welcher Weg?", [
    ("Ohne Rechner", 0),
    ("beide Seiten dieselbe Basis", 1),
    ("kleine ganze Exponenten", 1),
    ("Brüche als negative Potenzen", 1),
], [
    ("Mit Logarithmus", 0),
    ("Basen passen nicht zusammen", 1),
    ("Zielwert ist krumm", 1),
    ("Zeitpunkt gesucht", 1),
])

d.bullets("Jetzt ihr", [
    ("**20 Aufgaben** im Mathe-Labor — im Kopf, mit Logarithmus, Anwendungen", 0),
    ("Bei jeder Aufgabe erst fragen: **geht es ohne Rechner?**", 0),
    ("Und am Ende die Probe: eingesetzt, ungefähr getroffen?", 0),
    ("**docalvers.de/mathetest11-exponentialgleichungen.html**", 0),
])

d.save()
