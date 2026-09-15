#!/usr/bin/env python3
"""Informatik 11 (BGY), LB 3 "IT-Sicherheit und Oekologie", Ustd. 15-16/16: Rechtliche Grundlagen
zum Datenschutz - informationelle Selbstbestimmung, DSGVO; Unternehmensrichtlinien; kurzer
Halbjahresrueckblick (LB 3 abgeschlossen).

Facts line up with the worksheet HTML/inf11test-datenschutzrecht.html (20 Aufgaben). Legal
statements stay general and well established - no invented paragraphs. Chapter pictures come
from Wikimedia Commons, each with its licence line on the slide.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("inf11-datenschutzrecht.pptx")

d.title("Informatik — Grundkurs 11", "Datenschutz ist Grundrecht",
        "Informationelle Selbstbestimmung, DSGVO — und was davon im Schulalltag gilt")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Selbstbestimmung", "Ein Grundrecht aus Karlsruhe",
          image="img/datenschutzrecht-bverfg.jpg",
          credit="Bundesverfassungsgericht in Karlsruhe — Foto: Guido Radig, CC BY-SA 3.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Bundesverfassungsgericht_-_Karlsruhe.JPG")

d.bullets("Wo wir stehen", [
    ("Bisher: wie man Daten **technisch** schützt — bis zur Verschlüsselung", 0),
    ("Heute: welche Daten man überhaupt **verarbeiten darf** — das regelt das Recht", 0),
    ("Die letzte Stunde von Lernbereich 3 — mit kurzem Halbjahresrückblick", 0),
    ("Leitfrage: Wer darf über meine Daten bestimmen — und was darf eine Schule damit tun?", 0),
])

d.bullets("Das Volkszählungsurteil 1983", [
    ("1983 war eine Volkszählung mit umfangreichen Fragebögen geplant — es gab breiten Protest", 0),
    ("Das **Bundesverfassungsgericht** stoppte sie und begründete das **Recht auf informationelle Selbstbestimmung**", 0),
    ("Jede und jeder bestimmt grundsätzlich selbst über Preisgabe und Verwendung der eigenen Daten", 0),
    ("Abgeleitet aus dem **allgemeinen Persönlichkeitsrecht** im Grundgesetz", 0),
    ("Ausdrücklich steht es dort **nicht**", 1),
])

d.table_top("Recht auf mehreren Ebenen", [
    ["Ebene", "Beispiel", "Kernaussage"],
    ["UN", "Menschenrechtserklärung 1948, Art. 12", "Schutz des Privatlebens"],
    ["Europarat", "Datenschutzkonvention von 1981", "erstes verbindliches Abkommen"],
    ["EU", "Grundrechtecharta Art. 8, DSGVO", "Schutz personenbezogener Daten"],
    ["Deutschland", "Grundgesetz, BDSG, Landesgesetze", "ergänzen die DSGVO"],
], [150, 360, 306], [
    ("Die **DSGVO** gilt seit 2018 unmittelbar in allen EU-Staaten", 0),
    ("Sie geht nationalem Recht vor — Deutschland regelt nur, wo sie Spielraum lässt", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 0): TINT_BLUE, (2, 0): TINT_GREEN, (3, 0): TINT_ORANGE, (4, 0): TINT_RED})

d.bullets("Regeln im Unternehmen", [
    ("Gesetze setzen den Rahmen, **Unternehmensrichtlinien** regeln den Alltag im Betrieb", 0),
    ("Beispiele: Passwortregeln, private Nutzung von Dienstgeräten, Umgang mit Kundendaten", 0),
    ("Beschäftigte werden auf Vertraulichkeit verpflichtet und geschult", 0),
    ("Konzerne mit Standorten außerhalb der EU nutzen verbindliche interne Regeln: **Binding Corporate Rules**", 0),
    ("Auch die Schule hat solche Regeln: die Nutzungsordnung für Rechner und WLAN", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Die DSGVO", "Regeln für jede Verarbeitung",
          image="img/datenschutzrecht-europaparlament.jpg",
          credit="Plenarsaal des Europäischen Parlaments — Foto: Sebastian Wallroth, CC BY 4.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:Hemicycle_of_the_European_Parliament,_Strasbourg_2023_001.jpg")

d.bullets("Personenbezogene Daten", [
    ("Alle Angaben, die sich auf eine **bestimmte oder bestimmbare** Person beziehen", 0),
    ("Bestimmbar heißt: mit Zusatzwissen zuordenbar", 0),
    ("Dazu zählen auch Kennnummern, Standortdaten und Online-Kennungen — etwa eine IP-Adresse", 0),
    ("**Pseudonymisierte** Daten bleiben personenbezogen: Es gibt eine Zuordnungstabelle", 0),
    ("Nur **anonymisierte** Daten lassen keinen Personenbezug mehr zu — dann gilt die DSGVO nicht", 0),
])

d.bullets("Verbot mit Erlaubnisvorbehalt", [
    ("Jede Verarbeitung ist **verboten**, solange keine Rechtsgrundlage sie erlaubt", 0),
    ("Rechtsgrundlagen sind etwa: Einwilligung, Vertrag, rechtliche Pflicht, öffentliche Aufgabe, berechtigtes Interesse", 0),
    ("**Zeugnisse**: Die Schule erfüllt eine rechtliche Pflicht", 0),
    ("Eine Einwilligung wäre ungeeignet — sie müsste ja widerrufbar sein", 1),
    ("**Klassenfoto auf der Homepage**: freiwillig — dafür braucht es eine Einwilligung", 0),
])

d.table_top("Grundsätze der DSGVO", [
    ["Grundsatz", "heißt"],
    ["Zweckbindung", "nur für den Zweck nutzen, für den die Daten erhoben wurden"],
    ["Datenminimierung", "nur erheben, was für den Zweck nötig ist"],
    ["Speicherbegrenzung", "nur so lange aufbewahren, wie der Zweck es verlangt"],
    ["Richtigkeit", "falsche Daten berichtigen oder löschen"],
    ["Integrität, Vertraulichkeit", "Daten durch Technik und Organisation schützen"],
], [250, 566], [
    ("Klassenlisten sind kein Adressverteiler für Werbung — das verletzt die **Zweckbindung**", 0),
    ("Speicherbegrenzung hat mit Speicherplatz nichts zu tun: Danach wird gelöscht oder anonymisiert", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Besonders geschützte Daten", [
    ("Besondere Kategorien: Gesundheit, Religion, politische Meinung, ethnische Herkunft, Sexualleben, Gewerkschaft, Biometrie", 0),
    ("Ihre Verarbeitung ist grundsätzlich **untersagt** und nur in engen Ausnahmen erlaubt — sie können zu Diskriminierung führen", 0),
    ("Schulnoten gehören **nicht** dazu — sie sind normale personenbezogene Daten, aber trotzdem vertraulich", 0),
    ("**Minderjährige**: Online-Dienste brauchen unter **16 Jahren** die Zustimmung der Sorgeberechtigten", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Rechte und Pflichten", "Betroffene, Verantwortliche, Aufsicht",
          image="img/datenschutzrecht-archiv.jpg",
          credit="Aktenarchiv — Foto: RomanDeckert, CC BY-SA 4.0, Wikimedia Commons",
          credit_url="https://commons.wikimedia.org/wiki/File:CICR-ICRC-PublicArchives_WWII-files_RomanDeckert09062020.jpg")

d.table_top("Die Rechte der Betroffenen", [
    ["Recht", "bedeutet"],
    ["Auskunft", "erfahren, welche Daten gespeichert sind — in der Regel binnen eines Monats"],
    ["Berichtigung", "falsche Daten korrigieren lassen"],
    ["Löschung", "Daten entfernen lassen, wenn der Zweck entfallen ist"],
    ["Einschränkung", "Daten vorerst sperren lassen, etwa während einer Prüfung"],
    ["Datenübertragbarkeit", "die eigenen Daten in einem gängigen Format mitnehmen"],
    ["Widerspruch", "einer Verarbeitung widersprechen, etwa für Werbung"],
], [220, 596], [
    ("Die **Auskunft** ist die Grundlage aller anderen Rechte", 0),
    ("Die Löschung kann durch Aufbewahrungspflichten begrenzt sein", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Pflichten der Verantwortlichen", [
    ("**Verarbeitungsverzeichnis**: Übersicht aller Verarbeitungen mit Zweck, Daten und Empfängern", 0),
    ("**Datenpanne**: unverzüglich, möglichst binnen **72 Stunden** der Aufsichtsbehörde melden, wenn ein Risiko besteht", 0),
    ("Bei hohem Risiko sind zusätzlich die Betroffenen zu benachrichtigen", 1),
    ("**Datenschutz-Folgenabschätzung**, wenn eine Verarbeitung voraussichtlich ein hohes Risiko bedeutet", 0),
    ("**Cloud-Dienst**: Auftragsverarbeitungsvertrag und Prüfung, wo die Daten verarbeitet werden", 0),
])

d.bullets("Wer berät, wer kontrolliert?", [
    ("Die **Datenschutzbeauftragte** berät, überwacht und ist Ansprechstelle — sie entscheidet nicht selbst", 0),
    ("Sie ist weisungsfrei und darf wegen ihrer Aufgabe nicht benachteiligt werden", 0),
    ("Die Verantwortung bleibt bei der Leitung — in der Schule bei der Schulleitung", 0),
    ("**Aufsichtsbehörden** kontrollieren und verhängen Bußgelder", 0),
    ("Bis 20 Millionen Euro oder 4 % des weltweiten Jahresumsatzes", 1),
])

d.bullets("Privacy by Design und by Default", [
    ("**Privacy by Design**: Datenschutz schon beim **Entwurf** eines Systems einbauen — nachträglich geht es kaum", 0),
    ("**Privacy by Default**: Die datenschutzfreundlichste Einstellung ist die **Voreinstellung**", 0),
    ("Wer mehr freigeben will, stimmt aktiv zu", 1),
    ("**Vorausgefüllte Häkchen** sind keine wirksame Einwilligung — so hat es der Europäische Gerichtshof entschieden", 0),
    ("Eine Einwilligung muss aktiv erteilt werden und widerrufbar sein", 0),
])

d.bullets("Abwägen und das Wichtigste im Alltag", [
    ("Datenschutz und **Informationsfreiheit**: Presse- und Meinungsfreiheit können den Datenschutz begrenzen", 0),
    ("Keines der beiden Rechte geht **immer** vor — abgewogen wird im Einzelfall", 0),
    ("Die wichtigste Regel im Schulalltag: nur erheben und weitergeben, was für die Aufgabe **wirklich nötig** ist", 0),
    ("Was nicht erhoben wurde, kann nicht abfließen — Verschlüsselung ist erst die zweite Verteidigungslinie", 0),
])

d.table_top("Halbjahresrückblick", [
    ["Lernbereich", "Kernfrage", "zum Mitnehmen"],
    ["1 Informatik als Wissenschaft", "Was ist Informatik?", "vier Teilgebiete, historische Meilensteine"],
    ["2 Informationsmanagement", "Wie finde und teile ich Wissen?", "Signal bis Daten, Quellen, Präsentieren"],
    ["3 IT-Sicherheit und Ökologie", "Wie schütze ich Daten?", "Schutzziele, Maßnahmen, Kryptologie, Recht"],
], [236, 250, 330], [
    ("Als Nächstes: **Wiederholung und Klassenarbeit 2** zu Lernbereich 3", 0),
    ("Danach startet Lernbereich 4 — das Projekt", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 0): TINT_ORANGE, (2, 0): TINT_BLUE, (3, 0): TINT_GREEN})

d.merksatz("Über die eigenen Daten bestimmt jede und jeder selbst — so das "
           "Bundesverfassungsgericht 1983. Die DSGVO macht daraus Regeln: Verarbeitung nur mit "
           "Rechtsgrundlage, nur für den Zweck und nur so viel wie nötig.")

d.bullets("Fun Facts", [
    ("Das erste Datenschutzgesetz der Welt trat **1970 in Hessen** in Kraft", 0),
    ("Der **28. Januar** ist Europäischer Datenschutztag — an diesem Tag 1981 wurde die Datenschutzkonvention des Europarats zur Unterzeichnung aufgelegt", 0),
    ("Die Volkszählung fand nach dem Urteil erst **1987** statt — mit neuem Gesetz", 0),
    ("2023 verhängte die irische Aufsicht gegen Meta ein DSGVO-Bußgeld von **1,2 Milliarden Euro** — so viel wie nie zuvor", 0),
])

d.bullets("Eure Aufgabe", [
    ("**Textarbeit**: DSGVO-Auszüge lesen — Grundsätze und Betroffenenrechte in eigenen Worten", 0),
    ("**Fallkarten**: Ist das erlaubt? Rechtsgrundlage nennen, Entscheidung begründen", 0),
    ("**Diskussion**: Wo endet der Datenschutz, wo beginnt die Informationsfreiheit?", 0),
    ("Zum Schluss: **Aufgaben (20)** auf der Planseite — Lösung pro Aufgabe zum Aufklappen", 0),
])

d.save()
