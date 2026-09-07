#!/usr/bin/env python3
"""Informatik 9 (Oberschule), Woche 12 / KW 47: Operationen III - Auswerten und
Zusammenfassen (LB 1, Ustd. 10/13)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("operationen-auswerten.pptx")

d.title("Informatik — Klasse 9", "Aus vielen Zeilen eine Zahl",
        "Zählen, summieren, mitteln — die Datenbank rechnet für euch")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Zusammenfassen", "Nicht alle Zeilen, sondern das Ergebnis")

d.bullets("Bisher und ab heute", [
    ("Bisher habt ihr **Zeilen** herausgesucht: sortiert und gefiltert", 0),
    ("Heute kommt **eine Zahl** heraus, die viele Zeilen zusammenfasst", 0),
    ("„Wie viele Spiele habe ich?“ — eine Zahl statt einer Liste", 0),
    ("Solche Rechnungen heißen **Auswertungen** oder **Aggregatfunktionen**", 0),
    ("Der Rechner macht das über **Millionen** Zeilen genauso schnell", 0),
])

d.table_top("Die vier Auswertungen, die ihr braucht", [
    ["Auswertung", "beantwortet", "in SQL"],
    ["Anzahl", "Wie viele Zeilen sind es?", "COUNT"],
    ["Summe", "Was kosten alle zusammen?", "SUM"],
    ["Durchschnitt", "Was kostet ein Spiel im Mittel?", "AVG"],
    ["Größter / kleinster Wert", "Welches ist das älteste Spiel?", "MAX / MIN"],
], [230, 380, 206], [
    ("**Anzahl** geht mit jedem Feld — die anderen drei brauchen **Zahlen**", 0),
    ("Über eine Textspalte kann man keine Summe bilden", 0),
], font_size=11.5, bold_cols=(0,), mono_cols=(2,))

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Filtern und rechnen", "Die Kombination macht es nützlich")

d.table_top("Erst filtern, dann rechnen", [
    ["Frage", "Filter", "Auswertung"],
    ["Wie viele Spiele habe ich?", "keiner", "Anzahl"],
    ["Wie viele davon von Kosmos?", "Verlag = Kosmos", "Anzahl"],
    ["Was kosten die Kosmos-Spiele?", "Verlag = Kosmos", "Summe über Preis"],
    ["Wie alt ist mein ältestes Spiel?", "keiner", "kleinstes Jahr"],
    ["Durchschnittspreis ab 2015?", "Jahr >= 2015", "Durchschnitt über Preis"],
], [290, 250, 276], [
    ("Immer in dieser Reihenfolge: **erst die Zeilen auswählen, dann rechnen**", 0),
    ("Ein anderer Filter gibt eine andere Zahl — die Zahl allein sagt also wenig", 0),
], font_size=11, bold_cols=(0,))

d.table_top("Gruppieren: eine Zahl je Gruppe", [
    ["Verlag", "Anzahl Spiele", "Summe Preis"],
    ["Kosmos", "3", "89,85 €"],
    ["Hans im Glück", "1", "34,95 €"],
    ["Next Move", "1", "39,95 €"],
    ["gesamt", "5", "164,75 €"],
], [300, 260, 256], [
    ("Statt **einer** Zahl für alles bekommt ihr **eine Zahl je Verlag**", 0),
    ("In SQL heißt das **GROUP BY** — im Programm klickt ihr „gruppieren nach“", 0),
], font_size=11.5, bold_cols=(0,), marks={(4, c): TINT_GREEN for c in range(3)})

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Eigene Fragen", "Die Kunst ist die Frage, nicht der Klick")

d.bullets("Wie man eine gute Frage an eine Datenbank stellt", [
    ("**Welche Zeilen** interessieren mich? Das ist der Filter", 0),
    ("**Was will ich wissen** — eine Liste oder eine Zahl?", 0),
    ("**Welches Feld** wird gerechnet?", 0),
    ("**Erwarte ich ungefähr was?** Wer keine Erwartung hat, merkt keinen Fehler", 0),
    ("Zum Schluss: **ist das Ergebnis plausibel?** Darum geht es nächste Woche", 0),
])

d.merksatz("Erst filtern, dann rechnen. Und jede Zahl gilt nur für den Filter, "
           "aus dem sie stammt.")

d.bullets("Fun Facts: Auswerten", [
    ("**COUNT(*)** zählt Zeilen — auch die, in denen fast alles leer ist", 0),
    ("Leere Felder (**NULL**) zählen bei Summe und Durchschnitt **nicht mit**", 0),
    ("Deshalb kann ein Durchschnitt über 100 Zeilen aus nur 40 Werten stammen", 0),
    ("Bei **SQL-Island** rettet ihr euch mit Abfragen von einer Insel — zum Ausprobieren", 0),
    ("Der Durchschnitt ist der am leichtesten missbrauchte Wert der Statistik", 0),
])

d.bullets("Eure Aufgabe am Rechner", [
    ("**Zählt** alle Datensätze eurer Tabelle", 0),
    ("**Summiert** die Preisspalte — und prüft die Zahl grob im Kopf", 0),
    ("Bildet den **Durchschnittspreis**, einmal für alle und einmal nur ab 2015", 0),
    ("Findet das **älteste** und das **neueste** Spiel", 0),
    ("Stellt euch **drei eigene Fragen**, beantwortet sie und schreibt Frage und Zahl auf", 0),
])

d.save()
