# videopipeline — Lab-Demos mit Solita als Sprecherin

Vollautomatische Demo-Videos der Labs: Headless-Browser filmt, Solita spricht,
D-ID animiert ihr Gesicht, ffmpeg schneidet. Kein Mikro, keine Kamera, kein Schnittprogramm.

## Zutaten
- **Playwright + Chromium** (`npm i playwright`, Browser via `npx playwright install chromium`)
- **ffmpeg/ffprobe** (Homebrew)
- **Solita-Stimme**: Google Cloud TTS über die Supabase-Edge-Fn `tts` (de-DE-Studio-C).
  Die Function ist seit 23.08.2026 nicht mehr offen (`supabase/functions/_shared/guard.ts`):
  Aufrufe brauchen entweder einen Origin von docalvers.de oder den publishable Key — `lib/tts.mjs`
  schickt ihn ohnehin schon mit. Pro Anfrage max. 5000 Zeichen.
- **Solita-Gesicht**: D-ID (Lite-Abo). API-Key liegt in `~/.config/did/api_key` — NIE ins Repo (Regel 18)!
- Solita-Portrait: `HTML/resources/team/team_02.png`

## Wo die Arbeit liegt
`lib/paths.mjs` hält die Pfade zentral: Rohmaterial in `~/Movies/videopipeline/<projekt>`
(`OUT=/anderer/ordner node svp/run1.mjs` übersteuert), Portrait und Musik relativ zum Repo,
fertige Filme zusätzlich in `videopipeline/videos/` (gitignored).
Vorher stand in jedem Skript ein Session-Scratchpad-Pfad — der ist nach der Session weg, die
Skripte waren damit nicht wiederholbar.

## Drehbuch — so machen wir das immer

Verbindlich seit dem Kovarianz-Film (29.08.2026). Vorlage:
`HTML/drehbuch/kovarianz.html`.

**Erst der Plot, dann die Worte — in zwei getrennten Runden.** Doc liest den Plot
zuerst und gibt ihn frei; Solitas Sätze entstehen danach. Nie beides auf einmal
liefern.

**Runde 1 — der Plot ist eine HTML-Seite,** kein Markdown: `HTML/drehbuch/<lab>.html`.
Dort, weil `serve.py` nur `HTML/` ausliefert — nur so ist das Drehbuch unter
`http://localhost:8765/drehbuch/<lab>.html` erreichbar und wird wie jedes Lab
hart neu geladen. Sie enthält:

- **Die Leitidee in einem Satz.** Der ganze Film ist die Antwort auf genau eine Frage.
- **Der dramaturgische Bogen** als Kette von Stationen (aufbauen → umdrehen → brechen).
  Kaputtmachen gehört ans Ende und ist der lehrreichste Teil.
- **Didaktische Leitplanken**, bindend für den späteren Sprechertext: nie eine Formel
  ohne vorher gezeigtes Bild, ein neuer Begriff pro Szene, verbotene Vokabeln
  benennen, nichts behaupten, was das Bild nicht hergibt.
- **Szenentabelle** mit vier Spalten: Nummer · was im Bild passiert · **der Aha** ·
  Sekunden. Der Aha ist der Kern — er ist noch nicht Solitas Wortlaut, sondern der
  Gedanke, der an dieser Stelle fallen soll.
- **★ Kernszene** (wird nicht gekürzt) und **⚠︎ Notbremse** (Kürzungskandidat)
  markieren. Das sind Entscheidungshilfen für den Schnitt, keine Deko.
- **Zeitbudget** ehrlich ausrechnen und die Musikbett-Länge dagegenhalten.
- **Choreografie-Notizen**: Startzustand, `localStorage` löschen, Nachlaufzeiten,
  welche Szene maus- oder timing-kritisch ist.
- **Bewusst weggelassen** — was ein Teil 2 könnte.

**Runde 2 — dieselbe Seite wird als Artifact veröffentlicht,** zum Lesen und Teilen.
Die Datei im Repo ist die Quelle; für das Artifact fallen `<!doctype>`, `<head>`,
`<body>` und der eigene Reset weg, weil der Host sie selbst mitbringt. Immer im
Look des Labs, nicht in einem Fremddesign:

- Schriften und Farben aus dem Lab selbst übernehmen (Orbitron + Outfit, dunkelblauer
  Grund, die Akzentfarben, die im Lab schon Bedeutung tragen).
- **Der Hero ist das Sujet, nicht Dekoration** — ein kleiner, ruhiger Canvas, der das
  zeigt, worum der Film geht, und zwar echt gerechnet, nicht gemalt.
- Szenen als Karten mit zwei Spalten (Bild | Aha), nicht als Tabelle — 14 Zeilen mal
  fünf Spalten sind auf keinem Schirm lesbar.
- **Zeitleiste**, in der jede Szene so breit ist, wie sie lang ist. Damit sieht man
  das Gewicht der Szenen, statt es aus Zahlen zu addieren.
- Szenenliste als **eine** Datenquelle im Skript, aus der Karten und Zeitleiste
  gerendert werden.
- **Schrift eher zu groß als zu klein.** Auch die Orbitron-Kleinlabels.
- **Statusfarben satt**, nicht als gedämpfter Wash — die echte Palettenfarbe als
  Fläche, mit dunkler Schrift darauf.

**Runde 3 — Solitas Text kommt in dieselbe Seite,** aber **generiert, nicht kopiert**:
`sync-drehbuch.mjs` liest `narration.mjs` und schreibt den Block zwischen den
Markern `SAY:START` / `SAY:END`. Damit bleibt `narration.mjs` die einzige Quelle
für den Wortlaut. Die SSML-Pausen werden dabei als sichtbare Marken gerendert —
sie sind Regieanweisungen, in denen run2 die Aktion ausführt, kein Füllmaterial.
Nach jeder Textänderung neu laufen lassen.
- **Schrift eher zu groß als zu klein.** Auch die Orbitron-Kleinlabels — bei der
  ersten Fassung kam zweimal „größer".

## Ablauf (siehe worldclock/demo.mjs als Vorlage)
1. **Drehbuch** nach dem Abschnitt oben: erst der Plot
   (`HTML/drehbuch/<lab>.html` + Artifact, Freigabe abwarten), dann die
   Sprechertexte in `narration.mjs` — eigene Datei, damit man neu vertonen kann,
   ohne Aufnahme und Schnitt anzufassen.
2. **TTS** (`lib/tts.mjs`): Texte → `sN.mp3`, Dauern bestimmen die Szenenlängen.
   Aussprache über SSML steuern: `<say-as interpret-as="characters">ISS</say-as>`.
3. **Inhaltlicher Vorab-Check — das Wichtigste.** Vor dem Dreh **jede Aussage
   Solitas gegen das Lab prüfen**, nicht nur die Technik. Doc ist nicht in der
   Materie und kann fachliche Feinheiten nicht gegenprüfen — **das ist Aufgabe des
   Agenten**, und zwar VOR der Aufnahme.
   - **Jede genannte Zahl nachrechnen.** Stimmt sie exakt, oder nur ungefähr?
     Beispiel Kovarianz: „Sigma x y ist null" — bei 4000 Zufallspunkten steht dort
     −11, weil der Standardfehler ±40 beträgt. Kein Bug, aber der Satz muss
     „praktisch null" heißen oder die Punktzahl hoch.
   - **Stichprobenrauschen mitdenken:** Varianzen streuen mit σ²·√(2/n),
     Kovarianzen mit σxσy/√n, ρ mit 1/√n. Was Solita als „gleich" oder „null"
     bezeichnet, muss innerhalb dieser Schranken liegen — sonst umformulieren.
   - **Jede Behauptung messbar belegen**, im Probelauf ausgeben lassen
     (run2 tut das für ρ, det und die Hauptachsen).
   - **Rundung und Anzeige prüfen:** Was im Panel steht, muss zu dem passen, was
     gesagt wird — inklusive Vorzeichen und Nachkommastellen.
   - **Sichtbarkeit:** Ist das, worüber geredet wird, im Bild und erkennbar?
   **Warum so streng:** Ein Dreh kostet Studio-Kontingent (HTTP 429 nach ~2 Vollläufen),
   7 Minuten Aufnahme pro Versuch und D-ID-Credits. Jeder Fehler, der erst im
   fertigen Film auffällt, kostet das alles noch einmal.

4. **Probelauf zuerst** (`VP_CHECK=1 VP_SPEED=6 node <projekt>/run2.mjs`): dieselbe
   Choreografie, aber **ohne Aufnahme** — `record:false` in `lib/record-cdp.mjs`
   überspringt den Screencast. Prüft in Sekunden, was sonst erst im fertigen Schnitt
   auffällt: fehlende Selektoren, falsche Zeitpunkte und vor allem die **Bildkontrolle**
   aus `lib/framecheck.mjs` — sie liest direkt aus dem Canvas, wie viel Farbe den
   Bildrand berührt (läuft etwas hinaus?) und wie viel überhaupt zu sehen ist (ist das
   Motiv aus dem Bild gewandert?). Erst wenn der Probelauf sauber ist, wird aufgenommen.
   **Warum:** Beim Kovarianz-Film fiel erst an Frames aus dem fertigen Schnitt auf, dass
   die Ellipse in zwei Szenen aus dem Bild lief — jeder Versuch kostete sieben Minuten
   Aufnahme. Die Antwort steckte die ganze Zeit in den Pixeln.
5. **Aufnahme** (`lib/record.mjs`): pro Szene ein frischer Browser-Context → `sN.webm`
   + `sN.json` mit Zeitmarken (mark()). Fallen:
   - Auto-Hide-UI: nach ~5 s Idle blenden viele Labs aus → `jiggle()` alle 3 s.
   - Vom Draw-Loop positionierte Inputs sind für Playwright nie „stable" →
     per `evaluate(() => el.focus())` fokussieren statt klicken.
   - Top-level `let/const` der Lab-Skripte sind per `page.evaluate` unter bloßem
     Namen erreichbar (Kamera steuern, Zustand lesen — siehe ISS-Zoom in worldclock).
6. **Schnitt** (`lib/assemble.mjs` → `buildScenes`): pro Szene Segmente aus dem
   Roh-webm + Audio bei +0,5 s. Schnittfenster anhand der Zeitmarken wählen und
   mit Frame-Extraktion prüfen (`ffmpeg -ss T -i sN.webm -frames:v 1 x.png`).
7. **Sprecherspur** (`lib/assemble.mjs` → `mixNarration`): alle Szenen-MP3s an ihrer Position im
   fertigen Schnitt zu EINER `fullnarration.mp3` — daraus entsteht ein einziger D-ID-Clip, damit
   Solitas Mund über das ganze Video synchron bleibt (statt pro Szene neu anzusetzen).
8. **Solita-Bubble** (`lib/did.mjs` → `makeTalks`): Portrait + Szenen-MP3s → sprechende
   Clips; `compose` legt sie als runden Bubble unten rechts mit Ein-/Ausblendung
   über das Video (typisch: Intro, Highlight, Outro — 1 Credit ≈ 15 s Talk).

## Musikbett
`HTML/resources/Infinity_6min.m4a` besteht aus zwei Teilen mit verschiedenem Stil;
die Grenze liegt bei **181,845 s** (der Energieanteil über 13 kHz fällt dort von
3–5 % auf 0,1 %). **Teil 1 ist nahtlos loopbar:** loopStart **21,220 s**, loopEnd
**163,998 s** — exakt 64 Takte bei 107,58 BPM. Mit 50 ms Crossfade am Ende liegt der
Sprung an der Naht im 96. Perzentil der normalen Sample-Schritte, ist also unhörbar.
Das Bett lässt sich damit auf **jede** Filmlänge rendern; die 360 s der Originaldatei
sind keine Obergrenze mehr. Das Intro (0–21,220 s) fadet ein und gehört nur an den
Anfang, nie in den Loop.

## Ergebnis
`weltzeituhr-demo.mp4` — 1280×720, 25 fps, H.264+AAC, YouTube-tauglich.
