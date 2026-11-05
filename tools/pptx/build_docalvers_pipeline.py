#!/usr/bin/env python3
"""Wie docalvers.de ins Netz kommt - the pipeline (Mac, Git, GitHub, GitHub Pages, IONOS) and the services
behind the static site (Supabase, Cloudflare R2), plus where the AI sits.

Doc, 05.11.2026: the PowerPoint "docalvers-pipeline-v2" (OneDrive UNTERRICHT/EINFÜHRUNG, "Zusatzmaterial" of the
first week in six plans) as a deck in our format, with Supabase and R2 on a slide of their own - "dass klar
wird, was da eigentlich passiert". For a very interested pupil, so every fact was checked on that day
(DNS, deploy-pages.yml, the Supabase project, the R2 links in HTML/, eight deploy runs).

HTML only: the figures are inline SVG (pipeline_svg.py), which the .pptx backend cannot place.

    python3 tools/pptx/html_deck.py build_docalvers_pipeline.py
"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck
import pipeline_svg as P

d = MathDeck("docalvers-pipeline.pptx")

d.title("Informatik — Einführung", "Wie docalvers.de ins Netz kommt",
        "Mac, Git, GitHub und IONOS — und dahinter Supabase und R2")
d.summary("Titel: Wie docalvers.de ins Netz kommt - Mac, Git, GitHub, IONOS und dahinter Supabase und Cloudflare R2.")

# ------------------------------------------------------------- Kapitel 01 ---
d.chapter(1, "Schreiben", "Wie eine Änderung online kommt")
d.summary("Kapitel 1: Schreiben - wie eine Änderung online kommt.")

d.figure("① Schreiben — wie eine Änderung online kommt", *P.schreiben())
d.summary("Kette: Lokal auf dem Mac bearbeiten und auf localhost:8765 testen -> git add/commit ins lokale Git -> "
          "git push zu GitHub (Repo malvers/mathlab, Branch main, öffentlich) -> der Push startet den Build, "
          "GitHub Pages liefert den Ordner HTML/ aus. Zurück auf jeden Rechner mit git pull/clone. "
          "Nach ein bis zwei Minuten ist die Änderung online.")

d.bullets("Was beim Push passiert", [
    ("Der Push auf **main** startet bei GitHub eine **Action**: deploy-pages.yml", 0),
    ("Ein frischer Linux-Rechner holt das Repo und **zählt die Codezeilen** für die Startseite", 0),
    ("Er packt nur den Ordner **HTML/** — ohne die schweren Originalbilder", 0),
    ("Nur für die echte Seite tauscht er das **rote Tab-Symbol gegen das orange**", 0),
    ("Dann lädt er das Paket hoch — **GitHub Pages** liefert die neue Fassung aus", 0),
])
d.summary("Die GitHub Action deploy-pages.yml: frischer Linux-Rechner holt das Repo, zählt die Codezeilen, packt nur "
          "HTML/ ohne schwere Originalbilder, tauscht das rote gegen das orange Tab-Symbol, lädt hoch, GitHub Pages "
          "liefert aus.")

# ------------------------------------------------------------- Kapitel 02 ---
d.chapter(2, "Lesen", "Wie ein Besucher die Seite sieht")
d.summary("Kapitel 2: Lesen - wie ein Besucher die Seite sieht.")

d.figure("② Lesen — wie ein Besucher die Seite sieht", *P.lesen())
d.summary("1 Browser fragt das DNS, wo docalvers.de liegt. 2 IONOS (Registrar + DNS) antwortet mit einer der vier "
          "GitHub-Adressen 185.199.108.153 bis 185.199.111.153 und liefert selbst keine Dateien. 3 Der Browser fragt "
          "diesen Server nach der Seite. 4 GitHub Pages liefert HTML, CSS, JS; die Adresszeile zeigt docalvers.de.")

# ------------------------------------------------------------- Kapitel 03 ---
d.chapter(3, "Daten und Medien", "Was eine Seite aus festen Dateien nicht kann")
d.summary("Kapitel 3: Daten und Medien - was eine Seite aus festen Dateien nicht kann.")

d.bullets("Warum GitHub Pages allein nicht reicht", [
    ("GitHub Pages liefert nur **feste Dateien** — für jeden Besucher dieselben", 0),
    ("Es kann **nichts speichern**: kein Testergebnis, keine Planänderung, keine Notiz", 0),
    ("Es kann **nichts geheim halten**: Das Repo ist öffentlich — jeder Schlüssel darin auch", 0),
    ("Große Dateien im Git bleiben **für immer** in der History — jede einzelne Fassung", 0),
    ("Deshalb gibt es daneben **Supabase** für Daten und **Cloudflare R2** für große Dateien", 0),
])
d.summary("GitHub Pages liefert nur feste Dateien, kann nichts speichern und nichts geheim halten (Repo öffentlich); "
          "große Dateien blieben für immer in der Git-History. Darum Supabase für Daten und Cloudflare R2 für große "
          "Dateien.")

d.figure("Die ganze Architektur — Pages, Supabase und R2", *P.architektur())
d.summary("Architektur: Der Browser lädt 1 die Seite (HTML/CSS/JS) von GitHub Pages, 2 liest und speichert Daten bei "
          "Supabase (Postgres, 59 Tabellen, Login, Row Level Security, 24 Edge Functions), 3 holt große Dateien aus "
          "Cloudflare R2 (Videos, Apps, Vorschaubilder für 1.758 Seiten). Der Mac schreibt in alle drei: git push, "
          "SQL + Functions, Upload mit wrangler.")

d.bullets("Supabase — die Datenbank hinter der Seite", [
    ("Im Kern eine **PostgreSQL-Datenbank**: Tabellen, Zeilen, SQL — wie in LB 1", 0),
    ("Der Browser spricht sie direkt an, über eine **REST-Schnittstelle** im Internet", 0),
    ("Ihr Schlüssel steht offen im JavaScript — geschützt wird **jede Zeile** (RLS, 115 Regeln)", 0),
    ("**Edge Functions** sind kleiner Server-Code: Sie rufen z. B. Solitas Stimme oder Claude — mit Schlüsseln, "
     "die geheim bleiben", 0),
    ("**Realtime**: Der Fernstift auf dem Tablet malt live ins Deck auf dem Beamer", 0),
])
d.summary("Supabase: PostgreSQL-Datenbank, vom Browser per REST angesprochen; der öffentliche Schlüssel steht im "
          "JavaScript, geschützt wird jede Zeile durch Row Level Security (115 Regeln). Edge Functions = Server-Code "
          "mit geheimen Schlüsseln (z. B. Solitas Stimme, Claude). Realtime: Fernstift malt live ins Deck.")

d.bullets("Cloudflare R2 — der Speicher für große Dateien", [
    ("R2 speichert **Objekte**: eine Datei unter einem Schlüssel, z. B. og/buch-mathe9.jpg", 0),
    ("Hier liegt, was Git nicht tragen soll: **Videos, Android-Apps, das 3D-Modell des Avatars**", 0),
    ("Und die **Vorschaubilder**, die beim Teilen eines Links erscheinen — für 1.758 Seiten", 0),
    ("Hochgeladen wird vom Mac mit einem Skript: **media_publish.mjs**", 0),
    ("Das Herunterladen kostet bei R2 **keine Gebühr** — egal, wie viele kommen", 0),
])
d.summary("Cloudflare R2: Objektspeicher (Datei unter einem Schlüssel). Dort liegen Videos, Android-Apps, das "
          "3D-Avatar-Modell und die Link-Vorschaubilder für 1.758 Seiten; Upload vom Mac mit media_publish.mjs; "
          "Herunterladen kostet keinen Datenverkehr.")

d.bullets("Ein Beispiel: ein Leistungstest online", [
    ("Die Testseite kommt von **GitHub Pages** — HTML, CSS, JS und die Fragen", 0),
    ("Die Abgabe geht an eine **Datenbank-Funktion** bei Supabase: quiz_vote", 0),
    ("Nur diese Funktion darf schreiben — direkt in die Tabelle kommt niemand (**RLS**)", 0),
    ("Gespeichert werden nur **Code, Antworten und Punkte** — kein Name", 0),
    ("Die Liste Name ↔ Code liegt **verschlüsselt nur auf Docs Rechner**", 0),
])
d.summary("Beispiel Leistungstest: Seite von GitHub Pages; Abgabe über die Datenbank-Funktion quiz_vote bei Supabase, "
          "nur sie darf schreiben (RLS); gespeichert werden Code, Antworten, Punkte, kein Name; die Liste Name-Code "
          "liegt verschlüsselt nur auf Docs Rechner.")

# ------------------------------------------------------------- Kapitel 04 ---
d.chapter(4, "Wo die KI sitzt", "Du, Claude Code und Anthropic")
d.summary("Kapitel 4: Wo die KI sitzt - du, Claude Code und Anthropic.")

d.figure("Wer macht was, wenn du mit der KI arbeitest", *P.ki())
d.summary("Du gibst den Auftrag in Worten, prüfst und gibst frei (commit, push). Claude Code läuft auf dem Mac, liest "
          "und schreibt Dateien, führt Tests und git aus, zeigt Diffs. Das Modell rechnet bei Anthropic und sieht nur, "
          "was Claude Code schickt. Anthropic steht nur am Anfang der Kette Mac - Git - GitHub - Pages - Besucher; was "
          "online geht, entscheidet der Mensch.")

d.merksatz("Der Code liegt bei GitHub, die Daten bei Supabase, die großen Dateien bei R2 — die Domain zeigt nur "
           "den Weg. Was online geht, entscheidet ein Mensch.")
d.summary("Merksatz: Code bei GitHub, Daten bei Supabase, große Dateien bei R2, die Domain zeigt nur den Weg; was "
          "online geht, entscheidet ein Mensch.")

d.bullets("Fun Facts: hinter den Kulissen", [
    ("**Git** schrieb Linus Torvalds 2005 für den Linux-Kern — in wenigen Tagen", 0),
    ("Die vier Adressen **185.199.108–111.153** teilen sich alle GitHub-Pages-Seiten mit eigener Domain", 0),
    ("**PostgreSQL**, das Herz von Supabase, begann 1986 an der Uni Berkeley", 0),
    ("Der Name **R2** spielt auf Amazons Speicher **S3** an: je ein Zeichen davor", 0),
    ("Vom Push bis online: **50 bis 117 Sekunden** (die letzten acht Läufe)", 0),
])
d.summary("Fun Facts: Git 2005 von Linus Torvalds; 185.199.108-111.153 für alle GitHub-Pages-Seiten mit eigener "
          "Domain; PostgreSQL seit 1986 (Berkeley); R2 spielt auf S3 an; Push bis online 50 bis 117 Sekunden.")

d.bullets("Eure Aufgabe: deine eigene Website", [
    ("Erstelle einen **Plan für deine eigene Website** — mit KI und diesem Deck", 0),
    ("Ideal: eine **eigene Domain** (z. B. musterfrau.de) und ein **GitHub-Konto** — finde heraus, wie das geht "
     "und was es kostet", 0),
    ("Empfehlung: **Claude Code** und/oder **Copilot** (in eurem Microsoft-365-Zugang dabei)", 0),
    ("Für Fortgeschrittene: Soll deine Seite etwas **speichern**? Dann brauchst du so etwas wie Supabase", 0),
    ("Und immer: **nie ein Schlüssel oder Passwort ins Repo**", 0),
])
d.summary("Aufgabe: Plan für die eigene Website mit KI und diesem Deck; ideal eigene Domain und GitHub-Konto (wie, "
          "was kostet es?); Claude Code und/oder Copilot (Microsoft 365); Fortgeschrittene: Speichern braucht so etwas "
          "wie Supabase; nie Schlüssel oder Passwörter ins Repo.")

d.save()
