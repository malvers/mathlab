#!/usr/bin/env python3
"""Wahlbereich OOP II: Vererbung, Kapselung, Polymorphie (Woche 21)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, py_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from uml_diagrams import uml_diagram, ORA, RD, GRN

d = Deck("oop2-vererbung.pptx")
P = lambda n: os.path.join(IMG, n)
code = lambda t, ls, **kw: d.code(t, [py_parts(l) for l in ls], **kw)

d.title("Informatik — FOS 12", "Objektorientierte Programmierung II",
        "Vererbung, Kapselung, Polymorphie — und wann sich das alles lohnt")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Vererbung", "Das Gemeinsame nur einmal aufschreiben")

d.bullets("Das Problem, das die Vererbung löst", [
    ("Schüler und Lehrkräfte haben **beide** name, vorname, geburtsdatum und eine Methode zeige()", 0),
    ("Zweimal dieselbe Klasse schreiben heißt: jede Änderung **zweimal** nachziehen", 0),
    ("**Vererbung**: das Gemeinsame kommt in eine **Oberklasse**, das Besondere in die **Unterklassen**", 0),
    ("Die Unterklasse **erbt** alle Attribute und Methoden und darf **ergänzen** oder **überschreiben**", 0),
    ("Der Test dafür heißt **ist-ein**: Ein Schüler **ist eine** Person. Ein Auto ist **kein** Motor", 0),
])

u1 = uml_diagram(P("uml-person.png"), {
    "p": {"pos": (540, 20), "name": "Person", "w": 480, "color": ORA,
          "attrs": ["name", "vorname"], "methods": ["zeige()"]},
    "s": {"pos": (100, 400), "name": "Schueler", "w": 480, "color": GRN,
          "attrs": ["klasse", "noten"], "methods": ["schnitt()", "zeige()"]},
    "l": {"pos": (980, 400), "name": "Lehrkraft", "w": 480, "color": RD,
          "attrs": ["faecher", "kuerzel"], "methods": ["zeige()"]},
}, [("s", "p", "inherit"), ("l", "p", "inherit")], W=1580, H=700,
   caption="Der leere Pfeil zeigt immer zur Oberklasse")
d.picture("Ein Klassenbaum", u1, [
    ("**zeige()** steht dreimal da: die Unterklassen **überschreiben** die geerbte Methode", 0),
    ("Alles andere aus Person gilt in beiden Unterklassen, ohne dass es dort steht", 0),
], width=610)

code("Vererbung in Python", [
    "class Person:",
    "    def __init__(self, name, vorname):",
    "        self.name = name",
    "        self.vorname = vorname",
    "",
    "    def zeige(self):",
    "        print(f'{self.vorname} {self.name}')",
    "",
    "",
    "class Schueler(Person):              # Schueler erbt von Person",
    "    def __init__(self, name, vorname, klasse):",
    "        super().__init__(name, vorname)   # Konstruktor der Oberklasse",
    "        self.klasse = klasse",
    "        self.noten = []",
    "",
    "    def zeige(self):                 # ueberschreibt die geerbte Methode",
    "        print(f'{self.vorname} {self.name} ({self.klasse})')",
], size=11)

d.table_top("Die Fachbegriffe der Vererbung", [
    ["Begriff", "im Beispiel", "bedeutet"],
    ["Oberklasse (Basisklasse)", "Person", "das Allgemeine, wird vererbt"],
    ["Unterklasse (abgeleitet)", "Schueler(Person)", "erbt alles und ergänzt"],
    ["Erben", "self.name ist da, ohne dass es dasteht", "Attribute und Methoden gelten weiter"],
    ["Überschreiben", "zeige() erneut definieren", "die eigene Fassung gewinnt"],
    ["super()", "super().__init__(...)", "ruft die Oberklasse auf"],
], [230, 270, 316], [
    ("Beim Aufruf sucht Python die Methode **erst in der Unterklasse**, dann in der Oberklasse", 0),
    ("Vererbung erst einsetzen, wenn der **ist-ein**-Test wirklich stimmt", 0),
], font_size=11, bold_cols=(0,), mono_cols=(1,))

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Kapselung", "Das Objekt bewacht seine eigenen Daten")

d.bullets("Warum Attribute nicht offen herumliegen sollten", [
    ("Von außen **direkt** schreiben heißt: jede Regel lässt sich umgehen", 0),
    ("konto.kontostand = 1000000 — und die Prüfung im abheben() war umsonst", 0),
    ("**Kapselung**: Daten nach innen, Zugriff nur über **Methoden**, die die Regeln kennen", 0),
    ("Python markiert Nichtöffentliches mit einem **Unterstrich**: self._kontostand", 0),
    ("Das ist eine **Vereinbarung**, kein Schloss — in Java gäbe es dafür **private**", 0),
])

code("Ein Konto, das sich wehrt", [
    "class Konto:",
    "    def __init__(self, inhaber, start=0):",
    "        self.inhaber = inhaber",
    "        self._stand = start          # nicht oeffentlich",
    "",
    "    def einzahlen(self, betrag):",
    "        if betrag > 0:",
    "            self._stand = self._stand + betrag",
    "",
    "    def abheben(self, betrag):",
    "        if betrag > self._stand:",
    "            print('Nicht gedeckt')",
    "            return False",
    "        self._stand = self._stand - betrag",
    "        return True",
    "",
    "    def stand(self):                 # lesender Zugriff (Getter)",
    "        return self._stand",
], size=10.5)

d.table_top("Was die Kapselung bringt", [
    ["Ohne Kapselung", "Mit Kapselung"],
    ["konto.stand = -500 ist möglich", "abheben() lehnt ab, der Stand bleibt gültig"],
    ["jede Stelle im Programm darf ändern", "eine Stelle im Programm ändert"],
    ["Regeländerung an 20 Stellen nachziehen", "Regeländerung in einer Methode"],
    ["Fehlersuche überall", "Fehlersuche in der Klasse"],
], [390, 426], [
    ("Fachwort: die Klasse hat eine **Schnittstelle** (die öffentlichen Methoden) und eine **Implementierung** (das Innere)", 0),
    ("Von außen zählt nur die Schnittstelle — das Innere darf sich jederzeit ändern", 0),
], font_size=11.5, marks={(r, 0): TINT_RED for r in range(1, 5)} |
   {(r, 1): TINT_GREEN for r in range(1, 5)})

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Polymorphie", "Ein Aufruf, viele Antworten")

code("Derselbe Aufruf, verschiedenes Verhalten", [
    "leute = [",
    "    Schueler('Krause', 'Lena', 'FO12a'),",
    "    Lehrkraft('Alvers', 'Michael', 'INF'),",
    "    Person('Vogel', 'Tim'),",
    "]",
    "",
    "for p in leute:",
    "    p.zeige()          # jedes Objekt antwortet auf seine Art",
    "",
    "# Lena Krause (FO12a)",
    "# Michael Alvers [INF]",
    "# Tim Vogel",
], size=13)

d.bullets("Was daran bemerkenswert ist", [
    ("Die Schleife kennt die **Klassen gar nicht** — sie sendet nur die Botschaft **zeige()**", 0),
    ("Jedes Objekt entscheidet **selbst**, welche Methode das ist: **Polymorphie** (Vielgestaltigkeit)", 0),
    ("Eine neue Klasse **Hausmeister(Person)** läuft mit, **ohne** dass die Schleife geändert wird", 0),
    ("Das ist der eigentliche Gewinn der OOP: **Erweitern ohne Ändern**", 0),
    ("Voraussetzung: alle Klassen bieten dieselbe **Schnittstelle** an — hier die Methode zeige()", 0),
])

d.table_top("Die vier Säulen im Überblick", [
    ["Säule", "Frage", "Werkzeug", "Beispiel"],
    ["Abstraktion", "Was ist wesentlich?", "Klasse entwerfen", "Person hat name, nicht Schuhgröße"],
    ["Kapselung", "Wer darf ändern?", "_attribut + Methoden", "abheben() prüft die Deckung"],
    ["Vererbung", "Was ist gemeinsam?", "class B(A)", "Schueler ist eine Person"],
    ["Polymorphie", "Wer antwortet wie?", "Methode überschreiben", "jedes zeige() ist anders"],
], [150, 200, 210, 256], [
    ("In der Klausur: Begriff **nennen**, in eigenen Worten **erklären**, am Beispiel **zeigen**", 0),
], font_size=11, bold_cols=(0,), mono_cols=(2,))

# ---------------------------------------------------------------- Kapitel 04
d.chapter(4, "Wann lohnt es sich?", "Modularisierung und OOP im Vergleich")

d.table_top("Zwei Wege, ein Programm zu ordnen", [
    ["", "Modularisierung (LB 2)", "Objektorientierung"],
    ["ordnet", "Abläufe in Funktionen", "Dinge in Klassen"],
    ["Zustand", "in Variablen des Hauptprogramms", "im Objekt selbst"],
    ["Erweitern", "Funktion ergänzen", "Klasse ableiten"],
    ["Aufwand am Anfang", "gering", "höher — man muss modellieren"],
    ["Gewinn", "bei mittleren Programmen", "bei vielen gleichartigen Dingen"],
], [190, 300, 326], [
    ("Faustregel: **ein Ablauf** → Funktionen. **Viele Dinge mit eigenem Zustand** → Klassen", 0),
    ("Für ein 30-Zeilen-Programm ist eine Klasse **Ballast** — Ehrlichkeit gehört zur Bewertung", 0),
], font_size=11.5, bold_cols=(0,),
   marks={(4, 1): TINT_GREEN, (4, 2): TINT_ORANGE, (5, 2): TINT_GREEN})

d.bullets("Positioniert euch — mit Begründung", [
    ("Wie würdet ihr **eine** Berechnung des Bremswegs schreiben — Funktion oder Klasse?", 0),
    ("Und eine **Schulverwaltung** mit 600 Personen, Kursen und Noten?", 0),
    ("Ein **Spiel** mit 30 Gegnern, die alle etwas anderes können?", 0),
    ("Argumentiert mit **Zustand**, **Anzahl** und **Erweiterbarkeit** — nicht mit „ist moderner“", 0),
    ("Das ist genau die Art Frage, die in der Klausur als **Bewertung** gestellt wird", 0),
])

d.merksatz("Vererbung spart Schreibarbeit, Kapselung schützt die Daten, "
           "Polymorphie macht Erweitern möglich, ohne Bestehendes anzufassen.")

d.bullets("Fun Facts: die drei Prinzipien", [
    ("**Barbara Liskov** formulierte 1987, wann eine Unterklasse ihre Oberklasse wirklich ersetzen darf — das **Liskovsche Substitutionsprinzip**", 0),
    ("Ein berühmtes Gegenbeispiel: **Quadrat erbt von Rechteck** — klingt richtig, geht schief, sobald man die Breite ändert", 0),
    ("**Mehrfachvererbung** kann Python, Java nicht — wegen des **Diamantproblems**: von wem erbt man dann?", 0),
    ("Polymorphie heißt auf Griechisch schlicht **Vielgestaltigkeit** und stammt aus der Biologie", 0),
    ("Alan Kay sagte später, er habe bei OOP „**an Botschaften gedacht, nicht an Klassen**“", 0),
])

d.bullets("Eure Aufgabe: der Klassenbaum", [
    ("Baut die Klassen **Person**, **Schueler** und **Lehrkraft** wie im UML-Diagramm oben", 0),
    ("**Schueler** bekommt noten und schnitt(), **Lehrkraft** eine Liste faecher", 0),
    ("Beide überschreiben **zeige()** — testet die Polymorphie mit einer gemischten Liste", 0),
    ("Kapselt die Noten: Eintragen nur über **note_hinzufuegen()**, das Werte außerhalb 1–6 abweist", 0),
    ("Schreibt drei Sätze: **Wann** würdet ihr in diesem Programm ohne OOP arbeiten — und warum?", 0),
])

d.save()
