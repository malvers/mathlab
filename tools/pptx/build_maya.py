#!/usr/bin/env python3
"""Das Zahlensystem der Maya - rebuilt from Doc's .pptx as an HTML deck.

    python3 tools/pptx/html_deck.py build_maya.py     # -> HTML/decks/zahlensystem-maya.html

Every drawn figure is inline SVG with HTML labels (rule 23), maya_svg.py. The photographs are
NOT the ones embedded in the .pptx - those were stock photos and screenshots, and this repo is
public. They come from Wikimedia Commons with a named author and a licence, fetched once by
zahlsystem_bilder.py, and every chapter slide prints that line.

Corrected on the way: the .pptx computes 6 * 7200 as 48000 and lands on 48727. It is 43200,
so 6207 in the Maya count is 43927 - that is what this deck says.

HTML only: the figures are passed to figure() without a PNG twin, so this script is not meant
for the .pptx route. Doc's original .pptx stays where it is.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck
import maya_svg as F
import zahlsystem_bilder as B

d = Deck("zahlensystem-maya.pptx")

# Doc himself sits in the Frag-Solita row of this deck, with his team photo (Doc, 24.09.2026)
if hasattr(d, "set_avatar") and hasattr(d, "set_voice"):
    d.set_avatar("../resources/team/alvers_blick.png", "Doc Alvers")   # looking at the viewer (25.09.2026)
    d.set_voice("doc")                       # ... and answers in his own voice


def kapitel(num, titel, unter, bild):
    """A chapter divider with a Commons photograph - the licence line comes with the picture."""
    text, url = B.quelle(bild)
    d.chapter(num, titel, unter, image=B.pfad(bild), credit=text, credit_url=url)

d.title("Mathematik — Zahlensysteme", "Das Zahlensystem der Maya",
        "Punkt, Strich und Muschel · Basis 20 · und die Null, lange vor Europa")

# ------------------------------------------------------------- Kapitel 01 ---
kapitel(1, "Die Maya", "Wer sie waren, wo und wann sie lebten", "maya-castillo")

d.bullets("Worum es heute geht", [
    ("Wir zählen mit **zehn** Ziffern — weil wir zehn Finger haben", 0),
    ("Die Maya zählten mit **zwanzig** — Finger **und** Zehen", 0),
    ("Dafür brauchten sie nur **drei Zeichen**: Punkt, Strich und Muschel", 0),
    ("Und sie hatten die **Null** — Jahrhunderte bevor Europa sie kannte", 0),
    ("Am Ende schreibst du selbst eine Zahl im System der Maya", 0),
])
d.summary("Einstieg: wir zählen mit 10 Ziffern (zehn Finger), die Maya mit 20 (Finger und Zehen), "
          "nur drei Zeichen Punkt/Strich/Muschel, und sie hatten die Null vor Europa.")

d.figure("Wo haben die Maya gelebt?", *F.karte())
d.summary("Das Maya-Gebiet: Südmexiko, Yucatán, Guatemala, Belize, Honduras, El Salvador — "
          "etwa so groß wie Deutschland und Frankreich zusammen, ohne Rad und ohne Metallwerkzeug.")

d.figure("Wann haben die Maya gelebt?", *F.zeitstrahl())
d.summary("Zeitstrahl: Präklassik bis 250 n. Chr., Klassik 250–900 (Blütezeit der Städte), "
          "Postklassik bis 1697. Die Spanier eroberten Mexiko 1521. Die Null kam erst um 1200 "
          "über die Araber nach Europa.")

d.picture_bullets("Geschrieben haben sie in Stein", B.pfad("maya-stele"), [
    ("Die Maya hatten eine **vollständige Schrift** — als einzige Hochkultur Amerikas", 0),
    ("Über **800 Zeichen**: Silben, Wörter, Zahlen", 0),
    ("Auf Stelen standen **Daten**: wann ein König geboren wurde, wann er siegte", 0),
    ("Zahlen waren also nichts Nebensächliches — sie waren der **Grund** zu schreiben", 0),
    (B.credit("maya-stele"), 1),
], pic_w=300, side="right")
d.summary("Die Maya hatten als einzige Hochkultur Amerikas eine vollständige Schrift mit über "
          "800 Zeichen; auf Stelen standen vor allem Daten und Zahlen.")

# ------------------------------------------------------------- Kapitel 02 ---
d.chapter(2, "Eine Vorbereitung", "Warum ist eine Zahl hoch null gleich eins?")

d.figure("Warum ist $x^0 = 1$?", *F.potenzen())
d.summary("Warum x hoch 0 gleich 1 ist: eine Stufe tiefer heißt durch die Basis teilen. "
          "3^4=81, 3^3=27, 3^2=9, 3^1=3, also 3^0=1. Genauso 9^0=1. Jede Zahl hoch null ist 1.")

d.merksatz("Jede Zahl hoch null ist **1** — denn von einer Stufe zur nächsten wird durch die "
           "Basis geteilt, und $3 : 3 = 1$.")

# ------------------------------------------------------------- Kapitel 03 ---
d.chapter(3, "Unser Zehnersystem", "Erst verstehen, was wir selbst jeden Tag benutzen")

d.bullets("Wie viele Ziffern hat unser System?", [
    ("**0 1 2 3 4 5 6 7 8 9** — genau **zehn** Zeichen", 0),
    ("Mehr braucht es nicht: jede noch so große Zahl kommt damit aus", 0),
    ("Der Trick ist nicht die Ziffer, sondern **wo sie steht**", 0),
    ("Man nennt das ein **Stellenwertsystem**", 0),
    ("Die **Basis** ist die Zahl, mit der jede Stelle wächst — bei uns **10**", 0),
])
d.summary("Unser System hat zehn Ziffern 0–9. Entscheidend ist die Stelle, an der eine Ziffer "
          "steht: Stellenwertsystem zur Basis 10.")

d.figure("Das Stellenwertsystem — Basis 10", *F.stellen10())
d.summary("6207 zur Basis 10: 6 Tausender, 2 Hunderter, 0 Zehner, 7 Einer. Die Stellenwerte sind "
          "10^3=1000, 10^2=100, 10^1=10, 10^0=1. Jede Stelle ist zehnmal so viel wert wie die rechte.")

d.bullets("Ausgerechnet", [
    # one aligned block, so the three = stand under one another (Doc, 25.09.2026)
    ("$\\begin{aligned} 6207 &= 6 \\cdot 1000 + 2 \\cdot 100 + 0 \\cdot 10 + 7 \\cdot 1 \\\\ "
     "&= 6000 + 200 + 0 + 7 \\\\ &= 6207 \\end{aligned}$", 0),
    ("Die **Null** hält die Stelle frei — ohne sie stünde da $627$", 0),
    ("Genau dafür ist die Null da: sie sagt **hier ist nichts**", 0),
])
d.summary("6207 = 6·1000 + 2·100 + 0·10 + 7·1 = 6000+200+0+7. Die Null hält die Zehnerstelle "
          "frei, sonst stünde dort 627.")

# ------------------------------------------------------------- Kapitel 04 ---
kapitel(4, "Das Zahlensystem der Maya", "Zwanzig statt zehn — und drei Zeichen genügen",
        "maya-codex-detail")

d.figure("Drei Zeichen, mehr nicht", *F.punkt_strich_muschel())
d.summary("Die drei Zeichen der Maya: Punkt = 1, Strich = 5, Muschel = 0. Daraus wird jede der "
          "zwanzig Ziffern zusammengesetzt.")

d.figure("Die zwanzig Ziffern", *F.ziffern())
d.summary("Die Maya-Ziffern 0 bis 19: die Muschel ist 0, ein Punkt ist 1, ein Strich ist 5. "
          "Beispiel 19 = drei Striche (15) und vier Punkte (4). Mehr als drei Striche und vier "
          "Punkte kommen nie vor — dann ist die Stelle voll.")

d.bullets("Wie die Ziffern gebaut sind", [
    ("Punkte stehen **oben**, Striche **darunter**", 0),
    ("Bis zu **vier Punkte** (= 4) und bis zu **drei Striche** (= 15)", 0),
    ("Zusammen also höchstens $4 + 15 = 19$ — die größte Ziffer", 0),
    ("Bei **20** ist die Stelle voll, es beginnt die nächste", 0),
    ("Das ist genau wie bei uns bei **10** — nur später", 0),
])
d.summary("Aufbau der Maya-Ziffern: Punkte oben (bis 4), Striche darunter (bis 3 = 15), zusammen "
          "höchstens 19. Bei 20 springt es auf die nächste Stelle.")

d.figure("Dieselben Ziffern, Basis 20", *F.stellen20())
d.summary("Rein zur Basis 20 wären die Stellenwerte 1, 20, 400, 8000. Die Ziffernfolge 6207 "
          "ergäbe dort 6·8000 + 2·400 + 0·20 + 7 = 48807.")

d.figure("Aber die Maya rechneten anders", *F.stellen_maya())
d.summary("Die echten Maya-Stellenwerte sind 1, 20, 360, 7200, 144000 — die dritte Stelle ist "
          "360 statt 400, weil das Maya-Jahr 18 Monate zu 20 Tagen = 360 Tage hatte. Damit ist "
          "6207 in Maya-Schreibweise 6·7200 + 2·360 + 0·20 + 7 = 43927.")

d.bullets("Warum der Bruch bei 360?", [
    ("Das Maya-Jahr hatte **18 Monate zu je 20 Tagen** = **360 Tage**", 0),
    ("Dazu kamen **5 Tage**, die als unglücklich galten und nicht mitzählten", 0),
    ("Die Zahlen dienten vor allem dem **Kalender**", 0),
    ("Darum zählt die dritte Stelle **360** und nicht $20^2 = 400$", 0),
    ("Ab der vierten Stelle geht es wieder mal zwanzig: $20 \\cdot 360 = 7200$", 0),
])
d.summary("Der Bruch bei 360: das Maya-Jahr hatte 18 Monate zu 20 Tagen = 360 Tage plus 5 "
          "Unglückstage. Weil das System dem Kalender diente, zählt die dritte Stelle 360 statt "
          "400; danach geht es wieder mal 20 weiter (7200, 144000).")

d.figure("So schreiben die Maya eine Zahl", *F.maya_zahl())
d.summary("Die Maya schrieben ihre Stellen übereinander: höchste Stelle oben, Einer unten. "
          "6207 wird zu 6·7200 + 2·360 + 0·20 + 7·1 = 43927.")

# ------------------------------------------------------------- Kapitel 05 ---
d.chapter(5, "Jetzt du", "Eine Zahl im System der Maya")

# the lab lives inside the slide - the one thing PowerPoint cannot do (forloop-49 built it)
d.lab("Das Maya-Rechenbrett", "maya.html",
      note="**Würfel** stellt eine Aufgabe · Ziffern auf die Stellen **ziehen** · Zahl antippen und eintippen")
d.summary("Im Deck steckt das Lab „Maya-Zahlen“ (maya.html): ein Rechenbrett, auf dem eine Zahl "
          "aus Punkten, Strichen und Muschel gelegt statt getippt wird. Der Würfel stellt Aufgaben, "
          "die Ziffern werden auf die Stellen gezogen, und der Pfeil zeigt, ob Zahl oder Brett führt.")

d.figure("Aufgabe: Schreibe **5432** im System der Maya", *F.aufgabe(5432))
d.say("Nimm dir einen Moment. Fang oben an: wie oft passt siebentausendzweihundert in "
      "fünftausendvierhundertzweiunddreißig?", hold=True)
d.summary("Aufgabe: 5432 im Maya-System schreiben. Die Stellenwerte sind 7200, 360, 20, 1.")

d.figure("Die Lösung", *F.aufgabe(5432, loesung=True))
d.summary("Lösung: 5432 = 0·7200 + 15·360 + 1·20 + 12·1. Also Muschel, dann 15 (drei Striche), "
          "dann 1 (ein Punkt), dann 12 (zwei Striche und zwei Punkte).")

d.bullets("Der Rechenweg", [
    ("$5432 : 7200 = 0$ Rest $5432$ — die oberste Stelle ist **leer**, also die **Muschel**", 0),
    ("$5432 : 360 = 15$ Rest $32$ — **15** ist drei Striche", 0),
    ("$32 : 20 = 1$ Rest $12$ — **1** ist ein Punkt", 0),
    ("$12$ bleibt für die Einer — zwei Striche und zwei Punkte", 0),
    ("Probe: $15 \\cdot 360 + 1 \\cdot 20 + 12 = 5400 + 20 + 12 = 5432$", 0),
])
d.summary("Rechenweg zu 5432: durch 7200 geht 0-mal (Muschel), durch 360 geht 15-mal Rest 32, "
          "durch 20 geht 1-mal Rest 12, bleibt 12 Einer. Probe: 5400+20+12 = 5432.")

# ------------------------------------------------------------- Kapitel 06 ---
d.chapter(6, "Der Codex Dresdensis", "Die älteste Handschrift Amerikas — in Dresden")

d.picture_bullets("Eine Seite des Codex Dresdensis", B.pfad("maya-codex"), [
    ("Von den Tausenden Maya-Büchern haben die Spanier fast alle **verbrannt**", 0),
    ("**Vier** sind übrig — das schönste liegt in der **SLUB Dresden**", 0),
    ("Es ist ein **Kalender**: Venus, Mondfinsternisse, Festtage", 0),
    ("Die senkrechten Kolonnen aus Punkten und Strichen sind **Zahlen**", 0),
    (B.credit("maya-codex"), 1),
], pic_w=210, side="right")
d.summary("Der Codex Dresdensis liegt in der SLUB Dresden, eines von nur vier erhaltenen "
          "Maya-Büchern. Er ist ein Kalender mit Venus-Tafeln und Finsternissen; die senkrechten "
          "Kolonnen aus Punkten und Strichen sind Zahlen in der Schreibweise dieses Decks.")

d.bullets("Was in diesem Buch steckt", [
    ("Die Maya sagten **Venus-Läufe** auf Tage genau voraus", 0),
    ("Ihre Jahreslänge lag näher am wahren Wert als der europäische **Julianische Kalender**", 0),
    ("Möglich war das nur mit einem **Stellenwertsystem** und der **Null**", 0),
    ("Rechnen ist keine Nebensache einer Kultur — es ist ihr **Werkzeug**", 0),
])
d.summary("Mit diesem Zahlensystem sagten die Maya Venus-Läufe tagegenau voraus; ihre "
          "Jahreslänge war genauer als der Julianische Kalender. Möglich nur durch "
          "Stellenwertsystem und Null.")

# Doc, 25.09.2026: "Basis ist falsch! Wie ich gelernt habe von Euch" - the same words as the
# lab's "Basis 27?" note (HTML/koerperzaehlen.html): a count of body points is no base
d.bullets("Und noch ein Weg: Zählen am Körper", [
    ("In **Papua-Neuguinea** zählen einige Gruppen am Körper: Finger, Arm, Schulter, Ohr, Nase — und zurück", 0),
    ("Der Zählweg hat **27** Punkte — andere Gruppen kommen auf 19, 23 oder 33", 0),
    ("Oft heißt es „Basis 27“ — das stimmt **nicht**: es gibt keine Stellen $1, 27, 729, \\ldots$ und keine Ziffern dafür", 0),
    ("Wer weiterzählt, fängt wieder am Daumen an und merkt sich die Runden — wie schreibt man damit $500$?", 0),
    ("Genau dafür haben Maya und Babylonier **Stellenwerte** erfunden", 0),
])
d.summary("Zum Schluss: in Papua-Neuguinea zählen einige Gruppen am Körper (Finger, Arm, Schulter, "
          "Ohr, Nase und zurück), der Zählweg hat 27 Punkte, bei anderen Gruppen 19, 23 oder 33. "
          "Das ist keine Basis 27: es gibt keine Stellen 1, 27, 729 und keine Ziffern dafür. Wer "
          "weiterzählt, merkt sich die Runden - große Zahlen wie 500 lassen sich so nicht schreiben, "
          "genau dafür haben Maya und Babylonier Stellenwerte erfunden.")

# ... and the body count to try out - the lab right after the slide that explains it (Doc, 25.09.2026)
d.lab("Zählen in Papua-Neuguinea", "koerperzaehlen.html",
      note="Auf den Körper **tippen** · **Würfel** stellt eine Aufgabe · über 27 zählt man **Runden**")
d.summary("Im Deck steckt das Lab „Zählen in Papua-Neuguinea“ (koerperzaehlen.html): ein Foto mit den "
          "27 Zählpunkten vom Daumen bis zum kleinen Finger der anderen Hand. Tippen auf den Körper "
          "zeigt die Zahl, der Würfel stellt Aufgaben, und über 27 zählt man Runden - 40 ist eine Runde "
          "und dann das linke Auge.")

d.table_top("Zum Nachschlagen", [
    ["Begriff", "in einem Satz"],
    ["Basis", "die Zahl, mit der jede Stelle wächst — bei uns 10, bei den Maya 20"],
    ["Stellenwertsystem", "der Wert einer Ziffer hängt davon ab, wo sie steht"],
    ["Ziffer", "eines der Grundzeichen — wir haben 10, die Maya 20"],
    ["Punkt", "ein Punkt zählt 1"],
    ["Strich", "ein Strich zählt 5"],
    ["Muschel", "das Zeichen für 0 — hier ist nichts"],
    ["Stellenwerte", "Maya: 1, 20, 360, 7200, 144000"],
    ["Tun", "das Maya-Jahr aus 18 Monaten zu 20 Tagen = 360 Tage"],
    ["Codex Dresdensis", "eines von vier erhaltenen Maya-Büchern, in der SLUB Dresden"],
], [210, 606], None, font_size=10.5, row_h=18, bold_cols=(0,))

d.merksatz("Drei Zeichen, zwanzig Ziffern, eine Null — damit haben die Maya den Himmel "
           "berechnet. Nicht die Zeichen machen ein Zahlensystem stark, sondern die **Stelle**.")

d.save()
