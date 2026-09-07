#!/usr/bin/env python3
"""Informatik 12 (BGY), Woche 7 / KW 40: Prozessketten I - erweiterte
Ereignisprozesskette (eEPK) (LB 1, Ustd. 9-10/22)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from flow_diagrams import pap

d = Deck("prozessketten-eepk.pptx")
P = lambda n: os.path.join(IMG, n)

d.title("Informatik — Grundkurs 12", "Die Ereignisprozesskette",
        "eEPK: Ereignisse, Funktionen und die drei Konnektoren")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Die Bausteine", "Zwei Knotenarten im Wechsel")

d.table_top("Die Elemente der eEPK", [
    ["Element", "Form", "bedeutet", "Beispiel"],
    ["Ereignis", "Sechseck", "ein Zustand ist eingetreten", "Bestellung ist eingegangen"],
    ["Funktion", "abgerundetes Rechteck", "eine Tätigkeit wird ausgeführt", "Bestellung prüfen"],
    ["Konnektor", "Kreis mit Zeichen", "Verzweigung oder Zusammenführung", "XOR, UND, ODER"],
    ["Organisation", "Ellipse am Rand", "wer führt aus?", "Vertrieb"],
    ["Information", "Rechteck am Rand", "welche Daten fließen?", "Kundendatei"],
], [150, 200, 250, 216], [
    ("**Ereignis und Funktion wechseln sich immer ab** — nie zwei gleiche hintereinander", 0),
    ("Die letzten beiden Zeilen machen aus der EPK die **erweiterte** EPK", 0),
], font_size=10.5, bold_cols=(0,), marks={(4, 0): TINT_BLUE, (5, 0): TINT_BLUE})

dia = pap(P("pap-eepk-inf12.png"), 1560, 330, {
    "e1": dict(pos=(190, 130), w=330, h=110, kind="start", text="Bestellung ist eingegangen"),
    "f1": dict(pos=(600, 130), w=300, h=110, kind="proc", text="Bestellung prüfen"),
    "x": dict(pos=(880, 130), w=110, h=110, kind="con", text="XOR"),
    "e2": dict(pos=(1290, 60), w=380, h=95, kind="start", text="Bestellung ist gültig"),
    "e3": dict(pos=(1290, 210), w=380, h=95, kind="start", text="Bestellung ist ungültig"),
}, [
    ("e1", "f1", ""), ("f1", "x", ""), ("x", "e2", ""), ("x", "e3", ""),
], size=27)
d.picture("Eine kleine eEPK", dia, [
    ("Der **XOR-Konnektor** heißt: genau **einer** der beiden Wege wird genommen", 0),
    ("Nach einer Funktion darf verzweigt werden — **nach einem Ereignis nicht mit XOR**", 0),
    ("Die Skizze zeichnet vereinfacht: im Original ist das Ereignis ein **Sechseck**, "
     "die Funktion ein **abgerundetes Rechteck**", 0),
], width=760)

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Die Konnektoren", "XOR, UND, ODER — und ihre Regeln")

d.table_top("Was die drei Konnektoren bedeuten", [
    ["Konnektor", "beim Verzweigen", "beim Zusammenführen"],
    ["XOR", "genau ein Weg wird genommen", "genau ein Weg kommt an"],
    ["UND", "alle Wege werden genommen", "auf alle Wege wird gewartet"],
    ["ODER", "mindestens einer, auch mehrere", "auf die gestarteten wird gewartet"],
], [180, 320, 316], [
    ("Jede Verzweigung braucht eine passende **Zusammenführung** — mit demselben Konnektor", 0),
    ("Ein UND-Split mit XOR-Join ist ein **Modellierungsfehler**: der Prozess bleibt hängen", 0),
], font_size=11.5, bold_cols=(0,),
   marks={(1, 0): TINT_ORANGE, (2, 0): TINT_GREEN, (3, 0): TINT_BLUE})

d.bullets("Die Regeln, an denen die meisten scheitern", [
    ("Die eEPK beginnt und endet mit einem **Ereignis** — immer", 0),
    ("**Ereignis und Funktion wechseln** sich ab, ohne Ausnahme", 0),
    ("Ein **Ereignis trifft keine Entscheidung** — deshalb nach einem Ereignis kein XOR-Split", 0),
    ("Entscheidungen fallen in **Funktionen**: dort steht das XOR danach", 0),
    ("Jeder Weg, der aufgeht, muss auch wieder **zusammenkommen** oder ordentlich enden", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Lesen und prüfen", "Ein Modell mit Fehlern")

d.table_top("Fünf typische Fehler", [
    ["Fehler", "warum er einer ist"],
    ["Zwei Funktionen hintereinander", "das Ereignis dazwischen fehlt"],
    ["XOR direkt nach einem Ereignis", "ein Ereignis entscheidet nichts"],
    ["Split mit UND, Join mit XOR", "der Prozess wartet ewig oder verdoppelt sich"],
    ["Prozess endet mitten im Ablauf", "jedes Ende ist ein Ereignis"],
    ["Funktionen ohne Verantwortlichen", "in der eEPK gehört die Rolle daneben"],
], [300, 516], [
    ("Prüft ein fremdes Modell immer in dieser Reihenfolge: **Wechsel, Konnektoren, Anfang und Ende**", 0),
], font_size=11, bold_cols=(0,), marks={(r, 0): TINT_RED for r in range(1, 6)})

d.merksatz("Ereignis, Funktion, Ereignis — im Wechsel. Und was mit UND aufgeht, "
           "muss mit UND wieder zusammenkommen.")

d.bullets("Fun Facts: eEPK", [
    ("Die EPK entstand **1992** am Institut für Wirtschaftsinformatik in Saarbrücken bei **A.-W. Scheer**", 0),
    ("Sie wurde zusammen mit **SAP** entwickelt und prägte deren Referenzmodelle", 0),
    ("Deshalb ist sie im deutschsprachigen Raum bis heute stark verbreitet", 0),
    ("International hat sich dagegen **BPMN** durchgesetzt — nächste Woche", 0),
    ("Der **ODER-Konnektor** ist der unbeliebteste: seine Zusammenführung ist schwer eindeutig zu definieren", 0),
])

d.bullets("Eure Aufgabe: einen Alltagsprozess als eEPK", [
    ("Nehmt euren Prozess aus der letzten Stunde und modelliert ihn als **eEPK**", 0),
    ("Mindestens **eine Verzweigung** mit XOR und die passende Zusammenführung", 0),
    ("Mindestens **eine Funktion** mit Organisationseinheit und einem Informationsobjekt", 0),
    ("Prüft am Ende: Wechseln sich Ereignis und Funktion überall ab?", 0),
    ("Tauscht mit dem Nachbarpaar und sucht die **fünf typischen Fehler**", 0),
])

d.save()
