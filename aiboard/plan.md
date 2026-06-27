# AI Board — Masterplan

> Ziel: eine Android-Tastatur, die deutlich intelligenter ist als alles, was es
> gibt (inkl. Gboard). Der Unterschied ist **nicht** das Tasten-Zeichnen — das ist
> gelöst — sondern das **Gehirn**: ein echtes Sprachmodell statt eines winzigen
> n-gram-Modells.

## Getroffene Entscheidungen

| Frage | Entscheidung |
|-------|--------------|
| Wo rechnet die KI? | **Hybrid** — On-Device-Sofortschicht + Cloud-LLM bei Pause |
| Tastatur-Basis | **Open-Source forken** (FlorisBoard, Kotlin/Compose, Apache-2.0) |
| Cloud-Modell | **Gemini Flash** für Phrasen bei Pause; **Claude** optional fürs „Umschreiben/Ton" |
| Form | eigene native App (IME), eigenes Repo/Verzeichnis, eigene APK |

## Warum das Gboard begräbt

- **Ganze Phrasen** statt nächstem Statistik-Wort
  („Ich melde mich" → „… sobald ich mehr weiß.").
- Liest den **Kontext** im Eingabefeld mit — versteht, worum es im Gespräch geht.
- **Ton-Umschalter**: derselbe Satz formell / locker / kurz, auf Knopfdruck.
- **DE/EN-Mischmasch** im selben Satz ist egal — das LLM kapiert es.
- **Satz-Smartcorrect**: korrigiert ganze Sätze grammatikalisch, nicht nur Tippfehler.

## Architektur in einem Satz

FlorisBoard liefert die Tastatur; eine **Sofortschicht** auf dem Gerät füllt bei
jedem Anschlag Wörter; bei einer kurzen **Tipp-Pause** geht der Kontext (gefiltert)
an eine **Supabase-Edge-Fn → Gemini Flash** und kommt als Phrasen-Vorschläge zurück;
ein **Datenschutz-Gate** entscheidet, ob überhaupt etwas das Gerät verlassen darf.

Details: siehe `docs/architektur.md`.

## Die vier Schichten (Kurzfassung)

1. **Basis** — FlorisBoard-Fork. Tippt vom ersten Tag normal (Layouts, Wischen, Themes).
2. **On-Device-Sofortschicht** — persönliches Wörterbuch + n-gram, lokal, lernt
   deine Wörter, null Latenz, kein Netz.
3. **Cloud-Gehirn** — bei Pause (~400 ms Debounce) Kontext → Edge-Fn → Gemini Flash →
   ganze Phrasen im Vorschlags-Streifen. „Umschreiben/Ton" optional über Claude.
4. **Datenschutz-Gate** — Passwort-/PIN-/Nummern-Felder gehen nie raus (das IME kennt
   den Feldtyp), Cloud nur bei Pause, harter „KI aus"-Schalter → rein lokal, server-
   seitig nichts gespeichert/geloggt.

## Phasen (damit schnell etwas läuft)

### P0 — Skelett (Toolchain beweisen)
- FlorisBoard forken, lokal bauen, als APK aufs Pixel, als Tastatur aktivieren.
- Tippt ganz normal. Kein KI-Code. **Beweist die Build-Kette.**
- Ergebnis: eine eigene Tastatur auf dem Gerät, umbenannt zu „AI Board".
- Schritte: `docs/floris-fork.md`.

### P1 — Cloud-Gehirn dran (der Wow-Moment)
- Neue Edge-Fn `keyboard` (oder bestehende `gemini` wiederverwenden).
- Bei Tipp-Pause: Kontext vor dem Cursor (via `InputConnection`) → Edge-Fn → Phrasen.
- Vorschläge in den Streifen rendern; Tap fügt die ganze Phrase ein.
- **Hier sieht man zum ersten Mal, dass es Gboard schlägt.**

### P2 — On-Device-Lernen + Datenschutz-Gate
- Persönliches Wörterbuch (lokal), Instant-Kandidaten bei jedem Anschlag.
- Datenschutz-Gate scharf schalten: Feldtyp-Filter, „KI aus"-Toggle, kein Server-Log.

### P3 — Ton/Umschreiben + Politur
- „Umschreiben"-Knopf (formell / locker / kurz) über Claude.
- Themes in Doc-Farben (λ Orange, Υ Rot, φ Grün), Schrift Orbitron.
- Feintuning Debounce, Caching, Offline-Verhalten, Akku.

## Offene Punkte (später entscheiden, blockieren P0 nicht)

- Genauer Debounce-Wert + wie viel Kontext (Sätze vor dem Cursor) wir senden.
- Caching identischer Kontexte, um Cloud-Aufrufe zu sparen.
- On-Device-Modell als Option für die Sofortschicht (z. B. Gemma via MediaPipe)
  statt reinem n-gram — erst messen, ob nötig.
- Eigenes Repo vs. Unterordner hier: aktuell als Unterordner `aiboard/` vorbereitet;
  beim ersten echten Floris-Fork ggf. in eigenes Repo umziehen.

## Lizenz-Hinweis

FlorisBoard ist Apache-2.0 → forken/abändern/eigene App erlaubt, Lizenz-/Notice-
Dateien mitführen. Vor dem Veröffentlichen einer APK prüfen.
