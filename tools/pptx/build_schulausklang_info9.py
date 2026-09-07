#!/usr/bin/env python3
"""Informatik 9 (Oberschule), Woche 45 / KW 27: Ausklang - aufraeumen und
Denkspiele zum Abschluss."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("ausklang-denkspiele.pptx")

d.title("Informatik — Klasse 9", "Aufräumen und knobeln",
        "Accounts und Abgaben ordnen — und zum Schluss Logikspiele")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Aufräumen", "Zehn Minuten, die sich lohnen")

d.table_top("Die Aufräumliste", [
    ["Was", "warum"],
    ["Abgaben vollständig hochgeladen", "sonst fehlt etwas in der Bewertung"],
    ["Alte Zwischenstände löschen", "nur die Abgabefassung und v1 behalten"],
    ["Eigene Dateien vom Schulrechner", "der Rechner wird in den Ferien zurückgesetzt"],
    ["Passwörter, die ihr nicht mehr braucht", "Konten schließen, nicht liegen lassen"],
    ["Cloud-Ordner aufräumen", "Freigaben zurücknehmen, die niemand mehr braucht"],
], [330, 486], [
    ("Der letzte Punkt ist Datenschutz in eigener Sache — **Freigaben laufen nicht von selbst ab**", 0),
], font_size=11.5, bold_cols=(0,), marks={(5, 0): TINT_ORANGE})

d.bullets("Was ihr behalten solltet", [
    ("Euer **Projekt** — auch in fünf Jahren noch ein gutes Beispiel für eine Bewerbung", 0),
    ("Die **Dokumentation** dazu, sie erklärt, was ihr gemacht habt", 0),
    ("Eure **Datenbank** aus LB 1, falls ihr in Klasse 10 daran anknüpfen wollt", 0),
    ("Und die **Lückenliste** aus dem Jahresquiz — die ist im Herbst noch nützlich", 0),
    ("Alles andere darf weg", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Drei Knobeleien", "Logik, wie sie Informatiker mögen")

d.table_top("Rätsel 1: das Wiegeproblem", [
    ["Angabe", "Wert"],
    ["Münzen", "9 gleich aussehende"],
    ["Besonderheit", "eine ist leichter als die anderen"],
    ["Werkzeug", "eine Balkenwaage"],
    ["Frage", "wie findet ihr die leichte mit nur zwei Wägungen?"],
], [280, 536], [
    ("Tipp: teilt nicht in zwei Hälften, sondern in **drei** Gruppen", 0),
    ("Das ist dasselbe Prinzip wie das **Halbieren** bei der Fehlersuche — nur mit drei", 0),
], font_size=12, bold_cols=(0,))

d.bullets("Rätsel 2: die Flussüberquerung", [
    ("Ein Bauer, ein Wolf, eine Ziege und ein Kohlkopf wollen über den Fluss", 0),
    ("Das Boot trägt den Bauern und **eine** weitere Sache", 0),
    ("Allein gelassen frisst der Wolf die Ziege — und die Ziege den Kohl", 0),
    ("Wie kommen alle heil hinüber?", 0),
    ("Zeichnet die **Zustände** auf: wer ist auf welcher Seite? Genau so löst es ein Rechner", 0),
])

d.bullets("Rätsel 3: das Handschuhproblem", [
    ("In einer dunklen Schublade liegen **10 rote** und **10 blaue** Handschuhe", 0),
    ("Ihr könnt die Farbe nicht sehen und zieht einzeln heraus", 0),
    ("Wie viele müsst ihr ziehen, um **sicher** ein gleichfarbiges Paar zu haben?", 0),
    ("Und wie viele für ein Paar in einer **bestimmten** Farbe?", 0),
    ("Die zweite Frage ist die interessantere — und der Grund, warum man Randfälle testet", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Zum Schluss", "Ein Satz für die Ferien")

d.bullets("Was ihr mitnehmt", [
    ("Ihr könnt eine **Frage** stellen, die eine Datenbank beantworten kann", 0),
    ("Ihr könnt ein **Problem zerlegen**, bis es lösbar ist", 0),
    ("Ihr könnt **prüfen**, statt zu hoffen", 0),
    ("Und ihr wisst, dass eine Zahl ohne ihren Zusammenhang wenig wert ist", 0),
    ("Das gilt weit über die Informatik hinaus", 0),
])

d.merksatz("Erst denken, dann tippen. Erst zeichnen, dann bauen. "
           "Und erst prüfen, dann glauben.")

d.bullets("Fun Facts: zum Mitnehmen", [
    ("Das **Wiegeproblem** löst man mit drei Gruppen — jede Wägung gibt drei mögliche Antworten", 0),
    ("Die **Flussüberquerung** ist über tausend Jahre alt und steht in mittelalterlichen Rätselsammlungen", 0),
    ("Beim **Handschuhproblem** genügen drei für irgendein Paar — und zwölf für eine bestimmte Farbe", 0),
    ("Der schlechteste Fall entscheidet, nicht der Glücksfall — genau wie beim Testen", 0),
    ("Und: Knobeln ist Informatik ohne Rechner", 0),
])

d.bullets("Schöne Ferien!", [
    ("Räumt eure Dateien auf, bevor ihr geht", 0),
    ("Nehmt Projekt und Dokumentation mit nach Hause", 0),
    ("Und wenn euch in den Ferien eine Projektidee kommt: **aufschreiben**", 0),
    ("In Klasse 10 fangen wir mit Webtechnik an", 0),
    ("Bis dahin: erholt euch gut", 0),
])

d.save()
