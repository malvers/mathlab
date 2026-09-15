#!/usr/bin/env python3
"""Informatik 11 (BGY), Woche 5 / KW 38 (live plan; inf11.html still numbers it 4 / KW 37): Historische
Meilensteine - Rechenhilfsmittel und Rechentechnik (LB 1, Ustd. 5-6/6, LB 1 abgeschlossen).

Facts line up with the worksheet HTML/inf11test-meilensteine.html (20 Aufgaben), so the deck
and the sheet never tell two different stories. The seven portraits are the ones the plan names:
Pascal, Leibniz, Babbage, Hollerith, Zuse, von Neumann, Turing.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("inf11-meilensteine.pptx")

d.title("Informatik — Grundkurs 11", "Historische Meilensteine",
        "Von Abakus und Rechenuhr über Zuse bis zum Mikroprozessor")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Rechnen mit Kugeln und Zahnrädern", "Rechenhilfsmittel und mechanische Rechenmaschinen")

d.bullets("Wo wir stehen", [
    ("Letzte Woche: Informatik als **Medium anderer Wissenschaften**", 0),
    ("Heute der Blick zurück: Woher kommen die **Rechner**, mit denen alle Fächer arbeiten?", 0),
    ("Mit dieser Stunde schließen wir **Lernbereich 1** ab", 0),
    ("Leitfrage: Was musste erfunden werden, bis eine Maschine **selbst rechnet** — und sich **programmieren** lässt?", 0),
])

d.two_cols("Hilfsmittel oder Maschine?", [
    ("**Rechenhilfsmittel**", 0),
    ("Abakus, Rechentafel, Rechenschieber", 1),
    ("Der Mensch führt jeden Rechenschritt aus", 1),
    ("Das Hilfsmittel hält nur Zwischenstände fest", 1),
    ("Tempo hängt an der Übung", 1),
], [
    ("**Rechenmaschine**", 0),
    ("Rechenuhr, Pascaline, Staffelwalze", 1),
    ("Die Maschine führt den Rechenschritt selbst aus", 1),
    ("Der Mensch stellt nur Zahlen ein", 1),
    ("Der Übertrag läuft mechanisch", 1),
])

d.bullets("Der Abakus: Speicher zum Anfassen", [
    ("Seit **Jahrtausenden** im Einsatz — in Mesopotamien, Rom, China, Japan, Russland", 0),
    ("Die Kugeln **speichern das Zwischenergebnis sichtbar** — Rechnen ganz ohne Schrift", 0),
    ("Geübte rechnen damit so schnell, dass 1946 ein Abakus einen **elektrischen Rechner** im Wettrechnen schlug", 0),
    ("Um 1620 kommt der **Rechenschieber**: Multiplizieren über Logarithmen", 0),
    ("Bis in die 1970er Jahre das Werkzeug der Ingenieure — dann verdrängt vom **Taschenrechner**", 0),
])

d.table_top("Die ersten Rechenmaschinen", [
    ["Jahr", "Wer", "Maschine", "Was war neu?"],
    ["1623", "Wilhelm Schickard", "Rechenuhr", "Addieren und Subtrahieren mit Zehnerübertrag"],
    ["1642", "Blaise Pascal", "Pascaline", "Addiermaschine für die Steuerarbeit des Vaters"],
    ["1673", "Gottfried Wilhelm Leibniz", "Staffelwalze", "alle vier Grundrechenarten"],
], [70, 220, 150, 376], [
    ("Der schwierige Teil ist der **Zehnerübertrag** — Schickard löste ihn mit einem Zahnrad mit einem einzigen Zahn", 0),
    ("Leibniz beschrieb außerdem das **Dualsystem** mit 0 und 1 — die Sprache heutiger Rechner", 0),
    ("Programmierbar war keine dieser Maschinen: Sie rechneten nur, was man einstellte", 0),
], font_size=11, bold_cols=(1,))

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Programme auf Papier", "Lochkarte, Babbage, Lovelace, Hollerith")

d.bullets("Die Lochkarte: Steuerung zum Anfassen", [
    ("1805: Der **Jacquard-Webstuhl** liest Lochkarten, die das Muster Reihe für Reihe vorgeben", 0),
    ("Loch oder kein Loch — die Information ist **zweiwertig**, wie später ein Bit", 0),
    ("Andere Karten, anderes Muster — ohne die Maschine umzubauen: die **Idee des Programms**", 0),
    ("Bis in die 1970er Jahre bleibt die Lochkarte der **maschinenlesbare Datenträger** für Programme und Daten", 0),
])

d.bullets("Charles Babbage und Ada Lovelace", [
    ("Babbage plant ab 1834 die **Analytical Engine** — mit Rechenwerk, Speicher und Lochkarten-Eingabe", 0),
    ("Der Aufbau gleicht schon einem heutigen Rechner — gebaut wurde sie **nie**", 0),
    ("**Ada Lovelace** notiert 1843 dafür ein Rechenverfahren für die Bernoulli-Zahlen — **mit Schleife**", 0),
    ("Deshalb gilt sie als **erste Programmiererin**", 0),
    ("Sie ahnt schon: Eine solche Maschine könnte auch **Symbole und Musik** verarbeiten, nicht nur Zahlen", 0),
])

d.bullets("Hermann Hollerith: Daten in Massen", [
    ("Die **US-Volkszählung** von 1880 brauchte rund acht Jahre für die Auswertung", 0),
    ("Für 1890 baut Hollerith eine **elektrische Zählmaschine**: Jede Person ist eine Lochkarte", 0),
    ("Ein Stift fällt durch das Loch, schließt einen **Stromkreis** — und ein Zählwerk springt weiter", 0),
    ("Das Ergebnis liegt viel schneller vor — die **Datenverarbeitung** als Geschäft ist geboren", 0),
    ("Aus Holleriths Firma wird 1924 **IBM**", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Die ersten Computer", "Zuse, Turing, von Neumann")

d.bullets("Konrad Zuse und die Z3", [
    ("1941 in Berlin: die **Z3** — der erste funktionsfähige, programmgesteuerte Rechner", 0),
    ("Sie rechnet **binär**, mit rund 2600 **Relais** als Schaltelementen", 0),
    ("Das Programm steht auf gelochtem **Kinofilm** — gelesen Befehl für Befehl", 0),
    ("Das Original verbrennt 1943 im Bombenkrieg; ein **Nachbau** steht im Deutschen Museum in München", 0),
])

d.bullets("Alan Turing: Was ist berechenbar?", [
    ("1936 beschreibt Turing eine **gedachte Maschine**: ein Band, ein Lese- und Schreibkopf, feste Regeln", 0),
    ("Damit definiert er allgemein, was **Berechenbarkeit** bedeutet", 0),
    ("Und er zeigt: Es gibt Probleme, die **kein Rechner** je lösen kann", 0),
    ("Im Zweiten Weltkrieg hilft er in Bletchley Park, die **Enigma** zu entschlüsseln", 0),
])

d.bullets("Das Von-Neumann-Prinzip", [
    ("1945 beschreibt **John von Neumann** den Aufbau, nach dem bis heute fast jeder Rechner arbeitet", 0),
    ("Kern: **Programm und Daten liegen im selben Speicher**", 0),
    ("Bausteine: **Rechenwerk, Steuerwerk, Speicher, Ein- und Ausgabe**", 0),
    ("Ein neues Programm wird **geladen wie Daten** — vorher wurden Rechner dafür neu verkabelt", 0),
])

# ---------------------------------------------------------------- Kapitel 04
d.chapter(4, "Vom Rechensaal auf den Schreibtisch", "Röhre, Transistor, Chip")

d.table_top("Rechnergenerationen", [
    ["Schaltelement", "grob ab", "Beispiel", "Folge"],
    ["Relais", "1940", "Zuse Z3", "langsam, klackernd"],
    ["Elektronenröhre", "1946", "ENIAC", "schnell, aber heiß und störanfällig"],
    ["Transistor", "1955", "Großrechner der Firmen", "kleiner, kühler, langlebiger"],
    ["integrierter Schaltkreis", "1965", "Großrechner-Familien", "viele Transistoren auf einem Chip"],
    ["Mikroprozessor", "1971", "Intel 4004, später der PC", "ganzer Prozessor auf einem Chip"],
], [210, 90, 226, 290], [
    ("Nur ein **grobes Raster** — die Techniken überlappen sich und lösen sich nicht scharf ab", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 0): TINT_ORANGE, (2, 0): TINT_RED, (3, 0): TINT_GREEN, (4, 0): TINT_BLUE,
          (5, 0): TINT_ORANGE})

d.bullets("Transistor und Chip", [
    ("1946: **ENIAC** füllt einen Saal — rund 17 500 Röhren, etwa 27 Tonnen", 0),
    ("1947: der **Transistor** — kleiner als die Röhre, weniger Wärme, längere Lebensdauer", 0),
    ("Ende der 1950er: der **integrierte Schaltkreis** — viele Transistoren auf einem Halbleiterplättchen", 0),
    ("**Mooresches Gesetz**: Die Zahl der Transistoren pro Chip verdoppelt sich etwa alle zwei Jahre", 0),
    ("1971: **Intel 4004** — der ganze Prozessor auf einem Chip, rund 2300 Transistoren", 0),
])

d.bullets("Der Rechner für alle", [
    ("1975 bis 1981: der **Personal Computer** — für Einzelpersonen bezahlbar und bedienbar", 0),
    ("1981 setzt der **IBM PC** den Standard, 1984 bringt der Macintosh **Maus und Fenster** zu allen", 0),
    ("1989 schlägt **Tim Berners-Lee** am CERN das World Wide Web vor", 0),
    ("2007 wandert der Rechner in die **Hosentasche** — das Smartphone", 0),
])

d.table_top("Der Zeitstrahl auf einen Blick", [
    ["Jahr", "Meilenstein", "Jahr", "Meilenstein"],
    ["1623", "Rechenuhr (Schickard)", "1941", "Z3 (Zuse)"],
    ["1642", "Pascaline (Pascal)", "1945", "Von-Neumann-Prinzip"],
    ["1673", "Staffelwalze (Leibniz)", "1947", "Transistor"],
    ["1805", "Jacquard-Webstuhl", "1971", "Intel 4004"],
    ["1843", "erstes Programm (Lovelace)", "1981", "IBM PC"],
    ["1890", "Volkszählung (Hollerith)", "1989", "World Wide Web"],
    ["1936", "Turingmaschine", "2007", "Smartphone"],
], [70, 338, 70, 338], [
    ("Diese Jahreszahlen sind die **Stationen** unseres Zeitstrahls", 0),
], font_size=11, bold_cols=(0, 2))

d.merksatz("Ein Rechenhilfsmittel unterstützt den Menschen, eine Rechenmaschine führt den "
           "Rechenschritt selbst aus — und seit Zuse und von Neumann steuert ein gespeichertes "
           "Programm die Maschine.")

d.bullets("Fun Facts", [
    ("Schickard beschrieb seine Rechenuhr in Briefen an **Johannes Kepler** — das Exemplar für Kepler verbrannte", 0),
    ("1947 fand man im Harvard-Rechner Mark II eine **Motte** im Relais — sie klebt bis heute im Logbuch: der erste echte **Bug**", 0),
    ("Babbages Differenzmaschine Nr. 2 wurde erst **1991** nach seinen Plänen gebaut — und sie rechnet richtig", 0),
    ("Ein Smartphone-Chip von heute hat über **15 Milliarden** Transistoren — Millionen Mal so viele wie der Intel 4004", 0),
])

d.bullets("Eure Aufgabe: Kurzporträt für den Zeitstrahl", [
    ("In Gruppen **eine Persönlichkeit** ziehen: Pascal, Leibniz, Babbage, Hollerith, Zuse, von Neumann, Turing", 0),
    ("**Recherchieren** (20 Minuten): Lebensdaten, Erfindung, was war daran neu — und die Quelle", 0),
    ("Eine **Karte für den Zeitstrahl** gestalten: Jahr, Bild, ein Satz „Was war neu?“", 0),
    ("**Vorstellen** (2 Minuten), dann ordnet das Plenum die Karte am Zeitstrahl ein", 0),
    ("Zum Schluss: **Aufgaben (20)** auf der Planseite — Lösung pro Aufgabe zum Aufklappen", 0),
])

d.save()
