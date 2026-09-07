#!/usr/bin/env python3
"""Informatik 13 (BGY), Woche 9 / KW 44: Komponenten der objektorientierten
Programmierung - Formulare (LB 3, Ustd. 19-20/24)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, py_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from flow_diagrams import pap

d = Deck("gui-formulare.pptx")
P = lambda n: os.path.join(IMG, n)
code = lambda t, ls, **kw: d.code(t, [py_parts(l) for l in ls], **kw)

d.title("Informatik — Grundkurs 13", "Programme mit Oberfläche",
        "Formular-Komponenten und Ereignisbehandlung — der Wechsel im Denken")

d.chapter(1, "Der Unterschied", "Vom Ablauf zum Ereignis")

d.table_top("Zwei Arten, ein Programm zu bauen", [
    ["", "Konsolenprogramm", "Programm mit Oberfläche"],
    ["Ablauf", "von oben nach unten", "wartet auf Ereignisse"],
    ["Eingabe", "input() hält an", "der Nutzer tippt, wann er will"],
    ["Steuerung", "das Programm bestimmt", "der Nutzer bestimmt"],
    ["Struktur", "eine Folge", "viele kleine Reaktionen"],
], [140, 320, 356], [
    ("Der Kern des Umdenkens: **das Programm wartet**, statt zu fragen", 0),
    ("Diese Bauweise heißt **ereignisgesteuert** — event driven", 0),
], font_size=11, bold_cols=(0,), marks={(1, 2): TINT_ORANGE})

dia = pap(P("pap-events-inf13.png"), 1560, 340, {
    "w": dict(pos=(230, 130), w=330, h=120, text="Fenster wartet"),
    "e": dict(pos=(650, 130), w=300, h=120, kind="io", text="Ereignis: Klick"),
    "h": dict(pos=(1040, 130), w=330, h=120, text="Ereignisbehandlung"),
    "a": dict(pos=(1420, 130), w=250, h=120, kind="io", text="Anzeige ändern"),
}, [
    ("w", "e", ""), ("e", "h", ""), ("h", "a", ""),
    ("a", "w", "zurück zum Warten", [(1420, 290), (230, 290)]),
], size=27)
d.picture("Die Ereignisschleife", dia, [
    ("Zwischen den Ereignissen tut das Programm **nichts** — es wartet", 0),
    ("Eine lange Rechnung in der Behandlung **friert die Oberfläche ein**", 0),
], width=816)

d.chapter(2, "Die Bausteine", "Widgets und ihre Aufgaben")

d.table_top("Die Komponenten, die ihr braucht", [
    ["Komponente", "Aufgabe", "in tkinter"],
    ["Fenster", "trägt alles", "Tk()"],
    ["Beschriftung", "Text anzeigen", "Label"],
    ["Eingabefeld", "Text entgegennehmen", "Entry"],
    ["Schaltfläche", "Aktion auslösen", "Button"],
    ["Auswahl", "eine Option aus mehreren", "Radiobutton, Combobox"],
    ["Ausgabe", "Ergebnis zeigen", "Label oder Text"],
], [180, 350, 286], [
    ("Jede Komponente ist ein **Objekt** — mit Attributen und Methoden, wie in Jgst. 12 modelliert", 0),
    ("Das **Layout** legt fest, wo sie liegen: pack, grid oder place", 0),
], font_size=11, bold_cols=(0,))

code("Ein vollständiges kleines Formular", [
    "import tkinter as tk",
    "",
    "def berechnen():                      # Ereignisbehandlung",
    "    try:",
    "        n = int(feld.get())",
    "        ausgabe.config(text=f'Quadrat: {n * n}')",
    "    except ValueError:",
    "        ausgabe.config(text='Bitte eine ganze Zahl eingeben')",
    "",
    "fenster = tk.Tk()",
    "tk.Label(fenster, text='Zahl:').grid(row=0, column=0)",
    "feld = tk.Entry(fenster);  feld.grid(row=0, column=1)",
    "tk.Button(fenster, text='Rechne', command=berechnen).grid(row=1, column=0)",
    "ausgabe = tk.Label(fenster, text='');  ausgabe.grid(row=2, column=0, columnspan=2)",
    "fenster.mainloop()                    # Ereignisschleife starten",
], size=10.5)

d.chapter(3, "Sauber bauen", "Drei Regeln, die Ärger ersparen")

d.bullets("Was in der Praxis zählt", [
    ("**Rechnen und Anzeigen trennen**: die Berechnung in eine eigene Funktion", 0),
    ("So lässt sie sich **testen**, ohne das Fenster zu öffnen", 0),
    ("**Eingaben prüfen**: alles aus einem Entry ist **Text**, auch „12“", 0),
    ("Ein fehlgeschlagenes **int()** darf das Programm nicht abstürzen lassen", 0),
    ("**mainloop() steht zuletzt** — danach läuft nur noch die Ereignisschleife", 0),
])

d.table_top("Typische Fehler beim Einstieg", [
    ["Symptom", "Ursache"],
    ["Fenster erscheint nicht", "mainloop() fehlt"],
    ["Button reagiert sofort beim Start", "command=berechnen() statt command=berechnen"],
    ["Ergebnis ist Text statt Zahl", "Entry liefert immer Text"],
    ["Oberfläche friert ein", "lange Rechnung in der Ereignisbehandlung"],
    ["Widget unsichtbar", "pack oder grid vergessen"],
], [330, 486], [
    ("Der zweite Fehler ist der häufigste: die **Klammern** rufen die Funktion sofort auf", 0),
], font_size=11, bold_cols=(0,), marks={(2, 0): TINT_RED})

d.merksatz("Ein Programm mit Oberfläche wartet auf Ereignisse. Und alles, was "
           "aus einem Eingabefeld kommt, ist zuerst einmal Text.")

d.bullets("Fun Facts: Oberflächen", [
    ("Die erste **grafische Oberfläche** entstand ab 1973 am Xerox PARC — mit Fenstern und Maus", 0),
    ("**tkinter** gehört seit den 1990er Jahren zur Python-Standardbibliothek", 0),
    ("Die Ereignisschleife heißt in fast jedem System gleich: **event loop**", 0),
    ("Auch der Browser arbeitet so — JavaScript ist ereignisgesteuert", 0),
    ("Faustregel aus der Praxis: **die Oberfläche darf nie rechnen**", 0),
])

d.bullets("Eure Aufgabe am Rechner", [
    ("Baut ein Formular: **Eingabefeld, Button, Ausgabe** — Quadratzahl berechnen", 0),
    ("Trennt **Berechnung** und **Anzeige** in zwei Funktionen", 0),
    ("Fangt eine **fehlerhafte Eingabe** ab und gebt eine verständliche Meldung", 0),
    ("Erweitert um eine **Auswahl**: Quadrat, Wurzel oder Kehrwert", 0),
    ("Provoziert drei der fünf **typischen Fehler** und lest die Meldungen", 0),
])

d.save()
