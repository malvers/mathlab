#!/usr/bin/env python3
"""Visualisierung von Programmstrukturen: Struktogramm, PAP, GRAFCET (Woche 12)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, py_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from flow_diagrams import struktogramm, pap, grafcet

d = Deck("programmstrukturen-visualisieren.pptx")
P = lambda n: os.path.join(IMG, n)

d.title("Informatik — FOS 12", "Programmstrukturen sichtbar machen",
        "Struktogramm, Programmablaufplan und GRAFCET")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Warum zeichnen?", "Der Plan entsteht vor der ersten Codezeile")

d.bullets("Erst denken, dann tippen", [
    ("Ein Algorithmus in **Prosa** ist lang, mehrdeutig und schwer zu prüfen", 0),
    ("Ein **Diagramm** zeigt den Ablauf auf einen Blick: Reihenfolge, Verzweigung, Wiederholung", 0),
    ("Es ist **sprachunabhängig** — dasselbe Bild wird Python, Java oder eine SPS-Steuerung", 0),
    ("Im Team ist es die **gemeinsame Sprache** zwischen Auftraggeber und Programmierer", 0),
    ("Und in der Prüfung: **lesen** und **zeichnen** können ist Pflichtstoff", 0),
])

d.table_top("Drei Notationen, drei Zwecke", [
    ["Notation", "Norm / Herkunft", "Stärke", "typisch für"],
    ["Struktogramm", "Nassi-Shneiderman 1972, DIN 66261", "erzwingt saubere Struktur", "Unterricht, Hochsprachen"],
    ["Programmablaufplan", "DIN 66001", "zeigt Sprünge und Wege", "Übersicht, Fehlersuche"],
    ["GRAFCET", "DIN EN 60848", "Zustände über die Zeit", "Steuerungen, Automatisierung"],
], [190, 250, 200, 176], [
    ("Alle drei beschreiben **denselben** Algorithmus — nur mit anderem Blickwinkel", 0),
    ("Faustregel: **Struktogramm** zum Entwerfen, **PAP** zum Erklären, **GRAFCET** zum Steuern", 0),
], font_size=11, bold_cols=(0,))

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Struktogramm", "Ein Kasten, der nie aus dem Rahmen fällt")

d.table_top("Die drei Grundstrukturen im Struktogramm", [
    ["Struktur", "Darstellung", "bedeutet"],
    ["Folge", "Kästen untereinander", "ein Schritt nach dem anderen"],
    ["Auswahl", "Kasten mit Dreieck, ja links / nein rechts", "genau ein Zweig wird ausgeführt"],
    ["Wiederholung", "Rahmen links, Bedingung oben (oder unten)", "der Inhalt läuft mehrfach"],
], [150, 350, 300], [
    ("Ein Struktogramm hat **einen** Eingang oben und **einen** Ausgang unten — keine Pfeile, keine Sprünge", 0),
    ("Genau deshalb entsteht automatisch **strukturierter** Code ohne GOTO", 0),
    ("Verschachteln heißt: ein Kasten sitzt **innerhalb** eines anderen", 0),
], font_size=11.5, bold_cols=(0,))

sg1 = struktogramm(P("sg-note.png"), [
    ("do", "Eingabe: Punkte"),
    ("if", "Punkte >= 50", [
        ("do", "Ausgabe: bestanden"),
        ("if", "Punkte >= 85", [("do", "Ausgabe: sehr gut")], [("do", "keine Zusatzmeldung")]),
    ], [
        ("do", "Ausgabe: nicht bestanden"),
    ]),
    ("do", "Ausgabe: Ende der Auswertung"),
], W=1080, size=25, caption="Verschachtelte Auswahl - der innere Kasten sitzt im aeusseren")
d.picture("Beispiel: Punkte auswerten", sg1, [
    ("Die **innere** Auswahl liegt komplett im Ja-Zweig der äußeren", 0),
    ("Der Kasten ganz unten läuft **immer** — er steht außerhalb der Auswahl", 0),
], width=560)

sg2 = struktogramm(P("sg-summe.png"), [
    ("do", "Eingabe: n"),
    ("do", "summe = 0"),
    ("for", "für i von 1 bis n", [
        ("do", "summe = summe + i"),
    ]),
    ("do", "Ausgabe: summe"),
], W=880, size=26)
d.picture_bullets("Beispiel: Zahlen aufsummieren", sg2, [
    ("Der **Rahmen links** zeigt: alles darin gehört zur Schleife", 0),
    ("Die Bedingung steht **oben** — die Schleife prüft also **vor** jedem Durchlauf", 0),
    ("Vor der Schleife wird **initialisiert** (summe = 0) — der klassische Anfängerfehler ist, das zu vergessen", 0),
    ("Nach der Schleife steht das **Ergebnis** — ein Kasten außerhalb des Rahmens", 0),
], pic_w=400)

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Programmablaufplan", "Pfeile zeigen, wohin die Reise geht")

d.table_top("Die Symbole nach DIN 66001", [
    ["Symbol", "Form", "Bedeutung", "Beispiel"],
    ["Grenzstelle", "Rechteck mit runden Enden", "Anfang und Ende", "Start / Ende"],
    ["Ein-/Ausgabe", "Parallelogramm", "Daten kommen rein oder raus", "Eingabe n"],
    ["Operation", "Rechteck", "eine Anweisung", "summe = summe + i"],
    ["Verzweigung", "Raute", "eine Ja/Nein-Frage", "i <= n ?"],
    ["Ablauflinie", "Pfeil", "so geht es weiter", "→"],
], [150, 240, 250, 176], [
    ("Jede Raute hat **genau zwei** beschriftete Ausgänge: **ja** und **nein**", 0),
    ("Pfeile dürfen **zurückspringen** — daraus entsteht die Schleife", 0),
], font_size=11.5, bold_cols=(0,),
   marks={(4, c): TINT_ORANGE for c in range(4)})

N = {
    "start": {"pos": (420, 70), "kind": "start", "text": "Start", "w": 240, "h": 84},
    "in":    {"pos": (420, 214), "kind": "io", "text": "Eingabe n", "w": 330, "h": 92},
    "init":  {"pos": (420, 356), "text": "i = 1 ; summe = 0", "w": 380, "h": 92},
    "dec":   {"pos": (420, 540), "kind": "dec", "text": "i <= n ?", "w": 370, "h": 176},
    "body":  {"pos": (420, 738), "text": "summe = summe + i", "w": 420, "h": 92},
    "inc":   {"pos": (420, 872), "text": "i = i + 1", "w": 300, "h": 92},
    "out":   {"pos": (930, 540), "kind": "io", "text": "Ausgabe summe", "w": 380, "h": 92},
    "end":   {"pos": (930, 706), "kind": "end", "text": "Ende", "w": 240, "h": 84},
}
E = [("start", "in", ""), ("in", "init", ""), ("init", "dec", ""),
     ("dec", "body", "ja"), ("body", "inc", ""),
     ("inc", "dec", "", [(140, 872), (140, 540)]),
     ("dec", "out", "nein"), ("out", "end", "")]
p1 = pap(P("pap-summe.png"), 1240, 950, N, E)
d.picture_bullets("Derselbe Algorithmus als PAP", p1, [
    ("Es ist **dieselbe** Aufgabe wie im Struktogramm zuvor — nur anders gezeichnet", 0),
    ("Die Schleife ist hier ein **Pfeil nach oben**, kein Rahmen", 0),
    ("Der PAP zeigt den **Weg**, das Struktogramm die **Struktur**", 0),
    ("Nachteil: Pfeile dürfen überallhin — man kann sich damit ein Chaos zeichnen", 0),
], pic_w=430)

d.table_top("Struktogramm oder PAP?", [
    ["", "Struktogramm", "Programmablaufplan"],
    ["Sprünge", "unmöglich", "erlaubt — auch quer"],
    ["Platzbedarf", "kompakt", "wird schnell groß"],
    ["Ändern", "mühsam (alles rutscht)", "leicht (Pfeil umhängen)"],
    ["Umsetzung in Code", "fast Zeile für Zeile", "erfordert Umdenken"],
], [180, 300, 336], [
    ("Wir entwerfen mit dem **Struktogramm** und zeichnen einen **PAP**, wenn wir erklären wollen", 0),
    ("Beide sind in der Prüfung **lesbar** zu beherrschen", 0),
], font_size=11.5, bold_cols=(0,),
   marks={(1, 1): TINT_GREEN, (1, 2): TINT_RED, (4, 1): TINT_GREEN})

# ---------------------------------------------------------------- Kapitel 04
d.chapter(4, "GRAFCET", "Wenn nicht gerechnet, sondern gesteuert wird")

gc = grafcet(P("gc-abfuellung.png"), [
    (0, None, "Startknopf gedrückt"),
    (1, "Pumpe EIN", "Füllstand max erreicht"),
    (2, "Pumpe AUS · Ventil AUF", "Behälter leer"),
], W=1020, size=26, caption="Abfuellanlage: Schritte, Aktionen, Transitionsbedingungen")
d.picture_bullets("Eine Anlage steuern", gc, [
    ("**Schritt** (Quadrat) = ein Zustand; der Doppelrahmen ist der **Anfangsschritt**", 0),
    ("Rechts daneben steht die **Aktion**, die in diesem Zustand läuft", 0),
    ("Der Querstrich ist eine **Transition**: erst wenn die Bedingung wahr ist, geht es weiter", 0),
    ("Der Ablauf endet nie — er **läuft im Kreis**, wie eine echte Anlage", 0),
], pic_w=420)

d.bullets("Was GRAFCET anders macht", [
    ("Es beschreibt **Zustände über die Zeit**, nicht die Berechnung eines Wertes", 0),
    ("Mehrere Schritte dürfen **gleichzeitig** aktiv sein — parallele Zweige", 0),
    ("Heimat: **Automatisierungstechnik**, Speicherprogrammierbare Steuerungen (SPS)", 0),
    ("Für die Fachrichtung Technik ist es die Brücke zwischen Informatik und Anlagenbau", 0),
    ("Normiert in **DIN EN 60848**, hervorgegangen aus dem französischen GRAFCET von 1977", 0),
])

d.bullets("Fun Facts: Diagramme", [
    ("**Isaac Nassi** und **Ben Shneiderman** erfanden das Struktogramm 1972 als Studenten — gegen den GOTO-Wildwuchs", 0),
    ("**Edsger Dijkstra** schrieb 1968 den Brief „**Go To Statement Considered Harmful**“ — einer der berühmtesten Texte der Informatik", 0),
    ("Der erste Flussplan stammt von **Frank und Lillian Gilbreth**, 1921 — für Arbeitsabläufe in Fabriken", 0),
    ("Ben Shneiderman prägte später auch das **Treemap**-Diagramm — und war genervt von vollen Festplatten", 0),
])

d.merksatz("Struktogramm oder PAP zeichnen heißt: den Algorithmus verstehen, "
           "bevor die Programmiersprache mitredet.")

d.bullets("Eure Aufgabe: dieselbe Idee, drei Bilder", [
    ("Algorithmus: **Zahl raten** — der Rechner denkt sich 1–100 aus, der Mensch rät, bis er richtig liegt", 0),
    ("Zeichnet ihn als **Struktogramm** (Schleife mit Auswahl darin)", 0),
    ("Zeichnet **denselben** Ablauf als **PAP** — achtet auf die Rücksprungpfeile", 0),
    ("Vergleicht in der Gruppe: Welche Darstellung habt ihr schneller verstanden?", 0),
    ("Zusatz für die Techniker: Eine **Ampel** als GRAFCET mit vier Schritten", 0),
])

d.save()
