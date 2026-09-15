#!/usr/bin/env python3
"""Informatik 11 (BGY), Woche 14 / KW 49 (live plan): Wiederholung vor Klassenarbeit 1 -
LB 1 "Informatik als Wissenschaft" and LB 2 "Persoenliches Informationsmanagement".

A short review deck. Facts line up with the worksheet HTML/inf11test-wiederholung1.html
(20 Aufgaben). Chapter pictures come from Wikimedia Commons, each with its licence line on the slide.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("inf11-wiederholung1.pptx")

d.title("Informatik — Grundkurs 11", "Wiederholung vor Klassenarbeit 1",
        "Lernbereich 1 und 2 in drei Blöcken — dann 20 Aufgaben zum Selbsttest")

d.bullets("Wo wir stehen", [
    ("Lernbereich 2 ist abgeschlossen — zuletzt: Medien beurteilen, Urheberrecht, Datenschutz", 0),
    ("Diese Woche schreiben wir **Klassenarbeit 1** über Lernbereich 1 und 2 (45 Minuten)", 0),
    ("Heute alles einmal durch: Wissenschaftsbereiche, Daten und Informationen, Recherche und Recht", 0),
    ("Leitfrage: Kann ich jede Antwort **begründen** — nicht nur ankreuzen?", 0),
])

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Informatik als Wissenschaft", "Vier Bereiche und die ersten Rechner",
          image="img/wiederholung1-turingmaschine.jpg",
          credit="Modell einer Turingmaschine — Foto: Rocky Acosta, CC BY 3.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Turing_Machine_Model_Davey_2012.jpg")

d.table_top("Vier Bereiche der Informatik", [
    ["Bereich", "Worum es geht", "typisches Beispiel"],
    ["theoretisch", "Was ist überhaupt berechenbar?", "Halteproblem"],
    ["praktisch", "Software planvoll bauen", "Compiler, Software Engineering"],
    ["technisch", "der Rechner selbst", "Prozessor, Betriebssystem"],
    ["angewandt", "Informatik in anderen Fächern", "CT-Bild, Wettervorhersage"],
], [150, 360, 306], [
    ("**Z3** (Konrad Zuse, 1941): erster funktionsfähiger, programmgesteuerter Rechner — **binär**", 0),
    ("Ihr Programm kam vom Lochstreifen — das **gespeicherte Programm** kam erst mit von Neumann", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 0): TINT_ORANGE, (2, 0): TINT_GREEN, (3, 0): TINT_RED, (4, 0): TINT_BLUE})

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Daten und Informationen", "Begriffe, Bits, Digitalisieren",
          image="img/wiederholung1-lochstreifen.jpg",
          credit="Lochstreifen mit 5 und 8 Spuren — Foto: TedColes, gemeinfrei, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:PaperTapes-5and8Hole.jpg")

d.bullets("Begriffe, die sitzen müssen", [
    ("**Nachricht**: die Zeichenfolge — **Information**: ihre Bedeutung für den Empfänger", 0),
    ("**Daten**: die maschinell verarbeitbare Form der Nachricht", 0),
    ("Mit $n$ Bit gibt es $2^{n}$ Werte: 12 Bit ergeben $2^{12} = 4096$", 0),
    ("**EVA-Prinzip**: Eingabe, Verarbeitung, Ausgabe — mit Speicherung heißt es EVAS", 0),
    ("**Single Point of Failure**: eine Stelle, deren Ausfall das ganze System stilllegt", 0),
])

d.table_top("Digitalisieren in drei Schritten", [
    ["Schritt", "betrifft", "was passiert"],
    ["abtasten", "die Zeitachse", "in festen Abständen messen"],
    ["quantisieren", "die Werteachse", "auf feste Stufen runden (8 Bit: 256 Stufen)"],
    ["codieren", "die Darstellung", "jede Stufe als Bitfolge schreiben"],
], [170, 220, 426], [
    ("Verloren sind die Zwischenwerte **zwischen** zwei Messpunkten und **innerhalb** einer Stufe", 0),
    ("Feiner abtasten verkleinert den Verlust — beseitigt ihn aber nie", 0),
], font_size=11, bold_cols=(0,))

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Recherche, Medien, Recht", "Beschaffen, prüfen, veröffentlichen",
          image="img/wiederholung1-justitia.jpg",
          credit="Justitia in Burgdorf — Foto: Dirrival, CC BY-SA 4.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Statue_der_Justitia_(Burgdorf).jpg")

d.bullets("Informationen beschaffen und prüfen", [
    ("Kreislauf: **Bedarf klären, beschaffen, aufbereiten, nutzen, bewerten**", 0),
    ("Drei Seiten zitieren dieselbe Studie: Das ist **ein** Beleg, nicht drei", 0),
    ("Glaubwürdig: nachvollziehbare **Belege** und eine benannte, verantwortliche Stelle", 0),
    ("Quellenangabe im Netz: Autor oder Herausgeber, Titel, URL, **Abrufdatum**", 0),
    ("y-Achse ab 90 statt ab 0: Kleine Unterschiede wirken **dramatisch groß**", 0),
])

d.bullets("Veröffentlichen mit einem CMS", [
    ("Grundprinzip: **Inhalt, Struktur und Gestaltung** werden getrennt gehalten", 0),
    ("Der Inhalt liegt in der Datenbank, die Gestaltung in Vorlagen", 0),
    ("Ein neues Design ändert deshalb keinen einzigen Text", 0),
    ("**Rollen- und Rechtekonzept**: wer Inhalte anlegen, ändern oder veröffentlichen darf", 0),
])

d.table_top("Recht in fünf Sätzen", [
    ["Stichwort", "Das gilt"],
    ["Urheberrecht", "entsteht mit der Schöpfung — beim Foto mit der Aufnahme, ohne Anmeldung"],
    ["Plagiat", "fremde Leistung übernehmen, ohne sie zu kennzeichnen"],
    ["Zitat", "mit Beleg ausdrücklich erlaubt"],
    ["Bilder", "bei unklaren Rechten: freie Lizenz nehmen oder selbst fotografieren"],
    ["Datenminimierung", "nur die Daten erheben, die für den Zweck nötig sind"],
], [190, 626], [
    ("Eine Quellenangabe **ersetzt** keine fehlenden Rechte — und das ©-Zeichen ist nur ein Hinweis", 0),
], font_size=11, bold_cols=(0,))

d.merksatz("In der Arbeit zählt die Begründung: Bereich, Begriff oder Regel nennen — "
           "und in einem Satz sagen, warum.")

d.bullets("Fun Facts", [
    ("Das Wort **Informatik** prägte Karl Steinbuch 1957 — aus Information und Automatik", 0),
    ("Die originale **Z3** wurde 1943 bei einem Bombenangriff zerstört — ein Nachbau steht im Deutschen Museum", 0),
    ("Alan Turing bewies 1936: Kein Programm kann für **jedes** Programm entscheiden, ob es anhält", 0),
    ("Das Urheberrecht erlischt in Deutschland erst **70 Jahre** nach dem Tod des Urhebers", 0),
])

d.bullets("So gehst du in die Arbeit", [
    ("**Erst alles überfliegen**, dann mit der sichersten Aufgabe anfangen", 0),
    ("Bei Auswahlfragen jede falsche Antwort **begründet** ausschließen", 0),
    ("Begriffe mit einem **Beispiel** absichern — das zeigt, dass du sie verstanden hast", 0),
    ("Bit- und Speicheraufgaben mit Zwischenschritt aufschreiben", 0),
    ("Am Ende die Frage noch einmal lesen: Habe ich beantwortet, was gefragt war?", 0),
])

d.bullets("Eure Aufgabe", [
    ("**Wiederholung an Stationen** in Gruppen: Bereiche und Meilensteine, Bit und Digitalisieren, Quellen und Grafiken, CMS und Recht", 0),
    ("An jeder Station: Fragen gegenseitig stellen — die Antwort zählt nur **mit Begründung**", 0),
    ("Notiert, was noch hakt: Das ist eure Lernliste bis zur Arbeit", 0),
    ("Zum Schluss: **Aufgaben (20)** auf der Planseite — Lösung pro Aufgabe zum Aufklappen", 0),
])

d.save()
