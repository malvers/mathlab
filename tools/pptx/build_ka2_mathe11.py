#!/usr/bin/env python3
"""Wiederholung vor Klassenarbeit 2 - Mathe 11 (BGY), KW 4, LB 3."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck

d = MathDeck("mathe11-ka2.pptx")

d.title("Mathematik · Berufliches Gymnasium 11 · KW 4",
        "Wiederholung vor Klassenarbeit 2",
        "Alle Funktionsklassen von der Geraden bis zum Logarithmus")

d.bullets("Was in der Arbeit drankommt", [
    ("**Klassenarbeit 2**, $90$ Minuten, Lernbereich 3 bis zum Logarithmus", 0),
    ("Vier Familien: **linear**, **quadratisch**, **exponentiell und Logarithmus**, **Sinus**", 0),
    ("Dazu **Umkehrfunktionen**, Wurzeln und Verschiebungen", 0),
    ("Heute alles einmal durch, danach **20 Aufgaben** zum Selbsttest", 0),
])

d.chapter(1, "Gerade und Parabel", "Der Teil, der sitzen muss")

d.bullets("Lineares", [
    ("Anstieg durch $(-1 \\mid 2)$ und $(3 \\mid 10)$: $m = \\dfrac{8}{4} = 2$", 0),
    ("Umkehrfunktion von $f(x) = 3x - 9$: nach $x$ auflösen", 0),
    ("$f^{-1}(x) = \\dfrac{x + 9}{3}$", 0),
    ("Probe: $f^{-1}(f(1)) = 1$ — sonst ist irgendwo ein Vorzeichen verrutscht", 0),
])

d.bullets("Quadratisches", [
    ("$f(x) = (x + 1)^2 - 3$ hat den Scheitel $S(-1 \\mid -3)$", 0),
    ("$x^2 - 3x - 10 = 0$ gibt über Vieta $x = 5$ und $x = -2$", 0),
    ("$x^2 + 4x + 4 = 0$ ist $(x + 2)^2 = 0$ — **eine** Lösung", 0),
    ("$x^2$ um $2$ nach rechts und $1$ nach oben: $f(x) = (x - 2)^2 + 1$", 0),
])

d.chapter(2, "Wachstum, Wurzel, Logarithmus", "Der neue Stoff")

d.bullets("Wachstumsfaktoren lesen", [
    ("Von $400$ auf $500$ in einem Jahr: $q = \\dfrac{500}{400} = 1{,}25$", 0),
    ("Startwert $50$, jährlich $10\\,\\%$ weniger: $f(t) = 50 \\cdot 0{,}9^t$", 0),
    ("Bei $N(t) = 80 \\cdot 0{,}5^{t/3}$ ist die $3$ die **Halbwertszeit**", 0),
    ("$f(x) = \\left(\\dfrac{1}{3}\\right)^x$ fällt, bleibt aber immer **positiv**", 0),
])

d.bullets("Logarithmen und Wurzeln", [
    ("$\\log_2 64 = 6$, denn $2^6 = 64$", 0),
    ("$\\log_5 25 + \\log_5 5 = 2 + 1 = 3$", 0),
    ("$3^x = 243$ gibt $x = 5$", 0),
    ("$\\sqrt{72} = \\sqrt{36 \\cdot 2} = 6\\sqrt{2}$", 0),
])

d.bullets("Definitionsbereiche nicht vergessen", [
    ("$f(x) = \\log_3(x - 2)$ braucht $x - 2 > 0$, also $x > 2$", 0),
    ("$\\sqrt{x - 1} = 3$ quadrieren gibt $x = 10$ — Probe stimmt", 0),
    ("Bei jeder Wurzel und jedem Logarithmus **zuerst** den Bereich klären", 0),
    ("In der Arbeit gibt es dafür eigene Punkte", 0),
])

d.chapter(3, "Sinus und Verschiebungen", "Die letzten beiden Bausteine")

d.bullets("Periodisches", [
    ("$f(x) = \\sin(4x)$ hat die Periode $\\dfrac{2\\pi}{4} = \\dfrac{\\pi}{2}$", 0),
    ("$f(x) = 2\\sin x - 1$ schwingt um $-1$ mit Amplitude $2$", 0),
    ("Wertebereich also $-3 \\leq y \\leq 1$", 0),
    ("Punktsymmetrisch zum Ursprung sind $\\sin x$ und $x^3$", 0),
])

d.bullets("Punkte prüfen und Graphen zuordnen", [
    ("Liegt $(3 \\mid 8)$ auf $f(x) = 2^x$? $2^3 = 8$ — **ja**", 0),
    ("Punktprobe ist immer nur einsetzen und vergleichen", 0),
    ("Bei Verschiebungen: im Term $-2$ heißt nach **rechts**", 0),
    ("Diese Falle kostet in jeder Arbeit Punkte", 0),
])

d.two_cols("Wo die Punkte verloren gehen", [
    ("Beim Rechnen", 0),
    ("nur eine Lösung bei $x^2 = a$", 1),
    ("Vorfaktor in den Exponenten gezogen", 1),
    ("Verschiebungsrichtung vertauscht", 1),
], [
    ("Beim Aufschreiben", 0),
    ("Definitionsbereich fehlt", 1),
    ("Probe nicht gemacht", 1),
    ("kein Antwortsatz", 1),
])

d.bullets("Jetzt ihr", [
    ("**20 Aufgaben** im Mathe-Labor — Querschnitt durch alle Funktionsklassen", 0),
    ("Was hier hakt, ist der Lernplan für die Tage bis zur Arbeit", 0),
    ("Die Grundgraphen einmal freihand skizzieren — das prüft mehr als jede Rechnung", 0),
    ("**docalvers.de/mathetest11-ka2.html**", 0),
])

d.save()
