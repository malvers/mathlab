#!/usr/bin/env python3
"""Informatik 9 (Oberschule), Woche 7 / KW 40: Einfache Datenmodelle entwerfen
(LB 1, Ustd. 6/13)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from flow_diagrams import pap

d = Deck("datenmodelle-entwerfen.pptx")
P = lambda n: os.path.join(IMG, n)

d.title("Informatik — Klasse 9", "Erst denken, dann tippen",
        "Ein Datenmodell entwerfen — auf Papier, bevor der Rechner angeht")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Der Ausschnitt", "Was gehört dazu — und was nicht?")

d.bullets("Eine Datenbank bildet nie alles ab", [
    ("Eine Schulbibliothek hat Bücher, Regale, Staub, Licht, einen Geruch und eine Aufsicht", 0),
    ("Für die Frage **„Wer hat welches Buch?“** braucht ihr davon **fast nichts**", 0),
    ("Der Teil, den ihr abbildet, heißt **Ausschnitt der Wirklichkeit** oder **Mini-Welt**", 0),
    ("Was ihr weglasst, ist keine Schlamperei — es ist eine **Entscheidung**", 0),
    ("Und die trefft ihr **vor** dem ersten Klick im Programm", 0),
])

d.table_top("Drei Fragen, in dieser Reihenfolge", [
    ["Frage", "Antwort für die Bibliothek"],
    ["1. Was will ich wissen?", "Wer hat welches Buch, und seit wann?"],
    ["2. Welche Dinge kommen vor?", "Buch, Schüler, Ausleihe"],
    ["3. Welche Merkmale braucht jedes Ding?", "Buch: Signatur, Titel, Autor …"],
], [330, 486], [
    ("Frage 1 zuerst — sie entscheidet über alles Weitere", 0),
    ("Ein Merkmal, nach dem niemand je fragt, kommt **nicht** ins Modell", 0),
], font_size=12, bold_cols=(0,))

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Die Entwurfsskizze", "Kästen und Linien, mehr nicht")

# wrap() knows no newlines - one line per box, the frame does the wrapping.
dia = pap(P("pap-bibliothek-info9.png"), 1560, 380, {
    "b": dict(pos=(230, 150), w=380, h=190, kind="proc",
              text="BUCH: Signatur, Titel, Autor, Jahr"),
    "a": dict(pos=(780, 150), w=300, h=190, kind="con",
              text="AUSLEIHE: von, bis"),
    "s": dict(pos=(1330, 150), w=380, h=190, kind="proc",
              text="SCHÜLER: Nummer, Name, Klasse"),
}, [
    ("b", "a", "geliehen"),
    ("s", "a", "leiht"),
], notes=[("Ein Kasten je Ding, dahinter seine Merkmale", (520, 320))], size=28)
d.picture("Die Schulbibliothek als Skizze", dia, [
    ("Jedes **Ding** bekommt einen Kasten, darunter stehen seine **Merkmale**", 0),
    ("Die **Ausleihe** in der Mitte verbindet beide — sie hat eigene Merkmale: von und bis", 0),
], width=816)

d.bullets("Woran man einen guten Entwurf erkennt", [
    ("Jedes Ding hat ein Merkmal, das es **eindeutig** macht: Signatur, Schülernummer", 0),
    ("Kein Merkmal steht **zweimal** in verschiedenen Kästen", 0),
    ("Jede Frage aus Schritt 1 lässt sich am Entwurf **beantworten**", 0),
    ("Und jedes Merkmal lässt sich einem **Datentyp** zuordnen", 0),
    ("Wenn ihr einen Kasten nicht in einem Satz erklären könnt, sind es zwei Kästen", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Weglassen", "Die schwerste Übung")

d.table_top("Bibliothek: was kommt rein, was nicht?", [
    ["Angabe", "rein?", "warum"],
    ["Titel des Buchs", "ja", "danach wird gesucht"],
    ["Signatur", "ja", "macht jedes Buch eindeutig"],
    ["Ausleihdatum", "ja", "sonst weiß niemand, wer überzogen hat"],
    ["Farbe des Einbands", "nein", "danach fragt niemand"],
    ["Handynummer", "nein", "nicht nötig — und Datenschutz", ],
    ["Lieblingsbuch", "nein", "anderer Zweck, anderes Modell"],
], [250, 110, 456], [
    ("Zu jedem **Nein** gehört ein **Grund** — schreibt ihn dazu", 0),
    ("Ändert sich die Frage aus Schritt 1, ändert sich das Modell. Nicht umgekehrt", 0),
], font_size=11, bold_cols=(0,),
   marks={(r, 1): TINT_GREEN for r in range(1, 4)} | {(r, 1): TINT_RED for r in range(4, 7)})

d.merksatz("Ein Datenmodell entsteht auf Papier: erst die Frage, dann die Dinge, "
           "dann die Merkmale. Der Rechner kommt zuletzt.")

d.bullets("Fun Facts: Modelle", [
    ("Solche Kasten-Linien-Bilder heißen **Entity-Relationship-Diagramme** — 1976 von Peter Chen", 0),
    ("**Entity** heißt „Ding“, **Relationship** heißt „Beziehung“ — mehr steckt nicht dahinter", 0),
    ("In der Oberstufe zeichnet ihr genau diese Diagramme wieder, dann mit festen Symbolen", 0),
    ("Profis planen an einem Datenmodell **Wochen** — der Umbau später kostet ein Vielfaches", 0),
    ("Der berühmteste Satz dazu: **„Alle Modelle sind falsch, aber manche sind nützlich“**", 0),
])

d.bullets("Eure Aufgabe: eine eigene Mini-Welt", [
    ("Zu zweit **eine** Mini-Welt wählen: Sportverein, Schulkiosk oder Klassenbibliothek", 0),
    ("**Frage 1** aufschreiben: Was wollt ihr aus dieser Datenbank erfahren?", 0),
    ("**Kästen** zeichnen — je ein Ding, darunter höchstens fünf Merkmale", 0),
    ("Ein Merkmal je Kasten markieren, das **eindeutig** ist", 0),
    ("Mit dem Nachbarpaar tauschen: **Beantwortet euer Modell die Frage des anderen?**", 0),
])

d.save()
