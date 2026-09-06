#!/usr/bin/env python3
"""Jahresrueckblick und Ausblick Jgst. 12 - Mathe 11 (BGY), KW 25."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck

d = MathDeck("mathe11-jahresrueckblick.pptx")

d.title("Mathematik · Berufliches Gymnasium 11 · KW 25",
        "Jahresrückblick",
        "Was war, was bleibt — und was in Jahrgang 12 auf euch wartet")

d.bullets("Der Fahrplan dieser Woche", [
    ("**Rückblick** über das ganze Jahr, in Aufgaben statt in Worten", 0),
    ("Vier Lernbereiche: **Gleichungen**, **Funktionen**, **Systeme**, **Stochastik**", 0),
    ("Danach der **Ausblick** auf Klasse 12", 0),
    ("Und die Frage, was davon am weitesten trägt", 0),
])

d.chapter(1, "Vier Lernbereiche in Aufgaben", "Einmal quer durchs Jahr")

d.bullets("Gleichungen und Terme (LB 2)", [
    ("$3(x - 4) = 2x + 1$ gibt $x = 13$", 0),
    ("$E = \\dfrac{1}{2}mv^2$ nach $v$: $v = \\sqrt{\\dfrac{2E}{m}}$", 0),
    ("$x^2 - 7x + 12 = 0$ über Vieta: $x = 3$ und $x = 4$", 0),
    ("$(3x^2)^3 = 27x^6$ — auch die Zahl wird potenziert", 0),
])

d.bullets("Funktionen (LB 3)", [
    ("Alle $8$ Stunden verdoppelt: **exponentiell**", 0),
    ("$\\log_2 128 = 7$", 0),
    ("$f(x) = 3\\sin(2x) + 1$: Periode $\\pi$, Wertebereich $-2 \\leq y \\leq 4$", 0),
    ("$g(x) = f(x - 3) + 2$: drei nach rechts, zwei nach oben", 0),
])

d.bullets("Systeme und Stochastik (LB 4 und LB 1)", [
    ("$2x - y = 5$ und $x + y = 4$: addieren gibt $3x = 9$, also $x = 3$, $y = 1$", 0),
    ("Bleibt beim Eliminieren $0 = 0$, gibt es **unendlich viele** Lösungen", 0),
    ("Mindestens eine Sechs bei zwei Würfen: "
     "$1 - \\left(\\dfrac{5}{6}\\right)^2 = \\dfrac{11}{36}$", 0),
    ("Erwartungswert beim fairen Würfel: $3{,}5$", 0),
])

d.bullets("Und die Körper (LB 2)", [
    ("Kugel mit $r = 6$ cm: $V = \\dfrac{4}{3}\\pi \\cdot 216 = 288\\pi$ cm³", 0),
    ("Umkehrfunktion von $f(x) = 10^x$ ist $f^{-1}(x) = \\log_{10} x$", 0),
    ("$x^2 + 4 = 0$ hat in den reellen Zahlen **keine** Lösung", 0),
    ("$R^2 = 0{,}97$ heißt gute Anpassung — **nicht** bewiesene Ursache", 0),
])

d.merksatz("Ein Jahr Mathematik in einem Satz: benennen, was gesucht ist, das Werkzeug wählen, das Ergebnis prüfen.")

d.chapter(2, "Ausblick auf Klasse 12", "Zwei große neue Themen")

d.bullets("Die Differenzialrechnung", [
    ("Die neue Frage: **wie schnell** ändert sich etwas in **einem** Punkt?", 0),
    ("Aus dem Anstieg einer Geraden wird der Anstieg einer **Kurve**", 0),
    ("Werkzeug ist der **Grenzwert** — der Begriff aus dem Unendlich-Exkurs", 0),
    ("Damit lassen sich Extremwerte berechnen statt nur am Scheitel ablesen", 0),
])

d.bullets("Diskrete Zufallsgrößen", [
    ("Aus einzelnen Wahrscheinlichkeiten werden **Verteilungen**", 0),
    ("Der Erwartungswert bekommt Gesellschaft: Varianz und Standardabweichung", 0),
    ("Die Binomialverteilung beschreibt wiederholte gleiche Versuche", 0),
    ("Alles baut direkt auf Baumdiagrammen und Pfadregeln auf", 0),
])

d.two_cols("Was ihr schon habt", [
    ("Aus Klasse 11", 0),
    ("Funktionstypen sicher erkennen", 1),
    ("Gleichungen ohne Hilfsmittel", 1),
    ("Pfadregeln und Gegenereignis", 1),
    ("Modelle aufstellen und prüfen", 1),
], [
    ("Was daraus wird", 0),
    ("Ableitung und Kurvendiskussion", 1),
    ("Extremwertaufgaben", 1),
    ("Binomialverteilung", 1),
    ("Modellieren auf höherem Niveau", 1),
])

d.chapter(3, "Was am weitesten trägt", "Nicht die Formeln")

d.bullets("Die Fähigkeit, die bleibt", [
    ("Formeln stehen in der Formelsammlung — sie muss man nicht auswendig können", 0),
    ("Was zählt, ist die **Auswahl** des passenden Werkzeugs", 0),
    ("Und die Gewohnheit, jedes Ergebnis auf **Plausibilität** zu prüfen", 0),
    ("Beides ist Übungssache, kein Talent", 0),
])

d.bullets("Die beste Vorbereitung auf Klasse 12", [
    ("Die **Grundlagen** aus Klasse 11 sicher halten, nicht vorarbeiten", 0),
    ("Termumformungen und Gleichungen müssen ohne Nachdenken laufen", 0),
    ("Wer dort stockt, verliert in Klasse 12 die Zeit fürs Neue", 0),
    ("In den Ferien reichen dafür ein paar Aufgaben pro Woche", 0),
])

d.bullets("Jetzt ihr", [
    ("**20 Aufgaben** im Mathe-Labor — der Jahresrückblick in Aufgabenform", 0),
    ("Was hier sitzt, trägt durch Klasse 12", 0),
    ("Was hakt, ist die Liste für die Ferien", 0),
    ("**docalvers.de/mathetest11-jahresrueckblick.html**", 0),
])

d.save()
