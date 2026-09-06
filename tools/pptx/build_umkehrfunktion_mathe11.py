#!/usr/bin/env python3
"""Umkehrfunktionen und Wurzeln - Mathe 11 (BGY), KW 1, LB 3."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck

d = MathDeck("mathe11-umkehrfunktion.pptx")

d.title("Mathematik · Berufliches Gymnasium 11 · KW 1",
        "Umkehrfunktionen",
        "Rückwärts rechnen, an der Winkelhalbierenden spiegeln — und die Wurzel neu verstehen")

d.bullets("Der Fahrplan dieser Woche", [
    ("Lernbereich 3 — Stunden **46 bis 50 von 75**", 0),
    ("Drei Blöcke: **was Umkehren heißt**, **die Wurzelfunktion**, "
     "**Potenzschreibweise und irrationale Zahlen**", 0),
    ("Grafisch ist alles eine **Spiegelung an $y = x$**", 0),
    ("Nächste Woche machen wir dasselbe mit der Exponentialfunktion", 0),
])

d.chapter(1, "Umkehren", "Aus dem Ergebnis wieder den Eingabewert machen")

d.bullets("Die Idee", [
    ("Die Umkehrfunktion **macht rückgängig**, was $f$ getan hat", 0),
    ("Deshalb gilt $f^{-1}(f(5)) = 5$ — man landet wieder am Anfang", 0),
    ("Liegt $(3 \\mid 8)$ auf dem Graphen von $f$, so liegt $(8 \\mid 3)$ auf dem von $f^{-1}$", 0),
    ("Definitions- und Wertebereich **tauschen** dabei die Rollen", 0),
])

d.bullets("Rechnerisch: nach x auflösen und tauschen", [
    ("$f(x) = 2x + 6$, also $y = 2x + 6$", 0),
    ("Nach $x$ auflösen: $x = \\dfrac{y - 6}{2}$", 0),
    ("Buchstaben tauschen: $f^{-1}(x) = \\dfrac{x - 6}{2}$", 0),
    ("Bei $f(x) = x^3$ ergibt sich $f^{-1}(x) = \\sqrt[3]{x}$", 0),
])

d.bullets("Grafisch: Spiegelung an der Winkelhalbierenden", [
    ("Der Graph von $f^{-1}$ entsteht durch Spiegelung an **$y = x$**", 0),
    ("Denn Spiegeln vertauscht genau die beiden Koordinaten", 0),
    ("$f(x) = x$ ist deshalb **ihre eigene** Umkehrfunktion", 0),
    ("Sie liegt auf der Spiegelachse und bleibt beim Spiegeln liegen", 0),
])

d.bullets("Wann Umkehren überhaupt geht", [
    ("Nur wenn jeder Wert **genau einmal** vorkommt — also bei strenger Monotonie", 0),
    ("$f(x) = x^2$ ist auf ganz $\\mathbb{R}$ **nicht** umkehrbar", 0),
    ("Denn $4$ käme von $2$ **und** von $-2$ — die Umkehrung wäre nicht eindeutig", 0),
    ("Mit $x \\geq 0$ eingeschränkt geht es: dann ist $f^{-1}(x) = \\sqrt{x}$", 0),
])

d.merksatz("Umkehrbar ist eine Funktion genau dann, wenn kein Wert zweimal vorkommt.")

d.chapter(2, "Die Wurzelfunktion", "Die Umkehrung der Normalparabel")

d.bullets("Definitionsbereich und Verlauf", [
    ("$f(x) = \\sqrt{x}$ ist nur für $x \\geq 0$ definiert", 0),
    ("Der Graph startet im Ursprung und steigt, wird dabei aber **immer flacher**", 0),
    ("Es ist der halbe Parabelast, an $y = x$ gespiegelt", 0),
    ("$\\sqrt{81} = 9$ — die Wurzel liefert **nur** den positiven Wert", 0),
])

d.bullets("Die Falle mit dem Quadrat unter der Wurzel", [
    ("$\\sqrt{x^2}$ ist **nicht** einfach $x$", 0),
    ("Für $x = -3$ wäre das $\\sqrt{9} = 3$, nicht $-3$", 0),
    ("Richtig ist $\\sqrt{x^2} = |x|$", 0),
    ("Deshalb hat $x^2 = 9$ zwei Lösungen, $\\sqrt{9}$ aber nur einen Wert", 0),
])

d.bullets("Mit Wurzeln rechnen", [
    ("$\\sqrt{x} = 7$: beide Seiten quadrieren, also $x = 49$", 0),
    ("$\\sqrt{50}$ teilweise ziehen: $\\sqrt{25 \\cdot 2} = 5\\sqrt{2}$", 0),
    ("Immer den größten Quadratfaktor suchen", 0),
    ("$\\sqrt{2}$ ist **irrational** — kein Bruch, unendliche nichtperiodische Dezimalzahl", 0),
])

d.chapter(3, "Potenzschreibweise", "Wurzeln sind Potenzen")

d.bullets("Der Übergang", [
    ("$\\sqrt{x} = x^{1/2}$", 0),
    ("$\\sqrt[3]{x^2} = x^{2/3}$ — Wurzelexponent nach unten, Potenz nach oben", 0),
    ("Allgemein $\\sqrt[n]{x^m} = x^{m/n}$", 0),
    ("Damit gelten für Wurzeln **dieselben Potenzgesetze** wie sonst", 0),
])

d.two_cols("Funktion und Umkehrfunktion", [
    ("$f(x) = x^2$ für $x \\geq 0$", 0),
    ("$D$: $x \\geq 0$", 1),
    ("$W$: $y \\geq 0$", 1),
    ("steigt immer steiler", 1),
], [
    ("$f^{-1}(x) = \\sqrt{x}$", 0),
    ("$D$: $x \\geq 0$", 1),
    ("$W$: $y \\geq 0$", 1),
    ("steigt immer flacher", 1),
])

d.bullets("Jetzt ihr", [
    ("**20 Aufgaben** im Mathe-Labor — Umkehren, Wurzeln, Potenzschreibweise", 0),
    ("Bei jeder Umkehrung prüfen: ist die Funktion überhaupt **streng monoton**?", 0),
    ("Nächste Woche: die Umkehrung der Exponentialfunktion heißt Logarithmus", 0),
    ("**docalvers.de/mathetest11-umkehrfunktion.html**", 0),
])

d.save()
