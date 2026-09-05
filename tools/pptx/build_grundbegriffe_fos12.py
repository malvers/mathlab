#!/usr/bin/env python3
"""Programmiersprachen als Schnittstelle Mensch-Maschine (FOS 12, Woche 11, LB 2)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, py_parts
from design_lib import CODE_INK, CODE_MUTED, ORANGE, GREEN, RED
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from flow_diagrams import struktogramm, pap

d = Deck("programmiersprachen-grundbegriffe.pptx")
P = lambda n: os.path.join(IMG, n)

d.title("Informatik — FOS 12", "Programmiersprachen",
        "Schnittstelle Mensch–Maschine: Algorithmus, Syntax, Semantik")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Zwei Welten", "Der Mensch denkt in Sätzen, die Maschine kennt nur an und aus")

d.bullets("Ein Rechner versteht kein Deutsch", [
    ("„Rechne mir bitte den Durchschnitt aus“ — für einen Prozessor **bedeutungslos**", 0),
    ("Eine CPU kennt nur **Bitmuster**: lade, addiere, springe, speichere", 0),
    ("Eine **Programmiersprache** ist der Übersetzer dazwischen — für **beide** Seiten lesbar", 0),
    ("Sie ist **künstlich**: erfunden, exakt festgelegt, ohne Ausnahmen und ohne Ironie", 0),
    ("Der Preis dafür: **jede** Kleinigkeit muss gesagt werden — der Rechner rät nie", 0),
])

d.table_top("Vier Ebenen zwischen Mensch und Maschine", [
    ["Ebene", "Beispiel", "wer versteht das?", "Nähe zur Maschine"],
    ["natürliche Sprache", "„Addiere 97 dazu“", "Mensch", "keine — mehrdeutig"],
    ["Hochsprache", "x = x + 97", "Mensch + Übersetzer", "gering"],
    ["Assembler", "ADD AL, 97", "Fachleute", "hoch — ein Befehl je Schritt"],
    ["Maschinencode", "00000100 01100001", "die CPU", "das ist die CPU"],
], [170, 210, 200, 236], [
    ("Nach **oben** wird es bequemer, nach **unten** genauer und schneller", 0),
    ("Wir arbeiten in einer **Hochsprache** — hier: **Python**", 0),
    ("Der Weg nach unten heißt **Übersetzen**: Compiler oder Interpreter erledigen ihn", 0),
], font_size=11.5, bold_cols=(0,),
   marks={(2, c): TINT_GREEN for c in range(4)})

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Der Algorithmus", "Die Idee ist älter als jeder Computer")

d.bullets("Was ist ein Algorithmus?", [
    ("**Algorithmus** = eindeutige, endliche Beschreibung eines Lösungsweges", 0),
    ("Er beschreibt **wie** gerechnet wird — nicht, **womit** gerechnet wird", 0),
    ("Kochrezept, Bauanleitung, schriftliche Division: alles Algorithmen **ohne** Computer", 0),
    ("Der Name kommt von **al-Chwarizmi**, Bagdad, um 825 — sein Buch lehrte das Rechnen mit Ziffern", 0),
    ("Ein Programm ist ein Algorithmus, **aufgeschrieben in einer Programmiersprache**", 0),
])

d.table_top("Fünf Eigenschaften — und woran man sie prüft", [
    ["Eigenschaft", "bedeutet", "Testfrage", "Gegenbeispiel"],
    ["Eindeutigkeit", "jeder Schritt ist klar", "Kann man ihn verschieden lesen?", "„etwas Salz dazu“"],
    ["Ausführbarkeit", "jeder Schritt ist machbar", "Kann der Ausführende das?", "„teile durch 0“"],
    ["Endlichkeit", "hört irgendwann auf", "Endet es garantiert?", "„zähle bis unendlich“"],
    ["Determiniertheit", "gleiche Eingabe, gleiches Ergebnis", "Kommt zweimal dasselbe raus?", "„wähle zufällig“"],
    ["Allgemeingültigkeit", "gilt für eine ganze Klasse", "Geht es auch mit anderen Zahlen?", "„gib 42 aus“"],
], [160, 220, 240, 196], [
    ("Alle fünf zusammen machen aus einer Beschreibung einen **Algorithmus**", 0),
    ("In der Prüfung: Eigenschaft **nennen** und am Beispiel **begründen**", 0),
], font_size=11, bold_cols=(0,), marks={(r, 3): TINT_RED for r in range(1, 6)})

sg = struktogramm(P("sg-kaffee.png"), [
    ("do", "Wasser einfüllen"),
    ("do", "Kaffeepulver in den Filter geben"),
    ("do", "Maschine einschalten"),
    ("while", "solange Wasser im Tank ist", [
        ("do", "warten"),
    ]),
    ("if", "Tasse ist voll", [("do", "Maschine ausschalten")], [("do", "weiter warten")]),
], W=1000, size=27, caption="Alltagsalgorithmus - eindeutig, ausführbar, endlich")
d.picture_bullets("Ein Algorithmus ohne Computer", sg, [
    ("Jeder Schritt ist **eindeutig** und **ausführbar** — ein Mensch ist der Prozessor", 0),
    ("Die Schleife endet, weil der Tank **leer** wird: damit ist der Ablauf **endlich**", 0),
    ("Diese Darstellung heißt **Struktogramm** — mehr dazu in Woche 12", 0),
    ("Beachtet: kein einziger Schritt sagt etwas über **Computer** aus", 0),
], pic_w=440)

d.merksatz("Ein Algorithmus sagt, WIE gerechnet wird — unabhängig davon, "
           "WER oder WAS am Ende rechnet.")

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Syntax und Semantik", "Form und Bedeutung sind zwei verschiedene Dinge")

d.two_cols("Die beiden Grundbegriffe", [
    ("**Syntax** — die Form", 0),
    ("Welche Zeichenfolgen sind überhaupt erlaubt?", 1),
    ("Klammern, Doppelpunkte, Einrückung, Schreibweise", 1),
    ("Verstoß = das Programm startet gar nicht erst", 1),
    ("Vergleich: Rechtschreibung und Grammatik", 1),
], [
    ("**Semantik** — die Bedeutung", 0),
    ("Was tut eine syntaktisch korrekte Anweisung?", 1),
    ("Der Rechner tut, was dasteht — nicht, was gemeint war", 1),
    ("Verstoß = das Programm läuft, aber falsch", 1),
    ("Vergleich: „Der Hund beißt den Mann“ ist korrekt — und trotzdem nicht gemeint", 1),
])

d.code("Zwei Fehler, zwei Welten", [py_parts(l) for l in [
    "# 1) Syntaxfehler - Python startet nicht",
    "if note < 5",
    "    print('bestanden')",
    "",
    "#    ^ der Doppelpunkt fehlt: SyntaxError: expected ':'",
    "",
    "# 2) Semantischer Fehler - Python laeuft, das Ergebnis ist falsch",
    "note = 5",
    "if note < 5:",
    "    print('bestanden')",
    "else:",
    "    print('nicht bestanden')",
    "",
    "#    Ausgabe: nicht bestanden - gemeint war <= 4, geschrieben steht < 5",
]], size=13)

d.table_top("Drei Fehlerarten — wann fallen sie auf?", [
    ["Fehlerart", "wann sichtbar", "Beispiel", "wer findet ihn"],
    ["Syntaxfehler", "vor dem Start", "Doppelpunkt fehlt", "der Übersetzer, sofort"],
    ["Laufzeitfehler", "während der Ausführung", "Division durch 0", "das Programm stürzt ab"],
    ["Logikfehler", "nie von allein", "< statt <=", "nur ein Testfall"],
], [150, 210, 200, 256], [
    ("Der **gefährlichste** ist der Logikfehler: das Programm läuft und **lügt**", 0),
    ("Deshalb gehören zu jedem Programm **Testfälle** mit bekanntem Ergebnis", 0),
], font_size=11.5, bold_cols=(0,),
   marks={(1, 1): TINT_GREEN, (2, 1): TINT_ORANGE, (3, 1): TINT_RED})

# ---------------------------------------------------------------- Kapitel 04
d.chapter(4, "Vom Text zum Prozess", "Compiler, Interpreter und die Sprachfamilien")

d.table_top("Compiler oder Interpreter?", [
    ["", "Compiler", "Interpreter"],
    ["Vorgehen", "übersetzt einmal komplett", "liest und führt Zeile für Zeile aus"],
    ["Ergebnis", "ausführbare Datei (.exe)", "kein eigenes Ergebnis, nur Wirkung"],
    ["Fehler", "alle vor dem Start gemeldet", "erst beim Erreichen der Zeile"],
    ["Tempo", "schnell im Lauf", "langsamer, dafür sofort startklar"],
    ["Sprachen", "C, C++, Java (zu Bytecode)", "Python, JavaScript, PHP"],
], [110, 300, 340], [
    ("**Python** ist eine Interpretersprache — deshalb geht Ausprobieren so schnell", 0),
    ("Moderne Systeme mischen beides (**JIT**): erst interpretieren, heiße Stellen übersetzen", 0),
], font_size=11.5, bold_cols=(0,))

d.bullets("Warum ausgerechnet Python?", [
    ("**Wenig Zeremonie**: kein Gerüst, keine Typangaben, Einrückung statt Klammern", 0),
    ("Der Code liest sich fast wie der **Algorithmus** — das ist in diesem Lernbereich das Ziel", 0),
    ("**Sofort testbar**: eine Zeile in die Konsole, sofort das Ergebnis", 0),
    ("Überall vorhanden: Schule, Uni, Datenauswertung, KI, Mikrocontroller", 0),
    ("Der Lehrplan sagt „**höhere Sprache nach Wahl**“ — die Konzepte gelten für alle", 0),
])

d.bullets("Fun Facts: Programmiersprachen", [
    ("**Ada Lovelace** schrieb 1843 den ersten Algorithmus für eine Maschine, die nie gebaut wurde", 0),
    ("**Grace Hopper** baute 1952 den ersten Compiler — und klebte 1947 eine echte Motte ins Logbuch: der erste **Bug**", 0),
    ("**Python** heißt nicht nach der Schlange, sondern nach **Monty Python's Flying Circus**", 0),
    ("Es gibt über **700** Programmiersprachen — und Sprachen, die nur zum Ärgern erfunden wurden (**Brainfuck**, 8 Befehle)", 0),
    ("**COBOL** von 1959 läuft heute noch: ein großer Teil des weltweiten Zahlungsverkehrs", 0),
])

d.bullets("Eure Aufgabe: Algorithmen prüfen", [
    ("Schreibt einen Algorithmus für **Schuhe binden** — so eindeutig, dass ein Roboter ihn ausführen kann", 0),
    ("Tauscht mit dem Nachbarn und **spielt ihn wörtlich durch** — jede Lücke aufschreiben", 0),
    ("Prüft an eurem Text alle **fünf Eigenschaften** und notiert je einen Beleg", 0),
    ("Findet zu jeder der drei **Fehlerarten** ein eigenes Beispiel aus dem Alltag", 0),
    ("Frage zum Nachdenken: Ist ein **Kochrezept** determiniert?", 0),
])

d.save()
