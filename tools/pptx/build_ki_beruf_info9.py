#!/usr/bin/env python3
"""Informatik 9 (Oberschule), Woche 42 / KW 24: Exkurs - KI aktuell und
Berufsorientierung."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("ki-und-berufe.pptx")

d.title("Informatik — Klasse 9", "KI heute und Berufe morgen",
        "Eine aktuelle Meldung einordnen — und ein Blick auf Wege mit Informatik")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Eine Meldung einordnen", "Vier Fragen, immer dieselben")

d.table_top("So prüft man eine KI-Schlagzeile", [
    ["Frage", "worauf sie zielt"],
    ["Wer sagt das?", "Firma, Forschung oder Zeitung — wer hat welches Interesse?"],
    ["Was genau kann es?", "eine eng umrissene Aufgabe, nicht „alles“"],
    ["Woran wurde es gemessen?", "welcher Test, welche Vergleichsgruppe?"],
    ["Was ist der Haken?", "Kosten, Fehlerquote, Daten, Energie"],
], [250, 566], [
    ("Fast jede Schlagzeile wird kleiner, sobald man Frage 2 und 3 beantwortet", 0),
    ("Das ist keine Miesmacherei — es ist genau das, was wir bei Auswertungen gelernt haben", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Was ihr über KI aus diesem Jahr wisst", [
    ("Ein gelerntes Modell kennt **keine Regeln**, nur Muster aus Beispielen", 0),
    ("Es ist genau so gut wie seine **Trainingsdaten** — Schieflagen wandern mit", 0),
    ("Es antwortet **immer** und nennt nie von selbst seine Grenzen", 0),
    ("Es kann **Vorschläge** machen, aber keine **Verantwortung** übernehmen", 0),
    ("Und: die Regel, wo es eingesetzt wird, macht ein **Mensch**", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Berufe mit Informatik", "Mehr als Programmieren")

d.table_top("Wege, die es wirklich gibt", [
    ["Weg", "was man da macht", "wie man hinkommt"],
    ["Fachinformatik", "Systeme betreuen oder Anwendungen bauen", "Ausbildung, 3 Jahre"],
    ["IT-Systemelektronik", "Netze und Geräte aufbauen und warten", "Ausbildung, 3,5 Jahre"],
    ["Mediengestaltung digital", "Gestalten für Bildschirm und Web", "Ausbildung, 3 Jahre"],
    ["Technische Assistenz", "Messen, Auswerten, Labor", "Fachschule"],
    ["Studium Informatik", "Entwickeln und Forschen", "über FOS oder Abitur"],
], [200, 350, 266], [
    ("Fast alle Wege gehen **auch ohne Abitur** los — über die Ausbildung oder die FOS", 0),
    ("Und: in jedem dieser Berufe zählt, was ihr dieses Jahr geübt habt — **zerlegen und prüfen**", 0),
], font_size=10.5, bold_cols=(0,))

d.bullets("Was in diesen Berufen wirklich verlangt wird", [
    ("**Genau lesen** — die Hälfte aller Fehler entsteht beim Überfliegen", 0),
    ("**Ordentlich dokumentieren** — sonst versteht es morgen niemand mehr", 0),
    ("**Im Team reden** — der Engpass ist fast nie die Technik", 0),
    ("**Neugierig bleiben** — was ihr gelernt habt, ist in fünf Jahren zur Hälfte anders", 0),
    ("**Mathematik** braucht man weniger, als alle behaupten — Logik dafür umso mehr", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Der nächste Schritt", "Was ihr jetzt tun könnt")

d.bullets("Konkret und ohne Aufwand", [
    ("Ein **Praktikum** in einem IT-Bereich — auch in einer Firma, die nichts mit IT zu tun hat", 0),
    ("Eine **kleine eigene Sache** bauen und fertig machen. Fertig ist das Wichtige", 0),
    ("Bei der **Berufsberatung** nachfragen, welche Betriebe in der Nähe ausbilden", 0),
    ("In Klasse 10 die **Wahlmöglichkeiten** anschauen, die es an der Schule gibt", 0),
    ("Und: aufschreiben, was euch dieses Jahr am meisten **Spaß** gemacht hat", 0),
])

d.merksatz("Kein Beruf verlangt, dass man alles kann. Verlangt wird, "
           "dass man ein Problem zerlegen und ehrlich prüfen kann.")

d.bullets("Fun Facts: Berufe und KI", [
    ("Der Beruf **Fachinformatiker** existiert erst seit 1997", 0),
    ("**Programmieren** war in den 1950er Jahren überwiegend Frauenarbeit — es galt als Fleißarbeit", 0),
    ("Die Berufsbezeichnung **Data Steward** — jemand, der Datenqualität pflegt — gibt es erst seit wenigen Jahren", 0),
    ("Der Bedarf an IT-Fachkräften ist in Deutschland seit Jahren **größer** als das Angebot", 0),
    ("Und: die meisten IT-Leute haben **nicht** Informatik studiert", 0),
])

d.bullets("Eure Aufgabe heute", [
    ("Bringt eine **aktuelle KI-Meldung** mit — Handy ist erlaubt", 0),
    ("Prüft sie zu zweit mit den **vier Fragen** aus Kapitel 1", 0),
    ("Schreibt auf: **Was kann es wirklich, und was ist der Haken?**", 0),
    ("Sucht **einen** Beruf aus der Tabelle und findet drei Angaben dazu heraus", 0),
    ("Zum Schluss: eine Frage an die Fragerunde aufschreiben", 0),
])

d.save()
