#!/usr/bin/env python3
"""Baumdiagramme und Pfadregeln - Mathe 11 (BGY), KW 15, LB 1."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck

d = MathDeck("mathe11-baumdiagramme.pptx")

d.title("Mathematik · Berufliches Gymnasium 11 · KW 15",
        "Baumdiagramme",
        "Mehrstufige Zufallsversuche — entlang der Pfade multiplizieren, über die Pfade addieren")

d.bullets("Der Fahrplan dieser Woche", [
    ("**Neuer Lernbereich 1** — Stunden **1 bis 5 von 15**, Stochastik", 0),
    ("Drei Blöcke: **die zwei Pfadregeln**, **mit und ohne Zurücklegen**, "
     "**das Gegenereignis**", 0),
    ("Anwendungen: Urnen, Glücksspiele, Qualitätskontrolle", 0),
    ("Zwei Regeln tragen die ganze Woche", 0),
])

d.chapter(1, "Die zwei Pfadregeln", "Multiplizieren und addieren")

d.bullets("Was ein Pfad ist", [
    ("Ein Pfad ist **ein möglicher Ausgang** des ganzen Versuchs", 0),
    ("Von der Wurzel bis zum Ende, Stufe für Stufe", 0),
    ("**Pfadmultiplikation**: entlang eines Pfades werden die Wahrscheinlichkeiten "
     "**multipliziert**", 0),
    ("**Pfadaddition**: gehören mehrere Pfade zum Ereignis, werden sie **addiert**", 0),
])

d.bullets("Die Probe, die immer geht", [
    ("Die Summe **aller** Pfadwahrscheinlichkeiten ist immer **$1$**", 0),
    ("Ebenso die Summe der Äste an jeder einzelnen Verzweigung", 0),
    ("Stimmt das nicht, ist irgendwo ein Ast falsch beschriftet", 0),
    ("Ein Glücksrad mit $8$ Feldern, zweimal gedreht, hat $8 \\cdot 8 = 64$ Pfade", 0),
])

d.bullets("Erste Beispiele", [
    ("Zweimal Kopf mit fairer Münze: $\\dfrac{1}{2} \\cdot \\dfrac{1}{2} = \\dfrac{1}{4}$", 0),
    ("Zwei Sechsen mit zwei Würfeln: $\\dfrac{1}{6} \\cdot \\dfrac{1}{6} = \\dfrac{1}{36}$", 0),
    ("**Genau eine** Sechs: zwei Pfade, also "
     "$2 \\cdot \\dfrac{1}{6} \\cdot \\dfrac{5}{6} = \\dfrac{10}{36}$", 0),
    ("Der Faktor $2$ ist der häufigste Vergessene", 0),
])

d.merksatz("Entlang eines Pfades wird multipliziert, über mehrere Pfade wird addiert.")

d.chapter(2, "Mit oder ohne Zurücklegen", "Der Unterschied steckt in der zweiten Stufe")

d.bullets("Mit Zurücklegen", [
    ("Urne mit $3$ roten und $2$ blauen Kugeln: $P(\\text{rot}) = \\dfrac{3}{5}$", 0),
    ("Nach dem Zurücklegen ist die Urne **wieder wie vorher**", 0),
    ("Zweimal rot also $\\dfrac{3}{5} \\cdot \\dfrac{3}{5} = \\dfrac{9}{25}$", 0),
    ("Die Äste der zweiten Stufe tragen **dieselben** Zahlen wie die der ersten", 0),
])

d.bullets("Ohne Zurücklegen", [
    ("Nach dem ersten Zug ist eine Kugel weg — es sind nur noch $4$ da", 0),
    ("Zweimal rot: $\\dfrac{3}{5} \\cdot \\dfrac{2}{4} = \\dfrac{3}{10}$", 0),
    ("Die zweite Stufe hat also **andere** Wahrscheinlichkeiten je nach erstem Zug", 0),
    ("Genau das ist der einzige Unterschied im Baumdiagramm", 0),
])

d.bullets("Ein zweites Beispiel", [
    ("$4$ weiße und $6$ schwarze Kugeln, ohne Zurücklegen", 0),
    ("Erste weiß, zweite schwarz: $\\dfrac{4}{10} \\cdot \\dfrac{6}{9}$", 0),
    ("Das ergibt $\\dfrac{24}{90} = \\dfrac{4}{15}$", 0),
    ("Der Nenner der zweiten Stufe ist **immer** um eins kleiner", 0),
])

d.bullets("Unabhängig oder nicht", [
    ("Zwei Ereignisse sind **stochastisch unabhängig**, wenn das eine die "
     "Wahrscheinlichkeit des anderen nicht ändert", 0),
    ("Ziehen **mit** Zurücklegen ist unabhängig", 0),
    ("Ziehen **ohne** Zurücklegen ist es nicht", 0),
    ("Addieren darf man nur bei Ereignissen, die sich **gegenseitig ausschließen**", 0),
])

d.chapter(3, "Das Gegenereignis", "Der Trick bei „mindestens“")

d.bullets("Warum der Umweg schneller ist", [
    ("Mindestens einmal Kopf bei drei Würfen — das sind **sieben** Pfade", 0),
    ("Das Gegenteil ist **ein** Pfad: dreimal Zahl, also $\\dfrac{1}{8}$", 0),
    ("Also $P = 1 - \\dfrac{1}{8} = \\dfrac{7}{8}$", 0),
    ("Bei **mindestens** lohnt fast immer das Gegenereignis", 0),
])

d.bullets("Noch ein Beispiel", [
    ("Dreimal würfeln, **nie** eine Sechs", 0),
    ("$\\left(\\dfrac{5}{6}\\right)^3 = \\dfrac{125}{216}$", 0),
    ("Mindestens eine Sechs wäre dann $1 - \\dfrac{125}{216}$", 0),
    ("Also rund $42\\,\\%$ — deutlich mehr, als die meisten schätzen", 0),
])

d.two_cols("Zwei Anwendungen", [
    ("Qualitätskontrolle", 0),
    ("Maschine A: $60\\,\\%$, $2\\,\\%$ Ausschuss", 1),
    ("Maschine B: $40\\,\\%$, $5\\,\\%$ Ausschuss", 1),
    ("gesamt $0{,}6 \\cdot 0{,}02 + 0{,}4 \\cdot 0{,}05$", 1),
    ("also $3{,}2\\,\\%$", 1),
], [
    ("Medizinischer Test", 0),
    ("erkennt Kranke zu $99\\,\\%$", 1),
    ("das ist ein **Ast**, keine Aussage", 1),
    ("nämlich nur der Zweig „krank“", 1),
    ("die Umkehrung folgt nächste Woche", 1),
])

d.bullets("Jetzt ihr", [
    ("**20 Aufgaben** im Mathe-Labor — Pfadregeln, Urnen, Gegenereignis", 0),
    ("Bei jeder Aufgabe zuerst den **Baum skizzieren**, dann rechnen", 0),
    ("Und immer prüfen: **mit oder ohne Zurücklegen?**", 0),
    ("**docalvers.de/mathetest11-baumdiagramme.html**", 0),
])

d.save()
