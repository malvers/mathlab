#!/usr/bin/env python3
"""Wahlbereich OOP I: Klasse, Objekt, Attribut, Methode (Woche 20)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, py_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from uml_diagrams import uml_diagram, ORA, RD, GRN

d = Deck("oop1-klasse-objekt.pptx")
P = lambda n: os.path.join(IMG, n)
code = lambda t, ls, **kw: d.code(t, [py_parts(l) for l in ls], **kw)

d.title("Informatik — FOS 12", "Objektorientierte Programmierung I",
        "Wahlbereich 2: Klasse, Objekt, Attribut, Methode")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Ein neuer Blick", "Daten und Verhalten gehören zusammen")

d.bullets("Wo die bisherige Art an Grenzen stößt", [
    ("Bisher: **Daten** liegen in Variablen, **Verhalten** steckt in Funktionen — getrennt", 0),
    ("Ein Auto braucht marke, tempo, tueren … und beschleunigen(), bremsen(), hupen()", 0),
    ("Für **drei** Autos bräuchte man neun Variablen und Funktionen mit vielen Parametern", 0),
    ("Die **Objektorientierung** packt beides zusammen: ein Objekt **weiß** etwas und **kann** etwas", 0),
    ("Damit modelliert man die Wirklichkeit, statt sie in Einzelteile zu zerlegen", 0),
])

d.table_top("Zwei Denkweisen im Vergleich", [
    ["", "prozedural (LB 2)", "objektorientiert"],
    ["Bausteine", "Variablen und Funktionen", "Klassen und Objekte"],
    ["Zusammenhalt", "der Programmierer merkt ihn sich", "die Klasse hält ihn fest"],
    ["Aufruf", "beschleunigen(tempo, wert)", "auto.beschleunigen(wert)"],
    ["Erweitern", "neue Funktion schreiben", "neue Klasse ableiten"],
    ["gut für", "kurze, klare Abläufe", "viele gleichartige Dinge"],
], [160, 320, 336], [
    ("Beides ist richtig — die Frage ist **was passt zum Problem**", 0),
    ("OOP lohnt sich, sobald es **viele gleichartige Dinge** mit eigenem Zustand gibt", 0),
], font_size=11.5, bold_cols=(0,), mono_cols=(1, 2))

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Klasse und Objekt", "Der Bauplan und das gebaute Ding")

d.bullets("Die vier Grundbegriffe", [
    ("**Klasse** = der Bauplan. Sie beschreibt, was alle Dinge dieser Art haben und können", 0),
    ("**Objekt** (Instanz) = ein konkretes Ding nach diesem Bauplan — mit eigenen Werten", 0),
    ("**Attribut** = eine Eigenschaft des Objekts, seine Daten (marke, tempo)", 0),
    ("**Methode** = eine Fähigkeit des Objekts, seine Funktion (beschleunigen())", 0),
    ("Bild dazu: der **Bauplan eines Hauses** ist die Klasse, die gebauten Häuser sind Objekte", 0),
])

u1 = uml_diagram(P("uml-auto.png"), {
    "auto": {"pos": (560, 30), "name": "Auto", "w": 460, "color": ORA,
             "attrs": ["marke", "tempo", "tueren"],
             "methods": ["beschleunigen(wert)", "bremsen()", "zeige()"]},
}, [], W=1580, H=380, caption="UML-Klassendiagramm: Name - Attribute - Methoden")
d.picture("Eine Klasse im UML-Diagramm", u1, [
    ("Drei Fächer: **Name** oben, **Attribute** in der Mitte, **Methoden** unten", 0),
    ("Das Diagramm ist **sprachunabhängig** — daraus wird Python, Java oder C++", 0),
    ("Es beschreibt **eine** Klasse und damit **beliebig viele** Objekte", 0),
], width=700)

code("Dieselbe Klasse in Python", [
    "class Auto:",
    "    def __init__(self, marke, tueren):   # Konstruktor",
    "        self.marke = marke               # Attribute anlegen",
    "        self.tempo = 0",
    "        self.tueren = tueren",
    "",
    "    def beschleunigen(self, wert):",
    "        self.tempo = self.tempo + wert",
    "",
    "    def bremsen(self):",
    "        self.tempo = 0",
    "",
    "    def zeige(self):",
    "        print(f'{self.marke}: {self.tempo} km/h, {self.tueren} Tueren')",
], size=12)

code("Objekte erzeugen und benutzen", [
    "a1 = Auto('Fiat', 3)        # Objekt 1 - der Konstruktor laeuft",
    "a2 = Auto('Volvo', 5)       # Objekt 2 - voellig eigene Attribute",
    "",
    "a1.beschleunigen(50)",
    "a1.beschleunigen(30)",
    "a2.beschleunigen(120)",
    "",
    "a1.zeige()                  # Fiat: 80 km/h, 3 Tueren",
    "a2.zeige()                  # Volvo: 120 km/h, 5 Tueren",
    "",
    "a1.bremsen()",
    "a1.zeige()                  # Fiat: 0 km/h, 3 Tueren",
    "print(a2.tempo)             # 120 - Attribut direkt lesen",
], size=12.5)

d.table_top("Was in dem Code steckt", [
    ["Schreibweise", "heißt", "Bedeutung"],
    ["class Auto:", "Klassendefinition", "der Bauplan wird bekannt gemacht"],
    ["__init__", "Konstruktor", "läuft automatisch beim Erzeugen"],
    ["self", "das eigene Objekt", "unterscheidet a1 von a2"],
    ["self.marke = marke", "Attribut setzen", "der Wert gehört ab jetzt zum Objekt"],
    ["a1 = Auto('Fiat', 3)", "Instanziierung", "ein neues Objekt entsteht"],
    ["a1.beschleunigen(50)", "Botschaft senden", "das Objekt führt seine Methode aus"],
], [220, 200, 396], [
    ("**self** ist kein Zauberwort, sondern der **erste Parameter** jeder Methode — Python setzt ihn beim Aufruf selbst ein", 0),
], font_size=11, bold_cols=(0,), mono_cols=(0,))

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Modellieren", "Vom Text zur Klasse")

d.table_top("Rezept: Substantive und Verben unterstreichen", [
    ["im Aufgabentext", "wird zu", "Beispiel Bibliothek"],
    ["Substantiv (Ding)", "Klasse", "Buch, Leser, Ausleihe"],
    ["Eigenschaft davon", "Attribut", "titel, isbn, ausgeliehen"],
    ["Verb (Tätigkeit)", "Methode", "ausleihen(), zurueckgeben()"],
    ["konkretes Exemplar", "Objekt", "das Buch mit ISBN 978-3-…"],
], [220, 200, 396], [
    ("Erst **Substantive** markieren, dann prüfen: ist das ein eigenständiges Ding oder nur eine Eigenschaft?", 0),
    ("„Der Leser **leiht** ein Buch **aus**“ → Methode ausleihen() bei Buch **oder** bei Leser — beides begründbar", 0),
], font_size=11, bold_cols=(0,))

u2 = uml_diagram(P("uml-bibliothek.png"), {
    "buch": {"pos": (120, 30), "name": "Buch", "w": 440, "color": ORA,
             "attrs": ["titel", "isbn", "ausgeliehen"],
             "methods": ["ausleihen(leser)", "zurueckgeben()"]},
    "leser": {"pos": (900, 30), "name": "Leser", "w": 440, "color": GRN,
              "attrs": ["name", "nummer"],
              "methods": ["anzahl_buecher()"]},
}, [("buch", "leser", "assoc", "leiht aus")], W=1500, H=340,
   caption="Zwei Klassen und ihre Beziehung")
d.picture("Ein kleines Modell", u2, [
    ("Die **Linie** zwischen den Klassen ist eine **Assoziation** — hier: ein Leser leiht Bücher aus", 0),
    ("Das erinnert nicht zufällig an das **ER-Modell** aus Lernbereich 1: Entität und Klasse sind verwandt", 0),
], width=700)

code("Und in Python", [
    "class Buch:",
    "    def __init__(self, titel, isbn):",
    "        self.titel = titel",
    "        self.isbn = isbn",
    "        self.ausgeliehen = False",
    "",
    "    def ausleihen(self):",
    "        if self.ausgeliehen:",
    "            print('Schon ausgeliehen.')",
    "            return False",
    "        self.ausgeliehen = True",
    "        return True",
    "",
    "b = Buch('Der Prozess', '978-3-15-000001')",
    "print(b.ausleihen())    # True",
    "print(b.ausleihen())    # Schon ausgeliehen. / False",
], size=11.5)

d.merksatz("Die Klasse ist der Bauplan, das Objekt ist das gebaute Ding. "
           "Attribute sind, was es weiß — Methoden sind, was es kann.")

d.bullets("Fun Facts: OOP", [
    ("**Simula 67** aus Oslo war die erste objektorientierte Sprache — gebaut, um Warteschlangen zu simulieren", 0),
    ("**Alan Kay** prägte den Begriff „object-oriented“ und meinte damit vor allem das **Senden von Botschaften**", 0),
    ("**Smalltalk** (1972) machte alles zum Objekt — sogar die Zahl 3 und die Klasse selbst", 0),
    ("In Python ist wirklich **alles** ein Objekt: probiert einmal (3).bit_length() aus", 0),
    ("**self** heißt in Java und C++ **this** — dieselbe Idee, anderes Wort", 0),
])

d.bullets("Eure Aufgabe: die erste eigene Klasse", [
    ("Schreibt eine Klasse **Schueler** mit den Attributen name, klasse und einer Liste noten", 0),
    ("Methoden: **note_hinzufuegen(note)**, **schnitt()** und **zeige()**", 0),
    ("Erzeugt drei Objekte, tragt Noten ein und lasst euch alle Schnitte ausgeben", 0),
    ("Zeichnet vorher das **UML-Klassendiagramm** — Name, Attribute, Methoden", 0),
    ("Zusatz: eine Klasse **Konto** mit einzahlen(), abheben() — und Abheben nur, wenn Deckung da ist", 0),
])

d.save()
