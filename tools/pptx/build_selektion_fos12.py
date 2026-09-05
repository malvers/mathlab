#!/usr/bin/env python3
"""Grundstrukturen II: Selektion / Entscheidung (Woche 15)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, py_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from flow_diagrams import struktogramm, pap

d = Deck("grundstruktur-selektion.pptx")
P = lambda n: os.path.join(IMG, n)
code = lambda t, ls, **kw: d.code(t, [py_parts(l) for l in ls], **kw)

d.title("Informatik — FOS 12", "Grundstruktur II: die Auswahl",
        "Entscheidungen treffen: if, elif, else — und die Bedingung dahinter")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Die Verzweigung", "Genau ein Weg wird gegangen")

d.bullets("Was eine Auswahl ausmacht", [
    ("Eine **Bedingung** wird geprüft — sie ist entweder **wahr** oder **falsch**, nie „vielleicht“", 0),
    ("Je nach Antwort läuft der **eine** oder der **andere** Zweig — nie beide", 0),
    ("Nach der Auswahl geht es für alle wieder **gemeinsam** weiter", 0),
    ("**Einseitig**: nur ein Zweig hat Inhalt (if ohne else)", 0),
    ("**Zweiseitig**: beide Zweige tun etwas (if … else)", 0),
])

sg1 = struktogramm(P("sg-if.png"), [
    ("do", "Eingabe: Punkte"),
    ("if", "Punkte >= 50", [
        ("do", "Ausgabe: bestanden"),
    ], [
        ("do", "Ausgabe: nicht bestanden"),
    ]),
    ("do", "Ausgabe: Auswertung fertig"),
], W=900, size=26)
d.picture_bullets("Zweiseitige Auswahl", sg1, [
    ("Das Dreieck teilt: links **ja**, rechts **nein**", 0),
    ("Beide Zweige sind gleich breit — sie sind **gleichwertig**", 0),
    ("Der Kasten darunter läuft **immer**, egal welcher Zweig gewählt wurde", 0),
    ("In Python entspricht die Breite der **Einrückung**", 0),
], pic_w=400)

code("Und so sieht es in Python aus", [
    "punkte = int(input('Punkte: '))",
    "",
    "if punkte >= 50:",
    "    print('bestanden')",
    "else:",
    "    print('nicht bestanden')",
    "",
    "print('Auswertung fertig')   # laeuft immer - keine Einrueckung",
    "",
    "# Einseitig - else darf fehlen:",
    "if punkte == 60:",
    "    print('Volle Punktzahl!')",
], size=14)

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Bedingungen", "Woraus eine Ja/Nein-Frage gebaut wird")

d.table_top("Vergleichsoperatoren", [
    ["Zeichen", "bedeutet", "Beispiel", "Ergebnis"],
    ["==", "ist gleich", "note == 1", "True / False"],
    ["!=", "ist ungleich", "name != 'Lena'", "True / False"],
    ["<   >", "kleiner, größer", "punkte > 50", "True / False"],
    ["<=  >=", "kleiner/größer gleich", "punkte >= 50", "True / False"],
    ["in", "ist enthalten in", "'a' in 'Lena'", "True"],
], [130, 220, 250, 216], [
    ("**Ein** Gleichheitszeichen weist zu, **zwei** vergleichen — der häufigste Anfängerfehler", 0),
    ("Das Ergebnis eines Vergleichs ist ein **bool**: True oder False", 0),
    ("Vorsicht bei float: **0.1 + 0.2 == 0.3** ist False — lieber auf kleine Abweichung prüfen", 0),
], font_size=11.5, bold_cols=(0,), mono_cols=(0, 2))

d.table_top("Verknüpfen: and, or, not", [
    ["A", "B", "A and B", "A or B", "not A"],
    ["True", "True", "True", "True", "False"],
    ["True", "False", "False", "True", "False"],
    ["False", "True", "False", "True", "True"],
    ["False", "False", "False", "False", "True"],
], [130, 130, 160, 160, 160], [
    ("**and** ist nur wahr, wenn **beides** stimmt — **or** schon, wenn **eines** stimmt", 0),
    ("„zwischen 50 und 60“ heißt: **punkte >= 50 and punkte <= 60**", 0),
    ("In Python geht auch die Kurzform **50 <= punkte <= 60**", 0),
], font_size=11.5, bold_cols=(0, 1), align="ccccc", x=110,
   marks={(1, 2): TINT_GREEN, (1, 3): TINT_GREEN, (2, 3): TINT_GREEN, (3, 3): TINT_GREEN,
          (4, 4): TINT_ORANGE, (3, 4): TINT_ORANGE})

code("Bedingungen zusammenbauen", [
    "alter = int(input('Alter: '))",
    "mitglied = input('Mitglied (j/n): ') == 'j'",
    "",
    "if alter < 18 and mitglied:",
    "    print('ermaessigt und Mitgliederrabatt')",
    "elif alter < 18 or alter >= 65:",
    "    print('ermaessigt')",
    "else:",
    "    print('voller Preis')",
    "",
    "if not mitglied:",
    "    print('Hinweis: als Mitglied waere es guenstiger.')",
], size=13.5)

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Mehrfachauswahl", "Wenn es mehr als zwei Wege gibt")

code("Der Notenschlüssel mit elif", [
    "punkte = int(input('Punkte von 60: '))",
    "prozent = punkte / 60 * 100",
    "",
    "if prozent >= 92:",
    "    note = 1",
    "elif prozent >= 81:",
    "    note = 2",
    "elif prozent >= 67:",
    "    note = 3",
    "elif prozent >= 50:",
    "    note = 4",
    "elif prozent >= 30:",
    "    note = 5",
    "else:",
    "    note = 6",
    "",
    "print(f'{prozent:.1f} % - Note {note}')",
], size=12)

d.bullets("Die Reihenfolge entscheidet", [
    ("Python prüft **von oben nach unten** und nimmt den **ersten** Zweig, der passt", 0),
    ("Danach wird der Rest **übersprungen** — nicht mehr geprüft", 0),
    ("Deshalb **vom Strengsten zum Lockersten** ordnen: erst 92, dann 81, dann 67 …", 0),
    ("Umgedreht wäre jede Punktzahl über 30 sofort eine **5** — der Klassiker unter den Logikfehlern", 0),
    ("Ein **else** am Ende fängt alles ab, was übrig bleibt — es braucht keine Bedingung", 0),
])

sg2 = struktogramm(P("sg-elif.png"), [
    ("do", "Eingabe: Prozent"),
    ("if", "Prozent >= 50", [
        ("if", "Prozent >= 81", [("do", "gut oder besser")], [("do", "befriedigend / ausreichend")]),
    ], [
        ("do", "nicht bestanden"),
    ]),
], W=1080, size=24, caption="Verschachtelte Auswahl - dieselbe Logik, andere Schreibweise")
d.picture("Verschachtelt oder mit elif?", sg2, [
    ("Beides ist richtig — **elif** ist die flachere und meist lesbarere Form", 0),
    ("Verschachteln lohnt, wenn die innere Frage nur im **einen** Zweig überhaupt sinnvoll ist", 0),
], width=620)

# ---------------------------------------------------------------- Kapitel 04
d.chapter(4, "Testen an den Rändern", "Fehler sitzen fast immer an der Grenze")

d.table_top("Grenzwerte für den Notenschlüssel", [
    ["Prozent", "erwartete Note", "warum dieser Wert?"],
    ["91.9", "2", "knapp unter der Grenze"],
    ["92.0", "1", "genau auf der Grenze — >= oder > ?"],
    ["92.1", "1", "knapp darüber"],
    ["49.9", "5", "letzte Fünf"],
    ["50.0", "4", "die wichtigste Grenze überhaupt"],
    ["0 / 100", "6 / 1", "die beiden Extremwerte"],
], [150, 200, 400], [
    ("Testet **immer** direkt unter, genau auf und direkt über jeder Grenze", 0),
    ("Der häufigste Logikfehler heißt **Zaunpfahlfehler**: > statt >= (oder umgekehrt)", 0),
], font_size=11.5, bold_cols=(0,),
   marks={(2, c): TINT_ORANGE for c in range(3)} | {(5, c): TINT_ORANGE for c in range(3)})

d.merksatz("Genau ein Zweig wird ausgeführt — und Python nimmt den ersten, "
           "der passt. Die Reihenfolge der Bedingungen ist Teil der Lösung.")

d.bullets("Fun Facts: Entscheidungen", [
    ("Der **Zaunpfahlfehler** (off-by-one) hat einen eigenen Namen, weil er so oft passiert: 10 Meter Zaun, alle 2 Meter ein Pfahl — **sechs** Pfähle, nicht fünf", 0),
    ("**and** und **or** rechnen faul (**short-circuit**): steht links schon das Ergebnis fest, wird rechts gar nicht mehr geprüft", 0),
    ("Der **Therac-25** (1985–87) bestrahlte Patienten wegen eines fehlerhaften Zustandsvergleichs tödlich — bis heute Pflichtlektüre", 0),
    ("Python hat **kein switch/case** — bis Version 3.10, seitdem gibt es **match**", 0),
    ("Fast alle Sprachen schreiben **==** für den Vergleich, weil **=** schon zum Zuweisen vergeben war", 0),
])

d.bullets("Eure Aufgabe: entscheiden lassen", [
    ("**Notenrechner**: Punkte einlesen, Prozent berechnen, Note nach dem Schlüssel oben ausgeben", 0),
    ("Erweitert um eine Meldung: unter 50 % zusätzlich „**Nachprüfung möglich**“", 0),
    ("**Schaltjahr**: Jahr einlesen und prüfen (teilbar durch 4, aber nicht durch 100, außer durch 400)", 0),
    ("**Dreieck**: drei Seitenlängen einlesen und ausgeben, ob gleichseitig, gleichschenklig oder ungleichseitig — und ob es überhaupt ein Dreieck ist", 0),
    ("Zu jeder Aufgabe: Struktogramm **und** eine Tabelle mit Grenzwert-Testfällen", 0),
])

d.save()
