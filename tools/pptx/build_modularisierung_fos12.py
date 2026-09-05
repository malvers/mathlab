#!/usr/bin/env python3
"""Modularisierung: Problemloesungen strukturieren, Funktionen (Woche 18)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, py_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from flow_diagrams import struktogramm, pap

d = Deck("modularisierung.pptx")
P = lambda n: os.path.join(IMG, n)
code = lambda t, ls, **kw: d.code(t, [py_parts(l) for l in ls], **kw)

d.title("Informatik — FOS 12", "Modularisierung",
        "Große Probleme zerlegen: Funktionen mit Parametern und Rückgabewerten")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Teile und herrsche", "Ein großes Problem ist eine Menge kleiner Probleme")

d.bullets("Warum ein Programm zerlegt wird", [
    ("Ein 300-Zeilen-Block ist **nicht prüfbar**: niemand hat ihn im Kopf", 0),
    ("**Zerlegen** heißt: jedes Teilproblem einzeln lösen, einzeln testen, einzeln benennen", 0),
    ("Ein Teil, das funktioniert, kann man **wiederverwenden** — auch im nächsten Projekt", 0),
    ("Im Team arbeitet jeder an einem Teil, ohne dem anderen ins Programm zu greifen", 0),
    ("Und beim Suchen: ein Fehler steckt in **einer** Funktion, nicht irgendwo in 300 Zeilen", 0),
])

d.table_top("Vier Gründe, vier Wirkungen", [
    ["Grund", "ohne Zerlegung", "mit Zerlegung"],
    ["Verständlichkeit", "300 Zeilen am Stück lesen", "acht Namen lesen, dann gezielt nachsehen"],
    ["Testbarkeit", "nur das Ganze testbar", "jede Funktion einzeln prüfbar"],
    ["Wiederverwendung", "Code kopieren (und Fehler mit)", "einmal schreiben, überall aufrufen"],
    ["Änderung", "an fünf Stellen nachziehen", "an einer Stelle ändern"],
], [170, 290, 356], [
    ("Das Prinzip heißt **Teile und herrsche** (divide et impera) und ist älter als der Computer", 0),
    ("Kernidee: **eine Funktion, eine Aufgabe** — der Name sagt, welche", 0),
], font_size=11.5, bold_cols=(0,), marks={(r, 1): TINT_RED for r in range(1, 5)} |
   {(r, 2): TINT_GREEN for r in range(1, 5)})

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Funktionen", "Definieren, aufrufen, zurückgeben")

code("Die erste eigene Funktion", [
    "def mittelwert(werte):          # Definition, laeuft noch nicht",
    "    summe = 0",
    "    for w in werte:",
    "        summe = summe + w",
    "    return summe / len(werte)   # Ergebnis zurueckgeben",
    "",
    "",
    "noten = [2, 1, 3, 2]",
    "m = mittelwert(noten)           # Aufruf - jetzt laeuft sie",
    "print(f'Mittelwert: {m:.2f}')   # Mittelwert: 2.00",
    "",
    "print(mittelwert([1, 5]))       # dieselbe Funktion, andere Daten: 3.0",
], size=13)

d.table_top("Die Fachbegriffe dazu", [
    ["Begriff", "im Beispiel", "bedeutet"],
    ["Definition", "def mittelwert(werte):", "die Funktion wird bekannt gemacht"],
    ["Parameter", "werte", "Platzhalter in der Definition"],
    ["Argument", "noten", "der echte Wert beim Aufruf"],
    ["Rückgabewert", "return summe / len(werte)", "das Ergebnis, das zurückkommt"],
    ["Aufruf", "mittelwert(noten)", "hier wird sie ausgeführt"],
], [150, 280, 386], [
    ("**Parameter** steht in der Definition, **Argument** beim Aufruf — der Klassiker in der Klausur", 0),
    ("Ohne **return** gibt eine Funktion **None** zurück: sie tut etwas, liefert aber nichts", 0),
    ("**return** beendet die Funktion sofort — alles danach läuft nicht mehr", 0),
], font_size=11, bold_cols=(0,), mono_cols=(1,))

sg = struktogramm(P("sg-modul.png"), [
    ("do", "Eingabe: Noten"),
    ("call", "mittelwert(noten)"),
    ("call", "beste_note(noten)"),
    ("do", "Ausgabe: Mittelwert und beste Note"),
], W=900, size=25, caption="DIN 66261: der Aufruf eines Unterprogramms hat doppelte Seitenstriche")
d.picture_bullets("Aufrufe im Struktogramm", sg, [
    ("Der Kasten mit den **doppelten Seitenstrichen** ist ein **Unterprogrammaufruf**", 0),
    ("Was darin passiert, steht in einem **eigenen** Struktogramm", 0),
    ("Das Hauptstruktogramm bleibt dadurch kurz und lesbar", 0),
    ("Genau so entsteht ein **Modul**: außen der Name, innen die Lösung", 0),
], pic_w=400)

code("Parameter, Standardwerte, mehrere Rückgaben", [
    "def note(punkte, maximum=60):        # maximum hat einen Standardwert",
    "    prozent = punkte / maximum * 100",
    "    if prozent >= 92: return 1",
    "    if prozent >= 81: return 2",
    "    if prozent >= 67: return 3",
    "    if prozent >= 50: return 4",
    "    if prozent >= 30: return 5",
    "    return 6",
    "",
    "def spanne(werte):                   # zwei Werte auf einmal zurueckgeben",
    "    return min(werte), max(werte)",
    "",
    "print(note(47))          # 2   - maximum bleibt 60",
    "print(note(47, 50))      # 1   - jetzt von 50 Punkten",
    "kleinste, groesste = spanne([3, 1, 4])",
], size=11.5)

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Sichtbarkeit", "Was in der Funktion passiert, bleibt in der Funktion")

code("Lokal und global", [
    "def rechne():",
    "    ergebnis = 42        # lokal - lebt nur waehrend des Aufrufs",
    "    print(ergebnis)",
    "",
    "rechne()                 # 42",
    "print(ergebnis)          # NameError: name 'ergebnis' is not defined",
    "",
    "",
    "zaehler = 0              # global - im ganzen Programm sichtbar",
    "",
    "def zeige():",
    "    print(zaehler)       # lesen: geht",
    "",
    "def erhoehe():",
    "    zaehler = zaehler + 1   # schreiben: UnboundLocalError",
], size=12)

d.bullets("Die Regel dahinter", [
    ("Eine Variable, die **in** einer Funktion entsteht, ist **lokal** — draußen kennt sie niemand", 0),
    ("Das ist ein **Vorteil**: zwei Funktionen dürfen dieselben Namen benutzen, ohne sich zu stören", 0),
    ("Globale Variablen kann man **lesen**, aber nicht ohne Weiteres **beschreiben**", 0),
    ("Guter Stil: Werte **über Parameter hinein**, Ergebnisse **über return heraus** — keine globalen Variablen", 0),
    ("Damit ist eine Funktion eine **Black Box**: Eingabe rein, Ergebnis raus, keine Nebenwirkungen", 0),
])

d.merksatz("Werte gehen über Parameter hinein und über return wieder hinaus. "
           "Alles andere macht aus einer Funktion eine Falle.")

# ---------------------------------------------------------------- Kapitel 04
d.chapter(4, "In der Praxis", "Ein Programm sauber aufteilen")

code("Das Notenprogramm, modular", [
    "def einlesen(anzahl):",
    "    werte = []",
    "    for i in range(anzahl):",
    "        werte.append(int(input(f'Punkte {i+1}: ')))",
    "    return werte",
    "",
    "def mittelwert(werte):",
    "    return sum(werte) / len(werte)",
    "",
    "def note(punkte, maximum=60):",
    "    return 6 - min(5, int(punkte / maximum * 100 // 20))",
    "",
    "def bericht(werte):",
    "    print(f'{len(werte)} Arbeiten, Schnitt {mittelwert(werte):.1f} Punkte')",
    "    print(f'beste {max(werte)}, schlechteste {min(werte)}')",
    "",
    "punkte = einlesen(5)",
    "bericht(punkte)",
], size=11)

d.table_top("Woran man eine gute Funktion erkennt", [
    ["Regel", "gut", "schlecht"],
    ["Eine Aufgabe", "mittelwert(werte)", "alles_machen(daten)"],
    ["Sprechender Name", "beste_note(liste)", "f2(x)"],
    ["Kurz", "unter 20 Zeilen", "80 Zeilen mit vier Themen"],
    ["Keine Nebenwirkungen", "gibt zurück", "verändert heimlich Globales"],
    ["Testbar", "gleiche Eingabe, gleiches Ergebnis", "hängt von der Tageszeit ab"],
], [190, 300, 326], [
    ("Faustregel: Wenn der Name ein **und** enthält, sind es zwei Funktionen", 0),
    ("Ein guter Name macht den Kommentar überflüssig", 0),
], font_size=11, bold_cols=(0,), mono_cols=(1, 2),
   marks={(r, 1): TINT_GREEN for r in range(1, 6)} | {(r, 2): TINT_RED for r in range(1, 6)})

d.bullets("Fun Facts: Funktionen", [
    ("**David Wheeler** erfand 1951 den Unterprogrammaufruf — der **Wheeler Jump** war die erste „Bibliothek“ der Welt", 0),
    ("Von ihm stammt auch der Satz: „Jedes Problem der Informatik löst man mit **einer weiteren Indirektionsebene**“", 0),
    ("Die **NASA**-Programmierrichtlinien begrenzen Funktionen auf **60 Zeilen** — eine Druckseite", 0),
    ("**Copy & Paste** ist der häufigste Weg, wie sich ein Fehler in einem Programm vermehrt", 0),
    ("Das Wort **Bibliothek** für Codesammlungen ist älter als der Personal Computer — Lochkartenstapel lagen wirklich in Schränken", 0),
])

d.bullets("Eure Aufgabe: zerlegen und wiederverwenden", [
    ("Nehmt euer **Notenstatistik**-Programm aus Woche 16 und zerlegt es in Funktionen", 0),
    ("Mindestens: **einlesen()**, **mittelwert()**, **beste()**, **ausgabe()**", 0),
    ("Schreibt eine Funktion **ist_prim(zahl)**, die True oder False zurückgibt — und nutzt sie in einer Schleife von 1 bis 100", 0),
    ("Testet jede Funktion **einzeln** in der Konsole, bevor ihr sie zusammenschaltet", 0),
    ("Zeichnet das Hauptprogramm als Struktogramm mit **Aufruf-Kästen** — jede Funktion bekommt ihr eigenes", 0),
])

d.save()
