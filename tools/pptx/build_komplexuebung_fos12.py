#!/usr/bin/env python3
"""Abschluss LB 2: Komplexuebung Problemloesungsstrategie + Codereview (Woche 19)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, py_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from flow_diagrams import struktogramm, pap

d = Deck("komplexuebung-lb2.pptx")
P = lambda n: os.path.join(IMG, n)
code = lambda t, ls, **kw: d.code(t, [py_parts(l) for l in ls], **kw)

d.title("Informatik — FOS 12", "Die ganze Kette",
        "Problem → Entwurf → Programm → Test: Komplexübung und Codereview")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Problemlösen", "Sechs Phasen, und keine davon heißt „drauflostippen“")

CH = ["Problem\nverstehen", "Analyse", "Entwurf", "Implemen-\ntierung", "Test", "Dokumen-\ntation"]
nodes, edges = {}, []
for i, t in enumerate(CH):
    key = f"n{i}"
    nodes[key] = {"pos": (150 + i * 250, 110), "text": t.replace("\n", " "),
                  "w": 210, "h": 110,
                  "color": (221, 232, 198) if i in (0, 5) else None}
    if i:
        edges.append((f"n{i-1}", key, ""))
for k, v in nodes.items():
    if v["color"] is None:
        del v["color"]
chain = pap(P("chain-loesung.png"), 1620, 196, nodes, edges, size=25)
d.picture("Die Problemlösungskette", chain, [
    ("Jede Phase hat ein **sichtbares Ergebnis**: Aufgabentext, Datenliste, Struktogramm, Code, Testtabelle, Beschreibung", 0),
    ("Wer eine Phase überspringt, holt sie später **teurer** nach — meist in der Fehlersuche", 0),
    ("Rückschritte sind erlaubt: ein Testfehler schickt euch zurück in den **Entwurf**", 0),
], width=780)

d.table_top("Was in jeder Phase zu tun ist", [
    ["Phase", "Leitfrage", "Ergebnis"],
    ["Problem verstehen", "Was genau soll herauskommen?", "Aufgabe in eigenen Worten, 3 Sätze"],
    ["Analyse", "Welche Daten rein, welche raus?", "Liste der Eingaben, Ausgaben, Regeln"],
    ["Entwurf", "In welchen Schritten?", "Struktogramm, Funktionsnamen"],
    ["Implementierung", "Wie heißt das in Python?", "lauffähiges Programm"],
    ["Test", "Stimmt es auch?", "Testtabelle mit Soll und Ist"],
    ["Dokumentation", "Versteht es ein anderer?", "Kommentare, kurze Beschreibung"],
], [170, 290, 356], [
    ("Die **Analyse** ist die Phase, die am häufigsten übersprungen wird — und am meisten Zeit spart", 0),
], font_size=11, bold_cols=(0,))

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Die Aufgabe", "Ein Getränkeautomat, der wirklich rechnet")

d.bullets("Aufgabenstellung", [
    ("Ein **Automat** verkauft drei Getränke: Wasser 1,20 € · Saft 1,80 € · Kaffee 2,50 €", 0),
    ("Der Kunde **wählt** ein Getränk und wirft nacheinander Münzen ein", 0),
    ("Der Automat zeigt nach jeder Münze den **Restbetrag** an", 0),
    ("Ist genug bezahlt, gibt er das Getränk aus und **berechnet das Wechselgeld**", 0),
    ("Das Wechselgeld wird in **möglichst wenigen Münzen** ausgegeben (2 €, 1 €, 50 ct, 20 ct, 10 ct)", 0),
])

d.table_top("Analyse: Eingaben, Ausgaben, Regeln", [
    ["", "was", "Typ / Wertebereich"],
    ["Eingabe", "Getränkewahl", "1, 2 oder 3 — alles andere abweisen"],
    ["Eingabe", "Münzwert in Cent", "10, 20, 50, 100, 200"],
    ["Ausgabe", "Restbetrag nach jeder Münze", "Cent, nie negativ angezeigt"],
    ["Ausgabe", "Getränk + Wechselgeldstückelung", "Anzahl je Münzsorte"],
    ["Regel", "Preise in **Cent** rechnen", "int statt float — keine Rundungsfehler"],
], [130, 300, 386], [
    ("Der wichtigste Entwurfsentscheid steht in der letzten Zeile: **alles in Cent**", 0),
    ("Damit ist 0.1 + 0.2 kein Thema mehr — die Kasse stimmt auf den Cent", 0),
], font_size=11, bold_cols=(0,), marks={(5, c): TINT_ORANGE for c in range(3)})

sg = struktogramm(P("sg-automat.png"), [
    ("do", "Getränk wählen (1, 2, 3)"),
    ("do", "preis = Preis des Getränks"),
    ("do", "bezahlt = 0"),
    ("while", "solange bezahlt < preis", [
        ("do", "Münze einwerfen"),
        ("do", "bezahlt = bezahlt + Münzwert"),
        ("do", "Ausgabe: noch preis − bezahlt Cent"),
    ]),
    ("do", "Getränk ausgeben"),
    ("call", "wechselgeld(bezahlt − preis)"),
], W=1000, size=25)
d.picture_bullets("Entwurf: das Hauptprogramm", sg, [
    ("Eine **while**-Schleife, die endet, sobald genug Geld drin ist", 0),
    ("Das Wechselgeld ist ein **eigenes Teilproblem** — Aufruf-Kasten", 0),
    ("Die Auswahl des Getränks lohnt sich als **eigene Funktion** mit Prüfung der Eingabe", 0),
], pic_w=420)

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Umsetzung", "Vom Entwurf zum Gerüst")

code("Das Gerüst — die Funktionen zuerst", [
    "PREISE = {1: 120, 2: 180, 3: 250}       # alles in Cent",
    "MUENZEN = [200, 100, 50, 20, 10]",
    "",
    "def waehle_getraenk():",
    "    wahl = 0",
    "    while wahl not in PREISE:",
    "        wahl = int(input('1 Wasser, 2 Saft, 3 Kaffee: '))",
    "    return wahl",
    "",
    "def kassiere(preis):",
    "    bezahlt = 0",
    "    while bezahlt < preis:",
    "        muenze = int(input(f'noch {preis - bezahlt} ct - Muenze: '))",
    "        if muenze in MUENZEN:",
    "            bezahlt = bezahlt + muenze",
    "        else:",
    "            print('Muenze wird nicht angenommen')",
    "    return bezahlt",
], size=11)

code("Das Wechselgeld — das eigentliche Problem", [
    "def wechselgeld(rest):",
    "    for muenze in MUENZEN:          # gross nach klein: gieriges Verfahren",
    "        anzahl = rest // muenze",
    "        if anzahl > 0:",
    "            print(f'{anzahl} x {muenze} ct')",
    "        rest = rest % muenze",
    "",
    "",
    "wahl = waehle_getraenk()",
    "preis = PREISE[wahl]",
    "bezahlt = kassiere(preis)",
    "print('Getraenk wird ausgegeben.')",
    "wechselgeld(bezahlt - preis)",
], size=12.5)

d.bullets("Warum das Verfahren funktioniert", [
    ("Immer die **größte passende** Münze nehmen — das heißt **gieriges Verfahren** (greedy)", 0),
    ("**//** liefert die Anzahl, **%** den verbleibenden Rest — genau die beiden Operatoren aus Woche 13", 0),
    ("Beim Euro **klappt** das immer mit der kleinsten Münzzahl — das ist nicht bei jedem Münzsystem so", 0),
    ("Gegenbeispiel: mit Münzen 1, 3, 4 wären für 6 zweimal 3 optimal — gierig nimmt 4 + 1 + 1", 0),
    ("Merke: Ein Verfahren, das oft stimmt, ist noch **kein Beweis**, dass es immer stimmt", 0),
])

# ---------------------------------------------------------------- Kapitel 04
d.chapter(4, "Codereview", "Fremden Code lesen ist die halbe Ausbildung")

d.table_top("Review-Checkliste für die Partnerarbeit", [
    ["Bereich", "Frage an den Code", "Befund"],
    ["Verständlich", "Sagen die Namen, was sie enthalten?", "________________"],
    ["Struktur", "Hat jede Funktion genau eine Aufgabe?", "________________"],
    ["Korrekt", "Stimmen die Grenzfälle (0, genau passend, zu viel)?", "________________"],
    ["Robust", "Was passiert bei einer falschen Eingabe?", "________________"],
    ["Test", "Gibt es eine Testtabelle mit Soll und Ist?", "________________"],
    ["Doku", "Versteht man in 2 Minuten, was das Programm tut?", "________________"],
], [140, 400, 276], [
    ("Reviewt in **Partnerarbeit**: einer erklärt, einer fragt — dann tauschen", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Wie man Rückmeldung gibt", [
    ("**Über den Code reden, nicht über die Person**: „diese Funktion macht zwei Dinge“ statt „du machst das falsch“", 0),
    ("**Fragen statt Urteilen**: „Was passiert hier bei einer Eingabe von 0?“", 0),
    ("**Konkret werden**: Zeile nennen, Beispiel nennen, Vorschlag machen", 0),
    ("Auch **loben**, was gut ist — gute Namen und gute Testfälle sind nicht selbstverständlich", 0),
    ("Und als Autor: **zuhören, nicht verteidigen**. Der Code muss ohne euch verständlich sein", 0),
])

d.merksatz("Ein Programm wird einmal geschrieben und hundertmal gelesen. "
           "Schreibt für die Leser.")

d.bullets("Fun Facts: Problemlösen", [
    ("**George Pólya** beschrieb 1945 in „**How to Solve It**“ dieselben vier Schritte — für Mathematik, nicht für Computer", 0),
    ("Beim **Rubber Duck Debugging** erklärt man seinen Code einer Gummiente — und findet den Fehler beim Reden", 0),
    ("Studien zeigen: **Codereviews** finden mehr Fehler als Testen — und die teuersten zuerst", 0),
    ("Das **Münzwechselproblem** ist ein Klassiker der Optimierung; gierig ist schnell, aber nicht immer optimal", 0),
])

d.bullets("Eure Abgabe zum Abschluss von LB 2", [
    ("Ein **lauffähiger** Getränkeautomat mit mindestens vier Funktionen", 0),
    ("Das **Struktogramm** des Hauptprogramms und je eines für zwei Funktionen", 0),
    ("Eine **Testtabelle** mit mindestens sechs Fällen, darunter Randfälle", 0),
    ("Ein ausgefülltes **Reviewblatt** von eurem Partner — mit einem Punkt, den ihr danach geändert habt", 0),
    ("In Woche 22 kommt die **Klausur** über LB 2 und OOP — dieses Projekt ist die beste Vorbereitung", 0),
])

d.save()
