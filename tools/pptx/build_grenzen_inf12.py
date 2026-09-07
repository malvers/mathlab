#!/usr/bin/env python3
"""Informatik 12 (BGY), Woche 5 / KW 38: Grenzen von Modellen - Wetter, Verkehr, KI
(LB 1, Ustd. 5-6/22)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("grenzen-von-modellen.pptx")
P = lambda n: os.path.join(IMG, n)

d.title("Informatik — Grundkurs 12", "Wo Modelle an ihre Grenzen kommen",
        "Wetter, Verkehr und KI — drei Fälle, eine gemeinsame Ursache")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Die eingebaute Grenze", "Verkürzung ist der Zweck — und das Problem")

d.bullets("Jedes Modell lässt weg, also irrt jedes Modell", [
    ("Ein Modell ist per Definition **verkürzt** — genau das macht es brauchbar", 0),
    ("Und genau das ist seine **Grenze**: was fehlt, kann nicht wirken", 0),
    ("Die Frage ist nie **ob** ein Modell falsch liegt, sondern **wo** und **wie stark**", 0),
    ("Ein brauchbares Modell nennt deshalb seinen **Gültigkeitsbereich** mit", 0),
    ("Gefährlich wird es, wenn jemand das Ergebnis für die **Wirklichkeit** hält", 0),
])

d.table_top("Vier Arten von Grenzen", [
    ["Grenze", "kommt daher", "Beispiel"],
    ["Auflösung", "das Raster ist gröber als die Sache", "Gewitterzelle im 2-km-Gitter"],
    ["fehlendes Wissen", "der Zusammenhang ist unbekannt", "Wolkenbildung im Detail"],
    ["Sensitivität", "winzige Abweichungen wachsen an", "Wetter nach zwei Wochen"],
    ["Datenqualität", "die Eingaben sind lückenhaft oder schief", "Trainingsdaten einer KI"],
], [190, 336, 290], [
    ("Die ersten beiden lassen sich mit Aufwand verkleinern, die dritte **grundsätzlich nicht**", 0),
    ("Die vierte ist die häufigste — und die einzige, die man sich selbst einhandelt", 0),
], font_size=11.5, bold_cols=(0,),
   marks={(3, 0): TINT_RED, (4, 0): TINT_ORANGE})

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Fall 1: Das Wetter", "Warum nach zwei Wochen Schluss ist")

d.bullets("Ein Rechenmodell der Atmosphäre", [
    ("Die Luft wird in **Kacheln** zerlegt, für jede rechnet das Modell Druck, Temperatur, Feuchte", 0),
    ("Das Modell **ICON-D2** des Deutschen Wetterdienstes arbeitet mit rund **2 km** Kantenlänge", 0),
    ("Eine einzelne Gewitterzelle ist **kleiner als eine Kachel** — sie wird geschätzt, nicht gerechnet", 0),
    ("Feineres Gitter heißt mehr Rechenzeit: halbe Kantenlänge, rund **zehnfacher** Aufwand", 0),
    ("Und die Startwerte sind Messungen — also selbst nur **Näherungen**", 0),
])

d.bullets("Der Schmetterling von Edward Lorenz", [
    ("**1963** stellte Lorenz fest: winzig verschiedene Startwerte führen zu völlig anderen Verläufen", 0),
    ("Das ist kein Rechenfehler, sondern eine **Eigenschaft des Systems** — Chaos", 0),
    ("Deshalb ist die Vorhersagbarkeit begrenzt: nach gut **zwei Wochen** ist Schluss", 0),
    ("Antwort der Praxis: das **Ensemble** — viele Läufe mit leicht verschiedenen Startwerten", 0),
    ("Herauskommt keine Zahl, sondern eine **Wahrscheinlichkeit**: „70 % Regen“", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Fall 2: Der Verkehr", "Wenn das Modell sein Original verändert")

d.bullets("Das Braess-Paradoxon", [
    ("**Dietrich Braess** zeigte 1968: eine **zusätzliche** Straße kann alle langsamer machen", 0),
    ("Grund: jeder wählt für sich die beste Route — zusammen ergibt das nicht das beste Ergebnis", 0),
    ("Ein Modell, das nur Kapazitäten addiert, sagt das **Gegenteil** voraus", 0),
    ("Wer Verkehr modelliert, muss also das **Verhalten** der Fahrer mitmodellieren", 0),
    ("Beobachtet wurde der Effekt unter anderem in Seoul und New York bei **Straßenrückbau**", 0),
])

d.bullets("Die Rückkopplung: das Navi", [
    ("Ein Stau wird vorhergesagt — alle Navis leiten um — der **Umweg** steht", 0),
    ("Die Vorhersage hat den vorhergesagten Zustand **verändert**: eine Rückkopplung", 0),
    ("Bei Wetter gibt es das nicht: die Prognose ändert das Wetter nicht", 0),
    ("Modelle über **Menschen** haben diese Eigenschaft fast immer — Preise, Wahlen, Verkehr", 0),
    ("Fazit: Modell und Original sind hier **nicht unabhängig** voneinander", 0),
])

# ---------------------------------------------------------------- Kapitel 04
d.chapter(4, "Fall 3: KI-Modelle", "Ein Modell der Daten, nicht der Welt")

d.table_top("Was ein trainiertes Modell wirklich abbildet", [
    ["Annahme", "tatsächlich"],
    ["Es kennt die Welt", "Es kennt die Muster seiner Trainingsdaten"],
    ["Es prüft, ob etwas stimmt", "Es setzt fort, was in den Daten wahrscheinlich war"],
    ["Es ist neutral", "Es übernimmt jede Schieflage der Daten"],
    ["Es kennt seine Grenzen", "Es antwortet auch dort, wo es nichts gelernt hat"],
], [300, 516], [
    ("Die Trainingsdaten sind die **Verkürzung** — alles außerhalb ist für das Modell nicht vorhanden", 0),
    ("**Amazon** stellte 2018 ein Bewerbungs-Filtermodell ein: es hatte gelernt, Frauen schlechter zu bewerten", 0),
], font_size=11.5, bold_cols=(0,),
   marks={(3, 1): TINT_RED, (4, 1): TINT_ORANGE})

d.bullets("Woran man die Grenze im Alltag merkt", [
    ("**Seltene Fälle**: wovon es wenig Beispiele gab, wird am schlechtesten getroffen", 0),
    ("**Selbstbewusst falsch**: das Modell liefert dieselbe glatte Form für Richtiges und Falsches", 0),
    ("**Zeitschnitt**: was nach dem Training passierte, kennt es nicht", 0),
    ("**Zweckwechsel**: ein Modell für A auf B losgelassen, ist ein anderes Modell — ohne Prüfung", 0),
    ("Gegenmittel bleibt dasselbe wie bei jedem Modell: **Zweck nennen und nachprüfen**", 0),
])

# ---------------------------------------------------------------- Kapitel 05
d.chapter(5, "Umgang mit Grenzen", "Nicht wegwerfen — dazuschreiben")

d.table_top("Was ein verantwortliches Modell mitliefert", [
    ["Angabe", "Beispiel"],
    ["Gültigkeitsbereich", "gilt für Dresden, Stadtgebiet, Werktage"],
    ["Unsicherheit", "70 % Regenwahrscheinlichkeit statt „es regnet“"],
    ["Stand der Daten", "trainiert bzw. erhoben bis Juni 2026"],
    ["Prüfung an echten Fällen", "Vorhersage gegen das tatsächliche Eintreten halten"],
], [260, 556], [
    ("Das ist keine Bescheidenheitsfloskel, sondern **Teil des Modells** — sonst ist es nicht bewertbar", 0),
    ("Und es ist genau der **vierte Schritt** aus der letzten Stunde: prüfen", 0),
], font_size=11.5, bold_cols=(0,))

d.merksatz("Kein Modell scheitert daran, dass es vereinfacht — es scheitert daran, "
           "dass jemand vergisst, wo die Vereinfachung aufhört.")

d.bullets("Fun Facts: Grenzen", [
    ("**Edward Lorenz** entdeckte das Chaos 1961 durch eine abgeschnittene Zahl: 0,506 statt 0,506127", 0),
    ("Der Vortragstitel von 1972 machte es berühmt: **„Kann der Flügelschlag eines Schmetterlings "
     "in Brasilien einen Tornado in Texas auslösen?“**", 0),
    ("In **Seoul** wurde 2005 eine Stadtautobahn abgerissen und ein Bach freigelegt — der Verkehr "
     "wurde **flüssiger**", 0),
    ("Der Deutsche Wetterdienst rechnet sein Ensemble mit **20 Läufen** parallel, um die Streuung zu sehen", 0),
    ("**George Box** sagte den Rest: alle Modelle sind falsch, manche sind nützlich", 0),
])

d.bullets("Eure Aufgabe: eine Fallanalyse", [
    ("In Gruppen **einen** Fall wählen: Wetter-App, Stau-Prognose oder ein KI-Chatbot", 0),
    ("**Zweck** des Modells in einem Satz — für wen, wozu, bis wann gültig", 0),
    ("**Drei Vereinfachungen** benennen, die das Modell macht, und je eine Folge davon", 0),
    ("Eine Situation finden, in der das Modell **sicher danebenliegt** — und begründen warum", 0),
    ("Vorstellen in drei Minuten; die Klasse ordnet die Grenze einer der **vier Arten** zu", 0),
])

d.save()
