#!/usr/bin/env python3
"""Informatik 12 (BGY), Woche 12 / KW 47: Alternative Modellierung -
Klassen-Objekte-Attribute-Methoden (LB 1, Ustd. 19-20/22)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from uml_diagrams import uml_diagram

d = Deck("klassen-objekte-modell.pptx")
P = lambda n: os.path.join(IMG, n)
ORA = (245, 194, 66)

d.title("Informatik — Grundkurs 12", "Die objektorientierte Sicht",
        "Klassen, Objekte, Attribute, Methoden — und wann man sie der Prozesskette vorzieht")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Ein anderer Blick", "Nicht der Ablauf, sondern die Dinge")

d.bullets("Zwei Sichten auf dasselbe Unternehmen", [
    ("Die **Prozesssicht** fragt: In welcher Reihenfolge passiert was?", 0),
    ("Die **Objektsicht** fragt: Welche Dinge gibt es, und was können sie?", 0),
    ("Beide beschreiben dieselbe Wirklichkeit — mit **verschiedenem Zweck**", 0),
    ("Die Prozesskette endet an der Systemgrenze. Das Objektmodell **geht in die Software hinein**", 0),
    ("Deshalb ist das Objektmodell der übliche Schritt **vor** der Programmierung", 0),
])

d.table_top("Die vier Begriffe", [
    ["Begriff", "ist", "Beispiel"],
    ["Klasse", "der Bauplan für gleichartige Dinge", "Bestellung"],
    ["Objekt", "ein einzelnes Ding nach diesem Bauplan", "Bestellung Nr. 4711"],
    ["Attribut", "ein Merkmal der Klasse", "datum, status, summe"],
    ["Methode", "eine Fähigkeit der Klasse", "pruefen(), stornieren()"],
], [160, 350, 306], [
    ("Der Unterschied zum Datenmodell: die **Methoden** — Daten und Verhalten gehören zusammen", 0),
    ("Ein Objekt kennt seine Daten **und** weiß, was man mit ihm tun darf", 0),
], font_size=11, bold_cols=(0,), marks={(4, 0): TINT_ORANGE})

u1 = uml_diagram(P("uml-bestellung-inf12.png"), {
    "b": {"pos": (120, 40), "name": "Bestellung", "w": 460, "color": ORA,
          "attrs": ["nummer", "datum", "status", "summe"],
          "methods": ["pruefen()", "stornieren()", "summeBerechnen()"]},
    "k": {"pos": (760, 40), "name": "Kunde", "w": 420,
          "attrs": ["kundennummer", "name", "adresse"],
          "methods": ["adresseAendern()"]},
}, [("b", "k", "assoc", "gehoert zu")], W=1400, H=380,
    caption="Zwei Klassen und ihre Beziehung")
d.picture("Ein kleines Klassendiagramm", u1, [
    ("Drei Fächer je Klasse: **Name**, **Attribute**, **Methoden**", 0),
    ("Die Linie ist eine **Assoziation** — eine Beziehung zwischen den Klassen", 0),
], width=740)

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Vom Prozess zum Objektmodell", "Wie man es herleitet")

d.table_top("Die Übersetzungsregeln", [
    ["Im Prozessmodell", "wird im Objektmodell zu"],
    ["Substantive im Prozesstext", "Kandidaten für Klassen"],
    ["Angaben, die erfasst werden", "Attribute"],
    ["Funktionen der eEPK", "Methoden — an der Klasse, die es betrifft"],
    ["Organisationseinheiten", "eigene Klassen oder Rollen"],
    ["Informationsobjekte", "Klassen oder Attribute, je nach Bedeutung"],
], [330, 486], [
    ("Die **Substantiv-Methode** ist ein Startpunkt, kein Automatismus: nicht jedes Substantiv wird eine Klasse", 0),
    ("Prüffrage: Hat das Ding **eigene Merkmale** und einen **eigenen Lebenslauf**? Dann Klasse", 0),
], font_size=11, bold_cols=(0,))

d.bullets("An unserem Bestellprozess durchgespielt", [
    ("Substantive: Bestellung, Kunde, Ware, Rechnung, Lager, Vertrieb", 0),
    ("**Klassen**: Bestellung, Kunde, Ware, Rechnung — alle haben eigene Merkmale", 0),
    ("**Keine Klasse**: „Prüfung“ — das ist eine **Methode** von Bestellung", 0),
    ("**Attribute** von Bestellung: nummer, datum, status, summe", 0),
    ("**Methoden**: pruefen(), stornieren() — aus den Funktionen der eEPK", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Wann was?", "Sich begründet positionieren")

d.table_top("Prozesskette oder Objektmodell?", [
    ["Frage im Vordergrund", "besser geeignet"],
    ["In welcher Reihenfolge läuft es ab?", "Prozesskette (eEPK, BPMN)"],
    ["Wer arbeitet mit wem zusammen?", "BPMN mit Pools und Lanes"],
    ["Welche Daten und Fähigkeiten gibt es?", "Klassendiagramm"],
    ["Was soll die Software können?", "Klassendiagramm"],
    ["Wo sind Wartezeiten und Doppelarbeit?", "Prozesskette"],
], [400, 416], [
    ("In der Praxis werden **beide** gebraucht — nacheinander, nicht statt einander", 0),
    ("Erst der Prozess (was passiert), dann die Objekte (womit passiert es)", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 1): TINT_BLUE, (2, 1): TINT_BLUE, (5, 1): TINT_BLUE} |
         {(3, 1): TINT_ORANGE, (4, 1): TINT_ORANGE})

d.merksatz("Die Prozesskette beschreibt den Ablauf, das Klassendiagramm die Dinge. "
           "Wer Software bauen will, braucht am Ende beides.")

d.bullets("Fun Facts: Objektorientierung", [
    ("Die Idee stammt aus **Simula 67** — entwickelt in Oslo für Simulationen", 0),
    ("**UML** entstand 1997 als Vereinigung dreier konkurrierender Notationen", 0),
    ("Die drei Urheber Booch, Rumbaugh und Jacobson heißen bis heute **die drei Amigos**", 0),
    ("UML kennt **14 Diagrammarten** — das Klassendiagramm ist die mit Abstand häufigste", 0),
    ("**Alan Kay**, Erfinder von Smalltalk: „Objektorientierung heißt für mich Nachrichten, nicht Klassen“", 0),
])

d.bullets("Eure Aufgabe: dasselbe als Objektmodell", [
    ("Nehmt euren Prozess und markiert alle **Substantive** im Text", 0),
    ("Prüft je Substantiv: eigene Merkmale und eigener Lebenslauf? Dann **Klasse**", 0),
    ("Zeichnet **drei bis fünf Klassen** mit Attributen und Methoden", 0),
    ("Verbindet sie mit **Assoziationen** und beschriftet die Linien", 0),
    ("Schreibt drei Sätze: **Welche Frage beantwortet euer Objektmodell besser als die eEPK?**", 0),
])

d.save()
