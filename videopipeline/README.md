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

## Ablauf (siehe worldclock/demo.mjs als Vorlage)
1. **Drehbuch** schreiben: Szenen mit Bild-Idee + Sprechertext (~8 Szenen ≈ 2 min).
2. **TTS** (`lib/tts.mjs`): Texte → `sN.mp3`, Dauern bestimmen die Szenenlängen.
   Aussprache über SSML steuern: `<say-as interpret-as="characters">ISS</say-as>`.
3. **Aufnahme** (`lib/record.mjs`): pro Szene ein frischer Browser-Context → `sN.webm`
   + `sN.json` mit Zeitmarken (mark()). Fallen:
   - Auto-Hide-UI: nach ~5 s Idle blenden viele Labs aus → `jiggle()` alle 3 s.
   - Vom Draw-Loop positionierte Inputs sind für Playwright nie „stable" →
     per `evaluate(() => el.focus())` fokussieren statt klicken.
   - Top-level `let/const` der Lab-Skripte sind per `page.evaluate` unter bloßem
     Namen erreichbar (Kamera steuern, Zustand lesen — siehe ISS-Zoom in worldclock).
4. **Schnitt** (`lib/assemble.mjs` → `buildScenes`): pro Szene Segmente aus dem
   Roh-webm + Audio bei +0,5 s. Schnittfenster anhand der Zeitmarken wählen und
   mit Frame-Extraktion prüfen (`ffmpeg -ss T -i sN.webm -frames:v 1 x.png`).
5. **Sprecherspur** (`lib/assemble.mjs` → `mixNarration`): alle Szenen-MP3s an ihrer Position im
   fertigen Schnitt zu EINER `fullnarration.mp3` — daraus entsteht ein einziger D-ID-Clip, damit
   Solitas Mund über das ganze Video synchron bleibt (statt pro Szene neu anzusetzen).
6. **Solita-Bubble** (`lib/did.mjs` → `makeTalks`): Portrait + Szenen-MP3s → sprechende
   Clips; `compose` legt sie als runden Bubble unten rechts mit Ein-/Ausblendung
   über das Video (typisch: Intro, Highlight, Outro — 1 Credit ≈ 15 s Talk).

## Ergebnis
`weltzeituhr-demo.mp4` — 1280×720, 25 fps, H.264+AAC, YouTube-tauglich.
