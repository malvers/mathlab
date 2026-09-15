#!/usr/bin/env python3
"""Informatik 11 (BGY), last plan row: Ausklang - tidy up accounts and hand-ins, logic puzzles,
look back, thanks and an outlook on Jgst. 12. Short deck, no worksheet.

Chapter pictures come from Wikimedia Commons, each with its licence line on the slide.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("inf11-ausklang.pptx")

d.title("Informatik — Grundkurs 11", "Ausklang",
        "Aufräumen, knobeln, danke sagen — und der Blick nach vorn")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Aufräumen", "Accounts und Abgaben",
          image="img/ausklang-schluessel.jpg",
          credit="Schlüsselbund — Foto: Pittigrilli, CC BY-SA 4.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Various_keys_on_keyring.jpg")

d.bullets("Wo wir stehen", [
    ("Jahresrückblick und Ausblick auf Klasse 12 sind geschafft", 0),
    ("Heute: Accounts und Abgaben **aufräumen** — dann Logik- und Denkspiele", 0),
    ("Leitfrage: Was muss erledigt sein, bevor die Ferien beginnen?", 0),
])

d.bullets("Checkliste zum Schuljahresende", [
    ("**Abgaben**: Ist alles da — Portfolio, Projektdateien, Berichtigungen?", 0),
    ("**Eigene Dateien sichern**: Was ihr behalten wollt, auf ein eigenes Medium — denkt an die 3-2-1-Regel", 0),
    ("**Accounts**: Übungskonten löschen, die ihr nicht mehr braucht — Datenminimierung", 0),
    ("**Freigaben**: geteilte Ordner schließen, die niemand mehr nutzt", 0),
    ("**Abmelden**: an Schulrechnern nirgends eingeloggt bleiben", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Denkspiele", "Logik zum Abschluss",
          image="img/ausklang-hanoi.jpg",
          credit="Türme von Hanoi — Foto: Evanherk, CC BY-SA 3.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Tower_of_Hanoi.jpeg")

d.bullets("Die Türme von Hanoi", [
    ("Erfunden 1883 vom französischen Mathematiker **Édouard Lucas**", 0),
    ("Den Turm auf einen anderen Stab umsetzen — immer nur **eine** Scheibe auf einmal", 0),
    ("Nie eine größere auf eine kleinere Scheibe legen; der dritte Stab hilft", 0),
    ("3 Scheiben schafft man in **7 Zügen** — allgemein braucht man $2^{n} - 1$ Züge für $n$ Scheiben", 0),
    ("Das Bild zeigt 8 Scheiben: $2^{8} - 1 = 255$ Züge", 0),
])

d.two_cols("Zwei Rätsel", [
    ("**Wolf, Ziege, Kohl**", 0),
    ("Ein Bauer muss alle drei über den Fluss bringen", 1),
    ("im Boot hat nur **eins** davon Platz", 1),
    ("allein frisst der Wolf die Ziege und die Ziege den Kohl", 1),
    ("Tipp: Man darf auch etwas zurückbringen", 1),
], [
    ("**Lügner und Ehrliche**", 0),
    ("Auf einer Insel lügen die einen immer, die anderen nie", 1),
    ("A sagt: „Wir beide sind Lügner.“", 1),
    ("Was ist A, was ist B?", 1),
])

d.two_cols("Die Auflösung", [
    ("**Wolf, Ziege, Kohl**: 7 Fahrten", 0),
    ("Ziege hin, leer zurück", 1),
    ("Wolf hin, **Ziege zurück**", 1),
    ("Kohl hin, leer zurück", 1),
    ("Ziege hin — alle drüben", 1),
], [
    ("**Lügner und Ehrliche**", 0),
    ("Wäre A ehrlich, wäre sein Satz falsch — Widerspruch", 1),
    ("also lügt A, und sein Satz ist falsch", 1),
    ("nicht beide lügen — **B ist ehrlich**", 1),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Danke und Ausblick", "Was war, was kommt",
          image="img/ausklang-sonnenaufgang.jpg",
          credit="Sonnenaufgang über dem Schwarzen Meer — Foto: Alexandru Panoiu, CC BY 2.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Sunrise_over_the_Black_Sea.jpg")

d.two_cols("Rückblick und Ausblick", [
    ("**Unser Jahr**", 0),
    ("LB 1: Informatik als Wissenschaft", 1),
    ("LB 2: vom Signal zum Wissen, Quellen, Präsentieren", 1),
    ("LB 3: Schutzziele, Verschlüsselung, Datenschutz", 1),
    ("LB 4: euer Projekt im Team", 1),
    ("Wahlbereich: komprimieren, Fehler erkennen", 1),
], [
    ("**Klasse 12**", 0),
    ("informatische Modellierung von Abläufen", 1),
    ("Datenbanken: ER-Modell, Tabellen, SQL", 1),
    ("Algorithmen und Programme — weiter in Klasse 13", 1),
    ("ihr bringt mit: **Probleme zerlegen, Modelle bilden**", 1),
])

d.merksatz("Danke für ein Jahr voller Fragen, Projekte und guter Ideen — erholt euch gut, "
           "in Klasse 12 geht es weiter!", label="Danke")

d.save()
