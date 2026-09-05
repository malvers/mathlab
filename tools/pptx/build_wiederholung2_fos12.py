#!/usr/bin/env python3
"""Wiederholung + Klausur 2: LB 2 Algorithmen und Programme + OOP (Woche 22)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, py_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from flow_diagrams import struktogramm

d = Deck("wiederholung-lb2.pptx")
P = lambda n: os.path.join(IMG, n)
code = lambda t, ls, **kw: d.code(t, [py_parts(l) for l in ls], **kw)

d.title("Informatik — FOS 12", "Wiederholung LB 2 und OOP",
        "Alles für Klausur 2 auf einen Blick")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Der Stoff", "Zwölf Wochen in einer Tabelle")

d.table_top("Was drankommen kann", [
    ["Woche", "Thema", "das müsst ihr können"],
    ["11", "Grundbegriffe", "Algorithmus + 5 Eigenschaften, Syntax vs. Semantik, Fehlerarten"],
    ["12", "Visualisierung", "Struktogramm und PAP lesen und zeichnen"],
    ["13", "Datentypen", "int/float/str/bool, Liste, Typumwandlung, // und %"],
    ["14", "Folge", "EVA-Programm schreiben, Testfälle aufstellen"],
    ["15", "Auswahl", "if/elif/else, and/or/not, Grenzwerte"],
    ["16", "Wiederholung", "for mit range, while mit Abbruch, die vier Muster"],
    ["18", "Modularisierung", "def, Parameter/Argument, return, lokal/global"],
    ["20/21", "OOP", "Klasse, Objekt, Attribut, Methode, Vererbung, Kapselung, Polymorphie"],
], [80, 170, 566], [
    ("Schwerpunkt sind die **Grundstrukturen** — sie stecken in fast jeder Aufgabe", 0),
], font_size=10.5, bold_cols=(0, 1))

code("Syntaxkarte I: Ein- und Ausgabe, Grundstrukturen", [
    "x = int(input('...'))          # Eingabe + Umwandlung",
    "print(f'{wert:.2f}')           # formatierte Ausgabe",
    "",
    "if a >= b:  ...  elif a == 0:  ...  else:  ...",
    "",
    "for i in range(1, 11):  ...    # 1 bis 10",
    "for e in liste:  ...           # ueber alle Elemente",
    "while bedingung:  ...          # solange, kopfgesteuert",
    "",
    "7 // 2  -> 3      7 % 2  -> 1      2 ** 10 -> 1024",
], size=13)

code("Syntaxkarte II: Funktionen und Klassen", [
    "def name(p1, p2=0):",
    "    return ergebnis",
    "",
    "class Ding:",
    "    def __init__(self, wert):",
    "        self.wert = wert",
    "    def zeige(self):",
    "        print(self.wert)",
    "",
    "class Unterding(Ding):         # Vererbung",
    "    def __init__(self, wert, extra):",
    "        super().__init__(wert)   # Konstruktor der Oberklasse",
    "        self.extra = extra",
], size=13)

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Aufgabentyp 1", "Ein Struktogramm von Hand durchspielen")

sg = struktogramm(P("sg-klausur.png"), [
    ("do", "a = 12"),
    ("do", "b = 5"),
    ("while", "solange a >= b", [
        ("do", "a = a − b"),
    ]),
    ("do", "Ausgabe: a"),
], W=880, size=26, caption="Was gibt dieses Struktogramm aus - und was berechnet es?")
d.picture_bullets("Verfolgt die Werte", sg, [
    ("Die Aufgabe heißt **Trace** oder **Handsimulation** — Werte Zeile für Zeile mitschreiben", 0),
    ("Legt eine **Tabelle** an: eine Spalte je Variable, eine Zeile je Durchlauf", 0),
    ("Erst danach die zweite Frage beantworten: **was** berechnet der Algorithmus eigentlich?", 0),
], pic_w=390)

d.table_top("Die Trace-Tabelle dazu", [
    ["Durchlauf", "a vorher", "a >= b ?", "a nachher"],
    ["1", "12", "ja", "7"],
    ["2", "7", "ja", "2"],
    ["3", "2", "nein", "2 — Schleife endet"],
    ["Ausgabe", "", "", "2"],
], [170, 180, 200, 266], [
    ("Ergebnis **2** — das ist der **Rest** von 12 geteilt durch 5, also 12 % 5", 0),
    ("Wiederholtes Abziehen **ist** die Division mit Rest — so rechnet ein Prozessor sie tatsächlich", 0),
    ("Prüft immer den **letzten** Schleifendurchlauf: läuft er noch oder nicht mehr?", 0),
], font_size=11.5, bold_cols=(0,), align="cccl",
   marks={(3, 2): TINT_RED, (4, 3): TINT_GREEN})

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Aufgabentyp 2", "Fehler finden und Programme umschreiben")

code("Finde die drei Fehler", [
    "def groesste(werte):",
    "    groesste = 0",
    "    for i in range(1, len(werte)):",
    "        if werte[i] > groesste:",
    "            groesste = werte[i]",
    "    print(groesste)",
    "",
    "zahlen = [-5, -12, -3]",
    "ergebnis = groesste(zahlen)",
    "print('Groesste:', ergebnis)",
], size=13)

d.table_top("Auflösung", [
    ["Fehler", "Wirkung", "Korrektur"],
    ["Start bei 0 statt beim ersten Wert", "bei negativen Zahlen kommt 0 heraus", "groesste = werte[0]"],
    ["range(1, ...) überspringt Index 0", "erster Wert wird nie geprüft", "range(len(werte)) oder for w in werte"],
    ["print statt return", "die Funktion liefert None", "return groesste"],
    ["Name = Funktionsname", "unschön, verdeckt die Funktion", "groesster oder maximum"],
], [250, 250, 316], [
    ("Solche Aufgaben fragen nach **Fehlerart** (Syntax, Laufzeit, Logik) **und** Korrektur", 0),
    ("Der Testfall [-5, -12, -3] entlarvt den ersten Fehler sofort — Randfälle prüfen!", 0),
], font_size=10.5, bold_cols=(0,), mono_cols=(2,),
   marks={(1, 1): TINT_RED, (3, 1): TINT_RED})

d.bullets("Aufgabentyp 3: umschreiben", [
    ("**Struktogramm → Python** und **Python → Struktogramm** — beide Richtungen werden geprüft", 0),
    ("**for → while** und zurück: eine Zählschleife lässt sich immer als bedingte Schleife schreiben", 0),
    ("**Verschachteltes if → elif**: gleiche Logik, flachere Form", 0),
    ("**Hauptprogramm → Funktionen**: einen Block herausziehen, Parameter und return bestimmen", 0),
    ("Achtet beim Umschreiben darauf, dass die **Testfälle weiter dasselbe** liefern", 0),
])

d.bullets("Aufgabentyp 4: OOP erklären und anwenden", [
    ("Begriffe **erklären** und am eigenen Beispiel **zeigen**: Klasse, Objekt, Attribut, Methode", 0),
    ("Ein **UML-Klassendiagramm** lesen und daraus die Klasse in Python schreiben", 0),
    ("Eine **Unterklasse** ergänzen: super() im Konstruktor, eine Methode überschreiben", 0),
    ("**Begründen**, warum ein Attribut gekapselt gehört — mit einem Beispiel, was sonst passiert", 0),
    ("**Bewerten**: Wann lohnt OOP, wann reicht Modularisierung? Argumente: Zustand, Anzahl, Erweiterbarkeit", 0),
])

# ---------------------------------------------------------------- Kapitel 04
d.chapter(4, "Zur Klausur", "Wie ihr die Punkte tatsächlich holt")

d.table_top("Operatoren — was verlangt wird", [
    ["Operator", "Anforderung", "was ihr schreibt"],
    ["nennen, angeben", "AFB I", "Stichworte, keine Sätze nötig"],
    ["beschreiben, darstellen", "AFB I–II", "vollständige Sätze oder ein Diagramm"],
    ["erklären, begründen", "AFB II", "Ursache und Wirkung, mit „weil“"],
    ["anwenden, implementieren", "AFB II", "lauffähiger Code oder Struktogramm"],
    ["bewerten, sich positionieren", "AFB III", "Kriterien nennen, abwägen, entscheiden"],
], [230, 180, 406], [
    ("Der **Operator** sagt, wie ausführlich geantwortet wird — „nennen“ braucht keine Begründung, „bewerten“ schon", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Sechs Tipps für die Klausur", [
    ("**Erst alles lesen**, dann anfangen — mit der Aufgabe beginnen, die ihr sicher könnt", 0),
    ("Bei Programmieraufgaben **erst das Struktogramm** skizzieren, das kostet zwei Minuten und rettet zehn", 0),
    ("**Variablennamen** sprechend wählen — Lesbarkeit wird bewertet", 0),
    ("Bei Schleifen sofort prüfen: **Initialisierung** da? **Abbruch** erreichbar? **Zaunpfahl** stimmt?", 0),
    ("Bei Trace-Aufgaben immer die **Tabelle** hinschreiben, nicht im Kopf rechnen", 0),
    ("Teilpunkte mitnehmen: **Ansatz aufschreiben**, auch wenn das Programm nicht fertig wird", 0),
])

d.merksatz("Wer das Struktogramm hinbekommt, hat die Aufgabe verstanden. "
           "Der Python-Code ist danach nur noch Abschreiben.")

d.bullets("Wie es nach der Klausur weitergeht", [
    ("**Lernbereich 3A: Projekt Webtechnologie** — 20 Unterrichtsstunden, Wochen 23 bis 32", 0),
    ("Ihr arbeitet in **Teams** an einer eigenen Webpräsenz mit Datenbankanbindung", 0),
    ("Alles bisherige kommt zusammen: **Datenbanken** aus LB 1, **Algorithmen** aus LB 2", 0),
    ("Am Ende steht eine **Präsentation** — sie zählt wie eine Klausur", 0),
    ("Denkt schon in den Winterferien über ein **Thema** nach, das euch wirklich interessiert", 0),
])

d.save()
