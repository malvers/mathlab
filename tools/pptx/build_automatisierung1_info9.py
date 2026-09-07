#!/usr/bin/env python3
"""Informatik 9 (Oberschule), Woche 19 / KW 1: Wahlbereich Informatik und
Automatisierung I (1/2)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from flow_diagrams import pap

d = Deck("automatisierung-1.pptx")
P = lambda n: os.path.join(IMG, n)

d.title("Informatik — Klasse 9", "Wenn Maschinen selbst entscheiden",
        "Sprachassistenten, Smarthome, Bots und Drohnen — und ein eigenes Modell")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Was heißt automatisiert?", "Drei Teile, immer dieselben")

dia = pap(P("pap-regelkreis-info9.png"), 1560, 400, {
    "s": dict(pos=(250, 140), w=360, h=150, kind="io", text="MESSEN: Sensor"),
    "v": dict(pos=(780, 140), w=380, h=150, kind="proc", text="ENTSCHEIDEN: Regel oder Modell"),
    "a": dict(pos=(1310, 140), w=360, h=150, kind="io", text="HANDELN: Aktor"),
}, [
    ("s", "v", "Wert"),
    ("v", "a", "Befehl"),
    ("a", "s", "verändert die Lage", [(1310, 320), (250, 320)]),
], notes=[("Der Kreis schließt sich: gehandelt wird, dann neu gemessen", (520, 355))], size=29)
d.picture("Messen, entscheiden, handeln", dia, [
    ("Jede Automatisierung besteht aus diesen drei Teilen — vom Toaster bis zur Fabrik", 0),
    ("Der **Sensor** misst, die **Regel** entscheidet, der **Aktor** tut etwas", 0),
], width=816)

d.table_top("Vier Beispiele, dasselbe Muster", [
    ["System", "misst", "entscheidet", "handelt"],
    ["Heizung", "Temperatur", "unter 21 Grad?", "Ventil auf"],
    ["Sprachassistent", "Schall", "Weckwort erkannt?", "Aufnahme starten"],
    ["Windrad", "Windrichtung", "steht es schief?", "Gondel drehen"],
    ["Drohne", "Lage und Höhe", "kippt sie?", "Motoren nachregeln"],
], [190, 200, 220, 206], [
    ("Der Unterschied liegt allein in der **Regel** in der Mitte", 0),
    ("Manche Regeln schreibt ein Mensch. Andere werden aus **Beispielen gelernt**", 0),
], font_size=11, bold_cols=(0,))

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Regel oder gelernt", "Der wichtigste Unterschied dieser Stunde")

d.table_top("Zwei Arten, zu einer Entscheidung zu kommen", [
    ["", "feste Regel", "gelerntes Modell"],
    ["kommt von", "einem Menschen, der sie hinschreibt", "vielen Beispielen"],
    ["Beispiel", "„unter 21 Grad: heizen“", "„das ist eine Katze“"],
    ["nachvollziehbar?", "ja, man kann sie lesen", "nur schwer"],
    ["falsch, wenn", "die Regel falsch gedacht war", "die Beispiele schief waren"],
], [200, 300, 316], [
    ("Ein gelerntes Modell **kennt keine Regeln** — es erkennt Muster in dem, was es gesehen hat", 0),
    ("Deshalb ist es nur so gut wie seine **Beispiele**", 0),
], font_size=11, bold_cols=(0,), marks={(4, 2): TINT_ORANGE})

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Selbst trainieren", "Teachable Machine im Browser")

d.bullets("So läuft der Versuch", [
    ("**Zwei Klassen** wählen, zum Beispiel „Hand offen“ und „Hand zu“", 0),
    ("Je Klasse **mindestens 50 Bilder** über die Webcam aufnehmen", 0),
    ("**Trainieren** klicken — das dauert Sekunden", 0),
    ("Testen: hält das Modell, was es verspricht?", 0),
    ("Dann **absichtlich austricksen**: anderer Hintergrund, andere Person, weniger Licht", 0),
])

d.bullets("Worauf ihr achten sollt", [
    ("Nehmt ihr alle Bilder **gleich** auf, lernt das Modell den Hintergrund statt die Hand", 0),
    ("Sind es von einer Klasse **viel mehr** Bilder, rät es im Zweifel diese Klasse", 0),
    ("Das Modell ist immer **sicher** — auch wenn es danebenliegt", 0),
    ("Es sagt nie „weiß ich nicht“, sondern nennt Prozentzahlen", 0),
    ("Schreibt auf, **womit** ihr es zum Fehler gebracht habt — das ist das Ergebnis", 0),
])

d.merksatz("Ein gelerntes Modell kennt keine Regeln, nur Beispiele. "
           "Es ist genau so gut wie die Beispiele, aus denen es gelernt hat.")

d.bullets("Fun Facts: Automatisierung", [
    ("Der Begriff **Roboter** stammt aus einem Theaterstück von 1920 — vom tschechischen „robota“, Arbeit", 0),
    ("Die erste **Regelung** der Technik war der Fliehkraftregler an der Dampfmaschine, 1788", 0),
    ("Ein modernes **Windrad** dreht sich selbstständig in den Wind und bremst bei Sturm ab", 0),
    ("**Teachable Machine** von Google läuft komplett im Browser — die Bilder bleiben auf eurem Rechner", 0),
    ("Ein Saugroboter kartiert eure Wohnung — die Karte ist wertvoller als der Staub", 0),
])

d.bullets("Eure Aufgabe", [
    ("Trainiert zu zweit ein Modell mit **zwei Klassen** eurer Wahl", 0),
    ("Testet es und notiert die **Trefferquote** in zehn Versuchen", 0),
    ("Findet **zwei Wege**, es zu täuschen — und erklärt, warum sie funktionieren", 0),
    ("Sammelt fünf Beispiele: **Wo begegnet euch Automatisierung im Alltag?**", 0),
    ("Zu jedem Beispiel: **was wird gemessen, was passiert danach?**", 0),
])

d.save()
