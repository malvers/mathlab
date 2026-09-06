#!/usr/bin/env python3
"""Einfluss von Parametern - Mathe 11 (BGY), KW 8, LB 3."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck

d = MathDeck("mathe11-parameter.pptx")

d.title("Mathematik · Berufliches Gymnasium 11 · KW 8",
        "Strecken, Stauchen, Verschieben",
        "Vier Eingriffe, die bei jeder Funktion dasselbe bewirken")

d.bullets("Der Fahrplan dieser Woche", [
    ("Lernbereich 3 — Stunden **66 bis 70 von 75**", 0),
    ("Vier Formen: $f(x) + c$, $f(x + c)$, $c \\cdot f(x)$, $f(c \\cdot x)$", 0),
    ("Die Regeln gelten für **alle** Funktionsklassen gleich", 0),
    ("Dazu die **Auswertung der Klassenarbeit 2**", 0),
])

d.chapter(1, "Außen oder innen", "Die eine Unterscheidung, auf die es ankommt")

d.bullets("Außen wirkt senkrecht", [
    ("$f(x) + 3$ verschiebt den Graphen um $3$ **nach oben**", 0),
    ("$3 \\cdot f(x)$ **streckt** ihn in $y$-Richtung, macht ihn also höher", 0),
    ("$-f(x)$ spiegelt an der **$x$-Achse**", 0),
    ("Alles, was außen an $f$ steht, wirkt so, wie man es erwartet", 0),
])

d.bullets("Innen wirkt waagerecht — und umgekehrt", [
    ("$f(x + 3)$ verschiebt um $3$ nach **links**, nicht nach rechts", 0),
    ("$f(3x)$ **staucht** in $x$-Richtung: alles passiert dreimal so schnell", 0),
    ("$f(-x)$ spiegelt an der **$y$-Achse**", 0),
    ("Merksatz: **innen ist alles verkehrt herum**", 0),
])

d.bullets("Zwei Beispiele, die oft verwechselt werden", [
    ("$2 \\cdot f(x)$ verdoppelt jeden **Funktionswert** — der Graph wird höher", 0),
    ("$f(2x)$ lässt die Höhe gleich und **halbiert die Breite**", 0),
    ("Bei $f(x) = \\sin(5x)$ bleibt die Amplitude **$1$**", 0),
    ("Die $5$ betrifft nur die Periode, nie die Höhe", 0),
])

d.merksatz("Außen wie erwartet, innen verkehrt herum. Mehr muss man sich nicht merken.")

d.chapter(2, "Anwenden", "Term bauen und Term lesen")

d.bullets("Vom Text zum Term", [
    ("Normalparabel, $4$ nach rechts: $f(x) = (x - 4)^2$", 0),
    ("Sinuskurve mit doppelter Amplitude und halber Periode: $f(x) = 2\\sin(2x)$", 0),
    ("Erst an der $x$-Achse spiegeln, dann $2$ nach oben: $g(x) = -f(x) + 2$", 0),
    ("Reihenfolge beachten — spiegeln und dann heben ist nicht dasselbe wie umgekehrt", 0),
])

d.bullets("Vom Term zur Wirkung", [
    ("$y = (x - 2)^2 + 5$: der Scheitel wandert von $(0 \\mid 0)$ nach $(2 \\mid 5)$", 0),
    ("Bei $y = a(x - d)^2 + e$ mit Scheitel $(3 \\mid -4)$ ist $d = 3$ und $e = -4$", 0),
    ("$f(x) = 0{,}5\\,x^2$ ist **gestaucht**, also breiter als die Normalparabel", 0),
    ("$f(x) = 2^x + 3$ hebt die Kurve an — die Asymptote liegt dann bei $y = 3$", 0),
])

d.bullets("Was sich mitverändert und was nicht", [
    ("$g(x) = 5 \\cdot f(x)$ hat **dieselben** Nullstellen wie $f$", 0),
    ("Denn fünfmal null ist immer noch null", 0),
    ("Ein Faktor **außen** verändert die Nullstellen also nie", 0),
    ("Eine Verschiebung nach oben dagegen schon", 0),
])

d.bullets("Definitionsbereiche wandern mit", [
    ("$f(x) = \\sqrt{x}$ ist für $x \\geq 0$ definiert", 0),
    ("$g(x) = \\sqrt{x - 4}$ braucht $x - 4 \\geq 0$, also **$x \\geq 4$**", 0),
    ("Der Definitionsbereich ist um $4$ nach rechts gewandert — wie der Graph", 0),
    ("Bei Logarithmen genauso: $\\log(x - 2)$ verlangt $x > 2$", 0),
])

d.chapter(3, "Erkunden", "Warum GeoGebra hier mehr bringt als jede Tabelle")

d.two_cols("Die vier Eingriffe im Überblick", [
    ("Senkrecht (außen)", 0),
    ("$f(x) + c$ — hoch/runter", 1),
    ("$c \\cdot f(x)$ — höher/flacher", 1),
    ("$-f(x)$ — an $x$-Achse gespiegelt", 1),
], [
    ("Waagerecht (innen)", 0),
    ("$f(x + c)$ — links/rechts", 1),
    ("$f(c \\cdot x)$ — schmaler/breiter", 1),
    ("$f(-x)$ — an $y$-Achse gespiegelt", 1),
])

d.bullets("Mit dem Schieberegler arbeiten", [
    ("Einen Parameter **ziehen** und zusehen, wie sich der Graph bewegt", 0),
    ("Das prägt sich ein, weil man die Bewegung sieht statt sie zu lesen", 0),
    ("Immer nur **einen** Parameter auf einmal ändern", 0),
    ("Danach vorhersagen und erst dann ziehen — das ist der eigentliche Test", 0),
])

d.bullets("Der Wertebereich verrät den Faktor", [
    ("Bei $f(x) = c \\cdot \\sin x$ ist der Wertebereich $-|c| \\leq y \\leq |c|$", 0),
    ("Ein negatives $c$ spiegelt, ändert am Wertebereich aber nichts", 0),
    ("Deshalb ist die Amplitude immer der **Betrag** von $c$", 0),
    ("Bei $f(x) = -4\\sin x$ also $4$", 0),
])

d.bullets("Jetzt ihr", [
    ("**20 Aufgaben** im Mathe-Labor — alle vier Eingriffe, alle Funktionsklassen", 0),
    ("Bei jeder Aufgabe zuerst fragen: steht der Parameter **außen oder innen**?", 0),
    ("Zum Schluss in GeoGebra gegenprüfen, nicht vorher", 0),
    ("**docalvers.de/mathetest11-parameter.html**", 0),
])

d.save()
