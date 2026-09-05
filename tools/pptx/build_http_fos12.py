#!/usr/bin/env python3
"""Dynamische Webanwendungen: HTTP, client- und serverseitig (Woche 26)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, html_parts, js_parts, php_parts, plain_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from flow_diagrams import pap

d = Deck("http-dynamische-webanwendungen.pptx")
P = lambda n: os.path.join(IMG, n)
plain = lambda t, ls, **kw: d.code(t, [plain_parts(l) for l in ls], **kw)
js = lambda t, ls, **kw: d.code(t, [js_parts(l) for l in ls], **kw)
php = lambda t, ls, **kw: d.code(t, [php_parts(l) for l in ls], **kw)
html = lambda t, ls, **kw: d.code(t, [html_parts(l) for l in ls], **kw)

d.title("Informatik — FOS 12", "HTTP und dynamische Seiten",
        "Wer fragt, wer antwortet — und wo die Arbeit tatsächlich passiert")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Frage und Antwort", "Das Web ist ein Gespräch mit festen Regeln")

N = {
    "c": {"pos": (300, 140), "text": "Client (Browser)", "w": 400, "h": 130,
          "color": (221, 232, 198)},
    "s": {"pos": (1250, 140), "text": "Server", "w": 360, "h": 130,
          "color": (251, 235, 191)},
    "db": {"pos": (1250, 400), "text": "Datenbank", "w": 360, "h": 120,
           "color": (230, 236, 248)},
}
E = [("c", "s", "Request: GET /rezepte.html", [(520, 110), (1060, 110)]),
     ("s", "c", "Response: 200 OK + HTML", [(1060, 178), (520, 178)]),
     ("s", "db", "SQL-Abfrage", [(1180, 215), (1180, 330)]),
     ("db", "s", "Datensätze", [(1330, 330), (1330, 215)])]
req = pap(P("http-request.png"), 1530, 495, N, E, size=25)
d.picture("Der Ablauf jedes Seitenaufrufs", req, [
    ("Der **Client** fragt, der **Server** antwortet — nie umgekehrt", 0),
    ("**HTTP** ist das Protokoll: die Regeln, wie Frage und Antwort aussehen müssen", 0),
    ("Der Server holt sich, was er braucht, aus der **Datenbank** — für den Client unsichtbar", 0),
], width=640)

d.table_top("Die Begriffe dazu", [
    ["Begriff", "bedeutet"],
    ["Client", "das Programm, das fragt — hier: der Browser"],
    ["Server", "das Programm, das antwortet — läuft rund um die Uhr"],
    ["HTTP", "Hypertext Transfer Protocol: die vereinbarten Regeln"],
    ["HTTPS", "dasselbe, aber verschlüsselt — heute Pflicht"],
    ["URL", "die Adresse: Protokoll, Servername, Pfad, ggf. Parameter"],
    ["zustandslos", "der Server erinnert sich nicht an die letzte Anfrage"],
], [170, 646], [
    ("**Zustandslos** ist der wichtigste und überraschendste Punkt: jede Anfrage steht für sich", 0),
    ("Damit ein Warenkorb trotzdem funktioniert, braucht es **Sitzungen** (Sessions) und **Cookies**", 0),
], font_size=11, bold_cols=(0,), marks={(6, c): TINT_ORANGE for c in range(2)})

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "HTTP im Klartext", "Das Protokoll ist lesbarer Text")

plain("Eine echte Anfrage und die Antwort", [
    "GET /rezepte.html HTTP/1.1",
    "Host: projekt.fos12.de",
    "User-Agent: Mozilla/5.0 ...",
    "Accept: text/html",
    "",
    "----------------------------------------------------",
    "",
    "HTTP/1.1 200 OK",
    "Content-Type: text/html; charset=UTF-8",
    "Content-Length: 1842",
    "",
    "<!DOCTYPE html>",
    "<html lang=\"de\"> ...",
], size=13)

d.table_top("Methoden und Statuscodes", [
    ["Methode", "wofür", "Statuscode", "bedeutet"],
    ["GET", "etwas abholen, Parameter in der URL", "200", "OK — alles gut"],
    ["POST", "etwas senden, Daten im Rumpf", "301 / 302", "umgeleitet"],
    ["PUT", "etwas ersetzen", "404", "nicht gefunden"],
    ["DELETE", "etwas löschen", "403", "verboten"],
    ["", "", "500", "Serverfehler — der Code ist schuld"],
], [110, 300, 140, 266], [
    ("Merkregel: **GET holt, POST schickt.** Passwörter niemals per GET — sie stünden in der URL", 0),
    ("Die erste Ziffer verrät alles: **2xx** gut, **3xx** woanders, **4xx** Client-Fehler, **5xx** Server-Fehler", 0),
], font_size=11, bold_cols=(0, 2),
   marks={(1, 3): TINT_GREEN, (3, 3): TINT_ORANGE, (4, 3): TINT_ORANGE, (5, 3): TINT_RED})

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Wo läuft was?", "Client- und serverseitige Technologien")

d.table_top("Die beiden Seiten im Vergleich", [
    ["", "clientseitig", "serverseitig"],
    ["läuft auf", "dem Gerät des Nutzers", "dem Server im Rechenzentrum"],
    ["Sprache", "JavaScript", "PHP, Python, Java, Node.js"],
    ["sieht der Nutzer", "den ganzen Quelltext", "nur das Ergebnis"],
    ["kann", "Seite sofort verändern, ohne Neuladen", "Datenbank lesen, Dateien speichern"],
    ["kann nicht", "Geheimnisse hüten, Daten sicher prüfen", "auf Mausbewegungen reagieren"],
    ["Beispiel", "Eingabe rot färben, Menü aufklappen", "Rezept aus der Datenbank holen"],
], [150, 330, 336], [
    ("**Sicherheitsregel**: Jede Prüfung im Browser ist nur Komfort — die **echte** Prüfung passiert auf dem Server", 0),
    ("Alles, was der Client sieht, kann der Client auch **ändern**", 0),
], font_size=10.5, bold_cols=(0,),
   marks={(5, 1): TINT_RED, (4, 2): TINT_GREEN})

js("Clientseitig: JavaScript reagiert sofort", [
    "// laeuft im Browser, ohne den Server zu fragen",
    "const feld = document.getElementById('kalorien');",
    "const hinweis = document.getElementById('hinweis');",
    "",
    "feld.addEventListener('input', function () {",
    "    const wert = parseInt(feld.value);",
    "    if (wert > 2500) {",
    "        hinweis.textContent = 'Das ist viel fuer einen Tag.';",
    "    } else {",
    "        hinweis.textContent = '';",
    "    }",
    "});",
], size=12)

php("Serverseitig: PHP baut die Seite", [
    "<?php",
    "// laeuft auf dem Server - der Browser sieht nur das Ergebnis",
    "$db = new PDO('sqlite:tagebuch.db');",
    "",
    "$stmt = $db->prepare('SELECT name, kcal FROM lebensmittel WHERE kcal > ?');",
    "$stmt->execute([200]);",
    "",
    "foreach ($stmt->fetchAll() as $zeile) {",
    "    echo '<li>' . htmlspecialchars($zeile['name']) . '</li>';",
    "}",
    "?>",
], size=12)

d.bullets("Was daran wichtig ist", [
    ("Der Browser bekommt **fertiges HTML** — von PHP sieht er keine Zeile", 0),
    ("**prepare** mit Platzhalter statt zusammengesetztem SQL: das ist der Schutz gegen **SQL-Injection**", 0),
    ("**htmlspecialchars** entschärft Nutzertext, bevor er in die Seite geschrieben wird", 0),
    ("Beides kommt in Woche 30 (Datensicherheit) noch einmal ausführlich", 0),
    ("Für unser Projekt reicht **eine** serverseitige Technik — wir bleiben bei einer Sprache", 0),
])

# ---------------------------------------------------------------- Kapitel 04
d.chapter(4, "Selbst nachsehen", "Die Entwicklertools sind das beste Lehrmittel")

d.table_top("Was ihr mit F12 seht", [
    ["Reiter", "zeigt", "typische Frage, die es beantwortet"],
    ["Elemente", "den fertigen DOM-Baum", "Warum ist der Abstand so groß?"],
    ["Konsole", "JavaScript-Fehler und -Ausgaben", "Warum passiert nichts beim Klick?"],
    ["Netzwerk", "jede einzelne Anfrage mit Status und Größe", "Warum lädt die Seite so langsam?"],
    ["Anwendung", "Cookies und lokalen Speicher", "Was speichert die Seite über mich?"],
    ["Geräteansicht", "die Seite in Handygröße", "Bricht mein Layout um?"],
], [150, 300, 366], [
    ("Öffnen mit **F12** — im Netzwerk-Reiter die Seite mit **Strg+Shift+R** neu laden", 0),
    ("Klickt eine Anfrage an: **Methode**, **Statuscode**, **Header** und Antwort stehen alle da", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Fun Facts: HTTP", [
    ("**HTTP/0.9** von 1991 kannte genau einen Befehl: **GET**. Statuscodes gab es nicht", 0),
    ("Der Statuscode **418 I'm a teapot** stammt aus einem Aprilscherz von 1998 — und lebt bis heute weiter", 0),
    ("**404** ist so berühmt, dass Firmen eigene Fehlerseiten gestalten — manche mit Spielen darin", 0),
    ("**HTTP/2** und **HTTP/3** sind nicht mehr lesbarer Text, sondern binär — dafür deutlich schneller", 0),
    ("Das Wort **Cookie** kommt von „magic cookie“, einem alten Fachbegriff für ein weitergereichtes Datenpäckchen", 0),
])

d.bullets("Eure Aufgabe: den Verkehr beobachten", [
    ("Öffnet eure Projektseite und den **Netzwerk**-Reiter; notiert für drei Anfragen Methode, Status und Größe", 0),
    ("Findet eine Seite im Netz, die einen **404** liefert, und haltet die Antwort fest", 0),
    ("Ordnet in eurer Projektidee jede geplante Funktion ein: **clientseitig** oder **serverseitig**?", 0),
    ("Begründet für **eine** davon, warum sie **nicht** im Browser geprüft werden darf", 0),
    ("Ergebnis kommt als Tabelle ins Projekttagebuch — nächste Woche planen wir die Datenbank", 0),
])

d.save()
