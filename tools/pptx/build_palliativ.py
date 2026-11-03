#!/usr/bin/env python3
"""Geriatrische Palliativversorgung - Ute Hartenstein's talk as a DocPoint deck in our style.

Doc, 03.11.2026: after the PowerPoint design proposal for her ("Die zunehmende Bedeutung der geriatrischen
Palliativversorgung in Anbetracht des demographischen Wandels", 03.09.2024) - "ein Deck in unserem Stil bauen,
genauso wie du das da gemacht hast". Same ten slide types as the proposal, her own content and numbers.

Published on Doc's word (03.11.2026: "push pls"), behind a password since the same day ("mach bitte ein pwd
davor"): save() is followed by deck_seal.mjs, so no unsealed copy stays in HTML/decks/. The password lives in the
Keychain (service docpoint-deck-palliativversorgung), never here. The talk, its numbers and the two foreign
pictures (Destatis chart, Letzte Hilfe) are hers - should she object, this deck comes down again.

    python3 tools/pptx/html_deck.py build_palliativ.py
"""
import os
import subprocess
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck
import palliativ_svg as P

# the pictures from her deck, copied out of the .pptx (outside the repo); asset() puts them into HTML/decks/img/
SRC = os.environ.get("PALLIATIV_IMG", os.path.join(os.path.dirname(os.path.abspath(__file__)), "img", "palliativ"))
DESTATIS = os.path.join(SRC, "pflegequote-destatis-2021.png")
LETZTE_HILFE = os.path.join(SRC, "letzte-hilfe-koffer.jpg")

d = MathDeck("palliativversorgung.pptx")

d.title("Ute Hartenstein",
        "Geriatrische Palliativversorgung",
        "Ihre zunehmende Bedeutung in Anbetracht des demographischen Wandels")

# ------------------------------------------------------------- Kapitel 01 ---
d.chapter(1, "Demographischer Wandel", "Zahlen, Prognosen und was sie für die Versorgung bedeuten")

d.figure("(Nur) eine Zahl …", *P.zahl())
d.figure("Herausforderungen", *P.herausforderungen())
d.picture_bullets("Altersabhängigkeit der Pflegebedürftigkeit", DESTATIS, [
    ("**Ab 90** sind rund 7 von 10 Männern und mehr als 8 von 10 Frauen pflegebedürftig", 0),
    ("Pflegequote nach Altersgruppen 2021, Anteil an der jeweiligen Bevölkerungsgruppe", 1),
    ("Quelle: Statistisches Bundesamt (Destatis), 2023", 1),
], pic_w=470)

# ------------------------------------------------------------- Kapitel 02 ---
d.chapter(2, "Hausärztliche Versorgung", "Am Beispiel einer Praxis in Weinböhla")

d.figure("(M)eine hausärztliche Praxis …", *P.praxis())
d.bullets("Hausärztliche Versorgung …", [
    ("**Langfristig:** nicht wenige Tage wie in der Klinik, sondern Monate bis Jahrzehnte", 0),
    ("**Vertrauen:** im besten Fall eine gute, vertrauensvolle Arzt-Patient-Beziehung", 0),
    ("**Kommunikation:** Grundlage für Beratung in komplexen Situationen, auch am Lebensende", 0),
    ("**Vorsorge:** Patientenverfügung, Vorsorgevollmacht und Notfallbögen", 0),
    ("**Palliativer Bedarf:** am Lebensende erkennen, um optimal zu versorgen", 0),
])

# ------------------------------------------------------------- Kapitel 03 ---
d.chapter(3, "Palliativversorgung", "Wer versorgt wen – und was es noch braucht")

d.figure("Struktur der ambulanten Palliativversorgung", *P.stufen())
d.picture_bullets("Letzte Hilfe Kurse", LETZTE_HILFE, [
    ("**4 Module** in 4 Unterrichtsstunden", 0),
    ("**1** Sterben ist ein Teil des Lebens", 0),
    ("**2** Vorsorgen und Entscheiden", 0),
    ("**3** Leiden lindern", 0),
    ("**4** Abschied nehmen", 0),
    ("Idee: Georg Bollig, 2008 · www.letztehilfe.info", 0),
], pic_w=360, side="left")

d.merksatz("Es gibt viel zu tun …", label="Vielen Dank für Ihre Aufmerksamkeit")

path = d.save()
subprocess.run(["node", os.path.join(os.path.dirname(os.path.abspath(__file__)), "deck_seal.mjs"), path], check=True)
