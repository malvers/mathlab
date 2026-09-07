#!/usr/bin/env python3
"""Informatik 12 (BGY), Woche 8 / KW 41: Prozessketten II - BPMN
(LB 1, Ustd. 11-12/22)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from flow_diagrams import pap

d = Deck("prozessketten-bpmn.pptx")
P = lambda n: os.path.join(IMG, n)

d.title("Informatik — Grundkurs 12", "BPMN",
        "Business Process Model and Notation — der internationale Standard")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Die Grundelemente", "Vier Formen genügen für den Anfang")

d.table_top("Was BPMN zeichnet", [
    ["Element", "Form", "bedeutet"],
    ["Ereignis", "Kreis", "Start, Zwischenereignis oder Ende"],
    ["Aktivität", "abgerundetes Rechteck", "eine Aufgabe (Task)"],
    ["Gateway", "Raute", "Verzweigung oder Zusammenführung"],
    ["Sequenzfluss", "durchgezogener Pfeil", "die Reihenfolge"],
    ["Pool und Lane", "Rahmen und Bahnen", "wer ist beteiligt, wer macht was"],
], [180, 280, 356], [
    ("Der **Startkreis** hat einen dünnen Rand, der **Endkreis** einen dicken — daran erkennt man sie", 0),
    ("**Pools** trennen Beteiligte, die nur Nachrichten austauschen. **Lanes** trennen Rollen innerhalb eines Pools", 0),
], font_size=11, bold_cols=(0,))

dia = pap(P("pap-bpmn-inf12.png"), 1560, 340, {
    "s": dict(pos=(140, 130), w=110, h=110, kind="con", text="Start"),
    "t1": dict(pos=(450, 130), w=300, h=110, kind="proc", text="Bestellung prüfen"),
    "g": dict(pos=(760, 130), w=150, h=150, kind="dec", text="gültig?"),
    "t2": dict(pos=(1120, 55), w=300, h=95, kind="proc", text="Ware versenden"),
    "t3": dict(pos=(1120, 215), w=300, h=95, kind="proc", text="Kunden informieren"),
    "e": dict(pos=(1450, 130), w=110, h=110, kind="end", text="Ende"),
}, [
    ("s", "t1", ""), ("t1", "g", ""),
    ("g", "t2", "ja"), ("g", "t3", "nein"),
    ("t2", "e", ""), ("t3", "e", ""),
], size=26)
d.picture("Derselbe Prozess in BPMN", dia, [
    ("Das **exklusive Gateway** (Raute mit X) entspricht dem XOR der eEPK", 0),
    ("Anders als die eEPK braucht BPMN **kein Ereignis zwischen zwei Aufgaben**", 0),
], width=816)

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Gateways", "Die Entscheidungen im Ablauf")

d.table_top("Die drei Gateways, die ihr braucht", [
    ["Gateway", "Zeichen", "bedeutet"],
    ["exklusiv (XOR)", "Raute mit X", "genau ein Weg"],
    ["parallel (AND)", "Raute mit Plus", "alle Wege gleichzeitig"],
    ["inklusiv (OR)", "Raute mit Kreis", "einer oder mehrere"],
], [230, 250, 336], [
    ("Am **exklusiven** Gateway stehen die Bedingungen an den ausgehenden Pfeilen", 0),
    ("Am **parallelen** Gateway steht keine Bedingung — es laufen immer alle Zweige", 0),
    ("Ein Split braucht in der Regel ein passendes **Merge** mit demselben Typ", 0),
], font_size=11.5, bold_cols=(0,),
   marks={(1, 0): TINT_ORANGE, (2, 0): TINT_GREEN, (3, 0): TINT_BLUE})

d.bullets("Pools, Lanes und Nachrichten", [
    ("Ein **Pool** ist ein Beteiligter — etwa „Unternehmen“ und „Kunde“", 0),
    ("Innerhalb eines Pools trennen **Lanes** die Rollen: Vertrieb, Lager, Buchhaltung", 0),
    ("Der **Sequenzfluss** bleibt **innerhalb** eines Pools", 0),
    ("Zwischen Pools läuft nur der **Nachrichtenfluss** — gestrichelter Pfeil", 0),
    ("Das ist die stärkste Eigenschaft von BPMN: **wer mit wem** wird sichtbar", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "eEPK und BPMN", "Zwei Notationen im Vergleich")

d.table_top("Der Vergleich", [
    ["", "eEPK", "BPMN"],
    ["Herkunft", "Saarbrücken 1992, mit SAP", "OMG-Standard, heute 2.0"],
    ["Verbreitung", "deutschsprachiger Raum", "international"],
    ["Ereignisse", "zwingend im Wechsel", "nur wo sie gebraucht werden"],
    ["Beteiligte", "als Organisationseinheit daneben", "als Pool und Lane im Diagramm"],
    ["Ausführbarkeit", "nicht vorgesehen", "direkt in Prozess-Engines ausführbar"],
    ["Umfang", "wenige Elemente", "über hundert Elemente"],
], [180, 300, 336], [
    ("Für den Einstieg ist die eEPK **einfacher**, für die Praxis ist BPMN **mächtiger**", 0),
    ("Die letzte Zeile ist auch ein Nachteil: kaum jemand kennt alle BPMN-Elemente", 0),
], font_size=11, bold_cols=(0,),
   marks={(5, 2): TINT_GREEN, (6, 2): TINT_ORANGE})

d.merksatz("BPMN kann alles, was die eEPK kann — und zusätzlich zeigen, "
           "wer mit wem Nachrichten austauscht.")

d.bullets("Fun Facts: BPMN", [
    ("BPMN entstand **2004**, seit 2011 gilt die Fassung **2.0**", 0),
    ("Gepflegt wird der Standard von der **Object Management Group**, die auch UML betreut", 0),
    ("BPMN-Modelle lassen sich als **XML** speichern und von Software direkt ausführen", 0),
    ("Der Standard kennt über **100** Symbole — die meisten Modelle nutzen keine zehn davon", 0),
    ("Deshalb gibt es Empfehlungen für eine **Kernmenge**, mit der man 80 % aller Fälle abdeckt", 0),
])

d.bullets("Eure Aufgabe: derselbe Prozess in BPMN", [
    ("Modelliert euren Prozess aus der letzten Stunde in **BPMN** — mit bpmn.io oder draw.io", 0),
    ("Mindestens ein **exklusives Gateway** mit Bedingungen an den Pfeilen", 0),
    ("Mindestens **zwei Lanes** — also zwei Rollen", 0),
    ("Wenn ein Externer beteiligt ist: zweiter **Pool** mit Nachrichtenfluss", 0),
    ("Vergleicht beide Modelle: **Was sieht man in BPMN, was in der eEPK nicht?**", 0),
])

d.save()
