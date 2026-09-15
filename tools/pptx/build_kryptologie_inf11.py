#!/usr/bin/env python3
"""Informatik 11 (BGY), LB 3 "IT-Sicherheit und Oekologie", Ustd. 13-14/16: Sicherheitsmechanismen
und Kryptologie - Caesar- und Vigenere-Chiffre, E-Mail-Verschluesselung.

Facts line up with the worksheet HTML/inf11test-kryptologie.html (20 Aufgaben). Worked examples
are tables (Klartext / Schluessel / Geheimtext) instead of code. Chapter pictures come from
Wikimedia Commons, each with its licence line on the slide.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("inf11-kryptologie.pptx")

d.title("Informatik — Grundkurs 11", "Geheimschriften",
        "Von Caesar über Vigenère bis zur verschlüsselten E-Mail")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Caesar", "Verschieben und knacken",
          image="img/kryptologie-chiffrierscheibe.jpg",
          credit="Chiffrierscheibe — Foto: Hubert Berberich, gemeinfrei, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:CipherDisk2000.jpg")

d.bullets("Wo wir stehen", [
    ("Letzte Woche: vertrauenswürdige Software — Signaturen und Prüfsummen tauchten schon auf", 0),
    ("Heute das Werkzeug dahinter: die **Kryptologie**", 0),
    ("**Kryptografie** entwirft Verfahren, **Kryptoanalyse** versucht sie zu brechen — zusammen heißt das Kryptologie", 0),
    ("Leitfrage: Wie sicher ist eine Geheimschrift — und wie schreibe ich eine Mail, die nur der Empfänger lesen kann?", 0),
])

d.bullets("Die Caesar-Chiffre", [
    ("Jeder Buchstabe wird um dieselbe Zahl $k$ im Alphabet **verschoben** — $k$ ist der Schlüssel", 0),
    ("Nach Z geht es wieder bei A weiter", 0),
    ("Als Formel, mit A = 0 bis Z = 25: $c = (m + k) \\bmod 26$", 0),
    ("Entschlüsseln heißt: um $k$ zurückschieben", 0),
    ("Julius Caesar soll mit $k = 3$ geschrieben haben", 0),
])

d.table_top("HALLO mit dem Schlüssel 3", [
    ["Klartext", "H", "A", "L", "L", "O"],
    ["Schlüssel", "+3", "+3", "+3", "+3", "+3"],
    ["Geheimtext", "K", "D", "O", "O", "R"],
], [216, 120, 120, 120, 120, 120], [
    ("H wird zu K, A zu D, L zu O, O zu R", 0),
    ("Doppelte Buchstaben bleiben doppelt: LL wird zu OO", 0),
    ("Ergebnis: **KDOOR**", 0),
], font_size=13, bold_cols=(0,),
   marks={(2, c): TINT_GREEN for c in range(1, 6)})

d.bullets("Warum Caesar leicht zu brechen ist", [
    ("Es gibt 26 Verschiebungen — die Verschiebung 0 ändert nichts, also nur **25 brauchbare Schlüssel**", 0),
    ("Alle durchzuprobieren dauert schon von Hand nur Minuten", 0),
    ("Noch schneller geht es mit der **Häufigkeitsanalyse**", 0),
    ("Sie beruht darauf, dass Buchstaben in einer Sprache **unterschiedlich oft** vorkommen", 0),
])

d.table_top("Die Häufigkeitsanalyse", [
    ["Buchstabe", "E", "N", "I", "S", "R"],
    ["Anteil im Deutschen", "17 %", "10 %", "8 %", "7 %", "7 %"],
], [216, 120, 120, 120, 120, 120], [
    ("Das **E** ist mit Abstand am häufigsten, dann folgen N und I (Werte gerundet)", 0),
    ("Bei Caesar überträgt sich diese Verteilung unverändert in den Geheimtext", 0),
    ("Der häufigste Geheimbuchstabe ist also sehr wahrscheinlich das E", 0),
    ("Beispiel: Ist im Geheimtext H am häufigsten, dann ist $k = 3$", 0),
], font_size=13, bold_cols=(0,), marks={(1, 1): TINT_ORANGE})

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Vigenère", "Viele Verschiebungen statt einer",
          image="img/kryptologie-vigenere.jpg",
          credit="Blaise de Vigenère — Stich von Léonard Gaultier, gemeinfrei, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Blaise_de_Vigenere,_R3A20687_119.jpg")

d.bullets("Die Vigenère-Chiffre", [
    ("Ein **Schlüsselwort** wird immer wieder über den Klartext gelegt", 0),
    ("Jeder Buchstabe des Schlüsselworts gibt eine eigene Verschiebung: A = 0, B = 1, C = 2 und so weiter", 0),
    ("Derselbe Klartextbuchstabe wird so zu **verschiedenen** Geheimbuchstaben", 0),
    ("Damit verwischt die einfache Häufigkeitsverteilung", 0),
])

d.table_top("GEHEIM mit dem Schlüsselwort ROT", [
    ["Klartext", "G", "E", "H", "E", "I", "M"],
    ["Schlüssel", "R", "O", "T", "R", "O", "T"],
    ["Verschiebung", "17", "14", "19", "17", "14", "19"],
    ["Geheimtext", "X", "S", "A", "V", "W", "F"],
], [186, 105, 105, 105, 105, 105, 105], [
    ("Das doppelte **E** wird einmal zu S, einmal zu V — die Häufigkeiten verwischen", 0),
    ("Kleines Beispiel wie auf dem Blatt: **AB** mit dem Schlüssel **BA** ergibt **BB**", 0),
], font_size=13, bold_cols=(0,),
   marks={(3, 2): TINT_ORANGE, (3, 4): TINT_ORANGE})

d.bullets("Warum Vigenère trotzdem fällt", [
    ("Das Schlüsselwort **wiederholt** sich", 0),
    ("Wiederholte Textstellen ergeben dann oft wiederholte Geheimstellen", 0),
    ("Aus deren Abständen folgt die **Schlüssellänge** — das zeigte Friedrich Kasiski 1863", 0),
    ("Danach zerfällt der Text in mehrere Caesar-Chiffren — und jede fällt durch Häufigkeitsanalyse", 0),
])

d.bullets("Das One-Time-Pad", [
    ("Der Schlüssel ist **zufällig**, so lang wie der Text und wird **nur einmal** verwendet", 0),
    ("Dann ist das Verfahren **beweisbar sicher**: Der Geheimtext verrät nichts über den Klartext", 0),
    ("Praktisch scheitert es am Austausch der langen Schlüssel und an der Einmaligkeit", 0),
    ("Vigenère mit einem zufälligen Einmal-Schlüssel in Textlänge — das ist genau das One-Time-Pad", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Gute Verfahren", "Kerckhoffs und die Schlüssellänge",
          image="img/kryptologie-enigma.jpg",
          credit="Enigma — Foto: Rama, CC BY-SA 2.0 fr, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Enigma-IMG_0487-black.jpg")

d.bullets("Das Kerckhoffssche Prinzip", [
    ("Die Sicherheit muss **allein auf dem Schlüssel** beruhen — nicht auf der Geheimhaltung des Verfahrens", 0),
    ("Verfahren werden früher oder später bekannt, Schlüssel lassen sich wechseln", 0),
    ("Offene Verfahren können von vielen geprüft werden", 0),
    ("**Security by Obscurity** — Sicherheit durch Verschleierung — bricht zusammen, sobald das Verfahren bekannt wird", 0),
    ("Formuliert hat das Auguste Kerckhoffs 1883", 0),
])

d.bullets("Die Schlüssellänge", [
    ("Jedes zusätzliche Bit **verdoppelt** die Zahl der möglichen Schlüssel", 0),
    ("Caesar hat 25 Schlüssel — moderne Verfahren wie AES haben $2^{128}$ und mehr", 0),
    ("$2^{128}$ ist eine Zahl mit 39 Stellen: Alle durchzuprobieren ist praktisch aussichtslos", 0),
    ("Zu kurze Schlüssel entwerten auch ein gutes Verfahren", 0),
    ("Verfahren **nie selbst erfinden** — nur jahrelange öffentliche Prüfung deckt Schwächen auf", 0),
])

# ---------------------------------------------------------------- Kapitel 04
d.chapter(4, "Schlüsselpaare", "Asymmetrisch verschlüsseln, E-Mails schützen",
          image="img/kryptologie-schluesselpaar.png",
          credit="Öffentlicher und privater Schlüssel — Grafik: Bananenfalter, CC0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Orange_blue_public_key_cryptography_de.svg")

d.two_cols("Symmetrisch und asymmetrisch", [
    ("**Symmetrisch**", 0),
    ("ein gemeinsamer Schlüssel zum Ver- und Entschlüsseln", 1),
    ("sehr schnell", 1),
    ("Problem: Der Schlüssel muss **sicher ausgetauscht** werden", 1),
    ("Beispiele: Caesar, Vigenère, AES", 1),
], [
    ("**Asymmetrisch**", 0),
    ("ein Schlüsselpaar: öffentlich und privat", 1),
    ("den öffentlichen Schlüssel darf jeder kennen", 1),
    ("entschlüsseln kann nur, wer den privaten hat", 1),
    ("langsamer — Beispiel: RSA", 1),
])

d.table_top("Wer benutzt welchen Schlüssel?", [
    ["Ziel", "der Absender nimmt", "der Empfänger nimmt"],
    ["verschlüsseln", "den öffentlichen Schlüssel des Empfängers", "seinen eigenen privaten Schlüssel"],
    ["signieren", "seinen eigenen privaten Schlüssel", "den öffentlichen Schlüssel des Absenders"],
], [176, 320, 320], [
    ("Die Signatur weist **Absender und Unverändertheit** nach — die Mail bleibt aber lesbar", 0),
    ("Für Vertraulichkeit muss zusätzlich verschlüsselt werden", 0),
    ("**Hybride Verfahren**: Ein symmetrischer Sitzungsschlüssel wird asymmetrisch übertragen — so arbeitet TLS", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 0): TINT_BLUE, (2, 0): TINT_ORANGE})

d.bullets("E-Mail-Verschlüsselung in der Praxis", [
    ("**Transportverschlüsselung** schützt den Weg zwischen den Servern — auf den Servern liegt die Mail im Klartext", 0),
    ("**Ende-zu-Ende**: Nur Absender und Empfänger können die Nachricht lesen", 0),
    ("**OpenPGP** nutzt ein Web of Trust: Nutzer beglaubigen gegenseitig ihre Schlüssel", 0),
    ("**S/MIME** setzt dagegen auf zentrale Zertifizierungsstellen", 0),
    ("Selten genutzt, weil Einrichtung und Schlüsselaustausch vielen zu aufwendig sind — Messenger erledigen das automatisch", 0),
])

d.merksatz("Caesar und Vigenère fallen durch Häufigkeiten und Wiederholungen. Sicher ist ein "
           "offenes, geprüftes Verfahren mit langem Schlüssel — verschlüsselt wird mit dem "
           "öffentlichen Schlüssel des Empfängers, signiert mit dem eigenen privaten.")

d.bullets("Fun Facts", [
    ("Die Vigenère-Chiffre beschrieb zuerst Giovan Battista **Bellaso** 1553 — Vigenère wurde sie erst später zugeschrieben", 0),
    ("Rund 300 Jahre galt sie als unknackbar: „le chiffre indéchiffrable“", 0),
    ("**ROT13** ist Caesar mit $k = 13$: Zweimal angewendet ergibt sich wieder der Klartext", 0),
    ("Die Enigma wurde im Zweiten Weltkrieg gebrochen — mit Vorarbeit polnischer Mathematiker um Marian Rejewski", 0),
])

d.bullets("Eure Aufgabe", [
    ("**Unplugged**: Chiffrierscheibe basteln und einen Caesar-Text per Häufigkeitsanalyse knacken", 0),
    ("**CrypTool**: mit Vigenère verschlüsseln und die Schlüssellänge bestimmen lassen", 0),
    ("**Live-Demo**: Schlüsselpaar erzeugen, eine Mail signieren und verschlüsseln — was sieht der Empfänger?", 0),
    ("Zum Schluss: **Aufgaben (20)** auf der Planseite — Lösung pro Aufgabe zum Aufklappen", 0),
])

d.save()
