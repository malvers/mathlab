#!/usr/bin/env python3
"""Informatik 12 (BGY), Woche 34 / KW 17: Problemloesestrategien - Visualisierung
von Programmstrukturen (LB 3, Ustd. 5-6/24)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from flow_diagrams import struktogramm, pap

d = Deck("visualisierung-programmstrukturen.pptx")
P = lambda n: os.path.join(IMG, n)

d.title("Informatik — Grundkurs 12", "Erst zeichnen, dann programmieren",
        "Struktogramm und Programmablaufplan — die drei Grundstrukturen")

d.chapter(1, "Drei Grundstrukturen", "Mehr braucht kein Algorithmus")

d.table_top("Folge, Auswahl, Wiederholung", [
    ["Struktur", "heißt", "Beispiel"],
    ["Folge", "Anweisungen nacheinander", "einlesen, rechnen, ausgeben"],
    ["Auswahl", "eine von mehreren Möglichkeiten", "if, elif, else"],
    ["Wiederholung", "ein Block läuft mehrfach", "for, while"],
], [180, 330, 306], [
    ("**Böhm und Jacopini** bewiesen 1966: diese drei genügen für **jeden** Algorithmus", 0),
    ("Deshalb kommt der Sprungbefehl in strukturierten Sprachen nicht mehr vor", 0),
], font_size=11, bold_cols=(0,))

sg = struktogramm(P("sg-note-inf12.png"), [
    ("do", "Punkte einlesen"),
    ("if", "Punkte >= 50", [("do", "Note = 1")], [("do", "Note = 4")]),
    ("do", "Note ausgeben"),
], W=760, size=26)
d.picture_bullets("Auswahl im Struktogramm", sg, [
    ("Der Kasten mit **Dreieck** ist die Auswahl: links ja, rechts nein", 0),
    ("Ein Struktogramm hat **einen Eingang oben und einen Ausgang unten**", 0),
    ("Deshalb sind Sprünge darin **nicht darstellbar** — das ist Absicht", 0),
    ("Aus einem Struktogramm entsteht automatisch strukturierter Code", 0),
], pic_w=400)

d.chapter(2, "PAP", "Dieselbe Sache mit anderen Symbolen")

d.table_top("Die Symbole nach DIN 66001", [
    ["Symbol", "bedeutet"],
    ["Rechteck mit runden Enden", "Anfang und Ende"],
    ["Parallelogramm", "Ein- oder Ausgabe"],
    ["Rechteck", "Operation, Zuweisung"],
    ["Raute", "Verzweigung mit zwei beschrifteten Ausgängen"],
    ["Pfeil", "Ablaufrichtung"],
], [330, 486], [
    ("Der **PAP** erlaubt Pfeile in jede Richtung — auch zurück nach oben für Schleifen", 0),
    ("Genau darin liegt sein Vorteil und seine Gefahr: **Sprünge sind möglich**", 0),
], font_size=11.5, bold_cols=(0,), marks={(4, 0): TINT_ORANGE})

pp = pap(P("pap-note-inf12.png"), 1000, 900, {
    "s": dict(pos=(500, 80), w=260, h=90, kind="start", text="Start"),
    "e": dict(pos=(500, 240), w=320, h=90, kind="io", text="Punkte einlesen"),
    "d": dict(pos=(500, 430), w=300, h=150, kind="dec", text="Punkte >= 50?"),
    "a": dict(pos=(180, 640), w=240, h=90, text="Note = 1"),
    "b": dict(pos=(820, 640), w=240, h=90, text="Note = 4"),
    "o": dict(pos=(500, 800), w=300, h=90, kind="io", text="Note ausgeben"),
}, [
    ("s", "e", ""), ("e", "d", ""),
    ("d", "a", "ja"), ("d", "b", "nein"),
    ("a", "o", ""), ("b", "o", ""),
], size=26)
d.picture_bullets("Dasselbe als Programmablaufplan", pp, [
    ("Die **Raute** hat genau zwei beschriftete Ausgänge", 0),
    ("Beide Zweige führen wieder **zusammen** — sonst hat der Plan zwei Enden", 0),
    ("Für Schleifen zeigt ein Pfeil **zurück** nach oben", 0),
], pic_w=330)

d.chapter(3, "Lesen und prüfen", "Woran man einen guten Entwurf erkennt")

d.bullets("Die Prüffragen", [
    ("Hat der Plan **genau einen** Anfang und **genau ein** Ende?", 0),
    ("Ist jede Verzweigung **beschriftet** — und führen die Zweige wieder zusammen?", 0),
    ("Endet jede Schleife? **Was** ändert sich im Rumpf, damit sie endet?", 0),
    ("Sind die Anweisungen **eindeutig** — oder steht dort „ein bisschen erhöhen“?", 0),
    ("Und: lässt sich der Plan **von Hand durchspielen**? Das ist der Schreibtischtest", 0),
])

d.merksatz("Was man nicht zeichnen kann, kann man auch nicht programmieren. "
           "Und ein Struktogramm ohne Ende ist keins.")

d.bullets("Fun Facts: Visualisierung", [
    ("Das **Struktogramm** heißt nach seinen Erfindern **Nassi-Shneiderman-Diagramm** (1972)", 0),
    ("Es entstand ausdrücklich, um Sprünge **unmöglich** zu machen", 0),
    ("Der **PAP** ist nach DIN 66001 genormt — die Norm stammt von 1966", 0),
    ("**Dijkstra** schrieb 1968 „Go To Statement Considered Harmful“ — der Anfang vom Ende des Sprungs", 0),
    ("In Jahrgangsstufe 13 setzt ihr diese Entwürfe in **Programmcode** um", 0),
])

d.bullets("Eure Aufgabe", [
    ("Zeichnet zu **drei Aufgaben** vom Arbeitsblatt je ein Struktogramm", 0),
    ("Übertragt **eines** davon in einen PAP", 0),
    ("Prüft jeden Entwurf mit den **fünf Prüffragen**", 0),
    ("Spielt einen Entwurf mit einer **Wertetabelle** durch", 0),
    ("Tauscht mit dem Nachbarn: **lässt sich sein Entwurf ohne Rückfrage lesen?**", 0),
])

d.save()
