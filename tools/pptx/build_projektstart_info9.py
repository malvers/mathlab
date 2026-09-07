#!/usr/bin/env python3
"""Informatik 9 (Oberschule), Woche 25 / KW 8: Projektstart - Themenwahl und
Problemanalyse (LB 2, Ustd. 3/12)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("projektstart-anforderungen.pptx")

d.title("Informatik — Klasse 9", "Was soll das Ding können?",
        "Thema festlegen, Anforderungen aufschreiben, Werkzeug wählen")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Die Themenwahl", "Vier Richtungen stehen zur Wahl")

d.table_top("Woran ihr arbeiten könnt", [
    ["Richtung", "Beispiel", "Werkzeug"],
    ["Computerspiel", "Geschicklichkeit, Quiz, Jump and Run", "Scratch oder Snap!"],
    ["Simulation", "Verkehrsampel, Wetter, Ausbreitung", "Scratch, Tabellenkalkulation"],
    ["Robotik", "Linienfolger, Alarmanlage, Wetterstation", "micro:bit, MakeCode"],
    ["Grafik", "Animation, Muster, Bildbearbeitung", "Scratch, Grafikprogramm"],
], [180, 350, 286], [
    ("Wählt nach **Interesse**, nicht nach vermuteter Leichtigkeit", 0),
    ("Alle vier Richtungen können die volle Punktzahl bekommen", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Die Prüffragen vor der Entscheidung", [
    ("Können wir das in **zwölf Stunden** schaffen — inklusive Test und Doku?", 0),
    ("Haben wir die **Geräte** dafür, hier in der Schule?", 0),
    ("Können **alle** im Team etwas beitragen?", 0),
    ("Gibt es eine **kleinste Version**, die schon funktioniert?", 0),
    ("Und die wichtigste: **Trauen wir uns das zu, wenn die Hälfte schiefgeht?**", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Die Anforderungsliste", "Was das Produkt können muss")

d.table_top("So sieht eine Anforderungsliste aus", [
    ["Nr", "Anforderung", "Art"],
    ["1", "Das Spiel startet mit einem Klick auf die grüne Flagge", "Muss"],
    ["2", "Der Spieler steuert die Figur mit den Pfeiltasten", "Muss"],
    ["3", "Punkte werden gezählt und angezeigt", "Muss"],
    ["4", "Bei drei Treffern ist das Spiel vorbei", "Muss"],
    ["5", "Es gibt Hintergrundmusik", "Kann"],
    ["6", "Es gibt drei Schwierigkeitsstufen", "Kann"],
], [70, 550, 196], [
    ("**Muss** heißt: ohne das ist das Produkt nicht fertig. **Kann** heißt: wenn Zeit bleibt", 0),
    ("Jede Anforderung ist **überprüfbar** formuliert — man kann sie hinterher abhaken", 0),
], font_size=11, bold_cols=(0,),
   marks={(r, 2): TINT_GREEN for r in range(1, 5)} | {(5, 2): TINT_BLUE, (6, 2): TINT_BLUE})

d.bullets("Gut und schlecht formuliert", [
    ("Schlecht: „**Das Spiel soll Spaß machen**“ — das kann niemand prüfen", 0),
    ("Gut: „**Nach jedem Treffer erscheint eine Meldung**“ — das sieht man", 0),
    ("Schlecht: „**Es soll schön aussehen**“", 0),
    ("Gut: „**Der Hintergrund wechselt ab Stufe 2**“", 0),
    ("Faustregel: Wenn man **ja oder nein** antworten kann, ist es gut formuliert", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Die kleinste Version", "Erst laufen lassen, dann verschönern")

d.bullets("Warum man klein anfängt", [
    ("Eine **kleinste Version** enthält nur die Muss-Anforderungen — sonst nichts", 0),
    ("Sie läuft früh, und ab da könnt ihr **jede Woche etwas zeigen**", 0),
    ("Wer alles gleichzeitig baut, hat bis zuletzt **gar nichts** Lauffähiges", 0),
    ("Und wenn die Zeit knapp wird, habt ihr trotzdem ein **fertiges** Produkt", 0),
    ("Profis nennen das **MVP** — die kleinste brauchbare Fassung", 0),
])

d.merksatz("Eine gute Anforderung kann man abhaken. Wenn nicht ja oder nein "
           "darauf passt, ist sie keine Anforderung, sondern ein Wunsch.")

d.bullets("Fun Facts: Anforderungen", [
    ("Die meisten gescheiterten Softwareprojekte scheitern an **unklaren Anforderungen**", 0),
    ("Der Klassiker: „Das haben wir doch anders gemeint“ — **nach** der Fertigstellung", 0),
    ("Deshalb schreiben Profis Anforderungen auf und lassen sie **abzeichnen**", 0),
    ("**Scratch** wurde am MIT entwickelt und wird weltweit von Millionen benutzt", 0),
    ("Der **micro:bit** entstand 2016 für britische Schulen — eine Million Stück wurden verschenkt", 0),
])

d.bullets("Eure Aufgabe heute", [
    ("**Thema festlegen** und in einem Satz aufschreiben, was am Ende dasteht", 0),
    ("**Anforderungsliste** anlegen: mindestens vier Muss und zwei Kann", 0),
    ("Jede Anforderung so formulieren, dass man sie **abhaken** kann", 0),
    ("**Werkzeug wählen** und kurz begründen, warum es passt", 0),
    ("Beschreibt eure **kleinste Version** in drei Sätzen — die baut ihr zuerst", 0),
])

d.save()
