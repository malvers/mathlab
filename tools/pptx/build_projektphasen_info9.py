#!/usr/bin/env python3
"""Informatik 9 (Oberschule), Woche 22 / KW 4: Projektphasen - was ist ein Projekt?
(LB 2, Ustd. 1/12)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from flow_diagrams import pap

d = Deck("projektphasen.pptx")
P = lambda n: os.path.join(IMG, n)

d.title("Informatik — Klasse 9", "Was ist eigentlich ein Projekt?",
        "Vier Merkmale, vier Phasen — und warum das Reihenfolge hat")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Vier Merkmale", "Nicht jede Arbeit ist ein Projekt")

d.table_top("Woran man ein Projekt erkennt", [
    ["Merkmal", "heißt", "kein Projekt wäre"],
    ["Ziel", "es gibt ein klares Ergebnis", "„irgendwas mit Computern“"],
    ["Zeitrahmen", "Anfang und Ende stehen fest", "eine Daueraufgabe"],
    ["Team", "mehrere arbeiten zusammen", "eine Einzelaufgabe"],
    ["einmalig", "so wurde es noch nicht gemacht", "die tägliche Routine"],
], [170, 300, 346], [
    ("Fehlt eines der vier, wird es meistens **kein** Projekt — sondern Arbeit ohne Ende", 0),
    ("Unser Projekt hat alle vier: ein Produkt, zwölf Stunden, ein Team, etwas Neues", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Beispiele aus eurem Leben", [
    ("**Schulfest organisieren**: Ziel, Termin, Team, jedes Jahr ein bisschen anders", 0),
    ("**Spieleabend planen**: klein, aber alle vier Merkmale sind da", 0),
    ("**Zimmer aufräumen**: kein Team, kein Ergebnis, das bleibt — kein Projekt", 0),
    ("**Ein Haus bauen**: das klassische Projekt, mit Plan, Fristen und Gewerken", 0),
    ("**Hausaufgaben machen**: Routine, kein Projekt — auch wenn es sich so anfühlt", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Die vier Phasen", "In dieser Reihenfolge, mit Rücksprung")

dia = pap(P("pap-projektphasen-info9.png"), 1560, 370, {
    "a": dict(pos=(200, 130), w=330, h=120, text="1. Initiierung: Was wollen wir?"),
    "b": dict(pos=(590, 130), w=330, h=120, text="2. Planung: Wer macht was bis wann?"),
    "c": dict(pos=(980, 130), w=330, h=120, text="3. Durchführung: bauen und testen"),
    "d": dict(pos=(1370, 130), w=330, h=120, text="4. Abschluss: zeigen und auswerten"),
}, [
    ("a", "b", ""), ("b", "c", ""), ("c", "d", ""),
    ("c", "b", "Plan anpassen", [(980, 300), (590, 300)]),
], size=30)
d.picture("Von der Idee bis zur Auswertung", dia, [
    ("Der Rücksprung von 3 nach 2 ist **normal**: Pläne ändern sich, wenn man anfängt", 0),
    ("Wer die Planung überspringt, merkt in Phase 3, dass niemand weiß, was zu tun ist", 0),
], width=816)

d.table_top("Was in jeder Phase entsteht", [
    ["Phase", "Ergebnis am Ende"],
    ["Initiierung", "Thema und Ziel in einem Satz"],
    ["Planung", "Aufgabenliste mit Namen und Terminen"],
    ["Durchführung", "das Produkt und die Zwischenstände"],
    ["Abschluss", "Präsentation, Dokumentation, Auswertung"],
], [230, 586], [
    ("Jede Phase hat ein **greifbares** Ergebnis — sonst weiß niemand, ob sie fertig ist", 0),
], font_size=12, bold_cols=(0,))

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Unser Projekt", "Zwölf Stunden, ein Produkt")

d.bullets("Der Fahrplan bis Mai", [
    ("**Jetzt**: Phasen verstehen, Teams bilden, Themen sammeln", 0),
    ("**Februar**: Thema festlegen, Anforderungen aufschreiben, Lösung entwerfen", 0),
    ("**März und April**: bauen, testen, Fehler suchen, dokumentieren", 0),
    ("**Mai**: präsentieren und auswerten", 0),
    ("Bewertet werden am Ende **Produkt, Dokumentation und Vortrag**", 0),
])

d.merksatz("Ein Projekt hat ein Ziel, ein Ende, ein Team und etwas Neues. "
           "Und es beginnt nicht mit dem Bauen, sondern mit dem Ziel.")

d.bullets("Fun Facts: Projekte", [
    ("Das Wort **Projekt** kommt vom lateinischen „proiectum“ — das Vorausgeworfene", 0),
    ("Große IT-Projekte scheitern erstaunlich oft — meist nicht an der Technik, sondern an der **Absprache**", 0),
    ("Der **Flughafen BER** war neun Jahre später fertig als geplant", 0),
    ("Die Faustregel vieler Profis: **die letzten 10 % kosten die Hälfte der Zeit**", 0),
    ("Deshalb planen Profis Puffer ein — wir auch: zwei Stunden im Mai", 0),
])

d.bullets("Eure Aufgabe", [
    ("Findet zu dritt **drei** Beispiele für Projekte aus eurem Alltag", 0),
    ("Prüft bei jedem die **vier Merkmale** — passt wirklich alles?", 0),
    ("Sammelt **fünf Ideen**, was euer Informatikprojekt werden könnte", 0),
    ("Zu jeder Idee ein Satz: **Was soll am Ende dastehen?**", 0),
    ("Nächste Woche bilden wir die Teams — überlegt euch, mit wem", 0),
])

d.save()
