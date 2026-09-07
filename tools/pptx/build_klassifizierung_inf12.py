#!/usr/bin/env python3
"""Informatik 12 (BGY), Woche 33 / KW 16: Klassifizierung von Programmiersprachen -
imperativ und deklarativ (LB 3, Ustd. 3-4/24)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, py_parts, sql_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("sprachen-imperativ-deklarativ.pptx")
code = lambda t, ls, **kw: d.code(t, [py_parts(l) for l in ls], **kw)
sql = lambda t, ls, **kw: d.code(t, [sql_parts(l) for l in ls], **kw)

d.title("Informatik — Grundkurs 12", "Wie, oder was?",
        "Imperative und deklarative Sprachen — an Python, SQL und HTML")

d.chapter(1, "Die Unterscheidung", "Der Weg oder das Ziel")

d.table_top("Zwei Paradigmen", [
    ["", "imperativ", "deklarativ"],
    ["beschreibt", "den Weg: Schritt für Schritt", "das Ziel: was herauskommen soll"],
    ["Schlüsselfrage", "Wie?", "Was?"],
    ["Zustand", "Variablen ändern sich", "meist kein veränderlicher Zustand"],
    ["Beispiele", "Python, Java, C", "SQL, HTML, CSS, Prolog"],
    ["Ausführung", "in der geschriebenen Reihenfolge", "ein System sucht den Weg"],
], [180, 320, 316], [
    ("Der Unterschied ist nicht die Sprache, sondern die **Art der Beschreibung**", 0),
    ("Viele Sprachen können beides — die Einordnung meint den **Schwerpunkt**", 0),
], font_size=10.5, bold_cols=(0,),
   marks={(1, 1): TINT_BLUE, (1, 2): TINT_ORANGE})

code("Imperativ: der Weg wird beschrieben", [
    "noten = [2, 1, 3, 2, 4]",
    "summe = 0",
    "anzahl = 0",
    "",
    "for n in noten:              # Schritt fuer Schritt",
    "    summe = summe + n",
    "    anzahl = anzahl + 1",
    "",
    "print(summe / anzahl)",
], size=13.5)

sql("Deklarativ: nur das Ziel", [
    "SELECT AVG(note) FROM Belegung;",
    "",
    "-- Kein Schleifenkopf, keine Zaehlvariable.",
    "-- Wie gerechnet wird, entscheidet das DBMS.",
], size=14)

d.chapter(2, "Weitere Paradigmen", "Was die Einteilung noch kennt")

d.table_top("Die gebräuchliche Einteilung", [
    ["Paradigma", "Kern", "Beispiel"],
    ["prozedural (imperativ)", "Anweisungen in Prozeduren gebündelt", "C, Pascal"],
    ["objektorientiert (imperativ)", "Daten und Verhalten in Objekten", "Java, Python"],
    ["funktional (deklarativ)", "Berechnung als Auswertung von Funktionen", "Haskell, Lisp"],
    ["logisch (deklarativ)", "Fakten und Regeln, das System schließt", "Prolog"],
    ["Abfragesprache (deklarativ)", "Ergebnismenge beschreiben", "SQL"],
], [230, 330, 256], [
    ("**Objektorientiert** ist eine Spielart des Imperativen — auch dort ändern sich Zustände", 0),
    ("Moderne Sprachen sind **Mehrzwecksprachen** und mischen die Paradigmen", 0),
], font_size=10.5, bold_cols=(0,))

d.bullets("Was das praktisch bedeutet", [
    ("**Deklarativ** ist kürzer und schwerer zu optimieren — das übernimmt das System", 0),
    ("**Imperativ** gibt Kontrolle über jeden Schritt — und die Verantwortung dafür", 0),
    ("Bei SQL kann man den Weg **nicht** vorgeben — nur die Frage besser stellen", 0),
    ("Bei Python muss man jeden Schritt hinschreiben — auch die Fehler", 0),
    ("Deshalb: **deklarativ, wo es geht; imperativ, wo es sein muss**", 0),
])

d.chapter(3, "Die Zuordnungsübung", "Codeschnipsel einsortieren")

d.table_top("Schnipsel und Einordnung", [
    ["Schnipsel", "Sprache", "Paradigma"],
    ["for i in range(10): print(i)", "Python", "imperativ"],
    ["SELECT name FROM Kunde WHERE ort='DD'", "SQL", "deklarativ"],
    ["<ul><li>Punkt</li></ul>", "HTML", "deklarativ"],
    ["public class Auto { … }", "Java", "objektorientiert"],
    ["vater(anna, ben).", "Prolog", "logisch, deklarativ"],
    ["p { color: red; }", "CSS", "deklarativ"],
], [340, 200, 276], [
    ("Die Probe: steht dort ein **Ablauf** oder eine **Beschreibung**?", 0),
    ("HTML und CSS sind streng genommen keine Programmiersprachen — aber deklarativ allemal", 0),
], font_size=10.5, bold_cols=(0,), mono_cols=(0,))

d.merksatz("Imperativ beschreibt den Weg, deklarativ das Ziel. "
           "Wer das Ziel beschreiben kann, überlässt den Weg der Maschine.")

d.bullets("Fun Facts: Paradigmen", [
    ("**Prolog** entstand 1972 in Marseille — man beschreibt Fakten, das System schließt daraus", 0),
    ("**SQL** ist die erfolgreichste deklarative Sprache überhaupt", 0),
    ("**Funktionale** Ideen sind längst in Python und Java angekommen: map, filter, Lambda", 0),
    ("Der Streit „welches Paradigma ist besser“ ist so alt wie die Informatik", 0),
    ("Die brauchbare Antwort lautet seit Jahrzehnten: **kommt auf die Aufgabe an**", 0),
])

d.bullets("Eure Aufgabe", [
    ("Ordnet **zehn Codeschnipsel** vom Arbeitsblatt Sprache und Paradigma zu", 0),
    ("Begründet je Zuordnung in **einem Satz** — Ablauf oder Beschreibung?", 0),
    ("Formuliert dieselbe Aufgabe einmal **imperativ** (Python) und einmal **deklarativ** (SQL)", 0),
    ("Vergleicht die Länge und benennt, **was das DBMS für euch übernimmt**", 0),
    ("Findet ein Beispiel, bei dem **deklarativ nicht geht** — und erklärt warum", 0),
])

d.save()
