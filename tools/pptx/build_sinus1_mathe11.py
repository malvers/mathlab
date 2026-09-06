#!/usr/bin/env python3
"""Periodische Vorgaenge I: Sinusfunktion - Mathe 11 (BGY), KW 49, LB 3."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck

d = MathDeck("mathe11-sinus1.pptx")

d.title("Mathematik · Berufliches Gymnasium 11 · KW 49",
        "Die Sinusfunktion",
        "Vom Einheitskreis zur Welle — und warum die Analysis im Bogenmaß rechnet")

d.bullets("Der Fahrplan dieser Woche", [
    ("Lernbereich 3 — Stunden **31 bis 35 von 75**", 0),
    ("Drei Blöcke: **Einheitskreis**, **Bogenmaß**, **die Welle und ihre Eigenschaften**", 0),
    ("Neu ist der Funktionstyp: er **wiederholt sich**, statt zu wachsen oder zu fallen", 0),
    ("Am Ende **20 Aufgaben** — Werte, Nullstellen, Periode, Anwendungen", 0),
])

d.chapter(1, "Der Einheitskreis", "Sinus ist eine Höhe, keine Formel")

d.bullets("Wo der Sinus herkommt", [
    ("Der Einheitskreis hat den Radius **$1$** — daher der Name", 0),
    ("Ein Punkt wandert darauf, der Winkel wächst gleichmäßig", 0),
    ("$\\sin x$ ist die **Höhe** dieses Punktes über der waagerechten Achse", 0),
    ("$\\cos x$ ist sein **Abstand** nach rechts — beide gehören zusammen", 0),
])

d.bullets("Die Werte, die man auswendig kennt", [
    ("$\\sin 0 = 0$ — der Punkt startet auf der Achse", 0),
    ("$\\sin \\dfrac{\\pi}{2} = 1$ — er steht ganz oben", 0),
    ("$\\sin \\pi = 0$ — halbe Runde, wieder auf Höhe null", 0),
    ("$\\sin \\dfrac{3\\pi}{2} = -1$ — ganz unten", 0),
])

d.bullets("Was daraus sofort folgt", [
    ("Die Höhe liegt immer zwischen $-1$ und $1$", 0),
    ("Wertebereich also $-1 \\leq y \\leq 1$", 0),
    ("Deshalb hat $\\sin x = 2$ **keine** Lösung", 0),
    ("$\\sin x = 0{,}5$ dagegen hat im Bereich $0 \\leq x < 2\\pi$ **zwei** Lösungen", 0),
])

d.chapter(2, "Das Bogenmaß", "Winkel als Länge messen")

d.bullets("Warum nicht in Grad?", [
    ("Der volle Kreisbogen des Einheitskreises ist $2\\pi$ lang", 0),
    ("Im Bogenmaß **ist der Winkel diese Bogenlänge** — eine reine Zahl", 0),
    ("$360^\\circ$ entsprechen $2\\pi$, also $180^\\circ$ genau $\\pi$", 0),
    ("$90^\\circ$ sind $\\dfrac{\\pi}{2}$ und $\\dfrac{\\pi}{3}$ sind $60^\\circ$", 0),
])

d.bullets("Der eigentliche Grund", [
    ("Grad ist eine **willkürliche** Einteilung — warum ausgerechnet $360$?", 0),
    ("Im Bogenmaß werden die Formeln der Analysis einfach", 0),
    ("Für kleine $x$ gilt $\\sin x \\approx x$ — nur im Bogenmaß", 0),
    ("Deshalb rechnet **jedes** CAS in der Analysis im Bogenmaß", 0),
])

d.merksatz("Im Bogenmaß ist der Winkel keine Einheit, sondern eine Länge auf dem Einheitskreis.")

d.chapter(3, "Die Welle", "Was sich am Graphen ablesen lässt")

d.bullets("Nullstellen und Periode", [
    ("$\\sin x$ ist null bei $0$, $\\pi$, $2\\pi$ — also **bei jedem Vielfachen von $\\pi$**", 0),
    ("Nach $2\\pi$ wiederholt sich alles: das ist die **Periode**", 0),
    ("Deshalb gilt $\\sin(x + 2\\pi) = \\sin x$ für jedes $x$", 0),
    ("Zwischen $0$ und $\\dfrac{\\pi}{2}$ steigt die Kurve von $0$ auf $1$", 0),
])

d.bullets("Symmetrie", [
    ("$\\sin(-x) = -\\sin x$ — die Funktion ist **punktsymmetrisch** zum Ursprung", 0),
    ("Am Kreis sofort einsehbar: Winkel nach unten heißt Höhe nach unten", 0),
    ("Der Kosinus ist dagegen achsensymmetrisch", 0),
    ("Merkhilfe: Sinus ist ungerade, Kosinus gerade", 0),
])

d.two_cols("Wofür man Sinus braucht", [
    ("Passt", 0),
    ("Schwingungen und Töne", 1),
    ("Wechselspannung", 1),
    ("Tageslänge im Jahr", 1),
    ("Gezeiten", 1),
], [
    ("Passt nicht", 0),
    ("Zinsen (exponentiell)", 1),
    ("Bremsweg (quadratisch)", 1),
    ("Grundgebühr plus Verbrauch (linear)", 1),
    ("alles, was nicht wiederkehrt", 1),
])

d.bullets("Das Riesenrad", [
    ("Eine Gondel fährt gleichmäßig im Kreis", 0),
    ("Ihre **Höhe über dem Boden** verläuft sinusförmig", 0),
    ("Die Geschwindigkeit bleibt dabei konstant — die Höhe nicht", 0),
    ("Genau dieselbe Figur wie der Punkt auf dem Einheitskreis", 0),
])

d.bullets("Jetzt ihr", [
    ("**20 Aufgaben** im Mathe-Labor — Werte, Bogenmaß, Nullstellen, Periode", 0),
    ("Bei jedem Wert zuerst den **Punkt auf dem Kreis** vorstellen", 0),
    ("Nächste Woche kommen Amplitude, Periode und Verschiebung dazu", 0),
    ("**docalvers.de/mathetest11-sinus1.html**", 0),
])

d.save()
