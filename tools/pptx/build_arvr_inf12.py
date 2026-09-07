#!/usr/bin/env python3
"""Informatik 12 (BGY), Woche 42 / KW 24: Exkurs - Augmented und Virtual Reality
(Schnuppern in Wahlbereich 3)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from flow_diagrams import pap

d = Deck("ar-vr-exkurs.pptx")
P = lambda n: os.path.join(IMG, n)

d.title("Informatik — Grundkurs 12", "Erweiterte und virtuelle Realität",
        "Mensch-Maschine-Interaktion, die Bauteile einer Datenbrille — und ein Test")

d.chapter(1, "Die Begriffe", "AR, VR und was dazwischen liegt")

d.table_top("Das Realitäts-Virtualitäts-Kontinuum", [
    ["Stufe", "heißt", "Beispiel"],
    ["Realität", "die Welt, ohne Zusatz", "der Blick aus dem Fenster"],
    ["Augmented Reality", "Zusatzinformation im realen Bild", "Navigationspfeil auf der Straße"],
    ["Mixed Reality", "virtuelle Objekte, die die Umgebung kennen", "Möbel, das an der Wand steht"],
    ["Virtual Reality", "vollständig künstliche Umgebung", "Flugsimulator, Spiel"],
], [200, 300, 316], [
    ("Milgram beschrieb dieses **Kontinuum** 1994 — von ganz real bis ganz virtuell", 0),
    ("Der Unterschied AR zu MR: **kennt** das virtuelle Objekt die echte Umgebung?", 0),
], font_size=10.5, bold_cols=(0,), marks={(2, 0): TINT_ORANGE, (4, 0): TINT_BLUE})

d.bullets("Wozu das jeweils taugt", [
    ("**AR** hilft bei Arbeit an einem realen Gegenstand: Wartung, Montage, Chirurgie", 0),
    ("**VR** taugt für Situationen, die real zu teuer oder zu gefährlich sind", 0),
    ("Beides taugt schlecht für Aufgaben, die **Präzision der Hände** verlangen", 0),
    ("Und beides ermüdet schneller als ein Bildschirm — die **Tragedauer** ist begrenzt", 0),
    ("Deshalb ist die erste Frage nicht „was geht?“, sondern **„wofür lohnt es?“**", 0),
])

d.chapter(2, "Die Bauteile", "Was in einer Datenbrille steckt")

dia = pap(P("pap-arvr-inf12.png"), 1560, 340, {
    "s": dict(pos=(200, 130), w=330, h=120, kind="io", text="Sensoren: Kameras, IMU, Tiefe"),
    "t": dict(pos=(590, 130), w=330, h=120, text="Tracking: Position und Blick"),
    "r": dict(pos=(980, 130), w=330, h=120, text="Rendering: Bild je Auge"),
    "d": dict(pos=(1370, 130), w=330, h=120, kind="io", text="Display und Optik"),
}, [("s", "t", ""), ("t", "r", ""), ("r", "d", "")], size=28)
d.picture("Die Kette in einer Datenbrille", dia, [
    ("Das Ganze muss **60- bis 120-mal pro Sekunde** durchlaufen — sonst wird es unangenehm", 0),
    ("Die **Latenz** vom Kopfdrehen bis zum passenden Bild ist die kritische Größe", 0),
], width=816)

d.table_top("Die Bauteile im Einzelnen", [
    ["Bauteil", "Aufgabe", "Grenze"],
    ["Kameras", "Umgebung erfassen, Marker erkennen", "Licht, Spiegelungen"],
    ["Lagesensor (IMU)", "Kopfbewegung messen", "driftet ohne Korrektur"],
    ["Tiefensensor", "Abstände messen", "Reichweite, Sonnenlicht"],
    ["Rechenwerk", "Tracking und Bildberechnung", "Wärme und Akku"],
    ["Display und Optik", "zwei Bilder, je Auge eines", "Sichtfeld, Auflösung"],
], [180, 350, 286], [
    ("Der begrenzende Faktor ist fast immer die **Latenz** oder der **Akku**, nicht die Auflösung", 0),
], font_size=10.5, bold_cols=(0,), marks={(2, 2): TINT_ORANGE})

d.chapter(3, "Bewerten", "Ausprobieren und einordnen")

d.table_top("Der Bewertungsbogen", [
    ["Kriterium", "Frage"],
    ["Nutzen", "Was kann ich damit, was vorher nicht ging?"],
    ["Bedienung", "Verstehe ich ohne Erklärung, was zu tun ist?"],
    ["Belastung", "Wie fühlt es sich nach fünf Minuten an?"],
    ["Daten", "Was nimmt das Gerät auf, und wohin geht es?"],
    ["Aufwand", "Rechtfertigt der Nutzen den Aufwand?"],
], [180, 636], [
    ("Die Zeile **Daten** wird bei AR gern übersehen: eine Datenbrille filmt **ständig** die Umgebung", 0),
    ("Damit filmt sie auch Menschen, die nicht gefragt wurden", 0),
], font_size=11, bold_cols=(0,), marks={(4, 0): TINT_RED})

d.merksatz("Die kritische Größe ist die Latenz: Wer den Kopf dreht, erwartet "
           "das passende Bild sofort. Alles andere macht Übelkeit.")

d.bullets("Fun Facts: AR und VR", [
    ("Das erste **head-mounted display** baute Ivan Sutherland 1968 — es hing an der Decke", 0),
    ("Sein Spitzname: **Sword of Damocles**, weil es so schwer war", 0),
    ("**Motion Sickness** entsteht, wenn Auge und Gleichgewichtssinn Verschiedenes melden", 0),
    ("Unter **20 Millisekunden** Latenz gilt als Ziel — darüber merkt man die Verzögerung", 0),
    ("**Pokémon Go** brachte 2016 AR in den Alltag — technisch simpel, in der Wirkung enorm", 0),
])

d.bullets("Eure Aufgabe", [
    ("Probiert die **AR-Demos** auf dem Tablet aus — mindestens zwei verschiedene", 0),
    ("Füllt für jede den **Bewertungsbogen** aus", 0),
    ("Ordnet jede Demo im **Kontinuum** ein: AR, MR oder VR?", 0),
    ("Beschreibt die **Sensorkette** einer Demo: was wird gemessen, was berechnet?", 0),
    ("Schreibt drei Sätze: **Für welche Aufgabe an unserer Schule lohnt sich AR wirklich?**", 0),
])

d.save()
