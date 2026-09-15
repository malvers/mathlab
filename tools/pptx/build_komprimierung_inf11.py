#!/usr/bin/env python3
"""Informatik 11 (BGY), KW 18 (live plan): Wahlbereich "Datenkomprimierung und Fehlererkennung" I -
verlustfrei und verlustbehaftet, Lauflaengencodierung, Huffman, Entropie (WB, Ustd. 1-2/4).

Facts line up with the worksheet HTML/inf11test-komprimierung.html (20 Aufgaben). The plan row
also names "Eingabe- und Uebertragungsfehler erkennen" - the worksheet leaves that to the next
week (Pruefziffern), so this deck only points ahead. All worked examples were recomputed.
Chapter pictures come from Wikimedia Commons, each with its licence line on the slide.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("inf11-komprimierung.pptx")

d.title("Informatik — Grundkurs 11", "Daten komprimieren",
        "Wahlbereich Datenkomprimierung und Fehlererkennung — Lauflänge, Huffman und warum JPEG kleiner ist")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Warum komprimieren?", "Redundanz, verlustfrei, verlustbehaftet",
          image="img/komprimierung-diskette.jpg",
          credit="Disketten in drei Größen — Foto: George Chernilevsky, gemeinfrei, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Floppy_disk_2009_G1.jpg")

d.bullets("Wo wir stehen", [
    ("Das Projekt ist abgeschlossen — präsentiert, ausgewertet, benotet", 0),
    ("Heute beginnt der **Wahlbereich**: Datenkomprimierung und Fehlererkennung", 0),
    ("Aus Lernbereich 2 wisst ihr: Ein Foto mit 800 × 600 Bildpunkten und 24 Bit braucht **1 440 000 Byte**", 0),
    ("Leitfrage: Wie passt dieselbe Botschaft in **weniger Bits** — und was geht dabei verloren?", 0),
    ("Nächste Woche die Kehrseite: zusätzliche Bits, mit denen man **Fehler erkennt**", 0),
])

d.table_top("Wie groß ist das unkomprimiert?", [
    ["Medium", "Rechnung", "unkomprimiert"],
    ["Foto, 800 × 600 Punkte", "480 000 Punkte × 3 Byte", "1 440 000 Byte, rund 1,4 MB"],
    ["1 Minute Musik in CD-Qualität", "44 100 × 2 Byte × 2 Kanäle × 60 s", "10 584 000 Byte, rund 10,6 MB"],
    ["1 Sekunde Full-HD-Video", "1920 × 1080 × 3 Byte × 25 Bilder", "155 520 000 Byte, rund 155 MB"],
], [230, 330, 256], [
    ("Ein MP3 mit 128 kbit/s braucht für die Minute nur rund **1 MB** — etwa ein Elftel", 0),
    ("Ohne Komprimierung gäbe es kein Streaming und keine Fotos im Messenger", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 2): TINT_GREEN, (2, 2): TINT_ORANGE, (3, 2): TINT_RED})

d.bullets("Redundanz: der Stoff, aus dem Komprimierung ist", [
    ("Jede Komprimierung beruht auf **Redundanz** — Anteilen, die keine zusätzliche Information tragen", 0),
    ("Wiederholungen und Muster lassen sich **kürzer beschreiben**", 0),
    ("Wo keine Redundanz ist, lässt sich nichts einsparen: **Zufallsdaten** sind praktisch nicht komprimierbar", 0),
    ("Eine schon komprimierte Datei hat ihre Redundanz verloren — ein zweiter Durchgang macht sie oft **größer**", 0),
    ("**Kompressionsrate** = Originalgröße geteilt durch komprimierte Größe: $\\frac{10\\ \\text{MB}}{2\\ \\text{MB}} = 5$, also 5 : 1", 0),
])

d.two_cols("Verlustfrei oder verlustbehaftet", [
    ("**Verlustfrei**", 0),
    ("das Original kommt **exakt** zurück", 1),
    ("Pflicht bei Texten und Programmen", 1),
    ("Beispiele: ZIP, PNG", 1),
    ("Text mit vielen Wiederholungen: sehr gut", 1),
], [
    ("**Verlustbehaftet**", 0),
    ("lässt weg, was **kaum auffällt**", 1),
    ("nur bei Bild, Ton und Video", 1),
    ("Beispiele: JPEG, MP3", 1),
    ("was weg ist, bleibt weg", 1),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Lauflänge und Huffman", "Zwei Verfahren zum Selbermachen",
          image="img/komprimierung-huffman.png",
          credit="Huffman-Baum — Meteficha, gemeinfrei, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Huffman_tree_2.svg")

d.bullets("Lauflängencodierung", [
    ("Englisch **Run Length Encoding** (RLE)", 0),
    ("Idee: Folgen gleicher Zeichen werden durch **Anzahl und Zeichen** ersetzt", 0),
    ("AAAAB wird zu **4A1B** — üblich ist die Anzahl vor dem Zeichen", 0),
    ("AAABBBBCC wird zu **3A4B2C** — nicht vorkommende Zeichen werden nicht notiert", 0),
    ("Kurze Codes für häufige Zeichen sind etwas anderes — das ist **Huffman**", 0),
])

d.table_top("Lauflänge von Hand", [
    ["Eingabe", "codiert", "Zeichen vorher", "Zeichen nachher"],
    ["AAABBBBCC", "3A4B2C", "9", "6"],
    ["AAAAAAAAAABB", "10A2B", "12", "5"],
    ["Bildzeile: 20 weiß, 3 schwarz, 20 weiß", "20W3S20W", "43", "8"],
    ["ABCABC", "1A1B1C1A1B1C", "6", "12"],
], [330, 190, 148, 148], [
    ("Lohnt nur bei **langen Läufen** — bei ABCABC wird die Datei doppelt so lang", 0),
    ("Deshalb prüfen Formate, ob sich die Codierung lohnt", 0),
], font_size=11, bold_cols=(0,),
   marks={(3, 3): TINT_GREEN, (4, 3): TINT_RED})

d.bullets("Huffman: häufig heißt kurz", [
    ("**Häufige** Zeichen bekommen **kurze** Codes, seltene lange", 0),
    ("Die Häufigkeit steuert die Codelänge — der mittlere Bedarf pro Zeichen sinkt", 0),
    ("Bei **gleich häufigen** Zeichen bringt Huffman nichts", 0),
    ("Dieselbe Idee steckt im Morsecode: Das häufige E ist ein einziger Punkt", 0),
])

d.bullets("Wie der Huffman-Baum entsteht", [
    ("**1.** Häufigkeiten zählen — im Wort ANANAS: A 3-mal, N 2-mal, S 1-mal", 0),
    ("**2.** Die zwei seltensten zu einem Knoten verbinden, Häufigkeiten addieren: S + N = 3", 0),
    ("**3.** Wiederholen, bis nur ein Baum übrig ist: (S N) + A = 6", 0),
    ("**4.** Jede Abzweigung links mit 0, rechts mit 1 beschriften", 0),
    ("Der Weg von der Wurzel zum Zeichen ist sein **Code**: A = 0, N = 10, S = 11", 0),
])

d.table_top("Huffman am Beispiel ANANAS", [
    ["Zeichen", "Häufigkeit", "Code", "Bits im Text"],
    ["A", "3", "0", "3 × 1 = 3"],
    ["N", "2", "10", "2 × 2 = 4"],
    ["S", "1", "11", "1 × 2 = 2"],
    ["Summe", "6 Zeichen", "", "9 Bit"],
], [180, 200, 180, 256], [
    ("ANANAS wird zu **0 10 0 10 0 11** — also 010010011", 0),
    ("Mit 2 Bit je Zeichen wären es 12 Bit, mit 8 Bit je Zeichen sogar **48 Bit**", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 2): TINT_GREEN, (4, 3): TINT_ORANGE})

d.bullets("Präfixfrei: lesbar ohne Trennzeichen", [
    ("**Präfixfrei** heißt: Kein Codewort ist der Anfang eines anderen", 0),
    ("Huffman-Codes sind **immer** präfixfrei — deshalb braucht man kein Trennzeichen", 0),
    ("Mit A = 0, B = 10, C = 11 zerfällt 01011 eindeutig in 0 | 10 | 11 = **ABC**", 0),
    ("Gegenbeispiel A = 0, B = 01, C = 1: Ist 01 nun B — oder A und C?", 0),
])

d.bullets("Wörterbuch: Verweis statt Wiederholung", [
    ("Verfahren wie **LZ77** ersetzen wiederkehrende Zeichenfolgen durch einen **Verweis** auf ein früheres Vorkommen", 0),
    ("Notiert werden **Abstand und Länge** — das Wörterbuch entsteht aus dem Text selbst", 0),
    ("Beispiel: „Informatik ist Informatik“ wird zu „Informatik ist (15, 10)“", 0),
    ("Heißt: 15 Zeichen zurückgehen, 10 Zeichen abschreiben", 0),
    ("**ZIP** und **PNG** beruhen darauf — kombiniert mit Huffman", 0),
])

d.bullets("Die Grenzen der Komprimierung", [
    ("**Entropie**: der mittlere Informationsgehalt je Zeichen — die untere Grenze der verlustfreien Komprimierung", 0),
    ("$H = -\\sum_i p_i \\log_2 p_i$ — für ANANAS: $H \\approx 1{,}46$ Bit je Zeichen, Huffman schafft 1,5", 0),
    ("Je gleichverteilter die Zeichen, desto höher die Entropie", 0),
    ("**Kein** Verfahren verkleinert jede Datei: Sonst könnte man beliebig oft komprimieren, bis nichts übrig ist", 0),
    ("Es gibt $2^{n}$ Dateien mit $n$ Bit, aber nur $2^{n} - 1$ kürzere", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Bild, Ton, Video", "Weglassen, was kaum auffällt",
          image="img/komprimierung-jpeg.png",
          credit="JPEG-Qualität nimmt nach links ab — Foto: Michael Gäbler, Bearbeitung: AzaToth, CC BY 3.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Felis_silvestris_silvestris_small_gradual_decrease_of_quality.png")

d.two_cols("JPEG oder PNG?", [
    ("**PNG** — verlustfrei", 0),
    ("behält jedes Pixel exakt", 1),
    ("gut für Grafiken mit klaren Kanten", 1),
    ("gut für Screenshots und Logos", 1),
], [
    ("**JPEG** — verlustbehaftet", 0),
    ("vereinfacht Farbverläufe und feine Details", 1),
    ("lässt weg, was das Auge kaum wahrnimmt", 1),
    ("gut für Fotos — viel kleiner als PNG", 1),
])

d.bullets("Vorsicht beim Speichern", [
    ("Jedes erneute Speichern als JPEG wirft **wieder** Information weg", 0),
    ("Die Verluste summieren sich sichtbar", 0),
    ("Deshalb: im verlustfreien Format bearbeiten, **zuletzt** als JPEG exportieren", 0),
    ("Die **Qualitätsstufe** steuert den Zielkonflikt: kleinere Datei gegen sichtbaren Verlust", 0),
    ("Für ein Vorschaubild darf stärker komprimiert werden — für ein Archivbild nicht", 0),
])

d.bullets("Video: nur die Änderung speichern", [
    ("Aufeinanderfolgende Bilder **ähneln sich stark**", 0),
    ("Gespeichert wird vor allem die **Änderung** zum vorigen Bild", 0),
    ("Regelmäßig kommt ein **Vollbild** (Keyframe): Dort kann man einsteigen, und Fehler wirken nicht ewig weiter", 0),
    ("Teuer sind Schnitte und schnelle Bewegung — dann ändert sich fast alles", 0),
])

d.bullets("Komprimieren spart Energie", [
    ("Übertragung und Speicherung kosten **Energie und Bandbreite**", 0),
    ("Weniger übertragene Daten heißt: weniger Strom in Netz und Rechenzentrum", 0),
    ("Zu große Bilder auf Webseiten sind ein häufiger Posten", 0),
    ("Passendes Format und passende Größe sparen spürbar — ohne sichtbaren Nachteil", 0),
])

d.merksatz("Komprimieren heißt Redundanz entfernen: Verlustfrei kommt das Original exakt zurück, "
           "verlustbehaftet fällt weg, was kaum auffällt — und kein Verfahren verkleinert jede Datei.")

d.bullets("Fun Facts", [
    ("**David Huffman** fand sein Verfahren als Student — statt der Abschlussprüfung schrieb er eine Hausarbeit; veröffentlicht 1952", 0),
    ("**Faxgeräte** codieren jede Zeile als Lauflängen von Weiß und Schwarz — und die Längen noch nach Huffman", 0),
    ("Eine 3,5-Zoll-Diskette fasst 1 474 560 Byte — ein unkomprimiertes 800 × 600-Foto passt gerade so darauf", 0),
    ("**JPEG** heißt nach der Joint Photographic Experts Group, die das Format 1992 normte", 0),
])

d.bullets("Eure Aufgabe", [
    ("**Unplugged-Experiment**: ein Schwarz-Weiß-Pixelbild Zeile für Zeile als Lauflängen diktieren — die Partnerin zeichnet nur nach den Zahlen", 0),
    ("**Im Kopf**: AAAABBBCCD und ABABAB lauflängencodieren — wann lohnt es sich?", 0),
    ("**Vergleichen** im PC-Kabinett: dasselbe Foto als PNG und als JPEG in zwei Qualitätsstufen speichern — Größen notieren", 0),
    ("**Huffman**: für euren Vornamen Häufigkeiten zählen und einen Code bauen", 0),
    ("Zum Schluss: **Aufgaben (20)** auf der Planseite — Lösung pro Aufgabe zum Aufklappen", 0),
])

d.save()
