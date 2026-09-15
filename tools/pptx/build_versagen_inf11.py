#!/usr/bin/env python3
"""Informatik 11 (BGY), Woche 16 / KW 51 (live plan): Bedrohungsanalysen II - Katastrophen,
technisches und menschliches Versagen, Social Engineering (LB 3, Ustd. 3-4/16).

Facts line up with the worksheet HTML/inf11test-versagen.html (20 Aufgaben: menschliche Fehler,
Datensicherung, 3-2-1-Regel, Notfallplanung). Social engineering is shown from the defender's side
only. Chapter pictures come from Wikimedia Commons, each with its licence line on the slide.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("inf11-versagen.pptx")

d.title("Informatik — Grundkurs 11", "Versagen, Katastrophen, Täuschung",
        "Bedrohungsanalyse II: Technik fällt aus, Menschen irren — und manche werden getäuscht")

d.bullets("Wo wir stehen", [
    ("Letzte Woche: digitale Angriffe — Schadsoftware, Phishing, DDoS", 0),
    ("Aber: Der größte Teil aller Ausfälle hat **keine böse Absicht**", 0),
    ("Heute: Katastrophen, technisches und menschliches Versagen — und Social Engineering", 0),
    ("Leitfrage: Was schützt Daten, wenn gar kein Angreifer das Problem ist?", 0),
])

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Vier Arten von Bedrohung", "Absicht, Technik, Mensch, Natur",
          image="img/versagen-headcrash.jpg",
          credit="Festplatte mit Head-Crash — Foto: Jeepika, CC0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Head_crash.JPG")

d.table_top("Die vollständige Bedrohungsanalyse", [
    ["Bedrohung", "Beispiel"],
    ["vorsätzlicher Angriff", "Ransomware, Phishing, Sabotage"],
    ["technisches Versagen", "Festplatte defekt, Server überlastet"],
    ["menschlicher Fehler", "falsche Datei gelöscht, Stick verloren"],
    ["höhere Gewalt", "Feuer, Wasser, Stromausfall"],
], [260, 556], [
    ("Häufigste Ursache für Datenverlust: **menschliche Fehler** und fehlende oder ungeprüfte Sicherungen", 0),
    ("Spektakuläre Fälle sind seltener als banale", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 0): TINT_RED, (2, 0): TINT_BLUE, (3, 0): TINT_ORANGE, (4, 0): TINT_GREEN})

d.bullets("Überlastung und Missbrauch", [
    ("Auch ohne Angriff kann ein Dienst **überlastet** sein — wenn alle zur selben Minute klicken", 0),
    ("Beispiele: Anmeldeschluss, Ticketverkauf, Zeugnistag im Schulportal", 0),
    ("**Missbrauch**: Geräte und Konten für Zwecke nutzen, für die sie nicht gedacht sind", 0),
    ("**Single Point of Failure**: ein Server, eine Leitung — fällt sie aus, steht alles", 0),
])

d.table_top("Die Risikomatrix", [
    ["", "Schaden gering", "Schaden hoch"],
    ["Eintritt häufig", "regeln", "sofort handeln"],
    ["Eintritt selten", "beobachten", "vorsorgen"],
], [216, 300, 300], [
    ("Eintrittswahrscheinlichkeit und Schadenshöhe zusammen ergeben die **Dringlichkeit**", 0),
    ("Selten, aber existenzbedrohend — etwa ein Brand — zählt trotzdem", 0),
    ("So lassen sich Maßnahmen **priorisieren**", 0),
], font_size=12, bold_cols=(0,),
   marks={(1, 1): TINT_ORANGE, (1, 2): TINT_RED, (2, 1): TINT_GREEN, (2, 2): TINT_ORANGE})

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Social Engineering", "Der Mensch als Einfallstor",
          image="img/versagen-drehsperre.jpg",
          credit="Zutrittssperren im Eingang — Foto: Fabtron, CC BY-SA 4.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Q-Lane_Turnstiles.jpg")

d.bullets("Die Technik wird umgangen", [
    ("**Social Engineering**: menschliches Verhalten gezielt ausnutzen, um an Informationen oder Zugänge zu kommen", 0),
    ("Angriffspunkte: **Hilfsbereitschaft, Autorität, Zeitdruck**", 0),
    ("Die Technik wird dabei **umgangen**, nicht überwunden", 0),
    ("Deshalb hilft vor allem **Schulung** — und klare Regeln, die den Druck herausnehmen", 0),
])

d.table_top("Drei typische Maschen", [
    ["Masche", "So läuft es", "richtige Reaktion"],
    ["falscher Support", "Anrufer will dringend das Passwort", "nie nennen, bekannte Nummer zurückrufen"],
    ["Phishing", "Mail mit Link und Zeitdruck", "Adresse selbst eingeben"],
    ["Tailgating", "jemand geht mit durch die offene Tür", "Vereinzelung, klare Regeln"],
], [180, 320, 316], [
    ("Echter Support fragt **nie** nach dem Passwort", 0),
    ("Beim Tailgating wird **Höflichkeit** zum Sicherheitsrisiko", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Checkliste für verdächtige Mails", [
    ("Wer schreibt wirklich? Name und Adresse des Absenders lassen sich fälschen", 0),
    ("Wohin führt der Link? Mit der Maus darüber zeigen — **nicht klicken**", 0),
    ("Wird Druck gemacht? „Heute noch“ und „Konto gesperrt“ sind typische Druckmittel", 0),
    ("Wird etwas verlangt, das der echte Absender nie verlangt — Passwort, TAN, Code?", 0),
    ("Im Zweifel: die Seite über die **selbst eingegebene Adresse** öffnen oder zurückrufen", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Datensicherung", "Kopien, die im Ernstfall da sind",
          image="img/versagen-bandarchiv.jpg",
          credit="Archiv mit Datenbändern — Foto: CDC, gemeinfrei, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Data_tape_storage_room,_NCHS.jpg")

d.table_top("Die 3-2-1-Regel", [
    ["Zahl", "Regel", "schützt gegen"],
    ["3", "drei Kopien der Daten", "den Defekt eines Geräts"],
    ["2", "auf zwei verschiedenen Medien", "systematische Fehler eines Medientyps"],
    ["1", "eine Kopie außer Haus", "Feuer, Wasser, Diebstahl"],
], [100, 360, 356], [
    ("Sicherung im selben Raum: Feuer oder Wasser treffen **Original und Kopie** zugleich", 0),
    ("Dauerhaft verbundene Sicherung: **Ransomware** verschlüsselt sie mit", 0),
], font_size=12, bold_cols=(0,),
   marks={(1, 0): TINT_ORANGE, (2, 0): TINT_GREEN, (3, 0): TINT_BLUE})

d.bullets("Nur eine geprüfte Sicherung zählt", [
    ("Erst beim **Zurückspielen** zeigt sich, ob eine Sicherung vollständig und lesbar ist", 0),
    ("Typische Fehler: fehlende Dateien, falsche Rechte, unlesbare Medien", 0),
    ("Eine nie getestete Sicherung ist nur eine **Vermutung**", 0),
    ("Der Test gehört fest in den Betriebsplan", 0),
])

d.two_cols("RAID und USV — keine Sicherung", [
    ("**RAID**", 0),
    ("mehrere Festplatten im Verbund", 1),
    ("Spiegelung: Fällt eine aus, übernimmt die andere", 1),
    ("schützt gegen Hardwaredefekte", 1),
    ("nicht gegen Löschen, Ransomware, Feuer — der Löschbefehl wird mitgespiegelt", 1),
], [
    ("**USV**", 0),
    ("unterbrechungsfreie Stromversorgung", 1),
    ("überbrückt einen Stromausfall für Minuten, nicht Stunden", 1),
    ("genug für ein geordnetes Herunterfahren", 1),
    ("ohne sie drohen beschädigte Dateisysteme", 1),
])

# ---------------------------------------------------------------- Kapitel 04
d.chapter(4, "Regeln für den Ernstfall", "Organisation fängt Fehler ab",
          image="img/versagen-treffpunkt.jpg",
          credit="Notfall-Treffpunkt — Foto: Wilkering, gemeinfrei, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Emergency_meeting_point_Abbecke.jpg")

d.table_top("Organisatorische Maßnahmen", [
    ["Maßnahme", "Wirkung"],
    ["klare Zuständigkeiten", "jeder weiß, wer handelt"],
    ["Vier-Augen-Prinzip", "eine zweite Person prüft kritische Schritte mit"],
    ["regelmäßige Schulung", "macht Regeln erst wirksam"],
    ["Zugänge beim Ausscheiden entziehen", "keine verwaisten Konten als Einfallstor"],
], [330, 486], [
    ("Technik verhindert keine Denkfehler — Organisation fängt sie ab", 0),
    ("Das Vier-Augen-Prinzip schützt zugleich vor **Missbrauch** durch Einzelne", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Der Notfallplan", [
    ("**Business-Continuity-Plan**: wie der Betrieb im Notfall weiterläuft", 0),
    ("Er benennt kritische Abläufe, Ausweichwege, Zuständige und ihre Erreichbarkeit", 0),
    ("Notfallkontakte **auf Papier**: Im Ernstfall fällt oft genau das System aus, in dem sie stehen", 0),
    ("Ungeprobt ist jeder Plan nur Papier", 0),
])

d.bullets("Melden statt verschweigen", [
    ("**DSGVO**: meldepflichtig, wenn personenbezogene Daten betroffen sind und ein **Risiko** für die Betroffenen besteht", 0),
    ("Die Frist für die Meldung an die Aufsichtsbehörde ist kurz: **72 Stunden**", 0),
    ("Nicht jeder Virenfund ist meldepflichtig — ein verschlüsselter verlorener Stick wird anders bewertet", 0),
    ("**Fehlerkultur**: Wer Strafe fürchtet, meldet später oder gar nicht — und der Schaden wächst", 0),
])

d.merksatz("Die meisten Datenverluste haben keine böse Absicht — gegen sie helfen geprüfte "
           "Sicherungen nach der 3-2-1-Regel, klare Regeln und eine Kultur, in der man Fehler sofort meldet.")

d.bullets("Fun Facts", [
    ("1947 fanden Techniker im Rechner Harvard Mark II eine **Motte** im Relais — sie klebt bis heute im Logbuch", 0),
    ("1998 löschte bei Pixar ein versehentlicher Befehl große Teile von **Toy Story 2** — die Sicherung war fehlerhaft", 0),
    ("Gerettet hat den Film eine Kopie auf dem Heimrechner einer Mitarbeiterin", 0),
    ("2021 brannte in Straßburg ein Rechenzentrum — wessen Sicherung im selben Gebäude lag, verlor seine Daten", 0),
])

d.bullets("Eure Aufgabe", [
    ("**Szenarioanalyse** mit Fallkarten: Welche Bedrohungsart — und wo in der Risikomatrix?", 0),
    ("**Rollenspiel** zu dritt: Anrufer, Angerufene, Beobachter — die Angerufene gibt nichts heraus", 0),
    ("**Phishing-Beispiele** mit der Checkliste prüfen: Woran erkennt ihr die Fälschung?", 0),
    ("**Passwort-Check** an Beispielpasswörtern — nie das eigene Passwort in eine Website tippen", 0),
    ("Zum Schluss: **Aufgaben (20)** auf der Planseite — Lösung pro Aufgabe zum Aufklappen", 0),
])

d.save()
