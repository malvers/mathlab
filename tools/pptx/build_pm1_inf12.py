#!/usr/bin/env python3
"""Informatik 12 (BGY), Woche 10 / KW 45: Projektmanagement I - Grundlagen
(LB 1, Ustd. 15-16/22)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from flow_diagrams import pap

d = Deck("projektmanagement-grundlagen.pptx")
P = lambda n: os.path.join(IMG, n)

d.title("Informatik — Grundkurs 12", "Projektmanagement",
        "Begriff, Phasen, Rollen — und warum Modelle dabei das Werkzeug sind")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Der Projektbegriff", "Vier Merkmale nach DIN 69901")

d.table_top("Was ein Projekt ausmacht", [
    ["Merkmal", "heißt", "Gegenbeispiel"],
    ["Zielvorgabe", "das Ergebnis ist beschrieben", "„irgendwas verbessern“"],
    ["zeitliche Begrenzung", "Anfang und Ende stehen fest", "Daueraufgabe"],
    ["Einmaligkeit", "so noch nicht durchgeführt", "Routineprozess"],
    ["eigene Organisation", "Team, Rollen, Ressourcen", "Nebenbeiarbeit"],
], [200, 300, 316], [
    ("Der **Prozess** wiederholt sich, das **Projekt** ist einmalig — beides braucht Modelle", 0),
    ("Das Ergebnis eines IT-Projekts ist oft genau das: ein **neuer oder geänderter Prozess**", 0),
], font_size=11.5, bold_cols=(0,))

d.bullets("Das magische Dreieck", [
    ("Jedes Projekt steht zwischen **Zeit**, **Kosten** und **Ergebnis** (Umfang und Qualität)", 0),
    ("Man kann höchstens **zwei** davon frei festlegen — das dritte ergibt sich", 0),
    ("Kürzere Zeit bei gleichem Umfang heißt: **mehr Kosten** oder weniger Qualität", 0),
    ("Wer alle drei festschreibt, verschiebt das Problem nur an das Ende des Projekts", 0),
    ("Deshalb ist die erste Frage im Projekt: **Welche Größe darf nachgeben?**", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Die Phasen", "Vom Auftrag bis zum Abschluss")

dia = pap(P("pap-projektphasen-inf12.png"), 1560, 370, {
    "a": dict(pos=(200, 130), w=330, h=120, text="Initiierung: Auftrag und Ziel"),
    "b": dict(pos=(590, 130), w=330, h=120, text="Planung: Struktur, Termine, Ressourcen"),
    "c": dict(pos=(980, 130), w=330, h=120, text="Durchführung und Steuerung"),
    "e": dict(pos=(1370, 130), w=330, h=120, text="Abschluss: Übergabe und Auswertung"),
}, [
    ("a", "b", ""), ("b", "c", ""), ("c", "e", ""),
    ("c", "b", "Abweichung: nachsteuern", [(980, 300), (590, 300)]),
], size=29)
d.picture("Die vier Phasen mit Rücksprung", dia, [
    ("**Steuern** heißt: Soll und Ist vergleichen und den Plan anpassen — nicht nur ausführen", 0),
    ("Ein Plan, der nie geändert wird, ist entweder trivial oder wird nicht benutzt", 0),
], width=816)

d.table_top("Was in jeder Phase entsteht", [
    ["Phase", "Ergebnis", "Werkzeug"],
    ["Initiierung", "Projektauftrag, Ziele, Umfang", "Steckbrief, Zieltabelle"],
    ["Planung", "Strukturplan, Termine, Ressourcen", "Netzplan, Gantt"],
    ["Durchführung", "das Produkt, Statusberichte", "Soll-Ist-Vergleich"],
    ["Abschluss", "Übergabe, Abnahme, Erfahrungsbericht", "Abschlussbericht"],
], [180, 350, 286], [
    ("Der **Projektstrukturplan** zerlegt das Projekt in Arbeitspakete — die Grundlage für alles Weitere", 0),
], font_size=11, bold_cols=(0,))

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Rollen", "Wer im Projekt was zu sagen hat")

d.table_top("Die klassischen Rollen", [
    ["Rolle", "Aufgabe", "entscheidet über"],
    ["Auftraggeber", "will das Ergebnis, stellt Mittel bereit", "Ziele und Budget"],
    ["Projektleitung", "plant, steuert, berichtet", "das Vorgehen"],
    ["Projektteam", "arbeitet die Pakete ab", "die Umsetzung im Detail"],
    ["Lenkungsausschuss", "entscheidet bei Abweichungen", "Änderungen am Auftrag"],
    ["Fachbereich", "liefert Anforderungen, prüft ab", "die fachliche Abnahme"],
], [200, 350, 266], [
    ("Konflikte entstehen fast immer dort, wo **Verantwortung und Entscheidungsbefugnis** auseinanderfallen", 0),
    ("Deshalb gehört zu jeder Rolle: **worüber darf sie entscheiden?**", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Modellieren gehört zum Projektmanagement", [
    ("Der **Ist-Prozess** ist die Grundlage der Anforderungen", 0),
    ("Der **Soll-Prozess** beschreibt, was das Projekt liefern soll", 0),
    ("Die **Differenz** zwischen beiden ist der Projektumfang", 0),
    ("Ohne diese beiden Modelle streitet man am Ende darüber, was vereinbart war", 0),
    ("Deshalb steht die Modellierung **vor** dem Terminplan, nicht danach", 0),
])

d.merksatz("Zeit, Kosten und Ergebnis: zwei davon dürft ihr festlegen, "
           "das dritte ergibt sich. Wer alle drei festschreibt, plant nicht, sondern hofft.")

d.bullets("Fun Facts: Projektmanagement", [
    ("Die **DIN 69901** definiert Projekt und Projektmanagement seit 1980, überarbeitet 2009", 0),
    ("Das **Manhattan-Projekt** und die **Polaris**-Rakete gelten als Geburtshelfer moderner Methoden", 0),
    ("Für Polaris wurde 1958 die **Netzplantechnik PERT** entwickelt — nächste Woche", 0),
    ("Die **Standish-Group** untersucht seit 1994 gescheiterte IT-Projekte — die Quoten sind ernüchternd", 0),
    ("Häufigste genannte Ursache: **unklare Anforderungen**, nicht fehlendes Können", 0),
])

d.bullets("Eure Aufgabe", [
    ("Formuliert zu eurem Prozess ein **Projekt**, das ihn verbessern würde", 0),
    ("Schreibt einen **Projektsteckbrief**: Ziel, Umfang, Nicht-Umfang, Auftraggeber", 0),
    ("Ordnet die **Rollen** zu — wer entscheidet worüber?", 0),
    ("Benennt im **magischen Dreieck**, welche Größe bei euch nachgeben darf", 0),
    ("Zerlegt das Projekt in **fünf bis acht Arbeitspakete** — die brauchen wir nächste Woche", 0),
])

d.save()
