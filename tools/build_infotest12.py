#!/usr/bin/env python3
"""Weekly 10-question essentials quizzes for FOS 12 Informatik, LB 1 Datenbanken.

Writes HTML/infotest12-<thema>.html on the shared js/quiz-engine.js (same pattern as the
Mathe-11 sets). Question text is plain text (the engine never uses innerHTML); the correct
answer is spread over A-D by a hash of quiz id + question number.
"""
import hashlib
import random, json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
HTML = os.path.join(HERE, "..", "HTML")

# (slug, week nr, KW, topic, questions)  - each question: (text, correct, [3 wrong], [2 steps])
QUIZZES = [
 ("anforderungen", 3, 36, "Anforderungen an Datenbanken", [
  ("Was bedeutet Redundanz in einer Datenbank?",
   "Dieselbe Information ist an mehreren Stellen gespeichert",
   ["Eine Tabelle hat keinen Primärschlüssel", "Ein Feld ist leer (NULL)", "Zwei Tabellen haben denselben Namen"],
   ["Redundanz = Mehrfachspeicherung derselben Information.", "Sie ist der Nährboden für Anomalien."]),
  ("Der Raum eines Kurses steht in fünf Zeilen. Beim Umzug wird eine Zeile vergessen. Wie heißt das Problem?",
   "Änderungsanomalie (Update-Anomalie)",
   ["Einfügeanomalie", "Löschanomalie", "Referenzanomalie"],
   ["Eine Änderung muss an mehreren Stellen nachgezogen werden.", "Wird eine vergessen, widerspricht sich die Tabelle."]),
  ("Eine neue Lehrkraft hat noch keinen Kurs und kann deshalb nicht in die Kursliste eingetragen werden. Welche Anomalie?",
   "Einfügeanomalie",
   ["Änderungsanomalie", "Löschanomalie", "Schlüsselanomalie"],
   ["Ohne Schüler und Kurs gibt es keine vollständige Zeile.", "Der Ausweg über NULL-Felder erzeugt Datenmüll."]),
  ("Der einzige Teilnehmer eines Kurses wird gelöscht, und mit ihm verschwinden Kurs, Lehrkraft und Raum. Welche Anomalie?",
   "Löschanomalie",
   ["Einfügeanomalie", "Änderungsanomalie", "Konsistenzanomalie"],
   ["Löschen eines Datensatzes vernichtet unbeteiligte Informationen.", "Ursache ist die Redundanz in einer einzigen Tabelle."]),
  ("Was bedeutet Konsistenz?",
   "Die Datenbank widerspricht sich nicht",
   ["Alle Felder sind gefüllt", "Jede Tabelle hat genau eine Zeile pro Schüler", "Die Daten sind verschlüsselt"],
   ["Konsistent = widerspruchsfrei: jede Frage hat genau eine Antwort.", "Konsistenz ist ein Zustand, Integritätsregeln sichern ihn."]),
  ("Welche Regel verlangt, dass jeder Datensatz einen eindeutigen, nie leeren Primärschlüssel hat?",
   "Entitätsintegrität",
   ["Referentielle Integrität", "Wertebereichsintegrität", "Semantische Integrität"],
   ["Entität = Datensatz; jeder braucht einen eindeutigen Schlüssel.", "NULL als Schlüssel ist verboten."]),
  ("Ein Kurs verweist auf die Lehrkraft Nr. 9, die es nicht gibt. Welche Regel ist verletzt?",
   "Referentielle Integrität",
   ["Entitätsintegrität", "Wertebereichsintegrität", "Konsistenzregel"],
   ["Ein Fremdschlüssel muss auf einen vorhandenen Datensatz zeigen.", "Das DBMS lehnt den Verweis ins Leere ab."]),
  ("Note 7, Geburtsdatum 31.02.2009, Klasse FO12x: welche Regel greift?",
   "Wertebereichsintegrität (Domäne)",
   ["Referentielle Integrität", "Entitätsintegrität", "Semantische Integrität"],
   ["Jedes Feld hat Datentyp und erlaubten Wertebereich.", "Verstöße lehnt das DBMS beim Einfügen ab."]),
  ("Was macht ein DBMS, wenn eine Integritätsregel verletzt wird?",
   "Es lehnt die Operation ab",
   ["Es speichert und warnt später", "Es korrigiert den Wert automatisch", "Es löscht den betroffenen Datensatz"],
   ["Regeln werden bei jedem Einfügen, Ändern, Löschen geprüft.", "Verstoß = Operation wird nicht ausgeführt."]),
  ("Was ist der wichtigste Grundsatz gegen Redundanz?",
   "Jede Information genau einmal speichern",
   ["Alle Daten in eine Tabelle schreiben", "Jede Tabelle möglichst viele Spalten geben", "Datensätze nie löschen"],
   ["Genau einmal speichern und über Schlüssel verknüpfen.", "So können Anomalien gar nicht erst entstehen."]),
 ]),
 ("dbms1", 4, 37, "DBMS I: Eingabe und Sortieren", [
  ("Was ist SQLite?",
   "Ein DBMS, dessen ganze Datenbank in einer Datei liegt",
   ["Eine Tabellenkalkulation", "Ein Online-Speicher für Tabellen", "Eine Programmiersprache"],
   ["schule.db ist eine einzige Datei, kein Server nötig.", "SQLite steckt in jedem Smartphone."]),
  ("Mit welchem Befehl wird eine neue Tabelle angelegt?",
   "CREATE TABLE",
   ["INSERT INTO", "NEW TABLE", "ADD TABLE"],
   ["CREATE TABLE Name ( Spalte Typ, ... );", "Erst die Struktur, dann die Daten."]),
  ("Welcher Befehl trägt einen Datensatz ein?",
   "INSERT INTO Schueler VALUES (1001, 'Lena Krause', 'FO12a')",
   ["ADD Schueler (1001, 'Lena Krause', 'FO12a')", "UPDATE Schueler SET (1001, 'Lena Krause', 'FO12a')", "CREATE ROW Schueler (1001, 'Lena Krause', 'FO12a')"],
   ["INSERT INTO Tabelle VALUES (...) fügt eine Zeile ein.", "Werte in Reihenfolge der Spalten, Text in einfachen Anführungszeichen."]),
  ("Warum wird ein Datum in SQLite als '2008-04-17' gespeichert und nicht als '17.04.2008'?",
   "Weil die ISO-Form sich als Text richtig sortiert",
   ["Weil SQLite keine Punkte in Texten erlaubt", "Weil es kürzer ist", "Weil Amerikaner es so schreiben"],
   ["'2008-04-17' < '2009-01-03' stimmt auch als Textvergleich.", "'17.04.2008' würde nach dem Tag sortieren."]),
  ("Welcher Datentyp passt für die Schülernummer?",
   "INTEGER",
   ["TEXT", "REAL", "DATE"],
   ["Ganze Zahl = INTEGER.", "Als TEXT würde '10' vor '9' sortiert."]),
  ("Was bewirkt PRAGMA foreign_keys = ON in SQLite?",
   "SQLite prüft Fremdschlüssel erst dann",
   ["SQLite legt automatisch Fremdschlüssel an", "Alle Tabellen werden gesperrt", "Fremdschlüssel werden gelöscht"],
   ["Ohne das PRAGMA akzeptiert SQLite Verweise ins Leere.", "Deshalb gehört es an den Anfang jedes Skripts."]),
  ("Was passiert bei UPDATE Kurs SET Raum = '210'; ohne WHERE?",
   "Alle Kurse bekommen Raum 210",
   ["Nur der erste Kurs wird geändert", "SQLite fragt nach", "Nichts, der Befehl ist ungültig"],
   ["Ohne WHERE trifft ein UPDATE jede Zeile.", "Dasselbe gilt für DELETE: die Tabelle wäre leer."]),
  ("Wie sortiert man Schüler nach Geburtsdatum, die Jüngsten zuerst?",
   "SELECT * FROM Schueler ORDER BY Geburtsdatum DESC",
   ["SELECT * FROM Schueler SORT BY Geburtsdatum", "SELECT * FROM Schueler ORDER BY Geburtsdatum ASC", "SELECT * FROM Schueler GROUP BY Geburtsdatum"],
   ["ORDER BY sortiert, DESC = absteigend.", "Das jüngste Datum ist das größte, also zuerst bei DESC."]),
  ("Was bedeutet ORDER BY Klasse, Name?",
   "Erst nach Klasse sortieren, bei gleicher Klasse nach Name",
   ["Nach Klasse oder nach Name, je nachdem", "Nur nach Name sortieren", "Klasse und Name vertauschen"],
   ["Mehrere Schlüssel: der zweite entscheidet bei Gleichstand.", "Die Daten in der Tabelle bleiben unsortiert."]),
  ("In welcher Reihenfolge müssen die Tabellen Lehrkraft, Kurs (mit Fremdschlüssel auf Lehrkraft) angelegt werden?",
   "Erst Lehrkraft, dann Kurs",
   ["Erst Kurs, dann Lehrkraft", "Die Reihenfolge ist egal", "Beide in einem Befehl"],
   ["Ein Fremdschlüssel braucht die Tabelle, auf die er zeigt.", "Tabellen ohne Fremdschlüssel zuerst."]),
 ]),
 ("dbms2", 5, 38, "DBMS II: Suchen und Auswerten", [
  ("Welche Klausel wählt die Spalten eines Ergebnisses aus?",
   "SELECT",
   ["WHERE", "FROM", "ORDER BY"],
   ["SELECT nennt die Spalten, WHERE die Zeilen.", "Das Ergebnis ist wieder eine Tabelle."]),
  ("Welche Klausel filtert die Zeilen?",
   "WHERE",
   ["SELECT", "FROM", "LIMIT"],
   ["WHERE Klasse = 'FO12a' behält nur passende Zeilen.", "Bedingungen lassen sich mit AND, OR, NOT verknüpfen."]),
  ("Welche Abfrage findet alle Schüler, deren Name mit M beginnt?",
   "SELECT * FROM Schueler WHERE Name LIKE 'M%'",
   ["SELECT * FROM Schueler WHERE Name = 'M%'", "SELECT * FROM Schueler WHERE Name LIKE '%M'", "SELECT * FROM Schueler WHERE Name STARTS 'M'"],
   ["LIKE vergleicht mit Muster, % steht für beliebig viele Zeichen.", "'%M' wäre: endet auf M."]),
  ("Was liefert SELECT COUNT(*) FROM Schueler WHERE Klasse = 'FO12b'?",
   "Die Anzahl der Schüler in FO12b",
   ["Alle Schüler der FO12b", "Die Namen der FO12b", "Die Anzahl aller Klassen"],
   ["COUNT(*) zählt die Zeilen, die die Bedingung erfüllen.", "Ergebnis ist eine Tabelle mit einer Zelle."]),
  ("Wozu dient GROUP BY Klasse?",
   "Eine Ergebniszeile pro Klasse bilden",
   ["Nach Klasse sortieren", "Nur eine Klasse auswählen", "Die Spalte Klasse ausblenden"],
   ["Zeilen mit gleichem Klasse-Wert werden zu einer Gruppe.", "Pro Gruppe rechnet COUNT, SUM, AVG, MIN oder MAX."]),
  ("Wie prüft man, ob das Feld Raum leer ist?",
   "WHERE Raum IS NULL",
   ["WHERE Raum = NULL", "WHERE Raum = ''", "WHERE Raum = 0"],
   ["Ein Vergleich mit = NULL ist nie wahr.", "Für leere Felder gibt es IS NULL."]),
  ("Was bedeutet Geburtsdatum BETWEEN '2008-01-01' AND '2008-12-31'?",
   "Im Jahr 2008 geboren, Grenzen eingeschlossen",
   ["Vor 2008 oder nach 2008 geboren", "Genau am 01.01. oder 31.12.2008 geboren", "Im Jahr 2008 geboren, Grenzen ausgeschlossen"],
   ["BETWEEN a AND b schließt beide Grenzen ein.", "Dank ISO-Datum funktioniert der Textvergleich."]),
  ("Wozu braucht man JOIN?",
   "Um Zeilen aus mehreren Tabellen über Schlüssel zu verbinden",
   ["Um Tabellen dauerhaft zusammenzulegen", "Um doppelte Zeilen zu löschen", "Um Spalten umzubenennen"],
   ["JOIN ... ON Fremdschlüssel = Primärschlüssel.", "Das Ergebnis sieht aus wie die alte Kursliste, ist aber nur eine Ansicht."]),
  ("Was macht DISTINCT?",
   "Entfernt doppelte Zeilen aus dem Ergebnis",
   ["Sortiert das Ergebnis", "Zählt die Zeilen", "Wählt die erste Zeile"],
   ["SELECT DISTINCT Klasse FROM Schueler zeigt jede Klasse einmal.", "DISTINCT wirkt nur auf das Ergebnis."]),
  ("Was ist der Unterschied zwischen WHERE und HAVING?",
   "WHERE filtert Zeilen vor dem Gruppieren, HAVING filtert Gruppen danach",
   ["Kein Unterschied", "HAVING sortiert, WHERE filtert", "WHERE gilt nur für Zahlen, HAVING für Text"],
   ["HAVING COUNT(*) >= 2 behält nur Gruppen mit mindestens zwei Zeilen.", "WHERE kennt die Gruppen noch nicht."]),
 ]),
 ("er1", 6, 39, "ER-Modell I", [
  ("Wofür steht ER in ER-Modell?",
   "Entity-Relationship",
   ["Error-Report", "Entry-Record", "Entität-Regel"],
   ["Entity = Ding, Relationship = Beziehung.", "Peter Chen, 1976."]),
  ("Wie wird ein Entitätstyp in der Chen-Notation gezeichnet?",
   "Als Rechteck",
   ["Als Ellipse", "Als Raute", "Als Kreis"],
   ["Rechteck = Entitätstyp, Ellipse = Attribut, Raute = Beziehung.", "Linien verbinden die Bausteine."]),
  ("Wie wird ein Attribut gezeichnet?",
   "Als Ellipse",
   ["Als Rechteck", "Als Raute", "Als Pfeil"],
   ["Attribute hängen als Ellipsen am Entitätstyp.", "Das Schlüsselattribut wird unterstrichen."]),
  ("Wie wird ein Beziehungstyp gezeichnet?",
   "Als Raute",
   ["Als Rechteck", "Als Ellipse", "Als Dreieck"],
   ["Die Raute trägt ein Verb: belegt, leitet, absolviert.", "Sie verbindet zwei Entitätstypen."]),
  ("Was ist der Unterschied zwischen Entitätstyp und Entität?",
   "Entitätstyp ist die Klasse (Schüler), Entität ein Exemplar (Lena Krause)",
   ["Kein Unterschied", "Entität ist die Klasse, Entitätstyp das Exemplar", "Entitätstyp ist ein Attribut"],
   ["Der Typ beschreibt alle gleichartigen Dinge.", "Die Entität ist ein konkretes Ding daraus."]),
  ("Eine Lehrkraft leitet viele Kurse, jeder Kurs hat genau eine Lehrkraft. Welche Kardinalität?",
   "1:n",
   ["1:1", "n:m", "n:1 auf beiden Seiten"],
   ["Eine Lehrkraft, n Kurse.", "Das n steht am Kurs."]),
  ("Ein Schüler belegt viele Kurse, ein Kurs hat viele Schüler. Welche Kardinalität?",
   "n:m",
   ["1:n", "1:1", "n:1"],
   ["Auf beiden Seiten viele.", "Bei der Überführung wird daraus eine eigene Tabelle."]),
  ("Mit welchen zwei Fragen bestimmt man die Kardinalität?",
   "Wie viele B kann EIN A haben, und wie viele A kann EIN B haben?",
   ["Wie viele Attribute hat A, wie viele hat B?", "Wie viele Zeilen hat A, wie viele hat B?", "Welche Tabelle ist größer?"],
   ["Je Seite: ein Exemplar nehmen und zählen.", "Antworten 1 oder n ergeben zusammen die Kardinalität."]),
  ("Wo gehören Beginn und Ende eines Praktikums hin, wenn Schüler in Betrieben Praktika absolvieren?",
   "An die Beziehung absolviert",
   ["An den Schüler", "An den Betrieb", "Nirgends, sie sind keine Attribute"],
   ["Beginn und Ende hängen vom Paar Schüler-Betrieb ab.", "Beziehungen dürfen eigene Attribute tragen."]),
  ("Ein Hauptwort im Auftragstext hat eigene Eigenschaften. Was wird daraus im Modell?",
   "Ein Entitätstyp",
   ["Ein Attribut", "Ein Beziehungstyp", "Eine Kardinalität"],
   ["Dinge mit eigenen Eigenschaften werden Entitätstypen.", "Einzelne Werte werden Attribute, Verben werden Beziehungen."]),
 ]),
 ("er2", 7, 40, "ER-Modell II: Überführung", [
  ("Regel 1: Was wird aus einem Entitätstyp?",
   "Eine Tabelle, die Attribute werden Spalten",
   ["Eine Spalte in einer großen Tabelle", "Ein Fremdschlüssel", "Eine Beziehungstabelle"],
   ["Rechteck wird Tabelle, Ellipsen werden Spalten.", "Das unterstrichene Attribut wird PRIMARY KEY."]),
  ("Regel 2: Wohin kommt der Fremdschlüssel bei einer 1:n-Beziehung?",
   "Auf die n-Seite",
   ["Auf die 1-Seite", "In eine eigene Tabelle", "Auf beide Seiten"],
   ["Ein Kurs hat eine Lehrkraft, also merkt sich der Kurs die LNr.", "Die 1-Seite müsste sonst viele Werte in einer Zelle speichern."]),
  ("Regel 3: Was wird aus einer n:m-Beziehung?",
   "Eine eigene Tabelle mit zwei Fremdschlüsseln",
   ["Ein Fremdschlüssel auf einer Seite", "Zwei Spalten in jeder Tabelle", "Nichts, sie wird weggelassen"],
   ["Belegung (SNr, KNr) verweist auf Schüler und Kurs.", "Beide Spalten zusammen bilden den Primärschlüssel."]),
  ("Wie wird ein zusammengesetzter Primärschlüssel in SQL geschrieben?",
   "PRIMARY KEY (SNr, KNr)",
   ["SNr PRIMARY KEY, KNr PRIMARY KEY", "PRIMARY KEY SNr + KNr", "KEY (SNr AND KNr)"],
   ["Eine Tabelle hat genau einen Primärschlüssel, der aus mehreren Spalten bestehen darf.", "Jedes Paar darf nur einmal vorkommen."]),
  ("Welches Schlüsselwort verknüpft einen Fremdschlüssel mit seiner Zieltabelle?",
   "REFERENCES",
   ["LINKS", "JOIN", "FOREIGN"],
   ["LNr INTEGER REFERENCES Lehrkraft(LNr).", "Das DBMS prüft dann die referentielle Integrität."]),
  ("Was bedeutet NOT NULL beim Fremdschlüssel LNr in der Tabelle Kurs?",
   "Jeder Kurs muss eine Lehrkraft haben",
   ["Die Lehrkraft darf keinen Kurs haben", "Der Kurs darf nicht gelöscht werden", "LNr darf nicht doppelt vorkommen"],
   ["NOT NULL entspricht der Min-Max-Angabe (1,1).", "Ohne NOT NULL dürfte ein Kurs vorerst ohne Lehrkraft sein."]),
  ("Wohin wandern die Attribute Beginn und Ende der Beziehung absolviert (n:m)?",
   "In die Beziehungstabelle Praktikum",
   ["In die Tabelle Schüler", "In die Tabelle Betrieb", "Sie fallen weg"],
   ["Beziehungsattribute gehen mit in die Beziehungstabelle.", "Praktikum (SNr, BNr, Beginn, Ende)."]),
  ("Was ist ein typischer Fehler bei der Überführung?",
   "Der Fremdschlüssel steht auf der 1-Seite mit mehreren Werten in einer Zelle",
   ["Jede Tabelle hat einen Primärschlüssel", "Tabellen ohne Fremdschlüssel werden zuerst angelegt", "n:m wird eine eigene Tabelle"],
   ["Kurse: 3, 4, 5 in einer Zelle ist die Kursliste von Woche 3.", "Der Fremdschlüssel steht dort, wo ein Wert reicht."]),
  ("Wie viele Tabellen entstehen aus zwei Entitätstypen mit einer n:m-Beziehung?",
   "Drei",
   ["Zwei", "Eine", "Vier"],
   ["Zwei Entitätstabellen plus eine Beziehungstabelle.", "Bei 1:n blieben es zwei."]),
  ("Was ist bei einer 1:1-Beziehung erlaubt?",
   "Fremdschlüssel auf einer Seite oder beide Tabellen zusammenlegen",
   ["Nur eine eigene Beziehungstabelle", "Fremdschlüssel auf beiden Seiten ist Pflicht", "1:1-Beziehungen gibt es nicht"],
   ["Bei 1:1 reicht ein Fremdschlüssel auf einer Seite.", "Oft legt man die beiden Tabellen zusammen."]),
 ]),
 ("normalisierung", 8, 41, "Normalisierung", [
  ("Was verlangt die 1. Normalform?",
   "Jede Zelle enthält genau einen Wert",
   ["Jede Tabelle hat einen Fremdschlüssel", "Keine Spalte hängt von einer anderen ab", "Jede Tabelle hat höchstens fünf Spalten"],
   ["Keine Listen wie 'Informatik, Physik' in einer Zelle.", "Listen werden zu mehreren Zeilen aufgelöst."]),
  ("Was verlangt die 2. Normalform zusätzlich?",
   "Jedes Attribut hängt vom ganzen Schlüssel ab, nicht nur von einem Teil",
   ["Jede Zelle enthält genau einen Wert", "Es gibt keine Fremdschlüssel", "Alle Spalten sind Zahlen"],
   ["Bei Schlüssel (SNr, Kurs) darf Name nicht nur von SNr abhängen.", "Teilabhängige Spalten wandern in eigene Tabellen."]),
  ("Was verlangt die 3. Normalform zusätzlich?",
   "Kein Attribut hängt von einem anderen Nicht-Schlüssel-Attribut ab",
   ["Jede Zelle enthält genau einen Wert", "Der Schlüssel besteht aus einer Spalte", "Jede Tabelle hat höchstens drei Spalten"],
   ["Durchwahl hängt von Lehrkraft ab, nicht vom Kurs: transitive Abhängigkeit.", "Lehrkraft bekommt eine eigene Tabelle."]),
  ("In der Tabelle Kurs (Kurs, Lehrkraft, Raum, Durchwahl) hängt Durchwahl von Lehrkraft ab. Wie heißt das?",
   "Transitive Abhängigkeit",
   ["Teilabhängigkeit", "Redundante Abhängigkeit", "Schlüsselabhängigkeit"],
   ["Kurs bestimmt Lehrkraft, Lehrkraft bestimmt Durchwahl: eine Kette.", "Verstoß gegen die 3NF."]),
  ("Eine Zelle enthält 'Informatik, Physik'. Gegen welche Normalform verstößt das?",
   "1NF",
   ["2NF", "3NF", "Keine"],
   ["Listen in Zellen sind der klassische 1NF-Verstoß.", "Lösung: eine Zeile pro Wert."]),
  ("Schlüssel ist (SNr, Kurs); Name hängt nur von SNr ab. Gegen welche Normalform verstößt das?",
   "2NF",
   ["1NF", "3NF", "Keine"],
   ["Name hängt nur von einem Teil des Schlüssels ab.", "Name wandert in die Tabelle Schüler."]),
  ("Wann ist die 2NF überhaupt ein Thema?",
   "Nur bei zusammengesetzten Schlüsseln",
   ["Nur bei Tabellen ohne Schlüssel", "Immer, auch bei einspaltigen Schlüsseln", "Nur bei Textspalten"],
   ["Teilabhängigkeit braucht einen Schlüssel mit mehreren Teilen.", "Bei einspaltigem Schlüssel ist 2NF automatisch erfüllt."]),
  ("In welcher Reihenfolge werden die Normalformen geprüft?",
   "1NF, dann 2NF, dann 3NF",
   ["3NF, dann 2NF, dann 1NF", "Beliebig", "2NF, dann 1NF, dann 3NF"],
   ["Jede Stufe setzt die vorige voraus.", "Erst Listen auflösen, dann Schlüssel, dann Abhängigkeiten."]),
  ("Wie lautet der Merkspruch von Bill Kent?",
   "Der Schlüssel, der ganze Schlüssel und nichts als der Schlüssel",
   ["Eine Tabelle, ein Schlüssel, ein Wert", "Erst die Daten, dann die Struktur", "Redundanz ist erlaubt, wenn sie klein ist"],
   ["1NF: der Schlüssel, 2NF: der ganze Schlüssel, 3NF: nichts als der Schlüssel.", "Im Original: ... so help me Codd."]),
  ("Was ergibt sich, wenn man die Kursliste bis zur 3NF normalisiert?",
   "Dieselben vier Tabellen wie aus der ER-Überführung",
   ["Eine einzige große Tabelle", "Zwei Tabellen ohne Schlüssel", "Nur die Tabelle Schüler"],
   ["Schüler, Belegung, Kurs, Lehrkraft.", "Modellieren und Zerlegen führen zum selben Ziel."]),
 ]),
 ("minidb", 9, 44, "Mini-Datenbank: Abschluss LB 1", [
  ("In welcher Reihenfolge entsteht die Mini-Datenbank?",
   "Beschreiben, modellieren, überführen, prüfen, bauen",
   ["Bauen, beschreiben, modellieren, prüfen, überführen", "Modellieren, bauen, beschreiben, prüfen, überführen", "Bauen, prüfen, überführen, modellieren, beschreiben"],
   ["Erst verstehen und modellieren, dann Tabellen, dann SQL.", "Wer beim Bauen anfängt, baut die Kursliste von Woche 3."]),
  ("Was ist das Ergebnis des Schritts Modellieren?",
   "Ein ER-Diagramm mit Kardinalitäten und Schlüsseln",
   ["Eine .db-Datei", "Fünf SQL-Abfragen", "Ein Auftragstext"],
   ["Entitäten, Attribute, Beziehungen als Bild.", "Das Diagramm ist zugleich die Doku."]),
  ("Welche Mindestanforderung gilt für das Modell?",
   "Drei Entitätstypen und eine n:m-Beziehung",
   ["Eine Tabelle mit allen Daten", "Zehn Entitätstypen", "Nur 1:1-Beziehungen"],
   ["Drei Entitäten, eine echte n:m-Beziehung, fünf Datensätze je Tabelle.", "Die n:m-Beziehung wird zur eigenen Tabelle."]),
  ("Warum soll ein Fremdschlüssel-Fehler absichtlich provoziert werden?",
   "Um zu zeigen, dass das DBMS die referentielle Integrität wirklich prüft",
   ["Um die Datenbank zu löschen", "Weil SQLite das verlangt", "Um Speicherplatz zu sparen"],
   ["Nur mit PRAGMA foreign_keys = ON lehnt SQLite den Verweis ins Leere ab.", "Die Fehlermeldung nennt die verletzte Regel."]),
  ("Welche fünf Abfragetypen gehören zur Pflicht?",
   "WHERE, ORDER BY, COUNT/GROUP BY, JOIN und eine freie",
   ["Nur fünfmal SELECT *", "INSERT, UPDATE, DELETE, DROP, CREATE", "Fünf JOINs"],
   ["Filtern, sortieren, auswerten, verbinden, frei.", "Jede Abfrage beantwortet eine Frage an das Modell."]),
  ("Was prüft die 3NF-Kontrolle vor dem Bauen?",
   "Dass keine Teil- oder Kettenabhängigkeiten in den Tabellen stecken",
   ["Dass alle Namen groß geschrieben sind", "Dass jede Tabelle genau drei Spalten hat", "Dass die Datei kleiner als 1 MB ist"],
   ["1NF, 2NF, 3NF nacheinander durchgehen.", "Ein sauberes ER-Modell ist meist schon in 3NF."]),
  ("Was gehört in ein gutes Peer-Review?",
   "Was ist gut, was fehlt, ein konkreter Vorschlag",
   ["Nur eine Note", "Nur die Fehlerliste", "Ein Lob ohne Begründung"],
   ["Mit Checkliste prüfen, nicht mit Gefühl.", "Rückmeldung konkret und umsetzbar."]),
  ("Welcher Prüfpunkt gehört in die Review-Checkliste?",
   "Jeder Entitätstyp hat einen Primärschlüssel",
   ["Die Datei hat einen schönen Namen", "Die Tabellen sind alphabetisch sortiert", "Es gibt mindestens zehn Spalten"],
   ["Schlüssel, Kardinalitäten, n:m-Tabellen, Normalformen, Abfragen, FK-Fehler.", "Jeder Punkt lässt sich mit ja oder nein beantworten."]),
  ("Im Turnier-Beispiel: Spieler spielen in Spielen und erzielen Tore. Wo steht das Attribut Tore?",
   "In der Beziehungstabelle Einsatz (SNr, PNr, Tore)",
   ["In der Tabelle Spieler", "In der Tabelle Spiel", "In keiner Tabelle"],
   ["Tore hängen vom Paar Spieler-Spiel ab.", "Beziehungsattribute wandern in die Beziehungstabelle."]),
  ("Was wird in Klausur 1 geprüft?",
   "DBMS-Bedienung, ER-Modell und Normalisierung",
   ["Nur SQL", "Nur ER-Diagramme", "Programmieren mit Python"],
   ["Genau die fünf Schritte der Mini-Datenbank.", "Typisch: Text, ER-Diagramm, Tabellen, zwei Abfragen."]),
 ]),
 ("wiederholung", 10, 45, "Wiederholung LB 1", [
  ("Welche drei Anomalien entstehen durch Redundanz?",
   "Einfüge-, Änderungs- und Löschanomalie",
   ["Schlüssel-, Wert- und Typanomalie", "Lese-, Schreib- und Sortieranomalie", "1NF-, 2NF- und 3NF-Anomalie"],
   ["Alle drei haben dieselbe Ursache: Mehrfachspeicherung.", "Aufteilen in Tabellen beseitigt sie."]),
  ("Welche Regel sichert, dass ein Fremdschlüssel auf einen vorhandenen Datensatz zeigt?",
   "Referentielle Integrität",
   ["Entitätsintegrität", "Wertebereichsintegrität", "Semantische Integrität"],
   ["Referenz = Verweis auf eine andere Tabelle.", "In SQLite nur mit PRAGMA foreign_keys = ON geprüft."]),
  ("Welcher SQL-Befehl ändert vorhandene Datensätze?",
   "UPDATE ... SET ... WHERE",
   ["INSERT INTO", "ALTER ROW", "CHANGE"],
   ["UPDATE Kurs SET Raum = '210' WHERE Fach = 'Informatik';", "Ohne WHERE trifft es alle Zeilen."]),
  ("Was liefert SELECT Klasse, COUNT(*) FROM Schueler GROUP BY Klasse?",
   "Je Klasse eine Zeile mit der Anzahl der Schüler",
   ["Alle Schüler nach Klasse sortiert", "Die Anzahl aller Schüler in einer Zelle", "Nur die Klassen mit einem Schüler"],
   ["GROUP BY bildet Gruppen, COUNT zählt pro Gruppe.", "Im SELECT nur Gruppenspalte und Funktionen."]),
  ("Wie verbindet man Schueler und Belegung in einer Abfrage?",
   "JOIN Belegung b ON b.SNr = s.SNr",
   ["JOIN Belegung WITH Schueler", "MERGE Belegung, Schueler", "SELECT Schueler + Belegung"],
   ["ON nennt das Paar Fremdschlüssel = Primärschlüssel.", "Das Ergebnis ist nur eine Ansicht, gespeichert bleibt alles einmal."]),
  ("Welche Form haben Entitätstyp, Attribut und Beziehungstyp in der Chen-Notation?",
   "Rechteck, Ellipse, Raute",
   ["Kreis, Rechteck, Pfeil", "Raute, Rechteck, Ellipse", "Ellipse, Raute, Rechteck"],
   ["Rechteck = Ding, Ellipse = Eigenschaft, Raute = Verb.", "Schlüsselattribute werden unterstrichen."]),
  ("Eine Fahrstunde gehört zu genau einem Fahrschüler, ein Fahrschüler hat viele Fahrstunden. Wo steht der Fremdschlüssel?",
   "In der Tabelle Fahrstunde (FSNr)",
   ["In der Tabelle Fahrschüler", "In einer eigenen Beziehungstabelle", "In beiden Tabellen"],
   ["1:n: Fremdschlüssel auf der n-Seite.", "Fahrschüler müsste sonst viele Werte in einer Zelle speichern."]),
  ("Was wird aus der n:m-Beziehung Schüler belegt Kurs?",
   "Tabelle Belegung mit den Fremdschlüsseln SNr und KNr",
   ["Eine Spalte Kurse in der Tabelle Schüler", "Eine Spalte Schüler in der Tabelle Kurs", "Nichts, n:m wird nicht gespeichert"],
   ["Beziehungstabelle mit zusammengesetztem Primärschlüssel (SNr, KNr).", "Beziehungsattribute wandern mit."]),
  ("In Tabelle Kurs (Kurs, Lehrkraft, Durchwahl) hängt Durchwahl von Lehrkraft ab. Welche Normalform ist verletzt?",
   "3NF",
   ["1NF", "2NF", "Keine"],
   ["Transitive Abhängigkeit Kurs → Lehrkraft → Durchwahl.", "Lösung: eigene Tabelle Lehrkraft."]),
  ("Welche Reihenfolge ist beim Aufbau einer Datenbank richtig?",
   "Beschreiben, modellieren, überführen, prüfen, bauen",
   ["Bauen, prüfen, modellieren", "SQL schreiben, dann ER-Diagramm zeichnen", "Tabellen anlegen, dann Anforderungen klären"],
   ["Erst das Modell, dann die Tabellen, dann SQL.", "Wer beim Bauen anfängt, baut die Kursliste von Woche 3."]),
 ]),
]

TEMPLATE = """<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Fragen: %(topic)s — Doc Alvers Mathe-Labor</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<link rel="stylesheet" href="js/quiz.css">
    <link rel="icon" type="image/svg+xml" href="resources/favicon.svg">
    <link rel="icon" type="image/png" sizes="256x256" href="resources/favicon.png">
</head>
<body>
<!-- Page markup, scoring, statistics and the teacher dashboard live in
     js/quiz-engine.js — this file only carries the questions.
     Generated by %(gen)s - edit the questions there. -->
<script>
window.QUIZ = %(json)s;
</script>
<script src="js/quiz-collapse.js"></script>
<script src="js/quiz-engine.js"></script>
</body>
</html>
"""


# One profile per plan page. The FOS 12 default keeps every file built so far
# byte-identical; a new course only supplies its own labels and file prefix.
FOS12 = {
    "qid": "fos12", "file": "infotest12",
    "subtitle": "Fachoberschule · Klasse 12",
    "dash": "FOS · Klasse 12",
    "back": "svp/informatik/fos12.html",
    "gen": "tools/build_infotest12.py",
}


def build(slug, nr, kw, topic, qs, course=FOS12):
    qid = f"{course['qid']}-w{nr:02d}-{slug}"
    # Hashing each question on its own is unbiased per question but can still hand a
    # whole quiz two letters and no A or D. "balance" instead deals every letter two
    # or three times and shuffles that deal deterministically from the quiz id.
    slots = None
    if course.get("balance"):
        rnd = random.Random(qid)
        slots = [i % 4 for i in range(len(qs))]
        rnd.shuffle(slots)
    questions = []
    for i, (q, right, wrong, steps) in enumerate(qs, 1):
        assert len(wrong) == 3 and len({right, *wrong}) == 4, (qid, i)
        pos = (slots[i - 1] if slots is not None
               else int(hashlib.sha256(f"{qid}#{i}".encode()).hexdigest(), 16) % 4)
        opts = list(wrong)
        opts.insert(pos, right)
        questions.append({"q": q, "opts": opts, "steps": steps, "solution": pos})
    assert len(questions) == 10, qid
    quiz = {
        "id": qid, "version": "v1",
        "title": f"Fragen · {topic}",
        "subtitle": f"{course['subtitle']} · Woche {nr}, KW {kw} · 10 Fragen zu den Essentials "
                    f"der Woche · genau eine Antwort pro Frage",
        "dashSub": f"{course['dash']} · KW {kw} · Live-Auswertung: anonyme Einzelscores + Gruppenleistung pro Frage",
        "back": course["back"],
        "questions": questions,
    }
    path = os.path.join(HTML, f"{course['file']}-{slug}.html")
    with open(path, "w") as f:
        f.write(TEMPLATE % {"topic": topic, "json": json.dumps(quiz, ensure_ascii=False, indent=2),
                            "gen": course["gen"]})
    return path, [questions[i]["solution"] for i in range(10)]


if __name__ == "__main__":
    for slug, nr, kw, topic, qs in QUIZZES:
        path, sol = build(slug, nr, kw, topic, qs)
        print(os.path.basename(path), "Lösungen:", "".join("ABCD"[s] for s in sol))
